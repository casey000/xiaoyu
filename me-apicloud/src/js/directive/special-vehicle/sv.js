angular.module('myApp')
    .directive('selectVehicle', ['server', 'configInfo', '$timeout', function (server, configInfo, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {},
            templateUrl: '',
            link: function (scope, elm, iAttrs) {

            }
        };
    }])
    .directive('swipeDeleteSv', ['server', 'configInfo', '$timeout', function (server, configInfo, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                width: '@'
            },
            templateUrl: '',
            link: function (scope, element, attr) {

                element
                    .on("touchstart", function (e) {
                        startX = e.changedTouches[0].pageX,
                            startY = e.changedTouches[0].pageY;
                    });
                element.on("touchmove", function (e) {
                    var moveEndX = e.changedTouches[0].pageX,
                        moveEndY = e.changedTouches[0].pageY,
                        X = moveEndX - startX,
                        Y = moveEndY - startY;

                    if (Math.abs(X) > Math.abs(Y) && X < 0) {
                        element.addClass('sv-swipe-left');
                        // element.style.right = scope.width;
                    } else if (Math.abs(X) > Math.abs(Y) && X > 0) {
                        element.removeClass('sv-swipe-left');
                    }
                });
            }
        };
    }])
    .directive('swipeDeleteSvUnstart', ['server', 'configInfo', '$timeout', function (server, configInfo, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                width: '@'
            },
            templateUrl: '',
            link: function (scope, element, attr) {

                element
                    .on("touchstart", function (e) {
                        startX = e.changedTouches[0].pageX,
                            startY = e.changedTouches[0].pageY;
                    });
                element.on("touchmove", function (e) {
                    var moveEndX = e.changedTouches[0].pageX,
                        moveEndY = e.changedTouches[0].pageY,
                        X = moveEndX - startX,
                        Y = moveEndY - startY;

                    if (Math.abs(X) > Math.abs(Y) && X < 0) {
                        element.addClass('swipe-right');
                        // element.style.right = scope.width;
                    } else if (Math.abs(X) > Math.abs(Y) && X > 0) {
                        element.removeClass('swipe-right');
                    }
                });
            }
        };
    }])
    .directive('swipeDeleteSvStarted', ['server', 'configInfo', '$timeout', function (server, configInfo, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                width: '@'
            },
            templateUrl: '',
            link: function (scope, element, attr) {

                element
                    .on("touchstart", function (e) {
                        startX = e.changedTouches[0].pageX,
                            startY = e.changedTouches[0].pageY;
                    });
                element.on("touchmove", function (e) {
                    var moveEndX = e.changedTouches[0].pageX,
                        moveEndY = e.changedTouches[0].pageY,
                        X = moveEndX - startX,
                        Y = moveEndY - startY;

                    if (Math.abs(X) > Math.abs(Y) && X < 0) {
                        element.addClass('swipe-right-dup');
                    } else if (Math.abs(X) > Math.abs(Y) && X > 0) {
                        element.removeClass('swipe-right-dup');
                    }
                });
            }
        };
    }])
    .directive('selectSv', ['server', 'configInfo', '$timeout','$rootScope', function (server, configInfo, $timeout,$rootScope) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                info: '=',
                edit: '=',
                taskInfo: '=',
                svDetail: '='
            },
            templateUrl: 'special-vehicle/select-sv.html',
            link: function (scope, elm, iAttrs) {

                scope.dropdown = false;
                var needRequest = false;//区分手动录入与从列表选择
                scope.search = function (keyword) {
                    scope.dropdown = true;
                    scope.loadApprover = true;
                    server.maocGetReq('ghsSpv/carUnit/findCarUnitByLicensePlate',{licensePlate: keyword}).then(function (res) {
                        var response = res.data;
                        var statusCode = response.statusCode;
                        scope.loadApprover = false;
                        if (statusCode == 200) {
                            scope.list = response.data;
                        }
                        else {
                            scope.list = [];
                        }
                    });
                };

                /*
                 * 检查是否重复使用车辆
                 */
                function cheakRepeat(plateNum) {
                    var taskInfo = scope.taskInfo;
                    var jobIds = [];
                    if (taskInfo.type == 0) {
                        if (typeof (taskInfo.departureStationJob.jobId) != 'undefined') {
                            jobIds.push(taskInfo.departureStationJob.jobId);
                        }
                        if (typeof (taskInfo.arrivalStationJob.jobId) != 'undefined') {
                            jobIds.push(taskInfo.arrivalStationJob.jobId);
                        }
                    }
                    else if (taskInfo.type == 1) {
                        if (typeof (taskInfo.jobId) != 'undefined') {
                            jobIds.push(taskInfo.jobId);
                        }
                    }
                    var param = {};
                    if (jobIds.length > 0) {
                        var jobIdStr = jobIds.join(',');
                        param = {
                            jobIds: jobIdStr,
                            id: scope.svDetail.id,
                            plateNum: plateNum
                        };
                    }
                    server.maocGetReq('ghsSpv/findIsUseRepeat',param).then(function (res) {
                        var response = res.data;
                        if (response.statusCode == 200) { //204为内容为空
                            var result = response.data[0];
                            if (result.success == 2) {
                                $rootScope.limitTip = true;
                                $rootScope.limitTipContent = "车牌号重复，请确认是否用了多次同一辆车？";
                            }
                        }
                    });
                }

                scope.$watch('info.licensePlate',function (n,o) {
                    scope.dropdown = false;
                    scope.loadApprover = false;
                    if (typeof (n) != 'undefined') {
                        if (needRequest) {
                            scope.search(scope.info.licensePlate);
                        }
                        else {
                            needRequest = true;
                        }
                    }
                });

                scope.selectItem = function (selectItem) {
                    scope.info = selectItem;
                    scope.dropdown = false;
                    needRequest = false;
                    scope.list = [];
                    if (typeof (selectItem.code) != 'undefined') {
                        scope.svDetail.meteUnit = selectItem.code;
                    }
                };

                scope.blurEvent = function () {
                    scope.dropdown=false;
                    scope.loadApprover=false;
                    if (typeof (scope.info.licensePlate) != 'undefined' && scope.info.licensePlate.length > 0) {
                        cheakRepeat(scope.info.licensePlate);
                    }
                };
            }
        };
    }])
;