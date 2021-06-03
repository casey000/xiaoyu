/**
 * 获取登录人信息
 * @returns {*}
 */
function getLoginInfoSC() {
    return window.top.document['_LOGIN_INFO_SC'];
}

/**
 * 设置登录人信息
 * @returns {*}
 */
function setLoginInfoSC(data) {
    window.top.document['_LOGIN_INFO_SC'] = data;
}
/**
 * 获取登录人信息
 * @returns {*}
 */
function getLoginInfoSC2() {
    if (window.top.document['_LOGIN_INFO_SC']) {
        return window.top.document['_LOGIN_INFO_SC'];
    }
    return getParentParam_().OWindow.top.document['_LOGIN_INFO_SC'];
}


/**
 * 格式化日期，只显示年-月
 * @returns {*}
 */
function dateFormatterToYM_(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    return y + '-' + (m < 10 ? ('0' + m) : m);
}
/**
 * 格式化日期，只显示到月
 * @returns {*}
 */
function dateFormatterToYM(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    return y + (m < 10 ? ('0' + m) : m);
}

/**
 * 格式化日期，只显示年-月-日
 * @returns {*}
 */
function dateFormatterToYMD_(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}

/**
 * 格式化日期，YYY-MM-DD HH:MI:SS
 * @returns {*}
 */
function dateFormatterToFull(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mi = date.getMinutes();
    var s = date.getSeconds();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d) + ' ' + (h < 10 ? ('0' + h) : h) + ':' + mi + ':' + s;
}

function dateFormatter_(targetForm){
    targetForm = targetForm || "#ffSearch";
    $(":input", targetForm).each(function (k, it) {
        if ($(it).hasClass("datebox-f")) {
            var dateboxValue=$(it).datebox("getValue");
            $(it).datebox({value:dateFormatterToTrue(dateboxValue)});
        }
        if ($(it).hasClass("datetimebox-f")) {
            var dateTimeboxValue=$(it).datetimebox("getValue");
            $(it).datetimebox({value:dateFormatterToTrue(dateTimeboxValue)});
        }
    });
}
/**
 * 格式化日期，
 * @returns {*}
 */
function dateFormatterToTrue(data) {
    var DATE_FORMAT = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/;
    if (DATE_FORMAT.test(data)||data ==null||data=='') {
        return data;
    }
    var year = data.substring(0, 2);
    year = '20' + year;
    var mm = data.substring(2, 4);
    var dd = data.substring(4, 6);
    if (data.length > 6) {
        var hh = data.substring(6, 8);
        var ss = data.substring(8, 10);
        return year + "-" + mm + "-" + dd + " " + hh + ":" + ss;
    }
    else {
        return year + "-" + mm + '-' + dd
    }

}
/**
 * 格式化日期，日期值为年月
 * @returns {*}
 */
function dateParserToYM(s) {
    var ss = (s.split('-'));
    var y = parseInt(ss[0], 10);
    var m = parseInt(ss[1], 10);
    if (!isNaN(y) && !isNaN(m)) {
        return new Date(y, m - 1);
    } else {
        return new Date();
    }
}

/**
 * 弹出年月日期面板
 * @returns {*}
 */
function showDatePanelYM(db) {
    var p = db.datebox('panel'), //日期选择对象
        tds = false, //日期选择对象中月份
        aToday = p.find('a.datebox-current'),
        yearIpt = p.find('input.calendar-menu-year'),//年份输入框
    //显示月份层的触发控件
        span = aToday.length ? p.find('div.calendar-title span') ://1.3.x版本
            p.find('span.calendar-text'); //1.4.x版本

//显示日趋选择对象后再触发弹出月份层的事件，初始化时没有生成月份层
    span.trigger('click'); //触发click事件弹出月份层
    if (!tds) setTimeout(function () {//延时触发获取月份对象，因为上面的事件触发和对象生成有时间间隔
        tds = p.find('div.calendar-menu-month-inner td');
        tds.unbind('click').bind('click', function (e) {
            e.stopPropagation(); //禁止冒泡执行easyui给月份绑定的事件
            var year = /\d{4}/.exec(span.html())[0]//得到年份
                , month = parseInt($(this).attr('abbr'), 10); //月份，这里不需要+1
            db.datebox('hidePanel')//隐藏日期对象
                .datebox('setValue', year + '-' + month); //设置日期的值
        });
    }, 0);
    yearIpt.unbind();//解绑年份输入框中任何事件
}

