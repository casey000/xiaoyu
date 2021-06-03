<template>
	<div>
		<h5 class="tab-title">{{type===1?'关联系统评估：':'环境特性评估：'}}
			<el-button v-if="otherParams.method !== 'view'" type="primary" @click="toAdd()">增加</el-button>
		</h5>
		<local-grid :columnDefs="conSugMeasureColumn" :height="200" :rowData="conSugMeasureData" ref="defectList"></local-grid>
		<el-dialog :title="'管理系统'+(showSug==='edit'?'编辑':'新增')" :visible.sync="showDialog" width="30%" :before-close="handleClose">
			<el-form :model="form" :rules="formRule" ref="conSugTab" label-width="160px">
				<el-form-item :label="type===1?'关联系统：':'工作环境/工作负载特性：'" prop="speclType">
<!--					<el-input style="width: 250px" v-model="form.score" name="score" placeholder="请输入内容"></el-input>-->
                    <el-select v-model="form.speclType" style="margin-top: -8px;width: 250px" placeholder="请选择">
                        <el-option name="approveResult" v-for="item in options" :key="item.val" :label="item.label" :value="item.val">
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item label="参考值：" prop="score">
                    <el-radio-group v-model="form.score">
                        <el-radio :label="0">{{type===1?'次要关联':'极小的可能'}}</el-radio>
                        <el-radio :label="1">{{type===1?'一般关联':'一般可能'}}</el-radio>
                        <el-radio :label="2">{{type===1?'重要关联':'极大可能'}}</el-radio>
                    </el-radio-group>
<!--					<el-input type="textarea" name="speclType" :rows="5" placeholder="请输入内容" v-model="form.speclType" resize="none">-->
<!--					</el-input>-->
				</el-form-item>
<!--                <el-form-item label="参考值：" prop="docNo">-->
<!--                    <el-input type="textarea" name="measures" :rows="5" placeholder="请输入内容" v-model="form.docNo" resize="none">-->
<!--                    </el-input>-->
<!--                </el-form-item>-->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showDialog = false">取 消</el-button>
				<el-button type="primary" @click="updateSubmit()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Vue from "vue";
import apiData from '../../../../../../api/investigationReport/detailApi'

export default {
	name: '',
	props: {
		otherParams: Object,
        type:Number
	},
	data() {
		let _this = this
		return {
            apiData:apiData.TechnicalNotice,
			showSug: false,
			showDialog: false,
			conSugMeasureData: [],
			form: {
                speclType: '',
                score: '',
			},
			formRule: {
                speclType: [{ required: true, message: '请输入结论', trigger: 'blur' }],
                score: [{ required: true, message: '请输入延期原因', trigger: 'blur' }],
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
                              <i class="el-icon-delete" style="cursor:pointer; height:28px; line-height:28px" @click="deleteRow">&nbsp;&nbsp;&nbsp;</i>
                        </div>`,
						methods: {
							deleteRow() {
								_this.deleteRow(params);
							}
						}
					});
					let component = new rowOperate().$mount();
					return component.$el;
				}
			},
			{ headerName: '关联系统', field: "speclType", width: 100, suppressFilter: true ,cellRenderer: (params) =>{
                    let arr = _this.type*1===1?_this.relSysList:_this.envList
                    return arr[params.value*1]
                }
            },
			{ headerName: '参考值（1-次要关联 2-一般关联 3-重要关联）', field: "score", width: 200, suppressFilter: true ,cellRenderer: (params) =>{
                    let arr = _this.type*1===1?['次要关联','一般关联','重要关联']:['极小的可能','一般可能','极大可能']
                    return arr[params.value*1]

                }},
			],
            relSysList:['发动机系统','起落架系统','飞控系统',
                '液压系统','空调增压系统','电源系统','燃油系统','导航系统','火警系统'],
            envList:['高振动区域(2级以上)',
                '高温区域（C,D 以上）','易燃物渗漏区域','高湿度区域','EWIS 部件高密度区域',
                '空气暴露区域','维修活动频繁区域','AWL相关导线','大电流导线','EMC导线'],
		}
	},
    computed:{
	  options() {
	      let arr = this.type*1===1?this.relSysList:this.envList
          return arr.map((item,key)=>{
              return{label:item,val:key+''}
          })
      }
    },
    beforeMount(){
        if(this.type*1!==1){
            this.conSugMeasureColumn[2].headerName = '工作环境/工作负载特性'
            this.conSugMeasureColumn[3].headerName = '参考值（1-不符合 2-一般符合 3-高度符合）'
        }
    },
	mounted() {
		this.getData(this.otherParams.id);
        this.otherParams.method === 'view'&&this.conSugMeasureColumn.splice(1,1)
    },
	methods: {
		toAdd() {
			this.showSug = 'add'
			this.showDialog = true
			this.form = {
                speclType: '',
                score: '',
			}
		},
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {
				});
		},
		//关联系统表格查询
		getData(id) {
			let url = this.apiData.assSysQueryList+'?type='+this.type+'&techId=' + id
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.conSugMeasureData = response.obj
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			})
				.catch(err => {
					this.$message.error(err.errorMessage || err.msg || err);
				});
		},
		// 关联系统延期编辑确认
		dirRowSubmit() {
			this.$refs.conSugTab.validate((valid) => {
				if (valid) {
					let url = this.apiData.assSysSureAdd
					this.$httpExt().post(this.apiData.assSysSureAdd, {
						...this.form,
                        type:this.type,
						techId: this.otherParams.id
					}, 'gateway').then(response => {
						this.showDialog = false
						this.getData(this.otherParams.id)
						// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
					})
						.catch(err => {
							this.showDialog = false
							this.$message.error(err.errorMessage || err.msg || err);
						});
				} else {
					console.log('error submit!!');
					return false;
				}
			})
		},
		//*关联系统编辑
		editDetail(param) {
			this.showSug = 'edit';
			this.showDialog = true
			this.form = {
                speclType: '',
                score: '',
                id:param.data.id
			}
		},
		//*关联系统删除
		deleteRow(param) {
			this.$confirm('确认删除此行', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(() => {
				this.$httpExt().post(this.apiData.assSysDelUrl+'?id=' + param.data.id, {}, 'gateway').then(res => {
					this.$message({
						type: 'success',
						message: '关联系统删除成功!'
					});
					this.getData(this.otherParams.id)
				}).catch(err => {
					this.$message.error(err.errorMessage || err.msg || err);
				})

			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		//确认编辑或添加
		updateSubmit() {
		    if(this.showSug!=='edit') return this.dirRowSubmit()
			this.$refs.conSugTab.validate((valid) => {
				if (valid) {
					let url = this.apiData.assSysSureUpdate
					this.$httpExt().post(url, {
						...this.form,
                        type:this.type,
                        techId: this.otherParams.id
					}, 'gateway').then(response => {
						this.showDialog = false
						this.getData(this.otherParams.id)

						// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
					}).catch(err => {
						this.showDialog = false
						this.$message.error(err.errorMessage || err.msg || err);
					});
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
