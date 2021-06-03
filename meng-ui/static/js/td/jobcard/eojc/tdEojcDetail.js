var param;
var operation;
var COMBOBOX_DATA = {};
var jc_pkid = null;//主表PKID
var cPkid = null;
var cDesc = null;
var g_appType = null;//当前数据库适用性类型
/*EO部分增加————————2018-11-23 11:45:12*/
var segPkid = "";
var eotkPkid;
var noticePkid = "";
var CEP_FILE_PATH = "";
var CEP_CHECKOUT = "N";
var pageCount;
var taskId;
var type;
var jcType;
var eoJcNo;
var appType;
//EO是否评估单产生
var evalApplyType;
var ifEvaProduce;
var eoEa;
var fleet1;
var companyCode1;
var companyCode;
var flowStatus;
var msgData;
var accountId;
var evaManId;
var eaSort;

function i18nCallBack() {
    pageCount = 1;
    param = getParentParam_();
    title = param.title;
    operation = param.operation;
    jcType = param.jcType;
    eoJcNo = param.eoJcNo;
    /*EO部分增加————————2018-11-23 11:45:12*/
    segPkid = param.segPkid;
    eotkPkid = param.eotkPkid;
    noticePkid = param.noticePkid;
    taskId = param.taskId;
    type = param.type;
    appType = param.appType;
    companyCode = param.companyCode;
    flowStatus = param.flowStatus;
    msgData = param.msgData;
    accountId = param.accountId;
    eoJcNo = param.jcNo;

    if (msgData) {
        jc_pkid = param.recordId;
    } else {
        jc_pkid = param.pkid;
    }

    var quaCou = 0;
    InitFuncCodeRequest_({
        data: {pkid: jc_pkid, FunctionCode: "TD_JC_QUA_TURN"},
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data != null) {
                    quaCou = jdata.data.COU;
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    if (quaCou == 0 || operation == 'view') {
        $("#turnBtn").hide();
    } else {
        $("#turnBtn").show();
    }

    $(document).attr("title", title);

    if (taskId == "task1532343563002" || taskId == "task1532343599976" || taskId == "task1562921934889" || taskId == "task1562922358043") { //审核与批准
        $("#closeBtn").hide();
        $("#delayApplyBtn").hide();
        $("#delayApplyBtn").hide();
    } else if (taskId == "task1532343658824" || taskId == "task1562922437929") { //退回
        $("#closeBtn").hide();
        $("#submitBtn").hide();
        $("#delayApplyBtn").hide();
    }

    if (appType != "APL") {
        $("#singleViewBtn").hide();
    }

    if(jcType == "EOJC"){
        eoEa = "EO";
    }else if(jcType == "EAJC"){
        eoEa = "EA";
    }

    $("#exeFeedObjEmail").textbox({editable: false, onlyview: true});

    getEoInfoByPkid(jc_pkid);

    if (operation == 'view') {
        $("#saveBtn").hide();
        $("#editBtn").hide();
        $("#submitBtn").hide();
        $("#ffSearch").hide();
        $(".addBtn").hide();
        $("#delayApplyBtn").hide();
        $(".easyui-textbox").textbox({onlyview: true});
        $("#highlight").textbox({required: false, onlyview: true, editable: false});
        $("#ifSubstantRev").combobox({required: false, onlyview: true, editable: false})
    }

    // $("#dmChoosePre").hide();
    // $("#dmChooseSuff").hide();
    // $("#ifsdChoosePre").hide();
    // $("#ifsdChooseSuff").hide();

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,YESORNO,TD_JC_APP_TYPE,TD_JC_MATER_SORT,TD_JC_MATER_TYPE,TD_JC_MATER_UNIT,TD_JC_MATER_IMPORTANCE,EM_MSCN_CSC,TD_JC_SKILLS,TD_EXE_FEED_OBJ,TD_JC_APPENDIX_TYPE,TD_JC_APPENDIX_IF_APL",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                //机队
                COMBOBOX_DATA['fleet'] = jdata.data.DA_FLEET;
                // //是否必检
                // COMBOBOX_DATA['ifRii'] = jdata.data.YESORNO;
                //反馈厂家
                //COMBOBOX_DATA['backVendor'] = jdata.data.YESORNO;

                //航材/工具
                COMBOBOX_DATA['materSort'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_SORT"]);
                //航材类别
                COMBOBOX_DATA['materType'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_TYPE"]);
                //数量按需
                COMBOBOX_DATA['qtyReq'] = DomainCodeToMap_(jdata.data["YESORNO"]);
                //单位
                COMBOBOX_DATA['unit'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_UNIT"]);
                //适用情况（是否视情）
                COMBOBOX_DATA['importance'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_IMPORTANCE"]);

                //适用类型
                COMBOBOX_DATA['appendixAppType'] = DomainCodeToMap_(jdata.data["TD_JC_APP_TYPE"]);
                //附录类型
                COMBOBOX_DATA['appendixType'] = DomainCodeToMap_(jdata.data["TD_JC_APPENDIX_TYPE"]);
                //是否适用
                COMBOBOX_DATA['appendixIfApply'] = DomainCodeToMap_(jdata.data["TD_JC_APPENDIX_IF_APL"]);

                //机队
                $('#fleet').combobox({
                    panelHeight: '135px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                    // value: 'Y'
                });
                $('#skills').combobox({
                    panelHeight: '70px',
                    data: jdata.data.TD_JC_SKILLS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //适用类型
                $("#appType").combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_JC_APP_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $("#ifSubstantRev").combobox({
                    panelHeight: '50px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //执行反馈对象
                $('#exeFeedObj').combobox({
                    panelHeight: '70px',
                    data: jdata.data.TD_EXE_FEED_OBJ,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: 'NONE',
                    onSelect: function (item) {
                        $("#exeObjIds").val("");
                        if (item.VALUE == 'JC_EDITOR' || item.VALUE == 'OTHER') {
                            $("#exeFeedObjEmail").textbox({required: true, editable: false});
                            $("#exeFeedObjEmail").textbox('setValue', '');
                            $("#chooseExeFeedObj").show();
                        } else {
                            $("#exeFeedObjEmail").textbox({value: '', required: false, editable: false});
                            $("#chooseExeFeedObj").hide();
                            // //执行反馈对象邮箱
                            // $("#exeFeedObjEmail").MyComboGrid({
                            //     idField: 'EMAIL',  //实际选择值
                            //     textField: 'EMAIL', //文本显示值
                            //     panelWidth: '400px',
                            //     panelHeight: '200px',
                            //     width: 220,
                            //     required: true,
                            //     params: {FunctionCode: 'GET_EXE_FB_EMAIL'},
                            //     columns: [[
                            //         {field: 'JOB_NO', title: '工号', width: 50},
                            //         {field: 'NAME', title: '姓名', width: 50},
                            //         {field: 'EMAIL', title: '邮箱', width: 50}
                            //     ]],
                            //     onSelect: function (index, row) {
                            //         var otherFbObj = row.NAME + "(" + row.JOB_NO + ")";
                            //         selectRow = otherFbObj;
                            //         $("#exeFeedObjEmail").combogrid('setValue', otherFbObj);
                            //     },
                            //     onHidePanel: function () {
                            //         var t = $(this).combogrid('getValue');
                            //         if (t != null && t != '' & t != undefined) {
                            //             if (selectRow == null || t != selectRow) {//没有选择或者选项不相等时清除内容
                            //                 alert('请选择，不要直接输入！');
                            //                 $(this).combogrid({value: ''});
                            //             }
                            //         }
                            //     }
                            // });
                        }
                    }
                });
                // //执行反馈对象邮箱
                // $("#exeFeedObjEmail").MyComboGrid({
                //     idField: 'EMAIL',  //实际选择值
                //     textField: 'EMAIL', //文本显示值
                //     panelWidth: '400px',
                //     panelHeight: '200px',
                //     width: 220,
                //     params: {FunctionCode: 'GET_EXE_FB_EMAIL'},
                //     columns: [[
                //         {field: 'JOB_NO', title: '工号', width: 50},
                //         {field: 'NAME', title: '姓名', width: 50},
                //         {field: 'EMAIL', title: '邮箱', width: 50}
                //     ]],
                //     onSelect: function (index, row) {
                //         var otherFbObj = row.NAME + "(" + row.JOB_NO + ")";
                //         selectRow = otherFbObj;
                //         $("#exeFeedObjEmail").combogrid('setValue', otherFbObj);
                //     },
                //     onHidePanel: function () {
                //         var t = $(this).combogrid('getValue');
                //         if (t != null && t != '' & t != undefined) {
                //             if (selectRow == null || t != selectRow) {//没有选择或者选项不相等时清除内容
                //                 alert('请选择，不要直接输入！');
                //                 $(this).combogrid({value: ''});
                //             }
                //         }
                //     }
                // });


                CEP_CHECKOUT = jdata.data.CEP_CHECKOUT;
                CEP_FILE_PATH = jdata.data.CEP_FILE_PATH;

                //获取当前适用性类型
                if (jc_pkid) {
                    InitFuncCodeRequest_({
                        data: {jcPkId: jc_pkid, FunctionCode: 'TD_JC_ALL_EOJC_GET_APPTYPE'},
                        async: false,
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE && jdata.data != null && jdata.data[0] != null) {
                                g_appType = "MX";
                                if (g_appType == 'MX') {
                                    $('#appType').combobox({value: 'MX'});
                                    $("#jhmx").show();
                                } else {
                                    $('#appType').combobox({value: 'XH'});
                                    $("#jhmx").hide();
                                }
                            }
                        }
                    });
                }
                if (jc_pkid) {
                    InitDataForm(jc_pkid, eoJcNo);
                }
                //未编卡EO项目，右键编卡回显
                if (noticePkid != "" && noticePkid != undefined) {
                    InitDataFormByNoticePkid(noticePkid);
                }
                //EO执行说明，新建工卡回显
                if (segPkid != "" && segPkid != undefined && operation == 'save') {
                    InitDataFormBySegPkid(segPkid);
                }
                InitDataGrid(eoJcNo);

            }
        }
    })
}

//自定义参考资料
function InitDataGrid(jcNo) {
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg").MyDataGrid({
        identity: "dg",
        sortable: true,
        singleSelect: true,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {jcNo: jcNo},
        columns: {
            param: {FunctionCode: 'TD_JC_RELATE_APPENDIX_LIST'},
            alter: {
                APP_TYPE: {
                    formatter: function (value) {
                        return COMBOBOX_DATA['appendixAppType'][value];
                    }
                },
                APPEND_TYPE: {
                    formatter: function (value) {
                        return COMBOBOX_DATA['appendixType'][value];
                    }
                },
                APPEND_STATE: {
                    formatter: function (value) {
                        return COMBOBOX_DATA['appendixIfApply'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-delete",
                i18nText: "取消关联",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    var jcNo = $("#jcNo").textbox('getValue');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认取消关联该条记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {appendixPkid: rowData.PKID, jcNo: jcNo, FunctionCode: 'TD_JC_RELATE_APPEND_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadRelateAppendix();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        validAuth: function (row, items) {

        },
        onClickRow: function (rowIndex, rowData) {

        }
    });
}

function reloadRelateAppendix() {
    $("#dg").datagrid("reload");
}


//上传
function common_uploadFile(edopt) {
    var title_ = $.i18n.t('参考资料上传');
    ShowWindowIframe({
        width: 575,
        height: 200,
        title: title_,
        param: $.extend({}, edopt.param),
        url: "/views/td/jobcard/eojc/attachment_add.shtml"
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
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
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
}

function reload_() {
    // param.OWindow.reload_();
    $("#dg").datagrid("reload");
    var pkid = $("#pkid").val();
    var jcNo = $("#jcNo").textbox('getValue');
    InitDataForm(pkid, jcNo);
}


//构型和适用性增加
function addRow(type) {

    if (type == 'applytype') {
        if (jc_pkid == null || jc_pkid == "") {
            MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
            return;
        }
        $('#dg1').datagrid('appendRow', {});
    }

    if (type == 'mx') {
        if (jc_pkid == null || jc_pkid == "") {
            MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
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
            param: {jcPkid: jc_pkid, cPkid: cPkid, cDesc: cDesc, fleet: $("#fleet").combobox("getValue")},
            url: "/views/td/jobcard/tojc/tojcedit/tdTojcEditEffect.shtml"
        });
    }
}

//回填
function InitDataForm(pkid, jcNo) {
    InitFuncCodeRequest_({
        async: false,
        data: {pkid: pkid, jcNo: jcNo, FunctionCode: "TD_JC_ALL_EO_EA_JC_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);

                var jcNo = jdata.data.JC_NO;
                evaManId = jdata.data.WRITER;
                $("#jcNo").textbox({value: jcNo});
                $("#jcNo").textbox({onlyview: true, editable: false});
                $("#mopNo").val(jdata.data.MOP_NO);
                $("#exeObjIds").val(jdata.data.EXE_FEED_OBJ_EMAIL);
                //编写期限 EOJC/EAJC30天
                // var writeDate = new Date(jdata.data.WRITE_DATE);
                // var writeLimit = new Date(writeDate);
                // writeLimit.setDate(writeDate.getDate() + 30);
                //
                // $("#writeLimit").datebox({value: formatterDate(writeLimit)});
                if ("NONE" == jdata.data.EXE_FEED_OBJ || jdata.data.EXE_FEED_OBJ == "" || jdata.data.EXE_FEED_OBJ == undefined || jdata.data.EXE_FEED_OBJ == null) {
                    $("#chooseExeFeedObj").hide();
                    $("#exeFeedObjEmail").textbox({required: false})
                } else {
                    $("#exeFeedObjEmail").textbox({required: true})
                }
                //回勾MARK信息
                // var jcMark = jdata.data.JC_MARK;
                // if (jcMark != undefined && jcMark.length > 0) {
                //     var marks = jcMark.split(",");
                //     for (var i = 0; i < marks.length; i++) {
                //         $("#" + marks[i].toLowerCase()).attr("checked", true);
                //     }
                // }

                // var dmCheck =$("#dm").is(':checked');
                // var ifsdCheck =$("#ifsd").is(':checked');

                // if(dmCheck){
                //     $("#dmChoosePre").show();
                //     $("#dmChooseSuff").show();
                // }else{
                //     $("#dmChoosePre").hide();
                //     $("#dmChooseSuff").hide();
                // }

                // if(ifsdCheck){
                //     $("#ifsdChoosePre").show();
                //     $("#ifsdChooseSuff").show();
                // }else{
                //     $("#ifsdChoosePre").hide();
                //     $("#ifsdChooseSuff").hide();
                // }

                // $("#dmRelateJc").textbox('setValue', jdata.data.DM_JC);
                // $("#ifsdRelateJc").textbox('setValue', jdata.data.IFSD_JC);
                // $("#ifsdRelateJcPkid").attr('value', jdata.data.IFSD_JC_ID);
                // $("#dmRelateJcPkid").attr('value', jdata.data.DM_JC_ID);
                // $("#RelateJcPkid").attr('value', jdata.data.REL_JC_ID);

                //被关联工卡IFSD
                // if (jdata.data.IFSD_RELATE_JC != undefined) {
                //     $("#ifsdChoose").show();
                //     $("#ifsd").attr("checked", true);
                //     // $("#ifsd").attr("disabled", true);
                //     $("#ifsdChoosePre").show();
                //     $("#ifsdChooseSuff").show();
                //     // if(jdata.data.IFSD_JC != )
                //     $("#ifsdRelateJc").textbox('setValue', jdata.data.IFSD_RELATE_JC);
                // }

                // //被关联工卡DM
                // if (jdata.data.DM_RELATE_JC != undefined) {
                //     $("#dmChoose").show();
                //     $("#dm").attr("checked", true);
                //     // $("#dm").attr("disabled", true);
                //     $("#dmChoosePre").show();
                //     $("#dmChooseSuff").show();
                //     $("#dmRelateJc").textbox('setValue', jdata.data.DM_RELATE_JC);
                // }

                CEP_CHECKOUT = jdata.data.CEP_CHECKOUT;
                CEP_FILE_PATH = jdata.data.CEP_FILE_PATH;

                //获取适用性
                InitFuncCodeRequest_({
                    data: {pkid: jc_pkid, appType: jdata.data.APP_TYPE, FunctionCode: "TD_EO_EA_JC_APPLY_GET"},
                    successCallBack: function (jdata) {
                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                            $("#applicability").textbox('setValue', jdata.data);
                        }
                    }
                });

                //获取其他反馈对象
                InitFuncCodeRequest_({
                    data: {
                        exeObjs: jdata.data.EXE_FEED_OBJ_EMAIL,
                        exeObjType: jdata.data.EXE_FEED_OBJ,
                        FunctionCode: "TD_GET_EXE_FEED_OBJ_BYID"
                    },
                    successCallBack: function (jdata5) {
                        if (jdata5.code == RESULT_CODE.SUCCESS_CODE) {
                            $("#exeFeedObjEmail").textbox('setValue', jdata5.data);
                        }
                    }
                });

                fleet1 = jdata.data.FLEET;
                companyCode1 = jdata.data.COMPANY_CODE;

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//提交
function submitWorkflow() {

    var isValidate = $("#mform").form('validate');
    if (!isValidate) {
        return;
    }
    var msgArr = [];
    var skills = $("#skills").combobox('getValue');
    if (jc_pkid == null || jc_pkid == "") {
        // MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        // return;
        msgArr.push("请先保存部件封面数据，在进行资料选择!");
    }
    if (CEP_FILE_PATH == null || CEP_FILE_PATH == "") {
        // MsgAlert({content: "当前没有工序文件，不能进行提交。", type: 'error'});
        // return;
        msgArr.push("当前没有工序文件，不能进行提交!");
    }
    if (CEP_CHECKOUT != "" && CEP_CHECKOUT == "Y") {
        // MsgAlert({content: "当前文件已被检出，不能进行提交。", type: 'error'});
        // return;
        msgArr.push("当前文件已被检出，不能进行提交!");
    }
    if (msgArr.length > 0) {
        hints(msgArr);
    } else {
        checkQua(jcType);
    }

}

// 保存
function save() {
    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;


    var $form = $("#mform");
    var datas = $form.serializeObject();
    var jcNo = $("#jcNo").textbox('getValue');
    var exeObjIdInfo = $("#exeObjIds").val();
    // var ifsd, ad, rii, ali, cdccl, ewis, fts, dm, rci, cpcp;

    /*新增*/
    if (segPkid != "" && segPkid != undefined) {
        datas.segPkid = segPkid;
    }

    // if ($("#ifsd").is(':checked')) {
    //     ifsd = $("#ifsd").attr("value") + ",";
    // } else {
    //     ifsd = "";
    // }
    //
    // if ($("#ad").is(':checked')) {
    //     ad = $("#ad").attr("value") + ",";
    // } else {
    //     ad = "";
    // }
    //
    // if ($("#rii").is(':checked')) {
    //     rii = $("#rii").attr("value") + ",";
    // } else {
    //     rii = "";
    // }
    //
    // if ($("#ali").is(':checked')) {
    //     ali = $("#ali").attr("value") + ",";
    // } else {
    //     ali = "";
    // }
    //
    // if ($("#cdccl").is(':checked')) {
    //     cdccl = $("#cdccl").attr("value") + ",";
    // } else {
    //     cdccl = "";
    // }
    //
    // if ($("#ewis").is(':checked')) {
    //     ewis = $("#ewis").attr("value") + ",";
    // } else {
    //     ewis = "";
    // }
    //
    // if ($("#fts").is(':checked')) {
    //     fts = $("#fts").attr("value") + ",";
    // } else {
    //     fts = "";
    // }
    //
    // if ($("#dm").is(':checked')) {
    //     dm = $("#dm").attr("value") + ",";
    // } else {
    //     dm = "";
    // }
    //
    // if ($("#rci").is(':checked')) {
    //     rci = $("#rci").attr("value") + ",";
    // } else {
    //     rci = "";
    // }
    //
    //
    // if ($("#cpcp").is(':checked')) {
    //     cpcp = $("#cpcp").attr("value") + ",";
    // } else {
    //     cpcp = "";
    // }
    //
    // var markInfo = ifsd + ad + rii + ali + cdccl + ewis + fts + dm + rci + cpcp;

    // if (markInfo == "" || markInfo == null || markInfo == undefined) {
    //     markInfo = "";
    // } else {
    //     markInfo = markInfo.substring(0, markInfo.lastIndexOf(","));
    // }

    datas = $.extend(datas, {
        FunctionCode: 'TD_JC_ALL_EOJC_ADD',
        jcNo: jcNo,
        type: operation,
        jcType: jcType,
        exeObjIdInfo: exeObjIdInfo,
        // markInfo: markInfo,
        flowStatus: flowStatus
    });
    //唯一检测
    if (param.operation == "save") {
        InitFuncCodeRequest_({
            data: {jcNo: jcNo, FunctionCode: "TD_JC_ALL_EOJC_CHECK"}, successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    if (jdata.data != null) {
                        MsgAlert({content: "保存失败,请检查[工卡号、内控版本]是否重复。", type: 'error'});

                    } else {
                        InitFuncCodeRequest_({
                            data: datas, successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    jc_pkid = jdata.data;
                                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                    // if (param.OWindow.onSearch_) {
                                    //     param.OWindow.onSearch_('dg', '#ffSearch');
                                    // }
                                    if (param.OWindow && typeof param.OWindow.reload_ == 'function') {
                                        param.OWindow.reload_();
                                    }
                                } else {
                                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                                }
                            }
                        });
                    }
                } else {
                    MsgAlert({content: "检查唯一性失败", type: 'error'});

                }
            }
        });
    } else {
        InitFuncCodeRequest_({
            data: datas, successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    if (param.OWindow.onSearch_) {
                        param.OWindow.onSearch_('dg', '#ffSearch');
                    }
                    if (param.OWindow.reloadParam_) {
                        param.OWindow.reloadParam_("#eotk");
                    }
                    if (param.OWindow && typeof param.OWindow.reload_ == 'function') {
                        param.OWindow.reload_();
                    }
                    // CloseWindowIframe();
                } else {
                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                }
            }
        });
    }
}

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
 * 解析以“;”分割的字符串，初始化复选框勾选状态
 * @param elName
 * @param elStr
 * @returns {string}  ex: "A,B,C,D,E,F"
 */
function initCheckBoxValues(elName, elStr) {
    var arr = [];
    if (elStr && elStr.length > 0) {
        arr = elStr.split(',');
    }
    for (i in arr) {
        $('input[name="' + elName + '"]:checkbox[value =' + arr[i] + ']').prop('checked', true);
    }
}
//打开航材详情页
function addMater(operation) {
    var pkid = jc_pkid;

    if (jc_pkid == null || jc_pkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }
    var title_ = $.i18n.t('航材工具详情');
    ShowWindowIframe({
        width: "600",
        height: "180",
        title: title_,
        param: {pkid: pkid, type: operation},
        url: "/views/td/jobcard/eojc/tdEoJcMaterDetail.shtml"
    });
}

function editMater(operation, materPkid, config, configPkid) {
    var title_ = $.i18n.t('航材工具详情');
    ShowWindowIframe({
        width: "600",
        height: "220",
        title: title_,
        param: {pkid: jc_pkid, materPkid: materPkid, type: operation, config: config, configPkid: configPkid},
        url: "/views/td/jobcard/eojc/tdEoJcMaterDetail.shtml"
    });
}

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
        InitFuncCodeRequest_({
            data: {pkid: item.PKID, FunctionCode: 'TD_JC_ALL_EOJC_DELETE_MASTER'},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    reload_("dg");
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    });


}


function editProcedure() {
    if (jc_pkid == null || jc_pkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }

    var title_ = $.i18n.t('编辑工序选项');
    var pkid = jc_pkid;
    var fleet = $("#fleet").textbox('getValue');
    var checkout = $("#cepCheckout").val();//null
    var cepFilePath = $("#cepFilePath").val();//null
    var refType = $("#refdataType").val();//null 应该默认为SB
    var refData = $("#refData").val();

    ShowWindowIframe({
        width: "500",
        height: "200",
        title: title_,
        param: {
            jcPkid: pkid,
            fleet: fleet,
            checkout: checkout,
            cepFilePath: cepFilePath,
            refType: refType,
            refData: refData,
            pageCounter: pageCount,
            jcType: jcType
        },
        url: "/views/td/jobcard/eojc/TdJcSelectCep.shtml"
    });
}

function cepView(data) {
    $("#cepCheckout").val('N');
    $("#cepFilePath").val(data.jcCepPath);
}

// function closeW() {
//     if (confirm("是否关闭该页面？")) {
//         CloseWindowIframe();
//         param.OWindow.reloadParam_("#eotk");
//     }
// }

//未编卡EO项目，右键编卡回显
function InitDataFormByNoticePkid(noticePkid) {
    InitFuncCodeRequest_({
        data: {pkid: noticePkid, FunctionCode: 'SELECT_TDEONOTICE_BYID'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                var jcNo = jdata.data.eoNo;
                jcNo = jcNo.substring(0, 2) + "JC" + jcNo.substring(2, jcNo.length);
                $("#jcNo").textbox({value: jcNo});
                $("#fleet").combobox({value: jdata.data.fleet});
                $("#subjectCn").textbox({value: jdata.data.title});
            }
        }
    });
}

//EO执行说明，新建工卡回显
function InitDataFormBySegPkid(segPkid) {
    InitFuncCodeRequest_({
        data: {pkid: segPkid, FunctionCode: 'SELECT_EO_BY_SEGPKID'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                var jcNo = jdata.data.eoNo;
                jcNo = jcNo.substring(0, 2) + "JC" + jcNo.substring(2, jcNo.length);
                $("#jcNo").textbox({value: jcNo});
                $("#fleet").combobox({value: jdata.data.acfleet});
                $("#subjectCn").textbox({value: jdata.data.titleCn});
                $("#subjectEn").textbox({value: jdata.data.titleEn});
            }
        }
    });
}

/**
 * 导入EO构型
 */
function addConfig() {
    if (jc_pkid == null || jc_pkid == "") {
        MsgAlert({content: "请先保存工卡信息", type: 'error'});
        return;
    }
    ShowWindowIframe({
        width: 800,
        height: 360,
        title: "增加适用性构型",
        param: {segPkid: segPkid, jcPkid: jc_pkid, appType: $('#appType').combobox('getValue')},
        url: "/views/td/jobcard/eojc/tdEojc_config_add.shtml"
    });
}

/**
 * 导入航材
 */
function importMater() {
    if (jc_pkid == null || jc_pkid == "") {
        MsgAlert({content: "请先保存工卡信息", type: 'error'});
        return;
    }
    ShowWindowIframe({
        width: 800,
        height: 360,
        title: "增加航材工具",
        param: {segPkid: segPkid, jcPkid: jc_pkid},
        url: "/views/td/jobcard/eojc/tdEojc_materials_add.shtml"
    });

}

// //选择DM
// function chooseDm() {
//     var dmCheck = $("#dm").is(':checked');
//     var ifsdCheck = $("#ifsd").is(':checked');
//     if (ifsdCheck) {
//         MsgAlert({content: "该工卡是IFSD类工卡！！！", type: 'error'});
//         $("#dm").attr("checked", false);
//         return;
//     }
//     if (dmCheck) {
//         $("#dmChoosePre").show();
//         $("#dmChooseSuff").show();
//     } else {
//         if (!confirm("确认取消DM吗？若取消，DM相关工卡信息则会清空")) {
//             return;
//         }
//         //清除当前工卡下的DM-MARK信息
//         InitFuncCodeRequest_({
//             data: {jcPkid: jc_pkid, FunctionCode: "DELETE_DM_MARK"},
//             successCallBack: function (jdata) {
//                 if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
//
//                 }
//             }
//         });
//         //清空DM下的相关工卡信息
//         InitFuncCodeRequest_({
//             data: {jcNo: param.jcNo, relateType: 'DM', FunctionCode: "DELETE_DM_RELATE_JC"},
//             successCallBack: function (jdata) {
//                 if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
//                     MsgAlert({content: $.i18n.t('DM相关工卡已清空！')});
//                 }
//             }
//         });
//         $("#dmChoosePre").hide();
//         $("#dmRelateJc").textbox('setValue', '');
//         $("#dmChooseSuff").hide();
//     }
// }
//
// //选择IFSD
// function chooseIfsd() {
//     var ifsdCheck = $("#ifsd").is(':checked');
//     var dmCheck = $("#dm").is(':checked');
//     if (dmCheck) {
//         MsgAlert({content: "该工卡是DM类工卡！！！", type: 'error'});
//         $("#ifsd").attr("checked", false);
//         return;
//     }
//     if (ifsdCheck) {
//         $("#ifsdChoosePre").show();
//         $("#ifsdChooseSuff").show();
//     } else {
//         if (!confirm("确认取消IFSD吗？若取消，IFSD相关工卡信息则会清空")) {
//             return;
//         }
//         //清楚当前工卡下的IFSD-MARK信息
//         InitFuncCodeRequest_({
//             data: {jcPkid: jc_pkid, FunctionCode: "DELETE_IFSD_MARK"},
//             successCallBack: function (jdata) {
//                 if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
//
//                 }
//             }
//         });
//         //清空IFSD下的相关工卡信息
//         InitFuncCodeRequest_({
//             data: {jcNo: param.jcNo, relateType: 'IFSD', FunctionCode: "DELETE_IFSD_RELATE_JC"},
//             successCallBack: function (jdata) {
//                 if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
//                     MsgAlert({content: $.i18n.t('IFSD相关工卡已清空！')});
//                 }
//             }
//         });
//         $("#ifsdChoosePre").hide();
//         $("#ifsdRelateJc").textbox('setValue', '');
//         $("#ifsdChooseSuff").hide();
//     }
// }

//DM关联工卡
// function maintenDmJcFromMark() {
//     var jcNo = $("#jcNo").val();
//     var fleet = $("#fleet").val();
//     var title_ = $("#maintenDmJc").val();
//     var dmRelJc = $("#dmRelateJc").textbox('getValue');
//     var dmRelJcId = $("#dmRelateJcPkid").val();
//     ShowWindowIframe({
//         width: "960",
//         height: "500",
//         title: title_,
//         param: {
//             pkid: jc_pkid,
//             fleet: fleet,
//             jcNo: jcNo,
//             title: title_,
//             dmRelJc: dmRelJc,
//             dmRelJcId: dmRelJcId,
//             jcType: jcType,
//             companyCode: param.companyCode,
//             markType: 'DM'
//         },
//         url: "/views/td/jobcard/eojc/tdRelateJc.shtml"
//     });
// }

//IFSD关联工卡
// function maintenIfsdJcFromMark() {
//     var jcNo = $("#jcNo").val();
//     var fleet = $("#fleet").val();
//     var title_ = $("#maintenIfsdJc").val();
//     var ifsdRelJc = $("#ifsdRelateJc").textbox('getValue');
//     var ifsdRelJcId = $("#ifsdRelateJcPkid").val();
//     ShowWindowIframe({
//         width: "960",
//         height: "500",
//         title: title_,
//         param: {
//             pkid: jc_pkid,
//             fleet: fleet,
//             jcNo: jcNo,
//             title: title_,
//             ifsdRelJc: ifsdRelJc,
//             ifsdRelJcId: ifsdRelJcId,
//             jcType: jcType,
//             companyCode: param.companyCode,
//             markType: 'IFSD'
//         },
//         url: "/views/td/jobcard/eojc/tdRelateJc.shtml"
//     });
// }


function previewPDF() {
    if (jc_pkid == null || jc_pkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }
    var data = $.extend({pkid: jc_pkid}, {FunctionCode: 'TD_JC_PREVIEW'});
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

function jcPreview(url) {
    var title_ = $.i18n.t('EO工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/eojc/eoJobcardPreview.shtml"
    });
}

//获取EO ID并保存在页面上
function getEoInfoByPkid(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_EO_EA_INFO_GET"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE && jdata.data != null) {
                $("#eoPkid").val(jdata.data.PKID);
                $("#fromEo").text(jdata.data.EO_NO);
            }else{
                $("#eoPkid").val("");
                $("#fromEo").text('N/A');
            }
        }
    });
}

