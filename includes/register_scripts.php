<?php

namespace Gzly\Plugin\GzlyPortfolio;

add_action('admin_enqueue_scripts', function () {
    wp_enqueue_media();

    $pluginUrl = plugins_url(PLUGIN_NAME);
    $pluginPath = dirname( plugin_basename( PLUGIN_NAME ) );

    $depFile = PLUGIN_PATH . '/build/admin_backend.asset.php';
    $version = null;
    $dependencies = [];
    if (file_exists($depFile)) {
        $conf = require $depFile;
        $version = $conf['version'];
        $dependencies = $conf['dependencies'];
    }

    $dependencies[] = 'wp-api';

    wp_enqueue_script('custom-media', $pluginUrl . '/includes/js/custom-media.js', array('jquery'), null, true);
    wp_enqueue_script('gzly_admin_backend', $pluginUrl . '/build/admin_backend.js', $dependencies, $version, true);
});
