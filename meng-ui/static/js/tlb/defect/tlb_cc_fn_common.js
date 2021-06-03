
function getTrHtmlBytype(obj,type,_tab){
	if(obj == null || obj == undefined || !_tab || !type){
		return '';
	}
	var _td ;
	switch(type){
	case '1':
	case '3':
		_td = $(_tab).find('[name$=".offSn"][value="'+$.trim(obj.sn)+'"]');
		if(_td){
			_td = _td.closest('tr').find('[name$=".offPn"][value="'+$.trim(obj.pn)+'"]');
		}
//		_td = $(_tab).find('[subattr="'+subattr+'"]');
		break;
	case '4':
		break;
	}
	if(_td && _td.length>0)
		return $(_td[0]).closest('tr');
	return null;
}

function buildHtmlbyType(obj,type,i){
	if(obj == null || obj == undefined ){
		return '';
	}
	if(null==i || i== undefined || !type)return '';
	var html="";
	var subattr = obj.name+'_'+obj.pn+'_'+obj.sn;
	switch(type){
	case '1':
		html ='<tr><td class="td_content" subattr="'+subattr+'">'
			+'<input type="text" name="tlbCompCCSubSet['+i+'].name" value="'+ (obj.name == null ? "" : obj.name) 
			+'" required maxlength="100"/><div class="font_red"></div></td>'
			+'<td class="td_content">'
			+'<input type="text" name="tlbCompCCSubSet['+i+'].offPn" value="'+ obj.pn 
			+'" required maxlength="30" onchange="pnOnchangeFun(this)"/>'
			+'<img class="btn_img" title="Search" src="../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
			+'<div class="font_red"></div></td>'
			+'<td class="td_content">'
			+'<input type="text" name="tlbCompCCSubSet['+i+'].offSn" onchange="snOnchangeFun(this)" value="'+ obj.sn +'" required maxlength="30"/> <img class="btn_img" name="subSnSelect'+i+'" title="Search" src="../images/icon_install.gif"/>'
			+'<input type="hidden" id="offPnId'+i+'" name="tlbCompCCSubSet['+i+'].refOffPnId"/><div class="font_red"></div></td>'
			+'<td class="td_content">'
			+'<input type="text" name="tlbCompCCSubSet['+i+'].offPosition" value="'+ (obj.position == null ? "" : obj.position) 
			+'" required maxlength="30"/><div class="font_red"></div></td>'
			+'<td class="td_content">'
			+'<input type="radio" name="tlbCompCCSubSet['+i+'].flag" id="yn1'+i+'" value="y" required/><label for="yn1'+i+'" class="cp"> YES</label> '
			+'<div class="font_red"></div>'
			+'</td></tr>';
		break;
	case '3':
		html = '<tr><td class="td_content" subattr="'+subattr+'">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].name" value="'+ (obj.name == null ? "" : obj.name) +'" required maxlength="100"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15"  name="tlbCompCCSubSet['+i+'].offPn" value="'+ obj.pn +'" required maxlength="30" onchange="pnOnchangeFun(this)"/>'
				+'<img class="btn_img" title="Search" src="../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
				+'<div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="11"  name="tlbCompCCSubSet['+i+'].offSn" value="'+ obj.sn +'" required maxlength="30" onchange="snOnchangeFun(this)"/> '
				+'<img class="btn_img" name="subSnSelect'+i+'" title="Search" src="../images/icon_install.gif"/>'
				+'<input type="hidden" id="offPnId'+i+'" name="tlbCompCCSubSet['+i+'].refOffPnId"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15"  name="tlbCompCCSubSet['+i+'].offPosition" value="'+(obj.position == null ? "" : obj.position)+'" required maxlength="30"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="radio" onclick="validateSubInfo(this,'+i+')" name="tlbCompCCSubSet['+i+'].flag" id="yn1'+i+'" value="y" required/><label for="yn1'+i+'" class="cp"> YES</label>'
				+'<input type="radio" onclick="validateSubInfo(this,'+i+')" name="tlbCompCCSubSet['+i+'].flag" id="yn2'+i+'" value="n" required/><label for="yn2'+i+'" class="cp"> NO</label>'
				+'<div class="font_red"></div>'
				+'</td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].onPn" maxlength="30" onchange="pnOnchangeFun(this)"/>'
				+'<img class="btn_img" title="Search" src="../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
				+'<div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="11" name="tlbCompCCSubSet['+i+'].onSn" maxlength="30" onchange="snOnchangeFun(this)"/>'
				+'<input type="hidden" name="tlbCompCCSubSet['+i+'].refOnPnId"/>'
				+'<img class="btn_img" name="subSnReplace'+i+'" title="Search" src="../images/icon_modify.gif"/>'
				+'<span></span><input type="hidden" name="tlbCompCCSubSet['+i+'].selectOption"/><div class="font_red"></div></td>'
				+'</tr>';
		break;
	case '4':
			html='<tr>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].name" value="'+ (obj.name == null ? "" : obj.name) +'" required maxlength="100"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].offPn" value="'+ obj.offPn +'" required maxlength="30" onchange="pnOnchangeFun(this)"/>'
				+'<img class="btn_img" title="Search" src="../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
				+'<div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].offSn" value="'+ obj.offSn +'" required maxlength="30" onchange="snOnchangeFun(this)"/>'
				+' <img class="btn_img" name="subSnSelect'+i+'" title="Search" src="../images/install.gif"/>'
				+'<input type="hidden" id="offPnId'+i+'" name="tlbCompCCSubSet['+i+'].refOffPnId"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].offPosition" value="' + (obj.offPosition == null ? "" : obj.offPosition) + '" required maxlength="30"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="radio" onclick="validateSubInfo(this,'+i+')" name="tlbCompCCSubSet['+i+'].flag" id="yn1'+i+'" value="y" required/><label for="yn1'+i+'" class="cp"> YES</label>'
				+'<input type="radio" onclick="validateSubInfo(this,'+i+')" name="tlbCompCCSubSet['+i+'].flag" id="yn2'+i+'" value="n" required/><label for="yn2'+i+'" class="cp"> NO</label>'
				+'<div class="font_red"></div>'
				+'</td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].onPn" value="' + obj.onPn + '" maxlength="30" onchange="pnOnchangeFun(this)"/>'
				+'<img class="btn_img" title="Search" src="../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
				+'<div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].onSn" value="' + obj.onSn + '" maxlength="30" onchange="snOnchangeFun(this)"/>'
				+'<img class="btn_img" name="subSnSwap'+i+'" title="Search" src="../images/icon_install.gif"/>'
				+'<input type="hidden" name="tlbCompCCSubSet['+i+'].refOnPnId"/><div class="font_red"></div></td>'
				+'<td class="td_content">'
				+'<input type="text" size="15" name="tlbCompCCSubSet['+i+'].onPosition" value="'+(obj.onPosition == null ? "" : obj.onPosition)+'" maxlength="30"/><div class="font_red"></div></td>'
				+'</tr>';
		break;
	}
	return html;
}

