var PAGE_DATA = {};
var isEdit_;
var param = {};
var inspectType = {};
var airInspectResult = {};
var userName = {};
var purchaseType = {};
var tempGrDocumentNo;
var detain = {};
var flag;
var isBrowse = true;
var isCopy = false;
var isTemp = false;
var isClear = false;
var sbInit;
var vendorName;

function i18nCallBack() {
    InitFuncCodeRequest_({
        data: {
            domainCode: "MM_INSPECT_TYPE,MM_BIZ_INSPECT_RESULT,USER_NAME,MM_WAREHOUSE_NO,MM_DIC_BASE_UNIT,MM_PART_CONDITION," +
                "MM_PROPERTY_TYPE,MM_RESPONSIBLE_PARTY,MM_WORK_TYPE,MM_DIC_PART_ATTR,MM_PURCHASE_TYPE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['userName'] = DomainCodeToMap_(jdata.data["USER_NAME"]);
                PAGE_DATA['inspectType'] = DomainCodeToMap_(jdata.data["MM_INSPECT_TYPE"]);
                PAGE_DATA['airInspectResult'] = DomainCodeToMap_(jdata.data["MM_BIZ_INSPECT_RESULT"]);
                PAGE_DATA['purchaseType'] = DomainCodeToMap_(jdata.data["MM_PURCHASE_TYPE"]);
                $('#inspectType').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_INSPECT_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#inspectType1').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_INSPECT_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#checkType').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_INSPECT_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#partAttr').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_DIC_PART_ATTR,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#warehouseNo').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_WAREHOUSE_NO,
                    valueField: 'VALUE',
                    textField: 'VALUE'
                });
                $('#warehouseNo1').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_WAREHOUSE_NO,
                    valueField: 'VALUE',
                    textField: 'VALUE',
                    onSelect: function () {
                        var warehouseNo = $(this).combobox('getValue');
                        checkWareHouseNo(warehouseNo);
                    }
                });
                $('#bizInspectResult').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_BIZ_INSPECT_RESULT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#bizInspectResult1').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_BIZ_INSPECT_RESULT,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function () {
                        var bizInspectResult = $(this).combobox('getValue');
                        var actualPartNo = $('#actualPartNo').textbox('getValue');
                        var actualSerialNumber = $('#actualSerialNumber').textbox('getValue');
                        var batchNo = $('#batchNo').textbox('getValue');
                        if (bizInspectResult == 'KC') {
                            $('#airInspectResult1').combobox('setValue', '');


                            common_add_edit_({
                                isEdit: 0, width: 1350, height: 600, title: '航材扣查信息',
                                param: {
                                    bizInspectResult: bizInspectResult, actualPartNo: actualPartNo,
                                    actualSerialNumber: actualSerialNumber, batchNo: batchNo,
                                    airInspectResult: airInspectResult
                                },
                                url: "/views/mm/warehouse/check/mm_detention_add_edit.shtml"

                            });
                        }
//                                disableCert(bizInspectResult);
                    }
                });
                $('#airInspectResult').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_BIZ_INSPECT_RESULT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#airInspectResult1').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_BIZ_INSPECT_RESULT,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function () {
                        var bizInspectResult = "";
                        var airInspectResult = $(this).combobox('getValue');
                        var actualPartNo = $('#actualPartNo').textbox('getValue');
                        var actualSerialNumber = $('#actualSerialNumber').textbox('getValue');
                        var batchNo = $('#batchNo').textbox('getValue');
                        var inspectType = $('#inspectType1').combobox('getValue');
                        if (airInspectResult == 'KC') {
                            var bizInspectResult1 = $('#bizInspectResult1').combobox('getValue');
                            if (bizInspectResult1 == 'KC') {
                                MsgAlert({content: '不允许选择扣查', type: 'error'});
                                $('#airInspectResult1').combobox('setValue', '');
                            } else {
                                common_add_edit_({
                                    isEdit: 0, width: 1350, height: 600, title: '航材扣查信息',
                                    param: {
                                        bizInspectResult: bizInspectResult, actualPartNo: actualPartNo,
                                        actualSerialNumber: actualSerialNumber, batchNo: batchNo,
                                        airInspectResult: airInspectResult
                                    },
                                    url: "/views/mm/warehouse/check/mm_detention_add_edit.shtml"
                                })
                            }
//                                    disableReturnConfirm();
                        } else {
                            if (inspectType == 'XLDH' || inspectType == 'JCDH') {
                                enableReturnConfirm();
                            } else {
                                enableReturnConfirm();
                            }
                        }
                    }
                });
                $('#orderUnit').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_DIC_BASE_UNIT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#orderUnit').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_DIC_BASE_UNIT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#inspectUnit').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_DIC_BASE_UNIT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#partCondition').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_PART_CONDITION,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#propertyType').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_PROPERTY_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#bizDiffResponsibleParty').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_RESPONSIBLE_PARTY,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#airDiffResponsibleParty').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_RESPONSIBLE_PARTY,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#workType').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_WORK_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                isBrowse = false;
                InitCheckIngoDataGrid();
                InitCheckInputDataGrid();
                getTempGrDocumentNo();
                setTimeout("submitForm_()", 1000);
            }
            InitCertDataGrid();
        }
    });
    $('#tt').tabs({
        onSelect: function (title) {
            if (title == '航材检验清单') {

                InitCheckIngoDataGrid;
                isBrowse = false;
                isCopy = false;
                enableForm_(isBrowse, isCopy);
                $('#orderNo').textbox({value: ''});
                $('#partNo').textbox({value: ''});
                $('#serialNumber').textbox({value: ''});
                dgSearch_();
            } else {
                if (!isBrowse) {
                    $("#bizInspectDate").datebox({value: formatDate(new Date())});
                    $("#bizInspector").textbox({value: getLoginInfo().userName});
                    $("#airInspectDate").datebox({value: formatDate(new Date())});
                    $("#airInspector").textbox({value: getLoginInfo().userName});
                }
            }
        }
    });

    //TAB2检验单录入下:点击TAB2，TAB3，初始化质量证书检查，返回件确认列表
    $('#aa').tabs({
        onSelect: function (title) {
            if (title == '质量证书检查') {
                InitCertDataGrid();
            } else if (title == '返回件确认') {
                InitSbDataGrid();
                var row = getDG("dg01").datagrid('getSelected');
                if (row) {
                    if (row.ORDER_TYPE == 'PTXL' || row.ORDER_TYPE == 'GDBX' || row.ORDER_TYPE == 'XSBX') {
                        var actualSerialNumber = $('#actualSerialNumber').textbox('getValue');
                        var actualPartNo = $('#actualPartNo').textbox('getValue');
                        if (actualSerialNumber == null || actualSerialNumber == "") {
                            MsgAlert({content: "请填写到货序号,获取附件的飞行记录", type: 'error'});
                        } else if (actualPartNo == null || actualPartNo == "") {
                            MsgAlert({content: "请填写到货件号,获取附件的飞行记录", type: 'error'});
                        } else if ((actualSerialNumber == null || actualSerialNumber == "") && (actualPartNo == null || actualPartNo == "")) {
                            MsgAlert({content: "请填写到货件号和到货序号,获取附件的飞行记录", type: 'error'});
                        } else {
                            InitFuncCodeRequest_({
                                data: {
                                    actualPartNo: actualPartNo,
                                    actualSerialNumber: actualSerialNumber,
                                    FunctionCode: "MM_FLIGHT_RECORD"
                                },
                                successCallBack: function (jdata) {
                                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                        $('#tsr').numberbox({value: jdata.data.tsr ? jdata.data.tsr : "0"});
                                        $('#tso').numberbox({value: jdata.data.tso ? jdata.data.tso : "0"});
                                        $('#tsn').numberbox({value: jdata.data.tsn ? jdata.data.tsn : "0"});
                                        $('#tsi').numberbox({value: jdata.data.tsi ? jdata.data.tsi : "0"});
                                        $('#tst').numberbox({value: jdata.data.tst ? jdata.data.tst : "0"});

                                        $('#csr').numberbox({value: jdata.data.csr ? jdata.data.csr : "0"});
                                        $('#cso').numberbox({value: jdata.data.cso ? jdata.data.cso : "0"});
                                        $('#csn').numberbox({value: jdata.data.csn ? jdata.data.csn : "0"});
                                        $('#csi').numberbox({value: jdata.data.csi ? jdata.data.csi : "0"});
                                        $('#cst').numberbox({value: jdata.data.cst ? jdata.data.cst : "0"});

                                        // $('#msr').numberbox({value: jdata.data.tsr? jdata.data.tsr :"0"});
                                        // $('#mso').numberbox({value: jdata.data.tsr? jdata.data.tsr :"0"});
                                        // $('#msn').numberbox({value: jdata.data.tsr? jdata.data.tsr :"0"});
                                        // $('#msi').numberbox({value: jdata.data.tsr? jdata.data.tsr :"0"});
                                        // $('#mst').numberbox({value: jdata.data.tsr? jdata.data.tsr :"0"});
                                    } else {
                                        MsgAlert({content: jdata.msg, type: 'error'});
                                    }
                                }
                            });
                        }
                    }
                }
            }
        }
    });
}


