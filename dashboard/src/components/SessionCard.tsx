'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import TagBadge from './TagBadge';
import type { Session, Tab } from '@/lib/types';

interface SessionCardProps {
  session: Session;
  deviceUUID: string;
  onDelete: (id: string) => void;
}

export default function SessionCard({ session, deviceUUID, onDelete }: SessionCardProps) {
  const relativeDate = formatDistanceToNow(new Date(session.created_at), { addSuffix: true });

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm(`Delete "${session.title}"?`)) return;
    const res = await fetch(`/api/sessions/${session.id}?deviceUUID=${deviceUUID}`, {
      method: 'DELETE',
    });
    if (res.ok) onDelete(session.id);
  }

  async function handleResurrect(e: React.MouseEvent) {
    e.preventDefault();
    const res = await fetch(`/api/sessions/${session.id}?deviceUUID=${deviceUUID}`);
    if (!res.ok) return;
    const data: Session & { tabs: Tab[] } = await res.json();
    data.tabs?.forEach((tab) => window.open(tab.url, '_blank'));
  }

  return (
    <Link
      href={`/sessions/${session.id}?deviceUUID=${deviceUUID}`}
      className="block bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 hover:border-slate-600 hover:bg-slate-800 transition-all group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-base font-semibold text-slate-100 leading-snug group-hover:text-white transition-colors line-clamp-2">
          {session.title}
        </h2>
        <button
          onClick={handleDelete}
          className="flex-shrink-0 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-900/40 hover:text-red-400 text-slate-500 transition-all"
          title="Delete session"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {session.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {session.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {session.tab_count} tab{session.tab_count !== 1 ? 's' : ''}
          </span>
          <span>{relativeDate}</span>
        </div>

        <button
          onClick={handleResurrect}
          className="flex items-center gap-1.5 text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors px-2.5 py-1 rounded-lg hover:bg-sky-900/30"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Resurrect
        </button>
      </div>
    </Link>
  );
}