$(".select_on_cin_class").live('change',function(){
	if($(this).val() != ""){
		$(this).nextAll(".font_red").text("");
	}
	var type = $("input:radio[name='tlbCompCC.ccType']:checked").attr("value");
	if(type == 2){
		setOnName(this);
		querySubCin(this,type);
	}
});

function setOnName(_this){
	var name = $(_this).find(":selected").attr("cname") || '';
	$("input[name='tlbCompCC.onName']").val(name);
}

function querySubCin(selCin,_type){
	var model = $(selCin).find(":selected").attr("model");
	var onAcId = $.trim($("#onAcId").val());
	var onCin = $(selCin).val();
	var onAc = $.trim($("#onAc").val());
	var onPn = $.trim($("#onPn").val());
	_type = _type || 2;
	if(!onCin){
		initSubCinList(null,$('#tab_2'));
	}
	if(!onAc || !onCin)return false;
	var params = {	
					"model":model,
					"componentCC.onAcId" : onAcId,
					"componentCC.onAc" : onAc,
					"componentCC.onCin" : onCin,
					"componentCC.onPn" : onPn,
					"componentCC.ccType" : _type,
					"componentCC.onAcType" : $("#onAcType").val()
			};
	var actionUrl = basePath +"/component/cc_querySubCinList.action";
	$.ajax({
		url : actionUrl,
		type : "post",
		cache : false,
		dataType : "json",
		data : params,
		success : function(data) {
			if(null != data){
				var info = JSON.parse(data);
        		initSubCinList(info.subConfigs,$('#tab_2'));
			}
		},
		error : function() {
			P.$.dialog.alert('Error!');
		}
	});
}

function initSubCinList(list,_tab){
	var html = '';
	if(null!=list){
		var _index=0;
		for(var i = 0; i < list.length; i++){
			if(list[i] && list[i].qtyNha>1){
				for(var j = 0; j < list[i].qtyNha; j++){
					html+=createHtml(list[i],_index++,_tab);
				}
			}else{
				html+=createHtml(list[i],_index++,_tab);
			}
		}
	}
	_tab.show();
	_tab.find("tr:gt(1)").remove();
	$(_tab).append(html);
}


function createHtml(obj,_i,_tab){
	var _pn = '',_sn='',_pos = '',_html='';
	var _tr = getTrHtmlBycin(obj.cin,_tab);
	if(_tr && _tr.length > 0){
		var _index = _tr.find('[name$=".onCin"]').attr('name');
		_index = _index.replace('].onCin','');
		_index = _index.substr(-1);
		var r = new RegExp(_index+']','g');
		_html='<tr>'+_tr.html().replace(r,(_i)+']')+'</tr>';
		_tr.remove();
	}else{
		_html=createNewHtml(obj,_i);
	}
	return _html;
}


