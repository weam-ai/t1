'use client';

import { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Download,
  Play,
  Loader2,
  FileText,
  Code,
  Palette,
  Eye,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { GeneratedProject, ProjectFile } from '@/types/project';
import CodeEditor from './CodeEditor';
import LivePreview from './LivePreview';
import { downloadProjectAsZip } from '@/lib/zipUtils';

export default function ProjectGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProject, setGeneratedProject] =
    useState<GeneratedProject | null>(null);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [framework, setFramework] = useState('Next.js');
  const [styling, setStyling] = useState('Tailwind CSS');
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

  const frameworks = [
    { id: 'Next.js', label: 'Next.js', icon: Code },
    { id: 'React', label: 'React', icon: Code },
    { id: 'Vue.js', label: 'Vue.js', icon: Code },
    { id: 'Angular', label: 'Angular', icon: Code },
  ];

  const stylingOptions = [
    { id: 'Tailwind CSS', label: 'Tailwind CSS' },
    { id: 'CSS Modules', label: 'CSS Modules' },
    { id: 'Styled Components', label: 'Styled Components' },
    { id: 'Material-UI', label: 'Material-UI' },
    { id: 'Chakra UI', label: 'Chakra UI' },
  ];

  const examplePrompts = [
    'Create a modern e-commerce website with product catalog, shopping cart, and user authentication',
    'Build a B2B SaaS dashboard for project management with team collaboration features',
    'Make a task management app with drag-and-drop functionality and team collaboration',
    'Create a blog platform with markdown support, comments, and admin panel',
    'Build a restaurant website with online ordering, menu management, and reservations',
    'Design a fitness tracking app with workout plans and progress charts',
    'Create a real estate website with property listings and search filters',
    'Build a learning management system for online courses with video streaming',
  ];

  const generateProject = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a project description');
      return;
    }

    setIsGenerating(true);
    setGeneratedProject(null);
    setSelectedFile(null);

    try {
      const response = await fetch('/api/generate-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          framework,
          styling,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedProject(result.project);
        toast.success('Project generated successfully!');
      } else {
        if (result.quotaExceeded) {
          toast.error('API quota exceeded. Using fallback project structure. Please try again later for AI-generated content.');
        } else {
          toast.error(result.error || 'Failed to generate project');
        }
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to connect to AI service. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadProject = async () => {
    if (!generatedProject) return;

    try {
      await downloadProjectAsZip(generatedProject.name, generatedProject.folderStructure);
      toast.success('Project downloaded as ZIP file!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download project');
    }
  };

  const previewProject = () => {
    if (!generatedProject) return;
    setViewMode('preview');
    toast.success('Switched to preview mode!');
  };

  const copyPrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            AI Project Generator
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Describe your project idea and let AI generate a complete, working
          application with live preview
        </p>
      </div>

      {!generatedProject ? (
        <div className="max-w-4xl mx-auto">
          {/* Project Configuration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Project Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Framework
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {frameworks.map((fw) => {
                    const Icon = fw.icon;
                    return (
                      <button
                        key={fw.id}
                        onClick={() => setFramework(fw.id)}
                        className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                          framework === fw.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{fw.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Styling
                </label>
                <select
                  value={styling}
                  onChange={(e) => setStyling(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {stylingOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Prompt Input */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Describe Your Project
            </h2>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Create a modern e-commerce website with product catalog, shopping cart, user authentication, and admin dashboard..."
              className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />

            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Example Prompts:
              </h3>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => copyPrompt(example)}
                    className="block w-full text-left p-3 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <button
              onClick={generateProject}
              disabled={isGenerating || !prompt.trim()}
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Project...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Project</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Project Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {generatedProject.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {generatedProject.description}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>
                    Generated: {new Date(generatedProject.createdAt).toLocaleDateString()}
                  </span>
                  <span>Files: {generatedProject.folderStructure.length}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setGeneratedProject(null);
                    setSelectedFile(null);
                    setPrompt('');
                    setViewMode('editor');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Generate New
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('editor')}
                    className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      viewMode === 'editor'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    <span>Editor</span>
                  </button>
                  <button
                    onClick={previewProject}
                    className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      viewMode === 'preview'
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Preview</span>
                  </button>
                </div>
                <button
                  onClick={downloadProject}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>

          {/* Code Editor or Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-96">
              {viewMode === 'editor' ? (
                <CodeEditor
                  files={generatedProject.folderStructure}
                  onFileSelect={setSelectedFile}
                  selectedFile={selectedFile}
                />
              ) : (
                <LivePreview project={generatedProject} />
              )}
            </div>
          </div>

          {/* Project Info */}
          {generatedProject.packageJson && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Setup
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Installation:
                </h4>
                <pre className="text-sm text-gray-700 bg-white p-3 rounded border">
                  <code>npm install</code>
                </pre>
                <h4 className="font-medium text-gray-900 mb-2 mt-4">
                  Development:
                </h4>
                <pre className="text-sm text-gray-700 bg-white p-3 rounded border">
                  <code>npm run dev</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
