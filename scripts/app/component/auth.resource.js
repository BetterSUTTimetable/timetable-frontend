
angular.module('betterTimetable').factory('AuthRsc', function($resource, $rootScope, URL) {
    return $resource(URL, {}, {
        'login' : {
            url: URL + '/login',
            method: 'POST'
        },
        'isAuthenticate' : {
            url: URL + '/user/me',
            method: 'GET'
        },
        'logout' : {
            url: URL + '/logout',
            method: 'GET'
        }
    });
});