<?php
/**
 * Plugin Name: Luzik SEO — Next.js
 * Description: Łączy ustawienia Rank Math wpisów i podstron Luzika z frontendem Next.js.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 8.0
 * Author: Szkoła Jazdy Luzik
 */
if (!defined('ABSPATH')) { exit; }
require_once __DIR__ . '/import.php';

add_action('init', function () {
    register_post_type('luzik_seo', array(
        'labels' => array('name' => 'SEO podstron', 'singular_name' => 'SEO podstrony', 'edit_item' => 'Edytuj SEO podstrony', 'all_items' => 'Wszystkie podstrony'),
        'public' => false, 'publicly_queryable' => false, 'show_ui' => true, 'show_in_rest' => false,
        'show_in_nav_menus' => false, 'exclude_from_search' => true, 'rewrite' => false,
        'menu_icon' => 'dashicons-search', 'supports' => array('title'), 'capability_type' => 'page',
        'map_meta_cap' => true, 'capabilities' => array('create_posts' => 'do_not_allow'),
    ));
}, 5);

// The records are CMS-only, but must have Rank Math's normal editing box.
add_filter('rank_math/excluded_post_types', function ($types) { $types['luzik_seo'] = 'luzik_seo'; return $types; });
add_filter('manage_luzik_seo_posts_columns', function ($columns) { $columns['luzik_path'] = 'Adres na stronie Luzika'; return $columns; });
add_action('manage_luzik_seo_posts_custom_column', function ($column, $id) {
    if ($column === 'luzik_path') { echo esc_html(get_post_meta($id, '_luzik_path', true)); }
}, 10, 2);
add_action('add_meta_boxes_luzik_seo', function () {
    add_meta_box('luzik-seo-help', 'SEO strony w Next.js', function ($post) {
        $path = get_post_meta($post->ID, '_luzik_path', true);
        echo '<p><strong>Adres publiczny:</strong> ' . esc_html(rtrim(get_option('luzik_seo_public_url', 'https://luzikkielce.pl'), '/') . $path) . '</p>';
        echo '<p>Ta pozycja zarządza tylko SEO. Wygląd i treść podstrony pozostają w Next.js. Tytuł, opis, indeksowanie i dane społecznościowe zmieniaj w panelu Rank Math poniżej.</p>';
        echo '<p>Puste pole opisu korzysta z automatycznego opisu Next.js. Nie trzeba wpisywać adresu kanonicznego, jeśli ma wskazywać tę podstronę.</p>';
        if ($path === '/kursy-prawa-jazdy-kategorii-b') { echo '<p>Zmienne <code>%luzik_course_price%</code> pobierają aktualną cenę z Ustawień Luzik.</p>'; }
        if ($path === '/jazdy-doszkalajace') { echo '<p>Zmienna <code>%luzik_lesson_prices%</code> pobiera aktualne ceny manuala i automatu z Ustawień Luzik.</p>'; }
    }, 'luzik_seo', 'normal', 'high');
});
add_action('admin_notices', function () {
    $screen = get_current_screen();
    if ($screen && $screen->post_type === 'luzik_seo' && !defined('RANK_MATH_VERSION')) {
        echo '<div class="notice notice-error"><p>Włącz Rank Math SEO, aby edytować ustawienia podstron Luzika.</p></div>';
    }
});

function luzik_seo_prices(): array {
    $settings = function_exists('luzik_settings_public') ? luzik_settings_public() : array();
    $manual = (int) ($settings['lesson_b'] ?? 140); $automatic = (int) ($settings['lesson_b_automat'] ?? 140);
    return array('luzik_course_price' => (string) ($settings['price_b'] ?? 3700), 'luzik_lesson_prices' => $manual === $automatic ? $manual . ' zł/h' : $manual . ' zł/h (manual) i ' . $automatic . ' zł/h (automat)');
}
add_action('rank_math/vars/register_extra_replacements', function () {
    if (!function_exists('rank_math_register_var_replacement')) { return; }
    foreach (luzik_seo_prices() as $key => $example) {
        rank_math_register_var_replacement($key, array('name' => $key === 'luzik_course_price' ? 'Cena kursu B — Luzik' : 'Ceny jazd B — Luzik', 'description' => 'Aktualna cena z Ustawień Luzik', 'variable' => $key, 'example' => $example), function () use ($key) { return luzik_seo_prices()[$key]; });
    }
});

