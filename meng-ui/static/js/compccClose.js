/**********************************************************
 * 关闭CC  CC入口有9个文件
 * 	cco_process.shtml   / nrc_process.shtml / to_process.shtml
 * 	processDefect.shtml  / close_nrc.shtml  / jc_process.shtml
 * 	cco_process_checking.shtml / new_addcc.shtml / addTlb.shtml
 **********************************************************/

//submin---new_addcc.shtml


//关闭CC
function closeCC(id){
    ccId=id;
    if (confirm("确定关闭吗")) {
        $.ajax({
            type: "GET",
            url: "/api/v1/compCc/close/" + id,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                if(data.code==200){
                    MsgAlert({type: "success", content: "关闭成功"});
                    queryCCTable();
                }else {
                    if(40000<data.code&&data.code<50000){
                        if(data.msg){
                            MsgAlert({content:"失败："+data.msg, type: 'error'});
                        }else{
                            MsgAlert({content:"关闭失败", type: 'error'});
                        }
                    }else if(data.code>50000){
                        if(data.msg){
                            forceCode=data.code;
                            $(".force_Dialog").show();
                            $(".msgTips")[0].innerHTML=data.msg+",是否强行提交本条数据到SAP(后续运维人员会跟进)";
                        }else{
                            MsgAlert({content:"关闭失败", type: 'error'});
                        }
                    }else{
                        if(data.msg){
                            MsgAlert({content:"失败："+data.msg, type: 'error'});
                        }else{
                            MsgAlert({content:"关闭失败", type: 'error'});
                        }
                    }
                }
            },
            error: function (err) {
                MsgAlert({type: "error", content: "提交失败: " + err})
            }
        });
    }
}

//强制关闭
function forceSubmin(index) {
    if(index==1){
        $.ajax({
            type: "GET",
            url: "/api/v1/compCc/forciblyClose/" + ccId +"/"+ forceCode,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                $(".force_Dialog").hide();
                if(data.code==200){
                    MsgAlert({content:"更新成功"});
                    queryCCTable();
                }else{
                    MsgAlert({content:data.msg, type: 'error'});
                }

            },
            error: function () {
                window.alert("失败！");
            }
        });
    }else{
        $(".force_Dialog").hide();
    }
}
//强制关闭 END