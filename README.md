# Szkoła Jazdy Luzik — Next.js + WordPress

Strona działa na Next.js 16, React 19, TypeScript i Tailwind CSS 4. WordPress jest osobnym CMS-em: przechowuje wpisy, kategorie, zdjęcia bloga i ustawienia biura oraz oferty.

## Uruchomienie

Wymagane: Node.js >= 22.13 oraz pnpm w wersji zapisanej w `package.json`.

1. Zainstaluj zależności: `pnpm install --frozen-lockfile`.
2. Skopiuj `.env.example` do `.env.local` i ustaw adres swojego WordPressa.
3. Uruchom podgląd: `pnpm dev` (domyślnie port 3000).

`.env.local` zawiera konfigurację lokalną i sekrety. Nie dodawaj go do Git.

## Gdzie znajduje się kod

| Katalog / plik | Zawartość |
| --- | --- |
| `app/page.tsx` | Strona główna |
| `app/(luzik)/` | Podstrony kursów, cennik, zespół, kontakt i galeria |
| `app/blog/`, `app/[slug]/`, `app/category/` | Blog, pojedyncze wpisy i kategorie |
| `app/posts/`, `app/pages/` | Przekierowania dawnych adresów; nadal potrzebne |
| `app/layout.tsx`, `app/*.css` | Wspólny układ, metadane, fonty i style |
| `app/api/revalidate/` | Zabezpieczony webhook odświeżający cache |
| `components/home/` | Sekcje strony głównej |
| `components/site/` | Widoki podstron, blog, formularze i galeria |
| `components/layout/`, `components/nav/` | Nagłówek, stopka i nawigacja |
| `lib/` | Pobieranie WordPressa, treści oferty, ustawienia i SEO |
| `public/luzik/` | Zdjęcia stałych sekcji, logo i ikony |
| `wordpress/` | Źródła i pakiety instalacyjne potrzebnych wtyczek |
| `scripts/`, `__tests__/` | Audyty, generowanie ikon i testy |

`node_modules/` to zainstalowane zależności, a `.next/` to wynik kompilacji i cache. Są generowane automatycznie i nie są częścią kodu strony.

## Edycja w WordPressie

- Wpisy, kategorie i zdjęcia wyróżniające edytuj w kokpicie WordPressa.
- Zachowuj slugi oraz daty przeniesionych artykułów. Wpisy mają adres `/<slug>`; `/posts/<slug>` przekierowuje na właściwy wpis.
- Rozwijane FAQ dodawaj blokami **Szczegóły**: pytanie w podsumowaniu, odpowiedź wewnątrz bloku. FAQ pojawia się tylko tam, gdzie te bloki istnieją.
- Autor nie jest wyświetlany na stronie wpisu.
- Termin kursu, dane kontaktowe, godziny, social media, rachunek i ceny kursów oraz jazd zmieniaj w **Ustawienia → Ustawienia Luzik**. Wtyczka: `wordpress/luzik-settings.zip`.

Next.js pobiera ustawienia przez `/wp-json/luzik/v1/settings` i używa ich również w opisach cen oraz danych strukturalnych. Lokalnie `WORDPRESS_CACHE_DISABLED=true` pozwala zobaczyć zmiany po odświeżeniu; na produkcji ustawienia mają cache 60 sekund. Gdy CMS jest niedostępny, używane są domyślne wartości.

Zdjęcia wpisów pozostają w bibliotece mediów WordPressa. Zdjęcia wyróżniające i miniatury używają optymalizacji Next.js na publicznym hostingu; dla lokalnego CMS jest ona pomijana. Zdjęcia wewnątrz treści wpisu są wyświetlane z HTML WordPressa.

Formularze obecnie otwierają przygotowaną wiadomość w aplikacji pocztowej użytkownika. Automatyczna wysyłka wymaga jeszcze podłączenia obsługi wiadomości i SMTP.

## Sprawdzenie projektu

```sh
pnpm lint
pnpm test
pnpm build
pnpm start --port 3001
```

Przy uruchomionym podglądzie produkcyjnym:

- `pnpm audit:site` — sprawdza strony, metadane, pliki SEO i przekierowania na porcie 3001. Raport: `.site-audit.json`.
- `pnpm audit:links` — dodatkowo przechodzi przez wszystkie strony paginacji bloga, odkryte wpisy, linki wewnętrzne, kotwice i lokalne pliki. Można podać adres docelowy: `pnpm audit:links https://luzikkielce.pl`.
- `pnpm audit:settings` — uruchamia osobny serwer na porcie 3002 i sprawdza ustawienia bez modyfikacji prawdziwego WordPressa. Wymaga wcześniejszego builda i wolnego portu 3002.
- `pnpm audit:seo` — dokładny audyt metadanych, HTML dla robotów AI, schematów, wszystkich wpisów i linków; nie sprawdza ani nie modyfikuje sitemapy. Opcjonalnie podaj adres frontendu i CMS, np. `pnpm audit:seo https://luzikkielce.pl https://cms.luzikkielce.pl`. Raport roboczy: `.seo-audit.json`.
- `pnpm check:release` — sprawdza konfigurację docelowej publikacji; lokalne ustawienia mogą celowo nie spełniać wymagań produkcji.

