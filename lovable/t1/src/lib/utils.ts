import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateShareId(): string {
  return nanoid(10);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  return formatDate(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function getLanguageFromContent(content: string): string | undefined {
  // Simple heuristic to detect programming language
  const patterns = {
    javascript: /(function|const|let|var|=>|import|export)/,
    python: /(def |import |from |class |if __name__)/,
    java: /(public class|import java|System\.out\.print)/,
    html: /(<html|<head|<body|<div|<p)/,
    css: /(@media|\.|#|{|})/,
    sql: /(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)/,
    json: /({|}|"|:|\[|\])/,
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(content)) {
      return lang;
    }
  }

  return undefined;
}
