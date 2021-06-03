/**
 * Created by tpeng on 2017/3/1.
 */
var PAGE_EVENTS = {
    beforeSubmit : function (data) {return true;},
    beforeTurnBack : function (data) {return true;},

    afterSubmit : function (data) {},
    afterTurnBack : function (data) {},
};
var param = {};
function i18nCallBack() {
    param = getParentParam_();
    $("#workflow").DiagramWorkFlow({
        imageUrl: "/api/activiti/diagram/flowimage?procInstId=" + param.PROC_INST_ID,   //流程图url
        traceUrl: '',
        isRevert: true,//是否还原展示流程图，{还原Activiti裁剪后的流程图，即将偏移量x=x+minX,y=y+minY}
        offsetX: 0,  //偏移量X
        offsetY: 0   //偏移量Y
    });
    InitResources();
}

var TypeMap_ = {};
function InitResources(){
    InitFuncCodeRequest_({
        data: {
            FunctionCode: 'PROCESS_FORM_RESOURCE',
            taskId: param.TASK_ID, flowDefId : param.FLOW_DEF_ID
        },
        successCallBack: function (jdata) {
            if (jdata.code != RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({ content: jdata.msg, type: 'error'});
                return;
            }
            var resource = jdata.data.data;
            var form = jdata.data.form;
            var execution = jdata.data.execution;
            var node = jdata.data.node;
            //TypeMap_ = jdata.data.typeMap;
            var variables = eval(node.variables);
            var options = arrangeVariables(variables);
            $.each(options, function(k,it){
                if(it[0].varOption == 'Textbox'){
                    var vdata = { titleName : it[0].varName, fieldName: it[0].varKey, value: '' };
                    if(typeof(TypeMap_[it[0].varKey]) == 'undefined'){
                        TypeMap_[it[0].varKey] = it[0].varDataType || '';
                    }
                    laytpl($('#tempTextbox').html()).render(vdata, function(html){
                        $('#custom_options').append(html);
                    });
                }else if(it[0].varOption == 'Combobox'){
                    var vdata = { titleName : it[0].varName, fieldName: it[0].varKey, options:[] };
                    $.each(it, function(k1, it1){
                        vdata.options.push({text: it1.varValue, value: it1.varValue });
                        if(typeof(TypeMap_[it1.varKey]) == 'undefined'){
                            TypeMap_[it1.varKey] = it1.varDataType || '';
                        }
                    });
                    laytpl($('#tempCombobox').html()).render(vdata, function(html){
                        $('#custom_options').append(html);
                    });
                }
            });
            $.parser.parse($('#custom_options'));
            //[{"varName":"请假审批","varKey":"auditing","varValue":"同意","varOption":"Y"},{"varName":"请假审批","varKey":"auditing","varOption":"Y","varValue":"拒绝"},{"varName":"申请人","varKey":"proposer","varOption":"N","varValue":"-"}]
            var resource_ = toCamelCase(resource);
            if(typeof(InitLoadResource) == 'function'){
                InitLoadResource(resource, execution, node);
            }
            ParseFormField_(execution, $("#processInfo"), null);
            ParseFormField_(node, $("#processInfo"), null);
            //$('#proposer').val(resource.USER_ID);
            if(node.canReturn == 'Y'||true){
                $("input:checkbox[name='canReturn']").attr("checked", "checked");
                $("#canReturn").removeAttr("disabled").addClass('btn-primary');
            }else{
                $("#canReturn").remove();
            }
            if(node.canTrunTo == 'Y'){
                $("input:checkbox[name='canTrunTo']").attr("checked", "checked");
                $("#canTrunTo").removeAttr("disabled").addClass('btn-primary');
            }else{
                $("#canTrunTo").remove();
            }
            $("#canTerminate").remove();
            $("#canHangUp").remove();
           /* if(node.canTerminate == 'Y'){
                $("input:checkbox[name='canTerminate']").attr("checked", "checked");
                $("#canTerminate").removeAttr("disabled").addClass('btn-primary');
            }else{
                $("#canTerminate").remove();
            }
            if(node.canHangUp == 'Y'){
                $("input:checkbox[name='canHangUp']").attr("checked", "checked");
                $("#canHangUp").removeAttr("disabled").addClass('btn-primary');
            }else{
                $("#canHangUp").remove();
            }
            */
            $("#canSubmit").removeAttr("disabled").addClass('btn-primary');
            setWinTitle(parseExpression(form.formTitle, resource_));
        }
    });
    InitHistoryDG();
    InitTab();
}

function InitTab(){
    $('#tabs').tabs({ onSelect : function(title, index){ } });
}

