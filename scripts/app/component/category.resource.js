
angular.module('betterTimetable').factory('CategoryRsc', function($resource, $rootScope) {
  return $resource($rootScope.url + '/category/:id', {id: "@id"}, {
    });
});  
