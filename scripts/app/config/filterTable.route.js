
angular.module('betterTimetable')
.config(function ($routeProvider) {

    $routeProvider
        .when('/filterTable', {
            templateUrl: 'views/filterTable.html',
            controller: 'FilterTableCtrl'
        })
});