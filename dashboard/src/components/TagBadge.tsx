export default function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-900/50 text-sky-300 border border-sky-800/50">
      {tag}
    </span>
  );
}
