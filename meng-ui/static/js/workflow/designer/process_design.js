/**
 * Created by tpeng on 2016/8/17.
 */

var CODE_NOT_LOGIN = 100;

jq.fn.extend({
    /**
     * Form 表单序列化为JSON对象
     * 使用方法：$('#ffSearch').serializeObject()
     * @returns {{}}
     */
    serializeObject: function () {
        var o = {};
        var a = this.serializeArray();
        jq.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        var $radio = jq('input[type=radio],input[type=checkbox]', this);
        jq.each($radio, function () {
            if (!o.hasOwnProperty(this.name)) {
                o[this.name] = '';
            }
        });
        return o;
    }
});

function getProData(pdg){
    var data_ = {};
    var data = pdg.propertygrid('getData')
    jq.each(data.rows, function(k,v){
        var eds = pdg.propertygrid('getEditors', k);
        var jQed = jq(eds[0].target);
        var type = typeof(v.editor) == 'string' ? v.editor : v.editor.type;
        if(type == 'text'){
            v.value = jQed.val();
        }else if(type == 'textbox'){
            v.value = jQed.textbox('getValue');
        }else if(type == 'checkbox'){
            v.value = jQed.is(":checked") ? jQed.val() : jQed.attr("offval");
        }else if(type == 'numberbox'){
            v.value = jQed.numberbox('getValue');
        }else if(type == 'datebox'){
            v.value = jQed.datebox('getValue');
        }else if(type == 'combobox'){
            v.value = jQed.combobox('getValue');
        }else if(type == 'combotree'){
            v.value = jQed.combotree('getValue');
        }else if(type == 'textarea'){
            v.value = jQed.val();
        }
        data_[v.field] = v.value;
    });
    return data_;
}

function ArrayCollect_(arry, key){
    if(!arry || arry.length <= 0)
        return "";
    var c = [];
    jq.each(arry, function(k,v){
        c.push(v[key]);
    });
    return c.join(",");
}

function getParentParam_(pkey){
    if(SHOW_WINDOW_TYPE == '1'){
        return getParentParam1_(pkey);
    }else if(SHOW_WINDOW_TYPE == '2'){
        return getParentParam2_(pkey);
    }
}

function getParentParam1_(pkey){
    /*    var PWindow = window['PWindow'] || window.top;
     return PWindow[pkey] || {};*/
    pkey = pkey ? pkey : "K" + window.name;
    if (window.opener != null && !window.opener.closed) {
        return window.opener['WindowParam'][pkey];
    }
    return {};
}

function getParentParam2_(pkey) {
    pkey = pkey ? pkey : "K" + window.name;
    return parent.document[pkey];
}

function CloseWindowIframe() {
    if(SHOW_WINDOW_TYPE == '1'){
        CloseWindowIframe1();
    }else if(SHOW_WINDOW_TYPE == '2'){
        CloseWindowIframe2();
    }
}

function findSWindows(swindow){
    var wins = []; var SWindow;
    jq.each(swindow['WindowParam'], function(k,p){
        if(p.SWindow){
            wins.push(p.SWindow);
            wins = wins.concat(findSWindows(p.SWindow));
        }
    });
    return wins;
}

function CloseWindowIframe1() {
    var wins = findSWindows(window);
    for(var i = wins.length - 1; i > -1; i--){
        wins[i].close();
    }
}

function CloseWindowIframe2() {
    var opts = getParentParam_();
    opts.PWindow.jQuery("#" + opts.WIN_KEY).window('destroy');
}

function setWinTitle(title) {
    if(SHOW_WINDOW_TYPE == '1'){
        setWinTitle1(title);
    }else if(SHOW_WINDOW_TYPE == '2'){
        setWinTitle2(title);
    }
}

function setWinTitle1(title){
    jq(window.document).attr('title', title);
}

function setWinTitle2(title){
    var opts = getParentParam2_();
    opts.PWindow.jQuery("#" + opts.WIN_KEY).window('setTitle',title)
}

function MsgLoading(msg){
    var load = parent.layer.msg(msg || '处理中...', {time: 0, shade: [0.3, '#393D49'], icon: 16});
    return load;
}

function MsgLoadingClose(index){
    parent.layer.close(index);
}

function evalJsonStr(jsonStr, defReturn){
    if(jsonStr){
        eval('var d = ' + jsonStr +';');
        return d;
    }
    return defReturn;
}

