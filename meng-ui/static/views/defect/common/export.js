/**
 * 导出方法,首先请求数据,生成fileUrl,完成下载xls文件
 * 这个应该是需要把data读到内存,再从内存中下载
 * 对于文件过大的情况未测试,不乐观
 * @param {
 *     url: {String} 提供的数据请求地址,
 *     filename: {String} 储存的文件名
 * }
 */
;(function($, window, document, undefined){
    $.extend({
        exportExcel: function(params){
            ajaxLoading();
            var data = $(document).sfaQuery().postData();
            console.log(data);
            let opt = {
                responseType: "blob"
            };
            /*
            headers: {
                    'Content-Type': 'application/json'
                },
             */
            axios.post(params.url,data, opt).then(response=>{
                ajaxLoadEnd();
                let blob = new Blob([response.data], {type: "application/vnd.ms-excel"});
                let objectUrl = URL.createObjectURL(blob);
                if(!params.filename){
                    window.location.href = objectUrl;
                }else if(params.filename && typeof params.filename === "string"){
                    const link = document.createElement('a');
                    const body = document.querySelector('body');

                    link.href = objectUrl;
                    link.download = params.filename;

                    // fix Firefox
                    link.style.display = 'none';
                    body.appendChild(link);
                    
                    link.click();
                    body.removeChild(link);

                    window.URL.revokeObjectURL(link.href);
                }
            })
        }
    })
})($, window, document)