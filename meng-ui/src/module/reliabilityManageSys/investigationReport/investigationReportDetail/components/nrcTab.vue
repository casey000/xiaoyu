<template>
    <div>
        <h5 class="tab-title">nrc信息
            <el-button v-if="otherParams.method !== 'view'" type="primary" @click="showDialog=true">增加</el-button>
        </h5>
        <local-grid :columnDefs="tabColumn" :height="200" :rowData="tabData" ref="defectList"></local-grid>
        <el-dialog title="nrc信息新增" :visible.sync="showDialog" width="60%" :before-close="handleClose">
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
                type:'nrc',
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
                    { headerName: 'NRC编号', field: "defectNo", width: 100, suppressFilter: true },
                    {
                        headerName: '报告日期',
                        field: "creatTime",
                        width: 140, suppressSorting: true, suppressResize: true, suppressFilter: false,
                        valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss"),

                    },
                    { headerName: '飞机号', field: "acNo", width: 100, suppressFilter:true},
                    { headerName: '航站', field: "station", width: 100, suppressFilter:true},
                    { headerName: '缺陷描述', field: "defectDesc", width: 100, suppressFilter:true},
                    { headerName: '关联故障', field: "nrcNo", width: 100, suppressFilter:true},
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
                    { headerName: 'NRC编号', field: "defectNo", width: 100, suppressFilter: true },
                    {
                        headerName: '报告时间',
                        field: "creatTime",
                        width: 140, suppressSorting: true, suppressResize: true, suppressFilter: false,
                        valueGetter: params => formatDate(params.value, "yyyy-MM-dd hh:mm:ss"),

                    },
                    { headerName: '机型', field: "model", width: 100, suppressFilter: true },
                    { headerName: '飞机号', field: "aircraft", width: 100, suppressFilter: true },
                    { headerName: '章节号', field: "ata", width: 100, suppressFilter: true },
                    { headerName: '航站', field: "dateAction", width: 100, suppressFilter: true },
                    { headerName: '缺陷描述', field: "type", width: 100, suppressFilter: true },
                    { headerName: '关联故障', field: "description", width: 100, suppressFilter: true },
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
