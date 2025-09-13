#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Hackathon App...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env.local from env.example');
    console.log(
      '📝 Please edit .env.local with your MongoDB connection string\n'
    );
  } else {
    console.log('⚠️  env.example not found, creating basic .env.local');
    const basicEnv = `# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon-app?retryWrites=true&w=majority

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
    fs.writeFileSync(envPath, basicEnv);
  }
} else {
  console.log('✅ .env.local already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully\n');
  } catch (error) {
    console.error('❌ Failed to install dependencies');
    console.error('Please run: npm install\n');
  }
} else {
  console.log('✅ Dependencies already installed\n');
}

console.log('🎉 Setup complete!');
console.log('\nNext steps:');
console.log('1. Edit .env.local with your MongoDB connection string');
console.log('2. Run: npm run dev');
console.log('3. Open: http://localhost:3000');
console.log('\nHappy coding! 🚀');
