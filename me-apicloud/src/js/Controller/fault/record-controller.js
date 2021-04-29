module.exports = angular.module('myApp').controller('faultFileRecordController',
    ['$rootScope', '$scope', 'server', '$stateParams', function ($rootScope, $scope, server, $stateParams) {
        NativeAppAPI.hideTabBar();
        $rootScope.endLoading();
        $rootScope.startLoading();
        $scope.isHandle = $stateParams.isHandle;
        $scope.imgUrl = null;
        $scope.showImg = function (img_arr, img_index) {
            // var base64 = 'data:image/png;base64,' + item.content;
            var images_to_show = img_arr.map(function(item){
                return item.content
            })
            OPENAPI.scanPhoto({
                images: images_to_show,
                activeIndex: img_index,
                bgColor: "#000"}, img_index)

            $scope.addCloseEventListener();
            // $scope.imgUrl = 'data:image/png;base64,' + item.content;
            // $scope.imgUrl = imggg;
        };
        $scope.closeImg = function () {
            $scope.imgUrl = null;
        };
        //if ($scope.isHandle) {
        //    /**
        //     * 排故措施图片列表
        //     */
            server.maocGetReq($stateParams.interfaceName, $stateParams.param).then(function (result) {
                if (200 === result.status) {
                    if (result.data.dataSize > 0) {
                        var uploadByName = '';
                        for (var i = 0, item; item = result.data.data[i++];) {
                            if (uploadByName != '' && uploadByName != item.uploadByName) {
                                uploadByName = item.uploadByName;
                                item.change = true;
                            } else {
                                uploadByName == '' && (uploadByName = item.uploadByName);
                                item.change = false;
                            }
                        }
                        $scope.data = result.data;
                        var images_to_show = result.data.data.map(function(item){
                            return item.content
                        })
                        OPENAPI.loadImages({
                            images: images_to_show,
                            activeIndex: 0,
                            bgColor: "#000"
                        });
                    } else {
                        $scope.data = [];
                    }
                }
                $rootScope.endLoading();
            }).catch(function (error) {
                $rootScope.endLoading();
            });
        //} else {
        //    server.maocGetReq('defect/findVoicePictureByDefectId', {defectId: $stateParams.defectId}).then(function (result) {
        //        if (200 === result.status) {
        //            if (result.data.data.length > 0) {
        //                var uploadByName = '';
        //                for (var i = 0, item; item = result.data.data[i++];) {
        //                    if (uploadByName != '' && uploadByName != item.uploadByName) {
        //                        uploadByName = item.uploadByName;
        //                        item.change = true;
        //                    } else {
        //                        uploadByName == '' && (uploadByName = item.uploadByName);
        //                        item.change = false;
        //                    }
        //                }
        //                $scope.data = result.data;
        //            } else {
        //                $scope.data = [];
        //            }
        //        }
        //        $rootScope.endLoading();
        //    }).catch(function (error) {
        //        $rootScope.endLoading();
        //    });
        //}

        $scope.addCloseEventListener = function (){
            api.addEventListener({
                name: 'angularKeyback'
            }, function(ret, err){
                $scope.closePhoto();
            });
        }

        $scope.closePhoto = function (){
            OPENAPI.closePhoto();
            api.addEventListener({
                name: 'angularKeyback'
            }, function(ret, err){
                $rootScope.go('back');
            });
        }


    }
    ]);