function previewEoOrEaInfo() {
    var eoPkid = $("#eoPkid").val();
    var applyType = $('#appType').combobox('getValue');
    isEvalProduce(eoPkid, applyType);
    var title_;
    var url;
    if(jcType == "EOJC"){
        title_ = $.i18n.t('EO详细页');
        url = "/views/em/emeo/eoEdit.shtml";
    }else if(jcType == "EAJC"){
        title_ = $.i18n.t('EA详细页');
        queryEaSort(eoPkid);
        if(eaSort == 'ERO' || eaSort == 'APUG' || eaSort == 'QLJG' || eaSort == 'REVERSERG'){
            url = "/views/em/emea/ero/eroEdit.shtml";
        }else{
            url = "/views/em/emea/eaEdit.shtml";
        }

    }
    ShowWindowIframe({
        width: "1248",
        height: "720",
        title: title_,
        param: {
            pkid: eoPkid,
            applyType: applyType,
            ifEvaProduce : ifEvaProduce,
            evalApplyType : evalApplyType,
            eroFlag: jcType,
            operation : 'view'
        },
        url: url
    });
}

function submitGeneral(pkid, jcType) {
    var flowKey = null;
    tempExeSave();
    if ("EOJC" == jcType) {
        flowKey = "tdEojcService";
    } else if ("EAJC" == jcType) {
        flowKey = "tdEajcService";
    }
    $.messager.confirm('', '是否确认提交？', function (r) {
        if (r) {
            common_add_edit_({
                identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                param: {
                    roleId: '',
                    otherParam: jc_pkid,
                    otherParam1: jcType,
                    msgData: msgData,
                    FunctionCode_: 'TD_JC_ALL_EOJC_SUBMIT',
                    successCallback: reload_,
                    flowKey: flowKey
                },
                url: "/views/em/workflow/work_flow_account_select.shtml"
            });
        }
    });
}

