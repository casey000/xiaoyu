var param;
var iparam;
var operation;
var operationAdd;
var PAGE_DATA = {};
var nalter = {};
var selArray = [];
var eoNoCount;

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
    debugger
    param = getParentParam_();
    operation = iparam.operation;
    if ("view" == operation) {
        $(".btn.btn-primary").attr("disabled", true);
        $('#ifOpportunityCheckFlag').attr("disabled", true);
        $('#opportunityCheckFlag').attr("disabled", true);
        $('#spark').attr("disabled", true);
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
    InitFuncCodeRequest_({
        async:false,
        data: {
            domainCode: Array.from(domainCode).join(',')+',EM_EO_CHECK_MARK,EM_EO_CHECK_MARK_PART',
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (iparam.alter) {
                for (let i = 0; i < iparam.alter.length; i++) {
                    PAGE_DATA[iparam.alter[i].field] = DomainCodeToMap_(jdata.data [iparam.alter[i].pageData]);
                }
            }

            //机会检标识
            if(iparam.applyType == "PART"){
                debugger;
                $("#spark").prop("checked",false);
                $('#spark').attr('disabled', true);
                $('#opportunityCheckFlag').combobox({
                    panelHeight: '170px',
                    data: jdata.data.EM_EO_CHECK_MARK_PART,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (row) {
                        if (!confirm("选择机会检标识将清空时限数据，是否确认？")) {
                            $(this).combobox("setValue", "");
                            return;
                        }
                        checkFlag();
                    }
                });
            }else{
                $('#opportunityCheckFlag').combobox({
                    panelHeight: '170px',
                    data: jdata.data.EM_EO_CHECK_MARK,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (row) {
                        if (!confirm("选择机会检标识将清空时限数据，是否确认？")) {
                            $(this).combobox("setValue", "");
                            return;
                        }
                        checkFlag();
                    }
                });
            }


            debugger;

            if (iparam.pkid && iparam.pkid != -1) {
                eoCounut(iparam.pkid);
                if (eoNoCount > 1) {
                    $('#ifOpportunityCheckFlag').attr('disabled', true);
                    $('#opportunityCheckFlag').combobox({onlyview: true, editable: false});
                    $('#spark').attr("disabled", true);
                }
                debugger;

                InitDataForm(iparam.pkid);
            }
            debugger;

            //机会检
            var opportunityCheckFlag = $('#opportunityCheckFlag').combobox('getValue');
            if(operation == 'add'){
                $('#opportunityCheckFlag').combobox({onlyview:true, editable:false, required:false});
            }else{
                if(!eoNoCount || eoNoCount <= 1){
                    debugger;
                    if(opportunityCheckFlag){
                        $('#ifOpportunityCheckFlag').prop('checked', 'checked');
                        $('#opportunityCheckFlag').combobox({onlyview:false, editable:true, required:true, value:opportunityCheckFlag});
                    }else{
                        $('#opportunityCheckFlag').combobox({onlyview:true, editable:false, required:false});
                    }
                }

            }
        }
    });
    if (iparam.pkid && iparam.pkid != -1) {
        InitDataGrid("dg", iparam.pkid);
    } else {
        InitDataGrid("dg", -1);
    }
    initTableTitle();
    bindSparkEvents();
}

var $pd = {};

