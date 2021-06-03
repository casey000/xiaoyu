import pageData from './control'
import tool from './tool'
//表格配置中心页面
export default (vm)=>{
    //导入当前页面配置信息
    //获取当前页面code按页面获取当前页面需要数据
    let content = vm.item.content;
    //获取当前页面需要数据
    let backConfig = pageData[content]()(tool(vm));
    // console.log(backConfig)
    // console.log(backConfig)
    // 根据页面code获取不同页面参数
    //tool(vm)获取表格需要使用的方法
    return backConfig
}
