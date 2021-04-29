module.exports = angular.module('myApp').controller('nrcTaskController',
    ['$rootScope', '$scope', '$stateParams', 'server','$location','$localForage','$anchorScroll', 'configInfo', '$timeout', '$filter', 'b64ToBlob',
        function ($rootScope, $scope, $stateParams,server,$location, $anchorScroll,$localForage, configInfo,$timeout, $filter, b64ToBlob) {

            if($stateParams.nrcId){
                $scope.nrcId = $stateParams.nrcId;
                $rootScope.nrcId = $stateParams.nrcId;
            }else{
                $scope.nrcId = $rootScope.nrcId;
            };
            $scope.info = {

                program:{
                    nrcTask:{
                        chn:'',
                        en:'',
                        mrRequest:'',
                        repIpc:'',
                        interval:'',
                        toolDto:[],
                        mrDto:[],
                        fh:'',
                        fc:'',
                        aa:'',
                        cc:'',
                        days:'',
                        status:'',
                        revNo:'',
                    },
                }
            };
            server.maocGetReq('nrcTask/queryTaskByNrcId', {nrcId:$scope.nrcId}).then(function (data) {
                if (200 == data.data.statusCode) {
                    $scope.fileArrTask = [];
                    $scope.imgArrTask = [];
                    if(data.data.data[0].revNo == '0' && data.data.data[0].status == "EDITING"){
                        $scope.taskEdit = true;
                    }else{
                        $scope.taskEdit = false;
                    }
                    console.log(data.data.data[0]);
                    $scope.addNrctask = true;
                    $scope.nrcTaskNo = data.data.data[0].nrcTaskNo;
                    $scope.info.program.nrcTask.nrcTaskNo = data.data.data[0].nrcTaskNo;
                    $scope.nrcTaskId = data.data.data[0].id;
                    $scope.info.program.nrcTask.chn = data.data.data[0].executeChn;
                    $scope.info.program.nrcTask.en = data.data.data[0].executeEn;
                    $scope.info.program.nrcTask.interval = data.data.data[0].firstLast;
                    var fh , fc , aa , cc , days;
                    for (var i = 0 ,len = data.data.data[0].nrcTaskIntervalList.length; i < len; i++){
                        if(data.data.data[0].nrcTaskIntervalList[i].intUnit == 'FH'){
                            fh = data.data.data[0].nrcTaskIntervalList[i].intValue;
                        }
                        if(data.data.data[0].nrcTaskIntervalList[i].intUnit == 'FC'){
                            fc = data.data.data[0].nrcTaskIntervalList[i].intValue;
                        }
                        if(data.data.data[0].nrcTaskIntervalList[i].intUnit == 'A'){
                            aa = data.data.data[0].nrcTaskIntervalList[i].intValue;
                        }
                        if(data.data.data[0].nrcTaskIntervalList[i].intUnit == 'C'){
                            cc = data.data.data[0].nrcTaskIntervalList[i].intValue;
                        }
                        if(data.data.data[0].nrcTaskIntervalList[i].intUnit == 'DAYS'){
                            days = data.data.data[0].nrcTaskIntervalList[i].intValue;
                        }
                    }
                    $scope.info.program.nrcTask.fh = fh || '';
                    $scope.info.program.nrcTask.fc = fc || '';
                    $scope.info.program.nrcTask.aa = aa || '';
                    $scope.info.program.nrcTask.cc = cc || '';
                    $scope.info.program.nrcTask.days = days || '';
                    $scope.info.program.nrcTask.status = data.data.data[0].status;
                    $scope.info.program.nrcTask.revNo = data.data.data[0].revNo;
                    $scope.info.program.nrcTask.nueAttachments = data.data.data[0].nueAttachments;
                    console.info($scope.info.program.nrcTask.interval,'$scope.info.program.nrcTask.interval')
                    $scope.info.program.nrcTask.mrRequest = data.data.data[0].mtrYn;
                    var Attachments = data.data.data[0].nueAttachments;
                    var AllImgExt= ".jpg|.jpeg|.gif|.bmp|.png| "//全部图片格式类型
                    angular.forEach(Attachments,function (item,index) {
                        // var fileType = item.name.substr(item.name.lastIndexOf( ". ")).toLowerCase();
                        // var fileType = item.type.indexOf('image');
                        console.info(item.type);
                        console.info(item.type.indexOf('image'));
                        if(item.type.indexOf('image') == '-1'){

                        }else{
                            if(typeof (item.content) != 'undefined') {
                                var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                imgBlob.name = item.name.indexOf('down') == -1
                                    ? imgName + 'down' + imgType
                                    : item.name;
                                imgBlob.id = item.id;
                                $scope.fileArrTask.push(imgBlob);
                                $scope.imgArrTask.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));


                            }
                        }

                    });
                    console.info($scope.fileArrTask,'file');
                    console.info($scope.imgArrTask,'img');

                    if(data.data.data[0].mtrYn == 'y'){
                        $scope.info.program.nrcTask.repIpc = data.data.data[0].mtrIpc;

                        var toolDto = [] , mrDto = [] ;
                        for(var j = 0 , length = data.data.data[0].nrcMtrList.length; j<length ;j++){
                            if(data.data.data[0].nrcMtrList[j].mrType == '1'){
                                toolDto.push(data.data.data[0].nrcMtrList[j])
                            }
                            if(data.data.data[0].nrcMtrList[j].mrType == '0'){
                                mrDto.push(data.data.data[0].nrcMtrList[j])
                            }
                        }
                        $scope.info.program.nrcTask.toolDto = toolDto;
                        $scope.info.program.nrcTask.mrDto = mrDto;
                    }

                }
                $rootScope.endLoading();

            }).catch(function (error) {
                alert('NRCTASK接口服务异常，请联系管理员');
                $rootScope.endLoading();
                $scope.addNrctask = false;

            });
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