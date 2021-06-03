<!-- 可靠性故障详情 -->
<template>
	<div class="multiple-defeect-info" style="background: #fff">
		<h4 style="text-align: center">告警条目{{this.baseInfo.alarmNo}}已失效,是否失效报警单</h4>
		<el-form ref="warningInvalidForm" label-width="140px" :model="warningInvalidInfo">
			<el-row v-for="(item,index) in topDetailList" :key="index">
				<el-col :span="it.wid" v-for="(it,num) in item" :key="num">
					<el-form-item :label="it.name">
						<span v-if="it.isTime">{{baseInfo[it.prop] | dateFormat("yyyy-MM-dd hh:mm:ss")}}</span>
						<span v-else>{{baseInfo[it.prop]}}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<local-grid :columnDefs="columnDefs" :height="200" :rowData="tabData" ref="addDefectList"></local-grid>
			<el-form :model="warningInvalidInfo" id="mform" name="mform" :ref="otherParams.content+'Detail'" :rules="rules" label-width="150px">
				<el-input v-show="false" name="id" v-model="otherParams.id"></el-input>
				<el-row style="margin-top: 10px">
					<el-col :span="12">
						<el-form-item :label="'是否失效'+baseInfo.warningNo+'报警单：'" prop="warning">
							<el-radio-group v-model="warningInvalidInfo.opinion">
								<el-radio label="Y" name="opinion" :disabled="otherParams.method === 'view'">是</el-radio>
								<el-radio label="N" name="opinion" :disabled="otherParams.method === 'view'">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-top: 5px" >
					<el-col :span="20">
						<el-form-item label="审核意见：" prop="remark">
							<el-input type="textarea" name="remark" :rows="5" :disabled="otherParams.method === 'view'" placeholder="请输入内容" v-model="warningInvalidInfo.remark" resize="none">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div class="bot-btn" style="text-align: center">
					<el-button type="primary" @click="submit()">确认</el-button>
				</div>
			</el-form>
		</el-form>
	</div>
</template>

<script>
import mainInfo from './mainInfo';
import Vue from "vue";


export default {
	name: "reliableInvalidDetail",
	components: {
		"base-Agrid": function (resolve) {
			return require(["../../../agGrid/baseAgGrid.vue"], resolve);
		},
	},

	props: {
		otherParams: Object,
	},
	data() {
		let pageInfo = mainInfo(this)
		return {
			tabData: [],
			detailList: [],
			warningInvalidInfo: {
				id: '',
				opinion: '',
				remark: '',
			},
			title: '',
			rules: {
                warning: [{ required: true, message: '请选择是否失效报警单', trigger: 'blur' }],
			},
			baseInfo: {},
			columnDefs: [],
			columnDefsData1: mainInfo(this).columnDefsData1,
			columnDefsData2: mainInfo(this).columnDefsData2,
			titleJson: mainInfo(this).titleJson,
            isAlarmAudit:''
		}
	},
	watch: {},
	created() {
		this.title = this.titleJson[this.otherParams.content]
		this.queryBaseInfo(this.otherParams.id);
		this.queryTab(this.otherParams.id);
		this.columnDefs = this.otherParams.content === 'partReplaceRateOut' ? this.columnDefsData1 : this.columnDefsData2;
		this.topDetailList = mainInfo(this).detailList[this.otherParams.content]
	},
	mounted() {
	},
	destroyed() { },
	methods: {
        //查主信息
        queryBaseInfo(id) {
            let url = '/maintenanceReliability/relAlarm/findById/' + id;
            this.$httpExt().get(url, undefined, 'gateway').then(response => {
                this.baseInfo = response.obj
            }).catch(err => {
                this.$message.error(err.errorMessage || err.msg || err);
            });
        },
		//查表格信息
		queryTab(id) {
			// 部件：/maintenanceReliability/relAlarm/queryPartDetailList/{alarmId}
			//    另外两：/maintenanceReliability/relAlarm/queryAtaPreDetailList/{alarmId}
			let url = '/maintenanceReliability/relAlarm/queryPartDetailList/'
			url = this.otherParams.content === 'partReplaceRateOut' ? url : '/maintenanceReliability/relAlarm/queryAtaPreDetailList/'
            this.$httpExt().get(url + id, undefined, 'gateway').then(response => {
                this.tabData = response.obj
                // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
            }).catch(err => {
                this.$message.error(err.errorMessage || err.msg || err);
            });

		},
        submit(){
            this.$refs.warningInvalidForm.validate((valid) => {
                if (valid) {
                    this.warningInvalidInfo["id"] = this.otherParams.id;
                    this.$httpExt().post('/maintenanceReliability/relWarningBase/invalidSubmit', this.warningInvalidInfo, 'gateway').then(response => {
                        //刷新列表
                        this.bus.$emit(this.otherParams.content, true);
                        //关闭当前tab页
                        this.$emit('close', this.title + '确认')
                    }).catch(err => {
                        this.$message.error(err.errorMessage || err.msg || err);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
	}
};
</script>
<style  scoped lang="less">
.multiple-defeect-info {
	h4 {
		padding-left: 10px;
	}
	h5 {
		padding-left: 10px;
	}
	.el-form-item {
		margin-bottom: 15px;
	}
	.bot-btn {
		text-align: center;
	}
}
</style>
