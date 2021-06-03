/**
 * Operators
 *
   equals("="),

	notEquals("<>"),

	neisnull("<>,is null"),		//<> or isnot null

	blank("is null"),

	notBlank("is not null"),

	include("like"),

	notInclude("not like"),

	between("between"),

	startWith(""),

	endWith(""),

	in("in"),

	ge(">="),

	le("<="),

	g(">"),

	l("<"),

	sql("");

 */
var bindFlag = false;
var _gridWidth = 0;
var _LNGVAL = window && window.top && window.top.document['_LNGVAL'] || 'cn';
var colName_i18n = 'en' == _LNGVAL ? 'colNameEn' : 'colNameCn';
//获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
var pathName = window.document.location.pathname;
//获取带"/"的项目名，如：/ems
var basePath = pathName.substring(0, pathName.substr(0).indexOf('/'));

// 弹出框置顶
var parentDialogParams = null;
if(typeof(P) == "undefined"){
	if(frameElement != null && frameElement.api != null){
		P = frameElement.api.opener;
		parentDialogParams = frameElement.api.data;
	}else{
		P = window;
	}
}

gridPermissionMap = {};
permissionMap = {};

//加载自定义配置js文件
$.ajax({url: basePath + "/js/sfa-query-custom.js", dataType: "script", async: false});

$.extend($.fn, {
	// 通用弹出窗口选择器控件
	sfaQueryDialog : function(options) {
		if (!this.length) {
			return;
		}

		var queryDialog = new $.sfaQueryDialog(options, this[0]);
		$.data(this[0], 'queryDialog', queryDialog);
		return queryDialog;
	},

	// 通用查询控件
	sfaQuery : function(options) {
		if (!this.length) {
			return;
		}

		var sfaQuery = $.data(this[0], 'sfaQuery');

		if ( sfaQuery ) {
			return sfaQuery;
		}

		if(options == null){
			return null;
		}

		sfaQuery = new $.sfaQuery(options);
		$.data(this[0], 'sfaQuery', sfaQuery);
		if(parentDialogParams != null){
			parentDialogParams['sfaQuery'] = sfaQuery;
		}

		return sfaQuery;
	}
});

$.sfaQuery = function(options) {
	this.init(options);
};

$.sfaQcBox = function(options, qcBox, sfaQuery) {
	this.settings = $.extend(true, {}, $.sfaQcBox.defaults, options);
	this.qcBox = qcBox;
	this.sfaQuery = sfaQuery;
	qcBox.data("qcBox", this);
	this.init();
};

$.sfaQueryGrid = function(options, grid, sfaQuery) {
	this.settings = $.extend(true, {}, $.sfaQueryGrid.defaults, options);
	this.grid = grid;
	this.sfaQuery = sfaQuery;
	grid.data("queryGrid", this);
	this.init();
};

$.sfaQueryAdvance = function(options, advanceBtn, sfaQuery) {
	this.settings = $.extend(true, {}, $.sfaQueryAdvance.defaults, options);
	this.advanceBtn = advanceBtn;
	this.sfaQuery = sfaQuery;
	advanceBtn.data("queryAdvance", this);
	this.init();
};

$.sfaQueryTemplate = function(options, templateBtn, sfaQuery) {
	this.settings = $.extend(true, {}, $.sfaQueryTemplate.defaults, options);
	this.templateBtn = templateBtn;
	this.sfaQuery = sfaQuery;
	templateBtn.data("queryTemplate", this);
	this.init();
};

$.sfaQueryDialog = function(options, btn, sfaQuery) {
	this.settings = $.extend(true, {}, $.sfaQueryDialog.defaults, options);
	this.init();
};

/**
 *
 */
$.extend($.sfaQuery, {
	defaults : {
		local : false,
		url : basePath + "/api/v1/common_query/getQueryConfig",
		templateUrl : basePath + "/api/v1/template_query/list",
		view : '', // 列表名称
		defaultParam : {} // 默认查询条件
	},

	prototype : {
		init : function(o) {
			//从服务器获取配置
			this.initQueryConfig(o);

			if (o.qcOptions == null) {
				o.initQc = false;
			}else{
				o.initQc = true;
			}

			if (o.gridOptions == null) {
				o.initGrid = false;
			}else{
				o.initGrid = true;
			}

			//获取用户自定义JS
			var modelSettings = {};
			if((typeof(customModelSettings) == 'undefined' ||
					typeof(customModelSettings[this.queryConfig.view.modelName]) == 'undefined') &&
					typeof(sfaQueryCustomJs) != 'undefined'){
				var js = sfaQueryCustomJs[this.queryConfig.view.modelName];
				if(js != null){
					$.ajax({url: js,dataType: "script", async : false,
						error : function(textStatus, errorThrown, error) {
							P.$.dialog.alert("ajax error: " +  error.message + ",file[" + js + "]");
							throw error;
						}
					});
				}
			}

			if(typeof(customModelSettings) != 'undefined'){
				var modelSettings = customModelSettings[this.queryConfig.view.modelName];
				if(modelSettings == null){
					modelSettings = customModelSettings;
				}
			}

			this.settings = $.extend(true, {}, $.sfaQuery.defaults, modelSettings ,o);
			settings = this.settings;
			// 初始化qcBox
			if (settings.initQc) {
				var options = $.extend(true, {}, this.queryConfig, settings.qcOptions);
				//没有自定义条件或者模板为自定义模板时，使用模板设置
				if(options.qcData == null || (this.queryConfig.template != null && this.queryConfig.template.isDefault == 'n')){
					$.extend(options, this.queryConfig.template);
				}
				var sfaQcBox = new $.sfaQcBox(options, $("#" + settings.qcOptions.qcBoxId), this);
				this.qcBox = sfaQcBox;
			}

			// 初始化queryGrid
			if (settings.initGrid) {
				var options = $.extend(true, {jqGridSettings:{}}, this.queryConfig, settings.gridOptions);
				//没有自定义条件或者模板为自定义模板时，使用模板设置
				if(options.gridCols == null || (this.queryConfig.template != null && this.queryConfig.template.isDefault == 'n')){
					options.gridCols = this.queryConfig.template.gridCols;

					if(this.queryConfig.template.isDefault != 'y' || options.jqGridSettings.sortname == null){
						//不是默认模板的时候，以传入的排序参数为准
						if(this.queryConfig.template.sortname != null){
							options.jqGridSettings.sortname = this.queryConfig.template.sortname;
						}

						if(this.queryConfig.template.sortorder != null){
							options.jqGridSettings.sortorder = this.queryConfig.template.sortorder;
						}
					}
				}
				var sfaQueryGrid = new $.sfaQueryGrid(options, $("#" + settings.gridOptions.gridId), this);
				// debugger
				this.queryGrid = sfaQueryGrid;
			}

			//模板按钮
			var templateBtn = null;
			if (this.qcBox != null) {
				templateBtn =  this.qcBox.btns.find(".qc_btn_tpl");
			}else if (settings.templateOptions != null && settings.templateOptions.templateBtnId != null) {
				templateBtn = $("#" + settings.templateOptions.templateBtnId);
			}

			if(templateBtn != null && this.qcBox.settings.showSavedQueries){
				var _this = this;
				_this.initTemplate(templateBtn);
				templateBtn.click();
			}
		},

		// 获取服务器查询设置
		initQueryConfig : function(options) {
			var data = {
				'view' : options.view,
				'templateId' : options.templateOptions != null ? options.templateOptions.templateId : "",
				'initCondition' : options.qcOptions != null ? true : false,
				'initColModel' : options.gridOptions != null ? true : false
			};

			if (options.useTemplate != null && !options.useTemplate) {
				data['useTemplate'] = false;
			} else {
				data['useTemplate'] = true;
			}

			var _this = this;
			if(!options.local){
				$.ajax({
					url : $.sfaQuery.defaults.url,
					dataType : "json",
					data : JSON.stringify(data),
					contentType : 'application/json;charset=utf-8',
					type : 'POST',
					async : false,
					cache : false,

					success : function(obj, textStatus) {
						var jsonData = obj.data;
						if (jsonData.ajaxResult.indexOf("success") != -1) {
							_this.queryConfig = jsonData;
							_this.queryConfig.template.qcData = JSON.parse(jsonData.template.qcData);
							_this.queryConfig.template.gridCols = JSON.parse(jsonData.template.gridCols);
							_this.queryConfig.allConds = {};
							_this.queryConfig.allColModels = {};

							if(jsonData.allCondList != null){
								$.each(jsonData.allCondList, function(k,c){
									_this.queryConfig.allConds[c.name] = c;
								});
							}

							if(jsonData.allColModelList != null){
								$.each(jsonData.allColModelList, function(k,m){
									_this.queryConfig.allColModels[m.name] = m;
								});
							}

						} else if (jsonData.ajaxResult == 'exception') {
							var errorMsg = "Error:[" + jsonData.exceptionError + "]";

							if(P){
								P.$.dialog.alert(errorMsg);
							}else{
								alert(errorMsg);
							}
						}
					}
				});
			}else{
				_this.queryConfig = options.queryConfig;
			}
		},

		// 初始化模板查询
		initTemplate : function(templateBtn) {
			if (this.queryTemplate != null) {
				return;
			}
			var _this = this;
			var settings = this.settings;
			var templates = [];
			// 获取模板数据
			$.ajax({
				url : settings.templateUrl,
				dataType : "json",
				data : {
					viewName : settings.view
				},
				contentType : 'application/json;charset=utf-8',
				type : 'GET',
				async : false,
				cache : false,


				success : function(obj, textStatus) {
					var jsonData = obj.data;
					if (jsonData.ajaxResult.indexOf("success") != -1) {
						if(_this.settings.templateOptions == null){
							_this.settings.templateOptions = {};
						}
						_this.settings.templateOptions.templates = jsonData.templates;
						_this.settings.templateOptions.userDefTpl = jsonData.userDefTpl;
					} else if (jsonData.ajaxResult == 'exception') {
						var errorMsg = "Error:[" + jsonData.exceptionError + "]";
						P.$.dialog.alert(errorMsg);
					}
				}
			});

			// 初始化模板查询
			settings.templateOptions.initFieldChooser = settings.initGrid;
			var sfaQueryTemplate = new $.sfaQueryTemplate(settings.templateOptions, templateBtn, this);
			this.queryTemplate = sfaQueryTemplate;
		},

		initAdvance : function(btn){
			//高级查询框
			var options = $.extend(true, {}, this.queryConfig, this.settings.advanceOptions);
			var sfaQueryAdvance = new $.sfaQueryAdvance(options, btn, this);
			this.queryAdvance = sfaQueryAdvance;
		},

		// 获取查询条件(未做任何转换的查询参数)
		qcData : function() {
			if (this.qcBox != null) {
				return this.qcBox.qcData();
			}
		},

		// 获取grid查询条件(发送到服务器的设置)
		postData : function(flag) {
			var qcBox = this.qcBox;
			var defaultParam = this.settings.defaultParam;
			var data = {};
			$.extend(data, defaultParam);

			if (qcBox != null) {
				var postData = qcBox.postData();
				data['connector'] = postData['connector'];
				data['ignoreCase'] = postData['ignoreCase'];
				this._merge(data, data, postData, 'qname');
				this._merge(data, data, postData, 'qoperator');
				this._merge(data, data, postData, 'qvalue');
			}

			if (this.queryGrid != null) {
				var postData = this.queryGrid.jqGrid.getGridParam('postData');
				data['sidx'] = postData['sidx'];
				data['sord'] = postData['sord'];
			}

			if( this.settings.extParam != null){
				var dynamic = this.settings.extParam(data);
				if(dynamic != null){
					this._merge(data, data, dynamic, 'qname');
					this._merge(data, data, dynamic, 'qoperator');
					this._merge(data, data, dynamic, 'qvalue');
				}
			}
			return data;
		},

		gridCols : function() {
			if (this.queryGrid != null) {
				return this.queryGrid.settings.gridCols;
			}
		},

		sort : function(){
			var data = {};
			if (this.queryGrid != null) {
				var postData = this.queryGrid.jqGrid.getGridParam('postData');
				data.sortname = postData['sidx'];
				data.sortorder = postData['sord'];
			}
			return data;
		},

		// 合并查询参数
		_merge : function(dest, data1, data2, key) {
			var obj1 = data1[key];
			var obj2 = data2[key];
			var type1 = Object.prototype.toString.call(obj1);
			var type2 = Object.prototype.toString.call(obj2);

			var ret = {};
			var arr = [];
			if (obj1 != null) {
				$.each(obj1, function(key, val) {
					arr.push(val);
				});
			}

			if (obj2 != null) {
				$.each(obj2, function(key, val) {
					arr.push(val);
				});
			}
			$.each(arr, function(i, v) {
				ret[i] = v;
			});
			if(type1 === "[object Object]"){
				dest[key] = ret;
			}else{
				dest[key] = arr;
			}
		},

		// 重置查询结果列表(销毁表格然后重新生成)
		resetQueryGrid : function(options) {
			if (this.queryGrid != null) {
				this.queryGrid.reInit(options);
			}
		},

		//提交
		submit : function() {
			if (this.qcBox != null) {
				this.qcBox.submit();
			}
		},

		// 重新加载结果列表(重新加载数据)
		reloadQueryGrid : function(data) {
			if (this.queryGrid != null) {
				if(data == null){
					this.queryGrid.reloadGrid(this.postData());
				}else{
					this.queryGrid.reloadGrid(data);
				}
			}
		},

		// 改变查询模板
		changeTemplate : function(options) {

			if(options.defaultParam){
				this.settings.defaultParam = options.defaultParam;
			}

			// 重新加载qcBox
			if (this.qcBox != null && (options.reloadQcbox == null || options.reloadQcbox)) {
				this.qcBox.reInit(options);
			}

			// 重新加载queryGrid
			var postData = this.queryGrid.jqGrid.getGridParam('postData');

			var settings = {
				jqGridSettings :{
					sortname : postData['sidx'],
					sortorder : postData['sord']
				}
			};

			$.extend(true, settings.jqGridSettings, this.settings.gridOptions.jqGridSettings, settings.jqGridSettings);
			$.extend(true, settings, options);

			if (this.queryGrid != null) {
				this.queryGrid.reInit(settings, function(){
					if (this.qcBox != null) {
						this.qcBox.submit();
					}

					//重新初始化已选择
					if(this.queryAdvance){
						this.queryAdvance.initSel();
					}
				});
			}

		},

		hideQueryAdvance : function(){
			if(this.queryAdvance != null){
				this.queryAdvance.advance.hide();
			}
		},

		setGridParam : function(param, value){
			this.queryGrid.setGridParam(param, value);
		}
	}
});