function createNewHtml(obj,_i){
	
	var _pn = '',_sn='',_pos = '';
	var _required = '',_span='';
	if(obj.htime){
		_required='required';
		_span = '<span class="font_red">*</span>';
	}
	var html='<tr>'
		+'<td class="td_content"><input type="text"  readonly="readonly"  name="tlbCompCCSubSet['+_i+'].onCin" value="'+ (obj.cin == null ? "" : obj.cin) +'" /><div class="font_red"></div></td>'
		+'<td class="td_content"><input type="text"  readonly="readonly"  name="tlbCompCCSubSet['+_i+'].name" value="'+ (obj.cname == null ? "" : obj.cname) +'" maxlength="100"/><div class="font_red"></div></td>'
		+'<td class="td_content">'
		+'<input type="text" name="tlbCompCCSubSet['+_i+'].onPn" value="" '+_required+' maxlength="30"/>'
		+'<img class="btn_img" title="Search" src="../css/images/searchbox_button.png" onclick="searchPnItem(this);" >'
		+_span
		+'<div class="font_red"></div></td>'
		+'<td class="td_content">'
		+'<input type="text" name="tlbCompCCSubSet['+_i+'].onSn" value="" '+_required+' maxlength="30"/>'+_span
		//+'<div></div>'
		+'<input type="hidden" name="tlbCompCCSubSet['+_i+'].refOnPnId"/>'
		+'<img class="btn_img" name="subSnReplace'+_i+'" style="display: none" title="Search" src="../images/icon_modify.gif"/>'
		+'<span></span><input type="hidden" name="tlbCompCCSubSet['+_i+'].selectOption"/><div class="font_red"></div>'
		+'</td>'
		
		+'<td class="td_content">'
		+'<input type="text" name="tlbCompCCSubSet['+_i+'].onPosition" value="" maxlength="30"/>'
		+'</td>'
		+'</tr>';
	return html;
}

function getTrHtmlBycin(cin,_tab){
	
	var _td = $(_tab).find('[value="'+cin+'"][name$=".onCin"]');
	if(_td && _td.length>0)
		return $(_td[0]).closest('tr');
	return null;
}

function setCinSelect(list,cinObject){
	$(cinObject).append("<option value=''>== Empty ==</option>");
	if(!list)return;
	 if(list.length > 0){
		 cinObject.empty();
		if(list.length > 1){
			$(cinObject).append("<option value=''>== Please Select ==</option>");
		}
	}
	 
	var opt = "<option value=':val' cname=':name' model=':model'>:text</option>";
	for(var i = 0; i < list.length; i++){
		var _text = list[i].cin;
		if(list[i].sameCin)_text+='('+list[i].model+')';
		var option = $(opt.replace(':val',list[i].cin).replace(':name',list[i].cname)
						.replace(':model',list[i].model).replace(':text',_text));
		$(cinObject).append(option);
	}
	
}

function setAcModelSelect(list,cinObject){
	if(!cinObject)return;
	cinObject.empty();
	 if(list && list.length > 0){
		 var opt = "<option value=':model' >:text</option>";
		 for(var i = 0; i < list.length; i++){
			 $(cinObject).append($(opt.replace(':model',list[i].model).replace(':text',list[i].model)));
		 }
	}
	
}

/**
 * 隐藏RT字段
 */
function triggerRT(ccType){
	//装上,对串隐藏RT
	if(2==ccType||4==ccType){
		$("td[name='tdRT']").hide();
	}else{
		$("td[name='tdRT']").show();
	}
}
/**
 * 隐藏航材状态
 */
function triggerAirMaterialState(ccType){
	//装上,对串隐藏航材状态
	if(2==ccType||4==ccType){
		$("td[name='airMaterialState']").hide();
		$('[name="tlbCompCC.airMaterialState"]').attr("required",false);
	}else{
		$("td[name='airMaterialState']").show();
		$('[name="tlbCompCC.airMaterialState"]').attr("required",true);
	}
}
/***
 * 选择工作包 
 */
$("#searchWONO_btn").click(function(){
	var defParams = {
			"operate" :'mcontrloperate',
			'pageModel.qname' : {
				0 : 'TYPE',1 : "STATUS"
			},
			'pageModel.qoperator' : {
				0 : "include",1 : "equals"
			},
			'pageModel.qvalue' : {
				0 : "C",1 : "APPROVED"
			}
	};
	var qcData = [
		{"name":"WO_NO","oper":"equals","value":""},
		{"name":"FLIGHT_NO","oper":"equals","value":""}
	];
	var params = {  
			"params" : defParams,
			"qcdata" : qcData
	}; 
	var url   = basePath+"/ppc/ppcworkOrderRedionlist.jsp";
	var title = "select Wo";
	var dialog = {
		title:title,  
		data : params,
		width:1300,
		height:650, 
		esc:true,
		async:false,
		cache:false,
		max: false,
		min: false,
		parent:this,
		content: 'url:'+url,
		close:function(){
			var	woid = this.data['woid'];
			var	type = this.data['type'];
			var tail = this.data['tail'];
			if (woid){	
				$("#referId").val(woid);
				$("#referNo").val(tail+type);
				$("#referType").val("WO");
			}
		}		
	};
	if(P){
		P.$.dialog(dialog);
	}else{
		$.dialog(dialog);
	}
	
});

/**
 * 删除工作包
 */
$("#cancel_btn").click(function(){
	$("#referId").val("");
	$("#referNo").val("");
	$("#referType").val("");
});
