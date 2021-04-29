module.exports = angular.module('myApp').controller('PendingController',
    ['$rootScope', '$stateParams', '$scope', '$filter', 'configInfo','$localForage','$timeout',
        function ($rootScope, $stateParams, $scope, $filter, configInfo,$localForage, $timeout) {
            var that =this;
            $rootScope.endLoading();
            var defectInfo = $stateParams.defectInfo;
            var pendingInfo = $stateParams.pendingInfo;
            $scope.defectId = defectInfo.id;
            $scope.dmStatus = defectInfo.dmStatus;
            // $scope.dm = defectInfo.dm || 'n';
            $scope.dm = defectInfo.dm == 'y' ? true : false;
            //控制显示下一页
            $scope.pendingTitle = 'Add Pending';
            $scope.isNextStep = false;
            $scope.selReasonStr = '';

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
            $scope.hideApproverTitle = true;//隐藏选人默认状态
            $scope.isDlyChl = false;
            $scope.requested = {
                nameAndId:'',
                approverSn:'',
                nameAndId:''
            };
            $scope.RiiSign = {
                nameAndId:'',
                approverSn:'',
                nameAndId:''
            };
            $scope.zoneInfo = {
                "zone_id": defectInfo.zone_id,
                "zone_no" : defectInfo.zone_no,
                "zone_area": "",
                "zone_model":defectInfo.model
            };

            $scope.ceshi=function(){
                console.log($scope.pendingData.referItem);
            }

            $scope.expiredDate = "";
            $scope.category = 4;
            $scope.resultActive = 1;
            $scope.nowDate = new Date();
            $scope.applyDate = new Date(defectInfo.dateFound);
            $scope.ddDueDatas = {
                "id": null,
                "category": "",
                "categoryExpDate": "",
                "fh": "",
                "fc": "",
                "calendarDay": "",
                "flightDay": ""
            };
            //涉及到的参考值
            $scope.referenceData = ['MEL', 'CDL', 'TE','AMM', 'SRM',  'FIM', 'OTHERS'];
            $scope.mel_cdl = ['1', '2', '3', '4', '5', '6', '7'];
            $scope.categoryData = [
                {key: 4, value: ''},
                {key: 1, value: 'A:一天'},
                {key: 3, value: 'B:三天'},
                {key: 10, value: 'C:十天'},
                {key: 120, value: 'D:一百二十天'},
                {key: 0, value: 'OTHER'}];
            $scope.pendingData = {
                "id": null,//新增则id 为空，修改(再次推迟)时id不能为空
                "defectId": null,//必填
                "category": "PEND",//保留(DFRL)和推迟(PEND)的标示
                "lackMater": "n",//缺航材,y or n
                "lackTool": "n",//缺工具y or n`
                "lackTime": "n",//停厂时间不足y or n
                "lackTech": "n",//需工程技术y or n
                "reasonOther": "",//其他原因,必填
                "reference": "",//依据MEL,CDL.....,必填
                "referItem": "",//依据的对应值 ,必填
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
                "requesterLice": configInfo.myId() || '',//申请人执照号
                "tlbNo": "",
                "acId": null,
                "manHours": '',
                "rii": 'n',
                "rci": 'n',
                "dlyCnl": 'n',
                "inspector":"",
                "totalFh":null,
                "totalCy":null,
                "faultReportChn": "",
                "faultReportEng": "",
                "ddDueDatas": [],
                // "dm": defectInfo.dm || 'n'
                "dm": defectInfo.dm || 'n'
            };

            if (typeof pdPendingData == "undefined") {
                pdPendingData = $localForage.createInstance({
                    name: (configInfo.userCode || 'noUser') + '_pdnosubmit'
                });
            }

            var keyId = defectInfo.id + '_pd';
            /**
             * 读取数据
             */
            pdPendingData.getItem(keyId).then(function (value) {
                if (value) {
                    $scope.pendingData = value.pendingData || {};
                } else {
                    pdPendingData.length().then(function (numberOfKeys) {
                        if (!numberOfKeys) {
                            $localForage.removeItem('noSubmitNumber');
                        }
                    })
                }
            }).catch(function (err) {
                // This code runs if there were any errors
                console.log(err);
            });

            $scope.scan = function () {
                var FNScanner = api.require('FNScanner');
                FNScanner.open({
                    autorotation: true
                }, function(ret, err) {
                    if (ret.content) {
                        var reg =  /[a-zA-Z]/g;
                        var tlbCode = ret.content.replace(reg,"");
                        $timeout(function() {
                            $scope.pendingData.tlbNo = tlbCode;
                        });
                    }
                });
            };

            $scope.change = function () {
                if ($scope.pendingData.tlbNo) {
                    var reg =  /[a-zA-Z]/g;
                    var tlbCode = $scope.pendingData.tlbNo.replace(reg,"");
                    $scope.pendingData.tlbNo = tlbCode;
                }

            };

            /**
             * 选择Reason
             */
            $scope.selectTab = function (val) {
                $scope.pendingData[val] = ($scope.pendingData[val] == 'y' ? "n" : 'y');
            };
            /**
             * 选择deferral
             */
            $scope.deferral = function (val) {
                $scope.pendingData[val] = ($scope.pendingData[val] == 'y' ? "n" : 'y');
            };
            //参考值与选择输入值对应
            $scope.selectRefData = "请输入" + $scope.referenceData[0] + "号";
            /**
             * 选择Reference
             */
            $scope.reference=$scope.referenceData[0];
            $scope.limtDate=false;
            $scope.refChange = function (reference) {
                $scope.selectRefData = "请输入" + reference + "号";
                $scope.reference = reference;
                if (reference == 'CDL' || reference == 'MEL' || reference == 'TE') {
                    $scope.categoryData = [
                        {key: 4, value: ''},
                        {key: 1, value: 'A:'},
                        {key: 3, value: 'B:三天'},
                        {key: 10, value: 'C:十天'},
                        {key: 120, value: 'D:一百二十天'},
                        {key: 0, value: 'OTHER'}];
                    if(reference == 'CDL'){
                        $scope.category = 120;
                    };
                    $scope.limtDate=false;
                    $scope.categoryChange($scope.category);
                    var newDate = $scope.applyDate.setDate($scope.applyDate.getDate() + 120);
                    $scope.expiredDate = $filter('date')(newDate, 'yyyy年MM月dd日');
                    $scope.pendingData.expiredDate = $filter('date')(newDate, 'yyyy-MM-dd');
                    $scope.ddDueDatas.categoryExpDate = $filter('date')(newDate, 'yyyy-MM-dd');
                    $scope.pendingData.dfralCategory = 'd';
                    $scope.ddDueDatas.category = 'd';
                    $scope.applyDate = new Date($scope.applyDate.setDate($scope.applyDate.getDate() - 120));
                } else {
                    $scope.categoryData = [
                        {key: 4, value: ''},
                        {key: 1, value: 'A:一天'},
                        {key: 3, value: 'B:三天'},
                        {key: 10, value: 'C:十天'},
                        {key: 120, value: 'D:一百二十天'},
                        {key: 0, value: 'OTHER'}];
                    $scope.category = 120;
                    $scope.limtDate = true;
                    $scope.expiredDate = "";
                    $scope.ddDueDatas.categoryExpDate = "";
                    $scope.pendingData.expiredDate = "";
                    $scope.categoryChange($scope.category);
                }
                if(reference == 'CDL'|| reference == 'MEL'){
                   $scope.mel_true=true;
                }else{
                    $scope.mel_true=false;
                    $scope.pendingData.melCTitle = '';
                    $scope.pendingData.melETitle = '';
                };
                $scope.changeDownList();
            };

            /**
             * 选择category
             */
            $scope.categoryChange = function (category) {
                var copyApplyDate = new Date(String($scope.applyDate));
                switch (category) {
                    case 3:
                        var newDate = $scope.applyDate.setDate($scope.applyDate.getDate() + 3);
                        $scope.expiredDate = $filter('date')(newDate, 'yyyy年MM月dd日');
                        $scope.pendingData.expiredDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.ddDueDatas.categoryExpDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.pendingData.dfralCategory = 'b';
                        $scope.ddDueDatas.category = 'b';
                        $scope.category = 3;
                        $scope.applyDate = new Date($scope.applyDate.setDate($scope.applyDate.getDate() - 3));
                        break;
                    case 10:
                        var newDate = $scope.applyDate.setDate($scope.applyDate.getDate() + 10);
                        $scope.expiredDate = $filter('date')(newDate, 'yyyy年MM月dd日');
                        $scope.pendingData.expiredDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.ddDueDatas.categoryExpDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.pendingData.dfralCategory = 'c';
                        $scope.ddDueDatas.category = 'c';
                        $scope.category = 10;
                        $scope.applyDate = new Date($scope.applyDate.setDate($scope.applyDate.getDate() - 10));
                        break;
                    case 120:
                        var newDate = $scope.applyDate.setDate($scope.applyDate.getDate() + 120);
                        $scope.expiredDate = $filter('date')(newDate, 'yyyy年MM月dd日');
                        $scope.pendingData.expiredDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.ddDueDatas.categoryExpDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.pendingData.dfralCategory = 'd';
                        $scope.ddDueDatas.category = 'd';
                        $scope.category = 120;
                        $scope.applyDate = new Date($scope.applyDate.setDate($scope.applyDate.getDate() - 120));
                        break;
                    case 1:
                        var newDate = copyApplyDate.setDate(copyApplyDate.getDate() + 1);
                        $scope.expiredDate = $filter('date')(newDate, 'yyyy年MM月dd日');
                        $scope.pendingData.expiredDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.ddDueDatas.categoryExpDate = $filter('date')(newDate, 'yyyy-MM-dd');
                        $scope.pendingData.dfralCategory = 'a';
                        $scope.ddDueDatas.category = 'a';
                        // $scope.expiredDate = "";
                        //$scope.ddDueDatas.categoryExpDate = "";
                        //$scope.pendingData.expiredDate = "";
                        $scope.category = 1;
                        if($scope.reference == 'MEL' || $scope.reference == 'CDL' ||$scope.reference == 'TE'){
                            $scope.isProp = true;
                        }
                        break;
                    case 0:
                        $scope.pendingData.dfralCategory = 'other';
                        $scope.ddDueDatas.category = 'other';
                        $scope.expiredDate = "";
                        $scope.ddDueDatas.categoryExpDate = "";
                        $scope.pendingData.expiredDate = "";
                        $scope.category = 0;
                        $scope.isProp = true;
                        break;
                    default:
                        $scope.pendingData.dfralCategory = '';
                        $scope.ddDueDatas.category = '';
                        $scope.expiredDate = "";
                        $scope.ddDueDatas.categoryExpDate = "";
                        $scope.pendingData.expiredDate = "";
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
             * 选择dlycnl按钮
             */
            $scope.setResult =function (event) {
                $scope.isDlyChl = true;
                $scope.pendingData.dlyCnl = event.target.innerText == 'NO'?'n':'y';
            };
            //新建pending后带出的数据赋值
            // console.log("pendingInfo=",pendingInfo!=null,pendingInfo!='',pendingInfo!=undefined);
            if(pendingInfo!=null&&pendingInfo!=''&&pendingInfo!=undefined){
                // $scope.pendingData.tlbNo = pendingInfo[0].tlbNo || '';
                $scope.pendingData.dlyCnl = pendingInfo[0].dlyCnl || 'n';
                $scope.pendingData.manHours = pendingInfo[0].manHours || '';
                $scope.pendingData.rii = pendingInfo[0].rii || 'n';
                $scope.pendingData.rci = pendingInfo[0].rci || 'n';
                $scope.RiiSign.approverName = pendingInfo[0].inspector || '';
                $scope.RiiSign.approverSn  = pendingInfo[0].inspectorNo|| '';
                $scope.pendingData.lackMater = pendingInfo[0].lackMater || 'n';
                $scope.pendingData.lackTime = pendingInfo[0].lackTime || 'n';
                $scope.pendingData.lackTool = pendingInfo[0].lackTool || 'n';
                $scope.pendingData.lackTech = pendingInfo[0].lackTech || 'n';
                $scope.pendingData.reasonOther = pendingInfo[0].reasonOther || '';
                $scope.reference = pendingInfo[0].reference || '';
                $scope.pendingData.referItem = pendingInfo[0].referItem || '';
                $scope.pendingData.isPlacard = pendingInfo[0].isPlacard || 'n';
                pendingInfo[0].isPlacard=='y'?$scope.isPlacard=true:$scope.isPlacard=false;
                $scope.pendingData.isCaution = pendingInfo[0].isCaution|| 'n';
                pendingInfo[0].isCaution=='y'?$scope.isCaution=true:$scope.isCaution=false;
                $scope.pendingData.isM = pendingInfo[0].isM|| 'n';
                pendingInfo[0].isM=='y'?$scope.isM=true:$scope.isM=false;
                $scope.pendingData.isSpecial = pendingInfo[0].isSpecial|| 'n';
                pendingInfo[0].isSpecial=='y'?$scope.isSpecial=true:$scope.isSpecial=false;
                $scope.pendingData.isCheck = pendingInfo[0].isCheck|| 'n';
                pendingInfo[0].isCheck=='y'?$scope.isCheck=true:$scope.isCheck=false;
                $scope.pendingData.isReview = pendingInfo[0].isReview|| 'n';
                pendingInfo[0].isReview=='y'?$scope.isReview=true:$scope.isReview=false;
                $scope.pendingData.isO = pendingInfo[0].isO||'n';
                pendingInfo[0].isO=='y'?$scope.isO=true:$scope.isO=false;
                $scope.pendingData.isNotify = pendingInfo[0].isNotify||'n';
                pendingInfo[0].isNotify=='y'?$scope.isNotify=true:$scope.isNotify=false;

                $scope.pendingData.dm = pendingInfo[0].dm||'n';
                pendingInfo[0].dm=='y'?$scope.dm=true:$scope.dm=false;

                $scope.expiredDate = $filter('date')(pendingInfo[0].expiredDate, 'yyyy年MM月dd日')||'';
                $scope.pendingData.expiredDate = $filter('date')(pendingInfo[0].expiredDate, 'yyyy-MM-dd')||'';
                $scope.pendingData.ddDueDatas.categoryExpDate = $filter('date')(pendingInfo[0].expiredDate, 'yyyy-MM-dd')||'';
                $scope.pendingData.dfralCategory = pendingInfo[0].ddDueDatas.category|| pendingInfo[0].dfralCategory||'';
                $scope.category = pendingInfo[0].ddDueDatas.category||pendingInfo[0].dfralCategory||'4';
                $scope.categoryChange($scope.category);
                $scope.pendingData.requesterLice = pendingInfo[0].requesterLice || '';
                $scope.ddDueDatas.categoryExpDate = $filter('date')(pendingInfo[0].expiredDate, 'yyyy-MM-dd')||'4';
                $scope.ddDueDatas.category = pendingInfo[0].ddDueDatas.category||pendingInfo[0].dfralCategory ||'4';
                $scope.ddDueDatas.id = pendingInfo[0].ddDueDatas.id||'';
                $scope.ddDueDatas.type = pendingInfo[0].ddDueDatas.type||'';
                $scope.ddDueDatas.fh = pendingInfo[0].ddDueDatas.fh||'';
                $scope.ddDueDatas.fc = pendingInfo[0].ddDueDatas.fc||'';
                $scope.ddDueDatas.calendarDay = pendingInfo[0].ddDueDatas.calendarDay||'';
                $scope.ddDueDatas.flightDay = pendingInfo[0].ddDueDatas.flightDay||'';
                $scope.pendingData.ddDueDatas.push($scope.ddDueDatas);
            }
            console.log("$scope.category=",$scope.category);
            console.log("$scope.pendingData=",$scope.pendingData);

            /*
            * 下一页方法
            * */

            $scope.goNext = function() {
                $scope.selReasonStr = '';
                var itmes = [{'key':'lackMater','value':'Material'},{'key':'lackTool','value':'Tooling'},{'key':'lackTime','value':'Ground Time'},{'key':'lackTech','value':'Engineering'}];
                angular.forEach(itmes,function (item,index) {
                    if ($scope.pendingData[item.key] == 'y') {
                        if ($scope.selReasonStr == '') {
                            $scope.selReasonStr = item.value;
                        }
                        else {
                            $scope.selReasonStr = $scope.selReasonStr + '、' + item.value;
                        }
                    }
                });
                $scope.isNextStep = true;
                $scope.pendingTitle = '确认信息';
            };
            /*
            * 返回方法
            * */
            $scope.goBack = function() {
                if (!$scope.isNextStep) {
                    $rootScope.go('back');
                    // $rootScope.go('searchFault.faultClose', '', {navIdx: 0, handleIdx: 0,defectId: $scope.defectId});
                    // go('searchFault.faultClose', '', {navIdx: defectNavIdx, handleIdx: defectListIdx, defectId: defectId})
                }
                else {
                    $scope.isNextStep = false;
                    $scope.pendingTitle = 'Add Pending';
                }
            };

            /**
             * 提交表单数据
             * @params {表单内容}
             */
            $scope.pendingSubmit = function () {
                // console.log("123=",$scope.pendingData.requesterLice!=''&&$scope.pendingData.requesterLice!=undefined);
                //($scope.pendingData.requesterLice!=''&&$scope.pendingData.requesterLice!=undefined)&&
                if(/[^a-zA-Z0-9`+-~!@#$%^&*()_,./?;:'"\\|\s\n\r\t]/g.test($scope.pendingData.faultReportEng)){
                    $rootScope.errTip = 'FAULT REPORT(ENG)内容必须是英文数字或英文标点符号';
                    return;
                }
                if(($scope.pendingData.referItem!=''&&$scope.pendingData.referItem!=undefined)&&
                    ($scope.category=='0'||$scope.category=='1'||$scope.category=='3'||$scope.category=='10'||$scope.category=='120')&&
                    ($scope.requested.approverName!=''&&$scope.requested.approverName!=undefined&&$scope.requested.approverSn!=''&&$scope.requested.approverSn!=undefined)&&
                    ($scope.pendingData.reasonOther!=''||
                    $scope.pendingData['lackMater']=='y'||
                    $scope.pendingData['lackTech']=='y' ||
                    $scope.pendingData['lackTime']=='y' ||
                    $scope.pendingData['lackTool']=='y')
                ){
                    $rootScope.startLoading();
                    $scope.pendingData.applyDate = $filter('date')($scope.applyDate, 'yyyy-MM-dd');
                    $scope.pendingData.acId = defectInfo.acId;
                    $scope.pendingData.requester = $scope.requested.approverName;
                    $scope.pendingData.requesterNo = $scope.requested.approverSn;
                    $scope.pendingData.inspector = $scope.RiiSign.approverName;
                    $scope.pendingData.inspectorNo = $scope.RiiSign.approverSn;
                    $scope.pendingData.creatorNo = configInfo.userCode;
                    $scope.pendingData.totalFh = defectInfo.totalFh;
                    $scope.pendingData.totalCy = defectInfo.totalCy;

                    $scope.pendingData.defectId = defectInfo.id;
                    $scope.pendingData.reference = $scope.reference;
                    $scope.pendingData.dfralCategory = $scope.ddDueDatas.category;
                    $scope.pendingData.noTlbNo = $scope.pendingData.noTlbNo ? 1 : 0;
                    $scope.pendingData.ddDueDatas = [];
                    $scope.pendingData.ddDueDatas.push($scope.ddDueDatas);

                    $scope.pendingData.oilDTO = $scope.oilDTO;
                    $scope.pendingData.ewisDTO = $scope.ewisDTO;
                    $scope.pendingData.isHasOil = $scope.isHasOil;
                    $scope.pendingData.isHasEwis = $scope.isHasEwis;
                    $scope.pendingData.zoneId =  $scope.zoneInfo.zone_id;
                    $scope.pendingData.zoneNo =  $scope.zoneInfo.zone_no;

                    pdPendingData.setItem(keyId,{
                        pendingData:$scope.pendingData,
                    });
                    console.log("pendingData==", $scope.pendingData);
                    server.maocPostReq('Pend/saveDefectPendInfo', $scope.pendingData, true).then(function (data) {
                        console.log("error=",data);
                        console.log("error=",data.error_description);
                        if (200 === data.status) {
                            alert("新建Pending成功");
                            pdPendingData.clear();
                            $rootScope.go('back');
                            //$rootScope.go('searchFault.faultClose', '', {navIdx: 2, handleIdx: 4, defectId: defectInfo.id});

                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        console.log("error=",error);
                        $rootScope.endLoading();
                    });
                }else if(
                    ($scope.pendingData.referItem!=''&&$scope.pendingData.referItem!=undefined)&&
                    ($scope.category=='0'||$scope.category=='1'||$scope.category=='3'||$scope.category=='10'||$scope.category=='120')&&
                    ($scope.requested.approverName!=''&&$scope.requested.approverName!=undefined&&$scope.requested.approverSn!=''&&$scope.requested.approverSn!=undefined)&&
                    ($scope.RiiSign.approverName!=''&&$scope.RiiSign.approverName!=undefined&&$scope.RiiSign.approverSn!=''&&$scope.RiiSign.approverSn!=undefined)&&
                    ($scope.pendingData.reasonOther!=''||
                    $scope.pendingData['lackMater']=='y'||
                    $scope.pendingData['lackTech']=='y' ||
                    $scope.pendingData['lackTime']=='y' ||
                    $scope.pendingData['lackTool']=='y')){

                    $rootScope.startLoading();
                    $scope.pendingData.applyDate = $filter('date')($scope.applyDate, 'yyyy-MM-dd');
                    $scope.pendingData.acId = defectInfo.acId;
                    $scope.pendingData.requester = $scope.requested.approverName;
                    $scope.pendingData.requesterNo = $scope.requested.approverSn;
                    $scope.pendingData.inspector = $scope.RiiSign.approverName;
                    $scope.pendingData.inspectorNo = $scope.RiiSign.approverSn;
                    $scope.pendingData.creatorNo = configInfo.userCode;
                    $scope.pendingData.totalFh = defectInfo.totalFh;
                    $scope.pendingData.totalCy = defectInfo.totalCy;

                    $scope.pendingData.defectId = defectInfo.id;
                    $scope.pendingData.reference = $scope.reference;
                    $scope.pendingData.dfralCategory = $scope.ddDueDatas.category;
                    $scope.pendingData.noTlbNo = $scope.pendingData.noTlbNo ? 1 : 0;
                    $scope.pendingData.ddDueDatas = [];
                    $scope.pendingData.ddDueDatas.push($scope.ddDueDatas);
                    $scope.pendingData.zoneId =  $scope.zoneInfo.zone_id;
                    $scope.pendingData.zoneNo =  $scope.zoneInfo.zone_no;
                    pdPendingData.setItem(keyId,{
                        pendingData:$scope.pendingData
                    });

                    server.maocPostReq('Pend/saveDefectPendInfo', $scope.pendingData, true).then(function (data) {
                        console.log("error=",data);
                        console.log("error=",data.error_description);
                        if (200 === data.status) {
                            alert("新建Pending成功");
                            pdPendingData.clear();
                            $rootScope.go('back');
                            //$rootScope.go('searchFault.faultClose', '', {navIdx: 2, handleIdx: 4, defectId: defectInfo.id});
                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        console.log("error=",error);
                        $rootScope.endLoading();
                    });
                }else{
                    // alert("相关信息请填写完整");
                }
            };

//点击下拉选择操作
            $scope.hadSelected = true;
            $scope.onclickListData = function (data) {
                    console.log("选择的下拉数据"+JSON.stringify(data));
                    $scope.hadSelected = true;
                    //把选中的值放到输入框
                    $scope.pendingData.referItem = data.melNumber;
                if(!!data.melCTitle && data.melCTitle != 'N/A'){
                    $scope.pendingData.melCTitle = data.melCTitle;
                }else {
                    $scope.pendingData.melCTitle = '';
                };
                if(!!data.melETitle && data.melETitle != 'N/A'){
                    $scope.pendingData.melETitle = data.melETitle;
                }else {
                    $scope.pendingData.melETitle = '';
                };
                    $scope.dropdown = false;//关闭下拉
            };

//当MEL CDL选择改变的时候下来内容跟着改变
            $scope.changeDownList = function(type){
                //清空输入框内容
                $scope.pendingData.referItem = "";
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
                if($scope.pendingData.referItem.length>=2 && ($scope.reference == "MEL"||$scope.reference == "CDL")){
                    $scope.searchKeyData = {
                        melNumber:$scope.pendingData.referItem,
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
                        console.log(error);
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
                    if(($scope.reference == 'MEL'&& $scope.hadSelected == false) || ( $scope.reference == 'CDL'&& $scope.hadSelected == false)){
                        $scope.pendingData.referItem = "";
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


