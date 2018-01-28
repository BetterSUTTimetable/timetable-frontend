'use strict';

angular
  .module('betterTimetable', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'LocalStorageModule', 
    'angularTreeview'
  ])
    /*.constant('URL', 'http://localhost:8080')*/
    .constant('URL', 'http://192.168.0.136:8080')
    .run(function($rootScope, AuthSrv, $location){

        AuthSrv.isAuthenticated();

        $rootScope.$on('notAuthenticated', function() { $rootScope.isAuthenticated = false; });

        $rootScope.$on('isAuthenticated', function(event, args) {
            $rootScope.isAuthenticated = true;
            $location.url("/custom");
            $rootScope.user = args;
        });

        $rootScope.logout = function () {
            AuthSrv.logout();
        }
    })
    .config(function($httpProvider){
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.interceptors.push('authExpiredInterceptor');
    });
