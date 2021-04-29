var mode = "debug";

var oauthServer = {
	debug : "http://10.88.15.121:8080/me-mobile/"
	// debug : "http://10.88.5.53:8080/me-mobile/"//勃哥
	// debug : "http://10.88.5.140:8080/me-mobile/"//吴波
	// debug : "http://10.88.5.74:8081/me-mobile/"//志刚
	// debug : "http://10.88.5.51:8080/me-mobile/"//陈瑜
	// debug : "http://10.88.5.90:8082/me-mobile/",//斌斌
	//debug:  "https://sfamemb.sf-express.com/"
	//mvn : "http://localhost:8080/maoc-dev",
	////test : "http://10.88.15.65"
};

var clientId = {
	debug : "memobile"
	//debug : "maoc",
	///mvn : "maoc",
	//test : "maoc"
};


var responseType = {
	debug : "token",
	mvn : "token",
	test : "token"
};

var callbackUri = {
	// debug : "http://10.88.5.122:8090/maoc/maoc.html#/?",
	// mvn : "http://localhost:8090/maoc-dev/maoc/maoc.html#/?",
	// test : "http://10.88.15.65/maoc/maoc.html#/?"
	debug : "http://localhost:63344/apicloud-me-trunk/maoc.html#/?"
};
