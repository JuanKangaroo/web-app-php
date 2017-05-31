;(function($, api, undefined) {
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

    App.handleResponse = function(response, ajaxOptions) {
        console.log('action', ajaxOptions.action, 'data', response);
        try {
            if (ajaxOptions.action == 'user_login' && response.token_type == 'Bearer') {
                location.href = App.config.appBaseUrl + App.config.appHomeUrl;
            } else if (ajaxOptions.action == 'user_signup') {
                localStorage.setObject('userProfile',response.data);
                api.login({
                    username: App.$signupForm.find('#email').val(), 
                    password: App.$signupForm.find('#password').val(),
                }, App.handleResponse, App.handleError);
                // location.href = KangarooApi.config.appBaseUrl + KangarooApi.config.appLoginUrl;
            } else if (ajaxOptions.action == 'api_account' && ajaxOptions.method == 'GET') {
                localStorage.setObject('userProfile',response.data.profile);
                //fill the page with the info from API
                App.buildUserProfile(response.data);
                App.buildBusinessesList(response.data);
            }  else if (ajaxOptions.action == 'api_user_profile' && ajaxOptions.method == 'GET') {
                localStorage.setObject('userProfile',response.data.profile);
            } else if (ajaxOptions.action == 'api_rewards' && ajaxOptions.method == 'GET') {
                //fill the page with the info from API
                App.buildRewardsList(response.data);
            } else if (ajaxOptions.action == 'api_redeem_tpr' && ajaxOptions.method == 'POST') {
                App.alert('OK', 'You have successfully redeemed a partner reward');
            }
        } catch (e) {
            console.log(e);
            //TODO: show alert message
        }
        App.hideSpinner();
    };

    App.handleError = function(error) {
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
            }
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
        var userProfile = localStorage.getObject('userProfile');
        var params = {token: token};

        if (email) {
            params.intent = 'verify_email';
            params.email = email;
            var successMessage = 'Email successfully verified.';
        } else {
            params.intent = 'verify_phone';
            params.phone = phone;
            var successMessage = 'Phone number successfully verified.';
        }

        App.showSpinner();
        api.client.request({ 
            url: App.config.api.endpoints.users + '/'+ userProfile.id,
            method: 'PATCH',
            action: 'api_verify_credentials',
            params: params,
        }, function success(response, ajaxOptions) {
            App.hideSpinner();

            // $('.alert-success').show().find('#message').html(successMessage);
            // setTimeout(function(){$('.alert-success').hide();}, 3000);

            App.getSubAccountsForm({});
        }, function fail(error) {
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
                } else if (error.response.data.token) {
                    App.alert('NOT_OK', error.response.data.token[0]);
                }
            }
        });
    };

    App.addSubAccount = function () {
        App.showSpinner();
        api.client.request({ 
            url: App.config.api.endpoints.users, 
            method: 'PATCH',
            action: 'api_rewards',
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

        var email = App.$signupForm.find('#email').val();
        if ($.isNumeric(email)) {
            api.signup({
                'phone': email,
                'country_code': 'CA',
                'pin_code': App.$signupForm.find('#password').val(),
            }, App.handleResponse, App.handleError);
        } else {
            api.signup({
                'email': email,
                'pin_code': App.$signupForm.find('#password').val(),
            }, App.handleResponse, App.handleError);
        }
    });

    $(document).on('click', '#logout', function(e) {
        api.logout();
    });

    $(document).on('click', '.js-redeem__confirm-btn', function(e) {
        $('#rewardsRedemptionConfirmModal').modal('hide');
        App.showSpinner();
        api.client.request({ 
            url: App.config.api.endpoints.transactions, 
            method: 'POST',
            action: 'api_redeem_tpr',
            params: {'intent': 'redeem', 'catalog_items': [App.redeemItem]},
        }, App.handleResponse, App.handleError);
    });

    $('#rewardsRedemptionConfirmModal').on('show.bs.modal', function (event) {
        var $button = $(event.relatedTarget); // Button that triggered the modal
        var rewardId = $button.data('rewardId'); // Extract info from data-* attributes
        var rewardTitle = $button.data('rewardTitle'); // Extract info from data-* attributes
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var $modal = $(this);
        // modal.find('.modal-title').text('New message to ' + recipient);
        $modal.find('#reward_title').html(rewardTitle);

        App.redeemItem = {id: rewardId, quantity: 1};
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
        var $profile = $('#user-profile');
        
        if (context.profile.first_name && context.profile.last_name) {
            var fullName = context.profile.first_name + ' ' + context.profile.last_name;
            $profile.find('#user-profile__name').html(fullName.trim());
        }
        
        if (context.profile.email) {
            $profile.find('#user-profile__email').html(context.profile.email);
        } else {
            $profile.find('.js-user-profile__email-item').hide();
        }

        if (context.profile.phone) {
            $profile.find('#user-profile__phone').html(context.profile.phone);
        } else {
            $profile.find('.js-user-profile__phone-item').hide();
        }

        // var source   = $("#tpl_login").html(); //console.log(source); return;
        // var template = Handlebars.compile(source);

        // $('#user__profile').html(template(context));
    };

    App.buildBusinessesList = function(context) {

        var intlData = {
            locales: 'en-US'
        }

        // console.log(context); return;
        var source   = $("#tpl_businesses").html(); //console.log(source); return;
        var template = Handlebars.compile(source);

        $('#business__list').html(template(context, {
            data: {intl: intlData}
        }));
    };

    App.buildRewardsList = function(context) {
        // console.log(context); return;
        var source   = $("#tpl_rewards").html(); //console.log(source); return;
        var template = Handlebars.compile(source);

        $('#rewards__list').html(template(context));
    };

    App.getSubAccountsForm = function(context) {
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
            App.getRewards();
        } else if (currentUrl == App.isAuthenticated()) {
            //login page and user is authenticated
            location.href = App.config.appBaseUrl + App.config.appHomeUrl;
        } else if (currentUrl == App.config.appVerifyUrl) {
            //login page and user is authenticated
            
            App.getSubAccountsForm({});

            // App.verifyCredentials(
            //     $('#app').find('[name=verify_token]').val(),
            //     $('#app').find('[name=verify_email]').val(),
            // );
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
