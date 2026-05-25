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
      <body className={`${inter.className} bg-slate-950 text-slate-200 min-h-screen`}>
        <nav className="border-b border-slate-800 sticky top-0 z-10 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5 font-bold text-white hover:text-sky-400 transition-colors">
              <span className="text-xl">⚓</span>
              <span>Tab Harbor</span>
            </a>
            <span className="text-xs text-slate-500">Your tabs, finally organized.</span>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
