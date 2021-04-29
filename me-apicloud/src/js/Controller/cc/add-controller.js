module.exports = angular.module('myApp').controller('ccAddController',
    ['$rootScope', '$scope', '$filter', '$stateParams', '$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter, $stateParams, $interval, $localForage, configInfo, b64ToBlob, $timeout) {
            var defectInfo = $stateParams.defectInfo;
            var copyDetail;
            console.log("----------------CC---------------");
            console.log(JSON.stringify($stateParams));
            console.log("----------------CC..---------------");
            $scope.acid=defectInfo.acId;
            $scope.ccId = $stateParams.cc.id;
            $scope.defectId = defectInfo.id;
            $scope.tlbNo = $stateParams.tlbNo || defectInfo.tlbNo;

            $rootScope.endLoading();
            $scope.completeDate = new Date();
            $scope.imgArr = [];  //页面预览所用文件
            $scope.docType = $stateParams.docType;
            $scope.initData = {
                defectNo: defectInfo.tlbNo || defectInfo.defectNo ,
                acNo: defectInfo.acReg
            };
            $scope.typeData = ['Remove', 'Install', 'Replace', 'Swap'];
            $scope.onoff={
                ongouxinlist :[],
                offgouxinlist:[],
            }
            $scope.detail = [];
            $scope.insertJson = {
                ccType: null,
                componentCCSubSet: null,
                docNo: undefined,
                offName: "",
                offPn: "",
                offPosition: "",
                offSn: "",
                cin:"",
                onAc: "",
                onName: "",
                onPn: "",
                onPosition: "",
                onSn: "",
                onAcId: "",
                onCin:"",
                remark: "",
                airMaterialState:'',
                // acNo: defectInfo.acReg
            };

            if (typeof ccinsertJson == "undefined") {
                ccinsertJson = $localForage.createInstance({
                    name: (configInfo.userCode || 'noUser') + '_ccnosubmit'
                });
            }

            var keyId = defectInfo.id + '_cc';
            /**
             * 读取数据
             */
            ccinsertJson.getItem(keyId).then(function (value) {
                if (value) {
                    $scope.pendingData = value.pendingData || {};
                } else {
                    ccinsertJson.length().then(function (numberOfKeys) {
                        if (!numberOfKeys) {
                            $localForage.removeItem('noSubmitNumber');
                        }
                    })
                }
            }).catch(function (err) {
                // This code runs if there were any errors
                console.log(err);
            });

            $scope.refChange = function (typeName) {
                $scope.typeName = typeName;
                $scope.insertJson = {};
                if (typeName == 'Remove') {
                    $scope.ccType = 1;
                    $scope.detail = null;
                } else if (typeName == 'Install') {
                    $scope.ccType = 2;
                } else if (typeName == 'Replace') {
                    $scope.ccType = 3;
                    $scope.detail = null;
                } else if (typeName == 'Swap') {
                    $scope.ccType = 4;
                }
            };

            //页面初始化时所用到的方法,根据不同条件显示编辑还是新建
            var copyInsertJson = {};
            $scope.statusData = {
                '可用件': 'USED',
                '不可用件': 'UNUSED',
                '待观察件': 'WDISPOSE'
            };
            $scope.offgouxindiandian = function (ac,pn) {
                server.maocGetReq('cc/queryCin', {
                    acId: ac,
                    pn: pn
                }).then(function (result) {
                    if(result.data.statusCode==200){
                        for(var i in result.data.data){
                            $scope.onoff.offgouxinlist.push(result.data.data[i].cin);
                        }
                    }
                }).catch(function (error) {
                    alert('失败!')
                });
            };
            $scope.ongouxindiandian = function (ac,pn) {
                server.maocGetReq('cc/queryCin', {
                    acId: ac,
                    pn: pn
                }).then(function (result) {
                    if(result.data.statusCode==200){
                        for(var i in result.data.data){
                            $scope.onoff.ongouxinlist.push(result.data.data[i].cin);
                        }
                    }
                }).catch(function (error) {
                    alert('失败!')
                });
            };

            $scope.initStatus = function () {
                $scope.clickedSubmit = false;
                if (!angular.equals($stateParams.cc, {})) { //判断是否为编辑状态
                    $scope.canEdit = false;  //页面中所有的输入框是否能编辑
                    $scope.isEdit = true;  //提交时,如果是true,需要传入id
                    $scope.offgouxindiandian($stateParams.cc.offAcId || "",angular.uppercase($stateParams.cc.offPn ||""));
                    $scope.ongouxindiandian($stateParams.cc.onAcId || "",angular.uppercase($stateParams.cc.onPn ||""));

                    $scope.ccType = $stateParams.cc.ccType;
                    $scope.typeName = $scope.typeData[$scope.ccType - 1];
                    //$scope.refChange($scope.typeName);
                    $scope.insertJson = {
                        ccType: $stateParams.cc.ccType,
                        componentCCSubSet: $stateParams.cc.tlbCompCCSubSet,
                        docNo: $stateParams.cc.docNo,
                        offName: $stateParams.cc.offName,
                        offPn: angular.uppercase($stateParams.cc.offPn),
                        offPosition: $stateParams.cc.offPosition,
                        offSn: angular.uppercase($stateParams.cc.offSn),
                        cin: $stateParams.cc.cin,
                        onAc: $stateParams.cc.onAc,
                        onName: $stateParams.cc.onName,
                        onPn: angular.uppercase($stateParams.cc.onPn),
                        onPosition: $stateParams.cc.onPosition,
                        onSn: angular.uppercase($stateParams.cc.onSn),
                        onAcId: $stateParams.cc.onAcId || "",
                        onCin: $stateParams.cc.onCin,
                        remark: $stateParams.cc.remark,
                        airMaterialState: $scope.statusData[$stateParams.cc.airMaterialState]
                    };
                    $scope.detail = $stateParams.cc.tlbCompCCSubSet;
                    copyDetail = angular.copy($scope.detail);
                    copyInsertJson = angular.copy($scope.insertJson);
                    //图片附件
                    //获取已上传附件的列表
                    server.maocGetReq('cc/findAttachmenByCCId', {ccId: $scope.ccId}).then(function (data) {
                        if (200 === data.status) {
                            console.log(JSON.stringify(data));
                            angular.forEach(data.data.data, function (item, index) {
                                if (item.type == 'mp3') {
                                    $scope.uploadSoundArr.push({
                                        soundData: item.content,
                                        type: '.mp3',
                                        length: (item.size / 1000).toFixed(1)
                                    });
                                } else {
                                    var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                    var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                    var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                    imgBlob.name = item.name.indexOf('down') == -1
                                        ? imgName + 'down' + imgType
                                        : item.name;
                                    $scope.fileArr.push(imgBlob);
                                    $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                }
                            })

                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                } else {
                    $scope.typeName = 'Install';
                    $scope.ccType = 2;
                    $scope.canEdit = true;  //页面中所有的输入框是否能编辑
                    $scope.isEdit = false;  //提交时,如果是true,需要传入id
                }
            }

            //删除CC
            $scope.delCcno = function (id) {
                event.preventDefault();
                event.stopPropagation();
                $rootScope.confirmInfo = "确定要删除此条CC吗";
                $rootScope.confirmShow = true;

                $rootScope.confirmOk = function () {
                    server.maocPostReq('cc/deleteCC', {
                        id: $scope.ccId
                    }).then(function (result) {
                        if (result.data.statusInfo == 'OK') {
                            alert('删除成功!');
                            $rootScope.go('back');
                            //$rootScope.go('searchFault.faultClose', '', {
                            //    navIdx: 2,
                            //    defectId: $scope.defectId,
                            //    pt: true
                            //});
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

            $scope.initStatus();

            //关闭CC
            $scope.closeCC = function () {
                $rootScope.startLoading();
                event.preventDefault();
                event.stopPropagation();

                server.maocPostReq('cc/closeCC', {
                    id: $scope.ccId
                }).then(function (result) {
                    if (200 === result.status) {
                        if (result.data.statusInfo == 'OK') {
                            alert('关闭成功!');
                            $rootScope.go('back');
                            // $rootScope.go('searchFault.faultClose', '', {
                            //     navIdx: 2,
                            //     defectId: $scope.defectId,
                            //     pt: true
                            // });
                        } else {
                            alert('关闭失败!')
                        }
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                    alert('关闭失败!')
                });
                return;
            }

            $scope.switchEdit = function () {
                $scope.canEdit = !$scope.canEdit;

                if (!$scope.canEdit) {
                    $scope.insertJson = copyInsertJson;
                    $scope.detail = copyDetail;
                    $scope.typeName = $scope.typeData[copyInsertJson.ccType - 1];
                    copyInsertJson = angular.copy($scope.insertJson); //始终保持值为初始值
                    copyDetail = angular.copy($scope.detail);
                }
            }

            //获取详情
            $scope.method = function () {
                if ($scope.ccType == 1 || $scope.ccType == 3) {
                    var data = {
                        "ccType": $scope.ccType,
                        "pn": $scope.insertJson.offPn,
                        "sn": $scope.insertJson.offSn,
                        "tlbCCId": $scope.ccId || ''
                    };

                    if (!$scope.insertJson.offSn || !$scope.insertJson.offPn) {
                        return;
                    }

                    server.maocGetReq('cc/findSubCompPNSNByPNSN', data).then(function (data) {
                        if (data.status == 200) {
                            var result = data.data.data;
                            var newRes = [];

                            for (var i = 0; i < result.length; i++) {
                                newRes.push(result[i]);
                                newRes[i].offPn = result[i].offPn;
                                newRes[i].offSn = result[i].offSn;
                                newRes[i].offPosition = result[i].position;
                                newRes[i].flag = 'y';
                                delete result[i].pn;
                                delete result[i].sn;
                                delete result[i].position;
                            }

                            $scope.detail = newRes;
                            copyDetail = angular.copy(newRes);
                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                }
            }



            $scope.submitMethod = function () {

                $rootScope.startLoading();
                $scope.insertJson.completeDate = $scope.completeDate;

                var params = angular.copy($scope.insertJson);
                params.completeDate =parseInt($scope.completeDate.getTime());
                params.docNo = $stateParams.docNo;
                params.ccType = $scope.ccType;
                params.componentCCSubSet = $scope.detail;
                params.tlbId = $stateParams.tlbId;
                params.flightId = defectInfo.flightId || '';
                params.referId = defectInfo.itemId || '';
                params.offPn = angular.uppercase(params.offPn);
                params.offSn = angular.uppercase(params.offSn);
                params.onPn = angular.uppercase(params.onPn);
                params.onSn = angular.uppercase(params.onSn);
                params.acNo = defectInfo.acReg
                console.log('新建cc提交的' + 'docNo==' + params.docNo);

                /*
                * doctype
                * 1-tlb，2-nrc，3-cc import，4-eo , 5 jc ,6 defect
                * */
                var docType = {
                    tlb: 1,
                    nrc: 2,
                    ccImport: 3,
                    eo: 4,
                    jc: 5,
                    defect: 6,
                    pco:7,
                    nrct:8
                };

                params.docType = docType[angular.lowercase($stateParams.docType)];

                if ($scope.isEdit) {
                    params.id = $scope.ccId;
                    $scope.clickedSubmit = true; //是否点击了提交, 没点击提交时,重新获取数据
                }

                ccinsertJson.setItem(keyId, {
                    insertJson: $scope.insertJson
                });
                server.maocFormdataPost('form/submit', 'component-001-a', params, $scope.fileArr).then(function (data) {
                    if (200 === data.status) {
                        copyInsertJson = angular.copy(params); //保持成功后的值

                        ccinsertJson.clear();
                        $scope.ccId = data.data.data[0].data.id;
                        $scope.detail = data.data.data[0].data.tlbCCSubList;
                        copyDetail = angular.copy($scope.detail);

                        if ($scope.isEdit) {
                            alert("编辑CC成功");
                        } else {
                            if (typeof data.data.data[0].data.error != 'undefined') {
                                alert('新建CC成功, ' + data.data.data[0].data.error);
                            } else if (!data.data.data[0].data.flag) {
                                alert("装上件，不在发料件序号里, 新建成功");
                            } else {
                                alert('新建成功');
                            }

                            $scope.isEdit = true;
                            //$rootScope.go('back');
                        }

                        $scope.canEdit = false;
                    } else {
                        $scope.errorInfo = data.data;
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            }

            //Android返回键单独处理,确保和点击页面返回保持一致
            //if($rootScope.android){
            //    api.removeEventListener({
            //        name: 'angularKeyback'
            //    });
            //    api.addEventListener({
            //        name: 'angularKeyback'
            //    }, function(ret, err){
            //        $rootScope.go('searchFault.faultClose', '', {
            //            navIdx: 2,
            //            defectId: $scope.defectId,
            //            pt: true
            //        });
            //    });
            //}
        }
    ]);


