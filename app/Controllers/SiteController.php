<?php

namespace App\Controllers;

use Wallaby\Base\Controller;
// use Models\User;

class SiteController extends BaseController
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

        parent::__construct();
        
        // set the theme and layout
        $this->theme = config('theme');
        $this->layout = 'layouts/landing';
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
    public function actionVerify()
    {
        $this->title = config('appName') .' - ' . 'Verify';

        if (!isset($_GET['token'], $_GET['email'])) {
            return $this->render('site/error', [
                'code' => 400, 
                'message' => 'Invalid Verification token. Try again.'
            ]);
        }

        $token = $_GET['token'];
        $email = $_GET['email'];

        if (empty($token) || empty($email)) {
            return $this->render('site/error', [
                'code' => 400, 
                'message' => 'Invalid Verification token. Try again.'
            ]);
        }

        return $this->render('site/verify', ['token' => $token, 'email' => $email]);
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
