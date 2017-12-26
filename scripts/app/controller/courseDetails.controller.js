angular.module('betterTimetable')
    .controller('CourseDetailsCtrl', function ($uibModalInstance, course, $scope, UISrv) {

    var _labels = {
        'Exercises': "Ćwiczenia",
        'Laboratory': "Laboratorium",
        'Lecture': "Wykład",
        'Unknown': "Inne",
        'Project' : "Projekt",
        'Seminar' : "Seminarium"
    }
    $scope.course = course;

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
            end.setTime(beginCourseDate.getTime() + (course.duration.seconds * 1000));
            var endTxt = end.getHours() + ":" + (end.getMinutes() === 0 ? "00" : end.getMinutes());

            return startTxt + " - " + endTxt;
        }
    }

    $scope.getLecturers = function(){
        var lecturers = "";
        if($scope.course.lecturers !== null && $scope.course.lecturers !== undefined && $scope.course.lecturers.length > 0) {
            $scope.course.lecturers.forEach(function (currentValue, index) {

                if (index < course.lecturers.length - 1) {
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

                if (index < course.classrooms.length - 1) {
                    rooms += currentValue.room + ", ";
                } else {
                    rooms += currentValue.room;
                }
            })
        }

        return rooms;
    }

    $scope.addToTimetable = function () {
        Materialize.toast('Error! Method not implemented', 4000);
        $uibModalInstance.close($scope.course);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});