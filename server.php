<?php

use Wallaby\Router;

// session_start();

error_reporting(-1);

define('ROOT', __DIR__);

$url = strtolower(rtrim($_SERVER['QUERY_STRING'], '/'));

$config = require_once ROOT . '/config/router.php';

$router = new Router($config);

$router->start($url);
