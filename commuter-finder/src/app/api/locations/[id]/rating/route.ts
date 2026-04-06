import { NextResponse } from 'next/server';
import { getPersonalRating, savePersonalRating } from '@/lib/persistence';
import { PersonalRating } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rating = await getPersonalRating(id);
  return NextResponse.json(rating);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rating: PersonalRating = await request.json();
  const saved = await savePersonalRating(id, rating);
  return NextResponse.json(saved);
}
