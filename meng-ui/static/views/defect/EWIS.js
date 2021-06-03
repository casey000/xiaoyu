;(function($, window, document, undefined){
    var created = 0;
    var page_data = [];
    function create(url, cb){
        let tr = $(this).parent();
        let search_times = 0;
        while(!tr.is("tr")){
            tr = tr.parent();
            if(++search_times > 10){
                return
            }
        }
        tr.after("<tr id='ewisTable'><td colspan='99'></td></tr>");
        $("#ewisTable").children().load(url, cb);
        created = 1;
    }

    var defectType = {};
    function getEwisComponentTypeList(){
        InitFuncCodeRequest_({
            async: false,
            data: {
                domainCode: "EWIS_DD_COMPONENT_GROUP,DEFECT_LOCATION",
                FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
            },
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    var getDefectType =jdata.data["DEFECT_LOCATION"];
                    for(var i=0;i<getDefectType.length;i++){
                        var number = getDefectType[i].VALUE;
                        defectType[number] = getDefectType[i].TEXT;
                    }
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    };
    getEwisComponentTypeList();
    function init_data(){
        const COMPONENT_TYPE = {

        }
        let type_arr = [];
        for(let i = 0, len = page_data.length; i < len; i++){
            if(i > 0){
                ewis_plus();
            }
            if(page_data[i].lineEquipmentType == 1){
                var html = '';

                for(let j = 0 ; j < page_data[i].lineNumList.length ; j++){
                    html +=page_data[i].lineNumList[j].lineNum1 +'-'+page_data[i].lineNumList[j].lineNum2 +'-'+page_data[i].lineNumList[j].lineNum3 +'-'+page_data[i].lineNumList[j].lineNum4 + '<br/>'
                    $("#ewis_pnsn" + (i + 1)).html(html);

                }

            }else{
                $("#ewis_pnsn" + (i + 1)).html(page_data[i].allNumber);
                $("#ewis_pn" + (i + 1)).html(page_data[i].pn);

            }
            $("#ewis_defect_type_other_text" + (i + 1)).textbox("setValue", page_data[i].otherDescription);
            $("#ewis_stawlbl" + (i + 1)).html(page_data[i].staWlBl);
            var  ewis_componentSecType = {
                1:'线号',
                2:'设备号'
            };

            $("#lineEquipmentType" + (i + 1)).html(ewis_componentSecType[page_data[i].lineEquipmentType]);
            $("#defectLocaiton" + (i + 1)).html(defectType[page_data[i].defectLocation]);
            var obj = $('input[name ="treatmentMethod'+(i+1)+'"]');
            for(let j in obj){
                if (obj[j].value == page_data[i].treatmentMethod) {
                    obj[j].checked = true;
                }
                obj[j].disabled =true;
            }
            if(page_data[i].ewisType) type_arr = page_data[i].ewisType.split(",");
            for(let j = 0, len = type_arr.length; j < len; j++){
                $("#ewis_defectType" + (i+1)).checkboxList("check", type_arr[j])
            }
            $("#ewis_componentType" + (i + 1)).html(page_data[i].componentType);
            file_data_list(page_data[i].attachments, (i + 1));
        }
    }
    var deleteLineId = [];
    function set_data(){
        let type_arr = [];
        for(let i = 0, len = page_data.length; i < len; i++){
            if(i > 0){
                ewis_plus();
            }
            $("#ewisId" + (i + 1)).val(page_data[i].id);
            $("#ewis_pnsn" + (i + 1)).textbox("setValue", page_data[i].allNumber);
            $("#ewis_pn" + (i + 1)).textbox("setValue", page_data[i].pn);
            $("#ewis_stawlbl" + (i + 1)).textbox("setValue", page_data[i].staWlBl);
            $("#ewis_componentSecType" + (i + 1)).combobox("setValue",page_data[i].lineEquipmentType);
            $("#defectLocaiton" + (i + 1)).combobox("setValue",page_data[i].defectLocation);
            $("#defectLocaitonOther" + (i + 1)).val(page_data[i].otherDflcDes);
            var obj = $('input[name ="treatmentMethod'+(i+1)+'"]');
            for(let j in obj){
                if (obj[j].value == page_data[i].treatmentMethod) {
                    obj[j].checked = true;
                }
            }
            if(page_data[i].lineNumList){
                for(let j = 0 ; j < page_data[i].lineNumList.length ; j++){
                    Editplus_line(i+1,JSONstringify(page_data[i].lineNumList[j]),j,page_data[i].lineNumList.length)
                    // $("#ewis_xianhaoOne" + (i + 1)).textbox("setValue",page_data[i].lineNum1);
                    // $("#ewis_xianhaoTwo" + (i + 1)).textbox("setValue",page_data[i].lineNum2);
                    // $("#ewis_xianhaoThree" + (i + 1)).textbox("setValue",page_data[i].lineNum3);
                    // $("#ewis_xianhaoFour" + (i + 1)).textbox("setValue",page_data[i].lineNum4);
                }
            }


            if(page_data[i].ewisType) {
                type_arr = page_data[i].ewisType.split(",");
            }
            for(let j = 0, len = type_arr.length; j < len; j++){
                $("#ewis_defectType" + (i + 1)).checkboxList("check", type_arr[j]);
                if(type_arr[j] == 7){
                    //其他
                    ewis_type_other_change(i+1)
                }
            }
            $("#ewis_defect_type_other_text" + (i + 1)).textbox("setValue", page_data[i].otherDescription);
            $("#ewis_componentType" + (i + 1)).combobox("setValue", page_data[i].componentType);
            file_data_list(page_data[i].attachments, (i + 1));
            $("#ewis_list" + (i + 1)).val(page_data[i].ewisAttaIds);
        }
    }
    let res_arr = [];
    function get_data(warn){
        // $("#ewisTable").children("td").children().eq(1).children().children().each((index, item)=>{
        //     console.log(index + "_____" + item)
        //     console.log(item)
        // })
        console.info(window.deleteLineId);
        let tr_arr = $("#ewis_table tbody").children() || [];
        let len = tr_arr.length / 5;
        res_arr = [];
        let item = {};
        var lineNumList = [];
        for(let j = 0; j < len; j++){
            let i = tr_arr[j * 5].id.replace(/[^0-9]/ig, "");
            var lineNumReg = /^[0]+/;
            item = {};
            lineNumList = [];
            var isEmptyLine = false;
            console.info($('[id^="lineRow'+ i+'"]').length);
            $.each($('[id^="lineRow'+ i+'"]'),function (index,item) {
                var ind = i - 1;
                var obj = {
                    lineNum1:'',
                    lineNum2:'',
                    lineNum3:'',
                    lineNum4:'',
                };
                var lin1 = $(this).find("input[type ='hidden']")[0];
                var lin2 = $(this).find("input[type ='hidden']")[1];
                var lin3 = $(this).find("input[type ='hidden']")[2];
                var lin4 = $(this).find("input[type ='hidden']")[3];
                var lineId = $(this).find("input[type ='hidden']")[4];
                obj.lineNum1 = $(lin1).val();
                obj.lineNum2 = $(lin2).val();
                obj.lineNum3 = $(lin3).val();
                obj.lineNum4 = $(lin4).val();
                $(lineId).val() ? (obj.id = $(lineId).val()):'';
                Object.keys(obj).forEach(function (key) {
                    if(obj[key] == ''){
                        isEmptyLine = true ;
                    }
                });
                lineNumList.push(obj)
            });

            // var lineNum1 = $("#ewis_xianhaoOne" + i).textbox("getValue").replace(lineNumReg,"");
            // var lineNum2 = $("#ewis_xianhaoTwo" + i).textbox("getValue").replace(lineNumReg,"");
            // var lineNum3 = $("#ewis_xianhaoThree" + i).textbox("getValue").replace(lineNumReg,"");
            // var lineNum4 = $("#ewis_xianhaoFour" + i).textbox("getValue").replace(lineNumReg,"");

            // var lineNum1 = $("#ewis_xianhaoOne" + i).textbox("getValue");
            // var lineNum2 = $("#ewis_xianhaoTwo" + i).textbox("getValue");
            // var lineNum3 = $("#ewis_xianhaoThree" + i).textbox("getValue");
            // var lineNum4 = $("#ewis_xianhaoFour" + i).textbox("getValue");
            item.lineEquipmentType = $("#ewis_componentSecType" + i).combobox("getValue");
            if(isEmptyLine &&  item.lineEquipmentType == 1){
                !warn && alert('线号必填') ;
                return false;
            }
            item.defectLocation = $("#defectLocaiton" + i).combobox("getValue");
            item.defectLocation == 5 ? item.otherDflcDes = $("#defectLocaitonOther" + i).val():'';
            item.treatmentMethod = $('input[name ="treatmentMethod'+i+'"]:checked').val();
            item.id = $("#ewisId" + i).val();
            item.componentType = $("#ewis_componentType" + i).combobox("getValue");
            item.allNumber = $("#ewis_pnsn" + i).textbox("getValue");
            item.pn = $("#ewis_pn" + i).textbox("getValue");
            item.otherDescription = $("#ewis_defect_type_other_text" + i).textbox("getValue");
            item.staWlBl = $("#ewis_stawlbl" + i).textbox("getValue");
            item.ewisType = $("#ewis_defectType" + i).checkboxList("getValue").join(",");
            item.ewisAttaIds = $("#ewis_list" + i).val().split(',');
            item.lineNumList = lineNumList;
            !window.deleteLineId[j] ?window.deleteLineId[j] = [] :'';
            item.delIds = window.deleteLineId[j].toString();
            let check = check_required(item);
            if(check){
                // return check
                !warn && alert(check);
                return false
            }
            if(item.ewisAttaIds.length < 2){
                !warn && alert('每条EWIS必须至少上传两条附件');
                return false;
            }
            res_arr.push(item)
        }
        console.info(res_arr)
        return res_arr
    }
    function validateLine(val) {
        return val ? val:'0';
    }
    function check_required(item){
        if(!item.componentType){
            return "EWIS部件类型必须填写"
        }else if(!item.ewisType){
            return "EWIS缺陷类型至少勾选一项"
        }
        if(item.lineEquipmentType == 2 && !item.allNumber){
            return "设备号必填";
        }
        if(!item.treatmentMethod){
            return "EWIS处理方式必填"
        }
        if(!item.defectLocation){
            return "EWIS缺陷位置必填"
        }
        if( item.defectLocation == 5 && !item.otherDflcDes){
            return "其他缺陷位置必填";
        }
        return 0
    }

    $.fn.extend({
        EWIS: function(operation, data){
            if(operation === "create" && !created){
                create.call(this, "/views/defect/EWIS.shtml");
            }
            if(operation === "getData"){
                return get_data.call(this,data)
            }
            if(operation === "setData"){
                page_data = data;
                if(Array.isArray(data) && data.length > 0){
                    create.call(this, "/views/defect/EWIS.shtml", set_data);
                }
            }
            if(operation === "view"){
                page_data = data;
                if(Array.isArray(data) && data.length > 0){
                    create.call(this, "/views/defect/EWISView.shtml", init_data)
                }
            }
            if(operation === "destroy"){
                $("#ewisTable").empty();
                $("#ewisTable").remove();
                created = 0;
            }
            if(operation === "checkData"){
                console.info(data,'check');
                for(let j = 0 ; j < res_arr.length; j++){
                    if(res_arr[j].treatmentMethod == 1 && res_arr[j].lineEquipmentType == 1){
                        let delArr = ewis_deleteId.filter(item => item);
                        res_arr[j].id && delArr.push(res_arr[j].id);
                        for(let k = 0 ; k < res_arr[j].lineNumList.length ; k++){
                            var lineNumReg = /^[0]+/;
                            var ind = (k+1).toString();
                            var lineNum1 = $("#ewis_xianhaoOne" + (j+1)+ind).textbox("getValue").replace(lineNumReg,"");
                            var lineNum2 = validateLine($("#ewis_xianhaoTwo" + (j+1)+ind).textbox("getValue").replace(lineNumReg,""));
                            var lineNum3 = validateLine($("#ewis_xianhaoThree" + (j+1)+ind).textbox("getValue").replace(lineNumReg,""));
                            var lineNum4 = validateLine($("#ewis_xianhaoFour" + (j+1)+ind).textbox("getValue").replace(lineNumReg,""));
                            var ewisCheckData = {
                                acReg:data,
                                lineNum:validateLine(lineNum1)+'-'+validateLine(lineNum2)+'-'+validateLine(lineNum3)+'-'+validateLine(lineNum4),
                                ids:delArr
                            };
                            axios.post('/api/v1/defect/ewis/getIsLineNumRepeatFlag', ewisCheckData).then(response=>{
                                response.data.data &&  MsgAlert({type: "success", content: "新增接线管不应超过3个，该导线已进行过接线修理，请核实" })
                            }).catch(err=>{
                                MsgAlert({type: "error", content: "校验EWIS失败" + err})
                            });
                        }

                    }
                }
            }
        }
    })


})($, window, document);