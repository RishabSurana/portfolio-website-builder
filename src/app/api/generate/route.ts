/**
 * API Route: Generate Portfolio
 * 
 * POST /api/generate
 * 
 * This endpoint orchestrates the entire portfolio generation flow:
 * 1. Validates user input
 * 2. Fetches GitHub data
 * 3. Generates AI content
 * 4. Creates Contentstack entry
 * 5. Returns portfolio URL for redirect
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateAndDeployPortfolio, generatePortfolioPreview } from '@/lib/portfolio-generator';

// Input validation schema
const GenerateRequestSchema = z.object({
  // Required fields
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  githubUrl: z.string().url('Invalid GitHub URL').or(z.string().min(1, 'GitHub username required')),
  
  // Optional fields
  email: z.string().email().optional(),
  currentRole: z.string().optional(),
  company: z.string().optional(),
  yearsOfExperience: z.number().min(0).max(50).optional(),
  skills: z.array(z.string()).optional(),
  bio: z.string().max(500).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  personalWebsite: z.string().url().optional().or(z.literal('')),
  
  // Style preferences
  portfolioStyle: z.enum(['minimal', 'modern', 'creative', 'professional']).optional(),
  colorScheme: z.enum(['light', 'dark', 'colorful']).optional(),
  
  // Mode: 'preview' returns content without deploying, 'deploy' does full deployment
  mode: z.enum(['preview', 'deploy']).default('deploy'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = GenerateRequestSchema.parse(body);

    const { mode, githubUrl, ...userInput } = validatedData;

    if (mode === 'preview') {
      // Generate preview without deployment
      const result = await generatePortfolioPreview({
        userInput,
        githubUrl,
      });

      return NextResponse.json({
        success: true,
        mode: 'preview',
        data: {
          githubProfile: result.githubData.profile,
          repositories: result.githubData.repositories.slice(0, 5),
          topLanguages: result.githubData.topLanguages,
          generatedContent: result.content,
        },
      });
    }

    // Full generation and deployment
    const result = await generateAndDeployPortfolio({
      userInput,
      githubUrl,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mode: 'deploy',
      data: {
        portfolioUrl: result.portfolioUrl,
        username: result.username,
        entryUid: result.entryUid,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'ai-portfolio-generator',
    version: '1.0.0',
  });
}