function parseProcessDescriptor(data){
    var regs = [
        /\<\!\[CDATA\[(((?!]]>)[\s\S])*)\]\]\>/g, /<\!\-\-\[CDATA\[(((?!]]-->)[\s\S])*)\]\]\-\-\>/g
    ]
    for(var i=0;i<regs.length;i++){
        var reg = regs[i];
        var arr;
        while((arr = reg.exec(data)) !=null){
            if(arr && arr.length >=2){
                data = data.replace(arr[0],arr[1]);
            }
        }
    }

        var descriptor = jq(data);
    var definitions = descriptor.find('definitions');
    var process = descriptor.find('process');
    var startEvent = descriptor.find('startEvent');
    var endEvent = descriptor.find('endEvent');
    var userTasks = descriptor.find('userTask');
    var exclusiveGateway = descriptor.find('exclusiveGateway');
    var parallelGateway = descriptor.find('parallelGateway');
    var lines = descriptor.find('sequenceFlow');
    var shapes = descriptor.find('bpmndi\\:BPMNShape');
    var edges = descriptor.find('bpmndi\\:BPMNEdge');

    workflow.process.category=definitions.attr('targetNamespace');
    workflow.process.id=process.attr('id');
    workflow.process.name=process.attr('name');
    var documentation = trim(descriptor.find('process > documentation').text());
    if(documentation != null && documentation != "")
        workflow.process.documentation=documentation;
    var extentsion = descriptor.find('process > extensionElements');
    if(extentsion != null){
        var listeners = extentsion.find('activiti\\:executionListener');
        var taskListeners = extentsion.find('activiti\\:taskListener');
        workflow.process.setListeners(parseListeners(listeners,"draw2d.Process.Listener","draw2d.Process.Listener.Field"));
    }
    jq.each(processDefinitionVariables,function(i,n){
        var variable = new draw2d.Process.variable();
        variable.name=n.name;
        variable.type=n.type;
        variable.scope=n.scope;
        variable.defaultValue=n.defaultValue;
        variable.remark=n.remark;
        workflow.process.addVariable(variable);
    });
    startEvent.each(function(i){
        var start = new draw2d.Start("/js/workflow/designer/icons/type.startevent.none.png");
        start.id=jq(this).attr('id');
        start.eventId=jq(this).attr('id');
        start.eventName=jq(this).attr('name');
        shapes.each(function(i){
            var id = jq(this).attr('bpmnElement');
            if(id==start.id){
                var x=parseInt(jq(this).find('omgdc\\:Bounds').attr('x'));
                var y=parseInt(jq(this).find('omgdc\\:Bounds').attr('y'));
                workflow.addFigure(start,x,y);
                return false;
            }
        });
    });
    endEvent.each(function(i){
        var end = new draw2d.End("/js/workflow/designer/icons/type.endevent.none.png");
        end.id=jq(this).attr('id');
        end.eventId=jq(this).attr('id');
        end.eventName=jq(this).attr('name');
        shapes.each(function(i){
            var id = jq(this).attr('bpmnElement');
            if(id==end.id){
                var x=parseInt(jq(this).find('omgdc\\:Bounds').attr('x'));
                var y=parseInt(jq(this).find('omgdc\\:Bounds').attr('y'));
                workflow.addFigure(end,x,y);
                return false;
            }
        });
    });

    userTasks.each(function(i){
        var task = new draw2d.UserTask(openTaskProperties);
        var tid = jq(this).attr('id');
        task.id=tid;
        var tname = jq(this).attr('name');
        var assignee=jq(this).attr('activiti:assignee');
        var candidataUsers=jq(this).attr('activiti:candidateUsers');
        var candidataGroups=jq(this).attr('activiti:candidateGroups');
        var formKey=jq(this).attr('activiti:formKey');
        if(assignee!=null&&assignee!=""){
            task.isUseExpression=true;
            task.performerType="assignee";
            task.expression=assignee;
        }else if(candidataUsers!=null&&candidataUsers!=""){
            task.isUseExpression=true;
            task.performerType="candidateUsers";
            task.expression=candidataUsers;
        }else if(candidataGroups!=null&&candidataGroups!=""){
            task.isUseExpression=true;
            task.performerType="candidateGroups";
            task.expression=candidataGroups;
        }
        if(formKey!=null&&formKey!=""){
            task.formKey=formKey;
        }
        var documentation = trim(jq(this).find('documentation').text());
        if(documentation != null && documentation != "")
            task.documentation=documentation;
        task.taskId=tid;
        task.taskName=tname;
        if(tid!= tname)
            task.setContent(tname);
        var listeners = jq(this).find('extensionElements').find('activiti\\:taskListener');draw2d.UserTask.TaskListener
        var taskListeners = parseListeners(listeners,"draw2d.UserTask.TaskListener","draw2d.Task.Listener.Field");
        task.setTaskListeners(taskListeners);
        var performersExpression = jq(this).find('potentialOwner').find('resourceAssignmentExpression').find('formalExpression').text();
        if(performersExpression.indexOf('user(')!=-1){
            task.performerType="candidateUsers";
        }else if(performersExpression.indexOf('group(')!=-1){
            task.performerType="candidateGroups";
        }
        var performers = performersExpression.split(',');
        jq.each(performers,function(i,n){
            var start = 0;
            var end = n.lastIndexOf(')');
            if(n.indexOf('user(')!=-1){
                start = 'user('.length;
                var performer = n.substring(start,end);
                task.addCandidateUser({
                    sso:performer
                });
            }else if(n.indexOf('group(')!=-1){
                start = 'group('.length;
                var performer = n.substring(start,end);
                task.addCandidateGroup(performer);
            }
        });
        //add会签属性
        var multiInstanceLoopCharacteristics = jq(this).find('multiInstanceLoopCharacteristics');
        if(multiInstanceLoopCharacteristics){
            var isSequential =  multiInstanceLoopCharacteristics.attr('isSequential');
            if(isSequential == 'true'){
                task.isSequential = 'true';
            }else if(isSequential == 'false'){
                task.isSequential = 'false';
            }else{
                task.isSequential = '';
            }
            task.setIcon();
        }


        shapes.each(function(i){
            var id = jq(this).attr('bpmnElement');
            if(id==task.id){
                var x=parseInt(jq(this).find('omgdc\\:Bounds').attr('x'));
                var y=parseInt(jq(this).find('omgdc\\:Bounds').attr('y'));
                workflow.addModel(task,x,y);
                return false;
            }
        });
    });
    exclusiveGateway.each(function(i){
        var gateway = new draw2d.ExclusiveGateway("/js/workflow/designer/icons/type.gateway.exclusive.png");
        var gtwid = jq(this).attr('id');
        var gtwname = jq(this).attr('name');
        gateway.id=gtwid;
        gateway.gatewayId=gtwid;
        gateway.gatewayName=gtwname;
        shapes.each(function(i){
            var id = jq(this).attr('bpmnElement');
            if(id==gateway.id){
                var x=parseInt(jq(this).find('omgdc\\:Bounds').attr('x'));
                var y=parseInt(jq(this).find('omgdc\\:Bounds').attr('y'));
                workflow.addModel(gateway,x,y);
                return false;
            }
        });
    });
    parallelGateway.each(function(i){
        var gateway = new draw2d.ExclusiveGateway("/js/workflow/designer/icons/type.gateway.parallel.png");
        var gtwid = jq(this).attr('id');
        var gtwname = jq(this).attr('name');
        gateway.id=gtwid;
        gateway.gatewayId=gtwid;
        gateway.gatewayName=gtwname;
        shapes.each(function(i){
            var id = jq(this).attr('bpmnElement');
            if(id==gateway.id){
                var x=parseInt(jq(this).find('omgdc\\:Bounds').attr('x'));
                var y=parseInt(jq(this).find('omgdc\\:Bounds').attr('y'));
                workflow.addModel(gateway,x,y);
                return false;
            }
        });
    });
    lines.each(function(i){
        var lid = jq(this).attr('id');
        var name = jq(this).attr('name');
        var jqcond = jq(this).find('conditionExpression');
        var cond = '';
        if(jqcond.length != 0){
            cond = jqcond.text();
        }
        var condition =  jq.trim(cond);
        //var condition=jq(this).find('conditionExpression').text();
        var sourceRef = jq(this).attr('sourceRef');
        var targetRef = jq(this).attr('targetRef');
        var source = workflow.getFigure(sourceRef);
        var target = workflow.getFigure(targetRef);
        edges.each(function(i){
            var eid = jq(this).attr('bpmnElement');
            if(eid==lid){
                var startPort = null;
                var endPort = null;
                var points = jq(this).find('omgdi\\:waypoint');
                var startX = jq(points[0]).attr('x');
                var startY = jq(points[0]).attr('y');
                var endX = jq(points[points.length - 1]).attr('x');
                var endY = jq(points[points.length - 1]).attr('y');
                var sports = source.getPorts();
                for(var i=0;i<sports.getSize();i++){
                    var s = sports.get(i);
                    var x = s.getAbsoluteX();
                    var y = s.getAbsoluteY();
                    if(x == startX&&y==startY){
                        startPort = s;
                        break;
                    }
                }
                var tports = target.getPorts();
                for(var i=0;i<tports.getSize();i++){
                    var t = tports.get(i);
                    var x = t.getAbsoluteX();
                    var y = t.getAbsoluteY();
                    if(x==endX&&y==endY){
                        endPort = t;
                        break;
                    }
                }
                if(startPort != null&&endPort!=null){
                    var cmd=new draw2d.CommandConnect(workflow,startPort,endPort);
                    var connection = new draw2d.DecoratedConnection();
                    connection.id=lid;
                    connection.lineId=lid;
                    connection.lineName=name;
                    if(lid!=name)
                        connection.setLabel(name);
                    if(condition != null && condition!=""){
                        connection.condition=condition;
                    }
                    cmd.setConnection(connection);
                    workflow.getCommandStack().execute(cmd);
                }
                return false;
            }
        });
    });
    if(typeof setHightlight != "undefined"){
        setHightlight();
    }
}
function parseListeners(listeners,listenerType,fieldType){
    var parsedListeners = new draw2d.ArrayList();
    listeners.each(function(i){
        var listener = eval("new "+listenerType+"()");

        listener.event=jq(this).attr('event');
        var expression = jq(this).attr('expression');
        var clazz = jq(this).attr('class');
        if(expression != null && expression!=""){
            listener.serviceType='expression';
            listener.serviceExpression=expression;
        }else if(clazz != null&& clazz!=""){
            listener.serviceType='javaClass';
            listener.serviceClass=clazz;
        }
        var fields = jq(this).find('activiti\\:field');
        fields.each(function(i){
            var field = eval("new "+fieldType+"()");
            field.name=jq(this).attr('name');
            //alert(field.name);
            var string = jq(this).find('activiti\\:string').text();
            var expression = jq(this).find('activiti\\:expression').text();
            //alert("String="+string.text()+"|"+"expression="+expression.text());
            if(string != null && string != ""){
                field.type='string';
                field.value=string;
            }else if(expression != null && expression!= ""){
                field.type='expression';
                field.value=expression;
            }
            listener.setField(field);
        });
        parsedListeners.add(listener);
    });
    return parsedListeners;
}

