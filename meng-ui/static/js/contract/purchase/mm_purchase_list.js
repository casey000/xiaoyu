var planjson = {}; //从航材创建合同


var mmPlanLevel = {};
var partTyPe = {};
//全局变量 判断是否编辑
var isedit_;
var selectHeTongByHandMark;
//全局变量 评估需求数据
//    var evaluate;

//全局变量 Tab2按钮功能绑定的开关
var functionSwitch_;

var functionSwitch_edit = true;

//全局变量 Tab2 datagrid 的请求参数
var paramOrderNo;

//全局变量 临时的订单号
var tempOrderNo;

//全局变量 禁止浏览编辑，增加参考时触发tabs的onselect方法。
var tab2Switch_ = true;

var planNo;
var requireNo;
var evaluateNo;


function cs() {

    planParam = parent.getTabParam('752');

    if (planParam) {
        /* runAndLoadTab2Byparam_(planParam.reJson,"HCXQ");*/
        entranceOfTab2('isaddByExample', "HCJH");
        paramOrderNo = planParam.reJson.orderNo;
        tempOrderNo = paramOrderNo;
    }
}

//Tab1的内容
function i18nCallBack() {
    checkBox();
    //初始化数据字典
    cs();
    InitResources();


}

//通用方法
function InitEditFormForbid_() {

    $("#tab2 *[textboxname]").each(function (k, it) {

        if ($(it).hasClass("combobox-f")) {
            $(it).combobox({editable: false, onlyview: true});
        } else if ($(it).hasClass("textbox-f")) {
            $(it).textbox({editable: false, onlyview: true});
        }
        else if ($(it).hasClass("datebox-f")) {
            $(it).datetimebox({editable: false, onlyview: true});
        }
        else if ($(it).hasClass("textbox-f")) {
            $(it).datetimebox({editable: false, onlyview: true});
        }
    });

    $('#holdTempTab2').attr("disabled", true);
    $('#AddAll').attr("disabled", true);
    $('#addBySelelct').attr("disabled", true);
    $('#addByHand').attr("disabled", true);
    $('#bottomSubmit').attr("disabled", true);
    $('#bottomSubmit1').attr("disabled", true);
}

function InitEditForm_() {
    $("#tab2 *[textboxname]").each(function (k, it) {
        if ($(it).hasClass("combobox-f")) {
            $(it).combobox({editable: true, onlyview: false});
        } else if ($(it).hasClass("textbox-f")) {
            $(it).textbox({editable: true, onlyview: false});
        }
        else if ($(it).hasClass("datebox-f")) {
            $(it).datetimebox({editable: true, onlyview: false});
        }
        else if ($(it).hasClass("textbox-f")) {
            $(it).datetimebox({editable: true, onlyview: false});
        }
    });

    $('#holdTempTab2').attr("disabled", false);
    $('#AddAll').attr("disabled", false);
    $('#addBySelelct').attr("disabled", false);
    $('#addByHand').attr("disabled", false);
    $('#bottomSubmit').attr("disabled", false);
    $('#bottomSubmit1').attr("disabled", false);

}

function returnReload(data) {
    $("#vendorCode").textbox({value: data.vendor.vendorCode});
    $("#vendorName").textbox({value: data.vendor.vendorName});
    $("#vendorAddress").textbox({value: data.vendor.vendorAddress});
    $("#vendorZip").textbox({value: data.vendor.vendorZip});
    $("#vendorPhone").textbox({value: data.vendor.vendorTel});
    $("#vendorFax").textbox({value: data.vendor.vendorFax});
    $("#vendorEmail").textbox({value: data.vendor.vendorEmail});
    $("#vendorWebsite").textbox({value: data.vendor.vendorWebsite});
}

// 编辑 跳转到 Tab2
function eidt_() {

    var data = $('#dg').datagrid("getSelected");
    if (!data) {
        MsgAlert({content: '请选中一行进行操作', type: 'error'});
        return;
    }
    tab2Switch_ = false;
    $('#tt').tabs('select', '采购合同创建/编辑');

    paramOrderNo = data.ORDER_NO;
    InitFuncCodeRequest_({
        data: {
            orderNo: data.ORDER_NO,
            orderType: "('HCCG','HHPCG','JSCG','JBCG','GJCG','PLJBCG','PLJHCG','KLCG','RBCG','QTCG')",
            FunctionCode: "MM_ORDERINFO_GET"
        },
        successCallBack: function (jdata) {

            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), null);
                laodTab2(paramOrderNo);
                isedit_ = true;
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    })

}

//点击更多打开查询合同页面，参数是个表示，为了后续处理打开后是编辑还是浏览
function openOrderMore(mark) {
//        $.messager.confirm("提示操作", "是否放弃当前页面的数据", function (data) {
//            if (data) {
    ShowWindowIframe({
        width: 600,
        height: 500,
        param: {mark: mark},
        title: '更多',
        url: '/views/mm/contract/purchase/mm_purchase_more.shtml'
    });
//            }
//        });
}

