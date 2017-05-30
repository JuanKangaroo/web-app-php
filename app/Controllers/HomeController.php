<?php

namespace App\Controllers;

use Wallaby\Base\Controller;

class HomeController extends BaseController
{
    /**
     *
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();

        $this->theme = config('theme');
        $this->layout = 'layouts/main';
    }

    /**
     * Index
     *
     * @return void
     */
    public function actionIndex()
    {
        $this->title = config('appName') .' - ' . 'Home';
        
        // try {
        //     $headers = $this->requestHeaders;
        //     $headers['Authorization'] = 'Bearer some wrong token';

        //     $response = $this->client->get('/users/me', [
        //         'headers' => $this->requestHeaders,
        //     ]);

        //     $account = json_decode($response->getBody());

        //     var_dump($account); die;
        // } catch (\GuzzleHttp\Exception\ClientException $e) {
        //     if ($e->getCode() == 401) {
        //         echo 'Unauthenticated';
        //     }

        //     var_dump($e->getMessage()); die;
        // }

        return $this->render('home/index', []);
    }
}
