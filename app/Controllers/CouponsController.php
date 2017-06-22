<?php

namespace App\Controllers;

use Wallaby\Base\Controller;

class CouponsController extends BaseController
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
        $this->title = config('appName') .' - ' . 'Coupons';
        return $this->render('coupons/index', []);
    }
}
