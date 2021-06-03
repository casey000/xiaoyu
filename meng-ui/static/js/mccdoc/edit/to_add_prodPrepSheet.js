
/**
 *  飞机检擦/维护类---显示 添加生产准备单
 */
var toTypePpo='';
var prodAcRegArr=[];
var isModel;

var sub_win,s_params;

if (frameElement) {
    sub_win = frameElement.api;
}

if (sub_win) {
    s_params = sub_win.data;
} else {
    s_params = getParentParam_();
}

if(!s_params.addTrNum){
    s_params.addTrNum=0;
}

var toStates="";
function showProdPrepBtn(type) {
    var ele=`<tr>
            <td class="td-line30-with-bg">生产准备单</td>
            <td colspan="3" style="text-align: right">
                <a  id="toAddProdPrep" 
                style="display:none; 
                padding: 2px 6px;background-color: #169BD5;color: #fff;border-width: 0;border-radius:
                5px;margin-right: 20px" onclick="toAddProdPrep(this,3)">添加准备单
                </a>
                <a class="toAddProdPrep" 
                style="padding: 2px 6px;background-color: #F0F0F0;color: #ccc;border-width: 0;border-radius:
                5px;margin-right: 20px;cursor: default">添加准备单
                </a>
            </td>
        </tr>`;

    $('tr.showProdPrepBtn').before(ele);

    if(type=="edit"){
        $('#toAddProdPrep').show();
        $('.toAddProdPrep').hide();
    }

}

//普查类添加准备单  --新增页面
$("#survey_select_prodPrep_add").live("click", function () {
    toAddProdPrep(this,2,"toAdd");
});

//普查类添加准备单  --编辑页面
$("#survey_select_prodPrep").live("click", function () {
    toAddProdPrep(this,2);
});

//open添加准备单列表
function toAddProdPrep(thiz,type,toState){
    toTypePpo=type;
    var datas={};
    if(toState){
        toStates=toState;
    }

    //设置权限认证用户信息
    if(s_params._LOGIN_USER){
        datas._LOGIN_USER=s_params._LOGIN_USER
    }
    datas.toType=type;
    if(type==1){ //排故类
        var stepTrNum=$(thiz).parent().parent().find("td:eq(0)").text();
        s_params.addTrNum=stepTrNum;
        if($(".Step_tr_"+stepTrNum).length>0){
            P.$.dialog.alert("此步骤最多只能挂一个生产准备单");
            return;
        }
        // $(thiz).parent().parent().next().attr("class","Step_tr_"+stepTrNum)
        datas.model=$("#model").val();
        datas.fleet=$("#acReg").val();
        datas.ppoId="";
    }else if(type==3){ //检查维护类
        datas.model=$("#model").val();
        datas.fleet=$("#acReg").val();
        datas.ppoId=$("#ppoId").val();
    }else if(type==2){
        var _table = $("#aircraft_select_table");
        var _node = _table.find("tr:gt(1)");
        _node.each(function(i,v){
            if(i==0){
                datas.fleet=$(v).find("td:eq(1)").find("input:eq(1)").val();
            }else{
                datas.fleet+=","+$(v).find("td:eq(1)").find("input:eq(1)").val();
            }
        });


        //获取已添加飞机的机型
        var toFleetModel=$(".toFleetModel:gt(0)");
        var mString="";
        toFleetModel.each(function(i,v){
            var vVal=$(v).val();
            if(i==0){
                mString =$(v).val();
            }else if(mString.indexOf(vVal)==-1){
                mString+=","+vVal;
            }
        });
        console.log("mString:",mString);
        datas.model=mString;
        datas.ppoId=$("#ppoId").val();
    }

    P.$.dialog({
        title: '添加生产准备单',
        width: '1100px',
        height: '390px',
        top: '35%',
        esc: true,
        cache: false,
        max: false,
        min: false,
        lock: true,
        parent: this,
        content: 'url:/views/mccdoc/edit/to_add_prodPrepList.shtml',
        data: datas,
        close: function () {
            if (this.data['addData']) {
                var addData=this.data['addData'];
                addData.map(function(item,index){
                    toShowProdPrep(thiz,item,index,toTypePpo);
                });
            }
        }

    });
}

//TO挂 生产准备单

