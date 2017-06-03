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

    if (window.HandlebarsIntl) {
        HandlebarsIntl.registerWith(Handlebars);
    }

    /*****************************************************************************
     *
     * Methods for dealing with the API (API Requests, handle response)
     *
     ****************************************************************************/

    App.handleResponse = function (response, ajaxOptions) {
        console.trace('action', ajaxOptions.action, 'data', response);
        try {
            if (ajaxOptions.action == 'user_login' && response.token_type == 'Bearer') {
                location.href = App.config.appBaseUrl + App.config.appHomeUrl;
            } else if (ajaxOptions.action == 'user_signup') {
                localStorage.setObject('userProfile', response.data);
                App.afterSignup(response.data);
                // location.href = KangarooApi.config.appBaseUrl + KangarooApi.config.appLoginUrl;
            } else if (ajaxOptions.action == 'api_account' && ajaxOptions.method == 'GET') {
                localStorage.setObject('userProfile', response.data.profile);
                //fill the page with the info from API
                App.buildUserProfile(response.data.profile);
                App.buildBusinessesList(response.data);
            } else if (ajaxOptions.action == 'api_user_profile' && ajaxOptions.method == 'GET') {
                localStorage.setObject('userProfile', response.data.profile);
            } else if (ajaxOptions.action == 'api_rewards' && ajaxOptions.method == 'GET') {
                //fill the page with the info from API
                App.buildRewardsList(response.data);
            } else if (ajaxOptions.action == 'api_redeem_tpr' && ajaxOptions.method == 'POST') {
                App.alert('OK', 'You have successfully redeemed a partner reward');
            } else if (ajaxOptions.action == 'api_verify_credentials') {
                $('#verify_email_not_veified').hide();
                App.alert('OK', 'Email successfully verified');
            } else if (ajaxOptions.action == 'api_pos_accounts') {
                App.alert('OK', 'Account successfully linked');
            }
        } catch (e) {
            console.log(e);
            //TODO: show alert message
        }
        App.hideSpinner();
    };

    App.handleError = function (error) {
        App.hideSpinner();
        if (error.response.status == 400) {
            App.alert('NOT_OK', error.response.data.error.description);
        } else if (error.response.status == 401) {
            App.alert('NOT_OK', error.response.data.message);
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
        }
    };

    App.afterSignup = function(data) {
        console.log(data);
        App.showSpinner();

        //get access token for user
        api.login({
            username: App.$signupForm.find('#email').val(),
            password: App.$signupForm.find('#password').val(),
        }, function (token) {
            App.alert('OK', 'We have sent you a verification email. Click on the link to verify you account.');

            //Store the toke on the server
            $.post(App.config.appBaseUrl + '/api/setUserToken', {
                user_id: data.id,
                token: JSON.stringify(token),
            }, function (data) {
                setTimeout(function () {
                    location.href = KangarooApi.config.appBaseUrl + '/site/verify';
                }, 3000);
            });
        }, App.handleError);
    };

    App.alert = function (type, message, delayTime) {
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

    App.getRewards = function () {
        var userProfile = localStorage.getObject('userProfile');
        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.rewards.replace('{id}', userProfile.id),
            method: 'GET',
            action: 'api_rewards',
            params: {},
        }, App.handleResponse, App.handleError);
    };

    App.verifyCredentials = function (token, email, phone) {
        console.log('verifyCredentials', token, email);

        var userProfile = localStorage.getObject('userProfile');
        var params = {
            token: token
        };

        if (email) {
            params.intent = 'verify_email';
            params.email = email;
        } else {
            params.intent = 'verify_phone';
            params.phone = phone;
        }

        var headers = {};
        headers = KangarooApi.config.headers;
        //append access token to the headers
        var token = App.getAccessToken();
        headers.Authorization = token.token_type +' '+ token.access_token;

        App.showSpinner();
        axios({
            url: App.config.api.endpoints.users + '/' + userProfile.id,
            method: 'PATCH',
            data: params,
            headers: headers
        }).then(response => {
            App.handleResponse(response.data, {action: 'api_verify_credentials'});
        }).catch (error => {
            App.handleError(error);
        });

        // api.client.request({
        //     url: App.config.api.endpoints.users + '/' + userProfile.id,
        //     method: 'PATCH',
        //     action: 'api_verify_credentials',
        //     params: params,
        // }, App.handleResponse, App.handleError);
    };

    App.addPosAccount = function (pos_account) {
        App.showSpinner();
        var userProfile = localStorage.getObject('userProfile');
        api.client.request({
            url: App.config.api.endpoints.users + '/' + userProfile.id,
            method: 'PATCH',
            action: 'api_pos_accounts',
            params: {
                intent: "pos_accounts",
                pos_accounts: [pos_account]
            },
        }, App.handleResponse, App.handleError);
    };

    App.getAccessToken = function() {
        var token = localStorage.getObject('user_token');
        return token;
    };

    App.checkEmailVerified = function (event) {
        

        // App.showSpinner();
        // api.client.request({
        //     url: App.config.api.endpoints.users + '/' + id,
        //     method: 'GET',
        //     action: 'api_check_email_status',
        //     params: {},
        // }, App.handleResponse, App.handleError);
    };

    App.verifyEmailIfNotVerified = function () {
        console.log('verifyEmailIfNotVerified');
        var userToken = localStorage.getObject('user_token');
        var userProfile = localStorage.getObject('userProfile');

        //Get
        var emailToken = $('#app').find('[name=verify_token]').val();
        var userId = $('#app').find('[name=verify_user_id]').val();
        var emailToVerify = $('#app').find('[name=verify_email]').val();

        if (userToken && userProfile) {
            // console.log('before checkEmailVerified with token from localStorage');
        } else if (userId) {
            //no access token, but have email token
            //get the token from the server
            $.get(App.config.appBaseUrl + '/api/getUserToken', {
                'user_id': userId
            }, function (data) {
                console.log('get token form the server');
                localStorage.setObject('user_token', data.token);
                userToken = data.token;
            });
        }

        if (emailToken && userToken) {
            console.log('before verifyCredentials');
            App.verifyCredentials(
                emailToken,
                emailToVerify,
            );
        }
    }

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

        // $.post(App.config.appBaseUrl + '/api/login', {
        //     username: username, 
        //     password: password,
        // }, function(data) {
        //     // localStorage.setObject('user_token', data);
        //     console.log(data);
        // });

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

    $(document).on('click', '#logout', function (e) {
        api.logout();
    });

    $(document).on('click', '.js-redeem__confirm-btn', function (e) {
        $('#rewardsRedemptionConfirmModal').modal('hide');
        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.transactions,
            method: 'POST',
            action: 'api_redeem_tpr',
            params: {
                'intent': 'redeem',
                'catalog_items': [App.redeemItem]
            },
        }, App.handleResponse, App.handleError);
    });

    $('#addAccountsModal').on('show.bs.modal', function (event) {
        var userProfile = localStorage.getObject('userProfile');
        var token = App.getAccessToken();
        var headers = {};
        headers = KangarooApi.config.headers;
        //append access token to the headers
        headers.Authorization = token.token_type +' '+ token.access_token;

        var $button = $(event.relatedTarget); // Button that triggered the modal
        var posId = $button.data('posId'); // Extract info from data-* attributes
        var posName = $button.data('posName'); // Extract info from data-* attributes
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var $modal = $(this);

        var userIdUrl = $('#app').find('[name=verify_user_id]').val();
        var userId = userIdUrl ? userIdUrl : userProfile.id;
        
        $modal.find('.modal-title').text('Add your ' + posName + ' Account');
        $modal.find('[name=pos_id]').val(posId);
        $modal.find('[name=account_id]').val('');
        $modal.find('[name=postal_code]').val('');

        App.showSpinner();
        axios({
            url: App.config.api.endpoints.users + '/' + userId,
            method: 'GET',
            headers: headers
        }).then(response => {
            App.hideSpinner();
            console.log('response.data.email_verified', response.data.data.email_verified);
            if(response.data.data.email_verified) {
                $('#verify_email_not_veified').hide();
            } else {
                $('#verify_email_not_veified').show();
                event.stopPropagation();
                App.alert('NOT_OK', 'Your email is not verified. Click on the verificatin link to verify your email.')
                return false;
            }
        }).catch (error => {
            event.stopPropagation();
            App.handleError(error);
            return false;
        });
        // App.checkEmailVerified(event);
    })

    $(document).on('click', '.js-add-pos-account__confirm-btn', function (event) {
        $('#addAccountsModal').modal('hide');

        var account = {};
        //get form data as object
        $('#add_pos_account__form').serializeArray().map(function (x) {
            account[x.name] = x.value;
        });

        if (!account.account_id || !account.postal_code) {
            App.alert('NOT_OK', 'Account ID and Postal Code is required');
            return;
        }

        App.addPosAccount(account);
    });

    $('#rewardsRedemptionConfirmModal').on('show.bs.modal', function (event) {
        var $button = $(event.relatedTarget); // Button that triggered the modal
        var rewardId = $button.data('rewardId'); // Extract info from data-* attributes
        var rewardTitle = $button.data('rewardTitle'); // Extract info from data-* attributes
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var $modal = $(this);
        // modal.find('.modal-title').text('New message to ' + recipient);
        $modal.find('#reward_title').html(rewardTitle);

        App.redeemItem = {
            id: rewardId,
            quantity: 1
        };
    });

    /*****************************************************************************
     *
     * Methods for dealing with the UI and App logic
     *
     ****************************************************************************/

    /*
     * Gets a template
     */
    App.getTemplate = function (url) {
        $.get(url, function (template) {
            $('#target').html(template);
        });
    };

    App.hideSpinner = function () {
        App.spinner.setAttribute('hidden', true);
    };

    App.showSpinner = function () {
        App.spinner.removeAttribute('hidden');
    };

    App.buildUserProfile = function (profile) {
        // console.log(context); return;
        var $profile = $('#user-profile');

        if (profile.first_name && profile.last_name) {
            var fullName = profile.first_name + ' ' + profile.last_name;
            $profile.find('#user-profile__name').html(fullName.trim());
        }

        if (profile.email) {
            $profile.find('#user-profile__email').html(profile.email);
        } else {
            $profile.find('.js-user-profile__email-item').hide();
        }

        if (profile.phone) {
            $profile.find('#user-profile__phone').html(profile.phone);
        } else {
            $profile.find('.js-user-profile__phone-item').hide();
        }

        // var source   = $("#tpl_login").html(); //console.log(source); return;
        // var template = Handlebars.compile(source);

        // $('#user__profile').html(template(context));
    };

    App.buildBusinessesList = function (context) {

        var intlData = {
            locales: 'en-US'
        }

        // console.log(context); return;
        var source = $("#tpl_businesses").html(); //console.log(source); return;
        var template = Handlebars.compile(source);

        $('#business__list').html(template(context, {
            data: {
                intl: intlData
            }
        }));
    };

    App.buildRewardsList = function (context) {
        // console.log(context); return;
        var source = $("#tpl_rewards").html(); //console.log(source); return;
        var template = Handlebars.compile(source);

        $('#rewards__list').html(template(context));
    };

    App.showSubAccountsForm = function (context) {
        $('#profile_subaccounts_form').show();

        // console.log(context); return;
        // try{
        //     var source   = $("#tpl_subaccounts_form").html(); //console.log(source); return;
        //     var template = Handlebars.compile(source);

        //     $('#profile_subaccounts_form').html(template(context));
        // } catch (error) {
        //     console.log(error);
        // }
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
        var redirectToHome = App.config.appBaseUrl + App.config.appHomeUrl;
        var redirectToRegister = App.config.appBaseUrl + App.config.appRegisterUrl;
        var currentUrl = top.location.href;

        currentUrl = currentUrl.replace(/\/$/, ""); //remove the last / from url

        console.log('currentUrl', currentUrl, 'App.config.appHomeUrl', redirectToHome);

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

        // console.log('currentUrl', currentUrl, 'App.config.appHomeUrl', App.config.appHomeUrl);
        if (currentUrl == App.config.appHomeUrl) {
            $('.navbar-top').find('#menu_home').addClass('active');
            App.getAccount(); //home page
        } else if (currentUrl == App.config.appRewardsUrl) {
            $('.navbar-top').find('#menu_rewards').addClass('active');
            var userProfile = localStorage.getObject('userProfile');
            //fill the page with the info from API
            App.buildUserProfile(userProfile);
            App.getRewards();
        } else if (currentUrl == App.isAuthenticated()) {
            //login page and user is authenticated
            location.href = App.config.appBaseUrl + App.config.appHomeUrl;
        } else if (currentUrl == App.config.appVerifyUrl) {
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