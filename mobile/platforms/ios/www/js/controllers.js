angular.module('measureLife.controllers', [])

.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, AuthFactory) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
    $scope.reservation = {};
    $scope.registration = {};
    $scope.loggedIn = false;
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }
    
    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);
        $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        $scope.closeLogin();
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
    };
      
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.registerform = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeRegister = function () {
        $scope.registerform.hide();
    };

    // Open the login modal
    $scope.register = function () {
        $scope.registerform.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doRegister = function () {
        console.log('Doing registration', $scope.registration);
        $scope.loginData.username = $scope.registration.username;
        $scope.loginData.password = $scope.registration.password;

        AuthFactory.register($scope.registration);
        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeRegister();
        }, 1000);
    };
       
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $localStorage.storeObject('userinfo',$scope.loginData);
    });
    
    $ionicPlatform.ready(function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
        };
 
        $scope.takePicture = function() {
            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                console.log(err);
            });
            $scope.registerform.show();
        };
        
          var pickoptions = {
              maximumImagesCount: 1,
              width: 100,
              height: 100,
              quality: 50
          };
        
        $scope.pickImage = function() {
          $cordovaImagePicker.getPictures(pickoptions)
              .then(function (results) {
                  for (var i = 0; i < results.length; i++) {
                      console.log('Image URI: ' + results[i]);
                      $scope.registration.imgSrc = results[0];
                  }
              }, function (error) {
                  // error getting photos
              });
        };
 
    });
})

.controller('dashboardController', 
    ['$scope', 'reportFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', 
    function ($scope, reportFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;


    reportFactory.query(
        function (response) {
            $scope.reports = response;
        },
        function (response) {
        });
    
}])

.controller('dataEntryController', 
    ['$scope', 'metricFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', 
    function ($scope, metricFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;


    reportFactory.query(
        function (response) {
            $scope.reports = response;
        },
        function (response) {
        });
    
}])

.controller('goalsController', 
    ['$scope', 'goalFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', 
    function ($scope, goalFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;


    reportFactory.query(
        function (response) {
            $scope.goals = response;
        },
        function (response) {
        });
    
}])

.controller('metricsController', 
    ['$scope', 'metricFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', 
    function ($scope, metricFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;


    reportFactory.query(
        function (response) {
            $scope.metrics = response;
        },
        function (response) {
        });
    
}])

.controller('reportsController', 
    ['$scope', 'reportFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', 
    function ($scope, reportFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;


    reportFactory.query(
        function (response) {
            $scope.reports = response;
        },
        function (response) {
        });
    
}])

.controller('templatesController', 
    ['$scope', 'templateFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', 
    function ($scope, templateFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;


    reportFactory.query(
        function (response) {
            $scope.templates = response;
        },
        function (response) {
        });
    
}])

.controller('settingsController', 
    ['$scope', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', 
    function ($scope, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;

}])

.controller('helpController', 
    ['$scope', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', 
    function ($scope, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    
}])


;