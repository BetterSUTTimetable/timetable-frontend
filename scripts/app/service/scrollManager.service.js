
angular.module('betterTimetable')
    .factory('ScrollManager', function(DataTimeSrv, $location, MAX_MOBILE_WIDTH, $anchorScroll, $window) {

        var _scroll = function(week) {
            if ($window.innerWidth <= MAX_MOBILE_WIDTH) {

                var today = new Date();

                if (DataTimeSrv.isDateBetween(today, week)) {
                    angular.element(document).ready(function () {
                        var old = $location.hash();
                        $location.hash(today - 1);
                        $anchorScroll();
                        $location.hash(old);
                    });
                } else {
                    angular.element(document).ready(function () {
                        $window.scrollTo(0, 0);
                    });
                }
            }

        }

        return {
            scroll : _scroll
        }
    });