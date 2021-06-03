var sub_win = frameElement.api;
var P = (sub_win == null ? null : sub_win.opener);

$(function () {
    var s_params = {};
    var allConds = {};
    if (sub_win && sub_win.data && sub_win.data.isDialog == 1) {
        s_params = {
            'sidx': 'dateFound',
            'sord': 'desc'
        };
        allConds = {
            'editStatus': {hidden: true},
            'executionStatus': {hidden: true},
            'sourceType': {hidden: true}
        };
    }
    $('.date_input').datebox({});
    //最简配置
    var options_simple = {
        view: 'D_TLB_TECH_LOG',	//列表名称, 必填
        defaultParam: s_params, //默认查询参数
        //查询条件(可选配置)
        qcOptions: {
            qcBoxId: 'qc_box', // 查询框Id, 默认值: qc_box
            allConds: allConds
        },
        //结果列表(可选配置)
        gridOptions: {
            gridId: 'gridTable', //列表Id
            //optsCols: ["edit"], //要显示的操作列,默认值:[]
            optsCols: [], //要显示的操作列,默认值:[], 如果不显示，则用默认值
            optsFirst: true,
            jqGridSettings: {
                multiselect: false
            }
        }
    };
    $(document).sfaQuery(options_simple);
});

var customModelSettings = {
    'TLB_TECH_LOG': {    // model_name
        //列表项配置
        gridOptions: {
            allColModels: {
                'tlbNo': {formatter: tlbNoFormatter}
            },
            jqGridSettings: {
                loadComplete: function () {

                }
            }
        }
    }
};

//操作行（修改和删除功能）
function operation(cellvalue, options, rowObject) {
}


/**
 * 查看故障单
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 */
function tlbNoFormatter(cellvalue, options, rowObject) {
    var html = "";
    if (cellvalue != null) {
        html = '<a href="#" id="' + rowObject.tlbNo + '" style="color:#f60"  onclick="showDefect(this);" >' + cellvalue + '</a>';
    }
    return html;
}

function showTLB(obj) {
    //todo 请求查看详情
    var url = basePath + '/tlb/defect_info_view.action?id=' + $(obj).attr('tlbNo');
    var dialog_param = {
        title: 'Defect Faults Remark',
        width: '1000px',
        height: '500px',
        top: '20%',
        esc: true,
        cache: false,
        max: false,
        min: false,
        lock: true,
        parent: this,
        content: 'url:' + url,
        data: {
            edit: false,
            revise: false
        },
        close: function () {
        }
    };
    if (P) {
        P.$.dialog(dialog_param);
    } else {
        $.dialog(dialog_param);
    }
}
