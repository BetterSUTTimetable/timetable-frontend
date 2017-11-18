'use strict';


angular.module('betterTimetable')
    .controller('RegisterCtrl', function ($scope) {

        $scope.newUser = {};

        $scope.register = function () {
            if($scope.newUser.password !== $scope.newUser.repeatedPassword){
                Materialize.toast('Hey, hey, hey! Passwords are not the same', 4000);
                return;
            } else {
                //TODO: add register service
                //TODO: call register service
            }
        }

    });