function toShowProdPrep(thiz,k,i,toTypePpo){

    // //获取已挂准备单的个数
    // if(producePrepareOrders&&producePrepareOrders.length>0){
    //     console.log("producePrepareOrders:",producePrepareOrders);
    //     addTrNum=producePrepareOrders.length;
    // }
    var addTrNum=s_params.addTrNum;
    var cententSize=k.content;
    if(cententSize.length>30){
        cententSize=cententSize.slice(0,30)+"...";
    }

    var stepTrNum=$(thiz).parent().parent().find("td:eq(0)").text();
    var expectNum=accMul(k.expectStaff,parseFloat(k.expectHour));
    // var totalNum=accMul(k.totalStaff,parseFloat(k.totalTime));

    var totalStaff=0;
    var totalHour=0;
    var totalTime=k.totalTime;
    var totalTimeAll=0;
    if(totalTime>0){
        var staff=k.totalStaff/totalTime;
        var hour=k.totalHour/k.totalStaff;
        totalStaff=staff.toFixed(2);
        totalHour=hour.toFixed(2);
        totalTimeAll=k.totalHour/totalTime;
        totalTimeAll=totalTimeAll.toFixed(2);
    }

    if(!k.otherCase){
        k.otherCase="";
    }

    var ele=`<tr style="border: none">
            <td colspan="4" class="addTrBorder">
                <table border="1" cellpadding="0" cellspacing="0" style="padding-top:10px;"
                       width="100%"
                       class="propContent">
                    <tr>
                        <td style="width: 120px" class="td-line30-with-bg prodTitle">生产准备单编号：</td>
                        <td colspan="2">${k.no}</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">机型/动力类型：</td>
                        <td colspan="2">${k.model}</td>
                        <td style="text-align: right;">
                            <a style="margin-right: 20px;cursor: pointer;color:#0033FF" onclick="delProdPrepSheet(this,'${stepTrNum}',${toTypePpo},'${k.fleet}')">删除</a>
                            <span class="ppoId" style="display: none">${k.id}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-line30-with-bg prodTitle">飞机号：</td>
                        <td colspan="2" style="width: 160px" class="addProdPrepFleet">${k.fleet}</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">版本：</td>
                        <td colspan="3">R${k.version}</td>
                    </tr>
                    <tr>
                        <td class="td-line30-with-bg prodTitle">工作内容：</td>
                        <td colspan="2" class="contentText" title="${k.content}">${cententSize}</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">参考依据：</td>
                        <td colspan="3">${k.category+" "+k.title} </td>
                    </tr>
                    <tr>
                        <td class="td-line30-with-bg prodTitle">计划人工时：</td>
                        <td colspan="2">${k.expectStaff}人 X  ${k.expectHour}小时</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">计划总工时：</td>
                        <td colspan="3">${expectNum}人工时</td>
                    </tr>
                    <tr>
                        <td class="td-line30-with-bg prodTitle">历史平均人工时：</td>
                        <td colspan="2">${totalStaff}人 X  ${totalHour}小时</td>
                        <td colspan="2" class="td-line30-with-bg prodTitle">平均总工时：</td>
                        <td colspan="3">${totalTimeAll}人工时</td>
                    </tr>
                    <tr>
                        <td class="td-line30-with-bg prodTitle">特殊测试需求：</td>
                        <td colspan="7">
                            <table width="100%" id="materialTrBorder">
                                <tr>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_1" class="chechBoxs" disabled>顶升飞机
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_2" class="chechBoxs" disabled>发动机试慢车
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_3" class="chechBoxs" disabled>发动机试慢车以上
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_4" class="chechBoxs" disabled>拖行飞机
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_5" class="chechBoxs" disabled>进入燃油箱
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_6" class="chechBoxs" disabled>结构人员
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_7" class="chechBoxs" disabled>高空车需求
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_8" class="chechBoxs" disabled>机库需求
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_9" class="chechBoxs" disabled>大风限制
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_10" class="chechBoxs" disabled>低温限制
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_11" class="chechBoxs" disabled>天气限制
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_12" class="chechBoxs" disabled>雷雨限制
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_13" class="chechBoxs" disabled>大雨限制
                                    </td>
                                    <td>
                                        <input type="checkbox" id="chechBox_${addTrNum}_14" class="chechBoxs" disabled>NDT需求
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <input type="checkbox" id="chechBoxOther_${addTrNum}" class="chechBoxs" disabled>其他限制
                                    </td>
                                </tr>
                                <tr class="otherR_P">
                                    <td colspan="8">
                                        <div id="otherR_${addTrNum}" 
                                        style="border: 1px solid #ccc;height: 80px;width: 100%;">${k.otherCase}</div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    <tr class="addMaterialBtn_${i}_${addTrNum}"><td colspan="8"></td></tr>
                </table>
            </td>
        </tr>`;


    if(toTypePpo==3){//检查维护类
        $('tr.showProdPrepBtn').after(ele);
        var ppoId = $.trim($("#ppoId").val());

        if (ppoId) {
            $("#ppoId").val(k.id+","+ppoId);
        } else {
            $("#ppoId").val(k.id);
        }

        // $('.addTrBorder').removeAttr("style");

    }else if(toTypePpo==1){//排故类
        $(thiz).parent().parent().after(ele);
        // $('.addTrBorder').removeAttr("style");
        // var stepTrNum=$(thiz).parent().parent().find("td:eq(0)").text();
        $(thiz).parent().parent().next().attr("class","Step_tr_"+stepTrNum);
        // $(".addStep_tr_"+stepTrNum).
        console.log("步骤：",stepTrNum);
        var ele=`<td style="display: none;"><input value="${k.id}" name="toTroubleShootings[${Number(stepTrNum)-1}].ppoId" 
                 class="toTroubleShootings_${Number(stepTrNum)-1}"/></td>`;
        $(".addStep_tr_"+stepTrNum).append(ele);
    }else if(toTypePpo==2){
        $('tr.showProdPrepBtn').after(ele);
        $('tr.showProdPrepBtn').next().attr("class","addProdPrep_tr");
        isModel=k.model;

        //准备单ID 赋值
        var ppoId = $.trim($("#ppoId").val());

        if (ppoId) {
            $("#ppoId").val(k.id+","+ppoId);
        } else {
            $("#ppoId").val(k.id);
        }


    }

    var cases=k.cases;
    cases.map(function(item){
        $('#chechBox_'+addTrNum+'_'+item.caseNo).prop("checked", true);
    });

    if(k.otherCase){
        $("#chechBoxOther_"+addTrNum).prop("checked", true);

    }else{
        $('#otherR_'+addTrNum).parent().parent().hide();
    }

    var materials=k.materials;

    console.log("materials:",materials);
    // materials=[
    //     {"partno":"B-2924","partName":"飞机垫片","toolsFlag":"1","total":1,"unit":"EA","remark":"参考依据"},
    //     {"partno":"B-1455","partName":"飞机垫片","toolsFlag":"0","total":2,"unit":"PR","remark":"备注222"},
    //     {"partno":"B-1231","partName":"飞机垫片","toolsFlag":"0","total":3,"unit":"PR","remark":"备注333"},
    //     {"partno":"B-2884","partName":"飞机垫片","toolsFlag":"0","total":3,"unit":"PR","remark":"备注444"}
    // ];
    if(materials.length>0){
        if(toTypePpo==1){
            addMaterialTitle(materials,i,stepTrNum);
        }else{
            addMaterialTitle(materials,i,addTrNum);
        }

    }

    s_params.addTrNum+=1;
    // materials.map(function(item,index){
    //     addMaterialBtnFun
    // });
    //
    //
    // for (var k=0;k<materials.length;k++) {
    //     addMaterialBtnFun();
    // }

}




