var isHasItem = false;
var oldRequireDate;
var responItem = "";
var params = getParentParam_();
var respon="";
$(function () {
    $("#reSendBtn").hide();
    /**
     * 处理删除按钮
     */
    function processDeleteBnt() {
        if ($("[name^=pn_]").length > 1) {
            $(".del_btn").show();
        } else {
            $(".del_btn").hide();
        }
    }

    //删除按钮
    $(document).delegate(".del_btn", "click", function () {
        if($(this).closest("table").find("tr").length<=3){
            MsgAlert({content: "必须要有一条航材以上!", type: 'error'});
            return false
        }
        let deleteSerialNumber = $("#deleteSerialNumber").val();
        let serialNumber = $(this).attr("value1");
        if(deleteSerialNumber) {
            $("#deleteSerialNumber").val(deleteSerialNumber + "," + serialNumber);
        } else {
            $("#deleteSerialNumber").val(serialNumber);
        }
        $(this).closest("tr").remove();
        processDeleteBnt();
    });
    //添加按钮
    $(".add_btn").on("click", function () {
        let time = new Date().getTime();
        let unitTrDiv = `<select style="width: 80px" name="unit_${time}"></select>`;

        let tpl = '<tr class="mrItem"><td align="center"></td>'
            + '<td align="center"><input type="hidden" value="" name="itemnum_' + time + '"/><input maxlength="100" style="width:80%" class="required validpn" id ="pn_' + time + '"  name="pn_' + time + '" value=""/> <img src="/images/ico_search_16.gif" style="vertical-align: -6%" onclick="toPn(' + time + ')" class="select_pn"/></td>'
            + '<td align="center"><input maxlength="1000" style="" class="validpn" name="optionalPns_' + time + '" value=""/><div  class="errorMessage"></div></td>'

            + '<td align="center"><input maxlength="600" class="required" id="pnname_' + time + '" name="pnname_' + time + '" /><div  class="errorMessage"></div></td>'
            + '<td align="center"><input id="ar_' + time + '" class="arCheck" type="checkbox"/><label>AR</label>'
            + '<input maxlength="10" class="required number" min="0.01" style="width: 50px" name="qty_' + time + '"/><div  class="errorMessage"></div></td>'
            + '<td align="center">' + unitTrDiv + '<div  class="errorMessage"></div></td>'
            + '<td align="center"><input name="assetNum_' + time + '" style="width:90%;" readonly/>&nbsp;</td>'
            + '<td align="center"><input name="serialNum_' + time + '" style="width:90%;" readonly/>&nbsp;</td>'
            + '<td align="center"><input name="lotNum_' + time + '" style="width:90%;" readonly/>&nbsp;</td>'

            + '<td align="center"><input maxlength="30" readonly class="required stationValid" style="width: 50px" name="station_' + time + '"/><div  class="errorMessage"></div></td>'
            + '<td style="word-break: break-all; white-space: normal;">'
            + '<textarea style="width: 97%" maxlength="1000" name="remark_' + time + '" rows="" cols=""></textarea><div  class="errorMessage"></div></td>'

            + '<td><input type="button" class="btn del_btn" value="Delete" /></td></tr>';

        $(this).closest("table").append($(tpl));
        processDeleteBnt();
    });

    oldRequireDate = getCurrentDateStr();
    initMRInfo();
});

// 获取MR信息
function initMRInfo() {
    var mrInfo = "";
    let sapTaskId = params.sapTaskId;
    let url = basePath + "/api/v1/mr/mr/viewMr?sapTaskId="+sapTaskId;
    //通过url中取值
    $.ajax({
        url: url,
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        type: 'GET',
        async: false,
        cache: false,
        success: function (obj, textStatus) {
            if(obj.code == '200' || obj.code == '202') {
                mrInfo = obj.data.mr;
                // 获取MR下面的航材条目
                let itemList = [];
                if (mrInfo.length>0){
                    // 取最后一个MR的信息
                    mrInfo = mrInfo[mrInfo.length-1];
                    respon = mrInfo;
                    let mrNum = "MR"+mrInfo.mrNum.substring(1,mrInfo.mrNum.length);
                    $('#mrNo').text(mrNum);
                    $('#station').text(mrInfo.station);
                    $('#workType').text(mrInfo.tdWorkType);
                    $('#interval').textbox('setValue', mrInfo.interval);
                    $('#cardNum').text(mrInfo.cardNum);
                    $('#pknum').text(mrInfo.packageNum || '');
                    $('#acReg').text(mrInfo.assetId);
                    $('#requireDate').datetimebox('setValue', mrInfo.requiredDate);
                    $('#createTime').text(mrInfo.mrCreatedDate);
                    $('#remark').text(mrInfo.description);
                    $('#Satisfy').text(undefineFilter(mrInfo.materialStatus));
                    itemList = mrInfo.materialList;
                }
                // 初始化MR条目
                initItem(itemList);
                // 发送SAP失败的数据需要重新发送,不允许编辑
                if(obj.code == '202'){
                    let log = obj.data.log;
                    $("#logId").val(log.id);
                    $("#sendStatus").text("发送失败");
                    $(".add_btn").hide();
                    $(".del_btn").hide();
                    $("#saveBtn").hide();
                    $("#reSendBtn").show();
                }
            } else {
                MsgAlert({content: obj.msgData[0] ? obj.msgData[0] : obj.msg, type: 'error'});
            }
        },
        error: function () {
            MsgAlert({content: "查询MR失败!", type: 'error'});
        }
    });
    return mrInfo;
}

