/**
 * 最新有效的重复性、多发性定义规则对象:
 * 重复性规则通过rmFaultLatestRules.['REPEAT']获取
 * 多发性规则通过rmFaultLatestRules.[model]获取
 */
var rmFaultLatestRules = {};

$(function(){
	var QUERY_RM_RULE_P = frameElement.api.opener;
	$.ajax({
		url : basePath+"/tlb/rm_fault_def_getAllLatestDefs.action",
		type : 'post',
		cache: false,
		dataType: "json",
		success : function(data) {
			data = JSON.parse(data);
			if(data.ajaxResult == 'success'){
				var rules = data.rmFaultRules;
				buildRMRules(rules);
			}else{
				if (data.message != null && data.message != "") {
					QUERY_RM_RULE_P.$.dialog.alert(data.message);
				}
			}
		}
	});
});

function buildRMRules(rules){
	$.each(rules, function(idx, rule){
		if(rule.type == 'MULTIPLE'){
			//多发性存机型KEY
			rmFaultLatestRules[rule.model] = {
				"numbers" : rule.numbers,
				"days" : rule.days
			}
		}else if(rule.type == 'REPEAT'){
			//重复性存类型KEY
			rmFaultLatestRules[rule.type] = {
				"numbers" : rule.numbers,
				"days" : rule.days
			}
		}
	});
}