module.exports = angular.module('myApp')
    .controller('defectHelpListController', ['$rootScope', '$scope', '$stateParams', 'server', function ($rootScope, $scope, $stateParams, server) {
        NativeAppAPI.hideTabBar();
        var that = this, total = 0;
        $scope.errorTip = '';
        $scope.firstInit = true;
        $scope.showTip = false;
        $scope.searchName = '飞机号';
        if($stateParams.ata){
            $scope.ata = $stateParams.ata;
            $rootScope.ata = $stateParams.ata;
        }else{
            $scope.ata = $rootScope.ata;
        };
        if($stateParams.acReg){
            $scope.acReg = $stateParams.acReg;
            $rootScope.acReg = $stateParams.acReg;
        }else{
            $scope.acReg = $rootScope.acReg;
        };
        if($stateParams.acModel){
            $scope.acModel = $stateParams.acModel;
            $rootScope.acModel = $stateParams.acModel;
        }else{
            $scope.acModel = $rootScope.acModel;
        };
        if($stateParams.keywords){
            $scope.keywords = $stateParams.keywords;
            $rootScope.keywords = $stateParams.keywords;
        }else{
            $scope.keywords = $rootScope.keywords;
        };
        if($stateParams.defectId){
            $scope.defectId = $stateParams.defectId;
            $rootScope.defectId = $stateParams.defectId;
        }else{
            $scope.defectId = $rootScope.defectId;
        };
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
        $scope.lookMore = function(type){
            switch (type) {
                case 'airlineExpList':
                case 'tmcExperienceList':
                case 'relatedDefectList':
                case 'relatedDocList':
                    $rootScope.go('tmcExperienceList','',{srcType:type,ata:$scope.ata,acReg:$scope.acReg,acModel:$scope.model,keywords: queryJSON.keywords});
                    break;

                default:
                    // alert('任务类型不正确');
                    $rootScope.errTip = '任务类型不正确';
                    return;

            }
        };
        $scope.tmcDetail = function(id,type){
            switch (type) {
                case 'airlineExpList':
                    $rootScope.go('experienceList.lineExpDetail','',{id :id,isEdit:false});
                    break;
                case 'tmcExperienceList':
                    $rootScope.go('experienceList.tmcExpDetail','',{id :id});
                    break;
                case 'relatedDefectList':
                    $rootScope.go('experienceList.defectOutline','slideLeft',{defectId: id,from:'faultDetail'});
                    break;
                default:
                    $rootScope.errTip = '任务类型不正确';
                    return;
            }
        };
        $scope.docDetail = function(id,type){
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
            OPENAPI.defectHandleSearch();
            $rootScope.startLoading();
            server.maocPostReq('esRest/getTroubleshootingHelpList', {id:$scope.defectId,ata: $scope.ata,model:$scope.acModel,acReg:$scope.acReg,keywords:queryJSON.keywords || $scope.keywords},true).then(function (data) {
                if (data.status === 200) {
                    $rootScope.endLoading();
                    $scope.helpInfo = data.data.data[0];
                    // $scope.faultInfo.tmcExpList = data.data.data[0].tmcExpList;
                    // $scope.faultInfo.relatedDocList = data.data.data[0].relatedDocList;
                    // $scope.faultInfo.relatedDefectList = data.data.data[0].relatedDefectList;
                    // $scope.faultInfo.airlineExpList = data.data.data[0].airlineExpList;

                }
                // console.log($scope.helpInfo,'2312');
                // console.log($scope.faultInfo,'2312')

            }).catch(function (error) {
                $rootScope.endLoading();
            });
            // server.maocPostReq('esRest/getAssistantDecisionByType', queryJSON,true).then(function (data) {
            //     that.requesting = false;
            //     if (data.status === 200) {
            //         that.total = data.data.total;
            //         $scope.balanceInfo = data.data.data && $scope.balanceInfo.concat(data.data.data) || [];
            //         if (Math.ceil(that.total / queryJSON.pageSize) == queryJSON.pageIndex) {
            //             $scope.noMoreData = true;
            //         }
            //     }
            //     $rootScope.endLoading();
            // }).catch(function (error) {
            //     $rootScope.endLoading();
            // });
        };
        searchBalanceInfo();
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
                            param.url = data.data.data[0];
                            NativeAppAPI.openPdfWithUrl(param);
                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        console.log(error);
                    });
                    break;

                default:
                    return;
            }
        }
        //输入搜索条件后回车返回搜索结果
        $scope.enter = function (ev, materialsearchTxt) {
            if (ev.keyCode == 13) {
                ev.preventDefault();
                $scope.clickBtnSearch(materialsearchTxt);
            }
        };
    }
    ]);
