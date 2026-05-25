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
      </body>
    </html>
  );
}
