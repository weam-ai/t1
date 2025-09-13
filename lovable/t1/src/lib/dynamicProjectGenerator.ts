import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface DynamicProjectFile {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: DynamicProjectFile[];
  path: string;
}

export interface DynamicGeneratedProject {
  id: string;
  name: string;
  description: string;
  framework: string;
  styling: string;
  projectType: string;
  folderStructure: DynamicProjectFile[];
  packageJson: any;
  readme: string;
  createdAt: string;
  prompt: string;
}

// Analyze the user prompt to determine project requirements
async function analyzePrompt(prompt: string): Promise<{
  projectType: string;
  framework: string;
  styling: string;
  features: string[];
  complexity: 'simple' | 'medium' | 'complex';
}> {
  if (!process.env.GEMINI_API_KEY) {
    // Fallback analysis without AI
    const lowerPrompt = prompt.toLowerCase();
    
    let projectType = 'web-app';
    if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('e-commerce') || lowerPrompt.includes('shop')) {
      projectType = 'ecommerce';
    } else if (lowerPrompt.includes('b2b') || lowerPrompt.includes('business')) {
      projectType = 'b2b';
    } else if (lowerPrompt.includes('saas') || lowerPrompt.includes('software')) {
      projectType = 'saas';
    } else if (lowerPrompt.includes('blog') || lowerPrompt.includes('content')) {
      projectType = 'blog';
    } else if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('admin')) {
      projectType = 'dashboard';
    } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal')) {
      projectType = 'portfolio';
    }

    let framework = 'nextjs';
    if (lowerPrompt.includes('react')) framework = 'react';
    if (lowerPrompt.includes('vue')) framework = 'vue';
    if (lowerPrompt.includes('angular')) framework = 'angular';

    let styling = 'tailwind';
    if (lowerPrompt.includes('css') || lowerPrompt.includes('scss')) styling = 'css';
    if (lowerPrompt.includes('styled')) styling = 'styled-components';

    return {
      projectType,
      framework,
      styling,
      features: [],
      complexity: 'medium'
    };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const systemPrompt = `Analyze the user's prompt and extract project requirements. Return a JSON object with:
    - projectType: the main type of project (ecommerce, b2b, saas, blog, dashboard, portfolio, web-app)
    - framework: the preferred framework (nextjs, react, vue, angular)
    - styling: the styling approach (tailwind, css, styled-components)
    - features: array of key features mentioned
    - complexity: simple, medium, or complex based on requirements

    User prompt: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    const analysis = JSON.parse(text || '{}');
    return analysis;
  } catch (error: any) {
    console.error('Error analyzing prompt:', error);
    
    // Check if it's a quota/rate limit error
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('Too Many Requests')) {
      console.log('API quota exceeded, using fallback analysis');
    }
    
    // Enhanced fallback analysis based on prompt content
    const lowerPrompt = prompt.toLowerCase();
    
    let projectType = 'web-app';
    if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('e-commerce') || lowerPrompt.includes('shop')) {
      projectType = 'ecommerce';
    } else if (lowerPrompt.includes('b2b') || lowerPrompt.includes('business')) {
      projectType = 'b2b';
    } else if (lowerPrompt.includes('saas') || lowerPrompt.includes('software')) {
      projectType = 'saas';
    } else if (lowerPrompt.includes('blog') || lowerPrompt.includes('content')) {
      projectType = 'blog';
    } else if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('admin')) {
      projectType = 'dashboard';
    } else if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('personal')) {
      projectType = 'portfolio';
    }

    let framework = 'nextjs';
    if (lowerPrompt.includes('react')) framework = 'react';
    if (lowerPrompt.includes('vue')) framework = 'vue';
    if (lowerPrompt.includes('angular')) framework = 'angular';

    let styling = 'tailwind';
    if (lowerPrompt.includes('css') || lowerPrompt.includes('scss')) styling = 'css';
    if (lowerPrompt.includes('styled')) styling = 'styled-components';
    if (lowerPrompt.includes('chakra')) styling = 'chakra';
    if (lowerPrompt.includes('material') || lowerPrompt.includes('mui')) styling = 'material-ui';

    return {
      projectType,
      framework,
      styling,
      features: [],
      complexity: 'medium'
    };
  }
}

// Generate dynamic folder structure based on project requirements
async function generateFolderStructure(
  projectType: string,
  framework: string,
  features: string[],
  complexity: string
): Promise<DynamicProjectFile[]> {
  if (!process.env.GEMINI_API_KEY) {
    // Fallback folder structure
    return getFallbackFolderStructure(projectType, framework, 'Tailwind CSS');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const systemPrompt = `Generate a complete folder structure for a ${projectType} project using ${framework}. 
    Consider the features: ${features.join(', ')} and complexity: ${complexity}.
    
    Return a JSON array of folder/file objects with this structure:
    [
      {
        "name": "filename",
        "type": "file" | "folder",
        "content": "file content if type is file",
        "children": [nested files/folders if type is folder],
        "path": "relative/path/to/file"
      }
    ]
    
    Include all necessary files for a complete, working project:
    - Configuration files (package.json, tsconfig.json, etc.)
    - Source code files with realistic, functional content
    - Component files with proper imports and exports
    - Styling files
    - Documentation (README.md)
    
    Make the content realistic and functional, not just placeholders.

    Create a ${projectType} project with ${framework} framework. Features needed: ${features.join(', ')}. Complexity: ${complexity}.`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();
    
    const folderStructure = JSON.parse(text || '[]');
    return folderStructure;
  } catch (error: any) {
    console.error('Error generating folder structure:', error);
    
    // Check if it's a quota/rate limit error
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('Too Many Requests')) {
      console.log('API quota exceeded, using fallback structure');
    }
    
    // Always fall back to local generation when API fails
    return getFallbackFolderStructure(projectType, framework, 'Tailwind CSS');
  }
}

// Fallback folder structure when AI is not available
function getFallbackFolderStructure(projectType: string, framework: string, styling: string = 'Tailwind CSS'): DynamicProjectFile[] {
  const packageJson = generatePackageJson(projectType, framework, styling);
  
  const baseStructure: DynamicProjectFile[] = [
    {
      name: 'package.json',
      type: 'file',
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2)
    },
    ...getConfigFiles(framework, styling),
    {
      name: 'src',
      type: 'folder',
      path: 'src',
      children: getSourceFiles(projectType, framework, styling)
    },
    {
      name: 'README.md',
      type: 'file',
      path: 'README.md',
      content: getReadmeContent(projectType, framework, styling)
    }
  ];

  return baseStructure;
}

// Generate configuration files based on framework and styling
function getConfigFiles(framework: string, styling: string): DynamicProjectFile[] {
  const configFiles: DynamicProjectFile[] = [];

  // Framework-specific config files
  switch (framework.toLowerCase()) {
    case 'next.js':
    case 'nextjs':
      configFiles.push({
        name: 'next.config.js',
        type: 'file',
        path: 'next.config.js',
        content: `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`
      });
      
      configFiles.push({
        name: 'tsconfig.json',
        type: 'file',
        path: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
      });
      break;

    case 'react':
      configFiles.push({
        name: 'vite.config.ts',
        type: 'file',
        path: 'vite.config.ts',
        content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})`
      });
      
      configFiles.push({
        name: 'tsconfig.json',
        type: 'file',
        path: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
      });
      
      configFiles.push({
        name: 'tsconfig.node.json',
        type: 'file',
        path: 'tsconfig.node.json',
        content: `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}`
      });
      break;

    case 'vue.js':
    case 'vue':
      configFiles.push({
        name: 'vite.config.ts',
        type: 'file',
        path: 'vite.config.ts',
        content: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
})`
      });
      break;
  }

  // Styling-specific config files
  switch (styling.toLowerCase()) {
    case 'tailwind css':
    case 'tailwind':
      configFiles.push({
        name: 'tailwind.config.js',
        type: 'file',
        path: 'tailwind.config.js',
        content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`
      });
      
      configFiles.push({
        name: 'postcss.config.js',
        type: 'file',
        path: 'postcss.config.js',
        content: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
      });
      break;
  }

  return configFiles;
}

