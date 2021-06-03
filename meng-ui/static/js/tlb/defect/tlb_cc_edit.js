var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var methodType = s_params["methodType"];
var isContinue = false;

var ParamsUtils = {
	CcType : {
		Remove : 1,
		Install : 2,
		Replace : 3,
		Swap : 4
	}
}

$(function() {
	sub_win.button({
		name : 'Save',
		callback : function() {
			saveCCForm();
			return false;
		}
	}, {	
		name : 'Cancel'
	});
	
	$.extend(DateTimeUtils,{parent_win:P});
	$("#compDate").datebox({
		formatter : formater,
		parser : parser
	});
	$("#compDateTime").datetimebox({
		formatter : formaterDateTime,
		parser : parser
	});
	
	initWebPage();
	var _ccType = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value") || 1;
	showTab(_ccType);
	triggerRT(_ccType);
	triggerAirMaterialState(_ccType);
	if(_ccType == 2 ){
		hide_div_select_nha(true);
		if($("#onAcType").val()==2){
			$('#on_tr_model').show();
		}
	}else{
		_un_off_pn_sn_chg = true;
		queryOffCin();
	}
});


$("#compDateCheckbox").click(function(){
	if($("#compDateCheckbox").is(":checked"))
	{
		$("#compDateDiv").hide();
		$("#compDateTimeDiv").show();
		$("#compDateCheckbox").val('y');
		$("#compDate").datebox({disabled: true});
		$("#compDateTime").datetimebox({disabled: false});
		$("#compDateDiv .combo-value").attr("disabled" , true);
		$("#compDateTimeDiv .combo-value").attr("disabled" , false);
	}
	else
	{
		$("#compDateDiv").show();
		$("#compDateTimeDiv").hide();
		$("#compDateCheckbox").val('n');
		$("#compDate").datebox({disabled: false});
		$("#compDateTime").datetimebox({disabled: true});
		$("#compDateDiv .combo-value").attr("disabled" , false);
		$("#compDateTimeDiv .combo-value").attr("disabled" , true);
	}
});

function formaterDateTime(date) {
	var y = date.getFullYear();
	var m = parseInt(date.getMonth()) + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	m = (m < 10) ? ('0' + m) : m;
	d = (d < 10) ? ('0' + d) : d;
	h = (h < 10) ? ('0' + h) : h;
	mi = (mi < 10) ? ('0' + mi) : mi;
	s = (s < 10) ? ('0' + s) : s;
	return y + "-" + m + "-" + d + ' ' + h + ':' + mi + ':' + s;
}

function formater(date) {
	var y = date.getFullYear();
	var m = parseInt(date.getMonth()) + 1;
	var d = date.getDate();
	m = (m < 10) ? ('0' + m) : m;
	d = (d < 10) ? ('0' + d) : d;
	return y + "-" + m + "-" + d;
}
function parser(date) {
	if (date) {
		return new Date(Date.parse(date.replace(/-/g, "/")));
	} else {
		return new Date();
	}
}

$("input:radio[name='tlbCompCC.ccType']").change(function() {
	//有执行文件时改变拆换类型，需保持飞机和reason信息
	var airType = $("input[name='tlbCompCC.offAcType']").val();
	var airId = $("input[name='tlbCompCC.offAcId']").val();
	var air = $("input[name='tlbCompCC.offAc']").val();
	if(airId == ""){
		airType = $("input[name='tlbCompCC.onAcType']").val();
		airId = $("input[name='tlbCompCC.onAcId']").val();
		air = $("input[name='tlbCompCC.onAc']").val();
	}
	$("#relativePositionOff").hide();
	$("#relativePositionOn").hide();
	//切换CC类型时,不需要清空的数组
	var filterAttrArray = new Array();
	filterAttrArray.push("tlbCompCC.completeDate");
	filterAttrArray.push("tlbCompCC.ccNo");
	filterAttrArray.push("tlbCompCC.docType");
	filterAttrArray.push("tlbCompCC.docNo");
	filterAttrArray.push("tlbCompCC.referId");
	filterAttrArray.push("tlbCompCC.referNo");
	filterAttrArray.push("tlbCompCC.referType");
	
	var ccType = $("input:radio[name='tlbCompCC.ccType']:checked").attr("id");
	$("#ccTable").find("input[type!=radio]").each(function(){
		var objName = $(this).attr("name");
		var isDate = $(this).hasClass('combo-f') || $(this).hasClass('combo-text') || $(this).hasClass('combo-value');
		if(!($.inArray(objName,filterAttrArray)>-1) && !isDate){
			$(this).val("");
		}
	});
	var exeDoc = $("input[name='tlbCompCC.docType']").val();
	if(exeDoc != null && exeDoc != '3'){
		if(ccType == "ccType2"){
			$("input[name='tlbCompCC.onAcType']").val(airType);
			$("input[name='tlbCompCC.onAcId']").val(airId);
			$("input[name='tlbCompCC.onAc']").val(air);
		}else{
			$('#offCin').val('').hide();
			$("input[name='tlbCompCC.offAcType']").val(airType);
			$("input[name='tlbCompCC.offAcId']").val(airId);
			$("input[name='tlbCompCC.offAc']").val(air);
		}
	}else{
		$("#reason").val("");
	}
	if(ccType != "ccType2"){
		$('#offCin').val('').hide();
	}
	$('div.font_red').text('');
	$("#reason").val("");
	$("#remark").val("");
	$("#reason").nextAll('.font_red').text('');
	$("#remark").nextAll('.font_red').text('');

	clearTableData();
	if(ccType != 'ccType2')
		hide_div_select_nha(false);
	$("#on2_tr").hide();
	$('#on_tr_model').hide();
	setAcModelSelect(null,$('#on_sel_model'));
	if (ccType == 'ccType1') {
		$("#off_tr").show();
		$("#on_tr").hide();
		showTab(1);
		triggerRT(1);
		//add by wubo 80003187 新增航材状态
		triggerAirMaterialState(1);
	} else if (ccType == 'ccType2') {
		hide_div_select_nha(true);
		$("#off_tr").hide();
		$("#on_tr").show();
		showTab(2);
		triggerRT(2);
		//add by wubo 80003187 新增航材状态
		triggerAirMaterialState(2);
	} else if (ccType == 'ccType3') {
		$("#off_tr").show();
		$("#on_tr").hide();
		$("#on2_tr").show();
		showTab(3);
		triggerRT(3);
		//add by wubo 80003187 新增航材状态
		triggerAirMaterialState(3);
	} else if (ccType == 'ccType4') {
		$("#off_tr").show();
		$("#on_tr").show();
		showTab(4);
		triggerRT(4);
		//add by wubo 80003187 新增航材状态
		triggerAirMaterialState(4);
	}
	disableTr(ccType);
});

function showTab(idx) {
	$("table[id^='tab']").each(function(){
		$(this).hide();
		$(this).find("input").each(function(){
			$(this).attr("disabled","disabled");
		});
	});
	$("#tab_" + idx).show();
	$("#tab_" + idx).find("input").each(function(){
		$(this).removeAttr("disabled");
	});
}

