var param;
var iparam;
var operation;
var operationAdd;
var PAGE_DATA = {};
var nalter = {};
var selArray = [];

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
    }

    if(iparam.nameEN == 'emEoApp5'){//航材列表
        $('#newPnApply').show();
    }else{
        $('#btnTd').css('width', '50px');
    }

    var domainCode = new Set();
    if (iparam.alter) {
        for (let i = 0; i < iparam.alter.length; i++) {
            domainCode.add(iparam.alter[i].pageData);
            let formatter = `{
                        formatter: function (value) {
                            return PAGE_DATA['${iparam.alter[i].field}'][value];
                        }
                    }`;
            nalter[iparam.alter[i].field] = eval('(' + formatter + ')');
        }
    }
    nalter.ISSUE_DATE = {
        type: 'date'
    }
    nalter.EFFECT_DATE = {
        type: 'date'
    }

    InitFuncCodeRequest_({
        data: {
            domainCode: Array.from(domainCode).join(','),
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (iparam.alter) {
                for (let i = 0; i < iparam.alter.length; i++) {
                    PAGE_DATA[iparam.alter[i].field] = DomainCodeToMap_(jdata.data [iparam.alter[i].pageData]);
                }
            }

            if (iparam.pkid && iparam.pkid != -1) {
                $("#dataType").combobox({onlyview: true, editable: false});
                InitDataForm(iparam.pkid);
            }
        }
    });
    initTableTitle();
    if (iparam.pkid && iparam.pkid != -1) {
        InitDataGrid("dg", iparam.pkid);
        InitDataForm(iparam.pkid);
    } else {
        InitDataGrid("dg", -1);
    }

}

var $pd = {};

