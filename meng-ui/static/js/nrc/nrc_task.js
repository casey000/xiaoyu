$(function () {
    $('#dd').window('close');
    $("#task_delete").window("close");
    required_to();
    $("#task_nrcNo").textbox("setValue", getParentParam_().nrcno);
    $("#task_eng").textbox("setValue", getParentParam_().aceng);

    task_data();
    if (getParentParam_().type == "view") {
        $(".disabled").attr("disabled", "disabled");
        $(".zhezhao").show();
        $(".add_jiahao ").hide()
    }

});

function close_dialog() {  //关闭上传附件弹窗
    $('#dd').window('close');
}

//下载模版
function download_template() {
    //获得地址
    let currPath = window.document.location.href;
    let docPath = window.document.location.pathname;
    let index = currPath.indexOf(docPath);
    let serverPath = currPath.substring(0, index);
    window.location.href = serverPath + "/views/nrc/export/NRC_CONTINUED_WORK_SHEET.xlsx";
}


function Popup_file() {
    if ($("#task_Id").textbox("getValue") != "") {
        var screenHeight = $(window).height();
        var scrolltop = $(document).scrollTop();
        var objTop = (screenHeight - 400) / 2 + scrolltop;

        $("#dd").window({
            resizable: false,
            modal: true,
            top: objTop + "px"
        });


        let geshu = document.getElementsByClassName('poput_tr');
        if (geshu.length >= 1) {
            return
        }
        popup_add_file(0);
    } else {
        alert("请先保存，再上传附件！")
    }


}

