export default {
    //重复性详情页地址
    repeatDefectList:{
        baseInfoUrl:  "/maintenanceDefect/defectRepetitiveMultipleApi/toView/",
        submit:"/maintenanceDefect/defectRepetitiveMultipleApi/"
    },
    //ewis 详情页地址
    ewisDefectList:{
        baseInfoUrl:  "/maintenanceProduction/ewisOilPackage/selectById?id=",
        submit:"/maintenanceProduction/ewisOilPackage/"
    },
    //油液详情页地址
    oilLeakageList:{
        baseInfoUrl:  "/maintenanceProduction/ewisOilPackage/selectById?id=",
        submit:"/maintenanceProduction/ewisOilPackage/"
    },
    //多发性详情页地址
    multipleDefectList:{
        baseInfoUrl:  "/maintenanceDefect/defectRepetitiveMultipleApi/toView/",
        submit:"/maintenanceDefect/defectRepetitiveMultipleApi/"
    },
    //预警机制详情页地址
    earlyWarningMechanism:{
        ifAuditAlarm:"/maintenanceReliability/relAlarm/ifAuditAlarm/",
        //查主信息
        baseInfoUrl: "/maintenanceReliability/relAlarm/findById/",
        //查表格信息
        queryPartDetailList:'/maintenanceReliability/relAlarm/queryPartDetailList/',
        //提交
        submit:"/maintenanceReliability/relAlarm/"
    },
    //4位ATA 详情页地址
    fourBitATAFailureRateOverrun:{
        ifAuditAlarm:"/maintenanceReliability/relAlarm/ifAuditAlarm/",
        //查主信息
        baseInfoUrl: "/maintenanceReliability/relAlarm/findById/",
        //查表格信息
        queryPartDetailList:'/maintenanceReliability/relAlarm/queryPartDetailList/',
        //提交
        submit:"/maintenanceReliability/relAlarm/"
    },
    //部件拆换详情页地址
    partReplaceRateOut:{
        ifAuditAlarm:"/maintenanceReliability/relAlarm/ifAuditAlarm/",
        //查主信息
        baseInfoUrl: "/maintenanceReliability/relAlarm/findById/",
        //查表格信息
        queryPartDetailList:'/maintenanceReliability/relAlarm/queryPartDetailList/',
        //提交
        submit:"/maintenanceReliability/relAlarm/"
    },

}