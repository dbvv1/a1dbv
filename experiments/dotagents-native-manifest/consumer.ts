import { readFile, mkdir, writeFile, mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { parsePluginManifest, pluginManifestSchema } from './packages/dotagents-lib/src/plugins/schema.ts';
import { resolvePlugin } from './packages/dotagents-lib/src/plugins/resolver.ts';

const manifest = JSON.parse(await readFile('./consumer-manifest.json','utf8'));
const result: Record<string, unknown> = {};
try { const parsed = parsePluginManifest(manifest, '.cursor-plugin/plugin.json'); assert.deepEqual(parsed, manifest); result.realManifest = 'accepted-unchanged'; }
catch(e) { result.realManifest = String(e).replaceAll(process.cwd(), '<checkout>'); }
const root = await mkdtemp(join(process.cwd(), 'consumer-'));
const source = join(root, 'source');
await mkdir(join(source, '.cursor-plugin'), {recursive:true});
await writeFile(join(source, '.cursor-plugin/plugin.json'), JSON.stringify(manifest));
try {
 const resolved = await resolvePlugin({name:'shadcn',source:'path:source',path:'.'}, {stateDir:join(root,'state'),projectRoot:root});
 assert.equal(resolved.plugin.nativeSource, 'cursor');
 assert.deepEqual(resolved.plugin.manifest, manifest);
 assert.deepEqual(resolved.plugin.authoredNativeInterfaces?.cursor.manifest, manifest);
 result.realResolver = 'cursor-manifest-preserved';
} catch(e) { result.realResolver = String(e).replaceAll(root, '<fixture>'); }
result.relativePath = pluginManifestSchema.safeParse({name:'path-only',mcpServers:'./mcp.json'}).success;
result.mixedArray = pluginManifestSchema.safeParse({name:'mixed',mcpServers:['./mcp.json',manifest.mcpServers]}).success;
result.unsafePaths = ['../mcp.json','/mcp.json','https://example.com/mcp.json','C:\\mcp.json'].map(p => ({path:p,rejected:!pluginManifestSchema.safeParse({name:'unsafe',mcpServers:[p]}).success}));
console.log(JSON.stringify(result,null,2));
