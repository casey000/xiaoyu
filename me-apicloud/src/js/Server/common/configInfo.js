module.exports =  angular.module('myServers').service('configInfo',['server', 'localStorage',function(server, localStorage){
	
	var configDataBase = {
		myId:'',
		airport:'ZGSZ',
		myName:''
	};

	var that = this;
	window.configInfo = this;
	that.configDataBase = configDataBase;
	that.setUser = setUser;
	that.setAuthorities = setAuthorities;
	that.initConfigInfo = initConfigInfo;
	that.initMyId = initMyId;
	that.authorities = [];

	this.airport = function () {
		return $api.getStorage('selairport4code') || configDataBase.airport;
	};

	this.myId = function () {
        //显示当前登录用户录入的licenseId
        var licenseKey = $api.getStorage('usercode') + 'license';
        return $api.getStorage(licenseKey);
	};

	this.myName = function () {
		return configDataBase.myName;
	}

	function setUser (userCode) {
		 that.user = userCode;
	};

	function setAuthorities (authorities) {
		 that.authorities = authorities;
	};

	function initConfigInfo(param){
		configDataBase.myId = param.myId||configDataBase.myId||'';
		configDataBase.airport = param.airport||configDataBase.airport||'';
		configDataBase.myName = param.myName||configDataBase.myName||'';
        var aiport = param.airport||configDataBase.airport||'';
		$api.setStorage('selairport4code', aiport);
	};
	
	/*function getAirport(){
		
		if(window.WebViewJavascriptBridge){
			window.WebViewJavascriptBridge.callHandler(
				'getLocalAirTerminal'					
				, {'param': ''}			
				, function(responseData) {		
					configDataBase.airport = JSON.parse(responseData).airport4code||'ZGSZ';
					
				}
			);
			
			
		}
	}*/
	
	function initMyId(){
		server.maocGetReq('maintain/meReleaseLicenseNo').then(function(data){
			if (data.status == 200) {
				if (data.data && angular.isArray(data.data.data)&&data.data.data.length) {
					configDataBase.myId = data.data.data[0].licenseNo;	
				}else {
					console.log('获取执照号失败');
				}
			}
		}).catch(function(error){
			console.log(error);
		});
	}

 }]);