// Generate source files based on project type, framework, and styling
function getSourceFiles(projectType: string, framework: string, styling: string): DynamicProjectFile[] {
  const sourceFiles: DynamicProjectFile[] = [];

  switch (framework.toLowerCase()) {
    case 'next.js':
    case 'nextjs':
      sourceFiles.push({
        name: 'app',
        type: 'folder',
        path: 'src/app',
        children: [
          {
            name: 'page.tsx',
            type: 'file',
            path: 'src/app/page.tsx',
            content: getMainPageContent(projectType, framework, styling)
          },
          {
            name: 'layout.tsx',
            type: 'file',
            path: 'src/app/layout.tsx',
            content: getLayoutContent(projectType, framework, styling)
          },
          {
            name: 'globals.css',
            type: 'file',
            path: 'src/app/globals.css',
            content: getGlobalStyles(styling)
          }
        ]
      });
      break;

    case 'react':
      sourceFiles.push({
        name: 'main.tsx',
        type: 'file',
        path: 'src/main.tsx',
        content: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
      });
      
      sourceFiles.push({
        name: 'App.tsx',
        type: 'file',
        path: 'src/App.tsx',
        content: getMainPageContent(projectType, framework, styling)
      });
      
      sourceFiles.push({
        name: 'index.css',
        type: 'file',
        path: 'src/index.css',
        content: getGlobalStyles(styling)
      });
      break;

    case 'vue.js':
    case 'vue':
      sourceFiles.push({
        name: 'main.ts',
        type: 'file',
        path: 'src/main.ts',
        content: `import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

createApp(App).mount('#app')`
      });
      
      sourceFiles.push({
        name: 'App.vue',
        type: 'file',
        path: 'src/App.vue',
        content: getVueAppContent(projectType, styling)
      });
      
      sourceFiles.push({
        name: 'style.css',
        type: 'file',
        path: 'src/style.css',
        content: getGlobalStyles(styling)
      });
      break;
  }

  // Add components folder
  sourceFiles.push({
    name: 'components',
    type: 'folder',
    path: 'src/components',
    children: [
      {
        name: 'Header.tsx',
        type: 'file',
        path: 'src/components/Header.tsx',
        content: getHeaderContent(projectType, framework, styling)
      }
    ]
  });

  return sourceFiles;
}

