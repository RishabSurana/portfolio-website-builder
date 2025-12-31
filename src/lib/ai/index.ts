/**
 * AI Content Generator - Provider Switcher
 * 
 * Automatically selects between OpenAI and GROQ based on AI_PROVIDER env variable
 */

import { GitHubData } from '../github/fetcher';
import * as openaiGenerator from './content-generator';
import * as groqGenerator from './content-generator-groq';

// Re-export types
export type { UserInput, GeneratedPortfolioContent } from './content-generator';
export type { GroqModel } from './content-generator-groq';

export type AIProvider = 'openai' | 'groq';

/**
 * Get the configured AI provider
 */
export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER?.toLowerCase();
  if (provider === 'openai') return 'openai';
  if (provider === 'groq') return 'groq';
  // Default to GROQ for faster inference
  return 'groq';
}

/**
 * Generate portfolio content using the configured AI provider
 */
export async function generatePortfolioContent(
  userInput: openaiGenerator.UserInput,
  githubData: GitHubData
): Promise<openaiGenerator.GeneratedPortfolioContent> {
  const provider = getAIProvider();
  
  console.log(`🤖 Using AI provider: ${provider.toUpperCase()}`);

  if (provider === 'groq') {
    const model = (process.env.GROQ_MODEL as groqGenerator.GroqModel) || 'llama-3.3-70b-versatile';
    console.log(`   Model: ${model}`);
    return groqGenerator.generatePortfolioContent(userInput, githubData, model);
  }

  return openaiGenerator.generatePortfolioContent(userInput, githubData);
}

/**
 * Generate a color palette using the configured AI provider
 */
export async function generateColorPalette(style: string): Promise<{
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}> {
  const provider = getAIProvider();

  if (provider === 'groq') {
    return groqGenerator.generateColorPalette(style);
  }

  return openaiGenerator.generateColorPalette(style);
}

/**
 * Stream portfolio content (GROQ only - for real-time UI)
 */
export async function* streamPortfolioContent(
  userInput: openaiGenerator.UserInput,
  githubData: GitHubData
): AsyncGenerator<string, void, unknown> {
  const provider = getAIProvider();

  if (provider === 'groq') {
    const model = (process.env.GROQ_MODEL as groqGenerator.GroqModel) || 'llama-3.3-70b-versatile';
    yield* groqGenerator.streamPortfolioContent(userInput, githubData, model);
  } else {
    // OpenAI doesn't have streaming in the current implementation
    // Fall back to non-streaming and yield the complete result
    const result = await openaiGenerator.generatePortfolioContent(userInput, githubData);
    yield JSON.stringify(result);
  }
}

