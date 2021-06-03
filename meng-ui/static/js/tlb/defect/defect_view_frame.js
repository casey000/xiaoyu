var api = frameElement.api, win = api.opener;
var s_params = api.data;

var methodType = s_params["methodType"];
var openBy = s_params['openBy'];
var readOnly = s_params['readOnly']||'';

var defectId = $('#defectId').val();//获取当前EO的ID

var restarData = {},
	approvingStatus = {2:'Checking',3:'Approving'},
	statusTitle = {0:"Waitting",1:'Editing',2:'Checking',3:'Approving',4:'Approved',5:'Active',
			6:'Superseded',7:'Canceling',8:'Canceled',9:'Recovering'};
var curEle = '';
var dataObj, eoBaseInfo;
var _self = this;
//点击链接跳转

$(function(){
	var _defectId = $('#defectId').val();
	$("#base_info").click();
	
	/**
	 * 新建TO
	 */
	$("#addTO_btn").click(function(){
		var parameters = {
				"methodType" : "view",
				"rowId" : 1
		};
		var defectId = $("#defectId").val();
		var actionUrl = basePath+"/mccdoc/to_management_toAdd.action?defectId="+defectId+"&type=1";
		dialog_param = {
			id: 'addToDialog1',
			title : 'Add TO',
			width : '1000px',
			height : '600px',
			top : '35%',
			esc:true,
			cache:false,
			max: false, 
	        min: false,
			parent:null,
			lock:true,
			content:'url:'+actionUrl,
			data : parameters,
			close : function() {
				//刷新当前窗口
				_self.location.reload();
			}
		};
		if(win){
			win.$.dialog(dialog_param);
		}else{
			$.dialog(dialog_param);
		}
	});
	
});

/**左边列表点击动作*/
function viewObj(obj){
	
	var _title = $.trim($(obj).text());
	
	if(_title && _title=='Special Tools & SW from TS'){
		
		_title = 'Special Tools & Softwares prepared by TS';
	}
	
	$(api.DOM.title).text("View Defect Information - "+_title);
	
	curEle = obj;
	//移除当前选中的样式
	$(".eeview_left a").removeClass("selected");
	$(obj).addClass("selected");
	
	var _modify_link = $(obj).attr("modify_link");
	//单机大类页签则不处理
	if(!_modify_link){
		return;	
	}
	var actionUrl = basePath+"/tlb/defect_info_loadPage.action?id="+defectId+"&"+_modify_link+"&temp="+Math.random();		
	$(".content_view").load(actionUrl, function(){});  
	
}

//关闭故障
function close_defect(){
	var _defectId = $('#defectId').val();
	var actionUrl = "tlb/defect_info_close.action";
	var params ={"id":_defectId};
	win.$.dialog.confirm("确认关闭故障?",function(){
		$.ajax({
			url : actionUrl,
			type:"post",
			data : params,
			dataType : "json",
			cache : false,
			
			success : function(obj, textStatus) {
				var data = JSON.parse(obj);
				if(data.ajaxResult.indexOf("success") != -1){
					win.$.dialog.alert("故障关闭成功!");
					_self.location.reload();
				} else if (data.ajaxResult.indexOf("already") != -1) {
					win.$.dialog.alert("此任务涉及双重维修限制，请确认是否已按要求执行!");
					_self.location.reload();
				} else {
					win.$.dialog.alert(data.errMsg);
				}
			}
		});
	});
}
//重开故障
function reOpend_defect(){
	var _defectId = $('#defectId').val();
	var actionUrl = "tlb/defect_info_reOpen.action";
	var params ={"id":_defectId};
	$.ajax({
		url : actionUrl,
		type:"post",
		data : params,
		dataType : "json",
		cache : false,
		
		success : function(obj, textStatus) {
			var data = JSON.parse(obj);
			if(data.ajaxResult.indexOf("success") != -1){
				win.$.dialog.alert("故障重开成功!");
				api.close();
			}else {
				win.$.dialog.alert(data.errMsg);
			}
		}
	});
}



function addCC_view() {
	var params = {
		"methodType" : "addExe"
	};
	var obj = '{"ccType":1,"docType":6,"docNo":"' + $("#defectNo").val()
	+ '","reason":"' + $("#faultReportChn").val() + '","offAcType":"1","offAcId":'
	+ $("#acId").val() +' }';
	
	obj = obj.replace("\r\n","\\r\\n");
	P.$.dialog({
		id : "addPage",
		title : "Add Component Change",
		width : "1024px",
		height : "550px",
		lock:true,
		top : "15%",
		esc : true,
		content : "url:" + basePath + "/component/cc_addExe.action?ccStr="
				+ encodeURIComponent(obj),
		data : params,
		close : function() {
			getCCList();
		}
	});
	return false;
}


function addMR_view() {
	var obj = P.$.dialog({
		title : 'Add MR',
		width : '1200px',
		height : '550px',
		lock:true,
		top : '15%',
		cache:false,
		parent:this,
		content:'url:' + basePath + '/mr/mr_addMr.action?defectNo='+$("#defectNo").val() + '&defectId='+$("#defectId").val() + '&cardType=DEFECT' + '&acReg='+$("#acReg").val()+ '&acId='+$("#acId").val() +'&station='+ $("#station").val()+"S" ,
		data : {},
		close:function(){
        	_self.location.reload();
        }
	});
}
/**
 * 编辑或查看Action
 * @param obj
 */
