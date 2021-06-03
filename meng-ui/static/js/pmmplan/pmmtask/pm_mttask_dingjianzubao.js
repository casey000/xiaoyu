function zubaoanniu() {
    MaskUtil.mask("数据请求中...");
    InitFuncCodeRequest_({
        data: {
            mttaskNo: param.MTTASK_NO, checkType: param.CHECK_TYPE, acno: param.ACNO,
            checkSeqno: param.CHECK_SEQNO,
            FunctionCode: 'A6DINGJIANZUBAO_ZUBAO'
        },
        successCallBack: function (jdata) {
            MaskUtil.unmask();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (!jdata.data.TMXI) {
                    MsgAlert({content: '没有找到相关的条目信息!', type: 'error'});
                    return;
                }
                InitDataGrid1(jdata.data.TMXI);
                InitDataGrid2(jdata.data.GKXX);
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function delDingJianZuBao() {
    InitFuncCodeRequest_({
        data: {mttaskNo: param.MTTASK_NO, FunctionCode: 'DINGJIANZUBAO_SHANCHU'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                $("#tiaomuxinxi").datagrid('loadData', {total: 0, rows: []});
                $("#gongkaxinxi").datagrid('loadData', {total: 0, rows: []});
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}


var param = {};
$(function () {
    param = getParentParam_();
    if (param.STATUS_STAT.indexOf("已发布") != -1) {
        $("#shanchu").hide();
    }
    $("#mttaskNo").textbox({editable: false, value: param.MTTASK_NO});
    $("#checkSeqno").textbox({editable: false, value: param.CHECK_SEQNO});
    $("#checkType").textbox({editable: false, value: param.CHECK_TYPE});
    $("#acNo").textbox({editable: false, value: param.ACNO});
    InitFuncCodeRequest_({
        data: {mttaskNo: param.MTTASK_NO, acid: param.ACID, FunctionCode: "PM_MTTASKZUBAO_GET"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data.A, null, Constant.CAMEL_CASE);
                InitEditForm_();
                InitDataGrid1(jdata.data.TMXI)
                InitDataGrid2(jdata.data.GKXX);
                if (jdata.data.TMXI != null && jdata.data.GKXX != null) {
                    $("#zubao").show();
                }
            } else {
                layer.msg(jdata.msg, {icon: 5});
            }
        }
    })
});

function InitEditForm_() {
    var $form = $("#mform1");
    var data = {};
    $form.form({
        onSubmit: function () {
            var isValidate1 = $("#mfordm1").form('validate');
            if (!isValidate1) {
                return false;
            }
            var tiaomuxinxi = $("#tiaomuxinxi").datagrid("getRows")
            for (var i = 0; i < tiaomuxinxi.length; i++) {
                if (tiaomuxinxi[i].light == "RED") {
                    MsgAlert({content: "方案条目必须要有工卡！", type: 'error'});
                    return false
                }
            }


            var merge = $.extend({}, $("#mform1").serializeObject())
            data['A'] = JSON.stringify(merge);
            data['B'] = JSON.stringify($("#tiaomuxinxi").datagrid('getRows'));
            data['C'] = JSON.stringify($("#gongkaxinxi").datagrid('getRows'));
            data = $.extend({}, data, {
                FunctionCode: ('PM_MTTASDINGJIANZUBAO_TIAJIAO')
            });
            InitFuncCodeRequest_({
                data: data,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        param.OWindow.reload_();
                        param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        CloseWindowIframe();
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
            return false;
        }
    });
}

//初始化条目信息
function InitDataGrid1(data) {
    if (!data) {
        data = [];
    }
    var identity = 'tiaomuxinxi';
    $("#tiaomuxinxi").MyDataGrid({
        identity: identity,
        fit: true,
        title: '方案条目列表',
        columns: [
            {
                field: 'light', title: '告警灯', width: 100, formatter: function (value, row, index) {
                    if (row.light == 'RED') {
                        return '<span  style="color: red;font-size: 28px; text-align:center">●</span>';
                    } else {
                        return '<span  style="color: green;font-size: 28px; text-align:center">●</span>';
                    }
                }
            },
            {field: 'itemNo', title: '项目编号', width: 100},
            {field: 'itemVersion', title: '项目版次', width: 100},
            {field: 'tcheckValue', title: '首检间隔', width: 100},
            {field: 'ivCheckValue', title: '重检间隔', width: 100}
        ],
        pagination: false,
        data: {total: data.length, rows: data},
        toolbar: [],
        contextMenus: [],
        resize: function () {
            return tabs_standard_resize($('#tt'), 0);
        }
    });
}

//初始化工卡
function InitDataGrid2(data) {
    if (!data) {
        data = [];
    }
    var identity = 'gongkaxinxi';
    $("#gongkaxinxi").MyDataGrid({
        identity: identity,
        fit: true,
        title: '工卡列表',
        columns: [
            {field: 'jcId', title: '工卡ID', width: 100},
            {field: 'jcNo', title: '工卡号', width: 100},
            {field: 'jcVersion', title: '工卡版本', width: 100},
            {field: 'rateHour', title: '理论工时', width: 100},
            {field: 'itemObjnr', title: '条目编号', width: 100}
        ],
        pagination: false,
        data: {total: data.length, rows: data},
        toolbar: [],
        contextMenus: [],
        resize: function () {
            return tabs_standard_resize($('#tt'), 0);
        }
    });
}

function deleteRow(identity, index) {
    $("#" + "gongju").datagrid('deleteRow', index);
}

function insertjiange(record) {
    var index = $("#jiange").datagrid('getRows').length;
    $('#jiange').datagrid('insertRow', {index: index, row: record});
}

function updatejiange(index, record) {
    $('#gongka').datagrid('updateRow', {index: index, row: record});
}

function insertEnumRow(record) {
    var index = $("#gongka").datagrid('getRows').length;
    $('#gongka').datagrid('insertRow', {index: index, row: record});
}

function updateEnumRow(index, record) {
    $('#gongka').datagrid('updateRow', {index: index, row: record});
}

function insertEnumRow2(record) {
    var index = $("#gongju").datagrid('getRows').length;
    $('#gongju').datagrid('insertRow', {index: index, row: record});
}

function updateEnumRow2(index, record) {
    $('#gongju').datagrid('updateRow', {index: index, row: record});
}

