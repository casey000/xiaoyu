module.exports = angular.module('myApp').controller('callCarDetailController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$filter', 'b64ToBlob','$interval',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob,$interval) {
            var taskId = $stateParams.taskId;
            var airportCode = $stateParams.airportCode;

            $scope.userCode = configInfo.userCode;
            $scope.firstInit = true;
            $scope.toStation = '航站';


            $scope.getInfo = function(){
                var data = {
                    taskmMainId:taskId,
                    airportCode:airportCode
                }
                server.maocGetReq('ghsDutyTask/getTaskMainInfoByMainId',data,true).then(function (respon) {
                    if(respon.data.statusCode == 200) {
                        $scope.insertJson = respon.data.data[0];

                    }
                    $rootScope.endLoading();
                }).catch(function (err) {
                    $rootScope.endLoading();
                })
            };
            $scope.getInfo();
            $scope.submitCancel = function () {
                var reason = ($scope.refuseReason && $scope.refuseReason.trim());
                if(!reason){
                    $rootScope.errTip = '原因必填';
                    return;
                }
                $rootScope.startLoading();
                server.maocGetReq('ghsDutyTask/cancelDutyTask',{taskMainId: taskId,abnormalReason:$scope.refuseReason}).then(function (res) {
                    if(res.status == 200){
                        $rootScope.errTip = '取消叫车成功';
                        $rootScope.go('back')
                    }
                    $rootScope.endLoading()
                }).catch(function (err) {
                    $rootScope.endLoading()
                    console.log(err)
                })
            }



        }
    ]);