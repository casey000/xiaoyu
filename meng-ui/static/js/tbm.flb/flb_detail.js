/*
 * Copyright 2019 SF Airlines Co., Ltd. All rights reserved.
 * 本文件仅限于顺丰航空有限公司内部传阅，禁止外泄以及用于其他的商业目的。
 */
var param;
var operation;
var acReg;
var mustFillTips = "This field is required";//必填项提示
var oilFillTips = "Can not less than 1";//油量必填且必须大于1
var wastePer;

function i18nCallBack() {
    $('#dd').dialog('close');
    param = getParentParam_();
    operation = param.operation;
    acReg = param.acReg;
    console.log(param, 'param');
    if (param.flightId) {
        InitDataForm(param.flightId, param.flbOrderId, param.isReleased);
    }
}

fengzhuang('checkWayNum');

function fengzhuang(id) {
    $("#" + id).MyComboGrid({
        idField: 'ACCOUNT_NUMBER',  //实际选择值
        textField: 'USER_NAME',
        // textField: "'USER_NAME' +'ACCOUNT_NUMBER'"   , //文本显示值
        // textField: {
        //     formatter: function (value,row) {
        //         return'USER_NAME';
        //     }
        // } , //文本显示值
        panelHeight: '200px',
        required: true,
        width: "170px",
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
            wastePer = `${row.USER_NAME}(${row.ACCOUNT_NUMBER})`;
            $(this).combogrid({value: wastePer});
            // $('#checkWayNum').combogrid({value: wastePer});

            // var per2 = row.ACCOUNT_NUMBER
            // console.log(row.USER_NAME+ "(" + row.ACCOUNT_NUMBER + ")");
            // wastePer = row.USER_NAME + "(" + row.ACCOUNT_NUMBER + ")";
            // $(this).combogrid('setValue', row.USER_NAME+ "(" + row.ACCOUNT_NUMBER + ")");
            // $("#" + id).textbox('setValue', row.USER_NAME+ "(" + row.ACCOUNT_NUMBER + ")");
        }
    });

}

function flbFormatTime(time) {
    var hour = parseInt(time / 60);
    var minute = time % 60;
    hour = hour >= 10 ? hour : ("0" + hour);
    minute = minute >= 10 ? minute : ("0" + minute);
    return hour + ":" + minute;
}

