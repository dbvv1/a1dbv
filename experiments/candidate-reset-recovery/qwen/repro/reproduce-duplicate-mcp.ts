import { mcpToTool } from '@google/genai';
import { resolve } from 'node:path';
import { McpClient, getMCPServerLastError, getMCPServerStatus, connectAndDiscover } from '../../packages/core/src/tools/mcp-client.ts';
import { setDebugLogSession } from '../../packages/core/src/utils/debugLogger.ts';
setDebugLogSession({getSessionId: () => 'issue-15741-repro'});

const names = ['create', 'create', 'inspect'];
try {
  await mcpToTool({ listTools: async () => ({ tools: names.map(name => ({ name, inputSchema: { type: 'object', properties: {} } })) }) } as never).tool();
  console.log('GENAI unexpected success');
} catch (error) {
  console.log('GENAI', (error as Error).message);
}
const workspace = { getDirectories: () => [process.cwd()], onDirectoriesChanged: () => () => {} };
const registry = { registerTool() {}, removeMcpToolsByServer() {} };
const prompts = { registerPrompt() {}, removePromptsByServer() {} };
const config = { getResourceRegistry: () => ({ registerResource() {}, removeResourcesByServer() {} }), getMcpToolIdleTimeoutMs: () => 300000 };
for (const mode of ['duplicate', 'empty', 'unique']) {
  const serverName = `repro-${mode}`;
  const serverConfig = { command: process.execPath, args: [resolve('.qwen/scripts/duplicate-mcp-fixture.mjs'), mode], timeout: 5000 };
  const client = new McpClient(serverName, serverConfig as never, registry as never, prompts as never, workspace as never, false);
  try {
    await client.connect();
    const result = await client.discoverAndReturn(config as never);
    console.log('DISCOVER', mode, JSON.stringify({tools: result.tools.map(t => t.name), status: getMCPServerStatus(serverName)}));
  } catch (error) {
    console.log('DISCOVER', mode, JSON.stringify({message: (error as Error).message, lastError: getMCPServerLastError(serverName), status: getMCPServerStatus(serverName)}));
  } finally {
    await client.disconnect();
  }
}
await connectAndDiscover('repro-legacy-duplicate', { command: process.execPath, args: [resolve('.qwen/scripts/duplicate-mcp-fixture.mjs'), 'duplicate'], timeout: 5000 } as never, registry as never, prompts as never, true, workspace as never, config as never);
console.log('LEGACY', getMCPServerStatus('repro-legacy-duplicate'));
