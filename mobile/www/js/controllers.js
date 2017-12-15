angular.module('measureLife.controllers', [])

    .controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, $localStorage, $ionicPlatform, $ionicPopup, $cordovaCamera, $cordovaImagePicker, AuthFactory, $resource, baseURL) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.baseURL = baseURL;

        // Form data for the login modal
        $scope.loginData = $localStorage.getObject('userinfo', '{}');
        $scope.reservation = {};
        $scope.registration = {};
        $scope.loggedIn = false;

        if (AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
        }

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.login = function() {
            $scope.modal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doLogin = function() {
            console.log('Doing login', $scope.loginData);
            $localStorage.storeObject('userinfo', $scope.loginData);

            AuthFactory.login($scope.loginData);

            $scope.closeLogin();
        };

        $scope.logOut = function() {
            AuthFactory.logout();
            $scope.loggedIn = false;
            $scope.username = '';
        };

        $scope.goalData = {};

        // Create the goalCreateModal that we will use later
        $ionicModal.fromTemplateUrl('templates/goalCreate.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.goalCreateModal = modal;
        });

        // Triggered in the goalCreateModal to close it
        $scope.closeCreateGoal = function() {
            $scope.goalCreateModal.hide();
        };

        // Open the goalCreateModal
        $scope.doCreateGoal = function() {
            $scope.goalCreateModal.show();
        };

        // Perform the login action when the user submits the login form
        $scope.createGoal = function() {
            var userId = AuthFactory.getUserId();
            $scope.goalData.postedBy = userId;

            console.log('Creating Goal ', $scope.goalData.name + " : " + $scope.goalData.description);
            console.log("accessing " + baseURL + "goals");

            $resource(baseURL + "users/" + userId + "/goals")
                .save($scope.goalData,
                    function(response) {
                        $rootScope.$broadcast('createGoal:Successful');
                    },
                    function(response) {
                        if(response.status == 403) {
                            var forbiddenMessage = '<div><p>' + "Please login to create a goal!" + '</p></div>';

                            var forbiddenAlertPopup = $ionicPopup.alert({
                                title: '<h4>Create Goal Failed!</h4>',
                                template: forbiddenMessage
                            });
                        }
                        if (response.data !== null && response.data.err !== undefined) {
                            var message = '<div><p>' + response.data.err.message +
                                '</p><p>' + response.data.err.name + '</p></div>';

                            var alertPopup = $ionicPopup.alert({
                                title: '<h4>Create Goal Failed!</h4>',
                                template: message
                            });
                        }
                    }

                );
            $scope.closeCreateGoal();
        };

        $rootScope.$on('login:Successful', function() {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
        });

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/register.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.registerform = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeRegister = function() {
            $scope.registerform.hide();
        };

        // Open the login modal
        $scope.register = function() {
            $scope.registerform.show();
        };

        // Perform the login action when the user submits the login form
        $scope.doRegister = function() {
            console.log('Doing registration', $scope.registration);
            $scope.loginData.username = $scope.registration.username;
            $scope.loginData.password = $scope.registration.password;

            AuthFactory.register($scope.registration);
            // Simulate a login delay. Remove this and replace with your login
            // code if using a login system
            $timeout(function() {
                $scope.closeRegister();
            }, 1000);
        };

        $rootScope.$on('registration:Successful', function() {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
            $localStorage.storeObject('userinfo', $scope.loginData);
        });

        $ionicPlatform.ready(function() {

        });
    })

    .controller('dashboardController', ['$scope', 'reportFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
        function($scope, reportFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            console.log('in dashboardController');
            $scope.baseURL = baseURL;

            reportFactory.query(
                function(response) {
                    $scope.reports = response;
                },
                function(response) {});

        }
    ])

    .controller('dataEntryController', ['$scope', 'reportFactory', 'metricFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
        function($scope, metricFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;


            reportFactory.query(
                function(response) {
                    $scope.reports = response;
                },
                function(response) {});

        }
    ])

    // .controller('userController', ['$scope', 'AuthFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
    //     function($scope, authFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

    //         $scope.baseURL = baseURL;
    //         $scope.tab = 1;
    //         $scope.filtText = '';
    //         $scope.showDetails = false;

    //         AuthFactory.query(
    //             function(response) {
    //                 $scope.user = response;
    //             },
    //             function(response) {});

    //     }
    // ])

    .controller('goalsController', ['$scope', 'goalFactory', 'AuthFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
        function($scope, goalFactory, authFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            var userId = authFactory.getUserId();

            $scope.baseURL = baseURL + "users/" + userId;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;

            goalFactory.query(
                function(response) {
                    $scope.goals = response;
                },
                function(response) {});

            $scope.createGoal = function () {
                console.log('Creating goal', $scope.createGoal);
                $scope.goalData.name = $scope.createGoal.name;
                $scope.goalData.description = $scope.createGoal.description;
                goalFactory.createGoal($scope.createGoal);
            };

            $scope.toggleDelete = function () {
                $scope.shouldShowDelete = !$scope.shouldShowDelete;
                console.log($scope.shouldShowDelete);
            }

            $scope.deleteGoal = function (goalId) {

                var confirmPopup = $ionicPopup.confirm({
                    title: '<h3>Confirm Delete</h3>',
                    template: '<p>Are you sure you want to delete this goal?</p>'
                });

                confirmPopup.then(function (res) {
                    if (res) {
                        console.log('Ok to delete');
                        goalFactory.delete({id: goalId});

                       $state.go($state.current, {}, {reload: true});
                       // $window.location.reload();
                    } else {
                        console.log('Canceled delete');
                    }
                });
                $scope.shouldShowDelete = false;


            }

        }
    ])

    .controller('metricsController', ['$scope', 'metricFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
        function($scope, metricFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;


            metricFactory.query(
                function(response) {
                    $scope.metrics = response;
                },
                function(response) {});

        }
    ])

    .controller('reportsController', ['$scope', 'reportFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
        function($scope, reportFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;


            reportFactory.query(
                function(response) {
                    $scope.reports = response;
                },
                function(response) {});

        }
    ])

    .controller('templatesController', ['$scope', 'templateFactory', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
        function($scope, templateFactory, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;


            templateFactory.query(
                function(response) {
                    $scope.templates = response;
                },
                function(response) {});

        }
    ])

    .controller('settingsController', ['$scope', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
        function($scope, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;

        }
    ])

    .controller('helpController', ['$scope', 'baseURL', '$ionicListDelegate', '$ionicPlatform', '$cordovaLocalNotification', '$cordovaToast',
        function($scope, baseURL, $ionicListDelegate, $ionicPlatform, $cordovaLocalNotification, $cordovaToast) {

            $scope.baseURL = baseURL;
            $scope.tab = 1;
            $scope.filtText = '';
            $scope.showDetails = false;

        }
    ])


;
