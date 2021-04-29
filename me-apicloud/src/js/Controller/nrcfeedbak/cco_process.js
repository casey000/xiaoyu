
module.exports = angular.module('myApp').controller('ccoprocessController',
    ['$rootScope', '$scope', '$filter', '$stateParams', 'server','$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter, $stateParams,server,$interval, $localForage, configInfo, b64ToBlob, $timeout) {
            $rootScope.endLoading();
            $rootScope.loading = false;
            // $scope.isCreateData=false;
            // $scope.isRci_isRii="";
            $rootScope.searchTlbFrom = 'status';
            $scope.uploadSoundArr = [];
            $scope.isApiCloud = false; //上传附件时是否要用apiCloud方法
            $scope.imgArr = [];  //页面预览所用文件
            $scope.dateFound = new Date();
            $scope.rciName = "";
            $scope.rciNumber = "";
            $scope.isRci_isRii="";
            $scope.sapTaskId = $stateParams.sapTaskId||"";
            console.log("父页面带来的数据"+JSON.stringify($stateParams));
            nrcdata_info($stateParams.itemId);
            $scope.gobackToRoot = function () {
                $rootScope.go('back', 'slideLeft', {});
            };
            $scope.nrcinfo=$stateParams.nrcInfo;
//保存或关闭按钮功能
            $scope.subimt_nrc=function (nrc) {
                if (!$scope.ccoinfo.hours) {
                    alert("人工时只能输入数字或者一位小数！");
                    return
                }
                var checkPho = $scope.ccoinfo.mechanicNoPhotoRemark||''

                if($scope.imgArr.length < 1 && !checkPho.trim()){
                    $rootScope.errTip = '不上传照片时，无照片备注必填';
                    return;
                }
                //当存在RII和RCI标识的时候该输入不能为空
                if ((!$scope.ccoinfo.nameAndId)&&(!!$scope.ccoinfo.isRii || !!$scope.ccoinfo.isRci)) {
                    alert("RCI/RII签名不能为空！");
                    return
                }
                //关卡人不能为空
                if (!$scope.ccoSaveInfo.nameAndId ) {
                    alert("关卡人不能为空！");
                    return
                }
                //完工日期不能为空
                if (!$scope.ccoinfo.completeDate ) {
                    alert("完工日期不能为空！");
                    return
                }
                //反馈附件校验
                if(($scope.ccoinfo.isFeedbackAttachment=='X')&&($scope.fileArr.length<1)){
                    alert("请上传附件！");
                    return
                }
                console.log("fileArr"+JSON.stringify($scope.fileArr));
                if(!!$scope.ccoinfo.nameAndId){
                    $scope.rciName = $scope.ccoinfo.nameAndId.split(" ")[0]||"";//RCI,RII签名人
                    $scope.rciNumber = $scope.ccoinfo.nameAndId.split(" ")[1]||"";//RCI,RII签名人编号;
                }else {
                    $scope.rciName = "";//RCI,RII签名人
                    $scope.rciNumber = "";//RCI,RII签名人编号;
                };
                if($scope.isRci_isRii==1){
                    $scope.ccoinfo.isRci=0;
                    $scope.ccoinfo.isRii=1;
                }else if($scope.isRci_isRii==2){
                    $scope.ccoinfo.isRci=1;
                    $scope.ccoinfo.isRii=0;
                }
                //暂存和关闭的数据
                $scope.ccoInfoto = {
                    isDm: $scope.ccoinfo.isDm,
                    isSd: $scope.ccoinfo.isSd,
                    isRci: $scope.ccoinfo.isRci,
                    isImportantModification:$scope.ccoinfo.isImportantModification,
                    isRii: $scope.ccoinfo.isRii,
                    isAli:$scope.ccoinfo.isAli,
                    isSsi:$scope.ccoinfo.isSsi,
                    isRsc:$scope.ccoinfo.isRsc,
                    isFts:$scope.ccoinfo.isFts,
                    isEwis:$scope.ccoinfo.isEwis,
                    isCpcp:$scope.ccoinfo.isCpcp,
                    isCdccl:$scope.ccoinfo.isCdccl,
                    isCmr:$scope.ccoinfo.isCmr,
                    acReg:$scope.ccoinfo.acReg,
                    cardNumber:$scope.ccoinfo.cardNumber,
                    acId:$scope.ccoinfo.acId,
                    modelSeries:$scope.ccoinfo.modelSeries,
                    preFlightNo:$scope.ccoinfo.preFlightNo,
                    preFlightId:$scope.ccoinfo.preFlightId,
                    flightNo:$scope.ccoinfo.flightNo,
                    flightId:$scope.ccoinfo.flightId,
                    flightDate:$scope.ccoinfo.flightDate,
                    type:$scope.ccoinfo.type,
                    description:$scope.ccoinfo.description,
                    isFeedbackAttachment:$scope.ccoinfo.isFeedbackAttachment,

                    id:$scope.ccoinfo.id,
                    cardId:$scope.ccoinfo.cardId,
                    station: $scope.ccoinfo.station,//航站
                    mechanicName:$scope.ccoSaveInfo.nameAndId.split(" ")[0],//关卡人
                    mechanicSn:$scope.ccoSaveInfo.nameAndId.split(" ")[1],//关卡人工号
                    workType:$scope.ccoinfo.workType,//类型
                    completeDate:parseInt($scope.ccoinfo.completeDate.getTime()),//完工时间
                    feedbackCh:$scope.ccoSaveInfo.feedbackCh,//反馈中文
                    feedbackEn:$scope.ccoSaveInfo.feedbackEn,//反馈英文
                    inspector:$scope.rciName,//RCI,RII签名人
                    inspectorNo:$scope.rciNumber,//RCI,RII签名人编号
                    hours:$scope.ccoinfo.hours,//人工时
                    // jobDate: $filter('date')($scope.dateFound, "yyyy/MM/dd HH:mm:ss"),
                    mechanicNoPhotoRemark:$scope.ccoinfo.mechanicNoPhotoRemark

                };
                console.log("附件上传的数据"+JSON.stringify($scope.fileArr));
                var params = angular.copy($scope.ccoInfoto);
                console.log("params上传的数据"+JSON.stringify(params));
                if(nrc==1){
                    $rootScope.startLoading();
                    console.log("1");
                    params.cache=true;
                    server.maocFormdataPost('form/submit', 'tbm-008-a', params, $scope.fileArr).then(function (data) {
                        $rootScope.endLoading();
                        console.log("保存接口返回的数据"+JSON.stringify(data));
                        if(data.data.statusCode==200){
                            alert("保存成功！");
                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        alert('保存失败!')
                    });
                }else {
                    console.log("2");
                    if(!!$scope.ccoinfo.isDm){
                        $rootScope.confirmInfo = '请确认是否已按DM要求执行？';
                        $rootScope.confirmShow = true;
                        $rootScope.confirmOk = function() {
                            $rootScope.confirmShow=false;
                            $rootScope.startLoading();
                            params.cache=false;
                            server.maocFormdataPost('form/submit', 'tbm-008-a', params, $scope.fileArr).then(function (data) {
                                $rootScope.endLoading();
                                if(200 == data.data.statusCode){
                                    alert("关闭成功！");
                                    $rootScope.go('back', 'slideLeft', {});
                                }
                            }).catch(function (error) {
                                $rootScope.endLoading();
                                alert('关闭失败!')
                            });
                        };
                    }else {
                        $rootScope.startLoading();
                        params.cache=false;
                        server.maocFormdataPost('form/submit', 'tbm-008-a', params, $scope.fileArr).then(function (data) {
                            $rootScope.endLoading();
                            if( 200 == data.data.statusCode){
                                alert("关闭成功！");
                                $rootScope.go('back', 'slideLeft', {});
                            }
                        }).catch(function (error) {
                            $rootScope.endLoading();
                            alert('关闭失败!')
                        });
                    };
                }

            }
            $scope.checkError = function (isError, checkWord) {
                if (isError) {
                    $scope.mrInfo.hours="";
                    alert("人工时只能输入数字！");
                    return;
                }
                if($scope.mrInfo.hours==0){
                    $scope.mrInfo.hours="";
                    alert("人工时不能输入0！");
                    return;
                }
            };

            //初始化接口
            function nrcdata_info(id) {
                $rootScope.startLoading();
                server.maocGetReq('TBM/getCCOFeedbackTask/'+id).then(function(data) {
                    $rootScope.endLoading();
                    console.log("接口返回数据"+JSON.stringify(data));
                    //ccoinfo 使用的是模拟的数据，从父页面传来
                    // var ccoDataInfo = modeData2.data[0];
                    var ccoDataInfo = data.data.data[0];
                    // console.log("模拟接口ccoDataInfo数据"+JSON.stringify(ccoDataInfo));

                    //原生数据
                    $scope.ccoinfo = {
                        "acReg": ccoDataInfo.acReg,
                        "cardNumber": ccoDataInfo.cardNumber,
                        "cardId": ccoDataInfo.cardId,
                        "acId": ccoDataInfo.acId,
                        "workType": ccoDataInfo.workType,
                        "modelSeries": ccoDataInfo.modelSeries,
                        "station":  ccoDataInfo.station,
                        "preFlightNo":ccoDataInfo.preFlightNo,
                        "preFlightId": ccoDataInfo.preFlightId,
                        "flightNo":ccoDataInfo.flightNo,
                        "flightId": ccoDataInfo.flightId,
                        "flightDate": ccoDataInfo.flightDate,
                        "type": ccoDataInfo.type,
                        // "workStatus":ccoDataInfo.workStatus,
                        "isDm": ccoDataInfo.isDm,
                        "isSd": ccoDataInfo.isSd,
                        "isRci": ccoDataInfo.isRci,
                        "isImportantModification":ccoDataInfo.isImportantModification,
                        "isRii": ccoDataInfo.isRii,
                        "isAli":ccoDataInfo.isAli,
                        "isSsi":ccoDataInfo.isSsi,
                        "isRsc":ccoDataInfo.isRsc,
                        "isFts":ccoDataInfo.isFts,
                        "isEwis":ccoDataInfo.isEwis,
                        "isCpcp":ccoDataInfo.isCpcp,
                        "isCdccl":ccoDataInfo.isCdccl,
                        "isCmr":ccoDataInfo.isCmr,
                        "description":ccoDataInfo.description,
                        "inspector": ccoDataInfo.inspector||"",
                        "inspectorNo": ccoDataInfo.inspectorNo||"",
                        "completeDate": new Date($filter('date')(ccoDataInfo.completeDate, 'yyyy/MM/dd HH:mm')),
                        "hours": ccoDataInfo.hours,
                        "id": ccoDataInfo.id,
                        "isFeedbackAttachment": ccoDataInfo.isFeedbackAttachment,
                        "canEditRiiRci": ccoDataInfo.canEditRiiRci,
                        "defectInfo":{}
                    };
                    if(ccoDataInfo.isRci == 1 && ccoDataInfo.isRii == 1){
                        $scope.isRci_isRii = 1;
                    }
                    if(ccoDataInfo.isRii == 1 && ccoDataInfo.isRci == 0){
                        $scope.isRci_isRii = 1;
                    }
                    if(ccoDataInfo.isRci == 1 && ccoDataInfo.isRii == 0){
                        $scope.isRci_isRii = 2;
                    }
                    if(ccoDataInfo.isRci == 0 && ccoDataInfo.isRii == 0){
                        $scope.isRci_isRii = 2;
                    }
                    if(!ccoDataInfo.isRii && !ccoDataInfo.isRii){
                        $scope.isRci_isRii=2;
                    }

                    //用户输入保存的数据
                    $scope.ccoSaveInfo = {
                        "mechanicName": ccoDataInfo.mechanicName||"",
                        "mechanicSn": ccoDataInfo.mechanicSn||"",
                        "feedbackCh": ccoDataInfo.feedbackCh,
                        "feedbackEn": ccoDataInfo.feedbackEn,
                        "ccVos":ccoDataInfo.ccVos,
                        "ccNo":ccoDataInfo.ccNo,
                    };

                    //新增cc时候需要的数据
                    if(!!ccoDataInfo){
                        //基础信息
                        $scope.ccoinfo.defectInfo.flightNo =ccoDataInfo.flightNo;//航班号
                        $scope.ccoinfo.defectInfo.flightId = ccoDataInfo.flightId;//航班ID
                        $scope.ccoinfo.defectInfo.acReg = ccoDataInfo.acReg;//飞机号
                        $scope.ccoinfo.defectInfo.acId = ccoDataInfo.acId;
                        $scope.ccoinfo.defectInfo.ata = ccoDataInfo.ata;//章节号
                        $scope.ccoinfo.defectInfo.defectId = ccoDataInfo.cardId;
                        //必要信息
                        $scope.ccoinfo.defectInfo.workorderId = ccoDataInfo.id;
                        $scope.ccoinfo.defectInfo.tlbId = '';//说明：tlbid 有就传，没有就传个空值，以便于与其它使用新增cc的页面保持一致
                        $scope.ccoinfo.defectInfo.docNo = ccoDataInfo.cardNumber;
                        $scope.ccoinfo.defectInfo.docType = 'CCO';
                    }
                        console.log("传给cc的数据defectInfo"+JSON.stringify($scope.ccoinfo.defectInfo));

                    //RCI/RII签名
                    if($scope.ccoinfo.inspector!=""){
                        $scope.ccoinfo.nameAndId=ccoDataInfo.inspector +" "+ccoDataInfo.inspectorNo;
                    };
                    //关卡人
                    if($scope.ccoSaveInfo.mechanicName!=""){
                        $scope.ccoSaveInfo.nameAndId=ccoDataInfo.mechanicName +" "+ccoDataInfo.mechanicSn;
                    };

                    //图片附件
                    //
                    angular.forEach(ccoDataInfo.attachmentList, function (item, index) {
                        var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                        var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                        var imgType = item.name.substring(item.name.lastIndexOf('.'));
                        imgBlob.name = item.name.indexOf('down') == -1
                            ? imgName + 'down' + imgType
                            : item.name;
                        $scope.fileArr.push(imgBlob);
                        $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));

                    })
                }).catch(function (error) {
                    $rootScope.endLoading();
                    alert('初始化失败!')
                });
            }
            //删除CC
            $scope.cc_delete = function (id) {
                event.preventDefault();
                event.stopPropagation();
                $rootScope.confirmInfo = "确定要删除此条CC吗";
                $rootScope.confirmShow = true;
                $rootScope.confirmOk = function () {
                    $rootScope.startLoading();
                    server.maocGetReq('cc/delete', {
                        id: id
                    }).then(function (result) {
                        $rootScope.endLoading();
                        if (result.data.statusInfo == 'OK') {
                            alert('删除成功!');
                            nrcdata_info($stateParams.itemId);
                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        alert('删除失败!')
                    });
                };
            }

        }
    ]);