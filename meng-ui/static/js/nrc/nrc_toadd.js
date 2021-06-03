$(function () {
    $(".addnrc_table_hide").hide();
    $('#dd').window('close');
    $('#forhelp').window('close');
    $('#approval').window('close');
    $('#submit_add').window('close');
    $('#submit_checking').window('close');
    $('#delete_popup').window('close');
    $('#gongka_popup').window('close');
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
    $('#iten_cat').combobox({
        valueField: 'id',
        textField: 'text',
        data: [{id: 0, text: "== Please Select =="}, {id: 1, text: "STRUCTURE"}, {id: 2, text: "MINOR DEFECT"}, {
            id: 3,
            text: "CHK/SVC"
        }, {
            id: 5,
            text: "ACCESS"
        }, {
            id: 6,
            text: "COMPONENT"
        }],

    });

    console.log(GetRequestString().nrcid);
    ataSelectInit("hideTips");
    if (!!getParentParam_().nrcid  || !!GetRequestString().nrcid) {
        var id = getParentParam_().nrcid || GetRequestString().nrcid;
        edit_data(id);

    } else {
        if (getParentParam_().parentWorkId) {
            aircraftEngineOptions();
        } else {
            if(getParentParam_().operation === 'PendToNrc'){
                var _url = "/api/v1/defect/defect_base_info/getToNrcInfo?id="+getParentParam_().defectId;

                $.ajax({
                    url: _url,
                    type: "GET",
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        console.info(data)
                        $("#feiji").prop("checked", true);
                        // $('input[name = "aeType"]').attr("readonly", 'readonly');
                        $('#acBtn').css('display','none');
                        // $('.fadongji').css('display','none');
                        var  original = data.data.defectNo +( data.data.tlbTechLog ? ',' + data.data.tlbTechLog.tlbNo:'');
                        $("#original").textbox("setValue", original);
                        $("#repSn").textbox("setValue", data.data.reporterSn);
                        $("#repName").textbox("setValue", data.data.reporterName);
                        $("#ac_type_input").textbox("setValue", data.data.minorModel);
                        $("#acReg").textbox("setValue", data.data.acReg);
                        $("#descChn").val(data.data.faultReportChn);
                        $("#descEn").val(data.data.faultReportEng);
                        $('#acId').val(data.data.acId || '');
                        $('#ac_id').textbox('setValue', data.data.acId);

                        $("#acNo").val(data.data.acReg || '');
                        $("#acReg").textbox('setValue', data.data.acReg);
                        pendNrc_list = [
                            {
                                cardType: 'DEFECT',
                                cardNo: data.data.defectNo,
                                cardId: data.data.id,
                            }
                        ];
                        if(data.data.tlbTechLog){
                            var newObj = {
                                cardType: 'TLB',
                                cardNo: data.data.tlbTechLog.tlbNo,
                                cardId: data.data.tlbTechLog.tlbId,
                            };
                            pendNrc_list.push(newObj)
                        }

                        // console.info(new Date(data.data.cardDate))
                        $("#rep_date").datetimebox("setValue",   formatterDate(data.data.cardDate));
                        aircraftEngineOptions()



                    }
                });

            }else{
                ac_url();
                $("#repSn").textbox("setValue", getLoginInfo().accountNumber);
                $("#repName").textbox("setValue", getLoginInfo().userName);
            }

            //$("#repidto").val(getLoginInfo().accountId);

        }

        xunhuan(list_arr);
        Suspending_show();
        required_to();


    }
    add_atta_input_flie();
    $('#skill').combobox("setValue", 0);
    $('#iten_cat').combobox("setValue", 0);

    // $("#ewis").EWIS("create")


    fengzhuang("authId_to");
    fengzhuang("repSn");
    fengzhuang("rectPlanUpdatedSn");
    fengzhuang("forhelp_name");

});

var gongka_list = [];
var pendNrc_list = [];

var params = getParentParam_();

//NRC的表单数据对象
var nrcFormData;
var isClickSave = true;

var isKegaiNoZero = false;
var isKegaiPackage = false;
function aircraftEngineOptions() {
    $("#feiji").prop("checked", true);
    $('#acId').val(getParentParam_().ae);
    $("#acNo").val(getParentParam_().acEng);
    ac_url();
    $('#ac_id').textbox('setValue', getParentParam_().ae);
    $("#acReg").textbox("setValue", getParentParam_().acEng);
    $("#ac_type_input").textbox("setValue", getParentParam_().modelEng);
    $("#ac_zhe").show();

    if("K" == getParentParam_().revtp||"X" == getParentParam_().wwbz){
        $("#waiguan_n").prop("checked", true);
    }
    // if("K" == getParentParam_().revtp||"X" == getParentParam_().wwbz){
    //     $("#waiguan_n").prop("checked", true);
    // }else {
    //     $('#MroNrcKey').hide();
    //     $('#MroNrcValue').hide();
    // }
}

//因获得表单数据时，有些数据属性为disabled，因此序列化获取无效，必须特殊取值
function getNrcFormData() {
    $("#nrc_add_form").find(":disabled").addClass("disabled_temp");//给form下所有disabled的表单对象添加class标记
    $("#nrc_add_form").find(".disabled_temp").attr("disabled",false);//获取数据前临时去掉disabled属性
    nrcFormData = $("#nrc_add_form").serializeObject();
    $("#nrc_add_form").find(".disabled_temp").attr("disabled",true);//获取数据后再将添加回disabled属性
    nrcFormData.repName = $("#repName").textbox("getValue");
    nrcFormData.rectPlanUpdatedName = $("#rectPlanUpdatedName").textbox("getValue");
    nrcFormData.rectPlanUpdatedSn = $("#rectPlanUpdatedSn").textbox("getValue");
    if (nrcFormData.mtrIpc == null || nrcFormData.mtrIpc == "null"){
        nrcFormData.mtrIpc = '';
    }
    return nrcFormData;
}