function successCallBack(dd) {

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

//航材检验清单列表
function InitCheckIngoDataGrid() {
    var identity = 'dg';
    $("#dg").MyDataGrid({
        identity: identity,

        sortable: true,
        columns: {
            param: {FunctionCode: 'MM_CHECK_INGO_LIST'},
            alter: {
                UPLOAD: {
                    formatter: function (value, row, index) {
                        if (row.UPLOAD) {
                            return '<a href="javascript:void(0);" rowindex="' + index + '" class="attach">' +
                                '<img src="/img/edit2.png" border="0" style="width:15px;height:15px;"/></a>'
                        }
                    }
                },
                INSPECT_TYPE: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['inspectType'][value];
                    }
                },
                BIZ_INSPECT_RESULT: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['airInspectResult'][value];
                    }
                },
                AIR_INSPECT_RESULT: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['airInspectResult'][value];
                    }
                },
                INPUTER: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['userName'][value];
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
                        data: {SOURCE_ID: row.GR_DOCUMENT_NO, CATEGORY: "CHECK", FunctionCode: 'ATTACHMENT_RSPL_GET'},
                        successCallBack: function (jdata) {
                            if (jdata.code == 200) {

                            }
                            var html = "";
                            for (var i = 0; i < jdata.data.length; i++) {

                                html += '<li><a target="_blank" onclick="downFile(' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a><span onclick="deleteFile(\'' + jdata.data[i].PKID + '\');return false;" class="icon-cross"></span></li>';
                            }
                            callback(html);
                        }
                    });
                }
            }, 'ident0');
            $("#dg").datagrid('doCellTip', {'max-width': '400px', 'delay': 500});
        },
        validAuth: function (row, items) {
            /*if(row.IF_CHECKED == 'Y'){
             items['mm_plan:RES.MM_QUOTE_LIST.CHECKED'].enable = false;
             items['mm_plan:RES.MM_QUOTE_LIST.CANCEL_CHECKED'].enable = true;
             }else{
             items['mm_plan:RES.MM_QUOTE_LIST.CHECKED'].enable = true;
             items['mm_plan:RES.MM_QUOTE_LIST.CANCEL_CHECKED'].enable = false;
             }*/
            return items;
        },
        contextMenus: [
            {
                id: "m-browse", i18nText: "common:RES.COMMON.BROWSE", auth: "MM_INSP_VIEW",
                onclick: function () {
                    var flag = false;
                    var rowdata = getDG(identity).datagrid('getSelected');
                    tempGrDocumentNo = rowdata.GR_DOCUMENT_NO;
                    browseOrCopy(tempGrDocumentNo, flag);
                    $('#checkType').combobox({editable: false, onlyview: true, value: rowdata.INSPECT_TYPE});
                    isBrowse = true;
                    isCopy = false;
                    sbInit = rowdata.EVALUATE_NO;
                }
            },
            {
                id: "m-uploadAttach", i18nText: "common:COMMON_OPERATION.UPLOAD", auth: "MM_INSP_UPL",
                onclick: function () {
                    var rowData = $("#dg").datagrid('getSelected');
                    common_upload_({
                        identity: identity,
                        param:
                            {
                                cat: 'CHECK',
                                sourceId: rowData.GR_DOCUMENT_NO,
                                PKID: "hahahahah",
                                successCallBack: "dg",
                                failCallBack: "dg"
                            }

                    });
                }
            },
            {
                id: "m-copy", i18nText: "common:RES.COMMON.COPY", auth: "MM_INSP_COPY",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    if (rowdata.IF_WRITEOFF == 'Y') {
                        MsgAlert({content: '该检验单是冲销检验单，不允许复制', type: 'error'});
                    } else if (rowdata.BIZ_INSPECT_RESULT != 'TG') {
                        MsgAlert({content: '该检验单未通过，不允许复制', type: 'error'});
                    }/*else if(rowdata.AIR_INSPECT_RESULT != 'TG' ){
                             MsgAlert({content: '该检验单未通过，不允许复制', type: 'error'});
                             }*/ else {
                        var flag = true;
                        isBrowse = false;
                        isCopy = true;
                        tempGrDocumentNo = rowdata.GR_DOCUMENT_NO;
                        browseOrCopy(tempGrDocumentNo, flag);
                    }
                }
            },
            {
                id: "", i18nText: "common:RES.COMMON.WRITE_OFF", auth: "MM_INSP_CANCEL",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    if (rowdata.BIZ_INSPECT_RESULT != 'TG') {
                        MsgAlert({content: '该检验单未通过，不允许冲销', type: 'error'});
                    } else if (rowdata.AIR_INSPECT_RESULT != 'TG') {
                        MsgAlert({content: '该检验单未通过，不允许冲销', type: 'error'});
                    } else {
                        InitFuncCodeRequest_({
                            data: {grDocumentNo: rowdata.GR_DOCUMENT_NO, FunctionCode: "MM_CHECK_INGO_WRITE_OFF"},
                            async: false,
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    reload_();
                                    dgSearch_();
                                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                } else {
                                    MsgAlert({content: jdata.msg, type: 'error'});
                                    return false;
                                }
                            }
                        });
                        //删除检验单冲销后MM_GR_COST_ACCOUNTING（采购）和MM_CHECK_PNCONT（修理）中数据也要分别删除。
                        /*   InitFuncCodeRequest_({
                               data: {
                                   grDocumentNo:rowdata.GR_DOCUMENT_NO,
                                   FunctionCode: "A6MM_CX_DEL_CGXL"
                               },
                               async: false,
                               successCallBack: function (jdata) {
   
                                   if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                       // MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                   } else {
                                       MsgAlert({content:jdata.msg , type: 'error'});
                                       return false;
                                   }
                               }
                           });*/
                    }
                }
            }
        ],
        resize: function () {
            return tabs_standard_resize($('#tt'), 62);
        }
    });
}

