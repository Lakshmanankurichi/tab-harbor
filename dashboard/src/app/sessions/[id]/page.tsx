'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import TabRow from '@/components/TabRow';
import TagBadge from '@/components/TagBadge';
import type { Session, Tab } from '@/lib/types';

type SessionWithTabs = Session & { tabs: Tab[] };

export default function SessionDetail() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [session, setSession] = useState<SessionWithTabs | null>(null);
  const [loading, setLoading] = useState(true);

  const deviceUUID =
    searchParams.get('deviceUUID') ||
    (typeof window !== 'undefined' ? localStorage.getItem('tab_harbor_device_uuid') : null);

  useEffect(() => {
    if (!params.id || !deviceUUID) {
      setLoading(false);
      return;
    }

    fetch(`/api/sessions/${params.id}?deviceUUID=${deviceUUID}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, [params.id, deviceUUID]);

  function resurrectAll() {
    session?.tabs?.forEach((tab) => window.open(tab.url, '_blank'));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-500 text-sm">
        Loading session...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-slate-400">Session not found.</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-sm text-sky-400 hover:text-sky-300"
        >
          ← Back to sessions
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All sessions
      </button>

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{session.title}</h1>
          <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
            <span>{session.tab_count} tabs</span>
            <span>·</span>
            <span>{formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}</span>
          </div>
          {session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {session.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>

        <button
          onClick={resurrectAll}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Open All Tabs
        </button>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
        {session.tabs?.length > 0 ? (
          session.tabs.map((tab, i) => (
            <div key={tab.id} className={i > 0 ? 'border-t border-slate-700/40' : ''}>
              <TabRow tab={tab} />
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-sm text-center py-8">No tabs in this session.</p>
        )}
      </div>
    </div>
  );
}
