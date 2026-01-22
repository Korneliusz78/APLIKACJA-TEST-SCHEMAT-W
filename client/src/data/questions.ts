export type Question = { id: string; text: string; schemaId: string; };
const mk = (schemaId: string, idx: number, text: string): Question => ({ id: `${schemaId}_${idx}`, schemaId, text });

export const QUESTIONS: Question[] = [
  mk("porzucenie", 1, "Boję się, że ważne osoby mogą mnie zostawić."),
  mk("porzucenie", 2, "Trudno mi zaufać, że relacja jest stabilna."),
  mk("porzucenie", 3, "Gdy ktoś jest mniej dostępny, od razu robi mi się ciężko."),

  mk("nieufnosc", 1, "Często spodziewam się, że ktoś mnie skrzywdzi lub wykorzysta."),
  mk("nieufnosc", 2, "Trzymam dystans, bo inaczej mogę zostać zraniony/a."),
  mk("nieufnosc", 3, "Gdy ktoś jest miły, podejrzewam ukryty interes."),

  mk("brak_milosci", 1, "Czuję, że moje potrzeby emocjonalne nie są ważne dla innych."),
  mk("brak_milosci", 2, "Rzadko czuję się naprawdę zrozumiany/a."),
  mk("brak_milosci", 3, "Często mam poczucie pustki emocjonalnej."),

  mk("wadliwosc", 1, "W głębi czuję, że jest ze mną 'coś nie tak'."),
  mk("wadliwosc", 2, "Wstydzę się części siebie i wolę ich nie pokazywać."),
  mk("wadliwosc", 3, "Boję się, że gdy ktoś pozna mnie bliżej, odrzuci mnie."),

  mk("izolacja", 1, "Często czuję się inny/a niż ludzie wokół."),
  mk("izolacja", 2, "Mam wrażenie, że nie pasuję."),
  mk("izolacja", 3, "Trudno mi poczuć prawdziwą przynależność."),

  mk("zaleznosc", 1, "Trudno mi podejmować decyzje bez wsparcia innych."),
  mk("zaleznosc", 2, "Szybko wątpię w swoje kompetencje."),
  mk("zaleznosc", 3, "Łatwo czuję się przytłoczony/a codziennością."),

  mk("zagrozenie", 1, "Często przewiduję najgorszy scenariusz."),
  mk("zagrozenie", 2, "Mam poczucie, że coś złego może się zaraz wydarzyć."),
  mk("zagrozenie", 3, "Trudno mi się rozluźnić, bo czuję stałe zagrożenie."),

  mk("uwiklanie", 1, "Trudno mi odróżnić moje potrzeby od potrzeb bliskich osób."),
  mk("uwiklanie", 2, "Czuję, że moja tożsamość jest mocno związana z relacją."),
  mk("uwiklanie", 3, "Czuję winę, gdy wybieram siebie."),

  mk("porazka", 1, "Wierzę, że i tak mi się nie uda."),
  mk("porazka", 2, "Często porównuję się i wypadam gorzej."),
  mk("porazka", 3, "Unikam wyzwań, bo boję się porażki."),

  mk("roszczenia", 1, "Trudno mi zaakceptować ograniczenia lub zasady."),
  mk("roszczenia", 2, "Czuję, że powinno być po mojemu, bo inaczej jest 'niesprawiedliwie'."),
  mk("roszczenia", 3, "Łatwo się frustruję, gdy nie dostaję tego, czego chcę."),

  mk("samokontrola", 1, "Trudno mi odroczyć przyjemność lub wytrwać w planie."),
  mk("samokontrola", 2, "Działam impulsywnie, a potem żałuję."),
  mk("samokontrola", 3, "Szybko rezygnuję, gdy robi się niewygodnie."),

  mk("uleglosc", 1, "Często robię to, czego chcą inni, nawet kosztem siebie."),
  mk("uleglosc", 2, "Trudno mi powiedzieć 'nie'."),
  mk("uleglosc", 3, "Boje się konfliktu, więc ustępuję."),

  mk("samouswiecenie", 1, "Często stawiam potrzeby innych ponad swoje."),
  mk("samouswiecenie", 2, "Czuję się odpowiedzialny/a za emocje innych."),
  mk("samouswiecenie", 3, "Mam poczucie winy, gdy odpoczywam."),

  mk("uznanie", 1, "Potrzebuję potwierdzenia z zewnątrz, żeby czuć się OK."),
  mk("uznanie", 2, "Bardzo przejmuję się, jak wypadam w oczach innych."),
  mk("uznanie", 3, "Łatwo uzależniam nastrój od opinii innych."),

  mk("negatywizm", 1, "Szybciej widzę ryzyko niż szansę."),
  mk("negatywizm", 2, "Często spodziewam się, że coś pójdzie nie tak."),
  mk("negatywizm", 3, "Trudno mi cieszyć się, bo myślę o problemach."),

  mk("hamowanie", 1, "Trzymam emocje w środku, nawet gdy jest mi ciężko."),
  mk("hamowanie", 2, "Czuję napięcie, gdy mam pokazać uczucia."),
  mk("hamowanie", 3, "Wolę być 'opanowany/a' niż autentyczny/a."),

  mk("standardy", 1, "Stawiam sobie bardzo wysokie wymagania."),
  mk("standardy", 2, "Czuję presję, żeby być lepszy/a, szybciej, mocniej."),
  mk("standardy", 3, "Odpoczynek budzi we mnie poczucie winy."),

  mk("kara", 1, "Gdy popełnię błąd, surowo się oceniam."),
  mk("kara", 2, "Trudno mi sobie wybaczyć."),
  mk("kara", 3, "Wierzę, że za błędy trzeba 'zapłacić'."),
];

export const SCALE = [
  { value: 0, label: "Nigdy" },
  { value: 1, label: "Rzadko" },
  { value: 2, label: "Czasem" },
  { value: 3, label: "Często" },
  { value: 4, label: "Prawie zawsze" },
] as const;
