<template>
    <div>
        <el-row>
            <el-form :model="extensionInfo" :rules="extensionRule" ref="extensionForm" label-width="100px">
                <el-form-item :label="title+'：'" prop="warningNo">
                    <span>{{baseData.warningNo}}</span>
                </el-form-item>
                <el-form-item label="到期时间：" prop="dueDate">
                    <el-date-picker v-model="baseData.dueDate" name="dueDate" type="date" placeholder="选择日期" disabled>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核人：" prop="auditorSn" v-if="otherParams.flowNode ==='assess'" >
                    <el-select v-model="extensionInfo.auditorSn" placeholder="请选择">
                        <el-option v-for="item in auditorList" :key="item.pkid" :label="item.name+'('+item.accountNumber+')'" :value="item.pkid">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="延期至：" prop="delayDate">
                    <el-date-picker v-model="extensionInfo.delayDate" name="delayDate" type="date"  placeholder="选择日期" :picker-options="pickerOptions" :disabled="otherParams.flowNode ==='audit'">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="申请延期原因：" prop="delayReason" >
                    <el-input type="textarea" name="delayReason" :rows="5" placeholder="请输入内容" v-model="extensionInfo.delayReason" resize="none" :disabled="otherParams.flowNode ==='audit'">
                    </el-input>
                </el-form-item>
                <el-form-item label="审批结果：" prop="option" v-if="otherParams.flowNode ==='audit'">
                    <el-radio-group v-model="extensionInfo.option">
                        <el-radio label="Y" name="option" :disabled="otherParams.method === 'view'">是</el-radio>
                        <el-radio label="N" name="option" :disabled="otherParams.method === 'view'">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审批意见：" prop="remark" v-if="otherParams.flowNode ==='audit'">
                    <el-input type="textarea" name="remark" :rows="5" placeholder="请输入内容" v-model="extensionInfo.remark" resize="none">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-row>
        <div slot="footer"  style="text-align: center">
            <el-button type="primary" @click="flowSubmitAndBack('submit')">提 交</el-button>
            <!--<el-button type="primary"  v-if="otherParams.flowNode ==='audit'" @click="flowSubmitAndBack('back')" >退 回</el-button>-->
        </div>
    </div>
</template>

<script>
    export default {
        name: 'readyDealt',
        props: {
            otherParams: Object,
        },
        // 接受父类（父类的父类也支持）
        inject:{
            vueFlowMethod: {
                from: 'vueFlowMethod',
                default: ''
            }
        },
        data() {

            return {
                title : "",
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的
                    }
                },
                baseData:{
                    warningNo:'',
                    delayDate:null,

                },
                defectData:[],
                ruleForm:{},
                rules:{},
                dealtInfo:{

                },
                extensionInfo: {
                    delayDate: '',
                    delayReason:'',
                    auditorSn: '',
                    option:'',
                    remark:''
                },
                auditorList:[],
                extensionRule: {
                    auditorSn: [{ required: true, message: '请选择审核人', trigger: 'blur' }],
                    delayDate: [{ required: true, message: '请选择延期时间', trigger: 'blur' }],
                    delayDesc: [{ required: true, message: '请输入延期原因', trigger: 'blur' }],
                    option: [{ required: true, message: '请选择审批结果', trigger: 'blur' }],
                }
            }
        },
        watch: {},
        mounted(){
            this.title = this.otherParams.title || '';
            this.queryBaseInfo(this.otherParams.id);
            this.getAuditorList(this.otherParams.id);
            console.log(this.otherParams);
        },
        methods: {
            getAuditorList(){
                let data = {
                    roleName:'WG组长'
                };
                this.$httpExt().post('/maintenanceReliability/relWarningBase/queryAccountByRoleName', data, 'gateway').then(res => {
                    this.auditorList = res.obj;
                }).catch(err => {
                    this.$message.error(err.errorMessage || err.msg || err);
                })
            },
            //获取头部详情
            queryBaseInfo(id) {
                if(this.otherParams.page == 'relWarningDelay'){
                    this.$httpExt().get('/maintenanceReliability/relWarningBase/findById/'+id,undefined, 'gateway').then(response => {
                        this.baseData = response.obj;
                        this.extensionInfo.delayDate = response.obj.delayDate;
                        this.extensionInfo.delayReason = response.obj.delayReason;
                    }).catch(err => {
                        this.$message.error(err.errorMessage || err.msg || err);
                    });
                }else if(this.otherParams.page =='invstigation'){
                    this.$httpExt().post('/maintenanceReliability/investigationBase/get',id, 'gateway').then(response => {
                        this.baseData = response.obj;
                        this.extensionInfo.delayDate = response.obj.delayDate;
                        this.extensionInfo.delayReason = response.obj.delayReason;
                    }).catch(err => {
                        this.$message.error(err.errorMessage || err.msg || err);
                    });
                }else if(this.otherParams.page =='technical'){
                    this.$httpExt().get('/maintenanceReliability/relTechInfoApi/selectById',id, 'gateway').then(response => {
                        this.baseData = response.obj;
                        this.extensionInfo.delayDate = response.obj.delayDate;
                        this.extensionInfo.delayReason = response.obj.delayReason;
                    }).catch(err => {
                        this.$message.error(err.errorMessage || err.msg || err);
                    });
                }

            },
            // 提交和退回方法
            flowSubmitAndBack(operation) {
                this.$refs.extensionForm.validate((valid) => {
                    if (valid) {
                        this.$emit('delayFunSubmit',{otherParams:this.otherParams,info:this.extensionInfo,opt:operation});
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
        },
        components: {
        }
    }
</script>

<style scoped type="text/less" lang="less">
    h5 {
        padding-left: 10px;
    }
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

    }
</style>
