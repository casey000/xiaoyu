var param;
$(function(){
//附件初始化
    reload_();

});

let forceCode="";//存强制关闭的code码
let ccId="";//cc的id号

//工号人名下拉选择
function fengzhuang(id,required) {
    $("#" + id).MyComboGrid({
        idField: 'ACCOUNT_NUMBER',  //实际选择值
        textField: 'ACCOUNT_NUMBER', //文本显示值
        panelHeight: '200px',
        required: required != undefined ? required : true,
        width: "50%",
        params: {FunctionCode: 'FLOW_WORK_ACCOUNT'},
        columns: [[
            {field: 'ACCOUNT_NUMBER', title: '工号', width: 50},
            {field: 'USER_NAME', title: '审核人', width: 50}
        ]],
        onHidePanel: function () {
            var t = $(this).combogrid('getValue');
            if (t != null && t != '' & t != undefined) {
                if (selectRow == null || t != selectRow.ACCOUNT_NUMBER) {//没有选择或者选项不相等时清除内容
                    // alert('请选择，不要直接输入！');
                    MsgAlert({type:"error",content:"请选择系统已存在的工号！"});
                    $(this).combogrid({value: ''});
                    $("#" + id).parents('td').siblings().children('.'+id).textbox('setValue',"");
                }
            }else{
                $("#" + id).parents('td').siblings().children('.'+id).textbox('setValue',"");
            }
        },
        onSelect: function (index, row) {
            selectRow = row;
            $("#" + id).parents('td').siblings().children('.'+id).textbox('setValue', row.USER_NAME);
            $("#" + id).siblings('.'+id).textbox('setValue', row.USER_NAME);
            $("#" + id).siblings('#'+id+'Id').val(row.ACCOUNT_ID);
        }
    });

}

/*添加 编辑CC*/
function addCC(operation, id){
    /*TODO*/
    var title_ = $.i18n.t('添加CC');
    var curWidth = ($(window).width() * 1).toString();
    var curheight = ($(window).height() * 0.85).toString();
    var ccDocType = 11;

    let params = {
        operation: 'add',
        defect_info: {
            taskType: $('#taskType').text()||"",
            acId: param.acId || "",
            ac: param.acReg || "",
            sapTaskId: sapTaskId||"",
            id: "",
            ata:param.ata,
            flightNo:param.flightNo || "",
            flightId: param.flightId || "",
            descChn:$('#taskDes').text(),
            station:param.station,
            // descEn:$("#descEn").val(),
            rectFinishChn:$('#feedbackCh').val(),
            rectFinishEn:$('#feedbackEn').val(),
            taskNumber:taskNumber
        },
        docNo: param.cardNumber,
        //{1: 'TLB', 2: 'NRC', 3: 'CC', 4: 'EO', 5: 'JC', 6: 'Defect', 7: 'PCO', 8: 'NRCT', 9: 'TO', 10: 'DDREVIEW', 11: 'CCO'}
        docType: 11
    };
    if(param.fixedType){
        params.defect_info.workorderId=param.fixedType.id;
    }else {
        params.defect_info.workorderId=param.sonId;
    }
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: title_,
        param: params,
        url: "/views/defect/new_addcc.shtml"
    });

}

/*clickDm*/
function clickDm(){
    if($('#dm').is(':checked')){
        confirm("该任务为DM项，请确认是否已按DM要求执行")
    }
}

/*queryCCTable*/
function queryCCTable(){
    $.ajax({
        type: "GET",
        url: "/api/v1/compCc/selectByDocTypeAndDocNo/11/"+param.cardNumber,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            $(".partChildren").remove();
            let ccoCompCCS=data.data;
            for(let i in ccoCompCCS){
                addCCRow(ccoCompCCS[i],i);
            }
        },
        error: function () {
            window.alert("失败！");
        }
    });
}

