module.exports = angular.module('myApp').controller('airLineProcessDetailController',
    ['$rootScope', '$scope', '$filter', '$stateParams', '$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter, $stateParams, $interval, $localForage, configInfo, b64ToBlob, $timeout) {

            // $scope.acReg = $stateParams.cardInfo.acReg;
            // console.info($stateParams.paramObj);
            $rootScope.startLoading();
            // $scope.paramObj = $stateParams.paramObj;
            $scope.relateImg = [];
            $scope.showImg = [];
            $scope.fileList = [];
            $scope.pdfList = [];
            $scope.imgArr = [];
            $scope.fileArr = [];
            $scope.writeSum = false;
            $scope.typeName = $stateParams.cardType;
            $scope.apsWay = 'feedback';
            $scope.isEdit = $stateParams.isEdit;
            function initPage(){
                $rootScope.searchTlbFrom = 'status';
                var urlObj = {
                    'JC':'TBM/getJCFeedbackTask/',
                    'PCO':'TBM/getPCOFeedbackTask/',
                    'TO':'TBM/getTOFeedbackTask/',
                    'ReviewDefect':'TBM/getDDReviewFeedbackTask/',
                    'NRCT':'maintain/getNrcOrNrcTaskFeedbackInfo/',
                    'CCO':'TBM/getCCOFeedbackTask/',
                    'NRC':'maintain/getNrcOrNrcTaskFeedbackInfo/',
                };
                // var hasFlbNo = $stateParams.cardInfo.lineJob.hasFlbNo;
                server.maocGetReq(urlObj[$stateParams.cardType] + $stateParams.workId).then(function(data) {
                    if(200 === data.status) {
                        $scope.info = data.data.data[0];
                        if($scope.isEdit){
                            $scope.fileList = $scope.info.attachmentList;
                            angular.forEach($scope.info.attachmentList, function (item, index) {
                                var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                imgBlob.name = item.name.indexOf('down') == -1
                                    ? imgName + 'down' + imgType
                                    : item.name;
                                $scope.fileArr.push(imgBlob);
                                $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));

                            })
                        }

                        // $scope.info.attachmentList && angular.forEach($scope.info.attachmentList, function(v, i){
                        //     if (v.type.indexOf('image') == -1) {
                        //         // console.info(i,'123213')
                        //         $scope.info.attachmentList.splice(i, 1);
                        //         $scope.pdfList.push(v)
                        //
                        //     }
                        // });
                        // $scope.relateImg = $scope.info.attachmentList || [];
                        // $scope.apsrelateImg = $scope.info.apsAttachmentList || [];

                    }
                    $rootScope.endLoading();
                }).catch(function(error) {
                    console.log(error);
                    $rootScope.endLoading();
                });
            }
            initPage();
            $scope.hideApproverTitle = true;//隐藏选人默认状态

            //
            // $scope.showPdf = function(param){
            //     var type = angular.lowercase(param.remark);
            //     if (type == 'doc' || type == 'docx' || type == "txt"
            //         || type == "tif"|| type == "xls"  || type == "xlsx") {
            //         alert('暂不支持此格式预览');
            //         return;
            //     }
            //     // console.info(param,'param');
            //     NativeAppAPI.openPdfWithUrl(param)
            //
            // };
            //
            // $scope.showBig = function (img_arr, img_index) {
            //     var images= img_arr.map(function(item){
            //         return item.content
            //     });
            //     OPENAPI.loadImages({
            //         images: images,
            //         activeIndex: 0,
            //         bgColor: "#000"
            //     });
            //     setTimeout(function(){
            //         var images_to_show = img_arr.map(function(item){
            //             return item.content
            //         });
            //         OPENAPI.scanPhoto({
            //             images: images_to_show,
            //             activeIndex: img_index,
            //             bgColor: "#000"}, img_index);
            //
            //         $scope.addCloseEventListener();
            //     },500);
            //
            //
            // };
            // $scope.addCloseEventListener = function (){
            //     api.addEventListener({
            //         name: 'angularKeyback'
            //     }, function(ret, err){
            //         $scope.closePhoto();
            //     });
            // };
            //
            // $scope.closePhoto = function (){
            //     OPENAPI.closePhoto();
            //     api.addEventListener({
            //         name: 'angularKeyback'
            //     }, function(ret, err){
            //         $rootScope.go('back');
            //     });
            // };
            // $scope.openNewPageWithData = function(param){
            //     var type = angular.lowercase(param.type);
            //     if (type == 'doc' || type == 'docx' || type == "txt"
            //         || type == "tif"|| type == "xls"  || type == "xlsx") {
            //         alert('暂不支持此格式预览');
            //         return;
            //     }
            //     console.info(param,'param');
            //     NativeAppAPI.openPdfWithUrl(param)
            // };


        }
    ]);


