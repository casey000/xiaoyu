var customModelSettings = {
		'TLB_TECH_LOG' : {
			//列表项配置
			gridOptions :{
				allColModels : {
					'engineType' : {
						formatter: customerizeEng
					},
					'engineSN' : {
						formatter: customerizeEngSn
					},
					'tlbNo': {
						formatter: viewFun
					},
					'auditStatus' :{
						formatter: custAuditStatus
					},
					"faultReportChn" :{
						formatter : formatTlbStr
					},
					"faultReportEng" :{
						formatter : formatTlbStr
					},
					"takenActionChn" : {
						formatter : formatTlbStr
					},
					"takenActionEng" :{
						formatter : formatTlbStr
					},
					"dateFound": {
						formatter : dateTimeFormatter
					},
					"dateAction": {
						formatter : dateTimeFormatter
					},
					"reliabilityCategory":{
						/*formatter:formatReliabilityCat*/
					},
					"type":{
						formatter:formatItemStr
					},
					"pnOff":{
						formatter:formatItemStr
					},
					"snOff":{
						formatter:formatItemStr
					},
					"pnOn":{
						formatter:formatItemStr
					},
					"snOn":{
						formatter:formatItemStr
					},
					"position":{
						formatter:formatItemStr
					},
					"flag":{
						isOpts : true,
						width : 55,
						formatter:formatFlagStr
					},
					"reliabilityRefTlb" : {
						formatter:formatRefTlbNo
					},
					"edit" : {
						name : 'Edit',
						colNameEn : 'Edit',
						isOpts : true,
						width: 50,
						formatter : function(cellValue, options, rowObj) {
							if(rowObj.status == 'C'||rowObj.defectId){
								return '';
							}
							var vauth = "TLB_EDIT";
							var result = VALID_AUTH(vauth);
							var ele = '';
							if(result){
								ele = '<div id="rowData_' + rowObj.tlbId+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-edit" title="Edit"></div>';
								$("#rowData_" + rowObj.tlbId).die("click").live("click", function(event){
									edit(rowObj, event);
								});
							}
							return ele;

						}
					},
					'delete'   : {
						name : 'Delete',
						colNameEn : 'Delete',
						isOpts : true,
						width: 50,
						formatter : function(cellValue, options, rowObj) {
							var vauth = "TLB_DELETE";
							var result = VALID_AUTH(vauth);
							var ele = '';
							if(result){
								ele = '<div id="rowData1_' + rowObj.tlbId+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-Empty" title="Del"></span></div>';
								$("#rowData1_" + rowObj.tlbId).die("click").live("click", function(event){
									del(rowObj, event);
								});
							}
							return ele;
						}
					}
				},
				optsCols : [], //要显示的操作列,默认值:[]
				optsFirst : true,
				jqGridSettings :{
					//jqGrid配置项
					id : "tlbId"
				}
			}
		}		
};
//操作列
function operation(cellval,options,rowObject){
	//删除
	var delDiv = "";
	delDiv = '<div style="padding-left:8px" id="' + options.rowId
	+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Delete"'
	+ ' onclick="confirmDel(this,event);"><span class="ui-icon ui-icon-close"></span></div>';
	return delDiv;
}

//删除
function confirmDel(obj,event){
	if (!obj.id) {
		$.dialog.alert("Please select Date!");
		return false;
	}
	if(confirm("你确定要删除当前TLB吗？")){
		$.ajax({
			url : basePath + "/tlb/tlb_techlog_deleteTLBById.action",
			dataType : "json",
			type : "post",
			data : {"id" : obj.id},
			success : function(data){
				var ajaxRs = $.parseJSON(data);
				if(ajaxRs.ajaxResult == 'failure'){
					$.dialog.alert(ajaxRs.msg);
				}else{
					$.dialog.alert('Delete Success',function(){
						$(document).sfaQuery().reloadQueryGrid();
					});
				}
			}
		});
	}
}


//可靠性关联TLB号
function formatRefTlbNo(cellValue, options, rowObject)
{
	var refTlbNo = "";
	var type = rowObject.ctrlDocType;
	refTlbNo = rowObject.reliabilityRefTlb || "";
	if(!refTlbNo){
		if(type == "TLB"){
			refTlbNo = rowObject.ctrlDocNo || '';
		}
	}
	return refTlbNo;
}

function showPen(ele){
	$(ele).parent().find("img").show();
}

function hiddenPen(ele){
	$(ele).parent().find("img").hide();
}

