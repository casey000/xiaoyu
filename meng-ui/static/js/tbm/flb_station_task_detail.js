/*
 * Copyright 2019 SF Airlines Co., Ltd. All rights reserved.
 * 本文件仅限于顺丰航空有限公司内部传阅，禁止外泄以及用于其他的商业目的。
 */
var operation = {};
var orderId = {};
var acReg = {};
var flightNo = {};
var jobDate = {};
var flightId = {};
var isReleased = {};
var searchList;
var date;
function i18nCallBack() {
    // $('#process_dd').title('123')
    $('#process_dd').dialog('close');
    $('#assign_dd').dialog('close');
    $('#cards_dd').dialog('close');
    var param = location.search;
    console.log("search:" + param);
    operation = getUrlParam("operation");
    orderId = getUrlParam('orderId');
    acReg = getUrlParam('acReg');
    flightNo = getUrlParam('flightNo');
    departure = getUrlParam('departure');
    arrival = getUrlParam('arrival');
    jobDate = getUrlParam('jobDate');
    flightId = getUrlParam('flightId');
    isReleased = getUrlParam("isReleased");
    searchList = getUrlParam("searchList");
    if (jobDate) {
        date = jobDate.substring(0, jobDate.lastIndexOf(":"))
    }
    var space = '        ';
    console.info(acReg, 'acReg');
    var textValue = '';
    if (acReg != 'null' && flightNo != 'null') {
        textValue = acReg + space + flightNo + space + operation + space + date ;
    } else {
        textValue = "STA" + space + operation + space + date ;
    }
    // 初始化标题列
    $("#detail_info_li").text(textValue);
    initialRoutineTaskDataGrid(orderId);
    initialNonRoutineTaskDataGrid(orderId);
    initialNrcListDataGrid(orderId);

    $('input[name="checkWay"]').bind('click', function () {
        $('input[name="checkWay"]').not(this).attr("checked", false);
        var zjWay = $('input[name="checkWay"]:checked').val();
        if (zjWay !== null && zjWay !== undefined) {
            $('#bijian').css({'visibility': 'visible'});
        } else {
            $('#bijian').css({'visibility': 'hidden'});
            $("#checkWayNum").textbox('setValue', '');
            $("#checkWayName").textbox('setValue', '');
        }
    });
    // TODO 这里传的是workOrderId，应该传jobId
    // TODO 这里workOrderId就是jobId

    // initialDefectListDataGrid(1885971);

    if ("TBF" != operation && "TBFTR" != operation) {
        $("#btn_delete_job").attr("style", "display:none;");
    }

    if (operation === "O/G" || operation === "TBF") {
        initialDefectListDataGrid(orderId);
        hideTables();
    } else if (operation === "Po/F" || operation === "Pr/F" || operation === "T/R" || operation === "TBFTR" || operation === "N/A") {
        initialLineTask(orderId);
        initialCheckListDataGrid(orderId);
        initialReleaseDataGrid(orderId);
        initialDefectListDataGrid(orderId);
        // initialEventReportDataGrid(orderId);
        // 如果航班已经放行，则航站任务详情列表不可编辑
        if (isReleased && isReleased.toUpperCase() === 'RELEASED') {
            changeTableReadOnly();
            // 如果航班已放行，放行控件不可见
            $('#releaseBtn').hide();
            $('#cancelReleaseBtn').show();
        } else {
            //todo 如果航班还没放行，取消放行控件不可见
            console.log("航班还没放行，取消放行控件不可见");
            $('#cancelReleaseBtn').hide();
        }
    } else {
        operation = "STA";
        hideTables();
        $('.defect_table').hide();
    }
    //判断是否展示外站发料按钮（非中心航站才展示）
    showByDicData();
}
var CENTER_STATION = [];
var distributeStation;
function showByDicData(){
    // 优先加载数据字典
    queryDataDict({
        "domainCode": "CENTER_STATION",
        succFn:function(data){
            if(data){
                CENTER_STATION = data.CENTER_STATION
            }
        }
    });
    if (operation == 'O/G' || operation == 'Po/F') {
        distributeStation = arrival;
    } else if (operation == 'STA') {
        distributeStation = getUrlParam("operation");
    } else {
        distributeStation = departure;
    }
    //不等于中心站的显示
    let show = CENTER_STATION.every((item)=>{
        return distributeStation != item.VALUE;
    })

    if(show){
        $('.external-distribution').show();
    }else{
        $('.external-distribution').hide();
    }


}

//底部上传按钮打开上传页面
function open_upload() {
    var title_ = $.i18n.t('common:COMMON_OPERATION.UPLOAD');
    let param = {
        cat: "feedback",//文件夹
        // sourceId: params.rowData.id,//
        // sourceId: orderId,//
        sourceId: $('input[name="taskRadio"]:checked').val(),//
        successCellBack: "",
        fialCellBack: ""
    };
    ShowWindowIframe({
        width: "1000",
        height: "700",
        title: title_,
        param: param,
        url: "/views/data_manager/dm/upload/attachment_add.shtml"
    });
}

function reload_() {
    $("#attachmengtList").empty();
    InitDataGrid($('input[name="taskRadio"]:checked').val(), "feedback")
}

function InitDataGrid(pkid, category) {
    InitFuncCodeRequest_({
        data: {
            SOURCE_ID: pkid,
            CATEGORY: category,
            FunctionCode: 'ATTACHMENT_RSPL_GET'
        },
        successCallBack: function (jdata) {
            for (var i = 0; i < jdata.data.length; i++) {
                var trHTML = '<tr align="left"><input class="uploadId" value="'+ jdata.data[i].PKID +'" type="hidden"><td class="td5" align="left" style="text-align:left;"><a target="_blank" onclick="downFile(' + jdata.data[i].PKID + ',' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a></td><td class="td5" align="left" style="text-align:left;"><input class="btn btn-primary" type="button"  value="删除" style="width: 50px;margin:5px;" onclick="deleteFile(' + jdata.data[i].PKID + ');return false;"/></td></tr>';
                $("#attachmengtList").append(trHTML);//在table最后面添加一行
                // downFile(jdata.data[i].PKID,jdata.data[i].PKID);
            }
        }
    });
}

/*删除滑回航段任务按钮*/
$('#btn_delete_job').click(function () {

    var datas = {workOrderId: orderId};
    datas = $.extend({}, datas, {FunctionCode: 'DELETE_WORKORDER'});
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                // MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.SUCCESS_CODE')});
                window.parent.MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                backPage();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
});

/**
 * 隐藏表格
 * */
function hideTables() {
    $("#release").hide();
    $(".ogHide").hide();
    $("#div_eventReport").hide();
}

/**
 *整个表格处于不可编辑状态
 */
function changeTableReadOnly() {
    $('#tt').prop('readonly', true);
}

function flbDetail() {
    event.stopPropagation();    //  阻止事件冒泡
    console.log("flbOrderId" + flbOrderId);
    var title_ = $.i18n.t('flb详情');
    var currentWidth = ($(window).width() * 0.8).toString();
    var currentHeight = ($(window).height() * 0.8).toString();
    ShowWindowIframe({
        width: "1200px",
        height: currentHeight,
        title: title_,
        param: {operation: operation, flightId: flightId, flbOrderId: flbOrderId, isReleased: isReleased, acReg: acReg},
        url: "/views/tbm/flb/flb_detail.shtml"
    });
}

//return
function backPage(param) {

    var data = JSON.parse(searchList);
    var url = "/views/tbm/flb/flb_station_task_list.shtml?searchList=" + searchList;
    window.location.href = url;

}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return decodeURI(r[2]);
    return null; //返回参数值
}

function workTypeEdit(workOrderId, type) {
    var title_ = $.i18n.t('航班任务类型修改');
    ShowWindowIframe({
        width: "450",
        height: "250",
        title: title_,
        param: {
            workOrderId: workOrderId,
            type: type
        },
        url: "/views/tbm/flb/flb_flight_work_type_edit.shtml"
    });
}

