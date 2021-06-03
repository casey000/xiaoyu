var loginInfo;
$(function () {
    function getUrlParams() {
        let search = window.location.search.split("?")[1];
        let params = {};
        search && $.each(search.split("&"), function (i, v) {
            if(v) {
                let key = v.split("=")[0];
                let value = v.split("=")[1];
                params[key] = value;
            }
        });
        return params;
    }
    loginInfo = getLoginInfo();
    let params = getUrlParams();
    var defaultParam ={};
    params.fromPage == 'flightDetail' ? defaultParam = {
        'qname': ['ae'],
        'qoperator': ['equals'],
        'qvalue': [params.acId]
    }:defaultParam = {
        'qname': ['delFlag'],
        'qoperator': ['equals'],
        'qvalue': ['n']
    };
    var url;
    params.fromPage == 'flightDetail' ? url = 'V_NRC_MODEL_STATUS' : url = "V_NRC_BASE"
    params.fromPage && $('.list_btn_row ul').css('display','none')
    var options = {
        view: url,
        // 初始化查询参数
        defaultParam: defaultParam,
        qcOptions: {
            qcBoxId: "qc_box"
        },
        gridOptions: {
            gridId: "common_list_grid",
            allColModels: {
                'edit': {
                    name: 'E',
                    colNameEn: 'E',
                    isOpts: true,
                    width: 25,
                    formatter: function (cellValue, options, rowObj) {
                        let result = VALID_AUTH("TD_NRC_edit");
                        if(!result){
                            return '';
                        }
                        if (rowObj.postSap == 'back' && rowObj.rectPlanUpdatedId == loginInfo.accountId) {
                            var ele = '<div id="rowData_' + rowObj.nrcId + '" auth="TD_NRC_edit" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-edit z_bianji" title="Edit"></div>';
                            $('#rowData_' + rowObj.nrcId).die().live('click', function () {
                                nrc_edit(rowObj.nrcId, rowObj, 'back')
                            });
                            return ele;
                        }

                        if (rowObj.status == '3' || rowObj.delFlag == 'y' || rowObj.nrcProcessStatus == 'APPROVED') {
                            return '';
                        }
                        // 增加权限控制：登录人非Checking、Approving节点处理人，不出现编辑按钮
                        if (rowObj.nrcProcessStatus) {
                            if (rowObj.curAssignee && rowObj.curAssignee != loginInfo.accountId) {
                                return '';
                            }
                        }

                        var ele = '<div id="rowData_' + rowObj.nrcId + '" auth="TD_NRC_edit" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-edit z_bianji" title="Edit"></div>';
                        $('#rowData_' + rowObj.nrcId).die().live('click', function () {
                            nrc_edit(rowObj.nrcId, rowObj)
                        });
                        return ele;


                    }
                },
                'del': {
                    name: 'D',
                    colNameEn: 'D',
                    isOpts: true,
                    width: 25,
                    formatter: function (cellValue, options, rowObj) {
                        let result = VALID_AUTH("TD_NRC_delete");
                        if(!result){
                            return '';
                        }
                        // if (rowObj.status == 'C') {
                        //     return '';
                        // }
                        // 增加权限控制：登录人非Checking、Approving节点处理人，不出现删除按钮
                        if (rowObj.nrcProcessStatus != 'EDITING' || !rowObj.curAssignee || rowObj.curAssignee != loginInfo.accountId) {
                            return '';
                        }

                        var ele = '<div id="delete_ner' + rowObj.nrcId + '" auth="TD_NRC_delete" class="uui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-Empty z_shanchu" title="delete"></div>';
                        $('#delete_ner' + rowObj.nrcId).die().live('click', function () {
                            nrc_delete(rowObj.nrcId, rowObj);
                        });
                        return ele;

                    }
                },

                'hoReason': {
                    formatter: hoReasonFun,
                    width: 150
                },
                'nrcNo': {
                    name: 'nrcNo',
                    formatter: function (cellValue, options, rowObj) {
                        if (rowObj.nrcNo == null) {
                            return "<span>null</span>";
                        } else {
                            var ele = '<span id="nrcno_' + rowObj.nrcId + '" title="' + rowObj.nrcNo + '" style="cursor: pointer;color: #f60; ">' + rowObj.nrcNo + '</span>';
                            $('#nrcno_' + rowObj.nrcId).die().live('click', function () {
                                nrc_see(rowObj.nrcId, rowObj);
                            });
                            return ele;
                        }
                    }
                },
                'mrs': {
                    sortable : false,
                    name: 'mrs',
                    formatter: function (cellValue, options, rowObj) {
                        let mrStr = "";
                        if(rowObj.mrs){
                            let arr = rowObj.mrs.split(";");
                            for(let i = 0 ; i < arr.length ; i++){
                                let mrNo = "MR"+arr[i].substring(1,arr[i].length);
                                mrStr += '<span id="mrno'+ cellValue +'" onclick="viewMR(\''+arr[i] +'\')"  style="cursor: pointer;color: #fff; ">' + mrNo + '&nbsp &nbsp'+'</span>';
                            }
                        } else {
                            // 如果没有MR就显示MRP
                            mrStr = `<a onclick="viewMRP('${rowObj.nrcId}','${rowObj.nrcNo}')" href="javascript:;" style="cursor: pointer;color: #f60; ">查看MRP</a>`;
                        }
                        if (rowObj.satisfyStatus == 3) {
                            return "<div style='background-color: red;color: #fff;width: 100%;height: 100%;line-height: 30px' >" + mrStr + "</div>";
                        } else if (rowObj.satisfyStatus == 2) {
                            return "<div style='background-color: Gold ;color: #fff;width: 100%;height: 100%;line-height: 30px'>" + mrStr + "</div>";
                        } else if (rowObj.satisfyStatus == 1) {
                            return "<div style='background-color: DarkGreen;color: #fff;width: 100%;height: 100%;line-height: 30px'>" + mrStr + "</div>";
                        } else {
                            return mrStr;
                        }
                    }
                },
                'isRepeat': {
                    formatter: "select",
                    editoptions: {
                        value: {1: "YES", null: "NO"}
                    },
                    formatType: 'map',
                    pattern: {
                        "1": "YES",
                        "0": "NO",
                        "null": "NO"
                    }
                },
                'type': {
                    sortable : true
                },
                'timeLimitType': {
                    formatter: "select",
                    editoptions: {
                        value: {1: "硬时限", 2: "软时限"}
                    },
                    formatType: 'map',
                    pattern: {
                        "1": "硬时限",
                        "2": "软时限",
                        "": ""
                    }
                },
                'defect': {
                    formatter: "select",
                    editoptions: {
                        value: {"n": "NO", "y": "YES"}
                    },
                    /*
                    * 配置列表导出Format
                    *  formatType： map | merge
                    *  pattern : {}
                    * */
                    formatType: 'map',
                    pattern: {
                        // "y":"<font style='color:green'>在位</font>", //允许添加样式进行填充
                        "n": "NO",
                        "y": "YES",
                        "": ""
                    }
                },
                'isHasEwis': {
                    formatter: "select",
                    editoptions: {
                        value: {"n": "NO", "y": "YES"}
                    },
                    formatType: 'map',
                    pattern: {
                        "n": "NO",
                        "y": "YES",
                        "": ""
                    }
                },
                'isHasOil': {
                    formatter: "select",
                    editoptions: {
                        value: {"n": "NO", "y": "YES"}
                    },
                    formatType: 'map',
                    pattern: {
                        "n": "NO",
                        "y": "YES",
                        "": ""
                    }
                },
                'isrepeat': {
                    formatter: "select",
                    editoptions: {
                        value: {0: "NO", 1: "YES"}
                    },
                    formatType: 'map',
                    pattern: {
                        "0": "NO",
                        "1": "YES",
                        "": ""
                    }
                },
                'skill': {
                    formatter: "select",
                    editoptions: {
                        value: {1: "ME", 2: "AV", 3: "STR"}
                    },
                    formatType: 'map',
                    pattern: {
                        "1": "ME",
                        "2": "AV",
                        "3": "STR"
                    }
                },
                'logCount' : {
                    // isOpts : true,
                    formatter : formatViewLog
                }
            },
            jqGridSettings: {
                height: 500,
                multiselect: true
            },

            optsFirst: true,
            optsCols: ["del","edit"],


        },

    };

    $(document).sfaQuery(options);


    function formatViewLog (cellvalue, options, rowObject) {
        var editDiv = '';
        var colorValue ='';
        //如果有数据显示绿色，没有数据显示红色
        if(rowObject.logCount!=null && rowObject.logCount>0){
            colorValue="green";
        }else {
            colorValue="red";
        }
        editDiv = '<div style="cursor: pointer;color:'+colorValue+';" id="'
            + options.nrcId
            + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="log"'
            + ' onclick=toLog(\"'
            + rowObject.nrcId
            + '\","add")>'+'备注('+rowObject.logCount+')'+'</div>';
        return editDiv;
    }

    // hoReason的显示转换
    function hoReasonFun(cellvalue, options, rowObject) {
        if (cellvalue == null || cellvalue == 'null') {
            cellvalue = "";
        } else {
            cellvalue = cellvalue.replace("1", "TS");
            cellvalue = cellvalue.replace("2", "MATERIAL");
            cellvalue = cellvalue.replace("3", "SPEC. TOOLS");
            cellvalue = cellvalue.replace("4", "TIME LIMIT");
            cellvalue = cellvalue.replace("5", "OTHER");
        }
        return cellvalue;
    }

    // 增加按钮
    $("#add_btn").click(function () {

        var curWidth = ($(window).width() * 0.6).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {nrcid: ""},
            url: "/views/nrc/nrc_toAdd.shtml"
        });
    });


    // 导入
    $("#import_btn").click(function () {

        // var curWidth = ($(window).width() * 0.6).toString();   //测试定检弹窗
        // var curheight = $(window).height().toString();
        // ShowWindowIframe({
        //         //     width: curWidth,
        //         //     height: curheight,
        //         //     title: "",
        //         //     param: {},
        //         //     url: "/views/fixed/fixed_inspection.shtml"
        //         // });
    });

    // 导出
    $("#export_btn").click(function () {
        dynamicExportMVC({
            sfaQuery: $(document).sfaQuery(),
            container: $(this).parent(),
            fileName: 'NRC_LIST.xls',//导出文件命名
            url: "/api/v1/tbm/nrc/nrc/export_by_page"//后端提供的接口

        });
    });

