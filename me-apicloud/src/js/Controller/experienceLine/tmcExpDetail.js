module.exports = angular.module('myApp')
    .controller('tmcExpDetailController', ['$rootScope', '$scope', '$stateParams', 'server','b64ToBlob' ,function ($rootScope, $scope, $stateParams, server,b64ToBlob) {
        NativeAppAPI.hideTabBar();
        $rootScope.endLoading();
        $scope.detId = $stateParams.id;
       $scope.isEdit = $stateParams.isEdit;
       // $rootScope.scalEnabled = true;
       $scope.info ={};
       $scope.praiseNum = 0;
       $scope.author = '';
       $scope.imgArr = [];
       $scope.fileArr = [];  //要上传的二进制流
        //安卓返回键
        var time = window.setInterval(function () {
            if (typeof api !== 'undefined') {
                api.addEventListener({
                    name: 'angularKeyback'
                }, function(ret, err){
                    $scope.goBack();
                });
                window.clearInterval(time);
            }
        }, 20);
        $scope.$on('$destroy', function() {
            OPENAPI.closeTMCdetail();
        });
       $scope.init = function () {
           OPENAPI.openTMCdetail();
           $rootScope.startLoading();
           server.maocGetReq('tmcExp/getTmcExperienceById', {id: $stateParams.id}).then(function (data) {
               if (data.status === 200) {
                   $scope.info = data.data.data[0];
                   $scope.info.keyArr = [];
                   if($scope.info.keyword.indexOf(',') != '-1'){
                       $scope.info.keyArr =  $scope.info.keyword.split(',')
                   }else{
                       $scope.info.keyArr[0] = $scope.info.keyword
                   }
                    console.info($scope.info.keyArr);
                   var Attachments = $scope.info.attachments;
                   var AllImgExt= ".jpg|.jpeg|.gif|.bmp|.png| ";//全部图片格式类型
                   angular.forEach(Attachments,function (item,index) {
                       // var fileType = item.name.substr(item.name.lastIndexOf( ". ")).toLowerCase();
                       // var fileType = item.type.indexOf('image');
                       // if(typeof (item.content) != 'undefined' && AllImgExt.indexOf(fileType + "| ")!=-1) {
                       // if(typeof (item.content) != 'undefined' && fileType!=-1) {
                       // if(item.type.indexOf('image') == '-1'){
                       if( AllImgExt.indexOf(item.type + "|") == '-1'){
                            console.log(AllImgExt.indexOf(item.type + "|"))
                       }else{
                           console.log('是图片')
                           if(typeof (item.content) != 'undefined') {
                               // $scope.imgArr.push(item);

                               var imgBlob = b64ToBlob(item.content, 'image/jpeg');
                               var imgName = item.name.substring(0, item.name.lastIndexOf('.'));
                               var imgType = item.name.substring(item.name.lastIndexOf('.'));
                               imgBlob.name = item.name.indexOf('down') == -1
                                   ? imgName + 'down' + imgType
                                   : item.name;
                               imgBlob.id = item.id;
                               $scope.fileArr.push(imgBlob);
                               $scope.imgArr.push(URL.createObjectURL(b64ToBlob(item.content, 'image/*')));
                           }
                       }

                   });
               }
               // if (data.data.dataSize == 0) {
               $rootScope.endLoading();
               // }
           }).catch(function (error) {
               $rootScope.endLoading();
           });
       };
       $scope.init();
       $scope.goBack = function(){
           // $rootScope.scalEnabled = false;
           // document.getElementById('scalEnabledMeta').setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no');
           $rootScope.go('back')

       };
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
