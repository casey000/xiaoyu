module.exports = (function () {
    angular.module('myApp')
        //下拉刷新
        .directive('imPullToRefresh', ['$timeout', '$touch', '$swipe', '$rootScope', require('./pull-to-refresh.js')])

        /**
         * 向左滑动功能，可以绑定点击方法
         * 方法名：clickFunction 使用方式在element上加
         * click-function="functionName()"
         */
        .directive('swipeLeft', ['$touch', '$rootScope', function ($touch, $rootScope) {
            return {
                restrict: 'AE',
                scope: {
                    clickFunction: '&'
                },
                link: function (scope, element, attr) {
                    var startX, startY, X, Y;
                    element
                        .on("touchstart", function (e) {
                            startX = e.changedTouches[0].pageX,
                                startY = e.changedTouches[0].pageY;
                        });
                    element.on("touchmove", function (e) {
                        var moveEndX = e.changedTouches[0].pageX,
                            moveEndY = e.changedTouches[0].pageY;
                        X = moveEndX - startX;
                        Y = moveEndY - startY;

                        if (Math.abs(X) > Math.abs(Y) && X < 0) {
                            //alert("right 2 left");
                            e.preventDefault();
                            element.addClass('swipe-left');
                        } else if (Math.abs(X) > Math.abs(Y) && X > 0) {
                            //left to right
                            e.preventDefault();
                            element.removeClass('swipe-left');
                        }
                        if(Math.abs(Y) < 10){
                            e.preventDefault();
                        }
                    });

                    element.on("touchend", function (e) {
                        var moveEndX = e.changedTouches[0].pageX,
                            moveEndY = e.changedTouches[0].pageY;
                        X = moveEndX - startX;
                        Y = moveEndY - startY;

                        if (X == 0 && Y == 0) {
                            if (angular.element(e.target).hasClass('go-fault')) {
                                return;
                            }
                            //点击事件写在这里是因为android 上加上touch后，ng-click失效
                            if (angular.isFunction(scope.clickFunction)) {
                                scope.clickFunction();
                            }
                        }
                    });

                    //var unbind = $touch.bind(element, {
                    //	move: function(touch, e) {
                    //		if(touch.direction == "LEFT") {
                    //			e.preventDefault();
                    //			element.addClass('swipe-left');
                    //		} else if(touch.direction == "RIGHT") {
                    //			e.preventDefault();
                    //			element.removeClass('swipe-left');
                    //		}
                    //	},
                    //	end: function(touch, e) {
                    //		if(angular.element(e.target).hasClass('go-fault')){
                    //			return;
                    //		}
                    //		//点击事件写在这里是因为android 上加上touch后，ng-click失效
                    //		if(touch.distanceY === 0 && angular.isFunction(scope.clickFunction)) {
                    //			scope.clickFunction();
                    //		}
                    //	}
                    //});

                }
            }
        }])
        .directive('ngFileSelect', ['$parse', '$timeout', function ($parse, $timeout) {  //apicloud方法调用
            return function (scope, elem, attr) {
                var fn = $parse(attr['ngFileSelect']);
                elem.bind('change', function (evt) {
                    var files = [];
                    $timeout(function () {
                        fn(scope, {
                            $files: files,
                            $event: evt
                        });
                    });
                })
            };
        }])
        .directive('nrcFileSelect', ['$parse', '$timeout', function ($parse, $timeout) {  //angular方法调用
            return function (scope, elem, attr) {

                var fn = $parse(attr['nrcFileSelect']);
                var notImg = false;
                elem.bind('change', function (evt) {
                    var files = [], fileList, i;
                    fileList = evt.target.files;

                    if (fileList != null) {
                        for (i = 0; i < fileList.length; i++) {
                            if (fileList.item(i).type.indexOf('video') != -1) {
                                notImg = true; //不是图片退出
                                break;
                            }
                            files.push(fileList.item(i));
                        }
                    }

                    if (notImg) {
                        alert('暂不支持非图片格式');
                        notImg = false;
                        return;
                    }

                    $timeout(function () {
                        fn(scope, {
                            $files: files,
                            $event: evt
                        });
                    });
                });
            };
        }])
        .directive('androidFileSelect', ['$parse', '$timeout', function ($parse, $timeout) {  //angular方法调用
            return function (scope, elem, attr) {

                var fn = $parse(attr['androidFileSelect']);

                var UIAlbumBrowser = api.require('UIAlbumBrowser');

                elem.bind('click', function (evt) {
                    UIAlbumBrowser.imagePicker({
                        max: 9,
                        showCamera:false,
                        styles: {
                            bg: '#000000',
                            cameraImg:'widget://res/cameraImg.png',
                            mark: {
                                icon: '',
                                position: 'bottom_left',
                                size: 20
                            },
                            nav: {
                                bg: '#000000',
                                cancelColor: '#fff',
                                cancelSize: 16,
                                nextStepColor: '#fff',
                                nextStepSize: 16
                            }
                        },
                        animation:true,
                    }, function(ret) {
                        if (ret.eventType == 'nextStep') {
                            UIAlbumBrowser.closePicker();
                            files = ret.list;
                            // files.forEach(function (item,index,arr) {
                            //     arr[index] = new File([JSON.stringify(item)],'phonePhoto'+ Date.now().toString().substr(6) + '.' + item.suffix ,{
                            //         type:'image/' + item.suffix,
                            //         lastModified:Date.now()
                            //     })
                            // });
                            $timeout(function () {
                                fn(scope, {
                                    $files: files,
                                    $event: evt
                                });
                            });
                        }
                    });

                });
            };
        }])
        .directive('scrollableContent', ['$rootScope', function ($rootScope) {
            return {
                restrict: 'C',
                link: function (scope, element, attr) {
                    var startX, startY;
                    var elem = element[0];
                    element
                        .on("touchstart", function (e) {
                            startX = e.changedTouches[0].pageX,
                                startY = e.changedTouches[0].pageY;
                        });
                    function scrollEnd(event) {
                        var node = document.activeElement; //当前focus的dom元素
                        if (node) {
                            if (node.nodeName == "TEXTAREA" || node.nodeName == 'INPUT') { //如果是input或textarea
                                if (node.style.textShadow === '') {
                                    node.style.textShadow = 'rgba(0,0,0,0) 0 0 0'; //改变某个不可见样式，触发dom重绘
                                } else {
                                    node.style.textShadow = '';
                                }
                            }
                        }
                    }

                    function scrollEnd2(event) {
                        var moveEndX = event.changedTouches[0].pageX,
                            moveEndY = event.changedTouches[0].pageY,
                            X = moveEndX - startX,
                            Y = moveEndY - startY;

                        if (Math.abs(Y) > Math.abs(X) && Y < 0 && elem.scrollHeight === elem.scrollTop + elem.clientHeight) {

                            event.preventDefault();
                        } else if (Math.abs(Y) > Math.abs(X) && Y > 0 && elem.scrollTop == 0) {
                            event.preventDefault();
                        }

                        var node = document.activeElement; //当前focus的dom元素
                        if (node) {
                            if (node.nodeName == "TEXTAREA" || node.nodeName == 'INPUT') { //如果是input或textarea
                                if (node.style.textShadow === '') {
                                    node.style.textShadow = 'rgba(0,0,0,0) 0 0 0'; //改变某个不可见样式，触发dom重绘
                                } else {
                                    node.style.textShadow = '';
                                }
                            }
                        }
                    }

                    if ($rootScope.ios) {
                        element.on('scroll', scrollEnd);
                        element.on('touchmove', scrollEnd2);
                    }

                }
            };
        }])
        //未加载到数据时执行
        .directive('noDataLoad', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
            return {
                restrict: 'AE',
                link: function (scope, element, attr) {
                    $rootScope.endLoading();
                }
            };
        }])
        //监听循环的数据是否完成
        .directive('onFinishRenderFilters', ['$timeout', '$rootScope', function ($timeout, $rootScope) {
            return {
                restrict: 'AEC',
                link: function (scope, element, attr) {
                    if (scope.$last === true) {
                        $timeout(function () {
                            scope.$emit('ngRepeatFinished');
                        });
                    }
                    scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                        $rootScope.endLoading();
                        $rootScope.backRouter = false;
                    });
                }
            };
        }])
        .directive('htmlCompile', ['$compile', function ($compile) {
            return {
                replace: true,
                restrict: 'EA',
                link: function (scope, elm, iAttrs) {
                    var DUMMY_SCOPE = {
                            $destroy: angular.noop
                        },
                        root = elm,
                        childScope,
                        destroyChildScope = function () {
                            (childScope || DUMMY_SCOPE).$destroy();
                        };

                    iAttrs.$observe("html", function (html) {
                        if (html) {
                            destroyChildScope();
                            childScope = scope.$new(false);
                            var content = $compile(html)(childScope);
                            root.replaceWith(content);
                            root = content;
                        }

                        scope.$on("$destroy", destroyChildScope);
                    });
                }
            };
        }])
        /*
         *	用法: 页面中<select-person person-info="test" person-title=""></select-person>
         *  exam: test是人员信息要保存在哪个对像 其中test必须是对像
         *  person-title绑定的为label名称,
         *  show-title为是否要显示person-title
         *  change-event 为change事件调用方法
         *  blur-event 为blur事件调用方法
         */
        .directive('selectPerson', ['server', 'configInfo', '$timeout', function (server, configInfo, $timeout) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    personInfo: "=",
                    fixedType: "=",
                    title: "@personTitle",
                    isAutoLoginercode: '@',
                    showTitle: "@",
                    changeEvent: '&',
                    blurEvent: '&',
                    isRequired: '@'
                },
                templateUrl: 'common/select-person.html',
                link: function (scope, elm, iAttrs) {
                    /**
                     * 搜索姓名和工号
                     * 自动完成，返回姓名和工号     *
                     * @param 姓名或工号，页面传入
                     *
                     */
                    var tempParam,
                        isFirstLoad = true; //只有初始化的时候才会带出默认值

                    scope.isRequired = scope.isRequired =='false' ? false : true;

                    scope.searchNameOrId = function (param, enter) {
                        if (tempParam != param || enter && tempParam == param) { //这个判断是解决三星A8输入法有“预测文本”功能时选择不生效的问题
                            if (param && param.length >= 2) {
                                scope.dropdown = true;
                                scope.loadApprover = true; //请求列表时显示loading
                                scope.workInfoList = [];
                                var params = {
                                    deptName: '',//'机务',
                                    param: param
                                };
                                // console.log(JSON.stringify(params));
                                server.maocGetReq('defect/findBySnOrNameOrEnName', params).then(function (data) {
                                    if (200 === data.status) {
                                        scope.workInfoList = data.data.data || [];

                                        if (!scope.personInfo.nameAndId && isFirstLoad) {
                                            //工号搜索时可能存在多个结果
                                            angular.forEach(scope.workInfoList, function (item, i) {
                                                if (item.sn == param) {
                                                    scope.personInfo.nameAndId = item.name + ' ' + item.sn;
                                                    scope.personInfo.approverName = item.name;
                                                    scope.personInfo.approverSn = item.sn;
                                                    scope.personInfo.approverId = item.id;
                                                }
                                            });

                                            isFirstLoad = false;
                                        }
                                        // console.log(scope.personInfo)
                                    }
                                    scope.loadApprover = false;
                                }).catch(function (error) {
                                    console.log(error);
                                    scope.loadApprover = false;
                                });
                            } else {
                                scope.dropdown = false;
                            }
                        }
                        tempParam = angular.copy(param);
                    }

                    //是否带出登录人信息
                    if (scope.isAutoLoginercode) {
                        scope.searchNameOrId(configInfo.userCode);
                        scope.dropdown = false;
                    }
                    /**
                     *回车搜索
                     */
                    scope.setNameId = function (e) {
                        if (e.keyCode == 13) {
                            scope.searchNameOrId(scope.personInfo.nameAndId, true);
                        }
                        var nameAndId = scope.personInfo.nameAndId;
                        scope.personInfo.nameAndId = nameAndId && nameAndId.replace(/[^a-zA-Z0-9\s\u4E00-\u9FA5]/g, '')
                    };

                    if(!angular.isDefined(iAttrs.blurEvent)){
                        scope.blurEvent = function(e){
                           // if(!scope.isListMove){
                                $timeout(function(){
                                    scope.dropdown = false;
                                }, 400)
                           // }
                           // scope.isListMove = false;
                        }
                    }
                }
                //transclude: true,
            };
        }])
        /*addmr(和新建故障) 姓名工号自动完成功能
         *
         */
        .directive('onInput', ['$rootScope', '$localForage', '$timeout', function ($rootScope, $localForage, $timeout) {
            return {
                restrict: 'AE',
                link: function (scope, element, attr) {
                    var timerId = null;
                    element.on('input', function (event) {
                        //scope.$apply(function () {
                            var approverName, approverSn;
                            /**
                             * Approver中修改重新赋值
                             * 不然界面中显示与提交值不一致
                             */
                            if (!angular.isObject(scope.personInfo)) {
                                scope.personInfo = {};
                            }

                            if (scope.personInfo.approverSn) {
                                var tempArr = scope.personInfo.nameAndId && scope.personInfo.nameAndId.split(' ');
                                if (!scope.tempApproverName) {
                                    scope.tempApproverName = localStorage.getItem('tempApproverName');
                                    scope.tempApproverSn = localStorage.getItem('tempApproverSn');
                                }

                                if (tempArr && (scope.tempApproverName != tempArr[0] || scope.tempApproverSn != tempArr[1])) {
                                    scope.diffName = true;
                                    approverName = '';
                                    //approverSn = '';
                                } else {
                                    scope.diffName = false;
                                    approverName = tempArr && tempArr[0];
                                    approverSn = tempArr && tempArr[1];
                                }
                            } else {
                                approverName = scope.personInfo.nameAndId;
                                approverSn = '';
                            }

                            scope.personInfo.approverName = approverName;
                            //scope.personInfo.approverSn = approverSn;
                            scope.personInfo.diffName = scope.diffName;

                            $timeout.cancel(timerId);
                            timerId = $timeout(function () {
                                if (scope.personInfo.nameAndId) {
                                    scope.searchNameOrId(scope.personInfo.nameAndId);
                                }
                            }, 300);
                        //})
                    });
                }
            };
        }])
        .directive('workInfoSelect', ['$rootScope', 'configInfo','$timeout', function ($rootScope, configInfo, $timeout) {
            return {
                restrict: 'AEC',
                link: function (scope, element, attr) {
                    element.on('touchstart', function(e){
                        scope.$parent.isListMove = false;
                    });

                    element.on('touchmove', function(e){
                        scope.$parent.isListMove = true;
                    });

                    element.on('touchend', function (e) {
                        if(scope.$parent.isListMove){
                            return false;
                        }

                        //$timeout(function () {
                        $timeout(function(){  //延迟为了解决touch事件点透问题
                            scope.$parent.dropdown = false;
                        }, 330)

                        var cnName = scope.item.name,
                            workNo = scope.item.sn,
                            workId = scope.item.id;
                        scope.$parent.personInfo.nameAndId = cnName + ' ' + workNo;
                        scope.$parent.personInfo.approverName = cnName;
                        scope.$parent.personInfo.approverSn = workNo;
                        scope.$parent.personInfo.approverId = workId;

                        //输入值对比时使用
                        scope.$parent.tempApproverName = cnName;
                        scope.$parent.tempApproverSn = workNo;
                        scope.$parent.tempApproverId = workId;
                        localStorage.setItem('tempApproverName', cnName);
                        localStorage.setItem('tempApproverSn', workNo);
                        localStorage.setItem('tempApproverId', workId);
                        scope.$parent.diffName = false;
                        scope.personInfo.diffName = false;
                    });
                }
            };
        }])
        /*
         *	用法: 页面中<select-station station-info="test"></select-station>
         *  exam: test是航站信息要保存在哪个对像 其中test必须是对像
         */
        .directive('selectStation', ['server', 'configInfo','$timeout', '$rootScope', function (server, configInfo, $timeout, $rootScope) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    stationInfo: "=",
                    title: "=",
                    isMustSelect: "@",
                },
                templateUrl: 'common/select-station.html',
                link: function (scope, elm, iAttrs) {

                    /**
                     * 搜索航站
                     */
                    scope.getStation = function () {
                        if(navigator.userAgent.indexOf("Android") > -1){
                            scope.isAndroid = true;
                        }
                        if (scope.stationInfo.station) {
                            scope.dropdownStation = true;
                            scope.loadStaiton = true; //请求列表时显示loading
                            scope.stationList = [];
                            server.maocGetReq('mr/getMe2MRMaximoLocation', {
                                station: angular.uppercase(scope.stationInfo.station),
                                pageIndex: 1,
                                pageSize: 10
                            }).then(function (data) {
                                if (200 === data.status) {
                                    scope.stationList = data.data.data || [];
                                }
                                scope.loadStaiton = false;
                            }).catch(function (error) {
                                console.log(error);
                                scope.loadStaiton = false;
                            });
                        } else {
                            scope.stationInfo.station = '';
                            scope.dropdownStation = false;
                        }
                    }

                    scope.startSelect = function(){
                        scope.isScrollStaionList = false;
                    };

                    scope.scrollStationList = function(){
                        // console.log('scoll');
                        scope.isScrollStaionList = true;
                    };

                    /*选择航站*/
                    scope.clickSelectStation = function (station,ac,description) {
                        // console.log('touchend')
                        if(scope.isScrollStaionList){ //滚动下拉框时不做操作
                            return false;
                        }

                        scope.stationSelected = true;
                        scope.dropdownStation = false;
                        scope.stationInfo.station = station || ac;
                        //scope.station = station;
                    };

                    /*如果没有选择航站,失去焦点时清空输入的值*/
                    scope.checkStation = function (event) {
                        // console.log('blur');
                        var curTarget = angular.element(event.target);
                        (!scope.stationSelected && scope.isMustSelect) && (scope.stationInfo.station = '');
                        scope.stationSelected = false;

                        //if($rootScope.android){
                            scope.dropdownStation = false;
                        //}else{
                        //    $timeout(function(){
                        //        if(!scope.isScrollStaionList){
                        //            scope.dropdownStation = false;
                        //        }
                        //        scope.isScrollStaionList = false;
                        //    }, 400)
                        //}

                    }
                }
            };
        }])
        //选择站点，飞机号，返回仓库数据***********
        /*
         *	用法: 页面中<select-station station-info="test"></select-station>
         *  exam: test是航站信息要保存在哪个对像 其中test必须是对像
         */
        .directive('selectStationStore', ['server', 'configInfo','$timeout', '$rootScope', function (server, configInfo, $timeout, $rootScope) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    stationInfo: "=",
                    title: "=",
                    isMustSelect: "@",
                },
                templateUrl: 'common/select-station.html',
                link: function (scope, elm, iAttrs) {

                    /**
                     * 搜索航站
                     */
                    scope.getStation = function () {
                        if(navigator.userAgent.indexOf("Android") > -1){
                            scope.isAndroid = true;
                        }
                        if (scope.stationInfo.station) {
                            scope.dropdownStation = true;
                            scope.loadStaiton = true; //请求列表时显示loading
                            scope.stationList = [];
                            server.maocGetReq('mr/getMe2MRMaximoLocation', {
                                station: angular.uppercase(scope.stationInfo.station),
                                pageIndex: 1,
                                pageSize: 10
                            }).then(function (data) {
                                if (200 === data.status) {
                                    scope.stationList = data.data.data || [];
                                }
                                scope.loadStaiton = false;
                            }).catch(function (error) {
                                console.log(error);
                                scope.loadStaiton = false;
                            });
                        } else {
                            scope.stationInfo.station = '';
                            scope.stationInfo.storeLoc = '';
                            scope.dropdownStation = false;
                        }
                    }

                    scope.startSelect = function(){
                        scope.isScrollStaionList = false;
                    };

                    scope.scrollStationList = function(){
                        // console.log('scoll');
                        scope.isScrollStaionList = true;
                    };

                    /*选择航站*/
                    scope.clickSelectStation = function (station,ac,description,storeLoc) {
                        // console.log('touchend')
                        if(scope.isScrollStaionList){ //滚动下拉框时不做操作
                            return false;
                        }

                        scope.stationSelected = true;
                        scope.dropdownStation = false;
                        scope.stationInfo.station = station || ac;
                        scope.stationInfo.storeLoc =storeLoc;
                        //scope.station = station;
                    };

                    /*如果没有选择航站,失去焦点时清空输入的值*/
                    scope.checkStation = function (event) {
                        // console.log('blur');
                        var curTarget = angular.element(event.target);
                        (!scope.stationSelected && scope.isMustSelect) && (scope.stationInfo.station = '');
                        (!scope.stationSelected && scope.isMustSelect) && (scope.stationInfo.storeLoc = '');
                        scope.stationSelected = false;

                        //if($rootScope.android){
                        scope.dropdownStation = false;
                        //}else{
                        //    $timeout(function(){
                        //        if(!scope.isScrollStaionList){
                        //            scope.dropdownStation = false;
                        //        }
                        //        scope.isScrollStaionList = false;
                        //    }, 400)
                        //}

                    }
                }
            };
        }])
        //************
        .directive('selectStationThree', ['server', 'configInfo','$timeout','$rootScope', function (server, configInfo, $timeout,$rootScope) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    stationInfo: "=",
                    isMustSelect: "@",
                    title:'='
                },
                templateUrl: 'common/select-station3Code.html',
                link: function (scope, elm, iAttrs) {
                    /**
                     * 搜索航站
                     */
                    scope.getStation = function () {
                        if(navigator.userAgent.indexOf("Android") > -1){
                            scope.isAndroid = true;
                        }
                        console.log(scope.isAndroid,'scope.isAndroid')
                        if (scope.stationInfo.station) {
                            scope.dropdownStation = true;
                            scope.loadStaiton = true; //请求列表时显示loading
                            scope.stationList = [];
                            // server.maocGetReq('TBM/findStaBySta', {
                            server.maocGetReq('TBM/findTbmStationsByAirport3Code', {
                                airport3Code: angular.uppercase(scope.stationInfo.station)
                            }).then(function (data) {
                                // console.log(JSON.stringify(data));
                                if (200 == data.status) {
                                    scope.stationList = data.data.data || [];
                                }
                                scope.loadStaiton = false;
                            }).catch(function (error) {
                                console.log(error);
                                scope.loadStaiton = false;
                            });
                        } else {
                            scope.stationInfo.station = '';
                            scope.dropdownStation = false;
                        }
                    };

                    scope.startSelect = function(){
                        scope.isScrollStaionList = false;
                    }

                    scope.scrollStationList = function(){
                        scope.isScrollStaionList = true;
                    }

                    /*选择航站*/
                    scope.clickSelectStation = function (station) {
                        if(scope.isScrollStaionList){ //滚动下拉框时不做操作
                            return false;
                        }

                        scope.stationSelected = true;
                        scope.dropdownStation = false;
                        scope.stationInfo.station = station;
                        //scope.station = station;
                    }

                    /*如果没有选择航站,失去焦点时清空输入的值*/
                    scope.checkStation = function (event) {
                        var curTarget = angular.element(event.target);
                        if (!scope.stationSelected && scope.isMustSelect) {
                            //scope.station = '';
                            scope.stationInfo.station = '';
                        }

                        scope.stationSelected = false;

                        //if(!scope.isScrollStaionList){
                        //$timeout(function(){
                        scope.dropdownStation = false;
                        //}, 400)
                        //}
                        scope.isScrollStaionList = false;
                    }
                }
            };
        }])
        .directive('selectZone', ['server', 'configInfo','$timeout', '$rootScope', function (server, configInfo, $timeout, $rootScope) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    zoneInfo: "="
                },
                templateUrl: 'common/select-zone.html',
                link: function (scope, elm, iAttrs) {

                    /**
                     * 搜索航站
                     */
                    scope.getZone = function () {
                        // console.log("-------------------搜索区域----------------");
                        // console.log(JSON.stringify(scope.zoneInfo));
                        // console.log("-------------------搜索区域完----------------");
                        if (scope.zoneInfo.zone_no) {
                            scope.dropdownStation = true;
                            scope.loadStaiton = true; //请求列表时显示loading
                            scope.zoneList = [];
                            scope.loadApprover = true; //请求列表时显示loading
                            server.maocGetReq('defect/queryZoneList', {
                                inputZoneNoOrArea:scope.zoneInfo.zone_no,
                                model:scope.zoneInfo.zone_model||""
                            }).then(function (data) {
                                scope.loadApprover = false;
                                if (200 === data.status) {
                                    scope.zoneList = data.data.data || [];
                                }
                                scope.loadStaiton = false;
                            }).catch(function (error) {
                                console.log(error);
                                scope.loadApprover = false;
                                scope.loadStaiton = false;
                            });
                        } else {
                            scope.zoneInfo.zone = '';
                            scope.dropdownStation = false;
                        }
                        scope.zoneSelected = false;
                    };
                    elm.on('touchmove', function(e){

                        scope.isScrollStaionList = true;
                    });
                    scope.startSelect = function(){

                        scope.isScrollStaionList = false;
                    };

                    scope.scrollStationList = function(){

                        scope.isScrollStaionList = true;
                    };

                    /*选择航站*/
                    scope.clickSelectStation = function (zoneId,zoneNo) {

                        if(scope.isScrollStaionList){ //滚动下拉框时不做操作
                            return false;
                        }

                        scope.zoneSelected = true;
                        scope.zoneInfo.zone_id = zoneId;
                        scope.zoneInfo.zone_no = zoneNo;
                        setTimeout(function () {
                            scope.dropdownStation = false;
                        },200)
                    };

                    /*如果没有选择航站,失去焦点时清空输入的值*/
                    scope.checkZone = function (event) {
                        // console.log('blur');
                        if(!scope.zoneSelected){
                            scope.zoneInfo.zone_id = "";
                            scope.zoneInfo.zone_no = "";
                            scope.zoneSelected = false;
                        }
                        var curTarget = angular.element(event.target);
                        (!scope.zoneSelected) && (scope.zoneInfo.zone = '');
                        scope.dropdownStation = false;
                    }
                }
            };
        }])
        .directive('ewis', ['server', 'configInfo','$timeout', '$rootScope','b64ToBlob', function (server, configInfo, $timeout, $rootScope,b64ToBlob) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    ewisShow: "=",//显示/隐藏标识符
                    state: '=', //0新建 1编辑 2详情 -1无效
                    ewisDto: '=',//ewis数组
                    index: '=',//编辑或详情项目下标
                    ewisInfo: '=',
                    isEdit: '=',
                    acReg:'='
                },
                templateUrl: 'common/ewis.html',
                link: function (scope, elm, iAttrs) {

                    scope.ewisInfo = {
                        "id":'',
                        "componentName": '',
                        "componentType":'',//部件类型
                        "allNumber":"",//pn/sn/线号/设备号
                        "pn":"",
                        "ewisType":"",//ewis类型（磨损/破损、割伤/划伤）
                        "otherDescription":"",
                        "otherDflcDes":"",
                        "staWlBl":"",//STA/WL/BL
                        "lineEquipmentType":"",
                        "defectLocation":"",
                        "treatmentMethod":"",
                    };

                    scope.isApiCloud = true;
                    scope.imgArr = [];  //页面预览所用文件
                    scope.fileArr = [];  //要上传的二进制流
                    scope.delImgId = [];
                    scope.delId = [];
                    scope.maxImgCount = 5;

                    scope.info = {
                        "ewisSecTypes":
                            [
                                {
                                    componentType:1,
                                    componentName:'线号'
                                },
                                {
                                    componentType:2,
                                    componentName:'设备号'
                                }

                            ],
                        "treatType":[
                            {
                                value:1,
                                text:'接线处理'
                            },
                            {
                                value:2,
                                text:'更换'
                            },
                            {
                                value:3,
                                text:'其他标准处理'
                            },
                        ],
                        "ewisDefectType":[
                            // {
                            //     value:1,
                            //     text:'驾驶舱'
                            // },
                            // {
                            //     value:2,
                            //     text:'前轮舱'
                            // },
                            // {
                            //     value:3,
                            //     text:'左主轮舱'
                            // },
                            // {
                            //     value:4,
                            //     text:'右主轮舱'
                            // },
                        ],
                        "ewisTypes":
                            [],
                        "flawTypes" :
                            [{"flawType":"磨损/破损",selected:false, number:0},
                                {"flawType":"割伤/划伤",selected:false, number:1},
                                {"flawType":"污染/腐蚀",selected:true, number:2},
                                {"flawType":"部件丢失 ",selected:false, number:3},
                                {"flawType":"松动",selected:false, number:4},
                                {"flawType":"烧蚀",selected:false, number:5},
                                {"flawType":"功能故障/损坏",selected:false, number:6},
                                {"flawType":"其他缺陷",selected:false, number:7},
                                {"flawType":"断裂/断丝",selected:false, number:8},
                                {"flawType":"非标准施工",selected:false, number:9}
                            ],
                        "otherFlawTxt": "",
                        "showOtherFlawTxt":false,
                        "selectedEwisTypes":scope.ewisInfo.ewisType.length > 0 ? scope.ewisInfo.ewisType.split(',') : [],//数字数组
                        "selectedFlawTypesItems": [],
                        "pnNo": "",
                        "sta": "",
                        "extLineNumList":[
                            {
                                lineNum1:'',
                                lineNum2:'',
                                lineNum3:'',
                                lineNum4:'',
                            }
                        ]
                    };


                    scope.flawTypeChanged = function () {

                        //确定是否显示其它位置输入框
                        var ind = scope.info.selectedEwisTypes.indexOf('7');
                        scope.info.showOtherFlawTxt = ind==-1?false:true;

                        //将数组内容转化为字符串
                        if (scope.info.selectedEwisTypes.length > 0) {
                            scope.ewisInfo.ewisType = scope.info.selectedEwisTypes.join(',');
                        }
                        else {
                            scope.ewisInfo.ewisType = '';
                        }

                        //更新显示数组
                        scope.info.selectedFlawTypesItems = [];

                        if (scope.info.selectedEwisTypes.length > 0) {

                            for (var i =0 ; i < scope.info.selectedEwisTypes.length; i ++) {

                                var indexStr = scope.info.selectedEwisTypes[i];
                                var index = parseInt(indexStr);
                                var item = scope.info.flawTypes[index];
                                scope.info.selectedFlawTypesItems.push(item);
                            }
                        }
                    };

                    scope.flawTypeChanged();

                    scope.getEwisTypeOptions = function () {
                        server.maocGetReq('assembly/analysisDomainTypeByCode', {domainCode:'DEFECT_LOCATION'}).then(function (data) {
                            if (data.data.statusCode == 200) {
                                scope.info.ewisDefectType = data.data.data[0].DEFECT_LOCATION;
                            }

                        }).catch(function (error) {

                        });
                        server.maocGetReq('defect/queryComponentList').then(function (res) {
                            // console.log('defect/queryComponentList' + JSON.stringify(res));
                            
                            if (res.data.statusCode == 200) {

                                if (res.data.data.length > 0) {
                                    var firstItem = res.data.data[0];
                                    scope.ewisInfo.componentType = firstItem.componentType;
                                    scope.info.ewisTypes = res.data.data;
                                }
                            }

                        });
                    };
                    scope.getEwisTypeOptions();

                    function validateLine(val){
                        return val ? val :'0'
                    }
                    scope.ewisSure = function () {
                        if (scope.state == 0) {
                            scope.submitEwis();
                        }
                        else if(scope.state == 1) {
                            // var copyEwisInfo = angular.copy(scope.ewisInfo);
                            // scope.ewisDto.splice(index,1,copyEwisInfo);
                            scope.submitEwis();
                        }
                    };
                    scope.addLine = function(){
                        var obj = {
                            lineNum1:'',
                            lineNum2:'',
                            lineNum3:'',
                            lineNum4:'',
                        }
                        scope.info.extLineNumList.push(obj);
                    };
                    scope.deleteLine = function(event,index,item){
                        (scope.info.extLineNumList.length > 1)&& scope.info.extLineNumList.splice(index,1);
                        if(scope.state == 1) {
                            item.id && scope.delId.push(item.id);
                        }
                    };
                    scope.checkFirst = function(lineNum1,i){
                        var pattern = new RegExp("^[a-zA-Z]+$");
                        if(!pattern.test(lineNum1)){
                            // alert(i);
                            alert('只能是字母');
                            scope.info.extLineNumList[i].lineNum1 = '';
                        }
                    };
                    scope.submitEwis = function() {
                        var tempImg = [];
                        if (scope.state == 0) {
                            tempImg = scope.fileArr;
                        }
                        else if(scope.state == 1) {
                            tempImg = scope.fileArr.filter(function(item, index){
                                var curItem = String(item);
                                return curItem.indexOf('/') != -1 && curItem.indexOf('.') != -1;
                            });
                        }
                        var params = {
                            "id":scope.ewisInfo.id || '',
                            "componentType":scope.ewisInfo.componentType,//部件类型id
                            "allNumber":scope.ewisInfo.allNumber,//pn/sn/线号/设备号
                            "pn":scope.ewisInfo.pn,
                            "ewisType":scope.ewisInfo.ewisType,//ewis类型（磨损/破损、割伤/划伤）
                            "otherDescription":scope.ewisInfo.otherDescription,
                            "otherDflcDes":scope.ewisInfo.defectLocation == 5 ? scope.ewisInfo.otherDflcDes:'',
                            "staWlBl":scope.ewisInfo.staWlBl,
                            "tlbId":$rootScope.z_tlbId || "",
                            "lineEquipmentType":scope.ewisInfo.lineEquipmentType,
                            "defectLocation":scope.ewisInfo.defectLocation,
                            "treatmentMethod":scope.ewisInfo.treatmentMethod,
                            "extLineNumList":scope.info.extLineNumList,
                            // "lineNum1":scope.ewisInfo.lineNum1 && scope.ewisInfo.lineNum1.toUpperCase(),
                            // "lineNum2":scope.ewisInfo.lineNum2 && scope.ewisInfo.lineNum2.toUpperCase(),
                            // "lineNum3":scope.ewisInfo.lineNum3 && scope.ewisInfo.lineNum3.toUpperCase(),
                            // "lineNum4":scope.ewisInfo.lineNum4 && scope.ewisInfo.lineNum4.toUpperCase(),
                        };
                        if(params.lineEquipmentType == 1){
                            for(var i = 0 ; i < params.extLineNumList.length ; i++){
                                params.extLineNumList[i].lineNum1 = params.extLineNumList[i].lineNum1 && params.extLineNumList[i].lineNum1.toUpperCase();
                                params.extLineNumList[i].lineNum2 = params.extLineNumList[i].lineNum2 && params.extLineNumList[i].lineNum2.toUpperCase();
                                params.extLineNumList[i].lineNum3 = params.extLineNumList[i].lineNum3 && params.extLineNumList[i].lineNum3.toUpperCase();
                                params.extLineNumList[i].lineNum4 = params.extLineNumList[i].lineNum4 && params.extLineNumList[i].lineNum4.toUpperCase();
                                if(params.extLineNumList[i].lineNum1.trim() == ''){
                                    alert('线号第一栏必填');
                                    return ;
                                }
                                if(params.extLineNumList[i].lineNum2.trim() == ''){
                                    alert('线号第二栏必填');
                                    return ;
                                }
                                if(params.extLineNumList[i].lineNum3.trim() == ''){
                                    alert('线号第三栏必填');
                                    return ;
                                }
                                if(params.extLineNumList[i].lineNum4.trim() == ''){
                                    alert('线号第四栏必填');
                                    return ;
                                }
                            }

                        }else {
                            params.extLineNumList && delete params.extLineNumList;

                        }
                        if(params.treatmentMethod == 1 && params.lineEquipmentType == 1){
                            var regLine = /^[0]+/
                            var delArr = new Array();
                            for(var i = 0 ; i < params.extLineNumList.length ; i++) {
                                delArr[0] = params.id;
                                var ewisCheckDate = {
                                    acReg:scope.acReg,
                                    lineNum:params.extLineNumList[i].lineNum1 + '-' + validateLine(params.extLineNumList[i].lineNum2.replace(regLine,"")) + '-' + validateLine(params.extLineNumList[i].lineNum3.replace(regLine,"")) + '-' + validateLine(params.extLineNumList[i].lineNum4.replace(regLine,"")),
                                    ids:delArr
                                };
                                if(scope.acReg){
                                    server.maocPostReq('TLB/getIsLineNumRepeatFlag',ewisCheckDate,true).then(function (data) {
                                        if (200 == data.data.statusCode) {
                                            var flag = data.data.data[0];
                                            flag && ($rootScope.errTip = '新增接线管不应超过3个，该导线已进行过接线处理，请核实')
                                        }

                                    }).catch(function (error) {
                                        console.log(error);
                                        // alert('Ewis信息失败');
                                    });
                                }
                            }



                        }


                        var delAttaId = scope.delImgId.join(',');
                        if (scope.state == 1) {
                            params.delAttaId = delAttaId;
                            params.delIds = scope.delId.length > 0 ? scope.delId.toString() :'';
                        }

                        $rootScope.startLoading();

                        if (tempImg.length > 0) {
                            MEAPI.formdataPostImg('form/submit', 'tlb-005-a', params, tempImg).then(function (data) {
                                $rootScope.endLoading();
                                if (200 == data.statusCode) {
                                    scope.ewisInfo = data.data[0];
                                    // scope.ewisInfo.extLineNumList && delete scope.ewisInfo.extLineNumList;
                                    var copyEwisInfo = angular.copy(scope.ewisInfo);
                                    console.info(copyEwisInfo,'copyEwisInfo')
                                    if (scope.state == 0) {
                                        scope.ewisDto.push(copyEwisInfo);
                                    }
                                    else if (scope.state == 1) {
                                        angular.forEach(scope.ewisDto,function (item,index) {
                                            if (item.id == copyEwisInfo.id) {
                                                // console.log('遍历数组下标' + index);
                                                scope.ewisDto.splice(index,1,copyEwisInfo);
                                            }
                                        });
                                    }
                                }
                                scope.$apply(function () {
                                    scope.ewisShow = false;
                                });

                            }).catch(function (error) {
                                api.alert({
                                    msg: error.body['.'] || error.body
                                });
                                scope.$apply(function () {
                                    $rootScope.endLoading();
                                });
                            });
                        }
                        else {
                            server.maocFormdataPost('form/submit', 'tlb-005-a', params, []).then(function (result) {
                                $rootScope.endLoading();
                                var data = result.data;
                                if (200 == data.statusCode) {
                                    scope.ewisInfo = data.data[0];
                                    var copyEwisInfo = angular.copy(scope.ewisInfo);

                                    if (scope.state == 0) {
                                        scope.ewisDto.push(copyEwisInfo);
                                    }
                                    else if (scope.state == 1) {
                                        angular.forEach(scope.ewisDto,function (item,index) {
                                            if (item.id == copyEwisInfo.id) {
                                                console.log('遍历数组下标' + index);
                                                scope.ewisDto.splice(index,1,copyEwisInfo);
                                            }
                                        });
                                    }
                                }
                                scope.ewisShow = false;

                                // scope.$apply(function () {
                                //     scope.ewisShow = false;
                                // });
                            }).catch(function (error) {
                                api.alert({
                                    msg: error.body['error_description'] || error.body
                                });
                                $rootScope.endLoading();
                                scope.$apply()
                            });
                        }

                    };

                    scope.getEwisDetail = function(ewisId) {
                        $rootScope.startLoading();
                        server.maocGetReq('TLB/getEwisById',{id: ewisId}).then(function (response) {
                            $rootScope.endLoading();
                            console.log('ewis详情查询' + JSON.stringify(response));
                            if(200 == response.data.statusCode) {
                                var ewis = response.data.data[0];
                                scope.ewisInfo = ewis;
                                scope.info.extLineNumList = ewis.extLineNumList;
                                //去除空格
                                scope.ewisInfo.ewisType = scope.ewisInfo.ewisType.replace(/\s+/g,"");
                                scope.fileArr = [];
                                scope.imgArr = [];
                                var ewisAttachments = ewis.ewisAttachments;
                                angular.forEach(ewisAttachments,function (item,index) {

                                    if(typeof (item.content) != 'undefined') {
                                        var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                        var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                        var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                        imgBlob.name = item.name.indexOf('down') == -1
                                            ? imgName + 'down' + imgType
                                            : item.name;
                                        imgBlob.id = item.id;
                                        scope.fileArr.push(imgBlob);
                                        scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                    }
                                });
                            }

                        }).catch(function (error) {
                            console.log(error);
                            alert('获取Ewis信息失败');
                            $rootScope.endLoading();
                        });
                    };

                    scope.ewisBack = function () {
                        scope.ewisShow = false;
                    };
                    scope.$watch('ewisInfo.componentType',function(n,o){
                        if(n == '导线/电缆'){
                            scope.ewisInfo.lineEquipmentType = 1;
                        }
                    })

                    //监听ewisinfo变化
                    scope.$watch('ewisInfo',function(n,o){
                        scope.info.selectedEwisTypes = scope.ewisInfo.ewisType.length > 0 ? scope.ewisInfo.ewisType.split(',') : [];//数字数组
                        // scope.fileArr = angular.copy(scope.ewisInfo.attachmentsKey) || [];
                        // scope.imgArr = angular.copy(scope.ewisInfo.attachmentsKey) || [];
                        if(n.componentType == '导线/电缆'){
                            scope.ewisInfo.lineEquipmentType = 1;
                        }
                        scope.flawTypeChanged();

                    });
                    //检测是否为故障查询
                    scope.$watch('ewisShow',function (n,o) {

                        // 如果存在id，则进行获取详情
                        if (n && scope.ewisInfo.id && (scope.state == 1 || scope.state == 2)) {
                            scope.getEwisDetail(scope.ewisInfo.id);
                        }
                        scope.fileArr = [];
                        scope.imgArr = [];
                        scope.delImgId = [];
                        scope.info.extLineNumList = [
                            {
                                lineNum1 : '',
                                lineNum2 : '',
                                lineNum3 : '',
                                lineNum4 : '',
                            }
                        ];

                    });

                }
            };
        }])
        .directive('oil', ['server', 'configInfo','$timeout', '$rootScope','b64ToBlob', function (server, configInfo, $timeout, $rootScope,b64ToBlob) {
            return {
                restrict: 'AE',
                replace: true,
                scope: {
                    oilShow: "=",
                    state: '=', //0新建 1编辑 2详情
                    oilDto: '=',//ewis数组
                    index: '=',//编辑或详情项目下标
                    oilInfo: '=',
                    isEdit: '='
                },
                templateUrl: 'common/oil.html',
                link: function (scope, elm, iAttrs) {

                    scope.isApiCloud = true;
                    scope.imgArr = [];  //页面预览所用文件
                    scope.fileArr = [];  //要上传的二进制流
                    scope.delImgId = [];
                    scope.maxImgCount = 5;

                    scope.oilInfo =  {
                        "id":'',
                        "oilType":"",
                        "oilLeakPosition":"",
                        "otherDescription":"",
                        "oilComponent":2,
                        "oilRecord":""
                    };

                    scope.info = {
                        "oilTypes":
                            [{name:"液压油",number:1},
                                {name:"燃油",number:2},
                                {name:"滑油",number:3}
                            ],
                        "locations" :
                            [{"location":"本体",selected:false,number:0},
                                {"location":"软管",selected:false,number:1},
                                {"location":"硬管",selected:true ,number:2},
                                {"location":"油箱",selected:false,number:3},
                                {"location":"接头",selected:false,number:4},
                                {"location":"其它",selected:false,number:5}
                            ],
                        "otherTxt": "",
                        "showOtherTxt": false,
                        "selectedLocations":scope.oilInfo.oilType.length > 0 ? scope.oilInfo.oilType.split(',') : [],//数字数组
                        "selectedLocationItems":[],
                        "engineType": ""
                    };

                    scope.selectedLocationChanged = function () {

                        //确定是否显示其它位置输入框
                        var ind = scope.info.selectedLocations.indexOf('5');
                        scope.info.showOtherTxt = ind==-1?false:true;

                        //将数组内容转化为字符串
                        if (scope.info.selectedLocations.length > 0) {
                            scope.oilInfo.oilType = scope.info.selectedLocations.join(',');
                        }
                        else {
                            scope.oilInfo.oilType = '';
                        }

                        //更新显示数组
                        scope.info.selectedLocationItems = [];

                        if (scope.info.selectedLocations.length > 0) {
                            for (var i =0 ; i < scope.info.selectedLocations.length; i ++) {

                                var indexStr = scope.info.selectedLocations[i];
                                var index = parseInt(indexStr);
                                var item = scope.info.locations[index];
                                scope.info.selectedLocationItems.push(item);
                            }
                        }

                    };

                    scope.selectedLocationChanged();

                    scope.oilSure = function () {

                        if (scope.state == 0 || scope.state == 1) {
                            scope.submitOil();
                        }
                    };
                    scope.oilBack = function () {
                        scope.oilShow = false;
                    };


                    scope.submitOil = function() {

                        var tempImg = [];
                        if (scope.state == 0) {
                            tempImg = scope.fileArr;
                        }
                        else if(scope.state == 1) {
                            tempImg = scope.fileArr.filter(function(item, index){
                                var curItem = String(item);
                                return curItem.indexOf('/') != -1 && curItem.indexOf('.') != -1;
                            });
                        }
                        var params = {
                            "id":scope.oilInfo.id || '',
                            "oilType":scope.oilInfo.oilType,//部件类型id
                            "oilLeakPosition":scope.oilInfo.oilLeakPosition,//pn/sn/线号/设备号
                            "otherDescription":scope.oilInfo.otherDescription,//ewis类型（磨损/破损、割伤/划伤）
                            "oilComponent":scope.oilInfo.oilComponent,
                            "oilRecord":scope.oilInfo.oilRecord,
                            "tlbId":$rootScope.z_tlbId || ""
                        };
                        var delAttaId = scope.delImgId.join(',');
                        if (scope.state == 1) {
                            params.delAttaId = delAttaId;
                        }

                        $rootScope.startLoading();

                        if (tempImg.length > 0 ) {
                            MEAPI.formdataPostImg('form/submit', 'tlb-005-b', params, tempImg).then(function (data) {
                                $rootScope.endLoading();
                                if (200 == data.statusCode) {
                                    scope.oilInfo = data.data[0];
                                    var copyOilInfo = angular.copy(scope.oilInfo);
                                    scope.fileArr = [];
                                    scope.imgArr = [];

                                    if (scope.state == 0) {
                                        scope.oilDto.push(copyOilInfo);
                                    }
                                    else if(scope.state == 1) {
                                        // var copyOilInfo = angular.copy(scope.oilInfo);
                                        // scope.oilDto.splice(index,1,copyOilInfo);
                                        angular.forEach(scope.oilDto,function (item,index) {
                                            if (item.id == copyOilInfo.id) {
                                                // console.log('遍历数组下标' + index);
                                                scope.oilDto.splice(index,1,copyOilInfo);
                                            }
                                        });
                                    }
                                }
                                scope.$apply(function () {
                                    scope.oilShow = false;
                                });


                            }).catch(function (error) {
                                api.alert({
                                    msg: error.body['error_description'] || error.body
                                });
                                scope.$apply(function () {
                                    $rootScope.endLoading();
                                });
                            });
                        }
                        else {
                            server.maocFormdataPost('form/submit', 'tlb-005-b', params, []).then(function (result) {
                                $rootScope.endLoading();
                                var data = result.data;
                                if (200 == data.statusCode) {
                                    scope.oilInfo = data.data[0];
                                    var copyOilInfo = angular.copy(scope.oilInfo);
                                    scope.fileArr = [];
                                    scope.imgArr = [];

                                    if (scope.state == 0) {
                                        scope.oilDto.push(copyOilInfo);
                                    }
                                    else if(scope.state == 1) {
                                        angular.forEach(scope.oilDto,function (item,index) {
                                            if (item.id == copyOilInfo.id) {
                                                console.log('遍历数组下标' + index);
                                                scope.oilDto.splice(index,1,copyOilInfo);
                                            }
                                        });
                                    }
                                }
                                scope.oilShow = false;

                            }).catch(function (error) {
                                api.alert({
                                    msg: error.body['error_description'] || error.body
                                });
                                $rootScope.endLoading();
                            });
                        }

                    };



                    scope.getOilDetail = function(oilId) {
                        $rootScope.startLoading();
                        server.maocGetReq('TLB/getOilById',{id: oilId}).then(function (response) {
                            $rootScope.endLoading();
                            console.log(JSON.stringify(response.data));
                            if(200 == response.data.statusCode) {
                                var oil = response.data.data[0];
                                scope.oilInfo = oil;
                                scope.fileArr = [];
                                scope.imgArr = [];
                                var oilAttachments = oil.oilAttachments;
                                scope.oilInfo.oilComponent = parseInt(oil.oilComponent);
                                //去除空格
                                scope.oilInfo.oilType = scope.oilInfo.oilType.replace(/\s+/g,"");
                                angular.forEach(oilAttachments,function (item,index) {

                                    if(typeof (item.content) != 'undefined') {
                                        var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                        var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                        var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                        imgBlob.name = item.name.indexOf('down') == -1
                                            ? imgName + 'down' + imgType
                                            : item.name;
                                        imgBlob.id = item.id;
                                        scope.fileArr.push(imgBlob);
                                        scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                    }
                                });
                            }

                        }).catch(function (error) {
                            console.log(JSON.stringify(error));
                            alert('获取油液渗漏信息失败');
                            $rootScope.endLoading();
                        });
                    };


                    scope.$watch('oilInfo',function(){
                        scope.info.selectedLocations = scope.oilInfo.oilType.length > 0 ? scope.oilInfo.oilType.split(',') : [];//数字数组
                        // console.log('燃油类型为' + JSON.stringify( scope.info.selectedLocations));
                        // console.log('燃油' + scope.oilInfo.oilType);
                        scope.selectedLocationChanged();
                    });

                    scope.$watch('oilShow',function (n,o) {

                        // 如果存在id，则进行获取详情
                        if (n && scope.oilInfo.id && (scope.state == 1 || scope.state == 2)) {
                            scope.getOilDetail(scope.oilInfo.id);
                        }
                        if (!n) {
                            scope.fileArr = [];
                            scope.imgArr = [];
                            scope.delImgId = [];
                        }

                    });
                }
            };
        }])
        //此指令解决ios中文输入法输入英文时view与model数据不一致的问题
        .directive('textarea', ['$parse', function ($parse) {
            return {
                restrict: 'E',
                link: function (scope, elm, attrs) {
                    elm.on('blur', function(){
                        $parse(attrs.ngModel).assign(scope, elm[0].value);
                    })

                }
            }
        }]);

    require('./mr/mr.js');
    require('./flightInfo/flight.js');
    require('./me/me.js');
    require('./tool/tool.js');
    require('./common/common.js');
    require('./ddi/ddi.js');
    require('./common/fault.js');
    require('./cc/install.js');
    require('./cc/remove.js');
    require('./cc/replace.js');
    require('./cc/swap.js');
    require('./cc/pn-select.js');
    require('./nrc/nrcpn-select.js');
    require('./oilEwis/oil-ewis.js');
    require('./damage/damage.js');
    require('./special-vehicle/sv.js');
    require('./common/select-ata.js');
    require('./cc/engpn-select.js');

})();
