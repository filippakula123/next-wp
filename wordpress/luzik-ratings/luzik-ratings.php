<?php
/**
 * Plugin Name: Luzik — oceny instruktorów
 * Description: Historyczne oceny Rate My Post i zapis nowych ocen z Next.js.
 * Version: 1.0.1
 */
if (!defined('ABSPATH')) exit;
function luzik_ratings_seed() { return json_decode(file_get_contents(__DIR__ . '/seed.json'), true); }
function luzik_ratings_install() {
    global $wpdb;
    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    $charset = $wpdb->get_charset_collate();
    dbDelta("CREATE TABLE {$wpdb->prefix}luzik_ratings (slug varchar(191) NOT NULL, votes bigint unsigned NOT NULL DEFAULT 0, total bigint unsigned NOT NULL DEFAULT 0, PRIMARY KEY (slug)) ENGINE=InnoDB $charset;");
    dbDelta("CREATE TABLE {$wpdb->prefix}luzik_rating_votes (id bigint unsigned NOT NULL AUTO_INCREMENT, slug varchar(191) NOT NULL, voter char(64) NOT NULL, rating tinyint unsigned NOT NULL, PRIMARY KEY (id), UNIQUE KEY visitor_profile (slug,voter)) ENGINE=InnoDB $charset;");
    foreach (luzik_ratings_seed() as $slug => $row) {
        $wpdb->query($wpdb->prepare("INSERT IGNORE INTO {$wpdb->prefix}luzik_ratings (slug,votes,total) VALUES (%s,%d,%d)", $slug, $row['count'], $row['sum']));
    }
    if (!get_option('luzik_ratings_secret')) add_option('luzik_ratings_secret', wp_generate_password(64, false, false), '', false);
}
register_activation_hook(__FILE__, 'luzik_ratings_install');
function luzik_ratings_read($request) {
    global $wpdb;
    $row = $wpdb->get_row($wpdb->prepare("SELECT votes,total FROM {$wpdb->prefix}luzik_ratings WHERE slug=%s", $request['slug']), ARRAY_A);
    if (!$row) return new WP_Error('not_found', 'Nieznany profil.', array('status'=>404));
    $response = new WP_REST_Response(array('count'=>(int)$row['votes'], 'sum'=>(int)$row['total']));
    $response->header('Cache-Control','no-store');
    return $response;
}
function luzik_ratings_permission($request) {
    $secret = get_option('luzik_ratings_secret', '');
    return strlen($secret) >= 32 && hash_equals($secret, (string)$request->get_header('X-Luzik-Ratings-Secret'));
}
function luzik_ratings_vote($request) {
    global $wpdb;
    $data=$request->get_json_params(); $slug=$request['slug'];
    if (!array_key_exists($slug,luzik_ratings_seed())) return new WP_Error('not_found','Nieznany profil.',array('status'=>404));
    if (!is_array($data) || !isset($data['rating'],$data['voter'],$data['limit']) || !is_int($data['rating']) || $data['rating']<1 || $data['rating']>5 || !is_string($data['voter']) || !is_string($data['limit']) || !preg_match('/^[a-f0-9]{64}$/',$data['voter']) || !preg_match('/^[a-f0-9]{64}$/',$data['limit'])) return new WP_Error('invalid','Nieprawidłowa ocena.',array('status'=>400));
    $table=$wpdb->prefix.'luzik_rating_votes';
    if ($wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE slug=%s AND voter=%s",$slug,$data['voter']))) return new WP_Error('duplicate','Już oceniłeś instruktora.',array('status'=>409));
    $rate_key='luzik_rating_'.substr($data['limit'],0,40);
    if (get_transient($rate_key)) return new WP_Error('too_fast','Odczekaj chwilę.',array('status'=>429));
    // A database lock serializes this visitor's attempts; unique rows and a transaction protect totals.
    $lock='luzik_r_'.substr($data['limit'],0,40);
    if ((int)$wpdb->get_var($wpdb->prepare('SELECT GET_LOCK(%s,2)',$lock))!==1) return new WP_Error('busy','Spróbuj ponownie.',array('status'=>429));
    try {
        if (get_transient($rate_key)) return new WP_Error('too_fast','Odczekaj chwilę.',array('status'=>429));
        $wpdb->query('START TRANSACTION');
        $insert=$wpdb->query($wpdb->prepare("INSERT IGNORE INTO $table (slug,voter,rating) VALUES (%s,%s,%d)",$slug,$data['voter'],$data['rating']));
        if ($insert!==1) { $wpdb->query('ROLLBACK'); return new WP_Error($insert===0?'duplicate':'storage','Nie udało się zapisać oceny.',array('status'=>$insert===0?409:500)); }
        $updated=$wpdb->query($wpdb->prepare("UPDATE {$wpdb->prefix}luzik_ratings SET votes=votes+1,total=total+%d WHERE slug=%s",$data['rating'],$slug));
        if ($updated!==1 || $wpdb->query('COMMIT')===false) { $wpdb->query('ROLLBACK'); return new WP_Error('storage','Nie udało się zapisać oceny.',array('status'=>500)); }
        set_transient($rate_key,1,60);
        return luzik_ratings_read($request);
    } finally { $wpdb->get_var($wpdb->prepare('SELECT RELEASE_LOCK(%s)',$lock)); }
}
add_action('rest_api_init',function() {
    register_rest_route('luzik/v1','/instructor-ratings/(?P<slug>[a-z0-9-]+)',array(
        array('methods'=>'GET','callback'=>'luzik_ratings_read','permission_callback'=>'__return_true'),
        array('methods'=>'POST','callback'=>'luzik_ratings_vote','permission_callback'=>'luzik_ratings_permission'),
    ));
});
add_action('admin_enqueue_scripts',function($hook) {
    if ($hook === 'settings_page_luzik-ratings') wp_enqueue_script('luzik-ratings-admin',plugins_url('admin.js',__FILE__),array(),'1.0.1',true);
});
add_action('admin_menu',function() {
    add_options_page('Oceny instruktorów','Oceny instruktorów','manage_options','luzik-ratings',function() {
        if (!current_user_can('manage_options')) return;
        echo '<div class="wrap"><h1>Oceny instruktorów</h1><p>Ustaw poniższy klucz jako WORDPRESS_RATINGS_SECRET w Next.js. Nie udostępniaj go publicznie.</p><label class="screen-reader-text" for="luzik-ratings-secret">Klucz połączenia z Next.js</label><input id="luzik-ratings-secret" type="password" readonly class="large-text" value="'.esc_attr(get_option('luzik_ratings_secret','')).'" autocomplete="off" spellcheck="false"><p><button type="button" class="button button-primary" id="luzik-ratings-copy">Kopiuj klucz</button> <button type="button" class="button" id="luzik-ratings-show" aria-pressed="false" aria-controls="luzik-ratings-secret">Pokaż klucz</button></p><p id="luzik-ratings-copy-status" role="status" aria-live="polite"></p><p>Wklej klucz jako wartość WORDPRESS_RATINGS_SECRET w zmiennych środowiskowych aplikacji na Hostingerze, potem wdróż ją ponownie.</p><h2>Oceny kursantów</h2><table class="widefat"><thead><tr><th>Profil</th><th>Liczba ocen</th><th>Średnia</th></tr></thead><tbody>';
        global $wpdb;
        foreach ($wpdb->get_results("SELECT slug,votes,total FROM {$wpdb->prefix}luzik_ratings ORDER BY slug") as $row) echo '<tr><td>'.esc_html($row->slug).'</td><td>'.(int)$row->votes.'</td><td>'.esc_html($row->votes?round($row->total/$row->votes,2):'—').'</td></tr>';
        echo '</tbody></table><p>Historia pochodzi z kopii bazy z 6.10.2026. Nowe oceny są dopisywane do tych wartości. Ponowna aktywacja wtyczki nie zeruje głosów.</p></div>';
    });
});
