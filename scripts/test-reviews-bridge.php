<?php
// Standalone contract test: no WordPress database, credentials or external downloads.
define('ABSPATH', __DIR__);
function add_action($name, $callback) {}
function sanitize_text_field($value) { return trim(strip_tags($value)); }
function wp_strip_all_tags($value) { return strip_tags($value); }
function esc_url_raw($value, $protocols) { return str_starts_with($value, 'https://') ? $value : ''; }
class WP_Error {
    public function __construct(public $code, public $message, public $data) {}
}
function is_wp_error($value) { return $value instanceof WP_Error; }
function verify($condition, $message) { if (!$condition) { throw new RuntimeException($message); } }
require __DIR__ . '/../wordpress/luzik-reviews/luzik-reviews.php';

$trustindex_pm_google = new class {
    public $details = array('id' => 'ChIJ6YYMDDonGEcRZEwLNN76QHc', 'name' => 'Szkoła Jazdy Luzik', 'rating_score' => 4.7, 'rating_number' => 456, 'access_token' => 'private-provider-token');
    public $rows = array();
    public function getPageDetails() { return $this->details; }
    public function getReviews() { return $this->rows; }
};
verify(is_wp_error(luzik_reviews_cached_place()), 'Empty cache must not return sample reviews');
$trustindex_pm_google->rows = array(
    (object) array('id' => 1, 'user' => 'Autor A', 'rating' => '2.0', 'text' => 'Tekst<br>druga linia &amp; dalej', 'date' => '2026-10-13', 'user_photo' => 'https://lh3.googleusercontent.com/avatar', 'private' => 'private-row-value'),
    (object) array('id' => 2, 'user' => 'Autor B', 'rating' => '5.0', 'text' => '', 'date' => '2026-10-12'),
    (object) array('id' => 3, 'user' => 'Ukryty', 'rating' => '5.0', 'text' => 'hidden-review', 'hidden' => 1),
    (object) array('id' => 4, 'user' => 'Nieprawidłowy', 'rating' => '9.0', 'text' => 'invalid-review'),
);
$place = luzik_reviews_cached_place();
verify(!is_wp_error($place), 'Real cache should be available');
verify(count($place['reviews']) === 2, 'Hidden and invalid reviews should be excluded');
verify($place['userRatingCount'] === 456 && $place['rating'] === 4.7, 'Business totals must not be calculated from ten displayed reviews');
verify($place['reviews'][0]['rating'] === 2 && $place['reviews'][1]['text']['text'] === '', 'Keep low ratings and rating-only reviews');
verify($place['reviews'][0]['text']['text'] === "Tekst\ndruga linia & dalej", 'Decode content without HTML');
verify(!str_contains(json_encode($place), 'private-'), 'Never return private source fields');
$trustindex_pm_google->details['id'] = 'another-business';
verify(is_wp_error(luzik_reviews_cached_place()), 'Reject other business data');
$trustindex_pm_google->details['id'] = 'ChIJ6YYMDDonGEcRZEwLNN76QHc';
$trustindex_pm_google->rows = array_fill(0, 15, $trustindex_pm_google->rows[0]);
verify(count(luzik_reviews_cached_place()['reviews']) === 10, 'Respect the ten-review display limit');
$trustindex_pm_google = null;
verify(is_wp_error(luzik_reviews_cached_place()), 'Missing Trustindex must be reported as unavailable');
echo "Trustindex bridge contract checks passed.\n";