// 批量更新计划执行日期
//     $('#batch_update_exec_date').click(function () {
//         // 获取选中行的行号
//         var _selectedIds = jQuery("#common_list_grid").getGridParam("selarrrow");
//         if (!_selectedIds || _selectedIds.length == 0) {
//             $.dialog.alert("Please select record！");
//             return;
//         }
//
//         // 非OPEN状态,已加入工作包的工卡不允许修改
//         for (var i = 0; i < _selectedIds.length; i++) {
//             // 只有OPEN状态的工卡可以修改计划执行日期
//             var status = $("#common_list_grid").getRowData(_selectedIds[i]).status.replace(/<\/?[^>]*>/g, '');
//             if (status != "OPEN") {
//                 $.dialog.alert("[OPEN] Status can only update !");
//                 return false;
//             }
//
//             // 已经加入工作包的工卡不允许修改计划执行时间
//             var woNo = $("#common_list_grid").getRowData(_selectedIds[i]).wono.replace(/(^\s*)|(\s*$)/g, "");
//             if (woNo) {
//                 $.dialog.alert("There are NRC Cards which have been added to the workOrder !");
//                 return false;
//             }
//         }
//
//         var _rowData = [];
//         $.each(_selectedIds, function () {
//             _rowData.push($("#common_list_grid").jqGrid('getRowData', this));
//         });
//
//         $.dialog
//         ({
//             title: 'Batch Update Planning Exc Date',
//             data: {'ids': _selectedIds.join(','), 'rowData': _rowData},
//             width: 450,
//             height: 250,
//             esc: true,
//             async: false,
//             cache: false,
//             max: false,
//             min: false,
//             // parent:this,
//             content: 'url:' + basePath + '/nrc/nrc_update_planning_exc_date.jsp',
//             close: function () {
//                 if (this.data && this.data['reload']) {
//                     $(document).sfaQuery().reloadQueryGrid();
//                 }
//             }
//         });
//     });

    $('#batch_update_exec_date').click(function () {
        var curWidth = ($(window).width() * 0.95).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {},
            url: "/views/defect/new_addcc.shtml",
        });
    });

    $('#repeat_calculate_btn').click(function () {
        //获得NRC的ID
        let nodes = $(".ui-state-highlight");
        if (nodes.length !== 1) {
            return window.alert("请选择一条NRC！");
        }
        let rowDataId = $(nodes).attr("id");
        let rowData = $(document).sfaQuery().queryGrid.jqGrid.getRowData(rowDataId);
        let nrcId = rowData.nrcId;
        //含网页信息就这样
        let nrcNo = $(rowData.nrcNo).text();

        $.ajax({
            type: "GET",
            url: "/api/v1/tbm/nrc/nrc/repeat_calculate_nrc?nrcId=" + nrcId,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.code === 200) {
                    window.alert("重新计算并推送NRC成功！");
                } else if (data.msgData && data.msgData[0]) {
                    window.alert(data.msgData[0]);
                } else {
                    window.alert(data.msg);
                }
            },
            error: function () {
                window.alert("重新计算并推送NRC失败！");
            }
        });
    });

    $('#review_btn').click(function () {
        var _selectedIds = jQuery("#common_list_grid").getGridParam("selarrrow");
        if (!_selectedIds || _selectedIds.length != 1) {
            $.dialog.alert("Please select one record only.");
            return;
        }

        var rowData = $("#common_list_grid").getRowData(_selectedIds[0]);
        // 非OPEN状态,已加入工作包的工卡不允许修改
        // 只有OPEN状态的工卡可以修改计划执行日期
        var status = rowData.status.replace(/<\/?[^>]*>/g, '');
        if (status != "OPEN") {
            $.dialog.alert("[OPEN] Status can only review !");
            return false;
        }
        if (rowData.nrcProcessStatus != "APPROVED") {
            $.dialog.alert("Status APPROVED can only review !");
            return false;
        }
        if (rowData.postSap == "back") {
            $.dialog.alert("Back From SAP can not review !");
            return false;
        }

        //TODO 校验NRC工单状态是否已经完成、是否已计划

        //如果为附控类NRC就跳到附控类NRC的页面
        if (rowData.itemCat === "CM") {
            var curWidth = ($(window).width() * 0.6).toString();
            var curheight = $(window).height().toString();
            ShowWindowIframe({
                width: curWidth,
                height: curheight,
                title: "",
                param: {nrcid: rowData.nrcId, optype: "review"},
                url: "/views/nrc/nrc_cm.shtml"
            });
        }
        else {
            nrc_edit(rowData.nrcId, rowData, 'review');
        }
    });

    // 硬时限推迟
    $("#nrc_suspending_btn").click(function () {
        // 获取选中行的行号
        var _selectedIds = jQuery("#common_list_grid").getGridParam("selarrrow");
        if (!_selectedIds || _selectedIds.length == 0 || _selectedIds.length > 1) {
            $.dialog.alert("Please select ONE record！");

        }


    })



});

