import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateSessionMeta } from '@/lib/openai';
import type { CreateSessionPayload } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body: CreateSessionPayload = await req.json();
    const { deviceUUID, tabs } = body;

    if (!deviceUUID || !tabs || tabs.length === 0) {
      return NextResponse.json({ error: 'Missing deviceUUID or tabs' }, { status: 400 });
    }

    const { title, tags } = await generateSessionMeta(tabs);

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .insert({ device_uuid: deviceUUID, title, tags, tab_count: tabs.length })
      .select()
      .single();

    if (sessionError) throw sessionError;

    const tabRows = tabs.map((t) => ({
      session_id:  session.id,
      title:       t.title,
      url:         t.url,
      favicon_url: t.favicon_url,
      position:    t.position,
    }));

    const { error: tabsError } = await supabase.from('tabs').insert(tabRows);
    if (tabsError) throw tabsError;

    return NextResponse.json(session, { status: 201 });
  } catch (err) {
    console.error('[POST /api/sessions]', err);
    const detail = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ error: 'Internal server error', detail }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const deviceUUID = req.nextUrl.searchParams.get('deviceUUID');

    if (!deviceUUID) {
      return NextResponse.json({ error: 'Missing deviceUUID' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('sessions')
      .select('id, title, tags, tab_count, created_at')
      .eq('device_uuid', deviceUUID)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error('[GET /api/sessions]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
