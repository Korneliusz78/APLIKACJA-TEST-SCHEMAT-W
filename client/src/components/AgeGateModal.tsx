import { AGE_GROUPS, type AgeGroupId } from "../data/ageGroups";

export default function AgeGateModal({ open, onPick, onClose }: {
  open: boolean;
  onPick: (id: AgeGroupId) => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end">
      <div className="w-full max-w-md mx-auto rounded-t-3xl bg-slate-950 border border-slate-800 p-5 safe-pad">
        <div className="text-lg font-semibold">Wybierz grupę wiekową (krok 0)</div>
        <div className="text-sm text-slate-300 mt-1">Bez tego nie da się rozpocząć testu.</div>
        <div className="mt-4 grid gap-3">
          {AGE_GROUPS.map(g => (
            <button key={g.id} onClick={() => onPick(g.id)}
              className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-left">
              <div className="text-base font-semibold">{g.label}</div>
              <div className="text-sm text-slate-300">{g.hint}</div>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-5 w-full py-3 rounded-xl border border-slate-700 text-slate-200">Zamknij</button>
      </div>
    </div>
  );
}
