'use client';

interface DeploymentStatusProps {
  portfolioUrl?: string;
  previewUrl?: string;
  deploymentId?: string;
  onCreateAnother: () => void;
}

export function DeploymentStatus({
  portfolioUrl,
  previewUrl,
  deploymentId,
  onCreateAnother,
}: DeploymentStatusProps) {
  const displayUrl = portfolioUrl || previewUrl || '#';

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Animation */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
        <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-white mb-3">
        Your Portfolio is Live! 🎉
      </h2>
      <p className="text-lg text-slate-400 mb-8">
        Your AI-generated portfolio has been deployed to Contentstack Launch.
      </p>

      {/* URL Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
        <p className="text-sm text-slate-400 mb-3">Your portfolio URL:</p>
        <a
          href={displayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl text-indigo-400 hover:text-indigo-300 font-mono break-all transition-colors"
        >
          {displayUrl}
        </a>
        
        {deploymentId && (
          <p className="text-xs text-slate-500 mt-4">
            Deployment ID: {deploymentId}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={displayUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Visit Portfolio
        </a>

        <button
          onClick={onCreateAnother}
          className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Another
        </button>
      </div>

      {/* Next Steps */}
      <div className="mt-12 text-left bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          What's Next?
        </h3>
        <ul className="space-y-3 text-slate-300">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">1</span>
            <span>Visit your portfolio and share it with the world!</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">2</span>
            <span>Edit content anytime in your Contentstack dashboard</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">3</span>
            <span>Configure a custom domain in Contentstack Launch settings</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">4</span>
            <span>Re-generate anytime to update with your latest GitHub activity</span>
          </li>
        </ul>
      </div>

      {/* Contentstack Attribution */}
      <div className="mt-8 flex items-center justify-center gap-2 text-slate-500 text-sm">
        <span>Powered by</span>
        <span className="font-semibold text-slate-400">Contentstack</span>
        <span>+</span>
        <span className="font-semibold text-slate-400">AI</span>
      </div>
    </div>
  );
}

