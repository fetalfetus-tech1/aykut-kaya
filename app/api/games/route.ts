import { NextResponse } from 'next/server';
import gamesData from '@/data/games.json';

export async function GET() {
  try {
    return NextResponse.json(gamesData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}