/*addCCRow*/
function addCCRow(item,index){
    let html = `<tr class="partLine partChildren">
        <td colspan="6" style=";background: #fff">
        <div class="partStyle val" style="width:8%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;color: #f60;cursor: pointer" onclick="editCC('view', ${item.id})">${item.ccNo? item.ccNo: ""}</div>
        <div class="partStyle val" style="width:12%;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;">${item.offName? item.offName: ""}</div>
        <div class="partStyle val" style="width:12%">${item.offPn? item.offPn: ""}</div>
        <div class="partStyle val" style="width:14%;">${item.offSn? item.offSn: ""}</div>
        <div class="partStyle val" style="width:12%;">${item.offPosition? item.offPosition: ""}</div>
        <div class="partStyle val" style="width:8%;">${item.onPn? item.onPn: ""}</div>
        <div class="partStyle val" style="width:8%;">${item.onSn? item.onSn: ""}</div>
        <div class="partStyle val"  id="ccOperation_`+ index +`" style="width:20%;border-right: none"></div>
        </td>`;
    $('#partContent').after(html);
    let operationHtml_1 = `
           <a class="searchBtn" type="button" onclick="editCC('edit', ${item.id})" style="margin: 0 5px 0 5px">
                <span>EDIT</span>
           </a>
            <a class="clearBtn" type="button" onclick="deleteCC(${item.id})"  style="margin: 0 5px 0 5px">
                <span>DELETE</span>
            </a>
            <a class="ridoBtn" type="button" onclick="closeCC(${item.id})" style="margin: 0 5px 0 5px">
                <span>CLOSE</span>
            </a>`;
    let operationHtml_2 = `
            <a class="searchBtn" type="button" onclick="editCC('edit', ${item.id})" style="margin: 0 5px 0 5px">
                <span>EDIT</span>
           </a>`;
    //middle状态为O时（open），按钮都显示，middle为close,并且status为n时，编辑按钮显示，middl为C,status为y时，全部隐藏
    if(item.middleStatus == 'O'){
        $("#ccOperation_" + index).append(operationHtml_1);
    }
    if(item.middleStatus == 'C' && item.status == 'n'){
        $("#ccOperation_" + index).append(operationHtml_2);
    }
    if(item.middleStatus == 'C' && item.status == 'y'){
        //do nothing
    }

}

function editCC(operation,id){
    let title = "edit CCO CC";
    let params = {
        operation: operation,
        defect_info: {
            acId: param.acId || "",
            ac: param.acReg || "",
            id: id,
            flightNo:param.flightNo || "",
            flightId: param.flightId || "",
            workorderId:param.sonId,
            descChn:$('#taskDes').text(),
            station:param.station,
            // descEn:$("#descEn").val(),
            rectFinishChn:$('#feedbackCh').val(),
            rectFinishEn:$('#feedbackEn').val()
        }
    };
    params.id = id;
    let url = "/views/defect/new_addcc.shtml";
    var curWidth = ($(window).width() * 1).toString();
    var curheight = $(window).height().toString();
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: title,
        param: params,
        url: url
    });
}

/*deleteCC*/
function deleteCC(id) {
    if (confirm("确定删除吗")) {
        $.ajax({
            type: "GET",
            url: "/api/v1/compCc/delete/" + id,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                if(data.code==200){
                    MsgAlert({type: "success", content: "删除成功"});
                    queryCCTable()
                }
            },
            error: function (err) {
                MsgAlert({type: "error", content: "删除失败: " + err})
            }
        });
    }
}

//进入页面立即执行
function i18nCallBack() {
    param = getParentParam_();
    getWorkData();
    initShow();
}

//页面初始化展示
function initShow() {
    $.ajax({
        type: "get",
        url: '/api/v1/flb/feedBack/tsNrcTaskCCComplete',
        contentType: "application/json;charset=utf-8",
        data: {Id: param.sonId},
        dataType: "json",
        success: function (jdata) {
            if(jdata.code==200){
                if(jdata.hasOwnProperty("data")){
                    var hadData = jdata.data;
                    $('#userSign').textbox('setValue', hadData.mechanicName);
                    $('#userSn').textbox('setValue', hadData.mechanicSn);
                    $('#checkerSn').textbox('setValue', hadData.inspectorNo);
                    $('#checkerSign').textbox('setValue', hadData.inspector);
                    $('#planHours').val(jdata.data.hours);
                    $("#completeDate").textbox('setValue', formatterDate(new Date(hadData.completeDate)));
                    $('#feedbackCh').val(hadData.feedbackCh);
                    $('#feedbackEn').val(hadData.feedbackEn);
                    $("#withoutPic").val(hadData.mechanicNoPhotoRemark);
                    if(hadData.isRii == '1') {
                        $("#mtSign").prop("checked", "checked");
                    }
                    if(hadData.isRci == '1') {
                        $("#ehSign").prop("checked", "checked");
                    }
                }
            }
        },
        error: function () {
            window.alert("失败！");
        }
    });
}

