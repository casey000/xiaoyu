module.exports = angular.module('myApp').controller('clockInFeedbackListController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$filter', 'b64ToBlob','$interval',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob,$interval) {
            $rootScope.endLoading();
            //航站标题
            $scope.toStation = '航站';
            //数据初始化
            var queryJSON ={
                days:2
            };

            //页面初始化
            $scope.clockInInitPage = function (){
                //打卡类型选项
                $scope.cardType = [
                    {
                        id:1,
                        title:"上班卡"
                    },{
                        id:2,
                        title:"下班卡"
                    },{
                        id:3,
                        title:"重复卡"
                    }
                ];
                //反馈信息ID
                if($stateParams.feedbackId){
                    $scope.feedbackId = $stateParams.feedbackId;
                };
                console.log("打卡..."+JSON.stringify($stateParams));
                if(!!$stateParams.navIdx){
                    $scope.navIdx = $stateParams.navIdx;
                    if($stateParams.navIdx == 1){
                        queryJSON.days = 2;
                    }else if($stateParams.navIdx == 2){
                        queryJSON.days = 7;
                    };
                }else {
                    $scope.navIdx = 1;
                    queryJSON.days = 2;
                };
                //打卡时间
                // $scope.cardTime = "1614052175000"||$stateParams.cardTime||"";
                $scope.feedbData = {
                    //打卡类型
                    cardTypeId: 1
                    // ,
                    // //工作类型
                    // workType: "2"||$stateParams.workType
                };
                //打卡航站
                $scope.staInfo = {station:'SZX'||$stateParams.station||''};
                // $scope.$on('$destroy', function() {
                //     $api.setStorage('fromNotice', false);
                // });
                //返回
                $scope.goHome = function () {
                    // $api.rmStorage('fromNotice');
                    // $rootScope.go('index');
                    if($api.getStorage('fromNotice')){
                        NativeAppAPI.closeRestMakeUp();
                    } else{
                        $api.rmStorage('fromNotice');
                        // $rootScope.go('back');
                        $rootScope.go('index');
                    }
                };
                //获取列表数据
                $scope.getListData();
            };

            //点击进来通过工号和当前时间时间戳获取列表数据(当前时间往前48小时内的数据)
            $scope.getListData = function(){
                $rootScope.startLoading();
                var nowDate = new Date().getTime();
                $scope.getListDataParam = {
                    "userId": configInfo.userCode,
                    "recordDate": nowDate,
                    "days":queryJSON.days
                };
                server.maocPostReq('attendanceWarning/listRecord',$scope.getListDataParam,true).then(function (res) {
                    if(res.status == 200){
                        $scope.dataList = res.data.data || [];
                    }else {
                        console.log(res.data.statusInfo)
                    };
                    $rootScope.endLoading();
                }).catch(function (err) {
                    $rootScope.endLoading();
                    console.log(err)
                })
            };

            //点击跳转到反馈信息页
            $scope.toFeedbackPage = function(item){
                $rootScope.go('clockInFeedback', '', {navIdx:$scope.navIdx,id:item.id,recordDate:item.recordDate,recordType:item.recordType,workType:item.workType,station:item.station,})
            };

            $scope.changeMainNav = function(index){
                $scope.navIdx = index;
                if(index == 1){
                    queryJSON.days = 2;
                    $scope.dataList = [];
                    $scope.getListData();
                }
                if(index == 2){
                    queryJSON.days = 7;
                    $scope.dataList = [];
                    $scope.getListData();
                }
            };

            (function(){
                $scope.clockInInitPage();
            })()
        }
    ]);