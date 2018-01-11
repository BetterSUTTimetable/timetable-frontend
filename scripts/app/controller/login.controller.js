'use strict';


angular.module('betterTimetable')
    .controller('LoginCtrl', function ($scope, AuthRsc, AuthSrv) {

        $scope.user = {
            rememberMe : true
        };

        $scope.login = function () {
            var credentials = {
                email: $scope.user.email,
                password: $scope.user.password
            }
            AuthRsc.login(credentials, function(){
                AuthSrv.isAuthenticated();
            }, function(){
                Materialize.toast('Error! Try again.', 4000);
                return;
            })
        }

    });
