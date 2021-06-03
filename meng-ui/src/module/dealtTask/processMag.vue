<template>
	<div class="process-msg">
		<el-row>
			<el-form label-width="120px" v-if="!!processData">
				<el-col :span="12" v-for="(item,index) in showList" :key="index">
					<el-form-item :label="item.label">
						<span v-if="!item.isCheck" style="width: 100px">{{processData[item.prop]}}</span>
						<span v-else>
							<el-radio-group v-model="radio">
								<el-radio label="0" disabled>可退回</el-radio>
								<el-radio label="1" disabled>可转办 </el-radio>
								<el-radio label="2" disabled>可终止</el-radio>
								<el-radio label="3" disabled>可挂起</el-radio>
							</el-radio-group>
						</span>
					</el-form-item>
				</el-col>

			</el-form>
		</el-row>
		<img :src="src" alt="">
	</div>
</template>

<script>
export default {
	name: '',
	props: {
		data: Object,
		procInstId: String
	},
	data() {
		return {
			radio: '',
			src: '',
			processData: null,
			showList: [
				{ label: '流程业务Key ：', prop: 'businessKey', isCheck: false },
				{ label: '流程业务名称 ：', prop: 'executionName', isCheck: false },
				{ label: '流程创建时间 ：', prop: 'createTime', isCheck: false },
				{ label: '流程创建人 ：', prop: 'userName', isCheck: false },
				{ label: '流程任务名称 ：', prop: 'nodeName', isCheck: false },
				{ label: '是否会签任务 ：', prop: 'isJoint', isCheck: false },
				{ label: '流程任务-配置 ：', prop: 'state', isCheck: true },
			]
		}
	},
	mounted() {
		this.processData = { ...this.data.execution, ...this.data.node };
		this.radio = this.processData.state+'';
		this.src =  window.location.protocol+'//'+window.location.host
				+'/api/activiti/diagram/flowimage?procInstId=' + this.procInstId;
	},
	methods: {},
	components: {}
}
</script>

<style scoped type="text/less" lang="less">
.process-msg {
	/deep/.el-radio {
		margin-right: 15px;
	}
}
</style>