//临时执行保存操作
function tempExeSave() {

    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;
    var $form = $("#mform");
    var datas = $form.serializeObject();
    var jcNo = $("#jcNo").textbox('getValue');
    var exeObjIdInfo = $("#exeObjIds").val();

    datas = $.extend(datas, {
        FunctionCode: 'TD_JC_ALL_EOJC_ADD',
        jcNo: jcNo,
        type: operation,
        jcType: jcType,
        exeObjIdInfo: exeObjIdInfo,
        flowStatus: flowStatus
    });
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                param.OWindow.reload_();
            }
        }
    });
}

//单机预览
function singlePreviewPDF() {

    var mopNo = $("#mopNo").val();
    var msgArr = [];
    if(mopNo != null && mopNo != undefined && mopNo != ''){
        // MsgAlert({content: "ME系统PDF路径有值，不能做单机预览！", type: 'error'});
        // return;
        msgArr.push("ME系统PDF路径有值，不能做单机预览！");
    }
    if (CEP_FILE_PATH == null || CEP_FILE_PATH == "") {
        // MsgAlert({content: "当前未查询到工序文件，无法预览。", type: 'error'});
        // return;
        msgArr.push("当前未查询到工序文件，无法预览！");
    }
    if (msgArr.length > 0) {
        hints(msgArr);
    } else {
        ShowWindowIframe({
            width: "460",
            height: "500",
            param: {
                jcId: jc_pkid,
                fleet: param.fleet,
                action: "EMSINGLEPREVIEW"
            },
            url: "/views/td/jobcard/tdAcnoChoose.shtml"
        });
    }
}

