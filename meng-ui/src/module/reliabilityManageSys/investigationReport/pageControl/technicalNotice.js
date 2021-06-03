
// import getTabList from './ewisAndOilLeakTabList'
export default (fnJson)=>{
    return {
        //主页表格
        tabList:[
            { headerName: '状态', field: "status",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true,valueFormatter:obj=>{
                    switch (obj.value) {
                        case '2':
                            return '评估中';
                        case '3':
                            return  '待决议';
                        case '4':
                            return  '执行中';
                        case '5':
                            return  '已归档';
                        case '6':
                            return  '已失效';
                        case '7':
                            return  '已完成';
                        default:
                            return ''
                    }
                } },
            { headerName: '编号', field: "reportNo",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '版本号', field: "revNo",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '类型1', field: "sourceType",  filter: 'agNumberColumnFilter', width: 150, suppressFilter:true,valueFormatter:obj=>{
                    switch (obj.value) {
                        case '1':
                            return '多发性故障';
                        case '2':
                            return '重复性故障';

                        case '3':
                            return  'EWIS';

                        case '4':
                            return  '油液渗漏';

                        case '5':
                            return  'SDR事件';
                        case '6':
                            return  '不正常事件';
                        default:
                            return ''
                    }
                } },
            { headerName: 'WG小组', field: "wgTeam", width: 110, suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '机型', field: "model",filter: 'agDateColumnFilter',  width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '飞机号', filter: 'acMsn', field: "foundDateMin", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: 'ATA', filter: 'ata', field: "foundDateMax", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '评分结果', filter: 'ata', field: "foundDateMax", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '事件编号', filter: 'ata', field: "foundDateMax", width: 110,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '故障描述', field: "defectDesc",  filter: 'agTextColumnFilter', width: 80,  suppressFilter:true,cellRenderer:fnJson.showMenu},
            { headerName: '到期时限', field: "dueDate", width: 80,  suppressFilter:true,cellRenderer:fnJson.showDateAndMenu},
            { headerName: '创建日期', field: "createTm", width: 80,  suppressFilter:true,cellRenderer:fnJson.showDateAndMenu},
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
        tabUrl:'maintenanceReliability/relTechInfoApi/queryList',
        title:'技术通告单',
        hasMenu:true,
        //对应详情页
        src:resolve=>require(["../technicalDetail/detail.vue"], resolve),
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
