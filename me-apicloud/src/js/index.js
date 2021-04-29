require('angular');
require('angular-animate');
require('angular-translate');
require('angular-translate-loader-static-files');
require('angular-sanitize');
require('angular-touch');
require('mobile-angular-ui');//test
require('angular-ui-router');
require('mobile-angular-ui.gestures');
require('localforage');
require('angular-localforage');
require('./Server/myServers.js');
require('pdfjs-dist');
require('angular-pdf');

var app = angular.module('myApp', ['ngSanitize', 'ui.router', 'ngAnimate', 'ngTouch', 'myServers', 'pascalprecht.translate', 'mobile-angular-ui', 'mobile-angular-ui.gestures', 'LocalForageModule','pdf']);
require('../../dist/js/templates/templates.js');

app.run(['$rootScope', '$location', '$window', '$timeout', 'paramTransfer', '$state', 'server', 'configInfo', 'airport', 'favoriteFlight', 'flightInfo', 'flightFaultInfo', 'mefilterFlightInfo', '$localForage',
	function($rootScope, $location, $window, $timeout, paramTransfer, $state, server, configInfo, airport, favoriteFlight, flightInfo, flightFaultInfo, mefilterFlightInfo, $localForage) {

		'use strict';
		var lanConfig = require('../../i18n/lanConfig');
		server.parseToken();
		$rootScope.loadAuthorityIng = true;
		server.getAuthority().then(function(data) {
			if(data.data && data.data.authorities instanceof Array) {
				data.data.authorities.forEach(function(item, index) {
					$rootScope[item] = true;
				});
				$rootScope.loadAuthorityIng = false;
				if($rootScope.ADMIN || $rootScope.ME_RELEASE) {
					configInfo.initMyId();
				}
				configInfo.userCode = data.data.user_name;
                configInfo.setAuthorities(data.data.authorities);
				configInfo.setUser(data.data.user_name);
            }
		}).catch(function(error) {
			console.log(error);
		});
		
		//全局当前时间戳
		$rootScope.preTimeParse = $rootScope.curTimeParse = Date.now();
		//me选择的日期需要区分10:00之前与之后
		var today = new Date();
		if(today.getHours() < 10 ){
			today.setDate(today.getDate()-1);
			$rootScope.preTimeParse = today.getTime();
		}

		/**
		 * 监测网络是否超时和错误
		 */
		$rootScope.netWorkErr = false;
		$rootScope.errTip = '';
		$rootScope.scalEnabled = false;
		$rootScope.setNewWortStatus = function(error){
			var  netWorkStatus = error.status;
			var  errInfo = error.errInfo;
			$rootScope.endLoading();
			$rootScope.netWorkErr = false;
			$rootScope.interfaceErr = false;
			if(netWorkStatus >= 500){
				if(netWorkStatus== 504){
					$rootScope.errTip = "当前版本不是最新版本，请更新APP";
					return;
				}
				$rootScope.interfaceErr = true;
				$rootScope.errTip =  errInfo || ($rootScope.interfaceName + lanConfig.interfaceErr);
				$rootScope.errTip =  $rootScope.interfaceName + lanConfig.interfaceErr;
			}else if(netWorkStatus == 400) {
				$rootScope.errTip =  errInfo || ($rootScope.interfaceName + lanConfig.interfaceErr);
				
			} else if(netWorkStatus == 401) {
				
				NativeAppAPI.tokenExpired();
				$rootScope.netWorkErr = true;
				
			}else if(netWorkStatus == 403) {
					$rootScope.errTip = $rootScope.interfaceName + lanConfig.right;
			}else if(netWorkStatus == -1){
				$rootScope.errTip = lanConfig.networkErr;
				$rootScope.netWorkErr = false;
			}else{
				$rootScope.netWorkErr = false;
				$rootScope.errTip = '';
			}
			$timeout(function() {
				$rootScope.netWorkErr = false;
//				$rootScope.errTip = '';
			}, 1500);
		}
		
		
		//判断是否安卓
		if(navigator.userAgent.indexOf("Android") > -1){
			$rootScope.android = true;
		}
		//ios
		var u = navigator.userAgent;
		if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
			$rootScope.ios = true;
		}

		/**
		 * Helper method for main page transitions. Useful for specifying a new page partial and an arbitrary transition.
		 * @param  {String} path               The root-relative url for the new route
		 * @param  {String} pageAnimationClass A classname defining the desired page transition
		 */
		$rootScope.go = function(path, pageAnimationClass, param, options) {
			//android 返回 初始
			window.goBack = function(){
				$rootScope.go('back');
			}

			//安卓返回键,先解除上次绑定,再绑定新事件,避免重复绑定
			if(path != 'back'){
				api.removeEventListener({
					name: 'angularKeyback'
				});
				api.addEventListener({
					name: 'angularKeyback'
				}, function(ret, err){
					$rootScope.go('back');
				});
			}


			if(typeof(pageAnimationClass) === 'undefined') { // Use a default, your choice
				$rootScope.pageAnimationClass = 'crossFade';

			} else { // Use the specified animation
				$rootScope.pageAnimationClass = pageAnimationClass;
			}
			
			$timeout(function(){
				$rootScope.pageAnimationClass = false;
			},410);
			
			if(path === 'back') {
				if($rootScope.loading == true){
					$rootScope.endLoading();
				}
				$timeout(function(){
                    $window.history.back();
				}, 100);

			} else {
				//if(path == 'flightStatus.flightDetail' && window.webkit && window.webkit.messageHandlers.pushNewPage &&param.openInFlightInfo == true){
				//	window.webkit.messageHandlers.pushNewPage.postMessage({newPage:'messageDetail',flightId:param.flightId});
				//}else{
                $timeout(function(){
                    $state.go(path, param, options);
                }, 100);

				//}
			}
			if(param&&param.formId&&(-1!=param.formId.indexOf('TBM-005')||-1!=param.formId.indexOf('TBM-002-A')||-1!=param.formId.indexOf('TBM-004'))){
				sessionStorage.cardType = 'nonRoutineMaintenance'
			}
			if(param&&param.formId&&(-1!=param.formId.indexOf('TBM-002-B')||-1!=param.formId.indexOf('TBM-003-A'))){
				sessionStorage.cardType = 'routineMaintenance'
			}
			if(param&&param.formId&&(-1!=param.formId.indexOf('TBM-001'))){
				sessionStorage.cardType = 'flb'
			}
		};

		$rootScope.goTopRootViewController = function () {
			if (window.webkit && window.webkit.messageHandlers.goTopRootViewController){
				window.webkit.messageHandlers.goTopRootViewController.postMessage({});
			}else if(typeof window.WebViewJavascriptBridge !="undefined"){
				window.WebViewJavascriptBridge.callHandler(
					'goExit'
					, {'param': 'value'}
					, function(responseData) {

					}
				);
			}else{
				$rootScope.go('index','slideRight');
			}
		}


		$rootScope.startLoading = function() {
			$rootScope.loading2 = true;
			//当有子级路由时，返回时上级路由的loading会先结束，导致子路由数据会闪现一下空白，此参数置为false时,显示相应子路由的东西
			$rootScope.backRouter = true;
			$rootScope.loading = true;
		}
		$rootScope.endLoading = function() {
			$rootScope.loading2 = false;
			$rootScope.loading = false;
		}

		/*加载数据显示loading效果*/
		$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
			// to be used for back button //won't work when page is reloaded.
			var fromParent = fromState.name.substring(0, fromState.name.lastIndexOf('.'));
		 	var toParent = toState.name.substring(0, toState.name.lastIndexOf('.'));
			
		 	//父路由去子路由启动loading,子路由返回到父路由时不启动
		 	if(fromParent == toParent && (fromParent == '' || toParent == '') && typeof fromState.parent == 'undefined'
		 	   || fromParent.indexOf(toParent) == -1 && fromState.name.indexOf(toState.name) == -1
		 	   || fromState.name == toState.name
		 	   || typeof fromState.parent!='undefined' && fromState.parent != toState.name && toState.parent == fromState.name){
		 	   	
		 		$rootScope.startLoading();
		 	}
		 	/*
		 	 * 解决进入子view时父层view也有输入框时，在子view最后一个输入框点击下一项会弹出父层的bug
		 	 * 以下变量是隐藏显示父层时使用，变量为"子view名字"+View,例如，配置子view名字为sub,变量刚为subView
		 	 * 在父层要隐藏显示的地方用ng-show=‘!subView’
		 	 */
		 	if(toState.views){
		 		for(var key in toState.views){
		 			if(toState.views.hasOwnProperty(key)){
		 				$rootScope[ key +'View'] = true;
		 			}
		 			
		 		}
		 	}
		 	if(fromState.views){
		 		for(var key in fromState.views){
		 			if(fromState.views.hasOwnProperty(key)){
		 				$rootScope[key +'View'] = false;
		 			}
		 			
		 		}
		 	}
		 	   
		 	//当从放行任务页面回到维修列表页面时候清除sessionstorage,使工卡开闭状态清空
			if(toState && toState.templateUrl=='me/me-list.html'){
				sessionStorage.removeItem("cardType"); 
			}
			// tabbar控制，指定的一级页面显示tabbar，其它页面收藏tabbar
			var toHtmlURL  = toState.templateUrl;
            if (toHtmlURL == 'entry.html' || (toHtmlURL == 'flightInfo/flight-list.html' && toState.controller == 'flightController') || toHtmlURL == 'message/mess-list.html' || toHtmlURL == 'ddi/ddi-mytask.html') {
                NativeAppAPI.showTabBar();
             }
             else  {
                NativeAppAPI.hideTabBar();
            }

        });

        switchNightmode(server.nightmode);

		window.switchNightmode = function (isNightMode) {
			switchNightmode(isNightMode);
        };

        function switchNightmode(isNightMode) {
            if (+isNightMode) {
                document.getElementById('switch').setAttribute('href', 'dist/css/maoc-night.min.css');
            } else {
                document.getElementById('switch').setAttribute('href', 'dist/css/maoc.min.css');
            }
        }

		var lastPlayIndex = -1;
		$rootScope.isPlay = false;
		//播放录音
		$rootScope.playAudio = function (soundData, index) {
			if ((lastPlayIndex === index)&&($rootScope.isPlay === true)) {
				$rootScope.stopSound();
			}
			else {
				NativeAppAPI.audioPlayerStart(soundData);
				lastPlayIndex = index;
				$rootScope.isPlay = true;
				$rootScope.playIndex = index;
				//播放完成回调
				window.audioPlayerPlayEndCallback = function () {
					lastPlayIndex = -1;
					$rootScope.isPlay = false;
				}
			}
		}

		//停止播放录音
		$rootScope.stopSound = function () {
			NativeAppAPI.audioPlayerStop();
			lastPlayIndex = -1;
			$rootScope.isPlay = false;
		}

		//自定义confirm方法,如果未赋值,采用默认方法
		$rootScope.confirmCancel = function(){
			$rootScope.confirmShow = false;
		}

		/*
		* IOS端点击空白失去焦点
		* 判断dropdown-menu 输入框有自动完成下拉列表时,避免上下滑动时选中相应的值
		*/
		if($rootScope.ios){
			document.querySelector('body').addEventListener('touchend', function(e){
				if(e.target.tagName != 'INPUT' && e.target.tagName != 'TEXTAREA' && !e.target.parentNode.parentNode.classList.contains('dropdown-menu')) {
					angular.forEach(document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"], textarea'), function(node, index){
						node.blur();
					})
				}
			}, false)
		}

		//为了处理andriond返回键问题,故障模块保存了'fromSearchFault'
		//因为故障详情入口有多个,为了确保正确,程序刚进入删除fromSearchFault
		$localForage.removeItem('fromSearchFault').then(function() {
			console.log('fromSearchFault is cleared!');
		})
	}
]);

app.animation('.fold-animation', ['$animateCss', function($animateCss) {
	return {
		enter: function(element, doneFn) {
			var height = element[0].offsetHeight;
			return $animateCss(element, {
				from: {
					height: '0px'
				},
				to: {
					height: height + 'px'
				},
				duration: 1 // one second
			});
		}
	}
}]);

require('./Server/translation');
require('./directive/directive.js');
require('./controller/controllers.js');
require('./states.js');
require('./filter/filter.js');