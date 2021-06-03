$(function()
{
//漏油 Yes/No 按钮
	$("input[name='variables.isHasOil']").on("change", function()
	{
		var _this = $(this);
		
		if(_this.val() == 'y')
		{
		//被选中
			$("#tr_dd_oil").show();
		}
		else
		{
		//取消选中
			$("#tr_dd_oil").hide();
		}
	});
	
	$("input[name='techLog.isHasOil']").on("change", function()
	{
		var _this = $(this);
		
		if(_this.val() == 'y')
		{
		//被选中
			$("#tr_dd_oil").show();
		}
		else
		{
		//取消选中
			$("#tr_dd_oil").hide();
		}
	});	
	
// Ewis	
	$("input[name='variables.isHasEwis']").on("change", function()
	{
		var _this = $(this);
		
		if(_this.val() == 'y')
		{
		//被选中
			$("#tr_dd_ewis").show();
		}
		else
		{
		//取消选中
			$("#tr_dd_ewis").hide();
		}
	});
	
	$("input[name='techLog.isHasEwis']").on("change", function()
	{
		var _this = $(this);
		
		if(_this.val() == 'y')
		{
		//被选中
			$("#tr_dd_ewis").show();
		}
		else
		{
		//取消选中
			$("#tr_dd_ewis").hide();
		}
	});
	
// Pending
	$(".oilRadio").on("change", function()
	{
		var _this = $(this);
		
		if(_this.val() == 'y')
		{
		//被选中
			$("#tr_dd_oil").show();
		}
		else
		{
		//取消选中
			$("#tr_dd_oil").hide();
		}
	});
	
	$(".ewisRadio").on("change", function()
	{
		var _this = $(this);
		
		if(_this.val() == 'y')
		{
		//被选中
			$("#tr_dd_ewis").show();
		}
		else
		{
		//取消选中
			$("#tr_dd_ewis").hide();
		}
	});	
	
//漏油类型选择其他	
	$(".otherOilType").click(function()
	{
		var checked = $(this).attr("checked");
		if(checked == "checked")
		{
			$(this).parent().next().attr("disabled", false);
		}
		else
		{
			$(this).parent().next().val("");
			$(this).parent().next().attr("disabled", "disabled");
		}
	});
	
// 新增附件行	
	$(".add_ewis_oil_file_btn").click(function()
	{
		var node = $(this).closest("table").find("tr").last().clone(true);
		node.find("input[type='file']").val("");		
		$(this).closest("table").append(node);
	});
	
// 删除附件行
	$("img[name='del_ewis_oil_file_btn']").click(function() 
	{
		var fileSize = $(this).closest("table").find("tr[class='upload_tr']").length;
		if(fileSize == 1)
		{
			alert("当前只有一个附件上传框,不允许再删除。");
			return false;
		}
		
		$(this).closest("tr").remove();
	});
	
// 删除已经上传的附件
	$("img[name='del_uploaded_file_btn']").click(function() 
	{
		$(this).closest("tr").remove();
	});
	
// Ewis选择其他类型
	$(".otherEwisType").click(function()
	{
		var checked = $(this).attr("checked");
		if(checked == "checked")
		{
			$(this).parent().next().attr("disabled", false);
		}
		else
		{
			$(this).parent().next().val("");
			$(this).parent().next().attr("disabled", "disabled");
		}
	});
})

//增加漏油行
function add_oil_div(img_oj)
{
	var oil_obj = $("#oilTds");
	var detail_obj = $('.oilDetailTable', oil_obj).last().clone(true);
	
	//更改名字、清空value
	var i = 0;
	$.each($('input,select', detail_obj),function()
	{
		this.name = change_name(this.name);

		var _type = this.type;
		
		if(_type == "checkbox")
		{
			$(this).attr("checked",false);
		}
		else if(_type == "file")
		{
			this.value = '';
			
			if(i > 0)
			{
				$(this).closest("tr").find("img").click();
			}
			
			i++;
		}
		else if(_type == "hidden")
		{
			var _name = $(this).attr("name");
			if(_name.indexOf("oilAttaIds") > -1)
			{
				$(this).closest("tr").find("img").click();
			}
		}
		else
		{
			this.value = '';
		}
	});
	
	$.each($("div[class='oilTypeErrorMsg']", detail_obj),function()
	{
		$(this).html("");
	});
	
	$.each($("div[class='oilFileErrorMsg']", detail_obj),function()
	{
		$(this).html("");
	});
	
	oil_obj.append(detail_obj);
}

function change_name(name)
{
	if(!name) return "";
	
	var result = name.match(/\d/g)[0];
	
	 var position =name.indexOf(result);
	 return name.substring(0, position) + (parseInt(result) + 1)
			+ name.substring(position + result.length);
}

