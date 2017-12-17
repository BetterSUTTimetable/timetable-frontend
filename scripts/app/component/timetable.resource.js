
angular.module('betterTimetable').factory('TimetableRsc', function($resource, $rootScope) {
    return $resource($rootScope.url + '/category/{id}/courses', {}, { //only for testing purpose
        'getCourse' : {
            url: $rootScope.url +'/category/:id/courses',
            id: '@id',
            method: 'GET',
            isArray : true
        }
    });
});