/**
 * 查询条件
 */
$.extend($.sfaQcBox, {
	defaults : {
		qcBoxId : 'qc_box', 											// 查询框Id
		qcExtBoxId : 'qc_ext_box',
		qcData : [],															//默认查询参数
		allConds : {},															//所有查询条件定义
		colNum : 2,															//每行显示数量
		srhFun : null,														//查询回调方法
		toUpperCase : false,											//转为大写
		toLowerCase : false,											//转为小写
		ignoreCase : true,												//忽略大小写
		showConnector : false,
		showAddDel : true,
		showSavedQueries : true,
		showQcOper : true												//是否显示操作符
	},

	prototype : {
		init : function() {
			this.initQcOptions();
			this.qcBox.addClass("qc_box");
			this.qcBox.wrap("<fieldset class='outter_qc_box'></fieldset>");
			let legend = $('<legend data-i18n="common:COMMON_OPERATION.SEARCH">搜索</legend>');
			$(".outter_qc_box").prepend(legend);
			this.createQcTable();
			this.createQcBtns();

			if($.isEmptyObject(this.settings.allConds)){
				this.qcBox.hide();
			}
		},

		reInit : function(options) {
			$.extend(this.settings, options);
			this.qcTable.remove();
			this.qcExtBox.empty();
			this.createQcTable();
			this.qcTable.insertBefore(this.btns);
		},

		initQcOptions : function(){
			var allConds = this.settings.allConds;
			var view = this.settings.view;
			if(view.qcOptionsUrl == null){
				return;
			}
			//通过url中取值
			$.ajax({
				url : basePath + view.qcOptionsUrl,
				dataType : "json",
				contentType : 'application/json;charset=utf-8',
				type : 'GET',
				async : true,
				cache : false,
				async : false,


				success : function(obj, textStatus) {
					var jsonData = obj.data;
					 if (jsonData.ajaxResult == 'exception') {
						 var errorMsg = "Error:[" + jsonData.exceptionError + "]";
						P.$.dialog.alert(errorMsg);
					}else{
						$.each(jsonData, function(key, val){
							if(allConds[key] != null){
								allConds[key].options = val;
							}
						});
					}
				}
			});
		},

		resetQcTable : function() {
			this.qcTable.find("input.qc_value").val("");
			this.qcTable.find("input:hidden").val("");
			this.qcTable.find("input.combo-text").val("");
			this.qcTable.find("select.qc_value").val("");
			$.each(this.qcTable.find("select[multiple='multiple']"), function(i,v){
				$(v).multiselect("uncheckAll");
			});

			if (this.settings.reset) {
				this.settings.reset();
			}
		},

		/**
		 * 查询条件框
		 */
		createQcTable : function() {
			var qcTable = $("<div class='qc_table'></div>");
			this.qcTable = qcTable;
			this.qcBox.append(qcTable);

			this.qcExtBox = $("#" + this.settings.qcExtBoxId);
			var _this = this;

			if (this.settings.qcData != null){
				var allConds = this.settings.allConds;
				$.each(this.settings.qcData, function(i, val) {
					var condition = null;
					if (typeof (val) == 'object') {
						condition = allConds[val.name];
						if(condition.name == _this.settings.view.qcExtCondition){
							_this.createQcExt(condition, allConds, val);
						}else{
							_this.createQc(condition, allConds, val);
						}
					}else {
						condition = allConds[val];
						if(condition != null && condition.name == _this.settings.view.qcExtCondition){
							_this.createQcExt(condition, allConds, {});
						}else{
							_this.createQc(condition, allConds, {});
						}
					}
				});
			}

			// 固定宽度
			qcTable.css('minWidth', qcTable.width() + 20);
			return qcTable;
		},

		/**
		 * 按钮组
		 */
		createQcBtns : function() {
			// qc_btns
			var btns = "<div class='qc_btns'><div>";

			if (this.settings.showAddDel) {
				btns += "<span class='qc_btn_add'></span><span class='qc_btn_del'></span>";
			}

			/**

			btns += "<span class='qc_btn_max'><b class='ui_max_b'></b></span>";
			btns += "<span class='qc_btn_res'><b class='ui_res_b'></b><b class='ui_res_t'></b></span>";
			*
			 */

			if (this.settings.showConnector) {
				btns += "<label><input name='qc_btn_ao' class='qc_btn_and' type='radio' checked='checked'  value='and'/> AND</label>" ;

               // add by guozhigang 修复bug暂时框架不支持or组件
				//	+ "<label><input name='qc_btn_ao' class='qc_btn_or' type='radio' value='or' /> OR</label>";
			}

			btns += "</div><div><span><input class='qc_btn_srh btn' type='button' value='Search' /></span>" + "<span><input class='qc_btn_reset btn' type='button' value='Reset' /></span>";

			if (this.settings.showSavedQueries) {
				btns += "<span><input class='qc_btn_tpl btn' type='button' value='Saved Queries' /></span>";
			}


			btns += "</div>";

			btns = $(btns);
			this.qcBox.append(btns);
			this.btns = btns;

			var _this = this;
			// 添加按钮
			this.qcBox.find(".qc_btn_add").click(function() {
				var condition = null;
				$.each(_this.settings.allConds, function(key, v) {
					condition = v;
					return false;
				});

				if(condition == null){
					return;
				}

				var row = _this.createQc(condition, _this.settings.allConds, {});
			});

			// 删除按钮
			this.qcBox.find(".qc_btn_del").click(function() {
				_this.removeCol();
			});

			// 重置按钮
			this.qcBox.find(".qc_btn_reset").click(function() {
				_this.resetQcTable();
				if(_this.settings.reset){
					_this.settings.reset();
				}
			});

			// 查找按钮
			this.qcBox.find(".qc_btn_srh").click(function() {
				_this.submit();
			});

			//缩放按钮
			this.qcBox.find(".qc_btn_max, .qc_btn_res").click(function(){
				_this.maxRes();
			});
		},

		//删除条件
		removeCol : function(){
			var cell = this.qcTable.find(".qc_col:not(.fixed)").last();
			var row = cell.parent();
			if (row.find(".qc_col").size() == 1) {
				row.remove();
			} else {
				cell.remove();
			}
		},

		//显示或者隐藏添加删除按钮
		showOrHideAddDel : function(){
			this.btns.find(".qc_btn_add").toggle();
			this.btns.find(".qc_btn_del").toggle();
		},

		//放大还原
		maxRes : function(){
			if(frameElement == null){
				return;
			}
			var binddata = top.$(top).data("binddata");
			if(binddata == null){
				binddata = {isMax : false};
				top.$(top).data("binddata", binddata);
			}
			binddata.isMax = !binddata.isMax;
			var parents = $(frameElement).parents();
			if(binddata.isMax){
				this.qcBox.find(".qc_btn_max").hide();
				this.qcBox.find(".qc_btn_res").show();

				binddata.nouse = [];
				binddata.useful = [];
				$.each(parents, function(i,p){
					if(p.tagName == 'HTML'){
						return;
					}

					var siblings = $(p).siblings();

					//需要隐藏的页面元素
					if(siblings.length != 0){
						$.each(siblings, function(i,val){
							binddata.nouse.push({
								ele : val,
								hidden : $(val).is(":hidden")
							});
						});
					}

					//父节点的属性
					binddata.useful.push({
						left : $(p).css("left"),
						top : $(p).css("top"),
						cssWidth : $(p).css("width"),
						cssHeight : $(p).css("height")
					});
				});

				//iframe自己的属性
				binddata.useful.push({
					ele : frameElement,
					left : $(frameElement).css("left"),
					top : $(frameElement).css("top"),
					cssWidth : parseInt($(frameElement).css("width"), 10),
					cssHeight : $(frameElement).css("height")
				});
			}else{
				this.qcBox.find(".qc_btn_max").show();
				this.qcBox.find(".qc_btn_res").hide();
			}

			//设置父节点和自己的样式
			$.each(binddata.useful, function(i,obj){
				var p;
				if(obj.ele != null){
					p = obj.ele;
				}else{
					p = parents[i];
				}

				if(binddata.isMax){
					$(p).css("width", top.document.documentElement.clientWidth);
					$(p).css("height", top.document.documentElement.clientHeight);
					$(p).attr("height", top.document.documentElement.clientHeight);
					$(p).css("left", 0);
					$(p).css("top", 0);

				}else if(!obj.hidden){
					$(p).css("width", obj.cssWidth);
					$(p).css("height", obj.cssHeight);
					$(p).css("left", obj.left);
					$(p).css("top", obj.top);
				}
			});

			//显示或者隐藏外部元素
			$.each(binddata.nouse, function(i,obj){
				if(binddata.isMax){
					$(obj.ele).hide();
				}else if(!obj.hidden){
					$(obj.ele).show();
				}
			});

			//重置jqgrid的宽度和高度
			if(this.sfaQuery.queryGrid != null){
				this.sfaQuery.queryGrid.resetGridHeight();
			}
		},

		submit : function() {
			// 验证未通过
			if (!this.validateQcValue()) {
				return;
			}

			var data = this.sfaQuery.postData();
			if (this.settings.srhFun) {
				this.settings.srhFun(data);
			} else {
				this.sfaQuery.reloadQueryGrid();
			}
		},

		qcData : function() {
			var ao = this.btns.find("input[name=qc_btn_ao]:checked").val();
			var cells = this.qcTable.find(".qc_col").get();
			cells = cells.concat(this.qcExtBox.find(".qc_col").get());

			var qcData = {
				'connector' : ao,
				'data' : []
			};

			$.each(cells, function(i, cell) {
				cell = $(cell);
				var name = cell.find(".qc_name").val();
				var oper = cell.find(".qc_oper").val();
				var val = "";
				var eles = cell.find("[name='qvalue']");

				eles = eles.map(function(i, ele){
					if($(ele).is(":radio") && !$(ele).is(":checked")){
						return;
					}
					return ele;
				}).get();

				if(eles.length >1){
					$.each(eles, function(i,ele){
						if($(ele).is(":radio") && !$(ele).is(":checked")){
							return;
						}
						val += $(ele).val();
						if(i < eles.length - 1){
							val += ",";
						}
					});
				}else if(eles.length == 1){
					val = $(eles[0]).val();
				}
				qcData.data.push({
					"name" : name,
					"oper" : oper,
					"value" : $.trim(val)
				});
			});
			return qcData;
		},

		postData : function(flag) {
			var settings = this.settings;
			var ao = this.btns.find("input[name=qc_btn_ao]:checked").val();
			var cells = this.qcTable.find(".qc_col").get();
			cells = cells.concat(this.qcExtBox.find(".qc_col").get());
			var data = {
				'qname' : [],
				'qoperator' : [],
				'qvalue' : [],
				'connector' : ao,
				'ignoreCase' : settings.ignoreCase
			};
			var idx = 0;
			$.each(cells, function(i, cell) {
				cell = $(cell);
				var condition = cell.data("condition");

				var name = cell.find(".qc_name").val();
				var oper = cell.find(".qc_oper").val();

				var val = '';
				var eles = cell.find("[name='qvalue']");

				eles = eles.map(function(i, ele){
					if($(ele).is(":radio") && !$(ele).is(":checked")){
						return;
					}
					return ele;
				}).get();

				if(eles.length >1){
					$.each(eles, function(i,ele){
						val += $(ele).val();
						if(i < eles.length - 1){
							val += ",";
						}
					});
				}else if(eles.length == 1){
					val = $(eles[0]).val();
				}

				if (oper == "blank" || oper == "notBlank") {
					val = "N/A";
				}

				if(val != null){
					val = $.trim(val);
				}

				if ((val != null && val != '') || cell.hasClass('required')) {
					if(val == null || val == ''){
						val = "";

					}else if (condition.type == "datetime") {
						if (oper == "equals") {
							oper = "between";
							val = $.trim(val) + " 00:00:00," + $.trim(val) + " 23:59:59";
						} else if (oper == "le") {
							val = val + " 23:59:59";
						} else if (oper == "ge") {
							val = val + " 00:00:00";
						}
					} else if (condition.parse != null){
						// 设置了parse的执行parse
						val = condition.parse(val);
					}

					data['qname'][idx] = name;
					data['qoperator'][idx] = oper;
					if(settings.toUpperCase){
						data['qvalue'][idx] = $.trim(val).toUpperCase();
					}else if(settings.toLowerCase){
						data['qvalue'][idx] = $.trim(val).toLowerCase();
					}else{
						data['qvalue'][idx] = $.trim(val);
					}
					idx++;
				}
			});

			return data;
		},

		/**
		 * 输入数据验证
		 */
		validateQcValue : function() {
			var data = this.postData();
			var settings = this.settings;
			var valid = true;
			$.each(data['qname'], function(i, qname) {
				var condition = settings.allConds[qname];
				var oper = data['qoperator'][i];
				var val = data['qvalue'][i];

				if(val == null || val == ""){
					//必填验证
                    P.$.dialog.alert("The " + condition[colName_i18n] + " is required");
					return false;
				}else if (condition.type == "date") {
					if("N/A" == val && (oper == 'blank' || oper == 'notBlank')){
						return true;
					}
					if (!(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$/).test(val)) {
                        P.$.dialog.alert("The " + condition[colName_i18n] + " must be a date. eg:2013-01-01");
						valid = false;
						return false;
					}
				} else if (condition.type == "datetime") {
					if("N/A" == val && (oper == 'blank' || oper == 'notBlank')){
						return true;
					}
					if (!(/^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2} /).test(val)) {
                        P.$.dialog.alert("The " + condition[colName_i18n] + " must be a date. eg:2013-01-01");
						valid = false;
						return false;
					}
				} else if (condition.type == "number") {
					if (!/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(val)) {
                        P.$.dialog.alert("The " + condition[colName_i18n] + " is not in correct format");
						return false;
					}
				}else if(condition.type == "integer"){
					if (!/^-?\d+$/.test(val)){
                        P.$.dialog.alert("The " + condition[colName_i18n] + " is not a integer");
						return false;
					}
				}
			});
			return valid;
		},

		/**
		 * 创建查询项
		 */
		createQc : function(condition, allConditions, defData) {
			if(condition == null){
				return;
			}

			var cell = null, qname = null, qoper = null, qvalue = null;

			// 行
			var row = this.qcTable.find(".qc_row").last();
			var cellCnt = row.children().size();
			if (cellCnt == 0 || cellCnt >= this.settings.colNum) {
				row = $("<ul class='qc_row'></ul>");
				this.qcTable.append(row);
			}

			// 列
			cell = $("<li class='qc_col'></li>");
			row.append(cell);

			if(defData.fixed == null) defData.fixed = {};
			if(defData.required) cell.addClass("required");

			// 条件选择器
			this.qcName(cell, condition, allConditions, defData.fixed.name);

			// 操作选择器
			this.qcOper(cell, condition, defData.oper, defData.fixed.oper);

			// 输入域
			this.qcValue(cell, condition, defData.value, defData.fixed.value);

			// 设置默认值
			var qcData = this.settings.qcData;
			if (qcData != null) {
				var data = qcData[condition.name];
				if (data != null) {
					cell.find(".qc_oper").val(data.oper);
					cell.find(".qc_value").val(data.value);
				}
			}
			return row;
		},

		/**
		 * 创建扩展查询项
		 */
		createQcExt : function(condition, allConditions, defData) {
			if(condition == null){
				return;
			}

			// 行
			var qcExt = $("<span class='qc_col'></span>");

			this.qcExtBox.append(qcExt);

			this._showRadio(qcExt, condition, defData.value);
		},

		/**
		 * 查询项列表
		 */
		qcName : function(cell, condition, allConditions, isfixed) {
			var _this = this;
			var qname = $("<span><select class='qc_name' name = 'qname'></select></span>");
			var sel = qname.find(".qc_name");
			$.each(allConditions, function(k, v) {
				//过滤扩展项
				if(v.name == _this.settings.view.qcExtCondition){
					return;
				}
				//查询条件下拉项,过滤hidden项
				if(v.hidden && v.hidden === true)return;
				if (condition.name == v.name) {
                    sel.append($("<option value='" + k + "' selected='selected'>" + v[colName_i18n] + "</option>"));
				} else {
                    sel.append($("<option value='" + k + "'>" + v[colName_i18n] + "</option>"));
				}
			});

			// 修改条件事件处理
			sel.change(function() {
				var condition = allConditions[$(this).val()];
				var cell = qname.parent();
				cell.find(".qc_oper").parent().remove();
				cell.find(".qc_value").parent().remove();

				_this.qcOper(cell, condition);
				_this.qcValue(cell, condition);
			});

			sel.mouseover(function(){
				qname.attr("title", sel.find("option[value='" + sel.val() + "']").text());
			});

			// 添加到cell
			cell.append(qname);

			if(isfixed){
				qname.find("select").attr("disabled", true);
				cell.addClass("fixed");
			}
		},

		/**
		 * 查询项操作
		 */
		qcOper : function(cell, condition, oper, isfixed) {
			var qoper = $("<span><select class='qc_oper' name = 'qoperator'></select></span>");
			var ops = null;
			if (condition.type == "date" || condition.type == "datetime") {
				ops = {
					"equals" : "Equals",
					"le" : "Before",
					"ge" : "After",
					"blank" : "Blank",
					"notBlank" : "NotBlank"
				};
			} else if (condition.type == "number" || condition.type == "integer") {
				ops = {
					"equals" : "==",
					"l" : "<",
					"g" : ">",
					"le" : "<=",
					"ge" : ">="
				};
			} else if (condition.type == "select") {
				ops = {
					"equals" : "Equals"
				};
			} else if(condition.type == "multiSelect" || condition.type == "tree"){
				ops = {
						"in" : "In",
						"notIn" : "Not In"
					};
			} else if(condition.type == "multiInclude"){
				ops = {
						"multiInclude" : "In",
						"multiNotInclude" : "Not In"
					};
			} else if(condition.type == "view1" || condition.type == "string1"){
				ops = {
						"startWith" : "StartWith",
						"include" : "Include",
						"equals" : "Equals",
						"endWith" : "EndWith",
						"blank" : "Blank",
						"notBlank" : "NotBlank"
					};
			} else if(condition.type == "multiView"){
				ops = {
						"in" : "In",
						"notIn" : "Not In"
					};
			}else if(condition.type == "clob"){
				ops = {
					"include" : "Include",
					"blank" : "Blank",
					"notBlank" : "NotBlank"
				};
			}else if(condition.type == "string"){
				ops = {
						"include" : "Include",
						"notInclude" : "NotInclude",
						"equals" : "Equals",
						"blank" : "Blank",
						"notBlank" : "NotBlank"
					};
			}else {
				ops = {
					"include" : "Include",
					"equals" : "Equals",
					"blank" : "Blank",
					"notBlank" : "NotBlank"
				};
			}
			$.each(ops, function(key, val) {
				qoper.find(".qc_oper").append($("<option oper='" + key + "' value='" + key + "'>" + val + "</option>"));
			});

			qoper.find(".qc_oper").val(oper);
			// 添加到cell
			cell.append(qoper);

			if(!this.settings.showQcOper){
				qoper.hide();
			}

			if(isfixed){
				qoper.find("select").attr("disabled", true);
				cell.addClass("fixed");
			}
		},

		/**
		 * 查询项值
		 */
		qcValue : function(cell, condition, value, isfixed) {
			var _this = this;
			cell.data("condition", condition);
			var span = $("<span></span>");
			cell.append(span);

			if (condition.type == "select" || condition.type == "multiSelect" || condition.type == "multiInclude" ) {
				var qvalue = $("<select class='qc_value' name='qvalue' ></select>");
				span.append(qvalue);
				this._showSelect(qvalue, condition, value);

			}else if(condition.type == "quickSearch"){
				var qvalue = $("<input class='qc_value' name='qvalue' />");
				span.append(qvalue);
				this._showCombobox(qvalue, condition, value);
			} else if(condition.type == "tree") {
				var qvalue = $("<input class='qc_value' autocomplete=off  name='qvalue' />");
				qvalue.val(value);
				span.append(qvalue);
				qvalue.click(function(){
					_this._showTree(qvalue, condition.name, condition);
				});
			}else if(condition.type == "custom_model"){
				var qvalue = $("<input id='modelInput' class='qc_value' autocomplete=off  name='qvalue' />");
				qvalue.val(value);
				span.append(qvalue);
				qvalue.click(function(){
					_this._showCustomTree(qvalue, condition.name, condition);
				});
			}else if (condition.type == "date" || condition.type == "datetime") {
				// 日期类型
				var qvalue = $("<input class='qc_value' autocomplete=off  name='qvalue' />");
				qvalue.val(value);
				span.append(qvalue);
				qvalue.datebox({});

			} else if (condition.type.match(/view/i)) {
				var qvalue = $("<input class='qc_value qc_value_view' autocomplete=off  name='qvalue' />");
				qvalue.val(value);
				span.append(qvalue);

				// 列表选择类型
				var btn = $("<img class='qc_btn_img' title='Search' src='" + basePath + "/css/easyui/icons/search.png'>");
				span.append(btn);

				if(condition.viewName != null ){
					if(condition.viewName == 'D_MINI_SPEC_BASE' ){
						btn.click(function() {
							ShowWindowIframe({
								width: "750",
								height: "520",
								title: '',
								param: {
									successCallback:function (data) {
										qvalue.val(data.tail || '');
									}
								},
								url: "/views/common/select_ac_list.html"
							})
						});
						return;
					}else{
						btn.click(function() {
							var option = {
								dialogId : "qc_dlg_" + condition.viewColName,
								dialogTitle: condition[colName_i18n],
								view : condition.viewName,

								qcOptions :{
									qcBoxId : 'qc_box',
									showSavedQueries : false
								},

								gridOptions : {
									callback : function(rowdata, originalData) {
										qvalue.val(originalData[condition.viewColName]);
										dlg.close();
									}
								}
							};

							var dlg = btn.sfaQueryDialog(option);
						});
					}

				}else if(condition.optionsUrl != null ){
					var options = JSON.parse(condition.options);
					var option = {
							id: "qc_dlg_" + condition.viewColName,
                        title: condition[colName_i18n],
							width : 690,
							height : 560,
							top : "15%",
							content:'url:' + basePath + condition.optionsUrl,
							close:function(){
								qvalue.val(this.data[options.outp]);
							},

							data : {}
					};

					btn.click(function() {
						option.data[options.inp] = span.find(".qc_value").val();
						P.$.dialog(option);
					});
				}
			} else {
				var qvalue = $("<input class='qc_value' autocomplete=off name='qvalue' />");
				qvalue.val(value);
				span.append(qvalue);
			}

			span.find(".qc_value").mouseover(function(){
				span.attr("title", qvalue.val());
			}).keyup(function(e){
				//回车提交
				var e=window.event||e;
				if (e.keyCode == 13){
					_this.submit();
				}
			});

			if(isfixed){
				qvalue.attr("disabled", true);
				cell.addClass("fixed");
			}
		},

		_getOptions : function(condition){
			//先取options属性的值
			if(condition.options != null && condition.options != ''){
				if(typeof(condition.options) == "object"){
					return condition.options;
				}else{
					return JSON.parse(condition.options);
				}
			}else if(condition.optionsUrl == null){
				return null;
			}

			//通过url中取值
			$.ajax({
				url : basePath + condition.optionsUrl,
				dataType : "json",
				contentType : 'application/json;charset=utf-8',
				type : 'GET',
				async : true,
				cache : false,
				async : false,


				success : function(obj, textStatus) {
					var jsonData = obj.data;
					 if (jsonData.ajaxResult == 'exception') {
						 var errorMsg = "Error:[" + jsonData.exceptionError + "]";
						P.$.dialog.alert(errorMsg);
					}else{
						condition.options = jsonData;
					}
				}
			});
			return condition.options;
		},
		//加载combobox数据
		_showCombobox :function(combobox, condition, value){
		   	var data = this._getOptions(condition);
		   	var comboboxData = [];
		   	var s = $('<input name="hz" id="hz" type="text" size="50" />');
		   	if(data != null){
		   		$.each(data, function(key, val){
		   			var initials = '';
		   			$.each(val, function(i,value){
		   				s.val(value);
		   				var initial = s.toPinyin().substring(0,1);
		   				initials =initials + initial;
		   			});
		   			comboboxData.push({label : val + initials +' ' + key, value : key});
		   		});
		   	}

		   	combobox.css("width", combobox.width());

		   	combobox.combobox({
		   		valueField: 'value',
				textField: 'label',
		   		data : comboboxData,
		   		filter: function(q, row){
	   				return row.label.toUpperCase().indexOf(q.toUpperCase()) != -1;
		   		}
		   	});
		},

		_showSelect :function(select, condition, value){
			if(select.html() == ""){
				var data = this._getOptions(condition);

				if(condition.type == "select"){
					select.append($("<option value=''>----select----</option>"));
				}else{
					select.attr("multiple", "multiple");
				}

				if(data != null){
					$.each(data, function(key, val) {
						if(typeof(val) == "object"){
							select.append($("<option value='" + val.value + "' oper='" + val.oper + "'>" + val.label + "</option>"));
						}else{
							if($.isArray(data)){
								select.append($("<option value='" + val + "'>" + val + "</option>"));
							}else{
								select.append($("<option value='" + key + "'>" + val + "</option>"));
							}
						}
						select.val(value);
					});
				}

				//添加变更事件
				select.change(function(){
					var valOption = select.find("option:selected");
					var oper = valOption.attr("oper");
					var operOption = select.closest(".qc_col").find(".qc_oper option:selected");
					if(oper){
						operOption.val(oper);
					}else{
						operOption.val(operOption.attr("oper"));
					}
				});

				//多选
				if(condition.type == "multiSelect" || condition.type == "multiInclude"){
					//选中
					if(value != null){
						$.each(value.split(","), function(i, val){
							select.find("option[value='" + val + "']").attr("selected", true);
						});
					}

					select.multiselect({
						noneSelectedText: "--Please Select--",
						checkAllText: "Check All",
						uncheckAllText: 'Uncheck All',
						selectedList:4
					});

					select.multiselect("getButton").css("width", 133);
					select.multiselect("getButton").find("span").last()
					.css("display", "inline-block").css("height", 17).css("width", 99)
					.css("vertical-align", "middle");
				}

				//触发change事件
				select.change();
			}
		},

		_showRadio : function(cell, condition, value){
			cell.data("condition", condition);
			var _this = this;
			var data = this._getOptions(condition);
			if(cell.html() != "" || data == null){
				return;
			}

			var time = new Date().getTime();
			cell.append('<input class="qc_name" type="hidden" value="' + condition.name + '" />');
			cell.append('<input class="qc_oper" type="hidden" value="" />');

			$.each(data, function(key, val) {
				var $label = null;
				if(typeof val == "object"){
					$label = $('<label><input name="qvalue" qname="' + (val.name || condition.name) + '" oper="' + val.oper + '" class="qc_value" type="radio" name="'
							+ condition.name + time + '" value="' + val.value + '" />' + val.label + '</label>');

				}else if($.isArray(data)){
					$label = $('<label><input name="qvalue" qname="' + condition.name + '" oper="equals" class="qc_value" type="radio" name="'
							+ condition.name + time + '" value="' + val + '" />' + val + '</label>');
				}else{
					$label = $('<label><input name="qvalue" qname="' + condition.name + '" oper="equals" class="qc_value" type="radio" name="'
							+ condition.name + time + '" value="' + key + '" />' + val + '</label>');
				}

				if(value == key || value == val || value == val.value){
					$label.find(".qc_value").attr("checked", "checked");
					cell.find(".qc_oper").val($label.find(".qc_value").attr("oper"));
					cell.find(".qc_name").val($label.find(".qc_value").attr("qname"));
				}

				cell.append($label);
				$label.find(".qc_value").change(function(){
					cell.find(".qc_oper").val($(this).attr("oper"));
					cell.find(".qc_name").val($(this).attr("qname"));

					if(_this.settings.view.qcExtConditionOptions != null){
						var qcExtConditionOptions = JSON.parse(_this.settings.view.qcExtConditionOptions);
						var templateId = qcExtConditionOptions[$(this).val()].templateId;
						if(_this.sfaQuery.queryTemplate != null){
							_this.sfaQuery.queryTemplate.changeTemplate(templateId);
						}
					}else{
						_this.submit();
					}
				});
			});

			//添加事件
		},

		_showTree : function(input, id, condition){

			var content = input.data("treeNode");
			//初始化
			if(content == null || content.size() == 0){
				var random = Math.round(Math.random() * 1000000);
				var contentId = id + "Content_" +random;
				var ztreeNodeId  = id + "_" + random;

				content = $('<div id="' + contentId + '" class="menuContent" style="display:none; position: absolute;">' +
					'<ul id="' + ztreeNodeId + '" class="ztree" style="margin-top:0; width:180px; height:180px;"></ul>' +
					'</div>');
				$(document.body).append(content);
				input.data("treeNode", content);
				input.data("ztreeNodeId",ztreeNodeId);

				var data =  this._getOptions(condition);

				var options = {
						check : {
							enable : true,
							chkboxType : {
								"Y" : "ps",
								"N" : "ps"
							}
						},
						view : {
							dblClickExpand : false
						},
						data : {
							simpleData : {
								enable : true
							}
						},
						callback : {
							onCheck : function() {
								var zTree = $.fn.zTree.getZTreeObj(ztreeNodeId);
								var nodes = zTree.getCheckedNodes(true);
								var v = "";
								for ( var i = 0, l = nodes.length; i < l; i++) {
									v += nodes[i].name + ",";
								}
								if (v.length > 0)
									v = v.substring(0, v.length - 1);
								input.val(v);
							}
						}
				};

				$.fn.zTree.init($("#" + ztreeNodeId), options, data);
			}

			//input在点击reset按钮时，会清空，但弹出的tree仍会保留上次的选择，所以在这里进行清空操作
			if(!input.val()){

				var zTree_ = $.fn.zTree.getZTreeObj(input.data('ztreeNodeId'));

				zTree_.checkAllNodes(false);
			}

			//显示
			var offset = input.offset();
			content.css({
				left : offset.left + "px",
				top : offset.top + input.height() + 6 + "px",
				'z-index': 200
			}).slideDown(50);

			$("body").bind("mousedown", function(event){
				if (!(event.target.id == "menuBtn" || event.target == input
					|| event.target == content || $(event.target).parents("#"+ content.attr("id")).length > 0)) {
					content.fadeOut(50);
				}
			});
		},
		_showCustomTree:function(input, id, condition){

			var initParam = {
				//如果没有参数，则默认三级都显示
				level:2,
				//当我们选择数据时，是否也加上父级的数据
				isCheckParentModel:false,
				//是否单选
				isRadio:false,
				//是否是展开所有的节点
				open:false,
				//显示下拉列表的宽度
				modelDropDownWidth:'160px',
				//显示下拉列表的高度
				modelDropDownHeight:'230px'
			};

			var random = Math.round(Math.random() * 1000000);

			var currentModelContentId = input.attr("id")+"_modelContent_"+random;

			var currentModelListId = input.attr("id") + "_modelList_"+random;

			var getModelSettings = function(contentUlId,inputId,isCheckParentModel,isRadio,level) {

				var _checkObj = "";

				if(isRadio){
					_checkObj = {
						enable : true,
						chkStyle: "radio",
						radioType: "all"
					}
				}else{
					_checkObj = {
						enable : true,
						chkboxType : {
							"Y" : "ps",
							"N" : "ps"
						}
					}
				}

				return {
					check :_checkObj,
					view : {
						dblClickExpand : false
					},
					data : {
						simpleData : {
							enable : true
						}
					},
					callback : {
						onCheck : function() {
							var zTree = $.fn.zTree.getZTreeObj(contentUlId);
							var nodes = zTree.getCheckedNodes(true);
							var v = "";
							for ( var i = 0, l = nodes.length; i < l; i++) {

								if(!isCheckParentModel && level>1){

									if(level==2 && nodes[i].id>2){

										v += nodes[i].value + ",";
									}

									if(level==3 && nodes[i].id>12){

										v += nodes[i].value + ",";
									}
								}else{
									v += nodes[i].value + ",";
								}

							}

							if (v.length > 0){
								v = v.substring(0, v.length - 1);
							}

							var cityObj = $("#"+inputId);

							cityObj.attr("value", v);
						}
					}
				};
			};

			var showModelMenu = function(inputId,contentId) {

				var cityObj = $("#"+inputId);
				var cityOffset = cityObj.offset();

				$("#"+contentId).css({
					left : cityOffset.left + "px",
					top : cityOffset.top + cityObj.outerHeight()+1 + "px"
				}).slideDown("fast");

				$("body").bind("mousedown", function(event){
					if (!(event.target.id == "menuBtn" || event.target.id == inputId
						|| event.target.id == contentId || $(event.target).parents(
						"#"+contentId).length > 0)) {
						$("#"+contentId).fadeOut("fast");
					}
				});
			};

			var initModelDivContent = function(modelContentId,modelListId,modelDropDownWidth,modelDropDownHeight) {

				var modelDiv = "<div id='"+modelContentId+"' class='menuContent' style='display:none; position: absolute;'>"
						+ "<ul id='"+modelListId+"' class='ztree' style='margin-top:0; width:"+modelDropDownWidth+"; height: "+modelDropDownHeight+";background-color:#F2F2F2'></ul>"
						+ "</div>";
				return modelDiv;
			};

			$(initModelDivContent(currentModelContentId, currentModelListId,initParam.modelDropDownWidth, initParam.modelDropDownHeight)).appendTo($(input).closest("body"));

			$.ajax({
					url : basePath + "/data/model_getModelByLevelAndModel.action",
					cache : false,
					dataType : "json",
					async : false,
					data : {
						level : initParam.level,
						model : initParam.model
					},
					success : function(data) {

						// 表示是单选
						if (initParam.isRadio) {

							$.each(data, function(k, v) {

								if(initParam.open){

									v['open'] = true;
								}

								 if (v['value'] != null && v['value'] != "") {

									  // 如果是二级，则需要删除第一级的RadioBox
									  if (initParam.level == 2) {

										  if (v['id']<=2) {

											   v['nocheck'] = true;
										   }
									   }

									   // 如果是三级，则需要删除第一、二级的RadioBox
									   if (initParam.level == 3) {

										   if (v['id']<=12) {

											   v['nocheck'] = true;
											}
										}
								  }
							 });
					    }else{

					    	$.each(data, function(k, v) {

					    		if(initParam.open){

									v['open'] = true;
								}
					    	});
					    }

						$.fn.zTree.init($("#" + currentModelListId), getModelSettings(currentModelListId, input.attr("id"),initParam.isCheckParentModel,initParam.isRadio,initParam.level),data);

					}
			});// ajax request end

			showModelMenu(input.attr("id"),currentModelContentId);
		}
	}
});

