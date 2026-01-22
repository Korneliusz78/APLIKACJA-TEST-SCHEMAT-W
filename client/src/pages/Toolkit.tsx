import { useMemo, useState } from "react";
import { PageShell } from "./LayoutBits";
import { EXERCISES, type Exercise } from "../data/exercises";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m ? `${m}:${String(r).padStart(2, "0")}` : `${r}s`;
}

function Timer({ ex, onClose }: { ex: Exercise; onClose: () => void }) {
  const [left, setLeft] = useState(ex.seconds);
  const [run, setRun] = useState(false);

  useMemo(() => {
    if (!run) return;
    const t = setInterval(() => {
      setLeft(prev => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [run]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end">
      <div className="w-full max-w-md mx-auto rounded-t-3xl bg-slate-950 border border-slate-800 p-5 safe-pad">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">{ex.title}</div>
            <div className="text-xs text-slate-300">Cel: {ex.goal} • Czas: {formatTime(ex.seconds)}</div>
          </div>
          <button onClick={onClose} className="px-3 py-2 rounded-xl border border-slate-700">Zamknij</button>
        </div>

        <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <div className="text-3xl font-black">{formatTime(left)}</div>
          <div className="mt-2 text-xs text-slate-300">Uruchom i idź krok po kroku.</div>
          <div className="mt-3 flex gap-3">
            <button onClick={() => setRun(true)} className="flex-1 py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/20 font-semibold"
              disabled={run || left === 0}>Start</button>
            <button onClick={() => { setRun(false); setLeft(ex.seconds); }} className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-900/40">Reset</button>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {ex.steps.map((s, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-800 bg-slate-900/30 text-sm">{i + 1}. {s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Toolkit() {
  const [filter, setFilter] = useState<"" | "stres" | "zlosc" | "smutek">("");
  const [open, setOpen] = useState<Exercise | null>(null);

  const list = useMemo(() => (filter ? EXERCISES.filter(e => e.goal === filter) : EXERCISES), [filter]);

  return (
    <PageShell title="Apteczka (ćwiczenia 10–120 s)">
      <div className="grid grid-cols-4 gap-2">
        {[
          { id: "", label: "Wszystko" },
          { id: "stres", label: "Stres" },
          { id: "zlosc", label: "Złość" },
          { id: "smutek", label: "Smutek" },
        ].map(b => (
          <button key={b.id} onClick={() => setFilter(b.id as any)}
            className={"py-2 rounded-xl border text-xs " + (filter === (b.id as any) ? "border-emerald-500/40 bg-emerald-500/15" : "border-slate-700 bg-slate-900/40")}>
            {b.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3">
        {list.map(ex => (
          <button key={ex.id} onClick={() => setOpen(ex)} className="p-4 rounded-2xl border border-slate-800 bg-slate-900/40 text-left hover:bg-slate-900/55">
            <div className="text-base font-semibold">{ex.title}</div>
            <div className="mt-1 text-sm text-slate-300">Cel: {ex.goal} • Czas: {formatTime(ex.seconds)}</div>
            <div className="mt-2 text-xs text-slate-400">Dotknij, aby uruchomić timer.</div>
          </button>
        ))}
      </div>

      {open ? <Timer ex={open} onClose={() => setOpen(null)} /> : null}
    </PageShell>
  );
}
