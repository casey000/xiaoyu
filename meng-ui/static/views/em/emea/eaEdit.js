/**
 EO子列表 初始化

 在eoEditComm.js
 列表 初始化函数IntIfrom()
 基础数据配置
 baseFfromData
 更改数据 ifrom 数据
 UpdateIfromData

 跳转配置
 goNames
 **/
var param;
var operation;
var oriApplyType;
var PAGE_DATA = {};
var ifEvaProduce; //是否评估
var evalApplyType; //EO适用类型
var eoVer; //版次
var msgData;
var pkid;
var eoNoCount;
var checkQua; //提交资质
var accountId;
var adCount; //评估单产生的EA来源文件AD/CAD类型个数
var isReject; //判断是否是联合编写
var evalStaus; //评估单状态
var newAcnos;  //新飞机引进的机号
var imptype;
var applyType;

function i18nCallBack() {
    param = getParentParam_();
    operation = param.operation;
    ifEvaProduce = param.ifEvaProduce;
    imptype = param.imptype;
    pkid = param.pkid;
    evalApplyType = param.evalApplyType;
    applyType = param.applyType;
    if(!pkid){
        pkid = param.recordId;
    }
    var ifEva = '';
    var evaApp = '';
    if(!pkid){
        pkid = '-1';
    }
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: 'EM_EO_LIST_MSG'},
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data != null) {
                    ifEva = jdata.data.IF_EVA_PRODUCE;
                    evaApp = jdata.data.EVAL_APPLY_TYPE;
                    if(!applyType){
                        applyType =  jdata.data.APPLY_TYPE;
                    }
                }
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
    if('add' == operation){
        ifEvaProduce = 'N'
    }else{
        ifEvaProduce = param.ifEvaProduce;
    }
    //eoVer = param.eoVer;
    evalApplyType = param.evalApplyType;
    if(!ifEvaProduce){
        ifEvaProduce = ifEva;
    }
    if(!evalApplyType){
        evalApplyType = evaApp;
    }
    msgData = param.msgData;
    inputInit();
    var url = window.location.search; //获取url中"?"符后的字串
    if (url.indexOf("?") != -1) {
        dataType = url.substr(url.indexOf("=") + 1);
    }
    if (param.isFlow) {
        $("#issueCheckid").hide();
        $("#tranEoid").hide();
        $("#delayid").hide();
        accountId = param.accountId;
    }else{
        accountId = getLoginInfo().accountId;
    }

    if (param.type || msgData) {
        if(param.newAc && param.newAc){//新飞机引进产生的任务
            $("#issueCheckid").hide();
            $("#tranEoid").hide();
            $("#delayid").hide();
            $('#saveId').hide();
            $('#reject').hide();
            $('#repairSourceBtn').attr('disabled', true);
            $("#newAcDealBtn").show();
            newAcnos = param.newAc;
            param.operation = 'view';
        }
    } else {
        pkid = param.pkid;
    }
    if(pkid && evalApplyType > 0){
        countSourceADorCAD(pkid);
    }
    InitFuncCodeRequest_({
        //适用型号 //ATA //新飞机 没配
        async : false,
        data: {
            domainCode: "EM_EO_STATUS,EM_EA_WORK_CLASS,EM_EA_SORT,EMTB_ATA,EM_EO_MONITOR_STATUS,YESORNO,EM_EO_NUMBER_WORK_TYPE,EM_MONITOR_STATUS,EM_EO_CHECK_MARK,EM_MPD_REPAIR_LEVAL,EM_EO_CHECK_TYPE,EM_LIMIT_TYPE,EM_APPL_TYPE,EM_EO_MARK,",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            $('#ifEvaProduce').val(ifEvaProduce); //是否评估产生
            $('#evalApplyType').val(evalApplyType); //评估单适用类型
            PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["EM_EO_STATUS"]);
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('#applyModel').combobox({
                    panelHeight: '150px',
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#eaSort').combobox({
                    panelHeight: 'auto',
                    data: jdata.data.EM_EA_SORT,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function (newValue, oldValue) {
                        var applyType = $('#applyType').combobox('getValue');
                        if("JGXL" == newValue && applyType && applyType == 'APL'){
                            $('#emEoApp6Div').show();
                        }else{
                            $('#emEoApp6Div').hide();
                        }
                    }
                });
                $('#workClassification').combobox({
                    panelHeight: '130px',
                    data: jdata.data.EM_EA_WORK_CLASS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#exeBeforeRemind').combobox({
                    panelHeight: '50px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function (newValue, oldValue) {
                        if(newValue && newValue == 'Y'){
                            $('#exeBeforeRemindDays').textbox({required: true});
                        }else{
                            $('#exeBeforeRemindDays').textbox({required: false});
                        }
                    }
                });
                //新飞机引进是否影响本EO
                $('#ifInfluenceEo').combobox({
                    panelHeight: 'auto',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //检验等级
                $('#inspectionLevel').combobox({
                    panelHeight: '75px',
                    data: jdata.data.EM_EO_CHECK_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //适用类型
                $('#applyType').combobox({
                    panelHeight: '75px',
                    data: jdata.data.EM_APPL_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    /*onSelect: function (data) {
                        setApplyModel(data.VALUE);
                        switchApplyType(data.VALUE);
                    }*/
                    onChange: function (newValue, oldValue) {
                        setApplyModel(newValue);
                        switchApplyType(newValue);
                        if ("ENG" == newValue || "APL" == newValue) {
                            $('#acChoose').show();
                        } else {
                            $('#acChoose').hide();
                            $('#ac').attr('checked', false);
                        }
                        if("ENG" == newValue){
                            $("#acOrEng").html("新发动机引进是否影响本EA");
                        }else{
                            $("#acOrEng").html("新飞机引进是否影响本EA");
                        }
                        if("PART" == newValue){
                            $("#emEoApp4Div").contents().find("#addNrc").show();
                        }else{
                            $("#emEoApp4Div").contents().find("#addNrc").hide();
                        }
                        var eaSort = $('#eaSort').combobox('getValue');
                        if(eaSort && eaSort == 'JGXL' && newValue == 'APL'){
                            $('#emEoApp6Div').show();
                        }else{
                            $('#emEoApp6Div').hide();
                        }
                    }
                });
                //工作性质
                $('#jobCategory').combobox({
                    panelHeight: '50px',
                    data: jdata.data.EM_EO_NUMBER_WORK_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (data) {
                        /*if ("CF" != data.VALUE) {
                            $("#conformityStatement").textbox("setValue", "本EA完全取代其历史版本，已执行历史版本EA的飞机无需执行本EA。")
                        } else {
                            $("#conformityStatement").textbox("setValue", "本EA完全取代其历史版本，已执行历史版本EA的飞机，按照上一次执行时间和本EA的间隔要求重复执行本EA。")
                        }*/
                    }
                });
                //机会检标识
                $('#opportunityCheckFlag').combobox({
                    panelHeight: '170px',
                    data: jdata.data.EM_EO_CHECK_MARK,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //Mark
                $('#mark').combobox({
                    //  panelHeight: '160px',
                    data: jdata.data.EM_EO_MARK,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    multiple: true,
                    panelHeight: 'auto',
                    onUnselect: function (param) {
                        if (param.VALUE == "DM") {
                            $("#eojcNo").textbox('setValue', "");
                        }
                    }
                });
                //监控状态
                $('#monitorState').combobox({
                    panelHeight: '75px',
                    data: jdata.data.EM_EO_MONITOR_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //修理级别
                $('#repairLevel').combobox({
                    panelHeight: '90px',
                    data: jdata.data.EM_MPD_REPAIR_LEVAL,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#ata').combobox({
                    panelHeight: '135px',
                    data: jdata.data.EMTB_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //时限类型
                $('#tlimitType').combobox({
                    panelHeight: '135px',
                    data: jdata.data.EM_LIMIT_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $("#dataType").combobox({
                    panelHeight: '100px',
                    data: jdata.data.DM_DATA_TYPE_TECHNOLOGY,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (row) {
                        setPages(row.VALUE)
                    },
                    onHidePanel: function () {
                        validSelectValue_(this, "输入值不存在！");
                    }
                });

                $("#vendorCode").MyComboGrid({
                    panelWidth: '120',
                    idField: 'VALUE',  //实际选择值
                    textField: 'TEXT', //文本显示值
                    editable: true,
                    required: false,
                    pagination: true,
                    tipPosition: 'top',
                    mode: 'remote',
                    params: {FunctionCode: 'DM_DATA_FROM_F'},
                    url: Constant.API_URL + 'DM_DATA_FROM_F',
                    columns: [[
                        {field: 'VALUE', title: 'CODE', width: 100, sortable: true},
                        {field: 'TEXT', title: 'NAME', width: 100, sortable: true}
                    ]]
                });

                //查看或者评估单是编辑状态时
                checkEvalStaus(pkid, applyType);
                if ("view" == operation) {
                    $(".btn.btn-primary").attr("disabled", true);
                    $(".clearBtn").hide();
                    $('#pdfBtn').removeAttr('disabled');
                }

            }
            IntIfrom();
            if (pkid) {
                $("#dataType").combobox({onlyview: true, editable: false});
                $('#applyModel').combobox({onlyview:true,editable: false});
                //改版的EO工作性质、机会检标识、新飞机引进是否影响本EO只读
                eoCounut(pkid);
                if (eoNoCount > 1) {
                    $('#jobCategory').combobox({onlyview: true, editable: false});
                    $('#opportunityCheckFlag').combobox({onlyview: true, editable: false});
                    $('#ifInfluenceEo').attr("disabled", true);
                }
                InitDataForm(pkid);
                var eaSort = $('#eaSort').combobox('getValue');
                applyTypeShow(applyType, eaSort);
            }

        }
    })
}

//重置单选框
function doClear() {

    $(":radio").each(function () {
        $(this).removeAttr("checked");
    });
    let input = $('input[name="sremodel"]');
    input.attr("disabled", true);
}

//绑定 改装 事件
$("input[name='srefit']").click(function () {
    let input = $('input[name="sremodel"]');
    input.attr("disabled", false);
});


function randomNumber(applyType, applyModel) {
    var num = 1;
    var temp = "";
    var ata = $("#ata").textbox('getValue');
    if (applyType == "APL" || applyType == "ENG") {
        //EO前缀-机型-2位章节-4位流水号
        //EO前缀-发动机型号（位数不定）-2位章节号-4位流水号
        temp = applyModel;
    } else if (applyType == "PART") {
        //EO前缀-CM-2位章节号-4位流水号
        temp = "CM";
    }

    var serialNo = "EA-" + temp + "-" + ata + "-";
    InitFuncCodeRequest_({
        data: {serialNo: serialNo, FunctionCode: "TD_EVAL_EO_BY_NO"},
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data != null) {
                    if (jdata.data.OLDNUM) {
                        num = parseInt(jdata.data.OLDNUM, 10) + 1;
                    }
                }
            } else {
                MsgAlert({content: jdata.msg.replace("msg_err:", ""), type: 'error'});
            }
        }
    });

    num = pad(num, 4);
    serialNo = serialNo + num;
    return serialNo;
}

var pad = function () {
    var tbl = [];
    return function (num, n) {
        var len = n - num.toString().length;
        if (len <= 0) return num;
        if (!tbl[len]) tbl[len] = (new Array(len + 1)).join('0');
        return tbl[len] + num;
    }
}();

/**
 * 初始化数据
 * @param pkid
 * @constructor
 */
function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        async: false,
        data: {pkid: pkid, FunctionCode: "EM_EO_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                oriApplyType = $("#applyType").combobox("getValue");
                if ("ENG" == oriApplyType || "APL" == oriApplyType) {
                    $('#acChoose').show();
                } else {
                    $('#acChoose').hide();
                }
                $(":radio").each(function () {
                    let radioName = $(this).attr('name').toUpperCase();
                    let num = jdata.data[radioName];
                    $("input[name='" + $(this).attr('name') + "']").eq(num).attr('checked', 'true');
                    if ($(this).attr('name') == "srefit") {
                        if (num !== null && num !== undefined) {
                            let input = $('input[name="sremodel"]');
                            input.attr("disabled", false);
                        }
                    }
                });
                $(":checkbox").each(function () {
                    if($(this).attr('name') != 'mark'){
                        var radioName = toLine($(this).attr('name')).toUpperCase();
                        var num = jdata.data[radioName];
                        $(this).prop("checked", num == "Y" ? true : false);
                    }
                    if($(this).attr('name') == 'mark'){
                        var str = jdata.data.MARK;
                        if(str){
                            $(str.split(",")).each(function (i,dom){
                                $(":checkbox[value='"+dom+"']").prop("checked",true);
                            });
                        }
                    }

                });

                //DM或IFSD
                var dm = $('#dm').is(':checked');
                if(dm){
                    $('#eojcTh').css('visibility', 'visible');
                    $('#eojcTd').css('visibility', 'visible');
                }
                var ifsd = $('#ifsd').is(':checked');
                if(ifsd){
                    $('#eojcTh').css('visibility', 'visible');
                    $('#eojcTd').css('visibility', 'visible');
                }


                if (jdata.data.STATUS) {
                    $('#statusTab').html(PAGE_DATA['status'][jdata.data.STATUS]);
                }
                let ver = $("#eoVer").textbox("getValue");
                if (0 < ver) {
                    //$("#jobCategory").combogrid('disable');
                }
                //设置子页面数据
                //  setSubData(jdata.data)
                if(evalApplyType > 0 || eoNoCount > 1){
                    $("#jobCategory").combobox({value:jdata.data.JOB_CATEGORY,required:false,editable:false,onlyview:true});
                }
                //评估单产生的不显示新飞机引进
                if(evalApplyType > 0){
                    $('#ifInfluenceEo').hide();
                    $('#ifInfluenceEo').combobox({required:false});
                    $('#acOrEng').hide();
                    $('#ifInfluenceEoTd').hide();
                    if(adCount > 0){ //来源文件有AD/CAD类型，MARK选中AD
                        $('#ad').prop('checked', true);
                    }else{
                        $('#ad').prop('checked', false);
                    }
                }
                checkIsReject(pkid);
                if(isReject > 0 && !param.isFlow){
                    $('#reject').show();
                }
                setEoPkid();
                //设置旧EO号
                $('#oldEoNo').text(jdata.data.OLD_EO_NO);
            } else {
                MsgAlert({content: jdata.msg.replace("msg_err:", ""), type: 'error'});
            }
        }
    });
}

//MARK DM和IFSD互斥
function chooseDm(dm) {
    var isDm = $(dm).is(':checked');
    if(isDm){
        // $('#ifsd').prop('checked', false);
        $('#eojcTh').css('visibility', 'visible');
        $('#eojcTd').css('visibility', 'visible');
        $('#eojcNo').textbox('setValue', '');
    }else{
        $('#eojcTh').css('visibility', 'hidden');
        $('#eojcTd').css('visibility', 'hidden');
    }

}

function chooseIfsd(ifsd) {
    var isIfsd = $(ifsd).is(':checked');
    if(isIfsd){
        // $('#dm').prop('checked', false);
        $('#eojcTh').css('visibility', 'visible');
        $('#eojcTd').css('visibility', 'visible');
        $('#eojcNo').textbox('setValue', '');
    }else{
        $('#eojcTh').css('visibility', 'hidden');
        $('#eojcTd').css('visibility', 'hidden');
    }

}

// 保存
function save() {
    var isValidate = $("#mform").form('validate');
    if (!isValidate) return;


    let applyType = $("#applyType").combobox("getValue");
    if (applyType != oriApplyType) {

        if (oriApplyType == "PART") {
            if (!confirm('原类型为部件，切换将清空时限')) {
                return;
            }
        }
        if (oriApplyType == "APL") {

            if (!confirm('原类型为机身，切换将清空时限')) {
                return;
            }
        }
        if (oriApplyType == "ENG") {
            if (!confirm('原类型为发动机，切换将清空时限')) {
                return;
            }

        }

    }

    var $form = $("#mform");
    var datas = $form.serializeObject();
    if (Array.isArray(datas['ata'])) {
        datas['ata'] = datas['ata'].join(',');
    }
    /*if (Array.isArray(datas['mark'])) {
        datas['mark'] = datas['mark'].join(',');
    }*/
    var isDm = $('#dm').is(':checked');
    var isIfsd   = $('#ifsd').is(':checked');
    var eojcNo = $("#eojcNo").textbox('getValue');
    if(!isDm && !isIfsd && eojcNo){
        MsgAlert({content: '请选中MARK中的DM或IFSD，或删除关联工卡数据' , type: 'error'});
        return;
    }

    var mark_value =[];
    $('input[name="mark"]:checked').each(function(){
        mark_value.push($(this).val());
    });
    if(mark_value.length != 0){
        datas['mark'] = mark_value.join(',');
    }
    let radis = {};
    $(":radio").each(function () {
        let radioName = $(this).attr('name');
        radis[radioName] = $("input[name='" + radioName + "']:checked").val();
    });

    $(":checkbox").each(function () {
        if($(this).attr('name') != 'mark'){
            radis[$(this).attr('name')] = $(this).is(':checked') ? "Y" : "N";
        }
    });

    var addFlag = false;
    if ("add" == operation) {
        addFlag = true;
        datas.eoVer = 0;
        datas.eoNo = randomNumber(datas.applyType, datas.applyModel);
        datas.status = "00"
    }else{
        datas.eoNo = $('#eoNo').textbox('getValue');
    }
    datas.eoEa = "EA";
    var repairSource = $('#repairSource').textbox('getValue');
    var eojcNo = $('#eojcNo').textbox('getValue');
    if(repairSource){
        datas.repairSource = repairSource;
    }
    if(eojcNo){
        datas.eojcNo = eojcNo;
    }
    //符合性声明
    //datas.conformityStatement = $('#conformityStatement').textbox('getValue');
    //适用型号
    datas.applyModel = $('#applyModel').combobox('getValue');
    datas.applyType = $('#applyType').combobox('getValue');
    datas = $.extend({msgData: param.msgData, msgpkid: param.msgpkid},
        datas, radis, {FunctionCode: 'EM_EO_ADD'});
    InitFuncCodeRequest_({
        async: false,
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (param.OWindow && param.OWindow.onSearch_) {
                    param.OWindow.onSearch_('dg', '#ffSearch');
                }
                // param.OWindow.MsgAlert({content: jdata.msg.replace("msg_err:", "") ? jdata.msg.replace("msg_err:", "") : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                MsgAlert({content: jdata.msg.replace("msg_err:", "") ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                mpkid = jdata.data.pkid;
                var app = jdata.data.applyType;
                if (operation == "add") {
                    $("#pkid").val(mpkid);
                    $("#writeManId").val(jdata.data.writeManId);
                    $("#applyType").attr("disabled", true);
                    $("#eoNo").textbox('setValue', jdata.data.eoNo);
                }
                pkid = mpkid;
                parent.frames["emEoApp4Div"].reload_(pkid);
                if(app == 'APL'){
                    parent.frames["emEoApp4Div"].$('#sfe').attr('disabled',true);
                    parent.frames["emEoApp4Div"].$('#wwe').attr('disabled',true);
                    parent.frames["emEoApp4Div"].$("#sfe").prop("checked", true);
                }
                operation = "edit";
                setEoPkid();
                inputInit();
                if (msgData) {
                    param.OWindow.reloadTodo();
                }
                if(addFlag){ //新增EO保存后数据变更根据适用类型显示
                    var applyType = $('#applyType').combobox('getValue');
                    var eaSort = $('#eaSort').combobox('getValue');
                    applyTypeShow(applyType, eaSort);
                }
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
}


//设置适用型号
function setApplyModel(applyType) {
    if ("PART" == applyType) {
        $("#applyModel").combobox("setValue", "CM");
        $("#applyModel").combobox("disable");

    } else {
        var datas2 = $.extend({applyType: applyType}, {FunctionCode: 'EM_EO_APPLY_MODEL'});
        InitFuncCodeRequest_({
            async: false,
            data: datas2, successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    $('#applyModel').combobox({
                        panelHeight: '150px',
                        valueField: 'VALUE',
                        textField: 'TEXT',
                        data: jdata.data
                    });
                } else {
                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                }
            }
        });
        $("#applyModel").combobox("setValue", "");
        //$("#applyModel").combobox("disable", "");
    }

}


function checkMq() {
    var mark_value =[];
    $('input[name="mark"]:checked').each(function(){
        mark_value.push($(this).val());
    });
    var is = false;
    for (var i = 0; i < mark_value.length; i++) {
        if (mark_value[i] == 'DM' || mark_value[i] == 'IFSD') {
            is = true;
        }
    }
    if (!is) {
        MsgAlert({content: "请选择DM或者IFSD", type: 'error'});
        return;
    }
    var eojcNo = $('#eojcNo').textbox('getValue');
    ShowWindowIframe({
        width: 800,
        height: 550,
        param:{eojcNo: eojcNo},
        title: "工卡选择",
        url: "/views/em/emeo/add/EmEomarkQEdit.shtml"
    });
}


function setEojcNo(eojcNo) {
    $("#eojcNo").textbox('setValue', eojcNo);
}


function tranEo() {
    if (operation == "add") {
        MsgAlert({content: "请先保存"});
        return;
    }
    var evaId = $("#writeManId").val();
    var traFlag = "Y";//任务页面进行的转发，第二次转发
    ShowWindowIframe({
        width: 450,
        height: 150,
        title: "转发",
        param: {accId: evaId, pkid: pkid, traFlag: traFlag, msgpkid: param.msgpkid},
        url: '/views/em/emeo/emEo_filetrans.shtml'
    });
}

/**
 * 提交
 */
function issueCheck() {
    if (operation == "add") {
        MsgAlert({content: "请先保存"});
        return;
    }

    var isValidate = $("#mform").form('validate');
    if (!isValidate) {
        MsgAlert({content: '请完整填写页面必填内容保存后再进行该操作', type: 'error'});
        return;
    }


    var applyType = $('#applyType').combobox('getValue');
    //评估单产生的，EE必须提交了工作流后才可提交
    if(evalApplyType > 0){
        checkEvalStaus(pkid, applyType);
        if(evalStaus && evalStaus == 'PGZ'){
            MsgAlert({content: "关联的评估单状态为评估中不能提交该EA！", type: 'error'});
            return;
        }
    }

    var app = '';
    InitFuncCodeRequest_({
        data: {eoPkid: pkid, FunctionCode: 'EM_EO_TLIMIT_DETAIL_CHECK'},
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data != null) {
                    app = jdata.data.APP;
                }
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
    if (app && applyType == 'APL') {
        MsgAlert({content: "时限引用的以下适用性["+app+"]在EO适用性里不存在，请先在时限位置重新保存再提交！", type: 'error'});
        return;
    }


    var isDm = $('#dm').is(':checked');
    var isIfsd   = $('#ifsd').is(':checked');
    var eojcNo = $("#eojcNo").textbox('getValue');
    if(!isDm && !isIfsd && eojcNo){
        MsgAlert({content: '请选中MARK中的DM或IFSD，或删除关联工卡数据' , type: 'error'});
        return;
    }

    var $form = $("#mform");
    var datas = $form.serializeObject();
    if (Array.isArray(datas['ata'])) {
        datas['ata'] = datas['ata'].join(',');
    }
    var mark_value =[];
    $('input[name="mark"]:checked').each(function(){
        mark_value.push($(this).val());
    });
    if(mark_value.length != 0){
        datas['mark'] = mark_value.join(',');
    }
    if ("add" == operation) {
        datas.eoVer = 0;
    }
    var radis = {};
    $(":radio").each(function () {
        var radioName = $(this).attr('name');
        radis[radioName] = $("input[name='" + radioName + "']:checked").val();
    });

    $(":checkbox").each(function () {
        if($(this).attr('name') != 'mark'){
            radis[$(this).attr('name')] = $(this).is(':checked') ? "Y" : "N";
        }
    });

    if ("add" == operation) {
        datas.eoNo = randomNumber(datas.applyType, datas.applyModel);
        datas.status = "00"
    }

    var applyMode = $('#applyModel').combobox('getValue');
    var ata = $('#ata').combobox('getValue');

    datas = $.extend(datas, radis, {FunctionCode: 'EM_EO_STATUS'});
    InitFuncCodeRequest_({
        data: datas,
        successCallBack: function (jdata) {
            if (jdata.code != null) {
                ajaxLoading();
                var datasss = $.extend(datas, radis, {FunctionCode: 'EM_EO_CHECKDATA', list:'N'});
                InitFuncCodeRequest_({
                    data: datasss,
                    successCallBack: function (jdata) {
                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                            var model = '';
                            if(applyType != 'PART'){
                                model = applyMode;
                            }else{
                                model = 'CM';
                            }
                            checkSumitQua(model, ata);
                            if(!checkQua){
                                if(!confirm('当前用户无提资质，请选择资质人?')){
                                    ajaxLoadEnd();
                                    return;
                                }
                                chooseQua(model, ata, pkid, 'edit');
                            }else{
                                //EO/EA含有对应的EO/EA工卡 且 EO/EA非初始版本(给出提醒，但是不拦截)
                                var jcCou = 0;
                                InitFuncCodeRequest_({
                                    data: {eoPkid: pkid, FunctionCode: 'EM_EO_JC_COU'},
                                    async: false,
                                    successCallBack: function (jdata) {
                                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                            if (jdata.data != null) {
                                                jcCou = jdata.data.COU;
                                            }
                                        } else {
                                            MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                                        }
                                    }
                                });
                                if (jcCou > 0 && eoNoCount > 1) {
                                    alert("注意：改版此EO/EA请关注对应工卡是否同步修改，如需修改请到工卡模块手动发起改版");
                                }
                                common_add_edit_({
                                    identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                                    param: {
                                        roleId: '',
                                        otherParam: datas.pkid,
                                        msgpkid: param.msgpkid,
                                        FunctionCode_: 'EM_EA_START',
                                        successCallback: sumbitReload,
                                        flowKey:"eashenhe"
                                    },
                                    url: "/views/flow/work_flow_account_select.shtml"
                                });
                            }

                        } else {
                            hints(jdata.msgData[0]);
                        }
                        ajaxLoadEnd();

                    }
                });
            } else {
                MsgAlert({content: "该数据已被提交过了。", type: 'error'});
            }

        }
    });

}

