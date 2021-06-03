var PAGE_DATA = {};
var PA_DATA = {};
var param;
var operation;
var $dg = {};
var dgData = {};
var detailFun;
var fcBgPkid = -1; //首检大组PKID
var rcBgPkid = -1; //重检大组PKID
var fcBgIsSave = false; //首检大组是否保存成功
var rcBgIsSave = false; //重检大组是否保存成功
var eoEa;   //文件终结类型
//终结文件文件编号combogrid的校验
var artChanged = false;
var selectRow = null;
var fcUnitOldValue; //首检值单位onSelect前的值
//--新的时限
var fcData; //首检数据
var rcData; //重检数据
var fcUnits; //首检单位
var rcUnits; //重检单位
var postTypes; //post类型
var sinceTypes; //起始类型
var eoNos;  //EO编号
var jobCategery; //工作类型
var ifCf; //工作性质是否重复
var applyType;
var gdsFunctionCode = {
    dg1: {
        list: 'EM_EO_TLIMIT_FC_BG_LIST',
        add: 'EM_EO_TLIMIT_FC_BG_ADD',
        addshtml: 'tlimitGroupAdd.shtml',
        delFunctionCode: 'EM_EO_TLIMIT_FC_BG_DEL',
        alter: [{
            'pageData': "EM_SEG_TASK_TL_RULE",
            'field': "FC_BG_PRINCIPLE",
            'editor': 'combobox'

        }, {
            'pageData': "EM_SEG_TASK_TL_RULE",
            'field': "FC_BG_NO",
            'editor': 'textbox'

        }]
    },
    dg2: {
        list: 'EM_EO_TLIMIT_FC_SG_LIST',
        add: 'EM_EO_TLIMIT_FC_SG_ADD',
        delFunctionCode: 'EM_EO_TLIMIT_FC_SG_DEL',
        addshtml: 'tlimitGroupAdd.shtml',
        pid: "1",
        alter: [{
            'pageData': "EM_SEG_TASK_TL_RULE",
            'field': "FC_SG_PRINCIPLE"
        }]
    },
    dg3: {
        list: 'EM_EO_TLIMIT_FC_V_LIST',
        add: 'EM_EO_TLIMIT_FC_V_ADD',
        delFunctionCode: 'EM_EO_TLIMIT_FC_V_DEL',
        addshtml: 'tlimitFCAdd.shtml',
        pid: "2",
        alter: [{
            'pageData': "EM_SEG_TASK_TL_RULE",
            'field': "PRINCIPLE"
        }]
    },
    dg4: {
        list: 'EM_EO_TLIMIT_RC_BG_LIST',
        add: 'EM_EO_TLIMIT_RC_BG_ADD',
        delFunctionCode: 'EM_EO_TLIMIT_RC_BG_DEL',
        addshtml: 'tlimitGroupAdd.shtml',
        alter: [{
            'pageData': "EM_SEG_TASK_TL_RULE",
            'field': "PRINCIPLE"
        }]
    },
    dg5: {
        list: 'EM_EO_TLIMIT_RC_SG_LIST',
        add: 'EM_EO_TLIMIT_RC_SG_ADD',
        delFunctionCode: 'EM_EO_TLIMIT_RC_SG_DEL',
        addshtml: 'tlimitGroupAdd.shtml',
        pid: "4",
        alter: [{
            'pageData': "EM_SEG_TASK_TL_RULE",
            'field': "PRINCIPLE"
        }]
    },
    dg6: {
        list: 'EM_EO_TLIMIT_RC_V_LIST',
        add: 'EM_EO_TLIMIT_RC_V_ADD',
        delFunctionCode: 'EM_EO_TLIMIT_RC_V_DEL',
        addshtml: 'tlimitFCAdd.shtml',
        pid: "5",
        alter: [{
            'pageData': "EM_SEG_TASK_TL_RULE",
            'field': "PRINCIPLE"
        }]
    },
    dg7: {
        list: 'EM_EO_TLIMIT_VI_LIST',
        add: 'EM_EO_TLIMIT_VI_ADD',
        delFunctionCode: 'EM_EO_TLIMIT_VI_DEL',
        addshtml: 'tlimitViAdd.shtml'
    },
    dg8: {
        list: 'EM_EO_TLIMIT_WFILE_LIST',
        delFunctionCode: 'EM_EO_TLIMIT_WFILE_DEL',
        add: 'EM_EO_TLIMIT_WFILE_ADD',
        addshtml: 'fileAdd.shtml'
    },
    dg9: {
        list: 'EM_EO_TLIMIT_WFILE_LIST',
        delFunctionCode: 'EM_EO_TLIMIT_WFILE_DEL',
        add: 'EM_EO_TLIMIT_WFILE_ADD',
        addshtml: 'fileAdd.shtml'
    }
};