//初始化固定任务
function initialLineTask(workOrderId) {
    $('#tr_line_task').MyDataGrid({
        identity: 'tr_line_task',
        pageSize: 1,
        pagination: false,
        fitColumns: true,
        // singleSelect: true,
        queryParams: {WorkOrderId: workOrderId},
        frozenColumns: [[
            {
                field: 'name', title: '', width: 20, align: 'center', formatter: function (val, row, index) {
                    // return '<input type="button" class="btn" value="PROCESS"  style="height: 50%" onClick="doAddLineJob_(&apos;" + JSONstringify(row) + "&apos;)"/>'

                    return "<label><input name=\"taskRadio\" type=\"radio\" value=" + row.lineJobId + " onclick='doAddLineJob_(&apos;" + JSONstringify(row) + "&apos;)'/></label> "

                }
            },

        ]],
        columns: {
            param: {FunctionCode: 'FIXED_TASK_DETAIL_INFO'},
            alter: {
                workType: {
                    formatter: function (cellvalue, options, rowObject) {
                        if (cellvalue.indexOf('FLB') == '-1') {
                            if (cellvalue == "Po/F" || (isReleased && isReleased.toUpperCase() === 'RELEASED')) {
                                return cellvalue
                            } else {
                                var btn = cellvalue;
                                btn += '&nbsp;';
                                btn += `<span style="cursor: pointer;position: static;" onclick="workTypeEdit('${workOrderId}','${cellvalue}')" class="l-btn-icon icon-edit">&nbsp;</span>`;
                                return btn;
                            }

                        } else {
                            return cellvalue;
                        }

                    }
                },
                printLine: {
                    formatter: function (value, row) {
                        if (value === null) {
                            if (row.printLock) {
                                return `<img src="/img/icon_pdf.gif" style="cursor:pointer;margin-right:3px;vertical-align: -20%;" onClick="previewPdf('','Fixed','${row.lineJobId}','${row.acId}','')"/><input type="button" style="background-color: #ccc;height: 50%;margin-right: 3px;font-size: 12px;padding: 3px 5px;" disabled class="btn" value="打印"  /><input onClick="unLock('${row.lineJobId}')" type="button"  class="btn" value="解锁"  style="height: 50% ;font-size: 12px;padding: 3px 5px;" />`
                            } else {
                                return `<img src="/img/icon_pdf.gif" style="cursor:pointer;vertical-align: -20%" onClick="previewPdf('','Fixed','${row.lineJobId}','${row.acId}','')"/>
                                <input type="button" class="btn" value="打印" id="jc_print" style="height: 50%"  onClick="jc_viewPdfFun('','Fixed','${row.lineJobId}','${row.acId}','',this)"/>`
                            }

                        }


                    }
                },
                status: {
                    formatter: function (value, row) {
                        if (value) {
                            return row.status;

                        }
                        // return 'JobCard Status:&nbsp;&nbsp;' + row.status + '<br/>' + 'FLB Status:&nbsp;&nbsp;' + row.flbStatus;
                    }
                },
                flbFlag: {
                    formatter: function (value, row) {
                        if (value === true) {
                            return '<input type="button" class="btn" value="FLB" id="jc_print" style="height: 50%" onclick="flbDetail(\'' + row.flbOrderId + '\')"/>'
                        }
                    }
                }
            }
        },
        // 固定表格所占整个表格高度
        resize: function () {
            //return tabs_standard_resize($('#tt'), 0.82, 0, 140, -6);

        },
        onClickRow: function (index, data) {
            var strData = JSON.stringify(data);
            doAddLineJob_(strData);
            var checkedbrowser = document.getElementsByName("taskRadio");
            var len = checkedbrowser.length;
            if (checkedbrowser[index].checked) {
                checkedbrowser[index].checked = false;
            } else {
                for (var i = 0; i < len; i++) {
                    checkedbrowser[i].checked = false;
                }
                checkedbrowser[index].checked = true;

            }
        },
        onLoadSuccess: function (value, rowData, rowIndex) {
            if (value.data.length > 0) {
                console.info(value.data);
                var data = value.data[0].flbOrderId;
                flbOrderId = data;
                // console.log(flbOrderId,'flbOrderId')
                var wkrow = 'FLB';
                var stRow = value.data[0].flbStatusCn;
                var stRowen = value.data[0].flbStatus;
                $(this).datagrid('appendRow', {
                    workType: wkrow,
                    statusCn: stRow,
                    printLine: '',
                    flbOrderId: flbOrderId,
                    flbStatus: stRowen
                });
                if (value.total == 0) {
                    //添加一个新数据行，第一列的值为你需要的提示信息，然后将其他列合并到第一列来，注意修改colspan参数为你columns配置的总列数
                    // $(this).datagrid('appendRow', { workType: '没有相关记录！'});
                    $(this).datagrid('appendRow', {workType: '没有相关记录！'}).datagrid('mergeCells', {index: 0, colspan: 8});
                    // $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
                    // $('#tr_line_task').MyDataGrid('loadData', [{ workType: '没有相关记录！' }])
                    console.log(value);
                }
                //如果通过调用reload方法重新加载数据有数据时显示出分页导航容器
                else {
                    $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();

                }
            }
        }
    })
}

