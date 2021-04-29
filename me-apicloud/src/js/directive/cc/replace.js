angular.module('myApp')
    .directive('ccReplace', ['$rootScope','$filter',
        function ($rootScope,$filter) {
            return {
                restrict: "E",
                templateUrl: "cc/cc-replace.html",
                replace:true,
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
                link:link
            };
            function link($scope) {
                $scope.isFlag = false;
                $scope.source.cin = '';
                $scope.$watch("isBlur",function (newVal) {
                    if(newVal){
                        $scope.getMethod();
                    }
                });

                $scope.offPn = {
                    partno: $scope.source.offPn || '',
                    pn_typr:2
                };
                $scope.onPn = {
                    partno: $scope.source.onPn || '',
                    pn_typr:1
                };

                //$scope.$watch("offPn.partno",function(newVal){
                //    $scope.source.offPn = $scope.offPn.partno;
                //    //if(!$scope.$parent.$parent.$parent.isClearSn){
                //    //    $scope.source.offSn = '';
                //    //}else{
                //    //    $scope.$parent.$parent.$parent.isClearSn = false;
                //    //}
                //});
                $scope.offgouxin="";
                $scope.ongouxin="";
                $scope.ongouxinlist=[];
                $scope.onPosition=[];
                $scope.onPosition_f=false;
                $scope.offgouxinlist=[];
                $scope.offPosition=[];
                $scope.offPosition_f=false;
                $scope.$watchGroup(["source", 'onPn.partno', 'offPn.partno'],function(newVal){
                    if(!$scope.$parent.$parent.$parent.canEdit){
                        $scope.onPn.partno = $scope.source.onPn;
                        $scope.offPn.partno = $scope.source.offPn;
                    }else{
                        $scope.source.onPn = $scope.onPn.partno;
                        $scope.source.offPn = $scope.offPn.partno;
                    }

                });
               $scope.statusData = [
                    {name: '可用件', value: 'USED'},
                    {name: '不可用件', value: 'UNUSED'},
                    {name: '待观察件', value: 'WDISPOSE'}
                ];

                // $scope.ongouxinChange = function () {
                //     server.maocGetReq('cc/queryCinPosition', {
                //         acId: $scope.acid,
                //         pn: $scope.onPn.partno,
                //         cin: $scope.source.onCin || ""
                //     }).then(function (result) {
                //         $scope.onPosition=[];
                //         $scope.onPosition_f=false;
                //         if(result.data.statusCode==200){
                //             $scope.onPosition_f=true;
                //             for(var i in result.data.data){
                //                 $scope.onPosition.push(result.data.data[i].value);
                //             }
                //         }
                //         console.log(JSON.stringify(result));
                //     }).catch(function (error) {
                //         alert('失败!')
                //     });
                // };
                // $rootScope.gouxindiandian1 = function () {
                //     server.maocGetReq('cc/queryCin', {
                //         acId: $scope.acid,
                //         pn: $scope.onPn.partno
                //     }).then(function (result) {
                //         $scope.onoff.ongouxinlist=[];
                //         if(result.data.statusCode==200){
                //             for(var i in result.data.data){
                //                 $scope.onoff.ongouxinlist.push(result.data.data[i].cin);
                //             }
                //         }
                //
                //         console.log(JSON.stringify(result));
                //     }).catch(function (error) {
                //         alert('失败!')
                //     });
                // };
                $scope.offsn_blur=function(){
                    $scope.source.cin = '';
                    $scope.isBlur = true;
                    $rootScope.gouxindiandian2();
                    $scope.source.offPosition = '';
                    $scope.offPosition_f=false;

                }
                $scope.offgouxinChange = function () {
                    $scope.source.offPosition = '';
                    server.maocGetReq('cc/queryCinPosition', {
                        acId: $scope.acid,
                        pn: $scope.offPn.partno,
                        cin:$scope.source.cin || ""
                    }).then(function (result) {
                        $scope.offPosition=[];
                        $scope.offPosition_f=false;
                        if(result.data.statusCode==200){
                            $scope.offPosition_f=true;
                            for(var i in result.data.data){
                                $scope.offPosition.push(result.data.data[i].value);
                            }
                        }
                        console.log(JSON.stringify(result));
                    }).catch(function (error) {
                        alert('失败!')
                    });
                };
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
