<?php
namespace Gzly\Plugin\GzlyPortfolio;

use GzlyWpSetup\Bootstrap;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * Gzly Portfolio
 *
 * @package           gzly-portfolio
 * @author            grizzly.web (Sebastian Müller)
 * @copyright         2023 grizzly.web (Sebastian Müller)
 * @license           GPL-2.0-or-later
 *
 * @wordpress-plugin
 * Plugin Name: Gzly Portfolio Mosaic Gallery
 * Author: grizzly.web
 * Author URI: https://github.com/grizzlydotweb
 * Version: 0.1
 * Requires at least: 6.3
 * Requires PHP: 8.0
 * Plugin URI: https://github.com/grizzlydotweb/gzly-portfolio
 * Description: A WordPress Plugin which enhances WordPress and adds Custom Post Type for References and according Blocks to the Site Editor
 * LICENSE: GPLv2
 * LICENSE_URI: https://www.gnu.org/licenses/gpl-2.0.html).
 */
Bootstrap::init();
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

function include_recursive_files($directory, $file_extensions = ['php']) {
    $directory_iterator = new RecursiveDirectoryIterator($directory);
    $iterator = new RecursiveIteratorIterator($directory_iterator);
    $files_to_include = [];
    $only_admin_files_to_include = [];

    foreach ($iterator as $file) {
        if ($file->isFile() && in_array($file->getExtension(), $file_extensions)) {
            if (str_contains($file->getPathname(), 'admin')) {
                $only_admin_files_to_include[] = $file->getPathname();
                continue;
            }

            $files_to_include[] = $file->getPathname();
        }
    }

    sort($files_to_include);
    sort($only_admin_files_to_include);

    foreach ($files_to_include as $file_to_include) {
        require_once $file_to_include;
    }

    // only include files in backend
    if (!is_admin()) {
        return;
    }

    foreach ($only_admin_files_to_include as $file_to_include) {
        require_once $file_to_include;
    }
}

include_recursive_files(__DIR__ .'/includes');

add_action('init', function () {
    if (isset($_GET['demo-data'])) {
        setUpDemoData(is_numeric($_GET['demo-data']) ? $_GET['demo-data'] : 50, true);
    }
});