//驼峰转下划线
function toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}


//切换EO类型
function switchApplyType(applyType) {
    if (applyType == "PART") {
        $('#partTr').show();
        $('#aplWorkTr').hide();
        let monitorState = $("#monitorState").combobox('getValue');
        let repairLevel = $("#repairLevel").combobox('getValue');

        $("#monitorState").combobox({"disabled": false});
        $("#repairLevel").combobox({"disabled": false});
        $("#monitorState").combobox('setValue', monitorState);
        $("#repairLevel").combobox('setValue', repairLevel);
    } else {
        $('#partTr').hide();
        $("#monitorState").combobox({"disabled": true});
        $("#repairLevel").combobox({"disabled": true});
        $("#monitorState").combobox('setValue', "");
        $("#repairLevel").combobox('setValue', "");
    }
}


function jcPreview(url) {
    ShowWindowIframe({
        width: 1200,
        height: 650,
        param: {url: url},
        title: "EA预览PDF",
        url: "/views/em/emeo/emeo_add_pdf.shtml"
    });
}

function print() {
    if (operation == "add") {
        MsgAlert({content: "请先保存"});
        return;
    }
    ajaxLoading();
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: 'EM_EO_PRINT'},
        successCallBack: function (jdata) {
            ajaxLoadEnd();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                let urls = jdata.data;
                if (urls.indexOf(":") != -1) {
                    urls = urls.substring(urls.indexOf(":") + 1).replace("//", "/");
                }
                jcPreview(urls);
            } else {
                MsgAlert({content: jdata.msg, type: "error"});
            }
        }
    });
}