function edit_data(id) {    //编辑页面绑定数据
    var optype = getParentParam_().optype || '';
    $.ajax({
        type: "GET",
        url: "/api/v1/tbm/nrc/nrc/query_nrc_by_id?nrcId=" + id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            $("#nrcId").textbox("setValue", id);
            let nrc_data = data.data.nrcBase;
            let nrcProcessStatus = nrc_data.nrcProcessStatus;
            if (nrc_data.postSap == 'back' || optype == 'review') {
                $(".save,.approving,.checking").remove();
                nrcProcessStatus = "CHECKING";
                //隐藏单节点待办页面的提交
                parent.window.$("#canSubmit").remove();
            }
            $('#acId').val(nrc_data.ae || '');
            $("#acNo").val(nrc_data.acEng || '');
            $("#ac_id").textbox("setValue", nrc_data.ae);
            $("#model").html(nrc_data.model||"");
            $("#repName").textbox("setValue", nrc_data.repName);
            $("#repSn").textbox("setValue", nrc_data.repSn);
            //$("#rectPlanUpdatedId").val(nrc_data.rectPlanUpdatedId);
            $("#rectPlanUpdatedSn").textbox("setValue", nrc_data.rectPlanUpdatedSn);
            $("#rectPlanUpdatedName").textbox("setValue", nrc_data.rectPlanUpdatedName);
            $("#nrcProcessStatus").textbox("setValue", nrc_data.nrcProcessStatus);
            $("#postSap").textbox("setValue", nrc_data.postSap);
            $("#active").textbox("setValue", data.data.nrcTaskStatus);
            $("#original").textbox("setValue", data.data.nrcCardDisplay);
            gongka_list = nrc_data.nrcCardList;
            if (nrcProcessStatus == "CHECKING") {

                $(".checking").show();
                $(".save").hide();
                $(".approving").hide();
                $(".addnrc_table_hide").css("visibility", "");
                $(".addnrc_table_hide").show();
            }

            $("#nrcNo").textbox("setValue", nrc_data.nrcNo);
            if (nrc_data.aeType == 1) {
                $("#feiji").prop("checked", true);
            } else {
                $("#faji").prop("checked", true);
            }
            ac_url();
            $("#acReg").combobox("setValue", nrc_data.acEng);
            $("#ac_type_input").textbox("setValue", nrc_data.modelEng);
            gongka_list = nrc_data.nrcCardList;
            // $("#ac_type_input").textbox("",)
            $('#skill').combobox("setValue", nrc_data.skill);
            $("#stazone").textbox("setValue", nrc_data.stazone);
            //$("#repidto").val(nrc_data.repId);
            $("#rep_date").datetimebox("setValue", nrc_data.repTime);
            $('#iten_cat').combobox("setValue", nrc_data.itemCat);
            if (nrc_data.defect != "n") {
                $("#waiguan_y").prop("checked", true);
            } else {
                $("#waiguan_n").prop("checked", true);
            }
            $("#descChn").val(nrc_data.descChn);
            $("#descEn").val(nrc_data.descEn);
            if (nrc_data.isHasEwis == "y") {
                $("#ewis").EWIS("setData", nrc_data.nrcEwisList);
                $("#ewis_y").prop("checked", true);
                ewis_yes();
            } else if (nrc_data.isHasEwis == "n") {
                $("#ewis_n").prop("checked", true);
                ewis_no()
            }
            if (nrc_data.isHasOil == "y") {
                $("#ewis").oilSpill("setData", nrc_data.nrcOilList);
                $("#louyou_y").prop("checked", true);
                oil_yes();
            } else if (nrc_data.isHasOil == "n") {
                $("#louyou_n").prop("checked", true);
                oil_no()
            }
            // $('#ata').textbox({
            //     onChange: function (n, o) {
            //         if (n.length == 4) {
            //
            //             checkDm(n)
            //         }
            //     }
            // });
            ataSelectInit("hideTips");
            $("#ata").textbox("setValue", nrc_data.ata);
            if (nrc_data.rii == "y") {
                $("#rii_y").prop("checked", true);
                rii_radio('rci_n')
            } else if (nrc_data.rii == "n") {
                $("#rii_n").prop("checked", true);
            }
            if (nrc_data.rci == "y") {
                $("#rci_y").prop("checked", true);
                rii_radio('rii_n')
            } else if (nrc_data.rci == "n") {
                $("#rci_n").prop("checked", true);
            }
            if (nrc_data.dm == "y") {
                $("#dm_y").prop("checked", true);
            } else if (nrc_data.dm == "n") {
                $("#dm_n").prop("checked", true);
            }
            if (nrc_data.feedbackAircrew == "y") {
                $("#jizu_y").prop("checked", true);
            } else if (nrc_data.feedbackAircrew == "n") {
                $("#jizu_n").prop("checked", true);
            }
            $("#rectChn").val(nrc_data.rectChn);
            $("#rectEn").val(nrc_data.rectEn);
            $("#planningmhPerson").textbox("setValue", nrc_data.planningmhPerson);
            $("#planningmhHour").textbox("setValue", nrc_data.planningmhHour);
            add_file_show(id);
            if (nrc_data.feedbackTo == "y") {
                $("#feedback").prop("checked", true);
            }
            for (var file in nrc_data.nrcAttachmentList) {
                type_file_sh(nrc_data.nrcAttachmentList[file]);
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
                    unit_data(i);
                    $("#av" + i).val(nrc_data.nrcMtrList[i].pn);
                    $("#qty" + i).val(nrc_data.nrcMtrList[i].qty);
                    $("#mrDesc" + i).val(nrc_data.nrcMtrList[i].mrDesc);
                    $("#unit_xiala" + i).combobox("setValue", nrc_data.nrcMtrList[i].unit);
                    $("#av_itemnum" + i).val(nrc_data.nrcMtrList[i].itemNum);

                }
                if (optype == 'review') {
                    // NRC修订，航材不可修改
                    // $('#addnrc_table_list').find('input').attr('disabled', 'disabled');
                    // $('#rep_ipc').find('.jianhao,.fangdajin,.textbox-addon,.add_jiahao').remove();
                }
            } else if (nrc_data.mtrYn == "n") {
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
            $("#nrcTaskNo").textbox("setValue", data.data.nrcTaskNo);
            if (nrc_data.isSuspending == "y") {
                $("#Suspending_y").prop("checked", true);
                if (nrc_data.isrepeat == 1) {
                    $("#repeat_y").prop("checked", true);
                    click_repeat();
                } else if (nrc_data.isrepeat == 0) {
                    $("#repeat_n").prop("checked", true);
                }


                $("#hoReasonOther").val(nrc_data.suspending.hoReasonOther);
                if (nrc_data.suspending.hoReason) {
                    let hoReason = nrc_data.suspending.hoReason.split(",");
                    let intto = 1;
                    // $('#approval').dialog('open');
                    $.each($('#reason_input .input_checkbox'), function () {
                        for (let i in hoReason) {
                            if (hoReason[i] == intto) {
                                $(this).prop("checked", true);
                                if (hoReason[i] == 5) {
                                    Other_matters(2);
                                }
                            }
                        }
                        intto++;
                    });
                }

                if (nrc_data.suspending.runType == 1) {
                    $("#yunxin_y").prop("checked", true);
                } else if (nrc_data.suspending.runType == 0) {
                    $("#yunxin_n").prop("checked", true);
                }
                if (nrc_data.suspending.timeLimitType == 1) {
                    $("#shixian_y").prop("checked", true);

                    if (nrc_data.suspending.manualOrTechnical == 1) {
                        $("#shouche").prop("checked", true);
                    } else if (nrc_data.suspending.manualOrTechnical == 2) {
                        $("#jishu").prop("checked", true);
                    }
                    $("#fh").textbox("setValue", nrc_data.suspending.fh);
                    $("#fc").textbox("setValue", nrc_data.suspending.fc);
                    $("#days").textbox("setValue", nrc_data.suspending.days);
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


                } else if (nrc_data.suspending.timeLimitType == 2) {
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
                $("#pn").val(nrc_data.suspending.pn);
                $("#sn").val(nrc_data.suspending.sn);
                if (optype == 'review' && nrc_data.nrcDelayList && nrc_data.nrcDelayList.length > 0) {
                    // NRC修订，已经延期的推迟不可修改
                    $('.suspending_review').find('input,.textbox-addon').attr('disabled', 'disabled');
                    $('.suspending_review').find('.jianhao,.fangdajin,.textbox-addon,.add_jiahao').remove();
                    // 不可选
                    $('#fenlei').combobox({disabled: true});
                }

            } else if (nrc_data.isSuspending == "n") {
                $("#Suspending_n").prop("checked", true);
                $("#repeat_n").prop("checked", true);
            }
            if ($("#nrcTaskNo").textbox("getValue") != "") {
                $("#repeat_y").prop("checked", true);
            }
            if (data.data.nrcTaskStatus == "TERMINATION") {
                $("#repeat_n").prop("checked", true);
            }

            if (nrc_data.suspending != null) {
                Suspending_show(nrc_data.suspending.runCategory);
            } else {
                Suspending_show();
            }


            if(data.data.isSuspending && nrc_data.mroBusinessNo){
                isKegaiNoZero = true;
            }
            // 从NRC列表进入时，通过顶级工单类型识别是否客改包
            // if(data.data.parentWorkorder&&data.data.parentWorkorder.type== "PTF_TASK"||getParentParam_().wwbz=="X"){
            //     $("#mroBusinessNo").textbox("setValue", nrc_data.mroBusinessNo);
            //     setkgNrcDefaultData(data.data.nrcBase.acEng,data.data.mroCompany);
            //     isKegaiPackage = true;
            // }else{
            //     $('#MroNrcKey').hide();
            //     $('#MroNrcValue').hide();
            // }
            $("#mroBusinessNo").textbox("setValue", nrc_data.mroBusinessNo);
            if(data.data.parentWorkorder&&data.data.parentWorkorder.type== "PTF_TASK"||getParentParam_().wwbz=="X"){
                // $("#mroBusinessNo").textbox("setValue", nrc_data.mroBusinessNo);
                setkgNrcDefaultData(data.data.nrcBase.acEng,data.data.mroCompany);
                isKegaiPackage = true;
            }

        },
        error: function () {
            window.alert("查询失败！");
        }
    });
}

