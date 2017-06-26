;(function ($, api, undefined) {
    'use strict';

    var App = {
        isLoading: true,
        spinner: document.querySelector('.loader'),
        // container: document.querySelector('.main'),
        $loginForm: $('form.login'),
        $signupForm: $('form.signup'),
        $message: $('#message__container'),
        redeemItem: {},
        config: config || {},
    };

    /*****************************************************************************
     *
     * Methods for dealing with the API (API Requests, handle response)
     *
     ****************************************************************************/

    App.handleResponse = function (response, ajaxOptions) {
        console.trace('action', ajaxOptions.action, 'data', response);
        try {
            if (ajaxOptions.action == 'user_login' && response.token_type == 'Bearer') {
                location.href = App.config.appBaseUrl + '/home';
            } else if (ajaxOptions.action == 'user_signup') {
                localStorage.setObject('userProfile', response.data);
                App.afterSignup(response.data);
                // location.href = KangarooApi.config.appBaseUrl + KangarooApi.config.appLoginUrl;
            }
        } catch (e) {
            console.log(e);
            //TODO: show alert message
        }
        App.hideSpinner();
    };

    App.handleError = function (error, ajaxOptions) {
        var userProfile = App.getLocalUserProfile();

        App.hideSpinner();
        if (error.response.status == 400) {
            App.alert('NOT_OK', error.response.data.error.description);
        } else if (error.response.status == 401) {
            App.alert('NOT_OK', error.response.data.message);
        } else if (error.response.status == 404 && 
            ajaxOptions.action == 'api_verify_credentials' && userProfile && userProfile.email_verified) {

            $('#verify_email_not_veified').hide();
            App.alert('OK', 'Email successfully verified');
            // App.alert('NOT_OK', error.response.data.error.description);
        } else if (error.response.status == 404) {
            App.alert('NOT_OK', error.response.data.error.description);
        } else if (error.response.status == 422) {
            if (error.response.data.email) {
                App.alert('NOT_OK', error.response.data.email[0]);
            } else if (error.response.data.phone) {
                App.alert('NOT_OK', error.response.data.phone[0]);
            } else if (error.response.data.pin_code) {
                App.alert('NOT_OK', error.response.data.pin_code[0]);
            } else if (error.response.data.email) {
                App.alert('NOT_OK', error.response.data.email[0]);
            } else if (error.response.data.phone) {
                App.alert('NOT_OK', error.response.data.phone[0]);
            } else if (error.response.data.token) {
                App.alert('NOT_OK', error.response.data.token[0]);
            }
        } else if (error.response.status >= 500) {
            App.alert('NOT_OK', error.response.data.error.description);
        }
    };

    App.afterSignup = function(data) {
        // console.log(data);
        App.showSpinner();

        //get access token for user
        api.login({
            username: App.$signupForm.find('#email').val(),
            password: App.$signupForm.find('#password').val(),
        }, function (token) {
            App.alert('OK', 'We have sent you a verification email. Click on the link to verify you account.');

            setTimeout(function () {
                location.href = KangarooApi.config.appBaseUrl + '/site/verify';
            }, 3000);
            //Store the toke on the server
            // $.post(App.config.appBaseUrl + '/api/setUserToken', {
            //     user_id: data.id,
            //     token: JSON.stringify(token),
            // }, function (data) {
            //     setTimeout(function () {
            //         location.href = KangarooApi.config.appBaseUrl + '/site/verify';
            //     }, 3000);
            // });
        }, App.handleError);
    };

    App.alert = function (type, message, delayTime) {
        var delay = 4000;

        if (typeof delayTime != 'undefined') delay = delayTime;

        if (type == 'NOT_OK') {
            App.$message.html('\
                <div class="alert alert-error alert-dismissible fade show" role="alert">\
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                    <div class="alert-container w-100">\
                        <div class="message__icon align-middle">\
                            <i class="fa fa-times-circle fa-2x fa-fw"></i>\
                        </div>\
                        <div class="message__content align-middle">'+message+'</div>\
                    </div>\
                </div>'
            );
            App.$message.find('.alert-error').alert();//.delay(delay).alert('close');
            // App.$message.find('.alert-error .message__content').html(message);
        } else if (type == 'OK') {
            App.$message.html('\
                <div class="alert alert-success alert-dismissible fade show" role="alert">\
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                    <div class="alert-container w-100">\
                        <div class="message__icon align-middle">\
                            <i class="fa fa-times-circle fa-2x fa-fw"></i>\
                        </div>\
                        <div class="message__content align-middle">'+message+'</div>\
                    </div>\
                </div>'
            );
            App.$message.find('.alert-error').alert();
        }

        setTimeout(function(){$('.alert').alert('close');}, delay);

        App.scrollTop();
    };

    App.getAccount = function () {
        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.account,
            method: 'GET',
            action: 'api_account',
            params: {},
        }, App.handleResponse, App.handleError);
    };

    App.getUserProfile = function () {
        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.user_profile,
            method: 'GET',
            action: 'api_user_profile',
            params: {},
        }, App.handleResponse, App.handleError);
    };

    App.verifyCredentials = function (token, email, phone) {
        console.log('verifyCredentials', token, email);

        if (email) {
            var data = {
                intent: 'verify_email',
                email: email,
                token: token,
            };
        } else {
            var data = {
                intent: 'verify_phone',
                email: phone,
                token: token,
            };
        }

        //Call directly API without authentication

        App.showSpinner();
        axios({
            url: App.config.api.baseUrl + '/verify',
            method: 'POST',
            data: data,
            headers: App.config.headers
        }).then(response => {
            App.handleResponse(response.data, {action: 'api_verify_credentials'});
        }).catch (error => {
            App.handleError(error, {action: 'api_verify_credentials'});
        });
    };

    App.getLocalAccessToken = function() {
        var token = localStorage.getObject('user_token');
        return token;
    };

    App.getLocalUserProfile = function() {
        return localStorage.getObject('userProfile');
    };

    App.checkEmailVerified = function () {
        var userProfile = App.getLocalUserProfile();
        var $modal = $('#addAccountsModal');

        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.users + '/' + userProfile.id,
            method: 'GET',
            action: 'api_check_verified',
        }, function(response) {
            App.hideSpinner();
            console.log('response.data.email_verified', response.data.email_verified);
            if(response.data.email_verified) {
                $('#verify_email_not_veified').hide();
                $modal.modal('show');
            } else {
                $('#verify_email_not_veified').show();
                App.alert('NOT_OK', 'Your email is not verified. Click on the verificatin link to verify your email.')
                return false;
            }
        }, App.handleError);
    };

    App.verifyEmailIfNotVerified = function () {
        console.log('verifyEmailIfNotVerified');

        //Get verification token and credetials to verify
        var emailToken = $('#app').find('[name=verify_token]').val();
        var emailToVerify = $('#app').find('[name=verify_email]').val();
        var phoneToVerify = $('#app').find('[name=verify_phone]').val();

        if (emailToken) {
            console.log('before verifyCredentials');
            App.verifyCredentials(emailToken, emailToVerify, phoneToVerify);
        } else {
            console.log('No Email Verification Token found');
        }
    };

    App.getUserId = function () {
        var userProfile = App.getLocalUserProfile();
        return userProfile.id;
    };

    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

    $(document).on('click', '#login__btn', function (e) {
        e.preventDefault();
        var username = App.$loginForm.find('#email').val();
        var password = App.$loginForm.find('#password').val();

        if (!email || !password) {
            App.alert('NOT_OK', 'Email and password is required');
            return;
        }

        App.showSpinner();

        api.login({
            username: username,
            password: password,
        }, App.handleResponse, App.handleError);
    });

    $(document).on('click', '#signup_btn', function (e) {
        e.preventDefault();

        var email = App.$signupForm.find('#email').val();
        var password = App.$signupForm.find('#password').val();

        if (!email || !password) {
            App.alert('NOT_OK', 'Email and password is required');
            return;
        }

        App.showSpinner();

        if ($.isNumeric(email)) {
            api.signup({
                'phone': email,
                'country_code': 'CA',
                'pin_code': password,
            }, App.handleResponse, App.handleError);
        } else {
            api.signup({
                'email': email,
                'pin_code': password,
            }, App.handleResponse, App.handleError);
        }
    });

    // $('.alert').on('close.bs.alert', function (event) {
    //     event.preventDefault();
    //     $(this).removeClass('show');
    // });


    /*****************************************************************************
     *
     * Methods for dealing with the UI and App logic
     *
     ****************************************************************************/


    App.hideSpinner = function () {
        App.spinner.setAttribute('hidden', true);
    };

    App.showSpinner = function () {
        App.spinner.removeAttribute('hidden');
    };

    App.scrollTop = function () {
        $("html, body").animate({
            scrollTop: "0px"
        });
    }

    App.isAuthenticated = function () {
        var userToken = localStorage.getObject('user_token');

        if (userToken) {
            return true;
        }

        return false;
    };

    App.init = function () {
        App.hideSpinner();
        this.redirectIfAuthenticated();
        this.handlePage();
    };

    App.redirectIfAuthenticated = function () {
        var redirectToHome = App.config.appBaseUrl + '/home';
        var redirectToRegister = App.config.appBaseUrl + '/site/register';
        var currentUrl = top.location.href;

        currentUrl = currentUrl.replace(/\/$/, ""); //remove the last / from url

        // if (App.isAuthenticated() && currentUrl != redirectTo) {
        //     location.href = redirectTo;
        // } else 
        if (!App.isAuthenticated() && !$.inArray(currentUrl, [redirectToHome, redirectToRegister])) {
            location.href = App.config.appBaseUrl;
        }
    };

    App.handlePage = function () {
        // var currentUrl = top.location.href;
        // currentUrl = currentUrl.replace(/\/$/, "");//remove the last / from url
        var currentUrl = $('body').data('pageUri');
        $('.navbar-top').find('.nav-item').removeClass('active');

        if (currentUrl == '/home') {
            $('.navbar-top').find('#menu_home').addClass('active');
            App.getAccount(); //home page
        } else if (currentUrl == App.isAuthenticated()) {
            //login page and user is authenticated
            location.href = App.config.appBaseUrl + '/home';
        } else if (currentUrl == '/site/verify') {
            console.log('entro aca');
            //login page and user is authenticated
            App.showSubAccountsForm({});
            App.verifyEmailIfNotVerified();
        }
    };

    /************************************************************************
     *
     * Code required to start the App
     *
     ************************************************************************/
    App.init();
})(jQuery, KangarooApi);

$(document).ready(function () {
    // console.log('Ready');
    // App.ready();
});