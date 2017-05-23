<?php

namespace App\Controllers;

use Wallaby\Base\Controller;

class TransactionsController extends Controller
{
    /**
     *
     *
     * @return void
     */
    public function __construct()
    {
        $this->theme = config('theme');
        $this->layout = 'layouts/app';
    }

    /**
     * Index
     *
     * @return void
     */
    public function actionIndex()
    {
        $this->title = config('appName') .' - ' . 'Rewards';
        
        return $this->render('transactions/index', [
            
        ]);
    }
}
