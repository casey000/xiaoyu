module.exports = angular.module('myApp').controller('nrcDetailController',
    ['$rootScope', '$scope', '$stateParams', 'server','$location','$localForage','$anchorScroll', 'configInfo', '$timeout', '$filter', 'b64ToBlob',
        function ($rootScope, $scope, $stateParams,  server,$location, $anchorScroll,$localForage, configInfo,$timeout, $filter, b64ToBlob) {
            $scope.hideApproverTitle = true;
            $rootScope.startLoading();
            if($stateParams.nrcId){
                $scope.nrcId = $stateParams.nrcId;
                $rootScope.nrcId = $stateParams.nrcId;
            }else{
                $scope.nrcId = $rootScope.nrcId;
            };
            if($stateParams.status){
                $scope.nrcStatus = $stateParams.status;
                $rootScope.nrcStatus = $stateParams.status;
            }else{
                $scope.nrcStatus = $rootScope.nrcStatus;
            };
            $scope.report = {
                nameAndId: '',
                approverName:'',
                approverSn:'',
                approverId:''
            };
            $scope.dataObj ={};
            $scope.isEdit =false;
            $scope.deleteReason ='';        //删除原因
            $scope.refuseReason ='';
            $scope.refuseReasonPend ='';
            $scope.showConfirmState = false;
            $scope.showRefuse = false;
            $scope.showRefusePend = false;
            $scope.needHelp = false;
            var ele=document.getElementById("scroll");
            var opneCard=document.getElementById("opneCard");
            var basicInfo=document.getElementById("basicInfo");
            var toolmr=document.getElementById("toolmr");
            var cws=document.getElementById("cws");
            var pend=document.getElementById("pend");
            var mr=document.getElementById("mr");
            var toCorrect=document.getElementById("toCorrect");
            var cc=document.getElementById("cc");
            var completeInfo=document.getElementById("completeInfo");
            var windowEl = angular.element(ele);
            var main = document.getElementsByClassName("section"); //文章主要内容
            var handler = function () {
                var iTop = ele.scrollTop;
                //楼层的联动
                var num = 0;
                for (var i = 0; i < main.length; i++) {
                    if ( (iTop + 50) >= main[i].offsetTop) {
                        num = i;
                    }
                };
                $scope.navIdx = num;
                $scope.clickNav = function(i){
                    if( i == 0){
                        ele.scrollTop = 0;
                    }
                    if( i == 1){
                        ele.scrollTop = opneCard.offsetHeight + 10;
                    }
                    if( i == 2){
                        ele.scrollTop = opneCard.offsetHeight + basicInfo.offsetHeight + 10;
                    }
                    if( i == 3){
                        //mr
                        ele.scrollTop = opneCard.offsetHeight + toolmr.offsetHeight + basicInfo.offsetHeight + 10;
                    }
                    if( i == 4){
                        //补充文件
                        ele.scrollTop = opneCard.offsetHeight + toolmr.offsetHeight + mr.offsetHeight  + basicInfo.offsetHeight + 30;
                    }
                    if( i == 5){
                        //推迟信息
                        ele.scrollTop = opneCard.offsetHeight + toolmr.offsetHeight + mr.offsetHeight  + basicInfo.offsetHeight + cws.offsetHeight+ 50;
                    }
                    if( i == 6){
                        //纠正措施
                        ele.scrollTop = opneCard.offsetHeight + toolmr.offsetHeight + mr.offsetHeight  + basicInfo.offsetHeight + cws.offsetHeight + pend.offsetHeight+ 50;
                    }
                    if( i == 7){
                        //cc
                        ele.scrollTop = opneCard.offsetHeight + toolmr.offsetHeight + mr.offsetHeight  + basicInfo.offsetHeight + cws.offsetHeight + pend.offsetHeight + toCorrect.offsetHeight+ 70;
                    }
                    if( i == 8){
                        //完工信息
                        ele.scrollTop = opneCard.offsetHeight + toolmr.offsetHeight + mr.offsetHeight  + basicInfo.offsetHeight + cws.offsetHeight + pend.offsetHeight + toCorrect.offsetHeight + cc.offsetHeight + 90;
                    }

                };

            };
            windowEl.on('scroll', $scope.$apply.bind($scope, handler));
            handler();
            NativeAppAPI.hideTabBar();
            $scope.navIdx = 0;
            $scope.isCreatNrc = false;
            $scope.navArr = [
                {
                    index:0,
                    name:'开卡信息'
                },
                {
                    index:1,
                    name:'方案信息'
                },
                {
                    index:2,
                    name:'工具航材'
                },
                {
                    index:3,
                    name:'MR'
                },
                {
                    index:4,
                    name:'补充文件'
                },
                {
                    index:5,
                    name:'推迟信息'
                },
                {
                    index:6,
                    name:'纠正措施'
                },
                {
                    index:7,
                    name:'CC'
                },
                {
                    index:8,
                    name:'完工信息'
                },
            ];
            $scope.oilEwisInfo = {
                showEwis : false,
                ewisInfo : {},
                ewisState : -1,
                selectedEwisIndex : -1,
                showOil : false,
                oilInfo : {},
                oilState : -1,//0新建 1编辑 2详情 -1无效
                selectedOilIndex : -1,//编辑或详情项目下标
                oilDTO:{},
                ewisDTO:{},
                isHasOil:'',
                isHasEwis:''
            };
            $scope.imgArr = [];
            $scope.imgArr2 = [];
            $scope.fileArr = [];  //要上传的二进制流
            // $scope.$on('$locationChangeStart', function() {
            //
            // });
            $scope.$on('$destroy', function() {
                OPENAPI.closeNrcdetail();
            });
            function initInfo() {
                OPENAPI.openNrcdetail();
                server.maocGetReq('/nrc/queryNrcById', {nrcId:$scope.nrcId}).then(function (data) {
                    $rootScope.endLoading();
                    if (200 == data.data.statusCode) {
                        $scope.dataObj = data.data.data[0];
                        if($scope.dataObj.nrcBase.nrcProcessStatus == 'APPROVED'){
                            server.maocGetReq('mr/findMrInfoByCardNoAndType',{cardNo:$scope.dataObj.nrcBase.nrcNo,workType:'NRC'}).then(function(result){
                                if (result.status == 200) {
                                    $scope.mrList = result.data.data;
                                }
                            }).catch(function(error){
                                console.log(error);
                            });
                        }


                        $scope.dataObj.nrcBase.aeType = $scope.dataObj.nrcBase.aeType == 1 ? '飞机':'发动机';
                        if($scope.dataObj.nrcBase.status == 1){
                            $scope.dataObj.nrcBase.status = 'OPEN'
                        }
                        if($scope.dataObj.nrcBase.status == 2){
                            $scope.dataObj.nrcBase.status = 'CLOSE'
                        }
                        if($scope.dataObj.nrcBase.skill == 1){
                            $scope.dataObj.nrcBase.skill = 'ME'
                        }
                        if($scope.dataObj.nrcBase.skill == 2){
                            $scope.dataObj.nrcBase.skill = 'AV'
                        }
                        if($scope.dataObj.nrcBase.skill == 3){
                            $scope.dataObj.nrcBase.skill = 'STR'
                        }
                        if($scope.dataObj.nrcBase.defect == "y"){
                            $scope.dataObj.nrcBase.defect = 'YES'
                        }
                        if($scope.dataObj.nrcBase.defect == "n"){
                            $scope.dataObj.nrcBase.defect = 'NO'
                        }
                        var itemCat = $scope.dataObj.nrcBase.itemCat;
                        switch (true) {
                            case itemCat == '1':
                                // $scope.dataObj.nrcBase.itemCat = '结构损伤类：STRUCTURE';
                                $scope.dataObj.nrcBase.itemCat = 'STRUCTURE';
                                break;
                            case itemCat == '2':
                                // $scope.dataObj.nrcBase.itemCat = '一般故障或缺陷：MINOR NRCFECT';
                                $scope.dataObj.nrcBase.itemCat = 'MINOR NRCFECT';
                                break;
                            case itemCat == '3':
                                // $scope.dataObj.nrcBase.itemCat = '检查或勤务:CHK/SVC';
                                $scope.dataObj.nrcBase.itemCat = 'CHK/SVC';
                                break;
                            case itemCat == '4':
                                // $scope.dataObj.nrcBase.itemCat = '附件监控：CM';
                                $scope.dataObj.nrcBase.itemCat = 'CM';
                                break;
                            case itemCat == '5':
                                // $scope.dataObj.nrcBase.itemCat = '附件监控：CM';
                                $scope.dataObj.nrcBase.itemCat = 'ACCESS';
                                break;
                            case itemCat == '6':
                                // $scope.dataObj.nrcBase.itemCat = '附件监控：CM';
                                $scope.dataObj.nrcBase.itemCat = 'COMPONENT';
                                break;
                            default:
                                break;
                        }
                        $scope.oilEwisInfo.isHasEwis = $scope.dataObj.nrcBase.isHasEwis;
                        $scope.oilEwisInfo.isHasOil = $scope.dataObj.nrcBase.isHasOil;
                        $scope.oilEwisInfo.oilDTO = $scope.dataObj.nrcBase.nrcOilList;
                        $scope.oilEwisInfo.ewisDTO = $scope.dataObj.nrcBase.nrcEwisList;
                        $scope.difPerson =  configInfo.userCode == $scope.dataObj.currentHandlerSn ? false : true;
                        var flawTypes = [
                                {
                                    name:'进入燃油箱 ENTER FUEL TANK',
                                    value:1
                                },
                                {
                                    name:'特殊接近 SPECIAL',
                                    value:2
                                },
                                {
                                    name:'顶升飞机 LIFT',
                                    value:3
                                },
                                {
                                    name:'试车',
                                    value:4
                                },
                                {
                                    name:'试大车',
                                    value:5
                                },
                                {
                                    name:'高空车',
                                    value:6
                                },
                                {
                                    name:'其他特殊要求 OTHER SPECIAL',
                                    value:7
                                },
                                {
                                    name:'N/A',
                                    value:8
                                },
                        ];
                        if($scope.dataObj.nrcBase.attentionType){
                            var backArr = $scope.dataObj.nrcBase.attentionType.split(',');
                            $scope.dataObj.nrcBase.attentionString = '';
                            for(var x = 0 ; x < backArr.length ; x++){
                                for(var j = 0 ; j < flawTypes.length ;j ++){
                                    if(backArr[x] == flawTypes[j].value){
                                        $scope.dataObj.nrcBase.attentionString +=   '<p>' + (Number(x) + 1)  + ' ' + flawTypes[j].name + '</p>'
                                    }

                                }
                            }
                        }
                        var suspendTypes = [
                            {
                                name:'TS',
                                selected:false,
                                value:1
                            },
                            {
                                name:'MATERIAL',
                                selected:false,
                                value:2
                            },
                            {
                                name:'SPEC.TOOLS',
                                selected:false,
                                value:3
                            },
                            {
                                name:'TIME LIMIT',
                                selected:false,
                                value:4
                            },
                            {
                                name:'其他OTHERS',
                                selected:false,
                                value:5
                            },
                        ];
                        if($scope.dataObj.nrcBase.suspending && $scope.dataObj.nrcBase.suspending.hoReason){
                            var horea = $scope.dataObj.nrcBase.suspending.hoReason.split(',');
                            $scope.dataObj.nrcBase.horea = '';
                            for(var x = 0 ; x < horea.length ; x++){
                                for(var y = 0 ; y < suspendTypes.length ; y++){
                                    if(suspendTypes[y].value == horea[x]){
                                        $scope.dataObj.nrcBase.horea +=   '<p>' + (Number(x) + 1)  + ' ' + suspendTypes[y].name + '</p>'

                                    }
                                }
                                if(horea[x] == "5"){
                                    $scope.dataObj.nrcBase.horea +='<p>' + $scope.dataObj.nrcBase.suspending.hoReasonOther+ '</p>'
                                }

                            }
                        }
                        var Attachments = $scope.dataObj.nrcBase.attachments;
                        var AllImgExt= ".jpg|.jpeg|.gif|.bmp|.png| "//全部图片格式类型
                        var images = [];
                        angular.forEach(Attachments,function (item,index) {
                            // var fileType = item.name.substr(item.name.lastIndexOf( ". ")).toLowerCase();
                            // var fileType = item.type.indexOf('image');
                            // if(typeof (item.content) != 'undefined' && AllImgExt.indexOf(fileType + "| ")!=-1) {
                            // if(typeof (item.content) != 'undefined' && fileType!=-1) {
                            if(item.type.indexOf('image') == '-1'){

                            }else{
                                if(typeof (item.content) != 'undefined') {
                                    $scope.imgArr.push(item);
                                    images.push(item.content);

                                    // var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                    // var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                    // var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                    // imgBlob.name = item.name.indexOf('down') == -1
                                    //     ? imgName + 'down' + imgType
                                    //     : item.name;
                                    // imgBlob.id = item.id;
                                    // $scope.fileArr.push(imgBlob);
                                    // $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                }
                            }

                        });
                        // var images= Attachments.map(function(item){
                        //     if(item.type.indexOf('image') != '-1') {
                        //         return item.content
                        //     }
                        // });
                        OPENAPI.loadImages({
                            images: images,
                            activeIndex: 0,
                            bgColor: "#000"
                        });

                        var Attachments2 = $scope.dataObj.nrcBase.nueAttachments;
                        angular.forEach(Attachments2,function (item,index) {
                            if(item.type.indexOf('image') == '-1'){

                            }else{
                                $scope.imgArr2.push(item)
                                // if(typeof (item.content) != 'undefined') {
                                //     var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                                //     var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                                //     var imgType = item.name.substring(item.name.lastIndexOf('.'));
                                //     imgBlob.name = item.name.indexOf('down') == -1
                                //         ? imgName + 'down' + imgType
                                //         : item.name;
                                //     imgBlob.id = item.id;
                                //     $scope.fileArr2.push(imgBlob);
                                //     $scope.imgArr2.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                                // }
                            }

                        });

                        // //2020/04/28  nrc详情补充
                        // if($scope.dataObj.nrcBase.nrcClose && JSON.stringify($scope.dataObj.nrcBase.nrcClose) !=='{}'){
                        //     var Attachments3 = $scope.dataObj.nrcBase.nrcClose.wsAttachmentList;
                        //     angular.forEach(Attachments3,function (item,index) {
                        //         if(item.type.indexOf('image') == '-1'){
                        //
                        //         }else{
                        //             $scope.imgArr3.push(item)
                        //         }
                        //
                        //     });
                        // }
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                    console.log(error);
                });


            }
            initInfo();
            $scope.showBig = function (img_arr, img_index) {

                var images_to_show = img_arr.map(function(item){
                    return item.content
                });
                OPENAPI.scanPhoto({
                    images: images_to_show,
                    activeIndex: img_index,
                    bgColor: "#000"}, img_index)

                $scope.addCloseEventListener();
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

            $scope.alertFileTypeTips = function(){
                alert('请前往PC端查看详情');
            };

            $scope.subTask = function (){
                $rootScope.go('nrcProgram', 'slideLeft', {nrcId: $scope.nrcId});
            };
            $scope.makeTask = function (){
                $rootScope.go('nrcProgram', 'slideLeft', {nrcId: $scope.nrcId});
            };
            $scope.editTask = function (){
                $rootScope.go('addNrc', 'slideLeft', {nrcId: $scope.nrcId});
            };
            $scope.delTask = function (){
                if($scope.dataObj.nrcBase.nrcNo){
                    $scope.showConfirmState = true;
                }else{
                    server.maocPostReq('nrc/deleteNrcById',{reason: '',id:$scope.nrcId},true).then(function (data) {
                        console.log(data,'12323');
                        $rootScope.endLoading();
                        if (200 == data.data.statusCode) {
                            api.alert({
                                msg: '删除成功'
                            },function(ret, err) {
                                $rootScope.go('back');
                            });
                        }
                    }).catch(function (error) {
                        $rootScope.endLoading();
                    });
                }
            };
            $scope.helpTask = function (){
                $scope.needHelp = true;
            };
            $scope.refuseTask = function (){
                $scope.showRefuse = true;

            };
            $scope.hideConfim = function () {
                $scope.showConfirmState = false;
            };
            $scope.hideRefuse = function () {
                $scope.showRefuse = false;
                $scope.showRefusePend = false;
            };
            $scope.cancelHelp = function () {
                $scope.needHelp = false;
            };
            $scope.helpSure = function () {
                console.log($scope.report);
                if(!$scope.report.approverId){
                    alert('请从下拉列表选择人，请勿填写不存在的人员');
                    return;
                }
                server.maocPostReq('nrc/transferNrcChecking',{rectPlanUpdatedId: $scope.report.approverId,nrcId:$scope.nrcId}).then(function (data) {
                    console.log(data,'12323');
                    $rootScope.endLoading();
                    if (200 == data.data.statusCode) {
                        api.alert({
                            msg: '求援成功'
                        },function(ret, err) {
                            $rootScope.go('back');
                        });
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.deleteSure = function () {
                if($scope.deleteReason == ''){
                    alert('原因必填');
                    return;
                }
                server.maocPostReq('nrc/deleteNrcById',{reason: $scope.deleteReason,id:$scope.nrcId},true).then(function (data) {
                    console.log(data,'12323');
                    $rootScope.endLoading();
                    if (200 == data.data.statusCode) {
                        api.alert({
                            msg: '删除成功'
                        },function(ret, err) {
                            $rootScope.go('back');
                        });
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.toProcess = function (){
                $rootScope.go(
                    'nrcfeedbak',
                    '',
                    {
                        nrcInfo:{},
                        itemId:$stateParams.processId
                    }
                );
              // alert('请去PC端进行反馈')
            };
            $scope.refuseSure = function () {
                if($scope.refuseReason.length > 500){
                    alert('备注不能大于500字')
                    return;
                }
                console.info($scope.refuseReason.length);
                $rootScope.startLoading();
                server.maocPostReq('nrc/rejectNrcEditing',{reason: $scope.refuseReason,id:$scope.nrcId},true).then(function (data) {
                    console.log(data,'12323');
                    $rootScope.endLoading();
                    if (200 == data.data.statusCode) {
                        api.alert({
                            msg: '驳回成功'
                        },function(ret, err) {
                            $rootScope.go('back');
                        });
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.refusePendFlow = function(){
                $scope.showRefusePend = true;
            };
            $scope.refusePend = function () {
                if($scope.refuseReasonPend.length > 500){
                    alert('备注不能大于500字')
                }
                $rootScope.startLoading();
                server.maocPostReq('nrc/rejectNrcChecking',{reason: $scope.refuseReasonPend,id:$scope.nrcId},true).then(function (data) {
                    console.log(data,'12323');
                    $rootScope.endLoading();
                    if (200 == data.data.statusCode) {
                        api.alert({
                            msg: '驳回成功'
                        },function(ret, err) {
                            $rootScope.go('back');
                        });
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.approvePend = function () {
                $rootScope.startLoading();
                server.maocPostReq('nrc/submitProcess',{id:$scope.nrcId},true).then(function (data) {
                    console.log(data,'12323');
                    $rootScope.endLoading();
                    if (200 == data.data.statusCode) {
                        api.alert({
                            msg: '审批通过成功'
                        },function(ret, err) {
                            $rootScope.go('back');
                        });
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            }

        }    
    ]);