//验证输入项
$("#addForm").validate(
		{
			debug : true, //调试模式取消submit的默认提交功能   
			onkeyup : false, //当键盘按键弹起时验证
			errorElement : "div",// 使用"div"标签标记错误， 默认:"label","span"默认直接在文本框右边显示 
			invalidHandler : function(form, validator) {//如果验证不通过，此处执行额外操作  
				var errors = validator.numberOfInvalids(); //获得错误总数  
				var message = '你存在' + errors + '个错误';
				return false;
			},
			submitHandler : function(form) {
				//如果验证通过，点击submit按钮后执行的操作,注：使用此方法后，form中的action="xx"会失效  
				alert('验证通过，submitted');
				return false;//阻止表单提交
			},
			rules : {//此处开始配置校验规则，下面会列出所有的校验规则 
				"tlbCompCC.offName" : {rangelength:[1,100]},
				"tlbCompCC.offAc" : {required : true},
				"tlbCompCC.offPn" : {required : true, rangelength:[1,30]},
				"tlbCompCC.offSn" : {required : true, rangelength:[1,30]},
				"tlbCompCC.offPosition" : {rangelength:[1,30]},
				"tlbCompCC.onName" : {rangelength:[1,100]},
				"tlbCompCC.onAc" : {required : true},
				"tlbCompCC.onPn" : {required : true, rangelength:[1,30]},
				"tlbCompCC.onSn" : {required : true, rangelength:[1,30]},
				"tlbCompCC.onPosition" : {rangelength:[1,30]},
				//"tlbCompCC.reason" : {required : true, rangelength:[1,1000]},
				"tlbCompCC.remark" : {rangelength:[1,300]}
			},
			messages : {
				"tlbCompCC.offName" : {rangelength:"No more than {1} bytes."},
				"tlbCompCC.offAc" : {required : "This field is required."},
				"tlbCompCC.offPn" : {required : "This field is required.", rangelength:"No more than {1} bytes."},
				"tlbCompCC.offSn" : {required : "This field is required.", rangelength:"No more than {1} bytes."},
				"tlbCompCC.offPosition" : {rangelength:"No more than {1} bytes."},
				"tlbCompCC.onName" : {rangelength:"No more than {1} bytes."},
				"tlbCompCC.onAc" : {required : "This field is required."},
				"tlbCompCC.onPn" : {rangelength:"No more than {1} bytes."},
				"tlbCompCC.onSn" : {rangelength:"No more than {1} bytes."},
				"tlbCompCC.onPosition" : {rangelength:"No more than {1} bytes."},
				//"tlbCompCC.reason" : {required : "This field is required.", rangelength:"No more than {1} bytes."},
				"tlbCompCC.remark" : {rangelength:"No more than {1} bytes."}
			},
			errorPlacement : function(error, element) {
				error.appendTo(element.nextAll("div"));//配置错误信息  
			},
			highlight : function(element, errorClass) { //针对验证的表单设置高亮   
				$(element).addClass(errorClass);
			},
			success : function(label) {
				label.remove();
			}
});

function getSwapCC(){
	var isSwap = $("#ccType4").attr("checked");
	if(isSwap != 'checked'){
		alert("CC Type is not Swap");
		return;
	}
	//如果不是"Swap"
	/*if(){
		return false;
	}*/
	
	var offPn = $("#offPn").val();
	var offSn = $("#offSn").val();
	var onPn = $("#onPn").val();
	var onSn = $("#onSn").val();
	var compDate = $("#compDate").val();
	
	var dlg = $(this).sfaQueryDialog({
		dialogId : "swap_cc",
		dialogTitle : "Swap CC",
		view : "V_COMP_CC",
		dialogWidth : 1000,
		defaultParam :{
			"componentCC.offPn" : offPn,
			"componentCC.offSn" : offSn,
			"componentCC.onPn" : onPn,
			"componentCC.onSn" : onSn,
			"componentCC.completeDate" : compDate
		},
		gridOptions : {
			url : basePath + "/component/cc_selectSwapCC.action",
			callback : function(rowdata, originalData) {
				$("#onAc").val(originalData.offAc);
				$("#onPositionOld").val(originalData.offPosition);
				$("#onPosition").val(originalData.offPosition);
				$("#onName").val(originalData.offName);
				
				dlg.close();
			}
		}
	});	
	
}

//保存表单信息
function saveCCForm(){	
	if(!validCCForm()){
		return false;
	}
	var actionUrl = basePath + "/tlb/tlb_comp_cc_update.action";	
	var params = $("#addForm").serialize();
	var focus = $("#compDateCheckbox").val();
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		data : params,
		success : function(data) {
			P.$.dialog.success("Save successfully!", function(){
				sub_win.close();
			});
			return false;
		}
	});
}

//提交表单信息
function submitCCForm(){
	var cinValidFlag = false;
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	if(type == 2 && $("#offCin").val() == "")
	{
		if($("#onPnId").val() != "" || $("#selectOption").val() == 2 || $("#onId").val() != "")
		{
			//$("#offCin").nextAll(".font_red").text("This field is required.");
			//cinValidFlag = true;
		}
		else
		{
			$("#offCin").nextAll(".font_red").text("");
		}
	}
	if(!validCCForm() || cinValidFlag)
	{
		sub_win.button({name : 'Submit',disabled : false});
		return false;
	}
	var confirmMsg = "Confirm?";
	sub_win.button({name : 'Submit',disabled : true});
	P.$.dialog.confirm(confirmMsg,function(){
		submit_cc();
		return true;
	},function(){
		sub_win.button({name : 'Submit',disabled : false});
	});	
	
}
function  submit_cc(data){
	
	var params = $("#addForm").serialize();
	//还原强制确认信息
	$("#ignoreCinNotMatch").val("false");
	$("#ignoreReason").val("");
	
	var focus = $("#compDateCheckbox").val();
	params+="&componentCC.focus="+focus;
	var actionUrl = basePath + "/component/cc_submit.action";
	P.$.dialog.tips('请稍后',500,'loading.gif').lock(true);
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		async : false,
		data : params,
		success : function(data) {
			P.$.dialog.tips('请稍后',0.0001,'loading.gif');
			var result = transData(data);
			if (!result) {
				sub_win.button({name : 'Submit',disabled : false});
				return false;
			}
			P.$.dialog.success("Submit successfully!", function() {
				sub_win.close();
			});
		},
		error:function(){
			sub_win.button({name : 'Submit',disabled : false});
			P.$.dialog.tips('请稍后',0,'loading.gif');
		}
	});
}
/**
 * 显示拆下件相关工程文件
 */
function hintOffCompRefFiles()
{
	var ccId = $("input[name='tlbCompCC.id']").val();
	var ccType = $("input[name='tlbCompCC.ccType']:checked").val();
	var offAcId = $("#offAcId").val();
	var offPn = $("[name$='.offPn']").val();
	var onPn =null;
	if(null !=ccType && (ccType ==2 || ccType ==4)){
		onPn= $("#onPn").val();
	}else if(ccType == 3){
		onPn= $("#onPn2").val();
	}
	if(ParamsUtils.CcType.Remove == ccType || ParamsUtils.CcType.Replace == ccType)
 	{
		//var actionUrl = basePath + "/component/cc_showRelatedMRequirements.action?componentCC.id="+ccId;
		var actionUrl = basePath + "/component/cc_showRelatedMRequirements.action?componentCC.offPn="+offPn+"&componentCC.ccType="+ccType+"&componentCC.id="+ccId+"&componentCC.offAcId="+offAcId;
		sub_win.button({name : 'Submit', disabled : true});
		$.ajax({
			url : actionUrl,
			cache : false,
			type : "post",
			dataType : "json",
			success : function(data) {
				var info = JSON.parse(data);
				var mrList = info.mrList;
				var ajaxResult = info.ajaxResult;
				if ("success" == ajaxResult) 
				{
					//如果没有相关工程文件，则直接确认此CC
					if(null == mrList || "" == mrList)
					{
						//checkProhibitiveOrRestrictive(onPn,ccType);
						submitCCForm();
					}
					else
					{
						var params = {
								"mrList":mrList
						}
						//如果有相关工程文件，则在工程文件展示窗口关闭后，确认此CC
						P.$.dialog({
							title : 'Related Maintenance Requirements',
							width : '500px',
							height : '300px',
							top : '15%',
							esc : true,
							cache : false,
							max : false,
							min : false,
							parent : this,
							data : params,
							content : 'url:component/cc_relatedMRequirments.jsp',
							close : function(){
								//checkProhibitiveOrRestrictive(onPn,ccType);
								
								submitCCForm();
							}
						});
					}
				}
				else 
				{
					P.$.dialog.alert("set failed.");
					sub_win.button({name : 'Submit', disabled : false});
				}
			}
		});
	}
	/*else if(ParamsUtils.CcType.Install == ccType || ParamsUtils.CcType.Replace == ccType || ParamsUtils.CcType.Swap == ccType ){
		checkProhibitiveOrRestrictive(onPn,ccType);
	}*/
	else
	{
		submitCCForm();
	}
}

