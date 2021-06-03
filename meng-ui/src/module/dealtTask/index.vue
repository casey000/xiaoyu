<template>
    <div class="process-dialog">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" append-to-body :before-close="handleClose">
            <el-tab-pane label="业务表单数据" name="first">
                <el-collapse v-model="businessActiveNames">
                    <el-collapse-item title="业务信息" name="baseInfo">
                        <div v-if="isPage" class="detail-content" @getBaseCode="getBaseCode" @delayFunSubmit="delayFunSubmit"
                             :otherParams="{id:pageInfo.pkId,taskId:dealtData.TASK_ID, flowDefId: dealtData.FLOW_DEF_ID,
                             flowNode:flowNode, method:'edit',isReadyDo:true,content:pageCode,...pageInfo}"
                             :is="pageCode">
                        </div>
                    </el-collapse-item>
                    <el-collapse-item title="流程处理" name="flowBaseInfo" v-if="showFlowBtn">
                    <!--<el-collapse-item title="流程处理" name="flowBaseInfo">-->
                        <!-- 默认的流程处理窗口按钮 -->
                        <div  class="bot-btn">
                            <el-form :model="flowDataInfo" :rules="flowDataRule" ref="extension" label-width="100px">
                                <el-form-item label="审核人：" prop="auditorSn" style="text-align: left" v-if="flowNode==='assess'" >
                                    <el-select   v-model="flowDataInfo.auditorSn" placeholder="请输入选择"
                                                 filterable
                                                 remote
                                                 :remote-method="getFlowOptions" >
                                        <el-option v-for="item in flowOptions" :key="item.ACCOUNT_ID" :label="item.USER_NAME+'('+item.ACCOUNT_NUMBER+')'"
                                                   :value="item.ACCOUNT_ID">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="审批意见：" prop="remark">
                                    <el-input type="textarea" name="remark" :rows="2" :span="18" placeholder="请输入内容"
                                              v-model="flowDataInfo.remark"
                                              resize="none">
                                    </el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer">
                                <el-button type="primary" @click="flowSubmit()">提 交</el-button>
                                <el-button type="primary" @click="flowBack()" v-if="flowNode==='audit'">退 回</el-button>
                            </span>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="流程信息" name="second">
                <process-msg v-if="!!processData" :data="data" :procInstId="taskInfo.procInstId"></process-msg>
            </el-tab-pane>
            <el-tab-pane label="历史任务信息" name="third">
                <history-task-msg :procInstId="dealtData.PROC_INST_ID"></history-task-msg>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import processMsg from './processMag'
    import historyTaskMsg from './historyTaskMsg'
    export default {
        name: '',
        props: {
            dealtData:Object,
            pageData:Object
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
                activeName:'first',
                processData:null,
                isPage:false,
                taskInfo:{},
                reliability: {
                    relAlarmAudit:'relAlarmAudit',//【告警单】修改是否真假告警审核
                    relWarningAssess:'relWarningAssess',//【报警单】评估-即-报警单评估提交
                    relWarningInvalid:'relWarningInvalid',//【报警单】是否失效报警单
                    relWarningDelay:'relWarningDelay',//【报警单】延期
                },
                delayProcess: {
                    // 延期流程的配置项
                    relWarningDelay:{
                        //【报警单】延期
                        pageCode:'relWarningDelay',// 注册的延期申请前端页面组件
                        title : "报警单编号",
                        fun : this.submit4RelWarning //自定义提交方法,前端页面复用又要区分业务接口时才建议使用
                    },
                    invstigation:{
                        //【报警单】延期
                        pageCode:'relWarningDelay',
                        title : "调查报告编号",
                        postUrl : '/maintenanceReliability/investigationBase/delayProcess',
                        fun : this.submit4DelayProcess
                    },
                    technical:{
                        //【通告单】延期
                        pageCode:'relWarningDelay',
                        title : "通告单编号",
                        postUrl : '/maintenanceReliability/relTechInfoApi/delayProcess',
                        fun : this.submit4DelayProcess
                    },
                },
                pageInfo:{

                },
                pageCode:'',
                // 流程信息
                flowDataInfo: {auditorSn: "", remark: ""},
                businessActiveNames:["baseInfo","flowBaseInfo"],
                flowOptions: [],
                showFlowBtn:true,//是否显示流程处理
                flowNode:'', // 流程节点：assess: 评估(显示审核人) audit:审核（不显示审核人）
                flowRoleId:'',
                flowDataRule: {
                    auditorSn: [{ required: true, message: '请选择审核人', trigger: 'blur' }],
                    remark: [{ required: true, message: '请输入备注信息', trigger: 'blur' }],
                }
            }
        },
        created(){
        },
        mounted() {
            this.taskInfo = {
                taskId: this.dealtData.TASK_ID,
                flowDefId: this.dealtData.FLOW_DEF_ID,
                procDefId: this.dealtData.PROC_DEF_ID,
                procInstId: this.dealtData.PROC_INST_ID
            };
            var _this = this;
             //this.getUrlParam('/module/index.html?newDealt=Y&page=relWarningAssess&file=reliability&pkId=9')
            this.$httpExt().post('/api/v1/plugins/PROCESS_FORM_RESOURCE', {
                PROCESS_FORM_RESOURCE: 'PROCESS_FORM_RESOURCE',
                ..._this.taskInfo
            }, "form").then(response => {
                _this.data = response.data
                _this.processData = _this.data.execution
                _this.pageInfo = _this.getUrlParam(_this.data.formUrl)
                console.log(_this.pageInfo)
                _this.pageInfo.pkId = _this.processData.objNo
                _this.isPage = true
                _this.pageCode = _this.delayProcess[_this.pageInfo.page].pageCode
                _this.pageInfo['title'] = _this.delayProcess[_this.pageInfo.page].title
                _this.pageInfo['page'] = _this.pageInfo.page
                if(_this.data && _this.data.node){
                    _this.pageInfo.taskPropId =  _this.data.node.taskPropId
                }
                // this.showPage()
                _this.parseFormUrl(response.data.form.formUrl, _this.pageInfo.showFlowBtn);
            }).catch(err => {
                // this.$message.error(err.errorMessage || err.msg || err);
            });

            this.queryNodeRole(this.dealtData.ACT_ID);
        },
        methods: {
            // 查询下一节点对应的角色
            queryNodeRole(taskId) {
                this.$httpExt().post('/api/v1/plugins/NODE_ROLE_CONFIG_QUERY_ROLE_ID_BY_TASK_ID', {taskId: taskId}, "form").then(jdata => {
                    if (jdata.data &&  jdata.data.ROLE_ID) {
                        this.flowRoleId = jdata.data.ROLE_ID;
                    }
                    this.getFlowOptions("");
                }).catch(err => {
                    this.getFlowOptions("");
                    console.log("通过任务id查询角色失败；"+err);
                });
            },
            // 解析数据 例："{componentName:'vue_simple_task',flowNode:'assess',showFlowBtn:'N'}"
            parseFormUrl(formUrl,showFlowBtn){
                // 流程自己控制按钮
                if(!!showFlowBtn ){
                    if(showFlowBtn ==='N'){
                        this.showFlowBtn = false;
                    }
                    return;
                }
                if(!formUrl){
                    return;
                }
                let fromUrl = JSON.parse(formUrl);
                this.flowNode = fromUrl.flowNode;
                if (fromUrl.showFlowBtn === 'N') {
                    this.showFlowBtn = false;
                }
            },
            getFlowOptions(sn){
                let data={userId: this.dealtData.ASSIGNEE,roleId:this.flowRoleId,FunctionCode: "FLOW_WORK_ACCOUNT",page: 1,rows: 10};
                if(sn){
                    data["q"] = sn;
                }
                this.$httpExt().post('/api/v1/plugins/FLOW_WORK_ACCOUNT', data, "form").then(response => {
                    this.flowOptions = response.data;
                }).catch(err => {

                });
            },
            flowSubmit(){
                let data = {
                    operation: 'submit',
                    pkid: this.pageInfo.pkId,
                    taskId: this.dealtData.TASK_ID,
                    flowDefId: this.dealtData.FLOW_DEF_ID,
                    auditorSn: this.flowDataInfo.auditorSn,
                    remark: this.flowDataInfo.remark,
                    typeMap: {}
                };
                this.vueFlowMethod(data);
            },
            flowBack() {
                let data = {
                    operation: 'back',
                    pkid: this.pageInfo.pkId,
                    taskId: this.dealtData.TASK_ID,
                    flowDefId: this.dealtData.FLOW_DEF_ID,
                    remark: this.flowDataInfo.remark,
                    typeMap: {}
                };
                this.vueFlowMethod(data);
            },
            getUrlParam(url) {
                if(!url){
                    return {};
                }
                let reg = /([^?#&]*)=([^?#&]*)/g
                let obj={}
                url.replace(reg,(...args)=>{
                    return obj[args[1]]=args[2]
                })
                return obj
            },
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            initPostParam(obj){
                // 审批不同意则表示驳回
                let _return = obj.info.option =='N'?"Y":"N";
                let data = {
                    _return: _return,//是否退回
                    isFirstNode: 'N',
                    approvedBy: "",
                    operation: obj.opt,
                    pkid: obj.otherParams.id,
                    taskId: obj.otherParams.taskId,
                    flowDefId: obj.otherParams.flowDefId,
                    notes: obj.info.remark,
                    option: obj.info.option
                };
                if (obj.opt === 'submit' && obj.otherParams.flowNode === 'assess') {
                    data['reviewedBy'] = obj.info.auditorSn;
                }

                return _return;
            },
            submit4RelWarning(obj){

                // 报警单的延期申请提交
                let data = this.initPostParam(obj);
                data['FunctionCode'] = 'PROCESS_TASK_SUBMIT' //PROCESS_TERMINATE_TASK, 默认的提交接口：提交到TDMS后通过回调方式再到业务逻辑
                data['typeMap'] = JSON.stringify({
                                        delayDate: obj.info.delayDate,
                                        delayReason: obj.info.delayReason,
                                        option: obj.info.option
                                    })

                this.vueFlowMethod(data);
            },
            submit4DelayProcess(obj){
                // 报警单的延期申请提交
                // 审批不同意则表示驳回
                let _return = obj.info.option =='N'?"Y":"N";
                let data = {
                    _return: _return,//是否退回
                    isFirstNode: 'N',
                    taskId: obj.otherParams.taskId,
                    delayReason: obj.info.delayReason,
                    delayDate: obj.info.delayDate,
                    businessId : obj.otherParams.id,
                    opinion : obj.info.option,
                    taskPropId : obj.otherParams.taskPropId,
                    postType : 'gateway',
                    postUrl : this.delayProcess[this.pageCode].postUrl
                }

                if (obj.otherParams.flowNode === 'assess') {
                    data['auditorSn'] = obj.info.auditorSn;
                }
                // data['postUrl'] = '/maintenanceReliability/investigationBase/delayProcess'// 自定义的微服务接口地址
                // data['postType'] = 'gateway' // 微服务接口
                this.vueFlowMethod(data);
            },
            delayFunSubmit(obj){

                if(!this.delayProcess[this.pageCode] || !this.delayProcess[this.pageCode].fun){
                    this.$message({ type: 'error', message: '未知的流程节点' });
                    return false;
                }
                // 延期流程的提交入口
               this.delayProcess[this.pageCode].fun(obj);

            }

        },
        components: {
            processMsg,
            historyTaskMsg,
            relAlarmAudit: function (resolve) {
                require(['../reliabilityManageSys/reliabilityAnalysis/monitoring/detail.vue'], resolve)
            },
            relWarningInvalid: function (resolve) { // 报警单失效
                require(['../reliabilityManageSys/reliabilityAnalysis/monitoring/invalid.vue'], resolve)
            },
            relWarningAssess: function (resolve) { // 报警单评估
                require(['../reliabilityManageSys/investigationReport/reliabilityAlarmDetail/detail.vue'], resolve)
            },
            relWarningDelay: function (resolve) { // 报警单延期
                require(['../reliabilityManageSys/reliabilityAnalysis/monitoring/delay.vue'], resolve)
            },
        }
    }
</script>

<style scoped type="text/less" lang="less">

    .process-dialog{
        position: relative;
        /deep/.el-tabs__content{
            height: 560px;
            overflow: auto;
        }
        .bot-btn{
            /*position: absolute;*/
            height: 200px;
            margin-bottom: -30px;
            bottom: 0;
            width: calc(~"100% + 40px");
            border-radius: 2px;
            margin-left: -20px;
            border-top: 1px solid #e6e6e6;
            background: #fff;
            line-height: 20px;
            text-align: center;
        }
    }
</style>