function popup_add_file(i) {
    let a = "  <tr class='poput_tr' id=\"popup_tr" + i + "\">\n" +
        "               <td > <input type=\"file\" id=\"popup_flie_" + i + "\" style=\"border: 1px solid #ccc\" ></td>\n" +
        "               <td >附件：<input id=\"cws" + i + "\"value=\"1\" class=\"fujian\"  type=\"checkbox\"><label for=\"cws" + i + "\">CWS</label>" +
        "<input id=\"gongka" + i + "\" class=\"fujian\" value=\"2\" type=\"checkbox\"><label for=\"gongka" + i + "\">工卡</label>" +
        "<input id=\"shouce" + i + "\" class=\"fujian\" value=\"3\" type=\"checkbox\"><label for=\"shouce" + i + "\">手册/图片</label> </td>\n" +
        "               <td style=\"width: 80px;\"><div class='file_duihao' onclick=\"submit_popup_flie(popup_flie_" + i + ", popup_tr" + i + ")\">✔</div><div class=\"jianhao icon-delete\" onclick=\"delete_popup_flie(popup_tr" + i + ")\"></div></td>\n" +
        "           </tr>";
    let b = $(a);
    $("#popup_table").append(b);
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
            formData.append("category", "nrcTaskNuedWorkSheet");
            formData.append("type", fujia);
            formData.append("pId", $("#task_Id").textbox("getValue"));

            $.ajax({
                type: "POST",
                url: "/api/v1/tbm/nrc/attachment/upload",
                data: formData,
                processData: false,
                contentType: false,
                success: function (obj) {

                    if (obj.code == 200) {
                        id.value = "";
                        $("#" + name.id + " .fujian").prop("checked", false);
                        type_file_sh(obj.data);
                        delete_popup_flie(name);
                        alert("上传成功！");
                    } else {
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

var params = getParentParam_();
var lisr_file = 0;

function add_file() {

    let a = "  <div id=\"div_task" + lisr_file + "\" style=\"position: relative;height: 22px;margin-bottom: 10px;margin-top: 10px\" class=\"task_Interval\">\n" +
        "                <input class=\"easyui-textbox disabled\" id=\"interval_text" + lisr_file + "\" >\n" +
        "                <input class=\"easyui-combobox disabled\" id=\"interval_select" + lisr_file + "\"  style=\"width: 100px\" />\n" +
        "                <div class=\"add_jiahao \" onclick=\"add_file()\" style=\"position: absolute;right: 39px;top: 3px\"></div>\n" +
        "                <div class=\"jianhao icon-delete \" onclick=\"delete_atta_input_flie(div_task" + lisr_file + ")\" style=\"float: right;margin-right: 15px\"></div>\n" +
        "            </div>";
    let b = $(a);

    $("#interval_td").append(b);
    $("#interval_text" + lisr_file).textbox();
    var ac_data = {};
    if (getParentParam_().aeType == 1) {
        ac_data = [{id: "", text: ""}, {id: "FH", text: "FH"}, {id: "FC", text: "FC"}, {id: "DAYS", text: "DAYS"}, {
            id: "A",
            text: "A"
        }, {id: "C", text: "C"},]
    } else {
        ac_data = [{id: "", text: ""}, {id: "FH", text: "FH"}, {id: "FC", text: "FC"}, {
            id: "DAYS",
            text: "DAYS"
        }]
    }
    $("#interval_select" + lisr_file).combobox({
            valueField: 'id',
            textField: 'text',
            data: ac_data,
        }
    );
    lisr_file++;
}

function delete_atta_input_flie(val) {
    let geshu = document.getElementsByClassName('task_Interval');
    if (geshu.length == 1) {
        return
    }
    let newP = $(val);
    if (newP.length > 0) {
        newP.remove();
    }
}

function required_to() {
    if (document.getElementsByClassName('nrcMtrList').length == 0) {
        xunhuan(0);
    }
    if ($("#requi_y").is(":checked")) {


        $("#rep_ipc").show();
        $("#mtrIpc").textbox();
        $("#unit_xiala0").combobox();
    } else {
        $("#rep_ipc").hide();
    }
}


function xunhuan(i) {
    let a = " <tr class='nrcMtrList' id=\"roe_tr_" + i + "\">\n" +
        "                                    <td style=\"width: 148px\"><input class='disabled' id=\"tools_y" + i + "\"  type=\"checkbox\" onclick=\"qian_yes('beiliao_y" + i + "')\"><label for=\"tools_y" + i + "\">YES</label></td>\n" +
        "                                    <td><input class= \"beiliao disabled\"  readonly=\"readonly\"  id=\"av" + i + "\"  style=\"width: 85%\"/><input id=\"av_itemnum" + i + "\" style='display: none'><input id=\"av_description" + i + "\" style='display: none'>\n" +
        "                                        <img alt=\"\" id=\"acBtn" + i + "\" class=\"fangdajin\" onClick=\"pn_data(" + i + ")\" src=\"/img/search.png\"/></td>\n" +
        "                                    <td><input class=\"beiliao disabled\" style=\"width: 85%\" type=\"text\" id=\"qty" + i + "\"></td>\n" +
        "                                    <td><input class=\"beiliao easyui-combobox disabled\" style=\"width: 85%\" type=\"text\" id=\"unit_xiala" + i + "\"></td>\n" +
        "                                    <td><input class=\"beiliao disabled\" readonly=\"readonly\" style=\"width: 85%\" type=\"text\" id=\"mrDesc" + i + "\"></td>\n" +
        "                                    <td><input id=\"beiliao_y" + i + "\"  type=\"checkbox\" onclick=\"hou_yes('tools_y" + i + "')\" class='disabled'><label for=\"beiliao_y" + i + "\" >YES</label></td>\n" +
        "                                    <td>\n" +
        "                                        <div class=\"jianhao icon-delete\" onclick=\"delete_tr(roe_tr_" + i + ")\"></div>\n" +
        "                                    </td>\n" +
        "                                </tr>";
    let b = $(a);

    $("#addnrc_table_list").append(b);
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
        //UNIT库存单位从查找件号后自动赋值
        // unit_da = getDataDictionary("tools_n");
    }
    $("#unit_xiala" + i).combobox(
        {
            valueField: 'TEXT',
            textField: 'VALUE',
            data: unit_da,

        }
    );
}


function pn_data(ind) {
    $.pnSelect({
        success: function (data) {
            console.log(data);
            $("#av" + ind).val(data.partno);
            $("#av_itemnum" + ind).val(data.itemnum);
            $("#mrDesc" + ind).val(data.description);
            let unit_da = [];
            $.each(data.allunit.split(","), function (i, v) {
                unit_da[i] = {
                    "TEXT": v,
                    "VALUE": v
                }
            });
            $("#unit_xiala" + ind).combobox({
                valueField: 'TEXT',
                textField: 'TEXT',
                data: unit_da,
            });
            $("#unit_xiala" + ind).combobox("setValue", data.issueunit);
        }
    })
}

function addjiahao() {
    if (document.getElementsByClassName('nrcMtrList').length > 0) {
        let gus = document.getElementsByClassName('nrcMtrList');
        let inde = gus[gus.length - 1].id.substring(7);
        xunhuan(parseInt(inde) + 1);
    }
}

function delete_tr(na) {
    //console.log(id);
    if (document.getElementsByClassName('nrcMtrList').length > 1) {
        var newP = $(na);
        if (newP.length > 0) {
            newP.remove();
        }
    }
}

function task_save(ur_l, name) {
    let data = $("#nrc_add_form").serializeObject();
    for (let key in data) {
        if (key == "") {
            delete data[key];
        }
    }
    if (data.mtrYn == "y") {

        let geshu = document.getElementsByClassName('nrcMtrList');
        let nrcmtrList = [];
        for (var i = 0; i < geshu.length; i++) {
            if ($("#tools_y" + i).is(":checked")) {
                var tools = 1;
            } else {
                var tools = 0;
            }
            if ($("#beiliao_y" + i).is(":checked")) {
                var pareMat = "y";
            } else {
                var pareMat = "n";
            }
            nrcmtrList.push({
                mrType: tools,
                pn: $("#av" + i).val(),
                qty: $("#qty" + i).val(),
                unit: $("#unit_xiala" + i).combobox("getValue"),
                mrDesc: $("#mrDesc" + i).val(),
                prepareMaterials: pareMat,
                type: "NRC",
                itemNum: $("#av_itemnum" + i).val(),

            })
        }

        data.nrcMtrList = nrcmtrList;
    }
    let geshu_t = document.getElementsByClassName('task_Interval');
    let nrcTaskIntervalList = [];
    for (var i = 0; i < geshu_t.length; i++) {
        nrcTaskIntervalList.push({
            intValue: $("#interval_text" + i).textbox("getValue"),
            intUnit: $("#interval_select" + i).combobox("getValue"),
        })
    }
    data.nrcTaskIntervalList = nrcTaskIntervalList;
    data.nrcId = getParentParam_().nrcid;
    data.modelEng = getParentParam_().modelEng;
    data.acEng = getParentParam_().aceng;
    if (getParentParam_().aeType == 1) {
        data.acId = getParentParam_().acid;
    } else {
        data.engId = getParentParam_().acid;
    }


    data.id = $("#task_Id").textbox("getValue");
    data.revNo = $("#revNo").textbox("getValue");
    $.ajax({
        type: "POST",
        url: ur_l,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (obj) {
            if (obj.msg == "success") {
                if (name == "save") {
                    alert("保存成功！");
                    $("#revNo").textbox("setValue", obj.data.revNo);
                } else {
                    alert("提交成功！");
                    window.close();
                }
                $("#task_Id").textbox("setValue", obj.data.id);
                var parnm = getParentParam_();
                parnm.OWindow.nrcTask_No(obj.data.nrcTaskNo);
            } else {
                alert(obj.msgData[0]);
            }

        },
        error: function () {
            window.alert("保存失败！");
        }
    });
}

function submit_task() {
    if ($("#task_descChn").val() == "") {
        alert("CHINESE不能为空!");
        return
    }
    if ($("#task_descEn").val() == "") {
        alert("CHINESE不能为空!");
        return
    }
    let geshu_t = document.getElementsByClassName('task_Interval');
    for (var i = 0; i < geshu_t.length; i++) {

        if ($("#interval_text" + i).textbox("getValue") == "") {
            alert("Interval不能为空!");
            return
        }
        if ($("#interval_select" + i).combobox("getValue") == 0) {
            alert("Interval下拉不能为空!");
            return
        }
    }
    if (geshu_t.length > 1) {
        if (!$("#First").is(":checked") && !$("#last").is(":checked")) {
            alert("First/last必选勾选一个!");
            return
        }
    }
    if (!$("#requi_y").is(":checked") && !$("#requi_n").is(":checked")) {
        alert("REQUIRED MATERIAL/SPEC.TOOLE必选勾选一个!");
        return
    }

    if ($("#requi_y").is(":checked")) {

        let geshu = document.getElementsByClassName('nrcMtrList');
        for (var i = 0; i < geshu.length; i++) {
            if ($("#av" + i).val() == "") {
                alert("P/N不能为空!");
                return
            }
            if ($("#qty" + i).val() == "") {
                alert("QTY不能为空!");
                return
            }
            if ($("#unit_xiala" + i).combobox("getValue") == "") {
                alert("Unit不能为空!");
                return
            }
            if ($("#mrDesc" + i).val() == "") {
                alert("DESCRIPTION不能为空!");
                return
            }
        }
    }

    task_save("/api/v1/tbm/nrc/nrcTask/submit_nrc_task", "sub");
}

function task_data() {          //编辑
    var url = "/api/v1/tbm/nrc/nrcTask/query_task_by_nrc_id?nrcId=" + getParentParam_().nrcid;
    if (getParentParam_().aeType == 9) {
        url = "/api/v1/tbm/nrc/nrcTask/query_task_by_id?nrcTaskId=" + getParentParam_().taskid;
    }
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {

            if (data.data == null) {
                add_file();
                $("#task_status").textbox("setValue", "EDITING");

            } else {
                $(".nrcMtrList").remove();
                $(".task_Interval").remove();
                let nrc_data = data.data;

                $("#task_Id").textbox("setValue", nrc_data.id);
                $("#revNo").textbox("setValue", nrc_data.revNo);
                $("#task_status").textbox("setValue", nrc_data.status);

                for (var file in nrc_data.nrcAttachmentList) {
                    type_file_sh(nrc_data.nrcAttachmentList[file]);
                }
                $("#task_descChn").val(nrc_data.executeChn);
                $("#task_descEn").val(nrc_data.executeEn);
                for (let a in nrc_data.nrcTaskIntervalList) {
                    add_file();
                    $("#interval_text" + a).textbox("setValue", nrc_data.nrcTaskIntervalList[a].intValue),
                        $("#interval_select" + a).combobox("setValue", nrc_data.nrcTaskIntervalList[a].intUnit);
                }
                if (nrc_data.firstLast == 1) {
                    $("#First").prop("checked", true);
                } else {
                    $("#last").prop("checked", true);
                }


                if (nrc_data.mtrYn == "y") {

                    $("#requi_y").prop("checked", true);
                    required_to();

                    $("#mtrIpc").textbox("setValue", nrc_data.mtrIpc);
                    $(".nrcMtrList").remove();
                    for (let i in nrc_data.nrcMtrList) {
                        xunhuan(i);
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
                        $("#av_itemnum" + i).val("setValue", nrc_data.nrcMtrList[i].itemNum);

                    }

                } else {
                    $("#requi_n").prop("checked", true);
                }

            }

        },
        error: function () {
            window.alert("保存失败！");
        }
    });

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

function task_delete_popup() {
    $("#task_delete").window("open");
}

function nrc_task_delete() {
    if ($("#task_Id").textbox("getValue") == "") {
        $("#task_delete").window("close");
    } else {
        let id = $("#task_Id").textbox("getValue");
        $.ajax({
            type: "POST",
            url: "/api/v1/tbm/nrc/nrcTask/delete_nrc_task_by_id",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify({
                id: id,
                reason: $("#bohui_text").val(),
            }),
            dataType: "json",
            success: function (data) {
                console.log(data);
                if (data.msg == "success") {
                    alert("删除成功！");
                    window.close();
                } else if (data.msgData && data.msgData[0]) {
                    alert(data.msgData[0]);
                } else {
                    alert(data.msg);
                }
            },
            error: function () {
                window.alert("删除失败！");
            }
        });
    }

}