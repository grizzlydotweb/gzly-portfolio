<?php

add_action('rest_api_init', function () {
    register_rest_route('gzly-portfolio/v1/backend', '/categories', array(
        'methods' => 'GET',
        'callback' => function()
        {
            global $wpdb;

            $query = "
SELECT
    tax.term_id
FROM
    wp_term_taxonomy AS tax
WHERE
    tax.taxonomy = 'gzly_pf_category'
AND
    (tax.count > 0 OR (
          SELECT COUNT(term_id) FROM wp_term_taxonomy WHERE parent = tax.term_id
      ) > 0)
GROUP BY
    tax.term_id

";

            $result = $wpdb->get_results($query, ARRAY_A);

            if (!$result || count($result) <= 0) {
                return rest_ensure_response([]);
            }

            $config = [
                'taxonomy' => 'gzly_pf_category',
                'include' => array_map(function ($row) {
                    return $row['term_id'];
                }, $result),
            ];

            return rest_ensure_response([...array_map('convert_term_to_response', get_terms($config))]);
        }
    ,
    ));

});

