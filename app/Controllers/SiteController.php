<?php

namespace App\Controllers;

use Wallaby\Base\Controller;
// use Models\User;

class SiteController extends Controller
{
    // private $model;

    /**
     *
     *
     * @return void
     */
    public function __construct()
    {
        // $this->model = new User();

        // set the layout
        $this->layout = 'layouts/main';
    }

    /**
     * Index
     *
     * @return void
     */
    public function actionIndex()
    {
        return $this->render('site/login');
        
        // $users = $this->model->findAll();

        // return $this->render('site/index', [
        //     'users' => ['John', 'Max'],
        // ]);
    }

    /**
     * Index
     *
     * @return void
     */
    public function actionLogin()
    {
        // if (isset($_POST['username'], $_POST['password'])) { }
        return $this->render('site/login');
    }

    /**
     * Register
     *
     * @return void
     */
    public function actionRegister()
    {
        return $this->render('site/signup');
    }

    /**
     * actionError
     *
     * @return void
     */
    public function actionError()
    {
        return $this->render('site/error', ['code' => 404]);
    }
}
