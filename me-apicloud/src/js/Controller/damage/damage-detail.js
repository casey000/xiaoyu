//require('../../lib/pdf.js');
// $localForage只能存储最低级别的对象和数组，下面只能是简单的数据类型，不可以嵌套对象和数组
//进入界面后先请求数据，并整理出sourceFieldType为3的对象数组和id数组，接下来使用acNumber判断该ACNumber是否存有数组，数组中装着有缓存到本地的
// sourceFieldId,遍历数组，修改sourceFieldType为3的对象数组中的download属性，有则为true
//该页面中点击下载单个资源，则对应将sourceFieldId存到acNumber对应的本地数组中去，没有数组则创建并保存

module.exports = angular.module('myApp').controller('damageDetailController',
    ['$rootScope', '$scope', 'server', 'configInfo', 'airport','$sce','$localForage','$stateParams',
        function($rootScope, $scope, server, configInfo, airport,$sce,$localForage,$stateParams) {

            $scope.acNumber = $stateParams.acNumber;
            $scope.from = $stateParams.from || ''; //从search页面进来会有参数from;
            $scope.id = $stateParams.id;
            // $scope.id = "9805b820794d44af9227289520ce1793";
            // $scope.id = "b46f598afa1d486db9dbb83e37073767";
            // $scope.id = "2efaf91463a34abdbc51e8006c087129";
            $scope.activeNav = 0;
            $rootScope.endLoading();
            //===========================
            $scope.info = {
                baseInfo: {},
                assessInfo:{},
                prefectInfo: {},
                qrCodeInfo: {},
                toolInfos: {
                    selectedDamageTypes:[],
                    damageTypes:[],
                    selectedDamageReasons:[],
                    damageReasons:[],
                    selectedDrTypes:[],
                    drTypes:[],
                    ndtCategorys: [],
                    dealTypes:[]
                },
                assessPitList:[]
            };

            function getBasicDetail() {
                $rootScope.startLoading();
                var url = 'asms/drAssessMobile/findDrAssessBase/' + $scope.id;
                server.maocGetReq(url).then(function (res) {
                    $rootScope.endLoading();
                    var statusCode = res.data.statusCode;
                    if (typeof (statusCode) != 'undefined' && statusCode == 200) {
                        var response = res.data.data[0];
                        if (response.succ == 'ok') {
                            var result = response.result;
                            $scope.info.baseInfo = response.result;
                            $scope.info.toolInfos.selectedDamageTypes = result.defectType.split(',');
                            $scope.info.toolInfos.selectedDamageReasons = result.defectReason.split(',');
                            $scope.info.toolInfos.selectedDrTypes = result.drType.split(',');
                        }
                        else {
                            alert(response.msg);
                        }
                    }
                });
            }
            getBasicDetail();


            function getAssessDetail() {
                $rootScope.startLoading();
                var url = 'asms/drAssessMobile/findDrAssess/' + $scope.id;
                server.maocGetReq(url).then(function (res) {
                    $rootScope.endLoading();
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];

                        if (response.succ == 'ok') {
                            $scope.info.assessInfo = response.result;
                        }
                        else {
                            alert(response.msg);
                        }
                    }
                });
            }

            function getPerfectDetail() {
                $rootScope.startLoading();
                var url = 'asms/drAssessMobile/findDrAssessPrefect/' + $scope.id;
                server.maocGetReq(url).then(function (res) {
                    $rootScope.endLoading();
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        if (response.succ == 'ok') {
                            $scope.info.prefectInfo = response.result;
                        }
                        else {
                            alert(response.msg);
                        }
                    }
                });
            }

            function getDrAssessPitList() {
                $rootScope.startLoading();
                var url = 'asms/drAssessMobile/queryDrAssessPitList/' + $scope.id;
                server.maocGetReq(url).then(function (res) {
                    $rootScope.endLoading();
                    console.log("结构修理清单->"+JSON.stringify(res.data));
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        if (response.succ == 'ok') {
                            $scope.info.assessPitList = response.result;
                        }
                        else {
                            alert(response.msg);
                        }
                    }
                });
            }


            function getQrCode() {
                $rootScope.startLoading();
                var url = 'asms/drAssessMobile/findDrAssessQrCode/' + $scope.id;
                server.maocGetReq(url).then(function (res) {
                    $rootScope.endLoading();
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        if (response.succ == 'ok') {
                            $scope.info.qrCodeInfo.content = response.msg.replace('img','image');
                        }
                        else {
                            alert(response.msg);
                        }
                    }
                });
            }
            getQrCode();

            function getDrTypes() {
                server.maocGetReq('asms/drBaseMobile/queryDictionaries/DamageSetting_DamageType').then(function (res) {
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        $scope.info.toolInfos.drTypes = response.result;
                    }
                });
            }
            if ($scope.info.toolInfos.drTypes.length ==0) {
                getDrTypes();
            }

            function getDealTypes() {
                server.maocGetReq('asms/drBaseMobile/queryDictionaries/DamageSetting_DealBasisType').then(function (res) {
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        $scope.info.toolInfos.dealTypes = response.result;
                    }
                });
            }
            if ($scope.info.toolInfos.dealTypes.length ==0) {
                getDealTypes();
            }

            function getDamageTypes() {
                server.maocGetReq('asms/drBaseMobile/queryDefectTypes').then(function(res){
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        var result = response.result;
                        $scope.info.toolInfos.damageTypes = result;
                        console.log('==queryDefectTypes' + JSON.stringify(result));
                    }
                });
            }
            if ($scope.info.toolInfos.damageTypes.length ==0) {
                getDamageTypes();
            }


            function getDamageReasons() {
                server.maocGetReq('asms/drBaseMobile/queryDefectReasons').then(function (res) {
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        var result = response.result;
                        $scope.info.toolInfos.damageReasons = result;
                    }
                });
            }
            if ($scope.info.toolInfos.damageReasons.length == 0) {
                getDamageReasons();
            }



            $scope.goDefect = function(defectNo){
                server.maocGetReq('defect/viewDefectDetailInfoByDefectNo',{defectNo:defectNo}).then(function (res) {
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        $rootScope.go('searchFault.faultClose','',{defectId: res.data.data[0].defectDetail.id, pt: true, fromSearch: false,from:'defect'})
                    }
                });


            };

            $scope.changeNavIndex = function(index) {
                $scope.activeNav = index;
                switch (index) {
                    case 0: {
                        getBasicDetail();
                    }
                        break;
                    case 1: {
                        getAssessDetail();
                    }
                        break;
                    case 2: {
                        getPerfectDetail();
                        getDrAssessPitList();
                    }
                        break;
                    default: {
                        getBasicDetail();
                    }
                        break;
                }
            };

            //===========================
            //获取损伤详情接口
            $scope.searchDamage = function(param) {
                $rootScope.startLoading();
                var requestUrl = 'asms/getAsmsDamgeRepairList?';
                $scope.fileSourceFor3 = [];
                $scope.fileSourceIdsFor3 = [];
                $scope.fileSourceFor2 = [];

                server.maocGetReq(requestUrl, param).then(function(data) {
                    $rootScope.endLoading();

                    if(200 === data.status) {
                        var data = data.data.data[0];
                        $rootScope.damageDetailDealDataWithData(data);
                        console.log($scope.data);
                    }
                }).catch(function(error) {
                    $rootScope.endLoading();
                });
            };
            //设置标签栏默认选中第几个标签参数
            $scope.activeNav = 0;
            //调用获取损伤详情函数
            // $scope.searchDamage({acNumber:$scope.acNumber});
            //attachment分页，下载按钮交互控制参数
            $scope.showUnitDownoad = false;
            $scope.downloadButtonName = 'Download';
            //切换下载按钮状态
            $scope.switchDownloadState = function () {
                $scope.showUnitDownoad = !$scope.showUnitDownoad;
                if($scope.showUnitDownoad === true) {
                    $scope.downloadButtonName = '取消';
                }
                else {
                    $scope.downloadButtonName = 'Download';
                }
            };

            $rootScope.damageDetailDealData = function () {
                $rootScope.damageDetailDealDataWithData($scope.data);
            };

            $rootScope.damageDetailDealDataWithData = function (data) {
                $scope.data = data;
                angular.forEach($scope.data.referenceFiles, function(v,i){

                    if (v.fileSource == '2') {
                        $scope.fileSourceFor2.push(v);
                    }

                    if (v.fileSource == '3') {
                        // $scope.checkWeatherStrored(v.sourceFileId);
                        $scope.fileSourceFor3.push(v);
                        $scope.fileSourceIdsFor3.push(v.id);
                    }
                });

                //统计sourceField为2的数组中的所有不同的sourceFileNum
                var keyFor2 = '';
                $scope.allKeysFor2 = [];
                for(var i = 0; i < $scope.fileSourceFor2.length; i++) {
                    var sourceFileNum = $scope.fileSourceFor2[i].sourceFileNum;
                    if (i === 0) {
                        $scope.allKeysFor2.push(sourceFileNum);
                        keyFor2 = sourceFileNum;
                    }
                    else {
                        if (sourceFileNum !== keyFor2) {
                            $scope.allKeysFor2.push(sourceFileNum);
                            keyFor2 = sourceFileNum;
                        }
                    }
                }

                $scope.data.repDate = $scope.data.repDate.substring(0,10);
                //暂时注销掉本地缓存，因缓存是无法成功
                $scope.getDownloadState($scope.acNumber);
            }

            //判断该ACNumber下是否存储了data中fileSource为3的数据；
            $scope.getDownloadState = function (acNumber) {
                $localForage.getItem(acNumber).then(function (value) {
                    // 有则遍历本地与网络数据，将数据源中的downloded属性修改为本地数据中的该属性值
                    // alert('damage-detail:getDownloadState成功');
                    if(value){
                        $scope.localAc = value;
                        angular.forEach($scope.fileSourceIdsFor3 , function(netId,i){
                            //sourceFileId
                            angular.forEach($scope.localAc, function(localId,j){
                                if (netId === localId){
                                    $scope.fileSourceFor3[i].downloded = true;
                                }
                            })
                        })
                        console.log($scope.fileSourceFor3);
                    }

                }).catch(function (err) {
                    // 不存在则将整理好的filesource为3的数据，使用acNum写到本地
                    alert('damage-detail:getDownloadState失败');
                });
            }

            //    下载attachment附件
            $scope.detailDownLoadDamageRefercence = function (id, event) {
                event.stopPropagation();
                $scope.downLoadDamageRefercence(id,$scope.data.acNumber);
            }

            //下载附件
            $scope.downLoadDamageRefercence = function(id,acNumber) {
                $scope.id = id;
                $scope.acNumber = acNumber;

                var requestUrl = 'asms/getAsmsAttachmentFile/'+id;
                $rootScope.startLoading();
                server.maocGetReq(requestUrl).then(function(data) {
                    $rootScope.endLoading();
                    console.log(data);
                    if(200 === data.status) {
                        $scope.refData = data.data.data[0];
                        $scope.storeRefData($scope.refData);
                        // alert('下载完成，可离线查看');
                    }
                }).catch(function(error) {
                    $rootScope.endLoading();
                });
            };


            //本地缓存单个sourceFileId的下载资源
            $scope.storeRefData = function (json) {
                $localForage.setItem(json.id, json).then(function (value) {
                    // 单个条目存储成功后，修改本地acNumber对应的本地数组
                    //将新下载的条目的sourceFieldId加入其中，并将数组重新保存到本地
                    console.log('444');
                    $scope.storeLocalFileIdToLocalAcArray($scope.acNumber,$scope.id);

                }).catch(function (err) {
                    // we got an error
                    console.log('存入时出错啦');
                });
            }

            //判断该ACNumber下是否存储了data中fileSource为3的数据；
            $scope.storeLocalFileIdToLocalAcArray = function (acNumber,id) {
                $localForage.getItem(acNumber).then(function (value) {
                    // 有则遍历本地与网络数据，将数据源中的downloded属性修改为本地数据中的该属性值
                    // alert('damage-detail:storeLocalFileIdToLocalAcArray成功');
                    if(value){
                        value.push(id);
                        $scope.storeArrayFor3(value);
                    }
                    else {
                        // 不存在则将整理好的filesource为3的数据，使用acNum写到本地
                        // alert('damage-detail:storeLocalFileIdToLocalAcArray失败');
                        var acLocalArr = [id];
                        $scope.storeArrayFor3(acLocalArr);
                    }

                }).catch(function (err) {
                    // 不存在则将整理好的filesource为3的数据，使用acNum写到本地
                    // alert('damage-detail:storeLocalFileIdToLocalAcArray失败');
                    var acLocalArr = [id];
                    $scope.storeArrayFor3(acLocalArr);
                });
            }

            //存储和更新3类型文件数组
            $scope.storeArrayFor3 = function (fileSourceFor3) {

                $localForage.setItem($scope.acNumber, fileSourceFor3).then(function (value) {
                    // 存储成功回调
                    // alert('damage-detail:storeArrayFor3成功');
                    $scope.getDownloadState($scope.acNumber);
                }).catch(function (err) {
                    // we got an error
                    console.log(err);
                    // alert('damage-detail:storeArrayFor3失败');
                });

                $localForage.setItem($scope.acNumber, fileSourceFor3).then(function (value) {
                    // 存储成功回调
                    // alert('damage-detail:storeArrayFor3成功');
                    $scope.getDownloadState($scope.acNumber);
                }).catch(function (err) {
                    // we got an error
                    console.log(err);
                    // alert('damage-detail:storeArrayFor3失败');
                });
            }

            $scope.goToReadFile = function(item) {
                var type = item.type;
                if (type == 'jpg' || type=='jpeg' || type=='png') {
                    $rootScope.go('searchDamageByHand.damageDetail.damageReference', 'slideLeft',{info:item});
                }
                else {
                    $scope.openNewPageWithData(item);
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

            $scope.damageDetailGoBack = function (){
                if ($scope.from == 'searchDamageByHand') {
                    $rootScope.go('back');
                }
                else {
                    NativeAppAPI.damageDetailGoBack();
                }
            };

            function getNdtCategorys() {
                server.maocGetReq('asms/drBaseMobile/queryDictionaries/DamageSetting_CheckMode').then(function (res) {
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        $scope.info.toolInfos.ndtCategorys = response.result;
                    }
                });
            }

            if ($scope.info.toolInfos.ndtCategorys.length == 0) {
                getNdtCategorys();
            }

        }

    ]);