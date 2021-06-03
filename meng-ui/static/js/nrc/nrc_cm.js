$(function () {
    $('#rep_date').datetimebox({
        value: getNowFormatDate(),
        required: true,
        showSeconds: true
    });
    $('#skill').combobox({
        valueField: 'id',
        textField: 'text',
        data: [{id: 0, text: "== Please Select =="}, {id: 1, text: "ME"}, {id: 2, text: "AV"}, {
            id: 3,
            text: "STR"
        }],

    });

    $('#cm_file').window('close');
    $('#execution').window('close');
    fengzhuang("repSn");
    var _loginInfo = {};
    var params = getParentParam1_();
    if (params.jsonStr) {
        AjaxCall_("/api/v1/system/data/menu", {}, function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                initUserInfo(jdata.data.loginUser);
            }
        });
        params = JSON.parse(params.jsonStr);
        if (params.pnsnList) {
            initPnsn4Me(params.pnsnList, params.compPlan);
        } else {
            xunhuan(0);
        }
    } else {
        initUserInfo(getLoginInfo());
        xunhuan(0);
    }
    if (getParentParam_().nrcid !== "" && "review" === getParentParam_().optype) {
        edit_data(getParentParam_().nrcid);
    } else {
    }
    ac_assembly();
});
var cm_file_list = [];

var nrcCmFormData;

//因获得表单数据时，有些数据属性为disabled，因此序列化获取无效，必须特殊取值
function getNrcCmFormData() {
    nrcCmFormData = $("#nrc_cm_form").serializeObject();
    nrcCmFormData.repName = $("#repName").textbox("getValue");
    return nrcCmFormData;
}

function ac_assembly() {      //飞机与发动机选择组件
    if ($("#acReg").combobox("getValue")) {
        return;
    }
    $("#ac_zhe").hide();
    $("#acReg").combobox({
        valueField: 'tail',
        textField: 'tail',
        url: "/api/v1/plugins/FLB_AC_LIST",
        // param: {FunctionCode: 'FLB_AC_LIST'},
        prompt: '请先选择飞机',
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
                $('#ac_type_input').textbox('setValue', val.model);
        }
    });
}

function initPnsn4Me(list, obj) {
    $("#pn_sn").hide();
    $('#faji').attr('disabled', true);
    $("#feiji").prop("checked", true);
    $('#feiji').attr('disabled', true);
    for (let i in list) {
        xunhuan(i);
        $("#pn" + i).textbox("setValue", list[i].pn);
        $("#sn" + i).textbox("setValue", list[i].sn);
        $("#miaoshu" + i).textbox("setValue", list[i].description);
        $("#planId" + i).val(list[i].id);
        $("#pn_itemnum" + i).val(list[i].itemNum);
        $("#acBtna" + i).hide();
    }

    let mrType, mrNo;
    mrType = {1: 'MP', 2: 'EO', 'MP': 'MP', 'EO': 'EO'}[obj.mrType];
    $("#source_type").val(obj.mrType);
    $("#source_file").textbox("setValue", obj.mrNo || "");
    $("#ac_id").textbox("setValue", obj.acId);
    $("#acReg").combobox("setValue", obj.tail);
     // $("#ac_type_input").textbox("setValue", obj.model);
    let date_due = new Date();
    if (new Date(addDate(obj.dueDate, 5)) > date_due) {   //到期时间处理
        $("#expire_date").textbox("setValue", addDate(obj.dueDate, 5));
    } else {
        $("#expire_date").textbox("setValue", "");
    }
    //obj.dueDate;  到期日期

    console.log(mrType + ' : ' + mrNo);

}

function addDate(date, days) {      //时间格式减法
    var d = new Date(date);
    d.setDate(d.getDate() - days);
    var m = d.getMonth() + 1;
    return d.getFullYear() + '-' + m + '-' + d.getDate();
}

function initUserInfo(_loginInfo) {
    $("#repSn").textbox("setValue", _loginInfo.accountNumber);
    $("#repName").textbox("setValue", _loginInfo.userName);
    //$("#repidto").val(_loginInfo.accountId);
}

function download_template() {
    //获得地址
    let currPath = window.document.location.href;
    let docPath = window.document.location.pathname;
    let index = currPath.indexOf(docPath);
    let serverPath = currPath.substring(0, index);
    window.location.href = serverPath + "/views/nrc/export/NRC_CONTINUED_WORK_SHEET.xlsx";
}


