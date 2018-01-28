angular.module('betterTimetable')
    .controller('FilterCtrl', function (CourseDetailsSrv, $scope, UISrv, TimetableRsc, FilterRsc, $rootScope) {

        var _labels = {
            'Exercises': "Ćwiczenia",
            'Laboratory': "Laboratorium",
            'Lecture': "Wykład",
            'Unknown': "Inne",
            'Project' : "Projekt",
            'Seminar' : "Seminarium"
        }
        $scope.course = CourseDetailsSrv.get();

        $scope.getLabel = function(){
            return _labels[$scope.course.courseType];
        }

        $scope.getLabelColor = function(){
            return UISrv.getColor($scope.course);
        }

        $scope.getHours = function(){
            if($scope.course.beginTime !== null && $scope.course.duration !== null) {
                var begin = $scope.course.beginTime.epochSecond;
                var duration = $scope.course.duration.seconds;

                var beginCourseDate = new Date(1970, 0, 1); //reset
                beginCourseDate.setSeconds(begin + 3600);

                var startTxt = beginCourseDate.getHours() + ":" + (beginCourseDate.getMinutes() === 0 ? "00" : beginCourseDate.getMinutes());
                var end = new Date(beginCourseDate);
                end.setTime(beginCourseDate.getTime() + ($scope.course.duration.seconds * 1000));
                var endTxt = end.getHours() + ":" + (end.getMinutes() === 0 ? "00" : end.getMinutes());

                return startTxt + " - " + endTxt;
            }
        }

        $scope.getLecturers = function(){
            var lecturers = "";
            if($scope.course.lecturers !== null && $scope.course.lecturers !== undefined && $scope.course.lecturers.length > 0) {
                $scope.course.lecturers.forEach(function (currentValue, index) {

                    if (index < $scope.course.lecturers.length - 1) {
                        lecturers += currentValue.fullName + ", ";
                    } else {
                        lecturers += currentValue.fullName;
                    }
                })
            }
            return lecturers;
        }

        $scope.getRooms = function(){
            var rooms = "";
            if($scope.course.classrooms !== null && $scope.course.classrooms !== undefined && $scope.course.classrooms.length > 0) {
                $scope.course.classrooms.forEach(function (currentValue, index) {

                    if (index < $scope.course.classrooms.length - 1) {
                        rooms += currentValue.room + ", ";
                    } else {
                        rooms += currentValue.room;
                    }
                })
            }

            return rooms;
        }
        
        var _getIntervals = function () {
            TimetableRsc.getIntervals({}, function (data) {
                $scope.intervals = data;
                angular.element(document).ready(function () {
                    $('select').material_select();
                });
            })
        }

        $scope.filter = function (interval) {
            var data = {
                "courseId": $scope.course.id,
                "week": interval
            }

            FilterRsc.addFilter(data, function () {
                Materialize.toast('Success', 4000);
                $rootScope.$broadcast('filterHasChanged');
                $('#courseFilterModal').modal('close');
            }, function () {
                Materialize.toast('Error! Try again.', 8000);
            })

        };

        $scope.remove = function () {            
            $('#courseFilterModal').modal('close');
        };

        $scope.cancel = function () {
            $('#courseFilterModal').modal('close');
        };

        $scope.getIntervalValue = function (index) {
            return Object.keys($scope.intervals)[index];
        }

        _getIntervals();
    });