//非右键打开
function openEdit() {
    var rowdata = getDG('dg').datagrid('getSelected');
    if (rowdata.STATUS != 'BXZ') {
        MsgAlert({content: '非编写中，不允许编辑', type: 'error'});
        return false;
    } else {
        entranceOfTab2('isEidt');
    }
}

//Tab2入口函数
function entranceOfTab2(switch_, mark) {
    $("#AddAll").unbind().bind('click', function () {
        AddAll_();
    });
    $("#holdTempTab2").unbind().bind('click', function () {
        holdTempTab2_();
    });
    $("#orderNo1").textbox({editable: false, onlyview: true});
    if (switch_ == 'isEidt') {
        functionSwitch_ = true;
        functionSwitch_edit = true;
        eidt_();
        $("#orderMore").unbind('click').bind('click', function () {
            selectHeTongByHandMark = true;
            openOrderMore(selectHeTongByHandMark);
        });
        InitDataGridR();
    } else if (switch_ == 'isBrowse') {
        functionSwitch_edit = false;
        functionSwitch_ = true;
        eidt_();
        InitEditFormForbid_();
        InitDataGridR();
        $("#orderMore").unbind('click').bind('click', function () {
            selectHeTongByHandMark = false;
            openOrderMore(selectHeTongByHandMark);
        });
    } else if (switch_ == 'isadd') {

        $("#orderDate").datebox({value: formatDate(new Date())});
        $("#orderMan").textbox({value: getLoginInfo().userName});
        functionSwitch_ = true;
        ParseFormField_(null, $("#mform"), null);
        isedit_ = false;
        $("#orderMore").unbind('click').bind('click', function () {
            selectHeTongByHandMark = false;
            openOrderMore(selectHeTongByHandMark);
        });
    }
    else if (switch_ == 'isaddByHand') {
        $("#orderDate").datebox({value: formatDate(new Date())});
        $("#orderMan").textbox({value: getLoginInfo().userName});
        functionSwitch_ = true;
        ParseFormField_(null, $("#mform"), null);
        isedit_ = false;
        tab2Switch_ = false;
        $('#tt').tabs('select', '采购合同创建/编辑');
        $("#orderSource").combobox("setValue", 'SGLR');
        $("#orderMore").unbind('click').bind('click', function () {
            selectHeTongByHandMark = false;
            openOrderMore(selectHeTongByHandMark);
        });

    } else if (switch_ == 'isaddByExample') {
        $("#orderDate").datebox({value: formatDate(new Date())});
        $("#orderMan").textbox({value: getLoginInfo().userName});
        functionSwitch_ = true;
//            $('#tt').tabs('disableTab', 0);
        isedit_ = false;
        tab2Switch_ = false;
        $('#tt').tabs('select', '采购合同创建/编辑');
        if (mark == 'HCXQ') {
            $("#orderSource").combobox("setValue", 'HCXQ');
        } else if (mark == 'HCJH') {
            $("#orderSource").combobox("setValue", 'HCJH');
        } else {
            $("#orderSource").combobox("setValue", 'HCBJ');
        }
        $("#orderMore").unbind('click').bind('click', function () {
            selectHeTongByHandMark = false;
            openOrderMore(selectHeTongByHandMark);
        });

    }
}

//复选框单选
function checkBox() {
    $(':checkbox[item=aa]').each(function () {
        $(this).click(function () {
            if ($(this).is(':checked')) {
                $(':checkbox[item=aa]').prop('checked', false);
                $(this).prop('checked', true);
            }
        });
    });
    $(':checkbox[item=bb]').each(function () {
        $(this).click(function () {
            if ($(this).is(':checked')) {
                $(':checkbox[item=bb]').prop('checked', false);
                $(this).prop('checked', true);
            }
        });
    });
}

var orderType = {};
var userName = {};
var status = {};
var PAGE_DATA = {};
var SOURCE = {};

