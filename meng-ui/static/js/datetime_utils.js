/**********************************************************
 * 页面日期控件输入格式校验
 * 当光标失去时进行校验
 *        支持格式：yyyy-MM-dd HH:ss:mm 、 yyyy/MM/dd HH:ss:mm
 **********************************************************/
var DateTimeUtils = {
    //校验对象
    self: null,
    //父框架
    parent_win: null,
    //错误提示位置
    errorPlace: null,
    //格式错误提示
    errorMessage: 'Datetime format is wrong. eg：2013-1-1 or 2013-9-2 12:00:00',//or 2013/9/2
    //普通校验规则
    rules: /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/,
    //精确校验规则
    precise_rules: /^((((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9]))|(((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9]))|(((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9]))|(([2468][048]00)(-)(0?2)(-)(29))|(([3579][26]00)(-)(0?2)(-)(29))|(([1][89][0][48])(-)(0?2)(-)(29))|(([2-9][0-9][0][48])(-)(0?2)(-)(29))|(([1][89][2468][048])(-)(0?2)(-)(29))|(([2-9][0-9][2468][048])(-)(0?2)(-)(29))|(([1][89][13579][26])(-)(0?2)(-)(29))|(([2-9][0-9][13579][26])(-)(0?2)(-)(29)))(\s(2[0-3]|1[0-9]|0?[0-9]):[0-5]?[0-9]:[0-5]?[0-9])?$/,
    //普通规则校验方法
    formats: function (value) {
        return (!value || null != value.match(this.rules)) ? true : false;
    },
    //精确规则校验方法
    precise_formats: function (value) {
        return (!value || null != value.match(this.precise_rules)) ? true : false;
    },
    //格式校验后
    format_after: null,
    //错误提示位置
    compareToPlace: null,
    //比较结果显示
    compareToMessage: '设置时间不能小于当前系统时间.',
    //校验格式之前
    compare_to_before: null,
    //校验格式之后
    compare_to_after: null,
    //比较大小	返回result：result=0 相等、result<0 begin小于end 、result>0 begin 大于 end
    compareTo: function (begin, end) {
        //将字符串转换为日期
        var begin = new Date(begin.replace(/-/g, "/"));
        var end = new Date(end.replace(/-/g, "/"));
        if (!this.compare_to_after) {
            return begin - end;
        } else {
            //添加比较后处理
            this.compare_to_before && this.compare_to_before(begin - end);
        }
    },
    //字符串转date
    to_date: function (val) {
        return new Date(val.replace(/-/g, "/"));
    }

};

/**
 * 页面初始化绑定事件
 */
$(function () {
    $('.combo-text.validatebox-text').live('blur', function () {
        var _result = DateTimeUtils.precise_formats(this.value);
        DateTimeUtils.self = this;
        if (!_result) {
            var _self = this;
            if (DateTimeUtils.parent_win) {
                DateTimeUtils.parent_win.$.dialog.alert('(' + this.value + ') ' + DateTimeUtils.errorMessage);
            } else {
                $.dialog.alert('(' + this.value + ') ' + DateTimeUtils.errorMessage);
            }
            //清空值并获取焦点
            //$(_self).val('').focus().parents('td:first').find('.combo-value').val('');
            //防止控件再次点击时混乱
            initDate(_self);
            //清空值并获取焦点
            $(_self).parent().prev().datebox('setValue', '');
        }
        //校验后处理
        DateTimeUtils.format_after && DateTimeUtils.format_after();
    });
});

/**
 * 当输入非法日期后，初始化日期控件
 *        防止控件再次点击时混乱
 */
function initDate(_self) {
    //设置当前时间
    var _date_box = $(_self).parent().prev();
    if (_date_box && 0 != _date_box.length) {
        var _cur_date = new Date();
        $(_self).parent().prev().datebox('setValue', _cur_date.getFullYear() + '-' + (_cur_date.getMonth() + 1) + '-' + _cur_date.getDate());
    }
}