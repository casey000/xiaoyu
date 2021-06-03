var customModelSettings = {
    "NRC_MONITOR": {
        // 列表项配置
        gridOptions: {
            allColModels: {
                'mrStation': {
                    name: 'mrStation',
                    sortable: false,
                    formatter: function (cellValue, options, rowObj) {
                        if (rowObj.mrStation==null) {
                            return '';
                        }
                        else {
                            if (rowObj.isSatisfy == 3) {
                                    return "<div style='background-color: red;color: #fff;width: 100%;height: 100%;line-height: 30px'>" + rowObj.mrStation + "</div>"
                                } else if (rowObj.isSatisfy == 2) {
                                return "<div style='background-color: Gold ;color: #fff;width: 100%;height: 100%;line-height: 30px'>" + rowObj.mrStation + "</div>"
                            } else if (rowObj.isSatisfy == 1) {
                                return "<div style='background-color: DarkGreen;color: #fff;width: 100%;height: 100%;line-height: 30px'>" + rowObj.mrStation + "</div>"
                            } else {
                                return "<span >" + rowObj.mrStation + "</span>"
                            }
                        }
                    }
                },
                'dueDate': {
                    formatter: function (cellValue, options, rowObj) {
                        if (rowObj.dueDate) {
                            return rowObj.dueDate;
                        } else {
                            return "";
                        }
                    }
                },
                'remainDay': {
                    name: 'remainDay',
                    colNameEn: 'remainDay',
                    formatter: function (cellValue, options, rowObj) {
                        if (rowObj.remainDay == null) {
                            return '';
                        } else {
                            if (rowObj.remainDay < 0) {
                                return "<div style='background-color: red;color: #fff;width: 100%;height: 100%;line-height: 30px'>" + rowObj.remainDay + "</div>"
                            } else if (rowObj.remainDay <= 10) {
                                return "<div style='background-color: Gold;color: #fff;width: 100%;height: 100%;line-height: 30px'>" + rowObj.remainDay + "</div>"
                            } else {
                                return rowObj.remainDay
                            }
                        }
                    }
                },
                "cardNo": {

                    formatter: function (cellValue, options, rowObj) {
                        var ele = '<span id="nrctaskno_' + rowObj.id + '"  style="cursor: pointer;color: #f60; ">' + (cellValue == null ? "" : cellValue) + '-R' + rowObj.revNo + '</span>';
                        $('#nrctaskno_' + rowObj.id).live('click', function () {
                            viewNrc(rowObj);
                        });
                        return ele;
                    }
                },
                'timeLimitType': {
                    formatter: "select",
                    editoptions: {
                        value: {1: "硬时限", 2: "软时限"}
                    },
                    /*
                     * 配置列表导出Format
                     *  formatType： map | merge
                     *  pattern : {}
                   */
                    formatType: 'map',
                    pattern: {
                        // "y":"<font style='color:green'>在位</font>", //允许添加样式进行填充
                        1: "硬时限",
                        2: "软时限",
                        "": ""
                    }
                },
                'postSap': {
                    isOpts: true
                },
                'isIssued': {
                    sortable: false,
                    formatter: "select",
                    editoptions: {
                        value: {"y": "已下发", "n": "未下发"}
                    },
                    formatType: 'map',
                    pattern: {
                        "y": "已下发",
                        "n": "未下发",
                        "": "未下发"
                    }
                },
                'lastCsn': {sortable: false}, 'lastDate': {sortable: false},
                'mrs': {
                    sortable: false,
                    formatter: formatViewmr
                },
                'station': {sortable: false}, 'fltNos': {sortable: false},
                'planDate': {sortable: false}, 'fltNos': {sortable: false},
                'assign': {
                    name: 'Assign',
                    colNameEn: 'Assign',
                    isOpts: true,
                    width: 50,
                    formatter: formatAssignDefect
                },
                'edit': {
                    name: 'Assign',
                    colNameEn: 'Assign',
                    isOpts: true,
                    width: 50,
                    formatter: formateditDefect
                },
                /*   'cardNo': {
                       formatter: dateTimeFormatter
                   },*/

                "lastTsn":
                    {
                        sortable: false,
                        formatter: function (cellvalue, options, rowObject) {
                            var tsn = "";
                            if (cellvalue) {
                                tsn = convertToTime(cellvalue);
                            }

                            return tsn;
                        }
                    },
                'cardType': {
                    formatter: dateTimeFormatter1
                },
                'acEng': {
                    formatter: dateTimeFormatter3
                },
                'nrcDescription': {
                    formatter: dateTimeFormatter4
                },

            },
            optsCols: ["assign","edit"],
            optsFirst: true,
        }
    }
};
function formatViewmr(cellValue,options,rowObj) {
    let ele = '';
    if (cellValue){
        let arr = cellValue.split(';');
        for(let i = 0 ; i < arr.length - 1 ; i++){
            let mrNo = "MR"+arr[i].substring(1,arr[i].length);
            ele += '<span id="mrno'+ cellValue +'" onclick="viewMR(\''+arr[i] +'\')"  style="cursor: pointer;color: #f60; ">' + mrNo + '&nbsp &nbsp'+'</span>';
        }
    }else{
        // 如果没有MR就显示MRP
        ele = `<a onclick="viewMRP('${rowObj.cardId}','${rowObj.cardNo}')" href="javascript:;" style="cursor: pointer;color: #f60; ">查看MRP</a>`;
    }
    return ele;
}
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
function formateditDefect(cellvalue, options, rowObject) {
    var ele = '<div style="padding-left:8px" id="rowData_' + rowObject.id
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="延期" >' +
        '<span class="ui-icon ui-icon-pencil"></span></div>';

    $('#rowData_' + rowObject.id).die().live("click", function (e) {
        e.stopPropagation();//加入阻止冒泡
        choose_yanqi(rowObject, rowObject.acEng, options.gid, 'refresh');
    });
    return ele;
}

