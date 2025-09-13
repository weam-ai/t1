import OpenAI from 'openai';
import {
  ProjectFile,
  GeneratedProject,
  ProjectGenerationRequest,
} from '@/types/project';
import { generateShareId } from './utils';

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export async function generateProject(
  request: ProjectGenerationRequest
): Promise<GeneratedProject> {
  if (!process.env.OPENAI_API_KEY) {
    return getDemoProject(request);
  }

  const prompt = createProjectPrompt(request);

  const completion = await openai!.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: `You are an expert full-stack developer. Generate a complete, working project based on the user's requirements. 
        Return a JSON object with the following structure:
        {
          "name": "Project Name",
          "description": "Brief description",
          "packageJson": {
            "name": "project-name",
            "version": "1.0.0",
            "dependencies": {...},
            "devDependencies": {...},
            "scripts": {...}
          },
          "files": [
            {
              "name": "filename.ext",
              "content": "file content",
              "type": "file",
              "language": "javascript|typescript|html|css|json"
            }
          ],
          "readme": "README content"
        }`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 4000,
    temperature: 0.7,
  });

  const result = completion.choices[0]?.message?.content;

  if (!result) {
    throw new Error('No response from AI');
  }

  try {
    const projectData = JSON.parse(result);
    return {
      id: generateShareId(),
      name: projectData.name || 'Generated Project',
      description: projectData.description || 'AI Generated Project',
      files: projectData.files || [],
      packageJson: projectData.packageJson,
      readme: projectData.readme,
      createdAt: new Date(),
    };
  } catch (error) {
    throw new Error('Failed to parse AI response');
  }
}

function createProjectPrompt(request: ProjectGenerationRequest): string {
  const { prompt, framework, features, styling } = request;

  let systemPrompt = `Create a complete, working ${framework || 'Next.js'} project based on this request: "${prompt}"\n\n`;

  if (features && features.length > 0) {
    systemPrompt += `Required features: ${features.join(', ')}\n\n`;
  }

  if (styling) {
    systemPrompt += `Styling: ${styling}\n\n`;
  }

  systemPrompt += `Requirements:
1. Generate a complete, working project structure
2. Include all necessary files (components, pages, styles, config files)
3. Make sure the code is production-ready and follows best practices
4. Include proper package.json with all dependencies
5. Add a comprehensive README with setup instructions
6. Use modern React patterns and hooks
7. Include proper TypeScript types if applicable
8. Make the code clean, well-commented, and maintainable

Generate the complete project structure as a JSON object.`;

  return systemPrompt;
}

function getDemoProject(request: ProjectGenerationRequest): GeneratedProject {
  const { prompt, framework = 'Next.js', styling = 'Tailwind CSS' } = request;

  // Analyze the prompt to determine project type
  const projectType = analyzePrompt(prompt);

  return generateDynamicProject(projectType, framework, styling, prompt);
}

function analyzePrompt(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();

  if (
    lowerPrompt.includes('ecommerce') ||
    lowerPrompt.includes('e-commerce') ||
    lowerPrompt.includes('shop') ||
    lowerPrompt.includes('store')
  ) {
    return 'ecommerce';
  } else if (
    lowerPrompt.includes('blog') ||
    lowerPrompt.includes('cms') ||
    lowerPrompt.includes('content')
  ) {
    return 'blog';
  } else if (
    lowerPrompt.includes('dashboard') ||
    lowerPrompt.includes('admin') ||
    lowerPrompt.includes('analytics')
  ) {
    return 'dashboard';
  } else if (
    lowerPrompt.includes('social') ||
    lowerPrompt.includes('chat') ||
    lowerPrompt.includes('messaging')
  ) {
    return 'social';
  } else if (
    lowerPrompt.includes('task') ||
    lowerPrompt.includes('todo') ||
    lowerPrompt.includes('project management')
  ) {
    return 'task-manager';
  } else if (
    lowerPrompt.includes('portfolio') ||
    lowerPrompt.includes('personal') ||
    lowerPrompt.includes('resume')
  ) {
    return 'portfolio';
  } else {
    return 'ecommerce'; // Default
  }
}

function generateDynamicProject(
  projectType: string,
  framework: string,
  styling: string,
  prompt: string
): GeneratedProject {
  const projectConfig = getProjectConfig(
    projectType,
    framework,
    styling,
    prompt
  );

  return {
    id: generateShareId(),
    name: projectConfig.name,
    description: projectConfig.description,
    packageJson: projectConfig.packageJson,
    files: [
      {
        name: 'package.json',
        content: JSON.stringify(projectConfig.packageJson, null, 2),
        type: 'file',
        language: 'json',
      },
      ...projectConfig.configFiles,
      ...projectConfig.sourceFiles,
      {
        name: 'README.md',
        content: projectConfig.readme,
        type: 'file',
        language: 'markdown',
      },
    ],
    readme: projectConfig.readme,
    createdAt: new Date(),
  };
}

