<!-- 基础baseAgGrid -->
<template>
	<div>
		<ag-grid class="ag-theme-balham asms-ag-grid-height"
                 :gridOptions="gridOptions"
                 :columnDefs="columnDefs"
                 :cellDoubleClicked="onCellDoubleClicked"
                 @rowSelected="onRowSelected"
                 ref="grid"
                 @gridReady="onGridReady"
                 :cacheBlockSize="20"
                 @rowClicked="onRowClicked"
                 :suppressRowClickSelection="suppressRowClickSelection">
		</ag-grid>
		<div style="display: flex; justify-content: space-between; align-items:center">
			<div style="scroll-pagenation">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" @prev-click="goToPrePage" @next-click="goToNextPage" :current-page.sync="currentPage" :pager-count="5" :page-sizes="[5,10,20,100, 200, 300, 400]" :page-size="gridOptions.paginationPageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalSize*1">
				</el-pagination>
			</div>
			<div v-if="!notShowOkCancel">
				<el-button style="margin-top:20px" type="primary" size="small" @click="confirm" :disabled="!currentSelectData.length">
					确定
				</el-button>
				<el-button style="margin-top:20px" size="small" @click="$emit('cancelSelect')">
					取消
				</el-button>
			</div>
		</div>

	</div>
</template>

<script>


export default {
	name: "baseAgGrid",
	data() {
		return {
			gridOptions: {},                 //
			currentPage: 1,
			totalSize: 0,
			pageSize: 20,
			selectData: {},
			currentSelectData: [],
			confirmFlag: 0,
		};
	},

	props: {
		value: [Object, Array],
		columnDefs: Array,
		actUrl: String,
		postType:String,
		multiSelect: Boolean,
		rowModelType: String,
		enableServerSideFilter: Boolean,
		noFloatingFilter: Boolean,
		params: [Object, Array],
		notShowOkCancel: Boolean,
		suppressRowClickSelection: Boolean
	},

	components: {

	},

	computed: {

	},
	beforeCreate() {

	},
	created() {

		this.gridOptions.columnTypes = {
			'medalColumn': { width: 100, columnGroupShow: 'open', suppressFilter: true },
			'nonEditableColumn': { editable: false },
			'dateColumn': {
				filter: 'date',
				filterParams: {
					comparator: function (filterLocalDateAtMidnight, cellValue) {
						const dateParts = cellValue.split('-');
						const day = Number(dateParts[2]);
						const month = Number(dateParts[1]) - 1;
						const year = Number(dateParts[0]);
						const cellDate = new Date(year, month, day);
						// Now that both parameters are Date objects, we can compare
						if (cellDate < filterLocalDateAtMidnight) {
							return -1;
						} else if (cellDate > filterLocalDateAtMidnight) {
							return 1;
						} else {
							return 0;
						}
					}
				}
			}
		}
		this.dataManager = this.$agGrid2.init(this.actUrl, this);
		this.gridOptions = this.dataManager.gridOptions;
		this.gridOptions.floatingFilter = !this.noFloatingFilter;
		this.columnDefs.forEach(item => {
			item.filterParams = { caseSensitive: true, clearButton: true, suppressAndOrCondition: true, };
		});
	},
	beforeMount() {
		if (this.multiSelect) {
			this.gridOptions.rowSelection = 'multiple';
			this.gridOptions.rowMultiSelectWithClick = true;
		} else {
			this.gridOptions.rowSelection = 'single';
		}

	},
	mounted() {
		// console.log(this.dataManager,'this.dataManager')
		// console.log(this.params,'this.params')
		this.dataManager.loadData(this.params);
		this.gridOptions.postType = this.postType;

	},

	methods: {
		onRowClicked(event) {
			// console.log(event.node.data)
			this.$emit('rowClick', event.node.data);
		},
        getSelect() {
            let checkList = this.gridOptions.api.getSelectedRows();
            return checkList
        },
		handleSizeChange(val) {
			this.gridOptions.api.paginationSetPageSize(Number(val));
		},
		handleCurrentChange(val) {
			this.gridOptions.api.paginationGoToPage(val - 1);
		},
		goToPrePage(currentPage) {
			this.gridOptions.api.paginationGoToPreviousPage();
		},
		goToNextPage(currentPage) {
			this.gridOptions.api.paginationGoToNextPage();
		},
		onCellDoubleClicked(data) {
			if (!this.multiSelect) {
				this.selectData = data.data;
			}
		},
		onRowSelected(data) {
			// console.log(data);
			if (data.node.isSelected()) {
				// console.log(1)
				this.currentSelectData.push(data.data);
			} else {
				let indexOfData = this.currentSelectData.indexOf(data.data);
				this.currentSelectData.splice(indexOfData, 1);
			}
		},
		onGridReady(params) {
			if (this.calculateWidth()) {
				params.api.sizeColumnsToFit();
			}
		},
		confirm() {
			this.confirmFlag = 1;
			this.multiSelect ? this.selectData = this.currentSelectData.slice(0) : this.selectData = this.currentSelectData[0];
		},
		reloadData(colParams, otherParams) {
			this.currentSelectData = [];
			this.dataManager.loadData(colParams, otherParams);
			this.currentPage = 1;

		},
		getFilterModel() {
			let asmsFilterModel = [];
			let filterModel = this.gridOptions.api.getFilterModel();
			let key = ''
			for (key in filterModel) {
				let value = filterModel[key];
				value['filterName'] = key;
				asmsFilterModel.push(value);
			}
			return asmsFilterModel;
		},
		calculateWidth() {
			let totalWidth = 0;
			this.columnDefs.forEach(element => {
				totalWidth += element.width;
			});
			// console.log(this.$el.clientWidth);
			return this.$el.clientWidth > totalWidth;
		},
		resizeCellWidth() {
			if (this.calculateWidth()) {
				this.gridOptions.api.sizeColumnsToFit();
			}
		},
		selectAllAmerican() {
			this.gridOptions.api.forEachNode(function (node) {
				if (node.data.country === 'United States') {
					node.setSelected(true);
				}
			});
		}
	},
	watch: {
		value: function (val) {
			this.aircraft = val
		},
		selectData: function (val) {
			this.$emit('input', val)
			console.log("==================emit================")
			if (this.confirmFlag) {
				setTimeout(() => {
					this.$emit("confirmSelect")
					this.confirmFlag = 0;
				}, 0);
			}
		},
		currentSelectData: function (newVal, oldVal) {
			let data = this.$deepCopy(newVal)
			this.$emit("changeSelect", data)
		},
		columnDefs: function (val) {
			val.forEach(item => {
				item.filterParams = { caseSensitive: true, clearButton: true, suppressAndOrCondition: true, };
			});
		}
	}
}

</script>
<style  scoped>
.asms-ag-grid-height {
	height: calc(100% - 52px);
}
.scroll-pagenation {
	overflow-x: scroll;
	overflow-y: hidden;
}
.scroll-pagenation::-webkit-scrollbar {
	width: 0 !important;
}
</style>
