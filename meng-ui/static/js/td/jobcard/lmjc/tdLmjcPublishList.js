var PAGE_DATA = {};
var COMBOBOX_DATA = {};
var user;

function i18nCallBack() {
    user = getLoginInfo();
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });


    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_LMJC_TYPE,TD_MJC_STATUS,TD_JC_SMJC_WRITER",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            //有效性
            $('#fleet').combobox({
                panelHeight: '100px',
                data: jdata.data.DA_FLEET,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#lmjcType').combobox({
                panelHeight: '100px',
                data: jdata.data.TD_LMJC_TYPE,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#status').combobox({
                panelHeight: '180px',
                data: jdata.data.TD_MJC_STATUS,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#status').combobox({
                value: "ISSUE",
                onlyview: true,
                editable: false
            });
            //编写人
            $('#writer').combobox({
                panelHeight: '100px',
                data: jdata.data.TD_JC_SMJC_WRITER,
                valueField: 'VALUE',
                textField: 'TEXT',
                value: user.accountId,
                onlyview: true,
                editable: false
            });

            // 因为后台获取到的是 对象 我们需要显示对象的text（因为对象中有value，还有text）
            PAGE_DATA['lmjcType'] = DomainCodeToMap_(jdata.data["TD_LMJC_TYPE"]);
            PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_MJC_STATUS"]);

            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid() {
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        columns: {
            param: {status: "ISSUE", FunctionCode: 'TD_JC_ALL_LMJC_RELEASE_LIST'},
            alter: {
                LMJC_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['lmjcType'][value];
                    }
                },
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                CREATE_DATE: {
                    type: 'date'
                },
                MODIFY_DATE: {
                    type: 'date'
                }
            }
        },
        onLoadSuccess: function () {
        },
        onDblClickRow: function (index, field, value) {
            openDetai("view", value.PKID, value.FLEET, value.JC_TYPE);
        },
        contextMenus: [
            {
                id: "m-enabledSettings", i18nText: "启用设置",
                auth: "TD_LMJC_START_CONFIG",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    ShowWindowIframe({
                        width: "450",
                        height: "350",
                        title: "启用设置",
                        param: {pkid: rowData.PKID},
                        url: "/views/td/jobcard/lmjc/tdLmjcEnabledSetting.shtml"
                    });
                }
            },
            {
                id: "m-pdf", i18nText: "PDF预览",
                auth: "TD_LMJC_PDF_PREVIEW",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.PDF_PATH == null || rowData.PDF_PATH == "") {
                        MsgAlert({content: "工卡PDF存档不存在，请联系管理员。", type: 'error'});
                        return;
                    }
                    var data = $.extend(toCamelCase(rowData), {FunctionCode: 'TD_JC_PREVIEW'});
                    ajaxLoading();
                    InitFuncCodeRequest_({
                        data: data, successCallBack: function (jdata) {
                            ajaxLoadEnd();
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (jdata.data.length > 0) {
                                    var url = jdata.data;
                                    jcPreview(url);
                                }
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            },
            {
                id: "m-release", i18nText: "发布",
                auth: "TD_LMJC_PUBLISH",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认发布？")) {
                        return;
                    }
                    publish(rowData.PKID, rowData.JC_NO, rowData.VER);
                }
            },
        ],
        toolbar: [
            //     {
            //     id: 'btnAdd',
            //     text: $.i18n.t('批量发布'),
            //     iconCls: 'icon-redo',
            //     handler: function () {
            //         batchPublic();
            //     }
            // }, '-',
            /* {
             id: 'btnBack',
             text: $.i18n.t('批量退回'),
             iconCls: 'icon-undo',
             handler: function () {
             batchForback();
             }
             }, '-',*/ {
                id: 'btnReload',
                text: $.i18n.t('刷新'),
                iconCls: 'icon-reload',
                handler: function () {
                    $("#dg").datagrid("reload");
                }
            }],
    });
}

function publish(pkid, jcNo, ver) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, JcNo: jcNo, ver: ver, FunctionCode: 'TD_JC_LMJC_PUBLISH'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                reload_();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//批量发布
function batchPublic() {
    var selectRows = getDG("dg").datagrid("getChecked");
    var selectCount = selectRows.length;
    if (selectCount === 0) {
        MsgAlert({content: '请选择要发布的记录！', type: 'error'});
        return;
    }
    var pkids = '';
    var jcNos = '';
    var vers = '';
    $.each(selectRows, function (k, item) {
        pkids += item.PKID + ',';
        jcNos += item.JC_NO + ",";
        vers += item.VER + ",";
    });
    pkids = pkids.substring(0, pkids.length - 1);
    jcNos = jcNos.substring(0, jcNos.length - 1);
    vers = vers.substring(0, vers.length - 1);

    var pkidArr = pkids.split(",");
    var jcNoArr = jcNos.split(",");
    var verArr = vers.split(",");

    alert("pkids = " + pkids + "   ,jcNos = " + jcNos + "   ,vers = " + vers);

    for (var i = 0; i < pkidArr.length; i++) {
        publish(pkidArr[i], jcNoArr[i], verArr[i]);
    }
}

//刷新1
function reload_() {
    $("#dg").datagrid("reload");
}

//打开资料类型详细页面
function openDetai(operation, pkid, fleet, jcType) {
    var title_ = $.i18n.t('航线工卡编写');
    ShowWindowIframe({
        width: "1020",
        height: "260",
        title: title_,
        param: {operation: operation, pkid: pkid, fleet: fleet, jcType: jcType},
        url: " /views/td/jobcard/lmjc/tdLmjcEditDetail.shtml"
    });
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    $('#status').combobox({
        value: "ISSUE"
    });
    searchData();
}

function jcPreview(url) {
    var title_ = $.i18n.t('航线工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/smjc/smjcedit/jobcardPreview.shtml"
    });
}