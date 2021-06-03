
$(function () {
    function getCurrentDateStr() {
        var date = new Date().getTime() + 0.5*60*60*1000;
        date = new Date(date);
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"
            + (date.getMonth() + 1);
        var hh = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        return date.getFullYear() + '-' + month + '-' + day + ' ' +  hh + ':' + min + ':' + sec;
    }

    var params = getParentParam_();
    if(JSONstringify(params) == '{}'){
        window.close()
    }
    var workType =  params.tdWorkType;
    sessionStorage.setItem("mraddParams", JSONstringify(params));
    // 判断是否更新过
    switch (workType) {
        case 'DEFECT':
        case 'DD':
            initDefectData();
            break;
        case 'LM':
            initLMData();
            break;
        case 'NRC':
            initNRCData();
            break;
        case 'JC':
        case 'NRCT':
        case 'NRCTASK':
        case 'TO':
        case 'PCO':
        case 'CCO':
            initLineData(workType);
            break;
        default:
            MsgAlert({content: '任务类型不正确', type: 'error'});
            return;
    }
    // 获取MR信息
    function getMRInfo() {
        return "";
    }


    // 初始化故障数据
    function initDefectData() {
        let station = params.station;
        let requireDate = getCurrentDateStr();
        let mr = getMRInfo();
        if (mr.length>0){
            // 取最后一个MR的信息
            mr = data.mr[data.mr.length-1];
            station = mr.station;
            requireDate = mr.requiredDate;
            $("#approver_name").textbox("setValue", mr.approverName+"(" + mr.approver + ")");
            $("#approver_id").val(mr.approver)
            $("#reportor_name").textbox("setValue", mr.mrReportedByName+"(" + mr.mrReportedBy + ")");
            $("#reportor_id").val(mr.mrReportedBy)
        }
        initAc();
        let effAdd = [{VALUE: 'Aircraft', TEXT: 'Aircraft'}];
        $('#tailOrEng').combobox({
            data: effAdd,
            valueField: 'VALUE',
            textField: 'TEXT',
            onLoadSuccess: function () {
                $('#tailOrEng').combobox('setValue', 'Aircraft');
            }
        });
        let nmAdd = [{VALUE: 'DEFREQ', TEXT: 'DEFREQ'}];
        $('#cardType').combobox({
            data: nmAdd,
            valueField: 'VALUE',
            textField: 'TEXT',
            onLoadSuccess: function () {
                $('#cardType').combobox('setValue', 'DEFREQ');
            }
        });
        $("#ser_acReg").combobox('setValue', params.acReg);
        $("#station").textbox('setValue', station);
        $("#cardNo").textbox('setValue', params.cardNum);
        $("#requireDate").datetimebox('setValue', requireDate);
        $(".add_btn").attr("disabled", false);
        oldRequireDate = requireDate;
    }

    // 初始化LM类型数据
    function initLMData(){
        initAc();
        initEng();
        $(".add_btn").attr("disabled", true);
        $(".satisfy").css('display','none');
        let effAdd = [{VALUE: 'Aircraft', TEXT: 'Aircraft'}, {VALUE: 'NA', TEXT: 'NA'}];
        $('#tailOrEng').combobox({
            data: effAdd,
            valueField: 'VALUE',
            textField: 'TEXT',
            onLoadSuccess: function () {
                $('#tailOrEng').combobox('setValue', 'Aircraft');
            }
        });
        let nmAdd = [{VALUE: 'LM', TEXT: 'LM'}];
        $('#cardType').combobox({
            data: nmAdd,
            valueField: 'VALUE',
            textField: 'TEXT',
            onLoadSuccess: function () {
                $('#cardType').combobox('setValue', 'LM');
                $("#cardNo").textbox('setValue','航线勤务');
            }
        });
    }

    // 初始化NRC数据
    function initNRCData(){
        initAc();
        let effAdd = [{VALUE: 'Aircraft', TEXT: 'Aircraft'}];
        $('#tailOrEng').combobox({
            data: effAdd,
            valueField: 'VALUE',
            textField: 'TEXT',
            onLoadSuccess: function () {
                $('#tailOrEng').combobox('setValue', 'Aircraft');
            }
        });
        let nmAdd = [{VALUE: 'NRC', TEXT: 'NRC'}];
        $('#cardType').combobox({
            data: nmAdd,
            valueField: 'VALUE',
            textField: 'TEXT',
            onLoadSuccess: function () {
                $('#cardType').combobox('setValue', 'NRC');
            }
        });
        let paraSta = params.station ? params.station : "SZX";
        $("#ser_acReg").combobox('setValue', params.acReg);
        $("#station").textbox('setValue', paraSta);
        $("#cardNo").textbox('setValue', params.cardNum);
        $("#requireDate").datetimebox('setValue', getCurrentDateStr());
        oldRequireDate = getCurrentDateStr();
    }

    // 初始化航线数据
    function initLineData(type){
        initAc();
        let effAdd = [{VALUE: 'Aircraft', TEXT: 'Aircraft'}];
        $('#tailOrEng').combobox({
            data: effAdd,
            valueField: 'VALUE',
            textField: 'TEXT',
            onLoadSuccess: function () {
                $('#tailOrEng').combobox('setValue', 'Aircraft');
            }
        });
        let nmAdd = [{VALUE: type, TEXT: type}];
        $('#cardType').combobox({
            data: nmAdd,
            valueField: 'VALUE',
            textField: 'TEXT',
            onLoadSuccess: function () {
                $('#cardType').combobox('setValue', type);
            }
        });
        let paraSta = params.station ? params.station : "SZX";
        $("#ser_acReg").combobox('setValue', params.acReg != 'null' ? params.acReg :'');
        $("#station").textbox('setValue', paraSta);
        $("#interval").textbox('setValue', params.interval||'');
        $("#cardNo").textbox('setValue', params.cardNum);
        $("#requireDate").datetimebox('setValue', getCurrentDateStr());
        oldRequireDate = getCurrentDateStr();
    }


    $("#cardType").combobox({

        onChange: function (n,o) {
            var cardType = $("#cardType").combobox('getValue');
            var station = $("#station").textbox('getValue').replace(/(^\s*)|(\s*$)/g, "");
            if (cardType && station) {
                //cardType和station 任何一个变化,都清空具体件号行,重新生成
                $(".mrItem").remove();
                $(".add_btn").attr("disabled", false);
            }
        }
    });
    $('#tailOrEng').combobox({
        onChange: function (n, o) {
            if (n == 'Aircraft') {
                $('#engSpan').css({'display': 'none'});
                $('#tailSpan').css({'display': 'inline'});

            } else if( n== "ENG") {
                $('#engSpan').css({'display': 'inline'});
                $('#tailSpan').css({'display': 'none'});

            }else if( n== "NA") {
                $('#engSpan').css({'display': 'none'});
                $('#tailSpan').css({'display': 'none'});


            }
        }
    });

    /**
     * 选择飞机
     */
    function initAc(){
        $("#ser_acReg").combobox({
            valueField: 'tail',
            textField: 'tail',
            url: "/api/v1/plugins/FLB_AC_LIST",
            prompt: '请选择',
            loadFilter: function (data) {
                if (data.data) {
                    return data.data;
                } else {
                    return data;
                }
            }
        });
    }

    /**
     * 选择引擎
     */
    function initEng(){
        $("#esnId").combobox({
            valueField: 'assetNum',
            textField: 'tail',
            url: "/api/v1/plugins/ME_ENGINE_LIST",
            prompt: '请选择',
            loadFilter: function (data) {
                if (data.data) {
                    return data.data;
                } else {
                    return data;
                }
            }

        });
    }

    var userInfo = getLoginInfo();
    if(!userInfo){
        userInfo = getParentParam_().PWindow.parent.getUesr()
    }
    $("#reportor_id").val(userInfo.accountNumber);
    $("#approver_name").textbox({
        editable: false,
        icons: [{
            iconCls: 'icon-search',
            handler: function (e) {
                $.dialog.setting.extendDrag = true;
                UserUtils.showDialog({
                    callback: function (data) {
                        let user_info = data[0];
                        $("#approver_name").textbox("setValue", user_info.userName + "(" + user_info.sn + ")");
                        $("#approver_id").val(user_info.sn)

                    }
                });
            }
        }, {
            iconCls: 'icon-cross',
            handler: function (e) {
                $("#approver_name").textbox("setValue", "")
            }
        }]
    });
    $("#reportor_name").textbox({
        value: `${userInfo.userName}(${userInfo.accountNumber})`,
        editable: false,
        icons: [{
            iconCls: 'icon-search',
            handler: function (e) {
                $.dialog.setting.extendDrag = true;
                UserUtils.showDialog({
                    callback: function (data) {
                        let user_info = data[0];
                        $("#reportor_name").textbox("setValue", user_info.userName + "(" + user_info.sn + ")");
                        $("#reportor_id").val(user_info.sn)
                    }
                });
            }
        }, {
            iconCls: 'icon-cross',
            handler: function (e) {
                $("#reportor_name").textbox("setValue", "")
            }
        }]
    });

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

    function getMrBySapTaskId(params) {
        if(params == null) {
            return;
        }
        let sapTaskId = params.sapTaskId;
        let workType = params.tdWorkType;
        let cardNum = params.cardNum;
        //初始化底部列表
        let data = $.extend({}, {sapTaskId: sapTaskId,workType:workType,cardNum:cardNum}, {FunctionCode: "MR_ITEM_SYN_DETAILS"});
        InitFuncCodeRequest_({
            data: data,
            successCallBack: function (jdata) {
                if(jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    $(".mrItem").remove();
                    let responItem = jdata.data;
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
                            let sapTaskId = value.sapTaskId;
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
                            let deleteBtn = '';
                            if("DEFECT" == params.tdWorkType || "DD" == params.tdWorkType) {
                                deleteBtn = `<input type="button" class="btn del_btn" value="Delete" value1="${sapTaskId}#${serialNumber}"/>`;
                            }
                            html += `<tr >
                                    <td align="center"></td>
                                    <td align="center">
                                    <input ${disabled} type="hidden" value="${itemNum}" name="itemnum_${time}"/>
                                    <input ${disabled} type="hidden" value="${sapTaskId}" name="sapTaskId_${time}"/>
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
                                    <td>&nbsp;</td>
                                    <td>${deleteBtn}</td>
                                    </tr>
                            `;
                        });
                    }
                    $("#singleAcNotice").closest("table").append(html);
                } else {
                    MsgAlert({content: jdata.msgData[0] ? jdata.msgData[0] : jdata.msg, type: 'error'});
                }
            }
        });
    }


    //删除按钮
    $(document).delegate(".del_btn", "click", function () {
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
        let td;
        if ($("#cardType").combobox('getValue').indexOf("DEF") != -1) {
            td = '<td align="center"><input  style="width: 90%;text-align: center;" class="validSatisfy" name="satisfy_' + time + '" value=""/></td>';
        }
        let tpl = `<tr class="mrItem">
                    <td align="center"></td>
                    <td align="center">
                    <input type="hidden" value="" name="itemnum_${time}"/>
                    <input readonly maxlength="100" style="width:80%" class="required validpn" id ="pn_${time}"  name="pn_${time}" value=""/> 
                    <img src="/images/ico_search_16.gif" style="vertical-align: -6%" onclick="toPn(${time})" class="select_pn"/>
                    </td>
                    <td align="center">
                    <input maxlength="1000" style="" class="validpn" name="optionalPns_${time}" value=""/>
                    <div  class="errorMessage"></div>
                    </td>
                    <td align="center">
                    <input maxlength="600" class="required"  id="pnname_${time}" name="pnname_${time}" />
                    <div  class="errorMessage"></div>
                    </td>
                    <td align="center">
                    <input id="ar_${time}" class="arCheck" type="checkbox"/>
                    <label>AR</label>
                    <input  maxlength="10"  class="required number" min="0.01" style="width: 50px" name="qty_${time}"/>
                    <div  class="errorMessage"></div>
                    </td>
                    <td align="center">
                    ${unitTrDiv}
                    <div  class="errorMessage"></div>
                    </td>
                    <td align="center">
                    <input name="assetNum_${time}" style="width:90%;"  readonly/>&nbsp;
                    </td>   
                    <td align="center">
                    <input name="serialNum_${time}" style="width:90%;" readonly/>&nbsp;
                    </td>    
                    <td align="center">
                    <input name="lotNum_${time}" style="width:90%;" readonly/>&nbsp;
                    </td>  
                    <td align="center">
                    <input maxlength="30" readonly class="required stationValid" style="width: 50px" name="station_${time}"/>
                    <div  class="errorMessage"></div>
                    </td>
                    <td style="word-break: break-all; white-space: normal;">      
                    <textarea style="width: 97%" maxlength="1000" name="remark_${time}" rows="" cols=""></textarea>
                    <div  class="errorMessage"></div>
                    </td>${td}<td>
                    <input type="button" class="btn del_btn" value="Delete" />
                    </td>
                   </tr>
                    `;
        var $tpl = $(tpl);
        $(this).closest("table").append($tpl);
        $("input[id^=ar_]").attr("disabled", true);
        processDeleteBnt();


    });

    getMrBySapTaskId(params);
});


