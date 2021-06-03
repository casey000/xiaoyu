// 注册新页面
//按需引入不同页面基础数据,如果需要创建新的页面，在这里引用进来
export default {
    //重复性故障页面
    repeatDefectList:()=>require('../reliabilityManageSys/reliabilityAnalysis/pageControl/repeatListConfig').default,
    // ewis故障页面
    ewisDefectList:()=>require('../reliabilityManageSys/reliabilityAnalysis/pageControl/ewisDefectConfig').default,
    //油量渗漏页面
    oilLeakageList:()=>require('../reliabilityManageSys/reliabilityAnalysis/pageControl/oilLeakageConfig').default,
    // 多发性故障
    multipleDefectList:()=>require('../reliabilityManageSys/reliabilityAnalysis/pageControl/multipleDefectList').default,
    //预警机制报警
    earlyWarningMechanism:()=>require('../reliabilityManageSys/reliabilityAnalysis/pageControl/earlyWarningMechanism').default,
    //4位ATA故障率超限
    fourBitATAFailureRateOverrun:()=>require('../reliabilityManageSys/reliabilityAnalysis/pageControl/fourBitATAFailureRateOverrun').default,
    //部件拆换率超限
    partReplaceRateOut:()=>require('../reliabilityManageSys/reliabilityAnalysis/pageControl/partReplaceRateOut').default,
    //可靠性报警单
    ReliabilityAlarmList:()=>require('../reliabilityManageSys/investigationReport/pageControl/reliabilityAlarmList').default,
    //技术通告单页面
    TechnicalNotice:()=>require('../reliabilityManageSys/investigationReport/pageControl/technicalNotice').default,
    //调查报告页面
    investigationReport:()=>require('../reliabilityManageSys/investigationReport/pageControl/investigationReport').default,
//会议管理页面
    issueManage:()=>require('../reliabilityManageSys/meetingManage/pageControl/issueManage').default,
//议题管理页面
    meetingManage:()=>require('../reliabilityManageSys/meetingManage/pageControl/meetingManage').default
}
