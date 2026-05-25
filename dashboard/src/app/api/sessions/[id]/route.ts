import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deviceUUID = req.nextUrl.searchParams.get('deviceUUID');

    const { data, error } = await supabase
      .from('sessions')
      .select(`
        id, title, tags, tab_count, created_at,
        tabs ( id, title, url, favicon_url, position )
      `)
      .eq('id', params.id)
      .eq('device_uuid', deviceUUID ?? '')
      .order('position', { referencedTable: 'tabs', ascending: true })
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[GET /api/sessions/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deviceUUID = req.nextUrl.searchParams.get('deviceUUID');
    const { title } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('sessions')
      .update({ title: title.trim() })
      .eq('id', params.id)
      .eq('device_uuid', deviceUUID ?? '');

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PATCH /api/sessions/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deviceUUID = req.nextUrl.searchParams.get('deviceUUID');

    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', params.id)
      .eq('device_uuid', deviceUUID ?? '');

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/sessions/[id]]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
