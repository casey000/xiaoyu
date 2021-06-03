$(function () {
    document.getElementById('testUrlByIdAndType').style.display = "none";
    document.getElementById('testDataMigration').style.display = "none";
    _opts['resize'] = {width: '100%', height: '350'};
    edit_data(getParentParam_().nrcid);
    $("#approval").window("close");
    if (getParentParam_().unCurAssignee == "see") {
        $(".hide_anbut").hide();
        // 配置工作流程历史查询
        $('#body_1').tabs({
            onSelect: function (title, index) {
            }
        });
    } else {
        $('#tab02').remove();
    }

});

//测试数据迁移
function testShowDataMigration() {
    document.getElementById('testDataMigration').style.display = "block";
}

function testGetDataMigration() {
    let num = $("#migrationNum").textbox("getValue");
    let nrcNo = $("#migrationNrcNo").textbox("getValue");
    if (!num) {
        window.alert("数量不能为空");
        return;
    }
    if (!nrcNo) {
        nrcNo = "null";
    }
    $.ajax({
        type: "GET",
        url: "/api/v1/tbm/nrc/nrc/migrate?num=" + num + "&nrcNo=" + nrcNo,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (200 === data.code) {
                window.alert("成功！");
                document.getElementById('testDataMigration').style.display = "none";
            } else if (data.msgData && data.msgData[0]) {
                window.alert(data.msgData[0]);
            } else if (data.msg) {
                window.alert(data.msg);
            }
        },
        error: function () {
            window.alert("数据插入失败！");
        }
    });
    document.getElementById('testDataMigration').style.display = "none";
}

//测试根据ID和类型查询相关文档
function testShowUrlByIdAndType() {
    document.getElementById('testUrlByIdAndType').style.display = "block";
}

function testGetUrlByIdAndType() {
    let id = $("#getUrlByIdAndType_id").textbox("getValue");
    let type = $("#getUrlByIdAndType_type").textbox("getValue");
    $.ajax({
        type: "GET",
        url: "/api/v1/tbm/nrc/nrc/getDocUrlByIdAndType?id=" + id + "&type=" + type,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (200 === data.code) {
                window.alert(data.data);
            } else if (data.msgData && data.msgData[0]) {
                window.alert(data.msgData[0]);
            } else if (data.msg) {
                window.alert(data.msg);
            }
        },
        error: function () {
            window.alert("数据查询失败！");
        }
    });
    document.getElementById('testUrlByIdAndType').style.display = "none";
}

function download_pdf() {
    let nrcId = nreseedata.id;
    let url = "/api/v1/tbm/nrc/nrc/export_pdf";
    let con = "<form id='_f0_rm' method='GET' action='" + url + "'>" +
        "<input class=\"beiliao\" value=\"" + nrcId + "\"  type=\"text\" name=\"nrcId\" >" +
        "</form>";
    $("#_f0_rm").remove();
    $("body").append(con);

    $("#_f0_rm").submit();
}


function download_file() {
    let nrcId = nreseedata.id;

    $.ajax({
        url: basePath + "/api/v1/tbm/nrc/nrc/export_file",
        type: 'get',
        cache: false,
        data: {nrcId},
        dataType: "json",
        success: function (rs) {
            if(rs.code == 200) {
                let fileList = rs.data;

                P.$.dialog({
                    id: "附件列表下载",
                    title: "附件列表下载",
                    top: '30%',
                    width: '600px',
                    height: '300px',
                    data: {
                        'fileList': fileList
                    },
                    content: 'url:' + basePath + "/views/defect/worklog/upload_file_view.shtml"
                });
            } else {
                P.$.dialog.alert(rs.msg);
            }
        }
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
            ata:nreseedata.ata,
            acid: nreseedata.ae,
            ac: nreseedata.acEng,
            acType : nreseedata.aeType,
            nrcno: nreseedata.nrcNo,
            nrcid: nreseedata.id,
            nrcrii: zhen,
            descChn: nreseedata.descChn,
            descEn: nreseedata.descEn,
            company:mroCompany,
        },
        url: "/views/nrc/close_nrc.shtml"
    });
}

