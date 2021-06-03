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
        view: 'V_DEFECT_FAULTS_REMARK',	//列表名称, 必填
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
    'DEFECT_FAULTSREMARK': {    // model_name
        //列表项配置
        gridOptions: {
            allColModels: {
                'creator.name' : {
                    formatter: showUser
                },
                'defectNo': {formatter: defectNoFormatter},
                // 'orgRepeatFaults' : {
                //     formatter: showOrgRepeatFaultsDefectNos
                // },
                // 'newRepeatFaults' : {
                //     formatter: showNewRepeatFaultsDefectNos
                // },
                // 'orgMultipleFaults' : {
                //     formatter: showOrgMultipleFaultsDefectNos
                // },
                // 'newMultipleFaults' : {
                //     formatter: showNewMultipleFaultsDefectNos
                // }
            },
            jqGridSettings: {
                loadComplete: function () {

                }
            }
        }
    }
};

function showUser(cellValue, options, rowObject){
    var user = '';
    if(rowObject.creator){
        user += rowObject.creator.realName + '(' +rowObject.creator.userName + ')';
    }
    return user;
}

/**
 * 查看故障单
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 */
function defectNoFormatter(cellvalue, options, rowObject) {
    var html = "";
    if (cellvalue != null) {
        html = '<a href="#" id="' + rowObject.defectId + '" style="color:#f60"  onclick=\'showDefect('+JSON.stringify(rowObject)+');\' >' + cellvalue + '</a>';
    }
    return html;
}

function showDefect(obj) {
    ShowWindowIframe({
        width: "850",
        height: "500",
        title: "DEFECT FAULTS REMARK",
        param: {rowObject: obj},
        url: "/views/defect/faults_remark/faults_remark.shtml"
    });
}

function showOrgRepeatFaultsDefectNos(cellValue, options, rowObject){
    //todo 原来ME跳转的页面没有定义
    if(cellValue == null || cellValue == ''){
        return '';
    }
    //
    // var trHTML = '';
    // trHTML += '<a id="id_' + rowObject.id + cellValue + '" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
    // $("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
    //     P.$.dialog({
    //         id : 'orgRepeatFaultsDefectNos',
    //         title : 'Org Repeat Faults DefectNos',
    //         top : '30%',
    //         width : '500px',
    //         height: '300px',
    //         data : {
    //             'rowObject' : rowObject
    //         },
    //         content : 'url:' + basePath + "/tlb/defect_orgRepeatFaultsDefectNos.jsp"
    //     });
    // });
    // return trHTML;
}

function showNewRepeatFaultsDefectNos(cellValue, options, rowObject){
    if(cellValue == null || cellValue == ''){
        return '';
    }
    //
    // var trHTML = '';
    // trHTML += '<a id="id_' + rowObject.id + cellValue + '" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
    // $("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
    //     P.$.dialog({
    //         id : 'newRepeatFaultsDefectNos',
    //         title : 'New Repeat Faults DefectNos',
    //         top : '30%',
    //         width : '500px',
    //         height: '300px',
    //         data : {
    //             'rowObject' : rowObject
    //         },
    //         content : 'url:' + basePath + "/tlb/defect_newRepeatFaultsDefectNos.jsp"
    //     });
    // });
    // return trHTML;
}

function showOrgMultipleFaultsDefectNos(cellValue, options, rowObject){
    if(cellValue == null || cellValue == ''){
        return '';
    }
    // //alert(JSON.stringify(options));
    // var trHTML = '';
    // trHTML += '<a id="id_' + rowObject.id + cellValue +'" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
    // $("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
    //     P.$.dialog({
    //         id : 'orgMultipleFaultsDefectNos',
    //         title : 'Org Multiple Faults DefectNos',
    //         top : '30%',
    //         width : '500px',
    //         height: '300px',
    //         data : {
    //             'rowObject' : rowObject
    //         },
    //         content : 'url:' + basePath + "/tlb/defect_orgMultipleFaultsDefectNos.jsp"
    //     });
    // });
    // return trHTML;
}


function showNewMultipleFaultsDefectNos(cellValue, options, rowObject){
    if(cellValue == null || cellValue == ''){
        return '';
    }
    //
    // var trHTML = '';
    // trHTML += '<a id="id_' + rowObject.id + cellValue +'" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
    // $("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
    //     P.$.dialog({
    //         id : 'newMultipleFaultsDefectNos',
    //         title : 'new Multiple Faults DefectNos',
    //         top : '30%',
    //         width : '500px',
    //         height: '300px',
    //         data : {
    //             'rowObject' : rowObject
    //         },
    //         content : 'url:' + basePath + "/tlb/defect_newMultipleFaultsDefectNos.jsp"
    //     });
    // });
    // return trHTML;
}
