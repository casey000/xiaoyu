<template>
	<el-row class="panel" :class="{'mini-menu': isMiniMenu}">

		<el-col :span="24" class="panel-center">
			<!-- 左侧菜单栏 -->
			<aside v-if="!isPage" class="main-menu">
				<div class="menu-user-info">
					<img alt="image" src="/img/bireturnLogo.png" height="60" width="160" />
					<el-popover placement="right" width="200" trigger="click">
						<p class="message" @click="pswChange">修改密码</p>
						<p class="message" @click="logout">安全退出</p>
						<div slot="reference">
							<p>{{loginUser.userName}}</p>
							<p>{{loginUser.roleName}}</p>
						</div>
					</el-popover>

				</div>
				<div class="menu-logo">
					tdms
				</div>
				<el-menu class="menu" :collapse="isMiniMenu" unique-opened text-color="#fff">
					<submenu v-for="item in menu[0]" :key="item.id" :item="item" :menuObj='menu' @selected="selected" />
				</el-menu>
			</aside>
			<!-- 主体内容区域 -->
			<section v-if="!isPage" class="panel-container">
				<el-row class="panel-header">
					<el-col :span="1" style="text-align:center">
						<el-button icon="el-icon-s-fold" class="collapse-button" @click="isMiniMenu = !isMiniMenu"></el-button>
					</el-col>
					<el-col :span="6">
						<el-input prefix-icon="el-icon-search" v-model="searchMenu" placeholder="请输入您需要查找的内容" @keyup.enter.native="filterMenu"></el-input>
					</el-col>
					<el-col :span="16">
						<span style="float: right;">
							<el-popover placement="bottom" title="帮助中心" width="200" trigger="hover">
								<div>
									<a href="http://10.88.18.80:8989/webtype/view8ad892d06b681ad901713a4e54ce549c/Pub1.html" target="_blank">
										<p style="color: #0e9aef">知识平台链接</p>
									</a>
								</div>
								<el-button slot="reference" class="help-show">帮助</el-button>
							</el-popover>
						</span>
						<span class="list" @click="logout">
							<i class="iconfont icon-logout"></i>
							退出
						</span>
						<span class="list list1">
							<el-popover placement="bottom" width="200" trigger="click">
								<p>您有{{messageNum}}条新消息</p>
								<p class="message" @click="showAllMessage"><strong>查看所有 >></strong></p>
								<el-badge class="item" :value='messageNum' slot="reference">
									<i class="iconfont iconAlert"></i>
								</el-badge>
							</el-popover>
						</span>
					</el-col>
				</el-row>
				<div class="grid-content">
					<el-tabs type="card" closable @tab-click="handleClick" @tab-remove="handleRemove" :active-name="tab" class="outer-tabs">
						<el-tab-pane v-for="item in tabs" :key="item.title" :label="item.title" :name="item.title">
							<!-- 页面显示的位置 -->
							<div class="sf-tab-content" @page="createTab" @close="handleRemove" :is="getPageContent(item.content)" :item="item" :otherParams="item.param" :btns="item.btns" :itemUrl="item.url">
							</div>
						</el-tab-pane>
					</el-tabs>
					<div class="clear-tab" @click="showClose=!showClose"  @mouseleave="showClose=false">
                        关闭操作
						<div v-if="showClose">
                            <div @click="tabs.splice(1);tab=tabs[0].name;showClose=false">关闭全部选项卡</div>
                            <div @click="closeOther()">关闭其他选项卡</div>
                        </div>
					</div>
				</div>
			</section>
			<div v-if="isPage" class="detail-content" :otherParams="{id:pageInfo.pkId||'105078693046554624',
            method:'edit',isReadyDo:true,content:this.pageInfo.page}" :is="pageCode"></div>
		</el-col>
		<!-- 修改密码 -->
		<edit-password v-if="pswEditVisiable" @edit-save="handleSave" @edit-close="handleClose"></edit-password>

		<el-dialog :title="$t('appMes.selectRole')" :visible.sync="dialogRole">
			<el-select v-model="currentRoleIdTemp" :placeholder="$t('appMes.selectRoles')" style="display:block">
				<el-option v-for="item in roleLists" :key="item.roleId" :label="item.roleName" :value="item.roleId">
					<span style="float: left">{{ item.roleName }}</span>
				</el-option>
			</el-select>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogRole = false">{{$t('appMes.cancelOption')}}</el-button>
				<el-button type="primary" @click="switchRole">{{$t('appMes.submitOption')}}</el-button>
			</span>
		</el-dialog>

		<el-dialog v-if="toDealt" title="流程任务处理" :visible.sync="toDealt" width="85%"  style="">
			<dealt-task :pageData="pageInfo" :dealtData="dealtData" @close="toDealt=false"  style="max-height: 500px;overflow: auto"></dealt-task>
		</el-dialog>
	</el-row>
