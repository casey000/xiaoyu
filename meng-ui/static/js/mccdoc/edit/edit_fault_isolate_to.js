//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;

sub_win.button(
    {
        name: 'Submit',
        callback: function () {
            doSubmit();
            return false;
        }
    },
    {
        name: 'Save',
        callback: function () {
            saveForm();
            return false;
        }
    },
    {
        name: 'Cancel'
    }
);


/**
 * 保存
 * @returns {Boolean}
 */
function saveForm() {
    if ($("#add_form .errorMessage").text()) {
        return false;
    }
    if (validForm()) {
        return false;
    }

    var actionUrl = basePath + "/api/v1/mccdoc/to_base_info/update";
    var message = "Success";

    var params = $("#add_form").serialize();
    sub_win.button({name: 'Save', disabled: true});
    sub_win.button({name: 'Submit', disabled: true});
    sub_win.button({name: 'Cancel', disabled: true});
    $.ajax({
        url: actionUrl,
        type: "post",
        data: params,
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.code == 200) {
                P.$.dialog.success(message);
                //这段代码主要是判断父窗口是否是TO List查询页面 是查询页面才刷新父窗口
                if (P.location.pathname.indexOf("to_list") > -1) {
                    P.location.reload();
                }
                sub_win.close();
            } else {
                sub_win.button({name: 'Save', disabled: false});
                sub_win.button({name: 'Submit', disabled: false});
                sub_win.button({name: 'Cancel', disabled: false});
                if (data.msg) {
                    P.$.dialog.alert(data.msg);
                } else {
                    P.$.dialog.alert('Add failed, please contact the administrator.');
                }
            }

        }
    });

    return false;
}

/**
 * 提交
 * @returns {Boolean}
 */
function doSubmit() {
    if ($("#add_form .errorMessage").text()) {
        return false;
    }
    if (validForm()) {
        return false;
    }

    var actionUrl = basePath + "/api/v1/mccdoc/to_base_info/update";

    var params = $("#add_form").serialize();
    sub_win.button({name: 'Save', disabled: true});
    sub_win.button({name: 'Submit', disabled: true});
    sub_win.button({name: 'Cancel', disabled: true});
    $.ajax({
        url: actionUrl,
        type: "post",
        data: params,
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.code == 200) {
                P.$.dialog({
                    title: 'Submit for check',
                    width: '590px',
                    height: '280px',
                    top: '15%',
                    esc: true,
                    cache: false,
                    max: false,
                    min: false,
                    lock: true,
                    parent: this,
                    content: 'url:/views/mccdoc/form/submit_to.shtml',
                    data: {
                        "id": data.data,
                        "type": $("input[name='toBaseInfo.type']").val()
                    },
                    close: function () {
                        //这段代码主要是判断父窗口是否是TO List查询页面 是查询页面才刷新父窗口
                        if (P.location.pathname.indexOf("to_list") > -1) {
                            P.location.reload();
                        }
                        sub_win.close();
                    }
                });
            } else {
                sub_win.button({name: 'Save', disabled: false});
                sub_win.button({name: 'Submit', disabled: false});
                sub_win.button({name: 'Cancel', disabled: false});
                P.$.dialog.alert('Add failed, please contact the administrator.');
            }
        }
    });
    return false;
}

/**
 * 验证Form表单
 */
function validForm() {
    var isValid = false;
    $("#add_form .error").remove();
    var errMsg = '<span class="error">This field is required.</span>';
    var errMsg1 = '<span class="error">The length is greater than 3000 bytes.</span>';
    if (!$("[name='toBaseInfo.defectId']").val()) {
        $("[name='toBaseInfo.defectId']").nextAll("div.errorMessage").append(errMsg);
    }

    if (!$("[name='toBaseInfo.skill']").val()) {
        $("[name='toBaseInfo.skill']").nextAll("div.errorMessage").append(errMsg);
    }

    if ($("input:radio[name='toBaseInfo.feedbackRequests']:checked").val() == null) {
        $("[name='toBaseInfo.feedbackRequests']").nextAll("div.errorMessage").append(errMsg);
    }

    if ($("input:radio[name='toBaseInfo.sourceType']:checked").val() == null) {
        $("[name='toBaseInfo.sourceType']").nextAll("div.errorMessage").append(errMsg);
    }

    var description = $("[name='toBaseInfo.description']").val();
    if (!description) {
        $("[name='toBaseInfo.description']").nextAll("div.errorMessage").append(errMsg);
    }

    //验证是否超过3000字节
    if (description.replace(/[^\u0000-\u00ff]/g, "aaa").length > 3000) {
        $("[name='toBaseInfo.description']").nextAll("div.errorMessage").append(errMsg1);
    }

    //获取Trouble-shooting下面的步骤
    // var troubleShooting = $("#trouble_shooting_table").find("tr:gt(1)");
    var troubleShooting = $("#trouble_shooting_table").find("tr[class^='addStep_tr_']:gt(0)");
    //如果存在必须要填写
    if (troubleShooting && troubleShooting.length > 0) {

        $.each(troubleShooting, function (index, value) {
            if (!$.trim($(value).find("td:eq(1)").find("textarea").val())) {
                $(value).find("td:eq(1)").find("textarea").nextAll("div.errorMessage").append(errMsg);
                isValid = true;
            }
        });
    } else {
        P.$.dialog.alert('至少需要填写一个步骤！');
        isValid = true;
    }
    checkDMfn && checkDMfn.call();
    if ($("#add_form .errorMessage").text()) {
        isValid = true;
    }
    return isValid;
}