//校验禁限装
function checkProhibitiveOrRestrictive(onPn,ccType){
	var actionUrl = basePath + "/component/cc_showProhibitiveOrRestrictive.action?componentCC.onPn="+onPn+"&componentCC.ccType="+ccType;
	sub_win.button({name : 'Submit', disabled : true});
	$.ajax({
		url : actionUrl,
		cache : false,
		type : "post",
		dataType : "json",
		success : function(data) {
			var info = JSON.parse(data);
			var mrList = info.mrList;
			var ajaxResult = info.ajaxResult;
			if ("success" == ajaxResult) 
			{
				//如果没有相关工程文件，则直接确认此CC
				if(null == mrList || "" == mrList)
				{
					submitCCForm();
				}
				else
				{
					var title ='请注意TB禁限装信息!';
					var params = {
							"mrList":mrList
					}
					//如果有相关工程文件，则在工程文件展示窗口关闭后，确认此CC
					P.$.dialog({
						title : title,
						width : '500px',
						height : '300px',
						top : '15%',
						esc : true,
						cache : false,
						max : false,
						min : false,
						parent : this,
						data : params,
						content : 'url:component/cc_relatedMRequirments.jsp',
						close : function(){
							submitCCForm();
						}
					});
				}
			}
			else 
			{
				P.$.dialog.alert("set failed.");
				sub_win.button({name : 'Submit', disabled : false});
			}
		}
	});
}


function transData(data) {
	var info = JSON.parse(data);
	if (info.unConfirmedCcListStr != "" && info.unConfirmedCcListStr != undefined) {
		P.$.dialog.alert("Submit Failed ! CC [ " + info.unConfirmedCcListStr
				+ " ] are mandatory to be confirmed  firstly !");
		
		sub_win.button({name : 'Submit',disabled : false});
		return false;
	} 
	else 
	{
		//消耗件
		var consumptiveFlag = false;
		var errorMessage = info.errorMessage;
		var refCCNo = info.refCCNo;
		if (info.errorMessage != "" && info.errorMessage != undefined) {
			var cc = info.componentCC;
			var list = info.componentCCSubSet;
			if (cc.offFlag || cc.onFlag) {
				consumptiveFlag = true;
			} 
			else
			{
				if (list != null) 
				{
					for (var i = 0; i < list.length; i++) 
					{
						if (list[i].offFlag) {
							consumptiveFlag = true;
							break;
						}
						if (list[i].onFlag) {
							consumptiveFlag = true;
							break;
						}
					}
				}
			}
			showSelectIcon($("#offOption"), cc.offFlag, $("#offPnId"));
			showSelectIcon($("#onOption"), cc.onFlag, $("#onPnId"));
			showSelectIcon($("#onSnSelect2"), cc.onFlag, $("#onPnId2"));
			errorInfo(list, errorMessage, consumptiveFlag, refCCNo, info);
			return false;
		}
	}
	return true;
}

function errorInfo(list, errorMessage, consumptiveFlag, refCCNo, info){
	if(list != null){
		for(var i = 0; i < list.length; i++){
			if(list[i].offFlag){
				$("img[name^='subSnSelect"+i+"']").show();
				$("img[name^='subSnSelect"+i+"']").attr("src", "../images/icon_install.gif");
			}
			if(list[i].onFlag){
				$("img[name^='subSnReplace"+i+"']").show();
				$("img[name^='subSnReplace"+i+"']").attr("src", "../images/icon_modify.gif");
				$("img[name^='subSnSwap"+i+"']").show();
				$("img[name^='subSnSwap"+i+"']").attr("src", "../images/icon_install.gif");
			}
		}
	}
	var message = {
		"type" : 1,
		"msg" : errorMessage,
		"flag" : consumptiveFlag,
		"refCCNo" : refCCNo
	};
	var dlg = P.$.dialog({
		title:'Cc Confirm Information',
		width:'550px',
		height:'300px',
		top:'15%',
		esc:true,
		lock:true,
		cache:false,
		max: false, 
        min: false,
		parent:sub_win,
		content:'url:component/cc_refer.jsp',
		data:message,
		close:function(){
			if(this.data["refFlag"])
			{
				var params = $("#addForm").serialize();
				var actionUrl = basePath + "/component/cc_submit.action";
				params += "&componentCC.refCCNo="+this.data["refCCNo"];
				var focus = $("#compDateCheckbox").val();
				params+="&componentCC.focus="+focus;
				$.ajax({
					url:actionUrl,
					type:"post",
					cache:false,
					dataType:"json",
					async:false,
					data:params,
					success:function(data){
						var result = transData(data);
						if (!result) {
							return false;
						}
						P.$.dialog.success("Submit successfully!", function(){
							P.location.reload();
						});
					}
				});
			}
		}
	});
	
	if(permissionMap.ignore && info.componentCC.errorType == 1){
		dlg.button({
			name : "Ignore",
			callback : function(){
				P.$.dialog({
					title:'Ignore Error Message',
					width:'400px',
					height:'200px',
					top:'15%',
					esc:true,
					cache:false,
					max: false, 
			        min: false,
					parent:this,
					content:'<table class="table_dialog"><tr><td style="width:90px;border:solid #CCCCCC 1px;background-color:#F2F2F2">Ignore Reason : </td>'
						+ '<td style="border:solid #CCCCCC 1px;" class="td_content" colspan="4">'
						+ '<textarea id="ignoreReasonTemp" cols="" rows="10" class="textarea valid" style="width: 99%;" maxlength="1000"></textarea>'
						+ '</td></tr></table>',
					button : [{
						name: 'Confirm',
						callback : function(){
							$("#ignoreCinNotMatch").val("true");
							$("#ignoreReason").val(top.$("#ignoreReasonTemp").val());
							submitCCForm();
						}
					}]
				});
			}
		});
	}
}
function validCCModel(type){
	type = type || '';
	var onACType = $("#onAcType").val();
	var on_model = $("#on_sel_model").val();
	if(onACType == 2 && type == 2){
		$("#onAc").nextAll('.font_red').text('');
		if(!on_model){
			$("#onAc").nextAll('.font_red').text('部件需要先匹配构型.');
			return false;
		}
	}
	return true;
}

function validCCForm(){
	//完成日期必填
	var compDate = $.trim($("#compDate").datetimebox("getValue"));
	var compDateFlag = false;
	if(compDate == ""){
		$("#compDate").nextAll(".font_red").text("This field is required.");
	}else{
		compDateFlag = true;
		$("#compDate").nextAll(".font_red").text("");
	}
	disableTr($("input:radio[name='tlbCompCC.ccType']:checked").attr("id"));
	
	if(!$("#addForm").valid() || !compDateFlag){
		return false;
	}	
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	if((type == 1 || type == 3 || type == 4) && $("#offAc").nextAll(".font_red").text() != ""){
		return false;
	}
	if((type == 2 || type == 4) && $("#onAc").nextAll(".font_red").text() != ""){
		return false;
	}
	if(type ==2){
		if(!validCCModel(type))return false;
	}
	var _flag = true;
	$('[name^="tlbCompCCSubSet"][name$=".name"]').each(function(i,e){
		 $(e).closest('tr').find('[name$=".onSn"]').nextAll(".font_red").html("");
		 $(e).closest('tr').find('[name$=".onPn"]').nextAll(".font_red").html("");
		var $onPn = $(e).closest('tr').find('[name$=".onPn"]').val();
		var $onSn =  $(e).closest('tr').find('[name$=".onSn"]').val();
		if($.trim($onSn) || $.trim($onPn)){
			if(!$onSn){
				_flag = false;
				 $(e).closest('tr').find('[name$=".onSn"]').nextAll(".font_red").html("This field is required.");
				return false;
			}else if(!$onPn){
				_flag = false;
				 $(e).closest('tr').find('[name$=".onPn"]').nextAll(".font_red").html("This field is required.");
				return false;
			}
		}
	});
		
	return _flag;
}

