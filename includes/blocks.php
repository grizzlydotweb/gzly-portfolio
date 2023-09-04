<?php

$asset_file = include( plugin_dir_path( __FILE__ ) . '/../build/backend.asset.php');
wp_register_script(
    PLUGIN_NAME,
    plugins_url( 'build/index.js', __FILE__ .'/../'),
    $asset_file['dependencies'],
    $asset_file['version']
);
function hauptsache_gallery_register_block(): void
{
    register_block_type( realpath(__DIR__.'/..') );
}
add_action( 'init', 'hauptsache_gallery_register_block' );
