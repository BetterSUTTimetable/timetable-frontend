'use strict';


angular.module('betterTimetable')
    .controller('TimetableCtrl', function ($scope, TimetableRsc, $routeParams, DataTimeSrv,
                                           CourseSorterSrv, CourseTemplateSrv, CourseProcessorSrv, CourseDetailsSrv) {
        $scope.errorOccurs = false;
        var _weekOffset = 0;
        var courses = [];

        var _getTimetable = function(){
            var week = DataTimeSrv.getWeekInterval(_weekOffset);

            TimetableRsc.getCourse({id: $routeParams.id, from : week.begining, to :  week.end}, function(data){
                $scope.currentWeek = week.begining.getDate() + "." + (week.begining.getMonth() + 1 ) + " - "+  week.end.getDate() + "." + (week.end.getMonth() + 1 );
                courses = data;
                CourseProcessorSrv.processCourses(courses, $scope);
            }, function (error) {
                console.log(error);
                $scope.errorOccurs = true;
                Materialize.toast('We couldn\'t load this timetable. Please try again', 4000);
            });
        }

        $scope.getDetails = function (selectedCourse) {
            CourseDetailsSrv.displayDetails(selectedCourse, $scope);
        }

        $scope.hide = function (selectedCourse) {
            CourseProcessorSrv.hide(selectedCourse, courses, $scope);
        }

        $scope.showAll = function(){
            CourseProcessorSrv.showAll(courses, $scope);
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
            TimetableRsc.selectCategory($routeParams.id, function(){
                Materialize.toast('Success', 4000);
            }, function () {
                Materialize.toast('Error. Please try again', 8000);
            });
        }

        _getTimetable();
    });
