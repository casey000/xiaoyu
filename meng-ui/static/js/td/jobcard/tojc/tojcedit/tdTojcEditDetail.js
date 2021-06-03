var param;
var operation;
var COMBOBOX_DATA = {};
var PAGE_DATA = {};
var jcPkid;
var cPkid;
var cDesc;


function i18nCallBack() {
    param = getParentParam_();
    operation = param.operation;

    InitFuncCodeRequest_({
        data: {
            domainCode: "YESORNO,DA_FLEET,TD_JC_CONFIG_TYPE,DA_ACNO,TD_JC_MATER_SORT,TD_JC_MATER_TYPE,TD_JC_MATER_UNIT,TD_JC_MATER_IMPORTANCE,DA_ATA",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                COMBOBOX_DATA['ifRii'] = jdata.data.YESORNO;
                COMBOBOX_DATA['acno'] = jdata.data.DA_ACNO;
                PAGE_DATA['acno'] = DomainCodeToMap_(jdata.data.DA_ACNO);

                //航材/工具
                PAGE_DATA['materSort'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_SORT"]);
                //航材类别
                PAGE_DATA['materType'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_TYPE"]);
                //数量按需
                PAGE_DATA['qtyReq'] = DomainCodeToMap_(jdata.data["YESORNO"]);
                //单位
                PAGE_DATA['unit'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_UNIT"]);
                //适用情况（是否视情）
                PAGE_DATA['importance'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_IMPORTANCE"]);
                //是否必检
                $("#ifRii").combobox({
                    panelHeight: '140px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //机队
                $("#fleet").combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function () {
                        proJcNo();
                    }
                });

                //ATA
                $("#ata").combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function () {
                        proJcNo();
                    }
                });

                //构型类型
                $("#appType").combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_JC_CONFIG_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: 'MX',
                    onSelect: function (row) {
                        if (row.VALUE == 'XH') {
                            $("#jhmx").hide();
                        } else {
                            $("#jhmx").show();
                        }
                    }
                });

                $('#jcNoSeq').textbox({
                    onChange: function (value) {
                        if (value) {
                            isE(value);
                        }
                        $('#jcNoSeq').textbox('setValue', $('#jcNoSeq').textbox('getValue').toUpperCase());
                    },
                });

                //初始化构型datagrid
                InitDataGrid_apptype(-1);

                //初始化航材
                InitDataGrid_mater(-1);

                //初始化机号明细
                InitDataGrid_jhmx(-1);

                if (param.pkid) {
                    InitDataForm(param.pkid);
                    //初始化构型datagrid
                    InitDataGrid_apptype(param.pkid);
                    //初始化航材
                    InitDataGrid_mater(param.pkid);
                }
            }

            if (operation == 'view') {
                $("#saveBtn").hide();
                $("#submitBtn").hide();
                $("#delayBtn").hide();
                $("#cepBtn").hide();
                $("#saveBtn").hide();
            }


        }
    })
}

//TO编号
function tono() {

}


function InitDataGrid_apptype(jcPkid) {
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg1").MyDataGrid({
        identity: 'dg1',
        sortable: true,
        singleSelect: true,
        pageSize: pageSize, pageList: [pageSize],
        queryParams: {jcPkid: jcPkid},
        enableLineEdit: true,
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.5, 5, 4);
        },
        columns: {
            param: {FunctionCode: 'TOJC_APPTYPE_LIST'},
            alter: {
                CONFIG: {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[300]']}}
                },
                CONFIG_DESC: {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[300]']}}
                }
            }

        },
        onEndEdit: function (index, row, changes) {
            row = toCamelCase(row);
            row = $.extend({jcPkid: $("#pkid").val()}, row, {FunctionCode: 'TOJC_APPTYPE_ADD'});
            InitFuncCodeRequest_({
                data: row,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                    reload_('dg1');
                }
            });
        },
        onLoadSuccess: function () {
        },
        validAuth: function (row, items) {

            return items;
        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "删除", auth: "",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("该操作会删除所以相关记录,确认删除？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TOJC_APPTYPE_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_('dg1');
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        onClickRow: function (rowIndex, rowData) {
            cPkid = rowData.PKID;
            cDesc = rowData.CONFIG_DESC;
            dodg2(rowData.PKID);
        },
        onDblClickRow: function (index, field, value) {
            openDetai("view", value.PKID);
        }
    });
}

