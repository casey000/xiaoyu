var sheetTemplates = {
	"signle" : {
		"sheetName" : "结果集",
		"tables" : [ {
			"@type" : "table",
			"defaultColumnCell" : {
				"style" : {
					"width" : 120,
					"height" : 40
				}
			},
			"defaultHeadCell" : {
				"style" : {
					"backgroundColor" : "#C0C0C0",
					"fontWeight" : "blod",
					"height" : 50
				}
			},
			"headCells" : [],
			"columnCells" : []
		} ]
	}
};

function formatCurDate(p){
	var date = new Date();
	p = p || 'yyyyMMdd';
	var o = { 
			"M+" : date.getMonth()+1, //month 
			"d+" : date.getDate(), //day 
			"h+" : date.getHours(), //hour 
			"m+" : date.getMinutes(), //minute 
			"s+" : date.getSeconds(), //second 
			"q+" : Math.floor((date.getMonth()+3)/3), //quarter 
			"S" : date.getMilliseconds() //millisecond 
    };
	if(new RegExp('y+').test(p)) { 
		p = p.replace(RegExp.lastMatch, (date.getFullYear()+"").substr(4 - RegExp.lastMatch.length)); 
	} 

	for(var k in o) { 
		if(new RegExp("("+ k +")").test(p)) { 
			p = p.replace(RegExp.lastMatch, RegExp.lastMatch.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
		} 
	}
	return p;
}

/**
 * 动态导出表格
 * @param options
 * @returns
 */
function dynamicExport(options){
	var o = {
		sfaQuery : $(document).sfaQuery(),
		container : top.document,
		fileName : "",
		url : ""
	};
	
	$.extend(o, options);
	if(o.fileName){
		if(o.fileName.indexOf('{date}') !=-1){
			o.fileName = o.fileName.replace('{date}',formatCurDate());
		}else if(o.fileName.indexOf('{time}') !=-1){
			o.fileName = o.fileName.replace('{date}',formatCurDate('yyyyMMdd hh:mm:ss'));
		}
	}
	var	form = $("<form method='post' style='display:none' action='" + o.url + "'></form>");
	
	//处理查询参数
	$.each(o.sfaQuery.postData(), function(key, val){
		if(typeof(val) == "object" ){
			$.each(val, function(k1, v1){
				// 处理查询参数含有单引号
				form.append($('<input name="' + key + '" value = "' + v1 + '"/>'));
			});
		}else{
			// 处理查询参数含有单引号
//			form.append($("<input name='" + key + "' value = '" + val + "'/>"));	
			form.append($('<input name="' + key + '" value = "' + val + '"/>'));
		}
	});
	
	//处理需要显示的列
	var sheet = {};
	$.extend(true, sheet, sheetTemplates.signle);
	var colModels = o.sfaQuery.queryGrid.jqGrid.getGridParam("colModel");
    buildSheetCols(sheet, colModels);


    form.append($("<input name='sheetStr' value = '" + JSON.stringify(sheet) + "'/>"));
    form.append($("<input name='fileName' value = '" + encodeURI(o.fileName) + "'/>"));

	o.container.append(form);
	form.submit();
	form.remove();
}


/**
 * 动态导出表格
 * @param options
 * @returns
 */
function dynamicExportMVC(options) {
    var o = {
        sfaQuery: $(document).sfaQuery(),
        container: top.document,
        fileName: "",
        url: ""
    };
    $.extend(o, options);

    if (o.fileName) {
        if (o.fileName.indexOf('{date}') != -1) {
            o.fileName = o.fileName.replace('{date}', formatCurDate());
        } else if (o.fileName.indexOf('{time}') != -1) {
            o.fileName = o.fileName.replace('{date}', formatCurDate('yyyyMMdd hh:mm:ss'));
        }
    }
    //处理需要显示的列
    var sheet = {};
    $.extend(true, sheet, sheetTemplates.signle);
    var colModels = o.sfaQuery.queryGrid.jqGrid.getGridParam("colModel");
    buildSheetCols(sheet, colModels);

    var exportObj = o.sfaQuery.postData();
    // 监控列表的列表打开方式不同，打印时需要重新在前端设置默认查询属性
    if (o.defaultParam) {
        o.sfaQuery._merge(exportObj, exportObj, o.defaultParam, 'qname');
        o.sfaQuery._merge(exportObj, exportObj, o.defaultParam, 'qoperator');
        o.sfaQuery._merge(exportObj, exportObj, o.defaultParam, 'qvalue');
    }
    exportObj.sheetStr = JSON.stringify(sheet);
    exportObj.fileName = encodeURI(o.fileName);

    $.ajax({
        url: o.url,
        dataType: "json",
        data: JSON.stringify(exportObj),
        contentType: "application/json;charset=utf-8",
        type: 'POST',
        async: false,
        cache: false,
        success: function (data, textStatus) {
            if (data.code === 200) {
                window.location.href = data.data;
            } else if (data.msg) {
                alert(data.msg);
            } else {
                alert("导出失败，请联系管理员.");
            }
        }
    });
}

function buildSheetCols(sheet, colModels) {
    var _colName, celObj;
    $.each(colModels, function (key, val) {
        if (val.hidden || val.isOpts) {
            return;
        }

        if (val.name == 'rn') {
            sheet.tables[0].headCells.push({
                "value": "序号"
            });
            sheet.tables[0].columnCells.push({
                "property": "rowNum",
                "style": {
                    "width": 50
                }
            });
            return;
        }

        if (val.colNameEn == null) {
            return;

        }
        // 去除表头的单引号
        _colName = val.colNameEn;
        if (_colName.indexOf("'") != -1) {
            _colName = _colName.replace(/'/ig, "‘")
        }
        sheet.tables[0].headCells.push({
            "value": _colName
        });

        celObj = {
            "property": val.name,
            "formatter": val.formatType,
            "style": {
                "width": val.width * 1.5
            }
        };
        var typeArr = "|map|merge|";
        // 获取js定制的map格式化
        if (typeArr.indexOf(val.formatType) != -1 && val.pattern)
            celObj['pattern'] = val.pattern;
        // 参数传值
        var colNames = "params";
        $.each(colNames.split(','), function (i, v) {
            if (val[v])
                celObj[v] = val[v];
        });


        sheet.tables[0].columnCells.push(celObj);
    });

    return sheet;
}