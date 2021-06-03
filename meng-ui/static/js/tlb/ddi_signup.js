//动态设置div高度, copied from tlb_ddiSignUp_view.jsp
$("#ddi_signup").height($(this).height()-20);
//浏览器变化
var _timeId;
$(window).resize(function(){
	clearTimeout(_timeId);
	_timeId =setTimeout(function(){
		$("#ddi_signup").height($(this).height()-20);
	},0)	
})

$(function(){
	$("#category").change(function(){
		if($("#category").val() == 'other' || $("#category").val() == 'a'){
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
		$("#category").attr("disabled", true);
		
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
				$("#category").removeAttr("disabled");
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
				$("#category").val("");
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
		var tlbNo = $("#tlbNo").val();
		var ddNo = $("#ddNo").val();
		
		location = 'tlb_ddi_signup_view.action?tlbDeferredDefect.ddNo='+ddNo+'&tlbDeferredDefect.tlbNo='+tlbNo;
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
	
	$("#save_update_btn").click(function() {
		
		var validator = $("#save_updateForm").valid();	
		if(!validator || validateForm()){
			return;
		}
				
		var array = $("#save_updateForm").serializeArray();
		var map = {};
		$.each(array, function(i, vo){
			map[vo.name] = vo;
		});
		
		var category = {"name":"tlbDeferredDefect.ddDueData.category","value":$("#category").val()};
		array.push(category);
		if($("#category").val() != 'other' && $("#category").val() != 'a' ){
			var expdt = {"name":"tlbDeferredDefect.ddDueData.categoryExpDate","value":$("#expiredDate").datebox('getValue')};
			array.push(expdt);
		}
		
		//获取表单数据
		var params = {};
		$.each(array, function(i, obj){
			if(! /^(tlbDeferredDefectItem)/.test(obj.name)){
				params[obj.name] = $.trim(obj.value);
				if(obj.name == "tlbDeferredDefect.engApu"){
					params[obj.name] = $("#engApu").val().join(",");	
				}
			}
		});
		
		var shortInof = getItems("tlb_short_t", "tlb_short_item", "tlbDeferredDefectItem.");
		$.each(shortInof, function(i, info) {
			$.each(info, function(key, value) {
				key = key.replace("tlbDeferredDefectItem", "tlbDeferredDefectItem[" + i + "]");
				params[key] =  $.trim(value);
			});
		});
		var hide_ddid = $("#hide_ddid").val();
		var actionUrl = "tlb/tlb_ddi_signup_update.action";
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
						location = basePath + '/tlb/tlb_ddi_signup_view.action?tlbDeferredDefect.ddId=' + hide_ddid;					
					});					
				}
			}
		});
	});
	

		
	$("#save_add_btn").click(function() {
		
		$("#save_add_btn").attr("disabled", true);
		
		var validator = $("#saveForm").valid();	
		if(!validator || validateForm()){
			$("#save_add_btn").attr("disabled", false);
			return;
		}
		
				
		var array = $("#saveForm").serializeArray();
		var map = {};
		$.each(array, function(i, vo){
			map[vo.name] = vo;
		});

		var category = {"name":"tlbDeferredDefect.ddDueData.category","value":$("#category").val()};
		array.push(category);
		if($("#category").val() != 'other' && $("#category").val() != 'a' ){
			var expdt = {"name":"tlbDeferredDefect.ddDueData.categoryExpDate","value":$("#expiredDate").datebox('getValue')};
			array.push(expdt);
		}
		
		var fltHour = map['tlbDeferredDefect.totalFh'].value;
		if(null!=fltHour && fltHour!=''){
			var t = fltHour.split('.');
			if(t.length>1){
				var t0 = t[0];
				var t1 = t[1];
				if(parseInt(t1)>60){
					P.$.dialog.alert('Total FLT Hours minutes more than 60');
					return;
				}
				//map['tlbDeferredDefect.totalFh'].value = parseInt(t0*60) + parseInt(t1,10);
			}else{
				//map['tlbDeferredDefect.totalFh'].value = map['tlbDeferredDefect.totalFh'].value * 60; 
			}
		}
		
		//获取表单数据
		var params = {};
		$.each(array, function(i, obj){
			if(! /^(tlbDeferredDefectItem)/.test(obj.name)){
				params[obj.name] = $.trim(obj.value);
				if(obj.name == "tlbDeferredDefect.engApu"){
					params[obj.name] = $("#engApu").val().join(",");	
				}
			}
		});
		
		
		var shortInof = getItems("tlb_short_t", "tlb_short_item", "tlbDeferredDefectItem.");
		$.each(shortInof, function(i, info) {
			$.each(info, function(key, value) {
				key = key.replace("tlbDeferredDefectItem", "tlbDeferredDefectItem[" + i + "]");
				params[key] =  $.trim(value);
			});
		});

		
		var actionUrl = "tlb/tlb_ddi_signup_save.action";
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
						location = basePath + '/tlb/tlb_ddi_signup_view.action?tlbDeferredDefect.ddId=' + data.ddNumber;
					});
					
				}else{
					P.$.dialog.alert(data.ajaxResult, function() {
						$("#save_add_btn").attr("disabled", false);
					});
				}
			}
		});
	});
	
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
	
	//动态添加选择requester
	var $requester = $("[name='tlbDeferredDefect.requester']");
	var $requesterNo = $("[name='tlbDeferredDefect.requesterNo']"); 
	selectUserInit($requester, $requesterNo, false, selectRequesterCallback);
});

function selectRequesterCallback(obj){
	$("[name='tlbDeferredDefect.requester']").val(obj.name);
	$("[name='tlbDeferredDefect.requesterNo']").val(obj.sn);
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
	
	if($("#category").val() != 'other' && $("#category").val() != 'a' && $.trim(expiredDate) == ""){
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



