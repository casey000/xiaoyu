export default {
    //预警机制tab页地址
    ReliabilityAlarmList:{
    //    故障列表
        defectTabUrl:"/maintenanceReliability/relAlarm/",
        //部件列表
        partTabUrl:"/maintenanceReliability/relAlarm/",
    //    富文本信息
        richTextUrl:"/maintenanceReliability/relWarningBase/findRichTextById/",
        //获取富文本对应字段与内容
        editTextByIdAndType:"maintenanceReliability/relWarningBase/editTextByIdAndType",
    //    保存
        keepDataUrl:"/maintenanceReliability/relWarningBase/edit",
    //    提交
        submitUrl:"/maintenanceReliability/relWarningBase/submit",
        //获取头部详情
        baseInfoUrl:"/maintenanceReliability/relWarningBase/findById/",
//相关文件措施表格查询
        partQueryList:"/maintenanceReliability/relWarningSourceFile/queryListByWarningId/",
        // 相关文件措施延期编辑确认
        partSubmitUrl:"/maintenanceReliability/relWarningSourceFile/edit",
    //    相关文件删除
        partDelUrl:"/maintenanceReliability/relWarningSourceFile/delete/",
//维修方案措施表格查询
        mainQueryList:"/maintenanceReliability/relWarningMp/queryListByWarningId/",
        // 维修方案措施延期编辑确认
        mainSubmitUrl:"/maintenanceReliability/relWarningMp/editBatch",
        //    维修方案删除
        mainDelUrl:"/maintenanceReliability/relWarningMp/delete/",
//结论与建议措施措施表格查询技术通告单
        sugQueryList:"/maintenanceReliability/relWarningMeasures/queryListByWarningId/",
        // 结论与建议措施措施延期编辑确认
        sugSubmitUrl:"/maintenanceReliability/relWarningMeasures/edit",
        //    结论与建议措施删除
        sugDelUrl:"/maintenanceReliability/relWarningMeasures/delete/",
    },
    //技术通告单tab页地址
    TechnicalNotice:{
        // tabUrl:'maintenanceReliability/relTechInfoApi/queryList',

        submit:'/maintenanceReliability/relTechInfoApi/submit',

        detailBaseUrl:'/maintenanceReliability/relTechInfoApi/selectById',



// 故障列表
        topTabUrl:'/maintenanceReliability/relTechInfoApi/selectViewById',
     // 故障列表
        defectQueryUrl:'/maintenanceReliability/relTechDefRelatedApi/selectByTechId',
    //故障列表新增
        defectAddUrl:'/maintenanceReliability/relTechDefRelatedApi/add',
        //故障列表删除
        defectDeleteUrl:'/maintenanceReliability/relTechDefRelatedApi/delete',




        //详情组件form
        midQuery:'/maintenanceReliability/relTechAssessEwisApi/selectByTechId',
        midChange:'/maintenanceReliability/relTechAssessEwisApi/update',


    //    部件信息查询
        partsQueryUrl:'',


    //    相关文件列表查询
        partQueryList:"/maintenanceReliability/relTechDocApi/selectByTechId",
        // 相关文件措施延期编辑确认
        partSureEdit:"/maintenanceReliability/relTechDocApi/update",
        //    相关文件删除
        partDelUrl:"/maintenanceReliability/relTechDocApi/delete/",
        //    确认编辑或添加
        partSureAdd:"/maintenanceReliability/relTechDocApi/add",



        //维修方案措施表格查询
        mainQueryList:"/maintenanceReliability/relTechMpdApi/selectByTechId",
        // 维修方案措施延期编辑确认
        mainAddSubmitUrl:"/maintenanceReliability/relTechMpdApi/add",
        mainEditSubmitUrl:"/maintenanceReliability/relTechMpdApi/update",
        //    维修方案删除
        mainDelUrl:"/maintenanceReliability/relTechMpdApi/delete",
        //选择弹框列表接口




        //结论与建议措施措施表格查询
        sugQueryList:"/maintenanceReliability/relTechActionApi/selectByTechId",
        //    结论与建议措施删除
        sugDelUrl:"/maintenanceReliability/relTechActionApi/delete/",
        //    确认添加
        sugSureAdd:"/maintenanceReliability/relTechActionApi/add",
        // 结论与建议措施措施延期编辑确认
        sugSureUpdate:"/maintenanceReliability/relTechActionApi/update",




        //风险值表格查询
        riskQuery:"/maintenanceReliability/relTechRiskEwisApi/selectByTechId",
        //    风险值删除
        riskDelete:"/maintenanceReliability/relTechRiskEwisApi/delete/",
        //    确认添加
        riskAdd:"/maintenanceReliability/relTechRiskEwisApi/add",
        // 风险值编辑确认
        riskEdit:"/maintenanceReliability/relTechRiskEwisApi/update",





        //关联系统和环境特性表格查询
        assSysQueryList:"/maintenanceReliability/relTechSpeclEwisApi/selectByTechId",
        //    关联系统删除
        assSysDelUrl:"/maintenanceReliability/relTechSpeclEwisApi/delete",
        //    确认添加
        assSysSureAdd:"/maintenanceReliability/relTechSpeclEwisApi/add",
        // 关联系统编辑确认
        assSysSureUpdate:"/maintenanceReliability/relTechSpeclEwisApi/update",






        //技术评估
       // 修改
        midFormData:"/maintenanceReliability/relTechAssessEwisApi/selectByTechId",
        midFormUpdate:"/maintenanceReliability/relTechAssessEwisApi/update",


        //TMC评估
        // 修改
        tmcFormData:"/maintenanceReliability/relTechAssessEwisApi/selectByTechId",
        tmcFormUpdate:"/maintenanceReliability/relTechAssessEwisApi/update",
        noticeInfoQuery:"/maintenanceReliability/relTechScoreApi/selectByTechId",
    },
    //调查报告接口
    investigationReport:{
        addReport:'/maintenanceReliability/investigationBase/insert',


        detailInfo:'/maintenanceReliability/investigationBase/get',


// 故障、nrc、部件
        topTabUrl:'/maintenanceReliability/investigationRelationBusin/selectByParentId',
        // 故障列表
        topAddUrl:'/maintenanceReliability/investigationRelationBusin/insert',
        //故障列表删除
        topDeleteUrl:'/maintenanceReliability/investigationRelationBusin/delete',










        //    相关文件列表查询
        docQueryList:"/maintenanceReliability/investigationDoc/get",
        // 相关文件措施延期编辑确认
        docSureEdit:"/maintenanceReliability/investigationDoc/update",
        //    相关文件删除
        docDelUrl:"/maintenanceReliability/investigationDoc/delete",
        //    确认编辑或添加
        docSureAdd:"/maintenanceReliability/investigationDoc/insert",



        //维修方案措施表格查询
        mainQueryList:"/maintenanceReliability/investigationMp/get",
        // 维修方案措施延期编辑确认
        mainAddSubmitUrl:"/maintenanceReliability/investigationMp/insert",
        mainEditSubmitUrl:"/maintenanceReliability/investigationMp/update",
        //    维修方案删除
        mainDelUrl:"/maintenanceReliability/investigationMp/delete",


        //结论与建议措施措施表格查询
        sugQueryList:"/maintenanceReliability/investigationAction/get",
        //    结论与建议措施删除
        sugDelUrl:"/maintenanceReliability/investigationAction/delete",
        //    确认添加
        sugSureAdd:"/maintenanceReliability/investigationAction/insert",
        // 结论与建议措施措施延期编辑确认
        sugSureUpdate:"/maintenanceReliability/investigationAction/update",



    }

}
