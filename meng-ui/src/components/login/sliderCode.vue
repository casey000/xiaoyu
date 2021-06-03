/** * 滑动验证码 sliderCode*/
/**
  * params: 
    "v-model",是否验证通过  boolean  true通过，false未通过，默认false
    "width",验证码宽度  number  默认250，单位px（当设置自定义值时，需要后台也做配置）
  * event：
    @on-success：function(obj)
    obj格式如下: {
      reqid: "0f15edb87026655efed50840242d67e1", 
      resultSet: 118, 
      time: 1540893150439}
    }
  */
<template>
  <div class="slider-code" :class="{'slide-success': formLogin.showSuccTip}" :style="'width:'+this.showCssWidth+'px'">
    <el-slider v-model="formLogin.code" :show-tooltip="false" @mousedown.native="handleMouseDown" @mouseup.native="handleMouseUp" @change="handleSliderChange"></el-slider>
    
    <div class="verify-code" v-show="showCodeImg" :style="'width:'+this.showCssWidth+'px'">
        <img :src="loginCodeBg" alt="验证码" class="verify-code-bg" ondragstart="return false;"/>
        <img :src="loginCodeImg" alt="验证码" class="verify-code-img" ref="imgcode" ondragstart="return false;"/>
    </div>
    <div class="slider-text" v-show="showSlideTip" v-html="$t('userlogin.slideTip')"></div>
    <div class="slider-text" v-show="formLogin.showSuccTip">{{$t('userlogin.verifySuccTip')}}</div>
  </div>
</template>

<script>
import { Message } from "element-ui";
export default {
  name: "sliderCode",
  props: {
    'value': {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLogin: {
        email: "",
        password: "",
        code: 0,
        showSuccTip: false
      },
      codeCookie: "",
      loginCodeBg: "",
      loginCodeImg: "",
      showCodeImg: false,
      showSlideTip: true,
      contrastWidth:280,//后台比对的容器宽度
      showCssWidth:250//用于CSS显示滑动图像的宽度
    };
  },
  computed: {
    formLoginCode(value) {
      return this.formLogin.code;
    }
  },
  watch: {
    formLoginCode(value) {
      this.$refs.imgcode.style.left = value * (this.contrastWidth/((this.contrastWidth/this.showCssWidth)*100)) + "px";//显示滑块的位子
    },
    value(value) {
        this.changeBySuccess(value)
    }
  },
  mounted() {
    this.changeBySuccess(this.value)
  },
  methods: {
      changeBySuccess(value) {
        if(value) {
            this.showCodeImg = false;
            this.showSlideTip = false;
            this.formLogin.showSuccTip = true;
            this.$emit('input',true);
        }else {
            this.showCodeImg = false;
            this.getCodeImg();
            this.$emit('input',false);
        }
      },
    handleMouseDown(ev) {
      //按下滑块
      this.showCodeImg = true;
      this.showSlideTip = false;

      //让输入框失焦（解决IE光标显示在验证码图片之上的问题）
      let inputs = document.querySelectorAll("input");
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].blur();
      }
    },
    handleMouseUp(ev) {
      //松开滑块
      this.showCodeImg = false;
      this.showSlideTip = true;
    },
    handleSliderChange() {
      //松开已滑动的滑块
      //验证验证码
      let params = {
          reqid: this.codeCookie,
          resultSet: Math.round(this.formLogin.code * (this.contrastWidth/100))//计算拼图滑块的实际滑动的位子
        }
      this.$httpExt()
        .get("admin/verifyCode", params)
        .then(
          response => {
            this.changeBySuccess(true)
            this.$emit('on-success',params)
          },
          response => {
            this.changeBySuccess(false)
          }
        );
    },
    getCodeImg() {
      //获取登录验证码图片
      this.$refs.imgcode.style.left = 0;
      this.formLogin.code = 0;
      this.showSlideTip = true;
      this.formLogin.showSuccTip = false;
      this.newCodeId();
      this.$httpExt()
        .get("/VerifyCode", {
          id: this.codeCookie,
          type: "pic"
        })
        .then(
          response => {
            let data = response.result;
            this.loginCodeBg = data.backgroundImage;
            this.contrastWidth=data.backgroundWidth
            this.loginCodeImg = data.sliderImage;
          },
          response => {
            this.$refs.imgcode.style.left = 0;
            this.formLogin.code = 0;
            this.showSlideTip = true;

            this.loginCodeBg = "";
            this.loginCodeImg = "";
            this.showCodeImg = false;
            Message({
              message: response.msg || this.$t("userlogin.serverError"),
              type: "info",
              center: true
            });
          }
        );
    },
    newCodeId() {
      //生成新的登录验证码cookie
      let myDate = new Date();
      this.codeCookie = this.$md5(
        "" + myDate.getTime() + Math.floor(Math.random() * 10000)
      );
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='less'>
.slider-code {
  position: relative;
  display: inline-block;
  // width: 250px;
  font-size: 14px;
  vertical-align: middle;
}
.verify-code {
  position: absolute;
  bottom: 47px;
  left: 0;
  z-index: 100;
  // width: 250px;
  height: 100px;
  overflow: hidden;
  .verify-code-bg {
    background-color: #fff;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 6px;
  }
  .verify-code-img {
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.slider-text {
  position: absolute;
  top: 0;
  left: 0;
  display: inline-block;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>