function initItem(responItem){
    if(!responItem){
        return;
    }
    $(".mrItem").remove();
    let html = '';
    let disabled = "disabled";
    if(responItem) {
        $.each(responItem, function (index, value) {
            isHasItem = true;
            var time = new Date().getTime();
            let arHtml;
            if(value.ar != "0") {
                arHtml = '<input disabled id="ar_' + time + '" class="arCheck" type="checkbox" checked /><label>AR</label>'
            } else {
                arHtml = '<input disabled id="ar_' + time + '" class="arCheck" type="checkbox" /><label>AR</label>'
            }
            let unitTrDiv = `<select style="width: 80px" name="unit_${time}" value="${value.orderUnit}" disabled="disabled">
                                    <option value="${value.orderUnit}">${value.orderUnit}</option>
                                    </select>`;
            let itemNum = value.itemNum;
            let partNo = undefineFilter(value.partNo);
            let originalPartNo = undefineFilter(value.originalPartNo);
            let description = undefineFilter(value.description);
            let itemQty = undefineFilter(value.itemQty);
            let assetNum = undefineFilter(value.assetNum);
            let serialNum = undefineFilter(value.serialNum);
            let udLotNum = undefineFilter(value.udLotNum);
            let location = undefineFilter(value.location);
            let remark = undefineFilter(value.remark);
            let serialNumber = undefineFilter(value.serialNumber);
            let sapTaskId = value.sapTaskId;
            let deleteBtn = `<input type="button" class="btn del_btn" value="Delete" value1="${sapTaskId}#${serialNumber}"/>`;
            html += `<tr >
                                    <td align="center"></td>
                                    <td align="center">
                                    <input ${disabled} type="hidden" value="${itemNum}" name="itemnum_${time}"/>
                                    <input ${disabled} maxlength="100" style="width:80%" class="required validpn" id ="pn_${time}"  name="pn_${time}" value="${partNo}"/> 
                                    </td>
                                    <td align="center">
                                    <input ${disabled} maxlength="1000" style="" class="validpn" name="optionalPns_${time}" value="${originalPartNo}"/>
                                    <div  class="errorMessage"></div>
                                    </td>
                                    <td align="center">
                                    <input ${disabled} maxlength="600" class="required"  id="pnname_' + ${time} + '" name="pnname_${time}" value="${description}"/>
                                    <div  class="errorMessage"></div>
                                    </td>
                                    <td align="center">
                                    ${arHtml}
                                    <input ${disabled}  maxlength="10"  class="required number" min="0.01" style="width: 50px" name="qty_${time}" value="${itemQty}"/>
                                    <div  class="errorMessage"></div>
                                    </td>
                                    <td align="center">
                                    ${unitTrDiv}
                                    <div  class="errorMessage"></div>
                                    </td>
                                    <td align="center">
                                    <input ${disabled} name="assetNum_${time}" style="width:90%;"  value="${assetNum}"/>&nbsp;
                                    </td>   
                                    <td align="center">
                                    <input ${disabled} name="serialNum_${time}" style="width:90%;" value="${serialNum}"/>&nbsp;
                                    </td>    
                                    <td align="center">
                                    <input ${disabled} name="lotNum_${time}" style="width:90%;" value="${udLotNum}"/>&nbsp;
                                    </td>  
                                    <td align="center">
                                    <input ${disabled} maxlength="30" class="required stationValid" style="width: 50px" name="station_${time}" value="${location}"/>
                                    <div  class="errorMessage"></div>
                                    </td>
                                    <td style="word-break: break-all; white-space: normal;">      
                                    <textarea ${disabled} style="width: 97%" maxlength="1000" name="remark_${time}" rows="" cols="" value="${remark}">${remark}</textarea>
                                    <div  class="errorMessage"></div>
                                    </td>
                                    <td>${deleteBtn}</td>
                                    </tr>
                            `;
        });
    }
    $("#singleAcNotice").closest("table").append(html);
}

