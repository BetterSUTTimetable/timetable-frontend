'use strict';


angular.module('betterTimetable')
    .controller('CustomTimetableCtrl', function ($scope, TimetableRsc, $routeParams, DataTimeSrv,
                                                 $uibModal, CourseProcessorSrv) {
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
                CourseProcessorSrv.processCourses(courses, $scope);
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
            _weekOffset += 1;
            _getTimetable();
        }

        $scope.getPreviousWeek = function () {
            _weekOffset -= 1;
            _getTimetable();
        }

        $scope.getDetails = function (selectedCourse) {

            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/modals/filter.html',
                controller: 'FilterCtrl',
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

            if ($chip.length) {
                var selected = $chip.hasClass('selected');

                if (!selected) {
                    var data = $('.chips-initial').material_chip('data');
                    var selectedChip = data[$chip.index()];
                    var week = DataTimeSrv.getWeekInterval(_weekOffset);

                    TimetableRsc.getCourse({id: selectedChip.customId, from : week.begining, to :  week.end}, function(data){
                        $scope.currentWeek = week.begining.getDate() + "." + (week.begining.getMonth() + 1 ) + " - "+  week.end.getDate() + "." + (week.end.getMonth() + 1 );
                        courses = data;
                        CourseProcessorSrv.processCourses(courses, $scope);
                    }, function () {
                        Materialize.toast('We couldn\'t load this timetable. Please try again', 4000);
                    });

                } else {
                    _getTimetable();
                }
            }

        });

        _getUserCategory();
        _getTimetable();
    });
