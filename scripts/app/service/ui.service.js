
angular.module('betterTimetable')
    .factory('UISrv', function(MAX_MOBILE_WIDTH) {

        var mM = window['matchMedia'] || window['msMatchMedia'];

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

        var _maxMedia = function(feature, unit, init, step) {
            if (typeof init != 'number') init = 0;
            if (!mM) return init;
            if (typeof unit != 'string') unit = '';
            if (typeof step != 'number') step = 1;
            while (mM.call(window, '(' + feature + ':' + (init+=step) + unit + ')')['matches']) {}
            return init-step;
        }

        var _isMobile = function(){
            var maxMedia = _maxMedia('min-width', 'px');
            var mobile = maxMedia <= MAX_MOBILE_WIDTH ? true : false;
            return mobile;
        }


        return {
            getColor : _getColor,
            isMobile: _isMobile,
            getGridProps : function () {
                return _grid;
            },
            getMaxSubString : function () {
                return _maxSubString;
            }
        }
    });