module.exports = angular.module('myApp').controller('processAddFaultHandleController', ['$rootScope', '$scope', '$stateParams', '$filter', 'server', 'configInfo', '$localForage', '$timeout',
    function ($rootScope, $scope, $stateParams, $filter, server, configInfo, $localForage, $timeout) {
        $rootScope.loading = false;
        $scope.hideApproverTitle = true;
        $scope.defectDetail = $stateParams.defectDetail;
        $scope.pt = $stateParams.pt;

        $scope.edit = true;

        $scope.isHasEwis = '';
        $scope.showEwis = false;
        $scope.ewisInfo = {};
        $scope.ewisDTO = [];
        $scope.ewisState = -1;
        $scope.selectedEwisIndex = -1;
        $scope.ewisAttachements = [];

        $scope.isHasOil = '';
        $scope.showOil = false;
        $scope.oilInfo = {};
        $scope.oilDTO = [];
        $scope.oilState = -1;//0新建 1编辑 2详情 -1无效
        $scope.selectedOilIndex = -1;//编辑或详情项目下标
        $scope.oilAttachements = [];


        var date = new Date();
        $scope.imgInfo = {
            fileArr: [],
            imgArr: [],
            attachvo: []
        };
        $scope.info = {
            tecnician: {},
            inspector: {},
            tlbNo: '',
            completeDate: new Date($filter('date')(date, 'yyyy/MM/dd HH:mm')),
            dateFound: new Date($filter('date')($scope.defectDetail.dateFound, 'yyyy/MM/dd HH:mm')),
            dlyCnl: 'n',
            manHours: '',
            rii: 'n',
            rci: 'n',
            takenActionChn: '',
            takenActionEng: '',
            faultReportChn: $stateParams.faultReport.faultReportChn, //取最後時間的值
            faultReportEng: $stateParams.faultReport.faultReportEng,
            reviewType: [],
            ata: $scope.defectDetail.ata,
            dm: $scope.defectDetail.dm,
            dmStatus: $scope.defectDetail.dmStatus
        };

        var paramId = $scope.defectDetail.id + '_handle';

        /**
         * 读取数据
         */
        $localForage.getItem(paramId).then(function (val) {
            if (val && val.info) {
                val.info.dateFound = new Date(val.info.dateFound);
                val.info.completeDate = new Date(val.info.completeDate);
                $scope.info = val.info;
            }
        });
        $rootScope.errAlertCallBack = function () {
            $rootScope.errAlert = false;
            history.go(-1)
        };

        $scope.scan = function () {
            var FNScanner = api.require('FNScanner');
            FNScanner.open({
                autorotation: true
            }, function (ret, err) {
                if (ret.content) {
                    var reg =  /[a-zA-Z]/g;
                    var tlbCode = ret.content.replace(reg,"");

                    $timeout(function() {
                        $scope.info.tlbNo = tlbCode;
                    });
                }
            });
        };

        $scope.change = function () {
            if ($scope.info.tlbNo) {
                var reg =  /[a-zA-Z]/g;
                var tlbCode = $scope.info.tlbNo.replace(reg,"");
                $scope.info.tlbNo = tlbCode;
            }

        };

        $scope.changeReviewType = function(event){
            var valuePos = $scope.info.reviewType.indexOf(event.target.innerText);
            if( valuePos == -1){
                $scope.info.reviewType.push(event.target.innerText);
            }else{
                $scope.info.reviewType.splice(valuePos, 1);
            }
        };


        $scope.submitMethod = function () {

            if ($scope.info.dm === 'y') {
                api.alert({
                    title: '提示',
                    msg: '此任务涉及双重维修限制，请确认是否已按要求执行',
                }, function(ret, err) {
                    if (ret.buttonIndex == 1) {
                        $scope.doSubmit();
                    }
                });
            }
            else {
                $scope.doSubmit();
            }
        };

        function closeReviewDefect () {

            var nonRoutineItem = $stateParams.nonRoutineItem;
            var itemId = nonRoutineItem.itemId;
            var param = {
                taskType: "tbm_non_routine",
                itemId: nonRoutineItem.itemId,
                feedBack:''
            };

            server.maocFormdataPost('form/submit', $stateParams.nonRoutineItem.formId, param, []).then(function(data) {
                if(200 === data.data.statusCode) {
                    $rootScope.go('back');
                }
                $rootScope.endLoading();
            }).catch(function(error) {
                $rootScope.endLoading();
            });
        }
        $scope.doSubmit = function () {

            $rootScope.startLoading();

            var data = {
                tlbNo: $scope.info.tlbNo,
                takenActionChn: $scope.info.takenActionChn,
                takenActionEng: $scope.info.takenActionEng,
                faultReportChn: $scope.info.faultReportChn,
                faultReportEng: $scope.info.faultReportEng,
                feedBack: $scope.info.feedBack,
                dlyCnl: $scope.info.dlyCnl,
                manHours: $scope.info.manHours,
                ata: $scope.info.ata,
                noTlbNo: $scope.info.noTlbNo ? 1 : 0,
                // reviewType: $scope.info.reviewType.join(','),
                reviewType: "",//产品要求隐藏界面该元素，默认值为空字符串
                dm: $scope.info.dm,
                oilDTO: $scope.oilDTO,
                ewisDTO: $scope.ewisDTO,
                isHasOil : $scope.isHasOil,
                isHasEwis: $scope.isHasEwis
            };

            // if (($scope.info.rii =='y' || $scope.info.rci == 'y') &&
            //     $scope.info.inspector.approverSn == $scope.info.tecnician.approverSn) {
            //     $rootScope.errTip = 'Mech Sign与RII Sign不可以为同一个人';
            //     return;
            // }

            data.rii = $scope.info.rii;
            data.rci = $scope.info.rci;

            if (data.rii== 'n' && data.rci == 'n') {
                data.inspector = '';
            }
            else {
                data.inspector = $scope.info.inspector.approverSn;
            }

            data.itemId = $scope.defectDetail.defectNo; //$scope.defectDetail.itemId;
            data.taskType = 'tbm_non_routine';
            data.sn = $scope.info.tecnician.approverSn;
            data.completeDate = $scope.info.completeDate;
            data.dateFound = $scope.info.dateFound;
            data.isReviewDefect = 'y';

            var nonRoutineItem = $stateParams.nonRoutineItem;
            var itemId = nonRoutineItem.itemId;
            data.taskRdItemId = itemId;
            server.maocFormdataPost('form/submit', 'tbm-006-f', data, $scope.imgInfo.fileArr).then(function (result) {
                if (200 === result.status) {
                    // closeReviewDefect()
                    $rootScope.endLoading();
                    $rootScope.go('back');
                }
            }).catch(function (error) {
                $rootScope.endLoading();
            });
        }
    }
]);