function addModel(name,x,y,icon){
    var model = null;
    if(icon!=null&&icon!=undefined){
        model = eval("new draw2d."+name+"('"+icon+"')");
    }else{
        model = eval("new draw2d."+name+"(openTaskProperties)");
    }
    /*if(name == 'UserTask'){
        var listener = new draw2d.UserTask.TaskListener();
        listener.event = 'create';
        listener.serviceType = 'javaClass';
        listener.serviceClass = 'com.bireturn.amro.workflow.listener.TaskCreateListener';
        model.taskListeners.add(listener);
    }*/
    //userTask.setContent("DM Approve");
    model.generateId();
    //var id= task.getId();
    //task.id=id;
    //task.setId(id);
    //task.taskId=id;
    //task.taskName=id;
    //var parent = workflow.getBestCompartmentFigure(x,y);
    //workflow.getCommandStack().execute(new draw2d.CommandAdd(workflow,task,x,y,parent));
    workflow.addModel(model,x,y);
}
function openTaskProperties(t){
    if(!is_open_properties_panel)
        _designer.layout('expand','east');
    task=t;
    if(task.type=="draw2d.UserTask")
        _properties_panel_obj.panel('refresh','userTaskProperties.html');
    else if(task.type=="draw2d.ManualTask")
        _properties_panel_obj.panel('refresh','manualTaskProperties.html');
    else if(task.type=="draw2d.ServiceTask")
        _properties_panel_obj.panel('refresh','serviceTaskProperties.html');
    else if(task.type=="draw2d.ScriptTask")
        _properties_panel_obj.panel('refresh','scriptTaskProperties.html');
    else if(task.type=="draw2d.ReceiveTask")
        _properties_panel_obj.panel('refresh','receiveTaskProperties.html');
    else if(task.type=="draw2d.MailTask")
        _properties_panel_obj.panel('refresh','mailTaskProperties.html');
    else if(task.type=="draw2d.BusinessRuleTask")
        _properties_panel_obj.panel('refresh','businessRuleTaskProperties.html');
    else if(task.type=="draw2d.CallActivity")
        _properties_panel_obj.panel('refresh','callActivityProperties.html');
}
function openProcessProperties(id){
    //alert(id);
    if(!is_open_properties_panel)
        _designer.layout('expand','east');
    _properties_panel_obj.panel('refresh','processProperties.html');
}
function openFlowProperties(l){
    //alert(id);
    if(!is_open_properties_panel)
        _designer.layout('expand','east');
    line=l;
    _properties_panel_obj.panel('refresh','flowProperties.html');
}
function deleteModel(id){
    var task = workflow.getFigure(id);
    workflow.removeFigure(task);
}
function redo(){
    workflow.getCommandStack().redo();
}
function undo(){
    workflow.getCommandStack().undo();
}

