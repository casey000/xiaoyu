var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
sub_win.data = sub_win.data || {};

if(typeof(DateUtils) != "undefined"){
	$.extend(DateUtils,{parent_win:P}); 	
}

$(function(){
	if(s_params.reason != null && s_params.reason != "null" && s_params.reason != ""){		
		$("#reason").html(s_params.reason);
		$("#reason").closest("tr").show();
	}
	
	$("#btn_select").click(function(){
		selectUser({deptId : $("#deptId").val()});
	});
	
	$('#approval_form').validate({
		debug : true,
		onkeyup : false,
		errorElement : "div",

		errorPlacement : function(error, element) {
			error.appendTo(element.nextAll("div"));
		},

		highlight : function(element, errorClass) {
			$(element).addClass(errorClass);
		},

		success : function(label) {
			label.remove();
		}
	});
});

function viewTlbDetail(tlbId) {
	var parameters = {
		"methodType" : "view"
	};
	
	var actionUrl = 'tlb/tlb_techlog_view.action?techLog.tlbId=' + tlbId;
	P.$.dialog({
		id : 'viewPage',
		title : 'TLB Detail',
		width : '1050px',
		height : '800px',
		top : '15%',
		esc : true,
		cache : false,
		max : false,
		min : false,
		parent : this,
		content : 'url:' + actionUrl,
		data : parameters
	});
}

function viewDefectDetail(defectId) {
	var parameters = {
		"methodType" : "view"
	};
	
	var actionUrl = 'tlb/defect_info_view.action?id=' + defectId;
	P.$.dialog({
		id : 'viewPage',
		title : 'Defect Detail',
		width : '1050px',
		height : '500px',
		top : '25%',
		esc : true,
		cache : false,
		max : false,
		min : false,
		parent : this,
		content : 'url:' + actionUrl,
		data : parameters
	});
}

function viewDDDetail(ddId) {
	var parameters = {
		"methodType" : "view"
	};
	
	var actionUrl = basePath + '/tlb/tlb_ddi_signup_view.action?tlbDeferredDefect.ddId='+  ddId;
	P.$.dialog({
		id:'viewPage',
		title : 'DD Detail',
		width : '1050px',
		height : '800px',
		top : '15%',
		esc:true,
		cache:false,
		max: false, 
        min: false,
		parent:this,
		content:'url:' + actionUrl,
		data : parameters
	});
}

function approve(url, postData, needValiate, callback){
	if(needValiate == null || needValiate){
		var validator = $("#approval_form").valid();
		if (!validator) {
			return false;
		}
	}
	
	P.$.dialog.confirm("Are you sure to do?", function(){
		$('#approval_form').ajaxSubmit({
			url : url,
			type:'post',
			dataType : 'json',
			data: postData,
			cache : false,
			traditional: true,
			async:false,
            success: function (data, textStatus) {
                let msg = data.msg || '';
                if(data && data.code == 200) {
					if(callback){
						callback(data.mrNo);
					}else{
                        P.$.dialog.alert('Success!', function () {
							//sub_win.location.reload();	
							sub_win.close();
						});
					}
				}else{
					P.$.dialog.alert('Failure! '+msg);
				}
			}
		});
	});
}

function selectUser(parameters){
		var obj = P.$.dialog({
			title : 'Select Auditor',
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
				if(this.data.isOK == 1){
					$('[id^=user_name]').val(this.data.result.name);
					$('[id^=assigneeId]').val(this.data.result.id);
				}
			},
			content:'url:' + basePath + '/security/user/select_user_list.jsp',
			data : parameters
		});
}

//显示或者隐藏TR
function showGroup(groupId){	
	var allgroup = $("tr[class^=group]");
	allgroup.hide();
	var eles = allgroup.find("input,select,textarea");
	eles.attr("disabled", true);
	eles.removeClass("required");
	eles.not(".datebox-f,.combo-text,.combo-value,.datetimebox-f").hide();
	
	var gourp = $("tr.group" +  groupId);
	gourp.show();
	eles = gourp.find("input,select,textarea");
	eles.attr("disabled", false);
	
	$.each(eles, function(i, ele){
		if($(ele).parent().find(".errorMessage").size() != 0){
			$(ele).addClass("required");
		}
	});
	eles.not(".datebox-f,.combo-text,.combo-value,.datetimebox-f").show();
}

function formatterDate(date){
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = month < 10 ?("0" +  month) : month;
	date = date.getDate();
	date = date < 10 ?("0" +  date) : date;
	return year + "-" + month + "-" + date;
}




function approve4Routine(url, postData, needValiate){
	if(needValiate == null || needValiate){
		var validator = $("#approval_form").valid();
		if (!validator) {
			return false;
		}
	}
	
	P.$.dialog.confirm("Are you sure to do?", function(){
		$('#approval_form').ajaxSubmit({
			url : url,
			type:'post',
			dataType : 'json',
			data: postData,
			cache : false,
			async:false,
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				var msg = data.msg || '';
				
				if(data && data.ajaxResult && data.ajaxResult.indexOf('success')!=-1){
					var location = P.location;
					P.$.dialog.alert('Success! '+msg, function(){
						location.reload();
					});
				}
				else if(data.msg!=null && data.msg=='please input the lisence'){
					//P.$.dialog.alert(msg);
					P.$.dialog.alert(msg, function(){						
						$("#zzhm").removeAttr("disabled");
					});
				}
				else{
					P.$.dialog.alert('Failure! '+msg);
				}
			}
		});
	});
}