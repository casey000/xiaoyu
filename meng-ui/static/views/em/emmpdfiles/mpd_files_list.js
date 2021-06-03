var PAGE_DATA = {};
$(function () {
    $.i18n.init(function (err, t) {
        InitFuncCodeRequest_({
            data: {
                async: false,
                FunctionCode: "ANALYSIS_DOMAIN_BYCODE",
                domainCode: "DA_FLEET,EM_MPD_DOC_TYPE,EM_MPD_ITEM_TYPE,EM_MPD_ATA,EM_MPD_REV_CODE,EM_MPD_CONDITION,DM_ATA"
            },
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    $('#itemType').combobox({
                        panelHeight: '100',
                        editable: false,
                        data: jdata.data.EM_MPD_ITEM_TYPE,
                        valueField: 'VALUE',
                        textField: 'TEXT'
                    });

                    $('#docType').combobox({
                        panelHeight: '100',
                        editable: false,
                        data: jdata.data.EM_MPD_DOC_TYPE,
                        valueField: 'VALUE',
                        textField: 'TEXT'
                    });
                    $('#fleet').combobox({
                        panelHeight: '100',
                        editable: false,
                        data: jdata.data.DA_FLEET,
                        valueField: 'VALUE',
                        textField: 'TEXT'
                    });
                    $('#ata').combobox({
                        panelHeight: '150',
                        editable: false,
                        data: jdata.data.DM_ATA,
                        valueField: 'VALUE',
                        textField: 'TEXT'
                    });
                    $('#revCode').combobox({
                        panelHeight: '100',
                        editable: false,
                        data: jdata.data.EM_MPD_REV_CODE,
                        valueField: 'VALUE',
                        textField: 'TEXT'
                    });
                    $('#condition').combobox({
                        panelHeight: '100',
                        editable: false,
                        data: jdata.data.EM_MPD_CONDITION,
                        valueField: 'VALUE',
                        textField: 'TEXT'
                    });
                    PAGE_DATA['itemType'] = DomainCodeToMap_(jdata.data["EM_MPD_ITEM_TYPE"]);
                    PAGE_DATA['emMpdRevCode'] = DomainCodeToMap_(jdata.data["EM_MPD_REV_CODE"]);
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
        InitDataGrid();
        //InitDataGrid1(-1);
        InitDataGrid2(-1);
        InitDataGrid3(-1);
        /* InitDataGrid4(-1);
         InitDataGrid5(-1);
         InitDataGrid6(-1);
         InitDataGrid7(-1);
         InitDataGrid8(-1);
         InitDataGrid9(-1);
         InitDataGrid10(-1);
         InitDataGrid11(-1);
         InitDataGrid12(-1);
         InitDataGrid13(-1);
         InitDataGrid14(-1);*/
    });
});


function InitDataGrid() {
    var identity = 'dg';
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg").MyDataGrid({
        identity: identity,
        enableHeaderClickMenu: true,//此属性开启表头列名称右侧那个箭头形状的鼠标左键点击菜单
        sortable: true,
        pageSize: 3/*pageSize, pageList: [pageSize]*/,
        /*resize: function () {
            return tabs_standard_resize($("#tt"), 0, 5, 0, 52);
        },*/
        columns: {
            param: {FunctionCode: 'MPD_FILES_LIST'},
            alter: {
                ISSUE_DATE: {
                    type: 'date'
                },
                REV_DATE: {
                    type: 'date'
                },
                UPLOAD_TIME: {
                    type: 'date'
                },
                UPLOAD: {
                    formatter: function (value, row, index) {
                        if (row.UPLOAD) {
                            return '<a href="javascript:void(0);" rowindex="' + index + '" class="attach">' +
                                '<img src="/img/edit2.png" border="0" style="width:15px;height:15px;"/></a>'
                        }
                    }
                }
            }
        },
        onLoadSuccess: function () {
            //上传成功之后给图标绑定方法
            InitSuspend('a.attach', {
                'onmouseover': function (thiz, event, callback) {
                    var index = $(thiz).attr("rowindex");
                    var row = $("#dg").datagrid('getRows')[index];
                    var docPkid = row.FLEET + row.DOC_TYPE + row.DOC_NO + row.DOC_VER;
                    var state = row.STATE;
                    InitFuncCodeRequest_({
                        data: {
                            SOURCE_ID: docPkid,
                            CATEGORY: "MPDIMPORT",
                            FunctionCode: 'ATTACHMENT_RSPL_GET'
                        },
                        successCallBack: function (jdata) {
                            if (jdata.code === 200) {

                            }
                            var html = "";
                            for (var i = 0; i < jdata.data.length; i++) {
                                if (state == "待解析") {
                                    html += '<li><a target="_blank" onclick="downFile(' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a>'
                                        + '<span onclick="deleteFile(\'' + jdata.data[i].PKID + '\');return false;" class="icon-cross"></span>'
                                        + '</li>';
                                } else {
                                    //非‘待解析’状态的MPD文件不允删除附件
                                    html += '<li><a target="_blank" onclick="downFile(' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a></li>';
                                }

                            }
                            callback(html);
                        }
                    });
                }
            });
            //$("#dg").datagrid('doCellTip', {'max-width': '400px', 'delay': 500});
        },
        onClickRow: function () {    //单击进行操作的方法
            var row = $('#dg').datagrid('getSelected');//获取选中行的数据
            if (!row) {
                return false;//为防止意外情况可以选择加上此判断
            }
            var aid = row.PKID;//获取选中行的id
            //InitDataGrid1(aid);
            InitDataGrid2(aid);
            InitDataGrid3(aid);
            /*InitDataGrid4(aid);
            InitDataGrid5(aid);
            InitDataGrid6(aid);
            InitDataGrid7(aid);
            InitDataGrid8(aid);
            InitDataGrid9(aid);
            InitDataGrid10(aid);
            InitDataGrid11(aid);
            InitDataGrid12(aid);
            InitDataGrid13(aid);
            InitDataGrid14(aid);*/
        },
        onDblClickRow: function (index, field, value) {
            if (value.DOC_TYPE == "EMR" || value.DOC_TYPE == "STR") {
                uploadEMR_(value.PKID);
            } else {
                uploadMpd_(value.PKID);
            }

        },
        rowStyler: function (index, row) {
            if (row.STATE == 3) {
                return 'background-color:red;';
            }
        },
        contextMenus: [
            {
                id: "m-delete", i18nText: "删除", auth: "",//emmpdfiles-delete
                onclick: function () {
                    var rowData = $("#dg").datagrid('getSelected');
                    //deleteFileYJ(rowData.PKID);
                    common_delete_({
                        identity: identity,
                        cfmI18next: "msg_tip:TIP.COMMON.DEL_CONFIRM",
                        param: {pkid: "PKID", docNo: "DOC_NO", docVer: "DOC_VER", fleet: "FLEET", docType: "DOC_TYPE"},
                        FunctionCode: "EM_MPD_FILES_DEL"
                    });
                }
            }/*,
            {
                id: "m-edit", i18nText: "分发轨迹", auth: "EM_MPD_FILES_DISTRIBUTE",//emmpdfiles-distribute
                onclick: function () {
                    var rowData = $("#dg").datagrid('getSelected');
                    common_add_edit_({
                        identity: identity, isEdit: 1, width: 1050, height: 600,
                        param: {
                            pkid: "PKID", data: {}
                        },
                        url: '/views/em/emmpdfiles/distributionRecords.shtml'
                    });
                }
            }*/
            ,
            {
                id: "m-edit", i18nText: "任务分发", auth: "",//emmpdfiles-distribute
                onclick: function () {
                    var rowData = $("#dg").datagrid('getSelected');
                    distribute(rowData.PKID);
                }
            }
            , {
                id: "m-analysis", i18nText: "解析",//emmpdfiles-delete
                onclick: function () {
                    var rowData = $("#dg").datagrid('getSelected');
                    analysis_(rowData.PKID);
                }
            }
        ],
        //判断禁用分发按钮
        validAuth: function (row, items) {
            // if (row.IF_PARSE_SUCCESS == "N" || row.STATE == '解析失败' || row.STATE == '已分发' || row.STATE == '解析中') {
            //     items['任务分发'].enable = false;
            // }
            if (row.STATE == '已分发') {
                items['删除'].enable = false;
                items['解析'].enable = false;
                items['任务分发'].enable = false;
            }
            if (row.STATE == '待分发') {
                items['删除'].enable = true;
                items['解析'].enable = false;
            }
            if (row.STATE == '解析失败' || row.STATE == '待解析') {
                items['删除'].enable = true;
                items['解析'].enable = true;
                items['任务分发'].enable = false;
            }
            return items;
        },
        toolbar: [
            {
                id: 'btnAdd',
                text: $.i18n.t('上传非MPD源文件'),
                iconCls: 'icon-add',
                //auth: 'EM_MPD_FILES_UPLOAD',
                handler: function () {
                    uploadEMR_('');
                }
            },
            {
                id: 'btnAdd',
                text: $.i18n.t('上传MPD文件'),
                iconCls: 'icon-add',
                //auth: 'EM_MPD_FILES_UPLOAD',
                handler: function () {
                    uploadMpd_('');
                }
            }, {
                id: 'btnAdd',
                text: $.i18n.t('模板上传下载'),
                iconCls: 'icon-add',
                handler: function () {
                    uploadTemplate();
                }
            },{
                id: 'btnCopy',
                text: $.i18n.t('复制解析规则'),
                iconCls: 'icon-add',
                //auth: 'EM_MPD_FILES_QUERY',
                handler: function () {
                    copyAnalysisRule();
                }
            }, '-', {
                id: 'btnReload',
                text: $.i18n.t('刷新'),
                iconCls: 'icon-reload',
                //auth: 'EM_MPD_FILES_QUERY',
                handler: function () {
                    $("#dg").datagrid("reload");
                }
            }],
        resize: function () {
            return {
                height: $(document.body).height() - $("fieldset").height() - 325,
                width: $(document.body).width()
            };
        }
    });
}