$.extend($.sfaQueryAdvance, {
	defaults : {
		advanceBoxId : "qc_advance_box" // 高级查询框Id
	},

	prototype : {
		init : function() {
			var _this = this;
			this.advance = $("#" + this.settings.advanceBoxId);
			// 高级设置
			this.advance.addClass("qc_advance");

			this.advance.append("<div class='qc_advance_selbox'>"
				+ "<div><input type='button' class='qc_advance_op_up btn' value='↑' />"
				+ "<input type='button' class='qc_advance_op_down btn' value='↓' />"
				+ "<input type='button' class='qc_advance_op_del btn' value='X' /></div>"
				+ "<select class='qc_advance_sel' multiple='multiple'></select>"
				+ "</div>" );

			this.advance.append("<div class='qc_advance_allbox'>"
					+ "<div><input type='button' class='qc_advance_op_add btn' value='<<' />"
					+ "<input id='qc_advance_op_all' type='checkbox' class='qc_advance_op_all' /> "
					+ "<label for='qc_advance_op_all'>Select All</label></div>"
					+ "</div>");

			this.advance.append("<div class='qc_advance_ops'>"
					+ "<input type='button' class='qc_advance_op_ok btn' value='Apply' /></div>");

			// 初始化已选和可选
			this.initSel();
			this.initAll();

			// 高级设置按钮
			this.advanceBtn.click(function() {
				_this.showOrHide();
			});

			// 上移按钮
			this.advance.find(".qc_advance_op_up").click(function() {
				_this.up(this);
			});

			// 下移按钮
			this.advance.find(".qc_advance_op_down").click(function() {
				_this.down(this);
			});

			// 删除按钮
			this.advance.find(".qc_advance_op_del").click(function() {
				_this.del();
			});

			var advanceAllbox = this.advance.find(".qc_advance_allbox");
			// 添加按钮
			advanceAllbox.find(".qc_advance_op_add").click(function() {
				_this.add();
			});

			// 全选按钮
			advanceAllbox.find(".qc_advance_op_all").click(function() {
				_this.selectAll($(this));
			});

			// 确定按钮
			this.advance.find(".qc_advance_op_ok").click(function() {
				_this.submit();
			});

			_this.showOrHide();
		},

		showOrHide : function() {
			if (this.advance.is(":hidden")) {
				this.advance.show();
				this.initSel();
			} else {
				this.advance.hide();
			}
		},

		// 点开后初始化已选列表
		initSel : function() {
			var queryGrid = this.sfaQuery.queryGrid;
			if (queryGrid != null) {
				var gridCols = queryGrid.settings.gridCols;
				var allColModels = queryGrid.settings.allColModels;
				var advanceSel = this.advance.find(".qc_advance_sel");
				advanceSel.empty();
				$.each(gridCols, function(i, val) {
					var model = allColModels[val];
					if (model.hidden || model.isOpts) {
						return;
					}
                    var option = $("<option value='" + val + "'>" + model[colName_i18n] + "</option>");
					advanceSel.append(option);
				});
			}
		},

		initAll : function() {
			// 初始化所有列
			var queryGrid = this.sfaQuery.queryGrid;
			if (queryGrid != null) {
				var includeFields = this.settings.includeFields;
				var excludeFields = this.settings.excludeFields;
				var allColModels = queryGrid.settings.allColModels;
				var advanceAllbox = this.advance.find(".qc_advance_allbox");
				var ul = $("<ul></ul>");
				$.each(allColModels, function(col, model) {
					if (model.hidden || model.isOpts || (includeFields != null && $.inArray(col, includeFields) == -1)) {
						return;
					}
					if($.inArray(col, excludeFields) >= 0){
						return;
					}
                    var li = $("<li><input id='qc_advance_col_" + col + "' value='" + col + "' type='checkbox' />" + "<label for='qc_advance_col_" + col + "'>" + model[colName_i18n] + "</label></li>");
					ul.append(li);
				});
				advanceAllbox.append(ul);
			}
		},

		// 添加
		add : function() {
			var advanceSel = this.advance.find(".qc_advance_sel");
			var advanceAllbox = this.advance.find(".qc_advance_allbox");
			$.each(advanceAllbox.find("li input:checked"), function() {
				var option = $("<option value='" + $(this).val() + "'>" + $(this).next().text() + "</option>");
				if (advanceSel.find("option[value='" + $(this).val() + "']").size() == 0) {
					advanceSel.append(option);
				}
			});
			advanceAllbox.find("li input").attr("checked", false);
			advanceAllbox.find(".qc_advance_op_all").attr("checked", false);
		},

		// 全选
		selectAll : function(btn) {
			var advanceAllbox = this.advance.find(".qc_advance_allbox");
			if (btn.is(":checked")) {
				advanceAllbox.find("li input").attr("checked", true);
			} else {
				advanceAllbox.find("li input").attr("checked", false);
			}
		},

		// 上移
		up : function() {
			var advanceSel = this.advance.find(".qc_advance_sel");
			var sed = advanceSel.find("option:selected");
			if (sed.lenght == 0) {
				P.$.dialog.alert("please select column to move");
				return;
			}
			var col = sed[0];
			$(col).insertBefore($(col).prev());
		},

		// 下移
		down : function() {
			var advanceSel = this.advance.find(".qc_advance_sel");
			var sed = advanceSel.find("option:selected");
			if (sed.lenght == 0) {
				P.$.dialog.alert("please select column to move");
				return;
			}
			var col = sed[0];
			$(col).insertAfter($(col).next());
		},

		// 删除
		del : function() {
			var advanceSel = this.advance.find(".qc_advance_sel");
			advanceSel.find("option:selected").remove();
		},

		// 提交查询
		submit : function() {
			var advanceSel = this.advance.find(".qc_advance_sel");
			var gridCols = [];
			$.each(advanceSel.find("option"), function(i, option) {
				gridCols.push($(option).val());
			});
			this.sfaQuery.resetQueryGrid({
				gridCols : gridCols
			});
		}
	}
});

