var sub_win, P, s_params, toType, pageType;

if (frameElement) {
    sub_win = frameElement.api;
}

if (sub_win) {
    P = sub_win.opener;
    s_params = sub_win.data;
    toType = s_params["toType"];
    pageType = s_params["pageType"];
} else {
    s_params = getParentParam_();
    toType = s_params.toType;
    pageType = s_params.pageType;
}

var _ggy_tails = '';
var toBaseInfoVO;
var toTroubleShootingMap;
var toTroubleShootingMtMap;
var defectBaseInfoView;
var isNewest;
var toApplicabilityForSurveyMap;
var toMaterialToolss;
var producePrepareOrders;
var toolUnitList;
var materialUnitList;
var attachments;
var sta;
var user;
var mechDate;
var feedBackAttachment;
var toGrabs;

if(!s_params.addTrNum){
    s_params.addTrNum=0;//用于记录已挂准备单
}


/**
 * 获取数据字典
 */
function getDataDictionary() {

    var _url = "/api/v1/plugins/ANALYSIS_DOMAIN_BYCODE";
    var params_ = {
        "domainCode": "TE_UNIT_TYPE,MATERIAL_UNIT_TYPE,DM_TYPE_AIRCRAFT",
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
            //获取工具单位
            toolUnitList = data.data.TE_UNIT_TYPE;
            if (toolUnitList) {
                $.each(toolUnitList, function (i, v) {
                    var value = v.VALUE;
                    var text = v.VALUE;
                    var option = '<option value="' + value + '">' + text + '</option>';
                    $("#unitNameSelect").append(option);
                });
            }
            //获取航站单位
            // materialUnitList = data.data.MATERIAL_UNIT_TYPE;
            // if (materialUnitList) {
            //     $.each(materialUnitList, function (i, v) {
            //         var value = v.VALUE;
            //         var text = v.VALUE;
            //         var option = '<option value="' + value + '">' + text + '</option>';
            //         $("#materialNameSelect").append(option);
            //     });
            // }
            //获取高高原设置的飞机
            if (data.data.DM_TYPE_AIRCRAFT) {
                var tails = "";
                $.each(data.data.DM_TYPE_AIRCRAFT, function (i, v) {
                    tails = tails + v.VALUE + ",";
                });
                if (tails) {
                    tails = tails.substring(0, tails.length - 1);
                }
                $("#dmType").attr("tails", tails);
            }

        }
    });
}

/**
 * 初始化TO数据
 */
function initToData() {
    var actionUrl = basePath + "/api/v1/mccdoc/to_base_info/editOrView";
    var toId;
    if (sub_win) {
        toId = s_params["id"];
    } else {
        toId = s_params.id;
    }
    var params = {
        "id": toId
    };

    $.ajax({
        url: actionUrl,
        type: "get",
        data: params,
        dataType: "json",
        async: false,
        cache: false,
        success: function (data) {
            if (data.code != 200) {
                P.$.dialog.alert(data.msg);
                return;
            }
            toBaseInfoVO = data.data.toBaseInfoVO;
            toTroubleShootingMap = data.data.toTroubleShootingMap;
            toTroubleShootingMtMap = data.data.toTroubleShootingMtMap;
            defectBaseInfoView = data.data.defectBaseInfoView;
            isNewest = data.data.isNewest;
            toApplicabilityForSurveyMap = data.data.toApplicabilityForSurveyMap;
            producePrepareOrders=data.data.producePrepareOrders;//准备单
            workOrderFeedbackDetails=data.data.workOrderFeedbackDetails;// 反馈工时
            toMaterialToolss = data.data.toMaterialToolss;
            feedBackAttachment = data.data.feedBackAttachment;
            toGrabs= data.data.toGrabs;
        }
    });
}

/**
 * 初始化TO数据
 */
function initCloseToData() {
    var actionUrl = basePath + "/api/v1/mccdoc/to_base_info/findFeedBack";
    var toNumber;
    if (sub_win) {
        toNumber = s_params["toNumber"];
        sta =s_params["sta"];
    } else {
        toNumber = s_params.toNumber;
        sta =s_params["sta"];
    }
    var params = {
        "toNumber": toNumber,
        "sta":sta
    };

    $.ajax({
        url: actionUrl,
        type: "get",
        data: params,
        dataType: "json",
        async: false,
        cache: false,
        success: function (data) {
            if (data.code != 200) {
                P.$.dialog.alert(data.msg);
                return;
            }

            user = data.data.user;
            mechDate=data.data.mechDate;
            toBaseInfoVO = data.data.toBaseInfoVO;
            toTroubleShootingMap = data.data.toTroubleShootingMap;
            gra = data.data.toTroubleShootingMap;
        }
    });
}
function initDefCloseToBaseInfoVO() {
    $("#sta").val(sta);
    $("#toBaseInfoId").val(toBaseInfoVO.id);
    $("#toBaseInfoType").val(toBaseInfoVO.type);
    $("#feedbackRequests").val(toBaseInfoVO.feedbackRequests);
    var feedbackRequests = toBaseInfoVO.feedbackRequests;
    if (1 == feedbackRequests) {
        $('#yes').attr('checked', 'checked');
    } else if (0 == feedbackRequests) {
        $('#no').attr('checked', 'checked');
    }
    $("#dmType").val(toBaseInfoVO.dmType);
    $(".toId").attr("id",toBaseInfoVO.id);
    $(".toId").text(toBaseInfoVO.toNumber);
    $("#revNo").text("R"+toBaseInfoVO.revNo);
    $("#model").text(toBaseInfoVO.model);
    $("#tail").text(toBaseInfoVO.tail);
    $("#ata").text(toBaseInfoVO.ata);
    $(".defectNo").text(toBaseInfoVO.defectNo);
    $(".defectNo").attr("id",toBaseInfoVO.defectId);

    $("#grabNo").text(toBaseInfoVO.grabNo);
    $("#grabSource").text(toBaseInfoVO.grabSource);
    $("#grabPn").text(toBaseInfoVO.grabPn);
    $("#grabSn").text(toBaseInfoVO.grabSn);
    $("#grabRemark").text(toBaseInfoVO.grabRemark);

}

function feedTroubleShooting() {
    var html = '';
    $.each(toTroubleShootingMap, function (i, v) {
        console.log("v.EDIT_DATE: "+v.EDIT_DATE);
        console.log("filterNull(v.MECH_DATE): "+filterNull(v.MECH_DATE));
        var ppo=toTroubleShootingMap[i].producePrepareOrders;
        var wofd=toTroubleShootingMap[i].workOrderFeedbackDetails;
        var expectStaff="";
        var expectHour="";
        var orderId="";
        var realHour="";
        var realStaff="";
        var ele='<td class="td-line30-center">--</td>';
        if(ppo&&ppo instanceof Array&&ppo.length>0){
            expectStaff=ppo[0].expectStaff;
            expectHour=ppo[0].expectHour;
            orderId=ppo[0].id;
            ele='<td class="td-line30-center">'+expectStaff+'人X'+expectHour+'小时</td>';

        }

        if(wofd&&wofd instanceof Array&&wofd.length>0){
            realHour=wofd[0].realHour;
            realStaff=wofd[0].realStaff;
        }

        html += '<tr class="addProdprep11111">';
        html += '<td class="td-line30-center" >' + v.STEP;
        html += '<input name="toTroubleShootings[' + i + '].id" type="hidden" value="' + v.ID + '"/>';
        html+= '</td>';
        html += '<td class="td-line30-center">';
        html += '<textarea readonly="readonly" rows="4" style="width: 96%;background-color: #f0f0f0">' + v.SUGGESTION + '</textarea>';
        html += '</td>';
        html += '<td class="td-line30-center">' + v.ENGINEER_NAME_SN + '</td>';
        html += '<td name="#toTroubleShooting.EDIT_DATE" class="td-line30-center">' + v.EDIT_DATE + '</td>';
        html += '<td class="td-line30-center">';
        html += '<textarea name="toTroubleShootings[' + i + '].actionAndFeedback" rows="4" style="width: 92%;' +
            ' class="feedback" ' +
            'id="' + v.ID + '">' + (filterNull(v.ACTION_AND_FEEDBACK)) + '</textarea>';
        html += '<span class="td-font-red">*</span>';
        /*   html += '<input id="feedback' + i + '" type="hidden" value="' + v.ACTION_AND_FEEDBACK + '"/>';*/
        html += '</td>';
        html += ele;
        html += '<td class="td-line30-center">';
        html+='<input  name="workOrderFeedbackDetails['+i+'].orderId" type="hidden" value="'+orderId+'">';
        html+='<input  name="workOrderFeedbackDetails['+i+'].subId" type="hidden" value="'+v.STEP+'">';
        html+='<input class="textbox easyui-textbox realStaff" name="workOrderFeedbackDetails['+i+'].realStaff"' +
            ' style="width:' +
        ' 28%;"' +
            ' onblur="realStaffHour(this,1)" value="'+realStaff+'">人X';
        html+='<input class="textbox easyui-textbox realHour realHour_'+i+'" name="workOrderFeedbackDetails['+i+'].realHour" style="width:28%;"onblur="realStaffHour(this,2)" value="'+realHour+'">小时</td>';
        html += '<td class="td-line30-center">' + (filterNull(v.MECH_NAME_SN)) + '</td>';
        html += '<td name="#toTroubleShooting.MECH_DATE" class="td-line30-center">' + (filterNull(v.MECH_DATE)) + '</td>';
        html += '<td class="td-line30-center">' + (filterNull(v.STA)) + '</td>';
        html += '</tr>';
    });
    $("#troubleShootingHtml").after(html);
}