/*function formatReliabilityCat(cellValue, options, rowObject){
	var reliabilityCat = rowObject.reliabilityCategory;

	if(gridPermissionMap.editReliability){
		var showMark = '';
		if(reliabilityCat != null){
			showMark = '<span id="rcId" onmouseover="showPen(this);" onmouseout="hiddenPen(this);" style="color:#f60">'+ reliabilityCat +'</span>'+'<img id="imgId" style="display:none;" src="'+ basePath + '/css/easyui/icons/pencil.png" />';
		}else{
			showMark = '<img src="'+ basePath + '/css/easyui/icons/pencil.png" />';
		}
		var trHTML = '<a id="reliability_' + rowObject.tlbId + '" href="javascript:void(0)">' + showMark + '</a>';

		$("#reliability_" + rowObject.tlbId).die().live("click", function(){
			//editReliabilityCat(rowObject);
		});
		return trHTML;
	}else{
		return reliabilityCat == null ? "" : reliabilityCat;
	}
}*/

//删除重复性
/*function editReliabilityCat(rowObject){
	$.ajax({
        url :"tlb/tlb_techlog_queryTlbReliabilityInfo.action",
        type : 'post',
		cache: false,
		dataType: "json",
        data: {
        	'techLog.tlbId' : rowObject.tlbId
        },
        success : function(data) {
			data = JSON.parse(data);
			if(data.ajaxResult == 'success'){
				P.$.dialog({
					id : 'modify_reliabilitycat',
					title : 'Modify Reliability Cat.',
					top : '30%',
					width : '600px',
					height : '300px',
					data : {
						"rowObject" : rowObject,
						"ctrlDocType" : data.ctrlDocType,
						"ctrlDocNo" : data.ctrlDocNo,
						"reliabilityRefTlb" : data.reliabilityRefTlb,
					},
					content : 'url:' + basePath + "/tlb/tlb_reliabilityCat.jsp"
				});
			}else{
				if (data.message != null && data.message != "") {
					P.$.dialog.alert(data.message);
				}
			}
		}
     });
}*/

function showInfo(ele,flight, flightDate, checkType){
	$(ele).attr("title", 'flight:' + flight + '\r\nflightDate:'+ flightDate + '\r\ncheckType:' + checkType);
	
}

function formatFlagStr(cellValue, options, rowObject){
	if(rowObject.flag==0){
		var trHTML = '';
		trHTML += '<a href="javascript:void(0)" style="color:#f60" id="showInfo" onclick="showDetaiInfo(\'';
		trHTML += rowObject.tlbNo;
		trHTML = trHTML + '\',' + "'" + rowObject.acReg + "'";
		trHTML += ')">Assigned</a>';
		return trHTML;
	}else if(rowObject.flag==1){
		return 'ToDD';
	}else if(rowObject.flag==2){
		return 'ToNRC';
	}
	return formatAssign(rowObject.flag, options, rowObject);
	//return "";
}

function showDetaiInfo(tlbno, acreg){	
	P.$.dialog({
		id : 'assign_tlb',
		title : 'Assign TLB',
		top : '60px',
		width :  '800px',
		height:'500px',
		content : 'url:' + basePath + "/tbm/tbm_taskDetail_viewInfo.action?tlb.tlbNo="+tlbno
	});
}

function formatDDStr(cellValue, options, rowObject){
	if(cellValue!=null){
		var span = '<div style="text-overflow:ellipsis; overflow:hidden; width:110px;height:30px;line-height:30px;white-space:nowrap;"> '+ cellValue  + '</div>';
		return span;	
	}
	return "";
}

function formatTlbStr(cellValue, options, rowObject){
	if(cellValue!=null){
		var span = '<div style="word-break: break-all; white-space: normal;width : 95%"> '+ cellValue  + '</div>';
		return span;	
	}
	return "";
}

function custRefItem(cellValue, options, rowObject){
	if(null == rowObject.referItem){
		return rowObject.referOther;
	}else if(null == rowObject.referOther){
		return rowObject.referItem;
	}
	
}

function custRef(cellValue, options, rowObject){
	if(cellValue == 'MEL'){
		return "MEL";
	}else if(cellValue == 'CDL'){
		return 'CDL';
	}else{
		return "Other";
	}
}

//客户化EALE的显示值
function customerizeEALE(cellValue, options, rowObject){
	if(cellValue == 'a'){
		return "A";
	}else if(cellValue == 'b'){
		return 'B:三天';
	}else if(cellValue == 'c'){
		return 'C:十天';
	}else if(cellValue == 'd'){
		return 'D:一百二十天';	
	}else{
		return "";
	}
}

function custAuditStatus(cellValue, options, rowObject){
	if(rowObject.flowInstanceId == null){
		return "";
	}
	if(cellValue == '1'){
		return "UNSUBMIT";
	}else if(cellValue == '2'){
		return 'SUBMITTED';
	}else if(cellValue == '3'){
		return 'APPROVED';
	}else if(cellValue == '4'){
		return 'REJECTED';	
	}
	else{
		return "";
	}
}