function reloadTo() {
    if (param.OWindow.reloadTodo) {
        param.OWindow.reloadTodo();
    }
    if (param.OWindow.reload_) {
        param.OWindow.reload_();
    }

}

//输入框初始化 禁用
function inputInit() {
    if ("add" == operation) {
        $("#eoVer").textbox('setValue', "0");
        $("#applyType").attr("disabled", false);
    } else {
        $("#ata").combogrid('disable');
        $("#applyModel").combogrid('disable');
        $("#applyType").combogrid('disable');
    }
}

/**
 * 延期申请
 */
function delay() {
    //openTab("EO延期情况");
    var status = $("#status").val();
    if (status != "00") {
        MsgAlert({content: 'EA不是编写中，不允许提交延期申请！', type: 'error'});
        return false;
    }
    if (pkid == "") {
        MsgAlert({content: '请先保存基本信息！', type: 'error'});
        return false;
    }
    var isValidate = $("#mform").form('validate');
    if (!isValidate) {
        MsgAlert({content: '请完整填写页面必填内容保存后再进行该操作', type: 'warn'});
        return false;
    }

    var writeDeadline = $('#writeDeadline').val();
    var eoNo = $('#eoNo').textbox('getValue');
    ShowWindowIframe({
        width: 610,
        height: 330,
        param: {
            postponeSort: "EA",//EMFILEEVA
            postponeObjectPkid: pkid,
            postponeObjectNo: eoNo,
            originalDeadline: writeDeadline
        },
        title: "延期申请",
        url: "/views/em/empostpone/empostpone_add.shtml"
    });
}

