
module.exports = angular.module('myApp').controller('ddiApproveController',
    ['$rootScope','$scope','$stateParams', 'server', '$localForage', 'configInfo',
        function($rootScope,$scope,$stateParams, server, $localForage, configInfo) {
            $scope.hideApproverTitle = true;//隐藏选人默认状态
            $scope.resultActive = 0;//result通过或拒绝（0,1）
            $rootScope.endLoading();
            var approveId = $stateParams.approveId;
            var dataInfo = $stateParams.dataInfo;
            $scope.holderValue = 'Auditor';
            $scope.approveData = {
                "formId": "defect-004-a",
                "formData": {
                    "sn": dataInfo.sn,
                    "businessKey": dataInfo.businessKey,//业务KEY
                    "type": "defect_audit",
                    "remark": "",
                    "processId": approveId || dataInfo.procInstId ,//procInstId 流程ID
                    "result": "pass",//pass，reject
                    "agree": "true",//true或false
                    "requesterLice": configInfo.myId() || ''//执行号
                }
            };
            if (typeof myapproveData == "undefined") {
                myapproveData = $localForage.createInstance({
                    name: (configInfo.userCode || 'noUser') + '_mynosubmit'
                });
            }
            var keyId = dataInfo.id + '_my';
            /**
             * 读取数据
             */
            myapproveData.getItem(keyId).then(function (value) {
                if (value) {
                    $scope.pendingData = value.pendingData || {};
                } else {
                    myapproveData.length().then(function (numberOfKeys) {
                        if (!numberOfKeys) {
                            $localForage.removeItem('noSubmitNumber');
                        }
                    })
                }
            }).catch(function (err) {
                // This code runs if there were any errors
                console.log(err);
            });

            /**
             * 选择result按钮
             */
            $scope.setResult =function (event) {
                $scope.approveData.formData.result = event.target.innerText == '拒绝'?'reject':'pass';
                $scope.approveData.formData.agree = event.target.innerText == '拒绝'?'false':'true';
                // $scope.approveData.formData.assigneeId = event.target.innerText == '拒绝'?dataInfo.assigneeId:'';
            };

            /**
             * 提交表单数据
             * @params {表单内容}
             */
            $scope.submit = function () {
                $rootScope.startLoading();
                $scope.approveData.formData.sn = configInfo.userCode;

                myapproveData.setItem(keyId,{
                    approveData:$scope.approveData
                });

                var data = $scope.approveData.formData;
                server.maocFormdataPost('form/submit','defect-004-a',data).then(function (data) {
                    if (200 === data.status) {
                        alert("审批成功");
                        myapproveData.clear();
                        $rootScope.go('back');
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
        }
    ]);


