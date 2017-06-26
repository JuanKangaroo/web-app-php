<?php

namespace App\Controllers;

use Wallaby\Base\Controller;

class BusinessController extends BaseController
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
    public function actionDetail()
    {
        $this->title = config('appName') .' - ' . 'Detail';
        $token = isset($_GET['id']) ? $_GET['id'] : null;
        return $this->render('business/detail', []);
    }
}
