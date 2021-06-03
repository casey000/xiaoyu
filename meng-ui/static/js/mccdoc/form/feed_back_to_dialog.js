//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var _index = 0;
var index1 = 0;

sub_win.button(
		{
			name:'Submit',
			callback: function () {
				doSubmit();
				return false;
			}
		},
		{
			name:'Cancel',
			callback: function () {
				return true;
			}
		}
	);

/**
 * 提交
 * @returns {Boolean}
 */
function doSubmit(){
	if($("#add_form .errorMessage").text()){
		return false;
	}
	if(validForm()){
		return false;
	}

	if(validNum()){
        P.$.dialog.alert('请输入实际人工时！');
		return false
	}
	//进行验证看是否为DM
	var dm = $("#dmType").val();
	if(dm == 'DM' && confirm("此任务涉及双重维修限制，请确认是否已按要求执行?")){
		commitAffirm();
	}else{
		commitAffirm();
	}	
	
	
}
/**
 * 提交确认
 */
function commitAffirm(){
	P.$.dialog.confirm("确定反馈信息需要提交?",function(){
		var actionUrl = basePath + "/api/v1/mccdoc/to_base_info/feedBackSubmit";
		var message = "Success";
        var params = [];
		params.push({
			"sta":$("#sta").val(),
			"id":$("#id").val()
		});

		sub_win.button({name:'Submit', disabled:true});
		sub_win.button({name:'Cancel', disabled:true});
		var params = $("#add_form").serialize();
		// $("#add_form").ajaxSubmit({
		// 	url : actionUrl,
		// 	type: "post",
		// 	data : params,
		// 	contentType : 'application/x-www-form-urlencoded;charset=utf-8',
		// 	dataType : "json",
		// 	cache : false,
		// 	success : function(obj, textStatus) {
		// 		var data = JSON.parse(obj);
		// 		if(data.ajaxResult.indexOf("success") != -1){
		// 			P.$.dialog.alert(message,function(){
		// 				sub_win.close();
		// 			});
		// 		}else {
		// 			sub_win.button({name:'Submit', disabled:false});
		// 			sub_win.button({name:'Cancel', disabled:false});
		// 			P.$.dialog.alert(data.errorMsg);
		// 		}
		// 	}
		// });
		$.ajax({
			url: actionUrl,
			type: "post",
			data: params,
			dataType: "json",
			cache: false,
			success: function (data) {
				if (data.code == 200) {
					P.$.dialog.success(message);
					//这段代码主要是判断父窗口是否是TO List查询页面 是查询页面才刷新父窗口
					// if (P.location.pathname.indexOf("to_list") > -1) {
					// 	P.location.reload();
					// }
					sub_win.close();
				} else {
					sub_win.button({name: 'Save', disabled: false});
					sub_win.button({name: 'Submit', disabled: false});
					sub_win.button({name: 'Cancel', disabled: false});
					if (data.msg) {
						P.$.dialog.alert(data.msg);
					} else {
						P.$.dialog.alert('Add failed, please contact the administrator.');
					}
				}

			}
		});
		return true;
	});
}
/**
 * 验证Form表单
 */