function InitDataGrid_jhmx(configId) {
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg2").MyDataGrid({
        identity: 'dg2',
        sortable: true,
        singleSelect: true,
        queryParams: {configId: configId},
        enableLineEdit: false,
        pageSize: pageSize, pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.5, 5, 4);
        },
        columns: {
            param: {FunctionCode: 'TOJC_JHMX_LIST'},
            alter: {
                /*ACNO: {
                    formatter: function (value) {
                        return PAGE_DATA['acno'][value];
                    },
                    editor: {type: 'combobox', options: {tipPosition: 'top', validType: ['maxLength[300]'],
                        data: COMBOBOX_DATA['acno'],
                        valueField: "VALUE",
                        textField: "TEXT",
                        editable: true,
                        panelHeight:120,
                        required: true,
                        onHidePanel: function() {
                            validSelectValue_(this, "机号不存在！");
                        }
                    },
                    }
                },*/
            }
        },
        onLoadSuccess: function () {
        },
        onEndEdit: function (index, row, changes) {
            row = toCamelCase(row);
            row = $.extend({
                jcPkid: $("#pkid").val(),
                cPkid: cPkid,
                cDesc: cDesc
            }, row, {FunctionCode: 'TOJC_JHMX_ADD'});
            InitFuncCodeRequest_({
                data: row,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                    reload_('dg2');
                }
            });
        },
        validAuth: function (row, items) {

            return items;
        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "删除", auth: "",
                onclick: function () {
                    var rowData = getDG('dg2').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TOJC_JHMX_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_('dg2');
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        onClickRow: function (rowIndex, rowData) {

        },
        onDblClickRow: function (index, field, value) {

        }
    });
}

function InitDataGrid_mater(jcPkid) {
    $("#jcPkid").val(jcPkid);
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg").MyDataGrid({
        identity: "dg",
        sortable: true,
        singleSelect: true,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {jcPkid: jcPkid},
        columns: {
            param: {FunctionCode: 'TD_JC_MATER_LIST'},
            alter: {
                TEST_UPLOAD: {},
                MATER_SORT: {
                    formatter: function (value) {
                        return PAGE_DATA['materSort'][value];
                    }
                },
                MATER_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['materType'][value];
                    }
                },
                QTY_REQ: {
                    formatter: function (value) {
                        return PAGE_DATA['qtyReq'][value];
                    }
                },
                UNIT: {
                    formatter: function (value) {
                        return PAGE_DATA['unit'][value];
                    }
                },
                IMPORTANCE: {
                    formatter: function (value) {
                        return PAGE_DATA['importance'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "common:COMMON_OPERATION.EDIT",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    editMater("edit", rowData.PKID);
                }
            }, {
                id: "m-delete",
                i18nText: "删除",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_JC_MATER_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_("dg");
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        onClickRow: function (rowIndex, rowData) {

        }
    });
}

