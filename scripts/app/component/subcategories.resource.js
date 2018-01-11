angular.module('betterTimetable').factory('SubcategoriesRsc', function($resource, URL) {
    return $resource(URL + '/category/:id/subcategories', { id: '@id' })
  });