/**
 *  显示准备单推荐的航材工具 start
 */

//显示推荐航材 title
function addMaterialTitle(materials,Row,stepTrNum,type,toCommon){
    var addTrNum=s_params.addTrNum;
    if(type==1){
        toTypePpo=1;
    }
    if(toCommon){
        addTrNum=stepTrNum;
    }

    var ele=`<tr style="text-align: right"class="materialTitle">
                    <td rowspan="${materials.length+2}" class="td-line30-with-bg prodTitle">推荐航材工具：</td>
                    <td colspan="7" style="border-color:#ccc"><a style="margin-right: 20px;cursor: pointer" 
                    onclick="add_material_tools_all(this,'ALL')" class="materialAll">全部添加到工具航材需求
                    </a></td>
                </tr>
                <tr class="materialTitle">
                    <td>名称</td>
                    <td>件号</td>
                    <td>是否工具</td>
                    <td>数量</td>
                    <td>单位</td>
                    <td>参考依据/备注</td>
                    <td style="width: 160px">操作</td>
                </tr>`;


    $('tr.addMaterialBtn_'+Row+'_'+addTrNum).before(ele);

    // 排故类下 ，不显示添加工具航材需求
    // 普查类新增TO 不显示航材工具
    // if(toTypePpo==1||toStates=="toAdd"){
    //     $('.materialAll').hide();
    // }

    for (var k=0;k<materials.length;k++) {
        addMaterialBtnFun(materials[k],k,Row,addTrNum);
    }
    // s_params.addTrNum+=1;
}