//日期转换器
function formatterDate (date) {
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"
        + (date.getMonth() + 1);
    var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    return date.getFullYear() + '-' + month + '-' + day+ ' '+hour+':'+minute+':'+second;
}

function reload_() {
    $("#fileList").empty();
    let sonId = param.sonId;
    var catType = 'feedback';
    // TODO 家宝让改成feedback
    // if (param.workType == 'NRC' || param.workType == 'CCO') {
    //     catType = 'NRC';
    // } else if (param.workType == 'NRCTASK' || param.workType == 'NRCT') {
    //     catType = 'NRCT';
    // }
    InitDataGrid(sonId, catType);
}

function InitDataGrid(pkid, category) {
    InitFuncCodeRequest_({
        data: {
            SOURCE_ID: pkid,
            CATEGORY: category,
            FunctionCode: 'ATTACHMENT_RSPL_GET'
        },
        successCallBack: function (jdata) {
            //为0时提示没有上传附件，无法查看
            // if (jdata.data.length==0){
            //     MsgAlert({content: "请先上传附件", type: 'error'});
            //     return;
            // }
            for (var i = 0; i < jdata.data.length; i++) {
                var trHTML = '<tr><input class="uploadId" value="\'+ jdata.data[i].PKID +\'" type="hidden"><td class="td5"><a target="_blank" onclick="downFile(' + jdata.data[i].PKID + ',' + jdata.data[i].PKID + ')">' + jdata.data[i].ORG_NAME + '</a></td><td class="td5"  ><input class="btn btn-primary" type="button"  value="删除" style="width: 50px;margin:5px;" onclick="deleteFile(' + jdata.data[i].PKID + ');return false;"/></td></tr>';
                $("#fileList").append(trHTML);//在table最后面添加一行
                // downFile(jdata.data[i].PKID,jdata.data[i].PKID);
            }
        }
    });
}

//附件删除
function deleteFile(pkid) {
    if (!confirm("是否刪除"))
        return;
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: 'ATTACHMENT_DEL'},
        successCallBack: function (jdata) {
            if (jdata.code == 200) {
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                reload_()
            }
        }
    });
}

/*上传*/
//底部上传按钮打开上传页面
function open_upload() {
    var catType = 'feedback';
    let sonId = param.sonId;
    var title_ = $.i18n.t('common:COMMON_OPERATION.UPLOAD');
    let option = {
        cat: catType,//文件夹
        sourceId: sonId,//
        successCellBack: "",
        fialCellBack: "",
    };
    ShowWindowIframe({
        width: "1000",
        height: "700",
        title: title_,
        param: option,
        url: "/views/data_manager/dm/upload/attachment_add.shtml"
    });
}

/*暂存*/
function save_z() {
    var postData = get_post_data();
    if(checkData(postData)){
        return false;
    };
    $.ajax({
        type: "POST",
        url: '/api/v1/flb/feedBack/tmpSaveNrcCC',
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(
            postData
        ),
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                alert("保存成功");
                window.close();
            }
        },
        error: function () {
            window.alert("失败！");
        }
    });
};

