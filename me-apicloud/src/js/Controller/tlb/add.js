module.exports = angular.module('myApp').controller('tlbAddController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter', '$state', '$timeout', 'b64ToBlob',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, $state, $timeout, b64ToBlob) {
            $rootScope.loading = false;

            $scope.hideApproverTitle = true;
            $scope.tlbId = $stateParams.tlbId;
            $scope.faultInfo = $stateParams;
            $scope.jcFeedbackDetailList=$stateParams.routineItem.jcFeedbackDetailList;
            $scope.faultInfo.rii = ($scope.faultInfo.rii == true || $scope.faultInfo.rii == 'y') ? 'y' : 'n';
            $scope.faultInfo.rci = $scope.faultInfo.rci ? 'y' : 'n';
            //数据保存在本地,从其它页面返回时使用
            if(!$scope.faultInfo.acNo){
                $localForage.getItem(configInfo.userCode + 'meTlbAdd').then(function(value){
                    value && ($scope.faultInfo = value);
                });

                $scope.tlbId = localStorage.getItem(configInfo.userCode + 'tlbId');
            } else {
                $localForage.setItem(configInfo.userCode + 'meTlbAdd', $scope.faultInfo).then(function(value){
                   console.log(value);
                });

                localStorage.setItem(configInfo.userCode + 'tlbId', $stateParams.tlbId);
            }

            $scope.isViewStatus = $scope.tlbId ? true : false; //是否查看状态
            $scope.imgInfo = {
                fileArr: [],
                imgArr: [],
                attachvo: []
            };
            var snJson = {};
            $scope.findSn = function () {
                findSN($scope.info.position);
            };

            function findSN(position) {
                if (position == '') {
                    $scope.info.sn = '';
                    return;
                }
                if (snJson[position]) {
                    $scope.info.sn = snJson[position];
                } else {
                    server.maocGetReq('comp/findSNByACAndPosition', {
                        position: position,
                        acNo: $scope.faultInfo.acNo
                    }).then(function (result) {
                        if (200 === result.status) {
                            $scope.info.sn = result.data.data[0];
                            snJson[position] = result.data.data[0];
                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                }
            }

            /**
             * 要提交的数据实体
             */
            var cdnOrDocNo = $scope.faultInfo.cdnType != 'TO' ? $scope.faultInfo.cdnNo : $scope.faultInfo.docNo;
            $scope.info = {
                position: '',
                reported: 'GND',
                dlyCnl: 'n',
                sn: '',
                inspector: {
                    nameAndId: '',
                    approverSn: ''
                },
                mech: {
                    nameAndId: '',
                    approverSn: configInfo.userCode
                },
                tlbNo: '',
                dateAction: new Date($filter('date')(new Date(), 'yyyy/MM/dd HH:mm')),
                dateFound: new Date($filter('date')(new Date(), 'yyyy/MM/dd HH:mm')),
                manHours: '',
                takenActionChn: '',
                takenActionEng: '',
                "faultReportChn": '依据工卡 ' + cdnOrDocNo + ' 执行工作',
                "faultReportEng": 'REF ' +  cdnOrDocNo + ' DO THE PROCESS',
                feedBack: '',
                ata: ($scope.faultInfo.ata.length >= 4 || $scope.faultInfo.ata.length == 0)  ? $scope.faultInfo.ata : ($scope.faultInfo.ata + '000').slice(0,4)
            };

            function getTlbData(tlbId, isGetPic){
                $scope.isViewStatus = true;
                $rootScope.startLoading();
                //提交请求，等待响应
                server.maocGetReq('TLB/getTLBById',{id: tlbId}).then(function (response) {
                    $rootScope.endLoading();
                    if(200 == response.data.statusCode) {
                        var data = response.data.data[0];

                        if(isGetPic){
                            //获取已上传附件的列表
                            server.maocGetReq('defect/findPictureByActionId', {actionId: data.actionDTO.id}).then(function(result) {
                                if(200 === result.status) {
                                    angular.forEach(result.data.data, function(item, index){
                                        var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                        var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                        var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                        imgBlob.name = item.name.indexOf('down') == -1
                                            ? imgName + 'down' + imgType
                                            : item.name;
                                        $scope.imgInfo.fileArr.push(imgBlob);
                                        $scope.imgInfo.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                    })

                                }else{
                                    api.alert({
                                        msg: '获取附件失败'
                                    });
                                }
                                $rootScope.endLoading();
                            }).catch(function(error) {
                                $rootScope.endLoading();
                            });
                        }

                        //处理获取到的数据
                        angular.forEach(data.tlbCompCCDTOList, function(ccInfo, index){
                            angular.forEach(data.tlbCompCCSubDTOList, function(ccSubInfo, idx){
                                if(ccSubInfo.tlbCCId == ccInfo.id){
                                    ccInfo.tlbCompCCSubSet.push(ccSubInfo);
                                }
                            });
                        });
                        if (typeof (data.tlbDTO.rci) == 'undefined') {
                            data.tlbDTO.rci = 'n';
                        }
                        $scope.ccList = data.tlbCompCCDTOList;
                        $scope.info = angular.extend({}, $scope.info, data.tlbDTO, data.actionDTO);

                        $scope.info.reported = data.tlbDTO.defectOrigin == 'GND' ? 'Ground' : 'PILOT';
                        $scope.info.sn = data.tlbDTO.engineSN;
                        $scope.info.position = data.tlbDTO.engineType;
                        $scope.info.dateAction = new Date(data.tlbDTO.dateAction);
                        $scope.info.dateFound = new Date(data.tlbDTO.dateFound);

                        $scope.info.mech.approverSn = data.tlbDTO.technicianFoundNo;
                        $scope.info.mech.nameAndId = data.tlbDTO.technicianFoundNo+ ' ' + data.tlbDTO.technicianFound;
                        $scope.info.inspector = {
                            nameAndId: data.tlbDTO.rii == 'y' || data.tlbDTO.rci =='y' ? (data.tlbDTO.inspectorNo + ' ' + data.tlbDTO.inspector) : '',
                            approverSn: data.tlbDTO.rii == 'y' || data.tlbDTO.rci =='y' ? data.tlbDTO.inspectorNo : ''
                        }
                        $scope.faultType = data.tlbDTO.faultType;
                    }

                }).catch(function (error) {
                    alert('网络请求失败');
                    $rootScope.endLoading();
                });
            }

            $scope.tlbId && getTlbData($scope.tlbId, true);

            $scope.scan = function () {
                var FNScanner = api.require('FNScanner');
                FNScanner.open({
                    autorotation: true
                }, function(ret, err) {
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

            $rootScope.errAlertCallBack = function () {
                $rootScope.errAlert = false;
                history.go(-1)
            };
            //cc跳转
            $scope.goAddOrDetail = function(cc, tlbId, faultInfo, docType){
                var docNo = docType == 'TO' ? faultInfo.tlbNo : faultInfo.docNo,
                    docType = docType == 'TO' ? 'TLB' : docType;

                // if(cc.middleStatus == "O" || angular.equals(cc, {})){
                //     $rootScope.go('cc', 'slideLeft', {defectInfo: faultInfo, cc: cc, tlbId: tlbId, docType: docType, docNo: docNo});
                // }else{
                //     $rootScope.go('ccInfo', 'slideLeft', {ccInfo: cc});
                // }
                $rootScope.go('newccInfo', 'slideLeft', {ccInfo: cc});



            }
            var paramId = $scope.faultInfo.itemId + '_tlb';
            /**
             * 读取数据
             */
            $localForage.getItem(paramId).then(function (val) {
                if (val && val.info) {
                    val.info.dateAction = new Date(val.info.dateAction);
                    $scope.info = val.info;
                }
            });
            findSN($scope.info.position);

            //保存TLB
            $scope.saveMethod = function () {
                var tbmTaskType = $scope.faultInfo.cdnType == 'TO' ? 'tbm_non_routine' : 'tbm_routine';
                if (($scope.faultInfo.rii == 'y' || $scope.faultInfo.rci == 'y') &&
                    $scope.info.inspector.approverSn == $scope.info.mech.approverSn) {
                    $rootScope.errTip = 'Mech Sign与RII Sign不可以为同一个人';
                    return;
                }

                $rootScope.startLoading();
                var data = {
                    itemId: $scope.faultInfo.itemId,
                    checkType: $scope.faultInfo.checkType,
                    flightDate: new Date($scope.faultInfo.flightDate),
                    "tlbDTO": {
                        "faultType":  $scope.faultType || "S",
                        "defectOrigin": $scope.info.reported,
                        "dlyCnl": $scope.info.dlyCnl,
                        "tlbId": $scope.tlbId || '',
                        "tlbNo": $scope.info.tlbNo,
                        "acReg": $scope.faultInfo.acNo,
                        "minorModel": $scope.faultInfo.minorModel,
                        "flightId": $scope.faultInfo.flightId, //123
                        "flightNo": $scope.faultInfo.flightNo,
                        "staFound": $scope.faultInfo.station,
                        "dateAction": $scope.info.dateAction.getTime(),
                        "dateFound": $scope.info.dateFound.getTime(),
                        "ata": $scope.info.ata,
                        "ctrlDocType": $scope.faultInfo.cdnType,
                        "ctrlDocNo": $scope.faultInfo.cdnNo,
                        "ctrlDocId": $scope.faultInfo.cdnId, //123
                        "faultReportChn": $scope.info.faultReportChn,
                        "faultReportEng": $scope.info.faultReportEng,
                        "manHours": $scope.info.manHours,

                        "technicianFoundNo": $scope.info.mech.approverSn,
                        "technicianFound": null,
                        "rii": $scope.faultInfo.rii,
                        "rci": $scope.faultInfo.rci || 'n',
                        "inspectorNo": $scope.faultInfo.rii == 'y' || $scope.faultInfo.rci == 'y'? $scope.info.inspector.approverSn : '',
                        "inspector": null,
                        "technicianActSign": null,
                        "technicianActNo": $scope.info.mech.approverSn,

                        "engineSN": $scope.info.sn,
                        "engineType": $scope.info.position,
                        "dm": $scope.faultInfo.dm || '',
                        "dmValue": $scope.faultInfo.dmValue || '',
                        "tbmTaskType":tbmTaskType,

                    },
                    "jcFeedbackDetail":{
                        kbbhValue:$scope.kbbhValue,
                        tlimitGroupPkid:$scope.tlimitGroupPkid,
                        viNo:$scope.viNo
                    },
                    "actionDTO": {
                        "id" : $scope.info.actionId || '',
                        "lineJobId": $scope.faultInfo.lineJobId,
                        "takenActionChn": $scope.info.takenActionChn,
                        "takenActionEng": $scope.info.takenActionEng,
                        "staAction": $scope.faultInfo.station,
                        "dateAction": $scope.info.dateAction.getTime(),
                        "manHours": "",
                        "technicianId": null
                    }
                };


                server.maocFormdataPost('form/submit', 'tlb-001-a', data, $scope.imgInfo.fileArr).then(function (result) {
                    if (200 === result.status) {
                        $scope.tlbId = result.data.data[0];
                        localStorage.setItem(configInfo.userCode + 'tlbId', $scope.tlbId);
                        getTlbData(result.data.data[0]);
                        $localForage.removeItem(paramId);
                        //$rootScope.errAlert = 'NRC.EO.JC完工反馈添加成功';
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $localForage.setItem(paramId, {
                        info: $scope.info
                    });
                    $rootScope.endLoading();
                });
            }

            //查看页面提交功能
            $scope.submitMethod = function () {

                if($scope.faultInfo.cdnType == 'TO') {
                    var routineItem = $scope.faultInfo.routineItem;
                    console.log(JSON.stringify(routineItem));
                    $rootScope.go(
                        'me.releaseTask.meForm',
                        '',
                        {
                            'formId': routineItem.formId,
                            'itemId': routineItem.itemId,
                            'nonRoutineCardNumber': routineItem.cardNo,
                            'taskType': 'tbm_non_routine',
                            'cardType': routineItem.cardType,
                            'nonRoutineRequireFeedback': routineItem.requireFeedback,
                            'flowInstanceId': routineItem.flowInstanceId,
                            dm:routineItem.dm
                        }
                    );
                }
                else {
                    $rootScope.startLoading();
                    var data = {
                        itemId: $scope.faultInfo.itemId,
                        taskType: 'tbm_routine',
                        sn: $scope.info.mech.approverSn,
                        manHours: $scope.info.manHours,
                        completeDate: $scope.info.dateAction.getTime(),
                        feedBack: $scope.info.feedBack,
                        tlbNo: $scope.info.tlbNo,
                        dlyCnl: $scope.info.dlyCnl,
                        takenActionChn: $scope.info.takenActionChn,
                        takenActionEng: $scope.info.takenActionEng,

                        inspector: $scope.info.inspector.approverSn,
                        licenseNo: $scope.info.mech.approverSn,
                    };
                    // data.source='mobile';
                    server.maocFormdataPost('form/submit', 'tbm-001-f', data, $scope.imgInfo.fileArr).then(function (result) {
                        if (200 === result.status) {
                            $localForage.removeItem(paramId);
                            alert('NRC.EO.JC完工反馈添加成功');
                            $rootScope.go('back');
                            //$rootScope.errAlert = 'NRC.EO.JC完工反馈添加成功';
                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                }


            }
            $scope.tlimitGroupPkid="";
            $scope.viNo="";
            $scope.kbbhValue="";
            $scope.obj_id="";
            $scope.activeid="";
            $scope.cheon_click=function (obj) {
                $scope.activeid=obj.viNo;
                if(obj.viNo==$scope.obj_id){
                }else {
                    $scope.kbbhValue="";
                    $scope.obj_id=obj.viNo;
                }
                obj.check="Y";
                $scope.tlimitGroupPkid=obj.tlimitGroupPkid;
                $scope.viNo=obj.viNo;
            }
            
        }
    ]);
