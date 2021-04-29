module.exports = angular.module('myApp')
    .controller('tmcExperienceListController', ['$rootScope', '$scope', '$stateParams', 'server', function ($rootScope, $scope, $stateParams, server) {
        NativeAppAPI.hideTabBar();
        var that = this, total = 0;
        $scope.errorTip = '';
        $scope.firstInit = true;
        $scope.showTip = false;
        $scope.searchName = '飞机号';
        $rootScope.endLoading();

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
        if($stateParams.srcType){
            $scope.srcType = $stateParams.srcType;
            $rootScope.srcType = $stateParams.srcType;
        }else{
            $scope.srcType = $rootScope.srcType;
        };
        if($stateParams.relateddefectId){
            $scope.relateddefectId = $stateParams.relateddefectId;
            $rootScope.relateddefectId = $stateParams.relateddefectId;
        }else{
            $scope.relateddefectId = $rootScope.relateddefectId;
        };
        var queryJSON = {
            pageSize: 20,
            pageIndex: 1,
            searchType: '',
            keywords:$scope.keywords,
            ata:$scope.ata,
            model:$scope.acModel,
            acReg:$scope.acReg,
            id:$scope.relateddefectId
        };
        switch ($scope.srcType) {
            case 'airlineExpList':
                queryJSON.searchType = 'airline_exp' ;
                $scope.title = '航线经验';
                break;
            case 'tmcExperienceList':
                queryJSON.searchType = 'tmc_experience' ;
                $scope.title = 'TMC经验';
                break;
            case 'relatedDefectList':
                queryJSON.searchType = 'defect_info' ;
                queryJSON.id = $scope.relateddefectId ;
                $scope.title = '相关故障';
                break;
            case 'relatedDocList':
                queryJSON.searchType = 'relate_doc' ;
                $scope.title = '相关文档';
                break;
            default:
                return;
        }
        // {ata: $scope.defectDetail.ata,model:$scope.defectDetail.model,acReg:$scope.defectDetail.acReg,keywords:keyword, searchType:'tmc_experience',pageSize:'20',pageIndex:'1'}

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
            // queryJSON.keywords = $scope.searchVal;
            // queryJSON.type = $scope.searchType;
            !that.requesting && (that.requesting = true); //防止在底部时同时执行nextPage

            if ($scope.searchVal.trim() != '') {
                $scope.errorTip = '';
                searchBalanceInfo();
            } else {
                $scope.errTip = '搜索内容不能为空';
                alert('搜索内容不能为空');
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
        /**
        *   created by casey on 2019/11/21
        *   function：  页面初始化
        */
        function searchBalanceInfo() {
            $scope.firstInit = false;
            $rootScope.startLoading();
            server.maocPostReq('esRest/getAssistantDecisionByType',queryJSON,true).then(function (data) {
                that.requesting = false;
                if (data.status === 200) {
                    that.total = data.data.total;
                    $scope.balanceInfo = data.data.data && $scope.balanceInfo.concat(data.data.data) || [];
                    if (Math.ceil(that.total / queryJSON.pageSize) == queryJSON.pageIndex) {
                        $scope.noMoreData = true;
                    };
                    console.info($scope.balanceInfo,'$scope.balanceInfo')
                }
                $rootScope.endLoading();

            }).catch(function (error) {
                $rootScope.endLoading();
            });

            // server.maocGetReq('pcheck/getPcheckListByKeyWords', queryJSON).then(function (data) {
            //     that.requesting = false;
            //     if (data.status === 200) {
            //         that.total = data.data.total;
            //         angular.forEach(data.data.data,function (item,index) {
            //             if(item.revtp == "D"){
            //                 item.revtp = "定检"
            //             }
            //             if(item.revtp == "Z"){
            //                 item.revtp = "专项"
            //             }
            //             if(item.revtp == "F"){
            //                 item.revtp = "封存"
            //             }
            //         });
            //         $scope.balanceInfo = data.data.data && $scope.balanceInfo.concat(data.data.data) || [];
            //         if (Math.ceil(that.total / queryJSON.pageSize) == queryJSON.pageIndex) {
            //             $scope.noMoreData = true;
            //         }
            //     }
            //    // if (data.data.dataSize == 0) {
            //         $rootScope.endLoading();
            //    // }
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
            switch ($scope.srcType) {
                case 'airlineExpList':
                    $rootScope.go('experienceList.lineExpDetail','',{id :id,isEdit:false});
                    break;
                case 'tmcExperienceList':
                    $rootScope.go('experienceList.tmcExpDetail','',{id :id});
                    break;
                case 'relatedDefectList':
                    $rootScope.go('experienceList.defectOutline','slideLeft',{defectId: id,from:'faultDetail'})
                    break;
                case 'relatedDocList':
                    $rootScope.startLoading();
                    var param = {source:'docList'};
                    server.maocGetReq('relatedDoc/getDocUrlByIdAndType', {id:id,type:type}).then(function (data) {
                        $rootScope.endLoading();
                        if (200 === data.status) {
                            param.url = data.data.data[0];
                            OPENAPI.relatedDocCheck()
                            if($rootScope.android){
                                param.url = encodeURI(param.url);
                            }
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
