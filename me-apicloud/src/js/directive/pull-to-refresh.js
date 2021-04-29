
'use strict';

/**
 *directive:imPullToRefresh
 * @description
 * # pullToRefresh
 */
module.exports = function($timeout, $touch, $swipe, $rootScope) {
	return {
		restrict: 'A',
		transclude: true,
		template: '<ng-transclude></ng-transclude>',
		scope: {
			refreshFunction: '&', // This function is expected to return a future
			faultDtl: '@',
			faultHandle: '@'
		},
		link: function postLink(scope, element, attrs) {

			scope.hasCallback = angular.isDefined(attrs.refreshFunction);

			scope.pullToRefresh = function() {
				//!isCanEdit 非编辑状态下
				if(scope.hasCallback && (!scope.isCanEdit && !scope.$parent.isCanEdit)
					&& (!scope.$parent.pullToRefreshActive || !scope.$parent.pullToRefreshActive2)) {
					if(attrs.faultDtl == 'true'){
						scope.$parent.$parent.$parent.pullToRefreshActive = true; //故障模块
					}else if(attrs.faultHandle == 'true'){ //故障详情处理列表
						scope.$parent.$parent.pullToRefreshActive2 = true;
					}else{
						scope.$parent.pullToRefreshActive = true;
					}

					scope.refreshFunction();
					scope.isCanEdit = scope.$parent.isCanEdit = false;
				}
			};
			var startX, startY;
			element
				.on("touchstart", function(e) {
					startX = e.changedTouches[0].pageX,
						startY = e.changedTouches[0].pageY;
				});
			element.on("touchmove", function(e) {
				var moveEndX = e.changedTouches[0].pageX,
					moveEndY = e.changedTouches[0].pageY,
					X = moveEndX - startX,
					Y = moveEndY - startY;

				if((Math.abs(Y) > Math.abs(X) && Y > 0)
					&& (element[0].scrollTop <= 0
					&& (!scope.$parent.pullToRefreshActive && attrs.faultHandle != 'true'
					|| attrs.faultHandle == 'true' && !scope.$parent.pullToRefreshActive2))) {
					//alert("top 2 bottom");
					scope.pullToRefresh();
				}
			});
		}
	};
}