function validForm(){
	var isValid = false;
	$("#add_form .error").remove();
	var errMsg = '<span class="error">This field is required.</span>';
	
	//获取Trouble-shooting下面的信息
	var troubleShooting = $("#trouble_shooting_table").find("tr:gt(1)");
	//如果存在必须要填写
	if(troubleShooting){
		$.each(troubleShooting,function(index,value){
			
			if(!$.trim($(value).find("td:eq(4)").find(":input").val())){
				$(value).find("td:eq(4)").find(":input").nextAll("div.errorMessage").append(errMsg);
				isValid = true;
			}
			
		});
	}
	
	//Feedback Requests如果选中YES就必须要上传至少一个附件
	var feedbackRequests = $("#feedbackRequests").val();
	//获取附件
	var attachment = $("#qc_table_detail").find("tr");
	if("1"==feedbackRequests){
		//必须要有至少一个飞机
		if(attachment.length<3){
			P.$.dialog.alert('必须要上传至少一个附件！');
			isValid = true;
		}
	}
	
/*	for(i=2;i<attachment.length;i++){
		isValid = validAttachmentForm(attachment.get(i));
		if(isValid){
			break;
		}
	}*/
	//获取Component change informatin下面的信息
	var componentChangeInformatin = $("#component_change_informatin_table").find("tr:gt(1)");
	//如果存在必须要填写
	if(componentChangeInformatin){
		$.each(componentChangeInformatin,function(index,value){
			if(!$.trim($(value).find("td:eq(1)").find(":input").val())){
				$(value).find("td:eq(1)").find(":input").nextAll("div.errorMessage").append(errMsg);
				isValid = true;
			}
			if(!$.trim($(value).find("td:eq(2)").find(":input").val())){
				$(value).find("td:eq(2)").find(":input").nextAll("div.errorMessage").append(errMsg);
				isValid = true;
			}
		});
	}
	checkDMfn && checkDMfn.call();
	if($("#add_form .errorMessage").text()){
		isValid = true;
	}
	return isValid;
}


function validAttachmentForm(obj) {
	var text = $(obj).find(":file").val();
	if (!text){
		var message = "Please choose a file !";
		$(obj).find("td:eq(0)").find(":input").nextAll("div.errorMessage").append(message);	
		return true;
	}
	//判断文件名长度
	var maxIndex = text.lastIndexOf('\\') > text.lastIndexOf('/') ? text.lastIndexOf('\\') : text.lastIndexOf('/');
	if(text.substring(maxIndex+1,text.lastIndexOf('.')).length>100){
		var message = "The file name length should be less than 100" ;
		$(obj).find("td:eq(0)").find(":input").nextAll("div.errorMessage").append(message);
		return true;
	}
	
	//判断是否满足下面这些文件类型
	if(!(/\.doc[x]?$/.test(text.toLowerCase())) && !(/\.pdf$/.test(text.toLowerCase()))
		&& !(/\.txt$/.test(text.toLowerCase())) && !(/\.jpg$/.test(text.toLowerCase()))
		&& !(/\.xls[x]?$/.test(text.toLowerCase())) && !(/\.png$/.test(text.toLowerCase()))){
		var message = "The files should be one pdf or one xls(x) or one doc(x) or one txt or one jpg or one png." ;
		$(obj).find("td:eq(0)").find(":input").nextAll("div.errorMessage").append(message);
		return true;
	}
	
	return false;
}



// function add_attachment_tr(){
// 	var _table = $("#attachment_table");
// 	var _node =_table.find("tr:eq(0)").clone(true);
// 	//设置name值
// 	_node.find("td:eq(0)").find(":input").attr("name","toFeedBackAttachment["+Number(index1)+"].upload");
// 	index1 = Number(index1)+1;
// 	_table.append(_node.removeAttr("style"));
// }

/*function delete_attachment_tr(_obj){
	if(confirm("你确定要删除当前行吗 ?")){
		$(_obj).parent().parent().remove();
		_index = 0;
		index1--;
		//删除后重新排序
		var _trArray = $("#attachment_table").find("tr:gt(0)");
		if(_trArray){
			_trArray.each(function(index_,value_){
				$(value_).find("td:eq(0)").find(":input").attr("name","toFeedBackAttachment["+Number(index_)+"].upload");
				index_++;
			});
		}
	}
}*/


function add_component_tr(){
	var _table = $("#component_change_informatin_table");
	var _node =_table.find("tr:eq(1)").clone(true);
	//设置STEP NO的name值
	_node.find("td:eq(1)").find(":input").attr("name","toTroubleShootingMts["+Number(_index)+"].setupId");
	//设置Type的name值
	_node.find("td:eq(2)").find(":input").attr("name","toTroubleShootingMts["+Number(_index)+"].type");
	//设置Name的name值
	_node.find("td:eq(3)").find(":input").attr("name","toTroubleShootingMts["+Number(_index)+"].name");
	//设置P/N Off的name值
	_node.find("td:eq(4)").find(":input").attr("name","toTroubleShootingMts["+Number(_index)+"].pnOff");
	//设置S/N Off的name值
	_node.find("td:eq(5)").find(":input").attr("name","toTroubleShootingMts["+Number(_index)+"].snOff");
	//设置P/N On的name值
	_node.find("td:eq(6)").find(":input").attr("name","toTroubleShootingMts["+Number(_index)+"].pnOn");
	//设置S/N On的name值
	_node.find("td:eq(7)").find(":input").attr("name","toTroubleShootingMts["+Number(_index)+"].snOn");
	//设置Position的name值
	_node.find("td:eq(8)").find(":input").attr("name","toTroubleShootingMts["+Number(_index)+"].position");
	_index = Number(_index)+1;
	_table.append(_node.removeAttr("style"));
}

