$("#select_zone").click(function()
{
	var parameters ={};
	var actionUrl = basePath+'/eo/eo_zone_list2.jsp';

	P.$.dialog
	({
		title : 'Select Zone',
		width:'900px',
		height:'500px',
		top : '20%',
		esc:true,
		cache:false,
		max: false, 
		min: false,
		parent:this,
        close:function()
        {	
        	if(this.data.zone)
        	{
        		$("#zoneId").val(this.data.zone);
        		$("#zone_id").val(this.data.id);
        	}
		},
		content:'url:'+actionUrl,
		data : parameters
	});
});