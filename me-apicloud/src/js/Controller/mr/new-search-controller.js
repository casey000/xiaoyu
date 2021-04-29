module.exports = angular.module('myApp')
    .controller('mrNewSearchController', ['$rootScope', '$scope', '$stateParams', 'server', function ($rootScope, $scope, $stateParams, server) {
        NativeAppAPI.hideTabBar();
        var that = this, total = 0;
        $scope.errorTip = '';
        $scope.isSearch = false;
        $scope.isAccurateChange = false;
        $scope.temporaryData = {
            station:'',
            storeLoc:''
        };
        $rootScope.endLoading();
        var queryJSON = {
            pageSize: 15,
            pageIndex: 1,
            partNo: '',
            isAccurate: $scope.isAccurate || false
        };
        $scope.staInfo = {
            station:'',
            storeLoc:''
        };
        var lanConfig = require('../../../../i18n/lanConfig');
        $scope.holderValue = '请输入PN码';
        $scope.searchVal = '';
        $scope.mustSlect = true;
        /*
         *点击搜索按钮搜索
         */
        $scope.clickBtnSearch = function () {
            $scope.pnList = [];
            $scope.pnListdropdown = false;
            $scope.noMoreData = false;
            $scope.balanceInfo = [];
            queryJSON.pageIndex = 1;
            queryJSON.storeLoc = $scope.staInfo.storeLoc ? $scope.staInfo.storeLoc :'';
            queryJSON.partNo = $scope.searchVal;
            queryJSON.isAccurate = $scope.isAccurate || false;
            !that.requesting && (that.requesting = true); //防止在底部时同时执行nextPage

            if ($scope.searchVal != '' && $scope.searchVal.length >1) {
                $scope.isSearch = true;
                $scope.errorTip = '';
                searchBalanceInfo();
            } else {
                $scope.isSearch = false;
                $scope.errorTip = '搜索内容不能小于2位';
            }
        };

        /*
         *获取下页的数据
         */
        $scope.getNextPage = function () {
            if (!$scope.noMoreData && !that.requesting) {
                if (Math.ceil(total / queryJSON.pageSize) > queryJSON.pageIndex) {
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
            $rootScope.startLoading();
            console.log("参数"+JSON.stringify(queryJSON));
            //每次点击精确查询后都要清空列表
            if(queryJSON.isAccurate != $scope.isAccurateChange ){
                $scope.balanceInfo = [];
                $scope.isAccurateChange = queryJSON.isAccurate;
            };
            server.maocGetReq('mr/findAirmaterialByPartNoAndStore', queryJSON).then(function (data) {
                that.requesting = false;
                if (data.status === 200) {
                    total = data.data.total;
                    $scope.balanceInfo = data.data.data && $scope.balanceInfo.concat(data.data.data) || [];
                    if (Math.ceil(that.total / pageSize) == param.pageIndex) {
                        $scope.noMoreData = true;
                    };
                };
                console.log("dddd"+JSON.stringify($scope.balanceInfo));
                if($scope.balanceInfo.length == 0){
                    console.log("ffff");
                    $scope.errorTip = '未搜索到相应航材';
                }else {
                    $scope.errorTip = '';
                };
               // if (data.data.dataSize == 0) {
                    $rootScope.endLoading();
               // }
            }).catch(function (error) {
                if($scope.balanceInfo.length == 0){
                    console.log("111");
                    $scope.errorTip = '未搜索到相应航材';
                }else {
                    $scope.errorTip = '';
                };
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

        //搜索件号功能
        $scope.pnListdropdown = false;
        $scope.pnList = [];
        $scope.pnInputChange = function () {
            // console.log("阿巴阿巴阿巴"+JSON.stringify($scope.searchVal));
            //当输入的内容大于三个字符
            if($scope.searchVal && $scope.searchVal.length > 1 ){
                var getParam ={
                    pn:$scope.searchVal
                }
                server.maocGetReq('nrc/findMaximoItem', getParam).then(function (data) {
                    if (200 === data.status) {
                        $scope.pnList  = data.data.data || [];
                        $scope.pnListdropdown = true;
                    }else {
                        $scope.pnListdropdown = false;
                    };
                }).catch(function (error) {
                    console.log(error);
                });
            }else {
            //    当输入的内容为空
                setTimeout(function () {
                    $scope.$apply(function(){
                        $scope.pnList = [];
                        $scope.pnListdropdown = false;
                        $scope.balanceInfo = [];
                    })
                },500)
            }
        };

        //监视输入的动态内容
        $scope.$watch('searchVal',function (n,o) {
            if (typeof (n) == 'undefined') {
                return;
            };
            $scope.pnInputChange();
        });


        //当点击下拉选择
        $scope.selectPn = function (selectedPn) {
            // console.log("选择选择"+JSON.stringify(selectedPn));
            //清空并关闭下拉
                queryJSON.partNo = selectedPn;
                $scope.searchVal = selectedPn;
            $scope.balanceInfo = [];
                setTimeout(function(){
                    $scope.pnList = [];
                    $scope.pnListdropdown = false;
                    queryJSON.isAccurate = $scope.isAccurate || false;
                    searchBalanceInfo();
                } ,500)

        };

    //    点击打开搜索站点
        $scope.showFlow = function(){
            $scope.showFilter = true;
            if(!!$scope.staInfo.storeLoc && $scope.staInfo.station){
                $scope.temporaryData.station = $scope.staInfo.station;
                $scope.temporaryData.storeLoc = $scope.staInfo.storeLoc;
            }
        };


    //    点击确定事件
        $scope.toStation = '航站';
        $scope.filterChange = function(){
            $scope.isFilter = true;
            $scope.noMoreData = false;
            $scope.showFilter = false;
            $scope.clickBtnSearch();
        };

        //点击取消按钮
        $scope.onclickClose = function(){
            $scope.showFilter = false;
            $scope.staInfo.station = $scope.temporaryData.station;
            $scope.staInfo.storeLoc = $scope.temporaryData.storeLoc;
        };

        //    通过站点查询库房
        $scope.searchStoreLocByStation = function (station) {
            console.log("1");
            server.maocGetReq('mr/getMe2MRMaximoLocation', {
                station: station.toUpperCase(),
                pageIndex: 1,
                pageSize: 10
            }).then(function (data) {
                if (200 === data.status) {
                    console.log("库房"+JSON.stringify(data))
                    $scope.stationList = data.data.data || [];
                    $scope.staInfo.storeLoc  = $scope.stationList[0].storeLoc;
                }
            }).catch(function (error) {
                console.log(error);
            });
        };

        var current3CodeKey,current3Code,currentDispatchKey,mrDispatch3Code;
        function firstInit(){
            current3CodeKey = $api.getStorage('usercode') + 'selairport3code';
            currentDispatchKey = $api.getStorage('usercode') + 'mrDispatch3Code';
            console.log("current3CodeKey"+current3CodeKey);
            console.log("currentDispatchKey"+currentDispatchKey);
            current3Code = $api.getStorage(current3CodeKey);
            mrDispatch3Code = $api.getStorage(currentDispatchKey);
            console.log("current3Code"+current3Code);
            console.log("mrDispatch3Code"+mrDispatch3Code);
            $scope.staInfo = {station:mrDispatch3Code || current3Code || ''};
            if(!!$scope.staInfo.station){
                $scope.searchStoreLocByStation($scope.staInfo.station);
            };

        }
        firstInit();



        // //监视航站输入的动态内容
        $scope.$watch('staInfo.station',function (n,o) {
            if (typeof (n) == 'undefined') {
                return;
            };
            // $scope.pnInputChange();
            console.log("staInfo"+JSON.stringify(n));
            $api.setStorage(currentDispatchKey,n);
        });

    }
    ]);
