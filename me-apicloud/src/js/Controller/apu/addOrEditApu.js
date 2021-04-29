module.exports = angular.module('myApp')
    .controller('addOrEditApuController', ['$rootScope', '$scope', '$stateParams', 'server', '$filter',function ($rootScope, $scope, $stateParams, server,$filter) {
        NativeAppAPI.hideTabBar();
        var that = this, total = 0;
        $scope.noMoreData = false;
        $rootScope.endLoading();
        $scope.loadMore = false;
        $scope.isEdit = $stateParams.isEdit ;
        $scope.isFirst = $stateParams.isFirst ;
        $scope.info = {
            startDate:'',
            endDate:'',
            remark:'',
            timeDif:'',
            prDate:''
        };
        // console.info($stateParams,'params');
        $scope.workType = $stateParams.apuInfo.jobType || $stateParams.jobType;
        if($scope.workType == 'O/G'){
            $scope.showText = '添加记录'
        }
        if($scope.workType == 'Pr/F'){
            $scope.showText = '开启APU'
        }
        if($scope.workType == 'Po/F' || $scope.workType == 'T/R' || $scope.workType == 'TBFTR'){
            $scope.showText = '关闭APU'
        }

        $scope.$watch('info.startDate',function (n,o) {
            // alert($scope.info.endDate + '222');
            $scope.info.timeDif = '';
            if(n &&  $scope.info.endDate){
                countTime('startDate')
            }
        });
        $scope.$watch('info.endDate',function (n,o) {
            $scope.info.timeDif = '';
            if(n &&  $scope.info.startDate){
                countTime('endDate')
            }
        });
        $scope.$watch('info.prDate',function (n,o) {
            if(n &&  $scope.info.startDate && $scope.workType == "Pr/F"){
                var diff = new Date($scope.info.prDate) - $scope.info.startDate.getTime();
                diff >= 90 * 60 * 1000 ? $scope.overNinty = true : $scope.overNinty = false;
                // console.info(diff,'diff')

            }
        });
        $scope.overFifteen = false;
        $scope.overNinty = false;
        function formatDate(time) {
            time = parseInt(time / (1000 * 60));
            time = time * 1000 * 60;
            return time;
        }
        function countTime(v){
            var hours,minutes,seconds,diff;
            // console.info($scope.info.endDate);
            // console.info($scope.info.startDate);
            if($scope.firstInit){
                diff = new Date($scope.info.endDate) - new Date($scope.info.startDate);
            }else{
                $scope.firstInit = false;
                diff = $scope.info.endDate.getTime() - $scope.info.startDate.getTime();
                if(!$rootScope.android){
                    diff = formatDate($scope.info.endDate.getTime()) - formatDate($scope.info.startDate.getTime());
                }
            }
            // alert(diff);

            if($scope.workType == "Pr/F" ){
               var prdiff = new Date($scope.info.prDate) - $scope.info.startDate.getTime();
                prdiff >= 90 * 60 * 1000 ? $scope.overNinty = true : $scope.overNinty = false;
                // console.info(diff,'diff')
                if($scope.overNinty) $scope.info.remark = '';

            }
            // diff = $scope.checkTime;
            // if(diff < 0) {
            //     $rootScope.errTip = "关闭时间不能小于开启时间";
            //     v == 'startDate' ?  $scope.info.startDate = '' : $scope.info.endDate = '';
            //     return
            // }
            // if(!diff){
            //     return;
            // }
            diff >= 15 * 60 * 1000 ? $scope.overFifteen = true : $scope.overFifteen = false;
            var level1 = diff%(3600*1000);
            hours = Math.floor(diff/(3600*1000));

            var level2 = level1%(3600*1000);
            minutes = Math.floor(level2/(60*1000));

            var level3 = level2%(60*1000);
            seconds = Math.round(level3/1000);
            if(diff >= 0){
                $scope.info.timeDif = (hours > 9 ? hours:"0"+hours) + ':'+ (minutes < 10 ? "0" + minutes : minutes) + ':' + "00"
            }else{
                $scope.info.timeDif = hours + 1 + ':'+  minutes + ':' + "00"
            }
        }
        $scope.editInit = function(){
            $scope.firstInit = true;
            // console.info('edit');

            $scope.info.endDate =  $stateParams.apuInfo.endTime ? new Date($stateParams.apuInfo.endTime) : '';
            $scope.info.startDate = new Date($stateParams.apuInfo.startTime) ;
            if($scope.workType == "Pr/F"){
                var params = {workOrderId:$stateParams.apuInfo.jobId || $stateParams.apuInfo.workorderId};
                server.maocGetReq('apuUse/selectNeedTimeByWorkOrderId', params).then(function (data) {
                    if (200 === data.status) {
                        var date=data.data.data[0].prepareTakeoffDate.replace(new RegExp(/-/gm) ,"/");
                        $scope.info.prDate = date;
                    }
                });

            }
            $scope.info.remark = $stateParams.apuInfo.remark || '';

        };
        $scope.init = function(){
            // 查询滑入时间/计划起飞时间 rs/apuUse/selectNeedTimeByFlightId?flightId=100811028
            var params = {workOrderId:$stateParams.apuInfo.jobId || $stateParams.apuInfo.workorderId};
            server.maocGetReq('apuUse/selectNeedTimeByWorkOrderId', params).then(function (data) {
                if (200 === data.status) {
                    // console.info(data.data);
                    if($stateParams.apuInfo.jobType == 'Po/F'){
                        //onBlockDate:滑入时间
                        var date = data.data.data[0].onBlockDate && data.data.data[0].onBlockDate.replace(new RegExp(/-/gm) ,"/");

                        $scope.info.endDate = new Date($filter('date')(new Date().getTime(), 'yyyy/MM/dd HH:mm'));
                        // $scope.info.startDate = data.data.data[0].onBlockDate;
                        $scope.info.startDate = data.data.data[0].onBlockDate ? new Date($filter('date')(date, 'yyyy/MM/dd HH:mm')) : '';


                    }
                    if($stateParams.apuInfo.jobType == 'Pr/F'){
                        var date=data.data.data[0].prepareTakeoffDate.replace(new RegExp(/-/gm) ,"/");
                        $scope.info.endDate = new Date($filter('date')(date, 'yyyy/MM/dd HH:mm'));
                        // $scope.info.endDate = new Date(data.data.data[0].prepareTakeoffDate).getTime();
                        // $scope.info.prDate = data.data.data[0].prepareTakeoffDate;
                        $scope.info.prDate = date;
                        $scope.info.startDate = new Date($filter('date')(new Date().getTime(), 'yyyy/MM/dd HH:mm'));
                    }
                    // if($stateParams.apuInfo.jobType == 'T/R' && $stateParams.isFirst){
                    //     var date = data.data.data[0].onBlockDate && data.data.data[0].onBlockDate.replace(new RegExp(/-/gm) ,"/");
                    //     $scope.info.endDate = new Date($filter('date')(new Date().getTime(), 'yyyy/MM/dd HH:mm'));
                    //     $scope.info.startDate = data.data.data[0].onBlockDate ? new Date($filter('date')(date, 'yyyy/MM/dd HH:mm')) : '';
                    //
                    // }
                    //如果是过站或是滑回第一次填写：取滑入时间，初始化的开始时间取滑入时间，初始化停止时间取当前时间
                    if(($stateParams.apuInfo.jobType == 'T/R' || $stateParams.apuInfo.jobType == 'TBFTR' ) && $stateParams.isFirst){
                        var date = data.data.data[0].onBlockDate && data.data.data[0].onBlockDate.replace(new RegExp(/-/gm) ,"/");
                        $scope.info.endDate = new Date($filter('date')(new Date().getTime(), 'yyyy/MM/dd HH:mm'));
                        $scope.info.startDate = data.data.data[0].onBlockDate ? new Date($filter('date')(date, 'yyyy/MM/dd HH:mm')) : '';
                    }
                    //如果是过站或是滑回非第一次填写：取得准备起飞时间，初始化的开始时间当前时间，初始化的停止时间取准备起飞时间
                    if(($stateParams.apuInfo.jobType == 'T/R' || $stateParams.apuInfo.jobType == 'TBFTR') && !$stateParams.isFirst){
                        var date = data.data.data[0].prepareTakeoffDate.replace(new RegExp(/-/gm) ,"/");
                        $scope.info.startDate = new Date($filter('date')(new Date().getTime(), 'yyyy/MM/dd HH:mm'));
                        $scope.info.endDate = new Date($filter('date')(date, 'yyyy/MM/dd HH:mm'))
                    }
                    if($stateParams.apuInfo.jobType == 'O/G'){
                        $scope.info.startDate = new Date($filter('date')(new Date().getTime(), 'yyyy/MM/dd HH:mm'));
                    }
                    // angular.forEach(data.data.data,function (item,index) {
                    //
                    // });
                }
            }).catch(function (error) {
                console.log(error);
            });
        };
        $scope.secInit = function () {
            // console.info('second');

            if($scope.workType == 'Po/F'){
                $scope.info.startDate = new Date($filter('date')(new Date().getTime(), 'yyyy/MM/dd HH:mm'));
            }
            if($scope.workType == 'O/G'){
                $scope.info.startDate = new Date($filter('date')(new Date().getTime(), 'yyyy/MM/dd HH:mm'));
            }
        };
        (($stateParams.isFirst || $scope.workType == 'Pr/F' || $scope.workType == 'T/R' || $scope.workType == 'TBFTR') && !$stateParams.isEdit) && $scope.init();
        $stateParams.isEdit && $scope.editInit();
        ($stateParams.isSec && $scope.workType != 'Pr/F' && $scope.workType != 'T/R' && $scope.workType != 'TBFTR') && $scope.secInit();

        $scope.submit = function () {
            $rootScope.startLoading();
            if(!$scope.info.startDate){
                $rootScope.errTip = "开启时间不能为空";
                $rootScope.endLoading();
                return
            }
            if($scope.info.endDate && $scope.info.endDate.getTime() - $scope.info.startDate.getTime() <= 0) {
                $rootScope.errTip = "关闭时间不能早于开启时间";
                $rootScope.endLoading();

                // v == 'startDate' ?  $scope.info.startDate = '' : $scope.info.endDate = '';
                return
            }
            if(($scope.workType == 'Po/F' && $scope.overFifteen)|| ($scope.workType == 'Pr/F' && $scope.overNinty)){
                if(!$scope.info.remark){
                    var msg = $scope.workType == 'Po/F' ? "超时，备注必填" : "提前开启 备注必填";
                    $rootScope.errTip = msg;
                    $rootScope.endLoading();
                    return
                }
            }
            if($scope.workType == 'O/G'){
                if(!$scope.info.remark){
                    $rootScope.errTip = "O/G类型备注必填";
                    $rootScope.endLoading();
                    return
                }
            }
            var params = {
                workorderId:$stateParams.apuInfo.jobId || $stateParams.apuInfo.workorderId,
                // model:$stateParams.apuInfo.acType || $stateParams.apuInfo.model,
                startTime: $scope.info.startDate.getTime(),
                endTime:$scope.info.endDate ? $scope.info.endDate.getTime():'',
                remark:$scope.info.remark
            };
            $stateParams.isEdit && (params.id = $stateParams.apuInfo.id);
            server.maocPostReq('apuUse/editApuUseInfo',params,true).then(function (data) {
                $rootScope.endLoading();
                if (200 == data.status) {
                    !$stateParams.isEdit ? alert('添加成功'):alert('编辑成功');
                    $rootScope.go('back')
                }
            }).catch(function (error) {
                $rootScope.endLoading();
            });
        }
    }
    ]);
