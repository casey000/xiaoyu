angular.module('myApp')
    .directive('swipeDeleteDamageDraft', ['$touch', '$rootScope', function ($touch, $rootScope) {
        return {
            restrict: 'AE',
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
                        //alert("right 2 left");
                        element.addClass('swipe-left-cancel-focus');
                    } else if (Math.abs(X) > Math.abs(Y) && X > 0) {
                        element.removeClass('swipe-left-cancel-focus');
                    }
                });


            }
        }
    }])
    .directive('flightNo', ['server', 'configInfo', '$timeout', function (server, configInfo, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                info: '='
            },
            templateUrl: 'damage/directives/flight-no.html',
            link: function (scope, elm, iAttrs) {
                scope.dropdown = false;
                var needRequest = false;//区分手动录入与从列表选择
                scope.search = function (keyword) {
                    scope.dropdown = true;
                    scope.loadApprover = true;
                    server.maocGetReq('asms/toolInfoMobileApi/queryAircraftTree',{level: 3,ac: keyword}).then(function (res) {
                       var statusCode = res.data.statusCode;
                        scope.loadApprover = false;
                        if (statusCode == 200) {
                           var response = res.data.data[0];
                           scope.list = response.result;
                       }
                    });
                };
                scope.$watch('info.label',function (n,o) {
                    scope.dropdown = false;
                    scope.loadApprover = false;
                    if (typeof (n) != 'undefined') {
                        if (needRequest) {
                            scope.search(scope.info.label);
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
                };
            }
        };
    }])
    .directive('damageAta', ['server', 'configInfo', '$timeout', function (server, configInfo, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                info: '='
            },
            templateUrl: 'damage/directives/damage-ata.html',
            link: function (scope, elm, iAttrs) {

                scope.dropdown = false;
                var needRequest = false;//区分手动录入与从列表选择
                scope.search = function (keyword) {
                    scope.dropdown = true;
                    scope.loadApprover = true;
                    server.maocGetReq('asms/toolInfoMobileApi/queryAtaTree',{level: 3,ata: keyword}).then(function (res) {
                        var statusCode = res.data.statusCode;
                        scope.loadApprover = false;
                        scope.list=[];
                        if (statusCode == 200) {
                            var response = res.data.data[0];
                            for(var j in response.result){
                                scope.list = scope.list.concat(response.result[j].children)
                            };
                        }

                    });
                };

                scope.$watch('info.value',function (n,o) {
                    scope.dropdown = false;
                    scope.loadApprover = false;

                    if (typeof (n) != 'undefined') {

                        if (needRequest) {
                            scope.search(scope.info.value);
                        }
                        else {
                            needRequest = true;
                        }

                    }
                });
                elm.on('touchmove',function (e) {
                    scope.flagScroll = true
                });
                scope.startSelect = function(){
                    scope.flagScroll = false

                };
                scope.scrollSelect = function(){
                    scope.flagScroll = true

                };
                scope.selectItem = function (selectItem) {
                    // event.stopPropagation();
                    if(scope.flagScroll){
                        return false;
                    }
                    scope.info = selectItem;
                    needRequest = false;
                    scope.list = [];
                    scope.dropdown = false;
                };
            }
        };
    }])
    .directive('damageWorkorder', ['server', 'configInfo', '$timeout', function (server, configInfo, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                info: '=',
                flightNoInfo: '=',
                drDate: '='
            },
            templateUrl: 'damage/directives/damage-workorder.html',
            link: function (scope, elm, iAttrs) {

                scope.dropdown = false;
                var needRequest = false;//区分手动录入与从列表选择
                scope.search = function () {
                    var ac = scope.flightNoInfo.label;
                    if (ac) {
                        scope.dropdown = true;
                        scope.loadApprover = true;
                        // server.maocGetReq('asms/toolInfoMobileApi/query',{ac:ac,woNo:keyword}).then(function (res) {
                        //     scope.loadApprover = false;
                        //     var statusCode = res.data.statusCode;
                        //     scope.loadApprover = false;
                        //     if (statusCode == 200) {
                        //         var response = res.data.data[0];
                        //         scope.totolList = response.result;
                        //         scope.list = response.result;
                        //     }
                        //
                        // });
                        server.maocPostReq('asms/toolInfoMobileApi/queryWoNo',{ac:ac,drDate:scope.drDate},true).then(function (res) {
                            scope.loadApprover = false;
                            var statusCode = res.data.statusCode;
                            scope.loadApprover = false;
                            if (statusCode == 200) {
                                var response = res.data.data[0];
                                scope.totolList = response.result;
                                scope.list = response.result;
                            }

                        });
                    }
                };

                // scope.$watch('info.woNo',function (n,o) {
                //     scope.dropdown = false;
                //     scope.loadApprover = false;
                //     if (typeof (n) != 'undefined') {
                //         if (needRequest) {
                //             scope.search(scope.info.woNo);
                //         }
                //         else {
                //             needRequest = true;
                //         }
                //
                //     }
                // });

                scope.selectItem = function (selectItem) {
                    scope.info = selectItem;
                    scope.dropdown = false;
                    needRequest = false;
                    // scope.list = [];
                };
            }
        };
    }])
    .directive('damageWorkcard', ['server', 'configInfo', '$timeout', function (server, configInfo, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                info: '=',
                workOrderInfo: '='
            },
            templateUrl: 'damage/directives/damage-workcard.html',
            link: function (scope, elm, iAttrs) {
                scope.dropdown = false;
                var needRequest = false;//区分手动录入与从列表选择

                scope.search = function (keyword) {
                    scope.dropdown = true;
                    scope.loadApprover = true;
                    var woNo = scope.workOrderInfo.woNo;
                    if (woNo) {
                        if(scope.workOrderInfo.isNewFault){
                            var url = '';
                            var data = {};
                            if(scope.workOrderInfo.isDefault){
                                url = 'assembly/listRoutineTaskByParentId';
                                data = {
                                    parentId:scope.workOrderInfo.jobId
                                }
                            }else{
                                url = 'asms/toolInfoMobileApi/findCard';
                                data = {
                                    woNo:woNo,
                                    cardNo:keyword
                                }
                            }
                            server.maocGetReq(url,data).then(function (res) {
                                var statusCode = res.data.statusCode;
                                scope.loadApprover = false;
                                if (statusCode == 200) {
                                    if(scope.workOrderInfo.isDefault){
                                        scope.isDefault = true;
                                        var response = res.data.data;
                                        scope.list = response;
                                    }else{
                                        scope.isDefault = false;
                                        var response = res.data.data[0];
                                        scope.list = response.result;
                                    }

                                }
                                console.log(scope.list,'list')
                            });
                        }else{
                            server.maocGetReq('asms/toolInfoMobileApi/findCard',{woNo:woNo,cardNo:keyword}).then(function (res) {
                                var statusCode = res.data.statusCode;
                                scope.loadApprover = false;
                                if (statusCode == 200) {
                                    var response = res.data.data[0];
                                    scope.list = response.result;
                                }
                            });
                        }

                    }
                };

                scope.$watch('info.cardNo',function (n,o) {
                    scope.dropdown = false;
                    scope.loadApprover = false;
                    if (typeof (n) != 'undefined'&& n !='') {
                        if (needRequest) {
                            scope.search(scope.info.cardNo);
                        }
                        else {
                            needRequest = true;
                        }
                    }
                });

                scope.selectItem = function (selectItem) {
                    scope.info = selectItem;
                    if(!scope.info.cardNo){
                        scope.info.cardNo = selectItem.cardNumber;
                    }
                    console.log(scope.info,'scope.info');
                    scope.dropdown = false;
                    needRequest = false;
                    scope.list = [];
                };

            }
        };
    }])
    .directive('damageLocationDetail', ['server', 'configInfo', '$timeout', function (server, configInfo, $timeout) {
        return {
            restrict: 'AE',
            replace: true,
            scope: {
                info: '=',
                isEdit: '=',
                showSizeTemplateState: '='
            },
            templateUrl: 'damage/directives/damage-location-detail.html',
            link: function (scope, elm, iAttrs) {

                console.log(scope.showSizeTemplateState);


                scope.hideSizeTemplate = function () {
                    scope.showSizeTemplateState = false;
                };

            }
        };
    }])
;


