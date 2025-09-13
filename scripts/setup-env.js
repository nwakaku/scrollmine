#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  process.exit(0);
}

if (!fs.existsSync(envExamplePath)) {
  console.error('❌ env.example file not found');
  process.exit(1);
}

// Copy env.example to .env
fs.copyFileSync(envExamplePath, envPath);
console.log('✅ Created .env file from env.example');
console.log('📝 Please update the values in .env with your actual API keys');
console.log('🔧 Run "npm run build:extension" to update extension config');
