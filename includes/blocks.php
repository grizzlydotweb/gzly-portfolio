<?php
namespace Gzly\Plugin\GzlyPortfolio;

$asset_file = include( plugin_dir_path( __FILE__ ) . '/../build/backend.asset.php');
wp_register_script(
    PLUGIN_NAME,
    plugins_url( 'build/index.js', __FILE__ .'/../'),
    $asset_file['dependencies'],
    $asset_file['version']
);

add_action( 'init', function() {
    register_block_type( realpath(__DIR__.'/..') );
} );
