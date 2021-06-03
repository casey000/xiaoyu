<!-- 可靠性故障详情 -->
<template>
	<div class="investigation-detail">
		<h4>{{title}}
			<span v-if="otherParams.method !== 'view'">
				<el-button type="primary" @click="keepData()">保存</el-button>
				<el-button type="primary" @click="submitData()">提交</el-button>
			</span>
		</h4>
		<el-form ref="nrcBaseInfo" label-width="140px" :model="baseInfo">
			<base-info :baseInfo="baseInfo"></base-info>
			<el-row v-if="this.baseInfo.type!=='PART'">
				<h5>故障信息</h5>
				<local-grid :columnDefs="defectColumn" :height="200" :rowData="defectData" ref="addDefectList"></local-grid>
			</el-row>
			<el-row>
				<h5>部件信息</h5>
				<local-grid :columnDefs="partsColumn" :height="200" :rowData="partsData" ref="defectList"></local-grid>
			</el-row>
			<el-row v-if="this.baseInfo.type==='PART'">
				<h5>故障信息</h5>
				<local-grid :columnDefs="defectColumn" :height="200" :rowData="defectData" ref="addDefectList"></local-grid>
			</el-row>
			<el-row>
				<h6>技术评估</h6>
				<div class="tech-eval">
					<relDocTab @getRadio="getRadio" :otherParams="otherParams" :radio="baseInfo.ifRelationFile" :height="200"></relDocTab>
					<relMainTab @getRadio="getRadio" :otherParams="otherParams" :radio="baseInfo.ifMp" :height="200"></relMainTab>
					<el-row v-if="showEditor">
						<el-row v-for="(item,index) in editorList" :key="item.title">
							<div class="normal-title">{{item.title}}</div>
							<editorComponent @getContent="getContent" :parentContent="editorContent[toLowCase(item.prop)]||''" :prop="item.prop" :height="200"></editorComponent>
						</el-row>
					</el-row>
					<el-row>
						<sug-tab @getRadio="getRadio" :otherParams="otherParams" :height="200"></sug-tab>
					</el-row>
				</div>
			</el-row>
			<el-row>
				<div class="tab-title"><span style="color: red">*</span>故障是否可放行：
					<el-radio-group v-model="ifReleasable">
						<el-radio label="Y" :disabled="otherParams.method === 'view'">是</el-radio>
						<el-radio label="N" :disabled="otherParams.method === 'view'">否</el-radio>
					</el-radio-group>
				</div>
			</el-row>
		</el-form>
	</div>
</template>

