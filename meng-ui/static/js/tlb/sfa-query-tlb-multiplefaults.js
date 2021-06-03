var customModelSettings = {
		'TLB_MULTIPLEFAULTS' : {
			//列表项配置
			gridOptions :{
				allColModels : {
					'multipleFaults' : {
						formatter: queryTlbNo
					},
					'archiveStatus' :{
						formatter : formatArchiveStatus
					},
					'isVerify' :{
						formatter : function(cellValue, options, rowObject){
							if(cellValue == "0"){
								return "No";
							}else if(cellValue == "1"){
								return "Yes";
							}else{
								return "";
							}
						}
					},
					'src' :{
						formatter : function(cellValue, options, rowObject){
							if(cellValue == "USER"){
								return "手动";
							}else if(cellValue == "SYS"){
								return "系统";
							}else{
								return "";
							}
						}
					},
					'status' :{
						formatter : function(cellValue, options, rowObject){
							if(cellValue == "1"){
								return "有效";
							}else if(cellValue == "0"){
								return "失效";
							}else{
								return "";
							}
						}
					},
					'verifyResult' : {
						formatter : editVerifyResult
					},
					'archiveRemark' : {
						formatter : formatArchiveRemark
					}
				},
				
				jqGridSettings :{
					//jqGrid配置项
					id : "multipleFaults",
					multiselect : false// 可多选，出现多选框
				}
			}
		}		
};

function formatArchiveStatus(cellValue, options, rowObject){
	var retHtml = '';
	if(cellValue == '1'){
		retHtml = '已归档'
	}else if(cellValue == '0' && rowObject.verifyResult == 'y' && rowObject.status == '1'){
		if($.inArray('archive', perssions) < 0){
			return '未归档';
		}
		//针对有效的故障编号可以做归档操作
		retHtml += '<a id="multiple_archive_status_' + rowObject.multipleFaults + '" href="javascript:void(0)" style="color:#f60">未归档</a>';
		$("#multiple_archive_status_" + rowObject.multipleFaults).die("click").live("click", function(){
			selfPrompt(rowObject.multipleFaults + '归档', '请输入归档备注:', function(value){
				archiveFault(rowObject.multipleFaults, value);
			});
		});
	}else if(cellValue == '0'){
		retHtml = '未归档';
	}
	
	return retHtml;
}

function formatArchiveRemark(cellValue, options, rowObject){
	if(cellValue == null){
		return '';
	}
	
	if($.inArray('archive', perssions) < 0){
		return cellValue;
	}
	
	var retHtml = '<a id="multiple_edit_archive_remark_' + rowObject.multipleFaults + '" href="javascript:void(0)" style="color:#f60">' + cellValue + '</a>';
	$("#multiple_edit_archive_remark_" + rowObject.multipleFaults).die("click").live("click", function(){
		selfPrompt('编辑' + rowObject.multipleFaults + '归档备注', '请输入归档备注:', function(value){
			editArchiveRemark(rowObject.multipleFaults, value);
		}, cellValue);
	});
	
	return retHtml;
}

/**
 * 编辑归档备注
 */
function editArchiveRemark(faultNo, remark){
	$.ajax({
        url : basePath+"/tlb/tlb_rm_fault_editFaultArchiveRemark.action",
        type : 'post',
		cache: false,
		dataType: "json",
        data: {
        	'tlbRMFault.faultNo' : faultNo,
        	'tlbRMFault.archiveRemark' : remark
        },
        success : function(dataMsg) {
        	dataMsg = JSON.parse(dataMsg);
			if(dataMsg.ajaxResult == 'success'){
				P.$.dialog.alert("编辑归档备注成功.");
				$(document).sfaQuery().reloadQueryGrid();
			}else{
				if (dataMsg.message != null && dataMsg.message != "") {
					P.$.dialog.alert("归档归档备注失败." + dataMsg.message);
				}
			}
		}
     });
}

/**
 * 故障归档
 * @param remark
 */