function delete_component_tr(_obj){
	if(confirm("你确定要删除当前行吗 ?")){
		$(_obj).parent().parent().remove();
		_index = 0;
		//删除后重新排序
		var _trArray = $("#component_change_informatin_table").find("tr:gt(1)");
		if(_trArray){
			_trArray.each(function(index_,value_){
				$(value_).find("td:first").text(index_+1);
				$(value_).find("td:eq(1)").find(":input").attr("name","toTroubleShootingMts["+Number(index_)+"].setupId");
				$(value_).find("td:eq(2)").find(":input").attr("name","toTroubleShootingMts["+Number(index_)+"].type");
				$(value_).find("td:eq(3)").find(":input").attr("name","toTroubleShootingMts["+Number(index_)+"].name");
				$(value_).find("td:eq(4)").find(":input").attr("name","toTroubleShootingMts["+Number(index_)+"].pnOff");
				$(value_).find("td:eq(5)").find(":input").attr("name","toTroubleShootingMts["+Number(index_)+"].snOff");
				$(value_).find("td:eq(6)").find(":input").attr("name","toTroubleShootingMts["+Number(index_)+"].pnOn");
				$(value_).find("td:eq(7)").find(":input").attr("name","toTroubleShootingMts["+Number(index_)+"].snOn");
				$(value_).find("td:eq(8)").find(":input").attr("name","toTroubleShootingMts["+Number(index_)+"].position");
			});
		}
	}
}

function showDialog_ViewOrEdit(obj) {
	var defectId = $(obj).attr("id");
	ShowWindowIframe({
		width: "1000",
		height: "700",
		title: "查看故障",
		param: {defectId: defectId},
		url: "/views/defect/defectDetails.shtml"
	});
}

/**
 * 查看详细信息
 * 
 * @param obj
 * @param event
 * @param type
 */
function view(obj) {
	var id = $(obj).attr("id");
	let url_ = "/views/mccdoc/view/view_fault_isolate_to.shtml";
	let parameters = {
		"toType": "1",
		"pageType": "view",
		"id": $(obj).attr("id")
	};
	let dialog_param = {
		title: 'View TO',
		width: '1150px',
		height: '650px',
		top: '35%',
		esc: true,
		cache: false,
		max: false,
		lock: true,
		min: false,
		parent: this,
		content: 'url:' + url_,
		data: parameters
	};
	if(P) {
		P.$.dialog(dialog_param);
	} else {
		$.dialog(dialog_param);
	}
}

/**
 * 用户选择
 * @param parameters
 */
function selectUser(orderNo){
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
			if(this.data.isOK == 1){
				$("#userNameSn"+orderNo).val(this.data.result.name+"("+this.data.result.sn+")");
				$("#userId"+orderNo).val(this.data.result.id);
			}
		},
		content:'url:' + basePath + '/security/user/select_user_list.jsp',
		data : {}
	});
}

function validNum() {
    //准备单实际工时获取和校验
    var validTime=false;
    $(".realStaff").each(function(i,v){
        if(!$(v).val()){
            $(v).css("background-color","#fff3f3");
            $(v).css("border-color","#ffa8a8");
            validTime=true;
            return;
        }
        if(!$(".realHour_"+i).val()){
            $(".realHour_"+i).css("background-color","#fff3f3");
            $(".realHour_"+i).css("border-color","#ffa8a8");
            validTime=true;
            return;
        }

    });

    return validTime;

    //准备单实际工时获取和校验 end
}