//根据部件是否存在显示按钮
function showSelectIcon(obj, flag, refId){
	if(flag){
		$(obj).show();
		$(obj).attr("src", "../images/icon_modify.gif");
		$(obj).nextAll("img").show();
	}else if($(refId).val() != ""){
		$(obj).show();
		$(obj).attr("src", "../images/icon_modify.gif");
	}else{
		$(obj).hide();
	}
}

function disableTr(ccType){
	$("#on2_tr").find("input").each(function(){
		$(this).attr("disabled","disabled");
	});
	if (ccType == 'ccType1') {
		$("#on_tr").find("input").each(function(){
			$(this).attr("disabled","disabled");
			$(this).val("");
		});
	} else if (ccType == 'ccType2') {
		$("#on_tr").find("input").each(function(){
			$(this).removeAttr("disabled");
		});
	} else if (ccType == 'ccType3') {
		$("#on_tr").find("input").each(function(){
			$(this).attr("disabled","disabled");
			$(this).val("");
		});
		$("#on2_tr").find("input").each(function(){
			$(this).removeAttr("disabled");
		});
	} else if (ccType == 'ccType4') {
		$("#on_tr").find("input").each(function(){
			$(this).removeAttr("disabled");
		});
	}
}

function offExistsAc(info,_flag){
	if(info && _flag){
		$("#offAcId").val(info.offAcId);
		$("#offAcType").val(info.offAcType);
		$("#offAc").nextAll('.font_red').text('');
	}else{
		if($("#offAc").val() != ""){
			$("#offAc").nextAll('.font_red').text('A/C tail# or S/N for OFF ENG/APU/LG.');
		}else{
			$("#offAc").nextAll('.font_red').text('');
		}
		if($("#flightNo").val() != ""){
			$("#flightNo").val("");
			$("#flightNo").nextAll('.font_red').text('This field is required.');
		}
	}
	
}

function onExistsAc(info,_flag,_cctype){
	if(info && _flag){
		$("#onAcId").val(info.onAcId);
		$("#onAcType").val(info.onAcType);
		$("#onAc").nextAll('.font_red').text('');
		if(_cctype && _cctype == 2){
			if(info.onAcType == 2){
				if(info.acConfigs){
					setAcModelSelect(info.acConfigs,$('#on_sel_model'));
					$('#on_tr_model').show();
				}else{
					$("#onAc").nextAll('.font_red').text('部件需要先匹配构型.');
				}
			}
			queryOnCin(true);
		}
		
	}else{
		if($("#onAc").val() != ""){
			$("#onAc").nextAll('.font_red').text('A/C tail# or S/N for OFF ENG/APU/LG.');
		}else{
			$("#onAc").nextAll('.font_red').text('');
		}
		if($("#flightNo").val() != ""){
			$("#flightNo").val("");
			$("#flightNo").nextAll('.font_red').text('This field is required.');
		}
	}
	
}

var offExistFlag = true;
var onExistFlag = true;

//验证飞机
function validAc(obj, params){
	var objId = $(obj).attr("id");
	var objectValue = $.trim($(obj).val());
	$('#on_tr_model').hide();
	if(objectValue != ""){
		
		var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
		var actionUrl = basePath +"/component/cc_validAc.action";
		$.ajax({
			url : actionUrl,
			type : "post",
			cache : false,
			dataType : "json",
			async:false,
			data : params,
			success : function(data) {
				if(null != data){
					var info = JSON.parse(data);
					if(objId == "offAc"){
						offExistFlag = info.offExistFlag;
						offExistsAc(info,info.offExistFlag);
					}
					if(objId == "onAc"){
						onExistFlag = info.onExistFlag;
						
						onExistsAc(info, onExistFlag, type)
					}
				}
			},
			error : function() {
				P.$.dialog.alert('Error!');
			}
		});
	}
	else{
		$(obj).nextAll('.font_red').children("span").text('');
	}
	if($(obj).attr("id")=="offAc"){
		$("#flightId,#flightNo").val('');
		$("#flightId,#flightNo").nextAll('.font_red').text('');
		$("#tab_1").find("input[type='text']").each(function(){
			$(this).val('');
			$(this).nextAll('.font_red').text('');
		});
		$(".clean_value").find("input[type='radio']").each(function(){
			$(this).prop('checked',false);
			$(this).nextAll('.font_red').text('');
		});
	}
	if($(obj).attr("id")=="onAc"){
		var type=$("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
		if(type != '4'){
			$("#flightId,#flightNo").val('');
			$("#flightId,#flightNo").nextAll('.font_red').text('');
			$(".clean_value").find("input[type='radio']").each(function(){
				$(this).prop('checked',false);
				$(this).nextAll('.font_red').text('');
			});
		}		
		if ($("#tab_2 tr").length > 2) {
			$("#tab_2").find("tr:gt(1)").remove();
		}
	}
}

//即将拆下指定部件的飞机
$("#offAc").change(function(){
	clearTableData();
	var objectValue = $.trim($(this).val());
	var params = {"tlbCompCC.offAc" : objectValue};
	validAc($(this), params);
});

//即将装上指定部件的飞机
$("#onAc").change(function(){
	var objectValue = $.trim($(this).val());
	var params = {"tlbCompCC.onAc" : objectValue};
	validAc($(this), params);
});

//选择航班号
$("#searchFlightNo_btn").bind("click",function(){
	var regno;
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	if(type!=2){
		regno=$("#offAc").val();		
		if($.trim(regno)!=''&& offExistFlag){
		}else{
			return false;
		}
	}else{
		regno=$("#onAc").val();
		if($.trim(regno)!=''&& onExistFlag){
		}else{
			return false;
		}
	}
	assignDefect("select", null,regno,"cc", function(dlg){
		if(dlg.data['flightDate'] == null){
			return;
		}
		$("#flightId").val(dlg.data['flightId']);
		$("#flightNo").val(dlg.data['flightNo']);
		$("#jobId").val(dlg.data['lineJobId']);
		$("#flightNo").nextAll('.font_red').text('');
		var flightDate = dlg.data['flightDate'];
		flightDate = flightDate.substr(0, flightDate.length-3);
		$("#flightDate").text("Flt.Date :" + flightDate);
	});
});

/**
 * 根据CC类型显示关联部件相对于根部件的位置信息
 * @param ccType
 * @param relativePositionOn
 * @param relativePositionOff
 */
function showRefCompsRelativePosition(ccType, relativePositionOn, relativePositionOff){
	$("#relativePositionOff").html(relativePositionOff);
	$("#relativePositionOn").html(relativePositionOn);
	if(ccType == 1 || ccType == 3 || ccType == 4){
		$("#relativePositionOff").show();
	}else{
		$("#relativePositionOff").hide();
	}
	
	if(ccType == 4){
		$("#relativePositionOn").show();
	}else{
		$("#relativePositionOn").hide();
	}
}

//获得下级部件列表
var subComponentList,preOffpn,preOffsn,_un_off_pn_sn_chg = false;;
$("#offPn,#offSn").change(function(){
	$(this).val($.trim($(this).val()));
	var _curOffPn = $.trim($("#offPn").val());
	var _curOffSn = $.trim($("#offSn").val());
	_un_off_pn_sn_chg = preOffpn == _curOffPn && _curOffSn==preOffsn;
	queryOffCin();
	preOffpn = _curOffPn;
	preOffsn = _curOffSn;
});

function getSubList(cinObject, idObject){
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	var onACType = $("#onAcType").val();
	var on_model = $("#on_sel_model").val();
	if(onACType == 2 && type == 2){
		$("#onAc").nextAll('.font_red').text('');
		if(!on_model){
			$("#onAc").nextAll('.font_red').text('部件需要先匹配构型.');
			return false;
		}
	}
	var params = {"componentCC.offAc" : $.trim($("#offAc").val()), 
			"componentCC.offPn" : $.trim($("#offPn").val()), 
			"componentCC.offSn" : $.trim($("#offSn").val()), 
			"componentCC.offAcId" : $.trim($("#offAcId").val()),
			"componentCC.offPnId" : $("input[name='tlbCompCC.offPnId']").val(),
			"componentCC.onAc" : $.trim($("#onAc").val()), 
			"componentCC.onPn" : $.trim($("#onPn").val()), 
			"componentCC.onSn" : $.trim($("#onSn").val()), 
			"componentCC.onAcId" : $.trim($("#onAcId").val()),
			"componentCC.onAcType" : $("#onAcType").val(),
			"componentCC.offAcType" : $("#offAcType").val(),
			"componentCC.onPnId" : $("#onPnId").val(),
			"componentCC.selectOptionOff" : $("#selectOption").val(),
			"componentCC.ccType" : type,
			"componentCC.onModel" : on_model,			
	};
	var actionUrl = basePath +"/component/cc_initSubComponentList.action";
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		data : params,
		success : function(data) {
			$(cinObject).empty();
			$(idObject).val("");
			if(null != data){
				var info = JSON.parse(data);
				
				var relativePositionOff = info.relativePositionOff;
				var relativePositionOn = info.relativePositionOn;
				showRefCompsRelativePosition(type, relativePositionOn, relativePositionOff);
				
				var pnsn = info.pnsnOff;
				if(type == 2 ||(type == 4 && $(cinObject).attr("id")=='onCin')){
					pnsn = info.pnsnOn;
				}
				if(pnsn != null){
					$(idObject).val(pnsn.id);
					if((type == 4 && $(cinObject).attr("id")=='offCin') || type == 1 || type == 3){
						$("#offPositionOld").val(pnsn.position);
					}else{
						$("#onPositionOld").val(pnsn.position);
					}

					if(type == 2){
						
						cinObject.show();
						var configs = info.configs;
						setCinSelect(configs,cinObject);
						setOnName(cinObject);
						
					}else{
						var option = $("<option value='" + pnsn.cin + "'>" + pnsn.cin + "</option>");
						$(cinObject).append(option);
					}
				}else{
					if(type == 2){
						var configs = info.configs;
						if(configs.length != 1){
							$(cinObject).append("<option value=''>== Please Select ==</option>");
						}
						for(var i = 0; i < configs.length; i++){
							var option = $("<option value='" + configs[i].cin + "' cname='"+configs[i].cname+"'>" + configs[i].cin + "</option>");
							$(cinObject).append(option);
						}
					}else{
						$(cinObject).append("<option value=''>== Please Select ==</option>");
						if((type == 4 && $(cinObject).attr("id")=='offCin') || type == 1 || type == 3){
							$("#offPositionOld").val("");
						}else{
							$("#onPositionOld").val("");
						}
					}
				}
				
				if(info.applyFlag){
					if(!_un_off_pn_sn_chg){
						clearTableData();
						_un_off_pn_sn_chg = false;
					}else if(info.isAEA){
						clearTableData();
						_un_off_pn_sn_chg = false;
					}
					
					subComponentList = info.subComponentList;
					initSubList(subComponentList);
				}else{
					clearTableData();
				}
			}			
		},
		error : function() {
			P.$.dialog.alert('Error!');
		}
	});
}

