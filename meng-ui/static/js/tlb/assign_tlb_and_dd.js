function getOpener(){
	if(frameElement != null && frameElement.api != null){
		P = frameElement.api.opener;
	}else{
		P = window;
	}
	
	return P;
}

function assignTLB(tlbno, acreg, refresh){
	var P = getOpener();
	$.ajax({
        url : basePath+"/tbm/tbm_flow_findIsAssignedTlb.action?tlb.tlbNo="+tlbno,
		type : "get",
		dataType : "json",
		success : function(data) {
			var data = JSON.parse(data);
			if(data.ajaxResult == 'success'){
				var parameters = {
						'type' : 'TLB',
						'uid' : tlbno,
						'acreg' : acreg,
						'isrelease' : 'y',
						'actionType' : "assign"
				};
				P.$.dialog({
					id : 'assign_tlb',
					title : 'Assign TLB',
					top : '60px',
					width :  '1070px',
					height:'750px',
					content : 'url:' + basePath + "/tbm/flow/tbm_station_task_deskAssign_common.jsp",
					data : parameters,
					close : function(){
						refresh();
					}
				});
				
			}else{
				P.$.dialog.alert(data.msg);
			}
		  }
     });
}


function assignDD(ddNo, acreg, refresh){
	var P = getOpener();
	if(ddNo == null || ddNo == ""){
		$.dialog.alert('DD No. is not exists, can not operate.');
		return;
	}
	$.ajax({
        url : basePath+"/tbm/tbm_flow_findIsAssigned.action?ddi.ddNo="+ddNo,
		type : "get",
		dataType : "json",
		success : function(data) {
			var data = JSON.parse(data);
			if(data.ajaxResult == 'success'){
				var parameters = {
						'type' : 'DD',
						'uid' : ddNo,
						'acreg' : acreg,
						'isrelease' : 'y',
						'actionType' :"assign"
				};
				P.$.dialog({
					id : 'assign_dd',
					title : 'Assign DD',
					top : '60px',
					width :  '1070px',
					height:'750px',
					content : 'url:' + basePath + "/tbm/flow/tbm_station_task_deskAssign_common.jsp",
					data : parameters,
					close : function(){
						refresh();
					}	
				});
				
			}else{
				P.$.dialog.alert(data.errorMsg);
			}
		  }
     });
}