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
        App.hideSpinner();
        console.log('action', ajaxOptions.action, 'data', response);
        try {
            if (ajaxOptions.action == 'user_login' && response.token_type == 'Bearer') {
                location.href = App.config.appBaseUrl + App.config.appHomeUrl;
            } else if (ajaxOptions.action == 'user_signup') {
                location.href = KangarooApi.config.appBaseUrl + KangarooApi.config.appLoginUrl;
            } else if (ajaxOptions.action == 'api_me' && ajaxOptions.method == 'GET') {
                //fill the page with the info from API
                App.buildUserProfile(response.data);
                App.buildBusinessesList(response.data);
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
    };

    App.handleError = function(error) {
        App.hideSpinner();
        if (error.response.status == 400) {
            App.alert('NOT_OK', error.response.data.error.description);
        } else if (error.response.status == 401) {
            App.alert('NOT_OK', error.response.data.message);
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
            url: App.config.api.endpoints.me, 
            method: 'GET',
            action: 'api_me',
            params: {},
        }, App.handleResponse, App.handleError);
    };

    App.getRewards = function () {
        App.showSpinner();
        api.client.request({ 
            url: App.config.api.endpoints.rewards, 
            method: 'GET',
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

        var fullName = context.profile.first_name + ' ' + context.profile.last_name;
        
        $profile.find('#user-profile__name').html(fullName.trim());
        
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

        $('.navbar-top').find('.nav-item').removeClass('active');

        // console.log('currentUrl', currentUrl, 'App.config.appHomeUrl', App.config.appHomeUrl);
        if (currentUrl == App.config.appBaseUrl + App.config.appHomeUrl) {
            $('.navbar-top').find('#menu_home').addClass('active');
            App.getAccount(); //home page
        } else if (currentUrl == App.config.appBaseUrl + App.config.appRewardsUrl) {
            $('.navbar-top').find('#menu_rewards').addClass('active');
            App.getRewards();
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
