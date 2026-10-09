<?php
if (!defined('ABSPATH')) { exit; }

/** Idempotent migration: never replace an existing editor's SEO fields. */
function luzik_seo_import(): array {
    $seed = json_decode(file_get_contents(__DIR__ . '/seed.json'), true);
    if (!is_array($seed) || empty($seed['records'])) { throw new RuntimeException('Brak danych migracji SEO.'); }
    $report = array('posts' => 0, 'pages_created' => 0, 'fields_added' => 0, 'unmatched' => array());
    add_option('luzik_seo_defaults', $seed['defaults']);
    add_option('luzik_seo_public_url', 'https://luzikkielce.pl');
    $options = get_option('rank-math-options-titles', array());
    foreach (array('pt_post_title', 'pt_post_description', 'pt_page_title', 'pt_page_description', 'title_separator') as $key) {
        if (!array_key_exists($key, $options)) { $options[$key] = $seed['defaults'][$key]; }
    }
    if (empty($options['website_name'])) { $options['website_name'] = $seed['defaults']['sitename']; }
    $options['pt_luzik_seo_add_meta_box'] = 'on';
    $options['pt_luzik_seo_title'] = $options['pt_luzik_seo_title'] ?? '%title% %sep% %sitename%';
    update_option('rank-math-options-titles', $options);
    foreach ($seed['records'] as $record) {
        if ($record['type'] === 'post') {
            $post = get_page_by_path(ltrim($record['path'], '/'), OBJECT, 'post');
            if (!$post || $post->post_status !== 'publish') { $report['unmatched'][] = $record['path']; continue; }
            $id = $post->ID; $report['posts']++;
        } else {
            $found = get_posts(array('post_type' => 'luzik_seo', 'post_status' => array('publish', 'draft', 'private', 'trash'), 'numberposts' => 1, 'meta_key' => '_luzik_path', 'meta_value' => $record['path']));
            if ($found) { $id = $found[0]->ID; }
            else {
                $id = wp_insert_post(array('post_type' => 'luzik_seo', 'post_status' => 'publish', 'post_title' => $record['title'], 'meta_input' => array('_luzik_path' => $record['path'])), true);
                if (is_wp_error($id)) { throw new RuntimeException($id->get_error_message()); }
                $report['pages_created']++;
            }
        }
        $fields = array('template' => 'rank_math_title', 'description' => 'rank_math_description', 'socialTitle' => 'rank_math_facebook_title', 'socialDescription' => 'rank_math_facebook_description', 'socialImage' => 'rank_math_facebook_image');
        foreach ($fields as $key => $meta) {
            if (isset($record[$key]) && $record[$key] !== '' && !metadata_exists('post', $id, $meta)) {
                $value = $record[$key];
                // These optimized assets live on the public Next.js site, not on the CMS host.
                if ($key === 'socialImage' && str_starts_with($value, '/')) { $value = rtrim(get_option('luzik_seo_public_url'), '/') . $value; }
                add_post_meta($id, $meta, wp_slash($value), true); $report['fields_added']++;
            }
        }
        if (!empty($record['noindex']) && !metadata_exists('post', $id, 'rank_math_robots')) { add_post_meta($id, 'rank_math_robots', array('noindex'), true); }
    }
    update_option('luzik_seo_import_report', $report, false);
    return $report;
}
