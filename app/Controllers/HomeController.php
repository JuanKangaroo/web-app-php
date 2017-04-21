<?php

namespace App\Controllers;

use Wallaby\Base\Controller;

class HomeController extends Controller
{
    /**
     *
     *
     * @return void
     */
    public function __construct()
    {
        $this->layout = 'layouts/app';
    }

    /**
     * Index
     *
     * @return void
     */
    public function actionIndex()
    {
        return $this->render('home/index', [
            
        ]);
    }
}
