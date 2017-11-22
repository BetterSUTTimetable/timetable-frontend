
angular.module('betterTimetable').factory('AuthRsc', function($resource, $rootScope) {
    return $resource($rootScope.url + '/login', {}, {
        'login' : {
            method: 'POST'
        }
    });
});