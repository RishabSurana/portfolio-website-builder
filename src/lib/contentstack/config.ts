/**
 * Contentstack Configuration
 * 
 * You'll need to set these environment variables:
 * - CONTENTSTACK_API_KEY: Your stack's API key
 * - CONTENTSTACK_DELIVERY_TOKEN: Delivery token for content fetching
 * - CONTENTSTACK_MANAGEMENT_TOKEN: Management token for creating entries
 * - CONTENTSTACK_ENVIRONMENT: Environment name (e.g., 'production', 'development')
 * - CONTENTSTACK_REGION: Region (e.g., 'us', 'eu', 'azure-na')
 */

export const contentstackConfig = {
  apiKey: process.env.CONTENTSTACK_API_KEY!,
  deliveryToken: process.env.CONTENTSTACK_DELIVERY_TOKEN!,
  managementToken: process.env.CONTENTSTACK_MANAGEMENT_TOKEN!,
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'development',
  region: process.env.CONTENTSTACK_REGION || 'us',
  branch: process.env.CONTENTSTACK_BRANCH || 'main',
};

// Contentstack Launch Configuration
export const launchConfig = {
  // Launch project ID - needed for triggering deployments
  projectId: process.env.CONTENTSTACK_LAUNCH_PROJECT_ID!,
  // Launch API endpoint
  apiEndpoint: process.env.CONTENTSTACK_LAUNCH_API_ENDPOINT || 'https://launch-api.contentstack.com',
};

// Region-specific API endpoints
export const getApiEndpoint = (region: string) => {
  const endpoints: Record<string, string> = {
    us: 'https://api.contentstack.io',
    eu: 'https://eu-api.contentstack.com',
    'azure-na': 'https://azure-na-api.contentstack.com',
    'azure-eu': 'https://azure-eu-api.contentstack.com',
  };
  return endpoints[region] || endpoints.us;
};

export const getCdnEndpoint = (region: string) => {
  const endpoints: Record<string, string> = {
    us: 'https://cdn.contentstack.io',
    eu: 'https://eu-cdn.contentstack.com',
    'azure-na': 'https://azure-na-cdn.contentstack.com',
    'azure-eu': 'https://azure-eu-cdn.contentstack.com',
  };
  return endpoints[region] || endpoints.us;
};

