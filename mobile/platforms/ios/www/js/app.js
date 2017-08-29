// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('measureLife', ['ionic', 'ngCordova', 'measureLife.controllers','measureLife.services'])

.run(function($ionicPlatform, $rootScope, $ionicLoading, $cordovaSplashscreen, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
      $timeout(function(){
                $cordovaSplashscreen.hide();
      },2000);
  });
    
    $rootScope.$on('loading:show', function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner> Loading ...'
        })
    });

    $rootScope.$on('loading:hide', function () {
        $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function () {
        console.log('Loading ...');
        $rootScope.$broadcast('loading:show');
    });

    $rootScope.$on('$stateChangeSuccess', function () {
        console.log('done');
        $rootScope.$broadcast('loading:hide');
    });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/sidebar.html',
      controller: 'AppCtrl'
    })
    .state('app.homeTabs', {
      url: '/homeTabs',
      abstract: true,
      templateUrl: 'templates/homeTabs.html'
    })
    .state('app.home.home', {
      url: '/home',
      views: {
        'mainContent': {
          templateUrl: 'templates/home.html',
          controller: 'dashboardController'
        }
      }
    })
    .state('app.home.dataEntry', {
      url: '/dataEntry',
      views: {
        'mainContent': {
          templateUrl: 'templates/dataEntry.html',
          controller: 'dataEntryController'
        }
      }
    })
    .state('app.goals', {
        url: '/goals',
        views: {
          'mainContent': {
            templateUrl: 'templates/goals.html',
            controller: 'goalsController'
        }
      }
    })
    .state('app.metrics', {
        url: '/metrics',
        views: {
          'mainContent': {
            templateUrl: 'templates/metrics.html',
            controller:'metricsController'
        }
      }
    })
    .state('app.reports', {
        url: '/reports',
        cache:false,
        views: {
          'mainContent': {
            templateUrl: 'templates/reports.html',
            controller:'favoritesController'
        }
      }
    })
    .state('app.templates', {
        url: '/templates',
        views: {
          'mainContent': {
            templateUrl: 'templates/templates.html',
            controller: 'templatesController'
          }
        }
      })
    .state('app.settings', {
        url: '/settings',
        cache:false,
        views: {
          'mainContent': {
            templateUrl: 'templates/settings.html',
            controller:'settingsController'
        }
      }
    })
    .state('app.help', {
        url: '/help',
        views: {
          'mainContent': {
            templateUrl: 'templates/help.html',
            controller: 'helpController'
        }
      }
    })
    .state('app.goalDetails', {
      url: '/goals/:id',
      cache:false,
      views: {
        'mainContent': {
          templateUrl: 'templates/goalDetails.html',
          controller: 'goalDetailsController'
        }
      }
    })
    .state('app.metricDetails', {
      url: '/metrics/:id',
      cache:false,
      views: {
        'mainContent': {
          templateUrl: 'templates/metricDetails.html',
          controller: 'metricDetailsController'
        }
      }
    })
    .state('app.reportDetails', {
      url: '/reports/:id',
      cache:false,
      views: {
        'mainContent': {
          templateUrl: 'templates/reportDetails.html',
          controller: 'reportDetailsController'
        }
      }
    })
    .state('app.templateDetails', {
      url: '/templates/:id',
      cache:false,
      views: {
        'mainContent': {
          templateUrl: 'templates/templateDetails.html',
          controller: 'templateDetailsController'
        }
      }
    })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