//获得下级部件列表
var preOnpn,preOnsn,_un_on_pn_sn_chg = false;
//装上部件的pn,sn决定构型和下级部件列表
$("#onPn,#onSn").change(function(){
	$(this).val($.trim($(this).val()));
	var _curOnPn = $.trim($("#onPn").val());
	var _curOnSn = $.trim($("#onSn").val());
	_un_on_pn_sn_chg = preOnpn == _curOnPn && preOnsn==_curOnSn;
	queryOnCin();
	preOnpn = _curOnPn;
	preOnsn = _curOnSn;
	
});

$("input[name^='tlbCompCCSubSet']").live('change',function(){
	$(this).val($.trim($(this).val()));
});


function queryOnCin(change){
	if(!$.trim($("#onPn").val()) || !$.trim($("#onSn").val()))
		return false;
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	$("#onPnId").val("");
	$("#onOption").next("span").text("");
	$("#onOption").hide();
	$("#selectOption").val("");
	if(type == 2){
		$("#onId").val("");
		$("#offCin").nextAll(".font_red").text("");
		initInstallCin(change);
	}else{
		var cinObject = $("#onCin");
		var idObject = $("#onId");
		getSubList(cinObject, idObject);
	}
}
function queryOffCin(){
	if(!$.trim($("#offPn").val()) || !$.trim($("#offSn").val()))
		return false;
	$("#offPnId").val("");
	$("#offOption").hide();
	$("#offOption").next("span").text("");
	$("#selectOption").val("");
	
	var cinObject = $("#offCin");
	var idObject = $("#offId");
	getSubList(cinObject, idObject);
}

function initInstallCin(change){
	var onAcId = $.trim($("#onAcId").val());
	var onPn = $.trim($("#onPn").val());
	
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	var onACType = $("#onAcType").val();
	var on_model = $("#on_sel_model").val();
	
	if(onACType == 2 && type == 2){
		$("#onAc").nextAll('.font_red').text('');
		if(!on_model){
			$("#onAc").nextAll('.font_red').text('部件需要先匹配构型.');
			return false;
		}
	}
	
	var params = {"componentCC.onAcId" : onAcId,
					"componentCC.onPn" : onPn,
					"componentCC.ccType" : 2,
					"componentCC.onAcType" : onACType,
					"componentCC.onModel" : on_model
			};
	var actionUrl = basePath +"/component/cc_queryCinList.action";
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		data : params,
		success : function(data) {
			if(null != data){
				
				var info = JSON.parse(data);
				var configList = info.configComponentList;
				var cinChange = $("#offCin");
            	$(cinChange).empty();
//				var configs = info.configs;
				setCinSelect(configList,cinChange);
				setOnName(cinChange);
				if(_un_on_pn_sn_chg){
					clearTableData();
					_un_on_pn_sn_chg = false;
				}
				initSubCinList(info.subConfigs,$('#tab_2'));
				$(cinChange).removeClass('select_on_cin_class').addClass('select_on_cin_class');
            	$('#exists_nha').val(0);
            	if(info.existsNha){
            		$('#exists_nha').val(1);
            	}
            	hide_div_select_nha(info.existsNha,change);
			}
		},
		error : function() {
			P.$.dialog.alert('Error!');
		}
	});
}

//拆换部件的装上pn，sn修改会清空关联部件的id
$("#onPn2,#onSn2").change(function(){
	$("#onSnSelect2").hide();
	$("#onPnId2").val("");
	$("#selectOption2").val("");
	$("#onSnSelect2").next("span").text("");
});

//清空下级部件列表的数据
function clearTableData(){
	if ($("#tab_1 tr").length > 2) {
		$("#tab_1").find("tr:gt(1)").remove();
	}
	if ($("#tab_3 tr").length > 2) {
		$("#tab_3").find("tr:gt(1)").remove();
	}
	if ($("#tab_4 tr").length > 2) {
		$("#tab_4").find("tr:gt(1)").remove();
	}
}

