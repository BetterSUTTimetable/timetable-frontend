
angular.module('betterTimetable')
    .factory('CourseProcessorSrv', function(CourseSorterSrv, CourseTemplateSrv) {

        var _processCourses = function(courses, $scope){
            var courses = CourseSorterSrv.groupAndSort(courses);
            CourseTemplateSrv.setTimetableGrid(courses);

            for(var i = 0; i < 7; i++){ //days //courses.length

                if(courses[i] === null || courses[i] === undefined){
                    continue;
                }

                for(var j = 0; j < courses[i].length; j++){ //courses

                    if(!CourseTemplateSrv.isEmpty(courses[i][j])) {

                        var processingCourse = courses[i][j];
                        var lastWithinDay = _isLastWithinDay(courses[i], j, processingCourse);
                        CourseTemplateSrv.selectProperRow(processingCourse, i, lastWithinDay, $scope);
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