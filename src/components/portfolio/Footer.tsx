import { PortfolioEntry } from '@/lib/contentstack/delivery';

interface FooterProps {
  portfolio: PortfolioEntry;
}

export function Footer({ portfolio }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const generatedDate = portfolio.generated_at 
    ? new Date(portfolio.generated_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    : null;

  return (
    <footer className="py-8 bg-slate-950 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-slate-500">
            © {currentYear} {portfolio.title?.replace("'s Portfolio", '')}. All rights reserved.
          </p>

          {/* Powered by */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Powered by</span>
            <a
              href="https://www.contentstack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
            >
              Contentstack
            </a>
            <span>+</span>
            <span className="text-violet-400">AI</span>
          </div>
        </div>

        {/* Generation info */}
        {generatedDate && (
          <p className="text-center text-xs text-slate-600 mt-4">
            Portfolio generated on {generatedDate}
          </p>
        )}
      </div>
    </footer>
  );
}

