var param;
var iparam;
var operation;
var operationAdd;
var PAGE_DATA = {};
var nalter = {};
var selArray = [];
var sxFileCount = 0;
var sxFilePkid = [];
var dataGridCount = 0;
var eojcCount = 0;
var eoNoCount = 0;

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

    eoCounut();
    if ("view" == operation) {
        $(".btn.btn-primary").attr("disabled", true);
        $('#wwe').attr('disabled', 'disabled');
        $('#sfe').attr('disabled', 'disabled');
        $('#writeWarning').combobox({onlyview: true});
        $('#leadTime').combobox({onlyview: true});
    }
    if(eoNoCount > 1 && (iparam.applyType == 'PART' || iparam.applyType == 'ENG')){
        $('#wwe').attr('disabled', 'disabled');
        $('#sfe').attr('disabled', 'disabled');
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
    //显示eo送修附件
    /*if(iparam.pkid){
        selectFile('EOSXFILE');
    }*/
    //部件和发动机无关联NSJC
    if(iparam.applyType == 'ENG' || iparam.applyType == 'APL'){
        $('#addNrc').hide();
        if(iparam.applyType == 'APL'){
            $('#dg2T').hide();
            $('#dg2').hide();
        }
    }
    if(iparam.applyType == 'PART'){
        $('#addNrc').show();
    }

    InitFuncCodeRequest_({
        async: false,
        data: {
            domainCode: Array.from(domainCode).join(',') +',YESORNO,EOJC_LEAD_TIME',
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (iparam.alter) {
                for (let i = 0; i < iparam.alter.length; i++) {
                    PAGE_DATA[iparam.alter[i].field] = DomainCodeToMap_(jdata.data [iparam.alter[i].pageData]);
                }
            }
            $('#writeWarning').combobox({
                panelHeight: '120px',
                data: jdata.data.YESORNO,
                valueField: 'VALUE',
                textField: 'TEXT',
                onSelect: function (item) {
                    if(item.VALUE == 'N'){
                        $('#leadTime').combobox({onlyview: true});
                        saveBxjy();
                    }else if(item.VALUE = 'Y'){
                        $('#leadTime').combobox({onlyview: false});
                    }
                }
            });

            $('#leadTime').combobox({
                panelHeight: '120px',
                data: jdata.data.EOJC_LEAD_TIME,
                valueField: 'VALUE',
                textField: 'TEXT',
                onSelect: function (item) {
                    var writeWarning = $('#writeWarning').combobox('getValue');
                    if(!writeWarning){
                        MsgAlert({content:'请先选择编写预警', type: 'error'});
                        $(this).combobox('setValue', '');

                    }else{
                        saveBxjy();
                    }
                }
            });

            findEoJcCard();
            if(eojcCount == 0){
                $('.bxyjTd').hide();
            }else{
                $('.bxyjTd').show();
            }

            if (iparam.pkid && iparam.pkid != -1) {
                $("#dataType").combobox({onlyview: true, editable: false});
                InitDataForm(iparam.pkid);
            }
        }
    });
    if (iparam.pkid && iparam.pkid != -1) {
        InitDataGrid("dg", iparam.pkid);
        if(iparam.applyType != 'APL'){
            InitDataGrid2("dg2", iparam.pkid);
        }
    } else {
        InitDataGrid("dg", -1);
        if(iparam.applyType != 'APL'){
            InitDataGrid2("dg2", -1);
        }
    }
    initTableTitle();
    bindSparkEvents();
}

var $pd = {};

