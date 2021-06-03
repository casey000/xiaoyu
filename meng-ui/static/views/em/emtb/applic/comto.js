var PAGE_DATA = {};
var rangeTypePkid = "";
var appGroupPkid;

var rangeType;
var applyType;

var fleet;
var pkid;
var eoPkid;


function setParamA() {
    applyType = param.applyType;
    rangeType = applyType;
    pkid = param.pkid;
    appGroupPkid = param.appGroupPkid;
    fleet = param.fleet;
    eoPkid = param.eoPkid;

    //适用类型
    if (operation == "view") {
        $("#view").hide();
    }
    if (operation == "edit") {
        spkid = param.spkid;
        $("#spkid").val(spkid);
    }
}

function setParam() {


    if (pkid == undefined) {
        pkid = "";
    }
    if (getUrlParam("fleet") != "") {
        fleet = getUrlParam("fleet");
    }
    if (getUrlParam("applyType") != "") {
        applyType = getUrlParam("applyType");
        rangeType = applyType
    }
    if (getUrlParam("appGroupPkid") != "") {
        appGroupPkid = getUrlParam("appGroupPkid");
    }

    rangeType = getUrlParam("rangeType");

    //适用类型
    if (operation == "view") {
        $("#view").hide();
    }
    if (operation == "edit") {
        spkid = param.spkid;
        $("#spkid").val(spkid);
    }

}

//页面重新加载
function setPages(rangeType) {
    if (applyType == "APL") {
        if (rangeType == "") {

        } else if (rangeType == 'JXXL' || rangeType == 'FDJXH' || rangeType == 'GZCS' || rangeType == 'FJZCH' || rangeType == 'FJKBH') {
            window.location.href = '/views/em/emtb/applic/addEoFleetApplic.shtml?rangeType=' + rangeType +
                '&eoPkid=' + eoPkid + '&applyType=' + applyType + '&fleet=' + fleet
                + '&appGroupPkid=' + appGroupPkid;
            window.resizeTo("580", "600");
        } else if (rangeType == 'FJXH' || rangeType == 'PC' || rangeType == 'STA' || rangeType == 'PEMCO') {
            window.location.href = '/views/em/emtb/applic/addEoLineNoApplic.shtml?rangeType=' + rangeType +
                '&eoPkid=' + eoPkid + '&applyType=' + applyType + '&fleet=' + fleet
                + '&appGroupPkid=' + appGroupPkid;
        } else if (rangeType == 'PN' || rangeType == 'SN') {
            window.location.href = '/views/em/emtb/applic/addPnApplic.shtml?rangeType='
                + rangeType + '&evalNo=' + evalNo + '&fleet=' + fleet + '&applyType=' + applyType;
            window.resizeTo("670", "600");
        } else if (rangeType == 'SYS') {
            window.location.href = '/views/em/emtb/applic/addEoFleetApplic.shtml?rangeType='
                + rangeType + '&fleet=' + fleet + '&evalNo=' + evalNo + '&applyType=' + applyType;
            window.resizeTo("670", "600");
        }
    } else if (applyType == "ENG") {
        if (rangeType == "ENGSERI") {
            window.location.href = '/views/em/emtb/applic/addEoEngSeriApplic.shtml?rangeType=' + rangeType + '&eoPkid=' + eoPkid + '&applyType=' + applyType
                + '&  appGroupPkid=' + appGroupPkid + '&fleet=' + fleet;
            window.resizeTo("900", "700");

        } else /*if (rangeType == 'APUSUB' ||rangeType == 'APU' ||rangeType == 'ENG' ||rangeType == 'ENGSUB' ||rangeType == 'FDJZXH' || rangeType == 'ENGPN' || rangeType == 'ENGSN') */
        {

            window.location.href = '/views/em/emtb/applic/addEoFleetApplic.shtml?rangeType=' + rangeType + '&eoPkid=' + eoPkid + '&applyType=' + applyType
                + '&  appGroupPkid=' + appGroupPkid + '&fleet=' + fleet;
            window.resizeTo("580", "600");
        }
    } else if (applyType == "PART") {
        if (rangeType == "") {

        } else if (rangeType == 'DESC') {
            window.location.href = '/views/em/emtb/applic/addEoDescApplic.shtml?rangeType=' + rangeType + '&eoPkid=' + eoPkid + '&applyType=' + applyType
                + '&  appGroupPkid=' + appGroupPkid + '&fleet=' + fleet;
            window.resizeTo("580", "600");
        } else if (rangeType == 'PN') {
            window.location.href = '/views/em/emtb/applic/addEoFleetApplic.shtml?rangeType=' + rangeType + '&eoPkid=' + eoPkid + '&applyType=' + applyType
                + '&  appGroupPkid=' + appGroupPkid + '&fleet=' + fleet;
            window.resizeTo("580", "600");
        } else if (rangeType == 'SN') {
            window.location.href = '/views/em/emtb/applic/addEoEngSeriApplic.shtml?rangeType=' + rangeType + '&eoPkid=' + eoPkid + '&applyType=' + applyType
                + '&  appGroupPkid=' + appGroupPkid + '&fleet=' + fleet;
            window.resizeTo("900", "700");
        }
    }
}
