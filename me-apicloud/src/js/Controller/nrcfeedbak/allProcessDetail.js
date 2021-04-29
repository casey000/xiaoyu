module.exports = angular.module('myApp').controller('allProcessDetailController',
    ['$rootScope', '$scope', '$filter', '$stateParams', '$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter, $stateParams, $interval, $localForage, configInfo, b64ToBlob, $timeout) {

            $scope.acReg = $stateParams.cardInfo.acReg;

            $rootScope.startLoading();

            $scope.relateImg = [];
            $scope.fileList = [];
            $scope.pdfList = [];
            $scope.imgArr = [];
            $scope.fileArr = [];
            $scope.writeSum = false;
            $scope.apswriteSum = false;
            function initPage(){
                // var hasFlbNo = $stateParams.cardInfo.lineJob.hasFlbNo;
                server.maocGetReq('maintain/getMe2FlbStaLine/' + $stateParams.cardInfo.lineJob.lineJobId).then(function(data) {
                    if(200 === data.status) {
                        $scope.info = data.data.data[0];
                        $scope.checkList = [
                            {
                                text:'是否已复核',
                                isChecked:$scope.info.taskVO.isChecked
                            }
                        ];
                        $scope.info.taskVO.attachmentList && angular.forEach($scope.info.taskVO.attachmentList, function(v, i){
                            if (v.type.indexOf('image') == -1) {
                                // console.info(i,'123213')
                                $scope.info.taskVO.attachmentList.splice(i, 1);
                                $scope.pdfList.push(v)

                            }
                        });
                        $scope.relateImg = $scope.info.taskVO.attachmentList || [];

                        var images= $scope.relateImg.map(function(item){
                            return item.content
                        });
                        OPENAPI.loadImages({
                            images: images,
                            activeIndex: 0,
                            bgColor: "#000"
                        });

                        $scope.show747Engin = typeof($scope.info.model) != 'undefined'&&$scope.info.model.indexOf('747') != -1;
                    }
                    $rootScope.endLoading();
                }).catch(function(error) {
                    console.log(error);
                    $rootScope.endLoading();
                });
            }
            initPage();
            $scope.hideApproverTitle = true;//隐藏选人默认状态
            // var editBase,editNext;


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

                setTimeout(function(){
                    var images_to_show = img_arr.map(function(item){
                        return item.content
                    });
                    OPENAPI.scanPhoto({
                        images: images_to_show,
                        activeIndex: img_index,
                        bgColor: "#000"}, img_index);

                    $scope.addCloseEventListener();
                },200);


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
                console.info(param,'param');
                NativeAppAPI.openPdfWithUrl(param)
            };









            $scope.keyEvent = function () {

            }














        }
    ]);


