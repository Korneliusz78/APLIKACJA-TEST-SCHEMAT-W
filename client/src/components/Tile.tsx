import React from "react";

export default function Tile({
  title,
  subtitle,
  onClick,
  right,
  tone = "emerald"
}: {
  title: string;
  subtitle?: string;
  onClick?: () => void;
  right?: React.ReactNode;
  tone?: "emerald" | "orange" | "sky" | "rose";
}) {
  const toneClass = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15",
    orange: "border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/15",
    sky: "border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/15",
    rose: "border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/15",
  }[tone];

  return (
    <button onClick={onClick} className={"w-full text-left p-4 rounded-2xl border transition " + toneClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold leading-tight">{title}</div>
          {subtitle ? <div className="mt-1 text-sm text-slate-200/90">{subtitle}</div> : null}
        </div>
        {right ? <div className="text-slate-200/80">{right}</div> : <div className="text-slate-200/80">›</div>}
      </div>
    </button>
  );
}
