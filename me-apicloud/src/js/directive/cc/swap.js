angular.module('myApp')
    .directive('ccSwap', ['$rootScope','$filter', '$timeout',
        function ($rootScope, $filter, $timeout) {
            return {
                restrict: "E",
                templateUrl: "cc/cc-swap.html",
                replace:true,
                transclude: true,
                scope: {
                    source: "=",
                    submit: "&",
                    acid: '=',
                    onoff:"="
                },
                link:link
            };
            function link($scope) {
                /**
                 * 搜索AC
                 */
                $scope.source.cin = '';
                $scope.source.onCin = '';
                $scope.offgouxin="";
                $scope.ongouxin="";
                $scope.ongouxinlist=[];
                $scope.onPosition=[];
                $scope.onPosition_f=false;
                $scope.offgouxinlist=[];
                $scope.offPosition=[];
                $scope.offPosition_f=false;
                $scope.isSelectAc=false;
                $scope.onacId=$scope.source.onAcId;
                if($scope.source.onAcId!=""){
                    $scope.isSelectAc=true;
                }
                $scope.getAc = function(){
                    if($scope.source.onAc){
                        $scope.dropdownAc = true;
                        $scope.loadAc = true; //请求列表时显示loading
                        $scope.acList = [];
                        server.maocGetReq('aircraft/findMiniSpec', {
                            acNo: $scope.source.onAc,
                            // pageIndex: 1,
                            // pageSize: 10
                        }).then(function(data) {
                            if(200 === data.status) {
                                $scope.acList = data.data.data || [];
                            }
                            $scope.loadAc = false;
                        }).catch(function(error) {
                            console.log(error);
                            $scope.loadAc = false;
                        });
                    }else{
                        $scope.dropdownAc = false;
                    }
                }

                $scope.hideDrop =function(){
                    $timeout(function(){
                        $scope.dropdownAc = false;
                    }, 400)

                    $scope.haveAC = true;
                }
                /*选择航站*/
                $scope.selectAc = function(ac,obj){
                    console.log(JSON.stringify(obj));
                    $scope.onacId=obj.acId;
                    $scope.source.onAc = ac;
                    $scope.isSelectAc=true;
                }

                $scope.offPn = {
                    partno: $scope.source.offPn || '',
                    pn_typr:2
                };
                $scope.onPn = {
                    partno: $scope.source.onPn || '',
                    pn_typr:1
                };

                //$scope.$watch("onPn.partno",function(newVal){
                //    $scope.source.onPn = $scope.onPn.partno;
                //});
                //$scope.$watch("offPn.partno",function(newVal){
                //    $scope.source.offPn = $scope.offPn.partno;
                //});

                $scope.$watchGroup(["source", 'onPn.partno', 'offPn.partno'],function(newVal){
                    if(!$scope.$parent.$parent.$parent.canEdit){
                        $scope.onPn.partno = $scope.source.onPn;
                        $scope.offPn.partno = $scope.source.offPn;
                    }else{
                        $scope.source.onPn = $scope.onPn.partno;
                        $scope.source.offPn = $scope.offPn.partno;
                    }

                });

                $scope.offgouxinChange = function () {
                    $scope.source.offPosition="";
                    server.maocGetReq('cc/queryCinPosition', {
                        acId: $scope.acid,
                        pn: $scope.offPn.partno,
                        cin: $scope.source.cin || ""
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
                        pn: $scope.offPn.partno
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


                $scope.ongouxinChange = function () {
                    $scope.source.onPosition="";
                    server.maocGetReq('cc/queryCinPosition', {
                        acId: $scope.onacId,
                        pn: $scope.onPn.partno,
                        cin:  $scope.source.onCin || ""
                    }).then(function (result) {
                        $scope.onPosition=[];
                        $scope.onPosition_f=false;
                        if(result.data.statusCode==200){
                            $scope.onPosition_f=true;
                            for(var i in result.data.data){
                                $scope.onPosition.push(result.data.data[i].value);
                            }
                        }
                        console.log(JSON.stringify(result));
                    }).catch(function (error) {
                        alert('失败!')
                    });
                };
                $rootScope.gouxindiandian1 = function () {
                    if(!$scope.onacId){
                        alert("请先选择飞机。");
                        $scope.onPn.partno="";
                        return;
                    }
                    server.maocGetReq('cc/queryCin', {
                        acId: $scope.onacId,
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
                    console.info($scope.onoff.offgouxinlist.length);
                    console.info($scope.onoff.ongouxinlist.length);
                    if($scope.onoff.offgouxinlist.length == 0 && $scope.onoff.ongouxinlist.length == 0){
                        $scope.submit()
                    }
                    if($scope.onoff.offgouxinlist.length > 0 && $scope.onoff.ongouxinlist.length == 0){
                        if($scope.source.cin == ''){
                            alert('OFF此P/N下的构型为必填')
                            return;
                        }else{
                            $scope.submit();
                        }
                    }
                    if($scope.onoff.offgouxinlist.length == 0 && $scope.onoff.ongouxinlist.length > 0){
                        if($scope.source.onCin == ''){
                            alert('ON此P/N下的构型为必填');
                            return;
                        }else{
                            $scope.submit();
                        }
                    }
                    if($scope.onoff.offgouxinlist.length > 0 && $scope.onoff.ongouxinlist.length > 0){

                        if($scope.source.cin == ''){
                            alert('OFF此P/N下的构型为必填');
                            return;
                        }
                        if($scope.source.onCin == ''){
                            alert('ON此P/N下的构型为必填');
                            return;
                        }
                        $scope.submit();

                    }


                }


            }
        }]);

