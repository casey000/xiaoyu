module.exports = angular.module('myApp').controller('faultMrSearchMaterialController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter) {
            var that = this;
            $rootScope.endLoading();
            $scope.timeId = $stateParams.timeId;
            var pageSize = 20;
            var lanConfig = require('../../../../i18n/lanConfig');
            // $scope.holderValue = lanConfig.keyWord;
            $scope.holderValue = "3位以上关键字";
            /**
             * 点击搜索按钮搜索
             * @param materialsearchTxt
             */
            $scope.clickBtnSearch = function (materialsearchTxt) {
                that.currentPage = 1;
                $scope.noMoreData = false;
                $scope.balanceInfo = [];

                var acReg = $stateParams.acReg;
                var station = $stateParams.station || 'SZSX';
                var type = $stateParams.mrType || 'DEF';

                if (acReg !== "" && (type === 'DEF')) {

                    if (acReg.indexOf("-") != -1) {
                        acReg = acReg.replace("-","");
                    }

                    acReg = acReg.toUpperCase();
                    station = station + ',' + acReg;
                }

                var param = {
                    pageSize: pageSize,
                    pageIndex: 1,
                    partNo: materialsearchTxt,
                    station: station,
                    type: $stateParams.mrType || 'DEF',
                    isAccurate: $scope.isAccurate || false
                };
                that.curParam = param;
                if (!that.requesting) {
                    that.requesting = true; //防止在底部时同时执行nextPage
                    $scope.searchBalanceInfo(param);
                }
            };
            /*
             *获取下页的数据
             */
            $scope.getNextPage = function () {
                if (!$scope.noMoreData && !that.requesting) {
                    that.curParam.pageIndex = ++that.currentPage;
                    if (Math.ceil(that.total / pageSize) >= that.curParam.pageIndex) {
                        that.requesting = true; //防止在底部时同时执行nextPage
                        $scope.searchBalanceInfo(that.curParam);
                    } else {
                        $scope.noMoreData = true;
                    }
                }
            };

            /**
             * 搜索航材
             */
            $scope.searchBalanceInfo = function (param) {

                if (param.partNo.length < 3) {
                    that.requesting = false;
                    alert("关键字小于三位");
                    return;
                }

                if (param.partNo) {
                    $rootScope.startLoading();
                    server.maocGetReq('mr/findMRAirMaterialByPartNoAndType', param).then(function (data) {
                        that.requesting = false;
                        if (200 === data.status) {
                            that.total = data.data.total;
                            $scope.balanceInfo = data.data.data && $scope.balanceInfo.concat(data.data.data) || [];
                            if (Math.ceil(that.total / pageSize) == param.pageIndex) {
                                $scope.noMoreData = true;
                            }
                        }
                        if (data.data.dataSize == 0) {
                            $rootScope.endLoading();
                        }
                    }).catch(function (error) {
                        console.log(error);
                        $rootScope.endLoading();
                    });
                } else {
                    // $scope.holderValue = lanConfig.paramLimit;
                    $scope.holderValue = "请输入3位以上关键字";
                    that.requesting = false;
                }
            };
            /**
             * 输入搜索条件后回车返回搜索结果
             * @param ev
             * @param materialsearchTxt
             */
            $scope.enter = function (ev, materialsearchTxt) {
                if (ev.keyCode == 13) {
                    ev.preventDefault();
                    $scope.clickBtnSearch(materialsearchTxt);
                }
            };

            /**
             * 点击加号航材数量加一
             * @param stockNumber 库存
             * @param materialnumber
             * @param item
             * @param num2
             */
            $scope.plusmaterial = function (stockNumber, materialnumber, item, num2) {
                var baseNum, baseNum1, baseNum2;
                var precision;// 精度
                try {
                    baseNum1 = materialnumber.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
                item.needMaterialNumber = parseFloat(((materialnumber * baseNum + num2 * baseNum) / baseNum).toFixed(precision));
                console.log($stateParams.mrType, $stateParams.mrType === 'DEF', parseInt(item.needMaterialNumber) > parseInt(item.curbal))
                if ($stateParams.mrType === 'DEF' && parseInt(item.needMaterialNumber) > parseInt(stockNumber)) {
                    item.needMaterialNumber = item.curbal;
                }
            };

            /**
             * 点击减号航材数量减一
             * @param stockNumber
             * @param materialnumber
             * @param item
             * @param num2
             */
            $scope.minusmaterial = function (stockNumber, materialnumber, item, num2) {
                var baseNum, baseNum1, baseNum2;
                var precision;// 精度
                try {
                    baseNum1 = materialnumber.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
                if (item.needMaterialNumber > 1) {
                    item.needMaterialNumber = parseFloat(((materialnumber * baseNum - num2 * baseNum) / baseNum).toFixed(precision));
                } else {
                    item.needMaterialNumber = 0;
                }
            };

            /**
             * input框输入航材量超过库存时候清零
             * @param item
             * @param event
             */
            $scope.overStock = function (item, event) {
                var tempQty = item.needMaterialNumber;
                tempQty_1 = tempQty && tempQty.slice(0, tempQty.length - 1);
                if (!tempQty_1 && /\./g.test(tempQty)) { //小数点不能点首位
                    item.needMaterialNumber = '';
                } else if (/\./g.test(tempQty_1) && tempQty.slice(-1) == '.') { //已经输入过点不能再次输入
                    item.needMaterialNumber = tempQty_1;
                } else if (tempQty && tempQty.substring(0, 2) == '00' && tempQty.indexOf('.') == -1) {
                    item.needMaterialNumber = '0'
                } else {
                    item.needMaterialNumber = tempQty && tempQty.replace(/[^0-9\.]/g, '');
                }
                //input框输入航材量超过库存时候清零
                if (item.needMaterialNumber > Number(item.availableQty)) {
                    item.needMaterialNumber = 0;
                }
                if (typeof String(tempQty).split('.')[1] != "undefined" && String(tempQty).split('.')[1].length > 2) {
                    item.needMaterialNumber = item.needMaterialNumber.substring(0, String(tempQty).split('.')[0].length + 3)
                }
            };


        }
    ]);
