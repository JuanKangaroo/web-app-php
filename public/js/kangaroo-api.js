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

//=========================================================================
//              Global function to get UNIX timestamp in JavaScript
//=========================================================================
function time() {
    //A unary operator like plus triggers the valueOf method in the Date object and it returns the time-stamp
    return Math.floor(+ new Date() / 1000);

    //On almost all current browsers you can use Date.now() to get the UTC timestamp in milliseconds
    // return Math.floor(Date.now() / 1000);
};

//=========================================================================
//              Kangaroo API methods
//=========================================================================
;(function($, undefined) {
    'use strict';

    var KangarooApi = {
        client: new AjaxRequest(),
        config: config || {},
    };

    window.KangarooApi = KangarooApi || {};

    function AjaxRequest() {
        var options = {};
    }

    AjaxRequest.prototype.request = function(options, onSuccess, onError) {
        var self = this;
        var headers = {};

        var token = localStorage.getObject('user_token');

        if (!token) {
            throw 'No User Token found'; 
        } else if (token.expires < time()) {
            // console.log('Token Expired', 'now', time(), 'token.expires', token.expires );
            // Token expired - refresh it !
            token = KangarooApi.refreshToken(token, options, onSuccess, onError);
            return;
        }

        headers = KangarooApi.config.headers;
        //append access token to the headers
        headers.Authorization = token.token_type +' '+ token.access_token;

        //merge default options with options passed
        self.options = $.extend({
            'url': '',
            'timeout': 20000,
            'method': 'GET',
            'params': {},
            'headers': headers,
        }, options);

        axios({
            method: self.options.method,
            url: self.options.url,
            data: self.options.params,
            headers: self.options.headers
        }).then(response => {
            // console.log(response.data);
            onSuccess(response.data, self.options);
        }).catch (error => {
            // console.log(error); console.log(error.response);
            onError(error);
            KangarooApi.log('error', KangarooApi.config.appName, JSON.stringify(error));
        });
    }

    /*****************************************************************************
     *
     * Methods for dealing with the API (API Requests)
     *
     ****************************************************************************/
    KangarooApi.log = function (level, funcName, logData) {
        $.post(KangarooApi.config.loggerUrl, { level: level, funcName: funcName, data: logData });
    }

    KangarooApi.login = function (input, successCb, failCb) {
        var params = new URLSearchParams();
        params.append('username', input.username);
        params.append('password', input.password);
        params.append('grant_type', KangarooApi.config.api.grant_type);
        params.append('client_id', KangarooApi.config.api.client_id);
        params.append('client_secret', KangarooApi.config.api.client_secret);
        params.append('scope', KangarooApi.config.api.scope);
        params.append('application_key', KangarooApi.config.headers['X-Application-Key']);

        axios({
            method: 'POST',
            url: KangarooApi.config.api.endpoints.token,
            data: params,
        }).then(response => {
            console.log(response.data);
            var token = response.data;
            token.expires = time() + token.expires_in;//store expires time for token
            localStorage.setObject('user_token', token);//store the token
            successCb(token, {action: 'user_login'});
        }).catch (error => {
            // console.log(error); console.log(error.response);
            failCb(error);
            KangarooApi.log('error', 'KangarooApi.userLogin: ' + KangarooApi.config.appName, JSON.stringify(error));
        });
    };

    KangarooApi.refreshToken = function (token, options, onSuccess, onError) {
        var params = new URLSearchParams();
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', token.refresh_token);
        params.append('client_id', KangarooApi.config.api.client_id);
        params.append('client_secret', KangarooApi.config.api.client_secret);
        params.append('scope', KangarooApi.config.api.scope);

        axios({
            method: 'POST',
            url: KangarooApi.config.api.endpoints.token,
            data: params,
        }).then(response => {
            console.log('Refreshed Token', response);
            var token = response.data;
            token.expires = time() + token.expires_in;//store expires time for token
            localStorage.setObject('user_token', token);//store the token
            //call the previous request that started before refreshing the token
            KangarooApi.request(options, onSuccess, onError);
            return;
        }).catch (error => {
            console.log('Refresh Token Error', error);
            KangarooApi.log('error', 'KangarooApi.userLogin: ' + KangarooApi.config.appName, JSON.stringify(error));
        });
    };

    KangarooApi.signup = function (input, successCb, failCb) {
        axios({
            method: 'POST',
            url: KangarooApi.config.api.endpoints.createUser,
            data: input,
            headers: { 'X-Application-Key': KangarooApi.config.headers['X-Application-Key']},
        }).then(response => {
            // console.log(response.data);
            successCb(response.data, {action: 'user_signup'});
        }).catch (error => {
            // console.log(error); console.log(error.response);
            failCb(error);
        });
    };

    KangarooApi.logout = function () {
        localStorage.removeItem('user_token');
        location.href = KangarooApi.config.appBaseUrl;
    };

})(jQuery);