module.exports = angular.module('myApp').controller('svListController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$filter', 'b64ToBlob','$interval',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob,$interval) {
            $rootScope.endLoading();
            var interval = null;//全局计时器
            var taskInfo = $stateParams.taskInfo;
            var localKey = taskInfo.flightId || taskInfo.jobId + '';//OG类型不存在flightId，用jobId代替
            var localSvList = [];
            $scope.svList = [];
            $scope.userCode = configInfo.userCode;

            /*
            * 工具
            * */
            $scope.svTypes = [
                {name:'地面电源',value: 1},
                {name:"电源车",value:2},
                {name:"客梯车",value:3},
                {name:"气源车",value:4},
                {name:"除防冰车",value:5}
            ];
            $scope.showOptions = false;

            /*
            * 本地数据处理，数字>对象
            * */
            function readLocalSvList(key) {
                if (typeof (key) != 'undefined' && key.length != '') {
                    $localForage.getItem(key).then(function(val){
                        localSvList = val || [];
                        $scope.svList = [];
                        $scope.svList = $scope.svList.concat(localSvList);
                        $scope.getSvList();
                    });
                }
            }
            readLocalSvList(localKey);

            function writeLocalSvList(key) {
                if (typeof (key) != 'undefined' && key.length != '') {
                    $localForage.setItem(key, localSvList).then(function (val) {
                        readLocalSvList(localKey);
                    });
                }
            }

            /*
            * 开始和关闭使用
            * */

            $scope.startUseSv = function (item,index) {
                var params = angular.copy(item);
                var now = new Date();
                params.beginTime = (now.getTime() / (60 * 1000)) * (60 * 1000);
                params.status = '1';
                $rootScope.startLoading();
                server.maocPostReq('ghsSpv/saveVehicleInfo',params,true).then(function (res) {
                    $rootScope.endLoading();
                    var resoponse = res.data;
                    if (resoponse.statusCode == 200) {
                        var messItem = res.data.data[0];
                        if (messItem.success == 1) {
                            localSvList.splice(index,1);
                            writeLocalSvList(localKey);
                        }
                    }
                    else {
                        alert('请求失败');
                    }
                });
            };

            //带id则表示结束使用，或者结束使用后的编辑
            $scope.closeSv = function (item, index) {

                closeSvInDetail(item,index);
            };

            function closeSvInDetail(item, index) {
                $rootScope.go('svDetail','slideLeft',{state:1,taskInfo:taskInfo,listInfo:item});
            }

            /**
             * 新增特车
             * */

            function addSv(item) {
                localSvList.unshift(item);
                $scope.svList.unshift(item);
                writeLocalSvList(localKey);
            }

            /*
            * 获取列表数据相关
            */
            function getSvList(param) {
                $rootScope.startLoading();
                server.maocGetReq('ghsSpv/getVehicleList',param).then(function (res) {
                    $rootScope.endLoading();
                    var resoponse = res.data;
                    if (resoponse.statusCode == 200) { //204为内容为空
                        var list = resoponse.data;
                        $scope.svList = $scope.svList.concat(list);

                        var now = new Date();
                        angular.forEach($scope.svList,function (item,index) {

                            if (item.status == 1) {
                                item.lengthDate = now.getTime() - item.beginTime;
                                item.lengthDateStr = formatDuring(item.lengthDate);
                            }
                            else if (item.status == 2) {
                                item.lengthDate = item.endTime - item.beginTime;
                                item.lengthDateStr = formatDuring(item.lengthDate);
                            }
                        });

                        startInterval();
                    }
                });
            }

            $scope.getSvList = function(){
                var jobIds = [];
                if (taskInfo.type == 0) {
                    if (typeof (taskInfo.departureStationJob.jobId) != 'undefined') {
                        jobIds.push(taskInfo.departureStationJob.jobId);
                    }
                    if (typeof (taskInfo.arrivalStationJob.jobId) != 'undefined') {
                        jobIds.push(taskInfo.arrivalStationJob.jobId);
                    }
                }
                else if (taskInfo.type == 1) {
                    if (typeof (taskInfo.jobId) != 'undefined') {
                        jobIds.push(taskInfo.jobId);
                    }
                }

                if (jobIds.length > 0) {
                    var jobIdStr = jobIds.join(',');
                    var param = {
                        jobIds: jobIdStr,
                        creater: configInfo.userCode
                    };
                    getSvList(param);
                }
            };

            //前往编辑页面
            $scope.editSv = function (item,ev) {
                ev.stopPropagation();
                $rootScope.go('svDetail','slideLeft',{state:3,taskInfo:taskInfo,listInfo:item});
            };

            $scope.deleteLocalSv = function (item,ev,index) {
                ev.stopPropagation();
                localSvList.splice(index,1);
                writeLocalSvList(localKey);
                $scope.svList.splice(index,1);
            };

            $scope.deleteSv = function (item,ev,index) {
                ev.stopPropagation();
                $rootScope.startLoading();
                server.maocPostReq('ghsSpv/delVehicleInfoById',{id: item.id}).then(function (response) {
                    $rootScope.endLoading();
                    var data = response.data.data[0];
                    if (1 == data.success ) {
                        console.log('===' + JSON.stringify(data));
                        readLocalSvList(localKey);
                    }
                    else {
                        alert('删除失败');
                    }
                });
            };

            /*
            * 工具
            * */

            //计时器
            function startInterval () {
                if (interval != null) {
                    $interval.cancel(interval);
                }
                interval = $interval(function () {
                    angular.forEach($scope.svList,function (item,index) {
                        if (item.status == 1) {
                            item.lengthDate += 1000;
                            item.lengthDateStr = formatDuring(item.lengthDate);
                        }
                    });
                },1000);
            }

            function formatDuring(mss) {
                var days = parseInt(mss / (1000 * 60 * 60 * 24));
                var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = parseInt((mss % (1000 * 60)) / 1000);
                if (days > 0) {
                    return days + " 天 " + formateUnit(hours) + ":" + formateUnit(minutes) + ":" + formateUnit(seconds);
                }
                else {
                    return formateUnit(hours) + ":" + formateUnit(minutes) + ":" + formateUnit(seconds);
                }
            }

            function formateUnit(number) {
                if (number < 10) {
                    return '0' + number;
                }
                else {
                    return number;
                }
            }

            //选中即创建
            $scope.selectOption = function (item) {
                $scope.showOptions = false;
                var requestParam = {};
                var userCode = configInfo.userCode;

                if (taskInfo.type == 0) { //航前、过站、航后、OG、N/A，其中N/A不能使用特车
                    var stationJob = {};
                    if (!angular.equals(taskInfo.arrivalStationJob,{})) {
                        stationJob = taskInfo.arrivalStationJob;
                    }
                    else {
                        stationJob = taskInfo.departureStationJob;
                    }
                    requestParam = {
                        "jobId": stationJob.jobId,
                        "flightId": taskInfo.flightId,
                        "flightNo": taskInfo.flightNo,
                        "acReg": taskInfo.acReg,
                        "model": taskInfo.acType,
                        "fromStation": taskInfo.departureAirport3Code,
                        "toStation": taskInfo.arrivalAirport3Code,
                        "checkType": stationJob.jobType,
                        "station": stationJob.station,
                        "vehicleTitle": item.name,
                        "vehicleType": item.value,
                        "creater": userCode,
                        "status":"0", //(0 未使用 1 正在使用 2 使用完成)
                        "jobDate": stationJob.jobDate
                    };
                }
                else if( taskInfo.type == 1) { //OG类型,产出报表时不要求航班号等航班信息
                    requestParam = {
                        "jobId": taskInfo.jobId,
                        "acReg": taskInfo.acReg,
                        "checkType": taskInfo.jobType,
                        "station": taskInfo.station,
                        "vehicleTitle": item.name,
                        "vehicleType": item.value,
                        "creater": userCode,
                        "status":"0",
                        "jobDate": taskInfo.jobDate,
                        "model": taskInfo.acType
                    };
                }
                else { //type == 2 STA类型,sta不能添加车辆，在维修任务侧滑入口限制,此处不需处理

                }

                addSv(requestParam);
            };

            $scope.goToSvDetail = function (item,ev) {
                $rootScope.go('svDetail','slideLeft',{state:2,taskInfo:taskInfo,listInfo:item});
            };

            $scope.goBack = function () {
                $rootScope.go('me', 'slideLeft', {time: $rootScope.preTimeParse});
            };

            //安卓返回键
            var time = window.setInterval(function () {
                if (typeof api !== 'undefined') {
                    api.addEventListener({
                        name: 'angularKeyback'
                    }, function (ret, err) {
                        $scope.goBack();
                    });
                    window.clearInterval(time);
                }
            }, 20);

        }
    ]);