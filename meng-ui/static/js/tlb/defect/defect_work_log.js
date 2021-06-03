
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var message='Add Work Trouble Detail';
var type='add';
var methodType = s_params["methodType"];
var troubleId = s_params["troubleId"];
var controlBool=true;
$(function() {	
	//故障类型改变
	$("[name='defectWorkLog.defectCategory']").change(function(){
		var _this =$(this);
		var _thisValue = $(_this).attr("value");
		if(1 ==_thisValue ){
			//第一行
			$(_this).closest("td").next().find("input").removeAttr("disabled");
			//第二行
			$(_this).closest("tr").next().find("input[name='defectWorkLog.fault']").attr("disabled","disabled").removeAttr("checked");
			$(_this).closest("tr").next().find("input[name='defectWorkLog.faultOther']").attr("disabled","disabled").val("");
			//第三行
			$(_this).closest("tr").next().next().find("input[name='defectWorkLog.elcas']").attr("disabled","disabled").removeAttr("checked");
			$(_this).closest("tr").next().next().find("input[name='defectWorkLog.cockpit']").attr("disabled","disabled").removeAttr("checked");
			//第四行
			$(_this).closest("tr").next().next().next().find("input[name='defectWorkLog.inFlight']").attr("disabled","disabled").removeAttr("checked");
			//第五行
			var fiveTr = $(_this).closest("tr").next().next().next().next();
			$(fiveTr).find("select[name='defectWorkLog.underCart']").attr("disabled","disabled");
			$(fiveTr).find("select[name='defectWorkLog.flap']").attr("disabled","disabled");
			$(fiveTr).find("input[name='defectWorkLog.iceProof']").attr("disabled","disabled").removeAttr("checked");
			$(fiveTr).find("input[name='defectWorkLog.iceProof1']").attr("disabled","disabled").removeAttr("checked");
			$(fiveTr).find("input[name='defectWorkLog.iceProof2']").attr("disabled","disabled").removeAttr("checked");
			$(fiveTr).find("input[name='defectWorkLog.otherFlap']").attr("disabled","disabled").val("");
			var allSelect =$(fiveTr).find("select");
			$(allSelect).each(function(i){
				$(this).find("option:eq(0)").attr("selected","selected");
            });
			//第六行
			$(fiveTr).next().find("select,input").attr("disabled","disabled");
			$(fiveTr).next().find("input").val("");
			var sixSelect =$(fiveTr).next().find("select");
			$(sixSelect).each(function(i){
				$(this).find("option:eq(0)").attr("selected","selected");
            });
			$("[name='defectWorkLog.selectValue']").attr("disabled","disabled").val("").removeAttr("class");
			$("[name='defectWorkLog.selectValue']").closest("td").find(".td-font-red").html("");
			$("[name='defectWorkLog.selectValue']").closest("td").find(".errorMessage").html("");
		}else if(2==_thisValue){
			$(_this).closest("td").next().find("input").removeAttr("disabled");
			$(_this).closest("td").next().find("[name='defectWorkLog.faultOther']").attr("disabled","disabled");
			//第一行
			$(_this).closest("tr").prev().find("input[name='defectWorkLog.fluid']").attr("disabled","disabled").removeAttr("checked");
			//第三行
			$(_this).closest("tr").next().find("input[name='defectWorkLog.elcas']").attr("disabled","disabled").removeAttr("checked");
			$(_this).closest("tr").next().find("input[name='defectWorkLog.cockpit']").attr("disabled","disabled").removeAttr("checked");
			//第四行
			$(_this).closest("tr").next().next().find("input[name='defectWorkLog.inFlight']").attr("disabled","disabled").removeAttr("checked");
			
			//第五行
			var fiveTr = $(_this).closest("tr").next().next().next();
			$(fiveTr).find("select[name='defectWorkLog.underCart']").attr("disabled","disabled");
			$(fiveTr).find("select[name='defectWorkLog.flap']").attr("disabled","disabled");
			$(fiveTr).find("input[name='defectWorkLog.iceProof']").attr("disabled","disabled").removeAttr("checked");
			$(fiveTr).find("input[name='defectWorkLog.iceProof1']").attr("disabled","disabled").removeAttr("checked");
			$(fiveTr).find("input[name='defectWorkLog.iceProof2']").attr("disabled","disabled").removeAttr("checked");
			$(fiveTr).find("input[name='defectWorkLog.otherFlap']").attr("disabled","disabled").val("");
			var allSelect =$(fiveTr).find("select");
			$(allSelect).each(function(i){
				$(this).find("option:eq(0)").attr("selected","selected");
            });
			//第六行
			$(fiveTr).next().find("select,input").attr("disabled","disabled");
			$(fiveTr).next().find("input").val("");
			var sixSelect =$(fiveTr).next().find("select");
			$(sixSelect).each(function(i){
				$(this).find("option:eq(0)").attr("selected","selected");
            });
			$("[name='defectWorkLog.selectValue']").attr("disabled","disabled").val("").removeAttr("class");
			$("[name='defectWorkLog.selectValue']").closest("td").find(".td-font-red").html("");
			$("[name='defectWorkLog.selectValue']").closest("td").find(".errorMessage").html("");
		}else if(3==_thisValue){
			//第三行
			$(_this).closest("td").next().find("input").removeAttr("disabled");
			$(_this).closest("td").next().find("input[name='defectWorkLog.elcasDesc']").attr("disabled","disabled");
			$(_this).closest("td").next().find("input[name='defectWorkLog.cockpitDesc']").attr("disabled","disabled");
			var model = $("#model").val();
			if(null != model && model == "B737"){
				$(_this).closest("td").next().find("input[name='defectWorkLog.elcas']").attr("disabled","disabled");
			}
			//第四行
			$(_this).closest("tr").next().find("input").removeAttr("disabled").removeAttr("checked");
			//第五行
			var fiveTr = $(_this).closest("tr").next().next();
			$(fiveTr).find("input").removeAttr("disabled");
			$(fiveTr).find("input[name='defectWorkLog.otherFlap']").attr("disabled","disabled");
			$(fiveTr).find("select").removeAttr("disabled");
			var allSelect = $(fiveTr).find("select");
			$(allSelect).each(function(i){
				$(this).find("option:eq(1)").attr("selected","selected");
            });
			
			//第六行
			var sixTr =$(_this).closest("tr").next().next().next() ;
			$(sixTr).find("select").removeAttr("disabled");
			$(sixTr).find("input").removeAttr("disabled");
			$(sixTr).find("input[name='defectWorkLog.selectValue']").attr("disabled","disabled");
			var sixSelect = $(sixTr).find("select");
			$(sixSelect).each(function(i){
				$(this).find("option:eq(1)").attr("selected","selected");
            });
			//第二行
			$(_this).closest("tr").prev().find("input[name='defectWorkLog.fault']").attr("disabled","disabled").removeAttr("checked");
			$(_this).closest("tr").prev().find("input[name='defectWorkLog.faultOther']").attr("disabled","disabled").val("");
			//第一行
			$(_this).closest("tr").prev().prev().find("input[name='defectWorkLog.fluid']").attr("disabled","disabled").removeAttr("checked");
			
		}else if(4==_thisValue){
			//第四行
			$(_this).closest("tr").next().find("input").removeAttr("disabled").removeAttr("checked");
			//第五行
			$(_this).closest("tr").next().next().find("select").removeAttr("disabled");
			$(_this).closest("tr").next().next().find(":checkbox").removeAttr("disabled");
			var allSelect = $(_this).closest("tr").next().next().find("select");
			$(allSelect).each(function(i){
				$(this).find("option:eq(1)").attr("selected","selected");
            });
			//第六行
			$(_this).closest("tr").next().next().next().find("select").removeAttr("disabled");
			var sixSelect = $(_this).closest("tr").next().next().next().find("select");
			$(sixSelect).each(function(i){
				$(this).find("option:eq(1)").attr("selected","selected");
            });
			//第三行
			$(_this).closest("tr").find(":checkbox").removeAttr("disabled");
			var model = $("#model").val();
			if(null != model && model == "B737"){
				$(_this).closest("tr").find("input[name='defectWorkLog.elcas']").attr("disabled","disabled");
			}
			//第二行
			$(_this).closest("tr").prev().find("input[name='defectWorkLog.fault']").attr("disabled","disabled").removeAttr("checked");
			$(_this).closest("tr").prev().find("input[name='defectWorkLog.faultOther']").attr("disabled","disabled").val("");
			//第一行
			$(_this).closest("tr").prev().prev().find("input[name='defectWorkLog.fluid']").attr("disabled","disabled").removeAttr("checked");
			
		}
    });
	//缺陷改变
	$("[name='defectWorkLog.fault']").change(function(){
		var _this = $(this);
		var value = $(_this).attr("value");
		if( 4 ==value){
			$(_this).closest("td").find("input[name='defectWorkLog.faultOther']").removeAttr("disabled");
		}else{
			$(_this).closest("td").find("input[name='defectWorkLog.faultOther']").attr("disabled","disabled");
		}
    });
	
	//EICAS信息
	$("[name='defectWorkLog.elcas']").change(function(){
		var _this = $(this);
		var value = $(_this).attr("checked");
		if("checked" ==value){
			$(_this).closest("td").find("input[name='defectWorkLog.elcasDesc']").removeAttr("disabled");
		} else{
			$(_this).closest("td").find("input[name='defectWorkLog.elcasDesc']").attr("disabled","disabled");
		}
    });
	
	//驾驶舱效应
	$("[name='defectWorkLog.cockpit']").change(function(){
		var _this = $(this);
		var value = $(_this).attr("checked");
		if( "checked" ==value){
			$(_this).closest("td").find("input[name='defectWorkLog.cockpitDesc']").removeAttr("disabled");
		}else{
			$(_this).closest("td").find("input[name='defectWorkLog.cockpitDesc']").attr("disabled","disabled");
		}
    });
	
	
	//飞行状态改变
	$("[name='defectWorkLog.inFlight']").change(function(){
		var _this = $(this);
		var value = $(_this).attr("value");
		if(1== value || 2 ==value || 3== value || 9 ==value){
			var under = $(_this).closest("tr").next().find("select:eq(0) option:eq(2)");
			$(under).attr("selected","selected");
		}else if(5 == value || 6 == value || 7 == value){
			var under = $(_this).closest("tr").next().find("select:eq(0) option:eq(1)");
			$(under).attr("selected","selected");
		}else{
			var under = $(_this).closest("tr").next().find("select:eq(0) option:eq(0)");
			$(under).attr("selected","selected");
		}
    });
	//起落架改变
	$("select[name='defectWorkLog.underCart']").change(function(){
		var _this =$(this);
		var _thisValue = $(_this).attr("value");
		if(null == _thisValue || $.trim(_thisValue)==""){
			$(_this).find("option:eq(1)").attr("selected","selected");
		}
    });
	//襟翼改变，输入角度值
	$("[name='defectWorkLog.flap']").change(function(){
		var _this = $(this);
		var thisValue = $(_this).attr("value");
		if(2 == thisValue){
			$(_this).attr("selected","selected");
			$("input[name='defectWorkLog.otherFlap']").removeAttr("disabled");
		}else if(1 == thisValue || 3 == thisValue){
			$("input[name='defectWorkLog.otherFlap']").attr("disabled","disabled");
			$("input[name='defectWorkLog.otherFlap']").val("");
		}else{
			$(_this).find("option:eq(1)").attr("selected","selected");
		}
    });
	//发动机 
	$("[name='defectWorkLog.iceProof']").change(function(){
		var _this = $(this);
		if($(_this).attr("checked")=="checked"){
			$("[name='defectWorkLog.iceProof2']").attr("disabled","disabled");
		}else{
			var iceProof1 = $("[name='defectWorkLog.iceProof1']");
			if($(iceProof1).attr("checked") !="checked"){
				$("[name='defectWorkLog.iceProof2']").removeAttr("disabled");
			}
		}
    });
	//大翼改变
	$("[name='defectWorkLog.iceProof1']").change(function(){
		var _this = $(this);
		if($(_this).attr("checked")=="checked"){
			$("[name='defectWorkLog.iceProof2']").attr("disabled","disabled");
		}else{
			var iceProof = $("[name='defectWorkLog.iceProof']");
			if($(iceProof).attr("checked") !="checked"){
				$("[name='defectWorkLog.iceProof2']").removeAttr("disabled");
			}
		}
    });
	//未知改变
	$("[name='defectWorkLog.iceProof2']").change(function(){
		var _this = $(this);
		if($(_this).attr("checked")=="checked"){
			$("[name='defectWorkLog.iceProof']").attr("disabled","disabled");
			$("[name='defectWorkLog.iceProof1']").attr("disabled","disabled");
		}else{
			$("[name='defectWorkLog.iceProof']").removeAttr("disabled");
			$("[name='defectWorkLog.iceProof1']").removeAttr("disabled");
		}
    });
	//自动油门，速度，推力改变
	$("[name='defectWorkLog.autoSelect']").change(function(){
		var _this = $(this);
		var thisValue = $(_this).attr("value");
		if(thisValue ==1){
			$("[name='defectWorkLog.selectValue']").removeAttr("disabled");
			$("[name='defectWorkLog.selectValue']").find("option:eq(2)").attr("selected","selected");
		}else if(thisValue == 2 || thisValue ==3){
			$("[name='defectWorkLog.selectValue']").find("option:eq(1)").attr("selected","selected");
			$("[name='defectWorkLog.selectValue']").attr("disabled","disabled").val("").removeAttr("class");
		} else{
			$("[name='defectWorkLog.selectValue']").find("option:eq(1)").attr("selected","selected");
			$("[name='defectWorkLog.selectValue']").attr("disabled","disabled").val("").removeAttr("class");
		}
    });
	//自动驾驶改变
	$("[name='defectWorkLog.autoPilot']").change(function(){
		var _this =$(this);
		var thisValue = $(_this).attr("value");
		var select =$(_this).closest("tr").find("select");
		if(thisValue == 2 || thisValue ==3){
			$(select).each(function(i){
				if($(this).attr("name") !="defectWorkLog.autoPilot"){
					$(this).find("option:eq(0)").attr("selected","selected");
					$(this).attr("disabled","disabled");
				}
            });
			$(_this).closest("tr").find("input").val("").attr("disabled","disabled");
			/*$(_this).attr("selected","selected");
			$(_this).removeAttr("disabled");*/
		}else if(thisValue ==1){
			$(select).each(function(i){
				$(this).find("option:eq(1)").attr("selected","selected");
				$(this).removeAttr("disabled");
			})
		}else{
			$(select).each(function(i){
				$(this).find("option:eq(1)").attr("selected","selected");
			})
		}
    });
	
	//水平导航，垂直导航切换
	$("[name='defectWorkLog.navigate']").change(function(){
		var _this =$(this);
		var thisValue = $(_this).attr("value");
		if(thisValue != 1 && thisValue != 2){
			$(_this).find("option:eq(1)").attr("selected","selected");
		}
    });
	
	$("[name='defectWorkLog.autoYes']").change(function(){
		var _this =$(this);
		var _thisValue = $(_this).attr("value");
		var navigate = $("[name='defectWorkLog.navigate']");
		if(_thisValue ==5){
			$(navigate).attr("disabled","disabled");
			$(navigate).find("option:eq(0)").attr("selected","selected");
		}else if(_thisValue ==1 || _thisValue ==2 || _thisValue ==3 || _thisValue ==4){
			$(navigate).removeAttr("disabled");
			$(navigate).find("option:eq(1)").attr("selected","selected");
		}else{
			$(_this).find("option:eq(1)").attr("selected","selected");
		}
    });
	
	//showRelatedNo
	$("#checkboxRelateNo").change(function(){
		var _this =$(this);
		$("#defectNo").val("");
		if($(_this).attr("checked")){
			$("#showRelatedNo").attr("style","display:none");
			$("#defectNo").removeAttr("name");
			$("#defectNo").val("");
			$("#defectNoWu").attr("name","defectWorkLog.relatedDefectNo");
			$("#showRelatedNo").find("td:last").find(".errorMessage").html("");
		}else{
			$("#defectNoWu").removeAttr("name");
            $("#defectNo").attr("name", "defectWorkLog.relatedDefectNo");
			$("#showRelatedNo").removeAttr("style");
		}
    });
	$.validator.addMethod("onlyLetterAndDigit", function(value, element) {
		  var chrnum = /^([a-zA-Z]+)$/;
		  return this.optional(element) || (chrnum.test(value));  
	}, "Please enter only(A-Z, a-z) characters");
		
	$.validator.addMethod("onlyLetterAndDigitAndNum", function(value, element) {
		  var chrnum = /^([a-z0-9A-Z]+)$/;
		  return this.optional(element) || (chrnum.test(value));  
	}, "Please enter only(A-Z, a-z,0-9) characters");
	
	$("#relatedNo").change(function(){
		var _this = $(this);
		var ata =$("#defectAta").val();
		var acReg =$("#defectAcReg").val();
		
		if($(_this).attr("checked")){
			$("#relatedNoImg").attr("id","relatedNoImgRe");
//			$("#relatedNoImg").attr("disabled","disabled");
		}else{
			$("#relatedNoImg").attrRemove("id").addAttr("id","relatedNoImg");
//			$("#relatedNoImg").on("click");
			/*$(_this).parent().find("#defectNo").
			append('<img width="16" height="16" id="relatedNoImg" style="cursor:pointer;vertical-align: middle;" src="/images/ico_search_16.gif" class="search_btn_img" onclick='+'\'checkDefectNo(\"'+acReg+'\",\"'+ata+'\")\''+'/>');*/
		}

    });
	
	$('#troubleId').val(troubleId);
	
	sh();	


	$("#ctrlFileTypeId").change(sh);
	
	// 日期格式化后首位有空格，这里使用js去掉空格
	$("#troubleDateId").each(function() {
		$(this).val($.trim($(this).val()));
	});
	
	$('#troubleDateId').datebox({}); 
	
	if(methodType=='view'){
		type='view';
		$('#file_upload_edit').attr("style", "display:none");
		$('input').attr("disabled","disabled");
		$('textArea').attr("disabled","disabled");
        $('select').attr("disabled","disabled");
		
		sub_win.button( {
			name : 'Cancel'
		});	
		
	}else if(methodType=='edit'){
		$('#file_name_label').attr("style", "display:none");
		$("input[name='uploadOldAttach']").attr("disabled","disabled");
		
        
		sub_win.button({
			name : 'SaveUpdate',
			callback : function() {
				var actionUrl = basePath + "/tlb/defectWorkLog_update.action";
				var message="Edit Defect Work";
				saveForm(message,actionUrl);
				return false;
			}
		}, {
			name : 'Cancel'
		});	
	}else if(methodType=='add'){
		//$('#flag_o').attr("checked","checked");
		$('#file_name_label').attr("style", "display:none");
		$('#file_down').attr("style", "display:none");
		
        var day=new Date();
		var time=day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate();
	
		$("#troubleDateId").datebox('setValue',time);	
		
		sub_win.button({
			name : 'SaveInsert',
			callback : function() {
				var actionUrl = basePath + "/tlb/defectWorkLog_save.action";
				var message="save Defect Work";
				saveForm(message,actionUrl);
				return false;
			}
		}, {
			name : 'Cancel'
		});	
	}


	
	init_vali();

	
	// 航站选择
	$("#station_seach_btn").click(function() {
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
					$("#stationId").val(val);
					dlg.close();
				}
			}
		});	
	});
	
});	
	function sh(){
		if($("#ctrlFileTypeId").val()!=""){
			controlBool=true;
			$("#show_hide").show();	
			//$("[name='tworkDetail.ctrlFileNo']").removeAttr("disabled");
			//init_vali();
		}else{
			//$("[name='tworkDetail.ctrlFileNo']").attr("disabled","disabled");
			//$("[name='tworkDetail.ctrlFileNo']").val('');
			controlBool=false;
			$("#show_hide").hide();		
			//init_vali();
		}	
	}
	
	function non_downLoad(obj,workAttachId){
		var actionUrl = basePath + '/tlb/defectWorkLog_download.action?fileId='+workAttachId;
		$('#file_download').attr('href',actionUrl);
		document.getElementById('file_download').click();
	}
	
	function add_query_div(img_oj){
		var td_obj = $(img_oj).closest("#file_upload_edit");
		var div_obj = $(img_oj).closest("div.fileUpload_new").last().clone(true);
		div_obj.find(".doc_type").find("option").removeAttr("selected");
		div_obj.find("input").val("");
		td_obj.append(div_obj);
	}

	function del_query_div(img_oj,attachId){
		var actionUrl = basePath + "/tlb/defectWorkLog_deleteAttach.action";
		var params = {
			"selectedIds" : attachId
		};
		if (attachId != "" && attachId != null) {
			P.$.dialog.confirm('Are you sure to delete?', function() {
				$.ajax({
					url : actionUrl,
					data : params,
					dataType : "json",
					cache : false,
					
					success : function(obj, textStatus) {
						var data = JSON.parse(obj);
						if (data.ajaxResult == "success") {
							P.$.dialog.alert('Delete success.');
							$(img_oj).closest("div.fileUpload_edit").remove();	
						} else {
							P.$.dialog.alert(data.ajaxResult);
						}
					}
				})
			}, function() {
				// $.dialog.tips('执行取消操作');
			})
		} else {
			if($(img_oj).closest("#file_upload_edit").children("div.fileUpload_new").length>1){
			  $(img_oj).closest("div.fileUpload_new").remove();
			}else{
				P.$.dialog.alert("the last one can't delete");
			}
		}

	}
	

	/**添加校验规则*/
	function init_vali(){
		
		var valiEles = {"defectWorkLog.station":"upperCase"};
		$("#addForm").validate({
			debug:true,  //调试模式取消submit的默认提交功能   
		    onkeyup:false, //当键盘按键弹起时验证
			errorElement :"div",// 使用"div"标签标记错误， 默认:"label","span"默认直接在文本框右边显示 
		    rules: {//此处开始配置校验规则，下面会列出所有的校验规则 
		      	"defectWorkLog.troubleDate":{required:true},
		      	"defectWorkLog.station":{required:true,onlyLetterAndDigit:true,minlength:3,maxlength:3},
		      	"defectWorkLog.section":{required:true},
		       	/*"defectWorkLog.flag":{required:true,rangelength:[0,10]},*/
		    	//"tworkDetail.ctrlFileNo" : {onlyLetterAndDigitAndNum:true,rangelength:[0,10]},
		      	"defectWorkLog.workLog":{required:true,rangelength:[0,300]},
		    	"defectWorkLog.analysis" : {rangelength:[0,300]},
		      	"defectWorkLog.remark":{rangelength:[0,100]},
		      	"defectWorkLog.status":{required:true},
		      	"defectWorkLog.relatedDefectNo":{required:true},
		      	"defectWorkLog.ata":{required:true},
		      	"defectWorkLog.description":{required:true,rangelength:[0,300]},
		      	"defectWorkLog.profession":{required:true}
		    }, 
		 	messages:{//自定义提示信息 	
		     	"defectWorkLog.troubleDate" : {required:"This field is required."},
		     	"defectWorkLog.station":{required:"This field is required.",rangelength:"Please enter a value between {0} and {1}."},
		    	"defectWorkLog.section":{required:"This field is required."},
		     	/*"defectWorkLog.flag" : {required:"This field is required.",rangelength:"Please enter a value between {0} and {1}."},*/
		     	"defectWorkLog.ctrlFileNo" : {rangelength:"Please enter a value between {0} and {1}."},
		     	"defectWorkLog.workLog" : {required:"This field is required.",rangelength:"Please enter a value between {0} and {1}."},
		    	"defectWorkLog.analysis" : {rangelength:"Please enter a value between {0} and {1}."},
		     	"defectWorkLog.remark":	{rangelength:"Please enter a value between {0} and {1}."},
		    	"defectWorkLog.status" : {required:"This field is required."},
		     	"defectWorkLog.relatedDefectNo" : {required:"This field is required."},
		     	"defectWorkLog.ata" : {required:"This field is required."},
		     	"defectWorkLog.description" : {required:"This field is required.",rangelength:"Please enter a value between {0} and {1}."},
		     	"defectWorkLog.profession" : {required:"This field is required."}
		    },
		    errorPlacement: function(error, element) {
				error.appendTo(element.nextAll("div"));//配置错误信息  
		 	},
	 	    highlight: function(element, errorClass) {  //针对验证的表单设置高亮   
	            $(element).addClass(errorClass);   
	        }, 
		    success: function(label) {
		  	 //为了兼容IE8
		  	 label.remove();
		    }
		});

		// 增加一些自定义校验---验证输入转大写
		$('#addForm').find(':text').live('change',function(){
			// 大写控制
			if(valiEles[this.name]){	
				this.value = this.value.toUpperCase();
			}
		}); 
		
		$(':text[name^="defectWorkLog.station"]').live('blur',function(event){
			var _val = $(this).attr('value');
			$(this).attr('value',$.trim(_val));
			valiStationRule(this,"three");		
		});
		
		/*$(':text[name^="tworkDetail.ctrlFileNo"]').live('blur',function(event){
			var _val = $(this).attr('value');
			$(this).attr('value',$.trim(_val));
			var contrlType=$('#ctrlFileTypeId').val();
//			if(contrlType!=""){
//				valiRule(this,contrlType);
//			}	
		});*/
		
	}


	/**校验唯一性*/
	function valiStationRule(ele,type){
		
		var inp = $(ele);
		var stationType=type;
		if(!inp.attr('value')){
		$(inp).parents('td').find('div.unierror').remove();
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
			$(inp).parents('td').find('div.unierror').remove();
			data = JSON.parse(data);
			if(data.message == "this field exists!"){		
				// 校验通过
				return true;
			}else{
				var errorDiv = '<div generated="true"  class="unierror" style="">this station is not exists</div>';
				$(inp).parents('td').append(errorDiv);
				return false;
			}
		}
		});
	}
	
	/**校验唯一性*/
	function valiRule(ele,contrlType){
		
		var inp = $(ele);
		if(!inp.attr('value')){
		$(inp).parents('td').find('div.unierror').remove();
		  return false;
		}
		
		var params = {
			"numId":inp.attr('value'),
			"contrlType":contrlType
		};
		params = eval(params);

		var actionUrl = basePath + "/work/workTroubleDetail_valiRules.action";
		$.ajax({
		url: actionUrl,
		type : 'post',
		cache: false,
		dataType: "json",
		data:params,
		success: function(data) {
			$(inp).parents('td').find('div.unierror').remove();
			data = JSON.parse(data);
			if(data.isExists ==true){		
				// 校验通过
				return true;
			}else{
				var errorDiv = '<div generated="true"  class="unierror" style="">this '+contrlType+' is not exists</div>';
				$(inp).parents('td').append(errorDiv);
				return false;
			}
		}
		});
	}
	
	
	// 提交新增或修改航站信息	
	function saveForm(message,actionUrl) {
		
		var showFlag = $("#showFlag").val();
		if(null != showFlag && "" !=showFlag && (showFlag == 0 || showFlag == "0")){
			P.$.dialog.alert("故障监控已关闭，不能继续监控");
			return false;
		}

		var defectCategory =$("[name='defectWorkLog.defectCategory']:checked").attr("value");
		
		if(null == defectCategory || $.trim(defectCategory) ==""){
			alert("故障类型不能为空！");
			return false;
		}else if(1 == defectCategory){
			var fluid= $("[name='defectWorkLog.fluid']:checked").attr("value");
			if(null == fluid || $.trim(fluid) ==""){
				alert("选择液体渗漏，必须至少选择一项");
				return false;
			}
		}else if(2 == defectCategory){
			var fault= $("[name='defectWorkLog.fault']:checked").attr("value");
			var other = $("[name='defectWorkLog.faultOther']").val();
			if(null == fault || $.trim(fault) ==""){
				alert("选择缺陷，必须至少选择一项");
				return false;
			}else if(null != fault && $.trim(fault) !="" && $.trim(fault) ==4 && (null == other || $.trim(other)=="")){
				alert("缺陷选择其他时，必须输入详细信息！");
				return false;
			}
			
		}else if(3 == defectCategory || 4 == defectCategory){
			var flight =$("[name='defectWorkLog.inFlight']:checked").attr("value");
			var flap =$("[name='defectWorkLog.flap']").attr("value");
			if(null == flight || $.trim(flight)==""){
				alert("飞行状态必须至少选择一项！");
				return false;
			}
			if(2 == flap){
				var otherFlight = $("[name='defectWorkLog.otherFlap']").val();
				if(null == otherFlight || $.trim(otherFlight)==""){
					alert("襟翼选择放下,必须输入角度值!");
					return false;
				}
			}
			
			// update by guozhigang 默认已经为必填
//			var select =$("[name='defectWorkLog.autoSelect']select option:selected").attr("value");
//			if($.trim(select)=="2" || $.trim(select)=="3"){
//				var selectValue = $("[name='defectWorkLog.selectValue']").val();
//				if(null == selectValue || $.trim(selectValue) ==""){
//					alert("选择速度或者推力必须填写参数！");
//					return false;
//				}
//			}
			//起落架必选校验
			var underCart =$("select[name='defectWorkLog.underCart']").attr("value");
			if(underCart ==""){
				alert("起落架必须选择一项!");
				return false;
			}
		}
		
		// 去除前后空格
		$(':text').each(function(i,n){
			var n_val = $(n).attr('value');
			if(n_val){
				$(n).attr('value',$.trim(n_val));
			}	
		});

		//alert($(":input[name='defectWorkLog.status']").length); 
		
		
 		var dataInput = $("[name='defectWorkLog.troubleDate']");
		dataInput.parent().nextAll("div").text('');
	    if(!dataInput.val()){
	    	dataInput.parent().nextAll("div").append("This field is required.");
	   	} 
	    
		var validator = $("#addForm").valid();
		if(!validator){
			return false;
		}

		var flag = false;
		$.each($(".errorMessage"),function(){
			if($.trim($(this).text())){
				flag = true;
				return false;
			}	
		});

		if(flag){
			return false;
		}

		if($('div.unierror') && $('div.unierror').length >0 ){
			return false;
		}
		
		/*var dataInput = $("[name='tworkDetail.ctrlFileNo']");
		dataInput.parent().nextAll("div").text('');
	    if(controlBool==true&&dataInput.val()==''){
	    	P.$.dialog.alert("DOCUMENT No. is required.");
	    	return false;
	   	}*/
	   
 		var dataInputTime = $("[name='defectWorkLog.troubleDate']");
		if (paserDate($.trim(dataInputTime.val())).getTime() > (new Date()).getTime()) {
			dataInputTime.parent().nextAll("div").append("date must before current time.");
			return;
		}
		
		var relatedDefectNo = $("[name='defectWorkLog.relatedDefectNo']").val();
		var defectNo = $("#defect_defectNo").val();
		$(":input[name='defectWorkLog.status']").attr("disabled", false);
		if(null != relatedDefectNo && "无"!=relatedDefectNo && ""!=relatedDefectNo){
			
			if(null != defectNo && defectNo ==relatedDefectNo){
				
				alert("不能选择当前故障编号作为关联故障！");
				
				return false;
			}
			var validateUrl_ = basePath +"/tlb/defectWorkLog_checkDefectNo.action?defectNo="+relatedDefectNo;
			
			var flag = false;
			
			$.ajax({  
				
				url : validateUrl_,
				
				async :false,
				
				contentType: "application/json; charset=utf-8",
				
				dataType : "json",  
				
				cache : false,  
				
				success : function(obj, textStatus) {
					
					var data = JSON.parse(obj);
					
					if(data && data.ajaxResult.indexOf("success") !=-1){
						
						doSubmit(actionUrl);
						
					}else if(data.ajaxResult.indexOf("failure") !=-1){
						
						var message = data.message;
						
						P.$.dialog.alert(message);
					}
				}
			});
		}else{
			
			doSubmit(actionUrl);
			
		}
		
		
	}
	
	function doSubmit(actionUrl){
		$("[name='defectWorkLog.section']").removeAttr("disabled");
		sub_win.button({name:'SaveInsert', disabled:true});
		$("#addForm").ajaxSubmit({
			url : actionUrl,
			contentType:'multipart/form-data',
			type : "post",
			dataType : "json",
			cache : false,
			success : function(data, textStatus) {
				data = JSON.parse(data);
				if(data.ajaxResult== "success"){
					P.$.dialog.alert(message+' Success!');
					//s_params.parent.$("#common_list_grid").jqGrid().setGridHeight("100%");
					//s_params.parent.$("#common_list_grid").jqGrid().trigger("reloadGrid");
					sub_win.close();
				}else{
					sub_win.button({name:'SaveInsert', disabled:false});
					if(data.fileRename=="only"){
						P.$.dialog.confirm('File is exist, are you sure to overwrite the file on the server?', function() {
							$('#rename').attr('value','true');
							saveForm(message,actionUrl);
						}, function() {
					
						});	
					}else if(data.message != null || data.message != ""){
						P.$.dialog.alert("Failed,"+data.message);
					}else{
						if(data.errorIndex!=null){
							P.$.dialog.alert(message+" Failed,"+data.errorIndex[0].text);	
						}
			
					}
				}
			}
		});
	}

	//解析日期函数
	function paserDate(dateStr){
		var dateArr = null; 
		var timeArr = null;
		var arr1 = dateStr.split(" ");
		if(arr1[0] != null){
			dateArr = arr1[0].split("-");
		}
		if(arr1[1] != null){
			timeArr = arr1[1].split(":");
		}
		if(timeArr == null){
			return new Date(dateArr[0], dateArr[1] -1, dateArr[2]);
		}else {
			return new Date(dateArr[0], dateArr[1] -1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);		
		}
	}
	
	//删除航站信息
	function del(Id) {
		var actionUrl = basePath + "/tlb/defectWorkLog_delete.action";
		var params = {
			"selectedIds" : Id
		};
		if (Id != "" && Id != null) {
			P.$.dialog.confirm('Are you sure to delete?', function() {
				$.ajax({
					url : actionUrl,
					data : params,
					dataType : "json",
					cache : false,
					
					success : function(obj, textStatus) {
						var data = JSON.parse(obj);
						if (data.ajaxResult == "success") {
							P.$.dialog.alert('Delete success.');
							location.reload();
							//$("#common_list_grid").jqGrid().trigger("reloadGrid");
						} else {
							if(data.ownerUser==false){
								P.$.dialog.alert("cant not delete data,you're not owner creator!");
							}else{
								P.$.dialog.alert(data.ajaxResult);
							}		
						}
					}
				})
			}, function() {
				// $.dialog.tips('执行取消操作');
			})
		} else {
			P.$.dialog.alert("Please select records to delete");
		}
	}
	
	
	$("#relatedNoImg").click(function(){
		
		var ata =$("#defectAta").val();
		var acReg =$("#defectAcReg").val();
		var date = new Date(),s ="";
		s += date.getFullYear()+"/";
		s += (date.getMonth()+1) +"/";
		s += (date.getDate()-15);
		
		var defaultParam = {
				'pageModel.qname' : {"0" :  "acReg", "1" : "ata", "2" : "dateFound"},
				'pageModel.qoperator' : {"0" : "equals", "1" : "equals","2" : "ge"},
				'pageModel.qvalue' : {"0" : acReg,"1" : ata,"2" : s}
        };
		queryDefectDialog(defaultParam, function(rowdata, originalData, dlg){
			//故障单ID
			var defectId = originalData.id;
			//故障单编号
			var defectNo = originalData.defectNo;
			//model
			var model = originalData.model;
			//飞机编号
			var acNo = originalData.acReg;
			//ata
			var ata = originalData.ata;
			$("#defectNo").val(defectNo);
			$("#defectNo").trigger("blur");
			dlg.close();
		});

    });
	
	
	//选择关联故障编号
	function checkDefectNo(acReg,ata,creatTime) {
		var defectId = $("[name='defectWorkLog.defectId']").val();
		var date = new Date(),s ="";
        date.setDate(date.getDate() - 30);
		s += date.getFullYear()+"-";
		s += (date.getMonth()+1) +"-";
		s += date.getDate();
		s +=" 00:00:00";
		var ataStr = ata.substring(0,2);
		var excludeDefectNo = "this_.defect_no not in (select t.RELATED_DEFECT_NO from T_DEFECT_BASE_INFO t where t.RELATED_DEFECT_NO is not null and t.RELATED_DEFECT_NO !='无')";
		var defaultParam = {
				'pageModel.qname' : {"0" :  "acReg", "1" : "ata", "2" : "dateFound","3":"id","4":"creatTime","5":""},
				'pageModel.qoperator' : {"0" : "equals", "1" : "sql","2" : "ge","3":"notEquals","4":"l","5":"sql"},
				'pageModel.qvalue' : {"0" : acReg,"1" : " lower(this_.ATA) like \'"+ataStr+"%\' ","2" : s,"3" : defectId,"4" : creatTime,"5":excludeDefectNo }
        };
		queryDefectDialog(defaultParam, function(rowdata, originalData, dlg){
			//故障单ID
			var defectId = originalData.id;
			//故障单编号
			var defectNo = originalData.defectNo;
			//model
			var model = originalData.model;
			//飞机编号
			var acNo = originalData.acReg;
			//ata
			var ata = originalData.ata;
			$("#defectNo").val(defectNo);
			$("#defectNo").trigger("blur");
			dlg.close();
		});
	}
