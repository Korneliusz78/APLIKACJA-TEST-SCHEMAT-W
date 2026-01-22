export function stripToDigits(raw: string): string {
  return (raw || "").replace(/\D+/g, "");
}

export function toE164PL(rawPhone: string): { e164: string; waDigits: string } {
  const d = stripToDigits(rawPhone);

  // Najczęstsze przypadki:
  // - 9 cyfr: 663061337  -> +48663061337
  // - 11 cyfr zaczynające się od 48: 48663061337 -> +48663061337
  // - 12 cyfr zaczynające się od 0048: 0048663061337 -> +48663061337
  let digits = d;

  if (digits.startsWith("0048")) digits = digits.slice(4);
  if (digits.length === 9) digits = "48" + digits;
  if (digits.length === 11 && digits.startsWith("48")) {
    // ok
  }

  const e164 = digits.startsWith("+") ? digits : "+" + digits;
  const waDigits = digits.startsWith("+") ? digits.slice(1) : digits; // wa.me bez plusa
  return { e164, waDigits };
}

export function buildWhatsAppUrl(rawPhone: string, message: string): string {
  const { waDigits } = toE164PL(rawPhone);
  return `https://wa.me/${waDigits}?text=${encodeURIComponent(message || "")}`;
}

export function buildSmsUrl(rawPhone: string, message: string): string {
  const { e164 } = toE164PL(rawPhone);
  const isIOS = typeof navigator !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const sep = isIOS ? "&" : "?";
  return `sms:${e164}${sep}body=${encodeURIComponent(message || "")}`;
}

export function buildTelUrl(rawPhone: string): string {
  const { e164 } = toE164PL(rawPhone);
  return `tel:${e164}`;
}
