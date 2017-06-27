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
    public function actionInstall()
    {
        \App\Utils::createTables();
        echo 'done';
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
     * Index
     *
     * @return void
     */
    public function actionForgotPassword()
    {
        $this->title = config('appName') .' - ' . 'Forgot Password';

        return $this->render('site/reset');
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

        $token = isset($_GET['token']) ? $_GET['token'] : null;
        $email = isset($_GET['email']) ? $_GET['email'] : null;
        $phone = isset($_GET['phone']) ? $_GET['phone'] : null;
        $action = isset($_GET['action']) ? $_GET['action'] : null;

        return $this->render('site/verify', [
            'token' => $token,
            'email' => $email,
            'phone' => $phone,
            'action' => $action,
        ]);
    }

    public function actionContact()
    {
        $this->title = config('appName') .' - ' . 'Contact Us';

        return $this->render('site/contact');
    }

    public function actionAjaxContact()
    {
        return $this->renderPartial('site/_contact');
    }

    public function actionAjaxProfile()
    {
        return $this->renderPartial('site/_profile');
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
