module.exports = angular.module('myApp').controller('damageDraftListController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$filter', 'b64ToBlob',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob) {
           $rootScope.endLoading();
            var that = this;
            $scope.draftList = [];
            var pageSize = 10;
            $scope.noMoreData = false;

           // 获取缺陷类型与数字对照字典
            $scope.damageTypeDicArr = [
                {
                    "name": "紧固件松动/丢失",
                    "value": "10"
                },
                {
                    "name": "漆层破损",
                    "value": "11"
                },
                {
                    "name": "腐蚀",
                    "value": "1"
                },
                {
                    "name": "裂纹",
                    "value": "2"
                },
                {
                    "name": "孔洞/破损/断裂",
                    "value": "3"
                },
                {
                    "name": "凹坑/变形/褶皱",
                    "value": "4"
                },
                {
                    "name": "磨损/刮擦痕",
                    "value": "5"
                },
                {
                    "name": "故障/功能失效",
                    "value": "6"
                },
                {
                    "name": "分层/脱胶",
                    "value": "7"
                },
                {
                    "name": "风蚀",
                    "value": "8"
                },
                {
                    "name": "热损伤",
                    "value": "9"
                },
                {
                    "name": "其他 ",
                    "value": "12"
                }
            ];

            function getDamageDraftList(param) {
                $rootScope.startLoading();
                server.maocPostReq('asms/drBaseMobile/showDrBaseList',param,true).then(function (res) {
                    $rootScope.endLoading();
                    var statusCode = res.data.statusCode;
                    that.requesting = false;
                    if (statusCode == 200) {
                        var response = res.data.data[0].result;
                        that.total = response.countRow;
                        
                        angular.forEach(response.result, function (value, key) {
                            var item = value;
                            if (typeof (value.defectType) != 'undefined' && value.defectType != '') {
                                item.filterTypes = value.defectType.split(',');
                            }
                            console.log(item.filterTypes);
                            $scope.draftList.push(item);
                        });
                        $scope.noMoreData = $scope.draftList.length <= that.total ? false : true;

                    }
                });
            }

            $scope.getDraftList = function(){
                $scope.noMoreData = false;
                var user = configInfo.userCode;
                var param = {
                    user: user ,
                    startRow: 0,
                    endRow: 10
                };
                that.curParam = param;
                if(!that.requesting){
                    that.requesting = true;
                    getDamageDraftList(param);
                }
            };
            $scope.getDraftList();

            /*
             *获取下页的数据
             */
            $scope.getNextPage = function() {

                if(!$scope.noMoreData && !that.requesting) {
                    that.curParam.startRow = that.curParam.startRow + pageSize;
                    that.curParam.endRow = that.curParam.endRow + pageSize;
                    if(that.total > $scope.draftList.length){
                        that.requesting = true;
                        getDamageDraftList(that.curParam);
                    }else{
                        $scope.noMoreData = true;
                    }
                }
            };

            $scope.deleteDraft = function (item,index,$event) {
                $event.stopPropagation();
                $rootScope.startLoading();
                server.maocGetReq('asms/drBaseMobile/deleteDrBase',{id:item.id,user: configInfo.userCode}).then(function (res) {
                    $rootScope.endLoading();
                    var statusCode = res.data.statusCode;
                    if (statusCode == 200) {
                        var response = res.data.data[0];
                        if (response.succ == 'ok') {
                            $scope.draftList.splice(index,1);
                        }
                    }
                });
            };



        }
    ]);