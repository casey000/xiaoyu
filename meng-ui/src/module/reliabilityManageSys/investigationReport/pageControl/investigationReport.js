
// import getTabList from './ewisAndOilLeakTabList'
export default (fnJson)=>{
    return {
        //主页表格
        tabList:[
            {
                headerName:'索引',
                field: "index",
                width: 80,suppressSorting: true,suppressResize: true, suppressFilter:false,
                valueGetter: params => params.node.rowIndex + 1,

            },
            { headerName: '状态', field: "status",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '编号', field: "businessNo",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '版本号', field: "ver",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '调查类型', field: "type",  filter: 'agNumberColumnFilter', width: 150, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '标题', field: "title",  filter: 'agNumberColumnFilter', width: 150, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: 'WG小组', field: "wgTeam", width: 110, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '机型', field: "model",filter: 'agDateColumnFilter',  width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '飞机号', filter: 'aircraft', field: "foundDateMin", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: 'ATA', filter: 'ata', field: "foundDateMax", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '相关通告单/报警单', filter: 'sourceType', field: "foundDateMax", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '到期时间', field: "becomeDue", width: 80,  suppressFilter:true,cellRenderer:fnJson.showDateAndMenu},
            { headerName: '创建日期', field: "createTm", width: 80,  suppressFilter:true,cellRenderer:fnJson.showDateAndMenu},
            { headerName: '评估人', field: "evaluationSn", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '评估时间', field: "evaluationTime", width: 110,  suppressFilter:true,cellRenderer:fnJson.showDateAndMenu},
            { headerName: '回顾状态', field: "reviewStatus", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '回顾期限', field: "reviewDate", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '任务情况', field: "taskDesc", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
        ],
        //延期情况
        extensionAlertColumn: [
            { headerName: '原期限', field: "defectNo", width: 110, suppressFilter: true, cellRenderer: fnJson.mulNoOprateCell },
            { headerName: '延期日期', field: "acReg", width: 110, suppressFilter: true, },
            { headerName: '延期原因', field: "dateFound", width: 110, suppressFilter: true},
            { headerName: '申请人', field: "faultReportChn", width: 110, suppressFilter: true, },
            { headerName: '申请日期', field: "faultReportEng", width: 110, suppressFilter: true, valueFormatter: fnJson.dateFormatter },
            { headerName: '审批意见', field: "faultReportEng", width: 110, suppressFilter: true },
        ],
        //评估情况
        assessmentColumn:[
            { headerName: '原期限', field: "defectNo", width: 110, suppressFilter: true, cellRenderer: fnJson.mulNoOprateCell },
            { headerName: '延期日期', field: "acReg", width: 110, suppressFilter: true, },
            { headerName: '延期原因', field: "dateFound", width: 110, suppressFilter: true},
            { headerName: '申请人', field: "faultReportChn", width: 110, suppressFilter: true, },
            { headerName: '申请日期', field: "faultReportEng", width: 110, suppressFilter: true, valueFormatter: fnJson.dateFormatter },
            { headerName: '审批意见', field: "faultReportEng", width: 110, suppressFilter: true },
        ],
        //页面列表接口
        //页面对应详情标题
        title:'调查报告',
        hasMenu:true,
        hasTopSearch:true,
        //对应详情页
        src:resolve=>require(["../investigationReportDetail/detail.vue"], resolve),
        //参数区分
        queryParam: [
            // {
            //     "column": "type",
            //     "value": "E",
            //     "type": "eq"
            // }
        ]
    }
}
