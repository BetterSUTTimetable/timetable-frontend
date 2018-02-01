
angular.module('betterTimetable')
    .factory('CourseProcessorSrv', function(CourseSorterSrv, CourseTemplateSrv, DataTimeSrv, UISrv) {

        var _dayProps = DataTimeSrv.getDayProps();

        var _processCourses = function(courses, $scope){

            if(courses == null || courses == undefined || courses.length == 0){
                var timetable = $("#timetable");
                timetable.empty();
                return;
            }

            var courses = CourseSorterSrv.groupAndSort(courses);
            CourseTemplateSrv.setTimetableGrid(courses);

            var theLast = _latestClassWithinWeek(courses);
            var theFirst = _firstWithinWeek(courses);

            for(var i = 0; i < _dayProps.daysWithinWeek; i++) {

                if (courses[i] === null || courses[i] === undefined) {
                    continue;
                }

                for (var j = 0; j < courses[i].length; j++) {

                    if (!CourseTemplateSrv.isEmpty(courses[i][j])) {

                        var processingCourse = courses[i][j];
                        //var lastWithinDay = _isLastWithinDay(courses[i], j, processingCourse);
                        var lastWithinDay = j === courses[i].length - 1 ? true : false;
                        CourseTemplateSrv.selectProperRow(processingCourse, i, lastWithinDay, $scope, theFirst, theLast);
                    }
                }
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

        var _latestClassWithinWeek = function(courses){

            var time = {
                hours : 0,
                minutes : 0
            }
            var theLastest = undefined;

            for(var i = 0; i < _dayProps.daysWithinWeek; i++){ //days

                if(courses[i] === null || courses[i] === undefined){
                    continue;
                }

                for(var j = 0; j < courses[i].length; j++){

                    var date = new Date(1970, 0, 1);
                    date.setSeconds(courses[i][j].beginTime.epochSecond + courses[i][j].duration.seconds)

                    var hours = date.getHours();
                    var minutes = date.getMinutes();

                    if((hours > time.hours || (hours == time.hours && minutes >= time.minutes)) && !courses[i][j].hidden){
                        time.hours = hours;
                        time.minutes = minutes;
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

            for(var i = 0; i < _dayProps.daysWithinWeek; i++){

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