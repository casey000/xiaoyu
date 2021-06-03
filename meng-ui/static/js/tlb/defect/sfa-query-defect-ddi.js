var sub_win = frameElement.api;
var P = (sub_win == null ? null : sub_win.opener);

$(function () {

    /* 导出按钮点击事件 */
    $("#export_btn").click(function(){
        $.exportExcel({
            url: "/api/v1/defect/ddi_flt/export",
            filename: "Defect_ddi_flt_export"
        })
    });

    var s_params = {};
    var allConds = {};

    var day = new Date();
    var endDate = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
    day.setDate(1);
    day.setMonth(day.getMonth() - 1);
    var startDate = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();

    if (sub_win && sub_win.data && sub_win.data.isDialog == 1) {
        s_params = {
            'ignoreCase': true,
            'search': false,
            'sidx': 'applyDate',
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
        view: 'D_DEFECT_DDI_QUERY',	//列表数据源，列表名称, 必填
        defaultParam: s_params, //默认查询参数
        //查询条件(可选配置)
        qcOptions: {
            allConds: {
                'startDate': {
                    name: 'startDate',
                    colNameEn: 'Start Date',
                    colNameCn: 'Start Date',
                    type: 'date'
                },

                'endDate': {
                    name: 'endDate',
                    colNameEn: 'End Date',
                    colNameCn: 'End Date',
                    type: 'date'
                }
            },
            qcBoxId: 'qc_box',
            showSavedQueries: false,
            showAddDel: false,
            qcData: [{
                'name': 'startDate',
                'oper': 'equales',
                'value': startDate,
                required: true,
                fixed: {'name': true, 'oper': true}
            },
                {
                    'name': 'endDate',
                    'oper': 'equales',
                    'value': endDate,
                    required: true,
                    fixed: {'name': true, 'oper': true}
                },
                {'name': 'acReg', 'oper': 'include', 'value': '', fixed: {'name': true}},
                {'name': 'deferredNo', 'oper': 'include', 'value': '', fixed: {'name': true}},
                {'name': 'defectNo', 'oper': 'include', 'value': '', fixed: {'name': true}}],
        },
        //结果列表(可选配置)
        gridOptions: {
            gridId: 'gridTable', //列表Id
            // optsCols: ["edit"], //要显示的操作列,默认值:[]
            optsCols: [], //要显示的操作列,默认值:[]
            optsFirst: true,
            jqGridSettings: {
                // multiselect: false,
                footerrow: true,
                loadComplete: function () {
                    var userData = $(this).getGridParam('userData');
                    $(this).footerData("set", {"countsEffect": "Total Effect Flts:" + userData.sumEffect});
                }
            }
        }
    };
    $(document).sfaQuery(options_simple);
});

var customModelSettings = {
    'DEFECT_DDI': {
        //列表项配置
        gridOptions: {
            allColModels: {
                'defectNo': {
                    formatter: formatterDefectNo
                },
                'countsEffect': {
                    sortable: false
                },
                'countsAll': {
                    sortable: false
                }
            },

            jqGridSettings: {
                //jqGrid配置项
                id: "id"
            }
        }
    }
};


function formatterDefectNo(cellValue, options, rowObject) {

    if(rowObject && rowObject.defectNo){

        return '<a href="#" id=' + rowObject.defectId
            + ' style="color:#f60" onclick="viewDefect(this,event);" >'
            + rowObject.defectNo + '</a>';
    }

    return "";
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


//判断字符是否为空的方法
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}


//解析日期函数
function paserDate(dateStr) {
    if (dateStr == null) {
        return "";
    }
    var dateArr = null;
    var timeArr = null;
    var arr1 = dateStr.split(" ");
    if (arr1[0] != null) {
        dateArr = arr1[0].split("-");
    }
    if (arr1[1] != null) {
        timeArr = arr1[1].split(":");
    }
    if (timeArr == null) {
        return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    } else {
        return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);
    }
}