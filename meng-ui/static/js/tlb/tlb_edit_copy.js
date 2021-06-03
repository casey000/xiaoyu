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

	var arrRemove = [ "items.pnOff", "items.snOff" ];
	var arrInstall = [ "items.pnOn", "items.snOn" ];

	var type = tr.find("[name='items.type']").val();
	if (type == "Replace") {
		showOrHideRequired(arrRemove, true, tr);
		showOrHideRequired(arrInstall, true, tr);
		showOrDisable(arrRemove, true, tr);
		showOrDisable(arrInstall, true, tr);
	} else if (type == "Remove") {
		showOrHideRequired(arrRemove, true, tr);
		showOrHideRequired(arrInstall, false, tr);
		showOrDisable(arrRemove, true, tr);
		showOrDisable(arrInstall, false, tr);
	} else if (type == "Install") {
		showOrHideRequired(arrInstall, true, tr);
		showOrHideRequired(arrRemove, false, tr);
		showOrDisable(arrInstall, true, tr);
		showOrDisable(arrRemove, false, tr);
	} else if (type == "SWAP") {
		showOrHideRequired(arrRemove, true, tr);
		showOrHideRequired(arrInstall, true, tr);
		showOrDisable(arrRemove, true, tr);
		showOrDisable(arrInstall, true, tr);
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
	/*if (!valid()) {
		return;
	}*/
	
	var actionUrl = "tlb_techlog_update.action";
	
	//保存tlb
	saveDefect(actionUrl);
	return false;
}

function saveDefect(actionUrl){
	
	var params = $("#defect_tlb").serialize();	
	$.ajax({
		url : actionUrl,
		type:"post",
		data : params,
		dataType : "json",
		async: false,
		cache : false,
		success : function(obj, textStatus) {
			var data = JSON.parse(obj);
			if(data.ajaxResult.indexOf("success") != -1){
				P.$.dialog.alert("success");
//				P.location.reload();
				sub_win.close();
			}else {
				sub_win.button({id:'save_button', disabled:false});
				P.$.dialog.alert(data.error);
			}
		}
	});
}

$("#flt_search_btn").bind("click",function(){
	assignMCC("select", null, function(dlg){
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

//finder sign
function selectTechnicianFoundCallback(obj){
	$("[name='techLog.technicianFoundNo']").val(obj.sn);
	$("#defect_technicianFoundNo").val(obj.name+obj.sn);
}

//Rii
function selectInspectorCallback(obj){
	$("[name='techLog.inspectorNo']").val(obj.sn);
	$("[name='action.inspector']").val(obj.name);
	$("#tlb_inspector").val(obj.name+obj.sn);
}

//mech sign
function selectTechnicianActSignCallback(obj){
	$("[name='action.technicianId']").val(obj.id);
	$("#technicianId").val(obj.name+obj.sn);
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
		
	});
	
	$("#ctrDocNo_seach_btn").click(searchCtrDocNo);
	
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
	
	 
	$("button.ui-multiselect").width("87%");
	
	// 日期格式化后首位有空格，这里使用js去掉空格
	$("#tlb_found_date,#tlb_action_date").each(function() {
		$(this).val($.trim($(this).val()));
	});

	$('#tlb_found_date').datetimebox({});
	$('#tlb_action_date').datetimebox({});

	// 表单增加验证
	addValid($("#defect_tlb"));

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
	$("[name='shorts.isAog']").live("click", function() {
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
	});

	//控制文件号录入为TLB类，弹出提醒"是否勾选Resolve Pending TLB"
	ctrlDocTypeBindChangeEvt();
	
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

})


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
		docSelectCallback(rowdata, originalData, dlg, o,ctrDocType);
		$("#ctrlDocType").val(ctrDocType);
	});
}

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
	}
	dlg.close();
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