function ShowWindowIframe(opts){
    if(opts && opts.url){
        opts.url = opts.url.trim();
    }
    if(SHOW_WINDOW_TYPE == '1'){
        ShowWindowIframe1(opts);
    }else if(SHOW_WINDOW_TYPE == '2'){
        ShowWindowIframe2(opts);
    }
}

function ShowWindowIframe1(opts){
    var time_ = new Date().getTime();
    var url_ = "";
    var i = opts.url.indexOf("?");
    if (i > -1) {
        url_ = opts.url + (i == opts.url.length - 1 ? "" : "&") + "_v_" + time_
    } else {
        url_ = opts.url + "?_v_" + time_
    }
    opts = jq.extend({}, {url: url_}, opts);
    var win_key_ = 'win_0_' + time_;
    var GParam = getParentParam1_();
    var PWindow = GParam['PWindow'] || window.top;
    var OWindow = window;
    opts.param = opts.param || {};

    var w_ = jq(PWindow.document).width() - 20;
    var h_ = jq(PWindow.document).height();
    opts.width = typeof(opts.width) == 'string' && opts.width.indexOf('px') > -1 ? parseInt(opts.width.replace('px')) : opts.width;
    opts.height = typeof(opts.height) == 'string' && opts.height.indexOf('px') > -1 ? parseInt(opts.height.replace('px')) : opts.height;
    var width_ = typeof(opts.width) == 'string' && opts.width.indexOf('%') > -1 ? w_ * (parseInt(opts.width.replace('%'))/100)  : opts.width;
    var height_ = typeof(opts.height) == 'string' && opts.height.indexOf('%') > -1 ? h_ * (parseInt(opts.height.replace('%'))/100) : opts.height;
    var l_ = (w_ - width_) / 2; var t_ = (h_ - height_) / 2;
    var SWindow = window.open(opts.url,win_key_,'toolbar=no,scrollbars=yes,location=yes,status=no,menubar=no,directories=no,resizable=yes,height='+ height_+',width='+ width_+',left='+l_+',top='+t_);
    opts.param = jq.extend({}, { OWindow: OWindow, PWindow: PWindow, SWindow : SWindow, WIN_KEY: win_key_ }, opts.param);
    window['WindowParam'] = window['WindowParam'] || {};
    window['WindowParam']['K'+win_key_] = opts.param;

    window.onunload = function(){
        CloseWindowIframe();
    };

    var wkey = jq("iframe[name='"+OWindow.name+"']",PWindow.document).data('id');
    var warry = PWindow.P_WINDOWS[wkey]||[];
    warry.push({ WINDOW: SWindow });
    PWindow.P_WINDOWS[wkey] = warry;
    setTimeout(function(){ try{jq(SWindow.document).attr('title', opts.title);}catch(e){} },200);
}

