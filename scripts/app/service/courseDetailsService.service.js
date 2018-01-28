
angular.module('betterTimetable')
    .factory('CourseDetailsSrv', function($compile) {

       var _course = {};

        var _displayDetails = function(course, scope){
            if(course !== null || course !== undefined){
                _course = course;
            }

            $('#modalContainer').load( "views/modals/courseDetails.html", function(result){
                var fragment = $compile(result)(scope);
                $('#modalContainer').empty();
                $("#modalContainer").append(fragment);
                $('#courseDetailsModal').modal('open');
            });
        }

        var _displayDetailsWithFilter = function(course, scope){
            if(course !== null || course !== undefined){
                _course = course;
            }

            $('#modalContainer').load( "views/modals/filter.html", function(result){
                var fragment = $compile(result)(scope);
                $('#modalContainer').empty();
                $("#modalContainer").append(fragment);
                $('#courseFilterModal').modal('open');
            });
        }

        var _get = function(){
            return _course;
        }

        return {
            displayDetails : _displayDetails,
            displayDetailsWithFilter : _displayDetailsWithFilter,
            get : _get
        }
    });