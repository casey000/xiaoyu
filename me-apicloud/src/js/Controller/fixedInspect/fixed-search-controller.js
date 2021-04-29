module.exports = angular.module('myApp')
    .controller('fixedSearchController', ['$rootScope', '$scope', '$stateParams', 'server', function ($rootScope, $scope, $stateParams, server) {
        NativeAppAPI.hideTabBar();
        var that = this, total = 0;
        $scope.errorTip = '';
        $scope.firstInit = true;
        $scope.showTip = false;
        $scope.searchType = 'acReg';
        $scope.searchName = '飞机号';
        $rootScope.endLoading();
        var queryJSON = {
            pageSize: 20,
            pageIndex: 1,
            type:  $scope.searchType,
            inputValue:''
        };

        var lanConfig = require('../../../../i18n/lanConfig');
        $scope.holderValue = '请输入工包编号、飞机号';
        $scope.searchVal = '';
        $scope.changeTipState = function () {
            $scope.showTip = !$scope.showTip;
        };
        $scope.chooseFlight = function () {
            $scope.searchType = "acReg";
            $scope.searchName = "飞机号"
        };
        $scope.choosePack = function () {
            $scope.searchType = "packageNo";
            $scope.searchName = "工包号"
        };
        /*
         *点击搜索按钮搜索
         */
        $scope.clickBtnSearch = function () {
            $scope.noMoreData = false;
            $scope.balanceInfo = [];
            queryJSON.pageIndex = 1;
            queryJSON.inputValue = $scope.searchVal;
            queryJSON.type = $scope.searchType;
            !that.requesting && (that.requesting = true); //防止在底部时同时执行nextPage

            if ($scope.searchVal.trim() != ''&& $scope.searchVal.length >3) {
                $scope.errorTip = '';
                searchBalanceInfo();
            } else {
                $scope.errorTip = '搜索内容不能小于4位';
                alert('搜索内容不能小于4位');
            }
        };

        /*
         *获取下页的数据
         */
        $scope.getNextPage = function () {
            if (!$scope.noMoreData && !that.requesting) {
                if (Math.ceil(that.total / queryJSON.pageSize) > queryJSON.pageIndex) {
                    queryJSON.pageIndex++;
                    that.requesting = true; //防止在底部时同时执行nextPage
                    searchBalanceInfo();
                } else {
                    $scope.noMoreData = true;
                }
            }
        };
        $scope.balanceInfo = [];

        /**
         * 搜索航材
         * @param 用户输入(PN or PN名称)
         */
        function searchBalanceInfo() {
            $scope.firstInit = false;
            $rootScope.startLoading();
            server.maocGetReq('pcheck/getPcheckListByKeyWords', queryJSON).then(function (data) {
                that.requesting = false;
                if (data.status === 200) {
                    that.total = data.data.total;
                    angular.forEach(data.data.data,function (item,index) {
                        if(item.revtp == "D"){
                            item.revtp = "定检"
                        }
                        if(item.revtp == "Z"){
                            item.revtp = "专项"
                        }
                        if(item.revtp == "F"){
                            item.revtp = "封存"
                        }
                    });
                    $scope.balanceInfo = data.data.data && $scope.balanceInfo.concat(data.data.data) || [];
                    if (Math.ceil(that.total / queryJSON.pageSize) == queryJSON.pageIndex) {
                        $scope.noMoreData = true;
                    }
                }
               // if (data.data.dataSize == 0) {
                    $rootScope.endLoading();
               // }
            }).catch(function (error) {
                $rootScope.endLoading();
            });
        };

        //输入搜索条件后回车返回搜索结果
        $scope.enter = function (ev, materialsearchTxt) {
            if (ev.keyCode == 13) {
                ev.preventDefault();
                $scope.clickBtnSearch(materialsearchTxt);
            }
        };
    }
    ]);