function i18nCallBack() {
    window.resizeTo("1024", "1000");
    window.moveTo(200, 200);

    //时序类型
    $('input:checkbox').val("N");
    param = getParentParam_();
	jobCategery = param.jobCategory;
    applyType = param.applyType;
	$('#fiViDiv').hide();
    if('CF' == jobCategery){
        ifCf = true;
    }else{
        ifCf = false;
    }							 
    if (param.applyType == "APL" || param.applyType == "ENG") {
        detailFun = "EM_EO_TLIMIT_APP_DETAIL_LIST";
    } else {
        detailFun = "EM_EO_TLIMIT_APP_DETAIL_PART_ENG_LIST";
        $('#setIlTr').hide(); //部件和发动机
    }
    operation = param.operation;

    if (operation == "view") {
        $(".btn.btn-primary").attr("disabled", true);
        $(".btn.btn-danger").attr("disabled", true);
        $('#closeBtn').attr("disabled", false);
        $("input[type=checkbox]").each(function(){
            $(this).attr("disabled",true);
        });
        $("#view").hide();
        $('#viewAppGroup').attr('disabled', false);
        $('#dead').attr('disabled', false);
    }


    if ("add" == operation) {
        InitFuncCodeRequest_({
            async: false,
            data: {eoPkid: param.eoPkid, FunctionCode: "EM_EO_TLIMIT_GROUP_NO"}, successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    if(jdata.data){
                        var maxNo = jdata.data.TLIMIT_GROUP_NO;
                        $('#tlimitGroupNo').numberbox("setValue", parseInt(maxNo) + 1);
                    }else{
                        $('#tlimitGroupNo').numberbox(1);
                    }
                    //新增即保存
                    save('add');
                } else {
                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                }
            }
        });
    }

    //新时限初始化
    if(param.pkid){
        initFc();
        initRc();
    }else{
        if(param.applyType == 'PART'){
            $('input[name$=deadLine]').datepicker({
                dateFormat: 'yy-mm-dd'
            })
        }
        $('#fcNote').attr('disabled', 'disabled');
        $('#rcNote').attr('disabled', 'disabled');
    }

    InitFuncCodeRequest_({
        async: false,
        data: {
            domainCode: "EM_SEG_TASK_TL_RULE,YESORNO,EOEA,EM_EO_FC_UNIT,"+
            "EM_EO_FC_UNIT_APL,EM_EO_FC_UNIT_ENG,EM_EO_FC_UNIT_PART," +
            "EM_EO_POST_TYPE,EM_EO_POST_TYPE_PART,EM_EO_SINCE_TYPE,EM_EO_RC_UNIT,"+
            "EO_NO",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                PAGE_DATA['PRINCIPLE'] = DomainCodeToMap_(jdata.data["EM_SEG_TASK_TL_RULE"]);
                PA_DATA['PRINCIPLE'] = jdata.data["EM_SEG_TASK_TL_RULE"];
                PAGE_DATA["EOEA"] = DomainCodeToMap_(jdata.data["EOEA"]);
                PA_DATA["EOEA"] = jdata.data["EOEA"];
                PAGE_DATA['yeorno'] = DomainCodeToMap_(jdata.data["YESORNO"]);
                PAGE_DATA['EM_EO_FC_UNIT'] = DomainCodeToMap_(jdata.data["EM_EO_FC_UNIT"]);

                //EO_NO
                eoNos = jdata.data["EO_NO"];

                if(param.applyType == 'APL'){
                    fcUnits = jdata.data["EM_EO_FC_UNIT_APL"];
                }
                if(param.applyType == 'ENG'){
                    fcUnits = jdata.data["EM_EO_FC_UNIT_ENG"];
                }
                if(param.applyType == 'PART'){
                    fcUnits = jdata.data["EM_EO_FC_UNIT_PART"];
                }

                //首检单位
                for(var i = 0; i<fcUnits.length; i++){
                    var opt = "<option value='" + fcUnits[i].VALUE + "'>" + fcUnits[i].TEXT + "</option>";
                    $("[name$='startingLabel']").append(opt);
                }
                //重检单位
                rcUnits = jdata.data['EM_EO_RC_UNIT'];
                for(var i = 0; i<rcUnits.length; i++){
                    var opt2 = "<option value='" + rcUnits[i].VALUE + "'>" + rcUnits[i].TEXT + "</option>";
                    $("[name$='rcStartingLabel']").append(opt2);
                }
                //POST类型
                if(applyType == "PART"){
                    postTypes = jdata.data["EM_EO_POST_TYPE_PART"];
                }else{
                    postTypes = jdata.data["EM_EO_POST_TYPE"];
                }
                var opt1 = "<option value=''>--Select--</option>";
                $("select[name$='postType']").append(opt1);
                for(var i = 0; i<postTypes.length; i++){
                    var opt = "<option value='" + postTypes[i].VALUE + "'>" + postTypes[i].TEXT + "</option>";
                    $("select[name$='postType']").append(opt);
                }

                //起始类型
                sinceTypes = jdata.data["EM_EO_SINCE_TYPE"];
                var opt0 = "<option value=''>--Select--</option>";
                $("select[name$='sinceType']").append(opt0);
                for(var i = 0; i<sinceTypes.length; i++){
                    var opt = "<option value='" + sinceTypes[i].VALUE + "'>" + sinceTypes[i].TEXT + "</option>";
                    $("select[name$='sinceType']").append(opt);
                }

                $("#appGroup").MyComboGrid({
                    panelWidth: '200',
                    idField: 'VALUE',  //实际选择值
                    textField: 'TEXT', //文本显示值
                    editable: true,
                    required: true,
                    pagination: true,
                    tipPosition: 'top',
                    multiple: true,
                    mode: 'remote',
                    params: {eoPkid: param.eoPkid, FunctionCode: 'EM_EO_APP_SHOW'},
                    url: Constant.API_URL + 'EM_EO_APP_SHOW',
                    columns: [[
                        {field: 'VALUE', title: '主键', width: 100, sortable: true},
                        {field: 'TEXT', title: '名称', width: 100, sortable: true}
                    ]]
                });

                //首检大组原则
                $('#fcBgPrinciple').combobox({
                    panelHeight: '135px',
                    data: jdata.data.EM_SEG_TASK_TL_RULE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //是否设置提前量
                $('#ifSetIl').combobox({
                    panelHeight: '100px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange : function (newValue, oldValue) {
                        if(!newValue || 'N' == newValue){
                            $('#initialLead').textbox({disabled:true, required : false});
                            $('#initialLead').textbox('setValue', '');
                        }
                        if(newValue == 'Y'){
                            $('#initialLead').textbox({disabled:false, required : true});
                            $('#initialLead').textbox('setValue', '');
                        }
                    }
                });

                //重检大组原则
                $('#rcBgPrinciple').combobox({
                    panelHeight: '135px',
                    data: jdata.data.EM_SEG_TASK_TL_RULE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                InitFrom();
                fcVTitleShow(param.applyType);
                if(param.pkid && fcData.fcBg && fcData.fcSgList){
                    initFcForm(fcData);
                }
                if(param.pkid && rcData.rcBg && rcData.rcSgList){
                    initRcForm(rcData);
                }

            }
        }
    });

}

//初始化表格
function InitDataGrid(nid) {
    let id = "dg" + nid;
    let nalter = {};
    /* if (gdsFunctionCode[id].alter) {
         for (let i = 0; i < gdsFunctionCode[id].alter.length; i++) {
             let formatter;
             /!*if(!gdsFunctionCode[id].alter[i].editor){
                  formatter = `{
                         formatter: function (value) {
                             return PAGE_DATA['${gdsFunctionCode[id].alter[i].field}'][value];
                         }
                     }`;
             }else {
                 if(gdsFunctionCode[id].alter[i].editor== 'combobox'){
                     formatter = `{
                         formatter: function (value) {
                             return PAGE_DATA['${gdsFunctionCode[id].alter[i].field}'][value];
                         }
                     }`;
                 }
                 if(gdsFunctionCode[id].alter[i].editor== 'textbox'){
                     formatter = `{
                         formatter: function (value) {
                             return PAGE_DATA['${gdsFunctionCode[id].alter[i].field}'][value];
                         },
                         editor: {
                             type: 'textbox'
                         }
                     }`;
                 }
             }*!/


             nalter[gdsFunctionCode[id].alter[i].field] = eval('(' + formatter + ')');
         }
     }*/



    $dg[id] = $("#" + id);
    var pid;
    if(nid == "2"){
        if(fcBgPkid != -1){
            pid = fcBgPkid;
        }else{
            pid = -1;
        }

    }
    if(nid == "5" ){
        if(rcBgPkid != -1){
            pid = rcBgPkid;
        }else{
            pid = -1;
        }
    }
    if(!pid){
        pid = getrowPid(nid);
    }
    $dg[id].MyDataGrid({
        identity: id,
        fit: true,
        pagination: false,
        singleSelect: true,
        allowPaging: true,
        enableLineEdit: true,
        enableCellEdit: false,
        sortable: true,
        /*resize: function () {
            return tabs_standard_resize($("#fcbg"), -10, 0.01, 0.01, 5);
        },*/
        queryParams: {pkid: param.pkid ? param.pkid : -1, pid: pid},
        pageSize: 14,
        columns: {
            param: {FunctionCode: gdsFunctionCode[id].list},
            alter: {

                INITIAL_LEAD: {
                    editor: {
                        type: 'numberbox'
                    }
                },
                VI_VALUE: {
                    editor: {
                        type: 'numberbox',
                        options :{
                            required: true
                        }
                    }
                },
                FILE_NO: {
                    editor: {
                        type: 'combogrid',
                        options: {
                            panelWidth: '300',
                            idField: 'TEXT',  //实际选择值
                            textField: 'TEXT', //文本显示值
                            editable: true,
                            required: false,
                            pagination: true,
                            tipPosition: 'top',
                            mode: 'remote',
                            queryParams: {eoPkid: param.eoPkid,pkid: param.pkid, applyType: param.applyType, applyModel: param.applyModel, eoEa:eoEa},
                            url: Constant.API_URL + 'EM_EO_NO_LIST_03',
                            columns: [[
                                {field: 'TEXT', title: '文件编号', width: 300, sortable: true}
                            ]],
                            onShowPanel: function () {
                                $(this).combogrid('grid').datagrid('reload', {pkid: param.pkid,applyType: param.applyType, applyModel: param.applyModel, eoEa:eoEa});

                            },
                            onChange : function () {
                                artChanged = true;//记录是否有改变（当手动输入时发生)
                            },
                            onHidePanel: function () {
                                var t = $(this).combogrid('getValue');
                                if (artChanged) {
                                    if (selectRow == null || t != selectRow.TEXT) {//没有选择或者选项不相等时清除内容
                                        alert('请选择，不要直接输入');
                                        $(this).combogrid('setValue', '');
                                    } else {
                                        //do something...
                                    }
                                }
                                artChanged = false;
                                selectRow = null;
                            },
                            onSelect: function (index, row) {
                                selectRow = row;
                            }
                        }
                    }, formatter: function (value) {
                        return value;
                    }
                },
                FILE_TYPE: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "EOEA"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: false,
                            required: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "EOEA");
                                return v;
                            },
                            onSelect : function(item){
                                var rowIndex = $('#dg8').datagrid('getRowIndex', $('#dg8').datagrid('getSelected'));

                                eoEa = item.VALUE;
                                $('#dg8').datagrid("changeEditor",{index:rowIndex,field :'FILE_NO',editor:{type:'combogrid',options:{panelWidth: '300',
                                            idField: 'TEXT',  //实际选择值
                                            textField: 'TEXT', //文本显示值
                                            editable: true,
                                            required: true,
                                            pagination: true,
                                            tipPosition: 'top',
                                            mode: 'remote',
                                            queryParams: {eoPkid: param.eoPkid,pkid: param.pkid,applyType: param.applyType, applyModel: param.applyModel, eoEa:eoEa},
                                            url: Constant.API_URL + 'EM_EO_NO_LIST_03',
                                            columns: [[
                                                {field: 'TEXT', title: '文件编号', width: 300, sortable: true}
                                            ]],
                                            onShowPanel: function () {
                                                $(this).combogrid('grid').datagrid('reload', {pkid: param.pkid,applyType: param.applyType, applyModel: param.applyModel, eoEa:eoEa});

                                            },
                                            onChange : function () {
                                                artChanged = true;//记录是否有改变（当手动输入时发生)
                                            },
                                            onHidePanel: function () {
                                                var t = $(this).combogrid('getValue');
                                                if (artChanged) {
                                                    if (selectRow == null || t != selectRow.TEXT) {//没有选择或者选项不相等时清除内容
                                                        alert('请选择，不要直接输入');
                                                        $(this).combogrid('setValue', '');
                                                    } else {
                                                        //do something...
                                                    }
                                                }
                                                artChanged = false;
                                                selectRow = null;
                                            },
                                            onSelect: function (index, row) {
                                                selectRow = row;
                                            }

                                        }}});
                                //如果文件编号有值，在文件类型变换时需要清除
                                var ed = $('#dg8').datagrid('getEditor', {index: rowIndex, field: 'FILE_NO'});
                                var fileNo = ed.target.combogrid('getValue');
                                if(fileNo){
                                    ed.target.combogrid('clear');
                                }
                            },
                            tipPosition: 'top'
                        }
                    },
                    formatter: function (value) {
                        return PAGE_DATA['EOEA'][value];
                    }
                },
                CONDITION_DESC: {
                    editor: {
                        type: 'textbox',
                        options: {
                            required: true,
                        }
                    }
                },
                VI_NO: {
                    editor: {
                        type: 'numberbox'
                    }
                },

                RC_VALUE: {
                    editor: {
                        type: 'numberbox',
                        options: {
                            required: true,
                        }
                    }
                },
                NUM: {
                    editor: {
                        type: 'numberbox'
                    }
                },
                FC_BG_NO: {
                    editor: {
                        type: 'numberbox',
                        options: {
                            required: true
                        }
                    }
                },
                FC_SG_NO: {
                    editor: {
                        type: 'numberbox',
                        options: {
                            required: true
                        }
                    }
                },
                RC_BG_NO: {
                    editor: {
                        type: 'numberbox',
                        options: {
                            required: true
                        }
                    }
                },
                RC_SG_NO: {
                    editor: {
                        type: 'numberbox',
                        options: {
                            required: true
                        }

                    }
                },
                PRINCIPLE: {
                    editor: {
                        type: 'combobox',
                        options: {
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "EM_SEG_TASK_TL_RULE"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: false,
                            required: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "EM_SEG_TASK_TL_RULE");
                                return v;
                            },
                            tipPosition: 'top'
                        }
                    },
                    formatter: function (value) {
                        return PAGE_DATA['PRINCIPLE'][value];
                    }
                },
                FC_BG_PRINCIPLE: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "EM_SEG_TASK_TL_RULE"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: true,
                            required: false,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "EM_SEG_TASK_TL_RULE");
                                return v;
                            },
                            tipPosition: 'top'
                        }
                    },
                    formatter: function (value) {
                        return PAGE_DATA['PRINCIPLE'][value];
                    }
                },
                FC_SG_PRINCIPLE: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "EM_SEG_TASK_TL_RULE"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            //editable: false,
                            //required: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "EM_SEG_TASK_TL_RULE");
                                return v;
                            },
                            onHidePanel: function() {
                                var valueField = $(this).combobox("options").valueField;
                                var val = $(this).combobox("getValue");  //当前combobox的值
                                var allData = $(this).combobox("getData");   //获取combobox所有数据
                                var result = true;      //为true说明输入的值在下拉框数据中不存在
                                for (var i = 0; i < allData.length; i++) {
                                    if (val == allData[i][valueField]) {
                                        result = false;
                                        break;
                                    }
                                }
                                if (result) {
                                    $(this).combobox("clear");
                                }
                            },
                            tipPosition: 'top'
                        }
                    },
                    formatter: function (value) {
                        return PAGE_DATA['PRINCIPLE'][value];
                    }
                },
                RC_BG_PRINCIPLE: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "EM_SEG_TASK_TL_RULE"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: true,
                            required: false,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "EM_SEG_TASK_TL_RULE");
                                return v;
                            },
                            tipPosition: 'top'
                        }
                    },
                    formatter: function (value) {
                        return PAGE_DATA['PRINCIPLE'][value];
                    }
                },
                RC_SG_PRINCIPLE: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "EM_SEG_TASK_TL_RULE"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: true,
                            required: false,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "EM_SEG_TASK_TL_RULE");
                                return v;
                            },
                            onHidePanel: function() {
                                var valueField = $(this).combobox("options").valueField;
                                var val = $(this).combobox("getValue");  //当前combobox的值
                                var allData = $(this).combobox("getData");   //获取combobox所有数据
                                var result = true;      //为true说明输入的值在下拉框数据中不存在
                                for (var i = 0; i < allData.length; i++) {
                                    if (val == allData[i][valueField]) {
                                        result = false;
                                        break;
                                    }
                                }
                                if (result) {
                                    $(this).combobox("clear");
                                }
                            },
                            tipPosition: 'top'
                        }
                    },
                    formatter: function (value) {
                        return PAGE_DATA['PRINCIPLE'][value];
                    }
                },
                VI_UNIT: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "EM_FILE_EVA_FC_UNIT"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: false,
                            required: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "EM_FILE_EVA_FC_UNIT");
                                return v;
                            },
                            tipPosition: 'top'
                        }
                    }, formatter: function (value) {
                        return value;
                    }
                },
                RC_UNIT: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "EM_FILE_EVA_FC_UNIT"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: true,
                            required: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "EM_FILE_EVA_FC_UNIT");
                                return v;
                            },
                            onHidePanel: function() {
                                var valueField = $(this).combobox("options").valueField;
                                var val = $(this).combobox("getValue");  //当前combobox的值
                                var allData = $(this).combobox("getData");   //获取combobox所有数据
                                var result = true;      //为true说明输入的值在下拉框数据中不存在
                                for (var i = 0; i < allData.length; i++) {
                                    if (val == allData[i][valueField]) {
                                        result = false;
                                        break;
                                    }
                                }
                                if (result) {
                                    $(this).combobox("clear");
                                }
                            },
                            tipPosition: 'top'
                        }
                    }, formatter: function (value) {
                        return value;
                    }
                },
                FC_UNIT: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "EM_EO_FC_UNIT"+"_"+param.applyType},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: true,
                            required: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "EM_EO_FC_UNIT"+"_"+param.applyType);
                                return v;
                            },
                            onHidePanel: function() {
                                var valueField = $(this).combobox("options").valueField;
                                var val = $(this).combobox("getValue");  //当前combobox的值
                                fcUnitOldValue = val;
                                var allData = $(this).combobox("getData");   //获取combobox所有数据
                                var result = true;      //为true说明输入的值在下拉框数据中不存在
                                for (var i = 0; i < allData.length; i++) {
                                    if (val == allData[i][valueField]) {
                                        result = false;
                                        break;
                                    }
                                }
                                if (result) {
                                    $(this).combobox("clear");
                                }
                            },
                            onSelect: function(item){
                                var ifSetIl = $('#ifSetIl').combobox('getValue');
                                var initialLead = $('#initialLead').textbox('getValue');
                                //如果有提前量，首检单位只能取FH/FC/DY
                                if(ifSetIl == 'Y' && initialLead){
                                    if(item.VALUE != 'FH' && item.VALUE != 'FC' && item.VALUE != 'DY'){
                                        MsgAlert({content: '只能选择FH/FC/DY', type:'error'});
                                        $(this).combobox('clear');
                                        return;
                                    }
                                }

                                var rowIndex = $('#dg3').datagrid('getRowIndex', $('#dg3').datagrid('getSelected'));
                                if(item.VALUE == 'DATE'){
                                    $('#dg3').datagrid("changeEditor",{index:rowIndex,field :'FC_VALUE',editor:{type:'datebox',options:{width:100, required: true, editable: false}}});
                                    var ed = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'FC_VALUE'});
                                    ed.target.datebox('setValue', '');
                                }else if(item.VALUE == 'YJJ'){
                                    $('#dg3').datagrid("changeEditor",{index:rowIndex,field :'FC_VALUE',editor:{type:'numberbox',options:{width:100, required: false, editable: false}}});
                                    var ed = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'FC_VALUE'});
                                    ed.target.numberbox('setValue', '');
                                }else{
                                    var ed = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'FC_VALUE'});
                                    var val = '';
                                    if(!fcUnitOldValue || (fcUnitOldValue != 'DATE' && fcUnitOldValue != 'YJJ')){
                                        val = ed.target.textbox('getValue');
                                    }
                                    $('#dg3').datagrid("changeEditor",{index:rowIndex,field :'FC_VALUE',editor:{type:'numberbox',options:{width:100, required: true, editable: true}}});
                                    var ed1 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'FC_VALUE'});
                                    if(fcUnitOldValue && fcUnitOldValue == 'DATE'){
                                        ed1.target.numberbox('setValue', '');
                                    }else{
                                        ed1.target.numberbox('setValue', val);
                                    }
                                }
                                fcUnitOldValue = item.VALUE;

                            },
                            tipPosition: 'top'
                        }
                    }, formatter: function (value) {
                        return PAGE_DATA['EM_EO_FC_UNIT'][value];
                    }
                },
                IF_SET_IL: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "YESORNO"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: false,
                            required: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "YESORNO");
                                return v;
                            },
                            tipPosition: 'top'
                        }
                    }, formatter: function (value) {
                        return PAGE_DATA['yeorno'][value];
                    }
                },
                POST_FILE_TYPE: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: applyType == "PART"?"EM_EO_POST_TYPE_PART":"EM_EO_POST_TYPE"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + applyType == "PART"?"EM_EO_POST_TYPE_PART":"EM_EO_POST_TYPE");
                                return v;
                            },
                            onHidePanel: function() {
                                var valueField = $(this).combobox("options").valueField;
                                var val = $(this).combobox("getValue");  //当前combobox的值
                                var allData = $(this).combobox("getData");   //获取combobox所有数据
                                var result = true;      //为true说明输入的值在下拉框数据中不存在
                                for (var i = 0; i < allData.length; i++) {
                                    if (val == allData[i][valueField]) {
                                        result = false;
                                        break;
                                    }
                                }
                                if (result) {
                                    $(this).combobox("clear");
                                    val = '';
                                }

                                var rowIndex = $('#dg3').datagrid('getRowIndex', $('#dg3').datagrid('getSelected'));
                                //post日期
                                var ed1 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_DATE'});
                                //post文件编号
                                var ed2 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_FILE_NO'});
                                if(val == ''){
                                    //POST日期不可录入
                                    ed1.target.datebox({disabled: true});
                                    ed1.target.datebox('setValue', '');
                                    //POST文件编号不可录入
                                    ed2.target.textbox({disabled: true});
                                    ed2.target.textbox('setValue', '');
                                }else if(val == 'DATE'){
                                    //POST日期可录入
                                    ed1.target.datebox({disabled: false});
                                    ed1.target.datebox('setValue', '');
                                    //POST文件编号不可录入
                                    ed2.target.textbox({disabled: true});
                                    ed2.target.textbox('setValue', '');
                                }else{
                                    //POST日期不可录入
                                    ed1.target.datebox({disabled: true});
                                    ed1.target.datebox('setValue', '');
                                    //POST文件编号可录入
                                    ed2.target.textbox({disabled: false});
                                    ed2.target.textbox('setValue', '');
                                }
                            },
                            onSelect: function(item){
                                var rowIndex = $('#dg3').datagrid('getRowIndex', $('#dg3').datagrid('getSelected'));
                                //IF_POST
                                var ed = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'IF_POST'});
                                var ifPost = ed.target.combobox('getValue');
                                if(ifPost != 'Y'){
                                    $(this).combobox('setValue', '');
                                }
                            },
                            tipPosition: 'top'
                        }
                    }, formatter: function (value) {
                        return value;
                    }
                },
                SINCE_TYPE: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "EM_FILE_EVAL_SINCE_TYPE"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "EM_FILE_EVAL_SINCE_TYPE");
                                return v;
                            },
                            onHidePanel: function() {
                                var valueField = $(this).combobox("options").valueField;
                                var val = $(this).combobox("getValue");  //当前combobox的值
                                var allData = $(this).combobox("getData");   //获取combobox所有数据
                                var result = true;      //为true说明输入的值在下拉框数据中不存在
                                for (var i = 0; i < allData.length; i++) {
                                    if (val == allData[i][valueField]) {
                                        result = false;
                                        break;
                                    }
                                }
                                if (result) {
                                    $(this).combobox("clear");
                                    val = '';
                                }
                            },
                            onSelect : function(item){
                                if(id == 'dg6'){
                                    var rowIndex = $('#dg6').datagrid('getRowIndex', $('#dg6').datagrid('getSelected'));
                                    //起始类型
                                    var ed = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'IF_SINCE'});
                                    var val = ed.target.combobox('getValue');
                                    if(val != 'Y'){
                                        $(this).combobox('clear');
                                    }
                                }
                                if((param.applyType == 'PART' || param.applyType == 'ENG') && id == 'dg3'){//部件
                                    var rowIndex = $('#dg3').datagrid('getRowIndex', $('#dg3').datagrid('getSelected'));
                                    //起始类型
                                    var ed = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'IF_SINCE'});
                                    var val1 = ed.target.combobox('getValue');
                                    if(val1 != 'Y'){
                                        $(this).combobox('clear');
                                    }
                                }
                            },
                            tipPosition: 'top'
                        }
                    }, formatter: function (value) {
                        return value;
                    }
                },
                POST_FILE_NO: {
                    editor: {
                        type: 'textbox',
                    }
                },
                DEADLINE: {
                    editor: {
                        type: 'datebox',
                        options:{
                            editable: false,
                            onSelect: function(date){
                                if(date){//部件的首重检值有截止日期，且与同行数据其他互斥
                                    if(id == 'dg3'){
                                        var rowIndex = $('#dg3').datagrid('getRowIndex', $('#dg3').datagrid('getSelected'));
                                        var ed1 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'FC_UNIT'});
                                        var ed2 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'FC_VALUE'});
                                        var fcUnit = ed1.target.combobox('getValue');
                                        if(fcUnit && fcUnit == 'DATE'){
                                            ed2.target.datebox('clear');
                                            ed2.target.datebox({disabled: true, rquired:false});
                                        }else{
                                            ed2.target.textbox('clear');
                                            ed2.target.textbox({disabled: true, rquired:false});
                                        }
                                        ed1.target.combobox('clear');
                                        ed1.target.combobox({disabled: true, required:false});

                                        var ed3 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'IF_SINCE'});
                                        var ed4 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'SINCE_TYPE'});
                                        ed3.target.combobox('clear');
                                        ed3.target.combobox({disabled: true});
                                        ed4.target.textbox('clear');
                                        ed4.target.textbox({disabled: true});
                                    }
                                    if(id == 'dg6'){
                                        var rowIndex = $('#dg6').datagrid('getRowIndex', $('#dg6').datagrid('getSelected'));
                                        var ed1 = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'RC_UNIT'});
                                        var ed2 = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'RC_VALUE'});
                                        var fcUnit = ed1.target.combobox('getValue');
                                        if(fcUnit && fcUnit == 'DATE'){
                                            ed2.target.datebox('clear');
                                            ed2.target.datebox({disabled: true, rquired:false});
                                        }else{
                                            ed2.target.textbox('clear');
                                            ed2.target.textbox({disabled: true, rquired:false});
                                        }
                                        ed1.target.combobox('clear');
                                        ed1.target.combobox({disabled: true, required:false});

                                        var ed3 = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'IF_SINCE'});
                                        var ed4 = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'SINCE_TYPE'});
                                        ed3.target.combobox('clear');
                                        ed3.target.combobox({disabled: true});
                                        ed4.target.textbox('clear');
                                        ed4.target.textbox({disabled: true});
                                    }
                                }
                            }
                        }
                    },
                    formatter : function (value) {
                        if(value){
                            return value.substr(0, 10);
                        }else{
                            return ''
                        }
                    }
                },
                IF_SINCE: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "YESORNO"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            editable: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "YESORNO");
                                return v;
                            },
                            onHidePanel: function() {
                                var valueField = $(this).combobox("options").valueField;
                                var val = $(this).combobox("getValue");  //当前combobox的值
                                var allData = $(this).combobox("getData");   //获取combobox所有数据
                                var result = true;      //为true说明输入的值在下拉框数据中不存在
                                for (var i = 0; i < allData.length; i++) {
                                    if (val == allData[i][valueField]) {
                                        result = false;
                                        break;
                                    }
                                }
                                if (result) {
                                    $(this).combobox("clear");
                                    val = '';
                                }

                                if(id == 'dg6'){
                                    var rowIndex = $('#dg6').datagrid('getRowIndex', $('#dg6').datagrid('getSelected'));
                                    //起始类型
                                    var ed = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'SINCE_TYPE'});
                                    if(val == 'N' || val == ''){
                                        ed.target.combobox({disabled : true});
                                        ed.target.combobox('setValue', '');
                                    }
                                    if(val == 'Y'){
                                        ed.target.combobox({disabled : false});
                                        ed.target.combobox('setValue', '');
                                    }
                                }
                                if((param.applyType == 'PART' || param.applyType == 'ENG') && id == 'dg3'){//部件、发动机
                                    var rowIndex = $('#dg3').datagrid('getRowIndex', $('#dg3').datagrid('getSelected'));
                                    //起始类型
                                    var ed = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'SINCE_TYPE'});
                                    if(val == 'N' || val == ''){
                                        ed.target.combobox({disabled : true});
                                        ed.target.combobox('setValue', '');
                                    }
                                    if(val == 'Y'){
                                        ed.target.combobox({disabled : false});
                                        ed.target.combobox('setValue', '');
                                    }

                                }

                            },
                            tipPosition: 'top'
                        }
                    }, formatter: function (value) {
                        return PAGE_DATA['yeorno'][value];
                    }
                }
                ,
                IF_POST: {
                    editor: {
                        type: 'combobox',
                        options: {
                            panelHeight: 'auto',
                            valueField: 'VALUE',
                            textField: 'TEXT',
                            queryParams: {domainCode: "YESORNO"},
                            url: Constant.API_URL + 'ANALYSIS_DOMAIN_BYCODE',
                            //required: true,
                            editable: true,
                            loadFilter: function (jdata) {
                                var v = eval("jdata.data." + "YESORNO");
                                return v;
                            },
                            onHidePanel: function() {
                                var valueField = $(this).combobox("options").valueField;
                                var val = $(this).combobox("getValue");  //当前combobox的值
                                var allData = $(this).combobox("getData");   //获取combobox所有数据
                                var result = true;      //为true说明输入的值在下拉框数据中不存在
                                for (var i = 0; i < allData.length; i++) {
                                    if (val == allData[i][valueField]) {
                                        result = false;
                                        break;
                                    }
                                }
                                if (result) {
                                    $(this).combobox("clear");
                                    val = '';
                                }

                                var rowIndex = $('#dg3').datagrid('getRowIndex', $('#dg3').datagrid('getSelected'));
                                var ed1 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_FILE_TYPE'});
                                var ed2 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_FILE_NO'});
                                var ed3 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_DATE'});
                                if(val == '' || val == 'N') {
                                    //是否POST(否:post信息不可录入)
                                    //设置post文件类型不可录入
                                    ed1.target.combobox({disabled: true});
                                    ed1.target.combobox('setValue', '');
                                    //设置post文件编号不可录入
                                    ed2.target.textbox({disabled: true});
                                    ed2.target.textbox('setValue', '');
                                    //设置post文件日期不可录入
                                    ed3.target.datebox({disabled: true});
                                    ed3.target.datebox('setValue', '');
                                }else {
                                    //设置post文件类型可录入
                                    ed1.target.combobox({disabled: false});
                                    ed1.target.combobox('setValue', '');
                                }
                            },
                            tipPosition: 'top'
                        }
                    }, formatter: function (value) {
                        return PAGE_DATA['yeorno'][value];
                    }
                },
                POST_DATE: {
                    editor: {
                        type: 'datebox',
                        options : {
                            onSelect: function(date){
                                var rowIndex = $('#dg3').datagrid('getRowIndex', $('#dg3').datagrid('getSelected'));
                                //POST_FILE_TYPE
                                var ed = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_FILE_TYPE'});
                                var postFileType = ed.target.combobox('getValue');
                                if(postFileType != 'DATE'){
                                    $(this).datebox('setValue', '');
                                }
                            },
                        }
                    },
                    formatter : function (value) {
                        if(value){
                            return value.substr(0, 10);
                        }else{
                            return ''
                        }
                    }
                },
                FC_VALUE: {
                    editor: {
                        type: 'numberbox',
                        options: {

                            required: true,
                        }
                    }
                }

            }
        },
        contextMenus: [
            {
                id: "m-delete", i18nText: "删除", auth: "",
                onclick: function () {
                    if(operation == 'view'){
                        MsgAlert({content: '禁止删除', type: 'error'});

                    }else{
                        var rowData = $("#" + id).datagrid('getSelected');
                        var rowIndex = $("#" + id).datagrid('getRowIndex', rowData);
                        if (!rowData.PKID) {
                            $("#" + id).datagrid('deleteRow', rowIndex);
                            return;
                        }
                        if (!confirm("确认删除该记录？")) {
                            return;
                        }

                        delData(nid, rowData.PKID);
                    }
                }
            }
        ],
        toolbar: [
            {
                id: 'btnAdd',
                text: $.i18n.t('增加'),
                iconCls: 'icon-add',
                handler: function () {
                    let flag = true;
                    if(operation == 'view'){
                        MsgAlert({content: '禁止新增', type: 'error'});

                    }else{
                        if ((nid == 2 && fcBgPkid == -1)) {
                            flag = saveBg();
                            if(!flag && !fcBgIsSave){
                                return;
                            }
                        }
                        if (nid == 5 && rcBgPkid == -1) {
                            flag = saveBgRc();
                            if(!flag && !rcBgIsSave){
                                return;
                            }
                        }
                        addFcBg(nid);
                    }

                }
            }
        ],
        onBeginEdit : function(rowIndex ,row){
            if(id == 'dg3'){
                if(param.applyType == "APL" || param.applyType == 'ENG'){//机身和发动机
                    //首检单位与首检值
                    if(row.FC_UNIT == 'DATE'){
                        $('#dg3').datagrid("changeEditor",{index:rowIndex,field :'FC_VALUE',editor:{type:'datebox',options:{width:100, required: true, editable: false}}});
                    }else if(row.FC_UNIT == 'YJJ'){
                        $('#dg3').datagrid("changeEditor",{index:rowIndex,field :'FC_VALUE',editor:{type:'numberbox',options:{width:100, required: false, editable: false}}});
                    }else{
                        $('#dg3').datagrid("changeEditor",{index:rowIndex,field :'FC_VALUE',editor:{type:'numberbox',options:{width:100, required: true, editable: true}}});
                    }

                    //是否POST
                    if(!row.IF_POST || row.IF_POST == 'N'){//否或者null
                        //设置post文件类型不可录入
                        var ed1 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_FILE_TYPE'});
                        ed1.target.combobox({disabled: true});
                        ed1.target.combobox('setValue', '');
                        //设置post文件编号不可录入
                        var ed2 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_FILE_NO'});
                        ed2.target.textbox({disabled: true});
                        ed2.target.textbox('setValue', '');
                        //设置post文件日期不可录入
                        var ed3 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_DATE'});
                        ed3.target.datebox({disabled: true});
                        ed3.target.datebox('setValue', '');
                    }else{//是
                        //POST文件类型
                        if(!row.POST_FILE_TYPE){ //null
                            //设置post文件编号不可录入
                            var ed4 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_FILE_NO'});
                            ed4.target.textbox({disabled: true});
                            ed4.target.textbox('setValue', '');
                            //设置post文件日期不可录入
                            var ed5 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_DATE'});
                            ed5.target.datebox({disabled: true});
                            ed5.target.datebox('setValue', '');
                        }else if(row.POST_FILE_TYPE == 'DATE'){//日期
                            //设置post文件编号不可录入
                            var ed6 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_FILE_NO'});
                            ed6.target.textbox({disabled: true});
                            ed6.target.textbox('setValue', '');
                            //设置post文件日期可录入
                            var ed5 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_DATE'});
                            ed7.target.datebox({disabled: false});
                            //ed7.target.datebox('setValue', '');
                        }else{//非日期
                            //设置post文件编号可录入
                            var ed8 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_FILE_NO'});
                            ed8.target.textbox({disabled: false});
                            //ed8.target.textbox('setValue', '');
                            //设置post文件日期不可录入
                            var ed9 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'POST_DATE'});
                            ed9.target.datebox({disabled: true});
                        }
                    }



                }
                if(param.applyType == "PART" || param.applyType == 'ENG'){//部件和发动机
                    //是否有起始类型
                    if(!row.IF_SINCE || row.IF_SINCE == 'N'){
                        //设置起始类型不可录入(重检)
                        var ed7= $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'SINCE_TYPE'});
                        ed7.target.combobox({disabled: true});
                        ed7.target.combobox('setValue', '');
                    }

                    //部件截止日期
                    if(param.applyType == 'PART'){
                        if(row.DEADLINE){
                            var rowIndex = $('#dg3').datagrid('getRowIndex', $('#dg3').datagrid('getSelected'));
                            var ed1 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'FC_UNIT'});
                            var ed2 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'FC_VALUE'});
                            var fcUnit = ed1.target.combobox('getValue');
                            if(fcUnit && fcUnit == 'DATE'){
                                ed2.target.datebox('clear');
                                ed2.target.datebox({disabled: true, rquired:false});
                            }else{
                                ed2.target.textbox('clear');
                                ed2.target.textbox({disabled: true, rquired:false});
                            }
                            ed1.target.combobox('clear');
                            ed1.target.combobox({disabled: true, required:false});

                            var ed3 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'IF_SINCE'});
                            var ed4 = $('#dg3').datagrid('getEditor', {index: rowIndex, field: 'SINCE_TYPE'});
                            ed3.target.combobox('clear');
                            ed3.target.combobox({disabled: true});
                            ed4.target.textbox('clear');
                            ed4.target.textbox({disabled: true});
                        }
                    }

                }
                fcUnitOldValue = row.FC_UNIT;

            }else if(id == 'dg6'){
                //是否有起始类型
                if(!row.IF_SINCE || row.IF_SINCE == 'N'){
                    //设置起始类型不可录入(重检)
                    var ed5 = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'SINCE_TYPE'});
                    ed5.target.combobox({disabled: true});
                    ed5.target.combobox('setValue', '');
                }

                //部件时截止日期
                if(param.applyType == 'PART'){
                    if(row.DEADLINE){
                        var rowIndex = $('#dg6').datagrid('getRowIndex', $('#dg6').datagrid('getSelected'));
                        var ed1 = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'RC_UNIT'});
                        var ed2 = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'RC_VALUE'});

                        ed2.target.textbox('clear');
                        ed2.target.textbox({disabled: true, rquired:false});

                        ed1.target.combobox('clear');
                        ed1.target.combobox({disabled: true, required:false});

                        var ed3 = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'IF_SINCE'});
                        var ed4 = $('#dg6').datagrid('getEditor', {index: rowIndex, field: 'SINCE_TYPE'});
                        ed3.target.combobox('clear');
                        ed3.target.combobox({disabled: true});
                        ed4.target.textbox('clear');
                        ed4.target.textbox({disabled: true});
                    }
                }
            }

            //终结文件
            if(id == 'dg8'){
                //var ed = $('#dg8').datagrid('getEditor', {index: rowIndex, field: 'FILE_NO'});
                if(!row.FILE_TYPE){ //新增
                    eoEa = '';
                }
            }

        },
        onLoadSuccess: function (data) {

            if (nid == 3) {
                if (param.applyType == "APL") {
                    $('#' + id).datagrid('hideColumn', 'IF_SINCE');
                    $('#' + id).datagrid('hideColumn', 'SINCE_TYPE');
                }
                if (param.applyType == "PART") {
                    $('#' + id).datagrid('hideColumn', 'IF_POST');
                    $('#' + id).datagrid('hideColumn', 'POST_FILE_TYPE');
                    $('#' + id).datagrid('hideColumn', 'POST_FILE_NO');
                    $('#' + id).datagrid('hideColumn', 'POST_DATE');
                } else {
                    $('#' + id).datagrid('hideColumn', 'DEADLINE');
                }
            }
            if(nid == 6){
                if(param.applyType == 'APL'){
                    $('#' + id).datagrid('hideColumn', 'IF_SINCE');
                    $('#' + id).datagrid('hideColumn', 'SINCE_TYPE');
                    $('#' + id).datagrid('hideColumn', 'DEADLINE');
                }
                if(param.applyType == 'ENG'){
                    $('#' + id).datagrid('hideColumn', 'DEADLINE');
                }
            }
        },
        onEndEdit: function (index, row, changes) {
            saveFcBg(index, row, changes, nid);
        },
        onClickRow: function (rowIndex, rowData) {
            if (rowData.PKID) {
                if (parseInt((nid - 1) / 3) < 2) {
                    reload_(parseInt(nid) + 1)
                    /* if (nid == 1) {
                         $('#dg' + 2).datagrid("reload", {pkid: param.pkid, pid: getrowPid(2)});
                     }
                     if (nid == 2) {
                         $('#dg' + 3).datagrid("reload", {pkid: param.pkid, pid: getrowPid(3)});
                     }

                     if (nid == 4) {
                         $('#dg' + 5).datagrid("reload", {pkid: param.pkid, pid: getrowPid(5)});
                     }
                     if (nid == 5) {
                         $('#dg' + 6).datagrid("reload", {pkid: param.pkid, pid: getrowPid(6)});
                     }*/

                }
            }
        }
    });
}