//EO是否评估单产生
function isEvalProduce(pkid, applyType) {
    InitFuncCodeRequest_({
        async: false,
        data: {eoPkid: pkid, eoEa: eoEa, applyType: applyType ,FunctionCode: 'EM_EO_EVALFILE_TYPE'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                evalApplyType = jdata.data.EVAL_COUNT;
                if(evalApplyType == 0){
                    ifEvaProduce = 'N';
                }else{
                    ifEvaProduce = 'Y';
                }
            }
        }
    });
}

function queryEaSort(eoPkid){
    InitFuncCodeRequest_({
        async: false,
        data: {pkid: eoPkid,FunctionCode: 'EM_EO_PKID'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eaSort = jdata.data.EA_SORT;
            }
        }
    });
}

//从区域与盖板主数据中取区域值
function chooseZonesFromMD() {
    var title_ = $.i18n.t('选择区域值');
    var zoneIds = $("#zoneIds").val();
    ShowWindowIframe({
        width: "980",
        height: "500",
        param: {
            companyCode: companyCode1,//同营运人
            fleet: fleet1,//同机型
            zonesIds: zoneIds,
            title: title_
        },
        url: "/views/td/jobcard/smjc/smjcedit/tdZonesChoose.shtml"
    });
}

//从区域与盖板主数据中取盖板值
function chooseAcpansFromMD() {
    var title_ = $.i18n.t('选择接近盖板值');
    var acpanIds = $("#acpanIds").val();
    ShowWindowIframe({
        width: "980",
        height: "500",
        param: {
            companyCode: companyCode1,//同营运人
            fleet: fleet1,//同机型
            acpanIds: acpanIds,
            title: title_
        },
        url: "/views/td/jobcard/smjc/smjcedit/tdAcpansChoose.shtml"
    });
}