function edit_data(id) {      //编辑
    $.ajax({
        type: "GET",
        url: "/api/v1/tbm/nrc/nrc/query_nrc_by_id?nrcId=" + id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            $("#implement").textbox("setValue", data.data.nrcExeCardDisplay);
            $("#nrcId").textbox("setValue", id);
            let nrc_data = data.data.nrcBase;
            $("#ac_id").textbox("setValue", nrc_data.ae);
            $("#repName").textbox("setValue", data.data.repName);
            for (var file in nrc_data.nrcAttachmentList) {
                type_file_sh(nrc_data.nrcAttachmentList[file]);
            }

            $("#nrcNo").textbox("setValue", nrc_data.nrcNo);
            if (nrc_data.aeType == 1) {
                $("#feiji").prop("checked", true);
            } else {
                $("#faji").prop("checked", true);
            }
            ac_assembly();
            $("#acReg").combobox("setValue", nrc_data.acEng);
            $("#ac_type_input").textbox("setValue", nrc_data.modelEng);
            // $("#ac_type_input").textbox("",)
            $('#skill').combobox("setValue", nrc_data.skill);
            $("#zhanwei").textbox("setValue", nrc_data.stazone);
            $("#repSn").textbox("setValue", nrc_data.repSn);
            $("#repName").textbox("setValue", nrc_data.repName);
            //$("#repidto").val(nrc_data.repId);
            $("#rep_date").datetimebox("setValue", nrc_data.repTime);
            if (nrc_data.defect != "n") {
                $("#waiguan_y").prop("checked", true);
            } else {
                $("#waiguan_n").prop("checked", true);
            }
            if (nrc_data.cm.isManual == 1) {
                $("#rengong").prop("checked", true);
                manual_control();
            }
            $("#expire_date").datebox("setValue", nrc_data.timeLimitDate);
            $("#descChn").val(nrc_data.descChn);
            $("#descEn").val(nrc_data.descEn);
            $("#ata").textbox("setValue", nrc_data.ata);
            if (nrc_data.rii == "y") {
                $("#rii_y").prop("checked", true);
                rii_radio('rci_n')
            } else {
                $("#rii_n").prop("checked", true);
            }
            if (nrc_data.rci == "y") {
                $("#rci_y").prop("checked", true);
                rii_radio('rii_n')
            } else {
                $("#rci_n").prop("checked", true);
            }
            if (nrc_data.dm == "y") {
                $("#dm_y").prop("checked", true);
            } else {
                $("#dm_n").prop("checked", true);
            }
            if (nrc_data.feedbackAircrew == "y") {
                $("#jizu_y").prop("checked", true);
            } else {
                $("#jizu_y").prop("checked", true);
            }
            let gongka = "";
            for (let i in nrc_data.nrcExecutiveCardList) {
                if (gongka.length > 0) {
                    gongka += ","
                }
                gongka += nrc_data.nrcExecutiveCardList[i].cardNo;

                gongka_list.push({
                    cardType: nrc_data.nrcExecutiveCardList[i].cardType,
                    cardId: nrc_data.nrcExecutiveCardList[i].cardId,
                    cardNo: nrc_data.nrcExecutiveCardList[i].cardNo
                });
            }
            $("#source_file").textbox("setValue", nrc_data.cm.sourceNo);
            $("#source_type").val(nrc_data.cm.sourceType);
            $("#rectChn").val(nrc_data.rectChn);
            $("#rectEn").val(nrc_data.rectEn);
            $("#planningmhPerson").textbox("setValue", nrc_data.planningmhPerson);
            $("#planningmhHour").textbox("setValue", nrc_data.planningmhHour);
            if (nrc_data.feedbackTo == "y") {
                $("#fan_y").prop("checked", true);
            }
            $(".nrcMtrList").remove();
            for (let i in nrc_data.nrcCompList) {
                xunhuan(i);
                $("#pn" + i).textbox("setValue", nrc_data.nrcCompList[i].pn);
                $("#sn" + i).textbox("setValue", nrc_data.nrcCompList[i].sn);
                $("#miaoshu" + i).textbox("setValue", nrc_data.nrcCompList[i].description);
                $("#pn_itemnum" + i).val(nrc_data.nrcCompList[i].itemNum);
            }

            if (nrc_data.mtrYn == "y") {

                $("#requi_y").prop("checked", true);
                for (let i in nrc_data.nrcMtrList) {
                    parts_add(i, "gong");
                    if (nrc_data.nrcMtrList[i].mrType == 1) {
                        $("#tools_y" + i).prop("checked", true);
                    }
                    if (nrc_data.nrcMtrList[i].prepareMaterials == "y") {
                        $("#beiliao_y" + i).prop("checked", true);
                    }
                    unit_data(i);
                    $("#av" + i).val(nrc_data.nrcMtrList[i].pn);
                    $("#qty" + i).val(nrc_data.nrcMtrList[i].qty);
                    $("#mrDesc" + i).val(nrc_data.nrcMtrList[i].mrDesc);
                    $("#unit_xiala" + i).combobox("setValue", nrc_data.nrcMtrList[i].unit);
                    $("#av_itemnum" + i).val( nrc_data.nrcMtrList[i].itemNum);
                }

            } else {
                $("#requi_n").prop("checked", true);
            }
            required_to();
            $("#mtrIpc").textbox("setValue", nrc_data.mtrIpc);
            if (nrc_data.attentionType != null) {
                let attentionType = nrc_data.attentionType.split(",");
                let int = 1;
                // $('#approval').dialog('open');
                $.each($('#zhuyi_input .input_checkbox'), function () {
                    for (let i in attentionType) {
                        if (attentionType[i] == int) {
                            $(this).prop("checked", true);
                            if (attentionType[i] == 7) {
                                Other_matters(1);
                            }
                        }
                    }
                    int++;
                });
            }
            $("#attentionDesc").val(nrc_data.attentionDesc);


        },
        error: function () {
            window.alert("查询失败！");
        }
    });
}