function repairSourceEdit() {
    var repairSource = $('#repairSource').textbox('getValue');
    ShowWindowIframe({
        width: 800,
        height: 550,
        param:{repairSource: repairSource},
        title: "修理来源",
        url: "/views/em/emea/add/EmEoRepairSourceEdit.shtml"
    });
}


function setRepairSource(eoNrcNo) {
    $("#repairSource").textbox('setValue', eoNrcNo);
}

function sumbitReload() {
    CloseWindowIframe();
    param.OWindow.reload_();
}

function hints(mgs) {
    ShowWindowIframe({
        width: 300,
        height: 300,
        param: {mgs: mgs},
        title: "EA提示",
        url: "/views/em/emeo/eoHints.shtml"
    });
}

function eoCounut(pkid){
    InitFuncCodeRequest_({
        async: false,
        data: {pkid: pkid, FunctionCode: 'EM_EO_NO_COUNT'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eoNoCount = jdata.data.EO_NO_COUNT;
            } else {
                MsgAlert({content: jdata.msg, type: "error"});
            }

        }
    });
}

//根据适用类型显示
function applyTypeShow(applyType, eaSort){
    if(applyType == 'ENG' || applyType == 'PART' || 'JGXL' != eaSort){//发动机和部件类EA 隐藏载重平衡部分
        $('#emEoApp6Div').hide();
    }
    if(applyType == 'APL'){
        $('#emEoApp4Div').contents().find('#dg2Div').hide();
    }
}

