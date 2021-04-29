module.exports = (function() {
	angular.module('myApp').controller('pitRepairListController', ['$scope' ,'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
		function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
		{
			var that = this,total = 0;
			var scope = $scope;
			var lanConfig = require('../../../../i18n/lanConfig');
			$scope.navIdx = '1';
			$scope.pdfBase = '';
			//当为true时，表示没有更多的数据。
			$scope.noMoreData = false;
			$scope.loadMore = false;
			if($stateParams.ac){
				$scope.ac = $stateParams.ac;
				$rootScope.ac = $stateParams.ac;
			}else{
				$scope.ac = $rootScope.ac;
			}
			//返回
			$scope.goBack = function(){
				$rootScope.go('back');
			};
			$scope.dataList = [];
			$scope.ewisList = [];

			$scope.changeMainNav = function (idx) {
				$scope.navIdx = idx;
				if(idx == '1' || idx == '3'){
					$scope.initPage()
				};

				if(idx == 5){
					$scope.initEwis()
				}else{
					queryJSON.pages = 1;
					$scope.ewisList = [];
					$scope.noMoreData = false;

				}
				// if(idx == '2' || idx == '4'){
				// 	$scope.initPdf()
				// }
				//$localForage.setItem('defectIdx', {defectNavIdx: idx, defectListIdx: $scope.listIdx});
			};
			$scope.initPage = function(){
				$rootScope.startLoading();
				var idx = $scope.navIdx == '1' ? '1' :'0';
				server.maocGetReq('asms/modelEffectPic/selectByAircraftAndBusinessType', {businessType:idx,aircraft:$scope.ac}).then(function (data) {
					// console.log(data,'12323');
					if (200 === data.status) {
						$scope.dataList = data.data.data[0].result;
						$rootScope.endLoading();

					}
				}).catch(function (error) {
					console.log(error);
				});
			};
			$scope.initPdf = function(){
				// NativeAppAPI.openPdfWithUrl({url:'/attachmentForShow/openPdfOnlineByEntityId/57de35714c1a411f8ce9341fa42ab2cf'});

				$rootScope.startLoading();
				var idx = $scope.navIdx == '2' ? '1' :'0';
				server.maocGetReq('asms/modelEffectPic/selectPicByAircraftAndBusinessType', {businessType:idx,aircraft:$scope.ac}).then(function (data) {
					if (200 === data.status) {
						console.log(data.data.data[0].msg);
						if(data.data.data[0].msg==''){
							$rootScope.errTip = '无数据';
                            $rootScope.endLoading();
                            return;
						}
						// var pdfReader = "/attachmentForShow/openPdfOnlineById/" + data.data.data[0].msg;
						var pdfReader = data.data.data[0].msg;
						NativeAppAPI.openPdfWithUrl({url:pdfReader,source:'isAsms'});
						// var pdfReader = "data:application/pdf;base64,";
                        // $scope.pdfBase = pdfReader +  data.data.data[0].msg;
						// $scope.myLink =  $sce.trustAsResourceUrl(pdfBase);
						$rootScope.endLoading();

					}
				}).catch(function (error) {
					console.log(error);
				});
			};
			$scope.goDetail = function(id,name){
				if(/^(EE)/.test(name)){
					return;
				}
				$rootScope.go('searchDamageByHand.damageDetail','slideLeft',{id:id,from:'searchDamageByHand'})
			}
			$scope.urlSearch = function () {
				var name, value;
				var str = location.href; //取得整个地址栏
				var num = str.indexOf("?");
				str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

				var arr = str.split("&"); //各个参数放到数组里
				for (var i = 0; i < arr.length; i++) {
					num = arr[i].indexOf("=");
					if (num > 0) {
						name = arr[i].substring(0, num);
						value = arr[i].substr(num + 1);
						this[name] = value;
					}
				}
				return this;
			}
			$scope.initPage();
			var queryJSON ={
				"acReg":$scope.ac,
				"pages":1,
				"rows":20
			};
			$scope.initEwis = function (type) {
				$rootScope.startLoading();
				server.maocPostReq('ewis/list', queryJSON,true).then(function (data) {
					that.requesting = false;
					if (200 === data.status) {
						that.total = data.data.total;
						if(type== 'new'){
							$scope.ewisList = data.data.data
						}else{
							$scope.ewisList = data.data.data && $scope.ewisList.concat(data.data.data) || [];
						}
						if (Math.ceil(that.total / queryJSON.rows) == queryJSON.pages) {
							$scope.noMoreData = true;
						}
						$rootScope.endLoading();

					}
				}).catch(function (error) {
					console.log(error);
				});
			};
			$scope.getNextPage = function () {
				if (!$scope.noMoreData && !that.requesting) {
					if (Math.ceil(that.total / queryJSON.rows) > queryJSON.pages) {
						queryJSON.pages++;
						that.requesting = true; //防止在底部时同时执行nextPage
						$scope.initEwis();
					} else {
						$scope.noMoreData = true;
					}
				}
			};
			$scope.filterChange = function () {
				queryJSON ={
					"acReg":$scope.ac,
					"pages":1,
					"rows":20,
					"lineEquipmentNum":$scope.inputPn || ''
				};
				$scope.initEwis('new');
			}

		}])
})()