'use client';

import { useEffect, useState, useMemo } from 'react';
import SessionCard from '@/components/SessionCard';
import SearchBar from '@/components/SearchBar';
import EmptyState from '@/components/EmptyState';
import type { Session } from '@/lib/types';

export default function Home() {
  const [deviceUUID, setDeviceUUID] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paramUUID = params.get('deviceUUID');

    if (paramUUID) {
      localStorage.setItem('tab_harbor_device_uuid', paramUUID);
      window.history.replaceState({}, '', '/');
    }

    const stored = localStorage.getItem('tab_harbor_device_uuid');
    setDeviceUUID(stored);
  }, []);

  useEffect(() => {
    if (!deviceUUID) {
      setLoading(false);
      return;
    }

    fetch(`/api/sessions?deviceUUID=${deviceUUID}`)
      .then((r) => r.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [deviceUUID]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sessions;
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [sessions, search]);

  function handleDelete(id: string) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-slate-500 text-sm">
        Loading sessions...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-7 animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Your Harbored Sessions</h1>
          <p className="text-slate-600 text-sm mt-1">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>
      )}

      {sessions.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <EmptyState hasSearch />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              deviceUUID={deviceUUID!}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
