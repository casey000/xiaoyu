module.exports = angular.module('myApp').controller('ccInfoController',
    ['$rootScope', '$scope', '$filter', '$stateParams','$interval','$localForage','configInfo',
        function ($rootScope, $scope, $filter, $stateParams,$interval,$localForage,configInfo) {
            $scope.cc = $stateParams.ccInfo;
            $scope.fromTlb = $stateParams.fromTlb;
            console.log("--------ccedti------------------");
            console.log(JSON.stringify($scope.cc));
            console.log("--------ccedti------------------");
            if(typeof $scope.cc.tlbCompCCSubSet != 'undefined'){
                $scope.cc.componentCCSubSet = $scope.cc.tlbCompCCSubSet;
            }

            if(!angular.equals($scope.cc, {})){
                $localForage.setItem('ccInfo', $scope.cc);
            }else{
                $localForage.getItem('ccInfo').then(function(value){
                    $scope.cc = value;
                });
            }

            $rootScope.endLoading();
        }
    ]);


