//根据状态显示隐藏按钮组
function initBnts(status, tlbStatus){
	if(status == "CLSD"){
		showOrHideBtn([$("#tlb_dd_btn")], false);
	}else if(status == "PEND"){
		showOrHideBtn([$("#tlb_dd_btn")], false);
	}else if(status == "DFRL"){
		showOrHideBtn([ $("#tlb_nrc_btn")], false);
	}else if(status == "INFO"){
		showOrHideBtn([$("#tlb_dd_btn"),$("#tlb_nrc_btn")], false);
	}
	
	if(tlbStatus == "OPEN"){
		showOrHideBtn([$("#tlb_reopen_btn")], false);
	}else if(tlbStatus == "CLOS"){
		showOrHideBtn([$("#tlb_close_btn"), $("#tlb_edit_btn"), $("#tlb_dd_btn"), $("#tlb_nrc_btn")], false);
	}else{
		showOrHideBtn([$("#tlb_reopen_btn"), $("#tlb_close_btn"), $("#tlb_edit_btn"), $("#tlb_dd_btn"), $("#tlb_nrc_btn")], false);
	}
}


//动态设置form高度
$("form#tlb_signup").height($(this).height()-10);
//浏览器变化
var _timeId;
$(window).resize(function(){
	clearTimeout(_timeId);
	_timeId =setTimeout(function(){
		$("form#tlb_signup").height($(this).height()-10);
	},0)	
})
$(function() {
	
	//添加按钮
	$("#tlb_add_btn").click(function(){
		location = "tlb_techlog_add.action";
	});
	
	//重置按钮
	$("#tlb_reset_btn").click(function(){
		$("#tlb_tlbno").val("");
	});
	
	//查询按钮
	$("#tlb_search_btn").click(function(){
		var tlb_tlbno = $.trim($("#tlb_tlbno").val());
		if(tlb_tlbno == ''){
			$("#tlbMsg").html("This field is required.");
			return;
		}
		location = basePath + "/tlb/tlb_techlog_view.action?techLog.tlbNo=" + tlb_tlbno;
	});
	
	$("#tlb_nrc_btn").click(function(){
		var tlb_tlbId = $.trim($("#tlb_tlbId").val());
		var params={};
		var actionUrl = basePath + "/tlb/tlb_techlog_checkFlowIsFinish.action?techLog.tlbId=" + tlb_tlbId;
		$.ajax({
			type : 'POST',
			url : actionUrl,
			data : params,
			dataType : "json",
			cache : false,
			
			async : false,				
			success : function(obj, textStatus) {
				var dataCheck = JSON.parse(obj);
				if (dataCheck.ajaxResult == "finished") {
					$.ajax({
						url : basePath + "/tlb/tlb_techlog_convertToJson.action?techLog.tlbId=" + tlb_tlbId,
						dataType : "json",
						type : 'get',
						cache : false,
						
						success : function(obj, textStatus) {
							var data = JSON.parse(obj);
			
							var params = {
								"methodType":"add",
								"fromFlag":"tlb",
								"cardList" : data.main.cardList
							};
						
							P.$.dialog({
								id:'addPage',
								title:'OPEN NON-ROUTINE CARD',
								width:'850px',
								height:'650px',
								method : "post",
								top:'15%',
								esc:true,
								cache:false,
								max: false, 
								min: false,
								parent:this,
								content:'url:nrc/nrc_toAddEx.action',
								data:params,
								postData :  {
									nrcStr : JSON.stringify(data.main),
									nrcMtrListStr : JSON.stringify(data.items),
									nrcCardListStr : JSON.stringify(data.cards)
								},
								close : function(){
									location.reload();
								}					
							});
						}
					});
				} else {
					$.dialog.alert("MR处于审核流程，无法转NRC");						
				}
			}
		});
		
				
	});
	
	//重开按钮
	$("#tlb_reopen_btn").click(function(){
		var tlb_tlbId = $.trim($("#tlb_tlbId").val());
		$.ajax({
			url : basePath + "/tlb/tlb_techlog_reopen.action?techLog.tlbId=" + tlb_tlbId,
			dataType : "json",
			type : 'get',
			cache : false,
			
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				if (data.ajaxResult == "success") {
					P.$.dialog.alert('Reopen success', function() {
						location = basePath + "/tlb/tlb_techlog_view.action?techLog.tlbNo=" + $("#tlb_tlbno").val();
					});
				} else if (data.msg != "") {
					P.$.dialog.alert(data.msg);
				}
			}
		});
	});
	
	
	$("#shortReopen").click(function(){
		var tlb_tlbId = $.trim($("#tlb_tlbId").val());
		
		$.ajax({
			url : basePath + "/tlb/tlb_techlog_reopenShort.action?techLog.tlbId=" + tlb_tlbId,
			dataType : "json",
			type : 'get',
			cache : false,
			
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				if (data.ajaxResult == "success") {
					P.$.dialog.alert('Reopen success', function() {
						location = basePath + "/tlb/tlb_techlog_view.action?techLog.tlbNo=" + $("#tlb_tlbno").val();
					});
				} else if (data.msg != "") {
					P.$.dialog.alert(data.msg);
				}
			}
		});
	});
	
	//编辑按钮
	$("#tlb_edit_btn").click(function(){
		var tlb_tlbId = $.trim($("#tlb_tlbId").val());
		location = "tlb_techlog_edit.action?techLog.tlbId=" + tlb_tlbId;
	});
	
	//关闭按钮
	$("#tlb_close_btn").click(function(){
		var _this = this;
		if(isDM == 'true'){
			selftdialogConfirm("此任务涉及双重维修限制，请确认是否已按要求执行",function(){
				ajaxCloseTlb();
			});
		}else{
			ajaxCloseTlb();
		}
	});
	
	//todd
	$("#tlb_dd_btn").click(function(){
		var tlb_tlbno_h = $.trim($("#tlb_tlbno_h").val());
		var tlb_acReg = $.trim($("#tlb_ac_reg").text());
		var tlb_fltNo = $.trim($("#tlb_fltNo").text());
		var tlb_dateFound = $.trim($("#tlb_dateFound").text());
		var tlb_flgId = $.trim($("#flightid").val());
		
		P.$.dialog({
			title : "To DD",
			width : 1070,
			height : 750,
			top : "15%",
			content :  "url:" + basePath + "/tlb/tlb_ddi_signup_getFromTlb.action?tlbTechLog.tlbNo="+ tlb_tlbno_h + "&tlbTechLog.acReg="+tlb_acReg +"&tlbTechLog.flightNo="+tlb_fltNo + "&tlbTechLog.dateFound="
									   + tlb_dateFound+"&tlbTechLog.flightId="+tlb_flgId+"&tlbTechLog.mrNo="+$("#viewMrBtn").val()+"&tlbTechLog.trNo="+$("#viewTrBtn").val()
		});
	});
	
	//ccinfo按钮
	$(".tlb_cc_item .close_btn").click(function(){

		var tlb_tlbId = $.trim($("#tlb_tlbId").val());
		var tr = $(this).parentsUntil("tr").last().parent();
		var itemNo = $.trim(tr.find(".tlb_itemno").text());
		
		var tlb_tlbId = $.trim($("#tlb_tlbId").val());

		var closBnt = $(this);
		closBnt.attr("disabled", true);
		
		$.ajax({
			url : basePath + "/tlb/tlb_techlog_closeCCinfo.action?techLog.tlbId=" + tlb_tlbId + "&techLogItem.itemNo=" + itemNo,
			dataType : "json",
			type : 'post',
			cache : false,
			
			success : function(obj, textStatus) {
				var obj=JSON.parse(obj);
				
				if(obj.ajaxResult == 'success'){
					if(null!=obj.result&&"true"==obj.result){
						var params = {
								"methodType":"addExe"
						};
						P.$.dialog({
							id:'addPage',
							title:'Add Component Change',
							width:'900px',
							height:'500px',
							top:'15%',
							esc:true,
							cache:false,
							max: false, 
							min: false,
							parent:this,
							content:'url:' + basePath + '/component/cc_addExe.action',
							method : "post",
							postData :  {
								ccStr : obj.ccInfo
							},
							data:params,
							close:function(){
								if(this.data.reload == 1){
									location = basePath + "/tlb/tlb_techlog_view.action?techLog.tlbNo=" + $("#tlb_tlbno").val();
								}
							}
						});
					}else if("false"==obj.result){
						P.$.dialog.alert('Close success', function() {
							location = basePath + "/tlb/tlb_techlog_view.action?techLog.tlbNo=" + $("#tlb_tlbno").val();
						});
					}
				}else{
					P.$.dialog.alert(obj.errMsg);
					closBnt.attr("disabled", false);
				}
			}
		});
	});
	
	// cc reopern按钮
	$(".tlb_cc_item .reopen_btn").click(function(){
		var tlb_tlbId = $.trim($("#tlb_tlbId").val());
		var tr = $(this).parentsUntil("tr").last().parent();
		var itemNo = $.trim(tr.find(".tlb_itemno").text());
		$.ajax({
			url : basePath + "/tlb/tlb_techlog_reopenCCinfo.action?techLogItem.techLog.tlbId=" + tlb_tlbId + "&techLogItem.itemNo=" + itemNo,
			dataType : "json",
			type : 'get',
			cache : false,
			
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				if (data.ajaxResult == "success") {
					P.$.dialog.alert('Reopen success', function() {
						location = basePath + "/tlb/tlb_techlog_view.action?techLog.tlbNo=" + $("#tlb_tlbno").val();
					});
				} else if (data.msg != null) {
					P.$.dialog.alert(data.msg);
				}
			}
		});
	})
	
	//提交工作流按钮
	$("#submit_short_btn").click(function(){
		var tlb_tlbId = $.trim($("#tlb_tlbId").val());
		var shrots = $(".tlb_short_item");
		if(tlb_tlbId == ""){
			P.$.dialog.alert("Please select a tlb to submit.");
			return;
		}
		if(shrots.length == 0){
			P.$.dialog.alert("No shortage info to submit.");
			return;
		}
		
		P.$.dialog({
			title : "Submit TLB Shortage",
			width : 500,
			height : 250,
			top : "15%",
			content :  "url:" + basePath + "/tlb/flow/tlb_techlog_submitPage.action?techLog.tlbId=" + tlb_tlbId,
			data : {
				businessKey : tlb_tlbId + "_" + (new Date()).getTime(),
				hideEnd : true
			}
		});
	})
	
	//审核工作流
	$("#approve_short_btn").click(function(){
		var tlb_tlbId = $.trim($("#tlb_tlbId").val());
		P.$.dialog({
			title : "Approve TLB Shortage",
			width : 500,
			height : 250,
			top : "15%",
			content :  "url:" + basePath + "/tlb/flow/tlb_approval.jsp",
			data : {
				businessKey : tlb_tlbId + "_" + (new Date()).getTime()
			}
		});
	})
	
