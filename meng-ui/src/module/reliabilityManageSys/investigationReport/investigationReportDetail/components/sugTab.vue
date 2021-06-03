<template>
	<div>
		<div class="tab-title">*结论与建议措施：
			<el-button type="primary" @click="toAdd()">增加</el-button>
		</div>
		<local-grid :columnDefs="conSugMeasureColumn" :height="200" :rowData="tabData" ref="defectList"></local-grid>
		<el-dialog :title="'建议措施'+(showAlert==='edit'?'编辑':'新增')" :visible.sync="showDialog" width="30%" :before-close="handleClose">
			<el-form :model="formInfo" :rules="formInfoRule" ref="submitForm" label-width="100px">
				<el-form-item label="结论：" prop="conclusion">
					<el-input v-model="formInfo.conclusion" name="conclusion" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="建议措施：" prop="actionReason">
					<el-input type="textarea" name="actionReason" :rows="5" placeholder="请输入内容" v-model="formInfo.actionReason" resize="none">
					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showDialog = false">取 消</el-button>
				<el-button type="primary" @click="rowSubmit()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Vue from "vue";
import apiData from '../../../../../api/investigationReport/detailApi'
import mixin from './mixins/detailMixins'

export default {
	name: '',
    mixins:[mixin],
	data() {
		let _this = this
		return {
		    name:'结论与建议',
            apiJson:{
                getData:apiData.investigationReport.sugQueryList,
                delRow:apiData.investigationReport.sugDelUrl,
                add:apiData.investigationReport.sugSureAdd,
                edit:apiData.investigationReport.sugSureUpdate,
            },
			formInfo: {
                id:'',
				conclusion: '',
				actionReason: '',
			},
			formInfoRule: {
				conclusion: [{ required: true, message: '请输入结论', trigger: 'blur' }],
				actionReason: [{ required: true, message: '请输入措施原因', trigger: 'blur' }],
			},
			conSugMeasureColumn: [{
				headerName: '序号',
				field: "index",
				width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
				valueGetter: params => params.node.rowIndex + 1,

			},
			{
				headerName: '操作', field: "status", width: 80, cellRenderer: (params) => {
					//1,2不能操作
					//多发性重复性可操作控制archiveStatus1:已归档,2:失效不可编辑
					let rowOperate = Vue.extend({
						template: `<div style="display: flex; justify-content:space-around; height:28px; line-height:28px">
                              <i class="el-icon-edit" style="cursor:pointer; height:28px; line-height:28px" @click="editRow">&nbsp;&nbsp;&nbsp;</i>
                              <i class="el-icon-delete" style="cursor:pointer; height:28px; line-height:28px" @click="delRow">&nbsp;&nbsp;&nbsp;</i>
                        </div>`,
						methods: {
							editRow() {
								_this.editRow(params);
							},
							delRow() {
								_this.delRow(params);
							}
						}
					});
					let component = new rowOperate().$mount();
					return component.$el;
				}
			},
			{ headerName: '结论', field: "conclusion", width: 100, suppressFilter: true },
			{ headerName: '建议措施', field: "actionReason", width: 100, suppressFilter: true },
			]
		}
	},
}
</script>

<style scoped type="text/less" lang="less">
.tab-title {
    box-sizing: border-box;
	font-size: 12px;
	line-height: 30px;
	padding: 10px;
	width: 100%;
	overflow: hidden;

	/deep/ label {
		margin-left: 10px;
		margin-right: 15px;
	}

	> button {
		float: right;
		margin-right: 20px;
	}
}
</style>
