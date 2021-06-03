<!-- 可靠性故障列表 -->
<template>
	<div>

		<base-Agrid class="ag-theme-balham asms-single-action-button-grid" :columnDefs="columnDefs" :actUrl="'maintenanceDefect/defectRepetitiveMultipleApi/queryList'" :noFloatingFilter="true" :notShowOkCancel="true" :enableServerSideFilter="true" ref="reliableList">
		</base-Agrid>
	</div>
</template>

<script>
import Vue from "vue";
import { formatDate } from '../../common/js/util/date.js'

export default {
	name: "reliableList",
	components: {
		"base-Agrid": function (resolve) {
			return require(["../agGrid/baseAgGrid.vue"], resolve);
		},
	},

	props: {},

	data() {
		return {
			nrcEditVisiable: [],
			columnDefs: [
				{
					headerName: '索引',
					field: "index",
					width: 60, suppressSorting: true, suppressResize: true, suppressFilter: false,
					valueGetter: params => params.node.rowIndex + 1,

				},
				{ headerName: '操作', field: 'operator', width: 60, cellRenderer: this.oprateCellRenderer },
				{ headerName: '编号', field: "faultNo", width: 110, suppressFilter: true, cellRenderer: this.mulNoOprateCell },
				{ headerName: '版本号', field: "revNo", width: 60, suppressFilter: true, },
				{ headerName: '技术通告单', field: "noticeNo", width: 110, suppressFilter: true, },
				{ headerName: '机型', field: "model", width: 110, suppressFilter: true, },
				{ headerName: '章节', field: "ata", width: 80, suppressFilter: true, },
				{ headerName: '创建时间', field: "createTime", width: 110, suppressFilter: true, valueFormatter: this.dateFormatter },
				{ headerName: 'Found Date（Min）', field: "foundDateMin", width: 110, suppressFilter: true, valueFormatter: this.dateFormatter },
				{ headerName: 'Found Date（Max）', field: "foundDateMax", width: 110, suppressFilter: true, valueFormatter: this.dateFormatter },
				{ headerName: '核对结果', field: "verifyResult", width: 80, suppressFilter: true },
				{ headerName: '状态', field: "status", width: 80, suppressFilter: true },
				{ headerName: '备注', field: "remark", width: 110, suppressFilter: true },
			]
		};
	},

	computed: {},

	watch: {},

	created() { },

	mounted() {
		this.bus.$on("multiDefectList", () => {
			if (this.$refs.reliableList) {
				this.refreshList();
			}
		});
	},

	destroyed() { },

	methods: {
		mulNoOprateCell(params) {
			console.log(params)
			let _that = this;
			if (!params || !params.data) {
				return "";
			}
			let rowOperate = Vue.extend({
				template:
					' <a class="viewLink" @click.stop="handleOperate()">' +
					params.value +
					"</a>",
				methods: {
					handleOperate: function () {
						_that.view(params, "view");
					}
				}
			});
			let component = new rowOperate().$mount();
			return component.$el;
		},
		dateFormatter(obj) {
			return formatDate(obj.value, "yyyy-MM-dd hh:mm:ss");
		},
		view(params, viewMode) {
			let drc = '多发性故障查看';
			//设置可见性
			this.$emit(
				"page",
				drc,
				function (resolve) {
					require(["./multiDefectDetail.vue"], resolve);
				},
				{ id: params.data.id, method: viewMode }
			);

		},
		oprateCellRenderer(params) {
			let _this = this;
			// if (!params || !params.data) {
			//     return "";
			// }
			let rowOperate = Vue.extend({
				template: '<div style="display: flex; justify-content:space-around; height:28px; line-height:28px"> <i class="el-icon-edit" style="cursor:pointer; height:28px; line-height:28px" @click="editOneLine">&nbsp;&nbsp;&nbsp;</i></div>',
				methods: {
					editOneLine() {
						_this.view(params, 'edit');
					}
				}
			});
			let component = new rowOperate().$mount();
			return component.$el;
		},
		refreshList() {
			this.$refs.reliableList.reloadData();
		},
		addnrcItem() {
			this.nrcEditVisiable = true;
		},
		handleEditNrcSave() {
			this.nrcEditVisiable = false;
			this.refreshList()

		},
		handleEditNrcClose() {
			this.nrcEditVisiable = false;
		},
		statusFormatter(parmas) {
			if (!parmas || !parmas.value) {
				return "";
			}
			return this.$dicTool().getValName('NrcSetting.nrcStatus', parmas.value)
		},
		valueformatted(params) {
			if (params.value == "0") {
				return this.$t("yesOrNo.no");
			}
			if (params.value == "1") {
				return this.$t("yesOrNo.yes");
			}
		},
		//NRC 重要修理/改装
		showformatted(params) {
			if (params.value == "1") {
				return this.$t("importantOrGeneral.general");
			}
			if (params.value == "2") {
				return this.$t("importantOrGeneral.important");
			}
		},
	}
};
</script>
<style  scoped>
</style>
