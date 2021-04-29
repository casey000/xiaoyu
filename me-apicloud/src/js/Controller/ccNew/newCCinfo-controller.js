module.exports = angular.module('myApp').controller('newccInfoController',
    ['$rootScope', '$scope', '$filter', '$stateParams', '$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter, $stateParams, $interval, $localForage, configInfo, b64ToBlob, $timeout) {
            // var defectInfo = $stateParams.defectInfo;
            // var copyDetail;
            // $scope.acid=defectInfo.acId;
            // $scope.ccId = $stateParams.cc.id;
            // $scope.defectId = defectInfo.id;
            // $scope.tlbNo = $stateParams.tlbNo || defectInfo.tlbNo;
            //
            if(JSON.stringify($stateParams.ccInfo) != '{}'){
                $scope.cc = $stateParams.ccInfo;
                $rootScope.ccInfo = $stateParams.ccInfo
            }else{
                $scope.cc = $rootScope.ccInfo;
            }
            $scope.forbid = {
                showDes : false,
                refuseReasonPend : ''
            }
            $scope.fromTlb = $stateParams.fromTlb;
            $scope.imgArr = [];
            $scope.fileArr = [];
            $scope.isEdit = false;

            console.info($scope.cc ,'123');
            $scope.hideApproverTitle = true;//隐藏选人默认状态
            var editBase,editNext;
            $scope.initInfo = function(){
                $scope.offComponents = [];
                $scope.onComponents = [];
                server.maocGetReq('cc/selectById',{id:$scope.cc.id}).then(function(data){
                    if (data.data.statusCode == 200) {
                        editBase = data.data.data[0].tlbCompCc;
                        editNext = data.data.data[0].tlbCompCcSubList;
                        initPage(data.data.data[0].tlbCompCc);
                        initNextLevel(data.data.data[0].tlbCompCcSubList);
                        if(data.data.data[0].tlbCompCc.ccType != 1){
                            getProhibited(data.data.data[0].tlbCompCc.onPn,data.data.data[0].tlbCompCc.onSn)
                        }
                    }
                }).catch(function(error){
                    console.log(error);
                });
                server.maocGetReq('assembly/selectFileByCategoryAndSourceId',{sourceId:$scope.cc.id,category:'TLB_COMP_CC'}).then(function(data){
                    $rootScope.endLoading();
                    if (data.data.statusCode == 200) {
                        angular.forEach(data.data.data, function (item, index) {
                            if (item.type == 'mp3') {
                                $scope.uploadSoundArr.push({
                                    soundData: item.content,
                                    type: '.mp3',
                                    length: (item.size / 1000).toFixed(1)
                                });
                            } else if(item.type.indexOf('image') != '-1'){
                                if(typeof (item.content) != 'undefined') {
                                    var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                    var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                    var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                    imgBlob.name = item.name.indexOf('down') == -1
                                        ? imgName + 'down' + imgType
                                        : item.name;
                                    imgBlob.id = item.id;
                                    $scope.fileArr.push(imgBlob);
                                    $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                }
                            }
                        })
                        console.info($scope.imgArr,'$scope.imgArr')
                    }
                }).catch(function(error){
                    $rootScope.endLoading();
                    console.log(error);
                });

            };
            $scope.initInfo();
            var initNextLevel = function (obj) {
                // $scope.responNextObj = obj;
                if(obj.length > 0){
                    for(var i in obj){
                        if(obj[i].pPart == 'ON'){
                            $scope.onComponents.push(obj[i]);
                            continue;
                        }
                        if(obj[i].pPart == 'OFF'){
                            $scope.offComponents.push(obj[i]);
                            continue;
                        }
                    }
                }
            };
            var initPage = function (obj) {
                $scope.responObj = obj;
                server.maocGetReq('/assembly/analysisDomainTypeByCode', {
                    domainCode: 'CC_SOURCE_TYPE,LIFE_RAFT_PN,RELEASE_TYPE',

                }).then(function (result) {

                    if(result.data.statusCode==200){
                        var reasonList = result.data.data[0].CC_SOURCE_TYPE;
                        $scope.rafeList = result.data.data[0].LIFE_RAFT_PN;
                        var releaseList = result.data.data[0].RELEASE_TYPE;
                        for (var i in reasonList){
                            if (reasonList[i].VALUE == $scope.responObj.workingReason){
                                $scope.workingReasonText = reasonList[i].TEXT;
                            }
                        };
                        if($scope.responObj.releaseType){
                            console.log($scope.responObj.releaseType,'$scope.responObj.releaseType')
                            for (var j in releaseList){
                                if (releaseList[j].VALUE == $scope.responObj.releaseType){
                                    $scope.releaseType = reasonList[i].TEXT;
                                }
                            };
                        }

                    }
                }).catch(function (error) {
                    alert('失败!')
                });
            };
            function getProhibited(pn,sn){
                server.maocGetReq('prohibit/selectRelationByPnAndSn',{pn:pn,sn:sn}).then(function (data) {
                    if (data.data.statusCode === 200) {
                        $scope.prohibitList = data.data.data;
                    }
                    if (data.data.statusCode === 204) {
                        $scope.prohibitList = [];
                    }
                    $rootScope.endLoading();

                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.viewPdf = function(data){
                $rootScope.startLoading();
                if(!data.businessId){
                    $rootScope.errTip = '数据有误';
                    return
                }
                server.maocGetReq('relatedDoc/getDocUrlByIdAndType', {id:data.businessId,type:data.businessType}).then(function (data) {
                    $rootScope.endLoading();
                    if (200 === data.status) {
                        var url = data.data.data[0];
                        console.log(url,'url')
                        url && NativeAppAPI.openPdfWithUrl({url:url});
                        !url && ($rootScope.errTip = '无数据');
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                    console.log(error);
                });
            }
            $scope.delCC = function(){
                $rootScope.startLoading();
                server.maocGetReq('cc/delete',{id:$scope.cc.id}).then(function(data){
                    $rootScope.endLoading();
                    if (data.data.statusCode == 200) {
                        alert('删除成功');
                        $rootScope.go('back')
                    }else{
                        alert(data.data.statusInfo);
                    }
                }).catch(function(error){
                    $rootScope.endLoading();
                    console.log(error);
                });
            };
            //首次提交到sap；
            $scope.subSap = function(raft){

                $rootScope.startLoading();
                server.maocGetReq('cc/close',{id:$scope.cc.id}).then(function(data){
                    $rootScope.endLoading();
                    if(data.status == 200){
                        if (data.data.statusCode == 200) {
                            alert('提交成功');
                            $rootScope.go('back')
                        }
                        if(data.data.statusCode > 50000){
                            $rootScope.isYes = true; //值为true时,显示的按钮为'是/否'
                            $rootScope.confirmInfo = data.data.statusInfo +",是否强行提交本条数据到SAP(后续运维人员会跟进)";
                            $rootScope.confirmShow = true;

                            $rootScope.confirmOk = function () {
                                $rootScope.confirmShow = false;
                                $rootScope.isYes = false;
                                $rootScope.startLoading();
                                server.maocGetReq('cc/forciblyClose',{id:$scope.cc.id,code:data.data.statusCode}).then(function (result) {
                                    if (200 === result.status) {
                                        alert('提交成功');
                                        $rootScope.go('back')
                                    }
                                    $rootScope.endLoading();
                                }).catch(function (error) {
                                    $rootScope.endLoading();
                                });
                            };
                        }else if(data.data.statusCode != 200){
                            $rootScope.errTip = data.data.statusInfo;
                        }
                    }

                }).catch(function(error){
                    console.log(error);
                });
            };
            $rootScope.confirmCancel = function () {
                $rootScope.confirmShow = false;
            };
            $scope.editCC = function(){
                // $rootScope.go('newcc', 'slideLeft', {editBase: dataBody.tlbDTO, editNext: tlbId, docType: 'TLB', docNo: dataBody.tlbDTO.tlbNo})
                $rootScope.go('newcc', 'slideLeft', {editBase: editBase, editNext: editNext,prohibitList:$scope.prohibitList || []})
            }
            // $scope.completeDate = new Date();
            // $scope.imgArr = [];  //页面预览所用文件
            // $scope.docType = $stateParams.docType;
            // $scope.initData = {
            //     defectNo: defectInfo.tlbNo || defectInfo.defectNo ,
            //     acNo: defectInfo.acReg
            // };
            // $scope.typeData = ['Remove', 'Install', 'Replace', 'Swap'];
            $scope.typeData = ['拆下', '装上', '拆换', '串件'];



            $scope.goComponents = function (index) {
                index == 1 ? $scope.offSubComponents = true : $scope.onSubComponents = true

            };
            $scope.cancelCom = function(){
                $scope.offSubComponents = false;
                $scope.onSubComponents = false;
            };
            $scope.keyEvent = function () {

            }














        }
    ]);


