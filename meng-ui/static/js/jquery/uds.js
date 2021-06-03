if (!window['googleLT_']) {
	window['googleLT_'] = (new Date()).getTime();
}
if (!window['google']) {
	window['google'] = {};
}
if (!window['google']['loader']) {
	window['google']['loader'] = {};
	google.loader.ServiceBase = '';
	google.loader.GoogleApisBase = '';
	google.loader.ApiKey = 'notsupplied';
	google.loader.KeyVerified = true;
	google.loader.LoadFailure = false;
	google.loader.Secure = true;
	// google.loader.GoogleLocale = 'www.google.com';
	google.loader.ClientLocation = null;
	google.loader.AdditionalParams = '';
}

// 取本地的地址,解决图表很久才出现的问题
google.loader.ServiceBase = '';
google.loader.GoogleApisBase = '';
google.loader.GoogleLocale = '';

if (window['google'] != undefined && window['google']['loader'] != undefined) {
	if (!window['google']['visualization']) {
		window['google']['visualization'] = {};
		google.visualization.Version = '1.0';
		// google.visualization.JSHash = '1af6fd65c53499a33119e115103a57a1';
		// google.visualization.LoadArgs =
		// 'file\75visualization\46v\0751.0\46packages\75corechart';
	}
	// google.loader.writeLoadTag("script", google.loader.ServiceBase +
	// "chart.js", false);
}