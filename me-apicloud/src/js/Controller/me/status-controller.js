
module.exports = function($rootScope, $scope, server, $stateParams, $sce, $interval) {
	//$rootScope.isMeStatus = true;
	$scope.acReg = $stateParams.acReg;
	if ($scope.acReg && $scope.acReg != '') {
        $rootScope.statusAcReg = $scope.acReg;
    }
    else {
        $scope.acReg = $rootScope.statusAcReg;
    }
	$scope.seltedIndex = 1;
    $scope.showTipState = false;
	/**
	 * 获取Staus数据
	 */
	// server.maocGetReq('maintainDefect/maintainAcInfo',{acNo: $stateParams.acReg}).then(function(data) {
	server.maocGetReq('maintainDefect/maintainAcInfo',{acNo: $scope.acReg}).then(function(data) {
		if(200 === data.status) {
			var acStatus = typeof data.data.data != 'undefined' && data.data.data[0] || [];
			angular.forEach(acStatus.ddList, function(v, i){
				v.status = 'Open';
				v.showDDno = true;
				v.identifier = 'D';
			});

			angular.forEach(acStatus.pendList, function(v, i){
				v.status = 'Open';
				v.showPendingno = true;
                v.identifier = 'P';
            });

			angular.forEach(acStatus.monitorDefList, function(v, i){
				v.status = 'Monitor';
				v.showMonitorno = true;
                v.identifier = 'M';
            });

            angular.forEach(acStatus.mccList, function(v, i){
                v.status = 'Open';
                // v.showMonitorno = true;
                v.identifier = '转';
            });
			angular.forEach(acStatus.nrcList, function(v, i){
				v.status = '';
				v.showNrc = true;
				v.identifier = 'N';
			});
            angular.forEach(acStatus.allDataList, function(v, i){

                var type = v.type;
                if (type == 'MCC') {
                    v.status = 'Open';
                    v.identifier = '转';
				}
				else if(type == 'PEND') {
                    v.status = 'Open';
                    v.showPendingno = true;
                    v.identifier = 'P';
				}
				else if (type == 'DFRL') {
                    v.status = 'Open';
                    v.showDDno = true;
                    v.identifier = 'D';
				}
				else if (type == 'MONITOR') {
                    v.status = 'Monitor';
                    v.showMonitorno = true;
                    v.identifier = 'M';
				}else if (type == 'NRC') {
					v.status = '';
					v.showMonitorno = false;
					v.identifier = 'N';
					v.showNrc = true;
					v.identifier = 'N';
				}
				else {
                    v.status = 'Open';
                    v.identifier = '转';
				}

            });

			// $scope.acStatus = acStatus.ddList.concat(acStatus.pendList).concat(acStatus.monitorDefList).concat(acStatus.mccList);
			$scope.ddiList = acStatus.ddList || [];
			$scope.pedingList = acStatus.pendList || [];
			$scope.monitorDefList = acStatus.monitorDefList || [];
			$scope.mccList = acStatus.mccList || [];
			$scope.acStatus = acStatus.allDataList || [];
			$scope.nrcList = acStatus.nrcList || [];
            $scope.allList = $scope.acStatus;

			if($scope.acStatus.length == 0){
				$rootScope.backRouter = false;
			}
		}
		$rootScope.endLoading();
	}).catch(function(error) {
		console.log(error);
		$rootScope.endLoading();

	});
	$scope.watchPdf = function(){
		// NativeAppAPI.openPdfWithUrl({url:'/attachmentForShow/openPdfOnlineByEntityId/57de35714c1a411f8ce9341fa42ab2cf'});

		$rootScope.startLoading();
		server.maocGetReq('asms/modelEffectPic/selectPicByAircraftAndBusinessType', {businessType:'1',aircraft:$scope.acReg}).then(function (data) {
			if (200 === data.status) {
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
	$scope.changeIndex = function (index) {
		$scope.seltedIndex = index;

		switch (index) {
			case 1:
				$scope.acStatus = $scope.allList;
				break;
            case 2:
                $scope.acStatus = $scope.mccList;
                break;
            case 3:
                $scope.acStatus = $scope.ddiList;
                break;
            case 4:
                $scope.acStatus = $scope.pedingList;
                break;
            case 5:
                $scope.acStatus = $scope.monitorDefList;
                break;
			case 6:
				$scope.acStatus = $scope.nrcList;
				break;
			default :
                $scope.acStatus = $scope.allList;
                break;
		}
    };

	//从搜索页面进来后,因为status父路由是list,此时会启动父路由,导致loading先结束
	if($rootScope.isSearchFavorite){
		$scope.timerId = $interval(function(){
			if(!$rootScope.loading){
				$rootScope.startLoading();
				$interval.cancel($scope.timerId);
			}
		}, 20);
	}

	$scope.toDetail = function(item){
		console.info(item,'item')
		if(item.type == 'NRC'){
			$rootScope.go('nrcDetail', '', {nrcId:item.defectId,status:item.status,processId:""})
		}else{
			$rootScope.go('searchFault.faultClose','',{defectId: item.defectId, pt: true, defectInfo: {}, fromSearch: true})
		}
	};

	$scope.renderHtml = function(html_code){
		if(html_code){
			//var html_code = decodeURIComponent(escape(window.atob(html_code)));
	    	return $sce.trustAsHtml(html_code);
		}

	};

    $scope.changeTipState = function () {
        $scope.showTipState = !$scope.showTipState;
    };

	 //android调用
	 window.goBack = function(){
		$rootScope.go('back');
		$scope.$on('$locationChangeSuccess', function(event, newUrl){
	 		if(newUrl.indexOf('flightDetail')!=-1){
	 			window.goBack = function(){
					$rootScope.go('back');
				}
	 		}
	 	});
		window.goBack = function(){
			$rootScope.go('index');
		}
	}
};
