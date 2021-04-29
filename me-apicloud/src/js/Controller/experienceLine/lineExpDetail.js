module.exports = angular.module('myApp')
    .controller('lineExpDetailController', ['$rootScope', '$scope', '$stateParams', 'server','b64ToBlob' ,function ($rootScope, $scope, $stateParams, server,b64ToBlob) {
        NativeAppAPI.hideTabBar();
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
            OPENAPI.closelineExpdetail();
        });
       $scope.init = function () {
           OPENAPI.openlineExpdetail();
           $rootScope.startLoading();
           server.maocGetReq('airLineExp/getAirLineExpById', {id: $scope.detId,isEdit:$scope.isEdit}).then(function (data) {
               if (data.status === 200) {
                   $scope.info = data.data.data[0];
                   var report = $scope.info.participantUserVOS;
                   for (var i in report){
                       // $scope.author += report[i].name + '(' + report[i].sn + ')';
                       $scope.author += report[i].name;
                       if (i < report.length - 1) {
                           $scope.author += ',';
                       }
                   };
                   $scope.info.praiseNum = $scope.info.praiseNum ? $scope.info.praiseNum : 0;
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
       $scope.praise = function () {
           if(!$scope.info.isPraised){
               server.maocPostReq('assembly/updatePraise', {id:$scope.info.id,type:'airlineExp'}).then(function (result) {
                   if(result.data.statusCode == '200'){
                       $scope.info.isPraised = true;
                       $scope.info.praiseNum ++;
                   }

               }).catch(function (error) {
                   alert('点赞失败');

               });
           }else{
               alert('每个人只能点赞一次');
           }

       }


    }
    ]);
