'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  Code,
  CheckSquare,
  Link,
  Save,
  Sparkles,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import EntryEditor from '@/components/EntryEditor';
import EntryList from '@/components/EntryList';
import { Entry } from '@/types/entry';

export default function HomePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries');
      if (response.ok) {
        const result = await response.json();
        setEntries(result.data || []);
      }
    } catch (error) {
      toast.error('Failed to fetch entries');
    } finally {
      setIsLoading(false);
    }
  };

  const createEntry = async () => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Untitled Entry',
          content: '',
          type: 'note',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newEntry = result.data;
        setEntries((prev) => [newEntry, ...prev]);
        setSelectedEntry(newEntry);
        toast.success('Entry created successfully');
      } else {
        toast.error('Failed to create entry');
      }
    } catch (error) {
      toast.error('Failed to create entry');
    } finally {
      setIsCreating(false);
    }
  };

  const updateEntry = async (id: string, updates: Partial<Entry>) => {
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedEntry = result.data;
        setEntries((prev) =>
          prev.map((entry) => (entry.id === id ? updatedEntry : entry))
        );
        if (selectedEntry?.id === id) {
          setSelectedEntry(updatedEntry);
        }
        return updatedEntry;
      } else {
        toast.error('Failed to update entry');
        return null;
      }
    } catch (error) {
      toast.error('Failed to update entry');
      return null;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/entries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
        if (selectedEntry?.id === id) {
          setSelectedEntry(null);
        }
        toast.success('Entry deleted successfully');
      } else {
        toast.error('Failed to delete entry');
      }
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const getEntryIcon = (type: string) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Hackathon App
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <a
                href="/generator"
                className="btn-secondary px-4 py-2 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Generator</span>
              </a>
              <button
                onClick={createEntry}
                disabled={isCreating}
                className="btn-primary px-4 py-2 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Entry</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Entries
              </h2>
              <EntryList
                entries={entries}
                selectedEntry={selectedEntry}
                onSelectEntry={setSelectedEntry}
                onDeleteEntry={deleteEntry}
                getEntryIcon={getEntryIcon}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedEntry ? (
              <EntryEditor
                entry={selectedEntry}
                onUpdate={updateEntry}
                getEntryIcon={getEntryIcon}
              />
            ) : (
              <div className="card p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No entry selected
                </h3>
                <p className="text-gray-500 mb-6">
                  Create a new entry or select an existing one to get started.
                </p>
                <button
                  onClick={createEntry}
                  disabled={isCreating}
                  className="btn-primary px-6 py-3 flex items-center space-x-2 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Entry</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
