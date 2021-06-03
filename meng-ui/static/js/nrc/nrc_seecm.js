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
    fengzhuang("repSn");
    $("#repSn").textbox("setValue", getLoginInfo().userId);
    $("#repName").textbox("setValue", getLoginInfo().userName);
    //$("#repidto").val(getLoginInfo().accountId);

    edit_data(getParentParam_().nrcid);

});
function addMr() {
    //获得NRC的ID
    let nrcId = nreseedata.id;
    let curWidth = $(window).width() .toString();
    let curheight = $(window).height().toString();
    let parameters = {
        "cardId": nrcId,
        "tdWorkType": "NRC"
    };
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: "addMr",
        param: parameters,
        url: "/views/mr/add_mr.shtml"
    });
}
function close_nrc() {
    let zhen = true;
    if (nreseedata.rii == "n" && nreseedata.rci == "n") {
        zhen = false;
    }
    var curWidth = ($(window).width()).toString();
    var curheight = $(window).height().toString();
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: "",
        param: {
            acid: nreseedata.ae,
            ac: nreseedata.acEng,
            nrcno: nreseedata.nrcNo,
            nrcid: nreseedata.id,
            nrcrii: zhen
        },
        url: "/views/nrc/close_nrc.shtml"
    });
}

var nreseedata = {};

function edit_data(id) {      //编辑
    $.ajax({
        type: "GET",
        url: "/api/v1/tbm/nrc/nrc/query_nrc_by_id?nrcId=" + id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            $("#nrcId").textbox("setValue", id);
            let nrc_data = data.data.nrcBase;
            nreseedata = data.data.nrcBase;
            $("#ac_id").textbox("setValue", nrc_data.ae);
            $("#repName").textbox("setValue", nrc_data.repName);
            $("#repSn").textbox("setValue", nrc_data.repSn);
            //$("#repidto").val(nrc_data.repId);

            $("#nrcNo").textbox("setValue", nrc_data.nrcNo);
            if (nrc_data.aeType == 1) {
                $("#feiji").prop("checked", true);
            } else {
                $("#faji").prop("checked", true);
            }
            if (nrc_data.nrcProcessStatus == 'APPROVED') {    //根据状态判断按钮的显示
                if (nrc_data.status == 1) {
                    $("#closenrc").show();
                }
            }
            ac_url();
            $("#acReg").combobox("setValue", nrc_data.acEng);
            $("#ac_type_input").textbox("setValue", nrc_data.modelEng);
            // $("#ac_type_input").textbox("",)
            $('#skill').combobox("setValue", nrc_data.skill);
            $("#zhanwei").textbox("setValue", nrc_data.stazone);
            $("#rep_date").datetimebox("setValue", nrc_data.repTime);
            if (nrc_data.defect != "n") {
                $("#waiguan_y").prop("checked", true);
            } else {
                $("#waiguan_n").prop("checked", true);
            }
            if (nrc_data.cm.isManual == 1) {
                $("#rengong").prop("checked", true);

            }
            for (var file in nrc_data.nrcAttachmentList) {
                type_file_sh(nrc_data.nrcAttachmentList[file]);
            }
            $("#expire_date").datetimebox("setValue", nrc_data.timeLimitDate);
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
            }
            $("#source_file").textbox("setValue", nrc_data.cm.sourceNo);
            $("#implement").textbox("setValue", data.data.nrcExeCardDisplay);

            $("#rectChn").val(nrc_data.rectChn);
            $("#rectEn").val(nrc_data.rectEn);
            $("#planningmhPerson").textbox("setValue", nrc_data.planningmhPerson);
            $("#planningmhHour").textbox("setValue", nrc_data.planningmhHour);
            if (nrc_data.feedbackTo == "y") {
                $("#fan_y").prop("checked", true);
            }

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
                    parts_add(i);
                    if (nrc_data.nrcMtrList[i].mrType == 1) {
                        $("#tools_y" + i).prop("checked", true);
                    }
                    if (nrc_data.nrcMtrList[i].prepareMaterials == "y") {
                        $("#beiliao_y" + i).prop("checked", true);
                    }
                    $("#av" + i).val(nrc_data.nrcMtrList[i].pn);
                    $("#qty" + i).val(nrc_data.nrcMtrList[i].qty);
                    $("#mrDesc" + i).val(nrc_data.nrcMtrList[i].mrDesc);
                    $("#unit_xiala" + i).combobox("setValue", nrc_data.nrcMtrList[i].unit);
                    $("#av_itemnum" + i).val("setValue", nrc_data.nrcMtrList[i].itemNum);
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
            if(nrc_data.nrcClose){
                $("#rectFinishChn").text(null_(nrc_data.nrcClose.rectFinishChn));
                $("#rectFinishEn").text(null_(nrc_data.nrcClose.rectFinishEn));

                cosl_data(nrc_data.nrcClose.componentCCList);

                $("#finishDate").text(null_(nrc_data.nrcClose.finishDate));
                $("#finishMh").text(null_(nrc_data.nrcClose.finishMh));
                $("#sta").text(null_(nrc_data.nrcClose.sta));
                $("#finishJobNo").text(null_(nrc_data.nrcClose.finishSn));
                $("#finishName").text(null_(nrc_data.nrcClose.finishName));
                $("#checkerJobNo").text(null_(nrc_data.nrcClose.checkerSn));
                $("#checkerName").text(null_(nrc_data.nrcClose.checkerName));
            }


        },
        error: function () {
            window.alert("查询失败！");
        }
    });
}

