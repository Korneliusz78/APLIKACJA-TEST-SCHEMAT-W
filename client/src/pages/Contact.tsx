import { useEffect, useState } from "react";
import { PageShell } from "./LayoutBits";
import { DEFAULT_BOOKING_URL, DEFAULT_RESULTS_EMAIL, DEFAULT_CONTACT_PHONE, DEFAULT_CONTACT_MESSAGE } from "../config/defaults";
import { loadState, saveState } from "../utils/storage";
import { buildSmsUrl, buildTelUrl, buildWhatsAppUrl } from "../utils/contact";
import Tile from "../components/Tile";

export default function Contact() {
  const st = loadState();
  const [bookingUrl, setBookingUrl] = useState(st.bookingUrl || DEFAULT_BOOKING_URL);
  const [phone, setPhone] = useState(st.phone || DEFAULT_CONTACT_PHONE);

  useEffect(() => { saveState({ bookingUrl, phone }); }, [bookingUrl, phone]);

  return (
    <PageShell title="Kontakt i ustawienia">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="text-sm text-slate-300">Umawianie wizyty</div>
        <div className="text-sm mt-1">Link jest edytowalny (bez logowania).</div>
        <input value={bookingUrl} onChange={e => setBookingUrl(e.target.value)}
          className="mt-3 w-full rounded-xl bg-slate-950/50 border border-slate-700 p-3 text-sm" />
        <div className="mt-3">
          <Tile title="Umów wizytę" subtitle="Otwórz link w przeglądarce." onClick={() => window.open(bookingUrl, "_blank")}
            tone="emerald" right={<span className="text-xs">↗</span>} />
        </div>
      </div>


<div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
  <div className="text-sm text-slate-300">Szybki kontakt</div>
  <div className="text-sm mt-1">Telefon jest edytowalny (bez logowania).</div>
  <input value={phone} onChange={e => setPhone(e.target.value)}
    className="mt-3 w-full rounded-xl bg-slate-950/50 border border-slate-700 p-3 text-sm"
    inputMode="tel"
    aria-label="Numer telefonu do kontaktu"
  />
  <div className="mt-3 grid gap-3">
    <Tile title="WhatsApp" subtitle="Napisz z gotowym szablonem wiadomości." onClick={() => window.open(buildWhatsAppUrl(phone, DEFAULT_CONTACT_MESSAGE), "_blank")}
      tone="emerald" right={<span className="text-xs">↗</span>} />
    <Tile title="SMS" subtitle="Otwórz SMS z gotowym tekstem." onClick={() => { window.location.href = buildSmsUrl(phone, DEFAULT_CONTACT_MESSAGE); }}
      tone="sky" />
    <Tile title="Zadzwoń" subtitle="Połączenie telefoniczne." onClick={() => { window.location.href = buildTelUrl(phone); }}
      tone="orange" />
  </div>
  <div className="mt-3 text-xs text-slate-400">
    W wiadomości nie wysyłamy automatycznie wyników (prywatność). Możesz wkleić tylko to, co chcesz.
  </div>
</div>
      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="text-sm font-semibold">Wyniki (adres odbiorczy)</div>
        <div className="mt-1 text-sm text-slate-300">
          Wyniki są wysyłane na: <span className="font-semibold">{DEFAULT_RESULTS_EMAIL}</span>
        </div>
        <div className="mt-3 text-xs text-slate-400">
          Realna wysyłka wymaga konfiguracji SMTP w backendzie. W przeciwnym razie działa fallback przez mailto.
        </div>
      </div>
    </PageShell>
  );
}
