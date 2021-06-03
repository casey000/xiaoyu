var identity = 'dg';

var giDocumentNo = "";
var giType = {};
var giUse = {};
var partAttr = {};
var mmPropertyType = {};
var status;

function i18nCallBack() {
    InitFuncCodeRequest_({
        data: {
            domainCode: 'MM_PROPERTY_TYPE,MM_CURRENCY,PM_ACREG_ACNO,MM_GI_TYPE,MM_GI_USE,MM_DIC_PART_ATTR',
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            giType = DomainCodeToMap_(jdata.data["MM_GI_TYPE"]);
            giUse = DomainCodeToMap_(jdata.data["MM_GI_USE"]);
            partAttr = DomainCodeToMap_(jdata.data["MM_DIC_PART_ATTR"]);
            mmPropertyType = DomainCodeToMap_(jdata.data["MM_PROPERTY_TYPE"]);
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                $('#partAttr').combobox({
                    panelHeight: '150',
                    editable: true,
                    data: jdata.data.MM_DIC_PART_ATTR,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#acno').combobox({
                    panelHeight: '150',
                    editable: true,
                    data: jdata.data.PM_ACREG_ACNO,
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


                $('#giUse').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_GI_USE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#propertyType').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_PROPERTY_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#priceCurrency').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_CURRENCY,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });


            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    InitDataGrid();

}

function InitDataGrid() {
    $("#dg").MyDataGrid({

        pagination: false,
        identity: identity,
        firstLoad: false,
        // sortable: true,
        columns: {
            param: {FunctionCode: 'MM_ISSUE_TONGJI_LIST'},
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
                },
                PROPERTY_TYPE: {
                    formatter: function (value) {
                        return mmPropertyType[value];
                    }
                },
                PART_ATTR: {
                    formatter: function (value) {
                        return partAttr[value];
                    }
                }
            }
        }
    });
}


function tongji() {


    var giDate1 = $('#giDate1').combobox('getValue');
    var giDate2 = $('#giDate2').combobox('getValue');

    if (!giDate1 || !giDate2) {
        MsgAlert({content: "请填写发料日期!", type: 'error'});
        return false;
    }
    console.log(giDate1, giDate2);

    var data = {giDate1: giDate1, giDate2: giDate2};
    doPost('/api/v1/plugins/A6_MM_ISSUE_TONGJI', data);

}

/** 刷新列表数据 */
function reload_() {
    $("#dg").datagrid("reload");
}