function skill_data(data) {
    if (data == 1) {
        return "ME"
    } else if (data == 2) {
        return "AV"
    } else {
        return "STR"
    }
}

function itemCat_data(data) {
    if (data == 1) {
        return "STRUCTURE"
    } else if (data == 2) {
        return "MINOR DEFECT"
    } else if (data == 3) {
        return "CHK/SVC"
    } else if (data == 5) {
        return "ACCESS";
    } else if (data == 6) {
        return "COMPONENT";
    } else {
        return "CM"
    }
}

function fenlei_data(data) {
    if (data == 1) {
        return "运行飞机串件"
    } else if (data == 2) {
        return "机组操作"
    } else if (data == 3) {
        return "影响地服推行"
    } else if (data == 4) {
        return "影响机组飞行品质"
    } else if (data == 5) {
        return "液体渗漏"
    } else if (data == 6) {
        return "10天（20FC/30FH）内纠正"
    } else if (data == 8) {
        return "货舱装载系统缺陷"
    } else if (data == 9) {
        return "下货舱门开关缺陷"
    } else if (data == 10) {
        return "烤箱烧水杯故障"
    } else if (data == 11) {
        return "厕所排放系统缺陷"
    } else if (data == 7) {
        return "其他"
    } else {
        return ""
    }
}

function click_repeat() {
    if ($("#repeat_y").is(":checked")) {
        $('.nrc_task_no').removeAttr('disabled');
    } else {
        $(".nrc_task_no").attr('disabled', 'false');
    }
}

function null_(data) {
    if (data == null) {
        return "";
    }
    return data;
}

function initDelayListTab(list, divId) {
    var _tab = $('#' + divId);
    if (list) {
        var _html = '<table id=":id" procInstId=":pId" title=":title" class="flow_history" style="height: 300px;width: 100%"></table>';
        $.each(list, function (i, o) {
            var _title = '延期申请';
            if (o.delayNum) {
                _title = '第:num次延期'.replace(":num", o.delayNum);
            }
            _tab.append(_html.replace(':id', ('delatHis_' + o.id))
                .replace(':pId', o.processId)
                .replace(':title', _title)
            );
        })

    }
}

var nreseedata = {};

