

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
            { headerName: '序号', field: 'operator', width: 60,  suppressFilter:true,cellRenderer: fnJson.oprateCellRenderer},
            { headerName: '日期', field: "alarmTime",   width: 100, suppressFilter:true, valueFormatter: fnJson.dateFormatter },
            { headerName: '会议类型', field: "sn", width: 110, suppressFilter:true, },
            { headerName: '会议编号', field: "pn",  width: 110,  suppressFilter:true},
            { headerName: 'wg小组', field: "ata", width: 110,  suppressFilter:true},
            { headerName: '纪要状态', filter: 'partName', field: "partName", width: 110,  suppressFilter:true},
        ],
        
        //页面列表接口
        // tabUrl:'maintenanceProduction/ewisOilPackage/queryList',
        //页面对应详情标题
        title:'会议管理纪要',
        hasTopSearch:true,
        //对应详情页
        src:resolve=>require(["../meetingManageDetail/detail.vue"], resolve),
        queryParam: [
            {
                "column": "type",
                "value": "PART",
                "type": "eq"
            }
        ]
    }
}
