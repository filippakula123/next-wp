<?php
/**
 * Plugin Name: Luzik — publiczny widok CMS
 * Description: Zastępuje publiczne szablony WordPressa komunikatem CMS, zachowując panel i REST API.
 * Version: 1.0.0
 * Author: Szkoła Jazdy Luzik
 */

defined('ABSPATH') || exit;

add_action('template_redirect', function () {
    // WordPress serves REST requests before template_redirect; keep an explicit guard too.
    if (is_admin() || wp_doing_ajax() || wp_doing_cron() || (defined('REST_REQUEST') && REST_REQUEST) || is_robots()) {
        return;
    }

    status_header(200);
    nocache_headers();
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Robots-Tag: noindex, nofollow', true);

    echo '<!doctype html><html lang="pl"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<meta name="robots" content="noindex,nofollow"><title>CMS Luzik Kielce</title>';
    echo '<style>body{margin:2rem;font:16px/1.6 system-ui,sans-serif;color:#333;background:#fff}</style>';
    echo '</head><body><p>CMS redakcyjny. Publiczny serwis jest obsługiwany osobno.</p></body></html>';
    exit;
}, 0);
