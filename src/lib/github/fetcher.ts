/**
 * GitHub Data Fetcher
 * 
 * Fetches user profile, repositories, and contribution data from GitHub API
 */

import { Octokit } from 'octokit';

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN, // Optional: for higher rate limits
});

export interface GitHubUserProfile {
  login: string;
  name: string | null;
  bio: string | null;
  avatarUrl: string;
  company: string | null;
  location: string | null;
  email: string | null;
  blog: string | null;
  twitterUsername: string | null;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
}

export interface GitHubRepository {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  isForked: boolean;
  updatedAt: string;
}

export interface GitHubData {
  profile: GitHubUserProfile;
  repositories: GitHubRepository[];
  languages: Record<string, number>;
  topLanguages: string[];
}

/**
 * Extract username from GitHub URL or return as-is if already a username
 */
export function extractGitHubUsername(input: string): string {
  // Handle full URLs
  const urlMatch = input.match(/github\.com\/([^\/\?#]+)/);
  if (urlMatch) {
    return urlMatch[1];
  }
  // Assume it's already a username
  return input.trim();
}

/**
 * Fetch GitHub user profile
 */
export async function fetchGitHubProfile(username: string): Promise<GitHubUserProfile> {
  const { data } = await octokit.rest.users.getByUsername({ username });

  return {
    login: data.login,
    name: data.name,
    bio: data.bio,
    avatarUrl: data.avatar_url,
    company: data.company,
    location: data.location,
    email: data.email,
    blog: data.blog,
    twitterUsername: data.twitter_username,
    publicRepos: data.public_repos,
    followers: data.followers,
    following: data.following,
    createdAt: data.created_at,
  };
}

/**
 * Fetch user's repositories (top 30 by stars, excluding forks)
 */
export async function fetchGitHubRepositories(username: string): Promise<GitHubRepository[]> {
  const { data } = await octokit.rest.repos.listForUser({
    username,
    sort: 'updated',
    per_page: 100,
  });

  // Sort by stars and take top repositories
  const sortedRepos = data
    .filter(repo => !repo.fork) // Exclude forks
    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
    .slice(0, 30);

  return sortedRepos.map(repo => ({
    name: repo.name,
    description: repo.description,
    url: repo.html_url,
    homepage: repo.homepage,
    language: repo.language,
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    topics: repo.topics || [],
    isForked: repo.fork,
    updatedAt: repo.updated_at || '',
  }));
}

/**
 * Calculate language statistics from repositories
 */
export function calculateLanguageStats(repositories: GitHubRepository[]): {
  languages: Record<string, number>;
  topLanguages: string[];
} {
  const languageCounts: Record<string, number> = {};

  repositories.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });

  // Sort languages by count
  const topLanguages = Object.entries(languageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([lang]) => lang);

  return { languages: languageCounts, topLanguages };
}

/**
 * Fetch all GitHub data for a user
 */
export async function fetchAllGitHubData(githubUrlOrUsername: string): Promise<GitHubData> {
  const username = extractGitHubUsername(githubUrlOrUsername);

  const [profile, repositories] = await Promise.all([
    fetchGitHubProfile(username),
    fetchGitHubRepositories(username),
  ]);

  const { languages, topLanguages } = calculateLanguageStats(repositories);

  return {
    profile,
    repositories,
    languages,
    topLanguages,
  };
}

