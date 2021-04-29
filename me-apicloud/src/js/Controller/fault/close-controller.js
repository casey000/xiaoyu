module.exports = angular.module('myApp').controller('faultCloseController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$state', '$localForage', 'configInfo', '$interval',
    function ($rootScope, $scope, $stateParams, server, $state, $localForage, configInfo, $interval) {
        $scope.showTipState = false;
        $scope.acModel = "";
        $scope.curTimeParse = Date.now();
        $scope.navIdx = $stateParams.navIdx;
        $scope.listIdx = $stateParams.handleIdx;
        $scope.faultId = $stateParams.defectId;

        /*$localForage.setItem('fromSearchFault', true); //保存此值主要是针对android返回键
        $localForage.getItem('fromSearchFault').then(function(value) {
            if(value){
                $scope.fromSearchFault = value;
            }
        });*/
        //记忆在哪个tab页, 新建各个类型时,返回时使用
        //$localForage.setItem('defectIdx', {defectNavIdx: $scope.navIdx, defectListIdx: $scope.listIdx});

        $scope.changeMainNav = function (idx) {
            $scope.navIdx = idx;
            //$localForage.setItem('defectIdx', {defectNavIdx: idx, defectListIdx: $scope.listIdx});
        };
        $scope.changeNav = function (idx) {
            $scope.listIdx = idx;
            //$localForage.setItem('defectIdx', {defectNavIdx: $scope.navIdx, defectListIdx: idx});
        };
        $scope.changeTipState = function () {
            
            if ($scope.defectDetail.isBackCard == 0) {
                alert('该故障正在退卡中，暂时不允许编辑');
            }
            else {
                $scope.showTipState = !$scope.showTipState;
            }
        };

        $scope.isShow = true;
        $scope.isCanEdit = false;
        $scope.defectDetail = {};
        $scope.pendList = [];//后台将ddi与pending放在一个数据返回，用category加以区别
        $scope.pendingList = [];//用于判断pending有无数据
        $scope.ddiList = [];//用于判断ddi有无数据
        $scope.toList = [];
        $scope.ccList = [];
        $scope.mrList = [];
        $scope.logList = [];
        $scope.tlbInfoList = [];
        $scope.defectData = {};
        $scope.faultReport = {};

        if($stateParams.pt === ''){
            $scope.pt = localStorage.getItem('defectIdPt');
        }else{
            $scope.pt = $stateParams.pt;
            localStorage.setItem('defectIdPt', $scope.pt);
        }

        /**
         * 查询故障信息
         */
        $scope.getFaultInfo = function () {
            (!$scope.pullToRefreshActive && !$scope.pullToRefreshActive2) && $rootScope.startLoading();

            server.maocGetReq('defect/viewDefectDetailInfo', {defectId: $stateParams.defectId}).then(function (result) {
                if (200 === result.status) {
                    $scope.defectData = result.data.data[0];
                    $scope.defectDetail = result.data.data[0].defectDetail;
                    $scope.attachList = result.data.data[0].attachList;
                    $scope.defectDetail.zone_id= $scope.defectData.zone_id;
                    $scope.defectDetail.zone_no=$scope.defectData.zone_no;
                    $scope.pendList = result.data.data[0].pendList;
                    if ($scope.pendList.length > 0) {
                        angular.forEach($scope.pendList,function (item,index) {
                            if (item.category=='DFRL') {
                                $scope.ddiList.push(item);
                            }
                            else {
                                $scope.pendingList.push(item);
                            }
                        });
                    }

                    $scope.toList = result.data.data[0].toList;
                    $scope.ccList = result.data.data[0].ccList;
                    $scope.mrList = result.data.data[0].mrList;
                    $scope.logList = $scope.defectData.logList;
                    var actionJson = {};
                    $scope.acModel = $scope.defectDetail.model||"";
                    if($stateParams.defectDetail.itemId){
                        $scope.defectDetail.itemId = $stateParams.defectDetail.itemId;
                        localStorage.setItem('meItemId', $scope.defectDetail.itemId);
                    }else if($scope.pt === ''){
                        localStorage.getItem('meItemId');
                    }

                    if (result.data.data[0].defectActionList && result.data.data[0].defectActionList.length > 0) {
                        for (var i = 0, item; item = result.data.data[0].defectActionList[i++];) {
                            actionJson[item.id] = item;
                        }
                    }
                    for (var i = 0, item; item = result.data.data[0].tlbInfoList[i++];) {
                        item.action = actionJson[item.actionId];
                    }

                    $scope.tlbInfoList = result.data.data[0].tlbInfoList;

                    //如果无上传排故，取故障详情的故障报告，有则取最近时间的一条数据
                    if($scope.tlbInfoList.length == 0){
                        $scope.faultReport = {
                            faultReportChn: $scope.defectDetail.faultReportChn, //取最後時間的值
                            faultReportEng: $scope.defectDetail.faultReportEng
                        }
                    }else{
                        if($scope.tlbInfoList.length == 1){
                            $scope.tlbLatest = 0;
                        }else{
                            angular.forEach($scope.tlbInfoList, function(item, index, tlbInfoList){
                                if(index < tlbInfoList.length - 1){
                                    if(item.creattime < $scope.tlbInfoList[index+1].creattime){
                                        $scope.tlbLatest = index+1;
                                    }else{
                                        $scope.tlbLatest = index;
                                    }
                                }
                            });
                        }


                        $scope.faultReport = {
                            faultReportChn:  $scope.tlbInfoList[$scope.tlbLatest].faultReportChn || '', //取最後時間的值
                            faultReportEng:  $scope.tlbInfoList[$scope.tlbLatest].faultReportEng || ''
                        }
                    };

                    <!--新增排故步骤2019-11-20  -->
                    server.maocPostReq('esRest/getTroubleshootingHelpList', {id:$scope.defectDetail.id,ata: $scope.defectDetail.ata,model:$scope.defectDetail.model,acReg:$scope.defectDetail.acReg,keywords:$scope.defectDetail.faultReportChn},true).then(function (data) {
                        if (data.status === 200) {
                            $scope.helpInfo = data.data.data[0];
                            $scope.defectDetail.tmcExpList = data.data.data[0].tmcExpList;
                            $scope.defectDetail.relatedDocList = data.data.data[0].relatedDocList;
                            $scope.defectDetail.relatedDefectList = data.data.data[0].relatedDefectList;
                            $scope.defectDetail.airlineExpList = data.data.data[0].airlineExpList;

                        }

                    }).catch(function (error) {

                    });
                    <!--新增排故结束  -->


                }
                $interval.cancel($scope.timerId);
                $scope.pullToRefreshActive = false;  //详情下拉刷新完成
                $scope.pullToRefreshActive2 = false; //处理列表下拉刷新完成
                $rootScope.endLoading();
            }).catch(function (error) {
                $scope.pullToRefreshActive = false;
                $scope.pullToRefreshActive2 = false;
                $rootScope.endLoading();
            });

        };
        $scope.getFaultInfo();

        //如果数据没加载结束,loading继续,主是要是处理由其它路由过来时,父级loading会先结束的bug
        $scope.timerId = $interval(function(){
            if(!$scope.defectDetailLoaded && !$rootScope.loading){
                $rootScope.startLoading();
            }
        }, 50);

        $scope.goBack = function(){
            if($stateParams.from == 'defect'){
                $rootScope.go('searchFault', 'slideLeft', {fromIndex: true});
            }else{
                $rootScope.go('back');
            }
        };
        //Android返回键单独处理
        if($rootScope.android){
            api.removeEventListener({
                name: 'angularKeyback'
            });
            api.addEventListener({
                name: 'angularKeyback'
            }, function(ret, err){
                $scope.goBack();
            });
        }

        $scope.addfile=function () {

            if($scope.defectDetail.btnFlag.toMcc && $scope.defectDetail.btnFlag.defectPend && $scope.defectDetail.btnFlag.defectDeferral && $scope.defectDetail.btnFlag.defectProcess){
                $rootScope.go('addFaultHandle', 'slideLeft', {defectDetail:$scope.defectDetail,toList:$scope.toList,pt: $scope.pt,dmStatus:$scope.dmStatus, faultReport: $scope.faultReport})
            }else {
                if($scope.defectDetail.isAssign=="y"){
                    $rootScope.go('addFaultHandle', 'slideLeft', {defectDetail:$scope.defectDetail,toList:$scope.toList,pt: $scope.pt,dmStatus:$scope.dmStatus, faultReport: $scope.faultReport})
                }else {
                    alert("任务未下发，不能上传排故");
                }
            }
        };
        $scope.retain=function () {     //保留

            if($scope.defectDetail.btnFlag.toMcc && $scope.defectDetail.btnFlag.defectPend){
                $rootScope.go('ddi', 'slideLeft', {defectInfo:$scope.defectDetail,pendingInfo:$scope.pendList, faultReport: $scope.faultReport})
            }else {
                if($scope.defectDetail.isAssign=="y"){
                    $rootScope.go('ddi', 'slideLeft', {defectInfo:$scope.defectDetail,pendingInfo:$scope.pendList, faultReport: $scope.faultReport})
                }else {
                    alert("任务未下发，不能保留");
                }

            }

        };
        $scope.to_Nrc = function(){
            server.maocGetReq('defect/getToNrcFlag', {defectId:$scope.defectDetail.id}).then(function (data) {
                $rootScope.endLoading();
                if (200 === data.status) {
                    var respon = data.data.data[0];
                    if(respon == '1'){
                        $rootScope.errTip = '该故障只能进行推迟或继续推迟';

                        // $rootScope.go('pending', 'slideLeft', {defectInfo:$scope.defectDetail,pendingInfo:$scope.pendList, faultReport: $scope.faultReport})
                    }
                    if(respon == '2'){
                        $rootScope.errTip = '请先进行WorkLog判断';
                    }
                    if(respon == '3'){
                        $rootScope.go('pendToNrc', 'slideLeft', {defectDetail:$scope.defectDetail})

                        // $rootScope.errTip = '该故障只能转NRC';
                    }

                }
            }).catch(function (error) {
                $rootScope.endLoading();
                console.log(error);
            });
        }

        $scope.delay_button=function () {
            server.maocGetReq('defect/getToNrcFlag', {defectId:$scope.defectDetail.id}).then(function (data) {
                $rootScope.endLoading();
                if (200 === data.status) {
                    var respon = data.data.data[0];
                    if(respon == '1'){
                        $rootScope.go('pending', 'slideLeft', {defectInfo:$scope.defectDetail,pendingInfo:$scope.pendList, faultReport: $scope.faultReport})
                    }
                    if(respon == '2'){
                        $rootScope.errTip = '请先进行WorkLog判断';
                    }
                    if(respon == '3'){
                        $rootScope.errTip = '该故障只能转NRC';
                    }

                }
            }).catch(function (error) {
                $rootScope.endLoading();
                console.log(error);
            });
            // if($scope.defectDetail.btnFlag.toMcc){   //推迟
            //      $rootScope.go('pending', 'slideLeft', {defectInfo:$scope.defectDetail,pendingInfo:$scope.pendList, faultReport: $scope.faultReport})
            // }else {
            //     if($scope.defectDetail.isAssign=="y"){
            //         $rootScope.go('pending', 'slideLeft', {defectInfo:$scope.defectDetail,pendingInfo:$scope.pendList, faultReport: $scope.faultReport})
            //     }else {
            //         alert("任务未下发，不能推迟");
            //     }
            //
            // }

        };
        /**
         *   created by casey on 2019/11/22
         *   function：  排故帮助查看详情
         */
        $scope.lookMore = function(type){
            switch (type) {
                case 'airlineExpList':
                case 'tmcExperienceList':
                case 'relatedDefectList':
                case 'relatedDocList':
                    $rootScope.go('tmcExperienceList','',{relateddefectId:$scope.defectDetail.id,srcType:type,ata:$scope.defectDetail.ata,acReg:$scope.defectDetail.acReg,acModel:$scope.defectDetail.model,keywords:$scope.defectDetail.faultReportChn});
                    break;

                default:
                    // alert('任务类型不正确');
                    $rootScope.errTip = '任务类型不正确';
                    return;

            }
        };
        $scope.helpSearch = function(){
            $rootScope.go('defectHelpList','',{defectId:$scope.defectDetail.id,ata:$scope.defectDetail.ata,acReg:$scope.defectDetail.acReg,acModel:$scope.defectDetail.model,keywords:$scope.defectDetail.faultReportChn});
        };
        $scope.tmcDetail = function(id,type){
            switch (type) {
                case 'airlineExpList':
                    $rootScope.go('experienceList.lineExpDetail','',{id :id,isEdit:false});
                    break;
                case 'tmcExperienceList':
                    $rootScope.go('experienceList.tmcExpDetail','',{id :id});
                    break;
                case 'relatedDefectList':
                    $rootScope.go('experienceList.defectOutline','slideLeft',{defectId: id,from:'faultDetail'});
                    break;
                default:
                    $rootScope.errTip = '任务类型不正确';
                    return;
            }
        };
        $scope.docDetail = function(id,type){
            $rootScope.startLoading();
            var param = {source:'docList'};
            server.maocGetReq('relatedDoc/getDocUrlByIdAndType', {id:id,type:type}).then(function (data) {
                $rootScope.endLoading();
                if (200 === data.status) {
                    param.url = data.data.data[0];
                    OPENAPI.relatedDocCheck();
                    if($rootScope.android){
                        param.url = encodeURI(param.url);
                    }
                    NativeAppAPI.openPdfWithUrl(param);
                }
            }).catch(function (error) {
                $rootScope.endLoading();
                console.log(error);
            });
        };
    }
]);