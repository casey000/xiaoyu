
$(function () {

    var options = {
        view: "V_CANCEL_STOCK",
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
                        if(rowObj.cancelStockStatus == '' ||  rowObj.cancelStockStatus == null){

                            var ele = '<div id="rowData_' + rowObj.id + '"  class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-edit z_bianji" title="Edit"></div>';
                            $('#rowData_' + rowObj.id).die().live('click', function () {
                                if(!!rowObj.ccNo){
                                    cc_edit(rowObj.id, rowObj)

                                }else {
                                    hadSn_edit(rowObj.id, rowObj)
                                }

                            });
                            return ele;
                        }else {
                            return '';
                        }
                    }
                },
                'del': {
                    name: 'D',
                    colNameEn: 'D',
                    isOpts: true,
                    width: 25,
                    formatter: function (cellValue, options, rowObj) {
                        if(rowObj.cancelStockStatus == '' ||  rowObj.cancelStockStatus ==null){
                            var ele = '<div id="delete_ner' + rowObj.id + '"  class="uui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-Empty z_shanchu" title="Delete"></div>';
                            $('#delete_ner' + rowObj.id).die().live('click', function () {
                                cc_delete(rowObj.id);
                            });
                            return ele;
                        }else {
                            return '';
                        }
                    }
                },
                //MR编号
                "mrNo":{
                    name: 'mrNo',
                    width: 150,
                },
                //cc编号
                "ccNo":{
                    name: 'ccNo',
                    width: 150
                },
                //件号
                "pn":{
                    name: 'pn',
                    width: 150,
                },
                //序号
                "sn":{
                    name: 'sn',
                    width: 100,
                },
                //数量
                "qty":{
                    name: 'qty',
                    width: 50,
                    formatter:function(cellValue, options, rowObj){

                        if(rowObj.cancelStockType=="5"||rowObj.cancelStockType=="改装包退料"){
                            return "";
                        }else{
                            return rowObj.qty;
                        }
                    }

                },
                //单位
                "unit":{
                    name: 'unit',
                    width: 50,
                },
                //退库数
                "cancelStockQty":{
                    name: 'cancelStockQty',
                    width: 50,
                },
                //航材状态
                "airMaterialState":{
                    name: 'airMaterialState',
                    width: 100,
                    formatter: function (cellValue, options, rowObj) {
                        var airMaterialState ;
                        if (rowObj.airMaterialState =="USED" ) {
                            airMaterialState = "可用件";
                        }else if(rowObj.airMaterialState =="UNUSED"){
                            airMaterialState = "不可用件";
                        }else if(rowObj.airMaterialState =="WDISPOSE"){
                            airMaterialState = "待观察件";
                        }else {
                            airMaterialState = "";
                        }
                        return airMaterialState;
                    }
                },
                //退库类型
                "cancelStockType":{
                    name: 'cancelStockType',
                    width: 100,
                    formatter: function (cellValue, options, rowObj) {
                        var cancelStockType ;
                        if (rowObj.cancelStockType =="1" ) {
                            cancelStockType = "拆下件退料";
                        }else if(rowObj.cancelStockType =="2"){
                            cancelStockType = "领出未用退料";
                        }else if(rowObj.cancelStockType =="3"){
                            cancelStockType = "客改拆下退料";
                        }else if(rowObj.cancelStockType =="4"){
                            cancelStockType = "装机未用退料";
                        }else if(rowObj.cancelStockType =="5"){
                            cancelStockType = "改装包退料";
                        }else {
                            cancelStockType = "";
                        }
                        return cancelStockType;
                    }
                },
                //任务航站
                "fromStation":{
                    name: 'fromStation',
                    width: 100,
                },
                //目的航站
                "toStation":{
                    name: 'toStation',
                    width: 100,
                },
                //故障部件描述
                "description":{
                    name: 'description',
                    width: 100,
                },
                //运输方式
                "transport":{
                    name: 'transport',
                    width: 100,
                    formatter: function (cellValue, options, rowObj) {
                        var transport;
                        if(rowObj.transport=="1"){
                            transport="随机运输";
                        }else if(rowObj.transport=="2"){
                            transport="不随机运输";
                        }else {
                            transport="";
                        }
                        return transport;
                    }
                },
                //CC状态
                "ccStatus":{
                    name: 'ccStatus',
                    width: 100,
                },
                //退料单ID
                "cancelStockId":{
                    name: 'cancelStockId',
                    width: 150,
                    formatter: function (cellValue, options, rowObj) {
                        if (rowObj.cancelStockId == null) {
                            return "<span>null</span>";
                        } else {
                            var ele = '<span id="ccmrno_' + rowObj.id + '" title="' + rowObj.cancelStockId + '" style="cursor: pointer;color: #f60; ">' + rowObj.cancelStockId + '</span>';
                            $('#ccmrno_' + rowObj.id).die().live('click', function () {

                                if(!!rowObj.ccNo){
                                    cc_sse_sap(rowObj.id,rowObj)
                                }else {
                                    cc_sse(rowObj.id, rowObj);
                                }
                            });
                            return ele;
                        }
                    }
                },
                //来源文件类型
                "docType":{
                    name: 'docType',
                    width: 100,
                },
                //执行文件号
                "docNo":{
                    width: 100,
                    formatter: function (cellValue, options, rowObj) {
                        cellValue =cellValue ||'';
                        //来源文件类型,
                        if (cellValue ) {
                            let docType = {1: 'TLB', 2: 'NRC', 3: 'IMPORT', 4: 'EO', 5: 'JC', 6: 'Defect', 7: 'TO'};
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
    //进入领出未用退库，无序号拆下件退料
    function cc_edit(id,obj) {
        var curWidth = ($(window).width() * 0.9).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {id:id,type:"edit",defect_info:{}},
            url: "/views/cs/add_no_number_cc.shtml",
        });
    }
    //进入有序号拆下件退料
    function hadSn_edit(id,obj) {
        var curWidth = ($(window).width() * 0.9).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {id:id,type:"edit",defect_info:{}},
            url: "/views/cs/edit_withdrawal_application.shtml",
        });
    }

    function cc_sse(id,obj) {
        var curWidth = ($(window).width() * 0.9).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {id:id,type:"see",defect_info:{}},
            url: "/views/cs/view_withdrawal_application.shtml",
        });
    }
    function cc_sse_sap(id,obj) {
        var curWidth = ($(window).width() * 0.9).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {id:id,type:"see",defect_info:{}},
            url: "/views/cs/view_no_number_cc.shtml",
        });
    }

    function cc_delete(id) {
        if (confirm("确定删除吗")) {
            $.ajax({
                type: "GET",
                url: "/api/v1/cancelSock/delete/" + id,
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
