'use strict';

angular.module('measureLifeApp', ['ui.router','ngResource','ngDialog'])
.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            // route for the home page
            .state('app', {
                url:'/',
                views: {
                    'header': {
                        templateUrl : 'views/header.html',
                        controller  : 'HeaderController'
                    },
                    'content': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    },
                    'footer': {
                        templateUrl : 'views/footer.html',
                    }
                }

            })

            // route for the aboutus page
            .state('app.aboutus', {
                url:'aboutus',
                views: {
                    'content@': {
                        templateUrl : 'views/aboutus.html',
                        controller  : 'AboutController'
                    }
                }
            })

            // route for the goals page
            .state('app.goals', {
                url: 'goals',
                views: {
                    'content@': {
                        templateUrl : 'views/goals.html',
                        controller  : 'GoalsController'
                    }
                }
            })

            // route for the goaldetail page
            .state('app.goaldetails', {
                url: 'goals/:id',
                views: {
                    'content@': {
                        templateUrl : 'views/goaldetail.html',
                        controller  : 'GoalDetailController'
                   }
                }
            });

        $urlRouterProvider.otherwise('/');
    })
;
