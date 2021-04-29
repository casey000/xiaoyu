module.exports = angular.module('myApp').controller('newccAddController',
    ['$rootScope', '$scope', '$filter', '$stateParams', '$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter, $stateParams, $interval, $localForage, configInfo, b64ToBlob, $timeout) {
            console.log("ADDCC父页面带来数据"+JSON.stringify($stateParams));
            $scope.docType = $stateParams.docType||"";
            $scope.sapTaskId = $stateParams.sapTaskId||"";
            $scope.hideApproverTitle = true;//隐藏选人默认状态
            // console.log("2222");
            $scope.typeData = ['拆下', '装上', '拆换', '串件'];
            $scope.comStatus = [
                {
                    TEXT:'可用件',
                    VALUE:'USED'
                },
                {
                    TEXT:'不可用件',
                    VALUE:'UNUSED'
                },
                {
                    TEXT:'待观察件',
                    VALUE:'WDISPOSE'
                },

            ];
            $scope.isApiCloud = false; //上传附件时是否要用apiCloud方法

            $scope.forbid = {
                showDes : false,
                refuseReasonPend : ''
            }

            $scope.fileArr = [];  //要上传的二进制流

            $scope.ongouxinlist=[];
            $scope.ongouxinRespon=[];
            $scope.offgouxinRespon=[];
            $scope.offgouxinlist=[];

            $scope.offSearchVal = '';
            $scope.onSearchVal = '';

            $scope.onPn = {
                partno:'',
                pn_typr:1,
                noBorder:true,
                description:'',
            };
            $scope.offPn = {
                partno:'',
                pn_typr:2,
                noBorder:true,
                description:''
            };
            $scope.mainPn = {
                partno:'',
                noBorder:true,
                description:''
            };

            $scope.mech = {
                nameAndId: '',
                approverSn: '',
                approverName:'',
            };
            $scope.offComponents = [];
            $scope.onComponents = [];
            $scope.prohibitList = []
            $scope.initPage = function(){
                server.maocGetReq('/assembly/analysisDomainTypeByCode', {
                    domainCode: 'AIR_MATERIAL_STATE,CC_PLAN_TYPE,CC_SOURCE_TYPE,LIFE_RAFT_PN,RELEASE_TYPE',

                }).then(function (result) {
                    if(result.data.statusCode==200){
                        $scope.mrList = result.data.data[0].AIR_MATERIAL_STATE;
                        $scope.planList = result.data.data[0].CC_PLAN_TYPE;
                        $scope.reasonList = result.data.data[0].CC_SOURCE_TYPE;
                        $scope.raftList = result.data.data[0].LIFE_RAFT_PN;
                        $scope.releaseList = result.data.data[0].RELEASE_TYPE;


                    }
                }).catch(function (error) {
                    // alert('失败!')
                });
                if(JSON.stringify($stateParams.editBase) !="{}"){
                    $scope.upWay = 'ccupWay';
                    $stateParams.editBase.completeDate =new Date($filter('date')($stateParams.editBase.completeDate, 'yyyy/MM/dd HH:mm'));
                    $scope.isEdit = true;

                    var typeObj = {
                        '1': '拆下',
                        '2': '装上',
                        '3': '拆换',
                        '4': '串件',
                    };
                    //编辑
                    $scope.insertJson = $stateParams.editBase;
                    $scope.prohibitList = $stateParams.prohibitList;
                    $scope.insertJson.onAcType = $scope.insertJson.onAcType ? $scope.insertJson.onAcType :$scope.insertJson.offAcType;
                    $scope.typeName =  typeObj[$scope.insertJson.ccType];
                    $scope.ccType = $scope.insertJson.ccType;
                    $scope.mech.approverSn = $scope.insertJson.workerId;
                    $scope.mech.approverName = $scope.insertJson.workerName;
                    $scope.onPn.partno = $scope.insertJson.onPn;
                    $scope.offPn.partno =  $scope.insertJson.offPn;
                    $scope.onPn.description = $scope.insertJson.onName;
                    $scope.offPn.description = $scope.insertJson.offName;

                    if($scope.insertJson.onAcType == 2 || $scope.insertJson.offAcType == 2 ){
                        $scope.engSn = $scope.insertJson.onModel ;
                        $scope.unitSn = $scope.insertJson.onAcId || $scope.insertJson.offAcId ;
                        $scope.mainPn.partno = $scope.insertJson.opttype;
                        $scope.snList = [
                            {
                                assetNum:$scope.unitSn,
                                sn:$scope.engSn
                            }
                        ]
                    }


                    $scope.mech.nameAndId = $scope.insertJson.workerName + '(' + $scope.insertJson.workerId + ')';

                    var obj = $stateParams.editNext;
                    if(obj.length > 0){
                        for(var i in obj){
                            if(obj[i].pPart == 'ON'){
                                obj[i].NextonPn = { partno:obj[i].offPn||'', noBorder:true};
                                obj[i].pnName = obj[i].name;
                                obj[i].sn = obj[i].onSn;
                                obj[i].id = obj[i].id || '';
                                obj[i].ccId = obj[i].ccId || '';
                                obj[i].pn = obj[i].onPn;
                                obj[i].offSn = obj[i].offSn || '';
                                obj[i].status = parseInt(obj[i].status);
                                var copyParams = angular.copy(obj[i]);
                                $scope.onComponents.push(copyParams);
                            }
                            if(obj[i].pPart == 'OFF'){
                                obj[i].NextonPn = { partno:obj[i].offPn||'', noBorder:true};
                                obj[i].pnName = obj[i].name;
                                obj[i].sn = obj[i].onSn;
                                obj[i].pn = obj[i].onPn;
                                obj[i].id = obj[i].id || '';
                                obj[i].ccId = obj[i].ccId || '';
                                obj[i].offSn = obj[i].offSn || '';
                                obj[i].status = parseInt(obj[i].status);
                                var copyParams = angular.copy(obj[i]);
                                $scope.offComponents.push(copyParams);
                            }
                        }
                    };

                    server.maocGetReq('assembly/selectFileByCategoryAndSourceId',{sourceId:$scope.insertJson.id,category:'TLB_COMP_CC'}).then(function(data){
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
                                        $scope.fileId.push(item.id);
                                        $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                    }
                                }
                            })
                        }
                    }).catch(function(error){
                        $rootScope.endLoading();
                        console.log(error);
                    });
                    var xiaData = {
                        pn: $scope.onPn.partno,
                    };
                    if($scope.insertJson.onAcType == 1){
                        xiaData.aircraft = $scope.insertJson.onModel;
                    }
                    if($scope.insertJson.onAcType == 2){
                        xiaData.equipmentId = $scope.insertJson.offAcId || $scope.insertJson.onAcId;
                    }
                    //装上组件的构型
                    server.maocPostReq('cc/getPermittedCin',xiaData,true).then(function (result) {
                        $rootScope.endLoading();
                        $scope.ongouxinlist=[];
                        // $scope.insertJson.onPosition ='';
                        if(result.data.statusCode==200){
                            $scope.ongouxinRespon = result.data.data;
                            for(var i in result.data.data){
                                $scope.ongouxinlist.push(result.data.data[i].cin);
                            }
                            $scope.insertJson.onPosition = $stateParams.editBase.onPosition;

                        }
                        $scope.ongouxinlist.push('其他');

                    }).catch(function (error) {
                        // alert('失败!')
                    });


                    //拆下组件的构型
                    var tranData = {
                        pn: $scope.offPn.partno,
                        sn: $scope.insertJson.offSn,
                        type: "B"
                    };
                    if($scope.insertJson.onAcType == 1){
                        tranData.aircraft = $scope.insertJson.onModel;
                    }
                    if($scope.insertJson.onAcType == 2){
                        tranData.equipmentId = $scope.insertJson.offAcId || $scope.insertJson.onAcId;
                        tranData.pnsnId = $scope.insertJson.offAcId || $scope.insertJson.onAcId;
                    }
                    server.maocPostReq('cc/getActualCin', tranData,true).then(function (result) {
                        $rootScope.endLoading();

                        $scope.offgouxinlist=[];
                        if(result.data.statusCode==200){
                            $scope.offgouxinRespon = result.data.data;
                            for(var i in result.data.data){
                                $scope.offgouxinlist.push(result.data.data[i].cin);
                            }
                            $scope.insertJson.offPosition = $stateParams.editBase.offPosition;

                        }
                        $scope.offgouxinlist.push('其他');
                    }).catch(function (error) {
                        // alert('失败!')
                    });


                    // initEdit($stateParams.editBase,$stateParams.editNext)

                }else{

                    $scope.isEdit = false;
                    $scope.imgArr = [];  //页面预览所用文件
                    $scope.typeName = '拆换';
                    $scope.unitSn = '';
                    $scope.ccType = 3;
                    //新增
                    $scope.insertJson = {
                        tlbId:$stateParams.tlbId,
                        tlbNo:$stateParams.tlbNo,
                        ata:$stateParams.defectInfo.ata,//章节号
                        refCcNo:'',

                        docNo:$stateParams.docNo,
                        ccType: $scope.ccType,
                        referType: "", //关联类型
                        referId:'',//关联Id

                        offAcType:1,
                        offAcId:$stateParams.defectInfo.acId,
                        flightNo:$stateParams.defectInfo.flightNo,//航班号
                        flightId:$stateParams.defectInfo.flightId,
                        onModel:$stateParams.defectInfo.acReg,//飞机号
                        reason:'',
                        remark: "",
                        takenAction:$stateParams.defectInfo.takenActionChn,//措施

                        // offName: $scope.offPn.description,
                        offName: '',
                        // offPn: $scope.offPn.partno,
                        offPn: '',
                        offPosition: "",
                        offSn: "",
                        cin:"",

                        onAcType:$stateParams.defectInfo.acId ? 1 : 2,
                        // onName: $scope.onPn.description,
                        onName: '',
                        // onPn: $scope.onPn.partno,
                        onPn: '',
                        onPosition: "",
                        onSn: "",
                        onAcId: $stateParams.defectInfo.acId,
                        onCin:"",
                        createTime: "",
                        createdId: "",
                        offAssetId:'',  //拆下资产号
                        giveBack:'',
                        defectReason:'',

                        workerId:'',
                        workerName:'',
                        completeDate:'',
                        airMaterialState:'',
                        workingReason:'',
                        planType:'',
                        completeWhere:'',
                        workorderId: '',
                        unknowSn:'N',
                        releaseType:'',
                        releaseReason:'',
                    };
                    /**
                     *   created by casey on 2020/2/26
                     *   function：  初始化新增方法
                     */
                    server.maocPostReq('/cc/initAddCcInfo',
                        {"tlbId": $stateParams.tlbId ||$stateParams.defectInfo.tlbId ||  $stateParams.editBase.tlbId, "workorderId": $stateParams.defectInfo.workorderId || $stateParams.defectInfo.jobId ||  $stateParams.editBase.workorderId},true
                    ).then(function(data) {
                        $rootScope.endLoading();
                        if(200 == data.data.statusCode) {
                            $scope.insertJson.reason =  data.data.data[0].tlbCompCc.reason;
                            $scope.insertJson.onAcType =  data.data.data[0].tlbCompCc.onAcType;
                            $scope.insertJson.offAcType =  data.data.data[0].tlbCompCc.offAcType;
                            $scope.insertJson.completeWhere =  data.data.data[0].tlbCompCc.completeWhere;
                            $scope.insertJson.tlbNo =  data.data.data[0].tlbCompCc.tlbNo;
                            $scope.insertJson.workorderId =  data.data.data[0].tlbCompCc.workorderId || '';
                            $scope.insertJson.docNo =  data.data.data[0].tlbCompCc.docNo ;
                            $scope.insertJson.flightId =  data.data.data[0].tlbCompCc.flightId ;
                            $scope.insertJson.flightNo =  data.data.data[0].tlbCompCc.flightNo ;
                            if($scope.insertJson.onAcType == 2 || $scope.insertJson.offAcType == 2 ){
                                $scope.isStationWork = true;
                                $scope.insertJson.onModel = $scope.insertJson.onModel ? $scope.insertJson.onModel:data.data.data[0].tlbCompCc.onModel;
                                $scope.insertJson.onAcId =  data.data.data[0].tlbCompCc.onAcId ;
                                $scope.insertJson.offAcId =  data.data.data[0].tlbCompCc.offAcId ;
                                $scope.engSn = $scope.insertJson.onModel ;
                                $scope.unitSn = $scope.insertJson.onAcId || $scope.insertJson.offAcId ;
                                $scope.mainPn.partno = data.data.data[0].tlbCompCc.opttype;
                                $scope.snList = [
                                    {
                                        assetNum:$scope.unitSn,
                                        sn:$scope.engSn
                                    }
                                ];
                                console.log($scope.snList)
                            }
                            // $scope.insertJson.workingReason =  data.data.data[0].tlbComCc.reason;
                            // $scope.materisList = data.data.data;
                            // $rootScope.endLoading();
                            $scope.getReasonForCco();
                        }

                    }).catch(function(error) {
                        // console.log(error);
                        // $rootScope.endLoading();
                    });

                }
            };
            $scope.initPage();

            //从CCO进来新增CC页的带进来的原因取值走下面的接口
            $scope.getReasonForCco = function(){
                // console.log($scope.sapTaskId);
                if(!!$scope.sapTaskId &&　$scope.docType.toUpperCase() == "CCO"){
                    $scope.getReasonUrl = "material/selectBySapTaskId/"+$scope.sapTaskId;
                    $rootScope.startLoading();
                    server.maocGetReq($scope.getReasonUrl,{}).then(function (data) {
                        // console.log("dddfdfdfd"+JSON.stringify(data));
                        $rootScope.endLoading();
                        if (200 === data.status) {
                            var data = data.data.data[0]||{};
                            $scope.insertJson.reason =  data.reason;
                            // console.log("dddfdfdfd"+JSON.stringify($scope.insertJson.reason));
                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        console.log(error);
                    });
                };

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


            //装上组件的构型

            $rootScope.gouxindiandian1 = function () {
                var xiaData = {
                    pn: $scope.onPn.partno,
                };
                if($scope.insertJson.onAcType == 1){
                    xiaData.aircraft = $scope.insertJson.onModel;
                }
                if($scope.insertJson.onAcType == 2){
                    xiaData.equipmentId = $scope.insertJson.offAcId || $scope.insertJson.onAcId;
                }
                $rootScope.startLoading();
                server.maocPostReq('cc/getPermittedCin', xiaData,true).then(function (result) {
                    $scope.ongouxinlist=[];
                    $scope.insertJson.onPosition ='';
                    if(result.data.statusCode==200){
                        $scope.ongouxinRespon = result.data.data;
                        for(var i in result.data.data){
                            $scope.ongouxinlist.push(result.data.data[i].cin);
                        }
                    }
                    $scope.ongouxinlist.push('其他');
                    server.maocPostReq('cc/getActualCin', {
                        // aircraft: $scope.insertJson.onModel,
                        pn: $scope.onPn.partno,
                        sn: $scope.insertJson.onSn,
                        type: "C"
                    },true).then(function (result) {
                        $rootScope.endLoading();
                        $scope.onComponents = [];
                        if(result.data.statusCode==200){
                            $scope.onComponents = result.data.data;
                            console.info($scope.onComponents,'onComponents')
                            for (var i in $scope.onComponents){
                                $scope.onComponents[i].NextonPn = { partno:'', noBorder:true,}
                                $scope.onComponents[i].status = 3;
                                $scope.onComponents[i].airMaterialState = '';
                                $scope.onComponents[i].offSn = '';
                                $scope.onComponents[i].giveBack = '';
                            }
                        }
                    }).catch(function (error) {
                        // alert('失败!')
                    });
                }).catch(function (error) {
                    // alert('失败!')
                });
                if($scope.onPn.partno && $scope.insertJson.onSn){
                    getProhibited()
                }
            };
            function getProhibited(){
                server.maocGetReq('prohibit/selectRelationByPnAndSn',{pn:$scope.onPn.partno,sn:angular.uppercase($scope.insertJson.onSn)}).then(function (data) {
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
            //拆下组件的构型 和 装上拆下的下级组件
            $rootScope.gouxindiandian2 = function () {
                $rootScope.startLoading();
                var tranData = {
                    pn: $scope.offPn.partno,
                    sn: $scope.insertJson.offSn,
                    type: "B"
                };
                if($scope.insertJson.onAcType == 1){
                    tranData.aircraft = $scope.insertJson.onModel;
                }
                if($scope.insertJson.onAcType == 2){
                    tranData.equipmentId = $scope.insertJson.offAcId || $scope.insertJson.onAcId;
                    tranData.pnsnId = $scope.insertJson.offAcId || $scope.insertJson.onAcId;
                }
                server.maocPostReq('cc/getActualCin',tranData,true).then(function (result) {
                    $scope.offgouxinlist=[];
                    $scope.insertJson.offPosition ='';
                    if(result.data.statusCode==200){
                        $scope.offgouxinRespon = result.data.data;
                        for(var i in result.data.data){
                            $scope.offgouxinlist.push(result.data.data[i].cin);
                        }
                    }
                    $scope.offgouxinlist.push('其他');
                    server.maocPostReq('cc/getActualCin', {
                        // aircraft: $scope.insertJson.onModel,
                        pn: $scope.offPn.partno,
                        sn: $scope.insertJson.offSn,
                        type: "C"
                    },true).then(function (result) {
                        $scope.offComponents = [];
                        if(result.data.statusCode==200){
                            $scope.offComponents = result.data.data;
                            console.info($scope.offComponents)
                            for (var i in $scope.offComponents){
                                $scope.offComponents[i].NextonPn = { partno:'', noBorder:true,}
                                $scope.offComponents[i].status = 3;
                                $scope.offComponents[i].airMaterialState = '';
                                $scope.offComponents[i].offSn = '';
                                $scope.offComponents[i].giveBack = '';
                            }
                        };
                        console.info($scope.offComponents,'$scope.offComponents')
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        // alert('失败!')
                    });
                }).catch(function (error) {
                    // alert('失败!')
                });


            };
            // if (typeof ccinsertJson == "undefined") {
            //     ccinsertJson = $localForage.createInstance({
            //         name: (configInfo.userCode || 'noUser') + '_ccnosubmit'
            //     });
            // }
            //
            // var keyId = defectInfo.id + '_cc';
            // /**
            //  * 读取数据
            //  */
            // ccinsertJson.getItem(keyId).then(function (value) {
            //     if (value) {
            //         $scope.pendingData = value.pendingData || {};
            //     } else {
            //         ccinsertJson.length().then(function (numberOfKeys) {
            //             if (!numberOfKeys) {
            //                 $localForage.removeItem('noSubmitNumber');
            //             }
            //         })
            //     }
            // }).catch(function (err) {
            //     // This code runs if there were any errors
            //     console.log(err);
            // });

            $scope.refChange = function (typeName) {
                $scope.typeName = typeName;
                // $scope.insertJson = {};
                if (typeName == '拆下') {
                    $scope.ccType = 1;
                    $scope.detail = null;
                } else if (typeName == '装上') {
                    $scope.ccType = 2;
                } else if (typeName == '拆换') {
                    $scope.ccType = 3;
                    $scope.detail = null;
                } else if (typeName == '串件') {
                    $scope.ccType = 4;
                }
            };
            $scope.ongouxinChange = function (value) {
                if(value == '其他'){
                    $scope.insertJson.onPosition ='';
                    $scope.onActualCin = true;
                    return;
                }
                for(var i in $scope.ongouxinRespon){
                    if($scope.ongouxinRespon[i].cin == value){
                        $scope.insertJson.onPosition = $scope.ongouxinRespon[i].location;
                        if($scope.ongouxinRespon[i].hasOwnProperty('actualCin')){
                            $scope.onActualCin = $scope.ongouxinRespon[i].actualCin;
                        }
                    }
                }
            };
            $scope.offgouxinChange = function (value) {
                if(value == '其他'){
                    $scope.insertJson.offPosition ='';
                    $scope.offActualCin = true;
                    return;
                }
                for(var i in $scope.offgouxinRespon){
                    if($scope.offgouxinRespon[i].cin == value){
                        $scope.insertJson.offPosition = $scope.offgouxinRespon[i].location;
                        if($scope.offgouxinRespon[i].hasOwnProperty('actualCin')){
                            $scope.offActualCin = $scope.offgouxinRespon[i].actualCin;
                        }

                    }
                }
            };
            //页面初始化时所用到的方法,根据不同条件显示编辑还是新建
            var copyInsertJson = {};
            $scope.statusData = {
                '可用件': 'USED',
                '不可用件': 'UNUSED',
                '待观察件': 'WDISPOSE'
            };
            $scope.$watch('insertJson.unknowSn',function (n) {
                if(n == 'Y'){
                    $scope.insertJson.offSn = ''
                }
            });
            $scope.$watch('mainPn.description',function (n) {
                if($scope.mainPn.description){
                    $scope.snList = [];
                    $scope.unitSn = '';
                    server.maocGetReq('comp/queryParentCompList', {
                        pn: $scope.mainPn.partno,
                    }).then(function (result) {
                        $scope.mainPn.description = '';
                        if(result.data.statusCode==200){
                            $scope.snList = result.data.data;
                        }
                        if(result.data.statusCode==204){
                            $rootScope.errTip = '该件号下无部件';
                        }
                    }).catch(function (error) {
                        // alert('失败!')
                    });
                }

            });
            // $scope.$watch('mainPn.description',function (n) {
            //     if(n){
            //
            //     }
            // });
            $scope.snChange = function(assetNum){
                // console.log(assetNum)
                $scope.snList.forEach(function (item) {
                    if(item.assetNum == assetNum){
                        $scope.engSn = item.sn
                        $scope.insertJson.onModel = item.sn;
                        $scope.insertJson.offAcId = item.assetNum;
                        $scope.insertJson.onAcId = item.assetNum;
                    }
                });
                // console.log($scope.engSn)
            };
            $scope.$watch('offPn.partno',function (n) {
                if(($scope.ccType == 1 || $scope.ccType == 3) && $scope.insertJson.airMaterialState == 'USED' && $scope.raftList){
                    var raftFlag = false
                    for(var i = 0 ; i < $scope.raftList.length ; i++){
                        if($scope.raftList[i].VALUE == $scope.offPn.partno){
                            raftFlag = true;
                            break;
                        }
                    }
                    if(raftFlag){
                        $scope.insertJson.giveBack = 'N'
                    }
                }
            });
            $scope.$watch('ccType',function (n) {
                if(($scope.ccType == 1 || $scope.ccType == 3) && $scope.insertJson.airMaterialState == 'USED' && $scope.raftList){
                    var raftFlag = false
                    for(var i = 0 ; i < $scope.raftList.length ; i++){
                        if($scope.raftList[i].VALUE == $scope.offPn.partno){
                            raftFlag = true;
                            break;
                        }
                    }
                    if(raftFlag){
                        $scope.insertJson.giveBack = 'N'
                    }
                }
            });
            $scope.$watch('insertJson.airMaterialState',function (n) {
                if(($scope.ccType == 1 || $scope.ccType == 3) && $scope.insertJson.airMaterialState == 'USED' && $scope.raftList){
                    var raftFlag = false
                    for(var i = 0 ; i < $scope.raftList.length ; i++){
                        if($scope.raftList[i].VALUE == $scope.offPn.partno){
                            raftFlag = true;
                            break;
                        }
                    }
                    if(raftFlag){
                        $scope.insertJson.giveBack = 'N'
                    }
                }
            });

            $scope.isRaft = function(){
                if(($scope.ccType == 1 || $scope.ccType == 3) &&
                    $scope.insertJson.airMaterialState == 'USED' &&
                    $scope.insertJson.giveBack == 'Y'
                ){
                    var raftFlag = false
                    for(var i = 0 ; i < $scope.raftList.length ; i++){
                        if($scope.raftList[i].VALUE == $scope.offPn.partno){
                            raftFlag = true;
                            break;
                        }
                    }
                    if(raftFlag){
                        $rootScope.confirmInfo = "请确认救生筏是否需要退回航材库房";
                        $rootScope.confirmShow = true;
                        $rootScope.confirmOk = function () {
                            $scope.submitMethod();
                        };
                    }else{
                        $scope.submitMethod();
                    }
                }else{
                    $scope.submitMethod()
                }

            };
            /**
            *   created by casey on 2020/2/25
            *   function：  新建CC
            */
            $scope.submitMethod = function () {
                // if($scope.ccType == 4){

                // }
                // if($scope.prohibitList.length > 0 && $scope.prohibitList[0].prohibitedMark == 'JZ'){
                //     $rootScope.errTip = '禁装件不允许装上飞机';
                //     return
                // }
                // if($scope.prohibitList.length > 0 && $scope.prohibitList[0].prohibitedMark != 'JZ'){
                //     if(!$scope.insertJson.releaseType){
                //         $rootScope.errTip = '放行类型必填';
                //         return
                //     }
                // }
                if($scope.prohibitList.length > 0 && $scope.prohibitList[0].prohibitedMark != 'JZ'){
                    if(!$scope.insertJson.releaseReason){
                        $rootScope.errTip = '放行理由必填';
                        return
                    }
                }
                if($scope.insertJson.onAcType == 2 || $scope.insertJson.offAcType == 2) {
                    if(!$scope.mainPn.partno){
                        $rootScope.errTip = '部件件号必填';
                        return
                    }
                    if(!$scope.unitSn){
                        $rootScope.errTip = '部件序号必填';
                        return
                    }
                }
                if($scope.ccType != 2){
                    if(!$scope.offPn.partno){
                        $rootScope.errTip = '拆下件号必填';
                        return
                    }
                    if(!$scope.insertJson.cin){
                        $rootScope.errTip = '拆下构型必填';
                        return
                    }
                    if(!$scope.insertJson.offPosition){
                        $rootScope.errTip = '拆下位置必填';
                        return
                    }
                    if(!$scope.insertJson.giveBack && $scope.ccType != 4){
                        $rootScope.errTip = '拆下是否退料必填';
                        return
                    }
                    if($scope.ccType == '1' || $scope.ccType == '3'){
                        if($scope.insertJson.unknowSn != 'Y' && !$scope.insertJson.offSn){
                            $rootScope.errTip = '拆下序号必填';
                            return
                        }
                    }
                    if($scope.ccType == '4'){
                        if(!$scope.insertJson.offSn){
                            $rootScope.errTip = '拆下序号必填';
                            return
                        }
                    }
                }
                if($scope.ccType != 1){
                    if(!$scope.onPn.partno){
                        $rootScope.errTip = '装上件号必填';
                        return
                    }
                    if(!$scope.insertJson.onCin){
                        $rootScope.errTip = '装上构型必填';
                        return
                    }
                    if(!$scope.insertJson.onPosition){
                        $rootScope.errTip = '装上位置必填';
                        return
                    }
                    if(!$scope.insertJson.onSn){
                        $rootScope.errTip = '装上序号必填';
                        return
                    }
                }
                if(($scope.ccType == 1 || $scope.ccType == 3)&& $scope.insertJson.giveBack == 'Y'&& ($scope.insertJson.defectReason|| '').trim() == ''){
                    $rootScope.errTip = '拆下挂签里的拆下故障原因必填';
                    return
                };
                if(!$scope.insertJson.planType){
                    $rootScope.errTip = '计划性必填';
                    return
                }
                if(!$scope.insertJson.workingReason && $scope.ccType == 1 && $scope.ccType == 3){
                    $rootScope.errTip = '拆换原因必填';
                    return
                }
                if(!$scope.insertJson.planType && $scope.ccType == 1 && $scope.ccType == 3){
                    $rootScope.errTip = '航材状态必填';
                    return
                }
                if(!$scope.mech.approverName){
                    $rootScope.errTip = '工作者必填';
                    return
                }
                if(!$scope.insertJson.completeDate){
                    $rootScope.errTip = '拆换时间必填';
                    return
                }
                if(($scope.insertJson.reason || '').trim() == ''){
                    $rootScope.errTip = '原因描述必填';
                    return
                }
                if(($scope.insertJson.takenAction || '').trim() == ''){
                    $rootScope.errTip = '措施必填';
                    return
                }

                // if(($scope.onPn.partno == $scope.offPn.partno) && ($scope.insertJson.offSn == $scope.insertJson.onSn)){
                //     $rootScope.errTip = '同一部件应通过拆下和装上两个CC来完成';
                //     return;
                // }
                if($scope.ccType == 3 && ( $scope.onPn.partno != $scope.offPn.partno)){
                    if(!confirm("装上件和拆下件不一致，请确认装上件是否满足IPC适用性。")){
                        return;
                    }
                }
                $rootScope.startLoading();
                if($scope.insertJson.onAcType == 2 || $scope.insertJson.offAcType == 2){
                    $scope.insertJson.offAcType = 2;
                    $scope.insertJson.onAcType = 2;
                    $scope.insertJson.onModel = $scope.engSn;
                    $scope.insertJson.onAcId = $scope.unitSn;
                    $scope.insertJson.offAcId = $scope.unitSn;
                    $scope.insertJson.opttype = $scope.mainPn.partno;
                }

                // $scope.insertJson.completeDate = $scope.completeDate;
                var params = angular.copy($scope.insertJson);
                params.completeDate =parseInt(params.completeDate.getTime());
                params.ccType = $scope.ccType;
                params.workerId = $scope.mech.approverSn;
                params.workerName = $scope.mech.approverName;
                params.onPn = $scope.onPn.partno;
                params.offPn = $scope.offPn.partno;
                params.onName = $scope.onPn.description;
                params.offName = $scope.offPn.description;

                /*
                * doctype
                * {1: 'TLB', 2: 'NRC', 3: 'CC', 4: 'EO', 5: 'JC', 6: 'Defect', 7: 'PCO', 8: 'NRCT', 9: 'TO', 10: 'DDREVIEW', 11: 'CCO'};
                * */
                var docType = {
                    tlb: 1,
                    nrc: 2,
                    cc: 3,
                    eo: 4,
                    jc: 5,
                    defect: 6,
                    pco:7,
                    nrct:8,
                    to:9,
                    ddreview:10,
                    cco:11
                };


                if (!$scope.isEdit) {
                    params.docType = docType[angular.lowercase($stateParams.docType)];
                }

                // ccinsertJson.setItem(keyId, {
                //     insertJson: $scope.insertJson
                // });
                var subData = {
                    tlbCompCcSubList : [],
                    tlbCompCc : params
                };
                // $scope.offComponents = [];
                // $scope.onComponents = [];
                if ($scope.offComponents.length > 0){
                    for (var i in $scope.offComponents) {
                        var subObj = {};
                        subObj.name = $scope.offComponents[i].pnName;
                        subObj.onPn = $scope.offComponents[i].pn;
                        subObj.onSn = $scope.offComponents[i].sn;
                        subObj.offPn = $scope.offComponents[i].NextonPn.partno;
                        subObj.offSn = $scope.offComponents[i].offSn;
                        subObj.status = $scope.offComponents[i].status;
                        subObj.giveBack = $scope.offComponents[i].giveBack;
                        subObj.id = $scope.offComponents[i].id;
                        subObj.ccId = $scope.offComponents[i].ccId;
                        subObj.pPart = 'OFF';
                        subObj.airMaterialState =  $scope.offComponents[i].airMaterialState;
                        if (subObj.status != 2) {
                            subObj.offPn = '';
                            subObj.offSn = '';
                        }
                        if (subObj.status == 3) {
                            subObj.airMaterialState = '';
                        }
                        subData.tlbCompCcSubList.push(subObj);
                    }
                };
                if ($scope.onComponents.length > 0){
                    for (var i in $scope.onComponents) {
                        var subObj = {};
                        subObj.offPn = $scope.onComponents[i].NextonPn.partno;
                        subObj.name = $scope.onComponents[i].pnName;
                        subObj.onPn = $scope.onComponents[i].pn;
                        subObj.onSn = $scope.onComponents[i].sn;
                        subObj.offSn = $scope.onComponents[i].offSn;
                        subObj.status = $scope.onComponents[i].status;
                        subObj.giveBack = $scope.onComponents[i].giveBack;
                        subObj.id = $scope.onComponents[i].id;
                        subObj.ccId = $scope.onComponents[i].ccId;
                        subObj.pPart = 'ON';
                        subObj.airMaterialState =  $scope.onComponents[i].airMaterialState;
                        if (subObj.status != 2) {
                            subObj.offPn = '';
                            subObj.offSn = '';
                        }
                        if (subObj.status == 3) {
                            subObj.airMaterialState = '';
                        }
                        subData.tlbCompCcSubList.push(subObj);
                    }
                }
                console.log("CC提交subData的数据"+JSON.stringify(subData));
                // console.log(subData,'subData');
                if($scope.isEdit){
                    if($scope.insertJson.middleStatus == 'C'){
                        server.maocPostReq("cc/updateAndSubmit", subData, true).then(function (result) {
                            if (result.status == 200){
                                if (200 === result.data.statusCode) {
                                    alert('提交成功');
                                    $rootScope.go('back')
                                }
                                if(result.data.statusCode > 50000){
                                    $rootScope.isYes = true; //值为true时,显示的按钮为'是/否'
                                    $rootScope.confirmInfo = result.data.statusInfo + ";是否强行提交本条数据到SAP(后续运维人员会跟进)";
                                    $rootScope.confirmShow = true;

                                    $rootScope.confirmOk = function () {
                                        $rootScope.confirmShow = false;
                                        $rootScope.isYes = false;
                                        $rootScope.startLoading();
                                        server.maocGetReq('cc/forciblyClose',{id:$stateParams.editBase.id,code:result.data.statusCode}).then(function (result) {
                                            if (200 === result.status) {
                                                alert('提交成功');
                                                $rootScope.go('back')
                                            }
                                            $rootScope.endLoading();
                                        }).catch(function (error) {
                                            $rootScope.endLoading();
                                            $rootScope.isYes = false;
                                        });
                                    };

                                }else if(data.data.statusCode != 200){
                                    $rootScope.errTip = data.data.statusInfo;
                                }
                            }

                            $rootScope.endLoading();
                        }).catch(function (error) {
                            $rootScope.endLoading();
                        });
                    }else{
                        server.maocPostReq("cc/update", subData, true).then(function (result) {
                            if (200 === result.status) {
                                alert('编辑CC成功');
                                $rootScope.go('back')
                            }
                            $rootScope.endLoading();
                        }).catch(function (error) {
                            $rootScope.endLoading();
                        });
                    }

                }else{
                    server.maocFormdataPost('form/submit', 'component-001-add', subData, $scope.fileArr).then(function (data) {
                        if (200 === data.status) {
                            // copyInsertJson = angular.copy(params); //保持成功后的值
                            // ccinsertJson.clear();
                            $scope.ccId = data.data.data[0].data.id;
                            $scope.detail = data.data.data[0].data.tlbCCSubList;
                            copyDetail = angular.copy($scope.detail);
                            alert('新建CC成功');
                            $rootScope.go('back');

                            $scope.canEdit = false;
                        } else {
                            $scope.errorInfo = data.data;
                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                }
            };

            $scope.goComponents = function (index) {
                index == 1 ? $scope.offSubComponents = true : $scope.onSubComponents = true

            };
            $scope.cancelCom = function(type){
                if(type == 'on'){
                    for(var i in $scope.onComponents){
                        if($scope.onComponents[i].status == '1' && !$scope.onComponents[i].airMaterialState ){
                            alert('有航材状态未填写');
                            return
                        }
                        if($scope.onComponents[i].status == '2' && !$scope.onComponents[i].airMaterialState ){
                            alert('有航材状态未填写');
                            return
                        }
                        if($scope.onComponents[i].status == '2' && !$scope.onComponents[i].NextonPn.partno){
                            alert('有对应装上件号未填写');
                            return
                        }
                        if($scope.onComponents[i].status == '2' && !$scope.onComponents[i].offSn){
                            alert('有对应装上序号未填写');
                            return
                        }
                        if($scope.onComponents[i].status != '3' && !$scope.onComponents[i].giveBack){
                            alert('是否退料未填写');
                            return
                        }
                    };
                    $scope.onSubComponents = false;
                }
                if(type == 'off'){
                    for(var i in $scope.offComponents){
                        // console.info($scope.offComponents[i].status)
                        // console.info($scope.offComponents[i].airMaterialState)
                        if($scope.offComponents[i].status == '1' && !$scope.offComponents[i].airMaterialState ){
                            alert('有航材状态未填写');
                            return
                        }
                        if($scope.offComponents[i].status == '2' && !$scope.offComponents[i].airMaterialState ){
                            alert('有航材状态未填写');
                            return
                        }
                        if($scope.offComponents[i].status == '2' && !$scope.offComponents[i].NextonPn.partno){
                            alert('有对应装上件号未填写');
                            return
                        }
                        if($scope.offComponents[i].status == '2' && !$scope.offComponents[i].offSn ){
                            alert('有对应装上序号未填写');
                            return
                        }
                        if($scope.offComponents[i].status != '3' && !$scope.offComponents[i].giveBack){
                            alert('是否退料未填写');
                            return
                        }
                    };
                    $scope.offSubComponents = false;
                }
            };
            $scope.keyEvent = function () {

            };

        }
    ]);