function choose_yanqi(obj) {
    $.ajax({
        type: "GET",
        url: "/api/v1/nrc/delay/get_delay_by_nrc_id?nrcId=" + obj.cardId,
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

        }
    });


}

function formatAssignDefect(cellvalue, options, rowObject) {

    var assignDiv = '<div style="padding-left:8px" id="assign_' + rowObject.id
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="下发" >' +
        '<span class="ui-icon ui-icon-gear"></span></div>';

    $('#assign_' + rowObject.id).die().live("click", function (e) {
        e.stopPropagation();//加入阻止冒泡
        choose_xiafa(rowObject, rowObject.acEng, options.gid, 'refresh');
    });
    return assignDiv;
}

function choose_xiafa(obj, ac) {
        $.chooseFlight({
            filter: {
                ac: ac,
                type: "xiafa"
            },
            success: function (data) {
                var isOverdue;
                $.ajax({
                    type:"POST",
                    url:"/api/v1/plugins/TASK_OVERDUE_CHECK?workType="+obj.cardType+"&cardNumber="+obj.cardNo+"&parentId="+data.CURRENT_TASK_ID+"&jobDate="+data.FLIGHT_DATE,
                    contentType: "application/json;charset=utf-8",
                    dataType: "json",
                    success: function (isOverdueData) {
                        if (isOverdueData.code === 200) {
                            isOverdue = isOverdueData.data;
                            if(isOverdue != "" && isOverdue){
                                MsgPromptOverdue({
                                    msg: "工作建议！",
                                    yesFunc: function (r,c) {
                                        if ($.trim(r) == '') {
                                            MsgAlert({content: "请输入工作建议!", type: 'error', PWindow: window});
                                            return false;
                                        };
                                        if ($.trim(c) == '') {
                                            MsgAlert({content: "请输入超期原因!", type: 'error', PWindow: window});
                                            return false;
                                        };
                                        xiafaPost(data,obj,r,c);
                                    }
                                });
                            }else {
                                MsgPrompt({
                                    msg: "工作建议！",
                                    yesFunc: function (r) {
                                        if ($.trim(r) == '') {
                                            MsgAlert({content: "请输入工作建议!", type: 'error', PWindow: window});
                                            return false;
                                        };
                                        xiafaPost(data,obj,r);
                                    }
                                });
                            };
                        }  else {
                            window.alert(data.msg);
                        };
                    },
                    error: function () {
                        window.alert("超期判断请求失败！");
                    }
                });
            }
        })
}

//下发请求
function xiafaPost(data,obj,r,c){
    if(!!data && !!obj){
        var postParam = {
                "acId": data.ACID,
                "acReg": obj.acEng,
                "cardId": obj.cardId,
                "cardNumber": obj.cardNo,
                "flightId": data.FLIGHT_ID,
                "flightNo": data.FLIGHT_NO,
                // "id": obj.id,
                "jobDate": data.FLIGHT_DATE,
                "model": data.MODEL,
                "parentId": data.CURRENT_TASK_ID,
                "station": data.STATION,
                "type": data.CHECK_TYPE,
                "workType": obj.cardType,
                "mccWorkSuggestion": r
            };
        if(!!c){
            postParam.allowOverdueReason = c;
        };
        $.ajax({
            type: "POST",
            url: "/api/v1/nrc/monitor/add_nrc_work_task",
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(postParam),
            dataType: "json",
            success: function (data) {
                if (data.code === 200) {
                    window.alert("下发成功！");
                } else if (data.msgData && data.msgData[0]) {
                    window.alert(data.msgData[0]);
                } else {
                    window.alert(data.msg);
                }
            },
            error: function () {
                window.alert("删除失败！");
            }
        });
    }
}