function feedStepNo() {
    var html = '';
    $.each(toTroubleShootingMap, function (i, v) {
        html += '<option value="'+v.ID+'">'+v.STEP;
        html += '</option>';
    });
    $("#toTroubleShootingSelect").after(html);
}
function initToBaseInfoVO() {
    $("#dmType").val(toBaseInfoVO.dmType);
    $("#toBaseInfoId").val(toBaseInfoVO.id);
    $("#toBaseInfoType").val(toBaseInfoVO.type);
    $("#revNo").text(toBaseInfoVO.revNo);
    $("#defectId").val(toBaseInfoVO.defectId);
    $("#defectNo").val(filterNull(toBaseInfoVO.defectNo));
    $("#model").val(toBaseInfoVO.model);
    $("#acId").val(toBaseInfoVO.acId);
    $("#acReg").val(filterNull(toBaseInfoVO.acReg));
    $("#ata").val(filterNull(toBaseInfoVO.ata));
    $("#skillId").val(filterNull(toBaseInfoVO.skill));
    $("#skill").val(filterNull(toBaseInfoVO.skill));
    $("#description").val(filterNull(toBaseInfoVO.description));
    $("#subject").val(filterNull(toBaseInfoVO.subject));
    $("#other").val(filterNull(toBaseInfoVO.other));
    $("#executionStatus").val(toBaseInfoVO.executionStatus);
    $("#toBaseInfoVOTail").val(filterNull(toBaseInfoVO.tail));

    //设置Feedback Requests的值
    var feedbackRequests = toBaseInfoVO.feedbackRequests;
    if (1 == feedbackRequests) {
        $('#yes').attr('checked', 'checked');
    } else if (0 == feedbackRequests) {
        $('#no').attr('checked', 'checked');
    }
    //设置Source Type的值
    var sourceType = toBaseInfoVO.sourceType;
    if (0 == sourceType) {
        $('#sourceType_mcc').attr('checked', 'checked');
    } else if (1 == sourceType) {
        $('#sourceType_ppc').attr('checked', 'checked');
    } else if (2 == sourceType) {
        $('#sourceType_ts').attr('checked', 'checked');
    }
    $("#grabNo").text(toBaseInfoVO.grabNo);
    $("#grabSource").text(toBaseInfoVO.grabSource);
    $("#grabPn").text(toBaseInfoVO.grabPn);
    $("#grabSn").text(toBaseInfoVO.grabSn);
    $("#grabRemark").text(toBaseInfoVO.grabRemark);
}

function initTroubleShooting() {
    var html = '';
    $.each(toTroubleShootingMap, function (i, v) {
        if (v.REF_TO_ID == toBaseInfoVO.id) {

            html += '<tr class="addStep_tr_'+(i + 1)+'">';
            html += '<td class="td-line30-center">' + (i + 1) + '</td>';
            html += '<td class="td-line30-center">';
            html += '<textarea maxlength="3000" name="toTroubleShootings[' + i + '].suggestion" ' +
                'style="width:97%;height:60px">' + v.SUGGESTION + '</textarea>';
            html += '<span class="td-font-red">*</span>';
            html += '<div class="errorMessage"></div>';
            html += '</td>';
            html += '<td style="display: none;">';
            html += '<input name="toTroubleShootings[' + i + '].step" type="hidden" value="' + v.STEP + '"/>';
            html += '</td>';
            html += '<td style="display: none;">';
            html += '<input name="toTroubleShootings[' + i + '].id" type="hidden" value="' + v.ID + '"/>';
            html += '</td>';
            html += '<td class="td-line30-center">';
            html += '<img height="19" class="isolate_prodPrep" name="add" onclick="toAddProdPrep(this,1)" ' +
                'src="/images/add.gif" style="cursor:pointer;margin-right:10px" title="添加生产准备单" width="18"/>';
            html += '<img height="19" name="del" onclick="delete_tr(this,' + v.ID + ')" ' +
                'src="/images/ico_cut.gif" style="cursor:pointer" title="Delete" width="18"/>';
            html += '</td>';
            html += '</tr>';
        } else {
            html += '<tr class="addStep_tr_"'+(i + 1)+'>';
            html += '<td class="td-line30-center">'+(i+1)+'</td>';
            html += '<td class="td-line30-center">';
            if (v.EXECUTION_STATUS == 1 || v.EXECUTION_STATUS == 2) {
                html += '<textarea maxlength="3000" name="toTroubleShootings[' + i + '].suggestion" ' +
                    'style="width:97%;height:60px">' + v.SUGGESTION + '</textarea>';
            } else {
                html += '<textarea maxlength="3000" name="toTroubleShootings[' + i + '].suggestion" ' +
                    'readonly="readonly" style="width:97%;height:60px">' + v.SUGGESTION + '</textarea>';
            }
            html += '<span class="td-font-red">*</span>';
            html += '<div class="errorMessage"></div>';
            html += '</td>';
            html += '<td style="display: none;">';
            html += '<input name="toTroubleShootings[' + i + '].step" type="hidden" value="' + v.STEP + '"/>';
            html += '</td>';
            html += '<td style="display: none;">';
            html += '<input name="toTroubleShootings[' + i + '].id" type="hidden" value="' + v.ID + '"/>';
            html += '</td>';
            html += '<td class="td-line30-center">';
            // html += '<img height="19" class="isolate_prodPrep" name="add" onclick="toAddProdPrep(this,1)" ' +
            //     'src="/images/add.gif" style="cursor:pointer" title="添加生产准备单" width="18"/>';
            html += '<img height="19" name="del" onclick="delete_tr(this,' + v.ID + ')" ' +
                'src="/images/ico_cut.gif" style="cursor:pointer" title="Delete" width="18"/>';
            html += '</td>';
            html += '</tr>';
        }
    });
    $("#troubleShootingHtml").after(html);


    //排故类TO显示已挂准备单
    $.each(toTroubleShootingMap, function (i, v) {
        if(v.producePrepareOrders&&v.producePrepareOrders.length>0){
            var stepTr=i+1;
            initProducePrepareOrders(stepTr,v.producePrepareOrders,v.workOrderFeedbackDetails);
        }
    });



}

function initToApplicabilityForSurvey() {
    var html = '';
    $.each(toApplicabilityForSurveyMap, function (i, v) {
        html += '<tr>';
        html += '<td style="display:none;">' + (i + 1) + '</td>';
        html += '<td style="display:none;">';
        html += '<input name="toApplicabilityForSurveys[' + i + '].acId" type="hidden" value="' + v.AC_ID + '"/>';
        html += '<input name="" type="hidden" value="' + v.TAIL + '"/>';
        html += '<input name="" type="hidden" class="toFleetModel" value="' + v.AC_TYPE.slice(0,4) + '"/>';
        html += '</td>';
        html += '<td class="td-line30-center">' + v.AC_TYPE + '</td>';
        html += '<td class="td-line30-center">' + v.TAIL + '</td>';
        html += '<td class="td-line30-center">' + v.STATUS + '</td>';
        html += '<td style="display:none;">';
        html += '<input name="toApplicabilityForSurveys[' + i + '].id" type="hidden" value="' + v.ID + '"/>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        if (v.EXECUTION_STATUS_TEMP == 1 || v.EXECUTION_STATUS_TEMP == '' || v.EXECUTION_STATUS_TEMP == null) {
            html += '<img height="19" name="del" onclick="delete_aircraft_tr(this,' + v.ID + ')" ' +
                'src="/images/ico_cut.gif" style="cursor:pointer" title="Delete" width="18"/>';
        } else {
            html += '<img class="hidden" height="19" name="del" onclick="delete_aircraft_tr(this,' + v.ID + ')" ' +
                'src="/images/ico_cut.gif" style="cursor:pointer" title="Delete" width="18"/>';
        }
        html += '</td>';
        html += '</tr>';
    });
    $("#toApplicabilityForSurveyHtml").after(html);
}

