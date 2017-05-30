<?php

namespace App\Controllers;

use Wallaby\Base\Controller;

class BaseController extends Controller
{
    protected $client;
    
    protected $pageUri;

    protected $requestHeaders = [
        'Authorization' => 'Bearer ',
        'Accept' => 'application/vnd.kangaroorewards.api.v1+json;',
        'Content-Type' => 'application/json',
    ];

    /**
     *
     *
     * @return void
     */
    public function __construct()
    {
        $this->theme = config('theme');
        $this->layout = 'layouts/main';

        // $this->client = new \GuzzleHttp\Client([
        //     'base_uri' => $GLOBALS['config']['api']['baseUrl'],
        // ]);

        $this->getPageUri();
    }

    public function getPageUri()
    {
        // $uriParts = explode('::', $method);

        $urlPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $parts = explode('/', ltrim($urlPath, '/')); //print_r($parts); die;
        
        if (isset($parts[0], $parts[1])) {
            $controller = strtolower($parts[0]);
            $action = strtolower($parts[1]);

            $this->pageUri = '/' . $controller . '/' . $action;
        } elseif (isset($parts[0])) {
            $controller = strtolower($parts[0]);

            $this->pageUri = '/' . $controller;
        }
    }
}
