
module.exports = angular.module('myApp').controller('mrAddController', 
 ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter',
 function($rootScope, $scope, $stateParams, server, $localForage, configInfo,$filter) {
	var isCreateData = false;
	var timeId = $stateParams.timeId;
	 $scope.fromIndex=$stateParams.fromIndex;
	$scope.lm_data=true;
	 $scope.sapTaskId=$stateParams.sapTaskId||$stateParams.searchTxt.sapTaskId;
    $scope.card_data={
		cardType:$stateParams.searchTxt.workType,
	 cardNo: $stateParams.searchTxt.cardNo,
		workPackageNo:$stateParams.searchTxt.workPackageNo,
		workOrderId:$stateParams.searchTxt.workOrderId,
	 isadd:$stateParams.searchTxt.isadd,
	};
	$scope.timeId = timeId; //添加航材时传参用
	$rootScope.isMrList = false;
	$scope.today = $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm');
	$scope.mrInfo={
		is_bool:false,
		acInfoFlage : true,
		acType:""
	};


	 if($stateParams.searchTxt.hasOwnProperty('station')){
		 $scope.mrInfo.lineJobId=$stateParams.searchTxt.workPackageNo;
		 $scope.mrInfo.acType="a/c";
			 if(!!$stateParams.searchTxt && !!$stateParams.searchTxt.acReg && $stateParams.searchTxt.acReg != 'undefined'){
			     //有飞机号表示从航线进入
                 $scope.acInfoFlage = true;
                 $scope.mrInfo.acInfo=$stateParams.searchTxt.acReg;
             }else {
                 //没有飞机号表示从航站进入
				 $scope.mrInfo.acInfoFlage = false;
				 $scope.mrInfo.acType = "E";
                 $scope.mrInfo.acInfo= $stateParams.assetNum;
             };

		 // $scope.mrInfo.is_bool=true;
		 $scope.mrInfo.station=$stateParams.searchTxt.station;
		 $scope.mrInfo.requireDate =   new Date($filter('date')($stateParams.searchTxt.jobDate, "yyyy/MM/dd HH:mm"));
	}else {
		 $scope.mrInfo.requireDate = new Date( $filter('date')($scope.today));
	 }
	var lanConfig = require('../../../../i18n/lanConfig');
	$scope.holderValue = lanConfig.inputName;
	 $scope.hideApproverTitle = true;
	/**
	 * 获取详情数据，传入timeId从本地获取
	 * 
	 */
	 if (typeof mrDataBase == "undefined") {
		 mrDataBase =  $localForage.createInstance({
			 name: (configInfo.userCode||'noUser')+'_nosubmit'
		 });
	 }

	// 从本地获取对应的值
	mrDataBase.getItem(timeId).then(function(value) {
		// console.log("查询到存在本地的数据"+JSON.stringify(value));
		if(value){
			$scope.card_data=value.searchTxt;
			if(value.requireDate){				//设置时间，如果已经有就用已有的，没有就用当天的
				value.requireDate = new Date(value.requireDate);
			}else{
				value.requireDate = $scope.mrInfo.requireDate;
			}
			$scope.nameAndId = value.nameAndId;		//设置人名和工号组件的初始值
		    $scope.mrInfo = value;					//最后把本地的值赋给页面用到的一个主字段
			// $scope.mrInfo.item = modeSelectData1;
			//把sapTaskId 放到里面
			if(!!$scope.sapTaskId){
				value.sapTaskId = $scope.sapTaskId;
			};
			// console.log("查询到的数据"+JSON.stringify($scope.mrInfo));
		    //验证requireDate是否正确
		    $scope.checkDate();
		    
		    //以下两个长度在验证输入的时候用到
		    $scope.cardNoLen = value.cardNo && value.cardNo.length || 0; //初始时cardno的长度
		    $scope.acInfoLen = value.acInfo && value.acInfo.length || 0; //初始时acInfo的长度

		}else{
			
			mrDataBase.length().then(function(numberOfKeys) {
				if(!numberOfKeys){
					$localForage.removeItem('noSubmitNumber');
				}

			})
						
		}
		
		
	}).catch(function(err) {
	    // This code runs if there were any errors
	    console.log(err);
	});

	$rootScope.endLoading();

	/**
	 * 删除一条航材
	 * 
	 */
	$rootScope.deleteAdd = function(event, index){
		angular.element(event.currentTarget).parent().remove();
		$scope.mrInfo.item.splice(index, 1);
	}
	
	//启动扫码
	$scope.scanLineCode = function () {
		NativeAppAPI.scanLineCode({'callBackfunction':"setQrCode"});
	}
	
	/**
	 * 获取me card no
	 * @param wo no.
	 * 
	 */
	$scope.getMeCardNo = function(param){
		$scope.mrInfo.worknoTxt = param;
		$rootScope.startLoading();
		server.maocGetReq('mr/getMe2MRBarcode/' + param).then(function(data) {
			if(200 === data.status) {				
				$scope.cardNoInfo = data.data.data[0];
				angular.extend($scope.mrInfo, $scope.cardNoInfo);
				$scope.mrInfo.cardType = 'LM' + $scope.mrInfo.cardType;
				$scope.mrInfo.acInfo = $scope.cardNoInfo.tail || $scope.cardNoInfo.engSn;
				//workno根据带出来的tail/eng改变对应的button的颜色
				if($scope.cardNoInfo.tail){
					$scope.mrInfo.acType = 'a/c';   				
				}else{
					$scope.mrInfo.acType = 'eng';
				}
			}else{
				$scope.cardNoError = data.data;
			}
			$rootScope.endLoading(); 
		}).catch(function(error){
			return error;
		});
	};
	window.getMeCardNo = $scope.getMeCardNo; //全局方法开放给ios，Android使用
	
	/**
	 * require date小于当前时间时，
	 * 重设为当前时间
	 */
	$scope.checkDate = function () {
		var curTime = new Date($scope.today.replace(/-/g, '/') + ' 00:00:00');
	    if ($scope.mrInfo.requireDate < curTime) {
	        //$scope.mrInfo.requireDate = null;
	        $scope.showDateTip = true;
	    }else{
	    	$scope.showDateTip = false;
	    }
	};
	
	
	/**
	 * 提交表单数据
	 * @params {表单内容}
	 * 
	 */
	//提交成功标志
	$scope.submitimg = false;

	function submit(mrInfo){
		$scope.submitimg = true;
		//禁用提交按钮
		$scope.myForm.$valid = false;
		$rootScope.startLoading();
		var params = angular.copy(mrInfo);
		//params.approverName = mrInfo.approverName;
		//params.approverSn = mrInfo.approverSn;

		if(angular.isDate(params.requireDate)){
			params.requireDate = Date.parse(params.requireDate);
		};

		params.sapTaskId = $stateParams.sapTaskId;

		var localParams = angular.copy(params);
		/**
		 * no,timeId,nameAndId接口不需要接收
		 * 只保存在本地数据库中
		 */
		if(params.acType == "NA"){
			params.acType = "";
			params.acInfo = "";
		};
		params.item = angular.forEach(params.item, function(value, key){
			value.station = value.station && value.station.toUpperCase();
			delete value.availableQty;
			delete value.allunits;
			delete value.allunit;
		});
		if(params.cardId == "undefined" || !params.cardId){
			params.cardId = null;
		};
		params.no && delete params.no;
		params.timeId && delete params.timeId;
		delete params.worknoTxt;
		delete params.nameAndId;
		delete params.station;
		delete params.diffName;
		delete params.searchTxt;
		delete params.is_bool;
		delete params.approverId;
		delete params.acInfoFlage;


		console.log("查询到的数据"+JSON.stringify(params));
		// return
		server.maocPostReq('mr/addME2MR', params, true).then(function(data) {
			//提交数据，如果提交成功，则删除存在本地的数据
			if(200 === data.status) {				
				localParams.timeId && mrDataBase.removeItem(localParams.timeId);

				$rootScope.go('back');
			}else if(!!data.data.error_description && data.data.error_description.slice(0,6) == "SAP不可用"){
				//特殊的，当出现SAP服务器出问题，中间服务器没问题的情况下
				localParams.timeId && mrDataBase.removeItem(localParams.timeId);
				console.log("SAP服务器有问题");
				$scope.myForm.$valid = true; //提交不成功，提交按钮可用
				$rootScope.go('back');
				// $scope.errorInfo = data.data;
			}else {
				$scope.myForm.$valid = true; //提交不成功，提交按钮可用
			};
			$scope.submitimg = false;
			$rootScope.endLoading();
		}).catch(function(error) {
			$scope.myForm.$valid = true; //提交不成功，提交按钮可用，重新设置本地存储
			$scope.submitimg = false;
			$rootScope.endLoading();
			localParams.timeId = timeId;
			localParams.createTime = Date.now();
			mrDataBase.setItem(timeId, localParams);
		});

	}
	$scope.submitMr = function(mrInfo){
		$rootScope.confirmInfo = lanConfig.isSubmit;
		$rootScope.confirmShow = true;
		$rootScope.confirmCallBack = submit;
		$scope.mrInfo = mrInfo;
		return false;		
	}
	/*
	 自定义confirm确定
	 * */
	$rootScope.confirmOk = function(){
		$rootScope.confirmShow=false;
		if(typeof $rootScope.confirmCallBack === 'function'){
			$rootScope.confirmCallBack($scope.mrInfo);
		}	
	}
	$rootScope.confirmCancel = function(){
		$rootScope.confirmShow=false;
		if(typeof $rootScope.cancelCallBack === 'function'){
			$rootScope.confirmCallBack($scope.mrInfo);
		}	
	};
	//航材数量为零时点击弹窗的确定删除该条航材卡
	function confirmDelete(event,index){

		angular.element(event.currentTarget).parent().parent().parent().remove();
		$scope.mrInfo.item.splice(index, 1);
	}
	
	//监听表单数据是否变化，实时保存
	$scope.$watch('mrInfo', function(mrInfo) {
		if(!angular.equals({requireDate: new Date($scope.today)}, mrInfo)){
			if(!isCreateData){
				mrInfo.createTime = Date.now();//创建时间
				isCreateData = true;
			}
			
			if(!mrInfo.timeId){	//第一次添加，
				mrInfo.timeId = timeId;
				mrInfo.sapTaskId = $scope.sapTaskId;
				mrInfo.searchTxt = $scope.card_data;

				mrInfo.acInfoFlage =$scope.mrInfo.acInfoFlage;
				mrInfo.acType =  $scope.mrInfo.acType;
				mrInfo.acInfo = $scope.mrInfo.acInfo;

				$localForage.getItem('noSubmitNumber').then(function(value) {
					value++;
					mrNumber = value;
				    if(value < 10){
				   		mrNumber = '0' + (value);
				    }				    
				   $scope.mrInfo.no = lanConfig.noSubmit + mrNumber;
				   $localForage.setItem('noSubmitNumber',value);
				    // console.log(value);
				}).catch(function(err) {
				    $localForage.setItem('noSubmitNumber',1)
	
				    $scope.mrInfo.no = lanConfig.noSubmit1;
				});
			}
			// console.log("改变的数据"+JSON.stringify(mrInfo));
			if(!!timeId){
				mrDataBase.setItem(timeId, mrInfo);
			}

		}
	}, true);

    //点击button变色	
    $scope.isActive = "";
//  $scope.turnWhite = false;
//  $scope.turnOrange = false;
    $scope.ac = function(event){
    	if($scope.mrInfo.acType == event.target.innerText.toLowerCase()){
    		$scope.mrInfo.acType = '';
    		$scope.mrInfo.acInfo = '';
    		$scope.acInfoLen == 0;
    	}else{
    		$scope.mrInfo.acType = event.target.innerText.toLowerCase();
    	}
    	console.log($scope.mrInfo.acType);
    };
	 //N/A类型是后加，不改动原有的小写逻辑
	 $scope.ad = function(event){
		 if($scope.mrInfo.acType == "NA"){
			 $scope.mrInfo.acType = '';
			 $scope.mrInfo.acInfo = '';
			 $scope.acInfoLen == 0;
		 }else{
			 $scope.mrInfo.acType = "NA";
             $scope.mrInfo.acInfo = '';
		 }
		 console.log("acType"+JSON.stringify($scope.mrInfo.acType));
	 };
	$scope.switchType = function(event){
		$scope.mrInfo.cardType = event;
		$scope.mrInfo.cardNo = '';
		$scope.inputCardNoErr = false;
		if($scope.mrInfo.cardType == "LM"){
			$scope.mrInfo.cardNo = lanConfig.lm;
		};
		if($scope.mrInfo.cardType == "LM" || $scope.mrInfo.cardType == "LMTLB" || $scope.mrInfo.cardType == "LMNRC"){
			$scope.cardNoError = "";
			$scope.mrInfo.acInfo = "";
		};
		if($scope.mrInfo.cardType == "LMEO" || $scope.mrInfo.cardType == "LMJC"){
			$scope.mrInfo.acType="";
			//LMEO、 LMJC工卡相互切换时输入的Work NO.和带出的Tail/ENG清空
			$scope.mrInfo.acInfo="";
			$scope.mrInfo.worknoTxt="";
		};
		// console.log($scope.mrInfo);
	};

		 if($scope.card_data.isadd){
			 $scope.switchType("LM");
		 }else {
			$scope.mrInfo.cardType=$scope.card_data.cardType;
			 $scope.mrInfo.cardNo=$scope.card_data.cardNo;
			 $scope.mrInfo.cardId=$scope.card_data.workPackageNo;
			 $scope.mrInfo.lineJobId=$scope.card_data.workOrderId;
			 $scope.lm_data=false;
		 }

	 //点击加号航材数量加一new
	 // materialnumber：需求数量，material：整个取值对象，num2：长度
	 // 原有的逻辑是根据当地库房和飞机库库房取件，对可取数量做限制，现在改为对数量不做限制
	 $scope.plusmaterials = function(materialnumber,material,num2){
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
		 material.qty = parseFloat(((materialnumber * baseNum + num2 * baseNum) / baseNum).toFixed(precision));
		 if(materialnumber == 0){
			 $scope.nomaterialqty = false;
		 };
	 };

	//点击减号航材数量减一
	$scope.minusmaterials = function(materialnumber,material,num2,event,index){
		var rememberNumber = material.qty; //点击减记住上一次的值
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
		if(materialnumber>1){
			material.qty = parseFloat(((materialnumber * baseNum - num2 * baseNum) / baseNum).toFixed(precision));
		}else if(materialnumber<=1)
		{
			material.qty = 0;
			
			$scope.nomaterialqty = true;
			$rootScope.confirmInfo = lanConfig.clearStock;
			$rootScope.confirmShow = true;
			$rootScope.confirmOk = function(){
				$rootScope.confirmShow=false;
				confirmDelete(event,index);
			};
			$rootScope.confirmCancel = function(){
				$rootScope.confirmShow=false;
				material.qty = rememberNumber; 
				$scope.nomaterialqty = false;
			}
			return false;
		};

	};

	$scope.overStock = function(material, event,index){
		//输入值验证
		var tempQty = material.qty;
			tempQty_1 = tempQty && tempQty.slice(0, tempQty.length-1);
			
		if(!tempQty_1 && /\./g.test(tempQty)){ //小数点不能点首位
			material.qty = '';
		}else if(/\./g.test(tempQty_1)&& tempQty.slice(-1)=='.'){ //已经输入过点不能再次输入
			material.qty = tempQty_1;
		}else if(tempQty && tempQty.substring(0,2)=='00'&&tempQty.indexOf('.')==-1){
			material.qty = '0'
		}else{
			material.qty = tempQty &&　tempQty.replace(/[^0-9\.]/g, '');
		};
			
		if(material.qty > Number(material.availableQty)){
			material.qty = 0;
			$scope.nomaterialqty = true;
		}else if(material.qty == 0){
			$scope.nomaterialqty = true;
			
		}else if(material.qty > 0){

			$scope.nomaterialqty = false;
		};	
		//保留两位小数
		if(typeof String(tempQty).split('.')[1] != "undefined" && String(tempQty).split('.')[1].length>2){
			material.qty = material.qty.substring(0,String(tempQty).split('.')[0].length+3)
		}
	};
	//编辑航材栏为0时记住值弹窗取消时还原原来的值
	var  memoryNumber ;
	$scope.rememberNumber = function(material, event,index){
		memoryNumber = material.qty;
		
	};
	//编辑航材栏为0或者空时弹窗提示取消还原原来的值
	$scope.returnLastNumber = function(material, event,index){
		console.log(material.qty)
		if(material.qty == 0 || material.qty == undefined){
			$scope.nomaterialqty = true;
			$rootScope.confirmInfo = lanConfig.clearStock;
			$rootScope.confirmShow = true;
			$rootScope.confirmOk = function(){
				$rootScope.confirmShow=false;
				confirmDelete(event,index);
			};
			$rootScope.confirmCancel = function(){
				$rootScope.confirmShow=false;
				material.qty = memoryNumber; 
				$scope.nomaterialqty = false;
			}
		}
	};
	//输入Work NO后回车返回搜索结果
	$scope.workNoEnter = function(ev,cardNos){
		var keyCode = window.event?ev.keyCode:ev.which;
		if(keyCode == 13){
			ev.preventDefault();
			if($scope.mrInfo.worknoTxt.length >= 12 && /\d{12}/.test($scope.mrInfo.worknoTxt) ){
				$scope.getMeCardNo($scope.mrInfo.worknoTxt);
			}else{
				$scope.cardNoError=true;
				$scope.cardNoInfo = false;
			}
						
		}
	};

	//当用户点击返回的时候做判断
	$scope.goBack = function () {
		if(!$scope.submitimg){
			$rootScope.go('back');
		};
	};

	 $scope.isSelectAc = true;
	//自动获取飞机数据
	 $scope.getAc = function(){
		 if($scope.mrInfo.acInfo){
			 $scope.dropdownAc = true;
			 $scope.loadAc = true; //请求列表时显示loading
			 $scope.acList = [];
			 server.maocGetReq('aircraft/findMiniSpec', {
				 acNo: $scope.mrInfo.acInfo,
				 // pageIndex: 1,
				 // pageSize: 10
			 }).then(function(data) {
				 if(200 === data.status) {
					 $scope.isSelectAc = false;
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
	 };

	 //失去焦点
	 $scope.hideDrop =function(){
		 if($scope.isSelectAc == false){
			 setTimeout(function(){
				 $scope.$apply(
					 function () {
						 $scope.dropdownAc = false;
						 $scope.mrInfo.acInfo = "";
					 }
				 );

			 }, 400)
		 };
		 $scope.haveAC = true;
	 };

	 $scope.acEngNa = function(){
	 	if(!!$scope.mrInfo.acType && $scope.mrInfo.acInfo){

		}
	 };

	 //飞机选择操作
	 $scope.selectAc = function(ac,obj){
		 console.log(JSON.stringify(obj));
		 $scope.onacId=obj.acId;
		 $scope.mrInfo.acInfo = ac;
		 $scope.dropdownAc = false;
         $scope.acList = [];
		 $scope.isSelectAc=true;
	 };

	// 获取所有的站点
	 $scope.allStationList = [];
	 $scope.getStationData = function () {
		 server.maocGetReq('TBM/findTbmStationsByAirport3Code', {
			 airport3Code: ""
		 }).then(function (data) {
			 // console.log("获取站点"+JSON.stringify(data));
			 if (200 == data.data.statusCode) {
				 $scope.allStationList = data.data.data || [];
			 }else {
				 console.log("站点获取失败");
			 }
			 // console.log("ture获取站点"+JSON.stringify( $scope.allStationList));
		 }).catch(function (error) {
			 console.log(error);
		 });
	 };
	 // $scope.getStationData();

	// 站点选择正确性校验
     $scope.checkStation = function (timeId,station,acInfo) {
     	//当获取到的站点有数据且已经填写了站点后
		 if($scope.mrInfo.station){
			 $rootScope.go('searchMaterial','slideLeft',{timeId: timeId, station: station,acReg:acInfo,cardType:$scope.mrInfo.cardType})
		 }else{
			alert("请先选择航站！");
		 }
		//  var stationflag = "";
     	// if($scope.allStationList.length && !!$scope.mrInfo.station){
		// 	stationflag = $scope.allStationList.indexOf($scope.mrInfo.station.toUpperCase());
		// };
     	// //如果输入的站点是正确的
     	// if(stationflag != -1){
		// 	console.log("station"+JSON.stringify($scope.mrInfo.station));
		// 	$rootScope.go('searchMaterial','slideLeft',{timeId: timeId, station: station,acReg:acInfo})
		// }else {
		// 	console.log("station"+JSON.stringify($scope.mrInfo.station));
		// 	$scope.mrInfo.station = "";
		// 	alert("三字码站点输入错误，请重新输入！");
		// }
     };

}
]);



