export interface Entry {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'code' | 'task';
  language?: string;
  isPublic: boolean;
  shareId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntryRequest {
  title: string;
  content: string;
  type: 'note' | 'code' | 'task';
  language?: string;
  isPublic?: boolean;
}

export interface UpdateEntryRequest {
  title?: string;
  content?: string;
  type?: 'note' | 'code' | 'task';
  language?: string;
  isPublic?: boolean;
}

export interface EntryResponse {
  success: boolean;
  data?: Entry;
  error?: string;
}

export interface EntriesResponse {
  success: boolean;
  data?: Entry[];
  error?: string;
}