<script>
import editorComponent from './../../../../components/editor/editorComponent'
import tabColumn from './tabColumn'
//结论与建议措施组件
import sugTab from './components/sugTab'
import relDocTab from './components/relDocTab'
import relMainTab from './components/relMainTab'
import baseInfo from './components/baseInfo'
import apiData from '../../../../api/investigationReport/detailApi'
export default {
	name: "",
	components: {
		editorComponent,
		sugTab,
		relMainTab,
		relDocTab,
		baseInfo
	},
	props: {
		otherParams: Object,
	},
	data() {
		let columnData = tabColumn(this)
		return {
            apiData:apiData,
			disableWarningSave: false,
			disableWarningSubmit: false,
			postData: {},
			ifReleasable: '',
			showEditor: false,
			showTop: true,
			editorContent: null,
			title: '',
			//故障信息
			defectColumn: columnData.defectColumn,
			defectData: [],
			//部件信息
			partsColumn: columnData.partsColumns,
			partsData: [],
			baseInfo: {},
			editorList: columnData.editorList,
		}
	},
	mounted() {
		this.queryBaseInfo(this.otherParams.id);
		this.title = '可靠性报警单'
	},
	methods: {
		getRadio(prop, val) {
			this.postData[prop] = val;
			console.log(prop, val)
		},
		toLowCase(str) {
			return str.toLowerCase().replace(/_\w/g, content => content.split('_')[1].toUpperCase())
		},
		//故障列表
		queryDefectTab(id) {
			let str = this.baseInfo.type !== 'PART' ? 'queryAtaPreDetailList/' : 'queryPartDetailList/'
			// console.log(108)
			let url = this.apiData[this.otherParams.content].defectTabUrl + str + id
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.defectData = response.obj;
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			})
				.catch(err => {
					this.$message.error(err.errorMessage || err.msg || err);
				});
		},
		//部件列表
		queryPartTab(id) {
			let str = this.baseInfo.type !== 'PART' ? 'queryDefectCcListByAlarmId/' : 'queryCcDefectListByAlarmId/'
			let url = this.apiData[this.otherParams.content].partTabUrl + str + id
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.partsData = response.obj
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			}).catch(err => {
			    let errMsg = !!err&&err.toString().length>0?err.errorMessage || err.msg || err:'查询部件列表错误'
				if(!!err)this.$message.error(errMsg);
			});
		},
		//富文本信息
		findRichText(id) {
			let url = this.apiData[this.otherParams.content].richTextUrl + id
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.editorContent = response.obj;
				this.$nextTick(() => this.showEditor = true);
			}).catch(err => {
				this.$message.error(err.errorMessage || err.msg || err);
			});
		},

		//获取富文本对应字段与内容
		getContent(prop, content) {
			let url = this.apiData[this.otherParams.content].editTextByIdAndType
			let params = {
				"id": this.otherParams.id,
				"type": prop,
				"text": content
			};
			this.$httpExt().post(url, params, 'gateway').then(response => {
				console.log("保存成功");
			}).catch(err => {
				this.$message.error(err.errorMessage || err.msg || err);
			});
		},
		closePage() {
			this.bus.$emit(this.otherParams.content, true);
			//关闭当前tab页
			this.$emit('close', this.title + '详情')
		},
		keepData() {
			this.postData["ifReleasable"] = this.ifReleasable;
			this.postData["id"] = this.otherParams.id;
			this.$httpExt().post(this.apiData[this.otherParams.content].keepDataUrl, this.postData, 'gateway').then(response => {
				this.$message.success("保存成功");
                this.queryBaseInfo(this.otherParams.id);
			}).catch(err => {
				this.$message.error(err.errorMessage || err.msg || err);
			});

		},
		submitData() {
		    if(!this.baseInfo.ifMp){
                this.$message.error("相关维修方案部件在维修方案中是否有检查项目不能为空");
            }
		    if(!this.baseInfo.ifRelationFile){
                this.$message.error("相关文件部件或系统故障是否有相关AD、SB、SL、FTD等信息不能为空");
            }
            if(!this.baseInfo.ifReleasable){
                this.$message.error("故障是否可放行信息不能为空");
                return;
            }

			this.$confirm('确认提交吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(() => {
				this.$httpExt().post(this.apiData[this.otherParams.content].submitUrl, { id: this.otherParams.id }, 'gateway').then(response => {
					this.$message.success({
                        message:"提交成功",
                        type: 'success',
                    });
                    if(this.otherParams.isReadyDo)this.$emit('close')
					this.closePage();
				}).catch(err => {
					this.$message.error(err.errorMessage || err.msg || err);
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消提交'
				});
			});
		},
		//获取头部详情
		queryBaseInfo(id) {
			this.$httpExt().get(this.apiData[this.otherParams.content].baseInfoUrl + id, undefined, 'gateway').then(response => {
				this.baseInfo = response.obj;
                this.ifReleasable = response.obj.ifReleasable;
				this.queryDefectTab(this.baseInfo.sourceId);
				this.queryPartTab(this.baseInfo.sourceId);
				this.findRichText(this.baseInfo.id);
				// console.log(this.baseInfo.type)
				if (this.baseInfo.type !== 'PRE') this.editorList = [this.editorList[0]]
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			}).catch(err => {
				this.$message.error(err.errorMessage || err.msg || err);
			});
		}
	}
};
</script>
<style  scoped  type="text/less" lang="less">
.investigation-detail {
    height:100%;
    overflow-y: auto;
	h4 {
		padding-left: 10px;
		> span {
			float: right;
			margin-right: 20px;
		}
	}
	h5 {
		padding-left: 10px;
	}
	h6 {
		padding-left: 10px;
	}
	.el-form-item {
		margin-bottom: 15px;
	}
	.bot-btn {
		text-align: center;
	}
	.normal-title {
		font-size: 12px;
		line-height: 32px;
		padding-left: 10px;
	}

	.tab-title {
		font-size: 12px;
		line-height: 30px;
		padding: 10px;
		width: 100%;
		overflow: hidden;
		/deep/label {
			margin-left: 10px;
			margin-right: 15px;
		}
		> button {
			float: right;
			margin-right: 20px;
		}
	}
	.tech-eval {
		margin: 0 10px;
		padding: 10px;
		border: 1px solid #999999;
		border-radius: 4px;
	}
}
</style>
