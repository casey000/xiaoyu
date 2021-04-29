module.exports = angular.module('myApp').controller('searchDamageController',
    ['$rootScope', '$scope', 'server', 'configInfo', 'airport', '$state',
        function($rootScope, $scope, server, configInfo, airport,$state) {
            //     $scope.searchDamage = function(param) {
            //         $rootScope.startLoading();
            //         var requestUrl = 'Asms/getAsmsDamgeRepairList?';
            //         server.maocGetReq(requestUrl, param).then(function(data) {
            //             $rootScope.endLoading();
            //             if(200 === data.status) {
            //                 $scope.data = data.data.data[0];
            //                 console.log($scope.data);
            //             }
            //         }).catch(function(error) {
            $rootScope.endLoading();
            //         });
            //     };
            //     $scope.searchDamage({acNumber:'DRS-201711-048'});
            // }

            //触发扫码调用时则直接调用，海风封装好的调用iOS原生的方法，scanLineCode
            //iOS执行后将结果后调用方法setQrCode回调，则只需要实现回调方法即可，回调方法通过
            //调用全局方法，而全局方法在该类中实现，则可以通过函数传值
            $scope.scanLineCode = function () {
                NativeAppAPI.scanLineCode({'callBackfunction':"setQrCode"});
            }

            // $scope.scanLineCode();
            // 回调函数
            window.getMeCardNo = function (respose) {
                $state.go('damageDetail','slideLeft',{acNumber:respose});
            }

        }
    ]);