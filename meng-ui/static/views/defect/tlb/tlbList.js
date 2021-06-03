$(function() {
    var optsCols = [];
    optsCols.push("edit");
    optsCols.push("delete");
    var options = {
        view : 'V_TLB_TECH_LOG',
        qcOptions :{
            qcBoxId : 'qc_box' 
        },
        gridOptions :{
            gridId : 'common_list_grid',
            optsFirst : true,
            optsCols : optsCols,     //可能要加权限控制
            jqGridSettings :{
                multiselect : true,
                id : "id",
            }
        }
    };
    
    $(document).sfaQuery(options);
});

$("#add_btn").click(function(){
    ShowWindowIframe({
            width: "1000",
            height: "700",
            title: "新增TLB",
            param: { operation: "add"},
            url: "/views/defect/tlb/addTlb.shtml"
        });
    return 
});


// edit
function edit(rowObj,event) {
    if(rowObj.defectId){
        alert("故障生成的TLB不能编辑")
        return
    }
    var params = {
        operation: "edit",
        tlbId: rowObj.tlbId
    };

    // let title = `【Defect No:${rowObj.defectNo}】Edit Defect Base Info`;
    let title = `【编辑TLB信息:${rowObj.tlbNo}】`;
    ShowWindowIframe({
        width: "1000",
        height: "700",
        title: title,
        param: params,
        url: "/views/defect/tlb/addTlb.shtml"
    });

}

function del(rowObj, event){
    if(!confirm("确认删除?")){
        return;
    }
    let url = `/api/v1/defect/tlb/deleteTLBById?id=${rowObj.tlbId}`
    axios.get(url).then(response=>{
        if(response.data.msg.indexOf("SUCCESS") != -1){
            MsgAlert({content: "删除成功"})
            $("#common_list_grid").jqGrid().trigger("reloadGrid");
        }else if(response.data.msg.indexOf("ERROR") != -1){
            // MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.ERR_TASK_HANDLE_FAIL')})
            MsgAlert({type: "error", content: "删除失败"})
        }
    })

    return 
}

/* TLB导出按钮点击事件 */
$("#export_btn").click(function(){
    $.exportExcel({
        url: "/api/v1/defect/tlb/export",
        filename: "TLB"
    })
});