// Get layout content based on framework
function getLayoutContent(projectType: string, framework: string, styling: string): string {
  if (framework.toLowerCase() === 'next.js' || framework.toLowerCase() === 'nextjs') {
    return `import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project',
  description: 'A ${projectType} application built with Next.js',
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
}`;
  }
  return '';
}

// Get global styles based on styling choice
function getGlobalStyles(styling: string): string {
  switch (styling.toLowerCase()) {
    case 'tailwind css':
    case 'tailwind':
      return `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;

    case 'chakra ui':
    case 'chakra':
      return `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;

    default:
      return `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;
  }
}

// Get Vue app content
function getVueAppContent(projectType: string, styling: string): string {
  return `<template>
  <div id="app">
    <Header />
    <main>
      <h1>Welcome to Your ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project</h1>
      <p>This is a Vue.js application with ${styling} styling.</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
</script>

<style scoped>
#app {
  text-align: center;
  padding: 2rem;
}
</style>`;
}

function getMainPageContent(projectType: string, framework: string = 'Next.js', styling: string = 'Tailwind CSS'): string {
  switch (projectType) {
    case 'ecommerce':
      return `'use client';

import { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';

export default function Home() {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const products = [
    { id: 1, name: 'Premium Headphones', price: 299, rating: 4.5, image: '🎧' },
    { id: 2, name: 'Wireless Mouse', price: 49, rating: 4.2, image: '🖱️' },
    { id: 3, name: 'Mechanical Keyboard', price: 129, rating: 4.8, image: '⌨️' },
  ];

  const addToCart = (product: any) => {
    setCart([...cart, product]);
  };

  const toggleFavorite = (productId: number) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">E-Commerce Store</h1>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Heart className="w-6 h-6" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">{product.image}</div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={"w-4 h-4 " + (i < Math.floor(product.rating) ? 'fill-current text-yellow-400' : 'text-gray-300')}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-4">$\${product.price}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={"flex-1 py-2 px-4 rounded-lg font-medium transition-colors " + (favorites.includes(product.id) ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}
                  >
                    {favorites.includes(product.id) ? '❤️' : '🤍'}
                  </button>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}`;

    case 'b2b':
      return `'use client';

import { useState } from 'react';
import { Users, Building, TrendingUp, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const metrics = [
    { label: 'Total Clients', value: '1,247', icon: Users, change: '+12%' },
    { label: 'Revenue', value: '$2.4M', icon: TrendingUp, change: '+8%' },
    { label: 'Active Projects', value: '89', icon: Building, change: '+5%' },
    { label: 'Growth Rate', value: '23%', icon: BarChart3, change: '+3%' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">B2B Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                New Client
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Business Overview</h2>
          <p className="text-gray-600">Monitor your business performance and client relationships</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <metric.icon className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-green-600 font-medium">{metric.change}</span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">JD</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">New client onboarding completed</p>
                <p className="text-sm text-gray-600">Johnson & Associates - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">SM</span>
              </div>
              <div className="flex-1">
                <p className="font-medium">Project milestone achieved</p>
                <p className="text-sm text-gray-600">Smith Manufacturing - 4 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`;

    case 'web-app':
    default:
      return `'use client';

import { useState } from 'react';
import { Sparkles, Code, Palette } from 'lucide-react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            This is a dynamically generated ${projectType} application built with ${framework} and ${styling}.
          </p>
          
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto mb-8">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Feature 1</h3>
              <p className="text-gray-600">This is a sample feature description for your generated project.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Feature 2</h3>
              <p className="text-gray-600">Another feature that showcases the capabilities of your project.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Feature 3</h3>
              <p className="text-gray-600">A third feature to demonstrate the project structure.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}`;
  }
}

function getHeaderContent(projectType: string, framework: string = 'Next.js', styling: string = 'Tailwind CSS'): string {
  return `import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} App
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Features</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="block px-3 py-2 text-gray-600 hover:text-gray-900">Contact</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}`;
}

// Generate package.json based on framework and styling selections
function generatePackageJson(projectType: string, framework: string, styling: string): any {
  const basePackage: any = {
    name: `${projectType.toLowerCase().replace(/\s+/g, '-')}-project`,
    version: '0.1.0',
    private: true,
    scripts: {},
    dependencies: {},
    devDependencies: {}
  };

  // Framework-specific configuration
  switch (framework.toLowerCase()) {
    case 'next.js':
    case 'nextjs':
      basePackage.scripts = {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      };
      basePackage.dependencies = {
        next: '14.0.4',
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      };
      basePackage.devDependencies = {
        '@types/node': '^20.10.5',
        '@types/react': '^18.2.45',
        '@types/react-dom': '^18.2.18',
        'eslint': '^8.56.0',
        'eslint-config-next': '14.0.4',
        'typescript': '^5.3.3'
      };
      break;

    case 'react':
      basePackage.scripts = {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0'
      };
      basePackage.dependencies = {
        react: '^18.2.0',
        'react-dom': '^18.2.0'
      };
      basePackage.devDependencies = {
        '@types/react': '^18.2.43',
        '@types/react-dom': '^18.2.17',
        '@typescript-eslint/eslint-plugin': '^6.14.0',
        '@typescript-eslint/parser': '^6.14.0',
        '@vitejs/plugin-react': '^4.2.1',
        'eslint': '^8.55.0',
        'eslint-plugin-react-hooks': '^4.6.0',
        'eslint-plugin-react-refresh': '^0.4.5',
        'typescript': '^5.2.2',
        'vite': '^5.0.8'
      };
      break;

    case 'vue.js':
    case 'vue':
      basePackage.scripts = {
        dev: 'vite',
        build: 'vue-tsc && vite build',
        preview: 'vite preview'
      };
      basePackage.dependencies = {
        vue: '^3.3.8'
      };
      basePackage.devDependencies = {
        '@vitejs/plugin-vue': '^4.5.2',
        'typescript': '^5.2.2',
        'vite': '^5.0.8',
        'vue-tsc': '^1.8.25'
      };
      break;

    case 'angular':
      basePackage.scripts = {
        ng: 'ng',
        start: 'ng serve',
        build: 'ng build',
        watch: 'ng build --watch --configuration development',
        test: 'ng test'
      };
      basePackage.dependencies = {
        '@angular/animations': '^17.0.0',
        '@angular/common': '^17.0.0',
        '@angular/compiler': '^17.0.0',
        '@angular/core': '^17.0.0',
        '@angular/forms': '^17.0.0',
        '@angular/platform-browser': '^17.0.0',
        '@angular/platform-browser-dynamic': '^17.0.0',
        '@angular/router': '^17.0.0',
        'rxjs': '~7.8.0',
        'tslib': '^2.3.0',
        'zone.js': '~0.14.0'
      };
      basePackage.devDependencies = {
        '@angular-devkit/build-angular': '^17.0.0',
        '@angular/cli': '^17.0.0',
        '@angular/compiler-cli': '^17.0.0',
        '@types/jasmine': '~5.1.0',
        'jasmine-core': '~5.1.0',
        'karma': '~6.4.0',
        'karma-chrome-launcher': '~3.2.0',
        'karma-coverage': '~2.2.0',
        'karma-jasmine': '~5.1.0',
        'karma-jasmine-html-reporter': '~2.1.0',
        'typescript': '~5.2.0'
      };
      break;
  }

  // Add styling-specific dependencies
  switch (styling.toLowerCase()) {
    case 'tailwind css':
    case 'tailwind':
      if (framework.toLowerCase() === 'next.js' || framework.toLowerCase() === 'nextjs') {
        basePackage.devDependencies['tailwindcss'] = '^3.4.0';
        basePackage.devDependencies['autoprefixer'] = '^10.4.16';
        basePackage.devDependencies['postcss'] = '^8.4.32';
      } else {
        basePackage.dependencies['tailwindcss'] = '^3.4.0';
        basePackage.devDependencies['autoprefixer'] = '^10.4.16';
        basePackage.devDependencies['postcss'] = '^8.4.32';
      }
      break;

    case 'css modules':
      // CSS Modules is built into most frameworks, no additional packages needed
      break;

    case 'styled components':
      basePackage.dependencies['styled-components'] = '^6.1.6';
      if (framework.toLowerCase() === 'next.js' || framework.toLowerCase() === 'nextjs') {
        basePackage.devDependencies['@types/styled-components'] = '^5.1.34';
      }
      break;

    case 'material-ui':
    case 'mui':
      basePackage.dependencies['@mui/material'] = '^5.15.0';
      basePackage.dependencies['@emotion/react'] = '^11.11.1';
      basePackage.dependencies['@emotion/styled'] = '^11.11.0';
      basePackage.dependencies['@mui/icons-material'] = '^5.15.0';
      break;

    case 'chakra ui':
    case 'chakra':
      basePackage.dependencies['@chakra-ui/react'] = '^2.8.2';
      basePackage.dependencies['@emotion/react'] = '^11.11.1';
      basePackage.dependencies['@emotion/styled'] = '^11.11.0';
      basePackage.dependencies['framer-motion'] = '^10.16.16';
      break;
  }

  // Add common utility packages
  basePackage.dependencies['lucide-react'] = '^0.294.0';
  
  // Add project-specific dependencies based on type
  switch (projectType.toLowerCase()) {
    case 'ecommerce':
      basePackage.dependencies['react-router-dom'] = '^6.20.1';
      basePackage.dependencies['axios'] = '^1.6.2';
      break;
    case 'b2b':
    case 'saas':
      basePackage.dependencies['recharts'] = '^2.8.0';
      basePackage.dependencies['date-fns'] = '^2.30.0';
      break;
    case 'blog':
      basePackage.dependencies['react-markdown'] = '^9.0.1';
      basePackage.dependencies['remark-gfm'] = '^4.0.0';
      break;
  }

  return basePackage;
}

function getReadmeContent(projectType: string, framework: string = 'Next.js', styling: string = 'Tailwind CSS'): string {
  const frameworkName = framework === 'Next.js' ? 'Next.js' : framework;
  const stylingName = styling === 'Tailwind CSS' ? 'Tailwind CSS' : styling;
  
  let devCommand = 'npm run dev';
  let installCommand = 'npm install';
  let port = '3000';
  
  switch (framework.toLowerCase()) {
    case 'react':
      devCommand = 'npm run dev';
      port = '5173';
      break;
    case 'vue.js':
    case 'vue':
      devCommand = 'npm run dev';
      port = '5173';
      break;
    case 'angular':
      devCommand = 'npm start';
      port = '4200';
      break;
  }

  return `# ${projectType.charAt(0).toUpperCase() + projectType.slice(1)} Project

This is a dynamically generated ${projectType} application built with ${frameworkName} and ${stylingName}.

## Features

- 🚀 Built with ${frameworkName}
- 🎨 Styled with ${stylingName}
- 📱 Responsive design
- ⚡ Fast and optimized
- 🔧 TypeScript support

## Getting Started

First, install the dependencies:

\`\`\`bash
${installCommand}
# or
yarn install
# or
pnpm install
\`\`\`

Then, run the development server:

\`\`\`bash
${devCommand}
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:${port}](http://localhost:${port}) with your browser to see the result.

## Project Structure

\`\`\`
src/
├── ${framework.toLowerCase() === 'next.js' || framework.toLowerCase() === 'nextjs' ? 'app/' : ''}
│   ${framework.toLowerCase() === 'next.js' || framework.toLowerCase() === 'nextjs' ? '├── page.tsx          # Main page component' : '├── App.tsx           # Main app component'}
│   ${framework.toLowerCase() === 'next.js' || framework.toLowerCase() === 'nextjs' ? '├── layout.tsx        # Root layout' : '├── main.tsx          # Entry point'}
│   ${framework.toLowerCase() === 'next.js' || framework.toLowerCase() === 'nextjs' ? '└── globals.css       # Global styles' : '└── index.css         # Global styles'}
├── components/
│   └── Header.tsx        # Header component
└── ...
\`\`\`

## Tech Stack

- **Framework**: ${frameworkName}
- **Styling**: ${stylingName}
- **Language**: TypeScript
- **Build Tool**: ${framework.toLowerCase() === 'next.js' || framework.toLowerCase() === 'nextjs' ? 'Next.js' : framework.toLowerCase() === 'react' ? 'Vite' : framework.toLowerCase() === 'vue.js' || framework.toLowerCase() === 'vue' ? 'Vite' : 'Angular CLI'}

## Learn More

To learn more about ${frameworkName}, take a look at the following resources:

${framework.toLowerCase() === 'next.js' || framework.toLowerCase() === 'nextjs' ? '- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.\n- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.' : framework.toLowerCase() === 'react' ? '- [React Documentation](https://react.dev) - learn about React features and API.\n- [Vite Documentation](https://vitejs.dev) - learn about Vite build tool.' : framework.toLowerCase() === 'vue.js' || framework.toLowerCase() === 'vue' ? '- [Vue.js Documentation](https://vuejs.org) - learn about Vue.js features and API.\n- [Vite Documentation](https://vitejs.dev) - learn about Vite build tool.' : '- [Angular Documentation](https://angular.io) - learn about Angular features and API.\n- [Angular CLI Documentation](https://angular.io/cli) - learn about Angular CLI.'}

## Deploy

${framework.toLowerCase() === 'next.js' || framework.toLowerCase() === 'nextjs' ? 'The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.\n\nCheck out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.' : 'You can deploy this application to various platforms like Vercel, Netlify, or your preferred hosting service.'}
`;
}

// Main function to generate dynamic project
export async function generateDynamicProject(
  prompt: string, 
  selectedFramework?: string, 
  selectedStyling?: string
): Promise<DynamicGeneratedProject> {
  try {
    // Analyze the prompt
    const analysis = await analyzePrompt(prompt);
    
    // Generate folder structure
    const folderStructure = await generateFolderStructure(
      analysis.projectType,
      selectedFramework || analysis.framework,
      analysis.features,
      analysis.complexity
    );

    // Generate package.json based on selections
    const packageJson = generatePackageJson(
      analysis.projectType, 
      selectedFramework || analysis.framework, 
      selectedStyling || analysis.styling
    );

    // Generate README
    const readme = getReadmeContent(analysis.projectType);

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: `${analysis.projectType.charAt(0).toUpperCase() + analysis.projectType.slice(1)} Project`,
      description: `A ${analysis.projectType} application generated from: "${prompt}"`,
      framework: analysis.framework,
      styling: analysis.styling,
      projectType: analysis.projectType,
      folderStructure,
      packageJson,
      readme,
      createdAt: new Date().toISOString(),
      prompt
    };
  } catch (error) {
    console.error('Error generating dynamic project:', error);
    
    // Fallback to local generation when API fails
    const fallbackProjectType = 'web-app';
    const fallbackFramework = selectedFramework || 'Next.js';
    const fallbackStyling = selectedStyling || 'Tailwind CSS';
    
    const folderStructure = getFallbackFolderStructure(fallbackProjectType, fallbackFramework, fallbackStyling);
    const packageJson = generatePackageJson(fallbackProjectType, fallbackFramework, fallbackStyling);
    const readme = getReadmeContent(fallbackProjectType, fallbackFramework, fallbackStyling);

    return {
      id: Math.random().toString(36).substr(2, 9),
      name: `${fallbackProjectType.charAt(0).toUpperCase() + fallbackProjectType.slice(1)} Project`,
      description: `A ${fallbackProjectType} application generated from: "${prompt}" (Generated locally due to API limitations)`,
      framework: fallbackFramework,
      styling: fallbackStyling,
      projectType: fallbackProjectType,
      folderStructure,
      packageJson,
      readme,
      createdAt: new Date().toISOString(),
      prompt
    };
  }
}
