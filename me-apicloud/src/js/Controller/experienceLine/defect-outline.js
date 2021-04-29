module.exports = angular.module('myApp').controller('defectOutlineController',
    ['$rootScope', '$scope', '$stateParams', 'server','$location','$localForage','$anchorScroll', 'configInfo', '$window', '$filter', 'b64ToBlob',
        function ($rootScope, $scope, $stateParams,  server,$location, $anchorScroll,$localForage, configInfo,$window, $filter, b64ToBlob) {
            $scope.hideApproverTitle = true;
            $rootScope.startLoading();

            if($stateParams.defectId){
                $scope.defectId = $stateParams.defectId;
                $rootScope.defectId = $stateParams.defectId;
            }else{
                $scope.defectId = $rootScope.defectId;
            };
            if($stateParams.from){
                $scope.from = $stateParams.from;
                $rootScope.from = $stateParams.from;
            }else{
                $scope.from = $rootScope.from;
            };
            // /me-mobile/rs/expView/queryPersonalDataStatistics
            $scope.dataObj ={};
            $scope.writeSum =false;
            $scope.sumText ='';
            $scope.taskupWay = 'defectSummary';
            $scope.imgArrTask = [];
            $scope.fileArrTask = [];
            $scope.fileId = [];
            $scope.userCode = configInfo.userCode;

            $scope.$on('$destroy', function() {
                OPENAPI.closeDefectOutline();
            });
            function initInfo() {
                OPENAPI.openDefectOutline();
                server.maocGetReq('defect/getDefectSimpleByDefectId', {defectId:$scope.defectId}).then(function (data) {
                    $rootScope.endLoading();
                    if (200 == data.data.statusCode) {
                        $scope.newfood = [];
                        var temp = {};
                        var arry = data.data.data[0].ccList;
                        for(var i in arry) {
                            var key= arry[i].onPn;
                            if(temp[key]) {
                                temp[key].onPn = temp[key].onPn ;
                                temp[key].amount++
                            } else {
                                temp[key] = {};
                                temp[key].onPn = arry[i].onPn;
                                temp[key].amount = 1

                            }
                            temp[key].onName= arry[i].onName;
                        }
                        for(var k in temp){
                            $scope.newfood.push(temp[k])
                        }
                        $scope.dataObj = data.data.data[0];
                        for(var i in $scope.dataObj.defectSummaryList){
                            if(!$scope.dataObj.defectSummaryList[i].praiseNum){
                                $scope.dataObj.defectSummaryList[i].praiseNum = 0
                            }
                        }


                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                    console.log(error);
                });

            }
            initInfo();

            $scope.goBack = function(){
                if($stateParams.from == 'baidu'){
                    $rootScope.go('back');
                    // $rootScope.go('experienceList','slideLeft', {fromIndex: true});

                }else{
                    $rootScope.go('back');
                }
            };

            $scope.praise = function (item,index) {
                if(!item.isPraised){
                    server.maocPostReq('assembly/updatePraise', {id:item.id,type:'defectSummary'}).then(function (result) {
                        if(result.data.statusCode == '200'){
                            $scope.dataObj.defectSummaryList[index].isPraised = true;
                            $scope.dataObj.defectSummaryList[index].praiseNum ++
                        }

                    }).catch(function (error) {
                        alert('点赞失败');

                    });
                }else{
                    alert('每个人只能点赞一次');
                }

            };
            $scope.delete = function (item,index) {
                console.info(configInfo.userCode);
                if(item.creatorSn == configInfo.userCode){
                    server.maocPostReq('defectSum/deleteDefectSum', {id:item.id}).then(function (result) {
                        if(result.status == 200){
                            $scope.dataObj.defectSummaryList.splice(index ,1);
                            alert('删除成功')
                        }

                    }).catch(function (error) {
                        alert('删除失败');

                    });
                }else{
                    alert('只有创建人可以删除')
                }


            };
            $scope.makeTask = function(){
              $scope.writeSum = true;
            };
            $scope.cancelHelp = function(){
              $scope.writeSum = false;
            };
            $scope.helpSure = function(){
                console.info($scope.sumText);
                console.info($scope.imgArrTask);
                console.info($scope.fileId);
                $rootScope.startLoading();
                server.maocPostReq('defectSum/addOrUpdateDefectSum', {defectId:$stateParams.defectId,content:$scope.sumText,defectSmAttaIds:$scope.fileId},true).then(function (result) {
                    if(result.status == 200){
                        $rootScope.endLoading();
                        alert('发布成功');
                        $scope.writeSum = false;
                        $scope.sumText ='';
                        $scope.imgArrTask = [];
                        $scope.fileArrTask = [];
                        $scope.fileId = [];
                        initInfo()
                    }

                }).catch(function (error) {
                    $rootScope.endLoading();
                    alert('发布失败');
                });

            };
            $scope.showBig = function (img_arr, img_index) {
                var images= img_arr.map(function(item){
                    return item.content
                });
                OPENAPI.loadImages({
                    images: images,
                    activeIndex: 0,
                    bgColor: "#000"
                });
                setTimeout(function(){
                    var images_to_show = img_arr.map(function(item){
                        return item.content
                    });
                    OPENAPI.scanPhoto({
                        images: images_to_show,
                        activeIndex: img_index,
                        bgColor: "#000"}, img_index)

                    $scope.addCloseEventListener();
                },500);


            };
            $scope.addCloseEventListener = function (){
                api.addEventListener({
                    name: 'angularKeyback'
                }, function(ret, err){
                    $scope.closePhoto();
                });
            }

            $scope.closePhoto = function (){
                OPENAPI.closePhoto();
                api.addEventListener({
                    name: 'angularKeyback'
                }, function(ret, err){
                    $rootScope.go('back');
                });
            }
            $scope.openNewPageWithData = function(param){
                var type = angular.lowercase(param.type);
                if (type == 'doc' || type == 'docx' || type == "txt"
                    || type == "tif"|| type == "xls"  || type == "xlsx") {
                    alert('暂不支持此格式预览');
                    return;
                }
                console.info(param,'param');
                NativeAppAPI.openPdfWithUrl(param)
            };







        }    
    ]);