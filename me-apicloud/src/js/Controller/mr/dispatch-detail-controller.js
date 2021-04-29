module.exports = (function() {
    angular.module('myApp').controller('dispatchDetailController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
        function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
        {
            var that = this,total = 0;
            $scope.dataList = [];
            $scope.prohibitList = [];
            $scope.dropdown = false;

            $rootScope.endLoading();

//返回
            $scope.goBack = function(){
                $rootScope.go('back');
            };

//父页面带来的数据数据
            $scope.item = {
                showDes:false,
                refuseReasonPend:'',
                mrNo:"",
                pn:"",
                needQty:"",
                sapTaskId:"",
                mrItem:"",
                sendQty:"",
                sn:"",
                unit:"",
                batchNo:"",
                sentQty:"",
                station:"",
                reason:''
            };
            if($stateParams.mrNo){
                $scope.item.mrNo = $stateParams.mrNo;
                $scope.item.pn = $stateParams.pn;
                $scope.item.needQty = $stateParams.needQty;
                $scope.item.unit = $stateParams.unit;
                $scope.item.sapTaskId = $stateParams.sapTaskId;
                $scope.item.mrItem = $stateParams.mrItem;
                $scope.item.sentQty = $stateParams.sentQty;
                // $scope.item.sn = $stateParams.sn;
                // $scope.item.batchNo = $stateParams.batchNo;
                $scope.item.station = $stateParams.station;
            };

//提交
            $scope.disabledFlage = false;
            $scope.submitMr =function(mrInfo){
                $scope.disabledFlage = true;
                $scope.queryJSON ={
                    "mrNo": $scope.item.mrNo,
                    "mrItem": $scope.item.mrItem,
                    "pn": $scope.item.pn,
                    "needQty": $scope.item.needQty,
                    "unit": $scope.item.unit,
                    "sentQty": $scope.item.sentQty,
                    "sendQty": $scope.item.sendQty,
                    "sn": $scope.item.sn,
                    "batchNo": $scope.item.batchNo,
                    "sapTaskId": $scope.item.sapTaskId
                };
                if($scope.prohibitList.length > 0 ) {
                    $scope.queryJSON.releaseReason = $scope.item.reason;
                    $scope.queryJSON.releaseType = $scope.item.releaseType;
                }
                $rootScope.startLoading();
                server.maocPostReq('issue/send', $scope.queryJSON,true).then(function (data) {
                    console.log("查询到的数据"+JSON.stringify(data));
                    if (data.data.statusCode === 200) {
                        alert("提交成功");
                        $rootScope.go('back');
                    };
                    $scope.disabledFlage = false;
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                    alert("提交失败："+error);
                    $scope.disabledFlage = false;
                });
            };

//  初始化搜索
            $scope.searchListAll = [];
            $scope.searchList = [];
            $scope.batchNoSearchList = [];
            $scope.init = function () {
                $scope.searchKeyData = {
                    // batchNo: $scope.item.batchNo,
                    // sn: $scope.item.sn,
                    pn: $stateParams.pn,
                    station:$stateParams.station
                    // pn: '0012-136-004',
                    // station:"CTU"
                };
                $rootScope.startLoading();
                server.maocPostReq('issue/selectByCondition', $scope.searchKeyData,true).then(function (data) {
                    if (data.data.statusCode === 200) {
                        $scope.searchListAll = data.data.data;
                        // $scope.searchListAll = modeData.data;
                        $scope.separateData($scope.searchListAll);
                        console.log("初始化所有的数据"+JSON.stringify($scope.searchListAll));
                    };
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.init();
            $scope.$watch('item.sn',function(n,o){
                $rootScope.startLoading();
                if(n){
                    server.maocPostReq('prohibit/selectByPnAndSn',{pn:$stateParams.pn,sn:n},true).then(function (data) {
                        if (data.data.statusCode === 200) {
                            $scope.prohibitList = data.data.data;
                            server.maocGetReq('/assembly/analysisDomainTypeByCode', {
                                domainCode: 'RELEASE_TYPE',
                            }).then(function (result) {
                                if(result.data.statusCode==200){
                                    $scope.releaseList = result.data.data[0].RELEASE_TYPE;
                                }
                            }).catch(function (error) {
                                // alert('失败!')
                            });
                        }
                        $rootScope.endLoading();

                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                }
            })
            $scope.initList = function (){
                $scope.queryJSON ={
                    "status":'Y',
                    "pn": $stateParams.pn,
                    "station":$stateParams.station,
                    "pageIndex":1,
                    "pageSize":100
                };
                $rootScope.startLoading();
                server.maocPostReq('receipt/list', $scope.queryJSON,true).then(function (data) {
                    if (data.data.statusCode === 200) {
                        var  getListData = data.data.data;
                        getListData = angular.forEach(getListData,function (value,key) {
                            if(value.reason){
                                value.reason = Number(value.reason)-1;
                            };
                        });
                        $scope.dataList = $scope.dataList.concat(getListData);
                    };
                    $rootScope.endLoading();
                    // }
                }).catch(function (error) {
                });

                server.maocPostReq('prohibit/selectByPnAndSn',{pn:$stateParams.pn,sn:''},true).then(function (data) {
                    if (data.data.statusCode === 200) {
                        $scope.prohibitList = data.data.data;
                        server.maocGetReq('/assembly/analysisDomainTypeByCode', {
                            domainCode: 'RELEASE_TYPE',
                        }).then(function (result) {
                            if(result.data.statusCode==200){
                                $scope.releaseList = result.data.data[0].RELEASE_TYPE;
                            }
                        }).catch(function (error) {
                            // alert('失败!')
                        });
                    }
                }).catch(function (error) {
                });

            };
            $scope.initList();
            $scope.viewPdf = function(data){
                $rootScope.startLoading();
                if(!data.businessId){
                    $rootScope.errTip = '数据有误';
                    return
                }
                server.maocGetReq('relatedDoc/getDocUrlByIdAndType', {id:data.businessId,type:data.businessType}).then(function (data) {
                    $rootScope.endLoading();
                    if (200 === data.status) {
                        var url = data.data.data[0];
                        console.log(url,'url')
                        url && NativeAppAPI.openPdfWithUrl({url:url});
                        !url && ($rootScope.errTip = '无数据');
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                    console.log(error);
                });
            }
// 把数据分为批次号和件号

            $scope.separateData = function(dataList){
                $scope.batchNoSearchList = [];
                $scope.searchList = [];
                if(dataList.length > 0){
                    for (var i=0 ;i < dataList.length ; i++ ){
                       if(!!dataList[i].batchNo) $scope.batchNoSearchList.push(dataList[i]);
                       if(!!dataList[i].sn) $scope.searchList.push(dataList[i]);
                    }
                }
            };

// 点击下拉批次号
            $scope.onclickBatchNoListData = function(){
                $scope.batchNodropdown = false;
                $scope.dropdown = false;
                //如果有批次号数据
                if($scope.batchNoSearchList.length > 0){
                    $scope.dropdown = false;
                    //下拉打开
                    $scope.batchNodropdown = true;
                }else {
                    $scope.batchNodropdown = false;
                    $rootScope.errTip = $scope.dataList.length > 0 ? "请先对下面列表中的调拨合同进行收料后再发料":"当前站无航材库存，请联系航材同事调拨补充库存后再发料";

                }
            };

//点击下拉序号
            $scope.onclickSnListData = function(){
                $scope.batchNodropdown = false;
                $scope.dropdown = false;
                //如果有序号数据
                if($scope.searchList.length > 0){
                    $scope.batchNodropdown = false;
                    //下拉打开
                    $scope.dropdown = true;
                }else {
                    $scope.dropdown = false;
                    $rootScope.errTip = "无序号数据!"
                }
            };

//点击下拉选择序号操作
            $scope.onclickListData = function (data) {
                console.log("选择的下拉数据"+JSON.stringify(data));
                if(!!data){
                    for (var i=0;i<$scope.searchList.length;i++){
                        if(!!$scope.searchList[i].batchNo && $scope.searchList[i].sn == data){
                            $scope.item.batchNo = $scope.searchList[i].batchNo;
                            break;
                        }else if(!$scope.searchList[i].batchNo && $scope.searchList[i].sn == data){
                            $scope.item.batchNo = "";
                            break;
                        }
                    }
                }else {
                    // alert("无序号数据！");
                    $rootScope.errTip = "无序号数据!"


                }
            };

//点击下拉选择批次号操作
            $scope.onclickBatchNoData = function (data) {
                console.log("选择的下拉数据"+JSON.stringify(data));
                if(!!data){
                    for (var i=0;i<$scope.batchNoSearchList.length;i++){
                        if($scope.batchNoSearchList[i].batchNo == data && !!$scope.batchNoSearchList[i].sn){
                            $scope.item.sn = $scope.batchNoSearchList[i].sn;
                            break;
                        }else if($scope.batchNoSearchList[i].batchNo == data && !$scope.batchNoSearchList[i].sn){
                            $scope.item.sn = "";
                            break;
                        }
                    }
                }else {
                    // alert("无批次号数据！");
                    $rootScope.errTip = $scope.dataList.length > 0 ? "请先对下面列表中的调拨合同进行收料后再发料":"当前站无航材库存，请联系航材同事调拨补充库存后再发料";
                }
            };

//失去焦点下拉收缩
            $scope.hideDropDown = function (data) {
              setTimeout(function () {
                  $scope.$apply(
                      function () {
                          $scope.batchNodropdown = false;//关闭下拉
                          $scope.dropdown = false;
                      }
                  );
              },400)
            };

//填写数量不能超过需求-已发数量
            $scope.checkNumber = function () {
                var sendFleg = $scope.item.sendQty;
                var patt1 = /[^0-9]/;
                var allowNumber = Number($scope.item.needQty)-Number($scope.item.sentQty);
                if(!!$scope.item.sendQty && allowNumber < $scope.item.sendQty){
                    $scope.item.sendQty = "";
                    alert("数量超过允许值，请重新输入！");
                }else if( patt1.test($scope.item.sendQty)){
                    $scope.item.sendQty = "";
                    alert("输入非法，请重新输入！");
                };
            };



        }])
})()