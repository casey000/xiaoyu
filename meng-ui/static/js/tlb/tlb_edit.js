//动态设置form高度, copied from tlb_view.js
$("form#tlb_signup").height($(this).height()-10);
var _self = this;
//浏览器变化
var _timeId;
$(window).resize(function(){
	clearTimeout(_timeId);
	_timeId =setTimeout(function(){
		$("form#tlb_signup").height($(this).height()-10);
	},0)	
})
var config = {
	ATA		:	"ATA"
}
	
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
    return currentdate;
}
// 必检标志
function chgRii() {
	var arr = [ "inspector", "techLog.inspectorNo" ];
	if ($("#tlb_rii").is(":checked") || $("#tlb_rci").is(":checked")  ) {
		$("#RiiTd").html('RII/RCI Sign<span class="td-font-red">*</span>');
		showOrHideRequired(arr, true);
	} else {
		$("#RiiTd").html('RII/RCI Sign');
		$("#tlb_inspector").val("");
		$("[name='techLog.inspectorNo']").val("");
		$("[name='techLog.inspector']").val("");
		showOrHideRequired(arr, false);
	}
}

//表单验证函数
function valid() {
	
	$("#tlb_found_date").nextAll("div").empty();
	$("#tlb_action_date").nextAll("div").empty();
	$("#ddi_rs_m").nextAll("div").empty();

	// 日期组件验证
	var validatorC = true;
	var foundDate = $("#tlb_found_date").datetimebox("getValue");
	var actionDate = $("#tlb_action_date").datetimebox("getValue");

	if ($.trim(foundDate) == "") {
		// 发现日期不能为空
		$("#tlb_found_date").nextAll("div").append('<div generated="true" style="">This field is required.</div>');
		validatorC = false;
	}
	
	
	if ($.trim(actionDate) == "") {
		// 如果是必填，则提示
		$("#tlb_action_date").nextAll("div").append('<div generated="true" style="">This field is required.</div>');
		validatorC = false;
	} else {
		// 不能大于今天
		if (paserDate($.trim(actionDate)).getTime() > (new Date()).getTime()) {
			$("#tlb_action_date").nextAll("div").append('<div generated="true" style="">Action date must before current time.</div>');
			validatorC = false;
		}

		// 处理日期必须大于发现日期
		if ($.trim(foundDate) != "") {
			if (foundDate >= actionDate) {
				$("#tlb_action_date").nextAll("div").append('<div generated="true" style="">Action date must after found date.</div>');
				validatorC = false;
			}
		}
	}
	


	if ($.trim(foundDate) != "") {
		// 不能大于今天
		if (paserDate($.trim(foundDate)) > (new Date()).getTime()) {
			$("#tlb_found_date").nextAll("div").append('<div generated="true" style="">Found date must before current time.</div>');
			validatorC = false;
		}
	}
	
	if(!validatorC){
		return false;
	}
	
	// 验证TLB单中必检人员和工作者不能一致
	var tlb_inspectorNo = $.trim($("#tlb_inspector").val());
	var tlb_technicianActSignNo = $.trim($("#technicianId").val());

	if (tlb_inspectorNo != '' && tlb_technicianActSignNo != '') {
		if (tlb_inspectorNo == tlb_technicianActSignNo) {
			P.$.dialog.alert('RII Sign. and Taken Action Sign. should not the same person.');
			return false;
		}
	}
	
	return true;
}

/****
 * 新增源文件form提交
 */
function submitForm() 
{	
	// 验证表单
	var validator = $("#defect_tlb").valid();
	if (!validator) {
		return false;
	}
	
	// 验证表单
	if (!valid()) {
		return;
	}
	
	// Ewis校验
	var ewisFlag = checkEditEwisInput("techLog.isHasEwis");
	if(!ewisFlag)
	{
		return false;
	}
	
// 漏油校验
	var oilFlag = checkEditOilInput("techLog.isHasOil");
	if(!oilFlag)
	{
		return false;
	}
	
	var actionUrl = "tlb_techlog_update.action";
	//保存tlb
	saveDefect(actionUrl);
	return false;
}

