/**********************************************************
 * 页面日期控件输入格式校验
 * 当光标失去时进行校验
 * 		支持格式：yyyy-MM-dd 、 yyyy/MM/dd
 **********************************************************/
var DateUtils = {
		//自动适配格式
		autoRule:false,
		//适配格式
		adapterFormat: null,
		//校验对象
		self:null,
		//父框架
		parent_win:null,
		//错误提示位置
		errorPlace:null,
		//非空
		required : false,
		requiredMsg : 'Date is required.',
		messageType : 'yyyy_MM_dd',
		//格式错误提示 
		errorMessage:'Date format is wrong. eg：',//or 2013/9/2
		errorDiv : '<div class="combo-error-genenal" style="color:red;">{1}</div>',
		//标签显示提示信息 showErrorToEle
		showError : false,
		//普通校验规则
		rules: /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/,	
		//精确校验规则
		precise_rules:/((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/,
		//根据日期格式检验
		formats_rules:{
			//yyyy-MM-dd HH:mm 格式校验
			yyyy_MM_dd_hh_mm : /^((((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9]))|(((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9]))|(((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9]))|(([2468][048]00)(-)(0?2)(-)(29))|(([3579][26]00)(-)(0?2)(-)(29))|(([1][89][0][48])(-)(0?2)(-)(29))|(([2-9][0-9][0][48])(-)(0?2)(-)(29))|(([1][89][2468][048])(-)(0?2)(-)(29))|(([2-9][0-9][2468][048])(-)(0?2)(-)(29))|(([1][89][13579][26])(-)(0?2)(-)(29))|(([2-9][0-9][13579][26])(-)(0?2)(-)(29)))(\s(2[0-3]|1[0-9]|0?[0-9]):[0-5]?[0-9])?$/,
			yyyy_MM_dd_hh_mm_ss : /^((((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9]))|(((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9]))|(((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9]))|(([2468][048]00)(-)(0?2)(-)(29))|(([3579][26]00)(-)(0?2)(-)(29))|(([1][89][0][48])(-)(0?2)(-)(29))|(([2-9][0-9][0][48])(-)(0?2)(-)(29))|(([1][89][2468][048])(-)(0?2)(-)(29))|(([2-9][0-9][2468][048])(-)(0?2)(-)(29))|(([1][89][13579][26])(-)(0?2)(-)(29))|(([2-9][0-9][13579][26])(-)(0?2)(-)(29)))(\s(2[0-3]|1[0-9]|0?[0-9]):[0-5]?[0-9]:[0-5]?[0-9])?$/
		},
		//消息处理
		messages : {
			yyyy_MM_dd	: '2013-9-2',
			yyyy_MM_dd_hh_mm : '2013-9-2 23:59',
			yyyy_MM_dd_hh_mm_ss : '2013-9-2 08:59:59'
		},
		//普通规则校验方法
		formats:function(value){
			return (!value||null!=value.match(this.rules))?true:false;
		},
		//精确规则校验方法
		precise_formats:function(value){
			return (!value||null!=value.match(this.precise_rules))?true:false;
		},
		//根据指定的检验规则校验
		auto_valid_format : function(value){
			this.messageType = this.adapterFormat;
			return (!value||null!=value.match(this.formats_rules[this.adapterFormat]))?true:false;
		},
		//格式校验后
		format_after:null,
		//错误提示位置
		compareToPlace:null,
		//比较结果显示
		compareToMessage:'Date must be later than today.',
		//校验格式之前
		compare_to_before:null,
		//校验格式之后
		compare_to_after:null,
		//比较大小	返回result：result=0 相等、result<0 begin小于end 、result>0 begin 大于 end
 		compareTo:function(begin,end){
			 //将字符串转换为日期
		      var begin=new Date(begin.replace(/-/g,"/"));
		      var end=new Date(end.replace(/-/g,"/"));
		      if(!this.compare_to_after){
		    	  return begin-end;
		      }else{
		    	  //添加比较后处理
		    	  this.compare_to_after && this.compare_to_after(begin-end);
		      }
		},
		compareTwoDate:function(begin,end){
			var _begin = null;
			var _end = null;
			if('string' == typeof(begin)){
				_begin=new Date(begin.replace(/-/g,"/"));
			}else{
				_begin = begin;
			}
			if('string' == typeof(end)){
				var _end=new Date(end.replace(/-/g,"/"));
			}else{
				_end = end;
			}
			
			var _result = _begin - _end;
			if(_result>0){
				_result = (_result/(1000*60*60*24) > 1)?_result:0;
			}
			
			return _result;
		},
		//比较大小	返回result：result=0 相等、result<0 begin小于end 、result>0 begin 大于 end
		compareToNow:function(end){
			var _begin = new Date();
			var _end = null;
			if('string' == typeof(end)){
				var _end=new Date(end.replace(/-/g,"/"));
			}else{
				_end = end;
			}
			
			var _result = _begin - _end;
			if(_result>0){
				_result = (_result/(1000*60*60*24) > 1)?_result:0;
			}
			
			return _result;
		},
		//字符串转date
		to_date:function(val){
			if(!val) return 0;
			
			return new Date(val.replace(/-/g,"/"));
		},
    // 日期转字符串
    formatDate: function (d, p) {
        if (!d)
            return '';
        var date = new Date(d.replace(/-/g, '/'));
        p = p || 'yyyy-MM-dd';
        var o = {
            "M+": date.getMonth() + 1, //month
            "d+": date.getDate(), //day
            "h+": date.getHours(), //hour
            "m+": date.getMinutes(), //minute
            "s+": date.getSeconds(), //second
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
            "S": date.getMilliseconds() //millisecond
        };
        if (new RegExp('y+').test(p)) {
            p = p.replace(RegExp.lastMatch, (date.getFullYear() + "").substr(4 - RegExp.lastMatch.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(p)) {
                p = p.replace(RegExp.lastMatch, RegExp.lastMatch.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return p;
    },
		// 可扩展的blur事件
		blur : function(ele){
			var _th = this;
			$(ele).parent().parent().find('.combo-error-genenal').remove();
			
			var _result = false;
			//当页面同时存在datebox和datetime时
			if($(ele).parent().prev().hasClass('datetimebox-f')){
				_result = (_th.autoRule&&_th.adapterFormat)?_th.auto_valid_format(ele.value):_th.precise_formats(ele.value);
			}else{
				_result = _th.precise_formats(ele.value);
			}
			
			_th.self = ele;
			if(!_result){
				_th.to_execute(ele,'('+ele.value+') '+ _th.errorMessage + _th.messages[_th.messageType]);
			}else{
				//非空控制
				if(_th.required && !ele.value){
					_th.to_execute(ele,_th.requiredMsg,'requir');
				}
			}
			//校验后处理
			this.format_after && this.format_after();
		},
		// 结果执行
		to_execute : function(ele,msgText,requir){
			var _self = ele;
			var _th = this;
			msgText = msgText || (_th.errorMessage+ _th.messages[_th.messageType]);
			requir = requir || '';
			if(!_th.showError){
				//弹出提示信息
				if(_th.parent_win){
					_th.parent_win.$.dialog.alert(msgText,function(){
						$(_self).focus();
					});
				}else{
					$.dialog.alert(msgText,function(){
						$(_self).focus();
					});
				}
			}else{
				//在页面上显示提示信息
				var text = _th.errorDiv.replace('{1}',msgText);
				$(ele).parent().parent().append(text);
				//获取焦点
				window.setTimeout(function(){
					$(_self).focus();
				},100);
			}
			//清空值并获取焦点
			//$(_self).val('').focus().parents('td:first').find('.combo-value').val('');
			//不是因空值引起的错误
			if(!requir){
				//防止控件再次点击时混乱
				initDate(_self);
				//清空值并获取焦点
				$(_self).parent().prev().datebox('setValue','');
			}
			
		},	// 结果执行
		//是否存在错误
		hasError : function(tab){
			
			if(!tab || tab.length == 0)return 0;
			
			return $(tab).find('.combo-error-genenal').length;
		},
		//清除所有错误提示
		clearError : function(tab){
			
			if(!tab || tab.length == 0)return 0;
			
			return $(tab).find('.combo-error-genenal').remove();
		}
		
};

/**
 * 页面初始化绑定事件
 */
$(function(){
	$('.combo-text.validatebox-text').live('blur',function(e){
		DateUtils.blur(this);
	});
});

/**
 * 当输入非法日期后，初始化日期控件
 * 		防止控件再次点击时混乱
 */
function initDate(_self){
	//设置当前时间
	var _date_box = $(_self).parent().prev();
	if(_date_box && 0 != _date_box.length){
		var _cur_date = new Date();
		$(_self).parent().prev().datebox('setValue',_cur_date.getFullYear()+'-'+(_cur_date.getMonth()+1)+'-'+_cur_date.getDate());
	}
}