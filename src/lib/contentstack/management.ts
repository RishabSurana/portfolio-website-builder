/**
 * Contentstack Management API Client
 * 
 * This module handles all write operations to Contentstack:
 * - Creating entries
 * - Uploading assets
 * - Publishing content
 */

import { contentstackConfig, getApiEndpoint } from './config';

const API_ENDPOINT = getApiEndpoint(contentstackConfig.region);

interface CreateEntryOptions {
  contentType: string;
  entry: Record<string, any>;
  locale?: string;
}

interface UploadAssetOptions {
  file: ArrayBuffer | Uint8Array | Blob;
  fileName: string;
  contentType: string;
  folder?: string;
  description?: string;
}

interface PublishOptions {
  contentType: string;
  entryUid: string;
  environment: string;
  locale?: string;
}

/**
 * Create a new entry in Contentstack
 */
export async function createEntry({ contentType, entry, locale = 'en-us' }: CreateEntryOptions) {
  const url = `${API_ENDPOINT}/v3/content_types/${contentType}/entries?locale=${locale}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api_key': contentstackConfig.apiKey,
      'authorization': contentstackConfig.managementToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ entry }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create entry: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Upload an asset to Contentstack
 */
export async function uploadAsset({ file, fileName, contentType, folder, description }: UploadAssetOptions) {
  const url = `${API_ENDPOINT}/v3/assets`;
  
  const formData = new FormData();
  
  // Handle different file types - convert to Blob if needed
  let blob: Blob;
  if (file instanceof Blob) {
    blob = file;
  } else if (file instanceof ArrayBuffer) {
    blob = new Blob([file], { type: contentType });
  } else {
    // Uint8Array - slice to get a proper ArrayBuffer
    const arrayBuffer = file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength) as ArrayBuffer;
    blob = new Blob([arrayBuffer], { type: contentType });
  }
  
  formData.append('asset[upload]', blob, fileName);
  
  if (folder) {
    formData.append('asset[parent_uid]', folder);
  }
  if (description) {
    formData.append('asset[description]', description);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api_key': contentstackConfig.apiKey,
      'authorization': contentstackConfig.managementToken,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to upload asset: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Publish an entry to a specific environment
 */
export async function publishEntry({ contentType, entryUid, environment, locale = 'en-us' }: PublishOptions) {
  const url = `${API_ENDPOINT}/v3/content_types/${contentType}/entries/${entryUid}/publish`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api_key': contentstackConfig.apiKey,
      'authorization': contentstackConfig.managementToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      entry: {
        environments: [environment],
        locales: [locale],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to publish entry: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Create and publish an entry in one go
 */
export async function createAndPublishEntry(options: CreateEntryOptions) {
  // First create the entry
  const createResult = await createEntry(options);
  const entryUid = createResult.entry.uid;

  // Then publish it
  await publishEntry({
    contentType: options.contentType,
    entryUid,
    environment: contentstackConfig.environment,
    locale: options.locale,
  });

  return createResult;
}

/**
 * Upload an asset from a URL (useful for GitHub avatars)
 */
export async function uploadAssetFromUrl(imageUrl: string, fileName: string) {
  // Fetch the image
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'image/png';

  // Upload to Contentstack - use Uint8Array for cross-platform compatibility
  return uploadAsset({
    file: new Uint8Array(arrayBuffer),
    fileName,
    contentType,
    description: `Uploaded from ${imageUrl}`,
  });
}

