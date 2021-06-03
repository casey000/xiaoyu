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
    var numberErrMsg = '<span class="error">Please enter only digits.</span>';

    if (!$("[name='toBaseInfo.subject']").val()) {
        $("[name='toBaseInfo.subject']").nextAll("div.errorMessage").append(errMsg);
    }

    if ($("input:radio[name='toBaseInfo.feedbackRequests']:checked").val() == null) {
        $("[name='toBaseInfo.feedbackRequests']").nextAll("div.errorMessage").append(errMsg);
    }

    if ($("input:radio[name='toBaseInfo.sourceType']:checked").val() == null) {
        $("[name='toBaseInfo.sourceType']").nextAll("div.errorMessage").append(errMsg);
    }

    /*if($("input:radio[name='toBaseInfo.isEntryTLB']:checked").val()==null){
        $("[name='toBaseInfo.isEntryTLB']").nextAll("div.errorMessage").append(errMsg);
    }*/

    var description = $("[name='toBaseInfo.description']").val();
    if (!description) {
        $("[name='toBaseInfo.description']").nextAll("div.errorMessage").append(errMsg);
    }

    //验证是否超过3000字节
    if (description.replace(/[^\u0000-\u00ff]/g, "aaa").length > 3000) {
        $("[name='toBaseInfo.description']").nextAll("div.errorMessage").append(errMsg1);
    }

    //获取AC/NO下面的飞机
    var aircraftSelect = $("#aircraft_select_table").find("tr:gt(1)");
    //必须要有至少一个飞机
    if (aircraftSelect.length < 1) {
        P.$.dialog.alert('必须要选择飞机！');
        isValid = true;
    }

    //获取Required Material/Special Tools下面的工具航材
    var materialToolSelect = $("#material_tool_select_table").find("tr:gt(1)");
    //如果存在必须要填写
    if (materialToolSelect) {
        $.each(materialToolSelect, function (index, value) {

            if (!$.trim($(value).find("td:eq(1)").find(":input").val())) {
                $(value).find("td:eq(1)").find(":input").nextAll("div.errorMessage").append(errMsg);
                isValid = true;
            }

            if (!$.trim($(value).find("td:eq(2)").find(":input").val())) {
                $(value).find("td:eq(2)").find(":input").nextAll("div.errorMessage").append(errMsg);
                isValid = true;
            }

            if (!$.trim($(value).find("td:eq(4)").find(":input").val())) {
                $(value).find("td:eq(4)").find(":input").nextAll("div.errorMessage").append(errMsg);
                isValid = true;
            }

            if ((!$.trim($(value).find("td:eq(5)").find("div[class!='hidden'][class!='errorMessage']").children("select").val()))) {
                $(value).find("td:eq(5)").find("div[class!='hidden'][class!='errorMessage']").children("div.errorMessage").append(errMsg);
                isValid = true;
            }

            if (isNaN($.trim($(value).find("td:eq(4)").find(":input").val()))) {
                $(value).find("td:eq(4)").find(":input").nextAll("div.errorMessage").append(numberErrMsg);
                isValid = true;
            }
        });
    }
    checkDMfn && checkDMfn.call();
    if ($("#add_form .errorMessage").text()) {
        isValid = true;
    }
    return isValid;

}

/**
 * 添加飞机
 */