function Other_matters() {
    if ($("#other").is(":checked")) {
        $('#attentionDesc').removeAttr("disabled");
    } else {
        $("#attentionDesc").attr("disabled", "disabled");
    }
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

function rii_radio(value) {

    $("#" + value).prop("checked", true);

}

function get_Date() {     //获取当前时间年月日
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

var regex = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;

function data_check() {          //提交数据效验

    let data = this.getNrcCmFormData();
    if (data.acEng == "") {
        alert("飞机或者发动机不能为空");
        return
    }
    if (data.ata == "") {
        alert("章节不能为空！");
        return;
    } else {
        let pattern = /^\d{4}$/;
        if (!pattern.test(data.ata)) {
            alert("章节只能输入4位数字！");
            return;
        }
    }
    if (data.skill == 0) {
        alert("专业不能为== Please Select ==");
        return
    }
    // if (data.zhanwei == "") {
    //     alert("站位和区域不能为空！");
    //     return;
    // }
    if ($("#repSn").textbox("getValue") == "") {
        alert("报告人不能为空！");
        return;
    }
    if (data.repTime != "") {
        if (!regex.test(data.repTime)) {
            alert("请输入正确的时间格式，如：2019-07-07 09:12:00");
            return
        }
        if (new Date(data.repTime) > new Date()) {
            alert("选择时间不能大于当前时间");
            return
        }
    } else {
        alert("时间不能为空");
        return
    }
    // if (data.feedbackTo == "") {
    //     alert("完工反馈必选！");
    //     return
    // }
    if (data.rii == "") {
        alert("RII必须勾选一项！");
        return
    }
    if (data.rci == "") {
        alert("RCI必须勾选一项！");
        return
    }
    if (data.dm == "") {
        alert("DM必须勾选一项！");
        return
    }
    // if ($("#source_file").textbox("getValue") == "") {
    //     alert("来源文件不能为空！");
    //     return
    // }
    if (data.rectChn == "") {
        alert("纠正方案或工作任务描述 CHINESE不能为空！");
        return
    }
    if (data.rectEn == "") {
        alert("纠正方案或工作任务描述 ENGLISH不能为空！");
        return
    }

    if (data.mtrYn == "") {
        alert("REQUIRED MATERIAL/SPEC.TOOLE必须勾选一项！");
        return
    }
    if (data.descChn == "") {
        alert("CHINESE不能为空！");
        return
    }
    if (data.descEn == "") {
        alert("ENGLISH不能为空！");
        return
    }
    if ($("#expire_date").datebox("getValue") == "") {
        alert("到期时间不能为空！");
        return
    } else {
        if (Date.parse(new Date($("#expire_date").datebox("getValue"))) < Date.parse(get_Date())) {
            alert("到期时间不能小于当前时间");
            return
        }
    }
    let cm = {};
    if ($("#rengong").is(":checked")) {
        cm.isManual = 1;

    }
    data = input_checkbox("#zhuyi_input", data);
    data.timeLimitDate = $("#expire_date").datebox("getValue");
    cm.sourceNo = $("#source_file").textbox("getValue");
    cm.sourceType = $("#source_type").val();

    data.cm = cm;
    data.nrcExecutiveCardList = gongka_list;
    let geshu = document.getElementsByClassName('nrcMtrList');
    let nrcmtrList = [];
    for (var i = 0; i < geshu.length; i++) {
        let inde = geshu[i].id.substring(7);
        nrcmtrList.push({
            "nrcId": "",
            "planId": $("#planId" + inde).val(),
            "pn": $("#pn" + inde).textbox("getValue"),
            "sn": $("#sn" + inde).textbox("getValue"),
            "unit": "EA",
            "description": $("#miaoshu" + inde).textbox("getValue"),
            "itemNum": $("#pn_itemnum" + inde).val()
        })
    }
    data.nrcCompList = nrcmtrList;
    //data.repId = $("#repidto").val();
    data.nrcNo = $("#nrcNo").textbox("getValue");
    data.modelEng = $("#ac_type_input").textbox("getValue");
    if (data.mtrYn == "y") {

        let geshu = document.getElementsByClassName('partslist');
        let nrcmtrList = [];
        for (var i = 0; i < geshu.length; i++) {

            let ind = geshu[i].id.substring(7);

            if ($("#tools_y" + ind).is(":checked")) {
                var tools = 1;
            } else {
                var tools = 0;
            }
            if ($("#beiliao_y" + ind).is(":checked")) {
                var pareMat = "y";
            } else {
                var pareMat = "n";
            }
            nrcmtrList.push({
                mrType: tools,
                pn: $("#av" + ind).val(),
                qty: $("#qty" + ind).val(),
                unit: $("#unit_xiala" + ind).combobox("getValue"),
                mrDesc: $("#mrDesc" + ind).val(),
                prepareMaterials: pareMat,
                type: "NRC",
                itemNum: $("#av_itemnum" + ind).val(),
            })
        }

        data.nrcMtrList = nrcmtrList;
    }
    data.itemCat = 4;
    data.aeType = 1;

    for (let key in data) {
        if (key == "") {
            delete data[key];
        }
    }
    data.attachIdList = cm_file_list;
    let nrcbase = {
        nrcCardDisplay: "",
        nrcBase: data
    };
    console.log(nrcbase);
    //根据状态判断提交链接
    let url = "";
    if ("review" === getParentParam_().optype) {
        url = "/api/v1/tbm/nrc/nrc/review"
    } else {
        url = "/api/v1/nrc/cm/submit_nrc";
    }
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(nrcbase),
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                alert("提交成功！");
                $("#nrcId").textbox("setValue", data.data);
                parent && parent.window.colsa_window && parent.window.colsa_window();
                window.close();
                //考虑从其他系统打开页面，无法进行关闭时，保存成功清空页面数据并提示手动关闭
                $('body').html('').html('<h3>数据已提交,请关闭当前窗口.</h3>');
                const params = getParentParam_();
                params.OWindow.Refresh();
                // const params = getParentParam_();
                // params.OWindow.Refresh();
            } else if (data.msgData && data.msgData[0]) {
                alert(data.msgData[0]);
            } else {
                alert(data.msg);
            }

        },
        error: function () {
            window.alert("保存失败！");
        }
    });
}

