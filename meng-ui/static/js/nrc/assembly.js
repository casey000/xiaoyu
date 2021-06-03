function fengzhuang(id) {  //选择人组件
    //下个审批人选择初始化
    $("#" + id).MyComboGrid({
        idField: 'ACCOUNT_NUMBER',  //实际选择值
        textField: 'ACCOUNT_NUMBER', //文本显示值
        panelHeight: '180px',
        required: true,
        width: "85%",
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
            $("." + id + " .name_in").textbox('setValue', row.USER_NAME);

            $("." + id + " .gonghao").val(row.ACCOUNT_ID);

            // $(this).combobox('setValue',row.ACCOUNT_ID);
            // $("#authName").combobox('setValue',row.USER_NAME);

        }
    });
}

var selectRow = null;

function ac_url() {      //飞机与发动机选择组件
    var type_ac = "";
    if ($("#feiji").is(":checked")) {
        let acReg = $("#acNo").val() || '';
        $("#ac_zhe").hide();
        url_ac = "/api/v1/plugins/FLB_AC_LIST?acReg=" + acReg;
        $('#ac_type_input').textbox('setValue', "");
        $("#ac").html("");
        type_ac = false;
    } else if ($("#faji").is(":checked")) {
        let acId = $("#acId").val() || '';
        $("#ac_zhe").hide();
        url_ac = "/api/v1/plugins/ME_ENGINE_LIST?acId=" + acId;
        $('#ac_type_input').textbox('setValue', "");
        $("#ac").html("");
        type_ac = true;
    }
    $("#acReg").combobox({
        valueField: 'tail',
        textField: 'tail',
        url: url_ac,
        // param: {FunctionCode: 'FLB_AC_LIST'},
        prompt: '请先选择查询类型飞机或者发动机',
        // pagination:false,
        loadFilter: function (data) {
            if (data.data) {
                return data.data;
            } else {
                return data;
            }
        },
        onSelect: function (val) {
            $('#ac_id').textbox('setValue', val.acId);
            if (type_ac) {
                $('#ac_type_input').textbox('setValue', val.model);
                $("#ac").html(val.ac||"");
            } else {
                $('#ac_type_input').textbox('setValue', val.model);
                $("#ac").html("");
            }

        }
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

function formatDate(t) {
    var tmp;
    if (t >= 0 && t <= 9) {
        tmp = "0" + t;
    } else {
        tmp = t;
    }
    return tmp;
}

function gongka_popup_data(i,name) {
    let a = " <div id=\"gongka_div_tr" + i + "\" style=\"height: 32px;\" class=\"gongka_d_tr\">\n" +
        "            <div class=\"gongka_div\"  style=\"padding-top: 4px;height: 26px\"><input class=\"easyui-combobox\" id=\"skilll" + i + "\" name=\"skill\" style=\"width: 85%;   \"/></div>\n" +
        "            <div class=\"gongka_div\" style=\"width: 55%\"><input class=\"beiliao\" disabled=\"disabled\" name=\"sn\" style=\"width: 85%; margin-top: 4px;\" id=\"gongka_snn" + i + "\" type=\"text\">\n" +
        "                <img alt=\"\" class=\"fangdajin\" id=\"img_fang" + i + "\" onClick=\"gongka_imp(" + i + ")\" style=\"top: 7px;right: 25px;cursor: pointer\" src=\"/img/search.png\"/>" +
        "<input type='text' id=\"nrcid" + i + "\" style='display:none '><input type='text' id=\"type" + i + "\" style='display:none '><input type='text' id=\"rii" + i + "\" style='display:none '><input type='text' id=\"rci" + i + "\" style='display:none '><input  id=\"creat_mark" + i + "\" type='hidden' '> " +
        "</div>\n" +
        "            <div class=\"gongka_div\" style=\"width: 10%\"><div class=\"jianhao icon-delete\" onclick=\"delete_gongka(gongka_div_tr" + i + ",'"+name +"')\" style=\"margin-left: 18px\"></div></div>\n" +
        "        </div> ";
    let html_row = $(a);
    $("#gongka_div_tble").append(html_row);
    $('#skilll' + i).combobox({
        valueField: 'id',
        textField: 'text',
        data: [{id: "Please", text: "== Please Select =="}, {id: "TLB", text: "TLB"}, {
            id: "NRC",
            text: "NRC"
        }, {id: "JC", text: "JC"}, {id: "OTHERS", text: "OTHERS"}],
        onSelect: function (val) {
            if (val.id == "OTHERS") {
                $("#img_fang" + i).hide();
                $("#gongka_snn" + i).removeAttr('disabled');
                $("#type" + i).val('OTHERS');
            } else {
                $("#img_fang" + i).show();
                $("#gongka_snn" + i).attr('disabled', 'false');
                $("#type" + i).val('');
            }
        }
    });
}

function addgongka_div() {
    if (document.getElementsByClassName('gongka_d_tr').length > 0) {
        let gus = document.getElementsByClassName('gongka_d_tr');
        let inde = gus[gus.length - 1].id.substring(13);
        gongka_popup_data(parseInt(inde) + 1);
    }
}

function delete_gongka(na,type) {
    if(type == 'SYSTEM'){
        alert('来源PEND转NRC或者ASMS的NRC的来源工卡不可删除');
        return
    }
    if (document.getElementsByClassName('gongka_d_tr').length > 1) {
        var newP = $(na);
        if (newP.length > 0) {
            newP.remove();
        }
    }

}


function gongka_imp(ind) {
    if ($('#skilll' + ind).combobox("getValue") == "Please" || $('#skilll' + ind).combobox("getValue") == "") {
        alert("请选择类型！");
        return
    }
    if ($('#skilll' + ind).combobox("getValue") == "NRC") {
        $.nrc_listno({
            success: function (data) {
                $("#gongka_snn" + ind).val(data.nrcNo);
                $("#nrcid" + ind).val(data.nrcId);
                $("#type" + ind).val("NRC");
            }
        })
    }
    if ($('#skilll' + ind).combobox("getValue") == "TLB") {
        $.tlb_listno({
            success: function (data) {
                $("#gongka_snn" + ind).val(data.tlbNo);
                $("#nrcid" + ind).val(data.tlbId);
                $("#type" + ind).val("TLB");
            }
        })
    }
    if ($('#skilll' + ind).combobox("getValue") == "JC") {
        $.jc_list({
            success: function (data) {
                $("#gongka_snn" + ind).val(data.jcNo);
                $("#nrcid" + ind).val(data.id);
                $("#type" + ind).val(data.jcType);
                if(data.rii) {
                    $("#rii" + ind).val(data.rii.toLowerCase());
                }
                if(data.rci) {
                    $("#rci" + ind).val(data.rci.toLowerCase());
                }
            }
        })
    }
}