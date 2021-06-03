/**
 * TLB/NRC/EO/JC 弹出框选择
 * defaultParam : 通用查询默认查询配置参数，比如：
 * 		defaultParam = {
			"pageModel.qname" : {
				0 : 'na'
			},
			"pageModel.qoperator" : {
				0 : 'sql'
			},
			"pageModel.qvalue" : {
				0 : "({alias}.AVAILABLE_STATUS in (5,6,7,8))"
			}
		};
 * callback ： 选择记录后的回调函数（未提供调用默认的回调函数，比如defaultCallback）
 * 
 */

function queryDialog(type, defaultParam, callback){
	var dialogs = {
		"TLB" : queryTlbDialog,
		"TO" : queryToDialog,
		"DD" : queryDDDialog,
		"NRC" : queryNrcDialog,
		"EO" : queryEoDialog,
		"JC" : queryJcDialog,
		"WO" : queryWoDialog,
		"AC" : queryAircraftDialog,
		"DEFECT" : queryDefectDialog,
		"WORKTROUBLE" : queryWorkTroubleDialog,
		"CONFIGSYSTEMSBASE" : queryConfigSystemsBaseDialog,
		"CONFIGSYSTEMS" : queryConfigSystemsDialog
	};
	
	var queryDialogFun = dialogs[type];
	if(queryDialogFun){
		queryDialogFun(defaultParam, callback);
	}else{
		(this).$.dialog.alert("不支持的弹框查询类型.");
	}
}