function input_checkbox(val, data) {
    let name_bal = "";
    $.each($(val + ' input:checkbox:checked'), function () {
        if (name_bal.length > 0) {
            name_bal += ",";
        }
        name_bal += $(this).val();
        if ($(this).val() == 7) {
            data.attentionDesc = $("#attentionDesc").val();
        }
    });
    data.attentionType = name_bal;
    return data;
}

function manual_control() {
    if ($("#rengong").is(":checked")) {
        $("#date_zhe").hide();
        // $("#expire_date").removeAttr("disabled");
    } else {
        $("#date_zhe").show();
    }
}

function xunhuan(i) {

    let a = "  <tr class='nrcMtrList' id=\"roe_tr_" + i + "\">\n" +
        "                        <td style=\"width: 153px\"> <input class=\"easyui-textbox bujian\"  readonly=\"readonly\"  id=\"pn" + i + "\" style=\"width: 85%\" type=\"text\" >" +
        "           <input id=\"planId" + i + "\" style='display: none'><input id=\"pn_itemnum" + i + "\" style='display: none'><img alt=\"\" id=\"acBtna" + i + "\" class=\"fangdajin\" onClick=\"pn_data('pn'," + i + ")\" src=\"/img/search.png\"/></td>\n" +
        "                        <td style=\"width: 263px\"><input class=\"easyui-textbox  bujian\" id=\"sn" + i + "\" style=\"width: 85%\" type=\"text\"></td>\n" +
        "                        <td colspan=\"4\" ><input  readonly=\"readonly\" class=\"easyui-textbox bujian\" id=\"miaoshu" + i + "\" style=\"width: 85%\" type=\"text\"><div class=\"jianhao icon-delete\" id=\"sn_pn_" + i + "\" style=\"    position: absolute;right: 10px;top: 3px;\" onclick=\"delete_popup_sn(roe_tr_" + i + ")\" ></div></td>\n" +
        "                    </tr>";
    let html_row = $(a);
    $("#addnrc_table_list").append(html_row);
    $(".bujian").textbox();
}


function part_number() {
    if (document.getElementsByClassName('nrcMtrList').length > 0) {
        let gus = document.getElementsByClassName('nrcMtrList');
        let inde = gus[gus.length - 1].id.substring(7);
        xunhuan(parseInt(inde) + 1);
    }

}

function delete_popup_sn(na) {
    if (document.getElementsByClassName('nrcMtrList').length > 1) {
        var newP = $(na);
        if (newP.length > 0) {
            newP.remove();
        }
    }
}

function Popup_file() {
    var screenHeight = $(window).height();
    var scrolltop = $(document).scrollTop();
    var objTop = (screenHeight - 650) / 2 + scrolltop;

    $("#cm_file").window({
        resizable: false,
        modal: true,
        top: objTop + "px"
    });
    let geshu = document.getElementsByClassName('poput_tr');
    if (geshu.length >= 1) {
        return
    }
    popup_add_file(0);
}