function ShowWindowIframe2(opts) {
    var time_ = new Date().getTime();
    var url_ = "";
    var i = opts.url.indexOf("?");
    if (i > -1) {
        url_ = opts.url + (i == opts.url.length - 1 ? "" : "&") + "_v_" + time_
    } else {
        url_ = opts.url + "?_v_" + time_
    }
    opts = jq.extend({}, {url: url_}, opts);
    var win_key_ = 'win_0_' + time_;
    opts.param = opts.param || {};
    opts.param = jq.extend({}, {OWindow: window, PWindow: parent, WIN_KEY: win_key_}, opts.param);
    var pkey = opts.param['P_'] ? opts.param['P_'] : "K" + win_key_;
    opts.param.PWindow.document[pkey] = opts.param;
    var jqWindow = opts.param.PWindow.jq("<div id='" + win_key_ + "' class='_iwin' />");
    window.top.EY_WINDOWS[win_key_] = jqWindow;
    jqWindow.window({
        width: opts.width,
        height: opts.height,
        minimizable: opts.minimizable ? opts.minimizable : true,
        maximizable: opts.maximizable ? opts.maximizable : true, draggable: true,
        onMove: function (left, top) { // popwindow拖动时触发，限制弹出框拖动范围
            if(left<0){
                jqWindow.window("resize",{left:0});
            }
            if(top<0){
                jqWindow.window("resize",{top:0});
            }
        },
        onMinimize: function () {
            //最下化移动到任务栏
            window.top.addTag(opts.title, {
                key : win_key_,
                attrs:{win_key_: win_key_},
                tagClick : function(target){
                    var state = jqWindow.data("state");
                    if(state == 'open'){
                        jqWindow.data('state', 'minimize');
                        jqWindow.window('minimize');
                    }else{
                        jqWindow.data('state', 'open');
                        jqWindow.window('open');
                    }

                },
                tagRemove: function(target){
                    jqWindow.window('close');
                }
            });
            jqWindow.data('state', 'minimize');
        },
        modal: opts.modal ? opts.modal : false,
        title: opts.title,
        content: '<iframe name="' + win_key_ + '" style="width:100%;height:98%;border:0;" '
        + 'frameborder="0" src="' + opts.url + '"></iframe>',
        onClose: function () {
            window.top.jq("span.tag[key_='"+win_key_+"']").remove();
            window.top.EY_WINDOWS[win_key_] = null;
            opts.param.PWindow.jq("#" + win_key_).window('destroy');
            opts.param.PWindow.document[pkey] = undefined;
            var closeCb = opts.param['CloseCallBack'];
            if (typeof(closeCb) == 'function') {
                closeCb(opts.param);
                return;
            }
            //(opts.param['CloseCallBback']||'WinIframeOnClose');
            /* if(typeof(opts.param.OWindow[closeCb]) == 'function'){
             opts.param.OWindow[closeCb](opts.param);
             return;
             }
             if(typeof(opts.param.PWindow[closeCb]) == 'function'){
             opts.param.PWindow[closeCb](opts.param);
             return;
             }*/
        }
    });
    opts.param.PWindow.jq('#'+win_key_).parent().find('.panel-title').attr('data-i18n', opts.title);
}

