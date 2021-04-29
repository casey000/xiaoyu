module.exports = angular.module('myApp').controller('riirciProcessController',
    ['$rootScope', '$scope', '$stateParams', 'server','$location','$localForage','$anchorScroll', 'configInfo', '$window', '$filter', 'b64ToBlob',
        function ($rootScope, $scope, $stateParams,  server,$location, $anchorScroll,$localForage, configInfo,$window, $filter, b64ToBlob) {
            $scope.hideApproverTitle = true;
            $scope.checkList = [
                {
                    text:'是否已复核',
                    isChecked:false
                }
            ];
            $scope.taskupWay = 'aps';
            $scope.workType = $stateParams.type;
            $scope.nrcId = $stateParams.businessId;
            $scope.rii = $stateParams.rii;
            $scope.rci = $stateParams.rci;
            if($scope.workType == 'DEFECT' || $scope.workType == 'TLB'){
                $scope.rii == 'y' ? $scope.title = '必检反馈' :$scope.rci == 'y' ? $scope.title = '互检反馈':"";
            }else{
                $scope.rii ? $scope.title = '必检反馈'  :$scope.title = '互检反馈'
            }
            $scope.mech = {
                nameAndId: '',
                approverSn: '',
                approverName:'',
                approverId:'',
            };
            $scope.$watch('mech.nameAndId',function(n,o){
                if(n){
                    console.info(n)
                }
            })
            $scope.userCode = configInfo.userCode;
            $scope.transSure = function(){
                // console.log($scope.mech)
                if(!$scope.mech.approverId){
                    $rootScope.errTip = "请选择转办人";
                    return;
                }
                $rootScope.startLoading();
                server.maocPostReq('TBM/turnToApsProcessTask',{taskId:$stateParams.taskId,userId:$scope.mech.approverId}).then(function (data) {
                    $rootScope.endLoading();
                    if (200 === data.status) {
                        alert('转办成功');
                        $rootScope.go('back');
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.initInfo = function () {
                $scope.imgArrTask = [];
                $scope.fileArrTask = [];
                $scope.relateImg = [];
                $scope.fileList = [];
                $scope.pdfList = [];
                !$scope.pullToRefreshActive  && $rootScope.startLoading();
                server.maocPostReq('TBM/getApsFlowDetail', {modle:$stateParams.type,businessId:$stateParams.businessId},true).then(function (data) {
                    if (200 == data.data.statusCode) {
                        $scope.info = data.data.data[0];

                        $scope.workType != 'JC' && angular.forEach($scope.info.attachmentList, function(v, i){
                            if (v.type.indexOf('image') == -1) {
                                // console.info(i,'123213')
                                $scope.info.attachmentList.splice(i, 1);
                                $scope.pdfList.push(v)

                            }
                        });

                        $scope.relateImg = $scope.info.attachmentList;

                        var images= $scope.relateImg.map(function(item){
                            return item.content
                        });
                        $scope.workType != 'JC' && OPENAPI.loadImages({
                            images: images,
                            activeIndex: 0,
                            bgColor: "#000"
                        });


                        $scope.fileList = $scope.info.apsAttachmentList;
                        //获取已上传附件的列表
                        angular.forEach($scope.fileList, function (item, index) {
                            var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                            var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                            var imgType = item.name.substring(item.name.lastIndexOf('.'));
                            imgBlob.name = item.name.indexOf('down') == -1
                                ? imgName + 'down' + imgType
                                : item.name;
                            $scope.fileArrTask.push(imgBlob);
                            $scope.imgArrTask.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));

                        });
                        $rootScope.endLoading();
                        $scope.pullToRefreshActive = false;


                    }
                }).catch(function (error) {
                    $scope.pullToRefreshActive = false;
                    $rootScope.endLoading();
                });

            };
            $scope.initInfo();
            $scope.goImg = function (type) {
                console.info(type)
                type == 'feedback' ? $scope.readFeed = true : $scope.readAps = true
                type == 'feedback' ? $rootScope.go('riirciProcess.processImgRecord','',{imgArr:$scope.info.attachmentList})
                    : $rootScope.go('riirciProcess.processImgRecord','',{imgArr:$scope.info.apsFeedbackAttachmentList})
            };
            //Android返回键单独处理
            if($rootScope.android){
                api.removeEventListener({
                    name: 'angularKeyback'
                });
                api.addEventListener({
                    name: 'angularKeyback'
                }, function(ret, err){
                    $rootScope.go('back')
                });
            }
            $scope.showFlow = function(){
                $scope.writeSum = true;
                if($scope.relateImg.length > 0 || $scope.pdfList.length > 0){
                    $scope.isRead = true
                }
            }
            $scope.helpSure = function(){

                if($scope.workType == 'FIXED_TASK' || $scope.workType == 'AIRLINE_TASK'){
                    if(!$scope.relateImg.length && !$scope.pdfList.length){
                        var obj = {
                            'Pr/F' :'航前',
                            'T/R' :'短停',
                            'Po/F' :'航后',
                        };
                        if(!$scope.info.mechanicNoPhotoRemark){
                            $rootScope.errTip = obj[$stateParams.subType] + '工卡维修工作图片记录为空且没有无照片备注，请联系技术员上传图片或填写无照片备注后再做反馈提交';
                            return;
                        }

                    }
                }
                if($scope.workType != 'FIXED_TASK' && $scope.workType != 'AIRLINE_TASK') {
                    var checkPhoto = $scope.info.inspectorNoPhotoRemark || ''
                    if($scope.imgArrTask.length < 1 && !checkPhoto.trim()){
                        $rootScope.errTip = '不上传照片时，无照片备注必填';
                        return;
                    }
                }

                if(($scope.relateImg.length > 0 || $scope.pdfList.length > 0) && ($scope.workType !='JC')){
                    if(!$scope.isRead){
                        $rootScope.errTip = '请先阅读图片记录，再反馈提交';
                        return;
                    }
                }
                if($scope.workType =='JC'){
                    if($scope.info.isRequiredFeedback){
                        if($scope.info.attachmentList.length > 0  ){
                            if(!$scope.readFeed){
                                $rootScope.errTip = '请先查看非APS图片记录，再反馈提交';
                                return;
                            }
                        }
                        if($scope.info.apsFeedbackAttachmentList.length > 0 ){
                            if(!$scope.readAps){
                                $rootScope.errTip = '请先查看APS图片记录，再反馈提交';
                                return;
                            }
                        }
                    }else{
                        if($scope.info.attachmentList.length > 0  ){
                            if(!$scope.readFeed){
                                $rootScope.errTip = '请先查看APS图片记录，再反馈提交';
                                return;
                            }
                        }
                    }

                }

                // alert('then')
                $rootScope.startLoading();
                server.maocPostReq('TBM/processApsRiiRciFlow', {taskId:$stateParams.taskId,businessId:$stateParams.businessId,action:'complete',sn:$scope.userCode,inspectorNoPhotoRemark:$scope.info.inspectorNoPhotoRemark||''},true).then(function (data) {
                    $rootScope.endLoading();
                    if (200 == data.data.statusCode) {
                        $rootScope.endLoading();
                        $rootScope.errTip='提交成功';
                        $rootScope.go('back');

                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                    console.log(error);
                });
            };
            $scope.showPdf = function(param){
                var type = angular.lowercase(param.remark);
                if (type == 'doc' || type == 'docx' || type == "txt"
                    || type == "tif"|| type == "xls"  || type == "xlsx") {
                    alert('暂不支持此格式预览');
                    return;
                }
                // console.info(param,'param');
                NativeAppAPI.openPdfWithUrl(param)

            };

            $scope.showBig = function (img_arr, img_index) {


                    var images_to_show = img_arr.map(function(item){
                        return item.content
                    });
                    OPENAPI.scanPhoto({
                        images: images_to_show,
                        activeIndex: img_index,
                        bgColor: "#000"}, img_index);

                    $scope.addCloseEventListener();



            };
            $scope.addCloseEventListener = function (){
                api.addEventListener({
                    name: 'angularKeyback'
                }, function(ret, err){
                    $scope.closePhoto();
                });
            };

            $scope.closePhoto = function (){
                OPENAPI.closePhoto();
                api.addEventListener({
                    name: 'angularKeyback'
                }, function(ret, err){
                    $rootScope.go('back');
                });
            };
            $scope.openNewPageWithData = function(param){
                var type = angular.lowercase(param.type);
                if (type == 'doc' || type == 'docx' || type == "txt"
                    || type == "tif"|| type == "xls"  || type == "xlsx") {
                    alert('暂不支持此格式预览');
                    return;
                }
                // console.info(param,'param');
                NativeAppAPI.openPdfWithUrl(param)
            };
        }    
    ]);