function edit_data(id) {    //编辑页面绑定数据
    $("#nrcId").textbox("setValue", id);
    $.ajax({
        type: "GET",
        url: "/api/v1/tbm/nrc/nrc/query_nrc_by_id?nrcId=" + id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            //对报错提示
            if (200 !== data.code) {
                if (data.msgData && data.msgData[0]) {
                    window.alert(data.msgData[0]);
                    return;
                } else if (data.msg) {
                    window.alert(data.msg);
                    return;
                }
            }
            let nrc_data = data.data.nrcBase;
            nreseedata = data.data.nrcBase;
            mroCompany = data.data.mroCompany;
            console.log(data);
            $("#nrcProcessStatus").textbox("setValue", nrc_data.nrcProcessStatus);
            if (nrc_data.nrcProcessStatus != 'APPROVING' || getParentParam_().unCurAssignee == 'hide') {
                $('.hide_anbut').remove();
            }
            // if (nrc_data.nrcProcessStatus != 'APPROVED' || (getLoginInfo && getLoginInfo().accountId != '1')) {
            //     $('.calculate_nrc').remove();
            // }

            // 记录主流程ID
            $('#historyDg').attr('procInstId', nrc_data.nrcProcessId);
            // 整理延期流程历史
            initDelayListTab(nrc_data.nrcDelayList, 'tab02');
            $(".addnrc_table_hide").css("visibility", "");
            $(".addnrc_table_hide").show();
            $("#nrcNo").text(nrc_data.nrcNo);
            if (nrc_data.aeType == 1) {
                $("#feiji").prop("checked", true);
            } else {
                $("#faji").prop("checked", true);
            }
            add_file_show(id);
            view_feedBack_Attr(false);
            for (var file in nrc_data.nrcAttachmentList) {
                type_file_sh(nrc_data.nrcAttachmentList[file]);
            }
            $("#acReg").text(nrc_data.acEng);
            $("#ac_type_input").text(nrc_data.modelEng),
                // $("#ac_type_input").textbox("",)
                $('#skill').text(skill_data(nrc_data.skill));

            $("#stazone").text(null_(nrc_data.stazone));

            if (nrc_data.nrcProcessStatus == 'APPROVED') {    //根据状态判断按钮的显示
                $("#see_pdf").show();
                // 只对已经关闭的NRC才会显示下载附件的按纽
                // OPEN状态值为1, CLOSE状态值为3
                if(nrc_data.status=='3'){
                    $("#download_file").show();
                }
                if (nrc_data.status == 1) {
                    $("#closenrc").show();
                }
                if (nrc_data.postSap != "back") {
                    $("#sap_nrc").show();
                    if (nrc_data.status == 1) {
                        $("#calculate_nrc").show();
                    }
                }
            }
            $("#Original").text(data.data.nrcCardDisplay);
            $("#repSn").text(nrc_data.repSn);
            $("#repName").text(nrc_data.repName);
            $("#rep_date").text(nrc_data.repTime);
            $('#iten_cat').text(itemCat_data(nrc_data.itemCat));
            if (nrc_data.defect != "n") {
                $("#waiguan_y").prop("checked", true);
            } else {
                $("#waiguan_n").prop("checked", true);
            }
            $("#descChn").text(nrc_data.descChn);
            $("#descEn").text(nrc_data.descEn);
            if (nrc_data.isHasEwis == "y") {
                $("#ewis_y").prop("checked", true);
                ewis_yes(nrc_data.nrcEwisList);
            } else {
                $("#ewis_n").prop("checked", true);
                ewis_no()
            }
            if (nrc_data.isHasOil == "y") {
                $("#louyou_y").prop("checked", true);
                oil_yes(nrc_data.nrcOilList);
            } else {
                $("#louyou_n").prop("checked", true);
                oil_no()
            }
            $("#ata").text(nrc_data.ata);
            if (nrc_data.rii == "y") {
                $("#rii_y").prop("checked", true);

            } else {
                $("#rii_n").prop("checked", true);
            }
            if (nrc_data.rci == "y") {
                $("#rci_y").prop("checked", true);

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
            } else if (nrc_data.feedbackAircrew == "n") {
                $("#jizu_n").prop("checked", true);
            }
            $("#rectChn").text(nrc_data.rectChn);
            $("#rectEn").text(nrc_data.rectEn);
            $("#planningmhPerson").text(nrc_data.planningmhPerson);
            $("#planningmhHour").text(nrc_data.planningmhHour);
            if (nrc_data.feedbackTo == "y") {
                $("#feedback").prop("checked", true);
            }
            if (nrc_data.mtrYn == "y") {

                $("#requi_y").prop("checked", true);
                for (let i in nrc_data.nrcMtrList) {
                    xunhuan(i);
                    if (nrc_data.nrcMtrList[i].mrType == 1) {
                        $("#tools_y" + i).prop("checked", true);
                    }
                    if (nrc_data.nrcMtrList[i].prepareMaterials == "y") {
                        $("#beiliao_y" + i).prop("checked", true);
                    }
                    $("#ac" + i).text(nrc_data.nrcMtrList[i].pn);
                    $("#qty" + i).text(nrc_data.nrcMtrList[i].qty);
                    $("#mrDesc" + i).text(nrc_data.nrcMtrList[i].mrDesc);
                    $("#unit_xiala" + i).text(nrc_data.nrcMtrList[i].unit);
                }

            } else {
                $("#requi_n").prop("checked", true);
            }
            xunhuan_to(nrc_data.nrcExtraMtrList);
            required_to();
            $("#mtrIpc").text(nrc_data.mtrIpc||'');
            if (nrc_data.attentionType != null) {
                let attentionType = nrc_data.attentionType.split(",");
                let int = 1;
                // $('#approval').dialog('open');
                $.each($('#zhuyi_input .input_checkbox'), function () {
                    for (let i in attentionType) {
                        if (attentionType[i] == int) {
                            $(this).prop("checked", true);
                        }
                    }
                    int++;
                });
            }
            $("#attentionDesc").val(nrc_data.attentionDesc);
            $("#nrcTaskNo").textbox("setValue", data.data.nrcTaskNo);

            if (nrc_data.isSuspending == "y") {
                $("#Suspending_y").prop("checked", true);

                if (nrc_data.isrepeat == 1) {
                    $("#repeat_y").prop("checked", true);
                } else if (nrc_data.isrepeat == 0) {
                    $("#repeat_n").prop("checked", true);
                }
                $("#hoReasonOther").val(nrc_data.suspending.hoReasonOther);
                let hoReason = nrc_data.suspending.hoReason.split(",");
                let intto = 1;
                // $('#approval').dialog('open');
                $.each($('#reason_input .input_checkbox'), function () {
                    for (let i in hoReason) {
                        if (hoReason[i] == intto) {
                            $(this).prop("checked", true);
                        }
                    }
                    intto++;
                });

                $("#fenlei").text(fenlei_data(nrc_data.suspending.runCategory));
                if (nrc_data.suspending.runType == 1) {
                    $("#yunxin_y").prop("checked", true);
                } else {
                    $("#yunxin_n").prop("checked", true);
                }
                if (nrc_data.suspending.timeLimitType == 1) {
                    $("#shixian_y").prop("checked", true);

                    if (nrc_data.suspending.manualOrTechnical == 1) {
                        $("#shouche").prop("checked", true);
                    } else if (nrc_data.suspending.manualOrTechnical == 2) {
                        $("#jishu").prop("checked", true);
                    }
                    $("#fh").text(null_(nrc_data.suspending.fh));
                    $("#fc").text(null_(nrc_data.suspending.fc));
                    $("#fd").text(null_(nrc_data.suspending.fd));
                    $("#days").text(null_(nrc_data.suspending.days));
                    if (nrc_data.suspending.hardTimeType == 2) {
                        $("#next_c").prop("checked", true);
                    } else if (nrc_data.suspending.hardTimeType == 3) {
                        $("#songxiu").prop("checked", true);
                    }

                    if (nrc_data.suspending.firstLast == 1) {
                        $("#First").prop("checked", true);
                    } else if (nrc_data.suspending.firstLast == 2) {
                        $("#last").prop("checked", true);
                    }


                } else {
                    $("#shixian_n").prop("checked", true);
                    if (nrc_data.suspending.adviseDoTimeType == 1) {
                        $("#ruan_9").prop("checked", true);
                    } else if (nrc_data.suspending.adviseDoTimeType == 2) {
                        $("#ruan_12").prop("checked", true);
                    } else if (nrc_data.suspending.adviseDoTimeType == 3) {
                        $("#ruan_18").prop("checked", true);
                    } else if (nrc_data.suspending.adviseDoTimeType == 4) {
                        $("#ruan_next").prop("checked", true);
                    } else if (nrc_data.suspending.adviseDoTimeType == 5) {
                        $("#ruan_huan").prop("checked", true);
                    } else if (nrc_data.suspending.adviseDoTimeType == 6) {
                        $("#ruan_song").prop("checked", true);
                    }

                }
                shixian();

                $("#pn").textbox("setValue", nrc_data.suspending.pn);
                $("#sn").textbox("setValue", nrc_data.suspending.sn);
            } else {
                $("#Suspending_n").prop("checked", true);
            }
            Suspending_show();
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
            // 通过顶级工单类型识别是否客改包

            // $('#MroNrcKey').hide();
            // $('#MroNrcValue').hide();
            // if(data.data.parentWorkorder.type== "PTF_TASK"||getParentParam_().wwbz=="X"){
            //     $("#MroNrcValue").text(nrc_data.mroBusinessNo);
            //     $('#MroNrcKey').show();
            //     $('#MroNrcValue').show();
            // }
            if(nrc_data.mroBusinessNo){
                $("#MroNrcValue").text(nrc_data.mroBusinessNo);
            }


        },
        error: function () {
            window.alert("查询失败！");
        }
    });
}

