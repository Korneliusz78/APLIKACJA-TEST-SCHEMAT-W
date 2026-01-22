# Test Schematów — Mobile PWA (iOS + Android)

To jest komplet plików aplikacji „telefonowej” (PWA) z:
- Testem (z wymuszonym krokiem 0: wybór grupy wiekowej),
- Wynikami + „Wyślij wyniki do terapeuty” (backend, bez zapisu w bazie),
- Sekcją AI „Pytania po teście” (backend, klucz po stronie serwera),
- „Apteczką” ćwiczeń (min. 8) z timerem,
- Przyciskiem „Umów wizytę” (konfigurowalny link, domyślnie ZnanyLekarz).

## Bezpieczeństwo klucza API (ważne)
- **Nigdy** nie wklejaj klucza do frontendu.
- Klucz trzymamy w `server/.env` jako `OPENAI_API_KEY`.
- Plik `.env` jest ignorowany przez git (`.gitignore`).

Uwaga: klucz, który wkleiłeś do czatu, jest traktowany jak **ujawniony**. Najbezpieczniej: **unieważnij go** w panelu i wygeneruj nowy, a nowy wpisz do `.env`.

## Szybki start (lokalnie)
Wymagania: Node.js 18+.

1) Zainstaluj zależności:
```bash
npm install
```

2) Skonfiguruj backend:
- skopiuj `server/.env.example` do `server/.env`
- wpisz `OPENAI_API_KEY=...`
- jeśli chcesz wysyłać maile z serwera: uzupełnij SMTP (`SMTP_*`). Jeśli nie uzupełnisz, aplikacja pokaże opcję „mailto” jako fallback.

3) Uruchom dev:
```bash
npm run dev
```
- frontend: http://localhost:5173
- backend:  http://localhost:8787

## Build PWA (produkcyjnie)
```bash
npm run build
npm run start
```
Aplikacja będzie dostępna na http://localhost:8787 i będzie działała jako PWA.

## „Pliki na telefon” (Android + iPhone)
Najpraktyczniej: zrobić wrapper przez Capacitor (ten repozytorium jest na to przygotowane).

### Android (APK/AAB)
1) Zbuduj frontend:
```bash
npm run build
```
2) Dodaj Capacitor (pierwszy raz):
```bash
npx cap init "Test Schematów" "pl.drogarozwiazan.testschematow" --web-dir client/dist
npx cap add android
npx cap copy
npx cap open android
```
3) W Android Studio: Build -> Generate Signed Bundle / APK.

### iPhone (IPA)
1) Zbuduj frontend:
```bash
npm run build
```
2) Dodaj iOS:
```bash
npx cap add ios
npx cap copy
npx cap open ios
```
3) W Xcode: podpisz aplikację i zbuduj archiwum.

**Ważne:** AI i wysyłka e-mail wymagają backendu (serwera). Dla produkcji: postaw backend na Vercel/Render/Fly/Cloudflare lub na Twoim serwerze, a w aplikacji ustaw `VITE_API_BASE` na adres backendu (tu jest domyślnie `/api`).

## Konfiguracja
- Link „Umów wizytę”: w aplikacji -> Kontakt -> Ustawienia (bez logowania) albo w `client/src/config/defaults.ts`.
- Adres odbiorczy wyników: `server/.env` (`RESULTS_TO`, domyślnie: jacekjankowski.drogarozwiazan@gmail.com)

## Zasady UX (spełnione)
- Wybór grupy wiekowej = KROK 0, zawsze widoczny, nie da się go pominąć.
- Krytyczne CTA zawsze **bez scrolla** (Start testu, AI po teście, Wyślij wyniki, Umów wizytę).
- Jeśli gdziekolwiek jest scroll: jest „hint przewijania”.
