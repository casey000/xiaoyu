//基础数据 ifrom 数据
var baseFfromData = [
    {
        'nameZh': '来源文件',
        'nameEN': 'emEoApp0',
        'url': 'list/eoSourceFileList.shtml',
        'functionCode': 'EM_EO_SOURCE_FILE_LIST',
        'delFunctionCode': 'EM_EO_SOURCE_FILE_DEL',
        'addUrl': '../add/EmEoSourceFileEdit.shtml',
        'addBidden': true,
        'addBiddenMsg': "评估单产生的EA不可新增"
    },
    {
        'nameZh': '适用性',
        "edit": true,
        'nameEN': 'emEoApp1',
        'url': 'list/eoAppList.shtml',
        'functionCode': 'EM_EO_APP_GROUP_LIST',
        'delFunctionCode': 'EM_EO_GROUP_DEL',
        'addUrl': '../edit/eoApplicGroup.shtml',
        'delAll': 'ALL',
        'delAllfunctionCode': 'EM_EO_APP_GROUP_LIST_DELALL',
        'msg': "清除所有该EA所有的适用性数据",
        "switch": {}
    },
    {
        'nameZh': '时限要求',
        'nameEN': 'emEoApp2',
        'url': 'list/eoEdiTlList.shtml',
        'functionCode': 'EM_EO_TLIMIT_GROUP_LIST',
        'delFunctionCode': 'EM_EO_TLIMIT_GROUP_DEL',
        'addUrl': '../edit/eoEditTl.shtml',
        'checkboxs': [
            {
                'nameZh': '是否触发类:',
                'nameEN': 'ifSpark',
                'delAllfunctionCode': 'EM_EO_TLIMIT_GROUP_DELALL',
                'msg': "清除所有该EA所有的时限要求数据"

            }
        ],
        'delAll': 'ALL',
        'delAllfunctionCode': 'EM_EO_TLIMIT_GROUP_DELALL',
        'msg': "清除所有该EA所有的时限要求数据"

    },
    /*{
        'nameZh': '与其他EA关系：',
        'nameEN': 'emEoApp3',
        'url': 'list/p1.shtml',
        'functionCode': 'EM_EA_RELATE_LIST',
        'delFunctionCode': 'EM_EO_RELATE_DEL',
        'alter': [
            {
                'pageData': "EM_EO_NEXUS",
                'field': "RELATE_TYPE"
            }
        ],
        'addUrl': '../sub/EmEaRelateEdit.shtml'
    },*/
    {
        'nameZh': '执行方式',
        'nameEN': 'emEoApp4',
        'url': 'list/eoCjList.shtml',
        'functionCode': 'EM_EO_JC_RELATE_LIST',
        'delFunctionCode': 'EM_EO_JC_RELATE_DEL',
        'addUrl': '../sub/EmEoJcRelateList.shtml',
        'addNrcUrl': '../sub/EmEoJcRelateNrcList.shtml',
        'alter': [
            {
                'pageData': "TD_JC_STATUS",
                'field': "STATUS"
            }
        ]

    },
    {
        'nameZh': '航材列表',
        'nameEN': 'emEoApp5',
        'url': 'list/p1.shtml',
        'edit' : true,
        'functionCode': 'EM_EO_MATERIAL_TOOL_LIST',
        'delFunctionCode': 'EM_EO_MATERIAL_TOOL_DEL',
        'appFunctionCode': "EM_EO_MATERIAL_TOOL_APP_ADD",
        'appList': "EM_EO_MATERIAL_TOOL_APP_LIST",
        'alter': [{
            'pageData': "TD_JC_MATER_SORT",
            'field': "MT_TYPE"
        },
            {
                'pageData': "QUANTITY_IF_DEMAND",
                'field': "WORK_DEPENDS"
            },
            {
                'pageData': "EM_EO_MATERIAL_TOOL",
                'field': "mt_type"
            },
            {
                'pageData': "QUANTITY_IF_DEMAND",
                'field': "QTY_DEMAND"
            }

        ],
        'addUrl': '../sub/EmEoMaterialToolEdit.shtml'

    },
    {
        'nameZh': '工时信息',
        'nameEN': 'emEoApp26',
        'url': 'list/p1.shtml',
        'functionCode': 'EM_EO_MAN_HOUR_LIST',
        'delFunctionCode': 'EM_EO_MAN_HOUR_DEL',
        'appFunctionCode': "EM_EO_MH_APP_GROUP_ADD",
        'appList': "EM_EO_MH_APP_GROUP_LIST",
        'addUrl': '../sub/EmEoManHourEdit.shtml',
        'edit' : true

    }
];
//更改数据 ifrom 数据
var UpdateIfromData = [
    {
        'nameZh': '载重平衡变化量',
        'nameEN': 'emEoApp6',
        'url': 'list/p1.shtml',
        'functionCode': 'EM_EO_WEIGHT_BALANCE_LIST',
        'delFunctionCode': 'EM_EO_WEIGHT_BALANCE_DEL',
        'addUrl': '../sub/EmEoWeightBalanceEdit.shtml',
        'appFunctionCode': "EM_EO_WEIGHT_BALANCE_APP_ADD",
        'appList': "EM_EO_WEIGHT_BALANCE_APP_LIST",
        'dropIf': [
            {
                'nameZh': '是否影响重量平衡:',
                'nameEN': 'ifWeightBalancing',
                'addBidden': true,
                'delAllfunctionCode': 'EM_EO_WEIGHT_BALANCE_DELALL',
                'msg': "清除所有该EA所有的影响重量平衡数据"

            }
        ],
        'delAll': 'APL',
        'delAllfunctionCode': 'EM_EO_WEIGHT_BALANCE_DELALL',
        'msg': "清除所有该EA所有的影响重量平衡数据",
        'addBidden': true,
        'addBiddenMsg': "仅机身 才能添加",
        'edit' : true,
    }
];
let goNames = [{
    'nameZh': '来源文件',
    'nameEN': 'emEoApp0'
}, {
    'nameZh': '适用性',
    'nameEN': 'emEoApp1'
}, {
    'nameZh': '时限要求',
    'nameEN': 'emEoApp2'
}, {
    'nameZh': 'EAJC',
    'nameEN': 'emEoApp4'
}, {
    'nameZh': '数据变更',
    'nameEN': 'ps1'
},
];

