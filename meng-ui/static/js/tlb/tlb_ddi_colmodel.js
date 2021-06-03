var tlbColModels = {
		
		ddNoModel:{
			'url'  :  basePath + "/tlb/tlb_ddi_query_list.action",
			'listOptions' : {
				'sortname' : "ddNo",
				'sortorder' : "desc",
				'gridCols' : ["ddNo","tlbNo","acReg","mechanic","applyDate","expiredDate","inspector","auditStatus"]				
			},
			'ddNo' : {
				name : 'ddNo',
				colName : 'DDINo',
				index : 'ddNo',
				width : 40,
				align : 'center',
				hidden : false
			},
			'tlbNo' : {
				name : 'tlbNo',
				colName : 'TlbNo',
				index : 'tlbNo',
				width : 40,
				align : 'center',
				hidden : false
			},
			'acReg' : {
				name : 'acReg',
				colName : 'AcReg',
				index : 'acReg',
				width : 40,
				align : 'center',
				hidden : false
			},
			'mechanic' : {
				name : 'mechanic',
				colName : 'Mechanic',
				index : 'mechanic',
				width : 40,
				align : 'center',
				hidden : false
			},
			'applyDate' : {
				name : 'applyDate',
				colName : 'ApplyDate',
				index : 'applyDate',
				width : 40,
				align : 'center',
				hidden : false
			},
			'expiredDate' : {
				name : 'expiredDate',
				colName : 'ExpiredDate',
				index : 'expiredDate',
				width : 40,
				align : 'center',
				hidden : false
			},
			'inspector' : {
				name : 'inspector',
				colName : 'Inspector',
				index : 'inspector',
				width : 40,
				align : 'center',
				hidden : false
			},
			'auditStatus' : {
				name : 'auditStatus',
				colName : 'AuditStatus',
				index : 'auditStatus',
				width : 40,
				align : 'center',
				hidden : false,
				formatter: custAuditStatus
			}
			
		},
		
		tlbNoModel :{
			'url'  :  basePath + "/tlb/tlb_techlog_list.action",
			'listOptions' : {
				'sortname' : "dateFound",
				'sortorder' : "desc",
				'gridCols' : ["tlbNo","status","acReg","faultType","technicianFound","tlbStatus","staFound","dateFound","dateAction","ata"]				
			},
			'tlbId' : {
				name : 'tlbId',
				colName : 'ID',
				index : 'tlbId',
				width : 40,
				align : 'center',
				hidden : true
			}, 
			'tlbNo' : {
				name : 'tlbNo',
				colName : 'Tlb No.',
				index : 'tlbNo',
				width : 40,
				align : 'center',
				hidden : false
			}, 
			'status' : {
				name : 'status',
				colName : 'Status',
				index : 'status',
				width : 40,
				align : 'center',
				hidden : false
			}, 
			'acReg' : {
				name : 'acReg',
				colName : 'A/C',
				index : 'acReg',
				width : 40,
				align : 'center',
				hidden : false
			}, 
			'faultType' : {
				name : 'faultType',
				colName : 'Type',
				index : 'faultType',
				width : 25,
				align : 'center',
				hidden : false
			}, 
			'technicianFound' : {
				name : 'technicianFound',
				colName : 'Report By',
				index : 'technicianFound',
				width : 40,
				align : 'center',
				hidden : false
			}, 
			'tlbStatus' : {
				name : 'tlbStatus',
				colName : 'Tlb Status',
				index : 'tlbStatus',
				width : 40,
				align : 'center',
				hidden : false
			}, 
			'staFound' : {
				name : 'staFound',
				colName : 'Station',
				index : 'staFound',
				width : 40,
				align : 'center',
				hidden : false
			}, 
			'dateFound' : {
				name : 'dateFound',
				colName : 'FoundDate',
				index : 'dateFound',
				width : 65,
				align : 'center',
				hidden : false
			}, 
			'dateAction' : {
				name : 'dateAction',
				colName : 'ActionDate',
				index : 'dateAction',
				width : 65,
				align : 'center',
				hidden : false
			},
			'ata' : {
				name : 'ata',
				colName : 'MEL/ATA',
				index : 'ata',
				width : 40,
				align : 'center',
				hidden : false
			}
		},
		
		tlbDDI : {
			'url'  :  basePath + "/tlb/tlb_ddi_query_listNonMonitor.action",
			'listOptions' : {
				'sortname' : "applyDate",
				'gridCols' : [ 'ddId','acReg','ddNo','tlbNo','reference','category','referItem', 'applyDate','mechanic','station','status','inspector','defectDescChn','defectDescEng','repairActChn','repairActEng']
			},
    		'ddId' : {
    				name : 'ddId',
    				colName : 'ID',
    				index : 'ddId',
    				width : 33,
    				align : 'center',
    				hidden : true
    		}, 
    		
    		'acReg' : {
    			name : 'acReg',
				colName : 'A/C',
				index : 'acReg',
				width : 85,
				align : 'center',
				qcDefine :{
					type : "view",
					modelName : "aircraft",
					value : "tail"
				},
				sortable : true
    		},
    		
    		'ddNo' : {
				name : 'ddNo',
				colName : 'DDI No.',
				index : 'ddNo',
				width : 90,
				align : 'center',
				qcDefine :{
					type : "view",
					modelName : "ddNoModel",
					value : "ddNo",
					defaultParam : {
						'pageModel.qname' : {
							0 : 'ddNo'						
						},
						'pageModel.qoperator' : {
							0 : "notEquals"												
						},
						'pageModel.qvalue' : {
							0 : "null"
						}
					}
				},
				sortable : true,
				formatter:viewFun2
    		},
    		
    		'tlbNo' : {
				name : 'tlbNo',
				colName : 'TLB No.',
				index : 'tlbNo',
				width : 100,
				align : 'center',
				qcDefine :{
					type : "view",
					modelName : "tlbNoModel",
					value : "tlbNo"
				},
				sortable : true,
				formatter:viewFun
    		},
    		
    		'reference' : {
    				name : 'reference',
    				colName : 'Reference',
    				index : 'reference',
    				width : 80,
    				align : 'center',
    				qcDefine :{
    					type : "string"
    				},
    				sortable : true,
    				formatter:custRef
    		},
    		'category' : {
				name : 'category',
				colName : 'Category',
				index : 'category',
				width : 105,
				align : 'center',
				sortable : true,				
				formatter:customerizeEALE
		    },
		    'referItem' : {
				name : 'referItem',
				colName : 'ReferItem',
				index : 'referItem',
				width : 110,
				align : 'center',
				qcDefine :{
					type : "string"
				},
				sortable : true,
				formatter:custRefItem
		    },		    
		    'applyDate' : {
				name : 'applyDate',
				colName : 'ApplyDate',
				index : 'applyDate',
				width : 100,
				align : 'center',
				qcDefine :{
					type : "date"
				},
				sortable : true
		    },
		    'mechanic' : {
				name : 'mechanic',
				colName : 'Mechanic',
				index : 'mechanic',
				width : 110,
				align : 'center',
				qcDefine :{
					type : "string"
				},
				sortable : true
		    },
		    'station' : {
				name : 'station',
				colName : 'Station',
				index : 'station',
				width : 70,
				align : 'center',
				qcDefine :{
					type : "string"
				},
				sortable : true
		    },
		    'status':{
		    	name : 'status',
				colName : 'Status',
				index : 'status',
				width : 80,
				align : 'center',
				sortable : true
		    },		   
		    'inspector':{
		    	name : 'inspector',
				colName : 'Inspector',
				index : 'inspector',
				width : 110,
				align : 'center',
				sortable : true
		    },
		    'defectDescChn':{
		    	name : 'defectDescChn',
				colName : 'DefectDescChn',
				index : 'defectDescChn',
				width : 110,
				align : 'center',
				formatter: formatDDStr
		    },
		    'defectDescEng':{
		    	name : 'defectDescEng',
				colName : 'DefectDescEng',
				index : 'defectDescEng',
				width : 110,
				align : 'center',
				formatter: formatDDStr
		    },
		    'repairActChn':{
		    	name : 'repairActChn',
				colName : 'RepairActChn',
				index : 'repairActChn',
				width : 110,
				align : 'center',
				formatter: formatDDStr
		    },
		    'repairActEng':{
		    	name : 'repairActEng',
				colName : 'RepairActEng',
				index : 'repairActEng',
				width : 120,
				align : 'center',
				formatter: formatDDStr
		    }
		},
		
		tlbData : {
			'url'  :  basePath + "/tlb/tlb_techlog_list.action",
			'listOptions' : {
				'sortname' : "dateFound",
				'gridCols' : [ 'tlbId','tlbNo','status','acReg','faultType','technicianFound','tlbStatus',
				               'staFound','dateFound','dateAction','ata','engineType','auditStatus','engineSN','faultReportChn','faultReportEng','takenActionChn','takenActionEng']
			},
    		'tlbId' : {
    				name : 'tlbId',
    				colName : 'ID',
    				index : 'tlbId',
    				width : 33,
    				align : 'center',
    				hidden : true
    		}, 
    		

    		'tlbNo' : {
				name : 'tlbNo',
				colName : 'TLB No.',
				index : 'tlbNo',
				width : 90,
				align : 'center',
				qcDefine :{
					type : "view",
					modelName : "tlbNoModel",
					value : "tlbNo"
				},
				sortable : true,
				formatter:viewFun
    		},
    		
    		'status' : {
				name : 'status',
				colName : 'Status',
				index : 'status',
				width : 60,
				align : 'center',
				qcDefine :{
					type : "string"
				},
				sortable : true
    		},
    		'acReg' : {
    			name : 'acReg',
				colName : 'A/C',
				index : 'acReg',
				width : 90,
				align : 'center',
				qcDefine :{
					type : "view",
					modelName : "aircraft",
					value : "tail"
				},
				sortable : true
    		},
    		
    		'faultType' : {
    				name : 'faultType',
    				colName : 'FaultType',
    				index : 'faultType',
    				width : 65,
    				align : 'center',
    				qcDefine :{
    					type : "string"
    				},
    				sortable : true
    		},
    		'technicianFound' : {
				name : 'technicianFound',
				colName : 'Report By',
				index : 'technicianFound',
				width : 90,
				align : 'center',
				sortable : true				
		    },
		    'tlbStatus' : {
				name : 'tlbStatus',
				colName : 'TLB Status',
				index : 'tlbStatus',
				width : 80,
				align : 'center',
				qcDefine :{
					type : "string"
				},
				sortable : true
		    },
		    'staFound' : {
				name : 'staFound',
				colName : 'Station',
				index : 'staFound',
				width : 60,
				align : 'center',
				qcDefine :{
					type : "String"
				},
				sortable : true
		    },
		    'dateFound' : {
				name : 'dateFound',
				colName : 'Found Date',
				index : 'dateFound',
				width : 90,
				align : 'center',
				qcDefine :{
					type : "datetime"
				},
				sortable : true
		    },
		    'dateAction' : {
				name : 'dateAction',
				colName : 'Action Date',
				index : 'dateAction',
				width : 90,
				align : 'center',
				qcDefine :{
					type : "datetime"
				},
				sortable : true
		    },
		    'ata' : {
				name : 'ata',
				colName : 'ATA',
				index : 'ata',
				width : 70,
				align : 'center',
				qcDefine :{
					type : "String"
				},
				sortable : true
		    },
		    'engineType' : {
				name : 'engineType',
				colName : 'EngineType',
				index : 'engineType',
				width : 80,
				align : 'center',
				qcDefine :{
					type : "select",
					value: {'1':'ENG 1','2':'ENG 2','3':'ENG 3','4':'ENG 4','apu':'APU'}	
				},
				sortable : true,
				formatter: customerizeEng
		    },
		    'auditStatus' :{
		    	name : 'auditStatus',
				colName : 'Shortage AuditStatus',
				index : 'auditStatus',
				width : 150,
				align : 'center',				
				sortable : true,
				formatter: custAuditStatus
		    },
		    'engineSN':{
		    	name : 'engineSN',
				colName : 'EngApuSn',
				index : 'engineSN',
				width : 100,
				align : 'center',
				sortable : true,
				qcDefine :{
					type : "string"
				}
		    },
		    'faultReportChn':{
		    	name : 'faultReportChn',
				colName : 'FaultReportChn',
				index : 'faultReportChn',
				width : 150,
				align : 'center',
				qcDefine :{
					type : "string"
				},
				formatter:formatTlbStr
		    },
		    'faultReportEng':{
		    	name : 'faultReportEng',
				colName : 'FaultReportEng',
				index : 'faultReportEng',
				width : 150,
				align : 'center',
				qcDefine :{
					type : "string"
				},
				formatter:formatTlbStr
		    },
		    'takenActionChn':{
		    	name : 'takenActionChn',
				colName : 'TakenActionChn',
				index : 'takenActionChn',
				width : 150,
				align : 'center',
				qcDefine :{
					type : "string"
				},
				formatter:formatTlbStr
		    },
		    'takenActionEng':{
		    	name : 'takenActionEng',
				colName : 'TakenActionEng',
				index : 'takenActionEng',
				width : 150,
				align : 'center',
				qcDefine :{
					type : "string"
				},
				formatter:formatTlbStr
		    }
		}
		
};

function formatDDStr(cellValue, options, rowObject){
	if(cellValue!=null){
		var span = '<div style="text-overflow:ellipsis; overflow:hidden; width:110px;height:30px;line-height:30px;white-space:nowrap;"> '+ cellValue  + '</div>';
		return span;	
	}
	return "";
}

function formatTlbStr(cellValue, options, rowObject){
	if(cellValue!=null){
		var span = '<div style="text-overflow:ellipsis; overflow:hidden; width:150px;height:30px;line-height:30px;white-space:nowrap;"> '+ cellValue  + '</div>';
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
	return cellValue == null ? 'Other' : cellvalue;
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
		return 'ENG 3';
	}else if(cellValue == '4'){
		return 'ENG 4';	
	}else if(cellValue == 'apu'){
		return 'APU';	
	}
	else{
		return "";
	}
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

function viewFun(cellvalue, options, rowObject) {
	
	var fun = "viewSource(this,event)";
	return '<a href="#" id="' + rowObject.tlbNo + '" style="color:#f60" onclick="' + fun + '"  >' + cellvalue +'</a>';
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
		height : '750px',
		top : '80px',
		content : 'url:' + actionUrl,
		data : parameters
	});
    
}
$.extend(commonColModels, tlbColModels);