function cosl_data(data) {
    $(".close_sign").remove();
    for (var i in data) {
        let name = null_(data[i].offName) || null_(data[i].onName);
        let position = null_(data[i].offPosition) || null_(data[i].onPosition);
        let a = " <tr class='close_sign'>\n" +
            "                <td><span  >" + name + "</span></td>\n" +
            "                <td><span >" + position + "</span></td>\n" +
            "                <td><span  >" + null_(data[i].offPn) + "</span></td>\n" +
            "                <td><span >" + null_(data[i].offSn) + "</span></td>\n" +
            "                <td><span >" + null_(data[i].onPn) + "</span></td>\n" +
            "                <td><span  >" + null_(data[i].onSn) + "</span></td>\n" +
            "            </tr>";
        let html_row = $(a);
        $("#caihuan").append(html_row);

    }

}

function shixian() {
    if ($("#shixian_y").is(":checked")) {
        $("#yin_shixian").show();
        $("#ruan_shixian").hide();

    } else {
        $("#ruan_shixian").show();
        $("#yin_shixian").hide();

    }
}

function xunhuan(i) {

    let a = " <tr class='nrcMtrList' id=\"roe_tr_" + i + "\">\n" +
        "                                    <td style=\"width: 148px\"><input disabled=\"disabled\"  id=\"tools_y" + i + "\"  type=\"checkbox\" onclick=\"qian_yes('beiliao_y" + i + "')\"><label for=\"tools_y" + i + "\">YES</label></td>\n" +
        "                                    <td><span id=\"ac" + i + "\"></span>\n" +
        "                                       </td>\n" +
        "                                    <td><span id=\"qty" + i + "\"></span></td>\n" +
        "                                    <td><span id=\"unit_xiala" + i + "\"></span></td>\n" +
        "                                    <td><span id=\"mrDesc" + i + "\"></span></td>\n" +
        "                                    <td><input disabled=\"disabled\" id=\"beiliao_y" + i + "\"  type=\"checkbox\" onclick=\"hou_yes('tools_y" + i + "')\"><label for=\"beiliao_y" + i + "\" >YES</label></td>\n" +
        "                                    <td>\n" +
        "                                        \n" +
        "                                    </td>\n" +
        "                                </tr>";
    let html_row = $(a);
    $("#addnrc_table_list").append(html_row);
}

