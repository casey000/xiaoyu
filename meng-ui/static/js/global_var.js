//获取当前网址，如： http://localhost:8080/ems/Pages/Basic/Person.jsp
var curWwwPath = window.document.location.href;
//获取主机地址之后的目录，如： /ems/Pages/Basic/Person.jsp
var pathName = window.document.location.pathname;   
//获取带"/"的项目名，如：/ems
var basePath = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
//获取当前网址，如： http://localhost:8080/ems
var currentPath = window.document.location.origin+basePath;

if(basePath.indexOf("sfa-me-web") == -1){
	basePath = "";
}

/*取消页面backspce回退*/ 
document.onkeydown=function (e) { 
	var doPrevent;
	var e=window.event||e; 
	if (e.keyCode == 8) { 
		var d = e.srcElement || e.target;
		if ((d.tagName.toUpperCase() == 'INPUT'&& d.getAttribute("type")!=null && (d.getAttribute("type").toLowerCase()=="checkbox"||d.getAttribute("type").toLowerCase()=="radio"))){
			doPrevent= true;
		}
		if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') { 
			doPrevent = d.readOnly || d.disabled; 
		} else {
			doPrevent = true;
		}
	} else {
		doPrevent = false; 
	}
	
	if (doPrevent) 
	{
		
		if(e.preventDefault){
			e.preventDefault();
		}else{
			window.event.returnValue = false;
		}		
	} 
}; 

/* easyUI日期控件需要的函数 */
function dateFormater(date) {
	var y = date.getFullYear();
	var m = parseInt(date.getMonth()) + 1;
	var d = date.getDate();
	m = (m < 10) ? ('0' + m) : m;
	d = (d < 10) ? ('0' + d) : d;
	return y + "-" + m + "-" + d;
}

function dateParser(date) {
	if (date) {
		return new Date(Date.parse(date.replace(/-/g, "/")));
	} else {
		return new Date();
	}
}

//行formatter鼠标移入样式
function actionMouseover(el, ev) {
    $(el).addClass('ui-state-hover');
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
/****************************修复ie下resize多次执行问题*****************************/
var onWindowResize = function(){
    //事件队列
    var queue = [],
 
    indexOf = Array.prototype.indexOf || function(){
        var i = 0, length = this.length;
        for( ; i < length; i++ ){
            if(this[i] === arguments[0]){
                return i;
            }
        }
 
        return -1;
    };
 
    var isResizing = {}, //标记可视区域尺寸状态， 用于消除 lte ie8 / chrome 中 window.onresize 事件多次执行的 bug
    lazy = true, //懒执行标记
 
    listener = function(e){ //事件监听器
        var h = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || document.body.clientHeight,
            w = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || document.body.clientWidth;
 
        if( h === isResizing.h && w === isResizing.w){
            return;
 
        }else{
            e = e || window.event;
         
            var i = 0, len = queue.length;
            for( ; i < len; i++){
                queue[i].call(this, e);
            }
 
            isResizing.h = h,
            isResizing.w = w;
        }
    };
 
    return {
        add: function(fn){
            if(typeof fn === 'function'){
                if(lazy){ //懒执行
                    if(window.addEventListener){
                        window.addEventListener('resize', listener, false);
                    }else{
                        window.attachEvent('onresize', listener);
                    }
 
                    lazy = false;
                }
 
                queue.push(fn);
            }else{  }
 
            return this;
        },
        remove: function(fn){
            if(typeof fn === 'undefined'){
                queue = [];
            }else if(typeof fn === 'function'){
                var i = indexOf.call(queue, fn);
 
                if(i > -1){
                    queue.splice(i, 1);
                }
            }
 
            return this;
        }
    };
}.call(this);
/***************************修复ie下resize多次执行问题********************************/
/*******************页面Session失效问题**********************/
document.onready=function(){
    // 设置jQuery Ajax全局的参数
	if(typeof($) != "undefined"){
		$.ajaxSetup({
			error: handleSessionErr
		});
	}
}

function handleSessionErr(jqXHR, textStatus, errorThrown, callback){
	if(typeof(P) == "undefined" || P == null){
		if(frameElement != null && frameElement.api != null){
			P = frameElement.api.opener;
			parentDialogParams = frameElement.api.data;
		}else{
			P = window;
		}
	}

	if(jqXHR.responseText!=null && jqXHR.responseText.indexOf('<meta name="loginPage"/>') != -1){
		//alert("未知错误");
		showLoginPage(callback);		
	}else if(jqXHR.responseText!=null && jqXHR.responseText.indexOf('<meta name="errorPage"/>') != -1){
		
		P.$.dialog.alert("对不起，程序出错了！");
	}else if(jqXHR.responseText!=null && jqXHR.responseText.indexOf('<meta name="nopermissionPage"/>') != -1){
		
		P.$.dialog.alert("Permission : you no permission!");
	}else if(jqXHR.responseText!=null && jqXHR.responseText.indexOf('<script>') == 0){
		var script = jqXHR.responseText.replace("<script>", '').replace("</script>", '');
		script = script.replace("top.$", "P.$");
		eval(script);
	}else{
		if(P.$.dialog != null){
			P.$.dialog.alert(textStatus + " : " + errorThrown.message);
		}else{
			alert(textStatus + " : " + errorThrown.message + " content:" + jqXHR.responseText);
		}
	}
}

function showLoginPage(callback){
	top.$.dialog({
		id : "loginDlg",
		zIndex: 99999,
		title : "Login",
		width : 373,
		height : 310,
		top : "15%",
		lock : true,
		content :  "url:" + basePath + "/login_win.jsp",
		data : {
			'callback' : callback
		}
	});	
}

