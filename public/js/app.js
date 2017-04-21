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

        //Do not include Authorization header for user_login
        if (options.action != 'user_login') {
            var token = localStorage.getObject('user_token');
            headers = App.config.headers;
            headers.Authorization = token.token_type +' '+ token.access_token;
        }

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
        App.userLogin();
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
    App.toggleAddDialog = function(visible) {
        if (visible) {
            App.addDialog.classList.add('dialog-container--visible');
        } else {
            App.addDialog.classList.remove('dialog-container--visible');
        }
    };

    /*****************************************************************************
     *
     * Methods for dealing with the model
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

    App.userLogin = function () {
        var params = new URLSearchParams();
        params.append('username', App.$loginForm.find('#email').val());
        params.append('password', App.$loginForm.find('#password').val());
        params.append('grant_type', App.config.api.grant_type);
        params.append('client_id', App.config.api.client_id);
        params.append('client_secret', App.config.api.client_secret);
        params.append('scope', App.config.api.scope);

        App.client.request({ 
            url: App.config.api.baseUrl + App.config.api.endpoints.tokenUrl, 
            method: 'POST',
            action: 'user_login',
            params: params,
            headers: {}
        });
    };

    App.getAccount = function () {
        App.client.request({ 
            url: App.config.api.baseUrl + App.config.api.endpoints.me, 
            method: 'GET',
            action: 'api_me',
            params: {},
        });
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
        var delay = 3000;
        var alertContent = '<div class="alert-content"><span>' + message + '</span></div>';

        if (typeof delayTime != 'undefined') delay = delayTime;

        if (type == 'NOT_OK')
            $('.errormessage').html(alertContent).fadeIn();
        else if (type == 'OK')
            $('.successmessage').html(alertContent).fadeIn();

        App.scrollTop();

        window.setTimeout(function() {
            $('.errormessage').fadeOut();
            $('.successmessage').fadeOut();
        }, delay);
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

    App.init = function(source) {
        // console.log('App init:', source);
        App.hideSpinner();

        this.redirectIfAuthenticated();

        this.handlePage();
    };

    App.redirectIfAuthenticated = function() {
        var redirectTo =  App.config.appBaseUrl + App.config.appHomeUrl;
        var currentUrl = top.location.href;

        currentUrl = currentUrl.replace(/\/$/, "");

        // if (App.isAuthenticated() && currentUrl != redirectTo) {
        //     location.href = redirectTo;
        // } else 
        if(!App.isAuthenticated() && currentUrl != App.config.appBaseUrl) {
            location.href = App.config.appBaseUrl;
        }
    };

    App.handlePage = function () {
        var redirectTo =  App.config.appBaseUrl + App.config.appHomeUrl;
        var currentUrl = top.location.href;

        currentUrl = currentUrl.replace(/\/$/, "");

        // console.log('currentUrl', currentUrl, 'App.config.appHomeUrl', App.config.appHomeUrl);
        if (currentUrl == App.config.appBaseUrl + App.config.appHomeUrl) {
            console.log('home page');
            App.getAccount();
        } else if (currentUrl == App.config.appBaseUrl && App.isAuthenticated()) {
            location.href = App.config.appBaseUrl + App.config.appHomeUrl;
        }
    };

    /************************************************************************
     *
     * Code required to start the App
     *
     ************************************************************************/

    // TODO add startup code here
    App.init('load');

})(jQuery);


// $( document ).ready(function(){
//     // console.log('Ready');
//     App.ready();
// });
