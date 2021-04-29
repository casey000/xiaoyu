angular.module('myApp')
    .directive('ccInstall', ['$rootScope', '$filter',
        function ($rootScope, $filter) {
            return {
                restrict: "E",
                templateUrl: "cc/cc-install.html",
                replace: true,
                transclude: true,
                link: link,
                scope: {
                    submit: '&',
                    source: '=',
                    acid: '=',
                    onoff:"="
                }
            };
            function link($scope) {
                $scope.nogouxin="";
                $scope.onPn = {
                    partno: $scope.source.onPn || '',
                    pn_typr:1
                };
                $scope.inPosition=[];
                $scope.inPosition_f=false;
                $scope.source.onCin = '';
                $scope.$watchGroup(["source", 'onPn.partno'],function(newVal){
                    if(!$scope.$parent.$parent.$parent.canEdit){
                        $scope.onPn.partno = $scope.source.onPn;
                    }else{
                        $scope.source.onPn = $scope.onPn.partno;
                    }

                });
                $scope.gouxinChange = function () {
                    server.maocGetReq('cc/queryCinPosition', {
                        acId: $scope.acid,
                        pn: $scope.onPn.partno,
                        cin: $scope.source.onCin || ""
                    }).then(function (result) {
                        $scope.inPosition=[];
                        $scope.inPosition_f=false;
                        if(result.data.statusCode==200){
                            $scope.inPosition_f=true;

                            for(var i in result.data.data){
                                $scope.inPosition.push(result.data.data[i].value);
                            }
                        }
                    }).catch(function (error) {
                        alert('失败!')
                    });
                };
                $rootScope.gouxindiandian1 = function () {
                    server.maocGetReq('cc/queryCin', {
                        acId: $scope.acid,
                        pn: $scope.onPn.partno
                    }).then(function (result) {
                        $scope.onoff.ongouxinlist=[];
                            if(result.data.statusCode==200){

                                for(var i in result.data.data){
                                    $scope.onoff.ongouxinlist.push(result.data.data[i].cin);
                                }
                            }

                      console.log(JSON.stringify(result));
                    }).catch(function (error) {
                        alert('失败!')
                    });
                };
                $scope.direcSubmit = function () {
                    if($scope.onoff.ongouxinlist.length == 0){
                        $scope.submit()
                    }else{
                       if($scope.source.onCin == ''){
                           alert('此P/N下的构型为必填')
                       }else{
                           $scope.submit();
                       }
                    }
                }
            }
        }]);
