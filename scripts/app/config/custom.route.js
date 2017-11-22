

angular.module('betterTimetable')
    .config(function ($routeProvider) {

        $routeProvider
            .when('/custom', {
                templateUrl: 'views/custom.html',
                controller: 'CustomTimetableCtrl'
            })
    });