//提交数据
function get_post_data() {
    let post_data = {};
    let rii = $("input[id ='mtSign']:checked").val() ? '1' : '0';
    let rci = $("input[id ='ehSign']:checked").val() ? '1' : '0';
    let withoutPic = $("#withoutPic").val().trim();
    post_data = {
        id: param.sonId,
        cardId: param.cardId,
        //航站
        station: param.station,
        //重要标志，缺少IFSD!!!!!
        // isRci: param.isRci,
        // isRii: param.isRii,

        isRci: rci,
        isRii: rii,

        isDm: param.isDm,
        isSd: param.isSd,
        //关卡人ID
        finishId: $('#userSnId').val(),
        //关卡人姓名
        mechanicName: $('#userSign').textbox('getValue'),
        //关卡人工号
        mechanicSn: $("#userSn").textbox('getValue'),
        workType: param.workType,
        //完工日期
        completeDate: new Date($('#completeDate').datetimebox('getValue')),
        //反馈信息（中文）
        feedbackCh: $('#feedbackCh').val(),
        //反馈信息（英文）
        feedbackEn: $('#feedbackEn').val(),
        //必检人工号
        inspectorNo: $("#checkerSn").textbox('getValue'),
        //必检人名字
        inspector: $("#checkerSign").textbox('getValue'),
        //必检人id
        checkerId: $('#checkerSnId').val(),
        //工时
        hours: $.trim($("#planHours").val()),
        //不存在的数据!!!!
        // rectChn: $('#cs_zh').val(),
        // rectEn: $('#cs_eh').val(),
        // componentCC: ccId,
        // componentCCNum: ccNum,
        mechanicNoPhotoRemark:withoutPic,
    };
    return post_data
};

//校验逻辑
function checkData(data) {
    var flag = false;
    var now = new Date();
    let rii = $("input[id ='mtSign']:checked").val() ? '1' : '0';
    let rci = $("input[id ='ehSign']:checked").val() ? '1' : '0';
    if (rii != '0' || rci != '0') {
        if (!$("#checkerSn").textbox('getValue')) {
            MsgAlert({content: '请填写必检/互检人签名', type: 'error'});
            flag = true;
        }
    }
    if($('#completeDate').datetimebox('getValue')==""){
        flag = true;
        alert("请选择完工时间");
    }else if(data.completeDate > now){
        flag = true;
        alert("完工时间不能大于当前时间");
    }else if(!!data.hours==false){
        flag = true;
        alert("请选择工时");
    }else if(!!data.mechanicSn==false){
        flag = true;
        alert("请选择关卡人工号");
    }else if(!!data.feedbackCh==false){
        flag = true;
        alert("请输入反馈信息（中文）");
    }else if(!!data.feedbackEn == false){
        flag = true;
        alert("请输入反馈信息（英文）");
    };
    if(isCheckerCanSign() && !!data.inspectorNo==false){
        flag = true;
        alert("请选择必检人工号");
    }
    return flag;
};

//上传附件校验
function ifFile() {
    var flag;
    if($('#yes').is(':checked')== true&&$("#fileList").children().length==0){
        alert("附件反馈必须，请提交附件");
        flag = true;
    }
    return flag;
};

/*关闭任务*/
function close_z() {
    var postData = get_post_data();
    let uploadItem = $('.uploadId');
    if(uploadItem.length < 1){
        let withoutPic = $("#withoutPic").val().trim();
        if(!withoutPic){
            MsgAlert({type: "error", content: "无附件时，无照片备注必填"});
            return false;
        }
    }
    //普通校验
    if(checkData(postData)){
        return false;
    };
    //上传附件校验
    if( ifFile()== true){
        return false;
    };
        postData.status = "COMPLETED";
        let WorkOrderDTO = JSON.stringify(postData);
        let datas = $.extend({}, {WorkOrderDTO: WorkOrderDTO}, {FunctionCode: 'COMP_STA_TASK'});
        // $.ajax({
        //     type: "POST",
        //     url: '/api/v1/flb/feedBack/complete/CCO',
        //     contentType: "application/json;charset=utf-8",
        //     data: JSON.stringify(
        //         postData
        //     ),
        //     dataType: "json",
        //     success: function (data) {
        //         if (data.code == 200) {
        //             if (param.fixedType) {
        //                 param.OWindow.Refresh();
        //             } else {
        //                 param.OWindow.listreload_();
        //             }
        //             param.OWindow.MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
        //             window.close();
        //         } else {
        //             if(data.msgData){
        //                 if(data.msgData[0] === null || data.msgData[0] == 'null'){
        //                     data.msgData[0] = '系统异常'
        //                 }
        //             }
        //             MsgAlert({content: data.msgData ? data.msgData[0] : data.msg, type: 'error'});
        //         }
        //     },
        //     error: function () {
        //         MsgAlert({content: "连接失败！", type: 'error'});
        //     }
        // });
        InitFuncCodeRequest_({
            data: datas,
            successCallBack: function (jdata) {
                if(jdata.code === RESULT_CODE.SUCCESS_CODE) {
                    if(param.fixedType) {
                        param.OWindow.Refresh();
                    } else {
                        param.OWindow.listreload_();
                    }
                    param.OWindow.MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    window.close();
                } else {
                    MsgAlert({content: jdata.msgData[0] ? jdata.msgData[0] : jdata.msg, type: 'error'});
                }
            }
        });

}

