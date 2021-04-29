module.exports = angular.module('myApp').controller('damageDraftDetailController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$filter', 'b64ToBlob',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob) {
           $rootScope.endLoading();
            $scope.needRequest = $stateParams.needRequest;
            $scope.listItem = $stateParams.listItemInfo || {};
            $scope.id = $scope.listItem.id ;
            var routerInfo = $stateParams.info;
            function initInfo() {
                $scope.info = {
                    damageInfo: {
                        checkType: "",
                        drBaseDefectViewDTOS: [],
                        operator: "SFN",
                        id:'',
                        checkMethod:'1',
                        defect:''
                    },
                    toolInfos: {
                        flightNoInfo: {},
                        ataInfo: {},
                        workOrderInfo: {},
                        workcardInfo:{},
                        checkMethods:[
                            {name:'一般目视',value:"1"},
                            {name:"详细目视", value:"2"},
                            {name:"NDT",value:"3"},
                            {name:"其它",value:"4"},
                            {name:"敲击检查",value:"5"}
                        ],
                        ndtCategorys:[],
                        damageTypes: [],
                        damageReasons :[],
                        selectedDamageTypes:[],
                        selectedDamageReasons:[],
                        selectNdtCategory:'',
                        drDate: new Date(),
                        today: new Date(),
                        drBaseDefectIds: []
                    }
                };
                if (typeof (routerInfo.damageInfo) != 'undefined') {
                    $scope.info = routerInfo;
                }
            }
            initInfo();

            $scope.$watch('info.toolInfos.drDate',function (n,o) {
                console.log('1111'  + n);
                if (n == null) { $scope.info.toolInfos.drDate = angular.copy($scope.info.toolInfos.today); return ;}
               if (typeof(n) == 'undefined' || n == null) { return ;}
               if ($scope.info.toolInfos.drDate.getTime() > $scope.info.toolInfos.today.getTime()) {
                   $rootScope.errTip = '发现日期时间不能超过当前日期';
               }
            });

            //提交请求，区分是提交草稿还是，状态转换。提交草稿为新建与修改草稿，
            // 状态转换为将损伤从草稿状态变为生效状态。并从草稿列表中移除
            $scope.submit = function (isSubmit) {

                var param = angular.copy($scope.info.damageInfo);
                param.aircraft = $scope.info.toolInfos.flightNoInfo.value;
                param.model = $scope.info.toolInfos.flightNoInfo.pid;
                param.ata = $scope.info.toolInfos.ataInfo.value;
                param.wo = $scope.info.toolInfos.workOrderInfo.woNo;
                param.maintenanceLevel = $scope.info.toolInfos.workOrderInfo.type;
                param.cardNumber = $scope.info.toolInfos.workcardInfo.cardNo;
                // param.drDate = $filter('date')($scope.info.toolInfos.drDate,'yyyy-MM-dd hh:mm:ss');
                param.drDate = $scope.info.toolInfos.drDate.getTime();
                param.defectReason = $scope.info.toolInfos.selectedDamageReasons.join(',');
                param.defectType = $scope.info.toolInfos.selectedDamageTypes.join(',');
                param.drBaseDefectIds = $scope.info.toolInfos.drBaseDefectIds;
                param.equipment = 2;
                if (typeof (param.drBaseDefectViewDTOS) != 'undefined') {
                    delete param.drBaseDefectViewDTOS;
                }
                var user = configInfo.userCode;
                param.user = user;

                $rootScope.startLoading();

                var url = isSubmit ? 'asms/drBaseMobile/drBaseSubmit':'asms/drBaseMobile/editDrBase' ;
                if (isSubmit) {
                    $scope.showConfirmState = false;
                }
                server.maocPostReq(url,param,true).then(function (res) {
                    $rootScope.endLoading();
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        if (response.succ == 'ok') {

                            if (isSubmit) {
                                $rootScope.go('damageDraftList',{});
                            }
                            else {
                                $scope.info.damageInfo.id = response.msg;
                                $scope.id = response.msg;
                                $scope.getDraftDetail($scope.id);
                            }
                        }else{
                            alert(response.msg)
                        }
                    }
                });
            };

            //

            $scope.getDraftDetail = function() {
                if (typeof ($scope.id != 'undefined')) {
                    var path = 'asms/drBaseMobile/findDrBase/' + $scope.id;
                    $rootScope.startLoading();
                    server.maocGetReq(path,{}).then(function (res) {
                        $rootScope.endLoading();
                        var statusCode = res.data.statusCode;
                        if (statusCode == 200) {
                            var response = res.data.data[0];
                            var result = response.result;
                            $scope.info.damageInfo = response.result;
                            $scope.info.toolInfos.flightNoInfo.value = result.aircraft;
                            $scope.info.toolInfos.flightNoInfo.label = result.aircraft;
                            $scope.info.toolInfos.ataInfo.label = result.ata;
                            $scope.info.toolInfos.ataInfo.value = result.ata;
                            $scope.info.toolInfos.workOrderInfo.woNo = result.wo;
                            $scope.info.toolInfos.workOrderInfo.type = result.maintenanceLevel;

                            $scope.info.toolInfos.workcardInfo.cardNo = result.cardNumber;
                            $scope.info.toolInfos.drDate = getDate(result.drDate);
                            $scope.info.toolInfos.selectedDamageTypes = result.defectType.split(',');
                            $scope.info.toolInfos.selectedDamageReasons = result.defectReason.split(',');
                            var drBaseDefectIds = [];
                            angular.forEach(result.drBaseDefectViewDTOS, function (item) {
                                drBaseDefectIds.push(item.id);
                            });
                            $scope.info.toolInfos.drBaseDefectIds = drBaseDefectIds;

                        }
                    });
                }
            };

            //字符串转日期
            function getDate(strDate) {
                console.log('xx' + strDate);

                if (typeof (strDate) == 'string') {
                    var st = strDate;
                    var a = st.split(" ");
                    var b = a[0].split("-");
                    var c = a[1].split(":");
                    // var date = new Date(b[0], b[1], b[2], c[0], c[1], c[2]);

                    var date = new Date(strDate.replace(/-/g, '/'));
                    console.log('12' + date);
                    return date;
                }
                else {
                    var date = new Date(strDate);
                    console.log('22' + date);

                    return date;
                }

            }


            $scope.sortNumberArray = function (op) {
                return op;
            };

            function getNdtCategorys() {
                server.maocGetReq('asms/drBaseMobile/queryDictionaries/DamageSetting_CheckMode').then(function (res) {
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        $scope.info.toolInfos.ndtCategorys = response.result;
                    }
                });
            }


            function getDamageTypes() {
                server.maocGetReq('asms/drBaseMobile/queryDefectTypes').then(function(res){
                    console.log('queryDefectTypes' + JSON.stringify(res));
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        var result = response.result;
                        $scope.info.toolInfos.damageTypes = result;
                        // $scope.info.toolInfos.damageTypes = $filter('orderBy')(result,'value');
                    }
                });
            }


            function getDamageReasons() {
                server.maocGetReq('asms/drBaseMobile/queryDefectReasons').then(function (res) {
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        var result = response.result;
                        $scope.info.toolInfos.damageReasons = result;
                        // $scope.info.toolInfos.damageReasons = $filter('orderBy')(result,'value');
                    }
                });
            }

            $scope.showConfirmState = false;
            $scope.showConfirm = function () {
                $scope.showConfirmState = true;
            };
            $scope.hideConfim = function () {
                $scope.showConfirmState = false;
            }

            $scope.deleteSize = function (item, index,$event) {
                $rootScope.startLoading();
                $event.stopPropagation();
                server.maocGetReq('asms/drBaseMobile/deleteDrBaseDefect',{id:item.id,user: configInfo.userCode}).then(function (res) {
                    $rootScope.endLoading();
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        if (response.succ == 'ok') {
                            $scope.info.damageInfo.drBaseDefectViewDTOS.splice(index,1);
                            var ind = $scope.info.toolInfos.drBaseDefectIds.indexOf(item.id);
                            $scope.info.toolInfos.drBaseDefectIds.splice(ind,1);
                        }
                    }
                });

            };

            if ($scope.info.toolInfos.damageTypes.length == 0) {
                getDamageTypes();
            }
            if ($scope.info.toolInfos.damageReasons.length ==0 ){
                getDamageReasons();
            }
            if ($scope.info.toolInfos.ndtCategorys.length == 0) {
                getNdtCategorys();
            }

            if ($scope.needRequest) {
                $scope.getDraftDetail();
            }

        }    
    ]);