function checkYes(row) {
    var rowData = JSON.parse(row);
    rowData.flag = true;
    var name = `check_list_${rowData.id}`;
    var iptData = $("input[name='" + name + "']").val();
    console.log(iptData);
    // if (iptData == 1) {
    //     $("input[name='" + name + "']").attr("disabled", true);
    // }
    datas = $.extend({}, {Id: rowData.id}, {FunctionCode: 'COMP_CHECK_LIST'});
    InitFuncCodeRequest_({
        data: datas,
        successCallBack: function (jdata) {
            if (jdata.code === RESULT_CODE.SUCCESS_CODE) {
                if (iptData == 1) {
                    $("input[name='" + name + "']").attr("disabled", true);
                }
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                initialCheckListDataGrid(orderId);

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function openDefect(row) {
    event.stopPropagation();    //  阻止事件冒泡
    row = JSON.parse(row);
    defectId = row.ID;
    defectNo = row.DEFECT_NO;
    defect_status = row.STATUS;
    defect_category = row.CATEGORY
}

function to_defect() {
    if ($('input[name="defectRadio"]:checked').val() == '' || $('input[name="defectRadio"]:checked').val() == undefined) {
        MsgAlert({content: '请选择具体故障', type: 'error'});

    } else {
        if (defect_status == 'C') {
            MsgAlert({content: '已完成故障不能再反馈', type: 'error'});
            return;
        }
        if (defect_category == 'DFRL') {
            MsgAlert({content: '已转保留故障不能再反馈', type: 'error'});
            return;
        }
        if (defect_category == 'PEND') {
            MsgAlert({content: '已转推迟故障不能再反馈', type: 'error'});
            return;
        }
        let title = "【故障详情----" + defectNo + "】";
        ShowWindowIframe({
            width: "1000",
            height: "700",
            title: title,
            param: {defectId: defectId, defectNo: defectNo},
            url: "/views/defect/defectDetails.shtml"
        });

    }

}

//固定任务
function doAddLineJob_(row) {
    event.stopPropagation();    //  阻止事件冒泡
    row = JSON.parse(row);
    flbOrderId = row.flbOrderId;
    workType = row.workType;
    taskType = row.taskType;
    status = row.status;
    flbStatus = row.flbStatus;
    remark = row.remark;
    lifeRaftOrNot = row.lifeRaftOrNot;
    // flbOrderId = row.flbOrderId;
    console.log(flbStatus, 'flbStatus')
}

//非例行
function doAddntJob_(row) {
    row = JSON.parse(row.replace(/\n/g,"\\n").replace(/\r/g,"\\r"));
    event.stopPropagation();    //  阻止事件冒泡
    nt_parentId = row.parentId;
    nt_acId = row.acId;
    nt_flbId = row.flbId;
    nt_flightId = row.flightId;
    nt_status = row.status;
    nt_statusCn = row.statusCn;
    nt_workType = row.workType;
    nt_crDate = date;
    nt_description = row.description;
    nt_sonId = row.id;
    nt_ata = row.ata||'';
    nt_cardNumber = row.cardNumber;
    nt_cardId = row.cardId || '';
    nt_acModel = row.model || '';
    nt_station = row.station || '';
    nt_isRii = row.isRii || '';
    nt_isRci = row.isRci || '';
    nt_isDm = row.isDm || '';
    nt_isSd = row.isSd||'';
    nt_beforeFlight = row.preFlightNo || '';
    nt_isFeedbackAttachment = row.isFeedbackAttachment || '';
    nt_isSpecialFeedback = row.isSpecialFeedback || '';
    nt_feedbackExplanation = row.feedbackExplanation || '';
    nt_intervals = row.intervals || '';
    nt_bigModel = row.bigModel || '';
    nt_flightDate = row.flightDate || '';
    nt_preFlightId = row.preFlightId || '';
    nt_preFlightNo = row.preFlightNo || '';
    nt_sapTaskId = row.sapTaskId || '';
    nt_assetNum = row.assetNum || '';
    nt_isRequiredFeedback = row.isRequiredFeedback || '';

}

//例行
function doAddrtJob_(row) {
    debugger
    event.stopPropagation();    //  阻止事件冒泡
    row = JSON.parse(row.replace(/\n/g,"\\n").replace(/\r/g,"\\r"));
    rt_parentId = row.parentId;
    rt_acId = row.acId;
    rt_flbId = row.flbId;
    rt_flightId = row.flightId;
    rt_status = row.status;
    rt_statusCn = row.statusCn;
    rt_workType = row.workType;
    rt_crDate = date;
    rt_description = row.description;
    rt_sonId = row.id;
    rt_cardNumber = row.cardNumber;
    rt_cardId = row.cardId || '';
    rt_acModel = row.model || '';
    rt_station = row.station || '';
    rt_isRii = row.isRii || '';
    rt_isRci = row.isRci || '';
    nt_isDm = row.isDm || '';
    nt_isSd = row.isSd||'';
    nt_ata = row.ata||'';
    rt_beforeFlight = row.preFlightNo || '';
    rt_isFeedbackAttachment = row.isFeedbackAttachment || '';
    rt_isSpecialFeedback = row.isSpecialFeedback || '';
    rt_feedbackExplanation = row.feedbackExplanation || '';
    rt_intervals = row.intervals || '';
    rt_bigModel = row.bigModel || '';
    rt_flightDate = row.flightDate || '';
    rt_preFlightId = row.preFlightId || '';
    rt_preFlightNo = row.preFlightNo || '';
    rt_sapWorkType = row.sapWorkType || '';
    rt_planeHours = row.planeHours || '';
    rt_sapTaskId = row.sapTaskId || '';
    rt_assetNum = row.assetNum || '';

    rt_isRequiredFeedback = row.isRequiredFeedback || '';
}

//退回
function returnBack(type) {
    var sonId = '';
    var wkType = '';
    if (type == 'flx') {
        if ($('input[name="norout_process"]:checked').val() == '' || $('input[name="norout_process"]:checked').val() == undefined) {
            MsgAlert({content: '请选择具体非例行任务', type: 'error'});
            return;
        }
        sonId = nt_sonId;
        wkType = nt_workType;
        if (wkType == 'DEFECT_REVIEW') {
            MsgAlert({content: 'DEFECT_REVIEW任务不能再退回', type: 'error'});
            return;
        }
        if (wkType == 'DEFECT') {
            MsgAlert({content: 'DEFECT任务不能再退回', type: 'error'});
            return;
        }
        if (nt_status == 'COMPLETED') {
            MsgAlert({content: '已完成任务不能再退回', type: 'error'});
            return;
        } else if (nt_status == 'RETURNED') {
            MsgAlert({content: '已返回任务不能再退回', type: 'error'});
            return;
        }
    } else if (type == 'lx') {
        if ($('input[name="rout_process"]:checked').val() == '' || $('input[name="rout_process"]:checked').val() == undefined) {
            MsgAlert({content: '请选择具体例行任务', type: 'error'});
            return;
        }
        sonId = rt_sonId;
        wkType = rt_workType;
        if (wkType == 'DEFECT_REVIEW') {
            MsgAlert({content: 'DEFECT_REVIEW任务不能再退回', type: 'error'});
            return;
        }
        if (rt_status == 'COMPLETED') {
            MsgAlert({content: '已完成任务不能再退回', type: 'error'});
            return;
        } else if (rt_status == 'RETURNED') {
            MsgAlert({content: '已退回任务不能再退回', type: 'error'});
            return;
        }
    }
    var currentWidth = ($(window).width() * 0.7).toString();
    var currentHeight = ($(window).height() * 0.7).toString();
    ShowWindowIframe({
        width: currentWidth,
        height: currentHeight,
        title: "退回",
        param: {
            Id: sonId,
        },
        url: "/views/tbm/flb/returnBack.shtml"

    });
}

function addMr(type) {
    // var curWidth = ($(window).width() * 0.8).toString();
    var curWidth = '1200';
    // var curheight = ($(window).height() * 0.8).toString();
    var curheight = '650';
    var sonId = '';
    var workType = '';
    var station = '';
    var cardNumber = '';
    var cardId = "";
    var intervals = "";
    var sapTaskId = "";
    var assetNum = "";
    if (type == 'flx') {
        if ($('input[name="norout_process"]:checked').val() == '' || $('input[name="norout_process"]:checked').val() == undefined) {
            MsgAlert({content: '请选择具体非例行任务', type: 'error'});
            return;
        }
        sonId = nt_sonId;
        workType = nt_workType;
        station = nt_station;
        cardNumber = nt_cardNumber;
        cardId = nt_cardId;
        intervals = nt_intervals;
        sapTaskId = nt_sapTaskId;
        assetNum = nt_assetNum;
        if (!sonId || !workType || !cardNumber || (!cardId && workType != 'CCO' )) {
            MsgAlert({content: '此条数据有误，不能添加MR', type: 'error'});
            return;
        }
        if (workType == "DEFECT_REVIEW") {
            MsgAlert({content: 'DEFECT_REVIEW任务不能添加MR', type: 'error'});
            return;
        }
        if (nt_status == 'COMPLETED') {
            MsgAlert({content: '已完成任务不能再添加MR', type: 'error'});
            return;
        } else if (nt_status == 'RETURNED') {
            MsgAlert({content: '已退回任务不能再添加MR', type: 'error'});
            return;
        } else if (nt_status == 'CANCELED') {
            MsgAlert({content: '已取消任务不能再添加MR', type: 'error'});
            return;
        }
        let parameters = {
            "tdWorkType": workType,
            "sonId": sonId,
            "station": station,
            "cardNum": cardNumber,
            "acReg": acReg,
            "assetNum":assetNum,
            "cardId": cardId,
            "intervals": intervals,
            "sapTaskId": sapTaskId
        };
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "addMr",
            param: parameters,
            url: "/views/mr/add_mr.shtml"
        });
    } else if (type == 'lx') {
        if ($('input[name="rout_process"]:checked').val() == '' || $('input[name="rout_process"]:checked').val() == undefined) {
            MsgAlert({content: '请选择具体例行任务', type: 'error'});
            return;
        }
        sonId = rt_sonId;
        workType = rt_workType;
        station = rt_station;
        cardNumber = rt_cardNumber;
        cardId = rt_cardId;
        intervals = rt_intervals;
        sapTaskId = rt_sapTaskId;
        assetNum = rt_assetNum;
        if (!sonId || !workType || !cardNumber || (!cardId && workType != 'CCO' )) {
            MsgAlert({content: '此条数据有误，不能添加MR', type: 'error'});
            return;
        }
        if (workType == "DEFECT_REVIEW") {
            MsgAlert({content: 'DEFECT_REVIEW任务不能添加MR', type: 'error'});
            return;
        }
        if (rt_status == 'COMPLETED') {
            MsgAlert({content: '已完成任务不能再添加MR', type: 'error'});
            return;
        } else if (rt_status == 'RETURNED') {
            MsgAlert({content: '已退回任务不能再添加MR', type: 'error'});
            return;
        } else if(rt_status == 'CANCELED') {
            MsgAlert({content: '已取消任务不能再添加MR', type: 'error'});
            return;
        }
        let parameters = {
            "tdWorkType": workType,
            "sonId": sonId,
            "station": station,
            "cardNum": cardNumber,
            "acReg": acReg,
            "assetNum":assetNum,
            "cardId": cardId,
            "intervals": intervals,
            "sapTaskId": sapTaskId,
        };
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "addMr",
            param: parameters,
            url: "/views/mr/add_mr.shtml"
        });
    }
}

//nt_process
function nt_process(type) {
    var url;
    var title_;
    var description = '';
    var workType = '';
    var status = '';
    var statusCn = '';
    var acId = '';
    var flightId = '';
    var flbId = '';
    var crDate = '';
    var sonId = '';
    var cardNumber = '';
    var parentId = '';
    var cardId = '';
    var acModel = '';
    var isRii = '';
    var isRci = '';
    var isDm = '';
    var isSd = '';
    var ata = '';
    var beforeFlight = '';
    var isFeedbackAttachment = '';
    var isSpecialFeedback = '';
    var feedbackExplanation = '';
    var bigModel = '';
    var flightDate = '';
    var preFlightId = '';
    var preFlightNo = '';
    var sapWorkType = '';
    var planeHours = '';
    var isRequiredFeedback = '';
    if (type == 'flx') {
        if ($('input[name="norout_process"]:checked').val() == '' || $('input[name="norout_process"]:checked').val() == undefined) {
            MsgAlert({content: '请选择具体非例行任务', type: 'error'});
            return;
        }
        acId = nt_acId;
        description = nt_description;
        workType = nt_workType;
        status = nt_status;
        statusCn = nt_statusCn;
        crDate = nt_crDate;
        sonId = nt_sonId;
        cardNumber = nt_cardNumber;
        cardId = nt_cardId;
        acModel = nt_acModel;
        flbId = nt_flbId;
        flightId = nt_flightId;
        isRci = nt_isRci;
        ata = nt_ata;
        isDm = nt_isDm;
        isSd = nt_isSd;
        isRii = nt_isRii;
        beforeFlight = nt_beforeFlight;
        isFeedbackAttachment = nt_isFeedbackAttachment;
        isSpecialFeedback = nt_isSpecialFeedback;
        feedbackExplanation = nt_feedbackExplanation;
        bigModel = nt_bigModel;
        flightDate = nt_flightDate;
        preFlightId = nt_preFlightId;
        preFlightNo = nt_preFlightNo;
        // parentId = nt_parentId || '';
        isRequiredFeedback = nt_isRequiredFeedback;
        if (nt_status == 'COMPLETED') {
            MsgAlert({content: '已完成任务不能再反馈', type: 'error'});
            return;
        } else if (nt_status == 'RETURNED') {
            MsgAlert({content: '已返回任务不能再反馈', type: 'error'});
            return;
        } else if (nt_status == 'CANCELED') {
            MsgAlert({content: '已取消任务不能再反馈', type: 'error'});
            return;
        } else if (nt_status == 'CLOSED') {
            MsgAlert({content: '已关闭任务不能再反馈', type: 'error'});
            return;
        }

        switch (nt_workType) {
            case 'TO':
                url = "/views/tbm/flb/to_process.shtml";
                break;
            case 'JC':
                url = "/views/tbm/flb/jc_process.shtml";
                break;
            case 'CCO':
                url = "/views/tbm/flb/cco_process.shtml";
                break;
            case 'NRC':
            case 'NRCT':
            case 'NRCTASK':
                url = "/views/tbm/flb/nrc_process.shtml";
                break;
            case 'PCO':
                url = "/views/tbm/flb/pco_process.shtml";
                break;
            case 'DEFECT_REVIEW':
                url = "/views/tbm/flb/DDreview.shtml";
                break;
            case 'DEFECT':
            case 'DD':
                let title = "【故障详情----" + cardNumber + "】";
                ShowWindowIframe({
                    width: "1000",
                    height: "700",
                    title: title,
                    param: {defectId: cardId, defectNo: cardNumber},
                    url: "/views/defect/defectDetails.shtml"
                });
                return;
            default:
                MsgAlert({content: '任务类型不正确', type: 'error'});
                return;

        }
    } else if (type == 'lx') {
        if ($('input[name="rout_process"]:checked').val() == '' || $('input[name="rout_process"]:checked').val() == undefined) {
            MsgAlert({content: '请选择具体例行任务', type: 'error'});
            return;
        }
        acId = rt_acId;
        flbId = rt_flbId;
        flightId = rt_flightId;
        description = rt_description;
        workType = rt_workType;
        status = rt_status;
        statusCn = rt_statusCn;
        crDate = rt_crDate;
        sonId = rt_sonId;
        cardNumber = rt_cardNumber;
        cardId = rt_cardId;
        acModel = rt_acModel;
        isRci = rt_isRci;
        isRii = rt_isRii;
        isDm = nt_isDm;
        ata = nt_ata;
        isSd = nt_isSd;
        beforeFlight = rt_beforeFlight;
        isFeedbackAttachment = rt_isFeedbackAttachment;
        isSpecialFeedback = rt_isSpecialFeedback;
        feedbackExplanation = rt_feedbackExplanation;
        bigModel = rt_bigModel;
        flightDate = rt_flightDate;
        preFlightId = rt_preFlightId;
        preFlightNo = rt_preFlightNo;
        sapWorkType = rt_sapWorkType;
        planeHours = rt_planeHours;
        // parentId = nt_parentId || '';
        isRequiredFeedback = rt_isRequiredFeedback;
        if (rt_status == 'COMPLETED') {
            MsgAlert({content: '已完成任务不能再反馈', type: 'error'});
            return;
        } else if (rt_status == 'RETURNED') {
            MsgAlert({content: '已退回任务不能再反馈', type: 'error'});
            return;
        } else if (rt_status == 'CANCELED') {
            MsgAlert({content: '已取消任务不能再反馈', type: 'error'});
            return;
        } else if (rt_status == 'CLOSED') {
            MsgAlert({content: '已关闭任务不能再反馈', type: 'error'});
            return;
        }
        //测试
        // rt_workType = "CCO";
        switch (rt_workType) {
            case 'TO':
                url = "/views/tbm/flb/to_process.shtml";
                break;
            case 'JC':
                url = "/views/tbm/flb/jc_process.shtml";
                break;
            case 'CCO':
                url = "/views/tbm/flb/cco_process.shtml";
                break;
            case 'NRC':
            case 'NRCT':
                url = "/views/tbm/flb/nrc_process.shtml";
                break;
            case 'PCO':
                url = "/views/tbm/flb/pco_process.shtml";
                break;
            case 'DEFECT_REVIEW':
            case 'DD':
                url = "/views/tbm/flb/DDreview.shtml";
                break;
            case 'DEFECT':
                url = "/views/tbm/flb/DDreview.shtml";
                let title = "【故障详情----" + cardNumber + "】";
                ShowWindowIframe({
                    width: "1000",
                    height: "700",
                    title: title,
                    param: {defectId: cardId, defectNo: cardNumber},
                    url: "/views/defect/defectDetails.shtml"
                });
                return;
            default:
                MsgAlert({content: '任务类型不正确', type: 'error'});
                return;
        }
    }


    var currentWidth = ($(window).width() * 0.8).toString();
    var currentHeight = ($(window).height() * 0.8).toString();
    var paramFlightNo = "";
    var station = "";
    if (operation == 'O/G' || operation == 'Po/F') {
        paramFlightNo = flightNo;
        station = arrival;
    } else if (operation == 'STA') {
        paramFlightNo = '';
        station = getUrlParam("operation");
    } else {
        paramFlightNo = flightNo;
        station = departure;
    }
    ShowWindowIframe({
        width: currentWidth,
        height: currentHeight,
        title: "航线任务完工反馈",
        param: {
            orderId: orderId,
            description: description,
            acId: acId,
            acReg: acReg,
            flightNo: paramFlightNo,
            operation: operation,
            flightId: flightId,
            flbId: flbId,
            // flbOrderId: flbOrderId,
            // flightNo: flightNo,
            departure: departure,
            arrival: arrival,
            station: station,
            workType: workType,
            status: status,
            statusCn: statusCn,
            nt_crDate: crDate,
            sonId: sonId,
            cardNumber: cardNumber,
            parentId: orderId,
            cardId: cardId,
            acModel: acModel,
            isRii: isRii,
            isRci: isRci,
            isDm : isDm,
            ata: ata,
            isSd : isSd,
            isFeedbackAttachment: isFeedbackAttachment,
            isSpecialFeedback: isSpecialFeedback,
            feedbackExplanation: feedbackExplanation,
            bigModel: bigModel,
            flightDate: flightDate,
            preFlightId: preFlightId,
            preFlightNo: preFlightNo,
            sapWorkType:sapWorkType,
            planeHours:planeHours,
            isRequiredFeedback:isRequiredFeedback
        },
        url: url

    });
}

// 初始化检查清单
function initialCheckListDataGrid(workOrderId) {
    $('#check_list').MyDataGrid({
        // title: "检查清单项",
        identity: 'check_list',
        pagination: false,
        singleSelect: true,
        fitColumns: true,
        queryParams: {workOrderId: workOrderId},
        columns: {
            param: {FunctionCode: 'STATION_TASK_CHECK_LIST'},
            alter: {
                confirmDate: {
                    type: 'datetime'
                },
                isConfirm: {
                    formatter: function (value, rowObject) {
                        if (rowObject && rowObject.isConfirm == 'y') {
                            return "<label><input name='check_list_" + rowObject.id + "' class='cklist' value='1' type='radio' checked='checked' disabled='disabled'/>&nbsp;&nbsp;Y</label>" +
                                "&nbsp;&nbsp;&nbsp;<label><input name='check_list_" + rowObject.id + "' class='cklist' value='0' type='radio' disabled='disabled'/>&nbsp;&nbsp;N</label>";
                        } else {
                            return "<label><input name='check_list_" + rowObject.id + "' class='cklist' value='1' type='radio' />&nbsp;&nbsp;Y</label>" +
                                "&nbsp;&nbsp;&nbsp;<label><input name='check_list_" + rowObject.id + "' class='cklist' value='0' type='radio' checked='checked'/>&nbsp;&nbsp;N</label>";
                        }
                    }
                }
            }
        },
        resize: function () {
            //return tabs_standard_resize($('#tt'), 0.67, 0, 140, -6);

        },
        onLoadSuccess: function (value, rowData, rowIndex) {
        },
        contextMenus: [],
        toolbar: []
    })
}

// 初始化放行信息
function initialReleaseDataGrid(workOrderId) {
    $('#releaseDg').MyDataGrid({
        // title: "RELEASE",
        identity: 'releaseDg',
        pageSize: 1,
        pagination: false,
        singleSelect: true,
        fitColumns: true,
        queryParams: {workOrderId: workOrderId},
        columns: {
            param: {FunctionCode: 'TBM_RELEASE_INFO'},
            alter: {
                releaseDate: {
                    required: true,
                    formatter: function (value) {
                        if (value) {
                            return '<input class="easyui-datetimebox" id="releaseDate" name="releaseDate" value="' + value +
                                '" style="width: 95%; height: 25px;" data-options="required:true,showSeconds:false"/>'
                        } else {
                            var releaseDate = getNowFormatDate();
                            console.log("releaseDate没有值");
                            return '<input class="easyui-datetimebox" id="releaseDate" name="releaseDate" value="' + releaseDate +
                                '" style="width: 95%; height: 25px;" data-options="required:true,showSeconds:false"/>'
                        }
                    }
                },
                // return '<input class="easyui-textbox" id="releaseSignature" name="releaseSignature" value="' + value +
                //     '" style="width: 95%; height: 25px;" data-options="required:true,prompt:\'Enter a release person name...\'"/>'
                releaseSignature: {
                    required: true,
                    formatter: function (value, rowObject) {
                        if (value) {
                            return '<img src="' + value + '" style="width: 95%; height: 25px;">'
                        }
                        return '<div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c3-signature">' + rowObject.signature + '</div>';

                    }
                },
                signature: {
                    required: true,
                    formatter: function (value, rowObject) {
                        if (value) {
                            return '<img src="' + value + '" style="width: 95%; height: 25px;">'
                        }
                        return '<div style="text-align:center;height:auto;" class="datagrid-cell datagrid-cell-c3-signature">' + rowObject.signature + '</div>';

                    }
                },
                signature: {
                    required: true,
                    formatter: function (value) {
                        return '<input class="easyui-textbox" id="releaseSignature" name="releaseSignature" value="' + value +
                            '" style="width: 95%; height: 25px;" data-options="required:true,prompt:\'Enter a release person name...\'"/>'
                    }
                },
                staffNo: {
                    required: true,
                    formatter: function (value) {
                        return '<input class="easyui-textbox" id="staffNo" name="staffNo" value="' + value + '" style="width: 95%; height: 25px;" data-options="required:true"/>'
                    }
                },
                licenseNo: {
                    required: true,
                    formatter: function (value) {
                        if (value) {
                            return '<input class="easyui-textbox" id="licenseNo" name="licenseNo" value="' + value + '" style="width: 95%; height: 25px;" data-options="required:true"/>'
                        } else {
                            return '<input class="easyui-textbox" id="licenseNo" name="licenseNo" value="" style="width: 95%; height: 25px;" data-options="required:true"/>'
                        }
                    }
                }
            }
        },
        resize: function () {
            //return tabs_standard_resize($('#tt'), 0.82, 0, 140, -6);

        },
        onLoadSuccess: function (value, rowData, rowIndex) {
            $('#releaseDate').datetimebox({
                required: true,
                showSeconds: true
            });
            $('#flightId').val(flightId);
            $('#workOrderId').val(workOrderId);
            var this_div =
                '<div style="float:right;padding-right:20px">' +
                '<input type="button" class="releaseBtn" value="放行" style="height:22px" onClick="releaseOperation(' + workOrderId + ')" />&nbsp;&nbsp;' +
                '<input type="button" class="cancelReleaseBtn" value="取消" style="height:22px" />&nbsp;&nbsp;' +
                '</div>';

            $("#release_base_info_td .panel-title").append(this_div);
        },
        contextMenus: [],
        toolbar: []
    })
}

// 初始化故障列表
function initialDefectListDataGrid(workOrderId) {
    $('#defect_list').MyDataGrid({
        identity: 'defect_list',
        pageSize: 5,
        pagination: false,
        singleSelect: true,
        fitColumns: true,
        queryParams: {workOrderId: workOrderId},
        frozenColumns: [[
            {
                field: 'name', title: '', width: 20, align: 'center', formatter: function (val, row, index) {

                    return "<label><input name=\"defectRadio\" type=\"radio\" value=" + row.lineJobId + " onclick='openDefect(&apos;" + JSONstringify(row) + "&apos;)'/></label> "

                }
            },

        ]],
        columns: {
            param: {FunctionCode: 'GET_DEFECT_BY_WORKORDER_ID'},
            alter: {
                confirmDate: {
                    type: 'datetime'
                },
                isConfirm: {
                    formatter: function (value, rowObject) {

                    }
                }
            }
        },
        onClickRow: function (index, data) {
            openDefect(JSON.stringify(data));
            var checkedbrowser = document.getElementsByName("defectRadio");
            var len = checkedbrowser.length;
            if (checkedbrowser[index].checked) {
                checkedbrowser[index].checked = false;
            } else {
                for (var i = 0; i < len; i++) {
                    checkedbrowser[i].checked = false;
                }
                checkedbrowser[index].checked = true;

            }
        },
        resize: function () {
            //return tabs_standard_resize($('#tt'), 0.78, 0, 140, -6);

        },
        onLoadSuccess: function (value, rowData, rowIndex) {
            // if (value.total == 0) {
            //     //添加一个新数据行，第一列的值为你需要的提示信息，然后将其他列合并到第一列来，注意修改colspan参数为你columns配置的总列数
            //     $(this).datagrid('appendRow', { itemid: '<div style="text-align:center;color:red">没有相关记录！</div>' }).datagrid('mergeCells', { index: 0, field: 'itemid', colspan: 8 })
            //     $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
            // }
            // //如果通过调用reload方法重新加载数据有数据时显示出分页导航容器
            // else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
        },
        contextMenus: [],
        toolbar: []
    })
}

// 初始化故障列表
function initialNrcListDataGrid(workOrderId) {
    $('#nrc_list').MyDataGrid({
        identity: 'nrc_list',
        pagination: false,
        sortable: true,
        singleSelect: true,
        fitColumns: true,
        queryParams: {parentId: workOrderId},
        columns: {
            param: {FunctionCode: 'STATION_TASK_DEFECT_NRC'},
            alter: {
                confirmDate: {
                    type: 'datetime'
                },
                status: {
                    formatter: function (value, rowObject) {
                        return value == 1 ? 'OPEN':'CLOSE'
                    }
                },
                repName:{
                    formatter:function (v,r) {
                        return v +'(' + r.repSn + ')'
                    }
                }
            }
        },
        resize: function () {
            //return tabs_standard_resize($('#tt'), 0.78, 0, 140, -6);

        },
        onLoadSuccess: function (value, rowData, rowIndex) {

        },
        contextMenus: [],
        toolbar: []
    })
}

//初始化例行任务
function initialRoutineTaskDataGrid(workOrderId) {
    $('#routine_task_list').MyDataGrid({
        identity: 'routine_task_list',
        pageSize: 5,
        pagination: false,
        singleSelect: true,
        fitColumns: true,
        queryParams: {workOrderId: workOrderId},
        frozenColumns: [[
            {
                field: 'name', title: '', width: 20, align: 'center', formatter: function (val, row, index) {

                    return "<label><input name=\"rout_process\" type=\"radio\" value=" + row.lineJobId + " onclick='doAddrtJob_(&apos;" + JSONstringify(row) + "&apos;)'/></label> "

                }
            },

        ]],
        columns: {
            param: {FunctionCode: 'STATION_TASK_ROUTINE_TASK'},
            alter: {
                confirmDate: {
                    type: 'datetime'
                },
                isConfirm: {
                    formatter: function (value, rowObject) {

                    }
                },
                review: {
                    formatter: function (value, row) {
                        if (row.workType == 'DEFECT' || row.workType == 'DEFECT_REVIEW') {
                            return ''
                        } else {
                            return `<img src="/img/icon_pdf.gif" style="cursor:pointer" onClick="previewPdf('${row.cardId}','${row.workType}','${row.id}','${row.acId}','${row.sapTaskId}')"/>`;
                        }
                    }
                },
                print: {
                    formatter: function (value, row) {
                        if (row.workType == 'DEFECT' || row.workType == 'DEFECT_REVIEW') {
                            return ''
                        } else {
                            if (row.printLock) {
                                if(row.status == "CANCELED"){
                                    return `<input type="button" style="background-color: #ccc;height: 50%;margin-right: 3px;font-size: 12px;padding: 3px 5px;" disabled class="btn" value="打印"  /><input  type="button"  class="btn" value="解锁"  style="height: 50% ; padding: 3px 8px;background-color: #ccc;" />`
                                }else{
                                    return `<input type="button" style="background-color: #ccc;height: 50%;margin-right: 3px;font-size: 12px;padding: 3px 5px;" disabled class="btn" value="打印"  /><input onClick="unLock('${row.id}')" type="button"  class="btn" value="解锁"  style="height: 50% ; padding: 3px 8px" />`
                                }
                            } else {
                                if(row.status == "CANCELED") {
                                    return `<input type="button" class="btn" value="打印" id="jc_print" style="height: 50%;font-size: 12px;padding: 3px 5px;margin-right: 3px;background-color: #ccc;"/>`
                                }else{
                                    return `<input type="button" class="btn" value="打印" id="jc_print" style="height: 50%;font-size: 12px;padding: 3px 5px;margin-right: 3px;"  onclick="jc_viewPdfFun('${row.cardId}','${row.workType}','${row.id}','${row.acId}','${row.sapTaskId}',this)"/>`

                                }
                            }
                        }
                    }
                },
                logs: {
                    formatter: function () {
                        // return '<input type="button" class="btn" value="日志" id="" style="height:25px" onClick=""/>\n';
                        return '<i onclick="" class="fa fa-sort-amount-desc" style="font-size: 14px;cursor:pointer"></i>\n';
                    }
                }
            }
        },
        resize: function () {
            //return tabs_standard_resize($('#tt'), 0.78, 0, 140, -6);

        },
        onClickRow: function (index, data) {
            var strData = JSON.stringify(data);
            doAddrtJob_(strData);
            var checkedbrowser = document.getElementsByName("rout_process");
            var len = checkedbrowser.length;
            if (checkedbrowser[index].checked) {
                checkedbrowser[index].checked = false;
            } else {
                for (var i = 0; i < len; i++) {
                    checkedbrowser[i].checked = false;
                }
                checkedbrowser[index].checked = true;

            }
        },
        onLoadSuccess: function (value, rowData, rowIndex) {
            // if (value.total == 0) {
            //     //添加一个新数据行，第一列的值为你需要的提示信息，然后将其他列合并到第一列来，注意修改colspan参数为你columns配置的总列数
            //     $(this).datagrid('appendRow', { itemid: '<div style="text-align:center;color:red">没有相关记录！</div>' }).datagrid('mergeCells', { index: 0, field: 'itemid', colspan: 13 })
            //     $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
            // }
            // //如果通过调用reload方法重新加载数据有数据时显示出分页导航容器
            // else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
        },
        contextMenus: [],
        toolbar: []
    })
}

function listreload_() {
    $("#non_routine_task_list").datagrid("reload");
    $("#routine_task_list").datagrid("reload");
    $('#nrc_list').datagrid("reload");
    if (operation === "Po/F" || operation === "Pr/F" || operation === "T/R") {
        $("#tr_line_task").datagrid("reload");
        $('#defect_list').datagrid("reload");
    }
}

function refreshPage() {
    listreload_();
    if (operation === "Po/F" || operation === "Pr/F" || operation === "T/R") {
        initialReleaseDataGrid(orderId);
        initialCheckListDataGrid(orderId);
    }

}

//初始化非例行任务
function initialNonRoutineTaskDataGrid(workOrderId) {
    $('#non_routine_task_list').MyDataGrid({
        identity: 'non_routine_task_list',
        pageSize: 5,
        pagination: false,
        singleSelect: true,
        fitColumns: true,
        queryParams: {workOrderId: workOrderId},
        frozenColumns: [[
            {
                field: 'name', title: '', width: 20, align: 'center', formatter: function (val, row, index) {

                    return "<label><input name=\"norout_process\" type=\"radio\" value=" + row.lineJobId + " onclick='doAddntJob_(&apos;" + JSONstringify(row) + "&apos;)'/></label> "

                }
            },

        ]],
        columns: {
            param: {FunctionCode: 'STATION_TASK_NON_ROUTINE_TASK'},
            alter: {
                print: {
                    formatter: function (value, row, index) {
                        if (row.workType == 'DEFECT' || row.workType == 'DEFECT_REVIEW') {
                            return ''
                        } else {
                            if (row.printLock) {
                                if(row.status == 'CANCELED'){
                                    return `<img src="/img/icon_pdf.gif" style="cursor:pointer;margin-right:3px;vertical-align: -20%;" onClick="previewPdf('${row.cardId}','${row.workType}','${row.id}','${row.acId}','${row.sapTaskId}')"/><input type="button" style="background-color: #ccc;height: 50%;margin-right: 3px;font-size: 12px;padding: 3px 5px;" disabled class="btn" value="打印"  /><input  type="button"  class="btn" value="解锁"  style="height: 50% ;font-size: 12px;padding: 3px 5px;background-color: #ccc;" />`

                                }else{
                                    return `<img src="/img/icon_pdf.gif" style="cursor:pointer;margin-right:3px;vertical-align: -20%;" onClick="previewPdf('${row.cardId}','${row.workType}','${row.id}','${row.acId}','${row.sapTaskId}')"/><input type="button" style="background-color: #ccc;height: 50%;margin-right: 3px;font-size: 12px;padding: 3px 5px;" disabled class="btn" value="打印"  /><input onClick="unLock('${row.id}')" type="button"  class="btn" value="解锁"  style="height: 50% ;font-size: 12px;padding: 3px 5px;" />`
                                }
                            } else {
                                if(row.status == 'CANCELED'){
                                    return `<img src="/img/icon_pdf.gif" style="cursor:pointer;vertical-align: -20%;margin-right:3px;" onClick="previewPdf('${row.cardId}','${row.workType}','${row.id}','${row.acId}','${row.sapTaskId}')"/><input type="button" class="btn" value="打印" id="jc_print" style="height: 50%;font-size: 12px;padding:3px 5px;margin-right:3px;background-color: #ccc;" />`
                                }else{
                                    return `<img src="/img/icon_pdf.gif" style="cursor:pointer;vertical-align: -20%;margin-right:3px;" onClick="previewPdf('${row.cardId}','${row.workType}','${row.id}','${row.acId}','${row.sapTaskId}')"/><input type="button" class="btn" value="打印" id="jc_print" style="height: 50%;font-size: 12px;padding:3px 5px;margin-right:3px;"  onclick="jc_viewPdfFun('${row.cardId}','${row.workType}','${row.id}','${row.acId}','${row.sapTaskId}',this)"/>`
                                }

                            }
                        }
                    }
                },
                feedbackAttach: {
                    formatter: function (value, row) {
                        return `<img src="/img/edit2.png" onClick="checkUpload('${row.id}')" border="0" style="width:17px;height:17px;"/>`;
                    }
                },
                logs: {
                    formatter: function () {
                        // return '<input type="button" class="btn" value="日志" id="" style="height:25px" onClick=""/>\n';
                        return '<i onclick="" class="fa fa-sort-amount-desc" style="font-size: 14px;cursor:pointer"></i>\n';
                    }
                }

            }
        },
        resize: function () {
            //return tabs_standard_resize($('#tt'), 0.78, 0, 140, -6);

        },
        onClickRow: function (index, data) {
            var strData = JSON.stringify(data);
            doAddntJob_(strData);
            var checkedbrowser = document.getElementsByName("norout_process");
            var len = checkedbrowser.length;
            if (checkedbrowser[index].checked) {
                checkedbrowser[index].checked = false;
            } else {
                for (var i = 0; i < len; i++) {
                    checkedbrowser[i].checked = false;
                }
                checkedbrowser[index].checked = true;

            }
        },
        onLoadSuccess: function (value, rowData, rowIndex) {
            // if (value.total == 0) {
            //     //添加一个新数据行，第一列的值为你需要的提示信息，然后将其他列合并到第一列来，注意修改colspan参数为你columns配置的总列数
            //     $(this).datagrid('appendRow', { itemid: '<div style="text-align:center;color:red">没有相关记录！</div>' }).datagrid('mergeCells', { index: 0, field: 'itemid', colspan: 14 })
            //     $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').hide();
            // }
            // //如果通过调用reload方法重新加载数据有数据时显示出分页导航容器
            // else $(this).closest('div.datagrid-wrap').find('div.datagrid-pager').show();
        },
        contextMenus: [],
        toolbar: []
    })
}

function checkUpload(sonId) {
    $("#uploadList").empty();
    InitFuncCodeRequest_({
        data: {
            SOURCE_ID: sonId,
            CATEGORY: 'feedback',
            FunctionCode: 'ATTACHMENT_RSPL_GET'
        },
        successCallBack: function (jdata) {
            if (jdata.data.length == 0) {
                MsgAlert({content: "暂未上传附件", type: 'error'});
                return;
            }
            $('#checkUpload').window('open');
            for (var i = 0; i < jdata.data.length; i++) {
                var trHTML = '<tr><td class="td5"><a style="min-height: 35px;line-height: 35px;display: block;padding-left: 10px" target="_blank" onclick="downFile(' + jdata.data[i].PKID + ',' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a></td></tr>';
                $("#uploadList").append(trHTML);//在table最后面添加一行
                // downFile(jdata.data[i].PKID,jdata.data[i].PKID);
            }
        }
    });
}

function previewPdf(cardId, workType, wkId, acId, sapId) {

    // udpate by yy 抽取PTF预览代码JS  print_card_utils.js
    let ops = {cardId: cardId, workType: workType, wkId: wkId, acId: acId, sapId: sapId};
    return preView_Pdf(ops);


}

// 初始化重要事件报告
function initialEventReportDataGrid(workOrderId) {
    $("#eventReport").MyDataGrid({
        // title: "重要事件报告",
        identity: 'eventReport',
        sortable: true,
        singleSelect: true,
        pagination: false,
        fitColumns: true,
        pageSize: 10,
        queryParams: {workOrderId: workOrderId},
        columns: {
            param: {FunctionCode: 'STATION_TASK_EVENT_REPORT'},
            alter: {}
        },
        resize: function () {
            //return tabs_standard_resize($('#tt'), 0.6, 0, 140, -6);

        },
        onLoadSuccess: function () {
        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "common:COMMON_OPERATION.EDIT", auth: "",
                onclick: function () {
                    var rowData = getDG('eventReport').datagrid('getSelected');
                    if (!rowData.id) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    openEventReportDetail('edit', rowData.id);
                }
            },
            {
                id: "m-delete", i18nText: "common:COMMON_OPERATION.DEL", auth: "",
                onclick: function () {
                    var rowData = getDG('eventReport').datagrid('getSelected');
                    if (!rowData.id) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {id: rowData.id, FunctionCode: 'STATION_TASK_EVENT_REPORT_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                eventReportReload_();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        toolbar: [{
            id: 'btnAdd',
            text: $.i18n.t('common:COMMON_OPERATION.ADD'),
            iconCls: 'icon-add',
            handler: function () {
                addEventReportData('add');
            }
        }, '-', {
            id: 'btnReload',
            text: $.i18n.t('common:COMMON_OPERATION.RELOAD'),
            iconCls: 'icon-reload',
            handler: function () {
                $("#eventReport").datagrid("reload");
            }
        }],
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            openEventReportDetail("view", value.ID);
        }
    });
}

/**
 * 分配任务
 * */
function AssignTask(workOrderId) {
    var title_ = 'Assign Line Maintenance Job Card';
    var currentWidth = $(window).width;
    var currentHeight = $(window).height;
    console.log("currentWidth: " + currentWidth + ", currentHeight: " + currentHeight);
    ShowWindowIframe({
        width: 600,
        height: 400,
        title: title_,
        param: {workOrderId: workOrderId},
        url: "/views/tbm/flb/assign_flb_task.shtml"
    });
}


/**
 * 放行
 * */
function releaseOperation(workOrderId) {
    //获取行
    // console.log("releaseOperation=============");
    var rows = $('#check_list').datagrid('getRows'); //获取当前页的数据行
    var baseInfo = $('#releaseDg').datagrid('getRows'); // 获取放行信息
    var releaseInfo = {};
    var checkList = [];
    var releasePersonalInfo = {};
    var regex = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;
    var paramLegalFlag = true;
    // 获取检查清单信息
    if (rows) {
        for (var i = 0; i < rows.length; i++) {
            var tmp = rows[i];
            var tmpCheckListName = 'check_list_' + rows[i].id.toString();
            var checkedValue = $("input[name=" + tmpCheckListName + "]:checked").val();
            console.log("rowId:" + rows[i].id + ",checked value: " + checkedValue);
            if (checkedValue === "1") {
                var rowData = {
                    id: tmp.id,
                    workorderId: tmp.workorderId,
                    seq: tmp.seq,
                    checkItem: tmp.checkItem,
                    isConfirm: checkedValue,
                    confirmDate: new Date(getNowFormatDate()) //放行日期
                };
                checkList.push(rowData);
            } else {
                paramLegalFlag = false;
                alert(tmp.checkItem + "还未确认！");
                break;
            }
        }
    }
    if (paramLegalFlag) {
        // 获取放行人基本信息
        if (baseInfo) {

            var baseInfoTmp = {
                checkType: baseInfo[0].checkType,
                releaseSignature: document.getElementById("releaseSignature").value,
                staffNo: document.getElementById("staffNo").value,
                licenseNo: document.getElementById("licenseNo").value,
                releaseDate: $("#releaseDate").datetimebox("getValue")
            };
            console.log("check_list has -------" + JSON.stringify(baseInfoTmp));
            if (baseInfoTmp.releaseSignature != null && baseInfoTmp.releaseSignature != "") {

            } else {
                paramLegalFlag = false;
                alert("放行人员信息releaseSignature不可为空！");
            }
            if (baseInfoTmp.staffNo != null && baseInfoTmp.staffNo != "") {

            } else {
                paramLegalFlag = false;
                alert("放行人员信息staffNo不可为空！");
            }
            if (baseInfoTmp.licenseNo != null && baseInfoTmp.licenseNo != "") {

            } else {
                paramLegalFlag = false;
                alert("放行人员信息licenseNo不可为空！");
            }
            if (baseInfoTmp.releaseDate != null && baseInfoTmp.releaseDate != "") {
                if (!regex.test(baseInfoTmp.releaseDate)) {
                    alert("请输入正确的时间格式，如：2010-07-07 09:12:00");
                    paramLegalFlag = false;
                } else {

                }

            } else {
                paramLegalFlag = false;
                alert("放行人员信息releaseDate不可为空！");
            }

            releasePersonalInfo = {
                checkType: baseInfoTmp.checkType,
                releaseSignature: baseInfoTmp.releaseSignature,
                signature: baseInfoTmp.releaseSignature,
                staffNo: baseInfoTmp.staffNo,
                licenseNo: baseInfoTmp.licenseNo,
                //todo 需要格式化时间
                // releaseDate: new Date(baseInfoTmp.releaseDate)
                releaseDate: baseInfoTmp.releaseDate
            }

        } else {
            alert("请填写放行人员信息！");
            paramLegalFlag = false;
        }
    }

    if (paramLegalFlag) {
        releaseInfo.workOrderId = workOrderId;
        releaseInfo.flightId = flightId;
        releaseInfo.checkList = checkList;
        releaseInfo.releasePersonalInfo = releasePersonalInfo;
        var url = "/api/v1/tbm/detail/release_operation";
        $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(releaseInfo),
            dataType: "json",
            success: function (data) {
                console.log("成功返回，data:" + JSON.stringify(data, null, '  '));
                if (data.code === 200) {
                    isReleased = 'RELEASED';
                    window.alert("放行成功！");
                    listreload_();
                    console.log("data:" + data);
                    if (isReleased && isReleased.toUpperCase() === 'RELEASED') {
                        changeTableReadOnly();
                        // 如果航班已放行，放行控件不可见
                        $('#releaseBtn').hide();
                        $('#cancelReleaseBtn').show();
                    } else {
                        $('#cancelReleaseBtn').hide();
                    }
                } else {
                    var errMsg = data.msgData[0] ? data.msgData[0] : data.msg;
                    window.alert("放行失败！失败原因：" + errMsg);
                }
            },
            error: function () {
                window.alert("放行失败！");
            }
        });
    }
}