function successCallBack() {
    reload01_('dg');
    $("#cert").datagrid("reload");
}

//航材检验录入列表
function InitCheckInputDataGrid() {
    var identity = 'dg01';
    var checkType = $('#checkType').combobox('getValue');
    $("#dg01").MyDataGrid({
        identity: identity,
        sortable: true,
        firstLoad: false,
        queryParams: {checkType: checkType},
        loadFilter: function (jdata) {
            jdata.rows = toUnderlineCaseArray(jdata.rows);
            return jdata;
        },
        columns: {
            param: {FunctionCode: 'A6MM_CHECK_INPUT_LIST'},
            alter: {
                PART_CONDITION: {
                    formatter: function (value, row, index) {
                        switch (value) {
                            case "KY":
                                return "可用";
                            case "BKY":
                                return "不可用";
                            case "GCDD":
                                return "观察待定";
                        }
                    }
                },
                ORDER_TYPE: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['purchaseType'][value];
                    }
                }
            }
        },
        onClickRow: function (index, row) {
            vendorName = row.VENDOR_NAME;
            var itemNo = row.PART_NO;
            $("#itemNo").val(itemNo);
            var checkType = $('#checkType').combobox('getValue');
            if (checkType == 'KYTK') {
                // $('#refReturnNo').textbox({editable:false,onlyview:true,value:row.ORDER_NO});
                $('#refPo').textbox({value: row.ORDER_NO});
            } else if (checkType == 'CGDH' || checkType == 'XLDH' || checkType == 'JRDH' || checkType == 'DBDH') {
                $('#refPo').textbox({editable: false, onlyview: true, value: row.ORDER_NO});
                // $('#refReturnNo').textbox({editable:false,onlyview:true,value:''});
            }
            $('#evaluateNo').textbox({value: row.EVALUATE_NO});
            $('#actualPartNo').textbox({value: row.PART_NO});
            $('#inspectType1').combobox({editable: false, onlyview: true, value: checkType});
            $('#refPartNo').textbox({editable: false, onlyview: true, value: row.PART_NO});
            $('#refSerialNumber').textbox({editable: false, onlyview: true, value: row.SERIAL_NUMBER});
            $('#refQty').numberbox({editable: false, onlyview: true, value: row.QTY});
            $('#orderUnit').combobox({editable: false, onlyview: true, value: row.UNIT});
            $('#inspectUnit').combobox({editable: false, onlyview: true, value: row.UNIT});
            if (row.ORDER_TYPE == 'PTCG') {
                // $('#propertyType').combobox({editable:false,onlyview:true,value:'ZY'});
            } else if (row.ORDER_TYPE == 'JSCG') {
                // $('#propertyType').combobox({editable:false,onlyview:true,value:'JS'});
            } else if (row.ORDER_TYPE == 'ZP') {
                $('#propertyType').combobox({editable: false, onlyview: true, value: 'JR'});
            } else {
                $('#propertyType').combobox({editable: true, onlyview: false, required: true, value: ''});
            }
            if (checkType == 'XLDH' || checkType == 'JCDH') {
                enableReturnConfirm();
            } else {
                disableReturnConfirm();
            }
            var orderType = $('#checkType').combobox('getValue');
            console.log(orderType)
            //2017/12/20 注释掉
            //采购到货的检验要输入生产日期、出厂日期
            // if(orderType == 'CGDH'){
            //     $('#productionDate').datebox({required:true,editable:true});
            //     $('#factoryDate').datebox({required:true,editable:true});
            // }else{
            //     $('#productionDate').datebox({required:false,editable:true});
            //     $('#factoryDate').datebox({required:false,editable:true});
            // }

            //修理到货的检验要输入修理日期
            if (orderType == 'XLDH') {
                $('#repairDate').datebox({required: true, editable: true});
            } else {
                $('#repairDate').datebox({required: false, editable: true});
            }

            isTemp = true;
            getTempGrDocumentNo(isTemp);
            checkInfo(row.PART_NO, row.ORDER_NO, row.SERIAL_NUMBER);
            InitCertDataGrid();
            InitSbDataGrid();
        },
        resize: function () {
            return tabs_standard_resize($('#tt'), 180, 18);
        }
    });
}

