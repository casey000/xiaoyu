angular.module('myApp')
    .directive('selectAta', ['server', '$timeout', function (server, $timeout) {
        return {
            restrict: 'E',
            scope: {
                ataInfo: "=",
                isDisable:"="
            },
            templateUrl: 'common/select-ata.html',
            link: function (scope, elm, iAttrs) {
                var tempParam;
                //scope.$parent.pnInfo.partno = scope.$parent.source.offPn;
                //scope.pnInfo.partno = scope.$parent.source.offPn;
                //scope.isSelect = false;
                scope.searchPartNo = function (param, enter) {
                    //这个判断是解决三星A8输入法有“预测文本”功能时选择不生效的问题
                    if (tempParam != param || enter && tempParam == param) {
                        if (param && param.length >= 2) {
                            scope.dropdown = true;
                            scope.loadPartNo = true; //请求列表时显示loading
                            scope.partNoList = [];
                            var params = {
                                chapter: param
                            };
                            server.maocGetReq('assembly/selectATA', params).then(function (data) {
                                if (200 === data.status) {
                                    scope.partNoList = data.data.data || [];
                                    scope.dropdown = true;
                                    // console.info(scope.dropdown,'dropdown');
                                    // console.info(scope.partNoList,'partNoList');
                                }
                                scope.loadPartNo = false;
                            }).catch(function (error) {
                                console.log(error);
                                scope.loadPartNo = false;
                            });
                        } else {
                            scope.dropdown = false;
                        }
                    }
                    tempParam = angular.copy(param);
                };

                /**
                 *回车搜索
                 */
                scope.setPartNo = function (e) {
                    if (e.keyCode == 13) {
                        scope.searchPartNo(scope.ataInfo, true);
                    }
                    var partno = scope.ataInfo;
                    scope.ataInfo = partno && partno.replace(/[^a-zA-Z0-9\s|^\-]/g, '');
                };


                // $timeout(function(){
                //     scope.dropdown = false;
                // }, 400)
                //scope.isPnListMove = false;
            }
        };
    }])
    .directive('ataInput', ['$rootScope', '$localForage', function ($rootScope, $localForage) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('input', function () {
                    scope.$apply(function () {
                        scope.searchPartNo(scope.ataInfo);
                    })
                });
            }
        };
    }])
    .directive('ataInfoSelect', ['$rootScope', 'configInfo', function ($rootScope, configInfo) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('touchstart', function(e){
                    scope.$parent.isPnListMove = false;
                });

                element.on('touchmove', function(e){
                    scope.$parent.isPnListMove = true;
                })

                element.on('touchend', function() {

                    //scope.$parent.selectedPn = true;
                    if(scope.$parent.isPnListMove){
                        return false;
                    }

                    scope.$apply(function(){
                        //scope.$parent.pnInfo.isSelectPn = true; //不选择下拉出的内容,不允许提交
                        scope.blurEvent = function(){
                            $timeout(function(){
                                $scope.$parent.dropdown = false;
                            }, 400)
                        }
                        scope.$parent.ataInfo = scope.item;

                        //输入值对比时使用
                        // scope.$parent.temppartno = scope.item.partno;
                        // localStorage.setItem('temppartno',scope.item.partno);
                        // scope.$parent.diffName = false;
                    })
                });
            }
        };
    }])


    .directive('selectAtaTitle', ['server', '$timeout', function (server, $timeout) {
        return {
            restrict: 'E',
            scope: {
                ataInfo: "=",
                model:"=",
                engine:"=",
                isDisable:"=",
                point:"@"
            },
            templateUrl: 'common/select-ata-title.html',
            link: function (scope, elm, iAttrs) {
                var tempParam;
                scope.searchPartNoTitle = function (param, enter) {
                    //这个判断是解决三星A8输入法有“预测文本”功能时选择不生效的问题
                    if (tempParam != param || enter && tempParam == param) {
                        if (param && param.length >= 2) {
                            scope.dropdown = true;
                            scope.loadPartNo = true; //请求列表时显示loading
                            scope.partNoList = [];
                            var params = {
                                fleet:scope.model||"",
                                engine:scope.engine||"",
                                ata: param
                            };
                            console.log("ATA请求参数"+JSON.stringify(params));
                            server.maocPostReq('assembly/selectBmManualAtaByFleetAndAta', params).then(function (data) {
                                if (200 === data.status) {
                                    scope.ataList =  data.data.data[0] || [];
                                    // console.log("1"+JSON.stringify(scope.ataList));
                                    scope.ataData = [];
                                    for (var i = 0; i < scope.ataList.length; i++) {
                                        var labelValue = {};
                                        if(scope.ataList[i].companyCode == '1'){
                                            //根据后端返回的标识确定输入章节号+手册名称+发动机型号+标题
                                            labelValue.label = scope.ataList[i].chapter + " " + scope.ataList[i].manualType + " "+scope.ataList[i].engine+ " " + scope.ataList[i].title;
                                        }else {
                                            labelValue.label = scope.ataList[i].chapter + " " + scope.ataList[i].title;
                                        };
                                        labelValue.value = scope.ataList[i].chapter;
                                        scope.ataData.push(labelValue);
                                    };
                                    scope.partNoList = scope.ataData;
                                    scope.dropdown = true;
                                }
                                // console.log("1"+JSON.stringify(scope.partNoList));
                                scope.loadPartNo = false;
                            }).catch(function (error) {
                                console.log("2"+error);
                                scope.loadPartNo = false;
                            });
                        } else {
                            scope.dropdown = false;
                        }
                    }
                    tempParam = angular.copy(param);
                    scope.ataSelected = false;
                };

                scope.setPartNo = function (e) {
                    if (e.keyCode == 13) {
                        scope.searchPartNoTitle(scope.ataInfo, true);
                    };
                    var partno = scope.ataInfo;
                    scope.ataInfo = partno && partno.replace(/[^0-9\s|^\-]/g, '');
                };
                /**
                 * 失去焦点
                 * 1、收起下拉选择项
                 * 2、校验是手输入还是选择
                 * */
                scope.focusLost = function () {
                    //收起下拉选择框
                    scope.dropdown = false;
                    //是否手输？清空:填入所选项
                        if(!scope.ataSelected){
                            //清空输入框
                            scope.ataInfo = "";
                            // 清空列表内容
                            scope.partNoList = [];
                        };
                };
            }
        };
    }])
    .directive('ataInfoSelectTitle', ['$rootScope', 'configInfo', function ($rootScope, configInfo) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('touchstart', function(e){
                    //isPnListMove用来判断是否滚动或点击
                    scope.$parent.isPnListMove = false;
                });

                element.on('touchmove', function(e){
                    scope.$parent.isPnListMove = true;
                })

                //选择下拉ATA
                element.on('touchend', function() {
                    //scope.$parent.selectedPn = true;
                    if(scope.$parent.isPnListMove){
                        return false;
                    };
                    //apply重绘
                    scope.$apply(function(){
                        scope.$parent.ataSelected = true;
                        scope.$parent.ataInfo = scope.item.value;
                    })
                });
            }
        };
    }])
    .directive('ataInputTitle', ['$rootScope', '$localForage', function ($rootScope, $localForage) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('input', function () {
                    scope.$apply(function () {
                        scope.searchPartNoTitle(scope.ataInfo);
                    })
                });
            }
        };
    }])
;