/**
 * @param cat module名
 * @param dataGridId datagrid
 * @param successCallBack 删除的回掉函数
 * @private
 * @auth:WaterMelon
 */
function onLoadSuccess_(cat, dataGridId, sucCallBack) {
    InitSuspend('a.attach', {
        'onmouseover': function (thiz, event, callback) {
            var index = $(thiz).attr("rowindex");
            var row = dataGridId.datagrid('getRows')[index];
            InitFuncCodeRequest_({
                data: {
                    SOURCE_ID: row.PKID,
                    CATEGORY: cat,
                    FunctionCode: 'ATTACHMENT_RSPL_GET'
                },
                successCallBack: function (jdata) {
                    var html = "";
                    var param = new Object();
                    for (var i = 0; i < jdata.data.length; i++) {
                        param[i] = {
                            PKID: jdata.data[i].PKID,
                            successCallBack: sucCallBack
                        }
                        html += '<li><a target="_blank" onclick="downFileLocal(' + jdata.data[i].PKID + ')">'
                            + jdata.data[i].ORG_NAME + '</a><span onclick="deleteFileSC_(\'' + param[i].PKID + '\');' +
                                // + jdata.data[i].ORG_NAME + '</a><span onclick="deleteFileSC_(\'' + jdata.data[i].PKID+ '\');' +
                            'return false;" class="icon-cross"></span></li>';
                    }
                    callback(html);
                }
            });
        }
    });
}

/**
 * 删除文件
 * @param pkid
 * @param successCallBack 成功之后的回掉函数
 * @private
 * @auth:WaterMelon
 */
function deleteFileSC_(param) {
    // console.log(param)
    // console.log(param["PKID"])
    if (!confirm("是否刪除"))
        return;
    InitFuncCodeRequest_({
        data: {pkid: param, FunctionCode: 'ATTACHMENT_DEL'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            }
        }
    });
}
/**
 * combobox如果值不存在提示
 * @private
 * @auth:WaterMelon
 */
function onHidePanel_() {
    var valueField = $(this).combobox("options").valueField;
    var val = $(this).combobox("getValue");  //当前combobox的值
    var allData = $(this).combobox("getData");   //获取combobox所有数据
    var result = true;      //为true说明输入的值在下拉框数据中不存在
    for (var i = 0; i < allData.length; i++) {
        if (val == allData[i][valueField]) {
            result = false;
        }
    }
    if (result && val != null && val != '') {
        MsgAlert({content: "值不存在所在的下拉框中", type: 'error'});
        $(this).combobox("clear");
    }
}

/**
 * 文件的展示（前提查出来的字段名叫FILE_UPLOAD）
 * @param value
 * @param row
 * @param index
 * @returns {string}
 * @constructor
 * @private
 * @auth:WaterMelon
 */
function FILE_UPLOAD_(value, row, index) {
    if (row.FILE_UPLOAD) {
        return '<a href="javascript:void(0);" rowindex="' + index + '" class="attach">' +
            '<img src="/img/edit2.png" border="0" style="width:15px;height:15px;"/></a>'
    }
}

/**
 * 调用后台请求
 * @param funcCodeAndData 参数和funcode组成的对象
 * @param successFunc 成功回调
 * @param failFunc 失败回调
 * @private
 * @auth:WaterMelon
 */
function codeRequestCom_(funcCodeAndData, successFunc, failFunc) {
    InitFuncCodeRequest_({
        data: funcCodeAndData,
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                if (successFunc != null && successFunc != undefined) {
                    successFunc(jdata);
                }
            } else {
                //获取返回的信息
                MsgAlert({content: jdata.msg, type: 'error'});
                if (failFunc != null && failFunc != undefined) {
                    failFunc(jdata);
                }
            }
        }
    })
}

/**
 * 右键按钮
 * @param funcCodeAnddata 参数和funcCode组成对象
 * @param checkField 检查的值
 * @param checkInfo 检查值的判断值
 * @param queMsg 询问信息
 * @param errMsg 抛出的错误提示
 * @param sucFunc 成功回调
 * @param failFunc 失败回调
 * @constructor
 * @private
 * @auth:WaterMelon
 */
