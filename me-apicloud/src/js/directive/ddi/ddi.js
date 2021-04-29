angular.module('myApp')
    .directive('ddiEdi', ['$rootScope', '$stateParams', 'configInfo', 'fileReader', '$timeout', '$filter',
        function ($rootScope, $stateParams, configInfo, fileReader, $timeout, $filter) {
            return {
                restrict: "E",
                templateUrl: "ddi/ddi-edi.html",
                replace: true,
                transclude: true,
                scope: {
                    paddingInfo: '=',
                    faultInfo: '='
                },
                link: link
            };
            function link($scope) {
                $rootScope.endLoading();
                $scope.hideApproverTitle = true;//隐藏选人默认状态
                // $scope.isEdit=false;
                // $scope.isProp = false;
                $scope.requested={};
                $scope.Approved={};
                $scope.auditor={};

                if ($scope.paddingInfo.applyDate && $scope.faultInfo.status.toUpperCase() === 'O') {
                    var d = new Date($scope.paddingInfo.expiredDate);
                    var n = new Date();
                    n.setDate(n.getDate() + 3);
                    if (d.getTime() <= n.getTime()) {
                        $scope.styleCss = {color: 'red'};
                    }
                }

                        $scope.paddingInfo.isPlacard = ($scope.paddingInfo.isPlacard == 'y' ? 'YES' : 'NO');
                        $scope.paddingInfo.isCaution = ($scope.paddingInfo.isCaution == 'y' ? 'YES' : 'NO');
                        $scope.paddingInfo.isM = ($scope.paddingInfo.isM == 'y' ? 'YES' : 'NO');
                        $scope.paddingInfo.isSpecial = ($scope.paddingInfo.isSpecial == 'y' ? 'YES' : 'NO');
                        $scope.paddingInfo.isCheck = ($scope.paddingInfo.isCheck == 'y' ? 'YES' : 'NO');
                        $scope.paddingInfo.isReview = ($scope.paddingInfo.isReview == 'y' ? 'YES' : 'NO');
                        $scope.paddingInfo.isO = ($scope.paddingInfo.isO == 'y' ? 'YES' : 'NO');
                        $scope.paddingInfo.isNotify = ($scope.paddingInfo.isNotify == 'y' ? 'YES' : 'NO');
                        $scope.paddingInfo.dfralCategory = ($scope.paddingInfo.dfralCategory == 'a'||$scope.paddingInfo.dfralCategory == '4' ? 'A' : $scope.paddingInfo.dfralCategory == 'b'||$scope.paddingInfo.dfralCategory == '3' ? 'B:三天' : $scope.paddingInfo.dfralCategory == 'c'||$scope.paddingInfo.dfralCategory == '10' ? 'C:十天' : $scope.paddingInfo.dfralCategory == 'd'||$scope.paddingInfo.dfralCategory == '120' ? 'D:一百二十天' : 'OTHER');
                        // $scope.paddingInfo.expiredDate = $filter('date')($scope.paddingInfo.expiredDate, 'yyyy-MM-dd');
                        // $scope.ddDueDatas.categoryExpDate = $filter('date')($scope.paddingInfo.expiredDate, 'yyyy-MM-dd');
                        // $scope.expiredDate = $filter('date')($scope.paddingInfo.expiredDate, 'yyyy年MM月dd日');

                $scope.category = $scope.paddingInfo.dfralCategory;
                $scope.requested.approverName = $scope.paddingInfo.requester;
                $scope.requested.approverSn = $scope.paddingInfo.requesterNo;
                $scope.requested.nameAndId = $scope.paddingInfo.requester +' '+ $scope.paddingInfo.requesterNo;
                $scope.Approved.approverName = $scope.paddingInfo.approver;
                $scope.Approved.approverSn = $scope.paddingInfo.approverNo;
                $scope.Approved.nameAndId = $scope.paddingInfo.approver +' '+ $scope.paddingInfo.approverNo;
                $scope.auditor.approverName = $scope.paddingInfo.auditor;
                $scope.auditor.approverSn = $scope.paddingInfo.auditorNo;
                $scope.auditor.nameAndId = $scope.paddingInfo.auditor +' '+ $scope.paddingInfo.auditorNo;

                $scope.paddingInfo.approver = $scope.Approved.approverSn;
                $scope.paddingInfo.requester = $scope.Approved.approverName;
              }
        }]);
