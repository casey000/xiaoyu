<template>
    <div>
        <el-row>
            <base-info v-if="!!baseData" :baseInfo="baseData"></base-info>
            <el-row>
                <h5>故障信息</h5>
                <local-grid :columnDefs="defectColumn" :height="200" :rowData="defectData" ref="addDefectList"></local-grid>
            </el-row>
            <div class="tab-title">是否失效XXX报警单
                是<el-radio v-model="baseData" label="1" disabled>&nbsp;</el-radio>
                否<el-radio v-model="baseData" label="0" disabled>&nbsp;</el-radio>
            </div>
<!--            <h5>审批意见</h5>-->
            <el-form :model="dealtInfo" id="mform" name="mform"
                     :ref="otherParams.content+'Detail'" :rules="rules" label-width="150px">
                <el-form-item label="审批意见：" prop="reason">
                    <el-input type="textarea" name="reason" v-model="dealtInfo.reason" :rows="5" placeholder="请输入内容" resize="none">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-form :model="extensionInfo" :rules="extensionRule" ref="extension" label-width="100px">
                <el-form-item label="到期时间：" prop="auditStatus">
                    <span>2021-3-30</span>
                </el-form-item>
                <el-form-item label="审核人：" prop="auditorSn">
                    <el-select v-model="extensionInfo.auditorSn" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="延期至：" prop="delayDate">
                    <el-date-picker v-model="extensionInfo.delayDate" name="delayDate" type="date" placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="延期原因：" prop="delayDesc">
                    <el-input type="textarea" name="delayDesc" :rows="5" placeholder="请输入内容" v-model="extensionInfo.delayDesc" resize="none">
                    </el-input>
                </el-form-item>
                <el-form-item label="审批意见：" prop="reason">
                    <el-radio-group v-model="extensionInfo.warning">
                        <el-radio label="Y" name="warning" :disabled="otherParams.method === 'view'">是</el-radio>
                        <el-radio label="N" name="warning" :disabled="otherParams.method === 'view'">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="延期原因：" prop="delayDesc">
                    <el-input type="textarea" name="delayDesc" :rows="5" placeholder="请输入内容" v-model="extensionInfo.delayDesc" resize="none">
                    </el-input>
                </el-form-item>
            </el-form>
        </el-row>
    </div>
</template>

<script>
    import baseInfo from './components/baseInfo'

    export default {
        name: 'readyDealt',
        props: {
            otherParams: Object,
        },
        data() {
            return {
                baseData:null,
                defectData:[],
                defectColumn: [
                    {
                        headerName:'序号',
                        field: "index",
                        width: 60,suppressSorting: true,suppressResize: true, suppressFilter:false,
                        valueGetter: params => params.node.rowIndex + 1,

                    },
                    { headerName: '故障编号', field: "defectNo", width: 100, suppressFilter:true},
                    { headerName: 'Latest Defect No', field: "latestDefectNo", width: 100, suppressFilter:true},
                    { headerName: '发现日期', field: "dateFound", width: 100, suppressFilter:true},
                    { headerName: '飞机号', field: "acNo", width: 100, suppressFilter:true},
                    { headerName: '航站', field: "station", width: 100, suppressFilter:true},
                    { headerName: '故障描述', field: "defectDesc", width: 100, suppressFilter:true},
                    { headerName: 'ACTION', field: "action", width: 100, suppressFilter:true},
                    { headerName: '关联NRC', field: "nrcNo", width: 100, suppressFilter:true},
                ],
                ruleForm:{},
                rules:{},
                dealtInfo:{

                },
                extensionInfo: {
                    delayDate: '',
                    auditorSn: '',
                    delayDesc: ''
                },
                options: [],
                extensionRule: {
                    auditorSn: [{ required: true, message: '请选择审核人', trigger: 'blur' }],
                    delayDate: [{ required: true, message: '请选择延期时间', trigger: 'blur' }],
                    delayDesc: [{ required: true, message: '请输入延期原因', trigger: 'blur' }],
                }
            }
        },
        watch: {},
        mounted(){
            this.queryBaseInfo(this.otherParams.id)
        },
        methods: {
            //获取头部详情
            queryBaseInfo(id) {
                this.$httpExt().get('/maintenanceReliability/relWarningBase/findById/' + id, undefined, 'gateway').then(response => {
                    this.baseData = response.obj
                    this.queryDefectTab(this.baseInfo.sourceId);
                    // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
                }).catch(err => {
                    this.$message.error(err.errorMessage || err.msg || err);
                });
            },
            queryDefectTab(id) {
                let str = this.baseData.type !== 'PART' ? 'queryAtaPreDetailList/' : 'queryPartDetailList/'
                // console.log(108)
                let url = '/maintenanceReliability/relAlarm/' + str + id
                this.$httpExt().get(url, undefined, 'gateway').then(response => {
                        this.defectData = response.obj
                        // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
                    })
                    .catch(err => {
                        this.$message.error(err.errorMessage || err.msg || err);
                    });
            },
        },
        components: {
            baseInfo,
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
