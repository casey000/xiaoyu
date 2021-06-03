var releasetype_list=[];
$(function(){
    // 优先加载数据字典
    queryDataDict({
        "domainCode": "RELEASE_TYPE", "functionCode": "ANALYSIS_DOMAIN_BYCODE",
        succFn:function(data){
            if(data){
                releasetype_list=data.RELEASE_TYPE;
            }
        }
    });
});

function i18nCallBack() {
    getParentParams(function(){
        queryDistributeTable(function(){
            searchBlur();
        });
    });
}
let params;
let distributeList = [];
function getParentParams(callback){
    params = getParentParam_();
    if(params){
        callback();
    }
}

//获取发料表格数据 根据顶级工装id获取发料清单
function queryDistributeTable(callback){
    if(params.hasOwnProperty('workorderId')){
        $.ajax({
            type: "GET",
            url: "/api/v1/outbound/selectByWorkOrderId/"+ params.workorderId,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                if(data.code == 200 && data.data){
                    distributeList = data.data;
                    //填充表格每一行数据
                    for(let m=0;m<distributeList.length;m++) {
                        initTableLine(distributeList[m],m);
                    }
                    if(callback){
                        callback();
                    }
                }
            },
            error: function () {
                MsgAlert({content: '获取外站发料信息失败', type: 'error'});
            }
        });
    };
}

//填充表格每一行数据

function initTableLine(item){
    let operate = '';
    let pMaskHtml=prohibitedList(item.prohibitedMark);
    if(item.sentQty >= item.needQty){
        operate = '<td></td>';
    }else {
        if(params.fromStation==item.requireStation){
            operate = "<td><span style='display:block;width: 16px;height: 16px;margin: 0 auto'> <a onclick='distributeInfo(" + JSON.stringify(item) +")' title=\"发料\" style='display:block;width: 16px;height: 16px;'  class=\"icon-edit\"></a></span></td>";
        }else{
            operate = '<td></td>';
        }


    }



    let contHtml_2 = "<tr class=\"cont\">\n" +operate+
        "<td><span>"+item.mrNo+"</span></td>\n" +
        "<td><span>"+(item.requireStation ? item.requireStation : "--")+"</span></td>\n" +
        "<td><span>"+item.pn+"</span></td>\n" +pMaskHtml +
        "<td><span>"+item.needQty+"</span></td>\n" +
        "<td><span>"+item.unit+"</span></td>\n" +
        "<td><span>"+item.sentQty+"</span></td>\n" +
        "<td><span>"+(item.sendQty ? item.sendQty : '--')+"</td>\n" +
        "<td><span>"+(item.batchNo ? item.batchNo : '--')+"</td>\n" +
        "<td><span>"+(item.sn ? item.sn : '--')+"</td>\n" +
        "<td><span>"+(item.status== false ? 'close':'open')+"</span></td>\n" +
         "<td><span>"+item.workType+"</span></td>\n" +
         "<td><span>"+item.workNumber+"</span></td>\n" +
    "</tr>";
    $("#distributeTable").append($(contHtml_2));
}

function prohibitedList(mark){
    if(mark){
        if(mark=="JZ"){
            return "<td><span style='color:red;font-weight: bold'>禁</span></td>";
        }else{
            return "<td><span style='color:#e28b41;font-weight: bold'>限</span></td>";
        }
    }else{
        return "<td><span>--</span></td>";
    }
}

//搜索框显示
function showSearch(id) {
    $("#" + id).show().find('input').select();
}
$(document).click(function(e){
    var _wjlx = $('#wjlx');   // 设置目标区域
    var _wjbh = $('#wjbh');
    var _xqjh = $('#xqjh');
    var _mrzt = $('#mrzt');
    var _fangdajin = $('.fangdajin');
    if(!_wjlx.is(e.target) && _wjlx.has(e.target).length === 0 &&  !$("#wjlx").is(":hidden") && !_fangdajin.is(e.target)){ // Mark 1
        $("#wjlx").hide();
    }
    if(!_wjbh.is(e.target) && _wjbh.has(e.target).length === 0 &&  !$("#wjbh").is(":hidden") && !_fangdajin.is(e.target)){
        $("#wjbh").hide();
    }
    if(!_xqjh.is(e.target) && _xqjh.has(e.target).length === 0 &&  !$("#xqjh").is(":hidden") && !_fangdajin.is(e.target)){
        $("#xqjh").hide();
    }
    if(!_mrzt.is(e.target) && _mrzt.has(e.target).length === 0 &&  !$("#mrzt").is(":hidden") && !_fangdajin.is(e.target)){
        $("#mrzt").hide();
    }
});


