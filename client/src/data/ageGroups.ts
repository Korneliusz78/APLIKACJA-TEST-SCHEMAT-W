export const AGE_GROUPS = [
  { id: "dziecko", label: "Dziecko", hint: "Szkoła podstawowa" },
  { id: "nastolatek", label: "Nastolatek", hint: "13–18" },
  { id: "dorosly", label: "Dorosły", hint: "18+" },
] as const;

export type AgeGroupId = typeof AGE_GROUPS[number]["id"];