//质量证书列表
function InitCertDataGrid() {
    var identity = 'cert';
    $("#cert").MyDataGrid({
        identity: identity,

        sortable: true,
        queryParams: {tempGrDocumentNo: tempGrDocumentNo},
        columns: {
            param: {FunctionCode: 'MM_CERT_DESC_LIST'},
            alter: {
                'CERT_TYPE': {
                    editor: {
                        type: 'combobox',
                        options: {
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "MM_CERT_TYPE"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: false,
                            panelHeight: '150',
                            loadFilter: function (jdata) {
                                return jdata.data.MM_CERT_TYPE;
                            },
                            tipPosition: 'top'
                        }
                    }, formatter: function (value) {
                        return value;
                    }
                },
                'CERT_NO': {
                    editor: {
                        type: 'textbox',
                        options: {tipPosition: 'top', required: true, validType: ['maxLength[60]']}
                    }
                },
                'CERT_UNTIL_TO': {
                    editor: {type: 'datebox', options: {tipPosition: 'top'}}
                },
                'CERT_IF_PASS': {
                    editor: {type: 'checkbox', options: {on: 'Y', off: 'N', ontxt: '是', offtxt: '否'}}
                },
                'CERT_MEMO': {
                    editor: {type: 'textbox', options: {tipPosition: 'top', validType: ['maxLength[200]']}}
                },
                INPUTER: {
                    formatter: function (value, row, index) {
                        return userName[value];
                    }
                },
                UPLOAD: {
                    formatter: function (value, row, index) {
                        if (row.UPLOAD) {
                            return '<a href="javascript:void(0);" rowindex="' + index + '" class="attach1">' +
                                '<img src="/img/edit2.png" border="0" style="width:15px;height:15px;"/></a>'
                        }
                    }
                }
            }
        },
        onLoadSuccess: function () {
            InitSuspend('a.attach1', {
                'onmouseover': function (thiz, event, callback) {
                    var index = $(thiz).attr("rowindex");
                    var row = $("#cert").datagrid('getRows')[index];
                    InitFuncCodeRequest_({
                        data: {SOURCE_ID: row.PKID, CATEGORY: "MMCERTDESC", FunctionCode: 'ATTACHMENT_RSPL_GET'},
                        successCallBack: function (jdata) {
                            if (jdata.code == 200) {

                            }
                            var html = "";
                            for (var i = 0; i < jdata.data.length; i++) {

                                html += '<li><a target="_blank" onclick="downFile(' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a><span onclick="deleteFile(\'' + jdata.data[i].PKID + '\');return false;" class="icon-cross"></span></li>';
                            }
                            callback(html);
                        }
                    });
                }
            }, 'ident1');
            $("#cert").datagrid('doCellTip', {'max-width': '400px', 'delay': 500});
        },
        enableLineEdit: isBrowse ? false : true,
        onBeginEdit: function (index, row) {

        },
        onEndEdit: function (index, row, changes) {
            row = toCamelCase(row);
            if ((typeof (row.isadd__) == 'undefined') || (row.isadd__ == 1 && row.___editcount > 1)) {
                row = $.extend({}, row, {FunctionCode: 'MM_CERT_DESC_EDIT'});
            } else {
                row = $.extend({}, row, {FunctionCode: 'MM_CERT_DESC_ADD'});
                row['tempGrDocumentNo'] = tempGrDocumentNo;
            }
            InitFuncCodeRequest_({
                data: row,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        $("#cert").datagrid("reload");
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
        },
        contextMenus: [
            {
                id: "m-delete", i18nText: "common:COMMON_OPERATION.DEL", auth: "",
                onclick: function () {
                    common_delete_({
                        identity: identity,
                        cfmI18next: "msg_tip:TIP.COMMON.DEL_CONFIRM",
                        param: {pkid: "PKID"},
                        FunctionCode: "MM_CERT_DESC_DEL"
                    });
                }
            },
            {
                id: "m-uploadAttach", i18nText: "common:COMMON_OPERATION.UPLOAD", auth: "",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');

                    common_upload_({
                        identity: identity,
                        param: {
                            cat: 'MMCERTDESC',
                            sourceId: rowdata.PKID,
                            PKID: "hahahahah",
                            successCallBack: "aa",
                            failCallBack: "bb"
                        }
                    })
                }
            }
        ],
        validAuth: function (row, items) {
            if (isBrowse) {
                items['common:COMMON_OPERATION.UPLOAD'].enable = false;
                items['common:COMMON_OPERATION.DEL'].enable = false;
            } else {
                items['common:COMMON_OPERATION.UPLOAD'].enable = true;
                items['common:COMMON_OPERATION.DEL'].enable = true;
            }
            return items;
        },

        resize: function () {
            return {
                height: 310,
                width: 700
            };
        }
    });
}

//sb列表
function InitSbDataGrid() {
    var evaluateNo = "";
    var identity = 'sb';
    if (isBrowse) {
        tempGrDocumentNo = tempGrDocumentNo;
    }
    if (isCopy) {
        tempGrDocumentNo = '';
    }

    var row = getDG("dg01").datagrid('getSelected');

    if (row) {
        evaluateNo = row.EVALUATE_NO == null ? "" : row.EVALUATE_NO.split(",");
    } else {
        evaluateNo = sbInit == null ? "" : sbInit.split(",");
    }


    var str = null;
    for (var i = 0; i < evaluateNo.length; i++) {
        if (evaluateNo.length == 1) {
            str = "(\'" + evaluateNo[i] + "\')";
        } else {
            if (i == 0) {
                str = "(\'" + evaluateNo[i] + "\',\'";
            } else {
                if (i == (evaluateNo.length - 1)) {
                    str += evaluateNo[i] + "\')";
                } else {
                    str += evaluateNo[i] + "\',\'";
                }
            }
        }
    }
    console.log(str);
    $("#sb").MyDataGrid({
        identity: identity,
        fit: true,
        sortable: true,
        queryParams: {tempGrDocumentNo: str},
        columns: {
            param: {FunctionCode: 'MM_SB_LIST'},
            alter: {
                'SB_NO': {
                    editor: {
                        type: 'textbox',
                        options: {tipPosition: 'top', required: true, validType: ['maxLength[60]']}
                    }
                },
                'SB_VER': {
                    editor: {
                        type: 'textbox',
                        options: {tipPosition: 'top', required: true, validType: ['maxLength[10]']}
                    }
                },
                'IF_EXECUTE': {
                    editor: {type: 'checkbox', options: {on: 'Y', off: 'N', ontxt: '是', offtxt: '否'}}
                },
                'IF_EXTRA': {
                    editor: {type: 'checkbox', options: {on: 'Y', off: 'N', ontxt: '是', offtxt: '否'}}
                },
                INPUTER: {
                    formatter: function (value, row, index) {
                        return userName[value];
                    }
                }
            }
        },
        enableLineEdit: isBrowse ? false : true,
        onBeginEdit: function (index, row) {

        },
        onEndEdit: function (index, row, changes) {
            row = toCamelCase(row);

            if ((typeof (row.isadd__) == 'undefined') || (row.isadd__ == 1 && row.___editcount > 1)) {
                row = $.extend({}, row, {FunctionCode: 'MM_SB_EDIT'});
            } else {
                row = $.extend({}, row, {FunctionCode: 'MM_SB_ADD'});
                row['evaluateNo'] = evaluateNo;
            }
            InitFuncCodeRequest_({
                data: row,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        reload01_(identity);
                        // dgSearch_();
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
        },
        resize: function () {
            return {
                height: 300,
                width: 600
            };
        }

    });
}

//航材检验单查询
function doSearch_() {
    var fromId = '#ffSearch';
    var queryParams = $(fromId).serializeObject();
    var dgopt = getDgOpts('dg');
    var url = dgopt.url;
    var $dg = $(dgopt.owner);
    $dg.datagrid({
        url: url,
        queryParams: queryParams
    });
}

//航材检验输入查询
function dgSearch_() {
    var fromId = '#mform01';
    var queryParams = $(fromId).serializeObject();
    var dgopt = getDgOpts('dg01');
    var url = dgopt.url;
    var $dg = $(dgopt.owner);
    $dg.datagrid({
        url: url,
        queryParams: queryParams
    });
}

/** 刷新检验清单列表数据 */
function reload_() {
    $("#dg").datagrid("reload");
}

/** 刷新检验录入列表数据 */
function reload01_(ident) {
    getDG(ident).datagrid('reload');
}

/** 检验按钮 */
function checkInfo_() {
    isBrowse = false;
    isCopy = false;
    enableForm_(isBrowse, isCopy);
    $('#orderNo').textbox({value: ''});
    $('#partNo').textbox({value: ''});
    $('#serialNumber').textbox({value: ''});
    dgSearch_();
    $('#tt').tabs('select', '航材检验录入');
    if (!isBrowse) {
        $("#bizInspectDate").datebox({value: formatDate(new Date())});
        $("#bizInspector").textbox({value: getLoginInfo().userName});
        $("#airInspectDate").datebox({value: formatDate(new Date())});
        $("#airInspector").textbox({value: getLoginInfo().userName});
    }

    $("#batchNoSys").textbox({editable: false, onlyview: true});
}

//上传证书信息
/*function uploadCert() {
    var identity = 'cert';
    common_upload_({
        identity: identity,
        param: {successCallBack: "aa", failCallBack: "bb"}
    });
}*/

//增加证书
function addCert() {
    $('#cert').datagrid('appendRow', {isadd__: 1});
}

//增加sb
function addSB() {
    $('#sb').datagrid('appendRow', {isadd__: 1});
}

//临时检验单编号
function getTempGrDocumentNo(isTemp) {
    if (isTemp) {
        InitFuncCodeRequest_({
            data: {FunctionCode: "MM_CHECK_INPUT_TEMP"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    tempGrDocumentNo = jdata.data;
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }
}

//检查合同上的仓库号是否和外观商务检查的仓库号相同
function checkWareHouseNo(warehouseNo) {

    var refPo = $('#refPo').textbox('getValue');
    var refPartNo = $('#refPartNo').textbox('getValue');

    var refSerialNumber = $('#refSerialNumber').textbox('getValue');
    // var itemNo = $("#itemNo").val();
    console.log(itemNo);
    if (refPo != '' && refPartNo != '') {
        InitFuncCodeRequest_({
            data: {
                orderNo: refPo,
                partNo: refPartNo,
                refSerialNumber: refSerialNumber,
                FunctionCode: "MM_CHECK_WAREHOUSE_NO"
            },
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    if (jdata.data) {
                        if (warehouseNo != jdata.data.WAREHOUSE_NO) {
                            $.messager.confirm('', '选择的仓库号与合同上约定的仓库号不一致，是否继续检验？', function (r) {
                                if (r) {

                                } else {
                                    $(this).removeAttr('onclick');
                                    $("#btnSave").css({
                                        'color': '#FFF',
                                        'backgroundColor': '#d4d4d4',
                                        'border-color': '#ddd'
                                    });
                                }
                            });
                        }
                        $('#btnSave').attr('onclick', 'submitForm_();');
                        $("#btnSave").css({
                            'color': '#FFF',
                            'backgroundColor': '#1ab394',
                            'border-color': '#1ab394'
                        });
                    }
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }
}

//检查运单号，到货序号，是否消耗件
function checkInfo(partNo, poDocument, serialNumber) {
    InitFuncCodeRequest_({
        data: {partNo: partNo, poDocument: poDocument, serialNumber: serialNumber, FunctionCode: "MM_CHECK_INFO"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data.GET_WAYBILL_NO.data) {
                    var waybillNos = '';
                    $.each(jdata.data.GET_WAYBILL_NO.data, function (k, it) {
                        waybillNos = waybillNos + it.WAYBILL_NO + ";";
                    });
                    waybillNos = waybillNos.substring(0, waybillNos.lastIndexOf(";"));
                    $('#refAwb').textbox({editable: false, onlyview: true, value: waybillNos});
                } else {
                    $('#refAwb').textbox({editable: false, onlyview: true, value: ''});
                }
                if (jdata.data.CHECK_IF_SN) {

                    $('#partAttr').combobox({value: jdata.data.CHECK_IF_SN.data.PART_ATTR});
                    if (jdata.data.CHECK_IF_SN.IF_SN == 'Y') {
                        $('#actualSerialNumber').textbox({required: true});
                    } else {
                        $('#actualSerialNumber').textbox({required: false});
                    }
                } else {
                    $('#actualSerialNumber').textbox({required: false});
                }
                /*  if(jdata.data.CHECK_PART_ATTR){
                 if(jdata.data.CHECK_PART_ATTR.PART_ATTR == 'C'){
                 $('#batchNo').textbox({required:true});
                 }else{
                 $('#batchNo').textbox({required:false});
                 }
                 }else{
                 $('#batchNo').textbox({required:false});
                 }*/
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function tanchuang() {
    layerConfirm_({
        content: '您选择的修理级别跟评估时不一致，是否继续保存？',
        yesFunc: function () {


            var $form = $("#mform02");
            var $form1 = $("#mform03");
            var $form2 = $("#mform04");
            var $form3 = $("#mform05");
            var isValidate = $form.form('validate');
            if (!isValidate) {
                return false;
            }
            var data = $form.serializeObject();


            if ($('input:radio[name="ifOriginal"]:checked').length == 0 && $('#checkType').combobox('getValue') == 'XLDH') {
                MsgAlert({content: "修理到货检验中返回确认件的［是否原件返回］未设置", type: 'error'});
                return false;
            }
            var isValidate1 = $form1.form('validate');
            if (!isValidate1) {
                return false;
            }
            var data1 = $form1.serializeObject();
            var data2 = $form2.serializeObject();
            var data3 = $form3.serializeObject();
            data = $.extend({}, data, data1, data2, data3, {FunctionCode: 'MM_CHECK_INPUT_ADD'});
            data['tempGrDocumentNo'] = tempGrDocumentNo;
            var bizInspectResult = $('#bizInspectResult1').combobox('getValue');
            var airInspectResult = $('#airInspectResult1').combobox('getValue');
            if (bizInspectResult == 'KC') {
                data['detain'] = JSON.stringify(detain);
            }
            if (airInspectResult == 'KC') {
                data['detain'] = JSON.stringify(detain);
            }
            var re = new RegExp("；", "g");
            var moreSerialNumber = $('#actualSerialNumber').textbox('getValue').replace(re, ";");
            var moreBatchNo = $('#batchNo').textbox('getValue').replace(re, ";");
            data['moreSerialNumber'] = moreSerialNumber;
            data['moreBatchNo'] = moreBatchNo;

            /*return false;*/
            /*  var rows = $('#cert').datagrid('getRows');
             var inspectType = $('#inspectType1').combobox('getValue');
             if(rows.length == 0 && (inspectType == 'CGDH' || inspectType == 'XLDH' || inspectType == 'JRDH')){
             MsgAlert({content: '请录入质量证书', type: 'error'});
             return false;
             }*/
            var checkType = $('#checkType').combobox('getValue');
            InitFuncCodeRequest_({
                data: data,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        $('#checkType').combobox('setValue', checkType);
                        $('#aa').tabs('select', '外观商务检查');
                        dgSearch_();
                        reload_();
                        clearForm();
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
        },
        noFunc: function () {
            $("#mform04").form('clear');
            return false;
        }

    });

}

//保存按钮
function submitForm_() {
    var refQty = parseInt($('#refQty').numberbox('getValue'));
    var inspectQty = parseInt($('#inspectQty').numberbox('getValue'));
    if (inspectQty > refQty) {
        $.messager.confirm('', '实际到货数量大于未检验总数量，请确认是否继续保存', function (r) {
            if (r) {
                baocun();
            }
        });
        return;
    }

    baocun();
    return false;
}

function baocun() {

    var row = getDG("dg01").datagrid('getSelected');

    if (!row) {
        return false;
    }

    // if(row.STATUS!='SPTG')
    // {
    //     MsgAlert({content: "只有状态为审批通过的合同才能进行检验", type: 'error'});
    //     return false;
    // }
    row.REPAIR_MARK = row.REPAIR_MARK == null ? "N" : row.REPAIR_MARK;
    row.OVERHAUL_MARK = row.OVERHAUL_MARK == null ? "N" : row.OVERHAUL_MARK;
    row.MODIFY_MARK = row.MODIFY_MARK == null ? "N" : row.MODIFY_MARK;
    row.TESTING_MARK = row.TESTING_MARK == null ? "N" : row.TESTING_MARK;
    row.WARRANTY_MARK = row.WARRANTY_MARK == null ? "N" : row.WARRANTY_MARK;
    var oracle = row.REPAIR_MARK + row.OVERHAUL_MARK + row.MODIFY_MARK + row.TESTING_MARK + row.WARRANTY_MARK;
    var repairMark = $(':checkbox[name=repairMark]').is(":checked") ? "Y" : 'N';
    var overhaulMark = $(':checkbox[name=overhaulMark]').is(":checked") ? "Y" : 'N';
    var modifyMark = $(':checkbox[name=modifyMark]').is(":checked") ? "Y" : 'N';
    var testingMark = $(':checkbox[name=testingMark]').is(":checked") ? "Y" : 'N';
    var warrantyMark = $(':checkbox[name=warrantyMark]').is(":checked") ? "Y" : 'N';
    var table = repairMark + overhaulMark + modifyMark + testingMark + warrantyMark;

    if (oracle != table) {
        tanchuang();
    } else {


        var $form = $("#mform02");
        var $form1 = $("#mform03");
        var $form2 = $("#mform04");
        var $form3 = $("#mform05");
        var isValidate = $form.form('validate');
        if (!isValidate) {
            return false;
        }
        var data = $form.serializeObject();


        if ($('input:radio[name="ifOriginal"]:checked').length == 0 && $('#checkType').combobox('getValue') == 'XLDH') {
            MsgAlert({content: "修理到货检验中返回确认件的［是否原件返回］未设置", type: 'error'});
            return false;
        }
        var isValidate1 = $form1.form('validate');
        if (!isValidate1) {
            return false;
        }
        var data1 = $form1.serializeObject();
        var data2 = $form2.serializeObject();
        var data3 = $form3.serializeObject();
        data = $.extend({}, data, data1, data2, data3, {FunctionCode: 'A6MM_CHECK_INPUT_ADD'});
        data['tempGrDocumentNo'] = tempGrDocumentNo;
        var bizInspectResult = $('#bizInspectResult1').combobox('getValue');
        var airInspectResult = $('#airInspectResult1').combobox('getValue');
        if (bizInspectResult == 'KC') {
            data['detain'] = JSON.stringify(detain);
        }
        if (airInspectResult == 'KC') {
            data['detain'] = JSON.stringify(detain);
        }
        var re = new RegExp("；", "g");
        var moreSerialNumber = $('#actualSerialNumber').textbox('getValue').replace(re, ";");
        var moreBatchNo = $('#batchNo').textbox('getValue').replace(re, ";");
        var orderNo = $('#refPo').textbox('getValue').replace(re, ";");
        // var refReturnNo = $('#refReturnNo').textbox('getValue').replace(re, ";");
        data['moreSerialNumber'] = moreSerialNumber;
        data['moreBatchNo'] = moreBatchNo;
        data['orderNo'] = orderNo;
        data['vendorName'] = vendorName;
        // data['refReturnNo'] = refReturnNo;

        /*return false;*/
        /*  var rows = $('#cert').datagrid('getRows');
         var inspectType = $('#inspectType1').combobox('getValue');
         if(rows.length == 0 && (inspectType == 'CGDH' || inspectType == 'XLDH' || inspectType == 'JRDH')){
         MsgAlert({content: '请录入质量证书', type: 'error'});
         return false;
         }*/
        var checkType = $('#checkType').combobox('getValue');
        InitFuncCodeRequest_({
            data: data,
            successCallBack: function (jdata) {

                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    $('#checkType').combobox('setValue', checkType);
                    $('#aa').tabs('select', '外观商务检查');
                    dgSearch_();
                    reload_();
                    clearForm();
                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }
}

//浏览/复制
function browseOrCopy(grDocumentNo, flag) {
    InitFuncCodeRequest_({
        data: {grDocumentNo: grDocumentNo, FunctionCode: "MM_CHECK_INGO_BROWSE"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                clearForm();
                ParseFormField_(jdata.data, null, Constant.CAMEL_CASE);
                if (isBrowse) {
                    $("#bizInspector").textbox({editable: false, onlyview: true, value: jdata.data.BIZ_INSPECTOR});
                    $("#airInspector").textbox({editable: false, onlyview: true, value: jdata.data.AIR_INSPECTOR});
                    $('#bizInspectDate').datebox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.BIZ_INSPECT_DATE
                    });
                    $('#airInspectDate').datebox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.AIR_INSPECT_DATE
                    });
                }
                if (flag) {
                    isCopy = true;
                    isBrowse = false;
                    isTemp = true;
                    getTempGrDocumentNo(isTemp);
                    $("#actualPartNo").textbox({value: ''});
                    $("#actualSerialNumber").textbox({value: ''});
                    $("#batchNo").textbox({value: ''});
                    $("#inspectQty").numberbox({value: ''});
                    $('#productionDate').datebox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.PRODUCTION_DATE
                    });
                    $('#factoryDate').datebox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.FACTORY_DATE
                    });
                    $('#stockLife').datebox({editable: true, onlyview: false, value: jdata.data.STOCK_LIFE});
                    $('#repairDate').datebox({editable: true, onlyview: false, value: jdata.data.REPAIR_DATE});
                    $('#scrapDate').datebox({editable: true, onlyview: false, value: jdata.data.SCRAP_DATE});
                    $("#bizInspector").textbox({editable: false, onlyview: true, value: jdata.data.BIZ_INSPECTOR});
                    $("#airInspector").textbox({editable: false, onlyview: true, value: jdata.data.AIR_INSPECTOR});
                    /*  $("#bizInspectDate").datebox({value:jdata.data.BIZ_INSPECT_DATE});
                     $("#airInspectDate").datebox({value:jdata.data.AIR_INSPECT_DATE});*/
                    $('#warrantyLife').datebox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.WARRANTY_LIFE
                    });
                    $('#bizInspectDate').datebox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.BIZ_INSPECT_DATE
                    });
                    $('#airInspectDate').datebox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.AIR_INSPECT_DATE
                    });
                    $("#warehouseNo1").combobox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.WAREHOUSE_NO
                    });
                    $("#inspectType1").combobox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.INSPECT_TYPE
                    });
                    $("#inspectUnit").combobox({editable: true, onlyview: false, value: ''});
                    $("#partCondition").combobox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.PART_CONDITION
                    });
                    $("#propertyType").combobox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.PROPERTY_TYPE
                    });
                    $("#bizInspectResult1").combobox({editable: true, onlyview: false, value: ''});
                    $("#bizDiffResponsibleParty").combobox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.BIZ_DIFF_RESPONSIBLE_PARTY
                    });
                    $("#airInspectResult1").combobox({editable: true, onlyview: false, value: ''});
                    $("#airDiffResponsibleParty").combobox({
                        editable: true,
                        onlyview: false,
                        value: jdata.data.AIR_DIFF_RESPONSIBLE_PARTY
                    });
                    $("#workType").combobox({editable: true, onlyview: false, value: jdata.data.WORK_TYPE});
                    $("#batchNoSys").textbox({editable: false, onlyview: true, value: jdata.data.BATCH_NO_SYS});
                    enableForm_(isBrowse, isCopy);
                } else {
                    $("#batchNoSys").textbox({editable: false, onlyview: true, value: jdata.data.BATCH_NO_SYS});
                    $('#productionDate').datebox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.PRODUCTION_DATE
                    });
                    $('#factoryDate').datebox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.FACTORY_DATE
                    });
                    $('#stockLife').datebox({editable: false, onlyview: true, value: jdata.data.STOCK_LIFE});
                    $('#repairDate').datebox({editable: false, onlyview: true, value: jdata.data.REPAIR_DATE});
                    $('#scrapDate').datebox({editable: false, onlyview: true, value: jdata.data.SCRAP_DATE});
                    $('#warrantyLife').datebox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.WARRANTY_LIFE
                    });
                    $('#bizInspectDate').datebox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.BIZ_INSPECT_DATE
                    });
                    $('#airInspectDate').datebox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.AIR_INSPECT_DATE
                    });
                    $("#warehouseNo1").combobox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.WAREHOUSE_NO
                    });
                    $("#inspectType1").combobox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.INSPECT_TYPE
                    });
                    $("#inspectUnit").combobox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.INSPECT_UNIT
                    });
                    $("#partCondition").combobox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.PART_CONDITION
                    });
                    $("#propertyType").combobox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.PROPERTY_TYPE
                    });
                    $("#bizInspectResult1").combobox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.BIZ_INSPECT_RESULT
                    });
                    $("#bizDiffResponsibleParty").combobox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.BIZ_DIFF_RESPONSIBLE_PARTY
                    });
                    $("#airInspectResult1").combobox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.AIR_INSPECT_RESULT
                    });
                    $("#airDiffResponsibleParty").combobox({
                        editable: false,
                        onlyview: true,
                        value: jdata.data.AIR_DIFF_RESPONSIBLE_PARTY
                    });
                    $("#workType").combobox({editable: false, onlyview: true, value: jdata.data.WORK_TYPE});
                    if (jdata.data.REPAIR_MARK == 'Y') {
                        $(':checkbox[name=repairMark]').prop('checked', true);
                    }
                    if (jdata.data.OVERHAUL_MARK == 'Y') {
                        $(':checkbox[name=overhaulMark]').prop('checked', true);
                    }
                    if (jdata.data.MODIFY_MARK == 'Y') {
                        $(':checkbox[name=modifyMark]').prop('checked', true);
                    }
                    if (jdata.data.TESTING_MARK == 'Y') {
                        $(':checkbox[name=testingMark]').prop('checked', true);
                    }
                    if (jdata.data.WARRANTY_MARK == 'Y') {
                        $(':checkbox[name=warrantyMark]').prop('checked', true);
                    }
                    if (jdata.data.IF_ORIGINAL == 'Y') {
                        $("#ifOriginal1").prop("checked", true);
                    } else if (jdata.data.IF_ORIGINAL == 'N') {
                        $("#ifOriginal2").prop("checked", true);
                    }
                    if (jdata.data.IF_NFF == 'Y') {
                        $("#ifNff1").prop("checked", true);
                    } else if (jdata.data.IF_NFF == 'N') {
                        $("#ifNff2").prop("checked", true);
                    } else if (jdata.data.IF_NFF == 'D') {
                        $("#ifNff3").prop("checked", true);
                    }
                    if (jdata.data.IF_ROGUE == 'Y') {
                        $("#ifRogue1").prop("checked", true);
                    } else if (jdata.data.IF_ROGUE == 'N') {
                        $("#ifRogue2").prop("checked", true);
                    } else if (jdata.data.IF_ROGUE == 'D') {
                        $("#ifRogue3").prop("checked", true);
                    }
                    // if(jdata.data.SB_IF_FINISH == 'Y'){
                    //     $("#sbIfFinish1").prop("checked",true);
                    // }else if(jdata.data.SB_IF_FINISH == 'N'){
                    //     $("#sbIfFinish2").prop("checked",true);
                    // }else if(jdata.data.SB_IF_FINISH == 'D'){
                    //     $("#sbIfFinish3").prop("checked",true);
                    // }
                    isBrowse = true;
                    disableForm_(isBrowse);
                }
                if (jdata.data.PACK_IF_OK == 'Y') {
                    $(':checkbox[name=packIfOk]').prop('checked', true);
                }
                if (jdata.data.SURFACE_IF_OK == 'Y') {
                    $(':checkbox[name=surfaceIfOk]').prop('checked', true);
                }
                if (jdata.data.IF_MATCH_PO == 'Y') {
                    $(':checkbox[name=ifMatchPo]').prop('checked', true);
                }
                if (jdata.data.IF_FJD == 'Y') {
                    $(':checkbox[name=ifFjd]').prop('checked', true);
                }
                if (jdata.data.IF_WXP == 'Y') {
                    $(':checkbox[name=ifWxp]').prop('checked', true);
                }
                if (jdata.data.CERT_IF_OK == 'Y') {
                    $(':checkbox[name=certIfOk]').prop('checked', true);
                }
                InitCertDataGrid();
                InitSbDataGrid();
                $('#tt').tabs('select', '航材检验录入');
                $('#orderNo').textbox({value: jdata.data.REF_PO});
                $('#partNo').textbox({value: jdata.data.REF_PART_NO});
                $('#serialNumber').textbox({value: jdata.data.REF_SERIAL_NUMBER});
                $('#checkType').combobox({value: jdata.data.INSPECT_TYPE});
                dgSearch_();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    })
}

