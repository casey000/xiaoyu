var api = frameElement.api,P = api.opener;
var param = api.data;
var PageRender = {};
var _self = this;

$(function(){
	PageRender = {
		buttons : {
			"complete" : {
				id : "complete",
				name : "Complete",
				callback : function() {}
			},
			
			'logs' : {
				name : 'Logs',
				callback : function(){
					viewLogs($("#processId").val());
					return false;
				}
			},
			
			"cancel" : {
				name : "Cancel"
			}
		},

		trs : {
			'flight' : {
				element : $("#tr_flight")
			},
			
			'lineJob' : {
				element : $("#tr_lineJob")
			},
			
			'taskStatus' : {
				element : $("#tr_status"),
				val : function(){
					return $("#taskStatus").val();
				}
			},
			
			'businessType' : {
				element : $("#tr_businessType"),
				val : function(){
					if($("#ppcTo").val() == "true"){
						return $("#businessType").val() + "_to";
					}
					return param.type ||  $("#businessType").val();
				}
			},
			
			'maintenanceTask' : {
				element : $("#tr_maintenanceTask"),
				
				val : function(){
					return $.trim($("#maintenanceTaskType").text());
				}
			},
			
			'desc' : {
				element : $("#tr_desc")
			},
			
			'lastRemark' : {
				element : $("#tr_last_remark")
			},
			
			'remark' : {
				element : $("#tr_remark")
			},

			'user' : {
				element : $("#tr_user"),
				init : function(){
					var options = this.options;
					this.uninit();
					this.element.find("input").click(function(){
						//绑定选择用户事件
						selectUser({ele : $("#tr_user")});
					});
				},
				
				uninit : function(){
					this.element.find("input").unbind("click");
				}
			},
			
			'mechanic' : {
				element : $("#tr_mechanic"),
				init : function(){
					var options = this.options;
					this.uninit();
					this.element.find(".search_btn_img").click(function(){
						//绑定选择用户事件
						selectUser({ele : $("#tr_mechanic")});
					});
				},
				
				uninit : function(){
					this.element.find("#tr_mechanic .search_btn_img").unbind("click");
				}
			},
			'action' : {
				element : $("#tr_action"),
				init : function(){
					var options = this.options;
					this.uninit();
					this.element.find(".search_btn_img").click(function(){
						//绑定选择用户事件
						selectUser({ele : $("#tr_action")});
					});
					
					//延误和取消非必填
					$("#tr_action .dlyCnl").removeClass("required");
					$("#riiSign").removeClass("required");
					$("#tr_action .rii").attr("disabled", true);
					$("#tr_action .rci").attr("disabled", true);
					var rii = $("#rii").val();
					var rci = $("#rci").val();
					//判断是否必检, 必检时必填
					if(rii != null && rii == "y"){
						$("#tr_action .rii").attr("checked", true);
						$("#riiSign").addClass("required");
					}else if(rci != null && rci == "y"){
						$("#tr_action .rci").attr("checked", true);
						$("#riiSign").addClass("required");
					} else {
						$("#riiImg").hide();
					}
				},
				
				uninit : function(){
					this.element.find("#tr_action .search_btn_img").unbind("click");
				}
			},
			
			'lisence' : {
				element : $(".lisence")
			},
			
			'complete' : {
				element : $("#tr_complete")
			},
			
			
			'ddRepairDate' : {
				element : $("#tr_dd_repair_date")
			},
			
			'ddCorrectiveCn' : {
				element : $("#tr_dd_corrective_cn")
			},
			
			'ddCorrectiveEn' : {
				element : $("#tr_dd_corrective_en")
			},
			
			'attachment' : {
				element : $("#tr_attachment"),
				
				init : function(){
					this.uninit();
					initAttachmentContent(this);
				},
				
				uninit : function(){
					this.element.find(".img_add").unbind("click");
					this.element.find(".img_del").die("click");
				}
			},
		},

		// 所有配置全部默认显示
		defaults : {
			viewTrs : {
				
				'remark' : {
					show: true
				},
				
				'flight' : {
					show: true
				},
				
				'lineJob' : {
					show: true
				},
				
				'maintenanceTask' : {
					show: true
				},
				
				'desc' : {
					show: true
				},
				
				"mechanic" : {
					show : true,
					disabled : true
				},
				
				"lisence" : {
					show : false,
					disabled: true
				},
				
				'lastRemark' : {
					show: true
				}
			}
		},

		nodeConfig : {
			"wokerReceive" : {
				viewButtons : ['logs', 'complete', 'reject' , 'cancel' ],
				viewTrs : {
					"attachment" : {
						show : true
					},
					
					"mechanic" : {
						show : true,
						required : true,
						disabled : false
					},
					
					"remark" : {
						title : "Feed Back"
					},
					
					"complete" : {
						show : true,
						required : true,
						disabled: false
					},
					
					"action" : {
						show : true,
						required : true
					},
					
					'ddCorrectiveCn' : {
						show : true,
						required : true
					},
					
					'ddCorrectiveEn' : {
						show : true,
						required : true
					},
					
					'maintenanceTask' : {
						options : {
							"DEFECT" : {
								viewButtons : function(){
									return ['cancel' ]
								}
							}
						}
					}
				}
			}
		},

		// 渲染页面
		render : function(o){
			
			// 初始化显示设置
			this.init(o);
			
			// 渲染按钮组
			this.renderButtons();
			
			// 渲染表格
			this.renderTrs();
			
			// 处理内嵌表格样式
			this.processInnerTableBorder();
		},
		
		//初始化显示设置
		init : function(o){
			var settings = {};
			//将Edit，Add他们自己特有的节点和默认显示的节点付给settings
			if(o == null){
				$.extend(true, settings, this.defaults);
			}else if(typeof(o) != 'object'){
				$.extend(true, settings, this.defaults,  this.nodeConfig[o]);
			}else{
				o.node = o.node || this.settings.node;
				$.extend(true, settings, this.defaults, this.nodeConfig[o.node], o);
			}
			
			//获取需要显示的行, 根据行的值获取显示设置
			var trs = {};
			$.extend(true, trs, PageRender.trs, settings.viewTrs);
			$.each(trs, function(key, obj){
				if(obj.val == null){
					return;
				}
				
				var show = obj.show;
				if(typeof(show) == "function"){
					show = show();
				}
				
				if(show){
					var val = obj.val();
					$.extend(true, settings, obj.options[val]);
				}
			});
			
			this.settings = settings;
		},
		
		
		//渲染按钮组
		renderButtons : function(){
			api.DOM.buttons.empty();
			api._listeners = {};
			var viewButtons = this.settings.viewButtons;
			if(typeof(viewButtons) == "function"){
				viewButtons = viewButtons();
			}
			$.each(viewButtons, function(i, v){
				if(typeof(v) == 'object'){
					api.button(v);
				}else{
					api.button(PageRender.buttons[v]);						
				}
			});
		},
		
		//渲染表格
		renderTrs : function(){
			var trs = {};
			$.extend(true, trs, PageRender.trs, this.settings.viewTrs);
			
			var _this = this;
			//先渲染所有显示的
			$.each(trs, function(key, obj){
				if(_this.needShow(key, obj)){
					_this.showTr(obj);
				}
			})
			
			//隐藏所有需要隐藏的
			$.each(trs, function(key, obj){
				if(!_this.needShow(key, obj)){
					_this.hideenTr(obj);
				}
			})
		},
		
		needShow : function(key, obj){
			var hideTrs = this.settings.hideTrs;

			if($.inArray(key,hideTrs) != -1){
				return false;
			}
			
			var show = obj.show;
			if(typeof(show) == "function"){
				show = show();
			}
			
			return show;
		},
		
		/**
		 * 渲染行
		 */
		showTr : function(tr){
			var eles = tr.element.find("input,select,textarea");
			eles.not(".datebox-f,.combo-text,.combo-value,.datetimebox-f").show();
			
			//必填样式
			var required = tr.required;
			if(typeof(tr.required) == "function"){
				required = required();
			}

			//日期
			if(eles.is(".datetimebox-f")){
				$.each(eles.filter(".combo-text"), function(i, ele){
					$(ele).attr("name", "preciseDateTime_" + (new Date()).getTime() + "_" + i);
					$(ele).addClass("preciseDateTime");
				});
			}else if(eles.is(".datebox-f")){
				$.each(eles.filter(".combo-text"), function(i, ele){
					$(ele).attr("name", "preciseDate_" + (new Date()).getTime() + "_" + i);
					$(ele).addClass("preciseDate");
				});
			}
			
			if(required){
				eles.addClass("required");
				tr.element.find(".required_tip").show();
				
			}else{
				eles.removeClass("required");
				tr.element.find(".required_tip").hide();
			}
			
			//禁用
			var disabled = tr.disabled;
			if(typeof(tr.disabled) == "function"){
				disabled = disabled();
			}
			if(disabled){
				tr.element.find(".ipt_display").remove();
				$.each(eles.not(":radio").not(":checkbox").not(".combo-text"), function(i, ele){
					var $ele = $(ele);
					if(!$ele.is(":hidden") && !$ele.is("[type='hidden']")/*IE8*/){
						if($ele.is("select")){
							$ele.after("<span class='ipt_display'>" + $ele.find("option:selected").text() + "</span>");
						}else{
							$ele.after("<span class='ipt_display'>" + $ele.val() + "</span>");							
						}
						$ele.hide();
					}
				});
				tr.element.find(".search_btn_img").hide();
				tr.element.find(".date").datebox("disable");
				eles.attr("disabled", true);
			}else{
				tr.element.find(".ipt_display").remove();
				eles.attr("disabled", false);
				tr.element.find(".date").datebox("enable");
			}
			
			//初始化
			if(tr.init){
				tr.init();
			}
			
			//处理title
			var title = tr.title;
			if(typeof(title) == "function"){
				title = title();
			}
			
			if(title != null){
				tr.element.find(".title").text(tr.title);
			}
			
			tr.element.show();
		},
		
		/**
		 * 隐藏行
		 */
		hideenTr : function(tr){
			var eles = tr.element.find("input,select,textarea");
			eles.attr("disabled", true);
			eles.removeClass("required");
			tr.element.find(".required_tip").hide();
			eles.not(".datebox-f,.combo-text,.combo-value,.datetimebox-f").hide();
			tr.element.hide();
			
			//初始化
			if(tr.uninit){
				tr.uninit();
			}
		},
		
		/**
		 * 内嵌表格样式处理
		 */
		processInnerTableBorder : function(){
			$.each($("td table"), function(i,v){
				$(v).find("tr:first > td").css("border-top", 0);
				$(v).find("tr:last > td").css("border-bottom", 0);
				$(v).closest("td").css("padding", 0);
				$(v).closest("td").css("margin", 0);
			});
			
			$.each($("td table tr"), function(i,v){
				$(v).find("td:first").css("border-left", 0);
				$(v).find("td:last").css("border-right", 0);
			});
		}
	};
	
	// 添加cc按钮
	$("#add_cc_btn").click(function() {
		var params = {
			"methodType":"add",
			"tlbId":$("#tlbId").val(),
			"docNo":$("#defectNo").val()
		};
		P.$.dialog({
			title:'Add TLB CC',
			width:'1000px',
			height:'500px',
			top:'10%',
			esc:true,
			cache:false,
			max: false, 
			min: false,
			parent:this,
			content:'url:tlb/defect/tlb_cc_add.jsp',
			data:params,
			close:function(){
				//刷新当前窗口
				_self.location.reload();
			}
		});
	});
	
	// 删除按钮事件
	$(".tlb_cc_item .delete_btn").click(function() {
		var tlbCompCCId = $(this).attr("tlbCompCCId");
		P.$.dialog.confirm("Sure to delete?", function(){
			deleteTlbCompCC(tlbCompCCId);
		});
	});
	
	// 编辑按钮事件
	$(".tlb_cc_item .edit_btn").click(function() {
		var tlbCompCCId = $(this).attr("tlbCompCCId");
		editTlbCompCC(tlbCompCCId);
	});
	
	// close按钮事件
	$(".tlb_cc_item .close_btn").click(function() {
		var tlbCompCCId = $(this).attr("tlbCompCCId");
		closeTlbCompCC(tlbCompCCId);
	});
	
	
	$(".date").datebox();
	$(".datetime").datetimebox();
	
	var node = param.node || $("#taskDefinitionKey").val();
	PageRender.render({node : node});
});