function checkDm(val) {
    InitGatewayRequest_({
        type: "post",
        async: false,
        data: {
            ata:val,
            applyType: $("input[name=aeType]:checked").val() == 1 ? 'APL' : 'ENG',
            // acReg:$("#ac").textbox("getValue"),
            applyId:$('#acId').val()
            // model: global_data.model,
            // minorModel: global_data.minorModel
        },
        path: "/maintenanceProduction/maintainLimit/selectDmLimit",
        successCallBack: function (jdata) {
            if (jdata.success == true) {
                if(jdata.obj.isDm && jdata.obj.isDm == 1){
                    $("#dm_y").prop("checked", "checked");
                    $("input[name='dm']").attr('disabled',true);
                    if(!params.id){
                        rii_radio('rii_n');
                        $("#rci_y").prop("checked", "checked");
                    }
                }else{
                    $("input[name='dm']").attr('disabled',false);

                }
            } else {
                MsgAlert({content: jdata.errorMessage, type: 'error'});
            }
        }
    });
}
function input_checkbox(val) {
    let name_bal = "";
    $.each($(val + ' input:checkbox:checked'), function () {
        if (name_bal.length > 0) {
            name_bal += ",";
        }
        name_bal += $(this).val();
    });
    return name_bal;
}


function fangan(url, name) {
    if ($("#rectPlanUpdatedSn").textbox("getValue") == "") {
        alert("请先选择方案制定人");
        return
    }
    isClickSave = false;
    if(getParentParam_().operation === 'PendToNrc'){
        url = '/api/v1/defect/defect_base_info/to_nrc';
    }
    form_data(url, name);
}

function form_data(url, name) {        //save保存
    if(getParentParam_().operation === 'PendToNrc' && isClickSave){
        var errorThrown = '推迟转NRC，只能提交不能保存';
        alert(errorThrown);
        return
    }
    isClickSave = true;
    $("#button_zhe").show();
    let reaso = input_checkbox("#reason_input");
    let name_bal = input_checkbox("#zhuyi_input");
    let nrcbase = {
        nrcCardDisplay: "",
        nrcTaskNo: $("#nrcTaskNo").textbox("getValue")
    };
    //此时已经将一些NRC的信息赋值（含name）
    let data = this.getNrcFormData();
    for(let key in data){
        if(key.indexOf('treatmentMethod') != '-1'){
            var cc = key
            delete data[cc];
        }
    }

    data.modelEng = $("#ac_type_input").textbox("getValue");
    if (params.parentWorkId) {
        data.ae = $("#ac_id").val();
        data.aeType = $("input[name=aeType]:checked").val();
        data.parentWorkId = params.parentWorkId;
        data.acEng = $("#acReg").textbox("getValue");
    }
    if ($("#repeat_y").is(":checked")) {
        data.isrepeat = 1;
    } else if ($("#repeat_n").is(":checked")) {
        data.isrepeat = 0;
    }
    //data.repId = $("#repidto").val();
    //data.rectPlanUpdatedId = $("#rectPlanUpdatedJobNo").val();
    data.assignee = $("#assigneeid").val();
    if (data.isHasEwis == "y") {
        data.nrcEwisList = $("#ewis").EWIS("getData");
        if(!data.nrcEwisList){
            $("#button_zhe").hide();
            return
        }
    }
    if (data.isHasOil == "y") {
        data.nrcOilList = $("#oilSpill").oilSpill("getData");
    }
    if ($("#other").is(":checked")) {
        data.attentionDesc = $("#attentionDesc").val();
    }
    data.nrcNo = $("#nrcNo").textbox("getValue");

    // if("K" == getParentParam_().revtp||"X"==getParentParam_().wwbz){
    //     data.mroBusinessNo = $("#mroBusinessNo").textbox("getValue");
    // }

    data.mroBusinessNo = $("#mroBusinessNo").textbox("getValue");

    let Suspending = {
        hoReason: reaso,
        hoReasonOther: $("#hoReasonOther").val(),
        runCategory: data.runCategory,
        timeLimitType: data.timeLimitType,
        manualOrTechnical: data.manualOrTechnical,
        fh: data.fh,
        fc: data.fc,
        days: data.days,
        hardTimeType: data.hardTimeType,
        firstLast: data.firstLast,
        adviseDoTimeType: data.adviseDoTimeType,
        pn: $("#pn").val(),
        sn: $("#sn").val()
    };
    if ($("#yunxin_y").is(":checked")) {
        Suspending.runType = 1;
    } else if ($("#yunxin_n").is(":checked")) {
        Suspending.runType = 0;
    }
    data.attentionType = name_bal;
    data.suspending = Suspending;
    data.planningmhHour = parseFloat(data.planningmhHour);
    if (data.mtrYn == "y") {

        let geshu = document.getElementsByClassName('nrcMtrList');
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
    // nrcbase.acEng = $("#acReg").combobox("getValue");
    for (let key in data) {
        if (key == "") {
            delete data[key];
        }
        for (let a in Suspending) {
            if (key == a) {

                delete data[key];
            }
        }

    }

    data.nrcCardList = gongka_list;
    if(getParentParam_().operation === 'PendToNrc'){
        data.nrcCardList = pendNrc_list;

    }
    nrcbase.nrcBase = data;
    if (data.aeType ==1){
        var acReg = $("#acReg").combobox('getValue');
        $("#EWIS").EWIS("checkData",acReg);
    }
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(nrcbase),
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.code == 200) {
                if (name == "save") {
                    alert("保存成功！");
                    window.location.href = "/views/nrc/nrc_toAdd.shtml?nrcid=" + data.data;
                } else {
                    alert("提交成功！");
                    parent && parent.window.colsa_window && parent.window.colsa_window();
                    if(getParentParam_().operation === 'PendToNrc'){
                        pendNrc_list.forEach(function (v,i) {
                            if(v.cardType == 'TLB'){
                                getParentParam_().OWindow.MsgAlert({content: '请填写排故措施关闭故障', type: 'info'});
                            }
                        });
                        getParentParam_().OWindow.location.reload();
                    }
                    window.close();
                }
                $("#nrcId").textbox("setValue", data.data);
                parent && parent.window.params_window && parent.window.params_window();
                params.OWindow.Refresh();
            } else if (data.msgData && data.msgData[0]) {
                alert(data.msgData[0]);
            } else {
                alert(data.msg);
            }
            $("#button_zhe").hide();
        },
        error: function () {
            $("#button_zhe").hide();
            window.alert("保存失败！");
        }
    });
    // window.close();
    // params.OWindow.nrc_edit(299967);

}

