var customModelSettings = {
	'DEFECT_MONITOR':{				
		// 列表项配置
		gridOptions : {
			allColModels : {
				'creator' : {
					formatter : formaterCreator
				},
				'pendNo' : {
					formatter : formaterPendNo
				},
				'deferredNo' : {
					formatter : formaterDeferredNo
				},
				'defectNo' : {
					formatter : formaterDefectNo
				},
	
				"faultReportChn" : {
					formatter : formatTlbStr
				},
				"faultReportEng" : {
					formatter : formatTlbStr
				},
				"status" : {
					formatter : customerizeStaus
				},
				
				"type" : {
					formatter : customerizeType
				},
				"mechanic" : {
					/*formatter : formatMechanic*/
				},
				"inspector" : {
					/*formatter : formatInspector*/
				},
				'oper' :{
					isOpts : true,
					colNameEn : "Operate",
					colNameCn : "Operate",
					width : 45,
					formatter : oper_edit
				},
				'assign' : {
					name : 'Assign',
					colNameEn : 'Assign',
					isOpts : true,
					width : 50,
					formatter : formatAssignDefect
				},
				'flogDate': {
					formatter: dateTimeFormatter
				}
	
			}
		}
	}
}

function oper_edit(cellvalue, options, rowObject){
	//编辑图标
	var editDiv = '';
//	if(gridPermissionMap && gridPermissionMap.mccAssign_editPermission){	
		if(rowObject.auditStatus == 1 || rowObject.auditStatus == 5){
			var id = rowObject.defectId;
			var category = rowObject.category;
			editDiv = '<div id="'
			+ options.rowId
			+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="'
			+ $.jgrid.nav.edittitle
			+ '" onclick="edit(\''+id+'\',\''+category+'\',this,event);"><span class="ui-icon ui-icon-pencil"></span></div>';
		}
//	}
	return editDiv;
}


function edit(defectId, category, obj, event) {
	var actionUrl = basePath + "/tlb/defect_pend_createDfrl.action?id=" + defectId + "&category=" + category;
	
	P.$.dialog({
		id :  'Page',
		title : 'Edit Deferred Info ',
		width:	'1200px',
	    height: '600px',
		top : '80px',
		esc : true,
		cache : false,
		close : function() {
			// 弹出的窗口被关闭后,主页面刷新
			P.$("#common_list_grid").jqGrid().trigger("reloadGrid");
		},
		lock:true,
		max : false,
		min : false,
		parent : this,
		content : 'url:' + actionUrl
//		data : parameters
	});
	
	/*$.ajax({
		url : actionUrl,
		dataType : "json",
		cache : false,
		
		success : function(obj, textStatus) {
			var data = JSON.parse(obj);
			if (data.ajaxResult == "success") {	
				var parameters = {
		            	 "methodType": 'edit'
		             };  
				var url = basePath + '/work/mcc_assign_task_toEdit.action?taskMCC.id=' + rowId+'&checkType='+checkType;
				P.$.dialog({
					id :  'Page',
					title : 'Edit Mcc Task ',
					width:	'1200px',
		    	    height: '600px',
					top : '80px',
					esc : true,
					cache : false,
					close : function() {
						// 弹出的窗口被关闭后,主页面刷新
						P.$("#common_list_grid").jqGrid().trigger("reloadGrid");
					},
					lock:true,
					max : false,
					min : false,
					parent : this,
					content : 'url:' + url,
					data : parameters
				});
				
			} else {
				P.$.dialog.alert(data.ajaxResult);
			}
		}
	});*/
		
}

function formatMechanic(cellvalue, options, rowObject) {
	
	if (rowObject.mechanicNo && rowObject.mechanic) {
		
		return rowObject.mechanic + '(' + rowObject.mechanicNo + ')';
			
	}
	return "";
}
function formatInspector(cellvalue, options, rowObject) {
	
	if (rowObject.mechanicNo && rowObject.mechanic) {
		
		return rowObject.mechanic + '(' + rowObject.mechanicNo + ')';
		
	}
	return "";
}

