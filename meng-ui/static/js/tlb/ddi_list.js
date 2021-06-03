$(function(){
	 //ajax请求url
	 var actionUrl = basePath + "/tlb/tlb_ddi_query_list.action";
	//gridtable的title
	 var jqgridTitle = "符合性状态查询列表";
	//分页大小
	 var pageSize = 15;
	
	 var myGridSet = {  
			 //从后台获取要显示数据的地址
	         url: actionUrl, 
	         
	         //数据列名称（数组）
	         colNames:['SourceId','A/C','DDI No.','TLB No.','Reference','Category','Relateitemno','IssueDate','Mechanic','Station'],
	         height:"100%",   //设置高度 
	         //height:$(document).height() -150 ,
	         maxWidth:1200,
	         width:400,
	         colModel:[  	
                 {name:'sourceId',index:'sourceId',"width":150,align:'center',hidden:true},
                 {name:'acReg',index:'acReg',"width":350,align:'center'},
                 {name:'ddNo',index:'ddNo',"width":180,align:'center'},  
	             {name:'tlbNo',index:'tlbNo',"width":190,align:'center'}, 
	             {name:'reference',index:'reference',"width":300,align:'center'},           
	             {name:'category',index:'category',"width":180,align:'center'},
	             {name:'referItem',index:'referItem',align:'center',sortable:false}, 
	             {name:'repairDate',index:'repairDate',editable:true,"width":150,align:'center',sortable:false}, 
	             {name:'',index:'',"width":200,align:'center',sortable:false},
	             {name:'complianceDocVO.remark',"width":200,align:'center',sortable:false},
	             {name:'sourceStatus',index:'sourceStatus',"width":150,align:"center"},
	             //{name:'status',index:'status',"width":100,align:"center",formatter:'select',editoptions:{value:"0:禁用;1:启用;2:未知"},sortable:false},
	             
	             {name:'operate',align:"center","width":200,sortable:false}
	         ],  
	         
	         
	         pager:"#gridPager",  //表格数据关联的分页条，html元素 
	         
	         sortable:true,  //可以排序 
	         sortname:'sourceId',  //默认排序字段初,应按照每个列表改变
	         sortorder:'desc', //排序方式,asc代表正序，desc代表逆序
	         caption: jqgridTitle
	        
	         
	  }; 
	
	 //设置grid
	 setMyGrid("#gridTable",myGridSet);
	 /*初始化表格宽度*/
	$("#gridTable").jqGrid('setGridWidth',Math.floor(parent.getWidth()-210));
     
 });  