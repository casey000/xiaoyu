/*
 * 基础数据查询：
 *  数据字典 :queryDataDict({domainCode:'code_key,code_key2',functionCode:'',
 *              succFn:function({'code_key':[],'code_key2':[]}){}
 *              })
 */
function queryDataDict(ops) {
    if(!ops || !ops.domainCode){
        console.warn("未指定字典的KEY。");
        return ;
    }
    console.log("字典的KEY:"+ops.domainCode);
    var _url = "/api/v1/plugins/ANALYSIS_DOMAIN_BYCODE";
    var params_ = {
        "domainCode": ops.domainCode,
        "FunctionCode": ops.functionCode || 'ANALYSIS_DOMAIN_BYCODE'
    };
    $.ajax({
        url: _url,
        data: params_,
        type: "POST",
        dataType: "json",
        cache: false,
        async: false,
        success: function (data) {
            if(data && data.data){
                //  值传递给回调函数
                ops.succFn && ops.succFn(data.data);
            }
        }
    });
}








