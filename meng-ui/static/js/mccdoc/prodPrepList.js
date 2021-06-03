/*************************/
/******生产准备单**********/
/*************************/

var COMBOBOX_DATA = {};//保存查询数字字典数据
var rowId;

$(function () {
    acQuery();
    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                COMBOBOX_DATA["daFleet"]= jdata.data.DA_FLEET;
                var modelVal;
                $("#model").combobox({
                    valueField: 'TEXT',
                    textField: 'VALUE',
                    data:COMBOBOX_DATA["daFleet"],
                    onHidePanel:function () {
                        var t = $(this).combobox('getValue');
                        if(modelVal==undefined||modelVal==null||t!=modelVal.TEXT){
                            $(this).combobox({value: ''});
                        }

                    },
                    onSelect: function (val) {
                        modelVal=val;
                    }
                });
            }

        }
    });


    //状态下拉选项
    var statusVal;
    $("#status").combobox({
        valueField: 'VALUE',
        textField: 'TEXT',
        data:[
            {TEXT :"待提交",VALUE:"1"},
            {TEXT :"待审核",VALUE:"2"},
            {TEXT :"已生效",VALUE:"5"},
            {TEXT :"归档",VALUE:"6"},
            {TEXT :"已驳回",VALUE:"9"}
            ],
        onHidePanel:function () {
            var t = $(this).combobox('getValue');
            if(statusVal==undefined||statusVal==null||t!=statusVal.VALUE){
                $(this).combobox({value: ''});
            }

        },
        onSelect: function (val) {
            statusVal=val;
        }
    });

    InitDataGrid();

});


//查询飞机号
function acQuery() {
    var url= "/api/v1/plugins/FLB_AC_LIST";
    $.ajax({
        type: "POST",
        url:url ,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data.code == 200&&data.data) {

                dataFromFun(data.data);

            } else{

            }
        },
        error: function () {

        }
    });
}

//飞机号表单赋值
function dataFromFun(data) {
    var fleetVal;
    $("#fleet").combobox({
        valueField: 'tail',
        textField: 'tail',
        data:data,
        onHidePanel:function () {
            var t = $(this).combobox('getValue');
            if(fleetVal==undefined||fleetVal==null||t!=fleetVal.tail){
                $(this).combobox({value: ''});
            }

        },
        onSelect: function (val) {
            fleetVal=val;
        }
    });
}

//搜索重置
function doClear() {
    $("#ffSearch").form('clear');
    InitDataGrid();
    // reload_();
}

// function doSearch() {
//     InitDataGrid();
// }

//刷新列表函数，提供给子页面调用
function reload() {
    $("#dg").datagrid("reload");
}