//初始化首检大组
function initFcBg() {
    InitFuncCodeRequest_({
        async : false,
        data: {
            pkid: param.pkid ? param.pkid : -1,
            pid : getrowPid(1),
            FunctionCode: gdsFunctionCode["dg" + 1].list
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //$dg[nid] = jdata.data;
                if(jdata.data && jdata.data.length > 0){
                    $('#fcBgPrinciple').combobox('setValue', jdata.data[0].FC_BG_PRINCIPLE);
                    $('#ifSetIl').combobox('setValue', jdata.data[0].IF_SET_IL);
                    $('#initialLead').textbox('setValue', jdata.data[0].INITIAL_LEAD);
                    $('#fcBgNo').val(jdata.data[0].FC_BG_NO);

                    fcBgPkid = jdata.data[0].PKID;
                    InitDataGrid("2");
                }
            }
        }
    });
}


//初始化重检大组
function initRcBg() {
    InitFuncCodeRequest_({
        async : false,
        data: {
            pkid: param.pkid ? param.pkid : -1,
            pid : getrowPid(4),
            FunctionCode: gdsFunctionCode["dg" + 4].list
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //$dg[nid] = jdata.data;
                if(jdata.data && jdata.data.length > 0){
                    $('#rcBgPrinciple').combobox('setValue', jdata.data[0].RC_BG_PRINCIPLE);
                    $('#rcBgNo').val(jdata.data[0].RC_BG_NO);

                    rcBgPkid = jdata.data[0].PKID;
                    InitDataGrid("5");
                }
            }
        }
    });
}

