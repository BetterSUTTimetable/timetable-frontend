
angular.module('betterTimetable').factory('RegisterRsc', function($resource, URL) {
    return $resource(URL + '/users', {}, {
        'user' : {
            method: 'POST'
        }
    });
});