function xunhuan_to(obj) {
    for (var i in obj) {
        let mrType = "";
        let prepareMaterials = "";
        if (obj[i].mrType == 1) {
            mrType = "Y";
        } else {
            mrType = "N";
        }
        if (obj[i].prepareMaterials == "y") {
            prepareMaterials = "Y";
        } else {
            prepareMaterials = "N";
        }
        let a = " <tr class='nrcMtrList' >\n" +
            "                                    <td >" + mrType + "</td>\n" +
            "                                    <td><span >" + obj[i].pn + "</span>\n" +
            "                                       </td>\n" +
            "                                    <td><span >" + obj[i].qty + "</span></td>\n" +
            "                                    <td><span >" + obj[i].unit + "</span></td>\n" +
            "                                    <td><span >" + obj[i].mrDesc + "</span></td>\n" +
            "                                    <td><span>" + prepareMaterials + "</span></td>\n" +
            "                                </tr>";
        let html_row = $(a);
        $("#addnrc_table_list_to").append(html_row);
    }


}

function required_to() {
    if ($("#requi_y").is(":checked")) {
        $("#rep_ipc").show();
    } else {
        $("#rep_ipc").hide();
    }
}

function Suspending_show() {
    if ($("#Suspending_y").is(":checked")) {
        $(".Suspending").show();
    } else {
        $(".Suspending").hide();


    }
}

function ewis_yes(obj) {
    $("#ewis").EWIS("view", obj);
}

function ewis_no() {
    $("#ewis").EWIS("destroy");
}

function oil_yes(obj) {
    $("#oilSpill").oilSpill("view", obj);
}

function oil_no() {
    $("#oilSpill").oilSpill("destroy");
}

function trun_back_nrc() {
    var nrcId = $("#nrcId").textbox("getValue");
    $.ajax({
        type: "get",
        url: "/api/v1/tbm/nrc/nrc/trun_back_nrc?nrcId=" + nrcId,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            resultMsg(data);
        },
        error: function (data) {

        }
    });
}

function calculate_nrc() {
    var nrcId = $("#nrcId").textbox("getValue");
    $.ajax({
        type: "get",
        url: "/api/v1/tbm/nrc/nrc/calculate_nrc?nrcId=" + nrcId,
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            resultMsg(data);
        },
        error: function (data) {
            window.alert("计算失败！");
        }
    });
}

