angular.module('myApp')
    .directive('faultDtl', ['server', '$filter', '$rootScope', 'configInfo', 'b64ToBlob', 'checkDmInfo',
        function (server, $filter, $rootScope, configInfo, b64ToBlob, checkDmInfo) {
            return {
                restrict: 'E',
                templateUrl: 'common/fault-dtl.html',
                replace: true,
                transclude: true,
                scope: {
                    saveSuccess: '&',
                    addFault: '&',
                    faultFile: '&',
                    damageFile: '&',
                    outlineFile: '&',
                    // nrcFile: '&',
                    faultData: '=',
                    attachList: '=',
                    faultInfo: '=',
                    acModel:"=",
                    pendList: '=',
                    loading: '=',
                    nrcIndex: '=',
                    isApiCloud: '@',
                    pullToRefreshActive: '=',
                    // workcardInfo:'=',
                    // workorderInfo:'=',
                    // woList:'=',
                },
                link: link
            };

            function link($scope, ele, attr) {
                $scope.isApiCloud = true;
                $scope.hideApproverTitle = true;
                $scope.isEdit = false;
                $scope.deferredNo = '';
                $scope.imgInfo = {
                    imgArr: [],
                    fileArr: [],
                    attachvo: []
                };

                $scope.today = new Date();
                $scope.acModel = $scope.acModel||"";
                $scope.$watch('pendList',function (n,o) {
                    if ($scope.pendList.length > 0) {
                        angular.forEach($scope.pendList,function (item,index) {
                            if (item.category == 'DFRL') {
                                $scope.deferredNo = item.deferredNo;
                            }
                        });
                    }
                    // console.log('deferredNo===' + $scope.deferredNo);
                });
                $scope.$watch('info.ata',function (n,o) {
                    if (n && n.length == 4) {
                        var params = {
                            ata:n,
                            applyType:'APL',
                            applyId:'',
                            acReg:$scope.faultInfo.acReg,
                            model:$scope.faultInfo.model
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
                 * 语音录入状态
                 * @type {boolean}
                 */
                $scope.isSound = false;
                $scope.uploadSoundArr = [];

                $scope.changeSound = function () {
                    $scope.isSound = !$scope.isSound;
                };

                $scope.checkError = function (isError, checkWord) {
                    if (isError) {
                        $scope[checkWord + 'Error'] = true;
                    } else {
                        $scope[checkWord + 'Error'] = false;
                    }
                }

                $scope.info = {
                    dateFound: new Date(),
                    technician: {},
                    ata: '',
                    engineType: '',
                    reviewType: {},
                    defectOrigin: '',
                    rii: 'y',
                    faultReportChn: '',
                    faultReportEng: '',
                    dm:'y',
                    dmStatus: 1,
                    selectedDamageTypes:[],

                };

                // $scope.$watch('faultData',function () {
                    // $scope.info.zoneInfo = {
                    //     "zone_id": $scope.faultData.zone_id,
                    //         "zone_no" : $scope.faultData.zone_no,
                    //         "zone_area": $scope.faultData.zone_area
                    // };
                // });
                $scope.nrcFile = function(index,type){
                    if(type == 'pend'){
                        server.maocGetReq('nrc/queryNrcByNrcNo', {nrcNo:index}).then(function (data) {
                            // server.maocGetReq('nrc/queryNrcByNrcNo', {nrcNo:'19102287'}).then(function (data) {
                            if (200 === data.status) {
                                var nrcId = data.data.data[0].nrcBase.id ;
                                $rootScope.go('nrcDetail', '', {nrcId:nrcId});
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                        return
                    }
                    if(!type && $scope.faultInfo.drBaseSubmitAsmsDTO.nrcDtoList[index].nrcNo){
                        server.maocGetReq('nrc/queryNrcByNrcNo', {nrcNo:$scope.faultInfo.drBaseSubmitAsmsDTO.nrcDtoList[index].nrcNo}).then(function (data) {
                            // server.maocGetReq('nrc/queryNrcByNrcNo', {nrcNo:'19102287'}).then(function (data) {
                            if (200 === data.status) {
                                var nrcId = data.data.data[0].nrcBase.id ;
                                $rootScope.go('nrcDetail', '', {nrcId:nrcId});
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }else{
                        alert('数据有误')
                    }
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
                            $rootScope.go('tmcExperienceList','',{defectId:$scope.faultInfo.id,srcType:type,ata:$scope.faultInfo.ata,acReg:$scope.faultInfo.acReg,acModel:$scope.faultInfo.model,keywords:$scope.faultInfo.faultReportChn});
                            break;

                        default:
                            // alert('任务类型不正确');
                            $rootScope.errTip = '任务类型不正确';
                            return;

                    }
                };
                $scope.helpSearch = function(){
                    $rootScope.go('defectHelpList','',{defectId:$scope.faultInfo.id,ata:$scope.faultInfo.ata,acReg:$scope.faultInfo.acReg,acModel:$scope.faultInfo.model,keywords:$scope.faultInfo.faultReportChn});
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
                            OPENAPI.relatedDocCheck()
                            param.url = data.data.data[0];
                            NativeAppAPI.openPdfWithUrl(param);
                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        console.log(error);
                    });
                };
                $scope.chooseY = function () {
                    if($scope.faultInfo.isStructureDamage == 'y'){
                        $scope.faultInfo.drBaseSubmitAsmsDTO = {};
                            $scope.workcardInfo = {};
                            $scope.workOrderInfo = {isNewFault:true};
                            $scope.woList = [];
                            $scope.woNumIndx = '';
                            $scope.checkMethods = [
                                {name:'一般目视',value:"1"},
                                {name:"详细目视", value:"2"},
                                {name:"NDT",value:"3"},
                                {name:"其它",value:"4"},
                                {name:"敲击检查",value:"5"}
                            ];
                            $scope.ndtCategorys = [];
                            $scope.damageTypes= [];
                            $scope.damageReasons =[];
                            $scope.selectNdtCategory = '';
                            var obj = {};
                            if($scope.faultInfo.parentWorkType == 'O/G' ){
                                obj = {
                                    woNo:'OG-Flight',
                                    type:'O/G'
                                }
                            }
                            if($scope.faultInfo.parentWorkType == 'T/R' || $scope.faultInfo.parentWorkType== 'TBFTR' ){
                                obj = {
                                    woNo:'Tr-Flight',
                                    type:'T/R'
                                }
                            }
                            if($scope.faultInfo.parentWorkType == 'Pr/F' ){
                                obj = {
                                    woNo:'Pre-Flight',
                                    type:'Pr/F'

                                }
                            }
                            if($scope.faultInfo.parentWorkType == 'Po/F' ){
                                obj = {
                                    woNo:'Post-Flight',
                                    type:'Po/F'

                                }
                            }
                            var data = {ac:$scope.faultInfo.acReg,drDate:new Date($scope.faultInfo.dateFound)};
                            server.maocPostReq('asms/toolInfoMobileApi/queryWoNoForTd', data, true).then(function (result) {
                                if (200 === result.status) {
                                    result.data.data[0].result.unshift(obj);
                                    $scope.woList = result.data.data[0].result;
                                    $scope.woNumIndx = 0 ;
                                    $scope.faultInfo.drBaseSubmitAsmsDTO.maintenanceLevel = $scope.woList[$scope.woNumIndx].type||'';
                                    $scope.faultInfo.drBaseSubmitAsmsDTO.wo = $scope.woList[$scope.woNumIndx].woNo||'';
                                    $scope.workOrderInfo.woNo = $scope.woList[$scope.woNumIndx].woNo||'';
                                    $scope.workOrderInfo.jobId =   $scope.faultInfo.jobId||'';
                                    $scope.workOrderInfo.isDefault = true;
                                    console.warn($scope.workOrderInfo);
                                    console.warn($scope.woList,'232');
                                }

                            }).catch(function (error) {
                            });

                            server.maocGetReq('asms/drBaseMobile/queryDictionaries/DamageSetting_CheckMode').then(function (res) {
                                var statusCode = res.data.statusCode;
                                if (statusCode == 200) {
                                    var response = res.data.data[0];
                                    $scope.ndtCategorys = response.result;
                                }
                            });

                            server.maocGetReq('asms/drBaseMobile/queryDefectTypes').then(function(res){
                                var statusCode = res.data.statusCode;
                                if (statusCode == 200) {
                                    var response = res.data.data[0];
                                    var result = response.result;
                                    $scope.damageTypes = result;
                                    // $scope.info.toolInfos.damageTypes = $filter('orderBy')(result,'value');
                                }
                            });


                    }
                };

                $scope.checkEvent = function (key) {
                    if ($scope.info.reviewType[key]) {
                        delete $scope.info.reviewType[key];
                    } else {
                        $scope.info.reviewType[key] = true;
                    }
                };

                $scope.cancelEdit = function () {
                    $scope.isEdit = $scope.isCanEdit =  false;
                };

                $scope.startEidt = function () {
                    $scope.isStructureDamage = $scope.faultInfo.isStructureDamage || 'n';
                    if($scope.faultInfo.drBaseSubmitAsmsDTO){
                        $scope.workcardInfo = {cardNo:$scope.faultInfo.drBaseSubmitAsmsDTO.cardNumber};
                        $scope.workOrderInfo = {isNewFault:true,jobId:$scope.faultInfo.jobId,woNo: $scope.faultInfo.drBaseSubmitAsmsDTO.wo};
                        $scope.woList = [];
                        $scope.woNumIndx = '';
                        $scope.checkMethods = [
                            {name:'一般目视',value:"1"},
                            {name:"详细目视", value:"2"},
                            {name:"NDT",value:"3"},
                            {name:"其它",value:"4"},
                            {name:"敲击检查",value:"5"}
                        ];
                        $scope.ndtCategorys = [];
                        $scope.damageTypes= [];
                        $scope.damageReasons =[];
                        $scope.info.selectedDamageTypes=$scope.faultInfo.drBaseSubmitAsmsDTO.defectType.split(',');
                        $scope.selectNdtCategory = '';
                        var obj = {};
                        if($scope.faultInfo.parentWorkType == 'O/G' ){
                            obj = {
                                woNo:'OG-Flight',
                                type:'O/G'
                            }
                        }
                        if($scope.faultInfo.parentWorkType == 'T/R' || $scope.faultInfo.parentWorkType == 'TBFTR' ){
                            obj = {
                                woNo:'Tr-Flight',
                                type:'T/R'
                            }
                        }
                        if($scope.faultInfo.parentWorkType == 'Pr/F' ){
                            obj = {
                                woNo:'Pre-Flight',
                                type:'Pr/F'

                            }
                        }
                        if($scope.faultInfo.parentWorkType == 'Po/F' ){
                            obj = {
                                woNo:'Post-Flight',
                                type:'Po/F'

                            }
                        }
                        var data = {ac:$scope.faultInfo.acReg,drDate:new Date($scope.faultInfo.dateFound)};
                        server.maocPostReq('asms/toolInfoMobileApi/queryWoNoForTd', data, true).then(function (result) {
                            if (200 === result.status) {
                                result.data.data[0].result.unshift(obj);
                                $scope.woList = result.data.data[0].result;

                                for(var i in $scope.woList){
                                    if($scope.woList[i].woNo == $scope.faultInfo.drBaseSubmitAsmsDTO.wo){
                                        $scope.woNumIndx = i ;
                                    }
                                }
                                console.log($scope.woList,'123');
                                // $scope.woNumIndx = 0;
                                // $scope.mrInfo.drBaseSubmitAsmsDTO.maintenanceLevel = $scope.woList[$scope.woNumIndx].type||'';
                                // $scope.mrInfo.drBaseSubmitAsmsDTO.wo = $scope.woList[$scope.woNumIndx].woNo||'';
                                // $scope.workOrderInfo.woNo = $scope.woList[$scope.woNumIndx].woNo||'';
                                // $scope.workOrderInfo.jobId = $scope.jobInfo.jobId||'';
                                // $scope.workOrderInfo.isDefault = true;
                            }

                        }).catch(function (error) {
                        });

                        server.maocGetReq('asms/drBaseMobile/queryDictionaries/DamageSetting_CheckMode').then(function (res) {
                            var statusCode = res.data.statusCode;
                            if (statusCode == 200) {
                                var response = res.data.data[0];
                                $scope.ndtCategorys = response.result;
                            }
                        });

                        server.maocGetReq('asms/drBaseMobile/queryDefectTypes').then(function(res){
                            var statusCode = res.data.statusCode;
                            if (statusCode == 200) {
                                var response = res.data.data[0];
                                var result = response.result;
                                $scope.damageTypes = result;
                                // $scope.info.toolInfos.damageTypes = $filter('orderBy')(result,'value');
                            }
                        });


                    }

                    //获取已上传附件的列表
                    server.maocGetReq('defect/findVoicePictureByDefectId', {defectId: $scope.faultInfo.id}).then(function(data) {
                        if(200 === data.status) {
                            angular.forEach(data.data.data, function(item, index){
                                if(item.type == 'mp3'){
                                    $scope.uploadSoundArr.push({
                                        id: item.id,
                                        soundData: item.content,
                                        type: '.mp3',
                                        length: (item.size/1000).toFixed(1)
                                    });
                                }else{
                                    //var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                    //var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                    //var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                    //imgBlob.name = item.name.indexOf('down') == -1
                                    //            ? imgName + 'down' + imgType
                                    //            : item.name;
                                    //imgBlob.id = item.id;
                                    $scope.imgInfo.fileArr.push(item.id);
                                    $scope.imgInfo.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                }
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

                    $scope.uploadSoundArr = [];
                    $scope.imgInfo = {
                        imgArr: [],
                        fileArr: [],
                        attachvo: [],
                        delImgId: [],
                        delSoundId: []
                    };
                    $scope.editSound = [];
                    $scope.isEdit = $scope.isCanEdit = true;
                    $scope.info.dateFound = new Date($scope.faultInfo.dateFound);
                    $scope.info.ata = $scope.faultInfo.ata;
                    $scope.info.technician = {
                        nameAndId: $scope.faultInfo.technicianFoundNo,
                        approverSn: $scope.faultInfo.foundNo
                    };
                    $scope.info.engineType = $scope.faultInfo.engineType || '';
                    $scope.info.dm = $scope.faultInfo.dm;
                    $scope.info.dmStatus = $scope.faultInfo.dmStatus;

                    var sp = ($scope.faultInfo.rewiewType || '').split(',');
                    if (sp.length > 0) {
                        for (var i = 0, key; key = sp[i++];) {
                            $scope.info.reviewType[key] = true;
                        }
                    }
                    $scope.info.defectOrigin = $scope.faultInfo.defectOrigin || 'PILOT';
                    $scope.info.rii = $scope.faultInfo.rii || 'n';
                    $scope.info.faultReportChn = $scope.faultInfo.faultReportChn;
                    $scope.info.faultReportEng = $scope.faultInfo.faultReportEng;
                    getSn();
                };
                /**
                 *工作指令号变更
                 */
                $scope.woChanged = function(woNumIndx){
                    console.log(woNumIndx);
                    $scope.woNumIndx = woNumIndx;
                    $scope.faultInfo.drBaseSubmitAsmsDTO.maintenanceLevel = $scope.woList[woNumIndx].type||'';
                    $scope.faultInfo.drBaseSubmitAsmsDTO.wo = $scope.woList[woNumIndx].woNo||'';
                    $scope.workOrderInfo.woNo = $scope.woList[woNumIndx].woNo||'';
                    // $scope.workOrderInfo.jobId = $scope.jobInfo.jobId||'';
                    console.log($scope.faultInfo.drBaseSubmitAsmsDTO);

                    var typeObj = {
                        'O/G':1,
                        'T/R':1,
                        'Pr/F':1,
                        'Po/F':1,
                    };
                    if(typeObj[$scope.faultInfo.drBaseSubmitAsmsDTO.maintenanceLevel]){
                        $scope.workOrderInfo.isDefault = true;
                        // $scope.queryDefaultCard();
                    }else{
                        $scope.workOrderInfo.isDefault = false;
                        // $scope.queryCard();
                    }
                };
                /**
                 * 保存修改
                 */
                $scope.saveFault = function () {
                    var fileSoundArr = [];
                    var reviewType = [];

                    for (var key  in $scope.info.reviewType) {
                        reviewType.push(key);
                    }
                    if($scope.faultInfo.isStructureDamage == 'y'){
                        $scope.faultInfo.drBaseSubmitAsmsDTO.defectType = $scope.info.selectedDamageTypes.join(',');
                        $scope.faultInfo.drBaseSubmitAsmsDTO.cardNumber = $scope.workcardInfo.cardNo;
                        console.log($scope.faultInfo.drBaseSubmitAsmsDTO,'drBaseSubmitAsmsDTO');
                    };
                    if(!$scope.faultInfo.isStructureDamage){
                        alert('请选择结构类');
                        return;
                    }
                    // if(!$scope.woNumIndx){
                    //     alert('请选择工作指令号');
                    //     return;
                    // }
                    if($scope.faultInfo.isStructureDamage == 'y'){
                        if(!$scope.faultInfo.drBaseSubmitAsmsDTO.wo){
                            alert('请选择工作指令号');
                            return;
                        }
                        // if(!$scope.faultInfo.drBaseSubmitAsmsDTO.cardNumber){
                        //     alert('请填写或选择工卡号');
                        //     return;
                        // }
                        if(!$scope.faultInfo.drBaseSubmitAsmsDTO.defect){
                            alert('请选择外观是否可见');
                            return;
                        }
                        if(!$scope.faultInfo.drBaseSubmitAsmsDTO.checkMethod){
                            alert('请选择检查方法');
                            return;
                        }
                        if(!$scope.faultInfo.drBaseSubmitAsmsDTO.defectType){
                            alert('请选择缺陷类型');
                            return;
                        }
                    }

                    $rootScope.startLoading();
                    var damageObj ={};
                    if($scope.faultInfo.drBaseSubmitAsmsDTO){
                         damageObj = {
                            zone:$scope.faultInfo.drBaseSubmitAsmsDTO.zone || '',//区域
                            maintenanceLevel: $scope.faultInfo.drBaseSubmitAsmsDTO.maintenanceLevel ||'',//维护级别
                            wo: $scope.faultInfo.drBaseSubmitAsmsDTO.wo || '',//工作指令号
                            cardNumber: $scope.faultInfo.drBaseSubmitAsmsDTO.cardNumber || '',//相关工卡
                            checkMethod: $scope.faultInfo.drBaseSubmitAsmsDTO.checkMethod || '',//检查方法
                            checkModeOther: $scope.faultInfo.drBaseSubmitAsmsDTO.checkModeOther|| '',//检查方法其他
                            checkMode: $scope.faultInfo.drBaseSubmitAsmsDTO.checkMode|| '',//NDT类别
                            defect:  $scope.faultInfo.drBaseSubmitAsmsDTO.defect|| '',//外观是否可见
                            operator: 'SFN',//运营人(默认为SFN）
                            defectType: $scope.faultInfo.drBaseSubmitAsmsDTO.defectType|| '',
                            equipment: 4,//录入设备，1：ASMSpc端，2:ASMS移动端，3：故障pc端，4：故障移动端(默认为3）
                            defectTypeOther:$scope.faultInfo.drBaseSubmitAsmsDTO.defectTypeOther|| ''
                        }
                    }

                    var data = {
                        id: $scope.faultInfo.id,
                        acReg: $scope.faultInfo.acReg,
                        flightNo: $scope.faultInfo.flightNo,
                        preFlightNo: $scope.faultInfo.preFlightNo,
                        station: $scope.faultInfo.station,
                        dateFound: $scope.info.dateFound,
                        ata: $scope.info.ata,
                        faultReportChn: $scope.info.faultReportChn,
                        faultReportEng: $scope.info.faultReportEng,
                        defectOrigin: $scope.info.defectOrigin,
                        faultType: 'U',
                        technicianFound: $scope.info.technician.approverSn,
                        engineType: $scope.info.engineType,
                        engineSn: $scope.faultInfo.engineSn,
                        rii: $scope.info.rii,
                        jobId: $scope.faultInfo.jobId,
                        rewiewType: reviewType.join(','),
                        updater: configInfo.userCode,
                        dm: $scope.info.dm,
                        dmStatus: $scope.info.dmStatus,
                        isStructureDamage:$scope.faultInfo.isStructureDamage,
                        drBaseSubmitAsmsDTO:damageObj,

                        flightId: $scope.faultInfo.flightId,
                        preFlightId: $scope.faultInfo.preFlightId ,
                        reviewType:$scope.faultInfo.reviewType
                        // zone_id: $scope.info.zoneInfo.zone_id,
                        // zone_no :$scope.info.zoneInfo.zone_no,
                        // zone_area: $scope.info.zoneInfo.zone_area
                    };


                    var tempSound = $scope.uploadSoundArr.filter(function(item, index){
                        return typeof item.id == 'undefined';
                    })

                    var tempImg = $scope.imgInfo.fileArr.filter(function(item, index){
                        var curItem = String(item);
                        return curItem.indexOf('/') != -1 && curItem.indexOf('.') != -1;
                    })

                    data.delAttaId = ($scope.imgInfo.delImgId.concat($scope.imgInfo.delSoundId || [])).join(',');

                    if ((tempImg.length > 0 || tempSound.length > 0) ) {

                        MEAPI.formdataPost('form/submit', 'defect-002-a', data, tempSound, tempImg).then(function (data) {
                            $scope.$apply(function () {
                                if (200 === data.statusCode) {
                                    api.alert({
                                        msg: '编辑故障成功'
                                    },function(ret, err) {
                                        //$rootScope.errAlert = false;
                                        $scope.isEdit = $scope.isCanEdit = false;
                                        $scope.saveSuccess();
                                    });

                                }else{
                                    api.alert({
                                        msg: data.data.body.error_description || data.data.body
                                    });
                                }
                                $rootScope.endLoading();
                            });

                        }).catch(function (error) {
                            api.alert({
                                msg: error.body['error_description'] || error.body
                            });
                            $rootScope.endLoading();
                            $scope.$apply()
                        });
                    } else {
                        server.maocFormdataPost('form/submit', 'defect-002-a', data, []).then(function (result) {
                            if (200 === result.status) {
                                api.alert({
                                    msg: '编辑故障成功'
                                },function(ret, err) {
                                    //$rootScope.errAlert = false;
                                    $scope.isEdit = $scope.isCanEdit = false;
                                    $scope.saveSuccess();
                                });
                            }
                            $rootScope.endLoading();
                        }).catch(function (error) {
                            $rootScope.endLoading();
                        });
                    }

                };

                var snJson = {};
                $scope.getSn = getSn;

                function getSn() {
                    if ($scope.info.engineType == '') {
                        $scope.faultInfo.engineSn = '';
                        return;
                    }
                    if (snJson[$scope.info.engineType]) {
                        $scope.info.sn = snJson[$scope.info.engineType];
                    } else {
                        server.maocGetReq('comp/findSNByACAndPosition', {
                            acNo: $scope.faultInfo.acReg,
                            position: $scope.info.engineType
                        }).then(function (data) {
                            if (200 === data.status) {
                                $scope.faultInfo.engineSn = data.data.data[0];
                                snJson[$scope.info.engineType] = data.data.data[0];
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                }

                /**
                 * 删除故障
                 */
                $scope.delFault = function () {
                    $rootScope.confirmInfo = "是否确定删除该故障";
                    $rootScope.confirmShow = true;

                    $rootScope.confirmOk = function () {
                        $rootScope.startLoading();
                        server.maocPostReq('defect/deleteDefect?id=' + $scope.faultInfo.id + '&sn=' + configInfo.userCode).then(function (result) {
                            if (200 === result.status) {
                                $rootScope.errAlert = '删除故障成功';
                                $rootScope.errAlertCallBack = function () {
                                    $rootScope.errAlert = false;
                                    $scope.isEdit = false;

                                    var faultList = $scope.$parent.$parent.$parent.balanceInfo;
                                    angular.forEach(faultList, function(curFault, index){
                                        if(curFault.id == $scope.faultInfo.id){
                                            faultList.splice(index, 1);
                                        }
                                    });

                                    history.go(-1)
                                };
                            }
                            $rootScope.endLoading();
                        }).catch(function (error) {
                            $rootScope.endLoading();
                        });
                    };

                    $rootScope.confirmCancel = function () {
                        $rootScope.confirmShow = false;
                    };
                };
                /**
                 * 关闭故障
                 */
                $scope.closeFault = function (isToStr) {

                    var tip = $scope.faultInfo.dm == 'y' ? '此任务涉及双重维修限制，请确认是否已按要求执行' : '是否确定关闭该故障';
                    if(isToStr){
                        tip = '请确认是否转结构处理并关闭故障';
                        if($scope.faultInfo.drBaseSubmitAsmsDTO.nrcDtoList && $scope.faultInfo.drBaseSubmitAsmsDTO.nrcDtoList.length == 0){
                            $rootScope.errTip = "请提醒结构部门开NRC";
                            return;
                        }
                    }

                    $rootScope.confirmInfo = tip;
                    $rootScope.confirmShow = true;

                    $rootScope.confirmOk = function () {
                        $rootScope.startLoading();
                        server.maocGetReq('defect/closeDefect', {
                            defectNo: $scope.faultInfo.defectNo,
                            userNo: configInfo.userCode,
                            isStructureClose:isToStr
                        }).then(function (result) {
                            console.log('result==' + JSON.stringify(result));
                            if (200 === result.status) {
                                if(result.data.data[0] == 'yes'){
                                    alert('关闭故障成功, 故障MR涉及周转件领用，请确认已录入CC');
                                }
                                else if (result.data.data[0] == 'ok'){
                                    alert('关闭故障成功');
                                }

                                //$rootScope.errAlert = '关闭故障成功';
                                $scope.faultInfo.status = 'c';
                                $rootScope.errAlertCallBack = function () {
                                    $rootScope.errAlert = false;
                                    $scope.isEdit = false;
                                    $scope.saveSuccess();
                                };
                            }
                            $rootScope.endLoading();
                        }).catch(function (error) {
                            $rootScope.endLoading();
                        });
                    }

                    $rootScope.confirmCancel = function () {
                        $rootScope.confirmShow = false;
                    };
                }

                //DM选项卡切换
                $scope.DMType = function (event) {
                    var content = event.target.innerText.toUpperCase();
                    var dm = '';
                    if (content === 'YES') {
                        dm = 'y';
                    }
                    else if (dmType === 'NO') {
                        dm = 'n';
                    }
                    else {
                        dm = '';
                    }
                    $scope.dm = dm;
                };

                //退卡时功能取消提示
                $scope.showBackCardTip = function() {
                    alert('该故障正在退卡中，暂时不允许编辑');
                };
                //转MCC
                $scope.toMcc = function () {
                    $rootScope.confirmInfo = "是否确定转MCC";
                    $rootScope.confirmShow = true;

                    $rootScope.confirmOk = function () {
                        $rootScope.startLoading();
                        server.maocPostReq('defect/updateDefectCatoryToMcc', {defectId: $scope.faultInfo.id,operator: configInfo.userCode}).then(function (result) {
                            if (200 === result.status) {
                                $rootScope.errAlert = '转MCC成功';
                                $scope.faultInfo.isToMcc = 1;
                                $rootScope.errAlertCallBack = function () {
                                    $rootScope.errAlert = false;
                                    $scope.saveSuccess();
                                };
                            }
                            $rootScope.endLoading();
                        }).catch(function (error) {
                            $rootScope.endLoading();
                        });
                    };

                    $rootScope.confirmCancel = function () {
                        $rootScope.confirmShow = false;
                    };
                };
                //C-DD && C-PEND
                $scope.toContinue = function (category) {

                    var tip = category == 'ddi'? '是否继续保留' : '是否继续推迟';
                    $rootScope.confirmInfo = tip;
                    $rootScope.confirmShow = true;
                    $rootScope.confirmOk = function () {
                        $rootScope.startLoading();
                        if(category == 'pend'){
                            server.maocGetReq('defect/getToNrcFlag', {defectId:$scope.faultInfo.id}).then(function (data) {
                                if (200 === data.status) {
                                    var respon = data.data.data[0];
                                    if(respon == '1'){
                                        server.maocPostReq('defect/updateDefectCatory', {defectId: $scope.faultInfo.id, assignType:category}).then(function (result) {
                                            if (200 === result.status) {
                                                $rootScope.errAlert = category == 'ddi'? '继续保留成功' : '继续推迟成功';
                                                $scope.faultInfo.isToMcc = 1;
                                                $rootScope.errAlertCallBack = function () {
                                                    $rootScope.errAlert = false;
                                                    $scope.saveSuccess();
                                                };
                                            }
                                            $rootScope.endLoading();
                                        }).catch(function (error) {
                                            $rootScope.endLoading();
                                        });
                                    }
                                    if(respon == '2'){
                                        $rootScope.errTip = '请先进行WorkLog判断';
                                        $rootScope.endLoading();

                                    }
                                    if(respon == '3'){
                                        $rootScope.errTip = '该故障只能转NRC';
                                        $rootScope.endLoading();
                                    }

                                }
                            }).catch(function (error) {
                                $rootScope.endLoading();
                                console.log(error);
                            });
                        }else{
                            server.maocPostReq('defect/updateDefectCatory', {defectId: $scope.faultInfo.id, assignType:category}).then(function (result) {
                                if (200 === result.status) {
                                    $rootScope.errAlert = category == 'ddi'? '继续保留成功' : '继续推迟成功';
                                    $scope.faultInfo.isToMcc = 1;
                                    $rootScope.errAlertCallBack = function () {
                                        $rootScope.errAlert = false;
                                        $scope.saveSuccess();
                                    };
                                }
                                $rootScope.endLoading();
                            }).catch(function (error) {
                                $rootScope.endLoading();
                            });
                        }

                    };

                    $rootScope.confirmCancel = function () {
                        $rootScope.confirmShow = false;
                    };
                };
            }
        }])
    .directive('faultHandle', ['server', '$filter', '$rootScope', '$state','b64ToBlob','checkDmInfo',
        function (server, $filter, $rootScope, $state, b64ToBlob,checkDmInfo) {
            return {
                restrict: 'E',
                templateUrl: 'common/fault-handle.html',
                replace: true,
                transclude: true,
                scope: {
                    edit: '@',
                    faultHandleFile: '&',
                    handleInfo: '=',
                    faultInfo: '=',
                    toInfo: '=',
                    acModel:"=",
                    ccList: '=',
                    saveSuccess: '&'
            },
            link: link
        };

        function link($scope, ele, attr) {
            $scope.hideApproverTitle = true;
            $scope.acModel = $scope.acModel||"";
            $rootScope.z_tlbId=$scope.handleInfo.tlbId;
            $scope.isEdit = $scope.edit != 'false';

            $scope.handleInfo.apsAttachmentList && $scope.handleInfo.apsAttachmentList.length > 0
            ? $scope.showAps = true : $scope.showAps = false;

            if (typeof ($scope.handleInfo.rci) == 'undefined') {
                $scope.handleInfo.rci = 'n';
            }
            // alert(JSON.stringify($scope.handleInfo));
            $scope.imgInfo = {
                fileArr: [],
                imgArr: [],
                attachvo: []
            };
            $scope.info = {
                tecnician: {},
                inspector: {},
                tlbNo: '',
                dateFound: new Date(),
                dateAction: new Date($scope.handleInfo.dateAction),
                dlyCnl: '',
                manHours: '',
                rii: 'n',
                rci: 'n',
                // spilOil: '',
                takenActionChn: '',
                takenActionEng: '',
                faultReportChn: $scope.handleInfo.faultReportChn,
                faultReportEng: $scope.handleInfo.faultReportEng,
                ata: $scope.handleInfo.ata,
                dm: $scope.handleInfo.dm,
                dmStatus: $scope.faultInfo.dmStatus,
               zoneInfo : {
                    "zone_id": $scope.handleInfo.zone_id,
                    "zone_no" : $scope.handleInfo.zone,
                   "zone_area": "",
                   "zone_model":$scope.faultInfo.model
                }
            };
            //reiewType选中或取消
            $scope.changeReviewType = function (event) {
                var valuePos = $scope.info.reviewType.indexOf(event.target.innerText);
                if (valuePos == -1) {
                    $scope.info.reviewType.push(event.target.innerText);
                } else {
                    $scope.info.reviewType.splice(valuePos, 1);
                }
            };

            $scope.edit = true;

            $scope.isHasEwis = 'y';
            $scope.showEwis = false;
            // $scope.ewisInfo = {};
            // $scope.ewisDTO = [];
            $scope.ewisState = -1;
            $scope.selectedEwisIndex = -1;

            $scope.isHasOil = 'y';
            $scope.showOil = false;
            // $scope.oilInfo = {};
            // $scope.oilDTO = [];
            $scope.oilState = -1;//0新建 1编辑 2详情 -1无效
            $scope.selectedOilIndex = -1;//编辑或详情项目下标

            //长按CC号显示删除按钮
            var _switch = false;
            var _time = null;
            $scope.ccTouchstart = function(){
                _time = setTimeout(function(){
                    console.log("触发了长按事件");
                    _switch = true;
                    $scope.longTouched = true;
                    $scope.$apply();
                },1500);
            };
            $scope.doAlert = function(){
                alert('必互检人不能编辑');
            }
            $scope.ccTouchmove = function(){
                clearTimeout(_time);
                _switch = true;
            };

            $scope.ccTouchend = function(cc, tlbId, faultInfo){
                clearTimeout(_time);

                if(_switch){
                    _switch = false;
                    return;
                }
            };

            $scope.goAddOrDetail = function(cc, handleInfo, faultInfo, docType){
                $rootScope.go('searchFault.faultClose.newccInfo', 'slideLeft', {ccInfo: cc});

                // //触摸点击事件执行
                //     if(cc.middleStatus == "O"){
                //         $rootScope.go(
                //             'cc',
                //             'slideLeft',
                //             {
                //                 defectInfo: faultInfo,
                //                 cc: cc,
                //                 tlbId: handleInfo.tlbId,
                //                 tlbNo: handleInfo.tlbNo,
                //                 docType: 'tlb',
                //                 docNo: handleInfo.tlbNo
                //             }
                //         );
                //     }else{
                //         $rootScope.go('searchFault.faultClose.ccInfo', 'slideLeft', {ccInfo: cc});
                //     }

            }

            $scope.delCcno =function(id){
                event.preventDefault();
                event.stopPropagation();
                $rootScope.confirmInfo = "确定要删除此条CC吗";
                $rootScope.confirmShow = true;

                $rootScope.confirmOk = function () {
                    server.maocGetReq('cc/delete', {
                        id: $scope.ccId
                    }).then(function (result) {
                        if(result.data.statusInfo == 'OK'){
                            alert('删除成功!');
                            //$rootScope.go('back');
                        }
                    }).catch(function (error) {
                        alert('删除失败!')
                    });
                };
                $rootScope.confirmCancel = function () {
                    $rootScope.confirmShow = false;
                };
                return;
            }
            $scope.$watch('info.ata',function (n,o) {
                if (n && n.length == 4) {
                    var params = {
                        ata:n,
                        applyType:'APL',
                        applyId:'',
                        acReg:$scope.handleInfo.acReg,
                        model:$scope.handleInfo.model
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
            $scope.submitMethod = function () {
                // if (($scope.info.rii == 'y' || $scope.info.rci == 'y') && $scope.info.inspector.approverSn == $scope.info.tecnician.approverSn) {
                //     $rootScope.errAlert = 'Mech Sign与RII Sign不可以为同一个人';
                //     $rootScope.errAlertCallBack = function () {
                //         $rootScope.errAlert = false;
                //     };
                //     return;
                // }
                $rootScope.startLoading();
                var data = {
                    defectId: $scope.faultInfo.id,
                    tlbDTO: {
                        tlbId: $scope.handleInfo.tlbId,
                        tlbNo: $scope.info.tlbNo,
                        dateFound: $filter('formatDate')($scope.info.dateFound, 'yyyy-MM-dd hh:mm:ss'),
                        dateAction: $scope.info.dateAction.getTime(),
                        dlyCnl: $scope.info.dlyCnl,
                        rii: $scope.info.rii,
                        rci: $scope.info.rci,
                        technicianActNo: $scope.info.tecnician.approverSn,

                        technicianFound: $scope.info.finderSign.approverName ,
                        technicianFoundNo:$scope.info.finderSign.approverSn ,

                        noTlbNo: $scope.info.noTlbNo ? 1 : 0,
                        ata: $scope.info.ata,
                        // reviewType: $scope.info.reviewType.join(','),
                        reviewType: '',//用户认为正常排故流程不需要review
                        manHours: $scope.info.manHours,
                        dm: $scope.info.dm,
                        faultReportChn: $scope.info.faultReportChn,
                        faultReportEng: $scope.info.faultReportEng,
                        zone_id:$scope.info.zoneInfo.zone_id,
                    },
                    actionDTO: {
                        id: $scope.handleInfo.action.id,
                        takenActionChn: $scope.info.takenActionChn,
                        takenActionEng: $scope.info.takenActionEng,
                        manHours: $scope.info.manHours,
                        zone:$scope.info.zoneInfo.zone_no,
                        mechanicNoPhotoRemark:$scope.info.mechanicNoPhotoRemark

                    },
                    oilDTO: $scope.handleInfo.oilDTO,
                    ewisDTO: $scope.handleInfo.ewisDTO,
                    isHasOil : $scope.handleInfo.isHasOil,
                    isHasEwis: $scope.handleInfo.isHasEwis,

                };
                if($scope.imgInfo.imgArr.length < 1 && !data.actionDTO.mechanicNoPhotoRemark.trim()){
                    $rootScope.errTip = '不上传照片时，无照片备注必填';
                    $rootScope.endLoading();
                    return;
                }
                if ($scope.info.rii == 'n' && $scope.info.rci == 'n') {
                    data.tlbDTO.inspectorNo = '';
                }
                else {
                    data.tlbDTO.inspectorNo = $scope.info.inspector.approverSn
                }

                if ($scope.toInfo.length > 0 && typeof $scope.toInfo.totroubleShootings !='undefined') {
                    var to = [];
                    for (var i = 0, item; item = $scope.toInfo.totroubleShootings[i++];) {
                        to.push({
                            id: item.id,
                            actionAndFeedback: item.remark
                        })
                    }
                    data.toId = $scope.toInfo.id;
                    data.troubleShootingListDTO = to;
                }
                server.maocFormdataPost('form/submit', 'defect-005-a', data, $scope.imgInfo.fileArr).then(function (result) {
                    if (200 === result.status) {
                        alert('编辑排故措施成功!')
                        //$scope.saveSuccess();
                        $scope.handleInfo.tlbNo = data.tlbDTO.tlbNo;
                        $scope.handleInfo.dateFound = $scope.info.dateFound;
                        $scope.handleInfo.dateAction = $scope.info.dateAction;
                        $scope.handleInfo.manHours = $scope.info.manHours;
                        $scope.handleInfo.rii = $scope.info.rii;
                        $scope.handleInfo.rci = $scope.info.rci;
                        $scope.handleInfo.remark = $scope.info.remark;
                        $scope.handleInfo.reviewType = $scope.info.reviewType.join(',');

                        $scope.handleInfo.inspectorNo = $scope.info.inspector.approverSn;
                        $scope.handleInfo.inspector = $scope.info.inspector.approverName;

                        $scope.handleInfo.technicianActSignNo = $scope.info.tecnician.approverSn;
                        $scope.handleInfo.technicianActSign = $scope.info.tecnician.approverName;

                        $scope.handleInfo.technicianFound = $scope.info.finderSign.approverName ,
                        $scope.handleInfo.technicianFoundNo = $scope.info.finderSign.approverSn ,

                        $scope.handleInfo.faultReportChn = $scope.info.faultReportChn;
                        $scope.handleInfo.faultReportEng = $scope.info.faultReportEng;
                        $scope.handleInfo.zone_id = $scope.info.zoneInfo.zone_id;
                        $scope.handleInfo.action.takenActionChn = $scope.info.takenActionChn;
                        $scope.handleInfo.action.takenActionEng = $scope.info.takenActionEng;
                        $scope.handleInfo.action.mechanicNoPhotoRemark = $scope.info.mechanicNoPhotoRemark;
                        $scope.isEdit = $scope.$parent.$parent.$parent.isCanEdit = false; //isCanEdit是否要下拉刷新 true(即编辑状态)時不刷新
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };

            function getFileIdentifier() {
                //获取已上传附件的列表
                server.maocGetReq('defect/findPictureByActionId', {actionId: $scope.handleInfo.actionId}).then(function(data) {
                    if(200 === data.status) {

                        if (data.data.data.length > 0) {
                            $scope.showFileIdentifer = true;
                        } else {
                            $scope.showFileIdentifer = false;
                        }

                        angular.forEach(data.data.data, function(item, index){
                            var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                            var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                            var imgType = item.name.substring(item.name.lastIndexOf('.'));
                            imgBlob.name = item.name.indexOf('down') == -1
                                ? imgName + 'down' + imgType
                                : item.name;
                            $scope.imgInfo.fileArr.push(imgBlob);
                            $scope.imgInfo.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                            // }
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

            getFileIdentifier();

            $scope.cancelEdit = function () {
                $scope.isEdit = $scope.$parent.$parent.$parent.isCanEdit = false;
                if (!$scope.isEdit) {
                    $scope.oilState = 2;
                    $scope.ewisState = 2;
                }
            };
            $scope.deleteHandle = function(id){
                $rootScope.confirmInfo = "确定删除此条排故措施？";
                $rootScope.confirmShow = true;

                $rootScope.confirmOk = function () {
                    server.maocGetReq('defect/deleteProcessById',{id:id}).then(function (data) {
                        if(data.data.statusCode === 200){
                            $scope.saveSuccess();
                        }
                    }).catch(function (err) {
                        console.info(err)
                    })
                };
                $rootScope.confirmCancel = function () {
                    $rootScope.confirmShow = false;
                };


            };
            $scope.changeEdit = function () {
                $scope.imgInfo = {
                    fileArr: [],
                    imgArr: [],
                    attachvo: []
                };
                $scope.isEdit = $scope.$parent.$parent.$parent.isCanEdit = true;
                if ($scope.isEdit) {
                    $scope.oilState = 1;
                    $scope.ewisState = 1;
                }
                $scope.info.tlbNo = $scope.handleInfo.tlbNo;
                $scope.info.dateFound = new Date($scope.handleInfo.dateFound);
                $scope.info.dlyCnl = $scope.handleInfo.dlyCnl || 'y';
                $scope.info.manHours = $scope.handleInfo.manHours;
                $scope.info.rii = $scope.handleInfo.rii || 'n';
                $scope.info.rci = $scope.handleInfo.rci || 'n';
                $scope.handleInfo.inspectorNo && ($scope.info.inspector = {
                    approverSn: $scope.handleInfo.inspectorNo || '',
                    approverName: $scope.handleInfo.inspector || '',
                    nameAndId: (($scope.handleInfo.inspector || '') + ' ' + ($scope.handleInfo.inspectorNo || ''))
                });
                $scope.handleInfo.technicianActNo && ($scope.info.tecnician = {
                    approverSn: $scope.handleInfo.technicianActNo || '',
                    approverName: $scope.handleInfo.technicianActSign || '',
                    nameAndId: (($scope.handleInfo.technicianActSign || '') + ' ' + ($scope.handleInfo.technicianActNo || ''))
                });
                $scope.handleInfo.technicianFoundNo && ($scope.info.finderSign = {
                    approverSn: $scope.handleInfo.technicianFoundNo || '',
                    approverName: $scope.handleInfo.technicianFound || '',
                    nameAndId: (($scope.handleInfo.technicianFound || '') + ' ' + ($scope.handleInfo.technicianFoundNo || ''))
                });
                $scope.info.remark = $scope.handleInfo.remark || '';

                $scope.info.noTlbNo = $scope.handleInfo.noTlbNo == '1' ? true : false;
                $scope.info.reviewType = typeof $scope.handleInfo.reviewType !='undefined' && $scope.handleInfo.reviewType
                                        ?  $scope.handleInfo.reviewType.split(',') : [];
                $scope.info.takenActionChn = $scope.handleInfo.action.takenActionChn || '';
                $scope.info.takenActionEng = $scope.handleInfo.action.takenActionEng || '';
                $scope.info.mechanicNoPhotoRemark = $scope.handleInfo.action.mechanicNoPhotoRemark || '';

                //获取已上传附件的列表
                server.maocGetReq('defect/findPictureByActionId', {actionId: $scope.handleInfo.actionId}).then(function(data) {
                    if(200 === data.status) {
                        angular.forEach(data.data.data, function(item, index){
                            //if(item.type == 'mp3'){ //目前没有语音,
                            //    $scope.uploadSoundArr.push({
                            //        soundData: item.content,
                            //        type: '.mp3',
                            //        length: (item.size/1000).toFixed(1)
                            //    });
                            //}else{
                            var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                            var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                            var imgType = item.name.substring(item.name.lastIndexOf('.'));
                            imgBlob.name = item.name.indexOf('down') == -1
                                ? imgName + 'down' + imgType
                                : item.name;
                            $scope.imgInfo.fileArr.push(imgBlob);
                            $scope.imgInfo.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                            // }
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
        }
    }])
    .directive('faultMr', ['server', '$filter', '$rootScope', '$state', function (server, $filter, $rootScope, $state) {
        return {
            restrict: 'E',
            templateUrl: 'common/fault-mr.html',
            replace: true,
            transclude: true,
            scope: {
                mrInfo: '=',
                faultInfo: '=',
                changeEdit: '&'
            },
            link: link
        };
        function link($scope) {
            $scope.mrApprove=function (obj) {
                $rootScope.startLoading();
                var data = {
                    id: obj.no,
                }

                server.maocFormdataPost('form/submit', 'mr-001-b', data, null).then(function (data) {
                    if (200 === data.status) {
                        alert("提交成功");
                    }
                    if(201 === data.status){
                        alert("请勿重复提交！");
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            }
        }
    }])

    .directive('faultPadding', ['server', '$filter', '$rootScope', '$state','b64ToBlob',
            function (server, $filter, $rootScope, $state, b64ToBlob) {
        return {
            restrict: 'E',
            templateUrl: 'common/fault-padding.html',
            replace: true,
            transclude: true,
            scope: {
                paddingInfo: '=',
                faultInfo: '='
            },
            link: link
        };

        function link($scope) {
            $rootScope.z_tlbId=$scope.paddingInfo.tlbId;
            $scope.Reported_By=function(obj){
                if($scope.faultInfo.btnFlag.isCanEditReasons){
                    if(obj=="lackMater"){
                        if($scope.paddingInfo.lackMater=="y"){
                            $scope.paddingInfo.lackMater="n"
                        }else {
                            $scope.paddingInfo.lackMater="y"
                        }
                    }
                    if(obj=="lackTime"){
                        if($scope.paddingInfo.lackTime=="y"){
                            $scope.paddingInfo.lackTime="n"
                        }else {
                            $scope.paddingInfo.lackTime="y"
                        }
                    }
                    if(obj=="lackTool"){
                        if($scope.paddingInfo.lackTool=="y"){
                            $scope.paddingInfo.lackTool="n"
                        }else {
                            $scope.paddingInfo.lackTool="y"
                        }
                    }
                    if(obj=="lackTech"){
                        if($scope.paddingInfo.lackTech=="y"){
                            $scope.paddingInfo.lackTech="n"
                        }else {
                            $scope.paddingInfo.lackTech="y"
                        }
                    }
                }
                }

                $scope.isCanEditReasons=function(){
                $scope.is_data={
                    lackMater:$scope.paddingInfo.lackMater,
                    lackTime:$scope.paddingInfo.lackTime,
                    lackTool:$scope.paddingInfo.lackTool,
                    lackTech:$scope.paddingInfo.lackTech,
                    id:$scope.paddingInfo.id,
                }
                if($scope.is_data.lackMater=="n" && $scope.is_data.lackTime=="n" && $scope.is_data.lackTool=="n" && $scope.is_data.lackTech=="n" ){
                    alert("请选择一项Reported By");
                    return;
                }

                        server.maocPostReq('Pend/updateReasons', $scope.is_data, true).then(function (data) {
                        if (200 === data.status) {
                            alert("修改成功");
                            $scope.getFaultInfo();
                        }

                    }).catch(function (error) {

                    });
                }

            // $scope.ewisDTO = [{
            //     "componentTypeId":5005000,
            //     "componentTypeName":"5005000",
            //     "allNumber":"5005000",
            //     "ewisType":"5005000",
            //     "otherDescription":"5005000",
            //     "staWlBl":"5005000"
            // }
            //     ,{
            //         "componentTypeId":5005000,
            //         "componentTypeName":"5005000",
            //         "allNumber":"5005000",
            //         "ewisType":"5005000",
            //         "otherDescription":"5005000",
            //         "staWlBl":"5005000"
            //     }];
            //
            // $scope.oilDTO = [
            //     {
            //         "id":5005000,
            //         "oilType":5005000,
            //         "oilLeakPosition":"5005000",
            //         "oilComponent":"5005000",
            //         "otherDescription ":"5005000",
            //         "oilRecord":"5005000",
            //     },
            //     {
            //         "id":5005000,
            //         "oilType":5005000,
            //         "oilLeakPosition":"5005000",
            //         "oilComponent":"5005000",
            //         "otherDescription ":"5005000",
            //         "oilRecord":"5005000",
            //     }
            // ];
            $scope.edit = false;

            // $scope.isHasEwis = 'y';
            $scope.showEwis = false;
            // $scope.ewisInfo = {};
            // $scope.ewisDTO = [];
            $scope.ewisState = -1;
            $scope.selectedEwisIndex = -1;

            // $scope.isHasOil = 'y';
            $scope.showOil = false;
            // $scope.oilInfo = {};
            // $scope.oilDTO = [];
            $scope.oilState = -1;//0新建 1编辑 2详情 -1无效
            $scope.selectedOilIndex = -1;//编辑或详情项目下标


            if ($scope.paddingInfo.expiredDate && $scope.faultInfo.status.toUpperCase() === 'O') {
                var d = new Date($scope.paddingInfo.expiredDate);
                var n = new Date();
                n.setDate(n.getDate() + 3);
                if (d.getTime() <= n.getTime()) {
                    $scope.styleCss = {color: 'red'};
                }
            }
            $scope.paddingInfo.totalFh = parseInt($scope.paddingInfo.totalFh/60) + "小时" + $scope.paddingInfo.totalFh%60 + "分"; 
        }
            }])
    .directive('faultDdi',['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'common/fault-ddi.html',
            replace: true,
            transclude: true,
            scope: {
                paddingInfo: '=',
                faultInfo: '='
            },
            link: link
        };

        function link($scope) {

            // $scope.ewisDTO = [{
            //     "componentTypeId":5005000,
            //     "componentTypeName":"5005000",
            //     "allNumber":"5005000",
            //     "ewisType":"5005000",
            //     "otherDescription":"5005000",
            //     "staWlBl":"5005000"
            // }
            //     ,{
            //         "componentTypeId":5005000,
            //         "componentTypeName":"5005000",
            //         "allNumber":"5005000",
            //         "ewisType":"5005000",
            //         "otherDescription":"5005000",
            //         "staWlBl":"5005000"
            //     }];
            //
            // $scope.oilDTO = [
            //     {
            //         "id":5005000,
            //         "oilType":5005000,
            //         "oilLeakPosition":"5005000",
            //         "oilComponent":"5005000",
            //         "otherDescription ":"5005000",
            //         "oilRecord":"5005000",
            //     },
            //     {
            //         "id":5005000,
            //         "oilType":5005000,
            //         "oilLeakPosition":"5005000",
            //         "oilComponent":"5005000",
            //         "otherDescription ":"5005000",
            //         "oilRecord":"5005000",
            //     }
            // ];
            // $scope.isHasEwis = 'n';
            // $scope.isHasOil = 'n';

            $scope.edit = false;

            // $scope.isHasEwis = 'y';
            $scope.showEwis = false;
            // $scope.ewisInfo = {};
            // $scope.ewisDTO = [];
            $scope.ewisState = -1;
            $scope.selectedEwisIndex = -1;

            // $scope.isHasOil = 'y';
            $scope.showOil = false;
            // $scope.oilInfo = {};
            // $scope.oilDTO = [];
            $scope.oilState = -1;//0新建 1编辑 2详情 -1无效
            $scope.selectedOilIndex = -1;//编辑或详情项目下标




            if ($scope.paddingInfo.expiredDate && $scope.faultInfo.status.toUpperCase() === 'O') {
                var d = new Date($scope.paddingInfo.expiredDate);
                var n = new Date();
                n.setDate(n.getDate() + 3);
                if (d.getTime() <= n.getTime()) {
                    $scope.styleCss = {color: 'red'};
                }
            }

            $scope.paddingInfo.totalFh = parseInt($scope.paddingInfo.totalFh/60) + "小时" + $scope.paddingInfo.totalFh%60 + "分"; 

            $scope.closeDDI = function(ddiId){
                $rootScope.confirmInfo = "确定关闭DDI撤保留";
                $rootScope.confirmShow = true;

                $rootScope.confirmOk = function () {
                    $rootScope.startLoading();

                    server.maocGetReq('Pend/closeDdi?pendId=' + ddiId).then(function (result) {
                        if (result.status == 200) {
                            $scope.paddingInfo.status = 2;
                            alert('关闭成功');
                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                };

                $rootScope.confirmCancel = function () {
                    $rootScope.confirmShow = false;
                };

            }
        }
    }])
    .directive('faultTo', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'common/fault-to.html',
            replace: true,
            transclude: true,
            scope: {
                toInfo: '=',
                faultInfo: '='
            },
            link: link
        };

        function link($scope, ele, attr) {
            $scope.tagIndex = 0;
            $scope.changeTag = function (idx) {
                $scope.tagIndex = idx;
            }
            var copyActionAndFeedBack = angular.copy($scope.toInfo.totroubleShootings);

            $scope.submitData = function(feedbackInfo){
                $rootScope.startLoading();
                var param = [];
                if(feedbackInfo.length){
                    angular.forEach(feedbackInfo, function(item, index){
                        if(item.actionAndFeedback != copyActionAndFeedBack[index].actionAndFeedback){
                            param.push({
                                id: item.id,
                                actionAndFeedback: item.actionAndFeedback
                            });
                        }
                    })
                }

                server.maocPostReq('mccTo/updateFeedback', param, true).then(function (result) {
                    if (200 === result.status) {
                        copyActionAndFeedBack = angular.copy($scope.toInfo.totroubleShootings);
                        $rootScope.errAlert = '编辑成功';
                        $rootScope.errAlertCallBack = function () {
                            $rootScope.errAlert = false;
                        };
                        $scope.editFeedback = $scope.$parent.$parent.$parent.isCanEdit = false;
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });

            }

            $scope.fnEditFeedback = function(){
                $scope.editFeedback = $scope.$parent.$parent.$parent.isCanEdit = true;
            }

            $scope.cancelEditFeedback = function(){ //取消编辑,恢复初始值
                $scope.editFeedback = $scope.$parent.$parent.$parent.isCanEdit = false;
                $scope.toInfo.totroubleShootings = copyActionAndFeedBack;
                copyActionAndFeedBack = angular.copy($scope.toInfo.totroubleShootings);
            }

            //获得焦点时,获取初始值
            //$scope.getInitFeedback = function(feedback){
            //    $scope.initFeedBack = feedback;
            //}

        }


    }])
    .directive('faultCc', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/fault-cc.html',
            replace: true,
            transclude: true,
            scope: {
                ccInfo: '=',
                faultInfo: '=',
                ccFile: '&'
            }
        }
    });
