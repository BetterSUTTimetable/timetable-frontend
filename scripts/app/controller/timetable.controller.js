'use strict';


angular.module('betterTimetable')
    .controller('TimetableCtrl', function ($scope, CustomRsc, TimetableRsc, $routeParams, DataTimeSrv, CourseSorterSrv, CourseTemplateSrv) {

        $scope.errorOccurs = false;

        var week = DataTimeSrv.getWeekInterval();

        TimetableRsc.getCourse({id: $routeParams.id, from : week.begining, to :  week.end}, function(data){
            _processCourses(data);
        }, function (error) {
            console.log(error);
            $scope.errorOccurs = true;
        });

        var _processCourses = function(courses){
            var courses = CourseSorterSrv.groupAndSort(courses);
            CourseTemplateSrv.setTimetableGrid(courses);

            for(var i = 0; i < courses.length; i++){

                for(var j = 0; j < courses[i].length; j++){

                    if(!CourseTemplateSrv.isEmpty(courses[i][j])) {
                        CourseTemplateSrv.selectProperRow(courses[i][j], i);
                    }
                }
            }
        }
    });
