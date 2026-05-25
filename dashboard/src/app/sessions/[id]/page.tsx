'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
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
  const [tabSearch, setTabSearch] = useState('');

  // Inline title edit state
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const deviceUUID =
    searchParams.get('deviceUUID') ||
    (typeof window !== 'undefined' ? localStorage.getItem('tab_harbor_device_uuid') : null);

  useEffect(() => {
    if (!params.id || !deviceUUID) { setLoading(false); return; }
    fetch(`/api/sessions/${params.id}?deviceUUID=${deviceUUID}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setSession)
      .catch(() => setSession(null))
      .finally(() => setLoading(false));
  }, [params.id, deviceUUID]);

  // Focus input when editing starts
  useEffect(() => {
    if (editing) titleInputRef.current?.select();
  }, [editing]);

  function startEdit() {
    if (!session) return;
    setDraftTitle(session.title);
    setEditing(true);
  }

  async function saveTitle() {
    if (!session || !draftTitle.trim() || draftTitle.trim() === session.title) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/sessions/${session.id}?deviceUUID=${deviceUUID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: draftTitle.trim() }),
      });
      if (res.ok) setSession((s) => s ? { ...s, title: draftTitle.trim() } : s);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  }

  function handleTitleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') saveTitle();
    if (e.key === 'Escape') setEditing(false);
  }

  const filteredTabs = useMemo(() => {
    const q = tabSearch.toLowerCase().trim();
    if (!q || !session?.tabs) return session?.tabs ?? [];
    return session.tabs.filter(
      (t) => t.title.toLowerCase().includes(q) || t.url.toLowerCase().includes(q)
    );
  }, [session?.tabs, tabSearch]);

  function resurrectAll() {
    filteredTabs.forEach((tab) => window.open(tab.url, '_blank'));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-600 text-sm">
        Loading session…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="text-slate-500">Session not found.</p>
        <button onClick={() => router.push('/')} className="mt-4 text-sm text-cyan-500 hover:text-cyan-300 transition-colors">
          ← Back to sessions
        </button>
      </div>
    );
  }

  const totalTabs = session.tabs?.length ?? 0;
  const showingCount = filteredTabs.length;

  return (
    <div className="animate-fade-up">
      {/* Back */}
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-300 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        All sessions
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">

          {/* Editable title */}
          <div className="flex items-center gap-2 mb-2 group/title">
            {editing ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input
                  ref={titleInputRef}
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  onBlur={saveTitle}
                  onKeyDown={handleTitleKeyDown}
                  maxLength={80}
                  className="flex-1 min-w-0 text-2xl font-bold tracking-tight bg-transparent border-b-2
                             border-cyan-500/60 text-white outline-none caret-cyan-400
                             placeholder-slate-600 pb-0.5"
                />
                <button
                  onMouseDown={(e) => { e.preventDefault(); saveTitle(); }}
                  disabled={saving}
                  className="flex-shrink-0 p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 transition-colors"
                  title="Save"
                >
                  {saving ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <button
                  onMouseDown={(e) => { e.preventDefault(); setEditing(false); }}
                  className="flex-shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/5 transition-colors"
                  title="Cancel (Esc)"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-white tracking-tight">{session.title}</h1>
                <button
                  onClick={startEdit}
                  className="opacity-0 group-hover/title:opacity-100 transition-opacity p-1.5 rounded-lg
                             text-slate-600 hover:text-cyan-400 hover:bg-cyan-500/10"
                  title="Rename session"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-2 text-[13px] text-slate-600 mb-3">
            <span>{totalTabs} tab{totalTabs !== 1 ? 's' : ''}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-slate-700" />
            <span>{formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}</span>
          </div>

          {session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {session.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
            </div>
          )}
        </div>

        {/* Open All */}
        <button
          onClick={resurrectAll}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5
                     bg-cyan-600 hover:bg-cyan-500 active:scale-95
                     text-white text-sm font-semibold rounded-xl transition-all duration-150
                     shadow-lg shadow-cyan-500/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {tabSearch ? `Open ${showingCount}` : 'Open All Tabs'}
        </button>
      </div>

      {/* Tab search */}
      <div className="relative mb-3">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tabs by title or URL…"
          value={tabSearch}
          onChange={(e) => setTabSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 glass rounded-xl text-sm text-slate-200
                     placeholder-slate-600 outline-none
                     focus:border-cyan-500/30 focus:ring-2 focus:ring-cyan-500/10 transition-all"
        />
        {tabSearch && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="text-[11px] text-slate-600">{showingCount}/{totalTabs}</span>
            <button onClick={() => setTabSearch('')} className="text-slate-600 hover:text-slate-400 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Tabs list */}
      <div className="glass rounded-2xl overflow-hidden">
        {filteredTabs.length > 0 ? (
          filteredTabs.map((tab, i) => (
            <div key={tab.id} className={i > 0 ? 'border-t border-white/[0.04]' : ''}>
              <TabRow tab={tab} />
            </div>
          ))
        ) : (
          <p className="text-slate-600 text-sm text-center py-10">
            {tabSearch ? `No tabs matching "${tabSearch}"` : 'No tabs in this session.'}
          </p>
        )}
      </div>
    </div>
  );
}
