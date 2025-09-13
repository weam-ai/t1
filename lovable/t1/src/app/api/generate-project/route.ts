import { NextRequest, NextResponse } from 'next/server';
import { generateDynamicProject } from '@/lib/dynamicProjectGenerator';
import { ProjectGenerationRequest } from '@/types/project';

export async function POST(request: NextRequest) {
  try {
    const body: ProjectGenerationRequest = await request.json();

    // Validate required fields
    if (!body.prompt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prompt is required',
        },
        { status: 400 }
      );
    }

    const project = await generateDynamicProject(body.prompt, body.framework, body.styling);

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error('Project generation error:', error);
    
    // Check if it's a quota/rate limit error
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('Too Many Requests')) {
      return NextResponse.json(
        {
          success: false,
          error: 'API quota exceeded. Please try again later or contact support.',
          quotaExceeded: true,
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate project. Please try again.',
      },
      { status: 500 }
    );
  }
}
