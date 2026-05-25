import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tab Harbor',
  description: 'Your tabs, finally organized.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-slate-200 min-h-screen`}>
        <nav className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#080e1a]/80 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 font-bold text-white group">
              <span className="text-xl transition-all duration-300 group-hover:[filter:drop-shadow(0_0_10px_rgba(34,211,238,0.7))]">⚓</span>
              <span className="tracking-tight group-hover:text-cyan-300 transition-colors duration-200">Tab Harbor</span>
            </a>
            <span className="text-xs text-slate-600 hidden sm:block">Your tabs, finally organized.</span>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
        <footer className="border-t border-white/[0.04] mt-8 py-5">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-[11px] text-slate-700">
            <span>
              Built by{' '}
              <a
                href="https://github.com/Lakshmanankurichi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-cyan-400 transition-colors duration-150"
              >
                lakshmanankurichi
              </a>
            </span>
            <span className="flex items-center gap-1.5">
              Designed by
              <span className="text-slate-500 font-medium">Claude</span>
              <span className="text-slate-800">·</span>
              <span className="text-slate-800">Anthropic</span>
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
