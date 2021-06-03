
import getTabList from './ewisAndOilLeakTabList'
export default (fnJson)=>{
    return {
        tabList:getTabList(fnJson),
        //页面列表接口
        //页面对应详情标题
        title:'Ewis故障',
        //对应详情页
        src:resolve=>require(["../ewisAndOilLeak/detail.vue"], resolve),
        queryParam: [
            {
                "column": "type",
                "value": "E",
                "type": "eq"
            }
        ]
    }
}
