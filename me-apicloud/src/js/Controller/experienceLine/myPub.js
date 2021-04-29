module.exports = angular.module('myApp')
    .controller('myPubController', ['$rootScope', '$scope', '$stateParams', 'server', function ($rootScope, $scope, $stateParams, server) {
        NativeAppAPI.hideTabBar();
        var that = this, total = 0;
        //当为true时，表示没有更多的数据。
        $scope.noMoreData = false;
        $scope.loadMore = false;
        $rootScope.endLoading();
        var queryJSON = {
            pageSize: 20,
            pageIndex: 1,
            type:  $scope.searchType,
            inputValue:''
        };
        $scope.goBack = function(){
            NativeAppAPI.closemyPub();
        };
        $scope.toDetail = function (obj) {
            if(obj.type == 'airlineExp'){
                $rootScope.go('experienceList.lineExpDetail','',{id :obj.tid,isEdit:false});
                // $rootScope.go('pubLine','slideLeft',{expId: obj.tid,from:'myPub'})
            }else if(obj.type == 'defectSummary'){
                $rootScope.go('experienceList.defectOutline','slideLeft',{defectId: obj.defectId,from:'myPub'})
            }else{
                alert('未知经验类型')
            }
        };
        //安卓返回键
        var timer = window.setInterval(function () {
            if (typeof api !== 'undefined') {
                api.addEventListener({
                    name: 'angularKeyback'
                }, function(ret, err){
                    $scope.goBack();
                });
                window.clearInterval(timer);
            }
        }, 20);
        $scope.dataList = [];
        $scope.init = function(){
            $rootScope.startLoading();
            server.maocGetReq('expView/getExpViewInfoListBySn', queryJSON).then(function (data) {
                if (200 === data.status) {
                    console.info(data.data);
                    // angular.forEach(data.data.data,function (item,index) {
                    //
                    // });
                    if (Math.ceil(that.total / queryJSON.pageSize) == queryJSON.pageIndex) {
                        $scope.noMoreData = true;
                    }
                    $scope.dataList = data.data.data && $scope.dataList.concat(data.data.data) || [];
                    console.info(Math.ceil(that.total / queryJSON.pageSize),'213');
                    console.info($scope.noMoreData);
                    $rootScope.endLoading();
                    console.info($scope.dataList,'返回值')
                }
            }).catch(function (error) {
                console.log(error);
            });
        };
        $scope.init();
        $scope.getNextPage = function () {
            console.info('xiayiye')
            if (!$scope.noMoreData && !that.requesting) {
                if (Math.ceil(that.total / queryJSON.pageSize) > queryJSON.pageIndex) {
                    queryJSON.pageIndex++;
                    that.requesting = true; //防止在底部时同时执行nextPage
                    $scope.init();
                } else {
                    $scope.noMoreData = true;
                }
            }
        };

    }
    ]);
