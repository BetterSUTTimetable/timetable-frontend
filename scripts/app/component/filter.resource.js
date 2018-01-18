
angular.module('betterTimetable').factory('FilterRsc', function($resource, URL) {
    return $resource(URL + '/filters', {}, {
        'addFilter' : {
            method: 'POST'
        },
        'getFilters' : {
            url: URL +'/filters',            
            method : 'GET',
            isArray : true            
        },
        'removeFilter' : {
            url: URL + '/filter/:id',
            id: '@id',
            method: 'DELETE'
        }
    });
});