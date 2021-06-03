//grid Talbe表格操作按钮权限json
var gridPermissionMap;

var gridPublicOption = {
	ajaxGridOptions: {
        type: 'GET',
        contentType: 'application/json;charset=utf-8',
        dataType: 'json'
    },
    mtype: 'POST', //获取数据使用的方法，使用get或者post，mmorpg为get，本例使用post
    
    //从服务器后台要返回的数据的类型，可以为json、xml等格式，本例中使用json
    datatype: "json", //"local","json","xml"  
    //data: mydata, 本地json数组
    
    cache: false,
    beforeSend: function () {
           $(".loading").show(); 
       },
     //session失效处理
     //viewsortcols:[true,"vertical",true], //定义表头中排序图标的外观和行为
         pginput:true,//显示跳转页面输入框
         pgbuttons:true,//显示翻页按钮 
         pgtext:'Page {0} of {1}',
         recordtext:'View {0} - {1} of {2}',
         emptyrecords: "",
         
         scrollrows: true, // 是否显示行滚动条 
         //scroll:true,//鼠标滚动翻页
         
         rowNum:15,   //每页显示记录数 
         //rowList:[10,15,20],  //分页选项，可以下拉选择每页显示记录数
         rowList : [15,20,30,50,100, 200, 300, 500, 1000],
         rownumbers: true, //显示行号
         
         viewrecords:true, //显示总记录数 
         autowidth: true, //自动匹配宽度 
         gridview:true, //加速显示 
         multiselect: true,  //可多选，出现多选框 
         multiboxonly: true, //点击checkbox时该行才被选中
         multiselectWidth: 20, //设置多选列宽度 
         altRows:true,//隔行变色
         altclass:'oddClass',
         
         toolbar: [true,"top"],
         gridview : true, //构造一行数据后添加到grid中，如果设为true则是将整个表格的数据都构造完成后再添加到grid中
         
         //toppager: true,     
         pgbuttons: true, //是否显示翻页按钮
         pginput: true, //是否显示跳转页面的输入框
         
         //singleselect: true, 设置jqGrid复选框为单选  
         //height:"100%",
         jsonReader: {
        	//当前页
        	 page: function(obj){
            	 //var jsonData = eval("(" + obj+ ")"); 
        		 var jsonData = JSON.parse(obj);
        		 if(jsonData.ajaxResult.indexOf("success") != -1){
	            	 return jsonData.pageModel.page;
     			 }
             },
        	//总页数
        	 total: function(obj){
            	 //var jsonData = eval("(" + obj+ ")"); 
        		 var jsonData = JSON.parse(obj);
        		 if(jsonData.ajaxResult.indexOf("success") != -1){
        			 return jsonData.pageModel.total;
     			 }
             },
        	 //查询出的记录数
			 records: function(obj){
            	 //var jsonData = eval("(" + obj+ ")"); 
            	 var jsonData = JSON.parse(obj);
            	 if(jsonData.ajaxResult.indexOf("success") != -1){
            		 return jsonData.pageModel.records;
     			 }
             },
           //查询出的记录
             root: function(obj){
            	 //var jsonData = eval("(" + obj+ ")");
            	 var jsonData = JSON.parse(obj);
            	 if(jsonData.ajaxResult.indexOf("success") != -1){
            		//返回权限
            		 gridPermissionMap = jsonData.gridPermissionMap;
            		 
            		 return jsonData.pageModel.gridModelData;
            		
     			 }else if(jsonData.ajaxResult == 'exception'){
     				//显示后台异常信息
     				//$("#exceptionError").text(jsonData.exceptionError);
     				 if(jsonData.exceptionType == 'permission'){
     					 var errorMsg = "Error:[" + jsonData.exceptionError + "]";
     					$.dialog.alert(errorMsg);
     				 }else{
     					 $("#exceptionError").html("<li>Error:[" + jsonData.exceptionError + "]</li>");
     				 }
     			 }
             },
             id:"id",
             repeatitems : false     // 设置成false，在后台设置值的时候，可以乱序。且并非每个值都得设  
         }, 
         
         prmNames: {  
             page:"pageModel.page",    // 表示请求当前页码的参数名称(默认)  
             rows:"pageModel.rows",    // 表示请求行数的参数名称(默认)  
             sort: "pageModel.sidx", // 表示用于排序的列名的参数名称  
             order: "pageModel.sord", // 表示采用的排序方式的参数名称(排序方式：asc， desc)  
             search:"pageModel.search", // 表示是否是搜索请求的参数名称  
             id:"id" // 表示当在编辑数据模块中发送数据时，使用的id的名称  
         }, 
         
         shrinkToFit:true, //是否固定每列的宽度
         autoScroll: true //是否可以出现滚动条,
         
        	  
         //添加找不到相关记录提示信息 居中
         /*
         loadComplete: function(){
        	 var re_records = $("#gridTable").getGridParam('records');
        	 if(re_records == 0 || re_records == null){
	        	 if($(".norecords").html() == null){
	        		 $("#gridTable").parent().append("<div class=\"norecords\">找不到相关数据</div>");
	        	 }
	        	$("#gridTable").jqGrid('setGridHeight',50);
        	 	$(".norecords").show();
        	 }else{
        		 $("#gridTable").jqGrid('setGridHeight','auto');
        	 }
         } 
         /*
         gridComplete:function(){  //在此事件中循环为每一行添加修改和删除链接
                var ids=$("#gridTable").jqGrid('getDataIDs');
                for(var i=0; i<ids.length; i++){
                    var id=ids[i];   
                    operate = "<a href='#' style='color:#f60' onclick='edit(" + id + ")'>修改</a>";  //这里的onclick就是调用了上面的javascript函数 edit(id)
                    operate += " |  <a href='#'  style='color:#f60' onclick='del(" + id + ")' >删除</a>";   
                    jQuery("#gridTable").jqGrid('setRowData', ids[i], { operate: operate});
                }
            }
         */
         
         /*colModel的重要选项
            name：为Grid中的每个列设置唯一的名称，这是一个必需选项，其中保留字包括subgrid、cb、rn。
			index：设置排序时所使用的索引名称，这个index名称会作为sidx参数（prmNames中设置的）传递到Server。
			label：当jqGrid的colNames选项数组为空时，为各列指定题头。如果colNames和此项都为空时，则name选项值会成为题头。
			width：设置列的宽度，目前只能接受以px为单位的数值，默认为150。
			sortable：设置该列是否可以排序，默认为true。
			search：设置该列是否可以被列为搜索条件，默认为true。
			resizable：设置列是否可以变更尺寸，默认为true。
			hidden：设置此列初始化时是否为隐藏状态，默认为false。
			formatter：预设类型或用来格式化该列的自定义函数名。常用预设格式有：integer、date、currency、number等
          */
};

