
angular.module('betterTimetable')
    .factory('CourseProcessorSrv', function(CourseSorterSrv, CourseTemplateSrv, MAX_MOBILE_WIDTH) {

        var mM = window['matchMedia'] || window['msMatchMedia'];


        var _processCourses = function(courses, $scope){
            var courses = CourseSorterSrv.groupAndSort(courses);
            CourseTemplateSrv.setTimetableGrid(courses);

            var theLastest = _theLatestClassWithinWeek(courses);
            console.log(theLastest);

            for(var i = 0; i < 7; i++){

                if(courses[i] === null || courses[i] === undefined){
                    continue;
                }

                for(var j = 0; j < courses[i].length; j++){

                    if(!CourseTemplateSrv.isEmpty(courses[i][j])) {

                        var processingCourse = courses[i][j];
                        var lastWithinDay = _isLastWithinDay(courses[i], j, processingCourse);
                        CourseTemplateSrv.selectProperRow(processingCourse, i, lastWithinDay, $scope);
                    }
                }
            }

            var maxMedia = _maxMedia('min-width', 'px');
            var mobile = maxMedia <= MAX_MOBILE_WIDTH ? true : false;
            if(mobile){
                CourseTemplateSrv.resetStartingCells();
            }
        }

        var _isLastWithinDay = function (dayCourses, index, processingCourse) {
            var processingCourseEndTime = processingCourse.beginTime.epochSecond + processingCourse.duration.seconds;
            var isLast = true;

            dayCourses.forEach(function (course) {
                var endTime = course.beginTime.epochSecond + course.duration.seconds;
                if(endTime > processingCourseEndTime && !course.hidden){
                    isLast = false;
                }
            });

            return isLast;
        }

        var _maxMedia = function(feature, unit, init, step) {
            if (typeof init != 'number') init = 0;
            if (!mM) return init;
            if (typeof unit != 'string') unit = '';
            if (typeof step != 'number') step = 1;
            while (mM.call(window, '(' + feature + ':' + (init+=step) + unit + ')')['matches']) {}
            return init-step;
        }

        var _theLatestClassWithinWeek = function(courses){

            var time = 0;
            var theLastest = undefined;

            for(var i = 0; i < 7; i++){

                if(courses[i] === null || courses[i] === undefined){
                    continue;
                }

                for(var j = 0; j < courses[i].length; j++){

                    var processingTime = courses[i][j].beginTime.epochSecond + courses[i][j].duration.seconds;
                    if(processingTime > time){
                        time = processingTime;
                        theLastest = courses[i][j];
                    }
                }
            }

            return theLastest;
        }

        var _hide = function(selectedCourse, courses, $scope){
            var id = selectedCourse.id;
            courses.forEach(function (course) {
                if(course.id === id){
                    course.hidden = true;
                }
            });
            _processCourses(courses, $scope);
        }

        var _showAll = function(courses, $scope){
            if(courses == null || courses == undefined || courses.length == 0)
                return;

            courses.forEach(function (course) {
                course.hidden = false;
            });
            _processCourses(courses, $scope);
        }

        return {
            processCourses : _processCourses,
            isLastWithinDay : _isLastWithinDay,
            hide : _hide,
            showAll : _showAll
        }
    });