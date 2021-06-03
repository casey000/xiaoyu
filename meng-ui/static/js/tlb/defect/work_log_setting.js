var customModelSettings = {
	'DEFECT_WORK_LOG_INFO':{				
		// 列表项配置
		gridOptions : {
			allColModels : {
				'defectNo' : {
					formatter : formaterDefectNo
                },
                'runningEffect': {
                    formatter: formaterRunningEffect
                }
			}
		}
	}
};

function formaterRunningEffect(cellValue, options, rowObject) {
    if(rowObject.runningEffect && rowObject.runningEffect.indexOf("1") > -1) {
        return "是";
    }
    return "否";
}
function formaterDefectNo(cellValue, options, rowObject) {
	return '<a href="#" id=' + rowObject.id
			+ ' style="color:#f60" onclick="viewDefect(this,event);" >'
			+ rowObject.defectNo + '</a>';
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
	return
}