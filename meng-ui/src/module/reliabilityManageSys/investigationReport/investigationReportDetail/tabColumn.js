// import Vue from "vue";
import { formatDate } from '../../../../common/js/util/date.js'

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
        nrcColumn:[
            { headerName: 'NRC编号', field: "defectNo", width: 100, suppressFilter:true},
            { headerName: '报告日期', field: "dateFound", width: 100, suppressFilter:true},
            { headerName: '飞机号', field: "acNo", width: 100, suppressFilter:true},
            { headerName: '航站', field: "station", width: 100, suppressFilter:true},
            { headerName: '缺陷描述', field: "defectDesc", width: 100, suppressFilter:true},
            { headerName: '关联故障', field: "nrcNo", width: 100, suppressFilter:true},
        ],
        techColumn:[
            { headerName: '状态', field: "status",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true},
            { headerName: '编号', field: "reportNo",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true},
            { headerName: '版本号', field: "revNo",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true},
            { headerName: '类型', field: "sourceType",  filter: 'agNumberColumnFilter', width: 150, suppressFilter:true},
            { headerName: 'WG小组', field: "wgTeam", width: 110, suppressFilter:true},
            { headerName: '机型', field: "model",filter: 'agDateColumnFilter',  width: 110,  suppressFilter:true},
            { headerName: '飞机号', filter: 'acMsn', field: "foundDateMin", width: 110,  suppressFilter:true},
            { headerName: 'ATA', filter: 'ata', field: "foundDateMax", width: 110,  suppressFilter:true},
            { headerName: '评分结果', filter: 'ata', field: "foundDateMax", width: 110,  suppressFilter:true},
            { headerName: '事件编号', filter: 'ata', field: "foundDateMax", width: 110,  suppressFilter:true},
            { headerName: '故障描述', field: "defectDesc",  filter: 'agTextColumnFilter', width: 80,  suppressFilter:true},
            { headerName: '到期时限', field: "dueDate", width: 80,  suppressFilter:true,valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss")},
            { headerName: '创建日期', field: "createTm", width: 80,  suppressFilter:true,valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss")},
            { headerName: '当前处理人', field: "taskHandler", width: 110,  suppressFilter:true},
            { headerName: '评估人', field: "assessSn", width: 110,  suppressFilter:true},
            { headerName: '评估时间', field: "assessTm", width: 110,  suppressFilter:true,valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss")},
            { headerName: '任务情况', field: "taskDesc", width: 110,  suppressFilter:true},
        ],
        portColumn:[
            { headerName: '状态', field: "status",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true},
            { headerName: '编号', field: "businessNo",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true},
            { headerName: '版本号', field: "ver",  filter: 'agTextColumnFilter', width: 100, suppressFilter:true},
            { headerName: '调查类型', field: "type",  filter: 'agNumberColumnFilter', width: 150, suppressFilter:true},
            { headerName: '标题', field: "title",  filter: 'agNumberColumnFilter', width: 150, suppressFilter:true},
            { headerName: 'WG小组', field: "wgTeam", width: 110, suppressFilter:true},
            { headerName: '机型', field: "model",filter: 'agDateColumnFilter',  width: 110,  suppressFilter:true},
            { headerName: '飞机号', filter: 'aircraft', field: "foundDateMin", width: 110,  suppressFilter:true},
            { headerName: 'ATA', filter: 'ata', field: "foundDateMax", width: 110,  suppressFilter:true},
            { headerName: '相关通告单/报警单', filter: 'sourceType', field: "foundDateMax", width: 110,  suppressFilter:true},
            { headerName: '到期时间', field: "becomeDue", width: 80,  suppressFilter:true,valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss"),},
            { headerName: '创建日期', field: "createTm", width: 80,  suppressFilter:true,valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss"),},
            { headerName: '评估人', field: "evaluationSn", width: 110,  suppressFilter:true},
            { headerName: '评估时间', field: "evaluationTime", width: 110,  suppressFilter:true,valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss"),},
            { headerName: '回顾状态', field: "reviewStatus", width: 110,  suppressFilter:true},
            { headerName: '回顾期限', field: "reviewDate", width: 110,  suppressFilter:true},
            { headerName: '任务情况', field: "taskDesc", width: 110,  suppressFilter:true},
        ],
        editorList:[{
            title:'*技术分析：',
            prop:'technology'
        },{
            title:'系统原理分析：',
            prop:'principle'
        },{
            title:'系统/部件工作环境分析：',
            prop:'TECHNICAL_ANLS'
        },{
            title:'故障数据分析：',
            prop:'defectData'
        },{
            title:'送修数据分析：',
            prop:'repairData'
        },{
            title:'其他公司经验：',
            prop:'otherCompanyExperience'
        },{
            title:'经济型分析：',
            prop:'economic'
        },{
            title:'相关MEL/CDL：',
            prop:'mel'
        }]
    }
}
