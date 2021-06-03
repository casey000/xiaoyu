var param;
var iparam;
var operation;
var operationAdd;
var PAGE_DATA = {};
var nalter = {};
var selArray = [];
var functionCode;
var delFunctionCode;

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}

function i18nCallBack() {
    param = getParentParam_();
    operation = iparam.operation;
    if ("view" == operation) {
        $(".btn.btn-primary").attr("disabled", true);
        $('#ifElectricalLoadTd').hide();
    }

    InitFuncCodeRequest_({
        data: {
            domainCode: "YESORNO,EM_EO_EL_DATA_SOURCE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            PAGE_DATA['EM_EO_EL_DATA_SOURCE'] = DomainCodeToMap_(jdata.data['EM_EO_EL_DATA_SOURCE']);
            $('#ifElectricalLoad').combobox({
                panelHeight: 'auto',
                valueField: 'VALUE',
                textField: 'TEXT',
                editable:false,
                prompt: '请选择',
                data: jdata.data['YESORNO'],
                onChange : function (newValue, oldVaule) {
                    if(iparam.applyType != 'APL'){
                        MsgAlert({content: iparam.addBiddenMsg, type: 'error'});

                    }else{
                        if(newValue == 'N'){
                            if (confirm(iparam.msg)) {
                                InitFuncCodeRequest_({
                                    async : false,
                                    data: {FunctionCode: "EM_EO_EL_INFO_AND_DATA_DELALL", eoPkid: iparam.pkid},
                                    successCallBack: function (jdata) {
                                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                            MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                            reload_();
                                        }else{
                                            MsgAlert({content: '清除数据失败', type: 'error'});
                                        }
                                    }
                                });
                            }
                        }
                        InitSaveForm_();
                    }
                }
            });

            if (iparam.pkid && iparam.pkid != -1) {
                $("#dataType").combobox({onlyview: true, editable: false});
                //InitDataForm(iparam.pkid);
            }
        }
    });
    if (iparam.pkid && iparam.pkid != -1) {
        InitDataGrid1(iparam.pkid);
        InitDataGrid2(iparam.pkid);
        InitForm(iparam.pkid);
    } else {
        InitDataGrid1(-1);
        InitDataGrid2(-1);
    }
    //initTableTitle();
    //bindSparkEvents();
}

var $pd = {};

function InitDataGrid1(eoPkid) {
    $("#dg1").MyDataGrid({
        sortable: true,
        singleSelect: true,
        pagination: false,
        fit: false,
        /*resize: function () {
            return tabs_standard_resize($("#tt"), 0.1, 0.0001, 0, 0);
        },*/
        resize: function () {
            return {width: '100%', height: 175};
        },
        queryParams: {"eoPkid": iparam.pkid ? iparam.pkid : -1},

        columns: {
            param: {FunctionCode: "EM_EO_EL_INFO_LIST"},
            alter: {}
        },
        onLoadSuccess: function () {
        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "编辑", auth: "",
                enable: false,

                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    flag = "E";
                    openDetaiInfo('edit', rowData.PKID);
                }
            },
            {
                id: "m-delete", i18nText: "删除", auth: "",
                onclick: function () {
                    var rowData = getDG("dg1").datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: "EM_EO_EL_INFO_DEL"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadOne_("dg1");
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            },
            /*{
                id: "m-delete", i18nText: "维护适用性", auth: "",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    let title_ = "维护适用性分组";
                    ShowWindowIframe({
                        width: "800",
                        height: "400",
                        top: "-400", left: "-400",

                        title: title_,
                        param: {
                            pkid: rowData.PKID,
                            eoPkid: iparam.pkid,
                            appList: "EM_EO_EL_INFO_APP_LIST",
                            appFunctionCode: 'EM_EO_EL_INFO_APP_ADD'
                        },
                        url: "../applic/EmEoAppAdd.shtml"
                    });
                }
            }*/
        ],
        validAuth: function (row, items) {
            if (operation == 'view') {
                items['编辑'].display = false;
                items['维护适用性'].display = false;
                items['上传附件'].display = false;
                items['删除'].display = false;
            }
            return items;
        },

        onClickRow: function (rowIndex, rowData) {
            detailClickRow(rowIndex)
        },
        onDblClickRow: function (index, field, value) {
            flag = "V";

        }
    });
}

function InitDataGrid2(eoPkid) {
    $("#dg2").MyDataGrid({
        sortable: true,
        singleSelect: true,
        pagination: false,
        fit: false,
        resize: function () {
            return {width: '100%', height: 175};
        },
        queryParams: {"eoPkid": iparam.pkid ? iparam.pkid : -1},

        columns: {
            param: {FunctionCode: "EM_EO_EL_DATA_LIST"},
            alter: {
                SOURCE : {
                    formatter: function (value) {
                        return PAGE_DATA['EM_EO_EL_DATA_SOURCE'][value];
                    }
                }

            }
        },
        onLoadSuccess: function () {

        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "编辑", auth: "",
                enable: false,

                onclick: function () {
                    var rowData = getDG('dg2').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    flag = "E";
                    openDetaiData('edit', rowData.PKID);
                }
            },

            {
                id: "m-delete", i18nText: "删除", auth: "",
                onclick: function () {
                    var rowData = getDG("dg2").datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: "EM_EO_EL_DATA_DEL"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadOne_("dg2");
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            },
            {
                id: "m-delete", i18nText: "维护适用性", auth: "",
                onclick: function () {
                    var rowData = getDG('dg2').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    let title_ = "维护适用性分组";
                    ShowWindowIframe({
                        width: "800",
                        height: "400",
                        top: "-400", left: "-400",

                        title: title_,
                        param: {
                            pkid: rowData.PKID,
                            eoPkid: iparam.pkid,
                            appList: "EM_EO_EL_DATA_APP_LIST",
                            appFunctionCode: "EM_EO_EL_DATA_APP_ADD"
                        },
                        url: "../applic/EmEoAppAdd.shtml"
                    });
                }
            },
        ],
        validAuth: function (row, items) {
            items['维护适用性'].display = false;
            if (operation == 'view') {
                items['编辑'].display = false;
                items['上传附件'].display = false;
                items['删除'].display = false;
            }
            return items;
        },

        onClickRow: function (rowIndex, rowData) {
            detailClickRow(rowIndex)
        },
        onDblClickRow: function (index, field, value) {
            flag = "V";

        }
    });
}

