module.exports = angular.module('myApp')
    .controller('experienceListController', ['$rootScope', '$scope', '$stateParams', 'server', function ($rootScope, $scope, $stateParams, server) {
        NativeAppAPI.hideTabBar();
        var that = this, total = 0;
        $scope.errTip = '';
        $scope.firstInit = true;
        $scope.showTip = false;
        $scope.searchName = '飞机号';
        $rootScope.endLoading();
        var queryJSON = {
            pageSize: 20,
            pageIndex: 1,
            searchType:  'maintenance_small_bd',
            keywords:'',
            // ata:'',
            // model:'',
            // acReg:''
        };

        var lanConfig = require('../../../../i18n/lanConfig');
        $scope.holderValue = '请输入搜索内容';
        $scope.searchVal = '';
        $scope.keyEvent = function (event) {
            if (event.keyCode === 13) {
                $scope.clickBtnSearch();
            }
        }

        /*
         *点击搜索按钮搜索
         */
        $scope.clickBtnSearch = function () {
            $scope.noMoreData = false;
            $scope.balanceInfo = [];
            queryJSON.pageIndex = 1;
            queryJSON.keywords = $scope.searchVal;
            queryJSON.type = $scope.searchType;
            !that.requesting && (that.requesting = true); //防止在底部时同时执行nextPage

            if ($scope.searchVal.trim() != '') {
                searchBalanceInfo();
            } else {
                $rootScope.errTip = '搜索内容不能为空';
            }
        };

        /*
         *获取下页的数据
         */
        $scope.getNextPage = function () {
            if (!$scope.noMoreData && !that.requesting) {
                if (Math.ceil(that.total / queryJSON.pageSize) > queryJSON.pageIndex) {
                    queryJSON.pageIndex++;
                    that.requesting = true; //防止在底部时同时执行nextPage
                    searchBalanceInfo();
                } else {
                    $scope.noMoreData = true;
                }
            }
        };
        $scope.balanceInfo = [];


        function searchBalanceInfo() {
            $scope.firstInit = false;
            OPENAPI.baikeSearch();
            $rootScope.startLoading();
            server.maocPostReq('esRest/getAssistantDecisionByType', queryJSON,true).then(function (data) {
                that.requesting = false;
                if (data.status === 200) {
                    that.total = data.data.total;
                    $scope.balanceInfo = data.data.data && $scope.balanceInfo.concat(data.data.data) || [];
                    if (Math.ceil(that.total / queryJSON.pageSize) == queryJSON.pageIndex) {
                        $scope.noMoreData = true;
                    }
                }
               // if (data.data.dataSize == 0) {
                    $rootScope.endLoading();
               // }
            }).catch(function (error) {
                $rootScope.endLoading();
            });
        };
        /**
         *   created by casey on 2019/11/22
         *   function：  详情跳转函数
         */
        $scope.toDet = function(id,type){
            switch (type) {
                case 'airline_exp':
                    $rootScope.go('experienceList.lineExpDetail','',{id :id,isEdit:false});
                    break;
                case 'tmc_experience':
                    $rootScope.go('experienceList.tmcExpDetail','',{id :id});
                    break;
                case 'defect_info':
                    $rootScope.go('experienceList.defectOutline','slideLeft',{defectId: id,from:'baidu'});
                    break;
                case 'relate_doc':
                    $rootScope.startLoading();
                    var param = {source:'docList'};
                    server.maocGetReq('relatedDoc/getDocUrlByIdAndType', {id:id,type:type}).then(function (data) {
                        $rootScope.endLoading();
                        if (200 === data.status) {
                            OPENAPI.relatedDocCheck();
                            param.url = data.data.data[0];
                            NativeAppAPI.openPdfWithUrl(param);
                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        console.log(error);
                    });
                    break;
                case 'EO':
                case 'EA':
                case 'mp_jc':
                case 'em_tb':
                        $rootScope.startLoading();
                        var param = {source:'docList'};
                        server.maocGetReq('relatedDoc/getDocUrlByIdAndType', {id:id,type:type}).then(function (data) {
                            $rootScope.endLoading();
                            if (200 === data.status) {
                                param.url = data.data.data[0];
                                OPENAPI.relatedDocCheck();
                                if($rootScope.android){
                                    param.url = encodeURI(param.url);
                                }
                                NativeAppAPI.openPdfWithUrl(param);
                            }
                        }).catch(function (error) {
                            $rootScope.endLoading();
                            console.log(error);
                        });

                default:
                    return;
            }
        };
        //输入搜索条件后回车返回搜索结果
        $scope.enter = function (ev, materialsearchTxt) {
            if (ev.keyCode == 13) {
                ev.preventDefault();
                $scope.clickBtnSearch(materialsearchTxt);
            }
        };
    }
    ]);