//右键基础操作--只根据主键当参数的操作
function CodeRequestRight_(funcCodeAnddata, checkField, checkInfo, queMsg, errMsg, sucFunc, failFunc) {
    if (checkField == checkInfo) {
        if (queMsg != null && !confirm(queMsg)) {
            return;
        }
    } else {
        MsgAlert({content: errMsg, type: 'error'});
        return;
    }
    codeRequestCom_(funcCodeAnddata, sucFunc, failFunc);
}

/**
 * 初始化combobox
 * @param panelHeight 高
 * @param combox combobox对象
 * @param comboDate 数据
 * @param inOnHidePanel_ 是否存在
 * @param inOnChange_ onChange事件
 * @private
 * @auth:WaterMelon
 */
function initCombox_(panelHeight, combox, comboDate, inOnHidePanel_, inOnChange_) {
    var param = {}
    param.panelHeight = panelHeight
    param.data = comboDate
    param.valueField = 'VALUE'
    param.textField = 'TEXT'
    if (inOnChange_ != undefined && inOnChange_ != null && inOnChange_ != "") {
        param.onChange = inOnChange_;
    }
    // param.onChange=inOnChange_;
    if (inOnHidePanel_ != undefined && inOnHidePanel_ != null && inOnHidePanel_ != "") {
        param.onHidePanel = inOnHidePanel_;
    }
    combox.combobox(param);
}

/**
 * form表单浏览
 * @private
 * @auth:WaterMelon
 */
/*function onlyViewEasyUI_() {
    $("*[textboxname]").each(function (k, item) {
        $(item).validatebox({onlyview: true});
    });
}*/

/**
 * 初始化基本数据表格对象。
 * @param dg 表格的名字
 * @param queryParams 查询参数
 * @param pagesize 页面个数
 * @param pageList 集合个数
 * @param resize 长度
 * @returns {{}}
 * @private
 * @auth:WaterMelon
 */
function initdataGirdSC_(dg, queryParams, pagesize, pageList, resize) {
    var dataGrid = {};
    dataGrid.identity = dg;
    dataGrid.queryParams = queryParams;
    dataGrid.sortable = true;
    dataGrid.singleSelect = true;
    dataGrid.pageSize = pagesize;
    dataGrid.pageList = [pageList];
    if(resize!==null){
        dataGrid.resize = function () {
            return {
                height: ($(document.body).height() - $("fieldset").height() - resize) / 2
            };
        }
    }
    return dataGrid
}

/**
 * 初始化基本的显示列 alter根据返回对象实现
 * @param funcCode 初始化dataGrid的请求
 * @returns {{}}
 * @private
 * @auth:WaterMelon
 */
function initColumnsSC_(funcCode) {
    var columns = {}
    columns.param = {
        FunctionCode: funcCode
    };
    return columns;
}

/**
 * 右键功能实现
 * @param id
 * @param i18Text
 * @param auth
 * @param execFunc
 * @returns {{id: *, i18nText: *, auth: *, onclick: *}}
 * @private
 * @auth:WaterMelon
 */
function rightClickSC_(id, i18Text, auth, execFunc) {
    return {
        id: id,
        i18nText: i18Text,
        auth: auth,
        onclick: execFunc
    };
}

/**
 * 初始化列表中的combobox
 * @param data
 * @param dataMap
 * @param isEdit
 * @param validType
 * @param required
 * @returns {{}}
 * @private
 * @auth:WaterMelon
 */
function initColumnComboboxSC_(data, isEdit, validType, required, onChangeFunc) {
    var columnCombobox = {}
    var dataMap = DomainCodeToMap_(data);
    columnCombobox.formatter = function (value, row, index) {
        return dataMap[value]
    }
    if (isEdit) {
        var editor = {};
        editor.type = "combobox";
        var options = {};
        options.tipPosition = "top";
        options.valueField = 'VALUE';
        options.textField = 'TEXT';
        options.editable = isEdit;
        options.validType = validType;
        options.required = required;
        options.data = data;
        options.onHidePanel = onHidePanel_;
        options.onSelect = onChangeFunc;
        editor.options = options;
        columnCombobox.editor = editor;
    } else {
        columnCombobox.data = data;
    }
    return columnCombobox;
}

/**
 * 设置值
 * @param jQt
 * @param v
 */
