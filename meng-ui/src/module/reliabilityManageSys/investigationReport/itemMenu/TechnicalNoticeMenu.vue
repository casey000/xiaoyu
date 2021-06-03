<!--技术通告单表格右键菜单-->
<template>
    <div class="show-menu">
        <div v-for="(item,index) in resolveList" @click="resolveRow(item)" :key="index">{{item}}</div>
        <el-dialog title="延期申请" append-to-body v-if="showExtension" :visible.sync="showExtension" custom-class="dialog-index" width="35%" :before-close="handleClose">
            <el-form :model="extensionInfo" :rules="extensionRule" ref="extension" label-width="100px">
                <el-form-item label="到期时间：" prop="auditStatus">
                    <span>{{dealine}}</span>
                </el-form-item>
                <el-form-item label="审核人：" prop="auditorSn">
                    <el-select v-model="extensionInfo.auditorSn" placeholder="请选择">
                        <el-option v-for="item in auditorList" :key="item.accountNumber" :label="item.name" :value="item.accountNumber">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="延期至：" prop="delayDate">
                    <el-date-picker v-model="extensionInfo.delayDate" name="delayDate" type="date" :picker-options="pickerOptions" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="延期原因：" prop="delayReason">
                    <el-input type="textarea" name="delayReason" :rows="5" placeholder="请输入内容" v-model="extensionInfo.delayReason" resize="none">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button @click="clearInfo">取 消</el-button>
				<el-button type="primary" @click="extensionSubmit('extension')">确 定</el-button>
			</span>
        </el-dialog>
        <el-dialog title="办理轨迹" append-to-body :visible.sync="showHandlingTrack" custom-class="dialog-index" width="60%" :before-close="handleClose">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="评估情况" name="first">
                    <local-grid :columnDefs="assessmentColumn" :height="300" :rowData="assessmentData"></local-grid>
                </el-tab-pane>
                <el-tab-pane label="延期情况" name="second">
                    <local-grid :columnDefs="extensionAlertColumn" :height="300" :rowData="extensionAlertData"></local-grid>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
    import { formatDate } from '../../../../common/js/util/date.js'
    export default {
        name: '',
        props: {
            assessmentColumn: Array,
            extensionAlertColumn: Array,
            defectData: Object,
            item: Object
        },
        data() {
            return {
                // 不可以选择小于今天的日期
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的
                    }
                },
                resolveList: ['评估', '查看', '延期', '提交', '办理轨迹'],
                showExtension: false,
                activeName: 'first',
                extensionAlertData: [],
                assessmentData: [],
                menuData: {},
                showHandlingTrack: false,
                dealine : null,
                extensionInfo: {
                    delayDate: '',
                    auditorSn: '',
                    delayReason: ''
                },
                auditorList: [],
                extensionRule: {
                    auditorSn: [{ required: true, message: '请选择审核人', trigger: 'blur' }],
                    delayDate: [{ required: true, message: '请选择延期时间', trigger: 'blur' }],
                    delayReason: [{ required: true, message: '请输入延期原因', trigger: 'blur' }],
                }
            }
        },
        created(){
            this.getAuditorList();
        },
        mounted(){
            if(this.menuData.status*1!==2)this.resolveList.splice(3,1)
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
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            getMenuData(data) {
                this.menuData = data
                this.dealine =   formatDate(this.menuData.becomeDue,'yyyy-MM-dd')
            },
            toDetail(type) {
                this.$emit('toDetail', type)
            },
            clearInfo(){
                this.extensionInfo = {}
                this.showExtension = false
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        this.clearInfo();
                        done();
                    })
                    .catch(_ => { });
            },
            resolveRow(item) {
                // rowInfo
                switch (item) {
                    case '评估':
                        this.toDetail('edit')
                        break;
                    case '查看':
                        this.toDetail('view')
                        break;
                    case '延期':
                        this.showExtension = true
                        break;
                    case '提交':
                        this.$confirm('通告单提交', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                        }).then(() => {
                            this.$httpExt().post('/maintenanceReliability/relTechInfoApi/submit', { id: this.menuData.id }, 'gateway').then(res => {
                                this.$message({
                                    type: 'success',
                                    message: '技术通告单成功提交!'
                                });
                            }).catch(err => {
                                this.$message.error(err.errorMessage || err.msg || err);
                            })

                        }).catch(() => {
                            this.$message({
                                type: 'info',
                                message: '已取消提交'
                            });
                        });
                        break;
                    case '办理轨迹':
                        this.showHandlingTrack = true
                        break
                }
            },
            extensionSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$httpExt().post('/maintenanceReliability/relTechInfoApi/delaySubmit', { businessId: this.menuData.id, ...this.extensionInfo }, 'gateway').then(res => {
                            this.$message({
                                type: 'success',
                                message: '告警单已成功延期!'
                            });
                            this.showExtension = false
                            this.clearInfo();
                        }).catch(err => {
                            this.$message.error(err.errorMessage || err.msg || err);
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }

                })

            }
        },
    }
</script>

<style scoped type="text/less" lang="less">
    .show-menu {
        > div {
            line-height: 32px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.647058823529412);
            padding-left: 10px;
            cursor: pointer;
            &:hover {
                color: #ffffff;
                background: #5881ff;
            }
        }
    }
</style>