//生产准备单列表字段映射
function InitDataGrid() {
    var queryParams = $("#ffSearch").serializeObject();
    for(x in queryParams){
        if(!queryParams[x]){
            queryParams[x] = null;
        }
    };
    // queryParams={"workDate":null,"type":null,"currOrgName":null,"userId":null,"positionName":null,"userName":null,"surplusHours":null};
    $("#dg").GatewayDataGridHideCol({
        identity: 'dg',
        queryParams: queryParams,
        pagination: true,
        path: "/maintenanceProduction/producePrepareOrder/listByPage",
        columns: {
            param: {FunctionCode: 'PROD_PREP_LIST'},
            alter: {
                handle:{
                    formatter : function(value, row, index){ //操作
                        console.log(typeof row.id,row.id);
                        var handleSta="edit";
                        var status=row.status;
                        if(status=="5"){
                            handleSta="updateR";
                        }

                        var id=row.id;
                        var ele;
                        if(status=="2"||status=="6"){//审批状态，不可编辑
                            ele="";
                        }else if(status==1){
                            ele=`<div style="padding-top: 4.5px">
                                    <span id="edit_Btn_${row.id}" 
                                    onclick="prodPrepOpen('${id}','${handleSta}')"
                                    class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-edit z_bianji" title="修订"></span>
                                    <span style="display: inline-block;width: 20px;"></span>
                                    <span id="delete_Btn_${row.id}" onclick="deleteBtnFun('${row.id}')"
                                    class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-Empty z_shanchu" title="删除"></span>
                                 </div>`;
                        }else{
                            ele=`<div style="padding-top: 4.5px">
                                    <span id="edit_Btn_${row.id}" 
                                    onclick="prodPrepOpen('${id}','${handleSta}')"
                                    class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-edit z_bianji" title="修订"></span>
                                    <span style="display: inline-block;width: 20px;"></span>
                                    <span class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit z_shanchu"
                                        style="cursor: default"></span>
                                 </div>`;
                        }
                        return ele;

                    }
                },
                status:{
                    formatter : function(value, row, index){ //状态
                        // if ('1' == value) {  //待提交，编辑状态
                        //     return "Editing";
                        // } else if ('2' == value) {  //待审核
                        //     return "Checking";
                        // } else if ('3' == value) { //待审批
                        //     return "Approving";
                        // } else if ('4' == value) { //审批通过
                        //     return "Approved";
                        // } else if ('5' == value) {  //生效状态
                        //     return "Active";
                        // } else if ('6' == value) {  //被替代
                        //     return "Superseded";
                        // } else if ('7' == value) {  //撤销中
                        //     return "Cancelling";
                        // } else if ('8' == value) {  //已撤销
                        //     return "Canceled";
                        // }
                        if ('1' == value) {  //待提交，编辑状态
                            return "待提交";
                        } else if ('2' == value) {  //待审核
                            return "待审核";
                        } else if ('5' == value) {  //生效状态
                            return "已生效";
                        } else if ('9' == value) {  //已驳回
                            return "<span style='color: red' title='已驳回'>已驳回</span>";
                        } else if ('6' == value) {  //归档
                            return "归档";
                        }


                    }
                },
                no:{
                    formatter : function(value, row, index){ //编号
                        return `<div style="cursor: pointer;color: #f60;" onclick="prodPrepOpen('${row.id}','view')">${value}</div>`;
                    }
                },
                model:{
                    formatter : function(value, row, index){ //机型
                        return value;
                    }
                },
                fleet:{
                    formatter : function(value, row, index){ //飞机
                        return value;
                    }
                },
                content:{
                    formatter : function(value, row, index){ //工作内容
                        return value;
                    }
                },
                reference:{
                    formatter : function(value, row, index){  //参考依据
                        var val=row.category+" "+row.title;
                        return val;
                    }
                },
                staffHour:{
                    formatter : function(value, row, index){ //计划人工时
                        var val=row.expectStaff+"人，"+row.expectHour+"小时";
                        return val;
                    }
                },
                staffHourAll:{
                    formatter : function(value, row, index){ //计划总工时
                        var h=parseFloat(row.expectHour);
                        var val=accMul(row.expectStaff,h);
                        return val+"人工时";
                    }
                },
                totalStaffHour:{
                    width:150,
                    formatter : function(value, row, index){ //历史平均人工时
                        var val;
                        if(row.totalTime==0){
                            val="0人，0小时";
                        }else{
                            var staff=row.totalStaff/row.totalTime;
                            var hour=row.totalHour/row.totalStaff;
                            staff=staff.toFixed(2);
                            hour=hour.toFixed(2);
                            val=staff+"人，"+hour+"小时";
                        }

                        return val;
                    }
                },
                totalStaffHourAll:{
                    formatter : function(value, row, index){ //平均总工时
                        var val=0;
                        if(row.totalTime>0){
                            val=row.totalHour/row.totalTime;
                            val=val.toFixed(2);
                        }
                        return val+"人工时";
                    }
                },
                version:{
                    formatter : function(value, row, index){
                        return "R"+value;
                    }
                },
                updateRecord:{
                    formatter : function(value, row, index){
                        var ele=`<a class='viewRecord' rowindex="${index}"  style='cursor: pointer;color: #f60;' >查看</a>`;
                        return ele;
                    }
                },

            }
        },
        toolbar: [
            {
                id:"addBtn",
                key: "COMMON_ADD", text: $.i18n.t('ADD'),
                handler: function () {
                    //新建生产准备单
                    prodPrepAddEdit("","add");
                    // var curWidth = ($(window).width() * 0.80).toString();
                    // var curheight = $(window).height().toString();
                    // ShowWindowIframe({
                    //     width: curWidth,
                    //     height: curheight,
                    //     title: "",
                    //     param: {prodPrep_info:{}, type:"add"},
                    //     url: "/views/mccdoc/edit/add_prodPrep.shtml",
                    // });
                }
            },
            // {
            //     id:"importBtn",
            //     text: "导入",
            //     iconCls: 'icon-page_excel',
            //     handler: function () {
            //         // MsgAlert({type:"error",content:"请添加余料清单行"});
            //         MsgAlert({type:"error",content:"导入功能待开发"});
            //     }
            // }
        ],
        onLoadSuccess:function(){
            //鼠标悬停对应行的查看，显示更新记录信息
            InitSuspend('a.viewRecord', {
                'onmouseover': function (thiz, event, callback) {

                    var index = $(thiz).attr("rowindex");
                    var row = $("#dg").datagrid('getRows')[index];
                    console.log(row);
                    listUpdateRecord(row,callback);//查询更新记录数据
                }
            }, 'viewRecord');
        }
    });
}


