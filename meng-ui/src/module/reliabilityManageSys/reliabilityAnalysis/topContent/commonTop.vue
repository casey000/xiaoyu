<template>
    <div>
        <div class="top-btn">
            <el-button type="primary" @click="toOpenSure()">
                确认
            </el-button>
        </div>
        <el-dialog title="告警确认" append-to-body :visible.sync="showSure" custom-class="dialog-index" width="40%" :before-close="handleClose">
            <el-form :model="sureInfo" :rules="sureInfoRule" ref="sureInfoRule" label-width="100px">
                <el-form-item label="是否真告警：" prop="ifAlarm">
                    是<el-radio style="margin-left: 10px" v-model="sureInfo.ifAlarm" label="Y">&nbsp;</el-radio>
                    否<el-radio style="margin-left: 10px" v-model="sureInfo.ifAlarm" label="N">&nbsp;</el-radio>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input type="textarea" name="remark" :rows="5" placeholder="请输入内容" v-model="sureInfo.remark" resize="none">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button @click="showSure = false">取 消</el-button>
				<el-button type="primary" @click="sureWarning('extension')">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            item:Object
        },
        data() {
            return {
                showSure:false,
                sureInfo:{
                    ifAlarm:'',
                    remark:''
                },
                sureInfoRule:{
                    ifAlarm:[{ required: true, message: '请选择是否真警告', trigger: 'blur' }],
                    remark:[{ required: true, message: '请输入备注', trigger: 'blur' }],

                },
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
            toOpenSure(){
                if(this.$parent.$refs[this.item.content].getSelect().map(item=>item.id).length<=0)return this.$message.warning('请先选择数据')
                this.showSure = true
            },
            sureWarning(){
                //加dialog弹框
                this.$refs.sureInfoRule.validate((valid) => {
                    if (valid) {
                        let ids = this.$parent.$refs[this.item.content].getSelect().map(item=>item.id)
                        this.$httpExt().post(this.$parent.api[this.item.content].sureTabUrl , {
                            alarmIds:ids,...this.sureInfo
                        }, "gateway").then(response => {
                            //成功提示
                            this.showSure = false;
                            this.$message.success('告警确认成功');
                            this.sureInfo={
                                ifAlarm:'',
                                    remark:''
                            }
                        }).catch(err => {
                            this.showSure = false;
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
    .top-btn{
        padding: 10px 20px;
        margin-bottom: -10px;
        text-align: right;
    }
</style>
