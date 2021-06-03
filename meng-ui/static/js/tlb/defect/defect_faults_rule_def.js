
var api = frameElement.api, W = api.opener;

$(function(){
    let data = api.data;
    let rules =data.rules;
    let defectType = data.defectType;
    let defectTitle = defectType;
    //let defectTitle = defectType.toLowerCase();
    //defectTitle = defectTitle.slice(0,1).toUpperCase()+defectTitle.slice(1);

    //console.log($("input[name='_numbers']").value);
    //console.log($(".numbers").val());
    $("#faultType").val(defectType);

    if($("#faultType").attr('preValue') =='viewlogs'){
        $("#defectHeader").text(defectTitle +" Fault Rules Logs");
    }else{
        $("#defectHeader").text(defectTitle +" Fault Rules Definition");

        api.button({
            name : "Save",
            id : "save",
            callback : function(){
                if(!$("#approval_form").valid()){
                    return false;
                }
                W.$.dialog.confirm("Are you sure to Save ?", function(){
                    save();
                });
                return false;
            }
        });
    }


    createTableHeader(defectType);

    $.each(rules,function (i,v) {
        //console.log(v.numbers);
        //$(".numbers").textbox('setValue',v.numbers);
        //$(".numbers").value=v.numbers;
        //$('.numbers').val(v.numbers);
        //$('.days').val(v.days);
        createRowData(i+1,v.model,v.numbers,v.days,v.creatorName,v.creatTime,v.remark);

    });

    api.button(
        {
            name : "Close"
        });
});

//拼接静态页面代码：TR内容
function createRowData(td_idx,td_id,td_numbers,td_days,td_creator,td_date,td_remark) {
    //对时间戳格式处理,需要加载新的js
    let create_day= new Date(td_date).format('yyyy-MM-dd');

    // if (td_id != "" && td_id != null){
    //     td_id = td_id;
    // }else{
    //     td_id='';
    // }

    //字符串接接
    let td_view ="<td><a id='' href='javascript:void(0)' class='ui-icon ui-icon-search' title='View' onclick='viewLogs(this)'></a></td>";

    let td_viewid ="<td><a id="+ td_id +
        " href='javascript:void(0)' class='ui-icon ui-icon-search' title='View' onclick='viewLogs(this)'></a></td>";

    let td_viewlog ="<td>" + td_idx + "</td>";

    let td_model="<td><span class='model'>"+ td_id +"</span></td>";

    let td_data= "<td><span>"+
        "<input style='width:60px' class='required digits numbers' name='_numbers'"+
        "min='1' value="+ td_numbers +" preValue="+ td_numbers +" />"+
        "<div id='errorNumberMsg' class='errorMessage'></div>"+
        "</span></td>"+
        "<td><span>"+
        "<input style='width:60px' class='required digits days' name='_days'"+
        "min='1' value="+ td_days +" preValue="+ td_days +" />"+
        "<div id='errorDaysMsg' class='errorMessage'></div>"+
        "</span></td>"+
        "<td><span>"+ td_creator +"</span></td>"+
        "<td><span>"+ create_day +"</span></td>"+
        "<td><span><textarea rows='2' cols='1' class='remark' >"+ td_remark +
        "</textarea></span></td>";

    let td_data_log= "<td><span>"+ td_numbers +"</span></td>"+
        "<td><span>"+td_days+ "</span></td>"+
        "<td><span>"+ td_creator +"</span></td>"+
        "<td><span>"+ create_day +"</span></td>"+
        "<td rows='2' cols='1' ><span>"+ td_remark +"</span></td>";

    let td_html = "";

    if (td_id != "" && td_id != null){
        //MULTIPLE类型
        if($("#faultType").attr('preValue') =='viewlogs'){
            td_html= td_viewlog + td_model + td_data_log;
        }else{
            td_html= td_viewid + td_model + td_data ;
        }
    }else{
        //REPEAT类型
        if($("#faultType").attr('preValue') =='viewlogs'){
            td_html= td_viewlog + td_data_log;
        }else{
            td_html= td_view + td_data;
        }
    }

    td_html="<tr class='ruleTr'>" +td_html + "</tr>";

    $('.post_table').append(td_html);
}

//接接静态页面的代码：TH部分
function createTableHeader(defectType){

    let th_log ="<td class='td-line-hight-background' width='30px'>Log</td>";
    let th_logid ="<td class='td-line-hight-background' width='30px'>ID</td>";

    let th_model ="<td class='td-line-hight-background' width='45px'>Model</td>";
    let th_data="<td class='td-line-hight-background' width='77px'>Defect Nums<span class='td-font-red'>*</span></td>" +
        "<td class='td-line-hight-background' width='71px'>Day Nums<span class='td-font-red'>*</span></td>" +
        "<td class='td-line-hight-background' width='69px'>Creator</td>" +
        "<td class='td-line-hight-background' width='87px'>Create Date</td>" +
        "<td class='td-line-hight-background' width='202px'>Remark</td>";
    let th_all ="";

    if (defectType == 'REPEAT'){
        if($("#faultType").attr('preValue') =='viewlogs'){
            th_all="<tr>"+ th_logid + th_data +"</tr>";
        }else{
            th_all="<tr>"+ th_log + th_data +"</tr>";
        }
    }else{
        if($("#faultType").attr('preValue') =='viewlogs'){
            th_all="<tr>"+ th_logid + th_model + th_data +"</tr>";
        }else {
            th_all="<tr>"+ th_log + th_model + th_data +"</tr>";
        }

    }

    $(".post_table").append(th_all);
}

