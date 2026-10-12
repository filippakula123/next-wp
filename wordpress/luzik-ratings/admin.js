(() => {
  const input = document.getElementById('luzik-ratings-secret');
  const copy = document.getElementById('luzik-ratings-copy');
  const show = document.getElementById('luzik-ratings-show');
  const status = document.getElementById('luzik-ratings-copy-status');
  if (!input || !copy || !show || !status) return;
  input.addEventListener('click', () => input.select());
  show.addEventListener('click', () => {
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    show.textContent = visible ? 'Ukryj klucz' : 'Pokaż klucz';
    show.setAttribute('aria-pressed', String(visible));
    status.textContent = '';
  });
  copy.addEventListener('click', async () => {
    if (!input.value) { status.textContent = 'Klucz nie jest dostępny. Aktywuj ponownie wtyczkę.'; return; }
    try {
      await navigator.clipboard.writeText(input.value);
      status.textContent = 'Klucz skopiowany. Wklej go w ustawieniach aplikacji na Hostingerze.';
    } catch {
      // Password controls cannot be copied reliably in every browser.
      input.type = 'text';
      show.textContent = 'Ukryj klucz';
      show.setAttribute('aria-pressed', 'true');
      input.focus();
      input.select();
      status.textContent = 'Przeglądarka blokuje automatyczne kopiowanie. Klucz jest zaznaczony — naciśnij Ctrl+C (na Macu Cmd+C), następnie „Ukryj klucz”.';
    }
  });
})();
