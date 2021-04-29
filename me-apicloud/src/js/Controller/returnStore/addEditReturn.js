module.exports = angular.module('myApp').controller('addEditReturn',
    ['$rootScope', '$scope', '$filter', '$stateParams', '$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter, $stateParams, $interval, $localForage, configInfo, b64ToBlob, $timeout) {
            console.log('stateparams'+JSON.stringify($stateParams));
            $rootScope.endLoading();

            $scope.hideApproverTitle = true;//隐藏选人默认状态
            $scope.typeData = [
                {
                    TEXT:'领出未用退料',
                    VALUE:'2'
                },
                {
                    TEXT:'拆下无序号退料',
                    VALUE:'3'
                },
                {
                    TEXT:'装机未用退料',
                    VALUE:'4'
                },

            ];
            $scope.materialData = [
                {
                    TEXT:'可用件',
                    VALUE:'B'
                },
                {
                    TEXT:'不可用件',
                    VALUE:'A'
                },
                {
                    TEXT:'待观察件',
                    VALUE:'C'
                },

            ];
            $scope.materialUnit = [ ];
            $scope.isApiCloud = false; //上传附件时是否要用apiCloud方法
            $scope.fileArr = [];  //要上传的二进制流
            $scope.fileId = [];  //要上传的二进制流


            $scope.staInfo = {station:''};
            // $scope.workStation = {station:''};
            $scope.onPn = {
                partno:'',
                noBorder:true,
                description:'',
            };
            $scope.mech = {
                nameAndId: '',
                approverSn: '',
                approverName:'',
            };
            $scope.fromHome = $stateParams.fromHome;
            $scope.mrList = [];
            $scope.allPackage = 'n'
            $scope.toStation = '目的航站';
            $scope.$watch('staInfo.station',function (n,o) {
                if(n && n.toUpperCase() == $scope.insertJson.fromStation.toUpperCase()){
                    $scope.insertJson.transport = 2;
                }
            });
            $scope.$watch('onPn.description',function (n,o) {
               n && isChangePack($scope.onPn.partno);
            });
            $scope.$watch('mrInfo.nrcPn.udro',function (n,o) {
               if(n && n!==0){
                   $scope.mrInfo.qty = 1;
               }
            });
            $scope.$watch('onPn.partno',function (n,o) {
                if(!!n && n.length > 2){
                    $scope.searchBalanceInfo();
                }
            });
            //判断是否改装包
            function isChangePack(pn){
                server.maocGetReq('material/isModifyPackage/' + pn).then(function (respon) {
                    if (respon.data.statusCode === 200){
                        $scope.showPack = respon.data.data[0];
                    }
                })
            };
            $scope.scan = function () {
                var FNScanner = api.require('FNScanner');
                FNScanner.open({
                    autorotation: true,
                    encoding:1
                }, function(ret, err) {
                    if (ret.content) {
                        var reg =  /[a-zA-Z]/g;
                        // var tlbCode = ret.content.replace(reg,"

                        $timeout(function() {
                            console.info(ret.content.split(','));
                            var reponArr = ret.content.split(',');
                            $scope.onPn.partno = reponArr[1];
                            $scope.insertJson.batchNo = reponArr[2]
                            if(reponArr[0] == 'C'){
                                $scope.insertJson.mrNo = (reponArr[3] && "MR" + reponArr[3]);
                                $scope.insertJson.mrItem = reponArr[4] || '';
                            }
                            if(reponArr[0] == 'R'){
                                $scope.insertJson.sn = reponArr[3] || '';
                                $scope.insertJson.mrNo = reponArr[5] || '';
                                $scope.insertJson.mrItem = reponArr[6] || '';
                            }
                        });
                    }
                });
            };
            $scope.upWay = 'cancelStock';
            $scope.unitEdit = '';
            $scope.initPage = function(){
                if($stateParams.returnId){
                    //edit Page
                    $scope.isEdit = true;
                    var params = {id:$stateParams.returnId};
                    server.maocGetReq('cancelStock/selectById',params).then(function(data){
                        if (data.status == 200) {
                            $scope.insertJson = data.data.data[0];
                            $scope.insertJson.sendBackTime = new Date($filter('date')($scope.insertJson.sendBackTime, 'yyyy/MM/dd HH:mm'));
                            $scope.staInfo.station = $scope.insertJson.toStation;
                            $scope.onPn.partno = $scope.insertJson.pn;
                            $scope.onPn.chunit = $scope.insertJson.unit;
                            $scope.unitEdit = $scope.insertJson.unit;
                            $scope.materialUnit[0]=$scope.insertJson.unit;
                            $scope.mech.approverSn = $scope.insertJson.sendBackNumber;
                            $scope.mech.approverName = $scope.insertJson.sendBackName;
                            $scope.mech.nameAndId = $scope.insertJson.sendBackName + '(' + $scope.insertJson.sendBackNumber + ')';

                        }
                        //编辑的时候延时覆盖掉有watch查出来的单位
                        setTimeout(function () {
                            $scope.$apply(
                                function () {
                                    $scope.insertJson.unit = $scope.unitEdit;
                                }
                            );
                        },800)
                    }).catch(function(error){
                        console.log(error);
                    });

                    //附件
                    server.maocGetReq('assembly/selectFileByCategoryAndSourceId',{sourceId:$stateParams.returnId,category:'cancelStock'}).then(function(data){
                        if (data.data.statusCode == 200) {
                            angular.forEach(data.data.data, function (item, index) {
                                if (item.type == 'mp3') {
                                    $scope.uploadSoundArr.push({
                                        soundData: item.content,
                                        type: '.mp3',
                                        length: (item.size / 1000).toFixed(1)
                                    });
                                } else if(item.type.indexOf('image') != '-1'){
                                    if(typeof (item.content) != 'undefined') {
                                        var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                        var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                        var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                        imgBlob.name = item.name.indexOf('down') == -1
                                            ? imgName + 'down' + imgType
                                            : item.name;
                                        imgBlob.id = item.id;
                                        $scope.fileArr.push(imgBlob);
                                        $scope.fileId.push(item.id);
                                        $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                    }
                                };
                            })
                        }
                    }).catch(function(error){
                        $rootScope.endLoading();
                        console.log(error);
                    });

                }else{
                    //add Page
                    $scope.isEdit = false;
                    $scope.insertJson = {
                        flightNo:$stateParams.rtFlightNo,
                        flightId:$stateParams.rtFlightId,
                        fromStation:$stateParams.workStation,
                        pn:$scope.onPn.partno,
                        unit:"",
                        toStation:$scope.staInfo.station,
                        workorderId:$stateParams.returnOrderId,
                        sendBackName:$scope.mech.approverName,
                        sendBackNumber:$scope.mech.approverSn,
                    };

                }


            };
            $scope.initPage();
            $scope.takeMr = function(v){
                $scope.insertJson.mrNo = v.mrNo;
                // $scope.insertJson.unit = v.unit;
                $scope.insertJson.qty = v.qty;
                $scope.insertJson.mrItem = v.mrItem;
                $scope.insertJson.batchNo = v.batchNo;
                $scope.insertJson.sn = v.sn;
                $scope.chooseMr = false ;
            };
            $scope.toMrList = function () {
                if($scope.isEdit) return;
                if($scope.onPn.partno == ''){
                    $rootScope.errTip = '请先选择件号';
                    return false
                }
                $scope.chooseMr = true ;
                var params = {
                    batchNo:$scope.insertJson.batchNo || '',
                    pn:$scope.onPn.partno,
                    sn:$scope.insertJson.sn || '',
                };
                server.maocPostReq('cancelStock/getRelationMrByCondition/' + $stateParams.returnOrderId ,params,true).then(function(data){
                    if (data.status == 200) {
                        $scope.mrList = data.data.data || [];
                    }
                }).catch(function(error){
                    console.log(error);
                });
            };
            // {
            //     "flightNo": "O37181",
            //     "flightId": 100818831,
            //     "fromStation": "HHA",
            //     "pn": "251N3181-5",
            //     "toStation": "SZX",
            //     "workorderId": "71903993",
            //     "sendBackName": "陈家宝",
            //     "sendBackNumber": "01379041",
            //     "cancelStockType": "2",
            //     "batchNo": "25744",
            //     "sn": "244",
            //     "mrNo": "29713",
            //     "unit": "EA",
            //     "qty": 1,
            //     "mrItem": "1",
            //     "cancelStockQty": 25,
            //     "transport": 2,
            //     "sendBackTime": 1585291740000,
            //     "reason": "55555",
            //     "workOrderId": "71903993"
            // }
            $scope.mrInfo = {}
            $scope.addMateriate = function(){
                $scope.addMrFlow = true ;
                $scope.mrInfo.nrcPn = {} ;
                $scope.mrInfo.qty = '' ;
                $scope.mrInfo.sn = '' ;
                $scope.mrInfo.mrUnit = '' ;
                $scope.mrInfo.nrcPn.description = '';
                $scope.mrInfo.nrcPn.chunit = '';
                $scope.mrInfo.nrcPn.unit = '';
                $scope.mrInfo.nrcPn.itemnum = '';
                $scope.mrInfo.nrcPn.partno = '';
            }

            $scope.mrDto = [];
            $scope.addmrSure = function(){
                if($scope.mrInfo.nrcPn.udro !== 0 && $scope.mrInfo.sn.trim() == '' && $scope.insertJson.cancelStockType != 3){
                    $rootScope.errTip = '非消耗件序号必填';
                    return;
                }
                var obj = {
                    childPn:$scope.mrInfo.nrcPn.partno,
                    childQty:$scope.mrInfo.qty,
                    childUnit:$scope.mrInfo.nrcPn.chunit,
                    childSn:$scope.mrInfo.sn,
                }
                if($scope.editFlow){
                    $scope.mrDto[$scope.editIndex] = obj;
                }else{
                    $scope.mrDto.push(obj);
                }
                $scope.editFlow = false;
                $scope.addMrFlow = false ;
            }

            $scope.editSv = function(item,event,i){
                if($scope.mrDto[i].success && $scope.mrDto[i].success == '1'){
                    $rootScope.errTip = '已提交成功的航材不能再次编辑';
                    return;
                }

                $scope.mrInfo.nrcPn.partno = item.childPn;
                $scope.mrInfo.qty = item.childQty;
                $scope.mrInfo.nrcPn.chunit = item.childUnit;
                $scope.mrInfo.sn = item.childSn;
                $scope.editFlow = true;
                $scope.editIndex = i;
                $scope.addMrFlow = true ;
            };

            $scope.deleteSv = function(item,event,index){
                if($scope.mrDto[index].success && $scope.mrDto[index].success == '1'){
                    $rootScope.errTip = '已提交成功的航材不能删除';
                    return;
                }
                $scope.mrDto.splice(index,1);

            };
            $scope.searchTip = function(){
                if (!$scope.onPn.partno) {
                    alert("请先输入件号");
                    return;
                };
            };

            $scope.searchBalanceInfo = function(){
                var getUnitParam = {
                    inputValue: $scope.onPn.partno,
                    isAccurate: true,
                    pageIndex:"1",
                    pageSize:"20",
                    station: ""
                };
                $scope.materialUnit =[];
                    $rootScope.startLoading();
                    server.maocGetReq('mr/getMe2MRMaximoInventoryBalanceInfo', getUnitParam).then(function(data) {
                        if(200 === data.status) {
                            // console.log("查询到的数据"+JSON.stringify(data.data.data));
                            if(!!data.data.data[0] && !!data.data.data[0].allunit){
                                $scope.materialUnit = data.data.data[0].allunit;
                                if($scope.materialUnit.length == 1){
                                    $scope.insertJson.unit = $scope.materialUnit[0];
                                };
                                if(!!data.data.data[0].unit){
                                    $scope.insertJson.unit = data.data.data[0].unit;
                                };
                                // console.log("单位的数据"+JSON.stringify($scope.materialUnit));
                            }else {
                                $scope.materialUnit[0] = "EA";
                                $scope.insertJson.unit = "EA";
                            }
                        };
                        $rootScope.endLoading();
                    }).catch(function(error) {
                        console.log(error);
                        $rootScope.endLoading();
                    });
            };

            $scope.submitMethod = function () {
                console.log("insertJson.cancelStockType"+JSON.stringify($scope.insertJson.cancelStockType));
                if(!$scope.insertJson.cancelStockType){
                    $rootScope.errTip = '退料类型必填';
                    return;
                };
                if(!$scope.insertJson.cancelStockQty){
                    $rootScope.errTip = '退料数量必填';
                    return
                }
                if($scope.insertJson.reason.trim() == ''){
                    $rootScope.errTip = '拆下挂签里的拆下故障原因';
                    return
                }
                if($scope.insertJson.cancelStockType != '5' && $scope.insertJson.cancelStockType != '3'){
                    if( parseInt($scope.insertJson.cancelStockQty) > parseInt($scope.insertJson.qty) ){
                        $rootScope.errTip = '退料数量不能大于发料数量';
                        return
                    }
                }

                if(!$scope.onPn.partno){
                    $rootScope.errTip = '件号必填';
                    return
                }
                if(!$scope.insertJson.transport){
                    $rootScope.errTip = '是否随机必填';
                    return
                }
                if(!$scope.insertJson.mrNo && $scope.insertJson.cancelStockType !=3){
                    $rootScope.errTip = 'MR编号必填';
                    return
                }
                if(!$scope.mech.approverName){
                    $rootScope.errTip = '退料人必填';
                    return
                }
                if(!$scope.staInfo.station){
                    $rootScope.errTip = '目的航站必填';
                    return
                }
                if(!$scope.insertJson.sendBackTime ){
                    $rootScope.errTip = '退料时间必填';
                    return
                }
                if(!$scope.insertJson.airMaterialState ){
                    $rootScope.errTip = '航材状态必填';
                    return
                }
                $rootScope.startLoading();
                // console.info($scope.fileArr);
                var params = angular.copy($scope.insertJson);
                var reg =  /[a-zA-Z]/g;
                params.mrNo =  String(params.mrNo).replace(reg,"");
                params.cancelStockQty = parseInt($scope.insertJson.cancelStockQty);
                params.qty = parseInt($scope.insertJson.qty);
                params.flightId = $scope.insertJson.flightId;
                // params.unit = $scope.onPn.chunit;
                params.transport = $scope.insertJson.transport;
                params.pn = $scope.onPn.partno;
                params.toStation = $scope.staInfo.station.toUpperCase();
                params.sendBackName = $scope.mech.approverName;
                params.sendBackNumber = $scope.mech.approverSn;
                params.sendBackTime = parseInt($scope.insertJson.sendBackTime.getTime());
                // if($scope.fromHome){
                //     params.fromStation = $scope.workStation.station;
                // }
                if($scope.showPack && $scope.insertJson.cancelStockType == '2'){
                    if(!$scope.allPackage){
                        $rootScope.errTip = '退库方式必填';
                        $rootScope.endLoading();
                        return
                    }
                    if($scope.mrDto.length == 0 && $scope.allPackage == 'n'){
                        $rootScope.errTip = '航材清单至少一条';
                        $rootScope.endLoading();
                        return
                    }
                    if($scope.allPackage == 'n'){
                        // params.allPackage = ($scope.allPackage == 'y' ? true : false);
                        params.allPackage = false;
                        angular.forEach($scope.mrDto,function (item,i) {
                            !item.success && circleSub(params,item,i)
                        })
                    }
                    if($scope.allPackage == 'y'){
                        params.allPackage = true;
                        server.maocFormdataPost('form/submit', 'cancelstock-001-a', params, $scope.fileArr).then(function (data) {
                            if (200 === data.status) {
                                api.alert({
                                    msg:'新增成功'
                                },function () {
                                    $rootScope.go('back')
                                })

                            } else {
                                $rootScope.errTip = data.data;
                            }
                            $rootScope.endLoading();
                        }).catch(function (error) {
                            $rootScope.endLoading();
                        });
                    }
                }else{
                    if($scope.isEdit){
                        server.maocFormdataPost('form/submit', 'cancelstock-001-a', params).then(function (data) {
                            if (200 === data.status) {
                                api.alert({
                                    msg:'编辑成功'
                                },function () {
                                    $rootScope.go('back')
                                })

                            } else {
                                $rootScope.errTip = data.data;
                            }
                            $rootScope.endLoading();
                        }).catch(function (error) {
                            $rootScope.endLoading();
                        });
                    }else{
                        server.maocFormdataPost('form/submit', 'cancelstock-001-a', params, $scope.fileArr).then(function (data) {
                            if (200 === data.status) {
                                api.alert({
                                    msg:'新增成功'
                                },function () {
                                    $rootScope.go('back')
                                })

                            } else {
                                $rootScope.errTip = data.data;
                            }
                            $rootScope.endLoading();
                        }).catch(function (error) {
                            $rootScope.endLoading();
                        });
                    }
                }
            }
            function circleSub(params,item,i) {
                var param = Object.assign(params,item)
                param.success && delete param.success;
                server.maocFormdataPost('form/submit', 'cancelstock-001-a', param, $scope.fileArr).then(function (data) {
                    if (200 === data.status) {
                        $scope.mrDto[i].success = '1'

                        var flag = true;

                        for(var j in $scope.mrDto){
                            if($scope.mrDto[j].success && $scope.mrDto[j].success == '0'){
                                flag = false
                            }
                            if(!$scope.mrDto[j].success){
                                flag = false
                            }
                        };
                        flag && (api.alert({
                                    msg:'提交成功'
                                },function () {
                                    $rootScope.go('back')
                                }))

                    } else {
                        api.alert({
                            msg:'航材清单第' + (i*1+1) +'条新增失败'
                        },function () {
                            $scope.mrDto[i].success = '0';
                            console.info($scope.mrDto);
                            $rootScope.errTip = data.data;
                        })

                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            }


        }
    ]);


