# Uruchomienie prawdziwych opinii Google

Połączenie jest przygotowane w Next.js. Nie trzeba instalować kolejnej wtyczki WordPressa ani ręcznie przepisywać opinii. Wskazana jest wizytówka Luzika ze starej instalacji: `ChIJ6YYMDDonGEcRZEwLNN76QHc`.

## Co zrobić

1. Otwórz [Google Cloud Console](https://console.cloud.google.com/) na koncie właściciela szkoły. Utwórz projekt, np. „Luzik — strona”, i podłącz konto rozliczeniowe Google Maps Platform. Zapytania o opinie mogą być płatne — sprawdź [aktualny cennik](https://developers.google.com/maps/billing-and-pricing/pricing) przed aktywacją.
2. Wejdź w **APIs & Services → Library**, wyszukaj **Places API (New)** i kliknij **Enable**. Nie potrzebujemy Maps JavaScript API ani starego Places API.
3. W **APIs & Services → Credentials → Create credentials → API key** utwórz klucz. W jego edycji ustaw **API restrictions → Restrict key → Places API (New)**. To klucz serwerowy: jeśli hosting zapewnia stałe wychodzące IP, ustaw również **Application restrictions → IP addresses** na adres serwera. Ograniczenie do adresu strony (HTTP referrer) nie pasuje do zapytań serwerowych. [Instrukcja zabezpieczenia klucza](https://developers.google.com/maps/api-security-best-practices).
4. W **Places API (New) → Quotas & System Limits** ustaw limit zapytań do Place Details dobrany do ruchu strony. W **Billing → Budgets & alerts** dodaj powiadomienie o kosztach. Powiadomienie budżetowe samo nie zatrzymuje wydatków; limit API ogranicza liczbę zapytań.
5. Otwórz lokalny plik `.env.local` w projekcie i wpisz klucz tylko tam:

   ```dotenv
   GOOGLE_PLACES_API_KEY="tutaj-twój-klucz"
   ```

   Nie wysyłaj klucza na czacie, nie dodawaj do Git i nie używaj nazwy zaczynającej się od `NEXT_PUBLIC_`. Na hostingu wpisz go w zmiennych środowiskowych aplikacji Next.js.
6. Uruchom ponownie podgląd Next.js. Na hostingu ponownie skompiluj i wdroż aplikację po dodaniu klucza. Otwórz stronę główną i przewiń do opinii. Sprawdź zgodność nazwy szkoły, średniej, liczby ocen, autorów i linków z wizytówką Google. To konieczny test rzeczywistego połączenia po dodaniu klucza.

## Jak działa sekcja

- Pobiera rzeczywistą średnią i całkowitą liczbę ocen, bez wartości wpisanych na stałe.
- [Places API](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places) udostępnia maksymalnie pięć opinii według trafności. Nie są to koniecznie najnowsze opinie i nie jest to komplet opinii wizytówki. Zachowujemy kolejność Google i nie filtrujemy po liczbie gwiazdek.
- Autorzy, ich zdjęcia i linki pochodzą z odpowiedzi Google. Treść jest wyświetlana jako tekst, bez wykonywania HTML. Długie opinie pozostają dostępne w całości.
- Zapytanie uruchamia się raz na zamontowanie sekcji, gdy odwiedzający do niej przewinie. Główna strona nie czeka na Google. Nie ma automatycznego odpytywania co kilka sekund ani skryptu Google Maps w przeglądarce.
- Klucz pozostaje na serwerze. Endpoint `/api/reviews` obsługuje wyłącznie ustaloną wizytówkę Luzika. Zawartość nie jest zapisywana w bazie, pliku, localStorage ani trwałym cache Next.js. Każde nowe pobranie jest nowym zapytaniem API.
- Gdy klucz nie jest ustawiony, API jest niedostępne lub limit został wykorzystany, strona pokazuje odnośnik do Google Maps. Nie podmienia danych na wymyślone lub archiwalne opinie.
- Atrybucja, odnośniki do autorów i źródeł oraz opis kolejności odpowiadają [wytycznym Google](https://developers.google.com/maps/documentation/places/web-service/policies). Sekcja nie dodaje danych `AggregateRating` dla własnej firmy.

## Przy publikacji

Przenieś zmienną `GOOGLE_PLACES_API_KEY` na hosting i dopasuj ograniczenia IP. Wykonaj test z prawdziwym kluczem i na docelowej domenie. Informacje o integracji i odnośniki do zasad Google znajdują się w polityce prywatności witryny; dopasuj ją do ostatecznej konfiguracji usług przed publikacją.
