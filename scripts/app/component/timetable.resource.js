
angular.module('betterTimetable').factory('TimetableRsc', function($resource, $rootScope) {
    return $resource($rootScope.url + '/category/{id}/courses', {}, { //only for testing purpose
        'getCourse' : {
            url: $rootScope.url +'/category/:id/courses',
            id: '@id',
            method: 'GET',
            isArray : true
        },
        'selectCategory' : {
            url: $rootScope.url + '/selected_categories',
            method: 'POST'
        },
        'getUserTimetable' : {
            url: $rootScope.url + '/courses',
            method: 'GET',
            isArray : true
        },
        'getUserCategory' : {
            url: $rootScope.url + '/selected_categories',
            method: 'GET',
            isArray : true
        },
        'removeCategory' : {
            url: $rootScope.url + '/selected_category/:categoryId',
            categoryId: '@categoryId',
            method: 'DELETE'
        },
        'getIntervals' : {
            url: $rootScope.url + '/week_intervals',
            method: 'GET'
        }
    });
});