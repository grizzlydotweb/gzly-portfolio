<?php
namespace Gzly\Plugin\GzlyPortfolio;

if(!class_exists('WP_List_Table')){
    require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}
if(!class_exists('WP_Posts_List_Table')){
    require_once( ABSPATH . 'wp-admin/includes/class-wp-posts-list-table.php' );
}

class GzlyCustomTable extends \WP_Posts_List_Table
{
    // remove search box
    public function search_box( $text, $input_id ){ }

    // Your custom list table is here
    public function display() {
        echo '<div id="gzly-reference-overview-entrypoint"></div>';
    }


    public function single_row($post, $level = 0)
    {
        $post                = get_post( $post );
        $thumb = get_the_post_thumbnail($post->ID, 'gzly_pf_reference_column_preview');

        $actions = $this->handle_row_actions($post, '', '');

        return "<div class='gzly-post'>
    <a class='gzly-post-teaser' href='/wp-admin/post.php?post={$post->ID}&action=edit'>
        <div class='gzly-post-title'>{$post->post_title}</div>
        <div class='gzly-post-image'>{$thumb}</div>
        <div class='gzly-post-categories'>{}</div>
    </a>
    <div class='gzly-post-actions'>
        {$actions}
    </div>
</div>";
    }

}


add_filter( 'views_edit-'. CUSTOM_POST_TYPE,  function (){

    global $wp_list_table;
    $mylisttable = new GzlyCustomTable();
    $wp_list_table = $mylisttable ;
});
