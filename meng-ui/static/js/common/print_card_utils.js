/*
 * Copyright 2019 SF Airlines Co., Ltd. All rights reserved.
 * 本文件仅限于顺丰航空有限公司内部传阅，禁止外泄以及用于其他的商业目的。
 */

/**
 * Created by yy on 2019-6-29
 *  工卡预览工具类
 *  已支持：JC 类型工卡预览
 *          TO 类型工卡预览
 */
let paramTips = {
    tips: '此工卡仅供参考，无条形码签署无效',
};
let PDF_CARD_TYPE = {
    'NRC': 1,
    'NRCT': 1,
    'TO': 1,
    'JC': 1,
    'PCO': 1,
    'Fixed': 1,
    'CCO': 1,
};
/**
 *
 * @param  ops ：{cardId, workType,wkId,tips}
 */
function preView_Pdf(ops) {
    if (!ops || !ops.workType || !ops.wkId) {
        $.messager.alert('提示','预览的工卡信息不能为空.');
        console.log(ops);
        return false;
    }
    ops = $.extend({}, ops, paramTips);

    ops.acId = (ops.acId == null||ops.acId == 'null')?'': ops.acId;//离位发动机打印时acId为空

    $.messager.confirm('提示', ops.tips, function (r) {
        let _type = ops.workType
        debugger
        if (r) {
            if (PDF_CARD_TYPE[_type]) {
                var paramCardId = ops.cardId != 'null' ? ops.cardId : '';
                let workOrderId = ops.wkId; // for test
                let url = '';
                switch (ops.workType) {
                    case "NRC":
                        url = "/api/v1/station_task/staNrcPrint";
                        break;
                    case "JC":
                    case "Fixed":
                        url = "/api/v1/station_task/staJcPrint";
                        break;
                    case "TO":
                        url = "/api/v1/station_task/staToPrint";
                        break;
                    case "NRCT":
                        url = "/api/v1/station_task/staNrctPrint";
                        break;
                    case "PCO":
                        url = "/api/v1/station_task/staPcoPrint";
                        break;
                    case "CCO":
                        url = "/api/v1/station_task/staCcoPrint";
                        break;
                    default:
                        return;
                }
                let con = "<form id='_jcpre_rm' method='GET' action='" + url + "'>" +
                    "<input class=\"beiliao cardId\" value=\"" + paramCardId + "\"  type=\"text\" name=\"cardId\" >" +
                    "<input class=\"beiliao\" value=\"" + workOrderId + "\"  type=\"text\" name=\"workOrderId\" >" +
                    "<input class=\"beiliao\" value='PREVIEW'  type=\"text\" name=\"type\" >" +
                    "</form>";
                $("body").append(con);
                if (ops.workType == "JC"||ops.workType == "Fixed" ) {
                    let acId = ops.acId;
                    let jcCon = "<input class=\"beiliao\" value=\"" + acId + "\"  type=\"text\" name=\"acId\" >";
                    $("#_jcpre_rm").append(jcCon);
                } else if (ops.workType == "PCO") {
                    let sapId = ops.sapId || '';
                    let jcCon = "<input class=\"beiliao\" value=\"" + sapId + "\"  type=\"text\" name=\"sapTaskId\" >";
                    $("#_jcpre_rm").append(jcCon);
                }
                $("#_jcpre_rm").submit();
                $("#_jcpre_rm").remove();

                // 数据函数
                ops.back && ops.back.call({id: ops.cardId});

            } else {
                MsgAlert({content: "暂不支持该类型", type: 'error'});
            }
        }
    });
}

/**
 * Created by yy on 2019-6-29
 *  工卡打印工具类
 *  已支持：JC 类型工卡
 *          TO 类型工卡
 *          NRC 类型工卡
 */
let PRINT_CARD_TYPE = {
    'NRC': 1,
    'NRCT': 1,
    'TO': 1,
    'JC': 1,
    'PCO': 1,
    'Fixed': 1,
    'CCO': 1,
};

/**
 *
 * @param  ops ：{id,type,wkId,tips}
 */
