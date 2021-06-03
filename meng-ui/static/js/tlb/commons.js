var tlbCommons = {
	qcBox : function(options){
		var o = {
			boxId : "qc_box",
			defCols : null,
			exCludeCols : ["id"],
			defOp : "equals",
			colNum : 2,
			modelName : ""
		};
		
		$.extend(o, options);
		
		var box = $("#" + o.boxId);
		box.addClass("qc_box");
		var conBox = $("<div class='qc_table'></div>");
		var colModels = commonColModels[o.modelName];
		box.append(conBox);
		
		//qc_table
		if(o.defCols != null){
			$(o.defCols).each(function(){
				var model = colModels[this];
				createQc(conBox, model, colModels);
			});
		}else{
			$.each(colModels, function(k,v){
				if($.inArray(k, o.exCludeCols) >= 0){
					return;
				}
				createQc(conBox, v, colModels);
			});
		}
		
		//固定宽度
		conBox.css('minWidth', conBox.width() + 20);
		
		//qc_bnts
		var bnts = $("<div class='qc_bnts'>" +
				"<div><span class='qc_bnt_add'></span><span class='qc_bnt_del'></span></div>" +
				"<div><label><input name='qc_bnt_ao' class='qc_bnt_and' type='radio' checked='checked' /> AND</label>" +
				"<label><input name='qc_bnt_ao' class='qc_bnt_or' type='radio' /> OR</label>" +
				"<span><input class='qc_bnt_srh btn' type='button' value='Search' /></span>" +
				"</div>");
		
		box.append(bnts);
		
		box.find(".qc_bnt_add").click(function(){
			var row = createQc(conBox, null, colModels);
			row.find(".qc_name").change();
		});
		
		box.find(".qc_bnt_del").click(function(){
			var cell = conBox.find(".qc_col").last();
			var row = cell.parent();
			if(row.find(".qc_col").size() == 1){
				row.remove();
			}else{
				cell.remove();
			}
		});
		
		function createQc(conBox, model, colModels){
			var cell = null;
			var qname = null, qoper = null, qvalue = null;
			
			//行
			var row = conBox.find(".qc_row").last();
			var cellCnt = row.find(".qc_col").size();
			if(cellCnt ==0 || cellCnt >= o.colNum){
				row = $("<ul class='qc_row'></ul>");				
				conBox.append(row);
			}
			
			//列
			cell = $("<li class='qc_col'></li>")
			row.append(cell);
			cellCnt = row.children().size();
			
			//条件选择器
			var qname = qcName(model, colModels);
			cell.append(qname);
			
			//操作选择器
			var qoper = qcOper(model);
			cell.append(qoper);
			
			//输入域
			qcValue(cell, model);
			return row;
		};
		
		function qcName(model, colModels){
			var qname = $("<span><select class='qc_name' name = 'pageModel.qname'></select></span>");
			var sel = qname.find(".qc_name");
			$.each(colModels, function(k,v){
				if($.inArray(k, o.exCludeCols) >= 0){
					return;
				}else if(model != null && model.name == v.name){
					sel.append($("<option value='" + k + "' selected='selected'>" + k + "</option>"));
				}else{
					sel.append($("<option value='" + k + "'>" + k + "</option>"));
				}
			});
			
			sel.change(function(){
				var model = colModels[$(this).val()];
				var cell = qname.parent();
				cell.find(".qc_value").parent().remove();
				qcValue(cell, model);
			});
			return qname;
		};
		
		function qcOper(model){
			var qoper = $("<span><select class='qc_oper' name = 'pageModel.qoperator'></select></span>");
			var ops = ["equals", "include", "blank", "notBlank"];
			$(ops).each(function(){
				qoper.find(".qc_oper").append($("<option value='" + this + "'>" + this + "</option>"));
			});
			return qoper;
		};
		
		/**
		 * qcDefine : {
		 * 	type 	: "view",
		 * 	model 	: "flb",
		 *  vallist : ["1","2","3"] 
		 * }
		 */
		function qcValue(cell, model){
			var qcDefine = (model == null) ? null : model.qcDefine;
			var span = $("<span></span>")
			cell.append(span);
			if(qcDefine == null){
				var qvalue = $("<input class='qc_value' name='pageModel.qvalue' />");
				span.append(qvalue);
			}else if(qcDefine.type == "select"){
				//固定结果列表
				var qvalue = $("<select class='qc_value' name='pageModel.qvalue' ></select>");
				$(qcDefine.valList).each(function(){
					qvalue.append($("<option value='" + this + "'>" + this + "</option>"));
				});
				span.append(qvalue);
				
			}else if(qcDefine.type == "date"){
				//日期类型
				var qvalue = $("<input class='qc_value' name='pageModel.qvalue' />");
				span.append(qvalue);
				qvalue.datebox({});
				
			}else if(qcDefine.type == "view"){
				var qvalue = $("<input class='qc_value qc_value_view' name='pageModel.qvalue' />");
				span.append(qvalue);
				
				//列表选择类型
				var bnt = $("<img class='qc_bnt_img' title='Search' src='../css/easyui/icons/search.png'>")
				span.append(bnt);
				
				bnt.click(function(){
					var dialog = tlbCommons.srhDialog({
						dialogId : "qc_dlg_" + qcDefine.name,
						dialogTitle : qcDefine.name,
						modelName : qcDefine.model,
						callback : function(rowdata){
							var val = $(rowdata[qcDefine.name]).text();
							if(val == ''){
								val = rowdata[qcDefine.name];
							}
							qvalue.val(val);
							dialog.close();
						}
					});
				});
			}
			return span;
		}
	},
		
	srhDialog : function(options){
		var o = {
			content : 'url:' + 'tlb/common_list.html'
		};
		$.extend(o, options);
		return this.showDialog(o);
	},
	
	showDialog : function(options){
		var o = {
			dialogWidth : 950,
			dialogHeight : 560,
			dialogTop : "15%",
		};
		$.extend(o, options);
		return $.dialog({
			id : o.dialogId,
			title : o.dialogTitle,
			width : o.dialogWidth,
			height : o.dialogHeight,
			top : o.dialogTop,
			content : o.content,
			data : o
		});
	},
	
	showList : function(options){
		var o = {
			gridId : "tlb_common_list_grid",
			modelName : null,
			gridCols : []
		};
		
		$.extend(o, options);
		
		//获取显示列
		var gridData = commonGridData[o.modelName];
		if(o.gridCols.length == 0){
			$.each(gridData[0], function(k, v){
				o.gridCols.push(k);
			});
		}

		//colnames && colModels
		var colModels = commonColModels[o.modelName];
		var gridColNames = [];
		var gridColModels = [];
		var model = null;
		
		$.each(o.gridCols, function(k,v){
			model = colModels[v];
			if(model == null){
				alert("未找到列定义 : mode|" + o.modelName + "|col|" + v);
			}
			gridColNames.push(model.colName);
			gridColModels.push(model);
			
		});
		
		var setting = {
				datatype : "local",
				data : gridData,
				altRows : true,
				cache : false,
				altclass : 'oddClass',
				width : 945,
				height : 520,
				shrinkToFit : true,
				colNames : gridColNames,
				colModel : gridColModels,
				pager : "gridPager", // 表格数据关联的分页条，html元素

				sortable : true, // 可以排序
				sortname : "id", // 默认排序字段
				sortorder : "desc", // 排序方式

				pginput : true,// 显示跳转页面输入框
				pgbuttons : true,// 显示翻页按钮
				pgtext : '第 {0} 页 共 {1} 页',
				recordtext : '第 {0} - {1}条记录  共  {2} 条  ',

				rowNum : 15, // 每页显示记录数
				rownumbers : true, // 显示行号

				viewrecords : true, // 显示总记录数
				autowidth : false, // 自动匹配宽度
				gridview : true, // 加速显示
				multiselect : false, // 可多选，出现多选框
				multiboxonly : true, // 点击checkbox时该行才被选中
				multiselectWidth : 25, // 设置多选列宽度
				altRows : true,// 隔行变色
				altclass : 'oddClass',

				toolbar : [ true, "top" ],
				gridview : true, // 构造一行数据后添加到grid中，如果设为true则是将整个表格的数据都构造完成后再添加到grid中

				pgbuttons : true, // 是否显示翻页按钮
				pginput : true, // 是否显示跳转页面的输入框

				jsonReader : {
					// 当前页
					page : function(obj) {
						var jsonData = JSON.parse(obj);
						if (jsonData.ajaxResult.indexOf("success") != -1) {
							return jsonData.pageModel.page;
						}
					},
					// 总页数
					total : function(obj) {
						var jsonData = JSON.parse(obj);
						if (jsonData.ajaxResult.indexOf("success") != -1) {
							return jsonData.pageModel.total;
						}

					},
					// 查询出的记录数
					records : function(obj) {
						var jsonData = JSON.parse(obj);
						if (jsonData.ajaxResult.indexOf("success") != -1) {
							return jsonData.pageModel.records;
						}

					},
					// 查询出的记录
					root : function(obj) {
						var jsonData = JSON.parse(obj);
						return jsonData.pageModel.gridModelData;
					},
					id : "id",
					repeatitems : false
					//设置成false，在后台设置值的时候，可以乱序。且并非每个值都得设
				},

				prmNames : {
					page : "pageModel.page", // 表示请求当前页码的参数名称(默认)
					rows : "pageModel.rows", // 表示请求行数的参数名称(默认)
					sort : "pageModel.sidx", // 表示用于排序的列名的参数名称
					order : "pageModel.sord", // 表示采用的排序方式的参数名称(排序方式：asc，
												// desc)
					search : "pageModel.search", // 表示是否是搜索请求的参数名称
					id : "id" // 表示当在编辑数据模块中发送数据时，使用的id的名称
				},
				
				// 添加找不到相关记录提示信息 居中
				loadComplete : function() {
					var re_records = $("#" + o.gridId).getGridParam('records');
					if (re_records == 0 || re_records == null) {
						if ($(".norecords").html() == null) {
							$("#" + o.gridId).parent().append("<div class=\"norecords\">找不到相关数据</div>");
						}
						$(".norecords").show();
					}
				},
				
				//双击事件
				ondblClickRow : function(id){
					var rowdata = grid.getRowData(id);
					if(o.callback){
						o.callback(rowdata);						
					}
				}
			};
		
			$.extend(setting, options);
			var grid = $("#" + o.gridId).jqGrid(setting);
		return grid;
	}
}