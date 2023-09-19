<?php

namespace GzlyWpClasses;

class Bootstrap
{

    public static function autoload($class) {
        $prefix = 'GzlyWpSetup\\';

        // Prüfe, ob die Klasse mit dem Namespace-Präfix beginnt
        if (strpos($class, $prefix) === 0) {
            // Ersetze den Namespace-Trenner mit dem Verzeichnistrenner und lade die Klasse
            $class = str_replace($prefix, '', $class);
            $class = str_replace('\\', DIRECTORY_SEPARATOR, $class);
            $file = __DIR__ . DIRECTORY_SEPARATOR . $class . '.php';

            if (file_exists($file)) {
                require_once($file);
            }
        }
    }
}