function viewMRP(cardId,cardNo){
    ShowWindowIframe({
        width: "1060",
        height: "650",
        title: "航材需求",
        param: {cardNo: cardNo, cardId: cardId, type: 'A'},
        url: "/views/pm/mc/task/weekPlan_mate_list.shtml"
    });
}


function viewMR(mrNo) {
    ShowWindowIframe({
        width: 1100,
        height: 650,
        title: '',
        param: {
            mrNo: mrNo,
        },
        url: "/views/mr/viewMr.shtml"
    });
}

function open_task_page(_form, rowData) {

    var form = _form.data.form;
    ShowWindowIframe({
        identity: rowData.nrcId,
        width: form.width || 800, height: form.height || 380,
        title: "流程任务处理",
        param: {
            unCurAssignee: rowData.unCurAssignee,
            TASK_ID: rowData.taskId, FLOW_DEF_ID: rowData.flowDefId,
            PROC_DEF_ID: rowData.procDefId, PROC_INST_ID: rowData.processId
        },
        url: form.formUrl
    });
}

function nrc_edit(id, rowData, back) {
    var unCurAssignee = rowData.curAssignee != loginInfo.accountId ? "hide" : "show";
    var _params = {};
    _params['nrcId'] = rowData['nrcId'];
    _params['taskId'] = rowData['taskId'];
    _params['flowDefId'] = rowData['flowDefId'];
    _params['procDefId'] = rowData['procDefId'];
    _params['processId'] = rowData['nrcProcessId'];
    _params['unCurAssignee'] = unCurAssignee;

    var url = '/api/v1/plugins/PROCESS_GET_FORM';
    var _data = {
        FunctionCode: "PROCESS_GET_FORM",
        taskId: _params['taskId'],
        flowDefId: _params['flowDefId']
    };
    if (back) {
        var curWidth = ($(window).width() * 0.6).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {nrcid: id, optype: back},
            url: "/views/nrc/nrc_toAdd.shtml"
        });
    } else {
        $.ajax({
            type: "POST",
            url: url,
            data: _data,
            success: function (data) {
                open_task_page(data, _params);
            },
            error: function () {
                window.alert("获取数据失败！");
            }
        });
    }
    /*


    */
}

