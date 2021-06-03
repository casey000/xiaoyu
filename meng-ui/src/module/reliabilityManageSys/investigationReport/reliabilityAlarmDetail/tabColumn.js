import Vue from "vue";

export default (vm)=>{
    return {
        //故障信息
        defectColumn: [
            {
                headerName:'序号',
                field: "index",
                width: 60,suppressSorting: true,suppressResize: true, suppressFilter:false,
                valueGetter: params => params.node.rowIndex + 1,

            },
            { headerName: '故障编号', field: "defectNo", width: 100, suppressFilter:true},
            { headerName: 'Latest Defect No', field: "latestDefectNo", width: 100, suppressFilter:true},
            { headerName: '发现日期', field: "dateFound", width: 100, suppressFilter:true},
            { headerName: '飞机号', field: "acNo", width: 100, suppressFilter:true},
            { headerName: '航站', field: "station", width: 100, suppressFilter:true},
            { headerName: '故障描述', field: "defectDesc", width: 100, suppressFilter:true},
            { headerName: 'ACTION', field: "action", width: 100, suppressFilter:true},
            { headerName: '关联NRC', field: "nrcNo", width: 100, suppressFilter:true},
        ],
        //部件信息
        partsColumns:[
            { headerName: '关联文件号', field: "relationNo", width: 100, suppressFilter:true},
            { headerName: '关联文件类型', field: "relationDocType", width: 100, suppressFilter:true},
            { headerName: 'CC编号', field: "ccNo", width: 100, suppressFilter:true},
            { headerName: '类型', field: "type", width: 100, suppressFilter:true},
            { headerName: '拆下机号', field: "agNo", width: 100, suppressFilter:true},
            { headerName: '件号', field: "pn", width: 100, suppressFilter:true},
            { headerName: '序号', field: "sn", width: 100, suppressFilter:true},
            { headerName: '部件名称', field: "partName", width: 100, suppressFilter:true},
            { headerName: 'TSR', field: "tsr", width: 100, suppressFilter:true},
            { headerName: 'TSI', field: "tsi", width: 100, suppressFilter:true},
            { headerName: '上次修理厂', lastMro: "status", width: 100, suppressFilter:true},
            { headerName: '送修报告', field: "repairReport", width: 100, suppressFilter:true},
            { headerName: 'FH', field: "fh", width: 100, suppressFilter:true},
        ],
        //富文本对应字段
        editorList:[{
            title:'技术分析：',
            prop:'TECHNICAL_ANLS'
        },{
            title:'系统原理分析：',
            prop:'SYSTEM_PRINCIPLE_ANLS'
        },{
            title:'系统/部件工作环境分析：',
            prop:'SYSTEM_PART_ENV_ANLS'
        },{
            title:'故障数据分析：',
            prop:'DETECT_DATA_ANLS'
        },{
            title:'送修数据分析：',
            prop:'REPAIR_DATA_ANLS'
        },{
            title:'其他公司经验：',
            prop:'OTHER_COMPANY_EXPERIENCE'
        },{
            title:'经济性分析：',
            prop:'ECONOMIC_ANLS'
        }]
    }
}
