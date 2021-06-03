/* 追加自定义验证方法 */


// 身份证号码验证   
jQuery.validator.addMethod("isIdCardNo", function (value, element) {
    return this.optional(element) || isIdCardNo(value);
}, "请正确输入您的身份证号码");

// 字符验证   
jQuery.validator.addMethod("userName", function (value, element) {
    return this.optional(element) || /^[\u0391-\uFFE5\w]+$/.test(value);
}, "用户名只能包括中文字、英文字母、数字和下划线");

//密码验证 (密码必须包括数字、字母)
jQuery.validator.addMethod("pwdCheck", function (value, element) {
    return this.optional(element) || /^(?!\D+$)(?![^a-zA-Z]+$)/.test(value);
}, "Password must include Numbers and letters.");

// 手机号码验证   
jQuery.validator.addMethod("isMobile", function (value, element) {
    var length = value.length;
    return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/.test(value));
}, "请正确填写您的手机号码");

// 电话号码验证   (正确电话号码[格式:区号-号码])
jQuery.validator.addMethod("isPhone", function (value, element) {
    var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
    return this.optional(element) || (tel.test(value));
}, "a valid Phone[eg:0755-12345678]");

// 邮政编码验证   
jQuery.validator.addMethod("isZipCode", function (value, element) {
    var tel = /^[0-9]{6}$/;
    return this.optional(element) || (tel.test(value));
}, "请正确填写您的邮政编码");

//ATA章节只能为2、4、6位数字
jQuery.validator.addMethod("isAtaChapterType", function (value, element) {
    var tel = /^(\d{2}|\d{4}|\d{6}|\d{4}[ABC]|\d{4}[ABC]\d{2})$/;
    return this.optional(element) || (tel.test(value));
}, "ATA章节只能为2、4、6位数字,或者第5位为ABC的5位或者7位");

//ATA章节只能为4位数字
jQuery.validator.addMethod("isAta4ChapterType", function (value, element) {
    var tel = /^[\d]{4}$/;
    return this.optional(element) || (tel.test($.trim(value)));
}, "请输入4位数字ATA章节");

//websiteCheck验证 (网址必须以​http://开头)
jQuery.validator.addMethod("websiteCheck", function (value, element) {
    var weburl = /^(http:\/\/)|(https:\/\/)/i;
    return this.optional(element) || weburl.test(value);
}, "website Must begin with 'http://' or 'https://' .");

/**
 * 验证字符串最大长度,包括当前长度
 * (处理中文字符占两字节的情况)
 **/
jQuery.validator.addMethod("maxlength2", function (value, element, param) {
    return this.optional(element) || (getCharLength2(value) <= param * 1);
}, $.validator.format("长度最大不超出{0}个字节"));

/**
 * 验证字符串最大长度,包括当前长度
 * (处理中文字符占三字节的情况)
 **/
jQuery.validator.addMethod("maxlength3", function (value, element, param) {
    return this.optional(element) || (getCharLength3(value) <= param * 1);
}, $.validator.format("长度最大不超出{0}个字节"));
/**
 * 验证字符串最小长度,包括当前长度
 * (处理中文字符占两字节的情况)
 **/
jQuery.validator.addMethod("minlength2", function (value, element, param) {
    return this.optional(element) || (getCharLength2(value) >= param * 1);
}, $.validator.format("长度最小不低于{0}个字节"));

/**
 * 验证字符串最小长度,包括当前长度
 * (处理中文字符占三字节的情况)
 **/
jQuery.validator.addMethod("minlength3", function (value, element, param) {
    return this.optional(element) || (getCharLength3(value) >= param * 1);
}, $.validator.format("长度最小不低于{0}个字节"));


/**
 * 验证字符串格式
 * param: [value][string] 被验证的字符串
 * param: [isCN][bool] 是否允许中文
 * param: [isNum][bool] 是否允许数字(整数)
 * param: [isLetter][bool] 是否允许字母
 * param: [specialChars][string] 其它特殊字符，如果为null或“”表示不允许特殊字符
 **/
