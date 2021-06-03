var sub_win = frameElement.api;
var P = (sub_win == null ? null : sub_win.opener);

$(function () {
    var s_params = {};
    var allConds = {};
    if (sub_win && sub_win.data && sub_win.data.isDialog == 1) {
        s_params = {
            'sidx': 'defectNo',
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
        view: 'V_DEFECT_WORK_LOG_LIST_INFO',	//列表数据源，列表名称, 必填
        defaultParam: s_params, //默认查询参数
        //查询条件(可选配置)
        qcOptions: {
            qcBoxId: 'qc_box', // 查询框Id, 默认值: qc_box
            allConds: allConds
        },
        //结果列表(可选配置)
        gridOptions: {
            gridId: 'gridTable', //列表Id
            // optsCols: ["edit"], //要显示的操作列,默认值:[]
            optsCols: [], //要显示的操作列,默认值:[]
            optsFirst: true,
            jqGridSettings: {
                multiselect: false
            }
        }
    };
    $(document).sfaQuery(options_simple);
    /* DD导出按钮点击事件 */
    $("#export_btn").click(function () {
            console.log($(document).sfaQuery());
            console.log($(this).parent());
        dynamicExportMVC({
            sfaQuery: $(document).sfaQuery(),
            container: $(this).parent(),
            fileName: '地服影响项目类故障.xls',//导出文件命名
            url: "/api/v1/worklog/export"//后端提供的接口

        });
    });
});

var customModelSettings = {
    'DEFECT_WORK_LOG_INFO':{
        // 列表项配置
        gridOptions : {
            allColModels : {
                'defectNo' : {
                    formatter : formaterDefectNo
                },
                'owner' : {
                    formatter : formaterOwner
                }
            }
        }
    }
};
function formaterDefectNo(cellValue, options, rowObject) {
    return '<a href="#" id=' + rowObject.id
        + ' style="color:#f60" onclick="viewDefect(this,event);" >'
        + rowObject.defectNo + '</a>';
}
function viewDefect(rowObj, event) {
    var curHeight;
    if( window.screen.height < 800){
        curHeight = $(window).height()*1.1.toString()
    }else{
        curHeight = '700'
    }
    let title = "故障详情----" + rowObj.text;
    ShowWindowIframe({
        width: "1000",
        height: curHeight,
        title: title,
        param: {defectId: rowObj.id, defectNo: rowObj.text},
        url: "/views/defect/defectDetails.shtml"
    });
}

function formaterOwner(cellValue, options, rowObject) {

    if(cellValue && rowObject.sn){
        return cellValue + "(" + rowObject.sn + ")";
    }else return "";
}