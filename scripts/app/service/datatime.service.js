
angular.module('betterTimetable')
    .factory('DataTimeSrv', function() {

        var _dayName = {
            0 : "Poniedziałek",
            1 : "Wtorek",
            2 : "Środa",
            3 : "Czwartek",
            4 : "Piątek",
            5 : "Sobota",
            6 : "Niedziela"
        }

        var _dayProps = {};

        Date.prototype.addDays = function(days) {
            var dat = new Date(this.valueOf());
            dat.setDate(dat.getDate() + days);
            return dat;
        }

        var _getBeginingOfWeek = function(){
            var today = new Date();
            //0 - SUNDAY
            var dayNumber = today.getDay();

            if(dayNumber == 1) { //IS MONDAY
                today.setHours( 0, 0, 0, 0 );
                return today;
            }


            var diff = dayNumber == 0 ? 6 : (dayNumber - 1);

            var begining = new Date();
            begining.setDate(begining.getDate() - diff);
            begining.setHours( 0, 0, 0, 0 );
            return begining
        }

        var _getWeekInternal = function(weekOffset){
            var begining =  _getBeginingOfWeek();
            var end = new Date();
            end.setDate(begining.getDate() + 6);
            end.setHours(23, 59, 59, 0 );

            if(weekOffset !== null && weekOffset !== undefined){
                begining = begining.addDays(weekOffset * 7)
                end = end.addDays(weekOffset * 7);
            }
            return {
                begining : begining,
                end : end
            }
        }

        var _getDayNumber = function(timestamp){

            var date = new Date(1970, 0, 1); //reset
            date.setSeconds(timestamp);

            //0 - SUNDAY
            return date.getDay();
        }

        var _howManyQuarterOfHour = function (duration) {

            var quarteOfHour = 15;

            return duration / quarteOfHour;
        }

        var _getCourseTime = function(courseDate){

            if(courseDate == undefined || courseDate == null)
                return undefined;

            var courseBeginning = new Date(1970, 0, 1);
            courseBeginning.setHours(courseDate.getHours(), courseDate.getMinutes(), 0, 0);

            return courseBeginning;
        }

        var _getCourseDataTime = function(course){
            if(course == undefined || course == null)
                return undefined;

            var courseTime = new Date(1970, 0, 1); //reset
            courseTime.setSeconds(course.beginTime.epochSecond + 3600);
            return courseTime;
        }

        var _getDayBeginning = function (date) {
            if(date == undefined || date == null)
                return undefined;

            var day = new Date(date);
            day.setHours(_dayProps.dayBeginning.getHours(), _dayProps.dayBeginning.getMinutes(), 0, 0);
            return day;
        }

        var _initDayProps = function(){
            var _dayBeginning = new Date(1970, 0, 1);
            _dayBeginning.setHours(7, 0, 0, 0);

            var _dayEnd = new Date(1970, 0, 1);
            _dayEnd.setHours(23, 0, 0, 0);

            var diffInMili = _dayEnd - _dayBeginning;
            var _quarterOfHourWithinDay = (diffInMili / 1000 / 60 / 60) * 4;

            _dayProps.dayBeginning = _dayBeginning;
            _dayProps.dayEnd = _dayEnd;
            _dayProps.quartersWithinDay = _quarterOfHourWithinDay;
            _dayProps.secondsInQuarter = 15 * 60;
            _dayProps.daysWithinWeek = 7;
        }

        _initDayProps();

        return {
            getWeekInterval : _getWeekInternal,
            getDayNumber : _getDayNumber,
            howManyQuarterOfHour : _howManyQuarterOfHour,
            getCourseTime : _getCourseTime,
            getCourseDataTime : _getCourseDataTime,
            getDayBeginning : _getDayBeginning,
            getDayProps : function () {
                return _dayProps;
            },
            getDayName : function (index) {
                if(index < 0 || index > 7)
                    return undefined;

                return _dayName[index];
            }
        }
});