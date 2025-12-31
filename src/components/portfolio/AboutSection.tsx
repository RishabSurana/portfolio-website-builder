import { PortfolioEntry } from '@/lib/contentstack/delivery';

interface AboutSectionProps {
  portfolio: PortfolioEntry;
}

export function AboutSection({ portfolio }: AboutSectionProps) {
  const { about_section } = portfolio;

  if (!about_section) return null;

  // Split content into paragraphs
  const paragraphs = about_section.content?.split('\n\n').filter(Boolean) || [];

  return (
    <section id="about" className="py-24 bg-slate-900/50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            {about_section.title || 'About Me'}
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto rounded-full" />
        </div>

        {/* Content */}
        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-lg text-slate-300 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Highlights */}
        {about_section.highlights && about_section.highlights.length > 0 && (
          <div className="mt-12 grid md:grid-cols-2 gap-4">
            {about_section.highlights.map((highlight, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-white/5 rounded-xl border border-white/5"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300">{highlight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