//行formatter鼠标移入样式
function actionMouseover(el, ev) {
    $(el).addClass('ui-state-hover');
    /*
    if ($.browser.msie) {
        ev.cancelBubble = true;
    } else {
        ev.stopPropagation();
    }*/
}

//行formatter鼠标移出样式
function actionMouseout(el, ev) {
    $(el).removeClass('ui-state-hover');
    if ($.browser.msie) {
        ev.cancelBubble = true;
    } else {
        ev.stopPropagation();
    }
}

//根据浏览器窗口变化设置表格高度
var bindFlag = false;
var resetGridHeight = function(gridId){ 
	 var gridId_exc = gridId.split("#")[1];
	var	search_zone_height = 60 + $(".ui-jqgrid-titlebar").outerHeight(true),
		list_btn_row_height = $(".list_btn_row").outerHeight(true),
		list_btn_row_s_height = $(".list_btn_row_s").outerHeight(true),
		searchForm_height = $("#searchForm").outerHeight(true),
		qc_box_height = $(".qc_box").outerHeight(true),
		query_box_height = $(".query_box").outerHeight(true),
		curNodeInfoSet_height = $("#curNodeInfoSet").outerHeight(true),//主要是resourse mangement页面
		message_config_form_height = $("#message_config_form").outerHeight(true);//message sender config页面
		qc_advance_box_height = $("#qc_advance_box").is(":hidden")? 0 :$("#qc_advance_box").outerHeight(true),
		qc_template_content_height = $(".qc_template_content").is(":hidden")? 0 :$(".qc_template_content").outerHeight(true),
		ui_th_column_header_height = $(".ui-th-column-header").outerHeight(true);
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
	if(typeof query_box_height != "undefined"){
		search_zone_height += query_box_height;	
	}
	if(typeof curNodeInfoSet_height != "undefined" && !$("#curNodeInfoSet").is(":hidden")){
		
		search_zone_height += curNodeInfoSet_height;	
	}
	if(typeof message_config_form_height != "undefined" ){
		
		search_zone_height += message_config_form_height;	
	}

	if(typeof qc_advance_box_height != "undefined"){
		search_zone_height += qc_advance_box_height;	
	}

	if(typeof qc_template_content_height != "undefined"){
		search_zone_height += qc_template_content_height;	
	}
	if(typeof ui_th_column_header_height != "undefined"){
		search_zone_height += ui_th_column_header_height;	
	}
	var gridHeight = $(gridId).height();
	
	var defHeight = 0;
	var _this_body_height = $(this).height()==0 ? window.top.getIframeHeight() : $(this).height();
	
	if(gridHeight > _this_body_height - search_zone_height){
		defHeight = _this_body_height - search_zone_height;
		$(gridId).jqGrid('setGridHeight',defHeight);
	}else {
		defHeight = gridHeight;
		$(gridId).jqGrid('setGridHeight',"100%");	
	}
	/* if(gridHeight > _this_body_height - search_zone_height){
		$(gridId).jqGrid('setGridHeight',defHeight);
	}else{
		$(gridId).jqGrid('setGridHeight',"100%");
	}*/
	$(gridId).jqGrid('setGridWidth',$("#gbox_" + gridId_exc).parent().width()-2);
};