function luzik_seo_resolve(string $template, WP_Post $post): string {
    $options = get_option('rank-math-options-titles', array());
    $defaults = get_option('luzik_seo_defaults', array());
    $vars = array('sitename' => $options['website_name'] ?? $defaults['sitename'] ?? get_bloginfo('name'), 'sep' => $options['title_separator'] ?? '-', 'separator' => $options['title_separator'] ?? '-', 'page' => '');
    $vars = array_merge($vars, luzik_seo_prices());
    foreach ($vars as $key => $value) { $template = str_replace('%' . $key . '%', (string) $value, $template); }
    $resolved = \RankMath\Helper::replace_vars($template, $post);
    return trim(preg_replace('/\s+/u', ' ', html_entity_decode(wp_strip_all_tags($resolved), ENT_QUOTES, 'UTF-8')));
}
function luzik_seo_entry(WP_Post $post): array {
    $options = get_option('rank-math-options-titles', array());
    $title = get_post_meta($post->ID, 'rank_math_title', true);
    if (!$title) { $title = $options['pt_' . $post->post_type . '_title'] ?? '%title% %sep% %sitename%'; }
    $resolve = function ($key) use ($post) {
        $value = get_post_meta($post->ID, 'rank_math_' . $key, true);
        return is_string($value) && $value !== '' ? luzik_seo_resolve($value, $post) : '';
    };
    $robots = get_post_meta($post->ID, 'rank_math_robots', true);
    if (!is_array($robots) || !$robots) { $robots = ($options['pt_' . $post->post_type . '_custom_robots'] ?? '') === 'on' ? ($options['pt_' . $post->post_type . '_robots'] ?? array('index')) : ($options['robots_global'] ?? array('index')); }
    $twitter_same = get_post_meta($post->ID, 'rank_math_twitter_use_facebook', true) !== 'off';
    $media = function ($key) use ($post) {
        $value = get_post_meta($post->ID, 'rank_math_' . $key, true);
        return is_string($value) ? esc_url_raw($value, array('https', 'http')) : '';
    };
    return array('title' => luzik_seo_resolve((string) $title, $post), 'description' => $resolve('description'),
        'socialTitle' => $resolve('facebook_title'), 'socialDescription' => $resolve('facebook_description'), 'socialImage' => $media('facebook_image'),
        'twitterTitle' => $twitter_same ? '' : $resolve('twitter_title'), 'twitterDescription' => $twitter_same ? '' : $resolve('twitter_description'), 'twitterImage' => $twitter_same ? '' : $media('twitter_image'),
        'canonical' => $media('canonical_url'), 'robots' => array_values(array_intersect($robots, array('index', 'noindex', 'follow', 'nofollow', 'noarchive', 'nosnippet', 'noimageindex'))));
}
add_action('rest_api_init', function () {
    register_rest_route('luzik/v1', '/seo', array(
        'methods' => WP_REST_Server::READABLE, 'permission_callback' => '__return_true',
        'callback' => function () {
            if (!class_exists('RankMath\\Helper')) { return new WP_Error('luzik_seo_unavailable', 'Rank Math jest nieaktywny.', array('status' => 503)); }
            // REST requests do not run the normal frontend `wp` initialization hook.
            if (!rank_math()->variables) { rank_math()->variables = new \RankMath\Replace_Variables\Manager(); }
            rank_math()->variables->setup();
            $entries = array();
            // Never disclose draft/private/password-protected content or arbitrary post meta.
            $posts = get_posts(array('post_type' => array('post', 'page', 'luzik_seo'), 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'ID', 'order' => 'ASC', 'has_password' => false));
            foreach ($posts as $post) {
                $path = $post->post_type === 'luzik_seo' ? get_post_meta($post->ID, '_luzik_path', true) : '/' . $post->post_name;
                if (!is_string($path) || !preg_match('#^/(?:[a-z0-9-]+/?)*$#', $path)) { continue; }
                $entries[$path] = luzik_seo_entry($post);
            }
            return rest_ensure_response(array('version' => 1, 'entries' => (object) $entries));
        },
    ));
});
