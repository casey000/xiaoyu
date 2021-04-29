/**
 * Created by web on 20/12/11.
 */

module.exports = angular.module('myApp').controller('restMakeUpController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob, $timeout) {
            //日期时间组件必须进行日期初始化
            $scope.mrInfo = {
                selectItem:"",
                workCardStart:"",
                workHours:""
            };
            NativeAppAPI.hideTabBar();
            //提交参数对象
            $scope.submitParam = {};
            //提交时候禁用按钮
            $scope.submitDisabled = false;
            //获取从父页面传来的ID
            $scope.ID = $stateParams.id;
            //获取从父页面传来的用户标识
            $scope.type = $stateParams.type || "ATTENDANCE_REPORT_WARNING";
            console.log(JSON.stringify($stateParams));
            $scope.$on('$destroy', function() {
                $api.rmStorage('fromNotice');
            });
            //返回
            $scope.gobackToRoot = function () {
                if($api.getStorage('fromNotice')){
                    NativeAppAPI.closeRestMakeUp();
                } else{
                    $api.rmStorage('fromNotice');
                    $rootScope.go('back');
                }
            };
            //点击忘记打休息卡
            $scope.toNext= function(){
                $rootScope.go('restMakeUpNext','',{id:$scope.ID});
            };
            var typeArray = [
                {
                    text:'已下班',
                    value:1
                },
                {
                    text:'可在正常时间内下班',
                    value:2
                },
                {
                    text:'忘打休息卡',
                    value:3
                },
                {
                    text:'立即开始休息',
                    value:5
                },
                {
                    text:'外站跟机',
                    value:6
                },
                {
                    text:'可正常交接按时下班',
                    value:7
                },
                {
                    text:'可安排休息',
                    value:8
                },
            ]
            //查询上班打卡时间、实际工作时长
            $scope.getTime = function(){
                if(!!$scope.ID){
                    $scope.getTimeParam = {
                        id:$scope.ID
                    };
                    server.maocGetReq('attendanceWarning/selectById',$scope.getTimeParam, true).then(function(data){
                        // console.log('selectById' + JSON.stringify(data));
                        var statusCode = data.data.statusCode;
                        if (statusCode == 200) {
                            $scope.getTimeData = data.data.data[0] || {};
                            // console.log('getTimeData' + JSON.stringify($scope.getTimeData));
                            $scope.mrInfo.workCardStart = $scope.getTimeData.punchIn || "";
                            if($scope.type.indexOf('DAYS') != -1){
                                $scope.mrInfo.workCardStart = $scope.getTimeData.workDate ;
                            }
                            $scope.mrInfo.fiveDaysStart = new Date($scope.mrInfo.workCardStart).getTime() - (5 * 24 * 60 * 60 * 1000);
                            $scope.mrInfo.workHours = parseInt($scope.getTimeData.workHours/60)+"小时"+$scope.getTimeData.workHours%60+"分" ;
                            $scope.mrInfo.daysWorkHours = parseInt($scope.getTimeData.daysWorkHours/60)+"小时"+$scope.getTimeData.daysWorkHours%60+"分" ;
                            $scope.mrInfo.name = $scope.getTimeData.feedBackName || $scope.getTimeData.daysFeedBackName;
                            $scope.mrInfo.alreadyFeed = $scope.getTimeData.feedBack || $scope.getTimeData.daysFeedBack;
                            $scope.mrInfo.typeText = typeArray.filter(function (item) {
                                return $scope.mrInfo.alreadyFeed == item.value;
                            })[0].text;
                        }
                        else{
                            $scope.msgErr = true;
                            // api.alert({
                            //     msg: data.data.body.error_description || data.data.body
                            // });
                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        // api.alert({
                        //     msg: error.body['error_description'] || error.body
                        // });
                    });
                }
            };
            $scope.getTime();

            //提交表单数据
            $scope.submit = function (mrInfo) {
                //禁用提交按钮
                $scope.submitDisabled = true;
                $scope.submitParam = {
                    id:$scope.ID,
                    feedBack:$scope.mrInfo.selectItem,
                    feedBackType:$scope.type
                };
                console.log(JSON.stringify($scope.submitParam));
                server.maocGetReq('attendanceWarning/feedBack', $scope.submitParam, true).then(function(res){
                    $scope.submitDisabled = false;
                    // console.log('queryDefectTypes' + JSON.stringify(res));
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200 || statusCode == 204) {
                        if($scope.type == 'ATTENDANCE_REPORT_WARNING' || $scope.type == 'DAYS_ATTENDANCE_REPORT_WARNING'){
                            if($scope.mrInfo.selectItem == "1" || $scope.mrInfo.selectItem == "3" || $scope.mrInfo.selectItem == "4"){
                                alert("请前往丰声打卡");
                            };
                        };
                        api.alert({
                            msg: '反馈成功'
                        },function () {
                            $scope.gobackToRoot();
                        });
                    }else{
                        api.alert({
                            msg: data.data.body.error_description || data.data.body
                        });
                    }
                }).catch(function (error) {
                    // api.alert({
                    //     msg: error.body['error_description'] || error.body
                    // });
                });
            }
        }
    ]);