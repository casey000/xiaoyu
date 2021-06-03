//动态设置form高度, copied from tlb_view.js
$("form#tlb_signup").height($(this).height()-10);
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
	
//表单验证函数
function valid() {
	$("#tlb_found_date").nextAll("div").empty();
	$("#tlb_action_date").nextAll("div").empty();
	$("#ddi_rs_m").nextAll("div").empty();
	$(".tlb_dm").nextAll("div").empty();
	
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
		var status = $("[name='techLog.status']:checked").val();
		if (status == "CLSD" || status == "INFO") {
			$("#tlb_action_date").nextAll("div").append('<div generated="true" style="">This field is required.</div>');
			validatorC = false;
		}
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

	// 验证原因
	if ($("#tlb_s_p").is(":checked")) {
		var reasons = $("[id^=ddi_rs_]:checked");
		if (reasons.length == 0) {
			$("#ddi_rs_m").nextAll("div").append('<div generated="true" style="">Status is PEND, you must checked at least one option.</div>');
			validatorC = false;
		}
	}
	
	if ($("#tlb_s_d").is(":checked")) {
		var reasons = $("[id^=ddi_rs_]:checked");
		if (reasons.length == 0) {
			$("#ddi_rs_m").nextAll("div").append('<div generated="true" style="">Status is DFRL, you must checked at least one option.</div>');
			validatorC = false;
		}
	}
	var _cur_tail = $('#tlb_regno').val() || 'ox16';
	if (!$(".tlb_dm:checked").val() && ggy_tails.indexOf(_cur_tail) !=-1) {
		$(".tlb_dm").nextAll("div").append('<div generated="true" style="">This field is required.</div>');
		validatorC = false;
	}
	
	// 验证TLB单中必检人员和工作者不能一致
	var tlb_inspectorNo = $.trim($("#tlb_inspectorNo").val());
	var tlb_technicianFoundNo = $.trim($("#tlb_technicianFoundNo").val());
	var tlb_technicianActSignNo = $.trim($("#tlb_technicianActSignNo").val());

	if (tlb_inspectorNo != '' && tlb_technicianActSignNo != '') {
		if (tlb_inspectorNo == tlb_technicianActSignNo) {
			P.$.dialog.alert('RII Sign. and Taken Action Sign. should not the same person.');
			return false;
		}
	}

	// 缺件信息中的需求日期大于等于录入者填写的Datetime
/*	var tlb_requireDate = $("[name='shorts.requireDate']");
	var tlb_found_date = $.trim($("#tlb_found_date").datetimebox("getValue"));
	if (tlb_found_date != '') {
		$.each(tlb_requireDate, function(i, rdt) {
			if ($(rdt).hasClass("combo-value") && $.trim($(rdt).val()) != '') {
				if ($.trim($(rdt).val()) < tlb_found_date.substring(0, 10)) {
					var msg = "shortageInfo's Require Date " + $(rdt).val() + " should be after or equal DateTime " + tlb_found_date;
					P.$.dialog.alert(msg);
					return false;
				}
			}
		});
	}*/
	
	var flag=true;
	// 缺件信息中的需求日期大于等于当前时间
	var tlb_requireDate = $("[name='shorts.requireDate']");
	var nowDate = getNowFormatDate();
	$.each(tlb_requireDate, function(i, rdt) {
		if ($(rdt).hasClass("combo-value") && $.trim($(rdt).val()) != '') {
			if ($.trim($(rdt).val()) < nowDate.substring(0, 10)) {
				var msg = " REQUIRED DATE No less than today";
				P.$.dialog.alert(msg);
				flag=false;
				return false;
			}
		}
	});
	
	var tlb_pnShortageQty = $("[name='shorts.pnShortageQty']");
	$.each(tlb_pnShortageQty, function(i, rdt) {
		if(i>0){
			if ($.trim($(rdt).val()) <= 0) {
				var msg = "Qty must be greater than 0";
				P.$.dialog.alert(msg);
				flag=false;
				return false;
			}
		}
	});
	
	// 验证表单
	var validator = $("#tlb_signup").valid();
	if (!validator || !validatorC) {
		return false;
	}
	
	if(!flag){
		return false;
	}
	
	return true;
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

// 状态变更
function chgStatus() {
	// 2013-10-22 modify start
	if ($("#tlb_s_p").is(":checked") || $("#tlb_s_d").is(":checked")) {
		$("#lake_required").show();
	} else {
		$("#lake_required").hide();
	}
	// end
	var arr = [ "techLog.takenActionChn", "techLog.takenActionEng", "techLog.staAction", "techLog.dateAction", "techLog.manHours", "techLog.technicianActSign", "techLog.technicianActNo" ];

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

// 必检标志
function chgRii() {
	var arr = [ "techLog.inspector", "techLog.inspectorNo" ];
	if ($("#tlb_rii").is(":checked")) {
		showOrHideRequired(arr, true);
	} else {
		showOrHideRequired(arr, false);
	}
}

// ccInfo type
function chgCcInfo(tr) {
	if (tr == null) {
		$.each($(".tlb_cc_item"), function(i, tr) {
			chgCcInfo($(tr));
		});
		return;
	}

	var arrRemove = [ "items.pnOff", "items.snOff"];
	var arrInstall = [ "items.pnOn", "items.snOn"];
	var arrairMaterialState = ["items.airMaterialState"];

	var type = tr.find("[name='items.type']").val();
	if (type == "Replace") {
		showOrHideRequired(arrRemove, true, tr);
		showOrHideRequired(arrInstall, true, tr);
		showOrHideRequired(arrairMaterialState, true, tr);
		showOrDisable(arrRemove, true, tr);
		showOrDisable(arrInstall, true, tr);
		showOrDisable(arrairMaterialState, true, tr);
	} else if (type == "Remove") {
		showOrHideRequired(arrRemove, true, tr);
		showOrHideRequired(arrInstall, false, tr);
		showOrHideRequired(arrairMaterialState, true, tr);
		showOrDisable(arrRemove, true, tr);
		showOrDisable(arrInstall, false, tr);
		showOrDisable(arrairMaterialState, true, tr);
	} else if (type == "Install") {
		showOrHideRequired(arrInstall, true, tr);
		showOrHideRequired(arrRemove, false, tr);
		showOrHideRequired(arrairMaterialState, false, tr);
		showOrDisable(arrInstall, true, tr);
		showOrDisable(arrRemove, false, tr);
		showOrDisable(arrairMaterialState, false, tr);
	} else if (type == "SWAP") {
		showOrHideRequired(arrRemove, true, tr);
		showOrHideRequired(arrInstall, true, tr);
		showOrHideRequired(arrairMaterialState, false, tr);
		showOrDisable(arrRemove, true, tr);
		showOrDisable(arrInstall, true, tr);
		showOrDisable(arrairMaterialState, false, tr);
	}
}

// shotage info
function chgShortInfo(tr) {
	if (tr == null) {
		$.each($(".tlb_short_item"), function(i, tr) {
			chgShortInfo($(tr));
		});
		return;
	}

	var type = tr.find("[name='shorts.type']").val();
	if (type == "M") {
		//tr.find("[name='shorts.pnShortage']").attr('readonly',"readonly");

		tr.find("[name^='search_partNo_']").show();
		
		/*tr.find("[name='shorts.isAog']").attr("disabled", false);*/
		
		tr.find("[name='shorts.unit'].unittr").attr("disabled","disabled");
		tr.find("[name='shorts.unit'].unittr").hide();
		
	
		
		tr.find("[name='shorts.unit'].unitmr").removeAttr("disabled");
		tr.find("[name='shorts.unit'].unitmr").show();
		
	} else if (type == "T") {
		
		//tr.find("[name='shorts.pnShortage']").removeAttr("readonly")
		
		tr.find("[name^='search_partNo_']").hide();
		
		tr.find("[name='shorts.unit'].unittr").removeAttr("disabled");
		//tr.find("img[name^=search_partNo]").removeAttr("disabled");
		
/*		tr.find("[name='shorts.isAog']").attr("disabled", true);
		tr.find("[name='shorts.isAog']").attr("checked", false);*/
		
		tr.find("[name='shorts.unit'].unitmr").attr("disabled","disabled");
		tr.find("[name='shorts.unit'].unitmr").hide();
		
		tr.find("[name='shorts.unit'].unittr").removeAttr("disabled");
		tr.find("[name='shorts.unit'].unittr").show();
	}
}

// 解决推迟
function pendingTlb() {
	var arr = [ "techLog.ctrlDocNo" ];
	if ($("#tlb_isResolveTlb").is(":checked")) {
		showOrHideRequired(arr, true);
		$("#tlb_s_p").attr("disabled", true);
		$("#tlb_s_i").attr("disabled", true);
		if (!$("#tlb_s_d").is(":checked")) {
			$("#tlb_s_c").attr("checked", true);
		}
		$("#ctrlDocType").val("TLB");
		$("#ctrlDocType").bind('change', function() {
			$("#ctrlDocType").val("TLB");
		});
	} else {
		if ($("#tlb_type_s").is(":checked")) {
			showOrHideRequired(arr, true);
		} else {
			showOrHideRequired(arr, false);
		}
		$("#tlb_s_p").attr("disabled", false);
		$("#tlb_s_i").attr("disabled", false);
		$("#ctrlDocType").unbind('change');
		
		ctrlDocTypeBindChangeEvt();
	}
}

//控制文件号录入为TLB类，弹出提醒“是否勾选Resolve Pending TLB
function ctrlDocTypeBindChangeEvt(){
	$("#ctrlDocType").change(function(){
		$("#cardNo").val("");
		if($("#ctrlDocType").val() == 'TLB' && !$("#tlb_isResolveTlb").is(':checked')){			
			P.$.dialog.confirm("是否勾选Resolve Pending TLB", function(){
				$("#tlb_isResolveTlb").attr("checked","checked");
				pendingTlb();
			});
		}
		
	});
}

/**
 * 重置缺件操作列
 */
function resetShortOperRowspan(){
	$("#shortOper").attr("rowspan", $("#tlb_short_t tr").length - 1);
}

// 确认缺件
function confirmShorage() {
	P.$.dialog.confirm("No shortage Info! Are you sure to save?", submitForm);
}

// 提交表单
function submitForm() {
	var ccInof = getItems("tlb_pn_t", "tlb_cc_item", "items.");
	var shortInof = getItems("tlb_short_t", "tlb_short_item", "shorts.");

	// 获取表单数据
	var params = {};
	var array = $("#tlb_signup").serializeArray();
	$.each(array, function(i, obj) {
		if (!/^(items.)|(shorts.)/.test(obj.name)) {
			params[obj.name] = $.trim(obj.value);
		}
		if(obj.name == "techLog.engineType"){
			params[obj.name] = $("#engs").val().join(",");			
		}
		if(obj.name == "techLog.reviewType"){
			params[obj.name] = $("#reviewType").val().join(",");			
		}
	});

	// 参数
	$.each(ccInof, function(i, info) {
		$.each(info, function(key, value) {
			key = key.replace("items", "items[" + i + "]");
			params[key] = $.trim(value);
		});
	});

	$.each(shortInof, function(i, info) {
		$.each(info, function(key, value) {
			key = key.replace("shorts", "shorts[" + i + "]");
			//alert("key:"+key+"--value:"+value);
			params[key] = $.trim(value);
		});
	});
	
	var actionUrl = $("#tlb_signup").attr("action");
 
	$("#tlb_save_btn").attr("disabled", true);
	$.ajax({
		url : actionUrl,
		data : params,
		dataType : "json",
		type : 'POST',
		cache : false,
		
		success : function(obj, textStatus) {
			var data = JSON.parse(obj);
			$("#tlb_save_btn").removeAttr("disabled");
			if (data.ajaxResult == "success") {
				var msg = 'Save success! ';
				if($("#tlb_s_d").is(":checked")){
					msg += "The status of TLB is DFRL, Please to DD after save success.";
				}else if($("#tlb_s_c").is(":checked") || $("#tlb_s_i").is(":checked")){
					msg += "The status of TLB is CLSD or INFO, Please close TLB after save success.";
				} 
				P.$.dialog.alert(msg, function() {
					location = basePath + "/tlb/tlb_techlog_view.action?techLog.tlbNo=" + $("#tlb_tlbno").val();
				});
			} else {
				if (data.message != null && data.message != "") {
					P.$.dialog.alert(data.message);
				}

				var errors = data.validateErrors;

				if (errors == null) {
					return;
				}

				// 错误提示
				$.each(errors, function(key, v) {
					var currElem = $("input[name='techLog." + v.element + "']");
					var msg = v.message;
					var td = $(currElem).closest("td");
					td.find('.errorMessage').html('<div generated="true" class="error" style="">' + v.message  + '</div>'); // 错误信息
					td.find('.errorMessage').css("color", "red");
				});
			}
		}
	});
}


function validatePN(){
	
	var flag = true;
	
	var objArry = $("[name='shorts.pnShortage']");

	
	if(objArry)
	{
		
		$(objArry).each(function(index,pn_input){
			
			if(index > 0){
					
					var pn_value = $(pn_input).val();
					
					var _flag = /^[A-Z0-9]+([-.#()/\\\\]?[A-Z0-9]+)*[A-Z0-9]?$/.test(pn_value);
					
					if(!_flag){
						
						$(pn_input).css("border-color","red");
						
						flag = false;
						
					}else{
						
						$(pn_input).removeAttr("style");
					}

			}
			
		});
	}
	
	if(!flag){
		
		alert(getMsg());
		
		return false;
	}
	
	return true;
}

function getMsg(){
	
	var msg = "您录入的航材件号不符合新的件号标准，请修改红色框框中录入的件号! \r\n\r\n";
	
	msg = msg+"新件号规则如下:\r\n";
	
	msg = msg+"1）大写英文字母(半角) A-Z\r\n";
	
	msg = msg+"2）阿拉伯数字(半角) 0-9\r\n";
	
	msg = msg+"3）英文中横线(半角) -\r\n";
	
	msg = msg+"4）英文小数点(半角) .\r\n";
	
	msg = msg+"5）英文井号(半角) #\r\n";
	
	msg = msg+"6）英文圆括号(半角) ( )\r\n";
	
	msg = msg+"7）英文正斜杠(半角) /\r\n";
	
	msg = msg+"8）英文反斜杠(半角) \\\r\n";
	
	msg = msg+"注：除了以上8类符号外，中文、&、*、？、%等其它的符号一律不允许。\r\n并且-.#()/\只能出现在字母或数字之间，不能出现在件号开头或结尾! ";
	
	return msg;
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
		width: "900px",
		height: "500px",
		top: "15%",
		esc:true,
		content : 'url:' + actionUrl,
		data : params
	});
}

function selectInspectorCallback(obj){
	$("[name='techLog.inspector']").val(obj.name);
	$("[name='techLog.inspectorNo']").val(obj.sn);
}

function selectTechnicianFoundCallback(obj){
	$("[name='techLog.technicianFound']").val(obj.name);
	$("[name='techLog.technicianFoundNo']").val(obj.sn);
}

function selectTechnicianActSignCallback(obj){
	$("[name='techLog.technicianActSign']").val(obj.name);
	$("[name='techLog.technicianActNo']").val(obj.sn);
}

/**
 * 需求日期
 * @param $tr
 */
function initDateChk($tr){
	//日期选择框处理
	$.each($tr.find(".dateChk"), function(i, ele){
		var ipt = $(ele).closest("td").find("input[type='text']");
		var checkbox = $(this);
		var val = ipt.val();
		
		//添加datebox
		ipt.datebox({
			onSelect : function(){
				//点击选中后取消UNK选择
				checkbox.attr("checked", false);
			}
		});
		
		checkbox.data("dateId", ipt.attr("id"));
	});
	
	//点击后清空日期框日期
	$tr.find(".dateChk").click(function(){
		if($(this).is(":checked")){
			var dateId = $(this).data("dateId");
			$tr.find("#" + dateId).datebox("setValue", "");
		}
	});
	
	$.each($tr.find(".datebox").find(".combo-text"), function(i, ele){
		$(ele).attr("name", "preciseDate_" + (new Date()).getTime() + "_" + i);
		$(ele).addClass("preciseDate");
	});
}

$(function() {
	//初始化下拉多选框
	$(".multiselect").multiselect({
		noneSelectedText: "--please select--",
		checkAllText: "Check All",
		uncheckAllText: 'Uncheck All',
		selectedList:1000
	});
	$("button.ui-multiselect").width(130);

	$.each($(".tlb_short_item"), function(){
		initDateChk($(this));
	});
	
	chgStatus();
	chgRii();
	chgCcInfo();
	chgShortInfo();
	pendingTlb();
	resetShortOperRowspan();
	
	/**
	 * 初始下拉列表多选数据的JS
	 */
	$("#engs").multiselect({
		minwidth:130,
		noneSelectedText: "--Please Select--",
		checkAllText: "Check All",
		uncheckAllText: 'Uncheck All',
		selectedList:1000

	});
	$("button.ui-multiselect").width("87%");
	
	// 日期格式化后首位有空格，这里使用js去掉空格
	$("#tlb_found_date,#tlb_action_date").each(function() {
		$(this).val($.trim($(this).val()));
	});

	$('#tlb_found_date').datetimebox({});
	$('#tlb_action_date').datetimebox({});

	// 表单增加验证
	addValid($("#tlb_signup"));

	// 推迟解决联动
	$("[name='techLog.faultType']").click(function() {
		pendingTlb();
	});

	// 类型联动
	$("#tlb_isResolveTlb").click(function() {
		pendingTlb();
	});

	// 状态变更
	$("[name='techLog.status']").click(function() {
		chgStatus();
	});

	// 必检标志
	$("#tlb_rii").click(function() {
		chgRii();
	});

	// ccInfo类型事件
	$("[name='items.type']").click(function() {
		chgCcInfo($(this).parentsUntil("tr").last().parent());
	});

	// shortInfo类型事件
	$("[name='shorts.type']").click(function() {
		chgShortInfo($(this).parentsUntil("tr").last().parent());
	});
	
	/**
	 * 件序号转大写事件
	 * @returns
	 */
	$("td").on("keyup","input[name='items.pnOff'],input[name='items.snOff'],input[name='items.pnOn'],input[name='items.snOn']",function(){
		var thisVal = $(this).attr("value");
		$(this).val(thisVal.toUpperCase());
	});

	//动态添加选择用户
	var $inspector = $("[name='techLog.inspector']");
	var $inspectorNo = $("[name='techLog.inspectorNo']");
	selectUserInit($inspector, $inspectorNo, true, selectInspectorCallback);
	
	var $technicianFound = $("[name='techLog.technicianFound']");
	var $technicianFoundNo = $("[name='techLog.technicianFoundNo']");
	selectUserInit($technicianFound, $technicianFoundNo, true, selectTechnicianFoundCallback);
	
	var $technicianActSign = $("[name='techLog.technicianActSign']");
	var $technicianActNo = $("[name='techLog.technicianActNo']");
	selectUserInit($technicianActSign, $technicianActNo, true, selectTechnicianActSignCallback);
	
	
	$("[name='shorts.position']").live('blur',function(event){
		var _val = $(this).attr('value');
		$(this).attr('value',$.trim(_val));
		valiStationRule(this,"three");		
	});
	var valiEles = {"shorts.position":"upperCase"};
	// 增加一些自定义校验---验证输入转大写
	$('#tlb_signup').find(':text').live('change',function(){
		// 大写控制
		if(valiEles[this.name]){	
			this.value = this.value.toUpperCase();
		}
	}); 
	

	// 飞机号选择器
	$("#tlb_regno_seach_btn").click(function() {
		var dlg = $(this).sfaQueryDialog({
			dialogId : "tail_dlg",
			dialogTitle : "Aircraft Query",
			view : "D_MINI_SPEC_BASE",
			dialogWidth : 1000,
			qcOptions :{
				qcBoxId : 'qc_box',
				showSavedQueries : false
			},
			gridOptions : {
				callback : function(rowdata, originalData) {
					$("#tlb_ata").val("");
					$("#tlb_regno").val( rowdata.tail);
					$("#acid").val( rowdata.acId);
					$("#id_tlb_dm").hide();
					if (ggy_tails.indexOf(rowdata.tail) !=-1) {
						$("#id_tlb_dm").show();
					}
					dlg.close();
				}
			}
		});	
	});

	/**校验唯一性*/
	function valiStationRule(ele,type){
		
		var inp = $(ele);
		var stationType=type;
		if(!inp.attr('value')){
		$(inp).closest('td').find('div.unierror').remove();
		  return false;
		}
		
		var params = {
			"stationId":inp.attr('value'),
			"stationType":stationType
		};
		params = eval(params);
		
		var actionUrl = basePath + "/tbm/tbm_sta_valiRules.action";
		$.ajax({
		url: actionUrl,
		type : 'post',
		cache: false,
		dataType: "json",
		data:params,
		success: function(data) {
			$(inp).closest('td').find('div.unierror').remove();
			data = JSON.parse(data);
			if(data.message == "this field exists!"){		
				// 校验通过
				return true;
			}else{
				var errorDiv = '<div generated="true"  class="unierror" style="">station is not exists</div>';
				$(inp).closest('td').append(errorDiv);
				return false;
			}
		}
		});
	}
	
	function showMenu(input,contentId) {
		var cityObj;
		if(typeof(input)=='string'){
			cityObj = $("#"+input);
		}else{
			cityObj = $(input);
		}
		var cityOffset = cityObj.offset();
		$("#"+contentId).css({
			left : cityOffset.left + "px",
			top : cityOffset.top + cityObj.outerHeight()+1 + "px"
		}).slideDown("fast");

		$("body").bind("mousedown", function(event){
			if (!(event.target.id == "menuBtn" || event.target.id == input || event.target == input 
				|| event.target.id == contentId || $(event.target).parents(
				"#"+contentId).length > 0)) {
				$("#"+contentId).fadeOut("fast");
			}
		});
	}

	function getSettingForAta(contentUlId,inputId) {
		return {
			check : {
				enable : true,
				chkStyle: "radio",
				radioType: "all"
			},
			view : {
				dblClickExpand : false
			},
			data : {
				simpleData : {
					enable : true
				}
			},
			callback : {
				onCheck : function() {
					var zTree = $.fn.zTree.getZTreeObj(contentUlId)
					var nodes = zTree.getCheckedNodes(true)
					var v = "";
					for ( var i = 0, l = nodes.length; i < l; i++) {
						v += (nodes[i].value||nodes[i].id) + ",";
					}
					if (v.length > 0)
						v = v.substring(0, v.length - 1);
					var cityObj = $("#"+inputId);
					cityObj.attr("value", v);
					
					if(v){
						if(cityObj.parent().find('div.error').length > 0)
							cityObj.parent().find('div.error').remove();
					}
				}
			}
		};
	}
	// 航段选择器
	$("#tlb_flbno_seach_btn").click(function() {
		var sta = $.trim($("#tlb_sta").val()).toUpperCase();
		var time = $("#tlb_found_date").datetimebox("getValue");
		var date;
		if ($.trim(time) == '') {
			date = new Date();
		} else {
			date = paserDate(time);
		}
		// date = new Date(date.getTime() + 8 * 60 * 60 * 1000);
		date = new Date(date.getTime());
		time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
		var defaultParam = {
			'pageModel.qname' : {
				0 : 'flightDate',
				1 : 'acReg',
				2 : 'checkType'
			},
			'pageModel.qoperator' : {
				0 : "le",
				1 : "equals",
				2 : "sql"
			},
			'pageModel.qvalue' : {
				0 : time,
				1 : $("#tlb_regno").val(),
				2 : "(check_type != 'Po/F' or check_type is null)"
			}
		};

		if(sta != ""){
			defaultParam['pageModel.qname'][2] =  'sta';
			defaultParam['pageModel.qoperator'][2] =  'sql';
			defaultParam['pageModel.qvalue'][2] =   "(from_station = '" + sta + "' or to_station='" + sta + "')";
		}
		
		var regno = $("#tlb_regno");
		var fltNo = $("#tlb_flt");
		var staion = $("#tlb_sta");
		var flightid = $("#flightid");
		var flightDate = $("#flightDate");
		
		var dlg = $(this).sfaQueryDialog({
			dialogId : "srh_flt_dlg",
			dialogTitle : "FLT Query",
			view : "M_FLB_FLIGHT_LOG",
			defaultParam : defaultParam,
			dialogWidth : 1000,
			qcOptions :{
				qcBoxId : 'qc_box',
				showSavedQueries : false
			},
			gridOptions : {
				callback : function(rowdata, originalData) {
					regno.val(rowdata.acReg);
					fltNo.val(originalData.flight);
					staion.val(rowdata.toStation);
					flightid.val(rowdata.flightId);
					flightDate.text("FLT. Date:" + rowdata.flightDate);
					dlg.close();
				}
			}
		});	
	});

	// 添加cc按钮
	$("#add_cc_btn").click(function() {
		var tr = $("<tr class='tlb_cc_item'></tr>");
		tr.append($("#tlb_cc_tpl").html().replace(/{idx}/g,  new Date().getTime()));

		$("#tlb_pn_t").append(tr);
		resetNo("tlb_pn_t", "tlb_itemno");

		// 删除按钮事件
		tr.find(".delete_btn").click(function() {
			tr.remove();
			resetNo("tlb_pn_t", "tlb_itemno");
		});

		// 类型改变事件(先不处理)
		tr.find("[name='items.type']").change(function() {
			chgCcInfo($(this).parentsUntil("tr").last().parent());
		});
	});

	// 添加缺件信息按钮
	$("#add_short_btn").click(function() {
		var tr = $("<tr class='tlb_short_item'></tr>");
		tr.append($("#tlb_short_tpl").html().replace(/{idx}/g, new Date().getTime()));
		$("#tlb_short_t").append(tr);
		resetNo("tlb_short_t", "tlb_itemno");

		initDateChk(tr);
		
		// 删除按钮事件
		tr.find(".delete_btn").click(function() {
			tr.remove();
			resetNo("tlb_short_t", "tlb_itemno");
		});
		
		//件号验证
		tr.find(".validpn").iptfilter();

		//tr.find("[name='shorts.pnShortage']").attr('readonly','readonly');
		
		// 类型改变事件(先不处理)
		tr.find("[name='shorts.type']").change(function() {
			chgShortInfo($(this).parentsUntil("tr").last().parent());
		});
		
		//
		resetShortOperRowspan();
	});

	// 删除按钮事件
	$(".tlb_cc_item .delete_btn").click(function() {
		var tr = $(this).parentsUntil("tr").last().parent();
		tr.remove();
		resetNo("tlb_pn_t", "tlb_itemno");
	});

	// 删除按钮事件
	$(".tlb_short_item .delete_btn").click(function() {
		var tr = $(this).parentsUntil("tr").last().parent();
		tr.remove();
		resetNo("tlb_short_t", "tlb_itemno");
		resetShortOperRowspan();
	});

	// reset
	$("#tlb_reset_btn").click(function() {
		$("input,textarea").not("[type='radio'],[type='button']").val('');
	});

	// cancel
	$("#tlb_cancel_btn").click(function() {
		if ($("#tlb_tlbId").val() != null && $("#tlb_tlbId").val() != '') {
			location = "tlb_techlog_view.action?techLog.tlbId=" + $("#tlb_tlbId").val();
		} else {
			location = "tlb_techlog_view.action";
		}
	});

	// REQUIRE DATE在当前日期三天以后，勾选AOG时，系统需弹出提示：REQUIRE DATE需要在三天以内才可勾选
	// 必须用live，因为页面加载的时候还不存在aog，add之后才出现
/*	$("[name='shorts.isAog']").live("click", function() {
		var ck = $(this).attr("checked");
		if (ck == 'checked') {
			var rd = $(this).closest('tr.tlb_short_item').find('.combo-value');

			if ($.trim(rd.val()) != ''){
				var curDate = new Date();
				var sd = rd.val().split('-');
				var date = new Date(sd[0], sd[1] - 1, sd[2]);// IE必须用此方式
				curDate = new Date(curDate.getTime() + 72 * 60 * 60 * 1000);

				if (date.getTime() > curDate.getTime()) {
					P.$.dialog.alert('Require Date may be later Current Date than 3 days');
				}
			}
		}
	});*/

	//控制文件号录入为TLB类，弹出提醒"是否勾选Resolve Pending TLB"
	ctrlDocTypeBindChangeEvt();
	
	// 保存按钮
	$("#tlb_save_btn").click(function() {
		var ret = true; // default=true：不重复
		var pnStr = "";
		$.each($("#mrItemTable").find("input[id^='pn_nrc']"), function(i, ele) {
			if ($(ele).val() != "") {
				pnStr += $(ele).val() + ",";
			}
		});
		if (pnStr == ",") {
			return true;
		}
		var pnArr = pnStr.split(",");
		for (var i = 0; i < pnArr.length; i++) {
			for (var j = i + 1; j < pnArr.length; j++) {
				if (pnArr[i] == pnArr[j]) {
					ret = false;
					pnStr = pnArr[i];
					break;
				}
			}
		}  
		if (!ret) {
			P.$.dialog.alert("Part No [" + pnStr + "] is repeated.");
			return false;
		}
		//
		//验证件号
		validatePN();
		
		// 验证表单
		if (!valid()) {
			return;
		}
		
		
		if($('div.unierror') && $('div.unierror').length >0 ){
			return false;
		}
		
		var ret = validateShortages();
		
		if(!ret.result){
			P.$.dialog.alert(ret.msg);
			return;
		}
		
		submitForm();
	});
	
	
	// 航站选择
	$("#tlb_station2_seach_btn").click(function() {
		var dlg = $(this).sfaQueryDialog({
			dialogId : "station_dlg",
			dialogTitle : "Station Query",
			view : "V_TBM_STA_STATION_COMMON",
			dialogWidth : 1000,
			qcOptions :{
				qcBoxId : 'qc_box',
				showSavedQueries : false
			},
			gridOptions : {
				callback : function(rowdata, originalData) {
					var val = $(rowdata.station).text();//处理HTML标签
					if(val == ''){
						val = rowdata.station;
					}
					$("#tlb_staAction").val(val);
					dlg.close();
				}
			}
		});	
	});
	
	// 航站选择
	$("#tlb_station_seach_btn").click(function() {
		var dlg = $(this).sfaQueryDialog({
			dialogId : "station_dlg",
			dialogTitle : "Station Query",
			view : "V_TBM_STA_STATION_COMMON",
			dialogWidth : 1000,
			qcOptions :{
				qcBoxId : 'qc_box',
				showSavedQueries : false
			},
			gridOptions : {
				callback : function(rowdata, originalData) {
					var val = $(rowdata.station).text();//处理HTML标签
					if(val == ''){
						val = rowdata.station;
					}
					$("#tlb_sta").val(val);
					dlg.close();
				}
			}
		});	
	});
	
	$("#tlb_sta,#tlb_staAction").blur(function(){
		var station = $.trim($(this).val());
		if(station == "" || station.length < 3){
			return;
		}
		
		var msgdiv = $(this).closest("td").find(".errorMessage");
		var id = $(this).attr("id");
		
		$.ajax({
			url: basePath + "/tlb/tlb_techlog_ajaxValidateStation.action?stationCode=" + station,
			type : 'post',
			cache: false,
			dataType: "json",
			success: function(data) {
				data = JSON.parse(data);
				if(data.ajaxResult == "success"){
					// 校验通过
					msgdiv.empty();
				}else{
					msgdiv.html('<div for="' +  id + '" generated="true" class="error" style="">The station is not exsit.</div>');
				}
			}
		});
	});
	
	
	//日期+单选框必选一个验证
	$.validator.addMethod("dateRequired", function(value, element) {
		var dateId = $(element).data("dateId");
		var date = $("#" + dateId).datebox("getValue"); 
		
		if((date == null || date == '') && !$(element).is(":checked")){
			return false;
		}
		
		 return true;   
	}, "Please select a date or check on the checkbox.");
	
	//非例行工文件下载
	function non_downLoad(ele){
		var td = $(ele).parent();
		var id = td.find(".attachmentId").val() || "";
		var name = encodeURIComponent(td.find(".fileName").text() || "");
		var path = encodeURIComponent(td.find(".filePath").val() || "");
		var url = basePath + '/attach/commonAttach_downLoad.action?id='+id + "&fileName=" + name + "&downloadfilePath=" + path;	   
		$('#file_download').attr('href',url);
		$('#file_download').get(0).click();
	}
	
	function processLogs(logId){
		var actionUrl = "tbm/tbm_flow_processLogs.action";	
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
	
	$("#ctrDocNo_seach_btn").click(searchCtrDocNo);
})

/*function search(img){
	var parameters ={};
	var actionUrl = "pnrequest/part_number_list.jsp";
	P.$.dialog({
		title : 'Part Search',
		width : '1250px',
		height : '600px',
		top : '100%',
		esc:true,
		cache:false,
		max: false, 
        min: false,
        parent:this,
        close:function(results){
			if(this.data.partno){
				var selectedIds = this.data.selectedIds;
				var partno = this.data.partno;
				var partname = this.data.chinesename;
				var partenglishname = this.data.englishname;
				var itemNum = this.data.itemnum;
				var issueUnit = this.data.issueunit;
				$(img).parents(".tlb_short_item").find("input[name='shorts.partName']").val(partname +' '+ partenglishname);
				$(img).parents(".tlb_short_item").find("input[name='shorts.pnShortage']").val(partno);
				$(img).parents(".tlb_short_item").find("input[name='shorts.itemNum']").val(itemNum);
			}
		},
		content:'url:'+actionUrl,
		data : parameters
	});
}*/
function search($search,multi){
	var parameters ={};
	if(multi !=undefined){
		var parameters = {
				"ismultiselect" : true
		};
	}
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
			if(this.data.selectedIds){
				var selectedIds = this.data.selectedIds;
				var partno = this.data.partno;
				var chinesename = this.data.chinesename;
				var englishname = this.data.englishname;
				var itemnum = this.data.itemnum;
				var issueunit = this.data.issueunit;
				var altitemnum = this.data.altitemnum=='null'?'':this.data.altitemnum;
				var name = chinesename+"/"+englishname;
				if($($search).attr("id")){
					var partnos ="";
					if(this.data.partnos){
						var _data = this.data.partnos;
						for(i=0;i<_data.length;i++){
							if(i!=_data.length-1){
								partnos +=_data[i].partno+",";
							}else{
								partnos +=_data[i].partno;
							}
						}
					}
				}else{
					$($search).closest("tr").find("input[name='shorts.pnShortage']").val(partno);
					$($search).closest("tr").find("input[name='shorts.partName']").val(name);
					$($search).closest("tr").find("input[name='shorts.itemNum']").val(itemnum);
				//
					/*$(img).parents(".tlb_short_item").find("input[name='shorts.partName']").val(name +' '+ name);
					$(img).parents(".tlb_short_item").find("input[name='shorts.pnShortage']").val(partno);
					$(img).parents(".tlb_short_item").find("input[name='shorts.itemNum']").val(itemNum);
				
					*///
				
				}
				
			}
		},
		content:'url:'+actionUrl,
		data : parameters
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
		defaultCallback(rowdata, originalData, dlg, o);
		$("#ctrlDocType").val(ctrDocType);
	});
}



