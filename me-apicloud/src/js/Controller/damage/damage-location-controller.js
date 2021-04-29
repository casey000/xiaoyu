module.exports = angular.module('myApp').controller('damageLocationController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$filter', 'b64ToBlob',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob) {
            $rootScope.endLoading();

            $scope.showSizeTemplateState = false;
            var listItemInfo = $stateParams.listItemInfo;
            var damageInfo = $stateParams.damageInfo;
            var locationItem = $stateParams.locationItem;
            var aircrartInfo = $stateParams.aircraftInfo;
            var from = $stateParams.from || '';
            $scope.from = from;
            //取决于是否有id
            var isCreate = typeof (locationItem.id) == 'undefined' || locationItem.id.length == 0 ;
            $scope.isCreate = isCreate;
            //对于损伤草稿详情，新建与详情同为编辑状态
            //对于损伤详情而言，为只读不可修改状态
            $scope.isEdit = true;
            var isSubmit = false;//提交成功，获取详情后，需要返回上一页

            function init() {
                $scope.info = {
                    staMinSymbol:'+',
                    staMaxSymbol: '+',
                    strMinSymbol: '+1',
                    strMinOffsetSymbol: '+',
                    strMaxSymbol: '+1',
                    strMaxOffsetSymbol: '+',
                    blMinSymbol: '+1',
                    blMaxSymbol: '+1',
                    unit:2
                };
                if(typeof (damageInfo.damageInfo) != 'undefined') {
                    $scope.info.drId = damageInfo.damageInfo.id;
                }
                //损伤详情只能查看，不可编辑
                if (from == 'damageDetail') {
                    $scope.isEdit = false;
                }
            }
            init();


            $scope.imgArr = [];  //页面预览所用文件
            $scope.fileArr = [];  //要上传的二进制流
            $scope.attachvo = [];
            $scope.isApiCloud = false; //图片本地地址
            $scope.delImgId = [];
            $scope.maxImgCount = 6;

            /*
            * {
                    "id": "3a2050b43ae74586bd0fb7b47764b1a6",
                    "entityId": "94e1d092b5e54f3ca6d47e7ff7699818",
                    "module": "DR/Feedback",
                    "childModule": "",
                    "url": "/apps/attachment/DR/Feedback/94e1d092b5e54f3ca6d47e7ff7699818/3a2050b43ae74586bd0fb7b47764b1a6.pdf",
                    "name": "EE-AD32008-06-14.pdf",
                    "type": "pdf"
                }
            * */
            $scope.files = [];

            function getLocationSizeDetail(id) {
                if (typeof (id) != 'undefined' && id.length >0) {
                    $rootScope.startLoading();
                    // var path = 'asms/drBaseMobile/viewDrBaseDefect/' + id;
                    var path = '' ;
                    if (from == 'damageDetail') {
                        path = 'asms/drAssessMobile/findDrAssessDefect/' + id;
                    }
                    else {
                        path = 'asms/drBaseMobile/findDrBaseDefect/' + id ;
                    }
                    server.maocGetReq(path,{}).then(function (res) {
                        $rootScope.endLoading();
                        var statusCode = res.data.statusCode;
                        if (statusCode == 200) {
                            var response = res.data.data[0];
                            if (response.succ == 'ok') {
                                var result = response.result;
                                var attachmentDTOList = result.attachmentDTOList || [];
                                $scope.imgArr = [];  //页面预览所用文件
                                $scope.fileArr = [];  //要上传的二进制流
                                $scope.attachvo = [];
                                $scope.files = [];
                                angular.forEach(attachmentDTOList, function(item, index){
                                    var type = item.type;
                                    if (type == 'jpg' || type=='jpeg' || type=='png')  {
                                        var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                        var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                        var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                        imgBlob.name = item.name.indexOf('down') == -1
                                            ? imgName + 'down' + imgType
                                            : item.name;
                                        imgBlob.id = item.id;
                                        $scope.fileArr.push(imgBlob);
                                        $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                    }
                                    else {
                                        $scope.files.push(item);
                                    }
                                    // var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                    // var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                    // var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                    // imgBlob.name = item.name.indexOf('down') == -1
                                    //     ? imgName + 'down' + imgType
                                    //     : item.name;
                                    // imgBlob.id = item.id;
                                    // $scope.fileArr.push(imgBlob);
                                    // $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                });

                                $scope.info = result;
                                if (isCreate) {
                                    damageInfo.damageInfo.drBaseDefectViewDTOS.push($scope.info);
                                    damageInfo.toolInfos.drBaseDefectIds.push($scope.info.id);
                                    isCreate = false;
                                }
                                if (isSubmit) {
                                    $scope.goBack();
                                }
                            }
                        }
                    });
                }
            }
            if (!isCreate) {
                var id = locationItem.id;
                getLocationSizeDetail(id);
            }

            $scope.submit = function () {
                var param = angular.copy($scope.info);
                param.deleteAttachmentIds = angular.copy($scope.delImgId);
                delete param.attachmentDTOList;
                delete param.createTime;
                delete param.updateTime;
                param.user = configInfo.userCode;
                $rootScope.startLoading();
                isSubmit = true;

                //只上传没有id的图片
                var fileArr = [];
                angular.forEach($scope.fileArr,function (item) {
                    if (typeof (item.id) == 'undefined') {
                        fileArr.push(item);
                    }
                });

                server.maocFormdataPost('form/submit','asmsnew-001-a',param,fileArr).then(function (res) {
                    var statusCode = res.data.statusCode;
                    $rootScope.endLoading();
                    if (statusCode == 200) {
                        var response = res.data.data[0].data;
                        if (response.succ == 'ok') {
                            $scope.info.id = response.msg;
                            getLocationSizeDetail($scope.info.id);
                        }
                    }
                });
            };

            $scope.goBack = function() {
                if ($stateParams.from == 'damageDetail') {
                    $rootScope.go('back');
                }
                else {
                    $rootScope.go('damageDraftDetail','',{listItemInfo:listItemInfo ,needRequest:false, info:damageInfo});
                }
            };

            $scope.openNewPageWithData = function(param){
                var type = angular.lowercase(param.type);
                if (type == 'doc' || type == 'docx' || type == "txt"
                    || type == "tif"|| type == "xls"  || type == "xlsx") {
                    alert('暂不支持此格式预览');
                    return;
                }
                NativeAppAPI.openPdfWithUrl(param)
            };

            $scope.openRegistration = function() {
                var pid = damageInfo.toolInfos.flightNoInfo.pid;
                console.log(JSON.stringify(pid));
                if (typeof (pid) == 'undefined') {
                    alert('请返回前一页填写机型');
                }
                else {
                    var fileName = pid;
                    NativeAppAPI.openPdfWithFileName(fileName);
                }
            };

            $scope.showSizeTemplate = function () {
                if($scope.from!='damageDetail') {
                    $scope.showSizeTemplateState = !$scope.showSizeTemplateState;
                }
            };

            $scope.$watch('info.staMin',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.staMin = getOneSteps($scope.info.staMin);
                }
            });
            $scope.$watch('info.staMinOffset',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.staMinOffset = getOneSteps($scope.info.staMinOffset);
                }
            });
            $scope.$watch('info.staMax',function (n,o) {

                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.staMax = getOneSteps($scope.info.staMax);
                }
            });
            $scope.$watch('info.staMaxOffset',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.staMaxOffset = getOneSteps($scope.info.staMaxOffset);
                }
            });
            //位数限定
            $scope.$watch('info.strMin',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.strMin = getOneSteps($scope.info.strMin);
                }
            });
            $scope.$watch('info.strMinOffset',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.strMinOffset = getOneSteps($scope.info.strMinOffset);
                }
            });
            $scope.$watch('info.strMax',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.strMax = getOneSteps($scope.info.strMax);
                }
            });
            $scope.$watch('info.strMaxOffset',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.strMaxOffset = getOneSteps($scope.info.strMaxOffset);
                }
            });
            $scope.$watch('info.blMin',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.blMin = getOneSteps($scope.info.blMin);
                }
            });
            $scope.$watch('info.blMax',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.blMax = getOneSteps($scope.info.blMax);
                }
            });
            $scope.$watch('info.wlMin',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.wlMin = getOneSteps($scope.info.wlMin);
                }
            });
            $scope.$watch('info.wlMax',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 0) {
                    $scope.info.wlMax = getOneSteps($scope.info.wlMax);
                }
            });

            //====================================
            $scope.$watch('info.length',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 2) {
                    $scope.info.length = getThreeSteps($scope.info.length);
                }
            });
            $scope.$watch('info.width',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 2) {
                    $scope.info.width = getThreeSteps($scope.info.width);
                }
            });
            $scope.$watch('info.depth',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 2) {
                    $scope.info.depth = getThreeSteps($scope.info.depth);
                }
            });
            $scope.$watch('info.originalThickness',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 2) {
                    $scope.info.originalThickness = getThreeSteps($scope.info.originalThickness);
                }
            });
            $scope.$watch('info.remainingThickness',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 2) {
                    $scope.info.remainingThickness = getThreeSteps($scope.info.remainingThickness);
                }
            });
            $scope.$watch('info.other',function (n,o) {
                if (typeof (n) == 'undefined') { return; }
                var dot = n.toString().split(".")[1];
                if(typeof (dot) != 'undefined' && dot.length > 2) {
                    $scope.info.other = getThreeSteps($scope.info.other);
                }
            });

            function getOneSteps(number) {
                number = number/1;
                var result = Math.floor(number * 10) / 10;
                return result + '';
            }
            function getThreeSteps(number) {
                number = number/1;
                var result = Math.floor(number * 1000) / 1000;
                return result + '';
            }

        }
    ]);