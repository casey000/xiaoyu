//"HSOpCameraOrbit" 旋转
//"HSOpCameraPan" 平移
//"HSOpCameraZoom" 缩放
//"HSOpSelectStructure" 拾取构件
//"HSOpGetAdjoiningStructures" 拾取相邻构件
//"HSOpSelectPosition" 拾取位置
//ASMS3DObject.SetOperator("HOpSelectStructure"); //设置相应的操作

//var boxOption = "[{'STA':'-2000.0 4000.5','WL':'208.1 1000','BL':'-1000.0 1000'}]";
//ASMS3DObject.GetObjectsByBox(boxOption);//获取指定包围盒内的所有构件、标记、补片
window.selectorListener = function(strOptions,largeSquareStrOptions){
    // alert("asmsObject selectorListener");
    // debugger;
    $("#ids").val(strOptions);
    var param=[];
    try{
        //    for(var i=0;i<strOptions.length;i++){
        //    var str= "{"+
        //         "'sta':'"+strOptions[i].sta+"',"+
        //         "'wl':'"+strOptions[i].wl+"',"+
        //         "'bl':'"+strOptions[i].bl+"',"+
        //         "'uuid':'"+strOptions[i].uuid+"',"+
        //         "'category':'"+strOptions[i].category+"',"+
        //         "'area':'"+strOptions[i].area+"',"+
        //         "'topology':'"+strOptions[i].topology+"',"+
        //         "'type':'"+strOptions[i].type+"',"+
        //         "'name':'"+strOptions[i].name+"',"+
        //         "'section':'"+strOptions[i].section+"',"+
        //         "'status':'"+strOptions[i].status+"',"+
        //         "'modelType':'"+"757"+"',"+
        //         "'subType':'"+"200"+"',"+
        //         "'aircraft':'"+"common"+"'"+
        //         "}";
        //     param.push(str)
        // }
        // var result="["+param.join(",")+"]";
        //    alert("result:"+result);
        //   // var largerBox = parent.getLargerSquareBoxOption(strOptions);
        //    //var largeSquareStrOptions = parent.GetObjectsByBox(largerBox);
        //    alert("largeSquareStrOptions:"+largeSquareStrOptions);
        //    //top.dviewlagersquaredata=largeSquareStrOptions;
    }catch(e){
        alert(e);
    }
    try{
/*
        alert('------------test回填数据---------',JSON.stringify(strOptions));
*/
        parent.backToPartList(strOptions,largeSquareStrOptions);

        //$(".layout-panel-west").prepend("<div>" + JSON.stringify(strOptions) + "</div>")
        // parent.dviewdata=JSON.stringify(strOptions);
        // parent.parentFunction();
    }catch(e){
        // alert("parentFunction:"+e);
    }

}

/**
 * 设置包围盒事件监听器
 * @param strOptions
 */
window.boxListener=function(strOptions){
    $("#ids").val(strOptions);
    //$(".layout-panel-west").prepend("<div>" + JSON.stringify(strOptions) + "</div>")
    var blMinSymbol=strOptions.blRlMin=="-1"?"-":"";
    var blMaxSymbol=strOptions.blRlMax=="-1"?"-":"";
    var strMinSymbol=strOptions.strRlMin=="-1"?"-":"";
    var strMaxSymbol=strOptions.strRlMax=="-1"?"-":"";
    var structureInfo = "[{'STA':'" + strOptions.staMax+" "+strOptions.staMin +
        "','WL':'" + strOptions.wlMin+" "+strOptions.wlMax +
        "','BL':'" + blMinSymbol+strOptions.blMin+" " +blMaxSymbol+strOptions.blMax+
        "','STR':'" + strMinSymbol+strOptions.strMin+" "+strMaxSymbol+strOptions.strMax +
        "','STAOffSet':'" + strOptions.staMaxOffset+" "+strOptions.staMinOffset +
        "'}]";

    parent.backToBox(structureInfo);
    //top.setSelectStrOptions(structureInfo);
};

/**
 * 添加查看业务详情监听
 * @param strOptions
 */
window.detailListener=function(strOptions){
    //debugger;
    top.dviewtype=1;
    top.dviewdata=strOptions;
    top.showDetails();
};