var regex = /^(?:19|20)[0-9][0-9]-(?:(?:0[1-9])|(?:1[0-2]))-(?:(?:[0-2][1-9])|(?:[1-3][0-1])) (?:(?:[0-2][0-3])|(?:[0-1][0-9])):[0-5][0-9]:[0-5][0-9]$/;

function shijian() {

    console.log($("#ewis").EWIS("getData"));
    console.log("---------------------------------");
    console.log($("#oilSpill").oilSpill("getData"))
}

function download_template() {
    //获得地址
    let currPath = window.document.location.href;
    let docPath = window.document.location.pathname;
    let index = currPath.indexOf(docPath);
    let serverPath = currPath.substring(0, index);
    window.location.href = serverPath + "/views/nrc/export/NRC_CONTINUED_WORK_SHEET.xlsx";
}

function submit_nrc(url, name) {           //提交数据验证
    let optype = getParentParam_().optype || '';
    let data = this.getNrcFormData();
    let nrcProcessStatus = data.nrcProcessStatus;
    if (data.postSap == 'back') {
        url = '/api/v1/tbm/nrc/nrc/submit_back_nrc';
    } else if (optype == 'review') {
        url = '/api/v1/tbm/nrc/nrc/review';
    }
    if(getParentParam_().operation === 'PendToNrc'){
        url = '/api/v1/defect/defect_base_info/to_nrc';
    }
    if (data.acEng == "") {
        alert("飞机或者发动机不能为空");
        return
    }

    if (data.skill == 0) {
        alert("skill不能为== Please Select ==");
        return
    }

    if (data.repSn == "") {
        alert("开单人不能为空");
        return
    }
    if ($("#original").textbox("getValue") == "") {
        alert("Original Card No不能为空");
        return
    }
    // if (data.authId == "") {
    //     alert("方案制定人不能为空");
    //     return
    // }
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
    if (data.itemCat == 0) {
        alert("ITEM CAT不能为== Please Select ==");
        return
    }
    if (data.defect == "") {
        alert("外观是否可见必须勾选一项！");
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
    if (data.isHasEwis == "") {
        alert("EWIS必须勾选一项！");
        return
    }
    if (data.isHasOil == "") {
        alert("油液渗漏必须勾选一项！");
        return
    }
    if (nrcProcessStatus == "CHECKING" || nrcProcessStatus == "APPROVED") {
        let name_bal = input_checkbox("#zhuyi_input");
        data.attentionType = name_bal;
        if(!data.attentionType){
            alert("注意事项必填");
            return
        }
        if (data.ata == "") {
            alert("ATA不能为空！");
            return
        } else {
            let pattern = /^\d{4}$/;
            if (!pattern.test(data.ata)) {
                alert("只能输入4位数字！");
                return
            }
        }

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
        if (data.rectChn == "") {
            alert("纠正方案或工作任务描述 CHINESE不能为空！");
            return
        }
        if (data.rectEn == "") {
            alert("纠正方案或工作任务描述 ENGLISH不能为空！");
            return
        }
        if (data.planningmhPerson == "") {
            alert('人工不能为空');
            return
        } else {
            let pattern = /^[1-9]\d*$/g;
            if(!isKegaiNoZero){
                pattern = /^[0-9]\d*$/g;
            }
            if (!pattern.test(data.planningmhPerson)) {
                $("#planningmhPerson").textbox("setValue", "");
                alert('人工只能输入整数');
                return
            }

        }
        if (data.planningmhHour == "") {
            alert('小时不能为空');
            return
        } else {
            let pattern = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
            if (!pattern.test(data.planningmhHour)) {
                $("#planningmhHour").textbox("setValue", "");
                alert('小时只能输入数字');
                return
            }
            if (!(isKegaiPackage && !isKegaiNoZero)){
                if (data.planningmhHour <= 0) {
                    $("#planningmhHour").textbox("setValue", "");
                    alert('小时数字不能小于0');
                    return
                }
            }
        }
        if (data.mtrYn == "") {
            alert("REQUIRED MATERIAL/SPEC.TOOLE必须勾选一项！");
            return
        } else {
            if (data.mtrYn == "y") {

                let geshu = document.getElementsByClassName('nrcMtrList');
                if (geshu.length >= 1) {
                    for (var i = 0; i < geshu.length; i++) {
                        let ind = geshu[i].id.substring(7);
                        if ($("#av" + ind).val() == "") {
                            alert("P/N不能为空！");
                            return;
                        }
                        if ($("#qty" + ind).val() == "") {
                            alert("QTY不能为空！");
                            return;
                        } else {
                            let pattern = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
                            if (!pattern.test($("#qty" + ind).val())) {
                                $("#qty" + ind).val("");
                                alert("QTY只能为数字！");
                                return
                            }
                        }
                        if ($("#mrDesc" + ind).val == "") {
                            alert("DESCRIPTION不能为空！");
                            return;
                        }
                        if ($("#unit_xiala" + ind).combobox("getValue") == "") {
                            alert("Unit不能为空！");
                            return;
                        }

                    }
                }
            }
        }

        if (data.isSuspending == "") {
            alert("Suspending必须勾选一项！");
            return
        } else {
            if (data.isSuspending == "y") {
                if (!$("#repeat_y").is(":checked") && !$("#repeat_n").is(":checked")) {

                    alert("REPEAT必须勾选一项！");
                    return
                }
                if (input_checkbox("#reason_input") == "") {
                    alert("REASON必须勾选一项！");
                    return
                }
                if (data.runCategory == "") {
                    alert("运行分类下拉框不能为空！");
                    return
                }

                if (data.timeLimitType == "") {
                    alert("时限必须勾选！");
                    return
                } else {
                    let inde = 0;
                    if ($("#shixian_y").is(":checked")) {
                        for (var i = 1; 4 > i; i++) {
                            if ($(".fh_fc_days" + i).textbox("getValue") != "") {
                                inde++;
                            }
                        }
                        if (inde == 0 && data.hardTimeType == "") {
                            alert("时限请输入或者勾选一个");
                            return
                        }
                        if (data.manualOrTechnical == "") {
                            alert("手册要求或者技术评估需选中一个！");
                            return
                        }
                        if (data.runCategory == 6) {
                            if (data.fc > 20) {
                                alert("当选择10天（20FC/30FH）内纠正时，Fc的输入值不能大于20");
                                return
                            }
                            if (data.fh > 30) {
                                alert("当选择10天（20FC/30FH）内纠正时，FH的输入值不能大于30");
                                return
                            }
                            if (data.days > 10) {
                                alert("当选择10天（20FC/30FH）内纠正时，DAYS的输入值不能大于10");
                                return
                            }
                        }
                        if (inde > 1) {
                            if (!$("#First").is(":checked") && !$("#last").is(":checked")) {
                                alert("当输入多个时限时，First/last必须勾选一项！");
                                return
                            }
                        }
                    } else {
                        if (data.adviseDoTimeType == "") {
                            alert("软时限时间必须选中一个！");
                            return
                        } else {
                            if (data.adviseDoTimeType >= 5) {
                                if (data.sn == "" || data.pn == "") {
                                    alert("当选择送修时或者换发时执行时！pn和sn不能为空！");
                                    return
                                }
                            }
                        }
                    }

                }
                let tool=false;
                $.each($('#reason_input input:checkbox:checked'), function () {
                   if( $(this).val()==2){
                        tool=true;
                   }
                });
                if(tool){
                    let beiliao=true;
                    let geshu = document.getElementsByClassName('nrcMtrList');
                    if (geshu.length >= 1) {
                        for (var i = 0; i < geshu.length; i++) {
                            let ind = geshu[i].id.substring(7);
                            if (!$("#tools_y"+ind).is(":checked")&&$("#beiliao_y"+ind).is(":checked")) {
                                beiliao=false;
                            }

                        }
                    }
                    if(beiliao){
                        alert("当推迟原因为Material,航材中必须有非Tools并且是“需备料”的航材！");
                        return
                    }
                }
            }
        }
    }

    if (nrcProcessStatus == "CHECKING" && $("#Suspending_y").is(":checked") && data.postSap != 'back' && optype != 'review') {
        var screenHeight = $(window).height();
        var scrolltop = $(document).scrollTop();
        var objTop = (screenHeight - 350) / 2 + scrolltop;

        $("#submit_checking").window({
            resizable: false,
            modal: true,
            top: objTop + "px"
        });

    } else {
        if (nrcProcessStatus == "" || nrcProcessStatus == "EDITING") {
            var screenHeight = $(window).height();
            var scrolltop = $(document).scrollTop();
            var objTop = (screenHeight - 350) / 2 + scrolltop;

            $("#submit_add").window({
                resizable: false,
                modal: true,
                top: objTop + "px"
            });
        } else {
            isClickSave = false;
            form_data(url, name);
        }


    }


}

function ewis_yes() {
    $("#ewis").EWIS("create");
}

function ewis_no() {
    $("#ewis").EWIS("destroy");
}

function oil_yes() {
    $("#oilSpill").oilSpill("create");
}

function oil_no() {
    $("#oilSpill").oilSpill("destroy");
}

var url_ac = "";
var list_arr = 0;
var lisr_file = 0;

function Other_matters(id) {
    if (id === 1) {
        if ($("#other").is(":checked")) {
            $('#attentionDesc').removeAttr("disabled");
        } else {
            $("#attentionDesc").attr("disabled", "disabled");
        }
    } else {
        if ($("#others").is(":checked")) {
            $('#hoReasonOther').removeAttr("disabled");
        } else {
            $("#hoReasonOther").attr("disabled", "disabled");
        }
    }

}

function add_file(i) {
    let file = " <div id=\"atta_input_flie_" + i + "\" class=\"atta_input_fliecss\">\n" +
        "       <input class=\"textbox easyui-validatebox\" type=\"file\" id=\"atta_input_flie_a" + i + "\" size=\"300\" name=\"file\" data-options=\"required:true\"/>            \n" +
        "                    <div class=\"add_jiahao\" onclick=\"add_atta_input_flie()\" style='margin-top: 5px'></div>\n" +
        " <div class='file_duihao' onclick=\"atta_input_flie('atta_input_flie_a'+" + i + ")\">✔</div>\n" +
        "                    <div class=\"jianhao icon-delete\" onclick=\"delete_atta_input_flie(atta_input_flie_" + i + ")\" style='margin-top: 4px'></div>\n" +
        "                </div>";
    let html_row = $(file);
    $("#attachament_td").append(html_row);
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
                    "                        <div class=\"jianhao icon-delete\" onclick=\"deleteFile(" + jdata.data[ind].PKID + ")\"></div>\n" +
                    "                        </div>";
                let html_row = $(file);
                $("#attach_file").append(html_row);
            }

        }
    });
}

