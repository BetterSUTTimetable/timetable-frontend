
angular.module('betterTimetable')
    .factory('CourseTemplateSrv', function(UISrv) {

        var _dayName ={
                0 : "Poniedziałek",
                1 : "Wtorek",
                2 : "Środa",
                3 : "Czwartek",
                4 : "Piątek",
                5 : "Sobota",
                6 : "Niedziela"
        }


        var _getTemplate = function () {
            //each course is a column
            //if we have only one course, it is a column 12
            //if we have duplicated courses, each course is a column 12 / courses.length
        }

        var _getHeader = function(dayNumber){
            return _dayName[dayNumber];
        }

        var _setTimetableGrid = function(groupedCourses){
            var timetable = $("#timetable");
            var quarterOfHourWithinDay = 52;
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
                    column = $("<div id='" + id + "' class='col " + widthClass + "'></div>");
                } else {
                    column = $("<div id='" + id + "' class='col " + widthClass + "'></div>");
                }

                //ADD HEADER
                var header = _getHeader(i);
                column.append("<div class='row margin-top-10 center' >" + header + "</div>");

                //ADD EMPTY CELL
                for(var j = 0; j < quarterOfHourWithinDay; j++){
                    column.append("<div class='row break reset-margin timetable'></br></div>");
                }
                timetable.append(column);
            }

        }

        var _selectProperRow = function(singleCourse, dayNumber){
            if(singleCourse === undefined || singleCourse === null){
                return;
            }

            var begin = singleCourse.beginTime.epochSecond;
            var duration = singleCourse.duration.seconds;

            var beginCourseDate = new Date(1970, 0, 1); //reset
            beginCourseDate.setSeconds(begin);

            var beginDayDate = new Date(beginCourseDate);
            beginDayDate.setHours(7, 0, 0, 0);

            var diff = beginCourseDate - beginDayDate; //in mili

            var secondsInQuarter = 900;

            var howManyRowsToSelect = duration / secondsInQuarter;
            var offset = (diff / 1000 )/ secondsInQuarter - 1;

            var dayColumn = $("#timetable").find("div#" + dayNumber);
            var dayRows = dayColumn.find("div.row.timetable");

            for(var i = offset; i < offset + howManyRowsToSelect; i++){
                if(i === offset + 1){
                    _setHeader(dayRows[i], singleCourse);
                } else if (i === offset + 2) {
                    _setHours(dayRows[i], singleCourse, beginCourseDate);
                } else if (i === offset + 3) {
                    _setRoom(dayRows[i], singleCourse);
                } else if (i === offset + howManyRowsToSelect - 1) {
                    _setLecturers(dayRows[i], singleCourse);
                } else {
                    _fillCourse(dayRows[i], singleCourse);
                }
            }
        }

        var _fillCourse = function(processingRow, course){
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin " + color);
            $(processingRow).append("</br>");
        }

        var _setHeader = function(processingRow, course){
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin " + color);
            $(processingRow).append("<p class='center reset-margin'>" + course.name.shortName+ "</p>");
        }

        var _setHours = function(processingRow, course, beginCourseDate){
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin " + color);
            var startTxt = beginCourseDate.getHours() + ":" + (beginCourseDate.getMinutes() === 0 ? "00" : beginCourseDate.getMinutes());
            var end = new Date(beginCourseDate);
            end.setTime(beginCourseDate.getTime() + (course.duration.seconds * 1000));
            var endTxt = end.getHours() + ":" + (end.getMinutes() === 0 ? "00" : end.getMinutes());
            $(processingRow).append("<p class='center reset-margin'>" + startTxt + " - " + endTxt + "</p>");
        }

        var _setRoom = function(processingRow, course){
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin " + color);

            var rooms = "";
            course.classrooms.forEach(function(currentValue, index){

                if(index < course.classrooms.length - 1){
                    rooms += currentValue.room + ", ";
                } else {
                    rooms += currentValue.room;
                }
            })
            $(processingRow).append("<p class='center reset-margin'>" + rooms + "</p>");
        }


        var _setLecturers = function(processingRow, course){
            var color = UISrv.getColor({courseType : course.courseType});
            $(processingRow).empty(); //reset cell
            $(processingRow).attr("class", "row timetable reset-margin " + color);

            var lecturers = "";
            course.lecturers.forEach(function(currentValue, index){

                if(index < course.lecturers.length - 1){
                    lecturers += currentValue.shortName + ", ";
                } else {
                    lecturers += currentValue.shortName;
                }
            })
            $(processingRow).append("<p class='center reset-margin'>" + lecturers + "</p></br>");
        }


        var _isEmpty = function (groupedCourses) {
            if(groupedCourses === null || groupedCourses === undefined || groupedCourses.length == 0){
                return true;
            }

            return false;
        }

        var _howManyNotEmpty = function (groupedCourses) {
            var howMany = 0;

            /*for(var i = 0; i < groupedCourses.length; i++){*/
            for(var i = 0; i < 7; i++){
                if(groupedCourses[i] !== null && groupedCourses[i] !== undefined && groupedCourses[i].length > 0){
                    ++howMany;
                }
            }

            return howMany;
        }

        return {
            getTemplate : _getTemplate,
            setTimetableGrid : _setTimetableGrid,
            isEmpty : _isEmpty,
            selectProperRow : _selectProperRow
        }
    });