<template>
    <div class="meet-detail">
        <h4>
            <span>
				<el-button type="primary" @click="keepData()">保存</el-button>
				<el-button type="primary" @click="submitData()">提交</el-button>
			</span>
        </h4>
        <el-row class="search-model">
            <el-row>
                <el-col :span="6">
                    <el-col class="font-label"><label>会议日期：</label></el-col>
                    <el-col :span="12">
                        <el-date-picker
                                v-model="value1"
                                type="date"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col class="font-label"><label>会议类型：</label></el-col>
                    <el-col :span="12">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col class="font-label"><label>WG小组：</label></el-col>
                    <el-col :span="12">
                        <el-select v-model="value" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-col>
                <el-col :span="6">
                    <el-col class="font-label"><label>会议编号：</label></el-col>
                    <el-col :span="12">

                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-row>
                    <el-col :span="6">
                        <el-col class="font-label"><label>会议地点：</label></el-col>
                        <el-col :span="12">
                            <el-input></el-input>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-col class="font-label"><label>参会人：</label></el-col>
                        <el-col :span="12">
                            <el-input></el-input>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="18">
                        <el-col class="font-label"><label>缺席人：</label></el-col>
                        <el-col :span="12">
                            <el-input></el-input>
                        </el-col>
                    </el-col>
                </el-row>
            </el-row>
        </el-row>
        <el-row>
            <topic-info :otherParams="otherParams" :height="200"></topic-info>
        </el-row>
        <el-row>
            <resolve-info :otherParams="otherParams" :height="200"></resolve-info>
        </el-row>
    </div>
</template>

<script>
    import topicInfo from './components/topicInfo'
    import resolveInfo from './components/resolveInfo'
    export default {
        name: '',
        props: ['otherParams'],
        data() {
            return {
                value1:'',
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                value: ''
            }
        },
        mounted() {
            console.log(this)
        },
        watch: {},
        methods: {},
        components: {
            topicInfo,
            resolveInfo
        }
    }
</script>

<style scoped type="text/less" lang="less">
    .meet-detail {
        height: 100%;
        overflow-y: auto;
        .search-model{
            .font-label{
                font-size: 12px;
                line-height: 40px;
                width: 80px;
                text-align: right;
            }
            >div{
                >div{
                    margin-bottom: 10px;
                }
            }

        }

        h4 {
            padding-left: 10px;
            overflow: hidden;

            > span {
                float: right;
                margin-right: 20px;
            }
        }
    }
</style>
