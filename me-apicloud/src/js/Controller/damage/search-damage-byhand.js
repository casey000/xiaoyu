module.exports = angular.module('myApp').controller('searchDamageByHandController',
    ['$rootScope', '$scope', 'server', '$localForage', 'configInfo', '$filter',
        function($rootScope, $scope, server, $localForage, configInfo, $filter)  {

            var that = this;
            $rootScope.endLoading();
            $scope.balanceInfo = [];
            var pageSize = 20;
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
            $scope.searchTxt = '';

            $scope.searchDamage = function (param) {
                server.maocPostReq('asms/drAssessMobile/showDrAssessList',param,true).then(function (res) {
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
                            $scope.balanceInfo.push(item);
                        });
                        $scope.noMoreData = $scope.balanceInfo.length <= that.total ? false : true;
                    }
                });
            };

            $scope.clickBtnSearch = function(damageNum){
                $scope.noMoreData = false;
                $scope.balanceInfo = [];
                var param = {
                    assessQuery: damageNum ,
                    startRow: 0,
                    endRow: 10
                };
                that.curParam = param;
                if(!that.requesting){
                    that.requesting = true;
                    $scope.searchDamage(that.curParam);
                }
            };

            /*
             *获取下页的数据
             */
            $scope.getNextPage = function() {

                if(!$scope.noMoreData && !that.requesting) {
                    that.curParam.startRow = that.curParam.startRow + pageSize;
                    that.curParam.endRow = that.curParam.endRow + pageSize;
                    if(that.total > $scope.balanceInfo.length){
                        that.requesting = true;
                        $scope.searchDamage(that.curParam);
                    }else{
                        $scope.noMoreData = true;
                    }
                }
            };

            //输入搜索条件后回车返回搜索结果
            $scope.enter = function(ev,searchTxt){

                var keyCode = window.event?ev.keyCode:ev.which;
                if(keyCode == 13){
                    ev.preventDefault();
                    $scope.clickBtnSearch(searchTxt);
                }

            };

            $scope.goBackHome = function () {
                // $rootScope.goTopRootViewController();
                NativeAppAPI.searchByHandGoBack();
            };

            var time = window.setInterval(function () {
                if (typeof api !== 'undefined') {
                    api.addEventListener({
                        name: 'keyback'
                    }, function(ret, err){
                        console.log('xxx');
                        api.closeWin({
                            name: 'searchByHand'
                        });
                    });
                    window.clearInterval(time);
                }
            },20);
        }
    ]);