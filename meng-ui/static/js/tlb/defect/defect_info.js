$(function() {
	var options = {
		view : 'V_DEFECT_BASE_INFO', //defect_setting.js
		defaultParam : {
			"qname" : ["isDel"],
			"qoperator" : ["notEquals"],
			"qvalue" : [1]
		},
		qcOptions : {
			qcBoxId : 'qc_box',
			showConnector : true
		},
		gridOptions :{
			gridId : 'common_list_grid',
			optsFirst : true,
			optsCols : ["edit", "del"],		//可能要加权限控制
			allColModels : {
				'category':{
					formatter : function(cellvalue){
						if(cellvalue == 'PEND' || cellvalue == 'DFRL' || cellvalue == 'MCC'){
							return cellvalue;
						}else{
							return '无'
						}
					}
				},
				'profession':{
					formatter : function(cellvalue){
						if(cellvalue == '1' ){
							return "电子";
						}else if(cellvalue == '2'){
							return '电气'
						}else if(cellvalue == '3'){
							return '机械'
						}else if(cellvalue == '4'){
							return '动力'
						}else if(cellvalue == '5'){
							return '其他'
						}else {
							return ""
						}
					}
				}
			},
			jqGridSettings :{
				multiselect : true,
				id : "id",
			}
		}
	};
	$(document).sfaQuery(options);


});


//导出DEFECT回顾清单
$("#export_excel_defect_log").click(function(){

    let mydate = new Date();
    mydate.setMinutes(mydate.getMinutes() - mydate.getTimezoneOffset());

    $.exportExcel({
        url: "/api/v1/defect/defect_base_info/exportDefectLog",
        filename: "DEFECT回顾"+ mydate.toJSON().substr(0, 13).replace(/[-T]/g, '')+mydate.getMinutes(),
        success: function (data) {
            console.log(data)
        }
    })
});


$("#export_excel_btn").click(
		function(){
			var _self = this;
		    var data = $(document).sfaQuery().postData();
            $.exportExcel({
                url: "/api/v1/defect/defect_base_info/exportReliability",
                filename: "DEFECT LIST",
                success: function (data) {
                    console.log(data)
                }
            })
            // var	form = $("<form method='post' style='display:none' action='" + basePath + "/tlb/defect_view_exportExcel.action'></form>");
            // var form = $("<form method='post' style='display:none' action='" + basePath + "/api/v1/defect/defect_base_info/exportReliability'></form>");
            // var params = $.param(data).split("&");
            // $.each(data, function(key, val){
            // 	if(typeof(val) == "object" ){
            // 		$.each(val, function(k1, v1){
            // 			form.append($("<input name='" + key + "' value = '" + v1 + "'/>"));
            // 		});
            // 	}else{
            // 		form.append($("<input name='" + key + "' value = '" + val + "'/>"));
            // 	}
            // });
            //
            // $(_self).parent().append(form);
            //
            // form.submit();
            //
            // form.remove();

		}
);

$("#export_excel_btn_mcc").click(function(){
	// var data = $(document).sfaQuery().postData();
	$.exportExcel({
		url: "/api/v1/defect/defect_base_info/exportMcc",
		filename: "MCC LIST",
		success: function (data) {
			console.log(data)
		}
	})
    // data["props.group"] = "Defect_Report";
    // data["props.name"] = "Export Defect List";
    // data["props.fileName"] = "Defect_Report.xls";
    // $.ajax({
    //     url : basePath + "/tlb/defect_view_poiExportList.action",
    //     type : 'post',
    //     cache: false,
    //     data :data,
    //     dataType: "json",
    //     success : function(data){
    //         data = JSON.parse(data);
    //         if(data.ajaxResult == "success"){
    //             var taskInst = data.taskInst;
    //             $(document).sfaExecutorDialog({waitingDlg : {auto : true}}).showWaiting(taskInst.id);
    //         }else{
    //             if (data.message != null && data.message != "") {
    //                 $.dialog.alert(data.message);
    //             }
    //         }
    //     }
    // });
});





