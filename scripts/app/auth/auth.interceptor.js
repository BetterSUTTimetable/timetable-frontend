angular.module('betterTimetable')
    .factory('authExpiredInterceptor', function ($rootScope, $q, $injector, localStorageService, $location) {
        return {
            responseError: function (response) {
                // session has expired
                if (response.status === 401 ||  response.status === 403 || response.status === 419) {
                    if(localStorageService.get('isAuthenticated')){
                        localStorageService.remove('isAuthenticated');
                        Materialize.toast('Sorry, your session timed out', 4000);
                        $location.path("/login");
                    }
                }
                return $q.reject(response);
            }
        };
    });
