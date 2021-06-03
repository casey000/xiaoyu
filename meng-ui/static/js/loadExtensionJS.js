;(function($, window, document){
    function loadJS(url,callback){
        let script = document.createElement("script");
        let fn = callback||function(){};
        script.type = "text/javascript";
        script.src = url;
        // IE
        if(script.readyState){
            script.onreadystatechange = function(){
                if(script.readyState == 'loaded' || script.readyState == 'complete'){
                    script.onreadystatechange = null;
                    fn();
                }
            }
        }else{
            // 其他游览器
            script.onload = function(){
                fn();
            }
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    // 扩展jQuery插件方法
    $.extend({
        // 使用JS动态加载某个JS的方法,使用方式,如下
        // $.loadJS("/js/xxx.js");
        // $.loadJS("/js/xxx.js",function(){
        //      alert("加载成功");
        // });
        loadJS:function(url,callback){
            loadJS.call(this,url,callback);
        }
    });
})($, window, document);