function nrc_see(id, rowObj) {
    if ($(window).width() < 1100) {
        var curWidth = ($(window).width()).toString();
        var curheight = $(window).height().toString();
    } else {
        var curWidth = ($(window).width() * 0.7).toString();
        var curheight = $(window).height().toString();
    }
    if (rowObj.itemCat == "4") {

        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {nrcid: id},
            url: "/views/nrc/nrc_seecm.shtml"
        });
    } else {

        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {nrcid: id, unCurAssignee: "see"},
            url: "/views/nrc/see_nrc.shtml"
        });
    }

}

function nrc_delete(id, obj) {

    if (obj.nrcNo == null) {
        if (confirm("确实要删除吗？")) {
            nre_shanchu(id, "");
        }

    } else {
        var person = prompt("请输入删除原因！", "");
        if (person != null && person != "") {
            nre_shanchu(id, person);
        }
    }
}

function nre_shanchu(id, name) {
    $.ajax({
        type: "POST",
        url: "/api/v1/tbm/nrc/nrc/delete_nrc_by_id",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify({
            id: id,
            reason: name
        }),
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                Refresh();
                alert("删除成功！");

            } else {
                if (data.msgData && data.msgData[0]) {
                    alert(data.msgData[0]);
                } else {
                    alert(data.msg);
                }
            }

        },
        error: function () {
            window.alert("删除失败！");
        }
    });
}

