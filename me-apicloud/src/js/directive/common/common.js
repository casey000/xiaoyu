angular.module('myApp')
    .directive('moacHeader', function () {
        return {
            restrict: 'E',
            templateUrl: 'common/header.html',
            replace: true,
            transclude: true,
            link: link
        };

        function link(scope, ele, attr) {

        }
    })
    .directive('moacBody', function () {
        return {
            restrict: 'E',
            transclude: true,
            template: '<div class="ui-body"><ng-transclude></ng-transclude></div>',
            replace: true
        };
    })
    .directive('uiSearch', function () {
        /**
         * 搜索指令
         */
        return {
            restrict: 'E',
            templateUrl: 'common/search.html',
            replace: true,
            scope: {
                placeholder: '@',
                search: '&',
                searchVal: '=',
                isAccurate: '='
            },
            link: link
        };

        function link($scope) {
            $scope.keyEvent = function (event) {
                if (event.keyCode === 13) {
                    $scope.search();
                }
            }

            //小写转化成大写进行搜索，航材系统无法搜索小写字母
            $scope.$watch('searchVal',function (newVal,oldValue) {
                if (newVal) {
                    $scope.searchVal = newVal.toUpperCase();
                }
            });
        }
    })
    .directive('fixedSearch', function () {
        /**
         * 定检搜索指令
         */
        return {
            restrict: 'E',
            templateUrl: 'common/fixedSearch.html',
            replace: true,
            scope: {
                placeholder: '@',
                search: '&',
                searchVal: '=',
                changetip:'&',
                searchName:'=',
                showTip:'='
            },
            link: link
        };

        function link($scope) {
            $scope.keyEvent = function (event) {
                if (event.keyCode === 13) {
                    $scope.search();
                }
            };


        }
    })
    .directive("sound", ['$interval', '$rootScope', function ($interval, $rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'common/sound.html',
            scope: {
                isSound: '=',
                uploadSoundArr: '='
                //soundArrList: '='
            },
            link: function (scope, element, attr) {
                scope.soundState = false;
                scope.changeSound = function () {
                    scope.isSound = !scope.isSound;
                };
                scope.soundArr = [];
                scope.soundArrList = [];
                var timeLen = 0, interval = null;
                scope.soundTouchStart = function () {
                    if (scope.soundState) { return };
                    timeLen = 1;
                    clearInterval(interval);
                    scope.soundState = true;
                    interval = $interval(function () {
                        timeLen++;
                    }, 1000);
                    //开始录音
                    NativeAppAPI.startAudioCapture();
                };

                scope.soundTouchEnd = function () {
                    scope.soundState = false;
                    clearInterval(interval);
                    /**
                     * 录音结束
                     */
                    NativeAppAPI.stopAudioCapture();
                    window.audioCaptureFinishCallback = function (data, time, format) {
                        if (data) {
                            scope.soundArr.push({
                                length: Number(time).toFixed(1),
                                soundData: decodeURIComponent(data), //目前apicloud返回的是文件地址
                                type: format
                            });
                        }
                    }
                };

                scope.lastPlayIndex = -1;
                scope.isPlay = false;

                //播放录音
                scope.playSound = function (item, index) {
                    // NativeAppAPI.audioPlayerStart(item.soundData);

                    if ((scope.lastPlayIndex === index) && (scope.isPlay === true)) {
                        scope.stopSound();
                    }
                    else {
                        NativeAppAPI.audioPlayerStart(item.soundData);
                        scope.lastPlayIndex = index;
                        scope.isPlay = true;
                        //播放完成回调
                        window.audioPlayerPlayEndCallback = function () {
                            scope.lastPlayIndex = -1;
                            scope.isPlay = false;
                        }
                    }
                }

                //停止播放录音
                scope.stopSound = function () {
                    NativeAppAPI.audioPlayerStop();
                    lastPlayIndex = -1;
                    scope.isPlay = false;
                }

                scope.removeSound = function (idx) {
                    console.log('sound');
                    scope.uploadSoundArr.splice(idx, 1);
                    //scope.soundArrList.splice(idx, 1);
                    scope.stopSound();
                };
                /**
                 *取消上传
                 */
                scope.cancelSound = function () {
                    scope.soundArr = [];
                    scope.stopSound();
                };
                /**
                 *提交上传
                 */
                scope.saveSound = function () {
                    scope.uploadSoundArr = scope.uploadSoundArr.concat(scope.soundArr);
                    scope.soundArrList = scope.soundArrList.concat(scope.soundArr);
                    //console.log(JSON.stringify(scope.soundArrList));

                    scope.soundArr = [];
                    scope.isSound = !scope.isSound;
                    scope.stopSound();
                };
            }
        }
    }])
    .directive("soundItem", function () {
        return {
            restrict: 'E',
            templateUrl: 'common/soundItem.html',
            scope: {
                uploadSoundArr: '=',
                editSound: '=', //编辑预览所用
                delSoundId: '=',
                soundArrList: '='
            },
            link: function (scope) {
                scope.delSoundId = [];

                scope.lastPlayIndex = -1;
                scope.isPlay = false;
                //播放录音
                scope.playSound = function (item, index) {
                    if ((scope.lastPlayIndex === index) && (scope.isPlay === true)) {
                        scope.stopSound();
                    }
                    else {
                        NativeAppAPI.audioPlayerStart(item.soundData);
                        scope.lastPlayIndex = index;
                        scope.isPlay = true;
                        //播放完成回调
                        window.audioPlayerPlayEndCallback = function () {
                            scope.lastPlayIndex = -1;
                            scope.isPlay = false;
                        }
                    }
                }

                //停止播放录音
                scope.stopSound = function () {
                    NativeAppAPI.audioPlayerStop();
                    lastPlayIndex = -1;
                    scope.isPlay = false;
                }

                var soundId = '';
                scope.delete = function (idx) {
                    console.log(JSON.stringify(scope.uploadSoundArr));
                    scope.stopSound();
                    soundId = scope.uploadSoundArr.splice(idx, 1);

                    console.log(JSON.stringify(soundId));
                    if(typeof soundId[0].id != 'undefined'){
                        scope.delSoundId.push(soundId[0].id);
                    }
                    console.log(scope.delSoundId);
                }
                //scope.delete = function (idx) {
                //    scope.stopSound();
                //    scope.uploadSoundArr.splice(idx, 1);
                //}
            }
        }
    })
    .directive('imgSelect', ['$rootScope', '$timeout', 'fileReader', function ($rootScope, $timeout, fileReader) {
        return {
            restrict: 'E',
            templateUrl: 'common/img-select.html',
            scope: {
                imgArr: '=',
                fileArr: '=',
                attachvo: '=',
                isApiCloud: '=',
                delImgId: '='
            },
            link: function (scope, elem, attr) {
                scope.fileArr = [];//路径
                scope.imgArr = []; //页面预览所用地址列表，base64
                scope.attachvo = [];
                scope.delImgId = [];  //编辑时删除的附件的Id

                var i = 0; //为ios上图片都为image时添加序号

                scope.fileSelect = function (files, event) { //当为apicloud时,files指的是图片选项"图片/拍照"
                    //预览上传图片开始
                    $rootScope.startLoading();

                    if (scope.isApiCloud) {
                            api.getPicture({
                                sourceType: files,
                                encodingType: 'jpg',
                                mediaValue: 'pic',
                                destinationType: 'base64',
                                quality: 20,
                                saveToPhotoAlbum: true
                            }, function (ret, err) {
                                $timeout(function () {
                                    scope.selectImgItem = '';
                                    if (ret && ret.data) {
                                        console.log(ret.data);
                                        scope.fileArr.push(ret.data);//图片路径
                                        scope.imgArr.push(ret.base64Data);
                                    }
                                    $rootScope.endLoading();
                                });
                            });
                    } else {
                            //预览上传图片开始
                            if (files.length == 0) {
                                return;
                            }

                            $rootScope.startLoading();
                            var $this = angular.element(event.target);
                            var attachmentType = $this.attr('data');

                            angular.forEach(files, function (value, index) {
                                var fileIn = value;
                                var fileInName = fileIn.name;
                                var fileType = fileInName.substring(fileInName.lastIndexOf(".") + 1, fileInName.length);

                                //解决ios下所有图片都为image.jpg的bug
                                if (fileIn) {
                                    fileInName = fileInName.split('.')[0] + i + '.' + fileType;
                                    i++;
                                }
                                scope.attachvo.push({
                                    name: fileInName,
                                    type: fileType
                                    //attachmentType: attachmentType
                                });
                                fileReader.readAsDataUrl(fileIn, scope)
                                    .then(function (result) {
                                        result.name = fileInName;
                                        scope.fileArr.push(result);
                                        scope.imgArr.push(URL.createObjectURL(result));
                                    });

                                scope.$on('fileProgress', function (event, data) {
                                    if (data.total == data.loaded) {
                                        $timeout(function () {
                                            //上传图片结束
                                            $rootScope.endLoading();
                                        }, 200)
                                    }
                                });
                            });
                        }
                        $rootScope.showAttachment = false; //Nrc弹出层会影响到其它添加附件
                }

                scope.showBig = function (src) {
                    $rootScope.showImage = true;
                    $rootScope.rootImgUrl = src;
                    api.addEventListener({
                        name: 'angularKeyback'
                    }, function(ret, err){
                        $rootScope.closeBig();
                    });
                };

                $rootScope.closeBig=function() {
                    if($rootScope.showImage){
                        alert("请先关闭图片！");
                    }else {
                        api.addEventListener({
                            name: 'angularKeyback'
                        }, function(ret, err){
                            $rootScope.go('back');
                        });
                        $rootScope.go('back');
                    }
                }

                var imgId = '';
                scope.delCurUpload = function (event) {
                    $rootScope.confirmInfo = "是否确定删除该图片";
                    $rootScope.confirmShow = true;
                    $rootScope.confirmOk = function () {
                        angular.forEach(scope.imgArr, function (item, key) {
                            if (event == item) {
                                scope.imgArr.splice(key, 1);
                                scope.attachvo.splice(key, 1);
                                imgId = scope.fileArr.splice(key, 1);
                                if(String(imgId[0]).indexOf('fs://') == '-1'){
                                    scope.delImgId.push(imgId[0]);
                                }

                            }
                        });
                    };
                    $rootScope.confirmCancel = function () {
                        $rootScope.confirmShow = false;
                    }
                    return false;
                }
            }
        }
}])
    .directive('imgScan', ['$rootScope', '$timeout', 'fileReader', function ($rootScope, $timeout, fileReader) {
        return {
            restrict: 'E',
            templateUrl: 'common/img-scan.html',
            scope: {
                imgArr: '=',

            },
            link: function (scope, elem, attr) {
                console.info(scope.imgArr,'scope.imgArr');

                // scope.$watch('imgArr',function (n,o) {
                //     var images=  scope.imgArr.map(function(item){
                //         return item.content
                //     });
                //     console.info(images,'images222');
                //     console.info(n,'images222');
                //     OPENAPI.loadImages({
                //         images: images,
                //         activeIndex: 0,
                //         bgColor: "#000"
                //     });
                // });


                scope.showBig = function (img_arr, img_index) {

                    var images_to_show = img_arr.map(function(item){
                        return item.content
                    });
                    OPENAPI.loadImages({
                        images: images_to_show,
                        activeIndex: 0,
                        bgColor: "#000"
                    });
                    OPENAPI.scanPhoto({
                        images: images_to_show,
                        activeIndex: img_index,
                        bgColor: "#000"}, img_index)

                    scope.addCloseEventListener();
                };
                scope.addCloseEventListener = function (){
                    api.addEventListener({
                        name: 'angularKeyback'
                    }, function(ret, err){
                        scope.closePhoto();
                    });
                }

                scope.closePhoto = function (){
                    OPENAPI.closePhoto();
                    api.addEventListener({
                        name: 'angularKeyback'
                    }, function(ret, err){
                        $rootScope.go('back');
                    });
                }

            }
        }
    }])
    .directive('imgSel', ['$rootScope', '$timeout', 'fileReader', function ($rootScope, $timeout, fileReader) {
        return {
            restrict: 'E',
            templateUrl: 'common/img-sel.html',
            scope: {
                imgArr: '=',
                fileArr: '=',
                attachvo: '=',
                isApiCloud: '=',
                delImgId: '=',
                isEdit: '=',
                maxImgCount: '='
            },
            link: function (scope, elem, attr) {
                scope.fileArr = [];//路径
                scope.imgArr = []; //页面预览所用地址列表，base64
                scope.attachvo = [];
                scope.delImgId = [];  //编辑时删除的附件的Id

                var i = 0; //为ios上图片都为image时添加序号
                scope.fileSelect = function (files, event) { //当为apicloud时,files指的是图片选项"图片/拍照"
                    //预览上传图片开始
                    $rootScope.startLoading();

                    if (scope.isApiCloud) {
                        api.getPicture({
                            sourceType: files,
                            encodingType: 'jpg',
                            mediaValue: 'pic',
                            destinationType: 'base64',
                            quality: 20,
                            saveToPhotoAlbum: true
                        }, function (ret, err) {
                            $timeout(function () {
                                scope.selectImgItem = '';
                                if (ret && ret.data) {
                                    console.log(ret.data);
                                    scope.fileArr.push(ret.data);//图片路径
                                    scope.imgArr.push(ret.base64Data);
                                }
                                $rootScope.endLoading();
                            });
                        });
                        //}
                    } else {
                        //预览上传图片开始
                        if (files.length == 0) {
                            return;
                        }

                        $rootScope.startLoading();
                        var $this = angular.element(event.target);
                        var attachmentType = $this.attr('data');

                        angular.forEach(files, function (value, index) {
                            var fileIn = value;
                            var fileInName = fileIn.name;
                            var fileType = fileInName.substring(fileInName.lastIndexOf(".") + 1, fileInName.length);

                            //解决ios下所有图片都为image.jpg的bug
                            if (fileIn) {
                                fileInName = fileInName.split('.')[0] + i + '.' + fileType;
                                i++;
                            }
                            scope.attachvo.push({
                                name: fileInName,
                                type: fileType
                                //attachmentType: attachmentType
                            });
                            fileReader.readAsDataUrl(fileIn, scope)
                                .then(function (result) {
                                    result.name = fileInName;
                                    scope.fileArr.push(result);
                                    scope.imgArr.push(URL.createObjectURL(result));
                                });

                            scope.$on('fileProgress', function (event, data) {
                                if (data.total == data.loaded) {
                                    $timeout(function () {
                                        //上传图片结束
                                        $rootScope.endLoading();
                                    }, 200)
                                }
                            });
                        });
                    }
                    $rootScope.showAttachment = false; //Nrc弹出层会影响到其它添加附件
                }

                scope.showBig = function (src) {
                    $rootScope.showImage = true;
                    $rootScope.rootImgUrl = src;
                };

                var imgId = '';
                scope.delCurUpload = function (event) {
                    $rootScope.confirmInfo = "是否确定删除该图片";
                    $rootScope.confirmShow = true;
                    $rootScope.confirmOk = function () {
                        angular.forEach(scope.imgArr, function (item, key) {
                            if (event == item) {
                                scope.imgArr.splice(key, 1);
                                scope.attachvo.splice(key, 1);
                                imgId = scope.fileArr.splice(key, 1);
                                console.log('删除的照片' + JSON.stringify(imgId));
                                if(String(imgId[0]).indexOf('fs://') == '-1'){
                                    scope.delImgId.push(imgId[0].id);
                                }

                            }
                        });
                    };
                    $rootScope.confirmCancel = function () {
                        $rootScope.confirmShow = false;
                    }
                    return false;
                }
            }
        }
    }])

    /*
    * created by casey on 2020/5/8
    * function 新上传组件
    */

    .directive('newimgUpload', ['$rootScope', '$timeout', 'fileReader','UrlToBase64','b64ToBlob', function ($rootScope, $timeout, fileReader,UrlToBase64,b64ToBlob) {
        return {
            restrict: 'E',
            templateUrl: 'common/newimg-upload.html',
            scope: {
                imgArray: '=',
                fileArr: '=',
                attachvo: '=',
                isApiCloud: '=',
                delImgId: '=',
                isEdit: '=',
                nrcId: '=',
                maxImgCount: '=',
                upWay:'=',
                fileList:'=',
            },
            link: function (scope, elem, attr) {
                scope.android = $rootScope.android;
                scope.fileArr = [];//路径
                scope.imgArray = []; //页面预览所用地址列表，base64
                scope.attachvo = [];
                scope.delImgId = [];  //编辑时删除的附件的Id
                scope.fileId = [];
                var i = 0; //为ios上图片都为image时添加序号
                scope.fileSelect = function (files, event) { //当为apicloud时,files指的是图片选项"图片/拍照"
                    //预览上传图片开始
                    $rootScope.startLoading();
                    scope.fileArr = [];
                    if (scope.isApiCloud) {

                        //}
                    } else {
                        //预览上传图片开始
                        if (files.length == 0) {
                            $rootScope.endLoading();
                            return;
                        }

                        $rootScope.startLoading();
                        var $this = angular.element(event.target);
                        var attachmentType = $this.attr('data');
                        angular.forEach(files, function (value, index) {
                            var fileIn,fileInName,fileType;
                            fileIn = value;
                            if($rootScope.android) {
                                fileInName = fileIn.path;
                                fileType = 'image/' + fileIn.suffix;
                                fileIn.type = 'image/' + fileIn.suffix;
                                fileIn.name = 'phone' + fileInName;

                            }else{
                                fileInName = fileIn.name;
                                fileType = fileInName.substring(fileInName.lastIndexOf(".") + 1, fileInName.length);

                                //解决ios下所有图片都为image.jpg的bug
                                if (fileIn) {
                                    fileInName = fileInName.split('.')[0] + i + '.' + fileType;
                                    i++;
                                }
                            }

                            scope.attachvo.push({
                                name: fileInName,
                                type: fileType
                                //attachmentType: attachmentType
                            });
                            var data = {};
                            // if(scope.upWay == 'feedback'){
                            data = {fileCategory:scope.upWay,entityId:scope.nrcId,attachmentType:3};
                            // }
                            if($rootScope.android) {
                                fileIn.path = fileIn.path;
                                scope.fileArr.push(fileIn);

                                // console.log(scope.fileArr,'scope.fileArr')
                                // console.log(files,'files')
                                if(scope.fileArr.length == files.length) {

                                    for(var i in scope.fileArr){
                                        (function (i) {
                                            var tempArr = [];
                                            var image = new Image();
                                            image.src = scope.fileArr[i].path;
                                            image.onload = function () {
                                                var imgB64 = UrlToBase64(image);
                                                console.log(imgB64)
                                                var b64Data = (imgB64.dataURL).substring(imgB64.dataURL.indexOf(',') + 1)
                                                tempArr[0] =  b64ToBlob( b64Data , 'image/jpeg');
                                                tempArr[0].name = scope.fileArr[i].path.split('/')[scope.fileArr[i].path.split('/').length - 1];
                                                var tempName = tempArr[0].name.split('.')
                                                tempArr[0].name = tempName[0] + '.' + tempName[tempName.length - 1];
                                                console.log(tempArr,'tempArr')
                                                server.maocFormdataPost('form/submit', 'attach-001-b', data, tempArr).then(function (result) {
                                                    if(result.data.statusCode == '200'){
                                                        scope.fileList.push(result.data.data[0].data);
                                                        if(i == scope.fileArr.length - 1){
                                                            $rootScope.endLoading();
                                                        }
                                                        scope.imgArray.push(scope.fileArr[i].path);

                                                    }else{
                                                        $rootScope.endLoading();
                                                    }
                                                    // $rootScope.endLoading();
                                                }).catch(function (error) {
                                                    // alert('第' + Number(i)+1 + '张上传失败');
                                                    $rootScope.endLoading();
                                                });
                                            }

                                        })(i)

                                    }
                                }
                            }else{
                                fileReader.readAsDataUrl(fileIn, scope)
                                    .then(function (result) {
                                        result.name = fileInName;
                                        scope.fileArr.push(result);
                                        if(scope.fileArr.length == files.length) {

                                            for(var i in scope.fileArr){
                                                (function (i) {
                                                    var tempArr = [];
                                                    tempArr[0] = scope.fileArr[i];
                                                    server.maocFormdataPost('form/submit', 'attach-001-b', data, tempArr).then(function (result) {
                                                        if(result.data.statusCode == '200'){
                                                            scope.fileList.push(result.data.data[0].data);
                                                            scope.imgArray.push(URL.createObjectURL(scope.fileArr[i]));
                                                            if(i == scope.fileArr.length - 1){
                                                                $rootScope.endLoading();
                                                            }
                                                        }
                                                        $rootScope.endLoading();
                                                    }).catch(function (error) {
                                                        // alert('第' + Number(i)+1 + '张上传失败');
                                                        $rootScope.endLoading();
                                                    });
                                                })(i)

                                            }
                                        }


                                    });
                            }


                            scope.$on('fileProgress', function (event, data) {
                                if (data.total == data.loaded) {
                                    $timeout(function () {
                                        //上传图片结束
                                        $rootScope.endLoading();
                                    }, 200)
                                }
                            });
                        });
                    }
                    $rootScope.showAttachment = false; //Nrc弹出层会影响到其它添加附件
                };

                scope.showBig = function (src) {
                    $rootScope.showImage = true;
                    $rootScope.rootImgUrl = src;
                };

                var imgId = '';
                scope.delCurUpload = function (event) {
                    $rootScope.confirmInfo = "是否确定删除该图片";
                    $rootScope.confirmShow = true;
                    $rootScope.confirmOk = function () {
                        $rootScope.startLoading();
                        angular.forEach(scope.imgArray, function (item, key) {
                            console.info(event,'event')
                            console.info(item,'item')
                            if (event == item) {
                                console.info('jinru')
                                var delArr = [];
                                var delId = '';
                                scope.attachvo.splice(key, 1);
                                delArr = scope.fileList.splice(key,1);
                                delId = delArr[0].id;
                                // var fileCategory = '';
                                // if(scope.upWay == 'feedback'){
                                //     fileCategory = 'feedback';
                                // }
                                // var

                                server.maocPostReq('assembly/deleteByFileId', {fileId:delId,category:scope.upWay}).then(function (result) {
                                    if(result.data.statusCode == '200'){
                                        alert('删除成功');
                                        scope.imgArray.splice(key, 1);
                                        imgId = scope.fileArr.splice(key, 1);
                                    }
                                    $rootScope.endLoading();
                                }).catch(function (error) {
                                    alert('删除失败');
                                    $rootScope.endLoading();
                                });

                                console.log('删除的照片' + JSON.stringify(imgId));
                                // if(String(imgId[0]).indexOf('fs://') == '-1'){
                                //     scope.delImgId.push(imgId[0].id);
                                // }

                            }
                        });
                    };
                    $rootScope.confirmCancel = function () {
                        $rootScope.confirmShow = false;
                    };
                    return false;
                }
            }
        }
    }])
    //结束

    .directive('imgUpload', ['$rootScope', '$timeout', 'fileReader', function ($rootScope, $timeout, fileReader) {
        return {
            restrict: 'E',
            templateUrl: 'common/img-upload.html',
            scope: {
                imgArray: '=',
                fileArr: '=',
                attachvo: '=',
                isApiCloud: '=',
                delImgId: '=',
                isEdit: '=',
                nrcId: '=',
                maxImgCount: '=',
                upWay:'=',
                fileId:'='
            },
            link: function (scope, elem, attr) {
                scope.fileArr = [];//路径
                scope.imgArray = []; //页面预览所用地址列表，base64
                scope.attachvo = [];
                scope.delImgId = [];  //编辑时删除的附件的Id
                scope.fileId = [];
                var i = 0; //为ios上图片都为image时添加序号
                scope.fileSelect = function (files, event) { //当为apicloud时,files指的是图片选项"图片/拍照"
                    if(scope.upWay == 'nrcTask' && scope.nrcId == ''){
                        alert('请先保存，再上传图片');
                        return;
                    }
                    //预览上传图片开始
                    $rootScope.startLoading();
                    scope.fileArr = [];
                    if (scope.isApiCloud) {
                        api.getPicture({
                            sourceType: files,
                            encodingType: 'jpg',
                            mediaValue: 'pic',
                            destinationType: 'base64',
                            quality: 20,
                            saveToPhotoAlbum: true
                        }, function (ret, err) {
                            $timeout(function () {
                                scope.selectImgItem = '';
                                if (ret && ret.data) {
                                    console.log(ret.data);
                                    scope.fileArr.push(ret.data);//图片路径
                                    scope.imgArray.push(ret.base64Data);
                                }
                                $rootScope.endLoading();
                            });
                        });
                        //}
                    } else {
                        //预览上传图片开始
                        if (files.length == 0) {
                            $rootScope.endLoading();
                            return;
                        }
                        if(files.length > 1){
                            alert('一次只能上传一张图片');
                            $rootScope.endLoading();
                            return;
                        }
                        $rootScope.startLoading();
                        var $this = angular.element(event.target);
                        var attachmentType = $this.attr('data');
                        angular.forEach(files, function (value, index) {
                            var fileIn = value;
                            var fileInName = fileIn.name;
                            var fileType = fileInName.substring(fileInName.lastIndexOf(".") + 1, fileInName.length);
                            // console.log(files,'files');
                            // console.log(value,'value');
                            //解决ios下所有图片都为image.jpg的bug
                            if (fileIn) {
                                fileInName = fileInName.split('.')[0] + i + '.' + fileType;
                                i++;
                            }
                            scope.attachvo.push({
                                name: fileInName,
                                type: fileType
                                //attachmentType: attachmentType
                            });
                            var fileCategory = '';
                            var data = {};
                            if(scope.upWay == 'nrcTask'){
                                fileCategory = 'nrcTaskNuedWorkSheet';
                                 data = {fileCategory:fileCategory,entityId:scope.nrcId,attachmentType:3};
                            }
                            if(scope.upWay == 'nrc'){
                                fileCategory = 'nrcNnuedWorkSheet';
                                 data = {fileCategory:fileCategory,entityId:scope.nrcId,attachmentType:3};
                            }
                            if(scope.upWay == 'defectSummary'){
                                fileCategory = 'defectSummary';
                                 data = {fileCategory:fileCategory};
                            }
                            if(scope.upWay == 'ccupWay'){
                                fileCategory = 'TLB_COMP_CC';
                                 data = {fileCategory:fileCategory,entityId:scope.nrcId,attachmentType:3};
                            }
                            if(scope.upWay == 'cancelStock'){
                                fileCategory = 'cancelStock';
                                data = {fileCategory:fileCategory,entityId:scope.nrcId,attachmentType:3};
                            }
                            fileReader.readAsDataUrl(fileIn, scope)
                                .then(function (result) {
                                    result.name = fileInName;
                                    scope.fileArr.push(result);
                                    scope.imgArray.push(URL.createObjectURL(result));
                                    server.maocFormdataPost('form/submit', 'attach-001-a', data, scope.fileArr).then(function (result) {
                                       if(result.data.statusCode == '200'){
                                           alert('上传成功');
                                           // console.log(result.data.data[0]);
                                           scope.fileId.push(result.data.data[0].data.fileId || result.data.data[0].data.id);
                                           // scope.fileId.push(result.data.data[0].data.id);
                                       }
                                        $rootScope.endLoading();
                                    }).catch(function (error) {
                                        alert('上传失败');
                                        $rootScope.endLoading();
                                    });
                                });

                            scope.$on('fileProgress', function (event, data) {
                                if (data.total == data.loaded) {
                                    $timeout(function () {
                                        //上传图片结束
                                        $rootScope.endLoading();
                                    }, 200)
                                }
                            });
                        });
                    }
                    $rootScope.showAttachment = false; //Nrc弹出层会影响到其它添加附件
                };

                scope.showBig = function (src) {
                    $rootScope.showImage = true;
                    $rootScope.rootImgUrl = src;
                };

                var imgId = '';
                scope.delCurUpload = function (event) {
                    $rootScope.confirmInfo = "是否确定删除该图片";
                    $rootScope.confirmShow = true;
                    $rootScope.confirmOk = function () {
                        $rootScope.startLoading();
                        angular.forEach(scope.imgArray, function (item, key) {
                            // console.info(event,'event')
                            // console.info(item,'item')
                            if (event == item) {
                                // console.info('jinru')

                                var delArr = [];
                                var delId = '';
                                scope.attachvo.splice(key, 1);
                                delArr = scope.fileId.splice(key,1);
                                delId = delArr[0];
                                var fileCategory = '';
                                if(scope.upWay == 'nrcTask'){
                                    fileCategory = 'nrcTaskNuedWorkSheet';
                                }
                                if(scope.upWay == 'nrc'){
                                    fileCategory = 'nrcNnuedWorkSheet';
                                }
                                if(scope.upWay == 'defectSummary'){
                                    fileCategory = 'defectSummary';
                                }
                                if(scope.upWay == 'ccupWay'){
                                    fileCategory = 'TLB_COMP_CC';
                                }
                                if(scope.upWay == 'cancelStock'){
                                    fileCategory = 'cancelStock';
                                }
                                server.maocPostReq('assembly/deleteByFileId', {fileId:delId,category:fileCategory}).then(function (result) {
                                    if(result.data.statusCode == '200'){
                                        alert('删除成功');
                                        scope.imgArray.splice(key, 1);
                                        imgId = scope.fileArr.splice(key, 1);
                                    }
                                    $rootScope.endLoading();
                                }).catch(function (error) {
                                    alert('删除失败');
                                    $rootScope.endLoading();
                                });

                                console.log('删除的照片' + JSON.stringify(imgId));
                                // if(String(imgId[0]).indexOf('fs://') == '-1'){
                                //     scope.delImgId.push(imgId[0].id);
                                // }

                            }
                        });
                    };
                    $rootScope.confirmCancel = function () {
                        $rootScope.confirmShow = false;
                    };
                    return false;
                }
            }
        }
    }])
    .directive('moacRef', ['$rootScope', function ($rootScope) {
    return {
        link: function (scope, ele, attr) {
            scope.$on(attr.moacRef, function (event, args) {
                switch (args.triggerType.toLowerCase()) {
                    default:
                        ele[0].focus();
                        break;
                    case 'click':
                        ele[0].click();
                        break;
                }
            })
        }
    }
}])
    .directive('moacAutoFocus', function () {
        return {
            link: function (scope, ele, attr) {
                ele.on('click', function () {
                    console.log(attr)
                    scope.$broadcast(attr.moacAutoFocus, {triggerType: 'focus'});
                });
                scope.$on('$destory', function (event) {
                    $ele.off('click');
                });
            }
        }
    })
    .directive('moacAutoClick', function () {
        return {
            link: function (scope, ele, attr) {
                ele.on('click', function () {
                    scope.$broadcast(attr.moacAutoClick, {triggerType: 'click'});
                });
                scope.$on('$destory', function (event) {
                    $ele.off('click');
                });
            }
        }
    })
    .directive("ngTouchstart", function () {
        return {
            controller: ["$scope", "$element", function ($scope, $element) {
                $element.bind("touchstart", onTouchStart);

                function onTouchStart(event) {
                    var method = $element.attr("ng-touchstart");
                    $scope.$apply(method);
                }
            }]
        }
    })
    .directive("ngTouchmove", function () {
        return {
            controller: ["$scope", "$element", function ($scope, $element) {
                $element.bind("touchstart", onTouchStart);

                function onTouchStart(event) {
                    event.preventDefault();
                    $element.bind("touchmove", onTouchMove);
                    $element.bind("touchend", onTouchEnd);
                }

                function onTouchMove(event) {
                    var method = $element.attr("ng-touchmove");
                    $scope.$apply(method);
                }

                function onTouchEnd(event) {
                    event.preventDefault();
                    $element.unbind("touchmove", onTouchMove);
                    $element.unbind("touchend", onTouchEnd);
                }

            }]
        }
    })
    .directive("ngTouchend", function () {
        return {
            controller: ["$scope", "$element", function ($scope, $element) {
                $element.bind("touchend", onTouchEnd);

                function onTouchEnd(event) {
                    var method = $element.attr("ng-touchend");
                    $scope.$apply(method);
                }

            }]
        }
    });