/**
 *  添加重要事件报告
 * */
function addEventReportData() {
    openEventReportDetail(operation, '');
}

//打开重要事件详情页面
function openEventReportDetail(operation, id) {
    var title_ = $.i18n.t('重要事件详情');
    ShowWindowIframe({
        width: "610",
        height: "280",
        title: title_,
        param: {operation: operation, id: id, workOrderId: orderId},
        url: "/views/tbm/flb/important_event_detail.shtml"
    });
}


/**获取当前时间*/
function getNowFormatDate() {
    var date = new Date();
    var dateSeparator = "-";
    var timeSeparator = ":";
    var month = formatDate(date.getMonth() + 1);
    var strDate = formatDate(date.getDate());
    return date.getFullYear() + dateSeparator + month + dateSeparator + strDate
        + " " + formatDate(date.getHours()) + timeSeparator + formatDate(date.getMinutes())
        + timeSeparator + formatDate(date.getSeconds());
}

/**
 * 格式化时间段
 * */
function formatDate(t) {
    var tmp;
    if (t >= 0 && t <= 9) {
        tmp = "0" + t;
    } else {
        tmp = t;
    }
    console.log("tmp date:" + tmp);
    return tmp;
}

//刷新
function eventReportReload_() {
    $("#eventReport").datagrid("reload");
}