Favicony, ikony mobilne i domyślne obrazy udostępniania odtwarza `node scripts/generate-brand-assets.mjs`. RSS, sitemapę oraz dane SEO generuje Next.js.

SEO edytuj w WordPressie w panelu **Rank Math**: dla artykułów w edycji wpisu, a dla strony głównej, podstron i profili instruktorów w menu **SEO podstron**. Wybierz pozycję, użyj **Edytuj fragment**, zmień tytuł lub opis i kliknij **Aktualizuj**. Zakładka społecznościowa pozwala ustawić osobny tytuł, opis i obraz udostępniania. Pozycje SEO nie tworzą dodatkowych publicznych stron WordPressa; treść podstron nadal znajduje się w Next.js.

Wymagane są aktywne **Rank Math SEO** oraz **Luzik SEO — Next.js** (`wordpress/luzik-seo.zip`). Integracja pobiera wyłącznie publiczne dane SEO przez `/wp-json/luzik/v1/seo`. Next.js generuje z nich tytuły, opisy, canonical, Open Graph i dyrektywy robots; strony z `noindex` pomija w sitemapie. Lokalnie zmiany widać po odświeżeniu, na produkcji cache SEO trwa 60 sekund i można go odświeżyć webhookiem. Nie trzeba ponownie kompilować strony po zmianie pól SEO. Lokalny podgląd pozostaje nieindeksowany niezależnie od ustawień Rank Math.

Przeniesiono metadane 38 artykułów i 25 pozycji SEO podstron. Import zachowuje istniejące pola i nie nadpisuje późniejszych zmian. Pusty opis korzysta z aktualnej zajawki artykułu lub automatycznego opisu podstrony. W opisach kursu B i jazd doszkalających zmienne `%luzik_course_price%` oraz `%luzik_lesson_prices%` pobierają aktualne ceny z Ustawień Luzik. Rank Math ocenia treść dostępną w edytorze WordPressa, więc jego punktacja nie analizuje stałych podstron renderowanych w Next.js.

`lib/luzik-legacy-seo.json` i `lib/luzik-legacy-seo.ts` pozostają zapasowym źródłem metadanych na wypadek niedostępności integracji. Przy migracji na hosting przenieś bazę WordPressa z ustawieniami Rank Math i pozycjami SEO oraz obie wtyczki. Zachowaj publiczną domenę w adresach kanonicznych i obrazach społecznościowych.

Przy przenoszeniu SEO poprawiono dwie literówki w tytułach, opisy społecznościowe skopiowane z niewłaściwego artykułu oraz cenę kursu B w opisie (teraz pobieraną z ustawień WordPressa). Własne obrazy społecznościowe z kopii znajdują się w `public/luzik/blog-social`; nie zależą od adresu lokalnego CMS. Opisy i umiejętności ośmiu profili `/team/…` zachowano w `lib/luzik-profiles.json`. Stare formularze ocen instruktorów wymagają osobnej integracji, jeśli mają wrócić.

## Przed publikacją

### Animacje

`components/site/motion-runtime.tsx` dodaje jednorazowe wejścia nagłówków i kart przy przewijaniu przez IntersectionObserver i natywne Web Animations API. Nie ukrywa treści w HTML ani nie przepisuje tekstu. Elementy w pierwszym widoku pozostają od razu widoczne; nawigacja Next.js ponownie podpina obserwację, a nowe karty galerii lub opinii są wykrywane automatycznie. Animacje są czyszczone przy zmianie strony i wyłączane przy `prefers-reduced-motion`. `app/luzik-motion.css` zawiera krótkie animacje trasy w hero, akcentów i reakcji na najechanie. Dekoracja trasy jest ukryta na telefonie. Nie dodano biblioteki animacji ani obsługi każdej klatki przewijania.

### Opinie Google

