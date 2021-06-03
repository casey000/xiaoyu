function toLowerLine(str) {
    let temp = str.replace(/[A-Z]/g, function (match) {
        return "_" + match.toLowerCase();
    });
    if(temp.slice(0,1) === '_'){ //如果首字母是大写，执行replace时会多一个_，这里需要去掉
        temp = temp.slice(1);
    }
    return temp;
}
function agGridDataManager() {
    let _this = this;
      this.otherFilterNotInColumnDef = [];
    var dataSource = {
        rowCount: 0, // behave as infinite scroll
        getRows(params){
            let {startRow,endRow,filterModel,sortModel} = params;
            // console.log(params)
            let keys = Object.keys(filterModel);
            // console.log(filterModel)
            let values = Object.values(filterModel);
            let newFilterModels = [];
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index];
                const data = values[index];
                let value = {
                    column:'',
                    type:'',
                    value:''
                }
                let newFilterModel = {column:key};
                value.column = toLowerLine(key)
                let indexKey=key.lastIndexOf("_1");
                if(indexKey!==-1){
                     newFilterModel = {column:key.substring(0,indexKey)};
                }
                //console.log(newFilterModel)
                if (value.filterType == 'text') {
                    value.filter = data.filter.replace(/(^\s*)|(\s*$)/g, "");
                }
                if (value.type == 'contains') {
                    value.type = 'like';
                }
                if (value.type == 'equals') {
                    value.type = 'eq';
                }
                let typeManage={
                    contains:'like',
                    notContains:'notlike',
                    equals:'eq',
                    notEqual:'ne',
                    startsWith:'leftlike',
                    endsWith:'rightlike',
                    inRange:'between',
                    greaterThan:'datege',
                    lessThan:'datele',
                }
                value.type = data.type
                value.value =data.value===0?0:(data.filter+''|| data.value+'');
                if(data.filterType==='date'){
                    value.value = data.dateFrom
                    if(data.type==='inRange'){
                    value.value = data.dateFrom+','+data.dateTo
                    }
                }
                // delete value.filter;
                // delete value.filterType;

                Object.assign(newFilterModel,value);
                newFilterModels.push(newFilterModel);
            } 
            newFilterModels = newFilterModels.concat(_this.otherFilterNotInColumnDef);
            if(sortModel.length){
                let sortKeyIndex=sortModel[0].colId.lastIndexOf("_1");
                if(-1!==sortKeyIndex){
                    let sortKey =sortModel[0].colId.substring(0,sortKeyIndex);
                    sortModel[0].colId =sortKey;
                }
            }
            let pageInfo = {startRow,endRow,filterModel:newFilterModels,sortModel}; 
            _this.pageView.loading = true;
            var _sortModel = {};
            if(sortModel && sortModel.length>0){
                _sortModel['sort'] = toLowerLine(sortModel[0].colId);
                _sortModel['order'] = sortModel[0].sort;
            }
            setTimeout(() => {
                let postParams = [...newFilterModels,..._this.pageView.params]
                let _postType = _this.gridOptions.postType || 'table';
                _this.pageView.$httpExt().post(_this.actionUrl, {page: _this.pageView.currentPage,rows:20,queryParam:postParams,..._sortModel}, _postType).then(function (data) {
                var _pageInfo = data.obj;
                var lastRow = _pageInfo.total || data.obj.records.length;
                _this.pageView.totalSize = _pageInfo.total ;
                _this.pageView.currentPage = _pageInfo.current*1;
                  // _this.pageView.currentPage ++ ;
                  // console.log(params.successCallback);
                params.successCallback(data.obj.records, lastRow);
                _this.pageView.loading?_this.pageView.loading = false:"";
              }, (response) => {
                _this.pageView.$message.error(response.msg);
                _this.pageView.loading?_this.pageView.loading = false:"";
              });
            }, 500);
        }
    };
    this.gridOptions = {
        rowModelType: 'infinite',   //无限动态加载模式，每次切换页面从服务器取数据
        enableServerSideFilter: true,   //动态搜索
        floatingFilter: true,
        enableColResize: true,
        paginationPageSize: 20,
        pagination: true,
        suppressPaginationPanel:true,
        rowSelection:"multiple",
        enableServerSideSorting: true,
        enableCellTextSelection:true,
        ensureDomOrder:true,
        defaultColDef:{
            filter: true,
            resizable: true,
            sortable: true,
        },
        columnTypes: {  // 过滤值不忽略大小写
            inputCaseText: {filter: 'agTextColumnFilter', filterParams: {caseSensitive: true, clearButton: true,suppressAndOrCondition: true,}}
        },
    };
    this.loadData = function(params, otherParams){
        //  params = {filter: "53", filterName: "ata", filterType: "text", type: "equals"};
        // {filterName: "ata", type: "contains", filter: "757", filterType: "text"};

        this.otherFilterNotInColumnDef = [];
        if (Array.isArray(params)) {
            params.forEach(item => {
                if (item.filterName) {
                    let ataFilterComponent = this.gridOptions.api.getFilterInstance(item.filterName);
                    if (ataFilterComponent) {
                        ataFilterComponent.setModel(item);           
                    } else {
                        this.otherFilterNotInColumnDef.push(item);
                    }
                }
                this.gridOptions.api.onFilterChanged();
            });
        }else if(params){
            if (params.filterName) {
                let ataFilterComponent = this.gridOptions.api.getFilterInstance(params.filterName);
                if (ataFilterComponent) {
                    if (params.filter&&params.filter.length) {
                        ataFilterComponent.setModel(params);    
                    } else {
                        ataFilterComponent.setModel(null);
                    }
                    this.gridOptions.api.onFilterChanged();       
                }else{
                    this.otherFilterNotInColumnDef.push(params);
                } 
            }
        }
        this.gridOptions.api.setDatasource(dataSource);
    };
}

function createAgGridDataManager(actionUrl,pageView){
    var o = new agGridDataManager();
    o.actionUrl = actionUrl;
    o.pageView = pageView;
    // console.log(o)
    return o;
}
export default{
    install(Vue,opt){
        Vue.prototype.$agGrid2 = {
            init(actionUrl,pageView){
               return createAgGridDataManager(actionUrl,pageView);
            }
        }
    }
}


