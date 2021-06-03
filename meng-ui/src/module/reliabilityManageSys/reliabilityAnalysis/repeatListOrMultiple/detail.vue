<!-- 可靠性故障详情 -->
<template>
	<div class="multiple-defeect-info" style="background: #fff">
		<h4 style="margin-top: 0;padding-top: 10px">{{title}}故障{{otherParams.method !== 'view'?(baseInfo.isVerify * 1==1?'审核':'确认'):'查看'}}</h4>
		<el-form label-width="140px" :model="defectInfo">
			<el-row v-for="(item,index) in topDetailList" :key="index">
				<el-col :span="it.wid" v-for="(it,num) in item" :key="num">
					<el-form-item :label="it.name">
						<span v-if="it.isTime">{{baseInfo[it.prop] | dateFormat("yyyy-MM-dd hh:mm:ss")}}</span>
						<span v-else>{{baseInfo[it.prop]}}</span>
					</el-form-item>
				</el-col>
			</el-row>
			<h5>Add Defect：</h5>
			<local-grid :columnDefs="columnDefs1" :height="200" :rowData="addDefectList" ref="addDefectList"></local-grid>
			<h5>Defect：</h5>
			<local-grid :columnDefs="columnDefs2" :height="200" :rowData="defectList" ref="defectList"></local-grid>
			<h5>Deleted Defect：</h5>
			<local-grid :columnDefs="delColumnDefs" :height="200" :rowData="deleteDefectList" ref="deleteDefectList"></local-grid>
			<el-form :model="defectInfo" id="mform" name="mform" :ref="otherParams.content+'Detail'" :rules="rules" label-width="150px">
				<el-input v-show="false" name="deleteDefectIdList" v-model="postArr.toString()"></el-input>
                <el-input v-show="false" name="isNotice" v-model="defectInfo.isNotice"></el-input>
                <el-form-item name="repetitiveMultiple">
					<el-input v-show="false" name="id" v-model="otherParams.id"></el-input>
                    <el-input v-if="defectInfo.verifyResult!=='y'||otherParams.method === 'view'||baseInfo.auditStatus ==='0'" v-show="false" name="isNotice" v-model="defectInfo.isNotice"></el-input>
					<el-row style="margin-top: 10px">
						<el-col :span="12">
							<el-form-item :label="'是否'+title+'故障：'" prop="verifyResult">
								<el-radio-group v-model="defectInfo.verifyResult" @change="changeIsNotice(defectInfo.verifyResult,otherParams.content+'Detail')">
									<el-radio :disabled="otherParams.method === 'view'||baseInfo.auditStatus ==='0'" name="verifyResult" label="y">是</el-radio>
									<el-radio :disabled="otherParams.method === 'view'||baseInfo.auditStatus ==='0'" name="verifyResult" label="n">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="提交技术通告单评估：" prop="isNotice">
								<el-radio-group v-model="defectInfo.isNotice">
									<el-radio label="y" name="isNotice" :disabled="defectInfo.verifyResult!=='y'||otherParams.method === 'view'||baseInfo.auditStatus ==='0'">是</el-radio>
									<el-radio label="n" name="isNotice" :disabled="defectInfo.verifyResult!=='y'||otherParams.method === 'view'||baseInfo.auditStatus ==='0'">否</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row style="margin-top: 5px">
						<el-col :span="20">
							<el-form-item label="备注：" prop="remark">
								<el-input type="textarea" name="remark" :disabled="otherParams.method === 'view'||baseInfo.auditStatus ==='0'" :rows="5" placeholder="请输入内容" v-model="defectInfo.remark" resize="none">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-if="baseInfo.auditStatus==='0'" style="margin-top: 10px">
						<el-col :span="12">
							<el-form-item label="审批结果：" prop="auditStatus">
								<el-select v-model="defectInfo.auditStatus" style="margin-top: -8px" placeholder="请选择">
									<el-option v-for="item in options" :key="item.value" :label="item.label" :disabled="item.disabled||otherParams.method === 'view'" :value="item.value">
									</el-option>
								</el-select>
								<el-input v-show="false" v-model="defectInfo.auditStatus" name="auditStatus"></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row v-if="baseInfo.auditStatus==='0'" style="margin-top: 5px">
						<el-col :span="20">
							<el-form-item label="审批意见：" prop="reason">
								<el-input type="textarea" name="reason" :rows="5" placeholder="请输入内容" v-model="defectInfo.reason" :disabled="otherParams.method === 'view'" resize="none">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form-item>
				<div v-if="otherParams.method !== 'view'&&!isReadyDo" class="bot-btn" style="text-align: center">
					<el-form-item>
						<el-button @click="submit(otherParams.content+'Detail')">提交</el-button>
						<el-button @click="$emit('close',title+'故障'+(otherParams.method !== 'view'?'确认':'查看'))">取消</el-button>
					</el-form-item>
				</div>
			</el-form>
		</el-form>
	</div>
