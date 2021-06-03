
// import getTabList from './ewisAndOilLeakTabList'
export default (fnJson)=>{
    return {
        tabList:[
            {
                headerName: '',//选择列头部显示的文字，可以为空
                checkboxSelection: true,//设置为ture显示为复选框
                headerCheckboxSelection: true, //表头是否也显示复选框，全选反选用
                // 'pinned': 'left', //固定再左边
                width: 50 //列的宽度
            },
            { headerName: '操作', field: 'operator', width: 60,  suppressFilter:true,cellRenderer: fnJson.oprateCellRenderer},
            { headerName: '告警时间', field: "alarmTime",   width: 100, suppressFilter:true, valueFormatter: fnJson.dateFormatter },
            { headerName: '告警编号', field: "alarmNo",  filter: 'agNumberColumnFilter', width: 60, suppressFilter:true, },
            { headerName: '构型号', field: "sn", width: 110, suppressFilter:true, },
            { headerName: '件号', field: "pn",  width: 110,  suppressFilter:true},
            { headerName: '章节号', field: "ata", width: 110,  suppressFilter:true},
            { headerName: '部件名称', filter: 'partName', field: "partName", width: 110,  suppressFilter:true},
            { headerName: '当月非计划拆换次数', field: "monthReplaceTimes",  filter: 'agTextColumnFilter', width: 80,  suppressFilter:true},
            { headerName: '当月非计划拆换千时率', field: "monthReplaceRate", width: 80,  suppressFilter:true},
            { headerName: '当月警戒值', field: "monthWarningValue", width: 110,  suppressFilter:true},
            { headerName: '3月非计划拆换次数', field: "threeMonthReplaceTimes", width: 110,  suppressFilter:true},
            { headerName: '3月非计划拆换千时率', field: "threeMonthReplaceRate", width: 110,  suppressFilter:true},
            { headerName: '3月警戒值', field: "threeMonthWarningValue", width: 110,  suppressFilter:true},
            { headerName: '是否真告警', field: "ifAlarm", width: 110,  suppressFilter:true,valueFormatter:fnJson.formatYesAndNo},
            { headerName: '备注', field: "remark", width: 110,  suppressFilter:true},
            { headerName: '状态', field: "status", width: 110,  suppressFilter:true,valueFormatter:fnJson.formatAlarmStatus},
            { headerName: '报警单编号', field: "warningNo", width: 110,  suppressFilter:true},
        ],
        childColumnDefs:[
            {headerName:'序号',field: "index",width: 60,suppressSorting: true,suppressResize: true, suppressFilter:false,
                valueGetter: params => params.node.rowIndex + 1,},
            { headerName: '关联文件号', field: "relationNo", width: 110,  suppressFilter:true},
            { headerName: '关联文件类型', field: "type", width: 110,  suppressFilter:true},
            { headerName: 'CC编号', field: "ccNo", width: 110,  suppressFilter:true},
            { headerName: '类型', field: "type", width: 110,  suppressFilter:true},
            { headerName: '拆下机号', field: "offAcNo", width: 110,  suppressFilter:true},
            { headerName: '件号', field: "pn", width: 110,  suppressFilter:true},
            { headerName: '序号', field: "sn", width: 110,  suppressFilter:true},
            { headerName: '部件名称', field: "partName", width: 110,  suppressFilter:true},
            { headerName: 'TSR', field: "tsr", width: 110,  suppressFilter:true},
            { headerName: 'TSI', field: "tsi", width: 110,  suppressFilter:true},
            { headerName: '上次修理厂', field: "lastMro", width: 110,  suppressFilter:true},
            { headerName: '送修报告', field: "repairReport", width: 110,  suppressFilter:true},
            { headerName: 'FH', field: "fh", width: 110,  suppressFilter:true},
        ],
        //页面列表接口
        // tabUrl:'maintenanceProduction/ewisOilPackage/queryList',
        //页面对应详情标题
        title:'部件拆换率超限',
        hasTopSearch:true,
        //对应详情页
        src:resolve=>require(["../monitoring/detail.vue"], resolve),
        queryParam: [
            {
                "column": "type",
                "value": "PART",
                "type": "eq"
            }
        ]
    }
}
