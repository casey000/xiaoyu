<!-- 可靠性故障列表 公共性列表页面-->

<template>
	<div class="common-tab-list"
         :class="[{'invest-style':item.content==='ReliabilityAlarmList',
         'has-childTab':childColumnDefs&&childColumnDefs.length>0}]">
        <div v-if="hasTopSearch" :item="item" :is="item.content + 'Top'"></div>
		<div class="main-tab">
            <!--:actUrl="api[item.content].tabUrl"渲染数据  -->
            <base-Agrid class="ag-theme-balham asms-single-action-button-grid"
                        :columnDefs="columnDefs" :params="queryParam"
                        :actUrl="api[item.content].tabUrl" :noFloatingFilter="true"
                        :notShowOkCancel="true" @="getChild"
                        :multiSelect="childColumnDefs&&childColumnDefs.length>0"
                        :postType="postType"
                        :enableServerSideFilter="true" :ref="item.content">
            </base-Agrid>
        </div>
		<div v-if="childColumnDefs&&childColumnDefs.length>0" class="bot-child">
            <local-grid :columnDefs="childColumnDefs" :height="300" :rowData="rowInfo"></local-grid>
        </div>
        <div class="right-click-menu" v-if="hasMenu" @mouseleave="showMenu=false" :style="{'top':menuPosition.top+'px',
             'left':menuPosition.left+'px'}" v-show="showMenu">
             <!-- 右键菜单显示的部分：is -->
			<div :is="item.content+'Menu'" ref="menu" :defectData="defectData"
                 :assessmentColumn="assessmentColumn"
                 :item="item"
                 @toDetail="toDetail"
                 :extensionAlertColumn="extensionAlertColumn"></div>
<!--            <div v-for="(item,index) in resolveList" @click="resolveRow(item)" :key="index">{{item}}</div>-->
		</div>

    </div>
</template>

<script>
import mixins from './mixins'

export default {
	name: "tabListPage",
	components: {
		"base-Agrid": function (resolve) {
			return require(["../agGrid/baseAgGrid.vue"], resolve);
		},
        // 右键菜单
        ReliabilityAlarmListMenu:function(resolve){
            return require(["../reliabilityManageSys/investigationReport/itemMenu/ReliabilityAlarmListMenu.vue"], resolve);
        },
        investigationReportMenu:function(resolve){
            return require(["../reliabilityManageSys/investigationReport/itemMenu/investigationReportMenu.vue"], resolve);
        },
        TechnicalNoticeMenu:function(resolve){
            return require(["../reliabilityManageSys/investigationReport/itemMenu/TechnicalNoticeMenu.vue"], resolve);
        },
        //列表头部
        partReplaceRateOutTop:function(resolve){
            return require(["../reliabilityManageSys/reliabilityAnalysis/topContent/commonTop.vue"], resolve);
        },
        earlyWarningMechanismTop:function(resolve){
            return require(["../reliabilityManageSys/reliabilityAnalysis/topContent/commonTop.vue"], resolve);
        },
        fourBitATAFailureRateOverrunTop:function(resolve){
            return require(["../reliabilityManageSys/reliabilityAnalysis/topContent/commonTop.vue"], resolve);
        },
        investigationReportTop:function(resolve){
            return require(["../reliabilityManageSys/investigationReport/topContent/investigationReportTop.vue"], resolve);
        },
        issuseMessageTop:function(resolve){
            return require(["../../module/reliabilityManageSys/meetingManage/issuseMessege/issuseMessageTop"],resolve);
        }
	},
    mixins:[mixins],
};
</script>
<style scoped type="text/less" lang="less">
    .has-childTab{
        > .main-tab{
            /*flex: 1;*/
            min-height: 200px;
            max-height: calc(~'100% - 400px')!important;
        }
    }
.common-tab-list {
	display: flex;
	flex-direction: column;
    /*overflow: hidden;*/
	/deep/.dialog-index {
		z-index: 2004;
		padding-top: 0;
		.el-row {
			line-height: 32px;
			font-size: 14px;
			.el-form-item {
				margin-bottom: 10px;
				.el-form-item__label {
					width: 100px;
					font-size: 14px;
					/*line-height: 40px;*/
					text-align: right;
				}
				span {
					font-size: 14px;
				}
			}
		}
	}
    >.top-btn{
        padding: 10px 20px;
        margin-bottom: -10px;
        text-align: right;
    }
    > .main-tab{
        height: 100%;
        /*max-height: calc(~'100% - 400px');*/
    }

	> .bot-child {
		height: 400px;
	}

	.right-click-menu {
		position: fixed;
		border-radius: 4px;
		margin-left: -60px;
		margin-top: -2px;
		width: 121px;
		background: #fff;
		box-shadow: 0px 0px 4px rgba(217, 217, 217, 0.988235294117647);
		border: 1px solid rgba(217, 217, 217, 1);
		overflow: hidden;
	}
}

.invest-style {
	/deep/.ag-cell-value {
		width: 100% !important;
		height: 100% !important;
		> div {
			padding: 0 11px;
            width: 100%;
            height: 100%;
		}
	}
	/deep/.ag-cell-not-inline-editing {
		padding: 0 !important;
	}
}
</style>
