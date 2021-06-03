export default {
    //重复性tab页地址
    repeatDefectList:{
        tabUrl:'maintenanceDefect/defectRepetitiveMultipleApi/queryList',
    },
    //ewis table页地址
    ewisDefectList:{
        tabUrl:'maintenanceProduction/ewisOilPackage/queryList',
    },
    //油液tab页地址
    oilLeakageList:{
        tabUrl:'maintenanceProduction/ewisOilPackage/queryList',
    },
    //多发性tab页地址
    multipleDefectList:{
        tabUrl:'maintenanceDefect/defectRepetitiveMultipleApi/queryList',
    },
    //预警机制tab页地址
    earlyWarningMechanism:{
        tabUrl:'maintenanceReliability/relAlarm/listPage',
        childTabUrl:'maintenanceReliability/relAlarm/queryAtaPreDetailList/',
        //页面确认接口
        sureTabUrl:'/maintenanceReliability/relAlarm/confirmAlarm',
    },
    //4位ATA tab页地址
    fourBitATAFailureRateOverrun:{
        tabUrl:'maintenanceReliability/relAlarm/listPage',
        childTabUrl:'maintenanceReliability/relAlarm/queryAtaPreDetailList/',
        //页面确认接口
        sureTabUrl:'/maintenanceReliability/relAlarm/confirmAlarm',
    },
    //部件拆换tab页地址
    partReplaceRateOut:{
        tabUrl:'maintenanceReliability/relAlarm/listPage',
        childTabUrl:'maintenanceReliability/relAlarm/queryPartDetailList/',
        //页面确认接口
        sureTabUrl:'/maintenanceReliability/relAlarm/confirmAlarm',
    },
    //预警机制tab页地址
    ReliabilityAlarmList:{
        tabUrl:'maintenanceReliability/relWarningBase/listPageMySelf',
    },
    //技术通告单tab页地址
    TechnicalNotice:{
        tabUrl:'maintenanceReliability/relTechInfoApi/queryList',
    },

    //调查报告tab页地址
    investigationReport:{
        tabUrl:'maintenanceReliability/investigationBase/selectPage',
        // tabUrl:'maintenanceDefect/defectRepetitiveMultipleApi/queryList',
    },
    //会议管理tab页地址
    meetingManage:{
        tabUrl:'maintenanceDefect/defectRepetitiveMultipleApi/queryList',
    },

    //议题管理tab页地址
    issueManage:{
        tabUrl:'maintenanceDefect/defectRepetitiveMultipleApi/queryList',
    },
}