function InitDataGrid(id, eoPkid) {
    var height = 175;
    if(iparam.nameEN == 'emEoApp5'){//航材列表
        height = 350;
    }
    $pd[id] = $("#" + id);
    $pd[id].MyDataGrid({
        identity: id,
        sortable: true,
        singleSelect: true,
        pagination: false,
        fit: false,
        resize: function () {
            return {width: '100%', height: height};
        },
        queryParams: {
            "eoPkid": iparam.pkid ? iparam.pkid : -1
            , "eoNo": iparam.eoNo ? iparam.eoNo : -1
        },

        columns: {
            param: {FunctionCode: iparam.functionCode},
            alter: nalter
        },
        onLoadSuccess: function () {
            InitSuspend('a.attach', {
                'onmouseover': function (thiz, event, callback) {
                    var index = $(thiz).attr("rowindex");
                    var row = $("#dg").datagrid('getRows')[index];
                    InitFuncCodeRequest_({
                        data: {
                            SOURCE_ID: row.PKID,
                            CATEGORY: "dmDataRecExter",
                            FunctionCode: 'ATTACHMENT_RSPL_GET'
                        },
                        successCallBack: function (jdata) {
                            if (jdata.code === RESULT_CODE.SUCCESS_CODE) {

                            }
                            var html = "";
                            for (var i = 0; i < jdata.data.length; i++) {
                                html += '<li><a target="_blank" onclick="downFileLocal(' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a><span onclick="deleteFile(\'' + jdata.data[i].PKID + '\');return false;" class="icon-cross"></span></li>';
                            }
                            callback(html);
                        }
                    });
                }
            });
        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "编辑", auth: "",
                enable: false,

                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    flag = "E";
                    openDetai('edit', rowData.PKID);
                }
            },
            {
                id: "m-delete", i18nText: "删除", auth: "",
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
                        data: {pkid: rowData.PKID, FunctionCode: iparam.delFunctionCode},
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
            },
            {
                id: "m-delete", i18nText: "维护适用性", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
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
                            appList: iparam.appList,
                            appFunctionCode: iparam.appFunctionCode
                        },
                        url: "../applic/EmEoAppAdd.shtml"
                    });
                }
            }
        ],
        validAuth: function (row, items) {
            //  items['编辑'].enable = false;
            // items['编辑'].display=false;
            /*if (row.STATUS != "EDIT") {
                items['编辑'].enable = false;
                items['提交'].enable = false;
            }*/
            if (!iparam.edit || operation == 'view') {
                items['编辑'].display = false;
            }
            //if (!iparam.appFunctionCode || operation == 'view') {
                items['维护适用性'].display = false;
            //}
            //评估单产生的EO不能删除来源文件
            if(iparam.ifEvaProduce == 'Y' && iparam.delFunctionCode == 'EM_EO_SOURCE_FILE_DEL' || operation == 'view'){
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

/*function InitDataForm(pkid) {
    mpkid = pkid;
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "DM_DATA_REC_EXTER_PK"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}*/


function initTableTitle() {
    let htmlstr = `
         <div style="float: left; padding: 0px; height: auto">
                <a> ${iparam.nameZh} </a>
            </div>
    `;
    $("#tableTitle").append(htmlstr);
    $(".menu-item").click(function () {
        let name = this.getAttribute("data-id");
        goToFunc(name)
    });

    if (iparam && iparam.dropIf && operation != 'view') {
        for (let l = 0; l < iparam.dropIf.length; l++) {

            let htmlstr2 = ` <td   align="right" width: 100px  >
                     ${iparam.dropIf[l].nameZh}
                     </td>
                     <td  style="width:50px;" >
                     <select id="${iparam.dropIf[l].nameEN}" data-options="panelHeight:'auto'"  class="easyui-combobox" name="${iparam.dropIf[l].nameEN}" style="width:50px;">    
                    <option value="N">否</option>  
                    <option value="Y">是</option> 
                </select>  
        </td>
    `;
            $("#tableTitle").after(htmlstr2);

            $("#" + iparam.dropIf[l].nameEN).combobox({
                onSelect: function (record) {

                    if (iparam.pkid == -1 || iparam.pkid == "") {
                        MsgAlert({content: '请保存EA基本信息', type: 'error'});
                        return;
                    }
                    if (iparam.addBidden) {
                        MsgAlert({content: iparam.addBiddenMsg, type: 'error'});
                        return;
                    }
                    if (record.value == "N") {
                        if (iparam.dropIf[l].delAllfunctionCode) {
                            if (confirm(iparam.dropIf[l].msg)) {
                                InitFuncCodeRequest_({
                                    data: {FunctionCode: iparam.dropIf[l].delAllfunctionCode, eoPkid: iparam.pkid},
                                    successCallBack: function (jdata) {
                                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                            MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                            reload_();
                                        }
                                    }
                                });
                                InitSaveForm_();
                            } else {
                                $("#" + iparam.dropIf[l].nameEN).combobox("setValue", "Y");
                            }
                        }
                    } else {
                        InitSaveForm_();
                    }

                    $("#" + iparam.dropIf[l].nameEN).focus();

                }
            });
            //$('#'+iparam.dropIf[l].nameEN).combobox('select','oneValue'); 赋值 selArray
            if (!iparam.dropIf[l].selArray) {
                selArray.push(iparam.dropIf[l].nameEN);
            }

        }
    }

}

function delAll() {
    if (confirm(iparam.dropIf[0].msg)) {
        InitFuncCodeRequest_({
            data: {FunctionCode: iparam.dropIf[0].delAllfunctionCode, eoPkid: iparam.pkid},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    reload_();
                }
            }
        });
        InitSaveForm_();
    } else {
        $("#" + iparam.dropIf[0].nameEN).combobox("setValue", "Y");
        return false;
    }
}

//父级调用
function switchApplyType(ifDelAll) {
    if (!iparam.delAll) {
        return;
    }
    if (iparam.delAll == "ALL") {
        if (!ifDelAll) {
            return;
        }
        InitFuncCodeRequest_({
            data: {FunctionCode: iparam.delAllfunctionCode, eoPkid: iparam.pkid},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    reload_();
                }
            }
        });
    } else {
        if (iparam.delAll == iparam.applyType) {
            return;
        }
        if (iparam.dropIf) {
            for (let i = 0; i < iparam.dropIf.length; i++) {
                $("#" + iparam.dropIf[i].nameEN).combobox("setValue", "N");
            }
        }
        InitFuncCodeRequest_({
            data: {FunctionCode: iparam.delAllfunctionCode, eoPkid: iparam.pkid},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    reload_();
                }
            }
        });
        InitSaveForm_();
    }


}

