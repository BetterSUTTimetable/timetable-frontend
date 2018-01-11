
angular.module('betterTimetable').factory('CategoryRsc', function($resource, URL) {
  return $resource(URL + '/category/:id', {id: "@id"}, {
    });
});  
