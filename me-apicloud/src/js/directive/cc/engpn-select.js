angular.module('myApp')
    .directive('selectEngpn', ['server', '$timeout', function (server, $timeout) {
        return {
            restrict: 'E',
            scope: {
                pnInfo: "="
            },
            templateUrl: 'cc/select-engpn.html',
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
                                pn: angular.uppercase(param)
                            };
                            server.maocGetReq('comp/queryParentCompList', params).then(function (data) {
                                if (200 === data.status) {
                                    var jsonArray = data.data.data || [];
                                    var obj = {};
                                    jsonArray = jsonArray.reduce(function(item,next){
                                        obj[next.pn]?'':obj[next.pn] = true&&item.push(next);
                                        return item;
                                    },[]);
                                    scope.partNoList = jsonArray;
                                    // console.info(scope.partNoList,'scope.partNoList')
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
    .directive('engpnInput', ['$rootScope', '$localForage', function ($rootScope, $localForage) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('input', function () {
                    scope.$apply(function () {
                         scope.searchPartNo(scope.pnInfo.partno);
                    })
                });
            }
        };
    }])
    .directive('engpnInfoSelect', ['$rootScope', 'configInfo', function ($rootScope, configInfo) {
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
                        };
                        scope.$parent.pnInfo.partno = scope.item.pn;
                        scope.$parent.pnInfo.description = scope.item.assetNum;

                    })
                });
            }
        };
    }]);
