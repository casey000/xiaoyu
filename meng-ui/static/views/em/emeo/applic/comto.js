var PAGE_DATA = {};
var rangeTypePkid = "";
var appGroupPkid;

var rangeType;
var applyType;

var fleet;
var pkid;
var eoPkid;
var rvalues;
var spkid;
var sflag;

function setParamA() {
    applyType = param.applyType;
    rangeType = param.rangeType;
    pkid = param.ranPkid;
    appGroupPkid = param.appGroupPkid;
    fleet = param.fleet;
    eoPkid = param.eoPkid;
    rvalues = param.rvalues;
    sflag = param.sflag;
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

        } else if (rangeType == 'JXXL' || rangeType == 'FDJXH' || rangeType == 'GZCS' || rangeType == 'FJZCH') {
            window.location.href = '/views/em/emeo/applic/addEoFleetApplic.shtml?rangeType=' + rangeType +
                '&eoPkid=' + eoPkid + '&applyType=' + applyType + '&fleet=' + fleet+'&ranPkid=' + pkid+
                '&appGroupPkid=' + appGroupPkid+'&rvalues=' + rvalues+'&sflag=' + sflag;
            window.resizeTo("580", "600");
        } else if (rangeType == 'FJXH' || rangeType == 'PC' || rangeType == 'STA' || rangeType == 'PEMCO' || rangeType == 'PTF' || rangeType == 'FJKBH') {
            window.location.href = '/views/em/emeo/applic/addEoLineNoApplic.shtml?rangeType=' + rangeType +
                '&eoPkid=' + eoPkid + '&applyType=' + applyType + '&fleet=' + fleet+'&ranPkid=' + pkid+
                '&appGroupPkid=' + appGroupPkid+'&rvalues=' + rvalues+'&sflag=' + sflag;
        } else if (rangeType == 'PN' || rangeType == 'SN') {
            window.location.href = '/views/em/emeo/applic/addPnApplic.shtml?rangeType='
                + rangeType + '&evalNo=' + evalNo + '&fleet=' + fleet + '&applyType=' + applyType+'&rvalues=' + rvalues+'&sflag=' + sflag;
            window.resizeTo("670", "600");
        } else if (rangeType == 'SYS') {
            window.location.href = '/views/em/emeo/applic/addEoFleetApplic.shtml?rangeType='
                + rangeType + '&fleet=' + fleet + '&evalNo=' + evalNo + '&applyType=' + applyType+'&rvalues=' + rvalues+'&sflag=' + sflag;
            window.resizeTo("670", "600");
        }
    } else if (applyType == "ENG") {
        if (rangeType == "ENGSERI") {
            window.location.href = '/views/em/emeo/applic/addEoEngSeriApplic.shtml?rangeType=' + rangeType + '&eoPkid=' + eoPkid + '&applyType=' + applyType
                + '&appGroupPkid=' + appGroupPkid + '&fleet=' + fleet+'&rvalues=' + rvalues+ '&ranPkid=' + pkid+'&sflag=' + sflag;
            window.resizeTo("900", "700");

        } else /*if (rangeType == 'APUSUB' ||rangeType == 'APU' ||rangeType == 'ENG' ||rangeType == 'ENGSUB' ||rangeType == 'FDJZXH' || rangeType == 'ENGPN' || rangeType == 'ENGSN') */
        {

            window.location.href = '/views/em/emeo/applic/addEoFleetApplic.shtml?rangeType=' + rangeType + '&eoPkid=' + eoPkid + '&applyType=' + applyType
                + '&  appGroupPkid=' + appGroupPkid + '&fleet=' + fleet+'&rvalues=' + rvalues+'&sflag=' + sflag;
            window.resizeTo("580", "600");
        }
    } else if (applyType == "PART") {
        if (rangeType == "") {

        } else if (rangeType == 'DESC') {
            window.location.href = '/views/em/emeo/applic/addEoDescApplic.shtml?rangeType=' + rangeType + '&eoPkid=' + eoPkid + '&applyType=' + applyType
                + '&appGroupPkid=' + appGroupPkid + '&fleet=' + fleet+'&rvalues=' + rvalues+ '&ranPkid=' + pkid+'&sflag=' + sflag;
            window.resizeTo("580", "600");
        }
        /*else if (rangeType == 'PN') {
            window.location.href = '/views/em/emeo/applic/addEoFleetApplic.shtml?rangeType=' + rangeType + '&eoPkid=' + eoPkid + '&applyType=' + applyType
                + '&appGroupPkid=' + appGroupPkid + '&fleet=' + fleet+'&rvalues=' + rvalues;
            window.resizeTo("580", "600");
        } */
        else if (rangeType == 'SN' || rangeType == 'PN') {
            window.location.href = '/views/em/emeo/applic/addEoEngSeriApplic.shtml?rangeType=' + rangeType + '&eoPkid=' + eoPkid + '&applyType=' + applyType
                + '&appGroupPkid=' + appGroupPkid + '&fleet=' + fleet+'&rvalues=' + rvalues+'&sflag=' + sflag;
            window.resizeTo("900", "700");
        }
    }
}
