
angular.module('betterTimetable')
    .factory('CourseTemplateSrv', function(UISrv, $compile, DataTimeSrv) {

        var _maxSubstring = UISrv.getMaxSubString();
        var _dayProps = DataTimeSrv.getDayProps();
        var _gridProps = UISrv.getGridProps();

        var _setTimetableGrid = function(groupedCourses){
            var timetable = $("#timetable");
            timetable.empty();

            var howManyNotEmpty = _howManyNotEmpty(groupedCourses);
            var unusableSpace = _gridProps.columnNumber % howManyNotEmpty ;
            var dayWidth = (_gridProps.columnNumber - unusableSpace) / howManyNotEmpty;
            var offset = Math.floor(unusableSpace / _gridProps.offset);

            for(var i = 0; i < _dayProps.daysWithinWeek; i++){

                var isEmpty = _isEmpty(groupedCourses[i]);

                if(isEmpty) {
                    continue;
                }

                //CONSTRUCT COLUMN
                var template = "<div id='{@id}' class='col s12 m12 l{@w} {@offset}'></div>";
                template = template.replace("{@id}", i);
                template = template.replace("{@w}", dayWidth);

                if(i === 0 && offset !== 0){
                    template = template.replace("{@offset}", "offset-l" + offset);
                } else {
                    template = template.replace("{@offset}", "");
                }

                var column =$(template);

                //ADD HEADER
                var header = _getHeader(i);
                column.append("<div class='row margin-top-10 center' ><b>" + header + "</b></div>");

                //ADD EMPTY CELL
                for(var j = 0; j < _dayProps.quartersWithinDay; j++){
                    column.append("<div class='row break reset-margin timetable'></br></div>");
                }
                timetable.append(column);
            }
        }

        var _selectProperRow = function(singleCourse, dayNumber, lastWithinDay, scope, theFirst, theLast){

            if(singleCourse !== undefined || singleCourse !== null || !singleCourse.hidden){

                var duration = singleCourse.duration.seconds;
                var courseBeginning = DataTimeSrv.getCourseDataTime(singleCourse);
                var dayBeginning = DataTimeSrv.getDayBeginning(courseBeginning);
                var diff = courseBeginning - dayBeginning; //in mili
                var howManyRowsToSelect = duration / _dayProps.secondsInQuarter;
                var offset = diff === 0 ? 0 :(diff / 1000 )/ _dayProps.secondsInQuarter;

                var dayColumn = $("#timetable").find("div#" + dayNumber);
                var dayRows = dayColumn.find("div.row.timetable");

                for(var i = offset; i < offset + howManyRowsToSelect; i++){

                    //detect collision
                    var collision = _detectCollision(dayRows[i]);

                    if(i === offset + 1){
                        _setHeader(dayRows[i], singleCourse, scope);
                    } else if (i === offset + 2) {
                        _setHours(dayRows[i], singleCourse, courseBeginning, scope);
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
            }

            var mobile = UISrv.isMobile();

            if(lastWithinDay && !mobile) { //remove unnecessary cells
                var firstBegining = DataTimeSrv.getCourseDataTime(theFirst);
                var lastBegining = DataTimeSrv.getCourseDataTime(theLast);

                var diff = DataTimeSrv.getCourseTime(firstBegining) - _dayProps.dayBeginning;

                var offset = diff === 0 ? 0 :(diff / 1000 )/ _dayProps.secondsInQuarter;

                for(var i = 0; i < offset; i++){
                    $(dayRows[i]).remove();
                }

                var lastDiff = DataTimeSrv.getCourseTime(lastBegining) - _dayProps.dayBeginning;
                var lastRow = theLast.duration.seconds / _dayProps.secondsInQuarter;
                var lastOffset = lastDiff === 0 ? 0 :(lastDiff / 1000 )/ _dayProps.secondsInQuarter;

                for(var j = lastOffset + lastRow; j < _dayProps.quartersWithinDay; j++){
                    $(dayRows[j]).remove();
                }
            } else if (lastWithinDay && mobile) {
                var index = 0;

                while(true){
                    if($(dayRows[index]).hasClass("row break reset-margin timetable")){
                        $(dayRows[index]).remove();
                    } else {
                        break;
                    }
                    ++index;
                }

                for(var i = offset + howManyRowsToSelect; i < _dayProps.quartersWithinDay; i++){
                    $(dayRows[i]).remove();
                }
            }
        }

        var _getHeader = function(dayNumber){
            return DataTimeSrv.getDayName(dayNumber);
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

            var element = "<p class='reset-margin right'><a href='' ng-click='hide(" + JSON.stringify(course) +")'><i class='material-icons switch-course-button icon-white'>arrow_drop_down</i></a></p>";
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

        var _resetStartingCells = function(){
            for(var i = 0; i < 7; i++){
                var dayColumn = $("#timetable").find("div#" + i);
                var dayRows = dayColumn.find("div.row.timetable");

                for(var j = 0; j < dayRows.length; j++){
                    if($(dayRows[j]).hasClass('row break reset-margin timetable')){
                        $(dayRows[j]).hide();
                    }
                }
            }
        }

        return {
            setTimetableGrid : _setTimetableGrid,
            isEmpty : _isEmpty,
            selectProperRow : _selectProperRow,
            resetStartingCells : _resetStartingCells
        }
    });