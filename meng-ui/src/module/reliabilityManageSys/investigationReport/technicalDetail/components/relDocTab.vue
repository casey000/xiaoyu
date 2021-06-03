<template>
	<div>
		<div class="tab-title">相关文件：部件或系统故障是否有相关AD、SB、SL、FTD等信息：
			是<el-radio v-model="radio" label="Y">&nbsp;</el-radio>
			否<el-radio v-model="radio" label="N">&nbsp;</el-radio>
			<el-button type="primary" @click="toAdd()" :disabled="radio!=='Y'">增加</el-button>
		</div>
		<local-grid :columnDefs="conDicMeasureColumn" :height="200" :rowData="tabData" ref="defectList"></local-grid>
		<el-dialog :title="'相关文件'+(showAlert==='edit'?'编辑':'新增')" :visible.sync="showDialog" width="30%" :before-close="handleClose">
			<el-form :model="formInfo" :rules="formInfoRule" ref="submitForm" label-width="100px">
				<el-row>
					<el-form-item label="文件类型：" prop="type">
						<el-select v-model="formInfo.docType" placeholder="请选择">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="文件编号：" prop="fileNo">
						<el-input name="docNo" :rows="5" placeholder="请输入内容" v-model="formInfo.docNo" resize="none">
						</el-input>
					</el-form-item>
				</el-row>
				<el-row>
					<el-form-item label="标题：" prop="title">
						<el-input name="title" :rows="5" placeholder="请输入内容" v-model="formInfo.title" resize="none">
						</el-input>
					</el-form-item>
				</el-row>
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
		let vm = this
		return {
		    name:'相关文件',
            apiJson:{
                getData:apiData.TechnicalNotice.partQueryList,
                rowSubmit:apiData.TechnicalNotice.partSubmitUrl,
                delRow:apiData.TechnicalNotice.partDelUrl,
                add:apiData.TechnicalNotice.partSureAdd,
                edit:apiData.TechnicalNotice.partSureEdit ,
            },
			radio: '',
			options: [{
				value: 'AD',
				label: 'AD'
			}, {
				value: 'SB',
				label: 'SB'
			}, {
				value: 'SL',
				label: 'SL'
			}, {
				value: 'FTD',
				label: 'FTD'
			}],
			formInfo: {
                id:'',
                docType: '',
                docNo: '',
				title: '',
			},
			formInfoRule: {
                docType: [{ required: true, message: '请选择文件类型', trigger: 'blur' }],
                docNo: [{ required: true, message: '请输入文件编号', trigger: 'blur' }],
				title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
			},
			conDicMeasureColumn: [
                {
                    headerName: '序号',
                    field: "index",
                    width: 30, suppressSorting: true, suppressResize: true, suppressFilter: false,
                    valueGetter: params => params.node.rowIndex + 1,

                },{
					headerName: '操作', field: "status", width: 30, suppressFilter: true, cellRenderer: (params) => {
						//1,2不能操作
						//多发性重复性可操作控制archiveStatus1:已归档,2:失效不可编辑
						let rowOperate = Vue.extend({
							template: `<div style="display: flex; justify-content:space-around; height:28px; line-height:28px">
                              <i class="el-icon-edit" style="cursor:pointer; height:28px; line-height:28px" @click="editRow">&nbsp;&nbsp;&nbsp;</i>
                              <i class="el-icon-delete" style="cursor:pointer; height:28px; line-height:28px" @click="deleteRow">&nbsp;&nbsp;&nbsp;</i>
                        </div>`,
							methods: {
                                editRow() {
									vm.editRow(params);
								},
								deleteRow() {
									vm.delRow(params);
								}
							}
						});
						let component = new rowOperate().$mount();
						return component.$el;
					}
				},
				{ headerName: '类型', field: "docType", width: 100, suppressFilter: true },
				{ headerName: '文件编号', field: "docNo", width: 100, suppressFilter: true },
				{ headerName: '标题', field: "title", width: 160, suppressFilter: true },
			]
		}
	},
    watch:{
	    radio:{
            handler: function (val) {
                this.$emit('getRadio','ifRelationFile',val)
            },
            deep: true
        },
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
