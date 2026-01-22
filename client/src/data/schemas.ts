export type Schema = { id: string; name: string; domain: string; };

export const SCHEMAS: Schema[] = [
  { id: "porzucenie", name: "Porzucenie / Niestabilność", domain: "Rozłączenie i odrzucenie" },
  { id: "nieufnosc", name: "Nieufność / Skrzywdzenie", domain: "Rozłączenie i odrzucenie" },
  { id: "brak_milosci", name: "Deprywacja emocjonalna", domain: "Rozłączenie i odrzucenie" },
  { id: "wadliwosc", name: "Wadliwość / Wstyd", domain: "Rozłączenie i odrzucenie" },
  { id: "izolacja", name: "Izolacja społeczna / Wyobcowanie", domain: "Rozłączenie i odrzucenie" },

  { id: "zaleznosc", name: "Zależność / Niekompetencja", domain: "Upośledzona autonomia" },
  { id: "zagrozenie", name: "Podatność na zranienie / Katastrofizacja", domain: "Upośledzona autonomia" },
  { id: "uwiklanie", name: "Uwikłanie / Nie w pełni rozwinięte Ja", domain: "Upośledzona autonomia" },
  { id: "porazka", name: "Porażka", domain: "Upośledzona autonomia" },

  { id: "roszczenia", name: "Roszczeniowość / Wielkościowość", domain: "Upośledzone granice" },
  { id: "samokontrola", name: "Niewystarczająca samokontrola", domain: "Upośledzone granice" },

  { id: "uleglosc", name: "Uległość", domain: "Skierowanie na innych" },
  { id: "samouswiecenie", name: "Samo‑poświęcanie", domain: "Skierowanie na innych" },
  { id: "uznanie", name: "Poszukiwanie uznania", domain: "Skierowanie na innych" },

  { id: "negatywizm", name: "Negatywizm / Pesymizm", domain: "Nadmierna czujność" },
  { id: "hamowanie", name: "Hamowanie emocjonalne", domain: "Nadmierna czujność" },
  { id: "standardy", name: "Bezkompromisowe standardy", domain: "Nadmierna czujność" },
  { id: "kara", name: "Karanie", domain: "Nadmierna czujność" },
];