//搜素失焦事件
function searchBlur(){
    let xqjh = "";
    let wjlx = "";
    let wjbh = "";
    let yes = "";
    xqjh = $("#xqjh_in").val();
    wjlx = $("#wjlx_in").val();
    wjbh = $("#wjbh_in").val();

    //都展示
    if($("#yes").is(':checked') && $("#no").is(':checked')){
        yes = '';
    }
    //展示已发料
    if($("#yes").is(':checked') && !$("#no").is(':checked')){
        // yes ='已发料';
        yes ='close';
    }
    //展示未发料
    if(!$("#yes").is(':checked') && $("#no").is(':checked')){
        // yes ='未发料';
        yes ='open';
    }
    //都不展示
    if(!$("#yes").is(':checked') && !$("#no").is(':checked')){
        $("#distributeTable" + " tr.cont").each(function (i, e) {
            $(e).hide();
        });
        return false;
    }
    if(xqjh || wjlx || wjbh || yes){
        filter("external_distribute", xqjh, wjlx, wjbh, yes);
    }else{
        $("#distributeTable" + " tr.cont").each(function (i, e) {
            $(e).show();
        })
    }
}

//搜索过滤
function filter(type,xqjh, wjlx, wjbh,yes){
    $("#distributeTable" + " tr.cont").each(function (i, e) {
        $(e).hide();
        if (filterTr(e, xqjh, wjlx, wjbh,yes)) {
            $(e).show();
        }
    })
}

function filterTr(tr, xqjh, wjlx, wjbh,yes){
    // var flag = filterFlag(tr, xqjh, $(tr).find('td').eq(2).text());// 需求件号
    // flag = flag && filterFlag(tr, wjlx, $(tr).find('td').eq(10).text());//文件类型
    // flag = flag && filterFlag(tr, wjbh, $(tr).find('td').eq(11).text());//文件编号
    // flag = flag && filterFlag(tr, yes, $(tr).find('td').eq(9).text());//MR状态

    var flag = filterFlag(tr, xqjh, $(tr).find('td').eq(3).text());// 需求件号
    flag = flag && filterFlag(tr, wjlx, $(tr).find('td').eq(12).text());//文件类型
    flag = flag && filterFlag(tr, wjbh, $(tr).find('td').eq(13).text());//文件编号
    flag = flag && filterFlag(tr, yes, $(tr).find('td').eq(11).text());//MR状态
    return flag;
}

function filterFlag(tr, val, id) {
    // 值为空时，无需过滤
    if (!val || !id) return true;

    if (id.indexOf(val) != -1) {
        return true
    } else {
        return false
    }
}

//发料数量校验
function needNumBlur(item){
    let reg = /^[1-9]\d*$/;
    let num = item.currentTarget.value;
    let total = $("#needQty").text();
    let send = $("#sentQty").text();
    if(!reg.test(num)){
        MsgAlert({content: "发料数量必须正整数！", type: 'error'});
        $("#sendQty").textbox("setValue",'');
        return false;
    }
    if(num > total - send){
        MsgAlert({content: "发料数量不能超过需求数量总数减去已发数量！", type: 'error'});
        $("#sendQty").textbox("setValue",'');
        return false;
    }
    return true;
}

function combobox1Event(item){
    if(curPn==item.pn){
        let param = {
            "batchNo": "",
            "pn":  item.pn,
            "sn":$("#distributNo").combobox("getValue"),
            "station": params.fromStation
        };
        $.ajax({
            type: "POST",
            url: "/api/v1/outbound/selectSnBatchNo",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(param),
            dataType: "json",
            success: function (data) {
                if(data.code == 200 && data.data){
                    $("#batchNo").combobox({
                        valueField: 'batchNo',
                        textField: 'batchNo',
                        panelHeight:'100px',
                        data: data.data,
                        onSelect: function (obj) {
                            if(obj.sn){
                                $("#distributNo").textbox("setValue", obj.sn);
                                prohibitedItem(item.pn,obj.sn,item.prohibitedMark);//禁限装
                            }else{
                                prohibitedItem(item.pn,"",item.prohibitedMark);//禁限装
                            }
                        }
                    })
                }

            },
            error: function () {
                MsgAlert({content: '获取批次号失败', type: 'error'});
            }
        });
    }
}

