$(function () {
    $('#rep_date').datetimebox({
        value: getNowFormatDate(),
        required: true,
        showSeconds: true
    });

    $("#repId").textbox("setValue", getLoginInfo().accountNumber);
    $("#repName").textbox("setValue", getLoginInfo().userName);
    $("#repidto").val(getLoginInfo().accountId);
    fengzhuang("repId");
    fengzhuang("testId");
    console.log(getParentParam_());
    queryCCTable();
    if (!getParentParam_().nrcrii) {
        $(".span_hide").hide();
    }
    //来源为老龄系统的展示修理补片信息
    sourceFromByPost(function () {
        $(".fixed_table").show();
        //获取补片信息
        queryFixedTable();
    });
});

//判断nrc来源是否是老龄ASMS
function sourceFromByPost(callback){
    let id = '';
    if(params.fixedType){
        id=params.fixedType.nrcid;
    }else {
        id=params.nrcid;
    }
    $.ajax({
        type: "GET",
        url: "/api/v1/tbm/nrc/nrcPhysicalInfo/findNrcSourceFrom/" + id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                if(data.data == "ASMS"){
                    callback();
                }
            }
        },
        error: function () {
            window.alert("失败！");
        }
    });
}
var params = getParentParam_();

/** 打开addCC页面 **/
function openAddCC(operation, id) {
    let title = "Add NRC CC";
    let param = {
        operation: operation,
        defect_info: {
            acId: getParentParam_().acid,
            ac: getParentParam_().ac,
            ata:getParentParam_().ata,
            acType : getParentParam_().acType,
            tlbId: "",
            flightNo: "",
            descChn: getParentParam_().descChn,
            descEn: getParentParam_().descEn,
            rectFinishChn: $("#rectFinishChn").val(),
            rectFinishEn: $("#rectFinishEn").val()
        },
        docNo: getParentParam_().nrcno,
        docType: 2,

    };
    if(id){
        param.id = id;
    }
    ShowWindowIframe({
        width: "1200",
        height: "700",
        title: title,
        param: param,
        url: "/views/defect/new_addcc.shtml"
    });
}


