<?php

namespace Gzly\Plugin\GzlyPortfolio;

add_action('admin_notices', function() {
    global $post;
    global $taxonomy;

    if (!is_admin()) {
        return;
    }
    if (get_post_type($post) === CUSTOM_POST_TYPE || $taxonomy === CUSTOM_TAXONOMY) {
        gzly_banner();
        wp_enqueue_style('custom-media', plugins_url(PLUGIN_NAME) . '/build/backend.css');
    }
});

// Funktion zur Darstellung der Metabox
function gzly_banner() {
    // Hier den HTML-Inhalt deines Banners einfügen
    $logo = file_get_contents(__DIR__.'/../../public/assets/logo.svg');
    echo "
<div class=\"gzly-copyright-banner\">
    <div class='gzly-text'>
        <p><a href='https://wordpress.com/de/plugins/gzly-portfolio-gallery' target='_blank'>GZLY Portfolio</a> by <a href='https://grizzlyweb.de/from-wordpress' target='_blank'>grizzly.web</a></p>
    </div>
    <a href='https://grizzlyweb.de/from-wordpress' target='_blank' class='gzly-logo'>{$logo}</a>
</div>";
};
