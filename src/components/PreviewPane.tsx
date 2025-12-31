'use client';

interface PreviewPaneProps {
  data: {
    githubProfile?: any;
    repositories?: any[];
    topLanguages?: string[];
    generatedContent?: any;
  };
  onDeploy: () => void;
  isDeploying: boolean;
}

export function PreviewPane({ data, onDeploy, isDeploying }: PreviewPaneProps) {
  const { githubProfile, repositories, topLanguages, generatedContent } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Preview Your Portfolio</h2>
        <p className="text-slate-400">Review the AI-generated content before creating your portfolio</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* GitHub Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">GitHub Profile</h3>
            {githubProfile && (
              <div className="text-center">
                <img
                  src={githubProfile.avatarUrl}
                  alt={githubProfile.name || githubProfile.login}
                  className="w-24 h-24 rounded-full mx-auto mb-4 ring-4 ring-indigo-500/20"
                />
                <h4 className="text-xl font-semibold text-white">{githubProfile.name || githubProfile.login}</h4>
                <p className="text-slate-400 text-sm">@{githubProfile.login}</p>
                {githubProfile.bio && (
                  <p className="text-slate-300 text-sm mt-3">{githubProfile.bio}</p>
                )}
                <div className="flex justify-center gap-6 mt-4 text-sm">
                  <div>
                    <span className="text-white font-semibold">{githubProfile.publicRepos}</span>
                    <span className="text-slate-500 ml-1">repos</span>
                  </div>
                  <div>
                    <span className="text-white font-semibold">{githubProfile.followers}</span>
                    <span className="text-slate-500 ml-1">followers</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Languages */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Top Languages</h3>
            <div className="flex flex-wrap gap-2">
              {topLanguages?.map((lang, i) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

          {/* Top Repos */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Top Repositories</h3>
            <div className="space-y-3">
              {repositories?.slice(0, 5).map((repo) => (
                <div key={repo.name} className="flex items-center justify-between">
                  <span className="text-white text-sm truncate">{repo.name}</span>
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {repo.stars}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Content Preview */}
        <div className="lg:col-span-2 space-y-6">
          {generatedContent && (
            <>
              {/* Hero Section */}
              <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-8">
                <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Hero Section</span>
                <h2 className="text-3xl font-bold text-white mt-3">{generatedContent.hero?.headline}</h2>
                <p className="text-lg text-slate-300 mt-2">{generatedContent.hero?.subheadline}</p>
                <div className="mt-4">
                  <span className="inline-block px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg">
                    {generatedContent.hero?.ctaText}
                  </span>
                </div>
              </div>

              {/* About Section */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">About Section</span>
                <h3 className="text-xl font-semibold text-white mt-3">{generatedContent.about?.title}</h3>
                <div className="text-slate-300 mt-3 space-y-3">
                  {generatedContent.about?.paragraphs?.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {generatedContent.about?.highlights && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-slate-400 mb-2">Highlights</h4>
                    <ul className="space-y-1">
                      {generatedContent.about.highlights.map((h: string, i: number) => (
                        <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Skills Section */}
              {generatedContent.skills && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Skills</span>
                  <div className="mt-4 space-y-4">
                    {generatedContent.skills.categories?.map((cat: any, i: number) => (
                      <div key={i}>
                        <h4 className="text-sm font-medium text-white mb-2">{cat.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {cat.skills?.map((skill: string) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {generatedContent.projects?.featured && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Featured Projects</span>
                  <p className="text-slate-400 text-sm mt-2">{generatedContent.projects.description}</p>
                  <div className="mt-4 space-y-4">
                    {generatedContent.projects.featured.slice(0, 3).map((project: any, i: number) => (
                      <div key={i} className="p-4 bg-slate-900/50 rounded-xl">
                        <h4 className="text-white font-medium">{project.name}</h4>
                        <p className="text-slate-400 text-sm mt-1">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.techStack?.slice(0, 4).map((tech: string) => (
                            <span key={tech} className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Preview */}
              {generatedContent.meta && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">SEO Preview</span>
                  <div className="mt-4 p-4 bg-white rounded-xl">
                    <div className="text-blue-600 text-lg font-medium">{generatedContent.meta.pageTitle}</div>
                    <div className="text-green-700 text-sm">yourportfolio.contentstack.app</div>
                    <div className="text-gray-600 text-sm mt-1">{generatedContent.meta.metaDescription}</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Portfolio Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onDeploy}
          disabled={isDeploying}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-3 shadow-lg shadow-indigo-500/25"
        >
          {isDeploying ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Create Portfolio
            </>
          )}
        </button>
      </div>
    </div>
  );
}

