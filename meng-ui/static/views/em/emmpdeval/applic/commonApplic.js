//页面重新加载
function setPages(rangeType) {
    // alert(rangeType +"---"+ evalNo + "---"+applType)
    if (rangeType == "") {
    } else if (rangeType == 'ALL') {
        window.location.href = '/views/em/emmpdeval/applic/addAllApplic.shtml?rangeType=' + rangeType + '&evalNo=' + evalNo + '&applType=' + applType;
        window.resizeTo("420", "470");
    } else if (rangeType == 'DESC') {
        window.location.href = '/views/em/emmpdeval/applic/addDescApplic.shtml?rangeType=' + rangeType + '&evalNo=' + evalNo + '&applType=' + applType;
        window.resizeTo("670", "630");
    } else if (rangeType == 'PRE' || rangeType == 'POST') {
        window.location.href = '/views/em/emmpdeval/applic/addPostApplic.shtml?rangeType=' + rangeType + '&evalNo=' + evalNo + '&applType=' + applType;
        window.resizeTo("440", "470");
    } else if (rangeType == 'PN') {
        window.location.href = '/views/em/emmpdeval/applic/addPnApplic.shtml?rangeType=' + rangeType + '&evalNo=' + evalNo + '&applType=' + applType;
        window.resizeTo("850", "640");
    } else if (rangeType == 'SN') {
        window.location.href = '/views/em/emmpdeval/applic/addSnApplic.shtml?rangeType=' + rangeType + '&evalNo=' + evalNo + '&applType=' + applType;
        window.resizeTo("900", "700");
    } else if (rangeType == 'LINENO') {
        window.location.href = '/views/em/emmpdeval/applic/addLineNoApplic.shtml?rangeType=' + rangeType + '&evalNo=' + evalNo + '&applType=' + applType;
        window.resizeTo("670", "600");
    } else if (rangeType == 'SYS') {
        window.location.href = '/views/em/emmpdeval/applic/addConfigApplic.shtml?rangeType=' + rangeType + '&evalNo=' + evalNo + '&applType=' + applType;
        window.resizeTo("820", "600");
    } else if (rangeType == 'ENGSERI') {
        window.location.href = '/views/em/emmpdeval/applic/addEngSeriApplic.shtml?rangeType=' + rangeType + '&evalNo=' + evalNo + '&applType=' + applType;
        window.resizeTo("1060", "700");
    } else {
        window.location.href = '/views/em/emmpdeval/applic/addFleetApplic.shtml?rangeType=' + rangeType + '&evalNo=' + evalNo + '&applType=' + applType;
        window.resizeTo("480", "470");
    }
}