function Refresh() {
    $(".qc_btn_srh").click();
}
function addMr() {
    //获得NRC的ID
    let nodes = $(".ui-state-highlight");
    if (nodes.length !== 1) {
        return window.alert("请选择一条NRC！");
    }
    let rowDataId = $(nodes).attr("id");
    let rowData = $(document).sfaQuery().queryGrid.jqGrid.getRowData(rowDataId);
    let nrcId = rowData.nrcId;
    let curWidth = ($(window).width() * 0.6).toString();
    let curheight = $(window).height().toString();
    let parameters = {
        "cardId": nrcId,
        "tdWorkType": "NRC"
    };
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: "addMr",
        param: parameters,
        url: "/views/mr/add_mr.shtml"
    });
}

function reload_nrc_delay() {
    //获得NRC的ID
    let nodes = $(".ui-state-highlight");
    if (nodes.length !== 1) {
        return window.alert("请选择一条NRC！");
    }
    let rowDataId = $(nodes).attr("id");
    let rowData = $(document).sfaQuery().queryGrid.jqGrid.getRowData(rowDataId);
    let nrcId = rowData.nrcId;
    //含网页信息就这样
    let nrcNo = $(rowData.nrcNo).text();

    $.ajax({
        type: "GET",
        url: "/api/v1/nrc/delay/get_delay_by_nrc_id?nrcId=" + nrcId,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                //结合状态，当登录用户与操作用户不一致，且不为EDITING和ACTIVE状态，给出提示
                let curAssignee = data.data.curAssignee;
                let processStatus = data.data.processStatus;
                if (curAssignee == null && processStatus !== 'EDITING' && processStatus !== 'ACTIVE') {
                    alert("当前用户无权限操作");
                }
                else if (curAssignee != null && curAssignee !== loginInfo.accountId) {
                    alert("当前用户无权限操作");
                }
                else {
                    //弹出NRC延期窗口
                    var curWidth = ($(window).width() * 0.6).toString();
                    var curheight = $(window).height().toString();
                    ShowWindowIframe({
                        width: curWidth,
                        height: curheight,
                        title: "NRC延期申请",
                        param: {delay: data},
                        url: "/views/nrc/nrc_delay.shtml"
                    });
                }
            } else {
                if (data.msgData && data.msgData[0]) {
                    alert(data.msgData[0]);
                } else {
                    alert(data.msg);
                }
            }

        },
        error: function () {
            alert("失败！");
            parent && parent.window.colsa_window && parent.window.colsa_window();
            window.close();
        }
    });


}
function toLog(nrcId) {
    var curWidth = ($(window).width() * 0.6).toString();
    var curheight = $(window).height().toString();
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: "",
        param: {nrcId: nrcId},
        url: "/views/nrc/nrc_remark_edit.shtml"
    });
}