
module.exports = angular.module('myApp').controller('mrSearchController',
 ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter',
 function($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter) {
	var that = this;
	$rootScope.endLoading();
	$scope.timeId = $stateParams.timeId;
	 $scope.pnno = $stateParams.pnNo;
	 // console.log("查询到的数据"+JSON.stringify($stateParams));
	var pageSize = 20;

	var lanConfig = require('../../../../i18n/lanConfig');
	$scope.holderValue = "2位以上关键字";
	/*
	 *点击搜索按钮搜索
	 */
	$scope.clickBtnSearch = function(){
		$scope.pnListdropdown = false;
		var materialsearchTxt = $scope.searchVal;
		that.currentPage = 1;
		$scope.noMoreData = false;
		$scope.balanceInfo = [];

        var acReg = $stateParams.acReg;
        var station = angular.uppercase($stateParams.station) || '';
        // if (acReg !== "") {
        // 	if (acReg.indexOf("-") != -1) {
        //         acReg = acReg.replace("-","");
        //     }
        //     acReg = acReg.toUpperCase();
        //     station = station + ',' + acReg;
        // }

        if (acReg !== "" && (station !== 'SZXS' && station !== 'HGHS')) {

            if (acReg.indexOf("-") != -1) {
                acReg = acReg.replace("-","");
            }

            acReg = acReg.toUpperCase();
            station = station + ',' + acReg;
        }

		var param = {
			pageSize: pageSize,
			pageIndex: 1,
			inputValue: materialsearchTxt,
			station: station,
			isAccurate: $scope.isAccurate || false
		}
		that.curParam = param;

		if(!that.requesting){
			that.requesting = true; //防止在底部时同时执行nextPage
			$scope.searchBalanceInfo(param);
		}

	};
	/*
	 *获取下页的数据
	 */
	$scope.getNextPage = function() {
		if(!$scope.noMoreData && !that.requesting) {
			that.curParam.pageIndex = ++that.currentPage;

			if(Math.ceil(that.total / pageSize) >= that.curParam.pageIndex){
				that.requesting = true; //防止在底部时同时执行nextPage
				$scope.searchBalanceInfo(that.curParam);
			}else{
				$scope.noMoreData = true;
			}

		}
	}
	/**
	 * 搜索航材
	 * @param 用户输入(PN or PN名称)
	 *
	 */
	$scope.searchBalanceInfo = function(param){

        if (param.inputValue.length < 2) {
            that.requesting = false;
            alert("关键字小于二位");
            return;
        }

		if(param.inputValue){
			$rootScope.startLoading();
			server.maocGetReq('mr/getMe2MRMaximoInventoryBalanceInfo', param).then(function(data) {
				that.requesting = false;
				if(200 === data.status) {
					that.total = data.data.total;
					for(var i in data.data.data){
						data.data.data[i].station = $stateParams.station.toUpperCase();
						data.data.data[i].cardType = $stateParams.cardType;
					}
					$scope.balanceInfo = data.data.data && $scope.balanceInfo.concat(data.data.data) || [];
					// console.log("查询到的数据"+JSON.stringify($scope.balanceInfo));
					if(Math.ceil(that.total / pageSize) == param.pageIndex){
						$scope.noMoreData = true;
					}
				}
				if(data.data.dataSize==0){
					$rootScope.endLoading();
				}

			}).catch(function(error) {
				console.log(error);
				$rootScope.endLoading();
			});
		}else{
			$scope.holderValue = lanConfig.paramLimit;
			that.requesting = false;
		}
	};

	 if($scope.pnno){
		 $scope.clickBtnSearch($scope.pnno);
	 }
	//输入搜索条件后回车返回搜索结果
	//$scope.enter = function(ev,materialsearchTxt){
    //
	//	if(ev.keyCode == 13){
	//		ev.preventDefault();
	//		$scope.clickBtnSearch(materialsearchTxt);
	//	}
	//};
	//点击加号航材数量加一
	$scope.plusmaterial = function(stockNumber,materialnumber,item,num2){
		var baseNum, baseNum1, baseNum2;
		var precision;// 精度
		try {
			baseNum1 = materialnumber.toString().split(".")[1].length;
		} catch (e) {
			baseNum1 = 0;
		}
		try {
			baseNum2 = num2.toString().split(".")[1].length;
		} catch (e) {
			baseNum2 = 0;
		}

		baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
		precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;

		if(materialnumber<=stockNumber-1){
			item.needMaterialNumber = parseFloat(((materialnumber * baseNum + num2 * baseNum) / baseNum).toFixed(precision));
		}else if(stockNumber-1<materialnumber<stockNumber){
			item.needMaterialNumber = parseFloat(stockNumber);
		};

	};
	//点击减号航材数量减一
	$scope.minusmaterial = function(stockNumber,materialnumber,item,num2){
		//console.log('aaaaa')
		var baseNum, baseNum1, baseNum2;
		var precision;// 精度
		try {
		    baseNum1 = materialnumber.toString().split(".")[1].length;
		} catch (e) {
		    baseNum1 = 0;
		}
		try {
		    baseNum2 = num2.toString().split(".")[1].length;
		} catch (e) {
		    baseNum2 = 0;
		}

		baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
		precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
		if(item.needMaterialNumber>1){
			item.needMaterialNumber = parseFloat(((materialnumber * baseNum - num2 * baseNum) / baseNum).toFixed(precision));
		}else{
			item.needMaterialNumber = 0;
		}

	};

	//input框输入航材量超过库存时候清零
	$scope.overStock = function(item,event){
		var tempQty = item.needMaterialNumber;
			tempQty_1 = tempQty && tempQty.slice(0, tempQty.length-1);
		if(!tempQty_1 && /\./g.test(tempQty)){ //小数点不能点首位
			item.needMaterialNumber = '';
		}else if(/\./g.test(tempQty_1)&& tempQty.slice(-1)=='.'){ //已经输入过点不能再次输入
			item.needMaterialNumber = tempQty_1;
		}else if(tempQty && tempQty.substring(0,2)=='00'&&tempQty.indexOf('.')==-1){
			item.needMaterialNumber = '0'
		}else{
			item.needMaterialNumber = tempQty &&　tempQty.replace(/[^0-9\.]/g, '');
		}
		//input框输入航材量超过库存时候清零
		if(item.needMaterialNumber > Number(item.availableQty)){
			item.needMaterialNumber = 0;
		};
		if(typeof String(tempQty).split('.')[1] != "undefined" && String(tempQty).split('.')[1].length>2){
			item.needMaterialNumber = item.needMaterialNumber.substring(0,String(tempQty).split('.')[0].length+3)
		};


	};

	 //搜索件号功能
	 $scope.pnListdropdown = false;
	 $scope.pnList = [];
	 $scope.pnInputChange = function () {
		 // console.log("阿巴阿巴阿巴"+JSON.stringify($scope.searchVal));
		 //当输入的内容大于三个字符
		 if($scope.searchVal && $scope.searchVal.length > 1 ){
			 var getParam ={
				 pn:$scope.searchVal
			 }
			 server.maocGetReq('nrc/findMaximoItem', getParam).then(function (data) {
				 if (200 === data.status) {
					 $scope.pnList  = data.data.data || [];
					 $scope.pnListdropdown = true;
				 }else {
					 $scope.pnListdropdown = false;
				 };
			 }).catch(function (error) {
				 console.log(error);
			 });
		 }else {
			 //    当输入的内容为空
			 setTimeout(function () {
				 $scope.$apply(function(){
					 $scope.pnList = [];
					 $scope.pnListdropdown = false;
					 $scope.balanceInfo = [];
				 })
			 },500)
		 }
	 };

	 //监视输入的动态内容
	 $scope.$watch('searchVal',function (n,o) {
		 if (typeof (n) == 'undefined') {
			 return;
		 };
		 $scope.pnInputChange();
	 });

	 //当点击下拉选择
	 $scope.selectPn = function (selectedPn) {
		 console.log("选择选择"+JSON.stringify(selectedPn));
		 //清空并关闭下拉
		 // queryJSON.partNo = selectedPn;
		 $scope.searchVal = selectedPn;
		 $scope.balanceInfo = [];
		 setTimeout(function(){
			 $scope.pnList = [];
			 $scope.pnListdropdown = false;
			 $scope.clickBtnSearch();
		 } ,500)

	 };


}
]);
