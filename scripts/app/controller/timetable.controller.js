'use strict';


angular.module('betterTimetable')
    .controller('TimetableCtrl', function ($scope, CustomRsc, TimetableRsc, $routeParams, DataTimeSrv,
                                           CourseSorterSrv, CourseTemplateSrv, $uibModal) {

        $scope.errorOccurs = false;
        var _weekOffset = 0;
        var courses = [];

        var _processCourses = function(courses){
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

        var _getTimetable = function(){
            var week = DataTimeSrv.getWeekInterval(_weekOffset);

            TimetableRsc.getCourse({id: $routeParams.id, from : week.begining, to :  week.end}, function(data){
                $scope.currentWeek = week.begining.getDate() + "." + (week.begining.getMonth() + 1 ) + " - "+  week.end.getDate() + "." + (week.end.getMonth() + 1 );
                courses = data;
                _processCourses(courses);
            }, function (error) {
                console.log(error);
                $scope.errorOccurs = true;
                Materialize.toast('We couldn\'t load this timetable. Please try again', 4000);
            });
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

        $scope.getDetails = function (selectedCourse) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/courseDetails.html',
                controller: 'CourseDetailsCtrl',
                size: 'modal-lg',
                resolve: {
                    course: function () {
                        return selectedCourse;
                    }
                }
            });

            modalInstance.result.then(function (course) {
                console.log(course);
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        }

        $scope.hide = function(selectedCourse){
            var id = selectedCourse.id;
            courses.forEach(function (course) {
                if(course.id === id){
                    course.hidden = true;
                }
            });
            _processCourses(courses);
        }

        $scope.showAll = function(){
            courses.forEach(function (course) {
                course.hidden = false;
            });
            _processCourses(courses);
        }

        $scope.getNextWeek = function () {
            _weekOffset += 1;
            _getTimetable();
        }

        $scope.getPreviousWeek = function () {
            _weekOffset -= 1;
            _getTimetable();
        }

        $scope.addAll = function () {
            Materialize.toast('Function not implemented', 4000);
        }

        _getTimetable();
    });
