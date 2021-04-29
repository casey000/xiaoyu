
module.exports = angular.module('myApp').controller('mrController', ['$rootScope', '$scope', 'server', '$localForage', 'configInfo','$timeout','$stateParams',
   function($rootScope, $scope, server, $localForage, configInfo, $timeout,$stateParams) {

	NativeAppAPI.hideTabBar();
	var mrListArr = [];
	$scope.mrList = [];
	$scope.sapTaskId = "";
	$rootScope.isMrList = true;
	$scope.fromIndex = $stateParams.fromIndex;
	   console.log("父页面数据"+ JSON.stringify($stateParams));
	   $scope.curTimeParse = Date.now();
	//   $localForage其实就是取出保存在本地的数据
	if (typeof mrDataBase == "undefined") {	
 		mrDataBase =  $localForage.createInstance({			
  			name: (configInfo.userCode||'noUser')+'_nosubmit'
		});
 	}
	$scope.card_data={
		workType:"",
	  	cardNo:"",
	   	workPackageNo:"",
	  	workOrderId:"",
		jobDate:"",
		assetNum:"",
		isadd:true
	}
	   $scope.status_close=true;
	   // if($stateParams.fromIndex){
		//    $scope.card_data.workType=$stateParams.searchTxt.cardType;
		//    $scope.card_data.cardNo=$stateParams.searchTxt.cardNo;
		//    $scope.card_data.workPackageNo=$stateParams.searchTxt.itemId;
		//    $scope.card_data.workOrderId=$stateParams.searchTxt.itemId;
		//    $scope.card_data.isadd=false;
	   // }
	   if($stateParams.searchTxt!="" && $stateParams.searchTxt!=null && $stateParams.searchTxt!=undefined){
		   var arr=$stateParams.searchTxt.split("_");
		   console.log("读取提交的参数源头"+ JSON.stringify($stateParams.searchTxt));
		   $scope.card_data.workType=arr[0];
		   $scope.card_data.cardNo=arr[1];
		   $scope.card_data.workPackageNo=arr[3];    //CARDid
		   $scope.card_data.workOrderId=arr[2];    //ITMid
		   $scope.card_data.acReg=arr[5];
		   $scope.card_data.station=arr[6];
		   $scope.card_data.sapTaskId=arr[7];
		   $scope.sapTaskId = arr[7];
		   $scope.card_data.jobDate=arr[8];
		   $scope.card_data.assetNum=arr[9];
		   $scope.card_data.isadd=false;
		  if(arr[4]=="Close"){
			  $scope.status_close=false;
		  }
	   }
	$scope.getData =function(){

		mrListArr = [];
		//取本地数据，循环获取存在本地的数据
		mrDataBase.iterate(function(value, key, iterationNumber) {

			//删除无效的key数据
			if(!value.no){
				console.log("删除的条目"+ JSON.stringify(value));
					mrDataBase.removeItem(key).then(function() {
						console.log('删除无效的Key为'+ key);
					}).catch(function(err) {
						// This code runs if there were any errors
						console.log('删除失败');
					});
			};

			//defectDetail是故障里面的mr保存的字段,mrNO为领料时选择航才保存的字段
			//为了不使两边数据混淆, 判断一下, 有偶合性, 后期考虑优化
			if(typeof value.defectDetail == 'undefined' && typeof value.mrNo == 'undefined'){
				// mrListArr.push(value);
				// console.log("获取到的value的值"+ JSON.stringify(value));
				// console.log("sapTaskId的值"+ JSON.stringify($scope.sapTaskId));
				// console.log("$scope.fromIndex"+ JSON.stringify($scope.fromIndex));
				if($scope.fromIndex == "true" && $scope.sapTaskId == value.sapTaskId){
				//	如果是航线下进来的
					mrListArr.push(value);
				}else if ($scope.fromIndex == "false" && !!value.no) {
				//	如果是首页下进来的
					mrListArr.push(value);
				}
			}
		}).then(function() {
			$scope.mrListLength = mrListArr.length;
		    console.log('Iteration has completed');
		}).catch(function(err) {
		    // This code runs if there were any errors
		    console.log(err);
		});
		
		//获取服务器数据
		server.maocGetReq('mr/getMe2MRInfo',$scope.card_data).then(function(data) {
			if(200 === data.status) {
				//拼接从服务器传来的数据
				mrListArr = mrListArr.concat(data.data.data || []);
				//模拟的数据
				// mrListArr =
				$scope.mrList  = mrListArr;
				$scope.mrList = angular.forEach($scope.mrList,function (value ,key) {
					// if(!!$scope.card_data.sapTaskId){
					// 	value.sapTaskId = $scope.card_data.sapTaskId;
					// };
					if(!!$scope.card_data.station){
						value.station = $scope.card_data.station;
					};
					if(!!$scope.card_data.workPackageNo){
						value.cardId = $scope.card_data.workPackageNo;
					};
				});

		   		angular.element(document.querySelectorAll('.swipe-left')).removeClass('swipe-left');//滑开没有删除时会有闪烁效果
				angular.element(document.querySelectorAll('.mr-li-list')).removeClass('mr-li-list');//滑开没有删除时会有闪烁效果
				$rootScope.endLoading();				
				$scope.mrListLength = $scope.mrList.length;
				// console.log("获取到的包括服务器和本地的MR数据"+ JSON.stringify($scope.mrList));
				// console.log("cardId"+ JSON.stringify($scope.card_data.workPackageNo));
			}
			//下拉刷新完成					
			$scope.pullToRefreshActive = false;
			$timeout(function(){
				angular.element(document.querySelectorAll('.list-group-item')).addClass('mr-li-list');
			},100)
		}).catch(function(error) {
			$rootScope.endLoading();
			//下拉刷新完成					
			$scope.pullToRefreshActive = false;
			return error;
		});
	} 
	$scope.getData();

	/*
	 * 删除一条mr
	 * @timeId = key
	 */
	$scope.deleteSaved = function(element, timeId){
		// $scope.deleteAllSave();
		if(timeId){
			mrDataBase.removeItem(timeId).then(function() {
			    // Run this code once the key has been removed.
			    angular.element(element).remove();
			    $scope.mrListLength-- ;

			}).catch(function(err) {
			    // This code runs if there were any errors
			    console.log('删除失败');
			});
		}
		
	};
	//点击右上角add mr,进入mr add界面，timeId是当前时间戳
//	$scope.goMrAdd = function(){
//		var timeId = Date.now();
//		$rootScope.go('mrAdd', '', {timeId: timeId});
//	}
	   
//	   删除本地库的所有的数据
	   $scope.deleteAllSave = function (value) {
		   mrDataBase.clear().then(function() {
			   // Run this code once the key has been removed.
			   console.log('删除成功');
		   }).catch(function(err) {
			   // This code runs if there were any errors
			   console.log('删除失败');
		   });
	   }

//	   模拟数据
	   var modeData = [ {
		   "requireDate": null,
		   "is_bool": false,
		   "cardType": "LM",
		   "cardNo": "航线勤务",
		   "acInfo": "",
		   "createTime": 1589365868132,
		   "timeId": "1589365866821",
		   "searchTxt": {
			   "cardType": "",
			   "cardNo": "",
			   "workPackageNo": "",
			   "workOrderId": "",
			   "isadd": true
		   },
		   "no": "MR未提交339",
		   "acType": "a/c"
	   }, {
		   "item": [{
			   "pn": "69B11155Y5",
			   "pnname": "Name:69B11155Y5 P/N:HINGE",
			   "unit": "EA",
			   "allunits": ["EA"],
			   "qty": 1,
			   "itemNum": "69B11155Y5"
		   }, {
			   "pn": "TCP01112",
			   "pnname": "Name:TCP01112 P/N:TEST1",
			   "unit": "EA",
			   "allunits": ["EA"],
			   "qty": 1,
			   "itemNum": "TCP01112"
		   }]
	   },{
		   "requireDate": null,
		   "is_bool": false,
		   "cardType": "LM",
		   "cardNo": "航线勤务",
		   "acInfo": "",
		   "createTime": 1589372248220,
		   "timeId": "1589372246106",
		   "searchTxt": {
			   "cardType": "",
			   "cardNo": "",
			   "workPackageNo": "",
			   "workOrderId": "",
			   "isadd": true
		   },
		   "no": "MR未提交341",
		   "acType": "a/c"
	   }, {
		   "id": 130000017662,
		   "requireDate": 1589335428000,
		   "createTime": 1589338267000,
		   "cardType": "LM",
		   "acInfo": "B-2506",
		   "acType": "A/C",
		   "sapTaskId": "T00000214530"
	   }, {
		   "id": 130000017663,
		   "requireDate": 1589336599000,
		   "createTime": 1589349152000,
		   "cardType": "LM",
		   "acInfo": "B-2883",
		   "acType": "A/C",
		   "sapTaskId": "T00000214728"
	   }]
}
 ]);

