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

        // set the theme and layout
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
        $this->title = config('appName') .' - ' . 'Loyalty Program';

        return $this->render('site/index');
        
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
        $this->title = config('appName') .' - ' . 'Login';

        return $this->render('site/login');
    }

    /**
     * Register
     *
     * @return void
     */
    public function actionRegister()
    {
        $this->title = config('appName') .' - ' . 'Register';
        
        return $this->render('site/signup');
    }

    /**
     * Register
     *
     * @return void
     */
    public function actionVerify($token)
    {
        $this->title = config('appName') .' - ' . 'Verify';

        var_dump($token); die;

        $token = $_GET['token'];

        return $this->render('site/verify');
    }

    /**
     * actionError
     *
     * @return void
     */
    public function actionError()
    {
        $this->title = config('appName') .' - ' . 'Error';

        return $this->render('site/error', ['code' => 404]);
    }
}
