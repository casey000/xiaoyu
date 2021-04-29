/**
 * Created by web on 29/11/17.
 */

module.exports = angular.module('myApp').controller('newFaultController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter', 'b64ToBlob', '$timeout','checkDmInfo',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob, $timeout,checkDmInfo) {
            $scope.isCreateData = true;
            $scope.isNewFault = true;
            $scope.confirmFlag = false
            console.log($stateParams);
            var paramId;
            /**
             * 图片列表
             * @type {Array}
             */
            $scope.isApiCloud = true; //上传附件时是否要用apiCloud方法
            $scope.imgArr = [];  //页面预览所用文件
            $scope.fileArr = [];  //要上传的二进制流
            $scope.workcardInfo = {};
            $scope.workOrderInfo = {isNewFault:true};
            $scope.woList = [];
            $scope.woNumIndx = '';
            $scope.flightNoInfo = {label:$stateParams.flight.acReg};
            $scope.acModel = "";

            /**
             * Type
             * @type {number} 1:U 2:S 3:O
             */
            $scope.typeState = 1;
            $scope.ndtCategorys = [];
            $scope.damageTypes= [];
            $scope.damageReasons =[];
            $scope.selectedDamageTypes=[];
            $scope.selectNdtCategory = '';
            /**
             * 语音录入状态
             * @type {boolean}
             */
            $scope.isSound = false;
            $scope.uploadSoundArr = [];


            $scope.changeSound = function () {
                $scope.isSound = !$scope.isSound;
            };

            $scope.today = new Date();
            //缓存路由参数,由其它页面返回时使用

            if (!angular.equals($stateParams.flight, {})) {
                initData();
                $localForage.setItem('faultStateParams', $stateParams);
            } else {
                $localForage.getItem('faultStateParams').then(function (val) {
                    $stateParams = val;
                    initData();
                    $scope.getFlightNo();
                    $scope.getDamageTypes();
                    $scope.getNdtCategorys();
                    $scope.getWo();
                });
            }

            function initData() {
                $scope.dateFound = $scope.today;
                //除航后外参数tr都为true
                var jobInfo = $stateParams.tr ? ($stateParams.flight.departureStationJob || $stateParams.flight)
                                                : $stateParams.flight.arrivalStationJob;
                $scope.jobInfo = jobInfo;
                //缓存数据所用id,确保唯一性
                paramId = configInfo.userCode + $stateParams.flight.flightDate + $stateParams.flight.flightNo + jobInfo.jobType;

                /*
                * jobDate取值, tr,pr/f为计划起飞时间std
                * po/f 为计划到达时间sta
                * og为jobDate (航班日期 9:00)
                * */
                var jobDate = angular.uppercase(jobInfo.jobType) == 'O/G' ? jobInfo.jobDate
                            : ($stateParams.tr ? $stateParams.flight.std : $stateParams.flight.sta);
                console.log(jobInfo.jobType,'jobInfo.jobType')
                $scope.mrInfo = {
                    dateFound: new Date($filter('date')($scope.dateFound, 'yyyy/MM/dd HH:mm')),
                    defectOrigin: 'GND',
                    "jobId": jobInfo.jobId,
                    "faultType": 'U',
                    "acReg": $stateParams.flight.acReg,
                    "jobDate": $filter('date')(new Date(jobDate), "yyyy/MM/dd HH:mm:ss"),
                    "checkType": jobInfo.jobType || '',//取航班行前或者航后
                    "reviewType":$stateParams.flight.fromPage ? '' : jobInfo.jobType ,
                    "flightId": $stateParams.flight.flightId,
                    "preFlightId": '' ,
                    "flightNo": $stateParams.flight.flightNo || 'N/A',
                    "preFlightNo":'',
                    "station": jobInfo.station,
                    dmStatus: $stateParams.flight.dmStatus,
                    dm : '',
                    isStructureDamage:'',
                    drBaseSubmitAsmsDTO:{
                        zone:'',//区域
                        maintenanceLevel: '',//维护级别
                        wo: '',//工作指令号
                        cardNumber: '',//相关工卡
                        checkMethod: '1',//检查方法
                        checkModeOther: '',//检查方法其他
                        checkMode: '',//NDT类别
                        defect: '',//外观是否可见
                        operator: 'SFN',//运营人(默认为SFN）
                        defectType: '',
                        equipment: 4,//录入设备，1：ASMSpc端，2:ASMS移动端，3：故障pc端，4：故障移动端(默认为3）
                        defectTypeOther:''
                    },
                };
                $scope.checkMethods = [
                    {name:'一般目视',value:"1"},
                    {name:"详细目视", value:"2"},
                    {name:"NDT",value:"3"},
                    {name:"其它",value:"4"},
                    {name:"敲击检查",value:"5"}
                ];
                // $scope.mrInfo.drBaseSubmitAsmsDTO.checkMethod = '1';
                $scope.zoneInfo = {
                    "zone_id": "",
                    "zone_no" : "",
                    "zone_area": ""
                };

                $localForage.getItem(paramId).then(function (val) {
                    console.log(val,'val')
                    if (val) {
                        $scope.mrInfo = val.formParam;
                        $scope.woNumIndx = val.woNumIndx;
                        $scope.workcardInfo.cardNo = val.formParam.drBaseSubmitAsmsDTO.cardNumber;
                        $scope.selectedDamageTypes = val.formParam.drBaseSubmitAsmsDTO.defectType.split(",");
                        $scope.mrInfo.jobDate = String($scope.mrInfo.jobDate) != 'Invalid Date' ? $scope.mrInfo.jobDate
                                                : $filter('date')(new Date(jobDate), "yyyy/MM/dd HH:mm:ss");
                        $scope.mrInfo.dateFound = new Date($scope.mrInfo.dateFound);
                        $scope.imgArr = val.imgArr;
                        $scope.uploadSoundArr = val.soundArr;
                    }
                    console.log($scope.selectedDamageTypes,'$scope.selectedDamageTypes')
                });

                var lanConfig = require('../../../../i18n/lanConfig');
                $scope.holderValue = lanConfig.inputName;
                $rootScope.endLoading();
            }

            $scope.sortNumberArray = function (op) {
                return op;
            };
            $scope.getNdtCategorys = function () {
                server.maocGetReq('asms/drBaseMobile/queryDictionaries/DamageSetting_CheckMode').then(function (res) {
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        $scope.ndtCategorys = response.result;
                    }
                });
            };
            $scope.getDamageTypes = function () {
                server.maocGetReq('asms/drBaseMobile/queryDefectTypes').then(function(res){
                    // console.log('queryDefectTypes' + JSON.stringify(res));
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        var result = response.result;
                        $scope.damageTypes = result;
                        // $scope.info.toolInfos.damageTypes = $filter('orderBy')(result,'value');
                    }
                });
            };

            $scope.getWo = function(){
                var obj = {};
                // console.log($scope.jobInfo.jobType,'global_data.reviewType');
                if($scope.jobInfo.jobType == 'O/G' ){
                    obj = {
                        woNo:'OG Flight',
                        type:'O/G'
                    }
                }
                if($scope.jobInfo.jobType == 'T/R'){
                    obj = {
                        woNo:'Tr Flight',
                        type:'T/R'
                    }
                }
                if($scope.jobInfo.jobType == 'Pr/F' ){
                    obj = {
                        woNo:'Pre Flight',
                        type:'Pr/F'

                    }
                }
                if($scope.jobInfo.jobType == 'Po/F' ){
                    obj = {
                        woNo:'Post Flight',
                        type:'Po/F'

                    }
                }
                if($scope.jobInfo.jobType == 'TBFTR' ){
                    obj = {
                        woNo:'Tr Flight',
                        type:'TBFTR'
                    }
                }

                var data = {ac:$scope.mrInfo.acReg,drDate:new Date($scope.mrInfo.dateFound)};
                server.maocPostReq('asms/toolInfoMobileApi/queryWoNoForTd', data, true).then(function (result) {
                    if (200 === result.status) {
                        result.data.data[0].result.unshift(obj);
                        $scope.woList = result.data.data[0].result;
                        $scope.woNumIndx = 0;
                        $scope.mrInfo.drBaseSubmitAsmsDTO.maintenanceLevel = $scope.woList[$scope.woNumIndx].type||'';
                        $scope.mrInfo.drBaseSubmitAsmsDTO.wo = $scope.woList[$scope.woNumIndx].woNo||'';
                        $scope.workOrderInfo.woNo = $scope.woList[$scope.woNumIndx].woNo||'';
                        $scope.workOrderInfo.jobId = $scope.jobInfo.jobId||'';
                        $scope.workOrderInfo.isDefault = true;
                        console.info(result.data.data[0].result,'result')
                    }

                }).catch(function (error) {
                });
            };
            $scope.checkDate = function(){
                $scope.woNumIndx = '';
                $scope.mrInfo.drBaseSubmitAsmsDTO.maintenanceLevel = '';
                $scope.mrInfo.drBaseSubmitAsmsDTO.wo = '';
                $scope.workOrderInfo.woNo = '';
                $scope.workcardInfo.cardNo = '';
                $scope.woList = [];
                $scope.getWo()
            };
            /**
             *工作指令号变更
             */
            $scope.woChanged = function(){
               $scope.mrInfo.drBaseSubmitAsmsDTO.maintenanceLevel = $scope.woList[$scope.woNumIndx].type||'';
               $scope.mrInfo.drBaseSubmitAsmsDTO.wo = $scope.woList[$scope.woNumIndx].woNo||'';
               $scope.workOrderInfo.woNo = $scope.woList[$scope.woNumIndx].woNo||'';
               $scope.workOrderInfo.jobId = $scope.jobInfo.jobId||'';
                var typeObj = {
                    'O/G':1,
                    'T/R':1,
                    'Pr/F':1,
                    'Po/F':1,
                };
                if(typeObj[$scope.mrInfo.drBaseSubmitAsmsDTO.maintenanceLevel]){
                    $scope.workOrderInfo.isDefault = true;
                    // $scope.queryDefaultCard();
                }else{
                    $scope.workOrderInfo.isDefault = false;
                    // $scope.queryCard();
                }
            };
            $scope.queryCard = function(){
                server.maocGetReq('asms/toolInfoMobileApi/findCard',{woNo:$scope.mrInfo.drBaseSubmitAsmsDTO.wo,cardNo:''}).then(function (res) {
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        $scope.cardList = response.result;
                    }
                });
            };
            $scope.queryDefaultCard = function(){
                server.maocGetReq('assembly/listRoutineTaskByParentId',{parentId:$scope.jobInfo.jobId}).then(function (res) {
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        $scope.cardList = response.result;
                    }
                });
            };
            //根据航班状态获取航班号，以保证新建故障显示航班后，与故障建完后的航班号一致
            $scope.getFlightNo = function () {

                var params = {acReg:$scope.mrInfo.acReg,
                        checkType:$scope.mrInfo.checkType,
                    flightNo:$scope.mrInfo.flightNo,
                    jobDate: $scope.jobInfo.jobDate ? $filter('date')(new Date($scope.jobInfo.jobDate), "yyyy/MM/dd HH:mm:ss") : $scope.mrInfo.jobDate
                                };
                $rootScope.startLoading();
                server.maocGetReq('Pend/getFlbFlightLog',params).then(function (result) {
                    // console.log(JSON.stringify(result));
                    if (result.status == 200) {
                        var preFlightNo = result.data.data[0].preFlightNo;
                        $scope.mrInfo.preFlightNo = preFlightNo;
                        $scope.acModel= result.data.data[0].model||"";
                        $scope.mrInfo.preFlightId = (result.data.data[0].checkType != 'Po/F' ? result.data.data[0].preFlightId :$scope.mrInfo.flightId);
                        $scope.jobInfo.preFlightNo = preFlightNo;
                        console.info($scope.mrInfo,'12323')
                        $stateParams.flight.preFlightNo = preFlightNo;
                        $localForage.setItem('faultStateParams', $stateParams);
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };

            if (typeof ($scope.mrInfo) != 'undefined') {
                $scope.getFlightNo();
                $scope.getDamageTypes();
                $scope.getNdtCategorys();
                $scope.getWo();
            }

            $scope.reportType = function (event) {
                var reportType = event.target.innerText.toUpperCase();
                $scope.mrInfo.defectOrigin = reportType == 'GROUND' ? 'GND' : reportType;
            };

            $scope.DMType = function (event) {
                var content = event.target.innerText.toUpperCase();
                var dm = '';
                if (content === 'YES') {
                    dm = 'y';
                }
                else if (content === 'NO') {
                    dm = 'n';
                }
                else {
                    dm = '';
                }
                $scope.mrInfo.dm = dm;
            };

            $scope.setRii = function (event) {
                $scope.mrInfo.rii = event.target.innerText == 'NO' ? 'n' : 'y';
            };

            $scope.getSn = function () {
                server.maocGetReq('comp/findSNByACAndPosition', {
                    acNo: $stateParams.flight.acReg,
                    position: $scope.mrInfo.engineType
                }).then(function (data) {
                    if (200 === data.status) {
                        $scope.mrInfo.engineSn = data.data.data[0];
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }
            $scope.$watch('mrInfo.ata',function (n,o) {
                if (n && n.length == 4) {
                    var params = {
                        ata:n,
                        applyType:'APL',
                        applyId:'',
                        acReg:$scope.mrInfo.acReg,
                        model:$stateParams.flight.acType
                    }
                    checkDmInfo.getDmInfo(params).then(function(data) {
                        // console.log(JSON.stringify(data));
                        console.log(data)
                        console.log(data.data.isDm,'data.isDm')
                        if(data.data.isDm && data.data.isDm == 1){
                            $scope.mrInfo.dm = 'y' ;
                            $scope.dmDisable = true;
                        }else{
                            $scope.dmDisable = false;
                        }

                    }).catch(function(error) {
                        console.log(error);

                    });
                }
            });
            $scope.checkError = function (isError, checkWord) {
                if (isError) {
                    $scope[checkWord + 'Error'] = true;
                } else {
                    $scope[checkWord + 'Error'] = false;
                }
            };
            /**
             *返回
             */
            $scope.gobackToRoot = function () {
                NativeAppAPI.audioPlayerStop();
                $rootScope.go('back', 'slideLeft', {isNewFault: true});
            };
            $scope.addSure =function(){
                $scope.confirmFlag = true;
                $scope.submit($scope.mrInfo);
            };
            /**
             * 提交表单数据
             * @params {表单内容}
             *
             */
            $scope.submit = function (mrInfo) {
               console.info($scope.selectedDamageTypes.join(','));
                if(mrInfo.isStructureDamage == 'y' && $scope.confirmFlag == false){
                    $scope.flowWindow = true;
                    return;
                }

                if(/[^a-zA-Z0-9`+-~!@#$%^&*()_,./?;:'"\\|\s\n\r\t]/g.test(mrInfo.faultReportEng)){
                    $rootScope.errTip = 'Fault Report(English)内容必须是英文数字或英文标点符号';
                    return;
                }

                //禁用提交按钮
                $scope.myForm.$valid = false;
                $rootScope.startLoading();
                var params = angular.copy(mrInfo);
                if(mrInfo.isStructureDamage == 'y'){
                    params.drBaseSubmitAsmsDTO.defectType = $scope.selectedDamageTypes.join(',');
                    params.drBaseSubmitAsmsDTO.cardNumber = $scope.workcardInfo.cardNo;
                }
                if (params.rewiewType) {
                    params.rewiewType = params.rewiewType.join(',');
                }
                /**
                 * no,timeId,nameAndId接口不需要接收
                 * 只保存在本地数据库中
                 */
                params.technicianFound = $scope.mrInfo.approverSn;
                params.creator =  configInfo.userCode;
                params.zone_id = $scope.zoneInfo.zone_id;

                delete params.approverName;
                delete params.approverSn;
                delete params.approverId;
                delete params.nameAndId;
                delete params.diffName;

                var formId = 'defect-001-a';
                var fileSoundArr = [];

                if ($scope.uploadSoundArr.length > 0 || $scope.fileArr.length > 0) {
                    MEAPI.formdataPost('form/submit', formId, params, $scope.uploadSoundArr, $scope.fileArr).then(function (data) {
                        $timeout(function () {
                            if (200 === data.statusCode) {
                                $scope.flowWindow = false;
                                $scope.submitSuccess = true;
                                $localForage.removeItem(paramId);
                                //$rootScope.go('back');
                                console.log($scope.fileArr[0]);
                                console.log('AngularJS成功从api回调，并执行');

                                $rootScope.go('searchFault.faultClose', '', {
                                    defectId: data.data[0].messageBody,
                                    faultFlight: $stateParams.flight,
                                    tr: $stateParams.tr,
                                    pt: true
                                });
                            } else {
                                $localForage.setItem(paramId, {
                                    formParam: mrInfo,
                                    woNumIndx : $scope.woNumIndx,
                                    files: $scope.files,
                                    imgArr: $scope.imgArr,  //页面预览所用文件
                                    soundArr: $scope.uploadSoundArr //页面预览所用base64
                                });
                                $scope.myForm.$valid = true; //提交不成功，提交按钮可用
                                $scope.errorInfo = data.data;

                                api.alert({
                                    msg: data.data.msg.error_description
                                });
                            }
                            $rootScope.endLoading();
                        });

                    }).catch(function (error) {
                        $timeout(function () {
                            console.log('AngularJS成功从api回调失败状态');
                            $localForage.setItem(paramId, {
                                formParam: mrInfo,
                                files: $scope.files,
                                woNumIndx : $scope.woNumIndx,
                                imgArr: $scope.imgArr,  //页面预览所用文件
                                soundArr: $scope.uploadSoundArr //页面预览所用base64
                            });
                            $scope.myForm.$valid = true; //提交不成功，提交按钮可用
                            $rootScope.endLoading();
                            api.alert({
                                msg: error.body['error_description'] || error.body
                            });
                            $scope.submitSuccess = false;
                        });
                    });
                } else {
                    server.maocFormdataPost('form/submit', formId, params, $scope.files).then(function (data) {

                        if (200 === data.status) {
                            $scope.flowWindow = false;
                            $scope.submitSuccess = true;
                            $localForage.removeItem(paramId);
                            //$rootScope.go('back');
                            $rootScope.go('searchFault.faultClose', '', {
                                defectId: data.data.data[0].messageBody,
                                faultFlight: $stateParams.flight,
                                tr: $stateParams.tr,
                                pt: true
                            });
                        } else {
                            $localForage.setItem(paramId, {
                                formParam: mrInfo,
                                files: $scope.files,
                                woNumIndx : $scope.woNumIndx,
                                imgArr: $scope.imgArr,  //页面预览所用文件
                                soundArr: $scope.uploadSoundArr //页面预览所用base64
                            });
                            $scope.myForm.$valid = true; //提交不成功，提交按钮可用
                            $scope.errorInfo = data.data;
                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        $localForage.setItem(paramId, {
                            formParam: mrInfo,
                            files: $scope.files,
                            woNumIndx : $scope.woNumIndx,
                            imgArr: $scope.imgArr,  //页面预览所用文件
                            soundArr: $scope.uploadSoundArr //页面预览所用base64
                        });
                        $scope.myForm.$valid = true; //提交不成功，提交按钮可用
                        $rootScope.endLoading();

                        $scope.submitSuccess = false;
                    });
                }
            }
        }
    ]);