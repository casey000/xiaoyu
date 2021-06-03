<template>
    <div class="mid-form">
        <el-form ref="ruleForm" :model="form"  :rules="rules" label-width="220px">
            <h5>安全性分析</h5>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="其它位置是否存在同类型部件：" prop="isCmpSame">
                        <el-radio-group v-model="form.isCmpSame">
                            <el-radio label="Y" :disabled="otherParams.method === 'view'" name="radio">是</el-radio>
                            <el-radio label="N" :disabled="otherParams.method === 'view'" name="radio">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="说明：" prop="noteCmpSame">
                        <el-input v-model="form.noteCmpSame" :disabled="otherParams.method === 'view'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <h5>可靠性分析</h5>
            <el-row v-for="(item,index) in reliableList" :key="index" style="margin-bottom: 15px">
                <el-col :span="10">
                    <el-form-item :label="item.label" :prop="item.prop" label-width="220px">
                        <el-radio-group v-model="form[item.prop]">
                            <el-radio label="Y" :disabled="otherParams.method === 'view'" name="radio">是</el-radio>
                            <el-radio label="N" :disabled="otherParams.method === 'view'" name="radio">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="说明：" :prop="item.value">
                        <el-input v-model="form[item.value]" :disabled="otherParams.method === 'view'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <h5>经济性分析</h5>
            <el-row>
                <el-col :span="10">
                    <el-form-item label="检查成本：" prop="checkCost">
                        <el-input v-model="form.checkCost" :disabled="otherParams.method === 'view'"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="修理、更换或改装成本：" prop="replaceCost">
                        <el-input v-model="form.replaceCost" :disabled="otherParams.method === 'view'"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <risk-val-tab :otherParams="otherParams" :height="200"></risk-val-tab>
            <ass-system-tab :type="1" :otherParams="otherParams" :height="200"></ass-system-tab>
            <env-chara-tab :type="2" :otherParams="otherParams" :height="200"></env-chara-tab>
        </el-form>
    </div>
</template>

<script>
import riskValTab from './childComponents/riskValTab'
import assSystemTab from './childComponents/sysOrEnvTab'
import envCharaTab from './childComponents/sysOrEnvTab'
import apiData from '../../../../../api/investigationReport/detailApi'
    export default {
        name: '',
        props: {
            otherParams: Object,
            baseInfo:Object,
        },
        data() {
            var checkText = (rule, value, cb) => {
                let prop = 'is'+rule.field.slice(4)
                let json = {
                    isCmpSame: "其它位置是否存在同类型部件",
                    isGzhjSame: "其它位置是否存在类似工作环境",
                    isDefSame: "是否存在相同或类似历史故障",
                    isNonConstr: "是否存在施工不规范",
                    isCheckEntries: "是否存在已有检查条目",
                }
                if(this.form[prop]==='N'&&!value)return cb(new Error(json[prop]+'选否时，输入框为必填'))
                cb()
            };
            return {
                apiData:apiData.TechnicalNotice,
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
                reliableList:[
                    {label:'其它位置是否存在类似工作环境：',prop:'isGzhjSame',value:'noteGzhjSame'},
                    {label:'是否存在相同或类似历史故障：',prop:'isDefSame',value:'noteDefSame'},
                    {label:'是否存在施工不规范：',prop:'isNonConstr',value:'noteNonConstr'},
                    {label:'是否存在已有检查条目：',prop:'isCheckEntries',value:'noteCheckEntries'},
                ],
                form:{
                    isCmpSame: "",
                    isGzhjSame: "",
                    isDefSame: "",
                    isNonConstr: "",
                    isCheckEntries: "",
                    noteCmpSame: "",
                    noteGzhjSame: "",
                    noteDefSame: "",
                    noteNonConstr: "",
                    noteCheckEntries: "",
                    checkCost: "",
                    replaceCost: ""
                },
                // isCmpSame: "其它位置是否存在同类型部件",
                // isGzhjSame: "其它位置是否存在类似工作环境",
                // isDefSame: "是否存在相同或类似历史故障",
                // isNonConstr: "是否存在施工不规范",
                // isCheckEntries: "是否存在已有检查条目",
                rules:{
                    isCmpSame: [{ required: true, message: '其它位置是否存在同类型部件必选', trigger: 'blur' }],
                    isGzhjSame: [{ required: true, message: '其它位置是否存在类似工作环境必选', trigger: 'blur' }],
                    isDefSame: [{ required: true, message: '是否存在相同或类似历史故障必选', trigger: 'blur' }],
                    isNonConstr: [{ required: true, message: '是否存在施工不规范必选', trigger: 'blur' }],
                    isCheckEntries: [{ required: true, message: '是否存在已有检查条目必选', trigger: 'blur' }],
                    noteCmpSame: [{ validator: checkText, trigger: 'blur' }],
                    noteGzhjSame: [{ validator: checkText, trigger: 'blur' }],
                    noteDefSame: [{ validator: checkText, trigger: 'blur' }],
                    noteNonConstr: [{ validator: checkText, trigger: 'blur' }],
                    noteCheckEntries: [{ validator: checkText, trigger: 'blur' }],
                    checkCost: [{ required: true, message: '请输入检查成本', trigger: 'blur' }],
                    replaceCost: [{ required: true, message: '请输入修理、更换或改装成本', trigger: 'blur' }],
                },
            }
        },
        mounted(){
          this.getData()
        },
        methods: {
            getData(){
                let url = apiData.TechnicalNotice.midQuery+'?techId=' + this.otherParams.id
                this.$httpExt().get(url, undefined, 'gateway').then(response => {
                        this.form = response.obj||this.form
                        // this.queryDefectTab(this.baseInfo.sourceId);
                        // this.queryPartTab(this.baseInfo.sourceId);
                        // this.threeTabGetData(id)
                        // if (this.baseInfo.type !== 'PRE') this.editorList = [this.editorList[0]]
                        // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
                    })
                    .catch(err => {
                        this.$message.error(err.errorMessage || err.msg || err);
                    });
            },
            submit(){
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let url = apiData.TechnicalNotice.midChange+'?id=' + this.otherParams.id
                        this.$httpExt().post(url, {id:null,techId:this.otherParams.id,...this.form}, 'gateway').then(response => {
                                this.$message.success('保存成功')
                                this.getData()
                            })
                            .catch(err => {
                                // this.$message.error(err.errorMessage || err.msg || err);
                            });
                    }else {
                        return false;
                    }
                })

            }
        },
        components: {
            envCharaTab,
            riskValTab,
            assSystemTab
        }
    }
</script>

<style scoped type="text/less" lang="less">
    .mid-form{
        margin-top: 15px;
        padding-left: 10px;
        /deep/.el-form-item__label{
            line-height: 45px;
        }
        /deep/.el-form-item__content{
            line-height: 45px;
        }
    }
</style>