function setMyGrid(gridId,myGridSet,defHeight, hideNorecords){
	  //添加找不到相关记录提示信息
	gridPublicOption.gridComplete = function(){
		var gridId_exc = gridId.split("#")[1];
		 var re_records = $(gridId).getGridParam('records');
		 $(gridId).jqGrid('setGridWidth',$("#gbox_" + gridId_exc).parent().width()-2);
		 if(re_records == 0 || re_records == null){
			 if($(".norecords").html() == null){
				 $(gridId).parent().append("<div class=\"norecords\">No records to view</div>");
			 }
			 if(!hideNorecords){
				 $(".norecords").show();				 
			 }
			$(gridId).jqGrid('setGridHeight',50);
		 }else{ 
			//如果有数据，则需要隐藏norecords
			 $(".norecords").hide();
			setTimeout(function(){
				resetGridHeight(gridId);
			},0);//延迟兼容ie
			
			if(!bindFlag){//防止多次绑定
				onWindowResize.add(function(){
					resetGridHeight(gridId);
				});
				bindFlag = true;
			}
		 }		
		  
	} ;
	
	gridPublicOption.loadError = function(jqXHR, textStatus, errorThrown){
		if(typeof(handleSessionErr) != "undefined"){
			handleSessionErr(jqXHR, textStatus, errorThrown,function(){
				$("#"+ gridId).trigger("reloadGrid");
			});
		}
	};
	
	var gridPublicOption2use = {};
	if(myGridSet && myGridSet.rowList && myGridSet.rowList.length==0){
		gridPublicOption.rowList = [];
	}
	
	// <!-- jqgrid赋值变量值 -->
	 $.extend(true,gridPublicOption2use,gridPublicOption,myGridSet);
	 $(gridId).jqGrid(gridPublicOption2use);
}

