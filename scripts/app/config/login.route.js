

angular.module('betterTimetable')
    .config(function ($routeProvider) {

        $routeProvider
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
    });