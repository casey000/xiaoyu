
module.exports = angular.module('myApp').controller('mrDetailController', 
 ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo','$filter',
 function($rootScope, $scope, $stateParams, server, $localForage, configInfo,$filter) {
	 var isCreateData = false;
	 $rootScope.isMrList = false;
	 $scope.abledclick = true;
	 $scope.showInterface = false;
     var mrId = $stateParams.mrId;
	 var lanConfig = require('../../../../i18n/lanConfig');
	 // 添加航材的时候穿参用，必须是timeId,否则无法接收返回的数据
	 $scope.timeId = $stateParams.mrId;
	 $scope.mrIdMark = $stateParams.mrId+"Mark";
     $scope.cardId = $stateParams.cardId;
	 $scope.hideApproverTitle = true;
	 $scope.logId = "";
	 $scope.today = $filter('date')(Date.now(), 'yyyy-MM-dd HH:mm');
	 $scope.mrInfo={
		 requireDate: new Date($scope.today),
	 };
	 $scope.newMrList = {
	 	hadchange : false,
		 item: []
	 };
	 $scope.delMrListMark = {
		 deleteSerialNumber : '',
		 hadDelItem: []
	 };
	 //在本地创建新的暂存空间
	 if (typeof mrDataBase == "undefined") {
		 mrDataBase =  $localForage.createInstance({
			 name: (configInfo.userCode||'noUser')+'_nosubmit'
		 });
	 };

	$scope.insertStation = {
		station:'',
	 	title:'航站'
	};
	 // $scope.$watch('insertStation.station', function(n,o) {
	 // 	if(n){
		// 	$rootScope.mrDetailStation = n;
		// }
	 // })
		 $rootScope.mrDetailStation = $stateParams.station
	$scope.init = function(){
//从服务器获取数据
		if(mrId){
			server.maocGetReq('mr/getMe2MRDetailById/'+mrId).then(function(data) {
				//如果返回有数据
				if(200 === data.status) {
					$scope.showInterface = true;
					$scope.mrDetail = data.data.data[0];
					//给增加的航材条目加上从前页带来的station
					$scope.mrDetail.item = angular.forEach($scope.mrDetail.item,function (value ,key) {
						value.station = $stateParams.station;
					});
					//设置批准人名和工号，该组件必须
					if(!!$scope.mrDetail.approverName && !!$scope.mrDetail.approverSn){
						$scope.mrDetail.nameAndId = $scope.mrDetail.approverName + " "+$scope.mrDetail.approverSn;
					}else {
						$scope.mrDetail.nameAndId = "" ;
					};
                    $scope.cardId = $scope.mrDetail.cardId;
					//设置日期
					$scope.mrDetail.requireDate = new Date($scope.mrDetail.requireDate);
					//是否提示需要重新提示
					if($scope.mrDetail.logId){
						$scope.logId = $scope.mrDetail.logId;
					};
					//查询存在本地的条目数据
					$scope.getLocationDataByMrId($scope.timeId);
					$scope.getLocationDataByMrIdMark($scope.mrIdMark);
					console.log("选择航材返回的数据"+JSON.stringify($scope.newMrList));
					$rootScope.endLoading();
				}
			}).catch(function(error) {
				$rootScope.endLoading();
				return error;
			});
		};
	};
	 $scope.init();


	 $scope.checkDate = function () {
		 var curTime = new Date($scope.today.replace(/-/g, '/') + ' 00:00:00');
		 if ($scope.mrDetail.requireDate < curTime) {
			 //$scope.mrInfo.requireDate = null;
			 $scope.showDateTip = true;
		 }else{
			 $scope.showDateTip = false;
		 }
	 };

	//点击返回
	 $scope.goBack = function(){
         $scope.$on('$locationChangeSuccess', function(event, newUrl){
	 		$rootScope.endLoading();
	 	});
	 	$rootScope.isMrList = true;
		 mrDataBase.removeItem($scope.timeId);
	 	$rootScope.go('back');
	 }
	 window.goBack = $scope.goBack;

    //点击返回
     $scope.newgoBack = function(){
         $rootScope.isMrList = true;
		 mrDataBase.getItem($scope.timeId).then(function(value) {
			 // if(JSON.stringify(value) != "{}" || !value){
			if( $scope.delMrListMark.hadDelItem.length >0 || value.item.length > 0 ){
				 $rootScope.confirmInfo = "是否放弃编辑?";
				 $rootScope.confirmShow = true;
				 $rootScope.confirmOk = function () {
					 $rootScope.confirmShow = false;
					 mrDataBase.removeItem($scope.timeId);
					 mrDataBase.removeItem($scope.mrIdMark);
					 $rootScope.mrDetailStation = '';
					 $rootScope.go('back');
				 };
			 }else {
				$rootScope.mrDetailStation = '';
				$rootScope.go('back');
			 }
		 }).catch(function(err) {
			 $rootScope.mrDetailStation = '';
			 $rootScope.go('back');
			 console.log(err);
		 });
     };

	// 根据ID从本地查询，如果有数据就把数据赋值
	 $scope.getLocationDataByMrId = function(mrid){
		 mrDataBase.getItem(mrid).then(function(value) {
		 	if(value){
				$scope.newMrList = value;
			}else {
				$scope.newMrList = {};
			}
		 }).catch(function(err) {
			 // This code runs if there were any errors
			 console.log(err);
		 });
	 };

	 // 根据ID从本地查询，如果有数据就把数据赋值
	 $scope.getLocationDataByMrIdMark = function(mridmark){
		 mrDataBase.getItem(mridmark).then(function(value) {
			 if(value){
				 $scope.mrDetail.item = value.hadDelItem;
				 $scope.delMrListMark  = value;
			 }else {
				 $scope.delMrListMark = {
					 deleteSerialNumber : '',
					 hadDelItem: []
				 };
			 }
		 }).catch(function(err) {
			 // This code runs if there were any errors
			 console.log(err);
		 });
	 };

	 //删除一条航材
     $rootScope.deleteAdd = function(event, index){
         angular.element(event.currentTarget).parent().remove();
         $scope.newMrList.item.splice(index, 1);
     };

	 //监听表单数据是否变化，实时保存
	 $scope.$watch('newMrList', function(mrInfo) {
		 if(!!mrInfo.item && mrInfo.item.length > 0 ){
			 mrInfo.hadchange = true;
			 if(!!$scope.timeId){
                 mrDataBase.setItem($scope.timeId, mrInfo);
             }
		 }else {
			 mrInfo.hadchange = false;
		 }
	 }, true);

	 //监听旧的条目数据是否变化，实时保存
	 $scope.$watch('delMrListMark', function(value) {
		 if(!!value.hadDelItem && value.hadDelItem.length > 0 ){
			 if(!!$scope.mrIdMark){
				 mrDataBase.setItem($scope.mrIdMark, value);
			 }
		 }else {

		 }
	 }, true);

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

	 //航材数量为零时点击弹窗的确定删除该条航材卡
	 function confirmDelete(event,index){
		 angular.element(event.currentTarget).parent().parent().parent().remove();
		 $scope.newMrList.item.splice(index, 1);
	 }

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
	 }

	 /**
	  * 提交表单数据
	  * @params {表单内容}
	  *
	  */
	 function submit(){
		 //禁用提交按钮
		 $scope.abledclick = false;
		 $rootScope.startLoading();
		 // var params = angular.copy(mrInfo);
		 var params = angular.copy($scope.mrDetail);
		 console.log("params"+JSON.stringify(params));
		 var newMaterial = angular.copy($scope.newMrList);
		 console.log("newMaterial"+JSON.stringify(newMaterial));
		 delete params.item;
		 params.item = newMaterial.item;
		 params.cardId = $scope.cardId;
         // params.item.push.apply(params.item,newMaterial.item);
		 if(angular.isDate(params.requireDate)){
			 params.requireDate = Date.parse(params.requireDate);
		 };
		 params.deleteSerialNumber=$scope.delMrListMark.deleteSerialNumber.substring(0,$scope.delMrListMark.deleteSerialNumber.length-1)||'';
		 var localParams = angular.copy(params);
		 /**
		  * no,timeId,nameAndId接口不需要接收
		  * 只保存在本地数据库中
		  */
		 console.log("localParams"+JSON.stringify(localParams));
		 params.item = angular.forEach(params.item, function(value, key){
			 value.station = value.station && value.station.toUpperCase();
			 delete value.availableQty;
			 delete value.allunits;
			 delete value.allunit;
		 });
		 if(params.cardId == "undefined" || !params.cardId){
			 params.cardId = null;
		 };
		 if (!!params.acType) params.acType =  params.acType.toLowerCase();
		 delete params.no;
		 delete params.timeId;
		 delete params.worknoTxt;
		 delete params.nameAndId;
		 delete params.station;
		 delete params.diffName;
		 delete params.searchTxt;
		 delete params.is_bool;
		 delete params.approverId;


		 // console.log("提交的数据2222"+JSON.stringify(params));
		 // $scope.abledclick= true;
		 // $rootScope.endLoading();
		 // return
			 server.maocPostReq('mr/addME2MR', params, true).then(function(data) {
				 //提交数据，如果提交成功，则删除存在本地的数据
				 if(200 === data.status) {
					 mrDataBase.removeItem($scope.timeId);
					 mrDataBase.removeItem($scope.mrIdMark);
					 $scope.submitSuccess = true;
					 console.log("提交成功");
					 $rootScope.endLoading();
					 $rootScope.go('back');
				 }else{
					 console.log("提交不成功");
					 $scope.abledclick= true; //提交不成功，提交按钮可用
					 $scope.init();
				 }
				 $rootScope.endLoading();
			 }).catch(function(error) {
				 $scope.abledclick = true; //提交不成功，提交按钮可用，重新设置本地存储
				 $rootScope.endLoading();
				 $scope.submitSuccess = false;
			 });


	 }

	 $scope.submitMr = function(){
		 //提交提示
		 $rootScope.confirmInfo = lanConfig.isSubmit;
		 $rootScope.confirmShow = true;
		 $rootScope.confirmOk = function () {
		 $rootScope.confirmShow = false;
			 $rootScope.confirmCallBack = submit();
		 }
		 return false;
	 }

//	 重新提交
	 $scope.renewSubmit = function () {
		 $scope.abledclick = false;
		 $rootScope.startLoading();
		 server.maocPostReq('mr/reSendMr', {logId:$scope.logId}).then(function(data) {
			 if(data.status == 200){
				 console.log("重新提交成功!");
				 $scope.abledclick = true;
				 $rootScope.go('back');
			 };
			 $scope.abledclick = true;
			 $rootScope.endLoading();
		 }).catch(function(error) {
			 $scope.abledclick = true;
			 console.log(error);
			 $rootScope.endLoading();
		 })
	 }

	 // $scope.hadDelItem = [];//用来放被删除过后剩下的条目数据
     $scope.delItem = function (event,idx) {
		 $scope.delMrListMark.deleteSerialNumber = $scope.delMrListMark.deleteSerialNumber+event.sapTaskId+"#"+event.serialNumber+",";
         $scope.mrDetail.item.splice(idx, 1);
		 $scope.delMrListMark.hadDelItem = $scope.mrDetail.item;
     };
}
]);