function customerizeEng(cellValue, options, rowObject){
	if(cellValue == '1'){
		return "ENG 1";
	}else if(cellValue == '2'){
		return 'ENG 2';
	}else if(cellValue == '3'){
		return 'APU';
	}else if(cellValue == '4'){
		return 'ENG 4';	
	}else if(cellValue == 'apu'){
		return 'APU';	
	}
	else{
		return "";
	}
}

function customerizeEngSn(cellValue, options, rowObject){
	/*if(cellValue == null){
		return "";
	}
	
	if(cellValue.indexOf('{')==-1 && cellValue.indexOf('}')==-1){
		return cellValue;
	}
	var obj = JSON.parse(cellValue);
	var arr = $.map(obj,function(v,k){
		if(k == '1'){
			return "ENG 1 :" + v;
		}else if(k == '2'){
			return 'ENG 2 :' + v;
		}else if(k == '3'){
			return 'ENG 3 :' + v;
		}else if(k == '4'){
			return 'ENG 4 :' + v;	
		}else if(k == 'apu'){
			return 'APU :' + v;	
		}
	});
	return arr.join("<br/>");*/
	if(cellValue == null){
		return "";
	}
	return cellValue;
}

function flbFormatTime(time){
	var hour = parseInt(time / 60) ;
	var minute = time % 60;
	hour = hour >= 10 ? hour : ("0" + hour);
	minute = minute >= 10 ? minute : ("0" + minute);
	return hour + ":" + minute;
}

function flbParseTime(timeStr){
	var str = timeStr.split(":");
	if(str.length == 1){
		return parseInt(str[0]) * 60;
	}else{
		return parseInt(str[0]) * 60 + parseInt(str[1]);
	}
}

function formatAssign(cellvalue, options, rowObject){
	var trHTML = '';
	if(null == rowObject.flag){
		trHTML += '<a href="javascript:void(0)" onclick="assignTLB(\'';
		trHTML += rowObject.tlbNo;
		trHTML = trHTML + '\',' +"'" + rowObject.acReg + "', function(){$(document).sfaQuery().reloadQueryGrid();}";
		trHTML += ');"><img src="'+ basePath + '/css/easyui/icons/pencil.png" /></a>';
	}
	return trHTML;
}

function viewFun(cellvalue, options, rowObject) {
	
	var fun = "viewSource(this,event)";
	var sty = '';
	if (rowObject.isMrTrOk) {
		//条件满足: 绿色
		sty = 'color:green';
	}else{
		//不满足: 红色
		sty = 'color:red';
	}
	
	if(rowObject.tlbStatus == 'CLOS'){
		sty = 'color:black';
	}
	
	return '<a href="#" id="' + rowObject.tlbNo + '" style='+sty+' onclick=\'viewTlb('+ JSON.stringify(rowObject).replace(/\'/g,"&rsquo;") +')\'>' + cellvalue +'</a>';
}

function viewTlb(rowObj){
    var params = {
        operation: "edit",
        tlbId: rowObj.tlbId
    };
    // let title = `【Defect No:${rowObj.defectNo}】Edit Defect Base Info`;
    let title = `【查看TLB信息:${rowObj.tlbNo}】`;
    ShowWindowIframe({
        width: "1000",
        height: "700",
        title: title,
        param: params,
        url: "/views/defect/tlb/viewTlb.shtml"
    });
}

function viewFun2(cellvalue, options, rowObject) {
	if(cellvalue!=null && cellvalue!=''){	
		var fun = "viewDD(this,event)";
		return '<a href="#" id="' + rowObject.ddNo + '" style="color:#f60" onclick="' + fun + '"  >' + cellvalue +'</a>';
	}else{
		return "";
	}
}

function viewDD(obj, event) {
	var sourceID = $(obj).attr('id');
	
	var parameters = {
			"tlbDeferredDefect.ddNo" : sourceID
		};

	var actionUrl = basePath + "/tlb/tlb_ddi_signup_view.action?tlbDeferredDefect.ddNo="+sourceID;

	P.$.dialog({
		title : 'DDI View',
		width : '1070px',
		height : '750px',
		top : '80px',
		content : 'url:' + actionUrl,
		data : parameters
	});
    
}

function viewSource(obj, event) {
	var sourceID = $(obj).attr('id');
	
	var parameters = {
			"techLog.tlbNo" : sourceID
		};

	var actionUrl = basePath + '/tlb/tlb_techlog_view.action?techLog.tlbNo='+sourceID;

	P.$.dialog({
		title : 'Tlb View',
		width : '1070px',
		height : '550px',
		top : '80px',
		content : 'url:' + actionUrl,
		data : parameters
	});
}

function formatItemStr(cellvalue, options, rowObject) {
	if(cellvalue == null){
		return "";
	}
	
	var arr = cellvalue.split(",");
	return arr.join("<br>");
}

function dateTimeFormatter(cellvalue){
	if(!cellvalue){
		return ""
	}
    return new Date(cellvalue).Format("yyyy-MM-dd hh:mm:ss")
}