import { QUESTIONS } from "../data/questions";
import { SCHEMAS } from "../data/schemas";

export type Scores = Record<string, number>;

export function computeScores(answers: Record<string, number>): Scores {
  const scores: Scores = {};
  for (const q of QUESTIONS) {
    const v = Number(answers[q.id] ?? 0);
    scores[q.schemaId] = (scores[q.schemaId] || 0) + v;
  }
  return scores;
}

export function toLevel(score: number): "niski" | "sredni" | "wysoki" {
  if (score >= 9) return "wysoki";
  if (score >= 5) return "sredni";
  return "niski";
}

export function topSchemas(scores: Scores, n = 5) {
  const rows = Object.entries(scores)
    .map(([schemaId, score]) => {
      const meta = SCHEMAS.find(s => s.id === schemaId);
      return {
        id: schemaId,
        name: meta?.name || schemaId,
        domain: meta?.domain || "",
        score,
        level: toLevel(score)
      };
    })
    .sort((a, b) => b.score - a.score);
  return rows.slice(0, n);
}
