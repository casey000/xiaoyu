
module.exports = angular.module('myApp').controller('ddiMyTaskController',
    ['$rootScope','$scope','$state','server', '$localForage', 'configInfo', '$filter' ,
        function($rootScope,$scope,$state,server, $localForage, configInfo, $filter) {
            var that = this;
            $scope.mytaskData = [];
            var rows = 100;
            var param = {
                rows: rows,
                page: 1,
                sn: "",
                type: "defect_audit"
            };

            var apiExist = setInterval(function(){
                if( typeof api != 'undefined' ){
                    api.addEventListener({
                        name: 'task-viewappear'
                    }, function(ret, err){
                        initDDTasks(true); //参数为是否要加载效果
                    });
                    window.clearInterval(apiExist);
                }
            }, 20);

            /*
             *获取下页的数据
             */
            $scope.getNextPage = function() {
                if(!$scope.noMoreData && !that.requesting) {
                    that.curParam.page = ++that.currentPage;
                    if(Math.ceil(that.total / rows) >= that.curParam.page){
                        that.requesting = true;//防止在底部时同时执行nextPage
                        $scope.myTaskInfo(that.curParam);
                        $scope.nextPage = true;
                    }else{
                        $scope.noMoreData = true;
                    }
                }
            };
            /**
             * 获取下拉刷新的数据
             */
            $scope.myTaskInfo = function(param){
                server.maocGetReq('defect/getDefectDeferedTask',param).then(function(data) {
                    that.requesting = false;
                    if( data.status === 200) {
                        $rootScope.endLoading();
                        that.total = data.data.dataSize;

                        var apiExis = setInterval(function(){
                            if( typeof api != 'undefined' ){
                                api.sendEvent({
                                    name: 'updateMyTaskNum',
                                    extra: {
                                        total: that.total,
                                    }
                                });
                                window.clearInterval(apiExis);
                            }
                        }, 20);

                        var result = data.data.data;
                        var newRes = [];

                        for(var i= 0;i<result.length;i++){
                            newRes.push(result[i]);
                            newRes[i].sn = param.sn;
                        }

                        if(!$scope.nextPage){
                            $scope.mytaskData =  [];
                        }

                        $scope.nextPage = false; //没有请求下一页时,数据置为空,否则数据拼接
                        $scope.mytaskData = newRes && $scope.mytaskData.concat(newRes) || [];

                        if(Math.ceil(that.total / rows) == param.page){
                            $scope.noMoreData = true;
                        }
                    }

                    $scope.pullToRefreshActive = false;
                    $rootScope.endLoading();
                }).catch(function(error) {
                    $scope.pullToRefreshActive = false;
                    $rootScope.endLoading();
                    that.requesting = false;
                });

            };

            function initDDTasks(needLoading){
                //var rows = 6;
                that.currentPage = 1;
                $scope.noMoreData = false;
                $scope.requesting = false;
                param.sn = configInfo.userCode ? configInfo.userCode : server.userLoginUserCode();
                param.page = 1;
                that.curParam = param;

                if(!that.requesting){
                    that.requesting = true; //防止在底部时同时执行nextPage
                    $scope.myTaskInfo(param);
                    needLoading && $rootScope.startLoading();
                }
            };
            initDDTasks(true);
            $scope.refresher = window.initDDTasks = initDDTasks;

            $scope.approve_go = function (approveId,data) {
                if(data.auditStatus==5 || data.auditStatus==1){
                    $state.go('ddi',{approveId:approveId,dataInfo:data});
                }else{

                    $state.go('approve',{approveId:approveId,dataInfo:data});
                }
            };

            $scope.go_faultClose=function(data,event){
                event.stopPropagation();
                $rootScope.go('searchFault.faultClose','',{defectId: data.defectId, pt: true, defectInfo: data});
            };

            /***
             * 折叠函数
             */
            $scope.fold = function (event) {
                event.stopPropagation();
                // $scope.mccRemark = !$scope.mccRemark;
            }
        }
    ]);