$.extend($.sfaQueryTemplate, {
	defaults : {
		templateBoxId : 'qc_template_box',
		templates : []
	},

	prototype : {
		init : function() {
			var _this = this;
			this.template = $("#" + this.settings.templateBoxId);
			// 高级设置
			this.template.addClass("qc_template");
			this.template.append("<div class='qc_template_content'>"
					+ "<span>Queries: </span><select class='qc_template_sel'><option value=''></option></select>"
					+ "<input type='button' class='qc_template_op_save btn' value='Save As' />"
					+ "<input type='button' class='qc_template_op_update btn' value='Save' />"
					+ "<input type='button' class='qc_template_op_del btn' value='Delete' />"
					+ "<input type='button' class='qc_template_op_sd btn' value='Set Default' />"
					+ "<input type='button' class='qc_template_op_share btn' value='Share' />"
					+ "<input type='button' class='qc_template_op_col btn' value='Fields Chooser' />"
					+ "</div>");

			var sel = this.template.find(".qc_template_sel");
			var settings = this.settings;
			$.each(this.settings.templates, function(id, tpl) {
				var option = null;
				if(settings.userDefTpl != null && settings.userDefTpl.id == tpl.id){
					option = $("<option value='" + id + "'>*" + tpl.name + "</option>");
					option.addClass("qc_template_userdef");
				}else{
					option = $("<option value='" + id + "'>&nbsp;" + tpl.name + "</option>");
				}
				sel.append(option);
			});

			// 选择新模板事件
			sel.change(function() {
				_this.changeTemplate(_this.settings.templates[sel.val()]);
			});

			sel.val(this.sfaQuery.queryConfig.template.id);

			//默认模板不能修改
			if (this.sfaQuery.queryConfig.template.isDefault == 'y' || this.sfaQuery.queryConfig.template.creator != this.sfaQuery.queryConfig.curUser.id) {
				this._hideBnts(["qc_template_op_update", "qc_template_op_del", "qc_template_op_share" ]);
			}

			// 显示或者隐藏
			this.templateBtn.click(function() {
				_this.showOrHide();
			});

			// 添加按钮事件
			this.template.find(".qc_template_op_save").click(function() {
				_this.save();
			});

			this.template.find(".qc_template_op_update").click(function() {
				_this.update();
			});

			this.template.find(".qc_template_op_del").click(function() {
				_this.del();
			});

			this.template.find(".qc_template_op_sd").click(function() {
				_this.setDefault();
			});

			this.template.find(".qc_template_op_usd").click(function() {
				_this.unsetDefault();
			});

			this.template.find(".qc_template_op_share").click(function() {
				_this.share();
			});

			if(this.settings.initFieldChooser){
				this.template.find(".qc_template_op_col").one("click", function() {
					_this.sfaQuery.initAdvance($(this));
				});
			}else{
				this.template.find(".qc_template_op_col").hide();
			}

			// 显示
			this.template.show();
		},

		save : function() {
			var sel = this.template.find(".qc_template_sel");
			var sfaQuery = this.sfaQuery;
			var _this = this;
			P.$.dialog.prompt('Query Name:', function(val) {
				if ($.trim(val) == '') {
					P.$.dialog.alert("Please input query name!");
					return;
				}
				var qcData = sfaQuery.qcData();
				var gridCols = sfaQuery.gridCols();
				var sort = sfaQuery.sort();
				var template = {
					'template.name' : $.trim(val),
					'template.viewId' : sfaQuery.queryConfig.view.id,
					'template.connector' : qcData != null? qcData.connector : null,
					'template.qcData' : qcData != null? JSON.stringify(qcData.data): null,
					'template.gridCols' : JSON.stringify(gridCols),
					'template.sortname' : sort.sortname,
					'template.sortorder' : sort.sortorder,
					'template.isShare' : 'n'
				};
				$.ajax({
					url : basePath + "/api/v1/template_query/save",
					dataType : "json",
					data : template,
					contentType : 'application/json;charset=utf-8',
					type : 'GET',
					async : false,
					cache : false,


					success : function(obj, textStatus) {
						var jsonData = obj.data;
						if (jsonData.ajaxResult.indexOf("success") != -1) {
							P.$.dialog.alert("Save success!", function(){
								sel.append("<option value='" + jsonData.template.id + "'>&nbsp;" + $.trim(val) + "</option>");
								sel.val(jsonData.template.id);
								_this.settings.templates[jsonData.template.id] = jsonData.template;
								sel.change();
							});
						} else if (jsonData.ajaxResult == 'exception') {
							var errorMsg = "Error:[" + jsonData.exceptionError + "]";
							P.$.dialog.alert(errorMsg);
						}
					}
				});
			});
		},

		update : function() {
			var sel = this.template.find(".qc_template_sel");
			var _this = this;
			var qcData = this.sfaQuery.qcData();
			var gridCols = this.sfaQuery.gridCols();
			var sort = this.sfaQuery.sort();
			var template = {
				'template.id' : sel.val(),
				'template.connector' : qcData.connector,
				'template.qcData' : JSON.stringify(qcData.data),
				'template.gridCols' : JSON.stringify(gridCols),
				'template.sortname' : sort.sortname,
				'template.sortorder' : sort.sortorder
			};

			$.ajax({
				url : basePath + "/sfaQuery/template_update.action",
				dataType : "json",
				data : template,
				contentType : 'application/json;charset=utf-8',
				type : 'GET',
				async : false,
				cache : false,


				success : function(obj, textStatus) {
					var jsonData = obj.data;
					if (jsonData.ajaxResult.indexOf("success") != -1) {
						P.$.dialog.alert("Save success!", function(){
							_this.settings.templates[jsonData.template.id] = jsonData.template;
						});
					} else if (jsonData.ajaxResult == 'exception') {
						var errorMsg = "Error:[" + jsonData.exceptionError + "]";
						P.$.dialog.alert(errorMsg);
					}
				}
			});
		},

		del : function() {
			var _this= this;
			var sel = this.template.find(".qc_template_sel");
			var template = {
				'template.id' : sel.val()
			};


			$.ajax({
				url : basePath + "/sfaQuery/template_delete.action",
				dataType : "json",
				data : template,
				contentType : 'application/json;charset=utf-8',
				type : 'GET',
				async : false,
				cache : false,


				success : function(obj, textStatus) {
					var jsonData = obj.data;
					if (jsonData.ajaxResult.indexOf("success") != -1) {
						P.$.dialog.alert("Delete success!", function(){
							//删除
							sel.find("option[value='" + sel.val() + "']").remove();
							_this._hideBnts(["qc_template_op_update", "qc_template_op_del", "qc_template_op_share" ]);
						});
					} else if (jsonData.ajaxResult == 'exception') {
						var errorMsg = "Error:[" + jsonData.exceptionError + "]";
						P.$.dialog.alert(errorMsg);
					}
				}
			});
		},

		setDefault : function() {
			var sel = this.template.find(".qc_template_sel");
			var template = {
				'template.id' : sel.val(),
				'template.viewId' : this.sfaQuery.queryConfig.view.id
			};

			$.ajax({
				url : basePath + "/sfaQuery/template_setDefault.action",
				dataType : "json",
				data : template,
				contentType : 'application/json;charset=utf-8',
				type : 'GET',
				async : false,
				cache : false,


				success : function(obj, textStatus) {
					var jsonData = obj.data;
					if (jsonData.ajaxResult.indexOf("success") != -1) {
						P.$.dialog.alert("Set Default success!");
					} else if (jsonData.ajaxResult == 'exception') {
						var errorMsg = "Error:[" + jsonData.exceptionError + "]";
						P.$.dialog.alert(errorMsg);
					}
				}
			});

			//设置样式
			var oldOption = this.template.find(".qc_template_sel option.qc_template_userdef");
			if(oldOption.size() > 0){
				oldOption.removeClass("qc_template_userdef");
				oldOption.html(oldOption.html().replace("*", "&nbsp;"));
			}

			var nOption = sel.find("option[value='" + sel.val() + "']");
			nOption.addClass("qc_template_userdef");
			nOption.html(nOption.html().replace("&nbsp;", "*"));
		},

		unsetDefault : function() {
			var template = {
				'template.viewId' : this.sfaQuery.queryConfig.view.id
			};

			$.ajax({
				url : basePath + "/sfaQuery/template_unsetDefault.action",
				dataType : "json",
				data : template,
				contentType : 'application/json;charset=utf-8',
				type : 'GET',
				async : false,
				cache : false,


				success : function(obj, textStatus) {
					var jsonData = obj.data;
					if (jsonData.ajaxResult.indexOf("success") != -1) {
						P.$.dialog.alert("Unset Default success!");
					} else if (jsonData.ajaxResult == 'exception') {
						var errorMsg = "Error:[" + jsonData.exceptionError + "]";
						P.$.dialog.alert(errorMsg);
					}
				}
			});
		},

		share : function() {
			var sel = this.template.find(".qc_template_sel");
			var template = {
					'template.id' : sel.val()
			};

			$.ajax({
				url : basePath + "/sfaQuery/template_share.action",
				dataType : "json",
				data : template,
				contentType : 'application/json;charset=utf-8',
				type : 'GET',
				async : false,
				cache : false,


				success : function(obj, textStatus) {
					var jsonData = obj.data;
					if (jsonData.ajaxResult.indexOf("success") != -1) {
						P.$.dialog.alert("Share success!");
					} else if (jsonData.ajaxResult == 'exception') {
						var errorMsg = "Error:[" + jsonData.exceptionError + "]";
						P.$.dialog.alert(errorMsg);
					}
				}
			});
		},

		showOrHide : function() {
			if (this.template.is(":hidden")) {
				this.template.show();
			} else {
				this.template.hide();
				this.sfaQuery.hideQueryAdvance();
			}
		},

		changeTemplate : function(template) {
			if (template == null) {
				this._hideBnts(["qc_template_op_update", "qc_template_op_del", "qc_template_op_share" ]);
				return;
			}

			if(typeof template != "object"){
				template = this.settings.templates[template];
			}

			var options = {};
			if(template.qcData != null && template.qcData != ''){
				options.qcData = JSON.parse(template.qcData);
			}
			if(template.gridCols != null && template.gridCols != ''){
				options.gridCols = JSON.parse(template.gridCols);
			}
			options.jqGridSettings = {};
			if(template.sortname != null){
				options.jqGridSettings['sortname'] = template.sortname;
			}
			if(template.sortorder != null){
				options.jqGridSettings['sortorder'] = template.sortorder;
			}

			// 隐藏或者显示按钮组
			if (template.isDefault == 'y' || template.creator != this.sfaQuery.queryConfig.curUser.id) {
				this._hideBnts(["qc_template_op_update", "qc_template_op_del", "qc_template_op_share" ]);
			} else {
				this._hideBnts([]);
			}

			this.sfaQuery.changeTemplate(options);
		},

		_hideBnts : function(clss) {
			var template = this.template;
			// 显示所有
			template.find("[class^='qc_template_op']").show();

			$.each(clss, function(i, cls) {
				template.find("." + cls).hide();
			});
		}
	}
});

