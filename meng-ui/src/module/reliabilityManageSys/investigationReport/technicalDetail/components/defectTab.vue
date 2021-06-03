<template>
	<div>
		<h5 class="tab-title">故障信息
			<el-button v-if="otherParams.method !== 'view'" type="primary" @click="showDialog=true">增加</el-button>
		</h5>
		<local-grid :columnDefs="tabColumn" :height="200" :rowData="tabData" ref="defectList"></local-grid>
		<el-dialog title="故障信息新增" :visible.sync="showDialog" width="60%" :before-close="handleClose">
			<div style="height: 300px">
				<base-Agrid class="ag-theme-balham asms-single-action-button-grid" :columnDefs="alertTabColumn" :params="[]" actUrl="/maintenanceDefect/defectBaseInfoViewApi/queryList" :noFloatingFilter="true" :notShowOkCancel="true" ref="reldefectTab" :enableServerSideFilter="true">
				</base-Agrid>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showDialog = false">取 消</el-button>
				<el-button type="primary" @click="defectRowSubmit()">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import Vue from "vue";
import apiData from '../../../../../api/investigationReport/detailApi'

export default {
	name: '',
	components: {
		"base-Agrid": function (resolve) {
			return require(["../../../../agGrid/baseAgGrid.vue"], resolve);
		},
	},
	props: {
		otherParams: Object,
	},
	data() {
		let vm = this
		return {
            apiData:apiData.TechnicalNotice,
			radio: '',
			rowId: '',
			alertTabColumn: [
                {
                    headerName: '',//选择列头部显示的文字，可以为空
                    checkboxSelection: true,//设置为ture显示为复选框
                    headerCheckboxSelection: true, //表头是否也显示复选框，全选反选用
                    sortable: false,
                    suppressFilter: false,
                    width: 80 //列的宽度
                },
                { headerName: '故障号', field: "defectNo", width: 100, suppressFilter: true },
                { headerName: '机型', field: "model", width: 100, suppressFilter: true },
                { headerName: '飞机号', field: "aircraft", width: 100, suppressFilter: true },
                { headerName: '章节号', field: "ata", width: 100, suppressFilter: true },
                {
                    headerName: '发现时间',
                    field: "creatTime",
                    width: 140, suppressSorting: true, suppressResize: true, suppressFilter: false,
                    valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss"),

                },
                { headerName: 'ACTION', field: "dateAction", width: 100, suppressFilter: true },
                { headerName: '可靠性类别', field: "type", width: 100, suppressFilter: true },
                { headerName: '故障描述', field: "description", width: 100, suppressFilter: true },
            ],
			showdefect: false,
			showDialog: false,
			tabData: [],
            tabColumn: [
                {
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
                                    vm.delete(params);
                                }
                            }
                        });
                        let component = new rowOperate().$mount();
                        return component.$el;
                    }
                },
                { headerName: '故障号', field: "defectNo", width: 100, suppressFilter: true },
                { headerName: 'Latest Defect No', field: "model", width: 100, suppressFilter: true },
                {
                    headerName: '发现时间',
                    field: "creatTime",
                    width: 140, suppressSorting: true, suppressResize: true, suppressFilter: false,
                    valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss"),

                },
                { headerName: '飞机号', field: "aircraft", width: 100, suppressFilter: true },
                { headerName: '航站', field: "ata", width: 100, suppressFilter: true },
                { headerName: '故障描述', field: "description", width: 100, suppressFilter: true },
                { headerName: 'ACTION', field: "dateAction", width: 100, suppressFilter: true },
                { headerName: '关联NRC', field: "type", width: 100, suppressFilter: true },
            ],
		}
	},
	mounted() {
		this.defectGetData(this.otherParams.id);
		if(this.otherParams.method === 'view')this.tabColumn.splice(1,1)
	},
	methods: {
		toAdd() {
			this.showdefect = 'add'
			this.showDialog = true
			this.$nextTick(() => this.$refs.reldefectTab.reloadData())
		},
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {
				});
		},
        freshData(data){
            this.tabData = data
        },
		//故障信息措施表格查询
		defectGetData(id) {
			this.$emit('fresh',id)
		},
		// 故障信息新增确认
		defectRowSubmit() {
			let ids = this.$refs.reldefectTab.getSelect().map(item => item.evalNo)
			if (ids.length === 0) return this.$message.error('请先选择方案')
			let url = this.apiData.defectAddUrl
			this.$httpExt().post(url, {
                defectId: ids.join(','),
                techId: this.otherParams.id
			}, 'gateway').then(response => {
				// this.tabData = response.obj
                    this.$message.success('故障新增成功');
				this.showDialog = false
				this.defectGetData(this.otherParams.id)
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			})
				.catch(err => {
					this.showDialog = false
					this.$message.error(err.errorMessage || err.msg || err);
				});
		},
		//*故障信息措施编辑
		// defectEditDetail(param) {
		//     this.showdefect = 'edit';
		//     this.showDialog = true
		//     this.$nextTick(()=>this.$refs.reldefectTab.reloadData())
		//     this.condefectTabData = {
		//         id: param.data.id,
		//         warningId: param.data.warningId,
		//         result: param.data.result,
		//         measures: param.data.measures,
		//     }
		// },
		//*故障信息删除
		deleteDefectRow(param) {
			this.$confirm('确认删除此行', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(() => {
				this.$httpExt().get(this.apiData.defectDeleteUrl, {
				    defectId:param.data.defectId,
                    techId:this.otherParam.id
                }, 'gateway').then(res => {
					this.defectGetData(this.otherParams.id)
					this.$message({
						type: 'success',
						message: '故障信息措施删除成功!'
					});
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
	}
}
</script>

<style scoped type="text/less" lang="less">
.tab-title {
	/*font-size: 12px;*/
    box-sizing: border-box;
	line-height: 30px;
	padding: 10px;
    margin: 0;
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
