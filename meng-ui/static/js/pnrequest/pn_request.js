/*
 * Copyright 2019 SF Airlines Co., Ltd. All rights reserved.
 * 本文件仅限于顺丰航空有限公司内部传阅，禁止外泄以及用于其他的商业目的。
 */
var sub_win = frameElement.api, P = sub_win.opener;

var sn = "";//工号
var name = "";//姓名
var email = "";//邮箱地址
var maximoUrl = "";//路径
var maximoUsername = "";//用户名
var maximoPassword = "";//密码

//件号申请
function partRequest() {
    common_add_edit_({
         isEdit: 0, width: 800, height: 400,
        url: "/views/mm/pnApply/mm_pn_apply_add_edit.shtml"
    });
}


//获取Maximo系统件号申请地址
function getMaximoUrl() {
    //获取请求地址
    var _url = "/api/v1/plugins/ANALYSIS_DOMAIN_BYCODE";
    var params_ = {
        "domainCode": "PART_NUMBER",
        "FunctionCode": "ANALYSIS_DOMAIN_BYCODE"
    };
    $.ajax({
        url: _url,
        data: params_,
        type: "POST",
        dataType: "json",
        cache: false,
        async: false,
        success: function (data) {
            console.log(data);
            // var data = JSON.parse(obj);
            if (data.code == '200') {
                if (data.data.PART_NUMBER) {
                    maximoUrl = data.data.PART_NUMBER[0].TEXT;
                    maximoUsername =  data.data.PART_NUMBER[1].TEXT;
                    maximoPassword = data.data.PART_NUMBER[2].TEXT;
                }

            }

        }
    });
}

//检查邮箱是否存在
function checkMail() {
    var isExist = false;
    layerStandardAjaxCall_({
        url: "/api/v1/system/data/menu",
        async: false,
        success: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                sn = jdata.data.loginUser.accountNumber;
                name = jdata.data.loginUser.userName;
                var datas = {sn: sn};
                datas = $.extend({}, datas, {FunctionCode: 'SYS_USER_EMAIL'});
                InitFuncCodeRequest_({
                     async: false,
                     data: datas,
                    successCallBack: function (repon) {
                        if (jdata.code == "200") {
                            if(repon.data){
                                email = repon.data.EMAIL ;
                            }else{

                            }
                        }
                    }
                });
                if (email) {
                    isExist = true;
                }
            }
        }
    });
    return isExist;


}

/**
 * 用window.open打开窗口,并用post方式提交数据
 */
function openPostWindow(maximoUrl) {
    //因为是POST请求所以中文解码,直接发送
    name = decodeURI(name);
    var windowName = "newWindow";
    var form = "<form id='editForm' name='editForm' method='post' action='" + maximoUrl + "?" + "' target='" + windowName + "' >";
    form += "<fieldset>";
    form += "<input type='hidden' id='event' name='event' value='loadapp' />";
    form += "<input type='hidden' id='value' name='value' value='partnosr' />";
    form += "<input type='hidden' id='additionalevent' name='additionalevent' value='insert' />";
    form += "<input type='hidden' id='additionaleventvalue' name='additionaleventvalue' value='MEEMAIL=" + email + "|MEID=" + sn + "|MENAME=" + name + "' />";
    form += "<input type='hidden' id='login' name='login' value='true' />";
    form += "<input type='hidden' id='username' name='username' value='" + maximoUsername + "' />";
    form += "<input type='hidden' id='password' name='password' value='" + maximoPassword + "' />";
    form += "</fieldset>";
    form += "</form>";
    form = $(form).get(0);
    //判断是否支持attachEvent方法  IE8不支持addEventListener方法
    if (form.attachEvent) {
        //ie浏览器的绑定事件
        form.attachEvent("onsubmit", function () {
            window.open('about:blank', windowName, 'width=' + (screen.availWidth) + ',height=' + (screen.availHeight - 50) + ',top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no');
        });
        document.body.appendChild(form);
        //触发事件
        form.fireEvent("onsubmit");
    } else {
        //监听事件的方法        打开页面window.open(name);
        form.addEventListener("submit", function () {
            window.open('about:blank', windowName, 'width=' + (screen.availWidth) + ',height=' + (screen.availHeight - 50) + ',top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no');
        });
        document.body.appendChild(form);
    }
    form.submit();
    document.body.removeChild(form);
}
