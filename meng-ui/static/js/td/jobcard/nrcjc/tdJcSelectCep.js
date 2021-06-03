var param;

var jcPkid;
var fleet;
var checkout;
var cepFilePath;
var refType;
var refData;
var jobcardVer;
var pageCount;
var companyCode;
var params = [];
var userLogin;
var userName;
var jcType;

function i18nCallBack() {
    param = getParentParam_();
    jcPkid = param.jcPkid;
    fleet = param.fleet;
    checkout = param.cepcheckout;
    cepFilePath = param.cepfilepath;
    refType = param.refType;
    refData = param.refData;
    jobcardVer = param.jobcardVer;
    companyCode = param.companyCode;
    pageCount = param.pageCounter + 1;
    userLogin = param.userlogin;
    userName = param.userName;
    jcType = param.jcType;

    if (cepFilePath != null && cepFilePath != "") {
        document.getElementById("editCep").checked = true;
    } else {
        document.getElementById("editCep").checked = false;
    }

    if (fleet == 'A350') {
        $("#hideAMM").hide();
    } else {
        $("#hideMP").hide();
    }
}

function sureButton_onClick() {
    params["fleet"] = fleet;
    params["jcpkid"] = jcPkid;
    params["checkout"] = checkout;
    params["reftype"] = refType;
    params["refdata"] = refData;
    params["jobcardver"] = jobcardVer;
    params["companyCode"] = companyCode;
    params["pageCounter"] = pageCount;
    params["userLogin"] = userLogin;
    params["userName"] = userName;
    params["jcType"] = jcType;

    var radioValue = $('input:radio:checked').val();
    if (!radioValue) {
        MsgAlert({content: "请选择编卡方式！", type: 'error'});
        return;
    }

    if (radioValue == "MP" || radioValue == "AMM") {
        if (checkout == "Y") {
            MsgAlert({content: "当前工序已经检出，请检入或取消检出再执行此操作!", type: 'error'});
            return;
        }
        if (cepFilePath) {
            if (!confirm("该工卡下已经存在工序，是否替换原有工序再进行选取？")) {
                return;
            }
            if (fleet == 'A350') {
                openModalDialog("/views/td/jobcard/smjc/smjcedit/SelectS1000DTask.shtml", params);
            } else {
                openModalDialog("/views/td/jobcard/nrcjc/SelectTask.shtml", params);
            }
        } else {
            if (fleet == 'A350') {
                openModalDialog("/views/td/jobcard/smjc/smjcedit/SelectS1000DTask.shtml", params);
            } else {
                openModalDialog("/views/td/jobcard/nrcjc/SelectTask.shtml", params);
            }
        }
    } else if (radioValue == "EDIT") {
        if (!cepFilePath) {
            MsgAlert({content: "该工卡未创建工序，请选取MP或者自编工序！", type: 'error'});

        } else {
            openModalDialog(
                "/views/td/jobcard/commonjc/TdJcCepEditDetail.shtml", params);
        }

    } else if (radioValue == "UDF") {
        if (checkout == "Y") {
            MsgAlert({content: "当前工序已经检出，请检入或取消检出再执行此操作!", type: 'error'});
            return;
        }
        if (cepFilePath) {
            if (!confirm("该工卡下已经存在工序，是否替换原有工序进行自编？")) {
                return;
            }
        }
        ajaxLoading();
        InitFuncCodeRequest_({
            data: {jcPkid: jcPkid, FunctionCode: 'TD_JC_UDFJOBCARD'},
            successCallBack: function (jdata) {
                ajaxLoadEnd();
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    var title_ = $.i18n.t('工序编辑详情');
                    ShowWindowIframe({
                        width: "900",
                        height: "500",
                        title: title_,
                        param: {jcpkid: jcPkid, jcType: jcType, pageCounter: pageCount},
                        url: "/views/td/jobcard/commonjc/TdJcCepEditDetail.shtml"
                    });
                    param.OWindow.clearRefDate();
                    param.OWindow.reload_();
                    param.OWindow.param.OWindow.reload_();
                } else {
                    MsgAlert({content: jdata.data, type: 'error'});
                }
            }
        });
    }
}

function cepView(data) {
    param.OWindow.cepView(data);
}

function openModalDialog(url, param) {
    var title_ = $.i18n.t('请选择');
    ShowWindowIframe({
        width: "1000",
        height: "400",
        title: title_,
        param: param,
        url: url
    });
}

function cepView(data) {
    param.OWindow.cepView(data);
}

function reload_() {
}