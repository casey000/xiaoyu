module.exports = angular.module('myApp').controller('messageListController',
    ['$rootScope', '$scope', 'server', '$localForage', 'configInfo', '$filter','$stateParams',
        function($rootScope, $scope, server, $localForage, configInfo, $filter,$stateParams)  {
            $rootScope.endLoading();

            var that = this;
            var pageSize = 20;
            $scope.sysMessList = [];
            $scope.fileMessList = [];
            $scope.navIdx = $stateParams.navIndex || 1;

            //上下拉刷新
            $scope.status = {
                statusStandBy: 0, //等待起飞
                statusTakeOff: 1, //已起飞
                statusLandOff: 2, //已降落
                statusDelay: 3, //延时起飞
                statusAlternate: 4, //发生备降
                statusCourse: 5, //发生返航
                statusCancel: 6, //航班取消
                statusError: 7 //未知的航班
            };

            $scope.changeMainNav = function (idx) {
                $scope.navIdx = idx;
            };

            /**
             * 获取系统消息列表
             */
            $scope.getSystemMessList = function (param){
                if (!$scope.pullToRefreshActive) {
                    $rootScope.startLoading();
                }
                server.maocGetReq('message/messageSummaryList').then(function(data) {
                    $rootScope.endLoading();
                    $scope.pullToRefreshActive = false;
                    if(200 === data.data.statusCode) {
                        $scope.sysMessList = [];
                        angular.forEach(data.data.data,function (item ,index) {
                            var stateCode = getFlightStateIndex(item);
                            item.stateCode = stateCode;
                            $scope.sysMessList.push(item);
                        })
                        calculateTotalUnreadMessageCount($scope.sysMessList);
                    }
                }).catch(function(error) {
                    $rootScope.endLoading();
                });
            };
            $scope.getSystemMessList();

            var Status = {
                statusStandBy: 0, //等待起飞
                statusTakeOff: 1, //已起飞
                statusLandOff: 2, //已降落
                statusDelay: 3, //延时起飞
                statusAlternate: 4, //发生备降
                statusCourse: 5, //发生返航
                statusCancel: 6, //航班取消
                statusError: 7 //未知的航班
            };

            function getFlightStateIndex(item) {
                var flightStatus = item.flyStatus;
                var flgCs = item.flgCs;
                var flgVr = item.flgVr;
                var flgDelay = item.flgDelay;
                var index = 0;

                if (flgCs) {
                    index = Status.statusCancel;
                } else if (flightStatus == 'LANDED') {
                    index = Status.statusLandOff;
                } else if (flgVr) {
                    if (flgVr == 'VC') {
                        index = Status.statusAlternate;
                    } else {
                        index = Status.statusCourse;
                    }
                } else if (flightStatus == 'TAKE_OFF') {
                    index = Status.statusTakeOff;
                } else if (flgDelay) {
                    index = Status.statusDelay;
                } else if (flightStatus == 'STAND_BY') {
                    index = Status.statusStandBy;
                } else {
                    index = Status.statusError;
                }
                return index;
            }

            /*
             * 初始化请求参数准备
             */
            $scope.getFileMessagePage = function(){
                that.currentPage = 1;
                $scope.noMoreData = false;
                // $scope.fileMessList = [];

                var empCode = $api.getStorage('usercode');
                // var empCode = '422578';
                var param = {
                    empCode: empCode,
                    pegeIndex: 1,
                    pegeSize: pageSize
                };
                that.curParam = param;
                if(!that.requesting){
                    that.requesting = true; //防止在底部时同时执行nextPage
                    getFileMessList(param);
                }
            };

            /*
             *获取下页的数据
             */
            $scope.getNextFileMessagePage = function() {

                if(!$scope.noMoreData && !that.requesting) {
                    that.curParam.pegeIndex = ++that.currentPage;
                    if(Math.ceil(that.total / pageSize) >= that.curParam.pegeIndex){
                        that.requesting = true; //防止在底部时同时执行nextPage
                        getFileMessList(that.curParam);
                    }else{
                        $scope.noMoreData = true;
                    }
                }
            };

            /**
             * 获取局方文件通知列表
             */
            function getFileMessList(param){

                server.maocGetReq('news/findFliePushRecord',param).then(function (response) {
                    $rootScope.endLoading();
                    $scope.pullToRefreshActive = false;
                    that.requesting = false;
                    if(200 === response.data.statusCode) {
                        var data = response.data.data[0];
                        that.total = data.total;
                        //下拉刷新或首次加载
                        if (that.currentPage == 1) {
                            $scope.fileMessList = data.recordList;
                        }
                        else {
                            $scope.fileMessList = data.recordList && $scope.fileMessList.concat(data.recordList) || [];
                        }
                        if(Math.ceil(that.total / pageSize) == param.pegeIndex){
                            $scope.noMoreData = true;
                        }
                    }

                }).catch(function(error) {
                    that.requesting = false;
                    $scope.pullToRefreshActive = false;
                    $rootScope.endLoading();
                });
            };
            $scope.getFileMessagePage();

            // 获取系统消息未读数
            function calculateTotalUnreadMessageCount(array) {
                var count = 0;
                if (array.length > 0) {
                    for (var i = 0; i < array.length; i++) {
                        var n = array[i];
                        count += n.unreadNumber;
                    }
                }
                $scope.systemUnreadCount = count;
                getFileUnreadNo();
            }

            // 获取局方文件消息未读数
            $scope.fileUnreadCount = 0;
            function getFileUnreadNo () {
                var empCode = $api.getStorage('usercode');
                server.maocGetReq('news/findFliePushRecordStatus',{'empCode':empCode}).then(function (data) {
                    $scope.fileUnreadCount = data.data.data[0].unReaderTotal || '';

                    var apiExis = setInterval(function(){
                        if( typeof api != 'undefined' ){
                            api.sendEvent({
                                name: 'updateMessageState',
                                extra: {
                                    systemUnreadCount: $scope.systemUnreadCount,
                                    fileUnreadCount: $scope.fileUnreadCount
                                }
                            });
                            window.clearInterval(apiExis);
                        }
                    }, 20);
                });
            }

            //取消关注信息
            $scope.cancelFavorite = function (flightId, item,$event){

                $event.stopPropagation();
                $rootScope.confirmInfo = "确定取消关注吗";
                $rootScope.confirmShow = true;
                $rootScope.confirmOk = function () {
                    $rootScope.startLoading();
                    server.maocPostReq('flight/unfocusFlight', {'flightId': flightId}).then(function(response) {
                        $rootScope.endLoading();
                        if (response.status == 200) {
                            $scope.sysMessList = [];
                            angular.forEach($scope.sysMessList,function (item,index) {
                                if (item.flightId == flightId) {
                                    $scope.sysMessList.splice(index,1);
                                }
                            });
                        }
                    })
                };
                $rootScope.confirmCancel = function () {
                    $rootScope.confirmShow = false;
                }

            };

            //业务处理-根据字段获取状态文字
            $scope.getFlightState = function (item) {

                var flightStatus = item.flyStatus;
                var flgCs = item.flgCs;
                var flgVr = item.flgVr;
                var flgDelay = item.flgDelay;

                if (flgCs) {
                    flightStatus = '取消';
                } else if (flightStatus == 'LANDED') {
                    flightStatus = '降落';
                } else if (flgVr) {
                    if (flgVr == 'VC') {
                        flightStatus = '备降';
                    } else {
                        flightStatus = '返航';
                    }
                } else if (flightStatus == 'TAKE_OFF') {
                    flightStatus = '起飞';
                } else if (flgDelay) {
                    flightStatus = '延误';
                } else if (flightStatus == 'STAND_BY') {
                    flightStatus = '未飞';
                } else {
                    flightStatus = '错误';
                }
                return flightStatus;
            };

            //进入详情
            $scope.gotoDetail = function (item) {
                $rootScope.go('messageDetail','slideLeft',{ 'flightId':item.flightId , 'flightNo':item.flightNo,'acReg':item.acReg});
            };

            $scope.gotoFileMessDetail = function (item) {
                $rootScope.go('fileMessageDetail','',{recordItem: item, navIndex: $scope.navIdx});
            };

            //监听apicloudtabbar点击事件，刷新数据
            var apiExistT = setInterval(function(){
                if( typeof api != 'undefined' ){
                    api.addEventListener({
                        name: 'mess-viewappear'
                    }, function(ret, err){
                        $scope.getSystemMessList();
                        $scope.getFileMessagePage();
                    });
                    window.clearInterval(apiExistT);
                }
            }, 20);

            //滑动手势相关

            // var element = document.getElementById('mess-pdf-wrapper');
            // var startX, startY, X, Y;
            // element
            //     .on("touchstart", function (e) {
            //         startX = e.changedTouches[0].pageX,
            //             startY = e.changedTouches[0].pageY;
            //     });
            // element.on("touchmove", function (e) {
            //     var moveEndX = e.changedTouches[0].pageX,
            //         moveEndY = e.changedTouches[0].pageY;
            //     X = moveEndX - startX;
            //     Y = moveEndY - startY ;
            //     element.style = "margin-";
            //
            //     if (Math.abs(X) > Math.abs(Y) && X < 0) {
            //         //alert("right 2 left");
            //         e.preventDefault();
            //         element.addClass('swipe-left');
            //     } else if (Math.abs(X) > Math.abs(Y) && X > 0) {
            //         //left to right
            //         e.preventDefault();
            //         element.removeClass('swipe-left');
            //     }
            // });
            //
            // element.on("touchend", function (e) {
            //     var moveEndX = e.changedTouches[0].pageX,
            //         moveEndY = e.changedTouches[0].pageY;
            //     X = moveEndX - startX;
            //     Y = moveEndY - startY;
            //
            //     if (X == 0 && Y == 0) {
            //         if (angular.element(e.target).hasClass('go-fault')) {
            //             return;
            //         }
            //         //点击事件写在这里是因为android 上加上touch后，ng-click失效
            //         if (angular.isFunction(scope.clickFunction)) {
            //             scope.clickFunction();
            //         }
            //     }
            // });

        }
    ]);