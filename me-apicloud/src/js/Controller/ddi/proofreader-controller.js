
module.exports = angular.module('myApp').controller('ddiProofreaderController',
    ['$rootScope', '$scope' ,'fileReader','$timeout','$stateParams', 'server', '$localForage', 'configInfo', '$filter',
        function($rootScope, $scope,fileReader,$timeout,$stateParams, server, $localForage, configInfo,$filter) {
            $rootScope.endLoading();
            $scope.proofData = {
                proofRemark:'',
                proofAuditor:'',
            };
            /**
             * 点击搜索按钮
             */
            $scope.selectAuditor =function () {
            };
            /**
             * 提交表单数据
             * @params {表单内容}
             */
            $scope.submit = function (proofData) {
                console.log(proofData);
                /*$rootScope.startLoading();
                server.maocFormdataPost('form/submit').then(function (data) {
                    if (200 === data.status) {
                        $scope.submitSuccess = true;
                        $rootScope.go('back');
                    } else {
                        $scope.errorInfo = data.data;
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                    $scope.submitSuccess = false;
                });*/
            };
            $scope.changeImageEvent = function (event) {
                console.log(event.target.files);
            };

            $scope.formData = {
                // taskVO: {}
            };
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

            //选择图片后执行的方法
            //选择图片后执行的方法
            $scope.fileArr = [];
            $scope.imgSrcArr = [];
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
                $rootScope.confirmOk = function() {
                    angular.forEach($scope.imgSrcArr, function(item, key) {
                        if(event == item) {
                            $scope.imgSrcArr.splice(key, 1);
                            attachvo.splice(key, 1);
                            $scope.fileArr.splice(key, 1);
                            checkHasAttachment()
                        }
                    });
                };
                $rootScope.confirmCancel = function () {
                    $rootScope.confirmShow = false;
                };
                return false;
            }
        }
]);


