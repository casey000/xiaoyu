
setQrCode = function(code){
	window.getMeCardNo(code);
};

listenToSearchDamageByHandNews = function () {
    window.goToSearchByHandPage();
};

resetToken = function(accessToken){
	window.server.token = accessToken;
};

changNightMode = function(isNightMode) {
    window.switchNightmode(isNightMode);
};

window.reloadCurrentPage = function(path)
{	
	var indexOf2 = location.href.indexOf('?');
	var oldUrl = location.href;
	if (-1 != indexOf2) {
		oldUrl = location.href.slice(0,indexOf2);
	}
	 
	location.href = oldUrl + path;
	location.reload();
};

function connectWebViewJavascriptBridge(callback) {
	if (window.WebViewJavascriptBridge) {
		callback(WebViewJavascriptBridge)
	} else {
		document.addEventListener(
			'WebViewJavascriptBridgeReady'
			, function() {
				callback(WebViewJavascriptBridge)
			},
			false
		);
	}
};


connectWebViewJavascriptBridge(function(bridge) {
	bridge.registerHandler("functionInJs", function(data, responseCallback) {
		window.goBack();
		var responseData = "";
		responseCallback(responseData);
	});
	bridge.registerHandler("qrcodeResult", function(data, responseCallback) {
		window.getMeCardNo(data);
		var responseData = "";
		responseCallback(responseData);
	});
	bridge.registerHandler("tokenResult", function(data, responseCallback) {
		window.server.token = data;
		var responseData = "";
		responseCallback(responseData);
	});
});

// 音频采集及处理

audioPlayerPlayFaildCallback = function () {
    //没写window方法
};

audioCaptureDidFinish = function (data, time, format) {
    window.audioCaptureFinishCallback(data, time, format);
};

audioCaptureFaildedCallback = function () {
    //没写window方法
};

audioPlayerDidPlayFinish = function () {

	if(typeof (window.audioPlayerPlayEndCallback) !== 'undefined') {
        window.audioPlayerPlayEndCallback();
    }
};

audioPlayerDidPlayFaild = function () {
	//没写window方法
};