//取消放行
function cancelRelease() {
    alert("确认取消航班放行？");
    var $form = $("#mform");
    var isValidate = $form.form('validate');
    if (!isValidate)
        return;

    var datas = $form.serializeObject();
    console.log("event report datas: " + JSON.stringify(datas));

    var url = "/api/v1/tbm/detail/cancel_release";
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(datas),
        dataType: "json",
        success: function (data) {
            console.log("成功返回，data:" + JSON.stringify(data, null, '  '));
            if (data.code === 200) {
                isReleased = 'UNRELEASED';
                listreload_();
                if (isReleased && isReleased.toUpperCase() === 'RELEASED') {
                    changeTableReadOnly();
                    // 如果航班已放行，放行控件不可见
                    $('#releaseBtn').hide();
                    $('#cancelReleaseBtn').show();
                } else {
                    $('#releaseBtn').show();
                    $('#cancelReleaseBtn').hide();
                }
                $('#cancelReleaseWindow').window('close');
                window.alert("取消放行成功！");
            } else {
                $('#cancelReleaseWindow').window('close');
                var errMsg = data.msgData[0] ? data.msgData[0] : data.msg;
                window.alert("取消放行失败！失败原因：" + errMsg);

                //todo 父窗口（详情页窗口控件改变，页面变成可编辑）
                window.close();
            }
        },
        error: function () {
            window.alert("放行失败！");
        }
    });
}