jQuery.validator.addMethod("checkCharType", function (value, element, param) {
    return this.optional(element) || checkCharType(value, param[0], param[1], param[2], param[3]);
}, "输入的内容格式不正确");

/**
 * 是否允许中文
 * param: [value][string] 被验证的字符串
 * param: [isCN][bool] 是否允许中文
 **/
jQuery.validator.addMethod("isNotChinese", function (value, element, param) {
    return this.optional(element) || isNotChinese(value, param);
}, "输入的内容不能包含中文");


//邮政编码验证   
jQuery.validator.addMethod("isRevision", function (value, element) {
    var revision1 = /^[0-9A-Z]{0,2}$/;
    var revision2 = /^[^R][0-9A-Z]{0,1}$/;
    return this.optional(element) || (revision1.test(value.toUpperCase())) && (revision2.test(value.toUpperCase()));
}, "请正确输入版本号");

//------------util-----------------------------------------------------------
/**
 *获得字符串长度（处理中文字符占两字节的情况）
 **/
function getCharLength2(value) {
    var length = 0;
    for (var i = 0; i < value.length; i++) {
        //大于127表示除了字母数字符号空格以外，其它的字符，如果需要精确到中文，则大于255
        if (value.charCodeAt(i) > 127) {
            length += 2;
        } else {
            length++;
        }
    }
    return length;
}

/**
 *获得字符串长度（处理中文字符占三字节的情况）
 **/
function getCharLength3(value) {
    var length = 0;
    for (var i = 0; i < value.length; i++) {
        //大于127表示除了字母数字符号空格以外，其它的字符，如果需要精确到中文，则大于255
        if (value.charCodeAt(i) > 127) {
            length += 3;
        } else {
            length++;
        }
    }
    return length;
}

/**
 * 验证字符类型
 * param: [value][string] 被验证的字符串
 * param: [isCN][bool] 是否允许中文
 * param: [isNum][bool] 是否允许数字(整数)
 * param: [isLetter][bool] 是否允许字母
 * param: [specialChars][string] 其它特殊字符，如果为null或“”表示不允许特殊字符
 **/
function checkCharType(value, isCN, isNum, isLetter, specialChars) {
    var regex_start = "^[";
    var regex_cur = "";
    var regex_end = "]+$";

    if (isCN) {
        regex_cur += "|\u4e00-\u9fa5";
    }
    if (isNum) {
        regex_cur += "|0-9";
    }
    if (isLetter) {
        regex_cur += "|a-zA-Z";
    }
    if (specialChars != null && specialChars != "") {
        var arr = specialChars.split("");
        for (var i = 0; i < arr.length; i++) {
            regex_cur += ("|" + arr[i]);
        }
    }

    var regex = new RegExp(regex_start + regex_cur + regex_end);
    return regex.test(value);
}

/**
 * 验证字符类型
 * param: [value][string] 被验证的字符串
 * param: [isCN][bool] 是否允许中文
 **/
function isNotChinese(value, isCN) {
    var regex_ = ".*";

    if (isCN) {
        regex_ = "^[^\u4e00-\u9fa5]+$";
    }

    var regex = new RegExp(regex_);
    return regex.test(value);
}

jQuery.extend(true, $.validator.defaults, {
    debug: true,
    onkeyup: false,
    errorElement: "div",

    errorPlacement: function (error, element) {
        error.appendTo(element.closest("td").find("div.errorMessage"));
    },

    highlight: function (element, errorClass) {
        $(element).addClass(errorClass);
    },

    success: function (label) {
        label.remove();
    }
});

//整数校验,含负数
jQuery.validator.addMethod("integer", function (value, element) {
    if (!value) return true;
    var _rex = /^(-?[0-9]+)$/;
//  return this.optional(element) || (revision1.test(value.toUpperCase()))&&(revision2.test(value.toUpperCase())) ;   
    var regex = new RegExp(_rex);
    return regex.test(value);

}, "Please enter a intger value.");

