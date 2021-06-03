
$(function () {

    let editAuth = VALID_AUTH("V_COMP_CC_EDIT");//设置编辑权限配置，V_COMP_CC_EDIT需要在系统配置里添加权限
    let delAuth = VALID_AUTH("V_COMP_CC_DEL");//设置删除权限配置，V_COMP_CC_DEL需要在系统配置里添加权限
    let addAuth = VALID_AUTH("V_COMP_CC_ADD");//设置删除权限配置，V_COMP_CC_ADD需要在系统配置里添加权限
    var options = {
        view: "V_COMP_CC",
        // 初始化查询参数
        defaultParam: {
            'qname': [],
            'qoperator': [],
            'qvalue': []
        },
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
                        if(!editAuth){
                            return "";
                        }
                        if(rowObj.middleStatus == 'W' ||  rowObj.status == 'y'){
                            return '';
                        }
                        var ele = '<div id="rowData_' + rowObj.id + '"  class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-edit z_bianji" title="Edit"></div>';
                        $('#rowData_' + rowObj.id).die().live('click', function () {
                            cc_edit(rowObj.id, rowObj)
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
                        if(!delAuth){
                            return "";
                        }
                        if(rowObj.middleStatus == 'W' || rowObj.status == 'y'){
                            return '';
                        }
                        var ele = '<div id="delete_ner' + rowObj.id + '"  class="uui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-Empty z_shanchu" title="delete"></div>';
                        $('#delete_ner' + rowObj.id).die().live('click', function () {
                            cc_delete(rowObj.id, rowObj);
                        });
                        return ele;

                    }
                },
                "ccNo":{
                    name: 'ccNo',
                    formatter: function (cellValue, options, rowObj) {
                        if (rowObj.ccNo == null) {
                            return "<span>null</span>";
                        } else {
                            var ele = '<span id="nrcno_' + rowObj.id + '" title="' + rowObj.ccNo + '" style="cursor: pointer;color: #f60; ">' + rowObj.ccNo + '</span>';
                            $('#nrcno_' + rowObj.id).die().live('click', function () {
                                   cc_sse(rowObj.id, rowObj);
                            });
                            return ele;
                        }
                    }
                },
                "docNo":{
                    formatter: function (cellValue, options, rowObj) {
                        cellValue =cellValue ||'';
                        //来源文件类型,
                        if (cellValue ) {
                            let docType = {1: 'TLB', 2: 'NRC', 3: 'CC', 4: 'EO', 5: 'JC', 6: 'Defect', 7: 'PCO', 8: 'NRCT', 9: 'TO', 10: 'DDREVIEW', 11: 'CCO'};
                            if(!rowObj.docType){
                                return "[ ]:"+cellValue;
                            }
                                return "["+docType[rowObj.docType]+"]:"+cellValue;
                        }

                        return cellValue;
                    }
                }

            },
            jqGridSettings: {
                height: 500,
                multiselect: true
            },

            optsFirst: true,
            optsCols: optsCols,
        },
    };

    $(document).sfaQuery(options);

    $('#batch_update_exec_date').click(function () {
        var curWidth = ($(window).width() * 0.85).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {defect_info:{}, type:"add"},
            url: "/views/defect/new_addcc.shtml",
        });
    });

    function addAuthControl(){
        if(addAuth){
            $("#batch_update_exec_date").show();
        }
    };
    addAuthControl();

    function cc_edit(id,obj) {
        var curWidth = ($(window).width() * 0.85).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {id:id,type:"edit",defect_info:{}},
            url: "/views/defect/new_addcc.shtml",
        });
    }


    function cc_sse(id,obj) {
        var curWidth = ($(window).width() * 0.85).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {id:id,type:"see",defect_info:{}},
            url: "/views/defect/new_addcc.shtml",
        });
    }

    function cc_delete(id,obj) {
        if (confirm("确定删除吗")) {
            $.ajax({
                type: "GET",
                url: "/api/v1/compCc/delete/" + id,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if(data.code==200){
                        alert("删除成功！");
                        Refresh();
                    }else {
                        alert(data.msg);
                    }
                },
                error: function () {
                    window.alert("失败！");
                }
            });
        }
    }

});
function Refresh() {
    $(".qc_btn_srh").click();
}
