'use client';

import { useState } from 'react';
import { PortfolioForm } from '@/components/PortfolioForm';
import { PreviewPane } from '@/components/PreviewPane';
import { DeploymentStatus } from '@/components/DeploymentStatus';

type AppState = 'form' | 'generating' | 'preview' | 'deploying' | 'deployed';

interface GeneratedData {
  githubProfile?: any;
  repositories?: any[];
  topLanguages?: string[];
  generatedContent?: any;
  portfolioUrl?: string;
  previewUrl?: string;
  deploymentId?: string;
}

export default function Home() {
  const [appState, setAppState] = useState<AppState>('form');
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [formData, setFormData] = useState<any>(null); // Store form data for deployment
  const [error, setError] = useState<string | null>(null);

  const handlePreview = async (formData: any) => {
    // Store form data for later use in deployment
    setFormData(formData);
    setAppState('generating');
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, mode: 'preview' }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to generate preview');
      }

      setGeneratedData(result.data);
      setAppState('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setAppState('form');
    }
  };

  const handleDeploy = async () => {
    setAppState('deploying');
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, mode: 'deploy' }), // Use stored formData
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to deploy portfolio');
      }

      setGeneratedData({
        ...generatedData,
        portfolioUrl: result.data.portfolioUrl,
        previewUrl: result.data.previewUrl,
        deploymentId: result.data.deploymentId,
      });
      setAppState('deployed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deployment failed');
      setAppState('preview');
    }
  };

  const handleReset = () => {
    setAppState('form');
    setGeneratedData(null);
    setFormData(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white tracking-tight">Portfolio Generator</h1>
                  <p className="text-xs text-slate-400">Powered by Contentstack + AI</p>
                </div>
              </div>
              
              {appState !== 'form' && (
                <button
                  onClick={handleReset}
                  className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Start Over
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Error Banner */}
          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-200 text-sm">{error}</p>
              <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Form State */}
          {appState === 'form' && (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                  Create Your Portfolio in Minutes
                </h2>
                <p className="text-lg text-slate-400 max-w-xl mx-auto">
                  Enter your GitHub URL and let AI craft a stunning portfolio. 
                  We'll fetch your projects, generate content, and deploy it live.
                </p>
              </div>
              <PortfolioForm onSubmit={handlePreview} isLoading={false} />
            </div>
          )}

          {/* Generating State */}
          {appState === 'generating' && (
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Generating Your Portfolio</h3>
              <p className="text-slate-400">Fetching GitHub data and crafting content with AI...</p>
            </div>
          )}

          {/* Preview State */}
          {appState === 'preview' && generatedData && (
            <PreviewPane
              data={generatedData}
              onDeploy={handleDeploy}
              isDeploying={false}
            />
          )}

          {/* Deploying State */}
          {appState === 'deploying' && (
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-violet-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Deploying to Contentstack Launch</h3>
              <p className="text-slate-400">Creating entries and triggering deployment...</p>
            </div>
          )}

          {/* Deployed State */}
          {appState === 'deployed' && generatedData && (
            <DeploymentStatus
              portfolioUrl={generatedData.portfolioUrl}
              previewUrl={generatedData.previewUrl}
              deploymentId={generatedData.deploymentId}
              onCreateAnother={handleReset}
            />
          )}
        </div>
      </div>
    </main>
  );
}

