<?php

namespace Gzly\Plugin\GzlyPortfolio;

function convert_term_to_response($term)
{
    $id = get_term_meta($term->term_id, 'term_image', true);
    $image = wp_get_attachment_image($id, 'thumbnail');

    return [
        'slug' => $term->slug,
        'title' => $term->name,
        'image' => $image,
        'imageUrl' => wp_get_attachment_image_url($id, 'thumbnail'),
        'description' => $term->description,
    ];
}
