module.exports = (function() {
    angular.module('myApp').controller('flightCheckController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
        function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
        {
            var that = this,total = 0;
            var lanConfig = require('../../../../i18n/lanConfig');
            // console.log("父页面带来的数据"+JSON.stringify($stateParams));
            $scope.id =  $stateParams.id;
            $rootScope.endLoading();
            //模拟的查询数据
            $scope.flightData = {
                model:"",
                minorModel:"",
                creatDate: "",
                followDate: "",
                flightNo: "",
                fromStation:"",
                toStation:'',
                dOrI:""
            };
            $scope.checkItem = {
                health:false,
                technology:false,
                certificate:false,
                tool:false,
                carried:false
            };
            //输入的数据
            $scope.inputData = {
                watch:"",
                mobile:"",
                ipad:"",
                laptop:"",
                other:""
            };
            //装的PDF文件
            $scope.pdfList = [];
//返回
            $scope.goBack = function(){
                $rootScope.go('back');
            };

//初始化
            $scope.init = function (){
                $rootScope.startLoading();
                server.maocGetReq('flightCrewCheck/getCrewCheckTaskById', {
                id:$stateParams.id
                }).then(function (data) {
                    // console.log("查询到的数据"+JSON.stringify(data));
                    if (data.data.statusCode == 200) {
                        $scope.flightData =data.data.data[0];
                        $scope.getPdfByParams("PUBLIC");
                        $scope.requestDictionary();
                    };
                    $rootScope.endLoading();
                }).catch(function (error) {
                    console.log(error);
                    $rootScope.endLoading();
                });
            };
            $scope.init();

//提交跟机检查
            $scope.disabledFlage = false;
            $scope.submitFlightCheck = function(){
                $scope.disabledFlage = true;
            //    获取所有的自检项
                var checkParams = {};
                // 判断国内外航班
                if($scope.flightData.dOrI == 'I'||$scope.flightData.dOrI == 'R'){
                    //国际
                    checkParams = {
                        id:$scope.id,
                        // health:$scope.foreign.health,
                        // technology:$scope.foreign.technology,
                        // certificate:$scope.foreign.certificate,
                        // tool:$scope.foreign.tool,
                        // carried:$scope.foreign.carried,
                        checkContent:{
                            watch:$scope.inputData.watch,
                            mobile:$scope.inputData.mobile,
                            ipad:$scope.inputData.ipad,
                            laptop:$scope.inputData.laptop,
                            other:$scope.inputData.other,
                        }
                    };
                }else {
                    //国内
                    checkParams = {
                        id:$scope.id,
                        // health:$scope.domestic.health,
                        // technology:$scope.domestic.technology,
                        // certificate:$scope.domestic.certificate,
                        // tool:$scope.domestic.tool,
                        // carried:$scope.domestic.carried,
                    };
                };
                $rootScope.startLoading();
                // console.log("提交的数据"+JSON.stringify(checkParams));
                server.maocPostReq('flightCrewCheck/submitCrewCheckTask', checkParams,true).then(function (data) {
                    // console.log("接口返回的数据"+JSON.stringify(data));
                    if (data.data.statusCode === 200) {
                        alert("提交成功");
                        $scope.goBack();
                    };
                    $rootScope.endLoading();
                    $scope.disabledFlage = false;
                }).catch(function (error) {
                    $rootScope.endLoading();
                    alert("提交失败："+error);
                    $scope.disabledFlage = false;
                });
            };

 //    查看pdf逻辑:进行三次查询，先查字典，匹配对应的条目，再根据对应的条目查附件，最后查询公共PDF
 //           查字典
            $scope.requestDictionary = function(){
                server.maocGetReq('assembly/analysisDomainTypeByCode', {domainCode:'FLIGHT_CREW_CHECK_ATTACHMENT'}).then(function (data) {
                    $rootScope.endLoading();
                    // console.log("analysisDomainTypeByCode:"+JSON.stringify(data));
                    if (200 === data.data.statusCode) {
                        // console.log("111");
                        $scope.getCommonPdf(data.data.data[0].FLIGHT_CREW_CHECK_ATTACHMENT);
                    }
                }).catch(function (error) {
                    // $rootScope.endLoading();
                    console.log(error);
                });
            };

//根据参数查附件"NNG-SGN" "PUBLIC"
            $scope.getPdfByParams = function(PdfParams){
                server.maocGetReq('assembly/selectFileByCategoryAndSourceId', {category:'flightCrewCheckInternational',sourceId:PdfParams}).then(function (data) {
                    $rootScope.endLoading();
                    // console.log("selectFileByCategoryAndSourceId:"+JSON.stringify(data));
                    if (200 === data.data.statusCode) {
                        $scope.pdfList = $scope.pdfList.concat(data.data.data)||[];
                        // console.log("$scope.pdfList:"+JSON.stringify($scope.pdfList));
                    }
                }).catch(function (error) {
                    // $rootScope.endLoading();
                    console.log(error);
                });
            };

//遍历数据进行匹配并查询
            $scope.getCommonPdf = function(data){
                $scope.fromTo = $scope.flightData.fromStation + '-' + $scope.flightData.toStation;
                for(var i=0;i<data.length;i++){
                    if(data[i].TEXT.indexOf($scope.fromTo) != -1){
                        $scope.getPdfByParams(data[i].VALUE);
                        break;
                    };
                }
            };

//查看PDF
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
//不是pdf类型就做提示
            $scope.alertFileTypeTips = function(){
                alert('请前往PC端查看详情');
            };

        }])
})()