/**
 * 添加 Ifrom
 */
function IntIfrom() {
    let wpkid = param.pkid;
    if (wpkid == "") {
        wpkid = "-1";
    }

    //基础数据 ifrom 和ifrom定位
    for (let i = 0; i < baseFfromData.length; i++) {
        baseFfromData[i]['pkid'] = wpkid;//applType
        baseFfromData[i]['applyType'] = $("#applyType").combobox("getValue");
        baseFfromData[i]['applyModel'] = $("#applyModel").combobox("getValue");
        baseFfromData[i]['ifEvaProduce'] = $('#ifEvaProduce').val(); //是否评估产生
        baseFfromData[i]['evalApplyType'] = $('#evalApplyType').val(); //评估适用类型
        baseFfromData[i]['eoNo'] = $('#eoNo').textbox('getValue');
        baseFfromData[i]['jobCategory'] = param.jobCategory;
        if(i != 4){
            $("#emEoAppDiv").before(`
         <iframe  src="  ${baseFfromData[i].url}" id="${baseFfromData[i].nameEN}Div" data-id="${baseFfromData[i].nameEN}Div"" name="${baseFfromData[i].nameEN}Div" frameborder="0"   width="200" height="200" scrolling="no"  style="width: 100%;height:230px;"></iframe>
        `);
        }else{
            $("#emEoAppDiv").before(`
         <iframe  src="  ${baseFfromData[i].url}" id="${baseFfromData[i].nameEN}Div" data-id="${baseFfromData[i].nameEN}Div"" name="${baseFfromData[i].nameEN}Div" frameborder="0"   width="200" height="200" scrolling="no"  style="width: 100%;height:420px;"></iframe>
        `);
        }

        let iframeo = window.frames[baseFfromData[i].nameEN + "Div"];
        iframeo.iparam = baseFfromData[i];
        iframeo.iparam ['operation'] = param.operation;
    }
    //更改数据 ifrom 和ifrom定位
    for (let i = 0; i < UpdateIfromData.length; i++) {
        UpdateIfromData[i]['pkid'] = wpkid;
        UpdateIfromData[i]['applyType'] = $("#applyType").combobox("getValue");
        UpdateIfromData[i]['applyModel'] = $("#applyModel").combobox("getValue");
        $("#eoUpdateDiv").before(`
         <iframe  src="${UpdateIfromData[i].url}" id="${UpdateIfromData[i].nameEN}Div" data-id="${UpdateIfromData[i].nameEN}Div"" name="${UpdateIfromData[i].nameEN}Div"  frameborder="0"  scrolling="no"   style="width: 100%;height:230px;"></iframe>
        `);
        let iframeo = window.frames[UpdateIfromData[i].nameEN + "Div"];
        iframeo.iparam = UpdateIfromData[i];
        iframeo.iparam ['operation'] = param.operation;
    }

    for (let i = 0; i < goNames.length; i++) {
        addgotoFunc(goNames[i]);
    }
}

