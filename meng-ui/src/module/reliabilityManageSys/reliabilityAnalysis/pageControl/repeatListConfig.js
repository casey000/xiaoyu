import getTabList from './repeatOrMultipleTabList'
export default (fnJson)=>{
    return {
        tabList:getTabList(fnJson),
        title:'重复性故障',
        //详情页跳转地址，包括编辑查看
        src:resolve=>require(["../repeatListOrMultiple/detail.vue"], resolve),
        queryParam: [
            {
                "column": "type",
                "value": "REPEAT",
                "type": "eq"
            }
        ]
    }
}