function toPn(time) {
    //件号库
    $.pnSelect({
        station: $("#station").textbox('getValue'),
        success: data => {
            selectPn(data, time);
        }
    });
}

function undefineFilter(value) {
    return typeof (value) == "undefined" || value == null ? '' : value;
}

function judgeShow(val) {
    return val == "D" ? 'mrItem delTr' : 'mrItem';
}
function selectPn(data,time) {
    var station = $("#station").textbox('getValue').replace(/(^\s*)|(\s*$)/g, "");
    $(`#pn_${time}`).val(data.partno);
    $(`#pnname_${time}`).val(data.description);
    $(`select[name=unit_${time}]`).val(data.issueunit);
    $(`input[name=serialNum_${time}]`).val(data.serialNum);
    $(`input[name=itemnum_${time}]`).val(data.partno);
    $(`input[name=assetNum_${time}]`).val(data.assetNum);
    $(`input[name=lotNum_${time}]`).val(data.lotNum);
    $(`input[name=station_${time}]`).val(station);
    let unitMrIdHtml = "";
    $.each(data.allunit.split(","), function (i, v) {
        unitMrIdHtml += `<option value="${v}">${v}</option>`;
    });
    $(`select[name=unit_${time}]`).append(unitMrIdHtml);
}
function selectSn(data,time) {
    $(`#pn_${time}`).val(data.partNo);
    $(`#pnname_${time}`).val(data.description);
    $(`select[name=unit_${time}]`).val(data.unit);
    $(`input[name=serialNum_${time}]`).val(data.serialNum);
    $(`input[name=itemnum_${time}]`).val(data.partNo);
    $(`input[name=assetNum_${time}]`).val(data.assetNum);
    $(`input[name=station_${time}]`).val(data.location);
    $(`input[name=lotNum_${time}]`).val(data.lotNum);
}
function stationQuery() {
    // var title_ = $.i18n.t('航站查询');
    var title_ = "Select Station";
    var curWidth = ($(window).width() * 0.9).toString();
    var curheight = ($(window).height() * 0.9).toString();
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: title_,
        param: {
            successCallback: function () {
                var cardType = $("#cardType").combobox('getValue');
                var station = $("#station").textbox('getValue').replace(/(^\s*)|(\s*$)/g, "");
                if (cardType && station) {
                    //cardType和station 任何一个变化,都清空具体件号行,重新生成
                    $(".mrItem").remove();
                    $(".add_btn").attr("disabled", false);
                }
                if((station == 'SZX' || station == 'HGH') && (cardType.indexOf("DEF") != -1)) {
                    $("#cardType").combobox('setValue', 'DEFREQ');
                    $("#cardType").combobox("disable");
                } else {
                    $("#cardType").combobox("enable");

                }
            }
        },
        url: "/views/mr/mrStore_select.shtml"
    });
}
function get_post_data() {
    let mrItems = $(".mrItem");
    let reqTime = $("#requireDate").datetimebox("getValue");
    if (new Date(reqTime) < new Date()) {
        MsgAlert({content: "需求日期不能小于当前日期", type: 'error'});
        return false;
    }
    if(mrItems.length < 1){
        MsgAlert({content: "请先添加条目", type: 'error'});
        return false;
    }
    if($("#approver_id").val() == $("#reportor_id").val()){
        MsgAlert({content: "发起人和审批人不能为同一人", type: 'error'});
        return false;
    }

    var mrAddparams = JSON.parse(sessionStorage.getItem('mraddParams'));
    var mr = {};
    mr["mrNum"] = "";
    mr["packageNum"] = mrAddparams.packageNumber || '';
    mr["assetId"] = "";
    mr["assetType"] = "";
    mr["relatedWorkCardNum"] = "";
    mr["aog"] = false;
    mr["tdWorkOrderId"] = mrAddparams.sonId || '';
    mr["mrSourceType"] = "";
    mr["executeType"] = "";
    mr["repeatability"] = false;
    mr["mrRevisionNum"] = 0;
    mr["times"] = "";
    mr["reason"] = "";
    mr["unlimited"] = '0';
    mr["timeLimitType"] = "";
    mr["delayTimes"] = "";
    mr["classification"] = "";
    mr["deleteSerialNumber"] = $("#deleteSerialNumber").val();
    if(mrAddparams.tdWorkType == 'DEFECT' || mrAddparams.tdWorkType == 'DD'){
        mr["tdWorkType"] = "DEFECT";
    }else{
        mr["tdWorkType"] = mrAddparams.tdWorkType;
    }
    if (mrAddparams.tdWorkType == "NRCT") {
        mr["interval"] =  $("#interval").textbox('getValue');
    }else{
        mr["interval"] = '';
    }
    mr["workType"] =  $("#cardType").combobox('getValue');
    mr["cardId"] = mrAddparams.cardId;
    mr["cardNum"] =  $("#cardNo").textbox('getValue');
    mr["requiredDate"] = $("#requireDate").datetimebox("getValue");
    mr["description"] = $("#remark").val();
    mr["approver"] = $("#approver_id").val();
    mr["mrReportedBy"] =  $("#reportor_id").val();
    mr["sapTaskId"] = mrAddparams.sapTaskId;
    mr["materialList"] = [];
    if($("#approver_id").val() == '' ||$("#reportor_id").val()== '' ||  $("#requireDate").datetimebox("getValue") == ''){
        MsgAlert({content: "请填写必填项", type: 'error'});
        return false;
    }
    if ($("#cardType").combobox('getValue') == 'DEFREQ') {
        if($('#tailOrEng').combobox('getValue')== 'Aircraft'){
            mr["assetId"] = $('#ser_acReg').combobox('getValue');
            mr["assetType"] = "A";
        }else if ($('#tailOrEng').combobox('getValue')== 'ENG'){
            mr["assetId"] = $('#esnId').combobox('getValue');
            mr["assetType"] = "E";
        }
    }else if ($("#cardType").combobox('getValue') == 'LM') {
        if($('#tailOrEng').combobox('getValue')== 'Aircraft'){
            mr["assetId"] = $('#ser_acReg').combobox('getValue');
            mr["assetType"] = "A";
        }else if ($('#tailOrEng').combobox('getValue')== 'ENG'){
            mr["assetId"] = $('#esnId').combobox('getValue');
            mr["assetType"] = "E";
        }else if ($('#tailOrEng').combobox('getValue')== 'NA'){
            mr["assetId"] = '';
            mr["assetType"] = "NA";
        }
    }else{
        if($('#tailOrEng').combobox('getValue')== 'Aircraft'){
            mr["assetId"] = $('#ser_acReg').combobox('getValue');
            mr["assetType"] = "A";
        }
    }
    $.each(mrItems, function(i,ele){
        mr["materialList"][i] = {};
        mr["materialList"][i].itemNum = $(ele).find("[name^=itemnum_]").val();
        mr["materialList"][i].sapTaskId = $(ele).find("[name^=sapTaskId_]").val();
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
        mr["materialList"][i].revRemark = 'I';
        var qty = $(ele).find("[name^=qty_]");
        var isar = $(ele).find("[id^=ar_]");
        if($.trim($(ele).find("[name^=pn_]").val()) == '' || $.trim($(ele).find("[name^=qty_]").val()) == '') {
            MsgAlert({content: "请填写addMr条目必填项", type: 'error'});
            return  mr = false;
        }

        if(isar.is(":checked")){
            mr["materialList"][i].itemQty = false;
            mr["materialList"][i].ar = true;
        }else{
            mr["materialList"][i].itemQty = qty.val();
            mr["materialList"][i].ar = false;
            var patrn = /^\d+(\.\d+)?$/;
            if (!patrn.exec(qty.val())){
                MsgAlert({content: "请在QTY输入合法数字", type: 'error'});
                return  mr = false;
            }
        }
    });
    return mr;
}

