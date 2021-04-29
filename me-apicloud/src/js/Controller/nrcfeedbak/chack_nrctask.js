
module.exports = angular.module('myApp').controller('checknrctaskController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter',
        function($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter) {
            $rootScope.loading = false;
            $scope.isCreateData = true;
            $scope.preFlightNo="afsdf";
            $scope.uploadSoundArr = [];
            $scope.isApiCloud = true; //上传附件时是否要用apiCloud方法
            $scope.imgArr = [];  //页面预览所用文件
            $scope.fileArr = [];  //要上传的二进制流
            $scope.dateFound = new Date();
            $scope.gobackToRoot = function () {
                // NativeAppAPI.audioPlayerStop();
                $rootScope.go('back', 'slideLeft', {});
            };
            // var jobDate = angular.uppercase(jobInfo.jobType) == 'O/G' ? jobInfo.jobDate
            //     : ($stateParams.tr ? $stateParams.flight.std : $stateParams.flight.sta);
            $scope.mrInfo = {
                dateFound: new Date($filter('date')($scope.dateFound, 'yyyy/MM/dd HH:mm')),
                defectOrigin: 'GND',
                "jobId": "",
                "faultType": 'U',
                "acReg": "",
                "jobDate": $filter('date')($scope.dateFound, "yyyy/MM/dd HH:mm:ss"),
                "checkType": '',//取航班行前或者航后
                "flightNo": 'N/A',
                "preFlightNo":'',
                "station": "",
                dmStatus: "",
                dm : '',
                rii:""
            };

            $scope.ceshi=function () {
                console.log(JSON.stringify($scope.mrInfo));
            }

        }
    ]);