</template>

<script>
import submenu from './submenu'
import menuComponentList from './menuComponent'
import Base64 from './Base64'
// import menuObj from './menu.json'
import CAS from '../../common/js/casLogin'
const homePage = {
	title: '首页',
	name: '首页', //'首页',
	content: 'iframeBox',
	btns: {},
	url: "/views/main.shtml",
}
window.top.P_WINDOWS = {}

export default {

	/**
	 *1、provide/inject有什么用？
	 *   常用的父子组件通信方式都是父组件绑定要传递给子组件的数据，子组件通过props属性接收，一旦组件层级变多时，
	 *   采用这种方式一级一级传递值非常麻烦，而且代码可读性不高，不便后期维护。
	 */
	provide() {
		return {
			vueFlowMethod: this.flowSubmitAndBack
		}
	},
	data() {
		return {
            showClose:false,
			toDealt: false,
			dealtData: {},
			isPage: false,
			menuComponentList: menuComponentList,
			defect: {
				repeatDefectList: 'repeatAndMultipleDetail',
				multipleDefectList: 'repeatAndMultipleDetail',
				ewisDefectList: 'ewisAndOilLeakDetail',
				oilLeakageList: 'ewisAndOilLeakDetail',
			},
			reliability: {
				relAlarmAudit: 'relAlarmAudit',//【告警单】修改是否真假告警审核
				relWarningAssess: 'relWarningAssess',//【报警单】评估-即-报警单评估提交
				relWarningInvalid: 'relWarningInvalid',//【报警单】是否失效报警单
				relWarningDelay: 'relWarningDelay',//【报警单】延期
			},
			pageCode: '',
			pageInfo: {},
			tabs: [homePage],
			tab: '首页', //'首页', //this.$t('appMes.homePageLang'), //'首页',
			menu: [],
            menuClone: [],
			loginUser: [],
			menuComponent: {},
			openedElement: [],
			roleLists: [],
			currentRoleIdTemp: '',
			dialogRole: false,
			isMiniMenu: false,
			searchMenu: '',
			messageNum: "",
			suffix: "shtml",//页面后缀名,
			pswEditVisiable: false,
		}
	},

	beforeCreate() {
	},

	created() {
		this.loginCheck(() => this.init());
        window.COMMONFUNLIST = {
            openProcess: (data) => {
                self.toDealt = true
                self.dealtData.jdata = data
            },
            setTaskInfo(data) {
                self.dealtData = data
            }
        }
	},

	computed: {

		init(){
			this.getMenu();
			this.pageInfo = this.getUrlParam()
			if (this.pageInfo.page) {
				this.isPage = true
				this.pageCode = this[this.pageInfo.file][this.pageInfo.page]
			}
			let self = this;
		},

		isI18N() {
			return this.$store.state.global.i18nFlag
		},
		languageList() {
			if (window.sessionStorage.getItem('lang') == 'en-US') {
				return [{
					value: 'en-US',
					label: 'English'
				},
				{
					value: 'zh-CN',
					label: 'Chinese'
				}
				]
			}
			if (window.sessionStorage.getItem('lang') == 'zh-CN') {
				return [{
					value: 'en-US',
					label: '英文'
				},
				{
					value: 'zh-CN',
					label: '中文'
				}
				]
			}
		},
		currentRoleName() {
			for (let i = 0; i < this.roleLists.length; i++) {
				if (this.roleLists[i].roleId == this.currentRoleId)
					return this.roleLists[i].roleName
			}
		},
		userName() {
			return this.$store.state.global.userName
		},
		currentRoleId() {
			return this.$store.state.global.roleId
		}
	},
	mounted() {
		let that = this;
		if (typeof (BroadcastChannel) != "undefined") {
			// console.log('123')
			let cast = new BroadcastChannel('open-tab-ne');
			cast.onmessage = function (obj) {
				// console.log('321');
				// console.log(obj);
				that.selected(obj.data.name, obj.data.id, obj.data.url);
			};
		} else {
			window.selectMenu = ((obj) => {
				that.selected(obj.data.name, obj.data.id, obj.data.url);
			})
		}
		window.sureOut = this.sureOut

	},
	methods: {
        /**
         * 登录检测, 同步调用
         **/
		loginCheck(callback){
			this.$httpExt().get( "http://" + window.location.host + "/api/login/check" ,{}).then(response => {
                console.log("TDMS认证成功！");
				callback();
            }, response => {
				this.$alert(response.msg);
            })
        },

		/**
		 *  提交或者驳回，通过参数 operation区分：submit 提交 back 退回
		 *  {
		 *    operation：操作,
		 *    pkid:业务ID, taskId,任务ID ,flowDefId:流程定义ID ,auditorSn:下一流程任务处理人,remark:备注,
		 *    typeMap:{}
		 *  }
		 *   typeMap：扩展参数对象
		 *
		 * @param data
		 */
		closeOther(){
		    this.showClose = false
		    if(this.tabs.length<=1)return
		    let arr = []
            this.tabs.map(item=>{if(item.name===this.tab||item.name==='首页')arr.push(item)});
            this.tabs = arr
            this.tab=this.tabs[1].name
        },
		flowSubmitAndBack(data) {
			if (data.operation === 'submit') {
				this.flowSubmit(data);
			} else if (data.operation === 'back') {
				this.flowBack(data);
			} else {
				console.log("operation参数传递错误,参数data：" + data);
			}
		},
		flowSubmit(data) {
			this.$confirm('您确定要提交吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(() => {
				// 参数校验
				// var params = data
				console.log("提交流程：" + data);
				let postUrl = data.postUrl || '';
				let postType = data.postType || 'gateway'
				if(data && data.FunctionCode){
                    postUrl = '/api/v1/plugins/PROCESS_TASK_SUBMIT'
                    postType= "form"
				}
				if(!postUrl){
                    this.$message.error("未知的流程提交接口");
				}
                this.$httpExt().post(postUrl, data, postType).then(response => {
                    this.$message({ type: 'success', message: '提交成功!' });
                }).catch(err => {
                    this.$message.error(err.errorMessage || err.msg || err);
                });
                this.toDealt = false
			}).catch(() => {
			});
		},

		flowBack(data) {
			this.$confirm('您确定要退回吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
			}).then(() => {
				let params = {
					isFirstNode: 'Y',
					pkid: data.pkid,//业务ID
					approvedBy: "",
					_return: 'N',
					taskId: data.taskId,
					notes: data.remark,//备注信息
					FunctionCode: 'WS_FLOW_TURNBACK', //PROCESS_TERMINATE_TASK
					reSelect: "top",
					flowDefId: data.flowDefId
				};
				console.log("退回参数：" + params);
				this.$httpExt().post('/api/v1/plugins/WS_FLOW_TURNBACK', params, "form").then(response => {
					this.$message({ type: 'success', message: '退回成功!' });
				}).catch(err => {
					this.$message.error(err.errorMessage || err.msg || err);
				});
			}).catch(err => {
				// this.$message.error(err.errorMessage || err.msg || err);
			});
		},
		//获取页面
		getPageContent(content) {
			// console.log(content)
			return this.menuComponentList[content] || content
		},
		getUrlParam(url) {
			url = url ? url : window.location.href;
			let param = url.substring(url.indexOf('?') + 1),
				paramItem = param.split('&'),
				rs = {};
			for (let i = 0, len = paramItem.length; i < len; i++) {
				let pos = paramItem[i].indexOf('=');
				if (pos === -1) {
					continue;
				}
				let name = paramItem[i].substring(0, pos),
					value = window.decodeURIComponent(paramItem[i].substring(pos + 1));
				rs[name] = value;
			}
			return rs;
		},
		handleCommand(command) {
			window.sessionStorage.setItem('lang', command);
			this.$i18n.locale = command;
			if (command == 'en-US') {
				window.sessionStorage.setItem('lang', 'en');
			} else {
				window.sessionStorage.setItem('lang', command);
			}
			window.location.reload();
		},
		filterMenu() {

                this.searchId(this.menuClone, this.searchMenu)
                // if (this.searchMenu !== "") {
			// 	this.searchId(this.menu, this.searchMenu)
			// }
		},
		searchId(data, str) {
			var tmp = [];
            this.menu = [];
            // 空值则展示全部
            if (this.searchMenu === "") {
                this.menu = this.menuClone;
                return;
            }
			Object.keys(data).forEach(function (k) {
				Object.keys(data[k]).forEach(function (k1) {
					var v1 = data[k][k1];
					var name = v1.name;//$.i18n.t(v1.i18nText); //v1.name
					if (name && name.toLowerCase().indexOf(str.toLowerCase()) > -1) {
						v1.pid = 0;
						tmp.push(v1);
					}
				});
			});
			if (tmp.length > 0) {
				this.menu['0'] = tmp;
			}
		},
		queryBtns(moduleId, tabObjIntabs) {
			//根据moduleId获取按钮权限
			this.$httpExt().get('admin/queryPageBtn', {
				'moduleId': moduleId,
				'roleId': this.currentRoleId
			}).then(response => {
				var data = response
				if (data.result.length == 0) {
					return
				}
				var obj = {}
				for (let i = 0; i < data.result.length; i++) {
					obj[data.result[i]] = true
				}
				tabObjIntabs.btns = obj
			}, response => {
				this.$notify.error({
					title: '异常',
					message: response.msg
				})
			})
		},
		switchRole() {
			this.$store.commit('setRoleId', this.currentRoleIdTemp)
			this.getMenu()
			this.dialogRole = false
			this.tabs = [homePage]
			this.tab = '首页'  // this.$t('appMes.homePageLang') //'首页'
		},
		getQueryString(name) {
			let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
			let r = window.location.search.substr(1).match(reg)
			if (r != null) return r[2];
			return null
		},
		getMenu() {
			this.$httpExt().get('api/v1/system/data/menu').then(jdata => {
				this.loginUser = jdata.data.loginUser;
				this.menu = jdata.data.menuData;
				this.menuClone = jdata.data.menuData;
				// console.log(jdata.data.permKeys)
				const obj = jdata.data.loginUser;
				window.top.document['_LOGIN_USER'] = Object.assign(obj);
				window.sessionStorage.setItem('_LOGIN_USER', JSON.stringify(jdata.data.loginUser));
				window.AM_AUTH_ = this.AuthPerm_(jdata.data.permKeys)
				window.AM_MENU_AUTH_ = this.AuthPerm_(jdata.data.menuKeys)
				window.VALID_AUTH = function (vauth) {
					function IS_AUTH(vauth, AM_AUTH_) {
						if (AM_AUTH_ == "") {
							return;
						}
						var AuthStr = "," + AM_AUTH_ + ",";
						if (AuthStr.indexOf(",all,") != -1 || AuthStr.indexOf("," + vauth + ",") != -1) {
							return true;
						}
						return false;
					}
					if (window.AM_AUTH_ == "vauth") {
						return true;
					}
					if (vauth.indexOf("&") != -1 || vauth.indexOf("|") != -1) {
						var group = vauth.match(/\[#[\da-zA-Z_]*#\]/g); //ƥ��//"[#k8889m#]"
						if (group) {
							for (var i = 0; i < group.length; i++) {
								var m = group[i];
								var mauth = group[i].replace("[#", "").replace("#]", "");
								var v = IS_AUTH(mauth, window.AM_AUTH_);
								vauth = vauth.replace(m, v + "");
							}
							eval("var result = " + vauth + ";");
							return result;
						}
					} else {
						return IS_AUTH(vauth, window.AM_AUTH_);
					}
				}
				this.getMessages();
			}, response => {
				this.$notify.error({
					title: '异常',
					message: '获取菜单失败'
				})
			})

		},

		AuthPerm_(authValue) {
			let auth64 = authValue.trim();
			if (auth64 == "") {
				return;
			}
			return new Base64().decode(auth64);
		},
		getMessages() {
			this.$httpExt().get('api/v1/message/count').then(jdata => {
				this.messageNum = jdata.data.count;
			}, response => {
				this.$notify.error({
					title: '异常',
					message: response.msg
				})
			})
		},
		showAllMessage() {
			this.selected('消息列表', "id003", '/views/ws/message/message_list.shtml');
		},
		pswChange() {
			this.pswEditVisiable = true;
		},
		handleSave() {
			this.pswEditVisiable = false;
		},
		handleClose() {
			this.pswEditVisiable = false;
		},
		selected(tab, moduleId, tabUrl) {
			// console.log(tab, moduleId)
			/*对tab的切换进行埋点  当做是页面的跳转进行处理*/
			let pageName = tab + "_" + moduleId
			this.$sfgather().track_pageview(pageName)
			for (let [index, item] of this.tabs.entries()) {
				if (item.title == tab) {
					this.tab = tab
					return
				}
			}
			// console.log(tabUrl)
			var index1 = tabUrl.lastIndexOf(".");
			var index2 = tabUrl.lastIndexOf("/");
			this.suffix = tabUrl.substring(index1 + 1);
			var content;
			if (this.suffix == "vue") {
				content = tabUrl.substring(index2 + 1, index1)
			} else {
				content = 'iframeBox'
			}

			this.tabs.push({
				'title': tab,
				'name': tab,
				'content': content,
				'btns': {},
				'url': tabUrl,
			})
			this.tab = tab
		},
		createTab(t, c, params) {
			let flag = false;
			for (let [index, item] of this.tabs.entries()) {
				if (item.title == t) {
					this.tabs.splice(index, 1, {
						'title': t,
						'name': t,
						'content': c,
						'btns': params.btns || {},
						'param': params
					})
					flag = true
					break
				}
			}
			if (!flag) {
				this.tabs.push({
					'title': t,
					'name': t,
					'content': c,
					'btns': params.btns || {},
					'param': params
				})
			}
			this.tab = t
		},
		handleClick(tab, event) {
			this.tab = tab.name
		},
		handleRemove(targetName) {
			let tabs = this.tabs
			let activeName = this.tab
			if (activeName === targetName) {
				tabs.forEach((tab, index) => {
					if (tab.name === targetName) {
						let nextTab = tabs[index + 1] || tabs[index - 1]
						if (nextTab) {
							activeName = nextTab.name
						}
					}
				})
			}

			this.tab = activeName
			this.tabs = tabs.filter(tab => tab.name !== targetName)
		},
		over(event) {
			let panel = this.$el.querySelector(".panel-top").parentNode
			if (panel.className.indexOf('mini-menu') != -1) {
				event.currentTarget.querySelector(".el-menu").style.display = 'block'
			}
		},
		out(event) {
			let panel = this.$el.querySelector(".panel-top").parentNode
			if (panel.className.indexOf('mini-menu') != -1) {
				event.currentTarget.querySelector(".el-menu").style.display = 'none'
			}
		},
        sureOut(){
            this.$httpExt().post("/api/v1/security/logout", "").then(response => {
				sessionStorage.token = null;
				sessionStorage.userid = null;
				sessionStorage.username = null;
				sessionStorage._LOGIN_USER = null;

				if (response.code == '200') {
					CAS.casLogout();
                }
            }, response => {
                this.$notify.error({
                    title: '异常',
                    message: response.msg
                })
            })
        },
		logout() {
			this.$confirm(this.$t('appMes.quitContent'), this.$t('appMes.quitTips'), {
				confirmButtonText: this.$t('appMes.submitOption'),
				cancelButtonText: this.$t('appMes.cancelOption'),
				type: 'warning'
			}).then(() => {
                    this.sureOut();
			}).catch(() => { })
		},
	},
	components: {
		submenu,
		dealtTask: function (resolve) {
			require(['../dealtTask/index.vue'], resolve)
		},
		commonList: function (resolve) {
			require(['../commonList/commonList.vue'], resolve)
		},
		repeatAndMultipleDetail: function (resolve) {
			require(['../reliabilityManageSys/reliabilityAnalysis/repeatListOrMultiple/detail.vue'], resolve)
		},
		ewisAndOilLeakDetail: function (resolve) {
			require(['../reliabilityManageSys/reliabilityAnalysis/ewisAndOilLeak/detail.vue'], resolve)
		},
		iframeBox: function (resolve) {
			require(['./iframeBox.vue'], resolve)
		},
		editPassword: function (resolve) {
			require(['./password.vue'], resolve)
		},
		// 可靠性
		relAlarmAudit: function (resolve) {
			require(['../reliabilityManageSys/reliabilityAnalysis/monitoring/detail.vue'], resolve)
		},
		relWarningInvalid: function (resolve) { // 报警单失效
			require(['../reliabilityManageSys/reliabilityAnalysis/monitoring/invalid.vue'], resolve)
		},
		relWarningAssess: function (resolve) { // 报警单评估
			require(['../reliabilityManageSys/investigationReport/reliabilityAlarmDetail/detail.vue'], resolve)
		},

	}
}
</script>