/**
 * 判断缺件信息是否是编辑中
 * @returns {Boolean}
 */
function isEditingShortage(){
	var isEditShortages = false;
	var trs = $("#tlb_short_t tr.tlb_short_item");
	
	$.each(trs, function(i, tr) {
		if($(tr).find("input[name^='shorts.partName']").length > 0){
			isEditShortages = true;
			return false;
		}
	});
	return isEditShortages;
}

function validateShortages(){
	var isEditing = isEditingShortage();
	var ret = {
		result : true,
		msg : ""
	}
	
	var requireMr = $("#ddi_rs_m").is(":checked");
	var requireTr = $("#ddi_rs_t").is(":checked");
	if(isEditing){
		if (requireMr && !existShortagesWithEditing("M")){
			ret.result = false;
			ret.msg = "No Material Info";
		}
		
		if (requireTr && !existShortagesWithEditing("T")){
			ret.result = false;
			ret.msg += " No Tooling Info";
		}
	}else{
		if (requireMr && !existShortagesWithOutEditing("Material")){
			ret.result = false;
			ret.msg = "No Material Info";
		}
		
		if (requireTr && !existShortagesWithOutEditing("Tooling")){
			ret.result = false;
			ret.msg += " No Tooling Info";
		}
	}
	
	return ret;
}

function existShortagesWithEditing(type){
	var isExistShortages = false;
	var shortInof = getItems("tlb_short_t", "tlb_short_item", "shorts.");
	$.each(shortInof, function(idx, shortage){
		if(shortage["shorts.type"] == type){
			isExistShortages = true;
			return false;
		}
	});
	return isExistShortages;
}

function existShortagesWithOutEditing(type){
	var isExistShortages = false;
	var shortTypes = $(".shortageType");
	$.each(shortTypes, function(idx, shortType){
		if($.trim($(shortType).text()) == type){
			isExistShortages = true;
			return false;
		}
	});
	return isExistShortages;
}
