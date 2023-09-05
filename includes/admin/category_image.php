<?php
namespace Gzly\Plugin\GzlyPortfolio;

add_action('admin_enqueue_scripts', function () {
    wp_enqueue_media();
    wp_enqueue_script('custom-media', plugins_url('gzly-portfolio-gallery') . '/includes/js/custom-media.js', array('jquery'), null, true);
});

function save_taxonomy_custom_fields( $term_id ) {
    if ( !isset( $_POST['term_meta'] ) ) {
        return;
    }

    $t_id = $term_id;
    $term_meta = sanitize_post($_POST['term_meta']);

    foreach ( $term_meta as $key => $value ){
        $success = update_term_meta($term_id, $key, $value);
    }
}

// Funktion zur Darstellung des Bildfelds in der Metabox
function render_term_image_field($term) {
    $id = get_term_meta($term->term_id, 'term_image', true);
    $image = wp_get_attachment_image($id, 'thumbnail');
    echo '
        <div style="margin-bottom: 20px">
            <label for="term-image">Bild auswählen:</label>
            <input type="hidden" id="term-image" name="term_meta[term_image]" value="' . esc_attr($id) . '" />
            <div id="gzly-preview-image">'. $image .'</div>
            <button class="button" id="gzly-term-image-upload-button">Bild auswählen</button>
        </div>
    ';
}
$taxonomy = CUSTOM_TAXONOMY;
add_action( "{$taxonomy}_edit_form_fields", 'Gzly\Plugin\GzlyPortfolio\render_term_image_field', 10, 2 );
add_action( "{$taxonomy}_add_form_fields", 'Gzly\Plugin\GzlyPortfolio\render_term_image_field', 10, 1 );

// Save the changes made on the "presenters" taxonomy, using our callback function
add_action( "edited_{$taxonomy}", 'Gzly\Plugin\GzlyPortfolio\save_taxonomy_custom_fields', 10, 2 );
add_action( "created_{$taxonomy}", 'Gzly\Plugin\GzlyPortfolio\save_taxonomy_custom_fields', 10, 2 );
