angular.module('betterTimetable').factory('RootCategoriesRsc', function($resource, URL) {
    return $resource(URL + '/categories', {
    });
  });