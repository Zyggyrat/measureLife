'use strict';

angular.module('measureLifeApp')

.controller('GoalsController', ['$scope', 'goalsFactory',
        function ($scope, goalsFactory) {

    $scope.tab = 1;
    $scope.filtText = '';
    $scope.showDetails = false;
    $scope.showSelectGoal = false;
    $scope.showGoals = false;
    $scope.message = "Loading ...";

    goalsFactory.query(
        function (response) {
            $scope.goals = response;
            $scope.showGoals = true;

        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
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

    $scope.toggleSelectGoals = function () {
        $scope.showSelectGoal = !$scope.showSelectGoal;
    };

    $scope.selectGoal = function(goalid) {
        console.log("goalid is " + goalid);
    };
}])

.controller('GoalDetailController', ['$scope', '$state', '$stateParams', 'AuthFactory', 'goalsFactory', 'readingsFactory', 'baseURL',
    function ($scope, $state, $stateParams, AuthFactory, goalsFactory, readingsFactory, baseURL) {

    $scope.baseURL = baseURL;

    $scope.goal = {};
    $scope.readings = {};
    $scope.showGoal = false;
    $scope.message = "Loading ...";

    $scope.goal = goalsFactory.get({
            id: $stateParams.id
        })
        .$promise.then(
            function (response) {
                $scope.goal = response;
                $scope.showGoal = true;
            },
            function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );

    console.log($scope.goal);

    $scope.readings = readingsFactory.query({
            id: $stateParams.id
        })
        .$promise.then(
            function (response1) {
                $scope.readings = response1;
            },
            function (response1) {
                $scope.message = "Error: " + response1.status + " " + response1.statusText;
            }
        );

    console.log($scope.readings);

    $scope.units = ["reps", "pounds", "miles", "steps", "minutes", "days", "pages"];

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

        $state.go($state.current, null, {reload: true});

        $scope.readingForm.$setPristine();

        $scope.myreading = {
            value: "",
            measurementUnit: "reps",
            postedBy: "",
            goalId: ""
        };
    };
}])

// implement the IndexController and About Controller here

.controller('HomeController', ['$scope', 'goalsFactory', 'baseURL',
    function ($scope, goalsFactory, baseURL) {

    $scope.baseURL = baseURL;

    goalsFactory.query({
        featured: "true"
    })
    .$promise.then(
        function (response) {
            var goals = response;
            $scope.goals = goals;
            $scope.showFeaturedGoals = true;
        },
        function (response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });

}])

.controller('AboutController', ['$scope', 'baseURL',
    function ($scope, baseURL) {

    $scope.baseURL = baseURL;

}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory',
        function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.username = '';

    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
    }

    $scope.openLogin = function () {
        ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
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

    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
    });

    $scope.stateis = function(curstate) {
       return $state.is(curstate);
    };

}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory',
    function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.loginData = $localStorage.getObject('userinfo','{}');

    $scope.doLogin = function() {
        if($scope.rememberMe)
           $localStorage.storeObject('userinfo',$scope.loginData);

        AuthFactory.login($scope.loginData);

        ngDialog.close();

    };

    $scope.openRegister = function () {
        ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller:"RegisterController" });
    };

}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function ($scope, ngDialog, $localStorage, AuthFactory) {

    $scope.register={};
    $scope.loginData={};

    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);

        ngDialog.close();

    };
}])
;
