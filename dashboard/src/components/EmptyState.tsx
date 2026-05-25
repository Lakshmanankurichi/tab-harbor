export default function EmptyState({ hasSearch }: { hasSearch?: boolean }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-slate-300 mb-1">No sessions found</h3>
        <p className="text-slate-500 text-sm">Try a different search term.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-6">⚓</div>
      <h3 className="text-xl font-semibold text-slate-200 mb-2">No harbored sessions yet</h3>
      <p className="text-slate-400 text-sm max-w-sm mb-6">
        Install the Tab Harbor Chrome extension and click <strong className="text-slate-300">Harbor All Tabs</strong> to save your first session.
      </p>
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-left text-sm text-slate-400 max-w-sm">
        <p className="font-medium text-slate-300 mb-2">Quick start</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Load the extension in <code className="text-sky-400">chrome://extensions</code></li>
          <li>Open a bunch of tabs</li>
          <li>Click ⚓ in your toolbar</li>
          <li>Hit <strong className="text-slate-300">Harbor All Tabs</strong></li>
        </ol>
      </div>
    </div>
  );
}
