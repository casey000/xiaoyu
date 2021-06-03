<template>
    <div>
        <el-row v-for="(item,index) in topDetailList" :key="index">
            <el-col :span="it.wid" v-for="(it,num) in item" :key="num">
                <el-form-item :label="it.name">
                    <span v-if="it.isType">{{baseInfo[it.prop]}}</span>
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
                    [{ wid: 6, prop: 'businessNo', name: '编号：', isTime: false, isType: true }
                        , { wid: 6, prop: 'wgTeam', name: '相关通告单/报警单：', isTime: false }
                        , { wid: 6, prop: 'type', name: '调查类型：', isTime: false }
                        , { wid: 6, prop: 'ata', name: '调查期限：', isTime: false }],
                    [{ wid: 24, prop: 'title', name: '标题：', isTime: false }],
                    [{ wid: 6, prop: 'model', name: '机型：', isTime: false },
                        { wid: 6, prop: 'aircraft', name: '飞机号：：', isTime: false },
                        { wid: 6, prop: 'wgTeam', name: '章节号：', isTime: false },
                        { wid: 6, prop: 'wgTeam', name: 'WG小组：', isTime: false }]
                ],
            }
        },
        methods: {},
        components: {}
    }
</script>

<style scoped type="text/less" lang="less">

</style>
