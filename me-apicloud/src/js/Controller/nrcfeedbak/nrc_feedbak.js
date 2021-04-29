
module.exports = angular.module('myApp').controller('nrcfeedbakController',
                        ['$rootScope', '$scope', '$filter', '$stateParams', 'server','$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
                            function ($rootScope, $scope, $filter, $stateParams,server,$interval, $localForage, configInfo, b64ToBlob, $timeout) {
                        $rootScope.loading = false;
                        $scope.isCreateData=false;
                        $scope.isRci_isRii="";
                        $scope.uploadSoundArr = [];
                        $scope.isApiCloud = false; //上传附件时是否要用apiCloud方法
                        $scope.imgArr = [];  //页面预览所用文件
                        $scope.dateFound = new Date();

                        $scope.taskupWay = 'feedback';
                        $scope.fileList = [];
                        $scope.nrcId = $stateParams.itemId;
                        // 查询NRC来源
                        init_nrc_sourceFrom($stateParams.itemId);
                        nrcdata_info($stateParams.itemId);
                        $scope.gobackToRoot = function () {
                            $rootScope.go('back', 'slideLeft', {});
                        };
                        $scope.nrcInfo=$stateParams.nrcInfo;
                        $scope.subimt_nrc=function (nrc) {
                            if ($scope.mrInfo.hours=="") {
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

                            // if($scope.isRci_isRii!="" && $scope.nrcInfo.fromPage != 'inspect'){
                            if($scope.isRci_isRii!="" && $scope.nrcInfo.fromPage != 'inspect'){
                                if(!$scope.inspector.approverName){
                                    alert("检验员不能为空！");
                                    return
                                }
                            }
                            if($scope.isRci_isRii!="" && $scope.nrcInfo.fromPage == 'inspect' && $scope.inspectShowCheck){
                                if(!$scope.inspector.approverName){
                                    alert("检验员不能为空！");
                                    return
                                }
                            }
                            if($scope.nrcInfo.fromPage == 'inspect' && !$scope.inspectShowCheck){
                                $scope.mrInfo.isRci=0;
                                $scope.mrInfo.isRii=0;
                            }
                            // if($scope.mrInfo.approverSn == $scope.inspector.approverSn){
                            //     $rootScope.errTip = '工作者和必互检人不能一致';
                            //     return;
                            // }
                            var checkPho = $scope.mrInfo.mechanicNoPhotoRemark||''

                            if($scope.imgArr.length < 1 && !checkPho.trim()){
                                $rootScope.errTip = '不上传照片时，无照片备注必填';
                                return;
                            }
                            $scope.mrInfoto = {
                                acReg: $scope.mrInfo.acReg,
                                // jobDate: $filter('date')($scope.dateFound, "yyyy/MM/dd HH:mm:ss"),
                                flightNo: $scope.mrInfo.flightNo,
                                station: $scope.mrInfo.station,
                                isDm : $scope.mrInfo.isDm,
                                isRci:$scope.mrInfo.isRci,
                                isRii:$scope.mrInfo.isRii,
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
                                id:$stateParams.itemId,
                                inspector:$scope.inspector.approverName,
                                inspectorNo:$scope.inspector.approverSn,
                                attachmentList:$scope.fileList,
                                canEditRiiRci:$scope.mrInfo.canEditRiiRci,
                                mechanicNoPhotoRemark:$scope.mrInfo.mechanicNoPhotoRemark


                            };
                            $scope.mrInfoto.attachmentList.forEach(function (item , i) {
                                item.content && delete item.content
                            })
                            var params = angular.copy($scope.mrInfoto);
                            console.log(JSON.stringify(params));
                            if(nrc==1){
                                server.maocFormdataPost('form/submit', 'tbm-006-g', params).then(function (data) {
                                    if(data.data.statusCode==200){
                                        alert("保存成功！");
                                    }
                                }).catch(function (error) {

                                });
                            }else {
                                server.maocFormdataPost('form/submit', 'tbm-006-h', params).then(function (data) {
                                    if(data.data.statusCode==200){
                                        alert("关闭成功！");
                                        $rootScope.go('back', 'slideLeft', {});
                                    }
                                }).catch(function (error) {

                                });
                            }

                        };
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
                        };
                        function nrcdata_info(id) {
                            $scope.inspectShowCheck = false;
                            server.maocGetReq('maintain/getNrcOrNrcTaskFeedbackInfo/'+id).then(function(data) {
                                console.log(JSON.stringify(data));
                                $scope.cc_data=data.data.data[0];
                                var datainfo=data.data.data[0];
                                $scope.mrInfo = {
                                    completeDate: new Date($filter('date')(datainfo.completeDate, 'yyyy/MM/dd HH:mm')),
                                    acReg: datainfo.acReg,
                                    // jobDate: $filter('date')($scope.dateFound, "yyyy/MM/dd HH:mm:ss"),
                                    flightNo: datainfo.flightNo,
                                    station: datainfo.station,
                                    isDm : datainfo.isDm,
                                    isRci:datainfo.isRci,
                                    isRii:datainfo.isRii,
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
                                    hours:datainfo.hours == 0 ?  '' :datainfo.hours,
                                    canEditRiiRci:datainfo.canEditRiiRci,
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
                                if($scope.nrcInfo.fromPage == 'inspect' && (datainfo.isRci == 1 || datainfo.isRii == 1)){
                                    $scope.inspectShowCheck = true;
                                }
                                if($scope.nrcInfo.fromPage == 'inspect' && datainfo.isRci == 0 && datainfo.isRii == 0){
                                    $scope.isRci_isRii = '';

                                }
                                //图片附件
                                $scope.fileList = datainfo.attachmentList;

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
                            })
                        }

                        $scope.addcc=function () {
                            if($scope.cc_data.type=="Pr/F" ||$scope.cc_data.type=="T/R" ||$scope.cc_data.type=="O/G"  ){
                                $rootScope.go('newcc', 'slideLeft', {defectInfo: {workorderId:$scope.cc_data.id,flightId:$scope.cc_data.preFlightId,flightNo:$scope.cc_data.preFlightNo,acReg: $scope.cc_data.acReg,acId:$scope.cc_data.acId}, docType: 'nrc', docNo: $scope.cc_data.cardNumber})

                            }else {
                                $rootScope.go('newcc', 'slideLeft', {defectInfo: {workorderId:$scope.cc_data.id,flightId:$scope.cc_data.flightId,flightNo:$scope.cc_data.flightNo,acReg: $scope.cc_data.acReg,acId:$scope.cc_data.acId}, docType: 'nrc', docNo: $scope.cc_data.cardNumber})
                            }
                        };
                        $scope.goAddOrDetail=function(cc){
                            $rootScope.go('newccInfo', 'slideLeft', {ccInfo: cc});

                            // if(cc.middleStatus == "O"){
                            //     $rootScope.go('cc', 'slideLeft',
                            //         {defectInfo: {acReg: $scope.cc_data.acReg,tlbNo:$scope.cc_data.cardNumber,acId:$scope.cc_data.acId},
                            //             cc: cc,
                            //             tlbId: $stateParams.itemId,
                            //             docType: "nrc",
                            //             docNo: ""
                            //         });
                            // }else{
                            //     $rootScope.go('ccInfo', 'slideLeft', {ccInfo: cc});
                            // }
                        }

                                //删除CC
                                $scope.cc_delete = function (id) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    $rootScope.confirmInfo = "确定要删除此条CC吗";
                                    $rootScope.confirmShow = true;

                                    $rootScope.confirmOk = function () {
                                        server.maocGetReq('cc/delete', {
                                            id: id
                                        }).then(function (result) {
                                            if (result.data.statusInfo == 'OK') {
                                                alert('删除成功!');
                                                nrcdata_info($stateParams.itemId);
                                            }
                                        }).catch(function (error) {
                                            alert('删除失败!')
                                        });
                                    };
                                }

                        ////////////////////////////////////修理补片/////////////////////////////
                        // 获取NRC来源
                        function init_nrc_sourceFrom(workOrderId) {
                            server.maocGetReq('nrcPhysicalInfo/findNrcSourceFrom/'+workOrderId).then(function(rst) {
                                console.log("获取NRC来源-->"+JSON.stringify(rst));
                                var nrcSource = rst.data.data[0];
                                if(!nrcSource || !nrcSource.sourceFrom){
                                    $scope.nrcSourceFrom = 'TDMS';
                                    return;
                                }
                                if(nrcSource.sourceFrom === 'ASMS'){
                                    $scope.nrcSourceFrom='ASMS';
                                    init_nrc_physicalList(nrcSource.nrcId);
                                }
                            })
                        }

                        // 获取修理补片列表
                        function init_nrc_physicalList(nrcId) {
                            server.maocGetReq('nrcPhysicalInfo/queryNrcPhysicalByNrcId/'+nrcId).then(function(rst) {
                                console.log(JSON.stringify(rst));
                                $scope.nrc_physical_data=rst.data.data[0];
                            })
                        }
                        //添加修理补片
                        $scope.addNrcPhysicalInfo=function () {
                            $rootScope.go('nrcPhysicalInfo', 'slideLeft',
                                {nrcId: $scope.mrInfo.cardId,operate:'add',phy:{}})
                        }

                        //删除修理补片
                        $scope.deleteNrcPhysicalInfo = function (id) {
                            event.preventDefault();
                            event.stopPropagation();
                            $rootScope.confirmInfo = "确定要删除此条修理补片吗";
                            $rootScope.confirmShow = true;

                            $rootScope.confirmOk = function () {
                                server.maocGetReq('nrcPhysicalInfo/deleteNrcPhysicalInfo/'+id).then(function (result) {
                                    if (result.data.statusInfo == 'OK') {
                                        alert('删除成功!');
                                        init_nrc_sourceFrom($stateParams.itemId);
                                    }
                                }).catch(function (error) {
                                    alert('删除失败!')
                                });
                            };
                        }
                        $scope.goNrcPhysicalInfoDetail=function(phy){
                            $rootScope.go('nrcPhysicalInfo', 'slideLeft',
                                {nrcId: $scope.mrInfo.cardId,operate:'view',phy:phy});
                        }


      }
    ]);