/*是否必须上传文件判断*/
function mustUpLoadClick(){
    if($('#yes').is(':checked')){
        return true;
    }else{
        return false;
    }
}

/*重要标识为RII,RCI时必检人，否则不能填*/
function isCheckerCanSign(){
    if($('#rii').is(':checked') || $('#rci').is(':checked')){
        return true;
    }else{
        return false;
    }
}

//重要标志
var isSd1,isCmr1,isAli1,isCdccl1,isCpcp1,isEwis1,isFts1,isRsc1,isSsi1,isImportantModification1,isRii1, isRci1,isDm1;
var taskNumber = "";
var sapTaskId = "";
var planeHours = "";
//    获取工单信息并显示start
function getWorkData(){
    $.ajax({
        type: "GET",
        url: "/api/v1/workOrder/getWorkOrder/"+ param.sonId,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log("工单查询获取的数据: " + JSON.stringify(data));
            //console.log(data);
           var WorkOrderData = data.data;
            if(!!WorkOrderData){
                isImportantModification1 = WorkOrderData.isImportantModification;
                isCmr1 = WorkOrderData.isCmr;
                isAli1 = WorkOrderData.isAli;
                isCdccl1 = WorkOrderData.isCdccl;
                isCpcp1 = WorkOrderData.isCpcp;
                isDm1 = WorkOrderData.isDm;
                isEwis1 = WorkOrderData.isEwis;
                isFts1 = WorkOrderData.isFts;
                isSd1 = WorkOrderData.isSd;
                isRci1 = WorkOrderData.isRci;
                isRsc1 = WorkOrderData.isRsc;
                isSsi1 = WorkOrderData.isSsi;
                isRii1 = WorkOrderData.isRii;
                taskNumber = WorkOrderData.taskNumber;
                sapTaskId =  WorkOrderData.sapTaskId;
                planeHours = WorkOrderData.planeHours||"";
            };
            $('#planeHours').text(planeHours||"");
            getParentParams(function(){
                queryCCTable();
                fengzhuang("userSn");
                if(isCheckerCanSign()){
                    //rii rci 勾选一个或都勾选 必检人必填
                    fengzhuang("checkerSn");
                }else{
                    //选填
                    fengzhuang("checkerSn",false);
                }

            });
        },
        error: function () {
            getParentParams(function(){
                queryCCTable();
                fengzhuang("userSn");
                if(isCheckerCanSign()){
                    //rii rci 勾选一个或都勾选 必检人必填
                    fengzhuang("checkerSn");
                }else{
                    //选填
                    fengzhuang("checkerSn",false);
                }

            });
            alert("工单数据获取失败");
        }
    });

}



