var customModelSettings = {
	'DEFECT_CONTROL' : {
		// 列表项配置
		gridOptions : {
			allColModels : {
				'defectNo': {
					formatter: formaterDefectNo
				},
				"postfltStation" : {
					formatter : formaterPosFlt
				},
				"updateStatus":{
					name : 'Updated',
                    colNameCn: 'Updated',
					colNameEn : 'Updated',
					formatter: formaterUpdateStatus,
					width : 50
				},
				"status" :{
                    formatter: formaterStaus,
                    formatType: "map",
                    pattern: {
                        "O": "OPEN",
                        "M": "MONITOR",
                        "C": "CLOSE"
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
				'assign' : {
					name : 'Assign',
                    colNameCn: 'Assign',
					colNameEn : 'Assign',
					isOpts : true,
					width : 50,
					formatter : formatAssignDefect
				},
				"updateTime": {
					formatter: dateTimeFormatter
				},
				"creatTime": {
					formatter: dateTimeFormatter
				},
				"flogDate": {
					formatter: formatFlightDate
				},
				'flogFlight': {
					formatter: formatFlightInfo
				},
				'flogStation': {
					formatter: formatFlightInfo
				},
				'mrNo': {
					formatter: formatMrNo
				}
			}
		}
	}
};

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
function formatFlightInfo (cellvalue, options, rowObject) {
	if(null == rowObject.assignFlag && rowObject.status!='C'){
		//未下发 返回空
		return "";
	}else if("1"==rowObject.assignFlag){
		return isEmpty(cellvalue)?"":cellvalue;
	}else{
		return isEmpty(cellvalue)?"":cellvalue;
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
function formatFlightDate (cellvalue, options, rowObject) {
		if(null == rowObject.assignFlag && rowObject.status!='C'){
			//未下发 返回空
			return "";
		}else if("1"==rowObject.assignFlag){
			return dateTimeFormatter(cellvalue,options,rowObject);
		}else{
			return dateTimeFormatter(cellvalue,options,rowObject);
		}
}
function formatAssignDefect (cellvalue, options, rowObjectInp) {
	var assignDiv = '';

    var rowObject = rowObjectInp;
    //rowObject.faultReportChnchn = "";
    //rowObject.faultReportChn = "";
    rowObject.faultReportEng = "";
    rowObject.defectDescChn = "";
    rowObject.defectDescEng = "";
    rowObject.takenActionChn = "";
    rowObject.takenActionEng = "";
    rowObject.tlbFaultReportChn = "";
    rowObject.tlbFaultReportEng = "";
    rowObject.description = "";
    //rowObject.workLog = "";
	assignDiv = '<div style="padding-left:8px" id="'
			+ options.rowId
			+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Assign"'
			+ ' onclick=\'assignPend('
			+ JSON.stringify(rowObject).replace(/\'/g,"&rsquo;") //处理JSON中的单引号，避免传参时单引号截断问题
			+ ',\"'
			+ rowObject.acReg
			+ '\",\"' 
			+ options.gid
			+'\","refresh")\'><span class="ui-icon ui-icon-gear"></span></div>';
//	assignMonitor ='<div style="padding-left:8px" '+
//			'" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Assign"'+
//			' onclick=addMccLinkDefect(\"'+
//			rowObject.defectNo +
//			'\",\"'+
//			rowObject.acReg+
//			'\","edit")><span class="ui-icon ui-icon-gear"></span></div>';
//		if(null != rowObject.status && rowObject.status=='M'){
//			return assignMonitor;
//		}else{
			if(null == rowObject.assignFlag && rowObject.status!='C'){
				return assignDiv;
			}else if("1"==rowObject.assignFlag){
				return "";
			}else{
				return "";
			}
//		}
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
var workTypeDict = {
	32: "DD",
	34: "PEND",
	35: "MCC",
};

function dateTimeFormatter(cellvalue){
	if(!cellvalue){
		return ""
	}
    return new Date(cellvalue).Format("yyyy-MM-dd hh:mm:ss")
}

function addMccLinkDefect(defectNo,acReg,doType){
	var actionUrl = basePath + "/work/mcc_assign_task_generateAdd.action";
	var params = {
				  "taskMCC.docNo" : defectNo,
				  "taskMCC.acReg" : acReg
				 };
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
				P.$.dialog({
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

function formaterStaus(cellValue, options, rowObject){
	if(cellValue == 'O'){
		return "OPEN";
	}else if(cellValue == 'M'){
		return 'MONITOR';
	}else if(cellValue == 'C'){
		return 'CLOSE';	
	}
	else{
		return "";
	}
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

function formaterUpdateStatus(cellValue, options, rowObject){
	var updateTime = convertDateFromString(rowObject.updateTime);
	if(updateTime){
		var updateTimes = updateTime.getTime();
		var currentTimes = new Date().getTime();
		var timeDifference = currentTimes-updateTimes;
		var oneDayTime = 60*60*24*1000;
		//更新超过24小时就提示红旗图标
		if(timeDifference<oneDayTime){
            var html = '<div style="padding-left:8px;width:16px;height:16px;margin:0 auto;padding:0px;"><span class="ui-icon ui-icon-flag" ></span></div>';
			return html;
		}
	}
	return "";
}

function convertDateFromString(dateString) {
	if (typeof dateString == "string") {
        var date = new Date(dateString.replace(/-/, "/"));
		return date;
	}
}

function getUser(cellvalue, options, rowObject) {
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
	return '<a href="#" id=' + rowObject.id
			+ ' style="color:#f60" onclick="viewDefect(this,event);" >'
			+ rowObject.defectNo + '</a>';
}
//航后站处理
function formaterPosFlt(cellValue, options, rowObject) {
	var span='';
	if(rowObject.stationMRStatus==1){//满足
		span = '<div style="word-break: break-all; white-space: normal;background-color:green;padding:2px 0px;width : 95%"> '+ cellValue  + '</div>';
	}else if(rowObject.stationMRStatus==2){//部分满足
		span = '<div style="word-break: break-all; white-space: normal;background-color:yellow;padding:2px 0px;width : 95%"> '+ cellValue  + '</div>';
	}else if(rowObject.stationMRStatus==3){//不满足
		span = '<div style="word-break: break-all; white-space: normal;background-color:red;padding:2px 0px;width : 95%"> '+ cellValue  + '</div>';
	}else{
		if(cellValue=='' || cellValue==null){
			span = '<div style="width : 95%"></div>';
		}else{
			span = '<div style="width : 95%"> '+cellValue+'</div>';
		}
	}
	return span;
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

}