function CloseWindowIframe() {
    if(SHOW_WINDOW_TYPE == '1'){
        CloseWindowIframe1(true);
    }else if(SHOW_WINDOW_TYPE == '2'){
        CloseWindowIframe2();
    }
}

function findSWindows(swindow){
    var wins = []; var SWindow;
    jq.each(swindow['WindowParam'], function(k,p){
        if(p.SWindow){
            wins.push(p.SWindow);
            wins = wins.concat(findSWindows(p.SWindow));
        }
    });
    return wins;
}

function CloseWindowIframe1(flag) {
    var wins = findSWindows(window);
    if (flag) {
        wins.unshift(window);
    }
    for(var i = wins.length - 1; i > -1; i--){
        wins[i].close();
    }
}

function CloseWindowIframe2() {
    var opts = getParentParam_();
    opts.PWindow.jq("#" + opts.WIN_KEY).window('destroy');
}

function setWinTitle(title) {
    if(SHOW_WINDOW_TYPE == '1'){
        setWinTitle1(title);
    }else if(SHOW_WINDOW_TYPE == '2'){
        setWinTitle2(title);
    }
}

function setWinTitle1(title){
    jq(window.document).attr('title', title);
}

function setWinTitle2(title){
    var opts = getParentParam2_();
    opts.PWindow.jq("#" + opts.WIN_KEY).window('setTitle',title);
}

function getParentParam_(pkey){
    if(SHOW_WINDOW_TYPE == '1'){
        return getParentParam1_(pkey);
    }else if(SHOW_WINDOW_TYPE == '2'){
        return getParentParam2_(pkey);
    }
}

