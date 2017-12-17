

angular.module('betterTimetable')
    .config(function ($routeProvider) {

        $routeProvider
            .when('/timetable/:id', {
                templateUrl: 'views/timetable.html',
                controller: 'TimetableCtrl'
            })
    });