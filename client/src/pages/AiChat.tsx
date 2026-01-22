import { useMemo, useState } from "react";
import { PageShell } from "./LayoutBits";
import ChatBubble from "../components/ChatBubble";
import Tile from "../components/Tile";
import { loadState } from "../utils/storage";
import { buildSmsUrl, buildTelUrl, buildWhatsAppUrl } from "../utils/contact";
import { computeScores, topSchemas } from "../utils/scoring";
import { DEFAULT_BOOKING_URL, DEFAULT_CONTACT_PHONE, DEFAULT_CONTACT_MESSAGE } from "../config/defaults";

type Msg = { role: "user" | "ai"; text: string };
async function postJson(url: string, body: any) {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, data };
}

const QUICK_GOALS = [
  { id: "zrozumienie", title: "Zrozumieć wynik", subtitle: "Co to może znaczyć w codzienności?" },
  { id: "krok", title: "Pierwszy krok na dziś", subtitle: "Mały ruch w 24 h (bez spiny)." },
  { id: "cwiczenie", title: "Ćwiczenie na emocje", subtitle: "Dobór 10–120 s." },
  { id: "konsultacja", title: "Przygotowanie do konsultacji", subtitle: "Notatka i pytania." },
  { id: "relacje", title: "Relacje", subtitle: "Granice, prośby, komunikaty." },
] as const;

export default function AiChat() {
  const st = loadState();
  const bookingUrl = st.bookingUrl || DEFAULT_BOOKING_URL;
  const phone = st.phone || DEFAULT_CONTACT_PHONE;
  const scores = useMemo(() => computeScores(st.answers || {}), [st.answers]);
  const top = useMemo(() => topSchemas(scores, 5), [scores]);

  const context = useMemo(() => ({
    ageGroup: st.ageGroup || "",
    topSchemas: top.map(t => ({ name: t.name, level: t.level, score: t.score })),
  }), [st.ageGroup, top]);

  const [goal, setGoal] = useState<string>("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Jestem asystentką w aplikacji. Mogę pomóc zrozumieć wynik i zaproponować małe kroki (bez diagnoz).\n\nWybierz temat startowy (kafelki) albo wpisz pytanie." }
  ]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  function push(role: Msg["role"], t: string) {
    setMsgs(prev => [...prev, { role, text: t }]);
  }

  async function ask(userText: string) {
    const clean = userText.trim();
    if (!clean) return;

    push("user", clean);
    setText("");
    setBusy(true);

    const lead = goal ? `Cel rozmowy: ${goal}.` : "Cel rozmowy: nieokreślony — pomóż użytkownikowi doprecyzować.";
    const composed = `${lead}\n\n${clean}`;

    const r = await postJson("/api/ai", { message: composed, context: { ...context, goal } });
    if (r.ok && r.data?.reply) push("ai", String(r.data.reply));
    else if (r.data?.error === "OPENAI_NOT_CONFIGURED") push("ai", "AI nie jest skonfigurowane po stronie serwera (brak klucza). Administrator musi ustawić OPENAI_API_KEY w backendzie.");
    else push("ai", "Nie udało się uzyskać odpowiedzi. Spróbuj ponownie.");
    setBusy(false);
  }

  function pickGoal(g: string) {
    setGoal(g);
    push("ai", `OK. Startujemy od: ${g}.\n\nPowiedz mi: co jest teraz najbardziej kłopotliwe w Twojej codzienności (1 zdanie)?`);
  }

  return (
    <PageShell title="Pytania po teście (AI)">
      <div className="grid gap-3">
        {!goal ? (
          <div className="grid gap-3">
            {QUICK_GOALS.map(g => (
              <Tile key={g.id} title={g.title} subtitle={g.subtitle} onClick={() => pickGoal(g.title)} tone="rose" />
            ))}
            <div className="text-xs text-slate-300">
              Kontekst z testu: {context.topSchemas?.length ? "załadowany" : "brak (możesz i tak pytać)"}.
            </div>
          </div>
        ) : null}

        <div className="mt-2 grid gap-3">
          {msgs.map((m, i) => <ChatBubble key={i} role={m.role} text={m.text} />)}
        </div>

        <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/40 p-3">
          <textarea value={text} onChange={e => setText(e.target.value)}
            className="w-full min-h-[70px] rounded-xl bg-slate-950/50 border border-slate-700 p-3 text-sm"
            placeholder="Napisz pytanie… (krótko, 1–3 zdania)"
          />
          <button disabled={busy} onClick={() => ask(text)}
            className="mt-2 w-full py-3 rounded-xl border border-rose-500/40 bg-rose-500/15 font-semibold disabled:opacity-50">
            {busy ? "Myślę…" : "Wyślij"}
          </button>
        </div>

<div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
  <div className="text-sm font-semibold">Kontakt z terapeutą</div>
  <div className="mt-1 text-xs text-slate-300">
    Jeśli chcesz przejść z „gadania z aplikacją” do realnej rozmowy — masz tu najkrótsze ścieżki.
  </div>
  <div className="mt-3 grid gap-3">
    <Tile title="Umów wizytę" subtitle="Rejestracja (ZnanyLekarz)." onClick={() => window.open(bookingUrl, "_blank")}
      tone="emerald" right={<span className="text-xs">↗</span>} />
    <Tile title="WhatsApp" subtitle="Napisz z gotowym szablonem." onClick={() => window.open(buildWhatsAppUrl(phone, DEFAULT_CONTACT_MESSAGE), "_blank")}
      tone="emerald" right={<span className="text-xs">↗</span>} />
    <Tile title="SMS" subtitle="Otwórz SMS z gotowym tekstem." onClick={() => { window.location.href = buildSmsUrl(phone, DEFAULT_CONTACT_MESSAGE); }}
      tone="sky" />
    <Tile title="Zadzwoń" subtitle="Połączenie telefoniczne." onClick={() => { window.location.href = buildTelUrl(phone); }}
      tone="orange" />
  </div>
  <div className="mt-3 text-xs text-slate-400">
    Uwaga: nie podawaj w czacie AI danych wrażliwych. W razie potrzeby skontaktuj się bezpośrednio.
  </div>
</div>
      </div>
    </PageShell>
  );
}
