
angular.module('betterTimetable').factory('RegisterRsc', function($resource, $rootScope) {
    return $resource($rootScope.url + '/users', {}, {
        'user' : {
            method: 'POST'
        }
    });
});