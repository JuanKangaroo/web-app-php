//=========================================================================
//              Extending Storage to set and get Objects
//=========================================================================
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
};

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};

;(function($, undefined) {
    'use strict';

    var App = {
        isLoading: true,
        spinner: document.querySelector('.loader'),
        // container: document.querySelector('.main'),
        $loginForm: $('form.login'),
        $signupForm: $('form.signup'),
        $message: $('#message__container'),
        client: new AjaxRequest(),
        config: config || {},
    };

    // window.App = App || {};

    function AjaxRequest() {
        var options = {};
    }

    AjaxRequest.prototype.request = function(options) {
        var self = this;
        var headers = {};

        var token = localStorage.getObject('user_token');
        headers = App.config.headers;
        //append access token to the headers
        headers.Authorization = token.token_type +' '+ token.access_token;

        //merge default options with options passed
        self.options = $.extend({
            'url': '',
            'timeout': 20000,
            'showLoading': true,
            'method': 'GET',
            'params': {},
            'headers': headers,
        }, options);

        // console.log(self.options); console.log(options);

        if (self.options.showLoading) App.showSpinner();

        axios({
            method: self.options.method,
            url: self.options.url,
            data: self.options.params,
            headers: self.options.headers
        }).then(response => {
            // console.log(response.data);
            App.handleResponse(response.data, self.options);
            App.hideSpinner();
        })
        .catch (error => {
            // List errors on response...
            console.log(error); console.log(error.response);
            
            App.log('error', App.config.appName, JSON.stringify(error));

            App.hideSpinner();

            // if (error.response.data.message) {
            //     App.log('error', App.config.appName, JSON.stringify(error.response));
            //     App.alert('NOT_OK', error.response.data.message);
            //     console.log(error.response.data.message);
            // } else {
            //     App.log('error', App.config.appName, error);
            //     App.alert('NOT_OK', error);
            // }
        });
    }

    App.handleResponse = function(response, ajaxOptions) {
        console.log('action', ajaxOptions.action, 'data', response);
        try {
            if (ajaxOptions.action == 'user_login' && response.token_type == 'Bearer') {
                localStorage.setObject('user_token', response);//store the token
                location.href = App.config.appBaseUrl + App.config.appHomeUrl;
            } else if (ajaxOptions.action == 'api_me' && ajaxOptions.method == 'GET') {
                //fill the page with the info from API
                App.buildUserProfile(response.data);
            }
        } catch (e) {
            console.log(e);
            //TODO: show alert message
        }
    };

    App.log = function (level, funcName, logData) {
        $.post(App.config.loggerUrl, { level: level, funcName: funcName, data: logData });
    }

    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    $(document).on('click', '#login__btn', function(e) {
        e.preventDefault();
        var username = App.$loginForm.find('#email').val();
        var password = App.$loginForm.find('#password').val();

        App.userLogin(username, password);
    });

    $(document).on('click', '#signup_btn', function(e) {
        e.preventDefault();
        App.userSignup();
    });

    $(document).on('click', '#logout', function(e) {
        App.userLogout();
    });

    /*****************************************************************************
     *
     * Methods to update/refresh the UI
     *
     ****************************************************************************/

    // Toggles the visibility of the add new city dialog.
    // App.toggleAddDialog = function(visible) {
    //     if (visible) {
    //         App.addDialog.classList.add('dialog-container--visible');
    //     } else {
    //         App.addDialog.classList.remove('dialog-container--visible');
    //     }
    // };

    /*****************************************************************************
     *
     * Methods for dealing with the API (API Requests)
     *
     ****************************************************************************/

     App.userLogin = function (username, password) {
        var params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        params.append('grant_type', App.config.api.grant_type);
        params.append('client_id', App.config.api.client_id);
        params.append('client_secret', App.config.api.client_secret);
        params.append('scope', App.config.api.scope);
        params.append('application_key', App.config.headers['X-Application-Key']);

        axios({
            method: 'POST',
            url: App.config.api.endpoints.token,
            data: params,
        }).then(response => {
            // console.log(response.data);
            App.handleResponse(response.data, {action: 'user_login'});
            App.hideSpinner();
        }).catch (error => {
            // List errors on response...
            // console.log(error); console.log(error.response);

            if (error.response.status == 401) {
                App.alert('NOT_OK', error.response.data.message);
            }
            
            App.log('error', 'App.userSignup: ' + App.config.appName, JSON.stringify(error));

            App.hideSpinner();
        });
    };

    App.userSignup = function () {
        var params = {
            'email': App.$signupForm.find('#email').val(),
            'pin_code': App.$signupForm.find('#password').val(),
        };

        axios({
            method: 'POST',
            url: App.config.api.endpoints.createUser,
            data: params,
            headers: { 'X-Application-Key': App.config.headers['X-Application-Key']},
        }).then(response => {
            console.log(response.data);
            location.href = App.config.appBaseUrl + App.config.appLoginUrl;
            // App.userLogin(params);
            App.hideSpinner();
        }).catch (error => {
            // List errors on response...
            // console.log(error); console.log(error.response);
            
            if (error.response.status == 422) {
                if (error.response.data.email.length > 0) {
                    App.alert('NOT_OK', error.response.data.email[0]);
                }
            }

            App.log('error', 'App.userSignup: ' + App.config.appName, JSON.stringify(error));

            App.hideSpinner();
        });
    };

    App.getAccount = function () {
        App.client.request({ 
            url: App.config.api.endpoints.me, 
            method: 'GET',
            action: 'api_me',
            params: {},
        });
    };

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

    App.userLogout = function () {
        localStorage.removeItem('user_token');
        location.href = App.config.appBaseUrl;
    }

    App.buildUserProfile = function(context) {
        var source   = $("#tpl_login").html(); //console.log(source); return;
        var template = Handlebars.compile(source);

        $('#user__profile').html(template(context));
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
    }

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

})(jQuery);


// $( document ).ready(function(){
//     // console.log('Ready');
//     App.ready();
// });