/*	$("#ddi_tlb_seach_btn").click(function(){
		var tlbNo = $("#tlb_tlbno");
		var srhBtn = $("#tlb_search_btn");
		
		var dialog = commonSrh.srhDialog({
			dialogId : "srh_tlbno_dlg",
			dialogTitle : "Select Tlb No.",
			modelName : "tlbNoModel",
			gridCols: ["tlbNo","status","acReg","faultType","technicianFound","tlbStatus","staFound","dateFound","dateAction","ata"],
			callback : function(rowdata){
				tlbNo.val(rowdata.tlbNo);
				srhBtn.click();
				dialog.close();
			}
		});
	});*/
	
	
	// tlbNo选择
	$("#ddi_tlb_seach_btn").click(function() {
		var srhBtn = $("#tlb_search_btn");
		var dlg = $(this).sfaQueryDialog({
			dialogId : "srh_tlbno_dlg",
			dialogTitle : "Select Tlb No.",
			view : "D_TLB_TECH_LOG",
			dialogWidth : 1000,
			qcOptions :{
				qcBoxId : 'qc_box',
				showSavedQueries : false
			},			
			gridOptions : {
				callback : function(rowdata, originalData) {
					var val = $(rowdata.tlbNo).text();//处理HTML标签
					if(val == ''){
						val = rowdata.tlbNo;
					}
					$("#tlb_tlbno").val(val);
					srhBtn.click();
					dlg.close();
				}
			}
		});	
	});
	
	
	
	$("#tlb_print_btn").click(function(){
			var tlb_tlbno = $.trim($("#tlb_tlbno").val());
			if(tlb_tlbno == ''){
				$("#tlbMsg").html("This field is required.");
				return;
			}	
			var x =basePath + "/tlb/tlb_techlog_createTldPdf.action?techLog.tlbNo=" + tlb_tlbno;
			$("#pdfview").attr("href", x);
			$("#pdfview")[0].click();
	});
	
})

