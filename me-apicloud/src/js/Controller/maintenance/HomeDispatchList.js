module.exports = angular.module('myApp').controller('HomeDispatchListController',
    ['$scope', '$stateParams','$rootScope', 'server', function($scope, $stateParams, $rootScope, server) {
            var that = this,total = 0;
            $scope.dataList = [];
            $scope.allDataList = [];
            $scope.toStation = '航站';
            //当为true时，表示没有更多的数据。
            $scope.noMoreData = false;
            $scope.loadMore = false;

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

            //当为true时，表示没有更多的数据。
            $scope.searchPage = false;
            $scope.status = "Y";
            $scope.selectByStatuesData = [];
            $scope.selectByTypeData = [];
            $scope.mrInfo = {
                fileType:[
                    '全部',
                    'DEFECT',
                    'DEFECT_REVIEW',
                    'NRC',
                    'NRCT',
                    'PCO',
                    'EAJC',
                    'EOJC',
                    'NSJC',
                    'MPJC',
                    'LMJC',
                    'CMJC',
                    'CCO',
                    'DD',
                    'MCC',
                    'ReviewDD',
                    'ReviewDefect',
                    'ReviewTLB',
                    'TLB',
                    'TO',
                ],
                fileNumber:['全部'],
                status:'O',
            }
            $scope.airportChosen = [];
            $scope.fileTypeChosen = [];
            var queryJSON ={
                "station":$scope.staInfo.station ? $scope.staInfo.station.toUpperCase() :'',
                "pageIndex":1,
                "pageSize":20,
                "mrStatus": $scope.mrInfo.status
            };
            $scope.isFilter = false;
            $scope.filterChange = function(){
                $scope.isFilter = true;
                $scope.noMoreData = false;

                queryJSON ={
                    "station":$scope.staInfo.station ? $scope.staInfo.station.toUpperCase() :'',
                    "pageIndex":1,
                    "pageSize":20
                };
                $scope.showFilter = false;
                $scope.dataList = [];
                $scope.inputPn && (queryJSON.pn = $scope.inputPn);
                $scope.fileTypeChosen.length > 0 && (queryJSON.workType = $scope.fileTypeChosen);
                $scope.airportChosen.length > 0 && (queryJSON.workNumber = $scope.airportChosen);
                $scope.mrInfo.status.length > 0 && (queryJSON.mrStatus = $scope.mrInfo.status);
                if( $scope.fileTypeChosen == '全部'){
                    delete queryJSON.workType ;
                }
                if( $scope.airportChosen == '全部'){
                    delete queryJSON.workNumber ;
                }
                $scope.pageInit();

            }
            $scope.tabHeader = function(){
                $scope.inputPn = '';
                $scope.searchPage = !$scope.searchPage;
            };
            $scope.goDispatch = function(item){
                event.preventDefault();
                event.stopPropagation();
                $rootScope.go(
                    'dispatchDetail',
                    '',
                    {
                        pn:item.pn,
                        mrNo:item.mrNo,
                        needQty:item.needQty,
                        unit:item.unit,
                        sapTaskId:item.sapTaskId,
                        mrItem:item.mrItem,
                        sentQty:item.sentQty,
                        sn:item.sn,
                        batchNo:item.batchNo,
                        station:item.station ? item.station:'B-' + item.store
                    }
                )
            };
            $scope.pageInit = function (){
                $rootScope.startLoading();

                server.maocPostReq('mr/listPage', queryJSON,true).then(function (data) {
                    that.requesting = false;
                    if (data.data.statusCode === 200) {
                        that.total = data.data.total;
                        $scope.allDataList = data.data.data;
                        // $scope.pushFileType();

                        if (Math.ceil(that.total / queryJSON.pageSize) == queryJSON.pageIndex) {
                            $scope.noMoreData = true;
                        }
                        $scope.dataList = data.data.data && $scope.dataList.concat(data.data.data) || [];
                        $scope.pushFileNumber();

                        // console.info($scope.dataList,'1')
                    };
                    // if (data.data.dataSize == 0) {
                    $rootScope.endLoading();
                    // }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.pageInit();
            $scope.getNextPage = function () {
                if (!$scope.noMoreData && !that.requesting) {
                    $scope.isFilter = false;
                    if (Math.ceil(that.total / queryJSON.pageSize) > queryJSON.pageIndex) {
                        queryJSON.pageIndex++;
                        that.requesting = true; //防止在底部时同时执行nextPage
                        $scope.pageInit();
                    } else {
                        $scope.noMoreData = true;
                    }
                }
            };
            $scope.pushFileNumber = function () {
                var fileNumber=[] ;
                for(var i in $scope.dataList) {
                    if ($scope.dataList[i].workNumber && fileNumber.indexOf($scope.dataList[i].workNumber) < 0) {
                            fileNumber.push($scope.dataList[i].workNumber)
                    };
                };
                $scope.mrInfo.fileNumber = $scope.mrInfo.fileNumber.concat(fileNumber);

                var hash=[];
                for (var i = 0; i < $scope.mrInfo.fileNumber.length; i++) {
                    if($scope.mrInfo.fileNumber.indexOf($scope.mrInfo.fileNumber[i])==i){
                        hash.push($scope.mrInfo.fileNumber[i]);
                    }
                }
                $scope.mrInfo.fileNumber = hash
                // console.info($scope.mrInfo.fileNumber,'2')

                // firstFlag = false;
            };
            $scope.pushFileType = function () {
                var FileType=[] ;
                for(var i in $scope.allDataList) {
                    //只在第一次把数据写入
                    //如果workType没有，且数据里面有
                    if ($scope.allDataList[i].workType &&  FileType.indexOf($scope.allDataList[i].workType) < 0 ) {
                        FileType.push($scope.allDataList[i].workType)
                    };
                };
                $scope.mrInfo.fileType.concat(FileType);
            };

            $scope.showFlow = function(){
                $scope.showFilter = true;
                // console.info($scope.showFilter)
            };
    }
])
