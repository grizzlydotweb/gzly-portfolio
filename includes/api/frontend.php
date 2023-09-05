<?php
namespace Gzly\Plugin\GzlyPortfolio;

use WP_Query;

add_action('rest_api_init', function () {
    register_rest_route('gzly-portfolio/v1', '/categories', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $query = [
                'taxonomy' => 'gzly_pf_category',
                'childless' => false,
            ];
            $parent_slug = urldecode($request->get_param('parent')); // Kategorie-Parameter aus der Anfrage
            $parent_term = get_term_by('slug', $parent_slug, 'gzly_pf_category');
            if ($parent_term) {
                $query['child_of'] = $parent_term->term_id;
            }
            return rest_ensure_response([...array_map('Gzly\Plugin\GzlyPortfolio\convert_term_to_response', get_terms($query))]);
        }
    ,
    ));

    register_rest_route('gzly-portfolio/v1', '/references', array(
        'methods' => 'GET',
        'callback' => function($request) {
            $args = array(
                'post_type' => 'gzly_portfolio',
                'posts_per_page' => PHP_INT_MAX, // Alle Beiträge
            );

            $categories = explode(',', urldecode($request->get_param('categories'))); // Kategorie-Parameter aus der Anfrage
            if ($request->get_param('categories') && count($categories) > 0) {
                $args['tax_query'] = array(
                    array(
                        'taxonomy' => 'gzly_pf_category',
                        'field' => 'slug',
                        'terms' => $categories,
                    ),
                );
            }

            $query = new WP_Query($args);

            $posts = array();
            foreach ($query->posts as $post) {
                $terms = get_the_terms($post->ID, 'gzly_pf_category');
                $termsResponse = [];
                if ($terms && !is_wp_error($terms)) {
                    $termsResponse = array_map('Gzly\Plugin\GzlyPortfolio\convert_term_to_response', $terms);
                }

                $imageId = get_post_thumbnail_id($post->ID);
                $imageMeta = wp_get_attachment_metadata($imageId);

                $sizes = [];
                foreach ($imageMeta['sizes'] as $key => $size) {
                    $sizes[$key] = [
                        'id' => $imageId,
                        'url' => wp_get_attachment_image_url($imageId, $key),
                        'width' => $size['width'],
                        'height' => $size['height'],
                    ];
                }

                $sizes['original'] = [
                    'id' => $imageId,
                    'url' => get_the_post_thumbnail_url($post->ID),
                    'width' => $imageMeta['width'],
                    'height' => $imageMeta['height'],
                ];

                $posts[] = array(
                    'id' => $post->ID,
                    'title' => $post->post_title,
                    'content' => $post->post_content,
                    'sizes' => $sizes,
                    'terms' => $termsResponse
                    // Füge weitere Felder hinzu, die du benötigst
                );
            }

            return rest_ensure_response($posts);
        },
    ));
});