function combobox2Event(item) {
    if(curPn==item.pn){
        let param = {
            "batchNo": "",
            "pn":  item.pn,
            "sn":$("#distributNo").combobox("getValue"),
            "station": params.fromStation
        };
        $.ajax({
            type: "POST",
            url: "/api/v1/outbound/selectSnBatchNo",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(param),
            dataType: "json",
            success: function (data) {
                if(data.code == 200 && data.data){
                    $("#distributNo").combobox({
                        valueField: 'sn',
                        textField: 'sn',
                        panelHeight:'100px',
                        data: data.data,
                        onSelect: function (obj) {
                            if(obj.batchNo){
                                $("#batchNo").textbox("setValue", obj.batchNo);
                                prohibitedItem(item.pn,obj.sn,item.prohibitedMark);//禁限装
                            }else{
                                prohibitedItem(item.pn,"",item.prohibitedMark);//禁限装
                            }
                        }
                    })
                }
            },
            error: function () {
                MsgAlert({content: '获取批次号失败', type: 'error'});
            }
        });
    }
}
let prohibitedMark;//禁限装
function prohibitedItem(pn,sn){
    //先移除上一次追加的line
    $("#distributeInfoBody tr").remove(".removeLine");
    //设置高度为自动，防止下一次查询的数据比上一次少，导致显示空白处影响体验
    $(".window-shadow").height("auto");
    let data={
        "pn":pn,
        "sn":sn
    };
    $.ajax({
        type: "POST",
        url: "/api/v1/prohibit/selectByPnAndSn",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
            if(data.code == 200 && data.data){
                var datas=data.data;
                for(let i=0;i<datas.length;i++){
                    let remark=datas[i].remark||"";
                    if(datas[i].businessType=="TB"){
                        remark==""?remark="请参考TB原文附件":remark;
                    }
                    remark = remark.replace(/[\r\n]/g, "");//换行
                    let html=`<tr class="line removeLine">
                            <td class="lineInfo">编号</td>
                            <td class="lineInfo val" id="prohibited_${datas[i].businessNo}">
                                <span style="cursor: pointer;color: #f60;" onclick="prohibitedCli('${datas[i].businessType}','${datas[i].businessId}')" title="预览">${datas[i].businessNo}</span>
                            </td>
                            <td class="lineInfo">描述</td>
<!--                            <td class="lineInfo val" colspan="3" style="overflow-x:hidden;white-space:nowrap;text-overflow:ellipsis">${remark}</td>-->
                             <td class="lineInfo val " colspan="3">
                                <div class="p_Remark" style="cursor: pointer;padding:0 4px;width:385px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" onclick="remarkDialog('${i}','${remark}')">
                                    ${remark}
                                </div> 
                             </td>
                        </tr>`;
                    $("#zs_prohibited").before(html);
                }
                if(datas.length>0){
                    if(datas[0].prohibitedMark=="XZ"){
                        prohibitedMark="XZ";
                        $("#zs_prohibited").show();
                        $("#releasetype").combobox({
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            data: releasetype_list,
                            onSelect:function(item){}
                        });
                        $("#pn span.pn_jxz").remove();
                        $("#pn").append("<span class='pn_jxz' style='color:#e28b41;font-weight: bold'>限</span>");
                    }else if(datas[0].prohibitedMark=="JZ"){
                        prohibitedMark="JZ";
                        $("#zs_prohibited").hide();
                        $("#pn span.pn_jxz").remove();
                        $("#pn").append("<span class='pn_jxz' style='color:red;font-weight: bold'>禁</span>");
                    }else{
                        //允装
                        prohibitedMark="";
                        $("#pn span.pn_jxz").remove();
                    }
                }else{
                    //允装
                    prohibitedMark="";
                    $("#zs_prohibited").hide();
                    $("#pn span.pn_jxz").remove();
                }
            }
        },
        error: function () {
            MsgAlert({content: '失败', type: 'error'});
        }
    });

}



