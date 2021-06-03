//用户名称sn联动(保留原来的，以防其他地方有调用)
function userSn(paramName, value, callback){
	if(value == null || value == '' || paramName == "" || paramName == null){
		return;
	}
	
	var data = {};
	data[paramName] = $.trim(value);
	
	$.ajax({
		url : "tbm_affairHandover_getUserInfo.action",
		data : data,
		dataType : "json",
		type : 'POST',
		cache : false,
		
		success : function(obj, textStatus) {
			obj = JSON.parse(obj);
			if(obj.ajaxResult == "success"){
				callback(obj);
			}else{
				P.$.dialog.alert("Cann't find user with " + paramName + ":" + value + ".");
			}
		}
	});
}

/**
 * 动态选择用户初始化:Name和SN均设置成readOnly，可选择用户和清除用户
 * @param $userName 
 * @param $userSn
 * @param btnAfterName 选择放大镜是否至于Name后面
 * @param selectUserCallBack 选择用户回调函数名
 * @param clearUserCallBack 清除用户回调函数名
 */
function selectUserInit($userName, $userSn, btnAfterName, selectUserCallBack, clearUserCallBack){
	$userName.attr("readonly", "readonly");
	$userSn.attr("readonly", "readonly");
	
	var $selectUserBtn = $('<img class="search_btn_img" id="btn_select_user'+ new Date().getTime() + '" title="Search" src="'+ basePath +'/css/easyui/icons/search.png" width="16" height="16" style="cursor: pointer"/>');
	var $clearUserBtn = $('<img class="search_btn_img" id="btn_clear_user'+ new Date().getTime() + '" title="Clear" src="'+ basePath +'/images/no.png" width="16" height="16" style="cursor: pointer"/>');
	
	if(btnAfterName){		
		$userName.after($clearUserBtn);
		$userName.after($selectUserBtn);
	}else{
		$userSn.after($clearUserBtn);
		$userSn.after($selectUserBtn);
	}
	
	$selectUserBtn.off("click").on("click", function(){
		selectUser({'exclude_self':'2'}, selectUserCallBack);
	});
	
	$clearUserBtn.off("click").on("click", function(){
		clearUser($userName, $userSn, clearUserCallBack);
	});
}


/**
 * 清除用户
 * @param $userName
 * @param $userSn
 * @param callback：若未定义清除用户的回调函数，默认清除用户名和工号
 */
function clearUser($userName, $userSn, callback){
	if(callback == null || typeof(callback) == 'undefined'){
		$userName.val("");
		$userSn.val("");
		return;
	}
	
	callback();
}

/**
 * 
 * @param parameters
 * @param callback
 */
function selectUser(parameters, callback){
	var obj = P.$.dialog({
		title : 'Select User',
		width : '700px',
		height : '500px',
		top : '20%',
		esc:true,
		cache:false,
		resize:false,
		cancel:false,
		drag:false,
		max: false, 
		min: false,
		lock:true,
		parent:this,
		close:function(){
			if(this.data.isOK == 1){
				callback(this.data.result);
			}
		},
		content:'url:' + basePath + '/security/user/select_user_list.jsp',
		data : parameters
	});
}


//解析日期函数
function paserDate(dateStr){
	var dateArr = null; 
	var timeArr = null;
	var arr1 = dateStr.split(" ");
	if(arr1[0] != null){
		dateArr = arr1[0].split("-");
	}
	if(arr1[1] != null){
		timeArr = arr1[1].split(":");
	}
	if(timeArr == null){
		return new Date(dateArr[0], dateArr[1] -1, dateArr[2]);
	}else {
		return new Date(dateArr[0], dateArr[1] -1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);		
	}
}

function formatterDate(date){
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	month = month < 10 ?("0" +  month) : month;
	date = date.getDate();
	date = date < 10 ?("0" +  date) : date;
	return year + "-" + month + "-" + date;
}