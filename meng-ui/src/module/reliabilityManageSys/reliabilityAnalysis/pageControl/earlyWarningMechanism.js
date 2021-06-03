
// import getTabList from './ewisAndOilLeakTabList'
export default (fnJson)=>{
    return {
        tabList:[
            {
                headerName: '',//选择列头部显示的文字，可以为空
                checkboxSelection: true,//设置为ture显示为复选框
                headerCheckboxSelection: true, //表头是否也显示复选框，全选反选用
                width: 50 //列的宽度
            },
            { headerName: '操作', field: 'operator', width: 60,  suppressFilter:true,cellRenderer: fnJson.oprateCellRenderer},
            { headerName: '类别', field: "winterRainy",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true,
                valueFormatter: obj => {
                    let arr = {'WINTER': '冬季', 'RAINY': '雨季'};
                    return arr[obj.value]
                }
            },
            { headerName: '告警时间', field: "alarmTime", suppressFilter:true,cellRenderer:fnJson.showDateAndMenu,valueFormatter: fnJson.dateFormatter },
            { headerName: '告警编号', field: "alarmNo", width: 110, suppressFilter:true, },
            { headerName: '机型', field: "model", width: 110,  suppressFilter:true},
            { headerName: '章节号', field: "ata", width: 110,  suppressFilter:true},
            { headerName: '故障数', filter: 'defectQty', field: "defectQty", width: 110,  suppressFilter:true},
            { headerName: '故障率', field: "defectRate",  filter: 'agTextColumnFilter', width: 80,  suppressFilter:true},
            { headerName: '历史影响因子', field: "historyImpactFactors", width: 80,  suppressFilter:true},
            { headerName: '影响因子', field: "impactFactors", width: 110,  suppressFilter:true},
            { headerName: '增长百分比', field: "growthPercentage", width: 110,  suppressFilter:true},
            { headerName: '是否真告警', field: "ifAlarm", width: 110,  suppressFilter:true,valueFormatter:fnJson.formatYesAndNo},
            { headerName: '备注', field: "remark", width: 110,  suppressFilter:true},
            { headerName: '报警单编号', field: "warningNo", width: 110,  suppressFilter:true},
        ],
        childColumnDefs:[
            {headerName:'序号',field: "index",width: 60,suppressSorting: true,suppressResize: true, suppressFilter:false,
                valueGetter: params => params.node.rowIndex + 1,},
            { headerName: '故障编号', field: "defectNo", width: 110,  suppressFilter:true},
            { headerName: 'Latest Defect No', field: "latestDefectNo", width: 110,  suppressFilter:true},
            { headerName: '发现日期', field: "dateFound", width: 110,  suppressFilter:true, cellRenderer: fnJson.dateFormatter},
            { headerName: '飞机号', field: "acNo", width: 110,  suppressFilter:true},
            { headerName: '航站', field: "station", width: 110,  suppressFilter:true},
            { headerName: '故障描述', field: "defectDesc", width: 110,  suppressFilter:true},
            { headerName: 'ACTION', field: "action", width: 110,  suppressFilter:true},
            { headerName: '关联NRC', field: "nrcNo", width: 110,  suppressFilter:true},
        ],
        //页面列表接口
        // tabUrl:'maintenanceProduction/ewisOilPackage/queryList',
        //页面对应详情标题
        title:'冬雨季故障率',
        hasTopSearch:true,
        //对应详情页
        src:resolve=>require(["../monitoring/detail.vue"], resolve),
        queryParam: [
            {
                "column": "type",
                "value": "PRE",
                "type": "eq"
            }
        ]
    }
}