//关闭放行弹窗
function closeRelease() {
    $('#cancelReleaseWindow').window('close');
}

$(function () {
    $("#releaseBtn").click(function () {
        releaseOperation(orderId);
    });
    $("#cancelReleaseBtn").click(function () {
        // cancelReleaseOperation(orderId);
        $('#cancelReleaseWindow').window('open');
        $('#cancelReason').textbox('setValue', '');
        $("#cancelReleaseWindow").panel("move", {top: $(document).scrollTop() + ($(window).height() - 100) * 0.5});
    });
});

//process弹窗
var isInterAir;
function process_popup() {
    // var rowData = getDG('tr_line_task').datagrid('getChecked');
    // console.log($('input[name="taskRadio"]:checked').val(), 'haha');
    if ($('input[name="taskRadio"]:checked').val() == '' || $('input[name="taskRadio"]:checked').val() == undefined) {
        MsgAlert({content: '请选择具体任务', type: 'error'});
        return false;
    } else {
        if (status == 'COMPLETED') {
            MsgAlert({content: '已完成任务不能再反馈', type: 'error'});
            return;
        }
        if ($('input[name="taskRadio"]:checked').val() == 'undefined') {
            console.log(flbStatus, 'flbStatus');
            if (flbStatus != 'ISSUED' && flbStatus != 'ENTERED') {
                MsgAlert({content: 'FLB任务状态不能再反馈', type: 'error'});
                return;
            } else {
                flbDetail();
                return;
            }
        }
    }

    // if(status == 'PROCESSING' || status == 'ISSUED'  || status == 'OPEN'){
    var currentWidth = ($(window).width() * 0.5).toString();
    var currentHeight = ($(window).height() * 0.6).toString();
    reload_();
    if (operation == 'T/R' || operation == 'Pr/F' || operation == 'TBFTR' || operation == 'TBF') {

        $.ajax({
            url: "/api/v1/odsfoc/getIntlFlgFlag?flightId=" + flightId,
            dataType : "json",
            contentType : 'application/json;charset=utf-8',
            type : 'GET',
            async : true,
            cache : false,
            success : function(obj, textStatus) {
                if(obj.code == '200'){
                    isInterAir = obj.data;
                    if (isInterAir === true) {
                        $('.interAirline').css({display: 'table-row'});
                    } else {
                        $('.interAirline').css({display: 'none'});

                    }
                    $("#process_dd").dialog({
                        resizable: true,
                        modal: true,
                        top: '100px',
                        left:'10%',
                        width:"900px",
                        height: currentHeight,
                        title: '航前任务完工反馈'
                    });
                    fengzhuang('wkCount');
                    fengzhuang('checkWayNum','checkWayName');

                    if (lifeRaftOrNot == 'y') {
                        $('.specialCard').css({display: 'table-row'});
                    } else {
                        $('.specialCard').css({display: 'none'});

                    }
                    $('.hanghou').css({display: 'none'});
                    $('#adId').text(acReg || '');
                    $('#fltId').text(flightNo || '');
                    $('#fltDate').text(jobDate || '' );
                    $('#fltSta').text(departure || '');
                    $('#fltType').text(taskType || '');
                    $('#taskClass').text(workType || '');
                    $('#taskDesc').text(remark || '');
                    $('#taskStatus').text(status || '');
                    $('#id').val(orderId);
                }
            },
            error:function () {

            }
        });




    } else if (operation == 'O/G' || operation == 'Po/F') {
        $("#process_dd").dialog({
            resizable: true,
            modal: true,
            top: '100px',
            left: '15%',
            width: "900px",
            height: currentHeight,
            title: '航后任务完工反馈'
        });
        fengzhuang('wkCount');
        fengzhuang('checkWayNum','checkWayName');


        $('.hanghou').css({display: 'table-row'});
        $('#adId').text(acReg || '');
        $('#fltId').text(flightNo || '');
        $('#fltDate').text(jobDate || '');
        $('#fltSta').text(arrival || '');
        $('#fltType').text(workType || '');
        $('#taskClass').text(taskType || '');
        $('#taskDesc').text(remark || '');
        $('#taskStatus').text(status || '');
        $('#id').val(orderId);
    }
    // }else{
    //     MsgAlert({content: '仅状态为PROCESSING、ISSUED、OPEN的航线任务可操作！', type: 'error'});
    //
    // }


}

