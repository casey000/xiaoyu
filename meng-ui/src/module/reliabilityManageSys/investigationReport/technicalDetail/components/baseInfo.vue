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
                    [{ wid: 8, prop: 'sourceNo', name: '编号：', isTime: false, isType: false }
                        , { wid: 8, prop: 'wgTeam', name: 'WG小组：', isTime: false }
                        , { wid: 8, prop: 'ata', name: '章节号：', isTime: false }],
                    [{ wid: 8, prop: 'sourceType', name: '类型：', isTime: false, isType: true }
                        , { wid: 8, prop: 'sourceNo', name: '事件编号：', isTime: false }
                        , { wid: 8, prop: 'defectTimes', name: '故障报告次数：', isTime: false }],
                    [{ wid: 8, prop: 'model', name: '机型：', isTime: false },
                        { wid: 8, prop: 'acMsn', name: '飞机号：', isTime: false }]
                ],
                typeIntro: {
                    1:"多发性故障",2:"重复性故障",3:"EWIS",4:"油液渗漏",5:"SDR事件",6:"不正常事件"
                },
            }
        },
        methods: {},
        components: {}
    }
</script>

<style scoped type="text/less" lang="less">

</style>
