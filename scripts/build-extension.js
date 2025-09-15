#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
const envPath = path.join(__dirname, '..', '.env');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      envVars[key.trim()] = value.trim();
    }
  });
}

// Default values if env file doesn't exist
const config = {
  SUPABASE_URL: envVars.VITE_SUPABASE_URL || envVars.SUPABASE_URL,
  SUPABASE_ANON_KEY: envVars.VITE_SUPABASE_ANON_KEY || envVars.SUPABASE_ANON_KEY,
  GEMINI_API_KEY: envVars.VITE_GEMINI_API_KEY || envVars.GEMINI_API_KEY,
  APP_NAME: "Daydream Movies"
};

// Generate config.js content
const configContent = `// Configuration for browser extension
// This file is auto-generated from environment variables

const CONFIG = ${JSON.stringify(config, null, 2)};

// Export for use in other extension files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
} else {
  window.ScrollMineConfig = CONFIG;
}`;

// Write config file
const configPath = path.join(__dirname, '..', 'extension', 'config.js');
fs.writeFileSync(configPath, configContent);

console.log('✅ Extension config updated with environment variables');
console.log('📁 Config written to:', configPath);
