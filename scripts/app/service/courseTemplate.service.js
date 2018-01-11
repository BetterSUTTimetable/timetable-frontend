
angular.module('betterTimetable')
    .factory('CourseTemplateSrv', function(UISrv, $compile) {

        var _maxSubstring = 13;
        var _dayName = {
                0 : "Poniedziałek",
                1 : "Wtorek",
                2 : "Środa",
                3 : "Czwartek",
                4 : "Piątek",
                5 : "Sobota",
                6 : "Niedziela"
        }

        var _getHeader = function(dayNumber){
            return _dayName[dayNumber];
        }

        var _setTimetableGrid = function(groupedCourses){
            var timetable = $("#timetable");
            timetable.empty();

            var quarterOfHourWithinDay = 56;
            var howManyNotEmpty = _howManyNotEmpty(groupedCourses);

            var unusableSpace = 12 % howManyNotEmpty ;
            var dayWidth = (12 - unusableSpace) / howManyNotEmpty;
            var offset = Math.floor(unusableSpace / 2);

            for(var i = 0; i < 7; i++){

                var isEmpty = _isEmpty(groupedCourses[i]);
                if(isEmpty) {
                    continue;
                }

                var widthClass = "m" + dayWidth + " l" + dayWidth;
                var id = i;
                var column;
                if(i === 0 && offset !== 0){
                    widthClass += " offset-m" + offset + " offset-l" + offset;
                    column = $("<div id='" + id + "' class='col s12 " + widthClass + "'></div>");
                } else {
                    column = $("<div id='" + id + "' class='col s12 " + widthClass + "'></div>");
                }

                //ADD HEADER
                var header = _getHeader(i);
                column.append("<div class='row margin-top-10 center' ><b>" + header + "</b></div>");

                //ADD EMPTY CELL
                for(var j = 0; j < quarterOfHourWithinDay; j++){
                    column.append("<div class='row break reset-margin timetable'></br></div>");
                }
                timetable.append(column);
            }

        }

        var _selectProperRow = function(singleCourse, dayNumber, lastWithinDay, scope){
            if(singleCourse === undefined || singleCourse === null || singleCourse.hidden){
                return;
            }

            var begin = singleCourse.beginTime.epochSecond;
            var duration = singleCourse.duration.seconds;

            var beginCourseDate = new Date(1970, 0, 1); //reset
            beginCourseDate.setSeconds(begin + 3600);

            var beginDayDate = new Date(beginCourseDate);
            beginDayDate.setHours(7, 0, 0, 0);

            var diff = beginCourseDate - beginDayDate; //in mili

            var secondsInQuarter = 900;

            var howManyRowsToSelect = duration / secondsInQuarter;
            var offset = diff === 0 ? 0 :(diff / 1000 )/ secondsInQuarter;

            var dayColumn = $("#timetable").find("div#" + dayNumber);
            var dayRows = dayColumn.find("div.row.timetable");

            for(var i = offset; i < offset + howManyRowsToSelect; i++){

                //detect collision
                var collision = _detectCollision(dayRows[i]);

                if(i === offset + 1){
                    _setHeader(dayRows[i], singleCourse, scope);
                } else if (i === offset + 2) {
                    _setHours(dayRows[i], singleCourse, beginCourseDate, scope);
                } else if (i === offset + 3) {
                    _setRoom(dayRows[i], singleCourse, scope);
                } else if (i === offset + howManyRowsToSelect - 2) {
                    _setLecturers(dayRows[i], singleCourse, scope);
                } else {
                    var addClass = _getAdditionalClass(i, offset, howManyRowsToSelect);
                    _fillCourse(dayRows[i], singleCourse, addClass, scope);
                }

                if(collision){
                    var addClass = "border-top";
                    _setSwitchButton(dayRows[offset], singleCourse, scope, addClass);
                }
            }

            if(lastWithinDay) { //we would like to remove empty, unused space after this course
                var firstAfter = offset + howManyRowsToSelect;
                var quarterOfHourWithinDay = 56;
                for(var k = firstAfter; k < quarterOfHourWithinDay; k++){
                    $(dayRows[k]).remove();
                }
            }
        }

        var _getAdditionalClass = function (i, offset, howManyRowsToSelect){
            var addClass = '';
            if(i === offset){
                addClass = 'border-top';
            } else if(i === offset + howManyRowsToSelect - 1) {
                addClass = 'border-bottom';
            }

            return addClass;
        }

        var _fillCourse = function(processingRow, course, addClass, scope){
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin course " + color + " " + addClass);

            var element = "<span ng-click='getDetails(" + JSON.stringify(course) + ")'><p class='center reset-margin transparent-text'>" + "&nbsp" + "</p></span>";
            var compiledElement = $compile(element)(scope);
            $(processingRow).append(compiledElement);
            $(processingRow).attr("ng-click", 'getDetails(' + JSON.stringify(course) + ')');
        }

        var _setHeader = function(processingRow, course, scope){
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin course " + color);

            if(_isEmptyString(course.name.shortName)){
                var element = "<p ng-click='getDetails(" + JSON.stringify(course) + ")' class='center reset-margin transparent-text'>" + "&nbsp" + "</p>";
            } else {
                var element = "<p ng-click='getDetails(" + JSON.stringify(course) + ")' class='center reset-margin'><span>" + _getMaxSubstring(course.name.shortName)+ "</span></p>";
            }
            var compiledElement = $compile(element)(scope);
            $(processingRow).append(compiledElement);
        }

        var _setHours = function(processingRow, course, beginCourseDate, scope){
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin course " + color);
            var startTxt = beginCourseDate.getHours() + ":" + (beginCourseDate.getMinutes() === 0 ? "00" : beginCourseDate.getMinutes());
            var end = new Date(beginCourseDate);
            end.setTime(beginCourseDate.getTime() + (course.duration.seconds * 1000));
            var endTxt = end.getHours() + ":" + (end.getMinutes() === 0 ? "00" : end.getMinutes());

            var element = "<p ng-click='getDetails(" + JSON.stringify(course) + ")' class='center reset-margin'><span>" + startTxt + " - " + endTxt + "</span></p>";
            var compiledElement = $compile(element)(scope);
            $(processingRow).append(compiledElement);
        }

        var _setRoom = function(processingRow, course, scope){
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin course " + color);

            var rooms = "";
            course.classrooms.forEach(function(currentValue, index){

                if(index < course.classrooms.length - 1){
                    rooms += currentValue.room + ", ";
                } else {
                    rooms += currentValue.room;
                }
            })

            if(_isEmptyString(rooms)){
                var element = "<p ng-click='getDetails(" + JSON.stringify(course) + ")' class='center reset-margin transparent-text'><span)'>" + "&nbsp" + "</span></p>";
            } else {
                var element = "<p ng-click='getDetails(" + JSON.stringify(course) + ")' class='center reset-margin'><span>" + _getMaxSubstring(rooms) + "</span></p>";
            }
            var compiledElement = $compile(element)(scope);
            $(processingRow).append(compiledElement);

        }

        var _setLecturers = function(processingRow, course, scope){
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin course " + color);

            var lecturers = "";
            course.lecturers.forEach(function(currentValue, index){

                if(index < course.lecturers.length - 1){
                    lecturers += currentValue.shortName + ", ";
                } else {
                    lecturers += currentValue.shortName;
                }
            })

            if(_isEmptyString(lecturers)){
                var element = "<p ng-click='getDetails(" + JSON.stringify(course) + ")' class='center reset-margin transparent-text'><span>" + "&nbsp" + "</span></p>";
            } else {
                var element = "<p ng-click='getDetails(" + JSON.stringify(course) + ")' class='center reset-margin'><span>" + _getMaxSubstring(lecturers) + "</span></p>";
            }

            var compiledElement = $compile(element)(scope);
            $(processingRow).append(compiledElement);
        }
        
        var _setSwitchButton = function (processingRow, course, scope, addClass) {
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin course " + color + " " + addClass);

            var element = "<p class='reset-margin right'><a href='' ng-click='hide(" + JSON.stringify(course) +")'><i class='material-icons switch-course-button'>arrow_drop_down</i></a></p>";
            var compiledElement = $compile(element)(scope);
            $(processingRow).append(compiledElement);
        }

        var _isEmpty = function (groupedCourses) {
            if(groupedCourses === null || groupedCourses === undefined || groupedCourses.length == 0){
                return true;
            }

            return false;
        }

        var _isEmptyString = function (string) {
            return (string.length === 0 || !string.trim());
        }

        var _howManyNotEmpty = function (groupedCourses) {
            var howMany = 0;

            for(var i = 0; i < 7; i++){
                if(groupedCourses[i] !== null && groupedCourses[i] !== undefined && groupedCourses[i].length > 0){
                    ++howMany;
                }
            }

            return howMany;
        }

        var _getMaxSubstring = function(string){
            return string.substring(0, _maxSubstring);
        }

        var  _detectCollision = function(row){
            var hasCourseClass = $(row).hasClass( "course");
            return hasCourseClass;
        }

        return {
            setTimetableGrid : _setTimetableGrid,
            isEmpty : _isEmpty,
            selectProperRow : _selectProperRow
        }
    });