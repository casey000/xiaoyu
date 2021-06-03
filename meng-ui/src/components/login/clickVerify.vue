/** * 点选验证码*/
/**
  * event：on-success
    三个传值到父组件，{1、是否验证成功 true false/2、验证坐标[数组]/，3、验证码生成用的key string}
  */
<template>
	<div class="sf-code-warp" :class="{'sf-code-fail':sfcodefail,'sf-code-success':sfcodesuccess}" @mouseenter.stop="codeimgshow" @mouseleave.stop="codeimghide">
        <div v-show="!verifyPass" class="sf-code-panel" :class="{'sf-bgimg-show':isshow}">
            <div class="sf-panel-placeholder">
                <div class="sf-bgimg" id="sfcodeimg-box">
                    <img class="sf-bg-img" style="border-radius: 2px" :src="codeimg" @click.stop="add_canvas($event)">
                    <div v-if="!!pointgroup[index].m_clientX" v-for="(item,index) in pointgroup" :class="'point-group point-group-'+index" :style="'left:'+item.m_clientX+'px;top:'+item.m_clientY+'px'" :key="index"></div>
                    <div class="sf-code-loadbox" v-show="loadIsShow">
                        <div class="sf-code-loadbox-inner">
                            <div class="sf-code-loadicon"></div>
                            <span class="sf-code-loadtext">{{$t('userlogin.loading')}}</span>
                        </div>
                    </div>
                </div>
                <div class="sf-refresh" :title="$t('userlogin.refresh')" @click="refreshCode"></div>
            </div>
        </div>
        <div class="sf-code-control">
            <span class="sf-tips-icon"></span>
            <span class="sf-tips-text">{{codetxt}}</span>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
	export default {
		name: 'clickVerify',
		props: {
            'value': {
            type: Boolean,
            default: false
            }
        },
		data() {
			return {
				isshow:false,//验证码显示隐藏切换
				codeimg:'',//图片的base64
				codetxt:this.$t('userlogin.inGetting'),//验证码字符
				pointnum:1,//点击验证码标记数量
				codeLength:0,//验证码字符长度
				pointgroup:[{},{},{},{}],//点选的位子集合
				loadIsShow:true,//loading层的显示标识
				sfcodesuccess:false,//验证码验证失败标识
				sfcodefail:false,//验证码验证成功标识
				verifyPass:false,//验证码是否验证通过
                showvalue:0,
                coordinate:'',//坐标值集合字符串
                codekey:''
			}
		},
		watch: {
            value(value) {
                this.changeBySuccess(value)
            }
		},
		mounted() {
			this.getImg()//初始化获取验证码
		},
		methods: {
            codeimgshow(){
				this.isshow=true
				this.showvalue=1
			},
			codeimghide(){
				this.showvalue=0
				setTimeout(()=>{
					if(this.showvalue!=1){
						this.isshow=false
					}
				},100)	
            },
            getCodeImg(id){//获取验证码图片
				this.$httpExt().get('VerifyCode',{
					'id':id,
					'type':'pic'
				}).then(response => {
					this.sfcodefail=false
					this.sfcodesuccess=false
					let data = response.result
					this.codeimg='data:image/png;base64,'+data.pic
                    this.codetxt=`${this.$t('userlogin.turnClick')}“ ${data.chars.split("")} ”`
					this.codeLength=data.chars.length
					this.loadIsShow=false
				}, response => {
					this.sfcodefail=true
					this.sfcodesuccess=false
					this.codetxt=this.$t('userlogin.serverError')
				})
			},
			setCodekey(){//设置新的验证码cookie
				let myDate = new Date();
                this.codekey=this.$md5(''+myDate.getTime()+Math.floor(Math.random()*10000))
			},
			getImg(){//通过接口拿图片URL
				this.setCodekey()
				this.getCodeImg(this.codekey)
			},
			refreshCode(){//刷新验证码
				this.loadIsShow=true
				this.codetxt=this.$t('userlogin.inGetting')
				this.setCodekey()
				this.getCodeImg(this.codekey)
				this.pointgroup=[{},{},{},{}]
				this.pointnum=1
				this.coordinate=''
			},
			add_canvas(ev){//绘制验证码
				if(this.pointnum<=this.codeLength){
					let imgLeft=document.getElementById('sfcodeimg-box').getBoundingClientRect().left,
					imgTop=document.getElementById('sfcodeimg-box').getBoundingClientRect().top;
	   				let m_clientX = parseInt(ev.clientX-imgLeft),
	   　　　　 		m_clientY = parseInt(ev.clientY-imgTop);
	   				this.coordinate+=(m_clientX+'_'+m_clientY+',')
	   				Vue.set(this.pointgroup[this.pointnum-1],"m_clientX",m_clientX-13)
	   				Vue.set(this.pointgroup[this.pointnum-1],"m_clientY",m_clientY-33)
	  				this.pointnum++
	  				if(this.pointnum>this.codeLength){
	  					this.codetxt=this.$t('userlogin.verifiWait')
	  					this.coordinate=this.coordinate.slice(0,this.coordinate.length-1)
	  					this.verifyCode(this.codekey)
	  				}
				}
				
　　　　		},
            changeBySuccess(value) {
                if(value) {
                    this.verifyPass=true
                    this.sfcodesuccess=true
                    this.sfcodefail=false
					this.codetxt=this.$t('userlogin.authenticationSuccess')
                    this.$emit('input',true);
                }else {
                    this.verifyPass=false
					this.sfcodefail=true
					this.sfcodesuccess=false
                    this.codetxt=this.$t('userlogin.authenticationFailure')
                    this.refreshCode()
                    this.$emit('input',false);
                }
            },
            verifyCode(id){//验证验证码
                let params = {
                    reqid: this.codekey,
                    resultSet: this.coordinate
                }
				this.$httpExt().get('admin/verifyCode',{
					'reqid':id,
					'resultSet':this.coordinate
				}).then(response => {
					this.changeBySuccess(true)
                    this.$emit("on-success",params)
				}, response => {
					this.changeBySuccess(false)
					setTimeout(()=>{
						this.sfcodefail=false
					},1500)
				})
			},
		}
	}
</script>
<style type="text/css">
</style>