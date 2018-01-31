
angular.module('betterTimetable')
    .factory('CourseProcessorSrv', function(CourseSorterSrv, CourseTemplateSrv, MAX_MOBILE_WIDTH) {

        var mM = window['matchMedia'] || window['msMatchMedia'];

        var _processCourses = function(courses, $scope){

            if(courses == null || courses == undefined || courses == [])
                return;

            var courses = CourseSorterSrv.groupAndSort(courses);
            CourseTemplateSrv.setTimetableGrid(courses);

            var theLastest = _latestClassWithinWeek(courses);
            var theFirst = _firstWithinWeek(courses);

            for(var i = 0; i < 7; i++){

                if(courses[i] === null || courses[i] === undefined){
                    continue;
                }

                for(var j = 0; j < courses[i].length; j++){

                    if(!CourseTemplateSrv.isEmpty(courses[i][j])) {

                        var processingCourse = courses[i][j];
                        var lastWithinDay = _isLastWithinDay(courses[i], j, processingCourse);
                        CourseTemplateSrv.selectProperRow(processingCourse, i, lastWithinDay, $scope, theFirst, theLastest);
                    }
                }
            }

            for(var i = 0; i < 7; i ++){

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

        var _latestClassWithinWeek = function(courses){

            var time = {
                hours : 0,
                minutes : 0
            }
            var theLastest = undefined;

            for(var i = 0; i < 7; i++){ //days

                if(courses[i] === null || courses[i] === undefined){
                    continue;
                }

                for(var j = 0; j < courses[i].length; j++){

                    var date = new Date(1970, 0, 1);
                    date.setSeconds(courses[i][j].beginTime.epochSecond + courses[i][j].duration.seconds)

                    var hours = date.getHours();
                    var minutes = date.getMinutes();

                    if(hours >= time.hours && minutes >= time.minutes && !courses[i][j].hidden){
                        time.hours = hours;
                        time.miutes = minutes;
                        theLastest = courses[i][j];
                    }
                }
            }

            return theLastest;
        }

        var _firstWithinWeek = function(courses){

            var time = {
                hours : 23,
                minutes : 59
            }
            var theFirst = undefined;

            for(var i = 0; i < 7; i++){ //days

                if(courses[i] === null || courses[i] === undefined){
                    continue;
                }

                for(var j = 0; j < courses[i].length; j++){

                    var date = new Date(1970, 0, 1);
                    date.setSeconds(courses[i][j].beginTime.epochSecond)

                    var hours = date.getHours();
                    var minutes = date.getMinutes();

                    if((hours < time.hours || (hours == time.hours && minutes <= time.minutes)) && !courses[i][j].hidden){
                        theFirst = courses[i][j];
                        time.hours = hours;
                        time.minutes = minutes;
                    }
                }
            }

            return theFirst;
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