angular.module('measureLife.controllers', [])

.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $cordovaCamera, $cordovaImagePicker, AuthFactory, $resource, baseURL) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = $localStorage.getObject('userinfo','{}');
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
        // var options = {
        //     quality: 50,
        //     destinationType: Camera.DestinationType.DATA_URL,
        //     sourceType: Camera.PictureSourceType.CAMERA,
        //     allowEdit: true,
        //     encodingType: Camera.EncodingType.JPEG,
        //     targetWidth: 100,
        //     targetHeight: 100,
        //     popoverOptions: CameraPopoverOptions,
        //     saveToPhotoAlbum: false
        // };

        // $scope.takePicture = function() {
        //     $cordovaCamera.getPicture(options).then(function(imageData) {
        //         $scope.registration.imgSrc = "data:image/jpeg;base64," + imageData;
        //     }, function(err) {
        //         console.log(err);
        //     });
        //     $scope.registerform.show();
        // };

        //   var pickoptions = {
        //       maximumImagesCount: 1,
        //       width: 100,
        //       height: 100,
        //       quality: 50
        //   };

        // $scope.pickImage = function() {
        //   $cordovaImagePicker.getPictures(pickoptions)
        //       .then(function (results) {
        //           for (var i = 0; i < results.length; i++) {
        //               console.log('Image URI: ' + results[i]);
        //               $scope.registration.imgSrc = results[0];
        //           }
        //       }, function (error) {
        //           // error getting photos
        //       });
        // };

    });
})

.controller('GoalsController', ['$scope', 'goalsFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
    function ($scope, goalsFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    $scope.baseURL = baseURL;
    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;


    goalsFactory.query(
        function (response) {
            $scope.goals = response;
        },
        function (response) {
        });

    $scope.select = function (setTab) {
        $scope.tab = setTab;

        if (setTab === 2) {
            $scope.filtText = "Mind";
        } else if (setTab === 3) {
            $scope.filtText = "Body";
        } else if (setTab === 4) {
            $scope.filtText = "Soul";
        } else {
            $scope.filtText = "";
        }
    };

    $scope.isSelected = function (checkTab) {
        return ($scope.tab === checkTab);
    };

    $scope.toggleDetails = function () {
        $scope.showDetails = !$scope.showDetails;
    };

    $scope.selectGoal = function (goalid) {
        console.log("goalid is " + goalid);

        $ionicListDelegate.closeOptionButtons();

        $ionicPlatform.ready(function () {

                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Selected Goal",
                    text: $scope.goals[goalid].name
                }).then(function () {
                    console.log('Selected Goal '+$scope.goals[goalid].name);
                },
                function () {
                    console.log('Failed to Select Goal');
                });

              $cordovaToast
                  .show('Selected Goal '+$scope.goals[goalid].name, 'long', 'center')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });


        });
    }
}])

.controller('AboutController', ['$scope', '$ionicModal', '$timeout', 'baseURL',
     function ($scope, $ionicModal, $timeout, feedbackFactory, baseURL) {

    $scope.baseURL = baseURL;
}])

.controller('ProgressDetailController', ['$scope', '$state', '$stateParams', 'AuthFactory', 'goalsFactory', 'readingsFactory', 'baseURL', '$ionicPopover', '$ionicModal', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast', '$cordovaSocialSharing',
    function ($scope, $state, $stateParams, AuthFactory, goalsFactory, readingsFactory, baseURL, $ionicPopover, $ionicModal, $ionicPlatform, $cordovaLocalNotification, $cordovaToast, $cordovaSocialSharing) {

    $scope.baseURL = baseURL;

    $scope.goal = goalsFactory.get({
            id: $stateParams.id
        },
            function (response) {
                $scope.goal = response;
            },
            function (response) {
            }
        );

    console.log($scope.goal);

    $scope.readings = readingsFactory.query({
            id: $stateParams.id
        },
            function (response1) {
                $scope.readings = response1;
            },
            function (response1) {
            }
        );

    console.log($scope.readings);

    // .fromTemplateUrl() method
    $ionicPopover.fromTemplateUrl('templates/progress-detail-popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });


    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
    // Execute action on hide popover
    $scope.$on('popover.hidden', function () {
        // Execute action
    });
    // Execute action on remove popover
    $scope.$on('popover.removed', function () {
        // Execute action
    });

    $scope.selectGoal = function () {
        console.log("index is " + $stateParams.id);

        goalFactory.save({_id: $stateParams.id});;
        $scope.popover.hide();


        $ionicPlatform.ready(function () {

                $cordovaLocalNotification.schedule({
                    id: 1,
                    title: "Added Reading",
                    text: $scope.goal.name
                }).then(function () {
                    console.log('Added Reading '+$scope.goal.name);
                },
                function () {
                    console.log('Failed to add Reading ');
                });

              $cordovaToast
                  .show('Added Reading '+$scope.goal.name, 'long', 'bottom')
                  .then(function (success) {
                      // success
                  }, function (error) {
                      // error
                  });
        });
    };

    $scope.units = ["reps", "pounds", "miles", "steps", "minutes", "pages"];

    $scope.myreading = {
        value: "",
        measurementUnit: "reps",
        postedBy: "",
        goalId: ""
    };

    $scope.submitReading = function () {
        $scope.myreading.postedBy = AuthFactory.getUserId();
        $scope.myreading.goalId = $stateParams.id;
        readingsFactory.save({id: $stateParams.id}, $scope.myreading);

        $scope.closeReadingForm();

        $scope.myreading = {
            value: "",
            measurementUnit: "reps",
            postedBy: "",
            goalId: ""
        };

        $state.go($state.current, null, {reload: true});
    }

    // Create the reading modal that we will use later
    $ionicModal.fromTemplateUrl('templates/reading.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.readingForm = modal;
    });

    // Triggered in the reading modal to close it
    $scope.closeReadingForm = function () {
        $scope.readingForm.hide();
    };

    // Open the reading modal
    $scope.showReadingForm = function () {
        $scope.readingForm.show();
        $scope.popover.hide();
    };

    $ionicPlatform.ready(function() {

        var message = $scope.goal.description;
        var subject = $scope.goal.name;
        var link = $scope.baseURL+$scope.goal.image;
        var image = $scope.baseURL+$scope.goal.image;

        $scope.nativeShare = function() {
            $cordovaSocialSharing
                .share(message, subject, link); // Share via native share sheet
        };

        //checkout http://ngcordova.com/docs/plugins/socialSharing/
        // for other sharing options
    });

}])

.controller('helpController', ['$scope', 'baseURL', function ($scope, baseURL) {

    $scope.baseURL = baseURL;

}])

.controller('IndexController', ['$scope', 'goalsFactory', 'baseURL', function ($scope, goalsFactory, baseURL) {

    $scope.baseURL = baseURL;

    goalsFactory.query({
        featured: "true"
    },
        function (response) {
            var goals = response;
            $scope.goals = goals;
            $scope.showFeaturedGoals = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

}])

;
