;(function($, api, undefined) {
    'use strict';

    var App = {
        isLoading: true,
        spinner: document.querySelector('.loader'),
        // container: document.querySelector('.main'),
        $loginForm: $('form.login'),
        $signupForm: $('form.signup'),
        $message: $('#message__container'),
        config: config || {},
    };

    /*****************************************************************************
     *
     * Methods for dealing with the API (API Requests, handle response)
     *
     ****************************************************************************/

    App.handleResponse = function(response, ajaxOptions) {
        console.log('action', ajaxOptions.action, 'data', response);
        try {
            if (ajaxOptions.action == 'user_login' && response.token_type == 'Bearer') {
                localStorage.setObject('user_token', response);//store the token
                location.href = App.config.appBaseUrl + App.config.appHomeUrl;
            } else if (ajaxOptions.action == 'user_signup') {
                location.href = KangarooApi.config.appBaseUrl + KangarooApi.config.appLoginUrl;
            } else if (ajaxOptions.action == 'api_me' && ajaxOptions.method == 'GET') {
                //fill the page with the info from API
                App.buildUserProfile(response.data);
                App.buildBusinessesList(response.data);
            }
        } catch (e) {
            console.log(e);
            //TODO: show alert message
        }
    };

    App.handleError = function(error) {
        App.hideSpinner();
        if (error.response.status == 401) {
            App.alert('NOT_OK', error.response.data.message);
        } else if (error.response.status == 422) {
            App.alert('NOT_OK', error.response.data.email[0]);
        }
    };

    App.alert = function(type, message, delayTime) {
        var delay = 4000;
        var alertContent = '<div class="alert-content"><span>' + message + '</span></div>';

        if (typeof delayTime != 'undefined') delay = delayTime;

        if (type == 'NOT_OK') {
            App.$message.find('.message__error').html(alertContent).fadeIn().delay(delay).fadeOut();
        } else if (type == 'OK') {
            App.$message.find('.message__success').html(alertContent).fadeIn().delay(delay).fadeOut();
        }

        App.scrollTop();
    };

    App.getAccount = function () {
        api.client.request({ 
            url: App.config.api.endpoints.me, 
            method: 'GET',
            action: 'api_me',
            params: {},
        }, App.handleResponse, App.handleError);
    };

    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    $(document).on('click', '#login__btn', function(e) {
        e.preventDefault();

        api.login({
            username: App.$loginForm.find('#email').val(), 
            password: App.$loginForm.find('#password').val(),
        }, App.handleResponse, App.handleError);
    });

    $(document).on('click', '#signup_btn', function(e) {
        e.preventDefault();

        api.signup({
            'email': App.$signupForm.find('#email').val(),
            'pin_code': App.$signupForm.find('#password').val(),
        }, App.handleResponse, App.handleError);
    });

    $(document).on('click', '#logout', function(e) {
        api.logout();
    });

    /*****************************************************************************
     *
     * Methods for dealing with the UI and App logic
     *
     ****************************************************************************/

    /*
     * Gets a template
     */
    App.getTemplate = function(url) {
        $.get(url, function(template) {
            $('#target').html(template);
        });
    };

    App.hideSpinner = function() {
        App.spinner.setAttribute('hidden', true);
    };

    App.showSpinner = function() {
        App.spinner.removeAttribute('hidden');
    };

    App.buildUserProfile = function(context) {
        // console.log(context); return;
        var source   = $("#tpl_login").html(); //console.log(source); return;
        var template = Handlebars.compile(source);

        $('#user__profile').html(template(context));
    };

    App.buildBusinessesList = function(context) {
        // console.log(context); return;
        var source   = $("#tpl_businesses").html(); //console.log(source); return;
        var template = Handlebars.compile(source);

        $('#business__list').html(template(context));
    };

    App.scrollTop = function() {
        $("html, body").animate({ scrollTop: "0px" });
    }

    App.isAuthenticated = function () {
        var userToken = localStorage.getObject('user_token');

        if (userToken) {
            return true;
        }

        return false;
    };

    App.init = function() {
        App.hideSpinner();

        this.redirectIfAuthenticated();

        this.handlePage();
    };

    App.redirectIfAuthenticated = function() {
        var redirectToHome =  App.config.appBaseUrl + App.config.appHomeUrl;
        var redirectToRegister =  App.config.appBaseUrl + App.config.appRegisterUrl;
        var currentUrl = top.location.href;

        currentUrl = currentUrl.replace(/\/$/, "");//remove the last / from url

        console.log('currentUrl', currentUrl, 'App.config.appHomeUrl', redirectToHome);

        // if (App.isAuthenticated() && currentUrl != redirectTo) {
        //     location.href = redirectTo;
        // } else 
        if(!App.isAuthenticated() && !$.inArray(currentUrl, [redirectToHome, redirectToRegister ])) {
            location.href = App.config.appBaseUrl;
        }
    };

    App.handlePage = function () {
        var redirectTo =  App.config.appBaseUrl + App.config.appHomeUrl;
        var currentUrl = top.location.href;

        currentUrl = currentUrl.replace(/\/$/, "");//remove the last / from url

        // console.log('currentUrl', currentUrl, 'App.config.appHomeUrl', App.config.appHomeUrl);
        if (currentUrl == App.config.appBaseUrl + App.config.appHomeUrl) {
            //home page
            App.getAccount();
        } else if (currentUrl == App.config.appBaseUrl && App.isAuthenticated()) {
            //login page and user is authenticated
            location.href = App.config.appBaseUrl + App.config.appHomeUrl;
        }
    };

    /************************************************************************
     *
     * Code required to start the App
     *
     ************************************************************************/

    App.init();

})(jQuery, KangarooApi);


$( document ).ready(function(){
    // console.log('Ready');
    // App.ready();
});
