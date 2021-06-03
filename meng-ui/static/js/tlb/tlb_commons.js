//重置编号
function resetNo(tableId, clasName){
	if(clasName == null){
		clasName = "tlb_itemno";
	}
	
	//重置第一列序号
	var tds = $("#" + tableId).find("tr:visible td." + clasName);
	$.each(tds, function(i, ele){
		$(ele).html(i + 1);
	});
}

//获取表单数据
function getItems(tableId, className, pre){
	var items = [];
	var trs = $("#" + tableId + " tr." + className);
	$.each(trs, function(i, tr) {
		var item = {};
		// input标签
		$.each($(tr).find("input[name^='" + pre +"']"), function(key, ele) {
			if(($(ele).attr("type") == "radio" || $(ele).attr("type") == "checkbox") && !$(ele).is(":checked")){
				return;
			}
			var name = $(ele).attr("name");
			item[name] = $(ele).val();
		});
		
		//select
		$.each($(tr).find("select[name^='" + pre +"']:enabled"), function(key, ele) {
			var name = $(this).attr("name");
			item[name] = $(this).val();
		});
		items.push(item);
	});
	return items;
}

//添加验证
function addValid(ele){
	ele.validate({
		debug : true,
		onkeyup : false,
		errorElement : "div",
//
//		rules: {
//			'techLog.ata': {
//				remote:{
//					url:basePath + '/tlb/tlb_techlog_validateAta.action', 
//					data:{
//						'techLog.acReg' : function(){
//							return $('#tlb_regno').val();
//						}
//					}
//				}
//		    }
//		},
		
		errorPlacement : function(error, element) {
			error.appendTo(element.closest("td").find("div.errorMessage"));
		},

		highlight : function(element, errorClass) {
			$(element).addClass(errorClass);
		},

		success : function(label) {
			label.remove();
		}
	});
	
	validMultiName($("#tlb_signup"));
}

//用于相同name标签验证(必须设置不同的id)
function validMultiName(ele){
	ele.data("validator").elements = function() {
		var validator = this;

		return $(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function() {
			if (!this.name && validator.settings.debug && window.console) {
			}
			if (!validator.objectLength($(this).rules())) {
				return false;
			}
			return true;
		});
	};
}

//显示或者隐藏必填项
function showOrHideRequired(names, show, contentEle){
	$.each(names, function(i, name){
		var ele;
		if(contentEle == null){
			ele = $("[name='" + name + "']");
		}else{
			ele = contentEle.find("[name='" + name + "']");
		}
		var parent = getParant(ele, "td");
		if(show){
			ele.addClass("required");
			parent.find(".td-font-red").show();
		}else{
			ele.removeClass("required");
			parent.find(".td-font-red").hide();
		}
	});
}

//显示或者隐藏必填项
function showOrDisable(names, show, contentEle){
	$.each(names, function(i, name){
		var ele;
		if(contentEle == null){
			ele = $("[name='" + name + "']");
		}else{
			ele = contentEle.find("[name='" + name + "']");
		}
		var parent = getParant(ele, "td");
		if(show){
			ele.attr("disabled", false);
		}else{
			ele.attr("disabled", true)
			ele.val("");
		}
	});
}

//获取父亲节点
function getParant(ele, tagName){
	var parent = ele.parent();
	if(parent.is(tagName)){
		return parent;
	}else {
		return ele.parentsUntil(tagName).last().parent();
	}
}

//用户名称sn联动
function userSn(paramName, value, callback, toTip){
	if(value == null || value == '' || paramName == "" || paramName == null){
		return;
	}
	
	var data = {};
	data[paramName] = $.trim(value);
	
	$.ajax({
		url : "tlb_techlog_getUserInfo.action",
		data : data,
		dataType : "json",
		type : 'POST',
		cache : false,
		
		success : function(obj, textStatus) {
			obj = JSON.parse(obj);
			if(obj.ajaxResult == "success"){
				callback(obj);
			}else if(toTip == null || toTip){
				$.dialog.alert("Cann't find user with " + paramName + ":" + value + ".");
			}
		}
	});
}

//显示或者隐藏按钮组
function showOrHideBtn(bnts, show){
	$.each(bnts, function(i, bnt){
		if(show){
			bnt.show();
		}else{
			bnt.hide();
		}
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