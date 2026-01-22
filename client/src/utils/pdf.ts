import { jsPDF } from "jspdf";
import { DISCLAIMER } from "../config/defaults";

export function makePdf({ ageGroup, topSchemas, note }: {
  ageGroup: string;
  topSchemas: Array<{ name: string; level: string; score: number }>;
  note?: string;
}) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Test Schematów — wyniki", 14, 18);
  doc.setFontSize(10);
  doc.text("Autorski test (etap badań standaryzacyjnych). Nie jest diagnozą.", 14, 26);

  doc.setFontSize(11);
  doc.text(`Grupa wiekowa: ${ageGroup}`, 14, 38);

  doc.setFontSize(12);
  doc.text("Najwyższe wyniki:", 14, 50);
  doc.setFontSize(11);

  let y = 60;
  for (const s of topSchemas) {
    doc.text(`• ${s.name} — ${s.level} (score: ${s.score})`, 14, y);
    y += 8;
  }

  y += 6;
  doc.setFontSize(10);
  const noteText = (note || "").trim();
  if (noteText) {
    doc.text("Notatka użytkownika:", 14, y);
    y += 8;
    const lines = doc.splitTextToSize(noteText, 180);
    doc.text(lines, 14, y);
    y += lines.length * 6;
  }

  y += 8;
  doc.setFontSize(9);
  const disc = doc.splitTextToSize(DISCLAIMER, 180);
  doc.text(disc, 14, y);

  return doc;
}
