import getTabList from './repeatOrMultipleTabList'
export default (fnJson)=>{
    return {
        //表格信息
        tabList:getTabList(fnJson),
        title:'多发性故障',
        src:resolve=>require(["../repeatListOrMultiple/detail.vue"], resolve),
        //查询条件
        queryParam: [
            {
                "column": "type",
                "value": "MULTIPLE",
                "type": "eq"
            }
        ]
    }
}
