module.exports = angular.module('myApp').controller('processImgRecordController',
    ['$rootScope', '$scope', 'server', '$stateParams', function ($rootScope, $scope, server, $stateParams) {
        NativeAppAPI.hideTabBar();
        // $scope.isHandle = $stateParams.isHandle;
        $rootScope.endLoading();
        $scope.pdfList = [];
        $scope.relateImg = [];
        console.info($stateParams.imgArr);
        $scope.imgUrl = null;
        function initPage(){
            $scope.attachmentList = $stateParams.imgArr;
            angular.forEach($scope.attachmentList, function(v, i){
                if (v.type.indexOf('image') == -1) {
                    // $scope.attachmentList.splice(i, 1);
                    $scope.pdfList.push(v)
                }else{
                    $scope.relateImg.push(v)
                }
            });

            var images= $scope.relateImg.map(function(item){
                return item.content
            });
            OPENAPI.loadImages({
                images: images,
                activeIndex: 0,
                bgColor: "#000"
            });
        }
        initPage();
        $scope.showImg = function (img_arr, img_index) {

            var images_to_show = img_arr.map(function(item){
                return item.content
            });
            // console.info(images_to_show,'images_to_show');
            OPENAPI.scanPhoto({
                images: images_to_show,
                activeIndex: img_index,
                bgColor: "#000"}, img_index);

            $scope.addCloseEventListener();

        };
        $scope.closeImg = function () {
            $scope.imgUrl = null;
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


    }
    ]);