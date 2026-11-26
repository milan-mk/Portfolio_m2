import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('⚔️  Starting Milan Kumar Modak Portfolio Fullstack Environment...\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';
const nodeCmd = isWin ? 'node.exe' : 'node';

// Start Backend
const backend = spawn(nodeCmd, ['Backend/server.js'], {
  cwd: __dirname,
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
});

backend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[36m[Backend]\x1b[0m ${data.toString()}`);
});

backend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[Backend Error]\x1b[0m ${data.toString()}`);
});

// Start Frontend
const frontend = spawn(npmCmd, ['--prefix', 'Frontend', 'run', 'dev'], {
  cwd: __dirname,
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true,
});

frontend.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[32m[Frontend]\x1b[0m ${data.toString()}`);
});

frontend.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[33m[Frontend Info]\x1b[0m ${data.toString()}`);
});

const cleanup = () => {
  console.log('\n🛑 Shutting down development processes...');
  backend.kill();
  frontend.kill();
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