//已超期弹框
function MsgPromptOverdue(opts) {
    var time_ = new Date().getTime();
    var win_key_ = 'win_0_' + time_;
    opts = $.extend({}, {
        title: "提示",
        msg: "请输入内容:",
        content: '<textarea class="messager-input" name="centent" style="height: 80px;" type="text"></textarea>',
        reason:'<textarea class="messager-input" name="reason" style="height: 80px;" type="text"></textarea>',
        yes: function () {
            var r = $("#" + win_key_).find("textarea[name=centent]").val();
            var c = $("#" + win_key_).find("textarea[name=reason]").val();
            var isClose_ = true;
            if (opts.yesFunc) {
                isClose_ = opts.yesFunc(r,c);
                isClose_ = isClose_ == undefined ? true : false;

            }
            if (isClose_) {
                $("#" + win_key_).window('destroy');
            }
        },
        no: function () {
            var r = $("#" + win_key_).find("textarea[name=centent]").val();
            var c = $("#" + win_key_).find("textarea[name=reason]").val();
            var isClose_ = true;
            if (opts.noFunc) {
                isClose_ = opts.noFunc(r,c);
                isClose_ = isClose_ == undefined ? true : false;
            }
            if (isClose_) {
                $("#" + win_key_).window('destroy');
            }
        }
    }, opts);
    var h = '<div class="messager-body panel-body panel-body-noborder window-body" title="" style="min-height: 36px;">'
        + '<div style="font-weight: bold;">' + opts.msg + '</div><br><div style="clear:both;"></div><div>' + opts.content
        + '</div><br><div style="clear:both;"></div><div style="font-weight: bold;color:red;">'+ "超期下发原因说明(必填)" + '</div><br><div style="clear:both;"></div>'+ opts.reason +'</div>'
        //下面是取消和确定的内容
        + '<div style="padding: 5px; text-align: center;">' +
        '<a href="javascript:void(0);" id="_yes" class="easyui-linkbutton" icon="icon-ok">确定</a> ' +
        '&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<a href="javascript:void(0);" id="_no" class="easyui-linkbutton"' +
        ' icon="icon-cancel">取消</a>' +
        '</div>';

    $("<div id='" + win_key_ + "' />").window({
        width: opts.width || 380,
        height: opts.height || 380,
        minimizable: opts.minimizable || false,
        maximizable: opts.maximizable || false,
        modal: opts.modal ? opts.modal : true,
        title: opts.title,
        content: h,
        onClose: function () {
            $("#" + win_key_).window('destroy');
        }
    });
    $("#" + win_key_).find("#_yes").bind("click", function () {
        opts.yes()
    });
    $("#" + win_key_).find("#_no").bind("click", function () {
        opts.no()
    });
}

function viewNrc(event) {
    if (event.cardType == "NRC") {
        if ($(window).width() < 1100) {
            var curWidth = ($(window).width()).toString();
            var curheight = $(window).height().toString();
        } else {
            var curWidth = ($(window).width() * 0.6).toString();
            var curheight = $(window).height().toString();
        }

        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {nrcid: event.cardId, unCurAssignee: "see"},
            url: "/views/nrc/see_nrc.shtml"
        });

    } else if (event.cardType == "NRCTASK") {
        var curWidth = ($(window).width() * 0.6).toString();
        var curheight = ($(window).height() * 0.6).toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {

                taskid: event.cardId,
                type: "view"
            },
            url: "/views/nrc/task_revision.shtml"
        });
    }

}

function dateTimeFormatter(cellvalue) {
    return cellvalue
}

function dateTimeFormatter1(cellvalue) {
    return cellvalue
}

function dateTimeFormatter2(cellvalue) {
    return cellvalue
}

function dateTimeFormatter3(cellvalue) {
    return cellvalue
}

function dateTimeFormatter4(cellvalue) {
    return cellvalue
}

function convertToTime(time) {
    if (time == null || time == "") {
        return "";
    }
    var hour = parseInt(time / 60);
    var minute = time % 60;

    minute = Math.abs(minute);
    if (minute < 10) {
        minute = "0" + minute;
    }

    return hour + ":" + minute;
}

function export_self(ops, parent) {
    if (!dynamicExportMVC) {
        return false;
    }
    parent = parent || $(this).parent();
    ops = $.extend(true, {}, {
        sfaQuery: $(document).sfaQuery(),
        container: parent,
        fileName: 'NRC_UN_FYL.xls',//导出文件命名
        url: "/api/v1/nrc/monitor/export_list"//后端提供的接口
    }, ops);
    dynamicExportMVC(ops);
}