function saveDefect(actionUrl){
	$("#defect_tlb").ajaxSubmit({
		url : actionUrl,
		contentType:'multipart/form-data',
		cache : false,
		type: "post",
		success : function(obj, textStatus) {
			var data = JSON.parse(obj);
			if(data.ajaxResult.indexOf("success") != -1){
				P.$.dialog.alert("success");
				sub_win.close();
			}else {
				sub_win.button({name:'Save', disabled:false});
				P.$.dialog.alert(data.validateErrors[0].message);
			}
		}
	});
//	$("[name='techLog.faultType']").removeAttr("disabled");
//	var params = $("#defect_tlb").serialize();	
//	$.ajax({
//		url : actionUrl,
//		type:"post",
//		data : params,
//		dataType : "json",
//		async: false,
//		cache : false,
//		success : function(obj, textStatus) {
//			var data = JSON.parse(obj);
//			if(data.ajaxResult.indexOf("success") != -1){
//				P.$.dialog.alert("success");
////				P.location.reload();
//				sub_win.close();
//			}else {
//				sub_win.button({name:'Save', disabled:false});
//				P.$.dialog.alert(data.validateErrors[0].message);
//			}
//		}
//	});
}
//查询航班
$("#flt_search_btn").bind("click",function(){
	assignCard("select", null, function(dlg){
		if(dlg.data['flightDate'] == null){
			return;
		}
		$("#tlb_regno").val(dlg.data['acReg']);
		$("#acid").val(dlg.data['acReg']);
		$("#tlb_found_date").datebox("setValue", dlg.data['flightDate']);
		$("#tlb_sta").val(dlg.data['station']);
		$("#tlb_flt").val(dlg.data['flightNo']);
		$("#lineJobId").val(dlg.data['lineJobId']);
		$("#action_sta").val(dlg.data['station']);
		//add by 80003187 将未带入的航班id给补上 start---
		$("#flightid").val(dlg.data["flightId"]);
		//add by 80003187 将未带入的航班id给补上 end---
		
		getPreFlightNo(dlg);
		var defaultParam = {};
		
		defaultParam["pageModel.qname"] = {0 : 'job.id'};
		defaultParam["pageModel.qoperator"] = {0 : 'equals'};
		defaultParam["pageModel.qvalue"] = {0 : $("#lineJobId").val()};
		var options_simple = {
			view : 'V_MCC_ASSIGN_TASK',
				
			gridOptions :{
				gridId : 'common_list_grid',
				allColModels : {
					'woNo' : {
						isOpts : false,
						width : 110,
						formatter : function(cellvalue, options, rowObject){
							return cellvalue;
						}
					}
				}
			},
			defaultParam : defaultParam
		};
		
		if($(document).sfaQuery() == null){
			$(document).sfaQuery(options_simple);
		}else{
			$(document).sfaQuery().changeTemplate({defaultParam : defaultParam});
		}
	});
});

/**
 * 获取当前航班的上一航班
 * @param dlg
 * @returns
 */
function getPreFlightNo(dlg) {
	var parameter = {
		"acReg" : dlg.data['acReg'],
		"checkType" : dlg.data['checkType'],
		"flightNo" : dlg.data['flightNo'],
		"flightDate" : dlg.data['flightDate']
	};
	$.ajax({
		url : basePath + "/tlb/defect_info_getPreFlightNo.action",
		type : "post",
		dataType : "json",
		data : parameter,
		async : false,
		cache : false,
		success : function(obj, textStatus) {
			var data = JSON.parse(obj);
			if (data.ajaxResult.indexOf("success") != -1) {
				$("#tlb_flt").val(data.preFlightNo);
				//$("#preFlightNo").val(data.preFlightNo);
			}
		}
	});
}

//finder sign
function selectTechnicianFoundCallback(obj){
	$("[name='techLog.technicianFoundNo']").val(obj.sn);
	$("[name='techLog.technicianFound']").val(obj.name);
	$("#defect_technicianFoundNo").val(obj.name+obj.sn);
}

//Rii
function selectInspectorCallback(obj){
	$("[name='techLog.inspectorNo']").val(obj.sn);
	$("[name='action.inspector']").val(obj.name);
	$("[name='techLog.inspector']").val(obj.name);
	$("#tlb_inspector").val(obj.name+obj.sn);
}

//mech sign
function selectTechnicianActSignCallback(obj){
	$("[name='action.technicianId']").val(obj.id);
	$("[name='techLog.technicianActSign']").val(obj.name);
	$("[name='techLog.technicianActNo']").val(obj.sn);
	/*$("[name='action.mechanic']").val(obj.name);
	$("[name='action.mechanicNo']").val(obj.sn);*/
	$("#technicianId").val(obj.name+obj.sn);
}

