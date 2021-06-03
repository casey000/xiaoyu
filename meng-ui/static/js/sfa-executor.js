/**
 * 通用异步任务执行框架
 * 1. 任务进度查询
 * 2. 自定义导出数量上限
 * 3. 同时执行任务数量设置
 */
// 弹出框置顶
if(typeof(P) == "undefined"){
	if(frameElement != null && frameElement.api != null){
		P = frameElement.api.opener;
	}else{
		P = window;
	}
}

gridPermissionMap = {};
permissionMap = {};

$.extend($.fn, {
	sfaExecutorDialog : function(options) {
		if (!this.length) {
			return;
		}

		var executorDialog = new $.sfaExecutorDialog(options, this[0]);
		$.data(this[0], 'executorDialog', executorDialog);
		return executorDialog;
	}
});

$.sfaExecutorDialog = function(options) {
	this.settings = $.extend(true, {}, $.sfaExecutorDialog.defaults, options);
	this.init();
};

/**
 * 
 */
$.extend($.sfaExecutorDialog, {
	defaults : {
		url : "",
		urlInst : basePath + "/task/task_instance_view.action",
		group : "Group",
		name : "Name",
		file : "Export",
		maxRow : 10000,
		
		exportDlg : {
			url : basePath + '/sfa_export.jsp',
			id: 'export_dlg',
			title : 'Export',
			width : 300,
			height : 200,
			top : "15%",
			close : function(){
				if(this.data.instanceId != null){
					this.data.executor.showWaiting(this.data.instanceId);
				}
			}
		},
		
		waitingDlg : {
			url : basePath + '/sfa_executor.jsp',
			id: 'executor_dlg',
			title : 'Waiting',
			width : 500,
			height : 300,
			top : "15%"
		}
	},

	prototype : {
		init : function(o) {},
		
		showExport : function(){
			var _executor = this;
			var settings = this.settings.exportDlg;
			if(this.dialog == null || this.dialog.closed){
				this.dialog = P.$.dialog({
					id : settings.id,
					title : settings.title,
					width : settings.width,
					height : settings.height,
					top : settings.top,
					content : "url:" + settings.url,
					button : settings.button,
					init : settings.init,
					close :settings.close,
					data : {
						"executor" : _executor
					}
				});
			}
		},
		
		showWaiting : function(instId) {
			var _executor = this;
			var settings = this.settings.waitingDlg;
			if(this.dialog == null || this.dialog.closed){
				this.dialog = P.$.dialog({
					id : settings.id,
					title : settings.title,
					width : settings.width,
					height : settings.height,
					top : settings.top,
					content : "url:" + settings.url,
					button : settings.button,
					init : settings.init,
					close :settings.close,
					data : {
						"instanceId" : instId,
						"executor" : _executor,
						"settings" : settings
					}
				});
			}
		}
	}
});
