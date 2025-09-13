'use client';

import { useState } from 'react';
import {
  Sparkles,
  Wand2,
  FileText,
  Code,
  CheckSquare,
  Lightbulb,
  ArrowRight,
  Copy,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface AIAssistantProps {
  content: string;
  type: 'note' | 'code' | 'task';
  language?: string;
  onApplySuggestion: (suggestion: string) => void;
}

export default function AIAssistant({
  content,
  type,
  language,
  onApplySuggestion,
}: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'improve',
      label: 'Improve',
      icon: Wand2,
      description: 'Enhance clarity and style',
    },
    {
      id: 'summarize',
      label: 'Summarize',
      icon: FileText,
      description: 'Create a concise summary',
    },
    {
      id: 'expand',
      label: 'Expand',
      icon: ArrowRight,
      description: 'Add more detail and examples',
    },
    {
      id: 'generate',
      label: 'Generate Ideas',
      icon: Lightbulb,
      description: 'Generate creative ideas',
    },
    ...(type === 'code'
      ? [
          {
            id: 'fix',
            label: 'Fix Code',
            icon: Code,
            description: 'Fix bugs and improve code',
          },
        ]
      : []),
  ];

  const handleAIAction = async (action: string) => {
    if (!content.trim()) {
      toast.error('Please enter some content first');
      return;
    }

    setIsLoading(true);
    setActiveAction(action);
    setSuggestion('');

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          type,
          action,
          context: language,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuggestion(result.result);
        setIsOpen(true);
      } else {
        toast.error(result.error || 'Failed to process with AI');
      }
    } catch (error) {
      toast.error('Failed to connect to AI service');
    } finally {
      setIsLoading(false);
      setActiveAction(null);
    }
  };

  const copySuggestion = async () => {
    try {
      await navigator.clipboard.writeText(suggestion);
      toast.success('Suggestion copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy suggestion');
    }
  };

  const applySuggestion = () => {
    onApplySuggestion(suggestion);
    setIsOpen(false);
    setSuggestion('');
    toast.success('Suggestion applied!');
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'note':
        return <FileText className="w-4 h-4" />;
      case 'code':
        return <Code className="w-4 h-4" />;
      case 'task':
        return <CheckSquare className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="border-t border-gray-200 bg-gray-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              {getTypeIcon()}
              <span className="capitalize">{type}</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {isOpen ? 'Hide' : 'Show'} Suggestions
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {actions.map((action) => {
            const Icon = action.icon;
            const isActive = activeAction === action.id;

            return (
              <button
                key={action.id}
                onClick={() => handleAIAction(action.id)}
                disabled={isLoading || !content.trim()}
                className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
                  isActive
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                } ${isLoading || !content.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isActive ? (
                  <Loader2 className="w-4 h-4 animate-spin mb-1" />
                ) : (
                  <Icon className="w-4 h-4 mb-1" />
                )}
                <span className="text-xs font-medium">{action.label}</span>
                <span className="text-xs text-gray-500 text-center">
                  {action.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Suggestion Display */}
        {isOpen && suggestion && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">AI Suggestion</h4>
              <div className="flex items-center space-x-2">
                <button
                  onClick={copySuggestion}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy suggestion"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={applySuggestion}
                  className="btn-primary px-3 py-1 text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              {type === 'code' ? (
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                  <code>{suggestion}</code>
                </pre>
              ) : (
                <div className="whitespace-pre-wrap text-sm text-gray-700">
                  {suggestion}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
              <span className="text-sm text-gray-600">
                AI is processing your content...
              </span>
            </div>
          </div>
        )}

        {/* No Content Warning */}
        {!content.trim() && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Enter some content to get AI suggestions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
