<template>
	<div class="bottom-form">
		<el-form ref="form" :model="form" label-width="120px">
            <el-form-item v-if="showResonDef" label="触发原因定性：" prop="radio">
                <el-select v-model="form.radio" :disabled="otherParams.method === 'view'" style="margin-top: -8px" placeholder="请选择">
                    <el-option name="approveResult" v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
			<el-col :span="12">
				<el-form-item label="故障是否可保留：" prop="radio">
					<el-radio-group v-model="form.radio">
						<el-radio label="y" :disabled="otherParams.method === 'view'" name="radio">是</el-radio>
						<el-radio label="n" :disabled="otherParams.method === 'view'" name="radio">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="工程评估：" prop="radio">
					<el-radio-group v-model="form.radio">
						<el-radio label="y" :disabled="otherParams.method === 'view'" name="radio">是</el-radio>
						<el-radio label="n" :disabled="otherParams.method === 'view'" name="radio">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-col>
            <el-col :span="12">
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
        canEdit:Boolean,
        baseInfo:Object
	},
	data() {
		return {
			form: {
				radio: ''
			},
			options: [{
				value: '0',
				label: '审核中'
			}, {
				value: '1',
				label: '已审核'
			}, {
				value: '2',
				label: '已驳回'
			}],
		}
	},
    computed:{
        showResonDef(){
            return true
            return [1].includes(this.$parent.baseInfo.sourceType*1)
        },
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
