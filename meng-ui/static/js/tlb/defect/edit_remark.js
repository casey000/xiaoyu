var sub_win = frameElement.api, P = sub_win.opener;
	var s_params = sub_win.data;
	sub_win.data = sub_win.data || {};
	var id = s_params['id'] || '';
	
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
			url : 'defect_pend_updateRemark.action',
			type:'post',
			dataType : 'json',
			cache : false,
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				if(data && data.ajaxResult && data.ajaxResult.indexOf('success')!=-1){
					P.$.dialog.success('编辑成功! ');
					sub_win.close();
				}else{
	   	  			P.$.dialog.alert('编辑失败,'+data.msg);
				}
			}
		});
		
	}
 	
	$(function(){
		$("#id").val(id);
	});

 	
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
 	
 