function initToMaterialTools() {
    var html = '';
    $.each(toMaterialToolss, function (i, v) {
        html += '<tr>';
        html += '<td class="td-line30-center" style="display:none;">' + (i + 1) + '</td>';
        html += '<td class="td-line30-center">';
        html += '<input maxlength="600" name="toMaterialToolss[' + i + '].name" style="width: 90%;height: 20px" type="text" ' +
            'value="' + v.name + '"/>';
        html += '<span class="td-font-red">*</span>';
        html += '<div class="errorMessage"></div>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<input maxlength="100" name="toMaterialToolss[' + i + '].pn" style="width: 80%;height: 20px" type="text" ' +
            'value="' + v.pn + '"/>';
        html += '<span class="td-font-red">*</span>';
        html += '<img class="add_del" height="16" id="dbpns" onclick="searchPnNumber(this);return false;" ' +
            'src="/images/ico_search_16.gif" style="cursor:pointer" ttype="manual_doc" width="16"/>';
        html += '<div class="errorMessage"></div>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        if (v.type == 2) {
            html += '<input checked="checked" name="toMaterialToolss[' + i + '].type" onclick="selectTool(this);" ' +
                'style="vertical-align: middle;" type="checkbox" value="' + v.type + '"/>&nbsp;&nbsp;工具';
        } else {
            html += '<input name="toMaterialToolss[' + i + '].type" onclick="selectTool(this);" ' +
                'style="vertical-align: middle;" type="checkbox" value="' + v.type + '"/> &nbsp;&nbsp;工具';
        }
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<input class="number" maxlength="10" name="toMaterialToolss[' + i + '].pageQty" ' +
            'style="width: 80%;height: 20px" type="text" value="' + v.qty + '"/>';
        html += '<span class="td-font-red">*</span>';
        html += '<div class="errorMessage"></div>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        if (v.type == 2) {
            html += '<div class="hidden" name="materialName">';
            html += '<select name="toMaterialToolss[' + i + '].unit" style="width: 90%;height:23px" >';
            html += '<option value="">--------请选择--------</option>';
            if (materialUnitList) {
                $.each(materialUnitList, function (j, vv) {
                    if (vv.VALUE == v.unit) {
                        html += '<option selected="selected" value="' + vv.VALUE + '">' + vv.VALUE + '</option>';
                    } else {
                        html += '<option value="' + vv.VALUE + '">' + vv.VALUE + '</option>';
                    }
                });
            }
            html += '</select>';
            html += '<span class="td-font-red">*</span>';
            html += '<div class="errorMessage"></div>';
            html += '</div>';

            html += '<div name="unitName">';
            html += '<select name="toMaterialToolss[' + i + '].unit" style="width: 90%;height:23px">';
            html += '<option value="">--------请选择--------</option>';
            if (toolUnitList) {
                $.each(toolUnitList, function (j, vv) {
                    if (vv.VALUE == v.unit) {
                        html += '<option selected="selected" value="' + vv.VALUE + '">' + vv.VALUE + '</option>';
                    } else {
                        html += '<option value="' + vv.VALUE + '">' + vv.VALUE + '</option>';
                    }
                });
            }
            html += '</select>';
            html += '<span class="td-font-red">*</span>';
            html += '<div class="errorMessage"></div>';
            html += '</div>';
        } else {
            html += '<div name="materialName">';
            html += '<select name="toMaterialToolss[' + i + '].unit" style="width: 90%;height:23px">';
            // html += '<option value="">--------请选择--------</option>';
            html += '<option value="' + v.unit + '">' + v.unit + '</option>';
            // if (materialUnitList) {
            //     $.each(materialUnitList, function (j, vv) {
            //         if (vv.VALUE == v.unit) {
            //             html += '<option selected="selected" value="' + vv.VALUE + '">' + vv.VALUE + '</option>';
            //         } else {
            //             html += '<option value="' + vv.VALUE + '">' + vv.VALUE + '</option>';
            //         }
            //     });
            // }
            html += '</select>';
            html += '<span class="td-font-red">*</span>';
            html += '<div class="errorMessage"></div>';
            html += '</div>';
            html += '<div class="hidden" name="unitName">';
            html += '<select name="toMaterialToolss[' + i + '].unit" style="width: 90%;height:23px">';
            html += '<option value="">--------请选择--------</option>';
            if (toolUnitList) {
                $.each(toolUnitList, function (j, vv) {
                    if (vv.VALUE == v.unit) {
                        html += '<option selected="selected" value="' + vv.VALUE + '">' + vv.VALUE + '</option>';
                    } else {
                        html += '<option value="' + vv.VALUE + '">' + vv.VALUE + '</option>';
                    }
                });
            }
            html += '</select>';
            html += '<span class="td-font-red">*</span>';
            html += '<div class="errorMessage"></div>';
            html += '</div>';
        }
        html += '</td>';
        html += '<td class="td-line30-center" style="display:none;">';
        html += '<input name="toMaterialToolss[' + i + '].id" type="hidden" value="' + v.id + '"/>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<img height="19" name="del" onclick="delete_material_tools_tr(this,' + v.id + ')" ' +
            'src="/images/ico_cut.gif" style="cursor:pointer" title="Delete" width="18"/>';
        html += '</td>';
        html += '</tr>';
    });
    $("#toMaterialToolsHtml").after(html);
}

//TO 挂准备单 start
// var addTrNum=0;
function initProducePrepareOrders(stepTr,stepOrders,stepDetails,view){
    var addTrNum=s_params.addTrNum;
    if(toType=="4")return;
    var i;
    if(stepTr){ addTrNum=stepTr; producePrepareOrders=stepOrders;i=stepTr;}

    $.each(producePrepareOrders, function (n, k) {
        // if(!i){i=n;}
        if(!stepTr){i=n;}
        var cententSize=k.content;
        if(cententSize.length>30){
            cententSize=cententSize.slice(0,30)+"...";
        }
        var expectNum=accMul(k.expectStaff,parseFloat(k.expectHour));
        // var totalNum=accMul(k.totalStaff,parseFloat(k.totalTime));

        var totalStaff=0;
        var totalHour=0;
        var totalTime=k.totalTime;
        var totalTimeAll=0;
        if(totalTime>0){
            var staff=k.totalStaff/totalTime;
            var hour=k.totalHour/k.totalStaff;

            totalStaff=staff.toFixed(2);
            totalHour=hour.toFixed(2);
            totalTimeAll=k.totalHour/totalTime;
            totalTimeAll=totalTimeAll.toFixed(2);
        }

        if(!k.otherCase){
            k.otherCase="";
        }

        var html=`<tr style="border: none">
            <td colspan="4" class="addTrBorder">
                <table border="1" cellpadding="0" cellspacing="0" style="padding-top:10px;"
                       width="100%"
                       class="propContent">
                    <tr>
                        <td style="width: 120px" class="td-line30-with-bg prodTitle">生产准备单编号：</td>
                        <td colspan="2">${k.no}</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">机型/动力类型：</td>
                        <td colspan="2">${k.model}</td>
                        <td style="text-align: right;">
                            <a style="margin-right: 20px;cursor: pointer;color:#0033FF;display: none" class="delProdPrep" 
                            onclick="delProdPrepSheet(this,${addTrNum},${toType})">删除</a>
                            <span class="ppoId" style="display: none">${k.id}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-line30-with-bg prodTitle">飞机号：</td>
                        <td colspan="2" style="width: 160px" class="addProdPrepFleet">${k.fleet}</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">版本：</td>
                        <td colspan="3">R${k.version}</td>
                    </tr>
                    <tr>
                        <td class="td-line30-with-bg prodTitle">工作内容：</td>
                        <td colspan="2" title="${k.content}">${cententSize}</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">参考依据：</td>
                        <td colspan="3">${k.category+" "+k.title} </td>
                    </tr>
                    <tr class="wofDetails_${s_params.addTrNum}">
                        <td class="td-line30-with-bg prodTitle">计划人工时：</td>
                        <td colspan="2">${k.expectStaff}人 X  ${k.expectHour}小时</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">计划总工时：</td>
                        <td colspan="3">${expectNum}人工时</td>
                    </tr>
                    <tr>
                        <td class="td-line30-with-bg prodTitle">历史平均人工时：</td>
                        <td colspan="2">${totalStaff}人 X  ${totalHour}小时</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">平均总工时：</td>
                        <td colspan="3">${totalTimeAll}人工时</td>
                    </tr>
                    <tr>
                        <td class="td-line30-with-bg prodTitle">特殊测试需求：</td>
                        <td colspan="7">
                            <table width="100%" id="materialTrBorder">
                                <tr>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_1" class="chechBoxs" disabled>顶升飞机
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_2" class="chechBoxs" disabled>发动机试慢车
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_3" class="chechBoxs" disabled>发动机试慢车以上
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_4" class="chechBoxs" disabled>拖行飞机
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_5" class="chechBoxs" disabled>进入燃油箱
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_6" class="chechBoxs" disabled>结构人员
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_7" class="chechBoxs" disabled>高空车需求
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_8" class="chechBoxs" disabled>机库需求
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_9" class="chechBoxs" disabled>大风限制
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_10" class="chechBoxs" disabled>低温限制
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_11" class="chechBoxs" disabled>天气限制
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_12" class="chechBoxs" disabled>雷雨限制
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_13" class="chechBoxs" disabled>大雨限制
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${i}_14" class="chechBoxs" disabled>NDT需求
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="checkbox" id="chechBoxOther_${addTrNum}" class="chechBoxs" disabled>其他限制
                                    </td>
                                </tr>
                                <tr class="otherR_P">
                                    <td colspan="8">
                                        <div id="otherR_${addTrNum}" 
                                        style="border: 1px solid #ccc;height: 80px;width: 100%;">${k.otherCase}</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr class="addMaterialBtn_${i}_${addTrNum}"><td colspan="8"></td></tr>
                </table>
            </td>
        </tr>`;



        if(toType=="1"){
            var ele=`<td style="display: none;"><input value="${k.id}" name="toTroubleShootings[${Number(addTrNum)-1}].ppoId"/></td>`;
            $(".addStep_tr_"+addTrNum).append(ele);
            $(".addStep_tr_"+addTrNum).after(html);
            $(".addStep_tr_"+addTrNum).next().attr("class","Step_tr_"+addTrNum);
            if(view=="view1"){
                $(".addTrBorder").prop("colspan",8);
            }

            if(stepDetails&&stepDetails instanceof Array &&stepDetails.length>0){
                var realStaff=stepDetails[0].realStaff;
                var realHour=stepDetails[0].realHour;
                var realSum=accMul(realStaff,realHour);
                var ele1=`<tr>
                        <td class="td-line30-with-bg prodTitle">实际人工时：</td>
                        <td colspan="2">${realStaff}人 X  ${realHour}小时</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">实际总工时：</td>
                        <td colspan="3">${realSum}人工时</td>
                    </tr>`;
                $(".wofDetails_"+s_params.addTrNum).after(ele1);
            }


        }else if(toType=="2"){
            $("tr.showProdPrepBtn").after(html);
            $('tr.showProdPrepBtn').next().attr("class","addProdPrep_tr");
            isModel=k.model;
        }else{
            $("tr.showProdPrepBtn").after(html);
        }

        if(toType=="3"||toType=="2"){
            var ppoId = $.trim($("#ppoId").val());
            if (ppoId) {
                $("#ppoId").val(k.id+","+ppoId);
            } else {
                $("#ppoId").val(k.id);
            }

            wodfDetails(k.id);//显示实际反馈工时

        }


        var cases=k.cases;
        if(cases){
            cases.map(function(item){
                $('#chechBox_'+i+'_'+item.caseNo).prop("checked", true);
            });
        }

        if(k.otherCase){
            $("#chechBoxOther_"+addTrNum).prop("checked", true);
        }else{
            $('#otherR_'+addTrNum).parent().parent().hide();
        }
        if(pageType=="edit"){//查看时不需要显示航材
            $(".delProdPrep").show();
            var materials=k.materials;
            if(materials instanceof Array&&materials.length>0){
                addMaterialTitle(materials,i,addTrNum,toType,"toCommon");
            }
        }


        s_params.addTrNum+=1;

    });

}

