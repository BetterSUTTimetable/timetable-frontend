'use strict';


angular.module('betterTimetable')
    .controller('RegisterCtrl', function ($scope, RegisterRsc, $location) {

        $scope.newUser = {};

        $scope.register = function () {
            if($scope.newUser.password !== $scope.newUser.repeatedPassword){
                Materialize.toast('Hey, hey, hey! Passwords are not the same', 4000);
                return;
            } else {
                register($scope.newUser);
            }
        }

        var register = function (data) {
            RegisterRsc.user(data, function(){
                Materialize.toast('Thanks! Now you can log in!', 4000);
                $location.path("/login");
            }, function(){
                Materialize.toast('Error! Probably entered e-mail address is in use.', 4000);
                return;
            })
        }
    });
