/**
 * Contentstack Delivery API Client
 * 
 * This module handles fetching content from Contentstack for display
 */

import { contentstackConfig, getCdnEndpoint } from './config';

const CDN_ENDPOINT = getCdnEndpoint(contentstackConfig.region);

export interface PortfolioEntry {
  uid: string;
  title: string;
  slug: string;
  url: string;
  
  // Hero Section
  hero_section: {
    headline: string;
    subheadline: string;
    cta_text?: string;
  };
  
  // Avatar
  avatar?: {
    url: string;
    title?: string;
  };
  
  // About Section
  about_section: {
    title: string;
    content: string;
    highlights?: string[];
  };
  
  // Skills
  skills?: {
    category_name: string;
    skills_list: string[];
  }[];
  
  // Featured Projects
  featured_projects?: {
    name: string;
    description: string;
    tech_stack?: string[];
    highlights?: string[];
    github_url?: string;
    live_url?: string;
    stars?: number;
  }[];
  
  // Contact Section
  contact_section: {
    title: string;
    description: string;
    email?: string;
  };
  
  // Social Links
  social_links?: {
    platform: string;
    url: string;
  }[];
  
  // SEO
  seo?: {
    page_title: string;
    meta_description: string;
    keywords?: string;
  };
  
  // Style Settings
  style_settings?: {
    portfolio_style: 'minimal' | 'modern' | 'creative' | 'professional';
    color_scheme: 'light' | 'dark' | 'colorful';
  };
  
  // GitHub Metadata
  github_metadata?: {
    github_username: string;
    github_url: string;
    top_languages?: string[];
    public_repos_count?: number;
    followers_count?: number;
  };
  
  // Timestamps
  generated_at?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch a portfolio entry by slug (username)
 */
export async function getPortfolioBySlug(slug: string): Promise<PortfolioEntry | null> {
  const url = new URL(`${CDN_ENDPOINT}/v3/content_types/portfolio/entries`);
  
  // Add query parameters
  url.searchParams.set('environment', contentstackConfig.environment);
  url.searchParams.set('query', JSON.stringify({ slug: slug.toLowerCase() }));
//   url.searchParams.set('include[]', 'avatar'); // Include asset references
  url.searchParams.set('locale', 'en-us');
  
  console.log('📡 Fetching portfolio:', {
    slug: slug.toLowerCase(),
    environment: contentstackConfig.environment,
    branch: contentstackConfig.branch,
    region: contentstackConfig.region,
    endpoint: CDN_ENDPOINT,
    apiKey: contentstackConfig.apiKey ? '***' + contentstackConfig.apiKey.slice(-4) : 'NOT SET',
    deliveryToken: contentstackConfig.deliveryToken ? '***' + contentstackConfig.deliveryToken.slice(-4) : 'NOT SET',
  });
  
  try {
    const headers: Record<string, string> = {
      'api_key': contentstackConfig.apiKey,
      'access_token': contentstackConfig.deliveryToken,
      'Content-Type': 'application/json',
    };
    
    // Add branch header if using branches
    if (contentstackConfig.branch && contentstackConfig.branch !== 'main') {
      headers['branch'] = contentstackConfig.branch;
    }
    
    const response = await fetch(url.toString(), {
      headers,
      cache: 'no-store', // Disable caching for debugging
    });

    console.log('📡 Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ Failed to fetch portfolio:', response.statusText, errorBody);
      return null;
    }

    const data = await response.json();
    console.log('📡 Response data:', {
      entriesCount: data.entries?.length || 0,
      entries: data.entries?.map((e: any) => ({ uid: e.uid, slug: e.slug, title: e.title })),
    });
    
    if (!data.entries || data.entries.length === 0) {
      console.log('⚠️ No entries found for slug:', slug);
      return null;
    }

    return data.entries[0] as PortfolioEntry;
  } catch (error) {
    console.error('❌ Error fetching portfolio:', error);
    return null;
  }
}

/**
 * Get all portfolio slugs (for static generation if needed)
 */
export async function getAllPortfolioSlugs(): Promise<string[]> {
  const url = new URL(`${CDN_ENDPOINT}/v3/content_types/portfolio/entries`);
  
  url.searchParams.set('environment', contentstackConfig.environment);
  url.searchParams.set('only[BASE][]', 'slug'); // Only fetch slug field
  
  try {
    const response = await fetch(url.toString(), {
      headers: {
        'api_key': contentstackConfig.apiKey,
        'access_token': contentstackConfig.deliveryToken,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.entries?.map((entry: { slug: string }) => entry.slug) || [];
  } catch (error) {
    console.error('Error fetching portfolio slugs:', error);
    return [];
  }
}

/**
 * Check if a portfolio exists
 */
export async function portfolioExists(slug: string): Promise<boolean> {
  const portfolio = await getPortfolioBySlug(slug);
  return portfolio !== null;
}