function add_aircraft(acId, acType, tail, status,topAcType) {
    //校验当前选着飞机的机型
    if(isModel&&isModel!=topAcType){
        MsgAlert({type:"error",content:"增加失败,请先删除准备单再增加机型和飞机号"});
        return;
    }

    //校验准备单适用的机号
    var validFleet=true;
    var addProdPrepFleetAll=$(".addProdPrepFleet");
    addProdPrepFleetAll.each(function(i,v){//遍历所有准备单下的机号
        var prodPrepFleet=$.trim($(v).text());//获取准备单下的机号
        if(prodPrepFleet.indexOf(",")>-1){//如果准备单下的机号是多个
            var fleetArr=prodPrepFleet.split(",");
            if(fleetArr.indexOf(tail)<0){
                MsgAlert({type:"error",content:"增加失败,请先删除准备单再增加机型和飞机号"});
                validFleet=false;
            }
        }else if(prodPrepFleet!=tail){  //添加的飞机与准备单下不相符
            MsgAlert({type: "error", content: "增加失败,请先删除准备单再增加机型和飞机号"});
            validFleet = false;
        }
    });

    if(!validFleet){
        return;
    }

    var _table = $("#aircraft_select_table");
    var _node = _table.find("tr").last().clone(true);
    _node.removeAttr("style");
    var _findTd = _node.find("td:eq(0)");
    var _index = _findTd.text();
    _findTd.text(Number(_index) + 1);
    //设置acId的name值
    _node.find("td:eq(1)").find(":input:eq(0)").attr("name", "toApplicabilityForSurveys[" + Number(_index) + "].acId");
    _node.find("td:eq(1)").find(":input:eq(1)").attr("name", "toApplicabilityForSurveys[" + Number(_index) + "].acReg");
    //设置id的name值
    _node.find("td:eq(5)").find(":input").attr("name", "toApplicabilityForSurveys[" + Number(_index) + "].id");
    //判断删除按钮是否被隐藏了,如果隐藏了就显示出来
    _node.find("td:eq(6)").find("img").attr("class", "");
    //清空onclick的id值
    _node.find("td:eq(6)").find("img").attr("onclick", "delete_aircraft_tr(this,'')");
    //清除删除事件再重新绑定(针对IE的问题)
    $(_node.find("td:eq(6)").find("img")).unbind().bind("delete_aircraft_tr");
    //设置acId的值
    _node.find("td:eq(1)").find(":input").val(acId);
    _node.find("td:eq(1)").find(":input:eq(1)").val(tail);
    _node.find("td:eq(1)").find(":input:eq(2)").val(acType.slice(0,4));
    //设置Ac/Type的值
    _node.find("td:eq(2)").text(acType);
    //设置Tail的值
    _node.find("td:eq(3)").text(tail);
    //设置Status的值
    _node.find("td:eq(4)").text(status);
    //清空id的name值
    _node.find("td:eq(5)").find(":input").val("");
    _table.append(_node);

}

/**
 * 删除飞机行
 *
 * @param _obj
 */
function delete_aircraft_tr(_obj, id) {
    //删除最后一行，判断是否已挂准备单，已挂准备单则提示
    if($("#aircraft_select_table").find("tr").length==3&&$(".addProdPrep_tr").length>0){
        MsgAlert({type:"error",content:"删除失败,请先删除准备单再删除机型和飞机号"});
        return;
    }


    if ($("#aircraft_select_table").find("tr").length > 2) {
        var  len=$("#aircraft_select_table").find("tr").length;
        if (confirm("你确定要删除当前行吗 ?")) {

            var delTOApplicabilityForSurveyId = $.trim($("#delTOApplicabilityForSurveyId").val());

            if (delTOApplicabilityForSurveyId) {
                $("#delTOApplicabilityForSurveyId").val(delTOApplicabilityForSurveyId + "," + id);
            } else {
                $("#delTOApplicabilityForSurveyId").val(id);
            }

            //删除
            $(_obj).parent().parent().remove();

            //删除后重新排序
            var _trArray = $("#aircraft_select_table").find("tr:gt(1)");

            if (_trArray) {

                _trArray.each(function (index_, value_) {

                    $(value_).find("td:first").text(index_ + 1);
                    $(value_).find("td:eq(1)").find(":input").attr("name", "toApplicabilityForSurveys[" + Number(index_) + "].acId");

                    $(value_).find("td:eq(5)").find(":input").attr("name", "toApplicabilityForSurveys[" + Number(index_) + "].id");
                });
            }

            if(len==3){ //无添加机型和机号时，禁用添加准备单按钮
                $("#survey_select_prodPrep").attr("disabled",true);
                $("#survey_select_prodPrep")[0].style.cursor="default";
            }
        }
    }
}

