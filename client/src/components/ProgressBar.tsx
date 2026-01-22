export default function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
      <div className="h-3 bg-emerald-500" style={{ width: `${v}%` }} />
    </div>
  );
}
