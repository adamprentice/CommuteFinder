import { NextResponse } from 'next/server';
import { getVisits, addVisit, removeVisit } from '@/lib/persistence';
import { Visit } from '@/lib/types';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const visits = await getVisits(id);
  return NextResponse.json(visits);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const visit: Visit = await request.json();
  const visits = await addVisit(id, visit);
  return NextResponse.json(visits, { status: 201 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { index } = await request.json();
  const visits = await removeVisit(id, index);
  return NextResponse.json(visits);
}
