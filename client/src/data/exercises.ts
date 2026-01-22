export type Exercise = {
  id: string;
  title: string;
  goal: "stres" | "zlosc" | "smutek";
  seconds: number;
  steps: string[];
};

export const EXERCISES: Exercise[] = [
  { id: "oddech_2x", title: "Dwa spokojne wydechy", goal: "stres", seconds: 40, steps: ["Wdech nosem 3–4 s.", "Wydech ustami 6–8 s.", "Powtórz 4 razy. Skup się na dłuższym wydechu."] },
  { id: "panorama", title: "Panoramiczne widzenie", goal: "stres", seconds: 60, steps: ["Rozluźnij szczękę i barki.", "Złap wzrokiem szeroko: lewo–prawo bez ruszania głową.", "Nazwij 5 rzeczy w polu widzenia."] },
  { id: "humming", title: "Mruczenie (wibracja)", goal: "smutek", seconds: 45, steps: ["Zamknij usta, weź spokojny wdech.", "Mrucz cicho na wydechu (mmm) 6–8 s.", "Powtórz 4 razy."] },
  { id: "zimny_oklad", title: "Chłód na twarz (dyskretnie)", goal: "stres", seconds: 30, steps: ["Przyłóż chłodny kompres do policzków/okolic oczu (jeśli masz).", "Oddychaj wolno.", "Uwaga: pomiń, jeśli źle się czujesz."] },
  { id: "rozluznij_dlonie", title: "Rozluźnij dłonie i palce", goal: "zlosc", seconds: 50, steps: ["Zaciśnij pięści na 3 s.", "Puść i rozczapierz palce.", "Powtórz 6 razy."] },
  { id: "3fakty", title: "Trzy fakty tu-i-teraz", goal: "smutek", seconds: 60, steps: ["Powiedz sobie: 'Jestem tu. Jestem bezpieczny/a w tej chwili.'", "Wypisz w głowie 3 fakty: co widzę, co słyszę, co czuję w stopach.", "Zrób jeden mały ruch: oprzyj stopy mocniej."] },
  { id: "przerwa_10s", title: "Przerwa 10 sekund", goal: "zlosc", seconds: 30, steps: ["Zatrzymaj się. Nie odpowiadaj od razu.", "Wdech 3 s, wydech 6 s (2 razy).", "Dopiero potem podejmij decyzję."] },
  { id: "mikro_plan", title: "Mikro‑plan (1 krok)", goal: "stres", seconds: 90, steps: ["Nazwij problem w 1 zdaniu.", "Powiedz: 'Jaki jest najmniejszy krok w 24 h?'", "Wybierz 1 rzecz, którą zrobisz."] },
];