function setZonesFromMd(zones, zoneIds) {
    $("#zones").textbox('setValue', zones);
    $("#zoneIds").val(zoneIds);
}

function setAcpansFromMd(acpans, acpanIds) {
    $("#accessNo").textbox('setValue', acpans);
    $("#acpanIds").val(acpanIds);
}

//工卡页面添加附加内容
function addAppendix() {
    var title_ = $.i18n.t('选取附加内容');
    var pkid = $("#pkid").val();
    var jcNo = $("#jcNo").textbox('getValue');
    if ($.trim(pkid) == '') {
        alert("请先保存工卡封面,再选取附加内容！");
        return;
    }
    ShowWindowIframe({
        width: "1000",
        height: "500",
        param: {
            companyCode: companyCode,//同营运人
            jcNo: jcNo,
            appType: appType,
            title: title_,
            jcType: jcType
        },
        url: "/views/td/jobcard/smjc/smjcedit/tdAppendixChoose.shtml"
    })
}

//延期申请
function delayApply() {
    var pkid = $("#pkid").val();
    var postSort;
    if (pkid == "") {
        MsgAlert({content: '请先保存基本信息！', type: 'error'});
        return false;
    }
    var isValidate = $("#mform").form('validate');
    if (!isValidate) {
        MsgAlert({content: '请完整填写页面必填内容保存后再进行该操作', type: 'warn'});
        return false;
    }
    var writeLimit = $("#writeLimit").datebox('getValue');//编写期限
    var jcNo = $("#jcNo").textbox('getValue');
    if (jcType == 'EOJC') {
        postSort = "EOTK"
    } else if (jcType == "EAJC") {
        postSort = "EATK";
    }
    InitFuncCodeRequest_({
        data: {postponeObjectPkid: pkid, postponeSort: postSort, FunctionCode: "TD_JC_CHECK_IF_SUBMIT_DELAY"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data.COU != 0) {
                    MsgAlert({content: '已有未审批完成的延期申请，请勿重复提交!', type: 'error'});
                } else {
                    ShowWindowIframe({ //链接MP综合查询页面
                        width: 610,
                        height: 330,
                        param: {
                            postponeSort: postSort,
                            postponeObjectPkid: pkid,
                            postponeObjectNo: jcNo,
                            originalDeadline: writeLimit
                        },
                        title: "工卡延期申请",
                        url: "/views/em/empostpone/empostpone_add.shtml"
                    });
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    })
}


function checkQua(jcType) {
    var exeFbObj = $("#exeFeedObj").combobox('getValue');
    var jcPkid = $('#pkid').val();
    var ata = $("#ata").textbox('getValue');
    var fleet = $("#fleet").combobox('getValue');
    InitFuncCodeRequest_({
        data: {pkid: jcPkid, taskType: "EOJC", FunctionCode: 'TD_JC_CHECK_QUA'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eflag = jdata.data.eflag;
                ifQua = jdata.data.ifQua;
                var tips = '';
                if (eflag == "NO") {
                    tips = "当前用户没有该工卡的资质，请提交给有资质的用户！";
                }
                if (eflag == "ALL") {
                    //执行反馈对象校验
                    InitFuncCodeRequest_({
                        data: {
                            pkid: jc_pkid,
                            FunctionCode: "TD_JC_ALL_QECJC_STATUS"
                        },
                        successCallBack: function (jdata3) {
                            if (jdata3.code == RESULT_CODE.SUCCESS_CODE) {
                                if (jdata3.data == null) {
                                    //校验编写期限是否到期
                                    var curJcWriteLimit = $("#writeLimit").datebox('getValue');
                                    InitFuncCodeRequest_({
                                        data: {
                                            curJcWriteLimit: curJcWriteLimit,
                                            FunctionCode: "TD_CHECK_WRITE_LIMIT_IF_EXPIRE"
                                        },
                                        successCallBack: function (jdata4) {
                                            if (jdata4.code == RESULT_CODE.SUCCESS_CODE) {
                                                //执行反馈对象校验
                                                InitFuncCodeRequest_({
                                                    data: {
                                                        cepFilePath: CEP_FILE_PATH,
                                                        exeFbObj: exeFbObj,
                                                        FunctionCode: "CHECK_EXE_FB_EMAIL"
                                                    },
                                                    successCallBack: function (jdata1) {
                                                        if (jdata1.code == RESULT_CODE.SUCCESS_CODE) {
                                                            //校验MARK信息中的必检与互检
                                                            InitFuncCodeRequest_({
                                                                data: {
                                                                    jcPkid: jcPkid,
                                                                    jcType: jcType,
                                                                    cepFilePath: CEP_FILE_PATH,
                                                                    FunctionCode: "CHECK_BJ_OR_HJ"
                                                                },
                                                                successCallBack: function (jdata2) {
                                                                    if (jdata2.code == RESULT_CODE.SUCCESS_CODE) {
                                                                        submitGeneral(jcPkid, jcType);
                                                                    } else {
                                                                        MsgAlert({content: jdata2.msg, type: 'error'});
                                                                    }
                                                                }
                                                            })
                                                        } else {
                                                            MsgAlert({content: jdata1.msg, type: 'error'});
                                                        }
                                                    }
                                                })
                                            } else {
                                                MsgAlert({content: jdata4.msg, type: 'error'});
                                            }
                                        }
                                    })
                                } else {
                                    MsgAlert({content: "该数据已被提交过了。", type: 'error'});
                                }
                            }
                        }
                    })
                } else {
                    $.messager.confirm('', tips, function (r) {
                        if (r) {
                            ShowWindowIframe({
                                width: 550,
                                height: 250,
                                title: "联合评估",
                                param: {
                                    pkid: jcPkid,
                                    ata: ata,
                                    fleet: fleet,
                                    cflag: "commit",
                                    fluflag: "edit",
                                    taskType: "EOJC",
                                    accountId: accountId,
                                    ifQua: ifQua,
                                    eflag: eflag
                                },
                                url: '/views/td/jobcard/smjc/smjcedit/tdJcTrans.shtml'
                            });
                        }
                    });
                }
            } else {
                MsgAlert({content: $.i18n.t(jdata.msg), type: 'error'});
            }
        }
    });
}


