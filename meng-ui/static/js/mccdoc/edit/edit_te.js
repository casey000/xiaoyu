//初始化按钮
var api = frameElement.api, win = api.opener;
var s_params = api.data;
var methodType = s_params["methodType"];

api.button(
    {
        name: 'Submit',
        callback: function () {
            alert('Submit Success !');
            return true;
        }
    },
    {
        name: 'Save',
        callback: function () {
            alert('Save Success !');
            return true;
        }
    },
    {
        name: 'Cancel'
    }
);

//显示下拉列表数据
$(function () {

    //绑定事件
    $("#modelInput").live("click", function () {
        // 初始化Model的数据(getRadioSetting/getSetting)
        $.fn.zTree.init($("#model"), getSettingForModel("model", "modelInput"), modelTreeData);
        showMenu("modelInput", "modelContent");
    });


    $("#ataInput").live("click", function () {
        // 初始化ATA的数据(getRadioSetting/getSetting)
        $.fn.zTree.init($("#ata"), getSettingForAta("ata", "ataInput"), ataTreeData);
        showMenu("ataInput", "ataContent");
    });
});

//选择飞机
function checkAricraft() {

    win.$.dialog({
        title: 'Select aircraft',
        width: '710px',
        height: '500px',
        top: '15%',
        esc: true,
        cache: false,
        max: false,
        min: false,
        lock: true,
        parent: this,
        content: 'url:mccdoc/images/check_aircraft_radio.jpg'
    });
}