//清空表单数据
function clearForm() {
    $("#mform02").form('clear');
    $("#mform03").form('clear');
    $("#mform04").form('clear');
    $("#mform05").form('clear');
    if (!isBrowse) {
        $("#bizInspectDate").datebox({value: formatDate(new Date())});
        $("#bizInspector").textbox({value: getLoginInfo().userName});
        $("#airInspectDate").datebox({value: formatDate(new Date())});
        $("#airInspector").textbox({value: getLoginInfo().userName});
    }

}

function showDetail(isBrowse) {
    if (isBrowse) {
        $("*[item=btnItem]").each(function () {
            $(this).removeAttr('onclick');
            $(this).css('color', 'grey');
        });
        $("#btnSave").css({'color': '#FFF', 'backgroundColor': '#d4d4d4', 'border-color': '#ddd'});
    } else {
        clearForm();
        tempGrDocumentNo = '';
        InitCertDataGrid();
        InitSbDataGrid();
    }
}

//不可编辑
function disableForm_(isBrowse) {
    showDetail(isBrowse);

    $(":checkbox[item=checkItem]").each(function () {
        $(this).prop('disabled', true)
    });

    $(":radio[item=radioItem]").each(function () {
        $(this).prop('disabled', true)
    });

    $("#tab2 *[textboxname]").each(function (k, it) {
        if ($(it).hasClass("textbox-f")) {
            $(it).textbox({editable: false, onlyview: true, required: false});
        }
    });
}