// 设置可靠性
$("#set_reliability").click(function(){
	var selectIds = jQuery("#common_list_grid").getGridParam("selarrrow");//获取选中行的行号
	var params = {
		"id" : selectIds.toString()
	};
	// var curWidth = ($(window).width() * 0.9).toString();
	// var curheight = ($(window).height() * 0.6).toString();
	// ShowWindowIframe({
	// 	width: curWidth,
	// 	height: curheight,
	// 	title: "NRC TASK",
	// 	param: {
	// 		id: selectIds.toString()
	// 	},
	// 	url: "/views/defect/fault_confirm.shtml"
	// });
    if(selectIds != "" && selectIds != null) {
        $.dialog({
            id: 'set_reliability',
            title: 'Set Reliability',
            lock: true,
            esc: true,
            top: "15%",
            cache: false,
            parent: this,
            data: params,
            content: "url:" + basePath + "/views/defect/defect_set_reliability.shtml",
            close: function () {
				$("#common_list_grid").jqGrid().trigger("reloadGrid");
            }
        });
    }else{
        $.dialog.alert("Please select records to delete");
    }
});

// 设置可靠性分级
$("#set_level").click(function(){
    var selectIds = jQuery("#common_list_grid").getGridParam("selarrrow");//获取选中行的行号


    if(selectIds != "" && selectIds != null) {


        let title = `【故障分级设置】`;
        ShowWindowIframe({
            width: "800",
            height: "500",
            title: title,
            param: {defectId: selectIds.toString(), operation: "add", successCallback: function(opt, msg){
                    MsgAlert({type: opt, content: msg});
                }},
            url: "/views/defect/repeatSetting/repeatSet.shtml"
        });
    }else{
        $.dialog.alert("Please select records to delete");
    }
});

// edit
function edit(rowObj,event) {
	var params = {
		"methodType":"edit",
		"defectId":rowObj.id
	};
    // let title = `【Defect No:${rowObj.defectNo}】Edit Defect Base Info`;
    let title = `【编辑故障信息:${rowObj.defectNo}】`;
	ShowWindowIframe({
        width: "1000",
        height: "700",
        title: title,
        param: {rowData: rowObj, operation: "edit", successCallback: function(opt, msg){
            MsgAlert({type: opt, content: msg});
        }},
        url: "/views/defect/defectAddWindow.shtml"
    });
	// P.$.dialog({
	// 	title:'[defectNo:'+(rowObj.defectNo==null?"":rowObj.defectNo)+'] Edit Defect Base Info',
	// 	width:'950px',
	// 	height:'700px',
	// 	top:'20%',
	// 	lock:true,
	// 	esc:true,
	// 	content:"url:" + basePath + "/tlb/defect_info_edit.action?defectId=" + rowObj.id ,
	// 	data:params,
	// 	close:function(){
	// 		if($(document).sfaQuery()){
	// 			$(document).sfaQuery().reloadQueryGrid();
	// 		}
	// 	}
	// });
}

