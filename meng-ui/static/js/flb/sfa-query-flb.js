var customModelSettings = {
    'FLB_FLIGHT_LOG': {

        qcOptions: {
            allConds: {
                "airTime": {
                    parse: function (value) {
                        return flbParseTime(value);
                    }
                },
                "blockTime": {
                    parse: function (value) {
                        return flbParseTime(value);
                    }
                },
                "fhTotal": {
                    parse: function (value) {
                        return flbParseTime(value);
                    }
                }
            }
        },

        //列表项配置
        gridOptions: {
            allColModels: {
                'acType': {
                    sortable: false
                },
                'flbBase.flbNo': {
                    formatter: function (cellvalue, options, rowObject) {
                        if (cellvalue == null) {
                            return "";
                        } else if (cellvalue == "N/A") {
                            return cellvalue;
                        }
                        return '<a href="#"  style="color:#f60" title="FLB View" onclick="flbDetail(\'' + cellvalue + '\')" >'
                            + cellvalue + '</a>';
                    }
                },
                'flightDate': {
                    formatter: function (cellvalue, options, rowObject) {
                        if (cellvalue != null && $.trim(cellvalue).split(" ").length > 0) {
                            return cellvalue.split(" ")[0];
                        } else {
                            return $.trim(cellvalue);
                        }
                    }
                },
                'flight': {
                    formatter: function (cellvalue, options, rowObject) {

                        if (rowObject.flgVr != null) {
                            cellvalue += "(" + rowObject.flgVr + ")";
                        }

                        if (rowObject.flgCs != null) {
                            cellvalue += "(" + rowObject.flgCs + ")";

                        }

                        return cellvalue;
                    }
                },
                "onBlockDate": {
                    formatter: function (cellvalue, options, rowObject) {
                        return flbFormatTime1(cellvalue);
                    }
                },
                "offBlockDate": {
                    formatter: function (cellvalue, options, rowObject) {
                        return flbFormatTime1(cellvalue);
                    }
                },
                "takeoffDate": {
                    formatter: function (cellvalue, options, rowObject) {
                        return flbFormatTime1(cellvalue);
                    }
                },
                "landingDate": {
                    formatter: function (cellvalue, options, rowObject) {
                        return flbFormatTime1(cellvalue);
                    }
                },
                "airTime": {
                    formatter: function (cellvalue, options, rowObject) {
                        return flbFormatTime(cellvalue);
                    }
                },
                "blockTime": {
                    formatter: function (cellvalue, options, rowObject) {
                        return flbFormatTime(cellvalue);
                    }
                },
                "fhTotal": {
                    formatter: function (cellvalue, options, rowObject) {
                        return flbFormatTime(cellvalue);
                    }
                }
            },
            jqGridSettings: {
                //jqGrid配置项
                id: "flightId"
            }
        }
    }
};

function flbFormatTime(time) {
    var hour = parseInt(time / 60);
    var minute = time % 60;
    hour = hour >= 10 ? hour : ("0" + hour);
    minute = minute >= 10 ? minute : ("0" + minute);
    return hour + ":" + minute;
}

function flbFormatTime1(datetime) {
    if (datetime == null) {
        return "";
    }

    return datetime.split(" ")[1].substr(0, 5);
}

function flbDetail(flbNo) {
    var actionUrl = 'flb/flb_signup_view.action?flbBase.flbNo=' + flbNo;
    $.dialog({
        id: 'viewPage',
        title: 'FLB Detail',
        width: '1100px',
        height: '560px',
        top: '15%',
        esc: true,
        cache: false,
        max: false,
        min: false,
        parent: this,
        content: 'url:' + actionUrl
    });
}

function flbParseTime(timeStr) {
    var str = timeStr.split(":");
    var ret = 0;
    if (str.length == 1) {
        ret = parseInt(str[0], 10) * 60;
    } else {
        ret = parseInt(str[0], 10) * 60 + parseInt(str[1], 10);
    }
    if (isNaN(ret)) {
        return str;
    }
    return ret;
}