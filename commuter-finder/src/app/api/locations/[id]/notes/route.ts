import { NextResponse } from 'next/server';
import { getNotes, saveNotes } from '@/lib/persistence';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const notes = await getNotes(id);
  return NextResponse.json({ notes });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { notes } = await request.json();
  await saveNotes(id, notes);
  return NextResponse.json({ notes });
}
