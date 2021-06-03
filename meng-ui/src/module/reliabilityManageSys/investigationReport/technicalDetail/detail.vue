<!-- 可靠性故障详情 -->
<template>
	<div class="investigation-detail">
		<h4>{{title}}
			<span v-if="otherParams.method !== 'view'&&baseInfo.status*1===2">
<!--				<el-button type="primary" @click="keepData()">保存</el-button>-->
				<el-button type="primary" @click="submitData()">提交</el-button>
			</span>
		</h4>
		<el-form ref="nrcBaseInfo" label-width="140px" :model="baseInfo">
            <base-info :baseInfo="baseInfo"></base-info>
			<el-row>
				<defect-tab ref="defect" @fresh="threeTabGetData" :otherParams="otherParams" :height="200"></defect-tab>
			</el-row>
			<el-row v-if="showNrc">
				<h5>NRC信息</h5>
				<local-grid ref="nrc" :columnDefs="nrcColumn" :height="200" :rowData="nrcData"></local-grid>
			</el-row>
			<el-row>
				<h5>部件信息</h5>
				<local-grid ref="part" :columnDefs="partsColumn" :height="200" :rowData="partsData"></local-grid>
			</el-row>
			<el-row>
				<h5>{{formName}}
                   <span v-if="showMidForm">
                        <el-button style="float: right" type="primary" @click="keepMidForm()">保存</el-button>
                   </span>
                </h5>
				<div class="tech-eval">
                    <mid-form v-if="showMidForm" ref="midForm" :otherParams="otherParams" :baseInfo="baseInfo"></mid-form>
					<relDocTab ref="docTab" v-if="showRelDocAndMain" :otherParams="otherParams" :height="200"></relDocTab>
					<relMainTab ref="mainTab" v-if="showRelDocAndMain" :otherParams="otherParams" :height="200"></relMainTab>
					<el-row v-for="(item,index) in editorList" :key="item.title">
						<div class="normal-title">{{item.title}}</div>
						<editorComponent @getContent="getContent" :prop="item.prop" :height="200"></editorComponent>
					</el-row>
					<el-row v-if="showSu">
						<sug-tab :otherParams="otherParams" :height="200"></sug-tab>
					</el-row>
                    <el-row class="bot-form">
                        <bottom-form ref="botForm" :otherParams="otherParams"></bottom-form>
                    </el-row>
				</div>
			</el-row>
            <el-row v-if="showNotice">
                <notice-form ref="noticeForm" :otherParams="otherParams"></notice-form>
            </el-row>
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
import bottomForm from './components/bottomForm'
import midForm from './components/midForm'
import noticeForm from './components/noticeForm'
import apiData from '../../../../api/investigationReport/detailApi'
export default {
	name: "",
	components: {
		editorComponent,
		sugTab,
		relMainTab,
		relDocTab,
		defectTab,
		bottomForm,
		midForm,
        noticeForm,
        baseInfo
	},
	props: {
		otherParams: Object,
	},
    computed:{
	    //1:"多发性故障",2:"重复性故障",3:"EWIS",4:"油液渗漏",5:"SDR事件",6:"不正常事件"
        formName() {
            let type = this.baseInfo.sourceType*1;
            return type===2||type===5?'TMC技术评估':'技术评估'
        },
        //nrc显示
        showNrc(){
            return true
            return [3,4].includes(this.baseInfo.sourceType*1)
        },
        //相关文件与相关微信
        showRelDocAndMain(){
            return true
            return [1,4,5].includes(this.baseInfo.sourceType*1)
        },
        //建议
        showSu(){
            return true
            return ![6].includes(this.baseInfo.sourceType*1)
        },
        //中间form提交
        showMidForm(){
            return true
            return [3].includes(this.baseInfo.sourceType*1)
        },
        //通告单
        showNotice(){
            return true
            return ![3,4].includes(this.baseInfo.sourceType*1)
        },
    },
	data() {
		let columnData = tabColumn(this)
		return {
			showTop: true,
			title: '',
            nrcData:[],
			//故障信息
			defectColumn: columnData.defectColumn,
			defectData: [],
			//部件信息
			partsColumn: columnData.partsColumns,
			partsData: [],
			baseInfo: {},
            typeIntro: {
                1:"多发性故障",2:"重复性故障",3:"EWIS",4:"油液渗漏",5:"SDR事件",6:"不正常事件"
            },
			editorList: columnData.editorList,
			nrcColumn: columnData.nrcColumn,
			submitInfo: {

			},
		}
	},
	mounted() {
		this.queryBaseInfo(this.otherParams.id);
		this.title = this.otherParams.content === 'ReliabilityAlarmList' ? '可靠性报警单' : '技术通告单'
	},
	methods: {
        threeTabGetData(id) {
            let url = apiData.TechnicalNotice.topTabUrl+'?id=' + id
            this.$httpExt().get(url, undefined, 'gateway').then(response => {
                this.$refs.defect.freshData(response.obj.defect)
                    this.nrcData = response.obj.nrc
                    this.partsData = response.obj.cc
                    // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
                })
                .catch(err => {
                    this.$message.error(err.errorMessage || err.msg || err ||'错误');
                });
        },
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

            let data = {
                id:  this.otherParams.id,
                "qualitatively": "",
                "notability": "",
                "technicalAnalysis": "",
                "technicalAnalysisTmc": "",
                "isPend": "",
                "isEngineering": "",
                "hasDoc": "",
                "hasMpd": "",
                "technicalReason": ""
            }


		},
        keepMidForm(){
            this.$refs.midForm.submit()
        },
		submitData() {
            let url = apiData.TechnicalNotice.submit+'?id=' + this.otherParams.id
            this.$httpExt().get(url, undefined, 'gateway').then(response => {
                   this.$message.success('通告单保存成功')
                })
                .catch(err => {
                    this.$message.error(err.errorMessage || err.msg || err);
                });
		},
		//获取头部详情
		queryBaseInfo(id) {
			let url = apiData.TechnicalNotice.detailBaseUrl+'?id=' + id
			this.$httpExt().get(url, undefined, 'gateway').then(response => {
				this.baseInfo = response.obj
                this.threeTabGetData(id)
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
			margin-right: 30px;
		}
	}
	h5 {
		box-sizing: border-box;
		padding-left: 10px;
        > span {
            float: right;
            margin-top: -5px;
            margin-right: 30px;
        }
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