function setValueBox(identity, field, value, isReadOnly, isRequired, isOnlyView) {
    var rowData = $('#' + identity).datagrid('getSelected');
    var index = getDG(identity).datagrid('getRowIndex', rowData);
    var ed = getDG(identity).datagrid('getEditor', {index: index, field: field});
    var jQt = $(ed.target);
    if (jQt.hasClass("combobox-f")) {
        jQt.combobox({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.combobox("getValue") : value
        });
    } else if (jQt.hasClass("combotree-f")) {
        jQt.combotree('setValue', value);
        // jQt.combotree('readonly', isReadOnly);
    } else if (jQt.hasClass("datebox-f")) {
        // jQt.datebox('setValue', value);
        jQt.datebox({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.datebox("getValue") : value
        });
    } else if (jQt.hasClass("datetimebox-f")) {
        // jQt.datetimebox('setValue', value);
        jQt.datetimebox({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.datetimebox("getValue") : value
        });
    } else if (jQt.hasClass("numberbox-f")) {
        // jQt.numberbox('setValue', value);
        jQt.numberbox({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.numberbox("getValue") : value
        });
    } else if (jQt.hasClass("numberspinner-f")) {
        // jQt.numberspinner('setValue', value);
        jQt.numberspinner({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.numberspinner("getValue") : value
        });
        // jQt.combobox('readonly', isReadOnly);
    } else if (jQt.hasClass("switchbutton-f")) {
        v == true ? jQt.switchbutton('check') : jQt.switchbutton('uncheck');
    } else if (jQt.hasClass("slider-f")) {
        jQt.slider('setValue', value);
        // jQt.slider('readonly', isReadOnly);
    } else if (jQt.hasClass("textbox-f")) {
        // jQt.textbox('setValue', value);
        jQt.textbox({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.textbox("getValue") : value
        });
    }
}

function setValueSC(jQt, value, isReadOnly, isRequired, isOnlyView) {
    // var jQt = $(ed.target);
    if (jQt.hasClass("combobox-f")) {
        jQt.combobox({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.combobox("getValue") : value
        });
    } else if (jQt.hasClass("combotree-f")) {
        jQt.combotree('setValue', value);
        // jQt.combotree('readonly', isReadOnly);
    } else if (jQt.hasClass("datebox-f")) {
        // jQt.datebox('setValue', value);
        jQt.datebox({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.datebox("getValue") : value
        });
    } else if (jQt.hasClass("datetimebox-f")) {
        // jQt.datetimebox('setValue', value);
        jQt.datetimebox({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.datetimebox("getValue") : value
        });
    } else if (jQt.hasClass("numberbox-f")) {
        // jQt.numberbox('setValue', value);
        jQt.numberbox({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.numberbox("getValue") : value
        });
    } else if (jQt.hasClass("numberspinner-f")) {
        // jQt.numberspinner('setValue', value);
        jQt.numberspinner({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.numberspinner("getValue") : value
        });
        // jQt.combobox('readonly', isReadOnly);
    } else if (jQt.hasClass("switchbutton-f")) {
        v == true ? jQt.switchbutton('check') : jQt.switchbutton('uncheck');
    } else if (jQt.hasClass("slider-f")) {
        jQt.slider('setValue', value);
        // jQt.slider('readonly', isReadOnly);
    } else if (jQt.hasClass("textbox-f")) {
        // jQt.textbox('setValue', value);
        jQt.textbox({
            required: isRequired,
            onlyview: isOnlyView,
            readonly: isReadOnly,
            value: value == null ? jQt.textbox("getValue") : value
        });
    }
}


/**
 * 表单提交初始化
 * @param form form对象
 * @param funCode 请求的funcCode
 * @param successCallBack
 * @param inputDatas 数据
 * @constructor
 * @private
 * @auth:WaterMelon
 */
