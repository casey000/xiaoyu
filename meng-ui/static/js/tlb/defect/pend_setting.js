var customModelSettings = {
	'DEFECT_PEND_QUERY': {
		// 列表项配置
		gridOptions : {
			allColModels : {
				'creator' : {
					formatter : formaterCreator
				},
				'postfltStation' : {
					formatter : formaterPof
				},
				"reMain" : {
					formatter : formaterReMain
				},
				'pendNo' : {
					formatter : formaterPendNo
				},
				'reference' : {
					formatter : formaterReference
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
					formatter: customerizeStaus,
					formatType: "map",
					pattern: {
						"1": "OPEN",
						"2": "CLOSE"
					}
				},
				"profession":{
					formatter: formaterProfession,
					formatType: "map",
					pattern: {
						"1": "电子",
						"2": "电气",
						"3": "机械",
						"4": "动力",
						"5": "其他"
					}
				},
				"dfrlCategory" : {
					formatter: formatDfrlCategory,
					formatType: "formatDfrlCategory",
					params: {
						"properties": [{
							"property": "fh"
						}, {
							"property": "fc"
						}, {
							"property": "calendarDay"
						}, {
							"property": "flightDay"
						}, {
							"property": "dfrlCategory"
						}]
					}
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
                "defectCategory":{
					formatter: formaterCategory,
					formatType: "map",
					pattern: {
						"1": "液体渗漏",
						"2": "缺陷",
						"3": "一般故障",
						"4": "重大故障"
					}
                },
				'oper' :{
					isOpts : true,
					colNameEn : "Operate",
					colNameCn : "Operate",
					width : 45,
					formatter : oper_edit
				},
				"creattime": {
                    formatter: dateTimeFormatter
                },
                "expiredDate": {
                    formatter: dateTimeFormatter
                },
				'assign' : {
					name : 'Assign',
                    colNameCn: 'Assign',
					colNameEn : 'Assign',
					isOpts : true,
					width : 50,
					formatter : formatAssignDefect
				},
				'flogDate': {
					formatter: formatFlightDate
				},
				'mrNo':{
					sortable : false,
					formatter: formatMrNo
				},
				'flogFlight': {
					formatter: formatFlightInfo
				},
				'flogStation': {
					formatter: formatFlightInfo
				}

			}
		}
	}
};

var workTypeDict = {
    32: "DD",
    34: "PEND",
    35: "MCC",
};

// add by guozhigang 添加类型格式化。see[2657] MORE窗口TYPE栏无显示值
function formaterCategory(cellValue, options, rowObject){
    if(cellValue == '1'){
        return "液体渗漏";
    }else if(cellValue == '2'){
        return '缺陷';
    }else if(cellValue == '3'){
        return '一般故障';
    }else if(cellValue == '4'){
        return '重大故障';
    }else{
        return "";
    }
}

function oper_edit(cellvalue, options, rowObject){
	//编辑图标
	var editDiv = '';
	if (gridPermissionMap && gridPermissionMap.deferred_editPermission) {
		if(rowObject.auditStatus == 1 || rowObject.auditStatus == 5){
			var id = rowObject.defectId;
			var pendId = rowObject.id;
			var category = rowObject.category;
			editDiv += '<div id="'
			+ options.rowId
			+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="'
			+ $.jgrid.nav.edittitle
			+ '" onclick="edit(\''+id+'\',\''+category+'\',this,event);"><span class="ui-icon ui-icon-pencil"></span></div>';
		}
	}
	if (gridPermissionMap && gridPermissionMap.deferred_deletePermission) {
		if(rowObject.auditStatus == 1 || rowObject.auditStatus == 5){
			editDiv += '<div id="'
				+ options.rowId
				+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="'
				+ $.jgrid.nav.edittitle
				+ '" onclick="deletePend(\''+pendId+'\',\''+category+'\',this,event);"><span class="ui-icon ui-icon-trash"></span></div>';
		}
	}
	return editDiv;
}

function deletePend(pendId, category, obj, event){
	var params = {
		"id" : pendId
	};
	var actionUrl = "tlb/defect_dd_flow_delete.action";
	if(pendId != "" && pendId != null){
		$.dialog.confirm('Are you sure to delete?', function(){
			$.ajax({
				url: actionUrl,
				data: params,
				dataType: "json",
				cache: false,

				success: function (obj, textStatus) {
					var data = JSON.parse(obj);
  	                if (data.ajaxResult == "success") {
						//$("#common_list_grid").jqGrid('delRowData',n);
  	                	 /*var arr = selectIds.toString().split(',');
	  					   $.each(arr,function(i,n){
	  							 if(arr[i]!=""){
	  							 }
	  		               });*/
						$.dialog.alert("Delete Success");

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
}

function dateTimeFormatter(cellvalue){
	if(!cellvalue){
		return ""
	}
    return new Date(cellvalue).Format("yyyy-MM-dd hh:mm:ss")
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

function formaterProfession(cellValue, options, rowObject){
	if(cellValue == '1'){
		return "电子";
	}else if(cellValue == '2'){
		return '电气';
	}else if(cellValue == '3'){
		return '机械';
	}else if(cellValue == '4'){
		return '动力';
	}else if(cellValue == '5'){
		return '其他';
	}else{
		return "";
	}
}

function formatDfrlCategory(cellvalue, options, rowObject){
	if(cellvalue == 'a'){
		var fh = rowObject.fh;
		var fc = rowObject.fc;
		var calendarDay = rowObject.calendarDay;
		var flightDay = rowObject.flightDay;
		var returnValue = "A:";
		if(fh != null){
			returnValue = returnValue + fh + "FH";
		}
		if(fc != null){
			returnValue = returnValue + fc + "FC";
		}
		if(calendarDay != null){
			returnValue = returnValue + calendarDay + "日历日";
		}
		if(flightDay != null){
			returnValue = returnValue + flightDay + "飞行日";
		}
		return returnValue;
	}else if(cellvalue == 'b'){
		return 'B:三天';
	}else if(cellvalue == 'c'){
		return 'C:十天';
	}else if(cellvalue == 'd'){
		return 'D:一百二十天';
	}else if(cellvalue == 'other'){
		var fh = rowObject.fh;
		var fc = rowObject.fc;
		var calendarDay = rowObject.calendarDay;
		var flightDay = rowObject.flightDay;
		var returnValue = "OTHER:";
		if(fh != null){
			returnValue = returnValue + fh + "FH";
		}
		if(fc != null){
			returnValue = returnValue + fc + "FC";
		}
		if(calendarDay != null){
			returnValue = returnValue + calendarDay + "日历日";
		}
		if(flightDay != null){
			returnValue = returnValue + flightDay + "飞行日";
		}
		return returnValue;
	}else{
		return "";
	}
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
function assignPend(defectInfo, acreg, gid,refresh){
	let filter = {
		"openPageType": "DEFECT",
		"ac": acreg
	};
	$.chooseFlight({
		filter: filter,
		success: function(data){
			editMccRemark(data, defectInfo, gid)
		}
    });

}

function editRemark(id,gid){
    //remark edit
	var url = basePath + "/views/defect/monitor/edit_remark.shtml";
	var P = getOpener();
	var paramas = {
		id:id,
		gid: gid,
		type: "EDIT",
		refresh: function(){
			$(`#${gid}`).sfaQuery().reloadQueryGrid();
		}
	};
	P.$.dialog({
		id : 'edit_Remark',
		title : 'Edit Remark',
		width:	'400px',
	    height: '200px',
		esc:true,
        lock:true,
        cache:false,
		max: false,
        min: false,
        parent:this,
		content : 'url:' + url,
		data : paramas,
		close : function(){
			$("#"+gid).closest("tr").prev("tr").find("img").click();
			/*var tds = P.$.find(".align_right");
			$(tds).each(function(){
				var _this = $(this);
				var clickValue=_this.find("img").attr("onclick");
				if(clickValue.indexOf("32")>0|| clickValue.indexOf("34")>0){
					$(_this).find("#mccRefresh").click();
				}
			})*/
			if ($(document).sfaQuery()) {
				$(document).sfaQuery().reloadQueryGrid();
			}
		},
	});
}

function editMccRemark(flightInfo, defectInfo, gid){
	let typeId = gid.replace(/[^0-9]/ig, "");
    //assign
	var url = basePath + "/views/defect/monitor/edit_remark.shtml";
	var P = getOpener();
	var params = {
		id: flightInfo.CURRENT_TASK_ID,
		acId: flightInfo.ACID,
		acReg: flightInfo.AC,
		ata: defectInfo.ata,
		cardId: defectInfo.defectId,
		cardNumber: defectInfo.defectNo,
		station: flightInfo.STATION,
		jobDate: flightInfo.FLIGHT_DATE,
		flightId: flightInfo.FLIGHT_ID,
		flightNo: flightInfo.FLIGHT_NO,
        workType: workTypeDict[typeId] || "DEFECT",
		type: "MCC",
		refresh: function(){
			if( !!$(`#${gid}`) && !!$(`#${gid}`).sfaQuery()) {
				$(`#${gid}`).sfaQuery().reloadQueryGrid()
			}
		}
	};
	P.$.dialog({
		id : 'edit_Remark',
		title : 'Edit Remark',
		width:	'400px',
	    height: '200px',
		esc:true,
        lock:true,
        cache:false,
		max: false,
        min: false,
        parent:this,
		content : 'url:' + url,
		data : params,
		close : function(){
			$("#"+gid).closest("tr").prev("tr").find("img").click();
			/*var tds = P.$.find(".align_right");
			$(tds).each(function(){
				var _this = $(this);
				var clickValue=_this.find("img").attr("onclick");
				if(clickValue.indexOf("32")>0|| clickValue.indexOf("34")>0){
					$(_this).find("#mccRefresh").click();
				}
			})*/
			if ($(document).sfaQuery()) {
				$(document).sfaQuery().reloadQueryGrid();
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
	function assignDefectDialog(options){
		P.$.dialog({
			id : 'assign_' + options.type,
			title : 'Assign ' + options.type,
			top : '60px',
			width :  '1070px',
			height:'600px',
			content : 'url:' + basePath + "/tbm/tbm_station_task.jsp",
			data : options,
			close : function(){
				var gid = "#"+options.gid;
				$(gid).closest("tr").prev("tr").find("img").click();
				/*var tds = P.$.find(".align_right");
				$(tds).each(function(){
					var _this = $(this);
					var clickValue=_this.find("img").attr("onclick");
					if(clickValue.indexOf("32")>0|| clickValue.indexOf("34")>0 || clickValue.indexOf("35")>0){
						$(_this).find("#mccRefresh").click();
					}
				});*/
				if ($(document).sfaQuery()) {
					$(document).sfaQuery().reloadQueryGrid();
				}
			}
		});
	}
function formatFlightInfo (cellvalue, options, rowObject) {
	if(rowObject.category =='DFRL'){
		if(1==rowObject.assignFlag || 2==rowObject.assignFlag){
			//已下发,返回值
			return isEmpty(cellvalue)?"":cellvalue;
		}else{
			//未下发返回空
			return "";
		}
	}else{
		if("1"==rowObject.assignFlag){
			//已下发，返回值
			return isEmpty(cellvalue)?"":cellvalue;
		}else{
				//未下发，返回空
			return "";
		}
	}
}
//判断字符是否为空的方法
function isEmpty(obj){
	if(typeof obj == "undefined" || obj == null || obj == ""){
		return true;
	}else{
		return false;
	}
}

function formatMrNo (cellvalue, options, rowObject) {
	if(!cellvalue){
		return "";
	}
	let mrArray = cellvalue.split(",");
	let mrStr = "";
	for(i = 0; i < mrArray.length; i++) {
		let mr = mrArray[i];
		if (mrStr==""){
			mrStr = "MR"+mr.substring(1,mr.length);
		}else{
			mrStr = mrStr+",MR"+mr.substring(1,mr.length);
		}
	}
	return mrStr;
}
function formatFlightDate (cellvalue, options, rowObject) {
	if(rowObject.category =='DFRL'){
		if(1==rowObject.assignFlag || 2==rowObject.assignFlag){
			//已下发,返回值
			return dateTimeFormatter(cellvalue,options,rowObject);
		}else{
			//未下发返回空
			return "";
		}
	}else{
		if("1"==rowObject.assignFlag){
			//已下发，返回值
			return dateTimeFormatter(cellvalue,options,rowObject);
		}else{
			//未下发，返回空
			return "";
		}
	}
}
function formatAssignDefect (cellvalue, options, rowObjectInp) {
	var assignDiv = '';var editDiv ='';

	var rowObject = rowObjectInp;
    //rowObject.faultReportChnchn = "";
    //rowObject.faultReportChn = "";
    rowObject.faultReportEng = "";
    rowObject.defectDescChn = "";
    rowObject.defectDescEng = "";
    //rowObject.takenActionChn = "";
    rowObject.takenActionEng = "";
    rowObject.tlbFaultReportChn = "";
    rowObject.tlbFaultReportEng = "";
    rowObject.description = "";
    rowObject.workLog = "";

	assignDiv = '<div style="padding-left:8px" id="'
			+ options.rowId
			+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Assign"'
			+ ' onclick=\'assignPend('
			+ JSON.stringify(rowObject).replace(/\'/g,"&rsquo;")
			+ ',\"'
			+ rowObject.acReg
		+ '\",\"'
			+ options.gid
			+'\","refresh")\'><span class="ui-icon ui-icon-gear"></span></div>';
	editDiv = '<div style="padding-left:8px" id="'
		+ options.rowId
		+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Edit"'
		+ ' onclick=editRemark(\"'
		+ options.rowId
		+ '\",\"'
		+ options.gid
		+ '\")><span class="ui-icon ui-icon-pencil"></span></div>';
	if(rowObject.status==2)
	{
		return "";
	}
	if(rowObject.category =='DFRL'){
		if(1==rowObject.assignFlag || 2==rowObject.assignFlag){
			return editDiv;
		}else{
			return assignDiv + editDiv;
		}
	}else{
		if("1"==rowObject.assignFlag){
			return editDiv;
		}else{
			return assignDiv + editDiv;
		}
	}
}

function customerizeStaus(cellValue, options, rowObject){
	if(cellValue == '1'){
		return "OPEN";
	}else if(cellValue == '2'){
		return 'CLOSE';
	}else{
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
			+ ' style="color:#f60" onclick="viewDefect(this,event);" >'
			+ rowObject.defectNo + '</a>';
}

//解析日期函数
function paserDate(dateStr) {
	// edit by wxw
	if(!dateStr){
		return ""
	}
    return new Date(dateStr);
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
	return '<a href="#" id="' + rowObject.defectId + '" style='+sty+' onclick="viewDeferred(this,event,\''+ rowObject.defectId +'\');"  >' + (cellvalue == null? 'View' : cellvalue) +'</a>';
}
//pend 编号 链接
function formaterPendNo(cellvalue, options, rowObject) {
	var fun = 'viewPend(this,event,\''+ rowObject.defectId +'\')';
	return '<a href="#" id="' + rowObject.defectId + '" style="color:#f60" onclick="'+fun+'"  >' + (cellvalue == null? 'View' : cellvalue) +'</a>';
}
//剩余小时、天数、循环数
function formaterReMain(cellvalue,options,rowObject){
	var span = '';
	if(rowObject.deferredNo == null){
		span = '<div style="width : 95%"></div>';
	}else{
		if (rowObject.dfrlCategory == 'b'
			|| rowObject.dfrlCategory=='c' || rowObject.dfrlCategory=='d'){
			if(rowObject.categoryDayRemain != null && rowObject.categoryDayRemain != ''){
				span = '<div style="width : 95%"> '+rowObject.categoryDayRemain+'day</div>';
			}
		}else if(rowObject.dfrlCategory=='a' || rowObject.dfrlCategory=='other'){
			span = '<div style="width : 95%"> ';
			//天数
			if(rowObject.categoryDayRemain != null && rowObject.categoryDayRemain != ''){
				span += rowObject.categoryDayRemain+'day<br/>';
			}
			if(rowObject.fcRemain != null && rowObject.fcRemain != ''){
				span += rowObject.fcRemain+'FC<br/>';
			}
			if(rowObject.fhRemain != null && rowObject.fhRemain != ''){
				span += rowObject.fhRemain+'FH<br/>';
			}
			if(rowObject.calendarDayRemain != null && rowObject.calendarDayRemain != ''){
				span += rowObject.calendarDayRemain+'日历日<br/>';
			}
			if(rowObject.flightDayRemain != null && rowObject.flightDayRemain != ''){
				span += rowObject.flightDayRemain+'飞行日<br/>';
			}
			span += '</div>'
		}
	}
	return span;
}
//pof标记
function formaterPof(cellvalue,options,rowObject){
	var span='';
	if(rowObject.stationMRStatus==1){//满足
		span = '<div style="word-break: break-all; white-space: normal;background-color:green;padding:2px 0px;width : 95%"> '+ cellvalue  + '</div>';
	}else if(rowObject.stationMRStatus==2){//部分满足
		span = '<div style="word-break: break-all; white-space: normal;background-color:yellow;padding:2px 0px;width : 95%"> '+ cellvalue  + '</div>';
	}else if(rowObject.stationMRStatus==3){//不满足
		span = '<div style="word-break: break-all; white-space: normal;background-color:red;padding:2px 0px;width : 95%"> '+ cellvalue  + '</div>';
	}else{
		if(cellvalue=='' || cellvalue==null){
			span = '<div style="width : 95%"></div>';
		}else{
			span = '<div style="width : 95%"> '+cellvalue+'</div>';
		}
	}
	return span;
}

function formaterReference(cellvalue, options, rowObject) {
	if (cellvalue == "MEL") {
		return '<a href="#" style="color:#f60" >' + (cellvalue == null? 'View' : cellvalue) +'</a>';
	}
	return cellvalue;
}

function formatTlbStr(cellValue, options, rowObject){
	if(cellValue!=null){
		var span = '<div style="word-break: break-all; white-space: normal;width : 95%"> '+ cellValue  + '</div>';
		return span;
	}
	return "";
}

function viewDefect(rowObj, event) {
	var curHeight;
	if( window.screen.height < 800){
		curHeight = $(window).height()*1.1.toString()
	}else{
		curHeight = '700'
	}
	let title = "【故障详情----" + rowObj.text + "】";
	ShowWindowIframe({
        width: "1000",
        height: curHeight,
        title: title,
        param: {defectId: rowObj.id, defectNo: rowObj.text},
        url: "/views/defect/defectDetails.shtml"
    });

	/*
	var url = basePath + '/tlb/defect_info_view.action?id=' + rowObj.id;
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
			//$(document).sfaQuery().reloadQueryGrid();
		}
	});
	*/
}

function viewPend(rowObj, event, defectId){
	let title = `【故障推迟查看】`;
    let param = {
        defectId: defectId,
		operation: "PEND"
	};
    ShowWindowIframe({
        width: "1100",
        height: "700",
        title: title,
        param: param,
        url: "/views/defect/viewPending.shtml"
    });

}

function viewDeferred(rowObj, event, defectId) {
    let title = `【故障保留查看】`;
    let param = {
        defectId: defectId,
		operation: "DEFERRAL"
	};
    ShowWindowIframe({
        width: "1100",
        height: "700",
        title: title,
        param: param,
        url: "/views/defect/viewPending.shtml"
    });


	/*
    var url = basePath + '/tlb/defect_pend_view_viewPend.action?id=' + rowObj.id+'&category='+category;
    var titleName = "View Deferred Information";

    if(null !=category && category =='PEND'){
        titleName = "View Pend Information";
    }
    P.$.dialog({
        title : titleName,
        width : '1024px',
        height : '500px',
        esc : true,
        max : false,
        min : false,
        lock : true,
        content : 'url:' + url,
        close : function() {
            //$(document).sfaQuery().reloadQueryGrid();
        }
    });
    */
}
