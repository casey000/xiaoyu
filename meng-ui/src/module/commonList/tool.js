import Vue from "vue";
import {formatDate} from '../../common/js/util/date.js'

//页面通用方法
let backContent=(params,isTime,vm)=>{
    // if (!params || !params.data) return
    let val =isTime?formatDate(params.value, "yyyy-MM-dd hh:mm:ss"):params.value;
    if (!params || !params.data) val=''
        if(params.column.colId=='type'){
        let backStatus={'ATA':'故障率超限','PRE':'预警机制报警','PART':'部件拆换率超限','TECH':'技术通告'}
        val = backStatus[params.value]
    }
    let rowOperate = Vue.extend({
        template: `<div class="viewLink">${val||''}</div>`,
        methods: {
            handleOperate: function() {
                console.log(this.$el.parentNode.parentNode.parentNode.parentNode)
                vm.contextmenuClick(params.data);
            },
        },
        mounted(){
            this.$nextTick(()=>{
                let el =this.$el.parentNode.parentNode.parentNode.parentNode
                el.addEventListener('contextmenu',function(e){
                    e.preventDefault()
                    vm.contextmenuClick(params.data)
                })
            })
            // this.$el.parentNode.parentNode.parentNode.parentNode.onContextMenu=(e)=>{
            //     vm.contextmenuClick(params.data)
            // }
        }
    });
    let component = new rowOperate().$mount();
    return component.$el;
}
export default (vm)=>{
    return {
        //页面编辑跳转方法
        mulNoOprateCell:(params)=>{
            // console.log(params)
            if (!params || !params.data) return
            let rowOperate = Vue.extend({
                template: `<a class="viewLink" @click.stop="handleOperate()">${params.value}</a>`,
                methods: {
                    handleOperate: function() {
                        vm.view(params, "view");
                    }
                }
            });
            let component = new rowOperate().$mount();
            return component.$el;
        },
        //右击显示菜单方法
        showMenu:(params)=>{
            return backContent(params,false,vm)
        },
        //有右键菜单并需要日期转换列
        showDateAndMenu:(params)=>{
            return backContent(params,true,vm)
        },
        //是否格式化
        formatYesAndNo:(params)=>{
            let arr = {'Y': '是', 'N': '否'};
            return arr[params.value];
        },
        // 告警狀態格式化
        formatAlarmStatus:(params)=>{
            let statusArr = {'WARNING': '警告', 'MONITORING': '监控', 'RELIEVE': '解除'};
            return statusArr[params.value]
        },

        //日期格式化
        dateFormatter:obj=>formatDate(obj.value, "yyyy-MM-dd hh:mm:ss"),
        //页面编辑跳转方法
        oprateCellRenderer:(params)=>{
            //1,2不能操作
            //多发性重复性可操作控制archiveStatus1:已归档,2:失效不可编辑
           if(params.data&&('archiveStatus' in params.data)&&['1','2'].includes(params.data.archiveStatus+''))return null
            let rowOperate = Vue.extend({
                template:'<div style="display: flex; justify-content:space-around; height:28px; line-height:28px">' +
                    ' <i class="el-icon-edit" style="cursor:pointer; height:28px; line-height:28px" @click="editOneLine">&nbsp;&nbsp;&nbsp;</i></div>',
                methods:{
                    editOneLine(){
                        vm.view(params,'edit');
                    }
                }
            });
            let component= new rowOperate().$mount();
            return component.$el;
        }
    }
}