function prohibitedCli(businessType,businessId){
    $(".remarkDialogLoad").show();//加载中
    if(businessType=="EO"){
        InitFuncCodeRequest_({
            data: {pkid: businessId, FunctionCode: 'EM_EO_PRINT'},
            successCallBack: function (jdata) {
                $(".remarkDialogLoad").hide();//加载中
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    let urls = jdata.data;
                    if (urls.indexOf(":") != -1) {
                        urls = urls.substring(urls.indexOf(":") + 1).replace("//", "/");
                    }
                    prohibitedPDF(urls);
                } else {
                    MsgAlert({content: jdata.msg, type: "error"});
                }
            }
        });
    }else if(businessType=="TB"){
        InitFuncCodeRequest_({
            data: {pkid: businessId, FunctionCode: 'EM_TB_PRINT'},
            successCallBack: function (jdata) {
                $(".remarkDialogLoad").hide();//加载中
                // ajaxLoadEnd();
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    let urls = jdata.data;
                    if (urls.indexOf(":") != -1) {
                        urls = urls.substring(urls.indexOf(":") + 1).replace("//", "/");
                    }
                    prohibitedPDF(urls);
                } else {
                    MsgAlert({content: jdata.msg, type: "error"});
                }
            }
        });
    }

}

function prohibitedPDF(url){
    var curWidth = ($(window).width() * 0.85).toString();
    var curheight = $(window).height().toString();
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: "",
        param: {},
        url: url,
    });
}

function remarkDialog(n,remark){
    var remarkHtml=$(".p_Remark")[n];
    var ch=remarkHtml.clientWidth;
    var sh=remarkHtml.scrollWidth;
    if(sh>ch){
        $(".remarkDialog").show();
        $(".remarkContent").text(remark)
    }
}
function remarkDialogClose(){
    $(".remarkDialog").hide();
}

let curItem = {};
let curPn;
function distributeInfo(item){
    $(".remarkDialog").hide();
    curPn=item.pn;
    curItem = item;
    prohibitedItem(item.pn,"");
    // console.log('df',item);
    $("#mrNo").text(item.mrNo);
    $("#pn span.pn_pn").text(item.pn);
    $("#unit").text(item.unit);
    $("#needQty").text(item.needQty);
    $("#sentQty").text(item.sentQty);
    $("#sendQty").textbox('setValue','');
    $("#batchNo").combobox({
        valueField: 'batchNo',
        textField: 'batchNo',
        panelHeight:'100px',
        data: []
    });
    $("#distributNo").combobox({
        valueField: 'batchNo',
        textField: 'batchNo',
        panelHeight:'100px',
        data: []
    });
    $("#combo1").click(function(){
        combobox1Event(item);
    });
    $("#combo2").click(function(){
        combobox2Event(item);
    });

    $(".distributeDialog").show();
    $("#distributeModal").dialog('open');

}

//发料点击
function confirmDistribute() {
    let param = {
        "mrNo": curItem.mrNo,
        "mrItem": curItem.mrItem,
        "pn":  curItem.pn,
        "needQty":curItem.needQty,
        "unit": curItem.unit,
        "sentQty": curItem.sentQty,
        "sendQty": parseInt($("#sendQty").textbox("getValue")),
        "sn":$("#distributNo").combobox("getValue"),
        "batchNo": $("#batchNo").combobox("getValue"),
        "sapTaskId":curItem.sapTaskId,
        "releaseType":$("#releasetype").combobox("getValue"),
        "releaseReason":$("#releaseReason").val()
    };
    if(!param.sendQty){
        MsgAlert({content: "发料数量不能为空", type: 'error'});
        return false;
    }
    if(!param.batchNo){
        MsgAlert({content: "发料批次不能为空", type: 'error'});
        return false;
    }

    if(prohibitedMark=="XZ"){//限装
        if(!param.releaseType){
            MsgAlert({content: "限装放行类型不能为空", type: 'error'});
            return false;
        }
        if(!param.releaseReason){
            MsgAlert({content: "限装放行理由不能为空", type: 'error'});
            return false;
        }

    }else if(prohibitedMark=="JZ"){
        MsgAlert({content: "禁装部件禁止发料", type: 'error'});
        return false;
    }
    $.ajax({
        type: "POST",
        url: "/api/v1/outbound/send",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(param),
        dataType: "json",
        success: function (data) {
            if(data.code == 200){
                //发料成功
                $('#distributeTable' + " tr.cont").remove();

                //发料成功后，展示open和close的数据
                $("#yes").prop("checked",true);
                queryDistributeTable();
                $(".distributeDialog").hide();
                $("#distributeModal").dialog('close');
            }else{
                MsgAlert({content: data.msg, type: 'error'});
                $(".distributeDialog").hide();
                $("#distributeModal").dialog('close');
            }
        },
        error: function () {
            MsgAlert({content: '外站发料失败', type: 'error'});
            $(".distributeDialog").hide();
            $("#distributeModal").dialog('close');
        }
    });
}

function cancelDistribute(){
    $(".distributeDialog").hide();
    $("#distributeModal").dialog('close');
}