export default function EmptyState({ hasSearch }: { hasSearch?: boolean }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
        <div className="text-4xl mb-4 opacity-60">🔍</div>
        <h3 className="text-base font-semibold text-slate-300 mb-1">No sessions found</h3>
        <p className="text-slate-600 text-sm">Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
      {/* Animated harbor scene */}
      <div className="relative mb-8 w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-cyan-500/5 border border-cyan-500/10" />
        <div className="absolute inset-2 rounded-full bg-cyan-500/5 animate-ping opacity-25" />
        <img
          src="/anchor.svg"
          alt="Tab Harbor"
          width={52}
          height={52}
          className="relative z-10 rounded-xl"
          style={{ animation: 'anchor-pulse 3s ease-in-out infinite' }}
        />
      </div>

      {/* Wave bars */}
      <div className="flex items-end gap-1 mb-7 h-5">
        {[0, 0.3, 0.6, 0.9, 1.2].map((delay, i) => (
          <div
            key={i}
            className="w-1 rounded-full bg-cyan-700/50"
            style={{
              height: `${[12, 18, 14, 20, 10][i]}px`,
              animation: `wave-bob 2s ease-in-out infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      <h3 className="text-xl font-semibold text-slate-200 mb-2 tracking-tight">
        No harbored sessions yet
      </h3>
      <p className="text-slate-500 text-sm max-w-xs mb-7 leading-relaxed">
        Install the Tab Harbor Chrome extension and click{' '}
        <strong className="text-slate-400 font-medium">Harbor All Tabs</strong>{' '}
        to save your first session.
      </p>

      <div className="glass rounded-xl p-4 text-left text-sm text-slate-500 max-w-xs w-full">
        <p className="font-medium text-slate-400 mb-2.5 text-xs uppercase tracking-wider">Quick start</p>
        <ol className="space-y-2">
          {[
            <>Load extension at <code className="text-cyan-400 text-[11px] bg-cyan-950/50 px-1 py-0.5 rounded">chrome://extensions</code></>,
            'Open a bunch of tabs',
            'Click ⚓ in your toolbar',
            <><strong className="text-slate-300 font-medium">Harbor All Tabs</strong> — done!</>,
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-cyan-950 border border-cyan-800/50 text-cyan-400 text-[10px] font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="leading-snug">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