function InitDataForm(flightID, orderID, isReleased) {
    var url_ = "/api/v1/station_task/flb_detail?flbOrderId=" + orderID;
    if (flightID) {
        $("#flightLogID").attr('readonly', 'readonly')
    }
    if (orderID) {
        $("#orderID").attr('readonly', 'readonly')
    }
    $("#flightLogID").val(flightID);
    $("#orderID").val(orderID);
    $.ajax({
        type: "get",
        url: url_,
        contentType: "application/json;charset=utf-8",
        data: {},
        success: function (data) {

            if (data.data.flbPage[0]) {
                $("#flbNo").val(data.data.flbPage[0].flbNo);
                if (data.data.flbPage[0].flbNo) {
                    $("#flbNo").attr('readonly', 'readonly')
                }
            }

            // 获取当前FLB 工单的父工单的放行状态
            isReleased = data.data.parentWorkOrder[0].status;
            console.log("工单 " + data.data.parentWorkOrder[0].id + " 放行状态:" + isReleased);
            if ('UNRELEASED' != isReleased) {
                $("#flbNo").attr("disabled", true);
                $("#btnSave").attr("disabled", true);
            }

            var append_html = "";
            var sHtml = "";

            var oil_html = "";
            //追加航班数据
            var preFlightId = '';
           if(data.data.preFlightLog[0] === null || data.data.preFlightLog[0] == 'null'){
               MsgAlert({content:'无法查询前一航班信息' ,type:'error'})
           }
            //如果是航后和本航班相比 其余 跟前一航班相比
            if (operation == "O/G" || operation == "Po/F") {
                preFlightId = flightID;
            } else {
                preFlightId = data.data.preFlightLog[0].flightId || '';
            }
            var difPage = false;
            //todo 如果不是同一页 touchgo可编辑
            if (data.data.flbPage[0].id != data.data.flbPage[0].baseId) {
                difPage = true;
                $.each(data.data.preFlightLog, function (i, pre) {
                    if(pre.flbId == data.data.flbFlightRecords[0].flbId){
                        return false
                    }
                    var touchGo_ = pre.touchgo === null ? "" : pre.touchgo;
                    var flightDate_ = myformatter(new Date(pre.flightDate));
                    var offBlockDate_ = pre.offBlockDate ? formatDateTime(pre.offBlockDate).substr(10, 6) : "";
                    var takeoffDate_ = pre.takeoffDate ? formatDateTime(pre.takeoffDate).substr(10, 6) : "";
                    var landingDate_ = pre.landingDate ? formatDateTime(pre.landingDate).substr(10, 6) : "";
                    var onBlockDate_ = pre.onBlockDate ? formatDateTime(pre.onBlockDate).substr(10, 6) : "";
                    var autoLanding_ = pre.autoLanding ? "Y" : "N";
                    var canEdit = operation == "Po/F" ? true :false;
                    var td;
                    // var td = "<td><input value='" + touchGo_ + "' name='touchGo' placeholder='必填' required='required'><div class='errorMessage'  >" + mustFillTips + "</div></td>"
                    if(canEdit){
                        td = "<td><input onkeyup=\"value=value.replace(/[^\\d]/g,'')\"  value='" + touchGo_ + "' name='touchGo' placeholder='必填' class='touchgo' required='required'><input class='flightType' type='hidden' value='"+ pre.flightType +"'><input class='preFlightType' type='hidden' value='"+ pre.preFlightType +"'><div class='errorMessage'  >" + mustFillTips + "</div></td>"
                    }else{
                        td = "<td ><input disabled='disabled' style='background:yellow' readonly='true' value='" + touchGo_ + "'></td>"
                    }
                    append_html += "<tr class='addLine' style='background: yellow'>" +
                        "<td>" + pre.flbRecodeSec +
                        "</td>" +
                        "<td hidden='hidden'><input value='" + pre.id + "' name='id'></td>" +
                        "<td colspan='2'><input style='background: yellow' disabled='disabled' readonly='true' value='" + pre.flightNo + "' name='flightNo'></td>" +
                        "<td colspan='2'><input style='background: yellow' disabled='disabled' readonly='true' value='" + pre.acReg + "' name='acReg'></td>" +
                        "<td ><input disabled='disabled' style='background: yellow' readonly='true' value='" + pre.fromStation + "' name='fromStation'></td>" +
                        "<td><input disabled='disabled'  style='background: yellow' readonly='true' value='" + pre.toStation + "' name='toStation'></td>" +
                        "<td colspan='2'><input disabled='disabled' style='background: yellow' readonly='true' value='" + flightDate_ + "' name='flightDate'></td>" +
                        "<td colspan='2'><input disabled='disabled' style='background: yellow' readonly='true' value='" + offBlockDate_ + "' name='offBlockDate'></td>" +
                        "<td colspan='2'><input disabled='disabled' style='background: yellow' readonly='true' value='" + takeoffDate_ + "' name='takeoffDate'></td>" +
                        "<td colspan='2'><input disabled='disabled' style='background: yellow' readonly='true' value='" + landingDate_ + "' name='landingDate'></td>" +
                        "<td colspan='2'><input disabled='disabled' style='background: yellow' readonly='true' value='" + onBlockDate_ + "' name='onBlockDate'></td>" +
                        "<td ><input disabled='disabled' readonly='true' style='background: yellow' value='" + pre.airTime + "' name='airTime'></td>" +
                        "<td ><input disabled='disabled' readonly='true'  style='background: yellow' value='" + pre.blockTime + "' name='blockTime'></td>" +
                        td+
                        "<td><input disabled='disabled'  style='background: yellow' readonly='true' value='" + autoLanding_ + "' name='autoLanding'></td>" +
                        "</tr>";
                });
            }
            $.each(data.data.flbFlightRecords, function (i, flt) {
                console.log("data666:" + i + "==" + flt);
                var flightID_ = flt.id;
                var flbRecodeId = flt.flbRecodeId;
                var canEdit = flightID_ == preFlightId;
                var flightDate_ = myformatter(new Date(flt.flightDate));
                var touchGo_ = flt.touchgo === null ? "" : flt.touchgo;
                var offBlockDate_ = flt.offBlockDate ? formatDateTime(flt.offBlockDate).substr(10, 6) : "";
                var takeoffDate_ = flt.takeoffDate ? formatDateTime(flt.takeoffDate).substr(10, 6) : "";
                var landingDate_ = flt.landingDate ? formatDateTime(flt.landingDate).substr(10, 6) : "";
                var onBlockDate_ = flt.onBlockDate ? formatDateTime(flt.onBlockDate).substr(10, 6) : "";
                var autoLanding_ = flt.autoLanding ? "Y" : "N";
                var remarkFlag = flt.flbRecodeRemark ? true : false;
                flt.airTime = flbFormatTime(flt.airTime);
                flt.blockTime = flbFormatTime(flt.blockTime);
                if(operation == "Po/F" && data.data.flbFlightRecords.length == '1' && !difPage){
                    $.each(data.data.preFlightLog, function (i, pre) {
                        var flightDate_ = myformatter(new Date(pre.flightDate));
                        var offBlockDate_ = pre.offBlockDate ? formatDateTime(pre.offBlockDate).substr(10, 6) : "";
                        var takeoffDate_ = pre.takeoffDate ? formatDateTime(pre.takeoffDate).substr(10, 6) : "";
                        var landingDate_ = pre.landingDate ? formatDateTime(pre.landingDate).substr(10, 6) : "";
                        var onBlockDate_ = pre.onBlockDate ? formatDateTime(pre.onBlockDate).substr(10, 6) : "";
                        var autoLanding_ = pre.autoLanding ? "Y" : "N";
                        var td;
                        // var td = "<td><input value='" + touchGo_ + "' name='touchGo' placeholder='必填' required='required'><div class='errorMessage'  >" + mustFillTips + "</div></td>"
                        if(canEdit){
                            td = "<td><input onkeyup=\"value=value.replace(/[^\\d]/g,'')\" class='touchgo' value='" + touchGo_ + "' name='touchGo' placeholder='必填' required='required'><input class='flightType' type='hidden' value='"+ pre.flightType +"'><input class='preFlightType' type='hidden' value='"+ pre.preFlightType +"'><div class='errorMessage'  >" + mustFillTips + "</div></td>"
                        }else{
                            td = "<td ><input disabled='disabled' style='background:yellow' readonly='true' value='" + touchGo_ + "'></td>"
                        }
                        append_html += "<tr class='addLine' style='background: yellow'>" +
                            "<td>" + pre.flbRecodeSec +
                            "</td>" +
                            "<td hidden='hidden'><input value='" + pre.id + "' name='id'></td>" +
                            "<td colspan='2'><input style='background: yellow' disabled='disabled' readonly='true' value='" + pre.flightNo + "' name='flightNo'></td>" +
                            "<td colspan='2'><input style='background: yellow' disabled='disabled' readonly='true' value='" + pre.acReg + "' name='acReg'></td>" +
                            "<td ><input disabled='disabled' style='background: yellow' readonly='true' value='" + pre.fromStation + "' name='fromStation'></td>" +
                            "<td><input disabled='disabled'  style='background: yellow' readonly='true' value='" + pre.toStation + "' name='toStation'></td>" +
                            "<td colspan='2'><input disabled='disabled' style='background: yellow' readonly='true' value='" + flightDate_ + "' name='flightDate'></td>" +
                            "<td colspan='2'><input disabled='disabled' style='background: yellow' readonly='true' value='" + offBlockDate_ + "' name='offBlockDate'></td>" +
                            "<td colspan='2'><input disabled='disabled' style='background: yellow' readonly='true' value='" + takeoffDate_ + "' name='takeoffDate'></td>" +
                            "<td colspan='2'><input disabled='disabled' style='background: yellow' readonly='true' value='" + landingDate_ + "' name='landingDate'></td>" +
                            "<td colspan='2'><input disabled='disabled' style='background: yellow' readonly='true' value='" + onBlockDate_ + "' name='onBlockDate'></td>" +
                            "<td ><input disabled='disabled' readonly='true' style='background: yellow' value='" + pre.airTime + "' name='airTime'></td>" +
                            "<td ><input disabled='disabled' readonly='true'  style='background: yellow' value='" + pre.blockTime + "' name='blockTime'></td>" +
                             td+
                            "<td><input disabled='disabled'  style='background: yellow' readonly='true' value='" + autoLanding_ + "' name='autoLanding'></td>" +
                            "</tr>";
                    });
                    append_html += "<tr class='addLine'>" +
                        "<td>" + flt.flbRecodeSec + "</td>" +
                        "<td colspan='8'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td ></td>" +
                        "<td ></td>" +
                        "<td></td>" +
                        "<td></td>" +
                        "</tr>";

                    return false;
                }
                if (remarkFlag) {
                    append_html += "<tr class='addLine'>" +
                        "<td>" + flt.flbRecodeSec + "</td>" +
                        "<td colspan='8'>" + "<span>" + flt.flbRecodeRemark + "</span>" +
                        "<div id='setInvalidFlt_" + flbRecodeId + "' onclick='delFlt(" + flbRecodeId + ")' title=\"取消当前行无效\" class=\"ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit\"> <span class=\"ui-icon ui-icon-close\"></span></div>" +
                        "</td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td ></td>" +
                        "<td ></td>" +
                        "<td></td>" +
                        "<td><input disabled='disabled' readonly='true' value='N'></td>" +
                        "</tr>";
                    return true;
                }
                if (!remarkFlag && !flt.flightId) {
                    append_html += "<tr class='addLine'>" +
                        "<td>" + flt.flbRecodeSec + "</td>" +
                        "<td colspan='8'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td ></td>" +
                        "<td ></td>" +
                        "<td></td>" +
                        "<td></td>" +
                        "</tr>";
                    return true;
                }
                if (canEdit && 'UNRELEASED' == isReleased) {
                    append_html += "<tr class='addLine'>" +
                        "<td>" + flt.flbRecodeSec +
                        "<div id='setInvalidFlt_" + flbRecodeId + "' onclick='invalidFlt(" + flbRecodeId + ")' title=\"设置当前行无效\" class=\"ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit\"> <span class=\"ui-icon ui-icon-trash\"></span></div>" +
                        "</td>" +
                        "<td hidden='hidden'><input value='" + flt.id + "' name='id'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + flt.flightNo + "' name='flightNo'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + flt.acReg + "' name='acReg'></td>" +
                        "<td ><input disabled='disabled' readonly='true' value='" + flt.fromStation + "' name='fromStation'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + flt.toStation + "' name='toStation'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + flightDate_ + "' name='flightDate'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + offBlockDate_ + "' name='offBlockDate'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + takeoffDate_ + "' name='takeoffDate'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + landingDate_ + "' name='landingDate'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + onBlockDate_ + "' name='onBlockDate'></td>" +
                        "<td ><input disabled='disabled' readonly='true' value='" + flt.airTime + "' name='airTime'></td>" +
                        "<td ><input disabled='disabled' readonly='true' value='" + flt.blockTime + "' name='blockTime'></td>" +
                        "<td><input onkeyup=\"value=value.replace(/[^\\d]/g,'')\" value='" + touchGo_ + "' class='touchgo' name='touchGo' placeholder='必填' required='required'><input class='flightType' type='hidden' value='"+ flt.flightType +"'><input class='preFlightType' type='hidden' value='"+ flt.preFlightType +"'><div class='errorMessage'  >" + mustFillTips + "</div></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + autoLanding_ + "' name='autoLanding'></td>" +
                        "</tr>";
                } else {
                    append_html += "<tr class='addLine'>" +
                        "<td>" + flt.flbRecodeSec +
                        "<div id='setInvalidFlt_" + flbRecodeId + "' onclick='invalidFlt(" + flbRecodeId + ")' title=\"设置当前行无效\" class=\"ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit\"> <span class=\"ui-icon ui-icon-trash\"></span></div>" +
                        "</td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + flt.flightNo + "'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + flt.acReg + "'></td>" +
                        "<td ><input disabled='disabled' readonly='true' value='" + flt.fromStation + "'></td>" +
                        "<td ><input disabled='disabled' readonly='true' value='" + flt.toStation + "'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + flightDate_ + "'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + offBlockDate_ + "'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + takeoffDate_ + "'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + landingDate_ + "'></td>" +
                        "<td colspan='2'><input disabled='disabled' readonly='true' value='" + onBlockDate_ + "'></td>" +
                        "<td ><input disabled='disabled' readonly='true' value='" + flt.airTime + "'></td>" +
                        "<td ><input disabled='disabled' readonly='true' value='" + flt.blockTime + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + touchGo_ + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + autoLanding_ + "'></td>" +
                        "</tr>";
                }

            });

            $("#flight_table").append(append_html);
            //追加油量数据
            $.each(data.data.flbOilInfos, function (i, oil) {
                console.log("data666:" + i + "==" + oil);
                var canEdit = oil.editable;
                var updator_ = oil.oilTechnician ? oil.oilTechnician : "";
                var licenseNo = oil.licenseNo?oil.licenseNo:"";
                var mechanicName = oil.mechanicName?oil.mechanicName:'';
                var mechanicSn = oil.mechanicSn?oil.mechanicSn:'';
                var completeDate = oil.completeDate ? formatDateTime(oil.completeDate): "";
                var isBigac = data.data.flbPage[0].acType == 'B747' ? true :false;
                if (canEdit && 'UNRELEASED' == isReleased) {
                    if(isBigac){
                        oil_html += "<tr class='addLine'>" +
                            "<td>" + oil.sec + "</td>" +
                            "<td hidden='hidden'><input name='flbOilId' value='" + oil.id + "'></td>" +
                            "<td><input name='oilremainl' placeholder='必填(大于1)' required='required' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" value='" + oil.oilRemainL + "'><div class='errorMessage' >" + oilFillTips + "</div></td>" +
                            "<td><input name='oilremainr' placeholder='必填(大于1)' required='required' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" value='" + oil.oilRemainR + "'><div class='errorMessage' >" + oilFillTips + "</div></td>" +
                            "<td><input name='oilremain3' placeholder='必填(大于1)' required='required' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" value='" + oil.oilRemain3 + "'><div class='errorMessage' >" + oilFillTips + "</div></td>" +
                            "<td><input name='oilremain4' placeholder='必填(大于1)' required='required' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" value='" + oil.oilRemain4 + "'><div class='errorMessage' >" + oilFillTips + "</div></td>" +
                            "<td><input class='upl' name='oilupliftl' value='" + oil.oilUpliftL + "'></td>" +
                            "<td><input class='upl' name='oilupliftr' value='" + oil.oilUpliftR + "'></td>" +
                            "<td><input class='upl' name='oiluplift3' value='" + oil.oilUplift3 + "'></td>" +
                            "<td><input class='upl' name='oiluplift4' value='" + oil.oilUplift4 + "'></td>" +
                            "<td><input class='upl' name='oilupliftapu' value='" + oil.oilUpliftApu + "'></td>" +
                            "<td><input name='oilTechnician' placeholder='必填' required='required' value='" + updator_ + "'><div class='errorMessage' >" + mustFillTips + "</div></td>" +
                            "<td><input disabled='disabled' name='workType' value='" + oil.workType + "'></td>" +
                            "<td><input disabled='disabled' name='station' value='" + oil.station + "'></td>" +
                            "<td colspan='2' style='white-space:normal'>"+ licenseNo + "</td>" +
                            "<td></td>" +
                            "<td style='white-space:normal'>"+completeDate+"</td>" +
                            "<td><input disabled='disabled' readonly='true' value='" + mechanicName + "'></td>" +
                            "<td><input disabled='disabled' readonly='true' value='" + mechanicSn + "'></td>" +
                            "</tr>"
                    }else{
                        oil_html += "<tr class='addLine'>" +
                            "<td>" + oil.sec + "</td>" +
                            "<td hidden='hidden'><input name='flbOilId' value='" + oil.id + "'></td>" +
                            "<td><input name='oilremainl' placeholder='必填(大于1)' required='required' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" value='" + oil.oilRemainL + "'><div class='errorMessage' >" + oilFillTips + "</div></td>" +
                            "<td><input name='oilremainr' placeholder='必填(大于1)' required='required' onkeyup=\"value=value.replace(/[^\\d]/g,'')\" value='" + oil.oilRemainR + "'><div class='errorMessage' >" + oilFillTips + "</div></td>" +
                            "<td><input name='oilremain3' disabled='disabled' readonly='true' value='" + oil.oilRemain3 + "'></td>" +
                            "<td><input name='oilremain4' disabled='disabled' readonly='true' value='" + oil.oilRemain4 + "'></td>" +
                            "<td><input class='upl' name='oilupliftl' value='" + oil.oilUpliftL + "'></td>" +
                            "<td><input class='upl' name='oilupliftr' value='" + oil.oilUpliftR + "'></td>" +
                            "<td><input class='upl' name='oiluplift3' disabled='disabled' readonly='true' value='" + oil.oilUplift3 + "'></td>" +
                            "<td><input class='upl' name='oiluplift4' disabled='disabled' readonly='true' value='" + oil.oilUplift4 + "'></td>" +
                            "<td><input class='upl' name='oilupliftapu' value='" + oil.oilUpliftApu + "'></td>" +
                            "<td><input name='oilTechnician' placeholder='必填' required='required' value='" + updator_ + "'><div class='errorMessage' >" + mustFillTips + "</div></td>" +
                            "<td><input disabled='disabled' name='workType' value='" + oil.workType + "'></td>" +
                            "<td><input disabled='disabled' name='station' value='" + oil.station + "'></td>" +
                            "<td colspan='2' style='white-space:normal'>"+ licenseNo + "</td>" +
                            "<td></td>" +
                            "<td style='white-space:normal'>"+completeDate+"</td>" +
                            "<td><input disabled='disabled' readonly='true' value='" + mechanicName + "'></td>" +
                            "<td><input disabled='disabled' readonly='true' value='" + mechanicSn + "'></td>" +
                            "</tr>"
                    }

                } else {
                    oil_html += "<tr class='addLine'>" +
                        "<td>" + oil.sec + "</td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.oilRemainL + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.oilRemainR + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.oilRemain3 + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.oilRemain4 + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.oilUpliftL + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.oilUpliftR + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.oilUplift3 + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.oilUplift4 + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.oilUpliftApu + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + updator_ + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.workType + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + oil.station + "'></td>" +
                        "<td colspan='2' style='white-space:normal'>"+ licenseNo + "</td>" +
                        "<td><input disabled='disabled' readonly='true' value=''></td>" +
                        "<td style='white-space:normal'>"+completeDate+"</td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + mechanicName + "'></td>" +
                        "<td><input disabled='disabled' readonly='true' value='" + mechanicSn + "'></td>" +
                        "</tr>"
                }
            });
            $("#oil_table").append(oil_html);
        },
        error: function () {
            window.alert("查询失败");
        }
    });
}

function myformatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}

function invalidFlt(flbRecodeId) {
    $('#dd').dialog('open');
    $('#flbId').val(flbRecodeId);
    $('#wasteReason').val('');
    $('#time').datetimebox('setValue', '');
    $('#checkWayNum').combogrid({value: ''});

}

function lineSave() {
    if ($('#checkWayNum').textbox('getValue') == '') {
        MsgAlert({content: "请填写作废人", type: 'error'});
        return;
    }
    if ($('#time').datetimebox('getValue') == '') {
        MsgAlert({content: "请填写作废日期", type: 'error'});
        return;
    }
    if ($.trim($('#wasteReason').val()) == '') {
        MsgAlert({content: "请填写原因", type: 'error'});
        return;
    }
    ajaxLoading();
    var datas = {
        flbRecodeRemark: $('#wasteReason').val() + " " + $('#time').datetimebox('getValue') + wastePer,
        flbRecodeId: $('#flbId').val()
    };
    datas = $.extend({}, datas, {FunctionCode: "INVALID_FLB"});
    InitFuncCodeRequest_({
        data: datas,
        successCallBack: function (jdata) {
            ajaxLoadEnd();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('.addLine').remove();
                InitDataForm(param.flightId, param.flbOrderId, param.isReleased);
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.COMMON.OPT_SUCCESS')});
                $('#dd').dialog('close');
            } else {
                MsgAlert({content: jdata.msgData[0] ? jdata.msgData[0] : jdata.msg, type: 'error'});
            }
        }
    });
}

