export default {
    methods: {
        addOrUpdate() {
            let data = {
                techId: this.otherParams.id,
                ...this.form
            }
            let url = this.apiData[this.pageCode + this.showAlert]
            this.$httpExt().post(url, data, 'gateway').then(response => {
                this.showDialog = false
                this.query(this.otherParams.id)
                // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
            }).catch(err => {
                this.showDialog = false
                this.$message.error(err.errorMessage || err.msg || err);
            })
        },
        delete(param) {
            this.$confirm('确认删除此行', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                this.$httpExt().post(this.apiData[this.pageCode + 'Delete'] + '?id=' + param.id, {}, 'gateway').then(res => {
                    this.$message({
                        type: 'success',
                        message: this.title + '删除成功!'
                    });
                    this.query(this.otherParams.id)
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
        query(id) {
            let url = this.apiData[this.pageCode + 'Query'] + '?techId=' + id
            this.$httpExt().get(url, null, 'gateway').then(response => {
                    this.tabData = response.obj
                })
                .catch(err => {
                    this.$message.error(err.errorMessage || err.msg || err);
                });
        }
    }
}