function null_(data) {
    if (data == null) {
        return "";
    }
    return data;
}

function cosl_data(data) {
    $(".close_sign").remove();
    for (var i in data) {
        let a = " <tr class='close_sign'>\n" +
            "                <td><span  >" + null_(data[i].offName) + "</span></td>\n" +
            "                <td><span >" + null_(data[i].offPosition) + "</span></td>\n" +
            "                <td><span  >" + null_(data[i].offPn) + "</span></td>\n" +
            "                <td><span >" + null_(data[i].offSn) + "</span></td>\n" +
            "                <td><span >" + null_(data[i].onPn) + "</span></td>\n" +
            "                <td><span  >" + null_(data[i].onSn) + "</span></td>\n" +
            "            </tr>";
        let html_row = $(a);
        $("#caihuan").append(html_row);

    }

}

/**获取当前时间*/
function getNowFormatDate() {
    var date = new Date();
    var dateSeparator = "-";
    var timeSeparator = ":";
    console.log("date.getMonth():" + date.getMonth());
    var month = formatDate(date.getMonth() + 1);
    console.log("month:" + month);
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


function Other_matters() {
    if ($("#other").is(":checked")) {
        $('#attentionDesc').removeAttr("disabled");
    } else {
        $("#attentionDesc").attr("disabled", "disabled");
    }
}


function rii_radio(value) {

    $("#" + value).prop("checked", true);

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


function xunhuan(i) {

    let a = "  <tr class='nrcMtrList' id=\"roe_tr_" + i + "\">\n" +
        "                        <td style=\"width: 153px\"> <input readonly=\"readonly\" class=\"easyui-textbox bujian\" id=\"pn" + i + "\" style=\"width: 85%\" type=\"text\" ><input id=\"pn_itemnum" + i + "\" style='display: none'><img alt=\"\" id=\"acBtn" + i + "\" class=\"fangdajin\" onClick=\"pn_data('pn'," + i + ")\" src=\"/img/search.png\"/></td>\n" +
        "                        <td style=\"width: 183px\"><input readonly=\"readonly\" class=\"easyui-textbox  bujian\" id=\"sn" + i + "\" style=\"width: 85%\" type=\"text\"></td>\n" +
        "                        <td colspan=\"4\" ><input readonly=\"readonly\" class=\"easyui-textbox bujian\" id=\"miaoshu" + i + "\" style=\"width: 85%\" type=\"text\"></td>\n" +
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

function delete_popup_flie(na) {
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
    let file = "  <tr class='poput_tr' id=\"popup_tr" + i + "\">\n" +
        "               <td > <input type=\"file\" id=\"popup_flie_" + i + "\" style=\"border: 1px solid #ccc\"></td>\n" +
        "               <td id=\"fujian_id" + i + "\">附件：<input id=\"cws" + i + "\"   type=\"checkbox\" value=\"1\" class=\"fujian\"><label for=\"cws" + i + "\">CWS</label>" +
        "<input id=\"gongka" + i + "\"  type=\"checkbox\" value=\"2\" class=\"fujian\"><label for=\"gongka" + i + "\">工卡</label>" +
        "<input id=\"shouce" + i + "\"   type=\"checkbox\" value=\"3\" class=\"fujian\"><label for=\"shouce" + i + "\">手册/图片</label> </td>\n" +
        "               <td style=\"width: 80px;\"></td>\n" +
        "           </tr>";
    let html_row = $(file);
    $("#popup_table").append(html_row);
}

function submit_popup_flie(id, name) {
    let fujia = "";
    var files = id.files;
    if (files.length > 0) {
        if ($("#" + name.id + " [class='fujian']:checked").length > 0) {
            $.each($("#" + name.id + " [class='fujian']:checked"), function () {
                if (fujia.length > 1) {
                    fujia += ",";
                }
                fujia += $(this).val();
            });
            var formData = new FormData();
            formData.append("file", files[0]);
            formData.append("category", "nrcNnuedWorkSheet");
            formData.append("type", fujia);
            formData.append("pId", $("#nrcId").textbox("getValue"));

            $.ajax({
                type: "POST",
                url: "/api/v1/tbm/nrc/attachment/upload",
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    if (data.code == 200) {
                        alert("上传成功！");
                    }
                    else {
                        alert("上传失败！" + data.msg);
                    }

                },
                error: function (data) {
                    if (data.msg == "success") {
                        alert("上传成功！");
                    } else {
                        alert("上传失败！");
                    }
                }
            });
        } else {
            alert("请选择附件类型！")
        }

    } else {
        alert("请选择文件！")
    }
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

function parts_add(i) {
    let a = " <tr class='partslist' id=\"roe_tr_" + i + "\">\n" +
        "                                    <td style=\"width: 148px\"><input  id=\"tools_y" + i + "\"  type=\"checkbox\" disabled=\"disabled\"><label for=\"tools_y" + i + "\">YES</label></td>\n" +
        "                                    <td><input class= \"beiliao\" id=\"av" + i + "\"  style=\"width: 85%\" readonly=\"readonly\"/><input id=\"av_itemnum" + i + "\" style='display: none'>\n" +
        "                                        </td>\n" +
        "                                    <td><input class=\"beiliao\" style=\"width: 85%\" type=\"text\" id=\"qty" + i + "\" readonly=\"readonly\"></td>\n" +
        "                                    <td><input class=\"beiliao easyui-combobox\" style=\"width: 85%\" type=\"text\" id=\"unit_xiala" + i + "\" readonly=\"readonly\"></td>\n" +
        "                                    <td><input class=\"beiliao\" style=\"width: 85%\"  type=\"text\" id=\"mrDesc" + i + "\" readonly=\"readonly\"></td>\n" +
        "                                    <td><input  id=\"beiliao_y" + i + "\"  type=\"checkbox\" disabled=\"disabled\"><label for=\"beiliao_y" + i + "\" >YES</label></td>\n" +
        "                                    <td>\n" +

        "                                    </td>\n" +
        "                                </tr>";
    let html_row = $(a);
    $("#parts_list").append(html_row);
    $("#unit_xiala" + i).combobox();
}

function pn_data(name, ind) {
    $.pnSelect({
        success: function (data) {
            console.log(data);
            if (name == "av") {
                $("#av" + ind).val(data.partno);
                $("#av_itemnum" + ind).val(data.itemnum);
            } else {
                $("#pn" + ind).textbox("setValue", data.partno);
                $("#pn_itemnum" + ind).val(data.itemnum);
            }

        }
    })
}


function addjiahao() {
    if (document.getElementsByClassName('partslist').length > 0) {
        let gus = document.getElementsByClassName('partslist');
        let inde = gus[gus.length - 1].id.substring(7);
        parts_add(parseInt(inde) + 1);
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
        parts_add(0);
    }
    if ($("#requi_y").is(":checked")) {
        $("#rep_ipc").show();
    } else {
        $("#rep_ipc").hide();
    }
}


function type_file_sh(data) {
    let file = " <div class='filepopu' id=\"type_file_show" + data.wsAttachment.pkid + "\"  style=\"line-height: 30px;width: 100%;    height: 30px;border-bottom: 1px solid #ccc;\" >\n" +
        "                            <div style=\"width: 80%;float: left;text-align: left;\"><a style=\"color:red;font-size: 14px;margin-right: 25px;\" onclick=\"downFile(" + data.wsAttachment.pkid + "," + data.wsAttachment.pkid + ")\">" + data.wsAttachment.orgName + "</a>\n" +
        "                                附件：<input id=\"cws" + data.wsAttachment.pkid + "\" disabled=\"disabled\"  type=\"checkbox\" value=\"1\" class=\"fujian\"><label for=\"cws" + data.wsAttachment.pkid + "\">CWS</label>\n" +
        "                                <input id=\"gongka" + data.wsAttachment.pkid + "\"  disabled=\"disabled\" type=\"checkbox\" value=\"2\" class=\"fujian\"><label for=\"gongka" + data.wsAttachment.pkid + "\">工卡</label>\n" +
        "                                <input id=\"shouce" + data.wsAttachment.pkid + "\" disabled=\"disabled\"  type=\"checkbox\" value=\"3\" class=\"fujian\"><label for=\"shouce" + data.wsAttachment.pkid + "\">手册/图片</label>\n" +
        "                            </div>\n" +
        "                        </div>";
    let html_row = $(file);
    $("#type_file").append(html_row);
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