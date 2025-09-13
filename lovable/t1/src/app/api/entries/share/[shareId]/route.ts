import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Entry from '@/models/Entry';
import { EntryResponse } from '@/types/entry';

export async function GET(
  request: NextRequest,
  { params }: { params: { shareId: string } }
): Promise<NextResponse<EntryResponse>> {
  try {
    await connectDB();

    const entry = await Entry.findOne({ shareId: params.shareId });

    if (!entry) {
      return NextResponse.json(
        {
          success: false,
          error: 'Entry not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error('Error fetching shared entry:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch shared entry',
      },
      { status: 500 }
    );
  }
}
