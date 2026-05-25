'use client';

import { useState } from 'react';
import type { Tab } from '@/lib/types';

export default function TabRow({ tab }: { tab: Tab }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] rounded-xl group transition-colors duration-150">
      <div className="flex-shrink-0 w-4 h-4">
        {tab.favicon_url && !imgError ? (
          <img
            src={tab.favicon_url}
            alt=""
            width={16}
            height={16}
            className="w-4 h-4 rounded-sm opacity-80 group-hover:opacity-100 transition-opacity"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-slate-300 group-hover:text-slate-100 truncate transition-colors">
          {tab.title || 'Untitled'}
        </p>
        <p className="text-[11px] text-slate-600 truncate mt-0.5">{tab.url}</p>
      </div>

      <a
        href={tab.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-150
                   p-1.5 rounded-lg hover:bg-cyan-500/15 hover:text-cyan-400 text-slate-600"
        title="Open tab"
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
