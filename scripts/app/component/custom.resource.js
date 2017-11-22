
angular.module('betterTimetable').factory('CustomRsc', function($resource, $rootScope) {
    return $resource($rootScope.url + '/users/me', {}, { //only for testing purpose
        'isAuthenticated' : {
            method: 'GET'
        }
    });
});