function popup_add_file(i) {
    let a = "  <tr class='poput_tr' id=\"popup_tr" + i + "\">\n" +
        "               <td > <input type=\"file\" id=\"popup_flie_" + i + "\" style=\"border: 1px solid #ccc\"></td>\n" +
        "               <td id=\"fujian_id" + i + "\">附件：<input id=\"cws" + i + "\"   type=\"checkbox\" value=\"1\" class=\"fujian\"><label for=\"cws" + i + "\">CWS</label>" +
        "<input id=\"gongka" + i + "\"  type=\"checkbox\" value=\"2\" class=\"fujian\"><label for=\"gongka" + i + "\">工卡</label>" +
        "<input id=\"shouce" + i + "\"   type=\"checkbox\" value=\"3\" class=\"fujian\"><label for=\"shouce" + i + "\">手册/图片</label> </td>\n" +
        "               <td style=\"width: 80px;\"><div class='file_duihao' onclick=\"submit_popup_flie(popup_flie_" + i + ", popup_tr" + i + ")\">✔</div><div class=\"jianhao icon-delete\" onclick=\"delete_popup_flie(popup_tr" + i + ")\"></div></td>\n" +
        "           </tr>";
    let html_row = $(a);
    $("#popup_table").append(html_row);
}

function submit_popup_flie(id, name) {
    let fujia = "";
    var files = id.files;
    if (files.length > 0) {
        if ($("#" + name.id + " [class='fujian']:checked").length > 0) {
            $.each($("#" + name.id + " [class='fujian']:checked"), function () {
                if (fujia.length > 0) {
                    fujia += ",";
                }
                fujia += $(this).val();
            });
            var formData = new FormData();
            formData.append("file", files[0]);
            formData.append("category", "nrcNnuedWorkSheet");
            formData.append("type", fujia);
            formData.append("pId", "1234");

            $.ajax({
                type: "POST",
                url: "/api/v1/tbm/nrc/attachment/upload",
                data: formData,
                processData: false,
                contentType: false,
                success: function (obj) {
                    if (obj.code == 200) {
                        id.value = "";
                        cm_file_list.push(obj.data.attaId);
                        $("#" + name.id + " .fujian").prop("checked", false);
                        type_file_sh(obj.data);
                        alert("上传成功！");
                    }
                    else {
                        alert("上传失败！" + obj.msg);
                    }

                },
                error: function (obj) {
                    alert("上传失败！");
                }
            });
        } else {
            alert("请选择附件类型！")
        }

    } else {
        alert("请选择文件！")
    }
}

function type_file_sh(data) {
    let a = " <div class='filepopu' id=\"type_file_show" + data.wsAttachment.pkid + "\"  style=\"line-height: 30px;width: 100%;    height: 30px;border-bottom: 1px solid #ccc;\" >\n" +
        "                            <div style=\"width: 80%;float: left;text-align: left;\"><a style=\"color:red;font-size: 14px;margin-right: 25px;\" onclick=\"downFile(" + data.wsAttachment.pkid + "," + data.wsAttachment.pkid + ")\">" + data.wsAttachment.orgName + "</a>\n" +
        "                                附件：<input id=\"cws" + data.wsAttachment.pkid + "\" disabled=\"disabled\"  type=\"checkbox\" value=\"1\" class=\"fujian\"><label for=\"cws" + data.wsAttachment.pkid + "\">CWS</label>\n" +
        "                                <input id=\"gongka" + data.wsAttachment.pkid + "\"  disabled=\"disabled\" type=\"checkbox\" value=\"2\" class=\"fujian\"><label for=\"gongka" + data.wsAttachment.pkid + "\">工卡</label>\n" +
        "                                <input id=\"shouce" + data.wsAttachment.pkid + "\" disabled=\"disabled\"  type=\"checkbox\" value=\"3\" class=\"fujian\"><label for=\"shouce" + data.wsAttachment.pkid + "\">手册/图片</label>\n" +
        "                            </div>\n" +
        "                            <div class=\"jianhao icon-delete\" style='float: left'onclick=\"delete_flie_poput(" + data.id + ", type_file_show" + data.wsAttachment.pkid + ")\"></div>\n" +
        "                        </div>";
    let b = $(a);
    $("#type_file").append(b);
    let attentionType = data.type.split(",");
    for (var ind in attentionType) {
        if (attentionType[ind] == 1) {
            $("#cws" + data.wsAttachment.pkid).prop("checked", true);
        }
        if (attentionType[ind] == 2) {
            $("#gongka" + data.wsAttachment.pkid).prop("checked", true);
        }
        if (attentionType[ind] == 3) {
            $("#shouce" + data.wsAttachment.pkid).prop("checked", true);
        }
    }
}

function delete_flie_poput(id, name) {
    if (confirm("确定删除吗")) {
        $.ajax({
            type: "POST",
            url: "/api/v1/tbm/nrc/attachment/delete_by_id?id=" + id,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    let geshu = document.getElementsByClassName('filepopu');
                    let newP = $(name);
                    if (newP.length > 0) {
                        newP.remove();
                    }
                    for (var a in cm_file_list) {
                        if (cm_file_list[a] == id) {
                            cm_file_list.splice(a, 1);
                        }
                    }

                } else {
                    alert(data.msg);
                }


            },
            error: function () {
                window.alert("失败！");
            }
        });
    }

}

function close_dialog() {
    $('#cm_file').window('close');
}

