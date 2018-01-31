'use strict';


angular.module('betterTimetable')
    .controller('CustomTimetableCtrl', function ($scope, TimetableRsc, $routeParams, DataTimeSrv,
                                                 CourseProcessorSrv, CourseDetailsSrv, $rootScope, $window) {
        var courses = [];
        var _weekOffset = 0;
        $('.chips').material_chip();

        var _getUserCategory = function () {
            TimetableRsc.getUserCategory(function (data) {

                var categories = [];
                data.forEach(function (cat) {
                    categories.push({tag : cat.name, customId: cat.id});
                })

                $('.chips-initial').material_chip({ "data" : categories});

                _disableChips();

            }, function () {
                Materialize.toast('We couldn\'t load your selected categories. Please try again', 4000);
            });
        }

        var _getTimetable = function(){
            var week = DataTimeSrv.getWeekInterval(_weekOffset);

            TimetableRsc.getUserTimetable({from : week.begining, to :  week.end}, function(data){
                $scope.currentWeek = week.begining.getDate() + "." + (week.begining.getMonth() + 1 ) + " - "+  week.end.getDate() + "." + (week.end.getMonth() + 1 );
                courses = data;
                CourseProcessorSrv.processCourses(courses.slice(), $scope); //passing courses as a copy
            }, function (error) {
                console.log(error);
                $scope.errorOccurs = true;
                Materialize.toast('We couldn\'t load this timetable. Please try again', 4000);
            });
        }

        var _disableChips = function () {
            var chips = $('.chips');
            chips.find("input").remove();
        }

        $scope.hide = function (selectedCourse) {
            CourseProcessorSrv.hide(selectedCourse, courses, $scope);
        }

        $scope.showAll = function(){
            CourseProcessorSrv.showAll(courses, $scope);
        }

        $scope.getNextWeek = function () {
            $('.chip').removeClass('selected');
            _weekOffset += 1;
            _getTimetable();
        }

        $scope.getPreviousWeek = function () {
            $('.chip').removeClass('selected');
            _weekOffset -= 1;
            _getTimetable();
        }

        $scope.getDetails = function (selectedCourse) {
            CourseDetailsSrv.displayDetailsWithFilter(selectedCourse, $scope);
        }


        $('.chips').on('chip.delete', function(e, chip){

            TimetableRsc.removeCategory({categoryId: chip.customId}, function () {
                _getTimetable();
                Materialize.toast('Success', 4000);
            }, function () {
                Materialize.toast('Error. Please try again', 8000);
            })

        });


        $('.chips').on('click.chips-select', function(e, chip){
            var $chip = $(e.target);

            if ($chip.length && $chip.hasClass('chip')) {
                var selected = $chip.hasClass('selected');

                if (!selected) {
                    var data = $('.chips-initial').material_chip('data');
                    var selectedChip = data[$chip.index()];
                    var week = DataTimeSrv.getWeekInterval(_weekOffset);

                    TimetableRsc.getCourse({id: selectedChip.customId, from : week.begining, to :  week.end}, function(data){
                        $scope.currentWeek = week.begining.getDate() + "." + (week.begining.getMonth() + 1 ) + " - "+  week.end.getDate() + "." + (week.end.getMonth() + 1 );
                        courses = data;
                        CourseProcessorSrv.processCourses(courses.slice(), $scope); //passing courses as a copy
                    }, function () {
                        Materialize.toast('We couldn\'t load this timetable. Please try again', 4000);
                    });

                } else {
                    _getTimetable();
                }
            }

        });

        $rootScope.$on('filterHasChanged', function(event, args) {
            _getTimetable();
        });

        angular.element($window).bind('resize', function () {
            CourseProcessorSrv.processCourses(courses.slice(), $scope); //passing courses as a copy
        });

        _getUserCategory();
        _getTimetable();
    });