/**
 * 查看CC
 * @param obj
 * @param event
 */
function view(obj) {
	var id = $(obj).attr('id');
	var params = {
		"methodType":"view"
	};
	var actionUrl = basePath + "/tlb/tlb_comp_cc_view.action?id="+id;
	P.$.dialog({
		title:'View TLB CC',
		width:'1000px',
		height:'500px',
		top:'10%',
		esc:true,
		cache:false,
		max: false, 
		min: false,
		parent:this,
		content : 'url:' + actionUrl,
		data : params
	});
}

/**
 * 编辑CC
 */
function editTlbCompCC(id){
	var params = {
		"methodType":"edit"
	};
	var actionUrl = basePath + "/tlb/tlb_comp_cc_edit.action?id="+id;
	P.$.dialog({
		title:'Edit TLB CC',
		width:'1000px',
		height:'500px',
		top:'10%',
		esc:true,
		cache:false,
		max: false, 
		min: false,
		parent:this,
		data:params,
		content:'url:'+actionUrl,
		close:function(){
			//刷新当前窗口
			_self.location.reload();
		}
	});
}

/**
 * 删除CC
 */
function deleteTlbCompCC(id){
	var actionUrl = basePath + "/tlb/tlb_comp_cc_delete.action";
	var params = {
		"tlbCompCC.id":id
	}
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		data : params,
		success : function(data) {
			if(null != data){
				var info = JSON.parse(data);
				if(info.ajaxResult == 'success'){
					P.$.dialog.tips('Success! ', 2, "success.gif");
					//刷新当前窗口
					_self.location.reload();
				} else {
					P.$.dialog.alert('Failure! ');
				}
			}
		}
	});
}

