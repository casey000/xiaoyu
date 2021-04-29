module.exports = angular.module('myApp').controller('svDetailController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter', 'b64ToBlob', '$interval',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob, $interval) {
            $rootScope.endLoading();
            var listInfo = angular.copy($stateParams.listInfo);
            $scope.taskInfo = $stateParams.taskInfo;
            $scope.containPo = false;
            $scope.edit = $stateParams.state == 1 || $stateParams.state == 3;
            $scope.userCode = configInfo.userCode;
            $scope.state = $stateParams.state;

            var interval = null;
            $scope.info = {
                toolInfos: {
                    startDate: new Date(formatDate(listInfo.beginTime)),
                    endDate: new Date(formatDate(new Date().getTime())),
                    timeInfo: {},
                    selectSvInfo: {}
                },
                svInfo: listInfo
            };
            $scope.toolInfos = {
                selectJob : 0,
                jobs: []
            };
            $scope.editTime = false;

            /*
            * 获取数据
            * */
            function getDetail(id) {
                if (typeof (id) == 'undefined' || id == '') {
                    return;
                }
                $rootScope.startLoading();
                server.maocGetReq('ghsSpv/findVehicleInfoById', { id: id }).then(function (res) {
                    $rootScope.endLoading();
                    var response = res.data;
                    if (response.statusCode == 200) {
                        var svInfo = response.data[0];
                        if (svInfo.antiIcingFluidVOs.length > 0) {
                            angular.forEach(svInfo.antiIcingFluidVOs, function (item, index) {
                                var durationOfEffects = item.durationOfEffect.split(':');
                                item.hour = durationOfEffects[0] / 1;
                                item.minute = durationOfEffects[1] / 1;
                            });
                        }

                        if (typeof (svInfo.beginTime) != 'undefined') {
                            $scope.info.toolInfos.startDate = new Date(formatDate(svInfo.beginTime));
                        }
                        else {
                            $scope.info.toolInfos.startDate = new Date(formatDate(new Date().getTime()));
                        }

                        if (typeof (svInfo.endTime) != 'undefined') {
                            $scope.info.toolInfos.endDate = new Date(formatDate(svInfo.endTime));
                        }
                        else {
                            $scope.info.toolInfos.endDate = new Date(formatDate(new Date().getTime()));

                        }

                        //使用时长
                        if (svInfo.status == 2) {
                            svInfo.lengthDate = svInfo.endTime - svInfo.beginTime;
                            svInfo.lengthDateStr = formatDuring(svInfo.lengthDate);
                        }

                        $scope.info.svInfo = svInfo;
                        $scope.info.toolInfos.selectSvInfo.licensePlate = svInfo.plateNum;
                        //备注是否必填逻辑控制
                        checkNoteRequire();
                    }
                });
            }

            if ($stateParams.state == 2 || $stateParams.state == 3) {
                getDetail(listInfo.id);
            }


            $scope.submit = function () {
                var params = angular.copy($scope.info.svInfo);
                params.status = 2;
                params.beginTime = $scope.info.toolInfos.startDate.getTime();
                params.endTime = $scope.info.toolInfos.endDate.getTime();
                params.useTime = formatDuring(params.endTime - params.beginTime);
                var now = new Date();
                params.createDate = now.getTime();
                delete params.lengthDateStr;
                delete params.lengthDate;
                params.updater = configInfo.userCode;

                if ($scope.containPo) {
                    var job = $scope.toolInfos.selectJob == 0 ? $scope.taskInfo.departureStationJob : $scope.taskInfo.arrivalStationJob;
                    params.checkType = job.jobType;
                    params.station = job.station;
                }

                if (typeof ($scope.info.toolInfos.selectSvInfo.licensePlate) != 'undefined') {
                    params.plateNum = $scope.info.toolInfos.selectSvInfo.licensePlate;
                    // params.vehicleSupplier = $scope.info.toolInfos.selectSvInfo.supplier;
                }
                if (typeof ($scope.info.toolInfos.selectSvInfo.supplier) != 'undefined') {
                    params.vehicleSupplier = $scope.info.toolInfos.selectSvInfo.supplier;
                }
                if (params.antiIcingFluidVOs.length > 0) {
                    angular.forEach(params.antiIcingFluidVOs, function (item, index) {
                        delete item.hour;
                        delete item.minute;
                        item.icingUnit = params.meteUnit;
                    });
                }

                $rootScope.startLoading();
                server.maocPostReq('ghsSpv/saveVehicleInfo', params, true).then(function (res) {
                    $rootScope.endLoading();
                    var resoponse = res.data;
                    if (resoponse.statusCode == 200) {
                        var msgItem = resoponse.data[0];
                        if (msgItem.success == 1) {
                            $rootScope.go('svList', '', { taskInfo: $stateParams.taskInfo });
                        }
                    }
                    else {
                        alert('上传失败');
                    }
                });
            };

            /**
             * 工具
             * */

            //标题控制

            function initTitle() {
                var state = $stateParams.state;
                switch (state) {
                    case 1:
                        $scope.title = '用车信息填写';
                        break;
                    case 2:
                        $scope.title = '用车信息查看';
                        break;
                    case 3:
                        $scope.title = '用车信息编辑';
                        break;
                    default:
                        break;
                }
            }

            initTitle();

            function justifyPo() {
                if (!angular.equals($scope.taskInfo.arrivalStationJob,{}) && $scope.taskInfo.arrivalStationJob.jobType == 'Po/F') {
                    $scope.containPo = true;
                    $scope.toolInfos.jobs.push($scope.taskInfo.departureStationJob);
                    $scope.toolInfos.jobs.push($scope.taskInfo.arrivalStationJob);
                    if ($scope.info.svInfo.checkType == 'Po/F') {
                        $scope.toolInfos.selectJob = 1;
                    }
                    else {
                        $scope.toolInfos.selectJob = 0;
                    }
                }
                else {
                    $scope.containPo = false;
                }
            }
            if ($scope.taskInfo.arrivalStationJob) {
                justifyPo();
            }


            //计时器
            function startInterval() {
                if (interval != null) {
                    $scope.info.svInfo.lengthDate = null;
                    $scope.info.svInfo.lengthDateStr = null;
                    $interval.cancel(interval);
                }
                interval = $interval(function () {
                    var item = $scope.info.svInfo;
                    if (typeof (item.lengthDate) == 'undefined') {
                        var now = new Date();
                        item.lengthDate = now.getTime() - item.beginTime;
                        item.lengthDateStr = formatDuring(item.lengthDate);
                    }
                    else {
                        item.lengthDate += 1000;
                        item.lengthDateStr = formatDuring(item.lengthDate);
                    }
                }, 1000);
            }

            function formatDuring(mss) {
                var hours = parseInt(mss / (1000 * 60 * 60));
                var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = parseInt((mss % (1000 * 60)) / 1000);
                return formateUnit(hours) + ":" + formateUnit(minutes) + ":" + formateUnit(seconds);
            }

            function formateUnit(number) {
                if (number < 10) {
                    return '0' + number;
                }
                else {
                    return number;
                }
            }

            $scope.goBackToSvList = function () {
                $rootScope.go('svList', '', { taskInfo: $stateParams.taskInfo });
            };

            //安卓返回键
            var time = window.setInterval(function () {
                if (typeof api !== 'undefined') {
                    api.addEventListener({
                        name: 'angularKeyback'
                    }, function (ret, err) {
                        $scope.goBackToSvList();
                    });
                    window.clearInterval(time);
                }
            }, 20);

            $scope.addIcingSv = function () {
                var item = {
                    "icingTitle": "除防冰液",
                    "icingType": "",
                    "icingUnit": "1",
                    "dosage": '',
                    "icingManufacturer": "",
                    "durationOfEffect": "0:0",
                    "updater": configInfo.userCode,
                    "hour": 0,
                    "minute": 0
                };
                $scope.info.svInfo.antiIcingFluidVOs.push(item);
            };

            function deleteIcing(item, index) {
                if (typeof (item.id) != 'undefined') {
                    // $scope.info.svInfo.delIds.splice(index,1);
                    $scope.info.svInfo.delIds.push(item.id);
                }
                $scope.info.svInfo.antiIcingFluidVOs.splice(index, 1);
            }

            $scope.deleteIcingSv = function (item, index) {

                $rootScope.confirmInfo = "是否确认删除？";
                $rootScope.confirmShow = true;
                $rootScope.confirmOk = function () {
                    $rootScope.confirmShow = false;
                    deleteIcing(item, index);
                };
            };


            $scope.showModifyTime = function (item, index) {
                if ($scope.edit) {
                    $scope.editingIcingItem = angular.copy(item);
                    $scope.editingIcingIndex = index;
                    $scope.editTime = true;
                    var durationOfEffects = item.durationOfEffect.split(':');
                    if (typeof (item.durationOfEffect) != 'undefined') {
                        $scope.info.toolInfos.timeInfo.hour = durationOfEffects[0] / 1;
                        $scope.info.toolInfos.timeInfo.minute = durationOfEffects[1] / 1;
                    }
                    else {
                        $scope.info.toolInfos.timeInfo.hour = 0;
                        $scope.info.toolInfos.timeInfo.minute = 0;
                    }
                }
            };
            /**
             * state 为1 确定，2取消
             * */
            $scope.modifyTime = function (state) {
                $scope.editTime = false;
                if (state == 1) {
                    var item = $scope.editingIcingItem;
                    if ($scope.info.toolInfos.timeInfo.hour > 23) {
                        $scope.info.toolInfos.timeInfo.hour = 23;
                    }
                    if ($scope.info.toolInfos.timeInfo.minute > 59) {
                        $scope.info.toolInfos.timeInfo.minute = 59;
                    }
                    item.hour = $scope.info.toolInfos.timeInfo.hour;
                    item.minute = $scope.info.toolInfos.timeInfo.minute;
                    item.durationOfEffect = $scope.info.toolInfos.timeInfo.hour + ':' + $scope.info.toolInfos.timeInfo.minute;
                    $scope.info.svInfo.antiIcingFluidVOs.splice($scope.editingIcingIndex, 1, item);
                }
            };

            $scope.cancelEdit = function () {
                $scope.title = '用车信息查看';
                $scope.edit = false;
                $scope.info.svInfo = angular.copy($scope.historyInfo);
            };

            $scope.startEdit = function () {
                $scope.title = '用车信息编辑';
                $scope.edit = true;
                $scope.historyInfo = angular.copy($scope.info.svInfo);
            };


            $scope.$watch('info.toolInfos.startDate', function (n, o) {
                if (typeof (n) != 'undefined') {
                    var now = new Date();
                    if (now.getTime() < n.getTime()) {
                        $rootScope.limitTip = true;
                        $rootScope.shortLimitTip = true;
                        $rootScope.limitTipContent = "开始时间不能晚于当前时间";
                        $scope.info.toolInfos.startDate = o || new Date(listInfo.beginTime);
                    }
                    checkNoteRequire();
                    //使用时长
                    $scope.info.svInfo.lengthDate = $scope.info.toolInfos.endDate.getTime() - $scope.info.toolInfos.startDate.getTime();
                    $scope.info.svInfo.lengthDateStr = formatDuring($scope.info.svInfo.lengthDate);
                }
            });
            $scope.$watch('info.toolInfos.endDate', function (n, o) {
                if (typeof (n) != 'undefined') {
                    if ($scope.info.toolInfos.endDate.getTime() < $scope.info.toolInfos.startDate.getTime()) {
                        $rootScope.limitTip = true;
                        $rootScope.shortLimitTip = true;
                        $rootScope.limitTipContent = "结束时间不能早于开始时间";
                        $scope.info.toolInfos.endDate = o || new Date();
                    }

                    checkNoteRequire();
                    //使用时长
                    $scope.info.svInfo.lengthDate = $scope.info.toolInfos.endDate.getTime() - $scope.info.toolInfos.startDate.getTime();
                    $scope.info.svInfo.lengthDateStr = formatDuring($scope.info.svInfo.lengthDate);
                }
            });

            $scope.textChange = function () {
                if (typeof ($scope.info.svInfo.remark) != 'undefined' && $scope.info.svInfo.remark.length > 200) {
                    $scope.info.svInfo.remark = $scope.info.svInfo.remark.substring(0, 200);
                }
            };

            function formatDate(time) {
                time = parseInt(time / (1000 * 60));
                time = time * 1000 * 60;
                return time;
            }

            //备注是否必填逻辑控制
            function checkNoteRequire() {
                var svInfo = $scope.info.svInfo;
                var svType = svInfo.vehicleType;
                //正在使用中的电源车和客梯车，且超出阀值，则为必填
                if (svType == 1 || svType == 2 || svType == 3) {
                    var acType = $scope.taskInfo.acType;
                    var threshold = 0;
                    if (svType == 1 || svType == 2) { //电源车
                        if (acType.indexOf('737') != -1 || acType.indexOf('757') != -1) {
                            threshold = 4;
                        }
                        else {// 747,767
                            threshold = 6;
                        }
                    }
                    else if (svType == 3) {// 客梯车
                        threshold = 4;
                    }

                    if ($scope.info.toolInfos.endDate.getTime() - $scope.info.toolInfos.startDate.getTime() > threshold * 60 * 60 * 1000) {
                        $scope.requiredNote = true;
                    }
                    else {
                        $scope.requiredNote = false;
                    }
                }
                else {
                    $scope.requiredNote = false;
                }
            }

        }
    ]);