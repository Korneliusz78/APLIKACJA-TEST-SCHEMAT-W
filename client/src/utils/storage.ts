const KEY = "tschem:v1";

export type Persisted = {
  ageGroup?: string;
  answers?: Record<string, number>;
  completedAt?: string;
  bookingUrl?: string;
  phone?: string;
};

export function loadState(): Persisted {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveState(partial: Persisted) {
  const cur = loadState();
  const next = { ...cur, ...partial };
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function resetState() {
  localStorage.removeItem(KEY);
}