$.extend($.sfaQueryGrid, {
	defaults : {
		url : null,
		gridId : 'common_list_grid', //
		allColModels : {}, // 所有列模型
		optsCols : [], //操作按钮列
		optsFirst : false,	//操作列是否显示在前面
		gridCols : [], // 显示列
		callback : null, // 双击回调函数
		widthShrinkToFit : 960,
		loadDataPostInit : true,
		completeCallback : null, // 数据加载完毕后回调函数
		defaultModelSetting : { // colModel默认属性
			width : 100,
			align : 'center',
			sortable : true
		},

		defaultOptsModelSetting :{
			width : 50,
			align : 'center',
			sortable : false
		},

		jqGridSettings : { // jqGrid所用的属性
			id : "id"
		}
	},

	prototype : {
		init : function() {
			this.requestActive = true;
			var _this = this;
			var settings = this.settings;
			var allColModels = settings.allColModels;
			var grid = $("#" + this.settings.gridId);
			// debugger
			this.grid = grid;
			this.grid.data("queryGrid", this);
			var id = settings.jqGridSettings.id;


			var gridColNames = [];
			var gridColModels = [];
			var gridColModelsMap = {};

			var totalWidth = 0;
			if(settings.gridCols != null && settings.gridCols.length != 0){
				// 用户自定义显示的colModel
				$.each(settings.gridCols, function(k, v) {
					var name = v;
					if(typeof v == "object"){
						name = v.name;
					}
					var model = allColModels[name];
					if (model == null) {
						P.$.dialog.alert("Cann't find colModel. |colName:" + name);
						return;
					}
					if(typeof v == "object"){
						model = $.extend({}, settings.defaultModelSetting, model, v);
					}else{
						model = $.extend({}, settings.defaultModelSetting, model);
					}
					if(model.hidden == null || !model.hidden){
						totalWidth += model.width;
					}
                    gridColNames.push(model[colName_i18n]);
					gridColModels.push(model);
					gridColModelsMap[model.name] = model;
				});

				$.each(allColModels, function(v, model) {

					if (!model.isOpts && model.hidden != null && model.hidden){
						//增加显示所有hidden列
						var model = $.extend({}, settings.defaultModelSetting, model);
                        gridColNames.push(model[colName_i18n]);
						gridColModels.push(model);
						gridColModelsMap[model.name] = model;
					}

					if(model.force && settings.gridCols[model.name] == null){
						//设置为强制添加的列， 如果没有设置为显示，则默认设置为隐藏
						var model = $.extend({}, settings.defaultModelSetting, model);
                        gridColNames.push(model[colName_i18n]);
						gridColModels.push(model);
						gridColModelsMap[model.name] = model;
						model.hidden = true;
					}
				});

			}else{
				//未设置显示列，则显示全部
				settings.gridCols = [];
				$.each(allColModels, function(v, model) {
					if (model.isOpts) {
						return;
					}
					var model = $.extend({}, settings.defaultModelSetting, model);
					if(model.hidden == null || !model.hidden){
						totalWidth += model.width;
					}
                    gridColNames.push(model[colName_i18n]);
					gridColModels.push(model);
					gridColModelsMap[model.name] = model;
				});
			}

			//操作列
			if(settings.optsCols != null){
				$.each(settings.optsCols, function(k, v) {
					var model = allColModels[v];
					if (model == null) {
						P.$.dialog.alert("Cann't find colModel. |colName:" + v);
						return;
					}
					var model = $.extend({}, settings.defaultOptsModelSetting, model);
					totalWidth += model.width;
					if(settings.optsFirst){
                        gridColNames.splice(k, 0, model[colName_i18n] == null ? '' : model[colName_i18n]);
						gridColModels.splice(k,0,model);
						gridColModelsMap[model.name] = model;
					}else{
                        gridColNames.push(model[colName_i18n] == null ? '' : model[colName_i18n]);
						gridColModels.push(model);
						gridColModelsMap[model.name] = model;
					}
				});
			}

			// 是否缩放列宽度
			var shrinkToFit = true;
			if (totalWidth > this.settings.widthShrinkToFit) {
				shrinkToFit = false;
			}
			var _set=this.settings;
			var gridSetting = {
				ajaxGridOptions : {
					type : 'POST',
					contentType : 'application/json;charset=utf-8',
					dataType : 'json'
				},
				url : settings.url != null ? settings.url : basePath + settings.view.gridUrl,
				mtype : 'POST',
				datatype : "json",
				altRows : true,
				cache : false,
				altclass : 'oddClass',
				//height : '100%',
				autowidth : true, // 自动匹配宽度
				shrinkToFit : shrinkToFit,
				scrollrows : true, // 是否显示行滚动条
				autoScroll : true,
				colNames : gridColNames,
				colModel : gridColModels,
				pager : "gridPager", // 表格数据关联的分页条，html元素

				sortable : false, // 可以排序
				sortname : id, // 默认排序字段
				sortorder : "desc", // 排序方式

				pginput : true,// 显示跳转页面输入框
				pgbuttons : true,// 显示翻页按钮
				pgtext : 'Page {0} of {1}',
				recordtext : 'View {0} - {1} of {2}',
				emptyrecords : "",

				rowNum : 15, // 每页显示记录数
				rownumbers : true, // 显示行号

				viewrecords : true, // 显示总记录数
				gridview : true, // 加速显示
				multiselect : true, // 可多选，出现多选框
				multiboxonly : false, // 点击checkbox时该行才被选中
				multiselectWidth : 25, // 设置多选列宽度
				altRows : true,// 隔行变色
				altclass : 'oddClass',

				toolbar : [ true, "top" ],
				gridview : true, // 构造一行数据后添加到grid中，如果设为true则是将整个表格的数据都构造完成后再添加到grid中

				pgbuttons : true, // 是否显示翻页按钮
				pginput : true, // 是否显示跳转页面的输入框
				rowList : [15,20,30,50,100, 200, 300, 500, 1000],

				jsonReader : {
					//用户自定义数据
					userdata : function(obj) {
						var jsonData = obj.data;
						if (jsonData.ajaxResult.indexOf("success") != -1) {
							return jsonData.pageModel.userdata;
						}
					},
					// 当前页
					page : function(obj) {
						var jsonData = obj.data;
						if (jsonData.ajaxResult.indexOf("success") != -1) {
							return jsonData.pageModel.page;
						}
					},
					// 总页数
					total : function(obj) {
						var jsonData = obj.data;
						if (jsonData.ajaxResult.indexOf("success") != -1) {
							return jsonData.pageModel.total;
						}

					},
					// 查询出的记录数
					records : function(obj) {
						var jsonData = obj.data;
						if (jsonData.ajaxResult.indexOf("success") != -1) {
							return jsonData.pageModel.records;
						}

					},
					// 查询出的记录
					root : function(obj) {
						var jsonData = obj.data;
						if (jsonData.ajaxResult.indexOf("success") != -1) {
							// 服务器端返回的数据
							grid.data("originalData", jsonData.pageModel.gridModelData);
							// 返回权限
							if(jsonData.gridPermissionMap != null){
								gridPermissionMap = jsonData.gridPermissionMap;
							}

							//对 <>字符转义
							var ret = jsonData.pageModel.gridModelData;
							_this._escapeHtml(ret);
							return ret;

						} else if (jsonData.ajaxResult == 'exception') {
							// 显示后台异常信息
							if (jsonData.exceptionType == 'permission') {
								var errorMsg = "Error:[" + jsonData.exceptionError + "]";
								P.$.dialog.alert(errorMsg);
							} else {
								var errorMsg = "Error:[" + jsonData.exceptionError + "]";
								P.$.dialog.alert(errorMsg);
							}
						} else if (jsonData.ajaxResult == 'failure') {
							var errorMsg = "Error:[" + (jsonData.errorMessage || jsonData.message) + "]";
							P.$.dialog.alert(errorMsg);
						}
					},
					id : id,
					repeatitems : false
				// 设置成false，在后台设置值的时候，可以乱序。且并非每个值都得设
				},
				postData : this.sfaQuery.postData(), // 发送数据
				serializeGridData: function(postData) {
				    return JSON.stringify(postData);
				},
				prmNames : {
					page : "page", // 表示请求当前页码的参数名称(默认)
					rows : "rows", // 表示请求行数的参数名称(默认)
					sort : "sidx", // 表示用于排序的列名的参数名称
					order : "sord", // 表示采用的排序方式的参数名称(排序方式：asc，
					// desc)
					search : "search", // 表示是否是搜索请求的参数名称
					id : id
				// 表示当在编辑数据模块中发送数据时，使用的id的名称
				},
				beforeRequest:function(){
					grid.parent().find(".loading").show();
				},

				//session失效处理
				loadError : function(jqXHR, textStatus, errorThrown){
					if(typeof(handleSessionErr) != "undefined"){
						handleSessionErr(jqXHR, textStatus, errorThrown,function(){
							_this.sfaQuery.reloadQueryGrid();
						});
					}
				},

				// 添加找不到相关记录提示信息 居中
				gridComplete : function() {
					var grid_parent_width = $("#gbox_"+_set.gridId).parent().width();
					if(_gridWidth <= 0 || (grid_parent_width != 0 && _gridWidth > grid_parent_width - 3)){
						_gridWidth = grid_parent_width - 3;
					}

					grid.jqGrid('setGridWidth',_gridWidth);
					var re_records = grid.getGridParam('records');

					if (re_records == 0 || re_records == null) {
						if (grid.parent().find(".norecords").html() == null) {
							grid.parent().append("<div class=\"norecords\">No records to view</div>");
						}

						grid.jqGrid('setGridHeight', 50);
						grid.parent().find(".norecords").show();
						$(".ui-jqgrid-htable").width(_gridWidth);

					} else {

						// 如果有数据，则需要隐藏norecords
						grid.parent().find(".norecords").hide();
						if(settings.userdataCallback){
							settings.userdataCallback(grid.getGridParam('userData'));
						}

						_this.resetGridHeight();

						if(!bindFlag){//防止多次绑定
							onWindowResize.add(function(){//(onWindowResize方法在glbal_var.js中)
								_this._resetGridHeight(grid,_set);
							});
							bindFlag = true;
						}
					}
					_this.requestActive = false;
					_set.completeCallback && _set.completeCallback.call(_this);
				},

				// 双击事件
				ondblClickRow : function(key) {
					var rowdata = _this.jqGrid.getRowData(key);
					var originalData = grid.data("originalData");
					if (settings.callback) {
						$.each(originalData, function(i,val){
							if(val[id] == key){
								settings.callback(rowdata, val);
								return false;
							}
						});
					}
				}
			};

			if(!settings.loadDataPostInit){
				gridSetting.datatype = 'local';
			}

			$.extend(true, gridSetting, settings.jqGridSettings);
			this.jqGrid = grid.jqGrid(gridSetting, {singleselect: true, lazyload: true});

			if(!settings.loadDataPostInit){
				 grid.jqGrid('setGridParam',{datatype:'json'});
			}
		},

		setGridParam : function(param, value){
			this.jqGrid.setGridParam({param : value});
		},

		resetGridHeight : function(){
			var _this = this;
			setTimeout(function(){
				try{
					_this._resetGridHeight(_this.grid,_this.settings);
				}catch(ex){
					//捕获前一次异常,无需处理
					//NOTHING
				}
			},0);//延迟兼容ie
		},

		 /*解决表格过高无法看到的bug*/
		_resetGridHeight : function(grid,_set){
			 var _shrinkToFit = false;
			 if(grid.width() < _gridWidth){
				 _shrinkToFit = true;
			 }
			 var search_zone_height = 68,
				list_btn_row_height = $(".list_btn_row").outerHeight(true);
				list_btn_row_s_height =$(".list_btn_row_s").is(":hidden")? 0 : $(".list_btn_row_s").outerHeight(true);
				searchForm_height = $("#searchForm").outerHeight(true);
				qc_box_height = $(".qc_box").outerHeight(true);
				footrow_height = $(".footrow").outerHeight(true);
				div_btn_height = $(".div_btn").outerHeight(true);
				tabs_header_height = $(".tabs-header").outerHeight(true);
				qc_advance_box_height = $("#qc_advance_box").is(":hidden")? 0 :$("#qc_advance_box").outerHeight(true);
				qc_template_content_height = $(".qc_template_content").is(":hidden")? 0 :$(".qc_template_content").outerHeight(true);
			if(typeof list_btn_row_height != "undefined"){
				search_zone_height += list_btn_row_height;
			}
			if(typeof list_btn_row_s_height != "undefined"){
				search_zone_height += list_btn_row_s_height;
			}
			if(typeof searchForm_height != "undefined"){
				search_zone_height += searchForm_height;
			}
			if(typeof qc_box_height != "undefined"){
				search_zone_height += qc_box_height;
			}
			if(typeof footrow_height != "undefined"){
				search_zone_height += footrow_height;
			}
			if(typeof qc_advance_box_height != "undefined"){
				search_zone_height += qc_advance_box_height;
			}
			if(typeof qc_template_content_height != "undefined"){
				search_zone_height += qc_template_content_height;
			}
			if(typeof div_btn_height != "undefined"){
				search_zone_height += div_btn_height;
			}
			if(typeof tabs_header_height != "undefined"){
				search_zone_height += tabs_header_height;
			}
			var _grid_height = grid.height();//当表格高度为100%的实际高度
			var _self_grid_height = _set.jqGridSettings.height;//自定义高度

			var _this_body_height = $(window).height()==0 ? window.top.getIframeHeight() : $(window).height();
			if(_grid_height >= _this_body_height-search_zone_height){
				_self_grid_height = _this_body_height - search_zone_height;//初始化时根据浏览器可视区域设置默认高度
				grid.jqGrid('setGridHeight',_self_grid_height);
			}else{
				grid.jqGrid('setGridHeight',"100%");
			}
			$("#"+_set.gridId).jqGrid('setGridWidth', _gridWidth, _shrinkToFit);
		},

		reInit : function(options, callback) {
			$.extend(this.settings, options);

			var _this = this;

			if(this.interval != null){
				clearTimeout(this.interval);
			}

			var interval = null;

			var func = function(){
				if(!_this.requestActive){
					_this.activeInterval = interval;
					_this.jqGrid.GridUnload();
					_this.init();
					if(callback){
						callback();
					}
				}else{
					interval = setTimeout(func, 50);
					_this.interval = interval;
				}
			};

			interval = setTimeout(func, 50);
			this.interval = interval;
		},

		reloadGrid : function(data) {
			/*//this.settings.jqGridSettings.height
			var grid = $("#" + settings.girdId)
			var _grid_height = grid.height();//当表格高度为100%的实际高度
			var _self_grid_height = this.settings.jqGridSettings.height;
			if(typeof _self_grid_height == "undefined" && _grid_height > parent.getIframeHeight()-125){
				var _self_grid_height = parent.getIframeHeight()-155;//初始化时根据浏览器可视区域设置默认高度
			}
			grid.jqGrid('setGridHeight',_self_grid_height);
			//this.jqGrid.setGridHeight("100%");*/

			var postData = this.jqGrid.getGridParam("postData");
			postData['qname'] = {};
			postData['qoperator'] = {};
			postData['qvalue'] = {};
			this.jqGrid.setGridParam({
				type : "json",
				postData : data
			}).trigger("reloadGrid");
		},

		_escapeHtml : function(obj){
			var _this = this;
			if(obj == null){
				return null;
			}
			$.each(obj, function(k, v){
				if(v == null){
					return;
				}

				if(typeof(v) == 'string'){
					 obj[k] = v.replace(/</g, "&lt;").replace(/>/g, "&gt;");

				}else if(typeof(v) == 'object'){
					_this._escapeHtml(v);
				}
			});
		}
	}
});

