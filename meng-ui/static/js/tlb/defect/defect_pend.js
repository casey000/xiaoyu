//动态设置div高度, copied from tlb_ddiSignUp_view.jsp
$("#ddi_signup").height($(this).height()-50);
//浏览器变化
var _timeId;
var tlbNoInput='<input id="tlbNo" name="defectPend.tlbNo" class="required" value="" />';
$(window).resize(function(){
	clearTimeout(_timeId);
	_timeId =setTimeout(function(){
		$("#ddi_signup").height($(this).height()-50);
	},0)	
})

$(function(){
	$("#dfrl_category").change(function(){
		var category = $("#category").val();
		if($("#dfrl_category").val() == 'other' || ($("#dfrl_category").val() == 'a' && category == "DFRL")){
			$("#expiredDate").datebox('setValue', "");
			$("#expiredDate").removeClass("exp");
			$("#exp_date_warn").hide();
			showDueDataDlg();
		}else{
			clearDueData();
			$("#duaDateStr").val("").hide();
			$("#expiredDate").addClass("exp");
			$("#exp_date_warn").show();
		}
		
		$("#expiredDate").datebox('disable', true);					
	});

	$("#duaDateStr").click(function(){
		if(!$("#duaDateStr").is(":hidden")){
			showDueDataDlg();
		}
	});
	
	function clearDueData(){
		$("#duaData_calendarDay").val("");
		$("#duaData_flightDay").val("");
		$("#duaData_fh").val("");
		$("#duaData_fc").val("");
	}
	
	function showDueDataDlg(){
		$("#dfrl_category").attr("disabled", true);
		
		var dueData = {};
		dueData.fh = $("#duaData_fh").val();
		dueData.fc = $("#duaData_fc").val();
		dueData.flightDay = $("#duaData_flightDay").val();
		dueData.calendarDay = $("#duaData_calendarDay").val();
		
		P.$.dialog({
			id : 'dd',
			title : 'DD Due Data',
			width : '300px',
			height : '200px',
			top : '15%',
			lock : true,
			esc : true,
			cache : false,
			content : 'url:' + basePath + '/tlb/dd_due_data.jsp',
			data : dueData,
			close : function(){
				setDueData(this.data);
				$("#dfrl_category").removeAttr("disabled");
			}
		});
	}
	
	function setDueData(data){
		if(data.isSave == true){
			clearDueData();
			var duaDataStr = "";
			if(data.fh != ""){
				duaDataStr += data.fh + "FH "; 
				$("#duaData_fh").val(data.fh);
			}
			if(data.fc != ""){
				duaDataStr += data.fc + "FC "; 
				$("#duaData_fc").val(data.fc);
			}
			if(data.calendarDay != ""){
				duaDataStr += data.calendarDay + "日历日 ";
				$("#duaData_calendarDay").val(data.calendarDay);
			}
			if(data.flightDay != ""){
				duaDataStr += data.flightDay + "飞行日 "; 
				$("#duaData_flightDay").val(data.flightDay);
			}
			$("#duaDateStr").val(duaDataStr).show();
			$("#duaDateStr").attr("tltle", duaDataStr);
			$("#expiredDate").datebox('setValue', "");
		}else{
			if($("#duaDateStr").is(":hidden")){
				$("#dfrl_category").val("");
				$("#exp_date_warn").show();
			}
		}
	}
	
	/**
	 * 初始下拉列表多选数据的JS
	 */
	$("#engApu").multiselect({
		minwidth:130,
		noneSelectedText: "--Please Select--",
		checkAllText: "Check All",
		uncheckAllText: 'Uncheck All',
		selectedList:1000

	});
	
	$("button.ui-multiselect").width("70%");
	
	$("#cancel_btn").click(function(){
		sub_win.close();
	});
	
	$("#ddi_rbeto_y").click(function(){
		P.$.dialog.alert("请确认MEL中是否规定每次起飞前检查。");
	});
	
	// 清除Text输入框
	$("#clean_btn").click( function() {
		$("input[type='text']").val('');
		//$("#applyDate").datebox('setValue','');
		$("#expiredDate").datebox('setValue','');
		$("#extentionDate").datebox('setValue','');		
	});
	
	$(".delete_btn").click(function(){
		$(this).parentsUntil("tr").parent().remove();
	});	
	
	// js表单验证
	$("#saveForm").validate({
		debug:true, 
	    onkeyup:false, 
		errorElement :"div",
		scrollElement : ".ddi_signup",
	    errorPlacement: function(error, element) {
		   error.appendTo(element.nextAll("div"));
	 	},
	
	 	highlight: function(element, errorClass) { 
	       $(element).addClass(errorClass);   
	   }, 
	   
	   success: function(label) {
	  	 label.remove();
	   }
	});
	
	
	$("#submit_btn").click(function(){
		
		var defectPendId = $("#defectPendId").val();
		
		//alert(defectPendId);
		
		if(defectPendId != null && defectPendId != ""){
			
			P.$.dialog({
				title : "Defect DD Process",
				width : 500,
				height : 250,
				top : "15%",
				content :  "url:" + basePath + "/tlb/defect/flow/defect_dd_process.jsp",
				close : function(){
					location.reload();
				},
				data : {
					businessKey : defectPendId,
					node : "defect_dd_edit"
				}
			});
		} else {
			P.$.dialog.alert("请先save，再提交审批！");
		}
		
	});

	/**
	 * 故障保留关闭
	 */
	$("#close_pend_btn").click(function() {
		
		P.$.dialog.confirm("确定关闭DDI撤保留？",function(){
			
			$("#save_add_btn").attr("disabled", true);
			
			$("#close_pend_btn").attr("disabled", true);
			
			var defectPendId =$("#defectPendId").val();
			
			var params ={"id":defectPendId};
			
			var actionUrl = "tlb/defect_pend_close.action";
			$.ajax({
				type : 'POST',
				url : actionUrl,
				data : params,
				dataType : "json",
				cache : false,
				success : function(obj, textStatus) {
					var data = JSON.parse(obj);
					if (data.ajaxResult == "success") {
						P.$.dialog.alert('Success', function() {
							sub_win.close();
						});
						
					}else{
						P.$.dialog.alert(data.error, function() {
							$("#close_pend_btn").attr("disabled", false);
						});
					}
				}
			});
		});
	});
	/**
	 * 故障保留保存
	 */
	$("#saveForm").bind("submit",function(){
		
		// Ewis校验
		var ewisFlag = checkEditEwisInput("tlbTechLog.isHasEwis");
		if(!ewisFlag)
		{
			return;
		}
		
	// 漏油校验
		var oilFlag = checkEditOilInput("tlbTechLog.isHasOil");
		if(!oilFlag)
		{
			return;
		}
		
		var mstInputFlag = true;
		if($("input[name='tlbTechLog.isHasEwis']")[0].checked){
			$(".emustInput").each(function(){
				if($(this).val() == undefined || $(this).val() == ''){
					$(this).next().attr("style","color:red").text("The filed must Input.");
					mstInputFlag = false;
					return;
				}else{
					$(this).next().attr("style","color:red").text("");
				}
			});
		}
		if($("input[name='tlbTechLog.isHasOil']")[0].checked){//ewis 被选中
			$(".mustInput").each(function(){
				if($(this).val() == undefined || $(this).val() == ''){
					$(this).next().attr("style","color:red").text("The filed must Input.");
					mstInputFlag = false;
					return;
				}else{
					$(this).next().attr("style","color:red").text("");
				}
			});
		}
		if(!mstInputFlag){
			return;
		}
		var lenFlag = true;
		$(".numberLeng").each(function(){
			var inputLeng = $(this).val().length;
			if(inputLeng > 1000){
				$(this).next().attr("style","color:red").text("当前输入字符长度超过1000.");
				lenFlag = false;
				return;
			}else{
				$(this).next().text("");
			}
		});
		if(!lenFlag){
			return;
		}
		if($('.dlyCnl').is(':checked')){
			$('#dlyCnl').val("y");
		} else {
			$('#dlyCnl').val("n");
		}
		
		if($('.rii').is(':checked')){
			$('#rii').val("y");
			$('#rci').val("n");
		} else {
			$('#rii').val("n");
		}
		if($('.rci').is(':checked')){
			$('#rci').val("y");
			$('#rii').val("n");
		} else {
			$('#rci').val("n");
		}
		if($('.dlyCnl').is(':checked'))
		{
			$('#dlyCnl').val("y");
		}
		else 
		{
			$('#dlyCnl').val("n");
		}
		
		if($('#rii').val() == "y" || $('#rci').val() == "y"){
			if($(".inspector").val() == null || $(".inspector").val() == ""){
				P.$.dialog.alert('必检人不能为空');
				// add by guozhigang 
                $("#save_add_btn").attr("disabled", false);
				return;
			}
		}
		var validator = $("#saveForm").valid();	
		if(!validator || validateForm()){
			$("#save_add_btn").attr("disabled", false);
			return;
		}
		var fltHour = $("input[name='defectPend.totalFh']").val();
		if(null!=fltHour && fltHour!=''){
			var t = fltHour.split('.');
			if(t.length>1){
				var t0 = t[0];
				var t1 = t[1];
				if(parseInt(t1)>60){
					P.$.dialog.alert('Total FLT Hours minutes more than 60');
					return;
				}
			}
		}
		$("input[name='defectPend.ddDueData.category']").val($("#dfrl_category").val());
		var ct = $("#category").val();
		if($("#dfrl_category").val() != 'other' && ct != "DFRL"){
			$("input[name='defectPend.ddDueData.categoryExpDate']").val($("#expiredDate").datebox('getValue'));
		}else if($("#dfrl_category").val() != 'a' && $("#dfrl_category").val() != 'other' && ct != "PEND"){
			var expdt = {"name":"defectPend.ddDueData.categoryExpDate","value":$("#expiredDate").datebox('getValue')};
			$("input[name='defectPend.ddDueData.categoryExpDate']").val($("#expiredDate").datebox('getValue'));
		}
		$(":input[name='defectPend.expiredDate']").attr("disabled", false);
		$(this).ajaxSubmit({
			url : "tlb/defect_pend_save.action",
			type : "post",
			dataType : "json",
			headers : {"ClientCallMode" : "ajax"}, //添加请求头部
			success : function(data){
				var reMsg = JSON.parse(data);
				if(reMsg['ajaxResult'] != 'success'){
					P.$.dialog.alert(reMsg['ajaxResult']);
				}else{
					P.$.dialog.alert('Success', function() {
						sub_win.close();
					});
				}
			}
		});
		return false;
	});
//	$("#save_add_btn").click(function() {
//		var validator = $("#saveForm").valid();	
//		if(!validator || validateForm()){
//			$("#save_add_btn").attr("disabled", false);
//			return;
//		}
//				
//		var array = $("#saveForm").serializeArray();
//		var map = {};
//		$.each(array, function(i, vo){
//			map[vo.name] = vo;
//		});
//		var category = {"name":"defectPend.ddDueData.category","value":$("#dfrl_category").val()};
//		array.push(category);
//		var ct = $("#category").val();
//		if($("#dfrl_category").val() != 'other' && ct != "DFRL"){
//			var expdt = {"name":"defectPend.ddDueData.categoryExpDate","value":$("#expiredDate").datebox('getValue')};
//			array.push(expdt);
//		}else if($("#dfrl_category").val() != 'a' && $("#dfrl_category").val() != 'other' && ct != "PEND"){
//			var expdt = {"name":"defectPend.ddDueData.categoryExpDate","value":$("#expiredDate").datebox('getValue')};
//			array.push(expdt);
//		}
//		var fltHour = map['defectPend.totalFh'].value;
//		if(null!=fltHour && fltHour!=''){
//			var t = fltHour.split('.');
//			if(t.length>1){
//				var t0 = t[0];
//				var t1 = t[1];
//				if(parseInt(t1)>60){
//					P.$.dialog.alert('Total FLT Hours minutes more than 60');
//					return;
//				}
//				//map['tlbDeferredDefect.totalFh'].value = parseInt(t0*60) + parseInt(t1,10);
//			}else{
//				//map['tlbDeferredDefect.totalFh'].value = map['tlbDeferredDefect.totalFh'].value * 60; 
//			}
//		}
//		
//		//获取表单数据
//		var params = {};
//		$.each(array, function(i, obj){
//			params[obj.name] = $.trim(obj.value);
//			/*if(! /^(tlbDeferredDefectItem)/.test(obj.name)){
//				if(obj.name == "defectPend.engApu"){
//					params[obj.name] = $("#engApu").val().join(",");	
//				}
//			}*/
//		});
//		var shortInof = getItems("tlb_short_t", "tlb_short_item", "tlbDeferredDefectItem.");
//		$.each(shortInof, function(i, info) {
//			$.each(info, function(key, value) {
//				key = key.replace("tlbDeferredDefectItem", "tlbDeferredDefectItem[" + i + "]");
//				params[key] =  $.trim(value);
//			});
//		});
//		var actionUrl = "tlb/defect_pend_save.action";
//		$.ajax({
//			type : 'POST',
//			url : actionUrl,
//			data : params,
//			dataType : "json",
//			cache : false,
//			success : function(obj, textStatus) {
//				var data = JSON.parse(obj);
//				if (data.ajaxResult == "success") {
//					P.$.dialog.alert('Success', function() {
//						sub_win.close();
//					});
//					
//				}else{
//					P.$.dialog.alert(data.ajaxResult, function() {
//						$("#save_add_btn").attr("disabled", false);
//					});
//				}
//			}
//		});
//	});
	
	
	$("#ddi_eng_seach_btn").click(function(){
		var signup = $("#ddi_signup");
		var dialog = tlbCommons.srhDialog({
			dialogId : "srh_eng_dlg",
			dialogTitle : "有关发动机/APU序号",
			modelName : "eng",
			callback : function(rowdata){
				signup.find("#ddi_eng").val(rowdata.field4);
				dialog.close();
			}
		});
	});
	
	$("#ddi_sta_seach_btn").click(function(){
		var signup = $("#ddi_signup");
		var dialog = tlbCommons.srhDialog({
			dialogId : "srh_sta_dlg",
			dialogTitle : "航站",
			modelName : "sta",
			callback : function(rowdata){
				signup.find("#ddi_sta").val(rowdata.station);
				dialog.close();
			}
		});
	});
		
	
	
	$(".ddi_pn_seach_btn").click(function(){
		pnFun(this);
	});
	
	var defectPendId = $("#defectPendId").val();
	
	//动态添加选择requester
	var $requester = $("[name='defectPend.requester']");
	var $requesterNo = $("[name='defectPend.requesterNo']"); 
	if(null == defectPendId || ""== defectPendId){
		selectUserInit($requester, $requesterNo, false, selectRequesterCallback);
	}
	if($("input[name='defectPend.tlbNo']").length>0){
		tlbNoInput = $("input[name='defectPend.tlbNo']");
	}
	$("#tlbDateFound").datetimebox({});
});

