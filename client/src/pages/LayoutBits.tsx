import { DISCLAIMER } from "../config/defaults";

export function PageShell({ title, children }: { title: string; children: any }) {
  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20">
      <div className="text-xl font-bold">{title}</div>
      <div className="mt-2 text-xs text-slate-300/90 border border-slate-800 rounded-xl p-3 bg-slate-900/40">
        {DISCLAIMER}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