//可编辑
function enableForm_(isBrowse, isCopy) {
    if (!isBrowse && !isCopy) {
        showDetail(isBrowse);
    }

    $(":checkbox[item=checkItem]").each(function () {
        $(this).prop('disabled', false)
    });

    $(":radio[item=radioItem]").each(function () {
        $(this).prop('disabled', false)
    });

    if (!isCopy) {
        $("*table [textboxname]").each(function (k, it) {
            if ($(it).hasClass("combobox-f")) {
                $(it).combobox({editable: true, onlyview: false, value: ''});
            }
            if ($(it).hasClass("textbox-f")) {
                $(it).textbox({editable: true, onlyview: false});
            }
            if ($(it).hasClass("datebox-f")) {
                $(it).datebox({editable: true, onlyview: false, value: ''});
            }
        });
    } else {
        $("#tab2 *input[class='easyui-textbox textbox-f']").each(function (k, it) {
            $(it).textbox({editable: true, onlyview: false});
        });
        $("#tab2 *input[class='easyui-numberbox numberbox-f textbox-f']").each(function (k, it) {
            $(it).numberbox({editable: true, onlyview: false});
        });
        $("#mform04").form('clear');
        $("#mform05").form('clear');
    }

    $("#warehouseNo1").combobox({required: true});
    $("#partCondition").combobox({required: true});
    $("#inspectUnit").combobox({required: true});
    $("#actualPartNo").textbox({required: true});
    $("#inspectQty").numberbox({required: true});

    $("*[item=btnItem]").each(function () {
        $(this).css('color', '');
    });
    $('#btnSerialNumber').attr('onclick', 'openSerialNumber();');
    $('#btnBatchNo').attr('onclick', 'openBatchNo();');
    $('#btnAddCert').attr('onclick', 'addCert();');
    //$('#btnUpload').attr('onclick', 'uploadCert();');
    $('#btnAddSB').attr('onclick', 'addSB();');
    $('#btnSave').attr('onclick', 'submitForm_();');
    $("#btnSave").css({'color': '#FFF', 'backgroundColor': '#1ab394', 'border-color': '#1ab394'});
}

