import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
app.disable("x-powered-by");

const PORT = Number(process.env.PORT || 8787);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const RESULTS_TO = process.env.RESULTS_TO || "jacekjankowski.drogarozwiazan@gmail.com";
const MAIL_FROM = process.env.MAIL_FROM || "Test Schematów <no-reply@drogarozwiazan.pl>";

const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_SECURE = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: "500kb" }));

app.use("/api/", rateLimit({
  windowMs: 60_000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
}));

function buildAiSystemPrompt() {
  return [
    "Jesteś asystentką w aplikacji terapeutycznej Jacka Jankowskiego (Psychoterapia Droga Rozwiązań).",
    "Twoja rola: psychoedukacja, porządkowanie myśli, propozycje małych kroków, dyskretne ćwiczenia samoregulacji.",
    "Zasady bezpieczeństwa:",
    "- Nie stawiaj diagnoz ani nie przedstawiaj wyniku jako rozpoznania klinicznego.",
    "- Zawsze przypominaj: to autorski test na etapie badań standaryzacyjnych, nie zastępuje konsultacji.",
    "- Jeśli użytkownik opisuje myśli samobójcze lub przemoc: zasugeruj natychmiastowy kontakt z 112 i lokalnymi służbami wsparcia oraz konsultację specjalistyczną.",
    "- Nie proś o dane wrażliwe (PESEL, adres, dane dzieci).",
    "Styl: po polsku, krótko, zwięźle, konkretne pytania, bez lania wody."
  ].join("\n");
}

function sanitizeContext(ctx) {
  const allowed = {};
  if (!ctx || typeof ctx !== "object") return allowed;
  if (typeof ctx.ageGroup === "string") allowed.ageGroup = ctx.ageGroup.slice(0, 50);
  if (Array.isArray(ctx.topSchemas)) {
    allowed.topSchemas = ctx.topSchemas.slice(0, 5).map(s => ({
      name: String(s?.name || "").slice(0, 80),
      level: String(s?.level || "").slice(0, 20),
      score: Number.isFinite(s?.score) ? s.score : undefined
    }));
  }
  if (typeof ctx.goal === "string") allowed.goal = ctx.goal.slice(0, 80);
  return allowed;
}

async function callOpenAI({ userMessage, context }) {
  if (!OPENAI_API_KEY) {
    const err = new Error("OPENAI_NOT_CONFIGURED");
    err.code = "OPENAI_NOT_CONFIGURED";
    throw err;
  }

  const sys = buildAiSystemPrompt();
  const ctx = sanitizeContext(context);
  const user = [
    "Kontekst (z testu):",
    JSON.stringify(ctx, null, 2),
    "",
    "Wiadomość użytkownika:",
    userMessage
  ].join("\n");

  const headers = {
    "Authorization": `Bearer ${OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  };

  // responses endpoint (preferred)
  try {
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: [
          { role: "system", content: sys },
          { role: "user", content: user }
        ],
        temperature: 0.5,
        max_output_tokens: 450
      })
    });
    if (r.ok) {
      const data = await r.json();
      const text = (data.output_text || "").trim();
      if (text) return text;
    }
  } catch {}

  // fallback: chat.completions
  const r2 = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user }
      ],
      temperature: 0.5,
      max_tokens: 450
    })
  });

  if (!r2.ok) {
    const t = await r2.text().catch(() => "");
    const err = new Error("OPENAI_REQUEST_FAILED");
    err.detail = t.slice(0, 800);
    throw err;
  }
  const data2 = await r2.json();
  const text2 = (data2?.choices?.[0]?.message?.content || "").trim();
  return text2 || "Nie udało się wygenerować odpowiedzi. Spróbuj ponownie za chwilę.";
}

app.post("/api/ai", async (req, res) => {
  try {
    const { message, context } = req.body || {};
    const userMessage = String(message || "").trim();
    if (!userMessage) return res.status(400).json({ error: "EMPTY_MESSAGE" });

    const reply = await callOpenAI({ userMessage, context });
    res.json({ reply });
  } catch (e) {
    const code = e?.code || e?.message || "AI_ERROR";
    res.status(500).json({ error: code, detail: String(e?.detail || "").slice(0, 300) });
  }
});

function smtpConfigured() {
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);
}
function createTransporter() {
  if (!smtpConfigured()) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });
}
function buildResultsEmail({ results, meta }) {
  const safeMeta = {
    ageGroup: String(meta?.ageGroup || ""),
    date: new Date().toISOString(),
  };
  const top = Array.isArray(results?.topSchemas) ? results.topSchemas.slice(0, 8) : [];
  const lines = [];
  lines.push("Test Schematów — wyniki (autorski test, etap badań standaryzacyjnych; nie jest diagnozą).");
  lines.push("");
  lines.push(`Grupa wiekowa: ${safeMeta.ageGroup}`);
  lines.push(`Data: ${safeMeta.date}`);
  lines.push("");
  lines.push("Najwyższe wyniki (top):");
  for (const s of top) {
    const name = String(s?.name || "").slice(0, 120);
    const level = String(s?.level || "").slice(0, 20);
    const score = Number.isFinite(s?.score) ? s.score : "";
    lines.push(`- ${name}: ${level} ${score !== "" ? `(score: ${score})` : ""}`.trim());
  }
  lines.push("");
  lines.push("Notatka użytkownika (opcjonalnie):");
  lines.push(String(results?.note || "").slice(0, 1500));
  lines.push("");
  lines.push("Wygenerowane przez aplikację Test Schematów (PWA).");
  return lines.join("\n");
}

app.post("/api/email/send-results", async (req, res) => {
  try {
    const { consent, results, meta } = req.body || {};
    if (!consent) return res.status(400).json({ error: "NO_CONSENT" });

    const transporter = createTransporter();
    if (!transporter) return res.status(503).json({ error: "EMAIL_NOT_CONFIGURED" });

    const text = buildResultsEmail({ results, meta });

    await transporter.sendMail({
      from: MAIL_FROM,
      to: RESULTS_TO,
      subject: "Test Schematów — wyniki (z aplikacji)",
      text
    });

    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "EMAIL_SEND_FAILED" });
  }
});

// Serve static PWA (prod)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "public");

app.use(express.static(publicDir, { etag: true, maxAge: "1h" }));
app.get("*", (req, res) => res.sendFile(path.join(publicDir, "index.html")));app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "test-schematow",
    time: new Date().toISOString(),
    hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini"
  });
});


app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
