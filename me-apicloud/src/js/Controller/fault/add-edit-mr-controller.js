module.exports = angular.module('myApp').controller('addEditFaultMrController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter', '$state',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, $state) {
            //新增故障MR
            $rootScope.loading = false;
            $scope.hideApproverTitle = true;
            $scope.mrItem = [];
            $scope.mrItemNew = [];
            $scope.lastObject = {};
            $scope.defectDetail = $stateParams.defectDetail;
            //重新提交标志
            $scope.logId = "";
            $scope.sapTaskId = $stateParams.sapTaskId;
            $scope.deleteSerialNumber = "";//删除的条目数据
            if(!!$stateParams.defectDetail){
                $scope.defectId =$stateParams.defectDetail.id;
                // $scope.sapTaskId = $stateParams.defectDetail.sapTaskId;
            };
            //父页面带来的数据
            $scope.mrInfo = $stateParams.mrInfo;

            var lanConfig = require('../../../../i18n/lanConfig');
            console.log("父页面带来的数据"+JSON.stringify($stateParams));
            //从前页带来的数据,一直可以获取到的
            $scope.timeId = $stateParams.timeId;
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
            // $scope.timeId = timeId; //添加航材时传参用
            $scope.isCenter = false;

            if(!!$stateParams.defectDetail) {
                $scope.info = {
                    requireDate: new Date($filter('date')(new Date(), 'yyyy/MM/dd HH:mm')),
                    aogType: '0',
                    mrType: 'DEFREQ',
                    remark: '',
                    cardId: $stateParams.defectDetail.id,
                    station: $stateParams.defectDetail.workOrderStation,
                    inspector: {},
                    reason:'',
                    no: '',
                    cardNo: $stateParams.defectDetail.defectNo,
                    acInfo: $stateParams.defectDetail.acReg
                };
            }

            //改为通过查询的方式赋初始值
            $scope.init = function () {
                //从父页面进来
                if($scope.defectDetail != null){
                    server.maocGetReq('mr/getMe2MRDetailById/'+$scope.sapTaskId).then(function(data) {
                        console.log("接口返回MR详情数据"+JSON.stringify(data));
                        if(200 == data.data.statusCode) {
                            if(!!data.data.data[0]) {
                                $scope.lastObject = data.data.data[0];
                                //这个似乎没有cardId
                                $scope.info.cardId = $scope.lastObject.cardId;
                                $scope.info.cardNo =$scope.lastObject.cardNo;
                                $scope.info.acInfo = $scope.lastObject.acInfo;
                                $scope.info.no = $scope.lastObject.no ;
                                //站点
                                $scope.info.station = $scope.lastObject.station;
                                //日期
                                $scope.info.requireDate = new Date($filter('date')($scope.lastObject.requireDate, 'yyyy/MM/dd HH:mm'));
                                //故障类型
                                $scope.info.mrType = $scope.lastObject.cardType;
                                //是否重新提交
                                if(!!$scope.lastObject.logId){
                                    $scope.logId = $scope.lastObject.logId;
                                };
                                //似乎是一个已废弃的字段
                                // $scope.info.aogType = $scope.lastObject.aog;
                                //提示数据(好像没有了)
                                $scope.info.remark = $scope.lastObject.remark;
                                //人名工号
                                $scope.info.inspector = {
                                    nameAndId: $scope.lastObject.approverName + ' ' + $scope.lastObject.approverSn,
                                    approverName: $scope.lastObject.approverName,
                                    approverSn: $scope.lastObject.approverSn
                                };
                                $scope.mrItem = $scope.lastObject.item;
                            }
                        }
                        $rootScope.endLoading();
                    }).catch(function(error) {
                        $rootScope.endLoading();
                        return error;
                    });
                }else {
                    //从新增航材页面进来
                    mrDataBase.getItem(timeId).then(function (value) {
                        //把本地的数据赋值到页面
                        if (value) {
                            console.log("查询故障timeId获取到本地的数据"+JSON.stringify(value));
                            //默认数据
                            $scope.defectDetail = value.defectDetail;
                            //基本的mrInfo数据，就是一些展示数据
                            $scope.mrInfo = value.mrInfo;
                            //重要标志
                            $scope.sapTaskId = value.sapTaskId;
                            //老的条目
                            $scope.mrItem = value.itemold;
                            //新增的条目
                            $scope.mrItemNew = value.item;
                            //删除条目的数据
                            $scope.deleteSerialNumber = value.deleteSerialNumber;
                            // console.log("查询故障timeId获取到本地的数据"+JSON.stringify($scope.mrItem));
                            if (value.info) {
                                value.info.requireDate =new Date($filter('date')(value.info.requireDate, 'yyyy/MM/dd HH:mm'));
                                $scope.info = value.info;
                                $scope.info.station = value.info.station;
                            }
                        }
                    })
                };
            };
            $scope.init();

            //这个用来提示”提交“或是”提交中“
            $scope.submitState = false;

//提交MR数据
            $scope.submitMethod = function () {
                $scope.submitState = true;
                $rootScope.startLoading();
                var data = {
                    requireDate: $filter('formatDate')($scope.info.requireDate),
                    cardType: $scope.info.mrType ,
                    cardId: $scope.defectDetail.id,
                    cardNo: $scope.defectDetail.defectNo,
                    approverSn: $scope.info.inspector.approverSn,
                    remark: $scope.info.remark,
                    reason: $scope.info.reason,
                    aog: $scope.info.aogType,
                    station:  $scope.info.station,
                    itemList:$scope.mrItemNew,
                    sapTaskId:$scope.sapTaskId,
                    deleteSerialNumber:$scope.deleteSerialNumber.substring(0,$scope.deleteSerialNumber.length-1)
                };
                //对新增的航材进行保存，以便在提交失败的时候可以正常显示
                var localParams = angular.copy(data);
                data.itemList = angular.forEach(data.itemList, function(value, key){
                    value.station = value.station && value.station.toUpperCase();
                    value.satisfy = 'Y';
                    delete value.allunits;
                    delete value.allunit;
                });
                //条目数据
                // data.itemList = itemList;

                //如果mrInfo不为空，就表示编辑的MR
//测试提交数据
                console.log("故障MR提交的数据"+JSON.stringify(data));
//                 $rootScope.endLoading();
//                 return false;

// 新建MR提交
                server.maocPostReq('mr/saveMR', data, true).then(function (result) {
                    $scope.submitState = false;
                    if (200 === result.status) {
                        alert('新建MR成功');
                        $rootScope.go('back');
                        mrDataBase.removeItem(timeId);
                    }else {
                        if(!!localParams){
                            $scope.mrItemNew = localParams.itemList;
                        };
                        $scope.init();
                    }
                    $scope.submitState = false;
                    $rootScope.endLoading();
                }).catch(function (error) {
                    if(!!localParams){
                        $scope.mrItemNew = localParams.itemList;
                    };
                    // $scope.init();
                    $scope.submitState = false;
                    $rootScope.endLoading();
                });

            };

   // 选择航材当点击选择航材的时候，通过timeId存储默认值，基本的展示的值
            $scope.selectMr = function () {
                mrDataBase.setItem(timeId, {
                    defectDetail: $scope.defectDetail,
                    // item: $scope.mrItem,
                    //旧的条目数据
                    itemold:$scope.mrItem,
                    //基本展示数据
                    info: $scope.info,
                    //父页面带来的数据
                    mrInfo: $scope.mrInfo,
                    //新的展示数据
                    item:  $scope.mrItemNew,
                    //重要标志
                    sapTaskId:$scope.sapTaskId,
                    //删除的条目数据
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
                console.log("删除所对应的条目"+JSON.stringify(event));
                console.log("删除动作参数"+JSON.stringify(idx));
                $scope.deleteSerialNumber = $scope.deleteSerialNumber+event.sapTaskId+"#"+event.serialNumber+",";
                console.log("deleteSerialNumber"+JSON.stringify($scope.deleteSerialNumber));
                $scope.mrItem.splice(idx, 1);
                console.log("删除后的数据"+JSON.stringify( $scope.mrItem));
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
            };

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
                // $scope.newMrList.item.splice(index, 1);
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
                        $scope.abledclick = true;
                        console.log("重新提交成功!");
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