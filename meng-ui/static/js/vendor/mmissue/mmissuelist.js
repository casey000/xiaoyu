function changeData() {
    var giType2 = $("#giType2").combobox("getValue");
    var giUse2 = $("#giUse2").combobox("getValue");
    if (giType2 == 'WXFL' && (giUse2 == 'DJWX' || giUse2 == 'HXWX')) {
        $("#acno2").textbox({required: true});
    } else {
        $("#acno2").textbox({required: false});

    }


}

$(function () {
    $('#giDate3').datebox().datebox('calendar').calendar({
        validator: function (date) {
            var now = new Date();
            var d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return date <= d;
        }
    });
});

function formatterDate(date) {
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"
        + (date.getMonth() + 1);
    var hor = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return date.getFullYear() + '-' + month + '-' + day + " " + hor + ":" + min + ":" + sec;
}

var identity = 'dg';
var identity2 = 'dg2';
var giDocumentNo = "";
var giType = {};
var giUse = {};
var giType2 = {};
var giUse2 = {};
var loginUser;
var partAttr = {};
var partCondition = {};
var status;

function i18nCallBack() {

    $('#tt').tabs({
        onSelect: function (title, index) {
            if (title == "航材发料") {
                faliao()
            }
        }
    });
    InitFuncCodeRequest_({
        data: {
            domainCode: 'PM_ACREG_ACNO,MM_GI_TYPE,MM_GI_USE,WAREHOUSE_NO,MM_STORAGE_AREA_NO,MM_DIC_PART_ATTR,MM_PART_CONDITION',
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            giType = DomainCodeToMap_(jdata.data["MM_GI_TYPE"]);
            giUse = DomainCodeToMap_(jdata.data["MM_GI_USE"]);
            giType2 = DomainCodeToMap_(jdata.data["MM_GI_TYPE"]);
            giUse2 = DomainCodeToMap_(jdata.data["MM_GI_USE"]);
            partAttr = DomainCodeToMap_(jdata.data["MM_DIC_PART_ATTR"]);
            partCondition = DomainCodeToMap_(jdata.data["MM_PART_CONDITION"]);
            //发料类型
            $('#warehouseNo').combobox({
                panelHeight: '150',
                editable: true,
                data: jdata.data.WAREHOUSE_NO,
                onChange: validenable,
                valueField: 'VALUE',
                textField: 'TEXT',
                onSelect: function (value) {
                    InitFuncCodeRequest_({
                        data: {warehouseNo: value.VALUE, FunctionCode: "MM_GET_STORAGE_AREA_NO"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                console.log(jdata.data);
                                $('#storageAreaNo').combobox({
                                    panelHeight: '150px',
                                    data: jdata.data,
                                    valueField: 'VALUE',
                                    textField: 'TEXT'
                                });
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    })
                }
            });
            $('#acno').combobox({
                panelHeight: '150',
                editable: true,
                data: jdata.data.PM_ACREG_ACNO,
                onChange: validenable,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#acno2').combobox({
                panelHeight: '150',
                editable: true,
                data: jdata.data.PM_ACREG_ACNO,
                onChange: validenable,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#storageAreaNo').combobox({
                panelHeight: '150',
                editable: true,
                onChange: validenable,
                data: jdata.data.MM_STORAGE_AREA_NO,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#giType').combobox({
                panelHeight: '150',
                editable: true,
                data: jdata.data.MM_GI_TYPE,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#giType2').combobox({
                panelHeight: '150',
                data: jdata.data.MM_GI_TYPE,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            //发料用途
            $('#giUse').combobox({
                panelHeight: '150',
                data: jdata.data.MM_GI_USE,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#giUse2').combobox({
                panelHeight: '150',
                editable: false,
                data: jdata.data.MM_GI_USE,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    InitDataGrid();
    InitDataGrid2();
    InitEditForm_();
}

function InitEditForm_() {
    var $form = $("#form2");
    var data = {};
    $form.form({
        onSubmit: function () {
            var isValidate1 = $("#mform1").form('validate');
            if (!isValidate1) {
                return false;
            }

            var data = $form.serializeObject();
            data = $.extend({}, data, {
                FunctionCode: ('A6_MM_ISSUE_ADD_EDIT')
            });
            data['A'] = JSON.stringify($form.serializeObject());
            var rows2 = $("#dg2").datagrid('getRows');
            for (var i = 0; i < rows2.length; i++) {
                //获取每一行的数据
                rows2[i].isAdd__ = '';
            }
            data['B'] = JSON.stringify(toCamelCaseArray($("#dg2").datagrid('getRows')));
            InitFuncCodeRequest_({
                data: data,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        giDocumentNo = jdata.data;
                        $("#giDocumentNo2").textbox({value: jdata.data});
                        InitDataGrid2();
//                            reload_()
                        setTimeout("$('#btnAdd').linkbutton('disable')", 500);
                        $('#btnAdd').linkbutton('disable');
                        console.log($("#giDocumentNo2").textbox('getValue'));
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
            return false;
        }
    });
}

function InitDataGrid() {
    $("#dg").MyDataGrid({
        fit: true,
        identity: identity,
        firstLoad: false,
        sortable: true,
        columns: {
            param: {FunctionCode: 'MM_ISSUE_SEND_LIST'},
            alter: {
                //不显示字典，显示描述的列
                GI_TYPE: {
                    formatter: function (value) {
                        return giType[value];
                    }
                },
                GI_USE: {
                    formatter: function (value) {
                        return giUse[value];
                    }
                }
            }
        },

        /*  loadFilter: function (jdata) {
         jdata.rows = toUnderlineCaseArray(jdata.rows);
         return jdata;
         },
         */  contextMenus: [
            /*{//右键编辑
             id: "m-edit", i18nText: "common:COMMON_OPERATION.EDIT", auth: "",
             onclick: function () {
             var rowdata = getDG(identity).datagrid('getSelected');
             common_add_edit_({
             identity: identity,
             isEdit: 1,
             width: 1350,
             height: 600,
             title: $.i18n.t('修理协议管理'),
             param: {data: {  }},
             url: "/views/mm/agreement/mmagreementxl/mm_agreementxl_add_edit.shtml"
             });
             }
             },*/

            /*{//右键删除
             id: "m-delete", i18nText: "common:COMMON_OPERATION.DEL", auth: "",
             onclick: function () {
             common_delete_({
             identity: identity,
             cfmI18next: "msg_tip:TIP.COMMON.DEL_CONFIRM",
             param: {agreementId: "AGREEMENT_ID"},
             FunctionCode: "MM_AGREEMENT_DELETE"
             });
             }
             },*/
            {
                id: "m-delete", i18nText: "浏览", auth: "MM_ISSUE_VIEW",
                onclick: function () {
                    $('#tt').tabs('select', '航材发料');
                    var rowdata = getDG(identity).datagrid('getSelected');
                    console.log(rowdata);
                    $('#baocun').hide();
                    $("#giDate3").datebox({editable: false, onlyview: true});
                    $("#giType2").combobox({editable: false, onlyview: true});
                    $("#giUse2").combobox({editable: false, onlyview: true});
                    $("#acno2").textbox({editable: false, onlyview: true});
                    $("#refDocumentNo2").textbox({editable: false, onlyview: true});
                    $("#receiveMan1").textbox({editable: false, onlyview: true});
                    $("#receiveDept").textbox({editable: false, onlyview: true});
                    $("#giMan2").textbox({editable: false, onlyview: true});
                    $("#warehouseNo").combobox({editable: false, onlyview: true});
                    $("#storageAreaNo").combobox({editable: false, onlyview: true});
                    giDocumentNo = rowdata.GI_DOCUMENT_NO;
                    ParseFormField_(rowdata, null, Constant.CAMEL_CASE);
                    status = 1;
                    InitDataGrid2();

                    setTimeout('diableDatagrid("dg2",false)', 100);
                    setTimeout("$('#btnAdd').linkbutton('disable')", 100);

                    $('#ffSearch').form('clear');
                }
            },
            {
                id: "m-dayin", i18nText: "common:RES.COMMON.DAYIN", auth: "",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    var giDocumentNo = rowdata.GI_DOCUMENT_NO;
                    var data = {PKID: giDocumentNo};
                    doPost('/api/v1/plugins/A6MM_ISSUE_DAYIN', data)
                }
            }
            /*{//右键冲销
             id: "m-delete", i18nText: "冲销", auth: "",
             onclick: function () {
             common_delete_({
             identity: identity,
             cfmI18next: "msg_tip:TIP.COMMON.DEL_CONFIRM",
             param: {giDocumentNo : "GI_DOCUMENT_NO"},
             FunctionCode: "MM_ISSUE_CHONGXIAO"
             });
             }
             },*/
            /*{//右键复制
             id: "m-delete", i18nText: "复制", auth: "",
             onclick: function () {
             $('#tt').tabs('select', '航材发料');
             var rowdata = getDG(identity).datagrid('getSelected');
             console.log(rowdata)
             giDocumentNo = rowdata.GI_DOCUMENT_NO
             ParseFormField_(rowdata, null, Constant.CAMEL_CASE);
             alert(giDocumentNo)
             $("#giDocumentNo2").textbox("clear");
             $("#giDate3").textbox('setValue',formatterDate(new Date()));
             InitDataGrid2()
             $('#ffSearch')[0].reset();
             }
             }*/
        ]
    });
}

function InitDataGrid2() {
    var pa;
    $("#dg2").MyDataGrid({
        fit: true,
        identity2: identity2,
        sortable: true,
        firstload: false,
        columns: {
            param: {FunctionCode: 'MM_ISSUE_SENDITEM_LIST'},
            alter: {
                'PART_NUMBER': {
                    editor: {
                        type: 'combogrid',

                        options: {
                            panelWidth: 380,
                            mode: 'remote',
                            fitColumns: true,
                            pagination: true,
                            idField: 'TEXT',  //实际选择值
                            textField: 'TEXT', //文本显示值
                            width: 90,
                            url: '/api/v1/plugins/' + 'MM_PN_ID',
                            columns: [[
                                {field: 'TEXT', title: '物料号', width: 60, sortable: true}
                            ]],
                            required: true,
                            onSelect: function (jdata, row) {
                                console.log(jdata);
                                pa = row.PART_ATTR;
                            },
                            onHidePanel: function () {

                                var index = $(this).parents('tr[datagrid-row-index]').attr('datagrid-row-index');
                                var ed = getDG(identity2).datagrid('getEditor', {index: index, field: 'PART_ATTR'});
                                var ed1 = getDG(identity2).datagrid('getEditor', {index: index, field: 'GI_QTY'});
                                var ed2 = getDG(identity2).datagrid('getEditor', {index: index, field: 'PART_NUMBER'});
                                var partNumberValue = $(ed2.target).combobox('getValue');
                                var partNumberText = $(ed2.target).combobox('getText');

                                $(ed.target).textbox({value: pa});
                                $(ed2.target).textbox({value: partNumberValue});
                                console.log(partNumberValue);

                                // if (pa == 'R') {
                                //
                                //     $(ed1.target).textbox({value: 1});
                                // } else {
                                //     $(ed1.target).textbox({value: ''});
                                // }

                                var giType2 = $("#giType2").textbox("getValue");
                                var refDocumentNo = $("#refDocumentNo2").textbox("getValue");
                                var warehouseNo = $("#warehouseNo").combobox("getValue");
                                var storageAreaNo = $("#storageAreaNo").combobox("getValue");
//                                    var index = $(this).parents('tr[datagrid-row-index]').attr('datagrid-row-index');
                                InitFuncCodeRequest_({
                                    data: {
                                        partNo: partNumberText,
                                        giType: giType2,
                                        refDocumentNo: refDocumentNo,
                                        warehouseNo: warehouseNo,
                                        storageAreaNo: storageAreaNo,
                                        FunctionCode: "A6VALID_PART_NO"
                                    },
                                    successCallBack: function (jdata) {
                                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                        }

                                        else {
                                            MsgAlert({content: jdata.msg, type: 'error'});

                                        }
                                    }
                                });
                            },

                            tipPosition: 'top'
                        }

                    }, formatter: function (value) {
                        return value;
                    }
                },
                "SERIAL_NUMBER": {
                    editor: {
                        type: 'textbox', options: {
                            icons: [{
                                iconCls: 'icon-search',
                                handler: function (e) {
                                    var index = $(e.target).parents('tr[datagrid-row-index]').attr('datagrid-row-index');
                                    var ed = getDG(identity2).datagrid('getEditor', {index: index, field: 'PART_ATTR'});
                                    var partAttr = $(ed.target).combobox('getValue');
                                    showWindow(index, partAttr);
                                    //aaaddd(index,'dddddd');
                                }
                            }]
                        }
                    }
                },
                "PART_ATTR": {
//                        editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[12]']}},
                    editor: {
                        type: 'combobox',
                        options: {
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "MM_DIC_PART_ATTR"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            required: true,
                            loadFilter: function (jdata) {
                                return jdata.data.MM_DIC_PART_ATTR;
                            },
                            tipPosition: 'top'
                        }
                    },
                    formatter: function (value, row, index) {
                        return partAttr[value];
                    }
//                        partCondition
                },
//                    PART_ATTR:{ formatter: function(value,row,index){
//                        return partAttr[value];
//                    }},
                "PART_CONDITION": {
                    editor: {
                        type: 'textbox',
                        options: {tipPosition: 'top', validType: ['maxLength[12]'], editable: false}
                    },
                    formatter: function (value, row, index) {
                        console.log(partCondition[value]);
                        return partCondition[value];
                    }
                },
                "GI_QTY": {
                    editor: {
                        type: 'numberbox',
                        options: {tipPosition: 'top', validType: ['maxLength[12]'], precision: 1}
                    }
                },
                "STORAGE_BIN_NO": {
                    editor: {type: 'textbox', options: {tipPosition: 'top', editable: false}}
                },

                "STORE_UNIT": {
                    editor: {type: 'textbox', options: {tipPosition: 'top', editable: false}}
                },
                "HANGTAG_NO": {
                    editor: {type: 'textbox', options: {tipPosition: 'top', editable: false}}
                },
                "PKID": {
                    editor: {type: 'textbox', options: {tipPosition: 'top', editable: false}}
                },

                "BATCH_NO": {
                    editor: {
                        type: 'textbox', options: {
                            icons: [{
                                iconCls: 'icon-search',
                                handler: function (e) {
                                    var index = $(e.target).parents('tr[datagrid-row-index]').attr('datagrid-row-index');
                                    var ed = getDG(identity2).datagrid('getEditor', {index: index, field: 'PART_ATTR'});
                                    var partAttr = $(ed.target).combobox('getValue');
                                    showWindow2(index, partAttr);
                                    //aaaddd(index,'dddddd');
                                }
                            }]
                        }
                    }
                }
            }
        },

        queryParams: {
            giDocumentNo: giDocumentNo
        },
        /*  loadFilter: function (jdata) {
         jdata.rows = toUnderlineCaseArray(jdata.rows);
         return jdata;
         },
         */
        enableLineEdit: status == 1 ? false : true,

        onBeginEdit: function (index, row) {
//                if (!row.isAdd__ ) {
//                    var ed = getDG(identity2).datagrid('getEditor', {index: index, field: 'PART_NUMBER'});
//                    $(ed.target).combobox({editable: false, onlyview: true, required: false, value: row.PART_NUMBER});
//
//                }

            /*var e2d = getDG(identity2).datagrid('getEditor', {index: index, field: 'SERIAL_NUMBER'});
             $(e2d.target).textbox('resize', '90px');
             $(e2d.target).textbox('setValue', '');
             $(e2d.target).after(" <a href='javascritp:void(0)'  onclick='showWindow("+index+")'><img src='/views/mm/vendor/mmissue/img/fdj.png' style='width:25px;border:0;float:right;' /></a>");*/
////
//                var e3d = getDG(identity2).datagrid('getEditor', {index: index, field: 'BATCH_NO'});
//                $(e3d.target).textbox('resize', '90px');
//                $(e3d.target).after(" <a href='javascritp:void(0)'  onclick='showWindow2("+index+")'><img src='/views/mm/vendor/mmissue/img/fdj.png' style='width:25px;border:0;float:right;' /></a>");
//

        },
        onLoadSuccess: function () {
            validenable()
        },
        onEndEdit: function (index, row, changes) {
            console.log(row);
            InitFuncCodeRequest_({
                data: {PKID: row.PKID, GI_QTY: row.GI_QTY, FunctionCode: "GETLOCKTEST"},
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        $("#agreementCurrency").combobox({
                            data: jdata.data['MM_CURRENCY'],
                            valueField: 'VALUE',
                            textField: 'TEXT'
                        })
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
            row = toCamelCase(row);
            if (!row.isadd__) {
                row = $.extend({}, row, {FunctionCode: 'MM_AGREEMENT_PURCHASE_EDIT'});
            } else {
                row = $.extend({}, row, {FunctionCode: 'MM_AGREEMENT_PURCHASE_ADD'});
            }
        },
        validAuth: function (row, items) {
            if (giDocumentNo) {
                items['复制'].enable = false;
                items['common:COMMON_OPERATION.DEL'].enable = false;


            }
            if (row.isAdd__) {
//                    items['复制'].enable = false;
                items['冲销'].enable = false;
            }
            return items;
        },
        toolbar: [
            {
                key: "COMMON_ADD", id: 'btnAdd', text: $.i18n.t('common:COMMON_OPERATION.ADD'),
                handler: function () {
                    var forTotal = $('#' + identity2).datagrid('getRows');
                    var row = {
                        isAdd__: 1,
                        GI_DOCUMENT_NO_ITEM: (forTotal.length + 1) * 10
                    };
                    $('#' + identity2).datagrid('appendRow', row);
                }
            }
        ],

        contextMenus: [
            /*{
             id: "m-edit", i18nText: "common:COMMON_OPERATION.EDIT", auth: "",
             onclick: function () {
             var rowdata = getDG(identity).datagrid('getSelected');
             common_add_edit_({
             identity: identity,
             isEdit: 1,
             width: 1350,
             height: 600,
             title: $.i18n.t('修理协议管理'),
             param: {data: {  }},
             url: "/views/mm/agreement/mmagreementxl/mm_agreementxl_add_edit.shtml"
             });
             }
             },*/
            {
                id: "m-delete", i18nText: "复制", auth: "MM_ISSUE_COPY",
                onclick: function () {

//                        InitFuncCodeRequest_({
//                            data: {pkid: rowData.PKID, FunctionCode: 'MM_ISSUE_SHIFOUCHONGXIAO'},
//                            successCallBack: function (jdata) {
//                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
////                                    if(jdata.data == null){
////                                        MsgAlert({ content: '!', type: 'error'});
////                                        return;
////                                    }
////                                    InitDataGrid1(jdata.data.TMXI)
////                                    InitDataGrid2(jdata.data.GKXX);
//                                }
//                            }
//                        });
                    var forTotal = $('#' + identity2).datagrid('getRows');
                    var rowData = $("#dg2").datagrid('getSelected');
                    var newData = $.extend({}, rowData);
                    newData['isAdd__'] = 'isAdd__';
                    newData['SERIAL_NUMBER'] = '';
                    newData['BATCH_NO'] = '';
                    newData['GI_DOCUMENT_NO_ITEM'] = (forTotal.length + 1) * 10;
                    newData['PKID'] = '';
                    $('#dg2').datagrid('appendRow', newData);

                }
            },
            {
                id: "m-delete", i18nText: "冲销", auth: "MM_ISSUE_CANCEL",
                onclick: function () {
                    var rowData = $("#dg2").datagrid('getSelected');
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'MM_ISSUE_CHONGXIAO'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_();
//                                    if(jdata.data == null){
//                                        MsgAlert({ content: '!', type: 'error'});
//                                        return;
//                                    }
//                                    InitDataGrid1(jdata.data.TMXI)
//                                    InitDataGrid2(jdata.data.GKXX);
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });


                }
            },

            {

                id: "m-delete", i18nText: "common:COMMON_OPERATION.DEL", auth: "MM_ISSUE_DEL",
                onclick: function () {
                    var row = $('#dg2').datagrid('getSelected');
                    var rowIndex = $('#dg2').datagrid('getRowIndex', row);
                    $("#dg2").datagrid('deleteRow', rowIndex);


                    var rows = $("#dg2").datagrid("getRows");

                    for (var i = 0; i < rows.length; i++) {
                        var rowIndex2 = $('#dg2').datagrid('getRowIndex', rows[i]);
                        $('#dg2').datagrid('updateRow', {
                            index: rowIndex2,
                            row: {
                                GI_DOCUMENT_NO_ITEM: (i + 1) * 10
                            }
                        });

//                            alert(rows[i].id);//假设有id这个字段
                    }

//                        common_delete_({
//                            identity: identity2,
//                            cfmI18next: "msg_tip:TIP.COMMON.DEL_CONFIRM",
//                            param: {pkid: "PKID"},
//                            FunctionCode: "MM_ISSUE_SENDITEM_DELETE"
//                        });
                }
            }
        ]
    });
}

function changeValue(index, value, filed) {
    var e2d = $("#dg2").datagrid('getEditor', {index: index, field: filed});
    $(e2d.target).textbox('setValue', value)
}

function validenable() {
    var warehouseNo = $("#warehouseNo").combobox("getValue");
    var giDate3 = $("#giDate3").datebox("getValue");
    var storageAreaNo = $("#storageAreaNo").combobox("getValue");
    if (warehouseNo && storageAreaNo && giDate3) {
        $('#btnAdd').linkbutton('enable');
    } else {
        $('#btnAdd').linkbutton('disable');
    }
    if (giDocumentNo) {
        setTimeout("$('#btnAdd').linkbutton('disable')", 500)
    }
}

/** 刷新列表数据 */
function reload_() {
    $("#dg2").datagrid("reload");
}

function getEditorValue(index) {
    var ed = $("#dg2").datagrid('getEditor', {index: index, field: 'PART_NUMBER'});
    var pn = $(ed.target).combobox('getValue');
    return pn;
}

function faliao() {
    giDocumentNo = '';
    status = '';

    $('#form2').form('clear');
    $('#ffsearch').form('clear');
    $('#baocun').show();
    $("#giDate3").datebox({editable: false, onlyview: false, value: formatterDate(new Date())});
    $("#giType2").combobox({editable: false, onlyview: false});
    $("#giUse2").combobox({editable: false, onlyview: false});
    $("#acno2").textbox({editable: true, onlyview: false, validType: ['maxLength[30]']});
    $("#refDocumentNo2").textbox({editable: true, onlyview: false, validType: ['maxLength[30]']});
    $("#receiveMan1").textbox({editable: true, onlyview: false, validType: ['maxLength[30]']});
    $("#receiveDept").textbox({editable: true, onlyview: false, validType: ['maxLength[30]']});
    $("#giMan2").textbox({editable: true, onlyview: false, validType: ['maxLength[30]']});
    $("#warehouseNo").combobox({editable: false, onlyview: false});
    $("#storageAreaNo").combobox({editable: false, onlyview: false});
    $("#acno2").textbox({required: false});
    InitDataGrid2();
    $('#tt').tabs('select', '航材发料');
}

function showWindow(index2, partAttr) {
    ShowWindowIframe({
        width: 815,
        height: 300,
        title: '库存信息',
        param: {data: "SERIAL_NUMBER", INDEX: index2, PART_ATTR: partAttr},
        url: '/views/mm/vendor/mmissue/mm_issueserial_list.shtml'
    });
}

function showWindow2(index2, partAttr) {
    ShowWindowIframe({
        width: 815,
        height: 300,
        title: '库存信息',
        param: {data: "BATCH_NO", INDEX: index2, PART_ATTR: partAttr},
        url: '/views/mm/vendor/mmissue/mm_issueserial_list.shtml'
    });
}
