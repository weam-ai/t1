import { NextRequest, NextResponse } from 'next/server';
import { processWithAI, AIRequest } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json();

    // Validate required fields
    if (!body.content || !body.type || !body.action) {
      return NextResponse.json(
        {
          success: false,
          error: 'Content, type, and action are required',
        },
        { status: 400 }
      );
    }

    // Validate action type
    const validActions = ['improve', 'summarize', 'expand', 'generate', 'fix'];
    if (!validActions.includes(body.action)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action type',
        },
        { status: 400 }
      );
    }

    // Validate content type
    const validTypes = ['note', 'code', 'task'];
    if (!validTypes.includes(body.type)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid content type',
        },
        { status: 400 }
      );
    }

    const result = await processWithAI(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