function reload_() {
    add_file_show($("#nrcId").textbox("getValue"));
}

function atta_input_flie(id) {
    console.log(id);
    if ($("#nrcId").textbox("getValue") != "") {
        var fileInput = $("#" + id).get(0).files[0];
        if (fileInput) {
            $.ajaxFileUpload({
                url: Constant.API_URL + 'ATTACHMENT_UPLOAD',
                secureuri: false,
                fileElementId: id, //file控件id
                dataType: 'json',
                data: {
                    "fileCategory": "nrcAttachment",
                    "sourceId": $("#nrcId").textbox("getValue")
                },
                success: function (data) {
                    if (data.code == 200) {
                        var file = document.getElementById("" + id + "");
                        file.value = '';
                        $("#" + id).value = "";
                        add_file_show($("#nrcId").textbox("getValue"));
                    }
                    console.log(data);

                }

            })
        } else {
            alert("请选择上传文件！");
        }
    } else {
        alert("请先保存，再上传附件！")
    }

}

function add_atta_input_flie() {
    add_file(lisr_file);
    lisr_file++;
}

function delete_atta_input_flie(val) {
    let geshu = document.getElementsByClassName('atta_input_fliecss');
    if (geshu.length == 1) {
        return
    }
    let newP = $(val);
    if (newP.length > 0) {
        newP.remove();
    }
}

