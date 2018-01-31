
angular.module('betterTimetable')
    .factory('UISrv', function() {

        var _courseTypeColors = {
            'Exercises': "amber",
            'Laboratory': "light-green",
            'Lecture': "red",
            'Unknown': "blue",
            'Project' : "pink",
            'Seminar' : "deep-purple lighten-1"
        }

        var _grid = {
            columnNumber : 12,
            offset : 2
        }

        var _maxSubString = 13;

        var _getColor = function(params){

            if(params.courseType !== undefined && params.courseType !== null){
                return _courseTypeColors[params.courseType];
            } else {
                return undefined;
            }

        }

        return {
            getColor : _getColor,
            getGridProps : function () {
                return _grid;
            },
            getMaxSubString : function () {
                return _maxSubString;
            }
        }
    });