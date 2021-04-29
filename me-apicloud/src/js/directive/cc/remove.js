angular.module('myApp')
    .directive('ccRemove', ['$rootScope', '$filter',
        function ($rootScope, $filter) {
            return {
                restrict: "E",
                templateUrl: "cc/cc-remove.html",
                replace: true,
                transclude: true,
                scope: {
                    source: "=",
                    submit: "&",
                    isBlur:'=',
                    getMethod:"&",
                    isDetail:"=",
                    acid: '=',
                    onoff:"="
                },
                link: link
            };
            function link($scope) {
                $scope.gouxinlist=[];
                $scope.inPosition=[];
                $scope.inPosition_f=false;
                $scope.source.cin = '';
                $scope.$watch("isBlur",function (newVal) {
                    if(newVal){
                        $scope.getMethod();
                    }
                });
                $scope.$watch("source.offPn",function (newVal) {
                    $scope.source.offPn = newVal;
                    //$scope.source.offSn = '';
                });
                $scope.offPn = {
                    partno: $scope.source.offPn || '',
                    pn_typr:2
                };

                $scope.$watchGroup(["source", 'offPn.partno'],function(newVal){
                    if(!$scope.$parent.$parent.$parent.canEdit){
                        $scope.offPn.partno = $scope.source.offPn;
                    }else{
                        $scope.source.offPn = $scope.offPn.partno;
                    }

                });

                $scope.statusData = [
                    {name: '可用件', value: 'USED'},
                    {name: '不可用件', value: 'UNUSED'},
                    {name: '待观察件', value: 'WDISPOSE'}
                ];
                $scope.offsn_blur=function(){
                    console.info('jinru')
                    $scope.source.cin = '';
                    $scope.isBlur = true;
                    $rootScope.gouxindiandian2();
                    $scope.source.offPosition = '';
                    $scope.inPosition_f=false;
                }
                $rootScope.gouxindiandian2 = function () {
                    server.maocGetReq('cc/queryCin', {
                        acId: $scope.acid,
                        pn: $scope.offPn.partno,
                        sn:$scope.source.offSn
                    }).then(function (result) {
                        $scope.onoff.offgouxinlist=[];
                        if(result.data.statusCode==200){

                            for(var i in result.data.data){
                                $scope.onoff.offgouxinlist.push(result.data.data[i].cin);
                            }
                            console.log($scope.onoff.offgouxinlist)
                        }


                    }).catch(function (error) {
                        alert('失败!')
                    });
                  };
                $scope.gouxinChange = function () {
                    $scope.source.offPosition = '';
                    server.maocGetReq('cc/queryCinPosition', {
                        acId: $scope.acid,
                        pn: $scope.offPn.partno,
                        cin: $scope.source.cin || ""
                    }).then(function (result) {
                        $scope.inPosition=[];
                        $scope.inPosition_f=false;
                        if(result.data.statusCode==200){
                            $scope.inPosition_f=true;

                            for(var i in result.data.data){
                                $scope.inPosition.push(result.data.data[i].value);
                            }
                        }
                        console.log(JSON.stringify(result));
                    }).catch(function (error) {
                        alert('失败!')
                    });
                };
                $scope.direcSubmit = function () {
                    console.info($scope.onoff.offgouxinlist);
                    if($scope.onoff.offgouxinlist.length == 0){
                        $scope.submit()
                    }else{
                        if($scope.source.cin == ''){
                            alert('此P/N下的构型为必填')
                        }else{
                            $scope.submit();
                        }
                    }
                }
            }
        }]);
