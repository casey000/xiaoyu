var param = '';
var PAGE_DATA = {};

function i18nCallBack() {

    param = getParentParam_();
    console.log(param.PKID);

    InitFuncCodeRequest_({

        data: {
            domainCode: "USER_NAME",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                PAGE_DATA['userName'] = DomainCodeToMap_(jdata.data["USER_NAME"]);

                InitDataGrid();

            }
            else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });


    // InitFuncCodeRequest_({
    //     async: false,
    //     data: {pkid: param.PKID, FunctionCode: "PM_NODE_GET_ONE"},
    //     successCallBack: function (jdata) {
    //         if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
    //             $('#node1').textbox({value: jdata.data.NODE});
    //         }
    //     }
    // });
}

function InitDataGrid() {
    var identity = 'dg';
    $("#dg").MyDataGrid({
        identity: identity,
        queryParams: {pkid: param.PKID},
        columns: {
            param: {FunctionCode: 'A6MM_STORE_QUERY_UNLOCK_LIST'},
            alter: {
                //不显示字典，显示描述的列
                LOCK_MAN: {
                    formatter: function (value) {
                        return PAGE_DATA['userName'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-lock", i18nText: "解锁", auth: "",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    common_add_edit_({
                        identity: identity,
                        isEdit: 1,
                        width: 500,
                        height: 150,
                        title: $.i18n.t('解锁'),
                        param: {data: {rowdata}},
                        url: "/views/mm/warehouse/storequery/mm_store_query_unlock.shtml"
                    });
                }
            }
        ]

    });
}


function reload() {
    $("#dg").datagrid("reload");
    param.OWindow.reload_();
}

function reload_dg1() {
    $("#dg1").datagrid("reload");
    param.OWindow.reload_();
}