function add_popup_buiion() {
    if (document.getElementsByClassName('poput_tr').length > 0) {
        let gus = document.getElementsByClassName('poput_tr');
        let inde = gus[gus.length - 1].id.substring(8);

        popup_add_file(parseInt(inde) + 1);
    }

}

function delete_popup_flie(val) {
    let geshu = document.getElementsByClassName('poput_tr');
    if (geshu.length == 1) {
        return
    }
    let newP = $(val);
    if (newP.length > 0) {
        newP.remove();
    }
}

function parts_add(i, clas) {
    let a = " <tr class=\"partslist " + clas + "\" id=\"roe_tr_" + i + "\">\n" +
        "                                    <td style=\"width: 148px\"><input  id=\"tools_y" + i + "\"  type=\"checkbox\" onclick=\"qian_yes('beiliao_y" + i + "')\"><label for=\"tools_y" + i + "\">YES</label></td>\n" +
        "                                    <td><input class= \"beiliao\"  readonly=\"readonly\"  id=\"av" + i + "\"  style=\"width: 85%\"/><input id=\"av_itemnum" + i + "\" style='display: none'>\n" +
        "                                        <img alt=\"\" id=\"acBtn" + i + "\" class=\"fangdajin\" onclick=\"pn_data('av'," + i + ")\" src=\"/img/search.png\"/></td>\n" +
        "                                    <td><input class=\"beiliao\" style=\"width: 85%\" type=\"text\" id=\"qty" + i + "\"></td>\n" +
        "                                    <td><input class=\"beiliao easyui-combobox\" style=\"width: 85%\" type=\"text\" id=\"unit_xiala" + i + "\"></td>\n" +
        "                                    <td><input class=\"beiliao\"  readonly=\"readonly\" style=\"width: 85%\" type=\"text\" id=\"mrDesc" + i + "\"></td>\n" +
        "                                    <td><input id=\"beiliao_y" + i + "\"  type=\"checkbox\" onclick=\"hou_yes('tools_y" + i + "')\"><label for=\"beiliao_y" + i + "\" >YES</label></td>\n" +
        "                                    <td>\n" +
        "                                        <div class=\"jianhao icon-delete\" onclick=\"delete_tr(roe_tr_" + i + ")\"></div>\n" +
        "                                    </td>\n" +
        "                                </tr>";
    let html_row = $(a);
    $("#parts_list").append(html_row);
    unit_data(i);
}

function getDataDictionary(name) {
    let te_unit = [];
    let ma_unit = [];
    var _url = "/api/v1/plugins/ANALYSIS_DOMAIN_BYCODE";
    var params_ = {
        "domainCode": "TE_UNIT_TYPE,MATERIAL_UNIT_TYPE",
        "FunctionCode": "ANALYSIS_DOMAIN_BYCODE"
    };
    $.ajax({
        url: _url,
        data: params_,
        type: "POST",
        dataType: "json",
        cache: false,
        async: false,
        success: function (data) {
            te_unit = data.data.TE_UNIT_TYPE;
            ma_unit = data.data.MATERIAL_UNIT_TYPE
        }
    });
    if (name == "tools_y") {
        return te_unit
    } else if (name == "tools_n") {
        return ma_unit
    }
}

function unit_data(i) {
    var unit_da = [];
    if ($("#tools_y" + i).is(":checked")) {

        unit_da = getDataDictionary("tools_y");
    } else {

        unit_da = getDataDictionary("tools_n");
    }
    $("#unit_xiala" + i).combobox(
        {
            valueField: 'TEXT',
            textField: 'VALUE',
            data: unit_da,
        }
    );
}

function qian_yes(val) {
    $("#" + val).attr("checked", false);
    let ind = val.substring(9);
    if ($("#tools_y" + ind).is(":checked")) {
        $("#acBtn" + ind).hide();
        $("#av" + ind).removeAttr('readonly');
        $("#mrDesc" + ind).removeAttr('readonly');
    } else {
        $("#acBtn" + ind).show();
        $("#av" + ind).attr('readonly', 'readonly');
        $("#mrDesc" + ind).attr('readonly', 'readonly');
        $("#av" + ind).val("");
        $("#mrDesc" + ind).val("");
        $("#qty" + ind).val("");
    }
    unit_data(ind);
}

function hou_yes(val) {
    let zhen = false;
    let ind = val.substring(7);
    if ($("#" + val).is(":checked")) {
        zhen = true;
        $("#av" + ind).val("");
        $("#mrDesc" + ind).val("");
        $("#qty" + ind).val("");
    }
    $("#" + val).attr("checked", false);
    $("#acBtn" + ind).show();
    $("#av" + ind).attr('readonly', 'readonly');
    $("#mrDesc" + ind).attr('readonly', 'readonly');
    if (zhen) {
        unit_data(ind);
    }
}

function pn_data(name, ind) {
    $.pnSelect({
        success: function (data) {
            if (name == "av") {
                $("#av" + ind).val(data.partno);
                $("#av_itemnum" + ind).val(data.itemnum);
                $("#mrDesc" + ind).val(data.description);
            } else {
                $("#pn" + ind).textbox("setValue", data.partno);
                $("#pn_itemnum" + ind).val(data.itemnum);
                $("#miaoshu" + ind).textbox("setValue", data.description);
            }

        }
    })
}


