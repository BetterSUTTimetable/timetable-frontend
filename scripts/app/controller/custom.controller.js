'use strict';


angular.module('betterTimetable')
    .controller('CustomTimetableCtrl', function ($scope, CustomRsc) {

        CustomRsc.isAuthenticated({}, function () {
            console.log("is authenticated");
        }, function () {
            console.log("is not authenticated");
        })
    });
