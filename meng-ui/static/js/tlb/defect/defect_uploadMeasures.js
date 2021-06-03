var api = frameElement.api,P = api.opener;
var param = api.data;
var PageRender = {};


$(function(){
	if(param.finallyFlightNo != null && param.finallyFlightNo != "" && param.finallyFlightNo != undefined){
		if(param.finallyFlightId != null && param.finallyFlightId != "" && param.finallyFlightId != undefined){
			$("#flightId").val(param.finallyFlightId);
		}
		$("#flightNo").text(param.finallyFlightNo);
		$("#flightNos").val(param.finallyFlightNo);
	}
	PageRender = {
		buttons : {
			"complete" : {
				id : "complete",
				name : "Complete",
				callback : function() {
					PageRender.render({
						viewTrs : {
							"complete" : {
								required : true
							},
							
							"lisence" : {
								show : function(){
									return $("#needLisence").val() == 1;
								},
								
								required : function(){
									return $("#needLisence").val() == 1;
								},
								
								disabled : function(){
									return $("#needLisence").val() == 0;
								}
							},
							
							"remark" : {
								required : function(){
									return $("#maintenanceTaskType").text() == "TO" && $("#toType").val() != '1';
								}
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
					ajaxSubmitDefault("complete", {
						"variables.result" : "PASS"
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
			},
			"closeTO" : {
				id : "closeTO",
				name : "Close TO",
				callback : function() {
					toToComplete();
					return false;
				}
			},
			"reject" : {
				id : "reject",
				name : "Reject",
				callback : function() {
					PageRender.render({
						viewTrs : {
							"complete" : {
								required : false
							},
							
							"remark" : {
								required : true
							},
							
							"action" : {
								required : false
							},
							
							'ddCorrectiveCn' : {
								required : false
							},
							
							'ddCorrectiveEn' : {
								required : false
							},
							'ddTlbCorrectiveCn' : {
								required : false
							},
							
							'ddTlbCorrectiveEn' : {
								required : false
							}
						}
					});
					ajaxSubmitDefault("reject", {
						"variables.result" : "REJECT"
					});
					return false;
				}
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
					$("#tr_action .rii").removeClass("required");
					$("#tr_action .rci").removeClass("required");
					$("#riiSign").removeClass("required");
					var rii = $("#rii").val();
					var rci = $("#rci").val();
					//判断是否必检, 必检时必填
					if(rii != null && rii == "y"){
						$("#tr_action .rii").attr("checked", true);
						$("#riiSign").addClass("required");
					}else if(rci != null && rci == "y"){
						$("#tr_action .rci").attr("checked", true);
						$("#riiSign").addClass("required");
					}else {
						$("#riiImg").hide();
						$("#riiSign").val("");
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
				element : $("#tr_complete"),
				init : function(){
					var options = this.options;
					//取消多选框的必填
					$("#tr_complete .multiselect").removeClass("required");
				}
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
			'ddTlbCorrectiveCn' : {
				element : $("#tr_dd_tlb_corrective_cn")
			},
			'ddTlbCorrectiveEn' : {
				element : $("#tr_dd_tlb_corrective_en")
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
			'ewisAttachment' : {
				element : $(".tr_ewis_upload_attachment222"),
				
				init : function(){
					this.uninit();
					initAttachmentContent(this);
				},
				
				uninit : function(){
					this.element.find(".img_add").unbind("click");
					this.element.find(".img_del").die("click");
				}
			},
			'oilAttachment' : {
				element : $("#tr_oil_attachment222"),
				
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
					"ewisAttachment" : {
						show : true
					},
					"oilAttachment" : {
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
					'ddTlbCorrectiveCn' : {
						show : true,
						required : true
					},
					
					'ddTlbCorrectiveEn' : {
						show : true,
						required : true
					},
					
					'maintenanceTask' : {
						options : {
							"DEFECT" : {
								viewButtons : function(){
									if($("#hasTo").val() == 'false'){
										return ['logs', 'closeTO', 'complete', 'reject', 'cancel' ];
									}
									return ['logs', 'complete', 'cancel' ]
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
	
	$(".date").datebox();
	$(".datetime").datetimebox();
	
	var node = param.node || $("#taskDefinitionKey").val();
	PageRender.render({node : node});
	
});

$(function(){
	//初始化下拉多选框
	$(".multiselect").multiselect({
		noneSelectedText: "--please select--",
		checkAllText: "Check All",
		uncheckAllText: 'Uncheck All',
		selectedList:1000
	});
	$("button.ui-multiselect").width(130);
	
	$(".rii").click(function(){
		if($(this).attr("checked")){
			$("#riiImg").show();
			$("#rii").val("y");
			$("#tlb_rci").prop('checked',false);
			$("#rci").val("n");
		}else{
			$("#riiImg").hide();
			$("#rii").val("n");
		}
		$("#riiSign").val("");
	});
	$(".rci").click(function(){
		if($(this).attr("checked")){
			$("#riiImg").show();
			$("#rci").val("y");
			$("#tlb_rii").prop('checked',false);
			$("#rii").val("n");
		}else{
			$("#riiImg").hide();
			$("#rci").val("n");
		}
		$("#riiSign").val("");
	});
});
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
 * 打开TO关闭界面
 */
function toToComplete(){
	P.$.dialog({
		id:"completeToDlg",
		title : "Complete TO",
		width : 915,
		height : 500,
		top : "15%",
		esc : true,
		parent : this,
		data : {
			'fromFlag' : $("#itemId").val()
		},
		content : "url:" + basePath + "/mccdoc/to_management_findFeedBack.action?toNumber=" + $("#toNumber").val() + "&sta=" + $("#station").text(),
		close : function() {
			location.reload();
		}
	});
}

/**
 * 提交更新内容
 */
function ajaxSubmit(btn, url, params){
	
// Ewis校验
	var ewisFlag = checkEwisInput();
	if(!ewisFlag)
	{
		return;
	}
	
// 漏油校验
	var oilFlag = checkOilInput();
	if(!oilFlag)
	{
		return;
	}
	
	var lenFlag = true;
	$(".numberLeng").each(function(){
		var inputLeng = $(this).val().length;
		if(inputLeng > 1000){
			$(this).next().attr("style","color:red").text("当前输入字符长度超过1000.");
			lenFlag = false;
			return;
		}else{
			$(this).next().text("");
		}
	});
	if(!lenFlag){
		return;
	}
	if($(".rii").is(':checked')){
		$("#rii").attr("value","y");
	}else{
		$("#rii").attr("value","n");
	}
	if($(".rci").is(':checked')){
		$("#rci").attr("value","y");
	}else{
		$("#rci").attr("value","n");
	}
	if($('.dlyCnl').is(':checked')){
		$('#dlyCnl').val("y");
	} else {
		$('#dlyCnl').val("n");
	}
	$("#reviewType").attr("style","display: none;");
	if (!$("#processForm").valid()) {
		//验证是否成功
		return false;
	}
	//ata 校验 add by lyb 2018.6.3
	var ata = $("#ataInput").val();
	var ataReg =/^([0-9]|[-]){4,8}$/;
	if(!ataReg.test(ata)){
		$("#ataInput").closest("td").find(".errorMessage").empty().append("ATA 只能是四到六位数字！");
		return false;
	}else{
		$("#ataInput").closest("td").find(".errorMessage").empty();
	}
	
	P.$.dialog.confirm("Sure to submit?", function(){
		//add by wubo 80003187 2018-05-21 对故障进行complete操作时是否为dm标识进行提示 start
		var dm = $("[name='variables.dm']");
		if(btn == 'complete' && dm.val() == 'true'){
			alert('此任务涉及双重维修限制，请确认是否已按要求执行.');
		}
		//add by wubo 80003187 2018-05-21 对故障进行complete操作时是否为dm标识进行提示 end
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
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				var msg = data.msg || '';
				
				if(data.ajaxResult == 'success'){
					P.$.dialog.tips('Success! '+msg, 2, "success.gif");
					var defectId = $("#cardId").val();
					var actionId = data.actionId;
					//上传排故措施成功后,跳转到编辑页面
					if(actionId){
						P.$.dialog({
							id:"editUploadMeasures",
							title : "Edit Defect Measures",
							width : "1024px",
							height : "550px",
							lock:true,
							top : "15%",
							content :  "url:" + basePath + "/tlb/defect_base_editUploadMeasures.action?id=" + defectId+"&actionId="+actionId,
							data : {
								businessKey : defectId,
								type : "tbm_non_routine",
								node : "wokerReceive",
								actionUrl : basePath + "/tlb/defect_base_updateUploadMeasures.action"
							},
							close : function(){
								//location.reload();
							}
						});
					}
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

//标识是否需要填写TLB NO
function tlbNoFlag(obj){
	//选中就不用填写TLB NO了
	if($(obj).attr("checked")){
		$("#noTlbNo").val("1");
		$("input[name='variables.tlbNo']").remove();
	}else{
		$("#noTlbNo").val("");
		var tlbInput = '<input type="text" class="number required" min="0" style="width: 90px" name="variables.tlbNo">';
		$("#tlbNoError").prepend(tlbInput);
	}
}
