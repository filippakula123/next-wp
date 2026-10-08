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
- `pnpm check:release` — sprawdza konfigurację docelowej publikacji; lokalne ustawienia mogą celowo nie spełniać wymagań produkcji.

Favicony, ikony mobilne i domyślne obrazy udostępniania odtwarza `node scripts/generate-brand-assets.mjs`. RSS, sitemapę oraz dane SEO generuje Next.js.

## Przed publikacją

1. Przenieś WordPressa wraz ze zdjęciami na publiczny serwer HTTPS. Lokalny adres `next-wp.local` nie będzie dostępny z hostingu Next.js.
2. Ustaw `WORDPRESS_URL`, `WORDPRESS_HOSTNAME`, `NEXT_PUBLIC_SITE_URL=https://luzikkielce.pl`, `WORDPRESS_CACHE_DISABLED=false`, `SITE_INDEXABLE=true` i `BLOG_INDEXABLE=true`. Na serwerze testowym ustaw `SITE_INDEXABLE=false`.
3. Zainstaluj wtyczkę `wordpress/next-revalidate.zip`. Ustaw ten sam losowy `WORDPRESS_WEBHOOK_SECRET` w WordPressie i Next.js. Webhook wysyła POST na `/api/revalidate` z nagłówkiem `x-webhook-secret` i JSON-em np. `{"contentType":"post","contentId":123}`. Bez webhooka cache wpisów może odświeżać się dopiero po godzinie.
4. Podłącz wysyłkę formularzy i sprawdź rzeczywiste dostarczenie wiadomości.
5. Zweryfikuj politykę prywatności pod kątem docelowego hostingu, poczty i analityki.
6. Wykonaj kontrole projektu oraz `pnpm audit:site https://luzikkielce.pl` przeciwko nowemu wdrożeniu.
7. Zgłoś `/sitemap.xml` w Google Search Console i sprawdź indeksowanie oraz wydajność po uruchomieniu domeny.

Zmiany zmiennych środowiskowych wymagają ponownej kompilacji i wdrożenia. Podgląd lokalny celowo blokuje indeksowanie. Pliki po zakończonym imporcie usunięto; oryginalna kopia WordPressa jest poza tym projektem.
