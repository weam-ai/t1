'use client';

import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  FileText,
  Folder,
  ChevronRight,
  ChevronDown,
  Download,
  Copy,
} from 'lucide-react';
import { ProjectFile } from '@/types/project';
import { toast } from 'react-hot-toast';
import { downloadProjectAsZip } from '@/lib/zipUtils';

interface CodeEditorProps {
  files: ProjectFile[];
  onFileSelect?: (file: ProjectFile) => void;
  selectedFile?: ProjectFile | null;
}

export default function CodeEditor({
  files,
  onFileSelect,
  selectedFile,
}: CodeEditorProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [editorTheme, setEditorTheme] = useState<'light' | 'dark'>('light');

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const getLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'tsx':
      case 'ts':
        return 'typescript';
      case 'jsx':
      case 'js':
        return 'javascript';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'html':
        return 'html';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
      case 'c':
        return 'cpp';
      default:
        return 'plaintext';
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const downloadFile = (file: ProjectFile) => {
    const content = file.content || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const downloadProject = async () => {
    try {
      await downloadProjectAsZip('project', files);
      toast.success('Project downloaded as ZIP file!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download project');
    }
  };

  const renderFileTree = (files: ProjectFile[], level = 0) => {
    return files.map((file, index) => {
      const isExpanded = expandedFolders.has(file.name);
      const isSelected = selectedFile?.name === file.name;

      if (file.type === 'folder') {
        return (
          <div key={index} className="select-none">
            <div
              className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${
                level > 0 ? 'ml-4' : ''
              }`}
              onClick={() => toggleFolder(file.name)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 mr-1" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1" />
              )}
              <Folder className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm">{file.name}</span>
            </div>
            {isExpanded && file.children && (
              <div>{renderFileTree(file.children, level + 1)}</div>
            )}
          </div>
        );
      } else {
        return (
          <div
            key={index}
            className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer ${
              isSelected ? 'bg-blue-100' : ''
            } ${level > 0 ? 'ml-4' : ''}`}
            onClick={() => onFileSelect?.(file)}
          >
            <FileText className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm">{file.name}</span>
          </div>
        );
      }
    });
  };

  return (
    <div className="flex h-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* File Tree */}
      <div className="w-1/3 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Project Files</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  setEditorTheme(editorTheme === 'light' ? 'dark' : 'light')
                }
                className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                {editorTheme === 'light' ? '🌙' : '☀️'}
              </button>
              <button
                onClick={downloadProject}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                title="Download ZIP"
              >
                <Download className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">{renderFileTree(files)}</div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {getLanguage(selectedFile.name)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(selectedFile.content || '')}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => downloadFile(selectedFile)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Download file"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <Editor
                height="100%"
                language={getLanguage(selectedFile.name)}
                value={selectedFile.content}
                theme={editorTheme === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Select a file to view</p>
              <p className="text-sm">
                Choose a file from the project tree to see its contents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
