import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AGE_GROUPS, type AgeGroupId } from "../data/ageGroups";
import { QUESTIONS, SCALE } from "../data/questions";
import { loadState, saveState } from "../utils/storage";
import AgeGateModal from "../components/AgeGateModal";
import ProgressBar from "../components/ProgressBar";

export default function Test() {
  const nav = useNavigate();
  const persisted = loadState();

  const [ageGroup, setAgeGroup] = useState<AgeGroupId | "">((persisted.ageGroup as any) || "");
  const [answers, setAnswers] = useState<Record<string, number>>(persisted.answers || {});
  const [idx, setIdx] = useState<number>(0);
  const [showGate, setShowGate] = useState<boolean>(false);

  const total = QUESTIONS.length;
  const q = QUESTIONS[idx];

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = useMemo(() => Math.round((idx / total) * 100), [idx, total]);

  useEffect(() => { saveState({ ageGroup: ageGroup || undefined, answers }); }, [ageGroup, answers]);

  useEffect(() => {
    const firstUnanswered = QUESTIONS.findIndex(x => answers[x.id] === undefined);
    if (firstUnanswered >= 0) setIdx(firstUnanswered);
  }, []);

  function requireAgeThen(fn: () => void) {
    if (!ageGroup) { setShowGate(true); return; }
    fn();
  }

  function onPickAge(id: AgeGroupId) {
    setAgeGroup(id);
    saveState({ ageGroup: id });
    setShowGate(false);
  }

  function setAnswer(v: number) {
    setAnswers(prev => ({ ...prev, [q.id]: v }));
  }

  function next() {
    if (answers[q.id] === undefined) return;
    if (idx < total - 1) setIdx(idx + 1);
  }
  function prev() { if (idx > 0) setIdx(idx - 1); }

  function finish() {
    if (!ageGroup) return setShowGate(true);
    for (const qq of QUESTIONS) if (answers[qq.id] === undefined) return;
    saveState({ completedAt: new Date().toISOString() });
    nav("/results");
  }

  const ageLabel = ageGroup ? AGE_GROUPS.find(g => g.id === ageGroup)?.label : "";

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xl font-bold">Test</div>
          <div className="text-sm text-slate-300 mt-1">Krok 0: grupa wiekowa jest obowiązkowa.</div>
        </div>
        <button
          className={"px-3 py-2 rounded-xl border " + (ageGroup ? "border-emerald-500/30 bg-emerald-500/10" : "border-slate-700 bg-slate-900/40")}
          onClick={() => setShowGate(true)}
        >
          <div className="text-xs text-slate-300">Grupa</div>
          <div className="text-sm font-semibold">{ageLabel || "Wybierz"}</div>
        </button>
      </div>

      <div className="mt-4">
        <ProgressBar value={progress} />
        <div className="mt-1 text-xs text-slate-300">{idx + 1} / {total} • zapisane: {answeredCount}</div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="text-sm text-slate-300">Pytanie</div>
        <div className="mt-1 text-base font-semibold leading-snug">{q.text}</div>

        <div className="mt-4 grid gap-2">
          {SCALE.map(s => (
            <button
              key={s.value}
              onClick={() => requireAgeThen(() => setAnswer(s.value))}
              className={
                "w-full px-4 py-3 rounded-xl border text-left transition " +
                ((answers[q.id] === s.value)
                  ? "border-emerald-500/40 bg-emerald-500/15"
                  : "border-slate-700 bg-slate-950/40 hover:bg-slate-900/50")
              }
            >
              <div className="text-sm font-semibold">{s.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={prev} className="py-3 rounded-xl border border-slate-700 bg-slate-900/40 disabled:opacity-40" disabled={idx === 0}>
          Wstecz
        </button>
        <button
          onClick={() => requireAgeThen(next)}
          className="py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/15 disabled:opacity-40"
          disabled={answers[q.id] === undefined || idx === total - 1}
        >
          Dalej
        </button>
      </div>

      <div className="mt-3">
        <button
          onClick={() => requireAgeThen(finish)}
          className="w-full py-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/20 font-semibold disabled:opacity-40"
          disabled={!ageGroup || Object.keys(answers).length !== total}
        >
          Zakończ test i zobacz wyniki
        </button>
      </div>

      <AgeGateModal open={showGate} onPick={onPickAge} onClose={() => setShowGate(false)} />
    </div>
  );
}
