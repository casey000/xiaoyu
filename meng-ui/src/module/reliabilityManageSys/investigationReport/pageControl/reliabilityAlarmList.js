//可靠性报警单主列表基本数据
// import getTabList from './ewisAndOilLeakTabList'
export default (fnJson)=>{
    return {
        //主页表格
        tabList:[
            { headerName: '状态', field: "status",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true,
                valueFormatter: obj => {
                    let arr = {'UNEVALUATED':'未评估','EVALUATING':'评估中','RESOLUTION':'待决议', 'EXECUTE':'执行中','COMPLETED':'已完成','INVALID':'已失效'};
                    return arr[obj.value]
                }
             },
            { headerName: '报警单编号', field: "warningNo",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '类型', field: "type",  filter: 'agNumberColumnFilter', width: 150, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: 'WG小组', field: "wg", width: 110, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '机型', field: "model",filter: 'agDateColumnFilter',  width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '飞机号', filter: 'acNo', field: "acNo", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: 'ATA', filter: 'ata', field: "ata", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '故障描述', field: "defectDesc",  filter: 'agTextColumnFilter', width: 80,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '到期时间', field: "dueDate", width: 80,  suppressFilter:true,cellRenderer:fnJson.showDateAndMenu},
            { headerName: '当前处理人', field: "taskHandler", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '评估人', field: "assessSn", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '评估时间', field: "assessTm", width: 110,  suppressFilter:true,cellRenderer:fnJson.showDateAndMenu},
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
        title:'可靠性报警单',
        hasMenu:true,
        //对应详情页
        src:resolve=>require(["../reliabilityAlarmDetail/detail.vue"], resolve),
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
