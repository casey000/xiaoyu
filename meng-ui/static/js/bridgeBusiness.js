//业务调用三维的服务改为业务调用QT通知三维
//方法统一入口为window.$Q.callQt
//参数类型为json，数据格式如下option
//object默认为ASMS3DObject，或者toolBar，字符串类型
//function为方法名，需要与c++中提供的方法保持一致，字符串类型
//param为c++参数对象，需要满足三维方法的需


/**
 * 创建包围盒操作
 * @param strOptions
 * @constructor
 */
function CreateCircumcuboid(strOptions) {
    var option = {
        object: "window",
        function: "createCircumcuboidListener",
        param: strOptions
    };
    window.$Q.callQt(JSON.stringify(option));
}

/**
 * 通过模型id查看三维模型
 *
 * @param strOptions
 * @constructor
 */
function GetObjectById(options) {
    var option = {
        object: "window",
        function: "getObjectByIdListener",
        param: options
    };
    window.$Q.callQt(JSON.stringify(option));
}

/**
 * 查询结构件与标记/补片的关联关系
 * @param params
 * @param aircraft
 * @constructor
 */
//TODO URL获取
function SelectionStrucutreMarkerPatchRelation(params, aircraft,asmsPro) {
    var url=asmsPro+ "/structureModelInfo/queryByTypeId" + "/" + params;
    var xmlHttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    xmlHttp.open("get", url, false);
    xmlHttp.withCredentials = true;
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            var recvMsg = JSON.parse(xmlHttp.responseText);
            ProcessRecvResult(recvMsg.result,aircraft);
        }
    };
    xmlHttp.send();
}

/**
 * 处理ajax请求返回结果
 * @param infoObj 结果对象 json
 * @param aircraft 飞机信息
 * @constructor
 */
function ProcessRecvResult(infoObj, aircraft) {
    var obj = [{"marker": []}, {"patch": []}, {"structure": []}];

    var tmpMarkers = infoObj.marker;
    if (null != tmpMarkers && tmpMarkers.length > 0){
        for (var i = 0; i < tmpMarkers.length; i++){
            obj[0].marker.push({id:tmpMarkers[i]});
        }
    }

    var tmpPatches = infoObj.patch;
    if (null != tmpPatches && tmpPatches.length > 0 ){
        for (var j = 0; j < tmpPatches.length; j++){
            obj[1].patch.push({id:tmpPatches[j]});
        }
    }

    var tmpStructures = infoObj.structure;
    if (null != tmpStructures && tmpStructures.length > 0){
        for (var m = 0; m < tmpStructures.length; m++){
            obj[2].structure.push({id:tmpStructures[m]});
        }
    }

    GetObjectById({
        aircraftInfo: aircraft,
        strOptions: obj
    });

}

/**
 * 创建动态标记
 * @param options
 * @constructor
 */
function GenerateDynamicMarkers(options, ticket) {
    var option = {
        object: "window",
        function: "generateDynamicMarkersListener",
        param: options
    };
    window.$Q.callQt(JSON.stringify(option));
}

//
function ReloadModel(strOptions, ticket) {
    var option = {
        object: "window",
        function: "loadModelListener",
        param: strOptions
    };
    window.$Q.callQt(JSON.stringify(option));
}


/**
 *生成凹坑图、热力图
 *
 * @param strOptions
 * @constructor
 */
function ReLoadPitChart(strOptions) {
    var option = {
        object: "window",
        function: "reLoadPitChartListener",
        param: strOptions
    };
    //alert("发送消息给QT");
    window.$Q.callQt(JSON.stringify(option));
}

