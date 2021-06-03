var api = frameElement.api, W = api.opener;	
var s_params = api.data;
var methodType = s_params["methodType"];

// js表单验证
$("#defect_signup").validate({
	debug:true, 
    onkeyup:false, 
	errorElement :"div",
	
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

//禁用启用提交、保存按钮
function disBtn(flag) 
{
	top.$("#save_button").prop("disabled",flag);
}




//表单验证函数
function valid() {
	$("#flightDate").nextAll("div").empty();

	// 日期组件验证
	var validatorC = true;
	var actionDate = $("#flightDate").datetimebox("getValue");


	if ($.trim(actionDate) == "") {
		$("#flightDate").nextAll("div").append('<div generated="true" style="">This field is required.</div>');
		validatorC = false;
	} else {
		// 不能大于今天
		if (paserDate($.trim(actionDate)).getTime() > (new Date()).getTime()) {
			$("#flightDate").nextAll("div").append('<div generated="true" style="">Found date must before current time.</div>');
			validatorC = false;
		}

	}

	if (!validatorC) {
		return false;
	}

	return true;
}


//解析日期函数
function paserDate(dateStr){
	return new Date(dateStr);
}


function selectTechnicianFoundCallback(obj){
	$("[name='defectInfo.technicianFound']").val(obj.id);
	$("[name='defectInfo.technicianFoundNo']").val( obj.name + obj.sn);
}

//添加验证
function addValid(ele){
	ele.validate({
		debug : true,
		onkeyup : false,
		errorElement : "div",
		
		errorPlacement : function(error, element) {
			error.appendTo(element.closest("td").find("div.errorMessage"));
		},

		highlight : function(element, errorClass) {
			$(element).addClass(errorClass);
		},

		success : function(label) {
			label.remove();
		}
	});
	
	validMultiName($("#defect_signup"));
}


$(function() {
	//初始化下拉多选框
	$(".multiselect").multiselect({
		noneSelectedText: "--please select--",
		checkAllText: "Check All",
		uncheckAllText: 'Uncheck All',
		selectedList:1000
	});
	
	
	//动态添加选择用户
	var $technicianFound = $("[name='defectInfo.technicianFoundNo']");
	var $technicianFoundNo = $("[name='defectInfo.technicianFound']");
	selectUserInit($technicianFound, $technicianFoundNo, true, selectTechnicianFoundCallback);
	
	$("button.ui-multiselect").width(130);

	
	// 日期格式化后首位有空格，这里使用js去掉空格
	$("#flightDate").each(function() {
		$(this).val($.trim($(this).val()));
	});
	
	$('#flightDate').datetimebox({});
	

	// 表单增加验证
	addValid($("#defect_signup"));

	$("#defect_sta").blur(function(){
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
	$("#dmReq").hide();
})


/****
 * 新增源文件form提交
 */
function submitForm() {
	dmValid();

	// 验证表单
	var validator = $("#defect_signup").valid();
	if (!validator) {
		return false;
	}

	// 验证表单
	if (!valid()) {
		return;
	}
	//验证ata章节号
	if(!validAta()){
		return;
	}
	var actionUrl = $("#defect_signup").attr("action");

	// 保存defect
	if (methodType == "edit") {
		saveDefect(actionUrl, 2);
	} else {
		saveDefect(actionUrl, 1);
	}

	return false;
}


$("#engs").bind('change', function() {
	var eng = $("#engs").val();
	var engType;
	var engPosition
	
	if(eng==1 ){
		engPosition = "1";
	}else if (eng==2){
		engPosition = "2";
	}else if(eng==4){
		engPosition = "3";
	}else if(eng==5){
		engPosition = "4";
	}else{
		engPosition = "";
	};
	
	
	if(eng==1 || eng ==2 || eng ==4 || eng ==5){
		engType = "1";
	}else if(eng==3) {
		engType = "2";
	};
	
	var actionUrl = basePath+'/tlb/defect_info_getEngSN.action';
	var parameter = 
		{
			"acReg" : $("#acReg").val(),
			"engPosition" : engPosition,
			"engType" : engType
		};
	
	if($("#acReg").val()==""){
		$("#engs").val("");
		W.$.dialog.alert('please select acReg.');
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
/**
 * 验证章节号是否填写更合理
 */
function validAta(){
	var retValFlag = true;
	$(".checkAtaIsTrue").each(function(n,v){
		var inputAta = $(v).val();
	 	var reg = /^([0-9A-Z]|[-]){4,8}$/;
	 	if(!reg.test(inputAta)){
	 		retValFlag = false;
	 		var errorMsg = $(v).parent().find("div.errorMessage").find("div.ataHideClass").text();
	 		if(errorMsg != '' && errorMsg.indexOf("当前ATA章节号不合理.") != -1){
	 			return;
	 		}
			$(v).parent().find("div.errorMessage").append('<div class="ataHideClass" generated="true" style="">当前ATA章节号不合理.</div>');
	 	}
	});
	return retValFlag;
}
/**
 * 校验DM是否必填
 * @returns
 */
function dmValid() {
	var acReg = $("#acReg").val();
	var parameter = {
		"acReg" : acReg
	};
	if (acReg != null && acReg != "") {
		$.ajax({
			url : basePath + "tlb/defect_info_dmValid.action",
			type : "post",
			data : parameter,
			dataType : "json",
			async : false,
			cache : false,
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				if (data.ajaxResult.indexOf("success") != -1) {
					$("#dmReq").show();
					$("input[name='defectInfo.dm']").addClass("required");
					$("input[name='defectInfo.dmStatus']").val("0");
				} else {
					$("input[name='defectInfo.dm']").removeClass("required");
					$("input[name='defectInfo.dmStatus']").val("1");
				}
			}
		});
	}
}


/*
 * 保存Source
 */
function saveDefect(actionUrl,submitType){
	//提交类型
	if(submitType == 2){
		actionUrl += "?submitType=2";
	}else{
		actionUrl += "?submitType=1";
	}
	if(!checkAttachmentNameHasExists()){
		W.$.dialog.alert("上传的附件中包含有重复的文件名!");
  		disBtn(false);
  		$.loaded();
  		return false;
	}
	
	$("#t_acReg").val($("#acReg").val());
	$("#t_flightDate").val($.trim($("#flightDate").datetimebox("getValue")));
	$("#t_flight").val($("#flightNo").val());
	$("#t_station").val($("#station").val());
	$("#t_lineJobId").val($("#lineJobId").val())
	
	$("#defect_signup").ajaxSubmit({
		url : actionUrl,
		contentType:'multipart/form-data',
		cache : false,
		type: "post",
		success : function(obj, textStatus) {
			var data = JSON.parse(obj.replace(/<.*?>/ig,""));
			if(typeof data=="string"){
				var data = JSON.parse(data);
			}
			if (data.ajaxResult == "success") {
				var msg = 'Save success! ';
				W.$.dialog.success(msg);
				sub_win.close();
			} else {
				if (data.message != null && data.message != "") {
					sub_win.button({name:'Save', disabled:false});
					W.$.dialog.alert(data.message);
				}
			}
		}
	});
}



//用于相同name标签验证(必须设置不同的id)
function validMultiName(ele){
	ele.data("validator").elements = function() {
		var validator = this;

		return $(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function() {
			if (!this.name && validator.settings.debug && window.console) {
			}
			if (!validator.objectLength($(this).rules())) {
				return false;
			}
			return true;
		});
	};
}

$("#flt_search_btn").bind("click",function(){
	assignDefect("select", null,null,null, function(dlg){
		if(dlg.data['flightDate'] == null){
			return;
		}
		$("#acReg").val(dlg.data['acReg']);
//		$("#flightDate").datebox("setValue", dlg.data['flightDate']);
		$("#flightDate").datebox("setValue", getCurrentDateStr());
		//$("#flightDate1").val(dlg.data['flightDate']);
		$("#t_jobDate").val(dlg.data['flightDate']);
		$("#station").val(dlg.data['station']);
		$("#flightId").val(dlg.data['flightId']);
		$("#checkType").val(dlg.data['checkType']);
		$("#rewiewType").val(dlg.data['checkType']);
		$("#flightNo").val(dlg.data['flightNo']);
		$("#lineJobId").val(dlg.data['lineJobId']);
		// update by chenyu to 20180620 start 选择航班时，直接带出上一航班
		getPreFlightNo(dlg);
		// update by chenyu to 20180620 end 选择航班时，直接带出上一航班
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
				$("#t_preFlight").val(data.preFlightNo);
				$("#preFlightNo").val(data.preFlightNo);
			}
		}
	});
}

function getCurrentDateStr(){
	var date = new Date();
	var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
	var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"
	+ (date.getMonth() + 1);
	var hh = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
	return date.getFullYear() + '-' + month + '-' + day + ' ' +  hh + ':' + min + ':' + sec;
};



