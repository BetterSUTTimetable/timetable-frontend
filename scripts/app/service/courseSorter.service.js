
angular.module('betterTimetable')
    .factory('CourseSorterSrv', function(DataTimeSrv) {

        var _groupAndSort = function (data) {

            if(data === undefined || data === null || data.length === 0){
                return;
            }
            var courses = [];

            for (var i = 0; i < data.length; i++){
                var processingCourse = data[i];

                var dayNumber = DataTimeSrv.getDayNumber(processingCourse.beginTime.epochSecond);
                var europeanDayNumber = dayNumber === 0 ? 6 : (dayNumber - 1);
                if(courses[europeanDayNumber] === null || courses[europeanDayNumber] === undefined){
                    courses[europeanDayNumber] = [];
                }
                courses[europeanDayNumber].push(processingCourse);
                //console.log(dayNumber);
            }

            console.log(courses);
            return courses;

        }

        return {
            groupAndSort : _groupAndSort
        }
    });