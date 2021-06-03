/**
 * 初始化加载
 */
(function () {
    dynamicStatisticsSrc();
})();

/**
 * 动态请求外部数据统计
 */
function dynamicStatisticsSrc() {
    var hostname = window.location.hostname;
    console.log("本机地址为：" + hostname);
    var src = "";
    /*
    if (hostname === "tdms.sf-express.com") {
        //生产环境（百度统计）
        src = "https://hm.baidu.com/hm.js?2e4fcfe86e79236ba8fe3ddcf3be46a5";
    } else if (hostname === "www.tdms_uat.com") {
        //UAT环境（百度统计）
        src = "https://hm.baidu.com/hm.js?0f9ec49e2ce65494bfb3302e3f9c1846";
    } else if (hostname === "www.tdms_test.com") {
        //测试环境（百度统计）
        src = "https://hm.baidu.com/hm.js?1ef0e3ef72b419bd40c104c0295bc912";
    } else if (hostname === "www.tdms_dev.com") {
        //测试环境（百度统计）
        src = "https://hm.baidu.com/hm.js?d9cc208cb4dcc81dd6d47d9da543374d";
    } else if (hostname === "www.tdms_location.com") {
        //本地环境（百度统计）
        src = "https://hm.baidu.com/hm.js?99cf21f61afea07d7f8b93c8fa92be25";
    } else {
        console.log("无对应数据统计地址");
        return;
    }
    file:///E:/80004026/meng-amro/resources/static/conifg/statistics.json
     */
    //处理异步问题,保证能数据赋值
    $.ajaxSetup({async:false});

    //读取JSON配置
    $.getJSON("/config/statistics.json", function (data, status){
        if(!data){
            console.log("无法读取配置信息");
        }
        if(data.hostname && hostname === data.hostname){
            console.log("成功读取配置信息");
            src = data.url;
        }
    });

    if(src){
        console.log("数据统计地址为：" + src);
        var script = document.createElement('script');
        script.src = src;
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(script, s);
    }else{
        console.log("无对应数据统计地址");
    }

    //处理异步问题,还原数据同步
    $.ajaxSetup({async:true});
}