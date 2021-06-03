/*
 * Copyright 2017 SF Airlines Co., Ltd. All rights reserved.
 * 本文件仅限于顺丰航空有限公司内部传阅，禁止外泄以及用于其他的商业目的。
 */

var sfaQueryCustomJs = {
	// 重要事件
	"CRI_SDR_SURVEY"    : basePath + "/js/cir/survey_list.js",	
	"CRI_SDR"           : basePath + "/js/cir/usehard_list.js",
	"CRI_INCIDENT"		: basePath + "/js/cir/event_list.js",
	"CIR_QUERY_FOD"		: basePath + "/js/cir/sfa-query-fod.js",
	// 飞机部件
	"COMP_IMPORT"		: basePath + "/js/component/sfa-query-compimpt.js",
	"COMP_IMPORT_SUB"	: basePath + "/js/component/sfa-query-compimpt.js",
	"COMP_APU"			: basePath + "/js/component/apu_setting.js",
	"COMP_CC"			: basePath + "/js/cc/sfa-query-cc.js",
	"COMP_PLAN"			: basePath + "/js/component/sfa-query-changplan.js",
	"COMP_MAINFEST"		: basePath + "/js/component/sfa-query-compmf.js",
	"COMP_MONITOR"		: basePath + "/js/component/monitor/sfa-query-comp-monitor.js",
	"COMP_IMPORT_OTHER"	: basePath + "/js/component/monitor/sfa-query-comp-import.js",
	"COMP_LOG"			: basePath + "/js/component/log_setting.js",
	"COMP_PNSN"			: basePath + "/js/component/comp/comp_pnsn_setting.js",
	"COMP_AMR"			: basePath + "/js/component/sfa-query-compmr.js",
	"COMP_REPAIR"		: basePath + "/js/component/repair_setting.js",
	"COMP_MRFILTER"		: basePath + "/js/component/sfa-query-comp-mrfilter.js",
	"COMP_LIFE"         : basePath + "/js/component/life/sfa-query-comp-life.js",
	"CONFIG_CHANGED_ITEMS" : basePath + "/js/component/config/sfa-config-changed-list.js",
	"CONFIG_CHANGED_COMP_LIST" :basePath + "/js/component/config/sfa-config-changed-comp-list.js",
	"ENG_BI_LIST": basePath + "/js/engine/bi/sfa-engine-list.js",

	"CS_SEARCH"			: basePath + "/js/cs/sfa-query-cs.js",
	"CS_ERROR_DATA"			: basePath + "/js/cs/sfa-query-cs-error-data-list.js",

	"DATA_WARNING"		: basePath + "/js/data/sfa-query-data-warning.js",

	"SOURCE_SEARCH"			: basePath + "/js/dwm/document/sfa-query-source.js",
	"SOURCE_COMPARE_SEARCH"			: basePath + "/js/dwm/sourceCompare/sfa-query-sourceCompare.js",
	"SOURCE_COMPARE_DETAIL"			: basePath + "/js/dwm/sourceCompare/sfa-query-sourceCompareDetail.js",
	"SOURCE_PERFORM_AC"		: basePath + "/js/dwm/document/sfa-query-perform-ac.js",
	"SOURCE_PERFORM_ENG"	: basePath + "/js/dwm/document/sfa-query-perform-eng.js",
	"SOURCE_AM_SEARCH"		: basePath + "/js/dwm/sourceAM/sfa-query-sourceAM.js",
	"SOURCE_SUPERSEDED_ERROR_SEARCH"		: basePath + "/js/dwm/document/sfa-query-source-superseded-error-list.js",
	"SOURCE_NO_EE_SEARCH"		: basePath + "/js/dwm/document/sfa-query-source-no-ee-list.js",

	"EE_SEARCH"			: basePath + "/js/ee/sfa-query-ee.js",
	"EE_NO_SOURCE_SEARCH"		: basePath + "/js/ee/sfa-query-ee-no-source-list.js",
	"EE_SUPERSEDED_RELATED_DOC"		: basePath + "/js/ee/sfa-query-ee-superseded-related-doc-list.js",
	"EE_REVIEW_TASK_LIST"		: basePath + "/js/ee/sfa-query-ee-review-task.js",
	"EvaluateTime"			: basePath + "/js/ee/evaluate_time_setting.js",
	"ER_QUERY_LOG"		: basePath + "/js/er/sfa-query-er.js",

	"FLB_FLIGHT_LOG"	: basePath + "/js/flb/sfa-query-flb.js",
	"FLIGHT_LOG"	: basePath + "/js/flb/sfa-query-flb.js",
	"FLB_VERIFY_RECORD"	: basePath + "/js/flb/sfa-query-flb-verify-record.js",
	"FLB_VERIFY_DETAIL"	: basePath + "/js/flb/sfa-query-flb-verify-detail.js",
	"FLB_LINE_JOB"	: basePath + "/js/flb/sfa-query-flb-linejob.js",
	// 飞机改装
	"MODIFICATION_PACKAGES"		: basePath + "/js/modification/sfa-query-modification.js",

	// 维修方案
	"SOURCE_DOCUMENT"   : basePath + "/js/mp/sfa-query-source-document.js",
	"SOURCE_DOCUMENT_ITEM"   : basePath + "/js/mp/sfa-query-source-document-item.js",
	"SFA_MP"			: basePath + "/js/mp/sfa-query-sfa-mp.js",
	"MP_REVISE"			: basePath + "/js/mp/sfa-query-mp-revise.js",
	"MPITEM_73C_SYSTEMS" : basePath + "/js/mp/sfa-query-mpitem-73c-systems.js",
	"MP_MANAGE_SYSTEM"   : basePath + "/js/mp/sfa-query-mp-manage-system.js",
	"MP_REVIEW"   : basePath + "/js/mp/sfa-query-mp-review.js",
	"MP_JC_TASK" : basePath + "/js/mp/sfa-query-mp-jc-task.js",
	
	// 维修资源
	"MRM_PRODUCE"       	: basePath + "/js/mrm/sfa_query_mrm_produce.js",
	"MRM_MRTR"  	     	: basePath + "/js/mrm/sfa-query-mrm-mrtr.js",

	// 人员排班
	"MRM_USER"				: basePath + "/js/mrm/sfa-query-mrm-user.js",
	"MRM_HOLIDAY"			: basePath + "/js/mrm/sfa-query-mrm-holiday.js",
	"SCHEDULE_PERSON"		: basePath + "/js/mrm/schedule_person_setting.js",
	"SCHEDULE_PERSON_SUB"	: basePath + "/js/mrm/schedule_sub_setting.js",
	"SCHEDULE_QUERY"		: basePath + "/js/mrm/schedule_query_setting.js",

	// 发动机等级
	"THRUST_RATING_QUERY"	: basePath + "/js/aircraft/sfa-query-aircraft-model.js",
	
	// 非例行工卡
	"NRC"					: basePath + "/js/nrc/sfa-query-nrc.js",

	// NRC & NRC TASK PPC 监控
	"NRC_CONTROL" : basePath + "/js/nrc/sfa-query-nrc-control.js",
	
	// NRC & NRC TASK MCC 监控
	"NRC_CONTROL_MONITOR_LIST" : basePath + "/js/nrc/sfa-query-nrc-mcc-monitor.js",

    //故障监控页面NRC
    "NRC_MONITOR": basePath + "/js/nrc/sfa-query-nrc-monitor.js",
	
	// 生产计划与控制
	"PPC_TASKNOTICE"		: basePath + "/js/production_plan/sfa-query-tasknotice.js",
	"PPC_TASKRECEIVE_LIST"	: basePath + "/js/ppc/sfa-query-ppctaskreceive_model.js",
	"PPC_DEVIATION"			: basePath + "/js/ppc/sfa-query-deviation.js",
	"PPC_DEFERRAL"			: basePath + "/js/ppc/sfa-query-deferral.js",
	"V_PC_PERIODCHECK"		: basePath + "/js/pcheck/pmChecklist.js",
	"PPC_PERIODC_AC_CONTROL" :  basePath + "/js/ppc/sfa-query-phicontrol.js",
	"PPC_CANCELED_WOITEMS_SEARCH" :  basePath + "/js/ppc/sfa-query-ppccanceledwoitems.js",
	"PPC_TASKHISTORY_LOG_SEARCH" :  basePath + "/js/ppc/sfa-query-ppctaskhistorylog.js",
	
	// 软件构型
	"SC_SOFTREGISTER"	: basePath + "/js/sc/sc_register_list2.js",
	"SC_SOFTONBOARD"	: basePath + "/js/sc/sc_onboard_list.js",

	"TB_QUERY_LOG"				: basePath + "/js/tb/sfa-query-tb.js",
	"TB_EFFECT_QUERY_LOG"		: basePath + "/js/tb/sfa-query-tb-effect.js",
    //工具设备
	"TE_BASEINFO"		: basePath + "/js/te/sfa_baseinfo_query.js",
	"TE_BASEINFO_QUERY"		: basePath + "/js/te/bill/base_select_list.js",
	"TE_STOCK_STATUS"	: basePath + "/js/te/sfa_stockstatus_query.js",
	"TE_STORAGE_INOUT"	: basePath + "/js/te/sfa_storageinout_query.js",
	"TE_LENDING_VIEW"	: basePath + "/js/te/sfa_lending_query.js",
	"TE_STORAGE_DETAIL"	: basePath + "/js/te/sfa_storageinout_detail_query.js",
	"TE_TE_REQUIRES"	: basePath + "/js/te/sfa_requires_query.js",
	"TE_MAINTENANCE_DETAIL"	: basePath + "/js/te/sfa_maintenance_query.js",

	"DEFECT_BASE_INFO"	: basePath + "/js/tlb/defect/defect_setting.js",
	"DEFECT_PEND_QUERY"	: basePath + "/js/tlb/defect/pend_setting.js",
	"DEFECT_WORK_LOG_INFO"	: basePath + "/js/tlb/defect/work_log_setting.js",
	"DEFECT_MONITOR"	: basePath + "/js/tlb/defect/defect_monitor_setting.js",
	"DEFECT_CONTROL"	: basePath + "/js/tlb/defect/defect_control.js",
	"TLB_TECH_LOG"		: basePath + "/js/tlb/sfa-query-tlb.js",
	"M_TLB_TECH_LOG"	: basePath + "/js/tlb/sfa-query-m-tlb.js",
	"TLB_DD"			: basePath + "/js/tlb/sfa-query-dd.js",
	"TLB_DDI"			: basePath + "/js/tlb/sfa-query-tlb-ddi.js",	
	"DEFECT_DDI"		: basePath + "/js/tlb/defect/sfa-query-defect-ddi.js",	
	"TLB_REPEATFAULTS"  : basePath + "/js/tlb/sfa-query-tlb-repeatfaults.js",
	"TLB_MULTIPLEFAULTS"  : basePath + "/js/tlb/sfa-query-tlb-multiplefaults.js",
	"TLB_FAULTSREMARK"  : basePath + "/js/tlb/sfa-query-tlb-faultsremark.js",
	
	"SUPPLIER_LIST"    : basePath + "/js/supplier/sfa-query-supplier-list.js",
	//MCC
	"TROUBLE_FOLLOW_UP"			: basePath + "/js/work/sfa-query-mcc-model.js",
	"WORK_TROUBLE"			: basePath + "/js/work/sfa-query-mcc-model.js",
	"TROUBLE_DETAIL_QUERY"			: basePath + "/js/work/sfa-query-mcc-model.js",
	"MCC_HANDOVER_FORM"			: basePath + "/js/work/sfa-query-mcc-model.js",
	"MCC_HANDOVER"			: basePath + "/js/work/sfa-query-mcc-model.js",
	"MCC_HANDOVER_DETAIL"			: basePath + "/js/work/sfa-query-mcc-model.js",	
	"MCC_NUMBER_RANGE"     : basePath + "/js/work/sfa-query-mcc-number-range.js",
	//TBM
	"TBM_STA_STATION"			: basePath + "/js/tbm/sfa-query-tbm-model.js",
	"TBM_AGREEMENT"			: basePath + "/js/tbm/sfa-query-tbm-model.js",
	"STATION_TASK_QUERY" : basePath + "/js/tbm/comm_query.js",
	"TBM_AFFAIRS_QUERY" : basePath + "/js/tbm/tbm_affair_colmodel.js",
	"TBM_AFFAIRS_HANDOVER" : basePath + "/js/tbm/tbm_affair_colmodel.js",
	"TBM_LINE_JOB" : basePath + "/js/tbm/sfa-query-tbm-line-job.js",

	"SUPPLIER_LIST"    : basePath + "/js/supplier/sfa-query-supplier-list.js",
	//出版者
	"DATA_PUBLISHER"    : basePath + "/js/data/sfa-query-publisher.js",
	
	"JC_LIST"          : basePath + "/js/jc/jc_list.js",
	
	//飞机构型
	"CM_DIFFERENCE"    : basePath + "/js/configuration/config_common.js",
	"CONFIG_COMP"    : basePath + "/js/configuration/config_common.js",
	"CONFIG_APPLIES" : basePath + "/js/configuration/config_common.js",
	
	//MCC Handover
	"MCC_ASSIGN_TASK" :  basePath + "/js/mcc/mcc_comm.js",

	"EO_LIST"          : basePath + "/js/eo/eo_list.js",
	"TECHNICAL_REPORT" : basePath + "/js/mcc/mcc_comm.js",
    
	"ME_SYSTEM_LOG"    : basePath + "/js/security/sfa-query-security-model.js",
	
	"MR_MAIN_MODEL" : basePath + "/js/mr/sfa-query-mr.js",
	
	"V_MRP_MAIN" : basePath + "/js/mr/sfa-query-mrp.js",
	
	"V_MRP_ITEM" : basePath + "/js/mr/sfa-query-mrpitem.js",
	"MR_ITEM_MODEL" : basePath + "/js/mr/sfa-query-mritem.js",
	
	"INVENTORY_BALANCE" : basePath + "/js/mr/sfa-query-inventory.js",
	
	"DELEGATION_LIST" : basePath + "/js/workflow/process/sfa-query-delegate.js",
	
	"CS_TAIL_SOURCE_SEARCH" : basePath + "/js/cs/sfa-query-cs-source.js",
	
	"CS_TAIL_SOURCE_REMOVE_SEARCH" : basePath + "/js/cs/sfa-query-cs-source-remove.js",
	
	"DELEGATION_LIST" : basePath + "/js/workflow/process/sfa-query-delegate.js",
	
	//TASK
	"TASK_INSTANCE"     : basePath + "/js/task/sfa-query-task-inst.js",
	"TASK_DEFINITION"     : basePath + "/js/task/sfa-query-task-def.js",
	
	//EXT
	"EXT_QUERY" : basePath + "/js/ext/sfa-query-ext-query.js",
	//3D
	"3D_VIEW" : basePath + "/js/sfa-query-3d.js",
	
	//Basic Data
	"BASICDATA_SERIAL" :  basePath + "/js/autokey/sfa-query-serial.js",
	//件号库列表
	"PN_REQUEST" : basePath + "/js/pnrequest/sfa-query-pnrequest.js",
	
	//TO
	"TO_LIST" : basePath + "/js/mccdoc/sfa_query_to.js",
	
	//工卡符合性日志翻转记录查询
	"CS_CHANGE_SEARCH" : basePath + "/js/ppc/cs/sfa-query-cs-change-log-list.js",
	//适航监控报表
	"SOURCE_DOCUMENT_MONITOR" :  basePath + "/js/ACdocument/source_document_monitor.js",
	"AIRCRAFT_STATUS_MONITOR" :  basePath + "/js/ACdocument/sfa-query-aircraft_status.js",
	"AIRCRAFT_COMPLIANCE_MONITOR" :  basePath + "/js/ACdocument/single_aircraft_compliance_monitor.js",
	"SOURCE_EXECUTE_MONITOR" :  basePath + "/js/ACdocument/source_document_execute_monitor.js",
	"DESK_GROUP_MODEL2" : basePath + "/js/data/group_definition_monitor_list.js?"
};