//EO提交资质检查
function checkSumitQua(applyModel, ata) {
    InitFuncCodeRequest_({
        async : false,
        data: {FunctionCode: 'EM_EO_SUBMIT_QUA_CHECK',
            applyModel: applyModel, ata: ata, taskType:'EMFILEEVAL', divisionQua: 'QUA', accountId : accountId},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if(jdata.data.CHECK_COUNT && jdata.data.CHECK_COUNT > 0){
                    checkQua = true;
                }else{
                    checkQua = false;
                }
            }
            else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                checkQua = false;
            }
        }
    });
}

//选择有资质的人
function chooseQua(applyModel, ata, eoPkid, type) {
    var title_ = '资质人选择';
    ShowWindowIframe({
        width: 600,
        height: 700,
        title: title_,
        param: {applyModel: applyModel, ata: ata, taskType:'EMFILEEVAL', divisionQua: 'QUA', eoPkid: eoPkid, type: type},
        url: "/views/em/emeo/em_eo_qua_list.shtml"
    });
}

//查询来源文件是否有AD和CAD类型
function countSourceADorCAD(pkid){
    InitFuncCodeRequest_({
        async : false,
        data: {eoPkid: pkid, eoEa:'EA', FunctionCode: 'EM_EO_SOURCE_FLIE_ADORCAD_COUNT'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                adCount = jdata.data.AD_COUNT;
            }else {
                adCount = 0;
            }
        }
    });
}

