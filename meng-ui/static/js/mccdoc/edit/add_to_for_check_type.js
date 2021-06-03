//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;

$(function(){
	let userInfo = getLoginInfo();
	let roleNameArray = [];
	InitFuncCodeRequest_({
		async:false,
		data: {domainCode: 'TO_ADD_PERMISSIONS', FunctionCode: "DATA_DOMAIN_GET"},
		successCallBack: function (jdata) {
			if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
				if(jdata.data){
					$.each(jdata.data.EnumDataList.data,function(i,v){
						roleNameArray.push(v.value);
					});
				}
			} else {
				MsgAlert({content: jdata.msg, type: 'error'});
			}
		}
	});
	if(userInfo.roleName){
		let roleNameList = userInfo.roleName.split(',');
		let roleNum = roleNameList.length;
		$.each(roleNameList,function(i,v){
			if(roleNameArray.indexOf(v) > -1){
				roleNum--;
			}
		});
		if(roleNum == 0){
			$("#troubleshooting").hide();
			$("#aircraftinspection").hide();
		}
	}
});

sub_win.button(
	{
		name:'OK',
		callback: function () {
			save();
			return false;
		}
	}
);

function save() {
	$(".error").remove();
	var type = $("[name='radiobutton']:checked").val();
	var url = "";
	if (type == '1') {
		url = "/views/mccdoc/edit/add_fault_isolate_to.shtml";
	} else if (type == '2') {
		url = "/views/mccdoc/edit/add_general_survey_to.shtml";
	} else if (type == '3') {
		url = "/views/mccdoc/edit/add_other_to.shtml";
	} else if (type == '4') {
		url = "/views/mccdoc/edit/add_other_to.shtml";
	} else {
		var errMsg = '<span class="error">To type is required !</span>';
		$("[name='radiobutton']").nextAll("div.errorMessage").append(errMsg);
        return;
	}
	var parameters = {
        "toType": type,
        "pageType": "add",
        "id": 0
	};
	P.$.dialog({
		id: 'addToDialog1',
		title: 'Add TO',
		width: '1000px',
		height: '600px',
		left: '30%',
		top: '35%',
		esc: true,
		cache: false,
		max: false,
		min: false,
		parent: null,
		lock: true,
		content: "url:" + url,
		data: parameters
	});
	sub_win.close();
}

//底部关闭按钮点击事件
function close_window() {
	window.opener = null;
	window.open('', '_self');
	window.close();
}