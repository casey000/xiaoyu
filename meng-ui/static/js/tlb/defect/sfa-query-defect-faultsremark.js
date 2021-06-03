var customModelSettings = {
		'DEFECT_FAULTSREMARK' : {
			//列表项配置
			gridOptions :{
				allColModels : {
					'defectNo' : {
						formatter: showRemarkInfo
					},
					'creator.name' : {
						formatter: showUser
					},
					'orgRepeatFaults' : {
						formatter: showOrgRepeatFaultsDefectNos
					},
					'newRepeatFaults' : {
						formatter: showNewRepeatFaultsDefectNos
					},
					'orgMultipleFaults' : {
						formatter: showOrgMultipleFaultsDefectNos
					},
					'newMultipleFaults' : {
						formatter: showNewMultipleFaultsDefectNos
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
function showOrgRepeatFaultsDefectNos(cellValue, options, rowObject){
	if(cellValue == null || cellValue == ''){
		return '';
	}
	
	var trHTML = '';
	trHTML += '<a id="id_' + rowObject.id + cellValue + '" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
	$("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
		P.$.dialog({
			id : 'orgRepeatFaultsDefectNos',
			title : 'Org Repeat Faults DefectNos',
			top : '30%',
			width : '500px',
			height: '300px',
			data : {
				'rowObject' : rowObject
			},
			content : 'url:' + basePath + "/tlb/defect_orgRepeatFaultsDefectNos.jsp"
		});
	});
	return trHTML;
}

function showNewRepeatFaultsDefectNos(cellValue, options, rowObject){
	if(cellValue == null || cellValue == ''){
		return '';
	}
	
	var trHTML = '';
	trHTML += '<a id="id_' + rowObject.id + cellValue + '" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
	$("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
		P.$.dialog({
			id : 'newRepeatFaultsDefectNos',
			title : 'New Repeat Faults DefectNos',
			top : '30%',
			width : '500px',
			height: '300px',
			data : {
				'rowObject' : rowObject
			},
			content : 'url:' + basePath + "/tlb/defect_newRepeatFaultsDefectNos.jsp"
		});
	});
	return trHTML;
}

function showOrgMultipleFaultsDefectNos(cellValue, options, rowObject){
	if(cellValue == null || cellValue == ''){
		return '';
	}
	//alert(JSON.stringify(options));
	var trHTML = '';
	trHTML += '<a id="id_' + rowObject.id + cellValue +'" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
	$("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
		P.$.dialog({
			id : 'orgMultipleFaultsDefectNos',
			title : 'Org Multiple Faults DefectNos',
			top : '30%',
			width : '500px',
			height: '300px',
			data : {
				'rowObject' : rowObject
			},
			content : 'url:' + basePath + "/tlb/defect_orgMultipleFaultsDefectNos.jsp"
		});
	});
	return trHTML;
}


function showNewMultipleFaultsDefectNos(cellValue, options, rowObject){
	if(cellValue == null || cellValue == ''){
		return '';
	}
	
	var trHTML = '';
	trHTML += '<a id="id_' + rowObject.id + cellValue +'" href="javascript:void(0)" style="color:#f60">'+ cellValue +'</a>';
	$("#id_" + rowObject.id + cellValue).die("click").live("click", function(){
		P.$.dialog({
			id : 'newMultipleFaultsDefectNos',
			title : 'new Multiple Faults DefectNos',
			top : '30%',
			width : '500px',
			height: '300px',
			data : {
				'rowObject' : rowObject
			},
			content : 'url:' + basePath + "/tlb/defect_newMultipleFaultsDefectNos.jsp"
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

function showRemark(defectNo, rowObject){
	P.$.dialog({
		id : 'defectFaultsRemark',
		title : 'Defect Faults Remark',
		top : '30%',
		width : '600px',
		height: '300px',
		data : {
			'rowObject' : rowObject
		},
		content : 'url:' + basePath + "/tlb/defect/defect_faultsRemark.jsp"
	});
			
}