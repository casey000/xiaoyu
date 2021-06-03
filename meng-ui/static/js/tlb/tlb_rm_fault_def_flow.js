P = frameElement.api.opener;
var sub_win = frameElement.api;
var s_params = sub_win.data;
$(function(){
	var PageRender = {
		node : $("#taskDefinitionKey").val(),
		buttons : {
			'complete' : {
				id : 'complete',
				name : 'Complete',
				callback : function(){
					approve('tlb/tlb_rm_fault_def_flow_processTask.action', null, true);
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
			
			'cancel': {
				name : 'Cancel'
			}
		},
		
		trs : {
			'entity' : {
				element : $("#tr_entity"),
				init : function(){
					this.uninit();
					this.element.find("a").click(function(){
						viewEntity($("#defId").val());
					});
				},
				
				uninit : function(){
					this.element.find("a").unbind("click");
				}
			},

			'remark' : {
				element : $("#tr_remark")
			},
			
			'lastRemark' : {
				element : $("#tr_last_remark")
			},

			'result' : {
				element : $("#tr_result"),
				defaultVal : true,
				options : {
					'true' : {
						'user' : {
							show : false,
							required : false
						},
						
						'remark' : {
							show: true,
							required : false
						},
					},
					
					'false' : {
						'user' : {
							show : false
						},
						
						'remark' : {
							show: true,
							required : true
						},
					}
				},
				
				init : function(){
					var options = this.options;
					this.uninit();
					this.element.find("input").click(function(){
						//清空错误消息
						$(".errorMessage").empty();
						//重新渲染
						PageRender.render({viewTrs : options[$(this).val()]});
					});
				},
				
				uninit : function(){
					this.element.find("input").unbind("click");
				}
			},
			
			'user' : {
				element : $("#tr_user"),
				init : function(){
					var options = this.options;
					this.uninit();
					this.element.find("input").click(function(){
						//绑定选择用户事件
						selectUser({});
					});
				},
				
				uninit : function(){
					this.element.find("input").unbind("click");
				}
			},
			
			'detail' : {
				element : $("#tr_detail")
			}
		},
			
		defaults : {
			viewButtons : ['logs','complete','cancel'],
			viewTrs : {
				'entity' : {
					show: true
				},

				'remark' : {
					show: true
				},
				
				'lastRemark' : {
					show: true
				}
			}
		},
		
		nodeConfig : {
			'tlb_rm_fault_def_edit' : {
				viewTrs: {
					'user' : {
						show : true,
						required : true
					}
				}
			},
			
			'tlb_rm_fault_def_approving' : {
				viewTrs: {
					hideTrs : ['user'],
					
					'result' : {
						show : true
					},
					
					'detail' : {
						show : true
					}
				}
			}
		},
		
		//渲染页面
		render : function(o){
			this.settings = {};
			if(o == null){
				$.extend(true, this.settings, this.defaults,  this.nodeConfig[this.node]);
			}else if(typeof(o) != 'object'){
				$.extend(true, this.settings, this.defaults,  this.nodeConfig[o]);
			}else{
				$.extend(true, this.settings, this.defaults, this.nodeConfig[this.node], o);
			}
			
			//渲染按钮组
			this.renderButtons();
			
			//渲染表格
			this.renderTrs();
			
			//处理内嵌表格样式
			this.processInnerTableBorder();
		},
		
		//渲染按钮组
		renderButtons : function(){
			sub_win.DOM.buttons.empty();
			sub_win._listeners = {};
			$.each(this.settings.viewButtons, function(i, v){
				if(typeof(v) == 'object'){
					sub_win.button(v);
				}else{
					sub_win.button(PageRender.buttons[v]);						
				}
			});
		},
		
		//渲染表格
		renderTrs : function(){
			var trs = {};
			var hideTrs = this.settings.hideTrs;
			$.extend(true, trs, PageRender.trs, this.settings.viewTrs);

			$.each(trs, function(key, obj){
				var show = obj.show;
				if(obj.showFun != null){
					show = show && obj.showFun();
				}
				//显示或者隐藏
				if(show && $.inArray(key,hideTrs) == -1){
					PageRender.showTr(obj);
				}else{
					PageRender.hideenTr(obj);
				}
			})
		},
		
		/**
		 * 渲染行
		 */
		showTr : function(tr){
			var eles = tr.element.find("input,select,textarea");
			eles.not(".datebox-f,.combo-text,.combo-value,.datetimebox-f").show();
			eles.attr("disabled", false);
			
			//必填样式
			if(tr.required){
				eles.addClass("required");
				tr.element.find(".required_tip").show();
			}else{
				eles.removeClass("required");
				tr.element.find(".required_tip").hide();
			}
			
			//禁用
			if(tr.disabled){
				tr.element.find(".ipt_display").remove();
				$.each(eles, function(i, ele){
					var $ele = $(ele);
					if(!$ele.is(":hidden") && !$ele.is("[type='hidden']")/*IE8*/){
						$ele.after("<span class='ipt_display'>" + $ele.val() + "</span>");
						$ele.hide();
					}
				});
				eles.attr("disabled", true);
			}else{
				tr.element.find(".ipt_display").remove();
				eles.attr("disabled", false);
			}
			
			//初始化
			if(tr.init){
				tr.init();
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
			$.each($("td > table"), function(i,v){
				$(v).find("tr:first > td").css("border-top", 0);
				$(v).find("tr:last > td").css("border-bottom", 0);
				$(v).parent().css("padding", 0);
				$(v).parent().css("margin", 0);
				$(v).css("width", "100%");
			});
			
			$.each($("td > table tr"), function(i,v){
				$(v).find("td:first").css("border-left", 0);
				$(v).find("td:last").css("border-right", 0);
			});
		}
	};
	
	//渲染页面
	PageRender.render();
})

/**
 * 审批
 * @param url
 * @param postData
 * @param needValiate
 * @param callback
 * @returns {Boolean}
 */
function approve(url, postData, needValiate, callback){
	if(needValiate == null || needValiate){
		var validator = $("#approval_form").valid();
		if (!validator) {
			return false;
		}
	}
	
	P.$.dialog.confirm("Are you sure to do?", function(){
		sub_win.button({
			id : 'complete',
			disabled : true
		});
		
		$('#approval_form').ajaxSubmit({
			url : url,
			type:'post',
			dataType : 'json',
			data: postData,
			cache : false,
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				var msg = data.msg || '';
				
				if(data && data.ajaxResult && data.ajaxResult.indexOf('success')!=-1){
					sub_win.data['ajaxResult'] = "success";
					if(callback){
						//callback(data.mrNo);
					}else{
						P.$.dialog.alert('Success! '+msg);
						sub_win.close();
					}
				}else{
					sub_win.button({
						id : 'complete',
						disabled : true
					});
					P.$.dialog.alert('Failure! '+msg);
				}
			}
		});
	});
}

/**
 * 用户选择
 * @param parameters
 */
function selectUser(parameters){
	var obj = P.$.dialog({
		title : 'Select Approvor',
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
				$('[id^=user_name]').val(this.data.result.name);
				$('[id^=assigneeId]').val(this.data.result.id);
			}
		},
		content:'url:' + basePath + '/security/user/select_user_list.jsp',
		data : parameters
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
 * 查看详情
 * @param mrNo
 */
function viewEntity(defId){
	var url= basePath + '/tlb/rm_fault_def_view.action?def.id='+defId;
 	P.$.dialog({
 		title : 'View Tlb RM Fault Def',
 		width : '500px',
 		height : '400px',
 		top : '30%',
 		esc:true,
 		cache:false,
 		max: false, 
 		min: false,
 		parent:this,
 		content:'url:'+url
     });
}