function checkEvalStaus(pkid, applyType) {
    InitFuncCodeRequest_({
        async: false,
        data: {eoPkid: pkid, eoEa: 'EA', applyType: applyType ,FunctionCode: 'EM_EO_EVAL_FILE_STATUS'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                evalStaus = jdata.data.STATUS;
            }
        }
    });
}

//判断是否是联合评估
function checkIsReject(pkid){
    InitFuncCodeRequest_({
        async : false,
        data: {eoPkid: pkid, FunctionCode: 'EM_EO_TRANSMIT_UNIT_EDIT_EOPKID'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                isReject = jdata.data.IF_REJIECT_COUNT;
            }else {
                isReject = 0;
            }
        }
    });
}

//EO驳回
function rejectEo(){
    ShowWindowIframe({
        width: "450",
        height: "200",
        param: {
            eoPkid: pkid
        },
        url: "/views/em/emeo/em_eo_reject.shtml"
    });
}

//飞机引进处理
function newAcDeal() {
    ajaxLoading();
    InitFuncCodeRequest_({
        data: {pkid: pkid, newAcnos: newAcnos ,type:imptype,FunctionCode: 'EM_EO_NEWAC_DEAL'},
        successCallBack: function (jdata) {
            ajaxLoadEnd();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                param.OWindow.reload_();
                CloseWindowIframe();
            }else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
}

function reloadParent(){
    param.OWindow.reload_();
}

//下拉框校验
$.extend($.fn.validatebox.defaults.rules, {
    comboBoxEditvalid: { //校验下拉菜单
        validator: function (value, param) {
            var $combobox = $("#" + param[0]);
            if (value) {
                /*if ($combobox.combobox('getValue') == $combobox.combobox('getText'))
                    return false;*/
                var result = true;
                var allData = $combobox.combobox('getData');
                for(var i = 0; i< allData.length; i++){
                    if(value == allData[i].TEXT){
                        result = false;
                        break;
                    }
                }
                if(result){
                    return false;
                }else{
                    return true;
                }

            }
            return false;

        },
        message: '请选择下拉框选项，不要直接使用输入内容'
    },
    comboBoxMultiEditvalid: { //校验可多选下拉菜单
        validator: function (value, param) {
            var $combobox = $("#" + param[0]);
            if (value) {
                var allData = $combobox.combobox('getData');
                var allArray = [];
                for(var i=0; i< allData.length;i++){
                    allArray.push(allData[i].TEXT);
                }
                var valueData = value.split(',');
                var result = isContained(allArray, valueData);
                return result;
            }
            return false;
        },
        message: '请选择下拉框选项，不要直接使用输入内容'
    },
    comboBoxMarkvalid: { //校验Mark DM与IFSD互斥
        validator: function (value, param) {
            var $combobox = $("#" + param[0]);
            if (value) {
                var valueData = value.split(',');
                if(valueData.indexOf('DM')!= -1 && valueData.indexOf('IFSD')!= -1){
                    return false;
                }else{
                    return true;
                }
            }
            return false;
        },
        message: 'DM与IFSD不能同时选择'
    },
});

//判断数组aa是否包含数组bb
function isContained(aa, bb) {
    if(!(aa instanceof Array) || !(bb instanceof Array) || ((aa.length < bb.length))) {
        return false;
    }
    for (var i = 0; i < bb.length; i++) {
        var flag = false;
        for(var j = 0; j < aa.length; j++){
            if(aa[j] == bb[i]){
                flag = true;
                break;
            }
        }
        if(flag == false){
            return flag;
        }
    }

    return true;
}