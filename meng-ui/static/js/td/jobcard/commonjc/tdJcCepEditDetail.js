var param;
var PAGE_DATA = {};
var jcPkid;
var jcType;
var cepPath;
var refType;
var refName;
var fleet;
var cepCheckout;
var pageCount;
var isCheckIn = false;
var operation;
var ifOpened = false;
var workFlowUser;
var diffURL;
var customCode;

function i18nCallBack() {
    param = getParentParam_();
    jcPkid = param.jcpkid;
    jcType = param.jcType;
    cepCheckout = param.checkout;
    pageCount = param.pageCounter;
    workFlowUser = param.userName;

    $("#jcPkid").val(jcPkid);

    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_CEP_STATUS,TD_JC_NRCJC_WRITER",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //状态
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_CEP_STATUS"]);
                //修订人
                PAGE_DATA['writer'] = DomainCodeToMap_(jdata.data["TD_JC_NRCJC_WRITER"]);
                InitDataForm(jcPkid);
                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataForm(jcPkid) {
    InitFuncCodeRequest_({
        data: {pkid: jcPkid, FunctionCode: "TD_JC_CEP_BY_JCPKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('#fleet').html(jdata.data.FLEET);
                $('#jcNo').html(jdata.data.JC_NO);
                //$('#checkoutBy').html(jdata.data.CHECKOUT_BY);
                $('#checkoutBy').html(PAGE_DATA['writer'][jdata.data.CHECKOUT_BY]);
                $('#subjectCn').html(jdata.data.SUBJECT_CN);
                cepPath = jdata.data.CEP_FILE_PATH;
                refType = jdata.data.REFDATA_TYPE;
                refName = jdata.data.REF_DATA;
                fleet = jdata.data.FLEET;
                cepCheckout = jdata.data.CEP_CHECKOUT;
                customCode = jdata.data.COMPANY_CODE;
                if (cepCheckout == 'Y') {
                    //$('#checkoutBy').html(jdata.data.CHECKOUT_BY);
                    $('#checkoutBy').html(PAGE_DATA['writer'][jdata.data.CHECKOUT_BY]);
                }

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
        queryParams: {jcPkid: jcPkid},
        columns: {
            param: {FunctionCode: 'TD_JC_CEP_LIST'},
            alter: {
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                WRITER: {
                    formatter: function (value) {
                        return PAGE_DATA['writer'][value];
                    }
                },
                WRITE_DATE: {
                    type: 'datetime'
                }
            }
        },
        toolbar: [{
            key: "COMMON_EDIT",
            id: "cepEdit",
            text: $.i18n.t('编辑'),
            auth: "",
            handler: function () {
                openEditor();
            }
        }, {
            key: "COMMON_ADD",
            id: "cepCheckin",
            text: $.i18n.t('检入'),
            handler: function () {
                cepCheckin();
            }
        }, {
            key: "COMMON_EDIT",
            id: "cepCancel",
            text: $.i18n.t('取消'),
            handler: function () {
                cepCancel();
            }
        },
            {
                key: "COMMON_EDIT",
                id: "cepDiff",
                text: $.i18n.t('对比'),
                handler: function () {
                    cepDiff();
                }
            },
            {
                key: "COMMON_EDIT",
                id: "cepDiffFromManual",
                text: $.i18n.t('与新版手册对比'),
                handler: function () {
                    chooseManual();
                }
            },
            {
                key: "COMMON_EDIT",
                id: "cepDiffFromLastCustomManual",
                text: $.i18n.t('与上营运人手册对比'),
                handler: function () {
                    chooseLastCustomManual();
                }
            },
            {
                key: "COMMON_EDIT",
                id: "copyCep",
                text: $.i18n.t('复制工卡工序'),
                handler: function () {
                    copyCepFromJc();
                }
            },
            //     {
            //     key: "COMMON_EDIT",
            //     id: "cepDiff",
            //     text: $.i18n.t('版本对比'),
            //     handler: function () {
            //         editionDiff();
            //     }
            // }, {
            //     key: "COMMON_EDIT",
            //     id: "cepDiffMerge",
            //     text: $.i18n.t('对比合并'),
            //     handler: function () {
            //         editionDiffMerge();
            //     }
            // },
            {
            key: "COMMON_RELOAD",
            id: "cepViewPdf",
            text: $.i18n.t('PDF预览'),
            handler: function () {
                cepViewPdf();
            }
        }, {
            key: "COMMON_RELOAD",
            id: "cepViewEditor",
            text: $.i18n.t('Arbortext预览'),
            handler: function () {
                cepViewEditor();
            }
            }
            // , {
            //     key: "COMMON_RELOAD",
            //     id: "cepViewXml",
            //     text: $.i18n.t('XML预览'),
            //     handler: function () {
            //         cepViewXml();
            //     }
            // }
        ],
        validAuth: function (row, items) {
            if (row.STATUS == 'Y') {
                items['恢复'].enable = false;
            }
            return items;
        },
        contextMenus: [{
            id: "m-recover", i18nText: "恢复",
            onclick: function () {
                var rowData = getDG('dg').datagrid('getSelected');
                if (!rowData.PKID) {
                    MsgAlert({content: "请选择数据！", type: 'error'});
                    return;
                }
                if (cepCheckout == 'Y') {
                    MsgAlert({content: "工序检出中，不可恢复！", type: 'error'});
                    return;
                }
                $.messager.confirm("", "是否确认从该版本中恢复?", function (r) {
                    if (r) {
                        InitFuncCodeRequest_({
                            data: {pkid: rowData.PKID, FunctionCode: "TD_JC_CEP_RECOVER"},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.COMMON.OPT_SUCCESS')});
                                    reload_();
                                } else {
                                    MsgAlert({content: jdata.msg, type: 'error'});
                                }
                            }
                        })
                    }
                });
            }
        }],
        onLoadSuccess: function () {
            if (cepCheckout == 'Y') {
                $('#cepEdit').linkbutton("disable");
                $('#cepCheckin').linkbutton("enable");
                $('#cepCancel').linkbutton("enable");
            } else {
                $('#cepEdit').linkbutton("enable");
                $('#cepCheckin').linkbutton("disable");
                $('#cepCancel').linkbutton("disable");
            }
            if (jcType == "SMJC" || jcType == "NSJC") {
                $('#cepDiffFromManual').show();
                $('#cepDiffFromLastCustomManual').show();
            } else {
                $('#cepDiffFromManual').hide();
                $('#cepDiffFromLastCustomManual').hide();
            }
        }
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
    var jcPkid = $("#jcPkid").val();
    InitDataForm(jcPkid);
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//工序检出
function openEditor() {
    operation = 'EDIT';
    ifOpened = true;
    ajaxLoading();
    InitFuncCodeRequest_({
        data: {pkid: jcPkid, FunctionCode: "TD_JC_CEP_CHECKOUT"}, successCallBack: function (jdata) {
            ajaxLoadEnd();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                isCheckIn = true;
                cepCheckout = "Y";
                $('#cepEdit').linkbutton("disable");
                $('#cepCheckin').linkbutton("enable");
                $('#cepCancel').linkbutton("enable");
                if (param.OWindow.param.OWindow.param.OWindow && typeof param.OWindow.param.OWindow.param.OWindow.reload_ == 'function') {
                    param.OWindow.param.OWindow.param.OWindow.reload_();
                }
                var userInfo = getLoginInfo();
                var i = cepPath.lastIndexOf("/");
                var fileName = cepPath.slice(i + 1).replace(".xml", "");
                var protocol = window.location.protocol;
                var newProtocol = protocol.substring(0, protocol.length - 1);
                var ip = window.location.hostname;
                var pathName = window.location.pathname;
                var port = window.location.port;
                var controllerName = "jobcardcepcon/downcepfile";
                var userName = "";
                if (userInfo == null || userInfo == undefined || userInfo == '') {
                    userName = workFlowUser;
                } else {
                    userName = userInfo.userName;
                }
                var openMode = "1";
                var type = "JOBCARD";
                if (jcType == "LMJC" || jcType == "QECJC") {
                    type = jcType;
                }

                var includeGnbr = "true";
                var companyCode = "SFN";
                var manual = "BULK";
                var command = cepPath + ";" + fileName + ";"
                    + newProtocol + ";" + ip + ";" + port + ";" + controllerName + ";"
                    + userName + ";" + openMode + ";" + type + ";" + includeGnbr
                    + ";" + refType + ";" + refName + ";" + companyCode
                    + ";" + fleet + ";" + jcPkid + ";" + manual;

                window.location.href = "openEditor:" + command;
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//工序检入
function cepCheckin() {
    ajaxLoading();
    InitFuncCodeRequest_({
        async: false,
        data: {pkid: jcPkid, FunctionCode: "TD_JC_CEP_CHECKIN"}, successCallBack: function (jdata) {
            ajaxLoadEnd();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                cepCheckout = "N";
                // reload_();
                // if (param.OWindow.param.OWindow.InitDataForm) {
                //     param.OWindow.param.OWindow.InitDataForm(jcPkid);
                $('#cepEdit').linkbutton("enable");

                $('#cepCheckin').linkbutton("disable");
                $('#cepCancel').linkbutton("disable");
                reload_();
                MsgAlert({content: "检入成功！"});
                // }
                ifOpened = false;
                //location.reload();
                // param.OWindow.cepView(jdata.data);
                InitFuncCodeRequest_({
                    data: {jcPkid: jcPkid, FunctionCode: "GET_CURRENT_JC_CEP_DESC"},
                    successCallBack: function (jdata) {
                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                            cepPath = jdata.data[0].JC_CEP_PATH;
                        }
                    }
                });
                param.OWindow.param.OWindow.reload_();
                param.OWindow.param.OWindow.param.OWindow.reload_();
            } else {
                MsgAlert({content: jdata.msg.substring(8), type: 'error'});
            }
        }
    });

}

//取消
function cepCancel() {
    operation = 'CANCEL';
    ajaxLoading();
    InitFuncCodeRequest_({
        data: {pkid: jcPkid, FunctionCode: "TD_JC_CEP_CANCEL"}, successCallBack: function (jdata) {
            ajaxLoadEnd();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                isCheckIn = false;
                cepCheckout = "N";
                $('#cepEdit').linkbutton("enable");
                $('#cepCheckin').linkbutton("disable");
                $('#cepCancel').linkbutton("disable");
                reload_();
                MsgAlert({content: "取消成功！"});
                if (param.OWindow.param.OWindow.param.OWindow && typeof param.OWindow.param.OWindow.param.OWindow.reload_ == 'function') {
                    param.OWindow.param.OWindow.param.OWindow.reload_();
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

}

//对比
function cepDiff() {
    var selectRows = $("#dg").datagrid('getChecked');
    var selectCount = selectRows.length;
    if (selectCount != 2) {
        MsgAlert({content: '请选择两条要比较的工序记录！', type: 'error'});
        return;
    }
    var paths = "";
    $.each(selectRows, function (k, item) {
        paths += item.JC_CEP_PATH + ',';
    });
    var ceppaths = paths.substring(0, paths.length - 1);
    var firstFilePath = ceppaths.split(",")[0].replace(/\\/g, "\\\\");
    var secondFilePath = ceppaths.split(",")[1].replace(/\\/g, "\\\\");
    ajaxLoading();
    InitFuncCodeRequest_({
        data: {pkid: jcPkid, FunctionCode: "TD_JC_ALL_GET_DIFF_URL"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                reload_();
                if (jdata.data != null && jdata.data != "") {
                    diffURL = jdata.data;
                }
                ajaxLoading();
            }
        }
    });
    InitFuncCodeRequest_({
        data: {
            firstFilePath: firstFilePath,
            secondFilePath: secondFilePath,
            fleet: fleet,
            FunctionCode: "TD_JC_ALL_DIFF_CONVERT"
        },
        successCallBack: function (jdata) {
            ajaxLoadEnd();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                window.open(diffURL + "/diff/diff-ui/index.html?difffirstdoc=" + firstFilePath + "&diffseconddoc=" + secondFilePath);
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//版本对比
function editionDiff() {
    var curPath = window.document.location.href;
    var url;
    if (curPath.indexOf('me.sichuanair.com') >= 0) {//生产
        url = 'http://172.30.129.125:8001';
    } else if (curPath.indexOf('172.30.129.101') >= 0) {//测试
        url = 'http://172.30.129.104:8001';
    } else if (curPath.indexOf('172.30.129.111') >= 0) {//开发
        url = 'http://172.30.129.113:8001';
    } else {//本地
        url = 'http://localhost:8001';
    }
    if (!confirm("是否开始进行版本对比？")) {
        return;
    }
    ajaxLoading();
    InitFuncCodeRequest_({
        timeout: 3600000,//1小时超时时间
        data: {FunctionCode: "TD_JC_ALL_SMJC_EDITION_DIFF", pkid: jcPkid}, successCallBack: function (jdata) {
            ajaxLoadEnd();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                var filePaths = jdata.data;
                var firstFilePath = "";
                var secondFilePath = "";
                if (filePaths.indexOf(",") != -1) {
                    var pathArr = filePaths.split(",");
                    if (pathArr.length == 2) {
                        firstFilePath = pathArr[0];
                        secondFilePath = pathArr[1];
                    } else if (pathArr.length == 1) {
                        firstFilePath = pathArr[0];
                        secondFilePath = pathArr[0];
                    } else {
                        MsgAlert({content: "版本对比出错，请联系管理员！", type: 'error'});
                        return;
                    }
                }
                window.open(url + "/diff/diff-ui/index.html?difffirstdoc=" + firstFilePath + "&diffseconddoc=" + secondFilePath + "&type=verison");


            } else {
                var msg = "";
                if ("501" == jdata.code) {
                    msg = "当前未查询到已发布的数据，无法对比!";
                } else if ("502" == jdata.code) {
                    msg = "当前工卡版本与历史版本相同，无法对比!";
                } else {
                    msg = "版本对比失败!，请联系管理员!";
                }
                MsgAlert({content: msg, type: 'error'});

            }
        },
        complete: function (XMLHttpRequest, status) { //求完成后最终执行参数
            // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
            if (status == 'timeout') { //超时,status还有success,error等值的情况
                MsgAlert({content: "连接超时了,请联系管理员。", type: 'error'});

            }
        }
    });
}

//对比合并
function editionDiffMerge() {
    var curPath = window.document.location.href;
    var url;
    if (curPath.indexOf('me.sichuanair.com') >= 0) {//生产
        url = 'http://172.30.129.125:8001';
    } else if (curPath.indexOf('172.30.129.101') >= 0) {//测试
        url = 'http://172.30.129.104:8001';
    } else if (curPath.indexOf('172.30.129.111') >= 0) {//开发
        url = 'http://172.30.129.113:8001';
    } else {//本地
        url = 'http://localhost:8001';
    }
    if (confirm("是否开始进行对比合并？")) {
        /*-------zhangxun-------*/
        if (cepCheckout == 'N') {
            InitFuncCodeRequest_({
                data: {pkid: jcPkid, FunctionCode: "TD_JC_ALL_SMJC_EDITION_DIFF_MERGE"},
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        // MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        reload_();
                        if (jdata.data != null && jdata.data != "") {
                            cepPath = jdata.data;
                        }
                        ajaxLoading();
                        InitFuncCodeRequest_({
                            timeout: 3600000,//1小时超时时间
                            data: {FunctionCode: "TD_JC_ALL_SMJC_EDITION_DIFF", pkid: jcPkid, type: "merge"},
                            successCallBack: function (jdata) {
                                ajaxLoadEnd();
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    var filePaths = jdata.data;
                                    var firstFilePath = "";
                                    var secondFilePath = "";
                                    if (filePaths.indexOf(",") != -1) {
                                        var pathArr = filePaths.split(",");
                                        if (pathArr.length == 2) {
                                            firstFilePath = pathArr[0];
                                            secondFilePath = pathArr[1];
                                        } else if (pathArr.length == 1) {
                                            firstFilePath = pathArr[0];
                                            secondFilePath = pathArr[0];
                                        } else {
                                            MsgAlert({content: "版本对比出错，请联系管理员！", type: 'error'});
                                        }
                                    }
                                    window.open(url + "/diff/diff-ui/index.html?difffirstdoc=" + cepPath + "&diffseconddoc=" + secondFilePath + "&diffbasedoc=" + secondFilePath + "&type=merge");


                                } else {
                                    var msg = "";
                                    if ("501" == jdata.code) {
                                        msg = "当前未查询到已发布的数据，无法对比!";
                                    } else if ("502" == jdata.code) {
                                        msg = "当前工卡版本与历史版本相同，无法对比!";
                                    } else {
                                        msg = "版本对比失败!，请联系管理员!";
                                    }
                                    MsgAlert({content: msg, type: 'error'});
                                }
                            },
                            complete: function (XMLHttpRequest, status) { //求完成后最终执行参数
                                // 设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作
                                if (status == 'timeout') { //超时,status还有success,error等值的情况
                                    MsgAlert({content: "连接超时了,请联系管理员。", type: 'error'});
                                }
                            }
                        });
                    }
                }
            });
        } else {
            MsgAlert({content: "此工卡不允许对比合并", type: 'error'});

        }
        /*-------zhangxun-------*/
    }

}

//PDF预览
function cepViewPdf() {
    var data = $.extend({pkid: jcPkid}, {FunctionCode: 'TD_JC_PREVIEW'});
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

//Arbortext预览
function cepViewEditor() {
    InitDataGrid();
    ifOpened = true;
    var userInfo = getLoginInfo();
    var i = cepPath.lastIndexOf("/");
    var fileName = cepPath.slice(i + 1).replace(".xml", "");
    var protocol = window.location.protocol;
    var newProtocol = protocol.substring(0, protocol.length - 1);
    var ip = window.location.hostname;
    var pathName = window.location.pathname;
    var port = window.location.port;
    var controllerName = "jobcardcepcon/downcepfile";
    var userName = "";
    if (userInfo == null || userInfo == undefined || userInfo == '') {
        userName = workFlowUser;
    } else {
        userName = userInfo.userName;
    }
    var openMode = "0";
    var type = "JOBCARD";
    if (jcType == "LMJC" || jcType == "QECJC") {
        type = jcType;
    }

    var includeGnbr = "true";
    var companyCode = "SFN";
    var manual = "BULK";
    var command = cepPath + ";" + fileName + ";"
        + newProtocol + ";" + ip + ";" + port + ";" + controllerName + ";"
        + userName + ";" + openMode + ";" + type + ";" + includeGnbr
        + ";" + refType + ";" + refName + ";" + companyCode
        + ";" + fleet + ";" + jcPkid + ";" + manual;
    window.location.href = "openEditor:" + command;
}

//XML预览
function cepViewXml() {
    var selectRows = $("#dg").datagrid('getChecked');
    if (selectRows.length == 0) {
        MsgAlert({content: '请选择数据！', type: 'error'});
        return false;
    } else if (selectRows.length > 1) {
        MsgAlert({content: '只能选择一条数据进行浏览！', type: 'error'});
        return false;
    }
    window.open(selectRows[0].JC_CEP_PATH);
}

function jcPreview(url) {
    var title_ = $.i18n.t('工卡预览 ');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/smjc/smjcedit/jobcardPreview.shtml"
    });
}

//选取手册
function chooseManual() {
    var title_ = $.i18n.t('查询待对比手册列表');
    ShowWindowIframe({
        width: "850",
        height: "550",
        title: title_,
        param: {
            jcPkid: jcPkid,
            cepCheckout: cepCheckout
        },
        url: "/views/td/jobcard/commonjc/TdJcChooseManual.shtml"
    });
}

//选取上营运人手册
function chooseLastCustomManual() {
    var title_ = $.i18n.t('查询上营运人手册列表');
    ShowWindowIframe({
        width: "850",
        height: "550",
        title: title_,
        param: {
            jcPkid: jcPkid,
            cepCheckout: cepCheckout
        },
        url: "/views/td/jobcard/commonjc/TdJcChooseLastCustomManual.shtml"
    });
}

//复制工序(选取工卡)
function copyCepFromJc() {
    var title_ = $.i18n.t('查询工卡列表');
    ShowWindowIframe({
        width: "1050",
        height: "550",
        title: title_,
        param: {
            jcPkid: jcPkid,
            cepCheckout: cepCheckout,
            companyCode: customCode,
            fleet: fleet,
            jcType: jcType
        },
        url: "/views/td/jobcard/commonjc/TdJcChooseCep.shtml"
    });
}



function closeWin() {
    if (ifOpened == true) {
        //...
    } else {
        if (pageCount == 3) {
            param.OWindow.param.OWindow.param.OWindow.param.OWindow.reload_();
            param.OWindow.param.OWindow.param.OWindow.CloseWindowIframe();
        } else if (pageCount == 2) {
            param.OWindow.param.OWindow.reload_();
            param.OWindow.CloseWindowIframe();
            CloseWindowIframe();
        }
    }
    param.OWindow.param.OWindow.reload_();
    ifOpened = false;
}

function refreshForm(jcPkid) {
    InitDataForm(jcPkid);
}