//显示执行反馈实际工时
function  wodfDetails(id){
    var addTrNum=s_params.addTrNum;
    $.each(workOrderFeedbackDetails,function (k,v) {
            if(id==v.orderId){
                var realStaff=v.realStaff;
                var realHour=v.realHour;
                var realSum=accMul(realStaff,realHour);
                var ele1=`<tr>
                        <td class="td-line30-with-bg prodTitle">实际人工时：</td>
                        <td colspan="2">${realStaff}人 X  ${realHour}小时</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">实际总工时：</td>
                        <td colspan="3">${realSum}人工时</td>
                    </tr>`;
                $(".wofDetails_"+addTrNum).after(ele1);
            }
    });
}

function initToGrabs() {
    var html = '';
    $.each(toGrabs, function (i, v) {
        html += '<tr>';
        html += '<td class="td-line30-center" style="display:none;">' + (i + 1) + '</td>';
        html += '<td class="td-line30-center">';
        html += '<input maxlength="600" name="toGrabs[' + i + '].name" style="width: 90%;height: 20px" type="text" ' +
            'value="' + v.name + '"/>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<input maxlength="100" name="toGrabs[' + i + '].pn" style="width: 80%;height: 20px" type="text" ' +
            'value="' + v.pn + '"/>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<input maxlength="100" name="toGrabs[' + i + '].sn" style="width: 80%;height: 20px" type="text" ' +
            'value="' + v.sn + '"/>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<input maxlength="100" name="toGrabs[' + i + '].qty" style="width: 80%;height: 20px" type="text" ' +
            'value="' + v.qty + '"/>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<input maxlength="100" name="toGrabs[' + i + '].unit" style="width: 80%;height: 20px" type="text" ' +
            'value="' + v.unit + '"/>';
        html += '</td>';
        html += '<td class="td-line30-center" style="display:none;">';
        html += '<input name="toGrabs[' + i + '].id" type="hidden" value="' + v.id + '"/>';
        html += '</td>';
        html += '</tr>';
    });
    $("#toGrabsHtml").after(html);
}


function viewRevision() {
    if(isNewest && toBaseInfoVO.editStatus == 5 &&
        (toBaseInfoVO.executionStatus == 1 || toBaseInfoVO.executionStatus == 2
            || toBaseInfoVO.executionStatus == 3)) {
        let html = '<input id="new_reversion_btn" type="button" value="New Reversion"/>';
        $("#revision_span").after(html);
    }
}

function viewToBaseInfoVO() {
    $("#dmType").val(toBaseInfoVO.dmType);
    $("#toBaseInfoId").val(toBaseInfoVO.id);
    $("#toNumber").text(filterNull(toBaseInfoVO.toNumber));
    $("#revNo").val(toBaseInfoVO.revNo);
    $("#revNoSpan").text(toBaseInfoVO.revNo);
    $("#skill").text(filterNull(toBaseInfoVO.skill));
    $("#model").text(filterNull(toBaseInfoVO.model));
    $("#tail").text(filterNull(toBaseInfoVO.acReg));
    $("#ata").text(filterNull(toBaseInfoVO.ata));
    $("#description").val(filterNull(toBaseInfoVO.description));
    $("#remark").val(filterNull(toBaseInfoVO.remark));
    $("#defectId").val(toBaseInfoVO.defectId);
    $("#defectId_a").text(filterNull(toBaseInfoVO.defectNo));
    $("#subject").val(filterNull(toBaseInfoVO.subject));
    $("#other").val(filterNull(toBaseInfoVO.other));
    $("#totalNumber").text(toBaseInfoVO.totalNumber);
    $("#notIssued").text(toBaseInfoVO.notIssued);
    $("#haveIssued").text(toBaseInfoVO.haveIssued);
    $("#haveFeedback").text(toBaseInfoVO.haveFeedback);
    $("#actionAndFeedback").text(filterNull(toBaseInfoVO.actionAndFeedback));
    $("#sta").text(filterNull(toBaseInfoVO.sta));
    $("#submitterNameSn").text(filterNull(toBaseInfoVO.submitterNameSn));
    $("#createTime").text(filterNull(toBaseInfoVO.createTime));
    $("#mechNameSn").text(filterNull(toBaseInfoVO.mechNameSn));
    $("#mechDate").text(filterNull(toBaseInfoVO.mechDate));
    $("#deadline").text(filterNull(toBaseInfoVO.deadline));
    //设置editStatus的值
    var editStatus = toBaseInfoVO.editStatus;
    if (editStatus == '0') {
        $("#editStatus").text('Waiting');
    } else if (editStatus == '1') {
        $("#editStatus").text('Editing');
    } else if (editStatus == '2') {
        $("#editStatus").text('Checking');
    } else if (editStatus == '3') {
        $("#editStatus").text('Approving');
    } else if (editStatus == '4') {
        $("#editStatus").text('Approved');
    } else if (editStatus == '5') {
        $("#editStatus").text('Active');
    } else if (editStatus == '6') {
        $("#editStatus").text('Superseded');
    } else if (editStatus == '7') {
        $("#editStatus").text('Canceling');
    } else if (editStatus == '8') {
        $("#editStatus").text('Canceled');
    }
    //设置executionStatus的值
    var executionStatus = toBaseInfoVO.executionStatus;
    if (executionStatus == '1') {
        $("#executionStatus").text('open');
    } else if (executionStatus == '2') {
        $("#executionStatus").text('process');
    } else if (executionStatus == '3') {
        $("#executionStatus").text('complete');
    } else if (executionStatus == '4') {
        $("#executionStatus").text('close');
    }
    //设置Feedback Requests的值
    var feedbackRequests = toBaseInfoVO.feedbackRequests;
    if (feedbackRequests == '1') {
        $("#yes").attr("checked", true);
    } else if (feedbackRequests == '0') {
        $("#no").attr('checked', true);
    }
    //设置Source Type的值
    var sourceType = toBaseInfoVO.sourceType;
    if (sourceType == 0) {
        $("#sourceType_mcc").attr("checked", true);
    } else if (sourceType == 1) {
        $("#sourceType_ppc").attr('checked', true);
    } else if (sourceType == 2) {
        $("#sourceType_ts").attr('checked', true);
    }

    //设置Type的值
    var type = toBaseInfoVO.type;
    if (type == '3') {
        $("#type").text('飞机检查/维护类');
    } else if (type == '4') {
        $("#type").text('生产保障类');
    }else if (type == '5') {
        $("#type").text('串件类');
    }else if (type == '6') {
        $("#type").text('串件恢复类');
    }
    $("#grabNo").val(filterNull(toBaseInfoVO.grabNo));
    $("#grabSource").val(filterNull(toBaseInfoVO.grabSource));
    $("#grabPn").val(filterNull(toBaseInfoVO.grabPn));
    $("#grabSn").val(filterNull(toBaseInfoVO.grabSn));
    $("#grabRemark").val(filterNull(toBaseInfoVO.grabRemark));
}