function xunhuan(i) {

    let a = " <tr class='nrcMtrList' id=\"roe_tr_" + i + "\">\n" +
        "                                    <td style=\"width: 148px\"><input  id=\"tools_y" + i + "\"  type=\"checkbox\" onclick=\"qian_yes('beiliao_y" + i + "')\"><label for=\"tools_y" + i + "\">YES</label></td>\n" +
        "                                    <td><input class= \"beiliao\"  readonly=\"readonly\" id=\"av" + i + "\"  style=\"width: 85%\"/><input id=\"av_itemnum" + i + "\" style='display: none'><input id=\"av_description" + i + "\" style='display: none'>\n" +
        "                                        <img alt=\"\" id=\"acBtn" + i + "\" class=\"fangdajin\" onClick=\"pn_data(" + i + ")\" src=\"/img/search.png\"/></td>\n" +
        "                                    <td><input class=\"beiliao\" style=\"width: 85%\" type=\"text\" id=\"qty" + i + "\"></td>\n" +
        "                                    <td><input class=\"beiliao easyui-combobox\" style=\"width: 85%\" type=\"text\" id=\"unit_xiala" + i + "\"></td>\n" +
        "                                    <td><input class=\"beiliao\" readonly=\"readonly\" style=\"width: 85%\" type=\"text\" id=\"mrDesc" + i + "\"></td>\n" +
        "                                    <td><input id=\"beiliao_y" + i + "\"  type=\"checkbox\" onclick=\"hou_yes('tools_y" + i + "')\"><label for=\"beiliao_y" + i + "\" >YES</label></td>\n" +
        "                                    <td>\n" +
        "                                        <div class=\"jianhao icon-delete\" onclick=\"delete_tr(roe_tr_" + i + ")\"></div>\n" +
        "                                    </td>\n" +
        "                                </tr>";
    let html_row = $(a);
    $("#addnrc_table_list").append(html_row);
    unit_data(i);

}