function ajaxCloseTlb(){
	var tlb_tlbId = $.trim($("#tlb_tlbId").val());
	$.ajax({
		url : basePath + "/tlb/tlb_techlog_close.action?techLog.tlbId=" + tlb_tlbId,
		dataType : "json",
		type : 'get',
		cache : false,
//		
		success : function(obj, textStatus) {
			var data = JSON.parse(obj);
			if (data.ajaxResult == "success") {
				P.$.dialog.alert('Close success', function() {
					location = basePath + "/tlb/tlb_techlog_view.action?techLog.tlbNo=" + $("#tlb_tlbno").val();
				});
			} else if (data.msg != null) {
				P.$.dialog.alert(data.msg);
			}
		}
	});
}
/**
 * 查看MR
 * @param mrNo
 */
function viewMr(mrNo){
	var url= basePath + '/mr/mr_view.action?mrNo='+mrNo;
 	P.$.dialog({
 		title : 'View Material Requires',
 		width : '1000px',
 		height : '500px',
 		top : '20%',
 		esc:true,
 		cache:false,
 		max: false, 
 		min: false,
 		parent:this,
 		content:'url:'+url,
 		close: function(){
 			location.reload();
 		}
     });
}

/**
 * 查看TR
 * @param trNo
 */
function viewTR(trNo){
	var url= basePath + '/te/tr_view.action?trNo='+trNo;
 	P.$.dialog({
 		title : 'View Tooling Requires',
 		width : '1000px',
 		height : '500px',
 		top : '20%',
 		esc:true,
 		cache:false,
 		max: false, 
 		min: false,
 		parent:this,
 		content:'url:'+url,
 		close: function(){
 			location.reload();
 		}
     });
}