function selectRequesterCallback(obj){
	$("[name='defectPend.requester']").val(obj.name);
	$("[name='defectPend.requesterNo']").val(obj.sn);
}

function pnFun(ele){
	var tr = $(ele).parentsUntil("tr").last().parent();
	var dialog = tlbCommons.srhDialog({
		dialogId : "srh_pn_dlg",
		dialogTitle : "PN",
		modelName : "pn",
		callback : function(rowdata){
			tr.find(".ddi_pn_name").val(rowdata.name);
			tr.find(".ddi_pn_no").val(rowdata.no);
			dialog.close();
		}
	});
}

function validateForm(){
	var validator = false;
	$("#applyDate").nextAll("div").empty();
	$("#expiredDate").nextAll("div").empty();
	$("#refItem").nextAll("div").empty();
	
	/*if($.trim($("#refItem").val()).length >8){
		$("#refItem").nextAll("div").append('<div generated="true" style="">This field length should not more than 8.</div>');
		validator = true;
	}*/
	
	
	if($("#lackMater").attr("checked") == 'checked' || $("#lackTool").attr("checked")== 'checked' ||
			$("#lackTime").attr("checked")== 'checked' || $("#lackTech").attr("checked")== 'checked' ||
			$.trim($("#reasonOther").val())!='')		
	{		
	}else{
		P.$.dialog.alert('Please input one Reasons at least');
		//return true;
		validator = true;
	}
	
	var applyDate = $("#applyDate").val();
	var expiredDate = $("#expiredDate").datetimebox("getValue");
	
	var category = $("#category").val();
	if($("#dfrl_category").val() != 'other' && $("#dfrl_category").val() != 'a' && category != "DFRL" && $.trim(expiredDate) == ""){
		//期限日期不能为空
		$("#expiredDate").nextAll("div").append('<div generated="true" style="">This field is required.</div>');
		validator = true;
	}
	if($.trim(applyDate) != ""){
		//申请日期不能大于当前日期
		if(paserDate($.trim(applyDate)).getTime() > (new Date()).getTime()){
			$("#applyDate").nextAll("div").append('<div generated="true" style="">applyDate must before or equal currentDate.</div>');
			//return true;
			validator = true;
		}
	}
	if($.trim(expiredDate) != ""){				
		//期限日期必须大于申请日期
		if(paserDate($.trim(applyDate)).getTime() >= paserDate($.trim(expiredDate)).getTime()){
		//if($.trim(applyDate) >= $.trim(expiredDate)){
			$("#expiredDate").nextAll("div").append('<div generated="true" style="">expiredDate must after applyDate.</div>');
			//return true;
			validator = true;
		}
		/* if($("#category").val() == 'a'){
			 //在申请时间上加1或2天，超出则报错
			 if(paserDate($.trim(expiredDate)).getTime() > paserDate($.trim(applyDate)).getTime() + 48 * 60 * 60 * 1000)//2天是48小时，60分钟，60秒，1000毫秒
				 {
				 $("#expiredDate").nextAll("div").append('<div generated="true" style="">category A expiredDate must later applyDate than 1 or 2 days</div>');
					validator = true;
				 }
		 }*/
	}
	return validator;
}