//上传非波音模版文件
function uploadTemplate() {
    ShowWindowIframe({
        width: 970,
        height: 250,
        title: $.i18n.t('模版管理'),
        url: '/views/em/emmpdfiles/mpdFilesTemplate.shtml'
    });
}

//复制已有的解析规则
function copyAnalysisRule() {
    ShowWindowIframe({
        width: 770,
        height: 300,
        title: $.i18n.t('复制解析规则'),
        url: '/views/em/emmpdfiles/mpdCopyRule.shtml'
    });
}

//依据文件类型数据展示
function InitDataGrid1(aid) {
    var PKID = aid;
    var identity = 'yjwj';
    $("#yjwj").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_BASIS_LIST'}

        },
        resize: function () {
            return {height: 260};
        }

    });
}

//维修项目数据展示
function InitDataGrid2(aid) {
    var PKID = aid;
    var identity = 'wxxm';
    $("#wxxm").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_ITEM_LIST'},
            alter: {
                ITEM_TYPE: {
                    formatter: function (value) {
                        return value;
                    }
                },
                REV_CODE: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['emMpdRevCode'][value];
                    }
                },
            }
        },
        resize: function () {
            return {height: 240};
        }
    });
}

//MRB参考数据展示
function InitDataGrid3(aid) {
    var PKID = aid;
    var identity = 'mrb';
    $("#mrb").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_MRB_SHOW'}

        },
        resize: function () {
            return {height: 260};
        },
        contextMenus: []
    });
}