function archiveFault(faultNo, remark){
	$.ajax({
        url : basePath+"/tlb/tlb_rm_fault_archiveFault.action",
        type : 'post',
		cache: false,
		dataType: "json",
        data: {
        	'tlbRMFault.faultNo' : faultNo,
        	'tlbRMFault.archiveRemark' : remark
        },
        success : function(dataMsg) {
        	dataMsg = JSON.parse(dataMsg);
			if(dataMsg.ajaxResult == 'success'){
				P.$.dialog.alert("归档成功.");
				$(document).sfaQuery().reloadQueryGrid();
			}else{
				if (dataMsg.message != null && dataMsg.message != "") {
					P.$.dialog.alert("归档失败." + dataMsg.message);
				}
			}
		}
     });
}

/**
 * 自定义提问框
 * @param	{String}	提问内容
 * @param	{Function}	回调函数. 接收参数：输入值
 * @param	{String}	默认值
 */
function selfPrompt(title, content, yes, value, _parent )
{
	value = value || '';
	var input;
	return P.$.dialog({
		title: title,
		id: title,
		icon: 'confirm.gif',
		fixed: true,
		lock: true,
		parent: this,
		content: [
			'<div style="margin-bottom:5px;font-size:12px">',
				content,
			'</div>',
			'<div>',
				'<textarea rows="3" style="width:18em;padding:6px 4px" >'+value+'</textarea>',
			'</div>'
			].join(''),
		init: function(){
			input = this.DOM.content[0].getElementsByTagName('textarea')[0];
			input.select();
			input.focus();
		},
		ok: function(here){
			if(input.value == ''){
				P.$.dialog.alert("请输入归档备注");
				return false;
			}
			return yes && yes.call(this, input.value, here);
		},
		cancel: true
	});
};

function editVerifyResult(cellValue, options, rowObject){
	var verifyResult = '';
	if(cellValue == "y"){
		verifyResult = "Yes";
	}else if(cellValue == "n"){
		verifyResult = "No";
	}
	
	if(rowObject.archiveStatus == '1' || $.inArray('confirm', perssions) < 0){
		return verifyResult;
	}
	
	var trHTML = '<a id="verifyResult_edit_' + rowObject.multipleFaults + 
		'" href="javascript:void(0)"  style="color:#f60" title="Edit">'+ verifyResult +'</a>';
	
	$("#verifyResult_edit_" + rowObject.multipleFaults).die("click").live("click", function(){
		if(cellValue == "n"){
			P.$.dialog.alert("不允许编辑校验结果为NO的记录，请手动重新创建。");
		}else{
			editVerifyResultInfo(rowObject);
		}
	});
	
	return trHTML;
}

function editVerifyResultInfo(rowObject){
	P.$.dialog({
		id : "edit_verify_result",
		title : "Edit Verify Result",
		top : "30%",
		width : "500px",
		height : "350px",
		content : "url:" + basePath + "/tlb/tlb_rm_fault_editVerifyResult.action?faultNo=" + rowObject.multipleFaults,
		close : function(){
			$(document).sfaQuery().reloadQueryGrid();
		}
	});
}

function queryTlbNo(cellValue, options, rowObject){
	if(cellValue == null){
		return '';
	}
	var trHTML = '';
	trHTML += '<a id="multiple_' + cellValue + '" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
	$("#multiple_" + cellValue).die("click").live("click", function(){
		showTlbNo(cellValue,rowObject);
	});
	return trHTML;
}

function showTlbNo(multipleFaults, rowObject){
	$.ajax({
        url : basePath+"/tlb/tlb_multiplefaults_getTlbNoOfSameMultipleNo.action",
        type : 'post',
		cache: false,
		dataType: "json",
        data: {
        	'techlog.multipleFaults' : multipleFaults
        },
        success : function(dataMsg) {
        	dataMsg = JSON.parse(dataMsg);
			if(dataMsg.ajaxResult == 'success'){
				var tlbNosMsg = dataMsg.tlbNosMsg;
				var deletedTlbNosMsg = dataMsg.deletedTlbNoSb;
				P.$.dialog({
					id : 'multipleFaults_Info' + multipleFaults,
					title : 'Multiple Faults Info',
					top : '30%',
					width : '600px',
					height: '300px',
					data : {
						'rowObject' : rowObject,
						'tlbNosMsg' : tlbNosMsg,
						'deletedTlbNosMsg' : deletedTlbNosMsg
					},
					content : 'url:' + basePath + "/tlb/tlb_multipleFaults.jsp"
				});
			}else{
				if (dataMsg.message != null && dataMsg.message != "") {
					P.$.dialog.alert(dataMsg.message);
				}
			}
		}
     });
}