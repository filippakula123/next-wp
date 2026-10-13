<?php
/**
 * Plugin Name: Luzik — opinie Google dla Next.js
 * Description: Udostępnia publiczne opinie zapisane przez Widgets for Google Reviews (Trustindex) stronie Next.js.
 * Version: 1.0.0
 * Requires at least: 6.2
 * Requires PHP: 8.0
 */
if (!defined('ABSPATH')) { exit; }

function luzik_reviews_cached_place() {
    global $trustindex_pm_google;
    $plugin = $trustindex_pm_google ?? null;
    if (!is_object($plugin) || !is_callable(array($plugin, 'getPageDetails')) || !is_callable(array($plugin, 'getReviews'))) {
        return new WP_Error('reviews_not_configured', 'Aktywuj i skonfiguruj Widgets for Google Reviews — Trustindex.', array('status' => 503));
    }
    $details = $plugin->getPageDetails();
    if (!is_array($details) || ($details['id'] ?? '') !== 'ChIJ6YYMDDonGEcRZEwLNN76QHc' || empty($details['name'])) {
        return new WP_Error('reviews_wrong_place', 'W Trustindex wybierz wizytówkę Szkoły Jazdy Luzik w Kielcach.', array('status' => 503));
    }
    // Allowlist public display fields: never return access tokens, plugin options or raw rows.
    $place = array(
        'id' => $details['id'],
        'displayName' => array('text' => sanitize_text_field($details['name'])),
        'googleMapsUri' => 'https://www.google.com/maps/search/?api=1&query=Szko%C5%82a+Jazdy+Luzik+Kielce&query_place_id=ChIJ6YYMDDonGEcRZEwLNN76QHc',
        'reviews' => array(),
    );
    if (isset($details['rating_score']) && is_numeric($details['rating_score']) && $details['rating_score'] >= 1 && $details['rating_score'] <= 5) {
        $place['rating'] = (float) $details['rating_score'];
    }
    if (isset($details['rating_number']) && is_numeric($details['rating_number']) && $details['rating_number'] >= 0) {
        $place['userRatingCount'] = (int) $details['rating_number'];
    }
    // Read only saved real reviews. No shortcode rendering, demo data, downloads or rating filter.
    $rows = $plugin->getReviews();
    if (!is_array($rows)) { return new WP_Error('reviews_unavailable', 'Nie udało się odczytać opinii zapisanych przez Trustindex.', array('status' => 503)); }
    foreach ($rows as $row) {
        $row = (array) $row;
        if (!empty($row['hidden']) || empty($row['user']) || !isset($row['rating']) || !is_numeric($row['rating'])) { continue; }
        $rating = (float) $row['rating'];
        if ($rating < 1 || $rating > 5 || floor($rating) !== $rating) { continue; }
        $body = preg_replace('#<br\s*/?>|</p>#i', "\n", (string) ($row['text'] ?? ''));
        $review = array(
            'name' => 'trustindex-google-' . (string) ($row['id'] ?? count($place['reviews'])),
            'rating' => (int) $rating,
            'text' => array('text' => html_entity_decode(wp_strip_all_tags($body), ENT_QUOTES | ENT_HTML5, 'UTF-8')),
            'authorAttribution' => array('displayName' => sanitize_text_field($row['user']), 'photoUri' => esc_url_raw($row['user_photo'] ?? '', array('https'))),
        );
        if (!empty($row['date']) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $row['date'])) { $review['publishTime'] = $row['date']; }
        $place['reviews'][] = $review;
        if (count($place['reviews']) >= 10) { break; }
    }
    if (!$place['reviews']) {
        return new WP_Error('reviews_empty', 'Pobierz opinie w panelu Trustindex.', array('status' => 503));
    }
    return $place;
}

add_action('rest_api_init', function () {
    register_rest_route('luzik/v1', '/google-reviews', array(
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => '__return_true',
        'callback' => function () {
            $place = luzik_reviews_cached_place();
            if (is_wp_error($place)) { return $place; }
            $response = new WP_REST_Response(array('version' => 1, 'source' => 'trustindex', 'place' => $place));
            $response->header('Cache-Control', 'public, max-age=60');
            return $response;
        },
    ));
});

add_action('admin_notices', function () {
    if (!current_user_can('manage_options')) { return; }
    $screen = get_current_screen();
    if (!$screen || $screen->id !== 'plugins') { return; }
    $place = luzik_reviews_cached_place();
    if (is_wp_error($place)) {
        echo '<div class="notice notice-warning"><p><strong>Opinie Luzik:</strong> ' . esc_html($place->get_error_message()) . '</p></div>';
    } else {
        echo '<div class="notice notice-success"><p><strong>Opinie Luzik:</strong> gotowe do pobrania przez Next.js — ' . esc_html($place['displayName']['text']) . ', ' . count($place['reviews']) . ' opinii. Odświeżaj je w panelu Trustindex.</p></div>';
    }
});
