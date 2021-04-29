module.exports = angular.module('myApp').controller('addNrcController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$timeout', '$filter', 'b64ToBlob',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo,$timeout, $filter, b64ToBlob) {
           $rootScope.endLoading();
            $scope.hideApproverTitle = true;
            $scope.isCreatTLB = true;
            /**
             * 图片列表
             * @type {Array}
             */
            $scope.isApiCloud = false; //上传附件时是否要用apiCloud方法
            $scope.imgArr = [];  //页面预览所用文件
            $scope.fileArr = [];  //要上传的二进制流
            $scope.attachvo = [];
            $scope.isEdit = true;
            $scope.maxImgCount = 5;
            function initInfo() {
                $scope.info = {
                    id:'',
                    mech: {
                        nameAndId: '',
                        approverSn: configInfo.userCode,
                        approverName:'',
                    },
                    report:{
                        nameAndId: '',
                        approverName:'',
                        approverSn:''
                    },
                    basic:{
                        cnDescribe:'',
                        nrcNo:'',
                        enDescribe:'',
                        flightNoInfo: {},
                        zone:'',
                        source:1,
                        skill:'',
                        cansee:'',
                        eng:"",
                        engs:[],
                        skills:[
                            {name:'请选择',value:""},
                            {name:'ME',value:"1"},
                            {name:"AV", value:"2"},
                            {name:"STR",value:"3"},
                        ],
                        itemcat:'',
                        itemcats:[
                            {name:'请选择',value:""},
                            {name:'STRUCTURE',value:"1"},
                            {name:"MINOR DEFECT", value:"2"},
                            {name:"CHK/SVC",value:"3"},
                            {name:"ACCESS",value:"5"},
                            {name:"COMPONENT",value:"6"},
                        ],
                        drDate:'',
                        // drDate: $filter('date')($scope.today, 'yyyy/MM/dd HH:mm'),
                        today: new Date(),
                    },
                    card:{
                        cardType:'',
                        cardNumber:'',
                        cardId:'',
                        sendType:'',
                        id:'',
                        nrcId:''

                    },
                    cardList:[
                        {name:'请选择',value:""},
                        {name:'TLB',value:"TLB"},
                        {name:"NRC", value:"NRC"},
                        {name:"JC",value:"JC"},
                        {name:"OTHERS",value:"OTHERS"},
                        {name:"DEFECT",value:"DEFECT"},
                    ],
                    damageInfo: {
                        checkType: "",
                        drBaseDefectViewDTOS: [],
                        operator: "SFN",
                        id:'',
                        checkMethod:'1'
                    },
                };
                $scope.oilEwisInfo = {
                    showEwis : false,
                    ewisInfo : {},
                    ewisState : -1,
                    selectedEwisIndex : -1,
                    showOil : false,
                    oilInfo : {},
                    oilState : -1,//0新建 1编辑 2详情 -1无效
                    selectedOilIndex : -1,//编辑或详情项目下标
                    oilDTO:[],
                    ewisDTO:[],
                    isHasOil:'',
                    isHasEwis:''
                };
                if($stateParams.nrcId){
                    server.maocGetReq('/nrc/queryNrcById', {nrcId:$scope.nrcId}).then(function (data) {
                        $rootScope.endLoading();
                        if (200 == data.data.statusCode) {
                            $scope.dataObj = data.data.data[0];
                            // $scope.dataObj.nrcBase.aeType = $scope.dataObj.nrcBase.aeType == 1 ? '飞机':'发动机';
                            $scope.info.id = $scope.dataObj.nrcBase.id || '';
                            $scope.info.basic.nrcNo = $scope.dataObj.nrcBase.nrcNo || '';
                            $scope.info.basic.drDate =new Date($filter('date')($scope.dataObj.nrcBase.repTime, 'yyyy/MM/dd HH:mm'));
                            $scope.info.basic.source = $scope.dataObj.nrcBase.aeType|| '';
                            $scope.info.basic.cansee = $scope.dataObj.nrcBase.defect|| '';
                            if($scope.dataObj.nrcBase.aeType == 1){
                                $scope.info.basic.flightNoInfo.pid = $scope.dataObj.nrcBase.modelEng|| '';
                                $scope.info.basic.flightNoInfo.label = $scope.dataObj.nrcBase.acEng|| '';
                                $scope.info.basic.flightNoInfo.acId = $scope.dataObj.nrcBase.ae|| '';
                                getCanSeletedEng($scope.info.basic.flightNoInfo.acId);
                            }else{
                                var engObj = {
                                    sn:$scope.dataObj.nrcBase.acEng,
                                    pn:$scope.dataObj.nrcBase.modelEng,
                                    id:$scope.dataObj.nrcBase.ae,
                                };
                                $scope.info.basic.engs = new Array(engObj);

                            }
                            $scope.info.basic.eng = $scope.dataObj.nrcBase.ae|| '';
                            $scope.info.basic.skill = $scope.dataObj.nrcBase.skill|| '';
                            $scope.info.basic.itemcat = $scope.dataObj.nrcBase.itemCat|| '';
                            $scope.info.basic.flightNoInfo.workId = $scope.dataObj.nrcBase.parentWorkId|| '';
                            $scope.info.basic.zone = $scope.dataObj.nrcBase.stazone|| '';
                            $scope.info.mech.approverSn = $scope.dataObj.nrcBase.createSn|| '';
                            $scope.info.mech.approverName = $scope.dataObj.nrcBase.createName|| '';
                            $scope.info.mech.nameAndId = $scope.dataObj.nrcBase.createName + $scope.dataObj.nrcBase.createSn;
                            $scope.info.basic.cnDescribe = $scope.dataObj.nrcBase.descChn|| '';
                            $scope.info.basic.enDescribe = $scope.dataObj.nrcBase.descEn|| '';
                            $scope.info.report.approverSn = $scope.dataObj.nrcBase.rectPlanUpdatedSn|| '';
                            $scope.info.report.approverName = $scope.dataObj.nrcBase.rectPlanUpdatedName|| '';
                            $scope.info.report.nameAndId = $scope.dataObj.nrcBase.rectPlanUpdatedName + $scope.dataObj.nrcBase.rectPlanUpdatedSn;
                            $scope.info.card.cardNumber = $scope.dataObj.nrcBase.nrcCardList[0].cardNo;
                            $scope.info.card.sendType = $scope.dataObj.nrcBase.nrcCardList[0].cardType;
                            $scope.info.card.cardType = $scope.dataObj.nrcBase.nrcCardList[0].cardType;
                            $scope.createMark = $scope.dataObj.nrcBase.nrcCardList[0].createMark || '';
                            $scope.info.card.cardId = $scope.dataObj.nrcBase.nrcCardList[0].cardId;
                            $scope.info.card.id = $scope.dataObj.nrcBase.nrcCardList[0].id;
                            $scope.info.card.nrcId = $scope.dataObj.nrcBase.nrcCardList[0].nrcId;

                            $scope.oilEwisInfo.isHasEwis = $scope.dataObj.nrcBase.isHasEwis;
                            $scope.oilEwisInfo.isHasOil = $scope.dataObj.nrcBase.isHasOil;
                            $scope.oilEwisInfo.oilDTO = $scope.dataObj.nrcBase.nrcOilList;
                            $scope.oilEwisInfo.ewisDTO = $scope.dataObj.nrcBase.nrcEwisList;
                            $scope.difPerson =  configInfo.userCode == $scope.dataObj.currentHandlerSn ? false : true;
                            var Attachments = $scope.dataObj.nrcBase.attachments;
                            var AllImgExt= ".jpg|.jpeg|.gif|.bmp|.png| "//全部图片格式类型
                            angular.forEach(Attachments,function (item,index) {
                                // var fileType = item.name.substr(item.name.lastIndexOf( ". ")).toLowerCase();
                                // var fileType = item.type.indexOf('image');
                                console.info(item.type)
                                console.info(item.type.indexOf('image'))
                                // if(typeof (item.content) != 'undefined' && AllImgExt.indexOf(fileType + "| ")!=-1) {
                                // if(typeof (item.content) != 'undefined' && fileType!=-1) {
                                if(item.type.indexOf('image') != '-1'){
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

                            });

                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        console.log(error);
                    });
                }else{
                    $scope.info.basic.drDate =new Date($filter('date')($scope.info.basic.today, 'yyyy/MM/dd HH:mm'));
                    $scope.info.basic.flightNoInfo.pid = $stateParams.fixModel|| '';
                    $scope.info.basic.flightNoInfo.label = $stateParams.fixAcreg|| '';
                    $scope.info.basic.flightNoInfo.acId = $stateParams.fixAcid|| '';
                    $scope.info.basic.flightNoInfo.workId = $stateParams.fixWorkId|| '';
                    getCanSeletedEng($scope.info.basic.flightNoInfo.acId);
                };
                console.log($scope.info.basic.flightNoInfo,'$scope.info.basic.flightNoInfo')
            }
            initInfo();
            function getCanSeletedEng(acId){
                server.maocGetReq('/comp/findEng', {'acId':acId}).then(function (data) {
                    $rootScope.endLoading();
                    if (200 == data.data.statusCode) {
                        $scope.info.basic.engs = data.data.data;
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                    console.log(error);
                });
            }

            $scope.newLine = function () {
                $scope.showConfirmState = true;
                var obj = {
                    cardType:'',
                    cardNumber:''
                };
                $scope.info.card.cardList.push(obj)
            };
            $scope.hideConfim = function () {
                $scope.showConfirmState = false;
            };
            $scope.scan = function () {
                var FNScanner = api.require('FNScanner');
                FNScanner.open({
                    autorotation: true
                }, function(ret, err) {
                    if (ret.content) {
                        var reg =  /[a-zA-Z]/g;
                        var tlbCode = ret.content.replace(reg,"");

                        $timeout(function() {

                            $rootScope.startLoading();

                            server.maocGetReq('assembly/getWorkCardNumber', {cardType:$scope.info.card.cardType,scannedBarcode:tlbCode}).then(function (data) {
                                if (data.status === 200) {
                                    console.log(data.data);
                                    $scope.info.card.cardNumber = data.data.data[0].cardNumber;
                                    $scope.info.card.sendType = data.data.data[0].cardType;
                                    $scope.info.card.cardId = data.data.data[0].cardId;

                                }
                                $rootScope.endLoading();

                            }).catch(function (error) {
                                $rootScope.endLoading();
                            });
                        });
                    }
                });
            };

            //
            $scope.$watch('info.basic.drDate',function (n,o) {
                console.log('1111'  + n);
                if (n == null) {
                    // $scope.info.basic.drDate = angular.copy($scope.info.basic.today);
                    return ;}
                if (typeof(n) == 'undefined' || n == null) { return ;}
                if (new Date($scope.info.basic.drDate).getTime() > $scope.info.basic.today.getTime()) {
                    $scope.info.basic.drDate =new Date($filter('date')($scope.info.basic.today, 'yyyy/MM/dd HH:mm'));
                    $rootScope.errTip = '开卡日期时间不能超过当前日期';
                }
            });
            $scope.$watch('info.card.cardType',function (n,o) {
                console.log('1111'  + n);
                if (n) {
                    $scope.info.card.sendType = n;
                }

            });
            $scope.submit = function (way) {
                $rootScope.startLoading();
                var formId = 'nrc-001-b';
                if(way == 'save'){
                    formId = 'nrc-001-a'
                }
                var nrcCardArray = [
                    {
                        id:$scope.info.card.id || '',
                        nrcId:$scope.info.card.nrcId || '',
                        cardType:$scope.info.card.sendType || $scope.info.card.cardType,
                        cardId:$scope.info.card.cardId || '',
                        cardNo:$scope.info.card.cardNumber,
                        createMark:$scope.createMark
                    }
                ]
                if(!$scope.info.card.cardNumber && !$scope.info.card.cardType){
                    nrcCardArray = [];
                }
                console.info($scope.info.basic.skill,'$scope.info.basic.skill');
                console.info($scope.info.basic.itemcat,'$scope.info.basic.itemCat');
                console.info($scope.info.mech,'$scope.info.mech');
                console.info($scope.info.report,'$scope.info.report');
                var data = {
                    nrcBase:{
                        id:$scope.info.id,
                        // nrcNo:'',
                        nrcNo:$scope.info.basic.nrcNo || '',
                        aeType:$scope.info.basic.source,
                        ae: $scope.info.basic.flightNoInfo.acId,
                        acEng: $scope.info.basic.flightNoInfo.label,
                        modelEng: $scope.info.basic.flightNoInfo.pid,
                        assetNum:'',
                        skill: $scope.info.basic.skill,
                        stazone:$scope.info.basic.zone,
                        itemCat:$scope.info.basic.itemcat,
                        descChn:$scope.info.basic.cnDescribe,
                        descEn:$scope.info.basic.enDescribe,
                        repTime: new Date($scope.info.basic.drDate).getTime(),
                        defect:$scope.info.basic.cansee,
                        parentWorkId:$scope.info.basic.flightNoInfo.workId,
                        // createName:$scope.info.mech.approverName,
                        // createSn:$scope.info.mech.approverSn,
                        repName:$scope.info.mech.approverName || '',
                        repSn:$scope.info.mech.approverSn,
                        rectPlanUpdatedName:$scope.info.report.approverName,
                        rectPlanUpdatedSn:$scope.info.report.approverSn,
                        isHasEwis:$scope.oilEwisInfo.isHasEwis ,
                        isHasOil:$scope.oilEwisInfo.isHasOil ,
                        nrcOilList:$scope.oilEwisInfo.oilDTO,
                        nrcEwisList:$scope.oilEwisInfo.ewisDTO,
                        // status:1,
                        nrcCardList:nrcCardArray
                    },

                };

                if($scope.info.basic.source==2){
                    data.nrcBase.ae=$scope.info.basic.eng;
                    var engs = $scope.info.basic.engs.filter(function (engId) {
                        return engId == $scope.info.basic.eng;
                    });
                    if(!!engs){
                        data.nrcBase.acEng = engs.sn;
                        data.nrcBase.modelEng = engs.pn;
                        data.nrcBase.assetNum = engs.assetNum;
                    }
                }
                var tempImg =$scope.fileArr;
                // if (tempImg.length > 0) {
                //     MEAPI.formdataPostImg('form/submit', 'nrc-001-a', data, tempImg).then(function (data) {
                //         $scope.$apply(function () {
                //             if (200 === data.statusCode) {
                //                 api.alert({
                //                     msg: '成功'
                //                 },function(ret, err) {
                //
                //                 });
                //
                //             }else{
                //                 api.alert({
                //                     // msg: data.data.body.error_description || data.data.body
                //                     msg: '失败'
                //                 });
                //             }
                //             $rootScope.endLoading();
                //         });
                //
                //     }).catch(function (error) {
                //         api.alert({
                //             msg: error.body['error_description'] || error.body
                //         });
                //         $rootScope.endLoading();
                //         $scope.$apply()
                //     });
                // } else {
                console.log(data,"post_data");
                    server.maocFormdataPost('form/submit', formId, data, tempImg).then(function (result) {
                        var msg = '提交';
                        if(way == 'save'){
                            msg = '保存'
                        }
                        if (200 === result.status) {
                            api.alert({
                                msg: msg + '成功'
                            },function(ret, err) {
                                $rootScope.go('back');
                            });
                            $scope.info.id = result.data.data[0].data;
                            console.log(result.data.data[0].data,'nrcid')
                        }else{
                            api.alert({
                                msg:  msg + '失败'
                            });
                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                }


        }    
    ]);