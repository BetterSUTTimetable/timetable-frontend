
angular.module('betterTimetable').factory('FilterRsc', function($resource, URL) {
    return $resource(URL + '/filters', {}, {
        'addFilter' : {
            method: 'POST'
        },
        'get' : {
            method : 'GET'
        }
    });
});