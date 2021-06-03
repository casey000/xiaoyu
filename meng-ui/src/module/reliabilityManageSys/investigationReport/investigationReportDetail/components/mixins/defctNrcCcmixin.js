
import apiData from '../../../../../../api/investigationReport/detailApi'
export default {
    name: '',
    components: {
        "base-Agrid": function (resolve) {
            return require(["../../../../../agGrid/baseAgGrid.vue"], resolve);
        },
    },
    props: {
        otherParams: Object,
    },
    data() {
        let vm = this
        return {
            apiData:apiData.investigationReport,
            radio: '',
            rowId: '',
            showDialog: false,
            tabData: [],
        }
    },
    mounted() {
        // this.mainGetData(this.otherParams.id);
        if(this.otherParams.method === 'view')this.tabColumn.splice(1,1)
    },
    methods: {
        toAdd() {
            this.showDialog = true
            this.$nextTick(() => this.$refs.relMainTab.reloadData())
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },
        freshData(data){
            this.tabData = data
        },
        // 故障信息新增确认
        submit() {
            let noList = this.$refs.relMainTab.getSelect().map(item => item.defectNo)
            let idList = this.$refs.relMainTab.getSelect().map(item => item.id)
            if (idList.length === 0) return this.$message.error('请先选择方案')
            let url = this.apiData.topAddUrl
            this.$httpExt().post(url, [{
                id:null,
                relationType:this.type,
                relationNo:idList.join(','),
                relationId:noList.join(','),
                parentId: this.otherParams.id
            }], 'gateway').then(response => {
                    // this.tabData = response.obj
                    this.showDialog = false
                    this.mainGetData(this.otherParams.id)
                    // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
                })
                .catch(err => {
                    this.showDialog = false
                    this.$message.error(err.errorMessage || err.msg || err);
                });
        },
        //*故障信息删除
        delete(param) {
            let data={
                "id": param.data.id,
                "parentId": 0,
                "relationType": this.type,
                "relationNo": param.data.relationNo,
                "relationId": param.data.relationId
            }
            this.$confirm('确认删除此行', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$httpExt().post(this.apiData.topDeleteUrl, data, 'gateway').then(res => {
                    this.mainGetData(this.otherParams.id)
                    this.$message({
                        type: 'success',
                        message: '故障信息措施删除成功!'
                    });
                }).catch(err => {
                    this.$message.error(err.errorMessage || err.msg || err);
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    }
}