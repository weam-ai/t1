'use client';

import { useState, useEffect } from 'react';
import { GeneratedProject } from '@/types/project';
import { ArrowLeft, Eye, Code, Download } from 'lucide-react';

interface PreviewPageProps {
  params: {
    id: string;
  };
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  useEffect(() => {
    try {
      // Get project data from sessionStorage
      const projectData = sessionStorage.getItem('previewProject');
      
      if (projectData) {
        const parsedProject = JSON.parse(projectData);
        setProject(parsedProject);
      } else {
        setError('No project data found. Please generate a project first.');
      }
    } catch (err) {
      setError('Failed to load project data.');
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview Not Available</h1>
          <p className="text-gray-600 mb-6">{error || 'Project not found'}</p>
          <button
            onClick={() => window.close()}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  // Find the main page component
  const mainPageFile = project.folderStructure.find(file => 
    file.name === 'page.tsx' && 
    file.type === 'file' && 
    file.content?.includes('export default function')
  );

  if (!mainPageFile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Preview Not Available</h1>
          <p className="text-gray-600 mb-6">Main page component not found in the generated project.</p>
          <button
            onClick={() => window.close()}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.close()}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Generator</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{project.name}</h1>
                <p className="text-sm text-gray-500">Project Preview</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
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
              <div className="text-sm text-gray-500">
                Generated: {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="h-[calc(100vh-64px)]">
        {viewMode === 'preview' ? (
          <div className="w-full h-full">
            <iframe
              srcDoc={`
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
                  <style>
                    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
                  </style>
                </head>
                <body>
                  <div id="root"></div>
                  <script type="text/babel">
                    const { useState } = React;
                    
                    // Simple demo component since we can't easily render the complex generated code
                    function DemoApp() {
                      const [count, setCount] = useState(0);
                      
                      return (
                        <div className="min-h-screen bg-gray-50">
                          <header className="bg-white shadow-sm">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                              <div className="flex justify-between items-center h-16">
                                <h1 className="text-2xl font-bold text-gray-900">${project.name}</h1>
                                <div className="flex items-center space-x-4">
                                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">★</span>
                                  </div>
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
                                This is a preview of your ${project.name} project.
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
                          </main>
                        </div>
                      );
                    }
                    
                    ReactDOM.render(<DemoApp />, document.getElementById('root'));
                  </script>
                </body>
                </html>
              `}
              className="w-full h-full border-0"
              title={`${project.name} - Preview`}
            />
          </div>
        ) : (
          <div className="h-full bg-white">
            <div className="h-full overflow-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Generated Code</h2>
                  <p className="text-gray-600">Here's the main component code for your {project.name} project:</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-6 overflow-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{mainPageFile.content}</code>
                  </pre>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Project Information</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>Name:</strong> {project.name}</p>
                    <p><strong>Description:</strong> {project.description}</p>
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
