'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center px-6">
        {/* 404 Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-300 mb-4">Portfolio Not Found</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
          The portfolio you're looking for doesn't exist yet. 
          Maybe the username is incorrect, or the portfolio hasn't been created.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Create Your Portfolio
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  );
}

