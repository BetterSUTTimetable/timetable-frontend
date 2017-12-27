'use strict';


angular.module('betterTimetable')
    .controller('TimetableCtrl', function ($scope, CustomRsc, TimetableRsc, $routeParams, DataTimeSrv,
                                           CourseSorterSrv, CourseTemplateSrv, $uibModal) {

        $scope.errorOccurs = false;
        var _weekOffset = 0;

        var _processCourses = function(courses){
            var courses = CourseSorterSrv.groupAndSort(courses);
            CourseTemplateSrv.setTimetableGrid(courses);

            for(var i = 0; i < 7; i++){ //days //courses.length

                if(courses[i] === null || courses[i] === undefined){
                    continue;
                }

                for(var j = 0; j < courses[i].length; j++){ //courses

                    if(!CourseTemplateSrv.isEmpty(courses[i][j])) {

                        var lastWithinDay = j === (courses[i].length - 1);
                        CourseTemplateSrv.selectProperRow(courses[i][j], i, lastWithinDay, $scope);
                    }
                }
            }
        }

        var _getTimetable = function(){
            var week = DataTimeSrv.getWeekInterval(_weekOffset);

            TimetableRsc.getCourse({id: $routeParams.id, from : week.begining, to :  week.end}, function(data){
                $scope.currentWeek = week.begining.getDate() + "." + (week.begining.getMonth() + 1 ) + " - "+  week.end.getDate() + "." + (week.end.getMonth() + 1 );
                _processCourses(data);
            }, function (error) {
                console.log(error);
                $scope.errorOccurs = true;
            });
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

        $scope.getNextWeek = function () {
            _weekOffset += 1;
            _getTimetable();
        }

        $scope.getPreviousWeek = function () {
            _weekOffset -= 1;
            _getTimetable();
        }

        _getTimetable();
    });
