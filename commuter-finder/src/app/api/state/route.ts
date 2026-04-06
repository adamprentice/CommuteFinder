import { NextResponse } from 'next/server';
import { getState, saveState } from '@/lib/persistence';
import { AppState } from '@/lib/types';

export async function GET() {
  const state = await getState();
  return NextResponse.json(state);
}

export async function PUT(request: Request) {
  const partial: Partial<AppState> = await request.json();
  const state = await saveState(partial);
  return NextResponse.json(state);
}
