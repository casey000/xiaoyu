var api = frameElement.api,P = api.opener;
var param = api.data;
var PageRender = {};

$(function(){
	PageRender = {
		buttons : {
			
			"pass" : {
				id : "pass",
				name : "Submit",
				callback : function() {
					ajaxSubmit2(
						"pass", 
						basePath + "/tlb/defect_dd_flow_processTask.action", 
						{
							//"variables.result" : $("#result").val()
						});
					return false;
				}
			},
			
			/*"reject" : {
				id : "reject",
				name : "Reject",
				callback : function() {
					PageRender.render({
						viewTrs : {
							"remark" : {
								required : true
							}
						}
					});
					ajaxSubmit2(
						"reject", 
						basePath + "/tlb/defect_dd_flow_processTask.action", 
						{
							"variables.result" : $("#result").val()
						});
					return false;
				}
			},*/
			
			"assign" : {
				id : "assign",
				name : "Assign",
				callback : function() {
					ajaxSubmit2(
						"assign", 
						basePath + "/tlb/defect_dd_flow_processTask.action",
						{
							
						});
					return false;
				}
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
			'entity' : {
				element : $("#tr_entity"),
				init : function(){
					this.uninit();
					this.element.find("a").click(function(){
						viewEntity($("#mrNo").val());
					});
				},
				
				uninit : function(){
					this.element.find("a").unbind("click");
				}
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
				init : function(){
					this.uninit();
					this.element.find("a").click(function(){
						viewMaintenanceTask($("#maintenanceTaskType").text(), $("#cardId").val());
					});
				},
				
				uninit : function(){
					this.element.find("a").unbind("click");
				},
				
				val : function(){
					return $.trim($("#maintenanceTaskType").text());
				},
				
				options : {
					"EO" : {
						viewTrs : {
							"complete" : {
								show : true
							},
							"cc" : {
								show : true
							},
							"template_eo" : {
								show : true
							}
						}
					},
					
					"JC" : {
						viewTrs : {
							"complete" : {
								show : true
							},
							"cc" : {
								show : true
							},
							"template_jc" : {
								show : true
							}
						}
					},
					
					"NRC" : {
						viewTrs : {
							"complete" : {
								show : true,
								disabled: true,
							},
							"cc" : {
								show : true
							},
							"attachment" : {
								disabled : true
							}
						}
					}
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
			'passReject' : {
				element : $("#tr_pass_reject")
			},
			'licenseNo' : {
				element : $("#tr_license")
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
					var rii = $("#rii").val();
					//判断是否必检, 必检时必填
					if(rii != null && rii == "y"){
						$("#tr_action .rii").attr("checked", true);
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
			
			'whetherRaft' : {
				element : $("#tr_whether_raft")
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
			
			'cc' : {
				element : $("#tr_cc")
			},
			
			'template_jc' : {
				element : $("#tr_template_jc")
			},
			
			'template_eo' : {
				element : $("#tr_template_eo")
			},
			
			'attachment_add' : {
				element : $("#tr_attachment_add")
			},
			'attachment_new' : {
				element : $("#tr_attachment_new")
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
			'cacc_attachment' : {
				element : $("#tr_caac_attachment"),
				
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
		
		nodeConfig : {
			"defect_dd_edit" : {
				viewButtons : ['assign', 'logs', 'cancel'],
				viewTrs : {
					"attachment" : {
						show : true
					},
					"attachment_add" : {
						show : true
					},
					"attachment_new" : {
						show : true
					},
					"cacc_attachment" : {
						show : false
					},
					"passReject" : {
						show : false
					},
					"remark" : {
						show : true
					},
					'user' : {
						show: true,
						required : true
					}
				}
			},
			
			"defect_dd_checking" : {
				viewButtons : ['pass', 'logs', 'cancel'],
				viewTrs : {
					"attachment" : {
						show : true
					},
					"attachment_add" : {
						show : false
					},
					"attachment_new" : {
						show : false
					},
					"cacc_attachment" : {
						show : false
					},
					"licenseNo" : {
						show : true,
						required : true
					},
					"passReject" : {
						show : true
					},
					"remark" : {
						show : true
					},
					'user' : {
						show: false,
						required : false
					}
				}
			},
			
			"defect_dd_approving" : {
				viewButtons : ['pass', 'logs', 'cancel'],
				viewTrs : {
					"attachment" : {
						show : true
					},
					"attachment_add" : {
						show : false
					},
					"attachment_new" : {
						show : false
					},
					"cacc_attachment" : {
						show : false
					},
					"passReject" : {
						show : true
					},
					"remark" : {
						show : true
					},
					'user' : {
						show: false,
						required : false
					}
				}
			},
			
			"defect_extention_dd_edit" : {
				viewButtons : ['assign', 'logs', 'cancel'],
				viewTrs : {
					"attachment" : {
						show : false
					},
					"attachment_add" : {
						show : false
					},
					"attachment_new" : {
						show : false
					},
					"cacc_attachment" : {
						show : false
					},
					"passReject" : {
						show : false
					},
					"remark" : {
						show : true
					},
					'user' : {
						show: true,
						required : true
					}
				}
			},
			"defect_extention_dd_approving" : {
				viewButtons : ['pass', 'logs', 'cancel'],
				viewTrs : {
					"attachment" : {
						show : false
					},
					"attachment_add" : {
						show : false
					},
					"attachment_new" : {
						show : false
					},
					"cacc_attachment" : {
						show : true
					},
					"passReject" : {
						show : true
					},
					"remark" : {
						show : true
					},
					'user' : {
						show: false,
						required : false
					}
				}
			},
			
			
			
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
	
	$(".date").datebox();
	$(".datetime").datetimebox();
	
	var node = param.node || $("#taskDefinitionKey").val();
	PageRender.render({node : node});
});
/**
 * 用户选择
 * @param parameters
 */
function selectUser(parameters){
	
	$.extend(UserUtils,{dialog_parent:P,exclude_self:true});
	UserUtils.showDialog({callback:function(data){
		if(!data) return null;
		$("#assigneeId").val(data['userId']);
		$("#assigneeName").val(data['userName']);
	}});
	/*
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
	});*/
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
}

/**
 * 查看任务详情
 * @param type
 * @param docNo
 */
function viewMaintenanceTask(type, id){
	type = $.trim(type);
	if(type == "MCC"){
		viewCard(id, type);		
	}
}

/**
 * 查看任务详情
 * 
 * @param id
 */
function viewMaintenanceTask(type, id){
	var urls = {
		"MCC" : {
			url : '/work/mcc_assign_task_toView.action?taskMCC.id=' + id,
			title : "View MCC Task",
			width : '900px',
			height : '500px'
		},
		
		"TLB" : {
			url : '/tlb/tlb_techlog_view.action?techLog.tlbNo=' + $("#cardNo").text(),
			title : "View TLB",
			width : '1100px',
			height : '500px'
		},
		
		"DD" : {
			url : '/tlb/tlb_ddi_signup_view.action?tlbDeferredDefect.ddNo=' + $("#cardNo").text(),
			title : "View DD",
			width : '1100px',
			height : '500px'
				
		},
		
		"ReviewTLB" : {
			url : '/tlb/tlb_techlog_view.action?techLog.tlbNo=' + $("#cardNo").text(),
			title : "View TLB",
			width : '1100px',
			height : '500px'
		},
		
		"ReviewDD" : {
			url : '/tlb/tlb_ddi_signup_view.action?tlbDeferredDefect.ddNo=' + $("#cardNo").text(),
			title : "View DD",
			width : '1100px',
			height : '500px'
				
		},
			
		"EO" : {
			url : '/eo/eo_management_view.action?id=' + id,
			title : "View EO Information",
			width : '1100px',
			height : '500px'
		},
		
		"JC" : {
			url : '/jc/jc_management_view.action?id=' + id,
			title : "View JC Information",
			width : '1100px',
			height : '500px'
		},
		
		"OTHER" : {
			url : '/ppc/taskNotice_view.action?taskNotice.id=' + id,
			title : "TaskNotice View",
			width : '900px',
			height : '500px'
		},
		
		"NRC" : {
			url : '/nrc/nrc_view.action?id=' + id,
			title : "NON-RUNTINE View",
			width : '1100px',
			height : '500px'
		},
		
		"TO" : {
			url : '/mccdoc/to_management_editOrView.action?toNumber=' + $("#cardNo").text()  +'&isView=2',
			title : "TO View",
			width : '1100px',
			height : '500px'
		}
	}
	
	var obj = urls[$.trim(type)];
	P.$.dialog({
		id :  'view_maintance_card',
		title :  obj.title,
		width : obj.width,
		height : obj.height,
		top : '80px',
		esc : true,
		cache : false,
		lock:true,
		max : false,
		min : false,
		parent : this,
		content : 'url:' + basePath + obj.url,
		data : {
			"methodType": 'view'
	    }
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

function ajaxSubmit2(btn, url, params) {
	
	if (!$("#processForm").valid()) {
		//验证是否成功
		return false;
	}
	
	//alert(params["variables.result"]);
	P.$.dialog.confirm("Sure to submit?", function(){
		
		//alert(param.type+"---"+$("#businessType").val());
		
		params["variables.type"] = param.type ||  $("#businessType").val();
		
		api.button({
			id: btn,
			disabled:true
		});
		
		var ret = $("#result").val();
		if(ret == "PASS"){
			params["variables.agree"] = true;
		}
		if(ret == "REJECT"){
			params["variables.agree"] = false;
		}
		
		//alert(url);
		$("#processForm").ajaxSubmit({
			url : url,
			data : params,
			dataType : "json",
			contentType : 'application/x-www-form-urlencoded;charset=utf-8',
			cache : false,
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				var msg = data.msg || '';
				
				if(data.ajaxResult == 'success'){
					P.$.dialog.tips('Success! '+msg, 2, "success.gif");
					api.close();
					return;
				} else {
					api.button({
						id: btn, 
						disabled:false
					});
					
					P.$.dialog.alert('Failure!');
				}
			}
		});
	});	
}

function getRadio(evt) {
	var processNode = $("#taskDefinitionKey").val();
	var evt = evt || window.event;
	//alert(evt.srcElement + "--" + evt.target);
	var e = evt.srcElement || evt.target;
	if (e.value == "1") {
		$("#result").val("PASS");
		/*if(processNode != "defect_dd_approving"){
			$("#tr_user").show();
		}*/
	} else if(e.value == "2"){
		$("#result").val("REJECT");
		$("#tr_user").hide();
		$(evt).addClass("required");
	}
}