//弹出框输入的批次号回填到页面到货批次号
function moreBatchNo() {
    var reg = /；/g;
    var moreBatchNo = $('#moreBatchNo').textbox('getValue');
    $('#batchNo').textbox('setValue', moreBatchNo.replace(reg, ';'));
    $('#dlg').dialog('close');

}

//弹出框输入的到货序号回填到页面到货序号
function moreSerialNumber() {
    var reg = /；/g;
    var moreSerialNumber = $('#moreSerialNumber').textbox('getValue');
    $('#actualSerialNumber').textbox('setValue', moreSerialNumber.replace(reg, ';'));
    $('#dlg1').dialog('close');

}

//弹出到货批次号更多按钮
function openBatchNo() {
    $('#dlg').dialog('open').dialog('center').dialog('setTitle', '更多');
    $('#moreBatchNo').textbox({value: ''});
}

//弹出到货序号更多按钮
function openSerialNumber() {
    $('#dlg1').dialog('open').dialog('center').dialog('setTitle', '更多');
    $('#moreSerialNumber').textbox({value: ''});
}

//如果外观商务检查不通过，质量证书信息不允许编辑
function disableCert(bizInspectResult) {
    if (bizInspectResult == 'KC') {

//                $('#btnAddCert').removeAttr('onclick');
//                $('#btnAddCert').css('color','grey');
//                $('#btnUpload').removeAttr('onclick');
//                $('#btnUpload').css('color','grey');
//                $('#certIfOk').prop('disabled',true);
//                $('#airInspectResult1').combobox({editable: false, onlyview: true,value:''});
//                $('#airDiffDesc').textbox({editable: false, onlyview: true,value:''});
//                $('#airDiffResponsibleParty').combobox({editable: false, onlyview: true,value:''});
//                $('#airInspector').textbox({editable: false, onlyview: true,value:''});
//                $('#airInspectDate').datebox({editable: false, onlyview: true,value:''});
//                disableReturnConfirm();
//            }else{
//                $('#btnAddCert').attr('onclick','addCert();');
//                $('#btnUpload').attr('onclick','uploadCert();');
//                $('#btnAddSB').attr('onclick','addSB();');
//                $('#btnAddCert').css('color','');
//                $('#btnUpload').css('color','');
//                $('#btnAddSB').css('color','');
//                $('#certIfOk').prop('disabled',false);
//                $('#airInspectResult1').combobox({editable: true, onlyview: false});
//                $('#airDiffDesc').textbox({editable: true, onlyview: false});
//                $('#airDiffResponsibleParty').combobox({editable: true, onlyview: false});
//                $('#airInspector').textbox({editable: true, onlyview: false});
//                $('#airInspectDate').datebox({editable: true, onlyview: false});
//                enableReturnConfirm();
    }
}