function InitResources() {


    $("#partNo").MyComboGrid({
        idField: 'TEXT',  //实际选择值
        textField: 'TEXT', //文本显示值
        width: 90,
        params: {FunctionCode: 'MM_PN_ID'},
        columns: [[
            {field: 'TEXT', title: '物料号', width: 60, sortable: true}
        ]],
        onSelect: function (row, data) {
            console.log(data);
            InitFuncCodeRequest_({
                data: {partNo: data.TEXT, FunctionCode: "MM_MINSGELFLIFE_GET"},
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        $("#minShelfLife").textbox({value: jdata.data.minShelfLife});
                        $("#minShelfLifeUnit").textbox({value: jdata.data.minShelfLifeUnit})
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            })
        }
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "MM_PUCHASRR_ORDER_TYPE,MM_ORDER_STATUS,USER_NAME,MM_MIN_SHELF_LIFE_UNIT,MM_PART_CONDITION,MM_DIC_BASE_UNIT,MM_PURCHASE_TYPE,MM_REQUIRE_LEVEL_XLPG,MM_DEAL_MODE,MM_CURRENCY,MM_PAYMENT_MODE,MM_ORDER_SOURCE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('#orderTypeB').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_PUCHASRR_ORDER_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#orderType').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_PUCHASRR_ORDER_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (row) {
                        if (row.VALUE) {
                            if ("QTCG" == row.VALUE) {
                                $("#orderNo1").textbox({editable: true, onlyview: false, required: true});
                            } else {
                                $("#orderNo1").textbox({editable: false, onlyview: true, required: false});
                            }
                        }
                    }
                });

                SOURCE['source'] = DomainCodeToMap_(jdata.data["MM_ORDER_SOURCE"]);
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["MM_ORDER_STATUS"]);
                //初始化TAb1
                InitDataGrid();
                //初始化tab2
                InitDataGridR();

                $("#orderDate").datebox({value: formatDate(new Date())});
                $("#orderMan").textbox({value: getLoginInfo().userName});


                userName = DomainCodeToMap_(jdata.data['USER_NAME']);
                orderType = DomainCodeToMap_(jdata.data['MM_PUCHASRR_ORDER_TYPE']);
                $("#vendorCode").MyComboGrid({
                    idField: 'VENDOR_CODE',  //实际选择值
                    textField: 'VENDOR_CODE', //文本显示值
                    width: 180,
                    onSelect: function (index, row) {
                        $("#vendorName").textbox({value: row.VENDOR_NAME});
                        $("#vendorAddress").textbox({value: row.VENDOR_ADDRESS});
                        $("#vendorZip").textbox({value: row.VENDOR_ZIP});
                        $("#vendorPhone").textbox({value: row.VENDOR_TEL});
                        $("#vendorFax").textbox({value: row.VENDOR_FAX});
                        $("#vendorEmail").textbox({value: row.VENDOR_EMAIL});
                        $("#vendorWebsite").textbox({value: row.VENDOR_WEBSITE});
                    },
                    params: {FunctionCode: 'MM_VENDER_PURCHASE_HELP'},
                    columns: [[
                        {field: 'VENDOR_CODE', title: '厂商代码', width: 80, sortable: true},
                        {field: 'VENDOR_SHORTNAME', title: '厂商简称', width: 120, sortable: true}
                    ]]
                });
                $("#vendorCode1").MyComboGrid({
                    idField: 'VENDOR_CODE',  //实际选择值
                    textField: 'VENDOR_CODE', //文本显示值
                    width: 100,
                    params: {FunctionCode: 'MM_VENDER_PURCHASE_HELP'},
                    columns: [[
                        {field: 'VENDOR_CODE', title: '厂商代码', width: 80, sortable: true},
                        {field: 'VENDOR_SHORTNAME', title: '厂商简称', width: 120, sortable: true}
                    ]]
                });
                $('#urgentLevel').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_REQUIRE_LEVEL_XLPG,
                    valueField: 'VALUE',
                    textField: 'TEXT'
//                        onSelect: function(){
//                            onSearch_();
//                        }
                });
                $('#partCondition').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_PART_CONDITION,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#orderUnit').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_DIC_BASE_UNIT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#dealMode').combobox({
                    panelHeight: 'auto',
                    data: jdata.data.MM_DEAL_MODE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
//                        onSelect: function(){
//                            onSearch_();
//                        }
                });


                $('#paymentMode').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_PAYMENT_MODE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
//                        onSelect: function(){
//                            onSearch_();
//                        }
                });
                $('#tradeCurrency').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_CURRENCY,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#minShelfLifeUnit').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_MIN_SHELF_LIFE_UNIT,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    panelHeight: '80px'
                });

                $('#tt').tabs({
                    onSelect: function (title) {

                        if (title == '采购合同创建/编辑') {
                            if (tab2Switch_) {
                                entranceOfTab2('isadd')
                            }

                        }
                        if (title == '采购合同清单') {

                            cleanAll();

                            $.ajax({
                                url: Constant.API_URL + 'DELETETEMP',
                                dataType: 'json',
                                success: function (jdata) {

                                }
                            })

                        }
                    }
                });
            }
            else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}


