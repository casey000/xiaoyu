var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var ismultiselect = s_params["ismultiselect"];
var pnrequestAdd = $("#pnrequestAdd").val();
var model = s_params["model"] || '';
var configitemno = s_params["configitemno"] || '';
var filterPN = s_params["filterPN"] || '';
var isRotating = s_params["isRotating"] || '';
var udro = "";
if (pnrequestAdd) {
    sub_win.button(
        {
            id: "pnrequest",
            name: "P/N Request",
            callback: function () {
                //此方法在pn_request.js中,必须要在jsp页面中引用
                partRequest();
                return false;
            }
        },
        {
            name: 'Save',
            callback: function () {
                savedata();
                return false;
            }
        },
        {
            name: 'Close'
        }
    );
} else {
    sub_win.button(
        {
            name: 'save',
            callback: function () {
                savedata();
                return false;
            }
        },
        {
            name: 'Close'
        }
    );
}


if (!ismultiselect) {
    var multiselectFlag = false;
} else {
    var multiselectFlag = true;
}

$(function () {
    //如果是true,Rotating就默认选中Y,并且无法修改
    if (isRotating) {
        var selectUdro = $("select[name='vParts.udro']");
        selectUdro.empty();
        var option = $("<option>").val(1).text("Y");
        selectUdro.append(option);
        udro = 1;
        $("#isRotating").attr("style", "");
    }
    //var actionUrl = basePath + "/api/v1/part/list?vParts.model="+model+"&vParts.configitemno="+configitemno+"&vParts.filterPN="+filterPN;
    var actionUrl = basePath + "/api/v1/part/list";
    if (udro == 1) {
        actionUrl = basePath + "/api/v1/part/list?vParts.model=" + model + "&vParts.configitemno=" + configitemno + "&vParts.filterPN=" + filterPN + "&vParts.udro=" + udro;
    }
    var myGridSet = {
        url: actionUrl,
        ajaxGridOptions: {
            type: "post"
        },
        datatype: "json",
        altRows: true,
        cache: false,
        altclass: 'oddClass',
        height: "100%",
        colNames: ['', 'P/N', 'Description', 'Rotating', 'Issue Unit', 'Prohibitive', 'Restrictive', 'LLP', 'HT', 'PMA', 'Repairable', "Shelf-Life", "DGR", "ALT Itemnum", "Boeing P/N", '', '', "Itemnum"],
        colModel: [
            {
                name: '',
                index: '',
                width: 20,
                sortable: false,
                align: 'center',
                formatter: operorFun
            },
            {
                name: 'partno',
                index: 'partno',
                width: 100,
                sortable: false,
                align: 'center'
            },
            {
                name: 'description',
                index: 'description',
                width: 120,
                sortable: false,
                align: 'center'
            },
            {
                name: 'udro',
                index: 'udro',
                width: 80,
                sortable: false,
                align: 'center',
                formatter: formatFun
            },
            {
                name: 'issueunit',
                index: 'issueunit',
                width: 100,
                align: 'center',
                sortable: false
            },
            {
                name: 'prohibitive',
                index: 'prohibitive',
                width: 80,
                align: 'center',
                sortable: false,
                formatter: formatFun
            },
            {
                name: 'restrictive',
                index: 'restrictive',
                width: 80,
                align: 'center',
                sortable: false,
                formatter: formatFun
            },
            {
                name: 'llp',
                index: 'llp',
                width: 80,
                align: 'center',
                sortable: false,
                formatter: formatFun
            },
            {
                name: 'ht',
                index: 'ht',
                width: 80,
                align: 'center',
                sortable: false,
                formatter: formatFun
            },
            {
                name: 'udpmaitem',
                index: 'udpmaitem',
                width: 80,
                sortable: false,
                align: 'center',
                formatter: formatFun
            },
            {
                name: 'repairable',
                index: 'repairable',
                width: 80,
                sortable: false,
                align: 'center',
                formatter: formatFun
            },
            {
                name: 'udshelfcon',
                index: 'udshelfcon',
                width: 80,
                sortable: false,
                align: 'center',
                formatter: formatFun
            }, {
                name: 'uddgr',
                index: 'uddgr',
                width: 80,
                sortable: false,
                align: 'center',
                formatter: formatFun
            }, {
                name: 'altitemnum',
                index: 'altitemnum',
                width: 80,
                sortable: false,
                align: 'center'
            }, {
                name: 'oempartno',
                index: 'oempartno',
                width: 80,
                sortable: false,
                align: 'center'
            }, {
                name: 'udchndesc',
                index: 'udchndesc',
                width: 10,
                sortable: false,
                align: 'center',
                hidden: true
            }, {
                name: 'descen',
                index: 'descen',
                width: 10,
                sortable: false,
                align: 'center',
                hidden: true
            }, {
                name: 'itemnum',
                index: 'itemnum',
                width: 10,
                sortable: false,
                align: 'center',
                hidden: true
            }
        ],

        pginput: true,//显示跳转页面输入框
        pgbuttons: true,//显示翻页按钮
        rowNum: 15, //每页显示记录数
        viewrecords: true, //显示总记录数
        pager: "#gridPager", //表格数据关联的分页条，html元素
        autowidth: true, //自动匹配宽度
        gridview: true, //加速显示
        multiselect: multiselectFlag, //可多选，出现多选框
        multiselectWidth: 25, //设置多选列宽度
        sortable: true, //可以排序
        sortname: 'partno',
        sortorder: 'desc',
        toolbar: [true, "top"],
        pgbuttons: true, //是否显示翻页按钮
        pginput: true, //是否显示跳转页面的输入框
        // 支持双击关闭当前窗口并返回选中值
        ondblClickRow: function (rowId) {
            savedata();
        }
    };
    setMyGrid("#gridTable", myGridSet);
    $("#gridTable").jqGrid('setGridWidth', Math.floor(1080));


});

