module.exports = angular.module('myApp').controller('addFaultMrController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter', '$state',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, $state) {
            //编辑故障MR的JS页面
            $rootScope.loading = false;
            $scope.hideApproverTitle = true;
            $scope.mrItem = [];
            $scope.mrItemNew = [];
            $scope.baseData = {};
            $scope.defectDetail = $stateParams.defectDetail;
            $scope.timeId = $stateParams.timeId;
            $scope.deleteSerialNumber = "";//删除
            //父页面带来的数据,mrInfo是条目的数据
            $scope.mrInfo = $stateParams.mrInfo;
            $scope.logId = "";
            console.log("logId数据"+JSON.stringify($stateParams.logId));
            if(!!$stateParams.sapTaskId){
                $scope.sapTaskId = $stateParams.sapTaskId;
            };

            var lanConfig = require('../../../../i18n/lanConfig');
            console.log("父页面带来的数据"+JSON.stringify($stateParams));
            var timeId = $stateParams.timeId;
             console.log("当前时间"+new Date());
            //$localForage.getItem('defectIdx').then(function(value) {
            //    $scope.defectIdx = value; //获取故障详情之前在哪个tab页
            //});
            /**
             * 获取详情数据，传入timeId从本地获取
             *
             */
            if (typeof mrDataBase == "undefined") {
                mrDataBase = $localForage.createInstance({
                    name: (configInfo.userCode || 'noUser') + '_nosubmit'
                });
            }
            $scope.timeId = timeId; //添加航材时传参用
            $scope.isCenter = false;
            $scope.info = {
                requireDate: new Date($filter('date')(new Date(), 'yyyy/MM/dd HH:mm')),
                mrType: '',
                aogType: '0',
                remark: '',
                cardId:'',
                no:'',
                cardNo:'',
                station: '',
                acInfo:'',
                inspector: {}
            };

     //监控station字段
            $scope.$watch('{a:info.station,b:mrItemNew}', function (newVal, oldVal) {
                $scope.isCenter = (['SZXS', 'HGHS'].indexOf($scope.info.station) > -1);
                if ($scope.isCenter) {
                    $scope.info.mrType = 'DEFREQ';
                };
                mrDataBase.setItem(timeId, {
                    item: $scope.mrItemNew
                });
            },true);


//初始化
            $scope.init = function () {
                //从父页面带过来的数据
                if (!!$scope.mrInfo) {
                    //如果父页面带来的mrInfo数据为空
                    if (!!$scope.mrInfo.sapTaskId) {
                        $rootScope.startLoading();
                        server.maocGetReq('mr/getMe2MRDetailById/'+ $scope.mrInfo.sapTaskId).then(function(data) {
                            console.log("接口返回MR详情数据"+JSON.stringify(data));
                            if(200 == data.data.statusCode) {
                                if(!!data.data.data[0]) {
                                    $scope.baseData = data.data.data[0];
                                    //把查询到的数据、父页面带下来的数据mrInfo存到本地
                                    mrDataBase.setItem(timeId, {
                                        // defectDetail:  $scope.baseData,
                                        mrInfo: $scope.mrInfo
                                    });
                                    $scope.info.cardId = $scope.baseData.cardId ;
                                    $scope.info.cardNo = $scope.baseData.cardNo ;
                                    $scope.info.no = $scope.baseData.no ;
                                    $scope.info.acInfo = $scope.baseData.acInfo ;
                                    //站点
                                    $scope.info.station = $scope.baseData.station ;

                                    $scope.itemStation = $scope.baseData.station;
                                    //日期
                                    $scope.info.requireDate =new Date($filter('date')($scope.baseData.requireDate, 'yyyy/MM/dd HH:mm'));
                                    //故障类型
                                    $scope.info.mrType = $scope.baseData.cardType;
                                    //似乎是一个已废弃的字段
                                    // $scope.info.aogType = $scope.baseData.aog;
                                    //重新提交的标识
                                    $scope.logId = $scope.baseData.logId;
                                    //提示数据
                                    $scope.info.remark = $scope.baseData.remark;
                                    //人名工号
                                    $scope.info.inspector = {
                                        nameAndId: $scope.baseData.approverName + ' ' + $scope.baseData.approverSn,
                                        approverName: $scope.baseData.approverName,
                                        approverSn: $scope.baseData.approverSn
                                    };
                                    // $scope.mrInfo.itemList.length > 0 && ($scope.info.station = $scope.mrInfo.itemList[0].station);
                                    //条目数据
                                    $scope.mrItem = $scope.baseData.item;
                                }
                            };
                            $rootScope.endLoading();
                        }).catch(function(error) {
                            $rootScope.endLoading();
                            return error;
                        });
                    }
                } else {
                    //如果不是前页进入当前页那么就是从新增航材页返回进入的，那这时候就取存在本地的数据
                    //             console.log("查询本地库数据"+JSON.stringify(timeId));
                    mrDataBase.getItem(timeId).then(function (value) {
                        //如果本地有数据，那么就要把本地的数据赋到页面上，如果没有，那么所有的值都不会被赋值
                        if (value) {
                            console.log(value)
                            // console.log("查询故障timeId获取到本地的数据"+JSON.stringify(value));
                            //基本的mrInfo数据，就是一些基本的展示数据
                            $scope.mrInfo = value.mrInfo;
                            $scope.sapTaskId = value.sapTaskId;

                            //增加的条目数据
                            // $scope.mrItem = value.item;
                            //旧的已有条目
                            $scope.mrItem = value.itemold;
                            //新添加条目
                            $scope.mrItemNew = value.item;
                            //删除的条目信息
                            $scope.deleteSerialNumber = value.deleteSerialNumber;
                            // console.log("查询故障timeId获取到本地的数据"+JSON.stringify($scope.mrItem));
                            if (value.info) {
                                value.info.requireDate =new Date($filter('date')(value.info.requireDate, 'yyyy/MM/dd HH:mm'));
                                $scope.info = value.info;
                                $scope.info.station = value.info.station;
                                $scope.itemStation = value.mrInfo.station;

                            }

                        }
                    })
                };
            };
            $scope.init();

            /**
             * 航材类型切换
             * @param typeName
             * 如果类型选择改变，就把条目删除，猜测这里是为新增做的逻辑
             */
            $scope.mrTypeChange = function (typeName) {
                //if(typeName == 'DEFREQ'){
                //    $scope.info.station = 'SZXS';
                //}else{
                //    $scope.info.station = '';
                //}

                if (typeName === 'DEF' && $scope.info.mrType === 'DEFREQ' && $scope.mrItem.length > 0) {
                    $rootScope.confirmInfo = "你切换了DEF类型，将清空已选择的航材";
                    $rootScope.confirmShow = true;
                    //如果选择切换
                    $rootScope.confirmOk = function () {
                        $scope.info.mrType = typeName;
                        $scope.mrItem = [];
                    };
                    //如果不切换
                    $rootScope.confirmCancel = function () {
                        $rootScope.confirmShow = false;
                    };
                    return
                }
                $scope.info.mrType = typeName;
            };

            //这个用来提示”提交“或是”提交中“
            $scope.submitState = false;

//提交MR数据
            $scope.submitMethod = function () {
                $scope.submitState = true;
                $rootScope.startLoading();
                var data = {
                    requireDate: $filter('formatDate')($scope.info.requireDate),
                    cardType: $scope.info.mrType,
                    cardId: $scope.info.cardId,
                    cardNo: $scope.info.cardNo,
                    approverSn: $scope.info.inspector.approverSn,
                    remark: $scope.info.remark,
                    reason: $scope.info.reason,
                    aog: $scope.info.aogType,
                    station: $scope.info.station,
                    itemList:$scope.mrItemNew,
                    sapTaskId:$scope.sapTaskId,
                    deleteSerialNumber:$scope.deleteSerialNumber.substring(0,$scope.deleteSerialNumber.length-1)
                };
                var localParams = angular.copy(data);
                data.itemList = angular.forEach(data.itemList, function(value, key){
                    value.station = value.station && value.station.toUpperCase();
                    delete value.allunits;
                    delete value.allunit;
                });
                //做一个空的MR条目数据容器
                var itemList = [];
                for (var i = 0, item; item = $scope.mrItem[i++];) {
                    if(item.revRemark != 'D'){
                        itemList.push({
                            pn: item.pn,
                            pnname: item.pnname,
                            qty: item.qty,
                            unit: item.unit,
                            station: item.station,
                            itemNum: item.itemNum,
                            lotNum: item.lotNum,
                            serialNum: item.serialNum,
                            assetNum: item.assetNum,
                            satisfy: (item.availableQty ? ((item.qty <= item.availableQty) ? 'Y' : 'N') : 'N')
                        })
                    }
                }
                //条目数据
                // data.itemList = itemList;

// 编辑提交        ***********这里的重新报错不知道是走else 还是catch,需要测试一遍才知道会从哪里走************
                data.no = $scope.info.no;
                server.maocPostReq('mr/reviseMR', data, true).then(function (result) {
                    $scope.submitState = false;
                    if (200 === result.status) {
                        $rootScope.endLoading();
                        alert('编辑MR成功');
                        //成功以后把存在本地数据删除
                        mrDataBase.removeItem(timeId);
                        //返回父页面
                        // $rootScope.go('searchFault.faultClose', '', {navIdx: 2, handleIdx: 2, defectId: $scope.info.cardId});
                        $rootScope.go('back');
                    }else {
                        $rootScope.endLoading();
                    // 如果没有成功，需要把新添加的航材重新赋值
                        if(!!localParams){
                            $scope.mrItemNew = localParams.itemList;
                        };
                        $scope.init();
                    };
                }).catch(function (error) {
                    if(!!localParams){
                        $scope.mrItemNew = localParams.itemList;
                    };
                    $scope.submitState = false;
                    alert("编辑失败："+error);
                    // $scope.init();
                    $rootScope.endLoading();
                });

            };

 // 选择航材   当点击选择航材的时候，通过timeId存储默认值，基本的展示的值
            $scope.selectMr = function () {
                mrDataBase.setItem(timeId, {
                    // defectDetail: $scope.defectDetail,
                    // item: $scope.mrItem,
                    //旧的条目
                    itemold:$scope.mrItem,
                    //父页面带来的数据
                    mrInfo: $scope.mrInfo,
                    //新添加的条目
                    item:  $scope.mrItemNew,
                    //唯一标识
                    sapTaskId:$scope.sapTaskId,
                    //基本展示信息
                    info: $scope.info,
                    //删除的条目信息
                    deleteSerialNumber:$scope.deleteSerialNumber
                }).then(function () {
                    $state.go('searchMaterial', {
                        timeId: $scope.timeId,
                        station: angular.uppercase($scope.info.station),
                        mrType: $scope.info.mrType,
                        acReg: $scope.info.acInfo
                    });
                })
            };

            /**
             * 数字加减
             * @param idx
             */
            $scope.delItem = function (event,idx) {
                // console.log("删除所对应的条目"+JSON.stringify(event));
                // console.log("删除动作参数"+JSON.stringify(idx));
                $scope.deleteSerialNumber = $scope.deleteSerialNumber+event.sapTaskId+"#"+event.serialNumber+",";
                // console.log("deleteSerialNumber"+JSON.stringify($scope.deleteSerialNumber));
                $scope.mrItem.splice(idx, 1);
                // console.log("删除后的数据"+JSON.stringify( $scope.mrItem));
            };

            /**
             * 数字加减
             * @param item
             * @param len
             */
            $scope.changeNum = function (item, len, index) {
                if ($scope.info.mrType === 'DEF' && len > 0 && parseInt(item.qty) >= parseInt(item.availableQty)) {
                    item.qty = parseInt(item.availableQty);
                    return;
                }
                item.qty = parseInt(item.qty) + len;
                if(item.qty == 0){
                    $rootScope.confirmInfo = "确定删除此条航材吗";
                    $rootScope.confirmShow = true;
                    $rootScope.confirmOk = function(){
                        $rootScope.confirmShow = false;
                        $scope.delItem(index);
                    };
                    $rootScope.confirmCancel = function(){
                        $rootScope.confirmShow = false;
                        item.qty = 1;
                    }
                }
            }

            //Android返回键单独处理
            //if($rootScope.android){
            //    api.removeEventListener({
            //        name: 'angularKeyback'
            //    });
            //
            //    api.addEventListener({
            //        name: 'angularKeyback'
            //    }, function(ret, err){
            //        $rootScope.go(
            //            'searchFault.faultClose',
            //            '',
            //            {
            //                navIdx: $scope.defectIdx.defectNavIdx,
            //                handleIdx: $scope.defectIdx.defectListIdx,
            //                defectId: $scope.defectDetail.id
            //            }
            //        );
            //    });
            //}

//编辑航材栏为0或者空时弹窗提示取消还原原来的值
            $scope.returnLastNumber = function(material, event,index){
                console.log(material.qty)
                if(material.qty == 0 || material.qty == undefined){
                    $scope.nomaterialqty = true;
                    $rootScope.confirmInfo = lanConfig.clearStock;
                    $rootScope.confirmShow = true;
                    $rootScope.confirmOk = function(){
                        $rootScope.confirmShow=false;
                        confirmDelete(event,index);
                    };
                    $rootScope.confirmCancel = function(){
                        $rootScope.confirmShow=false;
                        material.qty = memoryNumber;
                        $scope.nomaterialqty = false;
                    }
                }
            };

//编辑航材栏为0时记住值弹窗取消时还原原来的值
            var  memoryNumber ;
            $scope.rememberNumber = function(material, event,index){
                memoryNumber = material.qty;
            };

//直接输入验证
            $scope.overStock = function(material, event,index){
                //输入值验证
                var tempQty = material.qty;
                tempQty_1 = tempQty && tempQty.slice(0, tempQty.length-1);

                if(!tempQty_1 && /\./g.test(tempQty)){ //小数点不能点首位
                    material.qty = '';
                }else if(/\./g.test(tempQty_1)&& tempQty.slice(-1)=='.'){ //已经输入过点不能再次输入
                    material.qty = tempQty_1;
                }else if(tempQty && tempQty.substring(0,2)=='00'&&tempQty.indexOf('.')==-1){
                    material.qty = '0'
                }else{
                    material.qty = tempQty &&　tempQty.replace(/[^0-9\.]/g, '');
                };

                if(material.qty > Number(material.availableQty)){
                    material.qty = 0;
                    $scope.nomaterialqty = true;
                }else if(material.qty == 0){
                    $scope.nomaterialqty = true;

                }else if(material.qty > 0){

                    $scope.nomaterialqty = false;
                };
                //保留两位小数
                if(typeof String(tempQty).split('.')[1] != "undefined" && String(tempQty).split('.')[1].length>2){
                    material.qty = material.qty.substring(0,String(tempQty).split('.')[0].length+3)
                }
            };

//点击减号航材数量减一
            $scope.minusmaterials = function(materialnumber,material,num2,event,index){
                var rememberNumber = material.qty; //点击减记住上一次的值
                var baseNum, baseNum1, baseNum2;
                var precision;// 精度
                try {
                    baseNum1 = materialnumber.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
                if(materialnumber>1){
                    material.qty = parseFloat(((materialnumber * baseNum - num2 * baseNum) / baseNum).toFixed(precision));
                }else if(materialnumber<=1)
                {
                    material.qty = 0;

                    $scope.nomaterialqty = true;
                    $rootScope.confirmInfo = lanConfig.clearStock;
                    $rootScope.confirmShow = true;
                    $rootScope.confirmOk = function(){
                        $rootScope.confirmShow=false;
                        confirmDelete(event,index);
                    };
                    $rootScope.confirmCancel = function(){
                        $rootScope.confirmShow=false;
                        material.qty = rememberNumber;
                        $scope.nomaterialqty = false;
                    }
                    return false;
                };
            };

//航材数量为零时点击弹窗的确定删除该条航材卡
            function confirmDelete(event,index){
                angular.element(event.currentTarget).parent().parent().parent().remove();
                $scope.mrItemNew.splice(index, 1);
            }

//点击加号航材数量加一new
            // materialnumber：需求数量，material：整个取值对象，num2：长度
            // 原有的逻辑是根据当地库房和飞机库库房取件，对可取数量做限制，现在改为对数量不做限制
            $scope.plusmaterials = function(materialnumber,material,num2){
                var baseNum, baseNum1, baseNum2;
                var precision;// 精度
                try {
                    baseNum1 = materialnumber.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
                material.qty = parseFloat(((materialnumber * baseNum + num2 * baseNum) / baseNum).toFixed(precision));
                if(materialnumber == 0){
                    $scope.nomaterialqty = false;
                };
            };

//删除一条航材
            $rootScope.deleteAdd = function(event, index){
                angular.element(event.currentTarget).parent().remove();
                $scope.mrItemNew.splice(index, 1);
            };

//	 重新提交
            $scope.abledclick = true;
            $scope.renewSubmit = function () {
                $scope.abledclick = false;
                $rootScope.startLoading();
                server.maocPostReq('mr/reSendMr', {logId:$scope.logId}).then(function(data) {
                    console.log("重新提交返回结果"+JSON.stringify(data));
                    if(data.status == 200){
                        console.log("重新提交成功!");
                        $scope.abledclick = true;
                        $rootScope.go('back');
                    };
                    $scope.abledclick = true;
                    $rootScope.endLoading();
                }).catch(function(error) {
                    $scope.abledclick = true;
                    console.log(error);
                    $rootScope.endLoading();
                })
            };

        }
    ]);