//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var isView = $("#isView").val();
var to_pdfPermission = $("#to_pdfPermission").val();

if (isView == "" || isView == null) {
    if (to_pdfPermission == "true") {
        sub_win.button(
            {
                name: 'View PDF',
                callback: function () {
                    viewPdf();
                    return false;
                }
            },
            {
                name: 'Cancel',
                callback: function () {
                    return true;
                }
            }
        );
    } else {
        sub_win.button(
            {
                name: 'Cancel',
                callback: function () {
                    return true;
                }
            }
        );
    }
} else {
    sub_win.button(
        {
            name: 'Cancel',
            callback: function () {
                return true;
            }
        }
    );
}


function viewPdf() {
    let id = $("#toBaseInfoId").val(), tail = $("#toBaseInfoTail").val();
    window.location.href = basePath + '/api/v1/mccdoc/to_managementPdf/createTO?id=' + id + '&tail=' + tail;
}

