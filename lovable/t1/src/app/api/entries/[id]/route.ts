import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Entry from '@/models/Entry';
import { getLanguageFromContent } from '@/lib/utils';
import { UpdateEntryRequest, EntryResponse } from '@/types/entry';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<EntryResponse>> {
  try {
    await connectDB();

    const entry = await Entry.findById(params.id);

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
      data: {
        id: entry._id?.toString() || '',
        title: entry.title,
        content: entry.content,
        type: entry.type,
        language: entry.language,
        isPublic: entry.isPublic,
        shareId: entry.shareId,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching entry:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch entry',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<EntryResponse>> {
  try {
    await connectDB();

    const body: UpdateEntryRequest = await request.json();

    const updateData: any = { ...body };

    // Auto-detect language if content is updated and type is code
    if (body.content && body.type === 'code' && !body.language) {
      updateData.language = getLanguageFromContent(body.content);
    }

    const entry = await Entry.findByIdAndUpdate(params.id, updateData, {
      new: true,
      runValidators: true,
    });

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
      data: {
        id: entry._id?.toString() || '',
        title: entry.title,
        content: entry.content,
        type: entry.type,
        language: entry.language,
        isPublic: entry.isPublic,
        shareId: entry.shareId,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error updating entry:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update entry',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<EntryResponse>> {
  try {
    await connectDB();

    const entry = await Entry.findByIdAndDelete(params.id);

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
      data: {
        id: entry._id?.toString() || '',
        title: entry.title,
        content: entry.content,
        type: entry.type,
        language: entry.language,
        isPublic: entry.isPublic,
        shareId: entry.shareId,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error deleting entry:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete entry',
      },
      { status: 500 }
    );
  }
}
