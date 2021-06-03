export default {
    props: {
        otherParams: Object,
    },
    data() {
      return {
          showAlert: '',
          showDialog: false,
          tabData: [],
      }
    },
    mounted() {
        this.getData();
        if(this.otherParams.method === 'view'){
            this.conDicMeasureColumn.splice(1,1)
        }
    },
    methods: {
        toAdd() {
            this.showAlert = 'add'
            this.showDialog = true
            for(let key in this.formInfo){
                this.formInfo[key] = Array.isArray(this.formInfo[key])?[]:null
            }
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => {
                });
        },
        //相关文件措施表格查询
        getData() {
            let url = this.apiJson.getData + this.otherParams.id
            this.$httpExt().get(url, undefined, 'gateway').then(response => {
                    this.tabData = response.obj
                })
                .catch(err => {
                    this.$message.error(err.errorMessage || err.msg || err);
                });
        },
        // 相关文件措施延期编辑确认
        rowSubmit() {
            this.$refs.submitForm.validate((valid) => {
                if (valid) {
                    let url = this.apiJson.rowSubmit
                    this.$httpExt().post(url, {
                        ...this.formInfo,
                        warningId: this.otherParams.id
                    }, 'gateway').then(response => {
                            this.showDialog = false
                            this.$message.success(`相关文件${this.showAlert === 'edit' ? '编辑' : '增加'}成功`)
                            this.getData()
                            // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
                        })
                        .catch(err => {
                            this.showDialog = false
                            this.$message.error(err.errorMessage || err.msg || err);
                        });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
        //*相关文件措施编辑
        editRow(param) {
            this.showAlert = 'edit';
            this.showDialog = true
            for(let key in this.formInfo){
                this.formInfo[key] = param.data[key]
            }
        },
        //*相关文件删除
        delRow(param) {
            let _this = this
            this.$confirm('确认删除此行', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(() => {
                _this.$httpExt().get(this.apiJson.delRow + param.data.id, {}, 'gateway').then(res => {
                    _this.$message({
                        type: 'success',
                        message: this.name+'删除成功!'
                    });
                    _this.getData()
                }).catch(err => {
                    _this.$message.error(err.errorMessage || err.msg || err);
                })

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        //确认编辑或添加
        updateSubmit() {
            this.$refs.conDicTab.validate((valid) => {
                if (valid) {
                    let url = this.apiJson.updateSubmit
                    this.$httpExt().post(url, {
                        ...this.formInfo,
                        warningId: this.otherParams.id
                    }, 'gateway').then(response => {
                        this.showDialog = false
                        this.getData()

                        // console.log(this.dateFormat(this.baseInfo.foundDateMin,"yyyy-MM-dd hh:mm:ss"))
                    }).catch(err => {
                        this.showDialog = false
                        this.$message.error(err.errorMessage || err.msg || err);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
    },
}