//数据反显
function InitDataForm(pkid) {
    jcPkid = pkid;
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_TOJC_BY_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                if (jdata.data.GGY == 'Y') {
                    $("#ggy").attr("checked", "true");
                }
                if (jdata.data.ETOPS == 'Y') {
                    $("#etops").attr("checked", "true");
                }
                var jcNo = $('#jcNo').val();
                $('#jcNoSeq').textbox("setValue", jcNo.slice(jcNo.length - 1));
                $('#jcNoAuto').textbox("setValue", jcNo.slice(0, jcNo.length - 1));
                $('#jcNoSeq').textbox({editable: false, onlyview: true});
                //适用性回填
                //initCheckBoxValues('applic1',jdata.data.APPLIC);

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//自动生成工卡号(营运人-TOJC-年份-机型-章节-流水号)
function proJcNo() {
    var year = new Date().getFullYear();
    var fleet = $("#fleet").combobox("getValue");
    var ata = $("#ata").combobox("getValue");
    $("#jcNoAuto").val("");
    $("#jcNoAuto").textbox('setValue', 'SFN-TOJC' + '-' + year + '-' + fleet + '-' + ata + '-');
}

//正则校验(一位字母)
function isE(jcNoSeq) {
    var reg = /^[a-zA-Z]{1}$/;
    var r = jcNoSeq.match(reg);
    if (r == null) {
        alert("只能输入一位字母!");
        $("#jcNoSeq").textbox('setValue', '');
    }
}

//打开航材详情页
function addMater(operation) {
    var pkid = jcPkid;
    if ($.trim(pkid) == '' || jcPkid == -1) {
        alert("请先保存工卡封面");
        return;
    }
    var title_ = $.i18n.t('航材工具详情');
    ShowWindowIframe({
        width: "600",
        height: "220",
        title: title_,
        param: {pkid: pkid, type: operation},
        url: "/views/td/jobcard/mater/tdJcMaterDetail.shtml"
    });
}


//航材编辑
function editMater(operation, materPkid) {
    var title_ = $.i18n.t('航材工具详情');
    ShowWindowIframe({
        width: "600",
        height: "220",
        title: title_,
        param: {pkid: materPkid, type: operation},
        url: "/views/td/jobcard/mater/tdJcMaterDetail.shtml"
    });
}

//航材删除
function batchDelete() {
    var selectRows = $("#dg").datagrid('getChecked');
    var selectCount = selectRows.length;
    if (selectCount === 0) {
        MsgAlert({content: '请选择要删除的记录！', type: 'error'});
        return;
    }
    if (!confirm("确认删除选中的记录？")) {
        return;
    }
    var pkids = '';

    $.each(selectRows, function (k, item) {
        pkids += item.PKID + ',';
    });

    pkids = pkids.substring(0, pkids.length - 1);
    InitFuncCodeRequest_({
        data: {pkids: pkids, FunctionCode: 'TD_JC_MATER_DELETE_BATCH'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                reload_("dg");
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

}

//适用性批量删除
function deleteEffect() {
    var selectRows = $("#dg2").datagrid('getChecked');
    var selectCount = selectRows.length;
    if (selectCount === 0) {
        MsgAlert({content: '请选择要删除的记录！', type: 'error'});
        return;
    }
    if (!confirm("确认删除选中的记录？")) {
        return;
    }
    var pkids = '';

    $.each(selectRows, function (k, item) {
        pkids += item.PKID + ',';
    });

    pkids = pkids.substring(0, pkids.length - 1);
    InitFuncCodeRequest_({
        data: {pkids: pkids, FunctionCode: 'TOJC_EFFECT_DEL'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                reload_("dg2");
                reload_("dg1");
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//提交
function sub() {
    if (!jcPkid || jcPkid == -1) {
        alert("请先保存工卡封面");
        return;
    }
    var title_ = $.i18n.t('提交');
    ShowWindowIframe({
        width: "450",
        height: "50",
        title: title_,
        param: {pkid: jcPkid},
        url: "/views/td/jobcard/tojc/tojcedit/tdTojcEditSubmit.shtml"
    });
}

//延期申请
function delay() {
    if (!jcPkid || jcPkid == -1) {
        alert("请先保存工卡封面");
        return;
    }
    var title_ = $.i18n.t('延期申请');
    ShowWindowIframe({
        width: "450",
        height: "50",
        title: title_,
        param: {pkid: jcPkid},
        url: "/views/td/jobcard/tojc/tojcedit/tdTojcEditDelay.shtml"
    });
}

// 保存
function save() {

    var jcNoAuto = $('#jcNoAuto').textbox('getValue');
    var jcNoSeq = $('#jcNoSeq').textbox('getValue');
    $('#jcNo').val(jcNoAuto + jcNoSeq);

    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;

    if ($("#ggy").val()) {
        $("#ggy").val("Y");
    }
    if ($("#etops").val()) {
        $("#etops").val("Y");
    }

    var $form = $("#mform");
    var datas = $form.serializeObject();
    datas = $.extend({operation: operation}, datas, {FunctionCode: 'TD_JC_TOJC_ADD'});
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                alert("保存成功");
                if (param.OWindow.onSearch_) {
                    param.OWindow.onSearch_('dg', '#ffSearch');
                }
                jcPkid = jdata.data.pkid;
                $("#pkid").val(jcPkid);
                if (jcPkid != -1) {
                    $("#saveBtn").hide();
                    dodg1(jcPkid);
                }
                param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                //CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }

    });
}

//刷新明细表
function dodg2(configId) {
    if (!configId) {
        configId = -1;
    }
    getDG('dg2').datagrid('load', {configId: configId});
}

function dodg1(jcPkid) {
    if (!jcPkid || jcPkid == -1) {
        jcPkid = -1;
    }
    getDG('dg1').datagrid('load', {jcPkid: jcPkid});//刷新构型
    getDG('dg').datagrid('load', {jcPkid: jcPkid}); //刷新航材
}


//构型和适用性增加
function addRow(type) {

    if (type == 'apptype') {
        if (!jcPkid || jcPkid == -1) {
            alert("请先保存工卡封面");
            return;
        }
        $('#dg1').datagrid('appendRow', {});
    }

    if (type == 'mx') {
        if (!jcPkid || jcPkid == -1) {
            alert("请先保存工卡封面");
            return;
        }
        if (!cPkid) {
            alert("请先选择一条构型数据");
            return;
        }
        var title_ = $.i18n.t('适用性');
        ShowWindowIframe({
            width: "500",
            height: "350",
            title: title_,
            param: {jcPkid: $("#pkid").val(), cPkid: cPkid, cDesc: cDesc, fleet: $("#fleet").combobox("getValue")},
            url: "/views/td/jobcard/tojc/tojcedit/tdTojcEditEffect.shtml"
        });
    }
}


//刷新
function reload_(id) {
    if ('dg1' == id) {
        $("#dg1").datagrid("reload");
    } else if ('dg2' == id) {
        $("#dg2").datagrid("reload");
    } else if ("dg" == id) {
        $("#dg").datagrid("reload");
    }
}