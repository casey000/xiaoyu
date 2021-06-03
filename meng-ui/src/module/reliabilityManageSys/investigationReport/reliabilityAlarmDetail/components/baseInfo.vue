<template>
    <div>
        <el-row v-for="(item,index) in topDetailList" :key="index">
            <el-col :span="it.wid" v-for="(it,num) in item" :key="num">
                <el-form-item :label="it.name">
                    <span v-if="it.isType">{{typeIntro[baseInfo[it.prop]]}}</span>
                    <span v-else-if="it.isTime">{{baseInfo[it.prop] | dateFormat("yyyy-MM-dd hh:mm:ss")}}</span>
                    <span v-else>{{baseInfo[it.prop]}}</span>
                </el-form-item>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            baseInfo:Object
        },
        data() {
            return {
                topDetailList: [
                    [{ wid: 8, prop: 'type', name: '类型：', isTime: false, isType: true }
                        , { wid: 8, prop: 'ata', name: '章节号：', isTime: false }
                        , { wid: 8, prop: 'sourceId', name: '来源编号：', isTime: false }],
                    [{ wid: 8, prop: 'warningNo', name: '可靠性告警单编号：', isTime: false }
                        , { wid: 8, prop: 'sourceId', name: '关联技术通告单：', isTime: false }
                        , { wid: 8, prop: 'wg', name: 'WG小组：', isTime: false }],
                    [{ wid: 8, prop: 'defectTimes', name: '故障报告次数：', isTime: false },
                        { wid: 8, prop: 'reason', name: '飞机号：', isTime: false }]
                ],
                typeIntro: {
                    ATA: '故障率超限',
                    PRE: '冬雨季故障率超限',
                    PART: '部件拆换率超限',
                    TECH: '技术通告'
                },
            }
        },
        methods: {},
        components: {}
    }
</script>

<style scoped type="text/less" lang="less">

</style>
