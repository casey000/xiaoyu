var api = frameElement.api,P = api.opener;
var param = api.data;
var PageRender = {};


$(function(){
		// 渲染页面
	PageRender = {
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
	};
	
	$(".date").datebox();
	$(".datetime").datetimebox();
});
/**found_date**/
//日期格式化
Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
