# Oceny instruktorów

Stara strona używała Rate My Post. Gwiazdki były ocenami wystawianymi bezpośrednio na stronie, nie opiniami Google. Oryginalne wartości `rmp_vote_count` i `rmp_rating_val_sum` z kopii bazy z 6.10.2026 znajdują się w `lib/luzik-instructor-ratings-seed.json`. Kopia zawiera dla Kacpra 5 ocen; screen z późniejszej strony pokazuje już 6. Głosy oddane na starej stronie po wykonaniu kopii nie są w tym eksporcie.

## Uruchomienie na Hostingerze

1. W opublikowanym WordPressie otwórz **Wtyczki → Dodaj wtyczkę → Wyślij wtyczkę na serwer** i wgraj `wordpress/luzik-ratings.zip`. Zainstaluj i aktywuj.
2. W **Ustawienia → Oceny instruktorów** skopiuj klucz z pola hasła. Jest generowany automatycznie; nie wklejaj go do czatu ani GitHuba.
3. W zmiennych środowiskowych aplikacji Next.js na Hostingerze dodaj `WORDPRESS_RATINGS_SECRET` z tym kluczem. Lokalnie dodaj go do prywatnego `.env.local` i zrestartuj podgląd. Nie dodawaj prefiksu `NEXT_PUBLIC_`.
4. Wdróż ZIP aplikacji zawierający moduł ocen. Sprawdź zapis na jednym profilu, a potem odśwież stronę: licznik powinien pozostać zwiększony. Kolejny głos z tej samej przeglądarki na tę samą osobę jest odrzucany. Testowy głos jest prawdziwym głosem — nie testuj przypadkowymi ocenami na produkcji.

Bez aktywnej integracji strona pokazuje oznaczone datą oceny z kopii i blokuje nowe głosy; nie udaje zapisu. Jeśli CMS odpowiada, ale klucz nie jest ustawiony, pokazuje aktualne oceny i informuje o niedokończonej konfiguracji.

## Zapisywanie i prywatność

Liczba i suma ocen są trwale przechowywane w bazie WordPressa. Wtyczka tworzy dwie tabele z prefiksem bieżącej instalacji. Ponowna aktywacja nie nadpisuje ocen. Migracja WordPressa musi obejmować także te tabele. Nie usuwa się ich przy dezaktywacji.

Next.js ustawia funkcjonalne cookie `luzik-rating-visitor` na rok po próbie oceny, żeby rozpoznawać powtórne głosy. Cookie jest HttpOnly, SameSite=Strict i Secure na HTTPS. WordPress otrzymuje skróty identyfikatora i adresu IP z kluczem, a nie ich jawne wartości; skrót limitu jest przechowywany chwilowo (60 sekund). Nie jest to pełna ochrona przed świadomym obchodzeniem głosowania; wyczyszczenie cookie może pozwolić na ponowną ocenę. Uwzględnij ten mechanizm w polityce prywatności przed publikacją.

POST do WordPressa wymaga serwerowego sekretu. Publiczny frontend używa wyłącznie własnej trasy `/api/instructor-ratings`, sprawdzającej pochodzenie żądania, slug i zakres ocen. Unikalny głos i aktualizacja sumy są zapisywane w transakcji. Endpoint i strona nie publikują `AggregateRating` w danych Google.

Oceny nie synchronizują się automatycznie z nadal działającą starą stroną. Przy przełączaniu domeny trzeba pobrać jej końcową kopię i przenieść ewentualne późniejsze głosy przed uruchomieniem nowego głosowania.
