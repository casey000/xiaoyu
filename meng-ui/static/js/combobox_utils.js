/**
 * Created by tpeng on on 2016/5/20.
 * EasyUI Combobox autocomplete 显示插件
 * dependences : {constant.js, layer.js easyui tooltip}
 */
(function ($) {

    var cbxloader =
        function (opts, param, success, error) {
            //获取输入的值
            var value = param.q || "";
            //输入多少个字符后开始查询
            if (opts.autocomplete) {
                if (value.length < opts.minLen) return false;
            }
            AjaxCall_(opts.url, {q: value, rows: opts.rows}, function (jdata) {
                if (jdata.code != RESULT_CODE.SUCCESS_CODE) {
                    layer.msg($.i18n.t('msg_err:ERRMSG.ERR'), {icon: 5});
                    return;
                }
                if (opts.autocomplete) {
                    $(opts.thiz).combobox('loadData', jdata.data ? {data: []} : []);
                }
                //执行loader的success方法
                success(jdata);
            }, function (xml, text, msg) {
                error.apply(this, arguments);
            });
        };

    $.fn.MyCombobox = function (options) {

        var opts = $.extend({}, options, {
            minLen: (options.minLen || 0),
            rows: (options.rows || 20),
            autocomplete: true,
            mode: 'remote'
        });
        opts.thiz = this;
        opts.loader = function (param, success, error) {
            cbxloader(opts, param, success, error);
        };
        $(this).combobox(opts);
    };

})(jQuery);


/**
 * Created by tpeng on on 2016/5/20.
 * EasyUI datalist 显示插件
 * dependences : {constant.js, layer.js easyui tooltip}
 */
(function ($) {

    $.fn.MyDatalist = function (options) {
        var opts = $.extend({}, options);
        opts.thiz = this;
        AjaxCall_(opts.url, {}, function (jdata) {
            if (jdata.code != RESULT_CODE.SUCCESS_CODE) {
                layer.msg($.i18n.t('msg_err:ERRMSG.ERR'), {icon: 5});
                return;
            }
            var items = $.map(jdata.data, function (item) {
                return {
                    id: item.ID,
                    text: item.TEXT
                };
            });
            var mopts = {
                data: items,
                singleSelect: opts.singleSelect,
                valueField: "id",
                textField: "text",
                checkbox: true,
                lines: true
            };
            $(opts.thiz).datalist(mopts);

        }, function (xml, text, msg) {
            error.apply(this, arguments);
        });
    };

})(jQuery);

(function ($) {

    /**
     * columns: [[
     {field:'CODE',title:'编号',width:80},
     {field:'ELE_NAME',title:'数据元素名称',width:120},
     {field:'FIELD_TYPE',title:'数据类型',width:120},
     {field:'FIELD_LEN',title:'长度',width:80},
     {field:'FIELD_SCALE',title:'小数位',width:80}
     ]],
     * @param options
     * @constructor
     */
    $.fn.MyComboGrid = function (options) {
        var params = options.params || {};
        var opts = $.extend({}, {
            panelWidth: options.panelWidth || 380,
            width: 180,
            mode: 'remote',
            queryParams: params,
            fitColumns: true,
            pagination: true,
            idField: 'PKID',
            textField: 'TEXT',
            url: '/api/v1/plugins/' + params.FunctionCode
        }, options);
        $(this).combogrid(opts);
    };

})(jQuery);

function helpQuery(identity, functionCode, callback) {
    ShowWindowIframe({
        width: 700,
        height: 420,
        title: '查询帮助',
        param: {identity: identity, functionCode: functionCode, callback: callback},
        url: '/views/query_help.shtml'
    });
}