//弹出窗口选择器
$.extend($.sfaQueryDialog, {
	defaults : {
		content: 'url:' + basePath + '/views/sfa_query_list.shtml',
		dialogId: '',
		dialogTitle : '',
		dialogWidth : 1110,
		dialogHeight : 560,
		dialogTop : "15%",
		button : [{
			name : "close"
		}],

		gridOptions : {
			jqGridSettings :{
				autowidth : false,
				multiselect : false
			},
			callback : null
		}
	},

	prototype : {
		init : function() {
			this.settings.gridOptions.jqGridSettings.width = this.settings.dialogWidth - 20;
			if(typeof(queryDialogOptions) != "undefined" && queryDialogOptions != null && queryDialogOptions[this.settings.view] != null){
				var options = queryDialogOptions[this.settings.view];
				$.extend(true,this.settings ,options);
			}
			this.show();
		},

		show : function(){
			var settings = this.settings;
			if(this.dialog == null || this.dialog.closed){
				this.dialog = P.$.dialog({
					id : settings.dialogId,
					title : settings.dialogTitle,
					width : settings.dialogWidth,
					height : settings.dialogHeight,
					top : settings.dialogTop,
					content : settings.content,
					button : settings.button,
					lock: settings.lock,
					data : settings,
					close : settings.close
				});
			}
		},

		close :function(){
			this.dialog.close();
		},

		sfaQuery : function(){
			return this.dialog.data.sfaQuery;
		}
	}
});