function assignTLB(defectNo, acreg, refresh){
	var P = getOpener();
	$.ajax({
		url : basePath+"/tbm/tbm_flow_findIsAssignedDefect.action?defectInfo.defectNo="+defectNo,
		type : "get",
		dataType : "json",
		success : function(data) {
			var data = JSON.parse(data);
			if(data.ajaxResult == 'success'){
				assignDialog({
					type : "DEFECT",
					no : defectNo,
					acReg : acreg,
					actionType : 'assign',
					callback : refresh
				})
			}else{
				P.$.dialog.alert(data.msg);
			}
		  }
	 });
	}

	function getOpener(){
	if(frameElement != null && frameElement.api != null){
		P = frameElement.api.opener;
	}else{
		P = window;
	}

	return P;
	}


	/**
	* type, no, station, actionType, description, callback
	* 下发任务到航班
	* @param type
	* @param no
	* @param acReg
	* @param actionType
	* @param callback
	*/
	function assignDialog(options){
	P.$.dialog({
		id : 'assign_' + options.type,
		title : 'Assign ' + options.type,
		top : '60px',
		width :  '1070px',
		height:'600px',
		content : 'url:' + basePath + "/tbm/tbm_station_task.jsp",
		data : options,
		close : function(){
			options.callback(this);
		}	
	});
	}


function formatAssignDefect (cellvalue, options, rowObject) {
	/*trHTML += '<div style="padding-left:8px" ';
	trHTML += '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Assign"';
	trHTML += ' onclick="addMccLinkDefect(';
	trHTML += mcc.defectNo;
	trHTML += ',';
	trHTML += "'edit'";	
	trHTML += ');"><span class="ui-icon ui-icon-gear"></span></div></td>';*/
	
	var editDiv = '';
	editDiv = '<div style="padding-left:8px" id="'
			+ options.rowId
			+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Assign"'
			+ ' onclick=addMccLinkDefect(\"'
			+ rowObject.defectNo
			+ '\","add")><span class="ui-icon ui-icon-gear"></span></div>';
	return editDiv;
}

function customerizeStaus(cellValue, options, rowObject){
	if(cellValue == '1'){
		return "OPEN";
	}else if(cellValue == '2'){
		return 'CLOSE';
	}
	else{
		return "";
	}
}

function customerizeType(cellValue, options, rowObject){
	if(cellValue == '1'){
		return "缺陷";
	}else if(cellValue == '2'){
		return '保留';
	}
	else{
		return "";
	}
}

function formaterCreator(cellvalue, options, rowObject) {
	
	if (rowObject.user) {
		
		if(rowObject.user.sn){
			
			return rowObject.user.name + '(' + rowObject.user.sn + ')';
			
		}else{
			
			return rowObject.user.name + '(' + rowObject.user.loginName + ')';
		}
	}
	
	return "";
}
function formaterDefectNo(cellValue, options, rowObject) {
	return '<a href="#" id=' + rowObject.defectId
			+ ' style="color:#f60" onclick="viewDefect('+rowObject.id+',event);" >'
			+ rowObject.defectNo + '</a>';
}

//解析日期函数
function paserDate(dateStr) {
	// edit by wxw
	if(!dateStr){
		return ""
	}
	return new Date(dateStr)
	// end wxw
	var dateArr = null;
	var timeArr = null;
	var arr1 = dateStr.split(" ");
	if (arr1[0] != null) {
		dateArr = arr1[0].split("-");
	}
	if (arr1[1] != null) {
		timeArr = arr1[1].split(":");
	}
	if (timeArr == null) {
		return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
	} else {
		return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);
	}
}

