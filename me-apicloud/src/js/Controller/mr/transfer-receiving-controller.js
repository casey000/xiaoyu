module.exports = (function() {
    angular.module('myApp').controller('transferReceivingController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
        function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
        {
            var that = this,total = 0;
            var scope = $scope;
            $scope.dataList = [];
            //当为true时，表示没有更多的数据。
            $scope.noMoreData = false;
            $scope.pageIndex = 1;
            $scope.pageSize = 10;
            $scope.status = "Y";
            $scope.allReason = [];
            $scope.toStation = '航站';

            $scope.mrInfo={
                station: '全部航站'
            };
            //返回
            $scope.goBack = function(){
                $rootScope.go('back');
            };

            $scope.showFilter = false;

            var current3CodeKey,current3Code;
            function firstInit(){
                current3CodeKey = $api.getStorage('usercode') + 'selairport3code';
                currentDispatchKey = $api.getStorage('usercode') + 'dispatch3code';
                current3Code = $api.getStorage(current3CodeKey) || '';
                dispatch3Code = $api.getStorage(currentDispatchKey) || '';
                $scope.staInfo = {station:dispatch3Code || current3Code};
            }
            firstInit()

            $scope.$watch('staInfo.station',function(n,o){
                // if(n){
                current3Code = n;
                $api.setStorage(currentDispatchKey,n);
                // }
            })

            //查询原因字典
            $scope.getReasonData = function(){
                server.maocGetReq('assembly/analysisDomainTypeByCode',{domainCode:"DEPLOY_REASON_TYPE"}).then(function (data) {
                    // console.log("字典数据"+JSON.stringify(data));
                    if (data.data.statusCode === 200) {
                        $scope.allReason= data.data.data[0].DEPLOY_REASON_TYPE || [];
                        // console.log("字典的数据"+JSON.stringify($scope.allReason));
                    };
                    // $rootScope.endLoading();
                }).catch(function (error) {
                    // $rootScope.endLoading();
                });
            };
            $scope.getReasonData();

            $scope.init = function (){
                $scope.queryJSON ={
                    "status":$scope.status,
                    "contract": "",
                    "station":$scope.staInfo.station,
                    "pageIndex":$scope.pageIndex,
                    "pageSize":$scope.pageSize
                };
                $rootScope.startLoading();
                server.maocPostReq('receipt/list', $scope.queryJSON,true).then(function (data) {
                    that.requesting = false;
                    if (data.data.statusCode === 200) {
                        that.total = data.data.total;
                        var  getListData = data.data.data;

                        if (Math.ceil(that.total / $scope.queryJSON.pageSize) == $scope.queryJSON.pageIndex) {
                            $scope.noMoreData = true;
                        }
                        getListData = angular.forEach(getListData,function (value,key) {
                            if(value.reason){
                                value.reason = Number(value.reason)-1;
                            };
                        });
                        $scope.dataList = $scope.dataList.concat(getListData);

                    }
                    $rootScope.endLoading();
                }).catch(function (error) {

                });
            };
            $scope.initPageData = function(){
                $scope.dataList=[];
                $scope.init()
            };
            $scope.initPageData();//这里不再需要初始化，watch已进行过一次初始化


           scope.getNextPage = function (){
               // setTimeout(function() {
               //      $scope.totalPageSize = Number($scope.pageSize) * Number($scope.pageIndex);
               //      console.log("查询到的数据111"+JSON.stringify($scope.totalPageSize ));
               //      if($scope.dataList.length == $scope.totalPageSize){
               //          $scope.pageIndex = Number($scope.pageIndex)+1;
               //          console.log("执行"+JSON.stringify($scope.pageIndex ));
               //          $scope.init();
               //      }else if($scope.dataList.length < $scope.totalPageSize){
               //              $scope.noMoreData = true;
               //          console.log("不执行");
               //      }
			   //  },900);
               if (!$scope.noMoreData && !that.requesting) {
                   if (Math.ceil(that.total / $scope.queryJSON.pageSize) > $scope.queryJSON.pageIndex) {
                       $scope.pageIndex++;
                       that.requesting = true;
                       $scope.init();
                   } else {
                       $scope.noMoreData = true;
                   }
               }
           };

//           选择任务状态后执行的操作,当选择选项后，页面从第一页开始
            $scope.selectSearch = function(){
                console.log("6666");
                $scope.noMoreData = false;
                $scope.showFilter = false;
                $scope.pageIndex = 1;
                $scope.dataList=[];
                $scope.init();
            };



            $scope.showFlow = function(){
                $scope.showFilter = true;
                // console.info($scope.showFilter)
            };

        }])
})()