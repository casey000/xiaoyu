//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;

sub_win.button(
    {
        name: 'OK',
        callback: function () {
            var type_ = $("input[name='radiobutton']:checked").val();
            if (type_) {
                issuedTo(type_);
            } else {
                P.$.dialog.alert("请选择下发的类型(航班或航站)!");
            }
            return false;
        }
    }
);

function issuedTo(type) {
    sub_win.data['assignType'] = type;
    sub_win.close();
}


