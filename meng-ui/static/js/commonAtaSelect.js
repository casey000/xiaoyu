/**
 * 功能，搜索ATA，model必输，
 * 获取ATA  $("#ata").textbox('getValue');
 * 设置ATA  $("#ata").textbox('setValue', data.ata);
 * html <input class="easyui-textbox" id="ata" >
 * 直接引入该文件，执行函数 ataSelectInit()
 * 参数：modelTips 是可以配置的提示语
 *
 * */

//ATA数据查询
var ataData=[] ;
function ataDataSearch(){
    //这里必须使用两种取值方式，getValue取值是选择组件里包含的真实值，getText是组件里的显示的值
    //正常输入两个值相等，当使用上下键选择的时候就会出现不同的结果
    var model = $("#model").html() || "";
    var ata = $("#ata").textbox("getValue");
    var ataText = $('#ata').combobox('getText');
    //只针对nrc编辑的时候，判断是否发动机类型,是就加上发动机参数，不是就直接传空值
    var engine = "";
    var ac = "";
    if ($("#faji").is(":checked")) {
        engine = $("#ac_type_input").textbox("getValue");
        ac =  $("#ac").html() || "";
    }else if ($("#feiji").is(":checked")){
        model = $("#ac_type_input").textbox("getValue").slice(0, 4)|| "";
    };
    //根据按上下键选择选项的时候，输入框一定超过4个字符的特性，防止在选择的时候进行搜索
    if(ata.length > 1 && ataText.length<5) {
        $.ajax({
            url: "/api/v1/ata/selectBmManualAtaByFleetAndAta?fleet=" + model + "&ata=" + ata + "&engine="+engine,
            dataType: "json",
            contentType: 'application/json;charset=utf-8',
            type: 'POST',
            // data: postData,
            async: true,
            cache: false,
            success: function (obj, textStatus) {
                var getData = obj.data;
                ataData = [];
                for (var i = 0; i < getData.length; i++) {
                    var labelValue = {};
                    if(!!getData[i].companyCode && getData[i].companyCode == '1'){
                        //根据后端返回的标识确定输入章节号+手册名称+发动机型号+标题
                        if(!!getData[i].engine){
                            labelValue.label = getData[i].chapter + " " + getData[i].manualType + " "+getData[i].engine + " " + getData[i].title;
                        }else {
                            labelValue.label = getData[i].chapter + " " + getData[i].manualType +  " " + getData[i].title;
                        };
                    }else {
                        labelValue.label = getData[i].chapter + " " + getData[i].title;
                    };
                    //加上空格号是为了在输入一个正确四位ATA的时候，不要把数组第一个给带进来
                    labelValue.value = getData[i].chapter+" ";
                    ataData.push(labelValue);
                };
                $('#ata').combobox('loadData', ataData);
            },
            error: function () {
                ajaxLoadEnd();
                $('#saveBtn').text("保存");
            }
        });
    }
}

//ATA组件初始化
function ataSelectInit(modelTips){
    //selectFlage 用来解决当清空后直接按回车键导致重新赋值的问题
    var selectFlage = 0;
    var modelTips = modelTips||"建议先选择‘Flight NO.’";
    $("#ata").combobox({
        editable: true,
        data:ataData,
        panelHeight: 160,
        valueField: 'value',
        textField: 'label',
        width:300,
        hasDownArrow:true,
        multiple:false,
        //在选择的时候做操作
        onSelect: (data) => {
            selectFlage = 1;
        },
        onLoadSuccess : () => {
        },
        onChange:()=>{
            selectFlage = 0;
            var inputAta = $("#ata").combobox('getText');
            var ac = $("#model").html()||"";
            if(!ac && inputAta.length == 1 && modelTips != "hideTips"){
                MsgAlert({type: "tip", content: modelTips});
            };
            ataDataSearch();
            // if(inputAta.length > 4){
            //     selectFlage = 1;
            // };
        }
    });
    //eventAta 用来解决使用上下键+回车键选择后，失去焦点时数据被清空需要重新进行赋值的问题
    var eventAta = "";
    $("#ata").next("span").children("input:first").blur(function () {
        //如果使用回车键选中
        setTimeout(function(){
            var ataNow = $("#ata").textbox("getValue")||eventAta;
            if(ataNow.length>3 && !!selectFlage){
                $("#ata").textbox("setValue", ataNow.slice(0,4));
            }else if(ataNow.length<4 || !selectFlage){
                $("#ata").textbox("setValue", "");
            }
        },300);})
    //解决当用户输入一个正确的四位章节号后，点击回车键出现输入框带入描述的问题
    $("#ata").next("span").children("input:first").keydown(function () {
        if(event.keyCode == "13") {
            var ataNow = $("#ata").combobox('getText');
            if(ataNow.length>3){
                $("#ata").textbox("setValue", ataNow.slice(0,4));
                eventAta = ataNow.slice(0,4);
                selectFlage = 1;
            }
        }
    })
}