fengzhuang("wkCount");


function fengzhuang(id,name) {

    //下个审批人选择初始化
    $("#" + id).MyComboGrid({
        idField: 'ACCOUNT_NUMBER',  //实际选择值
        textField: 'ACCOUNT_NUMBER', //文本显示值
        panelHeight: '200px',
        required: true,
        width: "120",
        params: {FunctionCode: 'FLOW_WORK_ACCOUNT'},
        columns: [[
            {field: 'ACCOUNT_NUMBER', title: '工号', width: 50},
            {field: 'USER_NAME', title: '审核人', width: 50}
        ]],
        onHidePanel: function () {
            var t = $(this).combogrid('getValue');
            if (t != null && t != '' & t != undefined) {
                if (selectRow == null || t != selectRow.ACCOUNT_NUMBER) {//没有选择或者选项不相等时清除内容
                    alert('请选择，不要直接输入！');
                    $(this).combogrid({value: ''});
                }
            }
        },
        onSelect: function (index, row) {
            selectRow = row;
            name ? $("#" + name).textbox('setValue', row.USER_NAME):$("#wkName").textbox('setValue', row.USER_NAME);

        }
    });
}

function close_process() {
    $('#process_dd').dialog('close');
}

//assign弹窗
function assignbtn() {
    $("#assign_dd").dialog({
        resizable: false,
        modal: true,
        top: '110px',
    });
}

