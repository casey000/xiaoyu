var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var methodType = s_params["methodType"];
var tlbId = s_params["tlbId"];
var docType = s_params["docType"];
var docNo = s_params["docNo"];
var acId = s_params["acId"];
var acNo = s_params["acNo"];
//add by 80003187 2018-6-26 将航班号及相关信息带过来 start----
var fltId = s_params["fltId"];
var fltNo = s_params["fltNo"];
var jobId = s_params["jobId"];
//add by 80003187 2018-6-26 将航班号及相关信息带过来 end----
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
	
	$.extend(DateUtils,{parent_win:P});
	$("#compDate").datebox({
		formatter : formater,
		parser : parser
	});
	if(methodType == "add")
	{
		$("#compDate").datebox("setValue", formater(new Date()));
		changePage('ccType1');
		showTab(1);
		$("#CCExeTr").hide();
	}
	else
	{
		$("#tab_2").hide();
		if(methodType == "addExe"){
			$("#compDate").datebox("setValue", formater(new Date()));
			if($("#docType").val() == "" || $("#docType").val() == undefined){
				$("#on2_tr").hide();
				$("#on2_tr").find("input").each(function(){
					$(this).attr("disabled","disabled");
				});
				$("#off_tr").show();
				$("#on_tr").hide();
				$("#on_tr").find("input").each(function(){
					$(this).attr("disabled","disabled");
				});
			}
		}
	}
	//初始化一些参数
	initParams();
});

/**
 * 初始化一些参数
 */
function initParams(){
	$("#tlbId").val(tlbId);
	$("#docType").val(docType);
	$("#docNo").val(docNo);
	$("#offAcId").val(acId);
	$("#offAc").val(acNo);
	$("#offAcType").val("1");
	//add by 80003187 将航班信息带过来且初始化 start---
	$("#flightId").val(fltId);
	$("#jobId").val(jobId);
	$("#flightNo").val(fltNo);
	//add by 80003187 将航班信息带过来且初始化 end---
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
	changePage($("input:radio[name='tlbCompCC.ccType']:checked").attr("id"));
});

function changePage(ccType) {
	$("#flightId").val(fltId);
	$("#jobId").val(jobId);
	$("#flightNo").val(fltNo);
	//有执行文件时改变拆换类型，需保持飞机和reason信息
	var airType = $("input[name='tlbCompCC.offAcType']").val();
	var airId = $("input[name='tlbCompCC.offAcId']").val();
	var air = $("input[name='tlbCompCC.offAc']").val();
	if(airId == ""){
		airType = $("input[name='tlbCompCC.onAcType']").val();
		airId = $("input[name='tlbCompCC.onAcId']").val();
		air = $("input[name='tlbCompCC.onAc']").val();
	}
	
	//切换CC类型时,不需要清空的数组
	var filterAttrArray = new Array();
	filterAttrArray.push("tlbCompCC.ccNo");
	filterAttrArray.push("tlbCompCC.docType");
	filterAttrArray.push("tlbCompCC.docNo");
	filterAttrArray.push("tlbCompCC.referId");
	filterAttrArray.push("tlbCompCC.referNo");
	filterAttrArray.push("tlbCompCC.referType");
	filterAttrArray.push("tlbCompCC.flightId");
	filterAttrArray.push("tlbCompCC.jobId");
	filterAttrArray.push("tlbCompCC.flightNo");
	
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
	$("#remark").val("");
	$("#remark").nextAll('.font_red').text('');
	
	clearTableData();
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
		$("#off_tr").hide();
		$("#on_tr").show();
		showTab(2);
		$("#tab_2").hide();
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
}

function showTab(idx) {
	$("table[id^='tab']").each(function(){
		$(this).find("input").each(function(){
			$(this).attr("disabled","disabled");
		});
		$(this).hide();
	});
	
	$("#tab_" + idx).show();
	$("#tab_" + idx).find("input").each(function(){
		$(this).removeAttr("disabled");
	});
}

function add_p() {
	var node = $("#tab_2").find("tr").last().clone(true);
	node.find("input").val("");
	var size = $("#tab_2").find("tr").size();
	html ='<tr>'
	+'<td class="td_content">'
	+'<input type="text" name="tlbCompCCSubSet[' + (size-2) + '].name" required maxlength="100" size="40"/><div class="font_red"></div></td>'
	+'<td class="td_content">'
	+'<input type="text" name="tlbCompCCSubSet[' + (size-2) + '].onPn" required maxlength="30"/><div class="font_red"></div></td>'
	+'<td class="td_content">'
	+'<input type="text" name="tlbCompCCSubSet[' + (size-2) + '].onSn" required maxlength="30"/><div class="font_red"></div></td>'
	+'<td class="td_content">'
	+'<input type="text" name="tlbCompCCSubSet[' + (size-2) + '].onPosition" required maxlength="30"/><div class="font_red"></div></td>'
	+'<td class="td_title_c">'
	+'<img src="../../images/del.gif" id="del" onclick="del_p(this);" class="btn_img"/></td>'
	+'</tr>';
	$("#tab_2").append(html);
}

