'use client';

import { useState } from 'react';
import { Trash2, MoreVertical, Eye, EyeOff } from 'lucide-react';
import { Entry } from '@/types/entry';
import { formatRelativeTime, truncateText } from '@/lib/utils';
import { toast } from 'react-hot-toast';

interface EntryListProps {
  entries: Entry[];
  selectedEntry: Entry | null;
  onSelectEntry: (entry: Entry) => void;
  onDeleteEntry: (id: string) => void;
  getEntryIcon: (type: string) => React.ReactNode;
}

export default function EntryList({
  entries,
  selectedEntry,
  onSelectEntry,
  onDeleteEntry,
  getEntryIcon,
}: EntryListProps) {
  const [hoveredEntry, setHoveredEntry] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      onDeleteEntry(id);
    }
  };

  const copyShareLink = async (shareId: string) => {
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy share link');
    }
  };

  if (!Array.isArray(entries) || entries.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">No entries yet</div>
        <div className="text-sm text-gray-500">
          Create your first entry to get started
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={`relative group p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
            selectedEntry?.id === entry.id
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => onSelectEntry(entry)}
          onMouseEnter={() => setHoveredEntry(entry.id)}
          onMouseLeave={() => setHoveredEntry(null)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <div className="text-gray-500">{getEntryIcon(entry.type)}</div>
                <h3 className="font-medium text-gray-900 truncate">
                  {entry.title}
                </h3>
                {entry.isPublic && (
                  <div className="text-primary-500">
                    <Eye className="w-3 h-3" />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {truncateText(entry.content, 60)}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{formatRelativeTime(new Date(entry.updatedAt))}</span>
                {entry.language && (
                  <span className="px-2 py-1 bg-gray-100 rounded text-gray-600">
                    {entry.language}
                  </span>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div
              className={`flex items-center space-x-1 ml-2 ${
                hoveredEntry === entry.id ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-200`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyShareLink(entry.shareId);
                }}
                className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                title="Copy share link"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(entry.id, entry.title);
                }}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
