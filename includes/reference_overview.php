<?php

function modify_columns($columns) {
    $columns['gzly_categories'] = 'Kategorien';
    $columns['gzly_thumbnail'] = '<div style="float:right;">Vorschaubild</div>';
    return $columns;
}
add_filter('manage_gzly_portfolio_posts_columns', 'modify_columns');

function column_thumbnail_value($column_name, $post_id) {
    if ($column_name !== 'gzly_thumbnail') {
        return;
    }

    $image = get_the_post_thumbnail($post_id, 'gzly_pf_reference_column_preview');
    echo '<div style="float:right;">'. $image .'</div>';
}

function column_category_value($column_name, $post_id) {
    if ($column_name !== 'gzly_categories') {
        return;
    }

    $terms = get_the_terms($post_id, CUSTOM_TAXONOMY);

    if (!$terms || is_wp_error($terms)) {
        var_dump($terms);
        return;
    }

    echo implode(', ', array_map(function ($term) {
        return $term->name;
    }, $terms));
}

add_action('manage_posts_custom_column', 'column_thumbnail_value', 10, 2);
add_action('manage_posts_custom_column', 'column_category_value', 10, 2);
