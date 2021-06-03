<template>
    <div class="bottom-form">
        <h5 style="padding-left: 10px">通告单打分</h5>
        <el-form ref="form" :model="form" label-width="120px">
            <el-col :span="8">
                <el-form-item label="事件定性：">
<!--                    -->
                    <el-select v-model="form.qualitatively" :disabled="otherParams.method === 'view'" style="margin-top: -8px" placeholder="请选择">
                        <el-option name="approveResult" v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="关注度：">
                    <el-select v-model="form.notability" :disabled="otherParams.method === 'view'" style="margin-top: -8px" placeholder="请选择">
                        <el-option name="approveResult" v-for="item in focusOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="分数：">
                    <el-input v-model="score" :disabled="otherParams.method === 'view'" disabled></el-input>
                </el-form-item>
            </el-col>
        </el-form>
    </div>
</template>

<script>
    import apiData from '../../../../../api/investigationReport/detailApi'
    export default {
        name: 'noticeForm',
        props: {
            otherParams: Object,
        },
        data() {
            return {
                apiData:apiData.TechnicalNotice,
                options: [{
                    value: '1',
                    label: '质量事件'
                }, {
                    value: '2',
                    label: '人为事件'
                }, {
                    value: '3',
                    label: '天气原因'
                }, {
                    value: '4',
                    label: '组织因素'
                }, {
                    value: '5',
                    label: '飞机技术状态'
                }],
                focusOptions:[
                    {
                        value: '1',
                        label: '正常处置'
                    },{
                        value: '2',
                        label: '部门跟进'
                    },{
                        value: '3',
                        label: '领导关注'
                    }
                ],
                form:{
                    notability:'',
                    qualitatively:'',
                },
                pageInfo:{},
            }
        },
        computed:{
            score(){
                let total = 0;
                let event = this.form.qualitatively*1<=4?0:1;
                let attention = this.form.notability

                // g:event
                // h:attention
                // if (0 != this.g) {
                //     total = a * b * c * d * e * h * g + 2 * f;
                // }
               return 321
            }
        },
        mounted(){
          this.queryData()
        },
        methods: {
            queryData(){
                let url = this.apiData.noticeInfoQuery+'?techId=' + this.otherParams.id
                this.$httpExt().get(url, undefined, 'gateway').then(response => {
                        // this.$message.success('通告单保存成功')
                    this.pageInfo = response.obj
                    this.form.notability = response.obj.attention*1===0?'':response.obj.attention
                        this.form.qualitatively = response.obj.event*1===0?'':response.obj.event
                    })
                    .catch(err => {
                        this.$message.error(err.errorMessage || err.msg || err);
                    });
            }
        },
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
