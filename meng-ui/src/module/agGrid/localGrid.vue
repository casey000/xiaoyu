<!-- 基础baseAgGrid -->
<template>
	<div class="local-grid">
		<ag-grid class="ag-theme-balham asms-ag-grid-height" :columnDefs="columnDefs" :gridOptions="options" ref="grid" @gridReady="onGridReady" :rowData="rowData" :suppressScrollOnNewData="suppressScrollOnNewData" :style="setStyle" id="gridgrid">
		</ag-grid>
		<div class="clearfloat"></div>
	</div>
</template>

<script>


export default {
	name: "localGrid",
	data() {
		return {
			resize: null,

		};
	},

	props: {
		columnDefs: Array,
		rowData: Array,
		height: Number,
		autoWidth: Boolean,
		gridOptions: Object,
		suppressScrollOnNewData: Boolean,
	},

	components: {
		
	},

	computed: {
        setStyle() {
            return {height:(this.height > 0?this.height:200)+'px'}
        },
		// 表格配置
        options() {
            let json = {
                enableColResize: true,
                enableCellTextSelection: true,
                ensureDomOrder: true,
            }
            return this.gridOptions?{...this.gridOptions,...json}:json;
        }
	},
	methods: {
		onGridReady(params) {
			this.calculateWidth()
			if (this.autoWidth || this.calculateWidth()) {
				params.api.sizeColumnsToFit()
			}

		},
		// 计算表格的宽度
		calculateWidth() {
			let totalWidth = 0;
			this.columnDefs.forEach(element => {
				totalWidth += element.width;
			});
			return this.$el.clientWidth > totalWidth;
		}
	},
	watch: {

	}
}

</script>
<style  scoped>
.local-grid {
	overflow: auto;
}
.clearfloat {
	clear: both;
}
</style>
