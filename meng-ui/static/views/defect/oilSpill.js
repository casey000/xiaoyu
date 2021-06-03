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
        tr.after("<tr id='oilSpillTable'><td colspan='99'></td></tr>");
        $("#oilSpillTable").children().load(url, cb);
        created = 1;
    }

    function init_data(){
        let type_arr = [];
        const OIL_TYPE = {
            "1": "液压油",
            "2": "燃油",
            "3": "滑油",
        };


        let spill_component_list =
            {

                "0" : "更换本体",
                "3" : "修补油箱",
                "4" : "更换接头",
                "5" : "更换管路",
                "6" : "更换液压保险",
                "7" : "更换封圈",
                "9" : "更换油滤",
                "10" : "修复管路",
                "11" : "重装正常",
                "12" : "无措施（检查正常）",
                "13" : "其他措施",
            }
        ;


        for(let i = 0, len = page_data.length; i < len; i++){
            if(i > 0){
                oilSpill_plus();
            }
            $("#spill_area" + (i + 1)).html(page_data[i].oilLeakPosition);
            $("#spill_value" + (i + 1)).html(page_data[i].oilRecord);
            $("#spill_component_other_text" + (i + 1)).textbox("setValue", page_data[i].otherDescription);
            // type_arr = page_data[i].oilType.split(",");
            // for(let j = 0, len = type_arr.length; j < len; j++){
            //     $("#spill_component" + (i+1)).checkboxList("check", type_arr[j])
            // }
            $("#spill_component" + (i+1)).html(spill_component_list[i].oilType);
            $("#oil_type" + (i + 1)).html(OIL_TYPE[page_data[i].oilComponent]);
            oilSpil_file_data_list(page_data[i].oilAttachments, (i + 1));
        }
    }

    function set_data(){
        let type_arr = [];
        for(let i = 0, len = page_data.length; i < len; i++){
            if(i > 0){
                oilSpill_plus();
            }
            $("#oilId" + (i + 1)).val(page_data[i].id);
            $("#spill_area" + (i + 1)).combobox("setValue", page_data[i].oilLeakPosition);
            $("#spill_value" + (i + 1)).textbox("setValue", page_data[i].oilRecord);
            if(page_data[i].oilType) {
                type_arr = page_data[i].oilType.split(",");
            }
            for(let j = 0, len = type_arr.length; j < len; j++){
                // $("#spill_component" + (i + 1)).checkboxList("check", type_arr[j]);
                $("#spill_component" + (i + 1)).combobox("setValue",page_data[i].oilType);
                // if (type_arr[j] == 5) {
                //     //其他
                //     spill_component_other_change(i+1)
                // }
            }
            $("#spill_component_other_text" + (i + 1)).textbox("setValue", page_data[i].otherDescription);
            $("#oil_type" + (i + 1)).combobox("setValue", page_data[i].oilComponent);
            oilSpil_file_data_list(page_data[i].oilAttachments, (i + 1));
            console.log(page_data[i].oilAttaIds);
            $("#oilSpil_list" + (i + 1)).val(page_data[i].oilAttaIds);
        }
    }

    function get_data(){
        // $("#oilSpillTable").children("td").children().eq(1).children().children().each((index, item)=>{
        //     console.log(index + "_____" + item)
        //     console.log(item)
        // })
        let tr_arr = $("#oilSpill_table tbody").children() || [];
        let len = tr_arr.length / 4;
        let res_arr = [];
        let item = {};
        for(let j = 0; j < len; j++){
            let i = tr_arr[j * 4].id.replace(/[^0-9]/ig, "");
            item = {};
            item.id = $("#oilId" + i).val();
            // item.oilComponent = $("#oil_type" + i).combobox("getValue");
            item.oilComponent = $("#oil_type" + i).combobox("getValue");
            item.oilRecord = $("#spill_value" + i).textbox("getValue");
            item.otherDescription = $("#spill_component_other_text" + i).textbox("getValue");
            item.oilLeakPosition = $("#spill_area" + i).textbox("getValue");
            //item.oilType = $("#spill_component" + i).checkboxList("getValue").join(",");
            item.oilType = $("#spill_component" + i).combobox("getValue");
            item.oilAttaIds = $("#oilSpil_list" + i).val().split(',');
            res_arr.push(item)
        }
        // console.log(res_arr)
        return res_arr
    }

    $.fn.extend({
        oilSpill: function(operation, data){
            if(operation === "create" && !created){
                create.call(this, "/views/defect/oilSpill.shtml");
            }
            if(operation === "getData"){
                return get_data.call(this)
            }
            if(operation === "setData"){
                page_data = data;
                if(Array.isArray(data) && data.length > 0){
                    create.call(this, "/views/defect/oilSpill.shtml", set_data);
                }
            }
            if(operation === "view"){
                page_data = data;
                if(Array.isArray(data) && data.length > 0){
                    create.call(this, "/views/defect/oilSpillView.shtml", init_data)
                }
            }
            if(operation === "destroy"){
                $("#oilSpillTable").empty();
                $("#oilSpillTable").remove();
                created = 0;
            }
        }
    })
})($, window, document);
