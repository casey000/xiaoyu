module.exports = angular.module('myApp').controller('ddiBaseController',
    ['$rootScope', '$stateParams', '$scope', '$localForage', 'configInfo', 'fileReader', '$timeout', '$filter',
        function ($rootScope, $stateParams, $scope, $localForage, configInfo, fileReader, $timeout, $filter) {
            $rootScope.endLoading();
            var defectInfo = $stateParams.defectInfo;
            var pendingInfo = $stateParams.pendingInfo;
            $scope.dmStatus = defectInfo.dmStatus;
            $scope.dm = defectInfo.dm == 'y' ? true : false;

            //$localForage.getItem('defectIdx').then(function(value) {
            //    $scope.defectIdx = value; //获取故障详情之前在哪个tab页
            //});
            $scope.edit = true;

            $scope.isHasEwis = '';
            $scope.showEwis = false;
            $scope.ewisInfo = {};
            $scope.ewisDTO = [];
            $scope.ewisState = -1;
            $scope.selectedEwisIndex = -1;

            $scope.isHasOil = '';
            $scope.showOil = false;
            $scope.oilInfo = {};
            $scope.oilDTO = [];
            $scope.oilState = -1;//0新建 1编辑 2详情 -1无效
            $scope.selectedOilIndex = -1;//编辑或详情项目下标


            //初始化前一个页面传过来的数据
            $scope.initData = {
                defectId: defectInfo.defectNo,//故障ID，必填
                Station: defectInfo.station,
                acId: defectInfo.acReg,
                totalFh: parseInt(defectInfo.totalFh/60) + "小时" + defectInfo.totalFh%60 + "分",//总小时数,必填
                totalCy: defectInfo.totalCy,//总循环数 ,必填
                rii: 'n',
                rci: 'n',
                minorModel:defectInfo.minorModel,
                engSn:"ENG"+defectInfo.engineType+" "+defectInfo.engineSn,
            };
            $scope.imgInfo = {
                fileArr: [],
                imgArr: [],
                attachvo: []
            };
            $scope.hideApproverTitle = true;//隐藏选人默认状态
            $scope.isClick = false;
            $scope.resultActive = 1;
            $scope.requested = {
                approverName: '',
                approverSn: '',
                nameAndId: ''
            };
            $scope.Auditor = {
                approverName: '',
                approverSn: '',
                nameAndId: ''
            };
            $scope.RiiSign = {
                approverName: '',
                approverSn: '',
                nameAndId: ''
            };
            $scope.zoneInfo = {
                "zone_id": defectInfo.zone_id,
                "zone_no" : defectInfo.zone_no,
                "zone_area": "",
                "zone_model":defectInfo.model
            };
            $scope.isNextStep = false;
            $scope.isNextStep2 = false;
            $scope.isDlyChl = false;
            $scope.isProp = false;
            $scope.ddiTitle = 'Add DDI';
            $scope.applyDate = new Date(defectInfo.dateFound);
            $scope.expiredDate = "";
            $scope.dlyCnl = "";
            $scope.category = 4;

            $scope.ddDueDatas = {
                "id": null,
                "category": "",
                "categoryExpDate": "",
                "priority": "priority",
                "type": "normal"
            };
            //涉及到的参考值
            $scope.referenceData = ['MEL', 'CDL', 'TE'];
            $scope.mel_cdl = ['1', '2', '3', '4', '5', '6', '7'];
            $scope.categoryData = [
                {key: 4, value: ''},
                {key: 1, value: 'A'},
                {key: 3, value: 'B:三天'},
                {key: 10, value: 'C:十天'},
                {key: 120, value: 'D:一百二十天'},
                {key: 2, value: 'OTHER'}
            ];

            $scope.baseData = {
                "formId": 'deferred-001-a',
                "formData": {
                    "id": null,
                    "actionId": null,
                    "acId":defectInfo.acId ||null,
                    "defectId": defectInfo.id || null,//需传值
                    "category": 'DFRL',
                    // "creator":defectInfo.creator,
                    "pendNo": null,
                    "totalFh": defectInfo.totalFh || null,//需传值
                    "totalCy": defectInfo.totalCy ||null,//需传值
                    "deferredNo": null,
                    "lackMater": "n",//缺航材,y or n
                    "lackTool": "n",//缺工具y or n`
                    "lackTime": "n",//停厂时间不足y or n
                    "lackTech": "n",//需工程技术y or n
                    "reasonOther": "",//其他原因,必填
                    "reference": "",//依据MEL,CDL.....,必填
                    "referItem": "",//依据的对应值 ,必填
                    "referOther": null,
                    "defectDescChn": "中文",
                    "defectDescEng": "English",
                    "isPlacard": "n",//是否执行挂牌
                    "isCaution": "n",//是否执行“维修注意事项”
                    "isM": "n",//是否执行维修（M）程序措施
                    "isSpecial": "n",//是否执行“备注或例外”
                    "isCheck": "n",//是否每次起飞前检查
                    "isReview": "n",//是否安排好执行过站机务检查
                    "isO": "n",//是否执行操作程序（O）
                    "isNotify": "n",//是否通知机组
                    "applyDate": "",//申请日期 ,必填
                    "dfralCategory": "",//类别
                    "expiredDate": "",//Expired Date期限
                    "requester": "",//申请人
                    "requesterLice": configInfo.myId() || '',//申请人执照号
                    "approver": "",//批准人
                    "approverLice": null,
                    "requesterNo": null,
                    "approverNo": null,
                    "remark": "",
                    "userName": null,
                    "manHours": '',
                    "tlbNo": "",
                    "rii": 'n',
                    "rci": 'n',
                    "dlyCnl": 'n',
                    "inspectorNo": '',
                    "inspector": '',
                    "ddDueDatas": [],
                    "faultReportChn": "",
                    "faultReportEng": "",
                    "dm": defectInfo.dm || 'n'
                }
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
                            $scope.baseData.formData.tlbNo = tlbCode;
                        });
                    }
                });
            };
            
            $scope.change = function () {
                if ($scope.baseData.formData.tlbNo) {
                    var reg =  /[a-zA-Z]/g;
                    var tlbCode = $scope.baseData.formData.tlbNo.replace(reg,"");
                    $scope.baseData.formData.tlbNo = tlbCode;
                }
            };

            if (typeof ddbaseData == "undefined") {
                ddbaseData = $localForage.createInstance({
                    name: (configInfo.userCode || 'noUser') + '_ddnosubmit'
                });
            }
            var keyId = defectInfo.id + '_dd';
            /**
             * 读取数据
             */
            ddbaseData.getItem(keyId).then(function (value) {
                if (value) {
                    $scope.baseData = value.baseData || {};
                } else {
                    ddbaseData.length().then(function (numberOfKeys) {
                        if (!numberOfKeys) {
                            $localForage.removeItem('noSubmitNumber');
                        }
                    })
                }
            }).catch(function (err) {
                // This code runs if there were any errors
                console.log(err);
            });
            /**
             * 选择Reason
             */
            $scope.selectTab = function (val) {
                $scope.baseData.formData[val] = ($scope.baseData.formData[val] == "y" ? "n" : "y");
            };
            /**
             * 选择deferral
             */
            $scope.deferral = function (val) {
                $scope.baseData.formData[val] = ($scope.baseData.formData[val] == "y" ? "n" : "y");
            };
            //参考值与选择输入值对应
            $scope.selectRefData = "请输入" + $scope.referenceData[0] + "号";

            /**
             * 选择Reference
             */
            // $scope.reference = $scope.referenceData[0];
            $scope.reference = '';
            $scope.refChange = function (reference) {
                $scope.selectRefData = "请输入" + reference + "号";
                $scope.reference = reference;
                if (reference == 'CDL') {
                    $scope.category = 120;
                    $scope.categoryChange($scope.category);
                    var newDate = $scope.applyDate.setDate($scope.applyDate.getDate() + 120);
                    $scope.expiredDate = $filter('date')(newDate, 'yyyy年MM月dd日');
                    $scope.baseData.formData.expiredDate = $filter('date')(newDate, 'yyyy-MM-dd');
                    $scope.ddDueDatas.categoryExpDate = $filter('date')(newDate, 'yyyy-MM-dd');
                    $scope.baseData.formData.dfralCategory = 'd';
                    $scope.ddDueDatas.category = 'd';
                    $scope.applyDate = new Date($scope.applyDate.setDate($scope.applyDate.getDate() - 120));
                } else {
                    //$scope.category = "";
                    $scope.expiredDate = "";
                    $scope.ddDueDatas.categoryExpDate = "";
                    $scope.baseData.formData.expiredDate = "";
                }
                if(reference == 'CDL'|| reference == 'MEL'){
                    $scope.mel_true=true;
                }else{
                    $scope.mel_true=false;
                    $scope.baseData.formData.melCTitle = '';
                    $scope.baseData.formData.melETitle = '';
                };
                $scope.changeDownList();
            };

            /**
             * 选择category
             */
            $scope.categoryChange = function (category, isEdit) {
                //$scope.category = category;
                //var copyApplyDate = new Date(String($scope.applyDate));
                switch (category) {
                    case 3:
                    case 'b':
                        var newDate = $scope.applyDate.setDate($scope.applyDate.getDate() + 3);
                        $scope.expiredDate = $filter('date')(newDate, 'yyyy年MM月dd日');
                        $scope.baseData.formData.expiredDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.ddDueDatas.categoryExpDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.baseData.formData.dfralCategory = 'b';
                        $scope.ddDueDatas.category = 'b';
                        $scope.category = 3;
                        $scope.applyDate = new Date($scope.applyDate.setDate($scope.applyDate.getDate() - 3));
                        break;
                    case 10:
                    case 'c':
                        var newDate = $scope.applyDate.setDate($scope.applyDate.getDate() + 10);
                        $scope.expiredDate = $filter('date')(newDate, 'yyyy年MM月dd日');
                        $scope.baseData.formData.expiredDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.ddDueDatas.categoryExpDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.baseData.formData.dfralCategory = 'c';
                        $scope.ddDueDatas.category = 'c';
                        $scope.category = 10;
                        $scope.applyDate = new Date($scope.applyDate.setDate($scope.applyDate.getDate() - 10));
                        break;
                    case 120:
                    case 'd':
                        var newDate = $scope.applyDate.setDate($scope.applyDate.getDate() + 120);
                        $scope.expiredDate = $filter('date')(newDate, 'yyyy年MM月dd日');
                        $scope.baseData.formData.expiredDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.ddDueDatas.categoryExpDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.baseData.formData.dfralCategory = 'd';
                        $scope.ddDueDatas.category = 'd';
                        $scope.category = 120;
                        $scope.applyDate = new Date($scope.applyDate.setDate($scope.applyDate.getDate() - 120));
                        break;
                    case 1:
                    case 'a':
                        $scope.baseData.formData.dfralCategory = 'a';
                        $scope.ddDueDatas.category = 'a';
                        $scope.expiredDate = "";
                        $scope.ddDueDatas.categoryExpDate = "";
                        $scope.baseData.formData.expiredDate = "";
                        $scope.isProp =  isEdit ? false : true;
                        $scope.category = 1;
                        break;
                    case 2:
                    case 'other':
                        $scope.baseData.formData.dfralCategory = 'other';
                        $scope.ddDueDatas.category = 'other';
                        $scope.expiredDate = "";
                        $scope.ddDueDatas.categoryExpDate = "";
                        $scope.baseData.formData.expiredDate = "";
                        $scope.isProp =  isEdit ? false : true;
                        $scope.category = 2;
                        break;
                    default:
                        $scope.baseData.formData.dfralCategory = '';
                        $scope.ddDueDatas.category = '';
                        $scope.expiredDate = "";
                        $scope.ddDueDatas.categoryExpDate = "";
                        $scope.baseData.formData.expiredDate = "";
                }
            };
            /**
             * 取消弹框
             */
            $scope.cleanProp = function () {
                $scope.isProp = false;
                $scope.category = 4;
                $scope.categoryChange($scope.category);
                $scope.ddDueDatas = {
                    "id": null,
                    "category": "",
                    "categoryExpDate": "",
                    "fh": "",
                    "fc": "",
                    "calendarDay": "",
                    "flightDay": ""
                };
            };
            /**
             * 输入原因控制在200字监听事件
             *
             * */
            $scope.reasonOtherChange = function () {
                if ($scope.baseData.formData.reasonOther && $scope.baseData.formData.reasonOther.length > 60){
                    $scope.baseData.formData.reasonOther = $scope.baseData.formData.reasonOther.substr(0,60);
                }
            };
            /**
             * 确定弹窗输入
             */
            $scope.okProp = function () {
                if (angular.isNumber($scope.ddDueDatas.fh) || angular.isNumber($scope.ddDueDatas.fc) || angular.isNumber($scope.ddDueDatas.calendarDay) || angular.isNumber($scope.ddDueDatas.flightDay)) {
                    $scope.isProp = false;
                } else {
                    $scope.isProp = true;
                }
            };
            /**
             * 选择result按钮
             */
            $scope.setResult = function (event) {
                $scope.isDlyChl = true;
                $scope.baseData.formData.dlyCnl = event.target.innerText == 'NO' ? 'n' : 'y';
                $scope.dlyCnl = event.target.innerText == 'NO' ? 'n' : 'y';
            };
            //下一步
            $scope.baseNextStepNo = function () {
                if (($scope.baseData.formData.tlbNo != '' && $scope.baseData.formData.tlbNo != undefined) &&
                    ($scope.baseData.formData.manHours != '' && $scope.baseData.formData.manHours != undefined) &&
                    ($scope.baseData.formData.requesterLice != '' && $scope.baseData.formData.requesterLice != undefined) &&
                    ($scope.category != null && $scope.category != '' && $scope.category != undefined && $scope.category != 4) &&
                    ($scope.requested.approverName != '' && $scope.requested.approverName != undefined) &&
                    ($scope.requested.approverSn != '' && $scope.requested.approverSn != undefined) &&
                    ( $scope.baseData.formData.lackMater == 'y' || $scope.baseData.formData.lackTech == 'y' || $scope.baseData.formData.lackTime == 'y' || $scope.baseData.formData.lackTool == 'y'||$scope.baseData.formData.reasonOther != '')
                ) {
                    $scope.ddDueDatas.category = $scope.baseData.formData.dfralCategory;
                    $scope.ddDueDatas.categoryExpDate = $scope.baseData.formData.expiredDate;
                    $scope.isNextStep = false;
                    $scope.isNextStep2 = true;
                    $scope.ddiTitle = 'DDI申请检验';
                } else {
                    $scope.isNextStep = false;
                }
            };
            $scope.baseNextStepYes = function () {
                if (($scope.baseData.formData.tlbNo != '' && $scope.baseData.formData.tlbNo != undefined) &&
                    ($scope.baseData.formData.manHours != '' && $scope.baseData.formData.manHours != undefined) &&
                    ($scope.baseData.formData.requesterLice != '' && $scope.baseData.formData.requesterLice != undefined) &&
                    ($scope.category != null && $scope.category != '' && $scope.category != undefined && $scope.category != 4) &&
                    ($scope.requested.approverName != '' && $scope.requested.approverName != undefined) &&
                    ($scope.requested.approverSn != '' && $scope.requested.approverSn != undefined) &&
                    ($scope.RiiSign.approverName != '' && $scope.RiiSign.approverName != undefined) &&
                    ($scope.RiiSign.approverSn != '' && $scope.RiiSign.approverSn != undefined) &&
                    ($scope.reference != '' && $scope.reference != undefined) &&
                    ( $scope.baseData.formData.lackMater == 'y' || $scope.baseData.formData.lackTech == 'y' || $scope.baseData.formData.lackTime == 'y' || $scope.baseData.formData.lackTool == 'y'||$scope.baseData.formData.reasonOther != '')
                ) {
                    $scope.ddDueDatas.category = $scope.baseData.formData.dfralCategory;
                    $scope.ddDueDatas.categoryExpDate = $scope.baseData.formData.expiredDate;
                    $scope.isNextStep = true;
                    $scope.ddiTitle = 'DDI申请检验';
                } else {
                    $scope.isNextStep = false;
                }
            };
            /**
             * dd审批驳回操作
             */
            $scope.isTlb = false;
            $scope.auditStatusData = [];
            var dataInfo = $stateParams.dataInfo;

            // if (dataInfo != null && dataInfo != '' && dataInfo != undefined ) {
            if (dataInfo.auditStatus == 5 || dataInfo.auditStatus == 1) {
                $scope.isTlb = true;
                var param = {"defectId": dataInfo.defectId};
                $rootScope.startLoading();
                var auditStatusData = [];
                server.maocGetReq('defect/viewDefectDetailInfo', param).then(function (data) {
                    if (data.status === 200) {
                        $rootScope.endLoading();
                        // defectDetail
                        var newDefectDetail = data.data.data[0].defectDetail;
                        $scope.initData = {
                            defectId: newDefectDetail.defectNo,//故障ID，必填
                            Station: newDefectDetail.station,
                            acId: newDefectDetail.acReg,
                            totalFh: newDefectDetail.totalFh,//总小时数,必填
                            totalCy: newDefectDetail.totalCy,//总循环数 ,必填
                            rii: newDefectDetail.rii,
                            rci: newDefectDetail.rci || 'n'
                        };
                        $scope.baseData.formData.faultReportChn = newDefectDetail.faultReportChn;
                        $scope.baseData.formData.faultReportEng = newDefectDetail.faultReportEng;
                        $scope.auditStatusData = data.data.data[0].pendList;

                        for(var i= 0;i<$scope.auditStatusData.length;i++){
                            if($scope.auditStatusData[i].category == 'DFRL'){
                                auditStatusData.push($scope.auditStatusData[i]);
                            }
                        }

                        $scope.baseData.formData.actionId = auditStatusData[0].actionId || null;
                        $scope.applyDate = new Date(newDefectDetail.dateFound)||new Date(auditStatusData[0].applyDate) || null;
                        $scope.baseData.formData.auditStatus = auditStatusData[0].auditStatus || null;
                        $scope.baseData.formData.category = auditStatusData[0].category || null;
                        //$scope.baseData.formData.creator = auditStatusData[0].creator|| null;
                        $scope.baseData.formData.defectDescChn = auditStatusData[0].defectDescChn|| '';
                        $scope.baseData.formData.defectDescEng = auditStatusData[0].defectDescEng|| '';
                        $scope.baseData.formData.deferredNo = auditStatusData[0].deferredNo|| '';
                        $scope.baseData.formData.extentionStatus = auditStatusData[0].extentionStatus|| '';
                        $scope.baseData.formData.flowInstanceId = auditStatusData[0].flowInstanceId|| '';
                        $scope.baseData.formData.id = auditStatusData[0].id || null;
                        $scope.baseData.formData.inspectStatus = auditStatusData[0].inspectStatus || null;
                        $scope.RiiSign.approverName = auditStatusData[0].inspector || '';
                        $scope.RiiSign.approverSn = auditStatusData[0].inspectorNo || '';
                        $scope.RiiSign.nameAndId =  $scope.RiiSign.approverName + ' ' + $scope.RiiSign.approverSn;

                        $scope.Auditor.approverName = auditStatusData[0].auditor || '';
                        $scope.Auditor.approverSn = auditStatusData[0].auditorNo || '';
                        $scope.baseData.formData.isPlacard = auditStatusData[0].isPlacard || 'n';
                        auditStatusData[0].isPlacard == 'y' ? $scope.isPlacard = true : $scope.isPlacard = false;
                        $scope.baseData.formData.isCaution = auditStatusData[0].isCaution || 'n';
                        auditStatusData[0].isCaution == 'y' ? $scope.isCaution = true : $scope.isCaution = false;
                        $scope.baseData.formData.isM = auditStatusData[0].isM || 'n';
                        auditStatusData[0].isM == 'y' ? $scope.isM = true : $scope.isM = false;
                        $scope.baseData.formData.isSpecial = auditStatusData[0].isSpecial || 'n';
                        auditStatusData[0].isSpecial == 'y' ? $scope.isSpecial = true : $scope.isSpecial = false;
                        $scope.baseData.formData.isCheck = auditStatusData[0].isCheck || 'n';
                        auditStatusData[0].isCheck == 'y' ? $scope.isCheck = true : $scope.isCheck = false;
                        $scope.baseData.formData.isReview = auditStatusData[0].isReview || 'n';
                        auditStatusData[0].isReview == 'y' ? $scope.isReview = true : $scope.isReview = false;
                        $scope.baseData.formData.isO = auditStatusData[0].isO || 'n';
                        auditStatusData[0].isO == 'y' ? $scope.isO = true : $scope.isO = false;
                        $scope.baseData.formData.isNotify = auditStatusData[0].isNotify || 'n';
                        auditStatusData[0].isNotify == 'y' ? $scope.isNotify = true : $scope.isNotify = false;
                        $scope.baseData.formData.dm = auditStatusData[0].dm || 'n';
                        auditStatusData[0].dm == 'y' ? $scope.dm = true : $scope.dm = false;
                        $scope.baseData.formData.lackMater = auditStatusData[0].lackMater || 'n';
                        $scope.baseData.formData.lackTime = auditStatusData[0].lackTime || 'n';
                        $scope.baseData.formData.lackTool = auditStatusData[0].lackTool || 'n';
                        $scope.baseData.formData.lackTech = auditStatusData[0].lackTech || 'n';
                        $scope.baseData.formData.reasonOther = auditStatusData[0].reasonOther || '';
                        $scope.baseData.formData.defectId = newDefectDetail.id|| null;
                        $scope.baseData.formData.manHours = auditStatusData[0].manHours;
                        $scope.baseData.formData.referItem = auditStatusData[0].referItem || '';
                        // $scope.reference = auditStatusData[0].reference || '';
                        var pendRef = auditStatusData[0].reference || '';
                        if (pendRef == 'MEL' || pendRef == 'CDL' || pendRef == 'TE') {
                            $scope.reference = pendRef;
                        }
                        else {
                            $scope.reference = '';
                        }


                        $scope.baseData.formData.requesterLice = configInfo.myId() || '';
                        $scope.baseData.formData.rii = auditStatusData[0].rii || '';
                        $scope.baseData.formData.rci = auditStatusData[0].rci || '';
                        $scope.baseData.formData.status = auditStatusData[0].status || null;
                        $scope.baseData.formData.tlbNo = auditStatusData[0].tlbNo || '';
                        $scope.baseData.formData.tlbId = auditStatusData[0].tlbId || '';
                        $scope.baseData.formData.acId = newDefectDetail.acId || null;
                        $scope.baseData.formData.totalFh = newDefectDetail.totalFh || null;
                        $scope.baseData.formData.totalCy = newDefectDetail.totalCy || null;
                        $scope.baseData.formData.dlyCnl = auditStatusData[0].dlyCnl || 'n';
                        $scope.dlyCnl = auditStatusData[0].dlyCnl || 'n';
                        $scope.expiredDate = $filter('date')(auditStatusData[0].expiredDate, 'yyyy年MM月dd日') || '';
                        $scope.baseData.formData.expiredDate = $filter('date')(auditStatusData[0].expiredDate, 'yyyy-MM-dd') || '';
                        $scope.baseData.formData.ddDueDatas.categoryExpDate = $filter('date')(auditStatusData[0].expiredDate, 'yyyy-MM-dd') || '';
                        $scope.baseData.formData.dfralCategory = auditStatusData[0].dfralCategory || '4';
                        $scope.baseData.formData.dfralCategory == '' ? $scope.baseData.formData.dfralCategory = auditStatusData[0].ddDueDatas.category : $scope.baseData.formData.dfralCategory = '4';
                        $scope.baseData.formData.ddDueDatas.categoryExpDate = $filter('date')(auditStatusData[0].expiredDate, 'yyyy-MM-dd') || '';
                        $scope.category = auditStatusData[0].dfralCategory =='b' ? 3
                            : auditStatusData[0].dfralCategory =='c' ? 10
                            : auditStatusData[0].dfralCategory =='d' ? 120
                            : auditStatusData[0].dfralCategory =='a' ? 1
                            : auditStatusData[0].dfralCategory =='other' ? 2
                            : 4;

                        $scope.categoryChange($scope.category, true);

                        $scope.baseData.formData.ddDueDatas.category = pendingInfo[0].dfralCategory || '4';
                        $scope.baseData.formData.ddDueDatas.category == '' ? $scope.baseData.formData.ddDueDatas.category = pendingInfo[0].ddDueDatas.category : $scope.baseData.formData.ddDueDatas.category = '4';
                        $scope.baseData.formData.ddDueDatas.id = pendingInfo[0].ddDueDatas.id || '';
                        $scope.baseData.formData.ddDueDatas.type = pendingInfo[0].ddDueDatas.type || '';
                        $scope.baseData.formData.ddDueDatas.fh = pendingInfo[0].ddDueDatas.fh || '';
                        $scope.baseData.formData.ddDueDatas.fc = pendingInfo[0].ddDueDatas.fc || '';
                        $scope.baseData.formData.ddDueDatas.calendarDay = pendingInfo[0].ddDueDatas.calendarDay || '';
                        $scope.baseData.formData.ddDueDatas.flightDay = pendingInfo[0].ddDueDatas.flightDay || '';
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            }

            //新建pending后带出的数据赋值
            if (pendingInfo != null && pendingInfo != '' && pendingInfo != undefined) {
                //$scope.baseData.formData.creator = defectInfo.creator || 'DFRL';
                $scope.baseData.formData.defectId = defectInfo.id || null;
                $scope.baseData.formData.acId = defectInfo.acId || null;
                $scope.baseData.formData.rii = defectInfo.rii || '';
                $scope.baseData.formData.rci = defectInfo.rci || '';
                $scope.baseData.formData.totalFh = defectInfo.totalFh || null;
                $scope.baseData.formData.totalCy = defectInfo.totalCy || null;

                $scope.baseData.formData.noTlbNo = pendingInfo[0].noTlbNo;
                $scope.baseData.formData.dlyCnl = pendingInfo[0].dlyCnl || 'n';
                $scope.dlyCnl = pendingInfo[0].dlyCnl || 'n';
                $scope.baseData.formData.manHours = pendingInfo[0].manHours || '';
                $scope.baseData.formData.rii = pendingInfo[0].rii || '';
                $scope.baseData.formData.rci = pendingInfo[0].rci || '';
                $scope.RiiSign.approverName = pendingInfo[0].inspector || '';
                $scope.RiiSign.approverSn = pendingInfo[0].inspectorNo || '';
                $scope.baseData.formData.lackMater = pendingInfo[0].lackMater || 'n';
                $scope.baseData.formData.lackTime = pendingInfo[0].lackTime || 'n';
                $scope.baseData.formData.lackTool = pendingInfo[0].lackTool || 'n';
                $scope.baseData.formData.lackTech = pendingInfo[0].lackTech || 'n';
                $scope.baseData.formData.reasonOther = pendingInfo[0].reasonOther || '';
                var pendRef = pendingInfo[0].reference || '';
                if (pendRef == 'MEL' || pendRef == 'CDL' || pendRef == 'TE') {
                    $scope.reference = pendRef;
                }
                else {
                    $scope.reference = '';
                }

                $scope.baseData.formData.referItem = pendingInfo[0].referItem || '';
                $scope.baseData.formData.isPlacard = pendingInfo[0].isPlacard || 'n';
                pendingInfo[0].isPlacard == 'y' ? $scope.isPlacard = true : $scope.isPlacard = false;
                $scope.baseData.formData.isCaution = pendingInfo[0].isCaution || 'n';
                pendingInfo[0].isCaution == 'y' ? $scope.isCaution = true : $scope.isCaution = false;
                $scope.baseData.formData.isM = pendingInfo[0].isM || 'n';
                pendingInfo[0].isM == 'y' ? $scope.isM = true : $scope.isM = false;
                $scope.baseData.formData.isSpecial = pendingInfo[0].isSpecial || 'n';
                pendingInfo[0].isSpecial == 'y' ? $scope.isSpecial = true : $scope.isSpecial = false;
                $scope.baseData.formData.isCheck = pendingInfo[0].isCheck || 'n';
                pendingInfo[0].isCheck == 'y' ? $scope.isCheck = true : $scope.isCheck = false;
                $scope.baseData.formData.isReview = pendingInfo[0].isReview || 'n';
                pendingInfo[0].isReview == 'y' ? $scope.isReview = true : $scope.isReview = false;
                $scope.baseData.formData.isO = pendingInfo[0].isO || 'n';
                pendingInfo[0].isO == 'y' ? $scope.isO = true : $scope.isO = false;
                $scope.baseData.formData.isNotify = pendingInfo[0].isNotify || 'n';
                pendingInfo[0].isNotify == 'y' ? $scope.isNotify = true : $scope.isNotify = false;
                $scope.baseData.formData.dm = pendingInfo[0].dm || 'n';
                pendingInfo[0].dm == 'y' ? $scope.dm = true : $scope.dm = false;
                //$scope.expiredDate = $filter('date')(pendingInfo[0].expiredDate, 'yyyy年MM月dd日') || '';
                //$scope.baseData.formData.expiredDate = $filter('date')(pendingInfo[0].expiredDate, 'yyyy-MM-dd') || '';
                //$scope.baseData.formData.ddDueDatas.categoryExpDate = $filter('date')(pendingInfo[0].expiredDate, 'yyyy-MM-dd') || '';
                //$scope.baseData.formData.dfralCategory = pendingInfo[0].dfralCategory || '4';
                //$scope.baseData.formData.dfralCategory == '' ? $scope.baseData.formData.dfralCategory = pendingInfo[0].ddDueDatas.category : $scope.baseData.formData.dfralCategory = '4';
                // $scope.baseData.formData.requesterLice = pendingInfo[0].requesterLice || '';
                //$scope.baseData.formData.ddDueDatas.categoryExpDate = $filter('date')(pendingInfo[0].expiredDate, 'yyyy-MM-dd') || '';
                //$scope.category = pendingInfo[0].dfralCategory || '4';
                //$scope.categoryChange($scope.category, true);
                //$scope.category = $scope.category == 4 ? pendingInfo[0].ddDueDatas.category : 4;
                //$scope.baseData.formData.ddDueDatas.category = pendingInfo[0].dfralCategory || '4';
                //$scope.baseData.formData.ddDueDatas.category == '' ? $scope.baseData.formData.ddDueDatas.category = pendingInfo[0].ddDueDatas.category : $scope.baseData.formData.ddDueDatas.category = '4';
                $scope.baseData.formData.ddDueDatas.id = pendingInfo[0].ddDueDatas.id || '';
                $scope.baseData.formData.ddDueDatas.type = pendingInfo[0].ddDueDatas.type || '';
                $scope.baseData.formData.ddDueDatas.fh = pendingInfo[0].ddDueDatas.fh || '';
                $scope.baseData.formData.ddDueDatas.fc = pendingInfo[0].ddDueDatas.fc || '';
                $scope.baseData.formData.ddDueDatas.calendarDay = pendingInfo[0].ddDueDatas.calendarDay || '';
                $scope.baseData.formData.ddDueDatas.flightDay = pendingInfo[0].ddDueDatas.flightDay || '';

            }

            /**
             * 提交表单数据
             * @params {表单内容}
             */
            $scope.submit = function () {
                $rootScope.startLoading();
                var userCode = configInfo.userCode;
                if(/[^a-zA-Z0-9`+-~!@#$%^&*()_,./?;:'"\\|\s\n\r\t]/g.test($scope.baseData.formData.faultReportEng)){
                    $rootScope.errTip = 'FAULT REPORT(ENG)内容必须是英文数字或英文标点符号';
                    $rootScope.endLoading();
                    return;
                }
                if (userCode == $scope.Auditor.approverSn) {
                    alert("审批Auditor不能是当前登录人");
                    $rootScope.endLoading();
                    return;
                } else {
                    $scope.baseData.formData.applyDate = $filter('date')($scope.applyDate, 'yyyy-MM-dd');
                    $scope.baseData.formData.requester = $scope.requested.approverName;
                    $scope.baseData.formData.requesterNo = $scope.requested.approverSn;
                    $scope.baseData.formData.inspector = $scope.RiiSign.approverName;
                    $scope.baseData.formData.inspectorNo = $scope.RiiSign.approverSn;
                    $scope.baseData.formData.auditor = $scope.Auditor.approverName;
                    $scope.baseData.formData.auditorNo = $scope.Auditor.approverSn;
                    $scope.baseData.formData.creatorNo = configInfo.userCode;
                    // $scope.baseData.formData.dlyCnl = $scope.dlyCnl;
                    $scope.baseData.formData.reference = $scope.reference;
                    $scope.baseData.formData.ddDueDatas = [];
                    $scope.baseData.formData.ddDueDatas.push($scope.ddDueDatas);
                    $scope.baseData.formData.dfralCategory = $scope.ddDueDatas.category;
                    //$scope.baseData.formData.noTlbNo = $scope.baseData.formData.noTlbNo ? 1 : 0;
                    $scope.baseData.formData.oilDTO = $scope.oilDTO;
                    $scope.baseData.formData.ewisDTO = $scope.ewisDTO;
                    $scope.baseData.formData.isHasOil = $scope.isHasOil;
                    $scope.baseData.formData.isHasEwis = $scope.isHasEwis;
                    $scope.baseData.formData.zoneId =  $scope.zoneInfo.zone_id;
                    $scope.baseData.formData.zoneNo =  $scope.zoneInfo.zone_no;

                    var data = $scope.baseData.formData;

                    console.log("-------------DDI------------");
                    console.log(JSON.stringify(data));
                    ddbaseData.setItem(keyId, {
                        baseData: $scope.baseData
                    });

                    server.maocFormdataPost('form/submit', 'deferred-001-a', data, $scope.imgInfo.fileArr).then(function (result) {
                        if (200 === result.status) {
                            ddbaseData.clear();
                            alert("新建DD成功");
                            //$rootScope.go('searchFault.faultClose', '', {navIdx: 2, handleIdx: 3, defectId: defectInfo.id});
                            $rootScope.go('back');
                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                }
            };

            /*
           * 下一页方法
           * */

            $scope.goNextYes = function() {
                $scope.selReasonStr = '';
                var itmes = [{'key':'lackMater','value':'Material'},{'key':'lackTool','value':'Tooling'},{'key':'lackTime','value':'Ground Time'},{'key':'lackTech','value':'Engineering'}];
                angular.forEach(itmes,function (item,index) {
                    if ($scope.baseData.formData[item.key] == 'y') {
                        if ($scope.selReasonStr == '') {
                            $scope.selReasonStr = item.value;
                        }
                        else {
                            $scope.selReasonStr = $scope.selReasonStr + '、' + item.value;
                        }
                    }
                });

                if (($scope.baseData.formData.tlbNo != '' && $scope.baseData.formData.tlbNo != undefined) &&
                    ($scope.baseData.formData.manHours != '' && $scope.baseData.formData.manHours != undefined) &&
                    ($scope.zoneInfo.zone_no != '' && $scope.zoneInfo.zone_no!= undefined) &&
                    ($scope.baseData.formData.requesterLice != '' && $scope.baseData.formData.requesterLice != undefined) &&
                    ($scope.category != null && $scope.category != '' && $scope.category != undefined && $scope.category != 4) &&
                    ($scope.requested.approverName != '' && $scope.requested.approverName != undefined) &&
                    ($scope.requested.approverSn != '' && $scope.requested.approverSn != undefined) &&
                    ($scope.RiiSign.approverName != '' && $scope.RiiSign.approverName != undefined) &&
                    ($scope.RiiSign.approverSn != '' && $scope.RiiSign.approverSn != undefined) &&
                    ($scope.reference != '' && $scope.reference != undefined) &&
                    ( $scope.baseData.formData.lackMater == 'y' || $scope.baseData.formData.lackTech == 'y' || $scope.baseData.formData.lackTime == 'y' || $scope.baseData.formData.lackTool == 'y'||$scope.baseData.formData.reasonOther != '')
                ) {
                    $scope.isNextStep = true;
                    $scope.isNextStep2 = false;
                    $scope.ddiTitle = '确认信息';
                }
            };

            $scope.goNextNo = function() {
                $scope.selReasonStr = '';
                var itmes = [{'key':'lackMater','value':'Material'},{'key':'lackTool','value':'Tooling'},{'key':'lackTime','value':'Ground Time'},{'key':'lackTech','value':'Engineering'}];
                angular.forEach(itmes,function (item,index) {
                    if ($scope.baseData.formData[item.key] == 'y') {
                        if ($scope.selReasonStr == '') {
                            $scope.selReasonStr = item.value;
                        }
                        else {
                            $scope.selReasonStr = $scope.selReasonStr + '、' + item.value;
                        }
                    }
                });

                if (($scope.baseData.formData.tlbNo != '' && $scope.baseData.formData.tlbNo != undefined) &&
                    ($scope.baseData.formData.manHours != '' && $scope.baseData.formData.manHours != undefined) &&
                    ($scope.zoneInfo.zone_no != '' && $scope.zoneInfo.zone_no!= undefined) &&
                    ($scope.baseData.formData.requesterLice != '' && $scope.baseData.formData.requesterLice != undefined) &&
                    ($scope.category != null && $scope.category != '' && $scope.category != undefined && $scope.category != 4) &&
                    ($scope.requested.approverName != '' && $scope.requested.approverName != undefined) &&
                    ($scope.requested.approverSn != '' && $scope.requested.approverSn != undefined) &&
                    ($scope.reference != '' && $scope.reference != undefined) &&
                    ( $scope.baseData.formData.lackMater == 'y' || $scope.baseData.formData.lackTech == 'y' || $scope.baseData.formData.lackTime == 'y' || $scope.baseData.formData.lackTool == 'y'||$scope.baseData.formData.reasonOther != '')
                ) {
                    $scope.isNextStep = true;
                    $scope.isNextStep2 = false;
                    $scope.ddiTitle = '确认信息';
                }

            };

            //点击返回
            $scope.goBack = function () {
                if ($scope.isNextStep2) {

                    $scope.ddDueDatas.category = $scope.baseData.formData.dfralCategory;
                    $scope.isNextStep = true;
                    $scope.isNextStep2 = false;
                    $scope.ddiTitle = '确认信息'
                }
                else if ($scope.isNextStep) {

                    $scope.isNextStep = false;
                    $scope.isNextStep2 = false;
                    $scope.ddiTitle = 'ADD DDI';
                   ;
                }
                else {
                    $rootScope.go('back');
                    //$rootScope.go(
                    //    'searchFault.faultClose',
                    //    '',
                    //    {
                    //        navIdx: $scope.defectIdx.defectNavIdx,
                    //        handleIdx: $scope.defectIdx.defectListIdx,
                    //        defectId: defectInfo.id
                    //    }
                    //)
                }
            };
            //Android返回键单独处理
            //if($rootScope.android){
            //    api.removeEventListener({
            //        name: 'angularKeyback'
            //    });
            //
            //    api.addEventListener({
            //        name: 'angularKeyback'
            //    }, function(ret, err){
            //        $scope.goBack();
            //    });
            //}

//点击下拉选择操作
            $scope.hadSelected = true;
            $scope.onclickListData = function (data) {
                // console.log("选择的下拉数据"+JSON.stringify(data));
                //把选中的值放到输入框
                $scope.hadSelected = true;
                $scope.baseData.formData.referItem = data.melNumber;



                if(!!data.melCTitle && data.melCTitle != 'N/A'){
                    $scope.baseData.formData.melCTitle = data.melCTitle;
                }else {
                    $scope.baseData.formData.melCTitle = '';
                };
                if(!!data.melETitle && data.melETitle != 'N/A'){
                    $scope.baseData.formData.melETitle = data.melETitle;
                }else {
                    $scope.baseData.formData.melETitle = '';
                };


                $scope.dropdown = false;//关闭下拉
            };

//当MEL CDL选择改变的时候下来内容跟着改变
            $scope.changeDownList = function(type){
                //清空输入框内容
                $scope.baseData.formData.referItem = "";
                $scope.dropdown = false;//关闭下拉
                if(type == "MEL"){
                    $scope.logChapterData = $scope.logMELChapterData;
                }else if(type == "CDL"){
                    $scope.logChapterData = $scope.logCDLChapterData;
                }
            };

//    通过接口查询的方式返回数据
            $scope.logChapterData = [];
            $scope.searchByInput = function () {
                if($scope.reference == "MEL"||$scope.reference == "CDL"){
                    $scope.hadSelected= false;
                };
                //当输入的字符超过两个字符的时候查询后台,且已经选择了相应类的时候
                if($scope.baseData.formData.referItem.length>=2 && ($scope.reference == "MEL"||$scope.reference == "CDL")){
                    $scope.searchKeyData = {
                        melNumber:$scope.baseData.formData.referItem,
                        type:$scope.reference,
                        model:defectInfo.model
                    };
                    server.maocPostReq('mel/find', $scope.searchKeyData,true).then(function (data) {
                        // console.log("得到的所有的数据"+JSON.stringify(data));
                        //当返回成功且有数据
                        if(data.data.statusCode == 200 && data.data.data.length != 0 ){
                        //    关闭下拉
                            $scope.dropdown = false;
                        //    置空下拉内容
                            $scope.logChapterData = [];
                        //  注入查询到的内容
                            $scope.logChapterData = data.data.data;
                        //    打开下拉
                            $scope.dropdown = true;
                            // console.log("下拉的所有的数据"+JSON.stringify($scope.logChapterData));
                        }else {
                        //如果没有数据
                            //    置空下拉内容
                            $scope.logChapterData = [];
                            //    关闭下拉
                            $scope.dropdown = false;
                        };
                    }).catch(function (error) {
                        //    置空下拉内容
                        $scope.logChapterData = [];
                        //    关闭下拉
                        $scope.dropdown = false;
                        // $rootScope.endLoading();
                        console.log("mel/find请求失败");
                    });
              }else {
                    //    置空下拉内容
                    $scope.logChapterData = [];
                    //    关闭下拉
                    $scope.dropdown = false;
                }
            };

        //    失去焦点清空列表同时收起下拉
        $scope.lostFocus = function () {
            setTimeout(function () {
                //    置空下拉内容
                $scope.logChapterData = [];
                //    关闭下拉
                $scope.dropdown = false;
            },500)

            if(($scope.reference == 'MEL'&& $scope.hadSelected == false) || ( $scope.reference == 'CDL'&& $scope.hadSelected == false)){
                $scope.baseData.formData.referItem = "";
                //之所以要延时关闭下拉和置空，是为了兼顾选中下拉项和点击其他地方可以关闭下拉
                setTimeout(function () {
                    //必须使用$apply函数来强制重绘
                    $scope.$apply(
                        function () {
                            // 置空下拉内容
                            $scope.logChapterData = [];
                            // 关闭下拉
                            $scope.dropdown = false;
                        }
                    );
                    console.log($scope.dropdown);
                },400);
            }
        };

        }
    ]);


