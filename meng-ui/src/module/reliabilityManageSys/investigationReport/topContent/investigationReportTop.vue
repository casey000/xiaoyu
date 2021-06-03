<template>
    <div class="top-do">
        <div class="top-btn">
            <el-button type="primary" @click="showForm = true">
                新增
            </el-button>
        </div>
        <el-dialog title="调查报告新增" :visible.sync="showForm" custom-class="dialog-index" width="40%" :before-close="handleClose">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="133px" class="demo-ruleForm">
                <el-form-item label="相关通告单/报警单：" prop="sourceNo">
                    <el-input v-model="form.sourceNo"></el-input>
                </el-form-item>
                <el-form-item label="调查类型：" prop="type">
                    <el-select v-model="form.type" placeholder="请选择">
                        <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题：" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="机型：" prop="model">
                    <el-select multiple collapse-tags v-model="form.model" placeholder="请选择">
                        <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="飞机号：" prop="aircraft">
                    <el-select v-model="form.aircraft" placeholder="请选择">
                        <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="章节号：" prop="ata">
                    <el-select multiple collapse-tags v-model="form.ata" placeholder="请选择">
                        <el-option
                                multiple
                                collapse-tags
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="WG小组：" prop="wgTeam">
                    <el-select multiple collapse-tags v-model="form.wgTeam" placeholder="请选择">
                        <el-option
                                v-for="item in typeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button @click="showForm = false">取 消</el-button>
				<el-button type="primary" @click="sureAdd()">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
    import apiData from '../../../../api/investigationReport/detailApi'
    export default {
        name: '',
        props: {
            item:Object
        },
        data() {
            return {
                apiData:apiData.investigationReport,
                showForm:false,
                typeOptions:[{
                    value: '1',
                    label: '工程调查'
                },{
                    value: '2',
                    label: '技术调查'
                },{
                    value: '3',
                    label: '下发文件'
                },{
                    value: '4',
                    label: '航材备件'
                },{
                    value: '5',
                    label: '修改手册'
                },{
                    value: '6',
                    label: '宣贯'
                },{
                    value: '7',
                    label: '其他'
                }],
                form:{
                    sourceNo:'',
                    type:'',
                    title:'',
                    model:'',
                    aircraft:'',
                    ata:'',
                    wgTeam:'',
                },
                rules:{
                    type:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ],title:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ],model:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ],aircraft:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ],ata:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ],wgTeam:[
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ]
                }
            }
        },
        computed: {},

        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => { });
            },
            sureAdd(){
                //加dialog弹框
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        let ids = this.$parent.$refs[this.item.content].getSelect().map(item=>item.id)
                        this.$httpExt().post(this.apiData.addReport , {
                            alarmIds:ids,...this.sureInfo
                        }, "gateway").then(response => {
                            //成功提示
                            this.showForm = false;
                            this.$message.success('调查报告新增成功');
                            this.sureInfo={
                                ifAlarm:'',
                                remark:''
                            }
                        }).catch(err => {
                            this.showForm = false;
                            this.$message.error(err.errorMessage || err.msg || err);
                        });
                    }else{
                        console.log('error submit!!');
                        return false;
                    }

                })




            },
        },
        components: {}
    }
</script>

<style scoped type="text/less" lang="less">
    .top-do{
        .top-btn{
            padding: 10px 20px;
            margin-bottom: -10px;
            text-align: right;
        }
        /deep/label{
            line-height: 40px!important;
        }
    }

</style>
