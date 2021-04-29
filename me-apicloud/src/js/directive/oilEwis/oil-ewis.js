angular.module("myApp")
    .directive('oilEwis', ['server', '$filter', '$rootScope', '$state','b64ToBlob',
        function (server, $filter, $rootScope, $state, b64ToBlob) {
            return {
                restrict: 'E',
                templateUrl: 'common/oil-ewis.html',
                replace: true,
                transclude: true,
                scope: {
                    edit: '=',
                    isHasEwis: '=',
                    ewisShow: "=",//显示/隐藏标识符
                    ewisState: '=', //0新建 1编辑 2详情 -1无效
                    ewisDto: '=',//ewis数组
                    ewisIndex: '=',//编辑或详情项目下标,没有传-1
                    ewisInfo: '=',
                    isHasOil: '=',
                    oilShow: "=",//显示/隐藏标识符
                    oilState: '=', //0新建 1编辑 2详情 -1无效
                    oilDto: '=',//oil数组
                    oilIndex: '=',//编辑或详情项目下标
                    oilInfo: '=',
                    acReg:'='
                },
                link: link
            };

            function link($scope, ele, attr) {

                $scope.hideApproverTitle = true;
                $scope.historyOilDto = [];//在切换isHasOil状态时，用于存储oilDto
                $scope.historyEwisDto = [];//在切换isHasEwis状态时，用于存储ewisDto
                $scope.isDeleting = false;

                $scope.ewisChanged = function (index) {

                    if (index === 1) {
                        $scope.isHasEwis = 'y';
                    }
                    else {
                        $scope.isHasEwis = 'n';
                    }

                    if ($scope.isHasEwis == 'y') {
                        $scope.ewisDto = $scope.historyEwisDto;
                    }
                    else {
                        $scope.historyEwisDto = $scope.ewisDto;
                        $scope.ewisDto = [];
                    }
                    console.log('7777' + $scope.isHasEwis);
                };

                $scope.spilOilChanged= function (index) {
                    if (index === 1) {
                        // $scope.isHasOil = $scope.isHasOil !== 'y' ?  'y' : '';
                        $scope.isHasOil = 'y';
                    }
                    else {
                        // $scope.isHasOil = $scope.isHasOil !== 'n' ?  'n' : '';
                        $scope.isHasOil = 'n';
                    }
                    console.log('7777' + $scope.isHasOil);


                    if ($scope.isHasOil == 'y') {
                        $scope.oilDto = $scope.historyOilDto;
                    }
                    else {
                        $scope.historyOilDto = $scope.oilDto;
                        $scope.oilDto = [];
                    }
                };

                $scope.goToAddSpilOil = function(event,oil,state,index) {
                    event.preventDefault();
                    if (state == 0) {
                        $scope.oilInfo =  {
                            "id":'',
                            "oilType":"",
                            "oilLeakPosition":"",
                            "otherDescription":"",
                            "oilComponent":0,
                            "oilRecord":"",

                        };
                    }
                    else {
                        $scope.oilInfo = oil;
                        $scope.oilIndex = index;
                    }
                    $scope.oilState = state;
                    $scope.oilShow = true;
                };

                $scope.goToAddEwis = function(event,ewis,state,index) {
                    event.preventDefault();
                    if (state == 0) {
                        $scope.ewisInfo = {
                            "id":'',
                            "componentTypeId":'',//部件类型id
                            "allNumber":"",//pn/sn/线号/设备号
                            "ewisType":"",//ewis类型（磨损/破损、割伤/划伤）
                            "otherDescription":"",
                            "staWlBl":"",//STA/WL/BL
                            "componentName": ''
                            // "attachmentsKey": [],
                            // "imgArr":[]
                        };
                    }
                    else {
                        $scope.ewisInfo = ewis;
                        $scope.ewisIndex = index;
                    }

                    $scope.ewisState = state;
                    $scope.ewisShow = true;
                };

                $scope.swipeDeleteOil = function(event,index) {
                    event.preventDefault();
                    var oil = $scope.oilDto[index];
                    $scope.delete('oil',oil.id,index);
                };
                function validateLine(val){
                    return val ? val :'0'
                };
                $scope.swipeDeleteEwis = function(event,index) {
                    event.preventDefault();
                    var ewis = $scope.ewisDto[index];

                    if(ewis.treatmentMethod == 1 && ewis.lineEquipmentType == 1 && ewis.extlineNumList && ewis.extlineNumList[0].lineNum1){
                        var regLine = /^[0]+/;
                        var firstFlag = false
                        var delArr = new Array();
                        for(var i = 0 ; i < ewis.extlineNumList.length ; i++){
                            delArr[0] = ewis.extlineNumList[i].id;
                            var ewisCheckDate = {
                                acReg:$scope.acReg,
                                lineNum:ewis.extlineNumList[i].lineNum1 + '-' + validateLine(ewis.extlineNumList[i].lineNum2.replace(regLine,"")) + '-' + validateLine(ewis.extlineNumList[i].lineNum3.replace(regLine,"")) + '-' + validateLine(ewis.extlineNumList[i].lineNum4.replace(regLine,"")),
                                ids:delArr
                            };
                            if($scope.acReg){
                                server.maocPostReq('TLB/getIsLineNumRepeatFlag',ewisCheckDate,true).then(function (data) {
                                    if (200 == data.data.statusCode) {
                                        var flag = data.data.data[0];
                                        (!firstFlag && flag) && ($rootScope.errTip = '新增接线管不应超过3个，该导线已进行过接线处理，请核实')
                                        flag && (firstFlag = true);
                                    }

                                }).catch(function (error) {
                                    console.log(error);
                                    // alert('Ewis信息失败');
                                });
                            }
                        }


                    }
                    $scope.delete('ewis',ewis.id,index);
                };

                $scope.delete = function (type,id,index) {
                    if ($scope.isDeleting) {
                        return;
                    }

                    $rootScope.startLoading();
                    var params = {
                        type: type,
                        id:id
                    };
                    server.maocPostReq('TLB/deleteEwisOrOil',params).then(function (response) {
                        $scope.isDeleting = false;
                        $rootScope.endLoading();

                        if(200 == response.data.statusCode) {
                            if (type == 'ewis') {
                                $scope.ewisDto.splice(index,1);
                            }
                            else if(type == 'oil') {
                                $scope.oilDto.splice(index,1);
                            }
                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        $scope.isHasEwis = false;
                    });
                }

            }
        }]);