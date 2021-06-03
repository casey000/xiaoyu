import getTabList from "./ewisAndOilLeakTabList";

export default (fnJson)=>{
    return {
        tabList:getTabList(fnJson),
        //页面对应详情标题
        title:'油量渗漏故障查看',
        //页面列表接口
        tabUrl:'maintenanceProduction/ewisOilPackage/queryList',
        //对应详情页地址
        src:resolve=>require(["../ewisAndOilLeak/detail.vue"], resolve),
        queryParam: [
            {
                "column": "type",
                "value": "O",
                "type": "eq"
            }
        ]
    }
}