//这个保存时才用到的方法
function save(){
    disableButton(api, 'save');

    var changeRules = getChangedRules();
    if(!validateChangeRules(changeRules)){
        return false;
    }

    var param = buildSaveParam(changeRules);
    $.ajax({
        url : basePath+"/api/v1/defect/def",
        type : 'post',
        cache: false,
        dataType: "json",
        //contentType: "multipart/form-data",
        contentType: "application/json",
        //contentType: "application/x-www-form-urlencoded;charset=UTF-8",
        data: JSON.stringify(param),    //数组对象
        //data: JSON.stringify(param),//JSON字符串对象
        success : function(data) {
            //data = JSON.parse(data);
            if(data.code == '200'){
                W.$.dialog.alert('Success!');
                enableButton(api, 'save')
                api.close();
            }else{
                if (data.message != null && data.message != "") {
                    W.$.dialog.alert(data.message);
                }
                enableButton(api, 'save');
            }
        }
    });
}

function getChangedRules(){
    var $rules = $(".ruleTr");
    var changeRules = [];
    $.each($rules, function(idx, rule){
        var result = ruleIsChanged($(rule));
        if(result){
            changeRules.push(result);
        }
    });
    return changeRules;
}

function validateChangeRules(changeRules){
    if(changeRules.length == 0){
        W.$.dialog.alert("请至少修改一条记录后再保存.");
        enableButton(api, 'save');
        return false;
    }
    return true;
}

function buildSaveParam(changeRules){
    var param = {};
    var faultType = $("#faultType").val();
    let arr=[];
    $.each(changeRules, function(idx, changeRule){

        let item={};

        item.type = faultType;
        item.model = changeRule.model;
        item.numbers = changeRule.numbers;
        item.days = changeRule.days;
        item.remark = changeRule.remark;

        //let arr=[];
        arr.push(item);
        //param.defectRMFaultDefitionList=arr;

        // param["rmFaultRules[" + idx + "].type"] = faultType;
        // param["rmFaultRules[" + idx + "].model"] = changeRule.model;
        // param["rmFaultRules[" + idx + "].numbers"] = changeRule.numbers;
        // param["rmFaultRules[" + idx + "].days"] = changeRule.days;
        // param["rmFaultRules[" + idx + "].remark"] = changeRule.remark;

        // param["type"] = faultType;
        // param["model"] = changeRule.model;
        // param["numbers"] = changeRule.numbers;
        // param["days"] = changeRule.days;
        // param["remark"] = changeRule.remark;
    });
    param.defectRMFaultDefitionList=arr;
    return param;
}

function ruleIsChanged($rule){

    var model = $.trim($rule.find('.model').text());
    var curNumber = $rule.find('.numbers').val();
    var preNumber = $rule.find('.numbers').attr('preValue');
    var curDay = $rule.find('.days').val();
    var preDay = $rule.find('.days').attr('preValue');
    var remark = $rule.find('.remark').val();

    if(curNumber == preNumber &&　curDay == preDay){
        return false;
    }
    var rule = {};
    rule.model = model;
    rule.numbers = curNumber;
    rule.days = curDay;
    rule.remark = remark;
    return rule;
}

/**
 * 查看所有规则修改Log，估计是历史记录
 */
function viewLogs(_this){
    var model = $(_this).attr("id");
    let defectType = $("#faultType").val();
    $.ajax({
        //url: basePath + "/api/v1/defect/def/getLogs/"+ defectType,
        url: basePath + "/api/v1/defect/def/getLogs",
        type: 'get',
        cache: false,
        dataType: "json",
        data:{
            model:model,
            type:defectType
        },
        success: function (rs) {
            if(rs.code == 200) {

                //let ruleList = rs.data.rmFaultRules;
                let ruleList = rs.data.pageModel;

                W.$.dialog({
                    id: "View fault rule logs",
                    title: "View Fault Rule Logs",
                    top: '50%',
                    width: '600px',
                    height: '300px',
                    data: {
                        'rules': ruleList,
                        'defectType': defectType
                    },
                    content: 'url:' + basePath + "/views/defect/multiple_faults/defect_faults_rule_def_log.shtml"
                });
            } else {
                W.$.dialog.alert(rs.data.ajaxResult);
            }
        }
    });

    // W.$.dialog({
    //     id : "view def log" + model,
    //     title : "View Log",
    //     top : "50%",
    //     left : "60%",
    //     width : "600px",
    //     height : "300px",
    //     content : "url:" + basePath + "api/v1/defect/def/getLogs",
    //     method : "post",
    //     postData : {
    //         "def.model" : model,
    //         "def.type" : $("#faultType").val()
    //     }
    // });
}

//按纽暂时失效
function disableButton(api, buttonId){
    api.button({
        id : buttonId,
        disabled : true
    });
}

function enableButton(api, buttonId){
    api.button({
        id : buttonId,
        disabled : false
    });
}