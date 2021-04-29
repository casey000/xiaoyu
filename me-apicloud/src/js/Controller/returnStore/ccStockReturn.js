module.exports = angular.module('myApp').controller('ccStockReturn',
    ['$rootScope', '$scope', '$filter', '$stateParams', '$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter, $stateParams, $interval, $localForage, configInfo, b64ToBlob, $timeout) {
            console.log($stateParams,'stateparams');
            $rootScope.endLoading();

            $scope.hideApproverTitle = true;//隐藏选人默认状态
            $scope.typeData = [
                {
                    TEXT:'领出未用退料',
                    VALUE:'2'
                },
                {
                    TEXT:'拆下无序号退料',
                    VALUE:'3'
                },
                {
                    TEXT:'装机未用退料',
                    VALUE:'4'
                },

            ];
            $scope.isApiCloud = false; //上传附件时是否要用apiCloud方法
            $scope.fileArr = [];  //要上传的二进制流

            $scope.staInfo = {station:''};
            $scope.onPn = {
                partno:'',
                noBorder:true,
                description:'',
            };
            $scope.mech = {
                nameAndId: '',
                approverSn: '',
                approverName:'',
            };
            $scope.mrList = [];

            $scope.toStation = '目的航站';
            $scope.upWay = 'cancelStock';
            $scope.initPage = function(){
                if($stateParams.returnId){
                    //edit Page
                    $scope.isEdit = true;
                    var params = {id:$stateParams.returnId};
                    server.maocGetReq('cancelStock/selectById',params).then(function(data){
                        if (data.status == 200) {
                            $scope.insertJson = data.data.data[0];
                            $scope.insertJson.sendBackTime = new Date($filter('date')($scope.insertJson.sendBackTime, 'yyyy/MM/dd HH:mm'));
                            $scope.staInfo.station = $scope.insertJson.toStation
                            if($scope.insertJson.toStation == $scope.insertJson.fromStation){
                                $scope.insertJson.transport = '2'
                            }
                            $scope.onPn.partno = $scope.insertJson.pn;
                            $scope.mech.approverSn = $scope.insertJson.sendBackNumber;
                            $scope.mech.approverName = $scope.insertJson.sendBackName;
                            $scope.mech.nameAndId = $scope.insertJson.sendBackName + '(' + $scope.insertJson.sendBackNumber + ')';
                            !$scope.insertJson.transport && ($scope.insertJson.transport ='1')
                            getccInfo($scope.insertJson.ccNo)

                        }
                    }).catch(function(error){
                        console.log(error);
                    });

                    //附件
                    server.maocGetReq('assembly/selectFileByCategoryAndSourceId',{sourceId:$stateParams.returnId,category:'cancelStock'}).then(function(data){
                        if (data.data.statusCode == 200) {
                            $scope.attachmentList = data.data.data;
                            angular.forEach(data.data.data, function (item, index) {
                                if (item.type == 'mp3') {
                                    $scope.uploadSoundArr.push({
                                        soundData: item.content,
                                        type: '.mp3',
                                        length: (item.size / 1000).toFixed(1)
                                    });
                                } else if(item.type.indexOf('image') != '-1'){
                                    if(typeof (item.content) != 'undefined') {
                                        var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                        var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                        var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                        imgBlob.name = item.name.indexOf('down') == -1
                                            ? imgName + 'down' + imgType
                                            : item.name;
                                        imgBlob.id = item.id;
                                        $scope.fileArr.push(imgBlob);
                                        $scope.fileId.push(item.id);
                                        $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                    }
                                }
                            })
                        }
                    }).catch(function(error){
                        $rootScope.endLoading();
                        console.log(error);
                    });

                }


            };
            $scope.initPage();
            $scope.$watch('staInfo.station',function (n,o) {
                // $scope.insertJson.fromStation
                if(n && n.toUpperCase() == $scope.insertJson.fromStation.toUpperCase()){
                    $scope.insertJson.transport = 2;
                }
            });
            function getccInfo(param){
                server.maocGetReq('cc/selectByCcNo/' + param).then(function(data){
                    if (data.status == 200) {
                        $scope.ccJson = data.data.data[0];

                    }
                }).catch(function(error){
                    console.log(error);
                });
            }

            $scope.submitMethod = function () {
                if(!$scope.staInfo.station){
                    alert('请选择目的航站');
                    return
                }
                if(!$scope.insertJson.transport){
                    alert('请选择是否随机');
                    return
                }
                // if(!$scope.insertJson.noNeed){
                //     alert('请选择是否退料');
                //     return
                // }
                if($scope.insertJson.reason.trim() == ''){
                    alert('请填写拆下挂签里的拆下故障原因');
                    return
                }
                if(!$scope.insertJson.sendBackTime){
                    alert('请选择退料时间');
                    return
                }
                if(!$scope.imgArr || $scope.imgArr.length === 0 ){
                    alert('附件必填');
                    return
                }
                $rootScope.startLoading();
                var params = angular.copy($scope.insertJson);
                params.transport = $scope.insertJson.transport;
                params.toStation = $scope.staInfo.station.toUpperCase();
                params.sendBackName = $scope.mech.approverName;
                params.sendBackNumber = $scope.mech.approverSn;
                params.workorderId = $scope.ccJson.workorderId;
                params.sendBackTime = parseInt($scope.insertJson.sendBackTime.getTime());
                if($scope.isEdit){
                    server.maocFormdataPost('form/submit', 'cancelstock-001-a', params).then(function (data) {
                        if (200 === data.status) {
                            api.alert({
                                msg:'提交成功'
                            },function () {
                                $rootScope.go('back')
                            })

                        } else {
                            $rootScope.errTip = data.data;
                        }
                        $rootScope.endLoading();
                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                }

            };


        }
    ]);


