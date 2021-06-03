/*
* 加载环境配置信息
*/
function loadEnv(){
    var env = {};
    $.ajaxSetup({async:false});
    $.getJSON("/config/env.json", function (data, status){
        if(!data){
            console.log("无法读取环境配置信息");
        }
        env = data;
    });
    $.ajaxSetup({async:true});
    return env;
}

ENVGlobal = loadEnv();