<style>
.language_title {
	color: #c0ccda;
}
.collapse-button {
	background: #1d5289;
	border: none;
	padding: 4px 10px;
	color: #fff;
}
.panel-header .el-input__inner {
	width: 200px;
	font-size: 13px;
	color: #fff;
	height: 18px;
	line-height: 18px;
	background: none;
	border: none;
	border-radius: 0;
	border-bottom: 1px solid #fff;
}
.message {
	text-align: center;
	cursor: pointer;
}
.sf-tab-content {
	height: 100%;
	width: 100%;
	overflow-y: hidden;
	overflow-x: hidden;
}

.detail-content {
	width: 100%;
	height: 100%;
	background: #fff;
}
</style>
<style  scoped lang="less" type="text/less">
/deep/.help-show {
	background: none !important;
	border: none !important;
	color: #fff !important;
	font-size: 16px;
	margin-right: -40px;
}
.grid-content {
	/deep/ .el-tabs__header {
		/*padding-right: 80px;*/
		.el-tabs__nav-next {
			margin-right: 80px;
		}
		.el-tabs__nav-scroll {
			margin-right: 80px;
		}
	}
	.clear-tab {
		position: absolute;
		width: 80px;
		border-left: 1px solid #e4e7ed;
		cursor: pointer;
		text-align: center;
		top: 0;
		right: 0;
		font-size: 14px;
		font-weight: 500;
		line-height: 40px;
		color: #303133;
		background: #fff;
		z-index: 999;
        >div{
            box-shadow: 0 0 3px rgba(86, 96, 117, .3);
            width: 120px;
            border: 1px solid rgba(0,0,0,.15);
            border-radius: 4px;
            right: 0;
            margin-top: -1px;
            top: 100%;
            z-index: 999;
            position: absolute;
            background: #fff;
            font-size: 12px;
            line-height: 30px;
            text-align: center;
            >:first-child{
                border-bottom: 1px solid #e6e6e6;
            }
            >div{
                &:hover {
                    color: #5881ff;
                }
            }
        }
		i {
			display: none;
		}
		&:hover i {
			display: inline-block;
		}
	}
}
</style>
