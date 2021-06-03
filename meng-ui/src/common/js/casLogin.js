import cookieUtil from "./util/cookie";

function CAS() {
    this.url = GATEWAY
    this.appKey = window.appKey || APPKEY
    this.appSecret = window.appSecret || APPSECRET
    this.callback = null
    this.isLogin = false
    this.ENV = ENV || 'dev'
    this.redirectUrl = window.location.protocol+'//'+window.location.host + "/casLogin/index.html";
    this.casURL()
}

CAS.prototype.casURL = function () {
    if (this.ENV === 'sit' || this.ENV === 'dev' || this.ENV === 'uat' || this.ENV === 'test') {
        this.casloginURL = 'http://cas.sit.sf-express.com/cas/login'
        this.caslogoutURL = 'http://cas.sit.sf-express.com/cas/logout'
    } else if (this.ENV === 'pro') {
        this.casloginURL = 'https://cas.sf-express.com/cas/login'
        this.caslogoutURL = 'http://cas.sf-express.com/cas/logout'
    } else {
        alert('ENV环境参数值只能为sit、dev、uat、pro')
    }
}

CAS.prototype.triggerCASLogin = function () {
    window.location.href = this.casloginURL + '?service=' + this.redirectUrl
}

CAS.prototype.loginWithTicket = function (ticket) {
    if (!ticket) {
        return
    }

    if (!sessionStorage.deviceId) {
        sessionStorage.deviceId = getDeviceId()
    }

    let that = this
    let xhr = GetXmlHttpObject()
    let params = {
        ticket: ticket,
        service: this.redirectUrl,
        appKey: this.appKey,
        appSecret: this.appSecret,
        deviceId: sessionStorage.deviceId
    }
    params = JSON.stringify(params)
    let ticketUrl = this.url + '/user/cas/knock';
    xhr.open('POST', ticketUrl, false)
    xhr.setRequestHeader('content-type', 'application/json')
    xhr.send(params)

    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            let response = JSON.parse(xhr.response)
            if (response.success === true) {
                that.isLogin = true
                sessionStorage.token = response.obj.token;
                console.log('OK to knock gateway with cas-ticket,ready to navigation')
            } else if (response.success === false) {
                alert(response.errorMessage)
            } else {
                alert('网关' + that.url + '/knock接口访问错误！')
            }
        } else if (xhr.status === 430 || xhr.status === 401) {
            //失败,跳转到cas
            that.triggerCASLogin();
        } else {
            alert('网关' + that.url + '/knock接口访问错误！')
        }
    }
}

/**
 * 网关登录核心方法
 * @param cb
 * @returns {*}
 */
CAS.prototype.doLogin = function (cb) {
    if (getQueryString('ticket')) {
        this.loginWithTicket(getQueryString('ticket'))
    }

    if (!sessionStorage.token){
        this.triggerCASLogin();
        return;
    }

    // check token's validity
    let xhr = GetXmlHttpObject()
    let that = this
    let checkTokenUrl = that.url + '/gateway/check_token'

    console.log('begin to check token')

    xhr.open('GET', checkTokenUrl, false);
    try {
        xhr.send();

        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                if (JSON.parse(xhr.response).success === true) {
                    sessionStorage.userid = JSON.parse(xhr.response).obj.userid;
                    sessionStorage.username = JSON.parse(xhr.response).obj.username;
                    that.isLogin = true;
                    console.log('登陆成功！');
                    if (typeof that.callback === 'function' && that.callback) {
                        that.callback();
                    }
                    return cb(2);
                } else if (JSON.parse(xhr.response).success === false) {
                    alert(JSON.parse(xhr.response).errorMessage);
                    return cb(0);
                } else {
                    alert('网关' + that.url + '/check_token接口访问错误！');
                    return cb(0);
                }
            } else if (xhr.status === 401) {
                that.triggerCASLogin();
            } else {
                alert('网关' + that.url + '/check_token接口访问错误！');
                return cb(0);
            }
        }
    } catch (err) {
        return cb(0);
    }
}

CAS.prototype.casLogout = function () {
    try{
        this.gatewayLogout();
    }catch (e) {
        console.log(e.message);
    }

    sessionStorage.clear();
    localStorage.clear();
    this.isLogin = false;
    cookieUtil.delAllCookie();
    window.location.href = this.caslogoutURL + '?service=' + window.location.href;
}


CAS.prototype.gatewayLogout = function () {
    this.extendHttpRequestOpen(this);
    let logoutXHR = GetXmlHttpObject();
    logoutXHR.timeout = 3000;
    let logoutUrl = GATEWAY + '/user/auth/logout';
    logoutXHR.open('GET', logoutUrl, true);
    logoutXHR.onreadystatechange = function () {
        if (logoutXHR.readyState === 4) {
            if ((logoutXHR.status === 200 && JSON.parse(logoutXHR.response).success === true) || logoutXHR.status === 401) {
                console.log('成功退出网关');
            } else {
                console.log('网关 ' + that.url + '访问错误！');
            }
        }
    };

    logoutXHR.send();
}


CAS.prototype.casLogin = function (cb) {
    this.casURL();
    // 重写open方法
    this.extendHttpRequestOpen(this);
    this.doLogin(cb);
}

/**
 * 扩展HTTP请求Open方法
 */
CAS.prototype.extendHttpRequestOpen = function(login) {
    // 原来的open方法
    let rawOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(){
        rawOpen.apply(this, arguments);
        // 自定义请求头（需要在open方法后调用）
        try {
            this.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            this.setRequestHeader('Cache-Control', 'no-cache');

            if (sessionStorage.token) {
                this.setRequestHeader('token', sessionStorage.token);
            }

            let requestUrl = arguments[1];
            if (requestUrl.indexOf('/user/cas/knock') === -1
                && requestUrl.indexOf('/gateway/check_token') === -1
                && requestUrl.indexOf('/user/auth/logout') === -1
                && sessionStorage.userid) {
                this.setRequestHeader('sgs-userid', sessionStorage.userid);
                this.setRequestHeader('sgs-username', sessionStorage.userid);
            }
        } catch (e) {
            console.error('e', e);
        }

        // 允许跨域携带cookie
        this.withCredentials = true;

        this.addEventListener('load', function () {
            if (this.responseURL.indexOf('/user/cas/knock') === -1
                && this.responseURL.indexOf('/gateway/check_token') === -1
                && this.responseURL.indexOf('/user/auth/logout') === -1) {
                if (!that.isLogin || this.status === 401) {
                    console.warn('request isn\'t authenticated, ready to navigate to login page');
                    window.location.href = that.casloginURL + '?service=' + login.redirectUrl;
                }
            }
        }, false);
    }
}

function GetXmlHttpObject() {
    let xhr
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest()
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP')
    }
    if (xhr === null) {
        alert('您的浏览器不支持ajax')
        return
    }
    return xhr
}

function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) return r[2]
    return ''
}

function getDeviceId() {
    let s = []
    let hexDigits = 'abcdef'
    for (let i = 0; i < 10; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 6), 1)
    }
    let uuid = s.join('') + new Date().getTime()
    return uuid
}

CAS = new CAS()
export default CAS