if(JSONstringify(params) == '{}'){
    window.close()
}
var mrNo = params.mrNo;
var rev = params.rev;
var tabIndex = params.tabIndex;


function getCurrentDateStr() {
    var date = new Date();
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"
        + (date.getMonth() + 1);
    var hh = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return date.getFullYear() + '-' + month + '-' + day + ' ' + hh + ':' + min + ':' + sec;
}
function undefineFilter(value) {
    return typeof (value) == "undefined" || value == null ? "" : value;
}
function judgeShow(val) {
    if(val == "D"){
        return 'mrItem delTr'
    }else{
        return 'mrItem'
    }
}
function get_post_data() {
    var mrItems = $(".mrItem");
    let reqTime = $("#requireDate").datetimebox("getValue");
    var now = new Date();
    var setTime = new Date(reqTime);
    if (setTime < now) {
        MsgAlert({content: "需求日期不能小于当前日期", type: 'error'});
        return false;
    }
    if(mrItems.length < 1){
        MsgAlert({content: "请先添加条目", type: 'error'});
        return false;
    }
    if($.trim($('#reviseReason').val()) ==''){
        MsgAlert({content: "请先填写Revise Reason", type: 'error'});
        return false;
    }
    var mr = {};
    mr["mrNum"] = mrNo;
    mr["packageNum"] = respon.packageNum;
    mr["assetId"] = respon.assetId;
    mr["cardId"] = respon.cardId;
    mr["assetType"] = respon.assetType;
    mr["relatedWorkCardNum"] = respon.relatedWorkCardNum;
    mr["aog"] = false;
    mr["tdWorKOrderId"] = respon.tdWorKOrderId;
    mr["mrSourceType"] = respon.mrSourceType;
    mr["executeType"] = "";
    mr["interval"] = $('#interval').textbox('getValue');
    mr["repeatability"] = respon.repeatability;
    mr["mrRevisionNum"] = '0';
    mr["times"] = "";
    mr["mrCreatedDate"] = getCurrentDateStr();
    mr["reason"] = $('#reviseReason').val();
    mr["unlimited"] = '0';
    mr["timeLimitType"] = "";
    mr["delayTimes"] = respon.delayTimes;
    mr["classification"] = "";
    mr["deleteSerialNumber"] = $("#deleteSerialNumber").val();
    mr["workType"] = respon.workType;
    mr["tdWorkType"] = respon.tdWorkType;
    if(respon.tdWorkType == "NRCT") {
        mr["executeType"] = "INVARIABLE";
    }
    mr["cardNum"] = respon.cardNum;
    mr["requiredDate"] = $("#requireDate").datetimebox("getValue");
    mr["description"] = $("#remark").val();
    mr["approver"] = respon.approver;
    mr["mrReportedBy"] = respon.mrReportedBy;
    mr["sapTaskId"] = respon.sapTaskId;
    mr["materialList"] = [];
    if($("#requireDate").datetimebox("getValue") == ''){
        MsgAlert({content: "请填写requireDate", type: 'error'});
        return false;
    }
    $.each(mrItems, function(i,ele){
        mr["materialList"][i] = {};
        mr["materialList"][i].itemNum = $(ele).find("[name^=itemnum_]").val();
        mr["materialList"][i].location = $(ele).find("[name^=station_]").val();
        mr["materialList"][i].itemQty = $(ele).find("[name^=qty_]").val();
        mr["materialList"][i].recommendQty = $(ele).find("[name^=qty_]").val();
        mr["materialList"][i].remark = $(ele).find("[name^=remark_]").val();
        mr["materialList"][i].assetNum = $(ele).find("[name^=assetNum_]").val();
        mr["materialList"][i].PARTNO = $(ele).find("[name^=pn_]").val();
        mr["materialList"][i].udLotNum = $(ele).find("[name^=lotNum_]").val();
        mr["materialList"][i].serialNo = $(ele).find("[name^=serialNum_]").val();
        mr["materialList"][i].originalOrderUnit = $(ele).find("[name^=unit_]").val();
        mr["materialList"][i].requiredDate =  $("#requireDate").datetimebox("getValue");
        mr["materialList"][i].effectiveStatus = true;
        mr["materialList"][i].revNote = '';
        mr["materialList"][i].revRemark = $(ele).find("[name^=rev]").val() || '';
        var qty = $(ele).find("[name^=qty_]");
        var isar = $(ele).find("[id^=ar_]");
        if($.trim($(ele).find("[name^=pn_]").val()) == '' || $.trim($(ele).find("[name^=pnname_]").val()) == ''|| $.trim($(ele).find("[name^=qty_]").val()) == ''){
            MsgAlert({content: "请填写addMr条目必填项", type: 'error'});
            mr = false;
            return false;
        }
        if(isar.is(":checked")){
            mr["materialList"][i].itemQty = qty.val();
            mr["materialList"][i].ar = true;
        }else{
            mr["materialList"][i].itemQty = qty.val();
            mr["materialList"][i].ar = false;
        }
    });
    return mr;

}
function changeBool(val) {
    return val ? '1' :'0'
}
function saveMr() {
    // 判断是否有修改需求时间
    let reqTime = $("#requireDate").datetimebox("getValue");
    if(new Date(reqTime).getTime() != new Date(oldRequireDate).getTime()) {
        isUpdate = true;
    }
    var _url = '';
    var postData;
    let mrItems = $(".mrItem");
    if(isUpdate && isHasItem && (mrItems.length < 1)) {
        _url = basePath + "/api/v1/mr/mr/updateRequiredDate";
        let mr = {};
        mr["sapTaskId"] = params.sapTaskId;
        mr["requiredDate"] = reqTime;
        mr["station"] = $("#station").text();
        mr["deleteSerialNumber"] = $("#deleteSerialNumber").val();
        postData = mr;
    } else {
        _url = basePath + "/api/v1/mr/mr/update";
        postData = get_post_data();
    }
    if(postData){
        $.ajax({
            url: _url,
            dataType : "json",
            contentType : 'application/json;charset=utf-8',
            type : 'POST',
            data: JSON.stringify(postData),
            async : true,
            cache : false,
            beforeSend:function(){
                ajaxLoading();
            },
            success : function(obj, textStatus) {
                ajaxLoadEnd();
                if(obj.code == '200'){
                    if (typeof params.OWindow.listReload_ == 'function') {
                        params.OWindow.listReload_();
                    }
                    params.OWindow.MsgAlert({content:$.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    window.close();
                }else if (obj.code == '202'){
                    if (typeof params.OWindow.listReload_ == 'function') {
                        params.OWindow.listReload_();
                    }
                    var shortMsg = '';
                    Object.keys(obj.data).forEach(function(key){
                        shortMsg += key + "缺" + obj.data[key] + "件" + '<br>'
                    });
                    MsgAlert({content: shortMsg, type: 'error'});
                }else{
                    MsgAlert({content: obj.msgData[0] ? obj.msgData[0]:obj.msg, type: 'error'});
                    location.reload();
                }
            },
            error:function () {
                ajaxLoadEnd();
            }
        });
    }

}
function toPn(time) {
    //件号库
    var station = $("#station").text();
    $.pnSelect({
        station: station,
        cardType:  $('#workType').text(),
        success: data => {
            $(`#pn_${time}`).val(data.partno);
            $(`#pnname_${time}`).val(data.description);
            $(`select[name=unit_${time}]`).val(data.issueunit);
            $(`input[name=serialNum_${time}]`).val(data.serialNum);
            $(`input[name=itemnum_${time}]`).val(data.itemnum);
            $(`input[name=assetNum_${time}]`).val(data.assetNum);
            $(`input[name=station_${time}]`).val(data.location);
            $(`input[name=lotNum_${time}]`).val(data.lotNum);
            $(`input[name=station_${time}]`).val(station);
            let unitMrIdHtml = "";
            $.each(data.allunit.split(","), function (i, v) {
                unitMrIdHtml += `<option value="${v}">${v}</option>`;
            });
            $(`select[name=unit_${time}]`).append(unitMrIdHtml);
        }
    });
}


function reSendMr(){
    let logId = $("#logId").val();
    let url = "/api/v1/mr/mr/reSendMr?id="+logId;
    //通过url中取值
    $.ajax({
        url: url,
        dataType: "json",
        contentType: 'application/json;charset=utf-8',
        type: 'POST',
        async: true,
        cache: false,
        beforeSend: function () {
            ajaxLoading();
            $('#reSendMr').text("提交中...")
        },
        success: function (obj, textStatus) {
            ajaxLoadEnd();
            if(obj.code == '200') {
                sessionStorage.removeItem("mraddParams");
                CloseWindowIframe();
            } else {
                MsgAlert({content: obj.msgData[0] ? obj.msgData[0] : obj.msg, type: 'error'});
            }
            $('#reSendMr').text("重新推送");
        },
        error: function () {
            ajaxLoadEnd();
            $('#reSendMr').text("重新推送");
        }
    });
}