//初始化下级部件列表
function initSubList(list){
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	if(list == null || list == undefined && list.length ==0){
		$("#tab_"+type).find(".tr_cc_subs").remove();
		return false;
	}
	
	$("#offSn").nextAll(".font_red").text("");
	var _tab = $("#tab_"+type);
	for(var i = 0; i < list.length; i++){
		var _tr = getTrHtmlBytype(list[i],type,_tab);
		if(!_tr){
			var _index = _tab.find('tr:last').find('[name$=".offPn"]').attr('name');
			if(_index){
				_index = _index.replace('].offPn','');
				_index = _index.substr(_index.indexOf('[')+1);
				_index++;
				
			}else{
				_index = i;
			}
			_tr = buildHtmlbyType(list[i],type,_index);
			_tab.append(_tr);
		}else{
			_tr.removeClass('tr_cc_subs');
		}
		
	}
	$("#tab_"+type).find(".tr_cc_subs").remove();
	$("#tab_"+type).find("img").each(
	function(){
		//没有onclick方法的img元素隐藏
		if(this.onclick == null){
			$(this).css('display','none');
		}
	}
	);
}

//是否随上级部件一起操作
function validateSubInfo(obj,index){
	var objValue = $(obj).attr("value");
	if(objValue == 'y'){
		$("input[name='tlbCompCCSubSet["+index+"].onPn']").removeAttr("readonly");
		$("input[name='tlbCompCCSubSet["+index+"].onSn']").removeAttr("readonly");
		$("input[name='tlbCompCCSubSet["+index+"].onPosition']").removeAttr("readonly");
	}else{
		$("input[name='tlbCompCCSubSet["+index+"].onPn']").removeClass('required');
		$("input[name='tlbCompCCSubSet["+index+"].onSn']").removeClass('required');
		$("input[name='tlbCompCCSubSet["+index+"].onPosition']").removeClass('required');
		$("input[name='tlbCompCCSubSet["+index+"].onPn']").removeAttr('required');
		$("input[name='tlbCompCCSubSet["+index+"].onSn']").removeAttr('required');
		$("input[name='tlbCompCCSubSet["+index+"].onPosition']").removeAttr('required');
		$("input[name='tlbCompCCSubSet["+index+"].onPn']").nextAll(".font_red").text("");
		$("input[name='tlbCompCCSubSet["+index+"].onSn']").nextAll(".font_red").text("");
		$("input[name='tlbCompCCSubSet["+index+"].onPosition']").nextAll(".font_red").text("");
		var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
		if(type != 4){
			$("input[name='tlbCompCCSubSet["+index+"].onPn']").val("");
			$("input[name='tlbCompCCSubSet["+index+"].onSn']").val("");
			$("input[name='tlbCompCCSubSet["+index+"].onPosition']").val("");
			$("input[name='tlbCompCCSubSet["+index+"].onPn']").attr("readonly","readonly");
			$("input[name='tlbCompCCSubSet["+index+"].onSn']").attr("readonly","readonly");
			$("input[name='tlbCompCCSubSet["+index+"].onPosition']").attr("readonly","readonly");
			
		}
		$("input[name='tlbCompCCSubSet["+index+"].refOnPnId']").val("");
		$("img[name='subOnSnSelect"+index+"']").hide();
		
	}
}

$("#offOption").click(function(){
	var optionImg = $(this);
	var defaultParam = {
			'pageModel.qname' : {0 : 'tail', 1 : 'status', 2 : 'pn', 3 : 'sn'},
			'pageModel.qoperator' : {0 : "equals", 1 : "equals", 2 : "notEquals", 3 : "notEquals"},
			'pageModel.qvalue' : {0 : $("#offAc").val(), 1 : 'y', 2 : "UNK", 3 : "UNK"}
		};
		if($("#offAcType").val() == 2){
			defaultParam = {
					'pageModel.qname' : {0 : 'rootId', 1 : 'status', 2 : 'pn', 3 : 'sn'},
					'pageModel.qoperator' : {0 : "equals", 1 : "equals", 2 : "notEquals", 3 : "notEquals"},
					'pageModel.qvalue' : {0 : $("#offAcId").val(), 1 : 'n', 2 : "UNK", 3 : "UNK"}
				};
		}
		//获取装上件号
		var offPn = $("input[name='tlbCompCC.offPn']").val();
		var params = {	"removeType" : 2,
						"viewName" : 'V_COMP_PNSN',
						"defaultParam": defaultParam,
						"pn":offPn};
		openOptionPage(optionImg, params);
});

$("#onOption").click(function(){
	var optionImg = $(this);
	var removeType = "00";
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	var defaultParam = {
			'pageModel.qname' : {0 : 'status', 1 : 'pn', 2 : 'sn'},
			'pageModel.qoperator' : {0 : 'equals', 1 : "notEquals", 2 : "notEquals"},
			'pageModel.qvalue' : {0 : 'n', 1 : "UNK", 2 : "UNK"}
		};
	if(type == 4){
		defaultParam = {
				'pageModel.qname' : {0 : 'tail', 1 : 'status', 2 : 'pn', 3 : 'sn'},
				'pageModel.qoperator' : {0 : "equals", 1 : "equals", 2 : "notEquals", 3 : "notEquals"},
				'pageModel.qvalue' : {0 : $("#onAc").val(), 1 : 'y', 2 : "UNK", 3 : "UNK"}
			};
		removeType = "2";
	}
	//获取装上件号
	var onPn = $("#onPn").val();
	var params = {	"removeType" : removeType,
					"viewName" : 'V_COMP_PNSN_SUB',
					"defaultParam": defaultParam,
					"pn":onPn};
	openOptionPage(optionImg, params);
});

//拆下，拆换，对串的下级拆下件可选的关联部件列表
$("img[name^='subSnSelect']").live('click',function(event){
	var defaultParam = {
			'pageModel.qname' : {0 : 'tail', 1 : 'status', 2 : 'nhaId', 3 : 'pn', 4 : 'sn'},
			'pageModel.qoperator' : {0 : "equals", 1 : "equals", 2 : "equals", 3 : "notEquals", 4 : "notEquals"},
			'pageModel.qvalue' : {0 : $("#offAc").val(), 1 : 'y', 2 : $("#offId").val(), 3 : "UNK", 4 : "UNK"}
		};
	queryRefComponentList($(this), defaultParam, 'V_COMP_PNSN_SUB');
});

//拆换的装上件可选的关联部件列表
$("#onSnSelect2").live('click',function(event){
	var optionImg = $(this);
	var defaultParam = {
			'pageModel.qname' : {0 : 'status', 1 : 'pn', 2 : 'sn'},
			'pageModel.qoperator' : {0 : "equals", 1 : "notEquals", 2 : "notEquals"},
			'pageModel.qvalue' : {0 : 'n', 1 : "UNK", 2 : "UNK"}
		};
	//获取装上件号
	var onPn = $("#onPn2").val();
	var params = {	"removeType" : "00",
			"viewName" : 'V_COMP_PNSN',
			"defaultParam": defaultParam,
			"pn":onPn};
	openOptionPage(optionImg, params);
});

$("img[name^='subSnReplace']").live('click',function(event){
	var optionImg = $(this);
	var defaultParam = {
			'pageModel.qname' : {0 : 'status', 1 : 'pn', 2 : 'sn'},
			'pageModel.qoperator' : {0 : "equals", 1 : "notEquals", 2 : "notEquals"},
			'pageModel.qvalue' : {0 : 'n', 1 : "UNK", 2 : "UNK"}
		};
	var onPn = $("#onPn").val();
	var params = {	"removeType" : "1",
			"viewName" : 'V_COMP_PNSN',
			"defaultParam": defaultParam,
			"pn":onPn};
	openOptionPage(optionImg, params);
});

