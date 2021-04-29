
module.exports = angular.module('myApp').controller('jcprocessController',
    ['$rootScope', '$scope', '$filter', '$stateParams', 'server','$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter, $stateParams,server,$interval, $localForage, configInfo, b64ToBlob, $timeout) {
            $rootScope.loading = false;
            $scope.isCreateData=false;
            $scope.isRci_isRii="";
            $rootScope.searchTlbFrom = 'status';
            $scope.uploadSoundArr = [];
            $scope.isApiCloud = false; //上传附件时是否要用apiCloud方法
            $scope.imgArr = [];  //页面预览所用文件
            $scope.apsimgArr = [];  //页面预览所用文件
            $scope.dateFound = new Date();

            $scope.taskupWay = 'feedback';
            $scope.apsWay = 'apsFeedback';
            $scope.fileList = [];
            $scope.apsfileList = [];
            $scope.nrcId = $stateParams.itemId;

            nrcdata_info($stateParams.itemId);
            $scope.gobackToRoot = function () {
                $rootScope.go('back', 'slideLeft', {});
            };
            $scope.nrcinfo=$stateParams.nrcInfo;
            $scope.subimt_nrc=function (nrc) {
                if($scope.checkPhone && !(/^1[3-9]\d{9}$/.test($scope.mrInfo.phone))){
                    alert("请输入合法手机号码！");
                    return

                }
                if($scope.checkPhone && !$scope.mrInfo.phone){
                    alert("电话号码不能为空！");
                    return
                }

                if (!$scope.mrInfo.hours) {
                    alert("人工时不能为空！");
                    return
                }
                if (!$scope.mrInfo.approverName || !$scope.mrInfo.approverSn) {
                    alert("工作者和工号不能为空！");
                    return
                }
                if($scope.isRci_isRii==1){
                    $scope.mrInfo.isRci=0;
                    $scope.mrInfo.isRii=1;
                }else if($scope.isRci_isRii==2){
                    $scope.mrInfo.isRci=1;
                    $scope.mrInfo.isRii=0;
                }
                if($scope.isRci_isRii!=""){
                    if(!$scope.inspector.approverName){
                        alert("检验员不能为空！");
                        return
                    }
                }

                if($scope.isPcyyNotEmpty&&(!$scope.mrInfo.pcyy||$scope.mrInfo.pcyy=="")){
                    alert("工时偏差原因不能为空");
                    return
                }
                // if($scope.mrInfo.approverSn == $scope.inspector.approverSn){
                //     $rootScope.errTip = '工作者和必互检人不能一致';
                //     return;
                // }
                var checkPho = $scope.mrInfo.mechanicNoPhotoRemark||''
                if($scope.mrInfo.isRequiredFeedback &&  $scope.imgArr.length < 1){
                    $rootScope.errTip = '此任务反馈附件必填';
                    return;
                }
                if($scope.mrInfo.isRequiredFeedback && $scope.apsimgArr.length < 1 && !checkPho.trim()){
                    $rootScope.errTip = '不上传aps照片时，无照片备注必填';
                    return;
                }
                if(!$scope.mrInfo.isRequiredFeedback && $scope.imgArr.length < 1 && !checkPho.trim()){
                    $rootScope.errTip = '不上传照片时，无照片备注必填';
                    return;
                }

                $scope.mrInfoto = {
                    acReg: $scope.mrInfo.acReg,
                    // jobDate: $filter('date')($scope.dateFound, "yyyy/MM/dd HH:mm:ss"),
                    flightNo: $scope.mrInfo.flightNo,
                    station: $scope.mrInfo.station,
                    isRci:$scope.mrInfo.isRci,
                    isRii:$scope.mrInfo.isRii,
                    required:$scope.mrInfo.required,
                    mechanicName:$scope.mrInfo.approverName,
                    mechanicSn:$scope.mrInfo.approverSn,
                    type:$scope.mrInfo.type,
                    rectChn:$scope.mrInfo.rectChn,
                    rectEn:$scope.mrInfo.rectEn,
                    feedbackCh:$scope.mrInfo.feedbackCh,
                    acId:$scope.mrInfo.acId,
                    workType:$scope.mrInfo.workType,
                    flightId:$scope.mrInfo.flightId,
                    flightDate:$scope.mrInfo.flightDate,
                    cardId:$scope.mrInfo.cardId,
                    cardNumber:$scope.mrInfo.cardNumber,
                    completeDate:parseInt($scope.mrInfo.completeDate.getTime()),
                    hours:$scope.mrInfo.hours,
                    pcyy:$scope.mrInfo.pcyy,
                    id:$stateParams.itemId,
                    inspector:$scope.inspector.approverName,
                    inspectorNo:$scope.inspector.approverSn,
                    attachmentList:$scope.fileList,
                    apsFeedbackAttachmentList:$scope.apsfileList,
                    canEditRiiRci:$scope.mrInfo.canEditRiiRci,
                    mechanicNoPhotoRemark:$scope.mrInfo.mechanicNoPhotoRemark



                };
                $scope.checkPhone && ($scope.mrInfoto.phone = $scope.mrInfo.phone .toString());
                $scope.checkLife && ($scope.mrInfoto.hasLiferaft = $scope.mrInfo.hasLiferaft);
                $scope.mrInfoto.attachmentList && $scope.mrInfoto.attachmentList.forEach(function (item , i) {
                    item.content && delete item.content
                })
                $scope.mrInfoto.apsFeedbackAttachmentList && $scope.mrInfoto.apsFeedbackAttachmentList.forEach(function (item , i) {
                    item.content && delete item.content
                })
                if($scope.cc_data.jcFeedbackDetailDTOList.length>0){
                    if($scope.pkid==""){
                        alert("请选择间隔！");
                        return;
                    }
                }

                for(i in $scope.cc_data.jcFeedbackDetailDTOList){
                    if($scope.cc_data.jcFeedbackDetailDTOList[i].pkid==$scope.pkid){
                        $scope.cc_data.jcFeedbackDetailDTOList[i].check="y";
                        if(!$scope.cc_data.jcFeedbackDetailDTOList[i].kbbhValue){
                            alert("所选可变间隔说明不能为空！");
                            return
                        }
                    }
                }
                $scope.mrInfoto.jcFeedbackDetailDTOList= $scope.cc_data.jcFeedbackDetailDTOList;
                var params = angular.copy($scope.mrInfoto);
                // console.log(JSON.stringify(params));
                if(nrc==1){
                    params.cache=true;
                    server.maocFormdataPost('form/submit', 'tbm-007-c', params).then(function (data) {
                        if(data.data.statusCode==200){
                            alert("保存成功！");
                        }
                    }).catch(function (error) {

                    });
                }else {
                    params.cache=false;
                    //$scope.disabledSaveButton = true;
                    server.maocFormdataPost('form/submit', 'tbm-007-c', params).then(function (data) {
                        if(data.data.statusCode==200){
                            alert("关闭成功！");
                            $rootScope.go('back', 'slideLeft', {});
                        }
                    }).catch(function (error) {
                        $scope.disabledSaveButton = false;
                    });
                }

            }
            $scope.checkError = function (isError, checkWord) {
                if (isError) {
                    $scope.mrInfo.hours="";
                    alert("人工时只能输入数字或者一位小数！");
                    return;
                }
                if($scope.mrInfo.hours==0){
                    $scope.mrInfo.hours="";
                    alert("人工时不能输入0！");
                    return;
                }

                var workTimeDeviation = $scope.workTimeDeviation;
                var hours = $scope.mrInfo.hours;
                var planeHours = $scope.planeHours;
                if(!!workTimeDeviation&&!!workTimeDeviation.pcfw&&!!planeHours&&!!parseFloat(planeHours)
                  &&Math.abs(hours-planeHours).toFixed(2)>planeHours*workTimeDeviation.pcfw*0.01){
                    $scope.isPcyyNotEmpty = true;
                }else{
                    $scope.isPcyyNotEmpty = false;
                    $scope.mrInfo.pcyy="";
                }
            };

            function nrcdata_info(id) {
                server.maocGetReq('TBM/getJCFeedbackTask/'+id).then(function(data) {
                    // console.log(JSON.stringify(data));
                    $scope.cc_data=data.data.data[0];
                    var datainfo=data.data.data[0];
                    $scope.mrInfo = {
                        completeDate: new Date($filter('date')(datainfo.completeDate, 'yyyy/MM/dd HH:mm')),
                        acReg: datainfo.acReg,
                        // jobDate: $filter('date')($scope.dateFound, "yyyy/MM/dd HH:mm:ss"),
                        flightNo: datainfo.flightNo,
                        station: datainfo.station,
                        isRci:datainfo.isRci,
                        isRii:datainfo.isRii,
                        required:datainfo.required,
                        approverName:datainfo.mechanicName|| "",
                        approverSn:datainfo.mechanicSn|| "",
                        type:datainfo.type,
                        rectChn:datainfo.rectChn,
                        rectEn:datainfo.rectEn,
                        feedbackCh:datainfo.feedbackCh,
                        acId:datainfo.acId,
                        workType:datainfo.workType,
                        flightId:datainfo.flightId,
                        flightDate:datainfo.flightDate,
                        cardId:datainfo.cardId,
                        cardNumber:datainfo.cardNumber,
                        description:datainfo.description,
                        hours:datainfo.hours == 0 ?  '' :datainfo.hours,
                        pcyy:datainfo.pcyy,
                        model :datainfo.model,
                        canEditRiiRci:datainfo.canEditRiiRci,
                        isRequiredFeedback:datainfo.isRequiredFeedback,

                        phone:datainfo.phone - 0,
                        hasLiferaft:datainfo.hasLiferaft,
                        mechanicNoPhotoRemark:datainfo.mechanicNoPhotoRemark,

                    };
                    $scope.inspector = {
                        approverName:datainfo.inspector|| "",
                        approverSn:datainfo.inspectorNo|| "",
                    }
                    if($scope.mrInfo.approverName!=""){
                        $scope.mrInfo.nameAndId=datainfo.mechanicName +" "+datainfo.mechanicSn;
                    }
                    if($scope.inspector.approverName!=""){
                        $scope.inspector.nameAndId=datainfo.inspector +" "+datainfo.inspectorNo;
                    }

                    if($scope.mrInfo.approverName == "") {
                        var params = {
                            deptName: '',//'机务',
                            param: configInfo.userCode
                        };
                        server.maocGetReq('defect/findBySnOrNameOrEnName', params).then(function (data) {
                            // console.info(123)
                            if (200 === data.status) {
                                $scope.workInfoList = data.data.data || [];

                                if (!$scope.mrInfo.nameAndId) {
                                    //工号搜索时可能存在多个结果
                                    angular.forEach($scope.workInfoList, function (item, i) {
                                        if (item.sn == configInfo.userCode) {
                                            $scope.mrInfo.nameAndId = item.name + ' ' + item.sn;
                                            $scope.mrInfo.approverName = item.name;
                                            $scope.mrInfo.approverSn = item.sn;
                                        }
                                    });

                                }
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                        // if(datainfo.isRci!=0){
                    //     $scope.isCreateData=true;
                    //     $scope.isRci_isRii=2;
                    // }
                    // if(datainfo.isRii!=0){
                    //     $scope.isCreateData=true;
                    //     $scope.isRci_isRii=1;
                    // }
                    if(datainfo.isRci == 1 && datainfo.isRii == 1){
                        $scope.isCreateData=true;
                        $scope.isRci_isRii = 1;
                    }
                    if(datainfo.isRii == 1 && datainfo.isRci == 0){
                        $scope.isCreateData=true;
                        $scope.isRci_isRii = 1;
                    }
                    if(datainfo.isRci == 1 && datainfo.isRii == 0){
                        $scope.isCreateData=true;
                        $scope.isRci_isRii = 2;
                    }
                    if(datainfo.isRci == 0 && datainfo.isRii == 0){
                        $scope.isCreateData=true;
                        $scope.isRci_isRii = 2;
                    }
                    if(!datainfo.isRii && !datainfo.isRii){
                        $scope.isRci_isRii=2;
                    }
                    console.info($scope.isRci_isRci)
                    if(!!datainfo.pcyy){
                        $scope.isPcyyNotEmpty = true;
                    }
                    $scope.sapWorkType = datainfo.sapWorkType;
                    $scope.planeHours = datainfo.planeHours;
                    getWorkTimeDeviation($scope.sapWorkType);
                    for(i in $scope.cc_data.jcFeedbackDetailDTOList){
                        if($scope.cc_data.jcFeedbackDetailDTOList[i].check=="y"){
                            $scope.pkid=$scope.cc_data.jcFeedbackDetailDTOList[i].pkid;
                        }
                    }

                    server.maocGetReq('pmMcJobcard/checkTypeByCardNumberAndCardType/',{jobcardNo:datainfo.cardNumber,jobcardTypes:[14]}).then(function(data) {
                        if(data.data.statusCode==200){
                            $scope.checkPhone = data.data.data[0];
                        }
                    });
                    if($scope.mrInfo.type == 'O/G'){
                        server.maocGetReq('pmMcJobcard/checkTypeByCardNumberAndCardType/',{jobcardNo:datainfo.cardNumber,jobcardTypes:[0,1]}).then(function(data) {
                            if(data.data.statusCode==200){
                                $scope.checkLife = data.data.data[0];
                            }
                        });
                    }


                    //图片附件
                    $scope.fileList = datainfo.attachmentList;
                    $scope.apsfileList = datainfo.apsFeedbackAttachmentList;
                    //获取已上传附件的列表
                    angular.forEach(datainfo.attachmentList, function (item, index) {
                        var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                        var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                        var imgType = item.name.substring(item.name.lastIndexOf('.'));
                        imgBlob.name = item.name.indexOf('down') == -1
                            ? imgName + 'down' + imgType
                            : item.name;
                        $scope.fileArr.push(imgBlob);
                        $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));

                    })
                    angular.forEach(datainfo.apsFeedbackAttachmentList, function (item, index) {
                        if(item.type.indexOf('image') != '-1'){
                            var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                            var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                            var imgType = item.name.substring(item.name.lastIndexOf('.'));
                            imgBlob.name = item.name.indexOf('down') == -1
                                ? imgName + 'down' + imgType
                                : item.name;
                            $scope.apsfileArr.push(imgBlob);
                            $scope.apsimgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                        }
                    })
                })
            }

            function getWorkTimeDeviation(sapWorkType) {
                var pctp = "";
                if(sapWorkType=="EOJC"||sapWorkType=="EAJC"){
                    pctp = "EO";
                }else if(sapWorkType=="MPJC"||sapWorkType=="NSJC"){
                    pctp = "JC";
                }else{
                  console.log("类型不为JC:"+sapWorkType);
                  return;
                }
                server.maocGetReq('TBM/getByPctp/'+pctp).then(function (data) {
                  if(!!data.data.data){
                    $scope.workTimeDeviation=data.data.data[0];
                  }
                }).catch(function (error) {
                    console.log("调用TBM/getByPctp/接口失败"+error);
                });
            }

            $scope.addcc=function () {
                if($scope.cc_data.type=="Pr/F" ||$scope.cc_data.type=="T/R" ||$scope.cc_data.type=="O/G"  ){
                    $rootScope.go('tlbDetail',"slideLeft",{zoneInfo: {model:$scope.mrInfo.model,type:$scope.cc_data.type,itemId:$stateParams.itemId,acReg: $scope.cc_data.acReg,minorModel:$scope.cc_data.modelSeries,dmStatus:$stateParams.nrcInfo.dmStatus,flightNo:$scope.cc_data.preFlightNo,flightId:$scope.cc_data.preFlightId,staFound:$scope.cc_data.station,staAction:$scope.cc_data.station,lineJobId:$scope.cc_data.parentId}});
                }else {
                    $rootScope.go('tlbDetail',"slideLeft",{zoneInfo: {model:$scope.mrInfo.model,type:$scope.cc_data.type,itemId:$stateParams.itemId,acReg: $scope.cc_data.acReg,minorModel:$scope.cc_data.modelSeries,dmStatus:$stateParams.nrcInfo.dmStatus,flightNo:$scope.cc_data.flightNo,flightId:$scope.cc_data.flightId,staFound:$scope.cc_data.station,staAction:$scope.cc_data.station,lineJobId:$scope.cc_data.parentId}});
                }
               }
            $scope.goAddOrDetail=function(cc){
                $rootScope.go('tlbDetail', 'slideLeft', {tlbId: cc.tlbId});
                // console.log("dasdasd")
            }
            $scope.pkid="";
            $scope.xuanzhong=function(id,index){
                for(i in $scope.cc_data.jcFeedbackDetailDTOList){
                    $scope.cc_data.jcFeedbackDetailDTOList[i].check="n";
                    if($scope.cc_data.jcFeedbackDetailDTOList[i].pkid==id){
                        $scope.cc_data.jcFeedbackDetailDTOList[i].check="y";
                    }
                   if($scope.cc_data.jcFeedbackDetailDTOList[i].check=="n"){
                       $scope.cc_data.jcFeedbackDetailDTOList[i].kbbhValue="";
                   }
                }
                $scope.pkid=id;
            }


            //删除CC
            $scope.cc_delete = function (id) {
                event.preventDefault();
                event.stopPropagation();
                $rootScope.confirmInfo = "确定要删除此条TLB吗";
                $rootScope.confirmShow = true;

                $rootScope.confirmOk = function () {
                    server.maocPostReq('TLB/deleteTLB  ', {
                        id: id
                    }).then(function (result) {
                        if (result.data.statusInfo == 'OK') {
                            alert('删除成功!');
                            nrcdata_info($stateParams.itemId);
                        }
                    }).catch(function (error) {
                        alert("删除失败："+error);
                    });
                };
            }

        }
    ]);
