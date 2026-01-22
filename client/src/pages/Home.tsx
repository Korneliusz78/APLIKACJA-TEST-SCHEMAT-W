import { useNavigate } from "react-router-dom";
import Tile from "../components/Tile";
import { loadState } from "../utils/storage";

export default function Home() {
  const nav = useNavigate();
  const st = loadState();
  const canContinue = Boolean(st.answers && Object.keys(st.answers || {}).length > 0);

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url(/assets/sunset.svg)" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-slate-950" />
      <div className="relative">
        <div className="mx-auto max-w-md px-4 pt-8 pb-20 safe-top">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-2xl font-black">DR</span>
            </div>
            <div>
              <div className="text-lg font-extrabold leading-tight">Psychoterapia Droga Rozwiązań</div>
              <div className="text-sm text-slate-200/90">Test Schematów — wersja mobilna</div>
            </div>
          </div>

          <div className="mt-5 text-sm text-slate-200/90">
            Telefonowy test + wyniki + AI „pytania po teście” + apteczka ćwiczeń. Kluczowe akcje są zawsze na wierzchu — bez zgadywania i bez scroll‑pułapek.
          </div>

          <div className="mt-6 grid gap-3">
            <Tile title="Zacznij test" subtitle="Wybór grupy wiekowej jest obowiązkowy (krok 0)." onClick={() => nav("/test")} tone="emerald" />
            {canContinue ? (
              <Tile title="Kontynuuj (zapisane lokalnie)" subtitle="Wracasz do miejsca, w którym przerwałeś/aś." onClick={() => nav("/test")} tone="sky" />
            ) : null}
            <Tile title="Apteczka: ćwiczenia 10–120 s" subtitle="Szybka regulacja: stres, złość, smutek." onClick={() => nav("/apteczka")} tone="orange" />
            <Tile title="Pytania do terapeuty (AI)" subtitle="Pytania prowadzone + odpowiedzi (bez diagnoz)." onClick={() => nav("/pytania")} tone="rose" />
            <Tile title="Kontakt i umawianie wizyty" subtitle="ZnanyLekarz + ustawienia linku." onClick={() => nav("/kontakt")} tone="emerald" />
          </div>
        </div>
      </div>
    </div>
  );
}