//AD参考数据展示
function InitDataGrid4(aid) {
    var PKID = aid;
    var identity = 'ad';
    $("#ad").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_AD_LIST'}

        },
        resize: function () {
            return {height: 240};
        },
        contextMenus: []
    });
}

//MOD参考数据展示
function InitDataGrid5(aid) {
    var PKID = aid;
    var identity = 'mod';
    $("#mod").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_MOD_LIST'}

        },
        resize: function () {
            return {height: 240};
        },
        contextMenus: []
    });
}

//ISB参考数据展示
function InitDataGrid6(aid) {
    var PKID = aid;
    var identity = 'isb';
    $("#isb").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_ISB_LIST'}

        },
        resize: function () {
            return {height: 240};
        },
        contextMenus: []
    });
}

//SIL参考数据展示
function InitDataGrid7(aid) {
    var PKID = aid;
    var identity = 'sil';
    $("#sil").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_SLI_LIST'}

        },
        resize: function () {
            return {height: 240};
        },
        contextMenus: []
    });
}

//ALI参考数据展示
function InitDataGrid8(aid) {
    var PKID = aid;
    var identity = 'ali';
    $("#ali").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_ALI_LIST'}
        },
        resize: function () {
            return {height: 240};
        },
        contextMenus: []
    });
}

//CMR参考数据展示
function InitDataGrid9(aid) {
    var PKID = aid;
    var identity = 'cmr';
    $("#cmr").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_CMR_LIST'}
        },
        resize: function () {
            return {height: 240};
        },
        contextMenus: []
    });
}

//ASM参考数据展示
function InitDataGrid10(aid) {
    var PKID = aid;
    var identity = 'asm';
    $("#asm").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_ASM_LIST'}
        },
        resize: function () {
            return {height: 240};
        },
        contextMenus: []
    });
}

//FAL参考数据展示
function InitDataGrid11(aid) {
    var PKID = aid;
    var identity = 'fal';
    $("#fal").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_FAL_LIST'}
        },
        resize: function () {
            return {height: 240};
        },
        contextMenus: []
    });
}

//CMP参考数据展示
function InitDataGrid12(aid) {
    var PKID = aid;
    var identity = 'cmp';
    $("#cmp").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_CMP_LIST'}
        },
        resize: function () {
            return {height: 240};
        },
        contextMenus: []
    });
}


