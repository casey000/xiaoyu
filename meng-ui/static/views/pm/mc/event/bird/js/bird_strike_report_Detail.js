var param;
var operation;
var PAGE_DATA = {};

function i18nCallBack() {
    param = getParentParam_();
    operation = param.operation;

    InitFuncCodeRequest_({
        data: {
            domainCode: "MSGRP",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //机号
                $('#acno').combobox({
                    panelHeight: '135px',
                    data: jdata.data.MSGRP,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                PAGE_DATA['acno'] = DomainCodeToMap_(jdata.data["MSGRP"]);

                //初始化界面
                initForm();
            }else{
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//根据页面要求对单选框和复选框中文本框进行初始化
function initForm() {

    try{
        $('#reportName').textbox('setValue', getLoginInfo().userName);
    }catch(e){
        console.log(e)
    }

    $("#occurDate").datetimebox('setValue', formatDateTime(new Date()));

    //acno选中事件
    $("#acno").combobox({
        onSelect: function(value){
            getActype();
        }
    });

    if (operation == 'view'){
        $("#saveBtn").remove();
        $("#closeBtn").remove();
        InitDataForm();
    }else if(operation == 'edit'){
        InitDataForm();
    }
}

//回显数据
function InitDataForm() {
    InitFuncCodeRequest_({
        data: {pkid: param.pkid, FunctionCode: "BIRD_STRIKE_REPORT_LIST"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE && jdata.data.length == 1) {
                //给所有对应表单name属性的值赋值
                ParseFormField_(jdata.data[0], $("#mform"), Constant.CAMEL_CASE);

                //特殊元素初始化
                initSpeciaEle(jdata.data[0]);
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

/*特殊元素进行初始化*/
function initSpeciaEle(data){
    if (!data){
        return;
    }

    //初始化acno
    if (data.ACNO){
        $('#acno').combobox("setValue", data.ACNO);
    }
    //发生时段radio
    if (data.OCCUR_TIME){
        $("input[type=radio][name=occurTime][value=" + data.OCCUR_TIME + "]").click();
    }
    //发生地checkbox
    if (data.LOCATION){
        var locations = data.LOCATION.split(",");
        $.each(locations, function(k,v){
            $("input[type=checkbox][flag=location][value=" + v + "]").attr("checked", true);
        });
    }
    //发生地内场checkbox
    if (data.INSIDE_AIRPORT){
        var locations = data.INSIDE_AIRPORT.split(",");
        $.each(locations, function(k,v){
            $("input[type=checkbox][flag=insideAirport][value=" + v + "]").attr("checked", true);
        });
    }
    //飞行阶段checkbox
    if (data.FLIGHT_PHASE){
        var values = data.FLIGHT_PHASE.split(",");
        $.each(values, function(k,v){
            $("input[type=checkbox][flag=flightPhase][value=" + v + "]").attr("checked", true);
        });
    }
    //天气radio
    if (data.SKY){
        $("input[type=radio][name=sky][value=" + data.SKY + "]").click();
    }
    //降水radio
    if (data.PRECIPITATION){
        $("input[type=radio][name=precipitation][value=" + data.PRECIPITATION + "]").click();
    }
    //飞机遭撞击受损部位checkbox & radio
    if (data.DAMAGE_PART){
        var values = data.DAMAGE_PART.split(",");
        $.each(values, function(k,v){
            var sdous = v.split("_");
            if(sdous.length == 3){
                $("input[type=checkbox][flag=damagePart][value=" + sdous[0] + "]").attr("checked", true);
                $("input[type=radio][name=" + sdous[0] + "_sd][value=" + sdous[1] + "]").click();
                $("input[type=radio][name=" + sdous[0] + "_ou][value=" + sdous[2] + "]").click();
            }
        });
    }
    //对飞行的影响
    if (data.FLIGHT_EFFECT){
        var values = data.FLIGHT_EFFECT.split(",");
        $.each(values, function(k,v){
            $("input[type=checkbox][flag=flightEffect][value=" + v + "]").attr("checked", true);
        });
    }
    //是否被警告
    if (data.PILOT_WARNED){
        $("input[type=radio][name=pilotWarned][value=" + data.PILOT_WARNED + "]").click();
    }
    //鸟只体型
    if (data.BIRD_SIZE){
        $("input[type=radio][name=birdSize][value=" + data.BIRD_SIZE + "]").click();
    }
    //是否有残留物
    if (data.BIRD_REMAIN){
        $("input[type=radio][name=birdRemain][value=" + data.BIRD_REMAIN + "]").click();
    }
    //鸟只数量
    if (data.BIRDS_NUMBER){
        var values = data.BIRDS_NUMBER.split(",");
        if (values.length == 3){
            $("#see_" + values[0]).numberbox("setValue", values[1]);
            $("#strike_" + values[0]).numberbox("setValue", values[2]);
        }
    }
}

/*获取航班号*/
function getFlightNo(){
    var acno = $("#acno").combobox("getValue");
    if (acno){
        ShowWindowIframe({
            width: "960",
            height: "450",
            title: "航班号列表",
            param: {acReg: acno},
            url: "/views/common/select_fltno_list.shtml"
        });
    }else{
        MsgAlert({content: '请先选择航空注册号', type:'warning'});
    }
}

//航班获取回调方法
function queryFltno(rowData){
    if(rowData && rowData.FLIGHT_NO){
        $("#flightNo").textbox("setValue", rowData.FLIGHT_NO);
        $("#takeOn").textbox("setValue", rowData.FROM_STATION);
        $("#takeOff").textbox("setValue", rowData.TO_STATION);
    }
}

// 保存
function save() {
    //对应表格是否取到全部值
    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;
    //获得表单所有文本框及下拉框的值
    var total_mform = $("#mform").serializeObject();

    //发生地(location)
    var locationArr = $("input[type=checkbox][flag=location]:checked");
    var location = [];
    $.each(locationArr, function(k, v){
        location.push($(v).val());
    });
    location = location.join(",");

    //内场
    var insideAirportArr = $("input[type=checkbox][flag=insideAirport]:checked");
    var insideAirport = [];
    $.each(insideAirportArr, function(k, v){
        insideAirport.push($(v).val());
    });
    insideAirport = insideAirport.join(",");

    //飞行阶段
    var flightPhaseArr = $("input[type=checkbox][flag=flightPhase]:checked");
    var flightPhase = [];
    $.each(flightPhaseArr, function(k, v){
        flightPhase.push($(v).val());
    });
    flightPhase = flightPhase.join(",");

    //飞行影响
    var flightEffectArr = $("input[type=checkbox][flag=flightEffect]:checked");
    var flightEffect = [];
    $.each(flightEffectArr, function(k, v){
        flightEffect.push($(v).val());
    });
    flightEffect = flightEffect.join(",");

    //撞击受损部件
    var damagedParts = $("input[type=checkbox][flag=damagePart]:checked");
    var damagePart = [];
    $.each(damagedParts, function(k, v){
        var part = "";
        var sd = $("input[type=radio][name=" + $(v).val() + "_sd]:checked").val();
        if (sd && sd.trim()){
            var ou = $("input[type=radio][name=" + $(v).val() + "_ou]:checked").val();
            if (ou && ou.trim()){
                part = $(v).val() + "_" + sd + "_" + ou;
                damagePart.push(part);
            }
        }
    });
    damagePart = damagePart.join(",");

    //鸟的数量
    var birdsNumber = "";
    for (var i = 4; i > 0; i--){
        var seenNum = $("#see_" + i).numberbox("getValue");
        var struckNum = $("#strike_" + i).numberbox("getValue");
        if (seenNum || struckNum) {
            birdsNumber = i + "," + seenNum + "," + struckNum;
            break;
        }
    }

    //从一个对象中解析出字符串
    var data = $.extend({}, total_mform, {
        type: operation,
        FunctionCode: "PM_MC_BIRD_ADD_OR_EDIT",
        location:location,
        insideAirport:insideAirport,
        flightPhase:flightPhase,
        flightEffect:flightEffect,
        damagePart:damagePart,
        birdsNumber:birdsNumber
        });

    InitFuncCodeRequest_({
        data: data,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.COMMON.OPT_SUCCESS')});
                CloseWindowIframe();
                param.OWindow.reload_();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//根据机号从飞机主数据库获取机型/发动机型号
function getActype() {
    //得到机号的值
    var ACNO = $("#acno").combobox('getValue');
    InitFuncCodeRequest_({
        data: {ACNO: ACNO, FunctionCode: "DA_ACREG_MAN_ACTYPE"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //判断查机型是否存在，防止为空
                if (jdata && jdata.data) {
                    //给机型/发动机型号赋值
                    $('#actype').textbox("setValue", jdata.data.MP_ACTYPE);
                    $("#engType").textbox("setValue", jdata.data.ENG_MODEL);
                }
            }
        }
    })
}

//关闭当前窗口
function closeWindow() {
    if(operation != 'view'){
        if (confirm("确认取消编辑/新增？")) {
          CloseWindowIframe();
        }
    }else{
        CloseWindowIframe();
    }
}
        