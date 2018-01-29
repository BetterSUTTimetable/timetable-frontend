angular.module('betterTimetable')
    .controller('FilterTableCtrl', function ($scope, FilterRsc,  UISrv,) {

        var _labels = {
            'Exercises': "Ćwiczenia",
            'Laboratory': "Laboratorium",
            'Lecture': "Wykład",
            'Unknown': "Inne",
            'Project' : "Projekt",
            'Seminar' : "Seminarium"
        }

        var _weeks = {
            'EvenWeek': "Parzysty",
            'OddWeek': "Nieparzysty"
        }

        var _days = {
            'MONDAY': "Poniedziałek",
            'TUESDAY': "Wtorek",
            'WEDNESDAY': "Środa",
            'THURSDAY': "Czwartek",
            'FRIDAY': "Piątek",
            'SATURDAY': "Sobota",
            'SUNDAY': "Niedziela"
        }

        var _getLabelColor = function(filter){
            return UISrv.getColor(filter);
        }

        $scope.getColor = function(id) {
            var filter =  $scope.filterColors.find(function (obj) { return obj.filterId === id; });
            return filter.color;
        }

        var _getFilters = function () {

            FilterRsc.getFilters(function (data) {

            $scope.filters = [];
            $scope.filterColors = [];

                data.forEach(function (filter) {

                    $scope.filters.push({
                        courseType: _labels[filter.courseType],
                        fullCourseName: filter.fullCourseName,
                        id: filter.id,
                        week: _weeks[filter.week],
                        dayOfWeek: _days[filter.dayOfWeek],
                        hours: _getHours(filter.time, filter.duration)
                    });

                    $scope.filterColors.push({
                        color: _getLabelColor(filter),
                        filterId: filter.id
                    })

                });
            }, function () {
                Materialize.toast('We couldn\'t load your selected filters. Please try again', 4000);
            });
        }

        $scope.remove = function (filterId) {
            FilterRsc.removeFilter({id: filterId}, function () {
                _getFilters();
                Materialize.toast('Success', 4000);
            }, function () {
                Materialize.toast('Error. Please try again', 8000);
            });
        }

        var _getHours = function(begin, duration){
            if(begin !== null && duration !== null) {

                var beginCourseDate = new Date(1970, 0, 1);
                beginCourseDate.setHours(begin.hour + 1);
                beginCourseDate.setMinutes(begin.minute);

                var startTxt = beginCourseDate.getHours() + ":" + (beginCourseDate.getMinutes() === 0 ? "00" : beginCourseDate.getMinutes());

                var end = new Date(beginCourseDate);
                end.setTime(beginCourseDate.getTime() + (duration.seconds * 1000));
                var endTxt = end.getHours() + ":" + (end.getMinutes() === 0 ? "00" : end.getMinutes());

                return startTxt + " - " + endTxt;
            }
        }

        _getFilters();
});
