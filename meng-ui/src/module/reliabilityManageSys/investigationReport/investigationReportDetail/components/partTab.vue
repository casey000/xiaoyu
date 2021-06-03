<template>
    <div>
        <h5 class="tab-title">部件信息
            <el-button v-if="otherParams.method !== 'view'" type="primary" @click="showDialog=true">增加</el-button>
        </h5>
        <local-grid :columnDefs="tabColumn" :height="200" :rowData="tabData" ref="defectList"></local-grid>
        <el-dialog title="部件信息新增" :visible.sync="showDialog" width="60%" :before-close="handleClose">
            <div style="height: 300px">
                <base-Agrid class="ag-theme-balham asms-single-action-button-grid" :columnDefs="alertTabColumn" :params="[]" actUrl="/maintenanceDefect/defectBaseInfoViewApi/queryList" :noFloatingFilter="true" :notShowOkCancel="true" ref="relMainTab" :enableServerSideFilter="true">
                </base-Agrid>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button @click="showDialog = false">取 消</el-button>
				<el-button type="primary" @click="submit()">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
    import Vue from "vue";
    import  mixin from './mixins/defctNrcCcmixin'
    import { formatDate } from '../../../../../common/js/util/date.js'
    export default {
        mixins:[mixin],
        data() {
            let vm = this
            return {
                type:'cc',
                tabColumn: [
                    {
                        headerName: '序号',
                        field: "index",
                        width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
                        valueGetter: params => params.node.rowIndex + 1,

                    },
                    {
                        headerName: '操作', field: "status", width: 80, cellRenderer: (params) => {
                            //1,2不能操作
                            //多发性重复性可操作控制archiveStatus1:已归档,2:失效不可编辑
                            let rowOperate = Vue.extend({
                                template: `<div style="display: flex; justify-content:space-around; height:28px; line-height:28px">
                              <i class="el-icon-delete" style="cursor:pointer; height:28px; line-height:28px" @click="deleteRow">&nbsp;&nbsp;&nbsp;</i>
                        </div>`,
                                methods: {
                                    deleteRow() {
                                        vm.delete(params);
                                    }
                                }
                            });
                            let component = new rowOperate().$mount();
                            return component.$el;
                        }
                    },
                    { headerName: '相关文件', field: "defectNo", width: 100, suppressFilter: true },
                    { headerName: 'CC编号', field: "ccNo", width: 100, suppressFilter: true },
                    { headerName: '类型', field: "model", width: 100, suppressFilter: true,cellRenderer: (params) => {
                       switch (params.value*1) {
                           case 1:
                               return '单拆';
                           case 2:
                               return '单装';
                           case 3:
                               return '拆装';
                           case 4:
                               return '对串';

                       }
                    }
                    },
                    { headerName: '拆下机号', field: "offPn", width: 100, suppressFilter: true },
                    { headerName: '件号', field: "model", width: 100, suppressFilter: true },
                    { headerName: '序号', field: "offSn", width: 100, suppressFilter: true },
                    { headerName: '部件名称', field: "partNameCh", width: 100, suppressFilter: true },
                    { headerName: 'TSR', field: "tsr", width: 100, suppressFilter: true },
                    { headerName: 'TSI', field: "description", width: 100, suppressFilter: true },
                    { headerName: '上次修理厂', field: "dateAction", width: 100, suppressFilter: true },
                    { headerName: '送修报告', field: "type", width: 100, suppressFilter: true },
                    { headerName: 'FH', field: "type", width: 100, suppressFilter: true },
                ],
                alertTabColumn: [
                    {
                        headerName: '',//选择列头部显示的文字，可以为空
                        checkboxSelection: true,//设置为ture显示为复选框
                        headerCheckboxSelection: true, //表头是否也显示复选框，全选反选用
                        sortable: false,
                        suppressFilter: false,
                        width: 80 //列的宽度
                    },
                    { headerName: '相关文件', field: "relationNo", width: 100, suppressFilter: true },
                    { headerName: 'CC编号', field: "defectNo", width: 100, suppressFilter: true },
                    { headerName: '类型', field: "ccNo", width: 100, suppressFilter: true },
                    { headerName: '飞机号', field: "acNo", width: 100, suppressFilter: true },
                    { headerName: '拆下机号', field: "agNo", width: 100, suppressFilter: true },
                    {
                        headerName: '拆下时间',
                        field: "creatTime",
                        width: 140, suppressSorting: true, suppressResize: true, suppressFilter: false,
                        valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss"),

                    },
                    { headerName: '拆下机型', field: "model", width: 100, suppressFilter: true },
                    { headerName: '章节号', field: "ata", width: 100, suppressFilter: true },
                    { headerName: '原因', field: "dateAction", width: 100, suppressFilter: true },
                    { headerName: '部件名称', field: "dateAction", width: 100, suppressFilter: true },
                    { headerName: '件号', field: "type", width: 100, suppressFilter: true },
                    {
                        headerName: '序号',
                        field: "index",
                        width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
                        valueGetter: params => params.node.rowIndex + 1,

                    }
                ],
            }
        },
    }
</script>

<style scoped type="text/less" lang="less">
    .tab-title {
        /*font-size: 12px;*/
        box-sizing: border-box;
        line-height: 30px;
        padding: 10px;
        margin: 0;
        width: 100%;
        overflow: hidden;

        /deep/ label {
            margin-left: 10px;
            margin-right: 15px;
        }

        > button {
            float: right;
            margin-right: 20px;
        }
    }
</style>
