module.exports = angular.module('myApp').controller('tlbDetailController',
    ['$rootScope', '$scope', 'server', '$localForage', 'configInfo', '$timeout', '$filter','$stateParams','b64ToBlob','checkDmInfo',
        function($rootScope, $scope, server, $localForage, configInfo, $timeout,$filter,$stateParams,b64ToBlob,checkDmInfo)  {
            $rootScope.endLoading();
            //初始化字段,用于数据绑定,或者用于网路请求
            var formId = 'tlb-001-a';
            // 新建tlb与编辑tlb，tlb详情共用一个页面，使用isCreatTLB标识符进行区分
            $scope.isCreatTLB = true;
            $scope.xianshi=true;
            $scope.zoneInfo = {
                "zone_id": "",
                "zone_no" : "",
                "zone_area": "",
                "zone_model":""
            };
            var tlbId = $stateParams.tlbId ;
            $scope.taskupWay = 'action';
            $scope.actionId = '';
            $scope.fileList = [];
            $rootScope.z_tlbId=$stateParams.tlbId;
            // var tlbNumber = '50460650';
            if (tlbId && !$stateParams.getOtherInfo) {
                $scope.isCreatTLB = false;
            }
            $scope.today = new Date();
            $scope.foundDate =new Date($filter('date')(new Date(), "yyyy/MM/dd HH:mm:ss"));
            $scope.actionDate = new Date($filter('date')(new Date(), "yyyy/MM/dd HH:mm:ss"));
            $scope.staInfo={

            };
            if(!$stateParams.getOtherInfo){
                $scope.dataBody = {};//页面元素对象
                $scope.finderInfo = {};
                $scope.riiSingerInfo = {};
                $scope.MECHSiner = {};
                $scope.zoneInfo = {};
                $scope.oilEwisInfo = {};
            }else{
                $scope.dataBody = $stateParams.formData;
                $scope.finderInfo = $stateParams.finderInfo;
                $scope.riiSingerInfo = $stateParams.riiSingerInfo;
                $scope.MECHSiner = $stateParams.MECHSiner;
                $scope.staInfo.station = $scope.dataBody.actionDTO.staAction;
                $scope.dataBody.tlbDTO.staAction = $scope.dataBody.actionDTO.staAction;
                 $scope.zoneInfo = $stateParams.zoneInfo;
                $scope.oilEwisInfo = $stateParams.oilEwisInfo;
                $scope.acModel = !!$scope.dataBody.tlbDTO.minorModel?$scope.dataBody.tlbDTO.minorModel.slice(0,4):"";
            }

            //初始化换函数，判断是否有本地数据（草稿），有则显示没有就显示初始化默认数据
            if (!tlbId && !$stateParams.getOtherInfo) {
                initData();
            }
            if($stateParams.zoneInfo.itemId){
                $scope.xianshi=false;
                $scope.dataBody.tlbDTO.flightNo =$stateParams.zoneInfo.flightNo;
                $scope.dataBody.tlbDTO.acReg = $stateParams.zoneInfo.acReg;
                $scope.dataBody.tlbDTO.minorModel = $stateParams.zoneInfo.minorModel;
                $scope.acModel = !!$stateParams.zoneInfo.minorModel?$stateParams.zoneInfo.minorModel.slice(0,4):"";
                $scope.dataBody.tlbDTO.flightId = $stateParams.zoneInfo.flightId;
                $scope.dataBody.tlbDTO.staFound =$stateParams.zoneInfo.staFound;
                $scope.dataBody.tlbDTO.defectId =$stateParams.zoneInfo.cardId;
                $scope.dataBody.actionDTO.staAction = $stateParams.zoneInfo.staAction;
                $scope.dataBody.actionDTO.lineJobId = $stateParams.zoneInfo.lineJobId;
                $scope.dataBody.actionDTO.defectId = $stateParams.zoneInfo.cardId;
                $scope.dataBody.actionDTO.type = $stateParams.zoneInfo.review;
                $scope.dataBody.tlbDTO.dmStatus = $stateParams.zoneInfo.dmStatus;
                $scope.dataBody.itemId = $stateParams.zoneInfo.itemId;
                $scope.staInfo.station = $stateParams.zoneInfo.staFound;
                $scope.dataBody.tlbDTO.staAction = $stateParams.zoneInfo.staFound;
                $scope.z_type = $stateParams.zoneInfo.type;
                $scope.zoneInfo.zone_model = $stateParams.zoneInfo.model;

            }

            function initData() {
                $scope.mechanicNoPhotoRemark = '';
                $scope.fileArr = [];
                $scope.imgArr = [];
                $scope.dataBody.tlbDTO = {
                    faultType:'',
                    defectOrigin:'GND',
                    dlyCnl: 'y',
                    rii:'y',
                    rci:'n',
                    engineSN:'',
                    tlbNo:'',
                    acReg: '',
                    flightId:'',
                    flightNo: '',
                    staFound:'',
                    dateFound:'',
                    ata:'',
                    ctrlDocType:'',
                    ctrlDocNo:'',
                    ctrlDocId:'',
                    faultReportChn:'',
                    faultReportEng:'',
                    manHours:'',
                    technicianFoundNo:'',
                    technicianFound: null,
                    inspectorNo: '',
                    inspector: null,
                    technicianActSign:null,
                    technicianActNo:'',
                    dm: '',
                };
                $scope.dataBody.actionDTO = {
                    lineJobId:'',
                    takenActionChn:'',
                    takenActionEng:'',
                    staAction: '',
                    dateAction:'',
                    manHours:'',
                    technicianId: null,
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
            }


            $scope.goAirInfoList = function(params){
                $timeout(function(){
                    $rootScope.go('airInfoList','slideLeft', params);
                }, 100);

            };

            $scope.$watch('dataBody.tlbDTO.ata',function (n,o) {
                console.log("$watch"+JSON.stringify(n));
                if (n && n.length == 4) {
                    var params = {
                        ata:n,
                        applyType:'APL',
                        applyId:'',
                        acReg:$scope.dataBody.tlbDTO.acReg,
                        model:$scope.dataBody.tlbDTO.model
                    }
                    checkDmInfo.getDmInfo(params).then(function(data) {
                        console.log("getDmInfo"+JSON.stringify(data));
                        console.log(data)
                        console.log(data.data.isDm,'data.isDm')
                        if(data.data.isDm && data.data.isDm == 1){
                            $scope.dataBody.tlbDTO.dm = 'y' ;
                            $scope.dataBody.tlbDTO.rci = 'y' ;
                            $scope.dataBody.tlbDTO.rii = 'n' ;
                            $scope.dmDisable = true;
                        }else{
                            $scope.dmDisable = false;
                        }

                    }).catch(function(error) {
                        console.log(error);

                    });
                }
            });

            //   提交函数
            $scope.summitTlbData = function () {
                 // console.log(JSON.stringify($scope.zoneInfo));
                // if (($scope.dataBody.tlbDTO.rii == 'y' || $scope.dataBody.tlbDTO.rci == 'y') && $scope.riiSingerInfo.approverSn &&
                //     $scope.MECHSiner.approverSn == $scope.riiSingerInfo.approverSn) {
                //     $rootScope.errTip = 'Mech Sign与RII Sign不可以为同一个人';
                //     return;
                // }
                if($scope.dataBody.tlbDTO.rii == 'y' || $scope.dataBody.tlbDTO.rci == 'y') {
                    var checkPho = $scope.mechanicNoPhotoRemark||''

                    if($scope.imgArr.length < 1 && !checkPho.trim()){
                        $rootScope.errTip = '不上传照片时，无照片备注必填';
                        return;
                    }
                }

                if(/[^a-zA-Z0-9`+-~!@#$%^&*()_,./?;:'"\\|\s\n\r\t]/g.test($scope.dataBody.tlbDTO.faultReportEng)){
                    $rootScope.errTip = 'Fault Report(English)内容必须是英文数字或英文标点符号';
                    return;
                }
                if(/[^a-zA-Z0-9`+-~!@#$%^&*()_,./?;:'"\\|\s\n\r\t]/g.test($scope.dataBody.actionDTO.takenActionEng)){
                    $rootScope.errTip = 'TAKEN ACTION(English)内容必须是英文数字或英文标点符号';
                    return;
                }
                console.info($scope.fileList)
                $rootScope.startLoading();
                $scope.dataBody.actionDTO.dateAction = $scope.actionDate.getTime();
                $scope.dataBody.tlbDTO.dateFound =$scope.foundDate.getTime();
                $scope.dataBody.tlbDTO.technicianFoundNo = $scope.finderInfo.approverSn;//工号
                $scope.dataBody.tlbDTO.inspectorNo = $scope.riiSingerInfo.approverSn ? $scope.riiSingerInfo.approverSn : '';//工号

                $scope.dataBody.tlbDTO.oilDTO = $scope.oilEwisInfo.oilDTO;
                $scope.dataBody.tlbDTO.ewisDTO = $scope.oilEwisInfo.ewisDTO;
                $scope.dataBody.tlbDTO.isHasOil = $scope.oilEwisInfo.isHasOil;
                $scope.dataBody.tlbDTO.isHasEwis = $scope.oilEwisInfo.isHasEwis;
                $scope.dataBody.isHasOil = $scope.oilEwisInfo.isHasOil;
                $scope.dataBody.isHasEwis = $scope.oilEwisInfo.isHasEwis;
                $scope.dataBody.tlbDTO.zone_id = $scope.zoneInfo.zone_id;
                $scope.dataBody.tlbDTO.zone_no = $scope.zoneInfo.zone_no;
                if($scope.dataBody.tlbDTO.rii == 'y' || $scope.dataBody.tlbDTO.rci == 'y') {
                    if(!tlbId){
                        $scope.dataBody.actionDTO.attachmentList = $scope.fileList;
                    }else{
                        delete $scope.dataBody.actionDTO.attachmentList;
                    }
                    $scope.dataBody.actionDTO.mechanicNoPhotoRemark = $scope.mechanicNoPhotoRemark;
                }
                console.info(tlbId,'tlbId')

                // $scope.fileList && $scope.fileList.forEach(function (item , i) {
                //     item.content && delete item.content
                // })


                //非必选时，必检人信息值为空
                if ($scope.dataBody.tlbDTO.rii == 'y') {
                    $scope.dataBody.tlbDTO.rci = 'n';
                }
                if($scope.dataBody.tlbDTO.rii == 'n' && $scope.dataBody.tlbDTO.rci == 'n') {
                    $scope.dataBody.tlbDTO.inspectorNo = '';
                    $scope.dataBody.tlbDTO.inspector = '';
                }
                $scope.dataBody.tlbDTO.technicianActNo = $scope.MECHSiner.approverSn;//工号
                //不确定pc manhour使用的是哪个DTO的，将两个设置为相同内容
                $scope.dataBody.actionDTO.manHours = $scope.dataBody.tlbDTO.manHours;

                // $scope.dataBody.tlbDTO.preFlightNo = $SC
                //准备参数,包装成对象
                var params = $scope.dataBody;
                  // delete params.tlbDTO.minorModel;
                $scope.dataBody.tlbDTO.staAction = $scope.staInfo.station;

                //暂时不传图片
                server.maocFormdataPost('form/submit',formId,params,[]).then(function (response) {
                    $rootScope.endLoading();
                    if (200 === response.status) {
                        alert('保存成功');
                        $scope.isCreatTLB = false;
                       // alert( $rootScope.go('tlbDetail', '', {tlbId: response.data.data[0], getOtherInfo: false}));
                        getTlbDetalil(response.data.data[0]);
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                    alert('网络请求失败');
                    // alert(JSON.stringify(error));
                });


            };
            $scope.goImg = function (type) {
                console.info(type)
                type == 'feedback' ? $rootScope.go('tlbDetail.processImgRecord','',{imgArr:$scope.dataBody.actionDTO.attachmentList})
                    : $rootScope.go('tlbDetail.processImgRecord','',{imgArr:$scope.dataBody.tlbDTO.apsAttachmentList})
            };
            // 获取详情请求
            function getTlbDetalil(tlbId) {
                $scope.tlbId = tlbId;
                $rootScope.startLoading();
                //提交请求，等待响应
                server.maocGetReq('TLB/getTLBById',{id: tlbId}).then(function (response) {
                    $rootScope.endLoading();
                    if(200 == response.data.statusCode) {
                        var data = response.data.data[0];
                        $scope.ccList = data.tlbCompCCDTOList;
                        $scope.dataBody.tlbDTO = data.tlbDTO;
                        $scope.dataBody.actionDTO = data.actionDTO;
                        $scope.actionId = $scope.dataBody.actionDTO.id;
                        $scope.finderInfo.approverSn = data.tlbDTO.technicianFoundNo;
                        $scope.finderInfo.approverName = data.tlbDTO.technicianFound;

                        $scope.finderInfo.nameAndId = $scope.finderInfo.approverSn ? data.tlbDTO.technicianFoundNo + '  '+ data.tlbDTO.technicianFound : '';
                        $scope.staInfo.station = $scope.dataBody.tlbDTO.staAction;
                        $scope.zoneInfo = {
                            "zone_id": $scope.dataBody.tlbDTO.zone_id,
                            "zone_no" : $scope.dataBody.tlbDTO.zone_no,
                            "zone_area": $scope.dataBody.tlbDTO.zone_area,
                            "zone_model":$scope.dataBody.tlbDTO.model
                        };
                        //历史数据中没有rci的数据，默认初始化为'n'
                        if (typeof ($scope.dataBody.tlbDTO.rci) == 'undefined') {
                            $scope.dataBody.tlbDTO.rci = 'n';
                        }
                        if (typeof ($scope.dataBody.tlbDTO.rii) == 'undefined') {
                            $scope.dataBody.tlbDTO.rii = 'n';
                        }
                        //非必选时，必检人信息值为空
                        if($scope.dataBody.tlbDTO.rii == 'n' && $scope.dataBody.tlbDTO.rci == 'n') {
                            $scope.riiSingerInfo.approverSn = '';
                            $scope.riiSingerInfo.approverName = '';
                            $scope.riiSingerInfo.nameAndId = '';
                        } else {
                            $scope.hasAps = true;
                            $scope.riiSingerInfo.approverSn = data.tlbDTO.inspectorNo;
                            $scope.riiSingerInfo.approverName = data.tlbDTO.inspector;
                            $scope.riiSingerInfo.nameAndId = $scope.riiSingerInfo.approverSn ? data.tlbDTO.inspectorNo + '  ' + data.tlbDTO.inspector : '';
                        }


                        $scope.MECHSiner.approverSn = data.tlbDTO.technicianActNo;
                        $scope.MECHSiner.approverName = data.tlbDTO.technicianActSign;
                        $scope.MECHSiner.nameAndId = $scope.MECHSiner.approverSn ? data.tlbDTO.technicianActNo + '  '+ data.tlbDTO.technicianActSign : '';

                        $scope.foundDate = new Date(data.tlbDTO.dateFound);
                        $scope.actionDate = new Date(data.actionDTO.dateAction);
                        $scope.oilEwisInfo.oilDTO = data.oilDTO;
                        $scope.oilEwisInfo.ewisDTO = data.ewisDTO;
                        $scope.oilEwisInfo.isHasEwis = data.tlbDTO.isHasEwis;
                        $scope.oilEwisInfo.isHasOil = data.tlbDTO.isHasOil;

                        $scope.mechanicNoPhotoRemark = $scope.dataBody.actionDTO.mechanicNoPhotoRemark;
                        $scope.fileList = $scope.dataBody.actionDTO.attachmentList;
                        angular.forEach($scope.dataBody.actionDTO.attachmentList, function (item, index) {
                            if(item.content){
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

                }).catch(function (error) {

                    alert('获取TLB信息失败');
                    $rootScope.endLoading();
                });
            }

            if(tlbId) {

                getTlbDetalil(tlbId);
            }

            $scope.getSn = function(){
                server.maocGetReq('comp/findSNByACAndPosition', {acNo: $scope.dataBody.tlbDTO.acReg, position:$scope.dataBody.tlbDTO.engineType}).then(function (data) {
                    if (200 === data.status) {
                        $scope.dataBody.tlbDTO.engineSN = data.data.data[0];
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            };

            $scope.edit = function () {
                $scope.isCreatTLB = !$scope.isCreatTLB;
                if ($scope.isCreatTLB) {
                    $scope.ewisState = 1;
                    $scope.oilState = 1;
                }
                else {
                    $scope.ewisState = 2;
                    $scope.oilState = 2;
                }

            };
            //cc跳转事件
            $scope.goAddOrDetail = function(cc, tlbId, faultInfo, docType){
                //触摸点击事件执行
                // if(cc.middleStatus == "O"){
                //     $rootScope.go('cc', 'slideLeft',
                //         {defectInfo: faultInfo,
                //             cc: cc,
                //             tlbId: tlbId,
                //             docType: docType,
                //             docNo: faultInfo.tlbNo
                //         });
                // }else{
                //     $rootScope.go('ccInfo', 'slideLeft', {ccInfo: cc});
                // }
                $rootScope.go('newccInfo', 'slideLeft', {ccInfo: cc});


            };
            //    点击事件方法
            $scope.reviewType = function (event) {
                var reviewType = event.target.innerText.toUpperCase();
                $scope.dataBody.tlbDTO.faultType = reviewType == 'S' ? 'S' : reviewType;
            };

            $scope.reportType = function (event) {
                var reportType = event.target.innerText.toUpperCase();
                $scope.dataBody.tlbDTO.defectOrigin = reportType == 'GROUND' ? 'GND' : reportType;
            };


            $scope.setRii = function (event) {
                $scope.dataBody.tlbDTO.rii = event.target.innerText == 'NO' ? 'n' : 'y';
                if ($scope.dataBody.tlbDTO.rii == 'y') {
                    $scope.dataBody.tlbDTO.rci = 'n';
                }
            };

            $scope.setRci = function (event) {
                $scope.dataBody.tlbDTO.rci = event.target.innerText == 'NO' ? 'n' : 'y';
                if ($scope.dataBody.tlbDTO.rci == 'y') {
                    $scope.dataBody.tlbDTO.rii = 'n';
                }
            };

            $scope.setDly = function (event) {
                $scope.dataBody.tlbDTO.dlyCnl = event.target.innerText == 'NO' ? 'n' : 'y';
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
                            $scope.dataBody.tlbDTO.tlbNo = tlbCode;
                        });
                    }
                });
            };

            $scope.change = function () {
                if ($scope.dataBody.tlbDTO.tlbNo) {
                    var reg =  /[a-zA-Z]/g;
                    var tlbCode = $scope.dataBody.tlbDTO.tlbNo.replace(reg,"");
                    $scope.dataBody.tlbDTO.tlbNo = tlbCode;
                }
            };

            $scope.faultReportChnChange = function () {

                if ($scope.dataBody.tlbDTO.faultReportChn.length > 200) {
                    $scope.dataBody.tlbDTO.faultReportChn = $scope.dataBody.tlbDTO.faultReportChn.substr(0,200);
                }

            };

            $scope.faultReportEngChange = function () {
                if ($scope.dataBody.tlbDTO.faultReportEng.length > 400) {
                    $scope.dataBody.tlbDTO.faultReportEng = $scope.dataBody.tlbDTO.faultReportEng.substr(0,400);
                }
            };

            $scope.takenActionChn = function () {
                if ($scope.dataBody.actionDTO.takenActionChn.length > 200) {
                    $scope.dataBody.actionDTO.takenActionChn = $scope.dataBody.actionDTO.takenActionChn.substr(0,200);
                }
            };
            $scope.takenActionEng = function () {
                if ($scope.dataBody.actionDTO.takenActionEng.length > 400) {
                    $scope.dataBody.actionDTO.takenActionEng = $scope.dataBody.actionDTO.takenActionEng.substr(0,400);
                }
            };

            $scope.goBack = function () {
                if ($rootScope.searchTlbFrom && $rootScope.searchTlbFrom == 'status') {
                    $rootScope.go('back');
                }
                else {
                    $rootScope.go('searchTlb','slideLeft',{from:'tlbDetail'});
                }
            };

            //Android返回键单独处理,确保和点击页面返回保持一致
            if($rootScope.android){
                api.removeEventListener({
                    name: 'angularKeyback'
                });

                api.addEventListener({
                    name: 'angularKeyback'
                }, function(ret, err){
                    $scope.goBack();
                });
            }

        }
    ]);