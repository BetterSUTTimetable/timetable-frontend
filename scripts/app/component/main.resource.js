
angular.module('betterTimetable').factory('MainRsc', function($resource) {
  return $resource('api/main', {}, {

  })
});