'use strict';

angular.module('measureLife.services', ['ngResource'])
.constant("baseURL", "https://192.168.1.159:30443/")
// .constant("baseURL", "https://localhost:3443/")
.factory('goalFactory', ['$resource', 'baseURL', 
  function ($resource, baseURL) {
    return $resource(baseURL + "goals/:id", null, {
        'update': {
            method: 'PUT'
        }
      }
    );
}])

.factory('metricFactory', ['$resource', 'baseURL', 
  function ($resource, baseURL) {
    return $resource(baseURL + "metrics/:id", null, {
      'update': {
          method: 'PUT'
        }
      }
    );
}])

.factory('reportFactory', ['$resource', 'baseURL', 
  function ($resource, baseURL) {
    return $resource(baseURL + "reports/:id", null, {
      'update': {
          method: 'PUT'
        }
      }
    );
}])

.factory('templateFactory', ['$resource', 'baseURL', 
  function ($resource, baseURL) {
    return $resource(baseURL + "templates/:id", null, {
        'update': {
            method: 'PUT'
        }
      }
    );
}])

.factory('$localStorage', ['$window', function($window) {
  return {
    store: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    remove: function (key) {
      $window.localStorage.removeItem(key);
    },
    storeObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key,defaultValue) {
      return JSON.parse($window.localStorage[key] || defaultValue);
    }
  }
}])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', 'baseURL', '$ionicPopup', 
  function($resource, $http, $localStorage, $rootScope, baseURL, $ionicPopup){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;
    

  authFac.getUserId =  function () {
      var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
      return credentials._id;
    }

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
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }
     
  authFac.login = function(loginData) {
      console.log("accessing" + baseURL + "users/login");
      $resource(baseURL + "users/login")
      .save(loginData,
         function(response) {
            storeUserCredentials({username:loginData.username, token: response.token});
            $rootScope.$broadcast('login:Successful');
         },
         function(response){
            isAuthenticated = false;
            if (response.data !== null && response.data.err !== undefined) {
              var message = '<div><p>' +  response.data.err.message + 
                '</p><p>' + response.data.err.name + '</p></div>';

              var alertPopup = $ionicPopup.alert({
                  title: '<h4>Login Failed!</h4>',
                  template: message
              });
            };
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
            authFac.login({username:registerData.username, password:registerData.password});
          
            $rootScope.$broadcast('registration:Successful');
         },
         function(response){
          
            var message = '<div><p>' +  response.data.err.message + 
                '</p><p>' + response.data.err.name + '</p></div>';
          
             var alertPopup = $ionicPopup.alert({
                  title: '<h4>Registration Failed!</h4>',
                  template: message
              });

              alertPopup.then(function(res) {
                  console.log('Registration Failed!');
              });
         }
      
      );
  };
  
  authFac.isAuthenticated = function() {
      return isAuthenticated;
  };
  
  authFac.getUsername = function() {
      return username;  
  };
  
  authFac.facebook = function() {
      
  };
  
  loadUserCredentials();
  
  return authFac;
    
}])
;