//不可编辑返回件确认
function disableReturnConfirm() {
    $('#btnAddSB').removeAttr('onclick');
    $('#btnAddSB').css('color', 'grey');
    $("#confirm :checkbox[item=checkItem]").each(function () {
        $(this).prop('disabled', true)
    });

    $("#confirm :radio[item=radioItem]").each(function () {
        $(this).prop('disabled', true)
    });

    $("#confirm *[textboxname]").each(function (k, it) {
        if ($(it).hasClass("textbox-f")) {
            $(it).textbox({editable: false, onlyview: true});
        }
    });
    $('#workType').combobox({editable: false, onlyview: true});
}

//可编辑返回件确认
function enableReturnConfirm() {
    $('#btnAddSB').attr('onclick', 'addSB();');
    $('#btnAddSB').css('color', '');
    $("#confirm :checkbox[item=checkItem]").each(function () {
        $(this).prop('disabled', false)
    });

    $("#confirm :radio[item=radioItem]").each(function () {
        $(this).prop('disabled', false)
    });

    $("#confirm *[textboxname]").each(function (k, it) {
        if ($(it).hasClass("textbox-f")) {
            $(it).textbox({editable: true, onlyview: false});
        }
    });
    $('#workType').combobox({editable: true, onlyview: false});
}

function RadioClick1() {
    var rm = $(':checkbox[name=repairMark]').is(":checked") ? "Y" : 'N';
    if (rm == "Y") {
        $('#tsr').numberbox({value: "0"});
        $('#tsi').numberbox({value: "0"});
        $('#tst').numberbox({value: "0"});
        $('#csr').numberbox({value: "0"});
        $('#csi').numberbox({value: "0"});
        $('#cst').numberbox({value: "0"});
        $('#msr').numberbox({value: "0"});
        $('#msi').numberbox({value: "0"});
        $('#mst').numberbox({value: "0"});
    }
}

function RadioClick2() {
    var om = $(':checkbox[name=overhaulMark]').is(":checked") ? "Y" : 'N';
    if (om == "Y") {
        $('#tsr').numberbox({value: "0"});
        $('#tso').numberbox({value: "0"});
        $('#tsi').numberbox({value: "0"});
        $('#tst').numberbox({value: "0"});
        $('#csr').numberbox({value: "0"});
        $('#cso').numberbox({value: "0"});
        $('#csi').numberbox({value: "0"});
        $('#cst').numberbox({value: "0"});
        $('#msr').numberbox({value: "0"});
        $('#mso').numberbox({value: "0"});
        $('#msi').numberbox({value: "0"});
        $('#mst').numberbox({value: "0"});
    }
}

function RadioClick3() {
    var tm = $(':checkbox[name=testingMark]').is(":checked") ? "Y" : 'N';
    if (tm == "Y") {
        $('#tsi').numberbox({value: "0"});
        $('#tst').numberbox({value: "0"});
        $('#csi').numberbox({value: "0"});
        $('#cst').numberbox({value: "0"});
        $('#msi').numberbox({value: "0"});
        $('#mst').numberbox({value: "0"});
    }
}