function getParentParam1_(pkey){
    /*    var PWindow = window['PWindow'] || window.top;
     return PWindow[pkey] || {};*/
    pkey = pkey ? pkey : "K" + window.name;
    if (window.opener != null && !window.opener.closed) {
        return window.opener['WindowParam'][pkey];
    }
    return {};
}

function getParentParam2_(pkey) {
    pkey = pkey ? pkey : "K" + window.name;
    return parent.document[pkey];
}

function Ajax_(opts){
    opts = jq.extend({}, {type: 'post', data: '', dataType: 'json',
        success: function(){},
        error:function(){}
    }, opts);
    var success_ = opts.success;
    opts.success = function(data){
        if(!checkAjaxResult(data)){
            return;
        }
        if(success_){
            success_(data);
        }
    }
    jq.ajax(opts);
}

function checkAjaxResult(data){
    if(data.code == CODE_NOT_LOGIN){ //未登录
        jq.messager.alert("提示", jq.i18n.t('msg_err:ERRMSG.COMMON.NOT_LOGIN'), 'error', function(){
            window.location.href = "http://" + this.location.host + "/casLogin/index.html";
        });
        return false;
    }
    return true;
}

function DGContextMenu(e, opts, rowIndex, rowData){
    jq(opts.thiz).datagrid('selectRow', rowIndex);
    jq("#menu_"+opts.identity).menu("destroy");
    var jqmenu = jq("<div id='menu_"+opts.identity+"'/>").menu();
    var MStock = {};
    var isItem = false;
    jq.each(opts.contextMenus, function(k,idata){
        idata.id = idata.id || 'item'+k;
        var i18nText = idata.text ? idata.text : idata.i18nText;
        jqmenu.menu('appendItem', {
            id : idata.id,
            text: jq.i18n.t(i18nText),
            //iconCls: 'icon-ok',
            onclick: idata.onclick
        });
        isItem = true;
        MStock[i18nText] = { enable: true, display: true};
    });
    if(!isItem)
        return;
    if(opts.validAuth && typeof(opts.validAuth) == 'function') {

        var rowData = {};
        if(opts.treeField){
            rowData = jq(thiz).treegrid('getSelected');
        }else {
            rowData = jq(thiz).datagrid('getSelected');
        }

        opts.validAuth(rowData, MStock);
        jq.each(MStock, function(k, v){
            var item = jqmenu.menu('findItem', jq.i18n.t(k));
            if(item && v.enable == false){
                jqmenu.menu('disableItem', item.target);
            }
            if(item && v.display == false){
                jqmenu.menu('removeItem', item.target);
            }
        });
    }
    jqmenu.menu('show', {
        left: e.pageX,
        top: e.pageY
    });
};

function ParseFormField_(data, jQtarget, transform) {
    if (!data) return;
    if (transform && transform == "CamelCase") {
        data = toCamelCase(data);
    }
    var jQtarget_ = jQtarget ? jQtarget : jQuery(document);
    jQuery.each(data, function (k, v) {
        var jQt = jQtarget_.find("*[textboxname='" + k + "']");
        if (jQt.length <= 0) {
            jQtarget_.find("*[name='" + k + "']").val(v);
        } else {
            if (jQt.hasClass("combobox-f")) {
                jQt.combobox('setValue', v);
            } else if (jQt.hasClass("combotree-f")) {
                jQt.combotree('setValue', v);
            } else if (jQt.hasClass("datebox-f")) {
                jQt.datebox('setValue', v);
            } else if (jQt.hasClass("datetimebox-f")) {
                jQt.datetimebox('setValue', v);
            } else if (jQt.hasClass("numberbox-f")) {
                jQt.numberbox('setValue', v);
            } else if (jQt.hasClass("numberspinner-f")) {
                jQt.numberspinner('setValue', v);
            } else if (jQt.hasClass("switchbutton-f")) {
                v == true ? jQt.switchbutton('check') : jQt.switchbutton('uncheck');
            } else if (jQt.hasClass("slider-f")) {
                jQt.slider('setValue', v);
            } else if (jQt.hasClass("textbox-f")) {
                jQt.textbox('setValue', v);
            }
        }
    });
    return data;
}

/**
 * 扩展datagrid 两个tip方法
 */