function viewFeedback() {
    if(defectBaseInfoView != null && "O" == defectBaseInfoView.status) {
        var html = "";
        html += '<button onclick="editFeedback()" style="margin-left: 650px;">Edit Feedback</button>';
        html += '<button onclick="saveFeedback()" style="margin-left: 10px;">Save Feedback</button>';
        $("#feedback_span").after(html);
    }
}

function viewTroubleShooting() {
    var html = '';
    $.each(toTroubleShootingMap, function (i, v) {
        html += '<tr class="addStep_tr_'+(i + 1)+'">';
        html += '<td class="td-line30-center">' + v.STEP + '</td>';
        html += '<td class="td-line30-center">';
        html += '<textarea readonly="readonly" rows="4" style="width: 99.5%;background-color: #f0f0f0">' + v.SUGGESTION + '</textarea>';
        html += '</td>';
        html += '<td class="td-line30-center">' + v.ENGINEER_NAME_SN + '</td>';
        html += '<td class="td-line30-center">' + v.EDIT_DATE + '</td>';
        html += '<td class="td-line30-center">';
        html += '<textarea rows="4" style="width: 99.5%;background-color: #f0f0f0" readonly="readonly" class="feedback" ' +
            'id="' + v.ID + '">' + (filterNull(v.ACTION_AND_FEEDBACK)) + '</textarea>';
        html += '<input id="feedback' + i + '" type="hidden" value="' + v.ACTION_AND_FEEDBACK + '"/>';
        html += '</td>';
        html += '<td class="td-line30-center">' + (filterNull(v.MECH_NAME_SN)) + '</td>';
        html += '<td class="td-line30-center">' + (filterNull(v.MECH_DATE)) + '</td>';
        html += '<td class="td-line30-center">' + (filterNull(v.STA)) + '</td>';
        html += '</tr>';
    });
    $("#troubleShootingHtml").after(html);


    //排故类TO显示已挂准备单
    $.each(toTroubleShootingMap, function (i, v) {
        if(v.producePrepareOrders&&v.producePrepareOrders.length>0){
            var stepTr=i+1;
            initProducePrepareOrders(stepTr,v.producePrepareOrders,v.workOrderFeedbackDetails,"view1",);
        }
    });

}

function viewToTroubleShootingMt() {
    var html = '';
    $.each(toTroubleShootingMtMap, function (i, v) {
        html += '<tr>';
        html += '<td class="td-line30-center">' + v.TYPE_ + '</td>';
        html += '<td class="td-line30-center">' + v.NAME_ + '</td>';
        html += '<td class="td-line30-center">' + v.PN_OFF + '</td>';
        html += '<td class="td-line30-center">' + v.SN_OFF + '</td>';
        html += '<td class="td-line30-center">' + v.PN_ON + '</td>';
        html += '<td class="td-line30-center">' + v.SN_ON + '</td>';
        html += '<td class="td-line30-center">' + v.POSITION + '</td>';
        html += '<td class="td-line30-center">';
        $.each(toTroubleShootingMap, function (j, vv) {
            if (vv.ID == v.SETUP_ID) {
                vv.STEP
            }
        });
        html += '</td>';
        html += '</tr>';
    });
    $("#toTroubleShootingMtHtml").after(html);
}

function viewAttachments() {
    let params = {
        "sourceId": $("#toBaseInfoId").val(),
        "fileCategory": getFeedbackFileCategory()
    };
    let actionUrl = basePath + '/api/v1/mccdoc/to_base_info/searchAttachment';
    $.ajax({
        url: actionUrl,
        type: "get",
        cache: false,
        dataType: "json",
        data: params,
        async: false,
        success: function (data) {
            if (data.code == 200) {
                attachments = data.data;
                var html = '';
                $.each(attachments, function (i, v) {
                    html += '<tr>';
                    html += '<td class="td-line30-center">' + v.orgName + '</td>';
                    html += '<td class="td-line30-center">' + v.fileContentType + '</td>';
                    html += '<td class="td-line30-center">' + v.ernam + '</td>';
                    html += '<td class="td-line30-center">' + v.erdat + '</td>';
                    html += '<td class="td-line30-center">';
                    html += '<div class="ui_buttons">';
                    var down = basePath + "/api/v1/mccdoc/to_base_info/downloadAttachment?pkid=" + v.pkid + "&down=true";
                    html += '<input onclick="location=' + down + '" type="button" value="Download"/>';
                    html += '</div>';
                    html += '</td>';
                    html += '</tr>';
                });
                $("#attachmentHtml").after(html);
            }
        }
    });

}

function viewToMaterialTools() {
    var html = '';
    $.each(toMaterialToolss, function (i, v) {
        html += '<tr>';
        html += '<td class="td-line30-center">';
        html += '<textarea readonly="readonly" rows="2" style="width: 99.5%;background-color: #f0f0f0">' + v.name + '</textarea>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<textarea readonly="readonly" rows="2" style="width: 99.5%;background-color: #f0f0f0">' + v.pn + '</textarea>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        if (v.type == 2) {
            html += '<input checked="checked" disabled="disabled" style="vertical-align: middle;" type="checkbox"/>&nbsp;&nbsp;工具';
        } else {
            html += '<input disabled="disabled" style="vertical-align: middle;" type="checkbox"/>&nbsp;&nbsp;工具';
        }
        html += '</td>';
        html += '<td class="td-line30-center">' + v.qty + '</td>';
        html += '<td class="td-line30-center">' + v.unit + '</td>';
        html += '</tr>';
    });
    $("#toMaterialToolsHtml").after(html);
}

function viewGrabs() {
    var html = '';
    $.each(toGrabs, function (i, v) {
        html += '<tr>';
        html += '<td class="td-line30-center">';
        html += '<span readonly="readonly" rows="2" style="width: 99.5%;background-color: #f0f0f0">' + v.name + '</span>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<span readonly="readonly" rows="2" style="width: 99.5%;background-color: #f0f0f0">' + v.pn + '</span>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<span readonly="readonly" rows="2" style="width: 99.5%;background-color: #f0f0f0">' + v.sn + '</span>';
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<span readonly="readonly" rows="2" style="width: 99.5%;background-color: #f0f0f0">' + v.qty + '</span>';
        html += '</td>';
        html += '<span readonly="readonly" rows="2" style="width: 99.5%;background-color: #f0f0f0">' + v.unit + '</span>';
        html += '</tr>';
    });
    $("#toGrabsHtml").after(html);
}

function viewToApplicabilityForSurvey() {
    let html = '';
    $.each(toApplicabilityForSurveyMap, function (i, v) {
        html += '<tr>';
        html += '<td class="td-line30-center">';
        if (toBaseInfoVO.editStatus == 5 && v.executionStatus == 1) {
            if (isNewest == 'true') {
                html += '<div alt="下发TO" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" ' +
                    'onclick="issuedTo(' + toBaseInfoVO.id + ',\'' + toBaseInfoVO.toNumber + '\',\'' + toBaseInfoVO.feedbackRequests + '\',' + v.ID + ',\'' + v.TAIL + '\')" style="float:left;padding-left:8px;cursor: pointer;" title="下发TO"><span class="ui-icon-issued"></span></div>';
                html += '<div alt="关闭TO" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" ' +
                    'onclick="closeTo(' + toBaseInfoVO.id + ',' + v.ID + ')" style="float:left;padding-left:8px;cursor: pointer;" title="关闭TO"><span class="ui-icon ui-icon-power"></span></div>';
            }
        }
        html += '</td">';
        html += '<td class="td-line30-center">' + v.TAIL + '</td>';
        let title = "";
        if (v.REMARK != '' && v.REMARK != null) {
            title = v.REMARK;
        }
        html += '<td class="td-line30-center" title="' + title + '" >' + (v.EXECUTION_STATUS == null ? "" : v.EXECUTION_STATUS) + '</td>';
        html += '<td class="td-line30-center">' + v.ENGINEER + '</td>';
        html += '<td class="td-line30-center">' + v.CREATE_TIME + '</td>';
        html += '<td class="td-line30-center">';
        html += '<textarea readonly="readonly" rows="4" style="width: 99.5%;background-color: #f0f0f0">' + (v.ACTION_AND_FEEDBACK == null ? "" : v.ACTION_AND_FEEDBACK) + '</textarea>';
        html += '</td>';
        html += '<td class="td-line30-center">' + (v.MECH_NAME_SN == null ? "" : v.MECH_NAME_SN) + '</td>';
        html += '<td class="td-line30-center">' + (v.MECH_DATE == null ? "" : v.MECH_DATE) + '</td>';
        html += '<td class="td-line30-center">' + (v.STA == null ? "" : v.STA) + '</td>';
        html += '<td class="td-line30-center">';
        if(v.wsAttachmentList) {
            $.each(v.wsAttachmentList, function (j, vv) {
                let down = basePath + "/api/v1/mccdoc/to_base_info/downloadAttachment?pkid=" + vv.pkid + "&down=true";
                html += '<a href="' + down + '" id="' + vv.pkid + '" ' +
                    'style="color: blue;">' + vv.orgName + '</a><br/>';
            });
        }
        html += '</td>';
        html += '<td class="td-line30-center">';
        html += '<img alt="View PDF" onclick="exportPDF(\'' + toBaseInfoVO.id + '\',\'' + v.ID + '\',\'' + v.TAIL + '\')" src="/images/pdf_icon.gif" style="cursor: pointer;" title="View PDF"/>';
        html += '</td>';
        html += '</tr>';
    });
    $("#toApplicabilityForSurveyHtml").after(html);
}

