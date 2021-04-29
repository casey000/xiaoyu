module.exports = angular.module('myApp').controller('recordController', 
    ['$rootScope', '$scope', 'server', function($rootScope, $scope, server) {
    	$rootScope.startLoading();
		server.maocGetReq('me/tool/myLending').then(function(data) {
			if(200 === data.status) {
				$scope.myRecordList = data.data.data || [];
				$scope.$parent.myLendingCount = $scope.myRecordList.length;
			}
		}).catch(function(error) {
			$rootScope.endLoading();
		});
	}

]);