// 显示推荐航材内容
function addMaterialBtnFun(item,k,row,stepTrNum){
    // var addTrNum=s_params.addTrNum;
    var ele=`<tr class="materialTitle">
                <td>${item.partName||'--'}</td>
                <td>${item.partno||'--'}</td>
                <td>
                    <input type="checkbox" id="material_${k}" class="chechBoxs" disabled value="${item.toolsFlag}">是
                </td>
                <td>${item.total||'--'}</td>
                <td>${item.unit||'--'}</td>
                <td>${item.remark||'--'}</td>
                <td><a onclick="add_material_tools_ppo(this,'noAll')" style="cursor: pointer" class="materialAll">添加到工具航材需求</a></td>
            </tr>`;

    if(toTypePpo=="1"){
        ele=`<tr class="materialTitle">
                <td>${item.partName||'--'}</td>
                <td>${item.partno||'--'}</td>
                <td>
                    <input type="checkbox" id="material_${stepTrNum}_${k}" class="chechBoxs" disabled value="${item.toolsFlag||'0'}">是
                </td>
                <td>${item.total||'--'}</td>
                <td>${item.unit||'--'}</td>
                <td>${item.remark||'--'}</td>
                <td><a onclick="add_material_tools_ppo(this,'noAll')" style="cursor: pointer">添加到工具航材需求</a></td>
                <!--<td></td>-->
            </tr>`;
    }

    $('tr.addMaterialBtn_'+row+"_"+stepTrNum).before(ele);

    // 排故类下 ，不显示添加工具航材需求
    // 普查类新增TO 不显示航材工具
    // if(toTypePpo==1||toStates=="toAdd"){
    //     $('.materialAll').hide();
    // }


    if(toTypePpo==1){
        item.toolsFlag=="1"?$('#material_'+stepTrNum+'_'+k).prop("checked", true):"";
    }else{
        item.toolsFlag=="1"?$('#material_'+k).prop("checked", true):"";
    }



           
}
// 显示推荐航材内容 end

//显示准备单推荐的航材工具 end

//移除挂的准备单
function delProdPrepSheet(thiz,stepNum,toTypePpo,fleet){
    P.$.dialog.confirm('需要删除此准备单吗？', function () {
        $(thiz).parent().parent().parent().parent().parent().parent().remove();

        if(toTypePpo==1){//排故类移除准备单
            console.log($(".addStep_tr_"+stepNum+" td:last"));
            $(".addStep_tr_"+stepNum+" td:last").remove();
        }else if(toTypePpo==2){

            if($(".addProdPrep_tr").length==0){//删除所有准备单时，清空机型
                isModel="";
            }
            ppoIdValue();
        }else{
            ppoIdValue();
        }

    });

    // alert("准备删除准备单:"+stepNum);
}

//重置ppoId 的value值
function ppoIdValue(){
    $("#ppoId").val("");
    var ppoIds=$('span.ppoId');
    console.log("ppoIds:",ppoIds);
    ppoIds.each(function (index_, value_){
        var textId=$.trim($(value_).text());
        console.log("textId:",textId);
        var ppoId = $.trim($("#ppoId").val());
        if (ppoId) {
            $("#ppoId").val(textId+","+ppoId);
        } else {
            $("#ppoId").val(textId);
        }
    })
}

//添加推荐航材

