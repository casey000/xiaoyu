import config from './config'
import api from '../../api/commonTabApi'
//表格配置中心页面
export default {
    created() {
        //初始化页面配置
        this.pageData = config(this)
        this.hasMenu = this.pageData.hasMenu
        this.defectData = this.pageData
        this.columnDefs = this.pageData.tabList
        this.queryParam = this.pageData.queryParam
        this.postType = this.pageData.postType || 'gateway'
        this.childColumnDefs = this.pageData.childColumnDefs || []
        this.extensionAlertColumn = this.pageData.extensionAlertColumn || []
        this.assessmentColumn = this.pageData.assessmentColumn || []
        this.hasTopSearch = this.pageData.hasTopSearch || false
    },
    props: ['item'],
    data() {
        return {
            api:api,
            showSure:false,
            sureInfo:{
                ifAlarm:'',
                remark:''
            },
            hasTopSearch:false,
            hasMenu:false,
            sureInfoRule:{
                ifAlarm:[{ required: true, message: '请选择是否真警告', trigger: 'blur' }],
                remark:[{ required: true, message: '请输入备注', trigger: 'blur' }],

            },
            pageData:null,
            showMenu: false,
            defectList: [],
            nrcEditVisiable: [],
            defectData: null,
            columnDefs: [],
            queryParam: null,
            postType:"gateway",// 新的vue列表默认都是走网关
            childColumnDefs: [],
            extensionAlertColumn: [],
            assessmentColumn: [],
            assessmentData: [],
            rowInfo: [],
            menuData: {},
            menuPosition: {
                left: 0, top: 0
            },
        };
    },
    destroyed() {
        this.bus.$off(this.item.content)
    },
    mounted() {
        //接收页面刷新事件
        this.bus.$on(this.item.content, () => {
            if (this.$refs[this.item.content]) this.$refs[this.item.content].reloadData();
        });
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        },
        view(params, viewMode){
            let str = viewMode=='view'?'查看':'确认';
            // if(params.data.isVerify===1) str = '审核'
            //设置可见性
            this.$emit("page",this.pageData.title+str,(resolve)=> {
                    this.pageData.src(resolve);
                },{ id: params.data.id,method:viewMode,content:this.item.content,isReadyDo:false}
            );
        },
        toDetail(type) {
            let src = this.defectData.src;
            this.$emit("page", this.defectData.title + '详情', function (resolve) {
                    src(resolve);
                }, { id: this.menuData.id, method: type, content: this.item.content, isReadyDo: false }
            );
        },
        contextmenuClick(data) {
            this.$refs.menu.getMenuData(data)
            this.menuData = data
            let event = event || window.event;
            this.menuPosition = {
                top: event.clientY,
                left: event.clientX
            }
            this.showMenu = true
        },
        // data中的数据是在ag-grid中定义rowClicked点击事件获取的，就是每一行的数据
        getChild(data) {
            if (this.childColumnDefs.length <= 0) return;
            this.$httpExt().get(this.api[this.item.content].childTabUrl + data.id, undefined,this.postType).then(response => {
                //成功提示
                this.rowInfo = response.obj
            }).catch(err => {
                this.$message.error(err.errorMessage || err.msg || err);
            });
        }
    }
}