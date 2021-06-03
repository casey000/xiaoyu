/**
 * Created by tpeng on 2016/7/6.
 */
var AM_AUTH_ = ""; //����Ȩ������
var AM_MENU_AUTH_ = ""; //�˵�Ȩ������

/**
 * ��ʼ���˵�Ȩ��
 * @param authValue
 */
function AuthMenu_(authValue) {
    var auth64 = $.trim(authValue);
    if (auth64 == "") {
        return;
    }
    AM_MENU_AUTH_ = new Base64().decode(auth64);
}

/**
 * ��ʼ������Ȩ��
 * @param authValue
 */
function AuthPerm_(authValue) {
    var auth64 = $.trim(authValue);
    if (auth64 == "") {
        return;
    }
    AM_AUTH_ = new Base64().decode(auth64);
}

function VALID_AUTH(vauth) {
    if (AM_AUTH_ == "all") {
        return true;
    }
    if (vauth.indexOf("&") != -1 || vauth.indexOf("|") != -1) {
        var group = vauth.match(/\[#[\da-zA-Z_]*#\]/g); //ƥ��//"[#k8889m#]"
        if (group) {
            for (var i = 0; i < group.length; i++) {
                var m = group[i];
                var mauth = group[i].replace("[#", "").replace("#]", "");
                var v = IS_AUTH(mauth);
                vauth = vauth.replace(m, v + "");
            }
            eval("var result = " + vauth + ";");
            return result;
        }
    } else {
        return IS_AUTH(vauth);
    }
}

function IS_AUTH(vauth) {
    if (AM_AUTH_ == "") {
        return;
    }
    var AuthStr = "," + AM_AUTH_ + ",";
    if (AuthStr.indexOf(",all,") != -1 || AuthStr.indexOf("," + vauth + ",") != -1) {
        return true;
    }
    return false;
}