function del(rowObj, event){
	let selectIds = rowObj.id;
	if(!confirm("确认删除?")){
        return;
    }
    let post_data = {id: rowObj.id}
    let opt = {};
    let form = new FormData();
	form.append('id', rowObj.id);
	opt.headers = {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	}
    axios.post("/api/v1/defect/defect_base_info/delete", form, opt).then(response=>{
    	if(response.data.msg.indexOf("SUCCESS") != -1){
    		// MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')})
   			//是否需要删除行？
   //  		let arr = selectIds.toString().split(',');
			// $.each(arr,function(i,n){
			// 	if(arr[i]!=""){
			// 		$("#common_list_grid").jqGrid('delRowData',n);
			// 	}
   //          });
    		MsgAlert({content: "删除成功"})
			$("#common_list_grid").jqGrid().trigger("reloadGrid");
    	}else if(response.data.msg.indexOf("ERROR") != -1){
    		// MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.ERR_TASK_HANDLE_FAIL')})
    		MsgAlert({type: "error", content: "删除失败"})
    	}
    })

    return
	// var params = {
	// 	"selectIds" : selectIds.toString()
	// };

	// var actionUrl = "/api/v1/defect/defect_base_info/delete";
	// if(selectIds != "" && selectIds != null){
	// 	$.dialog.confirm('Are you sure to delete?', function(){
	//         $.ajax({
 //  	            url : actionUrl,
 //  	            data : params,
 //  	            dataType : "json",
 //  	            cache : false,

 //  	          success : function(obj, textStatus) {
 //  	        	  	var data = obj.data;
 //  	                if (data.ajaxResult == "success") {
 //  	                	 var arr = selectIds.toString().split(',');
	//   					   $.each(arr,function(i,n){
	//   							 if(arr[i]!=""){
	//   								 $("#common_list_grid").jqGrid('delRowData',n);
	//   							 }
	//   		               });
	//   					$.dialog.alert("Delete Success");

	//   					$("#common_list_grid").jqGrid().trigger("reloadGrid");
 //  	                } else {
 //  	                	$.dialog.alert(data.ajaxResult);
 //  	                }
 //  	            }
	//         })
	//         },function(){
	// 			//$.dialog.tips('执行取消操作');
	// 		})
	// }else{
	// 	$.dialog.alert("Please select records to delete");
 //    }
}

//数据删除
$("#del_btn").click(function(){
	let selectIds = jQuery("#common_list_grid").getGridParam("selarrrow");//获取选中行的行号
	if(!selectIds || selectIds.length < 1){
		MsgAlert({type: "error", content: "请至少选择一项"})
		return
	}
	if(!confirm("确认删除?")){
        return;
    }
    let opt = {};
    let form = new FormData();
    selectIds.forEach(item=>{
    	form.append("id", item)
    })
	opt.headers = {
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	}
    axios.post("/api/v1/defect/defect_base_info/delete", form, opt).then(response=>{
    	if(response.data.msg.indexOf("SUCCESS") != -1){
    		// MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')})
   			//是否需要删除行？
   //  		let arr = selectIds.toString().split(',');
			// $.each(arr,function(i,n){
			// 	if(arr[i]!=""){
			// 		$("#common_list_grid").jqGrid('delRowData',n);
			// 	}
   //          });
    		MsgAlert({content: "删除成功"})
			$("#common_list_grid").jqGrid().trigger("reloadGrid");
    	}else if(response.data.msg.indexOf("ERROR") != -1){
    		// MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.ERR_TASK_HANDLE_FAIL')})
    		MsgAlert({type: "error", content: "删除失败"})
    	}
    })

    return
    //原来的删除代码
	// //alert(selectIds);
 //    var params = {
 //       "selectIds" : selectIds.toString()
 //    };

 //    var actionUrl = "tlb/defect_base_delete.action";
	// if(selectIds != "" && selectIds != null){
	// 	$.dialog.confirm('Are you sure to delete?', function(){
	//         $.ajax({
 //  	            url : actionUrl,
 //  	            data : params,
 //  	            dataType : "json",
 //  	            cache : false,

 //  	          success : function(obj, textStatus) {
 //  	        	  	var data = JSON.parse(obj);
 //  	                if (data.ajaxResult == "success") {
 //  	                	 var arr = selectedIds.toString().split(',');
	//   					   $.each(arr,function(i,n){
	//   							 if(arr[i]!=""){
	//   								 $("#common_list_grid").jqGrid('delRowData',n);
	//   							 }
	//   		               });
	//   					$.dialog.alert(data.updateRepeatMsg + "Success");

	//   					$("#common_list_grid").jqGrid().trigger("reloadGrid");
 //  	                } else {
 //  	                	$.dialog.alert(data.ajaxResult);
 //  	                }
 //  					$(document).sfaQuery().reloadQueryGrid();
 //  	            }
	//         })
	//         },function(){
	// 			//$.dialog.tips('执行取消操作');
	// 		})
	// }else{
	// 	$.dialog.alert("Please select records to delete");
 //    }
});