//打开资料类型详细页面
function openDetai(operation, pkid) {
    if (iparam.pkid == -1 || iparam.pkid == "") {
        MsgAlert({content: '请先保存EA基本信息', type: 'error'});
        return;
    }
    if (iparam.addBidden) {
        MsgAlert({content: iparam.addBiddenMsg, type: 'error'});
        return;
    }
    if (iparam && iparam.dropIf) {
        for (let l = 0; l < iparam.dropIf.length; l++) {
            if (iparam.dropIf[l].addBidden) {   // 选中才能添加
                let is = $('#' + iparam.dropIf[l].nameEN).combobox("getValue");
                if ('Y' != is) {
                    MsgAlert({content: "请选中" + iparam.dropIf[l].nameZh, type: 'error'});
                    return;
                }
            }

        }
    }
    var title_ = $.i18n.t(iparam.nameZh);
    ShowWindowIframe({
        width: "800",
        height: "400",
        title: title_,
        param: {
            operation: operation,
            applyModel: iparam.applyModel,
            eoNo: iparam.eoNo,
            pkid: pkid,
            eoPkid: iparam.pkid,
            applyType: iparam.applyType
        },
        url: iparam.addUrl
    });
}

/*//首检值
function add() {
    $('#dg').datagrid('appendRow', {});
}*/

/** 刷新列表数据 */
function reload_() {
    var dgopt = getDgOpts('dg');
    var $dg = $(dgopt.owner);
    let queryParams = $.extend({}, dgopt.queryParams, dgopt._params,
        {
            "eoPkid": iparam.pkid ? iparam.pkid : -1,
            "eoNo": iparam.eoNo ? iparam.eoNo : -1
        });
    if (typeof(breforSearch) == 'function') {
        breforSearch(queryParams);
    }
    if (dgopt.treeField) {
        $dg.treegrid('load', queryParams);
    } else {
        $dg.datagrid('load', queryParams);
    }

    $("#dg").datagrid("reload");
}

//明细编辑行索引
var detailEditIndex = undefined;

//明细结束编辑
function detailEndEdit() {
    if (detailEditIndex == undefined) {
        return true
    }
    if ($('#dg').datagrid('validateRow', detailEditIndex)) {
        $('#dg').datagrid('endEdit', detailEditIndex);
        detailEditIndex = undefined;
        return true;
    } else {
        return false;
    }
}

function setSubData(data) {

    ParseFormField_(data, $("#mform"), Constant.CAMEL_CASE);
}

/**
 * 初始化数据
 * @param pkid
 * @constructor
 */
function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "EM_EO_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                $(":radio").each(function () {
                    let radioName = $(this).attr('name').toUpperCase();
                    let num = jdata.data[radioName];
                    $("input[name=" + $(this).attr('name') + "]:eq(" + num + ")").attr("checked", 'checked');
                });
                $(":checkbox").each(function () {
                    let radioName = $(this).attr('name').toUpperCase();
                    let num = jdata.data[radioName];
                    $(this).prop("checked", num == 1 ? true : false);
                });
                iparam["eoNo"] = jdata.data.EO_NO
                //设置子页面数据
                //  setSubData(jdata.data)
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//明细点击行
function detailClickRow(index) {
    if (detailEditIndex != index) {
        if (detailEndEdit()) {
            $('#dg').datagrid('selectRow', index);
            $('#dg').datagrid('beginEdit', index);
            detailEditIndex = index;
        } else {
            $('#dg').datagrid('selectRow', detailEditIndex);
        }
    }
}


function InitSaveForm_() {
    var $form = $("#mform");

    var data = $form.serializeObject();
    data = $.extend(data, {"pkid": iparam.pkid}, {FunctionCode: "EM_EO_ADD"});
    InitFuncCodeRequest_({
        data: data,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    return false;
}