function del_oil_div(img_oj)
{
	var oilList = $(".oilDetailTable");
    if(oilList.length == 1)
    {
		alert("当前只有一个油液渗漏数据表格, 不允许删除。");
    	return false;
    }
	
	var _table = $(img_oj).closest("table");
	
	if(_table)
	{
		$(img_oj).closest("table").remove();
	}
}

// 增加Ewis行
function add_ewis_div(img_oj)
{
	var ewis_obj = $("#ewisTds");
	var detail_obj = $('.ewisDetailTable', ewis_obj).last().clone(true);
	
	//更改名字、清空value
	var i = 0;
	$.each($('input,select', detail_obj),function()
	{
		this.name = change_name(this.name);

		var _type = this.type;
		
		if(_type == "checkbox")
		{
			$(this).attr("checked",false);
		}
		else if(_type == "file")
		{
			this.value = '';
			
			if(i > 0)
			{
				$(this).closest("tr").find("img").click();
			}
			
			i++;
		}
		else if(_type == "hidden")
		{
			var _name = $(this).attr("name");
			if(_name.indexOf("ewisAttaIds") > -1)
			{
				$(this).closest("tr").find("img").click();
			}
		}
		else
		{
			this.value = '';
		}
	});
	
	$.each($("div[class='compTypeErrorMsg']", detail_obj),function()
	{
		$(this).html("");
	});
	
	$.each($("div[class='ewisTypeErrorMsg']", detail_obj),function()
	{
		$(this).html("");
	});
	
	$.each($("div[class='ewisFileErrorMsg']", detail_obj),function()
	{
		$(this).html("");
	});
	
	ewis_obj.append(detail_obj);
}

// 删除Ewis行
function del_ewis_div(img_oj)
{
	var ewisList = $(".ewisDetailTable");
    if(ewisList.length == 1)
    {
    	alert("当前只有一个Ewis数据表格, 不允许删除。");
    	return false;
    }
    
	var _table = $(img_oj).closest("table");
	
	if(_table)
	{
		$(img_oj).closest("table").remove();
	}
}

//校验Ewis
function checkEwisInput()
{
	var ewisFlag = true;
	
	if($("input[name='variables.isHasEwis']")[0].checked)
	{
		$(".compTypeErrorMsg").html("");
		$(".ewisTypeErrorMsg").html("");
		$(".ewisFileErrorMsg").html("");
		
		var ewisTables = $(".ewisDetailTable");
		
		$(ewisTables).each(function()
		{
		//校验部件类型
			$(this).find("select[name$='componentType']").each(function()
			{
				var compType = this.value;
				
				if(!compType)
				{
					$(this).next().html("This field is required.");
					ewisFlag = false;
					return false;
				}
			});
			
		//校验Ewis类型
			var ewisTypeArr = [];
			
			$(this).find("input[name$='ewisType']:checked").each(function() 
			{
				if(this.value)
				{
					ewisTypeArr.push($(this).val());
				}
			});
			
			if(ewisTypeArr.length == 0)
			{
				$(this).find("div[class='ewisTypeErrorMsg']").html("This field is required.");
				ewisFlag = false;
				return false;
			}
			else
			{
				if(ewisTypeArr.indexOf("8") > -1)
				{
				//有选择"其他"
					var otherDes = $(this).find("input[name$='otherDescription']").val();
					otherDes = $.trim(otherDes);
					
					if(!otherDes)
					{
						$(this).find("div[class='ewisTypeErrorMsg']").html("The Other Input is required.");
						ewisFlag = false;
						return false;
					}
				}
			}
			
		// 附件必填校验
			var files = "";
			$(this).find("input[name$='upload']").each(function() 
			{
				if(this.value)
				{
					files += this.value;
				}
			});
			
			if(!files)
			{
				$(this).find("div[class='ewisFileErrorMsg']").html("This field is required.");
				ewisFlag = false;
				return false;
			}
		});
	}
	
	return ewisFlag;
}

// 校验漏油
function checkOilInput()
{
	var oilFlag = true;
	
	if($("input[name='variables.isHasOil']")[0].checked)
	{
		$(".oilComponentErrorMsg").html("");
		$(".oilTypeErrorMsg").html("");
		$(".oilFileErrorMsg").html("");
		
		var oilTables = $(".oilDetailTable");
		
		$(oilTables).each(function()
		{	
		//漏油类型	
			$(this).find("select[name$='oilComponent']").each(function()
			{
				var compType = this.value;
				
				if(!compType)
				{
					$(this).next().html("This field is required.");
					oilFlag = false;
					return false;
				}
			});			
			
		//漏油具体类型	
			var oilTypeArr = [];
			
			$(this).find("input[name$='oilType']:checked").each(function() 
			{
				if(this.value)
				{
					oilTypeArr.push($(this).val());
				}
			});
			
			if(oilTypeArr.length == 0)
			{
				$(this).find("div[class='oilTypeErrorMsg']").html("This field is required.");
				oilFlag = false;
				return false;
			}
			else
			{
				if(oilTypeArr.indexOf("5") > -1)
				{
				//有选择"其他"
					var otherDes = $(this).find("input[name$='otherDescription']").val();
					otherDes = $.trim(otherDes);
					
					if(!otherDes)
					{
						$(this).find("div[class='oilTypeErrorMsg']").html("The Other Input is required.");
						oilFlag = false;
						return false;
					}
				}
			}
			
		// 附件必填校验
			var files = "";
			$(this).find("input[name$='upload']").each(function() 
			{
				if(this.value)
				{
					files += this.value;
				}
			});
			
			if(!files)
			{
				$(this).find("div[class='oilFileErrorMsg']").html("This field is required.");
				oilFlag = false;
				return false;
			}
		});
	}
	
	return oilFlag;
}

