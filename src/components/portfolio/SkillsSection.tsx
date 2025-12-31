import { PortfolioEntry } from '@/lib/contentstack/delivery';

interface SkillsSectionProps {
  portfolio: PortfolioEntry;
}

// Color palette for skill categories
const categoryColors = [
  { bg: 'from-indigo-500/20 to-indigo-600/20', border: 'border-indigo-500/30', text: 'text-indigo-300' },
  { bg: 'from-violet-500/20 to-violet-600/20', border: 'border-violet-500/30', text: 'text-violet-300' },
  { bg: 'from-cyan-500/20 to-cyan-600/20', border: 'border-cyan-500/30', text: 'text-cyan-300' },
  { bg: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/30', text: 'text-emerald-300' },
  { bg: 'from-amber-500/20 to-amber-600/20', border: 'border-amber-500/30', text: 'text-amber-300' },
  { bg: 'from-rose-500/20 to-rose-600/20', border: 'border-rose-500/30', text: 'text-rose-300' },
];

export function SkillsSection({ portfolio }: SkillsSectionProps) {
  const { skills, github_metadata } = portfolio;

  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="py-24 bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Skills & Expertise</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto rounded-full" />
        </div>

        {/* Top Languages from GitHub */}
        {github_metadata?.top_languages && github_metadata.top_languages.length > 0 && (
          <div className="mb-12 text-center">
            <p className="text-sm text-slate-400 uppercase tracking-wider mb-4">Top Languages</p>
            <div className="flex flex-wrap justify-center gap-3">
              {github_metadata.top_languages.map((lang) => (
                <span
                  key={lang}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-full text-indigo-300 font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills by Category */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((category, index) => {
            const colors = categoryColors[index % categoryColors.length];
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm`}
              >
                <h3 className={`text-lg font-semibold ${colors.text} mb-4`}>
                  {category.category_name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills_list?.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-slate-300 border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

