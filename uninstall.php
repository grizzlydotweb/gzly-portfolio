<?php

namespace Gzly\Plugin\GzlyPortfolio;

require_once __DIR__ .'/includes/__vars.php';

if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit();
}

add_action('init', function ()  {
    $args = array(
        'post_type' => CUSTOM_POST_TYPE,
        'posts_per_page' => -1,
        'post_status' => 'any'
    );

    $custom_posts = get_posts($args);

    foreach ($custom_posts as $post) {
        wp_delete_post($post->ID, true);
    }
});

add_action('init', function () {
    $terms = get_terms(CUSTOM_TAXONOMY, array('hide_empty' => false));

    foreach ($terms as $term) {
        wp_delete_term($term->term_id, CUSTOM_TAXONOMY);
    }
});

add_action('init', function () {
    unregister_post_type(CUSTOM_POST_TYPE);
});

// Lösche die benutzerdefinierte Taxonomie
add_action('init', function () {
    unregister_taxonomy(CUSTOM_TAXONOMY);
}
);