//行formatter
function operorFun(cellvalue, options, rowObject) {
    if (!ismultiselect) {
        return '<input class="" id="'
            + rowObject.itemnum
            + '" itemnum ="' + rowObject.itemnum
            + '" type="radio" partno="' + rowObject.partno + '"  name="source" altitemnum="' + rowObject.altitemnum + '" oempartno="' + rowObject.oempartno +
            '" issueunit="' + rowObject.issueunit + '" englishname="' + rowObject.descen + '" chinesename="' + rowObject.udchndesc + '" value="" />';
    } else {
        return "";
    }
}

//查询
$(function () {

    $("#find_btn").click(function () {
        ajaxSerch();
        return false;
    });

    $("[name='selectSearch']").first().attr("checked", true);
    var lastRadio = $("[name='selectSearch']").last();
    //$(lastRadio).parents("table").find("tr:last-child").find(":text").attr("disabled",true);
    $("#searchkeyword").attr("value", "");
    $("#searchkeyword").attr("readOnly", true);


    //查询重置按钮
    $("#resetBtn").click(function () {
        $("#searchForm").find(":text").val("");
        $.each($("#searchForm").find("select"), function (i, select) {
            $(select).find("option").first().attr("selected", "true");
        });
    });

    //添加行绑定事件
    $('#gridTable tr').live('click', function (event) {
        $(':radio', this).attr('checked', 'checked');
    });

});


function formatFun(cellvalue, options, rowObject) {
    if (cellvalue == '1') {
        return "Y";
    } else {
        return "N";
    }
}

//回填所选择数据
function saveForm() {

    var selectedIds = jQuery("#gridTable").getGridParam("selarrrow");

    if (!selectedIds || selectedIds == "") {
        P.$.dialog.alert("Please select only one PartNo!");
        return false;
    } else if (selectedIds.length > 1 && ismultiselect) {

    } else if (selectedIds.length > 1) {
        P.$.dialog.alert("Please select one PartNo!");

    } else {
        $.each(selectedIds, function (i, v) {
            var rowData = jQuery("#gridTable").getRowData(v);
            sub_win.data['partno'] = rowData.partno;
            sub_win.data['oempartno'] = rowData.oempartno;
            sub_win.data['selectedIds'] = selectedIds;
            sub_win.close();
        });
    }
}

/**
 * 点击确定
 */
function savedata() {
    var ele = $('#gridTable tr :checked');
    if (!ele || ele.length == 0) return P.$.dialog.alert('No Any Selected!');
    var selectedIds = jQuery("#gridTable").getGridParam("selarrrow");
    if (multiselectFlag) {
        var array = [];
        for (i = 0; i < selectedIds.length; i++) {
            var rowData = $("#gridTable").jqGrid("getRowData", selectedIds[i]);
            array.push(rowData);
        }
        sub_win.data['partnos'] = array;
        sub_win.data['selectedIds'] = selectedIds;
    } else {
        if (selectedIds.length > 1) {
            P.$.dialog.alert("Please select one PartNo!");
        } else {
            var rowData = jQuery("#gridTable").getRowData($(ele).closest('tr').attr('id'));
            if (rowData)
                sub_win.data['llp'] = rowData.llp || '';
            sub_win.data['partno'] = rowData.partno;
            sub_win.data['oempartno'] = $(ele).attr('oempartno');
            sub_win.data['altitemnum'] = $(ele).attr('altitemnum');
            sub_win.data['chinesename'] = $(ele).attr('chinesename');
            sub_win.data['englishname'] = $(ele).attr('englishname');
            sub_win.data['issueunit'] = $(ele).attr('issueunit');
            sub_win.data['itemnum'] = rowData.itemnum;
            sub_win.data['selectedIds'] = rowData.itemnum;
        }
    }


    sub_win.close();
}

//提交查询数据
function ajaxSerch() {
    var arrars = $("#searchForm").serializeArray();
    var text = getFormJson(arrars);
    $("#gridTable").jqGrid("setGridHeight", "100%");
    $("#gridTable").jqGrid('setGridParam', {
        ajaxGridOptions: {
            type: 'post',
            contentType: 'application/x-www-form-urlencoded;charset=utf-8',
            dataType: 'json'
        },
        datatype: 'json',
        postData: text //发送数据
    }).trigger("reloadGrid");
}

/**将form中的值转换为键值对。*/
function getFormJson(a) {
    var o = {};
    $.each(a, function () {
        if (udro == 1 && this.name == "vParts.udro") {
            delete this;
        } else if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push($.trim(this.value) || '');
        } else {
            o[this.name] = $.trim(this.value) || '';
        }
    });
    return o;
}

var dialog_width = '400px';
var dialog_height = '200px';
var add_task_dialog_width = '600px';
var add_task_dialog_height = '300px';
var dialog_top = '15%';