//dowloadCrads
function dowloadCrads() {
    // $("#cards_dd").dialog({
    //     resizable: false,
    //     modal: true,
    //     top: '110px'
    // });
    ajaxLoading();
    let url = "/api/v1/station_task/staCardsDownload";
    let con = "<form id='_fd_rm' method='GET' action='" + url + "'>" +
        "<input class=\"beiliao\" value=\"" + orderId + "\"  type=\"text\" name=\"workOrderId\" >" +
        "</form>";
    $("body").append(con);
    $("#_fd_rm").submit();
    $("#_fd_rm").remove();
    ajaxLoadEnd();

}

/**
 * *任务清单打印
 */
function taskListPdf() {
    let url = "/api/v1/station_task/tbmTaskListPrint";
    let con = "<form id='_f0_rm' method='GET' action='" + url + "'>" +
        "<input class=\"beiliao\" value=\"" + orderId + "\"  type=\"text\" name=\"workOrderId\" >" +
        "</form>";
    $("body").append(con);
    $("#_f0_rm").submit();
    $("#_f0_rm").remove();
}

//material_list弹窗
function material_list() {
    $.ajax({
        url: "/api/v1/sta/mr/querymrwonum?workOrderId=" + orderId,
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        type: 'GET',
        async: true,
        cache: false,
        success: function (obj, textStatus) {
            if (obj.code == '200') {
                var title_ = $.i18n.t('material_list');
                var currentWidth = $(window).width().toString();
                var currentHeight = $(window).height().toString();
                ShowWindowIframe({
                    width: currentWidth,
                    height: currentHeight,
                    title: title_,
                    param: {List: obj.data},
                    url: "/views/mr/mr_item.shtml"
                });
            } else {

            }
        },
        error: function () {

        }
    });


}

//tool_list弹窗
function tool_list() {
    var title_ = $.i18n.t('material_list');
    var currentWidth = $(window).width().toString();
    var currentHeight = $(window).height().toString();
    ShowWindowIframe({
        width: currentWidth,
        height: currentHeight,
        title: title_,
        param: {},
        url: "/views/tbm/flb/tool_list.shtml"
    });
}

function unLock(wkId) {
    event.stopPropagation();    //  阻止事件冒泡
    var url = "/api/v1/station_task/unlock_task?workOrderId=" + wkId;
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.code === 200) {
                listreload_();
            } else {
                // MsgAlert({content: '连接错误', type: 'error'});
                MsgAlert({content: data.msgData[0] ? data.msgData[0] : data.msg, type: 'error'});
            }
        },
        error: function () {
            MsgAlert({content: '服务器错误', type: 'error'});
        }
    });
}

// 打印pdf
function jc_viewPdfFun(id, type, wkId, acId, sapId, that) {
    // var data = JSON.parse(row)
    event.stopPropagation();    //  阻止事件冒泡
    console.info(that);
    if (type == 'TO' || type == 'JC') {
        if (id == 'null' || wkId == '') {
            MsgAlert({content: '此条数据缺少cardId或workorderId', type: 'error'});
            return;
        }
    }

    if(acId==null || acId=='null'){
        acId='';
    }

    // udpate by yy 抽取PTF预览代码JS  print_card_utils.js
    let ops = {
        id: id, type: type, wkId: wkId, acId: acId, sapId: sapId, back: function () {
            let typeObj = {
                'NRC': 1,
                'NRCT': 1,
                'TO': 1,
                'JC': 1,
                'PCO': 1,
                'Fixed': 1,
                'CCO': 1,
            };
            if (typeObj[type]) {
                setTimeout(function () {
                    $(that).attr("disabled", "disabled");
                    $(that).css({'background': '#ccc'});
                    $(that).parent().append(`<input type="button" onClick="unLock('${wkId}')" class="btn" value="解锁" style="height: 50%; background: #2465a8;font-size: 12px;padding:3px 5px;">`);
                }, 500);
            }
        }
    };
    printCardPdf(ops)


}

function Determine_export() {
    var $form_ = $("#approval_form");
    var now = new Date();
    var cltTime = new Date($('#completeDate').datetimebox('getValue'));
    if (cltTime > now) {
        MsgAlert({content: '完工时间不能大于当前时间', type: 'error'});
        return false;
    }
    // $("#checkWayNum").textbox('setValue', '');
    // $("#checkWayName").textbox('setValue', '');
    let uploadItem = $('.uploadId');
    if(uploadItem.length < 1){
        let withoutPic = $("#withoutPic").val().trim();
        if(!withoutPic){
            MsgAlert({type: "error", content: "无附件时，无照片备注必填"});
            return false;
        }
    }
    var datas = {
        id: $('input[name="taskRadio"]:checked').val(),
        hours: $('#hours').textbox('getValue'),
        feedbackCh: $('#feedbackCh').textbox('getValue'),
        completeDate: $('#completeDate').datetimebox('getValue'),
        mechanicSn: $('#wkCount').combobox('getValue'),
        mechanicName: $('#wkName').textbox('getValue'),
        mechanicNoPhotoRemark:$("#withoutPic").val().trim(),
        Status: 'COMPLETED',
    };
    var zjWay = $('input[name="checkWay"]:checked').val();
    if(zjWay) {
        datas.isRci = 'Y';
        datas.inspector = $("#checkWayName").textbox('getValue');
        datas.inspectorNo = $("#checkWayNum").textbox('getValue');
    }else{
        datas.isRci = '';
    }

    if (operation == 'T/R' || operation == 'Pr/F' || operation == 'TBFTR' || operation == 'TBF') {
        if (typeof (lifeRaftOrNot) != "undefined") {
            switch (lifeRaftOrNot) {
                case "n":
                    break;
                case "y":
                    datas.hasLifeRaft = $("input[name='statusCard']:checked").val();
                    break;
                default:
                    MsgAlert({content: '航前特检卡状态有误', type: 'error'});
                    break;
            }
        };

        var lapTop = $('input[name="interAirline"]:checked').val();
        isInterAir && (datas.laptopBag = lapTop);
        if(isInterAir && !lapTop){
            MsgAlert({content: '驾驶舱国际航班随机电脑包是否在位必填', type: 'error'});
            return
        }
    } else {
        datas.hasLifeRaft = $("input[name='status']:checked").val();
        datas.oxPress = $('#oxygen').textbox('getValue');
    }
    var expObj = {
        hours:'人工时',
        feedbackCh:'反馈信息',
        completeDate:'完工时间',
        mechanicSn:'工作者姓名',
        mechanicName:'工作者工号',
        oxPress:'机组氧气压力',
        hasLifeRaft:'两套救生筏是否在位',
        inspector:'校验员',
    };
    for (var key in datas) {
        if (key != 'isRci' && !datas[key] && key != 'feedbackCh' && key != 'mechanicNoPhotoRemark') {
            var text = expObj[key];
            MsgAlert({content: '请填写' + text, type: 'error'});
            return;
        }
    }


    datas = $.extend({}, datas, {FunctionCode: 'ADD_ROUTE_CARD_FEEDBACK'});
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code === RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                $('#process_dd').dialog('close');
                initialLineTask(orderId);
            } else {
                MsgAlert({content: jdata.msgData ? jdata.msgData[0] : jdata.msg, type: 'error'});
            }
        }
    });


}

//cancel_socket_list弹窗
function cancel_socket_list() {
    debugger;
    var curWidth = ($(window).width() * 0.8).toString();
    var curheight = $(window).height().toString();
    var toListFromStation = (!!arrival && arrival !== "null")?arrival:"";
    var toListFlightNo = (!!flightNo && flightNo !== "null")?arrival:"";
    var toListFlightId = (!!flightId && flightId !== "null")?arrival:"";
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: 'cancel_socket_list',
        param: {
            workorderId: orderId,
            fromStation: toListFromStation,
            flightNo:toListFlightNo,
            flightId:toListFlightId,
        },
        url: "/views/cs/cancel_socket_list.shtml"
    });
}


//外站发料
function external_distribute(){
    var curWidth = ($(window).width() * 0.8).toString();
    var curheight = '600';
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: '外站发料',
        param: {
            workorderId: orderId,
            fromStation: distributeStation
        },
        url: "/views/tbm/flb/external_distribute.shtml"
    });
}