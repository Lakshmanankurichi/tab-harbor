export default function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 ring-1 ring-cyan-500/10">
      {tag}
    </span>
  );
}
