import { ProjectFile, GeneratedProject, ProjectGenerationRequest } from '@/types/project';
import { generateShareId } from './utils';

export async function generateProject(request: ProjectGenerationRequest): Promise<GeneratedProject> {
  // For now, return a simple demo project without complex templates
  return getSimpleDemoProject(request);
}

function getSimpleDemoProject(request: ProjectGenerationRequest): GeneratedProject {
  const { prompt, framework = 'Next.js', styling = 'Tailwind CSS' } = request;
  
  return {
    id: generateShareId(),
    name: 'Demo Project',
    description: `A ${framework} project generated from: "${prompt}"`,
    packageJson: {
      name: 'demo-project',
      version: '1.0.0',
      dependencies: {
        'next': '14.0.4',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        'tailwindcss': '^3.4.0',
        'lucide-react': '^0.294.0',
        '@types/node': '^20.10.5',
        '@types/react': '^18.2.45',
        '@types/react-dom': '^18.2.18',
        'typescript': '^5.3.3'
      },
      devDependencies: {
        'autoprefixer': '^10.4.16',
        'postcss': '^8.4.32',
        'eslint': '^8.56.0',
        'eslint-config-next': '14.0.4'
      },
      scripts: {
        'dev': 'next dev',
        'build': 'next build',
        'start': 'next start',
        'lint': 'next lint'
      }
    },
    files: [
      {
        name: 'package.json',
        content: JSON.stringify({
          name: 'demo-project',
          version: '1.0.0',
          dependencies: {
            'next': '14.0.4',
            'react': '^18.2.0',
            'react-dom': '^18.2.0',
            'tailwindcss': '^3.4.0',
            'lucide-react': '^0.294.0'
          },
          devDependencies: {
            'typescript': '^5.3.3',
            '@types/node': '^20.10.5',
            '@types/react': '^18.2.45',
            '@types/react-dom': '^18.2.18'
          },
          scripts: {
            'dev': 'next dev',
            'build': 'next build',
            'start': 'next start',
            'lint': 'next lint'
          }
        }, null, 2),
        type: 'file',
        language: 'json'
      },
      {
        name: 'next.config.js',
        content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`,
        type: 'file',
        language: 'javascript'
      },
      {
        name: 'tailwind.config.js',
        content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
        type: 'file',
        language: 'javascript'
      },
      {
        name: 'src',
        type: 'folder',
        children: [
          {
            name: 'app',
            type: 'folder',
            children: [
              {
                name: 'layout.tsx',
                content: `import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Demo Project',
  description: 'A ${framework} project generated from your prompt',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}`,
                type: 'file',
                language: 'typescript'
              },
              {
                name: 'page.tsx',
                content: `'use client'

import { useState } from 'react'
import { Heart, Star, ShoppingCart } from 'lucide-react'

export default function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Demo Project</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Generated Project!
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            This is a ${framework} project generated from your prompt: "${prompt}"
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Interactive Demo</h3>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <button
                onClick={() => setCount(count - 1)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                -
              </button>
              <span className="text-2xl font-bold">{count}</span>
              <button
                onClick={() => setCount(count + 1)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                +
              </button>
            </div>
            <p className="text-gray-600">Click the buttons to interact!</p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Feature 1</h3>
              <p className="text-gray-600">This is a sample feature description for your generated project.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Feature 2</h3>
              <p className="text-gray-600">Another feature that showcases the capabilities of your project.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Feature 3</h3>
              <p className="text-gray-600">A third feature to demonstrate the project structure.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}`,
                type: 'file',
                language: 'typescript'
              },
              {
                name: 'globals.css',
                content: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`,
                type: 'file',
                language: 'css'
              }
            ]
          }
        ]
      },
      {
        name: 'README.md',
        content: `# Demo Project

A ${framework} project generated from your prompt: "${prompt}"

## Features

- 🚀 Built with ${framework}
- 🎨 Styled with ${styling}
- 📱 Responsive design
- ⚡ Fast performance
- 🔧 TypeScript support

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: ${framework}
- **Language**: TypeScript
- **Styling**: ${styling}
- **Icons**: Lucide React

## Project Structure

\`\`\`
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
└── lib/
\`\`\`

## License

MIT License`,
        type: 'file',
        language: 'markdown'
      }
    ],
    readme: `# Demo Project

A ${framework} project generated from your prompt: "${prompt}"

## Features

- 🚀 Built with ${framework}
- 🎨 Styled with ${styling}
- 📱 Responsive design
- ⚡ Fast performance
- 🔧 TypeScript support

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser.`,
    createdAt: new Date()
  };
}
