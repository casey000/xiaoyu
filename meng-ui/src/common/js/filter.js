//自定义过滤器 第一个参数（value） 是需要过滤的值
export default {
	install(Vue, options) {
		/**
		 * @author：lzb
		 * @function: 保留小数位
		 * @pramas: len 保留小数位数
		 */
		Vue.filter('fixed', function(value, len) {
			var _len = len || 2
			var n = parseFloat(value)
			return n.toFixed(_len)
		});


		Vue.filter('dateFormat',function formatDate(val, fmt) {
                if (val) {
                    var dt = new Date(val);
                    fmt || (fmt = 'yyyy-MM-dd');
                    var o = {
                        "M+": dt.getMonth() + 1, //月份
                        "d+": dt.getDate(), //日
                        "h+": dt.getHours(), //小时
                        "m+": dt.getMinutes(), //分
                        "s+": dt.getSeconds(), //秒
                        "q+": Math.floor((dt.getMonth() + 3) / 3), //季度
                        "S": dt.getMilliseconds() //毫秒
                    };
                    if (/(y+)/.test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (dt.getFullYear() + "").substr(4 - RegExp.$1.length));
                    }
                    for (var k in o)
                        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                    return fmt;
                    return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate();
                } else {
                    return '';
                }

		});
		/**
		 * @author：lzb
		 * @function: 数值转化为货币
		 * @pramas: places 保留小数位数
		 * 			symbol 货币符号
		 * 			thousand 整数部分千位分隔符
		 *  		decimal 小数分隔符
		 */
		Vue.filter('formatMoney', function(value, places, symbol, thousand, decimal) {
			places = !isNaN(places = Math.abs(places)) ? places : 2;
			symbol = symbol !== undefined ? symbol : "$";
			thousand = thousand || ",";
			decimal = decimal || ".";
			var number = value,
				negative = number < 0 ? "-" : "",
				i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
				j = (j = i.length) > 3 ? j % 3 : 0;

			return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
		})
		
	}
}