var rowId="";
//查询生产准备单 更新记录数据
function listUpdateRecord(row,callback) {
    var url="/maintenanceProduction/producePrepareOrderModify/selectAll";
    var datas={"orderId":row.id};
    if($("#viewRecord").is(':visible')&&rowId==row.id){ // 判断是否隐藏
        console.log("同一行已显示不能重复请求更新记录");
        return;
    }
    InitGatewayRequest_({
        type: "post",
        async: false,
        data:datas,
        path: url ,
        successCallBack: function (jdata) {
            if (jdata.success) {
                var data=jdata.obj;
                console.log("data**:",data);
                var html = "<li style='text-align: center;'>更新记录明细</li>";
                for(var k=0;k<data.length;k++){
                    var t=timestampToTime(data[k].modifyDate);

                    if(data[k].operation==1){
                        html+="<li>"+t+" "+data[k].modifySn+"创建了生产准备单</li>";
                    }else if(data[k].operation==2){
                        html+="<li>"+t+" "+data[k].modifySn+"修改了"+data[k].summary+"</li>";
                    }else if(data[k].operation==3){
                        html+="<li>"+t+" "+data[k].modifySn+"修订了生产准备单</li>";
                    }else if(data[k].operation==4){
                        html+="<li>"+t+" "+data[k].modifySn+"审批了生产准备单</li>";
                    }else if(data[k].operation==5){
                        html+="<li>"+t+" "+data[k].modifySn+"驳回了生产准备单</li>";
                    }

                }

                callback(html);


            } else {
                MsgAlert({content: "查看更新记录失败", type: 'error'});
            };
        },
        error:function (jdata) {
            MsgAlert({content: "查看更新记录失败", type: 'error'});
        }
    });
}

//时间戳转换
function timestampToTime(timestamp) {
    var date,Y,M,D,h,m,s,returnDate;
    date = new Date(Number(timestamp));
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    returnDate = Y+M+D+h+m+s;
    return returnDate;
}

function prodPrepAddEdit(id,type,prodPrep_info){

    if(!prodPrep_info) prodPrep_info={};

    //open生产准备单
    var curWidth = ($(window).width() * 0.80).toString();
    var curheight = $(window).height().toString();
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: $.i18n.t('生产准备单'),
        param: {id:id,prodPrep_info:prodPrep_info, type:type},
        url: "/views/mccdoc/edit/add_prodPrep.shtml",
    });
}

function prodPrepOpen(id,type) {
    console.log("prodPrepOpen:",id);
    let getUrl="/maintenanceProduction/producePrepareOrder/get/"+id;
    console.log("getUrl:",getUrl);
    InitGatewayRequest_({
        type: "get",
        async: false,
        path: getUrl ,
        successCallBack: function (jdata) {
            if (jdata.success) {
                prodPrepAddEdit(id,type,jdata.obj);
            } else {
                MsgAlert({content: jdata.errorMessage, type: 'error'});
            };
        },
        error:function (jdata) {
            MsgAlert({content: jdata.status + " "+jdata.statusText, type: 'error'});
        }
    });
}

function deleteBtnFun(id,no) {
    $(".deleteList").show();
    rowId=id;
}
function clearDelete(){
    $(".deleteList").hide();
}

function deleteBtn(id){

    let getUrl="/maintenanceProduction/producePrepareOrder/delete/"+id;
    InitGatewayRequest_({
        type: "get",
        async: false,
        path: getUrl ,
        successCallBack: function (jdata) {
            if (jdata.success) {
                MsgAlert({content:"删除成功！"});
                $("#dg").datagrid("reload");
                clearDelete();
            } else {
                MsgAlert({content: "删除失败！", type: 'error'});
            };
        },
        error:function (jdata) {
            MsgAlert({content:"删除失败！", type: 'error'});
        }
    });
}

//处理乘法精度丢失
function accMul(arg1,arg2){
    if(!arg1||!arg2){
        arg1=0;
        arg2=0;
    }
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)
}