//执行方式
function InitDataGrid(id, eoPkid) {
    let $dg= $("#dg");
   $dg.MyDataGrid({
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
            alter: nalter
        },
        onLoadSuccess: function (data) {
            dataGridCount = data.data.length;
            /*InitSuspend('a.attach', {
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
            });*/
        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "取消关联", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认取消关联该条记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {appendixPkid: rowData.PKID, jcNo: rowData.JC_NO, FunctionCode: 'EM_EO_JC_RELATE_DELETE'},
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
            /*{
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
            },*/
            /*{
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
                        data: {FunctionCode: 'EM_EO_JC_RELATE_DEL_COU', eoPkid: iparam.pkid},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                InitFuncCodeRequest_({
                                    data: {pkid: rowData.PKID, FunctionCode: iparam.delFunctionCode},
                                    successCallBack: function (jdata) {
                                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                            MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                            reload_1();
                                        } else {
                                            MsgAlert({content: jdata.msg, type: 'error'});
                                        }
                                    }
                                });
                            } else {
                                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                            }
                        }
                    });
                }
            }*/
        ],
        validAuth: function (row, items) {
            if (operation == 'view' ||$('#sfe').is(':checked')) {
                items['取消关联'].display = false;
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
function reloadRelateAppendix() {
    $("#dg").datagrid("reload");
}
//送修执行
function InitDataGrid2(id, eoPkid) {
    var dg2= $("#dg2");
    dg2.MyDataGrid({
        sortable: true,
        singleSelect: true,
        pagination: false,
        fit: false,
        resize: function () {
            return {width: '100%', height: 175};
        },
        queryParams: {eoPkid: iparam.pkid ? iparam.pkid : -1},

        columns: {
            param: {FunctionCode: "EM_EO_PN_REPAIR_REQ_LIST"},
            alter: {
                TEST_UPLOAD: {
                    formatter: function (value, row, index) {
                        if (row.TEST_UPLOAD) {
                            return '<a href="javascript:void(0);" rowindex="' + index + '" class="attach">' +
                                '<img src="/img/edit2.png" border="0" style="width:15px;height:15px;"/></a>'
                        }
                    }
                }

            }
        },
        onLoadSuccess: function () {
           // dataGridCount = data.data.length;
            InitSuspend('a.attach', {
                'onmouseover': function (thiz, event, callback) {
                    var index = $(thiz).attr("rowindex");
                    var row = $("#dg2").datagrid('getRows')[index];
                    InitFuncCodeRequest_({
                        data: {
                            SOURCE_ID: row.PKID,
                            CATEGORY: "emEoPnRepairReq",
                            FunctionCode: 'ATTACHMENT_RSPL_GET'
                        },
                        successCallBack: function (jdata) {
                            if (jdata.code === RESULT_CODE.SUCCESS_CODE) {

                            }
                            var html = "";
                            if('view' == operation){
                                for (var i = 0; i < jdata.data.length; i++) {
                                    html += '<li><a target="_blank" onclick="downFile(' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a></li>';
                                }
                            }else{
                                for (var i = 0; i < jdata.data.length; i++) {
                                    html += '<li><a target="_blank" onclick="downFile(' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a><span onclick="deleteFile(\'' + jdata.data[i].PKID + '\');return false;" class="icon-cross"></span></li>';
                                }
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
                    var rowData = getDG('dg2').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    flag = "E";
                    openDetaiR('edit', rowData.PKID);
                }
            },
            {
                id: "m-delete", i18nText: "删除", auth: "",
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
                        data: {pkid: rowData.PKID, FunctionCode: 'EM_EO_PN_REPAIR_REQ_DEL_PKID'},
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
                id: "m-upload", i18nText: "上传附件", auth: "",
                onclick: function () {
                    var rowData = getDG('dg2').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    common_uploadFile({
                        identity: 'dg2',
                        param: {
                            cat: "emEoPnRepairReq",
                            sourceId: rowData.PKID,
                            successCellBack: "",
                            fialCellBack: ""
                        }
                    });

                }
            }

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
            //detailClickRow(rowIndex)
        },
        onDblClickRow: function (index, field, value) {
            flag = "V";

        }
    });
}


function bindSparkEvents() {
    //机身类隐藏列表上所有操作
    if("APL" == iparam.applyType){
        $('#sfe').attr('checked',true);
        $('#sfe').attr('disabled',true);
        $('#wwe').attr('disabled',true);
    }
    $("input[name='exeMode']").click(function () {
        var mode = $("input[name='exeMode']:checked").attr("id");

        if (mode == "wwe") {
            //01374973 程建波 未保存EO 导致空指针报错
            if (iparam.pkid == -1 || iparam.pkid == "") {
                MsgAlert({content: '请先保存EO基本信息', type: 'error'});
                return;
            }
            $("#sxTr").show();
            if (!confirm("取消顺丰执行将删除执行方式，是否继续")) {
                return false;
            }
            deleteSfe(iparam.pkid);
        }

        if (mode == "sfe") {
            $("#repairRequirement").textbox('setValue', '');
            $('#repairRequirement').textbox({disabled: true});
            $("#sxTr").hide();
            if (!confirm("取消送修执行将删除送修要求及附件，是否继续")) {
                return false;
            }
            deleteWwe(iparam.pkid);
            //$("#repairRequirement").textbox('setValue', '');
            //$('#repairRequirement').textbox({disabled: true})
            $("#sxTr").hide();
        }
        // if (this.checked) {
        //     if ($(this).attr('id') == "wwe") {
        //         /*if(dataGridCount > 0){
        //             MsgAlert({content: '已存在工卡，不允许切换执行方式', type: 'error'});
        //             return false;
        //         }*/
        //         //$("#sfe").prop("checked", false);
        //         //$('#repairRequirement').textbox({disabled: false});
        //         $("#sxTr").show();
        //
        //        // $('.bxyjTd').hide();
        //     }
        //     if ($(this).attr('id') == "sfe") {
        //        /* if(!confirm("选择顺丰执行将删除送修要求及附件，是否继续")){
        //             return false;
        //         }*/
        //         //$("#wwe").prop("checked", false);
        //         $("#repairRequirement").textbox('setValue', '');
        //         $('#repairRequirement').textbox({disabled: true})
        //         $("#sxTr").hide();
        //
        //         //$('.bxyjTd').show();
        //     }
        // }else{
        //     if ($(this).attr('id') == "wwe") {
        //         if(!confirm("取消送修执行将删除送修要求及附件，是否继续")){
        //             return false;
        //         }
        //         deleteWwe(iparam.pkid);
        //         //$("#repairRequirement").textbox('setValue', '');
        //         //$('#repairRequirement').textbox({disabled: true})
        //         $("#sxTr").hide();
        //     }
        //     if ($(this).attr('id') == "sfe") {
        //         if(!confirm("取消顺丰执行将2223232332删除执行方式，是否继续")){
        //             return false;
        //         }
        //         deleteSfe(iparam.pkid);
        //     }
        // }

        //deleteFile(val);
        /*//删除附件
        if(sxFilePkid.length > 0){
            $.each(sxFilePkid, function(k,val){
                deleteFile(val);
            });
        }*/

        /*if ("APL" != iparam.applyType && !$("#sfe").is(':checked')) {
            InitFuncCodeRequest_({
                data: {FunctionCode: 'EM_EO_JC_RELATE_DEL_COU', eoPkid: iparam.pkid},
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        InitFuncCodeRequest_({
                            data: {FunctionCode: 'EM_EO_JC_RELATE_DELALL', eoPkid: iparam.pkid},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                    reload_1();
                                }
                            }
                        });
                    } else {
                        $("#wwe").prop("checked", false);
                        $("#sfe").prop("checked", true);
                        MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                    }
                }
            });
*/


        InitSaveForm_('add', '');

    });

    /*$("#repairRequirement").blur(function () {
        InitSaveForm_();
    })*/
}
function setSubData(data) {
    ParseFormField_(data, $("#mform"), Constant.CAMEL_CASE);

    $(":checkbox").each(function () {
        var radioName = $(this).attr('name').toUpperCase();
        var num = data[radioName];
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
                                            reload_1();
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
        data: {pkid: pkid, FunctionCode: "EM_EO_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                if(jdata.data.IF_REPAIR_REQ == "Y"){
                    $("#wwe").prop("checked", true);
                    $("#sxTr").show();
                }else{

                    $("#wwe").prop("checked", false);
                }
                if (jdata.data.EXE_MODE == "S") {
                    $("#sfe").prop("checked", true);
                }
                $(":radio").each(function () {
                    let radioName = $(this).attr('name').toUpperCase();
                    let num = jdata.data[radioName];
                    $("input[name=" + $(this).attr('name') + "]:eq(" + num + ")").attr("checked", 'checked');
                });
                // $(":checkbox").each(function () {
                //     let radioName = toLine($(this).attr('name')).toUpperCase();
                //     let num = jdata.data[radioName];
                //     if (radioName == "EXE_MODE") {
                //         if (num == "W") {
                //             //$("#wwe").prop("checked", true);
                //             $("#sxTr").show();
                //             //$('#repairRequirement').textbox({disabled: false});
                //         }
                //         if (num == "S") {
                //             $("#sfe").prop("checked", true);
                //         }
                //     }
                //
                // });
                //设置子页面数据
                //  setSubData(jdata.data)
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//打开添加工卡页面
function openDetai(operation, pkid) {
    if (iparam.pkid == -1 || iparam.pkid == "") {
        MsgAlert({content: '请先保存EO基本信息', type: 'error'});
        return;
    }
    if (iparam.addBidden) {
        MsgAlert({content: iparam.addBiddenMsg, type: 'error'});
        return;
    }

    if (! $('#sfe').is(':checked') && iparam.applyType != 'APL'){
        MsgAlert({content: '请选择顺丰执行', type: 'error'});
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
    let datas = {eoPkid: iparam.pkid, jcType: "EOJC", FunctionCode: 'EM_EO_JC_RELATE_CONUT'};
    InitFuncCodeRequest_({
        async: false,
        data: datas,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data.NUMB > 0) {
                    MsgAlert({content: "已存在EOJC，请不要重复添加", type: "error"});
                } else {
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
            } else {
                MsgAlert({content: jdata.msg, type: "error"});
            }
        }
    })

}

//打开添加送修页面
function openDetaiR(operation, pkid) {
    if (iparam.pkid == -1 || iparam.pkid == "") {
        MsgAlert({content: '请先保存EO基本信息', type: 'error'});
        return;
    }
    if (iparam.addBidden) {
        MsgAlert({content: iparam.addBiddenMsg, type: 'error'});
        return;
    }

    if (! $('#wwe').is(':checked') && iparam.applyType != 'APL'){
        MsgAlert({content: '请选择送修执行', type: 'error'});
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

    var title_ = "新增送修改";
    ShowWindowIframe({
        width: "800",
        height: "550",
        title: title_,
        param: {
            operation: operation,
            applyModel: iparam.applyModel,
            eoNo: iparam.eoNo,
            pkid: pkid,
            eoPkid: iparam.pkid,
            applyType: iparam.applyType
        },
        url: "/views/em/emeo/sub/EmEoPnrRepairEdit.shtml"
    });

}

function addNsjc() {
    if (iparam.pkid == -1 || iparam.pkid == "") {
        MsgAlert({content: '请先保存EO基本信息', type: 'error'});
        return;
    }

    /*if (! $('#sfe').is(':checked') && iparam.applyType != 'APL'){
        MsgAlert({content: '请选择顺丰执行', type: 'error'});
        return;
    }*/


    ShowWindowIframe({
        width: "800",
        height: "400",
        title: 'EO关联NRC工卡列表',
        param: {
            eoPkid: iparam.pkid,
        },
        url: iparam.addNrcUrl
    });
}

/** 刷新列表数据 */
function reload_1(eoPkid) {
    var dgopt = getDgOpts('dg');
    var $dg = $(dgopt.owner);
    if(eoPkid){
        iparam.pkid = eoPkid;
    }
    var queryParams = $.extend({}, dgopt.queryParams, dgopt._params, {"eoPkid": iparam.pkid ? iparam.pkid : -1});
    if (typeof(breforSearch) == 'function') {
        breforSearch(queryParams);
    }
    if (dgopt.treeField) {
        $dg.treegrid('load', queryParams);
    } else {
        $dg.datagrid('load', queryParams);
    }

    $("#dg").datagrid("reload");
    findEoJcCard();
    if(eojcCount == 0){
        $('.bxyjTd').hide();
    }else{
        $('.bxyjTd').show();
    }
    $("#dg2").datagrid("reload");
}

function reload_() {
    $("#dg2").datagrid("reload", {eoPkid: iparam.pkid});
}

function relaod_part(eoPkid) {
    reload_1(eoPkid);
    $('#sfe').attr('checked',false);
    $('#wwe').attr('checked',false);
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
    var radis = {};
    $(":radio").each(function () {
        var radioName = $(this).attr('name');
        radis[radioName] = $("input[name='" + radioName + "']:checked").val();
    });
    var exeMode = "N"; //顺丰执行
    var ifRepairReq = "N"; //送修改执行
    var mode = $("input[name='exeMode']:checked").attr("id");
    if (mode == "wwe") {
        ifRepairReq = "Y";
    }
    if (mode == "sfe") {
        exeMode = "S";
        radis.repairRequirement = "";
    }
    // $(":checkbox").each(function () {
    //     if ($(this).attr('id') == "wwe") {
    //         if ($(this).is(':checked')) {
    //             ifRepairReq = $(this).is(':checked') ? "Y" : "N";
    //         }
    //     }
    //     if ($(this).attr('id') == "sfe") {
    //         if ($(this).is(':checked')) {
    //             exeMode = $(this).is(':checked') ? "S" : "N";
    //             radis.repairRequirement = "";
    //         }
    //     }
    // });
    if (exeMode == "N") {
        /*$("#repairRequirement").textbox('setValue', '');
        $('#repairRequirement').textbox({disabled: true});*/
        radis.repairRequirement = "";
    }
    radis.exeMode = exeMode;
    radis.ifRepairReq = ifRepairReq;
    data = $.extend(data, radis, {"pkid": iparam.pkid}, {FunctionCode: "EM_EO_ADD"});
    InitFuncCodeRequest_({
        data: data,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
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

//驼峰转下划线
function toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}

//
//上传文件
function uploadSxFile() {
    if (iparam && iparam.pkid && iparam.pkid != -1) {
        if(sxFileCount > 0 ){
            MsgAlert({content: '已存在送修文件', type: 'error'});
            return false;
        }
        var eoPkid = iparam.pkid;
        //console.log(eoPkid);
        common_upload_({
            identity: 'dg',
            param: {
                cat: 'EOSXFILE',
                sourceId: eoPkid,
                PKID: eoPkid,
                successCallBack: function () {
                    selectFile('EOSXFILE');
                    MsgAlert({content: "上传成功"});
                },
                failCallBack: ""
            }
        });
    }else{
        MsgAlert({content: '请先保存数据', type: 'error'});
        return false;
    }
}

/*查询附件*/
function selectFile(id) {
    $("#" + id).html("");
    InitFuncCodeRequest_({
        data: {pkid: iparam.pkid, cat: id, FunctionCode: "SELECT_FILE_BY_CAT_AND_PKID"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                var html = "";
                sxFileCount = jdata.data.length;
                for (var i = 0; i < jdata.data.length; i++) {
                    html += '<a  href="###" onclick="downFile(' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a>&emsp;' + '<span  style="cursor:pointer;" onclick="deleteFile(\'' + jdata.data[i].PKID + '\')">删除</span>&emsp;';
                    sxFilePkid.push(jdata.data[i].PKID);
                }
                $("#" + id).append(html);
            }
        }
    });
}

/**
 * 删除附件
 * @param pkid
 */
/*function deleteFile(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: 'ATTACHMENT_RSPL_DEL'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                //selectFile('EOSXFILE');
            }
        }
    });
}*/

//查询EOJC工卡
function findEoJcCard() {
    InitFuncCodeRequest_({
        async: false,
        data: {eoPkid: iparam.pkid, jcType: 'EOJC', FunctionCode: 'EM_EOJC_BY_EOPKID'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                if(jdata.data){
                    eojcCount = 1;
                    $('#writeWarning').combobox('setValue', jdata.data.WRITE_WARNING);
                    if(!jdata.data.WRITE_WARNING){
                        $('#leadTime').combobox('setValue', '');
                    }
                    if(jdata.data.WRITE_WARNING && jdata.data.WRITE_WARNING == 'N'){
                        $('#leadTime').combobox({onlyview : true});
                    }
                    if(jdata.data.WRITE_WARNING && jdata.data.WRITE_WARNING == 'Y'){
                        $('#leadTime').combobox('setValue', jdata.data.LEAD_TIME);
                    }
                }else{
                    eojcCount = 0;
                }
            }
        }
    });
}

//保存编写预警
function saveBxjy(){
    var writeWarning = $('#writeWarning').combobox('getValue');
    var leadTime = $('#leadTime').combobox('getValue');
    InitFuncCodeRequest_({
        data: {eoPkid: iparam.pkid, writeWarning:writeWarning, leadTime:leadTime,
            FunctionCode: 'EM_EOJC_SAVE_BXYJ'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {

            }
        }
    });
}

function deleteWwe(eoPkid) {
    InitFuncCodeRequest_({
        async: false,
        data: {eoPkid: eoPkid, FunctionCode: 'EM_EO_PN_REPAIR_REQ_DEL_EOPKID'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                reload_();
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                //selectFile('EOSXFILE');
            }else{
                MsgAlert({content: '操作失败', type: 'error'});
            }
        }
    });
}

function deleteSfe(eoPkid) {
    InitFuncCodeRequest_({
        async: false,
        data: {eoPkid: eoPkid, FunctionCode: 'EM_EO_JC_RELATE_DEL_EOPKID'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                reload_1(eoPkid);
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            }else{
                MsgAlert({content: '操作失败', type: 'error'});
            }
        }
    });
}

//上传
function common_uploadFile(edopt) {
    var title_ = $.i18n.t('common:COMMON_OPERATION.UPLOAD');
    ShowWindowIframe({
        width: 575,
        height: 200,
        title: title_,
        param: $.extend({}, edopt.param),
        url: "/views/em/emeo/sub/eo_attachment_add.shtml"
    });
}


function eoCounut(){
    InitFuncCodeRequest_({
        async: false,
        data: {pkid: iparam.pkid, FunctionCode: 'EM_EO_NO_COUNT'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eoNoCount = jdata.data.EO_NO_COUNT;
            } else {
                MsgAlert({content: jdata.msg, type: "error"});
            }

        }
    });
}
