/*
 * Copyright 2018 SF Airlines Co., Ltd. All rights reserved.
 * 本文件仅限于顺丰航空有限公司内部传阅，禁止外泄以及用于其他的商业目的。
 */

var param;
var PAGE_DATA = {};
var COMBOBOX_DATA = {};

function i18nCallBack() {

    param = getParentParam_();

    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });
    var url_ac = "/api/v1/plugins/FLB_AC_LIST";

    $("#ac").combobox({
        valueField: 'tail',
        textField: 'tail',
        url: url_ac,
        prompt: '请选择',
        loadFilter: function (data) {

            if (data.data) {
                return data.data;
            } else {
                return data;
            }
        },
        onSelect: function (val) {
            // $('#ac').combobox('setValue', val.acReg);

        }
    });


    setInitialParamValue();

    InitFuncCodeRequest_({
        data: {
            domainCode: "TBM_DATE_RANGE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['dateRange'] = DomainCodeToMap_(jdata.data["TBM_DATE_RANGE"]);

                $('#dateRange').combobox({
                    panelHeight: '50px',
                    data: jdata.data.TBM_DATE_RANGE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    editable: false, // 是否可编辑
                    multiple: false, //是否可多选
                    require: true, //是否必须
                    onLoadSuccess: function () {
                        $('#dateRange').combobox('setValue', 1)
                    }
                });

                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

/**
 * 初始化查询条件
 * */
function setInitialParamValue() {
    //设置时间
    var curr_time = new Date();
    var $date_ = $('#date');
    var $time_ = $('#time');

    $date_.datebox("setValue", myformatter(curr_time));
    $time_.textbox("setValue", "10:00");
    $('#dateRange').combobox('setValue', 1);
}


function myformatter(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + (m < 10 ? ('0' + m) : m) + '-' + (d < 10 ? ('0' + d) : d);
}


function InitDataGrid() {
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pagination: true,     //开启分页
        fitColumns: true,
        columns: {
            param: {FunctionCode: 'STATION_TASK_LIST'},
            alter: {
                DATA_RANGE: {
                    formatter: function (value) {
                        return PAGE_DATA['dateRange'][value];
                    }
                },
                FLIGHT_DATE: {
                    formatter: format2Date
                },
                PLAN_TO: {
                    formatter: format2Time
                },
                PLAN_LDG: {
                    formatter: format2Time
                },
                ETD: {
                    formatter: format2Time
                },
                ETA: {
                    formatter: format2Time
                },
                TO: {
                    formatter: format2Time
                },
                LDG: {
                    formatter: format2Time
                }
            }
        },
        onLoadSuccess: function (value, rowData, rowIndex) {
        },
        contextMenus: [],
        toolbar: [],
        onDblClickRow: function () {
            var form_ = $('#dg');
            var row = form_.datagrid('getSelected'); //获取所选行的数据
            param.OWindow.setFlightInfo(row);
            CloseWindowIframe(); //关闭弹窗
        }
    });
}

function format2Date(cellvalue) {
    if (cellvalue != null) {
        return cellvalue.split(" ")[0];
    }
    return "";
}

/**
 * 截取时间段
 * */
function format2Time(cellvalue) {
    if (cellvalue != null) {
        var t = cellvalue.split(" ")[1];
        var h = t.split(":")[0];
        var m = t.split(":")[1];
        return h + ":" + m;
    }
    return "";
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    setInitialParamValue();
    searchData();
}

function searchStationData() {
    onSearch_('stationDg', '#stationSearch');
}

//重置
function doStationClear_() {
    $("#stationSearch").form('clear');
    searchStationData();
}

// 查询station的点击事件
function stationQuery() {
    $('#stationQueryWindow').window('open');
    //绑定回车查询事件
    bindFormonSearch_('#stationSearch', function () {
        searchStationData()
    });

    InitStationDataGrid();
}

function InitStationDataGrid() {
    $("#stationDg").MyDataGrid({
        identity: 'stationDg',
        sortable: true,
        singleSelect: true,
        pagination: true,     //开启分页
        fitColumns: true,
        columns: {
            param: {FunctionCode: 'FLB_STATION_LIST'},
            alter: {}
        },
        onLoadSuccess: function () {
        },
        contextMenus: [],
        toolbar: [],
        // 固定表格所占整个表格高度
        resize: function () {
            return tabs_standard_resize($('#tt'), 0.20, 0.5, 140, -6);
        },
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function () {
            var row = $('#stationDg').datagrid('getSelected'); //获取所选行的数据
            console.log(row)
            $("#station").textbox("setValue", row.station); //给station控件赋值
            // $('#stationQueryWindow').window('close'); //关闭弹窗
        }

    });
}

//查询A/C的点击事件
function acQuery() {
    $('#ACQueryWindow').window('open');
    InitACDataGrid();
}

function InitACDataGrid() {
    $("#ACDg").MyDataGrid({
        identity: 'ACDg',
        sortable: true,
        singleSelect: true,
        pagination: true,     //开启分页
        fitColumns: true,
        columns: {
            param: {FunctionCode: 'FLB_AC_LIST'},
            alter: {}
        },
        onLoadSuccess: function () {
        },
        // 固定表格所占整个表格高度
        resize: function () {
            return tabs_standard_resize($('#tt'), 0.45, 0.54, 140, -6);
        },
        contextMenus: [],
        toolbar: [],
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function () {
            var row = $('#ACDg').datagrid('getSelected'); //获取所选行的数据
            $("#ac").textbox("setValue", row.tail); //给station控件赋值
            $('#ACQueryWindow').window('close'); //关闭弹窗
        }
    });
}

//当输入框改变了之后做出的动作
//校验输入的日期及日期格式
$(function () {
    $("#flight_time_td .validatebox-text").on('blur', function () {

        var flightDate = $("#flight_time_td .validatebox-text").validatebox('getValue');
        console.log("flightDate = " + flightDate);

        //如果输入有误，1）提出警示；2） 确认警示后，要重置输入框；
        if (isDate(flightDate)) {
            alert("(" + flightDate + ") Datetime format is wrong. eg：2013-1-1 or 2013-01-01");
            $("#flight_time_td .validatebox-text").validatebox('setValue', '');
        }
    });
});

function isDate(str) {
    var arr = str.split("-");
    if (arr.length === 3) {
        var intYear = parseInt(arr[0], 10);
        var intMonth = parseInt(arr[1], 10);
        var intDay = parseInt(arr[2], 10);
        if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay)) {
            return false;
        }
        if (intYear > 4200 || intYear < 1900 || intMonth > 12 || intMonth < 0 || intDay > 31 || intDay < 0) {
            return false;
        }
        if ((intMonth === 4 || intMonth === 6 || intMonth === 9 || intMonth === 11) && intDay > 30) {
            return false;
        }

        if (intYear % 100 === 0 && intYear % 400 || intYear % 100 && intYear % 4 === 0) {
            if (intDay > 29) return false;
        } else {
            if (intDay > 28) return false;
        }
        return true;
    }
    return false;
}
