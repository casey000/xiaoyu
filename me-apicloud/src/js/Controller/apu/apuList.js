module.exports = angular.module('myApp')
    .controller('apuListController', ['$rootScope', '$scope', '$stateParams', 'server','configInfo', function ($rootScope, $scope, $stateParams, server,configInfo) {
        NativeAppAPI.hideTabBar();
        var that = this, total = 0;
        $scope.noMoreData = false;
        $scope.loadMore = false;
        $rootScope.endLoading();
        // console.info($stateParams,'params');


        $scope.workType = $stateParams.workType;
        $scope.apuInfo = {
            jobType:$stateParams.workType,
            flightId:$stateParams.flightId,
            jobId:$stateParams.jobId,
        };
        $scope.toDetail = function (obj) {
            if(obj.type == 'airlineExp'){
                $rootScope.go('experienceList.lineExpDetail','',{id :obj.tid,isEdit:false});
                // $rootScope.go('pubLine','slideLeft',{expId: obj.tid,from:'myPub'})
            }else if(obj.type == 'defectSummary'){
                $rootScope.go('experienceList.defectOutline','slideLeft',{defectId: obj.defectId,from:'myPub'})
            }else{
                alert('未知经验类型')
            }
        };

        $scope.dataList = [];
        $scope.init = function(){
            $rootScope.startLoading();
            //apuUse/selectApuUseInfoListByWorkOrderId?workOrderId=75213217、 列表
            var params = {workOrderId:$stateParams.jobId};
            server.maocGetReq('apuUse/selectApuUseInfoListByWorkOrderId', params).then(function (data) {
                if (200 === data.status) {
                    $rootScope.endLoading();
                    if (204 === data.data.statusCode) {
                        $scope.dataList = [];
                        return
                    }
                    $scope.dataList = data.data.data;
                    if($scope.dataList.length > 0){
                        for(var i in $scope.dataList){
                            if($scope.dataList[i].endTime){
                                var hours,minutes,seconds,diff;
                                diff = $scope.dataList[i].endTime - $scope.dataList[i].startTime;
                                if($scope.workType == 'Po/F'){
                                    diff >= 15 * 60 * 1000 ? $scope.dataList[i].overFifteen = true : $scope.dataList[i].overFifteen = false;

                                }

                                var level1 = diff%(3600*1000);
                                hours = Math.floor(diff/(3600*1000));

                                var level2 = level1%(3600*1000);
                                minutes = Math.floor(level2/(60*1000));

                                var level3 = level2%(60*1000);
                                seconds = Math.round(level3/1000);
                                $scope.dataList[i].timeDif = (hours > 9 ? hours:"0"+hours) + ':'+ (minutes < 10 ? "0" + minutes : minutes) + ':' + "00"
                            }else{
                                $scope.dataList[i].timeDif = '';
                            }


                        }
                    }

                }
            }).catch(function (error) {
                console.log(error);
            });
        };
        $scope.init();
        $scope.deleteSv= function (item,e) {
            e.stopPropagation();
            // 删除 post /rs/apuUse/deleteApuUseInfoById
            if(item.updaterSn == configInfo.userCode){
                server.maocPostReq('apuUse/deleteApuUseInfoById',{id:item.id}).then(function (data) {
                    if (200 === data.status) {
                        alert('删除成功');
                        $scope.init();
                    }
                }).catch(function (error) {

                });
            }else{
                $rootScope.errTip = '只能创建人删除'

            }


        };
        $scope.editSv = function (item,e) {
            e.stopPropagation();
            if(item.updaterSn == configInfo.userCode){
                $rootScope.go('addOrEditApu','',{apuInfo:item,isEdit:true,jobType:$scope.workType})
            }else{
                $rootScope.errTip = '只能创建人编辑'
            }
        }

    }
    ]);
