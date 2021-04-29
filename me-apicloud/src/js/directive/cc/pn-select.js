angular.module('myApp')
    .directive('selectPn', ['server', '$timeout', function (server, $timeout) {
        return {
            restrict: 'E',
            scope: {
                pnInfo: "="
            },
            templateUrl: 'cc/select-pn.html',
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
                                pn: param
                            };
                            server.maocGetReq('comp/findMaximoItem', params).then(function (data) {
                                if (200 === data.status) {
                                    scope.partNoList = data.data.data || [];
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
                        scope.searchPartNo(scope.pnInfo.partno, true);
                    }
                    var partno = scope.pnInfo.partno;
                    scope.pnInfo.partno = partno && partno.replace(/[^a-zA-Z0-9\s|^\-]/g, '');
                };


                $timeout(function(){
                    scope.dropdown = false;
                }, 400)
                //scope.isPnListMove = false;
            }
        };
    }])
    .directive('pnInput', ['$rootScope', '$localForage', function ($rootScope, $localForage) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('input', function () {
                    scope.$apply(function () {
                        var partno;
                        if (!angular.isObject(scope.pnInfo)) {
                            scope.pnInfo = {};
                        }

                        //scope.pnInfo.isSelectPn = false;
                        if (scope.pnInfo.partno) {
                            var tempArr = scope.pnInfo.partno && scope.pnInfo.partno.split(' ');
                            if (!scope.temppartno) {
                                scope.temppartno = localStorage.getItem('temppartno');
                            }
                            if (tempArr && scope.temppartno != tempArr[0]) {
                                scope.diffName = true;
                            } else {
                                scope.diffName = false;
                            }
                            partno = tempArr && tempArr[0];
                        } else {
                            partno = scope.pnInfo.partno;
                        }
                        scope.pnInfo.partno = partno;
                         scope.searchPartNo(scope.pnInfo.partno);

                    })
                });
            }
        };
    }])
    .directive('pnInfoSelect', ['$rootScope', 'configInfo', function ($rootScope, configInfo) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                // console.log("scope=",scope);
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
                        scope.$parent.pnInfo.partno = scope.item.partno;

                        //输入值对比时使用
                        scope.$parent.temppartno = scope.item.partno;
                        localStorage.setItem('temppartno',scope.item.partno);
                        scope.$parent.diffName = false;
                    })
                    if( scope.$parent.pnInfo.pn_typr==1){
                        $rootScope.gouxindiandian1();
                    }else if(scope.$parent.pnInfo.pn_typr==2){
                        $rootScope.gouxindiandian2();
                    }

                });
            }
        };
    }]);