/**
 * 新增故障信息
 * @returns
 */
$("#add_btn").click(function(){
	ShowWindowIframe({
            width: "1000",
            height: "700",
            title: "新增故障",
            param: { operation: "add", successCallback: (opt, msg)=>{
                MsgAlert({type: opt, content: msg});
            }},
            url: "/views/defect/defectAddWindow.shtml"
        });
	return
	// $("#add_btn").attr("disabled", true);
	// var parameters = {
	// 		"methodType" : "add"
	// 	};
	// 	$.dialog({
	// 		title : 'Add Defect Info',
	// 		width : '1024px',
	// 		height : '700px',
	// 		top : '60px',
	// 		// zIndex: '1000',
	// 		// max: false,
	// 		content : 'url:tlb/defect_info_add.action',
	// 		data : parameters,
	// 		close : function() {
	// 			$(document).sfaQuery().reloadQueryGrid();
	// 			$("#add_btn").attr("disabled", false);
	// 		}
	// 	});

});


//View
function view(rowObj, event) {
	alert("view")
	return
	var params = {
			"methodType":"view",
			"defectId":rowObj.id
		};
	P.$.dialog({
		title:'View defect Info',
		width:'1000px',
		height:'550px',
		top:"50%",
		esc:true,
		content:"url:" + basePath + "/tlb/defect_edit.action?defect.id=" + rowObj.id,
		data:params
	});
}

function toView(id){
	alert("view")
	return
	var url= basePath + '/tlb/defect_info_view.action?id='+id;
 	P.$.dialog({
 		title : 'View Defecte Information',
 		width : '1000px',
 		height : '580px',
 		top : '30%',
 		esc:true,
 		cache:false,
 		max: false,
 		min: false,
 		lock : true,
 		parent:this,
 		content:'url:'+url,
 		data : {
 			edit : false,
 			revise : false
 		},
 		close: function(){
 			$(document).sfaQuery().reloadQueryGrid();
 		}
     });
}


// 添加按钮click事件方法
/* 导出页面数据 */
$("#export_btn").click(function(){
	var	form = $("<form method='post' style='display:none' action='" + basePath + "/tlb/defect_exportList.action'></form>");
	var data = $(document).sfaQuery().postData();
	var params = $.param(data).split("&");
	$.each(data, function(key, val){
		if(typeof(val) == "object" ){
			$.each(val, function(k1, v1){
				form.append($("<input name='" + key + "' value = '" + v1 + "'/>"));
			});
		}else{
			form.append($("<input name='" + key + "' value = '" + val + "'/>"));
		}
	});

	$(this).parent().append(form);
	form.submit();
	form.remove();
});

/**
 * 非例行任务处理-处理航线维修任务-排除故障
 */
function processDefect(id){
	P.$.dialog({
		title : "Assign NON-ROUTINE MANTENANCE DEFECT",
		width : 750,
		height : 550,
		top : "15%",
		content :  "url:" + basePath + "/tlb/defect_base_viewTask.action?id=" + id,
		data : {
			businessKey : id,
			type : "tbm_non_routine",
			node : "wokerReceive",
			actionUrl : basePath + "/tlb/defect_base_processDefect.action"
		},
		close : function(){
			//location.reload();
		}
	});
}

// 重大故障/重复性故障日报导出
$("#export_doc_defect_daily").click(function(){
	var	form = $("<form method='post' style='display:none' action='" + basePath + "/api/v1/worklog/exportDefectDailyLog'></form>");
	$(this).parent().append(form);
	form.submit();
	form.remove();
});

