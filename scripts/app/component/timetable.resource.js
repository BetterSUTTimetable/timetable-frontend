
angular.module('betterTimetable').factory('TimetableRsc', function($resource, URL) {
    return $resource(URL + '/category/{id}/courses', {}, {
        'getCourse' : {
            url: URL +'/category/:id/courses',
            id: '@id',
            method: 'GET',
            isArray : true
        },
        'selectCategory' : {
            url: URL + '/selected_categories',
            method: 'POST'
        },
        'getUserTimetable' : {
            url: URL + '/courses',
            method: 'GET',
            isArray : true
        },
        'getUserCategory' : {
            url: URL + '/selected_categories',
            method: 'GET',
            isArray : true
        },
        'removeCategory' : {
            url: URL + '/selected_category/:categoryId',
            categoryId: '@categoryId',
            method: 'DELETE'
        },
        'getIntervals' : {
            url: URL + '/week_intervals',
            method: 'GET'
        }
    });
});