//Tab1  的页面
function InitDataGrid() {
    var identity = 'dg';
    $("#dg").MyDataGrid({
        identity: identity,
        sortable: true,

        queryParams: {
            orderType: "('HCCG','HHPCG','JSCG','JBCG','GJCG','PLJBCG','PLJHCG','KLCG','RBCG','QTCG')"
        },
        columns: {
            param: {FunctionCode: 'MM_PURCHASE_CONTRACT_LIST'},
            alter: {
                'ORDER_DATE': {
                    type: 'date'
                },
                'UPLOAD': {
                    formatter: function (value, row, index) {
                        if (row.UPLOAD) {
                            return '<a href="javascript:void(0);" rowindex="' + index + '" class="attach">' +
                                '<img src="/img/edit2.png" border="0" style="width:15px;height:15px;"/></a>'
                        }
                    }
                },
                'STATUS': {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['status'][value];
                    }
                },
                'ORDER_SOURCE': {
                    formatter: function (value, row, index) {
                        return SOURCE['source'][value];
                    }
                },
                'ORDER_TYPE': {
                    formatter: function (value, row, index) {

                        return orderType[value];
                    }
                },
                'PAYMENT_MODE': {
                    formatter: function (value, row, index) {
                        if (value == 'YF') {
                            return '预付';
                        }
                        else {
                            return '到付';
                        }
                    }
                }
            }
        },
        /*  loadFilter: function (jdata) {

              jdata.rows = toUnderlineCaseArray(jdata.rows);

              return jdata;
          },*/
        validAuth: function (row, items) {
        },
        onLoadSuccess: function () {
            InitSuspend('a.attach', {
                'onmouseover': function (thiz, event, callback) {
                    var index = $(thiz).attr("rowindex");
                    var row = $("#dg").datagrid('getRows')[index];

                    InitFuncCodeRequest_({
                        data: {SOURCE_ID: row.ORDER_NO, CATEGORY: "CONTRACT", FunctionCode: 'ATTACHMENT_RSPL_GET'},
                        successCallBack: function (jdata) {
                            if (jdata.code == 200) {
//                                    console.log("*************************************")
//                                    console.log(jdata.data)
//                                    console.log("*************************************")

                            }
                            var html = "";
                            for (var i = 0; i < jdata.data.length; i++) {
                                html += '<li><a target="_blank" onclick="downFile(' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a><span onclick="deleteFile(\'' + jdata.data[i].PKID + '\');return false;" class="icon-cross"></span></li>';

                            }

                            callback(html);
                        }
                    });
                }
            });
            $("#dg").datagrid('doCellTip', {'max-width': '400px', 'delay': 500});
        },

        validAuth: function (row, items) {
            console.log(row);
            if (row.ORDER_TYPE != "HCCG" && row.ORDER_TYPE != "HHPCG" && row.ORDER_TYPE != "JBCG" && row.ORDER_TYPE != "GJCG" && row.ORDER_TYPE != "PLJBCG" && row.ORDER_TYPE != "RBCG") {
                items['common:COMMON_OPERATION.EDIT'].enable = true;
            } else {

                if (row.STATUS != 'BXZ') {
                    items['common:COMMON_OPERATION.EDIT'].enable = false;
                    items['common:RES.COMMON.SUBMIT_APPROVAL'].enable = false;
                    items['common:COMMON_OPERATION.DEL'].enable = false;
                }
            }
            return items;
        },

        contextMenus: [
            {
                id: "m-edit", i18nText: "common:COMMON_OPERATION.EDIT", auth: "MM_ORDER_PUR_EDIT",
                onclick: function () {
                    entranceOfTab2('isEidt');
                }
            }
            , {
                id: "m-browse", i18nText: "common:RES.COMMON.BROWSE", auth: "MM_ORDER_PUR_VIEW",
                onclick: function () {
                    entranceOfTab2('isBrowse');
                }
            }
            ,
            {
                id: "m-uploadAttach", i18nText: "common:RES.COMMON.UPLOAD_ATTACHMENT", auth: "MM_ORDER_PUR_UPL",
                onclick: function () {
                    var rowData = $("#dg").datagrid('getSelected');
                    common_upload_({
                        identity: identity,
                        param: {
                            cat: 'CONTRACT',
                            sourceId: rowData.ORDER_NO,
                            PKID: "hahahahah",
                            successCallBack: "aa",
                            failCallBack: "bb"
                        }
                    });
                }
            }

            , {
                id: "m-submitApproval", i18nText: "common:RES.COMMON.SUBMIT_APPROVAL", auth: "MM_ORDER_PUR_SP",
                onclick: function () {
                    var rowData = $("#dg").datagrid('getSelected');
                    ShowWindowIframe({
                        width: 400,
                        height: 200,
                        title: "提交审核",
                        param: {pkid: rowData.ORDER_NO, functionCode: "MM_ORDER_SUBMIT_APPROVAL"},
                        url: "/views/mm/formtemplet/commit_name.shtml"

                    });
                }
            }
            , {
                id: "m-approvalProcess", i18nText: "common:RES.COMMON.APPROVAL_TRACK", auth: "MM_ORDER_PUR_SP",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    console.log(rowdata);
                    ShowWindowIframe({
                        width: 815,
                        height: 300,
                        title: $.i18n.t('审批轨迹'),
                        param: {partId: rowdata.ORDER_NO},
                        url: '/views/mm/formtemplet/part_number_liucheng.shtml'
                    });
                }
            }
            , {
                id: "m-delete", i18nText: "common:COMMON_OPERATION.DEL", auth: "MM_ORDER_PUR_DEL",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    var orderNo = rowdata.ORDER_NO;
                    common_delete_({
                        identity: identity,
                        cfmI18next: "msg_tip:TIP.COMMON.DEL_CONFIRM",
                        param: {data: {orderNo: orderNo}},
                        FunctionCode: "MM_REPAIR_DEL_CG"
                    });

                }
            },
            {
                id: "m-dayin", i18nText: "打印（中文）", auth: "",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    var orderNo = rowdata.ORDER_NO;
                    var data = {PKID: orderNo, FLAG: "POCN"};
                    doPost('/api/v1/plugins/A6MM_ORDER_DAYIN', data)
                }
            },
            {
                id: "m-dayin", i18nText: "打印（英文）", auth: "",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    var orderNo = rowdata.ORDER_NO;
                    var data = {PKID: orderNo, FLAG: "POEN"};
                    doPost('/api/v1/plugins/A6MM_ORDER_DAYIN', data)
                }
            }

        ]
        ,
        resize: function () {
            return tabs_standard_resize($('#tt'), 80);
        }
    });
}