function viewAttachmentsOther() {
    if(feedBackAttachment) {
        let html = '';
        $.each(feedBackAttachment, function (i, v) {
            let down = basePath + "/api/v1/mccdoc/to_base_info/downloadAttachment?pkid=" + v.pkid + "&down=true";
            html += '<a href="' + down + '" style="color: blue;">' + v.orgName + '</a><br/>';
        });
        $("#attachmentHtml").append(html);
    }
}

function filterNull(val) {
    return val == null ? "" : val;
}

function getDefectByIdOrNo() {
    let defectId;
    if(sub_win) {
        defectId = s_params["defectId"];
    } else {
        defectId = s_params.defectId;
    }
    let actionUrl = basePath + "/api/v1/defect/defect_base_info/viewById";
    let params = {
        "id": defectId
    };
    $.ajax({
        url: actionUrl,
        type: "post",
        data: params,
        dataType: "json",
        async: false,
        cache: false,
        success: function (data) {
            if(data.code != 200) {
                alert(data.msg);
                return;
            }
            defectBaseInfoView = data.data.defectBaseInfoView;
        }
    });

}

function initAddTOBaseInfoVO() {
    $("#defectId").val(defectBaseInfoView.id);
    $("#defectNo").val(filterNull(defectBaseInfoView.defectNo));
    $("#model").val(filterNull(defectBaseInfoView.model));
    $("#acId").val(filterNull(defectBaseInfoView.acId));
    $("#acReg").val(filterNull(defectBaseInfoView.acReg));
    $("#ata").val(filterNull(defectBaseInfoView.ata));
    $("#dmStatus").val(filterNull(defectBaseInfoView.dmStatus));
    if("y" == filterNull(defectBaseInfoView.dm)) {
        $("#dmType").val("DM");
    } else {
        $("#dmType").val("n");
    }

    //故障页面直接打开add TO页面,机型和飞机号都存在的时候，才显示添加准备单的按钮
    if(filterNull(defectBaseInfoView.model)&&filterNull(defectBaseInfoView.acReg)){
        if($(".isolate_prodPrep")){ //显示 添加生产准备单按钮
            $(".isolate_prodPrep").show();
        }
    }


}


$(function () {
    //获取数据字典
    getDataDictionary();
    if(pageType == "add") {
        if(sub_win) {
            defectId = s_params["defectId"];
        } else {
            defectId = s_params.defectId;
        }
        if(toType == "1" && defectId) {
            getDefectByIdOrNo();
            initAddTOBaseInfoVO();
        }
        initSourceType();
    } else if(pageType == "edit") {
        //初始化获取数据
        initToData();
        initToBaseInfoVO();
        if (toType == "1") {
            initTroubleShooting();
            initToMaterialTools();
        }
        if (toType == "2") {
            initToApplicabilityForSurvey();
            initToMaterialTools();
            initProducePrepareOrders();
        }
        if (toType == "3" || toType == "4") {
            initToMaterialTools();
            initProducePrepareOrders();
        }
        if (toType == "5" || toType == "6") {
            initToGrabs();
        }

    } else if (pageType == "view") {
        //初始化获取数据
        initToData();
        viewToBaseInfoVO();
        viewRevision();
        if (toType == "1") {
            viewFeedback();
            viewTroubleShooting();
            viewToTroubleShootingMt();
            viewAttachments();
            viewToMaterialTools();
        }
        if (toType == "2") {
            viewToMaterialTools();
            viewToApplicabilityForSurvey();
            initProducePrepareOrders();
        }
        if (toType == "3" || toType == "4") {
            viewToMaterialTools();
            viewAttachmentsOther();
            initProducePrepareOrders();
        }
        if (toType == "5" || toType == "6") {
            viewGrabs();
            viewAttachmentsOther();
        }

    }else if(pageType =="close")
    {
        if(toType=="1")
        {
            initCloseToData();
            initDefCloseToBaseInfoVO();
            /* initTroubleShooting();*/
            viewAttachments();
            feedTroubleShooting();
            feedStepNo();

        }
    }

    // update by yy(616042) 2018-4-8 to增加DM标识，因涉及9个jsp，然同时都调用了此JS，所以标识放在此JS中进行加载
    var _dis = $('[name="toBaseInfo.feedbackRequests"]').attr('disabled');
    var _dm = $('[name="toBaseInfo.dmType"]');
    if (_dm && _dm.length > 0) {
        var _dmText = '&nbsp;&nbsp;&nbsp; <input type="checkbox" :_dis :chk  name="toBaseInfo.dmType" value="DM"/> DM';
        ggy_tails = $(_dm).attr('tails') || '';
        _dmText = '<tr><td width="20%" class="td-line30-with-bg">DM:</td><td width="30%">';
        _dmText += '<input type="radio" class="tb_dm_radio" :_dis _chk_y name="toBaseInfo.dmType" value="DM"/>Yes';
        _dmText += '<input type="radio" class="tb_dm_radio" :_dis _chk_n name="toBaseInfo.dmType" value="n"/>No<div class="errorMessage"></div>';
        _dmText += '</td><td width="20%" class="td-line30-with-bg"></td><td width="30%"></td></tr>';
        if (_dis) {
            _dmText = _dmText.replace(/:_dis/ig, 'disabled=disabled')
        } else {
            _dmText = _dmText.replace(/:_dis/ig, '')
        }
        if (_dm.val().indexOf('DM') != -1) {
            _dmText = _dmText.replace('_chk_y', 'checked=checked');
            _dmText = _dmText.replace('_chk_n', '')
        } else if (_dm.val().indexOf('n') != -1) {
            _dmText = _dmText.replace('_chk_y', '');
            _dmText = _dmText.replace('_chk_n', 'checked=checked')
        }
        if ($('.td_to_tail').length == 0) {
            if ($('#dm_type_id').length > 0) {
                $('#dm_type_id').html('').append($(_dmText).find(':radio').closest('td').html());
            } else {
                if ($('#select_ac').length > 0) {
                    $(_dmText).insertBefore($('#select_ac').closest('tr'));
                } else {
                    $(_dmText).insertBefore($('[name="toBaseInfo.acReg"]').closest('tr'));
                }
            }
        } else {
            $(_dmText).insertBefore($('.td_to_tail').closest('tr'));
        }

        _dm.remove();
    }
    //end
    //
    $('[name="del"]').live("click", function () {
        $(".tb_dm_radio").nextAll("div").empty();
    });
    //选择飞机
    $("#select_ac").live("click", function () {
        $(".tb_dm_radio").nextAll("div").empty();
        //已经选择过的飞机ID
        var acIds = $("input[name^='toApplicabilityForSurveys'][name$='acId']").map(function () {
            return $(this).val();
        }).get().join(',');

        //需要显示的飞机状态
        var acStatus = ["Running"];
        var actionUrl = '/views/mccdoc/aircraft_tree.shtml';
        P.$.dialog({
            title: 'Select Aircraft',
            width: '690px',
            height: '400px',
            top: '10%',
            esc: true,
            cache: false,
            max: false,
            min: false,
            parent: this,
            content: 'url:' + actionUrl,
            data: {
                "acIds": acIds,
                "acStatus": acStatus,
                "multipleSelect": $("#isMultipleSelect").val() == "false" ? false : true
            },
            close: function () {
                if (this.data['acId']) {
                    //单选
                    if ($("#isMultipleSelect").val() == "false") {
                        //已挂准备单，校验机型和机号是否适用准备单
                        var validFleet=validFleetType("fleet",this.data['tail']);
                        if(!validFleet){
                            return;
                        }
                        //每次重新选择飞机都把故障单号ID清空
                        $("#defectId").val("");
                        $("#defectNo").val("");

                        $("#acId").val(this.data['acId']);
                        $("#acReg").val(this.data['tail']);
                        $("#model").val(this.data['topAcType']);


                        if($("#toAddProdPrep")){
                            $("#toAddProdPrep").show();
                            $(".toAddProdPrep").hide();
                        }


                        //触发飞机号的blur事件
                        $("#acReg").trigger("blur");
                        //多选
                    } else {


                        var acIds = this.data['acId'].split(",");
                        var acTypes = this.data['acType'].split(",");
                        var tails = this.data['tail'].split(",");
                        var statuss = this.data['status'].split(",");
                        var topAcType=this.data['topAcType'];
                        //设置大机型的值
                        $("#model").val(this.data['topAcType']);
                        console.log("data:",this.data);
                        for (i = 0; i < acIds.length; i++) {
                            add_aircraft(acIds[i], acTypes[i], tails[i], statuss[i],topAcType);
                        }
                    }
                }
            }
        });
    });

    //给textarea加maxlength属性,主要是解决IE不支持maxlength属性问题
    $("textarea[maxlength]").bind("input propertychange", function () {
        var maxLength = $(this).attr("maxlength");
        if ($(this).val().length > maxLength) {
            $(this).val($(this).val().substring(0, maxLength));
        }
    });

    //判断必填字段是否有值
    $(":input").blur(function () {

        if ($(this).nextAll("div.errorMessage").length > 0) {

            $(this).nextAll("div.errorMessage").text("");

            if ($(this).val() == "") {
                var errMsg = '<span class="error">This field is required.</span>';
                $(this).nextAll("div.errorMessage").append(errMsg);
            }

            var max = $(this).attr('maxlength');
            var len = $.trim($(this).val()).length;

            if (typeof (maxlength) != undefined && max < len) {
                var lengthErr = '<span class="error">This field\'s max length is {0}.</span>';
                lengthErr = lengthErr.replace("{0}", max);
                $(this).nextAll("div.errorMessage").append(lengthErr);
            }

            //class等于number表明是数字
            if ($(this).attr('class') == "number" && isNaN($.trim($(this).val()))) {
                var numberErrMsg = '<span class="error">Please enter only digits.</span>';
                $(this).nextAll("div.errorMessage").append(numberErrMsg);
            }

        }
    });

    //改版按钮
    $("#new_reversion_btn").live("click", function () {
        P.$.dialog.confirm("New Revision?", function () {
            $("#new_reversion_btn").attr("disabled", "disabled");
            let executionStatus = $("input[name='toBaseInfo.executionStatus']").val();
            if (executionStatus == "2") {
                P.$.dialog.alert('请确认是否已经和工作者取得联系!', function () {
                    var id = $("input[name='toBaseInfo.id']").val();
                    var revNo = $("input[name='toBaseInfo.revNo']").val();
                    var params = {"toBaseInfo.id": id, "toBaseInfo.revNo": revNo};
                    $.ajax({
                        url: basePath + "/api/v1/mccdoc/to_base_info/newRevision",
                        type: "post",
                        cache: false,
                        dataType: "json",
                        data: params,
                        success: function (data) {
                            if (data.code == 200) {
                                P.$.dialog.alert("New Revision Success", function () {
                                    sub_win.close();
                                });
                            } else {
                                P.$.dialog.alert(data.msg, function () {
                                    sub_win.close();
                                });
                            }
                        },
                        error: function () {
                            P.$.dialog.alert('New Revision Error!', function () {
                                sub_win.close();
                            });
                        }
                    });
                });
            } else {
                var id = $("input[name='toBaseInfo.id']").val();
                var revNo = $("input[name='toBaseInfo.revNo']").val();
                var params = {"toBaseInfo.id": id, "toBaseInfo.revNo": revNo};
                $.ajax({
                    url: basePath + "/api/v1/mccdoc/to_base_info/newRevision",
                    type: "post",
                    cache: false,
                    dataType: "json",
                    data: params,
                    success: function (data) {
                        if (data.code == 200) {
                            P.$.dialog.alert("New Revision Success", function () {
                                sub_win.close();
                            });
                        } else {
                            P.$.dialog.alert(data.msg, function () {
                                sub_win.close();
                            });
                        }
                    },
                    error: function () {

                        P.$.dialog.alert('New Revision Error!', function () {
                            sub_win.close();
                        });
                    }
                });
            }

        }, function () {
        }, this);
    });

    //生产保障类 清除ACID
    $("#CleanAcId").live("click", function () {
        $("#acId").val("");
        $("#acReg").val("");
        $("#model").val("");
    });

    //上传文件
    $("#upload_detail_btn").click(function () {
        var rowId = $("#toBaseInfoId").val();
        var type = $("#toBaseInfoType").val();
        var parameters = {
            "id": rowId,
            "type": type
        };
        P.$.dialog({
            title: 'Upload Attachment',
            width: "600px",
            height: "200px",
            top: "15%",
            esc: true,
            cache: false,
            max: false,
            min: false,
            lock: true,
            parent: sub_win,
            close: function () {
                // 关闭后是否标注为要刷新
                if (this.data['reload'] && this.data['reload'] == true) {
                    //重加载页面数据
                    $("#qc_table_detail #appendTr").remove();
                    searchAttachment();
                }
            },
            content: 'url:/views/mccdoc/edit/upload_attachment_to.shtml',
            data: parameters
        });
    });
    //初始化附件
    searchAttachment();
    //所有编辑页面的件号框和搜索件号按钮的控制
    $("#material_tool_select_table").find("tr:gt(1)").each(function () {
        var _tds = $(this).children();
        if ($($(_tds).eq(3).find("input")).attr("checked")) {
            $(_tds).eq(2).find("img").hide();
            $(_tds).eq(2).find("input").removeAttr("readonly");
            $(_tds).eq(1).find("input").removeAttr("readonly");
        } else {
            $(_tds).eq(2).find("img").show();
            $(_tds).eq(2).find("input").attr("readonly", "readonly");
            //$(_tds).eq(1).find("input").attr("readonly","readonly");
        }
    });
});

