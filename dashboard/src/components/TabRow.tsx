'use client';

import { useState } from 'react';
import type { Tab } from '@/lib/types';

export default function TabRow({ tab }: { tab: Tab }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800/50 rounded-lg group transition-colors">
      <div className="flex-shrink-0 w-4 h-4">
        {tab.favicon_url && !imgError ? (
          <img
            src={tab.favicon_url}
            alt=""
            width={16}
            height={16}
            className="w-4 h-4 rounded-sm"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{tab.title || 'Untitled'}</p>
        <p className="text-xs text-slate-500 truncate">{tab.url}</p>
      </div>

      <a
        href={tab.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-700"
        title="Open tab"
      >
        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
