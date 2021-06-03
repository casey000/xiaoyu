export default (vm) => {
    return {
        detailList: {
            fourBitATAFailureRateOverrun: [
                [
                    {wid: 8, prop: 'alarmTime', name: '告警时间：', isTime: true},
                    {wid: 8, prop: 'model', name: '机型：', isTime: false},
                    {wid: 8, prop: 'ata', name: '章节号：', isTime: false}],
                [
                    {wid: 8, prop: 'monthDefectQty', name: '单月故障数：', isTime: false},
                    {wid: 8, prop: 'monthDefectRate', name: '单月故障率：', isTime: false},
                    {wid: 8, prop: 'monthWarningValue', name: '单月警戒值：', isTime: false}],
                [
                    {wid: 8, prop: 'threeMonthDefectQty', name: '3月故障数：', isTime: false},
                    {wid: 8, prop: 'threeMonthDefectRate', name: '3月故障率：', isTime: false},
                    {wid: 8, prop: 'threeMonthWarningValue', name: '3月警戒值：', isTime: false}
                ],
                [
                    {wid: 8, prop: 'ifAlarm', name: '是否真告警：', isTime: false},
                    {wid: 8, prop: 'remark', name: '备注：', isTime: false},
                    {wid: 8, prop: 'status', name: '状态：', isTime: false}
                ],
                [
                    {wid: 8, prop: 'warningNo', name: '报警单编号：', isTime: false}
                ]
            ],
            partReplaceRateOut: [
                [
                    {wid: 8, prop: 'alarmTime', name: '告警时间：', isTime: false},
                    {wid: 8, prop: 'sn', name: '构型号：', isTime: false},
                    {wid: 8, prop: 'pn', name: '件号：', isTime: false}
                ],
                [
                    {wid: 8, prop: 'ata', name: '章节号：', isTime: false},
                    {wid: 8, prop: 'partName', name: '部件名称：', isTime: false},
                    {wid: 8, prop: 'monthReplaceTimes', name: '当月非计划拆换次数：', isTime: false}
                ],
                [
                    {wid: 8, prop: 'monthReplaceRate', name: '当月非计划拆换千时率：', isTime: false},
                    {wid: 8, prop: 'monthWarningValue', name: '当月警戒值：', isTime: false},
                    {wid: 8, prop: 'threeMonthReplaceTimes', name: '3月非计划拆换次数：', isTime: false}
                ],
                [
                    {wid: 8, prop: 'threeMonthReplaceRate', name: '3月非计划拆换千时率：', isTime: false},
                    {wid: 8, prop: 'threeMonthWarningValue', name: '3月警戒值：', isTime: false},
                    {wid: 8, prop: 'ifAlarm', name: '是否真告警：', isTime: false}
                ],
                [
                    {wid: 8, prop: 'remark', name: '备注：', isTime: false},
                    {wid: 8, prop: 'status', name: '状态：', isTime: false},
                    {wid: 8, prop: 'reason', name: '报警单编号：', isTime: false}
                ]
            ],
            earlyWarningMechanism: [
                [
                    {wid: 8, prop: 'winterRainy', name: '类别：', isTime: false},
                    {wid: 8, prop: 'alarmTime', name: '告警时间：', isTime: false},
                    {wid: 8, prop: 'model', name: '机型：', isTime: false}
                ],
                [
                    {wid: 8, prop: 'ata', name: '章节号：', isTime: false},
                    {wid: 8, prop: 'defectQty', name: '故障数：', isTime: false},
                    {wid: 8, prop: 'defectRate', name: '故障率：', isTime: false}
                ],
                [
                    {wid: 8, prop: 'historyImpactFactors', name: '历史影响因子：', isTime: false},
                    {wid: 8, prop: 'impactFactors', name: '影响因子：', isTime: false},
                    {wid: 8, prop: 'growthPercentage', name: '增长百分比：', isTime: false}
                ],
                [
                    {wid: 8, prop: 'ifAlarm', name: '是否真告警：', isTime: false},
                    {wid: 8, prop: 'remark', name: '备注：', isTime: false},
                    {wid: 8, prop: 'warningNo', name: '报警单编号：', isTime: false}
                ]
            ]
        },
        columnDefsData1: [
            {headerName: '关联文件号', field: 'relationNo', width: 100, suppressFilter: true,},
            {
                headerName: 'Latest Defect No',
                field: "businessNo",
                width: 110,
                suppressFilter: true,
                cellRenderer: vm.mulNoOprateCell
            },
            {headerName: '关联文件类型', field: "relationDocType", width: 110, suppressFilter: true,},
            {headerName: 'CC编号', field: "ccNo", width: 110, suppressFilter: true,},
            {headerName: '类型', field: "type", width: 110, suppressFilter: true,},
            {
                headerName: '拆下机号',
                field: "agNo",
                width: 110,
                suppressFilter: true,
                valueFormatter: vm.dateFormatter
            },
            {headerName: '件号', field: "pn", width: 110, suppressFilter: true,},
            {
                headerName: '序号',
                field: "sn",
                width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
                valueGetter: params => params.node.rowIndex + 1,

            },
            {headerName: '部件名称', field: "partName", width: 110, suppressFilter: true,},
            {headerName: 'TSR', field: "tsr", width: 110, suppressFilter: true,},
            {headerName: 'TSI', field: "tsi", width: 110, suppressFilter: true,},
            {headerName: '上次修理厂', field: "lastMro", width: 110, suppressFilter: true,},
            {headerName: '送修报告', field: "repairReport", width: 110, suppressFilter: true,},
            {headerName: 'FH', field: "fh", width: 110, suppressFilter: true,},
        ],
        columnDefsData2: [
            {
                headerName: '序号',
                field: "index",
                width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
                valueGetter: params => params.node.rowIndex + 1,

            },
            {headerName: '故障编号', field: 'defectNo', width: 100, suppressFilter: true,},
            {
                headerName: 'Latest Defect No',
                field: "latestDefectNo",
                width: 110,
                suppressFilter: true,
                cellRenderer: vm.mulNoOprateCell
            },
            {headerName: '发现日期', field: "dateFound", width: 110, suppressFilter: true,},
            {headerName: '飞机号', field: "acNo", width: 110, suppressFilter: true,},
            {headerName: '航站', field: "station", width: 110, suppressFilter: true,},
            {
                headerName: '故障描述',
                field: "defectDesc",
                width: 110,
                suppressFilter: true,
                valueFormatter: vm.dateFormatter
            },
            {headerName: 'ACTION', field: "action", width: 110, suppressFilter: true,},
            {headerName: '关联NRC', field: "nrcNo", width: 110, suppressFilter: true,},
        ],
        titleJson: {
            earlyWarningMechanism: '冬雨季故障率超限',
            fourBitATAFailureRateOverrun: '故障率超限',
            partReplaceRateOut: '部件拆换率超限'
        }
    }
}