//控制子页面的控件
function setEoPkid() {
    for (let i = 0; i < baseFfromData.length; i++) {
        let iframeo = window.frames[baseFfromData[i].nameEN + "Div"];
        //iframeo.iparam ['pkid'] = param.pkid;
        if(!param.pkid){
            iframeo.iparam ['pkid'] = $('#pkid').val();
        }else{
            iframeo.iparam ['pkid'] = param.pkid;
        }
        iframeo.iparam ['operation'] = param.operation;
        iframeo.iparam ['applyType'] = $("#applyType").combobox("getValue");
        iframeo.iparam ['applyModel'] = $("#applyModel").combobox("getValue");
        iframeo.iparam ['eoNo'] = $("#eoNo").textbox("getValue");
        iframeo.iparam ['jobCategory'] = $('#jobCategory').combobox('getValue');
        // iframeo. switchApplyType(ifDelAll);

    }
    //更改数据 ifrom 和ifrom定位
    for (let i = 0; i < UpdateIfromData.length; i++) {
        let iframeo = window.frames[UpdateIfromData[i].nameEN + "Div"];
        //iframeo.iparam ['pkid'] = param.pkid;
        if(!param.pkid){
            iframeo.iparam ['pkid'] = $('#pkid').val();
        }else{
            iframeo.iparam ['pkid'] = param.pkid;
        }
        iframeo.iparam ['operation'] = param.operation;
        iframeo.iparam ['applyType'] = $("#applyType").combobox("getValue");
        iframeo.iparam ['applyModel'] = $("#applyModel").combobox("getValue");
        iframeo.iparam ['eoNo'] = $("#eoNo").textbox("getValue");

        //  iframeo.switchApplyType(ifDelAll);
    }


    let apply = $("#applyType").combobox("getValue");
    if (apply == "APL") { //机身
        let iframe6 = window.frames["emEoApp6" + "Div"];
        iframe6.iparam ['addBidden'] = false;
    }

    let ifEvaProduce = $('#ifEvaProduce').val(); //是否评估产生
    if(ifEvaProduce == 'N' || (ifEvaProduce == 'Y' && param.evalApplyType == 0)){ //评估单产生的EO来源文件不可新增
        let iframe11 = window.frames["emEoApp0" + "Div"]
        iframe11.iparam['addBidden'] = false;
    }

}

function setSubData(data) {
    for (let i = 0; i < baseFfromData.length; i++) {
        let iframeo = window.frames[baseFfromData[i].nameEN + "Div"];
        iframeo.setSubData(data);
    }
    //更改数据 ifrom 和ifrom定位
    for (let i = 0; i < UpdateIfromData.length; i++) {
        let iframeo = window.frames[UpdateIfromData[i].nameEN + "Div"];
        iframeo.setSubData(data);
    }


}


/*
添加定位
 */
function addgotoFunc(obj) {
    let htmlstr = `
         <div class="menu-sep"></div>
        <div class="menu-item" style="height: 20px;"onclick="goToFunc('${obj.nameEN}Div')" data-id="${obj.nameEN}Div" ><div class="menu-text" style="height: 20px; line-height: 20px;">${obj.nameZh}</div></div>
     `;
    $("#mm1").append(htmlstr);
    $(".menu-item").click(function () {
        let name = this.getAttribute("data-id");
        goToFunc(name)
    })

}

//跳转到 固定位置
function goToFunc(id) {
    window.location.hash = "#" + id;
    window.location.hash = "." + id;
}

