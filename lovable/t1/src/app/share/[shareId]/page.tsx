'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Copy, Eye, FileText, Code, CheckSquare } from 'lucide-react';
import { Entry } from '@/types/entry';
import { toast } from 'react-hot-toast';
import LivePreview from '@/components/LivePreview';

export default function SharedEntryPage() {
  const params = useParams();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.shareId) {
      fetchSharedEntry(params.shareId as string);
    }
  }, [params.shareId]);

  const fetchSharedEntry = async (shareId: string) => {
    try {
      const response = await fetch(`/api/entries/share/${shareId}`);
      if (response.ok) {
        const data = await response.json();
        setEntry(data.data);
      } else {
        setError('Entry not found or not publicly shared');
      }
    } catch (error) {
      setError('Failed to load shared entry');
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = async () => {
    if (entry) {
      const shareUrl = `${window.location.origin}/share/${entry.shareId}`;
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy share link');
      }
    }
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText className="w-5 h-5" />;
      case 'code':
        return <Code className="w-5 h-5" />;
      case 'task':
        return <CheckSquare className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Entry Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            {error ||
              'This entry may have been deleted or is not publicly shared.'}
          </p>
          <a
            href="/"
            className="btn-primary px-6 py-3 inline-flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Create New Entry</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                {getEntryIcon(entry.type)}
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {entry.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Shared {new Date(entry.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={copyShareLink}
              className="btn-secondary px-4 py-2 flex items-center space-x-2"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">{getEntryIcon(entry.type)}</div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {entry.title}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="capitalize">{entry.type}</span>
                    {entry.language && (
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {entry.language}
                      </span>
                    )}
                    <span>
                      Updated {new Date(entry.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <LivePreview
              content={entry.content}
              type={entry.type}
              language={entry.language}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Created with{' '}
            <a
              href="/"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Hackathon App
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
