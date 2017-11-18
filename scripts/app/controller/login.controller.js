'use strict';


angular.module('betterTimetable')
    .controller('LoginCtrl', function ($scope) {

        $scope.user = {
            rememberMe : true
        };

        $scope.register = function () {
            //TODO: add login service
            //TODO: call login service
        }

    });
