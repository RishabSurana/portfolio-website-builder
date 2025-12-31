import { PortfolioEntry } from '@/lib/contentstack/delivery';

interface HeroSectionProps {
  portfolio: PortfolioEntry;
}

export function HeroSection({ portfolio }: HeroSectionProps) {
  const { hero_section, avatar, github_metadata } = portfolio;

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-950" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Avatar */}
        {avatar?.url && (
          <div className="mb-8 animate-fade-in">
            <img
              src={avatar.url}
              alt={portfolio.title}
              className="w-32 h-32 rounded-full mx-auto ring-4 ring-indigo-500/30 shadow-2xl shadow-indigo-500/20"
            />
          </div>
        )}

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight animate-slide-up">
          {hero_section.headline}
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
          {hero_section.subheadline}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center animate-slide-up delay-200">
          {hero_section.cta_text && (
            <a
              href="#projects"
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              {hero_section.cta_text}
            </a>
          )}
          {github_metadata?.github_url && (
            <a
              href={github_metadata.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              View GitHub
            </a>
          )}
        </div>

        {/* Stats */}
        {github_metadata && (
          <div className="mt-12 flex justify-center gap-8 animate-fade-in delay-300">
            {github_metadata.public_repos_count !== undefined && (
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{github_metadata.public_repos_count}</div>
                <div className="text-sm text-slate-400">Repositories</div>
              </div>
            )}
            {github_metadata.followers_count !== undefined && (
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{github_metadata.followers_count}</div>
                <div className="text-sm text-slate-400">Followers</div>
              </div>
            )}
            {github_metadata.top_languages && github_metadata.top_languages.length > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{github_metadata.top_languages.length}</div>
                <div className="text-sm text-slate-400">Languages</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