Sekcja opinii pobiera dane bezpośrednio z **Places API (New)** przez serwerowy endpoint `/api/reviews`. Wymaga prywatnej zmiennej `GOOGLE_PLACES_API_KEY`; instrukcja aktywacji i zabezpieczenia klucza: [docs/opinie-google.md](docs/opinie-google.md). Zapytanie uruchamia się dopiero przy przewinięciu do sekcji i nie blokuje renderowania strony głównej. API zwraca maksymalnie pięć opinii według trafności, rzeczywistą średnią i liczbę ocen. Nie filtrujemy niskich ocen. Bez klucza lub przy awarii pozostaje link do wizytówki Google; przykładowe opinie usunięto. Zawartość nie jest trwale przechowywana ani cache'owana. Po aktywacji trzeba zweryfikować rzeczywiste dane i limity na docelowym hostingu.

### Języki

Przełącznik w nagłówku i menu mobilnym obsługuje **polski, angielski, niemiecki, włoski i ukraiński**. Zgodnie z wyborem właściciela działa jak GTranslate na starej stronie: tłumaczy widok w przeglądarce, również podstrony i wpisy blogowe. Nie wymaga instalowania wtyczki językowej w WordPressie ani ręcznego tłumaczenia wpisów. Obrazy i tekst umieszczony wewnątrz zdjęć nie są tłumaczone.

Polska strona nie pobiera skryptu tłumaczącego. Po wybraniu obcego języka ładowany jest oficjalny `https://cdn.gtranslate.net/widgets/latest/lib.min.js`; dostępność i jakość automatycznego tłumaczenia zależą od dostawcy. Wybór jest zapamiętywany w przeglądarce. Zmiana języka i przejście do kolejnej podstrony w obcej wersji wykonują pełne przeładowanie dokumentu, aby tłumacz nie kolidował z drzewem React. W polskiej wersji pozostaje nawigacja Next.js.

To tłumaczenie dla odwiedzających: canonical, metadane Rank Math, HTML serwera, dane strukturalne i adresy pozostają polskie. Nie tworzymy `/en`, `/de`, `/it`, `/uk` ani `hreflang` wskazującego nieistniejące strony. Osobne indeksowane wersje językowe wymagają innego wdrożenia. Przy publikacji sprawdź dostępność zewnętrznego skryptu w docelowej przeglądarce i konfiguracji bezpieczeństwa hostingu.

Flagi przełącznika są lokalnymi wektorami SVG, więc nie zależą od obsługi emoji ani zewnętrznego serwera. `body` ma ograniczone do tego elementu `suppressHydrationWarning`, ponieważ rozszerzenie ColorZilla może dodać `cz-shortcut-listen` przed hydratacją. Nie wyłącza to kontroli zgodności komponentów strony. Przy diagnozowaniu innych ostrzeżeń warto porównać podgląd w przeglądarce bez rozszerzeń.

### Konfiguracja hostingu

1. Przenieś WordPressa wraz ze zdjęciami na publiczny serwer HTTPS. Lokalny adres `next-wp.local` nie będzie dostępny z hostingu Next.js.
   WordPress działa jako CMS: zachowaj ustawienie **Ustawienia → Czytanie → Proś wyszukiwarki o nieindeksowanie tej witryny** (włączone w instalacji roboczej). Publiczną stronę Next.js indeksujemy osobno; jej pola Rank Math pozostają niezależne od blokady CMS. Sprawdź dyrektywy również na docelowym hostingu.
2. Ustaw `WORDPRESS_URL`, `WORDPRESS_HOSTNAME`, `NEXT_PUBLIC_SITE_URL=https://luzikkielce.pl`, `WORDPRESS_CACHE_DISABLED=false`, `SITE_INDEXABLE=true` i `BLOG_INDEXABLE=true`. Na serwerze testowym ustaw `SITE_INDEXABLE=false`.
3. Zainstaluj wtyczkę `wordpress/next-revalidate.zip`. Ustaw ten sam losowy `WORDPRESS_WEBHOOK_SECRET` w WordPressie i Next.js. Webhook wysyła POST na `/api/revalidate` z nagłówkiem `x-webhook-secret` i JSON-em np. `{"contentType":"post","contentId":123}`. Bez webhooka cache wpisów może odświeżać się dopiero po godzinie.
4. Podłącz wysyłkę formularzy i sprawdź rzeczywiste dostarczenie wiadomości.
5. Zweryfikuj politykę prywatności pod kątem docelowego hostingu, poczty i analityki.
6. Wykonaj kontrole projektu oraz `pnpm audit:site https://luzikkielce.pl` przeciwko nowemu wdrożeniu.
7. Zgłoś `/sitemap.xml` w Google Search Console i sprawdź indeksowanie oraz wydajność po uruchomieniu domeny.

Zmiany zmiennych środowiskowych wymagają ponownej kompilacji i wdrożenia. Podgląd lokalny celowo blokuje indeksowanie. Pliki po zakończonym imporcie usunięto; oryginalna kopia WordPressa jest poza tym projektem.
