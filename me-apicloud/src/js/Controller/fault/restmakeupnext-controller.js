/**
 * Created by web on 2020/12/11.
 */

module.exports = angular.module('myApp').controller('restMakeUpNextController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob, $timeout) {
            $scope.mrInfo = {
                selectItem:""
            };
            //提交参数对象
            $scope.submitParam = {};
            //提交时候禁用按钮
            $scope.submitDisabled = false;
            //获取从父页面传来的ID
            $scope.ID = $stateParams.id;
            //已打下班卡标识,默认没打下班卡
            $scope.workEndTime = false;
            $rootScope.endLoading();
            console.log(JSON.stringify($stateParams));

            //返回
            $scope.gobackToRoot = function () {
                NativeAppAPI.audioPlayerStop();
                $rootScope.go('back', 'slideLeft', {isNewFault: true});
            };

            //提交表单数据
            $scope.submit = function (mrInfo) {
                //禁用提交按钮
                // $scope.submitDisabled = true;
                $scope.submitParam = {
                    id:$scope.ID,
                    feedBack:$scope.mrInfo.selectItem
                };
                console.log(JSON.stringify($scope.submitParam));
                server.maocGetReq('attendanceWarning/feedBack', $scope.submitParam, true).then(function(res){
                    console.log('queryDefectTypes' + JSON.stringify(res));
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200 || statusCode == 204) {
                if($scope.mrInfo.selectItem == "3"){
                    alert("请前往丰声打休息结束卡");
                    $rootScope.go('myTask','',{});
                }else if($scope.mrInfo.selectItem == "4"){
                    alert("请将休息日期和时间邮件发送给李青楠(suny6@sf-express.com)");
                    $rootScope.go('myTask','',{});
                }
                    }
                });

            }
        }
    ]);