function saveMr() {
    // 判断是否有修改需求时间
    let reqTime = $("#requireDate").datetimebox("getValue");
    if(new Date(reqTime).getTime() != new Date(oldRequireDate).getTime()) {
        isUpdate = true;
    }
    var params = getParentParam_();
    var mrAddparams = JSON.parse(sessionStorage.getItem('mraddParams'));
    var _url = '';
    var postData;
    let mrItems = $(".mrItem");
    if(isUpdate && isDisabled && isHasItem && (mrItems.length < 1)) {
        _url = basePath + "/api/v1/mr/mr/updateRequiredDate";
        let mr = {};
        mr["sapTaskId"] = mrAddparams.sapTaskId;
        mr["requiredDate"] = reqTime;
        mr["station"] = $("#station").val();
        mr["deleteSerialNumber"] = $("#deleteSerialNumber").val();
        postData = mr;
    } else {
        var workType = params.tdWorkType || mrAddparams.tdWorkType;
        if(workType == 'DD' || workType == 'LM') {
            _url = basePath + "/api/v1/mr/mr/add";
        } else if(workType == 'DEFECT') {
            _url = basePath + "/api/v1/defect/defect_base_info/addMr";
        }else{
            _url = basePath + "/api/v1/sta/mr/add";
        }
        postData = get_post_data();
    }
    if(postData) {
        //通过url中取值
        $.ajax({
            url: _url,
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            type: 'POST',
            data: JSON.stringify(postData),
            async: true,
            cache: false,
            beforeSend: function () {
                ajaxLoading();
                $('#saveBtn').text("提交中...")
            },
            success: function (obj, textStatus) {
                ajaxLoadEnd();
                console.log(obj);
                if(obj.code == '200') {
                    sessionStorage.removeItem("mraddParams");
                    if(typeof params.OWindow.reload_ == 'function') {
                        params.OWindow.reload_();
                    }
                    params.OWindow.MsgAlert({content: obj.msgData[0] ? obj.msgData[0] : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    CloseWindowIframe();

                } else if(obj.code == '202') {
                    if(typeof params.OWindow.reload_ == 'function') {
                        params.OWindow.reload_();
                    }
                    var shortMsg = '';
                    Object.keys(obj.data).forEach(function (key) {
                        shortMsg += key + "缺" + obj.data[key] + "件"
                    });

                    MsgAlert({content: shortMsg, type: 'error'});

                } else {
                    MsgAlert({content: obj.msgData[0] ? obj.msgData[0] : obj.msg, type: 'error'});
                }
                $('#saveBtn').text("保存");
            },
            error: function () {
                ajaxLoadEnd();
                $('#saveBtn').text("保存");
            }
        });
    }
}