function checkDMfn() {
    // debugger
    var _cur_tail = $('#acReg').val();
    $(".tb_dm_radio").nextAll("div").empty();
    if ($('.tb_dm_radio').length > 0) {
        var to_type = $('[name="toBaseInfo.type"]').val();
        var isGGYTail = false;
        if (to_type == 2) {
            var tail_tds = $('#aircraft_select_table').find('tr').find('td:eq(3)');
            $.each(tail_tds, function (i, e) {
                if ($(e).text()) {
                    if (ggy_tails.indexOf($(e).text()) != -1) {
                        isGGYTail = true;
                        return false;
                    }
                }
            })
        } else if (to_type == 4 || to_type == 3 || to_type == 1 || to_type == 5 || to_type == 6) {

            if (_cur_tail && ggy_tails.indexOf(_cur_tail) != -1) {
                isGGYTail = true;
            }
        }

        var errMsg = '<span class="error">This field is required.</span>';
        if (isGGYTail && !$(".tb_dm_radio:checked").val()) {
            $(".tb_dm_radio").nextAll("div.errorMessage").append(errMsg);
        }

    }

}

//选择故障跟踪单号
function checkDefectNo() {
    var defaultParam = {
        'qname': ["status"],
        'qoperator': ["in"],
        'qvalue': ["O,M"]
    };
    queryDefectDialog(defaultParam, function (rowdata, originalData, dlg) {
        //故障单ID
        var defectId = originalData.id;
        //故障单编号
        var defectNo = originalData.defectNo;
        //model
        var model = originalData.model;
        var acId = originalData.acId;
        //飞机编号
        var acReg = originalData.acReg;
        //ata
        var ata = originalData.ata;
        var actionUrl = basePath + "/api/v1/mccdoc/to_base_info/findTOBaseInfoIsExistByDefectId";
        var params = {
            "defectId": defectId
        };
        //检查故障单是否已经存在
        $.ajax({
            url: actionUrl,
            type: "post",
            data: params,
            dataType: "json",
            cache: false,
            success: function (obj) {
                if (obj.code == 200) {
                    if (obj.data.isExist) {
                        //已挂准备单，校验机型和机号是否适用准备单
                        var validFleet=validFleetType("Defect",acReg);
                        if(validFleet){
                            $("#defectId").val(defectId);
                            $("#defectNo").val(defectNo);
                            $("#model").val(model);
                            $("#acId").val(acId);
                            $("#acReg").val(acReg);
                            $("#ata").val(ata);
                            $("#defectNo").trigger("blur");
                        }

                        if($(".isolate_prodPrep")){ //显示 添加生产准备单按钮
                            $(".isolate_prodPrep").show();
                        }

                    } else {
                        P.$.dialog.alert('此飞机故障对应的排故TO已存在!');
                    }
                    dlg.close();
                } else {
                    P.$.dialog.alert(obj.msg);
                }
            }
        });
    });
}

function validFleetType(type,tail) {

    //校验准备单适用的机号
    var validFleet=true;
    var addProdPrepFleetAll=$(".addProdPrepFleet");
    addProdPrepFleetAll.each(function(i,v){//遍历所有准备单下的机号
        var prodPrepFleet=$.trim($(v).text());//获取准备单下的机号
        if(prodPrepFleet.indexOf(",")>-1){//如果准备单下的机号是多个
            var fleetArr=prodPrepFleet.split(",");
            if(fleetArr.indexOf(tail)<0){
                if(type=="Defect"){
                    P.$.dialog.alert('变更失败,请先删除准备单再更改机型和飞机号');
                }else{
                    MsgAlert({type:"error",content:"变更失败,请先删除准备单再更改机型和飞机号"});
                }

                validFleet=false;
            }
        }else if(prodPrepFleet!=tail){
            if(type=="Defect"){
                P.$.dialog.alert('变更失败,请先删除准备单再更改机型和飞机号');
            }else{
                MsgAlert({type:"error",content:"变更失败,请先删除准备单再更改机型和飞机号"});
            }

            validFleet=false;
        }
    });

    return validFleet;
}

