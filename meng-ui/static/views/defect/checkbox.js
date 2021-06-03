;(function($, window, document, undefined){
    var count = 0;
    /** 
     * 创建勾选框组 
     * @params {Object} 初始化参数
     * params.data {Array} 需要显示的选项配置
     */
    function createBox(params){
        ++count;
        for(let i = 0, len = params.data.length; i < len; i++){
            if(params.pre){
                $(this).prepend("<input type='checkbox' id='" + params.data[len-i-1].name + String(count)+ "'"
                    + (!!params.disabled? "disabled='true'" : " ")
                    // + "name='" + params.data[len-i-1].name + "'"
                    + "value='" + params.data[len-i-1].value + "'/>"
                    + "<label style='margin-right: 10px' for='" + params.data[len-i-1].name + String(count) + "'>" 
                    + params.data[len-i-1].label + "</label>")
            }else{
                $(this).append("<input style='margin-left: 10px' type='checkbox' id='" + params.data[i].name + String(count) + "'"
                    + (!!params.disabled? "disabled='true'" : " ")
                    // + "name='" + params.data[i].name+ "'"
                    + "value='" + params.data[i].value + "'/><label for='" + params.data[i].name + String(count) + "'>" + params.data[i].label + "</label>")
            }
        }
    };

    /** 
     * 根据传入的value选中对应项 
     * @param {String, Array} 需要选种项的value值
     */
    function check(data){
        if(typeof data === "string"){
            $(this).children("input:checkbox[value='"+ data +"']").prop("checked", true)
        }else if(Array.isArray(data)){
            data.forEach(item=>{
                $(this).children("input:checkbox[value='"+ item +"']").prop("checked", true)
            })
        }else{
            return 
        }
    }

    /**
     * 获取选中项的value
     * @return {Array}
     */
    // function getValue(data){
    //     let res = []
    //     $(this).children().each((index, item) => {
    //         let val = $(item).children("input:checkbox:checked").val()
    //         if(val){
    //             res.push(val)
    //         }
    //     })
    //         console.log(res)
    //     return res
    // }
    function getValue(data){
        let res = []
        $(this).children("input:checkbox:checked").each(function() {
            res.push($(this).val())
        })
        return res
    }

    $.fn.extend({
        checkboxList: function(params, data){
            if(typeof params === "string"){
                switch(params){
                    case "check":
                        check.call(this, data);
                        return
                    case "getValue":
                        return getValue.call(this);
                    default: 
                        return
                }
            }else{
                if(Object.prototype.toString.call(params) != "[object Object]"){
                    throw new Error("checkboxList参数格式不对")
                    return
                }else{
                    createBox.call(this, params)
                }
            }         
        }
    })
})($, window, document)