/** * 删除cc */
function deleteCC(id){
    let url = "/api/v1/cc/delete";
    let form = new FormData();
    form.append('id', id);
    axios.post(url, form).then(response=>{
        if(response.data.msg.toUpperCase().indexOf("SUCCESS") != -1){
        MsgAlert({type: "info", content: "删除成功"});
        queryCCTable()
    }else{
        throw new Error(response.data.msgData[0])
    }
}).catch(err=>{
        MsgAlert({type: "error", content: "删除失败: " + err})
})
}
//添加CC成功后回调函数
function queryCCTable() {
    $.ajax({
        type: "GET",
        url: "/part/eng/query_cc_list_by_doc?docType=2&docNo=" + getParentParam_().nrcno,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                params.OWindow.cosl_data(data.data);
                $(".close_sign").remove();
                for (var i in data.data) {
                    let offname = "";
                    if (data.data[i].offName == "" || data.data[i].offName == null) {
                        offname = data.data[i].onName;
                    } else {
                        offname = data.data[i].offName;
                    }
                    let offPosition = "";
                    if (data.data[i].offPosition == "" || data.data[i].offPosition == null) {
                        offPosition = data.data[i].onPosition;
                    } else {
                        offPosition = data.data[i].offPosition;
                    }
                    //添加操作start
                    let opration;
                    let status;
                    if(data.data[i].middleStatus == "O"){
                        status = "OPEN";
                        opration = `<td class="table-cell cell-normal" >
                            <a class="searchBtn" type="button" onclick="openAddCC('edit', ${data.data[i].id})" style="margin: 0 5px 0 5px">
                            <span>编辑</span>
                            </a>
                            <a class="clearBtn" type="button" onclick="deleteCC(${data.data[i].id})" style="margin: 0 5px 0 5px">
                            <span>删除</span>
                            </a>
                            <a class="ridoBtn" type="button" onclick="closeCC(${data.data[i].id})" style="margin: 0 5px 0 5px">
                            <span>提交</span>
                            </a>
                            </td>`;
                    }else if(data.data[i].middleStatus == "C" && data.data[i].status == "n"){
                        status = "CLOSE";
                        opration = `<td class="table-cell cell-normal" >
                            <a class="searchBtn" type="button" onclick="openAddCC('edit', ${data.data[i].id})" style="margin: 0 5px 0 5px">
                            <span>编辑</span>
                            </a>
                            </td>`;
                    }else if(data.data[i].middleStatus == "C" && data.data[i].status == "y"){
                        status = "CLOSE";
                        opration = `<td class="table-cell cell-normal" >                     
                            </td>`;
                    }
                    //添加操作end
                    let file = "<tr class='close_sign'>\n" +
                        "                    <td><input class=\"beiliao\"  readonly=\"readonly\"   style=\"width: 85%\" type=\"text\" value=\"" + null_(data.data[i].ccNo) + "\"></td>\n" +
                        "                    <td><input class=\"beiliao\"  readonly=\"readonly\"   style=\"width: 85%\" type=\"text\" value=\"" + null_(offname) + "\"></td>\n" +
                        "                    <td><input class=\"beiliao\"  readonly=\"readonly\"   style=\"width: 85%\" type=\"text\" value=\"" + null_(offPosition) + "\"></td>\n" +
                        "                    <td><input class=\"beiliao\" readonly=\"readonly\"   style=\"width: 85%\" type=\"text\" value=\"" + null_(data.data[i].offPn) + "\"></td>\n" +
                        "                    <td><input class=\"beiliao\"  readonly=\"readonly\"  style=\"width: 85%\" type=\"text\" value=\"" + null_(data.data[i].offSn) + "\"></td>\n" +
                        "                    <td><input class=\"beiliao\"  readonly=\"readonly\"   style=\"width: 85%\" type=\"text\" value=\"" + null_(data.data[i].onPn) + "\"></td>\n" +
                        "                    <td><input class=\"beiliao\"  readonly=\"readonly\"  style=\"width: 85%\" type=\"text\" value=\"" + null_(data.data[i].onSn) + "\"></td>\n" +
                        opration +
                        "                </tr>";
                    let html_row = $(file);
                    $("#cc_data").append(html_row);
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

function null_(data) {
    if (data == null) {
        return "";
    }
    return data;
}

function add_file() {
    let i = document.getElementsByClassName('atta_input_fliecss').length;
    let file = " <div id=\"atta_input_flie_" + i + "\" class=\"atta_input_fliecss\">\n" +
        "       <input class=\"textbox easyui-validatebox\" type=\"file\" id=\"atta_input_flie_a" + i + "\" size=\"300\" name=\"file\" data-options=\"required:true\"/>            \n" +
        " <div class='file_duihao' onclick=\"atta_input_flie('atta_input_flie_a'+" + i + ")\">✔</div>\n" +
        "                    <div class=\"jianhao icon-delete\" onclick=\"delete_atta_input_flie(atta_input_flie_" + i + ")\" style='margin-top: 4px'></div>\n" +
        "                </div>";
    let html_row = $(file);
    $("#attach_file").append(html_row);
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

function add_file_show() {
    $("#attach_file_data").empty();
    InitFuncCodeRequest_({
        data: {
            SOURCE_ID: getParentParam_().nrcid,
            CATEGORY: "nrcCloseAttachment",
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
                $("#attach_file_data").append(html_row);
            }
        }
    });
}

function reload_() {
    add_file_show();
}

function atta_input_flie(id) {

    var fileInput = $("#" + id).get(0).files[0];
    if (fileInput) {
        $.ajaxFileUpload({
            url: Constant.API_URL + 'ATTACHMENT_UPLOAD',
            secureuri: false,
            fileElementId: id, //file控件id
            dataType: 'json',
            data: {
                "fileCategory": "nrcCloseAttachment",
                "sourceId": getParentParam_().nrcid,
            },
            success: function (data) {
                if (data.code == 200) {
                    add_file_show();
                }
            }

        })
    } else {
        alert("请选择上传文件！");
    }
}

function subimt_close_nrc() {      //提交关闭NRC信息
    let nrcClose = {
        pid: getParentParam_().nrcid,
        type: "NRC",
        rectFinishChn: $("#rectFinishChn").val(),
        rectFinishEn: $("#rectFinishEn").val(),
        sta: $("#station").textbox("getValue"),
        finishMh: $("#finishMh").textbox("getValue"),
        finishDate: $("#finishDate").textbox("getValue"),
        finishSn: $("#repId").textbox("getValue"),
        //finishId: $("#repidto").val(),
        finishName: $("#repName").textbox("getValue"),
        checkerSn: $("#testId").textbox("getValue"),
        checkerName: $("#testName").textbox("getValue"),
        //checkerId: $("#testidto").val(),
    };
    if (nrcClose.rectFinishChn == "") {
        alert("处理措施中文不能为空！");
        return
    }
    if (nrcClose.rectFinishEn == "") {
        alert("处理措施英文不能为空");
        return
    }
    if (nrcClose.sta == "") {
        alert("航站不能为空！");
        return
    }
    if (nrcClose.finishDate == "") {
        alert("完工日期不能为空！");
        return
    } else {
        if (new Date(nrcClose.finishDate) > new Date()) {
            alert("完工日期不能大于当前时间");
            return
        }
    }
    if (nrcClose.finishMh == "") {
        alert("人工时不能为空！");
        return
    }
    if (nrcClose.finishSn == "") {
        alert("工作者不能为空！");
        return
    }
    if (nrcClose.finishName == "") {
        alert("工作者不能为空！");
        return
    }
    if (getParentParam_().nrcrii) {
        if (nrcClose.checkerSn == "") {
            alert("检验员不能为空！");
            return
        }
        if (nrcClose.checkerName == "") {
            alert("检验员不能为空！");
            return
        }
    }

    $.ajax({
        type: "POST",
        url: "/api/v1/tbm/nrc/close/submit_close",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(nrcClose),
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                alert("成功！");
                window.close();
                params.OWindow.close_win();
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

// 查询station的点击事件
function stationQuery() {
    var title_ = $.i18n.t('航站查询');
    var curWidth = ($(window).width() * 0.5).toString();
    var curheight = ($(window).height() * 0.5).toString();
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: title_,
        param: {},
        url: "/views/tbm/flb/station_query.shtml"
    });
}

//补片信息列表
function queryFixedTable(){
    let id ="";
    if(params.fixedType){
        id=params.fixedType.nrcid;
    }else {
        id=params.nrcid;
    }
    $.ajax({
        type: "GET",
        url: "/api/v1/tbm/nrc/nrcPhysicalInfo/queryNrcPhysicalInfoList/" + id,//todo
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            $(".fixed_id_list").remove();
            let tlbCompCCS=data.data;
            for(let i in tlbCompCCS){
                addFixedRow(tlbCompCCS[i],i);
            }

        },
        error: function () {
            MsgAlert({type: "error", content: "获取补片列表信息失败！"})
        }
    });
}

function addFixedRow(row_data, index){
    let opration = `<td colspan="2" class="table-cell cell-normal" >
                <a class="searchBtn" type="button" onclick="addOrEditFixed('edit',${row_data.id})" style="margin: 0 5px 0 5px">
                <span>EDIT</span>
                </a>
                <a class="clearBtn" type="button" onclick="deleteFixed(${row_data.id})" style="margin: 0 5px 0 5px">
                <span>DELETE</span>
                </a>
                </td>`;
    let fileHtml =`<td colspan="2" id="file_`+index+`"></td>`;
    let html = `<tr class="fixed_id_list">
            <td>${row_data.no || (parseInt(index)+1)}</td>
            <td>${row_data.length? row_data.length: ""}</td>
            <td>${row_data.wide? row_data.wide: ""}</td>
            <td>${row_data.thickness? row_data.thickness: ""}</td>
            <td>${row_data.area? row_data.area: ""}</td>
            <td>${row_data.material? row_data.material: ""}</td>
            <td>${row_data.weight? row_data.weight: ""}</td>
            <td>${row_data.torqueChange? row_data.torqueChange: ""}</td>
            <td>${row_data.inorout == 0 ? "--" : (row_data.inorout == 1 ? "内补": "外补")}</td>
            <td colspan="2" title="${row_data.remark? row_data.remark: ''}">
                ${row_data.remark?  (row_data.remark.length > 15 ? row_data.remark.slice(0,15)+"..." :row_data.remark )   : ""}
             </td>
              `+fileHtml+opration+`
            </tr>`;
    $("#fixed_table").append($(html));
    //多个附件结构
    for(let m=0;m<row_data.attachmentList.length;m++){
        let orgName = row_data.attachmentList[m].orgName.length >16 ? row_data.attachmentList[m].orgName.slice(0,14) + '...' : row_data.attachmentList[m].orgName;
        let file = `<div style="cursor:pointer;color: #f60" onClick="previewPdf('${row_data.attachmentList[m].pkid}','${row_data.attachmentList[m].orgName}')" title="`+row_data.attachmentList[m].orgName+`">`+orgName+`</div>`;
        $("#file_"+index).append(file);
    }
}

function deleteFixed(id) {
    $.ajax({
        type: "GET",
        url: "/api/v1/tbm/nrc/nrcPhysicalInfo/delete/" + id,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                MsgAlert({type: "success", content: "删除成功！"});
                queryFixedTable()
            }
        },
        error: function () {
            MsgAlert({type: "error", content: "删除失败！"})
        }
    });
}

function previewPdf(pkid,filename) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, filename: filename, FunctionCode: 'ATTACHMENT_DOWN'},
        successCallBack: function (jdata) {
            if (jdata.code === RESULT_CODE.SUCCESS_CODE) {
                doPost(Constant.API_URL + "/ATTACHMENT_DOWN", {pkid: pkid, filename: filename, down: 'Y'});
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//修理补片信息跳转
function addOrEditFixed(type,id){
    let param = {
        operation: type,
        nrcid:params.nrcid,
    };
    if(id){
        param.id = id;
    }
    ShowWindowIframe({
        width: "1000",
        height: "400",
        title: 'add Nrc Patch',
        param: param,
        url: "/views/tbm/flb/fixedPatch.shtml"
    });
}