function InitDataGrid(id, eoPkid) {
    $pd[id] = $("#" + id);
    $pd[id].MyDataGrid({
        identity: id,
        sortable: true,
        singleSelect: true,
        pagination: false,
        fit: false,
        resize: function () {
            return {width: '100%', height: 175};
        },
        queryParams: {"eoPkid": iparam.pkid ? iparam.pkid : -1},

        columns: {
            param: {FunctionCode: iparam.functionCode},
            alter: {
                FC_INFO: {
                    formatter: function (value) {
                        if (value === undefined) return "";
                        let info = value.replace(/\(\sY/g, "(是");
                        info = info.replace(/\(\sN/g, "(否");
                        info = info.replace(/Deadline\s:\sor/g, "or");
                        info = info.replace(/\(\s+\+/g, "(");
                        info = info.replace(/\+\s+or\s+\+ /g, "or");
                        info = info.replace(/XDWZ/g, "先到为准");
                        info = info.replace(/HDWZ/g, "后到为准");
                        info = info.replace(/YJJ/g, "引进检");
                        info = info.replace(/YJRQ/g, "引进日期");
                        return info;
                    }
                },
                RC_INFO: {
                    formatter: function (value) {
                        if (value === undefined) return "";
                        let info = value.replace(/\(\sY/g, "(是");
                        info = info.replace(/\(\sN/g, "(否");
                        info = info.replace(/XDWZ/g, "先到为准");
                        info = info.replace(/HDWZ/g, "后到为准");
                        return info;
                    }
                },
                INITIAL_LEAD: {
                    formatter: function (value) {
                        if(value){
                            return value+"%";
                        }else{
                            return '';
                        }
                    }
                }
            }
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
        validAuth: function (row, items) {
            if (operation == 'view') {
                items['编辑'].display = false;
                items['上传附件'].display = false;
                items['删除'].display = false;
                items['维护适用性'].display = false;
            }
            return items;
        },

        onLoadSuccess: function (data) {

            if (iparam.applyType == "APL") {
                $('#' + id).datagrid('showColumn', 'ACNOS');
                $('#' + id).datagrid('hideColumn', 'PARTS');
            } else {
                $('#' + id).datagrid('showColumn', 'PARTS');
                $('#' + id).datagrid('hideColumn', 'ACNOS');
            }

        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "编辑", auth: "",
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
            }
        ],


        onClickRow: function (rowIndex, rowData) {
            detailClickRow(rowIndex)
        },
        onDblClickRow: function (index, field, value) {
            var rowData = getDG('dg').datagrid('getSelected');
            if (!rowData.PKID) {
                MsgAlert({content: "请选择数据！", type: 'error'});
                return;
            }
            flag = "V";
            openDetai('view', rowData.PKID);
        }
    });
}


function bindSparkEvents() {
    $("input[name='spark']").click(function () {
        if (this.checked) {
            //var opportunityCheckFlag = parent.window.$("#opportunityCheckFlag").combobox("getValue");
            var opportunityCheckFlag = $("#opportunityCheckFlag").combobox("getValue");
            if ("" != opportunityCheckFlag) {
                MsgAlert({content: "机会检标识不为空，不可选择触发类", type: 'error'});
                $(this).prop("checked", false);
                return;
            }
            if (confirm(iparam.checkboxs[0].msg)) {
                InitFuncCodeRequest_({
                    data: {FunctionCode: iparam.checkboxs[0].delAllfunctionCode, eoPkid: iparam.pkid},
                    successCallBack: function (jdata) {
                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                            MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                            reload_();
                        }
                    }
                });
                InitSaveForm_();
            } else {
                $(this).prop("checked", false);
            }

        } else {
            InitSaveForm_();
        }

    })
}

function setSubData(data) {
    ParseFormField_(data, $("#mform"), Constant.CAMEL_CASE);

    $(":checkbox").each(function () {
        let radioName = $(this).attr('name').toUpperCase();
        let num = data[radioName];
        $(this).prop("checked", num == "Y" ? true : false);
    });
}

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

    if (iparam && iparam.dropIf) {
        for (let l = 0; l < iparam.dropIf.length; l++) {

            let htmlstr2 = ` <td     >
                     ${iparam.dropIf[l].nameZh}
                     </td>
                     <td  >
                     <select id="${iparam.dropIf[l].nameEN}" class="easyui-combobox" name="${iparam.dropIf[l].nameEN}" style="width:200px;">    
                    <option value="N">否</option>  
                    <option value="Y">是</option> 
                </select>  
        </td>
    `;
            $("#tableTitle").after(htmlstr2);

            $("#" + iparam.dropIf[l].nameEN).combobox({
                onSelect: function (record) {
                    if (record.value == "N") {
                        if (iparam.dropIf[l].delAllfunctionCode) {
                            if (confirm(iparam.dropIf[l].msg)) {
                                InitFuncCodeRequest_({
                                    data: {FunctionCode: iparam.dropIf[l].delAllfunctionCode, pkid: param.eoPkid},
                                    successCallBack: function (jdata) {
                                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                            MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                            reload_();
                                        }
                                    }
                                });
                            }
                        }
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

/**
 * 初始化数据
 * @param pkid
 * @constructor
 */
function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        async: false,
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
                    $(this).prop("checked", num == "Y" ? true : false);
                });
                //部件类EO 触发类设置灰色 01374973  程建波 2021-03-11
                if(iparam.applyType == "PART") {
                    $("#spark").prop("checked", false);
                    $('#spark').attr('disabled', true);
                }
                //是否机会检
                var opportunityCheckFlag = $('#opportunityCheckFlag').combobox('getValue');
                if(opportunityCheckFlag){
                    $('#ifOpportunityCheckFlag').prop('checked', true);
                }else{
                    $('#opportunityCheckFlag').combobox({editable: false, onlyview:true});
                }
                //改版  禁用 是否触发类和机会检
                // if (eoNoCount > 1) {
                //     $("#spark").attr("disabled", "disabled");
                //     $('#ifOpportunityCheckFlag').attr("disabled", "disabled");
                //     $('#opportunityCheckFlag').combobox({editable: false, onlyview:true});
                // }
                //设置子页面数据
                //  setSubData(jdata.data)
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//打开资料类型详细页面
function openDetai(operation, pkid) {
    if (iparam.pkid == -1 || iparam.pkid == "") {
        MsgAlert({content: '请先保存EO基本信息', type: 'error'});
        return;
    }
    if (iparam.addBidden) {
        MsgAlert({content: iparam.addBiddenMsg, type: 'error'});
        return;
    }
    if ($("#spark").is(':checked')) {
        MsgAlert({content: "触发类不可添加时限", type: 'error'});
        return;
    }
    var opportunityCheckFlag = "";
    InitFuncCodeRequest_({
        data: {pkid: iparam.pkid, FunctionCode: 'EM_EO_GET_OPP_FLAG'},
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data != null) {
                    opportunityCheckFlag = jdata.data.FLAG;
                }
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
    if ("" != opportunityCheckFlag) {
        MsgAlert({content: "机会检标识不为空，不可添加时限", type: 'error'});
        return;
    }

    var title_ = $.i18n.t('EO详细页');
    ShowWindowIframe({
        width: "800",
        height: "400",
        title: title_,
        param: {operation: operation, pkid: pkid, eoPkid: iparam.pkid,
            applyType: iparam.applyType, applyModel: iparam.applyModel, jobCategory : iparam.jobCategory},
        url: iparam.addUrl
    });
}


/** 刷新列表数据 */
function reload_() {
    var dgopt = getDgOpts('dg');
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

    $("#dg").datagrid("reload");
}

//部件类EO刷新
function relaod_part() {
    reload_();
    $('#spark').attr('checked',false);
    //触发类置灰色
    $('#spark').attr('disabled',true);
    $('#ifOpportunityCheckFlag').attr('checked',false);
    $('#opportunityCheckFlag').combobox({onlyview:true,editable:false,required:false, value:''});
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
        data: data,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                param.OWindow.reload_();
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.SUCCESS_CODE')});
                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    return false;
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

//是否机会检事件
function ifOpportunityCheck(obj){
    var is = $(obj).is(':checked');
    if(is){
        $('#opportunityCheckFlag').combobox({onlyview:false,editable:true,required:true});
    }else{
        $('#opportunityCheckFlag').combobox({onlyview:true,editable:false,required:false, value:''});
        InitFuncCodeRequest_({
            data: {eoPkid: iparam.pkid, FunctionCode: 'EM_EO_CLAER_OPPORTUNITY_CHECK'},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                } else {
                }

            }
        });
    }
}

//设置机会检清除时限数据
function checkFlag() {
    InitFuncCodeRequest_({
        data: {eoPkid: iparam.pkid, FunctionCode: 'EM_EO_TLIMIT_GROUP_DELALL'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //var opportunityCheckFlag = $("#opportunityCheckFlag").combobox("getValue");
                $("#spark").prop("checked", false);
                InitSaveForm_();
                reload_();
            } else {
                MsgAlert({content: jdata.msg, type: "error"});
            }

        }
    });

}

function eoCounut(pkid){
    InitFuncCodeRequest_({
        async: false,
        data: {pkid: pkid, FunctionCode: 'EM_EO_NO_COUNT'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eoNoCount = jdata.data.EO_NO_COUNT;
            } else {
                MsgAlert({content: jdata.msg, type: "error"});
            }

        }
    });
}

//下拉框校验
$.extend($.fn.validatebox.defaults.rules, {
    comboBoxEditvalid: { //校验下拉菜单
        validator: function (value, param) {
            var $combobox = $("#" + param[0]);
            if (value) {
                /*if ($combobox.combobox('getValue') == $combobox.combobox('getText'))
                    return false;*/
                var result = true;
                var allData = $combobox.combobox('getData');
                for(var i = 0; i< allData.length; i++){
                    if(value == allData[i].TEXT){
                        result = false;
                        break;
                    }
                }
                if(result){
                    return false;
                }else{
                    return true;
                }

            }
            return false;

        },
        message: '请选择下拉框选项，不要直接使用输入内容'
    }
});