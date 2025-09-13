import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export interface AIRequest {
  content: string;
  type: 'note' | 'code' | 'task';
  action: 'improve' | 'summarize' | 'expand' | 'generate' | 'fix';
  context?: string;
}

export interface AIResponse {
  success: boolean;
  result?: string;
  error?: string;
}

export async function processWithAI(request: AIRequest): Promise<AIResponse> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      // Return demo response when API key is not configured
      return getDemoResponse(request);
    }

    const prompt = generatePrompt(request);
    const model = genAI!.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const systemPrompt = `You are a helpful AI writing assistant. Provide clear, concise, and helpful responses.

${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      return {
        success: false,
        error: 'No response from AI',
      };
    }

    return {
      success: true,
      result: text.trim(),
    };
  } catch (error) {
    console.error('AI processing error:', error);
    return {
      success: false,
      error: 'Failed to process with AI',
    };
  }
}

function getDemoResponse(request: AIRequest): AIResponse {
  const { content, type, action } = request;

  // Simulate API delay
  const delay = Math.random() * 1000 + 500;

  let result = '';

  switch (action) {
    case 'improve':
      result = `Here's an improved version of your ${type}:\n\n${content}\n\n✨ Enhanced with better structure, clarity, and flow.`;
      break;
    case 'summarize':
      result = `Summary of your ${type}:\n\n• Key point 1: Main idea from your content\n• Key point 2: Important detail\n• Key point 3: Additional insight\n\nThis captures the essence of your ${type}.`;
      break;
    case 'expand':
      result = `Expanded version of your ${type}:\n\n${content}\n\nAdditional details:\n• More context and background information\n• Examples and illustrations\n• Related concepts and connections\n• Practical applications and implications`;
      break;
    case 'generate':
      result = `Creative ideas for your ${type}:\n\n1. Idea 1: Build on your topic with a fresh perspective\n2. Idea 2: Explore a different angle or approach\n3. Idea 3: Combine with related concepts\n4. Idea 4: Focus on practical applications\n5. Idea 5: Consider future implications`;
      break;
    case 'fix':
      if (type === 'code') {
        result = `// Fixed and improved code\n${content}\n\n// Improvements made:\n// - Fixed syntax errors\n// - Added proper error handling\n// - Improved variable naming\n// - Added comments for clarity`;
      } else {
        result = `Fixed version of your ${type}:\n\n${content}\n\n✅ Corrected grammar and spelling\n✅ Improved sentence structure\n✅ Enhanced clarity and flow`;
      }
      break;
    default:
      result = `AI suggestion for your ${type}:\n\n${content}\n\n💡 Consider adding more detail and examples to make it more engaging.`;
  }

  return {
    success: true,
    result: result,
  };
}

function generatePrompt(request: AIRequest): string {
  const { content, type, action, context } = request;

  switch (action) {
    case 'improve':
      return `Please improve the following ${type} content. Make it more clear, engaging, and well-structured while maintaining the original meaning:

"${content}"

${context ? `Context: ${context}` : ''}

Provide the improved version:`;

    case 'summarize':
      return `Please provide a concise summary of the following ${type} content:

"${content}"

${context ? `Context: ${context}` : ''}

Summary:`;

    case 'expand':
      return `Please expand the following ${type} content with more detail, examples, and explanations while maintaining the original structure:

"${content}"

${context ? `Context: ${context}` : ''}

Expanded version:`;

    case 'generate':
      return `Please generate ${type} content based on the following topic or idea:

"${content}"

${context ? `Context: ${context}` : ''}

Generated content:`;

    case 'fix':
      if (type === 'code') {
        return `Please review and fix any issues in the following code. Provide the corrected version with explanations of what was fixed:

\`\`\`${request.context || 'javascript'}
${content}
\`\`\`

Fixed code:`;
      } else {
        return `Please fix any grammatical errors, typos, and improve the clarity of the following ${type} content:

"${content}"

${context ? `Context: ${context}` : ''}

Fixed version:`;
      }

    default:
      return `Please help with the following ${type} content:

"${content}"

${context ? `Context: ${context}` : ''}

Response:`;
  }
}

export async function generateIdeas(
  topic: string,
  type: 'note' | 'code' | 'task'
): Promise<AIResponse> {
  return processWithAI({
    content: topic,
    type,
    action: 'generate',
    context: `Generate 5 creative ideas for ${type} content about this topic`,
  });
}

export async function improveContent(
  content: string,
  type: 'note' | 'code' | 'task'
): Promise<AIResponse> {
  return processWithAI({
    content,
    type,
    action: 'improve',
  });
}

export async function summarizeContent(
  content: string,
  type: 'note' | 'code' | 'task'
): Promise<AIResponse> {
  return processWithAI({
    content,
    type,
    action: 'summarize',
  });
}

export async function expandContent(
  content: string,
  type: 'note' | 'code' | 'task'
): Promise<AIResponse> {
  return processWithAI({
    content,
    type,
    action: 'expand',
  });
}

export async function fixCode(
  code: string,
  language: string
): Promise<AIResponse> {
  return processWithAI({
    content: code,
    type: 'code',
    action: 'fix',
    context: language,
  });
}
