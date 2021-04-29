module.exports = angular.module('myApp').controller('fileMessPdfController',
    ['$rootScope', '$scope', 'server', '$localForage', 'configInfo', '$filter','$stateParams',
        function($rootScope, $scope, server, $localForage, configInfo, $filter,$stateParams)  {

            var apicloudParam = $api.getStorage('apicloudParam');
            $scope.recordItem = apicloudParam.recordItem;
            $rootScope.scalEnabled = true;
            var pdfParam = apicloudParam.fileParam;
            $scope.title = pdfParam.attachmentTitle;
            $scope.navIndex = apicloudParam.navIndex;
            //共有多少页
            $scope.pageTotal = pdfParam.pageTotal;
            $scope.currentPage = pdfParam.currentPageIndex || 1;
            $scope.pdfLoaded = false;
            var t = null;
            var aPageLimitTime = 3000;
            // 读的最后的页数
            var lastReadPage = pdfParam.currentPageIndex || 0;

            //安卓返回键
            var time = window.setInterval(function () {
                if (typeof api !== 'undefined') {
                    api.addEventListener({
                        name: 'angularKeyback'
                    }, function(ret, err){
                        $scope.goBack();
                    });
                    window.clearInterval(time);
                }
            }, 20);

            // $scope.pdfUrl='https://sfamemb.sf-express.com/mobile/uat/ios/test.pdf';
            // $scope.pdfUrl= 'http://10.88.15.77:80/' + pdfParam.attachmentPath;
            // $scope.pdfUrl = 'https://sfamemb.sf-express.com/attachement/ghs/' + pdfParam.attachmentPath;   //正式环境
            // $scope.pdfUrl = 'http://rz-sfamemb.sfair.com/attachement/ghs/' + pdfParam.attachmentPath;   //容灾环境
            var producIp = $api.getStorage('produceIpAddress') ? $api.getStorage('produceIpAddress') : "https://sfamemb.sf-express.com/";

            $scope.pdfUrl =  producIp + 'attachement/ghs/' + pdfParam.attachmentPath;
            // $scope.pdfUrl =  'http://10.88.18.196:8080/' + 'attachement/ghs/' + pdfParam.attachmentPath;
            console.log('查看路径');
            console.log(JSON.stringify(pdfParam));
            console.log('查看路径完');
            $scope.pdfGoPrevious = function () {
                //提前终止计时器，并默认当前页已经读过
                timeOut();
                $scope.goPrevious();
                if ($scope.currentPage > 1) {
                    $scope.currentPage --;
                }
            };

            $scope.pdfGoNext = function () {

                if (t != null) {
                    $rootScope.errTip = '时间不足3秒钟';
                }
                else {
                    $scope.currentPage ++;
                    $scope.goNext();

                    if ($scope.currentPage > lastReadPage) {
                        t = setTimeout(timeOut,aPageLimitTime);
                    }
                }

            };

            function timeOut () {
                clearTimeout(t);
                t = null;
                if($scope.currentPage > lastReadPage) {
                    uploadReadProgress($scope.currentPage);
                }
            }

            function uploadReadProgress (page) {

                var param = {
                    recordId: pdfParam.recordId,
                    attachmentId: pdfParam.attachmentId,
                    currentPageIndex: page,
                    pageTotal: $scope.pageTotal
                };
                server.maocPostReq('news/feedback',param).then(function (res) {
                    lastReadPage ++;
                });
            }

            //api方法，pdf加载完成
            $scope.onLoad = function() {
                $rootScope.endLoading();

                if ($scope.currentPage == 1 && lastReadPage ==0) {
                    t = setTimeout(timeOut,aPageLimitTime);
                }
                $scope.pdfLoaded = true;
                // $scope.renderPage($scope.currentPage);
                // $scope.pageNum = $scope.currentPage;
                $scope.pageToDisplay = $scope.currentPage;
                $scope.pageNum = $scope.pageToDisplay;
            };

            $scope.$watch('pageCount',function (n,o) {
                if (typeof(n) != 'undefined' && typeof($scope.pageTotal) == 'undefined') {
                    $scope.pageTotal = n;
                }
            });

            $scope.goBack = function(param) {
                $rootScope.scalEnabled = false;
                // $rootScope.go('fileMessageDetail','',{recordItem:$scope.recordItem,navIndex:$scope.navIndex});
                NativeAppAPI.closeDamagePdf();
            };

            //api方法，加载错误
            $scope.onError = function(error) {
                $rootScope.endLoading();
            };

        }
    ]);