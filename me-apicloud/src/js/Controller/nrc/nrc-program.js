module.exports = angular.module('myApp').controller('nrcProgramController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$timeout', '$filter', 'b64ToBlob','checkDmInfo',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo,$timeout, $filter, b64ToBlob,checkDmInfo) {
            $scope.hideApproverTitle = true;
            $scope.isCreatTLB = true;
            $scope.showInfo = false;
            /**
             * 图片列表
             * @type {Array}
             */
            if($stateParams.nrcId){
                $scope.nrcId = $stateParams.nrcId;
                $rootScope.nrcId = $stateParams.nrcId;
            }else{
                $scope.nrcId = $rootScope.nrcId;
            };



            function initInfo() {
                $scope.noticesType ="";
                $scope.reasonType = "",
                $scope.addtoolFlow = false ;
                $scope.nrcTaskNo = '' ;
                $scope.nrcTaskId = '' ;
                $scope.isApiCloud = false; //上传附件时是否要用apiCloud方法
                $scope.taskEdit = true; //nrcTask 是否编辑

                $scope.requestCheck = false; //工具航材下面内容的必填校验标识
                $scope.susPendCheck = false; //推迟下面内容的必填校验标识


                $scope.imgArr = [];  //页面预览所用文件
                $scope.fileArr = [];  //要上传的二进制流

                $scope.imgArr2 = []; //页面预览所用文件
                $scope.fileArr2 = [];  //要上传的二进制流
                $scope.fileId2 = [];


                // $scope.imgArrTask = ["blob:file:///7f0a799e-04e8-44bd-addb-c90c0657b0af","blob:file:///275b667c-eb27-485b-9792-7ff2d08fa71d"];  //页面预览所用文件
                $scope.imgArrTask = [];  //页面预览所用文件
                $scope.fileArrTask = [];  //要上传的二进制流
                $scope.fileId = [];

                $scope.taskupWay = 'nrcTask';  //要上传的二进制流
                $scope.nrcupWay = 'nrc';  //要上传的二进制流


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
                    program:{
                        cause:'',
                        isSuspending:'',    //是都suspending
                        timeWay:'',         //时限类型（软或硬）
                        fh:'',
                        fc:'',
                        inOrder:'',         //先后
                        snInput:'',         //nrc 推迟的sn输入
                        pnInput:'',         //nrc 推迟的pn输入
                        days:'',
                        nrcTask:{
                            chn:'',
                            en:'',
                            mrRequest:'',
                            repIpc:'',
                            interval:'',
                            toolDto:[],
                            mrDto:[],
                            fh:'',
                            fc:'',
                            aa:'',
                            cc:'',
                            days:'',
                            status:'',
                            revNo:'',
                        },
                        repeat:'',
                        repIpc:'',
                        nrcPn:{},
                        toolDto:[],
                        mrDto:[],
                        ata:'',
                        rii:"",
                        rci:"",
                        dm:"",
                        tellPl:"",
                        feedback:"",
                        person:"",
                        hour:"",
                        chn:"",
                        en:"",
                        selectedFlawTypesItems:[],
                        tool:{

                        },
                        approver:{
                            nameAndId: '',
                            approverName:'',
                            approverSn:'',
                            approverId:'',
                        },
                        toolTips:'',
                        UnitList:[

                        ],
                        toolIndex:'',
                        mrUnitList:[

                        ],
                        toolPN:'',
                        toolNumber:'',
                        toolUnit:'',
                        mrPN:'',
                        mrNumber:'',
                        mrUnit:'',
                        mrTips:'',
                        mrBeiliao:'',
                        checkMethods:[
                            // {name:'运行飞机串件',value:"1"},
                            {name:"机组操作", value:"2"},
                            // {name:"影响地服推行",value:"3"},
                            {name:"影响机组飞行品质",value:"4"},
                            {name:"液体渗漏",value:"5"},
                            {name:"10天（20FC/30FH）内纠正",value:"6"},
                            {name:"其他",value:"7"},
                            {name:"货舱装载系统缺陷",value:"8"},
                            {name:"下货舱门开关缺陷",value:"9"},
                            {name:"烤箱烧水杯故障",value:"10"},
                            {name:"厕所排放系统缺陷",value:"11"},
                        ],
                        timeRoads:[
                            {name:'FH/FC/DAYS',value:"1"},
                            {name:"NEXT C", value:"2"},
                            {name:"送修时执行",value:"3"},
                        ],

                        timeRoad:'',            //时限类别
                        softSets:[
                            {name:'90天',value:"1"},
                            {name:"120天", value:"2"},
                            {name:"180天",value:"3"},
                            {name:"NEXT C",value:"4"},
                            {name:"换发时执行",value:"5"},
                            {name:"送修时执行",value:"6"},
                        ],
                        softSet:'',             //软时限设置
                        runway:'',              //运行分类
                        flawTypes:[
                            {
                                name:'进入燃油箱 ENTER FUEL TANK',
                                selected:false,
                                value:1
                            },
                            {
                                name:'特殊接近 SPECIAL CLOSE',
                                selected:false,
                                value:2
                            },
                            {
                                name:'顶升飞机 LIFT AIRCRAFT',
                                selected:false,
                                value:3
                            },
                            {
                                name:'试车',
                                selected:false,
                                value:4
                            },
                            {
                                name:'试大车',
                                selected:false,
                                value:5
                            },
                            {
                                name:'高空车',
                                selected:false,
                                value:6
                            },
                            {
                                name:'其他特殊要求 OTHER SPECIAL REQUEST',
                                selected:false,
                                value:7
                            },
                            {
                                name:'N/A',
                                selected:false,
                                value:8
                            },
                        ],
                        noticesType:'',
                        notices:$scope.noticesType.length > 0 ? $scope.noticesType.split(',') : [],//数字数组

                        suspendTypes:[
                            {
                                name:'TS',
                                selected:false,
                                value:1
                            },
                            {
                                name:'MATERIAL',
                                selected:false,
                                value:2
                            },
                            {
                                name:'SPEC.TOOLS',
                                selected:false,
                                value:3
                            },
                            {
                                name:'TIME LIMIT',
                                selected:false,
                                value:4
                            },
                            {
                                name:'其他OTHERS',
                                selected:false,
                                value:5
                            },
                        ],
                        selectedReasons:[],
                        reasons:$scope.reasonType.length > 0 ? $scope.reasonType.split(',') : [],//数字数组

                        // notices:[],//数字数组
                        showOtherFlawTxt:false,
                        showReasonOther:false,

                        otherText:'',
                        otherReasonText:'',
                        mrRequest:'',
                        shenpi:{},
                        isHasTool:false,
                        isHasMr:false,
                        toolXiugai:false,

                    },
                    basic:{
                        cnDescribe:'',
                        enDescribe:'',
                        flightNoInfo: {},
                        zone:'',
                        source:1,
                        skill:'',
                        cansee:'',
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

                    },
                    cardList:[
                        {name:'请选择',value:""},
                        {name:'TLB',value:"TLB"},
                        {name:"NRC", value:"NRC"},
                        {name:"JC",value:"JC"},
                        {name:"OTHERS",value:"OTHERS"},
                        {name:"DEFECT",value:"DEFECT"},
                    ],
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
                    oilDTO:{},
                    ewisDTO:{},
                    isHasOil:'',
                    isHasEwis:''
                };
                if($stateParams.nrcId){
                    server.maocGetReq('/nrc/queryNrcById', {nrcId:$scope.nrcId}).then(function (data) {
                        // console.log(JSON.stringify(data),'12323');
                        $rootScope.endLoading();
                        if (200 == data.data.statusCode) {
                            $scope.dataObj = data.data.data[0];
                            // $scope.dataObj.nrcBase.aeType = $scope.dataObj.nrcBase.aeType == 1 ? '飞机':'发动机';
                            $scope.nrcTaskNo = $scope.dataObj.nrcTaskNo || '';
                            if($scope.nrcTaskNo){
                                $scope.info.program.isSuspending = 'y';
                                $scope.info.program.repeat = 1
                            }
                            $scope.info.program.nrcTask.nrcTaskNo = $scope.dataObj.nrcTaskNo || '';
                            $scope.info.program.nrcTask.status = $scope.dataObj.nrcTaskStatus || '';
                            $scope.info.id = $scope.dataObj.nrcBase.id || '';
                            $scope.info.basic.drDate =new Date($filter('date')($scope.dataObj.nrcBase.repTime, 'yyyy/MM/dd HH:mm'));
                            $scope.info.basic.flightNoInfo.pid = $scope.dataObj.nrcBase.modelEng|| '';
                            $scope.acModel = !!$scope.dataObj.nrcBase.modelEng?$scope.dataObj.nrcBase.modelEng.slice(0,4):'';
                            $scope.info.basic.source = $scope.dataObj.nrcBase.aeType|| '';
                            $scope.info.basic.flightNoInfo.label = $scope.dataObj.nrcBase.acEng|| '';
                            $scope.info.basic.cansee = $scope.dataObj.nrcBase.defect|| '';
                            $scope.info.basic.flightNoInfo.acId = $scope.dataObj.nrcBase.ae|| '';
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

                            $scope.info.program.ata = $scope.dataObj.nrcBase.ata;
                            $scope.info.program.rci = $scope.dataObj.nrcBase.rci;
                            $scope.info.program.rii = $scope.dataObj.nrcBase.rii;
                            $scope.info.program.dm = $scope.dataObj.nrcBase.dm;
                            $scope.info.program.tellPl = $scope.dataObj.nrcBase.feedbackAircrew;
                            $scope.info.program.feedback = $scope.dataObj.nrcBase.feedbackTo;
                            $scope.info.program.person = $scope.dataObj.nrcBase.planningmhPerson;
                            $scope.info.program.hour = $scope.dataObj.nrcBase.planningmhHour;
                            $scope.info.program.notices = ($scope.dataObj.nrcBase.attentionType && $scope.dataObj.nrcBase.attentionType.split(','));
                            if($scope.dataObj.nrcBase.attentionType){
                                $scope.noticesChanged()
                            }
                            $scope.info.program.otherText = $scope.dataObj.nrcBase.attentionDesc;
                            $scope.info.program.chn = $scope.dataObj.nrcBase.rectChn || '';
                            $scope.info.program.en = $scope.dataObj.nrcBase.rectEn || '';
                            $scope.info.program.mrRequest = $scope.dataObj.nrcBase.mtrYn;
                            $scope.info.program.repIpc = $scope.dataObj.nrcBase.mtrIpc || '';
                            $scope.info.program.isSuspending = $scope.dataObj.nrcBase.isSuspending;
                            if($scope.dataObj.nrcBase.suspending){
                                // $scope.info.program.approver.approverName = $scope.dataObj.nrcBase.suspending.hoName;
                                // $scope.info.program.approver.approverSn = $scope.dataObj.nrcBase.suspending.hoSn;
                                // $scope.info.program.approver.nameAndId = $scope.dataObj.nrcBase.suspending.hoName + $scope.dataObj.nrcBase.suspending.hoSn;
                                $scope.info.program.repeat = $scope.dataObj.nrcBase.isrepeat;
                                $scope.info.program.reasons = $scope.dataObj.nrcBase.suspending.hoReason.split(',');
                                $scope.reasonChanged();
                                $scope.info.program.otherReasonText = $scope.dataObj.nrcBase.suspending.hoReasonOther|| '';
                                $scope.info.program.runway = $scope.dataObj.nrcBase.suspending.runCategory;
                                $scope.info.program.timeWay = $scope.dataObj.nrcBase.suspending.timeLimitType;
                                $scope.info.program.softSet = $scope.dataObj.nrcBase.suspending.adviseDoTimeType;
                                $scope.info.program.inOrder = $scope.dataObj.nrcBase.suspending.firstLast;
                                $scope.info.program.cause = $scope.dataObj.nrcBase.suspending.manualOrTechnical;
                                $scope.info.program.fh = $scope.dataObj.nrcBase.suspending.fh || '';
                                $scope.info.program.fc = $scope.dataObj.nrcBase.suspending.fc || '';
                                $scope.info.program.days = $scope.dataObj.nrcBase.suspending.days || '';
                                $scope.info.program.timeRoad = $scope.dataObj.nrcBase.suspending.hardTimeType;
                                $scope.info.program.pnInput = $scope.dataObj.nrcBase.suspending.pn || '';
                                $scope.info.program.snInput = $scope.dataObj.nrcBase.suspending.sn || '';

                                for(var i = 0 ; i < $scope.dataObj.nrcBase.nrcMtrList.length;i++){
                                   if($scope.dataObj.nrcBase.nrcMtrList[i].mrType == 1){
                                       $scope.info.program.toolDto.push($scope.dataObj.nrcBase.nrcMtrList[i]);
                                   }else{
                                       $scope.info.program.mrDto.push($scope.dataObj.nrcBase.nrcMtrList[i]);
                                   }
                                };
                            }



                            $scope.oilEwisInfo.isHasEwis = $scope.dataObj.nrcBase.isHasEwis;
                            $scope.oilEwisInfo.isHasOil = $scope.dataObj.nrcBase.isHasOil;
                            $scope.oilEwisInfo.oilDTO = $scope.dataObj.nrcBase.nrcOilList;
                            $scope.oilEwisInfo.ewisDTO = $scope.dataObj.nrcBase.nrcEwisList;
                            $scope.difPerson =  configInfo.userCode == $scope.dataObj.currentHandlerSn ? false : true;
                            var Attachments = $scope.dataObj.nrcBase.attachments;
                            var AttachmentsBuchong = $scope.dataObj.nrcBase.nueAttachments;
                            var AllImgExt= ".jpg|.jpeg|.gif|.bmp|.png| "//全部图片格式类型
                            angular.forEach(Attachments,function (item,index) {
                                // var fileType = item.name.substr(item.name.lastIndexOf( ". ")).toLowerCase();
                                // var fileType = item.type.indexOf('image');
                                console.info(item.type)
                                console.info(item.type.indexOf('image'))
                                // if(typeof (item.content) != 'undefined' && AllImgExt.indexOf(fileType + "| ")!=-1) {
                                // if(typeof (item.content) != 'undefined' && fileType!=-1) {
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
                            });


                            angular.forEach(AttachmentsBuchong,function (item,index) {
                                // var fileType = item.name.substr(item.name.lastIndexOf( ". ")).toLowerCase();
                                // var fileType = item.type.indexOf('image');
                                // if(typeof (item.content) != 'undefined' && AllImgExt.indexOf(fileType + "| ")!=-1) {
                                // if(typeof (item.content) != 'undefined' && fileType!=-1) {
                                if(typeof (item.content) != 'undefined') {
                                    var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                    var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                    var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                    imgBlob.name = item.name.indexOf('down') == -1
                                        ? imgName + 'down' + imgType
                                        : item.name;
                                    imgBlob.id = item.id;
                                    $scope.fileId2.push(item.id);
                                    $scope.fileArr2.push(imgBlob);
                                    $scope.imgArr2.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                }
                            });
                            console.info($scope.dataObj,'返回值')
                        }
                        $scope.initAirEngineForAta();
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        console.log(error);
                    });

                }else{
                    $scope.info.basic.drDate =new Date($filter('date')($scope.info.basic.today, 'yyyy/MM/dd HH:mm'));
                    $scope.info.basic.flightNoInfo.pid = $stateParams.fixModel|| '';
                    $scope.acModel = !!$scope.dataObj.nrcBase.modelEng?$scope.dataObj.nrcBase.modelEng.slice(0,4):'';
                    $scope.info.basic.flightNoInfo.label = $stateParams.fixAcreg|| '';
                    $scope.info.basic.flightNoInfo.acId = $stateParams.fixAcid|| '';
                    $scope.info.basic.flightNoInfo.workId = $stateParams.fixWorkId|| '';
                    $scope.initAirEngineForAta();
                    $rootScope.endLoading();

                };

                server.maocGetReq('assembly/analysisDomainTypeByCode', {domainCode:'TE_UNIT_TYPE,MATERIAL_UNIT_TYPE'}).then(function (data) {
                    console.info(data,'data');
                    if (data.data.statusCode == 200) {
                            $scope.info.program.UnitList =  data.data.data[0].TE_UNIT_TYPE;
                            $scope.info.program.mrUnitList =  data.data.data[0].MATERIAL_UNIT_TYPE;

                    }

                }).catch(function (error) {

                });

            }
            initInfo();
            $scope.$watch('info.program.mrRequest',function (n,o) {
                if(n == 'y'){
                    if($scope.info.program.repIpc.length== 0){
                        $scope.info.requestCheck = false ;
                    }else{
                        $scope.info.requestCheck = true ;
                    }
                }
                if(n == 'n'){$scope.info.requestCheck = true ;}
            });
            $scope.$watch('info.program.repIpc',function (n,o) {
                if(n){
                    $scope.info.requestCheck = true ;
                }else{
                    $scope.info.requestCheck = false ;
                }

            });
            $scope.newLine = function () {
                $scope.showConfirmState = true;
                var obj = {
                    cardType:'',
                    cardNumber:''
                };
                $scope.info.card.cardList.push(obj)
            };
            $scope.newNrcTask = function (){
                $rootScope.startLoading();
                if($scope.nrcTaskNo){
                    server.maocGetReq('nrcTask/queryTaskByNrcId', {nrcId:$scope.nrcId}).then(function (data) {
                        if (200 == data.data.statusCode) {
                            $scope.fileArrTask = [];
                            $scope.imgArrTask = [];
                            $scope.fileId = [];
                            if(data.data.data[0].revNo == '0' && data.data.data[0].status == "EDITING"){
                                $scope.taskEdit = true;
                            }else{
                                $scope.taskEdit = false;
                            }
                            console.log(data.data.data[0]);
                            $scope.addNrctask = true;
                            $scope.nrcTaskNo = data.data.data[0].nrcTaskNo;
                            $scope.info.program.nrcTask.nrcTaskNo = data.data.data[0].nrcTaskNo;
                            $scope.nrcTaskId = data.data.data[0].id;
                            $scope.info.program.nrcTask.chn = data.data.data[0].executeChn;
                            $scope.info.program.nrcTask.en = data.data.data[0].executeEn;
                            $scope.info.program.nrcTask.interval = data.data.data[0].firstLast;
                            var fh , fc , aa , cc , days;
                            for (var i = 0 ,len = data.data.data[0].nrcTaskIntervalList.length; i < len; i++){
                                if(data.data.data[0].nrcTaskIntervalList[i].intUnit == 'FH'){
                                    fh = data.data.data[0].nrcTaskIntervalList[i].intValue;
                                }
                                if(data.data.data[0].nrcTaskIntervalList[i].intUnit == 'FC'){
                                    fc = data.data.data[0].nrcTaskIntervalList[i].intValue;
                                }
                                if(data.data.data[0].nrcTaskIntervalList[i].intUnit == 'A'){
                                    aa = data.data.data[0].nrcTaskIntervalList[i].intValue;
                                }
                                if(data.data.data[0].nrcTaskIntervalList[i].intUnit == 'C'){
                                    cc = data.data.data[0].nrcTaskIntervalList[i].intValue;
                                }
                                if(data.data.data[0].nrcTaskIntervalList[i].intUnit == 'DAYS'){
                                    days = data.data.data[0].nrcTaskIntervalList[i].intValue;
                                }
                            }
                            $scope.info.program.nrcTask.fh = fh || '';
                            $scope.info.program.nrcTask.fc = fc || '';
                            $scope.info.program.nrcTask.aa = aa || '';
                            $scope.info.program.nrcTask.cc = cc || '';
                            $scope.info.program.nrcTask.days = days || '';
                            $scope.info.program.nrcTask.status = data.data.data[0].status;
                            $scope.info.program.nrcTask.revNo = data.data.data[0].revNo;
                            $scope.info.program.nrcTask.nueAttachments = data.data.data[0].nueAttachments;
                            console.info($scope.info.program.nrcTask.interval,'$scope.info.program.nrcTask.interval')
                            $scope.info.program.nrcTask.mrRequest = data.data.data[0].mtrYn;
                            var Attachments = data.data.data[0].nueAttachments;
                            var AllImgExt= ".jpg|.jpeg|.gif|.bmp|.png| "//全部图片格式类型
                            angular.forEach(Attachments,function (item,index) {
                                // var fileType = item.name.substr(item.name.lastIndexOf( ". ")).toLowerCase();
                                // var fileType = item.type.indexOf('image');
                                console.info(item.type);
                                console.info(item.type.indexOf('image'));
                                if(item.type.indexOf('image') == '-1'){

                                }else{
                                    if(typeof (item.content) != 'undefined') {
                                        var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                        var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                        var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                        imgBlob.name = item.name.indexOf('down') == -1
                                            ? imgName + 'down' + imgType
                                            : item.name;
                                        imgBlob.id = item.id;
                                        $scope.fileArrTask.push(imgBlob);
                                        $scope.fileId.push(item.id);
                                        $scope.imgArrTask.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));


                                    }
                                }

                            });
                            console.info($scope.fileArrTask,'file');
                            console.info($scope.imgArrTask,'img');

                            if(data.data.data[0].mtrYn == 'y'){
                                $scope.info.program.nrcTask.repIpc = data.data.data[0].mtrIpc;

                                var toolDto = [] , mrDto = [] ;
                                for(var j = 0 , length = data.data.data[0].nrcMtrList.length; j<length ;j++){
                                    if(data.data.data[0].nrcMtrList[j].mrType == '1'){
                                        toolDto.push(data.data.data[0].nrcMtrList[j])
                                    }
                                    if(data.data.data[0].nrcMtrList[j].mrType == '0'){
                                        mrDto.push(data.data.data[0].nrcMtrList[j])
                                    }
                                }
                                $scope.info.program.nrcTask.toolDto = toolDto;
                                $scope.info.program.nrcTask.mrDto = mrDto;
                            }

                        }
                        $rootScope.endLoading();

                    }).catch(function (error) {
                        alert('NRCTASK接口服务异常，请联系管理员');
                        $rootScope.endLoading();
                        $scope.addNrctask = false;

                    });
                }else{
                    $scope.addNrctask = true;
                    $scope.taskEdit = true;
                    $rootScope.endLoading();
                }

            };
            $scope.openNewPageWithData = function(param){
                var type = angular.lowercase(param.type);
                if (type == 'doc' || type == 'docx' || type == "txt"
                    || type == "tif"|| type == "xls"  || type == "xlsx") {
                    alert('暂不支持此格式预览');
                    return;
                }
                console.info(param,'param');
                NativeAppAPI.openPdfWithUrl(param)
            };
            $scope.cancelNrcTask = function (){
                $scope.addNrctask = false;
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
                if (n == null) {
                    // $scope.info.basic.drDate = angular.copy($scope.info.basic.today);
                    return ;}
               if (typeof(n) == 'undefined' || n == null) { return ;}
               if (new Date($scope.info.basic.drDate).getTime() > $scope.info.basic.today.getTime()) {
                   $scope.info.basic.drDate =new Date($filter('date')($scope.info.basic.today, 'yyyy/MM/dd HH:mm'));
                   $rootScope.errTip = '开卡日期时间不能超过当前日期';
               }
            });
            $scope.$watch('info.program.rii',function (n,o) {
                if(n == 'y'){
                    $scope.info.program.rci = 'n'
                }
            });
            $scope.$watch('info.program.rci',function (n,o) {
                if(n == 'y'){
                    $scope.info.program.rii = 'n'
                }
            });
            $scope.$watch('info.program.fh',function (n,o) {
                if($scope.info.program.runway == 6 && parseInt(n) > 30){
                    $scope.info.program.fh = '';
                    alert('运行分类为10天（20FC/30FH）内纠正时，FH不能大于30')
                }

            });
            $scope.$watch('info.program.fc',function (n,o) {
                if($scope.info.program.runway == 6 && parseInt(n) > 20){
                    $scope.info.program.fh = '';
                    alert('运行分类为10天（20FC/30FH）内纠正时，FC不能大于20')
                }

            });
            $scope.$watch('info.program.days',function (n,o) {
                if($scope.info.program.runway == 6 && parseInt(n) > 10){
                    $scope.info.program.fh = '';
                    alert('运行分类为10天（20FC/30FH）内纠正时，DAYS不能大于10')
                }

            });
            // $scope.$watch('info.program.timeWay',function (n,o) {
            //     $scope.info.program.timeRoad = '';
            //     $scope.info.program.softSet = '';
            //
            // });
            $scope.$watch('info.program.mrRequest',function (n,o) {
                if(n == 'n'){
                    $scope.info.program.suspendTypes = [
                        {
                            name:'TS',
                            selected:false,
                            value:1
                        },
                        {
                            name:'TIME LIMIT',
                            selected:false,
                            value:4
                        },
                        {
                            name:'其他OTHERS',
                            selected:false,
                            value:5
                        },
                    ]
                }else{
                    $scope.info.program.suspendTypes = [
                         {
                             name:'TS',
                             selected:false,
                             value:1
                         },
                         {
                             name:'MATERIAL',
                             selected:false,
                             value:2
                         },
                         {
                             name:'SPEC.TOOLS',
                             selected:false,
                             value:3
                         },
                         {
                             name:'TIME LIMIT',
                             selected:false,
                             value:4
                         },
                         {
                             name:'其他OTHERS',
                             selected:false,
                             value:5
                         },
                     ]
                }
            });

            // 添加工具弹窗
            $scope.addTool = function(){
                $scope.addtoolFlow = true ;
                $scope.info.program.toolPN = '' ;
                $scope.info.program.toolNumber = '' ;
                $scope.info.program.toolUnit = '' ;
                $scope.info.program.toolIndex = '';
                $scope.info.program.toolTips = '';
                $scope.info.program.toolXiugai = false;

            };

            // 添加MR弹窗
            $scope.addMr = function(){
                $scope.addMrFlow = true ;
                $scope.info.program.nrcPn = {} ;
                $scope.info.program.mrNumber = '' ;
                $scope.info.program.mrUnit = '' ;
                $scope.info.program.mrIndex = '';
                $scope.info.program.nrcPn.description = '';
                $scope.info.program.nrcPn.itemnum = '';
                $scope.info.program.nrcPn.partno = '';
                $scope.info.program.mrBeiliao = 'y';
                $scope.info.program.toolXiugai = false;

            };

            // 隐藏MR弹窗
            $scope.cancelMr = function(){
                $scope.addMrFlow = false ;
            };

            // 隐藏工具弹窗
            $scope.cancelTool = function(){
                $scope.addtoolFlow = false ;
            };

            // 编辑已添加工具
            $scope.editTool = function(event,toolItem,index){
                $scope.info.program.toolPN = toolItem.pn;
                $scope.info.program.toolNumber = toolItem.qty;
                $scope.info.program.toolUnit = toolItem.unit;
                $scope.info.program.toolTips = toolItem.mrDesc;
                $scope.info.program.toolIndex = index;
                $scope.info.program.toolXiugai = true;
                console.info($scope.info.program.toolIndex);
                $scope.addtoolFlow = true ;
            };

            // 删除已添加工具
            $scope.deleteTool = function(event,index,type){
                if(type == "Nrc"){
                    $scope.info.program.toolDto.splice(index,1)
                }
                if(type == "NrcTask"){
                    $scope.info.program.nrcTask.toolDto.splice(index,1)
                }
            };

            //添加工具确认
            $scope.addToolSure = function(){
                var obj = {
                    type: "NRC",
                    pn : $scope.info.program.toolPN,
                    qty : $scope.info.program.toolNumber,
                    unit : $scope.info.program.toolUnit,
                    mrDesc : $scope.info.program.toolTips,
                    prepareMaterials:'n',
                    mrType:'1',
                    itemNum:''
                };
                if(obj.pn==''||obj.qty==''||obj.unit==''){
                    alert('请填写全部');
                    return;
                }
                $scope.info.program.isHasTool = true ;
                console.info($scope.info.program.toolIndex);
                if(!$scope.info.program.toolXiugai){
                    if($scope.addNrctask){
                        $scope.info.program.nrcTask.toolDto.push(obj);
                    }else{
                        $scope.info.program.toolDto.push(obj);
                    }
                    console.log('xinzeng')
                }else{
                    if($scope.addNrctask){
                        $scope.info.program.nrcTask.toolDto.splice($scope.info.program.toolIndex,1,obj)
                    }else{
                        $scope.info.program.toolDto.splice($scope.info.program.toolIndex,1,obj)
                    }
                    console.log('xiugai')
                }
                console.log($scope.info.program.toolDto,'toolDto');
                $scope.info.program.toolXiugai = false;
                $scope.addtoolFlow = false ;

            };

            //添加航材确认
            $scope.addmrSure = function(){
                var obj = {
                    type: "NRC",
                    mrType:'0',
                    pn : $scope.info.program.nrcPn.partno,
                    itemNum:$scope.info.program.nrcPn.itemnum,
                    qty : $scope.info.program.mrNumber,
                    unit : $scope.info.program.mrUnit,
                    mrDesc : $scope.info.program.nrcPn.description,
                    prepareMaterials : $scope.info.program.mrBeiliao,
                };
                if(obj.pn==''||obj.unit==''){
                    alert('请填写全部');
                    return;
                }
                if(obj.pn && obj.itemNum==''){
                    alert('请从下拉框中选择P/N号');
                    return;
                }
                $scope.info.program.isHasMr = true ;
                console.info($scope.info.program.mrIndex);
                if(!$scope.info.program.mrXiugai){
                    if($scope.addNrctask){
                        $scope.info.program.nrcTask.mrDto.push(obj) ;
                    }else{
                        $scope.info.program.mrDto.push(obj) ;
                    }
                    console.log('xinzeng')
                }else{
                    if($scope.addNrctask){
                        $scope.info.program.nrcTask.mrDto.splice($scope.info.program.mrIndex,1,obj);
                    }else{
                        $scope.info.program.mrDto.splice($scope.info.program.mrIndex,1,obj);
                    }
                    console.log('xiugai')

                }
                console.log($scope.info.program.mrDto,'mrDto');
                $scope.info.program.mrXiugai = false;
                $scope.addMrFlow = false ;
            };
            $scope.deleteMr = function(event,index,type){
                if(type == 'Nrc'){
                    $scope.info.program.mrDto.splice(index,1)
                }
                if(type == 'NrcTask'){
                    $scope.info.program.nrcTask.mrDto.splice(index,1)

                }
            };
            $scope.editMr = function(event,toolItem,index){
                $scope.info.program.mrPN = toolItem.pn;
                $scope.info.program.mrNumber = toolItem.qty;
                $scope.info.program.mrUnit = toolItem.unit;
                $scope.info.program.nrcPn.description = toolItem.mrDesc;
                $scope.info.program.nrcPn.itemnum = toolItem.itemNum;
                $scope.info.program.mrIndex = index;
                $scope.info.program.mrXiugai = true;
                console.info($scope.info.program.mrIndex);
                $scope.addMrFlow = true ;
            };


            $scope.choosePN = function(){
                $scope.choosePNflow = true;
            };
            $scope.cancelChoose = function(){
                $scope.choosePNflow = false;
            };

            //多选框
            $scope.noticesChanged = function(){
                //确定是否显示其它位置输入框
                var ind;
                if($scope.info.program.notices && $scope.info.program.notices.length>0){
                     ind = $scope.info.program.notices.indexOf('7');
                }else{
                    ind = -1;
                }
                $scope.info.program.showOtherFlawTxt = ind==-1?false:true;


                //将数组内容转化为字符串
                if ($scope.info.program.notices && $scope.info.program.notices.length > 0) {
                    $scope.noticesType = $scope.info.program.notices.join(',');
                }
                else {
                    $scope.noticesType = '';
                }
                console.log($scope.noticesType,'noticesType');
                //更新显示数组
                $scope.info.program.selectedFlawTypesItems = [];
                console.log($scope.info.program.notices,'notice');
                if ($scope.info.program.notices && $scope.info.program.notices.length > 0) {

                    for (var i =0 ; i < $scope.info.program.notices.length; i ++) {

                        var indexStr
                        for(var j in $scope.info.program.flawTypes){
                            if($scope.info.program.notices[i] == $scope.info.program.flawTypes[j].value){
                                indexStr = j
                            }
                        }
                        var index = parseInt(indexStr);
                        var item = $scope.info.program.flawTypes[index];
                        $scope.info.program.selectedFlawTypesItems.push(item);
                    }
                }
            };

            //多选框
            $scope.reasonChanged = function(){
                //确定是否显示其它位置输入框
                var ind;
                if($scope.info.program.reasons && $scope.info.program.reasons.length>0){
                    ind = $scope.info.program.reasons.indexOf('5');
                }else{
                    ind = -1;
                }
                $scope.info.program.showReasonOther = ind==-1?false:true;

                //将数组内容转化为字符串
                if ($scope.info.program.reasons && $scope.info.program.reasons.length > 0) {
                    $scope.reasonType = $scope.info.program.reasons.join(',');
                }
                else {
                    $scope.reasonType = '';
                }
                console.log($scope.reasonType,'reasonType');
                //更新显示数组
                $scope.info.program.selectedReasons = [];
                console.log($scope.info.program.reasons,'reasons');
                var susArray = [];
                if( $scope.info.program.mrRequest == 'n'){
                      susArray = [
                          {
                            name:'TS',
                            selected:false,
                            value:1
                          },
                          {
                              name:'',
                              selected:false,
                              value:2
                          },
                          {
                              name:'',
                              selected:false,
                              value:3
                          },
                          {
                            name:'TIME LIMIT',
                            selected:false,
                            value:4
                           },
                          {
                            name:'其他OTHERS',
                            selected:false,
                            value:5
                          },
                      ]
                }else{
                   susArray = [
                        {
                            name:'TS',
                            selected:false,
                            value:1
                        },
                        {
                            name:'MATERIAL',
                            selected:false,
                            value:2
                        },
                        {
                            name:'SPEC.TOOLS',
                            selected:false,
                            value:3
                        },
                        {
                            name:'TIME LIMIT',
                            selected:false,
                            value:4
                        },
                        {
                            name:'其他OTHERS',
                            selected:false,
                            value:5
                        },
                    ]
                }
                if ($scope.info.program.reasons && $scope.info.program.reasons.length > 0) {

                    for (var i =0 ; i < $scope.info.program.reasons.length; i ++) {

                        var indexStr = $scope.info.program.reasons[i];
                        var index = parseInt(indexStr);
                        var item = susArray[index - 1];
                        $scope.info.program.selectedReasons.push(item);
                    }
                }
                console.log($scope.info.program.selectedReasons,'selectedReasons');

            };
            $scope.$watch('info.program.ata',function (n,o) {
                if (n && n.length == 4) {
                    var params = {
                        ata:n,
                        applyType:$scope.dataObj.nrcBase.aeType == 1 ? 'APL' :'ENG',
                        applyId:$scope.dataObj.nrcBase.ae,
                    }
                    checkDmInfo.getDmInfo(params).then(function(data) {
                        // console.log(JSON.stringify(data));
                        console.log(data)
                        console.log(data.data.isDm,'data.isDm')
                        if(data.data.isDm && data.data.isDm == 1){
                            $scope.info.program.dm = 'y' ;
                            $scope.info.program.rci = 'y' ;
                            $scope.dmDisable = true;
                        }else{
                            $scope.dmDisable = false;
                        }

                    }).catch(function(error) {
                        console.log(error);

                    });
                }
            });
            // 新增nrctask提交
            $scope.saveNrcTaskSure = function (type){
                $rootScope.startLoading();
                var nrcMtrList =  $scope.info.program.nrcTask.toolDto.concat($scope.info.program.nrcTask.mrDto);
                var nrcTaskIntervalList = [
                    {
                        intValue:$scope.info.program.nrcTask.fh,
                        intUnit:'FH'
                    },
                    {
                        intValue:$scope.info.program.nrcTask.fc,
                        intUnit:'FC'
                    },
                    {
                        intValue:$scope.info.program.nrcTask.days,
                        intUnit:'DAYS'
                    },
                    {
                        intValue:$scope.info.program.nrcTask.aa,
                        intUnit:'A'
                    },
                    {
                        intValue:$scope.info.program.nrcTask.cc,
                        intUnit:'C'
                    }
                ];
                for(var i = 0 ; i < nrcTaskIntervalList.length ; i++){
                    if(nrcTaskIntervalList[i].intValue==''){
                        nrcTaskIntervalList.splice(i,1);
                        i= i-1;
                    }
                }
                var  mtrIpc = $scope.info.program.nrcTask.repIpc || '';
                var data = {
                    id:$scope.nrcTaskId,
                    nrcTaskNo:$scope.nrcTaskNo,
                    nrcId:$stateParams.nrcId,
                    // aeType:'1',
                    acEng:$scope.dataObj.nrcBase.acEng,
                    modelEng:$scope.dataObj.nrcBase.modelEng,
                    revNo:$scope.info.program.nrcTask.revNo,
                    mtrIpc:mtrIpc.trim() != 'null' ? mtrIpc.trim() :'',
                    mtrYn:$scope.info.program.nrcTask.mrRequest,
                    firstLast:$scope.info.program.nrcTask.interval,
                    executeChn:$scope.info.program.nrcTask.chn,
                    executeEn:$scope.info.program.nrcTask.en,
                    nrcMtrList:nrcMtrList,
                    nrcTaskIntervalList:nrcTaskIntervalList,
                    status:$scope.info.program.nrcTask.status||'',
                    acId:'',
                    engId:''
                };
                $scope.dataObj.nrcBase.aeType == 1 && (data.acId = $scope.dataObj.nrcBase.ae);
                $scope.dataObj.nrcBase.aeType == 2 && (data.engId = $scope.dataObj.nrcBase.ae);

                var formId = type == 'save' ? 'nrc-002-save' : 'nrc-002-submit';
                if(type == 'submit'){
                    if($scope.info.program.nrcTask.chn.trim() ==''){
                        alert('中文描述不能为空');
                        $rootScope.endLoading();
                        return;
                    }
                    if($scope.info.program.nrcTask.en.trim() ==''){
                        alert('英文描述不能为空');
                        $rootScope.endLoading();
                        return;
                    }
                    if($scope.info.program.nrcTask.interval ==''){
                        alert('间隔先后不能为空');
                        $rootScope.endLoading();
                        return;
                    }
                    var desc='';
                    for(var i = 0 , len = nrcTaskIntervalList.length ; i < len ; i++){
                        desc += nrcTaskIntervalList[i].intValue;
                    }
                    if(desc == ''){
                        alert('间隔期限至少填一项');
                        $rootScope.endLoading();
                        return;
                    }
                    if($scope.info.program.nrcTask.mrRequest == ''){
                        alert('工具航材需求不能为空');
                        $rootScope.endLoading();
                        return;
                    }
                    if($scope.info.program.nrcTask.mrRequest == 'y' && $scope.info.program.nrcTask.repIpc ==''){
                        alert('REP IPC不能为空');
                        $rootScope.endLoading();
                        return;
                    }
                }
                server.maocFormdataPost('form/submit', formId, data).then(function (result) {
                    var msg = type == 'save' ? '保存' : '提交';
                    if (200 === result.status) {
                        api.alert({
                            msg: msg + '成功'
                        },function(ret, err) {
                            // $scope.addNrctask = false;
                            // $rootScope.go('back');
                            console.info(result.data.data[0].data);
                            $scope.nrcTaskId = result.data.data[0].data.id;
                            $scope.nrcTaskNo = result.data.data[0].data.nrcTaskNo;
                            $scope.info.program.nrcTask.nrcTaskNo = result.data.data[0].data.nrcTaskNo;
                            console.info($scope.nrcTaskId);
                            console.info($scope.nrcTaskNo);
                            $scope.$apply();



                        });
                        if(type == 'submit' || type == 'save'){
                            $scope.cancelNrcTask()
                        }
                        // $scope.info.id = result.data.data[0].data;
                        // console.log(result.data.data[0].data,'nrcid')
                    }else{
                        api.alert({
                            msg:  msg + '失败'
                        });
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.$watch('info.card.cardType',function (n,o) {
                if (n) {
                    $scope.info.card.sendType = n;
                }

            });
            $scope.showConfirm = function(){
                if($scope.info.program.isSuspending == 'y'){
                    if($scope.info.program.approver.approverName.length == 0 || !$scope.info.program.approver.approverName){
                        alert('请填写推迟信息下的审批人');
                        return;
                    }
                    if(($scope.info.program.repeat.length == 0 && $scope.info.program.repeat) || !$scope.info.program.repeat){
                        alert('请选择推迟信息下的复检工单');
                        return;
                    }
                    if(($scope.info.program.reasons.length == 0 && $scope.info.program.reasons) || !$scope.info.program.reasons){
                        console.info($scope.info.program.reasons,'$scope.info.program.reasons')
                        alert('请选择推迟信息下的推迟原因');
                        return;
                    }
                    if(($scope.info.program.runway.length == 0 && $scope.info.program.runway) || !$scope.info.program.runway){
                        alert('请选择推迟信息下的运行分类');
                        return;
                    }
                    if(($scope.info.program.timeWay.length == 0 && $scope.info.program.timeWay) || !$scope.info.program.timeWay){
                        alert('请选择推迟信息下的时限类型');
                        return;
                    }
                    if($scope.info.program.timeWay == 1){
                        //选择了硬时限
                        if($scope.info.program.cause.length == 0 || !$scope.info.program.cause){
                            alert('请选择硬时限设置下的依据');
                            return;
                        }
                        if($scope.info.program.timeRoad.length == 0 || !$scope.info.program.timeRoad){
                            alert('请选择硬时限设置下的时限类别');
                            return;
                        }
                        if($scope.info.program.timeRoad == 1){
                            if($scope.info.program.inOrder.length == 0 || !$scope.info.program.inOrder){
                                alert('请选择硬时限设置下的先后');
                                return;
                            };
                            var fh = String($scope.info.program.fh || '');
                            var fc = String($scope.info.program.fc || '');
                            var days = String($scope.info.program.days + '' || '');
                            if(!fh.trim() && !fc.trim() && !days.trim()){
                                alert('FH FC DAYS 必须填一项');
                                return;
                            }

                        }
                        if($scope.info.program.timeRoad == 3){
                            var snInput = $scope.info.program.snInput || '';
                            var pnInput = $scope.info.program.pnInput || '';
                            if(snInput.trim()=='' || pnInput.trim()==''){
                                alert('PN和SN必填');
                                return;
                            }
                        }
                    };
                    if($scope.info.program.timeWay == 2){
                        //选择了软时限
                        if($scope.info.program.softSet.length == 0 || !$scope.info.program.softSet){
                            alert('请选择软时限设置下的软时限');
                            return;
                        }
                        if($scope.info.program.softSet == 5 || $scope.info.program.softSet == 6){
                            var snInput = $scope.info.program.snInput || '';
                            var pnInput = $scope.info.program.pnInput || '';
                            if(snInput.trim()=='' || pnInput.trim()==''){
                                alert('PN和SN必填');
                                return;
                            }
                        }
                    };
                    if($scope.info.program.reasons == 2){
                        var reasonFlag = false;
                        if($scope.info.program.mrDto.length < 1){
                            alert('推迟原因选择了航材，添加的航材需求不能为空');
                            return;
                        }else {
                            for(var i in $scope.info.program.mrDto){
                                if($scope.info.program.mrDto[i].prepareMaterials == 'y'){
                                    reasonFlag = true;
                                    break;
                                }
                            };
                        };
                        if(!reasonFlag){
                            alert('推迟原因选择了航材，添加的航材需求不能为空且必须勾选需备料项次');
                            return;
                        }
                    }
                };
                $scope.confirmFlow = true;
            }

            $scope.selectAirEngine = function() {
                $scope.modelForAta = "";
                $scope.engineForAta = "";
            }

            $scope.initAirEngineForAta = function() {
                if($scope.info.basic.source == 1){
                    //如果是飞机
                    $scope.modelForAta = $scope.acModel||"";
                    $scope.engineForAta = "";
                }else if($scope.info.basic.source == 2){
                    //如果是发动机
                    $scope.modelForAta = "";
                    $scope.engineForAta = $scope.info.basic.flightNoInfo.pid||"";
                }
            }

            // 方案制定提交
            $scope.submit = function () {
                // if($scope.info.program.isSuspending == 'y'){
                //     if($scope.info.program.approver.approverName.length == 0 || !$scope.info.program.approver.approverName){
                //         alert('请填写推迟信息下的审批人');
                //         return;
                //     }
                //     if(($scope.info.program.repeat.length == 0 && $scope.info.program.repeat) || !$scope.info.program.repeat){
                //         alert('请选择推迟信息下的复检工单');
                //         return;
                //     }
                //     if(($scope.info.program.reasons.length == 0 && $scope.info.program.reasons) || !$scope.info.program.reasons){
                //         console.info($scope.info.program.reasons,'$scope.info.program.reasons')
                //         alert('请选择推迟信息下的推迟原因');
                //         return;
                //     }
                //     if(($scope.info.program.runway.length == 0 && $scope.info.program.runway) || !$scope.info.program.runway){
                //         alert('请选择推迟信息下的运行分类');
                //         return;
                //     }
                //     if(($scope.info.program.timeWay.length == 0 && $scope.info.program.timeWay) || !$scope.info.program.timeWay){
                //         alert('请选择推迟信息下的时限类型');
                //         return;
                //     }
                //     if($scope.info.program.timeWay == 1){
                //         //选择了硬时限
                //         if($scope.info.program.cause.length == 0 || !$scope.info.program.cause){
                //             alert('请选择硬时限设置下的依据');
                //             return;
                //         }
                //         if($scope.info.program.timeRoad.length == 0 || !$scope.info.program.timeRoad){
                //             alert('请选择硬时限设置下的时限类别');
                //             return;
                //         }
                //         if($scope.info.program.timeRoad == 1){
                //             if($scope.info.program.inOrder.length == 0 || !$scope.info.program.inOrder){
                //                 alert('请选择硬时限设置下的先后');
                //                 return;
                //             };
                //             if($scope.info.program.fh.trim()==''&&$scope.info.program.fc.trim()==''&&$scope.info.program.days.trim()==''){
                //                 alert('FH FC DAYS 必须填一项');
                //                 return;
                //             }
                //         }
                //         if($scope.info.program.timeRoad == 3){
                //             if($scope.info.program.snInput.trim()=='' || $scope.info.program.pnInput.trim()==''){
                //                 alert('PN和SN必填');
                //                 return;
                //             }
                //         }
                //     };
                //     if($scope.info.program.timeWay == 2){
                //         //选择了软时限
                //         if($scope.info.program.softSet.length == 0 || !$scope.info.program.softSet){
                //             alert('请选择软时限设置下的软时限');
                //             return;
                //         }
                //         if($scope.info.program.softSet == 5 || $scope.info.program.softSet == 6){
                //             if($scope.info.program.snInput.trim()=='' || $scope.info.program.pnInput.trim()==''){
                //                 alert('PN和SN必填');
                //                 return;
                //             }
                //         }
                //     };
                //     if($scope.info.program.reasons == 2){
                //         var reasonFlag = false;
                //         if($scope.info.program.mrDto.length < 1){
                //             alert('推迟原因选择了航材，添加的航材需求不能为空');
                //             return;
                //         }else {
                //             for(var i in $scope.info.program.mrDto){
                //                 if($scope.info.program.mrDto[i].prepareMaterials == 'y'){
                //                     reasonFlag = true;
                //                     break;
                //                 }
                //             };
                //         };
                //         if(!reasonFlag){
                //             alert('推迟原因选择了航材，添加的航材需求不能为空且必须勾选需备料项次');
                //             return;
                //         }
                //     }
                // }
                $rootScope.startLoading();
                var nrcMtrList =  $scope.info.program.toolDto.concat($scope.info.program.mrDto);
                // let nrcMtrList =  $scope.info.program.toolDto;
                // for(let j = 0 ; j < $scope.info.program.mrDto.length ; j++){
                //     nrcMtrList.push($scope.info.program.mrDto[i]);
                // }
                console.log($scope.info.program.ata.toString().length);
                console.log($scope.info.program.ata);
                if($scope.info.program.ata.toString().length != 4){
                    $rootScope.endLoading();
                    alert('章节数必须为四位数');
                    return;
                }
                console.info(nrcMtrList);
                if(($scope.info.program.timeWay == 1 && $scope.info.program.timeRoad==3 )|| ($scope.info.program.timeWay == 2  && ($scope.info.program.softSet == 5 || $scope.info.program.softSet == 6))){

                }else{
                    $scope.info.program.pnInput = '';
                    $scope.info.program.snInput = '';
                }
                var data = {
                    nrcBase:{
                        assignee:$scope.info.program.approver.approverId ,                    //推迟人Id
                        id:$scope.info.id,
                        nrcNo:$scope.dataObj.nrcBase.nrcNo,
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
                        rectChn: $scope.info.program.chn,
                        rectEn:$scope.info.program.en,
                        repTime: new Date($scope.info.basic.drDate).getTime(),
                        defect:$scope.info.basic.cansee,
                        parentWorkId:$scope.info.basic.flightNoInfo.workId,
                        nrcProcessStatus:$scope.dataObj.nrcBase.nrcProcessStatus,
                        isHasEwis:$scope.oilEwisInfo.isHasEwis ,
                        isHasOil:$scope.oilEwisInfo.isHasOil ,
                        nrcOilList:$scope.oilEwisInfo.oilDTO,
                        nrcEwisList:$scope.oilEwisInfo.ewisDTO,
                        ata: $scope.info.program.ata,
                        rci: $scope.info.program.rci,
                        dm: $scope.info.program.dm,
                        feedbackAircrew:$scope.info.program.tellPl,
                        feedbackTo:$scope.info.program.feedback,
                        rii: $scope.info.program.rii,
                        isSuspending: $scope.info.program.isSuspending,
                        isrepeat:$scope.info.program.repeat,
                        mtrYn: $scope.info.program.mrRequest,
                        mtrIpc: $scope.info.program.repIpc,
                        planningmhPerson: $scope.info.program.person,
                        planningmhHour: $scope.info.program.hour,
                        attentionType:$scope.noticesType,
                        attentionDesc:$scope.info.program.otherText,
                        nrcMtrList:nrcMtrList,
                        repName:$scope.info.mech.approverName || '',
                        repSn:$scope.info.mech.approverSn,
                        rectPlanUpdatedName:$scope.dataObj.nrcBase.rectPlanUpdatedName,
                        rectPlanUpdatedSn:$scope.dataObj.nrcBase.rectPlanUpdatedSn,
                        // currentHandlerSn: $scope.dataObj.currentHandlerSn,
                        nrcCardList:[
                            {
                                id:$scope.info.card.id,
                                nrcId:$scope.info.card.nrcId,
                                cardType:$scope.info.card.sendType || $scope.info.card.cardType,
                                cardId:$scope.info.card.cardId || '',
                                cardNo:$scope.info.card.cardNumber,
                                createMark:$scope.createMark
                            }
                        ],
                        suspending: {
                            nrcId: $scope.info.id,
                            hoReason: $scope.reasonType,
                            hoReasonOther: $scope.info.program.otherReasonText,
                            runType: $scope.info.program.runway == 7 ? 0 : 1,
                            runCategory: $scope.info.program.runway,
                            timeLimitType: $scope.info.program.timeWay,
                            pn: $scope.info.program.pnInput,
                            sn: $scope.info.program.snInput,
                            adviseDoTimeType: $scope.info.program.timeWay == 2 ? $scope.info.program.softSet:'',             //软时限类型
                            firstLast: $scope.info.program.timeWay == 1 ? $scope.info.program.inOrder:'',
                            manualOrTechnical: $scope.info.program.timeWay == 1 ? $scope.info.program.cause:'',
                            fh: $scope.info.program.timeWay == 1 ? $scope.info.program.fh:'',
                            fc: $scope.info.program.timeWay == 1 ? $scope.info.program.fc:'',
                            days: $scope.info.program.timeWay == 1 ? $scope.info.program.days:'',
                            hardTimeType: $scope.info.program.timeWay == 1 ? $scope.info.program.timeRoad:'',
                            // hoName: $scope.info.program.approver.approverName,
                            // hoSn:  $scope.info.program.approver.approverSn,
                            // reviewSn: null,
                            // reviewName: null
                        },
                    },

                    nrcCardDisplay:'',
                    nrcExeCardDisplay:'',
                    nrcTaskNo:$scope.nrcTaskNo,
                    nrcTaskStatus:'',

                };

                var tempImg =$scope.fileArr;
                server.maocFormdataPost('form/submit', 'nrc-001-b', data, tempImg).then(function (result) {
                    var msg = '提交';
                    if (200 === result.status) {
                        api.alert({
                            msg: msg + '成功'
                        },function(ret, err) {
                            $rootScope.go('back');
                        });
                        // $scope.info.id = result.data.data[0].data;
                        // console.log(result.data.data[0].data,'nrcid')
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