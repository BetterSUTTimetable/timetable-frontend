
angular.module('betterTimetable')
    .factory('DataTimeSrv', function() {

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
            begining.setDate(begining.getDate() - diff - 1);
            begining.setHours( 0, 0, 0, 0 );
            return begining
        }

        var _getWeekInternal = function(){
            var begining =  _getBeginingOfWeek();
            var end = new Date();
            end.setDate(begining.getDate() + 6);
            end.setHours(23, 59, 59, 0 );
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

        return {
            getWeekInterval : _getWeekInternal,
            getDayNumber : _getDayNumber,
            howManyQuarterOfHour : _howManyQuarterOfHour
        }
});