function queryDDDialog(defaultParam, callback){
	var o = {
		"cardNo" : "ddNo",
		"cardId" : "ddId"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_dd_dlg",
		dialogTitle : "Select DD",
		view : "V_TLB_DDI_QUERY",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}

function queryWoDialog(defaultParam, callback){
	var o = {
		"cardNo" : "wono",
		"cardId" : "id"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_wo_dlg",
		dialogTitle : "Select Wo",
		view : "PPC_WORKORDER",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}

function queryAircraftDialog(defaultParam, callback){
	var o = {
		"cardNo" : "tail",
		"cardId" : "acId"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_ac_dlg",
		dialogTitle : "Select Aircraft",
		view : "D_MINI_SPEC_BASE",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}

function queryTlbDialog(defaultParam, callback){
	var o = {
		"cardNo" : "tlbNo",
		"cardId" : "tlbId"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_tlb_dlg",
		dialogTitle : "Select TLB",
		view : "D_TLB_TECH_LOG",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}


function multiSelectDefectDialog(defaultParam, callback){
	queryDefectDialog(defaultParam, callback, true);
}

function queryDefectDialog(defaultParam, callback, multiselect = false){
	var o = {
		"cardNo" : "defectNo",
		"cardId" : "id"
	};
	let button = [{
			name : "close"
		}]
	if(multiselect){
		button.unshift({
			name : "save",
			callback : function(){
				let res = [];
				let originalData = [];
				let sfaQuery = this.data.sfaQuery
		    	let grid = sfaQuery.queryGrid.jqGrid; 
		    	if(grid.find('tr.ui-state-highlight').length>0){
		    		$.each(grid.find('tr.ui-state-highlight'),function(i,val){
		    			let defectId = $(val).attr("id");
	    				let rowData = sfaQuery.queryGrid.jqGrid.getRowData(defectId);
						let defectNo = $(rowData.defectNo).text();
		    			res.push({
		    				defectId: defectId,
		    				defectNo: defectNo,
							acId:rowData.acId,
							acReg:rowData.acReg,
		    				ata:rowData.ata
		    			})
		    			originalData.push(rowData)
		    		})
		    	}
		    	callback(res, originalData)
			}
		})
	}

	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_defect_dlg",
		dialogTitle : "Select Defect",
		view : "D_DEFECT_BASE_INFO",
		dialogWidth : 1000,
		button: button,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			jqGridSettings :{
				//jqGrid配置项
				multiselect : multiselect
			},
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}


function queryNrcDialog(defaultParam, callback){
	var o = {
		"cardNo" : "nrcNo",
		"cardId" : "id"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_nrc_dlg",
		dialogTitle : "Select NRC",
		view : "V_NRC",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}

function queryEoDialog(defaultParam, callback){
	var o = {
		"cardNo" : "eoNumber",
		"cardId" : "id"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_eo_dlg",
		dialogTitle : "Select EO",
		view : "D_EO_LIST",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			allColModels : {
				'eoNumber':{
					formatter : function(cellvalue, options, rowObject){
						return cellvalue;
					}
				}
			},
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}

function queryJcDialog(defaultParam, callback){
	var o = {
		"cardNo" : "jcNo",
		"cardId" : "id"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_jc_dlg",
		dialogTitle : "Select JC",
		view : "D_JC_LIST",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			allColModels : {
				'jcNo' : {
					formatter : function(cellvalue, options, rowObject){
						return cellvalue;
					}
				}
			},
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}

function queryWorkTroubleDialog(defaultParam, callback){
	var o = {
		"cardNo" : "monitorNo",
		"cardId" : "id"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_worktrouble_dlg",
		dialogTitle : "Select trouble folllow up",
		view : "D_TROUBLE_DETAIL_QUERY",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}

function queryToDialog(defaultParam, callback){
	var o = {
		"cardNo" : "toNumber",
		"cardId" : "id"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_to_dlg",
		dialogTitle : "Select TO",
		view : "V_TO_LIST",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}

function queryConfigSystemsBaseDialog(defaultParam, callback){
	var o = {
		"cardNo" : "sysNo",
		"cardId" : "id"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_ConfigSystemsBase_dlg",
		dialogTitle : "Select Sys.Config.NO",
		view : "V_SYS_CONFIG_SETTING",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}

function queryConfigSystemsDialog(defaultParam, callback){
	var o = {
		"cardNo" : "sysEffNo",
		"cardId" : "id"
	};
	var dlg = $(this).sfaQueryDialog({
		dialogId : "srh_ConfigSystems_dlg",
		dialogTitle : "Select Sys.Config.NO",
		view : "V_SYS_CONFIG_EFF",
		dialogWidth : 1000,
		qcOptions : {
			qcBoxId : 'qc_box',
			showSavedQueries : false
		},
		defaultParam : defaultParam,
		gridOptions : {
			allColModels : {
				'flowStatus':{formatter : statusFun},
				'ver':{formatter : verFun},
				'ownerId':{formatter : userFun}
			},
			callback : function(rowdata, originalData) {
				selectRowCallback(rowdata, originalData, dlg, o, callback);
			}
		}
	});
}
/**
 * 状态
 */
function statusFun(cellvalue, options, rowObject){
	var status = "";
	if("1"==cellvalue){
		status = "Edit";
	}else if("2"==cellvalue){
		status = "Checking";
	}else if("3"==cellvalue){
		status = "Active";
	}
	return status;
}

//版本
function verFun(cellvalue, options, rowObject){
	return "R"+cellvalue;
}

/**
 * 显示用户
 */
function userFun(cellvalue, options, rowObject){
	if(cellvalue){
		return cellvalue.name+'('+cellvalue.sn+')';
	}
	return '';
}

function selectRowCallback(rowdata, originalData, dlg, o, callback){
	if(callback == null){
		defaultCallback(rowdata, originalData, dlg, o);
	}else{
		callback(rowdata, originalData, dlg, o);
	}
}

/**
 * 选择后的默认回调
 * @param rowdata
 * @param originalData
 * @param dlg
 * @param o : 对应的字段定义
 */
function defaultCallback(rowdata, originalData, dlg, o){
	$("#cardNo").val(originalData[o.cardNo]);
	$("#cardId").val(originalData[o.cardId]);
	
	dlg.close();
}
