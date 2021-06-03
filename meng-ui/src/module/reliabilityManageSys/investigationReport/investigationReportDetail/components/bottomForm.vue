<template>
	<div class="bottom-form">
		<el-form ref="form" :model="form" label-width="120px">
			<el-form-item label=" 附件：" prop="radio">
				<span><el-button type="primary" :disabled="otherParams.method === 'view'" @click="keepData()">上传</el-button></span>
			</el-form-item>
            </el-col>
		</el-form>
	</div>
</template>

<script>
export default {
	name: '',
	props: {
		otherParams: Object,
        canEdit:Boolean
	},
	data() {
		return {
			form: {
				radio: ''
			},
		}
	},
	methods: {},
	components: {}
}
</script>

<style scoped type="text/less" lang="less">
.bottom-form {
	margin-top: 15px;
	/deep/.el-form-item__label {
		line-height: 45px;
	}
	/deep/.el-form-item__content {
		line-height: 45px;
	}
}
</style>