/**
 * 添加行
 */
function add_tr() {
    var _table = $("#trouble_shooting_table");
    // var _node = _table.find("tr").last().clone(true);
    //按步骤类名找到最后一个步骤
    var toStepTr=$("tr[class^='addStep_tr_']");
    var trLast=toStepTr[toStepTr.length-1];
    var trClassName=trLast.className;
    var _node = _table.find("tr."+trClassName).clone(true);//拷贝最后一个步骤节点
    _node.removeAttr("style");
    _node.removeAttr("class");
    _node.removeAttr("id");
    var _findTd = _node.find("td:eq(0)");
    var _index = _findTd.text();
    _findTd.text(Number(_index) + 1);
    var newNum=Number(_index)+ 1;
    _node.attr("class","addStep_tr_"+newNum);
    //设置Suggestion的name值
    _node.find("td:eq(1)").find(":input").attr("name", "toTroubleShootings[" + Number(_index) + "].suggestion");
    //设置Step的name值
    _node.find("td:eq(2)").find(":input").attr("name", "toTroubleShootings[" + Number(_index) + "].step");
    //设置id的name值
    _node.find("td:eq(3)").find(":input").attr("name", "toTroubleShootings[" + Number(_index) + "].id");
    //取消readonly的值
    _node.find("td:eq(1)").find(":input").removeAttr("readonly");
    //设置Suggestion的样式
    _node.find("td:eq(1)").find(":input").attr("style", "width:97%;height:60px;");
    //判断删除按钮是否被隐藏了,如果隐藏了就显示出来
    _node.find("td:eq(4)").find("img").attr("class", "");
    _node.find("td:eq(1)").find(":input").val("");
    //设置Step的value值
    _node.find("td:eq(2)").find(":input").attr("value", Number(_index) + 1);
    _node.find("td:eq(3)").find(":input").val("");
    //清空onclick的id值
    _node.find("td:eq(4)").find("img.del").attr("onclick", "delete_tr(this,'')");
    //清除删除事件再重新绑定(针对IE的问题)
    $(_node.find("td:eq(4)").find("img.del")).unbind().bind("delete_tr");
    _node.find(".error").remove();
    _node.find("td:eq(5)").remove();
    _table.append(_node);
}

/**
 * 删除行
 *
 * @param _obj
 */
function delete_tr(_obj, id) {

    if ($("#trouble_shooting_table").find("tr").length > 2) {

        if (confirm("你确定要删除当前行吗 ?")) {

            var delTOTroubleShootingId = $.trim($("#delTOTroubleShootingId").val());

            if (delTOTroubleShootingId) {
                $("#delTOTroubleShootingId").val(delTOTroubleShootingId + "," + id);
            } else {
                $("#delTOTroubleShootingId").val(id);
            }

            // //删除
            // $(_obj).parent().parent().remove();
            //删除
            var stepTr=$(_obj).parent().parent().find("td:eq(0)").text();
            console.log(stepTr);
            $(_obj).parent().parent().remove();
            delete_tr_prod("del",stepTr);
            //删除后重新排序
            // var _trArray = $("#trouble_shooting_table").find("tr:gt(1)");
            var st=stepTr-1;
            var _trArray = $("#trouble_shooting_table").find("tr[class^='addStep_tr_']:gt("+st+")");
            if (_trArray) {

                _trArray.each(function (index_, value_) {
                    var val=$(value_).find("td:first").text();
                    var newVal=Number(stepTr)+index_;
                    $(value_).removeAttr("class");  //移除原有的类名
                    $(value_).attr("class","addStep_tr_"+newVal);// 按顺序添加新类名

                    $(value_).find("td:first").text(newVal);

                    $(value_).find("td:eq(1)").find(":input").attr("name", "toTroubleShootings[" + Number(index_) + "].suggestion");
                    $(value_).find("td:eq(2)").find(":input").attr("name", "toTroubleShootings[" + Number(index_) + "].step");
                    $(value_).find("td:eq(2)").find(":input").attr("value", Number(index_) + 1);
                    $(value_).find("td:eq(3)").find(":input").attr("name", "toTroubleShootings[" + Number(index_) + "].id");
                    delete_tr_prod("edit",val,newVal)
                });
            }
        }
    }
}


//删除步骤时，步骤挂的准备单一并删除或者类名重置
function delete_tr_prod(type,val,newVal){
    var stepTrProd=$(".Step_tr_"+val);
    stepTrProd.map(function(ele){

        if(type=="del"){//删除
            stepTrProd[ele].remove();
        }else if(type=="edit"){ //类名重置
            $(stepTrProd[ele]).attr("class","Step_tr_"+newVal);
        }

    });
}