$(function() {
	$("#actionManHours").blur(function(){
		var _this =$(this);
		$("#tlbManHours").val($(_this).val());
	})
	$("#engs").bind('change', function() {
		var eng = $("#engs").val();
		var engType;
		var engPosition
		
		if(eng==1 ){
			engPosition = "1";
		}else if (eng==2){
			engPosition = "2";
		}else{
			engPosition = "";
		};
		
		
		if(eng==1 || eng ==2){
			engType = "1";
		}else{
			engType = "2";
		};
		
		var actionUrl = basePath+'/tlb/defect_info_getEngSN.action';
		var parameter = 
			{
				"acReg" : $("#acid").val(),
				"engPosition" : engPosition,
				"engType" : engType
			};
		
		if($("#acid").val()==""){
			$("#engs").val("");
			P.$.dialog.alert('please select acReg.');
			return;
		}
		
		if(null == eng || ""== eng){
			$("#defect_engineSN").val("");
		}else{
			
			$.ajax
			({
				url : actionUrl,
				type:"post",
				data : parameter,
				dataType : "json",
				async: false,
				cache : false,
				success : function(obj, textStatus) 
				{
					var data = JSON.parse(obj);
					if(data.ajaxResult.indexOf("success") != -1)
					{
						var sn = data.SN;
						$("#defect_engineSN").val(sn);
						
					}else{
						$("#defect_engineSN").val("");
					}
				}
			});
		}
		
		
	});
	
	// 必检标志
	$("#tlb_rii").click(function() {
		if ($(this).prop("checked")) {
			$("#tlb_rci").prop('checked',false);
		}
		chgRii();
	});
	//rci事件响应
	$('#tlb_rci').click(function() {
		if ($(this).prop("checked")) {
			$("#tlb_rii").prop('checked',false);
		}
		chgRii();
	});
	chgStatus();
	chgRii();
	//选择工程文件
	$("#ctrDocNo_seach_btn").click(searchCtrDocNo);

	// 日期格式化后首位有空格，这里使用js去掉空格
	$("#tlb_found_date,#tlb_action_date").each(function() {
		$(this).val($.trim($(this).val()));
	});

	$('#tlb_found_date').datetimebox({});
	$('#tlb_action_date').datetimebox({});
	
	//日期+单选框必选一个验证
	$.validator.addMethod("dateRequired", function(value, element) {
		var dateId = $(element).data("dateId");
		var date = $("#" + dateId).datebox("getValue"); 
		
		if((date == null || date == '') && !$(element).is(":checked")){
			return false;
		}
		
		 return true;   
	}, "Please select a date or check on the checkbox.");
	
	// 添加cc按钮
	$("#add_cc_btn").click(function() {
		var params = {
			"methodType":"add",
			"tlbId":$("#tlbId").val(),
			"docType":"1",
			"docNo":$("#tlbNo").val(),
			"acId":$("#acId").val(),
			"acNo":$("#acid").val(),
			//add by 80003187 将航班id，航班号，jobid带过来 start---
			"fltId":$("#flightid").val(),
			"fltNo":$("#tlb_flt").val(),
			"jobId":$("#lineJobId").val()
			//add by 80003187 将航班id，航班号，jobid带过来 end---
			
		};
		P.$.dialog({
			title:'Add TLB CC',
			width:'1000px',
			height:'500px',
			top:'10%',
			esc:true,
			cache:false,
			max: false, 
			min: false,
			parent:this,
			content:'url:tlb/defect/tlb_cc_add.jsp',
			data:params,
			close:function(){
				//刷新当前窗口
				_self.location.reload();
			}
		});
	});
	
	// 删除按钮事件
	$(".tlb_cc_item .delete_btn").click(function() {
		var tlbCompCCId = $(this).attr("tlbCompCCId");
		P.$.dialog.confirm("Sure to delete?", function(){
			deleteTlbCompCC(tlbCompCCId);
		});
	});
	
	// 编辑按钮事件
	$(".tlb_cc_item .edit_btn").click(function() {
		var tlbCompCCId = $(this).attr("tlbCompCCId");
		editTlbCompCC(tlbCompCCId);
	});
	
	// close按钮事件
	$(".tlb_cc_item .close_btn").click(function() {
		var tlbCompCCId = $(this).attr("tlbCompCCId");
		closeTlbCompCC(tlbCompCCId);
	});
})

/**
 * 查看CC
 * @param obj
 * @param event
 */
function view(obj) {
	var id = $(obj).attr('id');
	var params = {
		"methodType":"view"
	};
	var actionUrl = basePath + "/tlb/tlb_comp_cc_view.action?id="+id;
	P.$.dialog({
		title:'View TLB CC',
		width:'1000px',
		height:'500px',
		top:'10%',
		esc:true,
		cache:false,
		max: false, 
		min: false,
		parent:this,
		content : 'url:' + actionUrl,
		data : params
	});
}