//获取数据
function getParentParams(callback){
    // param = getParentParam_();
    var operation, acReg,acModel,isSd,isCmr, acId, flightNo, flightId, departure, arrival, station, flyDte, description, workStatus,
        workType, cardNumber, isRii, isRci,isDm,isAli,isCdccl,isCpcp,isEwis,isFts,isRsc,isSsi,isImportantModification, orderId, sonId, itemNo, cardId, isFeedbackAttachment;
        operation = param.operation;
        acReg = param.acReg;
        if(!!param.acReg && param.acReg != "null"){
            acReg = param.acReg;
        }else {
            acReg = "";
        };
        acModel = param.acModel;
        acId = param.acId;
        flightNo = param.flightNo;
        flightId = param.flightId;
        departure = param.departure;
        arrival = param.arrival;
        station = param.station;
        flyDte = param.nt_crDate;
        description = param.description;
        workStatus = param.status;
        workType = param.workType;
        cardNumber = param.cardNumber;
        isRii = param.isRii;
        isRci = param.isRci;
        isDm = isDm1;
    isCmr = isCmr1;
    isAli = isAli1;
    isCdccl = isCdccl1;
    isCpcp = isCpcp1;
    isEwis = isEwis1;
    isFts = isFts1;
    isRsc = isRsc1;
    isSsi = isSsi1;
    isSd = isSd1;
    isImportantModification = isImportantModification1;
        orderId = param.orderId;
        sonId = param.sonId;
        cardId = param.cardId;

        isFeedbackAttachment = param.isFeedbackAttachment;

    $('#acReg').text(acReg);
    /*机型TODO*/
    $('#acModel').text(acModel);
    $('#flyDte').text(flyDte);
    $('#flyStation').text(station);
    $('#flightNo').text(flightNo);
    $('#flyType').text(operation);
    /**/
    $('#taskDes').text(description || '');
    $('#taskType').text(workType);
    $('#docNo').text(cardNumber);
    /**/
    $('#workStatus').text(workStatus);

    // if(isRii==null || isRii==""){
    //     $('.rii').hide();
    // }else if(isRii == "X") {
    //     $('#rii').prop('checked',true);
    // }

    if(isRii == "X") {
        $('#rii').prop('checked',true);
        $('.rii').show().css("display","inline-block");
    }

    if(isRci == "X"){
        $('#rci').prop('checked',true);
        $('.rci').show().css("display","inline-block");
    }

    if(isSd == "X") {
        $('#ifsd').prop('checked',true);
        $('.ifsd').show().css("display","inline-block");
    };

    if(isDm == "X") {
        $('#dm').prop('checked',true);
        $('.dm').show().css("display","inline-block");
    }

    if(isCmr == "X") {
        $('#cmr').prop('checked',true);
        $('.cmr').show().css("display","inline-block");
    }

    if(isAli == "X") {
        $('#ali').prop('checked',true);
        $('.ali').show().css("display","inline-block");
    };

    if(isCdccl == "X") {
        $('#cdccl').prop('checked',true);
        $('.cdccl').show().css("display","inline-block");
    };

    if(isCpcp == "X") {
        $('#cpcp').prop('checked',true);
        $('.cpcp').show().css("display","inline-block");
    };

    if(isEwis == "X") {
        $('#ewis').prop('checked',true);
        $('.ewis').show().css("display","inline-block");
    };

    if(isFts == "X") {
        $('#fts').prop('checked',true);
        $('.fts').show().css("display","inline-block");
    };

    if(isRsc == "X") {
        $('#rsc').prop('checked',true);
        $('.rsc').show().css("display","inline-block");
    };

    if(isSsi == "X") {
        $('#ssi').prop('checked',true);
        $('.ssi').show().css("display","inline-block");
    };

    if(isImportantModification == "X") {
        $('#importantModification').prop('checked',true);
        $('.importantModification').show().css("display","inline-block");
    };


    if(isRii && isRci){
        $("#mtSign").prop("checked", "checked");
        $('#bijian').css({'visibility': 'visible'});
    }
    if(isRii && !isRci){
        $("#mtSign").prop("checked", "checked");
        $('#bijian').css({'visibility': 'visible'});

    }
    if(isRci && !isRii){
        $("#ehSign").prop("checked", "checked");
        $('#bijian').css({'visibility': 'visible'});

    }
    if(!isRci && !isRii){
        $("#ehSign").prop("checked", "checked");
        $('#bijian').css({'visibility': 'visible'});

    }
    if(isRci || isRii){
        $('.block').css('display','block')
    }


    if(isFeedbackAttachment){
        $('#yes').attr('checked',true);
        $('#no').attr('checked',false);
    }else{
        $('#yes').attr('checked',false);
        $('#no').attr('checked',true);
    }
    if(param){
        /*获取完数据后请求cc列表*/
        callback();
    }
}