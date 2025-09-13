'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Save,
  Link,
  Eye,
  EyeOff,
  Code,
  FileText,
  CheckSquare,
} from 'lucide-react';
import { Entry } from '@/types/entry';
import { toast } from 'react-hot-toast';
import LivePreview from './LivePreview';
import AIAssistant from './AIAssistant';

interface EntryEditorProps {
  entry: Entry;
  onUpdate: (id: string, updates: Partial<Entry>) => Promise<Entry | null>;
  getEntryIcon: (type: string) => React.ReactNode;
}

export default function EntryEditor({
  entry,
  onUpdate,
  getEntryIcon,
}: EntryEditorProps) {
  const [title, setTitle] = useState(entry.title);
  const [content, setContent] = useState(entry.content);
  const [type, setType] = useState(entry.type);
  const [language, setLanguage] = useState(entry.language || '');
  const [isPublic, setIsPublic] = useState(entry.isPublic);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  const handleSave = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      const updatedEntry = await onUpdate(entry.id, {
        title,
        content,
        type,
        language: language || undefined,
        isPublic,
      });

      if (updatedEntry) {
        setHasUnsavedChanges(false);
        lastSavedRef.current = JSON.stringify({
          title,
          content,
          type,
          language,
          isPublic,
        });
        toast.success('Entry saved');
      }
    } catch (error) {
      toast.error('Failed to save entry');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, onUpdate, entry.id, title, content, type, language, isPublic]);

  // Auto-save functionality
  useEffect(() => {
    const currentContent = JSON.stringify({
      title,
      content,
      type,
      language,
      isPublic,
    });

    if (
      currentContent !== lastSavedRef.current &&
      currentContent !==
        JSON.stringify({
          title: entry.title,
          content: entry.content,
          type: entry.type,
          language: entry.language || '',
          isPublic: entry.isPublic,
        })
    ) {
      setHasUnsavedChanges(true);

      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(async () => {
        await handleSave();
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, content, type, language, isPublic, entry, handleSave]);

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/share/${entry.shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy share link');
    }
  };

  const handleAISuggestion = (suggestion: string) => {
    setContent(suggestion);
  };

  const typeOptions = [
    { value: 'note', label: 'Note', icon: FileText },
    { value: 'code', label: 'Code', icon: Code },
    { value: 'task', label: 'Task', icon: CheckSquare },
  ];

  const languageOptions = [
    'javascript',
    'typescript',
    'python',
    'java',
    'html',
    'css',
    'json',
    'sql',
    'markdown',
    'yaml',
    'xml',
    'bash',
    'php',
    'go',
    'rust',
  ];

  return (
    <div className="card">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-gray-500">{getEntryIcon(type)}</div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0 p-0"
              placeholder="Untitled Entry"
            />
            {hasUnsavedChanges && (
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`btn-ghost px-3 py-2 flex items-center space-x-2 ${
                showPreview ? 'bg-primary-100 text-primary-700' : ''
              }`}
            >
              {showPreview ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              <span>{showPreview ? 'Hide' : 'Preview'}</span>
            </button>

            <button
              onClick={copyShareLink}
              className="btn-ghost px-3 py-2 flex items-center space-x-2"
            >
              <Link className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary px-4 py-2 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Entry type and settings */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Type:</label>
            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value as 'note' | 'code' | 'task')
              }
              className="input py-1 px-2 text-sm"
            >
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {type === 'code' && (
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Language:
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input py-1 px-2 text-sm"
              >
                <option value="">Auto-detect</option>
                {languageOptions.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-gray-700">Public</span>
            </label>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        <div className={`flex-1 ${showPreview ? 'w-1/2' : 'w-full'}`}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Start writing your ${type}...`}
            className={`textarea w-full h-96 resize-none border-0 rounded-none focus:ring-0 ${
              type === 'code' ? 'code-editor' : ''
            }`}
            style={{
              fontFamily:
                type === 'code' ? 'JetBrains Mono, monospace' : 'inherit',
            }}
          />
        </div>

        {showPreview && (
          <div className="w-1/2 border-l border-gray-200">
            <LivePreview content={content} type={type} language={language} />
          </div>
        )}
      </div>

      {/* AI Assistant */}
      <AIAssistant
        content={content}
        type={type}
        language={language}
        onApplySuggestion={handleAISuggestion}
      />
    </div>
  );
}
