module.exports = angular.module('myApp').controller('pendToNrcController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$timeout', '$filter', 'b64ToBlob',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo,$timeout, $filter, b64ToBlob) {
           $rootScope.endLoading();
            var scope = $scope;
            $scope.isCreatTLB = true;
            $scope.hideApproverTitle = true;

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
            console.info($stateParams,'params');

            $scope.info = {
                // id:'',
                withEng:'',
                mech: {
                    nameAndId: '',
                    approverSn: configInfo.userCode,
                    approverName:'',
                },
                nrcBase:{
                    descChn:'',
                    descEn:'',
                    ae:'',
                    aeType:1,
                    acEng:'',
                    repTime:'',
                    modelEng:'',  //小机型

                    repName:'',
                    repSn:'',

                    rectPlanUpdatedName:'',
                    rectPlanUpdatedSn:'',

                    skill: '',
                    stazone:'',
                    itemCat:'',
                    defect:'',

                    nrcCardList:[
                        {
                            cardType:'DEFECT',
                            cardId:'',
                            cardNo:'',
                        }
                    ]
                },
                // report:{
                //     nameAndId: '',
                //     approverName:'',
                //     approverSn:''
                // },
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
            function initInfo() {
                $rootScope.startLoading();
                //开始获取TO
                server.maocGetReq('defect/getToNrcInfo', {defectId: $stateParams.defectDetail.id}).then(function (data) {
                    if (200 === data.status) {
                        scope.info.nrcBase.descChn = data.data.data[0].faultReportChn;
                        scope.info.nrcBase.descEn = data.data.data[0].faultReportEng;
                        scope.info.nrcBase.ae = data.data.data[0].acId;
                        getCanSeletedEng(scope.info.nrcBase.ae);
                        scope.info.nrcBase.acEng = data.data.data[0].acReg;
                        scope.info.nrcBase.modelEng = data.data.data[0].minorModel;
                        scope.info.nrcBase.repName = data.data.data[0].reporterName;
                        scope.info.nrcBase.repSn = data.data.data[0].reporterSn;
                        scope.info.nrcBase.repTime = data.data.data[0].cardDate;
                        scope.info.nrcBase.nrcCardList[0].cardNo = data.data.data[0].defectNo;
                        scope.info.nrcBase.nrcCardList[0].cardId = data.data.data[0].id;

                        scope.tlbTechLog = data.data.data[0].tlbTechLog ?  data.data.data[0].tlbTechLog :'';
                        scope.tlbTechLog && appendObj(scope.tlbTechLog)
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });


                console.log($scope.info.basic.flightNoInfo,'$scope.info.basic.flightNoInfo')
            }
            initInfo();

            $scope.engChange = function (data) {
                for(var i in $scope.info.basic.engs){
                    if($scope.info.basic.engs[i].id == data){
                        $scope.engSn = $scope.info.basic.engs[i].sn;
                        $scope.engPn = $scope.info.basic.engs[i].pn;
                    }
                }
            }
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
            function appendObj(obj){
                console.info(obj,'obj');
                var apdObj =  {
                    cardType:'TLB',
                    cardId:obj.tlbId,
                    cardNo:obj.tlbNo,
                };
                scope.info.nrcBase.nrcCardList.push(apdObj);

            }
            $scope.submit = function () {
                // console.info(scope.info.nrcBase,'23')
                $rootScope.startLoading();
                var formId = 'nrc-001-tonrc';
                var data = new Object();
                data.nrcBase = scope.info.nrcBase;
                if(scope.info.nrcBase.aeType == 2){
                    data.nrcBase.ae = scope.info.withEng;
                    data.nrcBase.acEng = scope.engSn;
                    data.nrcBase.modelEng = scope.engPn;
                }
                data.nrcBase.rectPlanUpdatedName = scope.info.mech.approverName;
                data.nrcBase.rectPlanUpdatedSn = scope.info.mech.approverSn;
                data.nrcBase.isHasEwis = $scope.oilEwisInfo.isHasEwis ;
                data.nrcBase.isHasOil = $scope.oilEwisInfo.isHasOil ;
                data.nrcBase.nrcOilList = $scope.oilEwisInfo.oilDTO;
                data.nrcBase.nrcEwisList = $scope.oilEwisInfo.ewisDTO;
                var tempImg =$scope.fileArr;

                server.maocFormdataPost('form/submit', formId, data, tempImg).then(function (result) {
                    var msg = '提交';
                    if (200 === result.status) {
                        api.alert({
                            msg: msg + '成功'
                        },function(ret, err) {
                            scope.tlbTechLog && ($rootScope.errTip = '请填写排故措施关闭故障');
                            $rootScope.go('back');
                        });
                    }
                    // else{
                    //     api.alert({
                    //         msg:  msg + '失败'
                    //     });
                    // }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            }


        }    
    ]);