//Tab2的内容
function InitDataGridR() {
    var identity = 'quyu2';
    $('#quyu2').MyDataGrid({
        identity: 'quyu2',
        onClickRow: function (index, row) {
            planNo = row.PLAN_NO;
            requireNo = row.REQUIRE_NO;
            evaluateNo = row.EVALUATE_NO;
            $("#form2").form('clear');
            $("#form3").form('clear');
            $("#inputer").textbox({value: getLoginInfo().userName, editable: false, onlyview: true});
            $('#inputDate').datetimebox({value: formatDateTime(new Date())});
            ParseFormField_(row, $("#form2"), Constant.CAMEL_CASE);
            ParseFormField_(row, $("#form3"), Constant.CAMEL_CASE);

            $("#inputer").textbox({value: userName[row.INPUTER]});
            if (row.CANCEL_MARK == 'Y') {
                $(':checkbox[name=cancelMark]').prop('checked', true);
            }
            if (row.CLOSE_MARK == 'Y') {
                $(':checkbox[name=closeMark]').prop('checked', true);
            }
            if (row.FAA_DOCUMENT == 'Y') {
                $(':checkbox[name=faaDocument]').prop('checked', true);
            }
            if (row.EASA_DOCUMENT == 'Y') {
                $(':checkbox[name=easaDocument]').prop('checked', true);
            }
            if (row.CAAC_DOCUMENT == 'Y') {
                $(':checkbox[name=caacDocument]').prop('checked', true);
            }
            if (row.OME_DOCUMENT == 'Y') {
                $(':checkbox[name=omeDocument]').prop('checked', true);
            }
        },
        columns: {
            param: {FunctionCode: 'MM_PURCHASEMINGXI_LIST'},
            alter: {
                'STATUS': {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['status'][value];
                    }
                },
                PART_NO: {
                    editor: {
                        type: 'textbox',
                        options: {required: true, tipPosition: 'top', validType: ['maxLength[60]']}
                    }
                },
//                SERIAL_NUMBER:{
//                    editor : {type :'textbox', options : { tipPosition: 'top', validType:['maxLength[60]'] }}
//                },
                ORDER_QTY: {
                    editor: {
                        type: 'numberbox',
                        options: {required: true, tipPosition: 'top', validType: ['maxLength[10]'], precision: 2}
                    }
                },
                ORDER_UNIT: {
                    editor: {
                        type: 'textbox',
                        options: {required: true, tipPosition: 'top', validType: ['maxLength[10]']}
                    }
                },
                UNIT_PRICE: {
                    editor: {
                        type: 'numberbox',
                        options: {tipPosition: 'top', validType: ['maxLength[10]'], precision: 2}
                    }
                },
                TOTAL_PRICE: {
                    editor: {
                        type: 'numberbox',
                        options: {tipPosition: 'top', validType: ['maxLength[10]'], precision: 2}
                    }
                },
                UNIT_PRICE_TAX_FEE: {
                    editor: {
                        type: 'numberbox',
                        options: {tipPosition: 'top', validType: ['maxLength[10]'], precision: 2}
                    }
                },
                PART_CONDITION: {
                    editor: {
                        type: 'combobox', options: {
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "MM_PART_CONDITION"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: false,
                            panelHeight: 'auto',
                            loadFilter: function (jdata) {
                                return jdata.data.MM_PART_CONDITION;
                            },
                            tipPosition: 'top'
                        }
                    },
                    formatter: function (value) {
                        return value;
                    }
                },
                FAA_DOCUMENT: {
                    editor: {type: 'checkbox', options: {on: 'Y', off: 'N', ontxt: '是', offtxt: '否'}}
                },
                EASA_DOCUMENT: {
                    editor: {type: 'checkbox', options: {on: 'Y', off: 'N', ontxt: '是', offtxt: '否'}}
                },
                CAAC_DOCUMENT: {
                    editor: {type: 'checkbox', options: {on: 'Y', off: 'N', ontxt: '是', offtxt: '否'}}
                },
                OME_DOCUMENT: {
                    editor: {type: 'checkbox', options: {on: 'Y', off: 'N', ontxt: '是', offtxt: '否'}}
                },
                WARRANTY_DAY: {
                    editor: {type: 'numberbox', options: {tipPosition: 'top', validType: ['maxLength[4]']}}
                },
                DELIVERY_DATE_FROM: {
                    editor: {type: 'datebox', options: {tipPosition: 'top'}}
                },
                DELIVERY_DATE_TO: {
                    editor: {type: 'datebox', options: {tipPosition: 'top'}}
                },
                PART_NO_DELIVERY: {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[60]']}}
                },
                SERIAL_NUMBER_DELIVERY: {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[60]']}}
                },
                PREPAYMENT_PER: {
                    editor: {
                        type: 'numberbox',
                        options: {tipPosition: 'top', validType: ['maxLength[10]'], precision: 0}
                    }
                },
                PREPAYMENT_TOTAL: {
                    editor: {
                        type: 'numberbox',
                        options: {tipPosition: 'top', validType: ['maxLength[10]'], precision: 2}
                    }
                },
                WAREHOUSE_NO: {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[10]']}}
                },
                WAREHOUSE_BASE: {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[30]']}}
                },
                DELIVERY_TO_VENDRO_CODE: {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[30]']}}
                },
                CANCEL_MARK: {
                    editor: {type: 'checkbox', options: {on: 'Y', off: 'N', ontxt: '是', offtxt: '否'}}
                },
                CLOSE_MARK: {
                    editor: {type: 'checkbox', options: {on: 'Y', off: 'N', ontxt: '是', offtxt: '否'}}
                },
                PLAN_NO: {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[30]']}}
                },
                REQUIRE_NO: {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[30]']}}
                },
                EVALUATE_NO: {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[30]']}}
                }
            }
        },
        enableLineEdit: functionSwitch_edit,
        onBeginEdit: function (index, row) {

        },
        onLoadSuccess: function () {
            var isok = $("#orderNo1").textbox("getValue");
            if (isok && functionSwitch_) {
                $('#btnAdd').linkbutton('enable');
                $("#bottomSubmit1").unbind('click').bind("click", function () {
                    AddOrEditQuYu2_();
                });
                $("#bottomSubmit").unbind('click').bind("click", function () {
                    AddOrEditQuYu2_();
                });
                $("#addBySelelct").unbind('click').bind("click", function () {
                    addBySelelct();
                });
                $("#addByHand").unbind('click').bind("click", function () {
                    addByHand();
                });
                $("#detailMore").unbind('click').bind("click", function () {
                    detailMore();
                });
            }
            else {
                $('#btnAdd').linkbutton('enable');
                $("#bottomSubmit1").unbind('click').bind("click", function () {
                    AddOrEditQuYu2_();
                });
                $("#bottomSubmit").unbind('click').bind("click", function () {
                    AddOrEditQuYu2_();
                });
                $("#addBySelelct").unbind('click').bind("click", function () {
                    addBySelelct();
                });
                $("#addByHand").unbind('click').bind("click", function () {
                    addByHand();
                });
                $("#detailMore").unbind('click').bind("click", function () {
                    detailMore();
                });
            }
        },
        onEndEdit: function (index, row, changes) {
            row = toCamelCase(row);
            if (row.itemNo) {
                row = $.extend({}, row, {FunctionCode: 'MM_PURCHSEORDER_EDIT'});
            } else {
                row = $.extend({}, row, {FunctionCode: 'MM_URCHSEORDER_ADD'});

            }
            var orderNo = $("#orderNo1").textbox('getValue');
            row['orderNo'] = orderNo;
            InitFuncCodeRequest_({
                data: row,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        laodTab2(orderNo);
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                        insertFailRow(identity, index);
                    }
                }
            });
        },
        queryParams: {orderNo: paramOrderNo},
        contextMenus: [{
            id: "m-delete", i18nText: "common:COMMON_OPERATION.DEL", auth: "",
            onclick: function () {
                var rowdata = getDG(identity).datagrid('getSelected');
                var orderNo = $("#orderNo1").textbox('getValue');
                var partNo = rowdata.PART_NO;
                var itemNo = rowdata.ITEM_NO;
                var planNo = rowdata.PLAN_NO;
                var requireNo = rowdata.REQUIRE_NO;
                var evaluateNo = rowdata.EVALUATE_NO;
                if (orderNo == null) {
                    orderNo = tempOrderNo;
                }
                common_delete_({
                    identity: identity,
                    cfmI18next: "msg_tip:TIP.COMMON.DEL_CONFIRM",
                    param: {
                        data: {
                            orderNo: orderNo,
                            partNo: partNo,
                            itemNo: itemNo,
                            planNo: planNo,
                            requireNo: requireNo,
                            evaluateNo: evaluateNo
                        }, itemNo: "ITEM_NO"
                    },
                    FunctionCode: "MM_REPAIRDETIAL_DEL_CG"
                });
            }

        },
            {
                id: "m-delete", i18nText: "审批", auth: "",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    var orderNo = $("#orderNo1").textbox('getValue');
                    var partNo = rowdata.PART_NO;
                    var itemNo = rowdata.ITEM_NO;
                    var planNo = rowdata.PLAN_NO;
                    var requireNo = rowdata.REQUIRE_NO;
                    var evaluateNo = rowdata.EVALUATE_NO;
                    if (orderNo == null) {
                        orderNo = tempOrderNo;
                    }
                    common_delete_({
                        identity: identity,
                        cfmI18next: "确定审批吗？",
                        param: {
                            data: {
                                orderNo: orderNo,
                                partNo: partNo,
                                itemNo: itemNo,
                                planNo: planNo,
                                requireNo: requireNo,
                                evaluateNo: evaluateNo
                            }, itemNo: "ITEM_NO"
                        },
                        FunctionCode: "MM_REPAIRDETIAL_CHANGE"
                    });
                }

            }
        ],
        validAuth: function (row, items) {
            if (!functionSwitch_edit) {
                items['common:COMMON_OPERATION.DEL'].enable = false;
            }
            if (row.STATUS == "BXZ") {
                items['审批'].enable = true;
            } else {
                items['审批'].enable = false;
            }
            return items;
        },
