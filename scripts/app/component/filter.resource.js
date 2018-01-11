
angular.module('betterTimetable').factory('FilterRsc', function($resource, $rootScope) {
    return $resource($rootScope.url + '/filters', {}, { //only for testing purpose
        'addFilter' : {
            method: 'POST'
        }
    });
});