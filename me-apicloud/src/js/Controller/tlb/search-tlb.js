module.exports = angular.module('myApp').controller('searchTlbController',
    ['$rootScope', '$scope', 'server', '$localForage', 'configInfo', '$filter','$stateParams',
        function($rootScope, $scope, server, $localForage, configInfo, $filter,$stateParams)  {

            var that = this;
            $rootScope.endLoading();
            var pageSize = 20;
            $scope.dataList = [];
            // $scope.foundDate = new Date();
            $scope.foundDate = null;
            $scope.searchTxt = $stateParams.searchTxt || $rootScope.searchTlbTxt || '';
            //排除tlbDetail返回的情况
            if ($stateParams.from != 'tlbDetail' && $stateParams.from != '') {
                $rootScope.searchTlbFrom = $stateParams.from;
            }

            /*
             *参数准备函数
             */
            $scope.clickBtnSearch = function(searchTxt){
                that.currentPage = 1;
                $scope.noMoreData = false;
                $scope.tlbList = [];
                var foundDate = angular.copy($scope.foundDate);
                    foundDate = Date.parse(new Date($filter('date')(foundDate, 'yyyy-MM-dd')));
                var param = {
                    dateFound: foundDate || 0,
                    inputValue: searchTxt || '',
                    pageIndex: 1,
                    pageSize: pageSize
                }
                that.curParam = param;
                if(!that.requesting){
                    that.requesting = true; //防止在底部时同时执行nextPage
                    searchTLB(param);
                }
            };

            if ($scope.searchTxt && $scope.searchTxt != '') {
                $scope.clickBtnSearch($scope.searchTxt);
            }
            /*
             *获取下页的数据
             */
            $scope.getNextPage = function() {
                if(!$scope.noMoreData && !that.requesting) {
                    that.curParam.page = ++that.currentPage;

                    if(Math.ceil(that.total / pageSize) >= that.curParam.page){
                        that.requesting = true; //防止在底部时同时执行nextPage
                        searchTLB(that.curParam);
                    }else{
                        $scope.noMoreData = true;
                    }
                }
            }
            /**
             * 数据请求函数
             *
             */
            function searchTLB(param){
                $rootScope.startLoading();

                server.maocGetReq('TLB/findTLB',param).then(function(data) {
                    that.requesting = false;
                    if(200 === data.status) {
                        that.total = data.data.total;

                        $scope.tlbList = data.data.data && $scope.tlbList.concat(data.data.data) || [];

                        if(Math.ceil(that.total / pageSize) == param.pageIndex){
                            $scope.noMoreData = true;
                        }
                    }

                    $rootScope.endLoading();
                }).catch(function(error) {
                    console.log(error);
                    $rootScope.endLoading();
                });

                that.requesting = false;


            };

            //回车点击触发事件
            $scope.enter = function(ev,damageNum){
                if(ev.keyCode == 13){
                    ev.preventDefault();
                    $scope.clickBtnSearch(damageNum);
                }
            };
            
            $scope.goBack = function () {
                if ($rootScope.searchTlbFrom && $rootScope.searchTlbFrom == 'status') {
                    $rootScope.go('back');
                }
                else {
                    $rootScope.go('index');
                }
                $rootScope.searchTlbFrom = '';
                $rootScope.searchTlbTxt = '';
            };

            $rootScope.goToDetail = function (item) {
                $rootScope.go('tlbDetail','',{tlbId: item.tlbId});
                $rootScope.searchTlbTxt = $scope.searchTxt;
            };

            //Android返回键单独处理,确保和点击页面返回保持一致
            if($rootScope.android){
                api.removeEventListener({
                    name: 'angularKeyback'
                });

                api.addEventListener({
                    name: 'angularKeyback'
                }, function(ret, err){
                    // $rootScope.go('index');
                    $scope.goBack();
                });
            }

        }
    ]);