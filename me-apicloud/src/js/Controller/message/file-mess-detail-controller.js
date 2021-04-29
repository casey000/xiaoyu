module.exports = angular.module('myApp').controller('fileMessDetailController',
    ['$rootScope', '$scope', 'server', '$localForage', 'configInfo', '$filter','$stateParams',
        function($rootScope, $scope, server, $localForage, configInfo, $filter,$stateParams)  {
            $rootScope.endLoading();
            //用于承接路由传参对象
            var recordItem = $stateParams.recordItem;
            var recordId = recordItem.id;
            $scope.title = recordItem.title;
            $scope.navIndex = $stateParams.navIndex;
            $scope.messBody = {};

            function getFileMessageDetail(recordId){

                $rootScope.startLoading();
                server.maocGetReq('news/findFliePushRecordDetailByID',{'recordId': recordId}).then(function(res) {
                    var response = res.data;
                    if(200 === response.statusCode) {
                        $scope.messBody = response.data[0].recordDetail;
                    }
                    $rootScope.endLoading();
                }).catch(function(error) {
                    console.log(error);
                    $rootScope.endLoading();
                });
            };
            getFileMessageDetail(recordId);
            //安卓返回键
            var time = window.setInterval(function () {
                if (typeof api !== 'undefined') {
                    api.addEventListener({
                        name: 'damagePdfGoBack'
                    }, function(ret, err){
                        getFileMessageDetail(recordId);
                    });
                    window.clearInterval(time);
                }
            }, 20);

            $scope.gotoPdf = function (item) {
                $scope.screenW = document.body.clientWidth;
                $scope.screenH = document.body.clientHeight;
                if ($scope.screenW > 500) {
                    NativeAppAPI.openDamagePdf({fileParam: item,recordItem:recordItem, navIndex:$scope.navIndex});
                    // $rootScope.go('fileMessPdfIpad','',{fileParam: item,recordItem:recordItem, navIndex:$scope.navIndex});
                }
                else {
                    NativeAppAPI.openDamagePdf({fileParam: item,recordItem:recordItem, navIndex:$scope.navIndex});

                    // $rootScope.go('fileMessPdf','',{fileParam: item,recordItem:recordItem, navIndex:$scope.navIndex});
                }
            };
        }
    ]);