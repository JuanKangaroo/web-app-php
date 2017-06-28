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

        Handlebars.registerHelper("offerLabel", function(offer) {
            var offerType = offer.type;
            var r = {val1:'', val2:''};

            if (offerType == 'points_multiplier') {
                r.val1 = offer.multip_factor + 'x';
                r.val2 = 'THE POINTS';
            } else if (offerType == 'free_product') {
                r.val1 = 'FREE';
            } else if (offerType == 'bonus_points') {
                r.val1 = offer.points;
                r.val2 = 'Points';
            } else if (offerType == 'visits_multiplier') {
                r.val1 = offer.multip_factor + 'x';
                r.val2 = 'The Punches';
            } else if (offerType == 'discount_percentage') {
                r.val1 = offer.discount_value + '%';
                r.val2 = 'Off';
            } else if (offerType == 'discount_amount') {
                r.val1 = '$' + offer.discount_value;
                r.val2 = 'Off';
            } else if (offerType == 'visits_multiplier') {
                if (offer.real_value == offer.discount_value) {
                    r.val1 = '$' + offer.real_value;
                } else {
                    r.val1 = '$' + offer.real_value;
                    r.val2 = '$' + offer.discount_value;
                }
            } else if (offerType == 'redeem_free_product') {
                r.val1 = offer.points;
                r.val2 = 'Points';
            } else if (offerType == 'redeem_discount_amount') {
                r.val1 = '$' + offer.discount_value;
            } else if (offerType == 'redeem_discount_percentage') {
                r.val1 = offer.discount_value + '%';
            }

            var html = '<div class="offer_triangle__content_text1">' + r.val1 + '</div>';
            html += '<div class="offer_triangle__content_text2">' + r.val2 + '</div>';
            return new Handlebars.SafeString(html);
        });
    }

    var datePickerIcons = {
        time: 'fa fa-clock-o',
        date: 'fa fa-calendar',
        up: 'fa fa-chevron-up',
        down: 'fa fa-chevron-down',
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'glyphicon glyphicon-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-times'
    };
    /*****************************************************************************
     *
     * Methods for dealing with the API (API Requests, handle response)
     *
     ****************************************************************************/

    App.handleResponse = function (response, ajaxOptions) {
        console.trace('action', ajaxOptions.action, 'data', response);
        try {
            if (ajaxOptions.action == 'api_account' && ajaxOptions.method == 'GET') {
                App.setLocalUserProfile(response.data.profile);
                App.setLocalUserEmails(response.data.user_emails);
                App.setLocalUserPhoneNumbers(response.data.user_phone_numbers);
                
                //fill the page with the info from API
                App.buildUserProfileDrawer();
                App.buildBusinessesList(response.data);
            } else if (ajaxOptions.action == 'api_user_profile' && ajaxOptions.method == 'GET') {
                //localStorage.setObject('userProfile', response.data.profile);
                App.setLocalUserProfile(response.data.profile);
                App.setLocalUserEmails(response.data.user_emails);
                App.setLocalUserPhoneNumbers(response.data.user_phone_numbers);
            }  else if (ajaxOptions.action == 'api_update_profile') {
                localStorage.setObject('userProfile', response.data);
                //App.setLocalUserProfile(response.data.profile);
                //App.setLocalUserEmails(response.data.user_emails);
                //App.setLocalUserPhoneNumbers(response.data.user_phone_numbers);
                $('#detailViewModal').modal('hide');
                App.alert('OK', 'Profile successfully saved.');
            } else if (ajaxOptions.action == 'api_rewards' && ajaxOptions.method == 'GET') {
                //fill the page with the info from API
                App.buildRewardsList(response.data);
            } else if (ajaxOptions.action == 'api_coupons' && ajaxOptions.method == 'GET') {
                App.buildCouponsList(response.data);
            } else if (ajaxOptions.action == 'api_redeem_tpr' && ajaxOptions.method == 'POST') {
                App.alert('OK', 'You have successfully redeemed a partner reward');
            } else if (ajaxOptions.action == 'api_verify_credentials') {
                $('#verify_email_not_verified').hide();
                App.alert('OK', 'Email successfully verified');
                //store the user profile in local storage
                localStorage.setObject('userProfile', response.data);
                // App.getTokenFromServer(response.data);
            } else if (ajaxOptions.action == 'add_pos_account') {
                App.alert('OK', 'Account successfully linked');
            } else if (ajaxOptions.action == 'api_get_transactions') {
                App.buildTransactionsList(response);
            } else if (ajaxOptions.action == 'api_coupon_detail') {
                App.buildCouponDetail(response);
            } else if (ajaxOptions.action == 'api_business_detail') {
                App.buildBusinessDetail(response.data);
            } else if (ajaxOptions.action == 'api_update_pin') {
                App.alert('OK', 'Pin Code successfully saved');
                $('#detailViewModal').modal('hide');
            } else if (ajaxOptions.action == 'api_add_change_email') {
                App.alert('OK', 'Email successfully saved');
                $('#detailViewModal').modal('hide');
                App.setLocalUserEmails(response.data.user_emails);
                App.setLocalUserPhoneNumbers(response.data.user_phone_numbers);
                delete response.data["user_emails"];
                delete response.data["user_phone_numbers"];
                App.setLocalUserProfile(response.data);
                App.buildUserProfileDrawer();
            } else if (ajaxOptions.action == 'api_add_change_phone') {
                App.alert('OK', 'Phone successfully saved');
                $('#detailViewModal').modal('hide');
                App.setLocalUserEmails(response.data.user_emails);
                App.setLocalUserPhoneNumbers(response.data.user_phone_numbers);
                delete response.data["user_emails"];
                delete response.data["user_phone_numbers"];
                App.setLocalUserProfile(response.data);
                App.buildUserProfileDrawer();
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
                phone: phone,
                token: token,
            };
        }

        //Call directly API without authentication
        App.showSpinner();
        axios({
            url: App.config.api.baseUrl + '/rpc/verify',
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

    App.setLocalUserProfile = function(params) {
        localStorage.setObject('userProfile', params);
    };

    App.setLocalUserEmails = function(params) {
        if (params.length == 0) localStorage.setObject('userEmails', null);
        else localStorage.setObject('userEmails', params[0]);
    };

    App.setLocalUserPhoneNumbers = function(params) {
        if (params.length == 0) 
            localStorage.setObject('userPhoneNumbers', null);
        else {
            console.log(params[0]);
            localStorage.setObject('userPhoneNumbers', params[0]);
        }
    };

    App.getLocalUserProfile = function() {
        return localStorage.getObject('userProfile');
    };

    App.getLocalUserEmails = function() {
        return localStorage.getObject('userEmails');
    };

    App.getLocalUserPhoneNumbers = function() {
        return localStorage.getObject('userPhoneNumbers');
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

    App.showUserProfile = function() {
        var $modal = $('#detailViewModal');

        $modal.find('.modal-body').empty();
        $modal.find('.modal-title').text('Profile');
        $modal.modal('show');

        $('body').removeClass('pushy-open-left');

        App.showSpinner();
        
        api.client.request({
            url: App.config.api.endpoints.users + '/' + App.getUserId(),
            method: 'GET',
            action: 'api_show_user_profile',
        }, App.buildUserProfileEdit, App.handleError);
    };

    App.changePin = function() {
        var $modal = $('#detailViewModal');
        var source = $("#tpl_change_pin").html();
        $modal.find('.modal-body').html(source);
        $modal.find('.modal-title').text('Change PIN Code');
        $modal.modal('show');
        $('body').removeClass('pushy-open-left');
    };

    App.addChangeEmail = function(params) {
        var $modal = $('#detailViewModal');
        var source = $("#tpl_add_change_email").html();
        $modal.find('.modal-body').html(source);
        $modal.find('.modal-title').text(params.emailValue);
        $modal.modal('show');
        $('body').removeClass('pushy-open-left');
    };

    App.addChangePhone = function(params) {
        var paramsPhone = {country_code: App.config.country_code};
        var $modal = $('#detailViewModal');
        var source = $("#tpl_add_change_phone").html();
        var template = Handlebars.compile(source);
        $modal.find('.modal-body').html(template(paramsPhone));
        //$modal.find('.modal-body').html(source);
        $modal.find('.modal-title').text(params.phoneValue);
        $modal.modal('show');
        $('body').removeClass('pushy-open-left');
    };

    App.getUserId = function () {
        var userProfile = App.getLocalUserProfile();
        return userProfile.id;
    };

    App.getCoupons = function () {
        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.coupons,
            method: 'GET',
            action: 'api_coupons',
            params: {},
        }, App.handleResponse, App.handleError);
    };

    App.getBusinessDetail = function(id) {
        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.business_detail.replace('{businessid}', id),
            method: 'GET',
            action: 'api_business_detail',
            params: {},
        }, App.handleResponse, App.handleError);
    }

    /*****************************************************************************
     *
     * Event listeners for UI elements
     *
     ****************************************************************************/

 
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

    $('#menu_transactions_list').on('click', function(){
        var $modal = $('#detailViewModal');
        $modal.find('.modal-body').empty();
        $modal.find('.modal-title').empty();
        $modal.modal('show');
        App.getTransactions();
    });

    $('#menu_contact_us').on('click', function(){
        var $modal = $('#detailViewModal');

        $modal.find('.modal-body').empty();
        $modal.find('.modal-title').empty();
        $modal.modal('show');

        App.showSpinner();
        $.get(App.config.appBaseUrl + '/site/ajaxContact', function (data) {
            $modal.find('.modal-title').text('Contact Us');
            $modal.find('.modal-body').html(data);
            App.hideSpinner();
        });
    });

    $('.js-drawer__showUserProfile').on('click', function(){
        App.showUserProfile();
    });

    $(document).on('click', '#userProfileCancel', function(event){
        event.preventDefault();
        $('#detailViewModal').modal('hide');
    });

    $(document).on('click', '#userProfileSave', function(event){
        event.preventDefault();
        App.saveUserProfile();
    });

    $('.js-drawer__changePinItem').on('click', function(){
        App.changePin();
    });

    $(document).on('click', '#changePinCancel', function(event){
        event.preventDefault();
        $('#detailViewModal').modal('hide');
    });

    $(document).on('click', '#changePinSave', function(event){
        event.preventDefault();
        App.saveChangePin();
    });

    $('.js-drawer__userEmailItem').on('click', function(event){
        var params = {statusCode: $(this).data('statusCode'), emailValue: $(this).data('emailValue')};
        App.addChangeEmail(params);
    });

    $('.js-drawer__userPhoneItem').on('click', function(event){
        var params = {statusCode: $(this).data('statusCode'), phoneValue: $(this).data('phoneValue')};
        App.addChangePhone(params);
    });

    $(document).on('click', '#addChangeEmailCancel', function(event){
        event.preventDefault();
        $('#detailViewModal').modal('hide');
    });

    $(document).on('click', '#addChangeEmailSave', function(event){
        event.preventDefault();
        App.saveAddChangeEmail();
    });

    $(document).on('click', '#addChangePhoneCancel', function(event){
        event.preventDefault();
        $('#detailViewModal').modal('hide');
    });

    $(document).on('click', '#addChangePhoneSave', function(event){
        event.preventDefault();
        App.saveAddChangePhone();
    });

    $(document).on('click', '.js-coupon-detail', function (e) {
        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.coupon_detail.replace('{offerid}', $(this).data('couponId')),
            method: 'GET',
            action: 'api_coupon_detail',
            params: {},
        }, App.handleResponse, App.handleError);
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

    App.buildUserProfileDrawer = function () {
        // console.log(context); return;
        var profile = App.getLocalUserProfile();
        var userEmail = App.getLocalUserEmails();
        var userPhoneNumbers = App.getLocalUserPhoneNumbers();

        var $profile = $('#drawer');

        if (profile.first_name && profile.last_name) {
            var fullName = profile.first_name + ' ' + profile.last_name;
            $profile.find('#drawerUserName').html(fullName.trim());
        }

        if (userEmail) {
            if (userEmail.status_code == 33) {
                $profile.find('#drawerUserEmail').html(userEmail.email);
                $profile.find('.js-drawer__userEmailItem').attr('data-email-value', userEmail.email);
            } else {
                $profile.find('#drawerUserEmail').html('Pending - ' + userEmail.email);
                $profile.find('.js-drawer__userEmailItem').attr('data-email-value', 'Pending - ' + userEmail.email);
            }
            $profile.find('.js-drawer__userEmailItem').attr('data-status-code', userEmail.status_code);
        } else {
            $profile.find('#drawerUserEmail').html('Add your Email');
            $profile.find('.js-drawer__userEmailItem').attr('data-status-code', 0);
            $profile.find('.js-drawer__userEmailItem').attr('data-email-value', 'Add your Email');
        }

        if (userPhoneNumbers) {
            if (userPhoneNumbers.status_code == 31) {
                $profile.find('#drawerUserPhone').html(userPhoneNumbers.mobile);
                $profile.find('.js-drawer__userPhoneItem').attr('data-phone-value', userPhoneNumbers.mobile);
            } else {
                $profile.find('#drawerUserPhone').html('Pending - ' + userPhoneNumbers.mobile);
                $profile.find('.js-drawer__userPhoneItem').attr('data-phone-value', 'Pending - ' + userPhoneNumbers.mobile);
            }
            $profile.find('.js-drawer__userPhoneItem').attr('data-status-code', userPhoneNumbers.status_code);
        } else {
            $profile.find('#drawerUserPhone').html('Add your Phone');
            $profile.find('.js-drawer__userPhoneItem').attr('data-status-code', 0);
            $profile.find('.js-drawer__userPhoneItem').attr('data-phone-value', 'Add your Phone');
        }

        if (profile.profile_photo) {
            $('#drawerUserPhoto').attr('src', profile.profile_photo);
        } else {
            $('#drawerUserPhoto').attr('src', 'http://lorempixel.com/75/75');
        }
    };

    App.buildUserProfileEdit = function(response) {
        App.hideSpinner();

        var userProfile = response.data;
        var $modal = $('#detailViewModal');
        var $userPhone = $("#userPhone");
        
        if (!userProfile.country_code) {
            userProfile.country_code = App.config.country_code;
        }

        try {

            var birthDate = moment(userProfile.birth_date);// console.log(birthDate);
            userProfile.birth_date = birthDate.format('MMM DD');// format before assign to input

            var source   = $("#tpl_userProfile").html(); //console.log(source); return;
            var template = Handlebars.compile(source);
            
            //select a value in dropdown
            Handlebars.registerHelper('selected', function (input, value) {
                return input === value ? 'selected' : '';
            });

            // update modal body with template
            $modal.find('.modal-body').html(template(userProfile));
            
            $('#userBirthDate').datetimepicker({
                format: 'MMM DD',
                icons: datePickerIcons,
            });

            // User Phone number 
            $("#userPhone").intlTelInput({
                onlyCountries: ['ca', 'us',],
                separateDialCode: true,
                selectedCountry: userProfile.country_code,
                initialCountry: userProfile.country_code,
                // utilsScript: "/themes/wilsons/assets/js//utils.js"
            });

            $("#userPhone").on('keyup',function() {
                var countryCode = $("#userPhone").intlTelInput("getSelectedCountryData").iso2;
                console.log('countryCode', countryCode);
                $('#userPhoneCountryCode').val(countryCode.toUpperCase());
            });

            // User Profile Image
            $("#userProfileImage").click(function(e) {
                $("#profileImageUpload").click();
            });

            $("#profileImageUpload").change(function(){
                App.profileImgPreview(this);
            });

        } catch (error) {
            console.log(error);
        }
    };

    App.profileImgPreview = function(uploader) {
        if ( uploader.files && uploader.files[0] ){
            $('#userProfileImage').attr('src', 
                window.URL.createObjectURL(uploader.files[0])
            );

            App.uploadUserPhoto(uploader.files[0]);
        }
    }

    App.uploadUserPhoto = function(file) {
        var fd = new FormData();
        fd.append('file', file);

        axios({
            url: App.config.kangarooUrl + '/site/UploadPhoto',
            method: 'POST',
            data: fd,
            headers: {'Content-Type': 'multipart/form-data' },
        }).then(function (response) {
            $('#userProfileImageHidden').val(response.data.profile_photo);
        }).catch(function (error) {
            console.log(error);
        });
    }

    App.saveUserProfile = function() {
        var formData = {};
        
        //get form data as object
        $('#userProfileForm').serializeArray().map(function (x) {
            formData[x.name] = x.value;
        });

        if (formData.phone && !formData.country_code) {
            formData.country_code = App.config.country_code;
        }

        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.users + '/' + App.getUserId(),
            method: 'PATCH',
            action: 'api_update_profile',
            params: formData,
        }, App.handleResponse, App.handleError);
    };
    
    App.saveChangePin = function() {
        var formData = {};
        
        //get form data as object
        $('#changePinForm').serializeArray().map(function (x) {
            formData[x.name] = x.value;
        });

        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.users + '/' + App.getUserId(),
            method: 'PATCH',
            action: 'api_update_pin',
            params: formData,
        }, App.handleResponse, App.handleError);
    };

    App.saveAddChangeEmail = function() {
        var formData = {};
        
        //get form data as object
        $('#addChangeEmailForm').serializeArray().map(function (x) {
            formData[x.name] = x.value;
        });

        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.users + '/' + App.getUserId(),
            method: 'PATCH',
            action: 'api_add_change_email',
            params: formData,
        }, App.handleResponse, App.handleError);
    };

    App.saveAddChangePhone = function() {
        var formData = {};
        
        //get form data as object
        $('#addChangePhoneForm').serializeArray().map(function (x) {
            formData[x.name] = x.value;
        });

        App.showSpinner();
        api.client.request({
            url: App.config.api.endpoints.users + '/' + App.getUserId(),
            method: 'PATCH',
            action: 'api_add_change_phone',
            params: formData,
        }, App.handleResponse, App.handleError);
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

    App.buildCouponsList = function (context) {
        var source = $("#tpl_coupons").html();
        var template = Handlebars.compile(source);

        $('#coupons__list').html(template(context));
    };

    App.buildCouponDetail = function (context) {
        var $modal = $('#detailViewModal');
        var source = $("#tpl_coupon_detail").html();
        var template = Handlebars.compile(source); 
        $modal.find('.modal-body').html(template(context.data));
        $modal.modal('show');
    };

    App.buildBusinessDetail = function (context) {
        //var $modal = $('#detailViewModal');
        var source = $("#tpl_business_detail").html();
        var template = Handlebars.compile(source);
        $('#business__detail').html(template(context));
        App.initMap(context.branches);
        /*$modal.find('.modal-body').html(template(context.data));
        App.initMap(context.data.branches);
        $modal.modal('show');*/
    };

    App.buildTransactionsList = function (response) {
        var list = '<table class="table table-striped">';
        var $modal = $('#detailViewModal');

        for (var i = 0; i < response.data.length; i++) {
            var trx = response.data[i];
            var createdAt = moment(trx.created_at).format('MMMM D, hh:mm');

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
        } else if (currentUrl == '/coupons') {
            $('.navbar-top').find('#menu_coupons').addClass('active');
            //var userProfile = App.getLocalUserProfile();
            //fill the page with the info from API
            App.buildUserProfileDrawer();
            App.getCoupons();
        } else if (currentUrl == App.isAuthenticated()) {
            //login page and user is authenticated
            location.href = App.config.appBaseUrl + '/home';
        } else if (currentUrl == '/business/detail') {
            var urlParams = getUrlParams(location.search); //console.log(urlParams);
            var id = urlParams['id'];

            App.buildUserProfileDrawer();
            App.getBusinessDetail(id);
        }
    };

    App.initMap = function (branch) {
        for (var i = 0; i < branch.length; i++) {
            App.createMapMarker(branch[i]);
        }
    };

    App.createMapMarker = function (branch) {
        var businessId = event;
        var bounds = new google.maps.LatLngBounds();
        var mapOptions = {
            //center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 8,
            //center: myLatlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        //getting the lat and long 
        var address = App.buildBranchAddress(branch);
        
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': address
        }, function(results, status) {

            if(!branch.address.lat)
                var lat = results[0].geometry.location.lat();
            else
                var lat = branch.address.lat;

            if(!branch.address.long)
                var lon = results[0].geometry.location.lng();
            else
                var lon = branch.address.long;

            var branchLatLng = new google.maps.LatLng(lat,lon);
            var marker = new google.maps.Marker({
                position: branchLatLng,
               // icon:image,
                map: map,
                title: branch.name,
                zIndex: 1
            });

            bounds.extend(marker.position);

            var contentString = '<div id="content">'+
              '<div id="siteNotice">'+
              '</div>'+
              '<div id="bodyContent">'+
                  '<div style="font-size:14px; font-weight: 500; color: #000">'+
                        branch.address.formatted.replace(new RegExp("\\\\", "g"), "") +
                  '</div>'+
                  '<div style="font-size:14px; font-weight: 500; color: #54c1e2; ">'+
                        branch.name +
                  '</div>'+
              '</div>'+
              '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString,
                maxWidth: 300
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
            });

            google.maps.event.addListener(marker, 'mouseover', function() {
                var branchAddress = App.buildBranchAddress(branch);
            });

            map.fitBounds(bounds);
            var zoom = map.getZoom();
            map.setZoom(zoom > 10 ? 10 : zoom);
        });//geocode result,status
    }

    //called on map item hover, change address regarding the hovered business
    App.buildBranchAddress = function (branch) {
        var branchAddress = '';

        branchAddress+= branch.address.street.replace(new RegExp("\\\\", "g"), "") + '<br>';
        branchAddress+=branch.address.city+ '<br>';
        branchAddress+=branch.address.region+ '<br>';
        branchAddress+=branch.address.country + '<br>';
        
        return branchAddress;
    }


    var getUrlParams = function(search_string) {

      var parse = function(params, pairs) {
        var pair = pairs[0];
        var parts = pair.split('=');
        var key = decodeURIComponent(parts[0]);
        var value = decodeURIComponent(parts.slice(1).join('='));

        // Handle multiple parameters of the same name
        if (typeof params[key] === "undefined") {
          params[key] = value;
        } else {
          params[key] = [].concat(params[key], value);
        }

        return pairs.length == 1 ? params : parse(params, pairs.slice(1))
      }

      // Get rid of leading ?
      return search_string.length == 0 ? {} : parse({}, search_string.substr(1).split('&'));
    }
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