function delFlt(flbRecodeId) {
    var datas = {flbRecodeId: flbRecodeId};
    datas = $.extend({}, datas, {FunctionCode: "RESUME_INVALID_FLB"});
    $.messager.confirm('', '确认取消？', function (r) {
        if (r) {
            ajaxLoading();
            InitFuncCodeRequest_({
                data: datas,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        $('.addLine').remove();
                        InitDataForm(param.flightId, param.flbOrderId, param.isReleased);
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_err:ERRMSG.COMMON.COMMON.OPT_SUCCESS')});
                        ajaxLoadEnd();
                        // $('#dd').dialog('close');
                        // reload_()
                    } else {
                        ajaxLoadEnd();
                        MsgAlert({content: jdata.msgData[0] ? jdata.msgData[0] : jdata.msg, type: 'error'});
                    }
                }
            });
        } else {
        }
    });


}

function btn_save() {
    var $form_ = $("#flb_form");
    var datas = $form_.serializeObject();
    datas.acReg = acReg;
    console.log(datas);

    var isValidate = $form_.form('validate');

    var inputV = $('.touchgo').val();
    var tt = $('.touchgo').siblings('.flightType').val();
    var tq = $('.touchgo').siblings('.preFlightType').val();
    if(operation == "O/G" || operation == "Po/F"){
        if(tt == 'X'){
            if( inputV <= 0){
                $.messager.alert("友情提示","训练航班连续起落数必须大于0");
                return;
            }
        }

    }else{
        if(tq == 'X'){
            if( inputV <= 0){
                $.messager.alert("友情提示","训练航班连续起落数必须大于0");
                return;
            }
        }
    }
    if (!isFillAllText()) {
        return;
    }
    if (isValidate) {

    } else {

    }


    datas = $.extend({}, datas, {FunctionCode: 'FLB_MAINT_FLB'});
    InitFuncCodeRequest_({
        data: datas,
        successCallBack: function (jdata) {
            if (jdata.code === RESULT_CODE.SUCCESS_CODE) {
                param.OWindow.listreload_();
                param.OWindow.MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                window.close();
            } else {
                MsgAlert({content: jdata.msgData[0] ? jdata.msgData[0] : jdata.msg, type: 'error'});
            }
        }
    });
}