function getDataDictionary(name) {
    let te_unit = [];
    let ma_unit = [];
    queryDataDict({
        "domainCode": "TE_UNIT_TYPE,MATERIAL_UNIT_TYPE", "functionCode": "ANALYSIS_DOMAIN_BYCODE",
        succFn:function(data){
            if(data){
                debugger;
                te_unit = data.TE_UNIT_TYPE;
                ma_unit = data.MATERIAL_UNIT_TYPE
            }

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
    }
    $("#unit_xiala" + i).combobox(
        {
            valueField: 'TEXT',
            textField: 'TEXT',
            data: unit_da,
        }
    );
}

function pn_data(ind) {
    $.pnSelect({
        success: function (data) {
            debugger;
            $("#av" + ind).val(data.partno);
            $("#av_itemnum" + ind).val(data.itemnum);
            $("#mrDesc" + ind).val(data.description);
            $("#beiliao_y"+ind).prop("checked", true);
            let unit_da = [];
            $.each(data.allunit.split(","), function (i, v) {
                unit_da[i] = {
                    "TEXT": v,
                    "VALUE": v
                }
            });
            $("#unit_xiala" + ind).combobox(
                {
                    valueField: 'TEXT',
                    textField: 'TEXT',
                    data: unit_da,
                }
            );
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
    if (document.getElementsByClassName('nrcMtrList').length > 1) {
        var newP = $(na);
        if (newP.length > 0) {
            newP.remove();
        }
    }

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


function ceshi() {
    form_data();
}

function required_to() {

    let geshu = document.getElementsByClassName('nrcMtrList');
    if (geshu.length == 0) {
        xunhuan(0);
    }
    if ($("#requi_y").is(":checked")) {
        $("#material").removeAttr('disabled');
        $("#spec").removeAttr('disabled');

        $("#rep_ipc").show();
    } else {
        $("#rep_ipc").hide();
        $("#material").attr('disabled', 'false');
        $("#spec").attr('disabled', 'false');

    }
}

function Suspending_show(id) {

    if ($("#Suspending_y").is(":checked")) {
        $('.repeat_radio').removeAttr('disabled');
        $(".Suspending").show();
        $('#fenlei').combobox({
            valueField: 'id',
            textField: 'text',
            data: [
                {id: 0, text: ""},
                // {id: 1, text: "运行飞机串件"},
                {id: 2, text: "机组操作"},
                //{id: 3, text: "影响地服推行"},
                {id: 4, text: "影响机组飞行品质"},
                {id: 5, text: "液体渗漏"},
                {id: 6, text: "10天（20FC/30FH）内纠正"},
                {id: 8, text: "货舱装载系统缺陷"},
                {id: 9, text: "下货舱门开关缺陷"},
                {id: 10, text: "烤箱烧水杯故障"},
                {id: 11, text: "厕所排放系统缺陷"},
                {id: 7, text: "其他"}
                ],
            onChange: function (n, o) {
                if (n == 7) {
                    $("#yunxin_n").prop("checked", true);

                } else {
                    $("#yunxin_y").prop("checked", true);

                }
                $("#yunxin_n").attr('disabled', 'false');
                $("#yunxin_y").attr('disabled', 'false');
            }

        });
        id != 1 && $("#fenlei").combobox("setValue", id);
    } else {
        $(".Suspending").hide();
        $(".repeat_radio").attr('disabled', 'false');
        //$(".repeat_radio").attr("checked", false);

    }
    if ($("#active").textbox("getValue") == "ACTIVE") {
        $(".repeat_radio").attr('disabled', 'false');
        return
    }
    click_repeat();
}

function ceshishi() {
    $("#fh").textbox({
        onChange: function (e) {
            if ($("#next_c").is(":checked") || $("#songxiu").is(":checked")) {
                $("#fh").textbox("setValue", "");
            }
        }
    });
    $("#fc").textbox({
        onChange: function (e) {
            if ($("#next_c").is(":checked") || $("#songxiu").is(":checked")) {
                $("#fc").textbox("setValue", "");
            }
        }
    });
    $("#days").textbox({
        onChange: function (e) {
            if ($("#next_c").is(":checked") || $("#songxiu").is(":checked")) {
                $("#days").textbox("setValue", "");
            }
        }
    });
}

function shixian() {
    if ($("#shixian_y").is(":checked")) {
        $("#yin_shixian").show();
        $("#ruan_shixian").hide();
        if ($("#songxiu").is(":checked")) {
            $('.pn_sn_input input').removeAttr('disabled');
        } else {
            $(".pn_sn_input input").attr('disabled', 'false');
        }
        $(".ruanxuan").prop("checked", false);
        ceshishi();
    } else {
        $("#ruan_shixian").show();
        $("#yin_shixian").hide();
        if ($("#ruan_huan").is(":checked") || $("#ruan_song").is(":checked")) {
            $('.pn_sn_input input').removeAttr('disabled');
        } else {
            $(".pn_sn_input input").attr('disabled', 'false');
        }
        $("#shouche").prop("checked", false);
        $("#jishu").prop("checked", false);
        $("#next_c").prop("checked", false);
        $("#songxiu").prop("checked", false);
        $("#First").prop("checked", false);
        $("#last").prop("checked", false);
        for (var i = 1; 4 > i; i++) {
            $(".fh_fc_days" + i).textbox("setValue", "");
        }
    }
    $("#pn").val("");
    $("#sn").val("");
}

function click_repeat() {
    if ($("#active").textbox("getValue") == "ACTIVE") {
        return
    }
    if ($("#repeat_y").is(":checked")) {
        $('.nrc_task_no').removeAttr('disabled');
    } else {
        $(".nrc_task_no").attr('disabled', 'false');
    }
}

function rii_radio(value) {

    $("#" + value).prop("checked", true);

}

function Popup_file() {


    var screenHeight = $(window).height();
    var scrolltop = $(document).scrollTop();
    var objTop = (screenHeight - 650) / 2 + scrolltop;

    $("#dd").window({
        resizable: false,
        modal: true,
        top: objTop + "px"
    });


    let geshu = document.getElementsByClassName('poput_tr');
    if (geshu.length >= 1) {
        return
    }
    popup_add_file(list_arr);
}

function popup_add_file(i) {
    let file = "  <tr class='poput_tr' id=\"popup_tr" + i + "\">\n" +
        "               <td > <input type=\"file\" id=\"popup_flie_" + i + "\" style=\"border: 1px solid #ccc\" accept=\".pdf\"></td>\n" +
        "               <td id=\"fujian_id" + i + "\">附件：<input id=\"cws" + i + "\"   type=\"checkbox\" value=\"1\" class=\"fujian\"><label for=\"cws" + i + "\">CWS</label>" +
        "<input id=\"gongka" + i + "\"  type=\"checkbox\" value=\"2\" class=\"fujian\"><label for=\"gongka" + i + "\">工卡</label>" +
        "<input id=\"shouce" + i + "\"   type=\"checkbox\" value=\"3\" class=\"fujian\"><label for=\"shouce" + i + "\">手册/图片</label> </td>\n" +
        "               <td style=\"width: 80px;\"><div class='file_duihao' onclick=\"submit_popup_flie(popup_flie_" + i + ", popup_tr" + i + ")\">✔</div><div class=\"jianhao icon-delete\" onclick=\"delete_popup_flie(popup_tr" + i + ")\"></div></td>\n" +
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
                if (fujia.length > 0) {
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
                success: function (obj) {
                    if (obj.code == 200) {
                        id.value = "";
                        $("#" + name.id + " .fujian").prop("checked", false);
                        type_file_sh(obj.data);
                        delete_popup_flie(name);
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

function add_popup_buiion() {
    list_arr++;
    popup_add_file(list_arr);
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

function close_dialog() {
    $('#dd').window('close');
}

function update_pnsn_input() {   //点击开放PN和SN的输入框
    $('.pn_sn_input input').removeAttr('disabled');
    $(".pn_sn").show();
    for (var i = 1; 4 > i; i++) {
        $(".fh_fc_days" + i).textbox("setValue", "");
    }
}

function update_pnsn_cols() {   //点击开放PN和SN的输入框
    $('.pn_sn_input input').attr('disabled', "disabled");
    $(".pn_sn").hide();
    $("#pn").val("");
    $("#sn").val("");
    for (var i = 1; 4 > i; i++) {
        $(".fh_fc_days" + i).textbox("setValue", "");
    }
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

function delete_nrc_popup() {

    var screenHeight = $(window).height();
    var scrolltop = $(document).scrollTop();
    var objTop = (screenHeight - 350) / 2 + scrolltop;

    $("#delete_popup").window({
        resizable: false,
        modal: true,
        top: objTop + "px"
    });
}

function delete_nrc() {
    $("#button_zhe").show();
    let id = $("#nrcId").textbox("getValue");
    if (id != "") {
        let id_date = {
            "id": id,
            "reason": $("#dalete_text").val(),
        };
        $.ajax({
            type: "POST",
            url: "/api/v1/tbm/nrc/nrc/delete_nrc_by_id",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(id_date),
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    $("#button_zhe").hide();
                    alert("删除成功！");
                    parent && parent.window.colsa_window && parent.window.colsa_window();
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
    } else {
        window.close();
    }

}

function repid_name() {
    $.dialog.setting.extendDrag = true;
    UserUtils.showDialog({
        callback: function (data) {
            let user_info = data[0];
            $("#repSn").textbox("setValue", user_info.userName + "(" + user_info.sn + ")")
        }
    });
}

//NRC TASK弹窗内容
function nrc_task_popup() {
    let data = this.getNrcFormData();

    var curWidth = ($(window).width() * 0.9).toString();
    var curheight = ($(window).height() * 0.6).toString();
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: "NRC TASK",
        param: {
            nrcid: $("#nrcId").textbox("getValue"),
            acid: $("#ac_id").textbox("getValue"),
            nrcno: $("#nrcNo").textbox("getValue"),
            aceng: $("#acReg").textbox("getValue"),
            modelEng: $('#ac_type_input').textbox('getValue'),
            aeType: data.aeType,
        },
        url: "/views/nrc/nrc_task.shtml"
    });
}

function bohui_text_data() {
    if ($("#bohui_text").val() == "") {
        alert("驳回信息必填！");
        return
    }
    $.ajax({
        type: "POST",
        url: "/api/v1/tbm/nrc/nrc/reject_nrc_editing",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            id: $("#nrcId").textbox('getValue'),
            reason: $("#bohui_text").val(),
        }),
        dataType: "json",
        success: function (data) {
            parent.window.colsa_window();
        },
        error: function () {
            window.alert("驳回失败！");
        }
    });

}

function nrcTask_No(name) {
    $("#nrcTaskNo").textbox("setValue", name);
}

function doTurnTo() {

    // 移交对接
    var screenHeight = $(window).height();
    var scrolltop = $(document).scrollTop();
    var objTop = (screenHeight - 350) / 2 + scrolltop;

    $("#forhelp").window({
        resizable: false,
        modal: true,
        top: objTop + "px"
    });
}

function forhelp_data() {
    let id = $("#nrcId").textbox("getValue");

    if ($("#forhelp_id").val() == "") {
        alert("请选择人员在提交！");
        return
    }
    $.ajax({
        type: "POST",
        url: "/api/v1/tbm/nrc/nrc/transfer_nrc_checking?nrcId=" + id + "&rectPlanUpdatedId=" + $("#forhelp_id").val(),
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                alert("成功！");
                parent.window.colsa_window();
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

}

function checking_subit() {
    if ($("#authId_to").textbox("getValue") != "") {
        form_data('/api/v1/tbm/nrc/nrc/submit_nrc', 'submit');
    } else {
        alert("请选择方案人员！");
    }
}

function type_file_sh(data) {
    let file = " <div class='filepopu' id=\"type_file_show" + data.wsAttachment.pkid + "\"  style=\"line-height: 30px;width: 100%;    height: 30px;border-bottom: 1px solid #ccc;\" >\n" +
        "                            <div style=\"width: 80%;float: left;text-align: left;\"><a style=\"color:red;font-size: 14px;margin-right: 25px;\" onclick=\"downFile(" + data.wsAttachment.pkid + "," + data.wsAttachment.pkid + ")\">" + data.wsAttachment.orgName + "</a>\n" +
        "                                附件：<input id=\"cws" + data.wsAttachment.pkid + "\" disabled=\"disabled\"  type=\"checkbox\" value=\"1\" class=\"fujian\"><label for=\"cws" + data.wsAttachment.pkid + "\">CWS</label>\n" +
        "                                <input id=\"gongka" + data.wsAttachment.pkid + "\"  disabled=\"disabled\" type=\"checkbox\" value=\"2\" class=\"fujian\"><label for=\"gongka" + data.wsAttachment.pkid + "\">工卡</label>\n" +
        "                                <input id=\"shouce" + data.wsAttachment.pkid + "\" disabled=\"disabled\"  type=\"checkbox\" value=\"3\" class=\"fujian\"><label for=\"shouce" + data.wsAttachment.pkid + "\">手册/图片</label>\n" +
        "                            </div>\n" +
        "                            <div class=\"jianhao icon-delete\" style='float: left'onclick=\"delete_flie_poput(" + data.id + ", type_file_show" + data.wsAttachment.pkid + ")\"></div>\n" +
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
    }

}

function Original_Card() {
    var screenHeight = $(window).height();
    var scrolltop = $(document).scrollTop();
    var objTop = (screenHeight - 350) / 2 + scrolltop;

    $("#gongka_popup").window({
        resizable: false,
        modal: true,
        top: objTop + "px"
    });
    if (gongka_list.length > 0) {
        $(".gongka_d_tr").remove();
        for (let i in gongka_list) {
            gongka_popup_data(i,gongka_list[i].createMark);
            $("#skilll" + i).textbox("setValue", gongka_list[i].cardType);
            if(gongka_list[i].createMark === 'SYSTEM')  {
                $("#skilll" + i).textbox("readonly", true);
            }
            $("#gongka_snn" + i).val(gongka_list[i].cardNo);
            $("#nrcid" + i).val(gongka_list[i].cardId);
            $("#type" + i).val(gongka_list[i].cardType);
            $("#creat_mark" + i).val(gongka_list[i].createMark);
        }
    } else {
        let gus = document.getElementsByClassName('gongka_d_tr');

        if (gus.length < 1) {
            gongka_popup_data(0);
        }
    }


}

function colse_gongka() {
    gongka_list = [];
    let gus = document.getElementsByClassName('gongka_d_tr');
    let name = "";
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
            createMark:$("#creat_mark" + inde).val()
        });
        if (name.length > 0) {
            name += ",";
        }
        name += $("#gongka_snn" + inde).val();
    }
    $("#original").textbox("setValue", name);
    $('#gongka_popup').window('close');
}

function setkgNrcDefaultData(acReg, company) {
    $("#rii_n").prop("checked", true);
    $("#rci_n").prop("checked", true);
    $("#dm_n").prop("checked", true);
    $("#jizu_n").prop("checked", true);
    $("#planningmhPerson").textbox("setValue", 0);
    $("#planningmhHour").textbox("setValue", 0);
    $("#rectChn").val(acReg + "客改期间由" + company + "开卡并提供方案。");
    $("#rectEn").val(acReg + "客改期间由" + company + "开卡并提供方案。");
}

/**
 * 功能，搜索ATA，model必输，
 * 获取ATA  $("#ata").textbox('getValue');
 * 设置ATA  $("#ata").textbox('setValue', data.ata);
 * html <input class="easyui-textbox" id="ata" >
 * 直接引入该文件，执行函数 ataSelectInit()
 * 参数：modelTips 是可以配置的提示语
 *
 * */

//ATA数据查询
var ataData=[] ;
function ataDataSearch(){
    //这里必须使用两种取值方式，getValue取值是选择组件里包含的真实值，getText是组件里的显示的值
    //正常输入两个值相等，当使用上下键选择的时候就会出现不同的结果
    var model = $("#model").html() || "";
    var ata = $("#ata").textbox("getValue");
    var ataText = $('#ata').combobox('getText');
    //只针对nrc编辑的时候，判断是否发动机类型,是就加上发动机参数，不是就直接传空值
    var engine = "";
    var ac = "";
    if ($("#faji").is(":checked")) {
        engine = $("#ac_type_input").textbox("getValue");
        ac =  $("#ac").html() || "";
    }else if ($("#feiji").is(":checked")){
        model = $("#ac_type_input").textbox("getValue").slice(0, 4)|| "";
    };
    //根据按上下键选择选项的时候，输入框一定超过4个字符的特性，防止在选择的时候进行搜索
    if(ata.length > 1 && ataText.length<5) {
        $.ajax({
            url: "/api/v1/ata/selectBmManualAtaByFleetAndAta?fleet=" + model + "&ata=" + ata + "&engine="+engine,
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            type: 'POST',
            // data: postData,
            async: true,
            cache: false,
            success: function (obj, textStatus) {
                var getData = obj.data;
                ataData = [];
                for (var i = 0; i < getData.length; i++) {
                    var labelValue = {};
                    if(!!getData[i].companyCode && getData[i].companyCode == '1'){
                        //根据后端返回的标识确定输入章节号+手册名称+发动机型号+标题
                        if(!!getData[i].engine){
                            labelValue.label = getData[i].chapter + " " + getData[i].manualType + " "+getData[i].engine + " " + getData[i].title;
                        }else {
                            labelValue.label = getData[i].chapter + " " + getData[i].manualType +  " " + getData[i].title;
                        };
                    }else {
                        labelValue.label = getData[i].chapter + " " + getData[i].title;
                    };
                    //加上空格号是为了在输入一个正确四位ATA的时候，不要把数组第一个给带进来
                    labelValue.value = getData[i].chapter+" ";
                    ataData.push(labelValue);
                };
                $('#ata').combobox('loadData', ataData);
            },
            error: function () {
                ajaxLoadEnd();
                $('#saveBtn').text("保存");
            }
        });
    }
}

//ATA组件初始化
function ataSelectInit(modelTips){
    //selectFlage 用来解决当清空后直接按回车键导致重新赋值的问题
    var selectFlage = 0;
    var modelTips = modelTips||"建议先选择‘Flight NO.’";
    $("#ata").combobox({
        editable: true,
        data:ataData,
        panelHeight: 160,
        valueField: 'value',
        textField: 'label',
        width:300,
        hasDownArrow:true,
        multiple:false,
        //在选择的时候做操作
        onSelect: (data) => {
            selectFlage = 1;
        },
        onLoadSuccess : () => {
        },
        onChange:()=>{
            selectFlage = 0;
            var inputAta = $("#ata").combobox('getText');
            var ac = $("#model").html()||"";
            if(!ac && inputAta.length == 1 && modelTips != "hideTips"){
                MsgAlert({type: "tip", content: modelTips});
            };
            ataDataSearch();
            if(inputAta.length > 3){
                var postAta = inputAta.slice(0, 4);
                checkDm(postAta);
            };
        }
    });
    //eventAta 用来解决使用上下键+回车键选择后，失去焦点时数据被清空需要重新进行赋值的问题
    var eventAta = "";
    $("#ata").next("span").children("input:first").blur(function () {
        //如果使用回车键选中
        setTimeout(function(){
            var ataNow = $("#ata").textbox("getValue")||eventAta;
            if(ataNow.length>3 && !!selectFlage){
                $("#ata").textbox("setValue", ataNow.slice(0,4));
            }else if(ataNow.length<4 || !selectFlage){
                $("#ata").textbox("setValue", "");
            }
        },300);})
    //解决当用户输入一个正确的四位章节号后，点击回车键出现输入框带入描述的问题
    $("#ata").next("span").children("input:first").keydown(function () {
        if(event.keyCode == "13") {
            var ataNow = $("#ata").combobox('getText');
            if(ataNow.length>3){
                $("#ata").textbox("setValue", ataNow.slice(0,4));
                eventAta = ataNow.slice(0,4);
                selectFlage = 1;
            }
        }
    })
}