function addjiahao() {
    if (document.getElementsByClassName('partslist').length > 0) {
        let gus = document.getElementsByClassName('partslist');
        let inde = gus[gus.length - 1].id.substring(7);
        parts_add(parseInt(inde) + 1, "gong");
    }

}

function delete_tr(na) {
    if (document.getElementsByClassName('partslist').length > 1) {
        var newP = $(na);
        if (newP.length > 0) {
            newP.remove();
        }
    }

}

function required_to() {

    let geshu = document.getElementsByClassName('partslist');
    if (geshu.length == 0) {
        parts_add(0, "gong");
    }
    if ($("#requi_y").is(":checked")) {
        $("#rep_ipc").show();
    } else {
        $("#rep_ipc").hide();
    }
    $("#mtrIpc").textbox();
    unit_data(0);
}

/* 重写方法，避开top值为空*/
function ShowWindowIframe1(opts) {
    var time_ = new Date().getTime();
    var url_ = opts.url; //"";
    opts = $.extend({}, opts, {url: url_});
    var win_key_ = 'win_0_' + time_;
    var GParam = getParentParam1_();
    var PWindow = GParam['PWindow'] || window;
    var OWindow = window;
    opts.param = opts.param || {};

    var caKey = encodeBase64_(opts.url + "@" + JSONstringify(opts.param));
    window.SWIN = window.SWIN || {};
    if (window.SWIN[caKey]) {
        if (window.SWIN[caKey].closed) {
            delete (window.SWIN[caKey]);
        } else {
            window.SWIN[caKey].blur();
            setTimeout(window.SWIN[caKey].focus(), 0);
            return;
        }
    }

    var w_ = $(PWindow.document).width() - 20;
    var h_ = $(PWindow.document).height();
    opts.width = typeof (opts.width) == 'string' && opts.width.indexOf('px') > -1 ? parseInt(opts.width.replace('px')) : opts.width;
    opts.height = typeof (opts.height) == 'string' && opts.height.indexOf('px') > -1 ? parseInt(opts.height.replace('px')) : opts.height;
    var width_ = typeof (opts.width) == 'string' && opts.width.indexOf('%') > -1 ? w_ * (parseInt(opts.width.replace('%')) / 100) : opts.width;
    var height_ = typeof (opts.height) == 'string' && opts.height.indexOf('%') > -1 ? h_ * (parseInt(opts.height.replace('%')) / 100) : opts.height;
    var l_ = (w_ - width_) / 2;
    var t_ = (h_ - height_) / 2;
    var SWindow = window.open(opts.url, win_key_, 'toolbar=no,scrollbars=yes,status=no,menubar=no,directories=no,resizable=no,height=' + height_ + ',width=' + width_ + ',left=' + l_ + ',top=' + t_);
    window.SWIN[caKey] = SWindow;

    opts.param = $.extend({}, {
        OWindow: OWindow,
        PWindow: PWindow,
        SWindow: SWindow,
        WIN_KEY: win_key_
    }, opts.param);
    window['WindowParam'] = window['WindowParam'] || {};
    window['WindowParam']['K' + win_key_] = opts.param;

    window.onunload = function () {
        CloseWindowIframe1(false);
    };

    var wkey = $("iframe[name='" + OWindow.name + "']", PWindow.document).data('id');
    var warry = PWindow.P_WINDOWS[wkey] || [];
    warry.push({WINDOW: SWindow});
    PWindow.P_WINDOWS[wkey] = warry;
    setTimeout(function () {
        try {
            $(SWindow.document).attr('title', i18n.t(opts.title) ? i18n.t(opts.title) : opts.title);
        } catch (e) {
            alert(e)
        }
    }, 200);
}

var gongka_list = [];

