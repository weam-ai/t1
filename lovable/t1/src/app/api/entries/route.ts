import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Entry from '@/models/Entry';
import { generateShareId, getLanguageFromContent } from '@/lib/utils';
import { CreateEntryRequest, EntriesResponse } from '@/types/entry';

export async function GET(): Promise<NextResponse<EntriesResponse>> {
  try {
    await connectDB();

    const entries = await Entry.find({}).sort({ updatedAt: -1 }).limit(100);

    return NextResponse.json({
      success: true,
      data: entries.map(entry => ({
        id: entry._id?.toString() || '',
        title: entry.title,
        content: entry.content,
        type: entry.type,
        language: entry.language,
        isPublic: entry.isPublic,
        shareId: entry.shareId,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch entries',
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<EntriesResponse>> {
  try {
    await connectDB();

    const body: CreateEntryRequest = await request.json();

    // Validate required fields
    if (!body.title || !body.type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title and type are required',
        },
        { status: 400 }
      );
    }

    // Generate unique share ID
    const shareId = generateShareId();

    // Auto-detect language if not provided and type is code
    let language = body.language;
    if (body.type === 'code' && !language && body.content) {
      language = getLanguageFromContent(body.content);
    }

    const entry = new Entry({
      title: body.title,
      content: body.content || '',
      type: body.type,
      language,
      isPublic: body.isPublic || false,
      shareId,
    });

    const savedEntry = await entry.save();

    return NextResponse.json(
      {
        success: true,
        data: savedEntry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating entry:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create entry',
      },
      { status: 500 }
    );
  }
}
