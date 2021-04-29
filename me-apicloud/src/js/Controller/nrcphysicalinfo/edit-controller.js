module.exports = angular.module('myApp').controller('nrcPhysicalInfoController',
    ['$rootScope', '$scope', '$filter','server', '$stateParams', '$interval', '$localForage', 'configInfo', 'b64ToBlob', '$timeout',
        function ($rootScope, $scope, $filter,server, $stateParams, $interval, $localForage, configInfo, b64ToBlob, $timeout) {
            console.log('NRC修理补片传入参数--》'+JSON.stringify($stateParams));
            $rootScope.loading = false;
            $scope.isEdit = false;
            $scope.operate = $stateParams.operate;
            $scope.imgArr = [];  //页面预览所用文件
            $scope.fileArr = []; //页面保存文件
            $scope.isApiCloud = false;
            if($stateParams.operate === 'add') {
                $scope.isEdit = true;
            }
            $scope.physicalInfo = {
                    id:'',
                    nrcId:$stateParams.nrcId,
                    length: '',
                    wide: '',
                    thickness: '',
                    area: '',
                    material: '',
                    weight: '',
                    torqueChange: '',
                    inorout: '',
                    remark: ''
            };
            initNrcPhysical();

            //初始化信息
            function initNrcPhysical() {
                console.log("修理补片详情传入参数--》" + JSON.stringify($stateParams.phy));
                if ( !$stateParams.phy || angular.equals($stateParams.phy, {}) || $stateParams.operate === 'add') {
                    return;
                }
                $scope.physicalInfo = {
                    id:$stateParams.phy.id,
                    nrcId: $stateParams.nrcId,
                    length: $stateParams.phy.length,
                    wide: $stateParams.phy.wide,
                    thickness: $stateParams.phy.thickness,
                    area: $stateParams.phy.area,
                    material: $stateParams.phy.material,
                    weight: $stateParams.phy.weight,
                    torqueChange: $stateParams.phy.torqueChange,
                    inorout: $stateParams.phy.inorout,
                    remark: $stateParams.phy.remark
                };

                //图片附件
                //获取已上传附件的列表
                server.maocGetReq('nrcPhysicalInfo/queryPhysicalAttachList/'+$stateParams.phy.id).then(function (data) {
                    if (200 === data.status) {
                        $scope.imgArr = [];  //页面预览所用文件
                        $scope.fileArr = []; //页面保存文件
                        // console.log(JSON.stringify(data));
                        angular.forEach(data.data.data, function (item, index) {
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
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            }

           //编辑修理补片
            $scope.edit_nrcPhysicalInfo = function () {
                var param = angular.copy($scope.physicalInfo);
                console.log(JSON.stringify(param));
                console.log("编辑修理上传-》"+JSON.stringify($scope.fileArr));
                $rootScope.startLoading();
                server.maocFormdataPost('form/submit', 'nrcphysicalinfo-001-a', param, $scope.fileArr).then(function (data) {
                    if (200 === data.status) {
                        alert('保存修理补片成功!');
                        $rootScope.go('back');
                    }
                    $rootScope.endLoading();
                }).catch(function (error) {
                    alert('保存修理补片失败!');
                    $rootScope.endLoading();
                });
            };

            //删除修理补片
            $scope.del_NrcPhysicalInfo = function () {
                event.preventDefault();
                event.stopPropagation();
                $rootScope.confirmInfo = "确定要删除此条修理补片吗";
                $rootScope.confirmShow = true;

                $rootScope.confirmOk = function () {
                    server.maocGetReq('nrcPhysicalInfo/deleteNrcPhysicalInfo/'+$stateParams.phy.id).then(function (result) {
                        if (result.data.statusInfo === 'OK') {
                            alert('删除成功!');
                        }
                        $rootScope.go('back');
                    }).catch(function (error) {
                        alert('删除失败!')
                    });
                };
            }

            $scope.switchNrcPhysicalEdit = function () {
               if( $scope.operate === 'update'){
                   $scope.operate = 'view';
                   $scope.isEdit = false;
                }else{
                   $scope.operate = 'update';
                   $scope.isEdit = true;
               }
                initNrcPhysical();
            };

        }
    ]);