function approval_popup() {

    var screenHeight = $(window).height();
    var scrolltop = $(document).scrollTop();
    var objTop = (screenHeight - 350) / 2 + scrolltop;

    $("#approval").window({
        resizable: false,
        modal: true,
        top: objTop + "px"
    });

}

// 交互后返回信息提示处理
function resultMsg(data) {
    console.log(data);
    if (!data) {
        return lert('the "data" is null.');
    }
    if (data.code == 200) {
        alert("成功！");
        close_win();
    } else {
        if (data.msgData && data.msgData[0]) {
            alert(data.msgData[0]);
        } else if (data.msg) {
            alert(data.msg);
        }
    }

}

var params = getParentParam_();

function close_win() {
    parent && parent.window.colsa_window && parent.window.colsa_window();
    window.close();
    parent && parent.window.params_window && parent.window.params_window();
    params.OWindow.Refresh();
}

function bohui_text_data() {
    if ($("#bohui_text").val() == "") {
        alert("驳回信息必填！");
        return
    }
    $.ajax({
        type: "POST",
        url: "/api/v1/tbm/nrc/nrc/reject_nrc_checking",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            id: $("#nrcId").textbox("getValue"),
            reason: $("#bohui_text").val(),
        }),
        dataType: "json",
        success: function (data) {
            resultMsg(data);
        },
        error: function (data) {
            window.alert("驳回失败！");
        }
    });

}

function nrc_pass() {
    $.ajax({
        type: "POST",
        url: "/api/v1/tbm/nrc/nrc/pass_nrc",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            id: $("#nrcId").textbox("getValue"),
            reason: "",
        }),
        dataType: "json",
        success: function (data) {
            resultMsg(data);
        },
        error: function () {
            window.alert("提交失败！");
        }
    });
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

function add_file_show(id) {
    $("#attach_file").empty();
    InitFuncCodeRequest_({
        data: {
            SOURCE_ID: id,
            CATEGORY: "nrcAttachment",
            FunctionCode: 'ATTACHMENT_RSPL_GET'
        },
        successCallBack: function (jdata) {
            for (var ind in jdata.data) {
                let file = " <div id=\"input_flie_show" + jdata.data[ind].PKID + "\" class=\"atta_input_fliecss\" style=\"line-height: 30px;width: 100%;    height: 30px;border-bottom: 1px solid #ccc;\">\n" +
                    "                            <div style=\"width: 60%;text-align: left;\"><a style=\"color:red;font-size: 14px\" onclick=\"downFile(" + jdata.data[ind].PKID + "," + jdata.data[ind].PKID + ")\">" + jdata.data[ind].ORG_NAME + "</a></div>\n" +
                    "\n" +
                    "                        </div>";
                let html_row = $(file);
                $("#attach_file").append(html_row);
            }

        }
    });
}
function view_feedBack_Attr(isShowWindow) {
    var nrcId = $("#nrcId").textbox("getValue");
    $("#uploadList").empty();
    InitFuncCodeRequest_({
        data: {
            SOURCE_ID: nrcId,
            CATEGORY: 'nrcCloseAttachment',
            FunctionCode: 'ATTACHMENT_RSPL_GET'
        },
        successCallBack: function (jdata) {
            var feedBackAttachValue = "完工附件查看" + "(" + jdata.data.length + ")";
            $("#feedBackAttach").text(feedBackAttachValue);
            if (!isShowWindow){
                return;
            }
            if (jdata.data.length == 0) {
                MsgAlert({content: "暂未上传附件", type: 'error'});
                return;
            }
            for (var i = 0; i < jdata.data.length; i++) {
                var trHTML = '<tr><td class="td5"><a style="min-height: 35px;line-height: 35px;display: block;padding-left: 10px" target="_blank" onclick="downFile(' + jdata.data[i].PKID + ',' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a></td></tr>';
                $("#uploadList").append(trHTML);//在table最后面添加一行
            }
            $('#checkUpload').window("resize", {top: $(document).scrollTop() + ($(window).height() - 250) * 0.5});
            $('#checkUpload').window('open');
        }
    });
}