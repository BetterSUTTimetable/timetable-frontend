angular.module('betterTimetable').factory('RootCategoriesRsc', function($resource, $rootScope) {
    return $resource($rootScope.url + '/categories', {
    });
  });