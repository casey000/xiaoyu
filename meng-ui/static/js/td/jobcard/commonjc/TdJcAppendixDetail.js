var param;
var operation;
var pkid = null;//主表PKID
var pageCount;
var companyCode;
var model;
var appType;


function i18nCallBack() {
    pageCount = 1;
    param = getParentParam_();
    operation = param.operation;
    pkid = param.pkid;
    companyCode = param.companyCode;
    model = param.model;
    appType = param.appType;


    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_APP_TYPE,DA_FLEET,DA_ENG_TYPE,TD_JC_APPENDIX_TYPE,TD_JC_APPENDIX_IF_APL",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //适用类型
                $('#appType').combobox({
                    panelHeight: '70px',
                    data: jdata.data.TD_JC_APP_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (item) {
                        if (item.VALUE == 'APL') { //机身
                            $('#model').combobox({
                                panelHeight: '100px',
                                data: jdata.data.DA_FLEET,
                                valueField: 'VALUE',
                                textField: 'TEXT'
                            });
                        } else if (item.VALUE == 'ENG') { //发动机
                            $('#model').combobox({
                                panelHeight: '100px',
                                data: jdata.data.DA_ENG_TYPE,
                                valueField: 'VALUE',
                                textField: 'TEXT'
                            });
                        } else if (item.VALUE == 'PART') { //部件
                            $('#model').combobox({onlyview: true});
                            $('#model').combobox('setValue', 'CM');
                        }
                    }
                });
                //型号
                $('#model').combobox({
                    panelHeight: '100px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //参考资料类别
                $('#appendType').combobox({
                    panelHeight: '70px',
                    data: jdata.data.TD_JC_APPENDIX_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //是否适用
                $('#appendState').combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_JC_APPENDIX_IF_APL,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                if (operation == 'edit') {
                    InitDataForm(pkid);
                    InitDataGrid(pkid);//附件列表
                    InitDataGrid2(pkid);//关联工卡
                } else {
                    InitDataGrid();//附件列表
                    InitDataGrid2();//关联工卡
                }
            } else {

            }
        }
    })
}

//附件列表
function InitDataGrid() {
    var appendixPkid = $("#pkid").val();
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg").MyDataGrid({
        identity: "dg",
        sortable: true,
        singleSelect: true,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {appendixPkid: appendixPkid},
        columns: {
            param: {FunctionCode: 'TD_JC_APPENDIX_FILE_GET'},
            alter: {
                FILE_UPLOAD: {
                    formatter: function (value, row, index) {
                        if (row.FILE_UPLOAD) {
                            return '<a href="javascript:void(0);" rowindex="' + index + '" class="attach attach4">' +
                                '<img src="/img/edit2.png" border="0" style="width:15px;height:15px;"/></a>'
                        }
                    }
                }
            }
        },
        contextMenus: [
            {
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
                        data: {pkid: rowData.PKID, FunctionCode: 'ATTACHMENT_RSPL_DEL'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadAppendixFileList_();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        onLoadSuccess: function () {
            InitSuspend('a.attach', {
                'onmouseover': function (thiz, event, callback) {
                    InitFuncCodeRequest_({
                        data: {
                            SOURCE_ID: appendixPkid,
                            CATEGORY: "TDJCAPPENDIX",
                            FunctionCode: 'ATTACHMENT_RSPL_GET'
                        },
                        successCallBack: function (jdata) {
                            if (jdata.code == 200) {
                                var html = "";
                                for (var i = 0; i < jdata.data.length; i++) {
                                    html += '<li><a target="_blank" onclick="downFile(' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a><span onclick="deleteAppendix(\'' + jdata.data[i].PKID + '\');return false;" class="icon-cross"></span></li>';
                                }
                                callback(html);
                            }
                        }
                    });
                }
            });
            $("#dg").datagrid('doCellTip', {'max-width': '400px', 'delay': 500});
        }
    });
}

function InitDataGrid2() {
    var appendixPkid = $("#pkid").val();
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg1").MyDataGrid({
        identity: "dg1",
        sortable: true,
        singleSelect: true,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt1"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {appendixPkid: appendixPkid},
        columns: {
            param: {FunctionCode: 'TD_JC_APPENDIX_RELATE_JC'},
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "取消关联",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.JC_NO) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    cancelJcRelation(rowData.JC_NO, appendixPkid);
                }
            }
        ]
    });
}

//工卡附加内容上传文件
function appendixUploadFile() {
    var appendixPkid = $("#pkid").val();
    if (appendixPkid == undefined || appendixPkid == null | appendixPkid == '') {
        MsgAlert({content: "请先保存工卡附加内容！", type: 'error'});
        return;
    }
    common_upload_({
        identity: 'dg',
        resize: {},
        param: {
            cat: 'TDJCAPPENDIX',
            sourceId: appendixPkid,
            PKID: appendixPkid,
            successCallBack: reloadAppendixFileList_,
            failCallBack: ""
        }
    });
}

//添加关联工卡
function addRelateJc() {
    var appendixPkid = $("#pkid").val();
    var appendType = $("#appendType").combobox('getValue');
    if (appendixPkid == undefined || appendixPkid == null | appendixPkid == '') {
        MsgAlert({content: "请先保存工卡附加内容！", type: 'error'});
        return;
    }
    var title_ = $.i18n.t('选择关联工卡');
    ShowWindowIframe({
        width: "1080",
        height: "460",
        title: title_,
        param: {
            appendixPkid: appendixPkid,
            companyCode: companyCode,
            model: model,
            appType: appType,
            appendType: appendType
        },
        url: "/views/td/jobcard/commonjc/TdJcAppendixAddRelateJc.shtml"
    });

}

//刷新附件列表
function reloadAppendixFileList_() {
    $("#dg").datagrid("reload");
}

//刷新关联工卡
function reloadAppendixRelateJc() {
    $("#dg1").datagrid("reload");
}

//回填
function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        async: false,
        data: {pkid: pkid, FunctionCode: "TD_JC_APPENDIC_BY_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                $("#pkid").val(pkid);
            }
        }
    });
}

// 保存
function save() {
    var isValidate = $("#mform").form('validate');
    if (!isValidate) {
        return;
    }
    var $form = $("#mform");
    var datas = $form.serializeObject();
    datas = $.extend(datas, {
        FunctionCode: 'TD_JC_APPENDIX_ADD_EDIT',
        operation: operation
    });
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $("#pkid").val(jdata.data.pkid);
                $("#companyCode1").val(jdata.data.companyCode);
                $("#model1").val(jdata.data.model);
                $("#appType1").val(jdata.data.appType);
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                param.OWindow.reload_();
                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });

}

//关联工卡--取消关联
function cancelJcRelation(jcNo, appendixPkid) {
    InitFuncCodeRequest_({
        data: {
            appendixPkid: appendixPkid,
            jcNo: jcNo,
            FunctionCode: 'TD_JC_APPENDIX_CANCEL_JC_RELATE'
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                reloadAppendixRelateJc();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

}

function deleteAppendix(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: 'ATTACHMENT_RSPL_DEL'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                reloadAppendixFileList_();
            }
        }
    });
}