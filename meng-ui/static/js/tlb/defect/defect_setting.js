var customModelSettings = {
	'DEFECT_BASE_INFO' : {
		// 列表项配置
		gridOptions : {
			allColModels : {
				'engineType' : {
					formatter: customerizeEng,
					formatType: "map",
					pattern: {
						"1": "ENG 1",
						"2": "ENG 2",
						"1,2": "ENG 1,ENG 2",
						"1,3": "ENG 1,APU",
						"2,3": "ENG 2,APU",
						"1,2,3": "ENG 1,ENG 2,APU"
					}
				},
				'engineSn' : {
					formatter: customerizeEngSn
				},
                // 'technicianFound': {
                // 	formatter : getUser
                // },
				'workLogUpdaterSn': {
					formatter : getUser2
				},
				'defectCategory': {
					formatter : formaterDdefectCategory
				},
				'flag' :{
					name : 'flag',
					colNameEn : 'Process',
					isOpts : true,
					width : 80,
					formatter : formaterProcess
				},
				'defectNo': {
					formatter: formaterDefectNo
				},
				"faultReportChn" :{
					formatter : formatTlbStr
				},
				"faultReportEng" :{
					formatter : formatTlbStr
				},
				"status" :{
					formatter: customerizeStaus,
					formatType: "map",
					pattern: {
						"O": "OPEN",
						"M": "MONITOR",
						"C": "CLOSE"
					}
				},
				"type" :{
					formatter : customerizeType
				},
				"technicianFound": {
					formatter: formatReportedBy
				},
				"dateFound": {
					formatter: dateTimeFormatter
				},
				"dateAction":{
					formatter: dateTimeFormatter
				},
				"edit" : {
					name : 'E',
					colNameEn : 'E',
					isOpts : true,
					width: 25,
					formatter : function(cellValue, options, rowObj) {
						if(rowObj.status == 'C'){
							return '';
						}
						var vauth = "DEFECT_EDIT";
						var result = VALID_AUTH(vauth);
						var ele = '';
						if(result){
							ele = '<div id="rowData_' + rowObj.id+ '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-edit" auth="DEFECT_ADD" title="Edit"></div>';
							$("#rowData_" + rowObj.id).die("click").live("click", function(event){
								edit(rowObj, event);
							});
						}
						return ele;
					}
				},
				"del" : {
					name : 'D',
					colNameEn : 'D',
					isOpts : true,
					width: 25,
					formatter : function(cellValue, options, rowObj) {
						if(rowObj.isStructureDamage == 'y'){
							return '';
						}
						var vauth = "DEFECT_DELETE";
						var result = VALID_AUTH(vauth);
						var ele = '';
						if(result){
							ele = '<div id="rowData1_' + rowObj.id+ '" auth="DEFECT_ADD" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-Empty" title="Del"></span></div>';
							$("#rowData1_" + rowObj.id).die("click").live("click", function(event){
								del(rowObj, event);
							});
						}
						return ele;
					}
				}
			}
		}
	}
};

function dateTimeFormatter(cellvalue){
	if(!cellvalue){
		return ""
	}
    return new Date(cellvalue).Format("yyyy-MM-dd hh:mm:ss")
}

function formatReportedBy(cellValue, options, rowObject){
	// console.info(rowObject);
    return `${rowObject.name}(${rowObject.sn})`
}

function customerizeEng(cellValue, options, rowObject){
	if(cellValue == '1'){
		return "ENG 1";
	}else if(cellValue == '2'){
		return 'ENG 2';
	}else if(cellValue == '3'){
		return 'APU';	
	}else if(cellValue == '1,2'){
		return "ENG 1,ENG 2"
	}else if(cellValue =='1,3'){
		return "ENG 1,APU";
	}else if(cellValue =='2,3'){
		return "ENG 2,APU";
	}else if(cellValue == '1,2,3'){
		return "ENG 1,ENG 2,APU";
	}
	else{
		return "";
	}
}
function customerizeEngSn(cellValue, options, rowObject){
	if(cellValue == '{}'){
		return "";
	}else if(cellValue ==null){
		return "";
	}else{
		return cellValue;
	}
}

function customerizeStaus(cellValue, options, rowObject){
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

function getUser2(cellvalue, options, rowObject) {
	if (rowObject.workLogUpdaterName) {
		return rowObject.workLogUpdaterName + '(' + rowObject.workLogUpdaterSn + ')';
	}
	return "";
}

function formaterDefectNo(cellValue, options, rowObject) {
	return '<a href="#" id=' + rowObject.id
			+ ' style="color:#f60" onclick="viewDefect(this,event);" >'
			+ rowObject.defectNo + '</a>';
}
function formaterProcess(cellValue, options, rowObject) {
	if(cellValue == '1'){
		return "【待确认】";
	}else if(cellValue == '2'){
		return '【已确认】';
	}
	else{
		return '【待确认】';
	}
}
function formaterDdefectCategory(cellValue, options, rowObject) {
	if(cellValue == '1'){
		return "液体渗漏";
	}else if(cellValue == '2'){
		return '缺陷';
	}else if(cellValue == '3'){
		return '一般';
	}else if(cellValue == '4'){
		return '重大';
	}
	else{
		return "";
	}
}


function formatTlbStr(cellValue, options, rowObject){
	if(cellValue!=null){
		var span = '<div style="word-break: break-all; white-space: normal;width : 95%"> '+ cellValue  + '</div>';
		return span;	
	}
	return "";
}

function viewDefect(rowObj,event){
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


	// var url= basePath + '/tlb/defect_info_view.action?id='+rowObj.id;
 // 	P.$.dialog({
 // 		title : 'View Defecte Information',
 // 		width : '1000px',
 // 		height : '520px',
 // 		top : '20%',
 // 		esc:true,
 // 		cache:false,
 // 		max: false, 
 // 		min: false,
 // 		lock : true,
 // 		parent:this,
 // 		content:'url:'+url,
 // 		data : {
 // 			edit : false,
 // 			revise : false
 // 		},
 // 		close: function(){
 // 			//$(document).sfaQuery().reloadQueryGrid();
 // 		}
 //     });
}
