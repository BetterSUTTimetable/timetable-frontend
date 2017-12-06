'use strict';

angular
  .module('betterTimetable', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'TreeWidget',
    'RecursionHelper'
  ]);
    'ngTouch',
    'LocalStorageModule'
  ])
    .run(function($rootScope, localStorageService){
        $rootScope.url = "http://localhost:8080";
        
        $rootScope.isAuthenticated = function () {
            var isAuthenticated = localStorageService.get("isAuthenticated");
            console.log(isAuthenticated);
            return isAuthenticated
        }
    })
    .config(function($httpProvider){
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.push('authExpiredInterceptor');
    });
