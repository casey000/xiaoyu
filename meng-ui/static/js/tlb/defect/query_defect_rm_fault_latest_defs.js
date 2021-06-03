/**
 * 最新有效的重复性、多发性定义规则对象:
 * 重复性规则通过rmFaultLatestRules.['REPEAT']获取
 * 多发性规则通过rmFaultLatestRules.[model]获取
 */
var rmFaultLatestRules = {};

$(function(){
	$.ajax({
		url: basePath + "/api/v1/defect/def/getAllLatestDefs",
		type: 'get',
		cache: false,
		dataType: "json",
		success : function(data) {
			if (data.code == 200) {
				var rules = data.data.rmFaultRules;
				buildRMRules(rules);
			}else{
				if (data.msg) {
					alert(data.msg);
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