//校验Ewis
function checkEditEwisInput(param)
{
	var ewisFlag = true;
	
	if($("input[name='" + param + "']")[0].checked)
	{
		$(".compTypeErrorMsg").html("");
		$(".ewisTypeErrorMsg").html("");
		$(".ewisFileErrorMsg").html("");
		
		var ewisTables = $(".ewisDetailTable");
		
		$(ewisTables).each(function()
		{
		//校验部件类型
			$(this).find("select[name$='componentType']").each(function()
			{
				var compType = this.value;
				
				if(!compType)
				{
					$(this).next().html("This field is required.");
					ewisFlag = false;
					return false;
				}
			});
			
		//校验Ewis类型
			var ewisTypeArr = [];
			
			$(this).find("input[name$='ewisType']:checked").each(function() 
			{
				if(this.value)
				{
					ewisTypeArr.push($(this).val());
				}
			});
			
			if(ewisTypeArr.length == 0)
			{
				$(this).find("div[class='ewisTypeErrorMsg']").html("This field is required.");
				ewisFlag = false;
				return false;
			}
			else
			{
				if(ewisTypeArr.indexOf("8") > -1)
				{
				//有选择"其他"
					var otherDes = $(this).find("input[name$='otherDescription']").val();
					otherDes = $.trim(otherDes);
					
					if(!otherDes)
					{
						$(this).find("div[class='ewisTypeErrorMsg']").html("The Other Input is required.");
						ewisFlag = false;
						return false;
					}
				}
			}
			
		// 已经存在的附件
			var existsFiles = "";
			$(this).find("input[name$='ewisAttaIds']").each(function() 
			{
				if(this.value)
				{
					existsFiles += this.value;
				}
			});
			
			if(!existsFiles)
			{
			// 附件必填校验
				var files = "";
				$(this).find("input[name$='upload']").each(function() 
				{
					if(this.value)
					{
						files += this.value;
					}
				});
				
				if(!files)
				{
					$(this).find("div[class='ewisFileErrorMsg']").html("This field is required.");
					ewisFlag = false;
					return false;
				}
			}
		});
	}
	
	return ewisFlag;
}

// 校验漏油
function checkEditOilInput(param)
{
	var oilFlag = true;
	
	if($("input[name='" + param + "']")[0].checked)
	{
		$(".oilComponentErrorMsg").html("");
		$(".oilTypeErrorMsg").html("");
		$(".oilFileErrorMsg").html("");
		
		var oilTables = $(".oilDetailTable");
		
		$(oilTables).each(function()
		{
		//漏油类型	
			$(this).find("select[name$='oilComponent']").each(function()
			{
				var compType = this.value;
				
				if(!compType)
				{
					$(this).next().html("This field is required.");
					oilFlag = false;
					return false;
				}
			});			
			
		//漏油具体类型	
			var oilTypeArr = [];
			
			$(this).find("input[name$='oilType']:checked").each(function() 
			{
				if(this.value)
				{
					oilTypeArr.push($(this).val());
				}
			});
			
			if(oilTypeArr.length == 0)
			{
				$(this).find("div[class='oilTypeErrorMsg']").html("This field is required.");
				oilFlag = false;
				return false;
			}
			else
			{
				if(oilTypeArr.indexOf("5") > -1)
				{
				//有选择"其他"
					var otherDes = $(this).find("input[name$='otherDescription']").val();
					otherDes = $.trim(otherDes);
					
					if(!otherDes)
					{
						$(this).find("div[class='oilTypeErrorMsg']").html("The Other Input is required.");
						oilFlag = false;
						return false;
					}
				}
			}
			
		// 已经存在的附件
			var uploadedFiles = "";
			$(this).find("input[name$='oilAttaIds']").each(function() 
			{
				if(this.value)
				{
					uploadedFiles += this.value;
				}
			});
			
			if(!uploadedFiles)
			{
			// 附件必填校验
				var files = "";
				$(this).find("input[name$='upload']").each(function() 
				{
					if(this.value)
					{
						files += this.value;
					}
				});
				
				if(!files)
				{
					$(this).find("div[class='oilFileErrorMsg']").html("This field is required.");
					oilFlag = false;
					return false;
				}
			}
		});
	}
	
	return oilFlag;
}