function doSubmit(){

    $.messager.confirm('提示', '您确定要提交吗?', function(r){
        if (r){
            var $form = $("#mform");
            var isValidate = $form.form('validate');
            if (!isValidate) { return false; }
            var data = $form.serializeObject();
            data = $.extend({ _return : "N" }, data, {
                FunctionCode: 'PROCESS_TASK_SUBMIT', //PROCESS_TERMINATE_TASK
                taskId: param.TASK_ID, flowDefId : param.FLOW_DEF_ID,
                typeMap: JSON.stringify(TypeMap_)
            });
            if(!PAGE_EVENTS.beforeSubmit(data)){
                return;
            }
            MaskUtil.mask("请求处理中...");
            InitFuncCodeRequest_({
                data: data,
                successCallBack: function (jdata) {
                    MaskUtil.unmask();
                    PAGE_EVENTS.afterSubmit(jdata);
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        if(typeof(param.OWindow.reload_ == 'function')) {
                            param.OWindow.reload_();
                        }
                        param.OWindow.MsgAlert({ content : jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.COMMON.OPT_SUCCESS')  });
                        CloseWindowIframe();
                    } else {
                        MsgAlert({ content: $.i18n.t(jdata.msgData[0]), type: 'error'});
                    }
                }
            });
        }
    });
}

function doReturn(){
    var msg;
    var isFirstNode = $("#isFirstNode").val();
    if('Y' == isFirstNode){
        msg = '您确定要退回吗?<br/> <input name="rdo_return" type="radio" value="top" checked="checked"/> 退回到开始';
    }else{
        msg = '您确定要退回吗?<br/> <input name="rdo_return" type="radio" value="up" checked="checked"/> 退回到上一级 <br/> <input name="rdo_return" type="radio" value="top"/> 退回到开始';
    }
    $.messager.confirm('提示', msg, function(r){
        if (r){
            var notes = $("#notes").textbox('getValue');
            if($.trim(notes) == ''){
                MsgAlert({ content :'请输入您的退回意见',  type:'error' });
                return;
            }
            var dore = $("input[name='rdo_return']:checked").val();
            if($.trim(dore) == ''){
                MsgAlert({ content :'请选择退回项',  type:'error' });
                return;
            }
            var $form = $("#mform");
            var data = $form.serializeObject();
            data = $.extend({}, data, {
                FunctionCode: 'WS_FLOW_TURNBACK', reSelect: dore,
                taskId: param.TASK_ID, procDefId : param.PROC_DEF_ID, notes: notes
            });
            if(!PAGE_EVENTS.beforeTurnBack(data)){
                return;
            }
            MaskUtil.mask("请求处理中...");
            InitFuncCodeRequest_({
                data: data,
                successCallBack: function (jdata) {
                    MaskUtil.unmask();
                    PAGE_EVENTS.afterTurnBack(jdata);
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        if(typeof(param.OWindow.reload_ == 'function')) {
                            param.OWindow.reload_();
                        }
                        param.OWindow.MsgAlert({ content : jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.COMMON.OPT_SUCCESS')  });
                        CloseWindowIframe();
                    } else {
                        MsgAlert({ content: jdata.msg, type: 'error'});
                    }
                }
            });
        }
    });
}

/**
 * @Deprecated
 */
function doReturnToStart(){
    $.messager.confirm('提示', '您确定要退回到开始节点吗?', function(r){
        if (r){
            MaskUtil.mask("请求处理中...");
            InitFuncCodeRequest_({
                data: {FunctionCode: "WS_FLOW_TURNBACK_TOSTART" , procInstId: param.PROC_INST_ID, taskId: param.TASK_ID },
                successCallBack: function (jdata) {
                    MaskUtil.unmask();
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        param.OWindow.reload_();
                        param.OWindow.MsgAlert({ content : jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.COMMON.OPT_SUCCESS')  });
                        CloseWindowIframe();
                    } else {
                        MsgAlert({ content: jdata.msg, type: 'error'});
                    }
                }
            });
        }
    });
}

function doTurnTo(){
    ShowWindowIframe({
        width: '80%', height: '80%',
        title: "转办-选择办理人",
        param: {PROC_DEF_ID: param.PROC_DEF_ID, TASK_ID: param.TASK_ID },
        url: "/views/ws/work_flow/mytodotask/turn_to_sysuser_list.shtml"
    });
}
var TASK_STATE_MAP = {
    "N":"未执行","F":"已完成","T":"已终止",
    "R":"已退回","J":"已跳转","H":"已转办"
};

function InitHistoryDG(){
    var identity = 'historyDg';
    $("#historyDg").MyDataGrid({
        identity: identity,
        title: '历史任务信息',
        columns: {
            param: { FunctionCode: 'WS_FLOW_HIS_TASK_LIST' },
            alter: {
                DURATION : {formatter: function(value,row,index){
                    return toMsTimeString(row.DURATION || row.DURATION_0);
                }},
                ACT_STATE: {formatter: function(value,row,index){
                    var v = []; //[TASK_STATE_MAP[row.ACT_STATE]];
                    if(row.RECORD_STATE && row.RECORD_STATE != 'N' && row.RECORD_STATE!='F'){
                        v.push(TASK_STATE_MAP[row.RECORD_STATE])
                    }
                    return v.join(",")
                }},
            }
        },
        queryParams:{procInstId: param.PROC_INST_ID },
        onLoadSuccess : function(data){
        },
        contextMenus:[],
        toolbar: [
            {key:"COMMON_RELOAD",text: $.i18n.t('common:COMMON_OPERATION.RELOAD'),
                handler: function () {
                    common_reload_({identity:identity });
                }
            }
        ],
        resize: function(){
            return { width: '100%',  height: '100%'}
        }
    });
}

/**
 * 组装选项数据
 * @param vars
 * @returns {{}}
 */
function arrangeVariables(vars){
    var m = {};
    $.each(vars, function(k, v){
        if(v.varOption != 'Hidden'){
            var lst = m[v['varKey']] || [];
            lst.push(v);
            m[v['varKey']] = lst;
        }
    });
    return m;
}

function checkOptions(vars, optKey){
    var bool = false;
    $.each(vars, function(k, v){
        if(optKey == k){
            bool = true;
            return false;
        }
    });
    return bool;
}

function alertParent(opt){
    param.OWindow.MsgAlert(opt);
}

function reloadParentDG(){
    if(typeof(param.OWindow.reload_ == 'function')) {
        param.OWindow.reload_();
    }
}