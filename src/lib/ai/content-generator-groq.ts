/**
 * AI Content Generator - GROQ Version
 * 
 * Uses GROQ API for fast inference with Llama/Mixtral models
 * GROQ offers significantly faster inference speeds compared to other providers
 */

import Groq from 'groq-sdk';
import { GitHubData } from '../github/fetcher';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface UserInput {
  fullName: string;
  email?: string;
  currentRole?: string;
  company?: string;
  yearsOfExperience?: number;
  skills?: string[];
  bio?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  personalWebsite?: string;
  portfolioStyle?: 'minimal' | 'modern' | 'creative' | 'professional';
  colorScheme?: 'light' | 'dark' | 'colorful';
}

export interface GeneratedPortfolioContent {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  about: {
    title: string;
    paragraphs: string[];
    highlights: string[];
  };
  skills: {
    title: string;
    categories: {
      name: string;
      skills: string[];
    }[];
  };
  projects: {
    title: string;
    description: string;
    featured: {
      name: string;
      description: string;
      techStack: string[];
      highlights: string[];
      githubUrl: string;
      liveUrl?: string;
    }[];
  };
  experience: {
    title: string;
    summary: string;
  };
  contact: {
    title: string;
    description: string;
    email?: string;
    socialLinks: {
      platform: string;
      url: string;
    }[];
  };
  meta: {
    pageTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Available GROQ models
export type GroqModel = 
  | 'llama-3.3-70b-versatile'
  | 'llama-3.1-70b-versatile'
  | 'llama-3.1-8b-instant'
  | 'mixtral-8x7b-32768'
  | 'gemma2-9b-it';

/**
 * Generate portfolio content using GROQ API
 */
export async function generatePortfolioContent(
  userInput: UserInput,
  githubData: GitHubData,
  model: GroqModel = 'llama-3.3-70b-versatile'
): Promise<GeneratedPortfolioContent> {
  const prompt = buildPrompt(userInput, githubData);

  const completion = await groq.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'system',
        content: `You are an expert portfolio copywriter. Your job is to create compelling, 
professional portfolio content that showcases a developer's skills and experience. 
Write in a confident but not arrogant tone. Be specific and highlight achievements.
Always return valid JSON matching the requested structure. Do not include any text outside the JSON object.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No content generated from GROQ API');
  }

  try {
    return JSON.parse(content) as GeneratedPortfolioContent;
  } catch (parseError) {
    // If JSON parsing fails, try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as GeneratedPortfolioContent;
    }
    throw new Error(`Failed to parse GROQ response as JSON: ${content.substring(0, 200)}`);
  }
}

/**
 * Build the prompt for AI content generation
 */
function buildPrompt(userInput: UserInput, githubData: GitHubData): string {
  // Get top 5 repositories by stars
  const topProjects = githubData.repositories
    .sort((a, b) => b.stars - a.stars)
    .slice(0, 5);

  return `
Generate portfolio website content for a developer with the following information:

## Personal Information
- Name: ${userInput.fullName}
- Current Role: ${userInput.currentRole || 'Software Developer'}
- Company: ${userInput.company || 'Not specified'}
- Years of Experience: ${userInput.yearsOfExperience || 'Not specified'}
- Self-described Bio: ${userInput.bio || githubData.profile.bio || 'Not provided'}
- Skills: ${userInput.skills?.join(', ') || 'See GitHub data'}
- Portfolio Style: ${userInput.portfolioStyle || 'modern'}

## GitHub Profile Data
- Username: ${githubData.profile.login}
- Public Repositories: ${githubData.profile.publicRepos}
- Followers: ${githubData.profile.followers}
- Location: ${githubData.profile.location || 'Not specified'}
- Top Languages: ${githubData.topLanguages.join(', ')}

## Top Projects (by stars)
${topProjects.map(p => `
- ${p.name} (⭐ ${p.stars})
  - Description: ${p.description || 'No description'}
  - Language: ${p.language || 'Not specified'}
  - Topics: ${p.topics.join(', ') || 'None'}
  - URL: ${p.url}
  - Homepage: ${p.homepage || 'None'}
`).join('\n')}

## Social Links
- LinkedIn: ${userInput.linkedinUrl || 'Not provided'}
- Twitter: ${userInput.twitterUrl || githubData.profile.twitterUsername ? `https://twitter.com/${githubData.profile.twitterUsername}` : 'Not provided'}
- Personal Website: ${userInput.personalWebsite || githubData.profile.blog || 'Not provided'}
- Email: ${userInput.email || githubData.profile.email || 'Not provided'}

---

Generate a complete JSON object with the following structure:
{
  "hero": {
    "headline": "A compelling one-liner about the developer",
    "subheadline": "A brief description of their expertise and focus areas",
    "ctaText": "Call-to-action button text"
  },
  "about": {
    "title": "Section title",
    "paragraphs": ["2-3 paragraphs about the developer"],
    "highlights": ["3-5 key achievements or traits"]
  },
  "skills": {
    "title": "Section title",
    "categories": [
      {
        "name": "Category name (e.g., Frontend, Backend, DevOps)",
        "skills": ["List of specific skills"]
      }
    ]
  },
  "projects": {
    "title": "Section title",
    "description": "Brief intro to their work",
    "featured": [
      {
        "name": "Project name",
        "description": "Enhanced description based on GitHub data",
        "techStack": ["Technologies used"],
        "highlights": ["Key features or achievements"],
        "githubUrl": "GitHub URL",
        "liveUrl": "Live URL if available"
      }
    ]
  },
  "experience": {
    "title": "Section title",
    "summary": "Brief experience summary"
  },
  "contact": {
    "title": "Section title",
    "description": "Invitation to connect",
    "email": "Email if available",
    "socialLinks": [
      { "platform": "GitHub", "url": "URL" },
      { "platform": "LinkedIn", "url": "URL" }
    ]
  },
  "meta": {
    "pageTitle": "SEO page title",
    "metaDescription": "SEO meta description (150-160 chars)",
    "keywords": ["SEO keywords"]
  }
}

Make the content engaging, professional, and specific to this developer's actual work.
Focus on their strongest projects and skills based on the GitHub data.
Return ONLY the JSON object, no additional text.
`;
}

/**
 * Generate a color palette suggestion based on style preference
 */
export async function generateColorPalette(
  style: string,
  model: GroqModel = 'llama-3.1-8b-instant'
): Promise<{
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}> {
  const completion = await groq.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'user',
        content: `Generate a modern, accessible color palette for a ${style} developer portfolio. 
Return ONLY a JSON object with hex colors: { "primary": "#...", "secondary": "#...", "accent": "#...", "background": "#...", "text": "#..." }
No additional text, only the JSON object.`,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
    max_tokens: 200,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    // Return default palette if generation fails
    return {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: '#0f172a',
      text: '#e2e8f0',
    };
  }

  try {
    return JSON.parse(content);
  } catch {
    return {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#10b981',
      background: '#0f172a',
      text: '#e2e8f0',
    };
  }
}

/**
 * Stream portfolio content generation for real-time UI updates
 */
export async function* streamPortfolioContent(
  userInput: UserInput,
  githubData: GitHubData,
  model: GroqModel = 'llama-3.3-70b-versatile'
): AsyncGenerator<string, void, unknown> {
  const prompt = buildPrompt(userInput, githubData);

  const stream = await groq.chat.completions.create({
    model: model,
    messages: [
      {
        role: 'system',
        content: `You are an expert portfolio copywriter. Your job is to create compelling, 
professional portfolio content that showcases a developer's skills and experience. 
Write in a confident but not arrogant tone. Be specific and highlight achievements.
Always return valid JSON matching the requested structure.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

