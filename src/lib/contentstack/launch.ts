/**
 * Contentstack Launch Integration
 * 
 * Handles deployment triggering and status checking for Contentstack Launch
 * 
 * Note: Contentstack Launch deployment can be triggered in multiple ways:
 * 1. Webhook on content publish (automatic)
 * 2. Manual trigger via Launch dashboard
 * 3. API trigger (if available in your plan)
 * 
 * This module provides utilities for all approaches.
 */

import { launchConfig, contentstackConfig } from './config';

interface DeploymentTriggerOptions {
  entryUid: string;
  username: string;
  environment?: string;
}

interface DeploymentResponse {
  deploymentId: string;
  status: 'queued' | 'building' | 'success' | 'failed';
  url?: string;
  previewUrl?: string;
  error?: string;
}

interface DeploymentStatus {
  status: 'queued' | 'building' | 'success' | 'failed';
  url?: string;
  previewUrl?: string;
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Trigger a deployment on Contentstack Launch
 * 
 * Option 1: Using Contentstack Launch API (Enterprise feature)
 * Option 2: Using a webhook trigger
 * Option 3: Using GitHub Actions/CI integration
 */
export async function triggerLaunchDeployment(
  options: DeploymentTriggerOptions
): Promise<DeploymentResponse> {
  const { entryUid, username, environment = contentstackConfig.environment } = options;

  // Method 1: Direct Launch API (if available)
  // This may require enterprise features
  try {
    const response = await triggerViaLaunchAPI(entryUid, environment);
    if (response) return response;
  } catch (error) {
    console.log('Direct Launch API not available, trying webhook method...');
  }

  // Method 2: Trigger via webhook
  // You can set up a webhook in Contentstack that triggers on entry publish
  // This is the most common approach for standard plans
  const webhookResult = await triggerViaWebhook(entryUid, username);
  
  return webhookResult;
}

/**
 * Attempt to trigger deployment via Launch API
 * Note: This API may require specific permissions or enterprise features
 */
async function triggerViaLaunchAPI(
  entryUid: string,
  environment: string
): Promise<DeploymentResponse | null> {
  const url = `${launchConfig.apiEndpoint}/v1/projects/${launchConfig.projectId}/deployments`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CONTENTSTACK_LAUNCH_TOKEN}`,
    },
    body: JSON.stringify({
      environment,
      trigger: 'api',
      metadata: {
        entryUid,
        triggeredAt: new Date().toISOString(),
      },
    }),
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      return null; // Not authorized - fall back to webhook
    }
    throw new Error(`Launch API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    deploymentId: data.id,
    status: data.status,
    url: data.url,
  };
}

/**
 * Trigger deployment via custom webhook endpoint
 * 
 * This approach uses a webhook that listens for content publish events
 * and triggers the deployment. You need to:
 * 1. Set up a webhook in Contentstack Settings > Webhooks
 * 2. Configure it to trigger on 'Entry Publish' for your content type
 * 3. The webhook URL points to your deployment service or Contentstack Launch webhook
 */
async function triggerViaWebhook(
  entryUid: string,
  username: string
): Promise<DeploymentResponse> {
  // If you have a custom deployment webhook endpoint
  const webhookUrl = process.env.DEPLOYMENT_WEBHOOK_URL;

  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.WEBHOOK_SECRET || '',
      },
      body: JSON.stringify({
        type: 'portfolio_generated',
        entryUid,
        username,
        timestamp: new Date().toISOString(),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        deploymentId: data.deploymentId || `deploy-${Date.now()}`,
        status: 'queued',
        previewUrl: data.previewUrl,
      };
    }
  }

  // Fallback: Return a deployment ID and rely on automatic webhook triggers
  // This assumes you've set up Contentstack webhooks to trigger Launch builds
  // on content publish events
  return {
    deploymentId: `auto-${entryUid}-${Date.now()}`,
    status: 'queued',
    previewUrl: `https://${username}.contentstack.app`, // Placeholder URL format
  };
}

/**
 * Check the status of a deployment
 */
export async function getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
  // If it's an auto-triggered deployment, we may not have a direct status API
  if (deploymentId.startsWith('auto-')) {
    // For webhook-triggered deployments, you might need to:
    // 1. Check via a custom status endpoint you've built
    // 2. Poll the live URL to see if it's updated
    // 3. Use Contentstack Launch dashboard manually
    
    return {
      status: 'building',
      previewUrl: undefined,
    };
  }

  // For API-triggered deployments, check status
  const url = `${launchConfig.apiEndpoint}/v1/projects/${launchConfig.projectId}/deployments/${deploymentId}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.CONTENTSTACK_LAUNCH_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get deployment status: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    status: data.status,
    url: data.url,
    previewUrl: data.previewUrl,
    error: data.error,
    startedAt: data.startedAt,
    completedAt: data.completedAt,
  };
}

/**
 * Get the public URL for a deployed portfolio
 * 
 * URL patterns depend on your Launch configuration:
 * - Default: https://[project-name].contentstack.app
 * - Custom domain: https://portfolio.yourdomain.com/[username]
 * - Per-user subdomain: https://[username].yourservice.com
 */
export function getPortfolioUrl(username: string): string {
  const baseUrl = process.env.PORTFOLIO_BASE_URL || 'https://portfolios.contentstack.app';
  return `${baseUrl}/${username.toLowerCase()}`;
}

/**
 * Setup instructions for Contentstack Launch webhook
 */
export const WEBHOOK_SETUP_INSTRUCTIONS = `
## Setting Up Contentstack Launch for Automatic Deployments

### Step 1: Create a Launch Project
1. Go to Contentstack Dashboard > Launch
2. Click "Create new project"
3. Connect your frontend repository (the portfolio template)
4. Configure build settings:
   - Build command: npm run build
   - Output directory: .next (for Next.js) or dist (for static)
   - Environment variables: Add your Contentstack credentials

### Step 2: Configure Webhook Trigger
1. Go to Settings > Webhooks in your Contentstack stack
2. Create a new webhook:
   - Name: "Deploy Portfolio on Publish"
   - URL: [Your Launch webhook URL from step 1]
   - Trigger: Entry > Publish
   - Content Type: portfolio
   - Environment: production

### Step 3: (Optional) Custom Domains
1. In Launch project settings, go to Domains
2. Add your custom domain
3. Configure DNS as instructed

### Alternative: GitHub Actions Deployment
If Launch API is not available, you can use GitHub Actions:
1. Create a workflow that triggers on webhook
2. Build and deploy to your preferred hosting (Vercel, Netlify, etc.)
`;