function del_p2(obj) {
	obj = obj || '';
	if(!obj || obj.length == 0)return;
	var _tab = $(obj).closest('table');
	if(!_tab || _tab.length == 0)return;
	if (_tab.find("tr").length > 3) {
		$(obj).closest('tr').remove();
	}
}

function del_p(obj) {
	if ($("#tab_2 tr").length > 3) {
		while (obj.tagName != "TR") {
			obj = obj.parentNode;
		}
		obj.parentNode.removeChild(obj);
	}
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
			submitHandler : function(form) {//如果验证通过，点击submit按钮后执行的操作,注：使用此方法后，form中的action="xx"会失效  
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

//提交新增表单信息
function saveCCForm(){
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
	sub_win.button({name:"Save",disabled:true});
	submitCCForm();
}

function submitCCForm(){
	var actionUrl = basePath + "/tlb/tlb_comp_cc_save.action";	
	var params = $("#addForm").serialize();
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		data : params,
		success : function(data) {
			sub_win.button({name:"Save",disabled:false});
			sub_win.data['reload'] = 1;
			P.$.dialog.success("Save successfully!",function(){
				sub_win.close();	
			});		
			return false;
		}
	});
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

var offExistFlag = true;
var onExistFlag = true;

//验证A/C:飞机或离线三大件
function validAc(obj, params){
	var objId = $(obj).attr("id");
	var objectValue = $.trim($(obj).val()); 
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	$('#on_tr_model').hide();
	if(objectValue != ""){
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
						if(info.offExistFlag){
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
					if(objId == "onAc"){
						onExistFlag = info.onExistFlag;
						if(info.onExistFlag){
							$("#onAcId").val(info.onAcId);
							$("#onAcType").val(info.onAcType);
							$("#onAc").nextAll('.font_red').text('');
							if(type == 2 && info.onAcType == 2){
								if(info.acConfigs){
									setAcModelSelect(info.acConfigs,$('#on_sel_model'));
									$('#on_tr_model').show();
								}else{
									$("#onAc").nextAll('.font_red').text('部件需要先匹配构型.');
								}
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
					$("#offPn").change();
				}
			}
		});
	}
	else{
		$(obj).nextAll('.font_red').children("span").text('');
	}
	if($(obj).attr("id")=="offAc"){
		$("#flightId,#flightNo").val('');
		$("#flightId,#flightNo").nextAll('.font_red').text('');
	}
	if($(obj).attr("id")=="onAc"){
		var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
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


$("#offAc").change(function(){
	var objectValue = $.trim($(this).val());
	var params = {"componentCC.offAc" : objectValue};
	validAc($(this), params);
});

$("#onAc").change(function(){
	var objectValue = $.trim($(this).val());
	var params = {"componentCC.onAc" : objectValue};
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


//获得下级部件列表
var subComponentList;
$("#offPn,#offSn,#onPn,#onSn").change(function(){
	var offAc = $.trim($("#offAc").val());
	var offPn = $.trim($("#offPn").val());
	var offSn = $.trim($("#offSn").val());
	var offAcId = $.trim($("#offAcId").val());
	var onAc = $.trim($("#onAc").val());
	var onPn = $.trim($("#onPn").val());
	var onSn = $.trim($("#onSn").val());
	var onAcId = $.trim($("#onAcId").val());
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
	
	var params = {"componentCC.offAc" : offAc, 
			"componentCC.offPn" : offPn, 
			"componentCC.offSn" : offSn, 
			"componentCC.offAcId" : offAcId,
			"componentCC.onAc" : onAc, 
			"componentCC.onPn" : onPn, 
			"componentCC.onSn" : onSn, 
			"componentCC.onAcId" : onAcId,
			"componentCC.ccType" : type,
			"componentCC.onAcType" : onACType,
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
			if(null != data){
				clearTableData();
				var cinObject = $('[name="tlbCompCC.cin"]');
				cinObject.hide();
				cinObject.empty();
				var info = JSON.parse(data);
				if(info.applyFlag){
					if(type == 2){
						cinObject.show();
						var configs = info.configs;
						setCinSelect(configs,cinObject);
						setOnName(cinObject);
						/*if($("#onAcType").val()==2){
							if(pnsn.cin != null && pnsn.cin.cin != ""){
								cinObject.empty();
								var option = $("<option value='" + pnsn.cin + "'>" + pnsn.cin + "</option>");
								$(cinObject).append(option);
							}else{
								$(cinObject).append("<option value=''>== Empty ==</option>");
							}
						}else{
							for(var i = 0; i < configs.length; i++){
								var option = $("<option value='" + configs[i].cin + "' cname='"+configs[i].cname+"'>" + configs[i].cin + "</option>");
								$(cinObject).append(option);
							}
						}*/
	            		initSubCinList(info.subConfigs,$('#tab_2'));
					}
					
					subComponentList = info.subComponentList;
					if(subComponentList != undefined){
						initSubList(subComponentList);
					}
				}
			}				
		}
	});
});

//清空下级部件列表
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
	if(list == null || list == undefined && list.length ==0){
		return false;
	}
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	$("#offSn").nextAll(".font_red").text("");
	var html="";
	switch(type){
	case '1'://拆下类型的下级部件列表
		for(var i = 0; i < list.length; i++){
			html+='<tr><td class="td_content">'
				+'<input type="text" name="tlbCompCCSubSet['+i+'].name" value="'+ (list[i].name == null ? "" : list[i].name) +'" maxlength="100"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" name="tlbCompCCSubSet['+i+'].offPn" value="'+ list[i].pn +'" required maxlength="30"/>'
				+'<img class="btn_img" title="Search" src="../../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
				+'<div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" name="tlbCompCCSubSet['+i+'].offSn" value="'+ list[i].sn +'" required maxlength="30"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" name="tlbCompCCSubSet['+i+'].offPosition" value="'+ (list[i].position == null ? "" : list[i].position) +'" required maxlength="30"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="radio" name="tlbCompCCSubSet['+i+'].flag" id="yn1'+i+'" value="y" required/><label for="yn1'+ i +'" class="cp"> YES</label> '
				+'<input type="radio" name="tlbCompCCSubSet['+i+'].flag" id="yn2'+i+'" disabled="disabled" value="n" required/><label for="yn2'+ i +'" class="cp"> NO</label>'
				+'<div class="font_red"></div>'
				+'</td></tr>';
		}
		break;
	case '3'://拆换类型的下级部件列表
		for(var i = 0; i < list.length; i++){
			var ele = $('<tr><td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].name" value="'+ (list[i].name == null ? "" : list[i].name) +'" maxlength="100"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="12" name="tlbCompCCSubSet['+i+'].offPn" value="'+ list[i].pn +'" required maxlength="30"/>'
				+'<img class="btn_img" title="Search" src="../../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
				+'<div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].offSn" value="'+ list[i].sn +'" required maxlength="30"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].offPosition" value="'+ (list[i].position == null ? "" : list[i].position) +'" required maxlength="30"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="radio" onclick="validateSubInfo(this,'+i+')" name="tlbCompCCSubSet['+i+'].flag" id="yn1'+ i +'" value="y" required/><label for="yn1'+i+'" class="cp"> YES</label>'
				+'<input type="radio" onclick="validateSubInfo(this,'+i+')" name="tlbCompCCSubSet['+i+'].flag" id="yn2'+ i +'" value="n" required/><label for="yn2'+i+'" class="cp"> NO</label>'
				+'<div class="font_red"></div>'
				+'</td>'
				+'<td class="td_content">'
				+'<input type="text" size="12" name="tlbCompCCSubSet['+i+'].onPn" maxlength="30"/>'
				+'<img class="btn_img" title="Search" src="../../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
				+'<div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].onSn" maxlength="30"/><div class="font_red"></div></td>'
				+'</tr>');
			$("#tab_"+type).append(ele);
		}
		break;
	case '4'://对串类型的下级部件列表
		for(var i = 0; i < list.length; i++){
			html+='<tr>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].name" value="'+ (list[i].name == null ? "" : list[i].name) +'" maxlength="100"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="12" name="tlbCompCCSubSet['+i+'].offPn" value="'+ list[i].offPn +'" required maxlength="30"/>'
				+'<img class="btn_img" title="Search" src="../../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
				+'<div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].offSn" value="'+ list[i].offSn +'" required maxlength="30"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].offPosition" value="' + (list[i].offPosition == null ? "" : list[i].offPosition) + '" required maxlength="30"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="radio" onclick="validateSubInfo(this,'+i+')" name="tlbCompCCSubSet['+i+'].flag" id="yn1'+i+'" value="y" required/><label for="yn1'+i+'" class="cp"> YES</label>'
				+'<input type="radio" onclick="validateSubInfo(this,'+i+')" name="tlbCompCCSubSet['+i+'].flag" id="yn2'+i+'" value="n" required/><label for="yn2'+i+'" class="cp"> NO</label>'
				+'<div class="font_red"></div>'
				+'</td>'
				+'<td class="td_content">'
				+'<input type="text" size="12" name="tlbCompCCSubSet['+i+'].onPn" value="' + list[i].onPn + '" maxlength="30"/>'
				+'<img class="btn_img" title="Search" src="../../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
				+'<div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].onSn" value="' + list[i].onSn + '" maxlength="30"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].onPosition" value="' + (list[i].onPosition == null ? "" : list[i].onPosition) + '" maxlength="30"/><div class="font_red"></div></td>'
				+'</tr>';
		}
		break;
	}
	$("#tab_"+type).append(html);
}

//对下级部件列表的文本框进行校验
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
		}		
		$("input[name='tlbCompCCSubSet["+index+"].onPn']").attr("readonly","readonly");
		$("input[name='tlbCompCCSubSet["+index+"].onSn']").attr("readonly","readonly");
		$("input[name='tlbCompCCSubSet["+index+"].onPosition']").attr("readonly","readonly");
	}
}

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

