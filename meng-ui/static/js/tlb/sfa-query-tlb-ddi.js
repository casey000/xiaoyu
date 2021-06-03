var customModelSettings = {
		'TLB_DDI' : {
			//列表项配置
			gridOptions :{
				allColModels : {
					'ddNo' : {
						formatter: viewFun2
					},					
					'tlbNo' : {
						formatter: viewFun
					},
					'category' :{
						formatter: customerizeEALE
					},
					"referItem" :{
						formatter : custRefItem
					},
					"defectDescChn" :{
						formatter : formatDDStr
					},
					"defectDescEng" : {
						formatter : formatDDStr
					},
					"repairActChn" :{
						formatter : formatDDStr
					},
					"repairActEng" :{
						formatter : formatDDStr
					},
					"flag":{
						isOpts : true,
						width : 55,
						formatter : formatFlagStr,
						//sortable:false
					},
					'countsEffect' :{
						sortable : false
					},
					'countsAll' :{
						sortable : false
					}/*,
					"assign" :{
						isOpts : true,
						width : 30,
						formatter : formatAssign
					}*/
				},
				
				jqGridSettings :{
					//jqGrid配置项
					id : "ddId"
				}
			}
		}		
};


function formatAssign(cellvalue, options, rowObject){
	var trHTML = '';
	if(null == rowObject.flag){
	trHTML += '<a href="javascript:void(0)" onclick="assignDD(\'';
	trHTML += rowObject.ddNo;
	trHTML = trHTML + '\',' +"'" + rowObject.acReg + "', function(){$(document).sfaQuery().reloadQueryGrid();}";
	trHTML += ');"><img src="'+ basePath + '/css/easyui/icons/pencil.png" /></a>';
	}
	return trHTML;
}

function viewFun2(cellvalue, options, rowObject) {
	var fun = "viewDD(this,event)";
	var sty = 'color:black';
	
	if (rowObject.auditStatus == 1 || rowObject.auditStatus == 2){
		//未审核: 黄色
		sty = 'color:#a0a030';
	} else if (rowObject.auditStatus == 3){
		//未批准: 橙色
		sty = 'color:orange';
	} else if (rowObject.auditStatus == 4){
		//已批准: 灰色
		sty = 'color:gray';
	}
	
	if (rowObject.auditStatus == 4 && rowObject.isMrTrOk){
		//条件满足: 绿色
		sty = 'color:green';
	}

	if(rowObject.status == 'OPEN'){
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
	
	if(rowObject.status == 'CLOS'){
		sty = 'color:black';
	}
	
	return '<a href="#" id="' + rowObject.tlbNo + '" style='+sty+' onclick="' + fun + '"  >' + (cellvalue == null? 'View' : cellvalue) +'</a>';
}

function viewDD(obj, event) {
	var sourceID = $(obj).attr('id');
	
	var parameters = {
			"tlbDeferredDefect.tlbNo" : sourceID
		};

	var actionUrl = basePath + "/tlb/tlb_ddi_signup_view.action?tlbDeferredDefect.ddNo=&tlbDeferredDefect.tlbNo="+sourceID;

	P.$.dialog({
		title : 'DDI View',
		width : '1070px',
		height : '750px',
		top : '80px',
		content : 'url:' + actionUrl,
		data : parameters
	});
    
}

function showInfo(ele,flight, flightDate, checkType){
	$(ele).attr("title", 'flight:' + flight + '\r\nflightDate:'+ flightDate + '\r\ncheckType:' + checkType);
	
}

function showDetaiInfo(ddNo, acreg){	
	P.$.dialog({
		id : 'assign_tlb',
		title : 'Assign DD',
		top : '60px',
		width :  '800px',
		height:'500px',
		content : 'url:' + basePath + "/tbm/tbm_taskDetail_viewInfo.action?ddi.ddNo="+ddNo
	});
}

function formatFlagStr(cellvalue, options, rowObject) {
	if(rowObject.flag==0){
		//return 'Assigned';
		var trHTML = '';
		trHTML += '<a href="javascript:void(0)" style="color:#f60" id="showInfo" onclick="showDetaiInfo(\'';
		trHTML += rowObject.ddNo;
		trHTML = trHTML + '\',' + "'" + rowObject.acReg + "'";
		trHTML += ')">Assigned</a>';
		return trHTML;
	}else if(rowObject.ddNo==null){
		return "";
	}
	return formatAssign(rowObject.flag, options, rowObject);
	//return "";
}

function viewFun(cellvalue, options, rowObject) {
	
	var fun = "viewSource(this,event)";
	var sty =  'color:#f60';
	return '<a href="#" id="' + rowObject.tlbNo + '" style='+sty+' onclick="' + fun + '"  >' + cellvalue +'</a>';
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
		height : '750px',
		top : '80px',
		content : 'url:' + actionUrl,
		data : parameters
	});
    
}

//客户化EALE的显示值
function customerizeEALE(cellValue, options, rowObject){
	return rowObject.ddDueDataStr
}

function custRefItem(cellValue, options, rowObject){
	if(null == rowObject.referItem){
		return rowObject.referOther;
	}else if(null == rowObject.referOther){
		return rowObject.referItem;
	}
}

function formatDDStr(cellValue, options, rowObject){
	if(cellValue!=null){
		var span = '<div style="word-break: break-all; white-space: normal;width : 95%"> '+ cellValue  + '</div>';
		return span;	
	}
	return "";
}

//解析日期函数
function paserDate(dateStr) {
	if(dateStr == null){
		return "";
	}
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