var api = frameElement.api, W = api.opener;
var s_params = api.data;
var model = s_params["model"] || "";
var acIds = s_params["acIds"];
var acStatus = s_params["acStatus"];
var multipleSelect = s_params["multipleSelect"];
api.button(
    {
        name: 'Save',
        callback: function () {
            addSelected();
            return false;
        }
    },
    {
        name: 'Cancel'
    }
);
$(function () {
    $.ajax({
        url: basePath + '/api/v1/mccdoc/to_base_info/getAircraftTree?model=' + model,
        type: "get",
        dataType: "json",
        cache: false,
        success: function (data) {
            let treeData = data.data;
            //加载表格数据
            $('#table_aircraft').treegrid({
                data: treeData,
                idField: 'id',
                treeField: 'type',
                columns: [[
                    {title: 'AC/Type', field: 'type', width: "546", resizable: false, formatter: title_formatter},
                    {title: 'AC', field: 'acId', width: "0", resizable: false, hidden: true},
                    {
                        title: 'Status', field: 'status', width: "100", resizable: false,
                        align: 'center', formatter: function (value, node) {
                            return value == 0 ? "To Induct" : value == 1 ? "Inducting" : value == 2 ? "Transition Check" : value == 3 ? "Running" : value == 4 ? "Phase-out" : "";
                        }
                    }
                ]],
                onLoadSuccess: function () {
                    fillSelectedDataBefore();
                }
            });
        }
    });
});

/**
 * 隐藏状态指定状态和已经选择过的数据
 */
function fillSelectedDataBefore() {

    //过滤状态为空 并且 状态不包含在 acStatus 中的数据
    $.each($("td[field='status']"), function (i, v) {
        if (i != 0) {
            let status = $(v).find("div");
            if (status.text() != "" && $.inArray(status.text(), acStatus) == -1) {
                $(status).parent().parent().remove();
            }
        }
    });

    //过滤已经选择过的数据
    $.each($("td[field='acId']"), function (i, v) {
        if (i != 0) {
            var acId = $(v).find("div");
            var arrAcIds = acIds.split(",");
            if (acId.text() != "" && $.inArray(acId.text(), arrAcIds) > -1) {
                $(acId).parent().parent().remove();
            }
        }
    });

    //删除已经全部选择过的二级条目
    var twoStair = $(".treegrid-tr-tree").filter(function (index) {
        return $("tbody", this).children().length == 0;
    });
    twoStair.prev().remove();
    twoStair.remove();

    //删除已经全部选择过的一级条目
    var oneStair = $(".treegrid-tr-tree").filter(function (index) {
        return $("tbody", this).children().length == 0;
    });
    oneStair.prev().remove();
    oneStair.remove();

}

function title_formatter(value, node) {
    var type = 'checkbox';
    if (multipleSelect === false) {
        type = 'radio';
    }
    var content = '<input name="set_power" id="aircraft_'
        + node.id + '" _tail="' + node.type + '" _acId="' + node.acId + '" onclick="set_aircraft_power_status(this,' + node.id
        + ')" class="set_power_status" type="' + type + '" value="' + node.id + '" />' + value;
    return content;
}

function set_aircraft_power_status(obj, menu_id) {
    var nodes = $("#table_aircraft").treegrid("getChildren", menu_id);
    var _this = $(obj);
    for (var i = 0; i < nodes.length; i++) {
        if (_this.prop("checked")) {
            $("#aircraft_" + nodes[i].id).prop("checked", true);
        } else {
            $("#aircraft_" + nodes[i].id).prop("checked", false);
        }
    }
}

//保存事件
function addSelected() {

    var totalAcIds = $(':checked').map(function () {
        return $(this).attr("_acId") > 0 ? $(this).attr("_acId") : null;
    }).get().join(',');

    var totalTails = $(':checked').map(function () {
        return $(this).attr("_acId") > 0 ? $(this).attr("_tail") : null;
    }).get().join(',');

    if (!totalAcIds) {
        W.$.dialog.alert('Please choose a aircraft.');
        return;
    }

    //获取选中小机型对应的大机型
    var topAcType = $(':checked').map(function () {
        if ($(this).parents(".treegrid-tr-tree").prev().length == 2) {
            return $(this).parents(".treegrid-tr-tree").prev().eq(1).text();
        }
    }).get().join(',');

    //过滤重复的大机型
    topAcType = topAcType.split(',').del().join(',');

    //获取选中小机型对应的机型
    var acType = $(':checked').map(function () {
        if ($(this).parents(".treegrid-tr-tree").prev().length == 2) {
            return $(this).parents(".treegrid-tr-tree").prev().eq(0).text();
        }
    }).get().join(',');

    //获取选中小机型对应的状态
    var status = $(':checked').map(function () {
        if ($(this).parents(".treegrid-tr-tree").prev().length == 2) {
            return $(this).parents(".datagrid-row").children().eq(2).text();
        }
    }).get().join(',');

    api.data['acId'] = totalAcIds;
    api.data['tail'] = totalTails;
    api.data['topAcType'] = topAcType;
    api.data['acType'] = acType;
    api.data['status'] = status;
    api.close();
}

//过滤数组重复数据
Array.prototype.del = function () {
    var a = {}, c = [], l = this.length;
    for (var i = 0; i < l; i++) {
        var b = this[i];
        var d = (typeof b) + b;
        if (a[d] === undefined) {
            c.push(b);
            a[d] = 1;
        }
    }
    return c;
};