function delData(nid, pkid) {

    let id = "dg" + nid;

    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: gdsFunctionCode[id].delFunctionCode},
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                reload_(nid);

                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//删除首检大组
function delBgData() {
    var nid = 1;
    var id  = "dg" + nid;
    if(fcBgPkid == -1){
        MsgAlert({content: "无可删除的首检大组", type: 'error'});
        return;
    }
    InitFuncCodeRequest_({
        data: {pkid: fcBgPkid, FunctionCode: gdsFunctionCode[id].delFunctionCode},
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('#fcBgPrinciple').combobox('setValue', "");
                $('#ifSetIl').combobox('setValue', "");
                $('#initialLead').textbox('setValue', "");
                $('#fcBgNo').val("");
                fcBgPkid = -1;
                fcBgIsSave = false;
                reload_(nid);
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {
                fcBgIsSave = true;
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//删除重检大组
function delBgRcData() {
    var nid = 4;
    var id  = "dg" + nid;
    if(rcBgPkid == -1){
        MsgAlert({content: "无可删除的首检大组", type: 'error'});
        return;
    }
    InitFuncCodeRequest_({
        data: {pkid: rcBgPkid, FunctionCode: gdsFunctionCode[id].delFunctionCode},
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('#rcBgPrinciple').combobox('setValue', "");
                $('#rcBgNo').val("");
                rcBgPkid = -1;
                rcBgIsSave = false;
                reload_(nid);
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {
                rcBgIsSave = true;
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}


//行编辑结束 保存
function saveFcBg(index, row, changes, nid) {
    let pid = getrowPid(nid);
    if (parseInt((nid - 1) / 3) == 0) {
        let is = $('#ifFcNote').is(':checked') ? "Y" : "N";
        if ('Y' == is) {
            MsgAlert({content: "首检 非机构化 不可添加", type: 'error'});
            return;
        }
    }
    if (parseInt((nid - 1) / 3) == 1) {
        let is = $('#ifRcNote').is(':checked') ? "Y" : "N";
        if ('Y' == is) {
            MsgAlert({content: "复检 非机构化 不可添加", type: 'error'});
            return;
        }
    }
    if (nid == 7) {
        let is = $('#ifVi').is(':checked') ? "Y" : "N";
        if ('Y' != is) {
            MsgAlert({content: "请选中 可变间隔", type: 'error'});
            return;
        }
    }
    if (gdsFunctionCode["dg" + nid].pid) {
        if(gdsFunctionCode["dg"+nid].pid == '1'){
            if(fcBgPkid == -1){
                MsgAlert({content: "请选中 上级数据！", type: 'error'});
                return;
            }
            pid = fcBgPkid;
        }else if(gdsFunctionCode["dg"+nid].pid == '4'){
            if(rcBgPkid == -1){
                MsgAlert({content: "请选中 上级数据！", type: 'error'});
                return;
            }
            pid = rcBgPkid;
        }else{
            let row = $('#dg' + gdsFunctionCode["dg" + nid].pid).datagrid('getSelected');
            if (!row) {
                MsgAlert({content: "请选中 上级数据！", type: 'error'});
            }

            if (!row.PKID) {
                MsgAlert({content: "请先 编辑 保存上级数据！", type: 'error'});
            }
            pid = row.PKID;
        }

    }

    row = $.extend({
        pid: pid,
        nid: nid,
        tlimitGroupPkid: param.pkid
    }, row, {FunctionCode: gdsFunctionCode["dg" + nid].add});
    if (nid == 3 || nid == 6) {
        row = $.extend(row, {PRINCIPLE: -1});
    }

    InitFuncCodeRequest_({
        data: row,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                reload_(nid);
            } else {
                reload_(nid);
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

}


//保存首检大组
function saveBg() {
    if(!param.pkid){
        MsgAlert({content: "请先保存时限分组编号", type: 'error'});
        return false;
    }

    let is = $('#ifFcNote').is(':checked') ? "Y" : "N";
    if ('Y' == is) {
        MsgAlert({content: "首检 非结构化 不可添加", type: 'error'});
        $('#fcBgPrinciple').combobox('setValue', "");
        $('#ifSetIl').combobox('setValue', "");
        $('#initialLead').textbox('setValue', "");
        return false;
    }

    //首检大组原则校验
    var isValid=$('#fcBgPrinciple').combobox("isValid");
    if(!isValid){
        MsgAlert({content: "请选择首检大组原则的下拉框选项", type: 'error'});
        return false;
    }

    //校验是否设置提前量
    var isValidS =$('#ifSetIl').combobox("isValid");
    if(!isValidS){
        MsgAlert({content: "请选择是否设置提前量的下拉框选项", type: 'error'});
        return false;
    }
    var fcBgPrinciple = $('#fcBgPrinciple').combobox('getValue');
    var ifSetIl = $('#ifSetIl').combobox('getValue');
    var initialLead = $('#initialLead').textbox('getValue');

    if(ifSetIl && ifSetIl == 'Y' && !initialLead){
        MsgAlert({content: "请输入提前量", type: 'error'});
        return false;
    }
    //var fcBgNo = $('#fcBgNo').val();
    var fcBgNo = 1;
    var tlimitGroupPkid = param.pkid;

    InitFuncCodeRequest_({
        async: false,
        data: {pkid:fcBgPkid, fcBgPrinciple: fcBgPrinciple, ifSetIl:ifSetIl,
            initialLead:initialLead, fcBgNo:fcBgNo,tlimitGroupPkid:tlimitGroupPkid,
            FunctionCode:"EM_EO_TLIMIT_FC_BG_ADD"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                fcBgPkid = jdata.data;
                fcBgIsSave = true;
                // reload_(1);
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {
                fcBgIsSave = false;
                MsgAlert({content: jdata.msg, type: 'error'});

            }
        }
    });

}

//保存重检大组
function saveBgRc() {
    if(!param.pkid){
        MsgAlert({content: "请先保存时限分组编号", type: 'error'});
        return false;
    }

    let isifVi = $('#ifVi').is(':checked') ? "Y" : "N";
    if('Y' == isifVi){
        MsgAlert({content: "可变间隔 不可添加", type: 'error'});
        $('#rcBgPrinciple').combobox('setValue', "");
        return false;
    }

    let is = $('#ifRcNote').is(':checked') ? "Y" : "N";
    if ('Y' == is) {
        MsgAlert({content: "复检 非结构化 不可添加", type: 'error'});
        return false;
    }

    //重检大组原则校验
    var isValid=$('#rcBgPrinciple').combobox("isValid");
    if(!isValid){
        MsgAlert({content: "请选择重检大组原则下拉框选项", type: 'error'});
        return false;
    }

    var rcBgPrinciple = $('#rcBgPrinciple').combobox('getValue');
    var rcBgNo = 1;
    var tlimitGroupPkid = param.pkid;

    InitFuncCodeRequest_({
        async : false,
        data: {pkid:rcBgPkid, rcBgPrinciple: rcBgPrinciple,rcBgNo:rcBgNo,tlimitGroupPkid:tlimitGroupPkid,
            FunctionCode:"EM_EO_TLIMIT_RC_BG_ADD"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                rcBgPkid = jdata.data;
                //  reload_(4);
                rcBgIsSave = true;
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {
                rcBgIsSave = false;
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//添加回填 页面数据
function InitFrom() {
    if (operation == "view" || operation == "edit") {
        InitFuncCodeRequest_({
            async : false,
            data: {
                pkid: param.pkid,
                FunctionCode: "EM_EO_TLIMIT_GROUP_RE"
            },
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                    $(":checkbox").each(function () {
                        var radioName = toLine($(this).attr('name')).toUpperCase();
                        var is = jdata.data[radioName];
                        $(this).prop("checked", is == "Y" ? true : false);
                        if (is == "Y") { //恢复 note 编辑
                            if ($(this).attr('name') == "ifFcNote") {
                                //$("#fcNote").textbox({editable: true, onlyview: false, multiline: true});
                                /*$('#fcNote').removeAttr('disabled');
                                $("#ifSetIl").textbox({disabled:true});
                                $("#initialLead").textbox({disabled:true});*/
                                appendResetTable(); //清空页面数据
                                loadSelect('fc');
								$('#fcNote').val(jdata.data.FC_NOTE);								 									 
                            }
                            if ($(this).attr('name') == "ifRcNote") {
                                //$("#rcNote").textbox({editable: true, onlyview: false, multiline: true});
                                //$('#rcNote').removeAttr('disabled');
                                appendRcResetTable(); //清空页面数据
                                loadSelect('rc');
								$('#rcNote').val(jdata.data.RC_NOTE);
                            }

                        }
                        //可变间隔
                        if ($(this).attr('name') == "ifVi") {
                            ifVi = is;
                        }
                    });
                    //initFcBg(); //初始化首检大组和小组
                    //initRcBg(); //初始化重检大组和小组
                }
            }
        })
    }

    var gdns = [ "2", "3", "5", "6", "7", "8"];
    for (let i = 0; i < gdns.length; i++) {
        InitDataGrid(gdns[i])
    }
    InitDataGrid9();
    if(!ifVi || ifVi != 'Y'){
        $('#div7').hide();
    }else{
        //可变间隔为选中状态
        $('#appendTableRc').find('select').attr('disabled','disabled');
        $('#appendTableRc').find('input').attr('disabled','disabled');
        $('#rcNote').attr('disabled', 'disabled');
    }
}


//回调表格数据
function reDgData(nid, pid) {
    InitFuncCodeRequest_({
        async : false,
        data: {
            pkid: param.pkid,
            eoPkid: param.eoPkid ? aram.eoPkid : -1,
            pid: pid,
            FunctionCode: gdsFunctionCode["dg" + 1].list
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $dg[nid] = jdata.data;
            }
        }
    })
}

//打开资料类型详细页面
function openDetai(operation, pkid) {
    var title_ = $.i18n.t('EO详细页');
    ShowWindowIframe({
        width: "800",
        height: "400",
        title: title_,
        param: {operation: operation, pkid: pkid, eoPkid: param.pkid},
        url: "tlSub/" + 'tlimitViAdd.shtml'
    });
}

var pidIndex = 0;

//获取父节点
function getrowPid(nid) {
    if (!gdsFunctionCode['dg' + nid].pid) {
        return "0"
    }
    if (pidIndex < 2) {
        pidIndex++;
        return "-1";
    }
    var row;
    if(nid == "2"){
        if(fcBgPkid != -1){
            return fcBgPkid
        }else{
            return "-2";
        }
    }else if(nid == "5"){
        if(rcBgPkid != -1){
            return rcBgPkid
        }else{
            return "-2";
        }
    }else{
        row = $('#dg' + gdsFunctionCode["dg" + nid].pid).datagrid('getSelected');
    }

    if (!row) {
        return "-2";
    }
    if (!row.PKID) {
        return "-2";
    }
    return row.PKID;
}

//表格 新增数据
function addFcBg(nid) {
    if (!param.pkid) {
        MsgAlert({content: "请先保存时限分组编号", type: 'error'});
        return;
    }
    let pid = getrowPid(nid);
    if (parseInt((nid - 1) / 3) == 0) {
        let is = $('#ifFcNote').is(':checked') ? "Y" : "N";
        if ('Y' == is) {
            MsgAlert({content: "首检 非机构化 不可添加", type: 'error'});
            return;
        }
    }
    if (parseInt((nid - 1) / 3) == 1) {
        let is = $('#ifRcNote').is(':checked') ? "Y" : "N";
        if ('Y' == is) {
            MsgAlert({content: "复检 非机构化 不可添加", type: 'error'});
            return;
        }
    }
    if (nid == 7) {
        let is = $('#ifVi').is(':checked') ? "Y" : "N";
        if ('Y' != is) {
            MsgAlert({content: "请选中 可变间隔", type: 'error'});
            return;
        }
    }
    if (gdsFunctionCode["dg" + nid].pid) {
        if(gdsFunctionCode["dg"+nid].pid == "1"){ //首检大组
            pid = fcBgPkid;
        }else if(gdsFunctionCode["dg"+nid].pid == "4"){
            pid = rcBgPkid;
        }else{
            let row = $('#dg' + gdsFunctionCode["dg" + nid].pid).datagrid('getSelected');
            if (!row) {
                if (3 == nid) {
                    MsgAlert({content: "请选中首检小组数据！", type: 'error'});
                }
                if (6 == nid) {
                    MsgAlert({content: "请选中重检小组数据！", type: 'error'});
                }
                return;
            }
            if (!row.PKID) {
                if (3 == nid) {
                    MsgAlert({content: "请编辑保存首检小组数据！", type: 'error'});
                }
                if (6 == nid) {
                    MsgAlert({content: "请编辑保存重检小组数据！", type: 'error'});
                }
                return;
            }
            pid = row.PKID;
        }
    }

    $('#dg' + nid).datagrid('appendRow', {});
}


// 保存
function save(oper) {
    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;
    var $form = $("#mform");
    var datas = $form.serializeObject();
    var checkboxs = {};
    $('input:checkbox').each(function () {
        checkboxs[$(this).attr('id')] = $(this).is(':checked') ? "Y" : "N";
    });


    datas = $.extend({eoPkid: param.eoPkid},
        datas, checkboxs, {FunctionCode: 'EM_EO_TLIMIT_GROUP_ADD'});
    InitFuncCodeRequest_({
        async : false,
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                param.OWindow.reload_("#dg1");
                operation = "edit";
                param.pkid = jdata.data.pkid;
                $("#pkid").val(param.pkid);
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});

            } else {
                MsgAlert({content: jdata.msg ? jdata.msg.replace("msg_err:", "") : jdata.data, type: 'error'});
            }
        }
    });
	if("add" != oper){
        var msg = '';
        msg = saveFC();
        if(ifCf && !msg){
            msg = '';
            msg += saveRC();
        }
        if(msg && msg != 'undefined'){
            MsgAlert({content: msg, type: 'error'});
        }else{
            MsgAlert({content:'保存成功'});
        }
    }			 
}

//刷新表格
function reload_(nid) {
    if (parseInt((nid - 1) / 3) < 2) {
        let i = nid;
        let ppid = getrowPid(nid.toString());
        if(nid != 1 && nid != 4){
            $('#dg' + nid).datagrid("reload", {pkid: param.pkid, pid: ppid});
            for (let i = nid; parseInt(i % 3) != 0; i++) {
                let num = parseInt(1 + Number(i));
                let pid = getrowPid(num.toString());
                $('#dg' + num).datagrid("reload", {pkid: param.pkid, pid: pid});
            }
        }else{
            for (let i = nid; parseInt(i % 3) != 0; i++) {
                let num = parseInt(1 + Number(i));
                let pid = getrowPid(num.toString());
                $('#dg' + num).datagrid("reload", {pkid: param.pkid, pid: pid});
            }
        }

    } else {
        $('#dg' + nid).datagrid("reload", {pkid: param.pkid, pid: getrowPid(nid)});
    }
    param.OWindow.reload_();
}


//刷新时限分组表格
function reload9_() {
    $('#dg9').datagrid("reload", {tlimitGroupPkid: param.pkid});
    param.OWindow.reload_();
}

//绑定复选框事件
$(":checkbox").each(function () {

        $(this).change(function () {

            if (!param.pkid) {
                MsgAlert({content: "请先保存时限分组编号", type: 'error'});
                $(this).prop("checked", false);
                return;
            }

            let radioName = $(this).attr('name');
            let is = $(this).is(":checked");

            //重检NOTE
            if (radioName == "ifRcNote") {
                if (is) {
                    if (!confirm("切换将清空结构化数据，是否确认？")) {
                        $(this).prop("checked", ifRcNote ? true : false);
                        $(this).removeAttr("checked");
                        return;
                    }
                } else {
                    if (!confirm("切换将清空非结构化数据，是否确认？")) {
                        $(this).prop("checked", ifRcNote ? true : false);
                        $(this).prop("checked", true);
                        return;
                    }
                }

                if (is) {
                    //允许编辑首检说明
                    //$("#rcNote").textbox({editable: true, onlyview: false, multiline: true});
                    $('#rcNote').removeAttr('disabled');
                    $("#ifVi").removeAttr("checked");
                    $('#div7').hide();
                    //删除结构化数据
                    //并刷新节点
                    InitFuncCodeRequest_({
                        data: {tlimitGroupPkid: param.pkid, FunctionCode: "EM_EO_TLIMIT_RC_DELALL"},
                        async: false,
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                /*$('#rcBgPrinciple').combobox('setValue', "");
                                $('#rcBgNo').val("");
                                rcBgPkid = -1;
                                reload_(4);*/
                                InitFuncCodeRequest_({
                                    data: {tlimitGroupPkid: param.pkid, FunctionCode: "EM_EO_TLIMIT_VI_DELALL"},
                                    async: false,
                                    successCallBack: function (jdata) {
                                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                            save('add');
                                            appendRcResetTable();
                                            loadSelect('rc');
                                            //reload_(7);
                                            MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                        } else {
                                            MsgAlert({content: jdata.msg, type: 'error'});
                                        }
                                    }
                                });
                                //MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                } else {
                    //结构化
                    //$("#rcNote").textbox({editable: false, onlyview: true, multiline: true});
                    //清空非结构化数据
                    $("#rcNote").val('');
                    $('#rcNote').attr('disabled', 'disabled');
                    save('add');
                    appendRcResetTable();
                    loadSelect('rc');
                }
            }

            //首检NOTE
            if (radioName == "ifFcNote") {
                if (is) {
                    if (!confirm("切换将清空结构化数据，是否确认？")) {
                        $(this).prop("checked", ifRcNote ? true : false);
                        $(this).removeAttr("checked");
                        return;
                    }
                } else {
                    if (!confirm("切换将清空非结构化数据，是否确认？")) {
                        $(this).prop("checked", ifRcNote ? true : false);
                        $(this).prop("checked", true);
                        return;
                    }
                }

                if (is) {
                    //允许编辑首检说明
                    //$("#fcNote").textbox({editable: true, onlyview: false, multiline: true});
                    $('#fcNote').removeAttr('disabled');
                    $("#ifSetIl").textbox({value:'',disabled:true});
                    $("#initialLead").textbox({value:'',disabled:true});
                    //删除结构化数据
                    //并刷新节点
                    InitFuncCodeRequest_({
                        data: {tlimitGroupPkid: param.pkid, FunctionCode: "EM_EO_TLIMIT_FC_DELALL"},
                        async: false,
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                /*$('#fcBgPrinciple').combobox('setValue', "");
                                $('#ifSetIl').combobox('setValue', "");
                                $('#initialLead').textbox('setValue', "");
                                $('#fcBgNo').val("");
                                fcBgPkid = -1;*/
                                save('add');
                                appendResetTable(); //清空页面数据
                                loadSelect('fc');
                                //reload_(1);
                                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                } else {
                    //清空非结构化数据
                    $('#fcNote').val('');
                    $('#fcNote').attr('disabled', 'disabled');
                    $("#ifSetIl").textbox({disabled:false});
                    $("#initialLead").textbox({disabled:false});
                    save('add');
                    appendResetTable(); //清空页面数据
                    loadSelect('fc');
                }
            }

            //是否可变间隔
            if (radioName == "ifVi") {
                //选中是否可变间隔
                if (is) {
                    if (!confirm("切换将清空重检数据，是否确认？")) {
                        $(this).prop("checked", ifRcNote ? true : false);
                        $(this).removeAttr("checked");
                        return;
                    }
                } else {
                    if (!confirm("切换将清空可变数据，是否确认？")) {
                        $(this).prop("checked", ifRcNote ? true : false);
                        $(this).prop("checked", true);
                        return;
                    }
                }


                if (!is) {
                    //允许编辑首检说明
                    //$("#fcNote").textbox({editable: true, onlyview: false, multiline: true});
                    $('#fcNote').removeAttr('disabled');
                    //删除结构化数据
                    //并刷新节点
                    InitFuncCodeRequest_({
                        data: {tlimitGroupPkid: param.pkid, FunctionCode: "EM_EO_TLIMIT_VI_DELALL"},
                        async: false,
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                save('add');
                                appendRcResetTable(); //清空页面数据
                                loadSelect('rc');
                                $('#div7').hide();
                                reload_(7);
                                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }else{
                    //删除重检结构化数据
                    //并刷新节点
                    $('#ifRcNote').removeAttr("checked");
                    //$("#rcNote").textbox({editable: false, onlyview: true, multiline: true});
                    $("#rcNote").val('');
                    $('#rcNote').attr('disabled', 'disabled');

                    InitFuncCodeRequest_({
                        data: {tlimitGroupPkid: param.pkid, FunctionCode: "EM_EO_TLIMIT_RC_DELALL"},
                        async: false,
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                /*$('#rcBgPrinciple').combobox('setValue', "");
                                $('#rcBgNo').val("");
                                rcBgPkid = -1;*/
                                save('add');
                                appendRcResetTable();
                                loadSelect('rc');
                                $('#div7').show();
                                $('#dg7').datagrid('resize');
                                //reload_(4);
                                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        });
    }
);


//添加时限 适用性分组 表格初始化
function InitDataGrid9() {
    var identity = 'dg9';
    $("#dg9").MyDataGrid({
            identity: identity,
            sortable: true,
            pagination: false,
            queryParams: {tlimitGroupPkid: param.pkid},
            resize: function () {
                return tabs_standard_resize($("#sp1"), 0.13, 0.0001, 0, 0);
            },
            columns: {
                param: {FunctionCode: detailFun},
                alter: {
                    STATUS: {
                        formatter: function (value, row, index) {
                            return PAGE_DATA['status'] [value];
                        }
                    }
                }

            },
            onLoadSuccess: function (data) {
            },

            contextMenus: [
                /*{
                    id: "", text: "删除", auth: "",
                    onclick: function () {
                        //var rowData = $('#dg9').datagrid('getSelected');
                        if(!confirm('确定删除?')){
                            return;
                        }
                        InitFuncCodeRequest_({
                            async : false,
                            data: {pkid: param.pkid, FunctionCode: "EM_EO_TLIMIT_DEL"},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: '操作成功'});
                                    $("#dg9").datagrid("reload");
                                } else {
                                    MsgAlert({content: jdata.msg, type: 'error'});
                                }
                            }
                        })
                    }
                }*/
            ],
            onClickRow: function (rowIndex, rowData) {
            },
            onDblClickRow: function (index, field, value) {
            }
        }
    );
}

//驼峰转下划线
function toLine(name) {
    return name.replace(/([A-Z])/g, "_$1").toLowerCase();
}

//添加适用性
function addApp() {
    debugger;
    if (!param.pkid) {
        MsgAlert({content: "请先保存时限分组编号", type: 'error'});
        return;
    }
    var title_ = $.i18n.t('EA时限添加适用性');
    ShowWindowIframe({
        width: "500",
        height: "500",
        title: title_,
        param: {operation: operation, applyType: param.applyType, pkid: param.pkid, eoPkid: param.eoPkid},
        url: "tlSub/EmEoTilmitAppAdd.shtml"
    });
}

function viewApp() {
    if(!param.pkid){
        MsgAlert({content: "请先保存时限分组编号", type: 'error'});
        return;
    }
    var title_ = $.i18n.t('EA时限查看适用性');
    ShowWindowIframe({
        width: "500",
        height: "500",
        title: title_,
        param: {operation: 'view', applyType: param.applyType, pkid: param.pkid, eoPkid: param.eoPkid},
        url: "tlSub/EmEoTilmitAppAdd.shtml"
    });
}

//检测到期时间
function checkDeadLine(){
    if(param.applyType != 'APL'){
        MsgAlert({content: '暂不支持部件和发动机', type: 'error'});
        return;
    }
    MaskUtil.mask('正在计算...');
    InitFuncCodeRequest_({
        data: {eoPkid: param.eoPkid, pkid: param.pkid,
            FunctionCode: "EM_EO_TLIMIT_CHECK_DEADLINE"},
        successCallBack: function (jdata) {
            MaskUtil.unmask();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                showResult(jdata.data);
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function showResult(data){
    ShowWindowIframe({
        width: "850",
        height: "420",
        param: {
            data : data
        },
        url: "/views/em/emea/edit/tlComputeResult.shtml"
    });
}

$.extend($.fn.validatebox.defaults.rules, {
    intOrFloat: {// 验证整数或小数
        validator: function (value) {
            return /^(0\.0*[1-9]+[0-9]*$|[1-9]+[0-9]*\.[0-9]*[0-9]$|[1-9]+[0-9]*$)/.test(value);
        },
        message: '请输入0~999999范围的数字'
    },
    maxValue: {
        validator: function (value) {
            return value <= 999999;
        },
        message: '请输入0~999999范围的数字'
    },
    comboBoxEditvalid: { //校验下拉菜单
        validator: function (value, param) {
            var $combobox = $("#" + param[0]);
            if (value) {
                if ($combobox.combobox('getValue') == $combobox.combobox('getText'))
                    return false;
                return true;
            }
            return false;

        },
        message: '请选择下拉框选项，不要直接使用输入内容'
    },
});


//扩展datagrid
$.extend($.fn.datagrid.methods, {
    currentRowIndex: function (jq, obj) {
        return $(obj).closest("tr.datagrid-row")[0].rowIndex;
    },
    changeEditor: function (jq, p) {
        return jq.each(function () {
            var dg = $(this);

            var index = p.index;
            if (typeof (index) != "number") {
                index = $(index).closest("tr.datagrid-row")[0].rowIndex;
            }

            var editor = dg.datagrid('getEditor', { index: index, field: p.field });
            var diveitor = $(editor.target).closest("div.datagrid-cell");
            var editortd = $(editor.target).parent();
            var opts = dg.datagrid("options");
            var _15d, _15e;
            if (typeof p.editor == "string") {
                _15d = p.editor;
            } else {
                _15d = p.editor.type;
                _15e = p.editor.options;
            }
            editortd.empty();
            var _15f = opts.editors[_15d];
            $.data(diveitor[0], "datagrid.editor", { actions: _15f, target: _15f.init(editortd, _15e), field: p.field, type: _15d, oldHtml: editor.oldHtml });
            var row = opts.finder.getRow(dg[0], index);
            var ed = $.data(diveitor[0], "datagrid.editor");
            ed.actions.setValue(ed.target, row[p.field]);
            ed.actions.resize(ed.target, diveitor.width());
        });
    },
    getEditorValue: function (jq, p) {

        var dg = jq;

        var index = p;
        if (typeof (index) != "number") {
            index = $(index).closest("tr.datagrid-row")[0].rowIndex;
        }
        var opts = dg.datagrid("options");
        var tr = opts.finder.getTr(dg[0], index);
        var row = opts.finder.getRow(dg[0], index);



        var _14d = $.extend({}, row);
        tr.find("div.datagrid-editable").each(function () {
            var _14e = $(this).parent().attr("field");
            var ed = $.data(this, "datagrid.editor");
            var t = $(ed.target);
            var _14f = t.data("textbox") ? t.textbox("textbox") : t;
            _14f.triggerHandler("blur");
            var _150 = ed.actions.getValue(ed.target);
            _14d[_14e] = _150;
        });

        return _14d;
    },
    setEditorValue: function (jq, p) {
        return jq.each(function () {
            var dg = $(this);

            var index = p.index;
            if (typeof (index) != "number") {
                index = $(index).closest("tr.datagrid-row")[0].rowIndex;
            }
            var opts = dg.datagrid("options");
            var tr = opts.finder.getTr(dg[0], index);
            var row = opts.finder.getRow(dg[0], index);
            var value = p.value || {};


            var _14d = $.extend({}, row);
            tr.find("div.datagrid-editable").each(function () {
                var _14e = $(this).parent().attr("field");
                if (value[_14e] !== undefined) {
                    var ed = $.data(this, "datagrid.editor");
                    var t = $(ed.target);
                    ed.actions.setValue(ed.target, value[_14e]);
                }
            });

        });
    }
});

//---时限START
//初始化首检
function initFc() {
    InitFuncCodeRequest_({
        data: {
            pkid: param.pkid,
            FunctionCode: "EM_EO_TLIMIT_SELECT_FC"
        },
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                console.log(jdata.data);
                fcData = jdata.data;
                if(fcData.fcBg && fcData.fcSgList){
                    appendTable(fcData);
                }else{
                    appendResetTable();
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//初始化重检
function initRc() {
    InitFuncCodeRequest_({
        data: {
            pkid: param.pkid,
            FunctionCode: "EM_EO_TLIMIT_SELECT_RC"
        },
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                console.log(jdata.data);
                rcData = jdata.data;
                if(rcData && rcData.rcBg && rcData.rcSgList){
                    appendRcTable(rcData);
                }else{
                    appendRcResetTable();
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}


function initFcForm(data) {
    var bgPrinciple = data.fcBg.fcBgPrinciple;
    //设置大组原则
    if(!bgPrinciple){//大组原则为空，隐藏大组原则
        var bgPriNode = $(":radio[name$='vo.complianceTimes[0].eoSub1[0].firstLast']");
        bgPriNode.hide();
        bgPriNode.next('span').hide();
    }else{
        $(":radio[name$='vo.complianceTimes[0].eoSub1[0].firstLast'][value='" + bgPrinciple + "']").prop("checked", "checked");
    }
    //提前量
    var ifSetIl = data.fcBg.ifSetIl;
    var initialLead = data.fcBg.initialLead;
    if(!ifSetIl){
        ifSetIl = '';
    }
    $('#ifSetIl').combobox('setValue', ifSetIl);
    if(ifSetIl == 'Y'){
        $('#initialLead').textbox({onlyview:false, editable:true, value:initialLead});
    }
    var sgList = data.fcSgList;
    for(var i = 0; i< sgList.length; i++) {
        //设置小组原则
        var sgPrinciple = sgList[i].sg.fcSgPrinciple;
        if(!sgPrinciple){//小组原则为空，则隐藏小组原则
            var sgPriNode = $(":radio[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].firstLast']");
            sgPriNode.hide();
            sgPriNode.next('span').hide();
        }else{
            $(":radio[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].firstLast'][value='" + sgPrinciple + "']").prop("checked", "checked");
        }
        var vList = sgList[i].fcVList;
        for (var j = 0; j < vList.length; j++) {
            //设置首检值
            console.log(vList[j].fcUnit);
            console.log(vList[j].fcValue);
            var valueNode = $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].startingValue']");
            if(vList[j].fcUnit == 'YJJ'){
                $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].startingValue']").attr('disabled', 'disabled');
                $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].isPost']").attr('disabled', 'disabled');
                $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].isSince']").attr('disabled', 'disabled');
            }
            if(vList[j].fcUnit == 'DATE'){
                //20191015
                /*if(param.applyType == 'ENG'){
                    $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].isPost']").attr('disabled', 'disabled');
                    $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].isSince']").attr('disabled', 'disabled');
                    valueNode.datepicker({
                        dateFormat: 'yy-mm-dd',
                        changeMonth: true,
                        changeYear: true,
                        yearRange: 'c-70:c+5'
                    });
                    valueNode.attr('readonly', 'readonly');
                }else{*/
                    valueNode.attr('disabled', 'disabled');
                    valueNode.parent('td').hide();
                    var isPostNode = valueNode.parent('td').next();
                    var postTypeNodeTd = isPostNode.next();
                    isPostNode.hide();
                    postTypeNodeTd.hide();
                //}

            }
            //$("input[name='vo.complianceTimes[0].eoSub1[0].eoSub2["+i+"].eoSub3["+j+"].startingLabel']").find("option[value='MO']").prop("selected", true);
            $("[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].startingLabel']").val(vList[j].fcUnit);
            valueNode.val(vList[j].fcValue);

            if(param.applyType == 'APL' || param.applyType == 'PART'){
                var ifPost = vList[j].ifPost;
                var postType = vList[j].postFileType;
                if(ifPost && ifPost == 'Y'){
                    var ifPostNode = $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].isPost']");
                    var postTypeNode = ifPostNode.parent('td').next();
                    var postNode = ifPostNode.parent('td').next().next();
                    var eoSearchNode = postNode.next();
                    ifPostNode.prop("checked", "checked");
                    $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].postType']").val(postType);
                    if(postType && postType == 'DATE'){
                        if(vList[j].fcUnit == 'DATE'){
                            postTypeNode.hide();
                        }else{
                            postTypeNode.show();
                        }
                        var postDate = vList[j].postDate;
                        if(postDate){
                            postDate = postDate.substr(0,10);
                        }else{
                            postDate = '';
                        }
                        var postDateNode = $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].post']");
                        postDateNode.datepicker({
                            dateFormat: 'yy-mm-dd',
                            changeMonth: true,
                            changeYear: true,
                            yearRange: 'c-70:c+5'
                        });
                        postDateNode.val(postDate);
                        postDateNode.attr('readonly', 'readonly');
                    }else if(postType == 'PTF' || postType == 'OVERHAUL'){
                        postTypeNode.show();
                        $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].post']").attr('disabled', 'disabled');
                    }else{
                        postTypeNode.show();
                        $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].post']").val(vList[j].postFileNo);
                    }

                    postNode.show();
                    if(postType && postType == 'EO'){
                        $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].post']").attr('readonly', 'readonly');
                        eoSearchNode.show();
                    }
                }

            }
            if(param.applyType == 'ENG'){
                //20191015
                var ifPost = vList[j].ifPost;
                var postType = vList[j].postFileType;
                if(ifPost && ifPost == 'Y'){
                    var ifPostNode = $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].isPost']");
                    var postTypeNode = ifPostNode.parent('td').next();
                    var postNode = ifPostNode.parent('td').next().next();
                    ifPostNode.prop("checked", "checked");
                    $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].postType']").val(postType);
                    if(postType && postType == 'DATE'){

                        postTypeNode.hide();
                        var postDate = vList[j].postDate;
                        if(postDate){
                            postDate = postDate.substr(0,10);
                        }else{
                            postDate = '';
                        }
                        var postDateNode = $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].post']");
                        postDateNode.datepicker({
                            dateFormat: 'yy-mm-dd',
                            changeMonth: true,
                            changeYear: true,
                            yearRange: 'c-70:c+5'
                        });
                        postDateNode.val(postDate);
                        postDateNode.attr('readonly', 'readonly');
                    }
                    postNode.show();
                }

                //--------------------------------------------------------20191015 END

                var ifSince = vList[j].ifSince;
                var sinceType = vList[j].sinceType;
                var deadLineNode = $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].deadLine']");
                var ifSinceNode = $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].isSince']");
                if(postType == 'DATE'){
                    ifSinceNode.prop("disabled", "true");
                }
                if(ifSince && ifSince == 'Y'){
                    ifSinceNode.prop("checked", "checked");
                    var sinceTypeNode = ifSinceNode.parent('td').next();
                    sinceTypeNode.show();
                    sinceTypeNode.find('select').show();
                    $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].sinceType']").val(vList[j].sinceType);
                    //deadLineNode.attr('disabled', 'disabled');
                    if(sinceType && sinceType == 'DATE'){
                        deadLineNode.parent('td').show();
                        deadLineNode.show();
                        deadLineNode.datepicker({
                            dateFormat: 'yy-mm-dd',
                            changeMonth: true,
                            changeYear: true,
                            yearRange: 'c-70:c+5'
                        });
                        var deadLine = vList[j].deadline;
                        if(deadLine){
                            deadLine = deadLine.substr(0,10);
                        }else{
                            deadLine = '';
                        }
                        deadLineNode.val(deadLine);
                        deadLineNode.attr('readonly', 'readonly');
                    }
                }/*else{
                    if(param.applyType == 'PART'){
                        var deadLine = vList[j].deadline;
                        if(deadLine){
                            deadLine = deadLine.substr(0,10);
                        }else{
                            deadLine = '';
                        }

                        deadLineNode.datepicker({
                            dateFormat: 'yy-mm-dd'
                        });
                        deadLineNode.val(deadLine);
                    }
                }*/

            }
        }
    }
    //首检有数据，NOTE一定未选中
    $('#fcNote').attr('disabled', 'disabled');
}


function initRcForm(data) {
    var bgPrinciple = data.rcBg.rcBgPrinciple;
    //设置大组原则
    if(!bgPrinciple){//大组原则为空，则隐藏大组原则
        var bgPriNode = $(":radio[name$='vo.complianceTimes[0].eoSubRc1[0].firstLast']");
        bgPriNode.hide();
        bgPriNode.next('span').hide();
    }else{
        $(":radio[name$='vo.complianceTimes[0].eoSubRc1[0].firstLast'][value='" + bgPrinciple + "']").prop("checked", "checked");
    }
    var sgList = data.rcSgList;
    for(var i = 0; i< sgList.length; i++) {
        //设置小组原则
        var sgPrinciple = sgList[i].rcSg.rcSgPrinciple;
        if(!sgPrinciple){//小组原则为空，则隐藏小组原则
            var sgPriNode = $(":radio[name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[" + i + "].firstLast']");
            sgPriNode.hide();
            sgPriNode.next('span').hide();
        }else{
            $(":radio[name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[" + i + "].firstLast'][value='" + sgPrinciple + "']").prop("checked", "checked");
        }
        var vList = sgList[i].rcVList;
        for (var j = 0; j < vList.length; j++) {
            //设置重检值
            console.log(vList[j].rcUnit);
            console.log(vList[j].rcValue);
            $("[name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[" + i + "].eoSubRc3[" + j + "].rcStartingLabel']").val(vList[j].rcUnit);
            $(":input[name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[" + i + "].eoSubRc3[" + j + "].startingValue']").val(vList[j].rcValue);
            /*var deadLineNode = $(":input[name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].deadLine']");
            if(param.applyType == 'PART' ){
                var ifSince = vList[j].ifSince;
                var sinceType = vList[j].sinceType;
                if(ifSince && ifSince == 'Y'){
                    var ifSinceNode = $(":input[name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[" + i + "].eoSubRc3[" + j + "].isSince']");
                    ifSinceNode.prop("checked", "checked");
                    var sinceTypeNode = ifSinceNode.parent('td').next();
                    sinceTypeNode.show();
                    sinceTypeNode.find('select').show();
                    $(":input[name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[" + i + "].eoSubRc3[" + j + "].sinceType']").val(vList[j].sinceType);
                    deadLineNode.attr('disabled', 'disabled');
                }else{
                    if(param.applyType == 'PART'){
                        var deadLine = vList[j].deadline;
                        if(deadLine){
                            deadLine = deadLine.substr(0,10);
                        }else{
                            deadLine = '';
                        }
                        deadLineNode.datepicker({
                            dateFormat: 'yy-mm-dd'
                        });
                        deadLineNode.val(deadLine);
                    }
                }

            }*/
        }
    }
    //重检有数据，NOTE一定未选中
    $('#rcNote').attr('disabled', 'disabled');
}

//首检值列表显示
function fcVTitleShow(applyType){
    if(applyType == 'APL'){
        $('[name$="isSince"]').css('display', 'none');
        $('[name$="sinceType"]').css('display', 'none');
        $('[name$="deadLine"]').css('display', 'none');
    }
    if(applyType == 'ENG'){
        $('[name$="sinceType"]').css('display', 'none');
        $('[name$="deadLine"]').css('display', 'none');

        //后加逻辑(不要post, 重检不要since)
        $('[name$="isPost"]').css('display', 'none');
        $('#appendTableRc').find('[name$="isSince"]').css('display', 'none');
    }
    if(applyType == 'PART'){
        //$('[name$="isPost"]')[0].style.display = 'none';
        //后加逻辑：去掉Since和截止日期，加入post
        //$('[name$="isPost"]').css('display', 'none');
        $('[name$="isSince"]').css('display', 'none');
        $('[name$="sinceType"]').css('display', 'none');
        $('[name$="deadLine"]').css('display', 'none');

    }

}


function loadSelect(type) {
	//首检单位
    if(type == 'fc'){
        for(var i = 0; i<fcUnits.length; i++){
            var opt = "<option value='" + fcUnits[i].VALUE + "'>" + fcUnits[i].TEXT + "</option>";
            $("[name$='startingLabel']").append(opt);
        }

        //POST类型
        var opt1 = "<option value=''>--Select--</option>";
        $("select[name$='postType']").append(opt1);
        for(var i = 0; i<postTypes.length; i++){
            var opt = "<option value='" + postTypes[i].VALUE + "'>" + postTypes[i].TEXT + "</option>";
            $("select[name$='postType']").append(opt);
        }

        //SINCE类型
        var opt0 = "<option value=''>--Select--</option>";
        $("select[name$='eoSub3[0].sinceType']").append(opt0);
        for(var i = 0; i<sinceTypes.length; i++){
            var opt = "<option value='" + sinceTypes[i].VALUE + "'>" + sinceTypes[i].TEXT + "</option>";
            $("select[name$='eoSub3[0].sinceType']").append(opt);
        }
    }
    //重检单位
    if(type == 'rc'){
        for(var i = 0; i<rcUnits.length; i++){
            var opt = "<option value='" + rcUnits[i].VALUE + "'>" + rcUnits[i].TEXT + "</option>";
            $("[name$='rcStartingLabel']").append(opt);
        }

        var opt0 = "<option value=''>--Select--</option>";
        $("select[name$='eoSubRc3[0].sinceType']").append(opt0);
        for(var i = 0; i<sinceTypes.length; i++){
            var opt = "<option value='" + sinceTypes[i].VALUE + "'>" + sinceTypes[i].TEXT + "</option>";
            $("select[name$='eoSubRc3[0].sinceType']").append(opt);
        }
    }
}

function postValue() {
    var data = [];
    if(eoNos){
        for(var i = 0; i< eoNos.length; i++){
            data.push({'value':eoNos[i].EO_NO, 'label': eoNos[i].EO_NO});
        }
    }
    return data;
}

function openList(obj) {
    var attrName = $(obj).parent().prev().find('input');
    ShowWindowIframe({
        width: 450,
        height: 350,
        param:{applyType: param.applyType, eoEa: 'EO', eoNo: attrName.val(), attrName: attrName},
        title: "EO选择",
        url: "/views/em/emeo/edit/EmEoPostEoList.shtml"
    });
}

function setEojcNo(eoNo, attrName) {
    attrName.val(eoNo);
    //$('input[name="+attrName+"]').val(eoNo);
}
//首检table
function appendTable(data) {
    var str = '';
    str = str+"<tr>";
    //小组
    str = str + "<td width='80%'>";
    str = str + "<table  width='100%' border='0' cellspacing='0' cellpadding='0'>";
    str= str + "<tr>";
    str= str + "<td width='95%' style='border:none'>";
    str = str + "<table width='100%' border='0' cellspacing='0' cellpadding='0' class='table_sub_1'>";
    var sgList = data.fcSgList;
    for(var i = 0; i< sgList.length; i++){
        str = str + "<tr name='fcSgTr'>";
        str = str + "<td width='75%' style='border:solid #ccc 1px;'>";
        str = str + "<table border='1' cellpadding='0' cellspacing='0' bordercolor='#B2C9E0' class='table-zi' style='margin:5px;padding: 5px'>";
        var vList = sgList[i].fcVList;
        for(var j=0; j<vList.length; j++){
            str = str + "<tr>" +
                "<td style='padding: 3px' width='10%'>" +
                "<select name='vo.complianceTimes[0].eoSub1[0].eoSub2["+i+"].eoSub3["+j+"].startingLabel' class='doc_type' onchange='value_change_first(this)'>" +
                "</select>" +
                "</td>" +
                "<td style='padding: 3px' width='15%' class='remove_content_td'>" + "<input type='text' style='width: 90px' class='{rangelength:[0,100]}'" +
                "name='vo.complianceTimes[0].eoSub1[0].eoSub2["+i+"].eoSub3["+j+"].startingValue'/>" +
                "</td>" +
                "<td style='padding: 3px'  width='15%' name='isPost' class='remove_content_td'>" +
                "<input type='checkbox' name='vo.complianceTimes[0].eoSub1[0].eoSub2["+i+"].eoSub3["+j+"].isPost' onclick='postClick(this)'>POST" +
                "</td>" +
                "<td width='10%' name='postType' style='display: none'>" +
                "<select style='margin: 3px' name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].postType' class='doc_type'  onchange='value_change_first(this)'>" +
                "</select>" +
                "</td>" +
                "<td width='15%' name='post' style='display: none'>" +
                "<input  type='text' name='vo.complianceTimes[0].eoSub1[0].eoSub2[" + i + "].eoSub3[" + j + "].post' style='margin: 3px;width: 110px'>" +
                "</td>" +
				"<td width='2%' style='display: none'>"+
                "<a href='javascript:' name='eoSearch' onclick='openList(this);' style='display: inline;margin: 1px;width:30px'><img src='../../../../../css/icons/2012092109942.png' alt='搜索'></a>"+
                "</td>"+																															 
                "<td width='15%' name='isSince' class='remove_content_td'>" +
                "<input type='checkbox' name='vo.complianceTimes[0].eoSub1[0].eoSub2["+i+"].eoSub3["+j+"].isSince' onclick='sinceClick(this)'>Since" +
                "</td>" +
                "<td width='10%' name='sinceType' style='display: none'>" +
                "<select name='vo.complianceTimes[0].eoSub1[0].eoSub2["+i+"].eoSub3["+j+"].sinceType' class='doc_type' onchange='value_change_first(this)'>" +
                "</select>" +
                "</td>" +
                "<td width='20%' name='deadLine'>" +
                "<input type='text' name='vo.complianceTimes[0].eoSub1[0].eoSub2["+i+"].eoSub3["+j+"].deadLine'/>" +
                "</td>"+
                "<td width='5%'>" +
                "<div>" +
                "<img id='del' onclick='del_query_tr_first(this);return false;' src='../../../../../css/icons/delete.png' style='margin-left: 5px;' />"+
                "</div>" +
                "</td>" +
                "</tr>";

        }
        str = str + "</table>";
        str = str + "</td>";
        str = str + "<td width='10%' style='border:solid #ccc 1px;'>" +
            "<div>" +
            "<img id='add' onclick='add_query_tr_first(this);return false;' src='../../../../../css/icons/add.png' style='margin-left: 10px;'/>"+
            "</div>" +
            "</td>" +
            "<td width='11%'>" +
            "<div>" +
            "<ul style='padding-left:0px'>" +
            "<li style='list-style:none'>" +
            "&nbsp;<input name='vo.complianceTimes[0].eoSub1[0].eoSub2["+i+"].firstLast' type='radio' value='XDWZ'  style='height:auto'/>" +
            "<span style=''>FIRST</span> </li>" +
            "</ul>" +
            "<ul style='padding-left:0px'>" +
            "<li style='list-style:none'>" +
            "&nbsp;<input name='vo.complianceTimes[0].eoSub1[0].eoSub2["+i+"].firstLast' type='radio' value='HDWZ' style='height:auto'/>" +
            "<span style=''>LAST</span> </li>" +
            "</ul>" +
            "</div>" +
            "</td>" +
            "<td style='display: none'>" +
            "<div><img id='del' onclick='del_query_tr_second(this);return false;' src='../../../../../css/icons/delete.png' style='margin-left: 5px;' /></div>" +
            "</td>";
        str = str + "</tr>";

    }
    str = str + "</table>";
    str = str + "</td>";
    str = str + "<td width='5%' style='border:none;display: none'>" +
        "<div><img id='add' onclick='add_query_tr_second(this);return false;' src='../../../../../css/icons/add.png' style='margin-left: 10px;'/></div>" +
        "</td>";
    str = str + "</tr>";
    str = str + "</table>";
    str = str + "</td>";
    //大组
    str = str + "<td width='8%' style='border-right:none; border-top:none; border-bottom:none; display: none'>" +
        "<div>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSub1[0].firstLast' type='radio' style='height:auto' value='XDWZ'/>" +
        "<span style=''>FIRST</span> </li>" +
        "</ul>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSub1[0].firstLast' type='radio' value='HDWZ' style='height:auto'/>" +
        "<span style=''>LAST</span> </li>" +
        "</ul>" +
        "</div>" +
        "</td>" +
        "<td width='12%' style='border-right:none; border-top:none; border-bottom:none;display: none'>" +
        "<textarea id='fcNote' class='{rangelength:[0,1000]}'" +
        "name='vo.complianceTimes[0].eoSub1[0].note' rows='4' style='width:100%;'></textarea>" +
        "<div class='errorMessage'></div>" +
        "</td>";
    str = str + "</tr>";
    console.log(str);
    $('#appendTable').html(str);
}

//首检table重置
function appendResetTable() {
    $('#appendTable').html("");
    var str = '';
    str = str+"<tr>";
    //小组
    str = str + "<td width='80%'>";
    str = str + "<table  width='100%' border='0' cellspacing='0' cellpadding='0'>";
    str= str + "<tr>";
    str= str + "<td width='95%' style='border:none'>";
    str = str + "<table width='100%' border='0' cellspacing='0' cellpadding='0' class='table_sub_1'>";
    str = str + "<tr name='fcSgTr'>";
    str = str + "<td width='75%' style='border:solid #ccc 1px;'>";
    str = str + "<table border='1' cellpadding='0' cellspacing='0' bordercolor='#B2C9E0' class='table-zi' style='margin:5px;padding: 5px'>";
    str = str + "<tr>" +
        "<td width='10%' style='padding: 3px'>" +
        "<select name='vo.complianceTimes[0].eoSub1[0].eoSub2[0].eoSub3[0].startingLabel' class='doc_type' onchange='value_change_first(this)'>" +
        "</select>" +
        "</td>" +
        "<td width='15%' class='remove_content_td' style='padding: 3px'>" +
        "<input type='text' style='width: 90px' class='{rangelength:[0,100]}'" +
        "name='vo.complianceTimes[0].eoSub1[0].eoSub2[0].eoSub3[0].startingValue'/>" +
        "</td>" +
        "<td style='padding: 3px' width='15%' name='isPost' class='remove_content_td'>" +
        "<input type='checkbox' name='vo.complianceTimes[0].eoSub1[0].eoSub2[0].eoSub3[0].isPost' onclick='postClick(this)'>POST" +
        "</td>" +
        "<td width='10%' name='postType' style='display: none'>" +
        "<select style='margin: 3px' name='vo.complianceTimes[0].eoSub1[0].eoSub2[0].eoSub3[0].postType' class='doc_type'  onchange='value_change_first(this)'>" +
        "</select>" +
        "</td>" +
        "<td width='15%' name='post' style='display: none'>" +
        "<input  type='text' name='vo.complianceTimes[0].eoSub1[0].eoSub2[0].eoSub3[0].post' style='margin: 3px;width: 150px'>" +
        "</td>" +
		"<td width='2%' style='display: none'>"+
        "<a href='javascript:' name='eoSearch' onclick='openList(this);' style='display: inline;margin: 1px;width:30px'><img src='../../../../../css/icons/2012092109942.png' alt='搜索'></a>"+
        "</td>"+														 
        "<td width='15%' name='isSince' class='remove_content_td'>" +
        "<input type='checkbox' name='vo.complianceTimes[0].eoSub1[0].eoSub2[0].eoSub3[0].isSince' onclick='sinceClick(this)'>Since" +
        "</td>" +
        "<td width='10%' name='sinceType' style='display: none'>" +
        "<select name='vo.complianceTimes[0].eoSub1[0].eoSub2[0].eoSub3[0].sinceType' class='doc_type' onchange='value_change_first(this)'>" +
        "</select>" +
        "</td>" +
        "<td width='20%' name='deadLine'>" +
        "<input type='text' name='vo.complianceTimes[0].eoSub1[0].eoSub2[0].eoSub3[0].deadLine'/>" +
        "</td>"+
        "<td width='5%'>" +
        "<div>" +
        "<img id='del' onclick='del_query_tr_first(this);return false;' src='../../../../../css/icons/delete.png' style='margin-left: 5px;' />" +
        "</div>" +
        "</td>" +
        "</tr>";
    str = str + "</table>";
    str = str + "</td>";
    str = str + "<td width='10%' style='border:solid #ccc 1px;'>" +
        "<div>" +
        "<img id='add' onclick='add_query_tr_first(this);return false;' src='../../../../../css/icons/add.png' style='margin-left: 10px;'/>" +
        "</div>" +
        "</td>" +
        "<td width='11%'>" +
        "<div>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSub1[0].eoSub2[0].firstLast' type='radio' value='XDWZ'  style='height:auto;display:none'/>" +
        "<span style='display:none'>FIRST</span> </li>" +
        "</ul>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSub1[0].eoSub2[0].firstLast' type='radio' value='HDWZ' style='height:auto;display:none'/>" +
        "<span style='display:none'>LAST</span> </li>" +
        "</ul>" +
        "</div>" +
        "</td>" +
        "<td style='display: none'>" +
        "<div><img id='del' onclick='del_query_tr_second(this);return false;' src='../../../../../css/icons/delete.png' style='margin-left: 5px;' /></div>" +
        "</td>";
    str = str + "</tr>";

    str = str + "</table>";
    str = str + "</td>";
    str = str + "<td width='5%' style='border:none; display: none'>" +
        "<div><img id='add' onclick='add_query_tr_second(this);return false;' src='../../../../../css/icons/add.png' style='margin-left: 10px;'/></div>" +
        "</td>";
    str = str + "</tr>";
    str = str + "</table>";
    str = str + "</td>";
    //大组
    str = str + "<td width='8%' style='border-right:none; border-top:none; border-bottom:none; display: none'>" +
        "<div>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSub1[0].firstLast' type='radio' style='height:auto;display:none' value='XDWZ'/>" +
        "<span style='display:none'>FIRST</span> </li>" +
        "</ul>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSub1[0].firstLast' type='radio' value='HDWZ' style='height:auto;display:none'/>" +
        "<span style='display:none'>LAST</span> </li>" +
        "</ul>" +
        "</div>" +
        "</td>" +
        "<td width='12%' style='border-right:none; border-top:none; border-bottom:none; display: none'>" +
        "<textarea id='fcNote' class='{rangelength:[0,1000]}'" +
        "name='vo.complianceTimes[0].eoSub1[0].note' rows='4' style='width:100%;'></textarea>" +
        "<div class='errorMessage'></div>" +
        "</td>";
    str = str + "</tr>";
    console.log(str);
    $('#appendTable').html(str);
    $('input[name$=deadLine]').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    
    fcVTitleShow(param.applyType);
	$("#initialLead").textbox({disabled:true});																				   
    var is = $('#ifFcNote').is(':checked');
    if(is){
        $('#appendTable').find('select').attr('disabled','disabled');
        $('#appendTable').find('input').attr('disabled','disabled');
        $("#ifSetIl").textbox({disabled:true});
        $('#fcNote').removeAttr('disabled');
    }else{
        $('#appendTable').find('select').removeAttr('disabled');
        $('#appendTable').find('input').removeAttr('disabled');
        $("#ifSetIl").textbox({disabled:false});
        //$("#initialLead").textbox({disabled:false});
        $('#fcNote').attr('disabled', 'disabled');
        //loadSelect();
    }
}




//重检Table
function appendRcTable(data) {
    var str = '';
    str = str+"<tr>";
    //小组
    str = str + "<td width='80%'>";
    str = str + "<table  width='100%' border='0' cellspacing='0' cellpadding='0'>";
    str= str + "<tr>";
    str= str + "<td width='95%' style='border:none'>";
    str = str + "<table width='100%' border='0' cellspacing='0' cellpadding='0' class='table_sub_1'>";
    var sgList = data.rcSgList;
    for(var i = 0; i< sgList.length; i++){
        str = str + "<tr name='rcSgTr'>";
        str = str + "<td width='75%' style='border:solid #ccc 1px;'>";
        str = str + "<table border='1' cellpadding='0' cellspacing='0' bordercolor='#B2C9E0' class='table-zi' style='margin:5px;padding: 5px'>";
        var vList = sgList[i].rcVList;
        for(var j=0; j<vList.length; j++){
            str = str + "<tr>" +
                "<td style='padding: 3px' width='10%'>" +
                "<select name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2["+i+"].eoSubRc3["+j+"].rcStartingLabel' class='doc_type' onchange='value_change_first(this)'>" +
                "</select>" +
                "</td>" +
                "<td style='padding: 3px' width='15%' class='remove_content_td'>" +
                "<input type='text' style='width: 90px' class='{rangelength:[0,100]}'" +
                "name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2["+i+"].eoSubRc3["+j+"].startingValue'/>" +
                "</td>" +
                "<td style='padding: 3px' width='15%' name='isSince' class='remove_content_td'>" +
                "<input type='checkbox' name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2["+i+"].eoSubRc3["+j+"].isSince' onclick='sinceClick(this)'>Since" +
                "</td>" +
                "<td width='10%' name='sinceType' style='margin-left: 5px;display: none'>" +
                "<select style='margin: 3px' name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[" + i + "].eoSubRc3[" + j + "].sinceType' class='doc_type' onchange='value_change_first(this)'>" +
                "</select>" +
                "</td>" +
                "<td width='20%' name='deadLine'>" +
                "<input type='text' name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2["+i+"].eoSubRc3["+j+"].deadLine'/>" +
                "</td>"+
                "<td width='5%'>" +
                "<div>" +
                "<img id='delRc' onclick='del_query_tr_first(this);return false;' src='../../../../../css/icons/delete.png' style='margin-left: 5px;' />" +
                "</div>" +
                "</td>" +
                "</tr>";

        }
        str = str + "</table>";
        str = str + "</td>";
        str = str + "<td width='10%' style='border:solid #ccc 1px;'>" +
            "<div>" +
            "<img id='addRc' onclick='add_query_tr_first(this);return false;' src='../../../../../css/icons/add.png' style='margin-left: 10px;'/>"+
            "</div>" +
            "</td>" +
            "<td width='11%'>" +
            "<div>" +
            "<ul style='padding-left:0px'>" +
            "<li style='list-style:none'>" +
            "&nbsp;<input name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2["+i+"].firstLast' type='radio' value='XDWZ'  style='height:auto'/>" +
            "<span style=''>FIRST</span> </li>" +
            "</ul>" +
            "<ul style='padding-left:0px'>" +
            "<li style='list-style:none'>" +
            "&nbsp;<input name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2["+i+"].firstLast' type='radio' value='HDWZ' style='height:auto'/>" +
            "<span style=''>LAST</span> </li>" +
            "</ul>" +
            "</div>" +
            "</td>" +
            "<td style='display: none'>" +
            "<div><img id='delRc' onclick='del_query_tr_second(this);return false;' src='../../../../../css/icons/delete.png' style='margin-left: 5px;' /></div>" +
            "</td>";
        str = str + "</tr>";

    }
    str = str + "</table>";
    str = str + "</td>";
    str = str + "<td width='5%' style='border:none; display: none'>" +
        "<div><img id='addRc' onclick='add_query_tr_second(this);return false;' src='../../../../../css/icons/add.png' style='margin-left: 10px;'/></div>" +
        "</td>";
    str = str + "</tr>";
    str = str + "</table>";
    str = str + "</td>";
    //大组
    str = str + "<td width='8%' style='border-right:none; border-top:none; border-bottom:none; display: none'>" +
        "<div>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSubRc1[0].firstLast' type='radio' style='height:auto' value='XDWZ'/>" +
        "<span style=''>FIRST</span> </li>" +
        "</ul>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSubRc1[0].firstLast' type='radio' value='HDWZ' style='height:auto'/>" +
        "<span style=''>LAST</span> </li>" +
        "</ul>" +
        "</div>" +
        "</td>" +
        "<td width='12%' style='border-right:none; border-top:none; border-bottom:none;display: none'>" +
        "<textarea id='rcNote' class='{rangelength:[0,1000]}'" +
        "name='vo.complianceTimes[0].eoSubRc1[0].note' rows='4' style='width:100%;'></textarea>" +
        "<div class='errorMessage'></div>" +
        "</td>";
    str = str + "</tr>";
    console.log(str);
    $('#appendTableRc').html(str);
}

//重置重检table
function appendRcResetTable() {
    $('#appendTableRc').html("");
    var str = '';
    str = str+"<tr>";
    //小组
    str = str + "<td width='80%'>";
    str = str + "<table  width='100%' border='0' cellspacing='0' cellpadding='0'>";
    str= str + "<tr>";
    str= str + "<td width='95%' style='border:none'>";
    str = str + "<table width='100%' border='0' cellspacing='0' cellpadding='0' class='table_sub_1'>";
    str = str + "<tr name='rcSgTr'>";
    str = str + "<td width='75%' style='border:solid #ccc 1px;'>";
    str = str + "<table border='1' cellpadding='0' cellspacing='0' bordercolor='#B2C9E0' class='table-zi' style='margin:5px;padding: 5px'>";
    str = str + "<tr>" +
        "<td style='padding: 10px' width='10%'>" +
        "<select name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[0].eoSubRc3[0].rcStartingLabel' class='doc_type' onchange='value_change_first(this)'>" +
        "</select>" +
        "</td>" +
        "<td style='padding: 3px' width='15%' class='remove_content_td'>" +
        "<input type='text' style='width: 90px' class='{rangelength:[0,100]}'" +
        "name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[0].eoSubRc3[0].startingValue'/>" +
        "</td>" +
        "<td style='padding: 3px' width='15%' name='isSince' class='remove_content_td'>" +
        "<input style='margin-left: 5px' type='checkbox' name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[0].eoSubRc3[0].isSince' onclick='sinceClick(this)'>Since" +
        "</td>" +
        "<td style='margin-left: 5px;display: none' width='10%' name='sinceType'>" +
        "<select name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[0].eoSubRc3[0].sinceType' class='doc_type' onchange='value_change_first(this)'>" +
        "</select>" +
        "</td>" +
        "<td style='padding: 3px' width='20%' name='deadLine'>" +
        "截止日期：<input type='text' name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[0].eoSubRc3[0].deadLine'/>" +
        "</td>"+
        "<td width='5%'>" +
        "<div>" +
        "<img id='delRc' onclick='del_query_tr_first(this);return false;' src='../../../../../css/icons/delete.png' style='margin-left: 5px;' />" +
        "</div>" +
        "</td>" +
        "</tr>";

    str = str + "</table>";
    str = str + "</td>";
    str = str + "<td width='10%' style='border:solid #ccc 1px;'>" +
        "<div>" +
        "<img id='addRc' onclick='add_query_tr_first(this);return false;' src='../../../../../css/icons/add.png' style='margin-left: 10px;'/>"+
        "</div>" +
        "</td>" +
        "<td width='11%'>" +
        "<div>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[0].firstLast' type='radio' value='XDWZ'  style='height:auto;display: none'/>" +
        "<span style='display: none'>FIRST</span> </li>" +
        "</ul>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSubRc1[0].eoSubRc2[0].firstLast' type='radio' value='HDWZ' style='height:auto;display: none'/>" +
        "<span style='display: none'>LAST</span> </li>" +
        "</ul>" +
        "</div>" +
        "</td>" +
        "<td style='display: none'>" +
        "<div><img id='delRc' onclick='del_query_tr_second(this);return false;' src='../../../../../css/icons/delete.png' style='margin-left: 5px;' /></div>" +
        "</td>";
    str = str + "</tr>";

    str = str + "</table>";
    str = str + "</td>";
    str = str + "<td width='5%' style='border:none; display: none'>" +
        "<div><img id='addRc' onclick='add_query_tr_second(this);return false;' src='../../../../../css/icons/add.png' style='margin-left: 10px;'/></div>" +
        "</td>";
    str = str + "</tr>";
    str = str + "</table>";
    str = str + "</td>";
    //大组
    str = str + "<td width='8%' style='border-right:none; border-top:none; border-bottom:none; display: none'>" +
        "<div>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSubRc1[0].firstLast' type='radio' style='height:auto;display: none' value='XDWZ'/>" +
        "<span style='display: none'>FIRST</span> </li>" +
        "</ul>" +
        "<ul style='padding-left:0px'>" +
        "<li style='list-style:none'>" +
        "&nbsp;<input name='vo.complianceTimes[0].eoSubRc1[0].firstLast' type='radio' value='HDWZ' style='height:auto;display: none'/>" +
        "<span style='display: none;'>LAST</span> </li>" +
        "</ul>" +
        "</div>" +
        "</td>" +
        "<td width='12%' style='border-right:none; border-top:none; border-bottom:none;display: none'>" +
        "<textarea id='rcNote' class='{rangelength:[0,1000]}'" +
        "name='vo.complianceTimes[0].eoSubRc1[0].note' rows='4' style='width:100%;'></textarea>" +
        "<div class='errorMessage'></div>" +
        "</td>";
    str = str + "</tr>";
    console.log(str);
    $('#appendTableRc').html(str);
    $('input[name$=deadLine]').datepicker({
        dateFormat: 'yy-mm-dd'
    });
    fcVTitleShow(param.applyType);
    var is = $('#ifRcNote').is(':checked');
	if(!ifCf){ //一次性EO无重检
        $('#appendTableRc').find('select').attr('disabled','disabled');
        $('#appendTableRc').find('input').attr('disabled','disabled');
        $('#rcNote').attr('disabled', 'disabled');
        $('#ifRcNote').attr('disabled', 'disabled');
        $('#ifVi').attr('disabled', 'disabled');
        $('#resetRc').attr('disabled', 'disabled');

    }else{
		if(is){
			$('#appendTableRc').find('select').attr('disabled','disabled');
			$('#appendTableRc').find('input').attr('disabled','disabled');
			$('#rcNote').removeAttr('disabled');
		}else{
			$('#appendTableRc').find('select').removeAttr('disabled');
			$('#appendTableRc').find('input').removeAttr('disabled');
			$('#rcNote').attr('disabled', 'disabled');
        //loadSelect();
		}
		var ifVi = $('#ifVi').is(':checked');
		if(ifVi){
			$('#appendTableRc').find('select').attr('disabled','disabled');
			$('#appendTableRc').find('input').attr('disabled','disabled');
			$('#rcNote').attr('disabled', 'disabled');
		}
    }
}

//时限END---
