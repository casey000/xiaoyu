module.exports = angular.module('myApp').controller('meReleaseTaskController', 
['$rootScope', '$scope', 'server', '$stateParams', 'configInfo', '$filter', 'meList',
    function($rootScope, $scope, server, $stateParams, configInfo, $filter, meList) {
		var _showMask = false;
		var releaseHours = "";
		var releaseMinutes = "";
		var releaseSeconds = "";
		$scope.centerStationFlage=false;
		$scope.centerStation=[];
		$scope.nowStation="";
		$scope.addguzhang=true;
		$scope.workOrderId= $stateParams.jobId;
		$scope.ac_guzhang=$stateParams.oneFlight;
		console.log("父页面"+JSON.stringify($stateParams));
		$scope.prFlag=true;
		if($stateParams.prFlag=="pof"){
			$scope.prFlag=false;
		}
		if($stateParams.oneFlight.jobType=="O/G"){
			$scope.prFlag=true;
		}
        Object.defineProperty($scope, "showMask", {
            get: function(){
                return _showMask;
            },
            set: function(val){
                _showMask = val;
            }
        })
		Object.defineProperty($scope, "releaseHours", {
			get: function(){
				return releaseHours;
			},
			set: function(val){
				releaseHours = val;
			}
		});

		Object.defineProperty($scope, "releaseMinutes", {
			get: function(){
				return releaseMinutes;
			},
			set: function(val){
				releaseMinutes = val;
			}
		})
		Object.defineProperty($scope, "releaseSeconds", {
			get: function(){
				return releaseSeconds;
			},
			set: function(val){
				releaseSeconds = val;
			}
		});

		$scope.returnMr = function(){
			$rootScope.go('returnList','',{returnOrderId:$stateParams.jobId,workStation:$scope.tasks.station,rtFlightNo:$scope.tasks.flightNo,rtFlightId:$scope.tasks.lineJob ? $scope.tasks.lineJob.flightId:''})
		};
		// $scope.releaseHours = '';
		// $scope.releaseMinutes = '';
		// $scope.releaseSeconds = '';
		// $scope.showMask = false;
		$scope.feedBackContent = '';
		$scope.rejectInfo = {
			taskType: "tbm_routine",
			feedBack: ''
		}
		Object.defineProperty($scope, "rejectInfo", {
			get: function(){
				return rejectInfo;
			},
			set: function(val){
				rejectInfo = val;
			}
		})

		$scope.myName = configInfo.myName();
		$scope.releaseInfo = {};

		if(!angular.equals($stateParams.oneFlight, {})){
			meList.oneFlight = $stateParams.oneFlight;
			$scope.limitNames = $stateParams.oneFlight.limitNames;
			localStorage.setItem('prFlag', $stateParams.prFlag);
		}

		//清除去故障详情临时保存的参数
		localStorage.removeItem('defectIdPt');
		localStorage.removeItem('meItemId');
//		封装点击process后返回保持卡片开的状态方法
		function switchCardstatus(cardType,card,angleDirection){
			if(sessionStorage&&sessionStorage.cardType == cardType){
				var angleDirection = angular.element(document.getElementsByClassName(angleDirection));
				var card = angular.element(document.getElementById(card));
				card.css('display','block');
				angleDirection.removeClass('fa fa-angle-down').addClass('fa fa-angle-up');
			}
		}
		switchCardstatus('flb','fac11','fac1');
		switchCardstatus('routineMaintenance','fac22','fac2');
		switchCardstatus('nonRoutineMaintenance','fac33','fac3');
		/**
		 * 手动输入执照号输入限制
		 */
		// $scope.licenseNoLimit = function(){
		// 	var licenseNum = $scope.releaseInfo.licenseNo;
		// 	if(licenseNum&&licenseNum.length>18){
		// 		licenseNum = licenseNum.substring(0,18);
		// 	}
		// 	$scope.releaseInfo.licenseNo = licenseNum && licenseNum.replace(/[^a-zA-Z0-9]/g, '');
		// }
		/**
		 * 手动输入放行时分秒输入限制
		 */
		$scope.T1_onkeyup = function(ev) {

			var hours = $scope.releaseHours;
				if(hours>23){
					$scope.releaseHours = 23
				}else if(hours&&hours.length>=3){
					$scope.releaseHours = hours.substring(0,2)
				} else{
					$scope.releaseHours = hours &&　hours.replace(/[^0-9$]/g, '');
				}
				//$scope.releaseHours = parseInt(hours)
			if(hours&&hours.length==2&&!isNaN(hours)){
				
				document.getElementById('T2').focus();
			}
		}
		
		$scope.T2_onkeyup = function(event) {
			var minutes = $scope.releaseMinutes;
			if(minutes>59){
				$scope.releaseMinutes = 59
			}else if(minutes&&minutes.length>=3){
				$scope.releaseMinutes = minutes.substring(0,2)
			}else{
				$scope.releaseMinutes = minutes &&　minutes.replace(/[^0-9$]/g, '');
			}
			//$scope.releaseMinutes = parseInt(minutes)
              console.log($scope.releaseMinutes);
			if(minutes&&minutes.length==2&&!isNaN(minutes)){
				document.getElementById('T3').focus();
			}
		}
		$scope.T3_onkeyup = function(ev) {
			var seconds = $scope.releaseSeconds;
			if(seconds>59){
				$scope.releaseSeconds = 59
			}else if(seconds&&seconds.length>=3){
				$scope.releaseSeconds = seconds.substring(0,2)
			}else{
				$scope.releaseSeconds = seconds &&　seconds.replace(/[^0-9$]/g, '');
			}
			console.log($scope.releaseSeconds);
			//$scope.releaseSeconds = parseInt(seconds)
		}
		/**
		 * 删除时分秒时不会自动跳到前一栏删除
		 */
		$scope.cursorForward = function(event){
			var minutes = $scope.releaseMinutes;
			var seconds = $scope.releaseSeconds;
			if(minutes==undefined||!minutes||minutes.length==0){
				if(event.keyCode == 8){
					event.preventDefault();
					document.getElementById('T1').focus();
				}		
			}else if(seconds==undefined||!seconds||seconds.length==0){
				if(event.keyCode == 8){
					event.preventDefault();
					document.getElementById('T2').focus();
				}
			}
		}
		/**
		 * 获取Staus数据
		 */
		$scope.initMeJobDetail = function() {

			$scope.releaseTime2 = '';
			$scope.releaseHours = '';
			$scope.releaseMinutes = '';
			$scope.releaseSeconds = '';
			server.maocGetReq('maintain/meJobDetails/' + $stateParams.jobId + '?refreshCache=true').then(function(data) {
				if(200 === data.status) {
					console.log("maintain/meJobDetails数据"+JSON.stringify(data));
					$scope.tasks = data.data.data[0];
					if($scope.tasks.checkType=='STA' || $scope.tasks.checkType=='O/G'){
						$scope.hideType = true;
					};
					if($scope.tasks.released && $scope.tasks.checkType!='O/G'){
							$scope.addguzhang=false;
					};
					if($scope.tasks.station){
						$scope.nowStation = $scope.tasks.station;
					};
					// if($scope.tasks.routineList){
					//
					// }else if(){
					//
					// };
					// console.log("查询到的站"+JSON.stringify($scope.centerStation));
					// console.log("初始化得到的本站"+JSON.stringify($scope.nowStation));
					angular.forEach($scope.centerStation,function (item,index) {
						if ($scope.nowStation == item.VALUE) {
							$scope.centerStationFlage = true;
						}
					});
					$scope.releaseInfo.licenseNo = $scope.tasks.licenseNo;
					$scope.isCenter = (['SZXS', 'HGHS'].indexOf($scope.tasks.station + 'S') > -1); //是否为中心站

					if($scope.tasks.released){
						$scope.releaseInfo.releaser = $scope.tasks.releaser;
						$scope.releaseInfo.releaserNo = $scope.tasks.releaserNo;
						
						$scope.releaseInfo.releaseTime = new Date($scope.tasks.releaseTime);
						$scope.releaseTime2 = $filter('date')($scope.tasks.releaseTime, 'yyyy/MM/dd');
						$scope.releaseHours = $filter('date')($scope.tasks.releaseTime,'HH');
						$scope.releaseMinutes = $filter('date')($scope.tasks.releaseTime,'mm');
						$scope.releaseSeconds = $filter('date')($scope.tasks.releaseTime,'ss');
					}else{
						var myId = configInfo.myId() || '';
						if(myId){
							$scope.licenseDisabled = true;
						}
						$scope.releaseInfo = {
							licenseNo: myId ,
							releaserNo: configInfo.user
						};
					}
					$rootScope.endLoading();
					$rootScope.backRouter = false;
				}
				$scope.pullToRefreshActive = false;
			}).catch(function(error) {
				console.log(error);
				$scope.pullToRefreshActive = false;
				$rootScope.endLoading();
			});
		};

		//获取中心站信息,如果是中心站，发料按钮就不显示了，如果不是中心站，按钮就显示，当下面等于的时候，就是中心站，就不显示
		$scope.getCenterStation = function(){
			server.maocGetReq('/assembly/analysisDomainTypeByCode', {
				domainCode: 'CENTER_STATION',
			}).then(function (result) {
				if(result.data.statusCode==200){
					$scope.centerStation = result.data.data[0].CENTER_STATION;
				}
			}).catch(function (error) {
				console.log('失败!');
			});
		};
		$scope.getCenterStation();

		/*查看pdf*/
		$scope.openNewPageWithData = function(param){
			var type = angular.lowercase(param.type);
			if (type == 'doc' || type == 'docx' || type == "txt"
				|| type == "tif"|| type == "xls"  || type == "xlsx") {
				alert('暂不支持此格式预览');
				return;
			}
			NativeAppAPI.openNewPageWithData(param);
		}

		//格式化要显示的时间格式
		$scope.formatTime = function() {
			$scope.releaseTime2 = $filter('date')($scope.releaseInfo.releaseTime,'yyyy/MM/dd');
			var tempFlyDate = $filter('date')($scope.tasks.date, 'yyyy/MM/dd');

			if(tempFlyDate != $scope.releaseTime2){
				alert('放行日期与航班计划日期不同,请确认!');
			}
		}

		/*
		* 提交发料信息
		* */
		var submitMrIssueInfo = function(routineItem){
			server.maocPostReq('mr/mrIssue', [{collect: false, mrNum: routineItem.mrNo}], true).then(function(data) {
				if(200 === data.status) {
					console.log('发料信息发送成功')
				}else{
					//alert('服务器出现错误!')
				}
				$rootScope.endLoading();
			}).catch(function(error) {
				console.log(error);
				$rootScope.endLoading();
			});
		}

		//var goNrc = function(tasks, routineItem){
		//	$rootScope.confirmShow = false;
		//	api.alert({
		//		msg: '此类型任务请前往PC端反馈'
		//	});
		//	//if(routineItem.cardType == 'NRC' || routineItem.cardType == 'NRCTASK'){
		//	//	api.alert({
		//	//		msg: '此类型任务请前往PC端反馈'
		//	//	});
		//	//	return;
		//	//}
		//	//$rootScope.go('me.releaseTask.meForm','',{oneCardInfo: routineItem, 'formId':routineItem.formId,
		//	//	'itemId':routineItem.itemId,'routineCardNumber':routineItem.cardNo,
		//	//	'taskType':'tbm_routine','routineRequireFeedback':routineItem.requireFeedback,
		//	//	'isRiiRequired':routineItem.rii, dm:routineItem.dm})
		//};
		//是否要写tlb处理
		var writeOrCancelTlb = function(tasks, routineItem){
			$rootScope.confirmInfo = "是否要写TLB";
			$rootScope.confirmShow = true;
            $rootScope.confirmOk = function () {
				$rootScope.confirmShow=false;
				$rootScope.isYes = false;
				$rootScope.go(
					'tlbAdd',
					'',
					{
						flightNo: tasks.flightNo,
						flightId: $stateParams.oneFlight.flightId,
						acNo: tasks.acReg,
						lineJobId: (tasks.lineJob && tasks.lineJob.lineJobId) || tasks.lineJobId || '',
						station: tasks.station,
						cdnType: routineItem.cardType,
						cdnNo: routineItem.cardNo,
                         docNo: routineItem.docNo,
						cdnId: routineItem.cardId,
						'rii': routineItem.rii,
						'ata': routineItem.ata,
						itemId:routineItem.itemId,
						tlbId: routineItem.tlbId,
                        	dm:routineItem.dm,
                        	dmValue:routineItem.dmValue,
						requireFeedback: routineItem.requireFeedback,
						routineItem:routineItem,
						checkType: $scope.tasks.checkType, //OG时需要
						flightDate: $scope.tasks.date, //OG时需要
						jcFeedbackDetailList:routineItem.jcFeedbackDetailList,
                        minorModel:routineItem.minorModel,
					}
				);
			};
			$rootScope.confirmCancel = function(){
				$rootScope.confirmShow=false;
				$rootScope.isYes = false;
				if(routineItem.cardType == 'TO'|| routineItem.cardType == 'PCO') {
                    $rootScope.go(
                        'me.releaseTask.meForm',
                        '',
                        {
                            'formId': routineItem.formId,
                            'itemId': routineItem.itemId,
                            'nonRoutineCardNumber': routineItem.cardNo,
                            'taskType': 'tbm_non_routine',
                            'cardType': routineItem.cardType,
                            'nonRoutineRequireFeedback': routineItem.requireFeedback,
                            'flowInstanceId': routineItem.flowInstanceId,
                            dm:routineItem.dm
                        }
                    );
				}
				else {

                    $rootScope.go('me.releaseTask.meForm','',{oneCardInfo: routineItem, 'formId':routineItem.formId,
                        'itemId':routineItem.itemId,'routineCardNumber':routineItem.cardNo, 'taskType':'tbm_routine',
                        'routineRequireFeedback':routineItem.requireFeedback,'routineRequireLisence':routineItem.isRequireLisence,dm:routineItem.dm})
                }

			}
		}


		/*
		 * EO,jC,NRC类型判断后进行相应的逻辑
		 * */
		var goWhereWithType = function(tasks, routineItem){
			// if (routineItem.cardType == 'NRC' || routineItem.cardType == 'NRCT') {
				if(routineItem.cardType == 'NRC'){
					$rootScope.go(
						'nrcfeedbak',
						'',
						{
							nrcInfo:routineItem,
							itemId:routineItem.itemId
						}
					);
				}else if(routineItem.cardType == 'NRCT'){
					$rootScope.go(
						'nrc_taskfeedbak',
						'',
						{
							nrcInfo:routineItem,
							itemId:routineItem.itemId
						}
					);
				}else if(routineItem.cardType == 'TO'){
				$rootScope.go(
					'toprocess',
					'',
					{
						nrcInfo:routineItem,
						itemId:routineItem.itemId
					}
				);
			}else if(routineItem.cardType == 'JC'){
					$rootScope.go(
						'jcprocess',
						'',
						{
							nrcInfo:routineItem,
							itemId:routineItem.itemId
						}
					);
				} else if(routineItem.cardType == 'PCO'){
					$rootScope.go(
						'pcoprocess',
						'',
						{
							nrcInfo:routineItem,
							itemId:routineItem.itemId
						}
					);
				}else if(routineItem.cardType == 'ReviewDefect'){
					$rootScope.go(
						'ddprocess',
						'',
						{
							nrcInfo:routineItem,
							itemId:routineItem.itemId
						}
					);
				}else if(routineItem.cardType == 'CCO'){
					$rootScope.go(
						'ccoprocess',
						'',
						{
							nrcInfo:routineItem,
							sapTaskId: routineItem.sapTaskId,
							itemId:routineItem.itemId
						}
					);
				}
			// } else {
			// 	writeOrCancelTlb(tasks, routineItem);
			// }
		}

		$scope.goTlbAdd = function(tasks, routineItem){
           // console.log("进来了");
			if(routineItem.issue || typeof routineItem.mrNo == 'undefined'
				|| routineItem.cardType == 'NRC' || routineItem.cardType == 'NRCT'){
				goWhereWithType(tasks, routineItem);
				return;
			}

			if(!$scope.isCenter){
				$rootScope.confirmInfo = "是否需要领料";
				$rootScope.confirmShow = true;
				$rootScope.isYes = true; //值为true时,显示的按钮为'是/否'

				$rootScope.confirmOk = function () {
					$rootScope.confirmShow = false;
					$rootScope.isYes = false;

					$rootScope.go('me.releaseTask.takeMateris','',{tasks: tasks, routineItem: routineItem,
						cardType: routineItem.cardType, cardId: routineItem.cardId,
						cardNo: routineItem.cardNo, station: tasks.station});
				};

				$rootScope.confirmCancel = function(){
					goWhereWithType(tasks, routineItem);
                    //获取到mrNo时,提交给"是否发料为否"
                    submitMrIssueInfo(routineItem);
				}
			}else {
				goWhereWithType(tasks, routineItem);
				//获取到mrNo时,提交给"是否发料为'否'"
				submitMrIssueInfo(routineItem);
			}
		}

		//故障排故
		/*
		* 1、使用defectID获取故障信息
		* 2、使用故障信息跳转到排故措施
		* 3、不单独获取，信息不全
		* */
		$scope.processAddFaultHandle = function(nonRoutineItem){
			$rootScope.startLoading();
            server.maocGetReq('defect/viewDefectDetailInfo', {defectId:nonRoutineItem.cardId}).then(function (result) {
            	$rootScope.endLoading();
                if (200 === result.status) {
                    $scope.defectData = result.data.data[0];
                    $scope.defectDetail = result.data.data[0].defectDetail;
                    $scope.pendList = result.data.data[0].pendList;
                    $scope.toList = result.data.data[0].toList;
                    $scope.ccList = result.data.data[0].ccList;
                    $scope.mrList = result.data.data[0].mrList;
                    $scope.logList = $scope.defectData.logList;
                    $scope.tlbInfoList = result.data.data[0].tlbInfoList;

                    //如果无上传排故，取故障详情的故障报告，有则取最近时间的一条数据
                    if($scope.tlbInfoList.length == 0){
                        $scope.faultReport = {
                            faultReportChn: $scope.defectDetail.faultReportChn, //取最後時間的值
                            faultReportEng: $scope.defectDetail.faultReportEng
                        }
                    }else{
                        if($scope.tlbInfoList.length == 1){
                            $scope.tlbLatest = 0;
                        }else{
                            angular.forEach($scope.tlbInfoList, function(item, index, tlbInfoList){
                                if(index < tlbInfoList.length - 1){
                                    if(item.creattime < $scope.tlbInfoList[index+1].creattime){
                                        $scope.tlbLatest = index+1;
                                    }else{
                                        $scope.tlbLatest = index;
                                    }
                                }
                            });
                        }

                        $scope.faultReport = {
                            faultReportChn:  $scope.tlbInfoList[$scope.tlbLatest].faultReportChn || '', //取最後時間的值
                            faultReportEng:  $scope.tlbInfoList[$scope.tlbLatest].faultReportEng || ''
                        }
                    }

                    $rootScope.go('processAddFaultHandle', 'slideLeft', {defectDetail:$scope.defectDetail,toList:$scope.toList,pt: false,
						faultReport: $scope.faultReport,nonRoutineItem:nonRoutineItem})
                }
            });
		};

		//非例行跳转
		$scope.goNonroutineForm = function(nonRoutineItem){

			// if(nonRoutineItem.cardType == 'NRC' || nonRoutineItem.cardType == 'NRCT'){
				if(nonRoutineItem.cardType == 'NRC'){
					$rootScope.go(
						'nrcfeedbak',
						'',
						{
							nrcInfo:nonRoutineItem,
							itemId:nonRoutineItem.itemId
						}
					);
				}else if(nonRoutineItem.cardType == 'NRCT'){
					$rootScope.go(
						'nrc_taskfeedbak',
						'',
						{
							nrcInfo:nonRoutineItem,
							itemId:nonRoutineItem.itemId
						}
					);
				}else if(nonRoutineItem.cardType == 'TO'){
					$rootScope.go(
						'toprocess',
						'',
						{
							nrcInfo:nonRoutineItem,
							itemId:nonRoutineItem.itemId
						}
					);
				}else if(nonRoutineItem.cardType == 'JC'){
					$rootScope.go(
						'jcprocess',
						'',
						{
							nrcInfo:nonRoutineItem,
							itemId:nonRoutineItem.itemId
						}
					);
				}else if(nonRoutineItem.cardType == 'PCO'){
					$rootScope.go(
						'pcoprocess',
						'',
						{
							nrcInfo:nonRoutineItem,
							itemId:nonRoutineItem.itemId
						}
					);
				}else if(nonRoutineItem.cardType == 'ReviewDefect'){
					$rootScope.go(
						'ddprocess',
						'',
						{
							nrcInfo:nonRoutineItem,
							itemId:nonRoutineItem.itemId
						}
					);
				}

			// }else {
			// 	if(nonRoutineItem.cardType == 'TO') {
			// 		writeOrCancelTlb($scope.tasks, nonRoutineItem);
			// 	} else {
			// 		$rootScope.go(
			// 			'me.releaseTask.meForm',
			// 			'',
			// 			{
			// 				'formId': nonRoutineItem.formId,
			// 				'itemId': nonRoutineItem.itemId,
			// 				'nonRoutineCardNumber': nonRoutineItem.cardNo,
			// 				'taskType': 'tbm_non_routine',
			// 				'cardType': nonRoutineItem.cardType,
			// 				'nonRoutineRequireFeedback': nonRoutineItem.requireFeedback,
			// 				'flowInstanceId': nonRoutineItem.flowInstanceId,
			// 				dm:nonRoutineItem.dm
			// 			}
			// 		);
			// 	}
			// }

		}
		/*
		 * 点击放行按钮进行放行
		 * @param {
		 * 	"releaser": "张三",
		 *   "releaserNo": "01122",
		 *   "licenseNo": "123456",
		 *   "releaseTime": 1465865380580,
		 *   "id": "50023607"
		 * }
		 */
		var prFlag = $stateParams.prFlag;

		if(angular.equals($stateParams.oneFlight, {})){
			prFlag = localStorage.getItem('prFlag');
		}


		$scope.clickRelease = function() {
            var now = new Date();
            if (meList.oneFlight.std > now.getTime() + 12*60*60*1000) {
                $rootScope.confirmInfo = "当前放行航班为12小时后的航班，是否放行？";
                $rootScope.confirmShow = true;
                $rootScope.confirmOk = function () {
                    if ($scope.tasks.dm === 'y') {
                        api.alert({
                            title: '提示',
                            msg: '此任务涉及双重维修限制，请确认是否已按要求执行'
                        }, function(ret, err) {
                            if (ret.buttonIndex == 1) {
                                $scope.doRelease();
                            }
                        });
                    }
                    else {
                        $scope.doRelease();
                    }
                };
            }
            else {
                if ($scope.tasks.dm === 'y') {
                    api.alert({
                        title: '提示',
                        msg: '此任务涉及双重维修限制，请确认是否已按要求执行'
                    }, function(ret, err) {
                        if (ret.buttonIndex == 1) {
                            $scope.doRelease();
                        }
                    });
                }
                else {
                    $scope.doRelease();
                }
            }
		};

		$scope.doRelease = function () {
            $rootScope.startLoading();
            var params = angular.copy($scope.releaseInfo);
            $scope.releaseTime2 = $scope.releaseTime2.replace(new RegExp("-","gm"),"/");
            var time = $scope.releaseTime2+' '+ $scope.releaseHours +':'+$scope.releaseMinutes+':'+$scope.releaseSeconds;

            params.releaseTime = (new Date(time)).getTime();
            params.id = $stateParams.jobId;
			console.log(JSON.stringify(params));
            server.maocPostReq('maintain/releaseME2Flb', params, true).then(function(data) {
                if(200 === data.status) {
                    $scope.submitSuccess = true; //显示提交成功提示
                    $scope.releaseSuccess = true;

                    if(prFlag == 'prf'){
                        meList.oneFlight.departureStationJob.jobStatus = 2;
                    }else{
                        meList.oneFlight.arrivalStationJob.jobStatus = 2;
                    }

                    if(!configInfo.myId()) {
                        server.maocPostReq('maintain/meReleaseLicenseNo', {
                            licenseNo: params.licenseNo
                        })
                            .then(function(data) {
                                if(200 === data.status) {
                                    configInfo.initConfigInfo({myId:params.licenseNo});
                                    console.log("更新执照号成功")
                                }
                            });

                    }
                    $scope.goBack();
                }
                $rootScope.endLoading();
            }).catch(function(error) {
                console.log(error);
                $rootScope.endLoading();
            });
        }

		/*
		 * 点击重新放行
		 * @param {
		 *   "id": "50023607" 任务id
		 * }
		 */
		$scope.reRelease = function() {

            if ($scope.releaseInfo.releaserNo != configInfo.userCode) {
                $rootScope.limitTip = true;
                $rootScope.limitTipContent = "你不是本航班的放行人员，请联系放行人员取消";
                return;
            }

			$rootScope.confirmInfo = '是否取消放行';
			$rootScope.confirmShow = true;
			$rootScope.confirmOk = function() {
                $rootScope.confirmShow=false;
                $rootScope.isYes = false;
                doReRelease();
			};

			$rootScope.confirmCancel = function() {
                $rootScope.confirmShow=false;
                $rootScope.isYes = false;
			};

		};

		function doReRelease() {
            $rootScope.startLoading();
            var params = {
                id: $stateParams.jobId
            };

            server.maocPostReq('maintain/cancelRelease', params).then(function(data) {
                if(200 === data.status) {
                    $scope.tasks.released = false;
                    $scope.initMeJobDetail();

                    if(prFlag == 'prf'){
                        meList.oneFlight.departureStationJob.jobStatus = 1;
                    }else{
                        meList.oneFlight.arrivalStationJob.jobStatus = 1;
                    }
                }
                $rootScope.endLoading();
            }).catch(function(error) {
                console.log(error);
                $rootScozpe.endLoading();
            });
		}
		$scope.editFixed = function(event){
			event.stopPropagation();
            $rootScope.go(
                'me.releaseTask.meForm',
                '',
                {
                    'formId':$scope.tasks.lineJob.formId,
                    cardInfo: $scope.tasks,
                    oneCardInfo: $scope.tasks.lineJob
                }
            );
		};
		//放行后flb不能查看编辑
		$scope.flbEditAction = function (){
			console.log($scope.tasks.lineJob.formId);
			var isReleased = $scope.tasks.released;
			if (!isReleased && $scope.tasks.lineJob.canProcess) {
				$rootScope.go(
					'me.releaseTask.meForm',
					'',
					{
						'formId':$scope.tasks.lineJob.formId,
					    cardInfo: $scope.tasks,
					    oneCardInfo: $scope.tasks.lineJob
					}
				);
			}
            if (!$scope.tasks.lineJob.canProcess) {
                $rootScope.go('allProcessDetail', '',{
                    'formId':$scope.tasks.lineJob.formId,
                    cardInfo: $scope.tasks,
                    oneCardInfo: $scope.tasks.lineJob
                });
            }
		}

		//点击时间输入全选或者光标靠右
		$scope.selectAll = function (event) {
			var len = event.target.value.length;
//			event.target.select();
//			if($rootScope.ios){
				event.target.setSelectionRange(len, len);
//			}

		}

		$scope.goBack = function(){
			$rootScope.go('back');
			window.goBack = function(){ //返回后android返回按钮go('back')改为go('index')
				$rootScope.go('index');
			}
		}
		//路由切换成功后,初始化数据
		$scope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
			$scope.initMeJobDetail();
		})

		$scope.changeTime = function(dateStr){
			var newstr = dateStr.replace(/-/g,'/');
			var date =  new Date(newstr);
			var time_str = date.getTime().toString();
			return time_str.substr(0, 10)+"000";
		}
		
		$scope.go_mrlist=function (obj,sta,sapTaskId) {
			console.log(sta);
			console.log(JSON.stringify(obj));
			var arr=obj.cardType+"_"+obj.cardNo+"_"+obj.itemId+"_"+obj.cardId+"_"+obj.status+"_"+obj.acReg+"_"+sta+"_"+obj.sapTaskId+"_"+$scope.changeTime(obj.jobDate)+"_"+obj.assetNum;
			$rootScope.go('mr', 'slideLeft',{searchTxt:arr,fromIndex:true})
		}
	}
   ]);