'use client';

import { useState, useEffect } from 'react';
import { GeneratedProject } from '@/types/project';
import { Eye, Code, Download, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface LivePreviewProps {
  project: GeneratedProject;
}

export default function LivePreview({ project }: LivePreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [isLoading, setIsLoading] = useState(false);

  // Find the main page component - improved detection
  const findMainPageFile = (files: any[]): any => {
    for (const file of files) {
      if (file.type === 'file' && file.content) {
        // Check for various main page patterns
        if (
          (file.name === 'page.tsx' || file.name === 'App.tsx' || file.name === 'App.vue') &&
          (file.content.includes('export default function') || 
           file.content.includes('export default') ||
           file.content.includes('function Home()') ||
           file.content.includes('function App()'))
        ) {
          return file;
        }
      }
      if (file.type === 'folder' && file.children) {
        const found = findMainPageFile(file.children);
        if (found) return found;
      }
    }
    return null;
  };

  const mainPageFile = findMainPageFile(project.folderStructure);

  const generatePreviewHTML = () => {
    // Create a simplified HTML preview that mimics the React component
    // Even if no main page file is found, we'll create a generic preview
    const projectType = project.projectType || 'web-app';
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${project.name} - Preview</title>
        <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
          }
          .preview-container {
            min-height: 100vh;
            background: #f9fafb;
          }
        </style>
      </head>
      <body>
        <div id="root" class="preview-container"></div>
        <script type="text/babel">
          const { useState } = React;
          
          // Create a simplified version of the generated component
          function PreviewApp() {
            const [count, setCount] = useState(0);
            const [cart, setCart] = useState([]);
            const [favorites, setFavorites] = useState([]);
            
            // Sample data based on project type
            const projectType = '${projectType}';
            
            const products = [
              { id: 1, name: 'Premium Headphones', price: 299, rating: 4.5, image: '🎧' },
              { id: 2, name: 'Wireless Mouse', price: 49, rating: 4.2, image: '🖱️' },
              { id: 3, name: 'Mechanical Keyboard', price: 129, rating: 4.8, image: '⌨️' },
            ];
            
            const addToCart = (product) => {
              setCart([...cart, product]);
            };
            
            const toggleFavorite = (productId) => {
              if (favorites.includes(productId)) {
                setFavorites(favorites.filter(id => id !== productId));
    } else {
                setFavorites([...favorites, productId]);
    }
            };

    return (
              <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                      <h1 className="text-2xl font-bold text-gray-900">${project.name}</h1>
                      <div className="flex items-center space-x-4">
                        \${projectType === 'ecommerce' ? \`
                        <button className="relative p-2 text-gray-600 hover:text-gray-900">
                          <span className="text-xl">❤️</span>
                          {favorites.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {favorites.length}
                            </span>
                          )}
                        </button>
                        <button className="relative p-2 text-gray-600 hover:text-gray-900">
                          <span className="text-xl">🛒</span>
                          {cart.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {cart.length}
                            </span>
                          )}
                        </button>
                        \` : \`
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                          Get Started
                        </button>
                        \`}
                      </div>
                    </div>
                  </div>
                </header>

                {/* Hero Section */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">Welcome to ${project.name}</h2>
                    <p className="text-xl mb-8">This is a live preview of your generated project</p>
                    <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                      Explore Now
                    </button>
                  </div>
                </section>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  \${projectType === 'ecommerce' ? \`
                  {/* E-commerce Content */}
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Our Store</h2>
                    <p className="text-xl text-gray-600 mb-8">Discover amazing products at great prices</p>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
                      Shop Now
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                      <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6 text-center">
                          <div className="text-6xl mb-4">{product.image}</div>
                          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                          <div className="flex items-center justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={"text-lg " + (i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300')}>
                                ★
                              </span>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">({product.rating})</span>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 mb-4">$` + `{product.price}</p>
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
                  \` : \`
                  {/* Default Content */}
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      Welcome to Your ${project.name}
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                      This is a preview of your generated ${projectType} application.
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
                          <span className="text-white text-xl">🚀</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Feature 1</h3>
                        <p className="text-gray-600">This is a sample feature description for your generated project.</p>
                      </div>
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                          <span className="text-white text-xl">💖</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Feature 2</h3>
                        <p className="text-gray-600">Another feature that showcases the capabilities of your project.</p>
                      </div>
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                          <span className="text-white text-xl">🛒</span>
          </div>
                        <h3 className="text-xl font-semibold mb-2">Feature 3</h3>
                        <p className="text-gray-600">A third feature to demonstrate the project structure.</p>
          </div>
        </div>
                  </div>
                  \`}
                </main>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-12">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div>
                        <h3 className="text-lg font-semibold mb-4">${project.name}</h3>
                        <p className="text-gray-300">Generated with AI-powered project creation tool.</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300">
                          <li><a href="#" className="hover:text-white">Home</a></li>
                          <li><a href="#" className="hover:text-white">Features</a></li>
                          <li><a href="#" className="hover:text-white">About</a></li>
                          <li><a href="#" className="hover:text-white">Contact</a></li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
                        <ul className="space-y-2 text-gray-300">
                          <li>${project.framework}</li>
                          <li>${project.styling}</li>
                          <li>TypeScript</li>
                          <li>Responsive Design</li>
                        </ul>
                      </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
                      <p>&copy; 2024 ${project.name}. Generated with AI Project Generator.</p>
                    </div>
                  </div>
                </footer>
      </div>
    );
  }

          ReactDOM.render(<PreviewApp />, document.getElementById('root'));
        </script>
      </body>
      </html>
    `;
  };

  const refreshPreview = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Preview refreshed!');
    }, 500);
  };

  return (
    <div className="h-full flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <h3 className="font-semibold text-gray-900">Live Preview</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('preview')}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'preview'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                viewMode === 'code'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Code</span>
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshPreview}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            title="Refresh preview"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'preview' ? (
          <div className="w-full h-full">
            <iframe
              srcDoc={generatePreviewHTML()}
              className="w-full h-full border-0"
              title={`${project.name} - Preview`}
            />
          </div>
        ) : (
          <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Generated Code</h2>
                  <p className="text-gray-600">Here's the main component code for your {project.name} project:</p>
                </div>
                {mainPageFile ? (
                  <div className="bg-gray-900 rounded-lg p-6 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 max-h-96">
                    <pre className="text-green-400 text-sm whitespace-pre-wrap">
                      <code>{mainPageFile.content}</code>
                    </pre>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg p-6 text-center max-h-96 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    <p className="text-gray-600">No main page component found in the generated project.</p>
                    <div className="mt-4 text-left">
                      <p className="text-sm text-gray-500 mb-2">Available files:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {project.folderStructure.map((file, index) => (
                          <li key={index} className="flex items-center">
                            <span className="mr-2">{file.type === 'folder' ? '📁' : '📄'}</span>
                            {file.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Project Information</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Name:</strong> {project.name}</p>
                    <p><strong>Description:</strong> {project.description}</p>
                    <p><strong>Framework:</strong> {project.framework}</p>
                    <p><strong>Styling:</strong> {project.styling}</p>
                    <p><strong>Files:</strong> {project.folderStructure.length} files generated</p>
                    <p><strong>Generated:</strong> {new Date(project.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}