/**
 * 用户选择
 * @param parameters
 */
function selectUser(parameters){
	//alert(parameters.ele.find(".id").length());
	var obj = P.$.dialog({
		title : 'Select User',
		width : '700px',
		height : '500px',
		top : '20%',
		esc:true,
		cache:false,
		resize:false,
		cancel:false,
		drag:false,
		max: false, 
		min: false,
		lock:true,
		parent:this,
		close:function(){
			//alert("name:"+this.data.result.name +" --sn:" + this.data.result.sn + "--id:"+this.data.result.id);
			$(".inspectorId").val(this.data.result.id);
			$(".sn").val(this.data.result.sn);
			$(".inspector").val(this.data.result.name);
			if(this.data.isOK == 1){
				parameters.ele.find(".name").val(this.data.result.name);
				parameters.ele.find(".sn").val(this.data.result.sn);
				parameters.ele.find(".id").val(this.data.result.id);
			}
		},
		content:'url:' + basePath + '/security/user/select_user_list.jsp',
		data : {}
	});
}

//标识是否需要填写TLB NO
function tlbNoFlag(obj){
	//选中就不用填写TLB NO了
	if($(obj).attr("checked")){
		$("#noTlbNo").val("1");
		$("input[name='defectPend.tlbNo']").remove();
	}else{
		$("#noTlbNo").val("");
		var tlbInput = "";
		if(tlbNoInput[0].outerHTML){
			tlbInput = tlbNoInput[0].outerHTML;
		}else{
			tlbInput = tlbNoInput;
		}
		
		$("#tlbNoTD").prepend(tlbInput);
	}
}


