$(function() {
	
	//数据批量删除
	/*$("#del_btn").click(function(){
		var selectedIds = jQuery("#common_list_grid").getGridParam("selarrrow");//获取选中行的行号
        var params = {  
           "selectedIds" : selectedIds.toString()
        };  
   
        var actionUrl = "tlb/tlb_techlog_delete.action";  
		if(selectedIds != "" && selectedIds != null){
			$.dialog.confirm('Are you sure to delete?', function(){
    	        $.ajax({  
	  	            url : actionUrl,  
	  	            data : params,  
	  	            dataType : "json",  
	  	            cache : false,  
	  	              
	  	          success : function(obj, textStatus) {  
	  	        	  	var data = JSON.parse(obj); 
	  	                if (data.ajaxResult == "success") {
	  	                	 var arr = selectedIds.toString().split(',');
		  					   $.each(arr,function(i,n){
		  							 if(arr[i]!=""){
		  								 $("#common_list_grid").jqGrid('delRowData',n); 
		  							 }
		  		               });
		  					$.dialog.alert(data.updateRepeatMsg + "Success"); 
	  	                    //location.reload();
		  					//$("#find_btn").click();
	  	                  
		  					$("#common_list_grid").jqGrid().trigger("reloadGrid");
	  	                } else {  
	  	                	$.dialog.alert(data.ajaxResult); 
	  	                }  
	  	            }
    	        })
    	        },function(){
					//$.dialog.tips('执行取消操作');
				})
		}else{
			$.dialog.alert("Please select records to delete"); 
	    } 		
	});*/
	
	//删除可靠性分类设置
	/*$("#modify_reliability_category").click(function(){
		var selectedIds = $("#common_list_grid").getGridParam("selarrrow");//获取选中行的行号
		var tlbNos = [];
		$.each(selectedIds, function(i,v){
			var rowData =  $("#common_list_grid").jqGrid('getRowData',v);
			tlbNoStr = $(rowData.tlbNo).text();
			tlbNos.push(tlbNoStr);
		});
		
        var params = {
           "selectedIds" : selectedIds,
           "tlbNos" : tlbNos
        }; 
		
        P.$.dialog({
			id : 'modify_reliabilitycat',
			title : 'Modify Reliability Cat.',
			top : '30%',
			width :  '500px',
			height:'300px',
			data : params,
			content : 'url:' + basePath + "/tlb/multiple_tlb_reliabilityCat.jsp"
		});
	});*/
	
});