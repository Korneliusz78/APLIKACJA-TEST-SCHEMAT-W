import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tile from "../components/Tile";
import { loadState } from "../utils/storage";
import { computeScores, topSchemas } from "../utils/scoring";
import {
  DISCLAIMER,
  DEFAULT_BOOKING_URL,
  DEFAULT_CONTACT_PHONE,
  DEFAULT_CONTACT_MESSAGE
} from "../config/defaults";
import { makePdf } from "../utils/pdf";
import { buildSmsUrl, buildTelUrl, buildWhatsAppUrl } from "../utils/contact";

async function postJson(url: string, body: any) {
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, data };
}

export default function Results() {
  const nav = useNavigate();
  const st = loadState();

  const [note, setNote] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<string>("");

  const scores = useMemo(() => computeScores(st.answers || {}), [st.answers]);
  const top = useMemo(() => topSchemas(scores, 5), [scores]);

  const ageGroup = st.ageGroup || "—";
  const bookingUrl = st.bookingUrl || DEFAULT_BOOKING_URL;
  const phone = st.phone || DEFAULT_CONTACT_PHONE;

  function downloadPdf() {
    const doc = makePdf({
      ageGroup: String(ageGroup),
      topSchemas: top.map(t => ({ name: t.name, level: t.level, score: t.score })),
      note
    });
    doc.save("test-schematow-wyniki.pdf");
  }

  async function sendEmail() {
    setStatus("");

    if (!consent) {
      setStatus("Zaznacz zgodę na udostępnienie wyników.");
      return;
    }

    setSending(true);

    try {
      const payload = {
        consent: true,
        results: {
          topSchemas: top.map(function (t) {
            return { name: t.name, level: t.level, score: t.score };
          }),
          note: String(note || "").trim()
        },
        meta: { ageGroup: ageGroup }
      };

      const r = await postJson("/api/email/send-results", payload);

      if (r.ok) {
        setStatus("Wysłano.");
        return;
      }

      // Fallback: jeśli backend maila nie jest skonfigurowany, otwórz mailto
      const subject = encodeURIComponent("Test Schematów — wyniki (z aplikacji)");
      const lines: string[] = [
        "Test Schematów — wyniki (autorski test; nie jest diagnozą).",
        "",
        "Grupa wiekowa: " + String(ageGroup),
        "",
        "Top wyniki:"
      ];

      top.forEach(function (t) {
        lines.push("- " + t.name + ": " + t.level + " (score: " + t.score + ")");
      });

      lines.push("");
      lines.push("Notatka:");
      lines.push(String(note || "").trim());

      const body = encodeURIComponent(lines.join("\n"));
      const email = "jacekjankowski.drogarozwiazan@gmail.com";

      window.location.href =
        "mailto:" +
        encodeURIComponent(email) +
        "?subject=" +
        subject +
        "&body=" +
        body;

      setStatus("Otwieram klienta poczty (brak SMTP na serwerze).");
    } catch (e) {
      setStatus("Nie udało się wysłać. Spróbuj ponownie.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 pt-6 pb-20">
      <div className="text-xl font-bold">Wyniki</div>
      <div className="mt-2 text-xs text-slate-300/90 border border-slate-800 rounded-xl p-3 bg-slate-900/40">
        {DISCLAIMER}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="text-sm text-slate-300">Grupa wiekowa</div>
        <div className="text-base font-semibold">{String(ageGroup)}</div>

        <div className="mt-4 text-sm text-slate-300">Top obszary</div>
        <div className="mt-2 grid gap-2">
          {top.map(t => (
            <div
              key={t.id}
              className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10"
            >
              <div className="text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-slate-200/80">{t.domain}</div>
              <div className="mt-1 text-xs text-slate-200/80">
                Poziom: <span className="font-semibold">{t.level}</span> • score:{" "}
                {t.score}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="text-sm font-semibold">Notatka (opcjonalnie)</div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          className="mt-2 w-full min-h-[90px] rounded-xl bg-slate-950/50 border border-slate-700 p-3 text-sm"
          placeholder="Jeśli chcesz — dopisz 2–3 zdania: co jest teraz najtrudniejsze, co chcesz zrozumieć."
        />
        <div className="mt-3 grid gap-3">
          <Tile
            title="Porozmawiaj o wyniku (AI)"
            subtitle="Pytania prowadzone + odpowiedzi dopasowane do wyniku."
            onClick={() => nav("/pytania")}
            tone="rose"
          />
          <Tile
            title="Pobierz PDF"
            subtitle="Zapisz wynik lokalnie (bez wysyłki)."
            onClick={downloadPdf}
            tone="sky"
          />
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="text-sm font-semibold">Wyślij wyniki do terapeuty</div>
        <label className="mt-3 flex items-start gap-3 text-sm text-slate-200">
          <input
            type="checkbox"
            className="mt-1"
            checked={consent}
            onChange={e => setConsent(e.target.checked)}
          />
          <span>Zgadzam się na udostępnienie wyników terapeucie (świadomie).</span>
        </label>

        <button
          onClick={sendEmail}
          disabled={sending}
          className="mt-3 w-full py-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/20 font-semibold disabled:opacity-50"
        >
          {sending ? "Wysyłam…" : "Wyślij wyniki"}
        </button>

        {status ? <div className="mt-2 text-xs text-slate-300">{status}</div> : null}
      </div>

      <div className="mt-4 grid gap-3">
        <Tile
          title="Umów wizytę"
          subtitle="Przejdź do rejestracji (ZnanyLekarz)."
          onClick={() => window.open(bookingUrl, "_blank")}
          tone="emerald"
          right={<span className="text-xs">↗</span>}
        />
        <Tile
          title="WhatsApp"
          subtitle="Napisz do terapeuty z gotowym szablonem."
          onClick={() =>
            window.open(buildWhatsAppUrl(phone, DEFAULT_CONTACT_MESSAGE), "_blank")
          }
          tone="emerald"
          right={<span className="text-xs">↗</span>}
        />
        <Tile
          title="SMS"
          subtitle="Otwórz SMS z gotowym tekstem."
          onClick={() => {
            window.location.href = buildSmsUrl(phone, DEFAULT_CONTACT_MESSAGE);
          }}
          tone="sky"
        />
        <Tile
          title="Zadzwoń"
          subtitle="Połączenie telefoniczne."
          onClick={() => {
            window.location.href = buildTelUrl(phone);
          }}
          tone="orange"
        />
        <button
          onClick={() => nav("/test")}
          className="w-full py-3 rounded-xl border border-slate-700 bg-slate-900/40"
        >
          Wróć do testu
        </button>
      </div>
    </div>
  );
}
