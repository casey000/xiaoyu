module.exports = angular.module('myApp').controller('meFormController', ['$rootScope', '$scope', 'server', '$stateParams', 'fileReader', '$timeout', 'configInfo', 'airport','$filter','$window','b64ToBlob',
    function($rootScope, $scope, server, $stateParams, fileReader, $timeout, configInfo, airport,$filter,$window,b64ToBlob) {

        $rootScope.endLoading();
        $rootScope.showAttachment = false; //初始附件弹出层不显示
        $scope.licenseNoRequired = false; //EO/JC执照号填写
        $scope.isTlb2TO = $stateParams.isTlb2TO;

        $scope._4codeCityName = airport._4codeCityName;
        //点击例行process按钮传递的工卡编号
        var routineCardNumber = $stateParams.routineCardNumber;
        //点击非例行process按钮传递的工卡编号
        var nonRoutineCardNumber = $stateParams.nonRoutineCardNumber;
        console.info($stateParams)
        $scope.formData = {
            // taskVO: {}
        };
        $scope.inspector = {
            nameAndId: '',
            approverName:'',
            approverSn:''
        };
        $scope.taskupWay = 'feedback';
        $scope.fileList = [];
        $scope.imgArr = [];
        $scope.fileArr = [];
        // $scope.nrcId = $stateParams.cardInfo.lineJob.lineJobId;
        var formId = $stateParams.formId;
        var cardType = $stateParams.cardType;
        $scope.acReg = $stateParams.cardInfo.acReg;
        $scope.isRci = true;
        $scope.isInter = false;
        $scope.checkType = $stateParams.cardInfo.checkType

        $scope.routineRequireFeedback = $stateParams.routineRequireFeedback;
        $scope.nonRoutineRequireFeedback = $stateParams.nonRoutineRequireFeedback;
        var toTroubleShootingVOS = [];

        /**
         * 判断附件是否必填
         */
        function checkHasAttachment() {
            var imgArrLength = $scope.fileArr.length;
            //判断附件是否必填时
            if($scope.nonRoutineRequireFeedback) {
                if(imgArrLength > 0) {
                    $scope.nonHasAttachment = true;
                } else if(imgArrLength == 0) {
                    $scope.nonHasAttachment = false;
                }
            } else {
                $scope.nonHasAttachment = false;
            }
            if($scope.routineRequireFeedback) {
                if(imgArrLength > 0) {
                    $scope.hasAttachment = true;
                } else if(imgArrLength == 0) {
                    $scope.hasAttachment = false;
                }
            } else {
                $scope.hasAttachment = false;
            }
        }

        /**
         * 表单初始化
         */
        function formInit() {

            //LMJC
            if(-1 != formId.indexOf('TBM-001')) {
                /**
                 * 获取已有数据
                 */
                var hasFlbNo = $stateParams.cardInfo.lineJob.hasFlbNo;
                var checkObj = {
                    'T/R':1,
                    'Pr/F':1,
                    'TBFTR':1,
                    'TBF':1,
                }
                if(checkObj[$scope.checkType]){
                    server.maocGetReq('assembly/getIsInternationalFlightByflightId',{flightId:$stateParams.cardInfo.lineJob.flightId}).then(function (data) {
                        $scope.interAirline = data.data.data[0];
                    }).catch(function(error) {
                        console.log(error);
                    });
                }

                server.maocGetReq('maintain/getMe2FlbStaLine/' + $stateParams.cardInfo.lineJob.lineJobId).then(function(data) {
                    if(200 === data.status) {
                        var flbInfo = data.data.data[0];
                        $scope.formData = flbInfo;
                        $scope.show747Engin = typeof($scope.formData.model) != 'undefined'&&$scope.formData.model.indexOf('747') != -1;
                        $scope.formData.taskVO.completeDate = flbInfo.taskVO.completeDate ?
                            new Date(flbInfo.taskVO.completeDate) :
                            new Date();
                        if($stateParams.cardInfo.lineJob.status == 'Open') {
                            !flbInfo.flbNo?$scope.isFlbEdited = false:$scope.isFlbEdited = true;
                            $scope.isEdited = false;
                        }
                        if($stateParams.cardInfo.lineJob.status == 'Close') {
                            !hasFlbNo?$scope.isFlbEdited = false:$scope.isFlbEdited = true;
                            $scope.isEdited = true;
                        }
                        $scope.fileList = $scope.formData.taskVO.attachmentList;
                        $scope.nrcId = $scope.formData.taskVO.id;

                        angular.forEach($scope.fileList, function (item, index) {

                            var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                            var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                            var imgType = item.name.substring(item.name.lastIndexOf('.'));
                            imgBlob.name = item.name.indexOf('down') == -1
                                ? imgName + 'down' + imgType
                                : item.name;
                            imgBlob.id = item.id;
                            $scope.fileArr.push(imgBlob);
                            $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));

                        });

                        $scope.inspector.approverName = $scope.formData.taskVO.checkName || '';
                        $scope.inspector.approverSn = $scope.formData.taskVO.checkSn || '';
                        $scope.inspector.nameAndId = $scope.formData.taskVO.checkName ? $scope.formData.taskVO.checkName +" " + $scope.formData.taskVO.checkSn:'';



                        if ($scope.formData.oilRemainL == 0) {
                            $scope.formData.oilRemainL = '';
                        }
                        if ($scope.formData.oilRemainR == 0) {
                            $scope.formData.oilRemainR = '';
                        }

                        if ($scope.formData.oilUpliftL == 0) {
                            $scope.formData.oilUpliftL = '';
                        }
                        if ($scope.formData.oilUpliftR == 0) {
                            $scope.formData.oilUpliftR = '';
                        }

                        if ($scope.formData.oilUpliftApu == 0) {
                            $scope.formData.oilUpliftApu = '';
                        }

                        if ($scope.show747Engin) {
                            if ($scope.formData.oilRemain3 == 0) {
                                $scope.formData.oilRemain3 = '';
                            }
                            if ($scope.formData.oilRemain4 == 0) {
                                $scope.formData.oilRemain4 = '';
                            }
                            if ($scope.formData.oilUplift3 == 0) {
                                $scope.formData.oilUplift3 = '';
                            }
                            if ($scope.formData.oilUplift4 == 0) {
                                $scope.formData.oilUplift4 = '';
                            }
                        }

                    }
                    $rootScope.endLoading();
                }).catch(function(error) {
                    console.log(error);
                    $rootScope.endLoading();
                });

            }

            //MCC/TLB/Review TLB/Review DD/TO其它
            if(-1 != formId.indexOf('TBM-002-A')) {

                if(cardType == 'TLB') {
                    $scope.nonRoutineCardNumber = 'TLB-' + nonRoutineCardNumber;
                } else if(cardType == 'ReviewTLB') {
                    $scope.nonRoutineCardNumber = 'Review TLB-' + nonRoutineCardNumber;
                } else if(cardType == 'ReviewDD') {
                    $scope.nonRoutineCardNumber = 'Review DD-' + nonRoutineCardNumber;
                } else {
                    $scope.nonRoutineCardNumber = nonRoutineCardNumber;
                };
            }

            //TO排故类
            if(-1 != formId.indexOf('TBM-004-A')) {
                server.maocGetReq('maintain/toBaseDetailInfo/' + $stateParams.nonRoutineCardNumber).then(function(data) {
                    if(200 === data.status) {
                        $scope.steps = data.data.data[0].extToTroubleShootingVO;
                    }

                    toTroubleShootingVOS = $scope.steps;
                    $rootScope.endLoading();
                    $scope.formData.toTroubleShootingVOS = toTroubleShootingVOS

                }).catch(function(error) {
                    console.log(error);
                    $rootScope.endLoading();
                });
                $scope.nonRoutineCardNumber = nonRoutineCardNumber;
            }

            //获取DD的inspect数据
            if(-1 != formId.indexOf('TBM-005-B')) {
                //server.maocGetReq('maintain/meDDInfo?taskType=/' + $stateParams.taskType +'&itemId='+ $stateParams.itemId).then(function(data) {
                server.maocGetReq('maintain/meDDInfo?flowInstanceId=' + $stateParams.flowInstanceId).then(function(data) {
                    if(200 === data.status) {
                        $scope.ddInspect = data.data.data[0];
                    }
                }).catch(function(error) {
                    console.log(error);
                    $rootScope.endLoading();
                });
                $scope.nonRoutineCardNumber = nonRoutineCardNumber;
                $scope.formData = {
                    feedBack: $scope.feedBack
                }
            }

            //DD process
            if(-1 != formId.indexOf('TBM-005-A')) {
                $scope.nonRoutineCardNumber = 'DD-' + nonRoutineCardNumber;
                $scope.completeDate2 = new Date();
            }

            //EO/JC
            if(-1 != formId.indexOf('TBM-002-B')) {
                $scope.isRoutine = true;//例行
                $scope.routineCardNumber = routineCardNumber;
                $scope.routineRequireLicense = $stateParams.routineRequireLisence;
                $scope.formData.licenseNo = configInfo.myId();
                $scope.formData.licenseNo?$scope.licenseExist=true:$scope.licenseExist=false;
                $scope.formData.completeDate = new Date();
            }

            //NRC
            if(-1 != formId.indexOf('TBM-003-A')) {
                $scope.isRoutine = true;//例行
                $scope.nrc = true;//上传图片判断
                $scope.isRiiRequired = $stateParams.isRiiRequired;
                // var isRii = $stateParams.isRiiRequired;
                // angular.uppercase(isRii)=='Y'?$scope.isRiiRequired = true:$scope.isRiiRequired = false;
                var locationAirport = $scope._4codeCityName[configInfo.airport()];
                $scope.routineCardNumber = (-1 != routineCardNumber.indexOf('NRC')) ? routineCardNumber : ('NRC-' + routineCardNumber);
                $scope.formData = {
                    nrcTime: new Date(),
                    nrcAcTime: new Date(),
                    sta: locationAirport
                }
                console.log('isRiiRequired = ' + $scope.isRiiRequired);
            }
        }
        formInit();

        /**
         * 提交表单数据
         */
        $scope.submitForm = function(formData) {
            if($scope.interAirline && !$scope.isInter){
                $rootScope.errTip = '国际航班随机电脑包放到驾驶舱必填';
                $rootScope.endLoading();
                return;
            }
            // console.log(JSON.stringify($stateParams));
            if ($stateParams.dm == 'y') {
                $rootScope.confirmInfo = "此任务涉及双重维修限制，请确认是否已按要求执行";
            }
            else {
                $rootScope.confirmInfo = "是否确定提交表单";
            }
            $rootScope.confirmShow = true;
            $rootScope.confirmCallBack = submit;
            $scope.formData = formData;
            return false;
        }

        /**
         *自定义confirm确定
         */
        $rootScope.confirmOk = function() {
            if(typeof $rootScope.confirmCallBack === 'function') {
                //if($scope.isRoutine){ //例行任务时没有发料不允许关卡
                //	if($scope.nrc){
                //		server.maocGetReq('completeNRCTask' ).then(function(data) {
                //			console.log(data);
                //		});
                //	}else{
                //		server.maocGetReq('completeMaintenanceTask').then(function(data) {
                //			console.log(data);
                //		});
                //	}
                //	return;
                //}
                $rootScope.confirmCallBack($scope.formData);
            }
        }
        $rootScope.confirmCancel = function () {
            $rootScope.confirmShow = false;
        };

        $scope.historyGoPre2Page = function () {
            $window.history.go(-2);
        };

        function submit(formData) {

            $scope.myForm.$valid = false;
            $rootScope.startLoading();
            var newFormData = angular.copy(formData, {});
             if(!newFormData.hasOwnProperty('touchgo')){
                 newFormData.touchgo=0;
             }
            //LMJC
            if(-1 != formId.indexOf('TBM-001')) {

                var completeDate = newFormData.taskVO.completeDate;
                // completeDate.setHours(0,0,0);
                // if (configInfo.userCode == $scope.inspector.approverSn){
                //     $rootScope.errTip = '责任放行工程师不能是当前登录人'
                //     $rootScope.endLoading();
                //     $scope.myForm.$valid = true;
                //     return;
                // }
                var checkPho = newFormData.taskVO.mechanicNoPhotoRemark||''
                if($scope.imgArr.length < 1 && !checkPho.trim()){
                    $rootScope.errTip = '不上传照片时，无照片备注必填';
                    $rootScope.endLoading();
                    $scope.myForm.$valid = true;
                    return;
                }
                newFormData.lineJobId = $stateParams.cardInfo.lineJob.lineJobId;
                newFormData.flightId = $stateParams.cardInfo.lineJob.flightId;
                newFormData.flbBaseId = $stateParams.cardInfo.lineJob.flbBaseId;
                newFormData.taskVO.id = $stateParams.cardInfo.lineJob.id;
                newFormData.taskVO.status = 'Close';
                newFormData.taskVO.completeDate = completeDate.getTime();
                newFormData.taskVO.rci = $scope.isRci;
                if(newFormData.taskVO.rci){
                    newFormData.taskVO.checkName = $scope.inspector.approverName;
                    newFormData.taskVO.checkSn = $scope.inspector.approverSn;
                }
                newFormData.taskVO.attachmentList = $scope.fileList;
                newFormData.taskVO.attachmentList.forEach(function (item , i) {
                    item.content && delete item.content
                })
                if (!$scope.show747Engin) {
                    delete newFormData.oilRemain3;
                    delete newFormData.oilRemain4;
                    delete newFormData.oilUplift3;
                    delete newFormData.oilUplift4;
                }
                var padata={
                    lineJobId:newFormData.lineJobId,
                    touchgo:newFormData.touchgo
                };
                var checkObj = {
                    'T/R':1,
                    'Pr/F':1,
                    'TBFTR':1,
                    'TBF':1,
                }
                if(checkObj[$scope.checkType]){
                    $scope.interAirline && (newFormData.taskVO.laptopBag = $scope.isInter ? 'YES':'NO');
                }
                console.log(newFormData);
                server.maocPostReq('TBM/checkNonTrainingFlightMission',padata,true).then(function(data) {
                    if(data.data.data[0]){
                        if(confirm("本航班不是训练航班，请确认是否存在连续起落")){
                            server.maocFormdataPost('form/submit', formId, newFormData, $scope.fileArr).then(function(data) {
                                if(200 === data.data.statusCode) {
                                    if ($scope.isTlb2TO) {
                                        $scope.historyGoPre2Page();
                                    }
                                    else {
                                        $rootScope.go('back');
                                    }
                                    $scope.isEdited = true;
                                    $scope.isFlbEdited = true;
                                    if (-1 != formId.indexOf('TBM-002-B') && newFormData.licenseNo && !$scope.licenseExist && ($rootScope.ADMIN || $rootScope.ME_RELEASE)) {
                                        server.maocPostReq('maintain/meReleaseLicenseNo', {
                                            licenseNo: newFormData.licenseNo
                                        })
                                            .then(function(data) {
                                                if(200 === data.status) {
                                                    //存入到本地
                                                    configInfo.initConfigInfo({myId:newFormData.licenseNo});
                                                    console.log("更新执照号成功")
                                                }
                                            });
                                    }
                                } else {
                                    $scope.myForm.$valid = true;
                                }
                                $rootScope.endLoading();
                            }).catch(function(error) {
                                console.log(error);
                                $scope.myForm.$valid = true;
                                $rootScope.endLoading();
                            });
                        }
                    }else {
                        server.maocFormdataPost('form/submit', formId, newFormData).then(function(data) {
                            if(200 === data.data.statusCode) {
                                if ($scope.isTlb2TO) {
                                    $scope.historyGoPre2Page();
                                }
                                else {
                                    $rootScope.go('back');
                                }
                                $scope.isEdited = true;
                                $scope.isFlbEdited = true;
                                if (-1 != formId.indexOf('TBM-002-B') && newFormData.licenseNo.length==18 && !$scope.licenseExist && ($rootScope.ADMIN || $rootScope.ME_RELEASE)) {
                                    server.maocPostReq('maintain/meReleaseLicenseNo', {
                                        licenseNo: newFormData.licenseNo
                                    })
                                        .then(function(data) {
                                            if(200 === data.status) {
                                                //存入到本地
                                                configInfo.initConfigInfo({myId:newFormData.licenseNo});
                                                console.log("更新执照号成功")
                                            }
                                        });
                                }
                            } else {
                                $scope.myForm.$valid = true;
                            }
                            $rootScope.endLoading();
                        }).catch(function(error) {
                            console.log(error);
                            $scope.myForm.$valid = true;
                            $rootScope.endLoading();
                        });
                    }
                });
                $rootScope.endLoading();
                return
            }
            //NRC
            if(-1 != formId.indexOf('TBM-003-A')) {
                var completeDate = newFormData.nrcTime;
                var hour = newFormData.nrcAcTime.getHours();
                var minutes = newFormData.nrcAcTime.getMinutes();
                completeDate.setHours(hour,minutes,0);

                newFormData.nameAndId && delete newFormData.nameAndId;
                newFormData.nrcAcTime && delete newFormData.nrcAcTime;
                newFormData.taskType = $stateParams.taskType;
                newFormData.itemId = $stateParams.itemId;
                newFormData.nrcTime = completeDate.getTime();
            }
            //MCC/TLB/Review TLB/Review DD/TO其它
            if(-1 != formId.indexOf('TBM-002-A')) {
                newFormData.taskType = $stateParams.taskType;
                newFormData.itemId = $stateParams.itemId;
            }
            //EO/JC
            if(-1 != formId.indexOf('TBM-002-B')) {
                console.log("JIN---"+newFormData.completeDate);
                var completeDate = newFormData.completeDate;
                // completeDate.setHours(0,0,0);

                newFormData.taskType = $stateParams.taskType;
                newFormData.itemId = $stateParams.itemId;
                newFormData.completeDate = completeDate.getTime();
            }
            //TO排故类
            if(-1 != formId.indexOf('TBM-004-A')) {
                newFormData.taskType = $stateParams.taskType;
                newFormData.itemId = $stateParams.itemId;

                angular.forEach(newFormData.toTroubleShootingVOS,function(value,index){
                    value.isDel && delete value.isDel;
                    value.step && delete value.step;
                    value.suggestion && delete value.suggestion;
                    value.engineer && delete value.engineer;
                    value.editDate && delete value.editDate;
                })

            }
            //DD Process
            if(-1 != formId.indexOf('TBM-005-A')) {
                var completeDateStr = $filter('date')($scope.completeDate2,'yyyy/MM/dd')
                completeDateStr = completeDateStr.replace(new RegExp("-","gm"),"/");
                var time = completeDateStr+' '+ $scope.releaseHours+':'+$scope.releaseMinutes+':'+$scope.releaseSeconds;
                newFormData.completeDate = (new Date(time)).getTime();
                newFormData.inspectorAndName && delete newFormData.inspectorAndName;
                newFormData.taskType = $stateParams.taskType;
                newFormData.itemId = $stateParams.itemId;
                console.log('newFormData.completeDate'+newFormData.completeDate);
                // newFormData.completeDate ? newFormData.completeDate = newFormData.completeDate.getTime() : '';
            }
            //DD inspect
            if(-1 != formId.indexOf('TBM-005-B')) {
                newFormData.taskVO && delete newFormData.taskVO;
                newFormData.taskType = $stateParams.taskType;
                newFormData.itemId = $stateParams.itemId;
                newFormData.feedBack = $scope.feedBack;
                //newFormData.sn = $scope.ddInspect.staffNo;
            }
            // console.log(JSON.stringify(newFormData));
            /**
             * submit提交验证
             */
            server.maocFormdataPost('form/submit', formId, newFormData, $scope.fileArr).then(function(data) {

                if(200 === data.data.statusCode) {

                    if ($scope.isTlb2TO) {
                        $scope.historyGoPre2Page();
                    }
                    else {

                            $rootScope.go('back');


                    }

                    $scope.isEdited = true;
                    $scope.isFlbEdited = true;

                    if (-1 != formId.indexOf('TBM-002-B') && newFormData.licenseNo.length==18 && !$scope.licenseExist && ($rootScope.ADMIN || $rootScope.ME_RELEASE)) {
                        server.maocPostReq('maintain/meReleaseLicenseNo', {
                            licenseNo: newFormData.licenseNo
                        })
                            .then(function(data) {
                                if(200 === data.status) {
                                    //存入到本地
                                    configInfo.initConfigInfo({myId:newFormData.licenseNo});
                                    console.log("更新执照号成功")
                                }
                            });
                    }
                } else {
                    $scope.myForm.$valid = true;
                }
                $rootScope.endLoading();
            }).catch(function(error) {
                console.log(error);
                $scope.myForm.$valid = true;
                $rootScope.endLoading();
            });
        }

        /**
         * 日期校验
         */
        $scope.checkDate = function(dateParam) {
            //LMJC
            if(-1 != formId.indexOf('TBM-001')) {
                if(!angular.isDate($scope.formData.taskVO.completeDate)) {
                    $scope.formData.taskVO.completeDate = new Date();
                }
                if($scope.formData.taskVO.completeDate.getTime() > (new Date()).valueOf()) {
                    $scope.formData.taskVO.completeDate = new Date();
                    limitTip();
                }
            }
            //EO/JC 非例行 DD
            if(-1 != formId.indexOf('TBM-002')) {
                console.log($scope.formData.completeDate);
                if(!angular.isDate($scope.formData.completeDate)) {
                    $scope.formData.completeDate = new Date();
                }
                if($scope.formData.completeDate.getTime() > (new Date()).valueOf()) {
                    $scope.formData.completeDate = new Date();
                    limitTip();
                }
            }
            //DD Process
            if(-1 != formId.indexOf('TBM-005-A')) {
                if(!angular.isDate($scope.completeDate2)) {
                    $scope.completeDate2 = new Date();
                }
                if($scope.completeDate2.getTime() > (new Date()).valueOf()) {
                    $scope.completeDate2 = new Date();
                    limitTip();
                }
            }
            //NRC
            if(-1 != formId.indexOf('TBM-003-A')) {
                if (dateParam=="nrcTime") {
                    if(!angular.isDate($scope.formData.nrcTime)) {
                        $scope.formData.nrcTime = new Date();
                    }
                    if($scope.formData.nrcTime.getTime() > Date.now()) {
                        $scope.formData.nrcTime = new Date();
                        limitTip();
                    }
                }else if (dateParam=="nrcAcTime") {
                    if(!angular.isDate($scope.formData.nrcAcTime)) {
                        $scope.formData.nrcAcTime = new Date();
                    }
                    if($scope.formData.nrcAcTime.getTime() > Date.now()) {
                        $scope.formData.nrcAcTime = new Date();
                        limitTip();
                    }
                }

            }
        }

        function limitTip() {
            $rootScope.limitTip = true;
            $rootScope.shortLimitTip = true;
            $rootScope.limitTipContent = "日期不得大于当前时刻";
        }

        //选择图片后执行的方法
        $scope.fileArr = typeof($stateParams.actionFileArr) == 'undefined' ? [] : $stateParams.actionFileArr;
        $scope.imgSrcArr = typeof($stateParams.actionImgSrcArr) == 'undefined' ? [] : $stateParams.actionImgSrcArr;
        $scope.actionRemark = typeof($stateParams.actionRemark) == 'undefined' ? '' : $stateParams.actionRemark;
        var attachvo = [];
        var i = 0; //为ios上图片都为image时添加序号
        $rootScope.onFileSelect = function(files, event) {
            //预览上传图片开始
            $rootScope.startLoading();
            var $this = angular.element(event.target);
            var attachmentType = $this.attr('data');

            angular.forEach(files, function(value, index) {
                var fileIn = value;
                var fileInName = fileIn.name;
                var fileType = fileInName.substring(fileInName.lastIndexOf(".") + 1, fileInName.length);

                //解决ios下所有图片都为image.jpg的bug
                if(fileIn) {
                    fileInName = fileInName.split('.')[0] + i + '.' + fileType;
                    i++;
                }

                attachvo.push({
                    name: fileInName,
                    type: fileType,
                    attachmentType: attachmentType
                });

                $scope.formData.attachvo = attachvo;
                fileReader.readAsDataUrl(fileIn, $scope)
                    .then(function(result) {
                        result.name = fileInName;
                        $scope.fileArr.push(result);
                        $scope.imgSrcArr.push(URL.createObjectURL(result));

                        checkHasAttachment();
                        document.querySelector('.upload').reset();

                    });
                $scope.$on('fileProgress', function(event, data) {
                    if(data.total == data.loaded) {
                        $timeout(function() {
                            //上传图片结束
                            $rootScope.endLoading();
                        }, 200)

                    }

                });

            });
            $rootScope.showAttachment = false;
        };
        $scope.delCurUpload = function(event) {
            $rootScope.confirmInfo = "是否确定删除该图片";
            $rootScope.confirmShow = true;
            $rootScope.confirmCallBack = function() {
                angular.forEach($scope.imgSrcArr, function(item, key) {
                    if(event == item) {
                        $scope.imgSrcArr.splice(key, 1);
                        attachvo.splice(key, 1);
                        $scope.fileArr.splice(key, 1);
                        checkHasAttachment()
                    }
                });
            };

            return false;

        }

        /**
         * NRC界面RII搜索姓名和工号
         * 自动完成，返回姓名和工号	 *
         * @param 姓名或工号，页面传入
         *
         */
        var tempParam;
        $scope.setRiierSn = function(param, enter){
            if(tempParam != param || enter&&tempParam == param){ //这个判断是解决三星A8输入法有“预测文本”功能时选择不生效的问题
                if(param && param.length >= 2) { //当输入大于2位时返回结果
                    $scope.dropdown = true;
                    $scope.loadApprover = true; //请求列表时显示loading
                    $scope.workInfoList = [];
                    var params = {
                        dept: '机务', //'机务',
                        k: param
                    };
                    server.maocGetReq('common/emp', params).then(function(data) {
                        if(200 === data.status) {
                            $scope.workInfoList = data.data.data || [];

                        }
                        $scope.loadApprover = false;
                    }).catch(function(error) {
                        console.log(error);
                        $scope.loadApprover = false;
                    });
                } else {
                    $scope.dropdown = false;
                }
            }
            tempParam = angular.copy(param);
        }
        $scope.setRiier = function(e) {
            if(e.keyCode == 13) {
                $scope.setRiierSn($scope.formData.nameAndId, true);
            }
        }
        $scope.setInspector = function(e) {
            if(e.keyCode == 13) {
                $scope.setRiierSn($scope.formData.inspectorAndName, true);
            }
        }

        //mh工时录入失去焦点时，对小数点的判断
        $scope.pointCheck = function(event) {
            var className = event.target.className;
            var value = event.target.value;
            var reg = /\.$/;
            var reg1 = /^\.\d+$/;
            var reg2 = /^\d*?\.?\d*?$/;

            if (!value.match(reg2)) {
                value = '';
                event.target.value = value;
            }
            if(reg.test(value)) {
                value = value.replace('.', '');
            } else if(reg1.test(value)) {
                value = '0' + value;
            }
            if(value == 0) {value = '';}
            if(-1 != className.indexOf('manHours')) {
                $scope.formData.manHours = value;
            }
            if(-1 != className.indexOf('mh')) {
                $scope.formData.mh = value;
            }
        }

        /**
         * DD Process手动输入时分秒输入限制
         */
        $scope.T1_onkeyup = function() {
            var hours = $scope.releaseHours;
            if(hours>23){
                $scope.releaseHours = 23
            }else{
                $scope.releaseHours = hours &&　hours.replace(/[^0-9$]/g, '');
            }
            //$scope.releaseHours = parseInt(hours)
            if(hours&&hours.length==2&&!isNaN(hours)){

                document.getElementById('T2').focus();
            }
        }
        $scope.T2_onkeyup = function() {
            var minutes = $scope.releaseMinutes;
            if(minutes>59){
                $scope.releaseMinutes = 59
            }else{
                $scope.releaseMinutes = minutes &&　minutes.replace(/[^0-9$]/g, '');
            }
            //$scope.releaseMinutes = parseInt(minutes)
            if(minutes&&minutes.length==2&&!isNaN(minutes)){
                document.getElementById('T3').focus();
            }
        }
        $scope.T3_onkeyup = function() {
            var seconds = $scope.releaseSeconds;
            if(seconds>59){
                $scope.releaseSeconds = 59
            }else if(seconds&&seconds.length>=3){
                $scope.releaseSeconds = seconds.substring(0,2)
            }else{
                $scope.releaseSeconds = seconds &&　seconds.replace(/[^0-9$]/g, '');
            }
            //$scope.releaseSeconds = parseInt(seconds)
        }
        /**
         * 删除时分秒时不会自动跳到前一栏删除
         */
        $scope.cursorForward = function(event){
            var minutes = $scope.releaseMinutes;
            var seconds = $scope.releaseSeconds;
            if(minutes==undefined||!minutes||minutes.length==0){
                if(event.keyCode == 8){
                    event.preventDefault();
                    document.getElementById('T1').focus();
                }
            }else if(seconds==undefined||!seconds||seconds.length==0){
                if(event.keyCode == 8){
                    event.preventDefault();
                    document.getElementById('T2').focus();
                }
            }
        }
        //点击时间输入全选或者光标靠右
        $scope.selectAll = function (event) {
            var len = event.target.value.length;
//			event.target.select();
//				if($rootScope.ios){
            event.target.setSelectionRange(len, len);
//			}
        }

        checkHasAttachment();

    //    发动机滑油输入提示
        $scope.inputOilPrompt = function (position,value) {
            console.log('inputOilPrompt'+JSON.stringify(position +"和"+value));
            var oilValue = value;
            var position = position;
            if(oilValue > 5){
                var prompt = "确认滑油添加"+ value +"夸脱？";
                $rootScope.confirmInfo = prompt;
                $rootScope.confirmShow = true;
                $rootScope.confirmOk = function () {
                    console.log("1");
                    $rootScope.confirmShow = false;
                    return;
                };
                $rootScope.confirmCancel = function () {
                    console.log("2");
                    if(position == "oilUpliftL"){
                        $scope.formData.oilUpliftL = '';
                    }else if(position == "oilUpliftR"){
                        $scope.formData.oilUpliftR = '';
                    }else if(position == "oilUplift3"){
                        $scope.formData.oilUplift3 = '';
                    }else if(position == "oilUplift4"){
                        $scope.formData.oilUplift4 = '';
                    }else if(position == "oilUpliftApu"){
                        $scope.formData.oilUpliftApu = '';
                    }
                    $rootScope.confirmShow = false;
                }
            }
        }

    }

]);