//对串的下级装上件可选的关联部件列表
$("img[name^='subSnSwap']").live('click',function(event){
	var defaultParam = {
			'pageModel.qname' : {0 : 'tail', 1 : 'status', 2 : 'nhaId', 3 : 'pn', 4 : 'sn'},
			'pageModel.qoperator' : {0 : "equals", 1 : "equals", 2 : "equals", 3 : "notEquals", 4 : "notEquals"},
			'pageModel.qvalue' : {0 : $("#onAc").val(), 1 : 'y', 2 : $("#onId").val(), 3 : "UNK", 4 : "UNK"}
		};
	queryRefComponentList($(this), defaultParam, 'V_COMP_PNSN_SUB');
});

//查询可关联的部件列表
function queryRefComponentList(obj, defaultParam, viewName){
	var dlg = $(obj).sfaQueryDialog({
		dialogTitle : "Componennt List",
		dialogWidth : 1000,
		view : viewName,
		defaultParam : defaultParam,
		qcOptions :{
			qcBoxId : 'qc_box',
		    showSavedQueries : false
		},
		gridOptions :{
			gridId : 'common_list_grid',
			optsFirst : true,
			allColModels : {
				'pn' : {
					formatter : function(cellValue){return cellValue}
				},
				'sn' : {
					formatter : function(cellValue){return cellValue}
				}
			},
			jqGridSettings :{
				multiselect: false									
			},
			callback : function(rowdata, originalData) {
				$(obj).next().val(originalData.id);
				$(obj).attr("src","../images/icon_copy.png");
				var id = $(obj).attr("id");
//				if(id == 'onSnSelect' || id == 'offSnSelect'){
//					var cinObject = $("#offCin");
//					var idObject = $("#offId");
//					var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
//					if(type == 4 && id=='onSnSelect'){
//						cinObject = $("#onCin");
//						idObject = $("#onId");
//					}
//					getSubList(cinObject, idObject);
//				}
				dlg.close();
			}
		}
	});
}

function openOptionPage(optionImg, params){
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	params['_ccType'] = type;
	P.$.dialog({
		title:'Option',
		width:'400px',
		height:'200px',
		top:'15%',
		esc:true,
		cache:false,
		max: false, 
        min: false,
        lock:true,
		parent:this,
		content:'url:component/cc_option.jsp',
		data:params,
		close:function(){
			
			if(this.data["selectOption"]){
				if($(optionImg).attr("id") == 'offOption' || $(optionImg).attr("id") == 'onOption'){
					if(type == 4 && $(optionImg).attr("id") == 'onOption'){
						$("#selectOption2").val(this.data["selectOption"]);
					}else{
						$("#selectOption").val(this.data["selectOption"]);
					}
				}else if($(optionImg).attr("id") == 'onSnSelect2'){
					$("#selectOption2").val(this.data["selectOption"]);
				}else{
					$(optionImg).parent().find("input:hidden:eq(1)").val(this.data["selectOption"]);
				}
				$(optionImg).next().val("");
				$(optionImg).parent().find("input:hidden:eq(0)").val("");
				if(this.data["selectOption"] == 3 && this.data["refId"] != "" && this.data["refId"] != undefined){
					$(optionImg).parent().find("input:hidden:eq(0)").val(this.data["refId"]);
					$(optionImg).next("span").text("作为关联件处理");
					
					if($(optionImg).attr("id") == 'offOption'){
						var cinObject = $("#offCin");
						var idObject = $("#offId");
						
						if(type == 4 && id=='onSnSelect'){
							cinObject = $("#onCin");
							idObject = $("#onId");
						}
						getSubList(cinObject, idObject);
					}
					if($(optionImg).attr("id") == 'onOption'){
						var cinObject = $("#offCin");
						var idObject = $("#onId");
						getSubList(cinObject, idObject);
					}
				}else{
					if($(optionImg).attr("id") == 'offOption'){
						clearTableData();
					}
					if(this.data["selectOption"] == 1){
						$(optionImg).next("span").text("作为消耗件处理");
						if(type == 2){
							$("#offCin").empty();
			            	$("#offCin").append("<option value=''>== Please Select ==</option>");
						}
					}
					if(this.data["selectOption"] == 2){
						$(optionImg).next("span").text("作为新部件处理");
						if($("#onAcType").val() != 2 && $(optionImg).attr("id") == 'onOption'){
							var cinObject = $("#offCin");
							var idObject = $("#onId");
							getSubList(cinObject, idObject);
						}
					}
				}
			}
		}
	});
}

//P/N修改清空关联的部件id 
function pnOnchangeFun(obj){
	$(obj).parent().next().find("img").hide();
	$(obj).parent().next().find("span").text("");
	$(obj).parent().next().find("input:hidden").val("");
	
	if(obj.name.indexOf('.onPn')!=-1){
		$(obj).nextAll(".font_red").html("");
	}
	 
}

//S/N修改清空关联的部件id
function snOnchangeFun(obj){
	$(obj).parent().find("img").hide();
	//$(obj).parent().find("span").text("");
	$(obj).parent().find("input:hidden").val("");
	
	if(obj.name.indexOf('.onSn')!=-1){
		$(obj).nextAll("div.font_red").html("");
	}
}

$("#offCin").change(function(){
	if($(this).val() != ""){
		$(this).nextAll(".font_red").text("");
	}
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	if(type == 2){
		//var name = $(this).find(":selected").attr("cname");
		//$("input[name='tlbCompCC.onName']").val(name);
		setOnName(this);
		querySubCin(this,type);
		existsTheCompNha(this);
	}
});

$("#searchAc_btn1,#searchAc_btn").click(function(){
	var searchObj = $(this);
	var parameters = {
		"methodType" : "addAir",
		"checked_ids":$("#offAcId").val()
	};
	
	P.$.dialog({
		title : 'Select Aircraft or S/N for OFF ENG/APU/LG',
		width : '680px',
		height : '570px',
		top : '25%',
		esc:true,
		cache:false,
		max: false, 
		min: false,
		parent:this,
		lock:true,
		modal:true,
		content:'url:'+basePath+'/component/cc_ac.jsp?type=1',
		data : parameters,
		close:function(){
			
			if(this.data['values'] && $(searchObj).attr("id")=='searchAc_btn'){
				$("#offAcId").val(this.data['values']);
				$("#offAc").val(this.data['names']);
				$("#offAcType").val(this.data['type']);
				
				var objectValue = $.trim($("#offAc").val());
				var params = {"componentCC.offAc" : objectValue};
				validAc($("#offAc"), params);
			}
			if(this.data['values']&& $(searchObj).attr("id")=='searchAc_btn1'){
				$("#onAcId").val(this.data['values']);
				$("#onAc").val(this.data['names']);
				$("#onAcType").val(this.data['type']);
				
				var objectValue = $.trim($("#onAc").val());
				var params = {"componentCC.onAc" : objectValue};
				validAc($("#onAc"), params);
			}
		}
	});	
});


function hide_div_select_nha(exiNha,flag){
	$("#div_select_nha").hide();
	flag = flag || '';	
	if(!exiNha || flag){
		$('#cc_nhaId').val('');
		$('#cc_nhaSn').val('').hide();
		$("#div_select_nha").find('.ui-icon-pencil').show();
	}
	if(exiNha && $('#exists_nha').val() == 1){
		$("#div_select_nha").show();
		if($('#cc_nhaSn').val()){
			$("#div_select_nha").find('.ui-icon-pencil').hide();
		}
		//$('#cc_nhaSn').hide();
	}
}

function setCompNha(rowObj){
	if(!rowObj || !rowObj.id)return;
	
	$('#cc_nhaId').val(rowObj.id);
	$('#cc_nhaSn').val(rowObj.sn).show();
	$("#div_select_nha").find('.ui-icon-pencil').hide();
	
}

