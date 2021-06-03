/**
 * 抽取Aggrid列表公共属性的JS，每次使用只需要直接调用即可
 */
const gridOptions = {
  gridOptions: {
    //  动态加载模式
    rowModelType: 'infinite',
    //支持列宽拖拽
    enableColResize: true,
    //复制单元格
    enableCellTextSelection:true,
    ensureDomOrder:true,
    // 动态排序
    enableServerSideSorting: true,
    // 动态搜索
    enableServerSideFilter: true,
    // 可滚动可视区域外呈现的行数
    rowBuffer: 3,
    // 支持多选  multiple  || single
    rowSelection: 'single',
    // rowDeselection: true,
    // 列表标题定义
    columnDefs: [],
    columnTypes: {
      // 过滤值不忽略大小写
      inputCaseText: {filter: 'agTextColumnFilter', filterParams: {caseSensitive: true, clearButton: true}}
    },
    // 是否显示分页
    // 支持条件筛选
    enableFilter : true,
    //支持标题下直接搜索
    floatingFilter:true,
    // tell grid we want virtual row model type
    // how big each page in our page cache will be, default is 100
    // 单页显示行数
    paginationPageSize: 20,
    // 每次请求缓存行数,
    cacheBlockSize: 20,
    // how many extra blank rows to display to the user at the end of the dataset,
    // which sets the vertical scroll and then allows the grid to request viewing more rows of data.
    // default is 1, ie show 1 row.
    cacheOverflowSize: 1,
    // how many server side requests to send at a time. if user is scrolling lots, then the requests
    // are throttled down
    maxConcurrentDatasourceRequests: 1,
    // how many rows to initially show in the grid. having 1 shows a blank row, so it looks like
    // the grid is loading from the users perspective (as we have a spinner in the first col)
    infiniteInitialRowCount: -1,
    // how many pages to store in cache. default is undefined, which allows an infinite sized cache,
    // pages are never purged. this should be set for large data to stop your browser from getting
    // full of data
    maxBlocksInCache: 1
  },
  _vueThat: null,
  gridTableId: null,
  actionUrl: null,
  pageParams: null,
  defaultParam: {},
  init: function (ops, vue) {
    ops = ops || {};
    vue.extend(this, ops);
    this.loadDatas(this.defaultParam, vue);
  },
  loadDatas: function (pageParams, vue) {
    pageParams = pageParams || {};
    if (pageParams) {
      pageParams = {'filterModel': pageParams};
    }
    var _grid = this;
    vue = vue || _grid._vueThat;
    if (!vue) {
      console.warn("vue.$ is null.")
      return false;
    }
    if (!_grid.actionUrl) {
      console.warn("load data url is null.")
      return false;
    }
    var that = this;
    var vue = _grid._vueThat;
    var dataSource = {
      rowCount: 0, // behave as infinite scroll
      getRows: function (params) {
        var pageInfo = that.pageInfo(params);
        pageInfo = that.pageInfo(pageParams, pageInfo);
        that.pageParams = pageInfo;
        setTimeout(function () {
          vue.$httpExt().post(_grid.actionUrl, pageInfo, {}).then(function (data) {
            var _pageInfo = data.result;
            var lastRow = _pageInfo.countRow;

            params.successCallback(_pageInfo.result, lastRow);
            vue.loading?vue.loading = false:"";
          }, (response) => {
            vue.$message.error(response.msg);
            vue.loading?vue.loading = false:"";
          });
        }, 500);
      }
    };
    vue.gridOptions.api.setDatasource(dataSource);
  },
  pageInfo: function (params, page) {
    page = page || {};
    if (params) {
      page['startRow'] = params.startRow || page.startRow;
      page['endRow'] = params.endRow || page.endRow;
      if (params.filterModel) {
        page['filterModel'] = page['filterModel'] ||  [];
        for (var key in params.filterModel) {

          if (params.filterModel[key]) {
            var indexKey=key.lastIndexOf("_1");
            var _o = {
              'filter': params.filterModel[key].filter,
              'filterType': params.filterModel[key].filterType,
              'type': params.filterModel[key].type,
              'filterName':indexKey!==-1? key.substring(0,indexKey):key
            };
            if (params.filterModel[key].type.indexOf('inRange') != -1) {
              _o['filterTo'] = params.filterModel[key].filterTo || '';
            }
            page['filterModel'].push(_o)
          }
        }
      }
      if (params.sortModel) {
        if(params.sortModel.length){
          let sortKeyIndex=params.sortModel[0].colId.lastIndexOf("_1");
          let sortKey =params.sortModel[0].colId.substring(0,sortKeyIndex);
          params.sortModel[0].colId =sortKey;
      }
        page['sortModel'] = params.sortModel;
      }
    }
    return page;
  }
};

export default {
  install(Vue, opt) {
    Vue.prototype.$agGrid = function () {
      return {
        buildGrid(ops, that) {
          var _setting = this.extend({}, gridOptions,{});
          ops = ops || {};
          ops['_vueThat'] = that;
          _setting.init(ops, this);
          return _setting;
        },
        loadGridOps(ops, that) {
          ops = ops || {};
          var _options = this.extend({},  gridOptions.gridOptions, ops);
          return _options;
        },
        loadGridDatas(ops, _settings) {
          ops = ops || {};
          _settings.loadDatas(ops, this);
        },
        initFilterCols(colArr, ops) {
          // 定义列表筛选栏时，默认类型的，自动加上大小写不忽略
          if (colArr) {
            ops = ops || {filter: 'agTextColumnFilter', filterParams: {caseSensitive: true, clearButton: true}};
            for (let key in colArr) {
              if (colArr[key]) {
                //&& !colArr[key]['filterParams']
                if (!colArr[key]['filter'] && !colArr[key]['type']) {
                  this.extend(colArr[key],ops)
                }
              }

            }
          }
          return colArr;
        },
        logger(callback, text) {
          console.log(text)
        },
        extend(outObj, targetObj, sourceObj) {
          outObj = outObj || {};
          if(targetObj) {
            for (var prop in targetObj) {
              outObj[prop] = targetObj[prop];
            }
          }
          if(sourceObj){
            for (var prop in sourceObj) {
              outObj[prop] = sourceObj[prop];
            }
          }
          return outObj;
        }
      }
    }
  }
}

