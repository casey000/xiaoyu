module.exports =
	angular.module('myApp').controller('ddDetailController', 
	['$rootScope', '$scope', 'server', '$stateParams', '$sce',
		function($rootScope, $scope, server, $stateParams, $sce) {

			$scope.isNewBrand = true;
			/**
			 * 获取Staus数据
			 */
			//server.maocGetReq('maintain/ddDetails/' + $stateParams.acReg).then(function(data) {
			//	if(200 === data.status) {
			console.info($stateParams.acStatus);
			var acStatus
			if(JSON.stringify($stateParams.acStatus) != '{}'){
				$rootScope.acStatus = $stateParams.acStatus;
				acStatus = $stateParams.acStatus ;
			}else{
				acStatus = $rootScope.acStatus ;
			}



			// console.info(acStatus);


			acStatus.ddList ? angular.forEach(acStatus.ddList, function(v, i){
						v.status = 'Open';
						v.showDDno = true;
					}) :acStatus.ddList = [];

            acStatus.pendList ? angular.forEach(acStatus.pendList, function(v, i){
						v.status = 'Open';
						v.showPendingno = true;
					}):acStatus.pendList = [];

					//angular.forEach(acStatus.monitorDefList, function(v, i){
					//	v.status = 'Monitor';
					//	v.showMonitorno = true;
					//});
					$scope.ddLen = acStatus.ddList.length;
					$scope.pendLen = acStatus.pendList.length;

					$scope.acStatus = acStatus.ddList.concat(acStatus.pendList);
					// $scope.otherLen = acStatus.otherList.length;
					//if($scope.acStatus.length == 0) {
					//	$rootScope.backRouter = false;
					//	$rootScope.endLoading();
					//}
				//}

			//}).catch(function(error) {
			//	console.log(error);
			//	$rootScope.endLoading();
			//});
			//$scope.renderHtml = function(html_code) {
			//	if(html_code) {
			//		//var html_code = decodeURIComponent(escape(window.atob(html_code)));
			//		return $sce.trustAsHtml(html_code);
			//	}
			//};
		}
	]);
	