function getProjectConfig(
  projectType: string,
  framework: string,
  styling: string,
  prompt: string
) {
  const configs = {
    ecommerce: {
      name: 'E-commerce Store',
      description:
        'A modern e-commerce website with product catalog and shopping cart',
      packageJson: {
        name: 'ecommerce-store',
        version: '1.0.0',
        dependencies: {
          next: '14.0.4',
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          tailwindcss: '^3.4.0',
          'lucide-react': '^0.294.0',
          '@types/node': '^20.10.5',
          '@types/react': '^18.2.45',
          '@types/react-dom': '^18.2.18',
          typescript: '^5.3.3',
        },
        devDependencies: {
          autoprefixer: '^10.4.16',
          postcss: '^8.4.32',
          eslint: '^8.56.0',
          'eslint-config-next': '14.0.4',
        },
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
        },
      },
      configFiles: [
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
          language: 'javascript',
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
          language: 'javascript',
        },
      ],
      sourceFiles: [
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
  title: 'E-commerce Store',
  description: 'Modern e-commerce website',
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
                  language: 'typescript',
                },
                {
                  name: 'page.tsx',
                  content: `'use client'

import { useState } from 'react'
import { ShoppingCart, Heart, Star } from 'lucide-react'

const products = [
  {
    id: 1,
    name: 'Premium Headphones',
    price: 299,
    image: '/api/placeholder/300/300',
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 79,
    image: '/api/placeholder/300/300',
    rating: 4.2,
    reviews: 89
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    price: 149,
    image: '/api/placeholder/300/300',
    rating: 4.8,
    reviews: 203
  }
]

export default function Home() {
  const [cart, setCart] = useState([])

  const addToCart = (product: any) => {
    setCart([...cart, product])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">E-commerce Store</h1>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Store</h2>
          <p className="text-xl mb-8">Discover amazing products at great prices</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Shop Now
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Featured Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Product Image</span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2">{product.name}</h4>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={"w-4 h-4 " + (i < Math.floor(product.rating) ? 'fill-current' : '')} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-4">${product.price}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}`,
                  type: 'file',
                  language: 'typescript',
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
                  language: 'css',
                },
              ],
            },
          ],
        },
      ],
      readme: `# E-commerce Store

A modern e-commerce website built with ${framework}, React, and ${styling}.

## Features

- 🛍️ Product catalog with ratings and reviews
- 🛒 Shopping cart functionality
- 💖 Wishlist feature
- 📱 Responsive design
- ⚡ Fast performance with ${framework}

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

- **Framework**: ${framework} 14
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
    },
    blog: {
      name: 'Blog Platform',
      description:
        'A modern blog platform with markdown support and content management',
      packageJson: {
        name: 'blog-platform',
        version: '1.0.0',
        dependencies: {
          next: '14.0.4',
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          tailwindcss: '^3.4.0',
          'lucide-react': '^0.294.0',
          'react-markdown': '^9.0.0',
          '@types/node': '^20.10.5',
          '@types/react': '^18.2.45',
          '@types/react-dom': '^18.2.18',
          typescript: '^5.3.3',
        },
        devDependencies: {
          autoprefixer: '^10.4.16',
          postcss: '^8.4.32',
          eslint: '^8.56.0',
          'eslint-config-next': '14.0.4',
        },
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
        },
      },
      configFiles: [
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
          language: 'javascript',
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
          language: 'javascript',
        },
      ],
      sourceFiles: [
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
  title: 'Blog Platform',
  description: 'Modern blog platform with markdown support',
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
                  language: 'typescript',
                },
                {
                  name: 'page.tsx',
                  content: `'use client'

import { useState } from 'react'
import { Calendar, User, Heart, MessageCircle } from 'lucide-react'

const posts = [
  {
    id: 1,
    title: 'Getting Started with Next.js 14',
    excerpt: 'Learn how to build modern web applications with Next.js 14 and the new App Router.',
    author: 'John Doe',
    date: '2024-01-15',
    readTime: '5 min read',
    likes: 24,
    comments: 8,
    image: '/api/placeholder/600/300'
  },
  {
    id: 2,
    title: 'The Future of Web Development',
    excerpt: 'Exploring upcoming trends and technologies that will shape the future of web development.',
    author: 'Jane Smith',
    date: '2024-01-12',
    readTime: '8 min read',
    likes: 42,
    comments: 15,
    image: '/api/placeholder/600/300'
  },
  {
    id: 3,
    title: 'Building Scalable React Applications',
    excerpt: 'Best practices and patterns for building large-scale React applications that can grow with your team.',
    author: 'Mike Johnson',
    date: '2024-01-10',
    readTime: '12 min read',
    likes: 67,
    comments: 23,
    image: '/api/placeholder/600/300'
  }
]

export default function Home() {
  const [likedPosts, setLikedPosts] = useState(new Set())

  const toggleLike = (postId: any) => {
    const newLiked = new Set(likedPosts)
    if (newLiked.has(postId)) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Blog Platform</h1>
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Write
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Our Blog</h2>
          <p className="text-xl mb-8">Discover insights, tutorials, and stories from our community</p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Reading
          </button>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Latest Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Blog Image</span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className={\`flex items-center space-x-1 \${likedPosts.has(post.id) ? 'text-red-500' : 'text-gray-500'} hover:text-red-500 transition-colors\`}
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                      </button>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Read More
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}`,
                  type: 'file',
                  language: 'typescript',
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
                  language: 'css',
                },
              ],
            },
          ],
        },
      ],
      readme: `# Blog Platform

A modern blog platform built with ${framework}, React, and ${styling}.

## Features

- 📝 Markdown support for writing posts
- 👥 Author profiles and bio pages
- 💬 Comment system
- ❤️ Like and share functionality
- 🔍 Search and filtering
- 📱 Responsive design

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

- **Framework**: ${framework} 14
- **Language**: TypeScript
- **Styling**: ${styling}
- **Markdown**: react-markdown

## License

MIT License`,
    },
  };

  // Return the appropriate config or default to ecommerce
  return configs[projectType] || configs.ecommerce;
}