/**
 * 添加工具航材
 */
function add_material_tools() {

    var _table = $("#material_tool_select_table");

    var _node = _table.find("tr").last().clone(true);

    _node.removeAttr("style");

    var _findTd = _node.find("td:eq(0)");

    var _index = _findTd.text();

    _findTd.text(Number(_index) + 1);

    //设置Name的name值
    _node.find("td:eq(1)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].name");
    //设置P/N的name值
    _node.find("td:eq(2)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].pn");
    //设置Tools的name值
    _node.find("td:eq(3)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].type");
    //设置QTY的name值
    _node.find("td:eq(4)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].pageQty");
    //设置UNIT的name值
    _node.find("td:eq(5)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].unit");
    //设置id的name值
    _node.find("td:eq(6)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].id");

    //设置UNIT中工具DIV的class
    _node.find("td:eq(5)").find("div[name='unitName']").attr("class", "hidden");
    //设置UNIT中航材DIV的class
    _node.find("td:eq(5)").find("div[name='materialName']").attr("class", "");
    //清空select输入框中的值
    _node.find("td:eq(5)").find("div[name='unitName']").find("select").val("");
    _node.find("td:eq(5)").find("div[name='materialName']").find("select").val("");

    //清空id的value值
    _node.find("td:eq(6)").find(":input").val("");
    //清空onclick的id值
    _node.find("td:eq(7)").find("img").attr("onclick", "delete_material_tools_tr(this,'')");
    //清除删除事件再重新绑定(针对IE的问题)
    $(_node.find("td:eq(7)").find("img")).unbind().bind("delete_material_tools_tr");

    //清空input输入框中的值
    _node.find("input[type='text']").val("");
    //清空checkbox
    _node.find("input[type='checkbox']").removeAttr("checked");
    //清空提示
    _node.find(".error").remove();

    //新增一行要添加按钮单击事件
    _node.find("td:eq(2)").find("img").show();
    //移除件号框只读属性
    if (!_node.find("td:eq(2)").find("input").attr("readonly")) {
        _node.find("td:eq(2)").find("input").attr("readonly", "readonly").val("");
        _node.find("td:eq(1)").find("input").val("");
    }

    _table.append(_node);
}

/**
 * 删除工具航材行
 */
function delete_material_tools_tr(_obj, id) {

    if ($("#material_tool_select_table").find("tr").length > 2) {

        if (confirm("你确定要删除当前行吗 ?")) {

            var delTOMaterialToolsId = $.trim($("#delTOMaterialToolsId").val());

            if (delTOMaterialToolsId) {
                $("#delTOMaterialToolsId").val(delTOMaterialToolsId + "," + id);
            } else {
                $("#delTOMaterialToolsId").val(id);
            }

            //删除
            $(_obj).parent().parent().remove();

            //删除后重新排序
            var _trArray = $("#material_tool_select_table").find("tr:gt(1)");

            if (_trArray) {

                _trArray.each(function (index_, value_) {

                    $(value_).find("td:first").text(index_ + 1);
                    $(value_).find("td:eq(1)").find(":input").attr("name", "toMaterialToolss[" + Number(index_) + "].name");
                    $(value_).find("td:eq(2)").find(":input").attr("name", "toMaterialToolss[" + Number(index_) + "].pn");
                    $(value_).find("td:eq(3)").find(":input").attr("name", "toMaterialToolss[" + Number(index_) + "].type");
                    $(value_).find("td:eq(4)").find(":input").attr("name", "toMaterialToolss[" + Number(index_) + "].pageQty");
                    $(value_).find("td:eq(5)").find(":input").attr("name", "toMaterialToolss[" + Number(index_) + "].unit");
                    $(value_).find("td:eq(6)").find(":input").attr("name", "toMaterialToolss[" + Number(index_) + "].id");
                });
            }

        }
    }
}
