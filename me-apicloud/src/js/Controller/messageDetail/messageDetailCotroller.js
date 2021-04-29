module.exports = (function(window){
	angular.module('myApp').controller('messageDetailCotroller', 
	  ['$scope', '$sce', 'airport', '$stateParams','server', 'messageDetailManager','localStorage','configInfo', '$rootScope',
	    function($scope,$sce, airport, $stateParams,server,messageDetailManager,localStorage,configInfo, $rootScope){
			$rootScope.isMessageDetail = true;
			var flightId = $stateParams.flightId;
			$scope.flightNo = $stateParams.flightNo;
			if ($scope.flightNo) {
                localStorage.setVauleForKey($scope.flightNo,"flightNoTitle");
            }
			else {
				$scope.flightNo = localStorage.getVauleWithKey("flightNoTitle");
			}

			$scope.flightInfo = $stateParams.flightInfo;

			var lastMessageTimeKey = (configInfo.userCode||'noUser') + '_' + flightId + '_lastMessageTime';
			var lastTime = localStorage.getVauleWithKey(lastMessageTimeKey);
			var lastMessageTime = localStorage.getVauleWithKey(lastMessageTimeKey)||'';
			$scope.messageList = [];
            $scope.showDeepBackground = false;
			messageDetailManager.initMessageDataBase(function(){
				getacReg();
				getLocalMessage();
				getRemoteMessage();
			});

			function getLocalMessage(){
				messageDetailManager.getAllMessage(flightId,function(data){
					
					$scope.messageList = $scope.messageList.concat(data);
                    checkBackgroundState();
                },function(data){
					
				});
			}
			
			function checkBackgroundState() {
				var oilIndex = [];
				angular.forEach($scope.messageList,function (item,index) {
					if (typeof (item.subType) != 'undefined' && item.subType == 'DEPARTURE') {
						$scope.showDeepBackground = true;
					}
					if(item.subType === 'OIL'){
						item.isOut = false;
						var html_code = decodeURIComponent(escape(window.atob(item.content)));
						if(html_code.indexOf($scope.acReg || $stateParams.acReg) == '-1'){
							item.isOut = true
						}else{
							var obj = {
								time:new Date(item.eventTime).getTime(),
								index:index
							}
							oilIndex.push(obj);
						}
					}
                });
				// oilIndex.shift();
				var max = Math.max.apply(null,oilIndex.map(function (item) {
					return item.time
				}));

				if(oilIndex.length){
					for(var i = 0 ; i < oilIndex.length ; i++){
						if(oilIndex[i].time == max){
							$scope.messageList[oilIndex[i].index].isOut = false;
						}else{
							$scope.messageList[oilIndex[i].index].isOut = true;
						}
					}
				}
			}
			function getacReg() {
				server.maocGetReq('flight/flightUpdateList',{flightId:flightId,l_time:''}).then(function(data){
					if (200 == data.status&& data.data && data.data.data &&data.data.data.length) {
						$scope.acReg = data.data.data[0].effectiveAcReg;
						checkBackgroundState();
					}
				}).catch(function(error){
					console.log(error);
				})
			}

			function getRemoteMessage(refresh){
				server.maocGetReq('flight/flightUpdateList',{flightId:flightId,l_time:lastMessageTime}).then(function(data){
					if (200 == data.status&& data.data && data.data.data &&data.data.data.length) {
						$scope.messageList = refresh ? data.data.data[0].updateList : $scope.messageList.concat(data.data.data[0].updateList);
                        $scope.unreadNumber = data.data.data[0].unreadNumber;
                        $scope.acReg = data.data.data[0].effectiveAcReg;

						localStorage.setVauleForKey(data.data.data[0].lastestUpdateCreateTime,lastMessageTimeKey);
						messageDetailManager.saveNewMessage(data.data.data[0].updateList, flightId, refresh);
						if (window.webkit && window.webkit.messageHandlers &&window.webkit.messageHandlers.readMessageDetailSuccess &&window.webkit.messageHandlers.readMessageDetailSuccess.postMessage) {
							window.webkit.messageHandlers.readMessageDetailSuccess.postMessage({});	
						}
                        checkBackgroundState();

                    }else {
						//$scope.messageList = [];
						$scope.unreadNumber = 0;
					}
					$rootScope.endLoading();
				}).catch(function(error){
					$rootScope.endLoading();
					console.log(error);
				}).finally(function () {
					$scope.pullToRefreshActive = false;
                });
			}

			$scope.gotoFlightDetail = function () {
				$rootScope.go('flightStatus.flightDetail','slideLeft',{'flightId':flightId ,'flightNo': $scope.flightNo});
			};

			$scope.renderHtml = function(html_code)
			{	
				if(html_code){
					var html_code = decodeURIComponent(escape(window.atob(html_code)));
			    	return $sce.trustAsHtml(html_code);
				}
							
			};

			$scope.refreshMessage = function () {
                lastMessageTime = '';
				getRemoteMessage($scope.pullToRefreshActive);
            };
			var apiExist = setInterval(function(){
				if( typeof api != 'undefined' ){
					api.addEventListener({
						name: 'updateFlight'
					}, function(ret, err){
						$scope.pullToRefreshActive = true;
						$scope.refreshMessage()
					});
					window.clearInterval(apiExist);
				}
			}, 20);
	}]);
})(window);