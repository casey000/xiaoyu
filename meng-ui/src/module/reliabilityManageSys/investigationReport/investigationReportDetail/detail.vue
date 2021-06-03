<!-- 可靠性故障详情 右键评估 调查报告详情页 -->
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
			<defect-tab ref="defect" :otherParams="otherParams" :height="200"></defect-tab>
			<nrcTab ref="nrc" :otherParams="otherParams" :height="200"></nrcTab>
            <partTab ref="part" :otherParams="otherParams" :height="200"></partTab>
			<el-row>
				<h5>技术评估</h5>
				<div class="tech-eval">
					<relDocTab :otherParams="otherParams" :height="200"></relDocTab>
					<relMainTab :otherParams="otherParams" :height="200"></relMainTab>
					<el-row v-for="(item,index) in editorList" :key="item.title">
						<div class="normal-title">{{item.title}}</div>
						<editorComponent @getContent="getContent" :prop="item.prop" :height="200"></editorComponent>
					</el-row>
					<el-row>
						<sug-tab :otherParams="otherParams" :height="200"></sug-tab>
					</el-row>
					<el-row class="bot-form">
						<bottom-form :otherParams="otherParams"></bottom-form>
					</el-row>
				</div>
			</el-row>
<!--            <el-row>-->
<!--                <notice-form :otherParams="otherParams"></notice-form>-->
<!--            </el-row>-->
		</el-form>
	</div>
</template>

<script>
import editorComponent from './../../../../components/editor/editorComponent'
import tabColumn from './tabColumn'
import baseInfo from './components/baseInfo'
//结论与建议措施组件
import sugTab from './components/sugTab'
import relDocTab from './components/relDocTab'
import relMainTab from './components/relMainTab'
import defectTab from './components/defectTab'
import nrcTab from './components/nrcTab'
import partTab from './components/partTab'
import bottomForm from './components/bottomForm'
import apiData from '../../../../api/investigationReport/detailApi'
export default {
	name: "",
	components: {
		editorComponent,
		sugTab,
        partTab,
        nrcTab,
		relMainTab,
		relDocTab,
		defectTab,
		bottomForm,
        baseInfo
	},
	props: {
		otherParams: Object,
	},
	data() {
		let columnData = tabColumn(this)
		return {
			showTop: true,
			title: '',
			//故障信息
			defectColumn: columnData.defectColumn,
			defectData: [],
			//部件信息
			partsColumn: columnData.partsColumns,
			partsData: [],
			baseInfo: {},
			editorList: columnData.editorList,
			nrcColumn: columnData.nrcColumn,
			submitInfo: {

			},
		}
	},
	mounted() {
		this.queryBaseInfo(this.otherParams.id);
        this.threeTabGetData(this.otherParams.id);
		this.title = '调查报告'
		// console.log(this.alertTabColumn)
	},
	methods: {
        threeTabGetData(id) {
            let url = apiData.TechnicalNotice.topTabUrl
            this.$httpExt().get(url, {parentId:id}, 'gateway').then(response => {
                    this.$refs.defect.freshData(response.obj.defect)
                    this.$refs.nrc.freshData(response.obj.nrc)
                    this.$refs.part.freshData(response.obj.cc)
                    // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
                })
                .catch(err => {
                    this.$message.error(err.errorMessage || err.msg || err ||'错误');
                });
        },
		//获取富文本对应字段与内容
		getContent(prop, content) {
			console.log(prop, content);
			this.submitInfo[prop] = content;
			// {
			//     id:"", type: prop,
			//     text:content
			// }
		},
		closePage() {
			this.bus.$emit(this.otherParams.content, true);
			//关闭当前tab页
			this.$emit('close', this.title + '详情')
		},
		keepData() {


		},
		submitData() {

		},
		//获取头部详情
		queryBaseInfo(id) {
			let url = apiData.investigationReport.detailInfo
			this.$httpExt().post(url, id, 'gateway').then(response => {
				this.baseInfo = response.obj
				this.queryDefectTab(this.baseInfo.sourceId);
				this.queryPartTab(this.baseInfo.sourceId);
				console.log(this.baseInfo.type)
				if (this.baseInfo.type !== 'PRE') this.editorList = [this.editorList[0]]
				// console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
			})
				.catch(err => {
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
		box-sizing: border-box;
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
	.bot-form {
		margin-top: 15px;
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
