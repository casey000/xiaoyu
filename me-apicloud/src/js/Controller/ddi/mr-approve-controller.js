
module.exports = angular.module('myApp').controller('mrApproveController',
    ['$rootScope','$scope','$stateParams', 'server', '$localForage', 'configInfo',
        function($rootScope,$scope,$stateParams, server, $localForage, configInfo) {
            $rootScope.endLoading();
            /*
            * 获取MR详情数据
            * @param mrId
            */
            server.maocGetReq('mr/viewMrTask', {
                mrId: $stateParams.mrId
            }).then(function (result) {
                if (200 === result.status) {
                    $scope.mrInfo = result.data.data[0];
                }
                $rootScope.endLoading();
            }).catch(function (error) {
                $rootScope.endLoading();
            });
            $scope.aogChange = function(){
                $scope.aog ? $scope.aog = '':$scope.aog = true
            }
            /**
             * 提交表单数据
             * @params {表单内容}
             */
            $scope.mrApprove = function () {
                $rootScope.startLoading();

                var data = {
                    type: $stateParams.type,
                    sn: configInfo.userCode,
                    processId: $stateParams.processId,
                    id: $stateParams.mrId,
                    remark: $scope.approveOpinion,
                    aog:$scope.aog||'',
                }
                server.maocFormdataPost('form/submit', 'mr-001-a', data, null).then(function (data) {
                    if (200 === data.status) {
                        alert("审批成功");
                        $rootScope.go('back');
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
        }
    ]);