function execution_card() {
    var screenHeight = $(window).height();
    var scrolltop = $(document).scrollTop();
    var objTop = (screenHeight - 350) / 2 + scrolltop;

    $("#execution").window({
        resizable: false,
        modal: true,
        top: objTop + "px"
    });
    if ($("#source_file").textbox("getValue") == "") {
        $(".gongka_a_tr").remove();
        $(".gongka_div .add_jiahao").show();
        let gus = document.getElementsByClassName('gongka_d_tr');

        if (gus.length < 1) {
            gongka_popup_data(0);
        }

    } else {
        $(".gongka_div .add_jiahao").hide();
        $.ajax({
            type: "GET",
            url: "/api/v1/jc/all/get_card_by_no_and_type?cardNo="+$("#source_file").textbox("getValue")+"&cardType="+ $("#source_type").val(),
            // url: "/api/v1/jc/all/get_card_by_no_and_type?cardNo=19030095&cardType=NRC",
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (obj) {
                if (obj.code == 200) {
                    $(".gongka_a_tr").remove();
                    $(".gongka_d_tr").remove();
                    if (obj.data.length > 0) {
                        for (let i in obj.data) {
                            let a = " <div id=\"gongka_div_tr" + i + "\" style=\"height: 32px;\" class=\"gongka_a_tr\">\n" +
                                "            <div class=\"gongka_div\"  ><span id=\"type_" + i + "\">" + obj.data[i].jcType + "</span></div>\n" +
                                "            <div class=\"gongka_div\" style=\"width: 55%\"> <span id=\"no_" + i + "\">" + obj.data[i].jcNo + "</span><span id=\"id_" + i + "\" style=\"display: none\">" + obj.data[i].id + "</span></div>\n" +
                                "            <div class=\"gongka_div\" style=\"width: 10%\"><input style='    margin-top: 9px;' type='checkbox' id=\"gongka_di" + i + "\" onclick=\"delete_gongka_inpu(gongka_di" + i + ")\" > </div>\n" +
                                "        </div> ";
                            let b = $(a);
                            $("#gongka_div_tble").append(b);
                        }
                    } else {
                        alert("没有查询到工卡信息！");
                    }
                } else {
                    alert(data.msg);
                }
            },
            error: function () {
                window.alert("失败！");
            }
        });
    }
}

function colse_gongka() {
    let name = "";
    let rii = "";
    let rci = "";
    if ($("#source_file").textbox("getValue") != "") {
        if (gongka_list.length > 0) {
            for (let i in gongka_list) {
                if (name.length > 0) {
                    name += ",";
                }
                name += gongka_list[i].cardNo;
            }
        }
    } else {
        gongka_list = [];
        let gus = document.getElementsByClassName('gongka_d_tr');
        for (var i = 0; gus.length > i; i++) {
            let inde = gus[i].id.substring(13);
            if ($("#gongka_snn" + inde).val() == "") {
                alert("Original Card No.不能为空！");
                return
            }
            gongka_list.push({
                cardType: $("#type" + inde).val(),
                cardId: $("#nrcid" + inde).val(),
                cardNo: $("#gongka_snn" + inde).val(),
            });
            if (name.length > 0) {
                name += ",";
            }
            name += $("#gongka_snn" + inde).val();
            // RII有一个等于y就取RII
            if($("#rii" + inde).val() == 'y') {
                rii = "y";
                rci = "n";
            }
            // RII不等于y并且RCI有一个为y就取RCI
            if(rii != 'y' && $("#rci" + inde).val() == 'y') {
                rii = "n";
                rci = "y";
            }
        }
    }

    $.ajax({
        type: "POST",
        url: "/api/v1/tbm/nrc/nrcMtr/get_mtr_by_card_list",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(gongka_list),

        success: function (obj) {
            if (obj.code == 200) {
                if (obj.data.length > 0) {
                    $(".job_card").remove();
                    $("#requi_y").prop("checked", true);
                    let gus = document.getElementsByClassName('partslist').length;
                    for (let i in obj.data) {
                        parts_add((i + gus), "job_card");
                        if (obj.data[i].mrType == 1) {
                            $("#tools_y" + (i + gus)).prop("checked", true);
                        }
                        if (obj.data[i].prepareMaterials == "y") {
                            $("#beiliao_y" + (i + gus)).prop("checked", true);
                        }
                        $("#rep_ipc").show();
                        unit_data((i + gus));
                        $("#av" + (i + gus)).val(obj.data[i].pn);
                        $("#qty" + (i + gus)).val(obj.data[i].qty);
                        $("#mrDesc" + (i + gus)).val(obj.data[i].mrDesc);
                        $("#unit_xiala" + (i + gus)).combobox("setValue", obj.data[i].unit);
                        $("#av_itemnum" + (i + gus)).val( obj.data[i].itemNum);
                    }
                }
            } else if (data.msgData && data.msgData[0]) {
                alert(data.msgData[0]);
            } else {
                alert(data.msg);
            }
        },
        error: function () {
            window.alert("失败！");
        }
    });

    setRiiAndRci(rii, rci);
    $("#implement").textbox("setValue", name);
    $('#execution').window('close');
}

function setRiiAndRci(rii, rci) {
    if(rii && rci) {
        if(rii == "y") {
            $("#rii_y").prop("checked", true);
            rii_radio('rci_n')
        } else {
            $("#rii_n").prop("checked", true);
        }
        if(rci == "y") {
            $("#rci_y").prop("checked", true);
            rii_radio('rii_n')
        } else {
            $("#rci_n").prop("checked", true);
        }
    }
}

function delete_gongka_inpu(id, type, no, idto) {
    let inde = id.id.substring(9);
    if ($("#" + id.id).is(":checked")) {
        gongka_list.push({
            cardType: $("#type_" + inde).text(),
            cardId: $("#id_" + inde).text(),
            cardNo: $("#no_" + inde).text(),
        });
    } else {
        let index = "";
        for (let i in gongka_list) {
            if (gongka_list[i].cardId == $("#id_" + inde).text()) {
                index = i;
                break;
            }
        }
        gongka_list.splice(index, 1);
    }

}