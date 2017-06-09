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

    if (window.Handlebars) {
        Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });
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
                location.href = App.config.appBaseUrl + '/home';
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

                //store the user profile in local storage
                localStorage.setObject('userProfile', response.data);
                // App.getTokenFromServer(response.data);
            } else if (ajaxOptions.action == 'add_pos_account') {
                App.alert('OK', 'Account successfully linked');
            } else if (ajaxOptions.action == 'api_get_transactions') {
                App.buildTransactionsList(response);
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
        var alertContent = '<div class="alert-content"><span>' + message + '</span></div>';

        if (typeof delayTime != 'undefined') delay = delayTime;

        if (type == 'NOT_OK') {
            App.$message.find('.message__error').html(alertContent).fadeIn().delay(delay).fadeOut();
        } else if (type == 'OK') {
            App.$message.find('.message__success').html(alertContent).fadeIn().delay(delay).fadeOut();
        }

        App.scrollTop();
    };

    //NO need
    // App.getTokenFromServer = function (userProfile) {
    //     var userToken = localStorage.getObject('user_token');

    //     if (!userToken) {
    //         //no access token, but have email token
    //         //get the token from the server
    //         $.get(App.config.appBaseUrl + '/api/getUserToken', {
    //             'user_id': userProfile.id
    //         }, function (data) {
    //             console.log('get token form the server');
    //             var token = JSON.parse(data.token);
    //             localStorage.setObject('user_token', token);
    //         });
    //     }
    // };

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
        var userProfile = App.getLocalUserProfile();
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

    App.addPosAccount = function (posAccount) {
        App.showSpinner();
        var userProfile = App.getLocalUserProfile();

        App.showSpinner();
        axios({
            url: App.config.kangarooUrl + '/site/addPosAccount',
            method: 'POST',
            data: {
                user_id: userProfile.id,
                pos_account: posAccount
            },
            headers: App.config.headers
        }).then(response => {
            App.handleResponse(response.data, {action: 'add_pos_account'});
        }).catch (error => {
            App.handleError(error, {action: 'add_pos_account'});
        });

        // api.client.request({
        //     url: App.config.api.endpoints.users + '/' + userProfile.id,
        //     method: 'PATCH',
        //     action: 'api_pos_accounts',
        //     params: {
        //         intent: "pos_accounts",
        //         pos_accounts: [pos_account]
        //     },
        // }, App.handleResponse, App.handleError);
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

    App.getTransactions = function() {
        App.showSpinner();
        var userProfile = App.getLocalUserProfile();
        api.client.request({
            url: App.config.api.endpoints.users + '/' + userProfile.id + '/transactions',
            method: 'GET',
            action: 'api_get_transactions',
        }, App.handleResponse, App.handleError);
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

    $('.js-add-pos-account__btn').on('click', function (event) {
        var userProfile = App.getLocalUserProfile();
        var userToken = App.getLocalAccessToken();
        
        var $button = $(this); // Button that triggered the modal
        var posId = $(this).data('posId'); // Extract info from data-* attributes
        var posName = $(this).data('posName'); // Extract info from data-* attributes
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var $modal = $('#addAccountsModal');

        $modal.find('.modal-title').text('Add your ' + posName + ' Account');
        $modal.find('[name=pos_id]').val(posId);
        $modal.find('[name=account_id]').val('');
        $modal.find('[name=postal_code]').val('');

        if (userToken) {
            App.checkEmailVerified();
        } else if(userProfile && userProfile.email_verified) {
            $modal.modal('show');
        } else {
            console.log('No Access Token or User Profile found or Email not verified');
        }
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
        var isTpr = $button.data('isTpr');
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var $modal = $(this);

        if (!isTpr) {
            event.stopPropagation();
            var bsModal = $(this).data('bs.modal');
            bsModal["_isShown"] = false;
            bsModal["_isTransitioning"] = false;
            $(this).data('bs.modal', bsModal);
            App.alert('NOT_OK', 'This is not a partner reward');
            return false;
        }

        // modal.find('.modal-title').text('New message to ' + recipient);
        $modal.find('#reward_title').html(rewardTitle);

        App.redeemItem = {
            id: rewardId,
            quantity: 1
        };
    });

    $('#menu_transactions_list').on('click', function(){
        $('#detailViewModal').modal('show');
        App.getTransactions();
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

        // var template = '<p class="lead">My Points Balance</p>\
        //                 <p class="display-4 mb-5">'+Number(context.balance.points).toLocaleString()+'</p>';

        // template += '<div class="row">';
         
        // var item = '';
        // for (var i = context.businesses.length - 1; i >= 0; i--) {
        //     var business = context.businesses[i];
        //     item = '<div class="col-12 col-md-4">\
        //                 <div class="card mb-3" style="border: none;">\
        //                     <img class="card-img-top img-fluid mx-auto" \
        //                         src="'+business.logo+'" \
        //                         alt="'+business.name+'" style="max-width: 200px;">\
        //                 </div>\
        //             </div>';
        //     template += item;
        // }

        // template += '</div>';

        $('#business__list').html(template);

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

    App.buildTransactionsList = function (response) {
        var list = '<table class="table table-striped">';
        var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        var $modal = $('#detailViewModal');

        for (var i = 0; i < response.data.length; i++) {
            var trx = response.data[i];
            var d = new Date(trx.created_at);
            var createdAt = months[d.getMonth()] +' ' + d.getDate() + ', ' +d.getHours()+':'+d.getMinutes();

            list += '<tr>\
                        <td>' + createdAt + '</td>\
                        <td>' +trx.name+ '</td>\
                        <td>' +trx.points+ '</td>\
                    </tr>';
        }

        list += '</table>';
        
        $modal.find('.modal-title').text('Transactions');
        $modal.find('.modal-body').html(list);
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
        } else if (currentUrl == '/rewards') {
            $('.navbar-top').find('#menu_rewards').addClass('active');
            var userProfile = App.getLocalUserProfile();
            //fill the page with the info from API
            App.buildUserProfile(userProfile);
            App.getRewards();
        } else if (currentUrl == App.isAuthenticated()) {
            //login page and user is authenticated
            location.href = App.config.appBaseUrl + '/home';
        } else if (currentUrl == '/site/verify') {
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