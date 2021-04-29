
module.exports = angular.module('myApp').controller('toprocessController',
    ['$rootScope', '$scope', '$filter', '$stateParams', 'server','$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter, $stateParams,server,$interval, $localForage, configInfo, b64ToBlob, $timeout) {
            $rootScope.loading = false;
            $scope.isCreateData=false;
            $scope.isRci_isRii="";
            $scope.uploadSoundArr = [];
            $rootScope.searchTlbFrom = 'status';
            $scope.isApiCloud = false; //上传附件时是否要用apiCloud方法
            $scope.imgArr = [];  //页面预览所用文件
            $scope.dateFound = new Date();
            // console.log(JSON.stringify($stateParams));

            $scope.taskupWay = 'feedback';
            $scope.fileList = [];
            $scope.nrcId = $stateParams.itemId;

            nrcdata_info($stateParams.itemId);
            $scope.gobackToRoot = function () {
                $rootScope.go('back', 'slideLeft', {});
            };
            $scope.nrcinfo=$stateParams.nrcInfo;
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
                if($scope.isRci_isRii!=""){
                    if(!$scope.inspector.approverName){
                        alert("检验员不能为空！");
                        return
                    }
                }
                if($scope.cc_data.toBaseInfoVO.type == 5 && $scope.imgArr.length == 0){
                    alert("串件类TO反馈附件必填！");
                    return;
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
                    mechanicName:$scope.mrInfo.approverName,
                    mechanicSn:$scope.mrInfo.approverSn,
                    type:$scope.mrInfo.type,
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
                    toFeedbackCh:$scope.mrInfo.toFeedbackCh,
                    attachmentList:$scope.fileList,
                    isRci:$scope.mrInfo.isRci,
                    isRii:$scope.mrInfo.isRii,
                    inspector:$scope.inspector.approverName,
                    inspectorNo:$scope.inspector.approverSn,
                    mechanicNoPhotoRemark:$scope.mrInfo.mechanicNoPhotoRemark
                };
                $scope.mrInfoto.attachmentList.forEach(function (item , i) {
                    item.content && delete item.content
                })

                if($scope.toType=="toProdprep"){ //飞机检查维护类 普查类 执行反馈工时

                    $scope.mrInfoto.toBaseInfoVO=$scope.toBaseInfoVO;
                    // $scope.mrInfoto.toBaseInfoVO.producePrepareOrders=$scope.producePrepareOrders;
                    // $scope.mrInfoto.toBaseInfoVO.workOrderFeedbackDetails=$scope.workOrderFeedbackDetails;
                }

                var params = angular.copy($scope.mrInfoto);

                console.log(JSON.stringify(params));
                if(nrc==1){
                    params.cache=true;
                    server.maocFormdataPost('form/submit', 'tbm-007-a', params).then(function (data) {
                        if(data.data.statusCode==200){
                            alert("保存成功！");
                        }
                    }).catch(function (error) {

                    });
                }else {
                    params.cache=false;
                    server.maocFormdataPost('form/submit', 'tbm-007-a', params).then(function (data) {
                        if(data.data.statusCode==200){
                            alert("关闭成功！");
                            $rootScope.go('back', 'slideLeft', {});
                        }
                    }).catch(function (error) {

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
            };
            $scope.checkRealStaff = function (k) {
                var reg=/^\d{1,14}$/;
                var val=$scope.workOrderFeedbackDetails[k].realStaff;
                if (!reg.test(val)) {
                    $scope.workOrderFeedbackDetails[k].realStaff="";
                    alert("只能输入大于0的整数！");
                    return;
                }else{
                    var totalSum=0;
                    var toTotalSum=0;
                    angular.forEach($scope.workOrderFeedbackDetails,function(item,i){
                        console.log("我不是***");
                        console.log(JSON.stringify(item));
                        toTotalSum=accAdd(toTotalSum,accMul(item.realStaff,item.realHour));
                        if(i!=$scope.workOrderFeedbackDetails.length-1){
                            totalSum=accAdd(totalSum,accMul(item.realStaff,item.realHour));
                        }
                    });

                    $scope.totalSum=totalSum;
                    $scope.mrInfo.hours=toTotalSum;
                    console.log("hours");
                    console.log($scope.mrInfo.hours);
                }
            };
            $scope.checkRealHour = function (k) {
                var reg=/^\d{1,14}(\.\d{0,2})?$/;
                var val=$scope.workOrderFeedbackDetails[k].realHour;
                if (!reg.test(val)) {
                    $scope.workOrderFeedbackDetails[k].realHour="";
                    alert("工时只能输入数字或者两位小数！");
                    return;
                }else{
                    var totalSum=0;
                    var toTotalSum=0;
                    angular.forEach($scope.workOrderFeedbackDetails,function(item,i){
                        toTotalSum=accAdd(toTotalSum,accMul(item.realStaff,item.realHour));
                        if(i!=$scope.workOrderFeedbackDetails.length-1){
                            totalSum=accAdd(totalSum,accMul(item.realStaff,item.realHour));
                        }
                    })

                    $scope.totalSum=totalSum;
                    $scope.mrInfo.hours=toTotalSum;
                    console.log("hours");
                    console.log($scope.mrInfo.hours);
                }
            };
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
            function nrcdata_info(id) {
                server.maocGetReq('TBM/getTOFeedbackTask/'+id).then(function(data) {
                    console.log("TBM/getTOFeedbackTask"+JSON.stringify(data));
                    $scope.cc_data=data.data.data[0];
                    var datainfo=data.data.data[0];
                    var toBaseInfoVOData =  datainfo.toBaseInfoVO||{};
                    console.log("toBaseInfoVOData"+JSON.stringify(toBaseInfoVOData));
                    $scope.mrInfo = {
                        completeDate: new Date($filter('date')(datainfo.completeDate, 'yyyy/MM/dd HH:mm')),
                        acReg: datainfo.acReg,
                        // jobDate: $filter('date')($scope.dateFound, "yyyy/MM/dd HH:mm:ss"),
                        flightNo: datainfo.flightNo,
                        station: datainfo.station,
                        toFeedbackCh:datainfo.toFeedbackCh,
                        approverName:datainfo.mechanicName|| "",
                        approverSn:datainfo.mechanicSn|| "",
                        type:datainfo.type,
                        rectEn:datainfo.rectEn,
                        feedbackCh:datainfo.feedbackCh,
                        acId:datainfo.acId,
                        workType:datainfo.workType,
                        flightId:datainfo.flightId,
                        flightDate:datainfo.flightDate,
                        cardId:datainfo.cardId,
                        cardNumber:datainfo.cardNumber,
                        description:datainfo.description,
                        descriptionShow:datainfo.description,
                        hours:datainfo.hours == 0 ?  '' :datainfo.hours,
                        model :datainfo.model,
                        isRci:datainfo.isRci,
                        isRii:datainfo.isRii,
                        mechanicNoPhotoRemark:datainfo.mechanicNoPhotoRemark,
                        isDm:toBaseInfoVOData.dmType||"",
                        ata:toBaseInfoVOData.ata||"",
                        subject:toBaseInfoVOData.subject||""
                    };
                    if( $scope.mrInfo.description.indexOf('如果测试通过') != -1 && $scope.mrInfo.description.indexOf('如有问题请联系技术支援处') != -1){
                        var process = $scope.mrInfo.description.slice(0,$scope.mrInfo.description.indexOf('如果测试不通过'));
                        var processNot = $scope.mrInfo.description.slice($scope.mrInfo.description.indexOf('如果测试不通过'),$scope.mrInfo.description.indexOf('如有问题请联系技术支援处'));
                        var callMan = $scope.mrInfo.description.slice($scope.mrInfo.description.indexOf('如有问题请联系技术支援处'));
                        $scope.mrInfo.descriptionShow = '\n' + process + '\n' + processNot+'\n' + callMan;
                    }
                    if(datainfo.isRci!=0){
                        $scope.isRci_isRii=2;
                    }
                    if(datainfo.isRii!=0){
                        $scope.isRci_isRii=1;
                    }
                    if(datainfo.isRii == '0' && datainfo.isRii == '0'){
                        $scope.isRci_isRii=2;

                    }
                    if(!datainfo.isRii && !datainfo.isRii){
                        $scope.isRci_isRii=2;

                    }
                    $scope.inspector = {
                        approverName:datainfo.inspector|| "",
                        approverSn:datainfo.inspectorNo|| "",
                    };
                    if($scope.inspector.approverName!=""){
                        $scope.inspector.nameAndId=datainfo.inspector +" "+datainfo.inspectorNo;
                    }
                    if($scope.mrInfo.approverName!=""){
                        $scope.mrInfo.nameAndId=datainfo.mechanicName +" "+datainfo.mechanicSn;
                    }

                    //    飞机检查/维护类 普查类显示挂准备单
                    var toBaseInfoVO=datainfo.toBaseInfoVO;

                    console.log(JSON.stringify(toBaseInfoVO));

                    console.log(JSON.stringify(toBaseInfoVO.producePrepareOrders));

                    if(toBaseInfoVO.type=="3"||toBaseInfoVO.type=="2"){
                        $scope.toType="toProdprep";
                        // toBaseInfoVO.producePrepareOrders=[
                        //     {"id":"105419011382050816","no":"33-33-33-B737-01","content":"B-2598飞机生产准备单","expectHour":3,"expectStaff":2},
                        //     {"id":"105419011382050816","no":"22-22-22-B737-22","content":"B-2598准备单（勿删）","expectHour":8,"expectStaff":2}
                        // ];


                        var planSum=0;
                        var totalSum=0;
                        var wofd=toBaseInfoVO.workOrderFeedbackDetails;
                        var wofdLen=wofd.length;
                        angular.forEach(toBaseInfoVO.producePrepareOrders,function(item,i){
                            planSum=accAdd(planSum,accMul(item.expectStaff,item.expectHour));
                            if(wofdLen==0){
                                wofd.push({
                                    "orderId":item.id,
                                    "realStaff":"",
                                    "realHour":"",

                                });


                                console.log(JSON.stringify(wofd));
                            }

                            totalSum=accAdd(totalSum,accMul(wofd[i].realStaff,wofd[i].realHour));

                        });

                        if(wofdLen==0){
                            wofd.push({
                                "realStaff":"",
                                "realHour":""
                            });
                        }

                        var realNo=accMul(wofd[wofd.length-1].realStaff,wofd[wofd.length-1].realHour);
                        console.log("workOrderFeedbackDetails");
                        console.log(JSON.stringify(wofd));

                        $scope.workOrderFeedbackDetails=wofd;
                        $scope.producePrepareOrders=toBaseInfoVO.producePrepareOrders;
                        $scope.planSum=planSum;
                        $scope.totalSum=totalSum;
                        $scope.mrInfo.hours=accAdd(totalSum,realNo);
                        $scope.toBaseInfoVO=toBaseInfoVO;
                    }else{
                        $scope.toType="toProdprepNo";
                    }


                    //    飞机检查/维护类 普查类显示挂准备单 end

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

            $scope.addTlb=function () {
                if($scope.cc_data.type=="Pr/F" ||$scope.cc_data.type=="T/R" ||$scope.cc_data.type=="O/G"  ){
                    $rootScope.go('tlbDetail',"slideLeft",{zoneInfo: {model:$scope.mrInfo.model,type:$scope.cc_data.type,itemId:$stateParams.itemId,acReg: $scope.cc_data.acReg,minorModel:$scope.cc_data.modelSeries,dmStatus:$stateParams.nrcInfo.dmStatus,flightNo:$scope.cc_data.preFlightNo,flightId:$scope.cc_data.preFlightId,staFound:$scope.cc_data.station,staAction:$scope.cc_data.station,lineJobId:$scope.cc_data.parentId}});
                }else {
                    $rootScope.go('tlbDetail',"slideLeft",{zoneInfo: {model:$scope.mrInfo.model,type:$scope.cc_data.type,itemId:$stateParams.itemId,acReg: $scope.cc_data.acReg,minorModel:$scope.cc_data.modelSeries,dmStatus:$stateParams.nrcInfo.dmStatus,flightNo:$scope.cc_data.flightNo,flightId:$scope.cc_data.flightId,staFound:$scope.cc_data.station,staAction:$scope.cc_data.station,lineJobId:$scope.cc_data.parentId}});
                }
            };
            $scope.goAddOrDetail=function(tlb){
                $rootScope.go('tlbDetail', 'slideLeft', {tlbId: tlb.tlbId});
            };

            $scope.addcc=function () {

                $rootScope.go('newcc', 'slideLeft', {defectInfo: {workorderId:$scope.cc_data.id,flightId:$scope.cc_data.flightId,flightNo:$scope.cc_data.flightNo,acReg: $scope.cc_data.acReg,acId:$scope.cc_data.acId}, docType: 'to', docNo: $scope.cc_data.cardNumber})

            };
            $scope.goCcDetail=function(cc) {
                $rootScope.go('newccInfo', 'slideLeft', {ccInfo: cc});
            }
            //删除CC
            $scope.cc_delete = function (id) {
                event.preventDefault();
                event.stopPropagation();
                $rootScope.confirmInfo = "确定要删除此条CC吗";
                $rootScope.confirmShow = true;

                $rootScope.confirmOk = function () {
                    server.maocPostReq('cc/delete', {
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
            $scope.tlb_delete = function (id) {
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