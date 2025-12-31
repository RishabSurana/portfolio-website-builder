import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPortfolioBySlug, getAllPortfolioSlugs } from '@/lib/contentstack/delivery';
import {
  HeroSection,
  AboutSection,
  SkillsSection,
  ProjectsSection,
  ContactSection,
  Footer,
} from '@/components/portfolio';

interface PortfolioPageProps {
  params: Promise<{
    username: string;
  }>;
}

/**
 * Generate metadata for the portfolio page (SEO)
 */
export async function generateMetadata({ params }: PortfolioPageProps): Promise<Metadata> {

    debugger;
  const { username } = await params;
  const portfolio = await getPortfolioBySlug(username);

  debugger;
  if (!portfolio) {
    return {
      title: 'Portfolio Not Found',
      description: 'The requested portfolio could not be found.',
    };
  }

  return {
    title: portfolio.seo?.page_title || portfolio.title,
    description: portfolio.seo?.meta_description || portfolio.hero_section?.subheadline,
    keywords: portfolio?.seo?.keywords,
    openGraph: {
      title: portfolio.seo?.page_title || portfolio.title,
      description: portfolio.seo?.meta_description || portfolio.hero_section?.subheadline,
      images: portfolio.avatar?.url ? [portfolio.avatar.url] : [],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: portfolio.seo?.page_title || portfolio.title,
      description: portfolio.seo?.meta_description || portfolio.hero_section?.subheadline,
      images: portfolio.avatar?.url ? [portfolio.avatar.url] : [],
    },
  };
}

/**
 * Generate static paths for all portfolios (optional - for SSG)
 */
export async function generateStaticParams() {
  try {
    const slugs = await getAllPortfolioSlugs();
    return slugs.map((username) => ({ username }));
  } catch {
    // If fetching fails, return empty array (will use SSR)
    return [];
  }
}

/**
 * Portfolio Page Component
 */
export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { username } = await params;
  const portfolio = await getPortfolioBySlug(username);

  // If portfolio not found, show 404
  if (!portfolio) {
    notFound();
  }

  // Get style settings
  const style = portfolio.style_settings?.portfolio_style || 'modern';
  const colorScheme = portfolio.style_settings?.color_scheme || 'dark';

  return (
    <main
      className={`min-h-screen ${
        colorScheme === 'light' ? 'bg-white text-gray-900' : 'bg-slate-950 text-white'
      }`}
      data-style={style}
      data-scheme={colorScheme}
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="text-lg font-semibold text-white">
              {portfolio.github_metadata?.github_username || portfolio.title?.replace("'s Portfolio", '')}
            </a>
            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-sm text-slate-400 hover:text-white transition-colors">
                About
              </a>
              <a href="#skills" className="text-sm text-slate-400 hover:text-white transition-colors">
                Skills
              </a>
              <a href="#projects" className="text-sm text-slate-400 hover:text-white transition-colors">
                Projects
              </a>
              <a href="#contact" className="text-sm text-slate-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Portfolio Sections */}
      <HeroSection portfolio={portfolio} />
      <AboutSection portfolio={portfolio} />
      <SkillsSection portfolio={portfolio} />
      <ProjectsSection portfolio={portfolio} />
      <ContactSection portfolio={portfolio} />
      <Footer portfolio={portfolio} />
    </main>
  );
}

