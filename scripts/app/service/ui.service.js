
angular.module('betterTimetable')
    .factory('UISrv', function() {

        var _courseTypeColors = {
            'Exercises': "amber",
            'Laboratory': "light-green",
            'Lecture': "red",
            'Unknown': "blue"
        }

        var _getColor = function(params){

            if(params.courseType !== undefined && params.courseType !== null){
                return _courseTypeColors[params.courseType];
            } else {
                return undefined;
            }

        }

        return {
            getColor : _getColor
        }
    });