/**
 * 关闭CC
 */
function closeTlbCompCC(id){
	var actionUrl = basePath + "/tlb/tlb_comp_cc_close.action";
	var params = {
		"tlbCompCC.id":id
	}
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		data : params,
		success : function(data) {
			if(null != data){
				var info = JSON.parse(data);
				if(info.ajaxResult == 'success'){
					P.$.dialog.tips('Success! ', 2, "success.gif");
					//刷新当前窗口
					_self.location.reload();
				} else {
					P.$.dialog.alert('Failure! ');
				}
			}
		}
	});
}

/**
 * 用户选择
 * @param parameters
 */
function selectUser(parameters){
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
				parameters.ele.find(".name").val(this.data.result.name);
				parameters.ele.find(".sn").val(this.data.result.sn);
				parameters.ele.find(".id").val(this.data.result.id);
			}
		},
		content:'url:' + basePath + '/security/user/select_user_list.jsp',
		data : {}
	});
}

/**
 * 初始化附件选择
 * @param element
 */
function initAttachmentContent(options){
	var o = {
		"multiple" : true,
		"reg" : /\[([0-9]+)\]/
	}
	
	$.extend(true, o, options);
	
	if(o.disabled){
		o.element.find(".attachmentAdd").hide();
	}else{
		o.element.find(".attachmentAdd").show();
	}
	
	if(o.multiple){
		o.element.find(".img_add").click(function(){
			//增加新行
			var lastTr =  o.element.find(".img_del:last").closest("tr");
			var clone = lastTr.clone();
			clone.find(":file").val("");
			lastTr.after(clone);
			
			//修改name
			var name = clone.find(":file").attr("name");
			var idx = o.reg.exec(name)[1];
			name = name.replace(o.reg, "[" + (idx - 0 + 1) + "]");
			clone.find(":file").attr("name", name);
		});
	}else{
		o.element.find(".img_add").hide();
	}
	
	 o.element.find(".img_del").live("click", function(){
		
		if(o.element.find(".img_del").length <= 1){
			var lastTr =  o.element.find(".img_del:last").closest("tr");
			var clone = lastTr.clone();
			lastTr.after(clone);
			lastTr.remove();
			return;
		}
		
		var $tr = $(this).closest("tr"); 
		var files = $tr.nextAll().find(":file");
		//修改name
		$.each(files, function(i,file){
			var name = $(file).attr("name");
			var idx = o.reg.exec(name)[1];
			name = name.replace(o.reg, "[" + (idx - 1) + "]")
			$(file).attr("name", name);
		})
		
		//删除行 
		$(this).closest("tr").remove();
	});
	 //删除已经在数据库中存在的附件
	 o.element.find(".img_delete").live("click", function(){
		//删除行 
		$(this).closest("tr").remove();
	});
}

