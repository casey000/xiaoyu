module.exports = angular.module('myApp').controller('clockInFeedbackController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$filter', 'b64ToBlob','$interval',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob,$interval) {
            $rootScope.endLoading();
            //航站标题
            $scope.toStation = '航站';
            //页面初始化
            $scope.clockInInitPage = function (){
                //打卡类型选项
                $scope.cardType = [
                    {
                        id:"PUNCH_IN",
                        title:"上班卡"
                    },
                    {
                        id:"PUNCH_OUT",
                        title:"下班卡"
                    },
                    {
                        id:"REPEAT",
                        title:"重复卡"
                    }
                ];
                console.log("$stateParams..."+JSON.stringify($stateParams));
                $scope.navIdx = !!$stateParams.navIdx?$stateParams.navIdx:"";
                //打卡时间
                $scope.recordDate = $stateParams.recordDate || "";
                $scope.feedbData = {
                    //打卡类型
                    cardTypeId: $stateParams.recordType || $scope.cardType[0].id,
                    //工作类型
                    workType: Number($stateParams.workType)
                };
                //打卡航站
                $scope.staInfo = {station:$stateParams.station == 'UNKNOWN' ? '' : $stateParams.station|| ''};
            };
            $scope.clockInInitPage();

            $scope.checkFunc = function () {
                $scope.myForm.$valid = false;
                $scope.checkData = {
                    recordType:$scope.feedbData.cardTypeId ,
                    workType:$scope.feedbData.workType ,
                    id: $stateParams.id
                };
                $scope.clockInPushData = {
                    recordType:$scope.feedbData.cardTypeId ,
                    workType:$scope.feedbData.workType ,
                    station:$scope.staInfo.station,
                    id: $stateParams.id
                };
                server.maocPostReq('attendanceWarning/checkRecordType',$scope.checkData,true).then(function (res) {
                    if(res.status == 200){
                        if(res.data.statusCode === 204){
                            $scope.submitData()
                        }
                        if(res.data.statusCode === 200){
                            $rootScope.confirmInfo = res.data.data[0];
                            $rootScope.confirmShow = true;

                            $rootScope.confirmOk = function () {
                                $scope.submitData()
                            };
                            $rootScope.confirmCancel = function () {
                                $rootScope.confirmShow = false;
                            };
                        }
                    }
                    $rootScope.endLoading();
                    $scope.myForm.$valid = true;

                }).catch(function (err) {
                    $rootScope.endLoading();
                    $scope.myForm.$valid = true;
                    console.log(err)
                })
            };

            $scope.submitData = function () {
                $rootScope.startLoading();
                server.maocPostReq('attendanceWarning/saveRecord',$scope.clockInPushData,true).then(function (res) {
                    if(res.status == 200){
                        // $rootScope.go('back');
                        $rootScope.go('clockInFeedbackList', 'slideLeft', {navIdx:$scope.navIdx})
                    }
                    $rootScope.endLoading();
                }).catch(function (err) {
                    $rootScope.endLoading();
                    $scope.myForm.$valid = true;
                    console.log(err)
                })
            }
        }
    ]);