//AOT参考数据展示
function InitDataGrid13(aid) {
    var PKID = aid;
    var identity = 'aot';
    $("#aot").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_AOT_LIST'}
        },
        resize: function () {
            return {height: 240};
        },
        contextMenus: []
    });
}

//VR参考数据展示
function InitDataGrid14(aid) {
    var PKID = aid;
    var identity = 'vr';
    $("#vr").MyDataGrid({
        identity: identity,
        queryParams: {PKID: PKID},
        columns: {
            param: {FunctionCode: 'EM_MPD_FILES_VR_LIST'}
        },
        resize: function () {
            return {height: 140};
        },
        contextMenus: []
    });
}

//删除附件
function deleteFile(pkid) {//浮动附件点击删除
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: 'ATTACHMENT_RSPL_DEL'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                reload_();
            }
        }
    });
}

function deleteFileYJ(pkid) {//右键时使用的删除附件
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: 'ATTACHMENT_RSPL_DEL'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                reload_();
            }
        }
    });
}

/** 刷新列表数据 */
function reload_() {
    $("#dg").datagrid("reload");
}

//删除时用到刷新所有的列表数据
function reload_Atabs() {
    //$("#yjwj").datagrid("reload");
    $("#wxxm").datagrid("reload");
    //$("#mrb").datagrid("reload");
    //$("#ad").datagrid("reload");
    //$("#mod").datagrid("reload");
    //$("#isb").datagrid("reload");
    //$("#cmr").datagrid("reload");
    //$("#asm").datagrid("reload");
    //$("#fal").datagrid("reload");
    //$("#cmp").datagrid("reload");
    //$("#aot").datagrid("reload");
    //$("#vr").datagrid("reload");
}

function uploadEMR_(pkid) {
    ShowWindowIframe({
        width: 970,
        height: 320,
        title: $.i18n.t('文件上传'),
        url: '/views/em/emmpdfiles/mpdfilesemrupload.shtml?v_=' + new Date().getTime() + '&pkid=' + pkid
    });
}

/** 上传Mpd文件 */
function uploadMpd_(pkid) {
    ShowWindowIframe({
        width: 970,
        height: 320,
        title: $.i18n.t('文件上传'),
        url: '/views/em/emmpdfiles/mpd_files_upload.shtml?v_=' + new Date().getTime() + '&pkid=' + pkid
    });
}

/*任务分发*/
function distribute(pkid) {

    ajaxLoading();
    InitFuncCodeRequest_({
        data: {PKID: pkid, FunctionCode: "EM_MPD_FILES_DISTRIBUTE_TO"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                //MaskUtil.unmask();
                ajaxLoadEnd();
                $("#dg").datagrid("reload");
            } else {
                //MaskUtil.unmask();
                ajaxLoadEnd();
                $("#dg").datagrid("reload");
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    return false;
}

/** 解析 */
function analysis_(pkid) {
    ajaxLoading();
    layerStandardAjaxCall_({
        url: "/api/v1/mpdfiles/analysis",
        data: "pkid=" + pkid,
        success: function (jdata, loadIndex) {
            ajaxLoadEnd();
            layerStandardMsg_(jdata, loadIndex, function () {
                $("#dg").datagrid("reload");
            });
        }
    });

}

/** 对比上一版改动 */
function compare_(pkid) {
    var opts = $.extend({}, {
        content: "是否对比该项目改动？", yesFunc: function () {
            layerStandardAjaxCall_({
                url: "/api/v1/mpdfiles/compare", data: "docId=" + pkid,
                success: function (jdata, loadIndex) {
                    layerStandardMsg_(jdata, loadIndex, function () {
                        $("#dg").datagrid("reload");
                    });
                }
            });
        }
    });
    layerConfirm_(opts);
}

/** 清理解析条目 */
function clean_(pkid) {
    var opts = $.extend({}, {
        content: "是否清除解析内容？", yesFunc: function () {
            layerStandardAjaxCall_({
                url: "/api/v1/mpdfiles/clean", data: "docId=" + pkid,
                success: function (jdata, loadIndex) {
                    layerStandardMsg_(jdata, loadIndex, function () {
                        $("#dg").datagrid("reload");
                        reload_Atabs();
                    });
                }
            });
        }
    });
    layerConfirm_(opts);
}

/** 根据对比数据-生成评估单 */
function createEval_(pkid) {
    ShowWindowIframe({
        width: 800,
        height: 420,
        title: $.i18n.t('RES.emmpdfiles.CREATE_EVAL'),
        param: {mpdFilesId: pkid},
        url: '/views/em/emmpdfiles/mpd_files_upload.shtml?v_=' + new Date().getTime()
    });
}

