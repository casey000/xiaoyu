<template>
	<div>
		<h5 class="tab-title">*风险值评估：
			<el-button v-if="otherParams.method !== 'view'" type="primary" @click="toResolve('Add',{})">增加</el-button>
		</h5>
		<local-grid :columnDefs="conSugMeasureColumn" :height="200" :rowData="tabData" ref="defectList"></local-grid>
		<el-dialog :title="'风险值'+(showAlert==='Edit'?'编辑':'新增')" :visible.sync="showDialog" width="30%" :before-close="handleClose">
			<el-form :model="form" :rules="formRule" ref="conSugTab" label-width="160px">
<!--                下拉框三个-->
				<el-form-item label="EWIS缺陷对象：" prop="ewisSouce">
					<el-input v-model="form.ewisSouce" name="result" placeholder="请输入内容"></el-input>
				</el-form-item>
				<el-form-item label="缺陷导致后果严重性：" prop="consequenceScore">
                    <el-select v-model="form.consequenceScore" style="margin-top: -8px;width: 100%" placeholder="请选择">
                        <el-option name="approveResult" v-for="item in options" :key="item.val" :label="item.label" :value="item.val">
                        </el-option>
                    </el-select>
<!--					<el-input type="textarea" name="measures" :rows="5" placeholder="请输入内容" v-model="form.consequenceScore" resize="none">-->
<!--					</el-input>-->
				</el-form-item>
                <el-form-item label="缺陷导致后果可能性：" prop="probablyScore">
                    <el-select v-model="form.probablyScore" style="margin-top: -8px;width: 100%" placeholder="请选择">
                        <el-option name="approveResult" v-for="item in options1" :key="item.val" :label="item.label" :value="item.val">
                        </el-option>
                    </el-select>
<!--                    <el-input type="textarea" name="measures" :rows="5" placeholder="请输入内容" v-model="form.probablyScore" resize="none">-->
<!--                    </el-input>-->
                </el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showDialog = false">取 消</el-button>
				<el-button type="primary" @click="submit()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Vue from "vue";
import apiData from '../../../../../../api/investigationReport/detailApi'
import commonMinx from './commixin.js'

export default {
	name: '',
	props: {
		otherParams: Object,
	},
    mixins:[commonMinx],
	data() {
		let _this = this
		return {
            apiData:apiData.TechnicalNotice,
            pageCode:'risk',
            title:'风险值评估',
			showAlert: false,
			showDialog: false,
			tabData: [],
			form: {
                ewisSouce: '',
                consequenceScore: '',
                probablyScore: '',
			},
            options:[{
                label:'不严重',
                val:'1'
            },{
                label:'严重',
                val:'2'
            },{
                label:'很严重',
                val:'3'
            }],
            options1:[{
                label:'极小的可能',
                val:'1'
            },{
                label:'一般可能',
                val:'2'
            },{
                label:'极大可能',
                val:'3'
            }],
			formRule: {
                ewisSouce: [{ required: true, message: '请输入结论', trigger: 'blur' }],
                consequenceScore: [{ required: true, message: '请输入延期原因', trigger: 'blur' }],
                probablyScore: [{ required: true, message: '请输入延期原因', trigger: 'blur' }],
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
                              <i class="el-icon-edit" style="cursor:pointer; height:28px; line-height:28px" @click="editOneLine">&nbsp;&nbsp;&nbsp;</i>
                              <i class="el-icon-delete" style="cursor:pointer; height:28px; line-height:28px" @click="deleteRow">&nbsp;&nbsp;&nbsp;</i>
                        </div>`,
						methods: {
							editOneLine() {
								_this.toResolve('Edit',params.data);
							},
							deleteRow() {
								_this.delete(params.data);
							}
						}
					});
					let component = new rowOperate().$mount();
					return component.$el;
				}
			},
			{ headerName: 'EWIS缺陷对象', field: "ewisSouce", width: 100, },
			{ headerName: '缺陷导致后果严重性（关联系统分析结果）', field: "consequenceScore", width: 150, cellRenderer: (params) =>{
                    let arr = ['','不严重','严重','很严重'];
                    return arr[params.value]
                }
            },
                { headerName: '缺陷导致后果可能性（工作环境及特性分析结果）', field: "probablyScore", width: 180, cellRenderer: (params) =>{
                        let arr = ['','极小的可能','一般可能','极大可能'];
                        return arr[params.value]
                    }
                },
                { headerName: '风险值', field: "ewisSouce", width: 100, cellRenderer:(param)=>{
                    return param.data.consequenceScore*param.data.probablyScore
                    }
                },

            ]
		}
	},
	mounted() {
		this.query(this.otherParams.id);
        this.otherParams.method === 'view'&&this.conSugMeasureColumn.splice(1,1)
	},
	methods: {
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {
				});
		},
		//*风险值操作
        toResolve(code,param) {
			this.showAlert = code;
			this.showDialog = true
			this.form = {
                ewisSouce: param.ewisSouce||'',
                consequenceScore: param.consequenceScore||'',
                probablyScore: param.probablyScore||'',
			};
			if(code==='Edit')this.form.id = param.id
		},
		//确认编辑或添加
		submit() {
			this.$refs.conSugTab.validate((valid) => {
				if (valid) {
				    this.addOrUpdate()
				} else {
					console.log('error submit!!');
					return false;
				}
			})
		},
	},
	components: {}
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
