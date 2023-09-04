<?php

add_action('init', function() {
    $labels = array(
        'name' => __('GZLY Portfolio'),
        'singular_name' => __('Referenz'),
        'all_items' => __('Alle Referenzen'),
        'add_new' => _x('Neue Referenz hinzufügen', 'Referenz'),
        'add_new_item' => __('Füge eine neue Referenz hinzu'),
        'edit_item' => __('Bearbeite Referenz'),
        'new_item' => __('Neue Referenz'),
        'view_item' => __('Sehen Sie sich die Refenenz an'),
        'search_items' => __('Suchen Sie nach Referenzen'),
        'not_found' => __('Keine Referenz gefunden'),
        'not_found_in_trash' => __('Keine Referenzen im Papierkorb'),
        'parent_item_colon' => ''
    );

    $taxonomy = register_taxonomy(CUSTOM_TAXONOMY, CUSTOM_POST_TYPE, array(
        'label' => __('Kategorie'),
        'rewrite' => array('slug' => 'portfolio'),
        'hierarchical' => true,
    ));

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => false,
        'menu_icon' => 'dashicons-format-gallery',
        'taxonomies' => array(CUSTOM_TAXONOMY),
        'query_var' => true,
        'menu_position' => 20,
        'supports' => array('thumbnail', 'title', 'editor')

    );

    register_post_type(CUSTOM_POST_TYPE, $args);

    if (isset($_GET['demo-data'])) {
        setUpDemoData(50, true);
    }
});

function setUpDemoData($count = 0, $delete = false) {

    $categories = [
        [
            'slug' => 'grafikdesign',
            'title' => 'Grafikdesign Branding',
        ],
        [
            'slug' => 'composing',
            'title' => 'Fotografie Composings',
        ],
        [
            'slug' => 'kreativ-welt',
            'title' => 'Kreativ Welt',
        ],
    ];

    $form = [
        [
            'slug' => 'lang',
            'search' => 'long',
        ],
        [
            'slug' => 'rund',
            'search' => 'round',
        ],
        [
            'slug' => 'quadratisch',
            'search' => 'square',
        ],
        [
            'slug' => 'mosaik',
            'search' => 'mosaic',
        ],
    ];

    if ($delete) {
        $posts = get_posts([
            'post_type' => 'gzly_portfolio',
            'posts_per_page' => PHP_INT_MAX,
            'post_status' => 'any',
        ]);
        $attachments = get_posts([
            'post_type' => 'attachment',
            'posts_per_page' => PHP_INT_MAX,
            'post_status' => 'any',
        ]);
        foreach ($attachments as $post) {
            wp_delete_post($post->ID);
        }
        foreach ($posts as $post) {
            wp_delete_attachment($post->ID);
            wp_delete_post($post->ID);
        }
    }

    for ($i = 0; $i < $count; $i++) {
        $randomCat = $categories[rand(0, count($categories) -1)];
        $randomForm = $form[rand(0, count($form) -1)];
        switch ($randomForm['slug']) {
            case 'lang':
                $size = '1920x1080';
                break;
            case 'quadratisch':
                $size = '1080x1080';
                break;
            case 'hoch':
                $size = '1080x1920';
                break;
            default:
                $size = '1080x1080';
        }

        $searchTerm=urlencode($randomCat['title']);
        $url = 'https://source.unsplash.com/'.$size .'/?'. $searchTerm;

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_exec($ch);
        $response = curl_getinfo($ch);
        curl_close($ch);

        $image_url = $response['url'];

        // Upload the image
        $upload_dir = wp_upload_dir();
        $image_data = wp_remote_get($image_url);
        if (is_wp_error($image_data)) {
            var_dump($image_data);die();
        }

        $filename = basename(parse_url($image_url, PHP_URL_PATH)) .'.jpg';
        $upload_file = $upload_dir['path'] . '/' . $filename;
        file_put_contents($upload_file, $image_data['body']);

        $attachment = [
            'guid'           => $upload_file,
            'post_mime_type' => $image_data['headers']['content-type'],
            'post_title'     => $filename,
            'post_content'   => '',
            'post_status'    => 'inherit'
        ];

        require_once( ABSPATH . 'wp-admin/includes/image.php' );
        // Insert the attachment
        $attachmentId = wp_insert_attachment($attachment, $upload_file);
        $image_sizes = get_intermediate_image_sizes();
        foreach ($image_sizes as $size) {
            $image_path = get_attached_file($attachmentId);
            $resized = image_make_intermediate_size($image_path, get_option($size . '_size_w'), get_option($size . '_size_h'), true);

            if ($resized) {
                $metadata = wp_generate_attachment_metadata($attachmentId, $image_path);
                wp_update_attachment_metadata($attachmentId, $metadata);
            }
        }

        $post = sanitize_post([
            'post_title' => 'Dummy Referenz '. $i,
            'post_status' => 'publish',
            'post_type' => 'gzly_portfolio',
        ]);

        $newPostId = wp_insert_post($post);

        set_post_thumbnail( $newPostId, $attachmentId );

        if (!is_int($newPostId)) {
            continue;
        }

        $catIdArray = term_exists($randomCat['slug'], 'gzly_pf_category');
        if (is_array($catIdArray)) {
            wp_set_post_terms($newPostId, [$catIdArray['term_id']], 'gzly_pf_category', true);
        }
    }
}
