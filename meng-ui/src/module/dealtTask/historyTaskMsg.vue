<template>
    <div class="his-Msg">
<!--        <base-Agrid class="ag-theme-balham asms-single-action-button-grid"-->
<!--                    :columnDefs="columnDefs" :params="queryParam"-->
<!--                    :actUrl="tabUrl" :noFloatingFilter="true"-->
<!--                    :notShowOkCancel="true" @rowClick="void 0"-->
<!--                    :enableServerSideFilter="true" ref="taskTab">-->
<!--        </base-Agrid>-->
        <local-grid :columnDefs="columnDefs" :height="200" :rowData="hisTabList" ref="addDefectList"></local-grid>
    </div>
</template>

<script>
    export default {
        name: '',
        props: {
            procInstId:String
        },
        data() {
            return {
                tabUrl:'/api/v1/plugins/WS_FLOW_HIS_TASK_LIST',
                queryParam:[],
                hisTabList:[],
                columnDefs:[
                    { headerName: '任务ID', field: "TASK_ID", width: 80,suppressFilter:true,},
                    { headerName: '任务名称', field: "TASK_NAME", width: 110, suppressFilter:true},
                    { headerName: '开始时间', field: "START_TIME", width: 110,  suppressFilter:true},
                    { headerName: '完成时间', field: "END_TIME", width: 110,  suppressFilter:true},
                    { headerName: '耗时', field: "DURATION", width: 120,  suppressFilter:true, cellRenderer:(params) => {
                       let time = !!params.value?params.value:params.data.DURATION_0
                            if(time<1000)return params.value+'毫秒'
                            function getDuration(my_time) {
                                let days = my_time / 1000 / 60 / 60 / 24 ;
                                let daysRound =  Math.floor(days)>0?(Math.floor(days)+'天'):'';
                                let hours = my_time / 1000 / 60 / 60 - (24 * Math.floor(days));
                                let hoursRound = Math.floor(hours)>0?(Math.floor(hours)+'时'):'';
                                let minutes = my_time / 1000 / 60 - (24 * 60 * Math.floor(days)) - (60 * Math.floor(hours));
                                let minutesRound = Math.floor(minutes)>0?(Math.floor(minutes) + '分'):'';
                                let seconds = my_time / 1000 - (24 * 60 * 60 * Math.floor(days)) - (60 * 60 * Math.floor(hours)) - (60 * Math.floor(minutes));
                                let secondsRound = Math.floor(seconds)>0?(Math.floor(seconds) + '秒'):'';
                                return daysRound + hoursRound + minutesRound + secondsRound;
                            }
                            return getDuration(time)
                        }
                    },
                    { headerName: '办理人员', field: "OPERATOR_UNAME", width: 110,  suppressFilter:true},
                    { headerName: '审批意见', field: "TASK_NOTES", width: 110,  suppressFilter:true},
                ],
            }
        },
        mounted(){
          // this.queryParam.push({procInstId:this.procInstId})
            this.$httpExt().get(this.tabUrl, {rows:100,page:1,procInstId:this.procInstId}, 'form').then(response => {
                    this.hisTabList = response.data
                    // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
                })
                .catch(err => {
                    this.$message.error(err.errorMessage || err.msg || err);
                });
        },
        watch: {},
        methods: {},
        components: {
            "base-Agrid": function (resolve) {
                return require(["../agGrid/baseAgGrid.vue"], resolve);
            },
        }
    }
</script>

<style scoped type="text/less" lang="less">
.his-Msg{
    height: 100%;
    overflow: hidden;
}
</style>
