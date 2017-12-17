angular.module('betterTimetable').factory('SubcategoriesRsc', function($resource, $rootScope) {
    return $resource($rootScope.url + '/category/:id/subcategories', { id: '@id' })
  });