module.exports = angular.module('myApp').controller('addFaultHandleController', ['$rootScope', '$scope', '$stateParams', '$filter', 'server', 'configInfo', '$localForage', '$timeout','checkDmInfo',
    function ($rootScope, $scope, $stateParams, $filter, server, configInfo, $localForage, $timeout,checkDmInfo) {
        $rootScope.loading = false;
        $scope.hideApproverTitle = true;
        $scope.defectDetail = $stateParams.defectDetail;
        $scope.acModel = $scope.defectDetail.model||"";
        console.log($scope.defectDetail)
        $scope.pt = $stateParams.pt;
        $scope.toList = $stateParams.toList;
        $scope.tos = $stateParams.toList;
        $scope.edit = true;

        $scope.isHasEwis = '';
        $scope.showEwis = false;
        $scope.ewisInfo = {};
        $scope.ewisDTO = [];
        $scope.ewisState = -1;
        $scope.selectedEwisIndex = -1;
        $scope.ewisAttachements = [];

        $scope.isHasOil = '';
        $scope.showOil = false;
        $scope.oilInfo = {};
        $scope.oilDTO = [];
        $scope.oilState = -1;//0新建 1编辑 2详情 -1无效
        $scope.selectedOilIndex = -1;//编辑或详情项目下标
        $scope.oilAttachements = [];


        var date = new Date();
        // $scope.imgInfo = {
        //     fileArr: [],
        //     imgArr: [],
        //     attachvo: []
        // };
        $scope.imgInfo = {
            fileArr: [],
            imgArr: [],
            attachvo: [],
            fileList:[],
            upWay:'action',
            // nrcId:$scope.defectDetail.id
            nrcId:''
        };
        $scope.info = {
            tecnician: {},
            inspector: {},
            finderSign:{
                approverName :$stateParams.defectDetail.technicianFoundNo.substring(0,$stateParams.defectDetail.technicianFoundNo.indexOf("("))||"",
                approverSn : $stateParams.defectDetail.technicianFoundNo.substring($stateParams.defectDetail.technicianFoundNo.indexOf("(")+1,$stateParams.defectDetail.technicianFoundNo.indexOf(")"))||"",
                nameAndId : $stateParams.defectDetail.technicianFoundNo||""
            },
            tlbNo: '',
            completeDate: new Date($filter('date')(date, 'yyyy/MM/dd HH:mm')),
            dateFound: new Date($filter('date')($scope.defectDetail.dateFound, 'yyyy/MM/dd HH:mm')),
            dlyCnl: 'n',
            manHours: '',
            rii: 'n',
            rci: 'y',
            takenActionChn: '',
            takenActionEng: '',
            faultReportChn: $stateParams.faultReport.faultReportChn, //取最後時間的值
            faultReportEng: $stateParams.faultReport.faultReportEng,
            reviewType: [],
            ata: $scope.defectDetail.ata,
            dm: $scope.defectDetail.dm,
            dmStatus: $scope.defectDetail.dmStatus
        };
        $scope.zoneInfo = {
            "zone_id": $scope.info.zone_id || "",
            "zone_no" : $scope.info.zone || "",
            "zone_area": "",
            "zone_model":$scope.defectDetail.model
        };
        var paramId = $scope.defectDetail.id + '_handle';

        $scope.$watch('info.ata',function (n,o) {
            if (n && n.length == 4) {
                var params = {
                    ata:n,
                    applyType:'APL',
                    applyId:'',
                    acReg:$scope.defectDetail.acReg,
                    model:$scope.defectDetail.model
                }
                checkDmInfo.getDmInfo(params).then(function(data) {
                    // console.log(JSON.stringify(data));
                    console.log(data)
                    console.log(data.data.isDm,'data.isDm')
                    if(data.data.isDm && data.data.isDm == 1){
                        $scope.info.dm = 'y' ;
                        $scope.info.rii = 'n' ;
                        $scope.info.rci = 'y' ;
                        $scope.dmDisable = true;
                    }else{
                        $scope.dmDisable = false;
                    }

                }).catch(function(error) {
                    console.log(error);

                });
            }
        });
        /**
         * 读取数据
         */
        $localForage.getItem(paramId).then(function (val) {
            if (val && val.info) {
                val.info.dateFound = new Date(val.info.dateFound);
                val.info.completeDate = new Date(val.info.completeDate);
                $scope.info = val.info;
            }
        });
        $rootScope.errAlertCallBack = function () {
            $rootScope.errAlert = false;
            history.go(-1)
        };
        //if (!$scope.pt) {
        $rootScope.startLoading();
        //开始获取TO
        server.maocGetReq('mccTo/findTroubleShootingByDefectId', {defectId: $scope.defectDetail.id}).then(function (result) {
            if (200 === result.status) {
                result.data.data[0] && ($scope.toList = [{totroubleShootings: result.data.data[0].toTroubleShootingList}]);
                $scope.isShowTo = result.data.data[0].show;
                var ttbs=$scope.toList[0].totroubleShootings;
                $scope.planTimeSum=0;
                $scope.totalTimeSum=0;
                angular.forEach(ttbs,function (item,i) {
                    var ppo=item.producePrepareOrders;
                    var wodf=item.workOrderFeedbackDetails;

                    if(ppo&&ppo instanceof Array&&ppo.length>0){
                        if(wodf&&wodf instanceof Array&&wodf.length==0){
                            wodf[0]={
                                "orderId":ppo[0].id,
                                "subId":item.step,
                                "realStaff":"",
                                "realHour":""
                            }

                        }else{
                            $scope.totalTimeSum=accAdd($scope.totalTimeSum,accMul(wodf[0].realStaff,wodf[0].realHour));
                        }

                        $scope.planTimeSum=accAdd($scope.planTimeSum,accMul(ppo[0].expectStaff,ppo[0].expectHour));
                    }else if(wodf&&wodf instanceof Array&&wodf.length==0){
                        console.log("未挂准备单");
                        wodf[0]={
                            "subId":item.step,
                            "realStaff":"",
                            "realHour":""
                        }
                    }else{
                        $scope.totalTimeSum=accAdd($scope.totalTimeSum,accMul(wodf[0].realStaff,wodf[0].realHour));
                    }

                });

            }
            $rootScope.endLoading();
        }).catch(function (error) {
            $rootScope.endLoading();
        });
        //}

        $scope.scan = function () {
            var FNScanner = api.require('FNScanner');
            FNScanner.open({
                autorotation: true
            }, function (ret, err) {
                if (ret.content) {
                    var reg =  /[a-zA-Z]/g;
                    var tlbCode = ret.content.replace(reg,"");

                    $timeout(function() {
                        $scope.info.tlbNo = tlbCode;
                    });
                }
            });
        };

        $scope.change = function () {
            if ($scope.info.tlbNo) {
                var reg =  /[a-zA-Z]/g;
                var tlbCode = $scope.info.tlbNo.replace(reg,"");
                $scope.info.tlbNo = tlbCode;
            }

        };

        $scope.changeReviewType = function(event){
            var valuePos = $scope.info.reviewType.indexOf(event.target.innerText);
            if( valuePos == -1){
                $scope.info.reviewType.push(event.target.innerText);
            }else{
                $scope.info.reviewType.splice(valuePos, 1);
            }
        };


        $scope.submitMethod = function () {

            var toDmState = $scope.checkToDMY();
            console.log(toDmState);
            if ($scope.info.dm === 'y' || toDmState) {
                api.alert({
                    title: '提示',
                    msg: '此任务涉及双重维修限制，请确认是否已按要求执行',
                }, function(ret, err) {
                    if (ret.buttonIndex == 1) {
                        $scope.doSubmit();
                    }
                });
            }
            else {
                $scope.doSubmit();
            }
        };

        $scope.checkToDMY = function (){

            var result = false;
            if ($scope.tos.length > 0) {

                console.log( 'toList' + JSON.stringify($scope.tos));
                for(var i = 0 ; i < $scope.tos.length; i ++) {
                    var item = $scope.tos[i];
                    console.log('item' + JSON.stringify(item));
                    if (item.dm == 'y') {
                        result = true;
                        return result;
                    }
                }
            }

            return result;
        };


        $scope.doSubmit = function () {
            // var oilDto = angular.copy($scope.oilDTO);
            // var ewisDto = angular.copy($scope.ewisDTO);
            // delete  oilDto.id;

            var data = {
                tlbNo: $scope.info.tlbNo,
                takenActionChn: $scope.info.takenActionChn,
                takenActionEng: $scope.info.takenActionEng,
                faultReportChn: $scope.info.faultReportChn,
                faultReportEng: $scope.info.faultReportEng,

                technicianFound: $scope.info.finderSign.approverName ,
                technicianFoundNo:$scope.info.finderSign.approverSn ,
                feedBack: $scope.info.feedBack,
                dlyCnl: $scope.info.dlyCnl,
                manHours: $scope.info.manHours,
                ata: $scope.info.ata,
                noTlbNo: $scope.info.noTlbNo ? 1 : 0,
                // reviewType: $scope.info.reviewType.join(','),
                reviewType: "",//产品要求隐藏界面该元素，默认值为空字符串
                dm: $scope.info.dm,
                oilDTO: $scope.oilDTO,
                ewisDTO: $scope.ewisDTO,
                isHasOil : $scope.isHasOil,
                isHasEwis: $scope.isHasEwis,
                attachmentList:$scope.imgInfo.fileList,
                mechanicNoPhotoRemark:$scope.info.mechanicNoPhotoRemark || ''
            };
            if(!data.technicianFound || !data.technicianFound){
                $rootScope.errTip = '请正确选择故障发现人';
                return;
            };
            if($scope.imgInfo.imgArr.length < 1 && !data.mechanicNoPhotoRemark.trim()){
                $rootScope.errTip = '不上传照片时，无照片备注必填';
                return;
            }
            if ($scope.info.rii == 'n' &&  $scope.info.rci == 'n') {
                $rootScope.errTip = '互必检必须选择一个';
                return;
            }
            // if (($scope.info.rii == 'y' || $scope.info.rci == 'y') &&
            //     $scope.info.inspector.approverSn == $scope.info.tecnician.approverSn) {
            //     $rootScope.errTip = 'Mech Sign与RII Sign不可以为同一个人';
            //     return;
            // }

            if(/[^a-zA-Z0-9`+-~!@#$%^&*()_,./?;:'"\\|\s\n\r\t]/g.test($scope.info.faultReportEng)){
                $rootScope.errTip = 'FAULT REPORT(ENG)内容必须是英文数字或英文标点符号';
                return;
            }

            if(/[^a-zA-Z0-9`+-~!@#$%^&*()_,./?;:'"\\|\s\n\r\t]/g.test($scope.info.takenActionEng)){
                $rootScope.errTip = 'Taken Action内容必须是英文数字或英文标点符号';
                return;
            }

            data.rii = $scope.info.rii;
            data.rci = $scope.info.rci;

            if (data.rii== 'n' && data.rci == 'n') {
                data.inspector = '';
            }
            else {
                data.inspector = $scope.info.inspector.approverSn;
            }


            if ($scope.isShowTo == 'true') {
                var toTroubleShootingVOS = [];
                for (var i = 0, item; item = $scope.toList[0].totroubleShootings[i++];) {
                    toTroubleShootingVOS.push({
                        id: item.id,
                        actionAndFeedback: item.remark,
                        mechSn: $scope.info.tecnician.approverSn
                    })
                }
                data.toTroubleShootingVOS = toTroubleShootingVOS;
            }
            data.itemId = $scope.defectDetail.defectNo; //$scope.defectDetail.itemId;
            data.taskType = 'tbm_non_routine';
            data.sn = $scope.info.tecnician.approverSn;
            // data.source='mobile';
            data.completeDate = $scope.info.completeDate;
            data.dateFound = $scope.info.dateFound;
            data.zone_id =  $scope.zoneInfo.zone_id;
            data.zone =  $scope.zoneInfo.zone_no;

            //步骤反馈实际工时
            var tts=$scope.toList[0].totroubleShootings;
            var wodf=[];
            angular.forEach(tts,function (item,i) {
                wodf.push(item.workOrderFeedbackDetails[0]);
            });
            data.workOrderFeedbackDetails=wodf;
            $rootScope.startLoading();
            server.maocFormdataPost('form/submit', 'tbm-001-f', data).then(function (result) {
                if (200 === result.status) {
                    $localForage.removeItem(paramId);
                    api.alert({
                        msg: '上传排故措施成功'
                    });
                    $rootScope.go('back');
                }
                $rootScope.endLoading();
            }).catch(function (error) {
                $localForage.setItem(paramId, {
                    info: $scope.info
                });
                $rootScope.endLoading();
            });
        }

        //处理乘法精度丢失
        function accMul(arg1,arg2){
            var m=0,s1=arg1.toString(),s2=arg2.toString();
            try{m+=s1.split(".")[1].length}catch(e){}
            try{m+=s2.split(".")[1].length}catch(e){}
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
        }

        //处理加法精度丢失
        function accAdd(arg1,arg2){
            var r1,r2,m;
            try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
            try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
            m=Math.pow(10,Math.max(r1,r2));
            console.log((arg1*m+arg2*m)/m);
            var ar1=accMul(arg1,m);
            var ar2=accMul(arg2,m);
            return (ar1+ar2)/m;
        }

        $scope.checkRealStaff = function (step) {
            var reg=/^\d{1,14}$/;
            var toList=$scope.toList[0].totroubleShootings;
            var toListStep=$scope.toList[0].totroubleShootings[step-1];

            var val=toListStep.workOrderFeedbackDetails[0].realStaff;
            if (!reg.test(val)) {
                toListStep.workOrderFeedbackDetails[0].realStaff="";
                alert("只能输入大于0的整数！");
                return;
            }else{

                var toTotalSum=0;
                angular.forEach(toList,function(item,i){
                    var realStaff=item.workOrderFeedbackDetails[0].realStaff;
                    var realHour=item.workOrderFeedbackDetails[0].realHour;
                    toTotalSum=accAdd(toTotalSum,accMul(realStaff,realHour));
                });

                $scope.totalTimeSum=toTotalSum;
            }
        };
        $scope.checkRealHour = function (step) {
            var reg=/^\d{1,14}(\.\d{0,2})?$/;
            var toList=$scope.toList[0].totroubleShootings;
            var toListStep=$scope.toList[0].totroubleShootings[step-1];

            var val=toListStep.workOrderFeedbackDetails[0].realHour;
            if (!reg.test(val)) {
                toListStep.workOrderFeedbackDetails[0].realHour="";
                alert("工时只能输入数字或者两位小数！");
                return;
            }else{
                var toTotalSum=0;
                angular.forEach(toList,function(item,i){
                    var realStaff=item.workOrderFeedbackDetails[0].realStaff;
                    var realHour=item.workOrderFeedbackDetails[0].realHour;
                    toTotalSum=accAdd(toTotalSum,accMul(realStaff,realHour));
                });

                $scope.totalTimeSum=toTotalSum;
            }
        };
    }
]);