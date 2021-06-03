var prePgParam = getParentParam_();
var oprType = prePgParam.operation || 'add';
var incidentData = {};
var PAGE_DATA = {};
var incidentDetailDesces = [];
var checkType = {'Pr/F':'航前', 'Po/F':'航后', 'T/R':'短停', 'O/G':'停场'};
var isFlow = prePgParam.isFlow;
var incidentPkid = prePgParam.pkid;
var isMcc;
function i18nCallBack() {
    InitFuncCodeRequest_({
        data: {
            domainCode: "MSGRP,MCC_INCIDENT_TYPE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //非正常事件状态初始化
                $('#acno').combobox({
                    panelHeight: '140px',
                    data: jdata.data.MSGRP,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (item) {
                        InitFuncCodeRequest_({
                            data: {acno: item.VALUE, FunctionCode: "SELECT_ACTYPE_BY_ACNO"},
                            successCallBack: function (jdata) {
                                $('#actype').val(jdata.data.VALUE);
                            }
                        })
                    }
                });
                PAGE_DATA['acno'] = DomainCodeToMap_(jdata.data["MSGRP"]);
                PAGE_DATA['oprType'] = DomainCodeToMap_(jdata.data["MCC_INCIDENT_TYPE"]);
                initForm();
                initIncidentDetailGrid();
            }else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

/**
* 根据操作类型进行界面的初始化
*/
function initForm(){
    // load events
    $('#isChkDefect').change(function(){
        var checked = $('#isChkDefect').is(':checked');
        if (checked){
            $('#defectSearchImg').css('display', 'inline');
        }else{
            $('#defectSearchImg').css('display', 'none');
        }
    });

    $('#isNotChkDefect').change(function () {
        var checked = $('#isNotChkDefect').is(':checked');
        if (checked) {
            $('#defectSearchImg').css('display', 'none');

            $('#defectId').val("");
            $('#defectNo').val("");
            $('#defectIdShow').html("");
            $('#ata').textbox('setValue', '');
        } else {
            $('#defectSearchImg').css('display', 'inline');
        }
    });

    $('#isDelayChk').change(function(){
        var checked = $('#isDelayChk').is(':checked');
        if (checked){
            $('#delayTime').textbox('readonly', false);
        }else{
            $('#delayTime').textbox('readonly', true);
            $('#delayTime').textbox('setValue', '');
        }
    });

    $('#isOtherOprChk').change(function(){
        var checked = $('#isOtherOprChk').is(':checked');
        if (checked){
            $('#otherOperation').textbox('readonly', false);
        }else{
            $('#otherOperation').textbox('readonly', true);
            $('#otherOperation').textbox('setValue', '');
        }
    });

    $('#isOtherExternalChk').change(function(){
        var checked = $('#isOtherExternalChk').is(':checked');
        if (checked){
            $('#otherExternal').textbox('readonly', false);
        }else{
            $('#otherExternal').textbox('readonly', true);
            $('#otherExternal').textbox('setValue', '');
        }
    });

     $('#isOtherMaintChk').change(function(){
         var checked = $('#isOtherMaintChk').is(':checked');
         if (checked){
             $('#otherMaintain').textbox('readonly', false);
         }else{
             $('#otherMaintain').textbox('readonly', true);
             $('#otherMaintain').textbox('setValue', '');
         }
     });

    // bind click事件
    $("#addIncidentDesc").bind('click', function(){
        $('#detailDescTable').datagrid('appendRow', {});
    });

    $("#recoverTime").datetimebox({
        onChange: function(prepareDate){
          calcPlanStopDays(prepareDate);
        }
    });

    if (oprType == 'edit'){
        fillFormEle();
        $('#viewShowDiv').remove();
    }else if (oprType == 'view'){
        fillFormEle();
        //删除保存按钮
        $('#saveButton').remove();
        $('#submitFlowButton').remove();
        $('#addIncidentDesc').remove();
        //显示反馈附件
        $("#attachesUl1").show();
        $("#attachesUl2").show();
    }else{
        $("#reportDate").datebox('setValue', new Date().toDateString());
        $("#reportName").textbox('setValue', getLoginInfo().userName);
        $("#reportId").val(getLoginInfo().accountId);

        $('#viewShowDiv').remove();
    }
    //来自工作流的页面，不显示提交按钮
    if(isFlow){
        $('#submitFlowButton').remove();
    }
    //显示反馈附件
    if(incidentPkid){
        InitFuncCodeRequest_({
            data: {cirId: incidentPkid, FunctionCode: 'PM_MC_INCIDENT_SUGGEST_LIST_BY_CIRID'},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    $.each(jdata.data, function(index, val){
                        if(val.SUGGEST_GROUP){
                            showUploadedFiles(val.PKID,val.SUGGEST_GROUP);
                        }
                    });
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }
}

// 查询关联Defect
function searchDefects(){
    var defaultParam = {
        "qname": [],
        "qoperator": [],
        "qvalue": []
    };

    multiSelectDefectDialog(defaultParam, function(rowdata, originalData){
        if(rowdata && rowdata.length > 0){
            var defectIds = [];
            var defectNos = [];
            var atas = [];
            var html = "";
            $.each(rowdata, function(k, val){
                defectIds.push(val.defectId);
                defectNos.push(val.defectNo);
                atas.push(val.ata);
                html += "<a href='javascript:void(0)' onclick='showDefectDetail(" + val.defectId + "," + val.defectNo + ");'>" + val.defectNo + "<a/>" + ","
            });
            defectIds = defectIds.join(',');
            defectNos = defectNos.join(',');
            $('#defectId').val(defectIds);
            $('#defectNo').val(defectNos);
            $('#defectIdShow').html(html);

            $('#ata').textbox('setValue', atas.join(','));
        }
    });
}

//获取航班号
function getFlightId(){
    var acno = $("#acno").combobox('getValue');
    if (acno) {
        $.chooseFlight({
            filter: {
                ac: acno,
                includeReleaseFlag:true
            },
            success: function(data){
                if (data.CHECK_TYPE == "Pr/F" || data.CHECK_TYPE == "T/R") {
                    $('#station').textbox('setValue', data.DEPARTURE);
                }
                if (data.CHECK_TYPE == "Po/F" || data.CHECK_TYPE == "O/G") {
                    $('#station').textbox('setValue', data.ARRIVAL);
                }
                $("#flightNo").textbox('setValue', data.FLIGHT_NO);
                $("#flightId").val(data.flightId);
                $("#flightRange").textbox('setValue', data.DEPARTURE + "-" + data.ARRIVAL);
                $("#prepareTakeoff").textbox('setValue', data.PLAN_TO);
                if($('#recoverTime').textbox('getValue')){
                    calcPlanStopDays($('#recoverTime').textbox('getValue'));
                }

                $("#checkType").val(data.CHECK_TYPE);
                $("#checkTypeTitle").textbox("setValue", checkType[data.CHECK_TYPE]);
            },
            fullData: true
        })
    }else{
        MsgAlert({content: '请先选择飞机号', type: 'warning'});
    }
}

/*
非计划停场天数计算规则：非计划停场时间=恢复适航时间-计划起飞时间，
非计划停场时间的计算结果呈现规则：
非计划停场时间<6小时，显示为“0”；
6小时<=非计划停场时间<12小时，显示为“0.5”；
12小时<=非计划停场时间<24小时，显示为“1”
24小时<=非计划停场时间<36小时，显示为“1.5”
36小时<=非计划停场时间<48小时，显示为“2”
后续依次每12小时算增加0.5天
*/
function calcPlanStopDays(recoverTime){
    var planTO = new Date($("#prepareTakeoff").textbox('getValue'));
    var recoverFlyTime = new Date(recoverTime);
    var planStopHours = (recoverFlyTime.getTime() > planTO.getTime()) ?
        ((recoverFlyTime.getTime() - planTO.getTime()) / 1000 / 3600) : 0;
    var planStopDays = 0;
    if (planStopHours < 6) {
        planStopDays = 0;
    } else if (planStopHours >= 6 && planStopHours < 12) {
        planStopDays = 0.5;
    }else if (planStopHours >=12 && planStopHours < 24){
        planStopDays = 1;
    }else if (planStopHours >=24 && planStopHours < 36) {
        planStopDays = 1.5;
    }else {
        planStopDays = 1.5 + Math.ceil((planStopHours - 36) / 12) * 0.5;
    }

    $("#onground").textbox('setValue', planStopDays.toFixed(1));
}

//添加故障详细描述
function initIncidentDetailGrid(){
    $("#detailDescTable").MyDataGrid({
        identity: 'detailDescTable',
        enableLineEdit:oprType != 'view',
        //enableCellEdit: true,
        queryParams: {cirId: prePgParam.pkid},
        pagination: false,
        columns: {
            param: {FunctionCode: 'PM_MC_INCIDENT_DES_LIST'},
            alter: {
                TIME: {
                    editor: {type: 'datetimebox', options: {required: true, editable: false}}
                },
                DES: {
                    editor: {type: 'textbox', options: {required: true, validType: ['maxLength[500]']}}
                }
            }
        },
        onLoadSuccess: function (value, rowData, rowIndex) {
            //取消气泡显示效果
            //var panel = $("#detailDescTable").datagrid('getPanel').panel('panel');
            //$('.datagrid-body').undelegate('mouseover').undelegate('mouseout').undelegate('mousemove');
        },
        validAuth: function (row, items) {
            if (oprType == 'view') {
                items['删除'].enable = false;
            }
            return items;
        },
        contextMenus: [
        {
            id: "m-edit", i18nText: "删除", auth: "",
            onclick: function () {
                var rowData = getDG('detailDescTable').datagrid('getSelected');
                var rowIndex = $('#detailDescTable').datagrid('getRowIndex', rowData);
                if (!rowData.PKID) {
                    $('#detailDescTable').datagrid('deleteRow', rowIndex);
                    incidentDetailDesces.splice(rowIndex,1);
                }else{
                    InitFuncCodeRequest_({
                        data: {'pkid':rowData.PKID, FunctionCode: 'PM_MC_INCIDENT_DES_DEL'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                getDG('detailDescTable').datagrid('reload');
                                MsgAlert({content: '操作成功'});
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        }],
        onEndEdit: function(index, row, changes){
            if (row.TIME && row.DES){
                row = toCamelCase(row);
                incidentDetailDesces[index] = JSON.stringify(row);
            }
        }
    });
}

//涉及故障部件列表
function initIncidentRelPartGrid(defectIds) {
    $("#relPartTable").MyDataGrid({
        identity: 'relPartTable',
        queryParams: {defectIds: defectIds},
        pagination: false,
        columns: {
            param: {FunctionCode: 'GET_PNSNINFO_BY_DEFECTIDS'},
            alter: {}
        }
    });
}

// 根据主键查询 不正常事件数据
function fillFormEle(){
    var pkid = prePgParam.pkid;
    if (pkid){
        InitFuncCodeRequest_({
            data: {'pkid':pkid, FunctionCode: 'PM_MC_INCIDENT_LIST'},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    var incidentData = jdata.data[0];
                    ParseFormField_(incidentData, null, Constant.CAMEL_CASE);
                    incidentPkid = jdata.data[0].PKID;
                    isMcc = jdata.data[0].IF_MCC;
                    //有些特殊字段需要手动进行赋值
                    var operationType = incidentData.OPERATION_TYPE || '';
                    if (operationType) {
                        operationType = operationType.split(',');
                        for (v in operationType) {
                            $("input[type=checkbox][flag=criticalType][value=" + operationType[v] + "]").attr('checked', true);
                        }
                    }
                    if ($("#isDelayChk").is(":checked")){
                        $("#delayTime").textbox({readonly:false});
                    }

                    if ($("#isOtherOprChk").is(":checked")){
                        $("#otherOperation").textbox({readonly:false});
                    }

                    if ($("#isOtherExternalChk").is(":checked")){
                        $("#otherExternal").textbox({readonly:false});
                    }

                    if ($("#isOtherMaintChk").is(":checked")){
                        $("#otherMaintain").textbox({readonly:false});
                    }

                    if (incidentData.DEFECT_NO) {
                        var nos = incidentData.DEFECT_NO.split(",");
                        var ids = incidentData.DEFECT_ID.split(",");
                        var html = "";
                        for (var i = 0; i < nos.length; i++) {
                            html += "<a href='javascript:void(0)' onclick='showDefectDetail(" + ids[i] + "," + nos[i] + ");'>" + nos[i] + "<a/>" + ","
                        }
                        $("#defectIdShow").html(html);
                    }
                    if (incidentData.DEFECT_ID) {
                        $("#isChkDefect").attr("checked", true);
                        $('#defectSearchImg').css('display', 'inline');
                        initIncidentRelPartGrid(incidentData.DEFECT_ID);
                    } else {
                        $("#isNotChkDefect").attr("checked", true);
                    }
                    $("#acno").combobox('setValue', incidentData.ACNO);

                    $("#checkTypeTitle").textbox("setValue", checkType[incidentData.CHECK_TYPE]);

                    $("#td_ciNo").html(incidentData.CI_NO);

                    if (oprType == 'view'){
                        if (incidentData.IS_SDR)
                            $('input[type=radio][name=isSdr][value=' + incidentData.IS_SDR + ']').attr("checked", true);

                        if (incidentData.SDR_TYPE)
                            $('input[type=radio][name=sdrType][value=' + incidentData.SDR_TYPE + ']').attr("checked", true);

                        if (incidentData.IS_MEL)
                            $('input[type=radio][name=isMel][value=' + incidentData.IS_MEL + ']').attr("checked", true);

                        if (incidentData.DEFECT_ID){
                            var defectIds = incidentData.DEFECT_ID.split(",")
                            //todo 显示故障涉及部件
                        }

                        //意见反馈
                        if (incidentData.DUTY_SUGGEST){
                            $("#isDutySuggestDiv").show();
                            $("#dutySuggestDiv").show();

                            var dutySugTypes = incidentData.DUTY_SUGGEST.split(",");
                            $.each(dutySugTypes, function(k, v){
                                $("input[type=checkbox][name=dutySuggestType][value=" + v + "]").attr("checked", true);
                            });

                            //查询反馈意见
                            InitFuncCodeRequest_({
                                data: {'cirId':incidentData.PKID, FunctionCode: 'PM_MC_DUTY_SUGGEST_LIST'},
                                successCallBack: function (jdata) {
                                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                        var datas = jdata.data;
                                        var titles = {isMcc: 'MCC监控反馈信息', isTmc: '技术支援处监控反馈信息', isPPC: 'PPC跟进反馈信息',isProj: '工程评估反馈信息', isTrain: '培训开展反馈信息',
                                                      isLine: '航线关注反馈信息', isDj: '定检跟进反馈信息', isQa: '质量调查反馈信息', isMateria: '航材保障反馈信息'};

                                        var parentDiv = $("#dutySuggestDiv");
                                        var divTemplate = $("#dutySuggestDiv").children();
                                        $.each(datas, function(k, v){
                                            var cloneNode = divTemplate.clone();
                                            cloneNode.find("div[class=itemDiv]").html(titles[v.SUGGEST_GROUP]);
                                            cloneNode.find("div[class=feedBackDes]").html(v.REMARK);
                                            cloneNode.find("div input").val(v.SUGGEST_USER_NAME);
                                            parentDiv.append(cloneNode);
                                        });

                                        divTemplate.remove();
                                    }
                                }
                            });
                        }
                    }
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }else{
        MsgAlert({content: '无不正常事件PKID，无法查询数据！', type: 'error'});
    }
}

//保存更新数据
function saveOrUpdate(){
    var $form = $("#mform");
    var isValidate = $form.form('validate');
    var isEdit_ = (oprType == 'edit');
    if (!isValidate) {
        return false;
    }
    //校验是否勾选关联defect(MCC发起不校验)
    var isChkDefect = $('#isChkDefect').is(':checked');
    var isNotChkDefect = $('#isNotChkDefect').is(':checked');
    if ("mccAdd" != oprType) {
        if (!isChkDefect && !isNotChkDefect) {
            MsgAlert({content: "请选择是否关联defect", type: "error"});
            return false;
        }
    }
    if(isChkDefect){
        var defectId = $("#defectId").val();
        if("" == defectId){
            MsgAlert({content: "未选择关联的defect", type: "error"});
            return false;
        }
    }
    // 合并checkbox
    var operationTypes = $('#oprTypeTable input:checked');
    var oprTypeIds = [];
    var oprTypeTexts = [];
    var criticalType = [];
    $.each(operationTypes, function(index, value){
        var checkedId = $(value).val();
        oprTypeIds.push(checkedId);
        if(checkedId && checkedId == 13){
            var text13 = $("#otherOperation").textbox('getValue');
            if(text13){
                oprTypeTexts.push(text13);
            }
        }else if(checkedId && checkedId == 20){
            var text20 = $("#otherExternal").textbox('getValue');
            if(text20){
                oprTypeTexts.push(text20);
            }
        }else if(checkedId && checkedId == 28){
            var text28 = $("#otherMaintain").textbox('getValue');
            if(text28){
                oprTypeTexts.push(text28);
            }
        }else if(checkedId){
            oprTypeTexts.push(PAGE_DATA['oprType'][checkedId]);
        }
        if(checkedId && checkedId >=1 && (checkedId <=13 || checkedId == 29)){
                if (!criticalType.includes('1'))
                    criticalType.push('1');
        }else if(checkedId && checkedId <= 20){
            if (!criticalType.includes('2'))
                criticalType.push('2');
        }else if(checkedId){
            if (!criticalType.includes('3'))
                criticalType.push('3');
        }

    });
    oprTypeIds = oprTypeIds.join(',');
    oprTypeTexts = oprTypeTexts.join(',');
    $("#operationType").val(oprTypeIds);
    $("#operationTypeText").val(oprTypeTexts);
    $("#criticalType").val(criticalType.join(','));

    var data = $form.serializeObject();

    //添加故障描述参数
    data = $.extend({}, data, {
        FunctionCode: 'PM_MC_INCIDENT_ADD_EDIT',
        operation: oprType,
        incidentDeses:JSON.stringify(incidentDetailDesces)
    });
    InitFuncCodeRequest_({
        data: data,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (prePgParam.OWindow && typeof prePgParam.OWindow.reload_ == 'function'){
                    //列表页面incident_list.shtml
                    prePgParam.OWindow.reload_();
                    incidentDetailDesces = [];
                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.COMMON.OPT_SUCCESS')});
                    incidentPkid = jdata.data.pkid;
                    $("#pkid").val(incidentPkid);
                    oprType = "edit";
                    isMcc = jdata.data.ifMcc;
                    if(window.confirm("是否提交流程")){
                        if ("mccAdd" == oprType || "X" == isMcc) {
                            common_add_edit_({
                                url: "/views/em/workflow/work_flow_account_select.shtml",
                                param: {
                                    FunctionCode_: 'PM_MC_WORKFLOW_DEAL',
                                    otherParam: incidentPkid,
                                    successCallback: function(){
                                        prePgParam.OWindow.reload_();
                                        CloseWindowIframe();
                                    }
                                },
                                title: $.i18n.t('选择审批人'),
                                width: 520,
                                height: 300
                            });
                        } else {
                            InitFuncCodeRequest_({
                                data: {pkid: incidentPkid, FunctionCode: 'PM_MC_WORKFLOW_DEAL'},
                                successCallBack: function (jdata) {
                                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                        MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                        prePgParam.OWindow.reload_();
                                        CloseWindowIframe();
                                    } else {
                                        MsgAlert({content: jdata.msg, type: 'error'});
                                    }
                                }
                            });
                        }
                    }
                }else if (prePgParam.OWindow && typeof prePgParam.OWindow.editSucCallBack == 'function'){
                    //流程页面flow_mcc_incident.shtml
                    prePgParam.OWindow.editSucCallBack();
                    CloseWindowIframe();
                }
            } else {
                if(jdata.msg.indexOf("msg_err") > -1){
                    MsgAlert({content: jdata.msg.substring(8), type: 'error'});
                }else{
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        }
    });
}

//提交工作流
function submitFlow(){
    if(!incidentPkid){
        MsgAlert({content: "请先保存不正常事件数据",type: "error"});
        return;
    }
    if(window.confirm("是否提交流程")){
        if ("mccAdd" == oprType || "X" == isMcc) {
            common_add_edit_({
                url: "/views/em/workflow/work_flow_account_select.shtml",
                param: {
                    FunctionCode_: 'PM_MC_WORKFLOW_DEAL',
                    otherParam: incidentPkid,
                    successCallback: function(){
                        prePgParam.OWindow.reload_();
                        CloseWindowIframe();
                    }
                },
                title: $.i18n.t('选择审批人'),
                width: 520,
                height: 300
            });
        } else {
            InitFuncCodeRequest_({
                data: {pkid: incidentPkid, FunctionCode: 'PM_MC_WORKFLOW_DEAL'},
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        prePgParam.OWindow.reload_();
                        CloseWindowIframe();
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
        }
    }
}
//显示各处室反馈附件
function showUploadedFiles(sourceId,group){
    if (sourceId){
        InitFuncCodeRequest_({
            data: {
                SOURCE_ID: sourceId,
                CATEGORY: "MCCFEEDBACK",
                FunctionCode: 'ATTACHMENT_RSPL_GET'
            },
            successCallBack: function (jdata) {
                if (jdata.code == 200 && jdata.data.length > 0) {
                    var ulNode = $("#attachesUl_"+group);
                    ulNode.find("li").remove();
                    for (var i = 0; i < jdata.data.length; i++) {
                        var imgSrc = "/img/";
                        var fileName = jdata.data[i].ORG_NAME;
                        var fileType = fileName.substr(fileName.lastIndexOf(".") + 1);
                        if (!fileType)
                            continue;

                        fileType = fileType.toLowerCase();
                        if (fileType == 'pdf'){
                            imgSrc += 'icon_pdf.gif';
                        }else if(fileType == 'doc' || fileType == 'docx'){
                            imgSrc += 'icon_word.png';
                        }else if(fileType == 'xls' || fileType == 'xlsx'){
                            imgSrc += 'icon_excel.png';
                        }else if(fileType == 'zip' || fileType == 'rar'){
                            imgSrc += 'icon_zip.png';
                        }else{
                            imgSrc += 'icon_other.png';
                        }

                        var attachFile = '<li style="float:left;margin-left:10px;">' +
                            '<a target="_blank" onclick="downFile(\'' + jdata.data[i].PKID + '\')">' +
                            '<img src="' + imgSrc + '" border="0" style="width:25px;height:25px;"/>' +
                            '<div>' + jdata.data[i].ORG_NAME + '</div></a>'
                            /*+ '<a aIndex=\'i' + jdata.data[i].PKID + '\' target="_blank" onclick="deleteFileBefore(\'' + jdata.data[i].PKID + '\');return false;">' +
                            '<img src="/css/icons/cross.png" border="0" />' + '</a><li>'*/;

                        ulNode.append(attachFile);
                    }
                }
            }
        });
    }
}

function deleteFileBefore(fileId){
    deleteFile(fileId);
    $("a[aIndex=" + "i" + fileId +"]").parent().remove();
}

//Defect详情页面
function showDefectDetail(id, no) {
    ShowWindowIframe({
        width: "1000",
        height: "700",
        title: '详情',
        param: {defectId: id, defectNo: no},
        url: "/views/defect/defectDetails.shtml"
    });
}

