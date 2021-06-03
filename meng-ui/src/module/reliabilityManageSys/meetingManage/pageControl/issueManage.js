export default (fnJson)=>{
    return {
        tabList:[
            {
                headerName:'索引',
                field: "index",
                width: 60,suppressSorting: true,suppressResize: true, suppressFilter:false,
                valueGetter: params => params.node.rowIndex + 1,

            },
            { headerName: '操作', field: 'operator', width: 60,  suppressFilter:true,cellRenderer: fnJson.oprateCellRenderer},
            { headerName: '编号', field: "packageNo",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true, cellRenderer: fnJson.mulNoOprateCell },
            { headerName: '版本号', field: "ver",  filter: 'agNumberColumnFilter', width: 60, suppressFilter:true, },
            { headerName: '类型', field: "subType",  filter: 'agTextColumnFilter', width: 80,valueFormatter:obj=>{
                    switch (obj.value) {
                        case 'ABLATION':
                            return '烧蚀';
                            break;
                        case 'FUELTANK':
                            return  '燃油箱';
                            break;
                        case 'LINE':
                            return  '线号';
                            break;
                        case 'PN':
                            return  '件号和设备号';
                            break;
                        case 'ONTOLOGY':
                            return  '本体';
                            break;
                        case 'PIPELINE':
                            return  '更换管路';
                            break;
                        default:
                            return ''
                    }
                } },
            { headerName: '技术通告单', field: "noticeNo", width: 110, suppressFilter:true, },
            { headerName: '创建时间', field: "createTm",filter: 'agDateColumnFilter',  width: 110,  suppressFilter:true, valueFormatter: fnJson.dateFormatter},
            { headerName: 'Found Date（Min）', filter: 'agDateColumnFilter', field: "foundDateMin", width: 110,  suppressFilter:true, valueFormatter: fnJson.dateFormatter},
            { headerName: 'Found Date（Max）', filter: 'agDateColumnFilter', field: "foundDateMax", width: 110,  suppressFilter:true, valueFormatter: fnJson.dateFormatter},
            { headerName: '状态', field: "status",  filter: 'agTextColumnFilter', width: 80,valueFormatter:obj=>{
                    switch (obj.value) {
                        case 'UNCONFIRM':
                            return '待确认';
                            break;
                        case 'CONFIRMED':
                            return  '已确认';
                            break;
                        case 'HISTORY':
                            return  '历史版本';
                            break;
                        case 'REVIEWING':
                            return  '审核中';
                            break;
                        case 'INVALIDATION':
                            return  '失效';
                            break;
                        default:
                            return ''
                    }
                }},
            { headerName: '核对结果', field: "verifyResult", width: 80,valueFormatter:obj=>{
                    switch (obj.value) {
                        case 'Y':
                            return '已核对';
                            break;
                        case 'N':
                            return  '未核对';
                            break;
                        default:
                            return ''
                    }
                }},
            { headerName: '备注', field: "remark", width: 110,  suppressFilter:true},

            { headerName: '件号', field: "pn", width: 110,  suppressFilter:true},
            { headerName: '线号', field: "lineNum", width: 110,  suppressFilter:true},
            { headerName: '设备号', field: "allNumber", width: 110,  suppressFilter:true},


        ],
        //页面列表接口
        //页面对应详情标题
        title:'议题管理',
        //对应详情页
        // src:resolve=>require(["../issueManageDetail/detail.vue"], resolve),
        queryParam: [
            {
                "column": "type",
                "value": "MULTIPLE",
                "type": "eq"
            }
        ]
    }
}