function printCardPdf(ops) {
    // event && event.stopPropagation();    //  阻止事件冒泡
    // 数据函数
    if(ops.type != 'Fixed'){

        if(ops.type != 'CCO'){
            if (!ops || !ops.id || !ops.type) {
                $.messager.alert('预览的工卡信息不能为空.');
                console.log(ops);
                return false;
            }
        }else{
            if (!ops || !ops.type) {
                $.messager.alert('预览的工卡信息不能为空.');
                console.log(ops);
                return false;
            }
        }

    }

    let _type = ops.type;
    if (!PRINT_CARD_TYPE[_type]) {
        MsgAlert({content: '暂不支持该类型', type: 'error'});
        return false;
    }

    ops.acId = (ops.acId == null||ops.acId == 'null')?'': ops.acId;//离位发动机打印时acId为空

    if (_type == "NRC") {
        let nrcId = ops.id;
        let workOrderId = ops.wkId;
        let url = "/api/v1/station_task/staNrcPrint";
        // let con = "<form id='_f0_rm' method='GET' action='" + url + "'>" +
        //     "<input class=\"beiliao\" value=\"" + nrcId + "\"  type=\"text\" name=\"nrcId\" >" +
        //     "</form>";
        let con = "<form id='_f0_rm' method='GET' action='" + url + "'>" +
            "<input class=\"beiliao\" value=\"" + nrcId + "\"  type=\"text\" name=\"cardId\" >" +
            "<input class=\"beiliao\" value=\"" + workOrderId + "\"  type=\"text\" name=\"workOrderId\" >" +
            "<input class=\"beiliao\" value='PRINT'  type=\"text\" name=\"type\" >" +
            "</form>";
        $("body").append(con);
        $("#_f0_rm").submit();
        $("#_f0_rm").remove();

    }else if (_type == "NRCT") {
        let nrcId = ops.id;
        let workOrderId = ops.wkId;
        let url = "/api/v1/station_task/staNrctPrint";
        // let con = "<form id='_f0_rm' method='GET' action='" + url + "'>" +
        //     "<input class=\"beiliao\" value=\"" + nrcId + "\"  type=\"text\" name=\"nrcTaskId\" >" +
        //     "</form>";
        let con = "<form id='_f0_rm' method='GET' action='" + url + "'>" +
            "<input class=\"beiliao\" value=\"" + nrcId + "\"  type=\"text\" name=\"cardId\" >" +
            "<input class=\"beiliao\" value=\"" + workOrderId + "\"  type=\"text\" name=\"workOrderId\" >" +
            "<input class=\"beiliao\" value='PRINT'  type=\"text\" name=\"type\" >" +
            "</form>";
        $("body").append(con);
        $("#_f0_rm").submit();
        $("#_f0_rm").remove();

    }
    else if (_type == "TO" || _type == "JC" || _type == "Fixed"|| _type == "CCO") {
        let cardId = ops.id;
        let workOrderId = ops.wkId;
        let url = "/api/v1/station_task/staToPrint";
        if(_type == "CCO"){
            url="/api/v1/station_task/staCcoPrint";
        }
        if (_type == "JC" || _type == "Fixed") {
            url = "/api/v1/station_task/staJcPrint";
        }
        let con = "<form id='_topri_rm' method='GET' action='" + url + "'>" +
            "<input class=\"beiliao cardId\" value=\"" + cardId + "\"  type=\"text\" name=\"cardId\" >" +
            "<input class=\"beiliao\" value=\"" + workOrderId + "\"  type=\"text\" name=\"workOrderId\" >" +
            "<input class=\"beiliao\" value='PRINT'  type=\"text\" name=\"type\" >" +
            "</form>";
        if (_type == "JC"|| _type == "Fixed"||_type == "CCO") {
            let acId = ops.acId;
            let jcCon = "<input class=\"beiliao\" value=\"" + acId + "\"  type=\"text\" name=\"acId\" >";
            $("body").append(con);
            $("#_topri_rm").append(jcCon);
        } else {
            $("body").append(con);
        }

        $("#_topri_rm").submit();
        $("#_topri_rm").remove();

    }
    else if (_type == "PCO") {
        let workOrderId = ops.wkId;
        let sapTaskId = ops.sapId || '';
        let url = "/api/v1/station_task/staPcoPrint";
        let con = "<form id='_topri_rm' method='GET' action='" + url + "'>" +
            "<input class=\"beiliao\" value=\"" + workOrderId + "\"  type=\"text\" name=\"workOrderId\" >" +
            "<input class=\"beiliao\" value=\"" + sapTaskId + "\"  type=\"text\" name=\"sapTaskId\" >" +
            "<input class=\"beiliao\" value='PRINT'  type=\"text\" name=\"type\" >" +
            "</form>";
        $("body").append(con);
        $("#_topri_rm").submit();
        $("#_topri_rm").remove();

    }
    else {
        return MsgAlert({content: '暂不支持该类型', type: 'error'});
    }
    ops.back && ops.back.call(ops);
}