// deferred 编号链接
function formaterDeferredNo(cellvalue, options, rowObject) {
	if(!cellvalue){
		return
	}
//	var fun = "viewDeferred(this,event)";
	var sty = 'color:black';
	
	if (rowObject.auditStatus == 1 || rowObject.auditStatus == 2){
		//未审核: 黄色
		sty = 'color:#a0a030';
	} else if (rowObject.auditStatus == 3){
		//未批准: 橙色
		sty = 'color:orange';
	}
	/*else if (rowObject.auditStatus == 4){
		//已批准: 灰色
		sty = 'color:gray';
	}*/
	
	/*if (rowObject.auditStatus == 4 && rowObject.isMrTrOk){
		//条件满足: 绿色
		sty = 'color:green';
	}*/
	if (rowObject.auditStatus == 4){
		//条件满足: 绿色
		sty = 'color:green';
	}

	if(rowObject.status == 1){
		var now = new Date();
		var applyDate = paserDate(rowObject.applyDate);
		var expiredDate = paserDate(rowObject.expiredDate);
		if(expiredDate == ""){
			sty = 'color:red';
		}else{
			var total = expiredDate.getTime() - applyDate.getTime();
			var remain = expiredDate.getTime() - now.getTime();
			if (remain < 3 * 24 * 3600 * 1000 || remain < total * 0.15) {
				//预警: 红色
				sty = 'color:red';
			}
		}
	}
	
	if(rowObject.status == 2){
		sty = 'color:black';
	}
	return '<a href="#" id="' + rowObject.id + '" style='+sty+' onclick="viewDeferred('+rowObject.id+',event,\''+ rowObject.category +'\');"  >' + (cellvalue == null? 'View' : cellvalue) +'</a>';
}
//pend 编号 链接
function formaterPendNo(cellvalue, options, rowObject) {
	var fun = 'viewDeferred('+rowObject.id+',event,\''+ rowObject.category +'\')';
	return '<a href="#" id="' + rowObject.id + '" style="color:#f60" onclick="'+fun+'"  >' + (cellvalue == null? 'View' : cellvalue) +'</a>';
}

function formatTlbStr(cellValue, options, rowObject){
	if(cellValue!=null){
		var span = '<div style="word-break: break-all; white-space: normal;width : 95%"> '+ cellValue  + '</div>';
		return span;	
	}
	return "";
}

function viewDefect(rowObj, event) {
	var url = basePath + '/tlb/defect_info_view.action?id=' + rowObj;
	P.$.dialog({
		title : 'View Defecte Information',
		width : '1000px',
		height : '500px',
		top : '20%',
		esc : true,
		cache : false,
		max : false,
		min : false,
		lock : true,
		parent : this,
		content : 'url:' + url,
		data : {
			edit : false,
			revise : false
		},
		close : function() {
			$(document).sfaQuery().reloadQueryGrid();
		}
	});
}

function viewDeferred(rowObj, event,category) {
	var url = basePath + '/tlb/defect_pend_view_viewPend.action?id=' + rowObj +'&category='+category;
	var titleName = "View Deferred Information";
	
	if(null !=category && category =='PEND'){
		titleName = "View Pend Information";
	}
	P.$.dialog({
		title : titleName,
		width : '1000px',
		height : '400px',
		esc : true,
		max : false,
		min : false,
		lock : true,
		content : 'url:' + url,
		close : function() {
			$(document).sfaQuery().reloadQueryGrid();
		}
	});
}


function addMccLinkDefect(defectNo, doType){
	
	var actionUrl = basePath + "/work/mcc_assign_task_generateAdd.action";
	var params = {"taskMCC.docNo" : defectNo };
	$.ajax({
		url : actionUrl,
		data : params,
		dataType : "json",
		cache : false,
		success : function(obj, textStatus) {
			var data = JSON.parse(obj);
			if (data.ajaxResult == "success") {	
				var parameters = {
	            	 "methodType": 'add'
	            };  
				var actionUrl = basePath + '/work/add_mcc_task.jsp?docNo='+data.docNo;
				$.dialog({
					 title:	'Add MCC Task',
					 width:	'1200px',
		    	     height: '600px',
					 top: '60px',
					 content: 'url:'+actionUrl,
					 data: parameters
				});
				
			} else {
				P.$.dialog.alert(data.ajaxResult);
			}
		}
	})
}
