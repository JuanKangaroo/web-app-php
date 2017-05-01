<?php

use Wallaby\Router;

// session_start();

error_reporting(-1);

define('ROOT', __DIR__);

$config = require_once __DIR__ . '/config/app.php';

global $config;

$url = strtolower(rtrim($_SERVER['QUERY_STRING'], '/'));

$configRouter = require_once ROOT . '/config/router.php';

$router = new Router($configRouter);

$router->start($url);
