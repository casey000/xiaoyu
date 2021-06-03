/**
 * Created by tpeng on 2017/3/1.
 */
var param = {};
var _opts = {};

function i18nCallBack() {
    param = getParentParam_();
    // InitResources();
}

var TypeMap_ = {};

var TASK_STATE_MAP = {
    "N": "未执行", "F": "已完成", "T": "已终止",
    "R": "已退回", "J": "已跳转", "H": "已转办"
};

$(function () {
    /*
        例：<table id="tab_id" procInstId="流程ID" class="flow_history" title="标题" style="height: 350px;width: 100%"></table>

        监听页面样式为 flow_history的Table ，逐条查询历史记录显示
        _opts.resize 自定义列表大小，默认是 {width: '100%',height:'100%'}
        考虑部分页面是先打开页面后，异步渲染的数据，延时700毫秒进行流程历史渲染
     */
    setTimeout(function () {
        _loadHistory();
    }, 700);
});

function _loadHistory() {
    $('.flow_history').each(function (i, e) {
        _initHistoryDG(e);
    })
}
function _initHistoryDG(ele) {

    var identity = $(ele).attr('id');    // tab_id
    var procInstId = $(ele).attr('procInstId'); //流程ID
    var title = $(ele).attr('title'); // 列表标题
    if (!procInstId) {
        procInstId = '-1';
    }
    $("#" + identity).MyDataGrid({
        identity: identity,
        title: title,
        columns: {
            param: {FunctionCode: 'WS_FLOW_HIS_TASK_LIST'},
            alter: {
                DURATION: {
                    formatter: function (value, row, index) {
                        return toMsTimeString(row.DURATION || row.DURATION_0);
                    }
                },
                ACT_STATE: {
                    formatter: function (value, row, index) {
                        var v = []; //[TASK_STATE_MAP[row.ACT_STATE]];
                        if (row.RECORD_STATE && row.RECORD_STATE != 'N' && row.RECORD_STATE != 'F') {
                            v.push(TASK_STATE_MAP[row.RECORD_STATE])
                        }
                        return v.join(",")
                    }
                },
            }
        },
        queryParams: {procInstId: procInstId},
        onLoadSuccess: function (data) {
        },
        contextMenus: [],
        toolbar: [
            {
                key: "COMMON_RELOAD", text: $.i18n.t('common:COMMON_OPERATION.RELOAD'),
                handler: function () {
                    common_reload_({identity: identity});
                }
            }
        ],
        resize: function () {
            if (!_opts.resize) {
                return {width: '100%', height: '100%'}
            } else {
                return _opts.resize;
            }

        }
    });
}