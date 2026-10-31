import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import {
  DefaultResourceLoader,
  SettingsManager,
  formatSkillsForPrompt,
} from '@earendil-works/pi-coding-agent';

if (!process.argv[2] || !process.env.PI_CODING_AGENT_DIR) {
  process.stderr.write('Usage: set isolated HOME and PI_CODING_AGENT_DIR; node consumer_probe.mjs <temporary-git-project>\n');
  process.exit(2);
}
const cwd = resolve(process.argv[2]);
if (!existsSync(join(cwd, '.git'))) {
  process.stderr.write('The temporary project needs its own .git discovery boundary.\n');
  process.exit(2);
}
const agentDir = resolve(process.env.PI_CODING_AGENT_DIR);
const settingsManager = SettingsManager.create(cwd, agentDir, { projectTrusted: true });
const loader = new DefaultResourceLoader({
  cwd,
  agentDir,
  settingsManager,
  noExtensions: true,
  noThemes: true,
  noContextFiles: true,
  systemPrompt: '',
  appendSystemPrompt: [],
});
await loader.reload();
const skills = loader.getSkills();
const prompts = loader.getPrompts();
const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const relativePath = path => relative(cwd, path);
const result = {
  skills: skills.skills.map(s => ({ name: s.name, path: relativePath(s.filePath),
    sha256: digest(s.filePath), disableModelInvocation: s.disableModelInvocation })),
  skillDiagnostics: skills.diagnostics.map(d => ({ ...d,
    path: d.path && relativePath(d.path),
    collision: d.collision && { ...d.collision,
      winnerPath: relativePath(d.collision.winnerPath), loserPath: relativePath(d.collision.loserPath) } })),
  prompts: prompts.prompts.map(p => ({ name: p.name, path: relativePath(p.filePath), sha256: digest(p.filePath) })),
  promptDiagnostics: prompts.diagnostics,
  formattedSkillNames: [...formatSkillsForPrompt(skills.skills).matchAll(/<name>(.*?)<\/name>/g)].map(m => m[1]),
  settingsErrors: settingsManager.drainErrors(),
};
process.stdout.write(JSON.stringify(result, null, 2) + '\n');