function isFillAllText() {
    var flag = true;
    $('input[required="required"]').each(function () {
        var inputName = $(this).attr("name");
        if (!$(this).val() || (inputName == 'oilremainl' && $(this).val() < 1) || (inputName == 'oilremainr' && $(this).val() < 1) || (inputName == 'oilremain3' && $(this).val() < 1) || (inputName == 'oilremain4' && $(this).val() < 1)) {
            flag = false;
            $(this).siblings(".errorMessage").show();
        }
    });
    return flag;
}

$(document).on('input', 'input[required="required"]', function () {
    var that = $(this);
    var inputId = that.attr('id');
    if (that.val() != '') {
        $(this).siblings(".errorMessage").hide();
    } else {
        $(this).siblings(".errorMessage").show();
    }
});

$(document).on('blur', 'input[class^="upl"]', function () {
    var inputV = Number($(this).val());
    var that = $(this);
    if(!isNaN(inputV )){
        if(inputV>5){
            var prompt = "确认滑油添加"+inputV+"夸脱？";
            $.messager.confirm('', prompt, function (r) {
                if (r) {
                    return;
                }else {
                    that.val("");
                }
            });
        }
    }else {
        $.messager.alert("友情提示","请输入数字！");
        that.val("");
    }
});

$(document).on('blur', 'input[class^="touchgo"]', function () {
    var inputV = $(this).val();
    var tt = $(this).siblings('.flightType').val();
    var tq = $(this).siblings('.preFlightType').val();
    // if(operation == "O/G" || operation == "Po/F"){
        if(tt == 'X'){
            if(inputV <= 0){
                $(this).val('');
                $.messager.alert("友情提示","训练航班连续起落数必须大于0");
            }
        }
        else{
            if(inputV > 0){
                $.messager.alert("友情提示","本航班不是训练航班，请确认是否存在连续起落");
            }
        }
    // }
    // else{
    //     if(tq == 'X'){
    //         if( inputV <= 0){
    //             $(this).val('');
    //             $.messager.alert("友情提示","训练航班连续起落数必须大于0");
    //         }
    //     }
    //     else{
    //         $.messager.alert("友情提示","本航班不是训练航班，请确认是否存在连续起落");
    //     }
    // }


});