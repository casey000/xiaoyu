export default fnJson=>{
    return [{headerName:'索引',field: "index", width: 60,suppressSorting: true,suppressResize: true, suppressFilter:false, valueGetter: params => params.node.rowIndex + 1,},
    { headerName: '操作', field: 'operator',  suppressFilter:true, width: 60,cellRenderer: fnJson.oprateCellRenderer},
    { headerName: '编号', field: "faultNo", width: 110,  filter: 'agTextColumnFilter', cellRenderer: fnJson.mulNoOprateCell},
    { headerName: '版本号', field: "revNo", width: 60,  filter: 'agNumberColumnFilter', },
    { headerName: '技术通告单', field: "noticeNo", width: 110, suppressFilter:true, },
    { headerName: '机型', field: "model", width: 110,  filter: 'agTextColumnFilter',},
    { headerName: '章节', field: "ata", width: 110,  filter: 'agNumberColumnFilter'},
    { headerName: '创建时间', field: "createTime", width: 110,  filter: 'agDateColumnFilter', valueFormatter: fnJson.dateFormatter},
    { headerName: 'Found Date（Min）', field: "foundDateMin",tooltip: fnJson.dateFormatter, width: 110,  filter: 'agDateColumnFilter', valueFormatter: fnJson.dateFormatter},
    { headerName: 'Found Date（Max）',tooltip: fnJson.dateFormatter,field: "foundDateMax", width: 110,  filter: 'agDateColumnFilter', valueFormatter: fnJson.dateFormatter},
    { headerName: '核对结果', field: "verifyResult", width: 80,  filter: 'agTextColumnFilter',valueFormatter:obj=>{
        switch (obj.value) {
            case 'n':
                return 'NO';
                break;
            case 'y':
                return  'YES';
                break;
            default:
                return obj.value
        }
    }},
    { headerName: '状态', field: "archiveStatus", width: 80,  filter: 'agTextColumnFilter',valueFormatter:obj=>{
        switch (obj.value*1) {
            case 0:
                return '未确认';
                break;
            case 1:
                return  '已归档';
                break;
            case 2:
                return  '失效';
                break;
            case 3:
                return  '生效';
                break;
            default:
                return ''
        }
    }},
    { headerName: '审核状态', field: "auditStatus", width: 80,  filter: 'agTextColumnFilter',valueFormatter:obj=>{
            switch (obj.value*1) {
                case 0:
                    return '审核中';
                    break;
                case 1:
                    return  '已审核';
                    break;
                case 2:
                    return  '已驳回';
                    break;
                default:
                    return ''
            }
        }},
    { headerName: '备注', field: "remark", width: 110,  suppressFilter:true},
    ]
}