</template>

<script>
import Vue from "vue";
import { formatDate } from '../../../../common/js/util/date.js'
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
		item: Object,
	},
	data() {
		let checkRemark = (rule, value, callback) => {
			if (!value && this.defectInfo.verifyResult === 'n') {
				return callback(new Error(this.title + '故障为否时，备注不可为空'));
			} else {
				callback()
			}
		}
		return {
            apiData:apiData,
			defectInfo: {
				verifyResult: '',
				isNotice: '',
				remark: ''
			},
			topDetailList: [[
				{ wid: 6, prop: 'faultNo', name: '编号：', isTime: false },
				{ wid: 6, prop: 'revNo', name: '版本号：', isTime: false },
				{ wid: 6, prop: 'model', name: '机型：', isTime: false },
				{ wid: 6, prop: 'ata', name: 'ATA：', isTime: false },
			], [
				{ wid: 6, prop: 'createTime', name: '创建时间：', isTime: true },
				{ wid: 6, prop: 'foundDateMin', name: 'Found Date（Min）：', isTime: true },
				{ wid: 6, prop: 'foundDateMax', name: 'Found Date（Max）：', isTime: true },
				{ wid: 6, prop: 'noticeNo', name: '技术通告单：', isTime: false },]],
			options: [{
				value: '1',
				label: '通过'
			}, {
				value: '2',
				label: '不通过'
			}],
			title: '',
			isReadyDo: false,
			baseInfo: {},
			addDefectList: [],
			defectList: [],
			deleteDefectList: [],
			columnDefs1: [],
			columnDefs2: [],
			delColumnDefs: [
				{
					headerName: '索引',
					field: "index",
					width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
					valueGetter: params => params.node.rowIndex + 1,

				},
				{ headerName: '编号', field: "defectNo", width: 110, suppressFilter: true, cellRenderer: this.mulNoOprateCell },
				{ headerName: '飞机号', field: "acReg", width: 110, suppressFilter: true, },
				{ headerName: '日期', field: "dateFound", width: 110, suppressFilter: true, valueFormatter: this.dateFormatter },
				{ headerName: '故障描述', field: "faultReportChn", width: 110, suppressFilter: true, },
				{ headerName: 'Taken Action', field: "faultReportEng", width: 110, suppressFilter: true, },
			],
			rules: {
				verifyResult: [{ required: true, message: '请选择是否多发性故障', trigger: 'change' }],
				isNotice: [{ required: true, message: '请选择是否提交技术通告单评估', trigger: 'change' }],
				auditStatus: [{ required: true, message: '请选择审批结果', trigger: 'change' }],
				reason: [{ required: true, message: '请输入审批意见', trigger: 'change' }],
				remark: [{ validator: checkRemark, trigger: 'change' }]
			}
		};
	},
	computed: {
		postArr() {
			return this.deleteDefectList.map(item => item.id)
		}
	},
	watch: {},
	created() {
		this.queryBaseInfo(this.otherParams.id);
		this.isReadyDo = this.otherParams.isReadyDo
		this.title = this.otherParams.content === 'repeatDefectList' ? '重复性' : '多发性'
		// console.log(this.otherParams)
	},
	mounted() {
		(this.otherParams.method === 'view' || this.isReadyDo) && (this.columnDefs1 = this.columnDefs2 = this.delColumnDefs);
	},
	destroyed() {
		// this.bus.$off(this.item.content)
	},
	methods: {
		changeIsNotice(result, formName) {
			if (result === 'y') {
				this.defectInfo.isNotice = ''
			} else {
				this.defectInfo.isNotice = 'n'
			}
			this.$refs[formName].validate();
		},
		cloneArr(arr) {
			let list = [];
			for (let i in arr) {
				list.push(arr[i])
			}
			return list
		},
		oprateCellRenderer1(parms) {
			let _this = this;
			let rowOperate = Vue.extend({
				template: '<div style="display: flex; justify-content:space-around; height:28px; line-height:28px"> <i class="el-icon-delete" style="cursor:pointer; height:28px; line-height:28px" @click="delOneLine($event)">&nbsp;&nbsp;&nbsp;</i></div>',
				methods: {
					delOneLine(e) {
						_this.deleteOne(parms);
						var cc = _this.addDefectList.splice(parms.rowIndex, 1)
						_this.deleteDefectList.push(cc[0])
					}
				}
			});
			let component = new rowOperate().$mount();
			return component.$el;
		},
		oprateCellRenderer2(parms) {
			let _this = this;
			let rowOperate = Vue.extend({
				template: '<div style="display: flex; justify-content:space-around; height:28px; line-height:28px"> <i class="el-icon-delete" style="cursor:pointer; height:28px; line-height:28px" @click="delOneLine($event)">&nbsp;&nbsp;&nbsp;</i></div>',
				methods: {
					delOneLine(e) {
						_this.deleteOne(parms);
						var cc = _this.defectList.splice(parms.rowIndex, 1);
						_this.deleteDefectList.push(cc[0])
					}
				}
			});
			let component = new rowOperate().$mount();
			return component.$el;
		},
		deleteOne(params) {
			// console.log(params)
		},
		queryBaseInfo(id) {
			let url = this.apiData[this.otherParams.content].baseInfoUrl + id;
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.baseInfo = response.obj.repetitiveMultiple;
				this.addDefectList = response.obj.addDefectList;
				this.defectList = response.obj.defectList;
				this.defectInfo.isNotice = this.baseInfo.isNotice || '';
				this.defectInfo.remark = this.baseInfo.remark || this.defectInfo.remark;
				this.defectInfo.verifyResult = this.baseInfo.verifyResult || '';
				// console.log(this.defectList)
				this.deleteDefectList = response.obj.deleteDefectList;
                if (this.otherParams.method === 'edit' && this.baseInfo.auditStatus !== '0') {
                    let arr = this.cloneArr(this.delColumnDefs)
                    let arr1 = this.cloneArr(this.delColumnDefs)
                    arr.splice(1, 0, { headerName: '操作', field: 'operator', width: 60, cellRenderer: this.oprateCellRenderer1 });
                    this.columnDefs1 = arr;
                    arr1.splice(1, 0, { headerName: '操作', field: 'operator', width: 60, cellRenderer: this.oprateCellRenderer2 });
                    this.columnDefs2 = arr1;
                    // console.log(this.columnDefs1)
                }
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			}).catch(err => {
				this.$message.error(err.errorMessage || err.msg || err);
			});
		},
		dateFormatter(obj) {
			return formatDate(obj.value, "yyyy-MM-dd hh:mm:ss");
		},
		submit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let str = this.apiData[this.otherParams.content].submit;
					let url = str + (this.baseInfo.isVerify * 1 !== 1 ? 'editIsVerify' : 'editVerifyResult');
					let arr = this.deleteDefectList.map(item => item.id)
					this.$httpExt().post(url, {
						id: this.otherParams.id,
						verifyResult: this.defectInfo.verifyResult,
						remark: this.defectInfo.remark,
						isNotice: this.defectInfo.isNotice,
						deleteDefectIdList: arr.toString()
					}, "gateway").then(response => {
						this.$message.success(this.title + '故障' + (this.baseInfo.isVerify === '1' ? '确认' : '提交') + '成功');
						this.bus.$emit(this.otherParams.content, true);
						this.$emit('close', this.title + '故障' + (this.otherParams.method !== 'view' ? '确认' : '查看'))
					}).catch(err => {
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
}
</style>