function existsTheCompNha(selCin){
	var onAcId = $.trim($("#onAcId").val());
	var onCin = $(selCin).val();
	var onAc = $.trim($("#onAc").val());
	if(!onAc || !onCin)return false;
	var params = {"componentCC.onAcId" : onAcId,
					"componentCC.onAc" : onAc,
					"componentCC.onCin" : onCin,
					"componentCC.ccType" : 2,
					"componentCC.onAcType" : $("#onAcType").val()
			};
	var actionUrl = basePath +"/component/cc_existsNha.action";
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		data : params,
		success : function(data) {
			if(null != data){
				var info = JSON.parse(data);
            	$('#exists_nha').val(0);
            	if(info.existsNha){
            		$('#exists_nha').val(1);
            	}
            	hide_div_select_nha(info.existsNha);
			}
		},
		error : function() {
			P.$.dialog.alert('Error!');
		}
	});
}

function editCompNha(obj, pnId){
	
	var onAcType = $("#onAcType").val();
	var onAcId = $.trim($("#onAcId").val());
	if(!onAcType || !onAcId)return P.$.dialog.alert('On/AC is null');
	
	var defaultParam = {
			'comp.status':onAcType==1?'y':'n',
			'comp.pn': $('#onPn').val(),
			'comp.nhaId': onAcId,
			'comp.cin': $('#offCin').val()
			
	};
	if(onAcType==1)
		defaultParam['comp.acId'] = onAcId;
	var dlg = $(obj).sfaQueryDialog({
		dialogTitle : "Componennt List",
		dialogWidth : 1000,
		id : "compNha_" + (new Date()).getTime(),
		button : [{
		    name: 'OK',
		    callback: function(){
		    	var sfaQuery = this.data.sfaQuery;
		    	var grid = sfaQuery.queryGrid.jqGrid; 
		    	var selectIds ;
		    	if(grid.find('tr.ui-state-highlight').length>0){
		    		selectIds = grid.find('tr.ui-state-highlight').attr('id');
		    		selectIds = sfaQuery.queryGrid.jqGrid.getRowData(selectIds)
		    	}
		    	if(!selectIds || !selectIds.id){
		    		P.$.dialog.alert("Please select one component to submit.");
		    		return false;
		    	}else{
		    		setCompNha(selectIds);
		    	}
		    }
		}],
		view : "V_COMP_PNSN_NHA",
		defaultParam : defaultParam,
		qcOptions :{
			qcBoxId : 'qc_box',
		    showSavedQueries : false
		},
		
		gridOptions :{
			gridId : 'common_list_grid',
			optsFirst : true,
			gridCols:["id","cin","name","pn","sn" ,"pn_used","sn_used","tail", "snNha","status"],
			allColModels : {
				'pn' : {
					formatter : function(cellValue){return cellValue}
				}
			},
			
			jqGridSettings :{
				multiselect: false,
				ondblClickRow : function(_id,data){
					var rowObj = $(this).jqGrid('getRowData', _id);
			    	if(!rowObj || !rowObj.id){
			    		P.$.dialog.alert("Please select one component to submit.");
			    		return false;
			    	}else{
			    		setCompNha(rowObj);
			    	}
			    	dlg.close();
				}
			}
		}
	});
}

function viewTLB(obj){
	var tlbNo = $.trim($(obj).text().substring($(obj).text().indexOf(":")+1));
	var parameters = {
			"techLog.tlbNo" : tlbNo
		};
	var actionUrl = basePath + '/tlb/tlb_techlog_view.action?techLog.tlbNo='+tlbNo;

	P.$.dialog({
		title: 'Tlb View',
		width: '1070px',
		height: '750px',
		top: '10%',
		content: 'url:' + actionUrl,
		data: parameters
	});
}

function viewNRC(obj){
	var nrcNo = $.trim($(obj).text().substring($(obj).text().indexOf(":")+1));
	var parameters = {
			"methodType":"view",
			"rowId":nrcNo
		};
	var actionUrl = basePath + "/nrc/nrc_view.action?nrcNo=" + nrcNo;
	P.$.dialog({
		title: 'View NON-ROUTINE CARD',
		width: '800px',
		height: '650px',
		top: '10%',
		esc: true,
		cache: false,
		max: false, 
        min: false,
		parent: this,
		content: "url:" + actionUrl,
		data: parameters
	});
}

function viewEO(obj){
	var mrNo = $.trim($(obj).text().substring($(obj).text().indexOf(":")+1));
	var eoNumber = mrNo.substring(0,mrNo.lastIndexOf("."));
	var revNo = mrNo.substring(mrNo.lastIndexOf(".")+2);
	if(mrNo.lastIndexOf(".") == -1){
		eoNumber = mrNo;
		revNo = "";
	}
	var parameters = {
			"methodType" : "view"
		};
	var url = basePath + '/eo/eo_management_view.action?eoNumber='+eoNumber+"&revNo="+revNo;
	P.$.dialog({
        id: "View_Eo",
        width: "1100px",
        height: "560px",
        top: '10%',
        data: parameters,
        title: "View EO Information",
        content: "url:"+url
    });
}

function viewJC(obj){
	var mrNo = $.trim($(obj).text().substring($(obj).text().indexOf(":")+1));
	var jcNumber = mrNo.substring(0,mrNo.lastIndexOf("."));
	var revNo = mrNo.substring(mrNo.lastIndexOf(".")+2);
	if(mrNo.lastIndexOf(".") == -1){
		jcNumber = mrNo;
		revNo = "";
	}
	var parameters = {
		"methodType" : "view"
	};
	var url = basePath + '/jc/jc_management_view.action?jcNo='+jcNumber+"&revNo="+revNo;
	P.$.dialog({
        id: "View_JC",
        width: "1100px",
        height: "560px",
        top: '10%',
        data: parameters,
        title: "View JC Information",
        content: "url:"+url
    });
}

function viewDefect(obj){
	var defectNo = $.trim($(obj).text().substring($(obj).text().indexOf(":")+1));
	var parameters = {
			"methodType":"view",
			"rowId":defectNo
		};
	var actionUrl = basePath + '/tlb/defect_info_view.action?defectNo='+defectNo;
	P.$.dialog({
		title:'View NON-ROUTINE CARD',
		width:'1000px',
		height:'500px',
		top:'10%',
		esc:true,
		cache:false,
		max: false, 
        min: false,
		parent:this,
		content:"url:" + actionUrl,
		data:parameters
	});
}


/**
 * 	初始化页面数据
 */
function initWebPage(){
	if($("#compDateCheckbox").is(":checked"))
	{
		$("#compDateCheckbox").val('y');
		$("#compDateDiv").hide();
		$("#compDateTimeDiv").show();
		$("#compDate").datebox({disabled: true});
		$("#compDateTime").datetimebox({disabled: false});
		$("#compDateDiv .combo-value").attr("disabled" , true);
		$("#compDateTimeDiv .combo-value").attr("disabled" , false);
	}
	else
	{
		$("#compDateCheckbox").val('n');
		$("#compDateDiv").show();
		$("#compDateTimeDiv").hide();
		$("#compDate").datebox({disabled: false});
		$("#compDateTime").datetimebox({disabled: true});
		$("#compDateDiv .combo-value").attr("disabled" , false);
		$("#compDateTimeDiv .combo-value").attr("disabled" , true);
	}
}

//选择件号
function searchPnItem(me){
	var configitemno = $("#cins").val();
	var parameters = {
			"ismultiselect" : false,
			"isRotating" : true,
			//"model":$("#model").val(),
			"configitemno":configitemno
	};
	var actionUrl = "common/select_parts_list.jsp";
	P.$.dialog({
		title : 'Part Search',
		width : '1100px',
		height : '600px',
		top : '100%',
		esc:true,
		cache:false,
		max: false, 
        min: false,
        parent:this,
        lock:true,
		close:function(){
			if(this.data.partno){
				//通过元素位置获取元素
				var inputPN = $(me).parent("td").find("input:eq(0)");
				var inputItemNum = $(me).parent("td").find("input:eq(1)");
				$(inputPN).val(this.data.partno);
				$(inputItemNum).val(this.data.itemnum);
				$(inputPN).trigger("change");
			}
		},
		content:'url:'+actionUrl,
		data : parameters
	});
}