//选择工具显示或隐藏单位
function selectTool(obj) {

    if ($(obj).attr("checked")) {
        //显示工具单位
        $(obj).parent().parent().find("div[name='unitName']").removeClass("hidden");
        //隐藏航材单位
        $(obj).parent().parent().find("div[name='materialName']").addClass("hidden");
        //清空前面选中单位的值
        // $(obj).parent().parent().find("div[name='materialName']").find("select").attr("value", "");

        //重置航材单位
        var option = "<option value=''>--------请选择--------</option>";
        $(obj).parent().parent().find("div[name='materialName']").find("select#materialNameSelect").empty();//清空上一次给下拉列表的赋值;
        $(obj).parent().parent().find("div[name='materialName']").find("select#materialNameSelect").append(option);
        //清空提示
        $(obj).parent().parent().find("div[name='materialName']").find(".error").remove();
        //名称输入框可以编辑
        $(obj).parent().parent().children().eq(1).find("input").removeAttr("readonly").val("");
        //件号框移除只读
        $(obj).parent().parent().children().eq(2).find("input").removeAttr("readonly");
        //搜索框移除单击事件
        $(obj).parent().parent().children().eq(2).find("img").hide();

        //选中工具就将值改为2
        $(obj).attr("value", "2");
    } else {
        //显示航材单位
        $(obj).parent().parent().find("div[name='materialName']").removeClass("hidden");
        //隐藏工具单位
        $(obj).parent().parent().find("div[name='unitName']").addClass("hidden");
        //清空前面选中单位的值
        $(obj).parent().parent().find("div[name='unitName']").find("select").attr("value", "");
        //清空提示
        $(obj).parent().parent().find("div[name='unitName']").find(".error").remove();
        //名称输入框只读
        $(obj).parent().parent().children().eq(1).find("input").attr("readonly", "readonly").val("");
        //件号输入框只读
        $(obj).parent().parent().children().eq(2).find("input").attr("readonly", "readonly");
        //搜索框增加单击事件
        $(obj).parent().parent().children().eq(2).find("img").show();
        //没选工具就将值改为1
        $(obj).attr("value", "1");
    }
    //清空件号信息
    $(obj).parent().parent().children().eq(2).find("input").val("");
}

//查询现有的附件信息
function searchAttachment() {
    var params = {
        "sourceId": $("#toBaseInfoId").val(),
        "fileCategory": getFileCategory()
    };
    var actionUrl = basePath + '/api/v1/mccdoc/to_base_info/searchAttachment';
    $.ajax({
        url: actionUrl,
        type: "get",
        cache: false,
        dataType: "json",
        data: params,
        async: false,
        success: function (data) {
            var content = "";
            if (data.code == 200) {
                $.each(data.data, function (i, v) {
                    var pageType = $("#pageType").val();
                    var down = basePath + "/api/v1/mccdoc/to_base_info/downloadAttachment?pkid=" + v.pkid + "&down=true";
                    content += "<tr id='appendTr'>";
                    content += "<td ><div align='center'><a href=" + down + ">" + v.orgName + "</a></div></td>";
                    content += "<td ><div align='center'>" + v.fileContentType + "</div></td>";
                    content += "<td ><div align='center'>" + v.ernam + "</div></td>";
                    content += "<td ><div align='center'>" + v.erdat + "</div></td>";
                    //查看页面不需要删除功能
                    if (pageType) {
                        content += "</tr>";
                    } else {
                        content += "<td ><div align='center' class='ui_buttons_upload' >" +
                            "<img width='18' height='19' onclick='deleteFile(" + v.pkid + ")' style='cursor:pointer' title='Delete' name='del' src='" + basePath + "/images/ico_cut.gif'>"
                            + "</div></td></tr>";
                    }
                });
            } else {
                content += "<tr id='appendTr'><td colspan='5'><div align='center'>No attachment available.</div></td></tr>";
            }
            $("#qc_table_detail").append(content);

        }
    });
}

//删除附件
function deleteFile(fileid) {
    var _url = basePath + "/api/v1/mccdoc/to_base_info/deleteAttachment";
    P.$.dialog.confirm('Delete Selected ?', function () {
        $.ajax({
            url: _url,
            type: "get",
            data: {'pkid': fileid},
            dataType: "json",
            cache: false,
            success: function (data) {
                if (data.code == 200) {
                    P.$.dialog.alert("Success");
                    $("#qc_table_detail #appendTr").remove();
                    searchAttachment();
                }
            }
        });
    }, function () {
    });
}

//新接口
function searchPnNumber($search, multi) {
    $.pnSelect({
        success: function (data) {
            var partno = data.partno;
            var chinesename = data.udchndesc;
            var englishname = data.descen;
            var name = chinesename + "  " + englishname;
            $($search).closest("tr").children("td:eq(1)").find("input").val(name);
            $($search).closest("tr").children("td:eq(1)").find("input").removeAttr("readonly");
            $($search).closest("tr").children("td:eq(1)").find("input").focus();
            $($search).closest("td").find("input").val(partno);
            $($search).closest("td").find("input").focus();

            var selectO=$($search).closest("tr").children("td:eq(5)").children("div:eq(0)").children("select");
            selectO.empty();//清空上一次给下拉列表的赋值
            // var option = "<option value=''>--------请选择--------</option>" +
            //              "<option value=\"+data.issueunit+\">"+data.issueunit+"</option>";
            var option = `<option value="${data.issueunit}">${data.issueunit}</option>`;
            selectO.append(option);

            if(data.allunit.split(",").length>1){
                selectO.empty();
                let unitMrIdHtml ="<option value=''>--------请选择--------</option>";

                $.each(data.allunit.split(","), function (i, v) {
                    unitMrIdHtml += `<option value="${v}">${v}</option>`;
                });
                selectO.append(unitMrIdHtml);
            }

        }
    });
}

function getFileCategory() {
    let fileCategory = "toProductionModule";
    if (toType == '1') {
        fileCategory = "toTroubleshootingModule";
    } else if (toType == '2') {
        fileCategory = "toSurveyModule";
    } else if (toType == '3') {
        fileCategory = "toMaintenanceModule";
    }else if(toType=='7'){
        fileCategory='giveBackAttachment';
    }
    return fileCategory;
}

function getFeedbackFileCategory() {
    let fileCategory = "toOtherAttachment";
    if(toType == '1') {
        fileCategory = "toFaultIsolateAttachment";
    } else if(toType == '2') {
        fileCategory = "toSurveyAttachment";
    }else if(toType=='7'){
        fileCategory="giveBackAttachment";
    }
    return fileCategory;
}


function initSourceType() {
    let url = basePath + "/api/v1/mccdoc/to_base_info/getSourceType";
    let data = {};
    $.ajax({
        url: url,
        type: "get",
        data: data,
        dataType: "json",
        cache: false,
        success: function (json) {
            if(json.code == 200) {
                $.each($("input[name='toBaseInfo.sourceType']"), function (i, v) {
                    if(v.value == json.data) {
                        $(v).attr("checked", true);
                    }
                });
            }
        }
    });
}

//处理乘法精度丢失
function accMul(arg1,arg2){
    if(!arg1||!arg2){
        arg1=0;
        arg2=0;
    }
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
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

    //设置UNIT中工具DIV的class
    _node.find("td:eq(5)").find("div[name='unitName']").attr("class", "hidden");
    //设置UNIT中航材DIV的class
    _node.find("td:eq(5)").find("div[name='materialName']").attr("class", "");
    //清空select输入框中的值
    _node.find("td:eq(5)").find("div[name='unitName']").find("select").val("");
    // _node.find("td:eq(5)").find("div[name='materialName']").find("select").val("");
    var selectOp=_node.find("td:eq(5)").find("div[name='materialName']").find("select");
    var option = "<option value=''>--------请选择--------</option>";
    selectOp.empty();
    selectOp.append(option);


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
        _node.find("td:eq(2)").find("input").attr("readonly", "readonly");
        //_node.find("td:eq(1)").find("input").attr("readonly","readonly");
    }
    _table.append(_node);
}


/**
 * 删除工具航材行
 */
function delete_material_tools_tr(_obj) {
    if ($("#material_tool_select_table").find("tr").length > 2) {
        if (confirm("你确定要删除当前行吗 ?")) {
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
                });
            }

        }
    }
}

//统计步骤的实际人工时

function realStaffHour(thiz,type){
    var sum=0;

    var own=$(thiz).val();
    if(Number(own)){
        if(type==1){
            $(thiz).val(parseInt(own));
        }else if(type==2){
            // var own2=parseFloat(own);
            var reg=/^\d{1,14}(\.\d{3,8})?$/.test(own);
            if(own.indexOf(".")>-1&&reg){
                var own2=parseFloat(own);
                $(thiz).val(own2.toFixed(2));
            }
        }
        $(thiz).css("background-color","#fff");
        $(thiz).css("border-color","#BBBBBB");
    }else{
        $(thiz).css("background-color","#fff3f3");
        $(thiz).css("border-color","#ffa8a8");
    }

    $(".realStaff").each(function(i,v){
        var staff=$(v).val();
        var hour=$(".realHour_"+i).val();
        if(!staff||!hour||!Number(staff)||!Number(hour)){
            staff=0;
            hour=0;
        }
        sum+=accMul(staff,hour);
    });
    s_params.pgManHours=sum;
}



