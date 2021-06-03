var sub_win = frameElement.api, P = sub_win.opener;
	var s_params = sub_win.data;
	sub_win.data = sub_win.data || {};
	var defectNo = s_params['defectNo'] || '';
	var ppParma = null;
	
	html_required = '<span class="td-font-red"  style="color:red;">*</span>',
	html_error_div = '<div class="error_div" style="color:red;"><span class="error">{text}</span></div>';
 	sub_win.button(
			{
				name : 'Submit',
				callback : function(){
					submit_btn();
					return false;
				}
			}
			,{
				name : 'Close'
		
			});
 	
 	//提交表单
 	function submit_btn(){
 		
		var len = validateAll();
		if(len >0){
			return false;
		}
		
		sub_win.button({id:'Submit',disabled:true});
		$('#approval_form').ajaxSubmit({
			url : 'defect_base_updateMccRemark.action',
			type:'post',
			dataType : 'json',
			cache : false,
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				var msg = data.updateMsg || '';
				if(data && data.ajaxResult && data.ajaxResult.indexOf('success')!=-1){
					ppParma = s_params["parentParams"];
					assignTask(ppParma["lineJob"],ppParma["btn"]);
					//P.$.dialog.success('提交成功! ');
					sub_win.close();
				}else{
	   	  			P.$.dialog.alert('提交失败,'+data.msg);
				}
			}
		});
		
	}
 	/**
 	 * 创建新的停场航线任务
 	 * @param lineJob
 	 */
 	function createLineJob(lineJob, callback){
 		$.ajax({
 			url : basePath + "/tbm/tbm_staTask_createLineJob.action",
 			type : "get",
 			dataType : "json",
 			cache : false,
 			async : false,
 			data : {
 				"lineJob.flbBase.acId" : lineJob.flbBase.acId,
 				"lineJob.flbBase.acReg" : lineJob.flbBase.acReg,
 				"lineJob.jobDate" : lineJob.jobDate.split(" ")[0],
 				"lineJob.station" : lineJob.station,
 			},
 			
 			success : function(data) {
 				var data = JSON.parse(data);
 				if(data.ajaxResult == 'success'){
 					callback(data.lineJob);
 				}else{
 					P.$.dialog.alert(data.ajaxResult + ":" + data.message);
 				}
 			}
 		});
 	}
 	/**
 	 * 任务下发
 	 * 在当前任务下发时进行判断，若下发任务类型为‘DEFECT’（故障）则进行判断，
 	 * 若不是故障，则按照以前的流程进行走
 	 * @author 80003187
 	 * ----新增---
 	 */
 	function assignTask(lineJob, $btn){
 		if(lineJob.id < 0){
 			createLineJob(lineJob, assignTask);
 			return;
 		}
 		var type = ppParma["type"]; //任务类型
 		var woNo = ppParma["woNo"]; //文件号
 		var cardId = ppParma["cardId"]; //cardId
 		var description = ppParma["description"]; //描述
 		var requireFeedback = ppParma["requireFeedback"]; //描述
 		var api = ppParma["api"];
 		
 		$.ajax({
 	        url : basePath + "/tbm/tbm_flow_addMccInfo.action",
 			type : "post",
 			async : false,
 			data : {
 				"mccInfo.job.id" : lineJob.id ,
 				"mccInfo.type" : type,
 				"mccInfo.docNo" : woNo,
 				"mccInfo.cardId" : cardId,
 				"mccInfo.checkType" : lineJob.checkType,
 				"mccInfo.description": description,
 				"mccInfo.requireFeedback": requireFeedback
 			},
 			dataType : "json",
 			success : function(data) {
 				var data = JSON.parse(data);
 				if(data.ajaxResult == 'success'){
 					P.$.dialog.alert("Assign "+data.ajaxResult);
 					api.close();
 				} else if(data.ajaxResult == 'already') {
 					P.$.dialog.alert(data.msg);
 				}else{
 					P.$.dialog.alert(data.ajaxResult);
 					$btn.live("click", function(){
 						$btn.die("click");
 						assignTask(lineJob, $btn);
 					});
 					api.close();
 				}
 				
 			  }
 	     });
 	}
 	
	$(function(){
		$("#defectNo").val(defectNo);
	});

	
 	function viewDetail(){
		
		var rowId = $('#entityId').val();

		var parameters = {
			"methodType" : "view",
			"rowId" : rowId,
			"openBy" :"approval",
			"isHideCheckButton":"1"
		};
		
		P.$.dialog({
			id : 'eoViewPage',
			title : 'View EO Information',
			width : '1100px',
			height : '600px',
			top : '15%',
			esc:true,
			cache:false,
			max: false, 
	        min: false,
			parent:this,
			content:'url:eo/eo_management_view.action?id='+rowId,
			data : parameters
		});
 		
 	}
 	
// 	$('#view_detail').live('click',viewDetail);
 	
 	$('#remark').live('blur',function(){
 		checkLenght(this);
 	});
 	
 	function validateAll(){
		checkLenght($('#remark'));
		return $('#approval_form').find('.error_div').length;
 	}
 	
 	function checkLenght(ele){
 		
 		var len = $(ele).attr('maxlength');
 		$(ele).parent().find('div.error_div').remove();
 		var sour = $.trim($(ele).attr('value'));
 		
 		if(sour && $.trim(sour).length > len){
 			//长度超出
 			var errDiv = html_error_div.replace('{text}','The field length more than the max length '+len+'!');
 			$(ele).parent().append(errDiv);
 		}else if($.trim(sour).length ==0){
 			//不能为空
 			var errDiv = html_error_div.replace('{text}','The field is required!');
 			$(ele).parent().append(errDiv);
 			
 		}
 	}
 	
 