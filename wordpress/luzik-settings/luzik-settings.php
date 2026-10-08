<?php
/**
 * Plugin Name: Ustawienia Luzik
 * Description: Terminy kursów, ceny i publiczne dane kontaktowe dla strony Next.js.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * Author: Szkoła Jazdy Luzik
 */

if (!defined('ABSPATH')) { exit; }

function luzik_settings_fields(): array {
    return array(
        'course_date' => array('Najbliższy kurs — data', 'date', '2026-10-12', 'Termin kursu'),
        'course_time' => array('Najbliższy kurs — godzina', 'time', '15:00', 'Termin kursu'),
        'phone' => array('Telefon', 'tel', '+48 504 166 557', 'Kontakt'),
        'email' => array('Adres e-mail', 'email', 'autoluzik@wp.pl', 'Kontakt'),
        'address' => array('Adres biura', 'text', 'Kielce, ul. Warszawska 4', 'Kontakt'),
        'floor' => array('Piętro', 'text', 'I piętro', 'Kontakt'),
        'hours' => array('Godziny pracy — opis', 'text', 'Pn – Pt: 12:00 – 16:00', 'Kontakt'),
        'opens' => array('Biuro — otwarcie', 'time', '12:00', 'Kontakt'),
        'closes' => array('Biuro — zamknięcie', 'time', '16:00', 'Kontakt'),
        'facebook' => array('Facebook — adres strony', 'url', 'https://www.facebook.com/Szkolajazdyluzik/', 'Kontakt'),
        'instagram' => array('Instagram — adres profilu', 'url', 'https://www.instagram.com/luzikkielce/', 'Kontakt'),
        'map_url' => array('Mapa — link do dojazdu', 'url', 'https://maps.app.goo.gl/yxwXv5x83wXLCLqQ8', 'Kontakt'),
        'account' => array('Numer rachunku do wpłat', 'text', '78 1050 1416 1000 0091 4551 9824', 'Kontakt'),
        'bank' => array('Nazwa banku', 'text', 'ING Bank Śląski S.A.', 'Kontakt'),
        'price_b' => array('Kategoria B — cena w zł', 'number', 3700, 'Ceny kursów'),
        'price_b_automat' => array('Kategoria B automat — cena w zł', 'number', 3700, 'Ceny kursów'),
        'price_am' => array('Kategoria AM — cena w zł', 'number', 1700, 'Ceny kursów'),
        'price_a1' => array('Kategoria A1 — cena w zł', 'number', 2700, 'Ceny kursów'),
        'price_a2' => array('Kategoria A2 — cena w zł', 'number', 2900, 'Ceny kursów'),
        'price_a' => array('Kategoria A — cena w zł', 'number', 2900, 'Ceny kursów'),
        'lesson_b' => array('Jazda dodatkowa B — zł za godzinę', 'number', 140, 'Jazdy doszkalające'),
        'lesson_b_automat' => array('Jazda dodatkowa B automat — zł za godzinę', 'number', 140, 'Jazdy doszkalające'),
        'lesson_am' => array('Jazda dodatkowa AM — zł za godzinę', 'number', 120, 'Jazdy doszkalające'),
        'lesson_a1' => array('Jazda dodatkowa A1 — zł za godzinę', 'number', 130, 'Jazdy doszkalające'),
        'lesson_a2' => array('Jazda dodatkowa A2 — zł za godzinę', 'number', 150, 'Jazdy doszkalające'),
        'lesson_a' => array('Jazda dodatkowa A — zł za godzinę', 'number', 150, 'Jazdy doszkalające'),
    );
}

function luzik_settings_public(): array {
    $saved = get_option('luzik_site_settings', array());
    if (!is_array($saved)) { $saved = array(); }
    $result = array();
    foreach (luzik_settings_fields() as $key => $field) {
        $result[$key] = $saved[$key] ?? $field[2];
    }
    return $result;
}

function luzik_settings_sanitize($input): array {
    $previous = luzik_settings_public();
    if (!is_array($input)) { return $previous; }
    $result = $previous;
    foreach (luzik_settings_fields() as $key => $field) {
        if (!array_key_exists($key, $input)) { continue; }
        if (!is_scalar($input[$key])) {
            add_settings_error('luzik_site_settings', 'invalid_' . $key, 'Nieprawidłowa wartość: ' . $field[0]);
            continue;
        }
        $value = trim((string) $input[$key]);
        $valid = true;
        switch ($field[1]) {
            case 'number':
                $valid = preg_match('/^\d{1,6}$/', $value) && (int) $value > 0;
                $value = (int) $value;
                break;
            case 'date':
                $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
                $valid = $date && $date->format('Y-m-d') === $value;
                break;
            case 'time':
                $valid = (bool) preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $value);
                break;
            case 'email':
                $valid = (bool) is_email($value);
                $value = sanitize_email($value);
                break;
            case 'url':
                $value = esc_url_raw($value, array('https'));
                $valid = $value && wp_parse_url($value, PHP_URL_SCHEME) === 'https' && wp_parse_url($value, PHP_URL_HOST);
                break;
            case 'tel':
                $valid = (bool) preg_match('/^\+?[0-9 ()-]{7,30}$/', $value);
                $value = sanitize_text_field($value);
                break;
            default:
                $value = sanitize_text_field($value);
                $valid = $value !== '' && strlen($value) <= 500;
        }
        if ($valid) {
            $result[$key] = $value;
        } else {
            add_settings_error('luzik_site_settings', 'invalid_' . $key, 'Popraw pole „' . $field[0] . '”. Zachowano poprzednią wartość.');
        }
    }
    return $result;
}

add_action('admin_init', function () {
    register_setting('luzik_settings', 'luzik_site_settings', array(
        'type' => 'array', 'sanitize_callback' => 'luzik_settings_sanitize', 'show_in_rest' => false,
    ));
});

add_action('admin_menu', function () {
    add_options_page('Ustawienia Luzik', 'Ustawienia Luzik', 'manage_options', 'luzik-settings', 'luzik_settings_screen');
});

function luzik_settings_screen(): void {
    if (!current_user_can('manage_options')) { return; }
    $values = luzik_settings_public();
    echo '<div class="wrap"><h1>Ustawienia Luzik</h1><p>Publiczne dane szkoły jazdy. Nie wpisuj tutaj haseł ani danych kursantów.</p>';
    settings_errors('luzik_site_settings');
    echo '<form method="post" action="options.php">';
    settings_fields('luzik_settings');
    $section = '';
    foreach (luzik_settings_fields() as $key => $field) {
        if ($section !== $field[3]) {
            if ($section !== '') { echo '</table>'; }
            $section = $field[3];
            echo '<h2>' . esc_html($section) . '</h2><table class="form-table" role="presentation">';
        }
        echo '<tr><th scope="row"><label for="luzik-' . esc_attr($key) . '">' . esc_html($field[0]) . '</label></th><td>';
        echo '<input class="regular-text" required id="luzik-' . esc_attr($key) . '" name="luzik_site_settings[' . esc_attr($key) . ']" type="' . esc_attr($field[1]) . '" value="' . esc_attr((string) $values[$key]) . '"';
        if ($field[1] === 'number') { echo ' min="1" max="999999" step="1"'; }
        elseif (!in_array($field[1], array('date', 'time'), true)) { echo ' maxlength="500"'; }
        echo '></td></tr>';
    }
    echo '</table>';
    submit_button('Zapisz ustawienia Luzik');
    echo '</form></div>';
}

add_action('rest_api_init', function () {
    register_rest_route('luzik/v1', '/settings', array(
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => function () { return rest_ensure_response(luzik_settings_public()); },
    ));
});
