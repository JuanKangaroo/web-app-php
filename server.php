<?php

use Wallaby\Router;

// session_start();

error_reporting(-1);

define('ROOT', __DIR__);

$config = require_once __DIR__ . '/config/app.php';

global $config;

if (!function_exists('config')) {
    /**
     * Get / set the specified configuration value.
     *
     * If an array is passed as the key, we will assume you want to set an array of values.
     *
     * @param  array|string  $key
     * @param  mixed  $default
     * @return mixed
     */
    function config($key = null, $default = null)
    {   
        return $GLOBALS['config'][$key];
    }
}

$url = strtolower(rtrim($_SERVER['QUERY_STRING'], '/'));

$configRouter = require_once ROOT . '/config/router.php';

$router = new Router($configRouter);

$router->start($url);
