function confirmDelFile(){	
 		var actionUrl = basePath + "/work/mcc_assign_task_deleteTaskAttach.action";
 		var params = {"uploadFileName" : $("#fileAttch").val()};
 		P.$.dialog.confirm('Are you sure to delete attachFile?', function(){
 	        $.ajax({  
 	            url : actionUrl,  
 	            data : params,  
 	            dataType : "json",  
 	            cache : false,  
 	              
 	          success : function(obj, textStatus) {  
 	        	  	var data = JSON.parse(obj); 
 	                if (data.ajaxResult == "success") {
 	                  P.$.dialog.alert('Delete success.');
 	                  
 	  				  $("#fileAttch").val('');
 	  				  $("#ccacFile").val('');
 	  				  $("#df").hide();
 	                } else {  
 	                	P.$.dialog.alert(data.ajaxResult); 
 	                }  
 	            }
 	        })
 	        },function(){
 				//$.dialog.tips('执行取消操作');
 			})
 	}