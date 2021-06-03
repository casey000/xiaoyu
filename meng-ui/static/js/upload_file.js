;(function($, window, document, undefined){
    var created = 0;
    var page_data ;
    function create(url, cb){
        let tr = $(this).parent();
        let search_times = 0;
        while(!tr.is("tr")){
            tr = tr.parent();
            if(++search_times > 10){
                return
            }
        }
        tr.after("<tr id='uploadTable'><td colspan='99'></td></tr>");
        $("#uploadTable").children().load(url, cb);
        created = 1;
    }

    function view_data(){

        file_data_list_view(page_data, 1);
        $(".shangchuang").hide();
    }

    function edit_data(){

        file_data_list_edit(page_data.attachments, 1);
        $("#upload_list1").val(page_data.attachmentIds);

    }

    function save_data(){

        let res_arr = [];
        let item = {};
        item.uploadAttaIds = $("#upload_list1").val().split(',');
        res_arr.push(item);
        return res_arr
    }

    function file_data_list_view(data, id) {
        //console.log(data);
        for (let i in data) {
            let file = "<div class=\"file_tr\" id=\"file_tr" + data[i].fileId + "\">\n" +
                "       <a class='window_a' onclick=\"downFile(" + data[i].pkid + "," + data[i].pkid + ")\">" + data[i].fileName + "</a>\n" +
                "    </div> ";
            let html_row = $(file);
            $("#upload_data" + id).append(html_row);
        }
    }

    function file_data_list_edit(data, id) {
        //console.log(data);
        for (let i in data) {
            let file = "<div class=\"file_tr\" id=\"file_tr" + data[i].fileId + "\">\n" +
                "       <a class='window_a' onclick=\"downFile(" + data[i].pkid + "," + data[i].pkid + ")\">" + data[i].fileName + "</a>\n" +
                "        <div class=\"jianhao icon-delete\" onclick=\"file_content_datale(file_tr" + data[i].fileId + "," + id + ")\"></div>\n" +
                "    </div> ";
            let html_row = $(file);
            $("#upload_data" + id).append(html_row);
        }
    }

    function file_content_datale(id, index) {
        let inde = id.id.substring(7);
        $.ajax({
            type: "POST",
            url: "/api/v1/file/delete/" + inde,
            contentType: "application/json;charset=utf-8",
            dataType: "json",
            success: function (data) {
                if (data.code == 200) {
                    $("#" + id.id).remove();
                    let uploaddata = $("#upload_list" + index).val().split(',');
                    for (let i in uploaddata) {
                        if (uploaddata[i] == inde) {
                            uploaddata.splice(i, 1);
                        }
                    }
                    $("#upload_list" + index).val(uploaddata);
                    alert("删除成功！");
                } else {
                    alert(data.msgData[0]);
                }
            },
            error: function () {
                window.alert("删除失败！");
            }
        });
    }


    $.fn.extend({
        UPLOAD: function(operation, data){
            if(operation === "create" && !created){
                create.call(this, "/views/defect/worklog/upload_file.shtml");
            }
            if(operation === "saveData"){
                return save_data.call(this)
            }
            if(operation === "editData"){
                page_data = data;
                create.call(this, "/views/defect/worklog/upload_file.shtml", edit_data);
            }
            if(operation === "view"){
                page_data = data;
                create.call(this, "/views/defect/worklog/upload_file.shtml", view_data);
            }
            if(operation === "destroy"){
                $("#uploadTable").empty();
                $("#uploadTable").remove();
                created = 0;
            }
        }
    })
})($, window, document);