'use strict';
var serverAddress = "192.168.1.159"; // Home
//var serverAddress = "172.30.0.32"; // Work
var userId = '';

angular.module('measureLifeApp')
.constant("baseURL", "https://" + serverAddress + ":3443/")
.factory('goalsFactory', ['$resource', 'baseURL', function($resource, baseURL) {

    return $resource(baseURL + "goals/:id", null, {
        'update': {
            method: 'PUT'
        }
    });

}])

.factory('readingsFactory', ['$resource', 'baseURL', function($resource, baseURL) {
    return $resource(baseURL + "readings/:id", {id:'@id'}, {
        'query':  {
          method:'GET',
          isArray:true
        },
        'update': {
          method: 'PUT'
        }
    });

}])

.factory('$localStorage', ['$window', function ($window) {
    return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
    };
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog',
  function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){

    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;


  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.username != undefined) {
      useCredentials(credentials);
    }
  }

  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }

  function useCredentials(credentials) {
    isAuthenticated = true;
    username = credentials.username;
    authToken = credentials.token;
    userId = credentials.userId;

    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    userId = '';
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }

    authFac.login = function(loginData) {

        $resource(baseURL + "users/login")
        .save(loginData,
           function(response) {
              storeUserCredentials({username:loginData.username, token: response.token, userId: response.id});
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
              isAuthenticated = false;

              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});
           }

        );

    };

    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response){
        });
        destroyUserCredentials();
    };

    authFac.register = function(registerData) {

        $resource(baseURL + "users/register")
        .save(registerData,
           function(response) {
              authFac.login({username:registerData.username, password:registerData.password, userId: response.id});
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {username:registerData.username, password:registerData.password, userId: response.id});
            }

              $rootScope.$broadcast('registration:Successful');
           },
           function(response){

              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message +
                  '</p><p>' + response.data.err.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }

        );
    };

    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };

    authFac.getUsername = function() {
        return username;
    };

    authFac.getUserId = function() {
        return userId;
    };

    loadUserCredentials();

    return authFac;

}])
;
