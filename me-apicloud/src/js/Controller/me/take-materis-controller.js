/**
 * Created by web on 1/2/18.
 */
module.exports = angular.module('myApp').controller('takeMaterisController', ['$rootScope', '$scope', 'server', '$stateParams','$localForage', 'configInfo',
    function($rootScope, $scope, server, $stateParams, $localForage, configInfo) {
        $scope.station = $stateParams.station;
        $scope.timeId = $stateParams.cardId; //保存时用cardNo作为key
        var tasks = $stateParams.tasks;
        var routineItem = $stateParams.routineItem;
        $scope.takeMaterisInfo={
            station: angular.uppercase($stateParams.station),
            mrNo: ''
        };

        /**
         * 获取详情数据，传入timeId从本地获取
         */
        if (typeof mrDataBase == "undefined") {
            mrDataBase =  $localForage.createInstance({
                name: (configInfo.userCode||'noUser')+'_nosubmit'
            });
        }

        mrDataBase.getItem($scope.timeId).then(function(value) {
            if(value){
                $scope.personInfo = value.personInfo;
                tasks = value.tasks;
                routineItem = value.routineItem;
                $scope.takeMaterisInfo = value;
                //$scope.takeMaterisInfo.station = angular.uppercase($stateParams.station);
            }else{
                mrDataBase.length().then(function(numberOfKeys) {
                    if(!numberOfKeys){
                        $localForage.removeItem('noSubmitNumber');
                    }
                })

            }
        }).catch(function(err) {
            console.log(err);
        });
        //$rootScope.endLoading();

        /**
         * 获取Staus数据
         */
        server.maocPostReq('mr/findMRList',
            {"cardType": $stateParams.cardType, "cardId": $stateParams.cardId},true
        ).then(function(data) {
            if(200 === data.status) {
                $scope.materisList = data.data.data;
                $rootScope.endLoading();
            }

        }).catch(function(error) {
            console.log(error);
            $rootScope.endLoading();
        });

        //$scope.checkOne = function(checked, checkALl){
        //    checked = !checked;
        //    $scope.ischecked = checked;
        //    if(!checked){
        //        $scope.checkAll = false;
        //    }
        //}
        //去搜索页面
        $scope.goSearchMateris = function(pnNo){
            $scope.takeMaterisInfo.personInfo = $scope.personInfo;
            $scope.takeMaterisInfo.tasks = $stateParams.tasks,
            $scope.takeMaterisInfo.routineItem = $stateParams.routineItem;

            mrDataBase.setItem($scope.timeId, $scope.takeMaterisInfo).then(function(value) {
                $rootScope.go('searchMaterial', 'slideLeft',  {timeId: $scope.timeId, station: $scope.takeMaterisInfo.station + 'S', pnNo: pnNo});
            }).catch(function(err) {
                console.log(err);
            });
        }

        //点击加号航材数量加一
        $scope.plusmaterials = function(stockNumber,materialnumber,material,num2){
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
            if(materialnumber<=stockNumber-1){
                material.qty = parseFloat(((materialnumber * baseNum + num2 * baseNum) / baseNum).toFixed(precision));
            }else if(stockNumber-1<materialnumber<stockNumber){
                material.qty = parseFloat(stockNumber);
            }

            if(materialnumber == 0){
                $scope.nomaterialqty = false;
            };

        };
        //点击减号航材数量减一
        $scope.minusmaterials = function(stockNumber,materialnumber,material,num2,event,index) {
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
            if (materialnumber > 1) {
                material.qty = parseFloat(((materialnumber * baseNum - num2 * baseNum) / baseNum).toFixed(precision));
            } else if (materialnumber <= 1) {
                material.qty = 0;

                $scope.nomaterialqty = true;
                //$rootScope.confirmInfo = lanConfig.clearStock;
                $rootScope.confirmShow = true;
                $rootScope.confirmOk = function () {
                    $rootScope.confirmShow=false;
                    confirmDelete(event, index);
                };
                $rootScope.confirmCancel = function () {
                    $rootScope.confirmShow=false;
                    material.qty = rememberNumber;
                    $scope.nomaterialqty = false;
                }
                return false;
            }
        }

        //提交
        $scope.submit = function(){
            //禁用提交按钮
            $scope.myForm.$valid = false;
            $rootScope.startLoading();
            var formParam = {
                materialList: []
            };
            var submitParam = []; //最后提交的数据
            var params = angular.copy($scope.takeMaterisInfo);
            var tempMaterial = {};
            //组合要提交的数据
            angular.forEach($scope.materisList, function(val, index){
                formParam.mrNum = val.no;
                formParam.issueto = $scope.personInfo.approverSn;
                formParam.collect = true;
                angular.forEach(val.itemList, function(pnData, i){
                    angular.forEach(params.item, function(oneItem, itemIndex){
                        if(oneItem.pn == pnData.pn){
                            tempMaterial.itemNum = oneItem.itemNum;
                            tempMaterial.lotNum = oneItem.lotNum;
                            tempMaterial.assetNum = oneItem.assetNum;
                            tempMaterial.qty = oneItem.qty;
                            formParam.materialList.push(tempMaterial);
                        }

                    })

                })

                submitParam.push(formParam);
            })

            server.maocPostReq('mr/mrIssue', submitParam, true).then(function(data) {
                if(200 === data.status) {
                    mrDataBase.removeItem($scope.timeId);
                    //alert('提交成功');
                    if(routineItem.cardType == 'NRC'|| routineItem.cardType == 'NRCTASK'){
                        api.alert({
                            msg: '此类型任务请前往PC端反馈'
                        });
                        $rootScope.go('back');
                        return;
                    }
                    //if(routineItem.cardType == 'NRC' && routineItem.woNo){
                    //    $rootScope.go('me.releaseTask.meForm','',{oneCardInfo: routineItem, 'formId':routineItem.formId,
                    //        'itemId':routineItem.itemId,'routineCardNumber':routineItem.cardNo,
                    //        'taskType':'tbm_routine','routineRequireFeedback':routineItem.requireFeedback,
                    //        'isRiiRequired':routineItem.rii, dm:routineItem.dm})
                    //    return;
                    //}else if((routineItem.cardType == 'NRC' && typeof routineItem.woNo == 'undefined') || routineItem.cardType == 'NRCTASK'){
                    //    $rootScope.go('back');
                    //    return;
                    //}

                    $rootScope.confirmInfo = "是否要写TLB";
                    $rootScope.confirmShow = true;
                    $rootScope.confirmOk = function () {
                        $rootScope.confirmShow=false;
                        $rootScope.isYes = false; //为true时按钮显示为是/否,默认确定取消

                        $rootScope.go('tlbAdd','',{flightNo: tasks.flightNo, acNo: tasks.acReg,
                            lineJobId: (tasks.lineJob && tasks.lineJob.lineJobId) || tasks.lineJobId || '',
                            station: tasks.station, cdnType: routineItem.cardType,cdnNo: routineItem.cardNo,
                            'rii': routineItem.rii, 'ata': routineItem.ata, itemId:routineItem.itemId,
                            dm:routineItem.dm,
                            dmValue:routineItem.dmValue});
                    };
                    $rootScope.confirmCancel = function () {
                        $rootScope.confirmShow=false;
                        $rootScope.isYes = false;

                        $rootScope.go('me.releaseTask.meForm', '', {
                            oneCardInfo: routineItem,
                            'formId': routineItem.formId,
                            'itemId': routineItem.itemId,
                            'routineCardNumber': routineItem.cardNo,
                            'taskType': 'tbm_routine',
                            'routineRequireFeedback': routineItem.requireFeedback,
                            'routineRequireLisence': routineItem.isRequireLisence
                        })
                    }

                    $rootScope.endLoading();
                }else{
                    $scope.myForm.$valid = true; //提交不成功，提交按钮可用
                }

            }).catch(function(error) {
                $scope.myForm.$valid = true; //提交不成功，提交按钮可用
                console.log(error);
                $rootScope.endLoading();
            });
            //server.maocPostReq('mr/addME2MR', params, true).then(function(data) {
            //    if(200 === data.status) {
            //        $scope.timeId && mrDataBase.removeItem($scope.timeId);
            //        $scope.submitSuccess = true;
            //        $rootScope.go('back');
            //    }else{
            //        $scope.myForm.$valid = true; //提交不成功，提交按钮可用
            //        $scope.errorInfo = data.data;
            //    }
            //    $rootScope.endLoading();
            //}).catch(function(error) {
            //    $scope.myForm.$valid = true; //提交不成功，提交按钮可用
            //    $rootScope.endLoading();
            //    $scope.submitSuccess = false;
            //
            //});

        }
    }]);
