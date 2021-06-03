
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
        'addBiddenMsg': "评估单产生的EO不可新增"
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
        'msg': "清除所有该EO所有的适用性数据",
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
                'msg': "清除所有该EO所有的时限要求数据"

            }
        ],
        'delAll': 'ALL',
        'delAllfunctionCode': 'EM_EO_TLIMIT_GROUP_DELALL',
        'msg': "清除所有该EO所有的时限要求数据"

    },
    {
        'nameZh': '与其他EO关系：',
        'nameEN': 'emEoApp3',
        'url': 'list/p1.shtml',
        'functionCode': 'EM_EO_RELATE_LIST',
        'delFunctionCode': 'EM_EO_RELATE_DEL',
        'alter': [
            {
                'pageData': "EM_EO_NEXUS",
                'field': "RELATE_TYPE"
            }
        ],
        'addUrl': '../sub/EmEoRelateEdit.shtml'

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
        'nameZh': '拆下部件处理要求',
        'nameEN': 'emEoApp15',
        'url': 'list/removeReq.shtml',
        'functionCode': 'EM_EO_SOURCE_FILE_LIST',
        'delFunctionCode': 'EM_EO_SOURCE_FILE_DEL'
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
                'msg': "清除所有该EO所有的影响重量平衡数据"

            }
        ],
        'delAll': 'APL',
        'delAllfunctionCode': 'EM_EO_WEIGHT_BALANCE_DELALL',
        'msg': "清除所有该EO所有的影响重量平衡数据",
        'addBidden': true,
        'addBiddenMsg': "仅机身 才能添加",
        'edit' : true,
    },
    {
        'nameZh': '电气改装说明',
        'nameEN': 'emEoApp7',
        'url': 'list/eoELList.shtml',
        /*'functionCode': 'EM_EO_EL_INFO_LIST',
        'delFunctionCode': 'EM_EO_EL_INFO_DEL',
        'appFunctionCode': "EM_EO_EL_INFO_APP_ADD",
        'appList': "EM_EO_EL_INFO_APP_LIST",
        'addUrl': '../sub/EmEoElInfoEdit.shtml',
        'dropIf': [
            {
                'nameZh': '是否影响电气负载:',
                'nameEN': 'ifElectricalLoad',
                'addBidden': true,
                'delAllfunctionCode': 'EM_EO_EL_INFO_DELALL',
                'msg': "清除所有该EO所有的影响电气负载数据"
            }
        ],*/
        'alter': [
            {
                'pageData': "EM_EO_EL_DATA_SOURCE",
                'field': "SOURCE"
            }

        ],
        'addBidden': true,
        'addBiddenMsg': "仅机身 才能添加",
        'delAll': 'APL',
        'delAllfunctionCode': 'EM_EO_EL_INFO_DELALL',
        'msg': "清除所有该EO所有的影响电气负载数据",
        'ifElectricalLoad' : '请选中是否影响电气负载',
    },
    /*{
        'nameZh': '负载变化量',
        'nameEN': 'emEoApp8',
        'url': 'list/p1.shtml',
        'functionCode': 'EM_EO_EL_DATA_LIST',
        'delFunctionCode': 'EM_EO_EL_DATA_DEL',
        'appFunctionCode': "EM_EO_EL_DATA_APP_ADD",
        'appList': "EM_EO_EL_DATA_APP_LIST",
        'addUrl': '../sub/EmEoElDataEdit.shtml',
        'alter': [{
            'pageData': "EM_EO_EL_DATA_SOURCE",
            'field': "SOURCE"
        }],
        'addBidden': true,
        'addBiddenMsg': "仅机身 才能添加",
        'isNameZh' : '是否影响电气负载',
    },*/
    {
        'nameZh': '影响到的手册和工程文件',
        'nameEN': 'emEoApp9',
        'url': 'list/p1.shtml',
        'functionCode': 'EM_EO_MANUAL_FILE_LISTA',
        'delFunctionCode': 'EM_EO_MANUAL_FILE_DEL',
        'addUrl': '../sub/EmEoManualFileEdit.shtml',
        'alter': [{
            'pageData': "EM_EO_MANUAL_FILE_TYPE_V_ONE",
            'field': "MANUAL_TYPE"
        }],
        'dropIf': [
            {
                'nameZh': '是否影响手册和工程文件:',
                'nameEN': 'ifManualFile',
                'addBidden': true,
                'delAllfunctionCode': 'EM_EO_MANUAL_FILE_DELALL',
                'msg': "清除所有该EO所有的影响手册和工程文件数据"
            }
        ]
    },
    {
        'nameZh': '影响到的系统/发动机构型',
        'nameEN': 'emEoApp10',
        'url': 'list/p1.shtml',
        'functionCode': 'EM_EO_SYS_ENG_CONFIG_LIST',
        'delFunctionCode': 'EM_EO_SYS_ENG_CONFIG_DEL',
        'appFunctionCode': "EM_EO_SYS_ENG_CONFIG_APP_ADD",
        'appList': "EM_EO_SYS_ENG_CONFIG_APP_LIST",
        'addUrl': '../sub/EmEoSysEngConfigEdit.shtml',
        'dropIf': [
            {
                'nameZh': '是否影响系统构型:',
                'nameEN': 'ifSysConfig',
                'addBidden': true,
                'delAllfunctionCode': 'EM_EO_SYS_ENG_CONFIG_DELALL',
                'msg': "清除所有该EO所有的影响系统构型数据"
            }
        ],
        'addBidden': true,
        'addBiddenMsg': "部件类不支持",
        'edit' : true,
    },
    {
        'nameZh': '影响到的机载软件',
        'nameEN': 'emEoApp11',
        'url': 'list/p1.shtml',
        'functionCode': 'EM_EO_ONBOARD_APP_LIST',
        'delFunctionCode': 'EM_EO_ONBOARD_APP_DEL',
        'appFunctionCode': "EM_EO_ONBOARD_APP_APP_ADD",
        'appList': "EM_EO_ONBOARD_APP_APP_LIST",
        'addUrl': '../sub/EmEoOnboardAppEdit.shtml',
        'dropIf': [
            {
                'nameZh': '是否影响机载软件:',
                'nameEN': 'ifOnboardApp',
                'addBidden': true,
                'delAllfunctionCode': 'EM_EO_ONBOARD_APP_DELALL',
                'msg': "清除所有该EO所有的影响机载软件数据"
            }
        ],
        'addBidden': true,
        'addBiddenMsg': "部件、发动机类不支持",
        'edit' : true,
    },
    {
        'nameZh': '件号升级',
        'nameEN': 'emEoApp12',
        'url': 'list/p1.shtml',
        'functionCode': 'EM_EO_PN_UPGRADE_LIST',
        'delFunctionCode': 'EM_EO_PN_UPGRADE_DEL',
        'addUrl': '../sub/EmEoPnUpgradeEdit.shtml',
        'dropIf': [
            {
                'nameZh': '是否涉及件号升级:',
                'nameEN': 'ifPnUpgrade',
                'addBidden': true,
                'delAllfunctionCode': 'EM_EO_PN_UPGRADE_DELALL',
                'msg': "清除所有该EO所有的涉及件号数据"
            }
        ],
        'addBidden': true,
        'addBiddenMsg': "仅部件 才能添加",
        'delAll': 'PART',
        'delAllfunctionCode': 'EM_EO_PN_UPGRADE_DELALL',
        'msg': "清除所有该EO所有的涉及件号数据",
        'edit' : true
    },

    /*{
        'nameZh': '涉及送修送改要求',
        'nameEN': 'emEoApp14',
        'url': 'list/p1.shtml',
        "edit": true,
        'functionCode': 'EM_EO_PN_REPAIR_REQ_LIST',
        'delFunctionCode': 'EM_EO_PN_REPAIR_REQ_DEL',
        'addUrl': '../sub/EmEoPnRepairReqEdit.shtml',
        'dropIf': [
            {
                'nameZh': '是否涉及送修送改要求:',
                'nameEN': 'ifRepairReq',
                'addBidden': true,
                'delAllfunctionCode': 'EM_EO_PN_REPAIR_REQ_DELALL',
                'msg': "清除所有该EO所有的送修送改要求数据"
            }
        ],
        'TEST_UPLOAD': 'emEoPnRepairReq',
        'addBidden': true,
        'addBiddenMsg': "仅部件 才能添加",
        'delAll': 'PART',
        'delAllfunctionCode': 'EM_EO_PN_REPAIR_REQ_DELALL',
        'msg': "清除所有该EO所有的送修送改要求数据"
    }*/
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
        'nameZh': '涉及禁限装要求',
        'nameEN': 'emEoApp13',
        'url': 'list/p1.shtml',
        "edit": true,
        'functionCode': 'EM_EO_PN_FORBIDDEN_LIST',
        'delFunctionCode': 'EM_EO_PN_FORBIDDEN_DEL',
        'addUrl': '../sub/EmEoPnForbiddenEdit.shtml',
        /*'dropIf': [
            /!*{
                'nameZh': '紧急禁装:',
                'nameEN': 'urgentInterdictory'
            },*!/
            {
                'nameZh': '涉及禁限装要求:',
                'nameEN': 'ifInterdictoryReq',
                'addBidden': false,
                'delAllfunctionCode': 'EM_EO_PN_FORBIDDEN_DELALL',
                'msg': "清除所有该EO所有的禁限装要求数据"

            }
        ],*/
        'TEST_UPLOAD': 'emEoPnForbidden',
        'addBidden': false,
        'addBiddenMsg': "仅部件 才能添加",
        'delAll': 'PART',
        'delAllfunctionCode': 'EM_EO_PN_FORBIDDEN_DELALL',
        'msg': "清除所有该EO所有的禁限装要求数据"
    }
    /*{
        'nameZh': '驳回意见',
        'nameEN': 'emEoApp50',
        'url': 'list/returnReason.shtml'
    }
*/

];
let goNames = [{
    'nameZh': '符合性',
    'nameEN': 'complianceMeasure'
}, {
    'nameZh': '来源文件',
    'nameEN': 'emEoApp0'
}, {
    'nameZh': '适用性',
    'nameEN': 'emEoApp1'
}, {
    'nameZh': '时限要求',
    'nameEN': 'emEoApp2'
}, {
    'nameZh': 'EOJC',
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
    `       );
        }else{
            $("#emEoAppDiv").before(`
            <iframe  src="  ${baseFfromData[i].url}" id="${baseFfromData[i].nameEN}Div" data-id="${baseFfromData[i].nameEN}Div"" name="${baseFfromData[i].nameEN}Div" frameborder="0"   width="200" height="200" scrolling="no"  style="width: 100%;height:420px;"></iframe>
    `       );
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
        let applyType = $("#applyType").combobox("getValue");
        if(i == 1){
            $("#eoUpdateDiv").before(`
            <iframe  src="${UpdateIfromData[i].url}" id="${UpdateIfromData[i].nameEN}Div" data-id="${UpdateIfromData[i].nameEN}Div"" name="${UpdateIfromData[i].nameEN}Div"  frameborder="0"  scrolling="no"   style="width: 100%;height:430px;"></iframe>
            `);
        }else if(i==6){
            $("#eoUpdateDiv").before(`
            <iframe  src="${UpdateIfromData[i].url}" id="${UpdateIfromData[i].nameEN}Div" data-id="${UpdateIfromData[i].nameEN}Div"" name="${UpdateIfromData[i].nameEN}Div"  frameborder="0"  scrolling="no"   style="width: 100%;height:430px;"></iframe>
            `);
        }else {
            $("#eoUpdateDiv").before(`
            <iframe  src="${UpdateIfromData[i].url}" id="${UpdateIfromData[i].nameEN}Div" data-id="${UpdateIfromData[i].nameEN}Div"" name="${UpdateIfromData[i].nameEN}Div"  frameborder="0"  scrolling="no"   style="width: 100%;height:230px;"></iframe>
            `);
        }

        let iframeo = window.frames[UpdateIfromData[i].nameEN + "Div"];
        iframeo.iparam = UpdateIfromData[i];
        iframeo.iparam ['operation'] = param.operation;
    }
    if('add' == param.operation){
        $('#rejectReasonDiv').hide();
    }

    for (let i = 0; i < goNames.length; i++) {
        addgotoFunc(goNames[i]);
    }
}


//控制子页面的控件
function setEoPkid() {
    //let opportunityCheckFlag = $("#opportunityCheckFlag").combobox("getValue");

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
        //iframeo.iparam.opportunityCheckFlag = opportunityCheckFlag;
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
        //iframeo.iparam.opportunityCheckFlag = opportunityCheckFlag;
        //  iframeo.switchApplyType(ifDelAll);
    }

    let apply = $("#applyType").combobox("getValue");
    let ifEvaProduce = $('#ifEvaProduce').val(); //是否评估产生
    if (apply == "PART") { //部件
        let iframe2 = window.frames["emEoApp12" + "Div"];
        let iframe3 = window.frames["emEoApp13" + "Div"];
        //let iframe4 = window.frames["emEoApp14" + "Div"];

        iframe2.iparam ['addBidden'] = false;
        iframe3.iparam ['addBidden'] = false;
        //iframe4.iparam ['addBidden'] = false;
    }

    if (apply == "APL") { //机身
        let iframe8 = window.frames["emEoApp10" + "Div"];
        let iframe7 = window.frames["emEoApp7" + "Div"];
        let iframe6 = window.frames["emEoApp6" + "Div"];
        let iframe10 = window.frames["emEoApp11" + "Div"];

        iframe8.iparam ['addBidden'] = false;
        iframe7.iparam ['addBidden'] = false;
        iframe6.iparam ['addBidden'] = false;
        iframe10.iparam ['addBidden'] = false;
    }
    if(apply == 'ENG'){
        let iframe9 = window.frames["emEoApp10" + "Div"];
        iframe9.iparam ['addBidden'] = false;
    }

    //评估单产生的校验
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

//设置机会检清除时限数据
function checkFlag() {
    InitFuncCodeRequest_({
        data: {eoPkid: param.pkid, FunctionCode: 'EM_EO_TLIMIT_GROUP_DELALL'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                let iframeo = parent.frames["emEoApp2Div"];
                let opportunityCheckFlag = $("#opportunityCheckFlag").combobox("getValue");
                iframeo.iparam.opportunityCheckFlag = opportunityCheckFlag;
                iframeo.$("#spark").prop("checked", false);
                iframeo.InitSaveForm_();
                iframeo.reload_();
            } else {
                MsgAlert({content: jdata.msg, type: "error"});
            }

        }
    });

}