/**
 * 编辑CC
 */
function editTlbCompCC(id){
	var params = {
		"methodType":"edit"
	};
	var actionUrl = basePath + "/tlb/tlb_comp_cc_edit.action?id="+id;
	P.$.dialog({
		title:'Edit TLB CC',
		width:'1000px',
		height:'500px',
		top:'10%',
		esc:true,
		cache:false,
		max: false, 
		min: false,
		parent:this,
		data:params,
		content:'url:'+actionUrl,
		close:function(){
			//刷新当前窗口
			_self.location.reload();
		}
	});
}

/**
 * 删除CC
 */
function deleteTlbCompCC(id){
	var actionUrl = basePath + "/tlb/tlb_comp_cc_delete.action";
	var params = {
		"tlbCompCC.id":id
	}
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		data : params,
		success : function(data) {
			if(null != data){
				var info = JSON.parse(data);
				if(info.ajaxResult == 'success'){
					P.$.dialog.tips('Success! ', 2, "success.gif");
					//刷新当前窗口
					_self.location.reload();
				} else {
					P.$.dialog.alert('Failure! ');
				}
			}
		}
	});
}

/**
 * 关闭CC
 */
function closeTlbCompCC(id){
	var actionUrl = basePath + "/tlb/tlb_comp_cc_close.action";
	var params = {
		"tlbCompCC.id":id
	}
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		data : params,
		success : function(data) {
			if(null != data){
				var info = JSON.parse(data);
				if(info.ajaxResult == 'success'){
					P.$.dialog.tips('Success! ', 2, "success.gif");
					//刷新当前窗口
					_self.location.reload();
				} else {
					P.$.dialog.alert('Failure! ');
				}
			}
		}
	});
}


function searchCtrDocNo(){
	var ctrDocType = $("#ctrlDocType").val();
	if(!ctrDocType){
		P.$.dialog.alert("Please select control doc type first.");
		return;
	}
	
	//后续需要进行状态过滤再加参数
	var defaultParam = {};
	queryDialog(ctrDocType, defaultParam, function(rowdata, originalData, dlg, o){
		docSelectCallback(rowdata, originalData, dlg, o,ctrDocType);
		$("#ctrlDocType").val(ctrDocType);
	});
}
//选择文件回填中英文故障描述
function docSelectCallback(rowdata, originalData, dlg, o,ctrDocType){
	$("#cardNo").val(originalData[o.cardNo]);
	$("#cardId").val(originalData[o.cardId]);
	if(null !=ctrDocType && ctrDocType =="EO"){
		$("#tlb_fa_cn").text(originalData.subject);
		$("#tlb_fa_en").text(originalData.subject);
	}else if(null !=ctrDocType && ctrDocType =="JC"){
		$("#tlb_fa_cn").text(originalData.ctitle);
		$("#tlb_fa_en").text(originalData.etitle);
	}else if(null !=ctrDocType && ctrDocType =="NRC"){
		$("#tlb_fa_cn").text(originalData.descChn);
		$("#tlb_fa_en").text(originalData.descEn);
	}else if(null !=ctrDocType && ctrDocType =="TO"){
		$("#tlb_fa_cn").text(originalData.subject ==null?"":originalData.subject);
		$("#tlb_fa_en").text(originalData.subject ==null?"":originalData.subject);
	}else if(null !=ctrDocType && ctrDocType =="TLB"){
		$("#tlb_fa_cn").text(originalData.faultReportChn);
		$("#tlb_fa_en").text(originalData.faultReportEng);
	}
	dlg.close();
}


//状态变更
function chgStatus() {
	// 2013-10-22 modify start
	/*if ($("#tlb_s_p").is(":checked") || $("#tlb_s_d").is(":checked")) {
		$("#lake_required").show();
	} else {
		$("#lake_required").hide();
	}*/
	// end
	var arr = [ "action.takenActionChn", "action.takenActionEng", "techLog.staAction", "techLog.dateAction", "techLog.manHours", "action.technicianActSign", "action.technicianActNo" ];

	if ($("#tlb_s_c").is(":checked") || $("#tlb_s_i").is(":checked")) {
		$("#actioncn_required").show();
		$("#actionen_required").show();
		$("[id^=ddi_rs_]").attr("disabled", true);
		$("[id^=ddi_rs_]").attr("checked", false);
		showOrHideRequired(arr, true);
	} else {
		$("#actioncn_required").show();
		$("#actionen_required").show();
		$("[id^=ddi_rs_]").attr("disabled", false);

		showOrHideRequired(arr, true);
	}
}