const versionConfig = require("../../../../version.config.js");
module.exports = angular.module('myServers').service('server', ['$http', '$rootScope', 'umengEventIdTransform', function ($http, $rootScope, umengEventIdTransform) {

    this.token = '';
    window.server = this;
    var rootUrl = '';
    var lan = window.navigator.language.indexOf('zh') !== -1 ? 'zh-cn' : 'en-us';
    var that = this;
    this.newWorkStatus;
    this.lan = lan;
    this.appVersion = versionConfig.appVersion;
    this.parseToken = function () {
        // var requestParam = new UrlSearch();
        var requestParam = this.urlSearch();
        this.token = requestParam.access_token || localStorage.getItem('me_token');
        this.nightmode = requestParam.nightmode;
        requestParam.access_token && localStorage.setItem('me_token', requestParam.access_token)

        if (requestParam.appType && requestParam.appType === 'release') {
            var produceIp = $api.getStorage('produceIpAddress') ? $api.getStorage('produceIpAddress') : "https://sfamemb.sf-express.com/";

            rootUrl = produceIp + 'rs/';     //生产环境
            // rootUrl = 'https://sfamemb.sf-express.com/rs/';     //生产环境
            // rootUrl = 'http://rz-sfamemb.sfair.com/rs/';    //容灾环境
            // rootUrl = 'http://10.88.18.33/rs/';
        } else if (requestParam.appType && requestParam.appType === 'uat') {

            rootUrl = 'http://10.88.26.116:8083/me-mobile/rs/';
            // rootUrl = 'http://10.88.18.33/rs/';
        } else {
            var time = window.setInterval(function () {
                if (typeof api !== 'undefined') {
                    api.addEventListener({
                        name: 'changeIp'
                    }, function(ret, err){
                        var ip = $api.getStorage('ipAddress');
                        if (ip) {
                            if(ip == '10.88.18.33' || ip == 'memb.sfair.com' || ip == '10.88.15.116' || ip.indexOf('10.88.18.19') != -1){
                                rootUrl = "http://" + ip + "/rs/";
                            }else{
                                rootUrl = "http://" + ip + "/me-mobile/rs/";
                            }
                        }
                        else {
                            rootUrl = 'http://10.88.26.116:8083/me-mobile/rs/';
                            // rootUrl = 'http://10.88.18.33/rs/';

                        }
                    });
                    window.clearInterval(time);
                }
            },20);

            var ip = $api.getStorage('ipAddress');
            if (ip) {
                if(ip == '10.88.18.33' || ip == 'memb.sfair.com' || ip == '10.88.15.116' || ip.indexOf('10.88.18.19') != -1){
                    rootUrl = "http://" + ip + "/rs/";
                }else{
                    rootUrl = "http://" + ip + "/me-mobile/rs/";
                }
            }
            else {
                rootUrl = 'http://10.88.26.116:8083/me-mobile/rs/';
                // rootUrl = 'http://10.88.18.33/rs/';

            }
        }
    };

    this.userLoginUserCode = function () {
        var requestParam = this.urlSearch();
        this.userCode = requestParam.usercode;
        return this.userCode;
    }

    this.getAuthority = function () {
        var req = {
            method: 'GET',
            url: rootUrl + 'oauth/authority',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Accept-Language': lan,
                'version': this.appVersion
            }
        };
        return $http(req).then(function (data) {
            return data;
        }).catch(function (error) {
            return handlerError(error, 'oauth/authority')
        });
    };

    this.beTokenValid = function () {
        return this.token.length;
    };

    this.maocGetReq = function (pathUrl, params) {
        var req = {
            method: 'GET',
            url: rootUrl + pathUrl,
            params: params,
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Accept-Language': lan,
                'version': this.appVersion
            },
            timeout: 60000
        };
        //webAppEvernReport(pathUrl);
        umengEventIdTransform.umengSaveGetEvent(pathUrl, params);
        return $http(req).then(function (data) {
            return data;
        }).catch(function (error) {
            return handlerError(error, pathUrl)
        });
    };

    this.maocPostReq = function (pathUrl, params, beJson) {
        var httpConfig = {
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'version': this.appVersion
            },
            transformRequest: function (obj) {
                var str = [];
                for (var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
                return str.join("&");
            },
            timeout: 90000
        };
        if (beJson) {
            httpConfig = {
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json',
                    'version': this.appVersion
                },
                timeout: 90000
            }
        }
        //webAppEvernReport(pathUrl);
        umengEventIdTransform.umengSavePostEvent(pathUrl, params);
        return $http.post(rootUrl + pathUrl, params, httpConfig).then(function (data) {
            return data;
        }).catch(function (error) {
            return handlerError(error, pathUrl)
        });
    };

    this.maocFormdataPost = function (pathUrl, formId, formData, files) {
        var fd = new FormData();
        fd.append('formId', formId);
        if (files && angular.isArray(files)) {
            files.forEach(function (item) {
                console.log(item);
                fd.append('file', item, item.name);
            });
        }

        fd.append('formData', angular.toJson(formData, true));
        // console.log("-----------123123-------------");
        // console.log(JSON.stringify(fd));
        var httpConfig = {
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': undefined,
                'version': this.appVersion
            },
            timeOut: 90000,
            transformRequest: angular.identity
        };
        //umengEventIdTransform.umengSavePostEvent(pathUrl,params);
        return $http.post(rootUrl + pathUrl, fd, httpConfig).then(function (data) {
            return data;
        }).catch(function (error) {
            return handlerError(error, pathUrl)
        });
    }

    this.urlSearch = function () {
        var name, value;
        var str = location.href; //取得整个地址栏
        var num = str.indexOf("?")
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                this[name] = value;
            }
        }
        return this;
    }

    function handlerError(error, pathUrl){
        // if(error.status == 504){
        //         alert(error.data.error_description + " 请退出更新版本");
        //         return false;
        // }
        $rootScope.interfaceName = pathUrl;
        $rootScope.setNewWortStatus({
            status: error.status,
            errInfo: error.data && error.data.error_description || ''
        });
        return error;
    }

    function webAppEvernReport(interfaceName) {
        var eventName = interfaceName.replace('/', '_');
        if (-1 != eventName.indexOf('/')) {
            eventName = eventName.slice(0, eventName.indexOf('/'));
        }
        if (window.webkit && window.webkit.messageHandlers.webAppEvent) {
            window.webkit.messageHandlers.webAppEvent.postMessage({event: eventName});
        } else {
            MobclickAgent.onEvent(eventName);
        }
    }

}]);