function InitEditFormCommon_(form, funCode, successCallBack, inputDatas) {
    form.form({
        onSubmit: function () {
            if (!postonce) {
                return
            }
            postonce = false;
            var isValidate = $(this).form('validate');
            if (!isValidate) {
                MsgAlert({content: "填写有误，不能保存！", type: 'error'});
                postonce = true;
                return false;
            }
            var datas;
            if (inputDatas != null && inputDatas != undefined) {
                datas = inputDatas;
            } else {
                datas = $.extend({}, form.serializeObject(), {FunctionCode: funCode});
            }
            InitFuncCodeRequest_({
                data: datas,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        getParentParam_().OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        successCallBack();
                        CloseWindowIframe();
                    } else {
                        postonce = true;
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
        }
    });

}

/**
 * 上传文件
 * @param dgStr
 * @param cat
 * @private
 * @auth:WaterMelon
 */
function common_uploadSc_(dgStr, cat, sucFunc, failFunc) {
    var rowdata = $('#' + dgStr).datagrid('getSelected');
    if (!rowdata.PKID)
        return;
    common_upload_({
        identity: dgStr,
        param: {
            cat: cat,
            sourceId: rowdata.PKID,
            PKID: rowdata.PKID,
            successCallBack: sucFunc,
            failCallBack: failFunc
        }
    })
}

/**
 * 获取行中textbox单元格（Editor）的值
 * @param identity
 * @param field
 * @param value
 */
function getEditorValue_(identity, field) {
    var rowData = $('#' + identity).datagrid('getSelected');
    var index = getDG(identity).datagrid('getRowIndex', rowData);
    var ed = getDG(identity).datagrid('getEditor', {index: index, field: field});
    return $(ed.target).textbox('getValue');
}

/**
 * 设置行中textbox单元格（Editor）的值
 * @param identity
 * @param field
 * @param value
 */
function setEditorValue_(identity, field, value) {
    var rowData = $('#' + identity).datagrid('getSelected');
    var index = getDG(identity).datagrid('getRowIndex', rowData);
    var ed = getDG(identity).datagrid('getEditor', {index: index, field: field});
    var jQt = $(ed.target);
    if (jQt.hasClass("combobox-f")) {
        jQt.combobox({value:value === null ? '' : value});
    } else if (jQt.hasClass("combotree-f")) {
        jQt.combotree({value:value === null ? '' : value});
    } else if (jQt.hasClass("datebox-f")) {
        jQt.datebox({value:value === null ? '' : value});
    } else if (jQt.hasClass("datetimebox-f")) {
        jQt.datetimebox({value:value === null ? '' : value});
    } else if (jQt.hasClass("numberbox-f")) {
        jQt.numberbox({value:value === null ? '' : value});
    } else if (jQt.hasClass("numberspinner-f")) {
        jQt.numberspinner({value:value === null ? '' : value});
    }else if (jQt.hasClass("textbox-f")) {
        jQt.textbox({value:value === null ? '' : value});
    }
}

/**
 * 校验combobox填写的值是否在下拉选项中存在
 * @param obj
 * @param msg
 */
function validSelectValue_(obj, msg) {
    var valueField = $(obj).combobox("options").valueField;
    var val = $(obj).combobox("getValue");  //当前combobox的值
    var allData = $(obj).combobox("getData");   //获取combobox所有数据
    var result = false;      //为false说明输入的值在下拉框数据中不存在
    if(val.length == 0){//没有输入值，默认不校验
        result = true;
    }else{
        for (var i = 0; i < allData.length; i++) {
            if (val == allData[i][valueField]) {
                result = true;
            }
        }
    }
    if (!result) {
        MsgAlert({content: msg, type: 'error'});
        $(obj).combobox("clear");
    }
}

/**
 * 比较两个日期的大小
 * @param date1
 * @param date2
 * @return number
 */
function compareDate_(d1, d2) {
    var dateStr1 = d1.replace(/\-/gi, "/");
    var dateStr2 = d2.replace(/\-/gi, "/");
    var data1 = Date.parse(dateStr1);
    var data2 = Date.parse(dateStr2);
    if (data1 < data2) {
        return -1;
    } else if (data1 == data2) {
        return 0;
    } else {
        return 1;
    }
}
function compareTime_(t1,t2){
var data1 = t1.subString(0,0);
var data2 = t1.subString(1,1);
var data3 = t2.subString(2,2);
var data4 = t2.subString(3,3);
if(data1 == 0 && data3<6){
    return 1;
}else if(data1 <24 && data3 == 0){
    return 1;
}else if(t1<24 && t2 <60){
    return 1;
}else{
    rturn -1;
}
}

/**
 * 格式化时间为YYYYMMDDHHMISSFFF
 * @param date
 * @return String
 */
function dateFormatterToFull_(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mi = date.getMinutes();
    var s = date.getSeconds();
    var ms = date.getMilliseconds();
    return y + (m < 10 ? ('0' + m) : m) + d + h + mi + s + ms;
}
/**
 * 回车事件
 * @param searchInput
 * @param searchFunc
 * @constructor
 */
function EnterSearch(searchInput, searchFunc) {
    var initObj = {
        keyHandler: {
            enter: function () {
                if ((typeof searchFunc == 'function') && searchFunc.constructor == Function) {
                    searchFunc();
                } else {
                    return false;
                }
            },
        },
        onSelect: function () {
            $(this).combo("textbox").focus();
        }
    }

    function textBoxEnter(input__) {
        input__.textbox('textbox').keydown(function (e) {
            if (e.keyCode == 13) {
                searchFunc();
            }
        });
    }

    function combobox(input__) {
        input__.combobox("options").keyHandler.enter = function () {
            var values = $(this).combobox("getValues");
            $(this).combobox("setValues", values);
            $(this).combobox("hidePanel");
            //下面增加你自己想要处理的逻辑
            //TODO
            if ((typeof searchFunc == 'function') && searchFunc.constructor == Function) {
                searchFunc();
            } else {
                return false;
            }
        };
        input__.combobox({
            onSelect: function () {
                $(this).combo("textbox").focus();
            }
        })
    }

    for (var i in searchInput) {
        var id = "#" + searchInput[i].trim();
        var input__ = $(id);
        var type = "textbox";
        if (input__.attr('class').indexOf("easyui-datebox") != -1) {
            type = "datebox";
            input__[type](initObj);
            // input__.combo(initObj)
        } else if (input__.attr('class').indexOf("easyui-combobox") != -1) {
            type = "combobox";
            combobox(input__);
        } else {
            textBoxEnter(input__);
        }
        // type=="textbox" ? :;
    }
}

/**
 * 回车事件
 * @param searchFunc
 * @param formId
 * @constructor
 */
function EnterSearchSC(searchFunc, formId) {
    formId = formId || "#ffSearch";
    var initObj = {
        keyHandler: {
            enter: function () {
                if ((typeof searchFunc == 'function') && searchFunc.constructor == Function) {
                    searchFunc();
                } else {
                    return false;
                }
            },
        },
        onSelect: function () {
            $(this).combo("textbox").focus();
        }
    }

    function textBoxEnter(input__) {
        input__.textbox('textbox').keydown(function (e) {
            if (e.keyCode == 13) {
                searchFunc();
            }
        });
    }

    function doEnter(target) {
        var state = $.data(target, 'datebox');
        var opts = state.options;
        var current = state.calendar.calendar('options').current;
        if (current) {
            setValue(target, opts.formatter.call(target, current));
            $(target).combo('hidePanel');
        }
    }

    function setValue(target, value, remainText) {
        var state = $.data(target, 'datebox');
        var opts = state.options;
        var calendar = state.calendar;
        calendar.calendar('moveTo', opts.parser.call(target, value));
        if (remainText) {
            $(target).combo('setValue', value);
        } else {
            if (value) {
                value = opts.formatter.call(target, calendar.calendar('options').current);
            }
            $(target).combo('setText', value).combo('setValue', value);
        }
    }

    function _18(_1e, _1f, _20) {
        var _21 = $.data(_1e, "datebox");
        var _22 = _21.options;
        var _23 = _21.calendar;
        _23.calendar("moveTo", _22.parser.call(_1e, _1f));
        if (_20) {
            $(_1e).combo("setValue", _1f);
        } else {
            if (_1f) {
                _1f = _22.formatter.call(_1e, _23.calendar("options").current);
            }
            $(_1e).combo("setText", _1f).combo("setValue", _1f);
        }
    };

    function datebox(input__) {
        input__.datebox({
            keyHandler: {
                up: function (e) {
                }, down: function (e) {
                }, left: function (e) {
                }, right: function (e) {
                },
                enter: function (e) {
                    var state = $.data(this, 'datebox');
                    var opts = state.options;
                    var current = state.calendar.calendar('options').current;
                    var text = $(this).datebox('getText');
                    if (current && text != "" && text != undefined && text != null) {
                        setValue(this, opts.formatter.call(this, current));
                        // $(this).combo('hidePanel');
                    }
                    // doEnter(this)
                    //下面增加你自己想要处理的逻辑
                    //TODO
                    if ((typeof searchFunc == 'function') && searchFunc.constructor == Function) {
                        searchFunc();
                        $(this).combo('hidePanel');
                    } else {
                        return false;
                    }
                },
                query: function (q, e) {
                    setValue(this, q, true);
                    if (q == "" || q == null || q == undefined) {
                        $(this).combo('hidePanel');
                    }
                }
            },
            onSelect: function () {
                $(this).combo("textbox").focus();
            }
        });

        // input__.datebox({
        //     onSelect:function () {
        //         $(this).combo("textbox").focus();
        //     }
        // })
        // input__.datebox("textbox").keyHandler.query = function(q,e){
        //
        // }
    }


    function combobox(input__) {
        input__.combobox("options").keyHandler.enter = function () {
            var values = $(this).combobox("getValues");
            $(this).combobox("setValues", values);
            $(this).combobox("hidePanel");
            //下面增加你自己想要处理的逻辑
            //TODO
            if ((typeof searchFunc == 'function') && searchFunc.constructor == Function) {
                searchFunc();
            } else {
                return false;
            }
        }
        input__.combobox({
            onSelect: function () {
                $(this).combo("textbox").focus();
            }
        })
    }

    $(":input", "#" + formId).each(function (k, it) {
        var type = "textbox";
        if ($(it).hasClass("easyui-datebox")) {
            type = "datebox";
            datebox($(it));
            // $(it)[type](initObj)
        } else if ($(it).hasClass("easyui-combobox")) {
            type = "combobox";
            combobox($(it));
        } else if ($(it).hasClass("easyui-textbox")) {
            textBoxEnter($(it));
        }
    });
}

/**
 * 获取复选框的值，并拼接成以“;”分割的字符串
 * @param elName
 * @returns {string}  ex: "A;B;C;D;E;F"
 */
function getCheckBoxValues(elName) {
    var str = '';
    $('input[name="' + elName + '"]:checked').each(function () {
        str += $(this).val() + ';';
    });
    if (str.length > 0) {
        str = str.substring(0, str.length - 1);
    }
    return str;
}

/**
 * 解析以“;”分割的字符串，初始化复选框勾选状态
 * @param elName
 * @param elStr
 * @returns {string}  ex: "A;B;C;D;E;F"
 */
function initCheckBoxValues(elName, elStr) {
    var arr = new Array();
    if (elStr.length > 0) {
        arr = elStr.split(';');
    }
    for (i in arr) {
        $('input[name="' + elName + '"]:checkbox[value =' + arr[i] + ']').prop('checked', true);
    }
}
function excelPrint(identity, fileName, functionCode_, data) {
    var opt = getDgOpts(identity);
    functionCode = (data && data.functionCode) || opt.params.FunctionCode;
    var queryParams = getDG(identity).datagrid('options').queryParams;
    ShowWindowIframe({
        width: 400,
        height: 320,
        title: 'Excel打印',
        param: $.extend({
            DG_PARAMS: queryParams || {},
            functionCode: functionCode,
            fileName: fileName,
            functionCode_: functionCode_
        }, data || {}),
        url: '/views/excel_print.shtml'
    });
}
function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

//导出全部数据
function excelPrint_all(identity, fileName, functionCode_, data) {
    var opt = getDgOpts(identity);
    var functionCode = (data && data.functionCode) || opt.params.FunctionCode;
    var queryParams = getDG(identity).datagrid('options').queryParams;
    var args = $.extend({}, queryParams || {}, {functionCode: functionCode, fileName: fileName, jsParam: '',rows: 2147483647});
    doPost(Constant.API_URL + functionCode_, args);
}

//导出保函数据
function excelPrint_bh(identity, fileName, functionCode_) {
    var functionCode = 'Y_MM_GUARANTEE_PRINT_LIST';
    var queryParams = getDG(identity).datagrid('options').queryParams;
    var args = $.extend({}, queryParams || {}, {functionCode: functionCode, fileName: fileName, jsParam: '',rows: 2147483647});
    doPost(Constant.API_URL + functionCode_, args);
}

/**
 * 转换数据域文本值
 * @param domainMap 数据域
 * @param oldValue 原始值
 * @return String
 */
function transformValue(domainMap,oldValue){
    if(null == domainMap){
        return '';
    }
    if(null == oldValue || '' == oldValue){
        return '';
    }
    return null == domainMap[oldValue] ? oldValue : domainMap[oldValue];
}

/** 下载LOCAL HTTP方式 */
function downFileLocal(pkid,url) {
    InitFuncCodeRequest_({
        data: {pkid: pkid,url: url,FunctionCode: 'SYS_HTTP_LOCAL_DOWN'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                doPost(Constant.API_URL + "SYS_HTTP_LOCAL_DOWN", {pkid: pkid,url: url,down: 'Y'});
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

/** 校验工作流 */
function validWorkFlow(objKey,objNo) {
    var executionId = '';
    InitFuncCodeRequest_({
        async: false,
        data: {objKey: objKey,objNo: objNo,FunctionCode: 'VALID_WORK_FLOW'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if(jdata.data){
                    executionId = jdata.data.EXECUTION_ID;
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    return executionId;
}

/** 删除工作流 */
function deleteWorkFlow(objKey,objNo,executionId) {
    InitFuncCodeRequest_({
        data: {objKey: objKey,objNo: objNo,executionId: executionId,FunctionCode: 'DELETE_WORK_FLOW'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

/** 多文件上传 */
function common_upload_batch(edopt){
    var title_ =  $.i18n.t('common:COMMON_OPERATION.UPLOAD');
    ShowWindowIframe({
        width:  575,
        height: 400,
        title: title_,
        param: $.extend({},edopt.param),
        url: "/views/lm/lmNrcBatchUpload.shtml"
    });
}

/**ajax加载遮罩层*/
function ajaxLoading() {
    $("body").append("<div id='textboxDiv'></div>");
    var id = "#textboxDiv";
    var left = ($(window).outerWidth(true) - 190) / 2;
    var top = ($(window).height() - 35) / 2;
    var height = $(window).height() ;
    $("<div class=\"datagrid-mask\"></div>").css({ display: "block", width: "100%", height: height }).appendTo(id);
    $("<div class=\"datagrid-mask-msg\"></div>").html("正在加载,请稍候...Waiting...").appendTo(id).css({ display: "block", left: left, top: top });
}
/**ajax销毁遮罩层*/
function ajaxLoadEnd() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
}

/**
 * 获取复选框的值，并拼接成以“,”分割的字符串
 * @param elName
 * @returns {string}  ex: "A,B,C,D,E,F"
 */
function getCheckBoxValues(elName) {
    var str = '';
    $('input[name="' + elName + '"]:checked').each(function () {
        str += $(this).val() + ',';
    });
    if (str.length > 0) {
        str = str.substring(0, str.length - 1);
    }
    return str;
}

/**
 * 解析以“,”分割的字符串，初始化复选框勾选状态
 * @param elName
 * @param elStr
 * @returns {string}  ex: "A,B,C,D,E,F"
 */
function initCheckBoxValues(elName, elStr) {
    var arr = new Array();
    if (elStr && elStr.length > 0) {
        arr = elStr.split(',');
    }
    for (i in arr) {
        $('input[name="' + elName + '"]:checkbox[value =' + arr[i] + ']').prop('checked', true);
    }
}

/**
 * form表单浏览
 * @private
 * @auth:WaterMelon
 */
function onlyViewEasyUI_() {
    $("* [textboxname]").each(function(k,it){
        if($(it).hasClass("easyui-combogrid")){
            $(it).combogrid({value:$(it).combogrid('getValue'), editable:false, onlyview:true});
        }else if($(it).hasClass("easyui-combobox")){
            $(it).combobox({value:$(it).combobox('getValue'), editable:false, onlyview:true});
        }else if($(it).hasClass("easyui-textbox")){
            $(it).textbox({value:$(it).textbox('getValue'), editable:false, onlyview:true});
        }else if($(it).hasClass("easyui-numberbox")){
            $(it).numberbox({value:$(it).numberbox('getValue'), editable:false, onlyview:true});
        }else if($(it).hasClass("easyui-datebox")){
            $(it).datebox({value:$(it).datebox('getValue'), editable:false, onlyview:true});
        }else if($(it).hasClass("easyui-datetimebox")){
            $(it).datetimebox({value:$(it).datetimebox('getValue'), editable:false, onlyview:true});
        }
    });
    $(':checkbox').prop('disabled','disabled');
}