function turnTdJc() {
    var jcPkid = $('#pkid').val();
    var ata = $("#ata").textbox('getValue');
    var fleet = $("#fleet").combobox('getValue');
    var cflag = "turn";
    ShowWindowIframe({
        width: 550,
        height: 250,
        title: "驳回",
        param: {
            accId: evaManId,
            pkid: jcPkid,
            cflag: cflag,
            ata: ata,
            fleet: fleet,
            ifQua: "N",
            taskType: "EOJC",
            accountId: accountId
        },
        url: '/views/td/jobcard/smjc/smjcedit/tdJcTrans.shtml'
    });
}

//显示所有修订内容（不包含当前版本）
function showAllModifyContent() {
    var jcPkid = $("#pkid").val();
    ShowWindowIframe({
        width: 600,
        height: 600,
        param: {jcPkid: jcPkid},
        title: "修订内容详情",
        url: "/views/td/jobcard/commonjc/TdJcModifyContentHints.shtml"
    });
}

//显示所有改版记录（不包含当前版本）
function showAllRevRecord() {
    var jcPkid = $("#pkid").val();
    ShowWindowIframe({
        width: 600,
        height: 600,
        param: {jcPkid: jcPkid},
        title: "改版记录详情",
        url: "/views/td/jobcard/commonjc/TdJcRevRecordHints.shtml"
    });
}

function hints(mgs) {
    ShowWindowIframe({
        width: 320,
        height: 300,
        param: {mgs: mgs},
        title: "工卡提示",
        url: "/views/td/jobcard/commonjc/TdHints.shtml"
    });
}

//选择其他反馈对象
function chooseOtherExeFeedObjEmail() {
    var exeObjIdInfo = $("#exeObjIds").val();
    var exeFeedObj = $("#exeFeedObj").combobox('getValue');
    var flag = "";
    if (exeFeedObj == "JC_EDITOR") {
        flag = "USER";
    } else if (exeFeedObj == "OTHER") {
        flag = "GROUP";
    }
    ShowWindowIframe({
        width: 730,
        height: 600,
        title: "选择反馈人",
        param: {exeObjIdInfo: exeObjIdInfo, flag: flag},
        url: "/views/td/jobcard/commonjc/TdChooseOtherExeObjEmail.shtml"
    });
}

function setOtherExeObjValue(otherExeObj, exeObjIds) {
    $("#exeFeedObjEmail").textbox('setValue', otherExeObj);
    $("#exeObjIds").val(exeObjIds);
}