function editOrViewAction(obj) {
	var actionId = $(obj).attr('id');
	var editFlag = $(obj).attr("editFlag");
	var parameters = {
		"actionId" : actionId,
		"editFlag": editFlag
	};
	var title = "Edit Defect Measures";
	if('view'==editFlag){
		title = "View Defect Measures";
	}
	var dialog_param = {
		id:"editUploadMeasures",
		title : title,
		width : "1024px",
		height : "550px",
		lock:true,
		top : "15%",
		content :  "url:" + basePath + "/tlb/defect_base_editUploadMeasures.action?id=" + defectId+"&actionId="+actionId+"&editFlag="+editFlag,
		data : {
			businessKey : defectId,
			type : "tbm_non_routine",
			node : "wokerReceive",
			actionUrl : basePath + "/tlb/defect_base_updateUploadMeasures.action"
		},
		close : function(){
		}
	};
	if(win){
		win.$.dialog(dialog_param);
	}else{
		$.dialog(dialog_param);
	}
}
/**
 * 查看TLB
 * @param obj
 */
function viewTlb(obj) {
	var tlbId = $(obj).attr('id');
	var tlbNo = $(obj).attr('tlbNo');
	var parameters = {
			"techLog.tlbId" : tlbId,
			"techLog.tlbNo" : tlbNo
	};
	var actionUrl = basePath + '/tlb/tlb_techlog_view.action?techLog.tlbNo='+tlbNo+'&techLog.tlbId='+tlbId;
	var dialog_param = {
		title : 'Tlb View',
		width : '1070px',
		height : '550px',
		top : '80px',
		content : 'url:' + actionUrl,
		data : parameters
	};
	if(win){
		win.$.dialog(dialog_param);
	}else{
		$.dialog(dialog_param);
	}
}

//编辑TO
function editTo(obj) {
    var id = $(obj).attr("id");
    var type = $(obj).attr("type");
    var url_ = basePath+"/mccdoc/to_management_editOrView.action?id="+id+"&type="+type+"&isEdit=1";
    var parameters = {
        "type_" : type,
        "rowId" : 1
    };
    var dialog_param = {
            title : 'Edit TO',
            width : '1000px',
            height : '600px',
            top : dialog_top,
            esc:true,
            cache:false,
            max: false, 
            min: false,
            parent:this,
            content:'url:'+url_,
            data : parameters,
            close:function(){
            	_self.location.reload();
            }
        }
    if(win){
		win.$.dialog(dialog_param);
	}else{
		$.dialog(dialog_param);
	}
}

//提示删除
function confirmDel(obj){
    if (!obj.id) {
        $.dialog.alert("Please select Date!");
        return false;
    }
    var params = {
        "id" : obj.id
    };
    
    if(confirm('你确定要删除当前TO吗 ?')){
    	var dialog_param = {
                id : "toDelRemark",
                title : "删除TO",
                width : 300,
                lock:true,
                esc:true,
                height : 240,
                top : "15%",
                cache : false,
                parent : this,
                data:params,
                content : "url:" + basePath + "/mccdoc/to_del_remark.jsp",
                close:function(){
                	_self.location.reload();
                }
            }
        if(win){
    		win.$.dialog(dialog_param);
    	}else{
    		$.dialog(dialog_param);
    	}
    }
}

/**
 * 查看TO
 * @param obj
 */
function viewTO(obj) {
	var id = $(obj).attr("id");
	var type = $(obj).attr("type");
	var url_ = basePath+"/mccdoc/to_management_editOrView.action?id="+id+"&type="+type;
	var dialog_param = {
		title : 'View TO',
		width : '1050px',
		height : '650px',
		top : dialog_top,
		esc:true,
		cache:false,
		max: false,
		lock:true,
	    min: false,
		parent:this,
		content:'url:'+url_
	};
	if(win){
		win.$.dialog(dialog_param);
	}else{
		$.dialog(dialog_param);
	}
}

/**
 * 查看CC
 * @param obj
 */
function viewCC(obj) {
	var ccId = $(obj).attr('id');
	var params = {
		"methodType":"view"
	};
	var actionUrl = basePath + '/component/cc_view.action?componentCC.id=' + ccId;
	var dialog_param = {
		title:'View Component Change',
		width:dialog_width,
		height:dialog_height,
		top:dialog_top,
		esc:true,
		cache:false,
		max: false, 
		min: false,
		parent:this,
		content : 'url:' + actionUrl,
		data : params
	};
	if(win){
		win.$.dialog(dialog_param);
	}else{
		$.dialog(dialog_param);
	}
}

/**
 * 查看MR
 * @param mrNo
 */
function _viewMr(mrNo){
    var url= basePath + '/mr/mr_view.action?mrNo='+mrNo;
    var dialog_param = {
        title : 'View Material Requires',
        width : '1400px',
        height : '500px',
        top : '20%',
        esc:true,
        cache:false,
        max: false, 
        min: false,
        parent:this,
        content:'url:'+url,
        close:function(){
        	//_self.location.reload();
        }
    }
    if(win){
		win.$.dialog(dialog_param);
	}else{
		$.dialog(dialog_param);
	}
}

var dialog_width = '1100px';
var dialog_height = '570px';
var dialog_top = '15%';