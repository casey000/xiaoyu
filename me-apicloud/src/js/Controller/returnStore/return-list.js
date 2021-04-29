module.exports = (function() {
    angular.module('myApp').controller('returnListController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'b64ToBlob', 'server',
        function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, b64ToBlob, server)
        {
            var that = this,total = 0;
            var scope = $scope;
            //当为true时，表示没有更多的数据。
            $scope.isEdit = false;
            $scope.fileArr = [];
            // $scope.imgArr = ["blob:file:///a0a4d18e-4b07-4b37-8fc1-5bcac7da4a38"];
            $scope.imgArr = [];
            if($stateParams.workStation){
                $scope.workStation = $stateParams.workStation;
                $rootScope.workStationStore = $stateParams.workStation

            }else{
                $scope.workStation = $rootScope.workStationStore;
            }

            if($stateParams.rtFlightNo){
                $scope.rtFlightNo = $stateParams.rtFlightNo;
                $rootScope.rtFlightNo = $stateParams.rtFlightNo

            }else{
                $scope.rtFlightNo = $rootScope.rtFlightNo;
            }

            if($stateParams.rtFlightId){
                $scope.rtFlightId = $stateParams.rtFlightId;
                $rootScope.rtFlightId = $stateParams.rtFlightId

            }else{
                $scope.rtFlightId = $rootScope.rtFlightId;
            }
            $scope.returnOrderId = $stateParams.returnOrderId;

            //返回
            $scope.goBack = function(){
                $rootScope.go('back');
            };
            $scope.showBig = function (src) {
                $rootScope.showImage = true;
                $rootScope.rootImgUrl = src;
            };
            $scope.returnList = [];
            NativeAppAPI.hideTabBar();
            $scope.init = function (){
                // console.info(localStorage.getItem('me_token'),'metoken');
                var workOrderId = $stateParams.returnOrderId;
                $scope.dataList = [];
                $rootScope.startLoading();
                server.maocGetReq('cancelStock/selectByWorkorderId', {workorderId:workOrderId}).then(function (data) {
                    if (data.data.statusCode === 200) {
                        for(var i in data.data.data){
                            $scope.fileArr[i] = [];
                            $scope.imgArr[i] = [];
                            if(data.data.data[i].attachments.length > 0){
                                angular.forEach(data.data.data[i].attachments, function (item, index) {
                                    if(item.type.indexOf('image') != '-1'){
                                        if(typeof (item.content) != 'undefined') {
                                            // item.fileArr = [];
                                            // item.imgArr = [];
                                            var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                            var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                            var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                            imgBlob.name = item.name.indexOf('down') == -1
                                                ? imgName + 'down' + imgType
                                                : item.name;
                                            imgBlob.id = item.id;
                                            $scope.fileArr[i].push(imgBlob);
                                            $scope.imgArr[i].push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                        }
                                    }
                                })
                            }
                        }
                        console.log($scope.imgArr,'img')
                        $scope.returnList = data.data.data;
                        console.log($scope.returnList);

                    };
                    // if (data.data.dataSize == 0) {
                    $rootScope.endLoading();
                    // }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.init();

            $scope.deleteItem = function (id,index) {
                server.maocPostReq('cancelStock/delete',{id:id}).then(function (respon) {
                    if (respon.data.statusCode === 200){
                        $rootScope.errTip = '删除成功';
                        $scope.init();
                        // $scope.returnList.splice(index,1);
                    }
                })
            }


        }])
})()