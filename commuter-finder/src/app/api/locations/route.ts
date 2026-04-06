import { NextResponse } from 'next/server';
import { getAllLocations, addCustomLocation } from '@/lib/persistence';
import { Location } from '@/lib/types';

export async function GET() {
  const locations = await getAllLocations();
  return NextResponse.json(locations);
}

export async function POST(request: Request) {
  const location: Location = await request.json();
  await addCustomLocation(location);
  return NextResponse.json(location, { status: 201 });
}
