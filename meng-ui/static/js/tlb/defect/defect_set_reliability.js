var sub_win = frameElement.api, 
	P = sub_win.opener;
var s_params = sub_win.data;
	sub_win.data = sub_win.data || {};
var id = s_params['id'] || '';
	
html_required = '<span class="td-font-red"  style="color:red;">*</span>',
html_error_div = '<div class="error_div" style="color:red;"><span class="error">{text}</span></div>';

	$(function(){
		$("#id").val(id);
	});

	sub_win.button({
		name : 'Submit',
		callback : function(){
			submit_btn();
			return false;
		}
	} ,{
		name : 'Close'
	});
 	
	//提交表单
	function submit_btn(){
		var selectedIds = $("#id").val();
		sub_win.button({id:'Submit',disabled:true});
		let post_data ={reliabilityType:$('input[name="reliabilityType"]:checked').val()};
		$.ajax({
			url : '/api/v1/defect/defect_base_info/setReliability?selectedIds='+selectedIds,
			type:'POST',
			dataType : 'json',
			contentType: "application/json;charset=utf-8",
			data: JSON.stringify(
				post_data
			),
			cache : false,
			success: function (data) {
				if (data.code == 200) {
					P.$.dialog.success('可靠性分类设置成功! ');
					sub_win.close();
				}
			},
			error: function (data) {
				P.$.dialog.alert('可靠性分类设置失败,'+data.msg);
			}
		});
	}

