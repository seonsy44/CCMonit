import { execSync } from 'node:child_process';

execSync('tsx apps/cli/src/main.ts monitor', { stdio: 'inherit' });
