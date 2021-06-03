<!--修改密码  -->
<template>
  <div>
      <el-dialog
        title="修改密码"
        visible
        width="30%"
        @close="cancel"
        center>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="原密码" prop="userPassword">
                <el-input type="password" v-model="ruleForm.userPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword" required>
                <el-input type="password" v-model="ruleForm.newPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="newPassword2" required>
                <el-input type="password" v-model="ruleForm.newPassword2" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
        </span>
        </el-dialog>
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }else if(!(value.length >= 6 && value.length <= 20)){
		    callback(new Error('请输入6-20个字符'));	
        } else {
          if (this.ruleForm.newPassword2 !== '') {
            this.$refs.ruleForm.validateField('newPassword2');
          }
          callback();
        }
      };
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
    };
    return {
        ruleForm:{
            userPassword:'',
            newPassword:'',
            newPassword2:"",
            pkid:"1",
            FunctionCode:"WS_SYS_ACCOUNT_EDITPWD"
        },
        rules:{
        userPassword:[{ required: true, message: '请输入原密码', trigger: 'blur' }],
        newPassword: [{ validator: validatePass, trigger: 'blur' }],
        newPassword2: [{ validator: validatePass2, trigger: 'blur' },],
        },
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
      cancel(){
          this.$emit("edit-close")
      },
      submitForm(formName){
        var url="api/v1/plugins/WS_SYS_ACCOUNT_EDITPWD";
         
        this.$refs[formName].validate((valid) => {
          if (valid) {
           this.$httpExt().post(url,this.ruleForm).then(jdata => {
				this.$message({
                    message: '恭喜你，密码修改成功',
                    type: 'success'
                });
                this.$emit("edit-save")
				}, response => {
					this.$notify.error({
						title: '异常',
						message: response.msg
					})
				})
          } else {
            return false;
          }
        });
    
          
      }

  }
}

</script>
<style scoped>
</style>