function add_material_tools_ppo(thiz,addType){

    var thizP,materName,materNo,materTool,materTotal,materUnit;

    if(addType=="ALL"){
        console.log("添加全部");
        thizP=$(thiz);
    }else{
        thizP=$(thiz).parent().parent();
    }
    materName=$.trim($(thizP).find("td:eq(0)").text());
    materNo=$.trim($(thizP).find("td:eq(1)").text());
    materTool=$.trim($(thizP).find("td:eq(2) input").val());
    materTotal=$.trim($(thizP).find("td:eq(3)").text());
    materUnit=$.trim($(thizP).find("td:eq(4)").text());


    var _table = $("#material_tool_select_table");

    var _node = _table.find("tr").last().clone(true);

    _node.removeAttr("style");

    var _findTd = _node.find("td:eq(0)");

    var _index = _findTd.text();

    _findTd.text(Number(_index) + 1);

    //设置Name的name值
    _node.find("td:eq(1)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].name");
    //设置P/N的name值
    _node.find("td:eq(2)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].pn");
    //设置Tools的name值
    _node.find("td:eq(3)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].type");
    //设置QTY的name值
    _node.find("td:eq(4)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].pageQty");
    //设置UNIT的name值
    _node.find("td:eq(5)").find(":input").attr("name", "toMaterialToolss[" + Number(_index) + "].unit");

    if(materTool=="1"){// 准备单航材工具标记  1 为工具   0为航材
        _node.find("td:eq(3)").find(":input").val("2");

        //设置UNIT中工具DIV的class
        _node.find("td:eq(5)").find("div[name='materialName']").attr("class", "hidden");
        _node.find("td:eq(5)").find("div[name='unitName']").attr("class", "");

        //清空select输入框中的值
        // _node.find("td:eq(5)").find("div[name='materialName']").find("select").val("");
        var selectOp=_node.find("td:eq(5)").find("div[name='materialName']").find("select");
        var option = "<option value=''></option>";
        selectOp.empty();
        selectOp.append(option);
    }else{
        _node.find("td:eq(3)").find(":input").val("1");
        //设置UNIT中工具DIV的class
        _node.find("td:eq(5)").find("div[name='unitName']").attr("class", "hidden");
        //设置UNIT中航材DIV的class
        _node.find("td:eq(5)").find("div[name='materialName']").attr("class", "");
        //清空select输入框中的值
        _node.find("td:eq(5)").find("div[name='unitName']").find("select").val("");

        // _node.find("td:eq(5)").find("div[name='materialName']").find("select").val("");
        var selectOp=_node.find("td:eq(5)").find("div[name='materialName']").find("select");
        var option = "<option value='"+materUnit+"'>"+materUnit+"</option>";
        selectOp.empty();
        selectOp.append(option);
    }



    //清空checkbox
    _node.find("input[type='checkbox']").removeAttr("checked");
    //清空提示
    _node.find(".error").remove();

    //新增一行要添加按钮单击事件
    _node.find("td:eq(2)").find("img").show();
    //移除件号框只读属性
    if (!_node.find("td:eq(2)").find("input").attr("readonly")) {
        _node.find("td:eq(2)").find("input").attr("readonly", "readonly");
        //_node.find("td:eq(1)").find("input").attr("readonly","readonly");
    }
    if(materTool==1){
        _node.find("input[type='checkbox']").attr("checked",true);
        _node.find("td:eq(2)").find("input").removeAttr("readonly");
        _node.find("td:eq(2)").find("img").hide();

    }else{
        //清空checkbox
        _node.find("input[type='checkbox']").removeAttr("checked");
        //清空提示
        // _node.find(".error").remove();

        //新增一行要添加按钮单击事件
        _node.find("td:eq(2)").find("img").show();
        //移除件号框只读属性
        _node.find("td:eq(2)").find("input").attr("readonly", "readonly");

    }

    _node.find("td:eq(1)").find(":input").val(materName);
    _node.find("td:eq(2)").find(":input").val(materNo);
    _node.find("td:eq(4)").find(":input").val(materTotal);
    _node.find("td:eq(5)").find(":input").val(materUnit);
    _table.append(_node);

    if(addType=="ALL"){
        $(thiz).find("td:eq(6)").empty();
    }else{
        $(thiz).parent().empty();//当前仅允许添加一次
    }

}

//添加全部航材
function add_material_tools_all(thiz,addType) {
    $(thiz).hide();//全部添加航材仅操作一次
    var materialAll=$(thiz).parent().parent().parent().find(".materialTitle:gt(1)");

    materialAll.each(function (index_, value_){
        add_material_tools_ppo($(value_),addType);
        console.log("value_:",$(value_));


    })


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


