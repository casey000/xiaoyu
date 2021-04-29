angular.module('myApp')
	.directive('directionMove', ['$touch','$rootScope', 'configInfo',
		function($touch, $rootScope, configInfo) {
			return {
				restrict: 'AE',
				link: function(scope, element, attr) {
					var clientHeight = document.body.clientHeight;
					var unbind = $touch.bind(element, {
						move: function(touch, e) {
							e.preventDefault();
							/**
							 * 当拖动区域到达头部区域时，无法再向上拖动
							 * 当拖动区域到达底部菜单区域时，无法再向下拖动
							 */
							var left = touch.x - 28 > 0 ? (touch.x + 18 < screen.width ? touch.x - 28 : screen.width - 50) : 0;
							var top = touch.y > 140 ? touch.y - 28 : 150;

							element.parent().css('left', left + 'px');
							if(touch.y + 18 < clientHeight ) {
								element.parent().css('bottom', 'inherit');
								element.parent().css('top', top + 'px');
							} else {
								element.parent().css('bottom', '50px');
							}
						},
						end: function(touch, e) {
							if(touch.distanceX == 0 && touch.distanceY == 0 && !$rootScope.loading) {
								$rootScope.operate = !$rootScope.operate; //点击加号是否显示三个按钮
								scope.$apply();
							}
						}
					});

				}
			}
		}])
	.directive('directionMoveFault', ['$touch','$rootScope', 'configInfo',
		function($touch, $rootScope, configInfo) {
			return {
				restrict: 'AE',
				link: function(scope, element, attr) {
					var clientHeight = document.body.clientHeight;
					var unbind = $touch.bind(element, {
						move: function(touch, e) {
							e.preventDefault();
							/**
							 * 当拖动区域到达头部区域时，无法再向上拖动
							 * 当拖动区域到达底部菜单区域时，无法再向下拖动
							 */
							var left = touch.x - 28 > 0 ? (touch.x + 18 < screen.width ? touch.x - 28 : screen.width - 50) : 0;
							var top = touch.y > 140 ? touch.y - 28 : 150;
							element.parent().css('left', left + 'px');

							if(touch.y - 18 < clientHeight ) {
								element.parent().css('bottom', 'inherit');
								element.parent().css('top', top + 'px');
							} else {
								element.parent().css('bottom', '50px');
							}
						},
						end: function(touch, e) {
							if(touch.distanceX == 0 && touch.distanceY == 0 && !$rootScope.loading) {
								$rootScope.operate = !$rootScope.operate; //点击加号是否显示三个按钮
								scope.$apply();
							}
						}
					});

				}
			}
		}])
	//	.directive('myPop', function() { //弹出层阻止底部滚动
	//		return {
	//			restrict: 'AEC',
	//			link: function(scope, element, attr) {
	//				//				var unbind = $touch.bind(element,{
	//				//					move: function(touch,e) {
	//				//						e.preventDefault();
	//				//					}
	//				//				});
	//				element.on('touchmove', function(e) {
	//					e.preventDefault();
	//				});
	//			}
	//		}
	//	})
	.directive('clickFavorite', ['$touch', function($touch) {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				var unbind = $touch.bind(element, {
					start: function(touch, e) {
						scope.activeSwitch == 2 ? scope.favorite(element, scope.flight) : scope.favoriteChanged(element, scope.flight);
					}
				});

			}
		}
	}])
	.directive('resetFilter', ['flightInfo','$rootScope', function(flightInfo,$rootScope) {
		return {
			restrict: 'AEC',
			link: function(scope, elem) {
				elem.on('click', function() {
					scope.$apply(function(){
						var checked = document.querySelectorAll('.icon-maoc.icon-checked.checked');
						var nolimit = document.querySelectorAll('.no-limit');
						angular.element(checked).prop('checked',false);
						angular.element(nolimit).prop('checked',false);

						//所有modal值恢复初始
						// scope.airport.airport4Code = '';
						scope.airport = {};
						scope.direction = '';
						scope.flightNo = '';
						scope.acReg = '';
						scope.delayReason = '';
						scope.searchText = '';
						scope.acTypeTab = 1;
						scope.startDate = new Date(flightInfo.beginDatetime);
						scope.endDate = new Date(flightInfo.endDatetime);

						var startDate = scope.startDate;
						var endDate = scope.endDate;
						var beginDatetime = flightInfo.beginDatetime;
						var endDatetime = flightInfo.endDatetime;

						var isBeginDateChanged = angular.element(document.getElementsByClassName('isBeginDateChanged'));
						var filterBeginDate = startDate.getTime()-beginDatetime;
						filterBeginDate!=0 ? isBeginDateChanged.addClass('isDateChanged') : isBeginDateChanged.removeClass('isDateChanged');
						var isEndDateChanged = angular.element(document.getElementsByClassName('isEndDateChanged'));
						var filterEndDate = endDate.getTime()-endDatetime;
						filterEndDate!=0 ? isEndDateChanged.addClass('isDateChanged') : isEndDateChanged.removeClass('isDateChanged');

						$rootScope.operate = false;

						scope.filterAirports = [];
						scope.filterFlightnos = [];
						scope.filterAcregs = [];
						scope.filterAbnormal = [];
						scope.filterDelayReasons = [];
						scope.filterArray = [];
						scope.acRegsArray = [];
						angular.copy(scope.acRegs,scope.filterArray);
						scope.filterArray = scope.filterArray.filter(function (item) {
							// return (typeof item.acTypeName == 'undefined')?'':-1!=item.acTypeName.indexOf('B73');
							return -1!=item.acTypeName.indexOf('B73');
						})
						scope.filterArray.forEach(function (item) {
							scope.acRegsArray.push(item.acRegName);
						})
						scope.acRegsArray.sort(function(item1,item2){
							return item1.localeCompare(item2);
						});
					})
				});
			}
		}
	}])
	.directive('checkCondition', function() {
		return {
			restrict: 'AE',
			link: function(scope, elem) {

				elem.on('click', function() {
					var lanConfig = require('../../../../i18n/lanConfig');
					var all = lanConfig.all;
					var $this = angular.element(this);
					var $text = $this.text();
					var $input = $this.find('i');
					var tag = document.querySelectorAll('.tag');

					//当没有被选中时点击事件
					if (scope.activeTab == 1){
						scope.$parent.airport = {};
						//当点击unchecked时
						if ($input.hasClass('no-check')) {
							if ($text.indexOf(all) != -1) {
								//当点击不限时
								scope.filterAirports = [];
							}else {
								changeSelector(scope.airport.airport4Code,scope.filterAirports,'add');
							}
							console.log(scope.filterAirports);

							//当点击checked时
						}else {
							if ($text.indexOf(all) == -1) {
								// angular.element(noLimit).prop('checked',false);
								changeSelector(scope.airport.airport4Code,scope.filterAirports,'del');
								console.log(scope.filterAirports);
								if (!scope.filterAirports.length) {
								}
							}

						}
					}else if (scope.activeTab == 2){
						if ($input.hasClass('no-check')) {
							if ($text.indexOf(all) != -1) {
								// angular.element(checked).prop('checked',false);
								scope.filterFlightnos = [];
							}else {
								changeSelector(scope.flightNo,scope.filterFlightnos,'add');
							}
							console.log(scope.filterFlightnos);
						}
						else {
							if ($text.indexOf(all) == -1) {
								changeSelector(scope.flightNo,scope.filterFlightnos,'del');
							}
						}
					}else if (scope.activeTab == 3){
						if ($input.hasClass('no-check')) {
							changeSelector(scope.acReg,scope.filterAcregs,'add');
							console.log(scope.filterAcregs);
						}
						else {

							changeSelector(scope.acReg,scope.filterAcregs,'del');
						}
					}
					else if (scope.activeTab == 4){
						if ($input.hasClass('no-check')) {
							if ($text.indexOf(all) != -1) {
								scope.filterAbnormal = [];
							}else {
								changeSelector(scope.abnormalFlightNo,scope.filterAbnormal,'add');
							}
							console.log(scope.filterAbnormal);
						}
						else {
							if ($text.indexOf(all) == -1) {
								changeSelector(scope.abnormalFlightNo,scope.filterAbnormal,'del');
							}
						}
					}else if (scope.activeTab == 5){
						if ($input.hasClass('no-check')) {
							if ($text.indexOf(all) != -1) {
								// angular.element(checked).prop('checked',false);
								scope.filterDelayReasons = [];
							}else {
								changeSelector(scope.delayReason, scope.filterDelayReasons,'add');
							}
							console.log(scope.filterDelayReasons);
						}
						else {
							if ($text.indexOf(all) == -1) {
								changeSelector(scope.delayReason, scope.filterDelayReasons,'del');
							}
						}
					};

					function changeSelector(item,obj,change) {
						if (item) {
							if (change == 'add') {
								// var index = obj.indexOf(item);
								// if (-1 != index) {
								// 	return;
								// }else
								obj.push(item);
							}else if (change == 'del') {
								var index = obj.indexOf(item);
								if (-1 != index) {
									obj.splice(index,1);
								}
							}
						}
					}

					/*
					 * 如果航班为不限时，进出港也默认为不限
					 * */
					if(!scope.filterAirports.length){
						angular.element(tag)
							.removeClass('beClicked');
						scope.direction = '';
						scope.$parent.direction = '';
					}
					scope.$apply();
				});

			}
		}
	})
	.directive('confirmFilter', ['flightInfo','$rootScope', function(flightInfo,$rootScope) {
		return {
			restrict: 'AEC',
			link: function(scope, elem) {

				elem.on('click', function() {
					scope.$apply(function(){
						scope.filterFlight(
							{
								filterBeginDate: scope.startDate.getTime()-flightInfo.beginDatetime,
								filterEndDate: scope.endDate.getTime()-flightInfo.endDatetime,
								filterAirPorts: scope.filterAirports,
								filterFlightNos: scope.filterFlightnos,
								filterAcRegs: scope.filterAcregs,
								filterAbnormal: scope.filterAbnormal,
								filterDelayReasons: scope.filterDelayReasons,
								direction: scope.direction
							}
						);
						flightInfo.currentPage = 0;
						scope.flights.length = 0;
						flightInfo.filterFlight();
						scope.getNextPage();//调用控制器方法给flights赋值
						$rootScope.operate=false;

						NativeAppAPI.showTabBar();
						$rootScope.go('back');
						window.goBack = scope.goBack;
					})
				});
			}
		}

	}])
	.directive('faultConfirmFilter', ['flightFaultInfo','filterFaultFlightInfo','$rootScope', function(flightFaultInfo, filterFaultFlightInfo,$rootScope) {
		return {
			restrict: 'AE',
			link: function(scope, elem, attr) {
				elem.on('click', function() {
					scope.$apply(function(){
						scope.filterFlight(
							{
								// filterBeginDate: scope.startDate.getTime()-meList.beginDatetime,
								// filterEndDate: scope.endDate.getTime()-meList.endDatetime,
								filterAirPorts: scope.filterAirports,
								filterFlightNos: scope.filterFlightnos,
								filterAcRegs: scope.filterAcregs,
								direction: scope.direction
							}
						);

						if (scope.startDate.getTime() - flightFaultInfo.beginDatetime==0 && scope.endDate.getTime()-flightFaultInfo.endDatetime==0 && !scope.filterAirports.length && !scope.filterFlightnos.length && !scope.filterAcregs.length) {
							filterFaultFlightInfo.resetChoice = true;
						}

						flightFaultInfo.currentPage = 0;
						scope.flights.length = 0;
						flightFaultInfo.filterFlight();
						scope.getNextPage();
						$rootScope.operate = false;
						// console.log('mefilterFlightInfo.resetChoice = '+mefilterFlightInfo.resetChoice);
						$rootScope.go('back');
					})
				});
			}
		};
	}])
	.directive('faultResetFilter', ['flightFaultInfo','$rootScope', function(meList,$rootScope) {
		return {
			restrict: 'AE',
			link: function(scope, elem, attr) {
				elem.on('click', function() {
					scope.$apply(function(){
						var checked = document.querySelectorAll('.icon-maoc.icon-checked.checked');
						var nolimit = document.querySelectorAll('.no-limit');
						angular.element(checked).prop('checked',false);
						angular.element(nolimit).prop('checked',false);

						//所有modal值恢复初始
						// scope.airport.airport4Code = '';
						scope.airport = {};
						scope.direction = '';
						scope.flightNo = '';
						scope.acReg = '';
						scope.searchText = '';
						scope.acTypeTab = 1;
						scope.startDate = new Date(meList.beginDatetime);
						scope.endDate = new Date(meList.endDatetime);

						$rootScope.operate = false;

						scope.filterAirports = [];
						scope.filterFlightnos = [];
						scope.filterAcregs = [];

						scope.filterArray = [];
						scope.acRegsArray = [];
						angular.copy(scope.acRegs,scope.filterArray);
						scope.filterArray = scope.filterArray.filter(function (item) {
							// return (typeof item.acTypeName == 'undefined')?'':-1!=item.acTypeName.indexOf('B73');
							return -1!=item.acTypeName.indexOf('B73');
						})
						scope.filterArray.forEach(function (item) {
							scope.acRegsArray.push(item.acRegName);
						})
						scope.acRegsArray.sort(function(item1,item2){
							return item1.localeCompare(item2);
						});
					})

				});
			}
		};
	}])
	.directive('isBeginDateChanged', ['flightInfo', function(flightInfo) {
		return {
			restrict: 'AEC',
			link: function(scope, elem) {

				elem.on('change', function() {
					var startDate = scope.startDate.getTime();
					var beginDatetime = flightInfo.beginDatetime;
					var filterBeginDate = startDate<=beginDatetime ? 0 : startDate - beginDatetime;
					filterBeginDate!=0 ? elem.next().addClass('isDateChanged') : elem.next().removeClass('isDateChanged');
				});
			}
		}

	}])
	.directive('isEndDateChanged', ['flightInfo', function(flightInfo) {
		return {
			restrict: 'AEC',
			link: function(scope, elem) {

				elem.on('change', function() {
					var endDate = scope.endDate.getTime();
					var endDatetime = flightInfo.endDatetime;
					var filterEndDate = endDate>=endDatetime ? 0 : endDate - endDatetime;
					filterEndDate!=0 ? elem.next().addClass('isDateChanged') : elem.next().removeClass('isDateChanged');
				});
			}
		}

	}])
	.directive('newToOld', ['brand', 'umengEventIdTransform', function(brand, umengEventIdTransform) {
		return {
			restrict: 'AEC',
			link: function(scope, elem) {
				// scope.isNewBrand=true;
				elem.on('click', function() {
					scope.$apply(function(){
						var lanConfig = require('../../../../i18n/lanConfig');

						var text = scope.brandContext;
						if (text==lanConfig.brandOld) {
							text = lanConfig.brandNew;
							scope.isNewBrand = false;
							umengEventIdTransform.umengSaveCoustomEvent(
								umengEventIdTransform.custom_Event.flightInterfaceSwitchToNew,
								{userCode: configInfo.user}
							)
						}else {
							text = lanConfig.brandOld;
							scope.isNewBrand = true;
							umengEventIdTransform.umengSaveCoustomEvent(
								umengEventIdTransform.custom_Event.flightInterfaceSwitchToOld,
								{userCode: configInfo.user}
							)
						}
						scope.brandContext = text;
						brand.setBrand(scope.isNewBrand);
					})

				});

			}
		}

	}])

// .directive('searchItem', ['$rootScope', '$timeout', function($rootScope, $timeout) {
// 	return {
// 		restrict: 'AEC',
// 		link: function(scope, elem) {
//
//
//
// 			elem.on('click', function() {
//
// 				//隐藏下拉框
// 				$timeout(function(){
// 					scope.dropdown = false;
// 					scope.clicked = false;
// 				},300);
//
//
// 				var $this = angular.element(this);
// 				$this.parent().find('li').removeClass('search-clicked');
// 				$this.addClass('search-clicked');
//
// 				if(!scope.searchTxt){
// 					scope.hoderValue = '搜索条件不能为空';
// 					scope.$apply();
// 					return false;
// 				}
//
// 				$rootScope.startLoading();
//
// 				scope.$parent.search(
// 					{
// 						time: scope.searchDate,
// 						searchKey: $this.attr('search-key'),
// 						searchValue: scope.searchTxt
// 					}
// 				);
// 				scope.$apply();
// 			});
//
// 		}
//
// }])
	