import axios from 'axios'
import store from 'store'
import {MessageBox} from 'element-ui'

const action = function (url, method, dat, opt) {
	const data = dat || {}
	const option = {};
    axios.defaults.baseURL = window.location.protocol+'//'+window.location.host+'/';
    let token = sessionStorage.token || "";
	if(opt=="gateway"){
		option.headers = {
			"Content-Type": "application/json; charset=utf-8",
			'X-Requested-With': 'XMLHttpRequest',
			'Cache-Control': 'no-cache',
            "X-ENV" : store.state.global.env,
			"token" : token
		};
		 option.withCredentials = true;
		axios.defaults.baseURL =store.state.global.gateway;
        axios.defaults.transformRequest = [function(data) {
            data = JSON.stringify(data);
            return data
        }]
    } else if(opt=="table"){
        axios.defaults.withCredentials = true;
		option.headers = {
			"Content-Type": "application/json;charset=utf-8",
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'application/json, text/javascript, */*; q=0.01',
			"token" : token
		};
        axios.defaults.transformRequest = [function(data) {
            data = JSON.stringify(data);
            return data
        }]
    } else {
		axios.defaults.withCredentials = true;
		option.headers = {
			"Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
			'X-Requested-With': 'XMLHttpRequest',
			'Accept': 'application/json, text/javascript, */*; q=0.01',
			"token" : token
		};

		axios.defaults.transformRequest = [function (data) {
			let ret = ''
			for (let it in data) {
			ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
			}
			ret = ret.substring(0, ret.lastIndexOf('&'));
			return ret
		}]
	}
    option.headers = option.headers || {}

	// option.headers['SfopenReferer'] = window.location
	// option.headers['lang'] = window.sessionStorage.getItem('lang')
	const promise = new Promise((resolve, reject) => {
		let req
		if (/^p/.test(method)) {
			req = axios[method](url, data, option)
		} else {
			option.params = data
			req = axios[method](url, option)
		}
		req.then((response) => {//NOSONAR
			let tmp = response.data
			if (typeof (tmp) === 'string') {
				try {
					tmp = JSON.parse(tmp)
				} catch (e) {
				}
			}
			if (tmp.success ||tmp.code==200) {

				resolve(tmp)
            }
			else {
				reject(tmp)
			}
		}, (xhr,text) => {
            let tmp = xhr.response;
            if (tmp && tmp.status && tmp.status==401) {
				MessageBox.confirm("登录过期，请重新登录", {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					window.location.href =  window.location.protocol+"//"+window.location.host + "/casLogin/index.html";
				});
            }else{
                reject({ msg: '网络异常，请刷新页面或者联系系统管理员！' })
            }
		})

	})
	return promise
}

const httpExt = {
	put(url, data, option) {
		return action(url, 'put', data, option)
	},
	putForm(url, data, option) {
		const opt = option || {}
		opt.headers = {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}
		opt.emulateJSON = true
		return action(url, 'put', data, opt)
	},
	post(url, data, option) {
		return action(url, 'post', data, option)
	},
	postJson(url, data, option) {
		return action(url, 'post', data, option)
	},
	postForm(url, data, option) {
		const opt = option || {}
		opt.headers = {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		}
		opt.emulateJSON = true
		return action(url, 'post', data, opt)
	},
	get(url, data, option) {
		/**添加时间戳,防止ie有缓存*/
		const data2 = data ? Object.assign(data, { time: new Date().getTime() }) : data;
		return action(url, 'get', data2, option)
	},
	delete(url, data, option) {
		return action(url, 'delete', data, option)
	}
}

export default {
	install(Vue) {
		axios.defaults.baseURL = store.state.global.url

		Vue.prototype.$axios = axios
		Vue.prototype.$httpExt = function () {
			return httpExt
		}
	}
}
