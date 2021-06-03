<!-- 可靠性故障详情 -->
<template>
	<div class="multiple-defect-info" style="background: #fff">
		<h4>{{title}}故障{{statusTitle}}</h4>
		<!-- ：mode绑定渲染的数据 prop属性需要 在topDetailList定义了 -->
		<el-form ref="nrcBaseInfo" label-width="140px" :model="defectInfo">
			<el-row v-for="(item,index) in topDetailList" :key="index">
				<el-col :span="it.wid" v-for="(it,num) in item" :key="num">
					<el-form-item :label="it.name">
						<span v-if="it.isType">{{typeIntro[baseInfo[it.prop]]}}</span>
						<span v-else-if="it.isTime">{{baseInfo[it.prop] | dateFormat("yyyy-MM-dd hh:mm:ss")}}</span>
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
				<el-input v-show="false" name="id" v-model="otherParams.id"></el-input>
				<el-input v-show="false" name="deleteDefectIdList" v-model="postArr.toString()"></el-input>
				<el-row style="margin-top: 10px">
					<el-col :span="12">
						<el-form-item label="是否发起评估：" prop="warning">
							<el-radio-group v-model="defectInfo.warning">
								<el-radio label="Y" name="warning" :disabled="otherParams.method === 'view'||this.baseInfo.status === 'REVIEWING'">是</el-radio>
								<el-radio label="N" name="warning" :disabled="otherParams.method === 'view'||this.baseInfo.status === 'REVIEWING'">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row style="margin-top: 5px">
					<el-col :span="20">
						<el-form-item label="备注：" prop="remark">
							<el-input type="textarea" name="remark" :rows="5" :disabled="otherParams.method === 'view'||this.baseInfo.status === 'REVIEWING'" placeholder="请输入内容" v-model="defectInfo.remark" resize="none">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="this.baseInfo.status === 'REVIEWING'" style="margin-top: 10px">
					<el-col :span="12">
						<el-form-item label="审批结果：" prop="approveResult">
							<el-select v-model="defectInfo.approveResult" :disabled="otherParams.method === 'view'" style="margin-top: -8px" placeholder="请选择">
								<el-option name="approveResult" v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-if="this.baseInfo.status === 'REVIEWING'" style="margin-top: 5px">
					<el-col :span="20">
						<el-form-item label="审批意见：" prop="approveOpinion">
							<el-input type="textarea" name="approveOpinion" :rows="5" :disabled="otherParams.method === 'view'" placeholder="请输入内容" v-model="defectInfo.approveOpinion" resize="none">
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<div v-if="otherParams.method !== 'view'&&!isReadyDo" class="bot-btn" style="text-align: center">
					<el-button @click="submit(otherParams.content+'Detail')">提交</el-button>
					<el-button @click="$emit('close',title+'故障'+(otherParams.method !== 'view'?'确认':'查看'))">取消</el-button>
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
	},
	data() {
		let checkRemark = (rule, value, callback) => {
			if (!value && this.defectInfo.warning === 'N') {
				return callback(new Error('是否发起评估为否时，备注不可为空'));
			} else {
				callback()
			}
		}
		return {
            apiData:apiData,
			options: [{
				value: 'Y',
				label: '通过'
			}, {
				value: 'N',
				label: '驳回'
			}],
			topDetailList: [
				[{ wid: 8, prop: 'packageNo', name: '编号：', isTime: false }
					, { wid: 8, prop: 'ver', name: '版本号：', isTime: false }
					, { wid: 8, prop: 'createTm', name: '创建时间：', isTime: true }],
				[{ wid: 8, prop: 'foundDateMin', name: 'Found Date（Min）：', isTime: true }
					, { wid: 8, prop: 'foundDateMax', name: 'Found Date（Max）：', isTime: true }
					, { wid: 8, prop: 'noticeNo', name: '技术通告单：', isTime: false }],
				[{ wid: 8, prop: 'reason', name: '触发原因：', isTime: false,isType:true }]
			],
            typeIntro: {
                "ABLATION-PN":"烧蚀",
				"ABLATION-LINE":"烧蚀",
				"FUELTANK-PN":"燃油箱",
				"FUELTANK-LINE":"燃油箱",
				"LINE":"同部件一年内出现两次及以上EWIS",
                "PN":"同部件一年内出现两次及以上EWIS",
				"ONTOLOGY":"同本体件一年内漏油三次及以上",
                "CHANGE":"同件号更换管路两次及以上",
                "REPAIR":"同件号修复管路两次及以上",
            },
			isReadyDo: false,
			defectInfo: {
				warning: '',
				remark: '',
				approveOpinion: '',
				approveResult: ''
			},
			title: '',
			rules: {
				warning: [{ required: true, message: '请选择是否发起评估', trigger: 'blur' }],
				remark: [{ validator: checkRemark, trigger: 'blur' }]
			},
			baseInfo: {},
			addDefectList: [],
			defectList: [],
			deleteDefectList: [],
			columnDefs1: [],
			columnDefs2: [],
			isEditColumnDefs: { headerName: '操作', field: 'operator', width: 60, cellRenderer: this.oprateCellRenderer1 },
			delColumnDefs: [
				{
					headerName: '索引',
					field: "index",
					width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
					valueGetter: params => params.node.rowIndex + 1,

				},
				{ headerName: '类型', field: 'businessType', width: 60, suppressFilter: true, },
				{ headerName: '编号', field: "businessNo", width: 110, suppressFilter: true, cellRenderer: this.mulNoOprateCell },
				{ headerName: '机型', field: "model", width: 110, suppressFilter: true, },
				{ headerName: '飞机号', field: "aircraft", width: 110, suppressFilter: true, },
				{ headerName: 'ATA', field: "ata", width: 110, suppressFilter: true, },
				{ headerName: '时间', field: "foundDate", width: 110, suppressFilter: true, valueFormatter: this.dateFormatter },
				{ headerName: 'TLB编号', field: "tlbNo", width: 110, suppressFilter: true, },
				{ headerName: '部件类型', field: "componentType", width: 110, suppressFilter: true, },
				{ headerName: '故障类型', field: "ewisType", width: 110, suppressFilter: true, valueFormatter: this.typeShow },
				{ headerName: '描述（中文）', field: "description", width: 110, suppressFilter: true, },
			],
		}
	},

	computed: {
		postArr() {
			return this.deleteDefectList.map(item => item.id)
		},
        statusTitle(){
		    if(this.otherParams.method !== 'view'){
		        return this.baseInfo.status === 'REVIEWING'?'审核':'确认'
            }else{
		        return '查看'
            }
        }
	},

	watch: {},

	created() {
		this.title = this.otherParams.content === 'ewisDefectList' ? 'ewis' : '油量渗漏'
		this.queryBaseInfo(this.otherParams.id);
		this.isReadyDo = this.otherParams.isReadyDo
	},

	mounted() {
		(this.otherParams.method === 'view') && (this.columnDefs1 = this.columnDefs2 = this.delColumnDefs);
		if (this.otherParams.method === 'edit') {
			let arr = this.cloneArr(this.delColumnDefs)
			let arr1 = this.cloneArr(this.delColumnDefs)
			arr.splice(1, 0, { headerName: '操作', field: 'operator', width: 60, cellRenderer: this.oprateCellRenderer1 });
			this.columnDefs1 = arr;
			arr1.splice(1, 0, { headerName: '操作', field: 'operator', width: 60, cellRenderer: this.oprateCellRenderer2 });
			this.columnDefs2 = arr1;
		}
	},

	destroyed() { },

	methods: {
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
			let url = this.apiData[this.otherParams.content].baseInfoUrl + id
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.baseInfo = response.obj.ewisOilPackageDTO;
				this.addDefectList = response.obj.add;
				this.defectList = response.obj.relation;
				// console.log(this.defectList)
				this.deleteDefectList = response.obj.delete;
				this.defectInfo.remark = this.baseInfo.remark;
				this.defectInfo.approveResult = this.baseInfo.approveResult;
				this.defectInfo.approveOpinion = this.baseInfo.approveOpinion;
				this.defectInfo.warning = this.baseInfo.warning || '';
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			})
				.catch(err => {
					this.$message.error(err.errorMessage || err.msg || err);
				});
		},
		dateFormatter(obj) {
			return formatDate(obj.value, "yyyy-MM-dd hh:mm:ss");
		},
		typeShow(obj) {
			let arr = ['磨损/破损', '割伤/划伤', '污染/腐蚀', '部件丢失', '松动', '烧蚀', '功能障碍/损坏', '其它缺陷', '断裂/断丝', '非标准施工']
			return arr[obj.value * 1]
		},
		submit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					let str = this.apiData[this.otherParams.content].submit
					let url = str + (this.baseInfo.verifyResult === 'N' ? 'submit' : 'approve');
					let arr = this.deleteDefectList.map(item => item.id)
					let postData = {
						"id": this.otherParams.id,
						warning: this.defectInfo.warning,
						remark: this.defectInfo.remark,
						deleteIdList: arr.toString()
					}
					if (this.baseInfo.verifyResult === 'N') {
						postData.approveOpinion = this.defectInfo.approveOpinion
						postData.approveResult = this.defectInfo.approveResult
					}
					this.$httpExt().post(url, postData, "gateway").then(response => {
						//成功提示
						this.$message.success('Ewis故障' + (this.baseInfo.isVerify === '1' ? '确认' : '提交') + '成功');
						//刷新列表
						this.bus.$emit(this.otherParams.content, true);
						//关闭当前tab页
						this.$emit('close', 'Ewis故障' + (this.otherParams.method !== 'view' ? '确认' : '查看'))
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
.multiple-defect-info {
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
