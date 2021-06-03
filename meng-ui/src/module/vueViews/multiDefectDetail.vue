<!-- 可靠性故障详情 -->
<template>
	<div class="multiple-defeect-info" style="background: #fff">
		<h4>多发性故障查看</h4>
		<el-form ref="nrcBaseInfo" label-width="140px" :model="defectInfo">
			<el-row>
				<el-col :span="6">
					<el-form-item label="编号：">
						{{baseInfo.faultNo}}
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="版本号：">
						{{baseInfo.revNo}}

					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="机型：">
						{{baseInfo.model}}
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="ATA：">
						{{baseInfo.ata}}
					</el-form-item>
				</el-col>

			</el-row>
			<el-row>
				<el-col :span="6">
					<el-form-item label="创建时间：">
						{{baseInfo.createTime | dateFormat("yyyy-MM-dd hh:mm:ss")}}
					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="Found Date（Min）：">
						{{baseInfo.foundDateMin | dateFormat("yyyy-MM-dd hh:mm:ss")}}

					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="Found Date（Max）：">
						{{baseInfo.foundDateMax | dateFormat("yyyy-MM-dd hh:mm:ss")}}

					</el-form-item>
				</el-col>
				<el-col :span="6">
					<el-form-item label="技术通告单：">
						{{baseInfo.noticeNo}}
					</el-form-item>
				</el-col>

			</el-row>

			<h5>Add Defect：</h5>
			<local-grid :columnDefs="columnDefs1" :height="200" :rowData="addDefectList" ref="addDefectList"></local-grid>

			<h5>Defect：</h5>
			<local-grid :columnDefs="columnDefs2" :height="200" :rowData="defectList" ref="defectList"></local-grid>

			<h5>Deleted Defect：</h5>

			<local-grid :columnDefs="delcolumnDefs" :height="200" :rowData="deleteDefectList" ref="deleteDefectList"></local-grid>

			<el-row style="margin-top: 10px">
				<el-col :span="12">
					<el-form-item label="是否多发性故障：">
						<el-radio-group v-model="defectInfo.isOr">
							<el-radio label="1">是</el-radio>
							<el-radio label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12">
					<el-form-item label="提交技术通告单评估：">
						<el-radio-group v-model="defectInfo.ss">
							<el-radio label="1">是</el-radio>
							<el-radio label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="20">
					<el-form-item label="备注：" prop="reason">
						<el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="defectInfo.reason" resize="none">
						</el-input>
					</el-form-item>
				</el-col>
			</el-row>

		</el-form>

	</div>
</template>

<script>
import Vue from "vue";
import { formatDate } from '../../common/js/util/date.js'


export default {
	name: "reliableDetail",
	components: {
		"base-Agrid": function (resolve) {
			return require(["../agGrid/baseAgGrid.vue"], resolve);
		},
	},

	props: {
		otherParams: Object,
	},


	data() {
		return {
			defectInfo: {
				isOr: ''
			},
			baseInfo: {},
			addDefectList: [],
			defectList: [],
			deleteDefectList: [],
			columnDefs1: [],
			columnDefs2: [],
			oprateColumnDefs1: [
				{
					headerName: '索引',
					field: "index",
					width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
					valueGetter: params => params.node.rowIndex + 1,

				},
				{ headerName: '操作', field: 'operator', width: 60, cellRenderer: this.oprateCellRenderer1 },
				{ headerName: '编号', field: "faultNo", width: 110, suppressFilter: true, cellRenderer: this.mulNoOprateCell },
				{ headerName: '飞机号', field: "acReg", width: 110, suppressFilter: true, },
				{ headerName: '日期', field: "dateFound", width: 110, suppressFilter: true, valueFormatter: this.dateFormatter },
				{ headerName: '故障描述', field: "faultReportChn", width: 110, suppressFilter: true, },
				{ headerName: 'Taken Action', field: "faultReportEng", width: 110, suppressFilter: true, },
			],
			oprateColumnDefs2: [
				{
					headerName: '索引',
					field: "index",
					width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
					valueGetter: params => params.node.rowIndex + 1,

				},
				{ headerName: '操作', field: 'operator', width: 60, cellRenderer: this.oprateCellRenderer2 },
				{ headerName: '编号', field: "faultNo", width: 110, suppressFilter: true, cellRenderer: this.mulNoOprateCell },
				{ headerName: '飞机号', field: "acReg", width: 110, suppressFilter: true, },
				{ headerName: '日期', field: "dateFound", width: 110, suppressFilter: true, valueFormatter: this.dateFormatter },
				{ headerName: '故障描述', field: "faultReportChn", width: 110, suppressFilter: true, },
				{ headerName: 'Taken Action', field: "faultReportEng", width: 110, suppressFilter: true, },
			],
			delcolumnDefs: [
				{
					headerName: '索引',
					field: "index",
					width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
					valueGetter: params => params.node.rowIndex + 1,

				},
				{ headerName: '编号', field: "faultNo", width: 110, suppressFilter: true, cellRenderer: this.mulNoOprateCell },
				{ headerName: '飞机号', field: "acReg", width: 110, suppressFilter: true, },
				{ headerName: '日期', field: "dateFound", width: 110, suppressFilter: true, valueFormatter: this.dateFormatter },
				{ headerName: '故障描述', field: "faultReportChn", width: 110, suppressFilter: true, },
				{ headerName: 'Taken Action', field: "faultReportEng", width: 110, suppressFilter: true, },
			]
		};
	},

	computed: {},

	watch: {},

	created() {
		this.queryBaseInfo(this.otherParams.id);
		console.log(this.otherParams)


	},

	mounted() {
		(this.otherParams.method === 'view') && (this.columnDefs1 = this.columnDefs2 = this.delcolumnDefs);
		if (this.otherParams.method === 'edit') {
			this.columnDefs1 = this.oprateColumnDefs1;
			this.columnDefs2 = this.oprateColumnDefs2;
		}
	},

	destroyed() { },

	methods: {

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
			console.log(params)
		},
		queryBaseInfo(id) {
			let url = "/maintenanceDefect/defectRepetitiveMultipleApi/toView/" + id;
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.baseInfo = response.obj.repetitiveMultiple;
				this.addDefectList = response.obj.addDefectList;
				this.defectList = response.obj.defectList;
				console.log(this.defectList)
				this.deleteDefectList = response.obj.deleteDefectList;
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			})
				.catch(err => {
					this.$message.error(err.msg ? err.msg : err);
				});
		},
		dateFormatter(obj) {
			return formatDate(obj.value, "yyyy-MM-dd hh:mm:ss");

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
}
</style>
