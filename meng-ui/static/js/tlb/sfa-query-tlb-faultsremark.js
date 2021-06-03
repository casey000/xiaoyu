var customModelSettings = {
		'TLB_FAULTSREMARK' : {
			//列表项配置
			gridOptions :{
				allColModels : {
					'tlbNo' : {
						formatter: showRemarkInfo
					},
					'creator.name' : {
						formatter: showUser
					},
					'orgRepeatFaults' : {
						formatter: showOrgRepeatFaultsTlbNos
					},
					'newRepeatFaults' : {
						formatter: showNewRepeatFaultsTlbNos
					},
					'orgMultipleFaults' : {
						formatter: showOrgMultipleFaultsTlbNos
					},
					'newMultipleFaults' : {
						formatter: showNewMultipleFaultsTlbNos
					}
				},
				
				jqGridSettings :{
					//jqGrid配置项
					id : "id",
					multiselect : false// 可多选，出现多选框
				}
			}
		}		
};
function showOrgRepeatFaultsTlbNos(cellValue, options, rowObject){
	if(cellValue == null || cellValue == ''){
		return '';
	}
	
	var trHTML = '';
	trHTML += '<a id="id_' + rowObject.id + cellValue + '" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
	$("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
		P.$.dialog({
			id : 'orgRepeatFaultsTlbNos',
			title : 'Org Repeat Faults TlbNos',
			top : '30%',
			width : '500px',
			height: '300px',
			data : {
				'rowObject' : rowObject
			},
			content : 'url:' + basePath + "/tlb/tlb_orgRepeatFaultsTlbNos.jsp"
		});
	});
	return trHTML;
}

function showNewRepeatFaultsTlbNos(cellValue, options, rowObject){
	if(cellValue == null || cellValue == ''){
		return '';
	}
	
	var trHTML = '';
	trHTML += '<a id="id_' + rowObject.id + cellValue + '" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
	$("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
		P.$.dialog({
			id : 'newRepeatFaultsTlbNos',
			title : 'New Repeat Faults TlbNos',
			top : '30%',
			width : '500px',
			height: '300px',
			data : {
				'rowObject' : rowObject
			},
			content : 'url:' + basePath + "/tlb/tlb_newRepeatFaultsTlbNos.jsp"
		});
	});
	return trHTML;
}

function showOrgMultipleFaultsTlbNos(cellValue, options, rowObject){
	if(cellValue == null || cellValue == ''){
		return '';
	}
	//alert(JSON.stringify(options));
	var trHTML = '';
	trHTML += '<a id="id_' + rowObject.id + cellValue +'" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
	$("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
		P.$.dialog({
			id : 'orgMultipleFaultsTlbNos',
			title : 'Org Multiple Faults TlbNos',
			top : '30%',
			width : '500px',
			height: '300px',
			data : {
				'rowObject' : rowObject
			},
			content : 'url:' + basePath + "/tlb/tlb_orgMultipleFaultsTlbNos.jsp"
		});
	});
	return trHTML;
}


function showNewMultipleFaultsTlbNos(cellValue, options, rowObject){
	if(cellValue == null || cellValue == ''){
		return '';
	}
	
	var trHTML = '';
	trHTML += '<a id="id_' + rowObject.id + cellValue +'" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
	$("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
		P.$.dialog({
			id : 'newMultipleFaultsTlbNos',
			title : 'new Multiple Faults TlbNos',
			top : '30%',
			width : '500px',
			height: '300px',
			data : {
				'rowObject' : rowObject
			},
			content : 'url:' + basePath + "/tlb/tlb_newMultipleFaultsTlbNos.jsp"
		});
	});
	return trHTML;
}
function showUser(cellValue, options, rowObject){
	var user = '';
	if(rowObject.creator != null){
		user += rowObject.creator.name + '(' +rowObject.creator.sn + ')';
	}
	return user;
}

function showRemarkInfo(cellValue, options, rowObject){
	var trHTML = '';
	trHTML += '<a id="id_' + rowObject.id + '" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
	$("#id_" + rowObject.id).die("click").live("click", function(){
		showRemark(cellValue,rowObject);
	});
	return trHTML;
}

function showRemark(tlbNo, rowObject){
	P.$.dialog({
		id : 'tlbFaultsRemark',
		title : 'Tlb Faults Remark',
		top : '30%',
		width : '600px',
		height: '300px',
		data : {
			'rowObject' : rowObject
		},
		content : 'url:' + basePath + "/tlb/tlb_faultsRemark.jsp"
	});
			
}