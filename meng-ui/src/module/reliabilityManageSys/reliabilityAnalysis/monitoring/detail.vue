<!-- 可靠性故障详情 -->
<template>
	<div class="multiple-defeect-info" style="background: #fff">
		<h4 style="text-align: center">{{title}}告警{{isAlarmAudit==='Y' ? '审核' : '确认'}}</h4>
		<el-form ref="nrcBaseInfo" label-width="140px" :model="defectInfo">
			<el-row v-for="(item,index) in topDetailList" :key="index">
				<el-col :span="it.wid" v-for="(it,num) in item" :key="num">
					<el-form-item :label="it.name">
						<span v-if="it.isTime">{{baseInfo[it.prop] | dateFormat("yyyy-MM-dd hh:mm:ss")}}</span>
						<span v-else>{{baseInfo[it.prop]}}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<h5>故障信息：</h5>
			<local-grid :columnDefs="columnDefs" :height="200" :rowData="tabData" ref="addDefectList"></local-grid>

			<el-form :model="defectInfo" id="mform" name="mform" :ref="otherParams.content+'Detail'" :rules="rules" label-width="150px">
				<el-input v-show="false" name="id" v-model="otherParams.id"></el-input>
				<!--				<el-input v-show="false" name="deleteDefectIdList" v-model="postArr.toString()"></el-input>-->
				<el-row style="margin-top: 10px">
					<el-col :span="12">
						<el-form-item :label="isAlarmAudit==='Y' ?'审批结果：':'是否是真告警：'" prop="warning">
							<el-radio-group v-model="defectInfo.ifAlarm">
								<el-radio label="Y" name="ifAlarm" :disabled="otherParams.method === 'view'">是</el-radio>
								<el-radio label="N" name="ifAlarm" :disabled="otherParams.method === 'view'">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-input v-show="false" name="remark" v-model="otherParams.remark"></el-input>
				<el-row style="margin-top: 5px" v-if=" isAlarmAudit==='N'">
					<el-col :span="20">
						<el-form-item label="备注：" prop="remark">
							<el-input type="textarea" name="remark" :rows="5" :disabled="otherParams.method === 'view'" placeholder="请输入内容" v-model="defectInfo.remark" resize="none">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-top: 5px" v-else>
					<el-col :span="20">
						<el-form-item label="审核意见：" prop="opinion">
							<el-input type="textarea" name="opinion" :rows="5" :disabled="otherParams.method === 'view'" placeholder="请输入内容" v-model="defectInfo.opinion" resize="none">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div v-if="otherParams.method !== 'view'&&!isReadyDo" class="bot-btn" style="text-align: center">
					<el-button @click="submit(otherParams.content+'Detail')">{{ isAlarmAudit ==='N'?'提交':'审核'}}</el-button>
					<el-button @click="$emit('close',title+(otherParams.method !== 'view'?'确认':'查看'))">取消</el-button>
				</div>
			</el-form>
		</el-form>
	</div>
</template>

<script>
import Vue from "vue";
import { formatDate } from '../../../../common/js/util/date.js'
import mainInfo from './mainInfo'
import apiData from '../../../../api/reliabilityAnalysis/detailApi'


export default {
	name: "reliableDetail",
	components: {
		"base-Agrid": function (resolve) {
			return require(["../../../agGrid/baseAgGrid.vue"], resolve);
		},
	},

	props: {
		otherParams: Object,
	},
	data() {
		let checkRemark = (rule, value, callback) => {
			if (!value && this.defectInfo.ifAlarm === 'N') {
				return callback(new Error('是否是真告警为否时，备注不可为空'));
			} else {
				callback()
			}
		}
		let checkOpinion = (rule, value, callback) => {
			if (!value && this.defectInfo.ifAlarm === 'N') {
				return callback(new Error('审批结果：为否时，审批意见不可为空'));
			} else {
				callback()
			}
		}
		let pageInfo = mainInfo(this)
		return {
            apiData:apiData,
			tabData: [],
			detailList: [],
			isReadyDo: false,
			defectInfo: {
				id: '',
				ifAlarm: '',
				opinion: '',
				remark: '',
			},
			title: '',
			rules: {
				ifAlarm: [{ required: true, message: '请选择是否发起评估', trigger: 'change' }],
				opinion: [{ validator: checkOpinion, trigger: 'change' }],
				remark: [{ validator: checkRemark, trigger: 'change' }]
			},
			baseInfo: {},
			columnDefs: [],
			columnDefsData1: mainInfo(this).columnDefsData1,
			columnDefsData2: mainInfo(this).columnDefsData2,
			titleJson: mainInfo(this).titleJson,
			isAlarmAudit: ''
		}
	},
	watch: {},
	created() {
		this.title = this.titleJson[this.otherParams.content]
		this.queryBaseInfo(this.otherParams.id);
		this.queryTab(this.otherParams.id);
		this.getIsAlarmAudit(this.otherParams.id);
		this.isReadyDo = this.otherParams.isReadyDo;
		this.columnDefs = this.otherParams.content === 'partReplaceRateOut' ? this.columnDefsData1 : this.columnDefsData2;
		this.topDetailList = mainInfo(this).detailList[this.otherParams.content]
	},
	mounted() {
	},
	destroyed() { },
	methods: {
		//查主信息
		getIsAlarmAudit(id) {
			let url = this.apiData[this.otherParams.content].ifAuditAlarm + id;
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.isAlarmAudit = response.obj
			}).catch(err => {
				this.$message.error(err.errorMessage || err.msg || err);
			});
		},
		//查主信息
		queryBaseInfo(id) {
			let url = this.apiData[this.otherParams.content].baseInfoUrl + id;
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.baseInfo = response.obj
			})
				.catch(err => {
					this.$message.error(err.errorMessage || err.msg || err);
				});
		},
		//查表格信息
		queryTab(id) {
			let url = this.apiData[this.otherParams.content].queryPartDetailList
			url = this.otherParams.content === 'partReplaceRateOut' ? url : '/maintenanceReliability/relAlarm/queryAtaPreDetailList/'
			this.$httpExt().get(url + id, undefined, 'gateway').then(response => {
				this.tabData = response.obj
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			})
				.catch(err => {
					this.$message.error(err.errorMessage || err.msg || err);
				});

		},

		submit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let url = this.apiData[this.otherParams.content].submit + (this.isAlarmAudit === 'Y' ? 'auditAlarm' : 'editIsAlarm')
					let postData = {
						"id": this.otherParams.id,
						ifAlarm: this.defectInfo.ifAlarm,
						opinion: this.defectInfo.opinion,
						remark: this.defectInfo.remark,
					}
					if (this.baseInfo.verifyResult === 'N') {
						postData.approveOpinion = this.defectInfo.approveOpinion
						postData.approveResult = this.defectInfo.approveResult
					}
					this.$httpExt().post(url, postData, "gateway").then(response => {
						//成功提示
						this.$message.success(this.title + (this.isAlarmAudit === 'Y' ? '审核' : '提交') + '成功');
						//刷新列表
						this.bus.$emit(this.otherParams.content, true);
						//关闭当前tab页
						this.$emit('close', this.title + '确认')
					})
						.catch(err => {
							this.bus.$emit(this.otherParams.content, true);
							this.$message.error(err.errorMessage || err.msg || err);
						});
				} else {
					return false;
				}
			});
		}
	}
};
</script>
<style  scoped lang="less">
.multiple-defeect-info {
    height:100%;
    overflow-y: auto;
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
