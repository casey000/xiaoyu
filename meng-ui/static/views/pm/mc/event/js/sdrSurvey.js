var prePgParam;
var oprType;
var surveyEquips = [];
var flowNode;
function i18nCallBack() {
    prePgParam = getParentParam_();
    if (prePgParam.msgData) {
        prePgParam.pkid = prePgParam.recordId;
        prePgParam.operation = 'edit';
    }
    oprType = prePgParam.operation || 'view';
    flowNode = prePgParam.flowNode;

    InitFuncCodeRequest_({
        data: {
            domainCode: "SDR_APPEAR,SDR_STAGE,SDR_MEASURE,IS_MACHINE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //困难报告部分初始化
                $('#sdrStage').combobox({
                    panelHeight: '140px',
                    data: jdata.data.SDR_STAGE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    multiple: true
                });

                $('#sdrAppear').combobox({
                    panelHeight: '140px',
                    data: jdata.data.SDR_APPEAR,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    multiple: true
                });

                $('#sdrMeasure').combobox({
                    panelHeight: '140px',
                    data: jdata.data.SDR_MEASURE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    multiple: true
                });

                $('#isMachine').combobox({
                    panelHeight: '100px',
                    data: jdata.data.IS_MACHINE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                initForm();
            }else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function getEquipment(thiz) {
    InitFuncCodeRequest_({
        data: {
            acNo: $("#acno").textbox('getValue'),
            type: thiz.value,
            FunctionCode: 'GET_MAIN_EQUIPMENT_INVOLVED'
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                var rowIndex = $(thiz).parents("tr.equipRow").attr('rowIndex');
                $("tr[rowIndex='" + rowIndex + "'] input[name='manufacturer'][class='surveyInputText']").val(jdata.data.manufacture);
                $("tr[rowIndex='" + rowIndex + "'] input[name='model'][class='surveyInputText']").val(jdata.data.model);
                $("tr[rowIndex='" + rowIndex + "'] input[name='sn'][class='surveyInputText']").val(jdata.data.serialNumber);
                $("tr[rowIndex='" + rowIndex + "'] input[name='tfh'][class='surveyInputText']").val(jdata.data.fhTotal);
                $("tr[rowIndex='" + rowIndex + "'] input[name='tfc'][class='surveyInputText']").val(jdata.data.cyTotal);
            }
        }
    });
}

function getflaw(thiz, v) {
    var pn = "";
    var sn = "";
    if ("pn" == v) {
        pn = $(thiz).val();
        sn = $(thiz).parent('td').next('td').children('input[name="sn"]').val();
    }
    if ("sn" == v) {
        sn = $(thiz).val();
        pn = $(thiz).parent('td').prev('td').children('input[name="pn"]').val();
    }
    if (pn != "" && sn != "") {
        InitFuncCodeRequest_({
            data: {
                pn: pn,
                sn: sn,
                FunctionCode: 'GET_PN_SN_INFO'
            },
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    $(thiz).parent('td').parent('tr').children('td').children('input[name="pnName"]').val(jdata.data.name);
                    $(thiz).parent('td').parent('tr').children('td').children('input[name="location"]').val(jdata.data.position);
                    $(thiz).parent('td').parent('tr').next('tr').next('tr').children('td').children('input[name="tfh"]').val(jdata.data.fhTotal);
                    $(thiz).parent('td').parent('tr').next('tr').next('tr').children('td').children('input[name="tfc"]').val(jdata.data.cyTotal);
                }
            }
        });
    }
}

/**
* 根据操作类型进行界面的初始化
*/
function initForm(){
    // load events
    if (oprType == 'view'){
        //删除保存按钮
        $('#saveButton').remove();
        $("#submitFlowButton").remove();
        $("#editRowButton").remove();

        //故障零部件
        $("a[type=flawButton]").linkbutton({disabled:true});
        $("table[name=flawTable] input[type=text]").attr("disabled", true);

        //涉及设备
        $("a[type=eqpButton]").linkbutton({disabled:true});
        $("select[name=eqpType]").attr("disabled", true);
        $("#equipmentTable input").attr("disabled", true);
    }
    //流程中，不显示提交按钮
    if(flowNode){
        $("#submitFlowButton").remove();
    }

    //故障类型事件
    $("#isMachine").combobox({
        onSelect: function(data){
            if (data.VALUE == 'N'){
                $("#nomachineTypeSpan").show();
            }else{
                $("#nomachineTypeSpan").hide();
                $("input[type=radio][name=nomachineType]:checked").prop("checked", false);
            }
        }
    });

    var pkid = prePgParam.pkid;
    if (pkid){
        InitFuncCodeRequest_({
            data: {'pkid':pkid, FunctionCode: 'PM_MC_SDR_SURVEY_LIST'},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    var surveyData = jdata.data[0];
                    ParseFormField_(surveyData, null, Constant.CAMEL_CASE);

                    //有些特殊字段需要手动进行赋值
                    $("#acno").textbox('setValue', surveyData.ACNO);

                    if(surveyData.SDR_APPEAR){
                      $("#sdrAppear").combobox("setValue", surveyData.SDR_APPEAR.split(","));
                    }

                    if(surveyData.SDR_MEASURE){
                      $("#sdrMeasure").combobox("setValue", surveyData.SDR_MEASURE.split(","));
                    }

                    if(surveyData.SDR_STAGE){
                      $("#sdrStage").combobox("setValue", surveyData.SDR_STAGE.split(","));
                    }

                    $("#isMachine").combobox('setValue', surveyData.IS_MACHINE);
                    if (surveyData.IS_MACHINE == 'N'){
                      $("#nomachineTypeSpan").show();
                    }

                    //特殊元素初始化如：radio
                    initSpecEle(toCamelCase(surveyData));

                    //涉及主要设备初始化
                    fillEqpTable(pkid);
                    //故障零件初始化
                    fillFlawTable(pkid);
                    showUploadedFiles(prePgParam.pkid, "MCCSURVEYEQUIPS", $("#attachesUl"));
                    showUploadedFiles(prePgParam.pkid, "MCCSDRSURVEY", $("#attachesU2"));
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }else{
        MsgAlert({content: '无法查询数据！', type: 'error'});
    }
}

function initSpecEle(surveyData){
    //回显时移除所有disabled属性
    $("input[type=radio]").removeAttr("disabled");
    //radio 事件
    //9.1
    $('input[type=radio][name=isConfirm]').change(function() {
         if (this.value == 'Y' && flowNode != 'check' && flowNode != 'confirm') {
             $("#deferDes").textbox({editable: true, onlyview: false});
         }
         else if (this.value == 'N') {
             $("#deferDes").textbox({editable: false, onlyview: true});
            if (flowNode != 'check' && flowNode != 'confirm')
                $("#deferDes").textbox("clear");
         }
    });
    $('input[type=radio][name=isConfirm][value='+ surveyData['isConfirm'] +']').click();

    //9.2
    $('input[type=radio][name=isCheck]').change(function() {
         if (this.value == 'Y' && flowNode == 'confirm') {
             $("#checkDes").textbox({editable: true, onlyview: false});
         }
         else if (this.value == 'N' && flowNode == 'confirm') {
             $("#checkDes").textbox({editable: false, onlyview: true});
            $("#checkDes").textbox("clear");
         }
    });
    $('input[type=radio][name=isCheck][value='+ surveyData['isCheck'] +']').click();

    //9.3
    $('input[type=radio][name=isMp]').change(function() {
         if (this.value == 'Y' && flowNode == 'check') {
             $("#mpDes").textbox({editable: true, onlyview: false});
         }
         else if (this.value == 'N' && flowNode == 'check') {
             $("#mpDes").textbox({editable: false, onlyview: true});
            $("#mpDes").textbox("clear");
         }
    });
    $('input[type=radio][name=isMp][value='+ surveyData['isMp'] +']').click();

    //9.4
    $('input[type=radio][name=recentWork]').change(function() {
         if (this.value == 'Y' && flowNode == 'check') {
             $("#workDes").textbox({editable: true, onlyview: false});
         }
         else if (this.value == 'N' && flowNode == 'check') {
             $("#workDes").textbox({editable: false, onlyview: true});
            $("#workDes").textbox("clear");
         }
    });
    $('input[type=radio][name=recentWork][value='+ surveyData['recentWork'] +']').click();

    //9.5
    $('input[type=radio][name=relatedWork]').change(function() {
         if (this.value == 'Y' && flowNode != 'check' && flowNode != 'confirm') {
             $("#relatedReason").textbox({editable: true, onlyview: false});
         }
         else if (this.value == 'N') {
             $("#relatedReason").textbox({editable: false, onlyview: true});
            if (flowNode != 'check' && flowNode != 'confirm')
                $("#relatedReason").textbox("clear");
         }
    });
    $('input[type=radio][name=relatedWork][value='+ surveyData['relatedWork'] +']').click();

    //9.6
    $('input[type=radio][name=relatedSb]').change(function() {
         if (this.value == 'Y' && flowNode == 'check') {
             $("#relatedDes").textbox({editable: true, onlyview: false});
         }
         else if (this.value == 'N' && flowNode == 'check') {
             $("#relatedDes").textbox({editable: false, onlyview: true});
            $("#relatedDes").textbox("clear");
         }
    });
    $('input[type=radio][name=relatedSb][value='+ surveyData['relatedSb'] +']').click();

    //9.7
    $('input[type=radio][name=historyOccur]').change(function() {
         if (this.value == 'Y' && flowNode == 'check') {
             $("#historyDes").textbox({editable: true, onlyview: false});
         }
         else if (this.value == 'N' && flowNode == 'check') {
             $("#historyDes").textbox({editable: false, onlyview: true});
            $("#historyDes").textbox("clear");
         }
    });
    $('input[type=radio][name=historyOccur][value='+ surveyData['historyOccur'] +']').click();

    //13.
    $('input[type=radio][name=isSurvey]').change(function() {
         if (flowNode == 'confirm') {
             $("#surveyDes").textbox({editable: true, onlyview: false});
         }
    });
    $('input[type=radio][name=isSurvey][value='+ surveyData['isSurvey'] +']').click();

    //故障类型：非机械类
    $('input[type=radio][name=nomachineType][value='+ surveyData['nomachineType'] +']').prop('checked',true);

    //当前更改人信息
    $("input[name=inputerId]").val(getLoginInfo().accountId);
    $("input[name=inputerName]").val(getLoginInfo().userName);

    intEditableEle();
}

//根据流程节点判断哪些元素可编辑
function intEditableEle(){

    if (oprType == 'edit') {
        //编辑时单选按钮控制
        $("input[type=radio]").attr("disabled", true);
        $("input[type=radio][name=nomachineType]").attr("disabled", false);
        $("input[type=radio][name=isConfirm]").attr("disabled", false);
        $("input[type=radio][name=isCheck]").attr("disabled", false);
        $("input[type=radio][name=relatedWork]").attr("disabled", false);
    }

    if (!flowNode){
        return;
    }

    if (flowNode != 'return'){
        //ata
        $("#ataNo1").textbox({editable: false, onlyview: true});
        $("#ataNo2").textbox({editable: false, onlyview: true});
        $("#ataNo3").textbox({editable: false, onlyview: true});
        $("#ataNo4").textbox({editable: false, onlyview: true});

        //涉及设备
        $("a[type=eqpButton]").linkbutton({disabled:true});
        $("select[name=eqpType]").attr("disabled", true);
        $("#equipmentTable input").attr("disabled", true);

        //故障零部件
        $("a[type=flawButton]").linkbutton({disabled:true});
        $("table[name=flawTable] input[type=text]").attr("disabled", true);

        //故障类型
        $("#isMachine").combobox('readonly', true);

        //机械类原因的故障分析
        $("#deferDes").textbox({editable: false, onlyview: true});
        $("#relatedReason").textbox({editable: false, onlyview: true});
        $("#notConfirmReason").textbox({editable: false, onlyview: true});
    }

    if (flowNode == 'check'){

        $("input[name=lastUnit]").removeAttr("disabled");
        $("input[name=lastFh]").removeAttr("disabled");
        $("input[name=lastFc]").removeAttr("disabled");
        $("table[name=flawTable] input[type=checkbox]").removeAttr("disabled");

        //单选按钮控制
        $("input[type=radio]").attr("disabled", true);
        $("input[type=radio][name=isMp]").attr("disabled", false);
        $("input[type=radio][name=recentWork]").attr("disabled", false);
        $("input[type=radio][name=relatedSb]").attr("disabled", false);
        $("input[type=radio][name=historyOccur]").attr("disabled", false);

        $("#strDes").textbox({editable: true, onlyview: false});
        var isM = $("#isMachine").combobox('getValue');
        $("#isMachine").combobox({value: isM, editable: false, onlyview: true});
    }else if (flowNode == 'confirm'){
        $("input[name=lastUnit]").attr("disabled", true);
        $("input[name=lastFh]").attr("disabled", true);
        $("input[name=lastFc]").attr("disabled", true);
        $("#flawTable input[type=checkbox]").attr("disabled", true);

        //单选按钮控制
        $("input[type=radio]").attr("disabled", true);
        $("input[type=radio][name=isSurvey]").attr("disabled", false);

        var isM = $("#isMachine").combobox('getValue');
        $("#isMachine").combobox({value: isM, editable: false, onlyview: true});

        //10.
        $("#notMachineDes").textbox({editable: true, onlyview: false});

        //12
        $("#otherContent").textbox({editable: true, onlyview: false});
        $("#otherFileUpload").linkbutton({disabled:false});
        $("#uploadOtherInput").attr("disabled", false);

        //13.
        $("#surveyDes").textbox({editable: true, onlyview: false});

        //14 局方意见
        $("#caacDes").textbox({editable: true, onlyview: false});
        $("#engineerName").textbox({editable: true, onlyview: false});
        $("#issueDate").datebox({editable: true, onlyview: false});
        $("#feedbackDate").datebox({onlyview: false});
    }
}

//保存更新数据
function saveOrUpdate(){
    var $form = $("#mform");
    var isValidate = $form.form('validate');
    if (!isValidate && oprType != 'view') {
        return false;
    }

    //保存时移除所有disabled属性
    $("input[type=radio]").removeAttr("disabled");

    var data = $form.serializeObject();
    var eqpDatas = serializeAreaData($("tr.equipRow"));
    var flawDatas = serializeAreaData($("table[name='flawTable']"));

    data = $.extend({}, data, {
        FunctionCode: 'PM_MC_SURVEY_EDIT',
        eqpDatas:JSON.stringify(eqpDatas),
        flawDatas:JSON.stringify(flawDatas)
    });
    InitFuncCodeRequest_({
        data: data,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.COMMON.OPT_SUCCESS')});
                if(prePgParam.msgData){
                    prePgParam.OWindow.reloadTodo();
                }else{
                    prePgParam.OWindow.reload_();
                }
                location.reload();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

 function submitFlow(){
    if (!prePgParam.pkid){
        MsgAlert({content:"请先保存基础数据！", type: 'error'});
        return;
    }
    if(confirm("确定提交吗？")){
        InitFuncCodeRequest_({
            data: {pkid:prePgParam.pkid, FunctionCode: 'PM_MC_SDR_SURVEY_FLOW'},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    if(prePgParam.msgData){
                        prePgParam.OWindow.reloadTodo();
                    }else{
                        prePgParam.OWindow.reload_();
                    }
                    CloseWindowIframe();
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }
}

function closeWindow(){
    if(oprType == 'edit'){
        if (confirm("确认取消编辑/新增？")) {
          CloseWindowIframe();
        }
    }else{
        CloseWindowIframe();
    }
}

/*删除故障涉及设备行*/
function removeEqpRow(row){
    if (oprType == 'view'){
        return;
    }
    var tbody = $(row).parents("tr.equipRow").parent();
    var currentRow = $(row).parents("tr.equipRow");
    var equipPkid = currentRow.children("input").val();
    if(equipPkid){
        if (confirm("是否确认删除？")){
            InitFuncCodeRequest_({
                data: {'pkid':equipPkid, FunctionCode: 'PM_MC_SURVEY_EQP_DEL'},
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        var newRow = currentRow.clone();
                        newRow.children("input").val("");
                        currentRow.remove();
                        if (tbody.children().length - 1 == 0){
                            tbody.append(newRow.prop("outerHTML"));
                        }
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
        }
    }else{
        if (currentRow.attr("rowIndex") != "1"){
            currentRow.remove();
        }/*else{
            MsgAlert({content: '第一行无法删除！', type: 'warning'});
        }*/
    }

    //阻止回到页面顶端
    $($("a[type=eqpButton]")[0]).focus();
}

/*新增故障涉及设备行*/
function addEqpRow(row){
    if (oprType == 'view'){
        return;
    }
    var tbody = $(row).parents("tr.equipRow").parent();
    var currentRow = $(row).parents("tr.equipRow");
    var rowIndex = tbody.children("tr.equipRow").length + 1;
    var newRow = currentRow.clone();
    newRow.attr("rowIndex", rowIndex);
    newRow.children("input").val("");
    newRow.find("input[type=file]").attr("id", "equipFileInput_" + rowIndex);
    tbody.append(newRow.prop("outerHTML"));

    $(row).focus();
}

/*回填涉及主要设备数据*/
function fillEqpTable(surveyId){
    if(surveyId){
        //查询涉及主要设备
        InitFuncCodeRequest_({
            data: {'surveyId':surveyId, FunctionCode: 'PM_MC_SURVEY_EQP_LIST'},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    var eqpData = jdata.data;
                    var tbody = $("tr.equipRow[rowindex=1]").parent();
                    var eqpRow = $("tr.equipRow[rowindex=1]");
                    $.each(eqpData, function(index, value){
                        var newRow = null;
                        if (index > 0){
                            //先增加一条模板再赋值
                            newRow = eqpRow.clone();
                            newRow.attr("rowIndex", index + 1);
                            tbody.append(newRow.prop("outerHTML"));
                            newRow = $("tr.equipRow[rowindex=" + (index + 1) + "]");
                            newRow.find("input[type=file]").attr("id", "equipFileInput_" + index);
                        }else{
                            newRow = eqpRow;
                        }

                        newRow.find("select[name=eqpType]").val(value.EQP_TYPE);
                        newRow.find("input[name=equipPkid]").val(value.PKID);

                        value = toCamelCase(value);
                        $.each(value, function(k,v){
                            newRow.find("input[name="+ k +"]").val(v)
                        });
                    });
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }
}

/*故障设备对应附件*/
function uploadEqpFile(row){
    if (oprType == 'view'){
        return;
    }
    /* 统一上传到主表
    var equipPkid = $(row).parents("tr.equipRow").children("input[name=equipPkid]").val();
    if (!$.trim(equipPkid)){
        MsgAlert({content: '请先保存使用困难报告调查单，再上传文件', type: 'warn'});
        return;
     }*/

    //判断是否选择了文件
    var fileInputObj = $(row).parent().children("input[type=file]");
    var fileName = fileInputObj.val();
    if (!$.trim(fileName)){
        MsgAlert({content: '请选择文件', type: 'error'});
        return;
    }

    //检查文件大小: 默认为10M
    var fileInputId = fileInputObj.attr("id");
    if (!checkUploadFileSize(fileInputId)){
        MsgAlert({content: '文件上传超过上限：10M', type: 'error'});
        fileInputObj.val("");
        fileInputObj.focus();
        return;
    }

    $.ajaxFileUpload({
      url: Constant.API_URL + 'ATTACHMENT_UPLOAD',
      secureuri: false,
      fileElementId: fileInputId, //file控件id
      dataType: 'json',
      data: {
          "fileCategory": 'MCCSURVEYEQUIPS',
          "sourceId": prePgParam.pkid,
          'repeat': 'repeat'
      },
      success: function (jdata) {
          if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
              MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.UPLOAD_SUCCESS')});
              //清空文件列表
              fileInputObj.val("");
              //显示已上传的文件
              showUploadedFiles(prePgParam.pkid, 'MCCSURVEYEQUIPS', $("#attachesUl"));
          } else {
              MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.UPLOAD_FALIED') + jdata.msg, type: 'error'});
          }
      }
  });
}

/*添加故障零件，结构缺陷行*/
function addFlawRow(row){
    if (oprType == 'view'){
        return;
    }
    var flawTable = $(row).parents("table[name='flawTable']").clone();
    var flawTd = $("#flawTd");
    flawTable.children("input").val("");
    flawTd.append(flawTable.prop("outerHTML"));

    $(row).focus();
}

/*删除故障零件，结构缺陷行*/
function removeFlawRow(row){
    if (oprType == 'view'){
        return;
    }
    var flawTable = $(row).parents("table[name='flawTable']");
    var flawTd = $("#flawTd");
    var sdrFlawPkid = flawTable.children("input").val();

    if(sdrFlawPkid){
        if (confirm("是否确认删除？")){
            InitFuncCodeRequest_({
                data: {'pkid':sdrFlawPkid, FunctionCode: 'PM_MC_SURVEY_FLAW_DEL'},
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        var newTable = flawTable.clone();
                        newTable.children("input").val("");
                        flawTable.remove();
                        if ($("#flawTd").children().length == 0){
                            $("#flawTd").append(newTable.prop("outerHTML"));
                        }
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
        }
    }else {
        if (flawTd.children().length > 1){
            flawTable.remove();
        }/*else{
            MsgAlert({content: '无法删除模板！', type: 'warning'});
        }*/
    }

    $($("a[type=flawButton]")[0]).focus();
}

/*回填故障零件数据*/
function fillFlawTable(surveyId){
    if(surveyId){
        //查询涉及主要设备
        InitFuncCodeRequest_({
            data: {'surveyId':surveyId, FunctionCode: 'PM_MC_SURVEY_FLAW_LIST'},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    var flawData = jdata.data;
                    var flawTd = $("#flawTd");
                    var flawTable = $("table[name='flawTable']");
                    $.each(flawData, function(index, value){
                        var newRow = null;
                        if (index == 0){
                            newRow = flawTable;
                        }else{
                            newRow = flawTable.clone();
                            flawTd.append(newRow.prop("outerHTML"));
                            newRow = $($("table[name='flawTable']")[index]);
                        }

                        newRow.find("input[name=sdrFlawPkid]").val(value.PKID);
                        value = toCamelCase(value);
                        $.each(value, function(k,v){
                            newRow.find("input[name="+ k +"]").val(v);
                            newRow.find("input[name="+ k +"][type=checkbox]").attr("checked", true);
                        });
                    });
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }
}

/*获取故障零件数据*/
function serializeAreaData(jQ){
    var rows = jQ;
    var resutData = [];
    if (jQ && typeof jQ == 'object') {
        $.each(rows, function(k, v){
            var rowData = {};
            var hiddens = $(v).find("input[type=hidden]");
            //隐藏域
            $.each(hiddens, function(ik, iv){
                var key = $(iv).attr("name");
                if (key){
                    key = key.indexOf("Pkid") >= 0 ? "pkid" : key;
                    var value = $(iv).val();
                    rowData[key] = value;
                }
            });

            var inputs = $(v).find("input[type=text]");
            //文本框
            $.each(inputs, function(ik, iv){
                var key = $(iv).attr("name");
                if(key){
                    var value = $(iv).val();
                    rowData[key] = value;
                }
            });

            //下拉选择框
            var selects = $(v).find("select");
            $.each(selects, function(ik, iv){
                var key = $(iv).attr("name");
                if(key){
                    var value = $(iv).val();
                    rowData[key] = value;
                }
            });

            //checkbox
            var checks = $(v).find("input:checked");
            $.each(checks, function(ik, iv){
                var key = $(iv).attr("name");
                if(key){
                    var value = $(iv).val();
                    rowData[key] = value;
                }
            });

            resutData.push(rowData);
        });
    }

    return resutData;
}

/*补充内容，文件上传*/
function uploadOtherFile(){
    var sourceId = prePgParam.pkid;
    if (!$.trim(sourceId)){
        MsgAlert({content: '请先保存使用困难报告调查单，再上传文件', type: 'warn'});
    }

    //判断是否选择了文件
    var fileInputObj = $("#uploadOtherInput");
    var fileName = fileInputObj.val();
    if (!$.trim(fileName)){
        MsgAlert({content: '请选择文件', type: 'error'});
        return;
    }

    //检查文件大小: 默认为10M
    if (!checkUploadFileSize('uploadOtherInput')) {
        MsgAlert({content: '文件上传超过上限：10M', type: 'error'});
        fileInputObj.val("");
        fileInputObj.focus();
        return;
    }

    $.ajaxFileUpload({
      url: Constant.API_URL + 'ATTACHMENT_UPLOAD',
      secureuri: false,
        fileElementId: 'uploadOtherInput', //file控件id
      dataType: 'json',
      data: {
          "fileCategory": 'MCCSDRSURVEY',
          "sourceId": sourceId,
          'repeat': 'repeat'
      },
      success: function (jdata) {
          if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
              MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.UPLOAD_SUCCESS')});
              //清空文件列表
              fileInputObj.val("");
              //显示已上传的文件
              showUploadedFiles(prePgParam.pkid, "MCCSDRSURVEY", $("#attachesU2"));
          } else {
              MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.UPLOAD_FALIED') + jdata.msg, type: 'error'});
          }
      }
    });

    $("#otherFileUpload").focus();
}

function showUploadedFiles(sourceId, category, ulNode) {
    if (sourceId) {
        InitFuncCodeRequest_({
            data: {
                SOURCE_ID: sourceId,
                CATEGORY: category,
                FunctionCode: 'ATTACHMENT_RSPL_GET'
            },
            successCallBack: function (jdata) {
                if (jdata.code == 200 && jdata.data.length > 0) {
                    //var ulNode = $("#attachesUl");
                    ulNode.find("div").remove();
                    for (var i = 0; i < jdata.data.length; i++) {
                        var imgSrc = "/img/";
                        var fileName = jdata.data[i].ORG_NAME;
                        var fileType = fileName.substr(fileName.lastIndexOf(".") + 1);
                        if (!fileType)
                            continue;

                        fileType = fileType.toLowerCase();
                        if (fileType == 'pdf') {
                            imgSrc += 'icon_pdf.gif';
                        } else if (fileType == 'doc' || fileType == 'docx') {
                            imgSrc += 'icon_word.png';
                        } else if (fileType == 'xls' || fileType == 'xlsx') {
                            imgSrc += 'icon_excel.png';
                        } else if (fileType == 'zip' || fileType == 'rar') {
                            imgSrc += 'icon_zip.png';
                        } else {
                            imgSrc += 'icon_other.png';
                        }

                        var attachFile = '<div style="float:left;margin-left:10px;">' +
                            '<a target="_blank" onclick="downFile(\'' + jdata.data[i].PKID + '\')">' +
                            '<img src="' + imgSrc + '" border="0" style="width:25px;height:25px;"/>' +
                            '<div>' + jdata.data[i].ORG_NAME + '</div></a>' +
                            '<a aIndex=\'i' + jdata.data[i].PKID + '\' target="_blank" onclick="deleteFileBefore(\'' + jdata.data[i].PKID + '\');return false;">' +
                            '<img src="/css/icons/cross.png" border="0" />' + '</a></div>';

                        ulNode.append(attachFile);
                    }
                }
            }
        });
    }
}

function deleteFileBefore(fileId) {
    deleteFile(fileId);
    $("a[aIndex=" + "i" + fileId + "]").parent().remove();
}

function updateEqpFileAfter(surveyId) {
    var ulNode = $("#attachesUl");
    ulNode.find("div").remove();
    if (surveyId) {
        InitFuncCodeRequest_({
            data: {'surveyId': surveyId, FunctionCode: 'PM_MC_SURVEY_EQP_LIST'},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    var eqpData = jdata.data;
                    $.each(eqpData, function (index, value) {
                        showUploadedFiles(value.PKID, "MCCSURVEYEQUIPS");
                    });
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }
}