function setSubData(data) {
    ParseFormField_(data, $("#mform"), Constant.CAMEL_CASE);

    $(":checkbox").each(function () {
        let radioName = $(this).attr('name').toUpperCase();
        let num = data[radioName];
        $(this).prop("checked", num == "Y" ? true : false);
    });
}



//打开资料类型详细页面
function openDetaiInfo(operation, pkid) {
    if(operation == 'add'){
        if (iparam.pkid == -1 || iparam.pkid == "") {
            MsgAlert({content: '请先保存EO基本信息', type: 'error'});
            return;
        }

        if(iparam.applyType != 'APL'){
            MsgAlert({content: iparam.addBiddenMsg, type: 'error'});
            return;
        }

        var ifElectricalLoad = $('#ifElectricalLoad').combobox('getValue');
        if(ifElectricalLoad == 'N'){
            MsgAlert({content: iparam.ifElectricalLoad, type: 'error'});
            return;
        }
    }


    var title_ = $.i18n.t('改装说明详细页');
    ShowWindowIframe({
        width: "800",
        height: "550",
        title: title_,
        param: {operation: operation, pkid: pkid, eoPkid: iparam.pkid, applyType: iparam.applyType},
        url: '../sub/EmEoElInfoEdit.shtml'
    });
}

function openDetaiData(operation, pkid) {
    if(operation == 'add'){
        if (iparam.pkid == -1 || iparam.pkid == "") {
            MsgAlert({content: '请先保存EO基本信息', type: 'error'});
            return;
        }

        if(iparam.applyType != 'APL'){
            MsgAlert({content: iparam.addBiddenMsg, type: 'error'});
            return;
        }

        var ifElectricalLoad = $('#ifElectricalLoad').combobox('getValue');
        if(ifElectricalLoad == 'N'){
            MsgAlert({content: iparam.ifElectricalLoad, type: 'error'});
            return;
        }
    }

    var title_ = $.i18n.t('负载变化详细页');
    ShowWindowIframe({
        width: "800",
        height: "500",
        title: title_,
        param: {operation: operation, pkid: pkid, eoPkid: iparam.pkid, applyType: iparam.applyType},
        url: '../sub/EmEoElDataEdit.shtml'
});
}


/** 刷新列表数据 */
function reload_() {
    $('#dg1').datagrid("reload");
    $("#dg2").datagrid("reload");
}

function reloadOne_(id) {
    $('#'+id).datagrid("reload");
}

/**
 * 新增后刷新数据
 */
function addReloadOne_(id) {
    var dgopt = getDgOpts(id);
    var $dg = $(dgopt.owner);
    let queryParams = $.extend({}, dgopt.queryParams, dgopt._params, {"eoPkid": iparam.pkid ? iparam.pkid : -1});
    if (typeof(breforSearch) == 'function') {
        breforSearch(queryParams);
    }
    if (dgopt.treeField) {
        $dg.treegrid('load', queryParams);
    } else {
        $dg.datagrid('load', queryParams);
    }

    $("#"+id).datagrid("reload");
}


function InitSaveForm_() {
    var $form = $("#mform");

    var data = $form.serializeObject();
    let radis = {};
    $(":radio").each(function () {
        let radioName = $(this).attr('name');
        radis[radioName] = $("input[name='" + radioName + "']:checked").val();
    });

    $(":checkbox").each(function () {
        radis[$(this).attr('name')] = $(this).is(':checked') ? "Y" : "N";
    });
    data = $.extend(data, radis, {"pkid": iparam.pkid}, {FunctionCode: "EM_EO_ADD"});
    InitFuncCodeRequest_({
        async : false,
        data: data,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                reload_();
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.SUCCESS_CODE')});
                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    //return false;
}

function InitForm(pkid) {
    InitFuncCodeRequest_({
        async : false,
        data: {pkid: pkid, FunctionCode: "EM_EO_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                $(":radio").each(function () {
                    let radioName = $(this).attr('name').toUpperCase();
                    let num = jdata.data[radioName];
                    $("input[name=" + $(this).attr('name') + "]:eq(" + num + ")").attr("checked", 'checked');
                });
                $(":checkbox").each(function () {
                    let radioName = toLine($(this).attr('name')).toUpperCase();
                    let num = jdata.data[radioName];
                    if (radioName == "EXE_MODE") {
                        if (num == "W") {
                            $("#wwe").prop("checked", true);
                            $('#repairRequirement').textbox({disabled: false})
                        }
                        if (num == "S") {
                            $("#sfe").prop("checked", true);
                        }
                    }

                });
                //设置子页面数据
                //  setSubData(jdata.data)
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}
