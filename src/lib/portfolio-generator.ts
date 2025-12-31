/**
 * Portfolio Generator Orchestrator
 * 
 * This is the main orchestration layer that:
 * 1. Fetches GitHub data
 * 2. Generates AI content
 * 3. Creates Contentstack entries
 * 4. Triggers deployment on Contentstack Launch
 */

import { fetchAllGitHubData, GitHubData } from './github/fetcher';
import { generatePortfolioContent, UserInput, GeneratedPortfolioContent } from './ai';
import { createAndPublishEntry, uploadAssetFromUrl } from './contentstack/management';
import { triggerLaunchDeployment, getDeploymentStatus } from './contentstack/launch';

export interface PortfolioGenerationRequest {
  userInput: UserInput;
  githubUrl: string;
}

export interface PortfolioGenerationResult {
  success: boolean;
  portfolioUrl?: string;
  previewUrl?: string;
  entryUid?: string;
  deploymentId?: string;
  error?: string;
}

/**
 * Main function to generate and deploy a portfolio
 */
export async function generateAndDeployPortfolio(
  request: PortfolioGenerationRequest
): Promise<PortfolioGenerationResult> {
  console.log('🚀 Starting portfolio generation...');

  try {
    // Step 1: Fetch GitHub data
    console.log('📊 Fetching GitHub data...');
    const githubData = await fetchAllGitHubData(request.githubUrl);
    console.log(`✅ Found ${githubData.repositories.length} repositories`);

    // Step 2: Generate AI content
    console.log('🤖 Generating AI content...');
    const portfolioContent = await generatePortfolioContent(
      request.userInput,
      githubData
    );
    console.log('✅ Content generated successfully');

    // Step 3: Upload assets (avatar)
    console.log('📸 Uploading assets...');
    const avatarAsset = await uploadAssetFromUrl(
      githubData.profile.avatarUrl,
      `${githubData.profile.login}-avatar.png`
    );
    console.log('✅ Avatar uploaded', avatarAsset);

    // Step 4: Create Contentstack entry
    console.log('📝 Creating Contentstack entry...');
    const entry = await createPortfolioEntry(
      request.userInput,
      githubData,
      portfolioContent,
      avatarAsset.asset.uid
    );
    console.log(`✅ Entry created: ${entry.entry.uid}`);

    // Step 5: Trigger deployment
    console.log('🚀 Triggering deployment...');
    const deployment = await triggerLaunchDeployment({
      entryUid: entry.entry.uid,
      username: githubData.profile.login,
    });
    console.log(`✅ Deployment started: ${deployment.deploymentId}`);

    // Step 6: Wait for deployment (optional - can be async)
    console.log('⏳ Waiting for deployment...');
    const finalStatus = await waitForDeployment(deployment.deploymentId);

    return {
      success: true,
      portfolioUrl: finalStatus.url,
      previewUrl: finalStatus.previewUrl,
      entryUid: entry.entry.uid,
      deploymentId: deployment.deploymentId,
    };
  } catch (error) {
    console.error('❌ Portfolio generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Create the portfolio entry in Contentstack
 */
async function createPortfolioEntry(
  userInput: UserInput,
  githubData: GitHubData,
  content: GeneratedPortfolioContent,
  avatarAssetUid: string
) {
  // Create the main portfolio entry
  const portfolioEntry = {
    title: `${userInput.fullName}'s Portfolio`,
    slug: githubData.profile.login.toLowerCase(),
    
    // Hero Section
    hero_headline: content.hero.headline,
    hero_subheadline: content.hero.subheadline,
    hero_cta_text: content.hero.ctaText,
    
    // About Section
    about_title: content.about.title,
    about_content: content.about.paragraphs.join('\n\n'),
    about_highlights: content.about.highlights,
    
    // Avatar
    // avatar: {
    //   uid: avatarAssetUid,
    // },
    avatar: avatarAssetUid,
    
    // Skills
    skills_title: content.skills.title,
    skills_categories: content.skills.categories.map(cat => ({
      category_name: cat.name,
      skills_list: cat.skills,
    })),
    
    // Projects
    projects_title: content.projects.title,
    projects_description: content.projects.description,
    featured_projects: content.projects.featured.map(project => ({
      name: project.name,
      description: project.description,
      tech_stack: project.techStack,
      highlights: project.highlights,
      github_url: project.githubUrl,
      live_url: project.liveUrl || '',
    })),
    
    // Contact
    contact_title: content.contact.title,
    contact_description: content.contact.description,
    email: content.contact.email || userInput.email,
    social_links: content.contact.socialLinks.map(link => ({
      platform: link.platform,
      url: link.url,
    })),
    
    // SEO
    seo_title: content.meta.pageTitle,
    seo_description: content.meta.metaDescription,
    seo_keywords: content.meta.keywords.join(', '),
    
    // User preferences
    portfolio_style: userInput.portfolioStyle || 'modern',
    color_scheme: userInput.colorScheme || 'dark',
    
    // GitHub metadata
    github_username: githubData.profile.login,
    github_url: `https://github.com/${githubData.profile.login}`,
    top_languages: githubData.topLanguages,
    
    // Timestamps
    generated_at: new Date().toISOString(),
  };

  return createAndPublishEntry({
    contentType: 'portfolio',
    entry: portfolioEntry,
  });
}

/**
 * Wait for deployment to complete
 */
async function waitForDeployment(
  deploymentId: string,
  maxAttempts = 30,
  intervalMs = 10000
): Promise<{ url: string; previewUrl?: string }> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await getDeploymentStatus(deploymentId);

    if (status.status === 'success') {
      return {
        url: status.url!,
        previewUrl: status.previewUrl,
      };
    }

    if (status.status === 'failed') {
      throw new Error(`Deployment failed: ${status.error}`);
    }

    // Wait before checking again
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error('Deployment timeout - please check Contentstack Launch dashboard');
}

/**
 * Generate portfolio content only (without deployment) - useful for previews
 */
export async function generatePortfolioPreview(
  request: PortfolioGenerationRequest
): Promise<{
  githubData: GitHubData;
  content: GeneratedPortfolioContent;
}> {
  const githubData = await fetchAllGitHubData(request.githubUrl);
  const content = await generatePortfolioContent(request.userInput, githubData);

  return { githubData, content };
}