//整数校验,只含正整数
jQuery.validator.addMethod("Integer", function (value, element) {
    if (!value) return true;
    var _rex = /^[0-9]+$/;
    var regex = new RegExp(_rex);
    return regex.test(value);

}, "Please enter a intger value.");

// 日期格式验证
jQuery.validator.addMethod("preciseDate", function (value, element) {
    var preciseRule = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;

    if (value != null && value != "" && !preciseRule.test(value)) {
        return false;
    }
    return true;
}, "Please enter a valid date.");

//日期格式验证
jQuery.validator.addMethod("preciseDateTime", function (value, element) {
    var preciseRule = /((^((1[8-9]\d{2})|([2-9]\d{3}))(-)(10|12|0?[13578])(-)(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(11|0?[469])(-)(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))(-)(0?2)(-)(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)(-)(0?2)(-)(29)$)|(^([3579][26]00)(-)(0?2)(-)(29)$)|(^([1][89][0][48])(-)(0?2)(-)(29)$)|(^([2-9][0-9][0][48])(-)(0?2)(-)(29)$)|(^([1][89][2468][048])(-)(0?2)(-)(29)$)|(^([2-9][0-9][2468][048])(-)(0?2)(-)(29)$)|(^([1][89][13579][26])(-)(0?2)(-)(29)$)|(^([2-9][0-9][13579][26])(-)(0?2)(-)(29)$))/;
    var preciseTimeRule = /^(0?[0-9]|1[0-9]|2[0-3])(:)(0?[0-9]|[1-5][0-9])(:)(0?[0-9]|[1-5][0-9])$/;

    if (value != null && value != "") {
        var arr = value.split(" ");
        if (arr.length != 2) {
            return false;
        }

        if (!preciseRule.test(arr[0]) || !preciseTimeRule.test(arr[1])) {
            return false;
        }
    }
    return true;
}, "Please enter a valid datetime.");

//件号验证
jQuery.validator.addMethod("validpn", function (value, element) {
    var iptfilter = $.data(element, 'iptfilter');

    if (!iptfilter && $.iptfilter) {
        iptfilter = $(element).iptfilter();
    }

    if (iptfilter && !iptfilter.validate()) {
        var msg = "您录入的航材件号不符合新的件号标准，请修改录入错误的件号! \r\n\r\n";
        msg = msg + "新件号规则如下:\r\n";
        msg = msg + "1）大写英文字母(半角) A-Z\r\n";
        msg = msg + "2）阿拉伯数字(半角) 0-9\r\n";
        msg = msg + "3）英文中横线(半角) -\r\n";
        msg = msg + "4）英文小数点(半角) .\r\n";
        msg = msg + "5）英文井号(半角) #\r\n";
        msg = msg + "6）英文圆括号(半角) ( )\r\n";
        msg = msg + "7）英文正斜杠(半角) /\r\n";
        msg = msg + "8）英文反斜杠(半角) \\\r\n";
        msg = msg + "注：除了以上8类符号外，中文、&、*、？、%等其它的符号一律不允许。\r\n并且-.#()/\只能出现在字母或数字之间，不能出现在件号开头或结尾,也不能连续是这类符号! ";
        alert(msg);
        return false;
    }

    return true;
}, "Please enter a valid pn.");


jQuery.validator.addMethod("validtext", function (value, element) {
    var iptfilter = $.data(element, 'iptfilter');

    if (!iptfilter && $.iptfilter) {
        iptfilter = $(element).iptfilter();
    }

    if (iptfilter && !iptfilter.validate()) {
        return false;
    }

    return true;
}, function (params, element) {
    var message = "Please enter a valid text.";
    var iptfilter = $.data(element, 'iptfilter');
    if (iptfilter && iptfilter.settings.message) {
        message = iptfilter.settings.message;
    }
    return message;
});