/**
 * 查看CC
 * @param mrNo
 */
function viewCc(ccId) {
	var params = {
		"methodType":"view"
	};
	var actionUrl = basePath + '/component/cc_view.action?componentCC.id=' + ccId;
	P.$.dialog({
		title:'View Component Change',
		width:dialog_width,
		height:dialog_height,
		top:dialog_top,
		esc:true,
		content : 'url:' + actionUrl,
		data : params
	});
}

//非例行工文件下载
function attachmentdownload(ele){
	var td = $(ele).parent();
	var id = td.find(".attachmentId").val() || "";
	var name = encodeURIComponent(td.find(".fileName").text() || "");
	var path = encodeURIComponent(td.find(".filePath").val() || "");
	var url = basePath + '/attach/commonAttach_downLoad.action?id='+id + "&fileName=" + name + "&downloadfilePath=" + path;	   
	$('#file_download').attr('href',url);
	$('#file_download').get(0).click();
}

function processLogs(logId){
	var actionUrl = basePath + "/tbm/tbm_flow_processLogs.action";	
	var params = {  
            //"flowvars.selectedIds" : selectedIds.toString()            
			"flowvars.selectedIds" : logId
         };
	
     $.ajax({  
	            url : actionUrl,  
	            data : params,  
	            dataType : "json",  
	            cache : false,  
	              
	          success : function(obj, textStatus) {  
	        	  	var data = JSON.parse(obj); 
	                if (data.ajaxResult == "success") {
	                		                	
	                	var url= basePath + '/modification/logs.jsp?id='+data.flowInstanceId;
	                 	P.$.dialog({
	                 		title : 'Process Logs',
	                 		width : '800px',
	                 		height : '400px',
	                 		top : '20%',
	                 		esc:true,
	                 		cache:false,
	                 		max: false, 
	                 		min: false,
	                 		parent:this,
	                 		content:'url:'+url
	                     });	
	                } else {
	                	P.$.dialog.alert(data.ajaxResult); 
	                }  
	            }
     });
     
}

/* ==== 页面大小Default for Edit/View Page ==== */
var dialog_width = '900px';
var dialog_height = '500px';
var dialog_top = '15%';






