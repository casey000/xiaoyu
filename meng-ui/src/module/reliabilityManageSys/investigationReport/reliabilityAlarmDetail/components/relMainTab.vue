<template>
	<div>
		<div class="tab-title">相关维修方案：部件在维修方案中是否有检查项目：
			是<el-radio v-model="radio" label="Y" :disabled="otherParams.method === 'view'">&nbsp;</el-radio>
			否<el-radio v-model="radio" label="N" :disabled="otherParams.method === 'view'">&nbsp;</el-radio>
			<el-button v-if="otherParams.method !== 'view'" type="primary" @click="showDialog=true" :disabled="radio!=='Y'">增加</el-button>
		</div>
		<local-grid :columnDefs="conMainMeasureColumn" :height="200" :rowData="conMainMeasureData" ref="defectList"></local-grid>
		<el-dialog title="维修方案新增" :visible.sync="showDialog" width="60%" :before-close="handleClose">
			<div style="height: 300px">
				<base-Agrid :multiSelect="Boolean(1)" class="ag-theme-balham asms-single-action-button-grid" :columnDefs="alertTabColumn" :params="[]" actUrl="/api/v1/em/emMpdEval/queryMpList" :noFloatingFilter="true" :notShowOkCancel="true" ref="relMainTab" :enableServerSideFilter="true">
				</base-Agrid>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showDialog = false">取 消</el-button>
				<el-button type="primary" @click="mainRowSubmit()">确 定</el-button>
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
        radio:String
	},
	data() {
		let vm = this
		return {
            apiData:apiData.ReliabilityAlarmList,
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
				{
					headerName: '序号',
					field: "index",
					width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
					valueGetter: params => params.node.rowIndex + 1,

				},
				{ headerName: '文件编号', field: "mpdNo", width: 100, suppressFilter: true },
				{ headerName: '标题', field: "title", width: 100, suppressFilter: true },
				{ headerName: '机型', field: "model", width: 100, suppressFilter: true },
				{ headerName: '章节号', field: "ata", width: 100, suppressFilter: true },
			],
			showMain: false,
			showDialog: false,
			conMainMeasureData: [],
			conMainMeasureColumn: [
				{
					headerName: '序号',
					field: "index",
					width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
					valueGetter: params => params.node.rowIndex + 1,

				}, {
					headerName: '操作', field: "status", width: 100, suppressFilter: true, cellRenderer: (params) => {
						//1,2不能操作
						//多发性重复性可操作控制archiveStatus1:已归档,2:失效不可编辑
						let rowOperate = Vue.extend({
							template: `<div style="display: flex; justify-content:space-around; height:28px; line-height:28px">
                              <i class="el-icon-delete" style="cursor:pointer; height:28px; line-height:28px" @click="deleteRow">&nbsp;&nbsp;&nbsp;</i>
                        </div>`,
							methods: {
								deleteRow() {
									vm.deleteMainRow(params);
								}
							}
						});
						let component = new rowOperate().$mount();
						return component.$el;
					}
				},
				{ headerName: '文件编号', field: "mpdNo", width: 100, suppressFilter: true },
				{ headerName: '标题', field: "title", width: 100, suppressFilter: true },
			]
		}
	},
	mounted() {
	    if(this.otherParams.method === 'view'){
	        this.conMainMeasureColumn.splice(1,1)
        }
		this.mainGetData(this.otherParams.id);
	},
    watch: {
        radio: {
            handler: function (val) {
                this.$emit('getRadio', 'ifMp', val)
            },
            deep: true
        }
    },
	methods: {
		toAdd() {
			this.showMain = 'add'
			this.showDialog = true
			this.$nextTick(() => this.$refs.relMainTab.reloadData())
		},
		handleClose(done) {
			this.$confirm('确认关闭？')
				.then(_ => {
					done();
				})
				.catch(_ => {
				});
		},
		//维修方案措施表格查询
		mainGetData(id) {
			let url = this.apiData.mainQueryList + id
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.conMainMeasureData = response.obj
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			})
				.catch(err => {
					this.$message.error(err.errorMessage || err.msg || err);
				});
		},
        // 维修方案措施延期编辑确认
        mainRowSubmit() {
            let mpList = this.$refs.relMainTab.getSelect();
            if (!mpList || mpList.length === 0) {
                return this.$message.error('请先选择方案');
            }
            let relWarningMpDTOList = [];
            for (let index in mpList) {
                let mp = mpList[index];
                relWarningMpDTOList.push({mpdId: mp.evalNo, mpdNo: mp.mpdNo, title: mp.title});
            }
            let url = this.apiData.mainSubmitUrl
            this.$httpExt().post(url, {
                relWarningMpDTOList: relWarningMpDTOList,
                warningId: this.otherParams.id
            }, 'gateway').then(response => {
                // this.conMainMeasureData = response.obj
                this.showDialog = false
                this.mainGetData(this.otherParams.id)
                // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
            })
                .catch(err => {
                    this.showDialog = false
                    this.$message.error(err.errorMessage || err.msg || err);
                });
        },
		//*维修方案措施编辑
		// MainEditDetail(param) {
		//     this.showMain = 'edit';
		//     this.showDialog = true
		//     this.$nextTick(()=>this.$refs.relMainTab.reloadData())
		//     this.conMainTabData = {
		//         id: param.data.id,
		//         warningId: param.data.warningId,
		//         result: param.data.result,
		//         measures: param.data.measures,
		//     }
		// },
		//*维修方案删除
		deleteMainRow(param) {
			this.$confirm('确认删除此行', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(() => {
				this.$httpExt().get(this.apiData.mainDelUrl + param.data.id, {}, 'gateway').then(res => {
					this.mainGetData(this.otherParams.id)
					this.$message({
						type: 'success',
						message: '维修方案措施删除成功!'
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