jq.extend(jq.fn.datagrid.methods, {
    /**
     * 开打提示功能
     * @param {} jq
     * @param {} params 提示消息框的样式
     * @return {}
     */
    doCellTip: function(jqitem, params){
        function showTip(data, td, e){
            if (jq(td).text() == "")
                return;
            data.tooltip.text(jq(td).text()).css({
                top: (e.pageY + 10) + 'px',
                left: (e.pageX + 20) + 'px',
                'z-index': jq.fn.window.defaults.zIndex,
                display: 'block'
            });
        };
        return jqitem.each(function(){
            var grid = jq(this);
            var options = jq(this).data('datagrid');
            if (!options.tooltip) {
                var panel = grid.datagrid('getPanel').panel('panel');
                var defaultCls = {
                    'border': '1px solid #333',
                    'padding': '2px',
                    'color': '#333',
                    'background': '#f7f5d1',
                    'position': 'absolute',
                    'max-width': '200px',
                    'border-radius' : '4px',
                    '-moz-border-radius' : '4px',
                    '-webkit-border-radius' : '4px',
                    'display': 'none'
                }
                var tooltip = jq("<div id='celltip'></div>").appendTo('body');
                tooltip.css(jq.extend({}, defaultCls, params.cls));
                options.tooltip = tooltip;
                panel.find('.datagrid-header').each(function(){
                    var delegateEle = jq(this).find('> div.datagrid-header-inner').length ? jq(this).find('> div.datagrid-header-inner')[0] : this;
                    jq(delegateEle).undelegate('td', 'mouseover').undelegate('td', 'mouseout').undelegate('td', 'mousemove').delegate('td', {
                        'mouseover': function(e){
                            if (params.delay) {
                                if (options.tipDelayTime)
                                    clearTimeout(options.tipDelayTime);
                                var that = this;
                                options.tipDelayTime = setTimeout(function(){
                                    showTip(options, that, e);
                                }, params.delay);
                            }
                            else {
                                showTip(options, this, e);
                            }

                        },
                        'mouseout': function(e){
                            if (options.tipDelayTime)
                                clearTimeout(options.tipDelayTime);
                            options.tooltip.css({
                                'display': 'none'
                            });
                        },
                        'mousemove': function(e){
                            var that = this;
                            if (options.tipDelayTime)
                                clearTimeout(options.tipDelayTime);
                            //showTip(options, this, e);
                            options.tipDelayTime = setTimeout(function(){
                                showTip(options, that, e);
                            }, params.delay);
                        }
                    });
                });
                panel.find('.datagrid-body').each(function(){
                    var delegateEle = jq(this).find('> div.datagrid-body-inner').length ? jq(this).find('> div.datagrid-body-inner')[0] : this;
                    jq(delegateEle).undelegate('td', 'mouseover').undelegate('td', 'mouseout').undelegate('td', 'mousemove').delegate('td', {
                        'mouseover': function(e){
                            if (params.delay) {
                                if (options.tipDelayTime)
                                    clearTimeout(options.tipDelayTime);
                                var that = this;
                                options.tipDelayTime = setTimeout(function(){
                                    showTip(options, that, e);
                                }, params.delay);
                            }
                            else {
                                showTip(options, this, e);
                            }

                        },
                        'mouseout': function(e){
                            if (options.tipDelayTime)
                                clearTimeout(options.tipDelayTime);
                            options.tooltip.css({
                                'display': 'none'
                            });
                        },
                        'mousemove': function(e){
                            var that = this;
                            if (options.tipDelayTime)
                                clearTimeout(options.tipDelayTime);
                            //showTip(options, this, e);
                            options.tipDelayTime = setTimeout(function(){
                                showTip(options, that, e);
                            }, params.delay);
                        }
                    });
                });

            }

        });
    },
    /**
     * 关闭消息提示功能
     *
     * @param {}
     *            jq
     * @return {}
     */
    cancelCellTip: function(jq){
        return jq.each(function(){
            var data = jq(this).data('datagrid');
            if (data.tooltip) {
                data.tooltip.remove();
                data.tooltip = null;
                var panel = jq(this).datagrid('getPanel').panel('panel');
                panel.find('.datagrid-body').undelegate('td', 'mouseover').undelegate('td', 'mouseout').undelegate('td', 'mousemove')
            }
            if (data.tipDelayTime) {
                clearTimeout(data.tipDelayTime);
                data.tipDelayTime = null;
            }
        });
    }
});