//            toolbar: [
//                {
//                    key: "COMMON_ADD",text: $.i18n.t('common:COMMON_OPERATION.ADD'), auth: "",
//                    handler: function () {
//                    $("#quyu2").datagrid('appendRow',{isadd__:1});
//                   }
//                }],
        resize: function () {
            return tabs_standard_resize($('#tt'), 80, 20);
        }
    });


}

// 更多页面回调查询合同
function selectHeTongByHand() {
    var orderNo = $("#orderNoMore").textbox("getValue");
    if (!orderNo) {
        MsgAlert({content: "查询前，请填写合同号", type: "error"});
        return;
    }
    selectHeTong(orderNo, selectHeTongByHandMark);
}

// 更多页面回调查询合同
function selectHeTong(moreToOrderNo, mark) {
    $("#orderNoMore").textbox({value: moreToOrderNo});
    InitFuncCodeRequest_({
        data: {
            orderNo: moreToOrderNo,
            orderType: "('HCCG','HHPCG','JSCG','JBCG','GJCG','PLJBCG','PLJHCG','KLCG','RBCG','QTCG')",
            FunctionCode: "MM_ORDERINFO_GET"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (!jdata.data) {
                    cleanAll();
//                        return;
                }
                if (!mark) {
                    functionSwitch_ = false;
                    $("#AddAll").unbind();
                    $("#holdTempTab2").unbind();
                    InitEditFormForbid_();

                }
                ParseFormField_(jdata.data, $("#mform"), null);
                laodTab2(moreToOrderNo);
                $("#orderNoMore").textbox({editable: true, onlyview: false});
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    })
}

//tab2 的数据表格
function AddOrEditQuYu2_() {
    var $form = $("#form2");
    var $form2 = $("#form3");
    var data = '';
    var isEidt_;
    var orderNo = $("#orderNo1").textbox('getValue');
    if ($("#itemNo").val() == '') {
        isEidt_ = false;
    }
    else {
        isEidt_ = true;
    }
    var isValidate = $form.form('validate');
    if (!isValidate) {
        return false;
    }

    if ($('#closeMark').is(':checked')) {
        $('#closeMark').val('Y');
    }
    if ($('#cancelMark').is(':checked')) {
        $('#cancelMark').val('Y');
    }
    data = $form.serializeObject();
    // data['planNo'] = planNo;
    // data['requireNo'] = requireNo;
    // data['evaluateNo'] = evaluateNo;
    data = $.extend({}, data, {FunctionCode: (isEidt_ ? 'MM_PURCHSEORDER_EDIT' : 'MM_URCHSEORDER_ADD')});
    var isValidate = $form2.form('validate');
    if (!isValidate) {
        return false;
    }
    var data1 = $form2.serializeObject();
    data = $.extend({}, data, data1);
    data["orderNo"] = orderNo;
    InitFuncCodeRequest_({
        data: data,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                laodTab2(orderNo);
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {

                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

}

//Tab2 保存(合同表的保存)
function AddAll_(temp) {

    var $form = $("#mform");
    var isValidate = $form.form('validate');
    if (!isValidate) {
        return false;
    }
    var data = $form.serializeObject();
    data = $.extend({}, data, {FunctionCode: (isedit_ ? 'MM_ORDERBASEINFO_EDIT_A6' : 'MM_ORDERBASEINFO_ADD_A6')});
    if (temp) {
        data = $.extend({}, data, {FunctionCode: isedit_ ? 'MM_ORDERBASEINFO_TEMPEDIT' : 'MM_ORDERBASEINFO_TEMPADD'});
    }
    data['isCG'] = 'isCG';
    data['tempOrderNo'] = tempOrderNo;
    InitFuncCodeRequest_({
        data: data,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                isedit_ = true;
                $("#orderNo1").textbox({value: jdata.data.orderNo});
                paramOrderNo = $("#orderNo1").textbox("getValue");
                laodTab2(paramOrderNo);
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {

                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

}

// 关闭Tab2
function holdTempTab2_() {
    AddAll_(true);
}

function cleanAllAndGoToNextTab() {
    $('#tt').tabs('select', 0);
    cleanAll();


}

function cleanAll() {
    paramOrderNo = '';
    tab2Switch_ = true;
    $("#orderNoMore").textbox({value: ""});
    $("#mform").form('clear');
    $("#form2").form('clear');
    $("#form3").form('clear');
    laodTab2(paramOrderNo);
    reload_();
    InitEditForm_();
}

//重新给参数刷新Tab2
function laodTab2(localOrderNo) {

    getDgOpts('quyu2').options.enableLineEdit = functionSwitch_edit;
    $("#quyu2").datagrid("load", {'orderNo': localOrderNo});
}

function reload(date) {
    var dgopt = getDgOpts('quyu2');
    var url = dgopt.url;
    var $dg = $(dgopt.owner);
    $dg.datagrid({
        url: url,
        queryParams: {orderNo: date}
    });
}


/** 刷新列表数据 */
function reload_() {
    $("#dg").datagrid("reload");
}

/** 刷新列表数据 */
function reloadTab2_() {
    paramOrderNo = $("#orderNo1").textbox("getValue");
    laodTab2(paramOrderNo);
//        $("#quyu2").datagrid("reload");
}

/** 刷新列表数据 */
function runAndLoadTab2Byparam_(data, mark) {

//        evaluate=evaluatelist;
    tempOrderNo = data.orderNo;

    if (data.vendor != null) {
        $("#vendorCode").textbox({value: data.vendor.vendorCode});
        $("#vendorName").textbox({value: data.vendor.vendorName});
        $("#vendorAddress").textbox({value: data.vendor.vendorAddress});
        $("#vendorZip").textbox({value: data.vendor.vendorZip});
        $("#vendorPhone").textbox({value: data.vendor.vendorTel});
        $("#vendorFax").textbox({value: data.vendor.vendorFax});
        $("#vendorEmail").textbox({value: data.vendor.vendorEmail});
        $("#vendorWebsite").textbox({value: data.vendor.vendorWebsite});
    }
    entranceOfTab2('isaddByExample', mark);
    laodTab2(data.orderNo);
}

//打开下方的横多按钮
function detailMore() {
    ShowWindowIframe({
        width: 700,
        height: 500,
        param: {functionSwitch_edit: functionSwitch_edit, orderNo: $('#orderNo1').textbox('getValue')},
        title: "更多",
        url: "/views/mm/contract/mmrepair/mm_repaire_detailmore.shtml"
    });
}

//跳转到 采购需求评估  增加合同详细信息
function addBySelelct() {
    functionSwitch_edit = true;
    InitDataGridR();
    ShowWindowIframe({
        width: 950,
        height: 500,
        param: {orderNo: $('#orderNo1').textbox('getValue')},
        title: "采购需求评估",
        url: "/views/mm/contract/purchase/mm_purchase_add_tab.shtml"
    });
}

//手工增加明细信息
function addByHand() {
    functionSwitch_edit = true;
    InitDataGridR();
    $("#form2").form('clear');
    $("#form3").form('clear');
    $("#partNo").combogrid().next('span').find('input').focus();
}

function add_() {
    ShowWindowIframe({
        width: 1350,
        height: 600,
        title: "采购类合同管理",
        url: "/views/mm/contract/purchase/mm_purchase_add_edit.shtml"
    });
}

function successCallBack(dd) {
}


function exportExcel() {
    helpQuery('dg', 'ffSearch', function () {
        var data = $("#ffSearch").serializeObject();
        data = $.extend({}, data, {
            url: "/api/mmpartnum/export"
        });
        doPost(data.url, data);
    });
}

function deleteFile(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: 'ATTACHMENT_RSPL_DEL'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                reload_()
            }
//                var html = "";
//                for(var i=0; i<jdata.data.length;i++){
//                    html += '<li><a href="javascript:;">文件名称'+jdata.data[i].ORG_NAME+'</a><button onclick="deleteFile(jdata.data[i].PKID)">删除</button></li>';
//                }
//                callback(html);
        }
    });
}