/**
 * 查看日志
 * @param flowId
 */
function viewLogs(flowId){
	if (null!= flowId && flowId != "") {
    	var url= basePath + '/modification/logs.jsp?id='+flowId;
     	P.$.dialog({
     		title : 'Process Logs',
     		width : '800px',
     		height : '400px',
     		top : '20%',
     		esc:true,
     		cache:false,
     		max: false, 
     		min: false,
     		parent:this,
     		content:'url:'+url
         });	
    } else {
    	P.$.dialog.alert('no flow.'); 
    } 
}

/**
 * 航线任务默认提交方式
 */
function ajaxSubmitDefault(btn, params){
	var actionUrl = basePath + "/tbm/tbm_flow_processTask.action";
	if(param.actionUrl){
		actionUrl = param.actionUrl;
	}
	ajaxSubmit(btn, actionUrl, params);		
}

/**
 * 提交更新内容
 */
function ajaxSubmit(btn, url, params){
	if($('.dlyCnl').is(':checked')){
		$('#dlyCnl').val("y");
	} else {
		$('#dlyCnl').val("n");
	}
	
	if (!$("#processForm").valid()) {
		//验证是否成功
		return false;
	}
	var taskKey = $("#taskDefinitionKey").val();
	if(taskKey == "taskProcess" || taskKey == "wokerReceive"){		
		var hasTo = $("#hasTo").val();
		if(hasTo != null && hasTo != "" && hasTo == 'false'){
			P.$.dialog.alert('存在未关闭TO，请关闭TO后再排故！');
			return false;
		}
	}
	
	var ccInof = getItems("tlb_pn_t", "tlb_cc_item", "items.");
	// 参数
	$.each(ccInof, function(i, info) {
		$.each(info, function(key, value) {
			key = key.replace("items", "items[" + i + "]");
			params[key] = $.trim(value);
		});
	});
	P.$.dialog.confirm("Sure to submit?", function(){
		// 验证必检人员和工作者不能一致
		var riiSign = $.trim($("#riiSign").val()); // 必检人
		var technicianNo = $.trim($("#technicianNo").val()); // 工作者
		if (riiSign != '' && technicianNo != '') {
			if (riiSign == technicianNo) {
				P.$.dialog.alert('RII Sign. and Taken Action Sign. should not the same person.');
				return false;
			}
		}
		
		params["variables.type"] = param.type ||  $("#businessType").val();
		
		api.button({
			id: btn,
			disabled:true
		});
		
		if(params["variables.result"] == "PASS"){
			params["variables.agree"] = true;
		}
		
		if(params["variables.result"] == "REJECT"){
			params["variables.agree"] = false;
		}
		$("#processForm").ajaxSubmit({
			url : url,
			data : params,
			dataType : "json",
			contentType : 'application/x-www-form-urlencoded;charset=utf-8',
			cache : false,
			beforeSubmit:function(obj, textStatus){
				$.each(obj,function(i,o){
					var name = o.name;
					if(name.indexOf("items")!=-1){
						o.value="";
					}
				});
			},
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				var msg = data.msg || '';
				if(data.ajaxResult == 'success'){
					P.$.dialog.tips('Success! '+msg, 2, "success.gif");
					//关闭当前新增页面
					api.close();
					return;
				} else {
					
					var mrIssueMsg = data.mrIssueException;
					var exceptionKey = data.messagekey;
					
					if(exceptionKey == "MR_ISSUE_ERROR")
				    {
						if(mrIssueMsg){

							api.button({
								id: btn,
								disabled:false
							});
							
							var msgArr = new Array();
							msgArr = mrIssueMsg.split(",");
							var mrNo = msgArr[1];
							var maximoUrl = data.maximoUrl;
							
							P.$.dialog.alert("Submit Fail: " + mrIssueMsg, function(){
								var url = maximoUrl + "/maximo/ui/?event=loadapp&value=materialrq&additionalevent=useqbe&additionaleventvalue=mrnum=" + mrNo + "|status=APPR&login=true&username=me&password=111111&forcereload=true";
								window.open(url, "_blank", "height=900, width=900, location=no");
							});
							
							return;
					    }
				    }
					
					if (msg == 'please input the lisence') 
					{
						$("#needLisence").val(1);
						P.$.dialog.alert(msg, function() {
							PageRender.render({
								viewTrs : {
									"complete" : {
										required : true
									},
									
									"lisence" : {
										show : true,
										required : true,
										disabled : false
									},
									
									"remark" : {
										required : false
									},
									
									"attachment" : {
										required : function(){
											if($("#requireFeedback").val() == 'y'){
												return true;
											}
											return false;
										}
									}
								}
							});
						});
						return;
					}
					
					api.button({
						id: btn, 
						disabled:false
					});
					
					P.$.dialog.alert('Failure! '+msg);
				}
			}
		});
	});	
}
