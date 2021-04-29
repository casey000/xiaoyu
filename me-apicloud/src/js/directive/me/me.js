angular.module('myApp')
	.directive('switchCard', ['$rootScope', function($rootScope) {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				
				element.on('click', function() {
					scope.$apply(function(){
						var taskTitle = angular.element(document.getElementsByClassName('card-title'));
						var taskContent = angular.element(document.getElementsByClassName('flight-task-wrap'));
						//获取所有箭头
						var arrow = angular.element(document.getElementsByClassName('fac'))
						
						//获取点击项的向下箭头
						var dropDirection = element.children().children().children();
						if(dropDirection.hasClass('fa fa-angle-down')){
							taskContent.css('display','none');
							taskTitle.css('border-bottom','0');
							arrow.removeClass('fa fa-angle-down fa-angle-up').addClass('fa fa-angle-down')
							element.next().css('display','block');
							dropDirection.removeClass('fa fa-angle-down').addClass('fa fa-angle-up');
							element.css('border-bottom','1px solid #cfcfde')
						}else{
							element.next().css('display','none');
							dropDirection.removeClass('fa fa-angle-up').addClass('fa fa-angle-down');
							element.css('border-bottom','0'); 
						}
					})
				});
			}
		};
	}])
	.directive('switchLog', ['$rootScope','server', function($rootScope,server) {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element.on('click', function() {
					scope.$apply(function(){
						switchDirection();

						function switchDirection() {
							var tagI = element.find('i');
							if (tagI.hasClass('fa fa-angle-down')) {
								scope.isLogDisplayed = true;
								tagI.removeClass('fa fa-angle-down').addClass('fa fa-angle-up');
							}else if (element.find("i").hasClass('fa fa-angle-up')) {
								scope.isLogDisplayed = false;
								tagI.removeClass('fa fa-angle-up').addClass('fa fa-angle-down');
							}
						}
					})
				});
			}
		};
	}])
	.directive('uploadAttachments', function() {
		return {
			restrict: 'AE',
			replace: true,
			templateUrl:'me/upload.html'
			//transclude: true,
//			template:'<div>'
//					+  '<div class="attachment" pop-type-select>+</div>'
//		            +  '<ul class="upload-view-ul">'
//		            +	 '<li ng-repeat="src in imgSrcArr"  class="pull-left" ng-click="delCurUpload(src)">'
//		            +       '<span>x</span>'
//		            +	    '<img ng-src="{{src}}" >'
//		            +	 '</li>'
//		            +  '</ul>'
//		            +'</div>'
			
		};
	})
	.directive('popTypeSelect', ['$rootScope', function($rootScope) {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element.on('click', function() {
//					angular.element(document.querySelector('.meMask')).on("touchmove",function(e){
//						e.preventDefault();				
//					});
					//$rootScope.clickUpload= true;
					scope.$apply(function(){
						$rootScope.showAttachment= true;
					})
				});
				
			}
		};
	}])
	.directive('cancelAttachments', ['$rootScope', function($rootScope) {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element.on('click', function() {
					//$rootScope.clickUpload= false;
					scope.$apply(function(){
						$rootScope.showAttachment= false;
					})
				});
				
			}
		};
	}])
	.directive('rejectCard', function() {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element.on('click', function() {

					scope.$apply(function(){

						scope.$parent.feedBackContent = '';

					if (element.hasClass('tbm_routine')) {
						if (scope.routineItem.cardType=='NRC'&&scope.routineItem.cardNo.indexOf('NRC')==-1) {
							scope.$parent.cardNo = 'NRC-'+scope.routineItem.cardNo;
						}else{
							scope.$parent.cardNo = scope.routineItem.cardNo;
						}
						scope.$parent.rejectInfo = {
							taskType: "tbm_routine",
							itemId: scope.routineItem.itemId,
							feedBack: ''
						}

					}else if (element.hasClass('tbm_non_routine')) {
						if (scope.nonRoutineItem.cardType=='TLB'&&scope.nonRoutineItem.cardNo.indexOf('TLB')==-1) {
							scope.$parent.cardNo = 'TLB-'+scope.nonRoutineItem.cardNo;
						}else if(scope.nonRoutineItem.cardType=='ReviewTLB'&&scope.nonRoutineItem.cardNo.indexOf('Re TLB')==-1) {
							scope.$parent.cardNo = 'Re TLB-'+scope.nonRoutineItem.cardNo;
						}
						else if(scope.nonRoutineItem.cardType=='DD'&&scope.nonRoutineItem.cardNo.indexOf('DD')==-1) {
							scope.$parent.cardNo = 'DD-'+scope.nonRoutineItem.cardNo;
						}
						else if(scope.nonRoutineItem.cardType=='ReviewDD'&&scope.nonRoutineItem.cardNo.indexOf('Re DD')==-1) {
							scope.$parent.cardNo = 'Re DD-'+scope.nonRoutineItem.cardNo;
						}else{
							scope.$parent.cardNo = scope.nonRoutineItem.cardNo;
						}
						scope.$parent.rejectInfo = {
							taskType: "tbm_non_routine",
							itemId: scope.nonRoutineItem.itemId,
							feedBack: ''
						}
					}

					scope.$parent.showMask = true;
					})
				});
				
			}
		};
	})
	.directive('confirmReject', ['$rootScope',function($rootScope) {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element.on('click', function() {

					scope.$apply(function(){
					server.maocGetReq('TBM/getSameSAPWorkOrder/'+scope.rejectInfo.itemId,{}).then(function (data) {
						if(data.data.data[0].hasSame){

							var r=confirm(data.data.data[0].promptMsg);
							if (r==true){
									var lanConfig = require('../../../../i18n/lanConfig');
									if (scope.rejectForm.$valid) {
										$rootScope.startLoading();
										scope.rejectInfo.feedBack = scope.feedBackContent;
										scope.rejectInfo.otherCancelReason = data.data.data[0].otherCancelReason;
										scope.rejectInfo.otherWorkOrderIds = data.data.data[0].otherWorkOrderIds;
										scope.showMask = false;

										server.maocPostReq('maintain/rejectMaintenanceTask', scope.rejectInfo, true).then(function (data) {
											if (200 === data.data.statusCode) {
												console.log('提交成功');
												// scope.showMask = false;
												$rootScope.limitTip = true;
												$rootScope.shortLimitTip = true;
												$rootScope.limitTipContent = lanConfig.rejectSuccess;
												scope.initMeJobDetail();
											} else {

												scope.initMeJobDetail();
												console.log("退卡失败");
											}
											$rootScope.endLoading();
										}).catch(function (error) {
											// scope.showMask = false;
											$rootScope.limitTip = true;
											$rootScope.shortLimitTip = true;
											$rootScope.limitTipContent = lanConfig.rejectFail;
											$rootScope.endLoading();
											scope.initMeJobDetail();
										});
									}

							} else{
								scope.showMask = false;
							}
						}else {
								var lanConfig = require('../../../../i18n/lanConfig');
								if (scope.rejectForm.$valid) {
									$rootScope.startLoading();
									scope.rejectInfo.feedBack = scope.feedBackContent;
									scope.showMask = false;
									console.log(JSON.stringify(scope.rejectInfo));
									server.maocPostReq('maintain/rejectMaintenanceTask', scope.rejectInfo, true).then(function (data) {
										if (200 === data.data.statusCode) {
											console.log('提交成功');
											// scope.showMask = false;
											$rootScope.limitTip = true;
											$rootScope.shortLimitTip = true;
											$rootScope.limitTipContent = lanConfig.rejectSuccess;
											scope.initMeJobDetail();
										} else {

											scope.initMeJobDetail();
											console.log("退卡失败");
										}
										$rootScope.endLoading();
									}).catch(function (error) {
										// scope.showMask = false;
										$rootScope.limitTip = true;
										$rootScope.shortLimitTip = true;
										$rootScope.limitTipContent = lanConfig.rejectFail;
										$rootScope.endLoading();
										scope.initMeJobDetail();
									});
								}

						}
					});


				});
			});
			}
		};
	}])
	.directive('cancelReject', function() {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element.on('click', function() {
					scope.$apply(function(){
						scope.showMask = false;
					})
				});

			}
		};
	})
	.directive('meConfirmFilter', ['meList','mefilterFlightInfo','$rootScope', function(meList,mefilterFlightInfo,$rootScope) {
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
					if (scope.startDate.getTime()-meList.beginDatetime==0 && scope.endDate.getTime()-meList.endDatetime==0 && !scope.filterAirports.length && !scope.filterFlightnos.length && !scope.filterAcregs.length) {
						mefilterFlightInfo.resetChoice = true;
					}
					meList.currentPage = 0;
					scope.flights.length = 0;
					meList.filterFlight();
					scope.getNextPage();
					$rootScope.operate = false;
					// console.log('mefilterFlightInfo.resetChoice = '+mefilterFlightInfo.resetChoice);
					$rootScope.go('back');
					})
				});
			}
		};
	}])
	.directive('meResetFilter', ['meList','$rootScope', function(meList,$rootScope) {
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
//	.directive('viewDetail', ['$rootScope', function($rootScope) {
//		return {
//			restrict: 'AE',
//			link: function(scope, element, attr) {
//				element.on('click', function(e) {
//					e.preventDefault();
//					if(scope.tasks.lineJob.status == "Close"){
//						$rootScope.go('flbDetail', 'slideRight', {lineJobId: scope.tasks.lineJob.lineJobId});
//					}
//					
//					scope.$apply();
//				});
//
//			}
//		};
//	}])
	.directive('checkRaft', function() {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element.on('click', function(e) {
					scope.$apply(function(){
						var value = angular.uppercase(element.text());
						var raftCheckAll = document.querySelectorAll('.raft-checked');

						angular.element(raftCheckAll).removeClass('raft-checked');
						element.addClass('raft-checked');

						scope.formData.taskVO.hasLifeRaft = value;
					})
				});

			}
		};
	})
	.directive('onInputNrc', function() {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element.on('input', function() {
					/**
					 * Approver中修改重新赋值
					 * 不然界面中显示与提交值不一致
					 */
					if(scope.formData.riierSn){
						var tempArr = scope.formData.nameAndId.split(' ');
						scope.formData.riierSn = tempArr[1];
					}else{
						scope.formData.riierSn = '';
					}
					scope.setRiierSn(scope.formData.nameAndId);
				});

			}
		};
	})
	.directive('onInputInspector', function() {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element.on('input', function() {
					/**
					 * Approver中修改重新赋值
					 * 不然界面中显示与提交值不一致
					 */
					if(scope.formData.inspector){
						var tempArr = scope.formData.inspectorAndName.split(' ');
						scope.formData.inspector = tempArr[1];
					}else{
						scope.formData.inspector = '';
					}
					scope.setRiierSn(scope.formData.inspectorAndName);
				});

			}
		};
	})
	.directive('workInfoSelectNrc', function() {
		return {
			restrict: 'AEC',
			link: function(scope, element, attr) {

				element.on('click', function() {
					scope.$apply(function(){
						scope.$parent.formData.nameAndId = scope.item.cnName + ' ' + scope.item.workNo;
						scope.$parent.formData.riierSn = scope.item.workNo;
					})
				});

			}
		};
	})
	.directive('workInfoSelectDd', function() {
		return {
			restrict: 'AEC',
			link: function(scope, element, attr) {

				element.on('click', function() {
					scope.$apply(function(){
						scope.$parent.formData.inspectorAndName = scope.item.cnName + ' ' + scope.item.workNo;
						scope.$parent.formData.inspector = scope.item.workNo;
					})
				});

			}
		};
	})
	.directive('onInputNoLimit',['$rootScope','$parse', function($rootScope,$parse) {
		return {
			restrict: 'AE',
			link: function(scope, element, attr) {
				element.on('keyup', function() {
					scope.$apply(function(){
						//输入数字限制
						var reg = /\D/g;
						var value = element.val().replace(reg,'');

                        function lenCompare(){
                            //flb no位数限制
                            if (element.hasClass('flbNo')) {
                                scope.formData.flbNo = value;
                            }
                            //oxyenPressure
                            if (element.hasClass('oxygenPressure')) {
                                scope.formData.taskVO.oxyenPressure = value;
                            }
                            //remain限制
                            if (element.hasClass('oilRemainL')) {
                                scope.formData.oilRemainL = value;
                            }
                            if (element.hasClass('oilRemainR')) {
                                scope.formData.oilRemainR = value;
                            }
                            if (element.hasClass('oilRemainL1')) {
                                scope.formData.oilRemain3 = value;
                            }
                            if (element.hasClass('oilRemainR1')) {
                                scope.formData.oilRemain4 = value;
                            }
                            if (element.hasClass('touchGo')) {
                                scope.formData.touchgo = value;
                            }
                            //Uplift的位数限制
                            if (element.hasClass('oilUpliftL')) {
                                scope.formData.oilUpliftL = value;
                            }
                            if (element.hasClass('oilUpliftR')) {
                                scope.formData.oilUpliftR = value;
                            }
                            if (element.hasClass('oilUpliftL1')) {
                                scope.formData.oilUplift3 = value;
                            }
                            if (element.hasClass('oilUpliftR1')) {
                                scope.formData.oilUplift4 = value;
                            }
                            if (element.hasClass('oilUpliftApu')) {
                                scope.formData.oilUpliftApu = value;
                            }
                        }

						lenCompare();
					})
				});
			}
		};
	}])
	.directive('onInputLicenseLimit', function() {
		return {
			restrict: 'AEC',
			link: function(scope, element, attr) {
				function licenseLimit(value){
					// var reg = /[^a-zA-Z0-9]/g;
					// var value = angular.uppercase(element.val().replace(reg,''));
					// var value = element.val().replace(reg,'');
					if (element.hasClass('licenseNo')) {
						scope.formData.licenseNo = value;
						scope.formData.licenseNo ? scope.licenseNoRequired = true : scope.licenseNoRequired = false;
					}else if (element.hasClass('release-input')) {
						scope.releaseInfo.licenseNo = value;
					}
					
				}
				var reg = /[^a-zA-Z0-9]/g;
				element.on('keyup', function() {
					scope.$apply(function(){
						var value = element.val().replace(reg,'');
						licenseLimit(value);
					})
				});
				element.on('blur', function() {
					scope.$apply(function(){
						var value = angular.uppercase(element.val().replace(reg,''));
						licenseLimit(value);
					})
				});

			}
		};
	})
	.directive('mhLimit', function() {
		return {
			restrict: 'AEC',
			link: function(scope, element, attr) {
				scope.t_value = '';
				element.on('input', function() {
					scope.$apply(function(){
						var value = element.val();
						var reg = /^\d*?\.?\d*?$/;

						if(!value.match(reg)){
							value = scope.t_value;
							element.val(value);
						}else{
							scope.t_value = value;
						}
						if (scope.t_value && scope.t_value.toString().length>=6) {
							scope.t_value = scope.t_value.substring(0,6);
						}
						if (element.hasClass('manHours')) {
							scope.formData.manHours = scope.t_value;
						}else{
							scope.formData.mh = scope.t_value;
						}
					})
				});

			}
		};
	})
	//针对type=number时解决Error: ngModel:numfmt Model is not of type `number`
	// .directive('stringToNumber', function() {
	// 	return {
	// 		require: 'ngModel',
	// 		link: function(scope, element, attrs, ngModel) {
	// 			ngModel.$parsers.push(function(value) {
	// 				return '' + value;
	// 			});
	// 			ngModel.$formatters.push(function(value) {
	// 				return parseFloat(value);
	// 			});
	// 		}
	// 	};
	// });